/* Paper lesson — Decoupled Weight Decay Regularization / AdamW (Loshchilov & Hutter, 2017).
   Grounded from arXiv:1711.05101 (abstract + ar5iv HTML; Algorithm 2, Eq. 1, Proposition 2, Section 4.4).
   Track A (primitive): build the AdamW update from scratch with raw torch, verify with
   torch.allclose vs torch.optim.AdamW over several steps.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-adamw". */
(function () {
  window.LESSONS.push({
    id: "paper-adamw",
    title: "AdamW — Decoupled Weight Decay Regularization (2017)",
    tagline: "Apply weight decay straight to the weights — not folded into the gradient — so Adam regularizes correctly and generalizes better.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Ilya Loshchilov, Frank Hutter",
      org: "University of Freiburg",
      year: 2017,
      venue: "ICLR 2019 (arXiv:1711.05101, submitted Nov 2017)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1711.05101",
      code: ""
    },

    conceptLink: "dl-optimizers",
    partOf: [
      { capstone: "capstone-mini-gpt", step: 6, builds: "AdamW optimizer step from scratch" }
    ],
    prereqs: ["dl-optimizers", "dl-backprop", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Two ideas that sound identical are <i>L2 regularization</i> and <i>weight decay</i>.
       Both try to keep the weights small, which usually improves generalization (how well the model does on
       data it was not trained on). <b>L2 regularization</b> adds a penalty $\\tfrac{\\lambda}{2}\\lVert\\theta\\rVert^2$
       to the loss, so the gradient gains an extra term $\\lambda\\theta$ that gets <b>added into the gradient</b>.
       <b>Weight decay</b> instead shrinks every weight by a fixed fraction each step: $\\theta\\leftarrow(1-\\lambda)\\theta$,
       <b>applied directly to the weight</b>, never touching the gradient.</p>
       <p>For plain stochastic gradient descent (SGD) these two are exactly the same thing. The paper shows that
       for <b>adaptive</b> optimizers like <b>Adam</b> they are <i>not</i> the same &mdash; and that everyone who
       wrote <code>Adam(..., weight_decay=...)</code> was actually getting the L2 version, which behaves badly.</p>
       <p>Adam (Adaptive Moment Estimation) divides each weight's step by a running estimate of that weight's
       gradient size. When you fold the $\\lambda\\theta$ penalty <i>into</i> the gradient, that penalty gets
       divided by the same per-weight scaling. Weights that have seen large gradients end up decayed <b>less</b>
       than weights that have seen small ones &mdash; the opposite of uniform shrinkage. So Adam's "weight decay"
       was inconsistent and hard to tune, and Adam often generalized worse than SGD.</p>`,

    contribution:
      `<p>The paper isolates and fixes that coupling. Its contributions:</p>
       <ul>
         <li><b>AdamW: decoupled weight decay.</b> Keep Adam's adaptive step for the loss gradient, but apply the
         weight-decay shrinkage $\\lambda\\theta$ <b>directly to the weight</b>, <i>outside</i> the adaptive
         scaling (Algorithm 2). The decay is uniform across all weights again.</li>
         <li><b>It proves L2 $\\ne$ weight decay for adaptive methods.</b> With L2, "weights with large historic
         parameter and/or gradient amplitudes are regularized less than they would be when using weight decay"
         (Proposition 2). Decoupling removes that distortion.</li>
         <li><b>It decouples the hyperparameters.</b> Once decoupled, the best weight-decay value $\\lambda$ no
         longer depends on the learning rate, so you can tune the two independently instead of on a coupled grid.</li>
       </ul>`,

    whyItMattered:
      `<p>AdamW closed the gap between Adam and SGD on generalization. The paper reports AdamW reaching about a
       <b>15% relative improvement in test error over Adam on CIFAR-10 and ImageNet32x32</b> (Section 4.4, quoted
       below). <code>torch.optim.AdamW</code> shipped as a result, and AdamW became the <b>default optimizer for
       training Transformers and large language models</b> &mdash; it is the optimizer used in the mini-GPT
       capstone in this course. Whenever you see <code>AdamW</code> in a training script, this is the paper.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the "L2 and weight decay are not identical for adaptive gradient methods"
         claim and the headline that decoupling improves Adam's generalization.</li>
         <li><b>Algorithm 2</b> &mdash; the side-by-side of "Adam with L2 regularization" and "AdamW". The only
         change is <i>where</i> the $\\lambda\\theta$ term enters. This is the whole method.</li>
         <li><b>Proposition 2 (and the surrounding text)</b> &mdash; the precise statement of why L2 and weight
         decay diverge under adaptive scaling.</li>
       </ul>
       <p><b>Skim:</b> Section 4 experiments (CIFAR-10, ImageNet32x32) for the qualitative result &mdash; AdamW
       generalizes better and its $\\lambda$ decouples from the learning rate. You do not need every plot.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> Two weights both start at $3.0$ and we want to decay them toward $0$. One
       weight constantly receives <b>large</b> loss-gradients, the other <b>tiny</b> ones. We run AdamW (decoupled
       decay) and Adam+L2 (decay folded into the gradient) with the same decay $\\lambda$. Under <b>Adam+L2</b>,
       will the two weights be shrunk by the <i>same</i> amount, or will the small-gradient weight be regularized
       <b>differently</b> than the large-gradient one? Write your guess, then look at the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write one AdamW step on a parameter tensor <code>theta</code> with
       running moments <code>m</code>, <code>v</code>, using raw torch &mdash; no <code>torch.optim.AdamW</code>:</p>
       <ul>
         <li>Given the loss gradient <code>g</code> (gradient of the loss ONLY &mdash; do <b>not</b> add
         $\\lambda\\theta$ to it): <code># TODO: m = beta1*m + (1-beta1)*g</code>.</li>
         <li>Second moment: <code># TODO: v = beta2*v + (1-beta2)*g*g</code>.</li>
         <li>Bias-correct: <code># TODO: mhat = m/(1-beta1**t); vhat = v/(1-beta2**t)</code> (<code>t</code> is the
         step number, starting at 1).</li>
         <li>Update with <b>decoupled</b> decay: <code># TODO: theta = theta - lr*( mhat/(sqrt(vhat)+eps) + wd*theta )</code>.
         The <code>wd*theta</code> term is applied to the weight directly, NOT routed through <code>m</code>/<code>v</code>.</li>
       </ul>
       <p>The CODE cell is the full reference, including the <code>torch.allclose</code> check against
       <code>torch.optim.AdamW</code> over several steps &mdash; that passing check is the proof your update is
       exactly PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>AdamW is Adam with one surgical change. Recall what plain <b>Adam</b> does, per weight, at step $t$:</p>
       <ol>
         <li><b>First moment $m_t$ (momentum).</b> An exponential moving average of the gradient &mdash; the
         smoothed direction. "Exponential moving average" means a running blend that weights recent values more.</li>
         <li><b>Second moment $v_t$ (RMSprop term).</b> An exponential moving average of the <i>squared</i>
         gradient &mdash; a per-weight measure of how big that weight's gradients have been.</li>
         <li><b>Bias correction.</b> Because $m$ and $v$ start at $0$, early estimates are too small; dividing by
         $1-\\beta_1^t$ and $1-\\beta_2^t$ fixes that.</li>
         <li><b>Adaptive step.</b> Move each weight by $\\hat m_t / (\\sqrt{\\hat v_t}+\\epsilon)$: big steps where
         gradients have been small, small steps where they have been large.</li>
       </ol>
       <p>Now <b>weight decay</b>. The old "Adam with L2" adds $\\lambda\\theta$ to the gradient $g_t$ <i>before</i>
       computing $m_t,v_t$. That means the decay term goes through the same per-weight division by
       $\\sqrt{\\hat v_t}$ &mdash; so a weight with a long history of large gradients (large $\\hat v_t$) gets its
       decay shrunk, and is regularized less than a quiet weight. That is the coupling the paper exposes.</p>
       <p><b>AdamW's fix:</b> compute $m_t,v_t$ from the <b>loss gradient only</b>, and add the decay
       $\\lambda\\theta_{t-1}$ <b>directly</b> to the update at the very end, multiplied by the learning rate but
       <i>never</i> divided by $\\sqrt{\\hat v_t}$. Every weight is now decayed by the same fraction each step,
       independent of its gradient history.</p>`,

    architecture:
      `<p>AdamW is not a network &mdash; it is a per-iteration <b>update procedure</b>. The "architecture" is the
       data flow of one step, exactly as printed in <b>Algorithm 2</b>. State carried across steps: the parameters
       $\\theta$, the first moment $m$, the second moment $v$ (all same shape as $\\theta$), and the step counter $t$.
       Initialize $t=0$, $m_0=0$, $v_0=0$.</p>
       <p><b>One step, line by line (Algorithm 2):</b></p>
       <ol>
         <li>L4 &mdash; $t \\leftarrow t+1$.</li>
         <li>L5 &mdash; $\\nabla f_t(\\theta_{t-1}) \\leftarrow \\text{SelectBatch}(\\theta_{t-1})$: draw a minibatch and
         backprop to get the loss gradient.</li>
         <li>L6 &mdash; <b>THE FORK.</b> Adam+L2: $g_t \\leftarrow \\nabla f_t(\\theta_{t-1}) + \\lambda\\theta_{t-1}$
         (decay folded in). AdamW: $g_t \\leftarrow \\nabla f_t(\\theta_{t-1})$ (loss gradient only). Every later line
         is identical &mdash; this branch is the whole difference.</li>
         <li>L7 &mdash; $m_t \\leftarrow \\beta_1 m_{t-1} + (1-\\beta_1)g_t$ (first moment).</li>
         <li>L8 &mdash; $v_t \\leftarrow \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2$ (second moment).</li>
         <li>L9 &mdash; $\\hat m_t \\leftarrow m_t/(1-\\beta_1^t)$ (bias-correct first moment).</li>
         <li>L10 &mdash; $\\hat v_t \\leftarrow v_t/(1-\\beta_2^t)$ (bias-correct second moment).</li>
         <li>L11 &mdash; $\\eta_t \\leftarrow \\text{SetScheduleMultiplier}(t)$: the schedule/warmup multiplier (flat run uses $1$).</li>
         <li>L12 &mdash; <b>parameter update.</b> Adam+L2:
         $\\theta_t \\leftarrow \\theta_{t-1} - \\eta_t(\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon) + \\lambda\\theta_{t-1})$.
         AdamW: $\\theta_t \\leftarrow \\theta_{t-1} - \\eta_t\\,\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)
         - \\eta_t\\,\\lambda\\,\\theta_{t-1}$ &mdash; the decay is a separate subtraction, OUTSIDE the adaptive scaling.</li>
       </ol>
       <p><b>The same template gives SGDW</b> (Algorithm 1): replace the adaptive term with momentum $m_t$, so the
       AdamW update line becomes $\\theta_t \\leftarrow \\theta_{t-1} - m_t - \\eta_t\\lambda\\theta_{t-1}$ &mdash;
       decoupled decay layered onto SGD-with-momentum the same way. Wrapping either in cosine warm restarts gives
       AdamWR / SGDWR.</p>`,

    symbols: [
      { sym: "weight decay", desc: "shrinking every weight toward zero by a fixed fraction each step ($\\theta\\leftarrow(1-\\lambda)\\theta$), applied directly to the weight. A form of regularization (it discourages large weights)." },
      { sym: "L2 regularization", desc: "adding a penalty $\\tfrac{\\lambda}{2}\\lVert\\theta\\rVert^2$ to the loss, which adds $\\lambda\\theta$ into the gradient. Identical to weight decay for plain SGD, but NOT for Adam." },
      { sym: "adaptive optimizer", desc: "an optimizer that scales each weight's step by that weight's own gradient history (Adam, RMSprop). This per-weight scaling is exactly what breaks L2 = weight decay." },
      { sym: "$\\theta_t$", desc: "the parameter (weight) vector after step $t$. $\\theta_{t-1}$ is its value before this step." },
      { sym: "$g_t$", desc: "the gradient of the LOSS with respect to $\\theta$ at step $t$ (the loss gradient only, with no decay term added in AdamW)." },
      { sym: "$m_t$", desc: "first moment: an exponential moving average (recent-weighted running blend) of the gradient $g_t$. The momentum term." },
      { sym: "$v_t$", desc: "second moment: an exponential moving average of the squared gradient $g_t^2$. Per-weight measure of recent gradient magnitude (the RMSprop term)." },
      { sym: "$\\beta_1$", desc: "decay rate for the first moment $m$ (default $0.9$): how much of the old $m$ to keep each step." },
      { sym: "$\\beta_2$", desc: "decay rate for the second moment $v$ (default $0.999$): how much of the old $v$ to keep each step." },
      { sym: "$\\hat m_t,\\ \\hat v_t$", desc: "the bias-corrected moments: $m_t/(1-\\beta_1^t)$ and $v_t/(1-\\beta_2^t)$, which fix the fact that $m,v$ start at zero." },
      { sym: "$\\epsilon$", desc: "epsilon, a tiny constant (default $10^{-8}$) added to $\\sqrt{\\hat v_t}$ so we never divide by zero." },
      { sym: "$\\alpha$", desc: "the base learning rate (step size), default $0.001$ in the paper. PyTorch calls this $\\text{lr}$." },
      { sym: "$\\lambda$", desc: "the weight-decay factor: the fraction by which each weight is shrunk per step. PyTorch calls this $\\text{weight\\_decay}$. (After decoupling, its best value no longer depends on $\\alpha$.)" },
      { sym: "$\\eta_t$", desc: "the schedule multiplier: a single number (often from a warmup/decay schedule) multiplying the whole update at step $t$. With a flat schedule $\\eta_t=1$." },
      { sym: "$\\nabla f_t(\\theta)$", desc: "the gradient of the minibatch loss $f_t$ with respect to $\\theta$ at step $t$ &mdash; what backprop returns. In AdamW this IS $g_t$; in Adam+L2, $g_t=\\nabla f_t+\\lambda\\theta$." },
      { sym: "$\\mathbf{M}_t$", desc: "the per-step preconditioner: the matrix the optimizer multiplies the gradient by. For SGD it is the identity $\\mathbf{I}$; for adaptive methods (Adam) it is diagonal with $\\mathbf{M}_t\\ne k\\mathbf{I}$ &mdash; that non-identity is exactly the condition of Proposition 2." },
      { sym: "$\\lambda'$", desc: "the L2 coefficient Proposition 2 searches for: the penalty weight that would make L2 regularization reproduce weight decay. The proposition shows no such $\\lambda'$ exists for adaptive optimizers." },
      { sym: "$T_{\\text{cur}},\\ T_i$", desc: "warm-restart counters in the cosine schedule (App. B.2): $T_{\\text{cur}}$ is epochs since the last restart, $T_i$ is the length of the current restart cycle. Their ratio drives $\\eta_t$ from 1 down to 0." },
      { sym: "$\\lambda_{\\text{norm}}$", desc: "normalized weight decay (App. B.1): the run-independent decay you actually pick. The real $\\lambda$ is recovered as $\\lambda_{\\text{norm}}\\sqrt{b/(BT)}$." },
      { sym: "$b,\\ B,\\ T$", desc: "in the normalized-decay formula: $b$ = batch size, $B$ = total number of training points, $T$ = total number of epochs." }
    ],

    formula:
      `$$g_t \\leftarrow \\nabla f_t(\\theta_{t-1}) \\;+\\; \\lambda\\,\\theta_{t-1}
        \\qquad\\text{vs.}\\qquad g_t \\leftarrow \\nabla f_t(\\theta_{t-1})$$
       <p>The single fork (Algorithm 2, line 6). LEFT &mdash; "Adam with L2 regularization": the penalty
       $\\lambda\\theta_{t-1}$ is folded <i>into</i> the gradient, so it flows through $m_t,v_t$ and inherits the
       adaptive scaling. RIGHT &mdash; AdamW: $g_t$ is the loss gradient ONLY; the decay is held out for line 12.</p>

       $$\\theta_t \\leftarrow \\theta_{t-1} - \\eta_t\\Big(\\alpha\\,\\tfrac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon}
        \\;+\\; \\lambda\\,\\theta_{t-1}\\Big)
        \\quad\\text{(L2)} \\qquad \\theta_t \\leftarrow \\theta_{t-1} - \\eta_t\\,\\alpha\\,
        \\tfrac{\\hat m_t}{\\sqrt{\\hat v_t}+\\epsilon} \\;-\\; \\eta_t\\,\\lambda\\,\\theta_{t-1}
        \\quad\\text{(AdamW)}$$
       <p>The parameter update (Algorithm 2, line 12), shown for both. With L2 the $\\lambda\\theta_{t-1}$ written here
       does nothing extra &mdash; the decay already entered via $g_t$ above and got divided by $\\sqrt{\\hat v_t}$.
       In AdamW the decay term $\\eta_t\\,\\lambda\\,\\theta_{t-1}$ is a <b>separate</b> subtraction, never touched by
       $\\sqrt{\\hat v_t}$, so every weight shrinks by the same fraction. This contrast is the entire paper.</p>

       $$m_t \\leftarrow \\beta_1 m_{t-1} + (1-\\beta_1)g_t \\qquad
        v_t \\leftarrow \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2$$
       <p>The Adam moment updates (Algorithm 2, lines 7&ndash;8): exponential moving averages of the gradient and
       the squared gradient.</p>

       $$\\hat m_t \\leftarrow \\frac{m_t}{1-\\beta_1^t} \\qquad
        \\hat v_t \\leftarrow \\frac{v_t}{1-\\beta_2^t}$$
       <p>Bias correction (Algorithm 2, lines 9&ndash;10): undoes the cold-start shrink from initializing
       $m_0=v_0=0$.</p>

       $$\\theta_{t+1} = (1-\\lambda)\\,\\theta_t - \\alpha\\,\\nabla f_t(\\theta_t)$$
       <p>The paper's definition of plain weight decay (Eq. 1, §2). AdamW is built to recover this uniform
       $(1-\\eta_t\\lambda)$ shrinkage of every weight; the L2 form cannot, for adaptive methods.</p>

       $$\\theta_{t+1} \\leftarrow \\theta_t - \\alpha\\,\\mathbf{M}_t\\nabla f_t(\\theta_t)\\ \\text{(no decay)}
        \\qquad \\theta_{t+1} \\leftarrow (1-\\lambda)\\theta_t - \\alpha\\,\\mathbf{M}_t\\nabla f_t(\\theta_t)\\ \\text{(decay)}$$
       <p><b>Proposition 2</b> (§2): for any preconditioner $\\mathbf{M}_t \\ne k\\mathbf{I}$ (i.e. adaptive scaling),
       there is <b>no</b> L2 coefficient $\\lambda'$ for which $f_t(\\theta)+\\tfrac{\\lambda'}{2}\\lVert\\theta\\rVert^2$
       reproduces the weight-decay iterate. L2 $\\ne$ weight decay for adaptive optimizers.</p>

       $$\\eta_t = 0.5 + 0.5\\cos\\!\\big(\\pi\\,T_{\\text{cur}}/T_i\\big) \\qquad
        \\lambda = \\lambda_{\\text{norm}}\\sqrt{b/(BT)}$$
       <p>LEFT &mdash; the cosine schedule multiplier $\\eta_t$ used by AdamWR with warm restarts (App. B.2).
       RIGHT &mdash; normalized weight decay (App. B.1): $b$ = batch size, $B$ = total training points,
       $T$ = total epochs, so the chosen $\\lambda$ scales with the amount of training.</p>`,

    whatItDoes:
      `<p>This is the AdamW parameter update, line 12 of <b>Algorithm 2</b> in the paper. The first term inside
       the parentheses, $\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)$, is exactly Adam's adaptive step computed
       from the <i>loss gradient only</i>. The second term, $\\lambda\\theta_{t-1}$, is the <b>decoupled weight
       decay</b>: it is added <i>after</i> the adaptive scaling, so it is <b>not</b> divided by $\\sqrt{\\hat v_t}$.
       That is the one and only change from "Adam with L2", where $\\lambda\\theta$ is instead added to $g_t$ and
       therefore <i>does</i> get scaled. Compare with the paper's plain weight-decay form, Eq. (1):
       $\\theta_{t+1}=(1-\\lambda)\\theta_t-\\alpha\\nabla f_t(\\theta_t)$ &mdash; AdamW recovers that uniform
       $(1-\\eta_t\\lambda)$ shrinkage of every weight.</p>`,

    derivation:
      `<p>The <i>why</i> behind $m_t$ (momentum) and $v_t$ (RMSprop scaling) &mdash; and Adam's bias correction
       &mdash; is derived in the <code>dl-optimizers</code> concept lesson; this lesson builds directly on it, so
       we recap rather than re-derive. <b>Recap:</b> Adam = Momentum (average the gradient) + RMSprop (divide by a
       running gradient size), with $1-\\beta^t$ bias correction. <b>The one new idea here:</b> if the regularizer
       term $\\lambda\\theta$ is added to $g_t$ <i>before</i> that division, it inherits the per-weight scaling
       $1/\\sqrt{\\hat v_t}$ &mdash; so weights with large $\\hat v_t$ are decayed less (Proposition 2). Moving the
       $\\lambda\\theta$ term <i>outside</i> the division restores uniform decay. See <code>dl-optimizers</code>
       for the full Adam derivation.</p>`,

    example:
      `<p><b>Worked numbers: one AdamW step on a single (1-D) weight.</b> Start with $\\theta=0.5$, loss gradient
       $g=0.2$, and defaults $\\alpha=0.1$, $\\beta_1=0.9$, $\\beta_2=0.999$, $\\epsilon=10^{-8}$, $\\lambda=0.01$,
       $\\eta_t=1$. This is the very first step ($t=1$), so $m_0=v_0=0$. Plug into Algorithm 2 line by line:</p>
       <ul class="steps">
         <li><b>First moment:</b> $m_1=(1-\\beta_1)\\,g=(0.1)(0.2)=0.02$.</li>
         <li><b>Second moment:</b> $v_1=(1-\\beta_2)\\,g^2=(0.001)(0.04)=0.00004$.</li>
         <li><b>Bias-correct first moment:</b> $\\hat m_1=m_1/(1-\\beta_1^1)=0.02/0.1=0.2$.</li>
         <li><b>Bias-correct second moment:</b> $\\hat v_1=v_1/(1-\\beta_2^1)=0.00004/0.001=0.04$.</li>
         <li><b>Adaptive step:</b> $\\hat m_1/(\\sqrt{\\hat v_1}+\\epsilon)=0.2/(\\sqrt{0.04}+10^{-8})=0.2/0.2=1.0$.</li>
         <li><b>Decoupled decay term:</b> $\\lambda\\theta=0.01\\times0.5=0.005$ &mdash; applied to the weight directly.</li>
         <li><b>Update:</b> $\\theta_{\\text{new}}=\\theta-\\alpha(\\,\\text{adaptive}+\\lambda\\theta\\,)=0.5-0.1\\,(1.0+0.005)=0.5-0.1005=\\mathbf{0.3995}$.</li>
       </ul>
       <p><b>The one and only difference from "Adam with L2".</b> Adam+L2 folds the decay <i>into</i> the gradient
       first ($g\\leftarrow g+\\lambda\\theta = 0.2+0.005=0.205$) so it gets divided by $\\sqrt{\\hat v_1}$ along
       with everything else; AdamW keeps the decay <b>outside</b> that division:</p>
       <table class="extable">
         <caption>Same one step ($\\theta=0.5$, $g=0.2$, $t=1$): where the $\\lambda\\theta$ decay enters</caption>
         <thead>
           <tr><th>quantity</th><th class="num">AdamW (decoupled)</th><th class="num">Adam + L2 (coupled)</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">gradient used for $m,v$</td><td class="num">$g=0.2$</td><td class="num">$g+\\lambda\\theta=0.205$</td></tr>
           <tr><td class="row-h">$\\hat m_1$</td><td class="num">0.2</td><td class="num">0.205</td></tr>
           <tr><td class="row-h">$\\hat v_1$</td><td class="num">0.04</td><td class="num">0.042025</td></tr>
           <tr><td class="row-h">adaptive $=\\hat m_1/\\sqrt{\\hat v_1}$</td><td class="num">1.0</td><td class="num">1.0</td></tr>
           <tr><td class="row-h">separate decay term</td><td class="num">$+\\lambda\\theta=0.005$</td><td class="num">none (already in $g$)</td></tr>
           <tr><td class="row-h">$\\theta_{\\text{new}}=\\theta-\\alpha(\\cdots)$</td><td class="num">0.3995</td><td class="num">0.4000</td></tr>
         </tbody>
       </table>
       <p>Even on this first step the two land on different weights ($0.3995$ vs $0.4000$); over many steps the gap
       grows, because under Adam+L2 the decay is scaled by each weight's own $1/\\sqrt{\\hat v_t}$ instead of being a
       uniform shrink. The CODE cell recomputes $\\theta_{\\text{new}}=0.3995$ and checks it against
       <code>torch.optim.AdamW</code> on the same one step.</p>`,

    recipe:
      `<p><b>Algorithm 2 (AdamW), as numbered steps for one update at step $t$:</b></p>
       <ol>
         <li>Get the gradient of the <b>loss only</b>: $g_t=\\nabla f_t(\\theta_{t-1})$. Do not add $\\lambda\\theta$.</li>
         <li>Update first moment: $m_t=\\beta_1 m_{t-1}+(1-\\beta_1)g_t$.</li>
         <li>Update second moment: $v_t=\\beta_2 v_{t-1}+(1-\\beta_2)g_t^2$.</li>
         <li>Bias-correct: $\\hat m_t=m_t/(1-\\beta_1^t)$, $\\hat v_t=v_t/(1-\\beta_2^t)$.</li>
         <li>Update with decoupled decay:
         $\\theta_t=\\theta_{t-1}-\\eta_t\\big(\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)+\\lambda\\theta_{t-1}\\big)$.</li>
       </ol>
       <p>The contrast "Adam with L2" replaces step 1 with $g_t\\leftarrow\\nabla f_t+\\lambda\\theta_{t-1}$ and drops
       the $\\lambda\\theta$ from step 5 &mdash; that is the bug this paper fixes.</p>`,

    results:
      `<p>Quoted from the paper: AdamW "substantially improves Adam's generalization performance, allowing it to
       compete with SGD with momentum on image classification datasets." In Section 4.4 the authors report that
       <b>AdamW achieved a 15% relative improvement in test error compared to Adam on both CIFAR-10 and
       ImageNet32x32</b>. They also show (Abstract / Section 4) that after decoupling, the <b>optimal weight-decay
       factor becomes independent of the learning rate</b>, so the two can be tuned separately. (Source:
       arXiv:1711.05101 abstract and Section 4.4.)</p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Track A again, so "working" means <i>exact agreement with the
       reference</i>: <code>torch.allclose(my_theta, torch.optim.AdamW_theta, atol=1e-6)</code> over several steps
       with weight decay on. <code>torch.optim.AdamW</code> is the oracle. The trivial bar is "the weights move and
       shrink" &mdash; both AdamW and the buggy Adam+L2 do that, so shrinkage alone proves nothing; only matching
       <code>AdamW</code> (and <i>not</i> matching <code>Adam(weight_decay=...)</code>) proves you built the
       <i>decoupled</i> update.</p>
       <ul>
         <li><b>Sanity checks before the full run.</b> (1) The one-step worked example: $\\theta=0.5$, $g=0.2$,
         $\\alpha=0.1$, $\\lambda=0.01$ must give $\\theta_{\\text{new}}=0.3995$ exactly (the adaptive step is $1.0$
         plus a $0.005$ decay term, scaled by $\\alpha$). (2) Set $\\lambda=0$ and confirm your AdamW reduces to plain
         Adam &mdash; it should then match <code>torch.optim.Adam</code> too. (3) With the loss gradient set to zero
         but $\\lambda\\gt0$, one step must shrink the weight by exactly $\\eta_t\\alpha\\lambda\\theta$ (pure decay,
         no adaptive term) &mdash; a clean known-answer test of the decoupled branch.</li>
         <li><b>Expected range.</b> A correct build gives <code>allclose True</code> with diffs at the
         floating-point floor (~$10^{-7}$ at <code>atol=1e-6</code>). A diff of $10^{-3}$+ is a real bug, almost
         always the decay routed through the gradient. On the CODEVIZ small-gradient-weight demo, under AdamW the
         decoupled weight should track the large-gradient weight (our run: ends ~$-1.30$, uniform decay); under
         Adam+L2 it barely reaches 0 (~$-0.10$) &mdash; approximate, our numbers, not the paper's.</li>
         <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The paper's whole contribution is the single
         fork at Algorithm 2 line 6: decay applied to the weight vs folded into $g_t$. Move $\\lambda\\theta$ into
         the gradient ($g\\leftarrow g+\\lambda\\theta$, drop the separate term) and the <code>allclose</code> vs
         <code>AdamW</code> must flip to <b>False</b> &mdash; and now instead match <code>torch.optim.Adam(weight_decay=\\lambda)</code>.
         If both still match <code>AdamW</code>, your decay was never actually being applied. Confirm the divergence
         is largest on weights with the largest $\\hat v_t$ (Proposition 2: large-$\\hat v_t$ weights get decayed
         less under L2).</li>
         <li><b>Failure signals &amp; what they mean.</b> <i>allclose matches Adam(weight_decay) but not AdamW</i>
         &rarr; you built Adam+L2 (decay folded into the gradient). <i>allclose fails worst on high-gradient
         coordinates</i> &rarr; same coupling bug, seen through Proposition 2. <i>Decay too weak/strong by a constant
         factor</i> &rarr; forgot to multiply the decay by $\\alpha$ (and $\\eta_t$); the effective shrink is
         $\\eta_t\\alpha\\lambda$, matching PyTorch. <i>Divide-by-zero at $t=1$</i> &rarr; off-by-one step index;
         $t$ must start at 1 so $1-\\beta^{\\,t}\\ne0$. <i>Early steps far too small</i> &rarr; bias correction
         dropped.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>torch.optim.AdamW</code> in one line. Here you
       <b>build the update from scratch</b> with raw tensors: first/second moments, bias correction, the adaptive
       step, and the <i>decoupled</i> decay term. The payoff is
       <code>torch.allclose(my_theta, AdamW_theta)</code> over several steps &mdash; if it passes, your update is
       provably identical to PyTorch's. You compute gradients with autograd but do the optimizer math by hand.</p>`,

    pitfalls:
      `<ul>
         <li><b>Decay folded into the gradient.</b> The single most common error: adding $\\lambda\\theta$ to
         <code>g</code> before computing <code>m</code>/<code>v</code>. That is "Adam+L2", not AdamW &mdash; the
         decay then gets divided by $\\sqrt{\\hat v_t}$ and the allclose vs <code>AdamW</code> fails.</li>
         <li><b>Forgetting bias correction.</b> Without dividing by $1-\\beta_1^t$ and $1-\\beta_2^t$, the first
         few steps are far too small (then wrong). Both PyTorch and this code apply it.</li>
         <li><b>Step index off by one.</b> $t$ starts at <b>1</b> on the first update, not 0; $\\beta^0=1$ would
         make $1-\\beta^t=0$ and divide by zero.</li>
         <li><b>Decay scaled by the learning rate.</b> In this formulation the decay term is multiplied by the
         learning rate (and schedule $\\eta_t$). PyTorch's <code>AdamW</code> does the same &mdash; the effective
         shrink per step is $\\eta_t\\,\\alpha\\,\\lambda$. Match it or the allclose fails.</li>
         <li><b>Confusing AdamW with Adam.</b> <code>torch.optim.Adam(weight_decay=...)</code> gives you the L2
         (coupled) behavior; only <code>torch.optim.AdamW</code> decouples. They are different optimizers.</li>
       </ul>`,

    recall: [
      "Write the AdamW update from memory: $\\theta_t=\\theta_{t-1}-\\eta_t(\\alpha\\,\\hat m_t/(\\sqrt{\\hat v_t}+\\epsilon)+\\lambda\\theta_{t-1})$.",
      "What is the ONE structural difference between AdamW and Adam-with-L2?",
      "Define $m_t$, $v_t$, $\\beta_1$, $\\beta_2$, $\\epsilon$, $\\alpha$, and $\\lambda$.",
      "Why does L2 regularization regularize large-$\\hat v_t$ weights less under Adam (Proposition 2)?"
    ],

    practice: [
      {
        q: `Do one AdamW step on a scalar weight $\\theta=2.0$ with loss gradient $g=0.5$, defaults $\\alpha=0.1$, $\\beta_1=0.9$, $\\beta_2=0.999$, $\\epsilon\\approx0$, $\\lambda=0.1$, first step ($t=1$).`,
        steps: [
          { do: `First moment: $m_1=(1-0.9)(0.5)=0.05$.`, why: `Exponential average of the gradient, from $m_0=0$.` },
          { do: `Second moment: $v_1=(1-0.999)(0.25)=0.00025$.`, why: `Exponential average of the squared gradient.` },
          { do: `Bias-correct: $\\hat m_1=0.05/0.1=0.5$, $\\hat v_1=0.00025/0.001=0.25$.`, why: `Undo the cold-start shrink ($m,v$ began at 0).` },
          { do: `Adaptive step: $\\hat m_1/\\sqrt{\\hat v_1}=0.5/0.5=1.0$.`, why: `On the first step the adaptive step is $\\pm1$ in the gradient's direction.` },
          { do: `Decoupled decay: $\\lambda\\theta=0.1\\times2.0=0.2$.`, why: `Applied to the weight directly, not through $m,v$.` },
          { do: `Update: $\\theta_{\\text{new}}=2.0-0.1(1.0+0.2)=2.0-0.12=1.88$.`, why: `Adaptive step plus uniform shrink, scaled by $\\alpha$.` }
        ],
        answer: `$\\theta_{\\text{new}}=1.88$. The CODE cell can confirm this against <code>torch.optim.AdamW</code> on the same one step.`
      },
      {
        q: `Ablation: take the from-scratch AdamW in the CODE and fold the decay into the gradient instead (set $g\\leftarrow g+\\lambda\\theta$, drop the separate $\\lambda\\theta$ term). What changes, and does the allclose still pass?`,
        steps: [
          { do: `Move $\\lambda\\theta$ from the final update into the gradient before computing $m,v$.`, why: `That converts AdamW back into Adam-with-L2.` },
          { do: `Re-run the allclose against <code>torch.optim.AdamW</code>.`, why: `AdamW does NOT fold decay into the gradient, so the two now differ.` },
          { do: `Inspect a weight that saw large gradients vs one that saw tiny gradients.`, why: `Under L2 the large-$\\hat v$ weight is decayed less (Proposition 2).` }
        ],
        answer: `The allclose vs <code>AdamW</code> now <b>fails</b> &mdash; you have built Adam-with-L2, a different optimizer. The decay term is now divided by $\\sqrt{\\hat v_t}$, so weights with large gradient history get regularized less. (It would instead match <code>torch.optim.Adam(weight_decay=...)</code>.) This is exactly the coupling the paper removes.`
      },
      {
        q: `Why does the paper say decoupling makes the best $\\lambda$ independent of the learning rate $\\alpha$?`,
        steps: [
          { do: `Under L2, the decay enters the loss gradient and is then scaled by both the adaptive term and $\\alpha$, entangling $\\lambda$ with $\\alpha$ and with $\\hat v_t$.`, why: `Changing $\\alpha$ changes the effective decay, so they must be tuned together.` },
          { do: `Under AdamW, the decay term is a clean $\\eta_t\\,\\alpha\\,\\lambda\\,\\theta$ applied uniformly.`, why: `The shape of the decay no longer depends on per-weight gradient history.` }
        ],
        answer: `With L2 the effective regularization strength depends on $\\alpha$ and on each weight's $\\hat v_t$, so the optimal $\\lambda$ shifts whenever you change the learning rate &mdash; forcing a 2-D hyperparameter search. Decoupling makes the decay a uniform, predictable shrink, so $\\lambda$ and $\\alpha$ can be tuned on separate axes (a practical headline of Section 4).`
      }
    ]
  });

  window.CODE["paper-adamw"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the AdamW update from scratch with raw torch: first/second moments, bias correction, the adaptive ` +
      `step, and the DECOUPLED weight-decay term applied straight to the weight. Then prove it is identical to ` +
      `torch.optim.AdamW with torch.allclose over several steps, recompute the one-step worked example ` +
      `(theta 0.5 -> 0.3995), and contrast with the Adam+L2 variant. Runs in Colab (torch is preinstalled).`,
    code: `import torch

torch.manual_seed(0)

# ---- AdamW update FROM SCRATCH (Algorithm 2, Loshchilov & Hutter 2017) ----
def adamw_step(theta, m, v, g, t, lr=1e-2, beta1=0.9, beta2=0.999, eps=1e-8, wd=0.05):
    """One AdamW step. g is the LOSS gradient only (no lambda*theta folded in)."""
    m = beta1*m + (1-beta1)*g                 # 1st moment  (momentum)
    v = beta2*v + (1-beta2)*g*g               # 2nd moment  (RMSprop term)
    mhat = m / (1 - beta1**t)                  # bias correction
    vhat = v / (1 - beta2**t)
    # decoupled decay: wd*theta is added to the update directly, NOT through m,v
    theta = theta - lr*(mhat/(torch.sqrt(vhat)+eps) + wd*theta)
    return theta, m, v

# A fixed quadratic loss so the gradient is deterministic and reproducible.
A = torch.randn(4,4); A = A @ A.t() + torch.eye(4)   # symmetric positive-definite
b = torch.randn(4)
def loss_fn(p): return 0.5*(p @ A @ p) - b @ p       # grad = A p - b

theta0 = torch.randn(4)
LR, WD, STEPS = 1e-2, 0.05, 7

# ---- THE ORACLE: my AdamW must equal torch.optim.AdamW over several steps ----
p = theta0.clone().requires_grad_(True)
opt = torch.optim.AdamW([p], lr=LR, betas=(0.9,0.999), eps=1e-8, weight_decay=WD)
for _ in range(STEPS):
    opt.zero_grad(); loss_fn(p).backward(); opt.step()

theta = theta0.clone(); m = torch.zeros(4); v = torch.zeros(4)
for t in range(1, STEPS+1):
    th = theta.clone().requires_grad_(True)
    loss_fn(th).backward()                    # autograd gives the loss gradient
    g = th.grad
    theta, m, v = adamw_step(theta, m, v, g, t, lr=LR, wd=WD)

print("torch.optim.AdamW :", p.detach())
print("my AdamW          :", theta)
print("allclose (atol=1e-6):", torch.allclose(theta, p.detach(), atol=1e-6))  # expect True

# ---- recompute the worked example: one step, theta=0.5, g=0.2 ----
th = torch.tensor([0.5]); m0 = torch.zeros(1); v0 = torch.zeros(1)
th1, _, _ = adamw_step(th, m0, v0, torch.tensor([0.2]), t=1, lr=0.1, wd=0.01)
print("worked example theta_new:", round(th1.item(), 4))  # 0.3995
pp = torch.tensor([0.5], requires_grad=True)
o2 = torch.optim.AdamW([pp], lr=0.1, weight_decay=0.01)
o2.zero_grad(); pp.grad = torch.tensor([0.2]); o2.step()
print("torch one-step          :", round(pp.detach().item(), 4))  # 0.3995

# ---- contrast: Adam+L2 folds decay into the gradient (a DIFFERENT optimizer) ----
def adam_l2_step(theta, m, v, g, t, lr=1e-2, beta1=0.9, beta2=0.999, eps=1e-8, wd=0.05):
    g = g + wd*theta                           # decay folded into the gradient (the bug)
    m = beta1*m + (1-beta1)*g; v = beta2*v + (1-beta2)*g*g
    mhat = m/(1-beta1**t); vhat = v/(1-beta2**t)
    return theta - lr*(mhat/(torch.sqrt(vhat)+eps)), m, v
theta=theta0.clone(); m=torch.zeros(4); v=torch.zeros(4)
for t in range(1, STEPS+1):
    th=theta0.clone(); th=theta.clone().requires_grad_(True); loss_fn(th).backward()
    theta, m, v = adam_l2_step(theta, m, v, th.grad, t, lr=LR, wd=WD)
print("Adam+L2 differs from AdamW:", not torch.allclose(theta, p.detach(), atol=1e-6))  # expect True`
  };

  window.CODEVIZ["paper-adamw"] = {
    question: "Two weights both start at 3.0; we decay them toward 0 with the same lambda. One weight constantly receives LARGE loss-gradients, the other TINY ones. Does Adam+L2 shrink them equally — or does it regularize the small-gradient weight differently than AdamW does?",
    charts: [
      {
        type: "line",
        title: "The small-gradient weight, decayed under AdamW vs Adam+L2 (same lambda)",
        xlabel: "optimizer step",
        ylabel: "value of the small-gradient weight (target: 0)",
        series: [
          {
            name: "AdamW (decoupled decay)",
            color: "#7ee787",
            points: [[1,2.87],[3,2.6139],[5,2.3629],[7,2.1168],[9,1.8757],[11,1.6394],[13,1.4078],[15,1.1808],[17,0.9583],[19,0.7402],[21,0.5265],[23,0.317],[25,0.1117],[27,-0.0895],[29,-0.2868],[31,-0.4801],[33,-0.6695],[35,-0.8552],[37,-1.0372],[39,-1.2155],[40,-1.3034]]
          },
          {
            name: "Adam+L2 (decay in gradient)",
            color: "#ff7b72",
            points: [[1,2.9],[3,2.7004],[5,2.5016],[7,2.3045],[9,2.1095],[11,1.9174],[13,1.729],[15,1.5449],[17,1.3659],[19,1.1929],[21,1.0267],[23,0.8679],[25,0.7173],[27,0.5756],[29,0.4433],[31,0.321],[33,0.2091],[35,0.1078],[37,0.0173],[39,-0.0625],[40,-0.0983]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (torch, seed 1), not the paper's reported numbers. Two weights start at 3.0; coord 0 sees a large constant loss-gradient (1.0), coord 1 (shown) sees a tiny one (0.02); same lambda=0.1, lr=0.1. Under AdamW the decay is decoupled, so BOTH weights shrink at the same uniform rate and the small-gradient weight is driven well past 0 (ends ~-1.30, same as the large-gradient weight). Under Adam+L2 the decay term is divided by the weight's small sqrt(vhat); the small-gradient weight is regularized far LESS and barely reaches 0 (ends ~-0.10). This is Proposition 2 in miniature: L2 under Adam regularizes weights unevenly, AdamW regularizes them uniformly.",
    code: `import torch
torch.manual_seed(1)

def run(decoupled, steps=40):
    th = torch.tensor([3.0, 3.0])             # two weights to decay toward 0
    m = torch.zeros(2); v = torch.zeros(2)
    lr, b1, b2, eps, wd = 0.1, 0.9, 0.999, 1e-8, 0.1
    coord1 = []                               # track the SMALL-gradient weight
    for t in range(1, steps+1):
        g = torch.tensor([1.0, 0.02])         # coord0: big grad, coord1: tiny grad
        if not decoupled:
            g = g + wd*th                     # Adam+L2: fold decay into the gradient
        m = b1*m + (1-b1)*g; v = b2*v + (1-b2)*g*g
        mhat = m/(1-b1**t); vhat = v/(1-b2**t)
        if decoupled:
            th = th - lr*(mhat/(torch.sqrt(vhat)+eps) + wd*th)   # AdamW
        else:
            th = th - lr*(mhat/(torch.sqrt(vhat)+eps))           # Adam+L2
        coord1.append(round(th[1].item(), 4))
    return coord1, th

adamw, th_w = run(True)
adaml2, th_l = run(False)
print("AdamW   small-grad weight final:", th_w[1].item())   # ~ -1.3034
print("Adam+L2 small-grad weight final:", th_l[1].item())   # ~ -0.0983
print("AdamW   regularizes it ~13x more by step 40.")`
  };
})();
