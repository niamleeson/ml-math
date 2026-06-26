/* Paper lesson — Weight Normalization (Salimans & Kingma, 2016).
   Grounded from arXiv:1602.07868 (abstract + ar5iv HTML, Section 2, Eq. 2; Section 2.1, Eq. 3; Section 3).
   Track A (primitive): build a weight-normalized linear layer from scratch (w = g*v/||v||),
   verify with torch.allclose vs torch.nn.utils.weight_norm(nn.Linear).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-weightnorm". */
(function () {
  window.LESSONS.push({
    id: "paper-weightnorm",
    title: "Weight Normalization — A Simple Reparameterization to Accelerate Training of Deep Neural Networks (2016)",
    tagline: "Split each weight vector into a length and a direction, and train the two separately — so optimization is better conditioned and SGD converges faster.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Tim Salimans, Diederik P. Kingma",
      org: "OpenAI",
      year: 2016,
      venue: "arXiv preprint (arXiv:1602.07868); NeurIPS 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1602.07868",
      code: ""
    },

    conceptLink: null,
    partOf: [],
    prereqs: ["dl-backprop", "dl-init", "pt-nn-module", "pt-autograd", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A layer in a neural network multiplies its input by a <b>weight vector</b> $\\mathbf{w}$
       (a list of numbers, one per input). During training we nudge every number in $\\mathbf{w}$ by gradient
       descent (take a small step downhill on the loss). A single vector $\\mathbf{w}$ secretly carries two
       different things at once: <b>how long it is</b> (its magnitude, written $\\lVert\\mathbf{w}\\rVert$ &mdash;
       roughly "how strongly this neuron fires") and <b>which way it points</b> (its direction &mdash; "what
       pattern the neuron looks for").</p>
       <p>When these two are tangled together in one vector, the loss surface is <b>badly conditioned</b>:
       a step that is the right size for the direction can be the wrong size for the magnitude, and vice versa.
       The fix the field reached for was <b>Batch Normalization</b> (BN) &mdash; normalize each layer's
       <i>activations</i> over the mini-batch. But BN ties every example in a batch to every other example
       (its statistics are computed across the batch), which is awkward for recurrent networks, for
       reinforcement learning, and for any setting where you want each example handled independently or the
       batch is tiny.</p>`,

    contribution:
      `<p>The paper proposes normalizing the <b>weights</b> instead of the activations. Its contributions:</p>
       <ul>
         <li><b>The reparameterization $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$.</b> Replace the
         single weight vector $\\mathbf{w}$ with two new trainable things: a scalar $g$ that sets the
         <b>length</b>, and a vector $\\mathbf{v}$ whose <b>direction</b> alone matters (its length is divided
         out). This decouples magnitude from direction, so gradient descent can adjust each cleanly. (Eq. 2,
         Section 2.)</li>
         <li><b>A data-dependent initialization.</b> Run one mini-batch through the network and set $g$ and the
         biases so that every neuron's pre-activation starts with mean $0$ and variance $1$. (Section 3.)</li>
         <li><b>No batch dependence.</b> Because the normalization is on the weights, the output for one example
         never depends on the other examples in the batch. This makes it a drop-in for recurrent nets, noise-
         sensitive models, and reinforcement learning, where BN struggles. (Abstract.)</li>
       </ul>`,

    whyItMattered:
      `<p>Weight normalization gives much of BN's optimization benefit &mdash; better conditioning, higher
       usable learning rates, faster convergence &mdash; with <b>negligible computational overhead</b> and
       <b>no dependence between examples</b>. The paper reports gains on supervised image classification,
       generative models (variational autoencoders), and reinforcement learning (deep Q-learning). The idea
       of separating a weight's length from its direction reappears later in normalization research, and the
       data-dependent init it introduced influenced how people warm-start normalized networks.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the one-sentence idea (decouple length from direction) and why it helps
         where BN does not.</li>
         <li><b>Section 2 and Eq. 2</b> &mdash; the reparameterization $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$.
         This is the whole method.</li>
         <li><b>Section 2.1 and Eq. 3</b> &mdash; the gradients with respect to $g$ and $\\mathbf{v}$, which show
         <i>why</i> the conditioning improves (the update to $\\mathbf{v}$ is automatically scaled and projected).</li>
         <li><b>Section 3</b> &mdash; the data-dependent initialization (one forward pass to set $g$ and biases).</li>
       </ul>
       <p><b>Skim:</b> the experiments (CIFAR-10, VAE, DQN) for the qualitative result &mdash; faster, more
       stable training. You do not need the per-run hyperparameters.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will fit the same linear model on the same badly-scaled data twice,
       at the same (deliberately high) learning rate &mdash; once with the plain weight $\\mathbf{w}$, once with
       the reparameterized $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$. They start from the identical
       weight. Will the weight-normalized version stay <b>stable</b> while the plain version <b>diverges</b> (its
       loss blows up) at that learning rate? Write down your guess, then look at the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write a weight-normalized linear layer using raw tensors, no
       <code>torch.nn.utils.weight_norm</code>:</p>
       <ul>
         <li>Store two parameters per output unit: a direction vector <code>v</code> and a length scalar
         <code>g</code>. <code># TODO: self.v = nn.Parameter(...); self.g = nn.Parameter(...)</code></li>
         <li>Reconstruct the effective weight on each forward pass:
         <code># TODO: w = g * v / v.norm()</code> &mdash; divide by the Euclidean norm of <code>v</code> so the
         direction is unit-length and <code>g</code> alone controls the magnitude.</li>
         <li>Then do the usual linear step: <code># TODO: return x @ w.t() + bias</code>.</li>
       </ul>
       <p>The CODE cell below is the full reference, including the <code>torch.allclose</code> check against
       PyTorch's built-in <code>weight_norm</code> &mdash; that passing check is the proof your formula computes
       exactly the same function.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Take any neuron whose weight is a vector $\\mathbf{w}$. Weight normalization rewrites it as a product
       of two trainable pieces:</p>
       <ol>
         <li><b>A direction vector $\\mathbf{v}$.</b> Only its <i>direction</i> is used; we immediately divide by
         its own length $\\lVert\\mathbf{v}\\rVert$, so $\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$ is a unit vector
         (length exactly $1$). Changing the overall scale of $\\mathbf{v}$ does nothing to the layer's output.</li>
         <li><b>A length scalar $g$.</b> Multiply the unit direction by $g$. Because the direction has length $1$,
         the final weight has length exactly $\\lVert\\mathbf{w}\\rVert=g$. So $g$ <i>is</i> the magnitude of the
         neuron's weight, controlled by a single dedicated number.</li>
       </ol>
       <p>Now gradient descent optimizes $g$ and $\\mathbf{v}$ separately. The key fact (from the gradient in
       Eq. 3) is that the update to $\\mathbf{v}$ is <b>automatically rescaled by $g/\\lVert\\mathbf{v}\\rVert$ and
       projected to be perpendicular to $\\mathbf{v}$</b> &mdash; it only ever changes the <i>direction</i>, never
       the length. The length is handled solely by $g$. This separation is what improves the conditioning of the
       optimization: a learning rate that suits the direction no longer has to also suit the magnitude.</p>
       <p>Unlike Batch Normalization, none of this looks at other examples in the batch. The weight is normalized
       deterministically from $g$ and $\\mathbf{v}$ alone, so the method works for one example at a time.</p>`,

    architecture:
      `<p>Look at one neuron and rebuild it part by part. In a plain layer the neuron owns a single weight vector
       $\\mathbf{w}$ (one number per input feature) and a bias $b$, and computes
       $y=\\phi(\\mathbf{w}\\cdot\\mathbf{x}+b)$ &mdash; the input dotted with the weight, plus the bias, run through
       an activation $\\phi$. Weight normalization keeps the same neuron and the same output, but <b>swaps what is
       stored</b>.</p>
       <ol>
         <li><b>The trained parameters become $\\mathbf{v}$, $g$, and $b$.</b> Instead of storing $\\mathbf{w}$, the
         neuron stores a <i>direction vector</i> $\\mathbf{v}$ (same shape as $\\mathbf{w}$, one entry per input), a
         single <i>length scalar</i> $g$, and the bias $b$. These three are the variables the optimizer updates;
         $\\mathbf{w}$ itself is never stored &mdash; it is recomputed every forward pass. (Eq. 2.)</li>
         <li><b>Rebuild the weight: $\\mathbf{w}=\\frac{g}{\\lVert\\mathbf{v}\\rVert}\\,\\mathbf{v}$.</b> First take the
         length of the direction, $\\lVert\\mathbf{v}\\rVert$ (square root of the sum of its squared entries). Divide
         $\\mathbf{v}$ by it to get a unit vector $\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$ (length exactly $1$), then
         multiply by $g$. The result has length exactly $g$, so $g$ alone is the neuron's weight magnitude and
         $\\mathbf{v}$ alone is its pattern. (Eq. 2.)</li>
         <li><b>Forward: $y=\\phi(\\mathbf{w}\\cdot\\mathbf{x}+b)$.</b> With the rebuilt $\\mathbf{w}$, the neuron
         computes its output exactly as before &mdash; dot with the input, add the bias, apply the activation.
         Nothing downstream changes; a weight-normalized layer is a drop-in replacement for an ordinary one.</li>
       </ol>
       <p><b>For a whole layer.</b> A linear layer is a stack of these neurons: its weight is a matrix with one
       <i>row</i> per output neuron. So $\\mathbf{v}$ is a matrix of the same shape, the norm is taken
       <b>per row</b> (over the input dimension), and there is one $g$ per row &mdash; in PyTorch terms, $\\mathbf{v}$
       is <code>weight_v</code> with shape $(\\text{out},\\text{in})$ and $g$ is <code>weight_g</code> with shape
       $(\\text{out},1)$, so the division broadcasts cleanly down each row.</p>
       <p><b>Where the gradients go.</b> Autograd flows the usual $\\nabla_{\\mathbf{w}}L$ back through the rebuild
       step and splits it into two updates: $\\nabla_g L=\\nabla_{\\mathbf{w}}L\\cdot\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$
       (the part of the gradient along the direction, which moves the length) and
       $\\nabla_{\\mathbf{v}}L=\\frac{g}{\\lVert\\mathbf{v}\\rVert}\\nabla_{\\mathbf{w}}L-\\frac{g\\,\\nabla_g L}{\\lVert\\mathbf{v}\\rVert^{2}}\\mathbf{v}$
       (the part perpendicular to the direction, which rotates it without lengthening). So the two trained
       parameters update along two non-interfering axes. (Eq. 3, Section 2.1.)</p>
       <p><b>The mean-only batch-norm variant (Section 4).</b> The paper also pairs the reparameterization with a
       cheap centering step. Compute the raw pre-activation $t=\\mathbf{w}\\cdot\\mathbf{x}$, subtract only its
       minibatch <i>mean</i> $\\mu[t]$ (no division by standard deviation, unlike full batch norm), then add the
       bias: $\\tilde{t}=t-\\mu[t]+b$ and $y=\\phi(\\tilde{t})$. Keeping just the mean keeps the per-example noise
       small while still centering the gradients &mdash; a lighter complement to weight norm.</p>
       <p><b>The data-dependent initialization step (Section 3).</b> Before training, the parameters are seeded so
       every neuron starts in a healthy range. First sample $\\mathbf{v}$ from a small normal distribution and fix
       its direction. Then push one mini-batch through and, per neuron, measure the pre-activation
       $t=\\mathbf{v}\\cdot\\mathbf{x}/\\lVert\\mathbf{v}\\rVert$ over that batch &mdash; its mean $\\mu[t]$ and
       standard deviation $\\sigma[t]$. Set the length to $g\\leftarrow 1/\\sigma[t]$ and the bias to
       $b\\leftarrow -\\mu[t]/\\sigma[t]$, so the post-init pre-activation $y=(t-\\mu[t])/\\sigma[t]$ starts with mean
       $0$ and variance $1$ across that batch. After this one-time pass, $g$ and $b$ become ordinary trained
       parameters and training proceeds normally.</p>
       <p><b>Per-step data flow (after init).</b> Each forward pass: (1) read $\\mathbf{v},g,b$; (2) compute
       $\\lVert\\mathbf{v}\\rVert$ and rebuild $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$; (3) output
       $y=\\phi(\\mathbf{w}\\cdot\\mathbf{x}+b)$. Each backward pass: autograd returns $\\nabla_{\\mathbf{w}}L$, the
       rebuild step splits it into $\\nabla_g L$ and $\\nabla_{\\mathbf{v}}L$, and the optimizer steps $g$ and
       $\\mathbf{v}$ (and $b$) &mdash; never touching any other example in the batch.</p>`,

    symbols: [
      { sym: "$\\mathbf{w}$", desc: "the weight vector of one neuron: the list of numbers the layer multiplies its input by (one per input feature)." },
      { sym: "$\\mathbf{v}$", desc: "the new direction parameter: a vector whose direction is used after dividing out its own length. Trained by gradient descent." },
      { sym: "$\\lVert\\mathbf{v}\\rVert$", desc: "the Euclidean norm (length) of $\\mathbf{v}$: the square root of the sum of its squared entries. We divide by it so $\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$ has length exactly 1." },
      { sym: "$\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$", desc: "the unit direction: $\\mathbf{v}$ scaled to length 1, carrying only the 'which way it points' information." },
      { sym: "$g$", desc: "the new length parameter: a single scalar that sets the magnitude of the weight. After reparameterizing, $\\lVert\\mathbf{w}\\rVert=g$. Trained by gradient descent." },
      { sym: "$\\nabla_{\\mathbf{w}}L$", desc: "the gradient of the loss $L$ with respect to the original weight $\\mathbf{w}$: the direction in weight space that would most increase the loss (what ordinary backprop gives you)." },
      { sym: "$\\nabla_g L$", desc: "the gradient with respect to the length scalar $g$ (how the loss changes if we lengthen or shorten the weight)." },
      { sym: "$\\nabla_{\\mathbf{v}}L$", desc: "the gradient with respect to the direction parameter $\\mathbf{v}$ (how the loss changes if we rotate the weight)." },
      { sym: "conditioning", desc: "how well-shaped the loss surface is for gradient descent. 'Better conditioned' means a single step size works well in all directions, so you can use a larger learning rate without diverging." },
      { sym: "Batch Normalization (BN)", desc: "the prior method this paper contrasts with: it normalizes a layer's outputs using mean and variance computed across the mini-batch, which couples the examples together." },
      { sym: "data-dependent initialization", desc: "the paper's startup trick: run one mini-batch through the net and set $g$ and the biases so each neuron's pre-activation begins with mean 0 and variance 1." },
      { sym: "$\\mathbf{x}$", desc: "the input vector fed to the neuron during the initialization forward pass (one example's features)." },
      { sym: "$t$", desc: "the neuron's pre-activation before scaling: $t=\\mathbf{v}\\cdot\\mathbf{x}/\\lVert\\mathbf{v}\\rVert$, the input dotted with the unit direction. Used only in the data-dependent init." },
      { sym: "$\\mu[t]$", desc: "the mean of the pre-activation $t$ over the one initialization mini-batch (average across examples)." },
      { sym: "$\\sigma[t]$", desc: "the standard deviation of the pre-activation $t$ over the initialization mini-batch (spread across examples)." },
      { sym: "$b$", desc: "the neuron's bias: the constant added after the weighted sum. Set during init to $-\\mu[t]/\\sigma[t]$ so the pre-activation has mean 0." },
      { sym: "$M_{\\mathbf{w}}$", desc: "the projection matrix $I-\\mathbf{w}\\mathbf{w}^{\\top}/\\lVert\\mathbf{w}\\rVert^{2}$ that removes the component of a vector along $\\mathbf{w}$; the paper uses it to write the $\\mathbf{v}$-gradient as a single projection of $\\nabla_{\\mathbf{w}}L$." },
      { sym: "$I$", desc: "the identity matrix (leaves a vector unchanged when multiplied), used inside the projection matrix $M_{\\mathbf{w}}$." }
    ],

    formula:
      `$$\\mathbf{w}=\\frac{g}{\\lVert\\mathbf{v}\\rVert}\\,\\mathbf{v},
        \\qquad\\text{so that}\\qquad \\lVert\\mathbf{w}\\rVert=g.$$
       <p>The reparameterization (Eq. 2, Section 2): the weight $\\mathbf{w}$ is a length $g$ times the unit
       direction $\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$, which forces $\\lVert\\mathbf{w}\\rVert=g$.</p>
       $$\\nabla_{g}L=\\frac{\\nabla_{\\mathbf{w}}L\\cdot\\mathbf{v}}{\\lVert\\mathbf{v}\\rVert},
        \\qquad
        \\nabla_{\\mathbf{v}}L=\\frac{g}{\\lVert\\mathbf{v}\\rVert}\\,\\nabla_{\\mathbf{w}}L
        -\\frac{g\\,\\nabla_{g}L}{\\lVert\\mathbf{v}\\rVert^{2}}\\,\\mathbf{v}.$$
       <p>The gradients (Eq. 3, Section 2.1): $\\nabla_g L$ projects the ordinary gradient $\\nabla_{\\mathbf{w}}L$
       onto the direction $\\mathbf{v}$; $\\nabla_{\\mathbf{v}}L$ is the same gradient scaled by
       $g/\\lVert\\mathbf{v}\\rVert$ with its component along $\\mathbf{v}$ subtracted out, so it is perpendicular
       to $\\mathbf{v}$. An equivalent form given in the paper writes
       $\\nabla_{\\mathbf{v}}L=\\frac{g}{\\lVert\\mathbf{v}\\rVert}M_{\\mathbf{w}}\\,\\nabla_{\\mathbf{w}}L$ with the
       projection matrix $M_{\\mathbf{w}}=I-\\frac{\\mathbf{w}\\mathbf{w}^{\\top}}{\\lVert\\mathbf{w}\\rVert^{2}}$.</p>
       $$t=\\frac{\\mathbf{v}\\cdot\\mathbf{x}}{\\lVert\\mathbf{v}\\rVert},
        \\qquad
        g\\leftarrow\\frac{1}{\\sigma[t]},
        \\qquad
        b\\leftarrow-\\frac{\\mu[t]}{\\sigma[t]}.$$
       <p>The data-dependent initialization (Section 3): for each neuron, compute the pre-activation
       $t=\\mathbf{v}\\cdot\\mathbf{x}/\\lVert\\mathbf{v}\\rVert$ over one mini-batch, then set the length $g$ and
       bias $b$ from the batch mean $\\mu[t]$ and standard deviation $\\sigma[t]$ of $t$ so that the post-init
       pre-activation $y=g\\,t+b$ starts with mean $0$ and variance $1$ across that batch.</p>`,

    whatItDoes:
      `<p>The top equation (Eq. 2, Section 2) is the whole reparameterization: build the weight $\\mathbf{w}$ as a
       length $g$ times a unit direction $\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$, which forces
       $\\lVert\\mathbf{w}\\rVert=g$. The bottom two equations (Eq. 3, Section 2.1) are the gradients backprop
       computes from the usual $\\nabla_{\\mathbf{w}}L$. The first projects $\\nabla_{\\mathbf{w}}L$ onto the
       direction $\\mathbf{v}$ to update the length $g$. The second takes the part of $\\nabla_{\\mathbf{w}}L$
       that is <b>perpendicular</b> to $\\mathbf{v}$ (the subtraction removes the component along $\\mathbf{v}$)
       and scales it by $g/\\lVert\\mathbf{v}\\rVert$ &mdash; so updating $\\mathbf{v}$ only ever rotates the weight,
       never lengthens it.</p>
       <p>The last block (Section 3) is the data-dependent initialization. After sampling $\\mathbf{v}$, it pushes
       one mini-batch through, measures the pre-activation $t=\\mathbf{v}\\cdot\\mathbf{x}/\\lVert\\mathbf{v}\\rVert$
       for each neuron, and chooses $g=1/\\sigma[t]$ and $b=-\\mu[t]/\\sigma[t]$. Dividing by $\\sigma[t]$ rescales
       the pre-activation to unit variance and subtracting $\\mu[t]/\\sigma[t]$ re-centers it to zero mean &mdash;
       so every neuron starts in a healthy range, the one-time benefit batch norm gives for free.</p>`,

    derivation:
      `<p>There is no separate concept lesson for this primitive, so here is the full reasoning.</p>
       <p><b>Why $\\lVert\\mathbf{w}\\rVert=g$.</b> By construction $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$.
       The length of a scaled vector is the scale times the length:
       $\\lVert\\mathbf{w}\\rVert=g\\cdot\\lVert\\mathbf{v}\\rVert/\\lVert\\mathbf{v}\\rVert=g$. So $g$ literally
       <i>is</i> the magnitude, and the magnitude no longer depends on $\\mathbf{v}$ at all.</p>
       <p><b>Why the $\\mathbf{v}$-update is perpendicular to $\\mathbf{v}$.</b> Take the gradient of $g$ from
       Eq. 3, $\\nabla_g L=(\\nabla_{\\mathbf{w}}L\\cdot\\mathbf{v})/\\lVert\\mathbf{v}\\rVert$, and substitute it
       into $\\nabla_{\\mathbf{v}}L$. Dot both sides with $\\mathbf{v}$:</p>
       $$\\mathbf{v}\\cdot\\nabla_{\\mathbf{v}}L
         =\\frac{g}{\\lVert\\mathbf{v}\\rVert}(\\mathbf{v}\\cdot\\nabla_{\\mathbf{w}}L)
         -\\frac{g\\,\\nabla_g L}{\\lVert\\mathbf{v}\\rVert^{2}}(\\mathbf{v}\\cdot\\mathbf{v}).$$
       <p>Since $\\mathbf{v}\\cdot\\mathbf{v}=\\lVert\\mathbf{v}\\rVert^{2}$ and
       $\\mathbf{v}\\cdot\\nabla_{\\mathbf{w}}L=\\lVert\\mathbf{v}\\rVert\\,\\nabla_g L$, the two terms become
       $g\\,\\nabla_g L-g\\,\\nabla_g L=0$. So $\\nabla_{\\mathbf{v}}L$ is exactly perpendicular to $\\mathbf{v}$:
       a gradient step on $\\mathbf{v}$ changes only the direction, leaving its length (and hence the magnitude
       $g$) untouched. The paper notes this projection grows $\\lVert\\mathbf{v}\\rVert$ over training, which
       <b>automatically shrinks the effective step on the direction</b> &mdash; a self-stabilizing effect that
       improves conditioning. This is the optimization advantage in one line of algebra.</p>`,

    example:
      `<p><b>Worked numbers.</b> Take a 2-input neuron with direction $\\mathbf{v}=[3,\\,4]$ and length $g=10$.</p>
       <ul>
         <li>Length of the direction: $\\lVert\\mathbf{v}\\rVert=\\sqrt{3^{2}+4^{2}}=\\sqrt{9+16}=\\sqrt{25}=5$.</li>
         <li>Reparameterized weight: $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert
         =10\\cdot[3,4]/5=[6,\\,8]$.</li>
         <li>Check the magnitude: $\\lVert\\mathbf{w}\\rVert=\\sqrt{6^{2}+8^{2}}=\\sqrt{36+64}=\\sqrt{100}=10=g$. ✓</li>
       </ul>
       <p><b>One gradient step.</b> Suppose backprop gives $\\nabla_{\\mathbf{w}}L=[1,\\,1]$.</p>
       <ul>
         <li>$\\nabla_g L=(\\nabla_{\\mathbf{w}}L\\cdot\\mathbf{v})/\\lVert\\mathbf{v}\\rVert
         =(1\\cdot3+1\\cdot4)/5=7/5=1.4$.</li>
         <li>$\\nabla_{\\mathbf{v}}L=(g/\\lVert\\mathbf{v}\\rVert)\\nabla_{\\mathbf{w}}L
         -(g\\,\\nabla_g L/\\lVert\\mathbf{v}\\rVert^{2})\\mathbf{v}
         =(10/5)[1,1]-(10\\cdot1.4/25)[3,4]$
         $=[2,2]-0.56\\cdot[3,4]=[2,2]-[1.68,2.24]=[0.32,\\,-0.24]$.</li>
         <li>Check it is perpendicular to $\\mathbf{v}$: $\\mathbf{v}\\cdot\\nabla_{\\mathbf{v}}L
         =3\\cdot0.32+4\\cdot(-0.24)=0.96-0.96=0$. ✓ The direction update does not touch the length.</li>
       </ul>
       <p>The CODE cell recomputes these exact numbers and prints them, and checks the weight against PyTorch's
       built-in <code>weight_norm</code>.</p>`,

    recipe:
      `<p><b>The method as numbered steps:</b></p>
       <ol>
         <li>For each neuron, store a direction vector $\\mathbf{v}$ and a length scalar $g$ instead of a single
         weight $\\mathbf{w}$.</li>
         <li>On every forward pass, compute $\\lVert\\mathbf{v}\\rVert$ and rebuild
         $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$.</li>
         <li>Use $\\mathbf{w}$ in the layer exactly as before (e.g. $\\mathbf{w}\\cdot\\mathbf{x}+b$).</li>
         <li>Let autograd backprop through the reparameterization &mdash; the gradients in Eq. 3 fall out
         automatically.</li>
         <li>(Initialization, Section 3) Sample $\\mathbf{v}$ from a small normal, then run one mini-batch and set
         each $g$ and bias so the pre-activations have mean $0$ and variance $1$.</li>
       </ol>`,

    results:
      `<p>Quoted from the abstract: weight normalization is "inspired by batch normalization but does not
       introduce any dependencies between the examples in a minibatch," and it "speed[s] up convergence of
       stochastic gradient descent." The paper reports the method "can be applied successfully to recurrent
       models such as LSTMs and to applications such as deep reinforcement learning or generative models, for
       which batch normalization is less well suited." The paper demonstrates this across supervised image
       classification (CIFAR-10), generative models, and deep reinforcement learning; the exact per-experiment
       numbers are in the paper's experiments section. (Source: arXiv:1602.07868 abstract.)</p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> This is a primitive (Track A), so "working" means <b>exact numerical
       equivalence</b>, not an accuracy score. The primary check is
       $\\texttt{torch.allclose(mine(x), weight\\_norm(nn.Linear)(x), atol=1e-6)}$ &mdash; your from-scratch
       $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$ layer must compute the <i>same function</i> as
       PyTorch's built-in <code>weight_norm</code>. The "no-skill" baseline here is unambiguous: anything other
       than $\\texttt{True}$ means a bug. The secondary, paper-aligned metric is <b>training stability /
       conditioning</b>: at a deliberately high learning rate on badly-scaled data, the weight-normalized run
       should converge while the plain run diverges (the CODEVIZ experiment).</p>
       <ul>
         <li><b>Sanity checks before any training.</b> (1) Per-row norm of the rebuilt weight must equal $g$:
         $\\lVert\\mathbf{w}_{\\text{row}}\\rVert=g$ for every output neuron (the design guarantee
         $\\lVert\\mathbf{w}\\rVert=g$). (2) Recompute the worked example $\\mathbf{v}=[3,4],\\,g=10\\Rightarrow
         \\mathbf{w}=[6,8]$ and the Eq. 3 gradients $\\nabla_g L=1.4,\\ \\nabla_{\\mathbf{v}}L=[0.32,-0.24]$ as a
         known-answer unit test. (3) Confirm the $\\mathbf{v}$-update is perpendicular:
         $\\mathbf{v}\\cdot\\nabla_{\\mathbf{v}}L\\approx 0$ &mdash; this is the load-bearing property, so check it
         to machine precision. (4) Scaling $\\mathbf{v}$ by any constant must leave $\\mathbf{w}$ (and the output)
         unchanged.</li>
         <li><b>Expected range.</b> The allclose is binary &mdash; expect <code>True</code> at
         $\\texttt{atol=1e-6}$; if it fails, the bug is structural (wrong norm axis or wrong $g$ shape), not
         "tuning." For the conditioning demo, our seeded run goes from loss $\\approx 322$ to $\\approx 2.6$ stable
         (weight-normalized) versus the plain run blowing past $10^6$ within $\\sim 8$ steps &mdash; these are
         <i>our</i> small-scale numbers, not the paper's. The paper reports only qualitative gains (faster, more
         stable SGD on CIFAR-10 / VAE / DQN; arXiv:1602.07868 abstract), so do not target a specific accuracy.</li>
         <li><b>Ablation &mdash; prove the reparameterization earns its keep.</b> The central knob is the
         length/direction split. Turn it OFF by training the same model with a <b>plain weight $\\mathbf{w}$</b>
         (no $g,\\mathbf{v}$) from the identical start at the same high learning rate: stability should
         <b>collapse</b> (the loss diverges). If the plain run is just as stable, your learning rate is too low to
         expose the conditioning difference &mdash; raise it until plain diverges, then confirm weight-norm still
         holds. A second ablation: take the norm over the <i>wrong</i> axis &mdash; the allclose flips to
         <code>False</code>, proving the per-output-row normalization is what matters.</li>
         <li><b>Failure signals &amp; what they mean.</b> <i>allclose is <code>False</code></i> &rarr; norm taken
         over the wrong axis (must be per output row, <code>dim=0</code>/over the input dim), or $g$ copied with
         the wrong shape (PyTorch stores it as $(\\text{out},1)$). <i>NaN in $\\mathbf{w}$</i> &rarr;
         $\\lVert\\mathbf{v}\\rVert=0$ (initialize $\\mathbf{v}$ from a normal so it is never the zero vector).
         <i>Both runs diverge</i> &rarr; learning rate too high even for the well-conditioned case, or the
         data-dependent init was skipped. <i>$\\mathbf{v}\\cdot\\nabla_{\\mathbf{v}}L\\ne 0$</i> &rarr; the
         gradient split is wrong &mdash; you are leaking length into the direction update, so the decoupling that
         makes the method work is broken.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>torch.nn.utils.weight_norm</code> (now also
       <code>torch.nn.utils.parametrizations.weight_norm</code>) in one call. Here you <b>build it from scratch</b>
       with raw tensors: store $g$ and $\\mathbf{v}$, and reconstruct $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$
       on each forward pass. The payoff is the <code>torch.allclose(mine(x), weight_norm(nn.Linear)(x))</code>
       check &mdash; if it passes, your reparameterized layer computes provably the same function as PyTorch's.</p>`,

    pitfalls:
      `<ul>
         <li><b>Which axis to normalize.</b> A linear layer's weight is a matrix (one row per output neuron). The
         norm is taken <b>per output row</b> (over the input dimension), giving one $g$ per neuron. PyTorch's
         <code>weight_norm(..., dim=0)</code> does this. Normalizing over the wrong axis silently builds a
         different layer and the allclose fails.</li>
         <li><b>$g$'s shape.</b> PyTorch stores $g$ (its <code>weight_g</code>) with shape
         <code>(out_features, 1)</code>, not a flat vector. Match that shape when you copy parameters across, or
         broadcasting will misalign.</li>
         <li><b>Deprecated vs new API.</b> <code>torch.nn.utils.weight_norm</code> still works but is deprecated in
         favor of <code>torch.nn.utils.parametrizations.weight_norm</code>; both implement the same Eq. 2. Either
         is a valid oracle for the allclose check.</li>
         <li><b>Dividing by zero.</b> If $\\mathbf{v}$ is ever the zero vector, $\\lVert\\mathbf{v}\\rVert=0$ and
         the reparameterization is undefined. Initialize $\\mathbf{v}$ from a normal distribution so it is never
         exactly zero.</li>
         <li><b>It is not Batch Normalization.</b> Weight norm normalizes the <i>weights</i>, deterministically,
         per example. It does <b>not</b> compute batch statistics and has no train/eval distinction the way BN
         does. Expect optimization benefits, not BN's regularization-from-batch-noise.</li>
       </ul>`,

    recall: [
      "Write the reparameterization from memory: $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert$, and state what $\\lVert\\mathbf{w}\\rVert$ equals.",
      "What do $g$ and $\\mathbf{v}$ each control, and why does separating them help optimization?",
      "Show that the gradient $\\nabla_{\\mathbf{v}}L$ is perpendicular to $\\mathbf{v}$ (so the direction update never changes the length).",
      "Name one setting where weight normalization is preferred over batch normalization, and say why."
    ],

    practice: [
      {
        q: `A neuron has direction $\\mathbf{v}=[0,\\,5,\\,12]$ and length $g=26$. Compute the reparameterized weight $\\mathbf{w}$ and verify $\\lVert\\mathbf{w}\\rVert=g$.`,
        steps: [
          { do: `Length of the direction: $\\lVert\\mathbf{v}\\rVert=\\sqrt{0^2+5^2+12^2}=\\sqrt{0+25+144}=\\sqrt{169}=13$.`, why: `Need the unit direction, so divide by this.` },
          { do: `Weight: $\\mathbf{w}=g\\,\\mathbf{v}/\\lVert\\mathbf{v}\\rVert=26\\cdot[0,5,12]/13=2\\cdot[0,5,12]=[0,10,24]$.`, why: `Scale the unit direction by $g$.` },
          { do: `Magnitude: $\\lVert\\mathbf{w}\\rVert=\\sqrt{0^2+10^2+24^2}=\\sqrt{0+100+576}=\\sqrt{676}=26$.`, why: `Confirms the design: the length equals $g$.` }
        ],
        answer: `$\\mathbf{w}=[0,\\,10,\\,24]$ and $\\lVert\\mathbf{w}\\rVert=26=g$. Doubling or halving $\\mathbf{v}$ would not change $\\mathbf{w}$ at all — only its direction matters.`
      },
      {
        q: `With $\\mathbf{v}=[3,4]$, $g=10$, and $\\nabla_{\\mathbf{w}}L=[1,1]$, the worked example gave $\\nabla_g L=1.4$ and $\\nabla_{\\mathbf{v}}L=[0.32,-0.24]$. After one gradient-descent step with learning rate $0.1$, what are the new $g$ and $\\mathbf{v}$, and did the direction's length change?`,
        steps: [
          { do: `Update $g$: $g \\leftarrow g - 0.1\\cdot\\nabla_g L = 10 - 0.1\\cdot1.4 = 9.86$.`, why: `Plain gradient step on the length scalar.` },
          { do: `Update $\\mathbf{v}$: $\\mathbf{v}\\leftarrow[3,4]-0.1\\cdot[0.32,-0.24]=[2.968,\\,4.024]$.`, why: `Plain gradient step on the direction.` },
          { do: `New length of $\\mathbf{v}$: $\\sqrt{2.968^2+4.024^2}=\\sqrt{8.809+16.193}\\approx\\sqrt{25.00}\\approx5.0002$.`, why: `Because the update was perpendicular to $\\mathbf{v}$, its length is unchanged to first order.` }
        ],
        answer: `$g=9.86$, $\\mathbf{v}\\approx[2.968,4.024]$. The length of $\\mathbf{v}$ stays $\\approx5$ — the perpendicular update rotated the direction without lengthening it, exactly as the gradient algebra predicts. The magnitude of the effective weight is controlled solely by $g$ (now $9.86$).`
      },
      {
        q: `Ablation. In the CODEVIZ both runs start from the identical weight and use the same high learning rate, but the plain (unnormalized) run diverges while the weight-normalized run stays stable. Why does the reparameterization prevent the blow-up?`,
        steps: [
          { do: `Note the data has one feature on a much larger scale than the others, so the loss surface is badly conditioned — the right step size differs wildly across directions.`, why: `This is the conditioning problem weight norm targets.` },
          { do: `In the plain run, one large learning rate has to serve both the magnitude and the direction of $\\mathbf{w}$; for the steep direction it is far too big, so the weight overshoots and the loss explodes.`, why: `Magnitude and direction are tangled in one vector.` },
          { do: `In the weight-normalized run, the direction update is automatically scaled by $g/\\lVert\\mathbf{v}\\rVert$ and projected perpendicular to $\\mathbf{v}$, and the magnitude is handled by its own scalar $g$. Neither piece overshoots.`, why: `Decoupling lets each be updated at its own appropriate effective rate.` }
        ],
        answer: `Plain gradient descent diverges (loss past $10^6$ within a few steps in our run) because a single learning rate is wrong for the tangled magnitude+direction. Weight normalization decouples them: the self-scaling, perpendicular update on $\\mathbf{v}$ plus the separate $g$ keeps the step well-sized, so the loss descends steadily and stays bounded. This reproduces the paper's qualitative claim that the reparameterization improves conditioning and lets you train stably at higher learning rates.`
      }
    ]
  });

  window.CODE["paper-weightnorm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build a weight-normalized linear layer from scratch: store a direction v and a length g, and rebuild ` +
      `the effective weight w = g * v / ||v|| on each forward pass. Then prove it computes the same function ` +
      `as PyTorch's torch.nn.utils.weight_norm via torch.allclose, recompute the [3,4],g=10 worked example ` +
      `(weight AND the Eq.3 gradients), and drop the layer into a 2-layer net. Runs in Colab (torch preinstalled).`,
    code: `import torch, torch.nn as nn
torch.manual_seed(0)

class MyWeightNormLinear(nn.Module):
    """Linear layer with weight normalization from scratch.
       w = g * v / ||v||   — Salimans & Kingma (2016), Eq. 2.
       One length g per output neuron; norm taken over the input dim (dim=1 of the weight)."""
    def __init__(self, in_f, out_f):
        super().__init__()
        self.v    = nn.Parameter(torch.randn(out_f, in_f))   # direction  (per output row)
        self.g    = nn.Parameter(torch.randn(out_f, 1))      # length     (one scalar per neuron)
        self.bias = nn.Parameter(torch.zeros(out_f))

    def weight(self):
        norm = self.v.norm(dim=1, keepdim=True)              # ||v|| per output row
        return self.g * self.v / norm                        # w = g * v / ||v||   (Eq. 2)

    def forward(self, x):                                     # x: (batch, in_f)
        return x @ self.weight().t() + self.bias

# ---- THE ORACLE: my layer must equal torch's weight_norm(nn.Linear) ----
ref = nn.Linear(5, 3)
ref = torch.nn.utils.weight_norm(ref, name='weight', dim=0)  # PyTorch's built-in (deprecated alias OK)

mine = MyWeightNormLinear(5, 3)
with torch.no_grad():                       # copy ref's parameters so both compute the same function
    mine.v.copy_(ref.weight_v)
    mine.g.copy_(ref.weight_g)              # ref stores g with shape (out, 1) — matches mine
    mine.bias.copy_(ref.bias)

x = torch.randn(8, 5)
print("allclose(mine, weight_norm(Linear)):", torch.allclose(mine(x), ref(x), atol=1e-6))  # True
# the effective weight's per-row norm equals g:
w = mine.weight()
print("row norms of w:", [round(t,4) for t in w.norm(dim=1).tolist()])
print("g values     :", [round(t,4) for t in mine.g.squeeze().tolist()])  # should match

# ---- recompute the worked example: v=[3,4], g=10  ->  w=[6,8] ----
v = torch.tensor([[3.,4.]]); g = torch.tensor([[10.]])
w_ex = g * v / v.norm(dim=1, keepdim=True)
print("worked w:", w_ex.squeeze().tolist())            # [6.0, 8.0]
# and the Eq.3 gradients for grad_w L = [1,1]
gw = torch.tensor([1.,1.]); vv = torch.tensor([3.,4.]); gg = 10.0
nrm = vv.norm()
grad_g = (gw @ vv) / nrm
grad_v = (gg/nrm)*gw - (gg*grad_g/nrm**2)*vv
print("grad_g:", grad_g.item(), " grad_v:", grad_v.tolist(),
      " v.grad_v:", round((vv @ grad_v).item(), 6))    # ~1.4, [0.32,-0.24], ~0 (perpendicular)

# ---- drop it into a 2-layer net ----
net = nn.Sequential(MyWeightNormLinear(5, 16), nn.ReLU(), MyWeightNormLinear(16, 2))
print("net output shape:", net(torch.randn(4, 5)).shape)  # torch.Size([4, 2])`
  };

  window.CODEVIZ["paper-weightnorm"] = {
    question: "Fit the same linear model on the same badly-scaled data, from the identical starting weight, at the same high learning rate — does the weight-normalized reparameterization stay stable while plain gradient descent diverges?",
    charts: [
      {
        type: "line",
        title: "Training loss over steps: weight normalization vs plain weights (same data, same start, same high learning rate)",
        xlabel: "training step",
        ylabel: "training loss (MSE, log-friendly — plain capped at 1e6 for plotting)",
        series: [
          {
            name: "Weight-normalized (w = g·v/||v||)",
            color: "#7ee787",
            points: [[0,322.4723],[2,90.1212],[4,32.1152],[6,3.0648],[8,2.6986],[10,2.6916],[12,2.6845],[14,2.6775],[16,2.6705],[18,2.6635],[20,2.6564],[22,2.6494],[24,2.6423],[26,2.6353],[28,2.6282],[30,2.6211],[32,2.6140],[34,2.6069],[36,2.5998],[38,2.5927],[39,2.5891]]
          },
          {
            name: "Plain weights (diverges)",
            color: "#ff7b72",
            points: [[0,322.4723],[2,2832.5672],[4,25042.5955],[6,221561.2140],[8,1000000],[10,1000000],[12,1000000],[14,1000000],[16,1000000],[18,1000000],[20,1000000],[22,1000000],[24,1000000],[26,1000000],[28,1000000],[30,1000000],[32,1000000],[34,1000000],[36,1000000],[38,1000000],[39,1000000]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seeded), not the paper's reported numbers. A linear regression on 8 features where one feature is on a 30x larger scale, making the loss surface badly conditioned. Both runs start from the IDENTICAL weight and use the same learning rate 0.003. The weight-normalized run (green) descends from 322 to ~2.6 and stays stable; the plain run (red) blows past 1e6 within 8 steps and ends near 9.3e20 (capped at 1e6 here so the chart is readable). Weight normalization's decoupling of magnitude and direction keeps the step well-sized in every direction — reproducing the paper's qualitative claim that the reparameterization improves conditioning and lets you train stably at higher learning rates.",
    code: `import numpy as np

def make(seed=0):
    rng = np.random.default_rng(seed)
    N, D = 200, 8
    scales = np.array([1.,1.,1.,1.,1.,1.,1.,30.])   # one feature 30x larger => ill-conditioned
    X = rng.normal(0,1,(N,D)) * scales
    w_true = rng.normal(0,1,D)
    y = X @ w_true + rng.normal(0,0.1,N)
    return X, y

def train(use_wn, lr=0.003, steps=40):
    X, y = make(0); N, D = X.shape
    v_start = np.random.default_rng(7).normal(0,1,D)   # identical start for both runs
    if use_wn:
        v = v_start.copy(); g = np.linalg.norm(v)      # init g = ||v|| so w starts == v_start
    else:
        w = v_start.copy()
    losses = []
    for t in range(steps):
        if use_wn:
            nrm = np.linalg.norm(v); w = g * v / nrm   # w = g*v/||v||  (Eq. 2)
        pred = X @ w; err = pred - y
        losses.append(round(float(0.5*np.mean(err**2)), 4))
        gw = (X.T @ err) / N                           # grad wrt effective weight w
        if use_wn:
            nrm = np.linalg.norm(v)
            dg = (gw @ v) / nrm                                  # Eq. 3: grad_g
            dv = (g/nrm)*gw - (g*dg/nrm**2)*v                   # Eq. 3: grad_v (perp to v)
            g -= lr*dg; v -= lr*dv
        else:
            w -= lr*gw
    return losses

wn = train(True); plain = train(False)
print("weight-normalized final loss:", wn[-1])        # ~2.5891  (stable)
print("plain final loss            :", plain[-1])     # ~9.3e20  (diverged)`
  };
})();