/* Paper lesson — "Why Should I Trust You?": Explaining the Predictions of Any
   Classifier (LIME), Ribeiro, Singh, Guestrin, KDD 2016. Self-contained:
   lesson + CODE + CODEVIZ merged by id "paper-lime".
   GROUNDED from arXiv:1602.04938 (abstract) and the ar5iv HTML mirror
   (Section 3.2 objective Eqn. 1; Section 3.4 locally-weighted square loss
   Eqn. 2 and the exponential proximity kernel pi_x).
   Track B (architecture): compose with torch/sklearn-free numpy. Implement the
   NOVEL part by hand — explain ONE prediction of a black-box model by sampling
   perturbed points around it, weighting them by a proximity kernel, and fitting
   a sparse interpretable LINEAR surrogate by weighted least squares. */
(function () {
  window.LESSONS.push({
    id: "paper-lime",
    title: "LIME — \"Why Should I Trust You?\": Explaining the Predictions of Any Classifier (2016)",
    tagline: "Explain one prediction of any black-box model by fitting a simple linear model that is faithful only nearby.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Marco Tulio Ribeiro, Sameer Singh, Carlos Guestrin",
      org: "University of Washington",
      year: 2016,
      venue: "arXiv:1602.04938 (Feb 2016); KDD 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1602.04938",
      code: "https://github.com/marcotcr/lime"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-linear-regression", "ml-logistic-regression", "ml-gradient-descent", "fnd-gradient", "fe-what-is-a-feature", "ml-regression-metrics"],

    // WHY READ IT
    problem:
      `<p>Many strong models are <b>black boxes</b>. A black box is a model whose inside you cannot read:
       you give it an input, it gives you a prediction, but it does not tell you <i>why</i>. A deep neural
       network or a large random forest is like this. The numbers inside are too many and too tangled to
       follow by hand.</p>
       <p>This is a trust problem. From the abstract:</p>
       <blockquote>"Despite widespread adoption, machine learning models remain mostly black boxes.
       Understanding the reasons behind predictions is, however, quite important in assessing trust, which is
       fundamental if one plans to take action based on a prediction, or when choosing whether to deploy a new
       model." (Abstract)</blockquote>
       <p>One fix is to use only models that are easy to read, like a short linear formula or a small decision
       tree. But those models are often less accurate. The other fix is to read the big model directly. That is
       hard, because the big model is <b>nonlinear</b> &mdash; its behavior bends and changes from place to
       place, so no single simple rule describes it everywhere. The question the paper answers: can we keep the
       accurate black box, and still get a faithful, human-readable reason for <i>one</i> prediction at a time?</p>`,
    contribution:
      `<ul>
        <li><b>Explain locally, not globally.</b> LIME (Local Interpretable Model-agnostic Explanations) does
        not try to describe the whole black box. It picks <i>one</i> prediction and describes only the small
        region around it. A bendy surface looks like a flat plane if you zoom in far enough. LIME fits that
        local plane.</li>
        <li><b>Model-agnostic by design.</b> LIME never looks inside the black box. It only calls it on inputs
        and reads the outputs. So the same method works for any classifier: text, images, tabular &mdash;
        random forests, neural nets, anything.</li>
        <li><b>A weighted local surrogate, with a clean objective.</b> Sample points near the one being
        explained, weight them by closeness, and fit a <b>sparse linear model</b> to the black box's outputs on
        those weighted points. The linear model's coefficients are the feature attributions. The paper writes
        this as a single optimization (their Equation 1).</li>
        <li><b>Submodular pick (SP-LIME).</b> A second method that chooses a few representative predictions to
        explain, so a human can inspect a whole model from a handful of cases. (We focus on the per-prediction
        method here.)</li>
      </ul>`,
    whyItMattered:
      `<p>LIME made "explain one prediction" a standard tool. The pattern &mdash; perturb the input, watch the
       output, fit a simple local model &mdash; is now a whole subfield (local, post-hoc explanation). It is
       model-agnostic, so it spread across text, vision, and tabular models without change. It also set up the
       follow-ups: SHAP unified LIME with game-theoretic Shapley values, and Anchors (by the same authors)
       replaced the linear surrogate with if-then rules. The lasting idea: you do not need to open the black
       box to get a faithful, local reason for what it just did.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1-3.2 (Interpretable Data Representations; Fidelity-Interpretability Trade-off)</b> &mdash;
        the core idea and the main objective, their <b>Equation 1</b>: $\\xi(x) = \\arg\\min_{g\\in G}
        \\mathcal{L}(f,g,\\pi_x) + \\Omega(g)$. This is the equation you transcribe and implement.</li>
        <li><b>&sect;3.4 (Sparse Linear Explanations)</b> &mdash; the concrete choices: the locally-weighted
        square loss (their <b>Equation 2</b>), the exponential proximity kernel $\\pi_x$, and the sampling /
        perturbation procedure. This is the recipe you build.</li>
        <li><b>Figure 3</b> &mdash; the cartoon of a nonlinear decision boundary with a local linear fit through
        the explained point. One picture for the whole method.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (Submodular Pick, SP-LIME) unless you want the "explain the whole model"
       extension, and &sect;6 (the human-subject experiments). Read &sect;6's <i>setup</i> if you want the
       trust framing, but do not memorize its numbers.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a nonlinear black-box model and pick one input point to explain. You will sample many
       perturbed points around it, weight each by how close it is to the point, and fit a straight-line (linear)
       model to the black box's outputs on those weighted points. Two questions to guess before running:</p>
       <ul>
        <li>The linear surrogate is a single flat plane. How well will it match the bendy black box <b>near</b>
        the explained point versus <b>far</b> from it? Same everywhere, or much worse far away?</li>
        <li>If, near our point, the black box's output is driven almost entirely by feature&nbsp;0 (feature&nbsp;1
        barely matters there), what should the two surrogate coefficients look like?</li>
       </ul>
       <p>Write your guess and one sentence of reasoning.</p>`,
    attempt:
      `<p>Before the reveal, sketch the four steps you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Sample.</b> Draw $N$ perturbed points $z$ around the explained point $x$ (add small random
        noise). <i># these are the inputs you will probe the black box with</i></li>
        <li><b>Label with the black box.</b> Call $f(z)$ for every sample. <i># f is never opened, only
        called</i></li>
        <li><b>Weight by proximity.</b> TODO &mdash; compute $\\pi_x(z) = \\exp(-D(x,z)^2/\\sigma^2)$, where
        $D$ is distance and $\\sigma$ is a bandwidth. Closer points get weight near $1$; far points get weight
        near $0$.</li>
        <li><b>Fit the surrogate.</b> TODO &mdash; solve <b>weighted least squares</b> for a linear model
        $g(z) = c_0 + c_1 z_0 + c_2 z_1$ that minimizes $\\sum_z \\pi_x(z)\\,(f(z) - g(z))^2$. The coefficients
        $(c_1, c_2)$ are the feature attributions.</li>
        <li>TODO: why does the weighting matter? What would the fit describe if every sample had weight $1$?</li>
       </ul>
       <p>Then measure faithfulness: compare $g$ to $f$ on near samples and on far samples. Predict the gap.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>LIME has one job: explain a <b>single</b> prediction $f(x)$ of a black box $f$. It does this with four
       steps, all from outside the box.</p>
       <p><b>Step 1 &mdash; sample around $x$.</b> Generate many perturbed points $z$ near $x$ (&sect;3.4). For
       tabular data this means jittering $x$ with random noise; for text it means turning words on and off; for
       images, turning superpixels on and off. We just want a cloud of inputs that surround the point.</p>
       <p><b>Step 2 &mdash; ask the black box.</b> Run each sample through $f$ to get $f(z)$. LIME treats $f$ as a
       sealed function: it only reads inputs and outputs. That is what "model-agnostic" means &mdash; nothing
       about $f$'s internals is used.</p>
       <p><b>Step 3 &mdash; weight by proximity.</b> Not all samples matter equally. A sample right next to $x$
       tells us about the local behavior; a sample far away tells us about some other region. So each sample
       gets a weight $\\pi_x(z)$ from an <b>exponential kernel</b> on distance (&sect;3.4):</p>
       <p>$$ \\pi_x(z) = \\exp\\!\\left( -\\,\\frac{D(x,z)^2}{\\sigma^2} \\right). $$</p>
       <p>Here $D(x,z)$ is a distance (the paper uses cosine distance for text, $L_2$ distance for images), and
       $\\sigma$ is the <b>bandwidth</b> &mdash; how wide "local" is. When $z=x$ the weight is $\\exp(0)=1$; as
       $z$ moves away the weight falls smoothly toward $0$.</p>
       <p><b>Step 4 &mdash; fit a simple model that is faithful locally.</b> Now fit an interpretable model $g$
       (a sparse linear model) to the weighted samples. "Faithful locally" means: where the weights are high
       (near $x$), $g$ should agree with $f$. The paper writes this as a trade-off (&sect;3.2, Equation 1):
       minimize a <b>local-fidelity loss</b> $\\mathcal{L}(f,g,\\pi_x)$ plus a <b>complexity penalty</b>
       $\\Omega(g)$ that keeps $g$ simple. For a linear $g$, the loss is a <b>weighted square loss</b>
       (&sect;3.4, Equation 2): the proximity-weighted sum of squared gaps between $f(z)$ and $g(z)$ over the
       samples. Minimizing it is ordinary <b>weighted least squares</b>.</p>
       <p>The output is the fitted $g$. Its coefficients are the <b>local feature attributions</b>: a positive
       coefficient means that feature pushed this prediction up, a negative one pushed it down, and a near-zero
       one did not matter <i>here</i>. Because $g$ is fit only on nearby, heavily-weighted points, it matches
       $f$ near $x$ but is <i>not</i> expected to match $f$ far away. That is the point: a local explanation,
       not a global one.</p>`,
    architecture:
      `<p>LIME is a <b>pipeline</b> wrapped around a sealed black box $f$, not a network. Data flows
       perturb &rarr; weight &rarr; fit. Two algorithms sit on top.</p>
       <p><b>Algorithm 1 — Sparse Linear Explanations (one prediction).</b> Inputs: black box $f$, sample count
       $N$, instance $x$ and its interpretable form $x' \\in \\{0,1\\}^{d'}$, kernel $\\pi_x$, length $K$.</p>
       <ol>
        <li><b>Perturb.</b> For $i=1\\dots N$: draw $z'_i \\leftarrow$ <code>sample_around</code>$(x')$ — a
        nearby interpretable point (turn features on/off, or jitter). Recover its raw form $z_i$.</li>
        <li><b>Probe + weight.</b> Store the triple $\\langle z'_i,\\, f(z_i),\\, \\pi_x(z_i)\\rangle$ into the
        dataset $\\mathcal{Z}$: the surrogate's input $z'_i$, the black-box label $f(z_i)$, and the proximity
        weight $\\pi_x(z_i)$. $f$ is only ever <i>called</i>.</li>
        <li><b>Fit sparse linear.</b> $w \\leftarrow$ <b>K-LASSO</b>$(\\mathcal{Z}, K)$: select the $K$ most
        important features along the Lasso path, then learn their weights by (proximity-weighted) least squares.
        Return $w$ — the local attributions.</li>
       </ol>
       <p><b>Algorithm 2 — Submodular Pick (SP-LIME, global view).</b> Inputs: instance set $X$, budget $B$.</p>
       <ol>
        <li><b>Explain all.</b> For each $x_i \\in X$, run Algorithm 1 to get its explanation row $W_i$, building
        the $n \\times d'$ explanation matrix $W$.</li>
        <li><b>Score features.</b> For each feature $j$: $I_j = \\sqrt{\\sum_i \\lvert W_{ij}\\rvert}$ — features
        appearing strongly across many instances score higher.</li>
        <li><b>Greedy cover.</b> Start $V = \\{\\}$; while $\\lvert V\\rvert \\lt B$, add the instance whose
        marginal gain in coverage $c(V \\cup \\{i\\}, W, I)$ (Eqn. 3) is largest. This greedily optimizes the
        Pick problem (Eqn. 4) with a $1-1/e$ guarantee.</li>
        <li>Return $V$: a handful of non-redundant predictions that together showcase the model's important
        features, so a human can audit the whole model from a few cases.</li>
       </ol>
       <p>The novel, hand-built block is the <b>weighted linear surrogate</b> of Algorithm 1 (steps 1–3); the
       black box is a closed-form function called from outside, and SP-LIME is a greedy submodular loop over the
       per-instance explanations.</p>`,
    symbols: [
      { sym: "$f$", desc: "the <b>black box</b> being explained: a function from an input to a prediction (here a probability). LIME only <i>calls</i> $f$; it never reads its internals." },
      { sym: "$x$", desc: "the <b>one instance</b> whose prediction we explain. Everything is local to this point." },
      { sym: "$z$", desc: "a <b>perturbed sample</b>: a point generated near $x$ by adding noise (or turning features on/off). LIME probes $f$ at many such $z$." },
      { sym: "$g$", desc: "the <b>interpretable surrogate</b>: a simple, human-readable model (here a sparse linear model) fit to approximate $f$ near $x$. Its coefficients are the explanation." },
      { sym: "$G$", desc: "the <b>class of interpretable models</b> $g$ is chosen from (linear models, short decision trees, rule lists). We use linear models." },
      { sym: "$\\pi_x(z)$", desc: "the <b>proximity weight</b>: how much sample $z$ counts when fitting $g$, given by the exponential kernel. Near $x$ it is close to $1$; far from $x$ it is close to $0$." },
      { sym: "$D(x,z)$", desc: "a <b>distance</b> between $x$ and $z$ (cosine for text, $L_2$ for images; we use $L_2$). Bigger distance means a smaller weight." },
      { sym: "$\\sigma$", desc: "the <b>kernel bandwidth</b>: sets how wide the local neighborhood is. Large $\\sigma$ counts farther samples; small $\\sigma$ stays very local." },
      { sym: "$\\mathcal{L}(f,g,\\pi_x)$", desc: "the <b>local-fidelity loss</b>: how badly $g$ disagrees with $f$, with each sample's error scaled by its proximity weight $\\pi_x$. Lower means $g$ matches $f$ better nearby." },
      { sym: "$\\Omega(g)$", desc: "the <b>complexity penalty</b> on $g$: how hard $g$ is for a human to read (number of non-zero weights for a linear model, tree depth for a tree). Keeping it small keeps the explanation simple." },
      { sym: "$\\xi(x)$", desc: "the <b>explanation</b> for $x$: the best simple model $g$, found by minimizing fidelity loss plus complexity (Equation 1)." },
      { sym: "$\\mathcal{Z}$", desc: "the <b>set of perturbed samples</b> drawn around $x$ that the loss sums over." },
      { sym: "$z'$", desc: "the <b>interpretable representation</b> of a sample $z$: a binary vector in $\\{0,1\\}^{d'}$ (e.g. word present/absent, superpixel on/off). For our tabular demo $z'$ equals $z$." },
      { sym: "$w_g$", desc: "the <b>weight vector</b> of the linear surrogate $g(z') = w_g \\cdot z'$. Its entries are the per-feature local attributions." },
      { sym: "$d'$", desc: "the <b>number of interpretable features</b> — the dimension of $z'$." },
      { sym: "$K$", desc: "the <b>explanation length</b>: the maximum number of non-zero features allowed in $g$, enforced by $\\Omega(g)$ and chosen by K-LASSO. Smaller $K$ means a simpler, sparser explanation." },
      { sym: "$\\lVert w_g \\rVert_0$", desc: "the <b>$L_0$ norm</b> of the surrogate weights: the count of non-zero coefficients, i.e. how many features the explanation uses." },
      { sym: "$n$", desc: "the <b>number of instances</b> explained in SP-LIME (the rows of the explanation matrix $W$)." },
      { sym: "$W_{ij}$", desc: "entry of the <b>explanation matrix</b>: the absolute local weight $\\lvert w_{g_{ij}}\\rvert$ of feature $j$ in the explanation of instance $i$." },
      { sym: "$I_j$", desc: "the <b>global importance</b> of feature $j$ across all explanations, $\\sqrt{\\sum_i W_{ij}}$. Features that matter in many instances score higher." },
      { sym: "$V$", desc: "the <b>chosen set of instances</b> SP-LIME picks for a human to inspect." },
      { sym: "$c(V,W,I)$", desc: "the <b>coverage function</b>: total importance $I_j$ of the features that appear in at least one picked instance in $V$ (Eqn. 3)." },
      { sym: "$B$", desc: "the <b>budget</b>: how many representative instances SP-LIME is allowed to pick ($\\lvert V\\rvert \\le B$)." }
    ],
    formula: `<p>$$ \\xi(x) = \\underset{g \\in G}{\\arg\\min}\\; \\mathcal{L}(f, g, \\pi_x) + \\Omega(g) $$</p>
       <p><b>Eqn. 1 (&sect;3.2) — the LIME objective.</b> The explanation is the simple model $g$ that minimizes local-infidelity $\\mathcal{L}$ plus complexity $\\Omega(g)$.</p>
       <p>$$ \\mathcal{L}(f, g, \\pi_x) = \\sum_{z,z' \\in \\mathcal{Z}} \\pi_x(z)\\,\\big(f(z) - g(z')\\big)^2 $$</p>
       <p><b>Eqn. 2 (&sect;3.4) — locally-weighted square loss.</b> Sum of proximity-weighted squared gaps between the black box $f(z)$ and the surrogate $g(z')$ over the perturbed sample set $\\mathcal{Z}$.</p>
       <p>$$ \\pi_x(z) = \\exp\\!\\left( -\\,\\frac{D(x,z)^2}{\\sigma^2} \\right) $$</p>
       <p><b>Proximity kernel (&sect;3.4).</b> An exponential kernel on distance $D$ with width $\\sigma$ (cosine distance for text, $L_2$ for images). Weight $1$ at $z=x$, falling toward $0$ as $z$ moves away.</p>
       <p>$$ g(z') = w_g \\cdot z' \\qquad\\qquad \\Omega(g) = \\infty \\cdot \\mathbb{1}\\big[\\,\\lVert w_g \\rVert_0 \\gt K\\,\\big] $$</p>
       <p><b>Sparse linear surrogate (&sect;3.4).</b> $g$ is linear in the interpretable representation $z' \\in \\{0,1\\}^{d'}$; the $L_0$ complexity $\\Omega(g)$ is infinite once $g$ uses more than $K$ non-zero features. In practice they select the $K$ features with <b>K-LASSO</b> (Lasso regularization path), then fit least squares — yielding a <b>sparse</b> explanation.</p>
       <p>$$ I_j = \\sqrt{\\sum_{i=1}^{n} W_{ij}} \\qquad\\qquad c(V, W, I) = \\sum_{j=1}^{d'} \\mathbb{1}\\big[\\exists\\, i \\in V : W_{ij} \\gt 0\\big]\\, I_j $$</p>
       <p><b>SP-LIME global importance &amp; coverage, Eqn. 3 (&sect;4).</b> $W$ is the $n \\times d'$ explanation matrix ($W_{ij} = \\lvert w_{g_{ij}} \\rvert$, the local weight of feature $j$ in explanation $i$). $I_j$ scores each feature's global importance; $c(V,W,I)$ is the total importance of features covered by at least one instance in the chosen set $V$.</p>
       <p>$$ \\mathrm{Pick}(W, I) = \\underset{V,\\; \\lvert V \\rvert \\le B}{\\arg\\max}\\; c(V, W, I) $$</p>
       <p><b>SP-LIME submodular pick, Eqn. 4 (&sect;4).</b> Choose a budget of $B$ representative instances that maximize feature coverage. NP-hard; the greedy algorithm gives a $1 - 1/e$ approximation guarantee.</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> (left, &sect;3.2) is the whole method in one line. It says: the explanation $\\xi(x)$
       is the simple model $g$ that best trades off two things &mdash; <b>local fidelity</b>
       $\\mathcal{L}(f,g,\\pi_x)$ (does $g$ match the black box $f$ near $x$?) and <b>complexity</b>
       $\\Omega(g)$ (is $g$ still simple enough for a human to read?). Pick a $g$ that is faithful near $x$ but
       not so complicated that it stops being interpretable.</p>
       <p><b>Equation 2</b> (right, &sect;3.4) makes the fidelity loss concrete for the case we build. It is a
       <b>proximity-weighted square loss</b>: for each perturbed sample, take the squared gap between the black
       box's output $f(z)$ and the surrogate's output $g(z')$, multiply by the proximity weight $\\pi_x(z)$,
       and sum. (Here $z'$ is the interpretable representation of $z$; for our tabular case $z'$ and $z$ are the
       same vector.) Because faraway samples get tiny weights, they barely affect the fit. Minimizing this
       weighted square loss over a linear $g$ is exactly <b>weighted least squares</b> &mdash; a closed-form
       solve. The complexity term $\\Omega(g)$ for a linear model is the number of non-zero coefficients; the
       paper keeps it small (e.g. select $K$ features first), giving a <b>sparse</b> explanation.</p>
       <p>The <b>proximity kernel</b> $\\pi_x(z)=\\exp(-D(x,z)^2/\\sigma^2)$ is what defines "near": it converts a
       distance into a weight that is $1$ at $x$ and decays smoothly to $0$, so only nearby probes shape the fit.
       The <b>sparse linear surrogate</b> $g(z')=w_g\\cdot z'$ with $\\Omega(g)=\\infty\\cdot\\mathbb{1}[\\lVert
       w_g\\rVert_0 \\gt K]$ says: a linear model is allowed, but it may use at most $K$ features — beyond that the
       penalty is infinite, so the optimizer must keep $g$ short (K-LASSO does the selection).</p>
       <p><b>SP-LIME (Eqns. 3-4)</b> answers a different question — "show me the whole model in a few examples."
       It scores each feature globally by $I_j=\\sqrt{\\sum_i W_{ij}}$ (importance summed over all explanations),
       then picks a budget of $B$ instances maximizing coverage $c(V,W,I)$ — the total importance of features
       touched by at least one picked instance. Greedily adding the highest-marginal-gain instance gives a
       $1-1/e$-optimal, non-redundant set for a human to audit.</p>`,
    derivation:
      `<p>Why does minimizing Equation 2 over a linear $g$ reduce to a weighted least squares solve? Write the
       linear surrogate as $g(z) = c^\\top \\tilde z$, where $\\tilde z = [1, z_0, z_1, \\dots]$ stacks a $1$
       (for the intercept) on top of the features, and $c$ is the coefficient vector. Stack the $N$ samples into
       a design matrix $X$ (row $i$ is $\\tilde z_i$), the black-box outputs into a vector $y$ (with
       $y_i = f(z_i)$), and the proximity weights into a diagonal matrix $W$ with $W_{ii} = \\pi_x(z_i)$. Then
       Equation 2 is</p>
       <p>$$ \\mathcal{L}(c) = \\sum_i \\pi_x(z_i)\\,\\big(y_i - c^\\top \\tilde z_i\\big)^2
       = (y - Xc)^\\top W (y - Xc). $$</p>
       <p>This is a quadratic in $c$. Set its gradient to zero:</p>
       <p>$$ \\nabla_c \\mathcal{L} = -2\\,X^\\top W (y - Xc) = 0
       \\;\\;\\Longrightarrow\\;\\; (X^\\top W X)\\, c = X^\\top W y. $$</p>
       <p>These are the <b>weighted normal equations</b>. Solving them gives the surrogate coefficients
       $c = (X^\\top W X)^{-1} X^\\top W y$ in closed form &mdash; no iteration needed. The weights $W$ are what
       make the fit <i>local</i>: a sample with tiny $\\pi_x$ contributes almost nothing to either $X^\\top W X$
       or $X^\\top W y$, so the line is pinned by the points near $x$. (For sparsity, the paper first selects $K$
       features &mdash; e.g. with Lasso &mdash; then fits weighted least squares on those; that is the
       $\\Omega(g)$ term in action. Our demo uses few features, so all are kept.)</p>`,
    example:
      `<p>Fit a one-feature local linear surrogate by hand on a few weighted samples. Let the black box be the
       nonlinear function $f(z) = z^2$, and explain its prediction at the point $x = 2$ (where the true value is
       $f(2)=4$). We perturb with three samples $z = [1, 2, 3]$, so the black-box outputs are
       $f = [1, 4, 9]$. Use the proximity kernel with bandwidth $\\sigma = 1$ and $L_2$ distance, and fit a
       line $g(z) = c_0 + c_1 z$ by weighted least squares.</p>
       <ul class="steps">
        <li><b>Proximity weights.</b> $\\pi_x(z) = \\exp(-(x-z)^2/\\sigma^2)$ with $x=2$, $\\sigma=1$:
        $\\pi(1) = e^{-1} \\approx 0.3679$, $\\pi(2) = e^{0} = 1$, $\\pi(3) = e^{-1} \\approx 0.3679$. The middle
        sample (right on $x$) counts most.</li>
        <li><b>Set up weighted least squares.</b> Design matrix $X = \\big[\\,[1,1],[1,2],[1,3]\\,\\big]$ (a $1$
        for the intercept, then $z$). Weight matrix $W = \\mathrm{diag}(0.3679,\\,1,\\,0.3679)$. Outputs
        $y = [1,4,9]$. The weighted normal equations are $(X^\\top W X)\\,c = X^\\top W y$ with
        $X^\\top W X = \\big[[1.7358,\\,3.4715],[3.4715,\\,7.6788]\\big]$ and
        $X^\\top W y = [7.6788,\\,18.3006]$.</li>
        <li><b>Solve.</b> Solving the $2\\times2$ system gives $c = (c_0, c_1) = (-3.5761,\\; 4.0000)$. So the
        local surrogate is $g(z) = -3.576 + 4.000\\,z$.</li>
        <li><b>Check the slope is the local attribution.</b> The true slope of $z^2$ at $x=2$ is its derivative
        $2x = 4$. The fitted slope $c_1 = 4.000$ matches it exactly &mdash; the symmetric weights make the
        weighted fit recover the local derivative. The slope $4$ is the feature's local attribution: near
        $x=2$, increasing $z$ by $1$ raises $f$ by about $4$.</li>
        <li><b>Faithful near, not far.</b> At $x=2$, $g(2) = -3.576 + 8 = 4.424$, close to $f(2)=4$. But far
        away at $z=3$, $g(3) = 8.424$ while $f(3)=9$ &mdash; and the gap only grows as you leave the
        neighborhood. The line hugs the curve near $x$ and drifts off elsewhere, exactly as intended.</li>
       </ul>
       <p>These exact numbers ($\\pi = [0.3679,1,0.3679]$, $c = (-3.576, 4.000)$) are recomputed in the
       notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build a black box</b> with torch/sklearn-free numpy: a closed-form nonlinear classifier
        $f(z) = \\mathrm{sigmoid}(3 z_0 + 1.5\\,z_0 z_1 - 1.2\\,z_1^2)$ mapping a 2-D input to a probability.
        We never open it &mdash; only call it.</li>
        <li><b>Pick the point</b> to explain: $x = (0.5, 0.2)$.</li>
        <li><b>Sample</b> $N$ perturbed points $z$ around $x$ by adding Gaussian noise (standard deviation
        $\\sigma$).</li>
        <li><b>Label</b> every sample with the black box: $y_i = f(z_i)$.</li>
        <li><b>Weight</b> each sample by the proximity kernel $\\pi_x(z) = \\exp(-D(x,z)^2/\\sigma^2)$ with
        $L_2$ distance $D$.</li>
        <li><b>Fit</b> the linear surrogate $g(z) = c_0 + c_1 z_0 + c_2 z_1$ by weighted least squares
        (solve the weighted normal equations). The coefficients $(c_1, c_2)$ are the local attributions.</li>
        <li><b>Check faithfulness:</b> compare $g$ to $f$ on near samples vs far samples (root-mean-square
        error). <b>Ablate</b> by dropping the weights (set every $\\pi_x=1$) and watch the explanation change.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the authors "demonstrate the flexibility of these methods by explaining
       different models for text (e.g. random forests) and image classification (e.g. neural networks)" and
       "show the utility of explanations via novel experiments, both simulated and with human subjects, on
       various scenarios that require trust: deciding if one should trust a prediction, choosing between models,
       improving an untrustworthy classifier, and identifying why a classifier should not be trusted."</p>
       <p><i>These are the paper's own statements, quoted from the abstract. We deliberately do not restate the
       paper's human-study percentages here. The numbers in the CODEVIZ panel below are from our own tiny numpy
       run on a toy nonlinear classifier &mdash; not the paper's reported results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> LIME is an <i>explanation</i> method, so "working" is not a
       benchmark accuracy &mdash; it is <b>local fidelity</b>: does the surrogate $g$ agree with the black
       box $f$ near the explained point $x$? Compute the proximity-weighted RMSE
       $\\sqrt{\\sum_z \\pi_x(z)(f(z)-g(z))^2 / \\sum_z \\pi_x(z)}$ over the perturbed cloud (this is just
       Eqn. 2 turned into an error). The trivial baseline is a <b>constant surrogate</b> (predict the mean
       $f(z)$, slopes $=0$): a real local linear $g$ must beat it near $x$. For our toy run the near-$x$ RMSE
       is $\\approx 0.03$ vs $\\approx 0.28$ far away (our numbers, not the paper's).</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> Check the weighted normal equations on the worked
        example: $f(z)=z^2$ at $x=2$, samples $z=[1,2,3]$ &rarr; weights $\\pi=[0.3679,1,0.3679]$ and coeffs
        $c=(-3.576,4.000)$, with the fitted slope $4$ equal to the true derivative $2x=4$. Verify shapes
        ($X$ is $N\\times(d'{+}1)$, $W$ is $N\\times N$ diagonal) and that every weight lies in $(0,1]$ with
        $\\pi_x(x)=1$. Recover a known linear black box exactly: if $f$ <i>is</i> already linear, the
        surrogate coefficients should equal $f$'s coefficients regardless of $\\sigma$.</li>
        <li><b>Expected range.</b> Near $x$ the surrogate-vs-blackbox RMSE should be small (our run
        $\\approx 0.03$, a rule of thumb &mdash; not a paper claim) and the dominant LIME coefficient should
        track the black box's true local gradient: in our run $(c_1,c_2)\\approx(0.49,0.01)$ vs gradient
        $(0.46,0.04)$. A surrogate slope with the <i>wrong sign</i> from the local gradient, or near-$x$ RMSE
        as large as the far RMSE, is a bug, not tuning.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central component is the
        <b>proximity weighting</b> $\\pi_x$. Turn it off (set every $\\pi_x(z)=1$, i.e. $W=I$) and refit:
        near-$x$ fidelity must <b>get worse</b> (the line now averages over the whole cloud). If dropping the
        weights changes nothing, $\\pi_x$ is not wired into the normal equations. A second knob is the
        bandwidth $\\sigma$: sweep it and watch locality &mdash; too small starves the fit, too large makes it
        global.</li>
        <li><b>Failure signals &amp; what they mean.</b> Surrogate <i>equally bad near and far</i> &rarr;
        weights not applied (you fit global least squares). Singular / NaN coefficients from
        $(X^\\top W X)^{-1}$ &rarr; $\\sigma$ too small so almost all weights $\\approx 0$ (too few effective
        points), or duplicate/constant features. Coefficients that <b>swing wildly</b> across reruns &rarr;
        too few samples $N$ or noise scale mismatched to $\\sigma$. A surrogate that fits far points well
        &rarr; you have explained the average model, not the prediction at $x$ &mdash; LIME's whole promise is
        faithful <i>near</i>, drifting <i>far</i>, exactly the rising-RMSE curve in the CODEVIZ panel.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper, and the brief is explicit: <b>compose with torch/sklearn-free
       numpy</b>. So there is no library doing the work for us &mdash; we build the whole pipeline by hand.
       <b>Import:</b> only <code>numpy</code> (for arrays and a linear solve). <b>Build by hand:</b> the entire
       LIME procedure &mdash; (1) perturbation sampling around $x$, (2) labeling with the black box, (3) the
       <b>proximity kernel</b> $\\pi_x(z) = \\exp(-D(x,z)^2/\\sigma^2)$, and (4) the <b>weighted least squares</b>
       fit of the linear surrogate via the normal equations $(X^\\top W X)c = X^\\top W y$. The black box itself
       is a closed-form nonlinear function we call but never inspect &mdash; that is the model-agnostic part.
       The novel contribution you implement is the local weighted surrogate; nothing about it is imported.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the proximity weights.</b> If you fit the surrogate with every sample weighted
        equally, you get a <i>global</i> average fit, not a <i>local</i> explanation &mdash; the line tries to
        match the black box everywhere and ends up matching it nowhere near $x$. <b>Fix:</b> always weight by
        $\\pi_x(z)$ so nearby samples dominate.</li>
        <li><b>Picking the wrong bandwidth $\\sigma$.</b> Too small and almost every sample has weight $\\approx
        0$, so the fit is noisy or undefined (too few effective points). Too large and "local" becomes
        "global," and the linear surrogate cannot match the bendy black box. <b>Fix:</b> choose $\\sigma$ so a
        healthy band of samples has meaningful weight.</li>
        <li><b>Reading the surrogate far from $x$.</b> The coefficients describe behavior <i>near</i> $x$ only.
        Using $g$ to predict at a distant point, or claiming the attribution holds globally, misreads the
        method. <b>Fix:</b> treat the explanation as valid only in the local neighborhood.</li>
        <li><b>Sampling that misses the neighborhood.</b> If the perturbation noise is far larger or smaller
        than the scale of the black box's local change, the samples do not probe the right region. <b>Fix:</b>
        match the perturbation scale to the kernel bandwidth.</li>
        <li><b>Confusing the surrogate's accuracy with the black box's accuracy.</b> $g$ is a description of $f$,
        not a replacement for it. A faithful $g$ tells you <i>why</i> $f$ predicted what it did; it is not a
        better classifier.</li>
      </ul>`,
    recall: [
      "Write LIME's objective (Eqn. 1) and the weighted square loss (Eqn. 2) from memory.",
      "State the proximity kernel $\\pi_x(z)$ and say what happens to the weight as $z$ moves away from $x$.",
      "Define $f$, $g$, $\\pi_x$, and $\\Omega(g)$ in one sentence each.",
      "Why is a LIME explanation faithful near $x$ but not far away?"
    ],
    practice: [
      {
        q: `<b>The weighting ablation.</b> You have a working LIME with proximity weights $\\pi_x(z)$. Drop them:
            set every sample's weight to $1$ (an ordinary, unweighted least squares fit of the linear model to
            the black box outputs), everything else identical. What did you just remove, and what do you expect
            to happen to the explanation's local faithfulness?`,
        steps: [
          { do: `Locate the weight matrix $W = \\mathrm{diag}(\\pi_x(z_i))$ in the weighted normal equations $(X^\\top W X)c = X^\\top W y$. Replace $W$ with the identity (all ones).`, why: `With $W=I$ every sample counts equally, so the fit is no longer pinned to the neighborhood of $x$ &mdash; far samples drag the line just as much as near ones.` },
          { do: `Identify what is gone: the locality. The objective is no longer Equation 2 (proximity-weighted); it is a plain global least squares over the whole sample cloud.`, why: `The proximity kernel $\\pi_x$ is exactly the term that makes the surrogate <i>local</i>. Remove it and LIME stops being local.` },
          { do: `Refit and compare near-vs-far root-mean-square error: expect the near-x error to rise (worse local fit) while the far error may fall (the line now compromises across all regions).`, why: `An unweighted line minimizes average error everywhere, so it trades away accuracy at $x$ to fit the bulk of the cloud.` }
        ],
        answer: `<p>You removed the <b>proximity weighting</b> &mdash; the heart of LIME's locality. With every
                 weight $1$, the fit becomes a global least squares over the whole perturbed cloud, so far
                 samples pull the line away from $x$. In our run, dropping the weights raises the root-mean-square
                 error <i>near</i> $x$ (the explanation gets less faithful exactly where it should be most
                 faithful) and can lower it far away. The lesson: $\\pi_x$ is what makes the explanation a local
                 one; without it you are describing the average behavior, not the behavior at $x$.</p>`
      },
      {
        q: `Near our point, the black box's output depends almost entirely on feature&nbsp;0; feature&nbsp;1
            barely changes it there. Before fitting, predict the two surrogate coefficients $(c_1, c_2)$. After
            fitting we got $(c_1, c_2) \\approx (0.49, 0.01)$ while the true local gradient of the black box was
            $(0.46, 0.04)$. Do these agree, and what does that tell you about what LIME's coefficients mean?`,
        steps: [
          { do: `Reason from the setup: if moving feature&nbsp;0 changes $f$ a lot locally and feature&nbsp;1 hardly moves it, the local linear model should have a large slope on feature&nbsp;0 and a near-zero slope on feature&nbsp;1.`, why: `A linear surrogate's coefficient is the local sensitivity of the output to that feature; small local sensitivity gives a small coefficient.` },
          { do: `Compare the fitted coefficients to the black box's true local gradient (its partial derivatives): $(0.49, 0.01)$ vs $(0.46, 0.04)$. Both say feature&nbsp;0 dominates.`, why: `LIME's weighted fit recovers the local linear behavior, so its coefficients track the black box's local gradient direction.` },
          { do: `Conclude that LIME identifies the locally-important feature (feature&nbsp;0) and assigns the unimportant one (feature&nbsp;1) a near-zero attribution.`, why: `That is exactly the goal: a human-readable, sparse statement of which features drove <i>this</i> prediction.` }
        ],
        answer: `<p>They agree: the surrogate gives feature&nbsp;0 a large weight ($\\approx 0.49$) and
                 feature&nbsp;1 a near-zero weight ($\\approx 0.01$), matching the black box's true local
                 gradient $(0.46, 0.04)$. So LIME's coefficients are <b>local feature attributions</b> &mdash;
                 they recover which features the black box is actually sensitive to <i>at this point</i>. LIME
                 correctly singles out feature&nbsp;0 as the locally-important one and (correctly) says
                 feature&nbsp;1 did not matter here. The same model could rely on feature&nbsp;1 elsewhere; the
                 explanation is only a claim about the neighborhood of $x$.</p>`
      },
      {
        q: `In the worked example you fit $g(z)=c_0+c_1 z$ to $f(z)=z^2$ at $x=2$ with samples $z=[1,2,3]$,
            weights $\\pi=[0.3679,1,0.3679]$ ($\\sigma=1$), getting $c=(-3.576, 4.000)$. Suppose you widen the
            kernel to $\\sigma=3$. Recompute the weights, and say (qualitatively) what happens to the fitted
            slope and why.`,
        steps: [
          { do: `Recompute the proximity weights with $\\sigma=3$: $\\pi(1)=\\exp(-1/9)\\approx 0.8948$, $\\pi(2)=\\exp(0)=1$, $\\pi(3)=\\exp(-1/9)\\approx 0.8948$.`, why: `A larger bandwidth $\\sigma$ raises the weight on the far samples ($0.3679 \\to 0.8948$), so the near and far samples now count almost equally.` },
          { do: `Note the fit still passes data symmetric about $z=2$, so the weighted slope stays near the central slope of $z^2$ between $z=1$ and $z=3$, which is $\\tfrac{9-1}{3-1}=4$.`, why: `These three symmetric points give a slope of $4$ regardless of how the symmetric weights are set; the symmetry pins it.` },
          { do: `Reason about a NON-symmetric sample set or a finer curve: with a wide $\\sigma$ the far points dominate more, so the surrogate would describe a broader, less-local region &mdash; the slope would drift toward the average behavior over that wider band, away from the true local derivative.`, why: `Bandwidth controls how local the explanation is; widen it and you explain a bigger neighborhood, losing fidelity right at $x$.` }
        ],
        answer: `<p>With $\\sigma=3$ the weights become $\\pi \\approx [0.8948, 1, 0.8948]$ &mdash; the far samples
                 now count almost as much as the central one. For these three symmetric points the slope happens
                 to stay $4$ (symmetry pins it). But the <i>meaning</i> changed: a wider $\\sigma$ explains a
                 broader region, so in general the surrogate drifts from the true <i>local</i> derivative toward
                 the average behavior over a larger neighborhood. Bandwidth $\\sigma$ is the knob for "how local"
                 &mdash; small for a tight, faithful-at-$x$ explanation; large for a coarser, more global one.</p>`
      }
    ]
  });

  window.CODE["paper-lime"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>Track B, composed with <b>torch/sklearn-free numpy</b>: we build the entire LIME (Local Interpretable
       Model-agnostic Explanations) pipeline by hand. The black box is a closed-form nonlinear classifier we
       only <b>call</b> &mdash; never open. To explain one prediction we (1) sample perturbed points around it,
       (2) label them with the black box, (3) weight them by the exponential <b>proximity kernel</b>
       $\\pi_x(z)=\\exp(-D(x,z)^2/\\sigma^2)$, and (4) fit a linear surrogate by <b>weighted least squares</b>
       (Eqn. 1 / Eqn. 2). The surrogate's coefficients are the local feature attributions. The first cell
       recomputes the worked example ($f(z)=z^2$ at $x=2$: weights $[0.3679,1,0.3679]$, coeffs
       $(-3.576, 4.000)$, slope $=$ true derivative $4$). Then we explain a 2-D nonlinear classifier, recover
       the locally-important feature, and show the local fit matches the black box <b>near</b> the point but not
       <b>far</b>. Pure CPU, runs in well under a second. Paste into Colab (or any Python) and run.</p>`,
    code: `import numpy as np

# ============================================================
# 0. Worked example: fit a 1-feature local linear surrogate by hand
#    on a few weighted samples. Black box f(z)=z^2, explain at x=2.
# ============================================================
x0, sigma = 2.0, 1.0
z = np.array([1.0, 2.0, 3.0])
f = z**2                                       # black-box outputs: [1, 4, 9]
pi = np.exp(-((x0 - z)**2) / sigma**2)         # proximity weights
X = np.column_stack([np.ones_like(z), z])      # design matrix [1, z]
W = np.diag(pi)
# Weighted normal equations: (X^T W X) c = X^T W f
c = np.linalg.solve(X.T @ W @ X, X.T @ W @ f)
print("worked example: pi =", np.round(pi, 4))
print("  surrogate coeffs (c0 intercept, c1 slope) =", np.round(c, 4))
print("  c1 =", round(c[1], 4), " vs true df/dz at x=2 = 2*2 =", 2*x0)
# worked example: pi = [0.3679 1.     0.3679]
#   surrogate coeffs (c0 intercept, c1 slope) = [-3.5761  4.    ]
#   c1 = 4.0  vs true df/dz at x=2 = 2*2 = 4.0


# ============================================================
# 1. The BLACK BOX: a closed-form nonlinear classifier (numpy only).
#    We only CALL it -> model-agnostic. Maps R^2 -> probability [0,1].
# ============================================================
def black_box(Z):
    Z = np.atleast_2d(Z)
    s = 3.0*Z[:,0] + 1.5*Z[:,0]*Z[:,1] - 1.2*(Z[:,1]**2)
    return 1.0 / (1.0 + np.exp(-s))            # sigmoid

x = np.array([0.5, 0.2])                       # the ONE point we explain
print("\\nexplain prediction at x =", x, " f(x) =", round(float(black_box(x)[0]), 4))

# ============================================================
# 2-4. LIME: sample -> label -> weight by proximity -> weighted least squares.
# ============================================================
rng = np.random.default_rng(0)
N, sig = 500, 0.5
Zs = x + rng.normal(0, sig, size=(N, 2))       # 2. perturbed samples around x
y  = black_box(Zs)                             # 3. label with the black box
D  = np.linalg.norm(Zs - x, axis=1)            # L2 distance
pix = np.exp(-(D**2) / sig**2)                 # 4. proximity kernel pi_x(z)

Xd = np.column_stack([np.ones(N), Zs])         # [1, z0, z1]
A  = (Xd * pix[:, None]).T @ Xd                # X^T W X
b  = (Xd * pix[:, None]).T @ y                 # X^T W y
coef = np.linalg.solve(A, b)                   # weighted least squares
print("surrogate coeffs [intercept, w_feat0, w_feat1] =", np.round(coef, 4))
print("  local attribution: feature0 =", round(coef[1], 4),
      " feature1 =", round(coef[2], 4))

# ============================================================
# 5. FAITHFULNESS: local fit matches near x, not far. (RMSE)
# ============================================================
def surrogate(Z):  Z = np.atleast_2d(Z); return coef[0] + Z @ coef[1:]
def rmse(mask):    return float(np.sqrt(np.mean((black_box(Zs[mask]) - surrogate(Zs[mask]))**2)))
near, far = D < 0.4, D > 1.0
print("RMSE(surrogate vs black box)  NEAR x (D<0.4):", round(rmse(near), 4), " n=", int(near.sum()))
print("RMSE(surrogate vs black box)  FAR   (D>1.0):", round(rmse(far),  4), " n=", int(far.sum()))

# 6. Did LIME recover the locally-important feature? Compare to true gradient.
eps = 1e-3
g0 = (black_box(x+[eps,0])[0] - black_box(x-[eps,0])[0]) / (2*eps)
g1 = (black_box(x+[0,eps])[0] - black_box(x-[0,eps])[0]) / (2*eps)
print("true local gradient: d/dfeat0 =", round(float(g0),4), " d/dfeat1 =", round(float(g1),4))
print("LIME's dominant feature:", "feature0" if abs(coef[1])>abs(coef[2]) else "feature1")

# --- typical output (numpy default_rng(0), CPU) ---
# explain prediction at x = [0.5 0.2]  f(x) = 0.8323
# surrogate coeffs [intercept, w_feat0, w_feat1] = [0.5342 0.4866 0.0129]
#   local attribution: feature0 = 0.4866  feature1 = 0.0129
# RMSE ... NEAR x (D<0.4): 0.0321  n= 146
# RMSE ... FAR   (D>1.0): 0.2804  n= 62      <- ~9x worse far away
# true local gradient: d/dfeat0 = 0.4606  d/dfeat1 = 0.0377
# LIME's dominant feature: feature0
# (Our small run, not the paper's reported numbers.)`
  };

  window.CODEVIZ["paper-lime"] = {
    question: "How faithful is LIME's local linear surrogate to the black box as we move away from the explained point?",
    charts: [
      {
        type: "line",
        title: "Surrogate error vs distance from the explained point x — faithful near, not far",
        xlabel: "L2 distance from x (band center)",
        ylabel: "RMSE between linear surrogate and black box",
        series: [
          {
            name: "weighted LIME (proximity kernel)",
            color: "#7ee787",
            points: [[0.125,0.0428],[0.375,0.0275],[0.625,0.0844],[0.875,0.1683],[1.25,0.2567],[2.25,0.5123]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. We explain one prediction of a closed-form nonlinear classifier f(z)=sigmoid(3&middot;z0 + 1.5&middot;z0&middot;z1 &minus; 1.2&middot;z1²) at x=(0.5,0.2), using torch/sklearn-free numpy. LIME samples 500 perturbed points around x, weights each by the proximity kernel π_x(z)=exp(&minus;D(x,z)²/σ²), and fits a linear surrogate by weighted least squares. We then bin the samples by distance from x and plot the surrogate-vs-black-box RMSE in each band. Right at x the linear fit is excellent (RMSE ≈ 0.03–0.04); by distance 1+ it is ~6–12x worse (RMSE 0.26–0.51). The single flat surrogate hugs the bendy black box locally and drifts off globally — which is exactly LIME's promise: a faithful LOCAL explanation, not a global one.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# black box: closed-form nonlinear classifier, R^2 -> probability (numpy only)
def black_box(Z):
    Z = np.atleast_2d(Z)
    s = 3.0*Z[:,0] + 1.5*Z[:,0]*Z[:,1] - 1.2*(Z[:,1]**2)
    return 1.0/(1.0+np.exp(-s))

x, N, sig = np.array([0.5, 0.2]), 500, 0.5
Zs = x + rng.normal(0, sig, size=(N, 2))        # perturb around x
y  = black_box(Zs)                              # label with black box
D  = np.linalg.norm(Zs - x, axis=1)             # L2 distance
pix = np.exp(-(D**2)/sig**2)                     # proximity kernel pi_x

Xd = np.column_stack([np.ones(N), Zs])          # [1, z0, z1]
coef = np.linalg.solve((Xd*pix[:,None]).T @ Xd, (Xd*pix[:,None]).T @ y)   # weighted LS
print("surrogate coeffs [intercept, w0, w1]:", np.round(coef, 4))

def surrogate(Z):  Z = np.atleast_2d(Z); return coef[0] + Z @ coef[1:]

# RMSE of surrogate vs black box in distance bands -> faithfulness decays with distance
bands = [(0.0,0.25),(0.25,0.5),(0.5,0.75),(0.75,1.0),(1.0,1.5),(1.5,3.0)]
for lo,hi in bands:
    m = (D>=lo) & (D<hi)
    if m.sum() > 2:
        r = np.sqrt(np.mean((black_box(Zs[m]) - surrogate(Zs[m]))**2))
        print("band [%.2f,%.2f) center=%.3f  RMSE=%.4f  n=%d" % (lo,hi,(lo+hi)/2,r,int(m.sum())))
# surrogate coeffs [intercept, w0, w1]: [0.5342 0.4866 0.0129]
# band [0.00,0.25) center=0.125  RMSE=0.0428  n=54
# band [0.25,0.50) center=0.375  RMSE=0.0275  n=155
# band [0.50,0.75) center=0.625  RMSE=0.0844  n=146
# band [0.75,1.00) center=0.875  RMSE=0.1683  n=83
# band [1.00,1.50) center=1.250  RMSE=0.2567  n=58
# band [1.50,3.00) center=2.250  RMSE=0.5123  n=4
# Faithful near x, not far. Our small run, not the paper's number.`
  };
})();
