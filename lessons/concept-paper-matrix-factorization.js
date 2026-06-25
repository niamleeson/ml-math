/* Paper lesson — "Matrix Factorization Techniques for Recommender Systems"
   (Yehuda Koren, Robert Bell, Chris Volinsky; IEEE Computer, vol. 42, no. 8, Aug 2009, pp. 42-49).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-matrix-factorization".
   GROUNDED from the official IEEE Computer Society article, read directly from the PDF.
   Eq 1 (r-hat = q_i^T p_u), Eq 2 (regularized squared error), Eq 3 (bias decomposition),
   Eq 4 (biases extend the model), Eq 5 (bias objective), and the stochastic gradient descent
   update rules (e_ui, q_i, p_u) are transcribed from the "A Basic Matrix Factorization Model"
   and "Learning Algorithms" sections.
   Track A (primitive): build matrix factorization from raw torch tensors — latent user/item
   factor matrices, predict by dot product, train by SGD on the regularized squared error.
   Verify the hand-coded gradient against torch.autograd, and recover a low-rank matrix. */
(function () {
  window.LESSONS.push({
    id: "paper-matrix-factorization",
    title: "Matrix Factorization — Matrix Factorization Techniques for Recommender Systems (2009)",
    tagline: "Predict a user's rating of an item as the dot product of two learned vectors — one per user, one per item — and fit them by gradient descent on the ratings you have actually seen.",
    module: "Papers · Recommender Systems",
    track: "primitive",
    paper: {
      authors: "Yehuda Koren, Robert Bell, Chris Volinsky",
      org: "Yahoo Research (Koren); AT&T Labs—Research (Bell, Volinsky)",
      year: 2009,
      venue: "IEEE Computer, vol. 42, no. 8, pp. 42-49 (Aug 2009)",
      citations: "",
      url: "https://datajobs.com/data-science-repo/Recommender-Systems-[Netflix].pdf",
      code: ""
    },
    conceptLink: "cls-recommender",
    partOf: [],
    prereqs: ["cls-recommender", "ml-gradient-descent", "ml-regularization", "la-matmul", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>You run a movie service. You have a giant table of star ratings: rows are users, columns are
       movies, and a cell holds the rating that user gave that movie. The catch is that the table is mostly
       <b>empty</b> &mdash; any one person has rated only a tiny fraction of the movies. The paper calls this
       a <i>sparse</i> matrix. Your job is to guess the missing cells, so you can recommend the movies a user
       has not seen but would rate highly.</p>
       <p>Before this paper's approach took over, the standard tool was the <b>neighborhood method</b>: to
       predict a rating, find users (or items) "near" the target and average their ratings. The paper
       (&sect;"Recommender System Strategies") describes these neighborhood methods and notes their limits.
       The competing idea, <b>latent factor models</b>, "tries to explain the ratings by characterizing both
       items and users on, say, 20 to 100 factors inferred from the ratings patterns." The open question the
       paper answers: how do you actually <i>learn</i> those factors from a table that is mostly holes,
       without overfitting the few entries you do have?</p>`,
    contribution:
      `<ul>
        <li><b>The dot-product rating model (Equation 1).</b> Give every item $i$ a vector $q_i$ and every
        user $u$ a vector $p_u$, both of length $f$ (the number of latent factors). Predict the rating as
        their dot product $\\hat{r}_{ui} = q_i^\\top p_u$. One multiply-and-add per pair. Nothing else.</li>
        <li><b>Fit it on observed ratings only, with regularization (Equation 2).</b> Rather than filling in
        the holes first, the model "minimizes the regularized squared error on the set of known ratings."
        The regularizer (a penalty on large vectors, controlled by $\\lambda$) stops it from overfitting the
        few cells it can see.</li>
        <li><b>Biases and extra signals bolt on cleanly (Equations 3-8).</b> Add per-user and per-item offset
        terms $b_u, b_i$ and a global average $\\mu$, so the dot product only has to model the leftover
        <i>interaction</i>. The paper shows the same framework absorbs implicit feedback, temporal drift,
        and confidence levels.</li>
      </ul>`,
    whyItMattered:
      `<p>This article is the canonical write-up of the method that won the Netflix Prize era. The paper
       reports its team's entry "took over the top spot in the competition" and that matrix factorization is
       "superior to classic nearest-neighbor techniques for producing product recommendations" (abstract and
       conclusion). The "learn a vector per user and per item, predict by dot product" recipe became the
       backbone of industrial recommenders, and the same shape &mdash; <b>embed two kinds of things into a
       shared space and score by dot product</b> &mdash; reappears in word embeddings, two-tower retrieval,
       and modern recommendation systems. The regularized-squared-error-on-observed-entries trick is still
       how you fit a model to a sparse table.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>"A Basic Matrix Factorization Model"</b> &mdash; the heart. It defines $q_i$, $p_u$, the
        dot-product prediction (Equation 1), and the regularized objective (Equation 2). Two pages, fully
        self-contained.</li>
        <li><b>"Learning Algorithms &rarr; Stochastic gradient descent"</b> &mdash; the prediction error
        $e_{ui}$ and the two update rules for $q_i$ and $p_u$. This is exactly what you implement.</li>
        <li><b>"Adding biases"</b> &mdash; Equations 3, 4, 5. The four-part decomposition (global average +
        item bias + user bias + interaction) and the worked Joe/Titanic example.</li>
       </ul>
       <p><b>Skim:</b> "Additional input sources" (implicit feedback, Equation 6), "Temporal dynamics"
       (Equation 7), and "Inputs with varying confidence levels" (Equation 8) &mdash; these show the
       framework's reach but are not needed to build the core. Glance at Figure 2 (the female-versus-male,
       serious-versus-escapist factor space) and Figure 3 (real Netflix factors) for intuition, and Figure 4
       for the accuracy curves.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will hide $30\\%$ of the cells of a true <b>rank-2</b> matrix (a matrix that is exactly the
       product of an $8\\times 2$ and a $2\\times 6$ matrix), then fit a matrix-factorization model with
       $f = 2$ factors on the visible $70\\%$ by gradient descent. Guess before running: on the
       <b>held-out</b> cells the model never saw, will the predicted ratings be close to the true ones, or
       will they be garbage?</p>
       <p>(Hint: a rank-2 matrix has very few real degrees of freedom. If the model finds <i>any</i> pair of
       factor matrices that reproduce the visible cells, the hidden cells come along for free. The surprise
       is how few observations it takes.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the trainer you will build with raw tensors. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li>Inputs: a true ratings matrix <code>R</code> and a boolean <code>mask</code> marking which cells
        are observed (the training set $\\kappa$).</li>
        <li>TODO: create two learnable matrices &mdash; <code>P</code> of shape (users &times; $f$) and
        <code>Q</code> of shape (items &times; $f$) &mdash; initialized small and random.</li>
        <li>TODO: for one observed cell $(u,i)$, predict $\\hat{r}_{ui} = $ <code>P[u] &middot; Q[i]</code>
        (a dot product) and compute the error $e_{ui} = r_{ui} - \\hat{r}_{ui}$.</li>
        <li>TODO: apply the paper's stochastic gradient descent updates
        $q_i \\leftarrow q_i + \\gamma\\,(e_{ui}\\,p_u - \\lambda\\,q_i)$ and
        $p_u \\leftarrow p_u + \\gamma\\,(e_{ui}\\,q_i - \\lambda\\,p_u)$, looping over all observed cells for
        several epochs. (Update $q_i$ using the <i>old</i> $p_u$.)</li>
        <li>TODO: verify your hand-coded gradient against <code>torch.autograd</code>, and measure the
        root-mean-square error (RMSE) on the held-out cells.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The space (&sect;"A Basic Matrix Factorization Model"). Pick a number of <b>latent factors</b> $f$
       &mdash; the paper suggests "20 to 100." A latent factor is a hidden dimension of taste the model
       invents on its own; it is not labelled. Figure 2 imagines two such factors for movies:
       female-oriented versus male-oriented, and serious versus escapist. Each <b>item</b> $i$ gets a vector
       $q_i \\in \\mathbb{R}^f$ whose entries say "how much does this item embody each factor." Each
       <b>user</b> $u$ gets a vector $p_u \\in \\mathbb{R}^f$ whose entries say "how much does this user like
       each factor."</p>
       <p>The prediction (Equation 1). The model's guess for how user $u$ would rate item $i$ is the
       <b>dot product</b> of the two vectors:
       $\\hat{r}_{ui} = q_i^\\top p_u = \\sum_{k=1}^{f} q_{ik}\\,p_{uk}$. The paper: "The resulting dot
       product&hellip; captures the interaction between user $u$ and item $i$ &mdash; the user's overall
       interest in the item's characteristics." If a user loves factor 1 ($p_{u1}$ large) and the item is
       heavy in factor 1 ($q_{i1}$ large), their product is large and pushes the predicted rating up.</p>
       <p>The fitting problem (Equation 2). We do not know $q_i$ and $p_u$ &mdash; we must learn them from the
       ratings we have. Stack the known ratings into the set $\\kappa$ = all $(u,i)$ pairs for which a rating
       $r_{ui}$ exists. The paper's key choice: fit on these observed cells <i>only</i>, and add a penalty so
       the learned vectors do not grow large and overfit. That gives the regularized squared-error objective
       (Equation 2 below). The constant $\\lambda$ "controls the extent of regularization and is usually
       determined by cross-validation."</p>
       <p>The learning rule (&sect;"Learning Algorithms"). The paper presents stochastic gradient descent,
       which "loops through all ratings in the training set." For each observed rating it (a) predicts
       $\\hat{r}_{ui}$ and computes the prediction error
       $e_{ui} \\stackrel{\\text{def}}{=} r_{ui} - q_i^\\top p_u$, then (b) "modifies the parameters by a
       magnitude proportional to $\\gamma$ in the opposite direction of the gradient," yielding the two
       update rules transcribed below. The learning rate is $\\gamma$.</p>
       <p>Biases (Equation 3-4). Much of the signal in ratings is not interaction at all: some users rate
       high, some movies are widely loved. The paper captures this with $b_{ui} = \\mu + b_i + b_u$ (Equation
       3) &mdash; a global average plus an item offset plus a user offset &mdash; and then writes the full
       model $\\hat{r}_{ui} = \\mu + b_u + b_i + q_i^\\top p_u$ (Equation 4), so the dot product only has to
       explain the leftover. Our from-scratch build focuses on the bias-free core (Equations 1-2) and the
       SGD rule, which is the piece PyTorch does not ship as one call.</p>`,
    symbols: [
      { sym: "$r_{ui}$", desc: "the <b>actual rating</b> user $u$ gave item $i$ (e.g. a star rating). Known only for the observed cells." },
      { sym: "$\\hat{r}_{ui}$", desc: "the model's <b>predicted rating</b> for user $u$ on item $i$ (the hat means \"estimate\")." },
      { sym: "$f$", desc: "the <b>number of latent factors</b> &mdash; the length of each user and item vector. The paper uses \"20 to 100.\"" },
      { sym: "$q_i$", desc: "the <b>item factor vector</b>, $q_i \\in \\mathbb{R}^f$: how strongly item $i$ embodies each latent factor (positive or negative)." },
      { sym: "$p_u$", desc: "the <b>user factor vector</b>, $p_u \\in \\mathbb{R}^f$: how much user $u$ is drawn to each latent factor." },
      { sym: "$q_i^\\top p_u$", desc: "the <b>dot product</b> of the two vectors: multiply matching entries and sum. This is the predicted interaction (Equation 1)." },
      { sym: "$\\kappa$", desc: "the <b>training set</b>: the set of $(u,i)$ pairs for which a rating $r_{ui}$ is actually known (the non-empty cells)." },
      { sym: "$\\lambda$", desc: "the <b>regularization strength</b>: how hard we penalize large factor vectors. Larger $\\lambda$ = simpler model, less overfitting. Set by cross-validation." },
      { sym: "$\\lVert q_i\\rVert^2$", desc: "the <b>squared length</b> of vector $q_i$ (sum of its squared entries). Penalizing it keeps the vector small." },
      { sym: "$e_{ui}$", desc: "the <b>prediction error</b> on one observed cell, $e_{ui} = r_{ui} - q_i^\\top p_u$ (paper's definition in \"Learning Algorithms\")." },
      { sym: "$\\gamma$", desc: "the <b>learning rate</b>: the step size for each gradient update. Larger $\\gamma$ moves faster but can overshoot." },
      { sym: "$\\mu$", desc: "the <b>global average rating</b> across all observed cells (used in the bias model, Equations 3-4)." },
      { sym: "$b_u,\\ b_i$", desc: "the <b>user bias and item bias</b>: how far user $u$ (resp. item $i$) tends to rate above or below the global average $\\mu$ (Equation 3)." }
    ],
    formula: `$$ \\hat{r}_{ui} \\;=\\; q_i^\\top p_u $$
              <p>Equation 1 (&sect;"A Basic Matrix Factorization Model"): the predicted rating is the inner product of the item vector $q_i$ and the user vector $p_u$.</p>
              $$ \\min_{q_*,\\,p_*} \\;\\sum_{(u,i)\\in\\kappa} \\big(r_{ui} - q_i^\\top p_u\\big)^2 \\;+\\; \\lambda\\big(\\lVert q_i\\rVert^2 + \\lVert p_u\\rVert^2\\big) $$
              <p>Equation 2: minimize the squared error on the known ratings $\\kappa$ plus a $\\lambda$-weighted penalty on the factor lengths (regularization against overfitting).</p>
              $$ e_{ui} \\;\\stackrel{\\text{def}}{=}\\; r_{ui} - q_i^\\top p_u $$
              $$ q_i \\leftarrow q_i + \\gamma\\,(e_{ui}\\,p_u - \\lambda\\,q_i), \\qquad p_u \\leftarrow p_u + \\gamma\\,(e_{ui}\\,q_i - \\lambda\\,p_u) $$
              <p>Stochastic gradient descent (&sect;"Learning Algorithms"): per observed rating, compute the prediction error $e_{ui}$, then step each factor against the gradient of Equation 2 (learning rate $\\gamma$). This is what we implement.</p>
              $$ b_{ui} \\;=\\; \\mu + b_i + b_u $$
              <p>Equation 3 (&sect;"Adding biases"): a first-order approximation of the bias in rating $r_{ui}$ &mdash; global average $\\mu$, plus item bias $b_i$, plus user bias $b_u$.</p>
              $$ \\hat{r}_{ui} \\;=\\; \\mu + b_i + b_u + q_i^\\top p_u $$
              <p>Equation 4: biases extend Equation 1 &mdash; the rating splits into global average, item bias, user bias, and the interaction $q_i^\\top p_u$, so the dot product only models the leftover.</p>
              $$ \\min_{p_*,\\,q_*,\\,b_*} \\;\\sum_{(u,i)\\in\\kappa} \\big(r_{ui} - \\mu - b_u - b_i - p_u^\\top q_i\\big)^2 \\;+\\; \\lambda\\big(\\lVert p_u\\rVert^2 + \\lVert q_i\\rVert^2 + b_u^2 + b_i^2\\big) $$
              <p>Equation 5: the bias model's training objective &mdash; the same regularized squared error, now also learning $b_u, b_i$ (the biases are penalized too).</p>`,
    whatItDoes:
      `<p>Equation 1 says: to score a (user, item) pair, line up their two vectors and take the dot product.
       That single number is the predicted rating.</p>
       <p>Equation 2 is what we minimize. For every cell we actually observed, take the gap between the true
       rating and the prediction, square it (so over- and under-shoots both count and big misses count more),
       and add it up. Then add $\\lambda$ times the squared lengths of the vectors involved. The first term
       says "fit the data you have"; the $\\lambda$ term says "but keep the vectors small." We never touch the
       unobserved cells &mdash; that is the whole point of summing over $\\kappa$ only.</p>
       <p>The SGD lines say how to descend Equation 2 one rating at a time. Compute the error $e_{ui}$. Then
       nudge each vector in the direction that shrinks that error ($+\\gamma\\,e_{ui}$ times the <i>other</i>
       vector), while pulling it slightly back toward zero ($-\\gamma\\lambda$ times itself, the
       regularization). Repeat over all observed ratings for several passes.</p>
       <p>Equation 4 (biases) splits the prediction into four parts: a global baseline $\\mu$, how generous
       user $u$ is ($b_u$), how loved item $i$ is ($b_i$), and the personalized interaction $q_i^\\top p_u$.
       The paper's example: if all movies average $\\mu = 3.7$ stars, <i>Titanic</i> runs $b_i = +0.5$ above
       average, and Joe is a harsh rater at $b_u = -0.3$, the baseline guess for Joe on Titanic is
       $3.7 + 0.5 - 0.3 = 3.9$ stars &mdash; before any factor interaction.</p>`,
    derivation:
      `<p><b>Where the SGD update comes from.</b> The objective for one observed cell $(u,i)$ is
       $L = (r_{ui} - q_i^\\top p_u)^2 + \\lambda(\\lVert q_i\\rVert^2 + \\lVert p_u\\rVert^2)$. Write
       $e_{ui} = r_{ui} - q_i^\\top p_u$. Differentiate with respect to the item vector $q_i$. The squared
       term has derivative $2\\,e_{ui}\\cdot\\frac{\\partial e_{ui}}{\\partial q_i} = 2\\,e_{ui}\\,(-p_u)$ (chain
       rule, since $e_{ui}$ depends on $q_i$ through $-q_i^\\top p_u$). The penalty term
       $\\lambda\\lVert q_i\\rVert^2$ has derivative $2\\lambda\\,q_i$. So</p>
       <p>$$ \\frac{\\partial L}{\\partial q_i} = -2\\,e_{ui}\\,p_u + 2\\lambda\\,q_i = -2\\big(e_{ui}\\,p_u - \\lambda\\,q_i\\big). $$</p>
       <p>Gradient <i>descent</i> steps in the opposite direction of the gradient:
       $q_i \\leftarrow q_i - \\gamma'\\,\\frac{\\partial L}{\\partial q_i} = q_i + 2\\gamma'(e_{ui}\\,p_u -
       \\lambda\\,q_i)$. Folding the factor of $2$ into the step size ($\\gamma = 2\\gamma'$) gives exactly the
       paper's rule $q_i \\leftarrow q_i + \\gamma\\,(e_{ui}\\,p_u - \\lambda\\,q_i)$. By symmetry, swapping the
       roles of $q_i$ and $p_u$ gives $p_u \\leftarrow p_u + \\gamma\\,(e_{ui}\\,q_i - \\lambda\\,p_u)$. The
       deeper background on gradient descent and on the $\\lambda$ penalty lives in the
       <b>ml-gradient-descent</b> and <b>ml-regularization</b> concept lessons; the recommender setup is in
       <b>cls-recommender</b>.</p>
       <p>Our notebook checks this derivation directly: it computes the autograd gradient of $L$ and confirms
       it equals $-2(e_{ui}\\,p_u - \\lambda\\,q_i)$ to floating-point precision.</p>`,
    example:
      `<p>Work <b>one</b> stochastic gradient descent step by hand, then check it in the notebook. Take a
       single user and item with $f = 2$ factors:</p>
       <ul class="steps">
        <li>$p_u = [\\,1,\\ 2\\,]$, &nbsp; $q_i = [\\,0.5,\\ -1\\,]$, &nbsp; true rating $r_{ui} = 3$, &nbsp;
        learning rate $\\gamma = 0.05$, &nbsp; regularization $\\lambda = 0.1$.</li>
        <li><b>Predict</b> (dot product, Equation 1): $\\hat{r}_{ui} = q_i^\\top p_u = (0.5)(1) + (-1)(2) =
        0.5 - 2 = -1.5$.</li>
        <li><b>Error</b>: $e_{ui} = r_{ui} - \\hat{r}_{ui} = 3 - (-1.5) = 4.5$.</li>
        <li><b>Update</b> $q_i$: $q_i + \\gamma(e_{ui}\\,p_u - \\lambda\\,q_i) = [0.5,-1] + 0.05\\big(4.5\\,[1,2]
        - 0.1\\,[0.5,-1]\\big) = [0.5,-1] + 0.05\\,[4.45,\\ 9.1] = [\\,0.7225,\\ -0.545\\,]$.</li>
        <li><b>Update</b> $p_u$ (using the <i>old</i> $q_i$): $p_u + \\gamma(e_{ui}\\,q_i - \\lambda\\,p_u) =
        [1,2] + 0.05\\big(4.5\\,[0.5,-1] - 0.1\\,[1,2]\\big) = [1,2] + 0.05\\,[2.15,\\ -4.7] =
        [\\,1.1075,\\ 1.765\\,]$.</li>
       </ul>
       <p>The error was a big positive $4.5$ (we under-predicted), so both vectors moved to make their dot
       product larger. These exact numbers &mdash; prediction $-1.5$, error $4.5$, $q_i = [0.7225, -0.545]$,
       $p_u = [1.1075, 1.765]$ &mdash; are recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Set up the data</b>: a ratings matrix <code>R</code> and a boolean <code>mask</code> marking
        the observed cells (the training set $\\kappa$). Choose the factor count $f$.</li>
        <li><b>Initialize factors</b>: a user matrix <code>P</code> (users &times; $f$) and an item matrix
        <code>Q</code> (items &times; $f$), small random values.</li>
        <li><b>Loop over epochs.</b> Each epoch, shuffle the observed cells and visit each $(u,i)$:</li>
        <li>&nbsp;&nbsp;<b>Predict</b> $\\hat{r}_{ui} = $ <code>P[u] &middot; Q[i]</code> and compute
        $e_{ui} = r_{ui} - \\hat{r}_{ui}$.</li>
        <li>&nbsp;&nbsp;<b>Update</b> with the paper's rules, using the old <code>P[u]</code> for the
        <code>Q[i]</code> step: $q_i \\mathrel{+}= \\gamma(e_{ui}p_u - \\lambda q_i)$, then
        $p_u \\mathrel{+}= \\gamma(e_{ui}q_i - \\lambda p_u)$.</li>
        <li><b>Predict the full matrix</b> $\\hat{R} = P\\,Q^\\top$ and report RMSE on the held-out cells.</li>
        <li><b>Verify</b>: confirm the hand-coded gradient $-2(e_{ui}p_u - \\lambda q_i)$ matches
        <code>torch.autograd</code>.</li>
      </ol>`,
    results:
      `<p>The paper's headline is the Netflix Prize result. The abstract states matrix factorization models
       "are superior to classic nearest-neighbor techniques," and Figure 4's caption reports concrete
       root-mean-square error (RMSE) numbers: "the Netflix system achieves RMSE = 0.9514 on the same dataset,
       while the grand prize's required accuracy is RMSE = 0.8563" (lower is better). The text adds that the
       authors' BellKor entry was "8.43 percent better than Netflix" for the 2007 Progress Prize, later
       "9.46 percent" with team Big Chaos. Figure 4 also shows accuracy improving as you add factors and as
       you add biases, implicit feedback, and temporal dynamics on top of plain factorization.</p>
       <p><i>These are the paper's reported numbers, quoted from the abstract and Figure 4. The numbers in
       the CODEVIZ panel below are from our own tiny simulation &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track A (primitive)</b> paper: the prediction is a dot product and the learner is a
       handful of tensor operations, so we build the whole thing <b>from scratch</b> with raw
       <code>torch</code> tensors &mdash; the two factor matrices <code>P</code> and <code>Q</code>, the
       dot-product prediction (Equation 1), and the stochastic gradient descent updates straight from the
       paper. We <b>import nothing</b> for the core training loop. We use <code>torch.autograd</code>
       <i>only as the oracle</i>: it computes the gradient of the regularized squared error, and we assert
       (with <code>torch.allclose</code>) that our hand-coded $-2(e_{ui}p_u - \\lambda q_i)$ matches it &mdash;
       the payoff is "my hand-derived update IS the autograd gradient." The recommender background and the
       Bayes-free fitting intuition are recapped from <b>cls-recommender</b>, <b>ml-gradient-descent</b>, and
       <b>ml-regularization</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Summing over all cells instead of $\\kappa$.</b> The objective (Equation 2) sums over
        <i>observed</i> ratings only. If you treat the empty cells as zeros and fit them, you are training the
        model to predict "no rating" = "zero stars," which is wrong. Mask to the observed set.</li>
        <li><b>Updating $p_u$ with the already-updated $q_i$.</b> The two SGD updates use the values from the
        <i>start</i> of the step. Compute $e_{ui}$ once, then update $q_i$ and $p_u$ from the old vectors. In
        code, clone <code>P[u]</code> before overwriting it if you update <code>Q[i]</code> first.</li>
        <li><b>Forgetting the regularization pull.</b> Drop the $-\\lambda q_i$ term and the vectors grow
        without bound on the observed cells, fitting noise and predicting the held-out cells badly. The
        $\\lambda$ term is what makes a model fit on a few cells generalize to the rest.</li>
        <li><b>Learning rate too large.</b> A big $\\gamma$ makes the dot product overshoot the target and
        oscillate or blow up. If the error grows instead of shrinking across epochs, lower $\\gamma$.</li>
        <li><b>Confusing the asymptotic claim.</b> Recovering a low-rank matrix from few entries works
        because the true matrix really is low rank. On genuinely high-rank, noisy data, a tiny $f$ underfits;
        the paper's "20 to 100 factors" reflects that real ratings need more capacity.</li>
      </ul>`,
    recall: [
      "State the prediction model (Equation 1) from memory: what is $\\hat{r}_{ui}$?",
      "Write the regularized squared-error objective (Equation 2), including the $\\lambda$ term and the set it sums over.",
      "Write the two stochastic gradient descent update rules for $q_i$ and $p_u$.",
      "Define $\\kappa$, $\\lambda$, and $e_{ui}$ in plain English.",
      "In the bias model (Equation 4), what are the four parts of $\\hat{r}_{ui}$?"
    ],
    practice: [
      {
        q: `<b>One SGD step.</b> A user vector is $p_u = [2, 0]$ and an item vector is $q_i = [1, 1]$. The
            true rating is $r_{ui} = 5$, the learning rate is $\\gamma = 0.1$, and $\\lambda = 0$ (no
            regularization for this exercise). Compute the prediction, the error, and the updated $q_i$.`,
        steps: [
          { do: `Predict with Equation 1: $\\hat{r}_{ui} = q_i^\\top p_u = (1)(2) + (1)(0) = 2$.`, why: `The prediction is the dot product of the two vectors.` },
          { do: `Error: $e_{ui} = r_{ui} - \\hat{r}_{ui} = 5 - 2 = 3$.`, why: `Positive error means we under-predicted; the update will raise the dot product.` },
          { do: `Update $q_i$ with $\\lambda = 0$: $q_i + \\gamma\\,e_{ui}\\,p_u = [1,1] + 0.1\\cdot 3\\cdot[2,0] = [1,1] + [0.6, 0] = [1.6, 1]$.`, why: `With no regularization the rule is $q_i \\leftarrow q_i + \\gamma e_{ui} p_u$.` }
        ],
        answer: `<p>Prediction $\\hat{r}_{ui} = 2$, error $e_{ui} = 3$, updated $q_i = [\\mathbf{1.6,\\ 1}]$. The
                 first entry grew (because $p_{u1}=2$ pulled it up) while the second stayed (because
                 $p_{u2}=0$ contributed nothing), nudging the next prediction toward the true $5$.</p>`
      },
      {
        q: `<b>Why sum over $\\kappa$ only?</b> Suppose instead you treat every unobserved cell as a $0$ rating
            and fit the squared error over the <i>entire</i> matrix. Most cells are empty. What does the model
            learn, and why does the paper insist on summing over the observed set $\\kappa$?`,
        steps: [
          { do: `Count where the signal is: in a sparse table the vast majority of cells are unobserved.`, why: `Each user rates only a tiny fraction of items, so empties dominate.` },
          { do: `Treating empties as $0$ makes the dominant objective \"predict 0 everywhere,\" since that is what most cells now demand.`, why: `Squared error over all cells is overwhelmed by the empties, dragging every prediction toward 0.` },
          { do: `Conclude the model would push all dot products toward 0 and ignore the real ratings.`, why: `\"Not yet rated\" is not the same as \"rated zero\" &mdash; conflating them destroys the signal.` }
        ],
        answer: `<p>It would learn to predict near-$0$ for everything, because the empty cells (treated as $0$)
                 swamp the loss. \"Unobserved\" means \"unknown,\" not \"zero.\" The paper sums over $\\kappa$,
                 the observed pairs only, precisely so the model fits real ratings and is free to predict
                 whatever best explains them in the holes. (The paper notes naive <i>imputation</i> of the
                 missing entries is expensive and can distort the data.)</p>`
      },
      {
        q: `<b>The ablation: what does $\\lambda$ cost on clean data?</b> Our notebook recovers a hidden,
            <i>noise-free</i> rank-2 matrix. Predict what happens to the train and held-out RMSE as you sweep
            $\\lambda$ from $0$ upward, and contrast that with what you would expect if the observed ratings
            were noisy (as real ratings are). Explain in terms of Equation 2.`,
        steps: [
          { do: `At $\\lambda = 0$, Equation 2 only rewards fitting the observed cells. Because the true matrix is exactly rank-2, fitting the visible 70% pins down the factors, so the hidden cells come out right too.`, why: `A rank-2 matrix has few degrees of freedom; clean observations fully determine it.` },
          { do: `As $\\lambda$ grows, the penalty $\\lambda(\\lVert q_i\\rVert^2 + \\lVert p_u\\rVert^2)$ pulls the factors toward zero, away from the true solution, so BOTH train and held-out RMSE rise.`, why: `With no noise to guard against, the regularizer only adds bias (underfitting).` },
          { do: `Contrast: if the observed ratings carried noise, $\\lambda = 0$ would chase that noise and the held-out RMSE would form a U with its minimum at a moderate $\\lambda$.`, why: `Regularization earns its keep by trading a little fit for resistance to noise.` }
        ],
        answer: `<p>On clean, exactly low-rank data the regularizer is pure cost: in our run (CODEVIZ panel)
                 $\\lambda = 0$ recovers the hidden cells almost perfectly (held-out RMSE $\\approx 0.0000$),
                 and both train and held-out RMSE rise monotonically as $\\lambda$ grows ($0.179$ at
                 $\\lambda = 0.05$, $0.939$ at $\\lambda = 0.8$). The $\\lambda$ term biases the factors toward
                 zero with no noise to justify it. With <i>noisy</i> ratings the story flips &mdash; held-out
                 RMSE becomes U-shaped and a moderate $\\lambda$ wins. This is the bias-variance trade-off the
                 $\\lambda$ term in Equation 2 controls, and why the paper sets $\\lambda$ by
                 cross-validation.</p>`
      }
    ]
  });

  window.CODE["paper-matrix-factorization"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track A: we <b>build</b> matrix factorization from raw tensors &mdash; two latent factor matrices
       <code>P</code> (users) and <code>Q</code> (items), the dot-product prediction
       $\\hat{r}_{ui} = q_i^\\top p_u$ (Equation 1), and the paper's stochastic gradient descent updates
       $q_i \\leftarrow q_i + \\gamma(e_{ui}p_u - \\lambda q_i)$, $p_u \\leftarrow p_u + \\gamma(e_{ui}q_i -
       \\lambda p_u)$ &mdash; with <b>no</b> library training call. The first cell recomputes the worked
       example: $p_u=[1,2]$, $q_i=[0.5,-1]$, $r=3$ gives prediction $-1.5$, error $4.5$, and updated
       $q_i=[0.7225,-0.545]$, $p_u=[1.1075,1.765]$. We then hide $30\\%$ of a true rank-2 matrix, fit on the
       rest, and recover the held-out cells. Finally we verify the hand-coded gradient against
       <code>torch.autograd</code> with <code>torch.allclose</code> &mdash; the Track A payoff. Paste into
       Colab (torch is preinstalled &mdash; no pip) and run.</p>`,
    code: `import torch
torch.manual_seed(0)

# --- 0. Recompute the lesson's worked SGD step by hand. ---
p_u = torch.tensor([1.0, 2.0])
q_i = torch.tensor([0.5, -1.0])
r_ui, gamma, lam = 3.0, 0.05, 0.1

pred = (q_i * p_u).sum()                 # Eq 1: dot product  -> -1.5
e_ui = r_ui - pred                       # error              ->  4.5
print("pred:", pred.item(), " e_ui:", e_ui.item())
q_new = q_i + gamma * (e_ui * p_u - lam * q_i)   # SGD update for q_i
p_new = p_u + gamma * (e_ui * q_i - lam * p_u)   # SGD update for p_u (uses OLD q_i)
print("q_new:", [round(x,4) for x in q_new.tolist()])   # [0.7225, -0.545]
print("p_new:", [round(x,4) for x in p_new.tolist()])   # [1.1075,  1.765]


# --- 1. Matrix factorization from scratch: recover a hidden low-rank matrix. ---
n_users, n_items, K_true, f = 8, 6, 2, 2
P_true = torch.randn(n_users, K_true)
Q_true = torch.randn(n_items, K_true)
R = P_true @ Q_true.T                     # the TRUE rank-2 ratings matrix

mask = torch.rand(n_users, n_items) < 0.7 # observe 70% of cells (the set K = kappa)
obs  = mask.nonzero(as_tuple=False)       # list of observed (u, i) pairs

P = torch.randn(n_users, f) * 0.1         # learnable user factors
Q = torch.randn(n_items, f) * 0.1         # learnable item factors
gamma, lam = 0.02, 0.05

for epoch in range(4000):                 # loop over the training set, Eq 2 via SGD
    for u, i in obs[torch.randperm(obs.size(0))]:
        e  = R[u, i] - (P[u] @ Q[i])      # e_ui = r_ui - q_i^T p_u
        Pu = P[u].clone()                 # keep OLD p_u for the q_i update
        P[u] = P[u] + gamma * (e * Q[i] - lam * P[u])
        Q[i] = Q[i] + gamma * (e * Pu  - lam * Q[i])

Rhat = P @ Q.T                            # predicted full matrix
train_rmse = ((R[mask]  - Rhat[mask])**2).mean().sqrt()
test_rmse  = ((R[~mask] - Rhat[~mask])**2).mean().sqrt()
print("train RMSE (observed):", round(train_rmse.item(), 4))   # 0.0759
print("test  RMSE (held-out):", round(test_rmse.item(),  4))   # 0.1793
print("R   [0,:3]:", [round(x,3) for x in R[0,:3].tolist()])    # [1.275, 0.462, -0.304]
print("Rhat[0,:3]:", [round(x,3) for x in Rhat[0,:3].tolist()]) # [1.166, 0.39, -0.295]


# --- 2. VERIFY the hand-coded gradient against torch.autograd (the oracle). ---
P2 = P.clone().detach().requires_grad_(True)
Q2 = Q.clone().detach().requires_grad_(True)
u, i = 0, 0
loss = (R[u,i] - (P2[u] @ Q2[i]))**2 + lam*((P2[u]**2).sum() + (Q2[i]**2).sum())
loss.backward()
manual = -2 * ((R[u,i] - (P[u] @ Q[i])) * Q[i] - lam * P[u])    # d/dP[u] of the per-cell loss
print("autograd dL/dP[0]:", [round(x,4) for x in P2.grad[0].tolist()])  # [-0.0413, -0.0485]
print("manual -2(eQ-lamP):", [round(x,4) for x in manual.tolist()])     # [-0.0413, -0.0485]
print("gradient match:", torch.allclose(P2.grad[0], manual, atol=1e-5)) # True
# My hand-derived SGD update IS the autograd gradient -- that's the Track A payoff.`
  };

  window.CODEVIZ["paper-matrix-factorization"] = {
    question: "Can matrix factorization recover the hidden cells of a low-rank matrix from a fraction of its entries, and what does regularization cost when the data is clean?",
    charts: [
      {
        type: "line",
        title: "Matrix factorization RMSE vs regularization lambda (recovering a hidden rank-2 matrix)",
        xlabel: "regularization lambda",
        ylabel: "RMSE (lower is better)",
        series: [
          {
            name: "train RMSE (observed cells)",
            color: "#7ee787",
            points: [[0.0,0.0000],[0.01,0.0157],[0.05,0.0759],[0.1,0.1474],[0.2,0.2802],[0.4,0.5210],[0.8,0.8475]]
          },
          {
            name: "held-out RMSE (hidden cells)",
            color: "#ff7b72",
            points: [[0.0,0.0000],[0.01,0.0394],[0.05,0.1793],[0.1,0.3303],[0.2,0.5719],[0.4,0.8470],[0.8,0.9393]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. An 8x6 matrix that is exactly rank-2 has 30% of its cells hidden; a matrix-factorization model with f=2 factors is trained from scratch by the paper's SGD on the visible 70% for a sweep of lambda. The headline: at lambda=0 the model recovers the hidden cells almost perfectly (held-out RMSE 0.0000) from only 70% of the entries -- because a true rank-2 matrix has very few degrees of freedom, fitting the visible cells pins down the rest. Here the data is noise-free, so the regularizer is pure cost: as lambda grows it pulls the factors toward zero and away from the true solution, so BOTH train (green) and held-out (red) RMSE rise monotonically. Regularization earns its keep only when the observed ratings are noisy (real ratings are) -- then a moderate lambda guards against overfitting that noise; on perfectly clean low-rank data it just underfits.",
    code: `import torch

# Recover a hidden rank-2 matrix at several lambdas; show train vs held-out RMSE.
def run(lam, gamma=0.02, epochs=4000, seed=0):
    torch.manual_seed(seed)
    nU, nI, Kt, f = 8, 6, 2, 2
    R = torch.randn(nU, Kt) @ torch.randn(nI, Kt).T     # true rank-2 matrix
    mask = torch.rand(nU, nI) < 0.7                     # observe 70%
    obs  = mask.nonzero(as_tuple=False)
    P = torch.randn(nU, f) * 0.1
    Q = torch.randn(nI, f) * 0.1
    for _ in range(epochs):
        for u, i in obs[torch.randperm(obs.size(0))]:
            e  = R[u, i] - (P[u] @ Q[i])
            Pu = P[u].clone()
            P[u] = P[u] + gamma * (e * Q[i] - lam * P[u])
            Q[i] = Q[i] + gamma * (e * Pu  - lam * Q[i])
    Rhat = P @ Q.T
    tr = ((R[mask]  - Rhat[mask])**2).mean().sqrt().item()
    te = ((R[~mask] - Rhat[~mask])**2).mean().sqrt().item()
    return tr, te

for lam in [0.0, 0.01, 0.05, 0.1, 0.2, 0.4, 0.8]:
    tr, te = run(lam)
    print(f"lambda={lam:<5} train={tr:.4f}  held-out={te:.4f}")
# lambda=0.0   train=0.0000  held-out=0.0000   <- clean low-rank data: perfect recovery
# lambda=0.01  train=0.0157  held-out=0.0394
# lambda=0.05  train=0.0759  held-out=0.1793
# lambda=0.1   train=0.1474  held-out=0.3303
# lambda=0.2   train=0.2802  held-out=0.5719
# lambda=0.4   train=0.5210  held-out=0.8470
# lambda=0.8   train=0.8475  held-out=0.9393
# Noise-free + exactly rank-2: lambda only hurts. With noisy ratings a moderate
# lambda would instead minimize held-out error (the bias-variance trade-off).`
  };
})();
