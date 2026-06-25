/* Paper lesson — "Factorization Machines" (Steffen Rendle, IEEE ICDM 2010).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-fm".
   GROUNDED from Rendle's "Factorization Machines" PDF (ICDM 2010): the model equation (Eqn 1),
   the inner product (Eqn 3), and Lemma 3.1's linear-time O(kn) reformulation.
   Track B (architecture): implement the 2-way FM prediction on top of torch tensors, use the
   O(kn) trick, verify it equals the naive double sum with torch.allclose, and show FM beats
   plain linear regression on data with feature interactions. */
(function () {
  window.LESSONS.push({
    id: "paper-fm",
    title: "FM — Factorization Machines (2010)",
    tagline: "Learn every pairwise feature interaction with a shared low-rank vector per feature, computed in linear time.",
    module: "Papers · Recommender Systems",
    track: "architecture",
    paper: {
      authors: "Steffen Rendle",
      org: "Osaka University (The Institute of Scientific and Industrial Research)",
      year: 2010,
      venue: "IEEE International Conference on Data Mining (ICDM) 2010",
      citations: "",
      url: "https://cseweb.ucsd.edu/classes/fa17/cse291-b/reading/Rendle2010FM.pdf",
      code: "https://www.libfm.org"
    },
    conceptLink: null,
    partOf: [],
    prereqs: [],

    // WHY READ IT
    problem:
      `<p>Two families of models each had a hole. <b>Support Vector Machines (SVMs)</b> &mdash; a popular
       general-purpose predictor &mdash; can model feature interactions with a polynomial kernel, but on very
       <b>sparse</b> data (almost every feature value is zero, as in recommender systems) they cannot learn
       reliable interaction weights. The paper states it plainly:</p>
       <blockquote>"the only reason why standard SVM predictors are not successful in these tasks is that they
       cannot learn reliable parameters (&lsquo;hyperplanes&rsquo;) in complex (non-linear) kernel spaces under
       very sparse data." (&sect;I)</blockquote>
       <p>Why? With a plain polynomial kernel, the weight for the interaction between feature $i$ and feature
       $j$ is its <b>own independent number</b> $w_{i,j}$. To estimate it you need training examples where
       <i>both</i> $x_i$ and $x_j$ are non-zero at once. Under sparsity those co-occurrences almost never
       happen, so most interaction weights never get a single gradient and stay at their initial value.</p>
       <p>The other family &mdash; <b>factorization models</b> like matrix factorization, SVD++, or PITF
       &mdash; handle sparsity well but "are not applicable for general prediction tasks" (&sect;I): each one is
       hand-derived for one specific input shape (a user-by-item matrix, say) and a new model must be designed
       and coded for every new task.</p>`,
    contribution:
      `<ul>
        <li><b>The Factorization Machine (FM).</b> A single general predictor that works on any real-valued
        feature vector (like an SVM) but estimates interaction weights reliably under sparsity (like a
        factorization model). It does this by <b>factorizing</b> each pairwise interaction weight: instead of a
        free number $w_{i,j}$, it uses the dot product of two learned vectors, $\\langle v_i, v_j \\rangle$.</li>
        <li><b>Shared parameters break the sparsity wall.</b> Because feature $i$'s vector $v_i$ is reused in
        <i>every</i> pair it appears in, an example that touches the pair $(i,k)$ also teaches $v_i$, which
        improves the estimate for the unseen pair $(i,j)$. The paper: "the data for one interaction helps also
        to estimate the parameters for related interactions." (&sect;III-A3)</li>
        <li><b>Linear-time prediction and training.</b> The naive double sum over all pairs costs $O(k\\,n^2)$.
        The paper's <b>Lemma 3.1</b> rewrites it so the model "can be computed in linear time $O(k\\,n)$"
        &mdash; the result this lesson implements and verifies.</li>
       </ul>`,
    whyItMattered:
      `<p>FMs became a workhorse of recommendation and click-through-rate prediction. The paper shows a plain
       FM can <b>mimic</b> several specialized models (biased matrix factorization, SVD++, PITF, FPMC) just by
       choosing the feature encoding &mdash; so one implementation covers many tasks. The factorized-interaction
       idea carried forward into later models (field-aware FMs, and the "wide and deep" / DeepFM family that
       bolts a neural network onto the FM term), making this 2010 paper a direct ancestor of modern
       recommender architectures.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;III-A1 (Model Equation)</b> &mdash; Eqn. (1), the degree-2 FM, plus Eqns. (2)-(3) defining
        the parameters and the inner product. This is the whole model.</li>
        <li><b>&sect;III-A3 (Parameter Estimation Under Sparsity)</b> &mdash; the <i>Alice / Star Trek</i>
        worked argument for why factorized weights still learn when a pair is never observed together. This is
        the paper's central insight; read it slowly.</li>
        <li><b>Lemma 3.1 and its proof (&sect;III-A4)</b> &mdash; the algebra that turns the $O(k\\,n^2)$ double
        sum into the $O(k\\,n)$ form. You will transcribe and implement the last line.</li>
        <li><b>Fig. 1</b> &mdash; the sparse feature-vector picture (user indicators, item indicators, etc.); it
        makes "real-valued feature vector" concrete.</li>
       </ul>
       <p><b>Skim:</b> &sect;IV (FMs vs. SVMs) and &sect;V (FMs vs. other factorization models) unless you want
       the equivalences; &sect;III-D (the $d$-way generalization) on a second pass.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a dataset whose target depends <b>only on products of feature pairs</b> &mdash; for
       example $y$ tracks $x_0 x_1$ &mdash; with no useful single-feature (linear) signal. You fit two models:
       plain <b>linear regression</b> (weight per feature, no interactions) and a <b>Factorization Machine</b>
       (which adds the $\\langle v_i, v_j \\rangle x_i x_j$ term). On held-out test data, which reaches lower
       error, and by roughly how much? Write your guess, then run it.</p>
       <p>(Hint: think about what a model with no interaction term can possibly fit when the signal lives
       entirely in the pairwise products.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the FM forward pass you will implement. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Parameters: a scalar bias <code>w0</code>, a weight vector <code>w</code> of length $n$, and a
        factor matrix <code>V</code> of shape $(n, k)$ &mdash; one length-$k$ vector per feature.</li>
        <li>Linear part: <code>lin = w0 + x @ w</code>.</li>
        <li>TODO &mdash; the interaction term, using the <b>O(kn)</b> trick, NOT a double loop:
        <code>sq_of_sum = (x @ V) ** 2</code> and <code>sum_of_sq = (x**2) @ (V**2)</code>, then
        <code>inter = 0.5 * (sq_of_sum - sum_of_sq).sum(dim=1)</code>.</li>
        <li>TODO &mdash; return <code>lin + inter</code>.</li>
        <li>TODO &mdash; write the <b>naive</b> double-loop version too, and assert
        <code>torch.allclose(fast, naive)</code>.</li>
       </ul>
       <p>Then fit this FM and a plain linear model on interaction-only data and compare test error.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>A Factorization Machine of degree 2 predicts a number from a feature vector $x$ by adding three
       pieces (&sect;III-A1):</p>
       <ol>
        <li>a <b>global bias</b> $w_0$ (one number, the overall average level);</li>
        <li>a <b>linear part</b> $\\sum_i w_i x_i$ (one weight $w_i$ per feature, exactly like linear
        regression);</li>
        <li>a <b>pairwise interaction part</b> $\\sum_{i \\lt j} \\langle v_i, v_j \\rangle\\, x_i x_j$ &mdash;
        for every pair of features $(i,j)$, multiply their values together and weight that product by
        $\\langle v_i, v_j \\rangle$.</li>
       </ol>
       <p>The novelty is entirely in piece 3. A polynomial SVM would give each pair its own free weight
       $w_{i,j}$. The FM instead gives <b>each feature</b> $i$ a short vector $v_i$ of length $k$ (a row of the
       matrix $V$), and defines the pair's weight as the <b>dot product</b> of the two feature vectors,
       $\\langle v_i, v_j \\rangle = \\sum_{f=1}^{k} v_{i,f}\\, v_{j,f}$ (Eqn. 3). Here $k$ is a small chosen
       number (the number of factors). So the $\\binom{n}{2}$ pair weights are not free &mdash; they are all
       generated from just $n$ vectors, and every vector $v_i$ is <b>shared</b> across all pairs that involve
       feature $i$.</p>
       <p>That sharing is what lets FMs learn under sparsity. Suppose features $A$ (a user) and $S$ (an item)
       never appear together in training, so a free weight $w_{A,S}$ would never move. But $A$ co-occurs with
       <i>other</i> items and $S$ co-occurs with <i>other</i> users; those examples shape $v_A$ and $v_S$
       individually, and the pair weight $\\langle v_A, v_S \\rangle$ falls out of vectors that were both
       trained &mdash; even though the pair itself was never seen. The paper walks exactly this <i>Alice /
       Star Trek</i> example in &sect;III-A3.</p>
       <p>One worry remains: summing over all $\\binom{n}{2}$ pairs costs $O(k\\,n^2)$ &mdash; too slow for the
       large, sparse vectors FMs target. <b>Lemma 3.1</b> fixes this with a square-of-sum-minus-sum-of-squares
       identity (below), dropping the cost to <b>linear time $O(k\\,n)$</b>. That reformulation is the part you
       implement and verify.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input feature vector</b>, $n$ real numbers $x_1,\\dots,x_n$. In recommenders it is usually very <b>sparse</b> (almost all entries are zero)." },
      { sym: "$n$", desc: "the <b>number of features</b> (the length of $x$)." },
      { sym: "$\\hat{y}(x)$", desc: "the model's <b>prediction</b> for input $x$ (a real number &mdash; a rating, a score, a click probability before thresholding)." },
      { sym: "$w_0$", desc: "the <b>global bias</b>: a single number added to every prediction (the overall average level)." },
      { sym: "$w_i$", desc: "the <b>linear weight</b> of feature $i$ &mdash; how much feature $i$ on its own pushes the prediction, exactly as in linear regression. The vector of all $w_i$ is $w \\in \\mathbb{R}^n$." },
      { sym: "$v_i$", desc: "the <b>factor vector</b> of feature $i$: a short row of $k$ numbers (row $i$ of the matrix $V$). It is the FM's signature object &mdash; one vector per feature, reused in every pair that feature joins." },
      { sym: "$V$", desc: "the <b>factor matrix</b>, shape $n \\times k$: stacks all the feature vectors $v_i$. (Eqn. 2.)" },
      { sym: "$k$", desc: "the <b>number of factors</b>: the length of each $v_i$. A small chosen number (a hyperparameter). Larger $k$ can express richer interactions; small $k$ generalizes better under sparsity." },
      { sym: "$\\langle v_i, v_j \\rangle$", desc: "the <b>dot product</b> (inner product) of two feature vectors, $\\sum_{f=1}^{k} v_{i,f}\\, v_{j,f}$ (Eqn. 3). This single number is the FM's weight for the interaction between features $i$ and $j$." },
      { sym: "$v_{i,f}$", desc: "the $f$-th entry of feature $i$'s factor vector (a single number)." },
      { sym: "$i \\lt j$", desc: "the index condition under the pairwise sum: count <b>each unordered pair once</b> (the pair $(i,j)$ but not also $(j,i)$, and never $(i,i)$)." },
      { sym: "$O(k\\,n)$", desc: "<b>linear time</b>: the prediction's cost grows in proportion to (number of factors) &times; (number of features), not the square of the feature count. The point of Lemma 3.1." }
    ],
    formula: `$$ \\hat{y}(x) \\;=\\; w_0 \\;+\\; \\sum_{i=1}^{n} w_i\\, x_i \\;+\\; \\sum_{i=1}^{n}\\sum_{j=i+1}^{n} \\langle v_i, v_j \\rangle\\, x_i\\, x_j \\qquad\\text{(Eqn. 1)} $$
$$ \\sum_{i=1}^{n}\\sum_{j=i+1}^{n} \\langle v_i, v_j \\rangle\\, x_i x_j \\;=\\; \\tfrac{1}{2}\\sum_{f=1}^{k}\\!\\left[\\Big(\\sum_{i=1}^{n} v_{i,f}\\, x_i\\Big)^{\\!2} - \\sum_{i=1}^{n} v_{i,f}^{2}\\, x_i^{2}\\right] \\qquad\\text{(Lemma 3.1)} $$`,
    whatItDoes:
      `<p><b>Eqn. 1</b> is the whole 2-way model: bias, plus a linear weight per feature, plus &mdash; for every
       unordered pair $(i,j)$ &mdash; the product $x_i x_j$ scaled by the factorized weight
       $\\langle v_i, v_j \\rangle$. The condition $i \\lt j$ counts each pair once.</p>
       <p><b>Lemma 3.1</b> says that messy double sum equals the right-hand side, which has no nested loop. For
       each factor $f$ you compute one weighted sum $\\sum_i v_{i,f} x_i$, square it, then subtract the
       "diagonal" terms $\\sum_i v_{i,f}^2 x_i^2$ that the square accidentally included, and halve. Read in
       words: <b>"square of the sum, minus sum of the squares, over two."</b> Both sums run once over the $n$
       features, repeated for each of the $k$ factors &mdash; so the cost is $O(k\\,n)$, not $O(k\\,n^2)$.</p>`,
    derivation:
      `<p>This identity is the heart of the lemma, so we derive it in full (the paper's proof, &sect;III-A4).
       Start by noting that the pairwise sum over $i \\lt j$ is exactly <b>half</b> of the full sum over all
       ordered pairs minus the diagonal $i = j$ terms. For any symmetric quantity $a_{ij} = a_{ji}$:</p>
       <p>$$ \\sum_{i \\lt j} a_{ij} \\;=\\; \\tfrac{1}{2}\\Big(\\sum_{i}\\sum_{j} a_{ij} - \\sum_{i} a_{ii}\\Big). $$</p>
       <p>Here $a_{ij} = \\langle v_i, v_j \\rangle\\, x_i x_j$, which is symmetric in $i$ and $j$. Apply the
       identity:</p>
       <p>$$ \\sum_{i \\lt j} \\langle v_i, v_j \\rangle x_i x_j
            = \\tfrac{1}{2}\\Big(\\sum_{i}\\sum_{j} \\langle v_i, v_j \\rangle x_i x_j
                              - \\sum_{i} \\langle v_i, v_i \\rangle x_i x_i\\Big). $$</p>
       <p>Now expand the dot product $\\langle v_i, v_j \\rangle = \\sum_f v_{i,f} v_{j,f}$ and swap the order of
       summation so the factor sum $\\sum_f$ comes outside:</p>
       <p>$$ = \\tfrac{1}{2}\\sum_{f=1}^{k}\\Big(\\sum_{i}\\sum_{j} v_{i,f} x_i\\, v_{j,f} x_j
                                            - \\sum_{i} v_{i,f}^2 x_i^2\\Big). $$</p>
       <p>The double sum $\\sum_i \\sum_j (v_{i,f} x_i)(v_{j,f} x_j)$ <b>factors</b>: a sum over $i$ times the
       same sum over $j$ is just one sum squared, $\\big(\\sum_i v_{i,f} x_i\\big)^2$. That gives the lemma:</p>
       <p>$$ = \\tfrac{1}{2}\\sum_{f=1}^{k}\\Big[\\Big(\\sum_{i} v_{i,f} x_i\\Big)^2
                                            - \\sum_{i} v_{i,f}^2 x_i^2\\Big]. $$</p>
       <p>The squared sum quietly includes the diagonal $i = j$ terms (a feature paired with itself); the second
       sum subtracts them back out, and the $\\tfrac{1}{2}$ corrects for counting each off-diagonal pair twice.
       Each piece is a single pass over the $n$ features, done once per factor &mdash; hence $O(k\\,n)$.</p>`,
    example:
      `<p>Work the interaction term by hand for a tiny case, then confirm the fast form matches the double sum.
       Take $n = 3$ features with values $x = [\\,1,\\ 2,\\ 1\\,]$ and $k = 2$ factors, with feature vectors</p>
       <p>$$ v_1 = [\\,1,\\ 1\\,], \\qquad v_2 = [\\,2,\\ 0\\,], \\qquad v_3 = [\\,0,\\ 1\\,]. $$</p>
       <p><b>Naive double sum</b> over the three pairs (each computed as $\\langle v_i,v_j\\rangle\\, x_i x_j$):</p>
       <ul class="steps">
        <li>Pair $(1,2)$: $\\langle v_1,v_2\\rangle = 1\\cdot2 + 1\\cdot0 = 2$; times $x_1 x_2 = 1\\cdot2 = 2$
        gives $2 \\cdot 2 = 4$.</li>
        <li>Pair $(1,3)$: $\\langle v_1,v_3\\rangle = 1\\cdot0 + 1\\cdot1 = 1$; times $x_1 x_3 = 1\\cdot1 = 1$
        gives $1 \\cdot 1 = 1$.</li>
        <li>Pair $(2,3)$: $\\langle v_2,v_3\\rangle = 2\\cdot0 + 0\\cdot1 = 0$; times $x_2 x_3 = 2\\cdot1 = 2$
        gives $0 \\cdot 2 = 0$.</li>
        <li><b>Naive total</b> $= 4 + 1 + 0 = 5$.</li>
       </ul>
       <p><b>Fast O(kn) form</b>, factor by factor. First the weighted sums $\\sum_i v_{i,f} x_i$:</p>
       <ul class="steps">
        <li>Factor $f = 1$: $\\sum_i v_{i,1} x_i = 1\\cdot1 + 2\\cdot2 + 0\\cdot1 = 5$.</li>
        <li>Factor $f = 2$: $\\sum_i v_{i,2} x_i = 1\\cdot1 + 0\\cdot2 + 1\\cdot1 = 2$.</li>
        <li>So the squared sums are $5^2 = 25$ and $2^2 = 4$.</li>
        <li>Sum of squares $\\sum_i v_{i,f}^2 x_i^2$: for $f=1$, $1\\cdot1 + 4\\cdot4 + 0\\cdot1 = 17$; for
        $f=2$, $1\\cdot1 + 0\\cdot4 + 1\\cdot1 = 2$.</li>
        <li>Per factor: $\\tfrac{1}{2}(25 - 17) = 4$ and $\\tfrac{1}{2}(4 - 2) = 1$. <b>Fast total</b>
        $= 4 + 1 = 5$.</li>
       </ul>
       <p>Both give <b>5</b> &mdash; the fast form equals the double sum. These exact numbers are recomputed in
       the notebook's first cell and checked with <code>torch.allclose</code>.</p>`,
    recipe:
      `<ol>
        <li><b>Parameters:</b> a scalar $w_0$, a vector $w \\in \\mathbb{R}^n$, and a factor matrix
        $V \\in \\mathbb{R}^{n\\times k}$ (one length-$k$ vector per feature).</li>
        <li><b>Linear part:</b> compute $w_0 + x \\cdot w$ (bias plus the per-feature weights).</li>
        <li><b>Interaction part, the O(kn) way:</b> compute $\\text{sq\\_of\\_sum} = (xV)^2$ and
        $\\text{sum\\_of\\_sq} = (x^2)(V^2)$ (both shape "batch &times; $k$"), then
        $\\tfrac{1}{2}\\sum_f(\\text{sq\\_of\\_sum} - \\text{sum\\_of\\_sq})$.</li>
        <li><b>Predict:</b> add the linear and interaction parts.</li>
        <li><b>Verify the math:</b> write the naive $O(kn^2)$ double loop and assert
        <code>torch.allclose(fast, naive)</code> &mdash; the code is the oracle for the lemma.</li>
        <li><b>Reproduce the effect:</b> fit the FM and a plain linear model on data whose target is built from
        feature <i>products</i>; compare test error and ablate the interaction term.</li>
      </ol>`,
    results:
      `<p>On the Netflix rating-prediction task, the paper's Fig. 2 plots test error (root-mean-square error)
       against the number of factors $k$ and shows the Factorization Machine reaching <b>lower</b> error than a
       Support Vector Machine as $k$ grows, with the caption: "FMs succeed in estimating 2-way variable
       interactions in very sparse problems where SVMs fail." The headline complexity claim from Lemma 3.1 is
       that the model "can be computed in linear time $O(k\\,n)$," versus $O(k\\,n^2)$ for the straightforward
       form.</p>
       <p><i>These are the paper's reported results, described from its Fig. 2 and Lemma 3.1. The numbers in the
       CODEVIZ panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the plumbing (tensors, autograd, an optimizer) already
       ships in PyTorch, so you <b>import</b> it and build only the novel idea. <b>Import:</b> <code>torch</code>
       tensor ops, <code>nn.Parameter</code>, an optimizer (<code>Adam</code>), and the loss. <b>Build by
       hand:</b> the FM prediction itself &mdash; in particular the <b>O(kn) interaction term</b> from
       Lemma 3.1 &mdash; plus the <b>naive double-sum</b> reference and the <code>torch.allclose</code> check
       that proves they agree, and the <b>ablation</b> (a plain linear model = FM with the interaction term
       removed). No part of the FM equation is a library call; you write it from the paper.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to subtract the sum-of-squares.</b> $(xV)^2$ alone double-counts and includes the
        $i=j$ diagonal (a feature paired with itself). You must subtract $\\sum_i v_{i,f}^2 x_i^2$ and halve.
        Drop either correction and the fast form will <i>not</i> match the double sum &mdash; the
        <code>allclose</code> check catches it.</li>
        <li><b>Summing pairs twice (or including $i=i$).</b> The model sums over $i \\lt j$ &mdash; each
        unordered pair once, no self-pairs. A naive double loop over all $i,j$ counts every pair twice and adds
        bogus $i=i$ terms.</li>
        <li><b>Expecting FM to beat linear when there is no interaction signal.</b> If the target is purely
        linear in the features, the interaction term has nothing to learn and FM offers no edge (and can even
        overfit). FM wins specifically when the signal lives in feature <i>products</i>.</li>
        <li><b>Reading $\\langle v_i, v_j \\rangle$ as a free weight.</b> It is <b>not</b> stored per pair; it is
        computed on the fly from two shared vectors. That sharing &mdash; not a bigger weight table &mdash; is
        what makes FMs learn under sparsity.</li>
        <li><b>Tiny floating-point gaps.</b> The fast and naive forms can differ by a hair (around $10^{-6}$)
        from float rounding. Use a tolerance (<code>torch.allclose(..., atol=1e-5)</code>), not exact
        equality.</li>
      </ul>`,
    recall: [
      "Write the 2-way FM model equation (Eqn. 1) from memory, including the $i \\lt j$ sum.",
      "Define $\\langle v_i, v_j \\rangle$ and say why FMs do not store a free weight per pair.",
      "State the O(kn) reformulation of the pairwise term in words ('square of the sum minus sum of the squares, over two').",
      "Why can an FM estimate the weight for a feature pair that never co-occurs in training, while a polynomial SVM cannot?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You built data whose target depends only on feature <i>products</i> (e.g.
            $x_0 x_1$ and $x_2 x_3$) and fit an FM that reaches low test error. Now remove the interaction term
            &mdash; keep only $w_0 + \\sum_i w_i x_i$ (a plain linear model of the same features) &mdash; and
            refit. What happens to test error, and what does that isolate?`,
        steps: [
          { do: `Delete the interaction term so the prediction is just $w_0 + x \\cdot w$; keep the same features, optimizer, and data.`, why: `An honest ablation changes exactly one thing &mdash; the $\\langle v_i,v_j\\rangle x_i x_j$ term &mdash; so any difference is attributable to it.` },
          { do: `Refit and read the test mean-squared error: the linear model stays near the variance of the target (it cannot fit the products), while the FM was far lower.`, why: `A single weight per feature cannot represent $x_i x_j$; with $\\pm 1$ features the product averages out and the linear part learns nothing useful.` },
          { do: `Conclude that the factorized interaction term, not extra features or capacity, is what fits the signal.`, why: `Both models see identical features; only the FM has the pairwise term, so the gap pins the win on it.` }
        ],
        answer: `<p>The plain linear model's test error sits near the target's variance &mdash; it essentially
                 predicts the mean &mdash; while the FM's is far lower. Since the two models differ only in the
                 $\\langle v_i,v_j\\rangle x_i x_j$ term, this isolates the <b>factorized interaction</b> as the
                 reason FM fits interaction-driven data. The CODEVIZ panel shows exactly this contrast.</p>`
      },
      {
        q: `Confirm the O(kn) trick by hand on a fresh tiny case. Take $n = 2$, $k = 1$, values
            $x = [\\,3,\\ 1\\,]$, and one factor per feature $v_1 = [\\,2\\,]$, $v_2 = [\\,1\\,]$. Compute the
            interaction both ways and check they agree.`,
        steps: [
          { do: `Naive: there is one pair $(1,2)$. $\\langle v_1,v_2\\rangle = 2\\cdot 1 = 2$; times $x_1 x_2 = 3\\cdot 1 = 3$ gives $2\\cdot 3 = 6$.`, why: `With two features there is exactly one unordered pair, so the double sum is a single term.` },
          { do: `Fast: $\\sum_i v_{i,1} x_i = 2\\cdot 3 + 1\\cdot 1 = 7$, so the squared sum is $49$. Sum of squares $= 4\\cdot 9 + 1\\cdot 1 = 37$.`, why: `One factor ($k=1$), so a single weighted sum, squared, minus the diagonal terms.` },
          { do: `Combine: $\\tfrac{1}{2}(49 - 37) = \\tfrac{1}{2}\\cdot 12 = 6$.`, why: `Square-of-sum minus sum-of-squares, halved &mdash; the lemma's right-hand side.` }
        ],
        answer: `<p>Both give <b>6</b>. The fast form $\\tfrac{1}{2}(49 - 37) = 6$ equals the single pair term
                 $\\langle v_1,v_2\\rangle x_1 x_2 = 6$, confirming Lemma 3.1 on this case &mdash; the squared
                 sum carries the cross term $2(v_{1}x_1)(v_{2}x_2)$ that we want, and subtracting the squares
                 then halving leaves exactly it.</p>`
      },
      {
        q: `A polynomial SVM gives the pair $(A, S)$ its own free weight $w_{A,S}$, while the FM uses
            $\\langle v_A, v_S \\rangle$. Suppose features $A$ and $S$ <b>never co-occur</b> in any training
            example. What happens to each model's estimate of that pair's interaction, and why?`,
        steps: [
          { do: `For the SVM: the gradient of the loss with respect to $w_{A,S}$ is proportional to $x_A x_S$, which is zero in every training example where they do not co-occur.`, why: `A free pair weight only receives a gradient when both features are non-zero together; with no such example it never updates.` },
          { do: `For the FM: $v_A$ gets gradients from every example where $A$ co-occurs with some other feature, and $v_S$ likewise from its own co-occurrences.`, why: `Each factor vector is shared across all pairs the feature joins, so it is trained even when the specific pair $(A,S)$ is absent.` },
          { do: `The FM's estimate $\\langle v_A, v_S \\rangle$ is then well-defined from two trained vectors, despite the pair never being seen.`, why: `The interaction weight is computed from shared parameters, not stored per pair &mdash; this is the paper's sparsity argument (&sect;III-A3).` }
        ],
        answer: `<p>The SVM's $w_{A,S}$ stays at its initial value &mdash; it never receives a gradient because
                 $x_A x_S = 0$ in every example &mdash; so the interaction is effectively unlearnable. The FM's
                 $\\langle v_A, v_S \\rangle$ is built from $v_A$ and $v_S$, each trained on the pairs those
                 features <i>do</i> appear in, so the unseen pair still gets a meaningful weight. This shared,
                 factorized parameterization is exactly why FMs learn interactions under sparsity.</p>`
      }
    ]
  });

  window.CODE["paper-fm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>implement</b> the 2-way FM prediction by hand. The first cell recomputes the lesson's
       worked example ($x=[1,2,1]$, the three feature vectors) <b>two ways</b> &mdash; the naive double sum and
       the O(kn) trick &mdash; and prints both as <b>5.0</b>. Cell 2 builds a batched FM forward pass and
       proves the fast form equals the naive double sum on random inputs with
       <code>torch.allclose</code> (our run: <b>True</b>). Cell 3 makes toy data whose target depends only on
       feature <i>products</i> ($x_0 x_1$, $x_2 x_3$) and fits both an FM and a plain linear model: the FM
       reaches test MSE ~<b>0.047</b> while linear regression is stuck at ~<b>2.91</b> (about the variance of
       the target, ~2.97 &mdash; it learns essentially nothing). Paste into Colab and run; torch is
       preinstalled (no pip).</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Worked example by hand: x=[1,2,1], k=2 factors.  Naive double sum vs O(kn) trick. ---
xw = torch.tensor([1.0, 2.0, 1.0])              # n = 3 feature values
Vw = torch.tensor([[1.0, 1.0],                  # v_1
                   [2.0, 0.0],                  # v_2
                   [0.0, 1.0]])                 # v_3   (shape n x k = 3 x 2)

# naive double sum over pairs i < j
naive = 0.0
for i in range(3):
    for j in range(i + 1, 3):
        naive += (Vw[i] @ Vw[j]) * xw[i] * xw[j]

# O(kn) form: 0.5 * sum_f [ (sum_i v_if x_i)^2 - sum_i v_if^2 x_i^2 ]
sq_of_sum = (xw @ Vw) ** 2                       # per factor: (sum_i v_if x_i)^2
sum_of_sq = (xw ** 2) @ (Vw ** 2)                # per factor: sum_i v_if^2 x_i^2
fast = 0.5 * (sq_of_sum - sum_of_sq).sum()
print("worked example  naive =", float(naive), " fast =", fast.item())   # both 5.0


# --- 1. Batched 2-way FM, using the O(kn) interaction term (Lemma 3.1). ---
def fm_fast(x, w0, w, V):
    lin = w0 + x @ w
    sq_of_sum = (x @ V) ** 2                      # (B, k)
    sum_of_sq = (x ** 2) @ (V ** 2)               # (B, k)
    inter = 0.5 * (sq_of_sum - sum_of_sq).sum(dim=1)
    return lin + inter

def fm_naive(x, w0, w, V):                        # O(k n^2) reference -- the oracle
    lin = x @ w + w0
    B, n = x.shape
    inter = torch.zeros(B)
    for i in range(n):
        for j in range(i + 1, n):
            inter += (V[i] @ V[j]) * x[:, i] * x[:, j]
    return lin + inter

n, k, B = 6, 4, 5
w0 = torch.randn(())
w  = torch.randn(n)
V  = torch.randn(n, k)
x  = torch.randn(B, n)

yf, yn = fm_fast(x, w0, w, V), fm_naive(x, w0, w, V)
print("fast == naive (allclose):", torch.allclose(yf, yn, atol=1e-5))   # True
print("max abs diff:", (yf - yn).abs().max().item())                    # ~1e-6


# --- 2. Reproduce the effect: FM beats plain linear regression on interaction data. ---
N, n = 600, 8
g = torch.Generator().manual_seed(1)
X = (torch.rand(N, n, generator=g) < 0.5).float() * 2 - 1               # +/-1 features
# target lives ENTIRELY in feature products -> no useful linear signal
y = 1.5 * X[:, 0] * X[:, 1] + 1.0 * X[:, 2] * X[:, 3] + 0.2 * torch.randn(N, generator=g)
ntr = 480
Xtr, ytr, Xte, yte = X[:ntr], y[:ntr], X[ntr:], y[ntr:]

class FM(nn.Module):
    def __init__(self, n, k):
        super().__init__()
        self.w0 = nn.Parameter(torch.zeros(()))
        self.w  = nn.Parameter(torch.zeros(n))
        self.V  = nn.Parameter(torch.randn(n, k) * 0.1)
    def forward(self, x):
        return fm_fast(x, self.w0, self.w, self.V)

class LinearReg(nn.Module):                       # the ablation: FM with the interaction term removed
    def __init__(self, n):
        super().__init__()
        self.w0 = nn.Parameter(torch.zeros(()))
        self.w  = nn.Parameter(torch.zeros(n))
    def forward(self, x):
        return self.w0 + x @ self.w

def fit(model, epochs=300, lr=0.05):
    opt, lf = torch.optim.Adam(model.parameters(), lr=lr), nn.MSELoss()
    for _ in range(epochs):
        opt.zero_grad(); lf(model(Xtr), ytr).backward(); opt.step()
    with torch.no_grad():
        return lf(model(Xte), yte).item()

torch.manual_seed(0); fm_mse  = fit(FM(n, k=5))
torch.manual_seed(0); lin_mse = fit(LinearReg(n))
print("var(y_test)        =", round(yte.var(unbiased=False).item(), 4))   # ~2.97
print("Linear  test MSE   =", round(lin_mse, 4))                          # ~2.91 (learns ~nothing)
print("FM (k=5) test MSE  =", round(fm_mse, 4))                           # ~0.047
# Our small run, not the paper's number: FM crushes linear when the signal is in feature products.`
  };

  window.CODEVIZ["paper-fm"] = {
    question: "On data whose target depends only on feature products, does the FM's interaction term beat plain linear regression as training proceeds?",
    charts: [
      {
        type: "line",
        title: "Held-out test MSE per epoch — FM (with interactions) vs plain linear regression",
        xlabel: "epoch",
        ylabel: "test mean-squared error",
        series: [
          {
            name: "Linear (no interactions)",
            color: "#ff7b72",
            points: [[0,2.9569],[10,2.8781],[20,2.9229],[30,2.9034],[41,2.917],[51,2.9171],[61,2.912],[72,2.9105],[82,2.9109],[92,2.9118],[103,2.9108],[113,2.9109],[123,2.9107],[134,2.9107],[144,2.9107],[154,2.9108],[164,2.9107],[175,2.9107],[185,2.9107],[195,2.9108],[206,2.9107],[216,2.9107],[226,2.9108],[237,2.9108],[247,2.9108],[257,2.9108],[268,2.9108],[278,2.9108],[288,2.9108],[299,2.9108]]
          },
          {
            name: "FM (k=5, with ⟨v_i,v_j⟩ x_i x_j)",
            color: "#7ee787",
            points: [[0,2.8448],[10,0.3669],[20,0.1674],[30,0.0774],[41,0.0556],[51,0.0504],[61,0.0535],[72,0.0461],[82,0.0477],[92,0.0476],[103,0.0468],[113,0.0472],[123,0.0471],[134,0.0471],[144,0.0472],[154,0.0471],[164,0.0471],[175,0.0471],[185,0.0471],[195,0.0471],[206,0.0471],[216,0.0471],[226,0.0471],[237,0.0471],[247,0.0471],[257,0.0471],[268,0.047],[278,0.047],[288,0.047],[299,0.047]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Target depends only on feature products ($1.5\\,x_0 x_1 + 1.0\\,x_2 x_3$) on $\\pm 1$ features, 8 features, 480 train / 120 test, Adam. The FM's factorized interaction term drives test MSE down to ~0.047. The plain linear model (same features, interaction term removed — the ablation) never leaves ~2.91, which is about the variance of the target (~2.97): with one weight per feature it cannot represent a product, so it essentially predicts the mean. The only difference between the two curves is the $\\langle v_i,v_j\\rangle x_i x_j$ term.",
    code: `import torch, torch.nn as nn, numpy as np

# FM (with interaction term) vs plain linear regression on interaction-only data.
N, n = 600, 8
g = torch.Generator().manual_seed(1)
X = (torch.rand(N, n, generator=g) < 0.5).float() * 2 - 1
y = 1.5 * X[:, 0] * X[:, 1] + 1.0 * X[:, 2] * X[:, 3] + 0.2 * torch.randn(N, generator=g)
ntr = 480
Xtr, ytr, Xte, yte = X[:ntr], y[:ntr], X[ntr:], y[ntr:]

class FM(nn.Module):
    def __init__(s, n, k):
        super().__init__()
        s.w0 = nn.Parameter(torch.zeros(())); s.w = nn.Parameter(torch.zeros(n))
        s.V  = nn.Parameter(torch.randn(n, k) * 0.1)
    def forward(s, x):                              # O(kn) interaction term (Lemma 3.1)
        return s.w0 + x @ s.w + 0.5 * ((x @ s.V) ** 2 - (x ** 2) @ (s.V ** 2)).sum(1)

class Lin(nn.Module):
    def __init__(s, n):
        super().__init__(); s.w0 = nn.Parameter(torch.zeros(())); s.w = nn.Parameter(torch.zeros(n))
    def forward(s, x): return s.w0 + x @ s.w

def curve(model, epochs=300, lr=0.05):
    opt, lf, te = torch.optim.Adam(model.parameters(), lr=lr), nn.MSELoss(), []
    for _ in range(epochs):
        opt.zero_grad(); lf(model(Xtr), ytr).backward(); opt.step()
        with torch.no_grad(): te.append(lf(model(Xte), yte).item())
    return te

torch.manual_seed(0); fm_c  = curve(FM(n, 5))
torch.manual_seed(0); lin_c = curve(Lin(n))
idx = np.linspace(0, 299, 30).astype(int)
print("FM :", [[int(i), round(fm_c[i], 4)]  for i in idx])
print("LIN:", [[int(i), round(lin_c[i], 4)] for i in idx])
# FM -> ~0.047 test MSE; Linear stuck at ~2.91 (~variance of y). Our small run, not the paper's number.`
  };
})();
