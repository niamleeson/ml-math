/* Paper lesson — Least squares quantization in PCM (Stuart P. Lloyd, IEEE Trans. Information Theory, 1982;
   work done at Bell Labs in 1957). Grounded from the IEEE citation + the algorithm's standard statement:
   the within-cluster sum-of-squares (distortion) objective, Lloyd's two optimality conditions
   (nearest-neighbor / centroid), and the alternating assign/update procedure (the modern "k-means").
   Track A (primitive, NumPy): build Lloyd's k-means from scratch and verify it matches
   sklearn.cluster.KMeans inertia + labels on a toy 2-D set, showing the distortion decreasing monotonically.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-kmeans". */
(function () {
  window.LESSONS.push({
    id: "paper-kmeans",
    title: "k-means (Lloyd) — Least squares quantization in PCM (1982)",
    tagline: "Alternate two simple steps — snap each point to its nearest center, move each center to the mean of its points — and a clustering's total squared error can only fall.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Stuart P. Lloyd",
      org: "Bell Telephone Laboratories",
      year: 1982,
      venue: "IEEE Transactions on Information Theory, vol. 28, no. 2, pp. 129–137 (work done 1957; published 1982)",
      citations: "",
      arxiv: "",
      url: "https://ieeexplore.ieee.org/document/1056489",
      code: ""
    },

    conceptLink: "ml-kmeans",
    partOf: [],
    prereqs: ["ml-kmeans", "fnd-vector", "fnd-norm"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Lloyd was solving a <b>quantization</b> problem in <b>PCM</b> (pulse-code modulation):
       you transmit a continuous signal by replacing each sampled value with the nearest of a small, fixed set
       of <b>representative levels</b> (the "quantizer"), then sending only which level you picked. Fewer levels
       means fewer bits, but the rounding introduces error. The question: <i>where should the levels sit, and
       which inputs should map to which level, to make the average squared rounding error as small as
       possible?</i></p>
       <p><b>What was broken.</b> The obvious choice — evenly spaced levels — is wasteful: it spends just as
       much resolution on rare values as on common ones. Lloyd asked for the levels and the input-to-level
       assignment that <b>jointly minimize the mean squared quantization error</b> for a given input
       distribution. That same problem, with multi-dimensional points instead of 1-D signal samples and
       "cluster centers" instead of "levels," is exactly <b>clustering</b>: this paper is the origin of the
       algorithm we now call <b>k-means</b> (the name came later; Lloyd never used it).</p>`,

    contribution:
      `<p>Lloyd characterized the optimal quantizer by two conditions that must <i>both</i> hold at an optimum,
       and gave an iterative method that enforces them in turn:</p>
       <ul>
         <li><b>Nearest-neighbor condition (the assignment).</b> Given the levels (centers), each input must map
         to its <b>nearest</b> center. Any other assignment raises the squared error.</li>
         <li><b>Centroid condition (the update).</b> Given the assignment, each level must sit at the
         <b>mean (centroid)</b> of the inputs assigned to it. The mean is the single point that minimizes the
         sum of squared distances to a set of points.</li>
         <li><b>The alternating algorithm.</b> Start with some centers, then repeat: <i>assign</i> every point to
         its nearest center, <i>update</i> every center to the mean of its assigned points. Each step satisfies one
         condition without breaking the objective, so the total squared error <b>never increases</b> and the
         procedure converges.</li>
       </ul>`,

    whyItMattered:
      `<p>This is the workhorse clustering algorithm of machine learning. Under the name <b>k-means</b> (and as
       <b>Lloyd's algorithm</b>) it is the default for vector quantization, image color reduction, document and
       customer clustering, and as a building block inside more elaborate methods. Its successors fix its known
       weaknesses while keeping the two-step core: <b>k-means++</b> (2007) picks smarter starting centers so it
       lands in better local optima; <b>mini-batch k-means</b> scales it to millions of points;
       <b>Gaussian mixture models</b> via the EM algorithm generalize the hard nearest-center assignment to a
       soft, probabilistic one. <code>sklearn.cluster.KMeans</code> is Lloyd's algorithm with a good
       initializer.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>This is a short, classic paper. Read for the two conditions, not heavy proofs:</p>
       <ul>
         <li><b>The problem statement</b> — minimizing mean squared quantization error for a given input
         distribution; note that the answer is allowed to use unequal level spacing.</li>
         <li><b>The two optimality conditions</b> — the nearest-neighbor rule for the assignment and the
         centroid rule for the levels. These are the whole idea; everything else follows.</li>
         <li><b>The iterative ("Method I") construction</b> — alternate the two conditions until the levels stop
         moving. This is the loop you will implement.</li>
       </ul>
       <p><b>Skim:</b> the continuous-distribution analysis (integrals over densities). In machine learning we
       replace the integral over a density by a sum over a finite dataset, which turns the centroid into a
       plain arithmetic mean.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will run the assign/update loop on a toy set of points that clearly
       form three blobs. Two predictions: (1) As the loop runs, does the total within-cluster squared error
       (the <b>distortion</b>) only ever go <i>down</i>, step after step, until it flattens? (2) If you write the
       loop from scratch and compare it to <code>sklearn.cluster.KMeans</code> started from the <i>same</i>
       centers, will your final error (inertia) and your point-to-cluster assignment match theirs <i>exactly</i>?
       Write your guesses, then check the worked example and CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_kmeans(X, k, init)</code> in NumPy that takes data
       <code>X</code> (shape <code>n×d</code>), the number of clusters <code>k</code>, and starting centers
       <code>init</code> (shape <code>k×d</code>). Loop:</p>
       <ul>
         <li><code># TODO: D = squared distance from every point to every center</code> — shape <code>n×k</code>.</li>
         <li><code># TODO: labels = D.argmin(axis=1)</code> — assign each point to its nearest center (nearest-neighbor condition).</li>
         <li><code># TODO: distortion = D[arange(n), labels].sum()</code> — record it; it should not increase.</li>
         <li><code># TODO: new_centers[j] = X[labels==j].mean(axis=0)</code> — move each center to its cluster's mean (centroid condition).</li>
         <li><code># TODO: stop when the centers stop moving.</code></li>
       </ul>
       <p>The CODE cell is the full reference, including the
       <code>np.allclose(my_inertia, KMeans(...).inertia_)</code> check and the label-match check — those passing
       are the proof your loop IS sklearn's k-means.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>You have $n$ data points and want to summarize them with $k$ centers, so that every point is close to
       its center. "Close" means <b>squared Euclidean distance</b> (the sum of squared coordinate differences).
       The quantity we minimize is the <b>distortion</b> $J$ — the total squared distance from each point to the
       center it is assigned to. Lloyd's two conditions each minimize $J$ over one variable while holding the
       other fixed:</p>
       <ol>
         <li><b>Assignment step (nearest-neighbor condition).</b> Hold the centers $\\mu_1,\\dots,\\mu_k$ fixed.
         For each point $x$, its contribution to $J$ is $\\lVert x-\\mu_{c}\\rVert^2$ where $c$ is its assigned
         center. That term is smallest when $c$ is the <b>nearest</b> center. So: assign every point to its
         nearest center. This can only lower (or keep) $J$, because each point independently picks its smallest
         possible term.</li>
         <li><b>Update step (centroid condition).</b> Now hold the assignment fixed. For a single cluster $S_i$,
         the part of $J$ it owns is $\\sum_{x\\in S_i}\\lVert x-\\mu_i\\rVert^2$. As a function of $\\mu_i$ this is
         a sum of parabolas; its minimizer is the <b>mean</b> of the points in $S_i$,
         $\\mu_i=\\frac{1}{|S_i|}\\sum_{x\\in S_i}x$. So: move each center to the average of its assigned points.
         This can only lower (or keep) $J$.</li>
         <li><b>Repeat.</b> Alternate the two steps. Since each step never increases $J$ and $J\\ge 0$, the
         sequence of distortions is non-increasing and bounded below, so it converges. There are only finitely
         many ways to partition $n$ points into $k$ groups, so the loop reaches a fixed point in finite time.</li>
       </ol>
       <p><b>The catch.</b> Convergence is to a <b>local</b> minimum, not necessarily the global one. A bad set of
       starting centers can trap the loop in a poor partition. That is why the starting centers matter — the
       ablation below shows random starts landing in much worse optima than the smarter <b>k-means++</b> starts.</p>`,

    architecture:
      `<p>k-means is not a network &mdash; its "architecture" is Lloyd's <b>per-iteration loop</b> (the paper's
       <b>Method I</b>), an alternating-minimization procedure over two blocks of variables: the assignment
       $\\{S_i\\}$ and the centers $\\{\\mu_i\\}$. State carried across iterations is just the $k\\times d$ matrix of
       centers; everything else is recomputed each pass.</p>
       <p><b>Inputs.</b> Data $X$ ($n$ points in $d$ dimensions), the cluster count $k$, and $k$ initial centers.</p>
       <p><b>Data flow of one iteration</b> (centers in &rarr; lower-distortion centers out):</p>
       <ol>
         <li><b>Distance block.</b> Compute the $n\\times k$ matrix of squared distances $\\lVert x-\\mu_i\\rVert^2$
         from every point to every center. (In code: broadcast $X$ against the centers and square-sum over the
         $d$ coordinate axis.)</li>
         <li><b>Assignment block (nearest-neighbor condition).</b> Take the row-wise $\\arg\\min$ of that matrix to
         get each point's label $c(x)$; this partitions the data into clusters $S_1,\\dots,S_k$ &mdash; the
         <b>Voronoi cells</b> of the current centers. Reading off the chosen distances and summing gives the
         current distortion $J$.</li>
         <li><b>Update block (centroid condition).</b> For each cluster, average its assigned points to get the
         new center $\\mu_i=\\text{mean}(S_i)$. Empty clusters carry their old center forward (or are re-seeded).</li>
         <li><b>Convergence gate.</b> If the centers moved by less than a tolerance (equivalently, the assignment
         stopped changing), halt; otherwise feed the new centers back into the distance block.</li>
       </ol>
       <p><b>Outer wrapper (the practical algorithm).</b> Because the loop only finds a <i>local</i> minimum,
       production k-means wraps it in a restart loop: run from several initializations (a good one is
       <b>k-means++</b>, which spreads the seeds out) and keep the run with the lowest final $J$. This is exactly
       scikit-learn's <code>n_init</code> &times; <code>max_iter</code> structure.</p>
       <p><b>Outputs.</b> The final centers $\\{\\mu_i\\}$, the labels $c(x)$, and the converged distortion $J$
       (scikit-learn's <code>inertia_</code>).</p>`,

    symbols: [
      { sym: "$n$", desc: "the number of data points." },
      { sym: "$k$", desc: "the number of clusters / centers you ask for — a value you choose in advance." },
      { sym: "$x$", desc: "one data point: a vector of $d$ numbers (here $d=2$, a point in the plane)." },
      { sym: "$S_i$", desc: "cluster $i$: the set of data points currently assigned to center $i$. The clusters $S_1,\\dots,S_k$ partition the data (every point is in exactly one)." },
      { sym: "$|S_i|$", desc: "the number of points in cluster $i$ (its size)." },
      { sym: "$\\mu_i$", desc: "mu-i: the center (centroid) of cluster $i$ — a vector, set to the mean of the points in $S_i$." },
      { sym: "$\\lVert x-\\mu_i\\rVert^2$", desc: "squared Euclidean distance from point $x$ to center $\\mu_i$: the sum of squared differences in each coordinate. The double bars are the L2 norm (ordinary straight-line length)." },
      { sym: "$J$", desc: "the distortion (also: within-cluster sum of squares, WCSS, or sklearn's 'inertia'): the total squared distance from every point to its assigned center. This is what k-means minimizes." },
      { sym: "$J^{(t)}$", desc: "the value of the distortion $J$ at iteration $t$. The convergence claim is $J^{(t+1)}\\le J^{(t)}$ — it never goes up from one pass to the next." },
      { sym: "$c(x)$", desc: "the assignment function: the index $i$ of the cluster that point $x$ is currently assigned to (its nearest center). The assign step sets $c(x)=\\arg\\min_i\\lVert x-\\mu_i\\rVert^2$." },
      { sym: "$D$", desc: "Lloyd's original 1-D quantization distortion — the mean squared error between the signal and its quantized value, averaged over the input density. The multi-point, multi-dimensional version of $D$ is $J$." },
      { sym: "$q_n$", desc: "in Lloyd's PCM setup, the $n$-th output level (quantum) — the single value every input in region $R_n$ is rounded to. It plays the role of a center $\\mu_i$." },
      { sym: "$R_n$", desc: "the $n$-th quantization region: the set of input amplitudes mapped to level $q_n$. It plays the role of a cluster $S_i$." },
      { sym: "$p(x)$", desc: "the probability density of the input signal's amplitude in Lloyd's continuous formulation. Replacing the integral $\\int(\\cdot)\\,p(x)\\,dx$ by a sum over a finite dataset turns Lloyd's quantizer into k-means." },
      { sym: "$\\arg\\min$", desc: "'the argument that minimizes' — the choice of clusters/centers that makes the quantity smallest, not the smallest value itself." },
      { sym: "centroid", desc: "the mean (average) of a set of points; the single point whose total squared distance to that set is smallest." },
      { sym: "distortion / inertia / WCSS", desc: "three names for the same number $J$ — total within-cluster squared error. 'Inertia' is scikit-learn's term." }
    ],

    formula:
      `$$D=\\sum_{n}\\int_{R_n}(x-q_n)^2\\,p(x)\\,dx.$$
       <p class="cap">Lloyd's original 1-D PCM distortion (§II): the mean squared quantization error, where
       region $R_n$ of the input is mapped to output level $q_n$ and $p(x)$ is the signal's amplitude density.
       Machine-learning k-means is this with the integral over the density replaced by a sum over a finite,
       $d$-dimensional dataset and $(x-q_n)^2$ replaced by $\\lVert x-\\mu_i\\rVert^2$.</p>

       $$J(\\{S_i\\},\\{\\mu_i\\})=\\sum_{i=1}^{k}\\ \\sum_{x\\in S_i}\\ \\lVert x-\\mu_i\\rVert^2.$$
       <p class="cap">The objective (within-cluster sum of squares / distortion). Sum, over every cluster $i$ and
       every point $x$ in it, the squared distance from $x$ to that cluster's center. k-means seeks the clusters
       and centers that minimize this.</p>

       $$c(x)=\\arg\\min_{i}\\ \\lVert x-\\mu_i\\rVert^2.$$
       <p class="cap">Assignment step (Lloyd's nearest-neighbor / minimum-distortion condition). With the centers
       fixed, each point is assigned to the center it is nearest to. $c(x)$ is the index of $x$'s chosen cluster.</p>

       $$\\mu_i=\\frac{1}{|S_i|}\\sum_{x\\in S_i}x.$$
       <p class="cap">Update step (Lloyd's centroid condition). With the assignment fixed, each center moves to the
       mean of its assigned points. The mean is exactly the point that minimizes that cluster's squared error.</p>

       $$J^{(t+1)}\\ \\le\\ J^{(t)}\\quad\\text{for every iteration }t,\\qquad J\\ge 0.$$
       <p class="cap">Convergence (monotone-decrease argument). Each step minimizes $J$ over its own variable while
       holding the other fixed, so neither step can raise $J$; the distortion is non-increasing and bounded below
       by $0$, and since only finitely many partitions of $n$ points into $k$ groups exist, the loop reaches a
       fixed point — a local minimum of $J$.</p>

       $$\\arg\\min_{\\{S_i\\},\\{\\mu_i\\}}\\ J
        \\quad\\Longleftrightarrow\\quad
        \\begin{cases}\\text{assign: } x\\mapsto c(x)=\\arg\\min_i\\lVert x-\\mu_i\\rVert^2\\\\[2pt]
                      \\text{update: } \\mu_i\\leftarrow \\text{mean}(S_i)\\end{cases}$$
       <p class="cap">Putting it together: minimizing the distortion is equivalent to alternating the two
       conditions above until the centers stop moving.</p>`,

    whatItDoes:
      `<p>In words, equation by equation:</p>
       <ul>
         <li><b>The PCM integral $D$.</b> "On average, how far off is the rounded signal from the true one?" —
         the mean squared error of a 1-D quantizer, averaged over how often each input value occurs.</li>
         <li><b>The objective $J$.</b> The same idea for a finite set of $d$-dimensional points: total squared
         distance from every point to its assigned center. Smaller $J$ = tighter clusters.</li>
         <li><b>The assignment $c(x)=\\arg\\min_i\\lVert x-\\mu_i\\rVert^2$.</b> "Snap each point to whichever
         center is closest." With centers fixed, this is the choice that makes $J$ as small as it can be.</li>
         <li><b>The update $\\mu_i=\\text{mean}(S_i)$.</b> "Move each center to the average of the points that
         chose it." With the assignment fixed, the mean is the single best center for that cluster.</li>
         <li><b>The convergence line $J^{(t+1)}\\le J^{(t)}$.</b> "The error can only fall." Each step improves
         $J$ over one variable and can't hurt it, so the loop settles to a local minimum.</li>
       </ul>
       <p>Lloyd proved the two conditions for 1-D PCM levels; replacing the integral over the signal density by a
       sum over a finite dataset gives the modern k-means objective.</p>`,

    derivation:
      `<p>The general "what clustering is and how k-means alternates" picture is owned by the
       <code>ml-kmeans</code> concept lesson — see it for the geometry and the demo. Here is the one load-bearing
       fact: <b>why the update step uses the plain mean.</b></p>
       <p>Fix a cluster $S_i$ and ask which center $\\mu$ minimizes that cluster's cost
       $f(\\mu)=\\sum_{x\\in S_i}\\lVert x-\\mu\\rVert^2$. This is a smooth, convex (bowl-shaped) function of
       $\\mu$, so set its gradient to zero. Differentiating each term
       $\\lVert x-\\mu\\rVert^2$ with respect to $\\mu$ gives $-2(x-\\mu)$, so:</p>
       $$\\nabla f(\\mu)=\\sum_{x\\in S_i}-2(x-\\mu)=0
         \\;\\Longrightarrow\\; \\sum_{x\\in S_i}x=|S_i|\\,\\mu
         \\;\\Longrightarrow\\; \\mu=\\frac{1}{|S_i|}\\sum_{x\\in S_i}x.$$
       <p>So the cost-minimizing center is exactly the <b>arithmetic mean</b> of the assigned points — the
       centroid condition. The assignment step needs no calculus: each point's term
       $\\lVert x-\\mu_c\\rVert^2$ is independently smallest when $c$ is the nearest center. Because each step
       solves its own sub-problem exactly, neither can raise $J$, which proves the monotone decrease.</p>`,

    example:
      `<p><b>Worked numbers</b> — one full assign+update iteration. Six 2-D points, $k=2$, starting from the two
       corner centers $\\mu_1=(0,0)$ and $\\mu_2=(10,10)$:</p>
       <p>Points: $(1,1),(1,3),(2,2)$ (a low-left blob) and $(8,8),(9,7),(7,9)$ (an upper-right blob).</p>
       <ul>
         <li><b>Assign (squared distances to $\\mu_1,\\mu_2$).</b>
           $(1,1)$: $2$ vs $162$ → cluster 1. &nbsp;
           $(1,3)$: $10$ vs $130$ → 1. &nbsp;
           $(2,2)$: $8$ vs $128$ → 1.<br>
           $(8,8)$: $128$ vs $8$ → cluster 2. &nbsp;
           $(9,7)$: $130$ vs $10$ → 2. &nbsp;
           $(7,9)$: $130$ vs $10$ → 2.</li>
         <li><b>Distortion after assigning</b> (sum of the chosen distances):
           $2+10+8+8+10+10=48$.</li>
         <li><b>Update (mean of each cluster).</b>
           $\\mu_1=\\big(\\tfrac{1+1+2}{3},\\tfrac{1+3+2}{3}\\big)=(1.333,\\,2.0)$;
           $\\mu_2=\\big(\\tfrac{8+9+7}{3},\\tfrac{8+7+9}{3}\\big)=(8.0,\\,8.0)$.</li>
         <li><b>Distortion after the update</b> (recompute with the new centers): $\\approx 6.667$ — down from
           $48$. The single update slashed the error because the centers moved into the middle of their points.</li>
       </ul>
       <p>The next iteration would not change the assignment, so the centers stop moving and the loop has
       converged. The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>Lloyd's algorithm (k-means), as numbered steps</b> — given data $X$, a count $k$, and initial
       centers $\\mu_1,\\dots,\\mu_k$:</p>
       <ol>
         <li>For every point $x$, compute its squared distance to each center and assign $x$ to the nearest one
         (this defines the clusters $S_1,\\dots,S_k$).</li>
         <li>Record the distortion $J=\\sum_i\\sum_{x\\in S_i}\\lVert x-\\mu_i\\rVert^2$.</li>
         <li>For every cluster, set its center to the mean of its assigned points:
         $\\mu_i\\leftarrow\\frac{1}{|S_i|}\\sum_{x\\in S_i}x$.</li>
         <li>Repeat steps 1–3 until the centers (equivalently, the assignment) stop changing.</li>
         <li><i>Because the optimum is only local,</i> run several times from different starts and keep the run
         with the lowest final $J$ (this is sklearn's <code>n_init</code>).</li>
       </ol>`,

    results:
      `<p>The paper's contribution is structural, not a benchmark: it gives the two <b>optimality conditions</b>
       (nearest-neighbor for the assignment, centroid for the levels) that any minimum-mean-squared-error
       quantizer must satisfy, and an iterative method that enforces them. The mean-squared error is
       non-increasing across iterations and the construction converges to a quantizer satisfying both conditions
       (a local optimum). (Source: S. P. Lloyd, "Least squares quantization in PCM," IEEE Trans. Inf. Theory
       28(2):129–137, 1982; the result dates to 1957 Bell Labs work.) The CODEVIZ numbers below are our own
       small run, not the paper's reported results.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> scikit-learn ships this as <code>sklearn.cluster.KMeans</code> in one line.
       Here you <b>build Lloyd's loop from scratch</b> in raw NumPy: the all-pairs squared-distance matrix, the
       nearest-center <code>argmin</code> assignment, the per-cluster mean update, and the convergence check. The
       payoff is the oracle: started from the <i>same</i> centers, your final distortion equals sklearn's
       <code>.inertia_</code> (<code>np.allclose</code>) and your point-to-cluster labels match sklearn's up to a
       relabeling. If both pass, your loop <i>is</i> sklearn's k-means. You also print the distortion at every
       iteration to see it fall monotonically.</p>`,

    pitfalls:
      `<ul>
         <li><b>Distance must be SQUARED Euclidean.</b> The objective and both conditions are about
         $\\lVert x-\\mu\\rVert^2$. Using plain (un-squared) distance for the update breaks the centroid
         condition — the minimizer of un-squared distances is the <i>geometric median</i>, not the mean (that is
         a different algorithm, k-medians).</li>
         <li><b>Empty clusters.</b> If a center ends up with no points assigned, its mean is undefined (a
         <code>0/0</code>). You must handle it — leave the center put, or re-seed it (sklearn re-seeds). Ignore
         this and you get <code>NaN</code> centers.</li>
         <li><b>Local optima &amp; initialization.</b> k-means converges, but to a <i>local</i> minimum that
         depends on the start. One run can be much worse than another. Always use a good initializer
         (k-means++) and several restarts (<code>n_init</code>) — see the ablation.</li>
         <li><b>$k$ is your choice, and bigger $k$ always lowers $J$.</b> Distortion falls monotonically as you
         add clusters (at $k=n$ it hits $0$), so you cannot pick $k$ by minimizing $J$. Use the <b>elbow</b>
         (where the drop flattens) or a separate criterion like silhouette.</li>
         <li><b>Comparing labels needs a permutation.</b> Cluster labels are arbitrary names — your "cluster 0"
         may be sklearn's "cluster 2." Compare the <i>partition</i> (which points group together), not the raw
         label integers.</li>
       </ul>`,

    recall: [
      "State the k-means distortion objective $J$ from memory, and define $S_i$ and $\\mu_i$.",
      "Name Lloyd's two optimality conditions and which step (assign vs update) enforces each.",
      "Why must the update set each center to the mean? (Hint: minimize $\\sum\\lVert x-\\mu\\rVert^2$ over $\\mu$.)",
      "Why does the distortion never increase across iterations, and what does that NOT guarantee?",
      "Why can't you choose $k$ by picking the value that minimizes $J$?"
    ],

    practice: [
      {
        q: `Verify the centroid condition by hand: which single point $\\mu$ minimizes $\\sum_{x\\in S}\\lVert x-\\mu\\rVert^2$ for $S=\\{(1,1),(1,3),(2,2)\\}$, and what is the minimum value?`,
        steps: [
          { do: `Take the gradient: $\\sum_{x}-2(x-\\mu)=0 \\Rightarrow \\mu=\\text{mean}(S)$.`, why: `The cost is a convex bowl in $\\mu$; its minimum is where the slope is zero.` },
          { do: `Mean $=\\big(\\tfrac{1+1+2}{3},\\tfrac{1+3+2}{3}\\big)=(1.333,2.0)$.`, why: `Coordinate-wise average.` },
          { do: `Squared distances to $\\mu$: $(1,1)\\!:\\,0.111+1=1.111$; $(1,3)\\!:\\,0.111+1=1.111$; $(2,2)\\!:\\,0.444+0=0.444$.`, why: `Plug each point into $\\lVert x-\\mu\\rVert^2$.` }
        ],
        answer: `The minimizer is the mean $\\mu=(1.333,2.0)$, and the minimum within-cluster cost is $1.111+1.111+0.444=2.667$. Any other center gives a larger sum — which is exactly why Lloyd's update step uses the mean.`
      },
      {
        q: `One assign step can move a point between clusters; explain why that move can only lower (never raise) the distortion $J$.`,
        steps: [
          { do: `$J=\\sum_x \\lVert x-\\mu_{c(x)}\\rVert^2$ is a sum of independent per-point terms.`, why: `Each point contributes only its own distance-to-its-center.` },
          { do: `Reassigning a point to its NEAREST center replaces its term with the smallest possible value.`, why: `By definition of nearest, no other center gives a smaller squared distance.` },
          { do: `Every other point's term is unchanged (centers are held fixed during assignment).`, why: `The assign step does not move centers.` }
        ],
        answer: `Each point independently switches to the center that minimizes its own term, and nothing else changes, so the total $J$ can only stay the same or fall. Combined with the update step (which also can't raise $J$), the whole iteration is monotone non-increasing — that is the convergence guarantee. It does NOT guarantee the global optimum, only a local one.`
      },
      {
        q: `Ablation (initialization & k): in the CODE, (a) replace k-means++ starting centers with random ones and rerun many seeds; (b) sweep $k=1\\ldots5$ and look at final distortion. What do you expect, and what does the elbow tell you?`,
        steps: [
          { do: `(a) Run Lloyd from random vs k-means++ starts over ~50 seeds; record the final $J$ of each.`, why: `Different starts converge to different local optima.` },
          { do: `(b) For each $k$, run k-means and record the converged $J$.`, why: `More centers can always fit the data more tightly.` },
          { do: `Plot $J$ vs $k$ and find where the curve bends.`, why: `The 'elbow' marks diminishing returns from extra clusters.` }
        ],
        answer: `(a) Random starts scatter into much worse optima (in our run, mean final $J\\approx 209$, worst $\\approx 547$) while k-means++ reliably hits the good optimum ($J\\approx 66.23$ every time) — initialization matters a lot. (b) $J$ falls monotonically with $k$ ($\\approx 1202,556,66.2,56.7,46.6$ for $k=1..5$); the big drop is at $k{=}3$, then it flattens. That elbow at $k{=}3$ matches the three blobs we generated — and it's why you can't pick $k$ by minimizing $J$ (which would push $k$ toward $n$). These are our small run, not the paper's numbers.`
      }
    ]
  });

  window.CODE["paper-kmeans"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `Build Lloyd's k-means from scratch in NumPy: the all-pairs squared-distance matrix, the nearest-center ` +
      `argmin assignment, the per-cluster mean update, and a convergence check — printing the distortion each ` +
      `iteration so you SEE it fall monotonically. Then prove it IS sklearn's k-means: started from the SAME ` +
      `centers, the final inertia matches sklearn.cluster.KMeans via np.allclose and the labels match up to a ` +
      `permutation. Finally recompute the one-iteration worked example. Runs in Colab (numpy + scikit-learn preinstalled).`,
    code: `import numpy as np
from sklearn.cluster import KMeans
from itertools import permutations

def my_kmeans(X, k, init, max_iter=100, tol=1e-12):
    """Lloyd's algorithm from scratch. Returns final centers, labels, distortion history."""
    C = np.asarray(init, dtype=float).copy()
    history = []
    for _ in range(max_iter):
        # ASSIGN: squared Euclidean distance from every point to every center -> nearest
        D = ((X[:, None, :] - C[None, :, :]) ** 2).sum(axis=2)   # shape (n, k)
        labels = D.argmin(axis=1)                                # nearest-neighbor condition
        history.append(float(D[np.arange(len(X)), labels].sum()))# distortion J (inertia)
        # UPDATE: each center -> mean of its assigned points (centroid condition)
        newC = np.array([X[labels == j].mean(axis=0) if np.any(labels == j) else C[j]
                         for j in range(k)])
        if np.allclose(newC, C, atol=tol):                       # converged: centers stopped moving
            C = newC; break
        C = newC
    # final distortion at the converged centers
    D = ((X[:, None, :] - C[None, :, :]) ** 2).sum(axis=2)
    labels = D.argmin(axis=1)
    history.append(float(D[np.arange(len(X)), labels].sum()))
    return C, labels, history

# ---- toy 2-D set: three clear blobs ----
rng = np.random.default_rng(0)
centers_true = np.array([[0, 0], [6, 6], [0, 7]], float)
X = np.vstack([c + rng.normal(0, 0.8, (20, 2)) for c in centers_true])
k = 3

# deliberately POOR start (all near one corner) so we see several monotone steps
init = np.array([[0., 0.], [0.5, 0.5], [1.0, 0.0]])
C, labels, hist = my_kmeans(X, k, init)
print("distortion each iteration:", [round(h, 4) for h in hist])   # falls every step
print("monotone non-increasing:",
      all(hist[i] >= hist[i+1] - 1e-9 for i in range(len(hist)-1))) # True
print("our final inertia:", round(hist[-1], 4))                    # 66.2327

# ---- THE ORACLE: same start -> must equal sklearn.cluster.KMeans ----
km = KMeans(n_clusters=k, init=init, n_init=1, max_iter=100, tol=1e-12).fit(X)
print("sklearn inertia:", round(km.inertia_, 4))                   # 66.2327
print("inertia allclose:", np.allclose(hist[-1], km.inertia_, atol=1e-4))  # True

def same_partition(a, b, k):                 # labels match up to a renaming?
    return any(np.array_equal(np.array(p)[a], b) for p in permutations(range(k)))
print("labels match (up to perm):", same_partition(labels, km.labels_, k)) # True

# ---- recompute the one-iteration worked example: 6 pts, k=2, corner centers ----
Xe = np.array([[1,1],[1,3],[2,2],[8,8],[9,7],[7,9]], float)
ce = np.array([[0,0],[10,10]], float)
D = ((Xe[:,None,:]-ce[None,:,:])**2).sum(2); lab = D.argmin(1)
print("worked: assignments", lab.tolist(),
      "| distortion after assign", round(D[np.arange(6),lab].sum(), 4))     # 48.0
new = np.array([Xe[lab==j].mean(0) for j in range(2)])
D2 = ((Xe[:,None,:]-new[None,:,:])**2).sum(2)
print("worked: new centers", np.round(new,3).tolist(),
      "| distortion after update", round(D2[np.arange(6),D2.argmin(1)].sum(), 4))  # 6.6667`
  };

  window.CODEVIZ["paper-kmeans"] = {
    question: "From a deliberately poor start, does our from-scratch Lloyd loop drive the within-cluster distortion down monotonically until it flattens — and does the converged value match sklearn.cluster.KMeans exactly?",
    charts: [
      {
        type: "line",
        title: "Within-cluster distortion (inertia) falls every iteration of Lloyd's k-means",
        xlabel: "iteration",
        ylabel: "distortion J (total within-cluster squared error)",
        series: [
          {
            name: "our Lloyd loop (NumPy)",
            color: "#7ee787",
            points: [[0, 2257.44], [1, 267.42], [2, 67.57], [3, 66.23], [4, 66.23]]
          },
          {
            name: "sklearn final inertia",
            color: "#ffb454",
            points: [[0, 66.23], [4, 66.23]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0; 60 toy points in three blobs), not the paper's reported numbers. Started from a deliberately bad initialization (three centers crammed near one corner), the distortion J falls monotonically — 2257 → 267 → 67.6 → 66.23 — then flattens once the centers stop moving, exactly as Lloyd's monotone-decrease guarantee predicts. The dashed line is scikit-learn's final inertia from the SAME start: 66.2327, identical to ours (np.allclose passes), and the point-to-cluster labels match up to a permutation. Ablation (in the code, not plotted): k-means++ starts always reach 66.23, while random starts over 50 seeds average J ≈ 209 and reach 547 at worst — confirming Lloyd converges only to a LOCAL optimum, so initialization matters.",
    code: `import numpy as np
from sklearn.cluster import KMeans
rng = np.random.default_rng(0)

# three toy blobs, 60 points total
centers_true = np.array([[0, 0], [6, 6], [0, 7]], float)
X = np.vstack([c + rng.normal(0, 0.8, (20, 2)) for c in centers_true])
k = 3

def lloyd(X, k, init, iters=15):
    C = np.asarray(init, float).copy(); hist = []
    for _ in range(iters):
        D = ((X[:, None, :] - C[None, :, :]) ** 2).sum(2)
        lab = D.argmin(1); hist.append(float(D[np.arange(len(X)), lab].sum()))
        newC = np.array([X[lab == j].mean(0) if np.any(lab == j) else C[j] for j in range(k)])
        if np.allclose(newC, C): break
        C = newC
    D = ((X[:, None, :] - C[None, :, :]) ** 2).sum(2)
    hist.append(float(D[np.arange(len(X)), D.argmin(1)].sum()))
    return hist

init = np.array([[0., 0.], [0.5, 0.5], [1.0, 0.0]])   # poor start
hist = lloyd(X, k, init)
km = KMeans(n_clusters=k, init=init, n_init=1, max_iter=100, tol=1e-12).fit(X)
print("our distortion curve:", [round(h, 2) for h in hist])  # [2257.44,267.42,67.57,66.23,66.23]
print("our final:", round(hist[-1], 4), " sklearn:", round(km.inertia_, 4))  # 66.2327 == 66.2327

# ablation: k-means++ vs random initialization over 50 seeds
def kmpp(X, k, r):
    idx = [r.integers(len(X))]
    for _ in range(k - 1):
        d = np.min(((X[:, None, :] - X[idx][None, :, :]) ** 2).sum(2), axis=1)
        idx.append(r.choice(len(X), p=d / d.sum()))
    return X[idx].copy()
def trial(kind):
    fins = []
    for s in range(50):
        r = np.random.default_rng(100 + s)
        ini = X[r.choice(len(X), k, replace=False)] if kind == "rand" else kmpp(X, k, r)
        fins.append(lloyd(X, k, ini)[-1])
    return np.array(fins)
rand, pp = trial("rand"), trial("kmpp")
print("random init  mean %.2f  worst %.2f" % (rand.mean(), rand.max()))  # ~209, ~547
print("k-means++    mean %.2f  worst %.2f" % (pp.mean(), pp.max()))      # 66.23, 66.23`
  };
})();
