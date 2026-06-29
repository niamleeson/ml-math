/* Paper lesson — "Classification and Regression Trees" (CART),
   Leo Breiman, Jerome H. Friedman, Richard A. Olshen & Charles J. Stone, Wadsworth, 1984. No arXiv (a book).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-cart".
   GROUNDED: the Gini impurity, the weighted-average split criterion, and the cost-complexity pruning
   criterion are transcribed from the scikit-learn "Mathematical formulation" for trees
   (https://scikit-learn.org/stable/modules/tree.html, which states it implements CART) and cross-checked
   against the Wikipedia "Decision tree learning" Gini formula; book metadata from that same Wikipedia page.
   Track A (primitive): build CART's greedy Gini split search from scratch with raw numpy, recurse to small
   depth, and VERIFY the chosen split + impurity against a hand-computed reference with exact assertions
   (and against scikit-learn's DecisionTreeClassifier). Tree math is recapped from concept ml-trees. */
(function () {
  window.LESSONS.push({
    id: "paper-cart",
    title: "CART — Classification and Regression Trees (1984)",
    tagline: "Grow a decision tree by greedily picking, at each node, the feature-and-threshold split that most reduces a simple impurity score (Gini) — then prune it back with a cost-complexity penalty so it does not overfit.",
    module: "Papers · Classical ML",
    track: "primitive",
    paper: {
      authors: "Leo Breiman, Jerome H. Friedman, Richard A. Olshen, Charles J. Stone",
      org: "University of California, Berkeley · Stanford University",
      year: 1984,
      venue: "Book: Classification and Regression Trees. Monterey, CA: Wadsworth & Brooks/Cole Advanced Books & Software",
      citations: "",
      url: "https://en.wikipedia.org/wiki/Decision_tree_learning",
      code: "https://scikit-learn.org/stable/modules/tree.html (scikit-learn's DecisionTree implements an optimized CART)"
    },
    conceptLink: "ml-trees",
    partOf: [],
    prereqs: ["ml-trees", "ml-ensembles", "ml-bias-variance"],

    // WHY READ IT
    problem:
      `<p>Before CART, fitting a model usually meant assuming a fixed shape for the answer &mdash; for example a
       <b>linear</b> rule (output is a weighted sum of the inputs). That works when the truth really is roughly a
       straight line or plane, but it struggles when the right decision depends on the inputs in a
       <b>piecewise</b>, conditional way ("if income is low AND age is high, then &hellip;"). Such rules are also
       hard for a person to read off a list of coefficients.</p>
       <p>CART asks a different question: can we learn a model that is just a <b>nested set of yes/no questions</b>
       &mdash; a flowchart &mdash; directly from data? A flowchart handles conditional logic and mixed
       feature types naturally, and a human can read it. The hard part is <i>which</i> questions to ask, in
       <i>which</i> order, and <i>when to stop</i>. CART's contribution is a concrete, automatic recipe for all
       three. ("CART" stands for <b>Classification And Regression Trees</b>.)</p>`,
    contribution:
      `<ul>
        <li><b>A greedy split rule driven by an impurity score.</b> At each node, CART searches over every
        feature and every candidate threshold and picks the single split that most reduces an <b>impurity</b>
        measure of the labels. For classification the book popularized the <b>Gini impurity</b>. "Impurity"
        means how mixed the class labels are inside a node.</li>
        <li><b>Recursive binary partitioning.</b> Every split is <b>binary</b> (two children: "feature
        $\\le$ threshold" vs "feature $\\gt$ threshold"). The rule is applied <b>recursively</b> to each child,
        carving the feature space into axis-aligned boxes.</li>
        <li><b>Cost-complexity pruning.</b> A fully grown tree memorizes the training data. CART grows it large,
        then <b>prunes</b> back, trading training fit against tree size with a single penalty parameter
        $\\alpha$, and uses cross-validation to choose $\\alpha$. This is how CART controls overfitting.</li>
      </ul>`,
    whyItMattered:
      `<p>The CART tree is one of the most-used models in all of machine learning, and it is the building block
       under the algorithms that dominate tabular data today. <b>Random forests</b> (averaging many CART trees)
       and <b>gradient-boosted trees</b> (XGBoost, LightGBM) both grow CART-style trees as their base learner;
       scikit-learn's <code>DecisionTreeClassifier</code> is an optimized CART. The two ideas you build here
       &mdash; the greedy impurity-reducing split search and recursive binary partitioning &mdash; are reused,
       essentially unchanged, inside every one of those.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>The original CART is a 1984 book, not a short paper. For a first pass, read it through a modern
       summary &mdash; scikit-learn's <b>"Mathematical formulation"</b> for trees states it implements CART and
       gives all three equations compactly. Read closely:</p>
       <ul>
        <li><b>The impurity definition</b> &mdash; Gini $H(Q_m) = \\sum_k p_{mk}(1 - p_{mk})$. Understand that
        it is $0$ when a node holds one class and largest when classes are evenly mixed.</li>
        <li><b>The split objective</b> &mdash; the <b>weighted average</b> child impurity
        $G(Q_m,\\theta)$, and that the best split <b>minimizes</b> it. This is the loop you implement.</li>
        <li><b>Cost-complexity pruning</b> &mdash; $R_\\alpha(T) = R(T) + \\alpha\\,|\\widetilde{T}|$. Read it as
        "training impurity plus a per-leaf fine."</li>
       </ul>
       <p><b>Skim:</b> the regression-tree variant (same idea, impurity becomes variance), surrogate splits for
       missing data, and the weakest-link pruning algorithm details &mdash; understand that pruning exists and
       what it optimizes; you do not need the full algorithm to build the split search.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will write a search that, at the root, tries every feature and every threshold and keeps the one
       that minimizes the weighted-average Gini of the two children. Before you run it on a two-class blob
       dataset where one feature cleanly separates the classes, predict: after the <b>first</b> split, will the
       weighted-average child impurity be (a) about the same as the parent, (b) noticeably lower, or (c) exactly
       zero? Write one sentence of reasoning about what "the best split minimizes impurity" should do on
       near-separable data.</p>`,
    attempt:
      `<p>Before the reveal, sketch the three functions you will implement in raw numpy. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li><code>gini(y)</code> &mdash; take a vector of class labels, return $\\sum_k p_k(1-p_k)$.
        TODO: how do you get each $p_k$ from the label counts? (count each class, divide by the total.)</li>
        <li><code>split_score(X, y, j, t)</code> &mdash; split rows by "feature $j \\le t$", return the
        <b>weighted</b> average of the two children's Gini. TODO: what weights? (the <b>fraction</b> of rows in
        each child, $n_{\\text{left}}/n$ and $n_{\\text{right}}/n$.)</li>
        <li><code>best_split(X, y)</code> &mdash; loop over every feature $j$ and every candidate threshold $t$
        (use midpoints between consecutive distinct values), call <code>split_score</code>, keep the
        <b>smallest</b>. TODO: why midpoints, and why minimize rather than maximize?</li>
       </ul>
       <p>Then recurse: split a node, apply the same rule to each child, stop at a small depth or when a node is
       pure. Check your numbers against the worked example below before reading the reveal.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>CART builds a tree top-down, one node at a time, by <b>recursive binary partitioning</b>. Start with
       all the training rows at the root. Do three things, then recurse.</p>
       <p><b>1. Measure how mixed a node is (impurity).</b> A node holds some rows, each with a class label. If
       they are all one class the node is "pure"; if the classes are evenly mixed it is maximally "impure". CART
       (for classification) measures this with the <b>Gini impurity</b>. Let $p_{mk}$ be the fraction of rows in
       node $m$ that belong to class $k$. The Gini impurity is $H(Q_m) = \\sum_k p_{mk}(1 - p_{mk})$. For two
       classes with fractions $p$ and $1-p$, this is $2p(1-p)$: it is $0$ at $p=0$ or $p=1$ (pure) and peaks at
       $0.5$ when $p=0.5$ (a 50/50 mix).</p>
       <p><b>2. Find the split that most reduces impurity (the greedy search).</b> A <b>split</b> is a
       feature-and-threshold pair $\\theta = (j, t)$: send rows with feature $x_j \\le t$ to the <b>left</b>
       child and the rest to the <b>right</b>. CART scores a split by the <b>weighted-average</b> impurity of
       the two children, where each child is weighted by the fraction of rows it receives:
       $G(Q_m,\\theta) = \\frac{n_{\\text{left}}}{n_m} H(Q_m^{\\text{left}}) + \\frac{n_{\\text{right}}}{n_m}
       H(Q_m^{\\text{right}})$. The <b>best split minimizes</b> $G$. To search, CART tries <b>every feature</b>
       and, for each, <b>every candidate threshold</b> (in practice the midpoints between consecutive distinct
       values of that feature, since only the ordering matters), and keeps the pair with the smallest $G$. This
       is a <b>greedy</b> choice: it picks the locally best split now and never reconsiders it.</p>
       <p><b>3. Recurse, then stop.</b> Apply steps 1&ndash;2 to the left child and the right child separately.
       Keep going until a stopping rule fires: the node is pure (Gini $=0$), a maximum depth is reached, or a
       node is too small to split. Each leaf then predicts the <b>majority class</b> of the rows that landed in
       it. The result is a partition of the feature space into <b>axis-aligned boxes</b>, one per leaf.</p>
       <p><b>4. Prune (control overfitting).</b> A tree grown until every leaf is pure typically <b>overfits</b>
       &mdash; it memorizes noise. CART grows the tree large, then <b>prunes</b> it back using
       <b>cost-complexity</b>: it minimizes $R_\\alpha(T) = R(T) + \\alpha\\,|\\widetilde{T}|$, where $R(T)$ is
       the tree's training impurity, $|\\widetilde{T}|$ is the number of leaves, and $\\alpha \\ge 0$ fines each
       extra leaf. Larger $\\alpha$ forces a smaller tree. $\\alpha$ is chosen by cross-validation. In the code
       below we implement steps 1&ndash;3 fully and control size with a depth limit (the simplest stand-in for
       pruning); the pruning <i>criterion</i> is transcribed and explained here.</p>`,
    architecture:
      `<p>A trained CART model is a <b>binary tree</b> &mdash; not a layered network of weights, but a flowchart of
       yes/no questions. Walk its parts in the order the greedy builder creates them.</p>
       <p><b>Root node (holds all the data).</b> The tree starts as a single node $m=$ root whose data set
       $Q_m$ is <i>every</i> training row, $n_m$ rows in all. Its impurity is $H(Q_m) = \\sum_k p_{mk}(1 - p_{mk})$,
       the Gini mix of all the labels. The whole tree is built by repeatedly turning a node into a question.</p>
       <p><b>Internal node = one binary, axis-aligned split.</b> The builder turns a node into an
       <b>internal node</b> by attaching a single split $\\theta = (j, t)$: pick <b>one</b> feature index $j$ and
       <b>one</b> threshold $t$. The test is $x_j \\le t$ &mdash; it looks at a single coordinate, so the boundary
       it draws is a flat cut perpendicular to axis $j$ (this is what <b>axis-aligned</b> means). The split is
       chosen greedily to drive impurity down: among every feature and every candidate threshold (midpoints
       between consecutive distinct values), the builder keeps the $\\theta$ that <b>minimizes</b> the
       row-fraction-weighted child impurity
       $G(Q_m,\\theta) = \\frac{n_m^{\\text{left}}}{n_m} H(Q_m^{\\text{left}}) + \\frac{n_m^{\\text{right}}}{n_m} H(Q_m^{\\text{right}})$.
       The node stores just two numbers, $j$ and $t$, plus pointers to its two children.</p>
       <p><b>Left and right children (the recursive partition).</b> The chosen split routes the node's rows into
       two disjoint subsets: $Q_m^{\\text{left}} = \\{(x,y) \\in Q_m : x_j \\le t\\}$ goes to the <b>left</b> child
       and $Q_m^{\\text{right}}$ (the rest, $x_j \\gt t$) goes to the <b>right</b> child, with
       $n_m^{\\text{left}} + n_m^{\\text{right}} = n_m$. The <i>same</i> procedure &mdash; measure impurity, find
       the best split &mdash; is then applied to each child independently. Recursing this way carves the feature
       space into <b>axis-aligned boxes</b>, one box per leaf, each box the intersection of the $x_j \\le t$ /
       $x_j \\gt t$ tests on the path that reaches it.</p>
       <p><b>Leaf node (stores a prediction, not a split).</b> When a branch stops growing, its node becomes a
       <b>leaf</b>: it has no children and no split, only a stored answer. For <b>classification</b> the answer is
       the <b>majority class</b> of the rows that landed there (the $k$ with the largest $p_{mk}$); for
       <b>regression</b> it is the node <b>mean</b> $\\bar{y}_m = \\frac{1}{n_m}\\sum_{y \\in Q_m} y$. A leaf is
       where impurity has been pushed low enough that one constant answer is good enough.</p>
       <p><b>Stopping rule (when a node becomes a leaf instead of splitting).</b> The recursion halts and emits a
       leaf when any guard fires: the node is <b>pure</b> ($H(Q_m) = 0$, all one class), a <b>maximum depth</b> is
       reached, the node has <b>too few rows</b> to split, or no split lowers impurity by enough. Without such a
       rule the tree would grow until every leaf holds a single row &mdash; perfect on training data, overfit on
       new data.</p>
       <p><b>Cost-complexity pruning (collapsing subtrees after the build).</b> CART deliberately grows the tree
       large, then <b>prunes</b> it back. It scores a tree by
       $R_\\alpha(T) = R(T) + \\alpha\\,|\\widetilde{T}|$, training impurity plus a per-leaf fine
       $\\alpha \\ge 0$. The <b>weakest-link</b> rule collapses whole subtrees in order of their effective
       $\\alpha_{\\text{eff}}(t) = \\frac{R(t) - R(T_t)}{|T_t| - 1}$ &mdash; the internal node $t$ whose branch
       buys the least impurity per leaf is turned back into a leaf first &mdash; and $\\alpha$ is picked by
       cross-validation. Pruning shrinks the structure without changing how any surviving split works.</p>
       <p><b>Prediction = routing one sample root&rarr;leaf.</b> To predict for a new $x$, start at the root and at
       each internal node apply its stored test: go <b>left</b> if $x_j \\le t$, else <b>right</b>. Follow the
       pointers down until you hit a leaf, then return that leaf's stored class (or mean). The sample never
       touches a split it does not pass through, so inference walks just one root-to-leaf path &mdash; about
       $O(\\log n)$ comparisons for a balanced tree, no arithmetic over all the data.</p>`,
    symbols: [
      { sym: "$Q_m$", desc: "the set of training rows that have reached node $m$ &mdash; the data the node must split. $n_m$ is how many rows it has." },
      { sym: "$k$", desc: "a class label index (e.g. $k=0$ or $k=1$ for two classes). The sum $\\sum_k$ runs over all classes." },
      { sym: "$p_{mk}$", desc: "the <b>fraction</b> of rows in node $m$ whose label is class $k$: $p_{mk} = \\frac{1}{n_m}\\sum_{y \\in Q_m} \\mathbb{1}(y = k)$. The $p_{mk}$ over all classes sum to $1$." },
      { sym: "$H(Q_m)$", desc: "the <b>impurity</b> of node $m$ &mdash; how mixed/spread its rows are. For classification it is the <b>Gini impurity</b> ($0$ = pure, one class); for regression it is the within-node variance (MSE) or mean absolute deviation (MAE)." },
      { sym: "$\\bar{y}_m$", desc: "the <b>mean</b> of the target values $y$ in node $m$ (regression). A regression leaf predicts $\\bar{y}_m$; the MSE impurity measures squared spread around it." },
      { sym: "$\\operatorname{median}(y)_m$", desc: "the <b>median</b> target value in node $m$ (regression). The MAE leaf predicts this and impurity is the mean absolute deviation around it &mdash; more outlier-robust than MSE." },
      { sym: "$\\theta = (j, t)$", desc: "a candidate <b>split</b>: feature index $j$ and threshold value $t$. Rows go left if $x_j \\le t$, right otherwise." },
      { sym: "$Q_m^{\\text{left}}, Q_m^{\\text{right}}$", desc: "the rows sent to the left child ($x_j \\le t$) and the right child ($x_j \\gt t$) by split $\\theta$. Their sizes are $n_{\\text{left}}$ and $n_{\\text{right}}$, with $n_{\\text{left}} + n_{\\text{right}} = n_m$." },
      { sym: "$G(Q_m, \\theta)$", desc: "the <b>score</b> of split $\\theta$: the weighted-average impurity of its two children. The best split minimizes it." },
      { sym: "$T$", desc: "a tree (a particular set of splits and leaves)." },
      { sym: "$R(T)$", desc: "the tree's total training impurity &mdash; the sample-weighted impurity summed over its leaves. Lower $R(T)$ = better fit to training data." },
      { sym: "$|\\widetilde{T}|$", desc: "the number of <b>leaves</b> (terminal nodes) in tree $T$ &mdash; a measure of tree size / complexity." },
      { sym: "$\\alpha$", desc: "the <b>cost-complexity</b> parameter, $\\alpha \\ge 0$: the penalty (the 'fine') charged per leaf. $\\alpha = 0$ keeps the full tree; larger $\\alpha$ prunes more." },
      { sym: "$T_t$, $\\alpha_{\\text{eff}}(t)$", desc: "$T_t$ is the subtree (branch) rooted at internal node $t$; $\\alpha_{\\text{eff}}(t) = \\frac{R(t) - R(T_t)}{|T_t| - 1}$ is the $\\alpha$ at which keeping that branch stops paying off &mdash; the <b>weakest link</b> (smallest $\\alpha_{\\text{eff}}$) is pruned first." }
    ],
    formula: `$$ \\text{(Gini impurity, classification)}\\quad H(Q_m) = \\sum_k p_{mk}\\,(1 - p_{mk}) \\;=\\; 1 - \\sum_k p_{mk}^2 $$
<p>Classification impurity (scikit-learn trees §"Classification criteria"; same Gini form as Wikipedia "Decision tree learning"). $p_{mk}$ is the fraction of class $k$ in node $m$. It is $0$ for a pure node and largest for an even mix.</p>
$$ \\text{(weighted split objective)}\\quad G(Q_m, \\theta) = \\frac{n_m^{\\text{left}}}{n_m}\\,H\\!\\left(Q_m^{\\text{left}}(\\theta)\\right) + \\frac{n_m^{\\text{right}}}{n_m}\\,H\\!\\left(Q_m^{\\text{right}}(\\theta)\\right), \\qquad \\theta^{*} = \\operatorname*{arg\\,min}_{\\theta}\\; G(Q_m, \\theta) $$
<p>Split objective (scikit-learn trees §"Splitting criteria"). A split $\\theta=(j,t_m)$ sends rows with $x_j \\le t_m$ left and the rest right; $G$ is the row-fraction-weighted average of the two child impurities, and CART picks the $\\theta$ that minimizes it. Works for any impurity $H$ &mdash; classification or regression.</p>
$$ \\text{(regression: node mean)}\\quad \\bar{y}_m = \\frac{1}{n_m}\\sum_{y \\in Q_m} y \\qquad \\text{(regression: variance / MSE impurity)}\\quad H(Q_m) = \\frac{1}{n_m}\\sum_{y \\in Q_m} (y - \\bar{y}_m)^2 $$
<p>Regression criterion (scikit-learn trees §"Regression criteria", the CART variance/MSE rule). The leaf predicts the node mean $\\bar{y}_m$; impurity is the mean squared error around that mean (the within-node variance). Plugged into the same $G(Q_m,\\theta)$, minimizing it is the regression analogue of Gini reduction.</p>
$$ \\text{(MAE alternative)}\\quad H(Q_m) = \\frac{1}{n_m}\\sum_{y \\in Q_m} \\left| y - \\operatorname{median}(y)_m \\right| $$
<p>Mean-absolute-error variant (scikit-learn trees §"Regression criteria"): the leaf predicts the node median and impurity is mean absolute deviation &mdash; more robust to outliers than MSE.</p>
$$ \\text{(cost-complexity pruning)}\\quad R_\\alpha(T) = R(T) + \\alpha\\,|\\widetilde{T}|, \\qquad \\alpha_{\\text{eff}}(t) = \\frac{R(t) - R(T_t)}{|T_t| - 1} $$
<p>Cost-complexity pruning (scikit-learn trees §"Minimal cost-complexity pruning"; CART's weakest-link rule). $R(T)$ is the total sample-weighted leaf impurity, $|\\widetilde{T}|$ the leaf count, $\\alpha \\ge 0$ the per-leaf fine. The effective $\\alpha_{\\text{eff}}(t)$ of an internal node $t$ is the price at which pruning its subtree $T_t$ breaks even; the weakest link (smallest $\\alpha_{\\text{eff}}$) is collapsed first, and $\\alpha$ is chosen by cross-validation.</p>`,
    whatItDoes:
      `<p><b>Gini impurity</b> $H(Q_m) = \\sum_k p_{mk}(1 - p_{mk})$ scores how mixed a node is. Each class
       contributes $p_{mk}(1 - p_{mk})$, which is the chance you pick a row of class $k$ times the chance the
       next pick is <i>not</i> class $k$. The sum is $0$ when one class owns the node and maximal when classes
       are evenly split. (Equivalently $H = 1 - \\sum_k p_{mk}^2$.)</p>
       <p><b>The regression criterion</b> swaps Gini for <b>within-node variance</b>: the leaf predicts the node
       mean $\\bar{y}_m$ and the impurity is the mean squared error $H(Q_m) = \\frac1{n_m}\\sum (y - \\bar{y}_m)^2$
       (an MAE variant uses the node median and mean absolute deviation). The "R" in CART &mdash; same greedy
       split search, just a different $H$ plugged into $G$. A regression split therefore minimizes the
       weighted variance of the two halves, i.e. it maximizes the variance it explains.</p>
       <p><b>The split score</b> $G(Q_m, \\theta)$ asks "if I split here, how impure are the two halves on
       average?" Each child's impurity is weighted by its share of the rows, so a split that sends most rows
       into a nearly-pure child scores low. CART picks the $\\theta$ with the <b>smallest</b> $G$ &mdash;
       equivalently, the largest <b>impurity reduction</b> $H(Q_m) - G(Q_m, \\theta)$.</p>
       <p><b>Cost-complexity pruning</b> $R_\\alpha(T) = R(T) + \\alpha|\\widetilde{T}|$ adds a per-leaf fine to
       the training impurity. Growing the tree always lowers $R(T)$ but adds leaves; the $\\alpha|\\widetilde{T}|$
       term makes extra leaves cost something, so minimizing $R_\\alpha$ stops the tree from growing past the
       point where new splits stop paying for themselves. It is the same shape as L1/L2 regularization
       (fit term $+$ complexity penalty), with leaf-count as the complexity.</p>`,
    derivation:
      `<p><b>Short recap &mdash; full tree math is in the concept lesson <code>ml-trees</code>.</b> Why does
       <i>minimizing the weighted-average child Gini</i> equal <i>maximizing impurity reduction</i>? Because the
       parent impurity $H(Q_m)$ is a fixed number for a given node &mdash; it does not depend on the split
       $\\theta$. The reduction is $\\Delta = H(Q_m) - G(Q_m, \\theta)$. Since $H(Q_m)$ is constant across all
       candidate splits, the $\\theta$ that maximizes $\\Delta$ is exactly the $\\theta$ that minimizes
       $G(Q_m, \\theta)$. So the loop only needs to compute $G$ and keep the minimum.</p>
       <p>Why the <b>weighted</b> average and not a plain average? Because a node's impurity should reflect
       <i>how many</i> rows are still mixed. Sending $59$ rows into a pure child and $1$ row into an impure one
       is almost a perfect split; a plain average would overweight the tiny impure child. Weighting each child
       by $n_{\\text{child}}/n_m$ measures the <b>expected</b> impurity of a random row after the split, which is
       what we want to drive down. The greedy step picks the best split now; CART makes no claim that the
       greedy tree is globally optimal &mdash; finding the optimal tree is intractable, which is exactly why the
       greedy rule is used. Full coverage in <code>ml-trees</code>.</p>`,
    example:
      `<p>Work the Gini and the split score by hand on a one-feature dataset, then confirm the search finds the
       perfect split. Six rows, one feature $x$, two classes:
       <code>x = [1, 2, 3, 6, 7, 8]</code>, &nbsp; <code>y = [0, 0, 0, 1, 1, 1]</code>.</p>
       <ul class="steps">
        <li><b>Parent Gini.</b> Three $0$s and three $1$s, so $p_0 = p_1 = 0.5$.
        $H = 0.5(1-0.5) + 0.5(1-0.5) = 0.25 + 0.25 = \\mathbf{0.5}$ — a 50/50 mix, the maximum for two classes.</li>
        <li><b>Good threshold $t = 4.5$</b> (midpoint of $3$ and $6$). Left $= \\{0,0,0\\}$, right $= \\{1,1,1\\}$ — both pure, child Gini $0$ each.
        $G = \\frac{3}{6}(0) + \\frac{3}{6}(0) = \\mathbf{0}$. Reduction $= 0.5 - 0 = 0.5$, the largest possible.</li>
        <li><b>Worse threshold $t = 2.5$.</b> Left $= \\{0,0\\}$ (pure, Gini $0$); right $= \\{0,1,1,1\\}$ with
        $p_0 = \\tfrac14,\\ p_1 = \\tfrac34$, so right Gini $= \\tfrac14\\cdot\\tfrac34 + \\tfrac34\\cdot\\tfrac14 = \\tfrac{3}{16} + \\tfrac{3}{16} = \\mathbf{0.375}$.</li>
        <li><b>Score it.</b> $G = \\frac{2}{6}(0) + \\frac{4}{6}(0.375) = \\frac{4}{6}(0.375) = \\mathbf{0.25}$ — worse than $t=4.5$, as expected.</li>
       </ul>
       <table class="extable">
        <caption>Candidate thresholds on feature 0, ranked by weighted split score $G$ (lower is better).</caption>
        <thead><tr><th>threshold $t$</th><th>left rows</th><th>right rows</th><th class="num">left Gini</th><th class="num">right Gini</th><th class="num">$G$</th><th class="num">reduction $H-G$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">2.5</td><td>{0,0}</td><td>{0,1,1,1}</td><td class="num">0.000</td><td class="num">0.375</td><td class="num">0.250</td><td class="num">0.250</td></tr>
         <tr><td class="row-h">4.5</td><td>{0,0,0}</td><td>{1,1,1}</td><td class="num">0.000</td><td class="num">0.000</td><td class="num">0.000</td><td class="num">0.500</td></tr>
        </tbody>
       </table>
       <p>The search compares all thresholds; any cut between $3$ and $6$ ties at $G = 0$, and the reported
       midpoint is $t = 4.5$ on <b>feature 0</b> — greedy CART takes it. Every number ($0.5$, $0$, $0.375$,
       $0.25$, chosen $t = 4.5$) is recomputed and <b>asserted</b> in the notebook's first cell — if your math
       is off, the assertion fails.</p>`,
    recipe:
      `<ol>
        <li><b>Gini.</b> Write <code>gini(y)</code>: count each class, form fractions $p_k$, return
        $\\sum_k p_k(1-p_k)$.</li>
        <li><b>Split score.</b> Write <code>split_score(X, y, j, t)</code>: partition rows by $x_j \\le t$,
        return $\\frac{n_L}{n}\\text{gini}(y_L) + \\frac{n_R}{n}\\text{gini}(y_R)$ (return "no split" if either
        side is empty).</li>
        <li><b>Greedy search.</b> Write <code>best_split(X, y)</code>: for every feature $j$, for every midpoint
        threshold $t$, score the split; keep the $(j, t)$ with the smallest $G$.</li>
        <li><b>Recurse.</b> Build a node: if pure / at max depth / too small, make it a leaf predicting the
        majority class; else split on <code>best_split</code> and build both children at depth $+1$.</li>
        <li><b>Verify.</b> Assert the worked-example numbers, then assert the built tree's predictions match
        scikit-learn's <code>DecisionTreeClassifier(criterion="gini")</code> on the same data.</li>
        <li><b>Visualize.</b> Track the weighted training impurity $R(T)$ as you increase the depth limit; it
        should fall toward $0$ as the tree is allowed to grow (and that fall is exactly what pruning trades
        against tree size).</li>
      </ol>`,
    results:
      `<p>The CART <i>book</i> demonstrates the method across many datasets rather than reporting one headline
       accuracy. The lasting result is qualitative and methodological: a single, automatic recipe &mdash; greedy
       impurity-reducing binary splits plus cost-complexity pruning &mdash; that produces accurate,
       <b>interpretable</b> models for both classification and regression, on mixed data types, robust to
       outliers and to monotone transforms of the inputs. Its real "result" is its descendants: scikit-learn's
       trees implement CART, and random forests and gradient boosting use CART trees as their base learner.</p>
       <p><i>No specific headline metric is quoted because none is reproduced from the book here. The numbers in
       the CODE and CODEVIZ below are from our own small run on a toy dataset &mdash; not the book's
       results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> This is a <b>Track A (primitive)</b> build, so &ldquo;working&rdquo;
       means two things: the from-scratch split search reproduces a <b>hand-computed reference exactly</b>, and
       the grown tree's predictions <b>agree with scikit-learn's CART</b> (the oracle). The primary metric is
       <b>prediction agreement</b> with <code>DecisionTreeClassifier(criterion="gini")</code> on the same data
       (target: <b>1.0000</b>) plus exact assertions on Gini / split scores. The &ldquo;better than trivial&rdquo;
       floor is a single-leaf majority-class predictor: weighted training impurity $R(T)=0.5$ at depth 0 (a
       50/50 mix), which any real split must beat. (The 1984 book reports no single headline metric — its result
       is methodological.)</p>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> Assert the worked-example numbers (the notebook's first
        cell does exactly this): parent Gini $=0.5$ on $y=[0,0,0,1,1,1]$; perfect split at $t=4.5$ gives $G=0$;
        worse split at $t=2.5$ gives $G=0.25$; the right child $\\{0,1,1,1\\}$ has Gini $0.375$; and
        <code>best_split</code> returns $(j{=}0,\\,t{=}4.5,\\,G{=}0)$. Unit-check <code>gini</code>: a pure node
        returns $0$, an even two-class mix returns $0.5$, and $H=\\sum_k p_k(1-p_k)$ must equal
        $1-\\sum_k p_k^2$. Confirm <code>split_score</code> returns &ldquo;no split&rdquo; (<code>None</code>) when
        a child is empty, so the search skips it instead of dividing by zero.</li>
        <li><b>3. Expected range.</b> On near-separable blobs, $R(T)$ should drop sharply after the first split
        and reach $0$ within a couple of levels — our run: <b>$R(T)=0.5000 \\to 0.0323 \\to 0.0000$</b> at depths
        $0,1,2$, root split (feature 0, threshold $\\approx 1.1712$), train accuracy $\\approx 0.983$ after one
        split. The agreement metric must be <b>exactly 1.0000</b> against scikit-learn's CART — this is a
        primitive, so anything below 1.0 is a bug, not tuning (unlike a learned model there is no &ldquo;close
        enough&rdquo;).</li>
        <li><b>4. Ablation — prove the key idea earns its keep.</b> CART's two load-bearing choices are the
        <b>weighted-average</b> child impurity and <b>minimizing</b> (not maximizing) $G$. Ablate the weighting:
        score splits by the <i>plain</i> mean of the two child Ginis instead of $\\frac{n_L}{n}$/$\\frac{n_R}{n}$
        — the tree should now <b>disagree with scikit-learn</b> (agreement drops below 1.0) because it
        over-values peeling off a tiny pure child. Flip <code>best_split</code> to <code>argmax</code> $G$ and it
        picks the <i>worst</i> split, sending $R(T)$ up instead of down. Either ablation breaking the oracle
        agreement is the proof the real criterion is what earns the match.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>Agreement &lt; 1.0 / wrong root split</b>: usually
        the unweighted-average bug, or thresholding on raw feature values instead of <b>midpoints</b> between
        distinct sorted values (then some row partitions are unreachable). <b>Division-by-zero / NaN in
        $G$</b>: forgot to return <code>None</code> on an empty child. <b>$R(T)$ rising with depth</b>: maximizing
        $G$ instead of minimizing it. <b>$R(T)$ never reaching 0 on separable data</b>: the search isn't trying
        every feature, or the recursion stops too early. <b>Tree fits training perfectly but generalizes badly</b>:
        expected — pure leaves overfit; that is exactly what cost-complexity pruning
        ($R_\\alpha(T)=R(T)+\\alpha|\\widetilde{T}|$) exists to fix, stood in here by the depth cap.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track A (primitive)</b> paper: CART's split search is the thing you build <b>from
       scratch</b>, and the payoff is that it matches the library. <b>Build by hand</b> (raw numpy): the
       <code>gini</code> impurity, the <code>split_score</code> weighted-average, the <code>best_split</code>
       greedy search over all features and thresholds, and the recursive tree builder to a small depth.
       <b>Import only</b> numpy, plus scikit-learn's <code>DecisionTreeClassifier</code> <i>solely as the
       oracle</i> to check our tree against &mdash; we never use it to make a prediction we keep. The verification
       has two layers: exact assertions against the <b>hand-computed</b> reference (parent Gini $=0.5$, perfect
       split $G=0$, worse split $G=0.25$, chosen threshold $=4.5$), and an agreement check that our depth-3
       tree's predictions equal scikit-learn's CART on a 60-row toy set. Cost-complexity pruning is transcribed
       and explained but not implemented; we cap tree size with a depth limit, the simplest stand-in.</p>`,
    pitfalls:
      `<ul>
        <li><b>Averaging child impurities without weighting.</b> $G$ is the <b>weighted</b> average
        ($n_{\\text{child}}/n$ weights), not the plain mean. An unweighted average overvalues splits that peel
        off a tiny pure child and is not the CART criterion. <b>Fix:</b> multiply each child's Gini by its row
        fraction.</li>
        <li><b>Using raw feature values as thresholds instead of midpoints.</b> If you threshold at an actual
        data value $v$ with the rule $x_j \\le v$, you can never put that exact row on the right. Use the
        <b>midpoints</b> between consecutive distinct sorted values so every partition of the rows is reachable.
        (It also avoids ties that depend on $\\le$ vs $\\lt$.)</li>
        <li><b>Maximizing instead of minimizing.</b> The best split <b>minimizes</b> the weighted child impurity
        $G$ (equivalently maximizes the reduction $H - G$). Maximizing $G$ finds the <i>worst</i> split.</li>
        <li><b>Forgetting to skip empty splits.</b> A threshold that sends all rows to one side gives an empty
        child; <code>split_score</code> must return "no split" (e.g. <code>None</code>) so the search ignores it,
        or you divide by zero.</li>
        <li><b>Growing to pure leaves and calling it done.</b> An unpruned tree overfits &mdash; that is the
        whole reason cost-complexity pruning exists. Here we limit depth; in practice you grow large then prune
        and pick $\\alpha$ by cross-validation.</li>
        <li><b>Expecting Gini and entropy to give identical trees.</b> CART's book uses Gini; the related ID3/C4.5
        family uses entropy. They usually agree but can pick different splits; do not assume one is the other.</li>
      </ul>`,
    recall: [
      "Write the Gini impurity $H(Q_m) = \\sum_k p_{mk}(1-p_{mk})$ and give its value for a 50/50 two-class node.",
      "Write the split-score $G(Q_m,\\theta)$ and say what its two weights are.",
      "Why does minimizing $G$ equal maximizing impurity reduction?",
      "State the cost-complexity criterion $R_\\alpha(T)=R(T)+\\alpha|\\widetilde{T}|$ and say what each term does.",
      "Why use midpoints between distinct feature values as candidate thresholds?"
    ],
    practice: [
      {
        q: `<b>Compute a split score by hand.</b> A node has labels $y = [0, 0, 1, 1, 1]$ and one feature
            $x = [1, 2, 3, 4, 5]$. Consider the threshold $t = 2.5$ (left = rows with $x \\le 2.5$). Compute the
            parent Gini, each child's Gini, and the weighted split score $G$. Is this a perfect split?`,
        steps: [
          { do: `Parent Gini: $p_0 = 2/5, p_1 = 3/5$, so $H = \\tfrac25\\cdot\\tfrac35 + \\tfrac35\\cdot\\tfrac25 = \\tfrac{6}{25}+\\tfrac{6}{25} = 0.48$.`, why: `Gini sums $p_k(1-p_k)$ over classes; this is the impurity before any split.` },
          { do: `Left = $\\{0,0\\}$ (rows with $x \\le 2.5$): pure, Gini $= 0$. Right = $\\{1,1,1\\}$: pure, Gini $= 0$.`, why: `The threshold $2.5$ separates the two $0$s from the three $1$s exactly.` },
          { do: `$G = \\tfrac{2}{5}(0) + \\tfrac{3}{5}(0) = 0$.`, why: `Each child weighted by its row fraction; both children are pure.` }
        ],
        answer: `<p>Parent Gini $= \\mathbf{0.48}$; both children are pure (Gini $0$); weighted score
                 $G = \\mathbf{0}$. <b>Yes, it is a perfect split</b> &mdash; impurity reduction
                 $0.48 - 0 = 0.48$, the largest possible for this node, because $t = 2.5$ cleanly separates the
                 two classes.</p>`
      },
      {
        q: `<b>The pruning / overfitting ablation.</b> You grow your from-scratch CART to ever-larger depth
            limits on the same training data and record the training impurity $R(T)$ and the number of leaves.
            What happens to $R(T)$ as depth grows, why does that <i>not</i> mean a deeper tree is always better,
            and what does the cost-complexity term $\\alpha|\\widetilde{T}|$ do about it?`,
        steps: [
          { do: `Increase max depth $0, 1, 2, 3, \\dots$ and record $R(T)$ and the leaf count.`, why: `Each extra split can only keep or lower training impurity, so $R(T)$ falls (toward $0$) as depth grows, while leaves multiply.` },
          { do: `Note that low <i>training</i> impurity is not the goal &mdash; test performance is. A tree grown to pure leaves fits noise.`, why: `Driving $R(T)$ to $0$ memorizes the training set; that is overfitting, which hurts on unseen data.` },
          { do: `Add the penalty: minimize $R_\\alpha(T) = R(T) + \\alpha|\\widetilde{T}|$ and pick $\\alpha$ by cross-validation.`, why: `The per-leaf fine makes a new split pay only if it lowers $R(T)$ by more than $\\alpha$, so the tree stops growing past the point where splits stop helping.` }
        ],
        answer: `<p>$R(T)$ <b>monotonically decreases toward $0$</b> as depth grows, because every split can only
                 keep or reduce training impurity. But minimal training impurity is overfitting &mdash; the tree
                 memorizes noise and generalizes worse. <b>Cost-complexity pruning</b> counters this: by adding
                 $\\alpha|\\widetilde{T}|$, each extra leaf must earn its keep (reduce $R(T)$ by more than
                 $\\alpha$), and $\\alpha$ is tuned by cross-validation to the size that generalizes best. The
                 CODEVIZ panel shows our $R(T)$ falling to $0$ as the depth limit rises &mdash; the curve pruning
                 trades against tree size.</p>`
      },
      {
        q: `Your <code>best_split</code> tries every feature and every threshold and keeps the smallest $G$. On
            a node with two features where feature 0 perfectly separates the classes and feature 1 does not, what
            should the search return, and why is the parent Gini irrelevant to the choice between two candidate
            splits?`,
        steps: [
          { do: `For feature 0, the separating threshold gives two pure children, so $G = 0$.`, why: `A perfect separation makes both child Ginis $0$, and any weighted average of zeros is $0$.` },
          { do: `For feature 1, no threshold makes both children pure, so its best $G \\gt 0$.`, why: `If a feature cannot separate the classes, at least one child stays mixed, keeping $G$ above $0$.` },
          { do: `Pick the smallest $G$ overall: feature 0's split ($G = 0$). The parent Gini $H(Q_m)$ is the same constant subtracted from every candidate's reduction.`, why: `Since $H(Q_m)$ does not depend on $\\theta$, comparing splits by minimum $G$ is identical to comparing by maximum reduction $H - G$.` }
        ],
        answer: `<p>The search returns the <b>feature-0 split with $G = 0$</b> (two pure children), because it
                 has the smallest weighted child impurity of any candidate. The parent Gini $H(Q_m)$ is
                 <b>irrelevant to the choice</b> because it is a fixed constant for the node &mdash; it appears in
                 every candidate's reduction $H - G$, so ranking splits by minimum $G$ gives the same winner as
                 ranking by maximum impurity reduction.</p>`
      }
    ]
  });

  window.CODE["paper-cart"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track A: we <b>build CART's greedy split search from scratch</b> in raw numpy &mdash;
       <code>gini</code>, <code>split_score</code> (the weighted-average child impurity), and
       <code>best_split</code> (search every feature and every midpoint threshold, keep the minimum $G$) &mdash;
       then recurse to a small depth. Cell 1 recomputes the worked example and <b>asserts</b> every number by
       hand (parent Gini $0.5$, perfect split $G=0$, worse split $G=0.25$, chosen threshold $4.5$). Cell 2 builds
       a depth-3 tree on a 60-row two-blob dataset and <b>verifies</b> that its predictions exactly match
       scikit-learn's <code>DecisionTreeClassifier(criterion="gini")</code> &mdash; including the identical root
       split (feature 0, threshold $\\approx 1.1712$). That agreement is the Track-A payoff: our from-scratch CART
       <i>is</i> the library's CART. Paste into Colab (or any environment with numpy + scikit-learn) and run.</p>`,
    code: `import numpy as np

np.random.seed(0)

# ============================================================
# CART from scratch: Gini impurity, split score, greedy search.
# Criterion transcribed from scikit-learn's tree "Mathematical
# formulation" (it implements CART, Breiman et al. 1984).
# ============================================================

def gini(y):
    """Gini impurity  H = sum_k p_k (1 - p_k)  of a label vector."""
    if len(y) == 0:
        return 0.0
    _, counts = np.unique(y, return_counts=True)
    p = counts / counts.sum()
    return float(np.sum(p * (1.0 - p)))

def split_score(X, y, j, t):
    """Weighted-average child Gini for split (feature j <= threshold t).
       Returns None if a child would be empty."""
    left = X[:, j] <= t
    right = ~left
    nL, nR, n = left.sum(), right.sum(), len(y)
    if nL == 0 or nR == 0:
        return None
    return (nL / n) * gini(y[left]) + (nR / n) * gini(y[right])

def best_split(X, y):
    """Greedy CART split: try every feature and every midpoint threshold,
       keep the (feature, threshold, score) with the SMALLEST weighted Gini."""
    best = (None, None, np.inf)
    for j in range(X.shape[1]):
        vals = np.unique(X[:, j])
        cands = (vals[:-1] + vals[1:]) / 2.0          # midpoints between distinct values
        for t in cands:
            g = split_score(X, y, j, t)
            if g is not None and g < best[2] - 1e-12:
                best = (j, float(t), float(g))
    return best                                       # (feature, threshold, weighted Gini)


# --- 1. WORKED EXAMPLE: assert every hand-computed number. ---
X1 = np.array([[1.0],[2.0],[3.0],[6.0],[7.0],[8.0]])
y1 = np.array([0,0,0,1,1,1])
assert abs(gini(y1) - 0.5) < 1e-12                    # parent: 50/50 -> 0.5
assert abs(split_score(X1, y1, 0, 4.5) - 0.0)  < 1e-12  # perfect split -> 0
assert abs(gini(y1[X1[:,0] > 2.5]) - 0.375)    < 1e-12  # right child {0,1,1,1} -> 0.375
assert abs(split_score(X1, y1, 0, 2.5) - 0.25) < 1e-12  # weighted -> 0.25
j, t, g = best_split(X1, y1)
assert j == 0 and abs(t - 4.5) < 1e-12 and abs(g - 0.0) < 1e-12
print("worked example OK:  parent gini=0.5  G(4.5)=0.0  G(2.5)=0.25  best=(feat 0, t=4.5, G=0.0)")


# --- 2. Recursive tree to a small depth. ---
class Node:
    def __init__(self, **kw): self.__dict__.update(kw)

def build(X, y, depth, max_depth):
    node = Node(leaf=True, pred=int(np.round(y.mean())), gini=gini(y), n=len(y))
    if depth >= max_depth or gini(y) == 0.0 or len(np.unique(y)) == 1:
        return node
    j, t, g = best_split(X, y)
    if j is None:
        return node
    left = X[:, j] <= t
    node.leaf = False; node.j = j; node.t = t
    node.left  = build(X[left],  y[left],  depth + 1, max_depth)
    node.right = build(X[~left], y[~left], depth + 1, max_depth)
    return node

def predict(node, X):
    def one(nd, x):
        while not nd.leaf:
            nd = nd.left if x[nd.j] <= nd.t else nd.right
        return nd.pred
    return np.array([one(node, x) for x in X])


# --- 3. Toy two-blob dataset and VERIFY against scikit-learn's CART. ---
n = 60
Xa = np.random.randn(n // 2, 2) * 0.6                  # blob near (0, 0)   -> class 0
Xb = np.random.randn(n // 2, 2) * 0.6 + 2.2            # blob near (2.2,2.2)-> class 1
X = np.vstack([Xa, Xb]); y = np.array([0] * (n // 2) + [1] * (n // 2))

ours = build(X, y, 0, max_depth=3)
print("\\nour root split: feature", ours.j, " threshold %.4f" % ours.t)

from sklearn.tree import DecisionTreeClassifier      # imported ONLY as the oracle
sk = DecisionTreeClassifier(criterion="gini", max_depth=3, random_state=0).fit(X, y)
print("sklearn root : feature", int(sk.tree_.feature[0]), " threshold %.4f" % float(sk.tree_.threshold[0]))

agree = (predict(ours, X) == sk.predict(X)).mean()
print("predictions agree with sklearn CART: %.4f" % agree)
assert agree == 1.0, "our CART must match scikit-learn's CART"
print("VERIFIED: from-scratch CART == scikit-learn DecisionTreeClassifier(gini).")
# Our small run: root = (feature 0, threshold ~1.1712) for both; predictions agree 1.0000.
# This is OUR toy run, not a number from the CART book.`
  };

  window.CODEVIZ["paper-cart"] = {
    question: "As CART is allowed to grow deeper, how fast does the weighted training impurity R(T) fall — the quantity cost-complexity pruning trades against tree size?",
    charts: [
      {
        type: "line",
        title: "Weighted training impurity R(T) vs depth limit — our from-scratch CART on a 60-row two-blob dataset",
        xlabel: "max depth",
        ylabel: "weighted training impurity R(T)",
        series: [
          {
            name: "R(T) (training impurity)",
            color: "#7ee787",
            points: [[0,0.5000],[1,0.0323],[2,0.0000],[3,0.0000],[4,0.0000]]
          }
        ]
      }
    ],
    caption: "Our small run, not a number from the CART book. Our from-scratch CART, built to increasing depth limits on the same 60-row two-blob dataset (two Gaussian blobs, 30 points each). The weighted training impurity R(T) (sample-weighted Gini summed over the leaves) drops from 0.5000 at depth 0 (one leaf, 50/50 mix) to 0.0323 after the first split (root: feature 0, threshold ~1.1712; train accuracy ~0.983) and reaches 0.0000 by depth 2 (3 pure leaves, 100% train accuracy). Every value is printed by the from-scratch tree below. This fall toward zero is exactly what cost-complexity pruning, R_alpha(T) = R(T) + alpha*|leaves|, trades against the leaf count to avoid overfitting.",
    code: `import numpy as np
np.random.seed(0)

def gini(y):
    if len(y) == 0: return 0.0
    _, c = np.unique(y, return_counts=True); p = c / c.sum()
    return float(np.sum(p * (1 - p)))
def split_score(X, y, j, t):
    L = X[:, j] <= t; R = ~L; nL, nR, n = L.sum(), R.sum(), len(y)
    if nL == 0 or nR == 0: return None
    return (nL/n)*gini(y[L]) + (nR/n)*gini(y[R])
def best_split(X, y):
    best = (None, None, np.inf)
    for j in range(X.shape[1]):
        v = np.unique(X[:, j]); cs = (v[:-1] + v[1:]) / 2.0
        for t in cs:
            g = split_score(X, y, j, t)
            if g is not None and g < best[2] - 1e-12: best = (j, float(t), float(g))
    return best

class Node:
    def __init__(s, **k): s.__dict__.update(k)
def build(X, y, d, md):
    nd = Node(leaf=True, gini=gini(y), n=len(y))
    if d >= md or gini(y) == 0.0 or len(np.unique(y)) == 1: return nd
    j, t, g = best_split(X, y)
    if j is None: return nd
    L = X[:, j] <= t; nd.leaf = False
    nd.left = build(X[L], y[L], d+1, md); nd.right = build(X[~L], y[~L], d+1, md)
    return nd
def leaves(nd, out):
    if nd.leaf: out.append((nd.n, nd.gini))
    else: leaves(nd.left, out); leaves(nd.right, out)

n = 60
Xa = np.random.randn(n//2, 2) * 0.6
Xb = np.random.randn(n//2, 2) * 0.6 + 2.2
X = np.vstack([Xa, Xb]); y = np.array([0]*(n//2) + [1]*(n//2))

print("root split:", best_split(X, y)[:2])   # -> (0, ~1.1712)
for md in range(5):
    lv = []; leaves(build(X, y, 0, md), lv)
    R = sum(ni*gi for ni, gi in lv) / len(y)
    print("max_depth=%d  R(T)=%.4f  n_leaves=%d" % (md, R, len(lv)))
# Our small run -> R(T): 0.5000, 0.0323, 0.0000, 0.0000, 0.0000 (depths 0..4)
#               -> root split = (feature 0, threshold ~1.1712)`
  };
})();
