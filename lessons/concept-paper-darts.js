/* Paper lesson — "DARTS: Differentiable Architecture Search" (Liu, Simonyan, Yang, ICLR 2019).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-darts".
   GROUNDED from arXiv:1806.09055 (abstract) and the ar5iv HTML mirror (Section 2.2 Eqns 2-4,
   Section 2.3 approx gradient Eqns 6-8, Section 2.4 discretization).
   Track B (architecture): build the continuous-relaxation op-mixture and the bi-level (first-order)
   alpha/weights search by hand on top of torch tensors + autograd; reproduce that alpha up-weights
   the right operation on a tiny toy search, and the argmax-derived discrete op generalizes. */
(function () {
  window.LESSONS.push({
    id: "paper-darts",
    title: "DARTS — Differentiable Architecture Search (2019)",
    tagline: "Stop searching architectures by trial-and-error; make the choice of operation a continuous, gradient-trainable weight.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Hanxiao Liu, Karen Simonyan, Yiming Yang",
      org: "CMU / DeepMind",
      year: 2019,
      venue: "arXiv:1806.09055 (Jun 2018); ICLR 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1806.09055",
      code: "https://github.com/quark0/darts"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["pt-nn-module", "pt-autograd", "ml-softmax", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p><b>Neural architecture search</b> (NAS = automatically choosing the layout of a network, instead of
       hand-designing it) used to be brutally expensive. The standard recipe was: treat the architecture as a
       set of <b>discrete</b> choices (which operation goes on each connection &mdash; a $3\\times3$ convolution?
       a pooling layer? a skip wire? nothing?), then search that discrete space with reinforcement learning or
       evolution. Each candidate architecture had to be trained more or less from scratch just to score it.</p>
       <p>The paper opens by naming the cost. Earlier methods needed <b>thousands of GPU-days</b>: the abstract
       and table quote prior work at "2000 GPU days" (NASNet-A) and "3150 GPU days" (AmoebaNet). The reason is
       structural &mdash; a discrete, non-differentiable search space gives you <i>no gradient</i>. You cannot ask
       "which way should I nudge this choice to lower the loss?" You can only try a choice, train, measure, and
       try another. DARTS asks: what if the choice of operation were a continuous knob you could differentiate?</p>`,
    contribution:
      `<ul>
        <li><b>Continuous relaxation of the search space.</b> Replace the hard pick of one operation on an edge
        with a <b>softmax-weighted mixture</b> of <i>all</i> candidate operations. The mixture weights come from
        a set of real-valued <b>architecture parameters</b> $\\alpha$ &mdash; now the architecture is a vector you
        can take gradients of.</li>
        <li><b>Search by gradient descent (a bi-level objective).</b> Jointly learn the ordinary network
        <b>weights</b> $w$ and the architecture parameters $\\alpha$. Weights are trained on the training split;
        $\\alpha$ is trained on a held-out <b>validation</b> split. This nesting is the bi-level optimization.</li>
        <li><b>Orders-of-magnitude cheaper search.</b> Because one continuous model is trained once (not thousands
        of discrete children), the cost collapses. The paper reports CIFAR-10 search in <b>"4 GPU days"</b> versus
        the thousands above.</li>
      </ul>`,
    whyItMattered:
      `<p>DARTS turned architecture search from a server-farm project into something a single graduate student
       could run. The "relax to a softmax mixture, learn $\\alpha$ by gradient descent, then argmax to discretize"
       template became the backbone of an entire <b>differentiable NAS</b> literature (PC-DARTS, ProxylessNAS,
       and many follow-ups that fix its instabilities). The deeper idea &mdash; make a discrete design choice
       continuous so a gradient can optimize it &mdash; recurs far beyond NAS, in pruning, quantization, and
       mixture-of-experts routing.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.1 (Search Space)</b> &mdash; the cell is a directed graph; each <b>edge</b> $(i,j)$ carries
        one operation chosen from a fixed candidate set $\\mathcal{O}$ (convolutions, pooling, skip, zero).</li>
        <li><b>&sect;2.2 (Continuous Relaxation and Optimization)</b> &mdash; the heart. The mixed-operation
        softmax (Eqn. 2) and the bi-level objective (Eqns. 3-4). Transcribe these.</li>
        <li><b>&sect;2.3 (Approximation)</b> &mdash; the one-step approximate architecture gradient (Eqns. 6-8) and
        the first-order ($\\xi = 0$) versus second-order ($\\xi \\gt 0$) distinction.</li>
        <li><b>&sect;2.4 (Deriving Discrete Architectures)</b> &mdash; argmax over $\\alpha$, keep the top-$k$
        strongest operations.</li>
        <li><b>Figure 1</b> &mdash; the four-panel cartoon: unknown ops &rarr; mixture over all ops &rarr; learn
        $\\alpha$ &rarr; argmax to a discrete cell. This one picture is the whole method.</li>
       </ul>
       <p><b>Skim:</b> &sect;3 (the CIFAR/ImageNet/Penn-Treebank experiment tables) unless you want the headline
       numbers, and the appendices. The math you must own is two short equations in &sect;2.2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You give the search four candidate operations on an edge. Exactly <b>one</b> of them is useful for the
       task; the other three are useless. You start every architecture parameter $\\alpha$ <b>equal</b> (so the
       softmax mixture begins as a uniform blend), and you train $\\alpha$ by gradient descent on a validation
       split. After training, you take the <b>argmax</b> over $\\alpha$ to pick a single operation.</p>
       <p>Do you expect the argmax to land on the <b>useful</b> op, or could the search get stuck on a useless
       one? Write your guess and one sentence of reasoning, then run the toy search below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the search you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>A list of candidate operations <code>OPS = [op0, op1, op2, op3]</code> on the input.</li>
        <li>Architecture parameters <code>alpha = torch.zeros(4, requires_grad=True)</code> &mdash; one per op,
        all equal to start.</li>
        <li>TODO: the <b>mixed operation</b> &mdash; <code>weights = softmax(alpha)</code>, then
        <code>out = sum(weights[i] * OPS[i](x) for i in range(4))</code>. <i>This is Eqn. 2.</i></li>
        <li>TODO: the <b>bi-level step</b> &mdash; one optimizer steps <code>alpha</code> on the <b>validation</b>
        loss; a second optimizer steps the ordinary weights <code>w</code> on the <b>training</b> loss.</li>
        <li>TODO: <b>discretize</b> &mdash; <code>argmax(alpha)</code> to keep one op; retrain just that op.</li>
       </ul>
       <p>Predict which op the argmax selects, and whether the single derived op generalizes to fresh data.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Picture one <b>edge</b> in the network &mdash; a connection from node $i$ to node $j$. In a hand-designed
       net you would put exactly one operation on that edge: maybe a $3\\times3$ convolution, maybe a pooling
       layer, maybe a plain skip wire. The candidate set $\\mathcal{O}$ holds all the operations you are willing to
       consider. Choosing one is a <b>discrete</b> decision, and discrete decisions have no gradient.</p>
       <p><b>The relaxation (&sect;2.2, Eqn. 2).</b> Instead of picking one, run the input $x$ through <i>every</i>
       candidate op and blend the results. The blend weights are a <b>softmax</b> over a vector of real numbers
       $\\alpha^{(i,j)}$ &mdash; one number per candidate op on that edge. Softmax (turn arbitrary real numbers into
       positive weights that sum to one) makes the blend a proper weighted average. The result is the
       <b>mixed operation</b> $\\bar{o}^{(i,j)}(x)$. Now the architecture is fully described by the continuous
       vector $\\alpha$, and the whole network is differentiable in both the ordinary weights $w$ and in $\\alpha$.</p>
       <p><b>The bi-level objective (&sect;2.2, Eqns. 3-4).</b> We want an $\\alpha$ that produces a network which,
       <i>once its weights are trained</i>, does well on data it did not train on. So there are two losses on two
       splits. The ordinary weights $w$ minimize the <b>training</b> loss $\\mathcal{L}_{\\text{train}}$. The
       architecture $\\alpha$ minimizes the <b>validation</b> loss $\\mathcal{L}_{\\text{val}}$ &mdash; but evaluated
       at the <i>best</i> weights for that $\\alpha$. "Best weights for this $\\alpha$" is itself an inner
       optimization, which is why it is called <b>bi-level</b> (an outer problem in $\\alpha$ whose objective
       hides an inner problem in $w$). Validating $\\alpha$ on held-out data is what stops the search from simply
       picking whatever fits the training set; it must <i>generalize</i>.</p>
       <p><b>The approximation (&sect;2.3).</b> Solving the inner problem to completion for every $\\alpha$ step
       would be hopeless. DARTS approximates the optimal inner weights $w^{*}(\\alpha)$ with a <b>single</b>
       gradient step of $w$ (Eqn. 6), using a step size $\\xi$. Setting $\\xi = 0$ drops the inner step entirely:
       you just take the $\\alpha$-gradient of the validation loss at the current weights. That is <b>first-order
       DARTS</b> &mdash; cheaper, and what we implement here. Keeping $\\xi \\gt 0$ keeps a second-order term (a
       Hessian-vector product, computed by finite differences in Eqn. 8) and is <b>second-order DARTS</b> &mdash;
       slower but usually a bit better.</p>
       <p><b>Discretize at the end (&sect;2.4).</b> Training leaves you with a soft mixture. To get a real, deployable
       network you replace each edge's mixture with its single strongest operation: take the <b>argmax</b> over
       $\\alpha^{(i,j)}$ (retaining the top-$k$ strongest operations per node). Then you retrain that discrete
       child network from scratch.</p>`,
    symbols: [
      { sym: "$\\mathcal{O}$", desc: "the <b>candidate operation set</b>: the fixed menu of operations (e.g. $3\\times3$ convolution, max-pool, skip-connect, zero) the search may place on an edge." },
      { sym: "$o(\\cdot)$", desc: "a single <b>candidate operation</b> from $\\mathcal{O}$ &mdash; a function applied to the input feature on an edge." },
      { sym: "$(i,j)$", desc: "an <b>edge</b> from node $i$ to node $j$ in the cell's computation graph; the search decides which operation lives on it." },
      { sym: "$x$", desc: "the <b>input</b> feature fed into the edge's operation." },
      { sym: "$\\alpha^{(i,j)}_{o}$", desc: "an <b>architecture parameter</b>: one real number per candidate op $o$ on edge $(i,j)$. Higher means that op gets more weight in the mixture. The whole collection $\\alpha$ <i>is</i> the (continuous) architecture." },
      { sym: "$\\bar{o}^{(i,j)}(x)$", desc: "the <b>mixed operation</b> on edge $(i,j)$: the softmax-weighted blend of every candidate op applied to $x$ (Eqn. 2)." },
      { sym: "$\\mathrm{softmax}$", desc: "turns a vector of real numbers into positive weights that sum to one: $\\mathrm{softmax}(\\alpha)_o = \\exp(\\alpha_o) / \\sum_{o'} \\exp(\\alpha_{o'})$." },
      { sym: "$w$", desc: "the ordinary network <b>weights</b> (the convolution filters, linear weights, etc.) inside the operations. Trained on the training split." },
      { sym: "$\\mathcal{L}_{\\text{train}}$", desc: "the loss on the <b>training</b> split; the inner objective that $w$ minimizes." },
      { sym: "$\\mathcal{L}_{\\text{val}}$", desc: "the loss on the held-out <b>validation</b> split; the outer objective that $\\alpha$ minimizes." },
      { sym: "$w^{*}(\\alpha)$", desc: "the <b>best weights for a given architecture</b>: the $w$ that minimizes $\\mathcal{L}_{\\text{train}}$ when the architecture is fixed at $\\alpha$. Found exactly only at convergence; approximated by one step." },
      { sym: "$\\xi$", desc: "the inner <b>step size</b> in the one-step approximation. $\\xi = 0$ gives first-order DARTS (no inner step); $\\xi \\gt 0$ gives second-order DARTS (keeps a Hessian term)." },
      { sym: "argmax", desc: "a plain term: pick the index of the largest entry. Used on $\\alpha$ at the end to turn the soft mixture into one discrete operation per edge." }
    ],
    formula: `$$ \\bar{o}^{(i,j)}(x) \\;=\\; \\sum_{o \\in \\mathcal{O}} \\frac{\\exp\\!\\big(\\alpha^{(i,j)}_{o}\\big)}{\\sum_{o' \\in \\mathcal{O}} \\exp\\!\\big(\\alpha^{(i,j)}_{o'}\\big)} \\; o(x) \\qquad\\text{(Eqn. 2, §2.2)} $$
$$ \\min_{\\alpha}\\; \\mathcal{L}_{\\text{val}}\\big(w^{*}(\\alpha),\\, \\alpha\\big) \\quad\\text{s.t.}\\quad w^{*}(\\alpha) = \\arg\\min_{w}\\; \\mathcal{L}_{\\text{train}}(w, \\alpha) \\qquad\\text{(Eqns. 3-4, §2.2)} $$`,
    whatItDoes:
      `<p><b>Equation 2</b> is the continuous relaxation. It says: the operation on an edge is no longer "pick one";
       it is the <b>softmax-weighted average of every candidate op</b>. Run $x$ through each op $o$, weight the
       output by $\\mathrm{softmax}(\\alpha)_o$, and sum. Because softmax weights are smooth functions of $\\alpha$,
       the whole expression is differentiable in $\\alpha$ &mdash; you can ask the gradient which operation to
       up-weight. When one $\\alpha$ grows large, its softmax weight approaches $1$ and the mixture approaches a
       single hard op.</p>
       <p><b>Equations 3-4</b> are the bi-level search objective. Read the constraint first: $w^{*}(\\alpha)$ is the
       weight setting that minimizes the <i>training</i> loss for a fixed architecture $\\alpha$. Now read the
       outer line: choose $\\alpha$ to minimize the <i>validation</i> loss at <i>those</i> trained weights. The
       split is the whole point &mdash; $\\alpha$ is judged on data $w$ never saw, so the search rewards
       architectures that generalize, not ones that merely memorize the training set.</p>`,
    derivation:
      `<p><b>Why a softmax mixture, and why two splits.</b> (No separate concept lesson owns this, so here is the
       full reasoning.)</p>
       <p><b>The mixture makes a discrete choice differentiable.</b> A hard "use op $k$" is a step function of the
       index $k$ &mdash; flat everywhere, with no slope to follow. Write the choice as a one-hot vector $p$ over the
       ops and the edge output as $\\sum_o p_o\\, o(x)$; a one-hot $p$ has no usable gradient. DARTS replaces the
       one-hot $p$ with $p = \\mathrm{softmax}(\\alpha)$. Now $p$ is a smooth function of the real vector $\\alpha$,
       and</p>
       <p>$$ \\frac{\\partial\\, \\mathrm{softmax}(\\alpha)_o}{\\partial \\alpha_{o}} = p_o\\,(1 - p_o) \\;\\gt\\; 0, $$</p>
       <p>so increasing $\\alpha_o$ strictly increases op $o$'s share of the mixture. A useful op lowers the loss
       when it is weighted up, so the loss-gradient pushes its $\\alpha$ up; useless ops get pushed down. The
       softmax is the bridge from "pick one" (no gradient) to "blend, then sharpen" (full gradient).</p>
       <p><b>Why validate $\\alpha$ on a held-out split.</b> Suppose you trained $\\alpha$ <i>and</i> $w$ on the same
       data. Then a high-capacity op could be up-weighted simply because it overfits the training set, even if it
       generalizes poorly. By scoring $\\alpha$ on a <b>validation</b> split that $w$ never trained on, an op only
       earns weight if it helps on unseen data. That is exactly the bi-level structure of Eqns. 3-4: $w$ fits the
       training split, $\\alpha$ is selected on the validation split. It is the same logic as a train/validation
       split in ordinary hyper-parameter tuning &mdash; here the "hyper-parameter" is the architecture itself.</p>
       <p><b>Why the one-step approximation.</b> Solving $w^{*}(\\alpha)$ exactly means training to convergence for
       every $\\alpha$ &mdash; the cost DARTS exists to avoid. So it approximates $w^{*}(\\alpha)$ by one gradient
       step from the current $w$ (&sect;2.3, Eqn. 6). The chain rule through that one step produces a second-order
       (Hessian) term; dropping it ($\\xi = 0$) gives the cheap <b>first-order</b> variant we implement, which
       simply takes $\\nabla_\\alpha \\mathcal{L}_{\\text{val}}$ at the current weights.</p>`,
    example:
      `<p>Work the mixture weights by hand for one edge with four candidate ops. Suppose after some training the
       architecture parameters on this edge are $\\alpha = [2.0,\\, 0.5,\\, 0.5,\\, 0.5]$ &mdash; the first op (the
       useful one) has pulled ahead. Eqn. 2 weights each op by $\\mathrm{softmax}(\\alpha)$.</p>
       <ul class="steps">
        <li><b>Exponentiate each entry:</b> $e^{2.0} \\approx 7.389$, and $e^{0.5} \\approx 1.6487$ (three times).</li>
        <li><b>Sum them:</b> $7.389 + 1.6487 + 1.6487 + 1.6487 \\approx 12.335$.</li>
        <li><b>Divide to get the mixture weights:</b>
        $7.389 / 12.335 \\approx \\mathbf{0.599}$ for the useful op, and
        $1.6487 / 12.335 \\approx \\mathbf{0.1337}$ for each of the three useless ops. (Check: $0.599 + 3\\times0.1337
        \\approx 1.000$.)</li>
        <li><b>Read it:</b> the mixed operation is $\\bar{o}(x) = 0.599\\,o_0(x) + 0.1337\\,o_1(x) + 0.1337\\,o_2(x)
        + 0.1337\\,o_3(x)$. The useful op already owns about <b>60%</b> of the blend. Argmax over $\\alpha$ would
        pick op 0. As training drives $\\alpha_0$ higher, its weight heads toward $1$ and the mixture becomes that
        single op.</li>
       </ul>
       <p>These exact weights $[0.599,\\,0.1337,\\,0.1337,\\,0.1337]$ are recomputed in the notebook's first cell so
       you can check them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Define the candidate ops</b> $\\mathcal{O}$ on an edge: a small list of functions of the input. In
        our toy: one op that uses the useful feature, two that use useless features, and a "zero" op.</li>
        <li><b>Create the architecture parameters</b> $\\alpha$ &mdash; one per op, all initialized equal (so the
        mixture starts uniform).</li>
        <li><b>Build the mixed operation</b> (Eqn. 2): <code>weights = softmax(alpha)</code>, then
        <code>out = sum(weights[i] * op_i(x))</code>.</li>
        <li><b>Bi-level search loop (first-order, $\\xi = 0$):</b> each step, take a gradient step on $\\alpha$ using
        the <b>validation</b> loss, then a gradient step on the ordinary weights $w$ using the <b>training</b>
        loss.</li>
        <li><b>Discretize</b> (&sect;2.4): <code>argmax(alpha)</code> to keep the single strongest op; retrain just
        that op's weights from scratch (the "derived child network").</li>
        <li><b>Ablate:</b> retrain a <i>useless</i> op the same way and compare validation loss &mdash; the derived
        (useful) op should generalize and the useless one should not.</li>
      </ol>`,
    results:
      `<p>From the abstract and tables (quoted): DARTS searches a convolutional cell on CIFAR-10 in
       <b>"4 GPU days"</b>, versus prior NAS at <b>"2000 GPU days"</b> (NASNet-A) and <b>"3150 GPU days"</b>
       (AmoebaNet) &mdash; "orders of magnitude faster than state-of-the-art non-differentiable techniques." The
       reported CIFAR-10 result is <b>"2.76 &plusmn; 0.09% test error"</b>, and for language modeling on Penn
       Treebank a test perplexity of <b>"55.7"</b>.</p>
       <p><i>These are the paper's reported figures, quoted from its abstract and tables. The numbers in the CODE
       and CODEVIZ panels below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives (linear maps, softmax, autograd, SGD/Adam)
       already ship in PyTorch, so we <b>import</b> them and build only the novel algorithm. <b>Import:</b>
       <code>torch.softmax</code>, <code>torch.optim</code>, autograd. <b>Build by hand:</b> the continuous
       relaxation (the softmax op-mixture, Eqn. 2), the <b>bi-level first-order search</b> (step $\\alpha$ on the
       validation loss, step $w$ on the training loss), the <b>argmax discretization</b> (&sect;2.4), and the
       <b>ablation</b> that retrains a useless op. We use <b>first-order</b> DARTS ($\\xi = 0$ &mdash; the
       $\\alpha$-gradient on validation without unrolling the inner step); the paper's second-order variant adds a
       Hessian term (Eqn. 8) for a usually-small accuracy gain and we note it but do not implement it.</p>`,
    pitfalls:
      `<ul>
        <li><b>Training $\\alpha$ and $w$ on the same split.</b> If $\\alpha$ sees the training data, the search can
        up-weight an op just because it overfits. <b>Fix:</b> step $\\alpha$ on a held-out <b>validation</b> split,
        $w$ on the training split &mdash; the bi-level structure of Eqns. 3-4.</li>
        <li><b>Forgetting the softmax (or normalizing the wrong axis).</b> The mixture weights must be a softmax
        over the <i>operations</i> on an edge, summing to one. Using raw $\\alpha$ or softmaxing the wrong axis
        breaks the relaxation. <b>Fix:</b> <code>torch.softmax(alpha, dim=0)</code> over the op dimension.</li>
        <li><b>Reading first-order as second-order.</b> First-order ($\\xi = 0$) takes the $\\alpha$-gradient at the
        current weights and skips the inner step. The paper's second-order variant keeps a Hessian-vector term
        (Eqn. 8). They are different algorithms; do not claim the cheap one is the paper's headline method.</li>
        <li><b>Skipping the discretize-and-retrain step.</b> The soft mixture is not the final network. You must
        <b>argmax</b> to one op per edge (&sect;2.4) and retrain that discrete child from scratch; the mixture's loss
        is not the deployed model's loss. (In our run the full mixture's validation MSE was lower than the
        argmax-op's <i>before</i> retraining &mdash; precisely why DARTS retrains the derived child.)</li>
        <li><b>Expecting the argmax to always be right.</b> DARTS is known to sometimes collapse onto trivial ops
        (e.g. too many skip-connects). On real search spaces this instability is real; our toy is clean by design.</li>
      </ul>`,
    recall: [
      "Write the mixed-operation equation (Eqn. 2) from memory.",
      "What are $\\alpha$ and $w$, and which data split is each trained on?",
      "Why is the objective called bi-level?",
      "What is the difference between first-order ($\\xi = 0$) and second-order DARTS?",
      "How is the final discrete architecture derived from $\\alpha$?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Your toy search has selected a single op by argmax over $\\alpha$. To prove the
            search found the <i>right</i> op, you retrain the derived (argmax) op from scratch and, separately,
            retrain a <b>useless</b> op the same way. What do you expect each one's validation loss to be, and
            what does the contrast demonstrate?`,
        steps: [
          { do: `Take the argmax op, reset its weight, retrain it on the training split, and measure validation loss.`, why: `This mirrors DARTS §2.4: derive the discrete child from $\\alpha$, then retrain it from scratch.` },
          { do: `Pick one of the useless ops, retrain it identically, and measure its validation loss.`, why: `An honest ablation changes exactly one thing &mdash; which op is kept &mdash; so any gap is attributable to the architecture choice.` },
          { do: `Compare: the derived op should reach near-zero validation loss; the useless op should stay high.`, why: `If the search up-weighted the right op, only that op can fit unseen data &mdash; the others have no signal about the target.` }
        ],
        answer: `<p>The <b>derived (argmax) op</b> retrains to essentially perfect validation loss (in our run, MSE
                 $\\approx 0.0000$ with its weight recovering $\\approx 1.0$), while the <b>useless op</b> stays high
                 (in our run, MSE $\\approx 1.10$ &mdash; no better than predicting near-zero). Since the two are
                 retrained identically and differ only in <i>which op</i> was kept, this isolates the architecture
                 choice: DARTS up-weighted the operation that actually carries the signal, and the discrete child
                 derived from $\\alpha$ generalizes. The CODEVIZ panel shows $\\alpha$ concentrating on that op
                 during the search.</p>`
      },
      {
        q: `On one edge the architecture parameters are $\\alpha = [1.0, 1.0, 3.0]$ over three ops. Using Eqn. 2,
            what mixture weight does each op get, and which op would the final discretization keep?`,
        steps: [
          { do: `Exponentiate: $e^{1.0} \\approx 2.718$, $e^{1.0} \\approx 2.718$, $e^{3.0} \\approx 20.086$.`, why: `Softmax first exponentiates each architecture parameter.` },
          { do: `Sum: $2.718 + 2.718 + 20.086 \\approx 25.522$.`, why: `The denominator of the softmax is the sum of the exponentials.` },
          { do: `Divide: $2.718/25.522 \\approx 0.107$, $0.107$, and $20.086/25.522 \\approx 0.787$.`, why: `Each mixture weight is its exponential over the sum; the weights total $\\approx 1$.` }
        ],
        answer: `<p>The mixture weights are about $[0.107,\\,0.107,\\,0.787]$. The third op dominates the blend
                 ($\\approx 79\\%$), and since it has the largest $\\alpha$, <b>argmax keeps op 3</b> at
                 discretization (§2.4). The other two would be dropped.</p>`
      },
      {
        q: `Why does DARTS train the architecture parameters $\\alpha$ on a held-out validation split instead of
            on the training split, and what could go wrong if you trained both $\\alpha$ and the weights $w$ on
            the same training data?`,
        steps: [
          { do: `Recall the bi-level objective (Eqns. 3-4): $w$ minimizes $\\mathcal{L}_{\\text{train}}$, $\\alpha$ minimizes $\\mathcal{L}_{\\text{val}}$.`, why: `The two roles are deliberately scored on different data: $\\alpha$ is judged on data $w$ never trained on.` },
          { do: `Imagine collapsing both onto the training set: $\\alpha$ would be rewarded for any op that lowers training loss, including by overfitting.`, why: `Without held-out scoring, capacity that memorizes is indistinguishable from capacity that generalizes.` },
          { do: `Conclude that the validation split is what makes the search prefer generalizing architectures.`, why: `An op only earns weight if it helps on unseen data &mdash; the same logic as a validation set in hyper-parameter tuning, with the architecture as the hyper-parameter.` }
        ],
        answer: `<p>$\\alpha$ is the architecture &mdash; effectively a hyper-parameter &mdash; so it must be chosen on
                 data the weights did not fit, or the search would reward operations that merely overfit the
                 training set. Training both $\\alpha$ and $w$ on the same data removes that safeguard: a
                 high-capacity op could be up-weighted for memorizing rather than generalizing. The held-out
                 validation split (the bi-level objective, Eqns. 3-4) is exactly what makes DARTS prefer
                 architectures that work on unseen data.</p>`
      }
    ]
  });

  window.CODE["paper-darts"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the continuous relaxation and the bi-level first-order search by hand on top of
       <code>torch.softmax</code> and autograd, on a tiny toy task. The task: predict $y = x_0$ (the target depends
       only on feature 0). Four candidate operations sit on one edge &mdash; <b>op0</b> uses the useful feature 0,
       <b>op1</b>/<b>op2</b> use useless features, <b>op3</b> is the zero op. The architecture parameters $\\alpha$
       start equal. Each step we step $\\alpha$ on the <b>validation</b> loss (first-order, $\\xi = 0$) and step the
       ordinary weights $w$ on the <b>training</b> loss &mdash; the bi-level objective (Eqns. 3-4). The mixed
       operation is <code>sum(softmax(alpha)[i] * OPS[i](x))</code> &mdash; Eqn. 2. We then <b>argmax</b> over
       $\\alpha$ (&sect;2.4) to keep one op and retrain it; we also retrain a useless op as the ablation. The first
       cell recomputes the worked example $\\mathrm{softmax}([2.0,0.5,0.5,0.5]) \\to [0.599, 0.1337, 0.1337,
       0.1337]$. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example: softmax over 4 architecture params. ---
alpha_we = torch.tensor([2.0, 0.5, 0.5, 0.5])
print("worked example  softmax([2.0,0.5,0.5,0.5]) =",
      [round(v, 4) for v in torch.softmax(alpha_we, dim=0).tolist()])
# worked example  softmax([2.0,0.5,0.5,0.5]) = [0.599, 0.1337, 0.1337, 0.1337]


# --- 1. Toy task: target y = feature 0 only. Train/val split. ---
N, ntr = 400, 300
g = torch.Generator().manual_seed(1)
X = torch.randn(N, 4, generator=g)
y = X[:, 0:1].clone()                      # depends ONLY on feature 0
Xtr, ytr, Xva, yva = X[:ntr], y[:ntr], X[ntr:], y[ntr:]

# --- 2. Four candidate operations on the edge. op_i has a learnable scalar weight w[i]. ---
#     op0 = useful (uses feature 0); op1, op2 = useless features; op3 = zero op.
NAMES = ["pick-feat0 (USEFUL)", "pick-feat1", "pick-feat2", "zero"]
def op(idx, x, wi):
    if idx == 3:
        return torch.zeros(x.shape[0], 1)
    return wi * x[:, idx:idx+1]

# --- 3. Architecture params alpha (one per op, all equal) and ordinary weights w. ---
alpha = torch.zeros(4, requires_grad=True)         # the continuous architecture
w     = torch.ones(4,  requires_grad=True)         # the ordinary weights
opt_a = torch.optim.Adam([alpha], lr=0.05)         # alpha optimizer (validation)
opt_w = torch.optim.SGD([w], lr=0.1)               # weight optimizer (training)
lossfn = nn.MSELoss()

def mixed(Xb):                                     # Eqn. 2: softmax-weighted mixture of all ops
    wts = torch.softmax(alpha, dim=0)
    return sum(wts[i] * op(i, Xb, w[i]) for i in range(4))

# --- 4. Bi-level first-order search (xi = 0): step alpha on VAL, then w on TRAIN. ---
for ep in range(60):
    opt_a.zero_grad(); lossfn(mixed(Xva), yva).backward(); opt_a.step()   # alpha <- L_val
    opt_w.zero_grad(); lossfn(mixed(Xtr), ytr).backward(); opt_w.step()   # w     <- L_train

probs = torch.softmax(alpha, dim=0).detach()
print("\\nFinal mixture weights (softmax of alpha):")
for i in range(4):
    print(f"  {NAMES[i]:22s} alpha={alpha[i].item():+.3f}  softmax={probs[i].item():.4f}")
argmax = int(torch.argmax(alpha).item())
print("ARGMAX op (discrete choice) -> op%d: %s" % (argmax, NAMES[argmax]))
# Our small run: alpha concentrates on op0; softmax ~0.757 on the USEFUL op; argmax = op0.

# --- 5. Discretize (§2.4): keep the argmax op, RETRAIN it from scratch (the derived child). ---
wf = torch.ones(1, requires_grad=True); o = torch.optim.SGD([wf], lr=0.1)
for ep in range(60):
    o.zero_grad(); lossfn(wf * Xtr[:, argmax:argmax+1], ytr).backward(); o.step()
print("derived (argmax) op retrained: w=%.4f  val MSE=%.4f"
      % (wf.item(), lossfn(wf.detach() * Xva[:, argmax:argmax+1], yva).item()))
# derived (argmax) op retrained: w=1.0000  val MSE=0.0000   <- generalizes perfectly

# --- 6. ABLATION: retrain a USELESS op the same way -> should NOT generalize. ---
wb = torch.ones(1, requires_grad=True); ob = torch.optim.SGD([wb], lr=0.1)
for ep in range(60):
    ob.zero_grad(); lossfn(wb * Xtr[:, 1:2], ytr).backward(); ob.step()
print("wrong op retrained:            w=%.4f  val MSE=%.4f"
      % (wb.item(), lossfn(wb.detach() * Xva[:, 1:2], yva).item()))
# wrong op retrained:            w=-0.0440  val MSE=1.1024   <- no signal, cannot fit
# (Numbers are our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-darts"] = {
    question: "During a first-order DARTS search, does the softmax weight on the USEFUL operation rise above the useless ones, so argmax picks it?",
    charts: [
      {
        type: "line",
        title: "Mixture weight (softmax of α) per operation, over the bi-level search",
        xlabel: "search epoch",
        ylabel: "softmax weight on the op",
        series: [
          {
            name: "op0 pick-feat0 (USEFUL)",
            color: "#7ee787",
            points: [[0,0.2692],[5,0.378],[10,0.4996],[15,0.6098],[20,0.6846],[25,0.7243],[30,0.7423],[35,0.7493],[40,0.7517],[45,0.7527],[50,0.7538],[55,0.7553]]
          },
          {
            name: "op1 pick-feat1 (useless)",
            color: "#ff7b72",
            points: [[0,0.2436],[5,0.2072],[10,0.167],[15,0.1304],[20,0.1049],[25,0.0903],[30,0.0826],[35,0.0784],[40,0.0758],[45,0.0737],[50,0.0718],[55,0.0699]]
          },
          {
            name: "op2 pick-feat2 (useless)",
            color: "#d2a8ff",
            points: [[0,0.2436],[5,0.2074],[10,0.1678],[15,0.1322],[20,0.1073],[25,0.0932],[30,0.0858],[35,0.0819],[40,0.0795],[45,0.0776],[50,0.0759],[55,0.0742]]
          },
          {
            name: "op3 zero (useless)",
            color: "#79c0ff",
            points: [[0,0.2436],[5,0.2074],[10,0.1656],[15,0.1276],[20,0.1032],[25,0.0923],[30,0.0894],[35,0.0905],[40,0.0931],[45,0.096],[50,0.0985],[55,0.1005]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Four candidate ops on one edge; the target depends only on feature 0, so op0 is the single useful op. All four architecture parameters α start equal (uniform mixture ≈ 0.25 each). First-order DARTS (ξ = 0) steps α on the validation loss and the ordinary weights on the training loss. The softmax weight on the USEFUL op (green) climbs from ≈ 0.27 to ≈ 0.76 while the three useless ops fall &mdash; so argmax over α picks op0, and the derived single op retrains to val MSE ≈ 0.0000 (a useless op retrains to ≈ 1.10). Same data, same loop; the only thing the search changes is which op α favors.",
    code: `import torch, torch.nn as nn

# Reproduce the qualitative DARTS effect on toy data: alpha concentrates on the right op.
N, ntr = 400, 300
g = torch.Generator().manual_seed(1)
X = torch.randn(N, 4, generator=g)
y = X[:, 0:1].clone()                       # target uses ONLY feature 0
Xtr, ytr, Xva, yva = X[:ntr], y[:ntr], X[ntr:], y[ntr:]

def op(idx, x, wi):                          # candidate ops; op3 is the zero op
    return torch.zeros(x.shape[0], 1) if idx == 3 else wi * x[:, idx:idx+1]

torch.manual_seed(0)
alpha = torch.zeros(4, requires_grad=True)   # architecture params, all equal
w     = torch.ones(4,  requires_grad=True)
oa = torch.optim.Adam([alpha], lr=0.05); ow = torch.optim.SGD([w], lr=0.1)
lf = nn.MSELoss()
def mixed(Xb):                               # Eqn. 2
    p = torch.softmax(alpha, dim=0)
    return sum(p[i] * op(i, Xb, w[i]) for i in range(4))

traj = []
for ep in range(60):
    oa.zero_grad(); lf(mixed(Xva), yva).backward(); oa.step()   # alpha on VAL (xi=0)
    ow.zero_grad(); lf(mixed(Xtr), ytr).backward(); ow.step()   # w on TRAIN
    p = torch.softmax(alpha, dim=0).detach()
    traj.append([ep] + [round(v, 4) for v in p.tolist()])

for row in traj[::5]:
    print(row)            # [epoch, p_op0_USEFUL, p_op1, p_op2, p_op3]
print("argmax op:", int(torch.argmax(alpha).item()))
# op0 (useful) rises ~0.27 -> ~0.76; useless ops fall; argmax = op0.`
  };
})();
