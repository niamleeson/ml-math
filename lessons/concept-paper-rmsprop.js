/* Paper lesson — RMSProp (Tieleman & Hinton, 2012).
   Grounded from the canonical source: Geoffrey Hinton's Coursera "Neural Networks for Machine
   Learning", Lecture 6 ("Overview of mini-batch gradient descent"), slides 6c–6e
   (cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf). RMSProp is unpublished; these
   lecture slides are the citable origin. Authors on the title slide: Geoffrey Hinton, with Nitish
   Srivastava and Kevin Swersky; slide 6e attributes the method to "Tijmen Tieleman, unpublished".
   Track A (primitive): build RMSProp from scratch with raw torch, verify with torch.allclose vs
   torch.optim.RMSprop over several steps. Self-contained: lesson + CODE + CODEVIZ merged by id
   "paper-rmsprop". */
(function () {
  window.LESSONS.push({
    id: "paper-rmsprop",
    title: "RMSProp — Divide the gradient by a running average of its recent magnitude (2012)",
    tagline: "Keep a moving average of each weight's squared gradient and step by the gradient over its square root — so the step stays a healthy size instead of decaying to zero like AdaGrad's.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Tijmen Tieleman, Geoffrey Hinton",
      org: "University of Toronto",
      year: 2012,
      venue: "Coursera \"Neural Networks for Machine Learning\", Lecture 6e (unpublished)",
      citations: "",
      arxiv: "",
      url: "https://www.cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf",
      code: ""
    },

    conceptLink: "dl-optimizers",
    partOf: [],
    prereqs: ["dl-optimizers", "dl-backprop", "pt-autograd", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Training a network means repeatedly nudging its weights downhill on a loss
       function. Plain <b>stochastic gradient descent (SGD)</b> &mdash; "stochastic" because the gradient
       is estimated from a small random <b>mini-batch</b> of data, not the whole dataset &mdash; takes the
       same-sized step on every weight: <code>weight = weight - learning_rate * gradient</code>. ("Gradient"
       = the slope of the loss with respect to a weight: the direction and steepness of downhill.)</p>
       <p><b>What was broken.</b> The lecture (slide "rprop: Using only the sign of the gradient") notes that
       "the magnitude of the gradient can be very different for different weights and can change during
       learning," which "makes it hard to choose a single global learning rate." Two earlier ideas tried to
       fix this:</p>
       <ul>
         <li><b>rprop</b> (resilient backpropagation) uses <i>only the sign</i> of the gradient and adapts a
         separate step size per weight. It works for <b>full-batch</b> training but, as the lecture's slide
         "Why rprop does not work with mini-batches" explains, it breaks with mini-batches: a weight that sees
         gradients <code>+0.1</code> nine times and <code>-0.9</code> once should stay put (the gradients
         average to zero), but rprop would increment it nine times and decrement once by about the same
         amount, so "the weight would grow a lot."</li>
         <li><b>AdaGrad</b> divides each weight's step by the square root of the <i>sum of all past squared
         gradients</i>. That sum only grows, so the effective step <i>shrinks monotonically toward zero</i> and
         training can stall before reaching the minimum.</li>
       </ul>`,

    contribution:
      `<p>RMSProp ("root mean square propagation") is, in the lecture's words, "a mini-batch version of rprop."
       It is presented on slide 6e and attributed to "Tijmen Tieleman, unpublished." Its contribution:</p>
       <ul>
         <li><b>An exponential moving average of the squared gradient.</b> Instead of summing all past squared
         gradients forever (AdaGrad), keep a <i>decaying</i> average that forgets the distant past. The slide
         writes it as $\\text{MeanSquare}(w,t)=0.9\\,\\text{MeanSquare}(w,t{-}1)+0.1\\,(\\partial E/\\partial w\\,(t))^2$.</li>
         <li><b>Divide the gradient by its root mean square.</b> The slide states: "Dividing the gradient by
         $\\sqrt{\\text{MeanSquare}(w,t)}$ makes the learning work much better." Because the average is a
         <i>bounded</i> running quantity (not an ever-growing sum), the denominator does not blow up, so the
         step stays a healthy size and keeps making progress where AdaGrad's would vanish.</li>
       </ul>`,

    whyItMattered:
      `<p>RMSProp became one of the most-used optimizers in deep learning despite never being formally
       published &mdash; it was cited for years as "Tieleman &amp; Hinton, 2012, Coursera lecture 6e." It was
       especially popular for <b>recurrent networks</b>, where AdaGrad's vanishing step was a real problem on
       long training runs. It is also a direct ancestor of <b>Adam</b>: Adam is essentially RMSProp's
       moving-average-of-squared-gradients combined with momentum and a bias correction. Understanding RMSProp
       is the cleanest way to understand the "divide by recent gradient size" half of Adam.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>The source is a set of lecture slides, not a paper. Read the relevant slides of Lecture 6 in order
       &mdash; the story builds:</p>
       <ul>
         <li><b>"rprop: Using only the sign of the gradient"</b> &mdash; the idea RMSProp is a mini-batch
         version of: adapt a per-weight step size; increase it (e.g. ×1.2) when the last two gradient signs
         agree, decrease it (e.g. ×0.5) otherwise.</li>
         <li><b>"Why rprop does not work with mini-batches"</b> &mdash; the +0.1×9, −0.9×1 example showing rprop
         fails to average gradients across mini-batches.</li>
         <li><b>"rmsprop: A mini-batch version of rprop"</b> (slide 6e) &mdash; the whole method in two lines:
         the MeanSquare moving average and "divide the gradient by $\\sqrt{\\text{MeanSquare}}$." This is the
         slide to transcribe.</li>
       </ul>
       <p><b>Skim:</b> "Further developments of rmsprop" (combining with momentum / Nesterov) and the closing
       "Summary of learning methods for neural networks" &mdash; useful context, not needed to implement the
       core update.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will minimize the same convex least-squares loss from the same start
       for a long run (120 steps), once with <b>AdaGrad</b> and once with <b>RMSProp</b>. AdaGrad divides by
       the square root of the <i>sum</i> of all past squared gradients; RMSProp divides by the square root of a
       <i>decaying average</i>. Which optimizer's per-step movement shrinks toward zero and stalls short of the
       minimum, and which keeps a roughly steady step and keeps lowering the loss? Write down your guess, then
       check the CODEVIZ charts.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write a <code>MyRMSprop</code> optimizer over a list of parameter
       tensors, using only raw torch (no <code>torch.optim</code>). Keep one piece of per-parameter state
       <code>s</code> (the MeanSquare, starting at zeros). In <code>step()</code>, for each parameter
       <code>p</code> with gradient <code>g = p.grad</code>:</p>
       <ul>
         <li><code># TODO: s = rho*s + (1-rho)*g*g</code> &mdash; the exponential moving average of the squared
         gradient (the slide's MeanSquare, with $\\rho=0.9$).</li>
         <li><code># TODO: p -= lr * g / (sqrt(s) + eps)</code> &mdash; divide the gradient by the root mean
         square, then step. Do it under <code>torch.no_grad()</code>. (<code>eps</code> is a tiny constant that
         only prevents division by zero.)</li>
       </ul>
       <p>The CODE cell below is the full reference, including the <code>torch.allclose</code> check against
       <code>torch.optim.RMSprop</code> &mdash; that passing check is the proof your formula is exactly
       PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>RMSProp processes each weight independently. For one weight, at step $t$, with current gradient
       $g_t$:</p>
       <ol>
         <li><b>Update the MeanSquare (moving average of the squared gradient).</b> Blend the new squared
         gradient into a decaying running average:
         $s_t = \\rho\\,s_{t-1} + (1-\\rho)\\,g_t^2$. The slide uses $\\rho=0.9$, i.e.
         $\\text{MeanSquare}(w,t)=0.9\\,\\text{MeanSquare}(w,t{-}1)+0.1\\,g_t^2$. This is a per-weight measure
         of how <i>large</i> this weight's gradients have recently been. Because old terms are multiplied by
         $\\rho$ again every step, their influence decays away &mdash; the average is <b>bounded</b>, it does
         not grow without limit.</li>
         <li><b>Divide the gradient by the root mean square, then step.</b>
         $\\theta_t = \\theta_{t-1} - \\dfrac{\\alpha}{\\sqrt{s_t}+\\epsilon}\\,g_t$. The slide's phrasing:
         "Dividing the gradient by $\\sqrt{\\text{MeanSquare}(w,t)}$ makes the learning work much better." The
         tiny $\\epsilon$ ("epsilon") only prevents division by zero.</li>
       </ol>
       <p><b>Why this fixes AdaGrad.</b> AdaGrad uses $G_t=\\sum_{i\\le t} g_i^2$ &mdash; a sum that only grows,
       so $\\alpha/\\sqrt{G_t}$ shrinks toward zero and the optimizer can freeze before reaching the minimum.
       RMSProp replaces that ever-growing sum with the <i>decaying</i> average $s_t$, which settles to roughly
       the recent mean of $g^2$ rather than climbing forever. So the denominator stops growing, the step stays
       a healthy size, and the optimizer keeps making progress. That is the whole point of the lecture's
       "mini-batch version of rprop": it averages gradients (so it survives mini-batch noise, unlike rprop) and
       it forgets the past (so the step does not vanish, unlike AdaGrad).</p>`,

    architecture:
      `<p>RMSProp is an <b>optimizer</b>, so its "architecture" is a per-iteration procedure, applied
       <i>element-wise and independently</i> to every parameter. State and data flow per update step $t$:</p>
       <ul>
         <li><b>Persistent state (one tensor per parameter, same shape as the parameter).</b> The MeanSquare
         buffer $s$, initialized to all zeros. This is the only extra memory RMSProp keeps &mdash; it is what
         makes RMSProp a <i>stateful</i> optimizer, unlike plain SGD which keeps no state. (Compare: AdaGrad
         keeps one accumulator $G$; Adam keeps two, a first- and second-moment buffer.)</li>
         <li><b>Inputs to each step.</b> The current gradient $g_t = \\partial E/\\partial \\theta$ (computed
         upstream by backprop / autograd), plus the hyperparameters $\\rho$ (decay), $\\alpha$ (learning rate),
         $\\epsilon$ (stabilizer).</li>
         <li><b>Stage 1 &mdash; accumulate.</b> $s \\leftarrow \\rho\\,s + (1-\\rho)\\,g_t^2$. Element-wise square,
         element-wise blend into the buffer. No cross-parameter interaction; no matrix operations.</li>
         <li><b>Stage 2 &mdash; normalize.</b> Form the per-element denominator $\\sqrt{s}+\\epsilon$ (element-wise
         square root), then the normalized direction $g_t / (\\sqrt{s}+\\epsilon)$.</li>
         <li><b>Stage 3 &mdash; step.</b> $\\theta \\leftarrow \\theta - \\alpha\\,g_t/(\\sqrt{s}+\\epsilon)$,
         an in-place update done under <code>torch.no_grad()</code> so the optimizer's own arithmetic is not
         tracked by autograd.</li>
       </ul>
       <p><b>Data flow across steps:</b> loss &rarr; backward() produces $g_t$ &rarr; Stage 1 folds $g_t^2$ into
       $s$ &rarr; Stages 2&ndash;3 use the updated $s$ to scale $g_t$ and move $\\theta$ &rarr; zero the
       gradients &rarr; repeat. Because $s$ carries forward, each step's denominator reflects a running window
       of recent gradient magnitudes rather than just the current one. There are no layers, no learnable
       weights inside the optimizer, and no bias-correction term (unlike Adam).</p>`,

    symbols: [
      { sym: "$t$", desc: "the timestep / update counter, incremented by one on each update." },
      { sym: "$\\theta_t$", desc: "theta: the parameter (weight) vector after the update at step $t$. $\\theta_{t-1}$ is its value before this step." },
      { sym: "$g_t$", desc: "the gradient at step $t$: the slope of the (mini-batch) loss with respect to each parameter. $g_t^2$ means each element squared (always non-negative)." },
      { sym: "$s_t$", desc: "the MeanSquare: an exponential moving average of the squared gradient $g_t^2$. The slide writes it $\\text{MeanSquare}(w,t)$. A per-parameter measure of recent gradient size." },
      { sym: "$\\rho$", desc: "rho: the decay rate of the moving average, in $[0,1)$. The slide uses 0.9 (so the new squared gradient gets weight $1-\\rho=0.1$). Closer to 1 means a longer memory. PyTorch calls this argument $\\texttt{alpha}$ and defaults it to 0.99." },
      { sym: "$\\alpha$", desc: "alpha: the learning rate / step size (PyTorch default 0.01). It sets the overall scale of each step. (Note: PyTorch reuses the name \"alpha\" for $\\rho$ above; here $\\alpha$ means the learning rate, matching the $\\texttt{lr}$ argument.)" },
      { sym: "$\\epsilon$", desc: "epsilon: a tiny constant (PyTorch default $10^{-8}$) added to $\\sqrt{s_t}$ so we never divide by zero when recent gradients are near zero." },
      { sym: "$\\sqrt{s_t}$ (RMS)", desc: "the root mean square of the recent gradients: the square root of the MeanSquare. \"RMS\" in \"RMSProp\" refers to exactly this quantity." },
      { sym: "MeanSquare", desc: "the lecture's name for the moving average of the squared gradient — the same quantity as $s_t$." },
      { sym: "exponential moving average", desc: "a running average that weights recent values more than old ones: new = decay·old + (1−decay)·current." },
      { sym: "rprop", desc: "resilient backpropagation: an earlier method that uses only the sign of the gradient and adapts a per-weight step size. RMSProp is described as its mini-batch version." },
      { sym: "AdaGrad", desc: "an earlier adaptive method that divides each step by the square root of the SUM of all past squared gradients; that sum grows forever, so its step decays to zero." }
    ],

    formula:
      `$$\\text{MeanSquare}(w,t)=0.9\\,\\text{MeanSquare}(w,t{-}1)+0.1\\left(\\frac{\\partial E}{\\partial w}(t)\\right)^2$$
       <p>Slide 6e, verbatim &mdash; the moving average of the squared gradient. In this lesson's
       notation $s_t = \\rho\\,s_{t-1} + (1-\\rho)\\,g_t^2$ with $\\rho=0.9$ (so the new squared gradient
       gets weight $1-\\rho=0.1$).</p>
       $$\\theta_t = \\theta_{t-1} - \\frac{\\alpha}{\\sqrt{s_t}+\\epsilon}\\,g_t$$
       <p>The parameter step (slide 6e in words: "Dividing the gradient by $\\sqrt{\\text{MeanSquare}(w,t)}$
       makes the learning work much better"). $\\epsilon$ is outside the square root, matching
       $\\texttt{torch.optim.RMSprop}$.</p>
       $$G_t = G_{t-1} + g_t^2,\\qquad \\theta_t = \\theta_{t-1} - \\frac{\\alpha}{\\sqrt{G_t}+\\epsilon}\\,g_t
         \\qquad\\text{(AdaGrad, for contrast)}$$
       <p>AdaGrad's accumulator $G_t$ is an <b>unbounded sum</b> of all past squared gradients &mdash; it only
       grows, so $\\alpha/\\sqrt{G_t}\\to 0$ and the step vanishes. RMSProp's single change is replacing this
       sum with the <b>bounded decaying average</b> $s_t$ above. (AdaGrad is shown for contrast; it is not in
       Hinton's slides, which only cover rprop and rmsprop.)</p>
       $$\\Delta w_{ij} = -\\,\\varepsilon\\,g_{ij}\\,\\frac{\\partial E}{\\partial w_{ij}},\\qquad
         g_{ij}(t)=\\begin{cases} g_{ij}(t{-}1)+0.05 & \\text{if }\\tfrac{\\partial E}{\\partial w_{ij}}(t)\\,\\tfrac{\\partial E}{\\partial w_{ij}}(t{-}1)\\gt 0\\\\[2pt] g_{ij}(t{-}1)\\times 0.95 & \\text{otherwise}\\end{cases}$$
       <p>Slide 6d, the per-connection adaptive-gain rule RMSProp's lineage builds on: a local gain $g_{ij}$
       (start 1) grows additively when consecutive gradient signs agree, shrinks multiplicatively when they
       disagree. rprop (slide 6d) is the same idea using only the gradient's sign, multiplying the step by
       1.2 (signs agree) or 0.5 (disagree), with step sizes clamped between a millionth and 50. RMSProp is
       "a mini-batch version of rprop" that achieves this robustness via the bounded average $s_t$ instead.</p>`,

    whatItDoes:
      `<p>The top line keeps a decaying running average $s_t$ of each weight's squared gradient &mdash; the
       lecture's MeanSquare, with $\\rho=0.9$ so the freshest squared gradient gets weight $0.1$. The bottom
       line takes a step against the raw gradient $g_t$, but scaled down by the recent gradient magnitude
       $\\sqrt{s_t}$. Weights with large recent gradients get a smaller step; weights with small recent
       gradients get a larger step. Because $s_t$ is a bounded average rather than a growing sum, the step
       never decays to zero the way AdaGrad's does.</p>`,

    derivation:
      `<p>The general "what is an optimizer / what is an adaptive learning rate" picture is owned by the
       <code>dl-optimizers</code> concept lesson &mdash; see it for SGD, momentum, AdaGrad and RMSProp. Here is
       the one piece specific to RMSProp: <b>why a moving average stays bounded but AdaGrad's sum does not.</b></p>
       <p>AdaGrad accumulates $G_t=\\sum_{i=1}^{t} g_i^2$. If gradients have a roughly steady size with
       $\\mathbb{E}[g^2]=c\\gt 0$, then $G_t\\approx c\\,t$ grows without bound, so AdaGrad's per-step factor
       $\\alpha/\\sqrt{G_t}\\approx \\alpha/\\sqrt{c\\,t}\\to 0$. The step shrinks like $1/\\sqrt{t}$ and the
       optimizer can stall before reaching the minimum.</p>
       <p>RMSProp instead unrolls the moving average from $s_0=0$:</p>
       $$s_t=(1-\\rho)\\sum_{i=1}^{t}\\rho^{\\,t-i}\\,g_i^2.$$
       <p>Take expectations with $\\mathbb{E}[g_i^2]=c$ constant and use the geometric sum
       $(1-\\rho)\\sum_{i=1}^{t}\\rho^{\\,t-i}=1-\\rho^{\\,t}$:</p>
       $$\\mathbb{E}[s_t]=c\\,(1-\\rho^{\\,t})\\;\\xrightarrow{\\;t\\to\\infty\\;}\\;c.$$
       <p>So $s_t$ settles at roughly the recent mean squared gradient $c$ &mdash; a <b>bounded</b> quantity &mdash;
       and the step factor $\\alpha/(\\sqrt{s_t}+\\epsilon)\\approx \\alpha/\\sqrt{c}$ stays a finite, healthy
       size. That is exactly why RMSProp keeps making progress where AdaGrad's step vanishes. (Note: RMSProp,
       unlike Adam, does <i>not</i> divide by $1-\\rho^{\\,t}$ &mdash; it has no bias correction. The early steps
       are slightly biased toward being large, which the lecture does not correct.)</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; one RMSProp step on a single weight, with $\\rho=0.9$, learning rate
       $\\alpha=0.01$, $\\epsilon=10^{-8}$, starting from $\\theta_0=0$, $s_0=0$, and gradient $g_1=0.1$ at
       $t=1$. Plug into $s_1=\\rho s_0+(1-\\rho)g_1^2$ then
       $\\theta_1=\\theta_0-\\alpha g_1/(\\sqrt{s_1}+\\epsilon)$:</p>
       <ul class="steps">
         <li><b>MeanSquare.</b> $s_1 = 0.9\\cdot 0 + 0.1\\cdot(0.1)^2 = 0.1\\cdot 0.01 = 0.001$.</li>
         <li><b>Root mean square.</b> $\\sqrt{s_1} = \\sqrt{0.001} \\approx 0.0316228$; add $\\epsilon$:
         $\\sqrt{s_1}+\\epsilon \\approx 0.0316228$ (the $10^{-8}$ is negligible here).</li>
         <li><b>Scaled gradient.</b> $\\dfrac{\\alpha}{\\sqrt{s_1}+\\epsilon}\\,g_1
         = \\dfrac{0.01}{0.0316228}\\cdot 0.1 \\approx 0.316228\\cdot 0.1 \\approx 0.0316228$.</li>
         <li><b>Update.</b> $\\theta_1 = 0 - 0.0316228 = -0.0316228$.</li>
       </ul>
       <p><b>RMSProp vs plain SGD</b> on this same first step (same $\\alpha=0.01$, same $g_1$). Notice RMSProp's
       step does <i>not</i> shrink with the gradient &mdash; it is about $\\alpha/\\sqrt{1-\\rho}=0.01/\\sqrt{0.1}\\approx 0.0316$
       no matter how big $g_1$ is, because $\\sqrt{s_1}=\\sqrt{1-\\rho}\\,|g_1|$ and the gradient size cancels in
       $g_1/\\sqrt{s_1}$:</p>
       <table class="extable">
         <caption>First step taken for two gradient sizes; SGD step is $\\alpha\\,g_1$, RMSProp step is $\\alpha\\,g_1/(\\sqrt{s_1}+\\epsilon)$.</caption>
         <thead><tr><th>gradient $g_1$</th><th class="num">$s_1=0.1\\,g_1^2$</th><th class="num">$\\sqrt{s_1}$</th><th class="num">SGD step $\\alpha g_1$</th><th class="num">RMSProp step</th></tr></thead>
         <tbody>
           <tr><td class="row-h">$0.1$</td><td class="num">$0.001$</td><td class="num">$0.0316$</td><td class="num">$0.001$</td><td class="num">$0.0316$</td></tr>
           <tr><td class="row-h">$10$</td><td class="num">$10$</td><td class="num">$3.1623$</td><td class="num">$0.1$</td><td class="num">$0.0316$</td></tr>
         </tbody>
       </table>
       <p>SGD's step scales straight with the gradient ($0.001$ vs $0.1$); RMSProp's lands at $\\approx 0.0316$
       both times &mdash; that scale-normalization is the whole point. The CODE cell recomputes these exact
       numbers and prints them.</p>`,

    recipe:
      `<p><b>RMSProp, as numbered steps</b> &mdash; initialize $s_0=0$ for every parameter, then each update:</p>
       <ol>
         <li>Get the gradient $g_t$ at the current parameters.</li>
         <li>Update the MeanSquare: $s_t = \\rho\\,s_{t-1} + (1-\\rho)\\,g_t^2$.</li>
         <li>Form the root mean square denominator: $\\sqrt{s_t}+\\epsilon$.</li>
         <li>Update parameters: $\\theta_t = \\theta_{t-1} - \\alpha\\,g_t/(\\sqrt{s_t}+\\epsilon)$.</li>
       </ol>`,

    results:
      `<p>The method has no published results table &mdash; it comes from lecture slides. The citable claim is
       the slide's own statement: "Dividing the gradient by $\\sqrt{\\text{MeanSquare}(w,t)}$ makes the
       learning work much better (Tijmen Tieleman, unpublished)." The lecture also notes RMSProp can be combined
       with momentum and with Nesterov momentum ("Further developments of rmsprop"). (Source: Hinton, "Neural
       Networks for Machine Learning", Coursera, Lecture 6, slides 6c&ndash;6e,
       cs.toronto.edu/~tijmen/csc321/slides/lecture_slides_lec6.pdf.) The CODEVIZ numbers below are our own small
       run, not any reported result.</p>`,

    evaluation:
      `<p><b>The metric &amp; baseline.</b> RMSProp has no benchmark to chase &mdash; the slide makes no
       numeric claim. So "working" is defined two ways: (1) <b>exactness</b> &mdash; your hand-built
       update must equal $\\texttt{torch.optim.RMSprop}$ to floating-point tolerance
       ($\\texttt{torch.allclose}$, atol $\\approx 10^{-7}$); and (2) <b>optimization progress</b> &mdash;
       on the convex least-squares problem the loss must fall monotonically and end <i>below</i> the
       AdaGrad baseline that stalls. In our run AdaGrad freezes near loss $\\approx 17.5$ while RMSProp
       reaches $\\approx 7.2$ in the same 120 steps (our numbers, not the slide's).</p>
       <ul>
         <li><b>Sanity checks before the full run.</b> Reproduce the worked one-step example exactly:
         from $\\theta_0=0$, $s_0=0$, $g_1=0.1$, $\\rho=0.9$, $\\alpha=0.01$ you must get
         $s_1=0.001$ and $\\theta_1\\approx -0.0316228$ &mdash; a known-answer unit test. Check the
         scale-cancellation invariant: on the <i>first</i> step the update size is about
         $\\alpha/\\sqrt{1-\\rho}\\approx 0.0316$ <i>regardless</i> of the gradient's magnitude (try
         $g_1=0.1$ and $g_1=10$ &mdash; same step). Confirm $s$ has the same shape as each parameter and
         starts at all zeros.</li>
         <li><b>Expected range.</b> The only "paper" target is the $\\texttt{allclose}$ pass (max abs
         diff $\\sim 0$, expect $\\texttt{True}$); that is binary, not approximate. For the optimization
         demo, a correct build keeps a roughly flat step length ($\\approx 0.02$ in our run) and a
         steadily falling loss; if your step length decays like $1/\\sqrt{t}$ toward zero you have built
         AdaGrad, not RMSProp (rule of thumb, our run &mdash; not a slide claim).</li>
         <li><b>Ablation &mdash; prove the moving average earns its keep.</b> The central idea is the
         <i>decaying</i> average. Replace $s_t=\\rho s_{t-1}+(1-\\rho)g_t^2$ with AdaGrad's running
         <i>sum</i> $G_t=G_{t-1}+g_t^2$ and keep everything else fixed: $\\texttt{allclose}$ vs
         $\\texttt{torch.optim.RMSprop}$ must flip to $\\texttt{False}$, the step size must start
         shrinking, and the demo loss must stall higher. If turning the average off does <i>not</i> hurt,
         the $\\rho$ blend is not actually wired in.</li>
         <li><b>Failure signals &amp; what they mean.</b> $\\texttt{allclose}$ False with a tiny diff &rarr;
         usually $\\epsilon$ placed <i>inside</i> the sqrt ($\\sqrt{s+\\epsilon}$) instead of outside, or
         PyTorch's $\\texttt{alpha}$ (decay) left at its 0.99 default when you used $\\rho=0.9$. Loss
         increasing or NaN &rarr; learning rate too high, or you forgot to step under
         $\\texttt{torch.no_grad()}$ and corrupted the graph. Step length collapsing to zero over time
         &rarr; you accumulated a sum, not an average (the AdaGrad bug). $s$ stuck at zero / wrong values
         &rarr; missing $\\texttt{zero\\_grad()}$, so gradients accumulate across steps and $g_t$ is
         wrong.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>torch.optim.RMSprop</code> in one line. Here
       you <b>build it from scratch</b> with raw tensors: the one moving average $s$ and the divide-and-step
       update &mdash; all under <code>torch.no_grad()</code> so the optimizer's own arithmetic is not tracked by
       autograd. The payoff is the <code>torch.allclose(my_weights, rmsprop_weights)</code> check after several
       optimization steps &mdash; if it passes, your update is provably identical to PyTorch's. You still let
       autograd compute the gradients (<code>.backward()</code>); only the optimizer is hand-built.</p>`,

    pitfalls:
      `<ul>
         <li><b>$\\epsilon$ inside vs outside the square root.</b> PyTorch's <code>torch.optim.RMSprop</code>
         adds $\\epsilon$ to $\\sqrt{s_t}$: $g_t/(\\sqrt{s_t}+\\epsilon)$. Some texts write
         $g_t/\\sqrt{s_t+\\epsilon}$. Match PyTorch's placement (epsilon OUTSIDE the sqrt) or the allclose
         fails.</li>
         <li><b>Mind the two meanings of "alpha".</b> In the lecture and in this lesson $\\rho$ is the decay
         rate and $\\alpha$ is the learning rate. PyTorch instead names the <i>decay</i> argument
         <code>alpha</code> (default 0.99) and the learning rate <code>lr</code> (default 0.01). Set
         <code>alpha=rho</code> when comparing.</li>
         <li><b>No bias correction.</b> Unlike Adam, RMSProp does not divide by $1-\\rho^{\\,t}$. Do not add one,
         or you will not match <code>torch.optim.RMSprop</code>.</li>
         <li><b>Not stepping under <code>torch.no_grad()</code>.</b> If the parameter update is recorded by
         autograd you corrupt the graph and leak memory. Wrap <code>step()</code> in <code>no_grad</code> and use
         in-place updates.</li>
         <li><b>Forgetting <code>zero_grad()</code>.</b> PyTorch <i>accumulates</i> gradients; if you do not zero
         them each step, $g_t$ is wrong and so is $s_t$.</li>
         <li><b>Confusing RMSProp with AdaGrad.</b> They look almost identical &mdash; the only difference is
         <i>sum</i> (AdaGrad: $G_t=G_{t-1}+g_t^2$) vs <i>moving average</i> (RMSProp:
         $s_t=\\rho s_{t-1}+(1-\\rho)g_t^2$). That one change is what stops the step decaying to zero.</li>
       </ul>`,

    recall: [
      "State RMSProp's update from memory: the MeanSquare $s_t=\\rho s_{t-1}+(1-\\rho)g_t^2$ and $\\theta_t=\\theta_{t-1}-\\alpha\\,g_t/(\\sqrt{s_t}+\\epsilon)$.",
      "Define $s_t$ (MeanSquare) in plain English and say what $\\rho$ controls.",
      "What single change turns AdaGrad into RMSProp, and why does it stop the step from decaying to zero?",
      "Why does RMSProp, unlike rprop, survive mini-batch training? (Hint: it averages, rather than using only the sign.)"
    ],

    practice: [
      {
        q: `Do one RMSProp step ($\\rho=0.9$, $\\alpha=0.01$, $\\epsilon=10^{-8}$) from $\\theta_0=0$, $s_0=0$, but with a much larger gradient $g_1=10$ at $t=1$. How big is the step, and what does that tell you?`,
        steps: [
          { do: `MeanSquare: $s_1=0.9\\cdot 0 + 0.1\\cdot 10^2 = 0.1\\cdot 100 = 10$.`, why: `Average of the one squared gradient.` },
          { do: `RMS denominator: $\\sqrt{s_1}+\\epsilon=\\sqrt{10}+\\epsilon\\approx 3.16228$.`, why: `The recent gradient magnitude.` },
          { do: `Step: $0.01\\cdot 10/3.16228\\approx 0.0316228$. New $\\theta_1\\approx -0.0316228$.`, why: `Gradient over its own size.` }
        ],
        answer: `The step is again about $0.0316$ — identical to the $g_1=0.1$ case in the worked example. On the very first step $s_1=(1-\\rho)g_1^2$, so $\\sqrt{s_1}=\\sqrt{1-\\rho}\\,|g_1|$ and the gradient's magnitude cancels in $g_1/\\sqrt{s_1}$. The first step is about $\\alpha/\\sqrt{1-\\rho}$ regardless of whether the gradient is 0.1 or 10. This scale-normalization is the same intuition behind Adam.`
      },
      {
        q: `Why does RMSProp keep making progress on a long run where AdaGrad stalls?`,
        steps: [
          { do: `AdaGrad's denominator $\\sqrt{G_t}$ with $G_t=\\sum_{i\\le t}g_i^2$ grows like $\\sqrt{t}$.`, why: `It sums every past squared gradient forever.` },
          { do: `So AdaGrad's step factor $\\alpha/\\sqrt{G_t}$ shrinks toward 0 — the step vanishes.`, why: `A growing denominator kills the step.` },
          { do: `RMSProp's $s_t$ is a decaying average that settles near the recent mean squared gradient $c$, a bounded value.`, why: `Old terms decay away, so the average does not climb.` },
          { do: `So RMSProp's step factor $\\alpha/(\\sqrt{s_t}+\\epsilon)\\approx \\alpha/\\sqrt{c}$ stays finite.`, why: `A bounded denominator keeps a healthy step.` }
        ],
        answer: `AdaGrad's accumulator $G_t$ only grows, so its effective step decays like $1/\\sqrt{t}$ and freezes before reaching the minimum. RMSProp replaces the growing sum with a decaying moving average $s_t$ that stays bounded, so its step stays a healthy size and keeps lowering the loss. In our CODEVIZ run AdaGrad stalls near loss ~17.5 while RMSProp continues down to ~7.3 in the same 120 steps.`
      },
      {
        q: `Ablation: in the CODE, replace RMSProp's moving average $s_t=\\rho s_{t-1}+(1-\\rho)g_t^2$ with AdaGrad's running SUM $G_t=G_{t-1}+g_t^2$ (keep everything else identical) and rerun the allclose against torch.optim.RMSprop. What happens, and why?`,
        steps: [
          { do: `Change the state update to $G_t=G_{t-1}+g_t^2$ (no $\\rho$, no $1-\\rho$).`, why: `That is AdaGrad's accumulator.` },
          { do: `Keep the step $\\theta_t=\\theta_{t-1}-\\alpha g_t/(\\sqrt{G_t}+\\epsilon)$ and run the same 6 steps.`, why: `Only the accumulator changed.` },
          { do: `Call $\\texttt{torch.allclose}$ against $\\texttt{torch.optim.RMSprop}$ and inspect the step sizes over time.`, why: `PyTorch keeps the moving average.` }
        ],
        answer: `The allclose now returns False. With the running sum, the denominator grows every step instead of settling, so after a few steps the step sizes diverge from PyTorch's RMSProp (they shrink faster). This is exactly the AdaGrad-vs-RMSProp difference: the single change from "sum" to "decaying average" is what RMSProp added, and it is what stops the step from vanishing. The mismatch grows with $t$ as the AdaGrad denominator keeps climbing.`
      }
    ]
  });

  window.CODE["paper-rmsprop"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the RMSProp optimizer from scratch with raw torch: one per-parameter moving average s of the ` +
      `squared gradient (the lecture's MeanSquare), then divide the gradient by sqrt(s)+eps and step — all ` +
      `under torch.no_grad(). Then prove it is identical to PyTorch by running 6 optimization steps with both ` +
      `MyRMSprop and torch.optim.RMSprop from the SAME start and checking torch.allclose. Finally recompute ` +
      `the one-step worked example. Runs in Colab (torch is preinstalled).`,
    code: `import torch

torch.manual_seed(0)

class MyRMSprop:
    """RMSProp from scratch — Tieleman & Hinton (2012), Coursera lecture 6e.
       s_t = rho*s_{t-1} + (1-rho)*g^2 ;  theta -= lr * g / (sqrt(s_t) + eps)."""
    def __init__(self, params, lr=1e-2, rho=0.99, eps=1e-8):
        self.params = list(params)
        self.lr, self.rho, self.eps = lr, rho, eps
        self.s = [torch.zeros_like(p) for p in self.params]   # MeanSquare (init 0)

    @torch.no_grad()
    def step(self):
        for i, p in enumerate(self.params):
            g = p.grad
            self.s[i] = self.rho*self.s[i] + (1-self.rho)*g*g  # MeanSquare moving average
            p -= self.lr * g / (self.s[i].sqrt() + self.eps)   # divide grad by RMS (eps OUTSIDE sqrt)

    def zero_grad(self):
        for p in self.params:
            if p.grad is not None:
                p.grad.zero_()

# ---- THE ORACLE: MyRMSprop must equal torch.optim.RMSprop over several steps ----
# NOTE: PyTorch names the DECAY argument "alpha" (default 0.99) and the learning rate "lr".
w_mine = torch.randn(5, 3, requires_grad=True)
w_ref  = w_mine.detach().clone().requires_grad_(True)         # identical start
opt_mine = MyRMSprop([w_mine], lr=1e-2, rho=0.99)
opt_ref  = torch.optim.RMSprop([w_ref], lr=1e-2, alpha=0.99, eps=1e-8)  # alpha == our rho

X = torch.randn(20, 5); target = torch.randn(20, 3)
for _ in range(6):
    opt_mine.zero_grad()
    (((X @ w_mine) - target)**2).mean().backward(); opt_mine.step()
    opt_ref.zero_grad()
    (((X @ w_ref) - target)**2).mean().backward(); opt_ref.step()

print("allclose vs torch.optim.RMSprop after 6 steps:",
      torch.allclose(w_mine, w_ref, atol=1e-7))             # expect True
print("max abs diff:", (w_mine - w_ref).abs().max().item()) # ~0

# ---- recompute the one-step worked example: theta0=0, s0=0, g=0.1, t=1, rho=0.9, lr=0.01 ----
th = torch.zeros(1, requires_grad=False)
o = MyRMSprop([th], lr=0.01, rho=0.9)     # rho=0.9 to match the slide's MeanSquare
th.grad = torch.tensor([0.1])
o.step()
print("worked example: s1=0.001, sqrt(s1)=0.0316228, step=0.0316228")
print("MyRMSprop new theta:", round(th.item(), 7))          # -0.0316228`
  };

  window.CODEVIZ["paper-rmsprop"] = {
    question: "On a long run (120 steps) of the same convex least-squares problem from the same start, AdaGrad divides by sqrt(sum of all past squared gradients) and RMSProp divides by sqrt(a decaying average). Whose per-step movement decays to zero and stalls, and whose stays a healthy size and keeps lowering the loss?",
    charts: [
      {
        type: "line",
        title: "Training loss over 120 steps: AdaGrad stalls, RMSProp keeps going (same problem, same start)",
        xlabel: "optimization step",
        ylabel: "loss (½ mean squared error)",
        series: [
          {
            name: "AdaGrad (lr 0.05)",
            color: "#ff7b72",
            points: [[0,32.697],[6,29.345],[12,27.662],[18,26.414],[24,25.395],[30,24.523],[36,23.756],[42,23.067],[48,22.441],[54,21.866],[60,21.333],[66,20.835],[72,20.369],[78,19.931],[84,19.516],[90,19.122],[96,18.748],[102,18.39],[108,18.049],[114,17.722],[119,17.459]]
          },
          {
            name: "RMSProp (lr 0.01, rho 0.99)",
            color: "#7ee787",
            points: [[0,32.697],[6,26.269],[12,23.238],[18,21.062],[24,19.329],[30,17.877],[36,16.621],[42,15.513],[48,14.521],[54,13.621],[60,12.799],[66,12.042],[72,11.342],[78,10.69],[84,10.082],[90,9.512],[96,8.977],[102,8.474],[108,7.999],[114,7.55],[119,7.196]]
          }
        ]
      },
      {
        type: "line",
        title: "Per-step movement size (‖update‖): AdaGrad's decays toward zero; RMSProp's plateaus",
        xlabel: "optimization step",
        ylabel: "step length ‖θ_t − θ_{t−1}‖",
        series: [
          {
            name: "AdaGrad step length",
            color: "#ff7b72",
            points: [[0,0.14142],[6,0.0502],[12,0.03571],[18,0.02883],[24,0.02463],[30,0.02172],[36,0.01957],[42,0.0179],[48,0.01655],[54,0.01543],[60,0.01449],[66,0.01368],[72,0.01297],[78,0.01235],[84,0.0118],[90,0.01131],[96,0.01087],[102,0.01046],[108,0.01009],[114,0.00976],[119,0.00949]]
          },
          {
            name: "RMSProp step length",
            color: "#7ee787",
            points: [[0,0.28284],[6,0.09526],[12,0.06678],[18,0.05366],[24,0.04581],[30,0.0405],[36,0.03662],[42,0.03365],[48,0.03129],[54,0.02936],[60,0.02777],[66,0.02642],[72,0.02527],[78,0.02427],[84,0.0234],[90,0.02262],[96,0.02193],[102,0.0213],[108,0.02073],[114,0.0202],[119,0.01979]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not a paper's reported numbers. Same convex least-squares problem (200×8), same zero start, 120 steps. AdaGrad divides by sqrt(SUM of all past squared gradients): that sum only grows, so its step length decays from ~0.14 toward ~0.009 and its loss flattens out, stalling near ~17.5 — the vanishing-step problem the lecture's RMSProp was meant to fix. RMSProp divides by sqrt(a DECAYING average): the denominator stays bounded, so its step length plateaus around ~0.02 (an order larger than AdaGrad's late steps) and its loss keeps falling to ~7.2. The single change — running sum vs exponential moving average — is the whole idea.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# convex least-squares; long horizon so AdaGrad's growing denominator bites
N, D = 200, 8
X = rng.normal(0, 1, (N, D))
w_true = rng.normal(0, 3, D)
y = X @ w_true + rng.normal(0, 0.01, N)

def loss_grad(w):
    r = X @ w - y
    return 0.5*np.mean(r**2), (X.T @ r)/N

def run_adagrad(lr, steps=120, eps=1e-8):
    w = np.zeros(D); G = np.zeros(D); loss = []; step = []
    for _ in range(steps):
        L, g = loss_grad(w); loss.append(L)
        G += g*g                              # SUM of past squared gradients (grows forever)
        upd = lr*g/(np.sqrt(G)+eps)
        step.append(np.linalg.norm(upd)); w -= upd
    return loss, step

def run_rmsprop(lr, steps=120, rho=0.99, eps=1e-8):
    w = np.zeros(D); s = np.zeros(D); loss = []; step = []
    for _ in range(steps):
        L, g = loss_grad(w); loss.append(L)
        s = rho*s + (1-rho)*g*g               # DECAYING average (bounded) — the RMSProp change
        upd = lr*g/(np.sqrt(s)+eps)
        step.append(np.linalg.norm(upd)); w -= upd
    return loss, step

ada_loss, ada_step = run_adagrad(lr=0.05)
rms_loss, rms_step = run_rmsprop(lr=0.01, rho=0.99)
print("AdaGrad final loss:", round(ada_loss[-1], 3),   # ~17.459
      "| last step len:", round(ada_step[-1], 5))       # ~0.00949
print("RMSProp final loss:", round(rms_loss[-1], 3),    # ~7.196
      "| last step len:", round(rms_step[-1], 5))        # ~0.01979`
  };
})();
