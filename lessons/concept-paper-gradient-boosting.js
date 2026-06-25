/* Paper lesson — "Greedy Function Approximation: A Gradient Boosting Machine", Jerome H. Friedman,
   Annals of Statistics 29(5):1189-1232, 2001 (NO arXiv).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gradient-boosting".
   GROUNDED from the official PDF (projecteuclid, DOI 10.1214/aos/1013203451): Section 2 (Eq 7),
   Section 3 ALGORITHM 1 Gradient_Boost (lines 1-6), Section 4.1 + ALGORITHM 2 LS_Boost, Section 5
   ALGORITHM regularization (Eq 36, shrinkage nu), Table 1 / Figure 1 (the nu-M trade-off).
   Track: primitive (NumPy) — build gradient boosting from scratch and VERIFY it matches sklearn's
   GradientBoostingRegressor. The functional-descent + residual math lives in concept
   cls-gradient-boosting; here we recap and link. */
(function () {
  window.LESSONS.push({
    id: "paper-gradient-boosting",
    title: "Gradient Boosting — Greedy Function Approximation: A Gradient Boosting Machine (2001)",
    tagline: "Build a model as a sum of small trees, each fit to the negative gradient (the residual) of the loss.",
    module: "Papers · Classical ML",
    track: "primitive",
    paper: {
      authors: "Jerome H. Friedman",
      org: "Stanford University (Department of Statistics)",
      year: 2001,
      venue: "The Annals of Statistics 29(5):1189-1232 (Oct 2001)",
      citations: "",
      arxiv: "",
      url: "https://projecteuclid.org/journals/annals-of-statistics/volume-29/issue-5/Greedy-function-approximation-A-gradient-boosting-machine/10.1214/aos/1013203451.full",
      code: ""
    },
    conceptLink: "cls-gradient-boosting",
    partOf: [],
    prereqs: ["cls-gradient-boosting", "ml-trees", "ml-ensembles", "ml-gradient-descent"],

    // WHY READ IT
    problem:
      `<p>Before this paper, "boosting" was a clever-but-mysterious trick. <b>AdaBoost</b> (1997) built an
       accurate classifier by adding many weak rules in sequence, re-weighting the hard examples each round,
       and people <i>saw</i> that it worked &mdash; but it was tied to one specific exponential loss and one
       specific re-weighting recipe. There was no general recipe that said: "here is a loss you care about
       (squared error, absolute error, log-likelihood); here is the boosting algorithm for it."</p>
       <p>Friedman's paper supplies exactly that. Its key move is a change of viewpoint, stated in the very
       first line of the abstract: <i>"Function estimation/approximation is viewed from the perspective of
       numerical optimization in function space, rather than parameter space."</i> Once you see fitting a
       model as <b>gradient descent on a function</b>, boosting stops being a trick and becomes a single,
       loss-agnostic algorithm. The "weak learner re-weighting" of AdaBoost falls out as one special case.</p>`,
    contribution:
      `<ul>
        <li><b>Boosting = steepest descent in function space.</b> Treat the loss as a function of the model's
        predictions and step <i>opposite</i> the gradient. Each boosting round is one descent step; the step
        direction is a regression tree fit to the negative gradient (&sect;2-3, Eq. 7).</li>
        <li><b>One generic algorithm for any differentiable loss</b> (ALGORITHM 1 <code>Gradient_Boost</code>).
        Plug in squared error and you get <code>LS_Boost</code> (ALGORITHM 2); plug in absolute error, Huber,
        or logistic likelihood and you get the matching boosting method &mdash; same skeleton, different
        gradient (&sect;4).</li>
        <li><b>Shrinkage (the learning rate <code>nu</code>).</b> &sect;5 adds a regularizer: scale every
        tree's contribution by a small factor $0\\lt\\nu\\le 1$ before adding it (Eq. 36). Smaller $\\nu$ needs
        more trees but gives better accuracy &mdash; the now-universal "learning rate" knob.</li>
      </ul>`,
    whyItMattered:
      `<p>This is the theory under <b>XGBoost</b>, <b>LightGBM</b>, and <b>CatBoost</b> &mdash; the workhorses
       that win tabular-data competitions and power credit scoring, click-through prediction, and search
       ranking. The "fit the next learner to the negative gradient, scaled by a learning rate" loop they all
       run is Friedman's ALGORITHM 1 plus the shrinkage of Eq. 36. The functional-gradient view also explains
       why the same skeleton serves regression, classification, and ranking just by swapping the loss.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1-2 (Function estimation / Numerical optimization in function space)</b> &mdash; the core
        reframing: the unconstrained negative gradient $-g_m(\\mathbf{x})$ (Eq. 7) is the direction we want to
        move the predictions.</li>
        <li><b>&sect;3 (Finite data) &amp; ALGORITHM 1 <code>Gradient_Boost</code></b> &mdash; the six-line
        generic algorithm. Line 3 (the pseudo-response = negative gradient) is the heart; transcribe it.</li>
        <li><b>&sect;4.1 (Least-squares regression) &amp; ALGORITHM 2 <code>LS_Boost</code></b> &mdash; the
        special case you will implement: for squared loss the pseudo-response is just the residual
        $\\tilde y_i = y_i - F_{m-1}(\\mathbf{x}_i)$.</li>
        <li><b>&sect;5 (Regularization), Eq. 36</b> &mdash; shrinkage / the learning rate $\\nu$. Read the
        sentence "Decreasing the value of $\\nu$ increases the best value for $M$."</li>
        <li><b>Table 1 &amp; Figure 1</b> &mdash; the $\\nu$-$M$ trade-off you will reproduce in the ablation.</li>
       </ul>
       <p><b>Skim:</b> &sect;4.2-4.6 (LAD, Huber, two- and K-class logistic &mdash; same skeleton, other
       gradients), &sect;6 (the 100-target Monte-Carlo simulation), &sect;8 (interpretation: partial
       dependence, relative influence). The math you must understand is line 3 of ALGORITHM 1 and Eq. 36.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will boost regression trees on a smooth 1-D curve with learning rate $\\nu=0.1$ and watch the
       fit after 1, 5, 20, and 100 trees. Before running, guess: after just <b>1</b> tree (a single shrunk
       depth-3 tree added to the mean), will the model look like (a) the full wiggly target already, (b) a
       coarse few-step staircase nudged a little off the mean, or (c) random noise? And as trees accumulate,
       does train error fall (a) linearly, (b) fast then flatten, or (c) not at all?</p>
       <p>Second guess, the ablation: hold the number of trees fixed at 100 and shrink $\\nu$ from $1.0$ down
       to $0.03$. Does the <i>final</i> train error go <b>up</b>, <b>down</b>, or <b>stay flat</b>? Write your
       answers, then run.</p>`,
    attempt:
      `<p>Before the reveal, sketch the loop you will build (squared-error <code>LS_Boost</code>, ALGORITHM 2).
       Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Initialize: <code>F = mean(y)</code> &nbsp;<i># the constant model F0 that minimizes squared loss</i></li>
        <li>For <code>m</code> in 1..M:</li>
        <li>&nbsp;&nbsp;TODO: compute the pseudo-response <code>r = y - F</code> &nbsp;<i># negative gradient of squared loss = residual</i></li>
        <li>&nbsp;&nbsp;TODO: <code>tree = DecisionTreeRegressor(max_depth=3).fit(X, r)</code> &nbsp;<i># fit a tree to the residual</i></li>
        <li>&nbsp;&nbsp;TODO: <code>F = F + nu * tree.predict(X)</code> &nbsp;<i># Eq. 36: shrink, then add</i></li>
        <li>Predict on new x: start at <code>F0</code>, add <code>nu * tree.predict(x)</code> for every tree.</li>
       </ul>
       <p>Then assert your predictions equal <code>sklearn.ensemble.GradientBoostingRegressor</code>'s with
       the same <code>n_estimators</code>, <code>learning_rate</code>, and <code>max_depth</code>. If the
       <code>np.allclose</code> fails, your loop is wrong &mdash; the code is the oracle.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Think of the model as a single long vector: its prediction $F(\\mathbf{x}_i)$ at every training point
       $i$. The total loss $\\sum_i L(y_i, F(\\mathbf{x}_i))$ is then an ordinary function of that vector, and
       we can do <b>gradient descent on it</b>. The gradient component at point $i$ is how much the loss rises
       if that one prediction rises; the downhill direction is its negative. Friedman calls this the
       <b>negative gradient</b> $-g_m(\\mathbf{x}_i)$ (Eq. 7), evaluated at the current model $F_{m-1}$.</p>
       <p>There is a catch: a raw per-point gradient is defined only <i>at the training points</i> &mdash; it
       is not a function, so it cannot predict on new $\\mathbf{x}$. So at each round we <b>fit a regression
       tree</b> $h(\\mathbf{x};\\mathbf{a})$ to those negative-gradient values by least squares (ALGORITHM 1,
       line 4). The tree is the closest <i>generalizable</i> stand-in for the descent direction. Friedman
       names the targets the tree fits the <b>"pseudoresponses"</b> $\\tilde y_i = -g_m(\\mathbf{x}_i)$
       (line 3).</p>
       <p>For <b>squared-error loss</b> $L(y,F)=\\tfrac12(y-F)^2$ this becomes especially clean (&sect;4.1):
       the negative gradient is exactly the <b>residual</b> $\\tilde y_i = y_i - F_{m-1}(\\mathbf{x}_i)$. So
       "fit the next tree to the negative gradient" is literally "fit the next tree to what we still get
       wrong." That special case is <code>LS_Boost</code> (ALGORITHM 2), and it is what we build.</p>
       <p>Finally we take a small step: add the tree to the running model, scaled by a <b>learning rate</b>
       $\\nu$ (&sect;5, Eq. 36): $F_m = F_{m-1} + \\nu\\,\\rho_m\\,h(\\mathbf{x};\\mathbf{a}_m)$, with
       $0\\lt\\nu\\le 1$. (For squared loss the line-search scale $\\rho_m$ is $1$, so the update is simply
       $F_m = F_{m-1} + \\nu\\,h_m$.) Shrinking each step is regularization: it trades more trees for better
       generalization. Repeat $M$ times and the residuals shrink stage by stage.</p>`,
    architecture:
      `<p>Gradient boosting has no neural-network "layers" &mdash; it is an <b>iterative additive procedure</b>, so
       its architecture is the per-round loop of ALGORITHM 1 plus the shape of the final model. Here is the whole
       method component by component.</p>
       <p><b>The final model (the data flow at prediction time).</b> A trained model is a constant plus a sum of
       $M$ shrunken trees: $F_M(\\mathbf{x}) = F_0 + \\nu\\sum_{m=1}^{M}\\rho_m\\,h(\\mathbf{x};\\mathbf{a}_m)$. To
       predict, you push $\\mathbf{x}$ through <i>every</i> tree, scale each tree's leaf output by
       $\\nu\\rho_m$, and add them all to $F_0$. The trees are <b>sequential, not parallel</b>: tree $m$ was fit
       to the errors left by trees $1..m-1$, so order matters (unlike a random forest's independent, averaged
       trees).</p>
       <p><b>The base learner $h(\\mathbf{x};\\mathbf{a}_m)$.</b> A single $J$-terminal-node regression tree
       (Eq. 15): $h(\\mathbf{x}) = \\sum_{j=1}^{J} b_j\\,\\mathbf{1}(\\mathbf{x}\\in R_j)$ &mdash; it partitions
       input space into $J$ disjoint regions $R_j$ (the leaves) and outputs a constant $b_j$ per region. Tree
       <b>depth / $J$</b> controls how complex one step can be; it is a separate knob from the learning rate.</p>
       <p><b>The per-round pipeline (ALGORITHM 1, one iteration).</b> Each round is four stages wired in series:
       (1) <b>compute pseudo-responses</b> $\\tilde y_i = -g_m(\\mathbf{x}_i)$ &mdash; the
       negative gradient of the loss at the current model (line 3);
       (2) <b>fit a tree</b> to $\\{(\\mathbf{x}_i,\\tilde y_i)\\}$ by least squares, which carves out the leaf
       regions $R_{jm}$ (line 4);
       (3) <b>line search</b> for the step length $\\rho_m$ &mdash; or, with trees, a <i>separate</i> optimal
       leaf value $\\gamma_{jm}$ in each region (Eq. 18), e.g. a mean (LS), a median (LAD), or a Newton step
       (logistic);
       (4) <b>shrink and add</b>: $F_m = F_{m-1} + \\nu\\,\\rho_m\\,h_m$ (Eq. 36). The running model $F$ is the
       only state carried between rounds.</p>
       <p><b>What plugging in a loss changes.</b> The skeleton is fixed; only the <b>init $F_0$</b>, the
       <b>pseudo-response</b> (line 3), and the <b>leaf value</b> (line 5 / Eq. 18) depend on the loss. Squared
       error &rarr; mean init, residual gradient, mean leaves (<code>LS_Boost</code>). Absolute error &rarr;
       median init, sign gradient, median leaves (<code>LAD_TreeBoost</code>). Logistic &rarr; log-odds init,
       $2y/(1+e^{2yF})$ gradient, Newton leaves (<code>L2_TreeBoost</code>). One architecture, three boosting
       machines.</p>`,
    symbols: [
      { sym: "$F(\\mathbf{x})$", desc: "the <b>model's prediction</b> at input $\\mathbf{x}$ &mdash; the thing we optimize, viewed as a value we can nudge up or down." },
      { sym: "$F_{m-1}(\\mathbf{x})$", desc: "the boosted model after $m-1$ rounds (the running sum of all trees added so far, each already shrunk)." },
      { sym: "$F_m(\\mathbf{x})$", desc: "the model after adding the $m$-th tree." },
      { sym: "$L(y,F)$", desc: "the <b>loss</b> being minimized; here squared error $L=\\tfrac12(y-F)^2$. Any differentiable loss works." },
      { sym: "$y_i$", desc: "the true target value for training example $i$." },
      { sym: "$g_m(\\mathbf{x}_i)$", desc: "the <b>gradient</b> of the loss with respect to the prediction at point $i$, at the current model: $\\big[\\partial L(y_i,F(\\mathbf{x}_i))/\\partial F(\\mathbf{x}_i)\\big]_{F=F_{m-1}}$ (Eq. 7)." },
      { sym: "$\\tilde y_i$", desc: "the <b>pseudo-response</b> (ALGORITHM 1, line 3): the negative gradient $-g_m(\\mathbf{x}_i)$. For squared loss this equals the residual $y_i - F_{m-1}(\\mathbf{x}_i)$." },
      { sym: "$h(\\mathbf{x};\\mathbf{a}_m)$", desc: "the <b>weak (base) learner</b> added at round $m$ &mdash; here a small regression tree, fit by least squares to the pseudo-responses. $\\mathbf{a}_m$ are its split parameters (split variables and split locations)." },
      { sym: "$\\beta_m$", desc: "the <b>expansion coefficient</b> on the $m$-th base learner in the additive model (Eq. 2). In the steepest-descent realization it is folded into the line-search step $\\rho_m$." },
      { sym: "$\\rho_m$", desc: "the <b>line-search</b> multiplier (ALGORITHM 1, line 5; Eq. 8): the step length along the tree direction that minimizes the true loss. For squared loss $\\rho_m=1$." },
      { sym: "$J,\\;R_j,\\;b_j$", desc: "the regression tree's <b>number of leaves</b> $J$, its <b>leaf regions</b> $R_j$ (disjoint partitions of input space), and the constant <b>output</b> $b_j$ per region (Eq. 15): $h(\\mathbf{x})=\\sum_j b_j\\,\\mathbf{1}(\\mathbf{x}\\in R_j)$." },
      { sym: "$\\gamma_{jm}$", desc: "the <b>optimal leaf value</b> for region $R_{jm}$ at round $m$ (Eq. 18): the constant added in that leaf that minimizes the loss &mdash; a mean (LS), a weighted median (LAD, Eq. 14), or a Newton step (logistic, Eq. 23)." },
      { sym: "$\\nu$", desc: "the <b>learning rate</b> (shrinkage, &sect;5 Eq. 36), $0\\lt\\nu\\le 1$: each tree is scaled by $\\nu$ before being added. Smaller $\\nu$ = smaller steps = needs more trees but generalizes better (Greek 'nu')." },
      { sym: "$M$", desc: "the <b>number of boosting rounds</b> (trees). Friedman shows decreasing $\\nu$ increases the best $M$ (Table 1)." },
      { sym: "“function space”", desc: "a plain phrase, not a symbol: treating the whole vector of predictions $\\{F(\\mathbf{x}_i)\\}$ as the variable we run gradient descent on, instead of a fixed list of weights." }
    ],
    formula: `$$ F(\\mathbf{x};\\{\\beta_m,\\mathbf{a}_m\\}_1^M) = \\sum_{m=1}^{M} \\beta_m\\, h(\\mathbf{x};\\mathbf{a}_m) $$
       <p class="cap">The <b>additive expansion</b> the paper fits (Eq. 2): the model is a weighted sum of $M$ base learners $h(\\mathbf{x};\\mathbf{a}_m)$ (each a small regression tree), with expansion coefficients $\\beta_m$.</p>
       $$ (\\beta_m,\\mathbf{a}_m) = \\arg\\min_{\\beta,\\mathbf{a}} \\sum_{i=1}^{N} L\\big(y_i,\\; F_{m-1}(\\mathbf{x}_i) + \\beta\\, h(\\mathbf{x}_i;\\mathbf{a})\\big) \\qquad F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\beta_m\\, h(\\mathbf{x};\\mathbf{a}_m) $$
       <p class="cap">The ideal <b>greedy-stagewise</b> step and update (Eqs. 9-10): at round $m$ pick the learner that most reduces the loss, holding all earlier terms fixed. For most losses this joint fit is intractable, which motivates the gradient trick below.</p>
       $$ -g_m(\\mathbf{x}_i) = -\\left[\\frac{\\partial L(y_i,\\,F(\\mathbf{x}_i))}{\\partial F(\\mathbf{x}_i)}\\right]_{F(\\mathbf{x})=F_{m-1}(\\mathbf{x})} \\qquad\\Longrightarrow\\qquad \\tilde y_i = -g_m(\\mathbf{x}_i) $$
       <p class="cap">The <b>pseudo-response = negative functional gradient</b> (Eq. 7): the steepest-descent direction for the loss at training point $i$, evaluated at the current model $F_{m-1}$. The tree is fit to these $\\tilde y_i$ (Algorithm 1, line 3).</p>
       $$ \\mathbf{a}_m = \\arg\\min_{\\mathbf{a},\\beta} \\sum_{i=1}^{N}\\big[\\,\\tilde y_i - \\beta\\, h(\\mathbf{x}_i;\\mathbf{a})\\,\\big]^2 \\qquad \\rho_m = \\arg\\min_{\\rho} \\sum_{i=1}^{N} L\\big(y_i,\\; F_{m-1}(\\mathbf{x}_i) + \\rho\\, h(\\mathbf{x}_i;\\mathbf{a}_m)\\big) $$
       <p class="cap"><b>Base-learner fit then line search</b> (Eqs. 11-12 / Algorithm 1, lines 4-5): fit the tree to the pseudo-responses by <i>least squares</i> (the generalizable stand-in for $-\\mathbf{g}_m$), then choose the step length $\\rho_m$ that minimizes the <i>real</i> loss along that direction.</p>
       $$ F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\nu\\cdot\\rho_m\\, h(\\mathbf{x};\\mathbf{a}_m),\\qquad 0\\lt\\nu\\le 1 $$
       <p class="cap"><b>Shrinkage</b> (Eq. 36): scale every step by the learning rate $\\nu$ before adding it. This replaces line 6 of Algorithm 1 and is the regularizer; smaller $\\nu$ needs a larger $M$ (Table 1).</p>
       <hr>
       <p class="cap"><b>ALGORITHM 1 — <code>Gradient_Boost</code> (the generic loop, §3):</b></p>
       $$ \\begin{aligned}
          &\\textbf{1.}\\;\\; F_0(\\mathbf{x}) = \\arg\\min_{\\rho} \\textstyle\\sum_{i=1}^{N} L(y_i,\\rho) \\\\[2pt]
          &\\textbf{2.}\\;\\; \\textbf{For } m = 1 \\textbf{ to } M \\textbf{ do:} \\\\
          &\\quad\\textbf{3.}\\;\\; \\tilde y_i = -\\big[\\partial L(y_i,F(\\mathbf{x}_i))/\\partial F(\\mathbf{x}_i)\\big]_{F=F_{m-1}},\\;\\; i=1,\\dots,N \\\\
          &\\quad\\textbf{4.}\\;\\; \\mathbf{a}_m = \\arg\\min_{\\mathbf{a},\\beta} \\textstyle\\sum_{i=1}^{N}[\\tilde y_i - \\beta\\, h(\\mathbf{x}_i;\\mathbf{a})]^2 \\\\
          &\\quad\\textbf{5.}\\;\\; \\rho_m = \\arg\\min_{\\rho} \\textstyle\\sum_{i=1}^{N} L(y_i, F_{m-1}(\\mathbf{x}_i) + \\rho\\, h(\\mathbf{x}_i;\\mathbf{a}_m)) \\\\
          &\\quad\\textbf{6.}\\;\\; F_m(\\mathbf{x}) = F_{m-1}(\\mathbf{x}) + \\rho_m\\, h(\\mathbf{x};\\mathbf{a}_m) \\\\
          &\\textbf{7.}\\;\\; \\textbf{endFor}
          \\end{aligned} $$
       <p class="cap">Six lines: init to the best constant; each round compute the pseudo-response, fit a tree to it, line-search the step, add it. Shrinkage (Eq. 36) replaces line 6 with $F_m=F_{m-1}+\\nu\\,\\rho_m h$.</p>
       <hr>
       <p class="cap"><b>Special cases (same loop, different line 3):</b></p>
       $$ \\textbf{LS (squared error)}\\;\\; L=\\tfrac12(y-F)^2:\\quad \\tilde y_i = y_i - F_{m-1}(\\mathbf{x}_i),\\quad \\rho_m=\\beta_m \\;\\;(\\text{Alg. 2 } \\texttt{LS\\_Boost},\\, F_0=\\bar y) $$
       <p class="cap">§4.1: the pseudo-response is just the ordinary <b>residual</b>, so boosting = iteratively fitting the leftover error.</p>
       $$ \\textbf{LAD (absolute error)}\\;\\; L=|y-F|:\\quad \\tilde y_i = \\operatorname{sign}\\!\\big(y_i - F_{m-1}(\\mathbf{x}_i)\\big)\\;\\;(\\text{Eq. 13}),\\qquad \\gamma_{jm} = \\operatorname{median}_{\\mathbf{x}_i\\in R_{jm}}\\{\\,y_i - F_{m-1}(\\mathbf{x}_i)\\,\\}\\;\\;(\\text{Eq. 14}) $$
       <p class="cap">§4.2 (<code>LAD_TreeBoost</code>): fit the tree to the <b>sign</b> of the residual; each leaf outputs the <b>median</b> residual.</p>
       $$ \\textbf{Logistic (two-class)}\\;\\; L=\\log\\!\\big(1+e^{-2yF}\\big),\\, y\\in\\{-1,1\\}:\\quad \\tilde y_i = \\frac{2 y_i}{1 + \\exp\\!\\big(2 y_i F_{m-1}(\\mathbf{x}_i)\\big)}\\;\\;(\\text{Eq. 22}),\\qquad \\gamma_{jm} = \\frac{\\sum_{\\mathbf{x}_i\\in R_{jm}} \\tilde y_i}{\\sum_{\\mathbf{x}_i\\in R_{jm}} |\\tilde y_i|\\,(2-|\\tilde y_i|)}\\;\\;(\\text{Eq. 23}) $$
       <p class="cap">§4.5 (<code>L2_TreeBoost</code>): negative binomial log-likelihood; the leaf value is a single <b>Newton-Raphson</b> step (Eq. 23), with $F_0=\\tfrac12\\log\\frac{1+\\bar y}{1-\\bar y}$. Probabilities recovered via $p_+(\\mathbf{x})=1/(1+e^{-2F_M(\\mathbf{x})})$.</p>`,
    whatItDoes:
      `<p><b>Left (ALGORITHM 1, line 3) &mdash; the functional gradient step.</b> Compute, for each training
       point, the negative gradient of the loss with respect to that point's prediction, evaluated at the
       current model. This $\\tilde y_i$ is the direction each prediction should move to lower the loss. For
       squared loss $L=\\tfrac12(y-F)^2$ the derivative is $-(y_i-F_i)$, so the negative gradient is the plain
       <b>residual</b> $\\tilde y_i = y_i - F_{m-1}(\\mathbf{x}_i)$ &mdash; "what we still get wrong."</p>
       <p><b>Right (Eq. 36) &mdash; the shrunk update.</b> Fit a tree $h$ to those $\\tilde y_i$, then add it to
       the model after scaling by the learning rate $\\nu$. Because $\\nu\\lt 1$, each round only partly
       corrects the error, so the model improves in many small, safe steps instead of a few greedy ones &mdash;
       that is the regularization. (For squared loss $\\rho_m=1$, so the update is just
       $F_m = F_{m-1} + \\nu\\,h_m$.)</p>`,
    derivation:
      `<p><b>Short recap &mdash; full derivation in the concept lesson.</b> Goal: minimize
       $\\sum_i L(y_i, F(\\mathbf{x}_i))$ over the predictions $F(\\mathbf{x}_i)$. Gradient descent steps
       opposite the gradient, so the descent direction at point $i$ is $-g_i = -\\partial L/\\partial F_i$.</p>
       <p>For squared loss $L=\\tfrac12(y_i-F_i)^2$, differentiate: $\\partial L/\\partial F_i = -(y_i-F_i)$,
       hence $-g_i = y_i - F_i$ &mdash; the residual. We cannot move each prediction freely (we need a function
       that generalizes to new $\\mathbf{x}$), so we <b>fit a tree</b> $h_m$ to approximate $-g_i$ across all
       points (ALGORITHM 1, line 4), then take a shrunk step $F_m = F_{m-1} + \\nu\\,h_m$ (Eq. 36). Repeating
       is gradient descent whose step direction is, each round, a regression tree. The vanishing of the
       residuals across rounds, and why the line search $\\rho_m$ is needed for non-squared losses, are
       derived in full in the <b>cls-gradient-boosting</b> concept lesson &mdash; head there for the
       function-space descent picture; we only recap it here.</p>`,
    example:
      `<p>Work <b>one boosting round</b> by hand on tiny data, squared loss, $\\nu=1$, base learner = a
       depth-1 tree (a single split, a "stump"). Inputs $x=[1,2,3]$, targets $y=[10,20,30]$.</p>
       <ul class="steps">
        <li><b>Initialize</b> $F_0 = $ mean$(y) = 20$ (the constant that minimizes squared loss).</li>
        <li><b>Pseudo-response = negative gradient = residual</b> (Alg. 1 line 3, squared-loss case):
        $\\tilde y = y - F_0 = [10-20,\\;20-20,\\;30-20] = [-10,\\,0,\\,+10]$.</li>
        <li><b>Fit a stump to those residuals.</b> A depth-1 tree tries every split and keeps the one with the
        smallest squared error; each leaf outputs the <b>mean residual</b> on its side. The best split is
        $x\\lt 1.5$ (i.e. $\\{x=1\\}$ vs $\\{x=2,3\\}$): left leaf $=-10$, right leaf $=\\tfrac{0+10}{2}=+5$. So
        $h_1 = [-10,\\,+5,\\,+5]$ &mdash; that is exactly what the next tree fits.</li>
        <li><b>Shrunk update</b> (Eq. 36, $\\nu=1$, $\\rho_1=1$): $F_1 = F_0 + h_1 = [20-10,\\;20+5,\\;20+5]
        = [10,\\,25,\\,25]$.</li>
        <li><b>New residuals:</b> $y - F_1 = [0,\\,-5,\\,+5]$. The sum of squared errors dropped from
        $(-10)^2+0^2+10^2 = 200$ to $0^2+5^2+5^2 = 50$ &mdash; a $4\\times$ cut in one round. The next stump
        fits these leftovers and shrinks them again.</li>
       </ul>
       <p>These exact numbers (including the stump's split at $x\\lt 1.5$, which the tree picks because it
       minimizes squared error) are recomputed in the notebook so you can check the round by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Initialize</b> the model to the constant that minimizes the loss: for squared error,
        $F_0 = $ mean$(y)$ (ALGORITHM 1, line 1).</li>
        <li><b>For each round</b> $m = 1\\ldots M$:</li>
        <li>&nbsp;&nbsp;<b>Pseudo-response.</b> Compute the negative gradient $\\tilde y_i$ at the current model
        (line 3). Squared loss $\\Rightarrow$ residual $\\tilde y_i = y_i - F_{m-1}(\\mathbf{x}_i)$.</li>
        <li>&nbsp;&nbsp;<b>Fit a tree</b> $h_m$ to $\\{(\\mathbf{x}_i, \\tilde y_i)\\}$ by least squares
        (line 4) &mdash; a shallow regression tree (depth 2-4).</li>
        <li>&nbsp;&nbsp;<b>Shrunk update</b> (Eq. 36): $F_m = F_{m-1} + \\nu\\,h_m$ (line search $\\rho_m=1$
        for squared loss).</li>
        <li><b>Predict</b> on new $\\mathbf{x}$: $F_0 + \\nu\\sum_m h_m(\\mathbf{x})$.</li>
        <li><b>Verify</b> the whole thing matches <code>GradientBoostingRegressor</code> with the same
        <code>n_estimators</code>, <code>learning_rate</code>, <code>max_depth</code>: assert
        <code>np.allclose</code>.</li>
      </ol>`,
    results:
      `<p>Friedman's headline experiment (&sect;5-6) is the <b>shrinkage / number-of-trees trade-off</b>. From
       the paper: <i>"smaller values of $\\nu$ (more shrinkage) are seen to result in better performance,
       although there is a diminishing return for the smallest values"</i> and <i>"Decreasing the value of
       $\\nu$ increases the best value for $M$."</i> His Table 1 (5000-sample simulation, 11-terminal-node
       trees) shows, for the least-squares criterion, the iteration $M$ at the best fit climbing as $\\nu$
       falls: $\\nu=1.0\\to M\\!\\approx\\!15$, $\\nu=0.25\\to M\\!\\approx\\!77$,
       $\\nu=0.06\\to M\\!\\approx\\!326$, with the error generally improving. He sets $\\nu=0.1$ for all the
       <code>TreeBoost</code> simulation studies.</p>
       <p><i>These are the paper's reported figures, quoted from &sect;5 and Table 1. The numbers in the
       CODEVIZ panel below are from our own tiny 1-D run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track A (primitive)</b> paper, done in <b>NumPy + scikit-learn</b> (no PyTorch).
       <b>Build by hand:</b> the boosting loop itself &mdash; initialize $F_0$ = mean, each round compute the
       residual (negative gradient of squared loss), fit a tree to it, and add it scaled by $\\nu$ (Eq. 36).
       <b>Import:</b> only the single-tree learner <code>sklearn.tree.DecisionTreeRegressor</code> (the base
       learner $h$, line 4) &mdash; you are not re-implementing CART, just the boosting that wraps it. The
       payoff is the <b>verification</b>: your from-scratch predictions equal
       <code>sklearn.ensemble.GradientBoostingRegressor</code>'s to floating-point precision
       (<code>np.allclose</code>), proving your loop <i>is</i> Friedman's algorithm. The function-space
       descent derivation is recapped from the cls-gradient-boosting concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to shrink before adding.</b> Eq. 36 scales the tree by $\\nu$ <i>then</i> adds it:
        $F_m = F_{m-1} + \\nu\\,h_m$. If you add the full tree ($\\nu=1$) you take greedy steps that overfit
        faster; the <code>np.allclose</code> against sklearn (same <code>learning_rate</code>) will fail.</li>
        <li><b>Recomputing residuals against the wrong model.</b> The pseudo-response at round $m$ is the
        gradient at $F_{m-1}$ &mdash; the model <i>including all previously shrunk trees</i>. Computing it
        against $F_0$ or against an un-shrunk sum breaks the descent. <b>Fix:</b> keep a running
        <code>F</code> and update it in place each round.</li>
        <li><b>Mismatching the init.</b> sklearn's <code>GradientBoostingRegressor</code> initializes squared
        loss to the mean of $y$ (ALGORITHM 1 line 1). If you start at $0$ instead, your fit is off by a
        constant and <code>allclose</code> fails. Use <code>F0 = y.mean()</code>.</li>
        <li><b>Confusing the learning rate with the tree depth.</b> $\\nu$ controls <i>step size</i>; tree
        depth controls how complex each step is. They are different knobs &mdash; lowering $\\nu$ needs
        <i>more</i> trees (Table 1), not deeper ones.</li>
        <li><b>Reading boosting as bagging.</b> Random forests build trees independently and average; boosting
        builds them <b>sequentially</b>, each on the previous model's residual. Parallelizing the rounds the
        way you parallelize a forest changes the algorithm entirely.</li>
      </ul>`,
    recall: [
      "State ALGORITHM 1 line 3 (the pseudo-response) from memory; what is it for squared loss?",
      "Write the shrinkage update Eq. 36 and the range of $\\nu$.",
      "Why is the negative gradient of squared loss exactly the residual?",
      "If you decrease $\\nu$, what must you do to $M$, and why (Table 1)?",
      "What is the one thing the base learner $h$ is fit to each round?"
    ],
    practice: [
      {
        q: `<b>The learning-rate ablation.</b> Hold the number of trees fixed at 100 and shrink the learning
            rate $\\nu$ from $1.0$ to $0.03$. On the smooth 1-D fit, what happens to the <i>final train
            error</i>, and how does that line up with Friedman's Table 1?`,
        steps: [
          { do: `Run the from-scratch loop with $M=100$ at $\\nu \\in \\{1.0, 0.3, 0.1, 0.03\\}$, changing only $\\nu$.`, why: `An honest ablation moves one knob; any difference in final error is attributable to the learning rate.` },
          { do: `Read the final train MSE at each $\\nu$: at $\\nu=1.0$ and $0.3$ it is essentially $0$ (the 100 trees over-fit the 60 points); at $\\nu=0.1$ it is ~5e-5; at $\\nu=0.03$ it is the largest (~4e-3) because 100 small steps have not finished descending.`, why: `Small $\\nu$ means each step corrects only a little, so at a fixed budget the model is under-trained &mdash; it needs more rounds.` },
          { do: `Connect to Table 1: Friedman shows the best $M$ grows as $\\nu$ falls ($\\nu=1\\to M\\!\\approx\\!15$, $\\nu=0.06\\to M\\!\\approx\\!326$).`, why: `Same trade-off: shrinking $\\nu$ buys generalization but spends more trees; at a fixed $M$, very small $\\nu$ leaves error on the table.` }
        ],
        answer: `<p>At a fixed budget of 100 trees, the largest $\\nu$ drives train error to ~0 (over-fitting the
                 60 points), while the smallest $\\nu=0.03$ leaves the most error because 100 tiny steps have
                 not finished descending. This is exactly Friedman's $\\nu$-$M$ trade-off (Table 1): smaller
                 $\\nu$ needs a larger $M$. On held-out data the moderate $\\nu$ (with enough trees)
                 generalizes best &mdash; which is why he uses $\\nu=0.1$ throughout. The CODEVIZ panel shows
                 the staged fit at $\\nu=0.1$ closing the gap as trees accumulate.</p>`
      },
      {
        q: `Your worked example had $x=[1,2,3]$, $y=[10,20,30]$, $F_0=20$, residuals $[-10,0,10]$, stump
            $h_1=[-10,5,5]$, giving $F_1=[10,25,25]$. Now do the <b>second</b> round (still $\\nu=1$, depth-1
            stump). What residuals does it fit, and what is the new SSE?`,
        steps: [
          { do: `Residuals after round 1: $\\tilde y = y - F_1 = [10-10,\\;20-25,\\;30-25] = [0,\\,-5,\\,+5]$.`, why: `Line 3 again: the next tree fits the negative gradient at the <i>current</i> model $F_1$, not $F_0$.` },
          { do: `Fit a depth-1 stump to $[0,-5,5]$. Best split $x\\lt 2.5$ ($\\{1,2\\}$ vs $\\{3\\}$): left leaf $=\\tfrac{0+(-5)}{2}=-2.5$, right leaf $=+5$. So $h_2=[-2.5,-2.5,5]$.`, why: `Each leaf outputs the mean residual on its side; the stump minimizes squared error over the three candidate splits.` },
          { do: `Update $F_2 = F_1 + h_2 = [10-2.5,\\;25-2.5,\\;25+5] = [7.5,\\,22.5,\\,30]$. New residuals $[2.5,-2.5,0]$, SSE $=2.5^2+2.5^2+0 = 12.5$.`, why: `SSE fell $200 \\to 50 \\to 12.5$ &mdash; each round shrinks the leftover error.` }
        ],
        answer: `<p>Round 2 fits the residuals $[0,-5,5]$ left by round 1. The stump splits at $x\\lt 2.5$ giving
                 $h_2=[-2.5,-2.5,5]$, so $F_2=[7.5,22.5,30]$ and the new residuals are $[2.5,-2.5,0]$. The SSE
                 drops from $50$ to $12.5$ &mdash; the same residual-chasing descent, one more step down.</p>`
      },
      {
        q: `A teammate replaces squared-error loss with absolute-error loss $L(y,F)=|y-F|$ in the
            <b>same</b> boosting skeleton. What single line of the algorithm changes, and to what?`,
        steps: [
          { do: `Locate line 3 of ALGORITHM 1 &mdash; the pseudo-response. Everything else (fit a tree, shrink, add) is loss-agnostic.`, why: `The whole point of the paper is that ONE skeleton serves any differentiable loss; only the gradient differs.` },
          { do: `Differentiate $L=|y-F|$: $\\partial L/\\partial F = -\\operatorname{sign}(y-F)$, so the negative gradient is $\\tilde y_i = \\operatorname{sign}(y_i - F_{m-1}(\\mathbf{x}_i))$ (the paper's Eq. 13).`, why: `For absolute error the tree is fit to the <i>sign</i> of the residual, $\\pm 1$, not the residual itself &mdash; that is LAD_TreeBoost (&sect;4.2).` },
          { do: `Note the leaf values also change (a weighted median, Eq. 14) rather than a mean, but the loop is otherwise identical.`, why: `Friedman: insert the new pseudo-response into ALGORITHM 1 to get the LAD boosting method.` }
        ],
        answer: `<p>Only <b>line 3</b> (the pseudo-response) changes: for absolute-error loss the negative
                 gradient is $\\tilde y_i = \\operatorname{sign}(y_i - F_{m-1}(\\mathbf{x}_i))$ (Eq. 13), so the
                 tree is fit to the <i>sign</i> of the residual instead of the residual. The fit-tree, shrink,
                 add steps are unchanged. That loss-agnostic skeleton &mdash; swap the gradient, keep the loop
                 &mdash; is the paper's central contribution.</p>`
      }
    ]
  });

  window.CODE["paper-gradient-boosting"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>Track A (primitive): we <b>build gradient boosting from scratch</b> in NumPy &mdash; the boosting
       <i>loop</i> is ours; the only import is <code>DecisionTreeRegressor</code> for the single base learner
       (line 4). We run <code>LS_Boost</code> (squared loss) on a toy 1-D regression: init $F_0=$ mean, then
       each round fit a depth-3 tree to the residual <code>r = y - F</code> (the negative gradient, line 3) and
       add it scaled by the learning rate, <code>F += nu * tree.predict(X)</code> (Eq. 36). The first cell
       recomputes the worked example (one round, $\\nu=1$, stump): residuals $[-10,0,10]\\to h_1=[-10,5,5]\\to
       F_1=[10,25,25]$, SSE $200\\to 50$. We then <b>verify</b> the whole model against
       <code>GradientBoostingRegressor</code> with matching hyper-parameters &mdash;
       <code>np.allclose</code> passes to ~1e-15 &mdash; print the <b>staged additive fit</b> (train MSE after
       1, 5, 20, 50, 100 trees), and run the <b>ablation</b> over the learning rate and the number of trees.
       Paste into Colab (scikit-learn is preinstalled) and run.</p>`,
    code: `import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.tree import DecisionTreeRegressor

# --- 0. Sanity-check the worked example: ONE boosting round, stump, nu = 1. ---
xw, yw = np.array([[1.],[2.],[3.]]), np.array([10., 20., 30.])
F0w = yw.mean()                                   # init = mean (Alg.1 line 1) -> 20
rw  = yw - F0w                                    # residual = -gradient (line 3) -> [-10, 0, 10]
stump = DecisionTreeRegressor(max_depth=1, random_state=0).fit(xw, rw)
h1  = stump.predict(xw)                           # fit stump to residuals -> [-10, 5, 5] (split x<1.5)
F1w = F0w + 1.0 * h1                              # Eq.36, nu=1 -> [10, 25, 25]
print("worked example  F0 =", F0w, " residuals =", rw.tolist(),
      " h1 =", h1.tolist(), " F1 =", F1w.tolist())
print("  SSE before =", float((rw**2).sum()), " after =", float(((yw-F1w)**2).sum()))  # 200 -> 50


# --- 1. Toy 1-D regression target. ---
rng = np.random.RandomState(0)
X = np.linspace(-3, 3, 60).reshape(-1, 1)
y = np.sin(X).ravel() + 0.3 * X.ravel() + rng.normal(0, 0.05, 60)

LR, N_TREES, DEPTH = 0.1, 100, 3


# --- 2. Gradient boosting FROM SCRATCH (LS_Boost: squared loss). ---
def fit_gb(X, y, lr, n_trees, depth):
    F0 = y.mean()                                 # Alg.1 line 1: const minimizing squared loss
    F  = np.full_like(y, F0)
    trees = []
    for m in range(n_trees):
        r = y - F                                 # line 3: -gradient of squared loss = residual
        t = DecisionTreeRegressor(max_depth=depth, random_state=0).fit(X, r)  # line 4
        F = F + lr * t.predict(X)                 # Eq.36: F_m = F_{m-1} + nu * h_m
        trees.append(t)
    return F0, trees

def predict_gb(F0, trees, lr, Xq):
    out = np.full(Xq.shape[0], F0)
    for t in trees:
        out += lr * t.predict(Xq)
    return out

F0, trees = fit_gb(X, y, LR, N_TREES, DEPTH)
mine = predict_gb(F0, trees, LR, X)


# --- 3. VERIFY against sklearn's GradientBoostingRegressor (the oracle). ---
sk = GradientBoostingRegressor(n_estimators=N_TREES, learning_rate=LR,
                               max_depth=DEPTH, random_state=0).fit(X, y)
skpred = sk.predict(X)
print("\\nmax |mine - sklearn| =", float(np.max(np.abs(mine - skpred))))
print("np.allclose(mine, sklearn) =", np.allclose(mine, skpred, atol=1e-6))   # -> True
# max |mine - sklearn| ~ 6.7e-16  ->  my from-scratch loop IS GradientBoostingRegressor.


# --- 4. Staged additive fit: train MSE as trees accumulate. ---
def staged_mse(k):
    out = np.full_like(y, F0)
    for t in trees[:k]:
        out += LR * t.predict(X)
    return float(np.mean((out - y) ** 2))
print("\\nstaged train MSE @ [1,5,20,50,100] trees:",
      [round(staged_mse(k), 4) for k in (1, 5, 20, 50, 100)])
# -> [1.1138, 0.4875, 0.0237, 0.0004, 0.0001]  (error falls fast, then flattens)


# --- 5. Ablation: learning rate and number of trees. ---
def final_mse(lr, n):
    F0a, ts = fit_gb(X, y, lr, n, DEPTH)
    return round(float(np.mean((predict_gb(F0a, ts, lr, X) - y) ** 2)), 5)
print("\\nablation lr @100 trees:",
      {nu: final_mse(nu, 100) for nu in (1.0, 0.3, 0.1, 0.03)})
# -> {1.0: 0.0, 0.3: 0.0, 0.1: 5e-05, 0.03: 0.00437}  (small nu under-trains at fixed M -> Table 1)
print("ablation #trees @lr=0.1:",
      {n: final_mse(0.1, n) for n in (1, 5, 20, 100)})
# -> {1: 1.11381, 5: 0.48746, 20: 0.02375, 100: 5e-05}  (more rounds -> lower error)`
  };

  window.CODEVIZ["paper-gradient-boosting"] = {
    question: "As trees accumulate, does the staged additive model close in on the target, and how fast does train error fall?",
    charts: [
      {
        type: "line",
        title: "Staged additive fit — model F_m after 1, 5, 20, 100 trees vs the target (nu=0.1)",
        xlabel: "x",
        ylabel: "prediction",
        series: [
          {
            name: "target y",
            color: "#8b949e",
            points: [[-3,-0.953],[-2.695,-1.128],[-2.39,-1.352],[-1.983,-1.504],[-1.678,-1.492],[-1.271,-1.347],[-0.966,-1.24],[-0.559,-0.585],[-0.254,-0.337],[0.153,0.217],[0.458,0.562],[0.864,1.001],[1.169,1.2],[1.576,1.451],[1.881,1.436],[2.288,1.414],[2.593,1.321],[3,1.023]]
          },
          {
            name: "F_1 (1 tree)",
            color: "#ff7b72",
            points: [[-3,-0.107],[-2.695,-0.107],[-2.39,-0.134],[-1.983,-0.134],[-1.678,-0.134],[-1.271,-0.134],[-0.966,-0.134],[-0.559,-0.071],[-0.254,-0.027],[0.153,0.022],[0.458,0.067],[0.864,0.105],[1.169,0.138],[1.576,0.138],[1.881,0.138],[2.288,0.138],[2.593,0.138],[3,0.138]]
          },
          {
            name: "F_5 (5 trees)",
            color: "#d29922",
            points: [[-3,-0.498],[-2.695,-0.498],[-2.39,-0.552],[-1.983,-0.552],[-1.678,-0.552],[-1.271,-0.552],[-0.966,-0.552],[-0.559,-0.252],[-0.254,-0.165],[0.153,0.095],[0.458,0.244],[0.864,0.448],[1.169,0.508],[1.576,0.557],[1.881,0.557],[2.288,0.557],[2.593,0.557],[3,0.531]]
          },
          {
            name: "F_20 (20 trees)",
            color: "#58a6ff",
            points: [[-3,-0.975],[-2.695,-0.992],[-2.39,-1.207],[-1.983,-1.244],[-1.678,-1.244],[-1.271,-1.202],[-0.966,-1.125],[-0.559,-0.542],[-0.254,-0.3],[0.153,0.206],[0.458,0.499],[0.864,0.894],[1.169,1.087],[1.576,1.241],[1.881,1.241],[2.288,1.241],[2.593,1.174],[3,1.021]]
          },
          {
            name: "F_100 (100 trees)",
            color: "#7ee787",
            points: [[-3,-0.956],[-2.695,-1.129],[-2.39,-1.362],[-1.983,-1.487],[-1.678,-1.477],[-1.271,-1.335],[-0.966,-1.24],[-0.559,-0.603],[-0.254,-0.337],[0.153,0.217],[0.458,0.562],[0.864,0.999],[1.169,1.199],[1.576,1.444],[1.881,1.448],[2.288,1.415],[2.593,1.321],[3,1.026]]
          }
        ]
      },
      {
        type: "line",
        title: "Train MSE vs number of trees (nu=0.1) — the staged descent",
        xlabel: "number of trees M",
        ylabel: "train MSE",
        series: [
          {
            name: "train MSE",
            color: "#7ee787",
            points: [[1,1.1138],[2,0.9048],[3,0.7357],[5,0.4875],[8,0.2636],[12,0.1173],[18,0.0354],[25,0.009],[35,0.0016],[50,0.0004],[65,0.0002],[80,0.0001],[100,0.0001]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Gradient boosting built from scratch in NumPy (one DecisionTreeRegressor of depth 3 per round, learning rate nu=0.1) on a 60-point 1-D target y = sin(x) + 0.3x + noise. <b>Top:</b> the staged additive model F_m. After 1 tree it is a coarse few-step nudge off the mean; by 5 trees a rough ramp; by 20 it tracks the curve; by 100 it hugs the target. <b>Bottom:</b> train MSE falls fast then flattens (1.11 -> 0.49 @5 -> 0.024 @20 -> ~1e-4 @100) — gradient descent in function space, one tree per step. The full from-scratch model matches sklearn's GradientBoostingRegressor to ~7e-16 (max abs difference); this verification is what proves the loop is Friedman's algorithm.",
    code: `import numpy as np
from sklearn.tree import DecisionTreeRegressor

# From-scratch LS_Boost; reproduces the staged additive fit on toy 1-D data.
rng = np.random.RandomState(0)
X = np.linspace(-3, 3, 60).reshape(-1, 1)
y = np.sin(X).ravel() + 0.3 * X.ravel() + rng.normal(0, 0.05, 60)
LR, DEPTH = 0.1, 3

F0 = y.mean(); F = np.full_like(y, F0); trees = []; snap = {}
for m in range(1, 101):
    r = y - F                                              # -gradient of squared loss (line 3)
    t = DecisionTreeRegressor(max_depth=DEPTH, random_state=0).fit(X, r)
    F = F + LR * t.predict(X)                              # Eq.36
    trees.append(t)
    if m in (1, 5, 20, 100):
        snap[m] = F.copy()                                # staged additive snapshots

idx = np.linspace(0, 59, 18).astype(int)                  # subsample for the chart
print("x     :", [round(float(v), 3) for v in X.ravel()[idx]])
print("target:", [round(float(v), 3) for v in y[idx]])
for m in (1, 5, 20, 100):
    print(f"F_{m:<3d}:", [round(float(v), 3) for v in snap[m][idx]])

def staged_mse(k):
    out = np.full_like(y, F0)
    for t in trees[:k]: out += LR * t.predict(X)
    return round(float(np.mean((out - y) ** 2)), 4)
print("MSE curve:", [[k, staged_mse(k)] for k in (1,2,3,5,8,12,18,25,35,50,65,80,100)])
# F_1 ~ flat nudge off the mean; F_100 hugs the target. MSE: 1.11 -> ~1e-4. Our run, not the paper's.`
  };
})();
