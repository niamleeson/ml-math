/* Paper lesson — Adam: A Method for Stochastic Optimization (Kingma & Ba, 2014).
   Grounded from arXiv:1412.6980 (abstract + the published ICLR 2015 PDF: Algorithm 1, Section 2,
   and the Section 3 initialization-bias-correction derivation, eqs. (1)–(4)).
   Track A (primitive): build Adam from scratch with raw torch, verify with torch.allclose vs
   torch.optim.Adam over several steps. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-adam". */
(function () {
  window.LESSONS.push({
    id: "paper-adam",
    title: "Adam — A Method for Stochastic Optimization (2014)",
    tagline: "Per-parameter step sizes from running averages of the gradient and its square — so most networks train well with almost no learning-rate tuning.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Diederik P. Kingma, Jimmy Lei Ba",
      org: "University of Amsterdam / University of Toronto",
      year: 2014,
      venue: "ICLR 2015 (arXiv:1412.6980)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1412.6980",
      code: ""
    },

    conceptLink: "dl-optimizers",
    partOf: [
      { capstone: "capstone-image-classifier", step: 7, builds: "Adam optimizer from scratch" }
    ],
    prereqs: ["dl-optimizers", "dl-backprop", "pt-autograd", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Training a network means repeatedly nudging its weights downhill on a loss
       function. Plain <b>stochastic gradient descent (SGD)</b> &mdash; "stochastic" because the gradient
       is estimated from a small random <b>mini-batch</b> of data, not the whole dataset &mdash; takes the
       same-sized step on every weight: <code>weight = weight - learning_rate * gradient</code>. ("Gradient"
       = the slope of the loss with respect to a weight; the direction and steepness of downhill.)</p>
       <p><b>What was broken.</b> One global step size rarely fits every weight. Some weights have large,
       noisy gradients and want small steps; others have tiny, sparse gradients and want large steps. So
       practitioners spent a lot of effort hand-tuning the learning rate and a decay schedule, and SGD could
       crawl on badly <b>conditioned</b> problems (where the loss surface is much steeper in some directions
       than others). Earlier adaptive methods helped: <b>AdaGrad</b> scaled each weight's step by its past
       squared gradients but let the step decay to zero; <b>RMSProp</b> fixed the decay with a moving average.
       Adam combines those ideas and adds momentum and a bias correction.</p>`,

    contribution:
      `<p>Adam ("<b>ada</b>ptive <b>m</b>oment estimation") gives every weight its own, automatically tuned
       step size. Its contributions (abstract; Section 2):</p>
       <ul>
         <li><b>Per-parameter adaptive steps from two running averages.</b> It keeps a moving average of each
         gradient (the <b>first moment</b>, like momentum) and a moving average of each gradient <i>squared</i>
         (the <b>second moment</b>, a per-weight measure of recent gradient size), and divides the first by the
         square root of the second. Big-gradient weights get smaller steps; small-gradient weights get larger
         steps.</li>
         <li><b>Initialization bias correction.</b> Both averages start at zero, which biases them toward zero
         in the first steps. Adam divides them by an explicit correction factor so the early estimates are
         right (Section 3, derived below).</li>
         <li><b>Little tuning, intuitive defaults.</b> The abstract states the hyper-parameters "have intuitive
         interpretations and typically require little tuning." The paper's defaults
         ($\\alpha=0.001,\\ \\beta_1=0.9,\\ \\beta_2=0.999,\\ \\epsilon=10^{-8}$) work across a wide range of
         problems.</li>
       </ul>`,

    whyItMattered:
      `<p>Adam became the default optimizer for a huge fraction of deep learning. Because it largely removes
       per-weight learning-rate tuning and is robust to noisy, sparse gradients, it let people train new
       architectures quickly without optimizer babysitting. It is the optimizer you reach for first on
       Transformers, GANs, and most classifiers &mdash; including the image-classifier capstone in this course.
       Its successor <b>AdamW</b> (decoupled weight decay) is a small modification of exactly this update.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the one-paragraph pitch: adaptive estimates of lower-order moments,
         little tuning, good for noisy/sparse gradients.</li>
         <li><b>Algorithm 1</b> (the pseudocode box) &mdash; this is the whole method in eight lines. The
         default settings are printed right above it.</li>
         <li><b>Section 2 ("Algorithm") and 2.1 ("Adam's update rule")</b> &mdash; the plain-English meaning,
         and the "trust region" intuition for why the effective step is bounded by $\\alpha$.</li>
         <li><b>Section 3 ("Initialization bias correction")</b> &mdash; the short derivation, eqs. (1)&ndash;(4),
         of why we divide by $1-\\beta_2^{\\,t}$.</li>
       </ul>
       <p><b>Skim:</b> Section 4 (convergence/regret bound) for the headline that Adam matches the best known
       $O(\\sqrt{T})$ online-convex bound &mdash; you do not need the proof. Section 6 (experiments) for the
       qualitative result that Adam converges fast and robustly.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will minimize the same small, badly-conditioned least-squares loss
       (some input features scaled much larger than others) twice from the same start: once with plain
       <b>SGD</b>, once with <b>Adam</b>, each at a sensible learning rate. Will Adam reach a clearly lower loss
       in the same number of steps because it adapts the step size <i>per weight</i>? And does Adam's very first
       step move each weight by about $\\pm\\alpha$ (the learning rate), regardless of how big that weight's
       gradient is? Write down your guesses, then check the worked example and the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write an <code>MyAdam</code> optimizer over a list of parameter
       tensors, using only raw torch (no <code>torch.optim</code>). Keep per-parameter state <code>m</code>,
       <code>v</code> (both zeros to start) and a step counter <code>t</code>. In <code>step()</code>, for each
       parameter <code>p</code> with gradient <code>g = p.grad</code>:</p>
       <ul>
         <li><code># TODO: m = beta1*m + (1-beta1)*g</code> &mdash; running average of the gradient (first moment).</li>
         <li><code># TODO: v = beta2*v + (1-beta2)*g*g</code> &mdash; running average of the squared gradient (second moment).</li>
         <li><code># TODO: mhat = m / (1 - beta1**t)</code> and <code>vhat = v / (1 - beta2**t)</code> &mdash; bias correction.</li>
         <li><code># TODO: p -= lr * mhat / (sqrt(vhat) + eps)</code> &mdash; the per-parameter update. Do it under <code>torch.no_grad()</code>.</li>
       </ul>
       <p>The CODE cell below is the full reference, including the <code>torch.allclose</code> check against
       <code>torch.optim.Adam</code> &mdash; that passing check is the proof your formula is exactly PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Adam processes each weight independently. For one weight, at step $t$, with current gradient $g_t$:</p>
       <ol>
         <li><b>First moment (momentum-like average of the gradient).</b> Blend the new gradient into a running
         average: $m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t$. With $\\beta_1=0.9$ this remembers roughly the last
         ten gradients, smoothing out mini-batch noise. This is the <i>direction</i> we will move.</li>
         <li><b>Second moment (average of the squared gradient).</b> Likewise track the squared gradient:
         $v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2$. With $\\beta_2=0.999$ this is a slow average of how
         <i>large</i> this weight's gradients have recently been. ($g_t^2$ is element-wise; it is always
         non-negative.)</li>
         <li><b>Bias correction.</b> Because $m_0=v_0=0$, the early averages are pulled toward zero. Undo it by
         dividing: $\\hat m_t = m_t/(1-\\beta_1^{\\,t})$ and $\\hat v_t = v_t/(1-\\beta_2^{\\,t})$. At $t=1$ these
         factors are $1-\\beta_1=0.1$ and $1-\\beta_2=0.001$, big corrections; as $t$ grows, $\\beta^{\\,t}\\to0$
         and the factor $\\to1$, so correction fades.</li>
         <li><b>Per-parameter update.</b> Step against the corrected first moment, scaled down by the size of the
         gradients (the square root of the corrected second moment):
         $\\theta_t = \\theta_{t-1} - \\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$. The tiny $\\epsilon$
         ("epsilon") only prevents division by zero.</li>
       </ol>
       <p><b>Why the division helps.</b> Dividing the direction $\\hat m_t$ by the recent gradient size
       $\\sqrt{\\hat v_t}$ makes the actual step roughly $\\pm\\alpha$ no matter how steep or flat this weight's
       loss is. The paper (Section 2.1) writes the effective step as $\\Delta_t=\\alpha\\cdot\\hat m_t/\\sqrt{\\hat v_t}$
       and calls $\\hat m_t/\\sqrt{\\hat v_t}$ the <b>signal-to-noise ratio</b>. It bounds this step: when
       $(1-\\beta_1)=\\sqrt{1-\\beta_2}$ then $|\\hat m_t/\\sqrt{\\hat v_t}|\\lt1$ so $|\\Delta_t|\\lt\\alpha$, and in
       common cases $\\hat m_t/\\sqrt{\\hat v_t}\\approx\\pm1$ (because $|\\mathbb{E}[g]/\\sqrt{\\mathbb{E}[g^2]}|\\le1$),
       so $|\\Delta_t|$ is approximately bounded by $\\alpha$. This is a <b>trust region</b>: $\\alpha$ sets the scale of movement
       directly, which is why one value works across weights. As the gradient direction grows uncertain near an
       optimum the ratio shrinks, so steps shrink automatically &mdash; a built-in <b>annealing</b>.</p>`,

    // ★ PER-ITERATION STRUCTURE ★
    architecture:
      `<p>Adam is not a network &mdash; its "architecture" is the fixed sequence of operations run once per
       optimization step, on each parameter independently. Per iteration $t$ (Algorithm 1):</p>
       <ol>
         <li><b>Get the gradient.</b> $g_t=\\nabla_\\theta f_t(\\theta_{t-1})$ &mdash; the slope of this
         mini-batch's loss at the current weights. This is the only new information each step.</li>
         <li><b>Update the two biased moments.</b> Fold $g_t$ into the first moment $m_t$ (the
         <b>momentum</b> term, a smoothed average of the gradient = the <i>direction</i> to move) and fold
         $g_t^2$ into the second moment $v_t$ (a smoothed average of the squared gradient = a per-parameter
         <i>scale</i>, how large this weight's gradients have recently been). Each weight gets its own
         $m_t,v_t$ &mdash; this is what makes the step sizes per-parameter.</li>
         <li><b>Bias-correct.</b> Rescale to $\\hat m_t,\\hat v_t$ to undo the zero-initialization bias
         (Section 3, below).</li>
         <li><b>Take the step.</b> $\\theta_t=\\theta_{t-1}-\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$.</li>
       </ol>
       <p>So Adam is exactly <b>momentum</b> (the $m_t$ direction) combined with <b>RMSProp</b>'s per-parameter
       scaling (dividing by $\\sqrt{v_t}$), plus the bias correction that neither of those has. State is two
       vectors per parameter ($m,v$) plus the scalar counter $t$ &mdash; memory is linear in the number of
       parameters, and every operation is element-wise.</p>
       <p>The paper notes a <b>mathematically equivalent, slightly faster ordering</b> (end of Section 2) that
       folds the corrections into the learning rate: precompute $\\alpha_t=\\alpha\\,\\sqrt{1-\\beta_2^{\\,t}}/(1-\\beta_1^{\\,t})$,
       then step $\\theta_t=\\theta_{t-1}-\\alpha_t\\,m_t/(\\sqrt{v_t}+\\hat\\epsilon)$ using the un-corrected
       $m_t,v_t$. Same result, fewer operations.</p>`,

    symbols: [
      { sym: "$t$", desc: "the timestep / update counter, starting at 0 and incremented to 1 on the first update. It appears as the exponent in the bias-correction factors." },
      { sym: "$\\theta_t$", desc: "theta: the parameter (weight) vector after the update at step $t$. $\\theta_{t-1}$ is its value before this step." },
      { sym: "$g_t$", desc: "the gradient at step $t$: the slope of the (mini-batch) loss with respect to each parameter, evaluated at $\\theta_{t-1}$. $g_t^2$ means each element squared." },
      { sym: "$m_t$", desc: "first moment estimate: an exponential moving average of the gradient $g_t$. Acts like momentum — the smoothed direction to move." },
      { sym: "$v_t$", desc: "second (raw) moment estimate: an exponential moving average of the squared gradient $g_t^2$. A per-parameter measure of how large recent gradients have been." },
      { sym: "$\\hat m_t$", desc: "bias-corrected first moment: $m_t$ divided by $(1-\\beta_1^{\\,t})$ to remove the pull toward zero caused by starting $m_0=0$." },
      { sym: "$\\hat v_t$", desc: "bias-corrected second moment: $v_t$ divided by $(1-\\beta_2^{\\,t})$, correcting the same zero-initialization bias for the squared average." },
      { sym: "$\\beta_1$", desc: "decay rate for the first moment, in $[0,1)$ (default 0.9). Closer to 1 means a longer memory of past gradients." },
      { sym: "$\\beta_2$", desc: "decay rate for the second moment, in $[0,1)$ (default 0.999). Closer to 1 means a slower, smoother average of squared gradients." },
      { sym: "$\\alpha$", desc: "alpha: the stepsize / learning rate (default 0.001). It bounds the effective step size per update." },
      { sym: "$\\epsilon$", desc: "epsilon: a tiny constant (default $10^{-8}$) added to the denominator so we never divide by zero when $\\hat v_t$ is near zero." },
      { sym: "first / second moment", desc: "statistics of the gradient: the first moment is its mean (average gradient); the second raw moment is the average of its square (uncentered variance — how big it is)." },
      { sym: "exponential moving average", desc: "a running average that weights recent values more than old ones: new = decay·old + (1−decay)·current." }
    ],

    formula:
      `$$m_t=\\beta_1 m_{t-1}+(1-\\beta_1)\\,g_t,\\qquad
        v_t=\\beta_2 v_{t-1}+(1-\\beta_2)\\,g_t^2$$
       $$\\hat m_t=\\frac{m_t}{1-\\beta_1^{\\,t}},\\qquad
        \\hat v_t=\\frac{v_t}{1-\\beta_2^{\\,t}}$$
       $$\\theta_t=\\theta_{t-1}-\\alpha\\,\\frac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon}$$`,

    whatItDoes:
      `<p>The top line builds two running averages: one of the gradient ($m_t$, the direction) and one of the
       squared gradient ($v_t$, the size). The middle line removes their start-at-zero bias. The bottom line
       takes a step against the smoothed direction, divided by the recent gradient size, so each weight moves by
       about $\\pm\\alpha$ regardless of its gradient's scale. These are exactly the lines of <b>Algorithm 1</b>
       (with defaults $\\alpha=0.001,\\ \\beta_1=0.9,\\ \\beta_2=0.999,\\ \\epsilon=10^{-8}$ printed above the box).</p>`,

    derivation:
      `<p>The general "what is an optimizer / what is momentum and an adaptive learning rate" picture is owned by
       the <code>dl-optimizers</code> concept lesson &mdash; see it for SGD, momentum, AdaGrad and RMSProp. Here
       is the one piece specific to Adam: <b>why divide by $1-\\beta_2^{\\,t}$</b> (Section 3, the bias
       correction; the first-moment case is identical).</p>
       <p>Start the average at $v_0=0$ and unroll $v_t=\\beta_2 v_{t-1}+(1-\\beta_2)g_t^2$ to a sum over all past
       gradients (the paper's eq. (1)):</p>
       $$v_t=(1-\\beta_2)\\sum_{i=1}^{t}\\beta_2^{\\,t-i}\\,g_i^2.$$
       <p>Take expectations of both sides (eqs. (2)&ndash;(4)). The paper pulls the true second moment
       $\\mathbb{E}[g_t^2]$ out of the sum, collecting any change-over-time into a residual $\\zeta$ (zeta):</p>
       $$\\mathbb{E}[v_t]=\\mathbb{E}[g_t^2]\\,(1-\\beta_2)\\sum_{i=1}^{t}\\beta_2^{\\,t-i}+\\zeta
        =\\mathbb{E}[g_t^2]\\,(1-\\beta_2^{\\,t})+\\zeta.$$
       <p>Here $\\zeta=0$ if the true second moment is <b>stationary</b> (does not change with time); otherwise
       $\\zeta$ stays small because the moving average gives tiny weight to gradients far in the past. The
       geometric sum $(1-\\beta_2)\\sum_{i=1}^{t}\\beta_2^{\\,t-i}=1-\\beta_2^{\\,t}$ is the only leftover factor. So
       the raw average $v_t$ underestimates the true $\\mathbb{E}[g_t^2]$ by exactly $1-\\beta_2^{\\,t}$. Dividing by
       it &mdash; i.e. $\\hat v_t=v_t/(1-\\beta_2^{\\,t})$ &mdash; removes the bias. This matters most early on
       ($\\beta_2^{\\,t}$ is still near 1, so the factor is tiny) and especially when $\\beta_2$ is close to 1
       (needed for sparse gradients); the paper notes that without it those early steps would be far too large.</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; one Adam step on a single weight, paper defaults
       ($\\alpha=0.001,\\ \\beta_1=0.9,\\ \\beta_2=0.999,\\ \\epsilon=10^{-8}$), starting from $\\theta_0=0$ with
       gradient $g_1=0.1$ at $t=1$:</p>
       <ul>
         <li>First moment: $m_1=0.9\\cdot 0 + 0.1\\cdot 0.1 = 0.01$.</li>
         <li>Second moment: $v_1=0.999\\cdot 0 + 0.001\\cdot(0.1)^2 = 0.001\\cdot 0.01 = 1\\times10^{-5}$.</li>
         <li>Bias-correct (at $t=1$): $\\hat m_1 = 0.01/(1-0.9) = 0.01/0.1 = 0.1$;
         $\\hat v_1 = 10^{-5}/(1-0.999) = 10^{-5}/0.001 = 0.01$.</li>
         <li>Step: $\\alpha\\cdot \\hat m_1/(\\sqrt{\\hat v_1}+\\epsilon)
         = 0.001\\cdot 0.1/(\\sqrt{0.01}+10^{-8}) = 0.001\\cdot 0.1/0.1 = 0.001$.</li>
         <li>Update: $\\theta_1 = 0 - 0.001 = -0.001$.</li>
       </ul>
       <p>Notice $\\hat m_1/\\sqrt{\\hat v_1}=0.1/0.1=1$, so the first step is exactly $-\\alpha=-0.001$. That is
       Adam's signature: after bias correction the very first step is about $\\pm\\alpha$ no matter the gradient's
       magnitude. The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>Algorithm 1 (Adam), as numbered steps</b> &mdash; initialize $m_0=0$, $v_0=0$, $t=0$, then each
       update:</p>
       <ol>
         <li>$t \\leftarrow t+1$; get the gradient $g_t$ at the current parameters.</li>
         <li>Update the biased first moment: $m_t=\\beta_1 m_{t-1}+(1-\\beta_1)g_t$.</li>
         <li>Update the biased second raw moment: $v_t=\\beta_2 v_{t-1}+(1-\\beta_2)g_t^2$.</li>
         <li>Bias-correct the first moment: $\\hat m_t=m_t/(1-\\beta_1^{\\,t})$.</li>
         <li>Bias-correct the second moment: $\\hat v_t=v_t/(1-\\beta_2^{\\,t})$.</li>
         <li>Update parameters: $\\theta_t=\\theta_{t-1}-\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$.</li>
       </ol>`,

    results:
      `<p>Quoted from the abstract: Adam is "an algorithm for first-order gradient-based optimization of
       stochastic objective functions, based on adaptive estimates of lower-order moments," that is
       "computationally efficient, has little memory requirements," and is "well suited for problems that are
       large in terms of data and/or parameters." The paper also proves a regret bound "comparable to the best
       known results under the online convex optimization framework" (abstract; Section 4 gives the
       $O(\\sqrt{T})$ bound). (Source: arXiv:1412.6980, ICLR 2015.) The CODEVIZ numbers below are our own small
       run, not the paper's reported results.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>torch.optim.Adam</code> in one line. Here you
       <b>build it from scratch</b> with raw tensors: the two moving averages, the bias correction, and the
       per-parameter update &mdash; all under <code>torch.no_grad()</code> so the optimizer's own arithmetic is
       not tracked by autograd. The payoff is the
       <code>torch.allclose(my_weights, adam_weights)</code> check after several optimization steps &mdash; if it
       passes, your update is provably identical to PyTorch's. You still let autograd compute the gradients
       (<code>.backward()</code>); only the optimizer is hand-built.</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting bias correction.</b> Skip the $1/(1-\\beta^{\\,t})$ factors and the first steps are far
         too small (especially with $\\beta_2=0.999$). This is the most common mismatch versus
         <code>torch.optim.Adam</code> and will break the allclose.</li>
         <li><b>$\\epsilon$ inside vs outside the square root.</b> PyTorch (and Algorithm 1) add $\\epsilon$ to
         $\\sqrt{\\hat v_t}$: $\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$. Some texts write $\\hat m_t/\\sqrt{\\hat v_t+\\epsilon}$.
         Match PyTorch's placement or the allclose fails.</li>
         <li><b>Not stepping under <code>torch.no_grad()</code>.</b> If the parameter update is recorded by
         autograd you corrupt the graph and leak memory. Wrap <code>step()</code> in <code>no_grad</code> and use
         in-place updates.</li>
         <li><b>Forgetting <code>zero_grad()</code>.</b> PyTorch <i>accumulates</i> gradients; if you do not zero
         them each step, $g_t$ is wrong and so is every moment.</li>
         <li><b>Adam $\\ne$ SGD with weight decay.</b> Adding L2 weight decay <i>inside</i> the gradient interacts
         with the per-parameter scaling; decoupling it is exactly the fix in the AdamW paper. Do not assume plain
         Adam + L2 behaves like SGD + L2.</li>
       </ul>`,

    recall: [
      "State Adam's update from memory: the two moving averages $m_t,v_t$, the two bias corrections, and $\\theta_t=\\theta_{t-1}-\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$.",
      "Define $\\hat m_t$ and $\\hat v_t$ and say why the division by $1-\\beta^{\\,t}$ is there.",
      "What are the paper's default values for $\\alpha,\\beta_1,\\beta_2,\\epsilon$?",
      "Why is Adam's very first step (after bias correction) about $\\pm\\alpha$ regardless of the gradient's size?"
    ],

    practice: [
      {
        q: `Do one Adam step with paper defaults from $\\theta_0=0$ but a much larger gradient $g_1=10$ at $t=1$. How big is the step, and what does that tell you?`,
        steps: [
          { do: `First moment: $m_1=(1-0.9)\\cdot 10 = 1.0$.`, why: `Smoothed gradient.` },
          { do: `Second moment: $v_1=(1-0.999)\\cdot 10^2 = 0.001\\cdot 100 = 0.1$.`, why: `Average squared gradient.` },
          { do: `Bias-correct: $\\hat m_1=1.0/0.1=10$, $\\hat v_1=0.1/0.001=100$.`, why: `Undo zero-init bias at $t=1$.` },
          { do: `Step: $0.001\\cdot 10/(\\sqrt{100}+\\epsilon)=0.001\\cdot 10/10=0.001$. New $\\theta_1=-0.001$.`, why: `Direction over size.` }
        ],
        answer: `The step is again $-0.001=-\\alpha$, identical to the $g_1=0.1$ case. Because Adam divides the smoothed gradient by its own recent magnitude, the first step is $\\pm\\alpha$ whether the gradient is 0.1 or 10. This scale-invariance is why one learning rate works across very different weights.`
      },
      {
        q: `Why does Adam typically beat plain SGD on a badly-conditioned problem (some directions much steeper than others)?`,
        steps: [
          { do: `On steep directions $g^2$ is large, so $\\sqrt{\\hat v}$ is large and the step there shrinks.`, why: `Prevents overshoot/oscillation in steep directions.` },
          { do: `On flat directions $g^2$ is small, so $\\sqrt{\\hat v}$ is small and the step there grows.`, why: `Makes progress where SGD would crawl.` },
          { do: `SGD must use one global rate that is safe for the steepest direction, so it crawls in the flat ones.`, why: `Single rate is a compromise.` }
        ],
        answer: `Adam normalizes each weight's step by that weight's recent gradient size, so it can take large steps in flat directions and small steps in steep ones simultaneously. Plain SGD, with one rate, must keep that rate small enough for the steepest direction and therefore crawls in the flat ones. In our CODEVIZ run Adam reaches loss ~0.0019 vs SGD's ~0.11 in 60 steps.`
      },
      {
        q: `Ablation: in the CODE, remove the bias correction (use $m_t,v_t$ directly instead of $\\hat m_t,\\hat v_t$) and rerun the allclose against torch.optim.Adam. What happens, and why?`,
        steps: [
          { do: `Replace $\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$ with $m_t/(\\sqrt{v_t}+\\epsilon)$.`, why: `Drops the $1/(1-\\beta^{\\,t})$ factors.` },
          { do: `Run the same 6 steps and call $\\texttt{torch.allclose}$.`, why: `PyTorch keeps the correction.` },
          { do: `Inspect the first step's size.`, why: `Early steps are where the bias is largest.` }
        ],
        answer: `The allclose now returns False. Without correction, at small $t$ the moments are biased toward zero — but $\\hat v_t$ would have been divided by the tiny $1-\\beta_2^{\\,t}$, so dropping it makes the denominator $\\sqrt{v_t}$ far too small early on, giving much larger early steps than PyTorch. The mismatch is largest at step 1 and shrinks as $t$ grows (the correction factor approaches 1). This confirms the bias correction is essential to match Adam exactly.`
      }
    ]
  });

  window.CODE["paper-adam"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the Adam optimizer from scratch with raw torch: per-parameter first moment m, second moment v, ` +
      `bias correction, and the update — all under torch.no_grad(). Then prove it is identical to PyTorch by ` +
      `running 6 optimization steps with both MyAdam and torch.optim.Adam from the SAME start and checking ` +
      `torch.allclose. Finally recompute the one-step worked example. Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn as nn

torch.manual_seed(0)

class MyAdam:
    """Adam from scratch — Algorithm 1 of Kingma & Ba (2014)."""
    def __init__(self, params, lr=1e-3, beta1=0.9, beta2=0.999, eps=1e-8):
        self.params = list(params)
        self.lr, self.b1, self.b2, self.eps = lr, beta1, beta2, eps
        self.m = [torch.zeros_like(p) for p in self.params]   # 1st moment (init 0)
        self.v = [torch.zeros_like(p) for p in self.params]   # 2nd moment (init 0)
        self.t = 0

    @torch.no_grad()
    def step(self):
        self.t += 1                                           # t <- t + 1
        for i, p in enumerate(self.params):
            g = p.grad
            self.m[i] = self.b1*self.m[i] + (1-self.b1)*g     # m_t  (Alg.1 line: biased 1st moment)
            self.v[i] = self.b2*self.v[i] + (1-self.b2)*g*g   # v_t  (biased 2nd raw moment)
            mhat = self.m[i] / (1 - self.b1**self.t)          # bias-corrected 1st moment
            vhat = self.v[i] / (1 - self.b2**self.t)          # bias-corrected 2nd moment
            p -= self.lr * mhat / (vhat.sqrt() + self.eps)    # theta update (eps OUTSIDE sqrt)

    def zero_grad(self):
        for p in self.params:
            if p.grad is not None:
                p.grad.zero_()

# ---- THE ORACLE: MyAdam must equal torch.optim.Adam over several steps ----
w_mine = torch.randn(5, 3, requires_grad=True)
w_ref  = w_mine.detach().clone().requires_grad_(True)        # identical start
opt_mine = MyAdam([w_mine], lr=1e-2)
opt_ref  = torch.optim.Adam([w_ref], lr=1e-2)               # same default betas=(0.9,0.999), eps=1e-8

X = torch.randn(20, 5); target = torch.randn(20, 3)
for _ in range(6):
    opt_mine.zero_grad()
    (((X @ w_mine) - target)**2).mean().backward(); opt_mine.step()
    opt_ref.zero_grad()
    (((X @ w_ref) - target)**2).mean().backward(); opt_ref.step()

print("allclose vs torch.optim.Adam after 6 steps:",
      torch.allclose(w_mine, w_ref, atol=1e-7))            # expect True
print("max abs diff:", (w_mine - w_ref).abs().max().item())  # ~7e-9

# ---- recompute the one-step worked example: theta0=0, g=0.1, t=1, defaults ----
th = torch.zeros(1, requires_grad=False)
o = MyAdam([th], lr=0.001)            # alpha=0.001, b1=0.9, b2=0.999, eps=1e-8
th.grad = torch.tensor([0.1])
o.step()
print("worked example: m1=0.01, v1=1e-5, mhat=0.1, vhat=0.01, step=-0.001")
print("MyAdam new theta:", round(th.item(), 8))            # -0.001`
  };

  window.CODEVIZ["paper-adam"] = {
    question: "Minimize the same small, badly-conditioned least-squares loss from the same start with plain SGD vs Adam (each at a sensible learning rate) — does Adam's per-parameter step reach a much lower loss in the same number of steps?",
    charts: [
      {
        type: "line",
        title: "Training loss over steps: Adam vs plain SGD (same ill-conditioned problem, same start)",
        xlabel: "optimization step",
        ylabel: "loss (½ mean squared error)",
        series: [
          {
            name: "Adam (lr 0.1)",
            color: "#7ee787",
            points: [[0,16.5076],[3,9.8237],[6,5.0428],[9,2.0115],[12,0.4622],[15,0.012],[18,0.2118],[21,0.5529],[24,0.7414],[27,0.6745],[30,0.452],[33,0.2126],[36,0.0546],[39,0.0029],[42,0.0212],[45,0.0583],[48,0.0737],[51,0.0603],[54,0.0321],[57,0.0095],[59,0.0019]]
          },
          {
            name: "SGD (lr 0.04)",
            color: "#ff7b72",
            points: [[0,16.5076],[3,1.7342],[6,0.7277],[9,0.4069],[12,0.2889],[15,0.2401],[18,0.2158],[21,0.2006],[24,0.1891],[27,0.1794],[30,0.1707],[33,0.1628],[36,0.1555],[39,0.1488],[42,0.1424],[45,0.1365],[48,0.1309],[51,0.1257],[54,0.1207],[57,0.1161],[59,0.1131]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not the paper's reported numbers. Same toy least-squares problem with six input features scaled unevenly (×4 down to ×0.25) so it is badly conditioned (condition number ~277). SGD must keep its single learning rate small enough for the steepest direction, so it crawls in the flat ones and stalls near loss ~0.11. Adam scales each weight's step by that weight's own recent gradient size, so it drives the loss far lower — final ~0.0019, about 60× lower in the same 60 steps. The bump around steps 18–30 is Adam mildly overshooting on this conditioning before settling, which is honest Adam behavior, not a bug.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# tiny ill-conditioned least-squares: features scaled unevenly -> one SGD lr struggles
N, D = 200, 6
scales = np.array([4.0, 3.0, 2.0, 1.0, 0.5, 0.25])
X = rng.normal(0, 1, (N, D)) * scales
w_true = rng.normal(0, 1, D)
y = X @ w_true + rng.normal(0, 0.01, N)

def loss_grad(w):
    r = X @ w - y
    return 0.5*np.mean(r**2), (X.T @ r)/N

def run_sgd(lr, steps=60):
    w = np.zeros(D); out = []
    for _ in range(steps):
        L, g = loss_grad(w); out.append(L); w -= lr*g
    return out

def run_adam(lr, steps=60, b1=0.9, b2=0.999, eps=1e-8):
    w = np.zeros(D); m = np.zeros(D); v = np.zeros(D); out = []
    for t in range(1, steps+1):
        L, g = loss_grad(w); out.append(L)
        m = b1*m + (1-b1)*g                 # first moment
        v = b2*v + (1-b2)*g*g               # second moment
        mh = m/(1-b1**t); vh = v/(1-b2**t)  # bias correction
        w -= lr*mh/(np.sqrt(vh)+eps)        # per-parameter update
    return out

sgd  = run_sgd(lr=0.04)
adam = run_adam(lr=0.1)
print("SGD  final loss:", round(sgd[-1], 4))    # ~0.1131
print("Adam final loss:", round(adam[-1], 4))   # ~0.0019`
  };
})();
