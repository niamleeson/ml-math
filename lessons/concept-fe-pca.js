/* Feature Engineering — Chapter 6,
   "Dimensionality Reduction: Squashing the Data Pancake with PCA".
   The FEATURE-ENGINEERING angle on PCA: PCA as a featurizer / dimensionality reducer.
   Self-contained: lesson + CODE + CODEVIZ merged by id "fe-pca". */
(function () {
  window.LESSONS.push({
    id: "fe-pca",
    title: "PCA as a featurizer: squashing the data pancake",
    tagline: "Find the few directions where the data spreads out the most, keep those, and drop the rest.",
    module: "Feature Engineering",
    prereqs: ["ml-pca", "la-svd", "fnd-eigen"],

    bigIdea:
      `<p>Imagine your data as a cloud of points in many dimensions. Often that cloud is shaped like a
       <b>pancake</b>: it is wide in a couple of directions and almost flat in all the others. If a
       direction is flat, the points barely differ along it &mdash; so that direction carries almost no
       information. You could <b>throw it away</b> and lose almost nothing.</p>
       <p><b>PCA (Principal Component Analysis)</b> is the recipe for finding those directions. It is
       Chapter 6 of Zheng &amp; Casari's <i>Feature Engineering for Machine Learning</i>, and in that book
       PCA is treated as a <b>featurizer</b>: a transform that takes your many raw columns and returns a
       handful of new ones. The new columns are called <b>principal components</b>. They are new axes,
       <b>ordered by how much the data spreads out</b> (its variance) along each. Keep the top few and you
       have squashed a high-dimensional pancake onto a low-dimensional plane &mdash; smaller, decorrelated,
       and still carrying most of the signal.</p>
       <p>"Variance" here just means <b>spread</b>: how far the points scatter from their average. A
       direction with high variance is one where the points are very different from each other &mdash; that
       is where the interesting structure lives. PCA ranks directions by spread and keeps the top ones.</p>
       <p>You have likely met PCA before as a <b>linear-algebra</b> object &mdash; the eigenvectors of a
       covariance matrix (see <code>ml-pca</code> and <code>fnd-eigen</code>), or the right singular vectors
       of the data matrix (see <code>la-svd</code>). This lesson keeps all that, but asks a different
       question: <i>when, and how, do I use PCA to build features for a model?</i></p>`,

    buildup:
      `<p>Here is the whole pipeline, one step at a time. Call the data matrix $X$: $n$ rows (examples) by
       $d$ columns (features).</p>
       <ol class="steps">
         <li><b>Standardize, then center.</b> PCA chases variance, and variance depends on the units. A
          column measured in dollars will dwarf one measured in fractions, purely because dollars are bigger
          numbers. So first put every column on the same footing &mdash; subtract its mean and divide by its
          standard deviation (this is <i>standardization</i>; see the scaling lesson). At minimum you must
          <b>center</b>: subtract each column's mean so the cloud sits at the origin. Centering matters
          because variance is measured <i>around the mean</i>.</li>
         <li><b>Build the covariance matrix.</b> The covariance matrix $\\Sigma$ is a $d\\times d$ table.
          Its diagonal holds each feature's variance; its off-diagonal entries say how strongly two features
          move together (their <b>covariance</b>). $\\Sigma=\\frac{1}{n}X_c^{\\top}X_c$, where $X_c$ is the
          centered data.</li>
         <li><b>Find the principal axes.</b> The principal components are the <b>eigenvectors</b> of
          $\\Sigma$ &mdash; the special directions that $\\Sigma$ merely stretches. Each comes with an
          <b>eigenvalue</b> $\\lambda$ equal to the variance of the data along that direction. (Equivalently,
          and more stably in practice, the components are the <b>right singular vectors</b> of $X_c$ from the
          SVD &mdash; same answer, no covariance matrix needed.)</li>
         <li><b>Sort by variance and keep the top $k$.</b> Order the eigenvectors from largest eigenvalue to
          smallest. The first, <b>PC1</b>, is the single direction of greatest spread; PC2 is the direction
          of greatest <i>remaining</i> spread that is at right angles (<b>orthogonal</b>) to PC1; and so on.
          Keep the top $k$ and discard the rest.</li>
         <li><b>Project.</b> Multiply the centered data by those $k$ kept directions to get $X_{\\text{pca}}$,
          an $n\\times k$ matrix &mdash; your new, smaller feature set. That is <code>pca.fit_transform(X)</code>.</li>
       </ol>
       <p>How big should $k$ be? Each component's <b>explained-variance ratio</b> is $\\lambda_i$ divided by
       the total variance &mdash; the fraction of the data's spread it captures. Add them up as you include
       more components and you get a rising <b>cumulative explained-variance curve</b>. Pick the smallest
       $k$ where the curve reaches a threshold you are happy with, often 90% or 95%.</p>`,

    symbols: [
      { sym: "$X$", desc: "the data matrix: $n$ rows (examples) by $d$ columns (original features)." },
      { sym: "$X_c$", desc: "the centered (and usually standardized) data &mdash; each column has its mean subtracted." },
      { sym: "$\\Sigma$", desc: "the $d\\times d$ covariance matrix, $\\frac{1}{n}X_c^{\\top}X_c$: diagonal = each feature's variance, off-diagonal = how features co-vary." },
      { sym: "$\\mathbf{w}_i$", desc: "the $i$-th principal component: a unit-length direction (eigenvector of $\\Sigma$). The new axes PCA gives you." },
      { sym: "$\\lambda_i$", desc: "the $i$-th eigenvalue = the variance of the data along $\\mathbf{w}_i$. Bigger $\\lambda_i$ = more spread = more information." },
      { sym: "$k$", desc: "the number of components you keep &mdash; the new (reduced) dimension." },
      { sym: "$X_{\\text{pca}}$", desc: "the projected data, $n\\times k$: the new feature matrix you feed downstream." },
      { sym: "$r_i$", desc: "explained-variance ratio of component $i$: $\\lambda_i/\\sum_j\\lambda_j$, the fraction of total spread it captures (sklearn's <code>explained_variance_ratio_</code>)." }
    ],

    formula:
      `$$ \\Sigma=\\tfrac{1}{n}X_c^{\\top}X_c=W\\,\\Lambda\\,W^{\\top},\\qquad
         X_{\\text{pca}}=X_c\\,W_{[:,\\,1:k]},\\qquad
         r_i=\\frac{\\lambda_i}{\\sum_{j=1}^{d}\\lambda_j} $$`,

    whatItDoes:
      `<p>The first equation is the <b>eigendecomposition</b> of the covariance matrix: $W$ is the matrix
       whose columns are the principal components $\\mathbf{w}_i$, and $\\Lambda$ is the diagonal matrix of
       their variances $\\lambda_i$. It says: $\\Sigma$ is fully described by a set of orthogonal directions
       and how much variance sits along each.</p>
       <p>The second equation is the <b>featurization</b>: project the centered data onto the top $k$
       directions to get the new, smaller feature matrix. A high-dimensional point becomes a short list of
       coordinates &mdash; "how far along PC1, how far along PC2, ...".</p>
       <p>The third equation is your <b>knob for choosing $k$</b>: each $r_i$ is the slice of total spread
       captured by component $i$, and the running sum tells you how much you keep as you add components.</p>`,

    derivation:
      `<p><b>Why "maximize variance" lands you on the eigenvectors.</b></p>
       <ul class="steps">
         <li>Ask for the single direction that spreads the data out the most. Write a candidate direction as
          a unit vector $\\mathbf{w}$ (length 1, so we are choosing a <i>direction</i>, not a scale). The
          spread of the centered data projected onto $\\mathbf{w}$ is $\\mathbf{w}^{\\top}\\Sigma\\,\\mathbf{w}$.</li>
         <li>Maximize $\\mathbf{w}^{\\top}\\Sigma\\,\\mathbf{w}$ subject to $\\mathbf{w}^{\\top}\\mathbf{w}=1$.
          Lagrange multipliers turn this into $\\Sigma\\,\\mathbf{w}=\\lambda\\,\\mathbf{w}$ &mdash; the
          eigenvector equation. So the variance-maximizing direction <i>is</i> an eigenvector of $\\Sigma$,
          and the variance it captures is its eigenvalue $\\lambda$.</li>
         <li>The biggest eigenvalue gives PC1. For PC2, repeat the search but require orthogonality to PC1;
          you get the eigenvector with the second-largest eigenvalue. Continue, and the principal components
          come out as the eigenvectors of $\\Sigma$ ranked by eigenvalue. This is the squashing rule: keep
          the top few, drop the flat rest.</li>
         <li><b>The SVD shortcut.</b> The Singular Value Decomposition writes $X_c=U S V^{\\top}$. The right
          singular vectors (columns of $V$) are exactly the principal components, and the squared singular
          values relate to the variances: $\\lambda_i=s_i^2/n$. So you never have to form $\\Sigma$ &mdash;
          run the SVD on the centered data directly. It is faster and numerically steadier, which is why
          scikit-learn's <code>PCA</code> uses the SVD under the hood (see <code>la-svd</code>). $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>A tiny two-feature example to see the pancake squash. A fitness app logs, for 5 users,
       <b>steps</b> (in thousands) and <b>calories</b> (in hundreds). The two are highly correlated &mdash;
       more steps means more calories &mdash; so the cloud is a thin diagonal pancake.</p>
       <table class="extable">
         <caption>5 users; we center each column by subtracting its mean.</caption>
         <thead><tr><th>user</th><th class="num">steps $x_1$</th><th class="num">cal $x_2$</th><th class="num">$x_1-\\bar{x}_1$</th><th class="num">$x_2-\\bar{x}_2$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">A</td><td class="num">2</td><td class="num">3</td><td class="num">-4</td><td class="num">-4</td></tr>
           <tr><td class="row-h">B</td><td class="num">4</td><td class="num">5</td><td class="num">-2</td><td class="num">-2</td></tr>
           <tr><td class="row-h">C</td><td class="num">6</td><td class="num">7</td><td class="num">0</td><td class="num">0</td></tr>
           <tr><td class="row-h">D</td><td class="num">8</td><td class="num">9</td><td class="num">+2</td><td class="num">+2</td></tr>
           <tr><td class="row-h">E</td><td class="num">10</td><td class="num">11</td><td class="num">+4</td><td class="num">+4</td></tr>
           <tr><td class="row-h">mean</td><td class="num">6</td><td class="num">7</td><td class="num">0</td><td class="num">0</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Center.</b> Means are $\\bar{x}_1=(2+4+6+8+10)/5=6$ and $\\bar{x}_2=(3+5+7+9+11)/5=7$.
          Subtract them (last two columns above).</li>
         <li><b>Covariance, diagonal.</b> $\\Sigma_{11}=\\tfrac{1}{5}\\sum(x_1-\\bar{x}_1)^2
          =\\tfrac{1}{5}(16+4+0+4+16)=\\tfrac{40}{5}=8$. By symmetry $\\Sigma_{22}=8$.</li>
         <li><b>Covariance, off-diagonal.</b> $\\Sigma_{12}=\\tfrac{1}{5}\\sum(x_1-\\bar{x}_1)(x_2-\\bar{x}_2)
          =\\tfrac{1}{5}(16+4+0+4+16)=8$ &mdash; here the two columns move together exactly, so
          $\\Sigma=\\begin{bmatrix}8 & 8\\\\ 8 & 8\\end{bmatrix}$.</li>
         <li><b>Eigen.</b> For $\\begin{bmatrix}8 & 8\\\\ 8 & 8\\end{bmatrix}$ the eigenvalues are
          $\\lambda_1=8+8=16$ (direction $\\mathbf{w}_1\\propto[1,1]$) and $\\lambda_2=8-8=0$
          (across it, $\\mathbf{w}_2\\propto[1,-1]$).</li>
         <li><b>Explained variance.</b> $r_1=\\lambda_1/(\\lambda_1+\\lambda_2)=16/(16+0)=\\mathbf{1.00}$.
          PC1 captures 100% of the spread; PC2 captures $0/16=0$.</li>
         <li><b>Squash.</b> Keep only PC1. The five 2-D points collapse onto one line with <b>zero</b> loss:
          two perfectly correlated columns became <b>one</b> feature (roughly "total activity").</li>
       </ul>
       <p>That is PCA as a featurizer in miniature. With real, noisier data the off-diagonal is a little
       below the diagonal, so $\\lambda_2$ is small but nonzero &mdash; e.g.
       $\\Sigma=\\begin{bmatrix}8 & 7.2\\\\ 7.2 & 8\\end{bmatrix}$ gives
       $\\lambda_1=15.2,\\ \\lambda_2=0.8$ and $r_1=15.2/16=0.95$: still squash to one feature, losing 5%.</p>`,

    whenToUse:
      `<p>Reach for PCA when you have <b>many continuous features</b> and want fewer, cleaner ones.</p>
       <ul>
         <li><b>Decorrelate / compress redundant features.</b> When features are tangled together (steps and
          calories, height and weight, many sensor readings), PCA returns <b>orthogonal</b> components that
          are uncorrelated by construction &mdash; a smaller set with the redundancy removed.</li>
         <li><b>Denoise.</b> Random noise tends to spread its (small) variance across all the low-ranked
          directions. Dropping those low-variance components throws away mostly noise and keeps the
          structured signal.</li>
         <li><b>Visualize.</b> Project to $k=2$ or $3$ and plot. This is the standard way to <i>look</i> at
          high-dimensional data &mdash; e.g. the book and the demo here project 64-dimensional MNIST-like
          digits down to a 2-D scatter and watch the digit classes separate.</li>
         <li><b>Speed up / regularize downstream models.</b> Fewer input columns means faster training and
          fewer weights to overfit. PCA is a common preprocessing step before a linear model, k-means, or a
          nearest-neighbor search.</li>
         <li><b>As a featurization step in a pipeline.</b> Fit PCA on the training set, then transform train
          and test alike &mdash; PCA slots in like any other scikit-learn transformer.</li>
       </ul>
       <p><b>When NOT to:</b> if the structure that matters is <b>nonlinear</b> (a curved "Swiss roll"
       manifold), if you need <b>interpretable</b> features, or if your task is supervised and the useful
       signal sits in a <b>low-variance</b> direction &mdash; see the pitfalls.</p>`,

    application:
      `<p>Where PCA-as-a-featurizer shows up in real pipelines, following the book's Chapter 6 examples.</p>
       <ul>
         <li><b>Images (the book's MNIST-like digits).</b> Each handwritten digit is a grid of pixels &mdash;
          dozens or hundreds of correlated features. PCA compresses them to a few dozen components that retain
          most of the variance, shrinking the input before a classifier and enabling a 2-D scatter of the
          digit classes.</li>
         <li><b>The Swiss roll (the book's cautionary example).</b> A 2-D sheet rolled up in 3-D. PCA, being
          linear, sees a blob and cannot unroll it &mdash; the chapter uses this to motivate <i>nonlinear</i>
          methods. It is the canonical "PCA fails here" picture.</li>
         <li><b>Whitening as preprocessing.</b> With <code>whiten=True</code> PCA rescales each component to
          unit variance, producing decorrelated, equal-scale features &mdash; handy as input to models that
          assume isotropic (round, equal-spread) inputs.</li>
         <li><b>Dense featurization.</b> PCA turns a wide, redundant, correlated feature block into a compact,
          decorrelated one that downstream learners handle faster and with less overfitting.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>You MUST standardize first &mdash; PCA is scale-sensitive.</b> Because PCA maximizes
          variance, a feature in big units (income in dollars) will hijack the top component over a feature
          in small units (a 0&ndash;1 ratio), no matter which is more informative. The fix: standardize every
          feature to zero mean and unit variance (<code>StandardScaler</code>) before PCA. See the scaling
          lesson.</li>
         <li><b>Linear only &mdash; it fails on nonlinear manifolds.</b> PCA can only rotate and project; it
          cannot unroll a curved structure like the <b>Swiss roll</b>. For nonlinear structure use
          <b>kernel PCA</b>, <b>t-SNE</b> / UMAP (for visualization), or an <b>autoencoder</b>.</li>
         <li><b>Components are hard to interpret.</b> A principal component is a weighted blend of <i>all</i>
          the original features, so "PC1" usually has no clean meaning. If interpretability matters, prefer
          feature selection (keep real columns) over PCA.</li>
         <li><b>Fit on train only.</b> The mean, the scaling, and the components are <b>learned from data</b>.
          Fit PCA (and the scaler) on the <b>training set only</b> and reuse them on validation/test/
          production. Fitting on all the data leaks test information &mdash; the same leakage trap as quantile
          binning.</li>
         <li><b>It can drop class-discriminative low-variance directions.</b> PCA is <b>unsupervised</b>: it
          ranks directions by spread, ignoring labels. The signal that separates your classes might live in a
          <i>low</i>-variance direction that PCA discards. If so, use a supervised reducer like <b>LDA</b>
          (Linear Discriminant Analysis), or validate that accuracy survives the reduction.</li>
       </ul>`,

    practice: [
      {
        q: `You run PCA on a table with <code>age</code> (years, 18&ndash;90) and <code>income</code> (dollars, up to 200,000) without scaling. PC1 turns out to be essentially just income. Why, and what is the fix?`,
        steps: [
          { do: `Recall that PCA picks directions that maximize variance, measured in the raw units.`, why: `Income in dollars has variance in the billions; age in years has variance in the hundreds.` },
          { do: `See that income's huge numeric spread dominates, so PC1 aligns with income regardless of which feature carries more signal.`, why: `PCA is comparing raw spreads, not importance &mdash; it is fooled by units.` },
          { do: `Standardize every column to zero mean and unit variance before PCA (<code>StandardScaler</code>).`, why: `Now each feature contributes spread on the same scale, so PCA ranks directions by real structure, not by unit size.` }
        ],
        answer: `<p>PCA maximizes variance in the <b>raw units</b>, and income's dollar-scale variance is astronomically larger than age's, so PC1 collapses onto income. The fix is to <b>standardize</b> (zero mean, unit variance) every feature first; PCA is scale-sensitive, so standardization is mandatory before applying it.</p>`
      },
      {
        q: `On <code>load_digits</code> (64 pixel features), the cumulative explained-variance curve reaches 0.95 at about 28 components. How do you use this to choose $k$, and what did you gain?`,
        steps: [
          { do: `Read the cumulative curve: it sums <code>explained_variance_ratio_</code> as you add components.`, why: `The value at $k$ is the fraction of total variance the top $k$ components keep.` },
          { do: `Pick the smallest $k$ whose cumulative variance meets your threshold &mdash; here $k\\approx 28$ for 95%.`, why: `That is the elbow of "enough signal kept" against "as few features as possible".` },
          { do: `Replace the 64 raw pixels with these 28 components as the model's input.`, why: `Fewer than half the features, yet 95% of the spread retained &mdash; faster training, less overfitting, decorrelated inputs.` }
        ],
        answer: `<p>Plot the <b>cumulative explained-variance curve</b> and take the smallest $k$ that clears your threshold &mdash; about <b>28 components for 95%</b> on the digits. You compress 64 correlated pixels to 28 orthogonal features, keeping 95% of the variance while cutting the dimension by more than half: faster, leaner, decorrelated input for the downstream model.</p>`
      },
      {
        q: `A classifier on the raw features beats the same classifier on PCA-reduced features, even though PCA kept 99% of the variance. What unsupervised blind spot of PCA could explain this?`,
        steps: [
          { do: `Recall PCA is unsupervised &mdash; it ranks directions by variance, never looking at the labels.`, why: `The directions it keeps are the ones with the most spread, not the ones that separate the classes.` },
          { do: `Notice the class-separating signal might lie in a low-variance direction that PCA discarded.`, why: `That 1% of variance PCA threw away could be exactly the direction that tells the classes apart.` },
          { do: `Switch to a supervised reducer (LDA) or skip reduction, and validate accuracy against the raw-feature baseline.`, why: `LDA chooses directions that maximize class separation; validation confirms the reduction did not drop the useful signal.` }
        ],
        answer: `<p>PCA is <b>unsupervised</b>: it keeps high-variance directions and ignores the labels. The class-discriminative signal can sit in a <b>low-variance</b> direction that PCA discarded, so "99% of variance kept" does not guarantee "99% of the useful-for-classification signal kept". Use a supervised reducer like <b>LDA</b>, or validate the reduction against the raw-feature baseline before trusting it.</p>`
      }
    ]
  });

  window.CODE["fe-pca"] = {
    lib: "scikit-learn + numpy",
    runnable: false,
    explain: `<p>The chapter's PCA-as-featurizer workflow in scikit-learn, on the MNIST-like digit images the
      book uses. The non-negotiable first step is <b>standardization</b> (<code>StandardScaler</code>) &mdash;
      PCA chases variance, so unscaled features distort the components. Then <code>PCA(n_components=...)</code>
      and <code>pca.fit_transform(X)</code> give the reduced feature matrix; <code>explained_variance_ratio_</code>
      drives the choice of how many components to keep; and <code>whiten=True</code> rescales the components to
      unit variance. Datasets and notebooks are in the book's repo
      (github.com/alicezheng/feature-engineering-book); <code>load_digits</code> is bundled with scikit-learn,
      so the digits part runs as-is.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split

# --- MNIST-like handwritten digits: 8x8 images flattened to 64 pixel features ---
# (Chapter 6 uses image data; load_digits ships with scikit-learn.)
X, y = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=0)

# === Step 1: STANDARDIZE first (PCA is scale-sensitive) ===
# Fit the scaler on TRAIN ONLY, then reuse it -- no leakage.
scaler = StandardScaler().fit(X_train)
X_train_std = scaler.transform(X_train)
X_test_std = scaler.transform(X_test)

# === Step 2: choose how many components from the explained-variance curve ===
pca_full = PCA().fit(X_train_std)
cum = np.cumsum(pca_full.explained_variance_ratio_)
k95 = int(np.argmax(cum >= 0.95)) + 1
print('components to reach 95%% variance:', k95)   # ~28 on the digits
print('PC1 / PC2 ratio:', pca_full.explained_variance_ratio_[:2])

# === Step 3: PCA as a featurizer -- fit_transform to the reduced matrix ===
pca = PCA(n_components=k95)
X_train_pca = pca.fit_transform(X_train_std)        # n_train x k feature matrix
X_test_pca = pca.transform(X_test_std)              # apply the SAME components
print('reduced shape:', X_train_pca.shape)          # (1347, ~28) from 64

# === Whitening: decorrelated, unit-variance components ===
pca_white = PCA(n_components=k95, whiten=True)
X_train_white = pca_white.fit_transform(X_train_std)

# === Project to 2-D just to VISUALIZE the digit classes ===
X_2d = PCA(n_components=2).fit_transform(X_train_std)
# scatter X_2d colored by y_train -> the 0..9 classes pull apart`
  };

  window.CODEVIZ["fe-pca"] = {
    question: "How do you read a cumulative explained-variance curve to decide how far to squash the pancake -- and what does the curve look like when the data does NOT compress?",
    charts: [
      {
        type: "line",
        title: "Compressible data: curve bends early, 95% by k=28 (load_digits, 64-dim)",
        xlabel: "number of components k",
        ylabel: "cumulative explained-variance ratio",
        series: [
          {
            name: "cumulative variance kept",
            color: "#7ee787",
            points: [
              [0, 0.0], [1, 0.149], [2, 0.285], [3, 0.403], [5, 0.545],
              [8, 0.674], [10, 0.738], [13, 0.803], [15, 0.835], [20, 0.894],
              [25, 0.933], [28, 0.95], [30, 0.959], [40, 0.988], [50, 1.0], [64, 1.0]
            ]
          },
          {
            name: "95% threshold",
            color: "#ff7b72",
            points: [[0, 0.95], [64, 0.95]]
          }
        ],
        interpret: "<b>This is the healthy, ideal case.</b> The x-axis is how many components you keep; the y-axis is the running fraction of total spread (variance) those components capture. Read it left to right: the curve shoots up steeply then flattens into a knee, meaning the first few directions carry most of the spread and the rest are nearly flat. To pick k, slide right until the green curve crosses your red threshold -- here 95% is reached at <b>k=28</b>. Conclusion: 64 correlated pixels squash to ~28 orthogonal features with almost no loss. Real numbers from scikit-learn's standardized load_digits."
      },
      {
        type: "line",
        title: "Incompressible data: near-diagonal line, no good cut (illustrative)",
        xlabel: "number of components k",
        ylabel: "cumulative explained-variance ratio",
        series: [
          {
            name: "cumulative variance kept",
            color: "#ff7b72",
            points: [
              [0, 0.0], [8, 0.13], [16, 0.26], [24, 0.39], [32, 0.51],
              [40, 0.64], [48, 0.77], [56, 0.89], [64, 1.0]
            ]
          },
          {
            name: "95% threshold",
            color: "#9aa7b4",
            points: [[0, 0.95], [64, 0.95]]
          }
        ],
        interpret: "<b>Illustrative failure mode: there is no knee.</b> The curve climbs in a near-straight diagonal, so every component adds about the same slice of variance. That means the directions are all roughly equally spread -- the data is NOT a thin pancake, it is a round ball (think near-isotropic noise, or already-decorrelated features). To hit 95% you would need almost all the components, so PCA buys you almost no compression. Recognise it by the missing elbow: if the line is straight, do not bother reducing -- you would throw away real signal for little dimension savings."
      },
      {
        type: "line",
        title: "One dominant direction: curve jumps to ~1.0 at k=1 (illustrative)",
        xlabel: "number of components k",
        ylabel: "cumulative explained-variance ratio",
        series: [
          {
            name: "cumulative variance kept",
            color: "#ffb454",
            points: [
              [0, 0.0], [1, 0.97], [2, 0.985], [3, 0.991], [5, 0.996],
              [10, 0.999], [20, 1.0], [64, 1.0]
            ]
          },
          {
            name: "95% threshold",
            color: "#9aa7b4",
            points: [[0, 0.95], [64, 0.95]]
          }
        ],
        interpret: "<b>Illustrative degenerate case: one component eats everything.</b> The curve leaps almost to 1.0 at k=1 and is flat after. PC1 alone captures ~97% of the spread, so a single direction explains nearly all the data. This usually means your features are highly redundant (e.g. duplicated or near-collinear columns -- steps and calories that move together). Reading it: you can squash to k=1, but also treat it as a warning to check why one direction dominates, since it can signal a leaking ID column or a near-constant feature set rather than genuine rich structure."
      }
    ],
    caption: "How to read a cumulative explained-variance (scree) curve: x = components kept, y = fraction of total spread retained. The healthy curve (green) has a sharp knee and crosses 95% early (k=28 on real load_digits). The two illustrative variants show what failure looks like: a straight diagonal means the data will not compress, and an instant jump to 1.0 means a single redundant direction dominates.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

X = load_digits().data                               # 1797 x 64 pixel features
X_std = StandardScaler().fit_transform(X)            # standardize: PCA is scale-sensitive

pca = PCA().fit(X_std)                               # all 64 components
cum = np.cumsum(pca.explained_variance_ratio_)       # cumulative variance kept

k95 = int(np.argmax(cum >= 0.95)) + 1
print('components for 95%% variance:', k95)          # -> ~28
for k in [1, 2, 3, 5, 10, 20, 28, 40]:
    print(f'k={k:>2}  cumulative variance = {cum[k-1]:.3f}')
# k= 1  cumulative variance = 0.149
# k= 2  cumulative variance = 0.285
# k= 3  cumulative variance = 0.403
# k= 5  cumulative variance = 0.545
# k=10  cumulative variance = 0.738
# k=20  cumulative variance = 0.894
# k=28  cumulative variance = 0.950
# k=40  cumulative variance = 0.988`
  };
})();
