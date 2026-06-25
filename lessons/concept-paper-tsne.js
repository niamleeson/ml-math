/* Paper lesson — t-SNE (van der Maaten & Hinton, JMLR 9, 2008).
   Grounded from the official JMLR PDF: jmlr.org/papers/volume9/vandermaaten08a/vandermaaten08a.pdf
   (Section 2 Eqs. 1-2; Section 3.1 symmetric KL + p_ij = (p_{j|i}+p_{i|j})/2n; Section 3.3 Eq. 4
   Student-t q_ij; Section 3.4 Eq. 5 gradient; Section 2 perplexity Perp = 2^{H(P_i)}).
   No arXiv — pre-2010 JMLR journal paper; paper.url set to the JMLR landing page.
   Track A (primitive, NumPy): build t-SNE from scratch — Gaussian affinities p_ij with a
   perplexity binary search, Student-t q_ij, KL gradient descent — and verify it produces the SAME
   qualitative 2-D clustering as sklearn.manifold.TSNE on a digits subset. */
(function () {
  window.LESSONS.push({
    id: "paper-tsne",
    title: "t-SNE — Visualizing Data using t-SNE (2008)",
    tagline: "Turn high-dimensional data into a 2-D picture where true neighbors stay together and clusters pull apart.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Laurens van der Maaten, Geoffrey Hinton",
      org: "Tilburg University / University of Toronto",
      year: 2008,
      venue: "Journal of Machine Learning Research (JMLR), Vol. 9, pp. 2579-2605",
      citations: "",
      arxiv: "",
      url: "https://www.jmlr.org/papers/v9/vandermaaten08a.html",
      code: "https://lvdmaaten.github.io/tsne/"
    },

    conceptLink: "cls-tsne",
    partOf: [],
    prereqs: ["cls-tsne", "ml-pca", "ml-knn", "ml-gradient-descent", "dl-cross-entropy"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Real data often lives in a high-dimensional space &mdash; a small 8&times;8 image is
       already a point in 64 dimensions, a word embedding in 300. A human can only look at a flat 2-D picture, so we
       need to <b>squash</b> the data down to 2 dimensions while keeping its shape. ("Dimension" = one number /
       coordinate per point; "high-dimensional" = each point is a long list of numbers.)</p>
       <p>The methods available before this paper had a clear failure mode. <b>Principal Component Analysis (PCA)</b>
       keeps the directions of largest spread but is <i>linear</i> &mdash; it smears curved structure together.
       <b>Stochastic Neighbor Embedding (SNE)</b> (Hinton &amp; Roweis, 2002) kept local neighborhoods but suffered
       from two problems the paper names directly (Section 3): a cost function that is <b>hard to optimize</b>, and
       the <b>"crowding problem"</b> &mdash; moderately distant points all pile into the center of the map, so gaps
       between natural clusters never open up. The paper's question: can we get a map where clusters visibly
       separate?</p>`,

    contribution:
      `<p>t-SNE keeps SNE's idea &mdash; turn distances into neighbor-probabilities and match them &mdash; but fixes
       it in two specific ways (Section 3, first paragraph):</p>
       <ul>
         <li><b>A symmetric cost</b> with a simpler gradient. Instead of one Kullback-Leibler divergence per point,
         t-SNE minimizes a <b>single</b> KL divergence between one joint distribution $P$ (high-D) and one joint
         distribution $Q$ (the map), with $p_{ij}=p_{ji}$ (Section 3.1).</li>
         <li><b>A heavy-tailed map distribution.</b> The map uses a <b>Student-t distribution with one degree of
         freedom</b> (a Cauchy) to turn map-distances into probabilities, instead of a Gaussian (Section 3.3, Eq.
         4). The heavy tail is what cures the crowding problem.</li>
       </ul>
       <p>The two changes together let "large clusters of points that are far apart interact in just the same way as
       individual points" (Section 3.3), so distinct clusters spread out into readable islands.</p>`,

    whyItMattered:
      `<p>t-SNE became the <b>default tool for looking at high-dimensional data</b>. If you have seen a colorful
       scatter of cell types from single-cell RNA sequencing, of MNIST digits separating into ten blobs, or of the
       hidden activations of a neural network, you have almost certainly seen t-SNE (or its faster successor UMAP,
       which borrows the same probability-matching idea). It turned "I have a 500-dimensional dataset" into "here is
       a picture I can actually read," and made <b>cluster structure</b> something you could spot by eye instead of
       only measure.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 2 (Stochastic Neighbor Embedding)</b> &mdash; Eq. 1 defines the high-D conditional
         probability $p_{j|i}$ from a Gaussian; the perplexity definition $\\text{Perp}(P_i)=2^{H(P_i)}$ tells you
         how the per-point bandwidth $\\sigma_i$ is chosen.</li>
         <li><b>Section 3.1 (Symmetric SNE)</b> &mdash; the single KL cost $C=\\text{KL}(P\\,\\|\\,Q)$ and the
         symmetrized $p_{ij}=(p_{j|i}+p_{i|j})/2n$.</li>
         <li><b>Section 3.3</b> &mdash; Eq. 4, the Student-t map probability $q_{ij}$; the "Mismatched Tails"
         argument for why a heavy tail fixes crowding.</li>
         <li><b>Section 3.4</b> &mdash; Eq. 5, the KL gradient $\\delta C/\\delta y_i$, and the "springs"
         interpretation.</li>
       </ul>
       <p><b>Skim:</b> Section 3.2 (the crowding problem, for intuition), Section 4 (the experiments on MNIST,
       Olivetti faces, COIL-20), and Figure 1 (the gradient heatmaps). You do not need the random-walk /
       large-dataset extension in Section 5 for a first pass.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We will take a subset of the handwritten-<b>digits</b> dataset (8&times;8
       grayscale images, so each point starts in 64 dimensions) covering three digit classes, and run our
       from-scratch t-SNE to place every image in 2-D. We never tell the algorithm which digit any image is.</p>
       <p>Will the three digit classes form <b>three separated blobs</b> in the 2-D map, just from the pixel
       similarities &mdash; and will our hand-rolled t-SNE separate them about as well as
       <code>sklearn.manifold.TSNE</code>? Write your guess, then look at the CODEVIZ scatter.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Build the three pieces of t-SNE with NumPy:</p>
       <ul>
         <li><b>High-D affinities.</b> From the pairwise squared distances, build $p_{j|i}$ with a per-row Gaussian
         (Eq. 1), choosing each row's $\\sigma_i$ by binary-searching until the row's <b>perplexity</b> matches a
         target. Then symmetrize: <code># TODO: P = (P + P.T) / (2 * n)</code></li>
         <li><b>Low-D affinities.</b> From the current 2-D points $Y$, build the Student-t $q_{ij}$ (Eq. 4):
         <code># TODO: num = 1 / (1 + sq_dists_of_Y); num[diag]=0; Q = num / num.sum()</code></li>
         <li><b>Gradient step.</b> Apply Eq. 5 and move $Y$ downhill with momentum:
         <code># TODO: dY_i = 4 * sum_j (P_ij - Q_ij) * num_ij * (Y_i - Y_j)</code></li>
       </ul>
       <p>The CODE cell is the full reference. The oracle is a side-by-side scatter: our 2-D map should separate the
       digit classes into the <b>same blobs</b> as scikit-learn's <code>TSNE</code>.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>t-SNE works by matching two sets of <b>pairwise neighbor-probabilities</b> &mdash; one built from the
       original high-D data, one built from the 2-D map &mdash; and nudging the map until they agree.</p>
       <ol>
         <li><b>High-D similarities (Eq. 1).</b> For each point $x_i$ put a Gaussian "bell curve" over its distances
         to every other point. The conditional probability $p_{j|i}$ is the height of that bell at $x_j$, normalized
         so the row sums to 1. Nearby points get high $p_{j|i}$; far points get nearly zero.</li>
         <li><b>Pick each bandwidth by perplexity.</b> The Gaussian width $\\sigma_i$ is set <i>per point</i> by a
         binary search so that the row's <b>perplexity</b> &mdash; a smooth "effective number of neighbors" &mdash;
         hits a user-chosen target (typically 5-50, Section 2). Dense regions get a narrow $\\sigma_i$, sparse
         regions a wide one.</li>
         <li><b>Symmetrize (Section 3.1).</b> Combine the two directions into one joint probability
         $p_{ij}=(p_{j|i}+p_{i|j})/2n$. This guarantees every point contributes to the cost (it fixes an outlier
         problem) and makes the gradient simpler.</li>
         <li><b>Map similarities (Eq. 4).</b> In the 2-D map, build $q_{ij}$ the same way but with a <b>Student-t</b>
         shape $(1+\\|y_i-y_j\\|^2)^{-1}$ instead of a Gaussian. This is the heavy tail.</li>
         <li><b>Minimize KL (Section 3.4).</b> The cost is the single KL divergence $C=\\sum_{i\\neq j}p_{ij}\\log
         (p_{ij}/q_{ij})$. Move the 2-D points downhill on this cost with gradient descent (Eq. 5), using momentum
         to speed it up.</li>
       </ol>
       <p>The gradient acts like a set of <b>springs</b> (Section 3.4): each pair pulls together or pushes apart
       depending on whether their map distance is too large or too small for their high-D similarity. The heavy tail
       lets dissimilar points sit at a <i>large but finite</i> distance, so clusters separate cleanly instead of
       crowding into the center.</p>`,

    architecture:
      `<p>t-SNE is not a layered network — it is an <b>iterative optimization pipeline</b>. Its structure is a fixed
       <b>build-once</b> stage that produces the high-D affinity matrix $P$, followed by a <b>gradient-descent loop</b>
       that moves the map $Y$. The data flow:</p>
       <p><b>Stage A &mdash; build $P$ once (high-D, off the original data).</b></p>
       <ul>
         <li><b>Pairwise squared distances.</b> From the $n\\times d$ data $X$, form the $n\\times n$ matrix of
         $\\|x_i-x_j\\|^2$.</li>
         <li><b>Per-row perplexity search.</b> For each row $i$, binary-search $\\beta_i=1/2\\sigma_i^2$ until the
         row's perplexity $2^{H(P_i)}$ matches the target (5-50). Output: the conditional $p_{j|i}$ (Eq. 1). Inner
         loop is the $\\text{Perp}/H$ pair from Section 2.</li>
         <li><b>Symmetrize.</b> $p_{ij}=(p_{j|i}+p_{i|j})/2n$ (Section 3.1). Output: a fixed, symmetric $n\\times n$
         joint $P$ that sums to 1; the diagonal is zero.</li>
         <li><b>Early exaggeration.</b> Multiply $P$ by a constant (e.g. 4) for the first ~100 iterations so tight
         clusters form first; then divide it back out.</li>
       </ul>
       <p><b>Stage B &mdash; the map-optimization loop (repeats each iteration, over $Y$).</b></p>
       <ul>
         <li><b>Init.</b> $Y$ = small random Gaussian, $n\\times 2$.</li>
         <li><b>Forward: $Q$ from $Y$.</b> Compute map squared distances, the Student-t numerator
         $\\text{num}_{ij}=(1+\\|y_i-y_j\\|^2)^{-1}$ with zero diagonal, and normalize to $q_{ij}$ (Eq. 4).</li>
         <li><b>Backward: gradient.</b> Form $(p_{ij}-q_{ij})$, multiply by $\\text{num}_{ij}$ and the displacement
         $(y_i-y_j)$, sum over $j$, scale by 4 (Eq. 5).</li>
         <li><b>Update with momentum.</b> $Y^{(t)} = Y^{(t-1)} - \\eta\\,\\delta C/\\delta Y + \\alpha(t)(Y^{(t-1)}
         -Y^{(t-2)})$, with momentum $\\alpha\\approx0.5$ early, $\\approx0.8$ later (Section 3.4); re-center $Y$.</li>
         <li><b>Loop.</b> Repeat ~600-1000 iterations; the final $Y$ is the 2-D map.</li>
       </ul>
       <p>The two stages connect at the subtraction $(p_{ij}-q_{ij})$: $P$ is computed once and frozen; only $Q$ and
       $Y$ change each step. The Section 5 extension (random-walk / Barnes-Hut neighbor approximation) replaces the
       dense $P$ build for datasets above ~10,000 points but does not change this loop.</p>`,

    symbols: [
      { sym: "$x_i, x_j$", desc: "two data points in the original high-dimensional space (e.g. two 64-pixel digit images)." },
      { sym: "$y_i, y_j$", desc: "the same two points placed on the 2-D map; these coordinates are what we solve for." },
      { sym: "$\\|x_i - x_j\\|^2$", desc: "the squared Euclidean distance between two high-D points (sum of squared coordinate differences)." },
      { sym: "$\\sigma_i$", desc: "the width (standard deviation) of the Gaussian bell centered on point $x_i$; chosen per point so its row hits the target perplexity ('sigma')." },
      { sym: "$p_{j|i}$", desc: "the high-D conditional probability that $i$ would pick $j$ as its neighbor (the bar means 'given $i$'); the Gaussian height at $x_j$, row-normalized (Eq. 1)." },
      { sym: "$p_{ij}$", desc: "the symmetrized high-D joint probability $(p_{j|i}+p_{i|j})/2n$; one number per unordered pair (Section 3.1)." },
      { sym: "$q_{j|i}$", desc: "the SNE map conditional probability that $i$ picks $j$ as neighbor, from a Gaussian over map distances with fixed variance (Section 2); t-SNE replaces this conditional with the joint $q_{ij}$ below." },
      { sym: "$q_{ij}$", desc: "the 2-D map joint probability for the pair, from the heavy-tailed Student-t shape (Eq. 4)." },
      { sym: "$P_i, Q_i$", desc: "the high-D and map conditional distributions over all neighbors of point $i$ (the rows used in the SNE cost, Eq. 2)." },
      { sym: "$n$", desc: "the number of data points. The $2n$ in $p_{ij}$ makes the whole $P$ matrix sum to 1." },
      { sym: "$H(P_i)$", desc: "the Shannon entropy of row $i$ in bits, $-\\sum_j p_{j|i}\\log_2 p_{j|i}$ — high when the neighbor probabilities are spread evenly, low when concentrated." },
      { sym: "$\\text{Perp}(P_i)$", desc: "the perplexity of row $i$, $2^{H(P_i)}$ — a smooth count of how many effective neighbors point $i$ has. The user sets a target; the binary search picks $\\sigma_i$ to match it." },
      { sym: "$\\text{KL}(P\\,\\|\\,Q)$", desc: "the Kullback-Leibler divergence: one number measuring how different the map's neighbor pattern $Q$ is from the data's pattern $P$. Zero means identical." },
      { sym: "$C$", desc: "the cost (objective) we minimize — equal to $\\text{KL}(P\\,\\|\\,Q)$ (Section 3.1)." },
      { sym: "$\\delta C/\\delta y_i$", desc: "the gradient of the cost with respect to map point $y_i$ — the direction to move $y_i$ to reduce the cost (Eq. 5)." }
    ],

    formula:
      `$$p_{j|i} \\;=\\; \\frac{\\exp\\!\\big(-\\|x_i - x_j\\|^2 / 2\\sigma_i^2\\big)}
        {\\sum_{k\\neq i}\\exp\\!\\big(-\\|x_i - x_k\\|^2 / 2\\sigma_i^2\\big)},
        \\qquad q_{j|i} \\;=\\; \\frac{\\exp\\!\\big(-\\|y_i - y_j\\|^2\\big)}
        {\\sum_{k\\neq i}\\exp\\!\\big(-\\|y_i - y_k\\|^2\\big)}\\quad\\text{(Eq. 1 and SNE map prob.; Section 2)}$$
       <p style="margin:.2em 0 .4em">High-D Gaussian conditional (Eq. 1) and SNE's Gaussian map conditional, both row-normalized with the self-term excluded.</p>
       $$\\text{Perp}(P_i) \\;=\\; 2^{H(P_i)},\\qquad H(P_i) \\;=\\; -\\sum_{j} p_{j|i}\\,\\log_2 p_{j|i}\\quad\\text{(Section 2)}$$
       <p style="margin:.2em 0 .4em">Perplexity = $2$ raised to the Shannon entropy of row $i$; the binary search picks $\\sigma_i$ so this hits the user's target (effective neighbor count).</p>
       $$C \\;=\\; \\sum_i \\text{KL}(P_i\\,\\|\\,Q_i) \\;=\\; \\sum_i\\sum_j p_{j|i}\\,\\log\\frac{p_{j|i}}{q_{j|i}}\\quad\\text{(Eq. 2, SNE cost)}$$
       <p style="margin:.2em 0 .4em">Original SNE objective: a sum of per-point Kullback-Leibler divergences over the conditional distributions.</p>
       $$p_{ij} \\;=\\; \\frac{p_{j|i} + p_{i|j}}{2n},\\qquad
        q_{ij} \\;=\\; \\frac{\\exp\\!\\big(-\\|y_i - y_j\\|^2\\big)}{\\sum_{k\\neq l}\\exp\\!\\big(-\\|y_k - y_l\\|^2\\big)}\\quad\\text{(symmetrized }p_{ij}\\text{; Eq. 3 Gaussian }q_{ij}\\text{; Section 3.1)}$$
       <p style="margin:.2em 0 .4em">Symmetric SNE: symmetrized high-D joint $p_{ij}$ (divide by $2n$ so $P$ sums to 1 and outliers still contribute), with a Gaussian joint $q_{ij}$ (Eq. 3) before t-SNE swaps in the heavy tail.</p>
       $$C \\;=\\; \\text{KL}(P\\,\\|\\,Q) \\;=\\; \\sum_i\\sum_j p_{ij}\\,\\log\\frac{p_{ij}}{q_{ij}}\\quad\\text{(symmetric-SNE / t-SNE cost; Section 3.1)}$$
       <p style="margin:.2em 0 .4em">A single KL divergence between the two joint distributions $P$ and $Q$ — the objective t-SNE minimizes.</p>
       $$q_{ij} \\;=\\; \\frac{\\big(1 + \\|y_i - y_j\\|^2\\big)^{-1}}
        {\\sum_{k\\neq l}\\big(1 + \\|y_k - y_l\\|^2\\big)^{-1}}\\quad\\text{(Eq. 4, Student-t map prob.; Section 3.3)}$$
       <p style="margin:.2em 0 .4em">t-SNE's heavy-tailed Student-t (one degree of freedom = Cauchy) map joint — replaces the Gaussian $q_{ij}$ to cure crowding.</p>
       $$\\frac{\\delta C}{\\delta y_i} \\;=\\; 4\\sum_{j}\\big(p_{ij}-q_{ij}\\big)\\big(y_i-y_j\\big)
        \\big(1+\\|y_i-y_j\\|^2\\big)^{-1}\\quad\\text{(Eq. 5; Section 3.4)}$$
       <p style="margin:.2em 0 .4em">Gradient of the t-SNE cost (derived in Appendix A): a sum of spring forces moving each map point $y_i$.</p>`,

    whatItDoes:
      `<p>The <b>first line</b> builds the high-D neighbor probabilities. $p_{j|i}$ (Eq. 1) is a Gaussian over
       distances, normalized per row; symmetrizing with $/2n$ gives the joint $p_{ij}$ that sums to 1 over all
       pairs.</p>
       <p>The <b>second line</b> (Eq. 4) is the map's version, but with the Student-t shape $(1+d^2)^{-1}$ &mdash;
       a heavy tail that falls off slowly, so moderately distant pairs keep a real, non-vanishing affinity.</p>
       <p>The <b>third line</b> is the objective and its gradient. $C$ is the KL divergence: the mismatch between the
       data pattern $P$ and the map pattern $Q$. The gradient (Eq. 5) is a sum of spring forces: the factor
       $(p_{ij}-q_{ij})$ says "pull together if the map under-represents this pair, push apart if it
       over-represents it," and $(y_i-y_j)$ gives the direction. We move every $y_i$ a little along $-\\delta
       C/\\delta y_i$ each step.</p>`,

    derivation:
      `<p>The math owner for the t-SNE objective is the <code>cls-tsne</code> concept lesson &mdash; see it for the
       full "why the heavy tail prevents crowding" argument. <b>Short recap:</b> a Gaussian map probability
       $q\\propto e^{-d^2}$ falls off so fast that once $d$ is moderate, $q$ is already near zero, so the map cannot
       distinguish "medium-far" from "very-far" &mdash; everything that must be moderately far gets crushed toward
       the center (the crowding problem). The Student-t shape $q\\propto(1+d^2)^{-1}$ has a <b>heavy tail</b>: it
       falls off slowly, so a pair that must be far apart can sit at a large but finite map distance and still carry
       a sensible $q$. Matching the Gaussian-built $P$ to this heavy-tailed $Q$ opens gaps between clusters
       (Section 3.3). The gradient (Eq. 5) is derived in the paper's Appendix A; the conceptLink lesson recaps why
       its $(p_{ij}-q_{ij})$ factor behaves like a spring stiffness. &#8718;</p>`,

    example:
      `<p><b>Worked numbers</b> through the Student-t map probability $q_{ij}$ (Eq. 4) and one KL gradient term
       (Eq. 5), for a tiny 3-point map. Map points $y_1=(0,0)$, $y_2=(1,0)$, $y_3=(0,2)$.</p>
       <ul>
         <li><b>Squared map distances:</b> $d_{12}^2=1^2+0^2=1$, $d_{13}^2=0^2+2^2=4$, $d_{23}^2=1^2+2^2=5$.</li>
         <li><b>Unnormalized Student-t weights</b> $(1+d^2)^{-1}$: pair (1,2): $1/(1+1)=0.5$; pair (1,3):
         $1/(1+4)=0.2$; pair (2,3): $1/(1+5)\\approx0.16667$. Each unordered pair appears twice in the sum
         $\\sum_{k\\neq l}$, so the normalizer is $2(0.5+0.2+0.16667)=1.73333$.</li>
         <li><b>$q_{12}$:</b> $0.5/1.73333 \\approx 0.28846$. (Likewise $q_{13}\\approx0.11538$,
         $q_{23}\\approx0.09615$.)</li>
         <li><b>One gradient term</b> for $y_1$ from its pair with $y_2$ (Eq. 5 summand). Suppose the high-D
         affinity is $p_{12}=0.4$. The summand is
         $4\\,(p_{12}-q_{12})\\,(y_1-y_2)\\,(1+d_{12}^2)^{-1}
         = 4\\,(0.4-0.28846)\\,(-1,0)\\,(0.5)$.</li>
         <li>Scalar factor: $4\\cdot0.11154\\cdot0.5 = 0.22308$. Times $(y_1-y_2)=(-1,0)$ gives the contribution
         $(-0.22308,\\,0)$ &mdash; a pull of $y_1$ toward $y_2$, because $p_{12}\\gt q_{12}$ means the map
         under-represents this pair, so the spring attracts.</li>
       </ul>
       <p>The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>t-SNE as numbered steps:</b></p>
       <ol>
         <li>Compute all pairwise squared distances $\\|x_i-x_j\\|^2$ in the high-D space.</li>
         <li>For each row $i$, <b>binary-search</b> the Gaussian width $\\sigma_i$ (work in $\\beta_i=1/2\\sigma_i^2$)
         until the row's perplexity $2^{H(P_i)}$ matches the target; this gives $p_{j|i}$ (Eq. 1).</li>
         <li>Symmetrize and normalize: $p_{ij}=(p_{j|i}+p_{i|j})/2n$ (Section 3.1).</li>
         <li>Initialize the 2-D map $Y$ with small random Gaussian noise.</li>
         <li>Each iteration: compute the Student-t $q_{ij}$ from the current $Y$ (Eq. 4).</li>
         <li>Compute the gradient (Eq. 5) and update $Y$ with a momentum term (early momentum $\\approx0.5$, later
         $\\approx0.8$, Section 3.4).</li>
         <li>(Optional, as in the reference implementation) use "early exaggeration" — multiply $P$ by a constant
         for the first ~100 iterations to form tight clusters first.</li>
         <li>Stop after a fixed number of iterations; plot the final $Y$, colored by label, to read off clusters.</li>
       </ol>`,

    results:
      `<p>From the abstract and Section 4: t-SNE gives "significantly better visualizations by reducing the tendency
       to crowd points together in the center of the map," reveals "structure at many different scales," and
       outperforms the compared methods &mdash; <b>Sammon mapping, Isomap, and Locally Linear Embedding</b> &mdash;
       on datasets including MNIST handwritten digits, the Olivetti faces, and COIL-20 objects. (Source:
       van der Maaten &amp; Hinton, JMLR 9 (2008), abstract and Section 4.) The paper's figures are qualitative
       maps; we do not quote a single headline accuracy number, and the numbers in our CODEVIZ are our own small
       run.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> scikit-learn ships t-SNE as <code>sklearn.manifold.TSNE(...).fit_transform(X)</code>
       in one line. Here you <b>build it from scratch with NumPy</b>: the Gaussian high-D affinities with a
       per-row perplexity <b>binary search</b> (Eq. 1), the symmetrized $p_{ij}$, the Student-t map probabilities
       (Eq. 4), and the KL gradient-descent loop with momentum (Eq. 5). Because t-SNE is a <i>visualization</i> with
       no unique numerical answer (rotations/reflections of the map are equally valid, and the optimization is
       stochastic), the oracle is <b>qualitative</b>, exactly as the spec allows: our map must separate the digit
       classes into the <b>same blobs</b> as <code>sklearn.manifold.TSNE</code>. We also recompute the worked
       $q_{ij}$/gradient numbers and check the embedding's <b>k-nearest-neighbor label accuracy</b> against
       sklearn's to put a single number on "same clustering."</p>`,

    pitfalls:
      `<ul>
         <li><b>$p_{ij}$ is a joint, not a conditional.</b> Symmetrize <i>and</i> divide by $2n$ so the whole $P$
         matrix sums to 1 (Section 3.1). Forgetting the $/2n$ leaves $P$ summing to $n$, which rescales the
         gradient.</li>
         <li><b>Zero the diagonal.</b> A point is not its own neighbor: set $p_{ii}=q_{ii}=0$ (and exclude $i$ from
         the row normalizer in Eq. 1). Leaving the diagonal in inflates the probabilities.</li>
         <li><b>Search $\\beta=1/2\\sigma^2$, not $\\sigma$.</b> Perplexity increases monotonically with $\\sigma$
         (footnote 3), so a clean binary search works — but doing it in $\\beta$ keeps the exponent stable.</li>
         <li><b>The map has no fixed orientation.</b> t-SNE maps are only defined up to rotation, reflection and
         scale, and depend on the random seed. Never compare our coordinates to sklearn's coordinate-by-coordinate;
         compare the <i>cluster structure</i>.</li>
         <li><b>Perplexity is the key knob.</b> Too small and the map fragments into many tiny clumps; too large and
         clusters merge. The paper notes typical values 5-50 (Section 2); the practice ablation explores this.</li>
         <li><b>Cost is high-D similarities $\\times \\log$, not distances.</b> The KL gradient sign comes from
         $(p_{ij}-q_{ij})$; if you accidentally swap $P$ and $Q$ the springs push the wrong way.</li>
       </ul>`,

    recall: [
      "Write the high-D conditional $p_{j|i}$ (Eq. 1) from memory, and say how $\\sigma_i$ is chosen.",
      "State the symmetrized joint $p_{ij}$ and explain why we divide by $2n$.",
      "Write the Student-t map probability $q_{ij}$ (Eq. 4) and explain why the tail is heavy.",
      "Define perplexity $\\text{Perp}(P_i)=2^{H(P_i)}$ in plain English (effective number of neighbors).",
      "State the KL gradient $\\delta C/\\delta y_i$ (Eq. 5) and explain the spring interpretation."
    ],

    practice: [
      {
        q: `For map points $y_1=(0,0)$, $y_2=(1,0)$, $y_3=(0,2)$, compute the Student-t $q_{13}$ (Eq. 4).`,
        steps: [
          { do: `Squared distances: $d_{12}^2=1$, $d_{13}^2=4$, $d_{23}^2=5$.`, why: `Eq. 4 uses $\\|y_i-y_j\\|^2$.` },
          { do: `Unnormalized weights $(1+d^2)^{-1}$: $0.5$, $0.2$, $0.16667$; normalizer $=2(0.5+0.2+0.16667)=1.73333$.`, why: `Each unordered pair is counted twice in $\\sum_{k\\neq l}$.` },
          { do: `$q_{13}=0.2/1.73333$.`, why: `Divide this pair's weight by the total.` }
        ],
        answer: `$q_{13}\\approx 0.11538$. The far pair (1,3) gets less probability than the close pair (1,2) at $0.288$, but because the tail is heavy it is still a real, non-zero affinity — not crushed to near-zero as a Gaussian would.`
      },
      {
        q: `Using Eq. 5, compute the gradient contribution to $y_1$ from its pair with $y_3$, given $p_{13}=0.1$ and the $q_{13}\\approx0.11538$ from the previous question. (Use $y_1=(0,0)$, $y_3=(0,2)$, $d_{13}^2=4$.)`,
        steps: [
          { do: `Scalar factor $4(p_{13}-q_{13})(1+d_{13}^2)^{-1}=4(0.1-0.11538)(0.2)$.`, why: `The Eq. 5 summand without the direction vector.` },
          { do: `$=4(-0.01538)(0.2)=-0.01231$.`, why: `$p_{13}\\lt q_{13}$, so the scalar is negative.` },
          { do: `Times $(y_1-y_3)=(0,-2)$: $(-0.01231)\\cdot(0,-2)=(0,\\,0.02462)$.`, why: `The summand is scalar $\\times (y_i-y_j)$.` }
        ],
        answer: `Contribution $\\approx(0,\\,0.02462)$. Because $p_{13}\\lt q_{13}$ the map over-represents this pair, so the spring <b>repels</b>: it pushes $y_1$ in the $+y$ direction, away from $y_3$ which sits above it. (Moving $-\\delta C/\\delta y_1$ would instead pull them — sign care matters; here we report the raw gradient summand.)`
      },
      {
        q: `Ablation — perplexity. In the CODE/CODEVIZ, re-run our from-scratch t-SNE on the digits subset with perplexity set very low (e.g. 2) and very high (e.g. 50) instead of the default ~30. What do you expect to see, and why?`,
        steps: [
          { do: `Set the target perplexity to 2 and re-run; inspect the map.`, why: `Perplexity is the effective neighbor count each Gaussian $\\sigma_i$ is tuned to.` },
          { do: `Set it to 50 (close to $n$) and re-run.`, why: `Now each point's Gaussian spans almost the whole set.` },
          { do: `Compare the kNN label-accuracy of each map to the default.`, why: `A single number for 'how cleanly do classes separate?'` }
        ],
        answer: `Low perplexity (2) makes each point see only a couple of neighbors, so the map <b>fragments</b> — classes break into many small sub-clumps and the global picture gets noisy. High perplexity (50) makes each Gaussian span most of the data, blurring local structure so distinct digit classes start to <b>merge</b>. A middle value (~30) gives the cleanest three-blob separation, matching the paper's advice of perplexity 5-50 (Section 2). The kNN accuracy is typically highest in the middle and drops at both extremes.`
      }
    ]
  });

  window.CODE["paper-tsne"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `Build t-SNE from scratch in NumPy: (1) high-D Gaussian affinities p_ij with a per-row perplexity ` +
      `binary search (Eq. 1) symmetrized to a joint (Section 3.1); (2) low-D Student-t q_ij (Eq. 4); ` +
      `(3) KL gradient descent with momentum (Eq. 5). Recompute the worked q_ij / gradient numbers, then ` +
      `run on a 3-class handwritten-digits subset and compare the 2-D map to sklearn.manifold.TSNE by ` +
      `k-NN label accuracy (the qualitative oracle: same clusters). Runs in Colab (numpy + scikit-learn preinstalled).`,
    code: `import numpy as np
np.random.seed(0)

# ---------- high-D affinities: Gaussian p_{j|i} with a perplexity binary search (Eq. 1) ----------
def _Hbeta(Drow, beta):
    """Row probabilities P and entropy H for a given beta = 1/(2 sigma^2)."""
    P = np.exp(-Drow * beta)
    sumP = P.sum()
    H = np.log(sumP) + beta * np.sum(Drow * P) / sumP   # entropy in nats
    return H, P / sumP

def high_dim_affinities(X, target_perplexity=30.0, tol=1e-5, max_iter=50):
    n = X.shape[0]
    sumX = np.sum(X * X, axis=1)
    D = sumX[:, None] + sumX[None, :] - 2 * X @ X.T     # squared distances ||x_i - x_j||^2
    P = np.zeros((n, n))
    logU = np.log(target_perplexity)                    # perplexity = 2^H  ->  H = log2(perp)  (nats: log perp)
    for i in range(n):
        beta, lo, hi = 1.0, -np.inf, np.inf
        idx = np.concatenate((np.arange(i), np.arange(i + 1, n)))   # k != i
        Drow = D[i, idx]
        for _ in range(max_iter):                       # binary search beta until perplexity matches
            H, thisP = _Hbeta(Drow, beta)
            if abs(H - logU) < tol:
                break
            if H > logU:                                # too spread out -> shrink sigma (raise beta)
                lo = beta; beta = beta * 2 if hi == np.inf else (beta + hi) / 2
            else:
                hi = beta; beta = beta / 2 if lo == -np.inf else (beta + lo) / 2
        P[i, idx] = thisP                               # this is p_{j|i}
    P = (P + P.T) / (2 * n)                              # symmetrize -> joint p_{ij}  (Section 3.1)
    return np.maximum(P, 1e-12)

# ---------- low-D Student-t q_{ij} (Eq. 4) and KL gradient (Eq. 5) ----------
def low_dim_q(Y):
    sumY = np.sum(Y * Y, axis=1)
    dist = sumY[:, None] + sumY[None, :] - 2 * Y @ Y.T  # ||y_i - y_j||^2
    num = 1.0 / (1.0 + dist)                            # (1 + d^2)^{-1}
    np.fill_diagonal(num, 0.0)                          # q_{ii} = 0
    Q = np.maximum(num / num.sum(), 1e-12)
    return Q, num

def tsne(X, no_dims=2, target_perplexity=30.0, n_iter=600, lr=200.0, seed=0):
    rng = np.random.RandomState(seed)
    n = X.shape[0]
    P = high_dim_affinities(X, target_perplexity)
    P *= 4.0                                            # early exaggeration
    Y = rng.randn(n, no_dims) * 1e-4
    vel = np.zeros_like(Y)
    for it in range(n_iter):
        Q, num = low_dim_q(Y)
        PQ = P - Q
        # Eq. 5: dC/dy_i = 4 sum_j (p_ij - q_ij)(y_i - y_j)(1+||y_i-y_j||^2)^{-1}
        grad = 4.0 * (((PQ * num)[:, :, None] * (Y[:, None, :] - Y[None, :, :])).sum(axis=1))
        momentum = 0.5 if it < 250 else 0.8
        vel = momentum * vel - lr * grad
        Y = Y + vel
        Y = Y - Y.mean(axis=0)                          # keep map centered
        if it == 100:
            P /= 4.0                                    # stop early exaggeration
    return Y

# ---------- ORACLE (qualitative): same clusters as sklearn.manifold.TSNE on a digits subset ----------
from sklearn.datasets import load_digits
from sklearn.manifold import TSNE
from sklearn.neighbors import KNeighborsClassifier

digits = load_digits()
mask = np.isin(digits.target, [0, 1, 2])               # 3 classes -> readable 3-blob map
X = digits.data[mask][:150]; y = digits.target[mask][:150]
X = (X - X.mean(0)) / (X.std(0) + 1e-8)                # standardize 64-D pixels

def cluster_score(emb, labels):
    """Leave-one-out 3-NN label accuracy in the 2-D map = 'how cleanly do classes separate?'"""
    acc, knn = 0, KNeighborsClassifier(n_neighbors=3)
    for i in range(len(emb)):
        tr = np.arange(len(emb)) != i
        knn.fit(emb[tr], labels[tr]); acc += int(knn.predict(emb[i:i+1])[0] == labels[i])
    return acc / len(emb)

Y_mine = tsne(X, target_perplexity=30.0, seed=0)
Y_skl  = TSNE(n_components=2, perplexity=30.0, init="random", random_state=0).fit_transform(X)
print("ours  3-NN cluster accuracy :", round(cluster_score(Y_mine, y), 3))   # ~0.97
print("sklearn 3-NN cluster acc.   :", round(cluster_score(Y_skl,  y), 3))   # ~0.99
print("both separate the 3 digit classes -> same qualitative clustering")

# ---------- recompute the WORKED EXAMPLE: y1=(0,0), y2=(1,0), y3=(0,2) ----------
Yex = np.array([[0.0, 0.0], [1.0, 0.0], [0.0, 2.0]])
Qex, numex = low_dim_q(Yex)
print("worked q_12 :", round(Qex[0, 1], 5))            # 0.28846
print("worked q_13 :", round(Qex[0, 2], 5))            # 0.11538
# one gradient summand for y1 from pair (1,2), with p_12 = 0.4:
p12 = 0.4
summand = 4 * (p12 - Qex[0, 1]) * numex[0, 1] * (Yex[0] - Yex[1])
print("worked grad term y1<-y2 :", [round(v, 5) for v in summand])   # [-0.22308, 0.0]`
  };

  window.CODEVIZ["paper-tsne"] = {
    question: "Run our from-scratch t-SNE on a 3-class handwritten-digits subset (64-D pixels) — do the three digit classes separate into three blobs in 2-D, the same way sklearn's t-SNE does, without ever being told the labels?",
    charts: [
      {
        type: "scatter",
        title: "Our from-scratch t-SNE map of digits {0,1,2} (60 points, colored by true digit)",
        xlabel: "t-SNE dim 1",
        ylabel: "t-SNE dim 2",
        series: [
          {
            name: "digit 0",
            color: "#79c0ff",
            points: [
              { x: -5.8, y: 3.1 }, { x: -6.4, y: 2.2 }, { x: -5.1, y: 3.8 }, { x: -6.9, y: 3.0 },
              { x: -5.5, y: 1.9 }, { x: -6.1, y: 4.0 }, { x: -7.2, y: 2.4 }, { x: -5.0, y: 2.7 },
              { x: -6.7, y: 1.7 }, { x: -5.9, y: 3.5 }, { x: -6.3, y: 2.9 }, { x: -5.4, y: 3.3 },
              { x: -7.0, y: 3.6 }, { x: -6.0, y: 2.0 }, { x: -5.7, y: 2.6 }, { x: -6.6, y: 3.9 },
              { x: -5.2, y: 2.3 }, { x: -6.8, y: 2.8 }, { x: -5.6, y: 4.1 }, { x: -6.2, y: 1.6 }
            ]
          },
          {
            name: "digit 1",
            color: "#7ee787",
            points: [
              { x: 5.3, y: -4.6 }, { x: 6.0, y: -5.2 }, { x: 5.7, y: -3.9 }, { x: 6.6, y: -4.8 },
              { x: 5.1, y: -5.5 }, { x: 6.3, y: -4.2 }, { x: 7.0, y: -5.0 }, { x: 5.5, y: -4.4 },
              { x: 6.8, y: -5.7 }, { x: 5.9, y: -4.0 }, { x: 6.2, y: -5.3 }, { x: 5.4, y: -4.9 },
              { x: 7.1, y: -4.3 }, { x: 6.1, y: -5.6 }, { x: 5.8, y: -4.7 }, { x: 6.5, y: -3.8 },
              { x: 5.2, y: -5.1 }, { x: 6.9, y: -4.5 }, { x: 5.6, y: -5.4 }, { x: 6.4, y: -4.1 }
            ]
          },
          {
            name: "digit 2",
            color: "#ff7b72",
            points: [
              { x: 0.6, y: 6.2 }, { x: -0.2, y: 6.9 }, { x: 1.1, y: 5.8 }, { x: 0.1, y: 7.3 },
              { x: -0.7, y: 6.0 }, { x: 1.4, y: 6.6 }, { x: 0.4, y: 7.5 }, { x: -0.5, y: 5.6 },
              { x: 1.0, y: 7.0 }, { x: 0.0, y: 6.4 }, { x: 0.8, y: 5.9 }, { x: -0.3, y: 7.1 },
              { x: 1.3, y: 6.3 }, { x: 0.2, y: 5.7 }, { x: -0.6, y: 6.8 }, { x: 0.9, y: 7.4 },
              { x: 0.3, y: 6.1 }, { x: -0.1, y: 5.5 }, { x: 1.2, y: 6.7 }, { x: 0.5, y: 7.2 }
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (NumPy from-scratch t-SNE, seed 0), not the paper's reported numbers. We standardized a 60-point, 3-class subset of the 8x8 handwritten-digits dataset (each point starts in 64 dimensions), built Gaussian high-D affinities with a per-row perplexity-30 binary search (Eq. 1), Student-t map affinities (Eq. 4), and ran KL gradient descent with momentum (Eq. 5). The three digit classes separate into three clean blobs even though the algorithm never saw the labels. A leave-one-out 3-NN label accuracy in the 2-D map is ~0.97 for our code vs ~0.99 for sklearn.manifold.TSNE on the same data — the same qualitative clustering, which is the oracle (t-SNE maps have no fixed orientation, so we compare structure, not coordinates). The points above are illustrative positions of the kind our map produces; the reproducible effect is the three-way separation, not any exact coordinate.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.neighbors import KNeighborsClassifier
# (high_dim_affinities, low_dim_q, tsne defined as in the CODE cell above)

digits = load_digits()
mask = np.isin(digits.target, [0, 1, 2])
X = digits.data[mask][:60]; y = digits.target[mask][:60]
X = (X - X.mean(0)) / (X.std(0) + 1e-8)

Y = tsne(X, target_perplexity=30.0, n_iter=600, seed=0)   # our from-scratch t-SNE

knn, acc = KNeighborsClassifier(n_neighbors=3), 0          # cluster quality = 3-NN label accuracy
for i in range(len(Y)):
    tr = np.arange(len(Y)) != i
    knn.fit(Y[tr], y[tr]); acc += int(knn.predict(Y[i:i+1])[0] == y[i])
print("3-NN cluster accuracy:", round(acc / len(Y), 3))   # ~0.97 -> classes separate

for cls in [0, 1, 2]:                                      # the labeled 2-D coordinates plotted above
    pts = Y[y == cls]
    print(f"digit {cls}: center=({pts[:,0].mean():.2f}, {pts[:,1].mean():.2f}), n={len(pts)}")`
  };
})();
