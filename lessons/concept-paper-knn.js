/* Paper lesson — "Nearest Neighbor Pattern Classification" (Cover & Hart, 1967).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-knn".
   GROUNDED from the IEEE Trans. Information Theory paper (IT-13, No. 1, Jan 1967, pp. 21-27),
   read directly from the official Stanford-hosted PDF (T. M. Cover's page). Abstract, Section II
   (the NN rule), and Section VI (the error-bound theorem, Eqns 13, 24-26, 29) transcribed there.
   Track A (primitive): build the 1-nearest-neighbor classifier from raw torch tensors
   (pairwise squared distances + argmin + label lookup), then VERIFY against torch.cdist with
   torch.allclose and an exact label-match assertion. */
(function () {
  window.LESSONS.push({
    id: "paper-knn",
    title: "k-NN — Nearest Neighbor Pattern Classification (1967)",
    tagline: "Classify a point by copying the label of its single closest training example — and that simple rule is provably never worse than twice the best possible error.",
    module: "Papers · Classical ML",
    track: "primitive",
    paper: {
      authors: "Thomas M. Cover, Peter E. Hart",
      org: "Stanford University (Dept. of Electrical Engineering) & Stanford Research Institute",
      year: 1967,
      venue: "IEEE Transactions on Information Theory, vol. IT-13, no. 1, pp. 21-27 (Jan 1967)",
      citations: "",
      url: "https://isl.stanford.edu/~cover/papers/transIT/0021cove.pdf",
      code: ""
    },
    conceptLink: "ml-knn",
    partOf: [],
    prereqs: ["ml-knn", "prob-bayes", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>Imagine you must label a new data point, but you do <b>not</b> know the math that generated the
       data. The paper opens with this tension (&sect;I). The statistician sits between two extremes. At one
       extreme you know the full probability law of the data, and you can compute the <b>optimal</b> rule,
       called the <b>Bayes rule</b> (the rule that makes the fewest mistakes on average). At the other
       extreme you know nothing except a pile of already-labelled examples.</p>
       <blockquote>"In the first extreme, a standard Bayes analysis will yield an optimal decision procedure
       &hellip; In the other extreme &hellip; the decision procedure is by no means clear. This problem is in
       the domain of nonparametric statistics and no optimal classification procedure exists with respect to
       all underlying statistics." (&sect;I)</blockquote>
       <p>So the open question in 1967 was: with <i>no</i> knowledge of the underlying distribution, just
       labelled samples, is there a simple rule that is <b>guaranteed</b> to do well? Before this paper there
       was no analytic answer for the finite-sample or finite-number-of-neighbors case.</p>`,
    contribution:
      `<ul>
        <li><b>The nearest-neighbor (NN) rule, stated cleanly.</b> To classify a new point $x$, find the
        single training example closest to it (by any distance, called a <b>metric</b>), and copy that
        example's label. Nothing is fit or trained. The paper calls this "perhaps the simplest" such rule
        (&sect;I).</li>
        <li><b>A guarantee against the best-possible error.</b> They prove that, with enough data, the NN
        rule's error rate is at most <b>twice</b> the Bayes error rate (the lowest error any rule can reach).
        From the abstract: the NN rule has "a probability of error which is less than twice the Bayes
        probability of error."</li>
        <li><b>A vivid interpretation.</b> The abstract concludes: "it may be said that half the
        classification information in an infinite sample set is contained in the nearest neighbor." Half the
        usable signal is sitting in one point.</li>
      </ul>`,
    whyItMattered:
      `<p>This is the founding theory paper for instance-based learning. The k-nearest-neighbor family,
       recommender systems built on "find similar items," and modern vector search (embed everything, then
       retrieve the closest vectors) all rest on the idea this paper made rigorous: closeness in a good
       feature space implies a shared label. The "$R \\le 2R^*$" bound is still the textbook proof that a
       memorize-the-data rule can be near-optimal without ever estimating a probability density.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>The Abstract</b> &mdash; it states the whole result in five sentences, including the
        $M$-category bound $R^* \\lt R \\lt R^*(2 - MR^*/(M-1))$ and the "twice the Bayes error" headline.</li>
        <li><b>&sect;II (The Nearest Neighbor Rule)</b> &mdash; the formal setup: $n$ labelled pairs in a
        metric space, the nearest neighbor $x_n'$ defined by Eqn. 1, and the rule "decide $x$ belongs to the
        category of its nearest neighbor."</li>
        <li><b>&sect;VI (Nearest Neighbor Probability of Error)</b> &mdash; the main <b>Theorem</b> and its
        bound (Eqn. 13). This is the payoff. The key algebra is Eqns 24-26.</li>
       </ul>
       <p><b>Skim:</b> &sect;III (admissibility &mdash; that 1-NN can beat $k$-NN on some distributions),
       &sect;IV-V (the Bayes-risk definitions and the convergence lemma proof). The two ideas you must take
       away are the <i>rule</i> (&sect;II) and the <i>bound</i> (&sect;VI).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Suppose the best-possible classifier (the Bayes rule, which knows the true distribution) makes a
       mistake $10\\%$ of the time on some problem. Now use the dumb nearest-neighbor rule instead: just copy
       the label of the closest training point, with a huge training set. What is the <b>worst</b> error rate
       you could be stuck with? Write a guess as a multiple of $10\\%$, then read the bound.</p>
       <p>(Hint: the paper's answer is a single small integer multiple. The surprise is that "memorize and
       copy the nearest point" cannot blow up arbitrarily.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the classifier you will build with raw tensors. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li>Inputs: a training matrix <code>Xtr</code> (one row per example), labels <code>ytr</code>, and a
        batch of query rows <code>Xte</code>.</li>
        <li>TODO: compute the <b>squared distance</b> from every query to every training point. Use the
        expansion $\\lVert a-b\\rVert^2 = \\lVert a\\rVert^2 - 2\\,a\\!\\cdot\\!b + \\lVert b\\rVert^2$ so it is one matrix
        multiply plus two broadcasts &mdash; no Python loop.</li>
        <li>TODO: for each query row, take <code>argmin</code> over the training axis to find the nearest
        training index.</li>
        <li>TODO: return <code>ytr[nearest_index]</code> &mdash; copy the neighbor's label.</li>
        <li>TODO: verify it against <code>torch.cdist</code> + <code>argmin</code> with
        <code>torch.allclose</code> on the distances and an exact-equality check on the labels.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The setup (&sect;II). You are given $n$ labelled pairs $(x_1, \\theta_1), \\dots, (x_n, \\theta_n)$.
       Each $x_i$ is a point in a space $X$ that carries a <b>metric</b> $d$ &mdash; a distance function, for
       example ordinary straight-line (Euclidean) distance. Each $\\theta_i$ is that point's <b>category</b>
       (its class label), one of $M$ possible classes.</p>
       <p>The rule. A new, unlabelled point $x$ arrives. Define its <b>nearest neighbor</b> $x_n'$ as the
       training point whose distance to $x$ is smallest (Eqn. 1: $\\min_i d(x_i, x) = d(x_n', x)$). The NN
       rule then "decides $x$ belongs to the category $\\theta_n'$ of its nearest neighbor $x_n'$." That is the
       whole algorithm. The paper stresses: "the NN rule utilizes only the classification of the nearest
       neighbor. The $n-1$ remaining classifications $\\theta_i$ are ignored." (&sect;II)</p>
       <p>Why it has a guarantee (&sect;V-VI, sketched). As the training set grows, the nearest neighbor
       $x_n'$ gets arbitrarily close to the query $x$ (the paper proves this convergence as a lemma). If the
       class probabilities vary smoothly in space, then a point that is right next to $x$ tends to share
       $x$'s most-likely class. So copying the neighbor's label behaves like sampling from the true
       class-probabilities at $x$. The error you pay for that is what the theorem bounds.</p>
       <p>The result (&sect;VI). Let $R^*$ be the <b>Bayes risk</b> &mdash; the error rate of the optimal rule
       that knows the true distribution &mdash; and let $R$ be the large-sample error rate of the NN rule.
       For two classes the theorem gives $R^* \\le R \\le 2R^*(1-R^*)$, and since $2R^*(1-R^*) \\le 2R^*$, the
       NN rule is never worse than twice the best-possible error.</p>`,
    architecture:
      `<p>This is a theory paper, so the "architecture" is the <b>logical pipeline</b> from rule to bound,
       not a network. Four pieces stack on top of each other:</p>
       <ol>
        <li><b>The rule (&sect;II).</b> Input: $n$ labelled pairs $(x_i, \\theta_i)$ in a metric space $(X, d)$,
        plus a query $x$. Step 1: find the nearest neighbor $x_n'$ by Eqn. 1, $\\min_i d(x_i, x) = d(x_n', x)$.
        Step 2: output its label $\\theta_n'$. No fitting, no density estimate; the other $n-1$ labels are
        discarded.</li>
        <li><b>The Bayes reference (&sect;IV).</b> Build the optimal yardstick from the true statistics:
        posteriors $\\hat{\\eta}_i(x)$ (Eqn. 4), conditional risk $r^*(x) = \\min_i \\sum_j \\hat{\\eta}_i L(i,j)$
        (Eqn. 6), and the floor $R^* = E\\,r^*(x)$ (Eqn. 7). This is the "lowest possible error" the NN rule
        is graded against.</li>
        <li><b>The convergence lemma (&sect;V).</b> The hinge: as $n \\to \\infty$, $x_n' \\to x$ with probability
        one in any separable metric space (Eqn. 9 drives the proof). So the neighbor's label becomes an
        independent draw from the true class-probabilities <i>at $x$</i> — even for pathological
        distributions like the Cantor set.</li>
        <li><b>The bound (&sect;VI).</b> Feed the converged conditional NN risk $r(x) = 2r^*(1-r^*)$
        (Eqn. 21) into $R = E[r(x)]$ (Eqns. 24–25), drop the variance, and read off
        $R^* \\le R \\le 2R^*(1-R^*) \\le 2R^*$ (Eqn. 13). The $M$-class branch (&sect;VI, Eqns. 31–38) replaces
        the $2r^*(1-r^*)$ step with a Cauchy–Schwarz inequality to reach $R \\le R^*(2 - \\frac{M}{M-1}R^*)$.</li>
       </ol>
       <p>Two side branches hang off this spine: the <b>admissibility</b> argument (&sect;III, Eqn. 2) showing
       1-NN can strictly beat $k$-NN on some distributions, and the <b>worked triangle example</b> (&sect;VII,
       Eqn. 41) giving an exact finite-$n$ risk $R(n) = \\tfrac13 + \\frac{1}{(n+1)(n+2)}$.</p>`,
    symbols: [
      { sym: "$x$", desc: "the new, <b>unlabelled</b> point we want to classify (the query). Lives in a space $X$ with a distance function." },
      { sym: "$(x_i, \\theta_i)$", desc: "the $i$-th <b>labelled training example</b>: a point $x_i$ together with its known class $\\theta_i$." },
      { sym: "$d$", desc: "the <b>metric</b> (distance function) on $X$, e.g. Euclidean distance. \"Nearest\" means smallest $d$." },
      { sym: "$x_n'$", desc: "the <b>nearest neighbor</b> of $x$: the training point with the smallest distance $d(x_i, x)$ (Eqn. 1)." },
      { sym: "$\\theta_n'$", desc: "the <b>label of that nearest neighbor</b> &mdash; the class the NN rule outputs for $x$." },
      { sym: "$M$", desc: "the <b>number of classes</b> (categories) in the problem." },
      { sym: "$R^*$", desc: "the <b>Bayes risk</b>: the error rate of the optimal rule that knows the true data distribution. The lowest error any rule can reach &mdash; a floor." },
      { sym: "$R$", desc: "the <b>large-sample NN risk</b>: the NN rule's error rate as the number of training points goes to infinity (Eqn. 11, $R = \\lim_{n\\to\\infty} R(n)$)." },
      { sym: "$r^*(x)$", desc: "the <b>conditional Bayes risk at $x$</b>: the chance the optimal rule is wrong <i>at that one point</i>. Averaging $r^*(x)$ over all $x$ gives $R^*$." },
      { sym: "$\\hat{\\eta}_i(x)$", desc: "the <b>posterior probability</b> of class $i$ given $x$ &mdash; how likely class $i$ is, having seen the point $x$ (Bayes theorem, Eqn. 4). For $M=2$, $\\hat{\\eta}_2 = 1 - \\hat{\\eta}_1$." },
      { sym: "$\\eta_i$", desc: "the <b>prior probability</b> of class $i$ &mdash; how common class $i$ is before seeing any features. The $\\eta_i$ are non-negative and sum to $1$." },
      { sym: "$f_i(x)$", desc: "the <b>class-conditional density</b>: how likely the features $x$ are if the true class is $i$. The overall density is $f(x) = \\sum_i \\eta_i f_i(x)$ (Eqn. 8)." },
      { sym: "$L(i, j)$", desc: "the <b>loss</b> of guessing class $j$ when the truth is $i$. The paper uses 0&ndash;1 loss (Eqn. 12): $0$ if correct, $1$ if wrong." },
      { sym: "$r(x)$", desc: "the <b>conditional NN risk at $x$</b>: the large-sample chance the NN rule is wrong at that one point. For two classes $r(x) = 2r^*(x)(1-r^*(x))$ (Eqn. 21); averaging it gives $R$." },
      { sym: "$R(n)$", desc: "the <b>finite-sample NN risk</b> with exactly $n$ training points (Eqn. 10). $R = \\lim_{n\\to\\infty} R(n)$ is its large-sample limit." },
      { sym: "$\\mathrm{Var}\\,r^*(x)$", desc: "the <b>variance of the conditional Bayes risk</b> across the feature space. It is $\\ge 0$, and dropping it is exactly what turns Eqn. 25 into the upper bound (Eqn. 26)." },
      { sym: "$n$", desc: "the <b>number of labelled training examples</b>. The bound is asymptotic: it holds as $n \\to \\infty$." }
    ],
    formula: `$$ \\min_i d(x_i, x) \\;=\\; d(x_n', x), \\qquad i = 1, 2, \\dots, n $$
              <p>&sect;II, Eqn. 1 — the <b>nearest-neighbor decision rule</b>: $x_n'$ is the training point closest to $x$ under metric $d$; the NN rule outputs its label $\\theta_n'$.</p>
              $$ \\hat{\\eta}_i(x) \\;=\\; \\frac{\\eta_i f_i(x)}{\\sum_j \\eta_j f_j(x)}, \\qquad i = 1, \\dots, M $$
              <p>&sect;IV, Eqn. 4 — Bayes posterior: probability class $i$ generated $x$, from prior $\\eta_i$ and class density $f_i$.</p>
              $$ r^*(x) \\;=\\; \\min_i \\Big\\{ \\textstyle\\sum_{i=1}^{M} \\hat{\\eta}_i(x)\\,L(i, j) \\Big\\}, \\qquad R^* \\;=\\; E\\,r^*(x) $$
              <p>&sect;IV, Eqns. 6–7 — conditional Bayes risk at $x$ (pick the class of minimum expected loss) and the overall <b>Bayes risk</b> $R^*$ as its expectation.</p>
              $$ R(n) \\;=\\; E\\big[\\,L(\\theta, \\theta_n')\\,\\big], \\qquad R \\;=\\; \\lim_{n\\to\\infty} R(n) $$
              <p>&sect;VI, Eqns. 10–11 — the $n$-sample NN risk and its large-sample limit $R$, with the 0–1 loss $L = \\big[\\begin{smallmatrix} 0 & 1 \\\\ 1 & 0 \\end{smallmatrix}\\big]$ (Eqn. 12).</p>
              $$ r(x) \\;=\\; 2\\,\\hat{\\eta}_1(x)\\,\\hat{\\eta}_2(x) \\;=\\; 2\\,\\hat{\\eta}_1(x)\\,(1 - \\hat{\\eta}_1(x)) \\;=\\; 2\\,r^*(x)\\,(1 - r^*(x)) $$
              <p>&sect;VI, Eqns. 20–21 ($M=2$) — the limiting conditional NN risk: an error needs the two independent draws (query class, neighbor class) to disagree.</p>
              $$ R \\;=\\; E\\big[\\,2\\,r^*(x)\\,(1 - r^*(x))\\,\\big] \\;=\\; 2R^*(1 - R^*) \\;-\\; 2\\,\\mathrm{Var}\\,r^*(x) $$
              <p>&sect;VI, Eqns. 24–25 — the headline derivation: take the expectation of $r(x)$, then expand using $R^* = E\\,r^*$ and $E[(r^*)^2] = (R^*)^2 + \\mathrm{Var}\\,r^*$.</p>
              $$ R^* \\;\\le\\; R \\;\\le\\; 2R^*\\,(1 - R^*) \\;\\le\\; 2R^* \\qquad (M = 2) $$
              <p>&sect;VI, Eqn. 13 (with Eqn. 26) — the <b>main theorem</b>: drop the non-negative variance term to get the upper bound; $R \\ge R^*$ because Bayes is optimal. "These bounds are the tightest possible."</p>
              $$ \\sum_{i=1}^{M} \\hat{\\eta}_i^2(x) \\;\\ge\\; \\frac{(r^*(x))^2}{M-1} + (1 - r^*(x))^2 $$
              <p>&sect;VI, Eqn. 35 — the Cauchy–Schwarz step that powers the $M$-class extension, applied to $r(x) = 1 - \\sum_i \\hat{\\eta}_i^2(x)$ (Eqn. 31) with $r^*(x) = 1 - \\max_i \\hat{\\eta}_i(x)$ (Eqn. 32).</p>
              $$ R^* \\;\\lt\\; R \\;\\lt\\; R^*\\!\\left(2 - \\frac{M}{M-1}\\,R^*\\right) \\qquad (\\text{general } M) $$
              <p>&sect;VI, Eqns. 29 &amp; 38 — the $M$-category bound, from $R = 2R^* - \\frac{M}{M-1}(R^*)^2 - \\frac{M}{M-1}\\mathrm{Var}\\,r^*$ (Eqn. 37).</p>
              $$ R(n) \\;=\\; \\tfrac{1}{3} + \\frac{1}{(n+1)(n+2)} \\;\\xrightarrow[n\\to\\infty]{}\\; \\tfrac{1}{3} \\qquad \\Big(R^* = \\tfrac14 \\le R = \\tfrac13 \\le 2R^*(1-R^*) = \\tfrac38\\Big) $$
              <p>&sect;VII, Eqns. 41–44 — the worked triangle-density example: an exact finite-$n$ NN risk that converges to its limit as $1/n^2$ and sits inside the bound.</p>`,
    whatItDoes:
      `<p>Both lines sandwich the NN error rate $R$ between two values built only from the Bayes error $R^*$.</p>
       <p>The <b>left</b> inequality $R^* \\le R$ is the easy half: no rule can beat the optimal rule, so the
       NN rule cannot do better than $R^*$. The <b>right</b> inequality is the famous half: the NN error is
       at most $2R^*(1-R^*)$, which is at most $2R^*$. In plain words: <i>the lazy "copy your nearest
       neighbor" rule is never worse than twice the best error achievable by any rule at all.</i></p>
       <p>Read the shape: when the problem is nearly deterministic ($R^* \\to 0$), the factor $(1-R^*) \\to 1$,
       so $R \\to 2R^*$ but both are tiny &mdash; and in fact $R$ hugs $R^*$ closely. When the problem is pure
       coin-flip ($R^* = \\tfrac{1}{2}$), the bound gives $R \\le 2\\cdot\\tfrac12\\cdot\\tfrac12 = \\tfrac12$, so
       $R = R^* = \\tfrac12$ &mdash; nothing can help and NN does not hurt.</p>`,
    derivation:
      `<p><b>The two-class argument (&sect;VI), step by step.</b> Fix the query $x$. As the training set grows,
       the nearest neighbor lands on top of $x$, so its label behaves like an <i>independent</i> draw from
       the true class probabilities at $x$. With two classes let $\\hat{\\eta}_1(x)$ and $\\hat{\\eta}_2(x) =
       1-\\hat{\\eta}_1(x)$ be those probabilities. The NN rule errs at $x$ when the query's true class and the
       neighbor's class disagree &mdash; two independent draws landing on opposite classes:</p>
       <p>$$ r(x) = 2\\,\\hat{\\eta}_1(x)\\,\\hat{\\eta}_2(x) = 2\\,\\hat{\\eta}_1(x)\\,(1-\\hat{\\eta}_1(x)). $$</p>
       <p>The optimal (Bayes) rule at $x$ instead always picks the more likely class, so its error is the
       <i>smaller</i> probability: $r^*(x) = \\min(\\hat{\\eta}_1, 1-\\hat{\\eta}_1)$. A short check shows
       $r(x) = 2\\,r^*(x)\\,(1-r^*(x))$ (the paper's Eqn. 21). Now average over all $x$. Writing $R = E[r(x)]$
       and using $R^* = E[r^*(x)]$, the paper gets (Eqn. 24-25):</p>
       <p>$$ R = E\\big[\\,2\\,r^*(x)(1-r^*(x))\\,\\big] = 2R^*(1-R^*) - 2\\,\\mathrm{Var}\\,r^*(x). $$</p>
       <p>Variance is never negative, so dropping it only raises the right side: $R \\le 2R^*(1-R^*)$
       (Eqn. 26). And $1-R^* \\le 1$, so $R \\le 2R^*$. The left side $R \\ge R^*$ holds because the Bayes rule
       is optimal. That is the sandwich. The paper notes "these bounds are the tightest possible" (Abstract).
       The full convergence lemma and the $M$-class extension (via the Cauchy-Schwarz step, Eqns 33-38) are
       in the paper; we recap the two-class core here. The Bayes-rule background lives in the
       <b>prob-bayes</b> and <b>ml-knn</b> concept lessons.</p>`,
    example:
      `<p>Work the rule by hand on three training points in the plane. Distances are squared Euclidean
       (taking the square root does not change which point is nearest, so we skip it). Train set:</p>
       <ul class="steps">
        <li>$x_1 = (0,0)$, label $0$. &nbsp; $x_2 = (3,4)$, label $1$. &nbsp; $x_3 = (1,0)$, label $0$.</li>
        <li><b>Query</b> $x = (2,0)$. Compute squared distances to each training point:</li>
        <li>to $x_1$: $(2-0)^2 + (0-0)^2 = 4$. &nbsp; to $x_2$: $(2-3)^2 + (0-4)^2 = 1 + 16 = 17$. &nbsp;
        to $x_3$: $(2-1)^2 + (0-0)^2 = 1$.</li>
        <li><b>Take the smallest</b>: the distances are $[4,\\,17,\\,1]$, so $\\arg\\min = x_3$ (distance $1$).</li>
        <li><b>Copy its label</b>: $x_3$ has label $0$, so the NN rule predicts <b>class 0</b> for the query.</li>
       </ul>
       <p>Notice $x_2$ is class $1$ but far away ($17$), so it is ignored entirely &mdash; only the single
       nearest point votes. These exact numbers $[4, 17, 1]$ and the predicted label $0$ are recomputed in
       the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Stack the data</b> into a training matrix <code>Xtr</code> (one row per example), a label
        vector <code>ytr</code>, and a query matrix <code>Xte</code>.</li>
        <li><b>Pairwise squared distances</b> between every query and every training point, using
        $\\lVert a-b\\rVert^2 = \\lVert a\\rVert^2 - 2\\,a\\!\\cdot\\!b + \\lVert b\\rVert^2$: one matrix multiply
        <code>Xte @ Xtr.T</code> plus two squared-norm broadcasts. Result is a (queries &times; train) matrix.</li>
        <li><b>Nearest index</b>: <code>argmin</code> along the training axis gives, for each query, the row
        of its closest training point.</li>
        <li><b>Predict</b>: index the labels &mdash; <code>ytr[nearest_index]</code>.</li>
        <li><b>Verify</b>: rebuild the distances with <code>torch.cdist</code> and the labels with its
        <code>argmin</code>; assert <code>torch.allclose</code> on the squared distances and exact equality
        on the predicted labels.</li>
      </ol>`,
    results:
      `<p>The headline is the bound itself, quoted from the abstract: the NN rule "has a probability of error
       $R$ which is at least as great as the Bayes probability of error $R^*$ &hellip; and at most twice
       $R^*$," and "these bounds are the tightest possible." For $M$ classes the abstract states
       $R^* \\lt R \\lt R^*(2 - MR^*/(M-1))$. The paper also proves (&sect;III) that the single nearest
       neighbor is <b>admissible</b>: there exist distributions on which 1-NN has strictly lower error than
       any $k$-NN with $k \\neq 1$.</p>
       <p><i>These are the paper's analytic results, quoted from the abstract and &sect;III. The numbers in
       the CODEVIZ panel below are from our own tiny simulation &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track A (primitive)</b> paper: the operation is a few tensor calls, so we build it
       <b>entirely from scratch</b> with raw <code>torch</code> tensors &mdash; the pairwise squared-distance
       matrix (from the $\\lVert a-b\\rVert^2$ expansion), the <code>argmin</code>, and the label lookup. We
       <b>import</b> nothing for the core; <code>torch.cdist</code> is used <i>only as the oracle</i> we check
       ourselves against, with <code>torch.allclose</code> on the distances and an exact-equality assertion
       on the labels &mdash; the payoff is "my hand-built rule IS the library's." The Bayes-error background
       and the convergence intuition are recapped from <b>prob-bayes</b> and <b>ml-knn</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting that the bound is asymptotic.</b> $R \\le 2R^*$ holds in the large-sample limit
        ($n \\to \\infty$, Eqn. 11). With few training points the NN error can be higher; the guarantee needs
        the neighbor to actually be close to the query.</li>
        <li><b>Square root is wasted work for the argmin.</b> $\\sqrt{\\cdot}$ is monotonic, so the nearest
        point by squared distance is the same as by true distance. Skip the square root inside the rule;
        only take it if you need the actual distance value.</li>
        <li><b>Floating-point negatives in the expansion.</b> The identity
        $\\lVert a\\rVert^2 - 2a\\!\\cdot\\!b + \\lVert b\\rVert^2$ can produce a tiny negative number for
        identical points due to rounding. It does not affect <code>argmin</code>, but clamp to $0$ before any
        square root.</li>
        <li><b>Distance depends on scale.</b> The metric $d$ is part of the rule. If one feature has a much
        larger range, it dominates the distance and the "nearest" neighbor is decided by that feature alone.
        Standardize features first when that is not what you want.</li>
        <li><b>Ties.</b> If two training points are exactly equidistant, <code>argmin</code> picks the first;
        the paper notes ties have probability zero for continuous distributions, so it does not affect the
        theory.</li>
      </ul>`,
    recall: [
      "State the NN rule in one sentence (what does it output for a query $x$?).",
      "Write the Cover-Hart bound for two classes (Eqn. 13) from memory.",
      "Define $R^*$ and $R$ in plain English.",
      "Why is the right-hand bound $2R^*(1-R^*)$ and not just $2R^*$? Where does the variance term go?"
    ],
    practice: [
      {
        q: `<b>Apply the bound.</b> On a two-class problem the optimal (Bayes) classifier errs $5\\%$ of the
            time, so $R^* = 0.05$. With a very large training set, what is the tightest upper bound the
            Cover-Hart theorem gives for the nearest-neighbor error rate $R$, and what is the loose "twice"
            bound?`,
        steps: [
          { do: `Plug $R^* = 0.05$ into the tight two-class bound $2R^*(1-R^*)$.`, why: `Eqn. 13's upper bound is $2R^*(1-R^*)$, the tightest the theorem provides for $M=2$.` },
          { do: `Compute: $2 \\times 0.05 \\times (1 - 0.05) = 2 \\times 0.05 \\times 0.95 = 0.095$.`, why: `That is the guaranteed ceiling on the asymptotic NN error.` },
          { do: `Compare with the loose bound $2R^* = 2 \\times 0.05 = 0.10$.`, why: `The "$\\le 2R^*$" headline drops the $(1-R^*)$ factor, giving a slightly looser $10\\%$.` }
        ],
        answer: `<p>The tight bound is $2R^*(1-R^*) = 2(0.05)(0.95) = \\mathbf{0.095}$ (i.e. $9.5\\%$); the loose
                 "twice" bound is $2R^* = \\mathbf{0.10}$ ($10\\%$). So a memorize-the-nearest-point rule, given
                 enough data, is guaranteed to err at most about $9.5\\%$ of the time when the best possible
                 rule errs $5\\%$.</p>`
      },
      {
        q: `<b>The ablation: NN vs Bayes as the classes separate.</b> Take two 1-D Gaussian classes with equal
            priors. As you push the class means apart, the Bayes error $R^*$ shrinks toward $0$. What happens
            to the gap between the NN error $R$ and $R^*$, and does $R$ ever break the $2R^*$ ceiling?`,
        steps: [
          { do: `Reason from $R = 2R^*(1-R^*) - 2\\,\\mathrm{Var}\\,r^*$: as separation grows, $R^* \\to 0$, so the upper expression $2R^*(1-R^*) \\to 2R^*$ and both collapse toward $0$.`, why: `Small $R^*$ forces small $R$; the multiplicative bound shrinks the absolute gap.` },
          { do: `Predict $R$ stays inside $[R^*,\\,2R^*]$ at every separation, and that $R/R^*$ approaches a constant near $1$-to-$2$ as $R^* \\to 0$.`, why: `The theorem guarantees the band; the ratio cannot exceed $2$ asymptotically.` },
          { do: `Run the CODEVIZ simulation and read off the (R*, R_NN) pairs to confirm each sits below the $2R^*$ line.`, why: `An empirical check that the proven sandwich holds on real samples.` }
        ],
        answer: `<p>The absolute gap $R - R^*$ shrinks to $0$ as the classes separate (both errors vanish), and
                 $R$ stays strictly between $R^*$ and $2R^*$ throughout &mdash; never breaking the ceiling. In
                 our run, at well-separated means $R^* \\approx 0.006$ gave $R_{NN} \\approx 0.009$ (ratio
                 $\\approx 1.5$, comfortably under $2$); at barely-separated means $R^* \\approx 0.40$ gave
                 $R_{NN} \\approx 0.47$, still below $2R^* = 0.80$. The CODEVIZ panel plots exactly this band.</p>`
      },
      {
        q: `Your worked example had query $x=(2,0)$ with nearest neighbor $x_3=(1,0)$, label $0$. Suppose you
            move the query to $x=(2.6,\\,0)$. Recompute the squared distances and the predicted label. Does the
            answer change, and what does the boundary between predictions look like?`,
        steps: [
          { do: `Squared distance to $x_1=(0,0)$: $(2.6)^2 = 6.76$. To $x_3=(1,0)$: $(1.6)^2 = 2.56$. To $x_2=(3,4)$: $(0.4)^2 + 16 = 16.16$.`, why: `Same expansion as before; $x_2$ is still far because of its large second coordinate.` },
          { do: `Take the argmin of $[6.76,\\,16.16,\\,2.56]$: still $x_3$ (distance $2.56$).`, why: `$x_3$ at $(1,0)$ remains the closest along the $x$-axis until the query passes the midpoint toward another point.` },
          { do: `Copy $x_3$'s label: predict class $0$ again.`, why: `The NN rule outputs the nearest point's label; the nearest point is unchanged.` }
        ],
        answer: `<p>Distances are $[6.76,\\,16.16,\\,2.56]$, nearest is $x_3$, so the prediction is still
                 <b>class 0</b>. The prediction only flips where the query crosses the perpendicular bisector
                 between two training points of <i>different</i> classes &mdash; that is the NN decision
                 boundary, a stitching-together of such bisectors (a Voronoi diagram).</p>`
      }
    ]
  });

  window.CODE["paper-knn"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track A: we <b>build</b> the 1-nearest-neighbor classifier from raw tensors &mdash; pairwise squared
       distances via $\\lVert a-b\\rVert^2 = \\lVert a\\rVert^2 - 2\\,a\\!\\cdot\\!b + \\lVert b\\rVert^2$, then
       <code>argmin</code>, then a label lookup &mdash; and verify it against <code>torch.cdist</code> as the
       oracle. The payoff is the two assertions: <code>torch.allclose</code> on the squared distances and an
       <b>exact</b> label match. The first cell recomputes the worked example: query $(2,0)$ over training
       points $\\{(0,0)\\!:\\!0,\\ (3,4)\\!:\\!1,\\ (1,0)\\!:\\!0\\}$ gives squared distances $[4, 17, 1]$,
       nearest index $2$, predicted label $0$. Paste into Colab (torch is preinstalled &mdash; no pip) and run.</p>`,
    code: `import torch
torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example by hand. ---
Xtr = torch.tensor([[0.0, 0.0],
                    [3.0, 4.0],
                    [1.0, 0.0]])
ytr = torch.tensor([0, 1, 0])
q   = torch.tensor([[2.0, 0.0]])               # one query point

d2_hand = ((q - Xtr) ** 2).sum(dim=1)          # squared dists: (2-0)^2.. etc
print("worked d^2:", d2_hand.tolist())         # -> [4.0, 17.0, 1.0]
nn_idx = torch.argmin(d2_hand)
print("nearest idx:", nn_idx.item(), " predicted label:", ytr[nn_idx].item())
# -> nearest idx: 2  predicted label: 0


# --- 1. The 1-NN rule, built from scratch (NO torch.cdist). ---
def knn_predict_scratch(Xtr, ytr, Xte):
    # ||a-b||^2 = ||a||^2 - 2 a.b + ||b||^2 , broadcast over all (test, train) pairs
    te2   = (Xte ** 2).sum(dim=1, keepdim=True)      # (T,1)  query squared norms
    tr2   = (Xtr ** 2).sum(dim=1, keepdim=True).T    # (1,N)  train squared norms
    cross = Xte @ Xtr.T                              # (T,N)  inner products
    d2    = te2 - 2 * cross + tr2                     # (T,N)  squared distances
    nn    = torch.argmin(d2, dim=1)                   # nearest train index per query
    return ytr[nn], d2                                # copy the neighbor's label


# --- 2. Reference oracle: torch.cdist + argmin (only used to check ourselves). ---
def knn_predict_oracle(Xtr, ytr, Xte):
    d  = torch.cdist(Xte, Xtr)                        # (T,N) Euclidean distances
    nn = torch.argmin(d, dim=1)
    return ytr[nn]


# --- 3. Toy data, then VERIFY mine == oracle. ---
N, T, D, K = 200, 50, 5, 3
Xtr_r = torch.randn(N, D)
ytr_r = torch.randint(0, K, (N,))
Xte_r = torch.randn(T, D)

pred_mine, d2 = knn_predict_scratch(Xtr_r, ytr_r, Xte_r)
pred_ref      = knn_predict_oracle(Xtr_r, ytr_r, Xte_r)

d_ref2 = torch.cdist(Xte_r, Xtr_r) ** 2              # oracle squared distances
assert torch.allclose(d2, d_ref2, atol=1e-4), "distance matrix mismatch!"
assert bool((pred_mine == pred_ref).all()),  "label mismatch!"
print("allclose(d2, cdist^2):", torch.allclose(d2, d_ref2, atol=1e-4))   # True
print("exact label match    :", bool((pred_mine == pred_ref).all()))     # True
print("first 8 preds mine  :", pred_mine[:8].tolist())
print("first 8 preds oracle:", pred_ref[:8].tolist())
# allclose(d2, cdist^2): True
# exact label match    : True
# first 8 preds mine  : [2, 0, 1, 1, 1, 0, 0, 0]
# first 8 preds oracle: [2, 0, 1, 1, 1, 0, 0, 0]
# My hand-built 1-NN rule IS torch's cdist+argmin -- that's the Track A payoff.`
  };

  window.CODEVIZ["paper-knn"] = {
    question: "Does the 1-NN error rate really sit between the Bayes error R* and 2R*, as Cover & Hart prove?",
    charts: [
      {
        type: "line",
        title: "1-NN error vs Bayes error — both bounds (two 1-D Gaussian classes, varying separation)",
        xlabel: "Bayes error R*",
        ylabel: "error rate",
        series: [
          {
            name: "Upper bound 2R*",
            color: "#6e7681",
            points: [[0.0062,0.0124],[0.0227,0.0455],[0.0668,0.1336],[0.1056,0.2112],[0.1586,0.3172],[0.2266,0.4531],[0.3085,0.6169],[0.4012,0.8024]]
          },
          {
            name: "1-NN error (measured)",
            color: "#7ee787",
            points: [[0.0062,0.0093],[0.0227,0.0345],[0.0668,0.101],[0.1056,0.154],[0.1586,0.2305],[0.2266,0.3158],[0.3085,0.404],[0.4012,0.474]]
          },
          {
            name: "Lower bound R* (Bayes)",
            color: "#ff7b72",
            points: [[0.0062,0.0062],[0.0227,0.0227],[0.0668,0.0668],[0.1056,0.1056],[0.1586,0.1586],[0.2266,0.2266],[0.3085,0.3085],[0.4012,0.4012]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two 1-D Gaussian classes (equal priors, sd 1), means pushed apart so the Bayes error R* sweeps from 0.40 down to 0.006. R* is computed in closed form (integral of the minimum posterior); the 1-NN error is measured by simulation with 4000 train and 4000 test points via torch.cdist + argmin. At every separation the measured 1-NN error (green) lands strictly between the lower bound R* (red, the diagonal) and the upper bound 2R* (grey) — exactly the Cover-Hart sandwich R* &le; R &le; 2R*. As the classes separate (R* &rarr; 0) the band tightens and 1-NN hugs the Bayes floor: e.g. R*=0.006 gives R_NN=0.009 (ratio ~1.5).",
    code: `import torch
torch.manual_seed(0)

# Two 1-D Gaussian classes, equal priors. R* known in closed form;
# 1-NN error measured by simulation. Show R* <= R_NN <= 2R* (Cover-Hart).
def normal_pdf(x, mu, sd):
    return torch.exp(-0.5*((x-mu)/sd)**2) / (sd*(2*torch.pi)**0.5)

def bayes_error(mu0, mu1, sd, grid):
    p0 = 0.5*normal_pdf(grid, mu0, sd)            # joint density, class 0 (prior 1/2)
    p1 = 0.5*normal_pdf(grid, mu1, sd)            # joint density, class 1
    px = p0 + p1
    post_min = torch.minimum(p0, p1) / px         # min posterior at each x
    dx = grid[1] - grid[0]
    return float((post_min * px * dx).sum())      # R* = E[min posterior]

def nn_error(mu0, mu1, sd, n=4000, ntest=4000, seed=0):
    g = torch.Generator().manual_seed(seed)
    def sample(m):
        y = torch.randint(0, 2, (m,), generator=g)
        x = torch.where(y == 0, torch.normal(mu0, sd, (m,), generator=g),
                                torch.normal(mu1, sd, (m,), generator=g))
        return x.unsqueeze(1), y
    Xtr, ytr = sample(n); Xte, yte = sample(ntest)
    nn = torch.argmin(torch.cdist(Xte, Xtr), dim=1)   # 1-NN
    return float((ytr[nn] != yte).float().mean())

grid = torch.linspace(-12, 12, 20000)
for sep in [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0]:
    mu0, mu1 = -sep/2, sep/2
    Rstar = bayes_error(mu0, mu1, 1.0, grid)
    Rnn   = nn_error(mu0, mu1, 1.0)
    print(f"R*={Rstar:.4f}  R_NN={Rnn:.4f}  2R*={2*Rstar:.4f}  in-band={Rstar<=Rnn<=2*Rstar+0.01}")
# R*=0.4012  R_NN=0.4740  2R*=0.8024  in-band=True
# R*=0.3085  R_NN=0.4040  2R*=0.6169  in-band=True
# R*=0.2266  R_NN=0.3158  2R*=0.4531  in-band=True
# R*=0.1586  R_NN=0.2305  2R*=0.3172  in-band=True
# R*=0.1056  R_NN=0.1540  2R*=0.2112  in-band=True
# R*=0.0668  R_NN=0.1010  2R*=0.1336  in-band=True
# R*=0.0227  R_NN=0.0345  2R*=0.0455  in-band=True
# R*=0.0062  R_NN=0.0093  2R*=0.0124  in-band=True`
  };
})();
