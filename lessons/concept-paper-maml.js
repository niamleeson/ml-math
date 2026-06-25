/* Paper lesson — "Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks"
   (MAML), Finn, Abbeel, Levine, ICML 2017. Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-maml".
   GROUNDED from arXiv:1703.03400 (abstract) and the ar5iv HTML mirror
   (Section 2.2 inner update + meta-update Eqn. 1; Section 3.1 regression MSE loss;
   Section 5.1 sinusoid setup; Section 5.2 first-order approximation).
   Track B (architecture): compose a tiny multi-layer perceptron with torch.nn, then
   implement the NOVEL part by hand — the bi-level meta-update with a second-order
   meta-gradient that flows THROUGH the inner step (create_graph=True). */
(function () {
  window.LESSONS.push({
    id: "paper-maml",
    title: "MAML — Model-Agnostic Meta-Learning for Fast Adaptation of Deep Networks (2017)",
    tagline: "Learn an initialization that a single gradient step can fine-tune to any new task.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Chelsea Finn, Pieter Abbeel, Sergey Levine",
      org: "University of California, Berkeley",
      year: 2017,
      venue: "arXiv:1703.03400 (Mar 2017); ICML 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1703.03400",
      code: "https://github.com/cbfinn/maml"
    },
    conceptLink: "fs-meta-learning",
    partOf: [],
    prereqs: ["fs-meta-learning", "fs-few-shot", "dl-backprop", "ml-gradient-descent", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A standard neural network needs many examples to learn a task. Show it a brand-new task with only
       a handful of labeled points and it fails: gradient descent from a random (or generically pretrained)
       starting point needs thousands of steps and lots of data to reach good accuracy. The goal of
       <b>meta-learning</b> &mdash; "learning to learn" &mdash; is to fix this: train on many tasks so that a
       <i>new</i> task can be solved from very few examples.</p>
       <p>Earlier meta-learning methods got there by adding machinery: a separate network that outputs another
       network's weights, or a recurrent "learner" that ingests examples and emits predictions. The paper's
       complaint is that these approaches <b>change the model or the learning rule</b>. From the abstract:</p>
       <blockquote>"In our approach, the parameters of the model are explicitly trained such that a small number
       of gradient steps with a small amount of training data from a new task will produce good generalization
       performance on that task." (Abstract)</blockquote>
       <p>The open question they answer: can we keep ordinary gradient descent as the adaptation rule and an
       ordinary network as the model, and instead just learn a <b>good starting point</b>?</p>`,
    contribution:
      `<ul>
        <li><b>Meta-learn an initialization, nothing else.</b> MAML learns one weight vector $\\theta$ &mdash;
        a starting point &mdash; such that a few ordinary gradient-descent steps from $\\theta$ adapt to a new
        task. No extra network, no learned optimizer. The model and the adaptation rule stay completely
        standard.</li>
        <li><b>Model-agnostic.</b> Because adaptation is just gradient descent, the method works for any model
        trained that way: classification, regression, and reinforcement learning all use the same recipe.</li>
        <li><b>A bi-level (two-loop) objective with a second-order meta-gradient.</b> The novel mechanism is to
        optimize $\\theta$ <i>through</i> the inner adaptation step &mdash; differentiate the post-adaptation
        loss with respect to the pre-adaptation weights. This "gradient through a gradient" is what teaches
        $\\theta$ to be easy to fine-tune.</li>
      </ul>`,
    whyItMattered:
      `<p>MAML became the reference point for few-shot learning. Its "learn an initialization you can fine-tune"
       framing is simple enough that it spread far beyond the original benchmarks: into reinforcement learning,
       robotics, and domain adaptation. It also launched a family of follow-ups &mdash; the first-order variant
       (FOMAML), Reptile, and implicit / proximal meta-learners &mdash; all built on the same two-loop skeleton.
       The idea that a network's <i>initial weights</i> are themselves something you can train for fast
       adaptation is the lasting takeaway.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.2 (Model-Agnostic Meta-Learning)</b> &mdash; the whole method. The inner update for the
        adapted parameters $\\theta'_i$, the meta-objective summed over tasks, and the meta-update (their
        <b>Equation 1</b>). This is the math you transcribe and implement.</li>
        <li><b>Algorithm 1 / Algorithm 2</b> &mdash; the training loop in pseudocode: sample tasks, inner-adapt
        each, then meta-update. Algorithm 2 is the few-shot supervised version.</li>
        <li><b>&sect;3.1 (Supervised Regression and Classification)</b> &mdash; the loss functions; for
        regression it is mean-squared error.</li>
        <li><b>&sect;5.1 (Regression)</b> &mdash; the sinusoid toy task you will reproduce: fit sine waves of
        varying amplitude and phase from $K$ points.</li>
       </ul>
       <p><b>Skim:</b> &sect;5.2-5.3 (the Omniglot / MiniImagenet classification benchmarks and the
       reinforcement-learning experiments) unless you want those domains. Read the one paragraph in &sect;5.2
       about the <b>first-order approximation</b> &mdash; it explains the second-order term you are about to
       implement by saying what happens when you drop it.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two starting points on many sine-fitting tasks, then test on <i>new</i> sine tasks by
       taking exactly <b>one</b> gradient step from each starting point on $K=10$ points. One starting point is
       MAML's meta-learned initialization; the other is an ordinary network pretrained jointly on the same task
       distribution (one head, no inner loop). After that single step, which init reaches lower error on
       held-out points &mdash; or will they tie? Write your guess and one sentence of reasoning.</p>
       <p>(Hint: the joint-pretrained net minimizes average loss across tasks, so it lands somewhere "in the
       middle." Does the middle adapt quickly?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the two-loop update you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Sample a task. Split its $K$ points into a <b>support</b> set (for the inner step) and a
        <b>query</b> set (to score the adapted weights).</li>
        <li><b>Inner loop:</b> compute the support loss at $\\theta$, then
        <code>grads = autograd.grad(support_loss, theta, <b>create_graph=True</b>)</code> and form
        $\\theta'_i = \\theta - \\alpha \\cdot \\text{grads}$.  <i># do NOT call .backward() here</i></li>
        <li><b>Outer loop:</b> TODO &mdash; compute the <b>query</b> loss at the adapted weights $\\theta'_i$,
        sum over the task batch, then backprop into the ORIGINAL $\\theta$.</li>
        <li>TODO: why must <code>create_graph=True</code> be set on the inner <code>grad</code> call? What
        breaks if it is <code>False</code>?</li>
       </ul>
       <p>Then build a matched baseline: the same network pretrained jointly (no inner loop), and adapt it the
       same one step at test time. Predict which init wins.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>MAML has <b>two nested loops</b>. The <b>inner loop</b> adapts to a single task; the <b>outer loop</b>
       (the meta-update) improves the shared starting point so that the inner loop works well.</p>
       <p><b>Inner loop (per task).</b> Start from the shared weights $\\theta$. Draw a task $\\mathcal{T}_i$
       and its few training points. Take one (or a few) ordinary gradient-descent steps on that task's loss to
       get task-adapted weights $\\theta'_i$ (&sect;2.2):</p>
       <p>$$ \\theta'_i = \\theta - \\alpha \\, \\nabla_\\theta \\, \\mathcal{L}_{\\mathcal{T}_i}(f_\\theta). $$</p>
       <p>Here $\\alpha$ is the <b>inner step size</b> (the fine-tuning learning rate), $f_\\theta$ is the network
       with weights $\\theta$, and $\\mathcal{L}_{\\mathcal{T}_i}$ is that task's loss. This is just one SGD
       (stochastic gradient descent) step &mdash; nothing special yet.</p>
       <p><b>Outer loop (the meta-update).</b> Now score those adapted weights $\\theta'_i$ on <i>fresh</i> points
       from the same task, and ask: did starting at $\\theta$ make adaptation work? The meta-objective sums each
       task's post-adaptation loss and minimizes it over the original $\\theta$ (&sect;2.2):</p>
       <p>$$ \\min_\\theta \\; \\sum_{\\mathcal{T}_i \\sim p(\\mathcal{T})} \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i}). $$</p>
       <p>Read the subscript carefully: the loss is evaluated at $\\theta'_i$ (after adapting), but we minimize
       over $\\theta$ (before adapting). Since $\\theta'_i$ was <i>computed from</i> $\\theta$ by the inner step,
       the gradient of this objective must flow back <b>through</b> that inner step. That is the whole trick.</p>
       <p><b>The meta-step.</b> Apply gradient descent to the meta-objective with <b>meta step size</b> $\\beta$
       (their Equation 1):</p>
       <p>$$ \\theta \\leftarrow \\theta - \\beta \\, \\nabla_\\theta \\sum_{\\mathcal{T}_i \\sim p(\\mathcal{T})}
       \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i}). $$</p>
       <p>Because $\\theta'_i = \\theta - \\alpha\\nabla_\\theta\\mathcal{L}(f_\\theta)$ already contains a
       gradient, differentiating $\\mathcal{L}(f_{\\theta'_i})$ with respect to $\\theta$ differentiates a
       gradient &mdash; producing <b>second derivatives</b> (a Hessian-vector product). The paper notes you can
       drop this second-order term for a cheaper <b>first-order approximation</b> (see Results) at a small cost
       in accuracy.</p>`,
    architecture:
      `<p>MAML is not a network architecture &mdash; it is a <b>bi-level training loop</b> wrapped around <i>any</i>
       gradient-trained model $f_\\theta$ (here a small multi-layer perceptron: $1 \\to 40 \\to 40 \\to 1$ with ReLU,
       &sect;5.1). The structure is two nested loops sharing one weight vector $\\theta$.</p>
       <p><b>Algorithm 1 (general MAML) / Algorithm 2 (supervised).</b> Inputs: task distribution $p(\\mathcal{T})$,
       inner step size $\\alpha$, meta step size $\\beta$. Initialize $\\theta$ randomly, then repeat until done:</p>
       <ol>
        <li><b>Sample a batch of tasks</b> $\\mathcal{T}_i \\sim p(\\mathcal{T})$ (here 4 sine tasks per meta-iteration).</li>
        <li><b>Inner loop &mdash; for each task $\\mathcal{T}_i$ independently:</b>
          <ul>
            <li>Draw $K$ <b>support</b> datapoints $\\mathcal{D} = \\{x^{(j)}, y^{(j)}\\}$ from $\\mathcal{T}_i$.</li>
            <li>Evaluate the support-set gradient $\\nabla_\\theta \\mathcal{L}_{\\mathcal{T}_i}(f_\\theta)$ and form
            the adapted weights $\\theta'_i = \\theta - \\alpha \\nabla_\\theta \\mathcal{L}_{\\mathcal{T}_i}(f_\\theta)$
            (one step, or $N$ chained steps for multi-step adaptation). The step is a <b>functional</b> update &mdash;
            new tensors, not an in-place optimizer step &mdash; so the inner gradient stays in the computation graph.</li>
            <li>Draw a fresh <b>query</b> set $\\mathcal{D}'_i$ from the same task for scoring.</li>
          </ul>
        </li>
        <li><b>Outer loop (meta-update) &mdash; once per batch:</b> sum each task's <i>query</i> loss at its adapted
        weights $\\theta'_i$, then apply $\\theta \\leftarrow \\theta - \\beta \\nabla_\\theta \\sum_i
        \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i})$. This single backward pass differentiates <b>through</b> every
        task's inner step (the second-order meta-gradient); $\\beta$ is realized by an Adam meta-optimizer.</li>
       </ol>
       <p><b>Data flow:</b> $\\theta \\xrightarrow{\\text{inner grad on support}} \\theta'_i \\xrightarrow{\\text{forward
       on query}} \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i})$, and the meta-gradient flows the reverse path all the way
       back to $\\theta$. Test time uses only the inner loop: take the trained $\\theta$, adapt one (or a few) steps on a
       new task's $K$ points, predict.</p>`,
    symbols: [
      { sym: "$\\theta$", desc: "the <b>shared initialization</b> &mdash; the single weight vector MAML meta-learns. Every task starts adapting from here. This is what the outer loop trains." },
      { sym: "$\\theta'_i$", desc: "the <b>task-adapted weights</b> for task $\\mathcal{T}_i$: $\\theta$ after taking one (or a few) inner gradient steps on that task's data." },
      { sym: "$\\mathcal{T}_i$", desc: "a single <b>task</b> (e.g. one specific sine wave to fit), sampled from the task distribution $p(\\mathcal{T})$." },
      { sym: "$p(\\mathcal{T})$", desc: "the <b>distribution over tasks</b> we train on (e.g. all sine waves with amplitude in $[0.1, 5.0]$ and phase in $[0, \\pi]$)." },
      { sym: "$f_\\theta$", desc: "the <b>model</b> (here a small multi-layer perceptron) with weights $\\theta$; $f_{\\theta'_i}$ is the same model after task adaptation." },
      { sym: "$\\mathcal{L}_{\\mathcal{T}_i}$", desc: "the <b>loss</b> on task $\\mathcal{T}_i$. For regression it is mean-squared error (&sect;3.1): the average squared gap between prediction and target." },
      { sym: "$\\nabla_\\theta$", desc: "the <b>gradient</b> with respect to $\\theta$: the vector of partial derivatives telling each weight which way to move to lower the loss." },
      { sym: "$\\alpha$", desc: "the <b>inner step size</b> (fine-tuning learning rate): how big the per-task adaptation step is. The paper uses $\\alpha = 0.01$ for the sinusoid task." },
      { sym: "$\\beta$", desc: "the <b>meta step size</b>: the learning rate of the outer loop that updates $\\theta$ across tasks." },
      { sym: "“support set”", desc: "a plain term, not a symbol: the few points used for the <b>inner</b> adaptation step (computing $\\theta'_i$)." },
      { sym: "“query set”", desc: "a plain term: <i>fresh</i> points from the same task used to score the adapted weights $\\theta'_i$ &mdash; this is the loss the meta-update minimizes." },
      { sym: "$N$", desc: "the <b>number of inner gradient steps</b> in the inner loop. The paper allows \"one or more\" (&sect;2.2); the sinusoid experiment uses $N=1$. $\\theta_i^{(k)}$ is the weight vector after $k$ inner steps." },
      { sym: "$I$", desc: "the <b>identity matrix</b>. FOMAML replaces the Hessian factor $I - \\alpha\\nabla^2\\mathcal{L}$ with $I$, i.e. drops the second-order term." },
      { sym: "$\\nabla^2_\\theta$", desc: "the <b>Hessian</b>: the matrix of second partial derivatives of the loss. It appears in the exact meta-gradient and is what FOMAML omits." },
      { sym: "$x^{(j)}, y^{(j)}$", desc: "an <b>input/target pair</b> drawn from a task (e.g. one $(x, A\\sin(x+\\phi))$ point). Used in the loss definitions $\\mathcal{L}_{\\mathcal{T}_i}$ (Eq. 2 / Eq. 3)." }
    ],
    formula:
      `<p>$$ \\theta'_i = \\theta - \\alpha \\, \\nabla_\\theta \\, \\mathcal{L}_{\\mathcal{T}_i}(f_\\theta) $$</p>
       <p><b>Inner-loop adaptation</b> (&sect;2.2). One gradient-descent step on task $\\mathcal{T}_i$'s loss from the
       shared init $\\theta$, with inner step size $\\alpha$, giving the task-adapted weights $\\theta'_i$.</p>

       <p>$$ \\min_\\theta \\; \\sum_{\\mathcal{T}_i \\sim p(\\mathcal{T})} \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i})
       \\;=\\; \\sum_{\\mathcal{T}_i \\sim p(\\mathcal{T})} \\mathcal{L}_{\\mathcal{T}_i}\\!\\big(f_{\\theta - \\alpha \\nabla_\\theta \\mathcal{L}_{\\mathcal{T}_i}(f_\\theta)}\\big) $$</p>
       <p><b>Meta-objective</b> (&sect;2.2). Minimize, over the <i>pre-adaptation</i> $\\theta$, the sum of each task's
       loss evaluated at its <i>post-adaptation</i> weights $\\theta'_i$. Expanding $\\theta'_i$ (right side) shows the
       objective is a function of $\\theta$ through the inner step.</p>

       <p>$$ \\theta \\leftarrow \\theta - \\beta \\, \\nabla_\\theta \\sum_{\\mathcal{T}_i \\sim p(\\mathcal{T})}
       \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i}) $$</p>
       <p><b>Meta-update</b> (the paper's <b>Equation 1</b>, &sect;2.2). SGD on the meta-objective with meta step size
       $\\beta$. Because $\\theta'_i$ already contains $\\nabla_\\theta\\mathcal{L}$, this differentiates a gradient &mdash;
       the <b>second-order meta-gradient</b> that flows back through the inner step.</p>

       <p>$$ \\nabla_\\theta \\, \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i}) =
       \\big(I - \\alpha \\nabla^2_\\theta \\mathcal{L}^{\\text{sup}}_{\\mathcal{T}_i}(f_\\theta)\\big)\\,
       \\nabla_{\\theta'_i} \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i})
       \\;\\;\\xrightarrow{\\text{FOMAML}}\\;\\; \\nabla_{\\theta'_i} \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i}) $$</p>
       <p><b>First-order approximation (FOMAML)</b> (&sect;5.2). The exact meta-gradient carries the Hessian factor
       $I - \\alpha\\nabla^2_\\theta\\mathcal{L}^{\\text{sup}}$ (chain rule through the inner step). FOMAML drops the
       Hessian &mdash; replaces that factor with the identity $I$ &mdash; so the meta-gradient is just the loss gradient
       evaluated at the adapted weights $\\theta'_i$. The paper reports this is "nearly the same" in accuracy with
       "roughly" a "33% speed-up."</p>

       <p>$$ \\theta_i^{(0)} = \\theta, \\qquad \\theta_i^{(k)} = \\theta_i^{(k-1)} - \\alpha \\, \\nabla_{\\theta_i^{(k-1)}}
       \\mathcal{L}_{\\mathcal{T}_i}\\!\\big(f_{\\theta_i^{(k-1)}}\\big), \\qquad \\theta'_i = \\theta_i^{(N)} $$</p>
       <p><b>Multi-step inner adaptation</b> (&sect;2.2: "one or more gradient updates"). Chain $N$ inner steps instead of
       one; the adapted weights $\\theta'_i$ are the output of the last step. The meta-gradient then back-propagates
       through all $N$ steps. (Eq. 2 / Eq. 3 give the task loss $\\mathcal{L}_{\\mathcal{T}_i}$ &mdash; mean-squared error
       for regression and cross-entropy for classification &mdash; shown in <i>What it does</i>.)</p>`,
    whatItDoes:
      `<p><b>The inner update</b> (left, &sect;2.2; shown unnumbered in the paper) is ordinary fine-tuning: take
       the shared weights $\\theta$, compute task $\\mathcal{T}_i$'s loss gradient, and step downhill by $\\alpha$
       to get the task-specific weights $\\theta'_i$. The paper shows one step; "one or more" steps are allowed.</p>
       <p><b>The meta-update</b> (right, the paper's <b>Equation 1</b>) is the novel part. It moves the shared
       $\\theta$ to lower the <i>post-adaptation</i> loss summed over a batch of tasks. The subtlety: the loss is
       measured at $\\theta'_i$, but the step is on $\\theta$. Because $\\theta'_i$ is a function of $\\theta$
       (through the inner gradient), the chain rule pushes the meta-gradient <b>through</b> the inner step.
       Computing it differentiates a gradient, so it needs second derivatives. The effect on $\\theta$: not "fit
       the average task," but "sit at a point from which one gradient step reaches any task."</p>
       <p><b>The task loss $\\mathcal{L}_{\\mathcal{T}_i}$</b> that both updates use is problem-specific (&sect;3.1). For
       <b>regression</b> it is squared error (the paper's <b>Equation 2</b>):
       $$ \\mathcal{L}_{\\mathcal{T}_i}(f_\\phi) = \\sum_{x^{(j)}, y^{(j)} \\sim \\mathcal{T}_i} \\big\\lVert f_\\phi(x^{(j)}) - y^{(j)} \\big\\rVert_2^2, $$
       the sum of squared gaps between prediction and target (our code averages it via <code>nn.MSELoss</code>). For
       <b>classification</b> it is cross-entropy (the paper's <b>Equation 3</b>):
       $$ \\mathcal{L}_{\\mathcal{T}_i}(f_\\phi) = -\\sum_{x^{(j)}, y^{(j)} \\sim \\mathcal{T}_i} y^{(j)} \\log f_\\phi(x^{(j)}) + (1 - y^{(j)}) \\log\\!\\big(1 - f_\\phi(x^{(j)})\\big). $$
       The MAML loop is identical either way &mdash; only $\\mathcal{L}_{\\mathcal{T}_i}$ changes &mdash; which is what
       "model-agnostic" means.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the meta-learning framing lives in the fs-meta-learning concept lesson.</b> Here
       we make the "gradient through a gradient" concrete. Take one inner step and write the post-adaptation
       weights as a function of $\\theta$:</p>
       <p>$$ \\theta'(\\theta) = \\theta - \\alpha \\nabla_\\theta \\mathcal{L}^{\\text{sup}}(\\theta), $$</p>
       <p>where $\\mathcal{L}^{\\text{sup}}$ is the support-set loss. The meta-objective for one task is the
       query loss at those adapted weights, $\\mathcal{L}^{\\text{qry}}(\\theta'(\\theta))$. Apply the chain
       rule to differentiate it with respect to $\\theta$:</p>
       <p>$$ \\nabla_\\theta \\, \\mathcal{L}^{\\text{qry}}(\\theta') = \\Big( \\underbrace{I - \\alpha
       \\nabla^2_\\theta \\mathcal{L}^{\\text{sup}}(\\theta)}_{\\partial \\theta' / \\partial \\theta} \\Big)
       \\; \\nabla_{\\theta'} \\mathcal{L}^{\\text{qry}}(\\theta'). $$</p>
       <p>The factor $\\partial\\theta'/\\partial\\theta = I - \\alpha\\nabla^2_\\theta\\mathcal{L}^{\\text{sup}}$
       contains $\\nabla^2_\\theta\\mathcal{L}^{\\text{sup}}$ &mdash; the <b>Hessian</b> (the matrix of second
       derivatives) of the support loss. That is the second-order term. In code you never build this matrix:
       you set <code>create_graph=True</code> on the inner gradient so the inner step stays part of the
       computation graph, then call <code>.backward()</code> on the query loss; autograd forms the needed
       Hessian-vector product automatically. The <b>first-order approximation</b> (FOMAML, &sect;5.2) simply
       drops the Hessian &mdash; it replaces the factor with the identity $I$ &mdash; so the meta-gradient
       becomes just $\\nabla_{\\theta'}\\mathcal{L}^{\\text{qry}}(\\theta')$, evaluated at the adapted weights.</p>`,
    example:
      `<p>Work one inner step by hand on a tiny task so the update is concrete. Use a one-feature linear model
       $f(x) = w x + b$ with weights $\\theta = (w, b)$, mean-squared-error loss, and inner step size
       $\\alpha = 0.05$. Start at $\\theta = (w, b) = (0, 0)$. The task gives two points:
       $x = [1, 2]$ with targets $y = [1, 3]$.</p>
       <ul class="steps">
        <li><b>Forward + loss.</b> Predictions at $\\theta=(0,0)$ are $[0, 0]$, so residuals are
        $\\hat y - y = [0-1,\\; 0-3] = [-1, -3]$. Mean-squared error
        $= \\tfrac{1}{2}\\big((-1)^2 + (-3)^2\\big) = \\tfrac{1}{2}(1 + 9) = 5.0$.</li>
        <li><b>Gradient.</b> For MSE $= \\tfrac{1}{2}\\sum (\\hat y_j - y_j)^2 \\,/\\, n$ with $n=2$:
        $\\nabla_w = \\tfrac{2}{n}\\sum (\\hat y_j - y_j)\\,x_j = (-1)(1) + (-3)(2) = -7$, and
        $\\nabla_b = \\tfrac{2}{n}\\sum (\\hat y_j - y_j) = (-1) + (-3) = -4$. So
        $\\nabla_\\theta\\mathcal{L} = (-7, -4)$.</li>
        <li><b>Inner update</b> $\\theta'_i = \\theta - \\alpha\\nabla_\\theta\\mathcal{L}$:
        $w' = 0 - 0.05\\cdot(-7) = 0.35$, $\\;b' = 0 - 0.05\\cdot(-4) = 0.20$. So $\\theta'_i = (0.35, 0.20)$.</li>
        <li><b>Check it helped.</b> New predictions $[0.35\\cdot1 + 0.20,\\; 0.35\\cdot2 + 0.20] = [0.55, 0.90]$;
        new residuals $[-0.45, -2.10]$; new loss $= \\tfrac{1}{2}(0.2025 + 4.41) = 2.3062$. The single inner
        step dropped the loss from $5.0$ to $\\approx 2.31$.</li>
       </ul>
       <p>The meta-update would then differentiate this $2.3062$ <i>with respect to the original</i> $\\theta=(0,0)$
       &mdash; through the step above &mdash; to nudge the starting point. These exact numbers are recomputed in
       the notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build the model</b> with <code>torch.nn</code>: a tiny multi-layer perceptron (1 input &rarr; 40
        &rarr; 40 &rarr; 1, ReLU), matching the paper's sinusoid network (&sect;5.1).</li>
        <li><b>Sample a batch of tasks</b> from $p(\\mathcal{T})$. Each sine task = one amplitude in
        $[0.1, 5.0]$ and one phase in $[0, \\pi]$. Draw $K=10$ support points and $K$ query points in
        $[-5, 5]$.</li>
        <li><b>Inner loop (by hand):</b> for each task, compute the support MSE at $\\theta$, take its gradient
        with <code>create_graph=True</code>, and form $\\theta'_i = \\theta - \\alpha\\,\\text{grad}$.</li>
        <li><b>Outer loop:</b> evaluate each task's <b>query</b> loss at $\\theta'_i$, sum over the task batch,
        and <code>.backward()</code> into the original $\\theta$; step with the meta-optimizer (step size
        $\\beta$).</li>
        <li><b>Baseline:</b> pretrain the same network jointly on the task distribution (no inner loop, one head).</li>
        <li><b>Evaluate:</b> on held-out tasks, adapt each init with <b>one</b> gradient step and compare query
        loss. <b>Ablate</b> by switching the inner gradient to <code>create_graph=False</code> (first-order MAML).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the method "leads to state-of-the-art performance on two few-shot image
       classification benchmarks, produces good results on few-shot regression, and accelerates fine-tuning for
       policy gradient reinforcement learning with neural network policies."</p>
       <p>On the second-order term, the paper reports (&sect;5.2) that the <b>first-order approximation</b> &mdash;
       dropping the Hessian-vector product / the extra backward pass &mdash; performs "nearly the same" as the
       full second-order MAML while giving "roughly" a "33% speed-up" in network computation. (Quoted from
       &sect;5.2.)</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;5.2. The numbers in the
       CODEVIZ panel below are from our own tiny run on the sinusoid task &mdash; not the paper's reported
       results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The model and the optimizers already ship in PyTorch,
       so you <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code> for the multi-layer perceptron, <code>nn.MSELoss</code>, and
       <code>torch.optim.Adam</code> for the meta-optimizer. <b>Build by hand:</b> the <b>bi-level meta-update</b>
       &mdash; the inner adaptation step, and crucially the outer gradient that flows <i>through</i> it via
       <code>torch.autograd.grad(..., create_graph=True)</code>. That second-order meta-gradient is the paper's
       contribution; PyTorch will not do it unless you keep the inner step in the graph. The general
       meta-learning framing (support/query, episodes) is recapped from the <b>fs-meta-learning</b> concept
       lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting <code>create_graph=True</code>.</b> If the inner <code>autograd.grad</code> call uses
        the default <code>create_graph=False</code>, the inner step is detached from the graph and the
        meta-gradient cannot flow through it &mdash; you silently get the <b>first-order</b> approximation
        (FOMAML), not full MAML. <b>Fix:</b> set <code>create_graph=True</code> on the inner gradient; this is
        the single most common MAML bug.</li>
        <li><b>Calling <code>.backward()</code> inside the inner loop.</b> The inner step must be a pure
        functional update ($\\theta'_i = \\theta - \\alpha\\,\\text{grad}$), <i>not</i> an optimizer step on
        $\\theta$. Calling <code>opt.step()</code> there mutates $\\theta$ in place and destroys the graph the
        outer loop needs. <b>Fix:</b> compute $\\theta'_i$ as new tensors; only the meta-update touches the
        optimizer.</li>
        <li><b>Scoring the inner step on the SAME points it trained on.</b> The meta-objective must use a
        <b>query</b> set disjoint from the <b>support</b> set, or you reward memorizing the support points
        rather than adapting. <b>Fix:</b> draw fresh query points per task.</li>
        <li><b>Confusing MAML with joint pretraining.</b> Training the network on the union of all tasks (one
        head, no inner loop) minimizes <i>average</i> loss and lands "in the middle." That is the baseline, not
        MAML. MAML minimizes <i>post-one-step</i> loss, which is a different objective and a different optimum.</li>
        <li><b>Reusing inner-adapted weights across tasks.</b> Each task adapts from the <i>shared</i> $\\theta$,
        independently. Do not chain $\\theta'_i$ from one task into the next.</li>
      </ul>`,
    recall: [
      "Write the inner update for $\\theta'_i$ and the meta-update (Eqn. 1) from memory.",
      "In the meta-objective $\\min_\\theta \\sum_i \\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i})$, why is the loss at $\\theta'_i$ but the minimization over $\\theta$?",
      "Define $\\alpha$ and $\\beta$ and say which loop each belongs to.",
      "What does <code>create_graph=True</code> do, and what approximation do you get without it?"
    ],
    practice: [
      {
        q: `<b>The first-order ablation.</b> You have a working second-order MAML. Switch the inner gradient
            call from <code>create_graph=True</code> to <code>create_graph=False</code> (first-order MAML) and
            retrain, everything else identical. What term did you just drop, and what do you expect to happen to
            adaptation quality and speed?`,
        steps: [
          { do: `Locate the inner step: <code>grads = torch.autograd.grad(support_loss, params, create_graph=True)</code>. Set it to <code>False</code>.`, why: `<code>create_graph=False</code> detaches the inner step from the graph, so the outer <code>.backward()</code> stops at the adapted weights and never differentiates through the inner gradient.` },
          { do: `Identify the dropped term: the factor $I - \\alpha\\nabla^2_\\theta\\mathcal{L}^{\\text{sup}}$ collapses to $I$, so the Hessian-vector product (the second-order term) is gone.`, why: `The meta-gradient becomes just $\\nabla_{\\theta'}\\mathcal{L}^{\\text{qry}}(\\theta')$ &mdash; the gradient at the adapted weights, treated as if $\\theta'$ did not depend on $\\theta$.` },
          { do: `Retrain and compare: expect adaptation that is close to full MAML, at lower cost per meta-step.`, why: `&sect;5.2 reports the first-order approximation performs "nearly the same" with "roughly" a "33% speed-up" &mdash; the backward pass through the inner gradient is skipped.` }
        ],
        answer: `<p>You dropped the <b>second-order (Hessian-vector) term</b>: with <code>create_graph=False</code>
                 the meta-gradient no longer flows through the inner step, collapsing $I-\\alpha\\nabla^2\\mathcal{L}$
                 to $I$. This is exactly FOMAML. The paper (&sect;5.2) reports it is "nearly the same" in quality
                 with "roughly" a "33% speed-up." So the second-order term helps a little but is not essential
                 &mdash; the bulk of MAML's benefit comes from the bi-level objective itself, not from the
                 Hessian.</p>`
      },
      {
        q: `Why does a network <b>jointly pretrained</b> on all sine tasks (one head, no inner loop) adapt
            <i>poorly</i> in one gradient step, while MAML's init adapts well &mdash; even though both saw the
            same task distribution?`,
        steps: [
          { do: `Write each objective. Joint: $\\min_\\theta \\mathbb{E}_i\\,\\mathcal{L}_{\\mathcal{T}_i}(f_\\theta)$ &mdash; loss at $\\theta$ itself. MAML: $\\min_\\theta \\mathbb{E}_i\\,\\mathcal{L}_{\\mathcal{T}_i}(f_{\\theta'_i})$ &mdash; loss <i>after</i> a step.`, why: `Joint minimizes loss <i>before</i> any adaptation; MAML minimizes loss <i>after</i> one adaptation step. Different objectives, different optima.` },
          { do: `Reason about the joint optimum on sinusoids: amplitudes and phases vary, so the average-fitting solution is roughly the flat mean curve. One small step barely moves it toward any specific sine.`, why: `Minimizing average loss lands "in the middle"; the middle is not positioned for fast per-task descent.` },
          { do: `Reason about the MAML optimum: $\\theta$ is placed so that one step's gradient points sharply at whichever task appeared. The init is shaped for fast descent, not for low pre-step loss.`, why: `MAML explicitly rewards post-step loss, so the gradient geometry around $\\theta$ is tuned for one-step adaptation.` }
        ],
        answer: `<p>Because they optimize <b>different</b> objectives. Joint pretraining minimizes loss <i>at</i>
                 $\\theta$, so it settles on the average curve &mdash; good on no task, and one step barely moves
                 it. MAML minimizes loss <i>after</i> one step, so it places $\\theta$ where a single gradient
                 step reaches each task quickly. Same data, different target: "be good now" versus "be one step
                 from good." Our run below shows the gap: after one step the MAML init reaches far lower
                 held-out error than the jointly pretrained init.</p>`
      },
      {
        q: `In the worked example you had $\\theta=(0,0)$, $\\alpha=0.05$, points $x=[1,2]$, $y=[1,3]$, giving
            gradient $(-7,-4)$ and $\\theta'_i=(0.35,0.20)$ with post-step loss $\\approx 2.31$. Suppose you
            instead took a much larger inner step, $\\alpha=0.40$. Compute $\\theta'_i$ and the new loss. What
            does this say about choosing $\\alpha$?`,
        steps: [
          { do: `Apply the inner update with $\\alpha=0.40$: $w' = 0 - 0.40\\cdot(-7) = 2.8$, $b' = 0 - 0.40\\cdot(-4) = 1.6$.`, why: `Same gradient $(-7,-4)$; only the step size changed, so $\\theta'_i=(2.8,1.6)$.` },
          { do: `Compute the new loss: predictions $[2.8+1.6,\\; 5.6+1.6] = [4.4, 7.2]$; residuals $[3.4, 4.2]$; loss $= \\tfrac12(3.4^2 + 4.2^2) = \\tfrac12(11.56 + 17.64) = 14.6$.`, why: `The step overshot the minimum: loss jumped from $5.0$ to $14.6$, worse than before the step.` },
          { do: `Conclude: too large an $\\alpha$ overshoots; the inner step must be small enough that one step improves the task loss.`, why: `MAML's meta-update assumes the inner step is a sensible descent step; an overshooting $\\alpha$ poisons the post-adaptation loss the outer loop is trying to lower.` }
        ],
        answer: `<p>With $\\alpha=0.40$: $\\theta'_i=(2.8,1.6)$ and the loss <b>rises</b> from $5.0$ to $14.6$
                 &mdash; the step overshot. The inner step size $\\alpha$ must be small enough that one gradient
                 step actually lowers the task loss (the paper uses $\\alpha=0.01$ for sinusoids). MAML's outer
                 loop minimizes the <i>post-step</i> loss, so an $\\alpha$ that overshoots hands it a worse
                 objective and destabilizes meta-training. Contrast with the original $\\alpha=0.05$, which
                 dropped the loss to $2.31$.</p>`
      }
    ]
  });

  window.CODE["paper-maml"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny multi-layer perceptron with <code>nn.Linear</code> / <code>nn.ReLU</code>,
       then build the <b>novel</b> part by hand &mdash; the bi-level meta-update. The inner loop forms the
       adapted weights $\\theta'_i = \\theta - \\alpha\\,\\text{grad}$ with
       <code>torch.autograd.grad(support_loss, params, <b>create_graph=True</b>)</code> so the outer
       <code>.backward()</code> flows <b>through</b> the inner step (the second-order meta-gradient, Eqn. 1). We
       train on the paper's <b>sinusoid</b> task (&sect;5.1: amplitude $[0.1,5.0]$, phase $[0,\\pi]$, inputs
       $[-5,5]$, two hidden layers of 40 ReLU units, $\\alpha=0.01$, $K=10$). Then we evaluate two starting
       points by adapting <b>one</b> gradient step on a held-out task: the MAML init versus a network pretrained
       jointly (no inner loop). The first cell recomputes the worked example
       $\\theta=(0,0) \\to$ grad $(-7,-4) \\to \\theta'=(0.35,0.20)$, loss $5.0 \\to 2.31$. CPU, a couple
       thousand fast meta-iterations. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import math, numpy as np, copy

torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the worked example: one inner step, linear model, MSE, alpha=0.05. ---
w = torch.tensor(0.0, requires_grad=True); b = torch.tensor(0.0, requires_grad=True)
alpha_we = 0.05
xw = torch.tensor([1.0, 2.0]); yw = torch.tensor([1.0, 3.0])
loss_we = ((w*xw + b - yw)**2).mean()
gw, gb = torch.autograd.grad(loss_we, [w, b])
wp, bp = w.item() - alpha_we*gw.item(), b.item() - alpha_we*gb.item()
print("worked example: loss=%.4f grad=(%.1f, %.1f)  theta'=(%.2f, %.2f)" % (
      loss_we.item(), gw.item(), gb.item(), wp, bp))
print("  loss after 1 step =", round(((wp*xw + bp - yw)**2).mean().item(), 4))
# worked example: loss=5.0000 grad=(-7.0, -4.0)  theta'=(0.35, 0.20)
#   loss after 1 step = 2.3062


# --- 1. The model: a tiny multi-layer perceptron, composed with torch.nn (paper, Sec 5.1). ---
def make_net():
    return nn.Sequential(nn.Linear(1, 40), nn.ReLU(),
                         nn.Linear(40, 40), nn.ReLU(),
                         nn.Linear(40, 1))

# Functional forward so we can run the net at ARBITRARY weights theta' (not just nn's own).
def forward(params, x):
    w1, b1, w2, b2, w3, b3 = params
    h = torch.relu(F.linear(x, w1, b1))
    h = torch.relu(F.linear(h, w2, b2))
    return F.linear(h, w3, b3)

# --- 2. The sinusoid task distribution (paper Sec 5.1). ---
K, alpha, loss_fn = 10, 0.01, nn.MSELoss()
def sample_task(): return np.random.uniform(0.1, 5.0), np.random.uniform(0, math.pi)
def task_points(A, phase, n):
    x = torch.tensor(np.random.uniform(-5.0, 5.0, (n, 1)), dtype=torch.float32)
    return x, A * torch.sin(x + phase)

# --- 3. MAML meta-training: the NOVEL bi-level update, built by hand. ---
net = make_net()
meta_params = [p.clone().detach().requires_grad_(True) for p in net.parameters()]
meta_opt = torch.optim.Adam(meta_params, lr=1e-3)              # outer step size beta

for it in range(2000):
    meta_opt.zero_grad()
    meta_loss = 0.0
    for _ in range(4):                                        # a batch of tasks
        A, phase = sample_task()
        xs, ys = task_points(A, phase, K)                    # support set
        xq, yq = task_points(A, phase, K)                    # query set (fresh!)
        # INNER LOOP: theta'_i = theta - alpha * grad,  create_graph=True keeps the
        # inner step in the graph so the META-gradient flows THROUGH it (second order).
        inner_loss = loss_fn(forward(meta_params, xs), ys)
        grads = torch.autograd.grad(inner_loss, meta_params, create_graph=True)
        adapted = [p - alpha*g for p, g in zip(meta_params, grads)]   # NOT an optimizer step
        # OUTER LOOP contribution: query loss AT the adapted weights theta'_i.
        meta_loss = meta_loss + loss_fn(forward(adapted, xq), yq)
    (meta_loss / 4).backward()                               # Eqn. 1: grad through theta'_i
    meta_opt.step()

# --- 4. Baseline: the SAME net pretrained JOINTLY on all tasks (no inner loop, one head). ---
torch.manual_seed(0); np.random.seed(0)
joint = make_net(); joint_opt = torch.optim.Adam(joint.parameters(), lr=1e-3)
for it in range(2000):
    joint_opt.zero_grad()
    A, phase = sample_task()
    x, y = task_points(A, phase, 2*K)
    loss_fn(joint(x), y).backward(); joint_opt.step()

# --- 5. Evaluate: adapt ONE gradient step from each init on held-out tasks. ---
np.random.seed(1234)
maml_post, joint_post = [], []
for _ in range(200):
    A, phase = sample_task()
    xs, ys = task_points(A, phase, K); xq, yq = task_points(A, phase, K)
    # MAML init: one inner step, then score on query.
    p = [q.clone().detach().requires_grad_(True) for q in meta_params]
    g = torch.autograd.grad(loss_fn(forward(p, xs), ys), p)
    p2 = [q - alpha*gg for q, gg in zip(p, g)]
    maml_post.append(loss_fn(forward(p2, xq), yq).item())
    # Joint init: one SGD step of the pretrained net.
    m = copy.deepcopy(joint); o = torch.optim.SGD(m.parameters(), lr=alpha)
    o.zero_grad(); loss_fn(m(xs), ys).backward(); o.step()
    joint_post.append(loss_fn(m(xq), yq).item())

print("\\nHeld-out sinusoid tasks (200), mean query MSE after ONE gradient step:")
print("  MAML init   : %.4f" % np.mean(maml_post))
print("  Joint init  : %.4f" % np.mean(joint_post))
# MAML init   : ~1.34      <- adapts far better in one step
# Joint init  : ~2.88
# (Our small run, not the paper's reported numbers. Exact values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-maml"] = {
    question: "After meta-training, how fast does each initialization adapt to a NEW sinusoid task as we take more inner gradient steps?",
    charts: [
      {
        type: "line",
        title: "Query MSE vs number of inner gradient steps — MAML init vs joint-pretrained init",
        xlabel: "inner gradient steps taken on the new task (K=10 support points)",
        ylabel: "mean query MSE (100 held-out tasks)",
        series: [
          {
            name: "MAML init",
            color: "#7ee787",
            points: [[0,3.196],[1,0.944],[2,0.741],[3,0.68],[4,0.617],[5,0.597]]
          },
          {
            name: "Joint-pretrained init",
            color: "#ff7b72",
            points: [[0,3.374],[1,2.737],[2,2.529],[3,2.438],[4,2.371],[5,2.322]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny multi-layer perceptron (1&rarr;40&rarr;40&rarr;1, ReLU) meta-trained with full second-order MAML on the sinusoid task (amplitude in [0.1,5.0], phase in [0,&pi;], inputs in [-5,5], inner step &alpha;=0.01, K=10), versus the same network pretrained jointly on the union of all tasks. Both adapt to 100 held-out tasks by plain gradient descent; we plot mean query MSE vs step count. From a near-identical start (~3.2 vs ~3.4), ONE inner step takes the MAML init to ~0.94 while the joint init only reaches ~2.74 &mdash; and the joint init never catches up. MAML's initialization is positioned for fast one-step adaptation; the joint 'average' init is not.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math, numpy as np, copy
torch.manual_seed(0); np.random.seed(0)

def make_net(): return nn.Sequential(nn.Linear(1,40), nn.ReLU(),
                                     nn.Linear(40,40), nn.ReLU(), nn.Linear(40,1))
def forward(p, x):
    w1,b1,w2,b2,w3,b3 = p
    h = torch.relu(F.linear(x, w1, b1)); h = torch.relu(F.linear(h, w2, b2))
    return F.linear(h, w3, b3)
def sample_task(): return np.random.uniform(0.1,5.0), np.random.uniform(0,math.pi)
def pts(A, ph, n):
    x = torch.tensor(np.random.uniform(-5,5,(n,1)), dtype=torch.float32)
    return x, A*torch.sin(x+ph)
K, alpha, lf = 10, 0.01, nn.MSELoss()

# --- meta-train MAML (second order, create_graph=True) ---
net = make_net(); mp = [p.clone().detach().requires_grad_(True) for p in net.parameters()]
opt = torch.optim.Adam(mp, lr=1e-3)
for it in range(3000):
    opt.zero_grad(); ml = 0.0
    for _ in range(4):
        A, ph = sample_task(); xs, ys = pts(A,ph,K); xq, yq = pts(A,ph,K)
        g = torch.autograd.grad(lf(forward(mp,xs), ys), mp, create_graph=True)
        ad = [p - alpha*gg for p,gg in zip(mp,g)]
        ml = ml + lf(forward(ad,xq), yq)
    (ml/4).backward(); opt.step()

# --- joint pretrain baseline ---
torch.manual_seed(0); np.random.seed(0)
jn = make_net(); jo = torch.optim.Adam(jn.parameters(), lr=1e-3)
for it in range(3000):
    jo.zero_grad(); A, ph = sample_task(); x, y = pts(A,ph,2*K)
    lf(jn(x), y).backward(); jo.step()

# --- average adaptation curve over 100 held-out tasks, 5 inner steps ---
np.random.seed(99); STEPS, NT = 5, 100
maml_c = np.zeros(STEPS+1); joint_c = np.zeros(STEPS+1)
for _ in range(NT):
    A, ph = sample_task(); xs, ys = pts(A,ph,K); xq, yq = pts(A,ph,K)
    p = [q.clone().detach().requires_grad_(True) for q in mp]
    with torch.no_grad(): maml_c[0] += lf(forward(p,xq), yq).item()
    for s in range(STEPS):
        g = torch.autograd.grad(lf(forward(p,xs), ys), p)
        p = [(q-alpha*gg).detach().requires_grad_(True) for q,gg in zip(p,g)]
        with torch.no_grad(): maml_c[s+1] += lf(forward(p,xq), yq).item()
    m = copy.deepcopy(jn); o = torch.optim.SGD(m.parameters(), lr=alpha)
    with torch.no_grad(): joint_c[0] += lf(m(xq), yq).item()
    for s in range(STEPS):
        o.zero_grad(); lf(m(xs), ys).backward(); o.step()
        with torch.no_grad(): joint_c[s+1] += lf(m(xq), yq).item()
maml_c /= NT; joint_c /= NT
print("MAML  init:", [round(v,3) for v in maml_c])
print("Joint init:", [round(v,3) for v in joint_c])
# MAML  init: [3.196, 0.944, 0.741, 0.68, 0.617, 0.597]
# Joint init: [3.374, 2.737, 2.529, 2.438, 2.371, 2.322]
# One inner step: MAML 0.944 vs joint 2.737. Our small run, not the paper's number.`
  };
})();
