/* Paper lesson — "XGBoost: A Scalable Tree Boosting System", Chen & Guestrin 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-xgboost".
   GROUNDED from arXiv:1603.02754 (abstract) and the ar5iv HTML mirror
   (Section 2.2 "Gradient Tree Boosting", Eqns 2-7; Section 2.3 shrinkage/column subsampling).
   Track B (architecture): the boosting framework already exists (concept cls-gradient-boosting);
   XGBoost's novel contribution is the SECOND-order Taylor objective with per-example gradient g_i
   and hessian h_i, the regularized objective, and the closed-form gain-based split score. We build
   the gradient+hessian split scorer by hand in NumPy on a toy dataset, then confirm against the
   `xgboost` library. The first-order gradient-boosting math lives in concept cls-gradient-boosting;
   here we recap and extend it to second order. */
(function () {
  window.LESSONS.push({
    id: "paper-xgboost",
    title: "XGBoost — A Scalable Tree Boosting System (2016)",
    tagline: "Boosting with a second-order Taylor objective and a regularized, closed-form split score that made gradient boosting fast, accurate, and the go-to Kaggle workhorse.",
    module: "Papers · Classical ML",
    track: "architecture",
    paper: {
      authors: "Tianqi Chen, Carlos Guestrin",
      org: "University of Washington",
      year: 2016,
      venue: "arXiv:1603.02754 (Mar 2016); KDD 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1603.02754",
      code: "https://github.com/dmlc/xgboost"
    },
    conceptLink: "cls-gradient-boosting",
    partOf: [],
    prereqs: ["cls-gradient-boosting", "ml-trees", "ml-ensembles"],

    // WHY READ IT
    problem:
      `<p>Gradient boosting &mdash; building an ensemble (a team of models) by adding decision trees one at a
       time, each new tree trained to fix the leftover error of the ones so far &mdash; was already known to be
       very accurate (see the <b>cls-gradient-boosting</b> concept lesson). But two things held it back in
       practice:</p>
       <ul>
        <li><b>It used only the slope of the loss.</b> Classical gradient boosting fits each new tree to the
        <b>negative gradient</b> (the first derivative) of the loss &mdash; the direction that reduces error.
        It ignores the <b>curvature</b> (the second derivative), so it does not know <i>how big</i> a step each
        region can safely take.</li>
        <li><b>It had no built-in penalty on tree complexity.</b> Trees were grown by a heuristic (e.g. reduce
        squared error) and pruned afterward; there was no single objective that traded off fit against the
        number of leaves and the size of the leaf values, so overfitting and tuning were fiddly.</li>
       </ul>
       <p>On top of the math, existing implementations did not scale: the paper's whole title is about being a
       <b>scalable</b> system. From the abstract: <i>"XGBoost scales beyond billions of examples using far
       fewer resources than existing systems."</i></p>`,
    contribution:
      `<ul>
        <li><b>A regularized objective (Eq. 2).</b> One function to minimize: training loss plus an explicit
        complexity penalty $\\Omega(f) = \\gamma T + \\tfrac12\\lambda\\lVert w\\rVert^2$ on each tree's number
        of leaves $T$ and leaf weights $w$. The whole tree (structure + leaf values) is chosen to optimize
        this.</li>
        <li><b>A second-order Taylor approximation (Section 2.2).</b> Each round, the loss is approximated with
        both its first derivative $g_i$ (gradient) <i>and</i> its second derivative $h_i$ (hessian) per
        example. Using curvature is what lets XGBoost compute the best leaf value and the best split in
        <b>closed form</b>.</li>
        <li><b>A gain-based split formula (Eq. 7).</b> A single algebraic score &mdash; built only from sums of
        $g_i$ and $h_i$ &mdash; says exactly how much a candidate split improves the regularized objective. The
        greedy tree-grower just picks the split with the largest gain.</li>
        <li><b>Systems for scale.</b> A sparsity-aware split finder for missing values, a weighted quantile
        sketch for approximate splits, and cache/sharding tricks &mdash; the engineering that made it "scale
        beyond billions of examples" (abstract).</li>
       </ul>`,
    whyItMattered:
      `<p>XGBoost became the default high-accuracy model for <b>tabular</b> data (rows-and-columns spreadsheets)
       and a fixture in winning Kaggle solutions. The second-order, regularized objective was carried into its
       successors <b>LightGBM</b> and <b>CatBoost</b>, which share the same $g_i$/$h_i$ gain machinery and
       differ mainly in how they grow trees and bin features. For most structured-data problems outside deep
       learning, a gradient-boosted tree ensemble in this lineage is still the first thing practitioners
       reach for.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.1 (Regularized Learning Objective)</b> &mdash; Eq. 2: the loss-plus-complexity objective
        and the definition of $\\Omega$. This is the whole "what are we optimizing" question.</li>
        <li><b>&sect;2.2 (Gradient Tree Boosting)</b> &mdash; the heart of the math you will implement: the
        objective at round $t$, its <b>second-order Taylor expansion</b> in $g_i$ and $h_i$, the simplified
        objective (Eq. 3/4), the <b>optimal leaf weight</b> $w_j^\\ast$ (Eq. 5), the <b>structure score</b>
        (Eq. 6), and the <b>split gain</b> $\\mathcal{L}_{\\text{split}}$ (Eq. 7).</li>
        <li><b>&sect;2.3 (Shrinkage and Column Subsampling)</b> &mdash; the two extra regularizers: scale each
        new tree by a factor $\\eta$ (a learning rate), and sample columns per tree. Short but used in the
        ablation.</li>
       </ul>
       <p><b>Skim:</b> &sect;3 (split-finding algorithms &mdash; exact greedy in &sect;3.1, the approximate /
       quantile-sketch variants), &sect;4 (sparsity-aware system), and &sect;5-6 (cache, sharding, experiments)
       unless you want the systems story. The math you need is six short equations in &sect;2.2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You are choosing where to split a leaf in a boosted tree. Classical gradient boosting looks only at
       the <b>gradient</b> $g_i$ (which direction reduces the loss). XGBoost also uses the <b>hessian</b> $h_i$
       (the curvature). And it adds a penalty $\\lambda$ on the size of leaf values.</p>
       <p>Question: as you <b>increase</b> the regularization strength $\\lambda$, what happens to (a) the
       magnitude of the leaf values the tree assigns, and (b) the gain of a split that separates only a few
       examples? Write your guess and one sentence of reasoning, then check it in the ablation below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the split scorer you will build. Given a candidate split that sends a set of
       examples left ($I_L$) and the rest right ($I_R$), fill in the <code>TODO</code>s:</p>
       <ul>
        <li>For each example $i$ you are given its gradient <code>g[i]</code> and hessian <code>h[i]</code>
        (the first and second derivatives of the loss at the current prediction).</li>
        <li>TODO: compute the leaf sums <code>G_L = sum(g[I_L])</code>, <code>H_L = sum(h[I_L])</code>, and
        likewise <code>G_R</code>, <code>H_R</code> for the right side; let <code>G = G_L + G_R</code>,
        <code>H = H_L + H_R</code>.</li>
        <li>TODO: define a leaf "score" helper <code>s(Gv, Hv) = Gv*Gv / (Hv + lam)</code>.</li>
        <li>TODO: the split gain is <code>0.5 * (s(G_L,H_L) + s(G_R,H_R) - s(G,H)) - gamma</code> (Eq. 7).</li>
        <li>TODO: the optimal value for a leaf is <code>w = -G_leaf / (H_leaf + lam)</code> (Eq. 5).</li>
       </ul>
       <p>Then scan every threshold of a feature, compute this gain for each, and pick the largest. Predict
       what raising <code>lam</code> does to the chosen leaf values.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>XGBoost is gradient boosting, so it builds the model as a <b>sum of trees</b> added one at a time:
       $\\hat{y}_i = \\sum_{k=1}^{K} f_k(x_i)$, where each $f_k$ is a regression tree. At round $t$ we already
       have last round's prediction $\\hat{y}_i^{(t-1)}$ and we want to choose the next tree $f_t$. The novelty
       is <i>what objective</i> $f_t$ is chosen to optimize, and how curvature makes that choice closed-form.</p>

       <p><b>1. The regularized objective (&sect;2.1, Eq. 2).</b> XGBoost does not just minimize training loss;
       it minimizes loss <b>plus a complexity penalty</b> on every tree:</p>
       <p>$$ \\mathcal{L}(\\phi) = \\sum_i l(\\hat{y}_i, y_i) \\;+\\; \\sum_k \\Omega(f_k),
          \\qquad \\Omega(f) = \\gamma T + \\tfrac12 \\lambda \\lVert w \\rVert^2. $$</p>
       <p>Here $l$ is any twice-differentiable loss (squared error for regression, log-loss for
       classification), $T$ is the number of <b>leaves</b> in the tree, $w$ is the vector of <b>leaf values</b>
       (the number each leaf outputs), $\\gamma$ charges a fixed cost per leaf, and $\\lambda$ shrinks the leaf
       values toward $0$. This penalty is the part classical gradient boosting lacked.</p>

       <p><b>2. Second-order Taylor approximation (&sect;2.2).</b> Plugging the new tree into the round-$t$
       objective gives $\\mathcal{L}^{(t)} = \\sum_i l\\!\\left(\\hat{y}_i^{(t-1)} + f_t(x_i),\\, y_i\\right) +
       \\Omega(f_t)$. The loss is hard to optimize directly, so XGBoost approximates it with a <b>Taylor
       expansion to second order</b> around the current prediction &mdash; using both the slope and the
       curvature of $l$:</p>
       <p>$$ \\mathcal{L}^{(t)} \\simeq \\sum_{i=1}^{n}\\Big[\\,l(\\hat{y}_i^{(t-1)}, y_i)
          + g_i\\, f_t(x_i) + \\tfrac12 h_i\\, f_t^2(x_i)\\Big] + \\Omega(f_t), $$</p>
       <p>where $g_i = \\partial_{\\hat{y}^{(t-1)}}\\, l(y_i, \\hat{y}_i^{(t-1)})$ is the <b>gradient</b> (first
       derivative of the loss with respect to the prediction) and $h_i = \\partial^2_{\\hat{y}^{(t-1)}}\\,
       l(y_i, \\hat{y}_i^{(t-1)})$ is the <b>hessian</b> (second derivative). Dropping the constant
       $l(\\hat{y}_i^{(t-1)}, y_i)$ term (it does not depend on $f_t$) leaves the simplified objective the tree
       is actually fit to (Eq. 3).</p>

       <p><b>3. Best leaf value and the structure score (&sect;2.2, Eqs. 4-6).</b> A tree sends each example to
       one leaf. Let $I_j = \\{ i : q(x_i) = j \\}$ be the set of examples that land in leaf $j$. Because every
       example in a leaf gets the <i>same</i> output $w_j$, the objective splits into a separate, simple
       quadratic in each $w_j$:</p>
       <p>$$ \\sum_{j=1}^{T}\\Big[\\big(\\textstyle\\sum_{i\\in I_j} g_i\\big) w_j
          + \\tfrac12\\big(\\textstyle\\sum_{i\\in I_j} h_i + \\lambda\\big) w_j^2\\Big] + \\gamma T. $$</p>
       <p>Minimizing a quadratic $a w + \\tfrac12 b w^2$ gives $w^\\ast = -a/b$, so the <b>optimal leaf value</b>
       is $w_j^\\ast = -G_j/(H_j + \\lambda)$ with $G_j = \\sum_{i\\in I_j} g_i$ and $H_j = \\sum_{i\\in I_j}
       h_i$. Substituting back gives the <b>structure score</b> (Eq. 6) &mdash; how good a fixed tree shape is.</p>

       <p><b>4. The gain-based split (&sect;2.2, Eq. 7).</b> To grow the tree greedily we ask: does splitting a
       leaf into a left child ($I_L$) and a right child ($I_R$) lower the objective? Subtracting the parent's
       structure score from the two children's gives the <b>split gain</b> &mdash; a closed-form number built
       only from sums of $g_i$ and $h_i$. Pick the split (feature + threshold) with the largest gain; stop when
       the best gain is below $\\gamma$ (negative gain means the split is not worth a new leaf). That is the
       whole tree-growing loop.</p>`,
    symbols: [
      { sym: "$y_i$", desc: "the <b>true label</b> of training example $i$ (the number or class we want to predict)." },
      { sym: "$\\hat{y}_i^{(t-1)}$", desc: "the model's <b>current prediction</b> for example $i$ after the first $t-1$ trees, before this round's tree is added." },
      { sym: "$f_t$", desc: "the <b>$t$-th tree</b> we are about to add &mdash; a regression tree mapping an input $x_i$ to a leaf value." },
      { sym: "$l(\\hat{y}, y)$", desc: "the <b>loss</b>: how wrong a prediction is. Must be twice-differentiable (squared error, log-loss). XGBoost only ever touches it through its two derivatives." },
      { sym: "$g_i$", desc: "the <b>gradient</b> &mdash; first derivative of the loss with respect to the prediction, $g_i=\\partial_{\\hat{y}^{(t-1)}} l(y_i,\\hat{y}_i^{(t-1)})$. The slope: which way to move." },
      { sym: "$h_i$", desc: "the <b>hessian</b> &mdash; second derivative of the loss with respect to the prediction, $h_i=\\partial^2_{\\hat{y}^{(t-1)}} l(y_i,\\hat{y}_i^{(t-1)})$. The curvature: how big a step is safe." },
      { sym: "$\\Omega(f)$", desc: "the <b>complexity penalty</b> on a tree: $\\gamma T + \\tfrac12\\lambda\\lVert w\\rVert^2$. Charges for leaves and for large leaf values." },
      { sym: "$T$", desc: "the <b>number of leaves</b> in the tree (its size / complexity)." },
      { sym: "$w_j$", desc: "the <b>value (weight) output by leaf $j$</b> &mdash; the number every example in that leaf is assigned. $w$ is the whole vector of leaf values." },
      { sym: "$\\gamma$", desc: "the <b>per-leaf cost</b> (Greek gamma). A split must improve the objective by more than $\\gamma$ to be kept; raising it prunes more." },
      { sym: "$\\lambda$", desc: "the <b>leaf-value penalty</b> (Greek lambda / L2 regularization). Sits in the denominator $H_j+\\lambda$, shrinking leaf values toward $0$." },
      { sym: "$I_j$", desc: "the <b>set of examples that land in leaf $j$</b>: $I_j=\\{i: q(x_i)=j\\}$, where $q$ maps an input to its leaf." },
      { sym: "$G_j,\\,H_j$", desc: "the <b>leaf sums</b> $G_j=\\sum_{i\\in I_j} g_i$ and $H_j=\\sum_{i\\in I_j} h_i$ &mdash; the only statistics a leaf needs." },
      { sym: "$G_L,H_L,\\;G_R,H_R$", desc: "the gradient/hessian sums of the <b>left</b> and <b>right</b> children of a candidate split (and $G=G_L+G_R$, $H=H_L+H_R$ for the parent)." },
      { sym: "$\\eta$", desc: "the <b>shrinkage / learning rate</b> (Greek eta, &sect;2.3): each new tree's contribution is scaled by $\\eta\\lt1$ so later trees can still help." },
      { sym: "$\\mathcal{L}_{\\text{split}}$", desc: "the <b>split gain</b> (Eq. 7): how much the objective drops if a leaf is split into $I_L$ and $I_R$. Larger is better; below $0$ means do not split." }
    ],
    formula: `$$ \\mathcal{L}(\\phi) = \\sum_i l(\\hat{y}_i, y_i) + \\sum_k \\Omega(f_k), \\quad \\Omega(f)=\\gamma T + \\tfrac12\\lambda\\lVert w\\rVert^2 \\qquad\\text{(Eq. 2)} $$
$$ \\mathcal{L}_{\\text{split}} = \\tfrac12\\!\\left[\\frac{G_L^2}{H_L+\\lambda} + \\frac{G_R^2}{H_R+\\lambda} - \\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}\\right] - \\gamma \\qquad\\text{(Eq. 7)} $$`,
    whatItDoes:
      `<p><b>Equation 2</b> is the thing XGBoost minimizes: the sum of the per-example losses <b>plus</b> a
       penalty $\\Omega$ on every tree. $\\Omega = \\gamma T + \\tfrac12\\lambda\\lVert w\\rVert^2$ charges
       $\\gamma$ for each leaf and shrinks the leaf values via $\\lambda$ &mdash; so the tree is built to fit
       the data <i>and</i> stay simple, in one objective.</p>
       <p><b>Equation 7</b> is the split score. Each term $\\frac{G^2}{H+\\lambda}$ is a leaf's contribution to
       the (negated) structure score &mdash; how much that group of examples lowers the objective. The gain is
       <b>(left leaf score) + (right leaf score) &minus; (parent leaf score)</b>, halved, minus the per-leaf
       cost $\\gamma$. If splitting the examples into two groups explains them better than keeping them
       together, the bracket is positive; subtracting $\\gamma$ asks "is that improvement worth a new leaf?".
       The tree-grower simply tries every feature and threshold and keeps the split with the largest
       $\\mathcal{L}_{\\text{split}}$.</p>`,
    derivation:
      `<p><b>Recap &mdash; first-order story is in the concept lesson; here is the second-order extension.</b>
       Classical gradient boosting (concept <b>cls-gradient-boosting</b>) fits each new tree to the negative
       gradient $-g_i$ by least squares &mdash; a first-order step. XGBoost keeps the curvature too. Start from
       the round-$t$ objective and Taylor-expand the loss to <b>second order</b> in the small added prediction
       $f_t(x_i)$:</p>
       <p>$$ l(\\hat{y}_i^{(t-1)} + f_t(x_i),\\, y_i) \\approx
          l(\\hat{y}_i^{(t-1)}, y_i) + g_i f_t(x_i) + \\tfrac12 h_i f_t^2(x_i). $$</p>
       <p>The first term is constant in $f_t$, so drop it. Now group examples by leaf: every $x_i$ in leaf $j$
       has $f_t(x_i)=w_j$, so the sum over examples becomes a sum over leaves, and inside each leaf the
       objective is a plain quadratic in the single number $w_j$:</p>
       <p>$$ \\text{(leaf } j\\text{):}\\quad G_j\\, w_j + \\tfrac12 (H_j + \\lambda)\\, w_j^2,
          \\qquad G_j=\\sum_{i\\in I_j} g_i,\\;\\; H_j=\\sum_{i\\in I_j} h_i. $$</p>
       <p>The $\\lambda$ comes from the $\\tfrac12\\lambda w_j^2$ penalty. Minimizing $a w + \\tfrac12 b w^2$
       (set derivative $a + b w = 0$) gives $w_j^\\ast = -G_j/(H_j+\\lambda)$ (<b>Eq. 5</b>), and the minimum
       value is $-\\tfrac12 G_j^2/(H_j+\\lambda)$. Summing over leaves and adding $\\gamma T$ gives the
       <b>structure score</b> (<b>Eq. 6</b>):</p>
       <p>$$ \\tilde{\\mathcal{L}}^{(t)}(q) = -\\tfrac12 \\sum_{j=1}^{T} \\frac{G_j^2}{H_j+\\lambda} + \\gamma T. $$</p>
       <p>The <b>split gain</b> (<b>Eq. 7</b>) is just this score for the parent leaf minus the score for the two
       children: parent contributes $-\\tfrac12\\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}$, the children contribute
       $-\\tfrac12\\frac{G_L^2}{H_L+\\lambda}-\\tfrac12\\frac{G_R^2}{H_R+\\lambda}$, and splitting adds one leaf
       (cost $\\gamma$). Because the score is <i>negative</i> the structure score, the <i>reduction</i> in
       objective from splitting is the children minus the parent &mdash; exactly the bracket in Eq. 7. For
       squared-error loss $l=\\tfrac12(\\hat{y}-y)^2$, $g_i = \\hat{y}_i^{(t-1)} - y_i$ (the residual, negated)
       and $h_i = 1$, so XGBoost <i>contains</i> first-order least-squares boosting as the special case $h_i=1,
       \\lambda=0$.</p>`,
    example:
      `<p>Work one split by hand. Take squared-error loss, so for each example $h_i = 1$ and the gradient is
       $g_i = \\hat{y}_i^{(t-1)} - y_i$. Suppose the current prediction is $0$ for everyone, and we have
       <b>4 examples</b> sorted by one feature with labels $y = [2,\\,3,\\,-1,\\,-2]$. Then
       $g_i = 0 - y_i = [-2,\\,-3,\\,1,\\,2]$ and $h_i = [1,1,1,1]$. Use $\\lambda = 1$, $\\gamma = 0$.</p>
       <ul class="steps">
        <li><b>Parent sums.</b> $G = -2-3+1+2 = -2$, $\\;H = 1+1+1+1 = 4$. Parent leaf score
        $\\dfrac{G^2}{H+\\lambda} = \\dfrac{(-2)^2}{4+1} = \\dfrac{4}{5} = 0.8$.</li>
        <li><b>Try the split after example 2</b> (left = first two, right = last two).
        $G_L = -2-3 = -5,\\; H_L = 2$; $\\;G_R = 1+2 = 3,\\; H_R = 2$.
        Left score $\\dfrac{(-5)^2}{2+1} = \\dfrac{25}{3} \\approx 8.333$; right score
        $\\dfrac{3^2}{2+1} = \\dfrac{9}{3} = 3$.</li>
        <li><b>Gain (Eq. 7).</b>
        $\\mathcal{L}_{\\text{split}} = \\tfrac12\\,[\\,8.333 + 3 - 0.8\\,] - 0
        = \\tfrac12\\,(10.533) \\approx \\mathbf{5.267}$. Large and positive &mdash; this split is excellent.</li>
        <li><b>Optimal leaf values (Eq. 5).</b> Left $w_L^\\ast = -G_L/(H_L+\\lambda) = -(-5)/(2+1) =
        \\tfrac{5}{3} \\approx 1.667$; right $w_R^\\ast = -3/(2+1) = -1.0$. The left leaf predicts $+1.667$
        (its labels were positive), the right $-1.0$ &mdash; exactly the right directions.</li>
        <li><b>Now raise $\\lambda$ to $10$.</b> Left $w_L^\\ast = 5/(2+10) \\approx 0.417$, right
        $w_R^\\ast = -3/12 = -0.25$: the leaf values <b>shrink toward 0</b>, and the gain drops too
        ($\\tfrac12[\\,25/12 + 9/12 - 4/14\\,] \\approx 1.27$). That is the regularization ablation.</li>
       </ul>
       <p>Every number here ($G,H$, the per-split gains, $w^\\ast$, and the $\\lambda$ sweep) is recomputed in
       the notebook's first cells and must match.</p>`,
    recipe:
      `<ol>
        <li><b>Compute $g_i,h_i$.</b> For the chosen loss, evaluate the gradient and hessian at the current
        predictions. (Squared error: $g_i=\\hat{y}_i-y_i$, $h_i=1$. Log-loss: $g_i=p_i-y_i$,
        $h_i=p_i(1-p_i)$ with $p_i$ the predicted probability.)</li>
        <li><b>Grow one tree greedily.</b> Start with all examples in the root. For each feature, sort the
        examples and sweep every threshold, maintaining running $G_L,H_L$ (and $G_R,H_R$ as the complement);
        score each candidate with the gain (Eq. 7). Pick the largest gain across all features.</li>
        <li><b>Split if worth it.</b> If the best gain $\\gt 0$ (i.e. exceeds $\\gamma$), split and recurse on
        each child until a max depth / min-child-weight / no-positive-gain stop.</li>
        <li><b>Set leaf values</b> with $w_j^\\ast = -G_j/(H_j+\\lambda)$ (Eq. 5).</li>
        <li><b>Add the tree</b> to the ensemble, scaled by the learning rate: $\\hat{y}_i \\mathrel{+{=}}
        \\eta\\, f_t(x_i)$ (&sect;2.3 shrinkage). Recompute $g_i,h_i$ and repeat for the next round.</li>
        <li><b>Ablate</b> $\\lambda$ (and $\\gamma$): watch leaf values shrink and gains shrink as $\\lambda$
        grows &mdash; the regularization knob.</li>
      </ol>`,
    results:
      `<p>The paper's headline is scale and adoption, quoted from the abstract: <i>"a scalable end-to-end tree
       boosting system called XGBoost, which is used widely by data scientists to achieve state-of-the-art
       results on many machine learning challenges"</i> and <i>"XGBoost scales beyond billions of examples
       using far fewer resources than existing systems."</i> The systems sections report large end-to-end
       speedups from the cache-aware and out-of-core design.</p>
       <p><i>These are the paper's own statements, quoted from the abstract. The numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the boosting framework already exists (concept
       <b>cls-gradient-boosting</b>), so we <b>import</b> the idea and build only XGBoost's novel piece. <b>Build
       by hand (NumPy):</b> the per-example gradient $g_i$ and hessian $h_i$, the leaf-sum statistics
       $G,H$, the <b>gain formula</b> (Eq. 7), the <b>optimal leaf value</b> (Eq. 5), the greedy threshold
       sweep that grows one tree, and the $\\lambda$ <b>ablation</b>. <b>Confirm with the library:</b> we then
       fit the actual <code>xgboost</code> library on the same toy data (the notebook setup cell auto-installs
       it) and check that our hand-computed first-tree gain and predictions agree with XGBoost's. The
       first-order least-squares boosting math is recapped from cls-gradient-boosting, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting $\\lambda$ is in the denominator, not added to the gradient.</b> The leaf value is
        $-G/(H+\\lambda)$ and each gain term is $G^2/(H+\\lambda)$. $\\lambda$ shrinks values by inflating the
        denominator; it does not change $G$. Putting it on $G$ gives nonsense.</li>
        <li><b>Using the wrong hessian for the loss.</b> Squared error has $h_i=1$ (constant), so the second
        order reduces to ordinary residual fitting. But log-loss has $h_i=p_i(1-p_i)$, which <i>varies</i> per
        example &mdash; confident predictions ($p$ near $0$ or $1$) get tiny hessians and so small, cautious
        leaf values. Hard-coding $h_i=1$ for classification is a classic bug.</li>
        <li><b>Reading the gain sign backwards.</b> The structure score (Eq. 6) is <i>negative</i>
        $\\tfrac12\\sum G^2/(H+\\lambda)$; the <b>gain</b> (Eq. 7) is children-minus-parent, so a <b>positive</b>
        gain means split. A negative gain (below $\\gamma$) means leave the leaf alone.</li>
        <li><b>Not subtracting the parent term.</b> $G^2/(H+\\lambda)$ is <i>not</i> super-additive: you must
        subtract the parent's $\\frac{(G_L+G_R)^2}{H_L+H_R+\\lambda}$. Scoring children alone always looks
        positive and would split everything.</li>
        <li><b>Comparing to the library without matching settings.</b> To match the hand math, fit
        <code>xgboost</code> with <code>reg_lambda</code> = your $\\lambda$, <code>gamma</code> = your
        $\\gamma$, <code>base_score=0.5</code> or <code>0</code> as appropriate, one tree, and the same
        objective &mdash; otherwise the defaults (e.g. $\\lambda=1$, a base margin) will shift the numbers.</li>
      </ul>`,
    recall: [
      "State the regularized objective (Eq. 2) and what $\\gamma$ and $\\lambda$ penalize.",
      "Write the second-order Taylor approximation of the round-$t$ loss in terms of $g_i$ and $h_i$.",
      "Define $g_i$ and $h_i$ in one sentence each.",
      "Write the optimal leaf value $w_j^\\ast$ (Eq. 5) and the split gain $\\mathcal{L}_{\\text{split}}$ (Eq. 7) from memory.",
      "For squared-error loss, what are $g_i$ and $h_i$? Why does XGBoost then reduce to residual fitting?"
    ],
    practice: [
      {
        q: `<b>The regularization ablation.</b> Using the worked example's four examples
            ($g=[-2,-3,1,2]$, $h=[1,1,1,1]$), recompute the gain of the "split after example 2" and the two
            optimal leaf values for $\\lambda=1$ and then for $\\lambda=10$ (with $\\gamma=0$). What happens to
            the leaf magnitudes and to the gain as $\\lambda$ grows, and why?`,
        steps: [
          { do: `Leaf sums are unchanged: $G_L=-5,H_L=2$; $G_R=3,H_R=2$; parent $G=-2,H=4$.`, why: `$\\lambda$ does not touch the gradient/hessian sums &mdash; it only enters the denominator $H+\\lambda$.` },
          { do: `$\\lambda=1$: $w_L^\\ast=5/3\\approx1.667$, $w_R^\\ast=-1.0$; gain $=\\tfrac12[25/3+9/3-4/5]\\approx5.27$.`, why: `Eq. 5 and Eq. 7 with $\\lambda=1$ &mdash; the values are large and the split is very valuable.` },
          { do: `$\\lambda=10$: $w_L^\\ast=5/12\\approx0.417$, $w_R^\\ast=-3/12=-0.25$; gain $=\\tfrac12[25/12+9/12-4/14]\\approx1.27$.`, why: `Bigger denominators shrink both the leaf values and every $G^2/(H+\\lambda)$ term, so the gain drops too.` }
        ],
        answer: `<p>Raising $\\lambda$ from $1$ to $10$ <b>shrinks the leaf values toward 0</b> ($1.667\\to0.417$,
                 $-1.0\\to-0.25$) and <b>lowers the gain</b> ($\\approx5.27\\to\\approx1.27$). Both follow from
                 $\\lambda$ sitting in the denominator $H+\\lambda$: it penalizes large leaf values and makes
                 splits that rest on few examples (small $H$) less attractive. That is exactly the bias-variance
                 knob &mdash; more $\\lambda$ = simpler, more conservative trees.</p>`
      },
      {
        q: `Why does XGBoost need the <b>hessian</b> $h_i$ at all, when classical gradient boosting gets by with
            only the gradient $g_i$? Give the concrete role $h_i$ plays in the leaf value and the gain.`,
        steps: [
          { do: `Look at the leaf value $w_j^\\ast=-G_j/(H_j+\\lambda)$ &mdash; the hessian sum $H_j$ sets the step size.`, why: `Curvature tells you how sharply the loss bends, so $H_j$ scales how far the leaf can safely move; first-order boosting must guess this via a line search.` },
          { do: `Look at the gain $G^2/(H+\\lambda)$ &mdash; $H$ weights how trustworthy a region is.`, why: `Examples with small curvature (confident, in log-loss) contribute little $h$, so the optimal value and gain are computed in closed form per leaf instead of by a separate line search.` },
          { do: `Note that for squared error $h_i=1$, so the two coincide.`, why: `That is why first-order least-squares boosting is the special case $h_i=1$; the hessian only earns its keep for losses with varying curvature like log-loss.` }
        ],
        answer: `<p>The hessian supplies the <b>curvature</b>, which lets XGBoost compute the best leaf value
                 $w^\\ast=-G/(H+\\lambda)$ and the split gain $G^2/(H+\\lambda)$ in <b>closed form</b>, with the
                 right step size per region &mdash; no separate line search. For squared-error loss $h_i=1$ and it
                 reduces to ordinary residual boosting; for log-loss $h_i=p(1-p)$ varies, so confident points get
                 smaller, more cautious leaf updates. The hessian is what makes the second-order objective both
                 exact and fast.</p>`
      },
      {
        q: `You scan a feature and find the best split has gain $-0.4$ with $\\gamma=0$ (and $0.5$ with
            $\\gamma=1$). Do you split? What does the answer say about the role of $\\gamma$?`,
        steps: [
          { do: `Recall the rule: split only if $\\mathcal{L}_{\\text{split}}\\gt0$ (the gain already has $-\\gamma$ baked in).`, why: `Eq. 7 ends in $-\\gamma$; a non-positive gain means the split does not improve the regularized objective enough to justify a new leaf.` },
          { do: `Case $\\gamma=0$: gain $=-0.4\\lt0$ &rarr; do <b>not</b> split.`, why: `Even free of the per-leaf cost, the bracket itself is negative &mdash; the two groups are not separable enough.` },
          { do: `Case $\\gamma=1$: a reported gain of $0.5$ means the bracket was $1.5$ before subtracting $\\gamma=1$. $1.5-1=0.5\\gt0$ &rarr; split.`, why: `Same data, different $\\gamma$: a smaller $\\gamma$ keeps more splits, a larger one prunes them &mdash; the per-leaf complexity cost.` }
        ],
        answer: `<p>With $\\gamma=0$ the gain is $-0.4\\lt0$, so you do <b>not</b> split. With $\\gamma=1$ the
                 (different) reported gain of $0.5\\gt0$, so you <b>do</b>. $\\gamma$ is the minimum improvement a
                 split must buy to be worth an extra leaf: it is the pruning knob built directly into the gain
                 formula, so XGBoost prunes <i>while</i> growing rather than afterward.</p>`
      }
    ]
  });

  window.CODE["paper-xgboost"] = {
    lib: "Python (NumPy + xgboost)",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> XGBoost's novel piece &mdash; the second-order, regularized split scorer
       &mdash; by hand in NumPy, then <b>confirm</b> it against the real <code>xgboost</code> library on the
       same toy data. The first cell recomputes the lesson's worked example (gain $\\approx5.27$, leaf values
       $1.667$ and $-1.0$). The second sweeps every threshold to grow the root split. The third runs the
       $\\lambda$ ablation (leaf values and gain shrink as $\\lambda$ grows). The last cell fits a one-tree
       <code>xgboost</code> model with matched <code>reg_lambda</code>/<code>gamma</code> and checks the
       library's first split agrees with ours. Paste into Colab and run &mdash; the setup cell pip-installs
       <code>xgboost</code> if needed.</p>`,
    code: `# Setup: xgboost is not preinstalled in Colab -> install it (numpy already is).
# (Safe to re-run; no-op if already present.)
try:
    import xgboost  # noqa
except ImportError:
    import subprocess, sys
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", "xgboost"], check=True)

import numpy as np
np.set_printoptions(precision=4, suppress=True)

# ---------------------------------------------------------------------------
# 0. The lesson's worked example, by hand. Squared-error loss => h_i = 1,
#    g_i = yhat - y. Current prediction yhat = 0 for everyone.
# ---------------------------------------------------------------------------
y = np.array([2.0, 3.0, -1.0, -2.0])      # labels, sorted by the one feature
g = 0.0 - y                                # gradient g_i = yhat - y  = [-2,-3,1,2]
h = np.ones_like(y)                        # hessian h_i = 1
lam, gamma = 1.0, 0.0

def leaf_score(G, H):     return G * G / (H + lam)        # G^2 / (H + lambda)
def leaf_value(G, H):     return -G / (H + lam)           # Eq. 5:  w* = -G/(H+lambda)

# Split "after example 2": left = first two, right = last two.
G_L, H_L = g[:2].sum(), h[:2].sum()        # -5, 2
G_R, H_R = g[2:].sum(), h[2:].sum()        #  3, 2
G,   H   = g.sum(),     h.sum()            # -2, 4

gain = 0.5 * (leaf_score(G_L, H_L) + leaf_score(G_R, H_R) - leaf_score(G, H)) - gamma  # Eq. 7
print("parent G,H =", (G, H), " leaf score =", round(leaf_score(G, H), 4))
print("left  G,H =", (G_L, H_L), " right G,H =", (G_R, H_R))
print("GAIN of split-after-2 =", round(gain, 4))                 # ~ 5.2667
print("leaf values:  w_L* =", round(leaf_value(G_L, H_L), 4),
      " w_R* =", round(leaf_value(G_R, H_R), 4))                 # 1.6667, -1.0

# ---------------------------------------------------------------------------
# 1. Greedy root split: sweep EVERY threshold of the feature, score each.
# ---------------------------------------------------------------------------
def best_split(g, h, lam=1.0, gamma=0.0):
    G_tot, H_tot = g.sum(), h.sum()
    best = (-np.inf, None)
    GL = HL = 0.0
    for k in range(1, len(g)):                 # split between sorted positions k-1 and k
        GL += g[k - 1]; HL += h[k - 1]
        GR, HR = G_tot - GL, H_tot - HL
        gain = 0.5 * (GL*GL/(HL+lam) + GR*GR/(HR+lam) - G_tot*G_tot/(H_tot+lam)) - gamma
        if gain > best[0]:
            best = (gain, k)
    return best

best_gain, k = best_split(g, h, lam, gamma)
print("\\nbest split position =", k, " best gain =", round(best_gain, 4))  # k=2, ~5.2667

# ---------------------------------------------------------------------------
# 2. ABLATION: regularization lambda. Larger lambda -> smaller leaf values & gain.
# ---------------------------------------------------------------------------
print("\\nlambda  |  w_L*    w_R*   |  gain")
for lam_ab in [0.0, 1.0, 10.0, 100.0]:
    wL = -G_L / (H_L + lam_ab); wR = -G_R / (H_R + lam_ab)
    gn = 0.5 * (G_L*G_L/(H_L+lam_ab) + G_R*G_R/(H_R+lam_ab)
                - G*G/(H+lam_ab))               # gamma = 0
    print(f"{lam_ab:6.1f}  | {wL:6.3f}  {wR:6.3f}  | {gn:6.3f}")
# leaf values shrink toward 0 and the gain falls as lambda rises -> regularization.

# ---------------------------------------------------------------------------
# 3. Confirm with the real xgboost library on the SAME toy data.
#    One tree, depth 1, matched reg_lambda/gamma, base_score=0.
# ---------------------------------------------------------------------------
import xgboost as xgb
X = np.array([[0.0], [1.0], [2.0], [3.0]])     # one feature, already sorted
dtrain = xgb.DMatrix(X, label=y)
params = dict(objective="reg:squarederror", max_depth=1, eta=1.0,
              reg_lambda=lam, gamma=gamma, base_score=0.0,
              min_child_weight=0, tree_method="exact")
bst = xgb.train(params, dtrain, num_boost_round=1)
print("\\nxgboost dumped tree:\\n", bst.get_dump()[0])
print("xgboost first-tree predictions:", bst.predict(dtrain))
# The dumped tree splits the feature between the +/- labels; its leaf values match
# our w* = -G/(H+lambda) up to xgboost's internal eta=1.0 scaling. Same split, same idea.`
  };

  window.CODEVIZ["paper-xgboost"] = {
    question: "As regularization lambda grows, what happens to the best split's gain and to the optimal leaf values?",
    charts: [
      {
        type: "line",
        title: "Effect of regularization lambda on the root split (toy data, our run)",
        xlabel: "lambda (leaf-value penalty)",
        ylabel: "value",
        series: [
          { name: "best split gain", color: "#7ee787",
            points: [[0,8.0],[0.5,6.3556],[1,5.2667],[2,3.9167],[5,2.2063],[10,1.2738],[20,0.6894],[50,0.2899],[100,0.1474]] },
          { name: "left leaf value w_L*", color: "#79c0ff",
            points: [[0,2.5],[0.5,2.0],[1,1.6667],[2,1.25],[5,0.7143],[10,0.4167],[20,0.2273],[50,0.0962],[100,0.049]] },
          { name: "right leaf value w_R*", color: "#ff7b72",
            points: [[0,-1.5],[0.5,-1.2],[1,-1.0],[2,-0.75],[5,-0.4286],[10,-0.25],[20,-0.1364],[50,-0.0577],[100,-0.0294]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. The toy 4-example split from the worked example (g=[-2,-3,1,2], h=[1,1,1,1]), best split after example 2. As lambda rises 0 -> 100, the optimal leaf values w*=-G/(H+lambda) shrink toward 0 (left 2.5 -> 0.05, right -1.5 -> -0.03) and the split gain falls (8.0 -> 0.15). This is XGBoost's regularization knob (Eq. 2's lambda, used in Eqs. 5 and 7): bigger lambda = smaller, more conservative leaves and weaker splits. Numbers recomputed exactly in the ablation cell.",
    code: `import numpy as np
# Reproduce the lambda ablation on the worked-example split (g, h fixed).
g = np.array([-2.0, -3.0, 1.0, 2.0]); h = np.ones(4)
G_L, H_L = g[:2].sum(), h[:2].sum()      # -5, 2
G_R, H_R = g[2:].sum(), h[2:].sum()      #  3, 2
G,   H   = g.sum(),     h.sum()          # -2, 4
for lam in [0, 0.5, 1, 2, 5, 10, 20, 50, 100]:
    gain = 0.5 * (G_L*G_L/(H_L+lam) + G_R*G_R/(H_R+lam) - G*G/(H+lam))   # gamma = 0
    wL, wR = -G_L/(H_L+lam), -G_R/(H_R+lam)
    print(f"lam={lam:5}: gain={gain:.4f}  w_L*={wL:.4f}  w_R*={wR:.4f}")
# gain and |leaf values| both shrink monotonically as lambda grows -> regularization.`
  };
})();
