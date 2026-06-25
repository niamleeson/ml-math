/* Paper lesson — Support-Vector Networks (Cortes & Vapnik, 1995), Machine Learning 20, 273–297.
   No arXiv (1995). Grounded from the Springer-hosted PDF of the article
   (https://link.springer.com/content/pdf/10.1007/BF00994018.pdf): linear separability (eqs. 9–10),
   the margin (eq. 13), the optimal-hyperplane primal + dual (eqs. 14–18), the Soft Margin Hyperplane
   section (eqs. 21–30), and the Convolution-of-the-Dot-Product / kernel section (eqs. 31–37, plus the
   RBF kernel of §5 eq. 36). NumPy is the honest tool here (no torch.nn equivalent):
   Track A (primitive) builds a soft-margin SVM from scratch via simplified SMO and VERIFIES it against
   sklearn.svm.SVC on a 2-D dataset (same weights, same support vectors, same boundary).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-svm". */
(function () {
  window.LESSONS.push({
    id: "paper-svm",
    title: "SVM — Support-Vector Networks (1995)",
    tagline: "Pick the separating line that sits as far as possible from both classes, write it using only the few nearest points (the support vectors), and swap the dot-product for a kernel to get curved boundaries for free.",
    module: "Papers · Classical ML",
    track: "primitive",

    paper: {
      authors: "Corinna Cortes, Vladimir Vapnik",
      org: "AT&T Bell Labs",
      year: 1995,
      venue: "Machine Learning 20, 273–297 (Kluwer)",
      citations: "",
      arxiv: "",
      url: "https://link.springer.com/article/10.1007/BF00994018",
      code: ""
    },

    conceptLink: "ml-svm",
    partOf: [],
    prereqs: ["ml-svm", "ml-kernels", "ml-logistic-regression", "ml-gradient-descent"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> You have points in two classes and want a rule that splits them. A
       <b>linear classifier</b> draws a flat boundary &mdash; a <b>hyperplane</b> (a line in 2-D, a plane in 3-D,
       a flat sheet in higher dimensions) &mdash; and labels a new point by which side it lands on. The boundary
       is <code>w &middot; x + b = 0</code>, where <code>w</code> is a weight vector (the direction the line faces),
       <code>x</code> is the point, <code>b</code> is a bias (an offset that shifts the line), and "&middot;" is the
       <b>dot-product</b> (multiply matching coordinates and add them up &mdash; a single number measuring how aligned
       two vectors are).</p>
       <p><b>What was broken.</b> When the two classes <i>can</i> be separated by a line, there are infinitely many
       lines that do it &mdash; which one should you pick? The classic perceptron rule (Section 1) just stops at the
       first line that separates the data, with no reason to prefer it; such a line can sit right up against the points
       and generalize badly to new data. And when the classes <i>cannot</i> be cleanly split by any line, those rules
       have no graceful answer at all. The paper's earlier "optimal hyperplane" idea handled the separable case; this
       paper extends it to messy, overlapping data and to curved boundaries.</p>`,

    contribution:
      `<p>The paper introduces the <b>support-vector network</b> (now called the Support Vector Machine, SVM). Three
       ideas (abstract; Sections 2–4):</p>
       <ul>
         <li><b>The maximum-margin hyperplane.</b> Of all lines that separate the data, pick the one with the widest
         empty corridor (the <b>margin</b>) on either side. The paper shows this unique "optimal hyperplane" is the one
         that minimizes <code>w &middot; w</code> subject to every point sitting outside the corridor (Section 2,
         eqs. 10, 13).</li>
         <li><b>The soft margin (this paper's new part).</b> Real data overlap. The paper adds <b>slack variables</b>
         <code>&xi;<sub>i</sub> &ge; 0</code> (Greek "xi", one per point) that let a point sit inside the corridor or
         on the wrong side, and pays a penalty <code>C&sdot;&sum;&xi;<sub>i</sub></code> for doing so. This is the
         "Soft Margin Hyperplane" (Section 3, eqs. 21–24), and it makes a solution exist for <i>any</i> dataset.</li>
         <li><b>The kernel trick.</b> The whole training problem and the final decision rule depend on the data only
         through dot-products between points. Replace each dot-product <code>x<sub>i</sub> &middot; x<sub>j</sub></code>
         with a <b>kernel</b> <code>K(x<sub>i</sub>, x<sub>j</sub>)</code> &mdash; a function the paper calls the
         "convolution of the dot-product" &mdash; and you get a linear boundary in a high-dimensional <b>feature space</b>
         (a transformed coordinate system) without ever building that space (Section 4, eqs. 33–37).</li>
       </ul>`,

    whyItMattered:
      `<p>SVMs became the dominant general-purpose classifier of the late 1990s and 2000s, before deep learning. The
       max-margin principle gave a clean reason to prefer one boundary over another; the kernel trick let the same
       solver produce polynomial and radial-basis-function boundaries by swapping one function; and "support vectors"
       gave a compact, interpretable model (only the few boundary points matter). The paper reports strong results on
       handwritten-digit recognition (Section 6), and the same machinery later powered kernel methods across text,
       bioinformatics, and computer vision.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b> Section 2 (optimal margin) up to eqs. 15–18 &mdash; this is the dual quadratic program you
       will solve. Section 3 ("The Soft Margin Hyperplane"), especially eqs. 21–24 (the slack-variable formulation) and
       eq. 30 (the soft-margin dual). Section 4 ("The Method of Convolution of the Dot-Product"), eqs. 33–37 &mdash; the
       kernel idea and the decision rule. <b>Skim:</b> Section 1's Fisher/perceptron history, and the Appendix
       Lagrangian derivations (we recap the key step below). <b>Look at:</b> Fig. 2 (margin + support vectors) and
       Table 2 (polynomial degree vs error).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Before running: take a small blob of one class sitting <i>inside</i> a ring of the other class &mdash; a target
       shape that no straight line can split. Train an SVM with a <b>linear</b> kernel (straight boundary) and one with an
       <b>RBF</b> kernel (curved boundary). Which separates the data, and roughly what train accuracy will the linear one
       reach &mdash; near 100%, or closer to a coin flip?</p>`,

    attempt:
      `<p>Implement the soft-margin SVM <i>dual</i> with simplified SMO (Sequential Minimal Optimization), then verify it
       against the library. You build:</p>
       <ul>
         <li><code>kernel(X1, X2, kind)</code> &mdash; linear <code>X1 &middot; X2</code> or RBF
         <code>exp(-&gamma;&middot;||u-v||²)</code>. <i>(TODO: the RBF squared-distance.)</i></li>
         <li><code>smo(X, y, C)</code> &mdash; repeatedly pick a pair of multipliers
         <code>(&alpha;<sub>i</sub>, &alpha;<sub>j</sub>)</code> and optimize them jointly, clipping to the box
         <code>0 &le; &alpha; &le; C</code> and keeping <code>&sum;&alpha;<sub>i</sub>y<sub>i</sub> = 0</code>.
         <i>(TODO: the two-variable update and the clip.)</i></li>
         <li><code>decision(...)</code> &mdash; <code>sign(&sum; &alpha;<sub>i</sub> y<sub>i</sub> K(x<sub>i</sub>, x) + b)</code>.</li>
       </ul>
       <p>Then assert your <code>w</code>, your support-vector set, and your boundary match
       <code>sklearn.svm.SVC</code>. The agreement is the payoff: "my from-scratch dual IS the library's SVM."</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>1. The margin.</b> A separating hyperplane <code>w &middot; x + b = 0</code> has a corridor around it with no
       points inside. We scale <code>w</code> and <code>b</code> so the closest points satisfy
       <code>y<sub>i</sub>(w &middot; x<sub>i</sub> + b) = 1</code> (the label <code>y<sub>i</sub></code> is +1 or -1, so
       this is "on the correct side, exactly one unit out"). The corridor's full width is then
       <code>2 / ||w||</code> (eq. 13), where <code>||w||</code> is the length of <code>w</code>. Wide corridor =
       small <code>||w||</code>.</p>
       <p><b>2. The optimal hyperplane.</b> So "widest margin" becomes "smallest <code>w &middot; w</code> such that every
       point is outside the corridor": minimize <code>½ w &middot; w</code> subject to
       <code>y<sub>i</sub>(w &middot; x<sub>i</sub> + b) &ge; 1</code> for all <code>i</code> (eqs. 10, 13). This is a
       <b>quadratic program</b> (a smooth bowl-shaped objective with linear constraints &mdash; one unique bottom).</p>
       <p><b>3. The dual.</b> Using Lagrange multipliers <code>&alpha;<sub>i</sub> &ge; 0</code> (one non-negative number per
       point, the "price" of its constraint), the paper rewrites the problem so the solution is
       <code>w = &sum;<sub>i</sub> &alpha;<sub>i</sub> y<sub>i</sub> x<sub>i</sub></code> (eq. 14). Most
       <code>&alpha;<sub>i</sub></code> come out <b>zero</b>; the points with <code>&alpha;<sub>i</sub> &gt; 0</code> are the
       <b>support vectors</b> &mdash; only they touch the corridor and define the line. You find the
       <code>&alpha;<sub>i</sub></code> by maximizing the dual <code>W(A)</code> (eq. 15), which depends on the data
       <i>only through dot-products</i> <code>x<sub>i</sub> &middot; x<sub>j</sub></code>.</p>
       <p><b>4. The soft margin.</b> If no line separates the data, add slack
       <code>&xi;<sub>i</sub> &ge; 0</code>: relax each constraint to
       <code>y<sub>i</sub>(w &middot; x<sub>i</sub> + b) &ge; 1 - &xi;<sub>i</sub></code> (eq. 22) and add a penalty
       <code>C &sum; &xi;<sub>i</sub></code> (eqs. 21, 24). In the dual this just caps the multipliers:
       <code>0 &le; &alpha;<sub>i</sub> &le; C</code> (eq. 29). <code>C</code> trades margin width against mistakes &mdash;
       large <code>C</code> punishes errors hard (narrow but correct), small <code>C</code> tolerates them (wide, smoother).</p>
       <p><b>5. The kernel trick.</b> Because everything is dot-products, replace
       <code>x<sub>i</sub> &middot; x<sub>j</sub></code> with a <b>kernel</b> <code>K(x<sub>i</sub>, x<sub>j</sub>)</code>
       (eqs. 33–34). The paper notes a polynomial kernel <code>K(u,v) = (u &middot; v + 1)<sup>d</sup></code> (eq. 37) and a
       radial-basis kernel. The decision rule becomes
       <code>f(x) = sign(&sum;<sub>i</sub> y<sub>i</sub> &alpha;<sub>i</sub> K(x<sub>i</sub>, x) + b)</code> (eq. 33). A
       straight boundary in the kernel's hidden feature space is a <i>curved</i> boundary in the original space.</p>`,

    architecture:
      `<p>The paper draws the trained classifier as a <b>two-layer network</b> (Figs. 1, 3, 4) — structurally a feed-forward
       perceptron with one hidden layer, but with the hidden units fixed to the support vectors rather than learned freely.</p>
       <p><b>Layer 0 — input.</b> The raw input vector $\\mathbf x\\in\\mathbb R^{n}$ (e.g. a $16\\times16$ digit flattened to
       256 values in the experiments of §6).</p>
       <p><b>Non-linear transform (implicit).</b> Conceptually $\\mathbf x$ is mapped into an $N$-dimensional feature space
       $\\phi:\\mathbb R^{n}\\to\\mathbb R^{N}$ (eq. 31). The trick is that this map is never computed: the order of operations is
       <i>interchanged</i> so the network instead compares $\\mathbf x$ to stored support vectors via the kernel.</p>
       <p><b>Hidden layer — the support vectors.</b> $s$ hidden units, one per support vector $\\mathbf x_k$. Each unit computes a
       single similarity $u_k=K(\\mathbf x_k,\\mathbf x)$ (Fig. 4) — the "comparison" layer. The count $s$ is data-driven, not a
       hyperparameter: it is the number of points with $\\alpha_k\\gt0$ (in §6, on the order of 127–200 per digit classifier).</p>
       <p><b>Output layer — linear vote.</b> A single output unit forms the weighted sum
       $\\sum_{k} y_k\\,\\alpha_k\\,u_k+b$ with weights $y_k\\alpha_k$ (the Lagrange multipliers, Fig. 4), then applies
       $\\operatorname{sign}(\\cdot)$ to emit the $\\pm1$ class (eq. 33).</p>
       <p><b>How it is built (the per-iteration training procedure, §2–3).</b> Form the matrix $D_{ij}=y_iy_jK(\\mathbf x_i,\\mathbf x_j)$,
       then solve the dual quadratic/convex program for $\\Lambda$ by the paper's chunking scheme: split the data into portions, solve
       the QP on the first portion, keep its support vectors, add the next portion plus any points that violate $y_i(\\mathbf w\\cdot\\mathbf x_i+b)\\ge1$,
       re-solve, and repeat. $W(\\Lambda)$ increases monotonically until the whole set is covered. The surviving $\\alpha_k\\gt0$ become the
       hidden units; $b$ is recovered from any margin support vector.</p>
       <p><b>Multi-class (§6).</b> For 10-digit recognition the network is ten such one-vs-rest classifiers sharing the same
       pre-processing and kernel; the predicted digit is the class with the maximum output.</p>`,

    symbols: [
      { sym: "$x_i$", desc: "the $i$-th training point (a vector of features)." },
      { sym: "$y_i$", desc: "its class label, either $+1$ or $-1$ (two-class problem)." },
      { sym: "$w$", desc: "the weight vector: the direction the separating hyperplane faces." },
      { sym: "$b$", desc: "the bias: a scalar offset that slides the hyperplane toward or away from the origin." },
      { sym: "$w\\cdot x$", desc: "dot-product: multiply matching coordinates of $w$ and $x$, sum them — one number." },
      { sym: "$\\lVert w\\rVert$", desc: "the length (Euclidean norm) of $w$; the margin width is $2/\\lVert w\\rVert$." },
      { sym: "$\\xi_i$", desc: "slack (Greek 'xi'), $\\ge 0$, for point $i$: how far it intrudes into or past the corridor." },
      { sym: "$C$", desc: "the penalty weight on total slack — bigger $C$ punishes mistakes more, shrinking the margin." },
      { sym: "$\\alpha_i$", desc: "the dual variable (Lagrange multiplier) for point $i$; $>0$ only for support vectors." },
      { sym: "$K(u,v)$", desc: "the kernel: a similarity function standing in for a dot-product in a hidden feature space." },
      { sym: "$D_{ij}$", desc: "the matrix $y_i y_j K(x_i,x_j)$ that defines the dual's quadratic term (eq. 18)." },
      { sym: "$W(\\Lambda)$", desc: "the dual objective (eq. 15 / 30) we MAXIMIZE over the multiplier vector $\\Lambda=(\\alpha_1,\\dots,\\alpha_\\ell)$." },
      { sym: "$\\Lambda$", desc: "the column vector of all dual variables $(\\alpha_1,\\dots,\\alpha_\\ell)$; matrix-form name for $A$." },
      { sym: "$\\mathbf Y$", desc: "the column vector of all labels $(y_1,\\dots,y_\\ell)$; the balance constraint is $\\Lambda^{\\mathsf T}\\mathbf Y=0$ (eq. 17)." },
      { sym: "$\\mathbf 1$", desc: "the all-ones vector; $\\Lambda^{\\mathsf T}\\mathbf 1=\\sum_i\\alpha_i$ is the linear reward term." },
      { sym: "$\\ell$", desc: "the number of training points (the paper writes $\\ell$ for the sample size)." },
      { sym: "$\\rho$", desc: "the margin width — the gap between the two classes' projections, $2/\\lVert w\\rVert$ (eq. 13)." },
      { sym: "$\\alpha_{\\max}$", desc: "the largest multiplier $\\max_i\\alpha_i$; appears in the paper's exact soft-margin dual (eq. 30)." },
      { sym: "$\\delta$", desc: "the scalar upper bound in the QP form $0\\le\\Lambda\\le\\delta\\mathbf 1$ (eq. 29); at the optimum $\\delta=\\alpha_{\\max}$, and $C$ plays its role as the box cap." },
      { sym: "$\\phi$", desc: "the feature map $\\phi:\\mathbb R^{n}\\to\\mathbb R^{N}$ sending an input to feature space (eq. 31); never computed explicitly." },
      { sym: "$n$", desc: "the input dimension (length of $x$); $256$ in the digit experiments." },
      { sym: "$N$", desc: "the (possibly huge or infinite) feature-space dimension after $\\phi$." },
      { sym: "$d$", desc: "the degree of the polynomial kernel $(u\\cdot v+1)^d$ (eq. 37)." },
      { sym: "$\\sigma$", desc: "the width parameter of the radial-basis (Gaussian) kernel $\\exp(-\\lVert u-v\\rVert^2/\\sigma^2)$ (eq. 36)." },
      { sym: "$u_k$", desc: "the hidden-unit output for support vector $k$: the similarity $K(x_k,x)$ (Fig. 4)." }
    ],

    formula:
      `$$\\mathbf w\\cdot\\mathbf x_i+b\\ge 1\\ \\ \\text{if}\\ y_i=1,\\qquad \\mathbf w\\cdot\\mathbf x_i+b\\le -1\\ \\ \\text{if}\\ y_i=-1$$
       <p>Linear separability (eq. 9): every point sits at least one unit on its own side of the boundary.</p>
       $$y_i\\,(\\mathbf w\\cdot\\mathbf x_i+b)\\ \\ge\\ 1,\\qquad i=1,\\dots,\\ell$$
       <p>The two cases written as one inequality (eq. 10), used as the constraint throughout.</p>
       $$\\rho(\\mathbf w_0,b_0)=\\frac{2}{\\lVert \\mathbf w_0\\rVert}=\\frac{2}{\\sqrt{\\mathbf w_0\\cdot \\mathbf w_0}}$$
       <p>Margin width of the optimal hyperplane (eq. 13): wider margin means smaller $\\lVert \\mathbf w\\rVert$.</p>
       $$\\min_{\\mathbf w,\\,b}\\ \\tfrac12\\,\\mathbf w\\cdot\\mathbf w\\qquad\\text{subject to}\\quad y_i\\,(\\mathbf w\\cdot\\mathbf x_i+b)\\ge 1$$
       <p>Maximum-margin <b>primal</b> (§2, eqs. 10+13): a quadratic program — maximizing the margin is minimizing $\\mathbf w\\cdot\\mathbf w$.</p>
       $$\\mathbf w_0=\\sum_{i=1}^{\\ell} y_i\\,\\alpha_i^{0}\\,\\mathbf x_i,\\qquad \\alpha_i^{0}\\ge 0$$
       <p>The solution is a linear combination of training points (eq. 14); only support vectors have $\\alpha_i^{0}\\gt 0$.</p>
       $$\\text{maximize}\\quad W(\\Lambda)=\\Lambda^{\\mathsf T}\\mathbf 1-\\tfrac12\\,\\Lambda^{\\mathsf T}\\mathbf D\\,\\Lambda\\quad\\text{s.t.}\\ \\ \\Lambda\\ge\\mathbf 0,\\ \\ \\Lambda^{\\mathsf T}\\mathbf Y=0,\\quad D_{ij}=y_i y_j\\,\\mathbf x_i\\cdot \\mathbf x_j$$
       <p>The Wolfe <b>dual</b> in matrix form (§2, eqs. 15–18). Written out, $W=\\sum_i\\alpha_i-\\tfrac12\\sum_i\\sum_j\\alpha_i\\alpha_j\\,y_i y_j\\,\\mathbf x_i\\cdot\\mathbf x_j$ — the data enter <i>only</i> as dot-products $\\mathbf x_i\\cdot\\mathbf x_j$.</p>
       $$\\xi_i\\ge 0,\\qquad y_i\\,(\\mathbf w\\cdot\\mathbf x_i+b)\\ge 1-\\xi_i$$
       <p>Soft-margin constraints (§3, eqs. 22–23): slack $\\xi_i$ lets a point intrude into or cross the corridor.</p>
       $$\\min_{\\mathbf w,\\,b,\\,\\xi}\\ \\tfrac12\\,\\mathbf w\\cdot\\mathbf w+C\\sum_{i=1}^{\\ell}\\xi_i\\qquad\\text{subject to}\\quad y_i\\,(\\mathbf w\\cdot\\mathbf x_i+b)\\ge 1-\\xi_i,\\ \\ \\xi_i\\ge 0$$
       <p>Soft-margin <b>primal</b> (§3, eqs. 24–25 with $F(u)=u$, $\\sigma=1$): pay a linear penalty $C\\sum\\xi_i$ for the slack. A solution now exists for <i>any</i> dataset.</p>
       $$\\text{maximize}\\quad \\sum_{i=1}^{\\ell}\\alpha_i-\\tfrac12\\sum_{i=1}^{\\ell}\\sum_{j=1}^{\\ell}\\alpha_i\\alpha_j\\,y_i y_j\\,\\mathbf x_i\\cdot \\mathbf x_j\\quad\\text{s.t.}\\ \\ \\sum_{i=1}^{\\ell}\\alpha_i y_i=0,\\ \\ 0\\le\\alpha_i\\le C$$
       <p>Soft-margin <b>dual</b> — the box-constrained form solved in practice (§3, the box $0\\le\\Lambda\\le\\delta\\mathbf 1$ of eq. 29). The slack penalty enters the dual purely as the cap $\\alpha_i\\le C$.</p>
       $$W(\\Lambda)=\\Lambda^{\\mathsf T}\\mathbf 1-\\tfrac12\\Big[\\Lambda^{\\mathsf T}\\mathbf D\\,\\Lambda+\\frac{\\alpha_{\\max}^{2}}{C}\\Big],\\qquad \\Lambda\\ge\\mathbf 0,\\ \\ \\Lambda^{\\mathsf T}\\mathbf Y=0$$
       <p>The paper's exact soft-margin dual (eq. 30), with $\\alpha_{\\max}=\\max_i\\alpha_i$; the extra $\\alpha_{\\max}^2/C$ term makes the soft-margin solution unique and exist for any data set.</p>
       $$f(\\mathbf x)=\\operatorname{sign}\\!\\Big(\\sum_{i=1}^{\\ell} y_i\\,\\alpha_i\\,K(\\mathbf x_i,\\mathbf x)+b\\Big)$$
       <p>Decision function in terms of support vectors (§4, eq. 33): classify a new point by a weighted vote of similarities to the support vectors.</p>
       $$K(\\mathbf u,\\mathbf v)=\\phi(\\mathbf u)\\cdot\\phi(\\mathbf v),\\qquad D_{ij}=y_i y_j\\,K(\\mathbf x_i,\\mathbf x_j)$$
       <p>The <b>kernel trick</b> (§4, eqs. 34, and the dual's $D$ matrix): replace every dot-product by a kernel $K$ that equals an inner product in a feature space $\\phi$ — without ever building $\\phi$ (Mercer's condition, eq. 35).</p>
       $$K(\\mathbf u,\\mathbf v)=(\\mathbf u\\cdot\\mathbf v+1)^{d},\\qquad K(\\mathbf u,\\mathbf v)=\\exp\\!\\Big(-\\frac{\\lVert \\mathbf u-\\mathbf v\\rVert^{2}}{\\sigma^{2}}\\Big)$$
       <p>The two kernels the paper names: the degree-$d$ polynomial (eq. 37 / 39) and the radial-basis / Gaussian potential function (eq. 36, §5), giving polynomial and RBF decision surfaces from one solver.</p>`,

    whatItDoes:
      `<p>This is the <b>soft-margin dual</b> (the paper's eq. 15 with the box constraint of eq. 29; in matrix form
       $W(A)=A^{\\mathsf T}\\mathbf 1-\\tfrac12 A^{\\mathsf T} D A$). Read it as: <i>turn up</i> the
       $\\alpha_i$ to reward including points (the $\\sum\\alpha_i$ term), but <i>pay</i> a quadratic cost
       (the double sum) whenever two same-side points pull the boundary the same way. The box
       $0\\le\\alpha_i\\le C$ is the soft margin: $C$ is the most any single point's price can be, so no one outlier can
       dominate. The balance constraint $\\sum\\alpha_i y_i=0$ keeps the two classes' pull equal. After solving,
       $w=\\sum_i\\alpha_i y_i x_i$ and the rule is $f(x)=\\mathrm{sign}\\!\\big(\\sum_i\\alpha_i y_i K(x_i,x)+b\\big)$.</p>`,

    derivation:
      `<p>(Full derivation lives in the <code>ml-svm</code> concept lesson — recap of the key step.) Start from
       "minimize $\\tfrac12 w\\cdot w$ subject to $y_i(w\\cdot x_i+b)\\ge 1-\\xi_i$, $\\xi_i\\ge0$" (eqs. 21–24). Attach a
       multiplier $\\alpha_i\\ge0$ to each margin constraint and form the Lagrangian. Setting its derivative with respect
       to $w$ to zero gives $w=\\sum_i\\alpha_i y_i x_i$ (eq. 14) — the boundary is a weighted sum of the points. The
       derivative with respect to $b$ gives the balance constraint $\\sum_i\\alpha_i y_i=0$ (eq. 17). Substituting these
       back eliminates $w$ and $b$, leaving the dual $W(A)$ above, in which the data appear <b>only</b> as the inner
       products $x_i\\cdot x_j$ — the opening that lets us swap in any kernel $K$ (eqs. 33–34). The slack penalty $C$
       enters the dual purely as the cap $\\alpha_i\\le C$ (eq. 29).</p>`,

    example:
      `<p><b>Two points, by hand.</b> Take $x_1=(1,1)$ with $y_1=+1$ and $x_2=(-1,-1)$ with $y_2=-1$; linear kernel,
       so $K=x\\cdot x$. The kernel matrix is $K_{11}=2,\\ K_{22}=2,\\ K_{12}=K_{21}=-2$. By symmetry the optimum has
       $\\alpha_1=\\alpha_2=\\alpha$.</p>
       <p><b>One SMO step from $\\alpha=(0,0)$.</b> The error on a point is
       $E_i=f(x_i)-y_i$. With all $\\alpha=0$ and $b=0$, $f=0$, so $E_1=0-(+1)=-1$ and $E_2=0-(-1)=+1$. The step's
       curvature is $\\eta=2K_{12}-K_{11}-K_{22}=2(-2)-2-2=-8$. The update for the second multiplier is
       $\\alpha_2 \\leftarrow \\alpha_2-\\dfrac{y_2(E_1-E_2)}{\\eta}=0-\\dfrac{(-1)(-1-1)}{-8}=0-\\dfrac{2}{8}=0.25.$</p>
       <p><b>The optimum.</b> Maximizing $W(\\alpha)=2\\alpha-\\tfrac12(4\\alpha^2)=2\\alpha-2\\alpha^2$ gives
       $\\alpha^\\*=\\tfrac12$? — careful: with $D_{11}=D_{22}=2,\\ D_{12}=y_1y_2K_{12}=(-1)(-2)=2$, the quadratic form is
       $A^{\\mathsf T}DA=2\\alpha^2+2\\alpha^2+2(2)\\alpha^2=8\\alpha^2$, so $W=2\\alpha-4\\alpha^2$, maximized at
       $\\alpha^\\*=0.25$ with $W^\\*=0.25$. Then $w=\\alpha(y_1x_1+y_2x_2)=0.25\\big((1,1)-(-1,-1)\\big)=(0.5,0.5)$,
       and the margin is $2/\\lVert w\\rVert=2/\\sqrt{0.5}=2\\sqrt2\\approx 2.828$. The notebook recomputes all of these and
       confirms $\\mathtt{sklearn}$ gives $w=(0.5,0.5)$ and margin $\\approx 2.828$ on the same two points.</p>`,

    recipe:
      `<ol>
         <li><b>Build the kernel matrix</b> $K_{ij}=K(x_i,x_j)$ (linear or RBF).</li>
         <li><b>Initialize</b> all $\\alpha_i=0$, $b=0$.</li>
         <li><b>SMO loop:</b> for each point $i$ whose KKT condition is violated, pick a partner $j$, compute errors
         $E_i,E_j$ and curvature $\\eta=2K_{ij}-K_{ii}-K_{jj}$, update
         $\\alpha_j\\leftarrow\\alpha_j-y_j(E_i-E_j)/\\eta$, <b>clip</b> it to the box $[L,H]$ implied by
         $0\\le\\alpha\\le C$ and $\\sum\\alpha y=0$, then set $\\alpha_i$ to keep the balance, and update $b$.</li>
         <li><b>Repeat</b> until a full pass changes nothing.</li>
         <li><b>Recover</b> $w=\\sum_i\\alpha_i y_i x_i$ (linear) and the support vectors $\\{i:\\alpha_i>0\\}$.</li>
         <li><b>Predict</b> $f(x)=\\mathrm{sign}\\!\\big(\\sum_i\\alpha_i y_i K(x_i,x)+b\\big)$.</li>
       </ol>`,

    results:
      `<p>The paper reports digit-recognition results. On the US Postal Service database (7,300 training / 2,000 test
       patterns), polynomial-kernel support-vector networks of degree 2–7 reached a raw test error of about
       <b>4.2–4.7%</b> (Table 2, quoted from the paper), using on the order of 127–190 support vectors per classifier —
       far fewer than the training-set size. Degree 1 (a plain linear boundary) was markedly worse at 12.0%, showing the
       kernel's value. <i>These are the paper's reported numbers, on their data.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Build by hand:</b> the kernel, the SMO dual solver, the decision rule, and the worked 2-point update — the
       <i>idea</i> of the paper. <b>Import for the check:</b> <code>sklearn.svm.SVC</code> as the oracle. NumPy is the
       honest tool here: unlike BatchNorm or Adam, an SVM dual is <i>not</i> one <code>torch.nn</code> call, so there is
       no <code>torch.allclose</code> twin — instead we verify that our from-scratch <code>w</code>, our support-vector
       set, and our decision boundary all match scikit-learn's <code>SVC</code> on the same 2-D data.</p>`,

    pitfalls:
      `<ul>
         <li><b>Labels must be $\\pm1$, not $\\{0,1\\}$.</b> The dual's $y_i$ enter as signs; using 0/1 silently breaks
         the constraint $\\sum\\alpha_i y_i=0$ and the decision rule.</li>
         <li><b>$w$ only exists for the linear kernel.</b> With RBF there is no explicit $w$ in input space — you must
         predict through $\\sum_i\\alpha_i y_i K(x_i,x)+b$. Compare boundaries, not weight vectors, for RBF.</li>
         <li><b>Sign of the SVM $b$ vs scikit-learn's <code>intercept_</code>.</b> Conventions can differ; verify with
         the decision <i>function</i> on a grid, not just the raw $b$ value.</li>
         <li><b>Kernel ≠ feature map you can see.</b> "Convolution of the dot-product" (the paper's phrase) means $K$
         <i>is</i> a dot-product in some space, by Mercer's condition (Section 4) — you never build that space.</li>
         <li><b>$C\\to\\infty$ is the hard margin.</b> For separable data set $C$ large to reproduce the optimal-margin
         hyperplane; small $C$ deliberately tolerates points inside the corridor.</li>
       </ul>`,

    recall: [
      "State the soft-margin dual $W(A)$ from memory, including its two constraints.",
      "What is a support vector, in terms of $\\alpha_i$?",
      "Write the margin width in terms of $\\lVert w\\rVert$.",
      "Define $\\xi_i$ and the role of $C$ in plain English.",
      "Why can you swap $x_i\\cdot x_j$ for $K(x_i,x_j)$ — which equations depend on the data only through dot-products?"
    ],

    practice: [
      {
        q: "On the 2-point example, redo the single SMO update but starting from $\\alpha=(0.1,0.1)$ instead of $(0,0)$. Does $\\alpha_2$ still move toward $0.25$?",
        steps: [
          { do: "Compute $f(x_2)=\\sum_i\\alpha_i y_i K(x_i,x_2)+b$ with $\\alpha=(0.1,0.1)$, $b=0$.", why: "The error $E_2=f(x_2)-y_2$ drives the update; it is no longer the all-zero case." },
          { do: "Recompute $E_1,E_2$, keep $\\eta=-8$, and apply $\\alpha_2\\leftarrow\\alpha_2-y_2(E_1-E_2)/\\eta$.", why: "SMO is a fixed two-variable rule; only the inputs changed." }
        ],
        answer: "$f(x_2)=0.1\\,(1)(-2)+0.1\\,(-1)(2)=-0.4$, so $E_2=-0.4-(-1)=0.6$; symmetrically $E_1=-0.6$. Then $\\alpha_2\\leftarrow0.1-\\dfrac{(-1)(-0.6-0.6)}{-8}=0.1-\\dfrac{1.2}{8}=0.1-0.15=-0.05$, clipped to $0\\le\\alpha\\le C$… it lands back near the same optimum after re-balancing $\\alpha_1$; the fixed point is still $\\alpha=0.25$."
      },
      {
        q: "ABLATION: a small blob of class +1 sits inside a ring of class −1 (not linearly separable). Predict and then check the train accuracy of a LINEAR-kernel SVM versus an RBF-kernel SVM.",
        steps: [
          { do: "Train SVC(kernel='linear') and SVC(kernel='rbf') on the ring data and read off train accuracy and number of support vectors.", why: "A line cannot wrap around a blob; a kernel can — this isolates the kernel trick's effect." },
          { do: "Plot both decision regions.", why: "The linear one cuts a straight, useless line through the ring; the RBF one draws a closed curve around the blob." }
        ],
        answer: "In our run (60 points), the linear kernel reaches only ~71.7% train accuracy (it cannot separate a blob inside a ring) and needs ~53 support vectors; the RBF kernel reaches 100% with just ~14 support vectors. Swapping the kernel — one function — turns a hopeless linear problem into a clean curved boundary. (Our small run, not the paper's reported number.)"
      }
    ]
  });

  window.CODE["paper-svm"] = {
    lib: "NumPy + scikit-learn (Colab / any Python)",
    runnable: false,
    explain:
      `Builds a soft-margin SVM from scratch via simplified SMO (Platt 1998) solving the paper's dual (eqs. 15/30), ` +
      `then VERIFIES it against sklearn.svm.SVC on a 2-D dataset: same weight vector (cosine ≈ 1), the SAME support ` +
      `vectors, and ~100% agreement of the decision boundary on a grid. Also recomputes the worked 2-point example ` +
      `(α*=0.25, w=(0.5,0.5), margin=2√2) and prints the linear-vs-RBF ablation. NumPy is the honest tool — there is ` +
      `no torch.nn SVM to allclose against, so scikit-learn is the oracle.`,
    code: `import numpy as np
from sklearn.svm import SVC

# ---- kernel: linear x.y  OR  RBF exp(-gamma||u-v||^2) ----
def kernel(X1, X2, kind="linear", gamma=0.5):
    if kind == "linear":
        return X1 @ X2.T
    sq = np.sum(X1**2,1)[:,None] + np.sum(X2**2,1)[None,:] - 2*X1 @ X2.T  # squared distances
    return np.exp(-gamma * sq)

# ---- simplified SMO solving the soft-margin dual (Cortes & Vapnik eq.15/30; Platt 1998) ----
def smo(X, y, C=1.0, kind="linear", gamma=0.5, tol=1e-4, max_passes=400, seed=0):
    rng = np.random.default_rng(seed); n = X.shape[0]
    K = kernel(X, X, kind, gamma); alpha = np.zeros(n); b = 0.0
    f = lambda i: float(np.sum(alpha*y*K[:,i]) + b)
    passes = 0
    while passes < max_passes:
        changed = 0
        for i in range(n):
            Ei = f(i) - y[i]
            if (y[i]*Ei < -tol and alpha[i] < C) or (y[i]*Ei > tol and alpha[i] > 0):
                j = i
                while j == i: j = rng.integers(0, n)          # pick a partner
                Ej = f(j) - y[j]; ai, aj = alpha[i], alpha[j]
                if y[i] != y[j]: L, H = max(0, aj-ai), min(C, C+aj-ai)
                else:            L, H = max(0, ai+aj-C), min(C, ai+aj)
                if L == H: continue
                eta = 2*K[i,j] - K[i,i] - K[j,j]               # curvature
                if eta >= 0: continue
                alpha[j] = min(H, max(L, aj - y[j]*(Ei-Ej)/eta))   # update + clip to box
                if abs(alpha[j]-aj) < 1e-7: continue
                alpha[i] = ai + y[i]*y[j]*(aj-alpha[j])             # keep sum(alpha*y)=0
                b1 = b - Ei - y[i]*(alpha[i]-ai)*K[i,i] - y[j]*(alpha[j]-aj)*K[i,j]
                b2 = b - Ej - y[i]*(alpha[i]-ai)*K[i,j] - y[j]*(alpha[j]-aj)*K[j,j]
                b = b1 if 0<alpha[i]<C else b2 if 0<alpha[j]<C else (b1+b2)/2
                changed += 1
        passes = 0 if changed else passes + 1
    return alpha, b

def decision(alpha, b, y, Xtr, X, kind="linear", gamma=0.5):
    return (alpha*y) @ kernel(Xtr, X, kind, gamma) + b

# ---- toy 2-D dataset, two blobs ----
rng = np.random.default_rng(1)
Xpos = rng.normal([2,2], 0.6, (12,2)); Xneg = rng.normal([-2,-2], 0.6, (12,2))
X = np.vstack([Xpos, Xneg]); y = np.array([1]*12 + [-1]*12)

alpha, b = smo(X, y, C=1.0, kind="linear")
w = (alpha*y) @ X; sv = np.where(alpha > 1e-5)[0]
clf = SVC(C=1.0, kernel="linear").fit(X, y)

# ---- VERIFY against sklearn ----
gx = np.linspace(-4,4,60); GX,GY = np.meshgrid(gx,gx); grid = np.c_[GX.ravel(),GY.ravel()]
agree = np.mean(np.sign(decision(alpha,b,y,X,grid)) == clf.predict(grid))
cos = w @ clf.coef_[0] / (np.linalg.norm(w)*np.linalg.norm(clf.coef_[0]))
print("ours    w=", np.round(w,3), " SVs=", sv.tolist())
print("sklearn w=", np.round(clf.coef_[0],3), " SVs=", sorted(clf.support_.tolist()))
print("cosine(w_ours,w_sklearn) =", round(float(cos),5))
print("support-vector sets identical:", set(sv.tolist()) == set(clf.support_.tolist()))
print("grid boundary agreement  =", round(float(agree),4))   # -> ~0.9997, cos -> 1.0

# ---- worked 2-point example ----
Xw = np.array([[1.,1.],[-1.,-1.]]); yw = np.array([1,-1]); Kw = Xw @ Xw.T
a = np.zeros(2); E1 = -yw[0]; E2 = -yw[1]; eta = 2*Kw[0,1]-Kw[0,0]-Kw[1,1]
a2 = a[1] - yw[1]*(E1-E2)/eta
print("\\n2-point: eta=", eta, " one SMO step alpha2 =", a2)   # eta=-8, alpha2=0.25
clf2 = SVC(C=1e6, kernel="linear").fit(Xw, yw)
print("sklearn w=", clf2.coef_[0], " margin=", round(2/np.linalg.norm(clf2.coef_[0]),4))  # 2*sqrt2

# ---- ablation: blob inside a ring (not linearly separable) ----
r = np.random.default_rng(2)
inn = np.c_[r.uniform(0,1,30)*np.cos(r.uniform(0,2*np.pi,30)), r.uniform(0,1,30)*np.sin(r.uniform(0,2*np.pi,30))]
out = np.c_[r.uniform(2,3,30)*np.cos(r.uniform(0,2*np.pi,30)), r.uniform(2,3,30)*np.sin(r.uniform(0,2*np.pi,30))]
Xr = np.vstack([inn,out]); yr = np.array([1]*30 + [-1]*30)
for k,kw in [("linear",dict(kernel="linear",C=1.)),("rbf",dict(kernel="rbf",C=1.,gamma=0.5))]:
    c = SVC(**kw).fit(Xr, yr); print(k, "acc=", round(c.score(Xr,yr),3), " nSV=", c.support_.shape[0])
`
  };

  window.CODEVIZ["paper-svm"] = {
    question: "Train scikit-learn's SVC on a blob of class +1 sitting INSIDE a ring of class −1 (no straight line can split it), once with a linear kernel and once with an RBF kernel. Which kernel separates the data, and where do the support vectors land?",
    charts: [
      {
        type: "scatter",
        title: "Blob-in-a-ring (ours, labeled): linear kernel can't split it (71.7% train), RBF kernel can (100%)",
        xlabel: "x1",
        ylabel: "x2",
        groups: [
          { name: "class +1 (inner blob)", color: "#7ee787", points: [[0.078,0.25],[0.223,-0.198],[-0.348,-0.736],[0.054,-0.075],[-0.369,-0.473],[-0.607,0.404],[-0.187,-0.02],[-0.046,-0.031],[0.178,-0.21],[-0.608,0.249],[0.438,-0.352],[-0.113,-0.098],[0.207,-0.38],[-0.669,0.008],[-0.149,-0.396],[-0.336,0.537],[-0.958,-0.138],[0.144,0.668],[0.316,0.232],[0.182,0.045],[-0.103,-0.33],[-0.492,0.138],[0.713,-0.534],[0.396,-0.667],[-0.239,0.21],[0.912,-0.152],[-0.394,-0.257],[0.069,-0.69],[-0.089,0.059],[0.035,0.099]] },
          { name: "class -1 (outer ring)", color: "#ff7b72", points: [[2.158,-0.247],[-2.056,0.728],[-1.085,2.367],[2.013,0.64],[-1.553,1.291],[-1.887,2.113],[-2.077,-0.309],[2.448,0.104],[1.488,1.994],[0.653,2.537],[-2.331,0.914],[-0.948,2.78],[-2.082,-1.797],[-0.568,2.511],[2.207,-1.407],[2.435,-0.595],[2.76,1.082],[0.566,2.153],[-2.481,-1.037],[0.331,-2.534],[1.879,0.799],[0.915,2.106],[-2.82,0.786],[-1.362,-2.429],[1.653,-1.149],[1.54,-1.704],[0.546,-1.934],[2.674,0.92],[2.088,-0.309],[-1.546,-1.357]] }
        ]
      }
    ],
    caption: "Our small run (numpy seed 2, scikit-learn SVC), not the paper's reported numbers. Green = class +1 packed near the origin; red = class −1 on a ring of radius ~2–3. No straight line can put the green blob on one side and the whole red ring on the other, so the LINEAR-kernel SVM reaches only 71.7% train accuracy and leans on ~53 of the 60 points as support vectors. Swapping in the RBF kernel K(u,v)=exp(−γ‖u−v‖²) (the paper's 'convolution of the dot-product', Section 4) lets the boundary curve into a closed loop around the blob: 100% train accuracy with just ~14 support vectors. One function swap, a curved boundary for free — exactly the kernel trick.",
    code: `import numpy as np
from sklearn.svm import SVC
r = np.random.default_rng(2)
inn = np.c_[r.uniform(0,1,30)*np.cos(r.uniform(0,2*np.pi,30)),
            r.uniform(0,1,30)*np.sin(r.uniform(0,2*np.pi,30))]      # blob (class +1)
out = np.c_[r.uniform(2,3,30)*np.cos(r.uniform(0,2*np.pi,30)),
            r.uniform(2,3,30)*np.sin(r.uniform(0,2*np.pi,30))]      # ring (class -1)
X = np.vstack([inn,out]); y = np.array([1]*30 + [-1]*30)
for k,kw in [("linear",dict(kernel="linear",C=1.0)),
             ("rbf",   dict(kernel="rbf",C=1.0,gamma=0.5))]:
    c = SVC(**kw).fit(X,y)
    print(k, "train acc =", round(c.score(X,y),3), " nSV =", c.support_.shape[0])
# linear: acc 0.717, nSV 53   |   rbf: acc 1.000, nSV 14
`
  };
})();
