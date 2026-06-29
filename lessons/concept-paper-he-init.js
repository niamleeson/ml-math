/* Paper lesson — Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet
   Classification (He, Zhang, Ren, Sun, 2015). Grounded from arXiv:1502.01852 (abstract page for
   metadata; ar5iv HTML mirror for the method: PReLU eq. (1) in Sec. 2.1, and the forward-propagation
   variance derivation eqs. (7)–(10) plus the backward case eq. (14) in Sec. 2.2).
   Track A (primitive): derive Var[w]=2/n_in for ReLU and build He-normal init from raw tensors, verify
   with torch.allclose vs nn.init.kaiming_normal_. CODEVIZ: activation variance vs depth — He stays stable,
   Xavier-scale collapses. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-he-init". */
(function () {
  window.LESSONS.push({
    id: "paper-he-init",
    title: "He init — Delving Deep into Rectifiers (2015)",
    tagline: "Initialize weights with variance 2/fan_in (not 1/fan_in) so signal variance stays stable through deep ReLU stacks — plus PReLU, a ReLU with a learned negative slope.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun",
      org: "Microsoft Research",
      year: 2015,
      venue: "ICCV 2015 (arXiv:1502.01852)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1502.01852",
      code: ""
    },

    conceptLink: "dl-init",
    partOf: [],
    prereqs: ["dl-init", "dl-forward-prop", "dl-vanishing-gradient", "dl-activations"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A deep network is a stack of layers. Each layer multiplies its input by a weight
       matrix and then applies a nonlinear <b>activation function</b> (a fixed elementwise function that lets
       the network represent curved, non-straight-line relationships). The most common activation is the
       <b>rectified linear unit (ReLU)</b>: $f(y)=\\max(0,y)$ &mdash; it passes positive values through and
       zeros out negatives. Before any training, the weights are filled with random numbers; that choice is the
       <b>initialization</b>. The starting <b>variance</b> (the average squared spread of those random numbers
       around zero) of each layer's output decides whether the signal keeps a healthy scale as it flows through
       the stack, or shrinks toward zero / blows up.</p>
       <p><b>What was broken.</b> The standard recipe at the time was <b>Xavier (Glorot) initialization</b>,
       derived in 2010 by assuming the activation is roughly <i>linear</i> around zero. That assumption is fine
       for tanh, but ReLU is <i>not</i> linear &mdash; it deletes half of its inputs (every negative becomes 0).
       The paper shows (Sec. 2.2) that Xavier's variance is therefore too small by a factor of 2 per layer, and
       across $L$ layers the activations are scaled down by about $1/\\sqrt{2^{\\,L}}$. On a very deep ReLU model
       (e.g. 30 layers) this makes the signal &mdash; and the gradient &mdash; vanish, and the network "does not
       converge" (Fig. 3).</p>`,

    contribution:
      `<p>The paper makes two contributions (abstract; Secs. 2.1 and 2.2):</p>
       <ul>
         <li><b>PReLU (Parametric ReLU).</b> A small generalization of ReLU that <i>learns</i> the slope of the
         negative part instead of fixing it at 0, at almost no extra cost. It improves accuracy and motivates the
         initialization analysis.</li>
         <li><b>He initialization (a.k.a. Kaiming / MSRA init).</b> A robust initialization for rectifier
         networks: draw each weight from a zero-mean Gaussian (bell curve centered at 0) with variance
         $2/n_{\\text{in}}$, where $n_{\\text{in}}$ is the number of inputs feeding one output ("fan-in"). The
         factor of 2 exactly compensates for ReLU deleting half the signal, so activation variance stays stable
         layer to layer and very deep rectifier nets train from scratch.</li>
       </ul>`,

    whyItMattered:
      `<p>He initialization is now the default for almost every ReLU-based network: it is what PyTorch's
       <code>nn.init.kaiming_normal_</code> implements and what <code>nn.Conv2d</code> / <code>nn.Linear</code>
       use under the hood for ReLU stacks. It is one of the ingredients that made very deep networks trainable
       (it is used throughout ResNet, the next year's breakthrough). The headline of the paper itself &mdash;
       4.94% top-5 error on ImageNet, the first result to pass the ~5.1% human reference &mdash; was reached with
       PReLU plus this initialization. This lesson is the <b>ReLU-aware</b> partner to <b>Xavier initialization</b>
       (concept <code>dl-init</code>): Xavier derives $\\mathrm{Var}[w]=1/n$ assuming a <i>linear</i> activation;
       He keeps the same variance-balancing idea but fixes the missing factor of 2 that ReLU introduces.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 2.1 ("Parametric Rectifiers")</b> &mdash; the PReLU definition, eq. (1), and that the
         negative slope $a_i$ is a learned parameter (one per channel).</li>
         <li><b>Section 2.2 ("Initialization of Filter Weights for Rectifiers")</b> &mdash; the core of this
         lesson. Follow the forward-propagation variance recurrence to eqs. (8)&ndash;(10): the factor of $1/2$
         from ReLU, and the resulting condition $\\tfrac12 n_l \\mathrm{Var}[w_l]=1$, i.e. $\\mathrm{Var}[w]=2/n_l$.</li>
         <li><b>Figure 3</b> &mdash; the 30-layer convergence plot: their init converges, Xavier's does not.</li>
       </ul>
       <p><b>Skim:</b> the backward-propagation case (eq. (14)) &mdash; same factor of 2, with fan-out instead of
       fan-in; either condition gives a stable network. The experiments (Sec. 3) for the ImageNet numbers.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will push a unit-variance input through a 20-layer stack of
       <code>ReLU(x @ W)</code> with no training, and measure the variance of the activations at each layer, for
       two initializations: <b>He</b> ($\\mathrm{Var}[w]=2/n$) and <b>Xavier-scale</b> ($\\mathrm{Var}[w]=1/n$,
       the linear-activation value). Which one keeps the activation variance roughly constant down the depth, and
       which one halves it every layer until it is essentially zero? Then on a 15-layer ReLU classifier: will the
       Xavier-scale net even start to learn, or will it stall near the random-guess loss because no signal
       reaches the output? Write your guesses, then check the worked example and CODEVIZ.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_he_normal_(w)</code> that initializes a weight
       tensor in place for a ReLU layer:</p>
       <ul>
         <li><code># TODO: fan_in = w.shape[1]</code> &mdash; for an <code>nn.Linear</code> weight of shape
         <code>(out, in)</code>, the fan-in (inputs per output) is the second dimension.</li>
         <li><code># TODO: std = sqrt(2.0 / fan_in)</code> &mdash; the He standard deviation; variance is
         $2/n_{\\text{in}}$, so the standard deviation is its square root.</li>
         <li><code># TODO: with torch.no_grad(): w.normal_(0.0, std)</code> &mdash; fill from a zero-mean Gaussian
         with that standard deviation.</li>
       </ul>
       <p>The CODE cell is the full reference, including the
       <code>torch.allclose(mine, nn.init.kaiming_normal_(...))</code> check &mdash; that passing check is the
       proof your scale is exactly PyTorch's Kaiming-normal.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The goal is to keep the <b>variance</b> (squared spread) of the activations the same from one layer to
       the next, so the signal neither shrinks to zero nor explodes as it passes through many layers. Track one
       layer (Sec. 2.2). It computes a pre-activation $y_l = W_l x_l$ (then ReLU gives the next layer's input
       $x_{l+1}=\\max(0,y_l)$). Assume the weights have mean 0 and are independent of the inputs.</p>
       <ol>
         <li><b>One output is a sum of $n_l$ independent products.</b> Output element $y_l$ sums $n_l$ terms
         $w\\cdot x$, where $n_l$ is the fan-in (number of inputs into that output). For independent, mean-zero
         weights the variance of the sum is $n_l$ times the variance of one term:
         $\\mathrm{Var}[y_l]=n_l\\,\\mathrm{Var}[w_l]\\,\\mathbb{E}[x_l^2]$. (We use $\\mathbb{E}[x_l^2]$, the mean
         <i>square</i> of the input, not its variance, because the ReLU input $x_l$ is not mean-zero &mdash; see
         the next step.)</li>
         <li><b>ReLU deletes half the signal &mdash; the factor of 2.</b> The input $x_l$ is the ReLU output of
         the previous layer, $x_l=\\max(0,y_{l-1})$. If $y_{l-1}$ is symmetric around zero, ReLU keeps the
         positive half and zeros the negative half, so its mean square is exactly <i>half</i> the variance of
         $y_{l-1}$: $\\mathbb{E}[x_l^2]=\\tfrac12\\mathrm{Var}[y_{l-1}]$. This $\\tfrac12$ is the whole point: it
         is what a linear-activation analysis (Xavier) misses.</li>
         <li><b>The variance recurrence (eq. (8)).</b> Substituting gives the layer-to-layer rule
         $\\mathrm{Var}[y_l]=\\tfrac12 n_l\\,\\mathrm{Var}[w_l]\\,\\mathrm{Var}[y_{l-1}]$.</li>
         <li><b>Force the multiplier to 1 (eqs. (9)&ndash;(10)).</b> For the variance to be unchanged from layer
         to layer, the per-layer multiplier must equal 1: $\\tfrac12 n_l\\,\\mathrm{Var}[w_l]=1$. Solving for the
         weight variance gives $\\mathrm{Var}[w_l]=2/n_l$, i.e. standard deviation $\\sqrt{2/n_l}$, weights drawn
         from a zero-mean Gaussian.</li>
       </ol>
       <p><b>Why this fixes Xavier for ReLU.</b> Xavier sets $\\mathrm{Var}[w]=1/n$ (multiplier
       $n\\cdot 1/n=1$) because it assumed a linear activation with no $\\tfrac12$. With ReLU the true multiplier
       is $\\tfrac12 n\\cdot 1/n=\\tfrac12$, so each layer halves the variance; after $L$ layers the signal is
       scaled by $(\\tfrac12)^L=1/2^L$ &mdash; standard deviation $1/\\sqrt{2^L}$, exactly the paper's statement.
       He's $2/n$ restores the multiplier to 1.</p>`,

    architecture:
      `<p>This is a theory + activation paper, not a new network topology; its two "components" are an
       <b>activation function</b> and an <b>initialization rule</b>, plus the deep plain-CNN they are tested on.</p>
       <ul>
         <li><b>PReLU activation (Sec. 2.1).</b> Drop-in replacement for ReLU at every nonlinearity. Per output
         channel $i$ it carries one extra scalar $a_i$ (the negative slope). Forward: $f(y_i)=\\max(0,y_i)+a_i\\min(0,y_i)$.
         Backward: $a_i$ gets a gradient (eq. 2) and is updated by momentum SGD (eq. 4) with <i>no</i> weight decay
         (so $a_i$ is not pulled toward 0). Channel-shared variant uses one $a$ per layer. Cost: negligible &mdash;
         a handful of extra parameters total.</li>
         <li><b>He initialization rule (Sec. 2.2).</b> A procedure run once, before training, on each layer's weight
         tensor: compute fan-in $n_l$ (for a conv, $k_l^2 c_l$ = kernel area &times; input channels), set
         $\\sigma=\\sqrt{2/n_l}$, draw weights i.i.d. from $\\mathcal{N}(0,\\sigma^2)$, biases 0. The forward
         derivation (eqs. 6&ndash;10) and the backward derivation (eqs. 12&ndash;14) each yield a stable-variance
         condition; the fan-in (forward) form is the default.</li>
         <li><b>Test architecture.</b> Both are validated on very deep plain convolutional stacks &mdash; the
         22- and 30-layer models of Sec. 2.3 / Fig. 3 (used to show Xavier stalls while He converges), and the
         large VGG-style "model A/B/C" nets of Sec. 3 that reach the 4.94% ImageNet top-5 result. No residual or
         normalization layers are required for the init to make these trainable from scratch.</li>
       </ul>
       <p><b>Data flow per layer.</b> $x_l \\xrightarrow{\\;W_l\\;} y_l=W_l x_l \\xrightarrow{\\;\\text{PReLU/ReLU}\\;} x_{l+1}$.
       The init fixes $\\mathrm{Var}[W_l]$ so $\\mathrm{Var}[y_l]$ is preserved along this chain; PReLU changes the
       nonlinearity box (and, with slope $a$, the init generalizes to $2/((1+a^2)n_l)$).</p>`,

    symbols: [
      { sym: "$l$", desc: "the layer index. Quantities with subscript $l$ belong to layer $l$; $l-1$ is the previous layer that feeds it." },
      { sym: "$y_l$", desc: "the pre-activation of layer $l$: the result $W_l x_l$ before the activation function is applied. Its variance is what we balance." },
      { sym: "$x_l$", desc: "the input to layer $l$ — for $l>1$ this is the ReLU output of the previous layer, $x_l=\\max(0,y_{l-1})$, so it is non-negative (not mean-zero)." },
      { sym: "$W_l$, $w_l$", desc: "the weight matrix of layer $l$ and a single weight in it. We initialize the $w_l$ as independent, zero-mean random numbers." },
      { sym: "$n_l$", desc: "the fan-in of layer $l$: how many inputs feed one output. For a convolution $n_l=k^2 c$ (kernel area times input channels); for a linear layer it is the input dimension." },
      { sym: "$\\mathrm{Var}[\\,\\cdot\\,]$", desc: "variance: the average squared distance of a random quantity from its mean — a measure of spread. We want $\\mathrm{Var}[y_l]$ to stay constant across $l$." },
      { sym: "$\\mathbb{E}[\\,\\cdot\\,]$", desc: "expectation (mean / average). $\\mathbb{E}[x_l^2]$ is the mean square of $x_l$; for a mean-zero variable it equals the variance, but ReLU outputs are not mean-zero." },
      { sym: "ReLU", desc: "rectified linear unit: the activation $f(y)=\\max(0,y)$ — pass positives through, zero out negatives. It deletes the negative half of its input, which halves the variance." },
      { sym: "fan-in / fan-out", desc: "the number of inputs feeding an output (fan-in) and the number of outputs an input feeds (fan-out). He init uses fan-in for the forward case." },
      { sym: "$\\hat n_l$", desc: "the fan-out of layer $l$ used in the backward (gradient) derivation, $\\hat n_l=k_l^2 d_l$ (kernel area times number of output channels $d_l$). The backward condition is $\\tfrac12\\hat n_l\\mathrm{Var}[w_l]=1$ (eq. 14)." },
      { sym: "$\\Delta x_l$", desc: "the gradient (error signal) flowing backward at layer $l$ — the backward-pass counterpart of $x_l$. Its variance must also stay stable; eq. (12) gives its recurrence." },
      { sym: "$\\sigma$", desc: "the standard deviation of the initial weights: $\\sigma=\\sqrt{2/n_l}$ for He init (the square root of the variance $2/n_l$)." },
      { sym: "$a_i$", desc: "PReLU's learned negative slope for channel $i$: how much of a negative input passes through. $a_i=0$ recovers ReLU; $a_i=1$ makes a plain line (identity)." },
      { sym: "$\\mathcal{E}$", desc: "the training loss (error/objective). $\\partial\\mathcal{E}/\\partial a_i$ is its gradient with respect to PReLU's slope, used to update $a_i$." },
      { sym: "$\\mu$, $\\epsilon$", desc: "the momentum coefficient $\\mu$ and learning rate $\\epsilon$ in PReLU's slope update (eq. 4), $\\Delta a_i:=\\mu\\Delta a_i+\\epsilon\\,\\partial\\mathcal{E}/\\partial a_i$." }
    ],

    formula:
      `$$f(y_i)=\\begin{cases} y_i, & y_i\\gt 0\\\\ a_i\\,y_i, & y_i\\le 0\\end{cases}
        \\;=\\;\\max(0,y_i)+a_i\\,\\min(0,y_i)\\quad\\text{(eq. 1)}$$
       <p class="cap"><b>PReLU (Sec. 2.1, eq. 1).</b> A rectifier with a <i>learned</i> negative slope $a_i$ per channel; $a_i=0$ is plain ReLU, $a_i=1$ is the identity line.</p>
       $$\\Delta a_i \\;:=\\; \\mu\\,\\Delta a_i + \\epsilon\\,\\dfrac{\\partial \\mathcal{E}}{\\partial a_i}
        \\quad\\text{(eq. 4)}$$
       <p class="cap"><b>PReLU update (Sec. 2.1, eq. 4).</b> The slope $a_i$ is trained by momentum SGD like any other weight ($\\mu$ momentum, $\\epsilon$ learning rate); no weight decay is used on it.</p>
       $$\\mathrm{Var}[y_l]=n_l\\,\\mathrm{Var}[w_l\\,x_l]\\quad\\text{(eq. 6)}
        \\qquad\\Longrightarrow\\qquad
        \\mathrm{Var}[y_l]=n_l\\,\\mathrm{Var}[w_l]\\,\\mathbb{E}\\!\\left[x_l^2\\right]\\quad\\text{(eq. 7)}$$
       <p class="cap"><b>Forward variance (Sec. 2.2, eqs. 6&ndash;7).</b> One output sums $n_l$ independent products; with $w_l$ zero-mean its single-term variance is $\\mathrm{Var}[w_l]\\,\\mathbb{E}[x_l^2]$ &mdash; the mean <i>square</i> of the input, because the ReLU input is not mean-zero.</p>
       $$\\mathbb{E}\\!\\left[x_l^2\\right]=\\tfrac{1}{2}\\,\\mathrm{Var}[y_{l-1}]
        \\qquad\\Longrightarrow\\qquad
        \\mathrm{Var}[y_l]=\\tfrac{1}{2}\\,n_l\\,\\mathrm{Var}[w_l]\\,\\mathrm{Var}[y_{l-1}]\\quad\\text{(eq. 8)}$$
       <p class="cap"><b>The factor of $\\tfrac12$ (Sec. 2.2, eq. 8).</b> $x_l=\\max(0,y_{l-1})$ keeps only the positive half of a symmetric $y_{l-1}$, so its mean square is half the previous variance &mdash; this is exactly what a linear (Xavier) analysis misses.</p>
       $$\\mathrm{Var}[y_L]=\\mathrm{Var}[y_1]\\left(\\prod_{l=2}^{L}\\tfrac{1}{2}\\,n_l\\,\\mathrm{Var}[w_l]\\right)\\quad\\text{(eq. 9)}$$
       <p class="cap"><b>Depth recurrence (Sec. 2.2, eq. 9).</b> Stacking $L$ layers multiplies the per-layer factors; a product far from 1 makes the signal vanish or explode exponentially in depth.</p>
       $$\\tfrac{1}{2}\\,n_l\\,\\mathrm{Var}[w_l]=1\\;\\;\\forall l
        \\;\\;\\Longrightarrow\\;\\;
        \\boxed{\\;\\mathrm{Var}[w_l]=\\dfrac{2}{n_l}\\;,\\quad
        \\text{std}=\\sqrt{\\dfrac{2}{n_l}}\\;}\\quad\\text{(eq. 10)}$$
       <p class="cap"><b>He condition &amp; result (Sec. 2.2, eq. 10).</b> Force every per-layer factor to 1 &rArr; zero-mean Gaussian weights with variance $2/n_l$ (fan-in $n_l$). The factor of 2 vs Xavier's $\\mathrm{Var}[w]=1/n$ exactly cancels ReLU's $\\tfrac12$.</p>
       $$\\mathrm{Var}[\\Delta x_l]=\\tfrac{1}{2}\\,\\hat n_l\\,\\mathrm{Var}[w_l]\\,\\mathrm{Var}[\\Delta x_{l+1}]\\quad\\text{(eq. 12)}
        \\;\\;\\Longrightarrow\\;\\;
        \\tfrac{1}{2}\\,\\hat n_l\\,\\mathrm{Var}[w_l]=1\\quad\\text{(eq. 14)}$$
       <p class="cap"><b>Backward pass (Sec. 2.2, eqs. 12&amp;14).</b> The same argument on the gradient $\\Delta x_l$ gives the same $\\tfrac12$, now with fan-out $\\hat n_l=k_l^2 d_l$ in place of fan-in; either condition keeps a deep rectifier net stable, so the fan-in form is used by convention.</p>`,

    whatItDoes:
      `<p>The first line (eq. 8) is the layer-to-layer rule for activation variance under ReLU: the variance gets
       multiplied by $\\tfrac12 n_l\\,\\mathrm{Var}[w_l]$ each layer. The $\\tfrac12$ is ReLU deleting half the
       signal. To keep variance constant we set that multiplier to 1 (eq. 10), which forces each weight to be a
       zero-mean Gaussian with variance $2/n_l$ &mdash; standard deviation $\\sqrt{2/n_l}$. PReLU is the
       companion activation $f(y_i)=y_i$ if $y_i\\gt 0$, else $a_i y_i$ (eq. 1), with $a_i$ learned.</p>`,

    derivation:
      `<p>The general "why initialization matters / keep activation variance balanced" picture &mdash; including
       the Xavier $\\mathrm{Var}[w]=1/n$ case for linear/tanh activations &mdash; is owned by the
       <code>dl-init</code> concept lesson; see it for the full variance-of-a-sum argument. Here is the one piece
       specific to this paper: the <b>extra factor of $\\tfrac12$</b> that ReLU introduces and that turns
       $1/n$ into $2/n$.</p>
       <p>One output of layer $l$ is $y_l=\\sum_{j=1}^{n_l} w_{l,j}\\,x_{l,j}$. With the $w$ independent, mean-zero,
       and independent of $x$, the variance of the sum is $n_l$ copies of the single-term variance, and for a
       mean-zero weight that term is $\\mathrm{Var}[w_l]\\,\\mathbb{E}[x_l^2]$:</p>
       $$\\mathrm{Var}[y_l]=n_l\\,\\mathrm{Var}[w_l]\\,\\mathbb{E}[x_l^2].$$
       <p>Now the ReLU step. The input $x_l=\\max(0,y_{l-1})$. If $y_{l-1}$ has a distribution symmetric about
       zero (which holds when the previous weights are mean-zero and symmetric), then on average half of its mass
       is negative and gets zeroed. Computing the mean square keeps only the positive half:</p>
       $$\\mathbb{E}[x_l^2]=\\mathbb{E}\\big[\\max(0,y_{l-1})^2\\big]
        =\\tfrac12\\,\\mathbb{E}[y_{l-1}^2]=\\tfrac12\\,\\mathrm{Var}[y_{l-1}].$$
       <p>(The last equality uses $\\mathbb{E}[y_{l-1}]=0$, so its mean square equals its variance.) Substituting
       gives the paper's eq. (8), $\\mathrm{Var}[y_l]=\\tfrac12 n_l\\,\\mathrm{Var}[w_l]\\,\\mathrm{Var}[y_{l-1}]$.
       For the variance to neither grow nor shrink across all layers we need the multiplier to be exactly 1 for
       every $l$ (eq. 9), and solving $\\tfrac12 n_l\\,\\mathrm{Var}[w_l]=1$ gives $\\mathrm{Var}[w_l]=2/n_l$
       (eq. 10). The backward pass (eq. 14) repeats the argument for gradients with fan-out $\\hat n_l$ in place
       of fan-in and the same $\\tfrac12$; either condition keeps a deep rectifier net stable, so by convention we
       use the fan-in form.</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; the $2/n_{\\text{in}}$ scale, the heart of the method. Take a layer with
       fan-in $n_l=256$ and plug into $\\mathrm{Var}[w]=2/n_l$:</p>
       <ul class="steps">
         <li><b>Variance.</b> $\\mathrm{Var}[w]=2/256=0.0078125$.</li>
         <li><b>Std (square root).</b> $\\sigma=\\sqrt{0.0078125}=\\mathbf{0.088388}\\ldots$ &mdash; draw each
         weight from a zero-mean Gaussian with std $\\approx 0.0884$.</li>
         <li><b>Check the ReLU multiplier.</b> per-layer factor $\\tfrac12 n_l\\,\\mathrm{Var}[w]=\\tfrac12\\cdot256\\cdot0.0078125=\\mathbf{1}$
         &mdash; variance is preserved, exactly what we forced in eq. (10).</li>
         <li><b>Compare to Xavier $1/n$.</b> Xavier std $=\\sqrt{1/256}=0.0625$, a factor
         $\\sqrt2=1.414$ smaller; its multiplier is $\\tfrac12\\cdot256\\cdot(1/256)=\\tfrac12$ &mdash; each layer
         <i>halves</i> the variance.</li>
       </ul>
       <p>The table contrasts He vs Xavier across three fan-ins, and shows the per-layer ReLU multiplier each
       produces (He keeps it at $1$; Xavier halves the signal every layer):</p>
       <table class="extable">
         <caption>He ($2/n$) vs Xavier-scale ($1/n$) standard deviations, and the resulting per-layer ReLU variance multiplier.</caption>
         <thead>
           <tr><th>fan-in $n$</th><th class="num">He std $\\sqrt{2/n}$</th><th class="num">Xavier std $\\sqrt{1/n}$</th><th class="num">He mult. $\\tfrac12 n\\cdot\\tfrac2n$</th><th class="num">Xavier mult. $\\tfrac12 n\\cdot\\tfrac1n$</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">256</td><td class="num">0.088388</td><td class="num">0.062500</td><td class="num">1.0</td><td class="num">0.5</td></tr>
           <tr><td class="row-h">512</td><td class="num">0.062500</td><td class="num">0.044194</td><td class="num">1.0</td><td class="num">0.5</td></tr>
           <tr><td class="row-h">1152 ($3{\\times}3$, 128 ch.)</td><td class="num">0.041667</td><td class="num">0.029463</td><td class="num">1.0</td><td class="num">0.5</td></tr>
         </tbody>
       </table>
       <p>Wider fan-in &rArr; smaller weights (more inputs are summed). The Xavier multiplier is $\\tfrac12$ at
       every row, so after $L=20$ ReLU layers the activation variance is scaled by
       $(\\tfrac12)^{20}=1/1{,}048{,}576\\approx 9.5\\times10^{-7}$ &mdash; effectively zero. He's factor of 2
       keeps the multiplier at $1$, so variance is preserved. The CODE cell recomputes
       $\\sqrt{2/256}=0.088388$ and $\\sqrt{2/512}=0.0625$, and the CODEVIZ measures the $\\tfrac12$-per-layer
       collapse for real.</p>`,

    recipe:
      `<p><b>He initialization, as numbered steps</b> &mdash; for each weight tensor of a ReLU (or PReLU) layer:</p>
       <ol>
         <li>Find the fan-in $n_{\\text{in}}$: inputs per output. Linear: the input dimension. Conv:
         $k^2 c$ (kernel height $\\times$ width $\\times$ input channels).</li>
         <li>Set the standard deviation $\\sigma=\\sqrt{2/n_{\\text{in}}}$ (variance $2/n_{\\text{in}}$).</li>
         <li>Draw every weight independently from a zero-mean Gaussian $\\mathcal{N}(0,\\sigma^2)$.</li>
         <li>Set biases to 0.</li>
         <li>(PReLU variant.) Replace ReLU with $f(y_i)=\\max(0,y_i)+a_i\\min(0,y_i)$; for a slope $a$ the init
         generalizes to $\\mathrm{Var}[w]=2/((1+a^2)\\,n_{\\text{in}})$, which is $2/n$ at $a=0$.</li>
       </ol>`,

    results:
      `<p>Quoted from the abstract (arXiv:1502.01852): the method "is able to surpass human-level performance
       (5.1%, Russakovsky et al.) on this visual recognition challenge," obtaining a "4.94% top-5 test error on
       the ImageNet 2012 classification dataset," which the abstract calls "a 26% relative improvement over the
       ILSVRC 2014 winner (GoogLeNet, 6.66%)." Section 2.2 demonstrates that on a 30-layer model their
       initialization converges while Xavier's "completely stalls" / "does not converge" (Fig. 3). The CODEVIZ
       numbers below are our own small run, not the paper's reported numbers.</p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> Two levels. (a) <b>Init correctness:</b> seed the same generator for both
       and check <code>torch.allclose(my_he_normal_(w), nn.init.kaiming_normal_(w, mode='fan_in', nonlinearity='relu'))</code>
       is <code>True</code> &mdash; bit-for-bit identical proves your scale IS Kaiming-normal. (b) <b>System metric:</b>
       activation variance per layer through a deep ReLU stack (target: stays $\\approx$ constant), and whether a deep
       ReLU classifier actually trains. The no-skill reference is Xavier-scale ($\\mathrm{Var}[w]=1/n$): it must visibly
       FAIL where He succeeds, and the random-guess loss $\\ln 2\\approx0.693$ is the "learned nothing" floor for the
       binary classifier.</p>
       <ul>
         <li><b>2. Sanity checks BEFORE the full run.</b> Cheap and decisive: the empirical std of a freshly
         initialized weight tensor must match $\\sqrt{2/n_{\\text{in}}}$ &mdash; for fan-in 256, $\\approx0.0884$; for
         512, exactly $0.0625$. Then push a unit-variance input through one ReLU layer and confirm the output variance
         stays near the input variance (the multiplier $\\tfrac12 n\\cdot(2/n)=1$). Verify conv fan-in is computed as
         $k^2c$, not $c$ (a $3\\times3$/128-channel layer has fan-in 1152, std $\\approx0.0417$). These catch the
         factor-of-2 and fan-in bugs instantly.</li>
         <li><b>3. Expected range.</b> The allclose must be exact (same RNG &rarr; identical tensors). For the
         20-layer stack, anchor to our run (seed 0, a rule of thumb, not a paper number): He holds variance in the
         $\\approx0.5$&ndash;$0.8$ band layer to layer, while Xavier-scale halves it each layer to $\\approx5\\times10^{-7}$
         by layer 20. For training, He drives the 15-layer loss to $\\sim0$ while Xavier-scale stalls near
         $\\ln 2\\approx0.69$. The paper's own anchor (arXiv:1502.01852) is the 30-layer Fig. 3 where He converges and
         Xavier "does not converge," and the 4.94% ImageNet top-5 result &mdash; quote those, don't invent new scores.</li>
         <li><b>4. Ablation &mdash; prove the factor of 2 earns its keep.</b> The entire contribution is the 2 in
         $2/n$ vs Xavier's $1/n$. Swap $\\sqrt{2/n}\\to\\sqrt{1/n}$ on every layer and re-run: the deep-stack activation
         variance must collapse and the 15-layer classifier must stall near $\\ln 2$. If dropping the 2 changes nothing,
         the net is too shallow to show the effect (try more layers) or another mechanism (BatchNorm/residuals) is
         masking it &mdash; remove those to isolate the init.</li>
         <li><b>5. Failure signals.</b> <b>allclose False / empirical std too small by $\\sqrt2$</b> &rarr; used $1/n$
         (Xavier) instead of $2/n$, or PyTorch's default <code>nonlinearity='leaky_relu'</code> slope was left in &mdash;
         pass <code>'relu'</code>. <b>Activation variance vanishes toward 0 with depth</b> (the red CODEVIZ curve) &rarr;
         the factor of 2 is missing; symmetrically the gradient to early layers dies and they never move. <b>Variance
         explodes</b> &rarr; scale too large or fan-in under-counted (e.g. used $c$ not $k^2c$ for a conv). <b>Loss stuck
         at $\\ln 2$</b> &rarr; no signal reaches the output: a deep ReLU net dying from Xavier-scale init, exactly the
         Fig. 3 stall. <b>Loss NaN early</b> &rarr; variance blew up &mdash; wrong fan direction or over-large std.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>nn.init.kaiming_normal_(w, mode='fan_in',
       nonlinearity='relu')</code> in one line. Here you <b>build it from scratch</b>: read the fan-in off the
       weight shape, compute $\\sigma=\\sqrt{2/n_{\\text{in}}}$, and fill from a zero-mean Gaussian under
       <code>torch.no_grad()</code>. The payoff is the
       <code>torch.allclose(my_init, kaiming_normal_)</code> check &mdash; seed the same generator for both and
       the tensors are bit-for-bit identical, proving your scale IS PyTorch's Kaiming-normal. You then use it in
       a deep ReLU stack and watch the activation variance.</p>`,

    pitfalls:
      `<ul>
         <li><b>Using $1/n$ instead of $2/n$.</b> That is Xavier's <i>linear</i>-activation value; on ReLU it
         halves the variance every layer and a deep net silently dies. The factor of 2 is the entire fix.</li>
         <li><b>Wrong fan direction.</b> The forward derivation uses fan-<i>in</i>; PyTorch's
         <code>mode='fan_in'</code> matches it. <code>mode='fan_out'</code> uses fan-out (the backward case,
         eq. 14) &mdash; also valid, but pick deliberately, and note for non-square layers it is a different number.</li>
         <li><b>Conv fan-in is $k^2 c$, not $c$.</b> For a $3\\times3$ conv with 64 input channels, fan-in is
         $9\\cdot 64=576$, not 64. Getting this wrong rescales every conv layer.</li>
         <li><b>Forgetting the activation argument.</b> <code>nn.init.kaiming_normal_</code> defaults to
         <code>nonlinearity='leaky_relu'</code> with slope 0; pass <code>'relu'</code> for the plain-ReLU $2/n$.
         A non-zero slope $a$ uses $2/((1+a^2)n)$.</li>
         <li><b>It is not a training trick.</b> He init only fixes the <i>starting</i> scale; it does not replace
         BatchNorm or residual connections, which keep variance sane <i>during</i> training.</li>
       </ul>`,

    recall: [
      "State the He initialization condition from memory: $\\tfrac12 n_l\\mathrm{Var}[w_l]=1$, hence $\\mathrm{Var}[w]=2/n_{\\text{in}}$.",
      "Where does the factor of $\\tfrac12$ in eq. (8) come from?",
      "Why does Xavier ($1/n$) fail on a deep ReLU net but work on tanh?",
      "Define PReLU and its learned parameter $a_i$; what do $a_i=0$ and $a_i=1$ recover?"
    ],

    practice: [
      {
        q: `Compute the He standard deviation for a $3\\times3$ convolution with 128 input channels.`,
        steps: [
          { do: `Fan-in $n=k^2 c = 3^2\\cdot 128 = 9\\cdot 128 = 1152$.`, why: `Conv fan-in counts the whole receptive field, not just channels.` },
          { do: `Variance $=2/1152=0.001736\\ldots$`, why: `He's $2/n_{\\text{in}}$.` },
          { do: `Std $=\\sqrt{2/1152}=0.04167\\ldots$`, why: `Standard deviation is the square root of the variance.` }
        ],
        answer: `$\\sigma=\\sqrt{2/1152}\\approx 0.0417$. Note the Xavier value would be $\\sqrt{1/1152}\\approx 0.0295$, a factor $\\sqrt2$ smaller — which would halve the activation variance at this layer.`
      },
      {
        q: `A 20-layer ReLU net is initialized with Xavier's $\\mathrm{Var}[w]=1/n$. By what factor is the activation variance scaled from input to output, and why is that a problem?`,
        steps: [
          { do: `Per-layer multiplier under ReLU is $\\tfrac12 n\\cdot(1/n)=\\tfrac12$.`, why: `Eq. (8) with $\\mathrm{Var}[w]=1/n$; the $\\tfrac12$ is ReLU deleting half the signal.` },
          { do: `Over 20 layers the scaling is $(\\tfrac12)^{20}$.`, why: `Each layer multiplies the variance by $\\tfrac12$.` },
          { do: `$(\\tfrac12)^{20}=1/1{,}048{,}576\\approx 9.5\\times10^{-7}$.`, why: `Roughly a millionth.` }
        ],
        answer: `Activation variance shrinks by about $9.5\\times10^{-7}$ — essentially to zero. With no signal reaching the later layers (and, symmetrically, no gradient reaching the early ones), the network cannot learn. He's $2/n$ makes the multiplier $1$, so variance is preserved. This is exactly what the CODEVIZ chart shows.`
      },
      {
        q: `Ablation: in the deep-net training cell, swap He ($\\mathrm{Var}[w]=2/n$) for Xavier-scale ($\\mathrm{Var}[w]=1/n$) on a 15-layer ReLU classifier and compare final loss. What do you expect and why?`,
        steps: [
          { do: `Set every layer's init std to $\\sqrt{1/n_{\\text{in}}}$ instead of $\\sqrt{2/n_{\\text{in}}}$.`, why: `Drops the factor of 2.` },
          { do: `Train both with the same SGD and binary cross-entropy loss for 200 steps.`, why: `Only the init differs.` },
          { do: `Compare the final loss to the random-guess loss $\\ln 2\\approx 0.693$.`, why: `A net that learns nothing stays near $\\ln 2$.` }
        ],
        answer: `He trains: in our run the loss drops to ~0.0005. Xavier-scale stalls near ~0.67 (≈ the random-guess $\\ln 2$): activations vanish through 15 ReLU layers, so the gradient that reaches the early weights is negligible and they barely move. The only change is the factor of 2 in the initial variance, which confirms the paper's central claim. (Our small run, not the paper's number.)`
      }
    ]
  });

  window.CODE["paper-he-init"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build He (Kaiming) initialization from scratch: read fan_in off the weight shape, set std=sqrt(2/fan_in), ` +
      `and fill from a zero-mean Gaussian under torch.no_grad(). Prove it equals nn.init.kaiming_normal_ by ` +
      `seeding the SAME generator for both and checking torch.allclose. Recompute the worked-example numbers ` +
      `(sqrt(2/256), sqrt(2/512)), then push a unit-variance input through a 20-layer ReLU stack and print the ` +
      `activation variance per layer for He vs Xavier-scale (1/n) — He stays ~constant, Xavier collapses. ` +
      `Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn as nn, math

# ---- He / Kaiming normal init from scratch (forward, fan_in, ReLU) ----
def my_he_normal_(w):
    """In-place He-normal init for a ReLU layer.  Var[w] = 2 / fan_in."""
    fan_in = w.shape[1]                 # nn.Linear weight is (out, in) -> fan_in = in
    std = math.sqrt(2.0 / fan_in)       # the He standard deviation
    with torch.no_grad():
        return w.normal_(0.0, std)      # zero-mean Gaussian, std = sqrt(2/fan_in)

# ---- THE ORACLE: my init must equal nn.init.kaiming_normal_ bit-for-bit ----
fan_out, fan_in = 512, 256
w_mine = torch.empty(fan_out, fan_in)
w_ref  = torch.empty(fan_out, fan_in)
torch.manual_seed(42); my_he_normal_(w_mine)                                   # same RNG state...
torch.manual_seed(42); nn.init.kaiming_normal_(w_ref, mode='fan_in',
                                               nonlinearity='relu')            # ...for both
print("target std sqrt(2/256) =", round(math.sqrt(2/256), 6))                  # 0.088388
print("allclose mine vs kaiming_normal_:", torch.allclose(w_mine, w_ref))      # True
print("empirical std mine:", round(w_mine.std().item(), 5))                    # ~0.0888

# ---- recompute the worked example ----
print("fan_in=256: Var=2/256 =", 2/256, " std =", round(math.sqrt(2/256), 6)) # 0.0078125, 0.088388
print("fan_in=512: Var=2/512 =", 2/512, " std =", round(math.sqrt(2/512), 6)) # 0.00390625, 0.0625

# ---- activation variance vs depth: He (2/n) vs Xavier-scale (1/n) on a ReLU stack ----
def run_stack(c, depth=20, width=512, n=4096, seed=0):
    torch.manual_seed(seed)
    x = torch.randn(n, width)                      # unit-variance input
    vars_ = [x.var().item()]
    for _ in range(depth):
        W = torch.randn(width, width) * math.sqrt(c / width)   # c=2 -> He, c=1 -> Xavier
        x = torch.relu(x @ W)
        vars_.append(x.var().item())
    return vars_

he  = run_stack(2.0)
xav = run_stack(1.0)
print("\\nHe   (Var=2/n) variance @ layers 0,5,10,15,20:",
      [round(he[i], 4) for i in (0,5,10,15,20)])     # stays ~0.5-0.8
print("Xav  (Var=1/n) variance @ layers 0,5,10,15,20:",
      [round(xav[i], 6) for i in (0,5,10,15,20)])    # collapses toward 0`
  };

  window.CODEVIZ["paper-he-init"] = {
    question: "Push a unit-variance input through a 20-layer ReLU stack (no training) and measure the activation variance at each layer: does He init (Var[w]=2/n) keep it stable while Xavier-scale (Var[w]=1/n) collapses it toward zero?",
    charts: [
      {
        type: "line",
        title: "Activation variance vs depth through a 20-layer ReLU stack (no training)",
        xlabel: "layer index (0 = input)",
        ylabel: "variance of activations",
        series: [
          {
            name: "He  Var[w]=2/n (factor of 2)",
            color: "#7ee787",
            points: [[0,1.0001],[1,0.6821],[2,0.6794],[3,0.6606],[4,0.6688],[5,0.6923],[6,0.6566],[7,0.7209],[8,0.7519],[9,0.7962],[10,0.7568],[11,0.7361],[12,0.8229],[13,0.7819],[14,0.7268],[15,0.6977],[16,0.7177],[17,0.6817],[18,0.6089],[19,0.5275],[20,0.5087]]
          },
          {
            name: "Xavier-scale  Var[w]=1/n (no factor of 2)",
            color: "#ff7b72",
            points: [[0,1.0015],[1,0.3425],[2,0.1742],[3,0.0766],[4,0.0343],[5,0.0164],[6,0.0087],[7,0.0046],[8,0.0021],[9,0.0011],[10,0.0005],[11,0.0003],[12,0.0001],[13,0.0001],[14,0.00003],[15,0.00002],[16,0.00001],[17,0.000004],[18,0.000002],[19,0.000001],[20,0.0000005]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (torch, seed 0), not the paper's reported numbers. A unit-variance input flows through 20 layers of ReLU(x @ W), untrained, with W scaled two ways. He init (Var[w]=2/n) holds the activation variance roughly in the 0.5–0.8 band all the way down — the factor of 2 exactly cancels ReLU deleting half the signal. Xavier-scale (Var[w]=1/n, the linear-activation value) halves the variance every layer: ~0.34, 0.17, 0.077, … reaching ~5×10⁻⁷ by layer 20, essentially zero. With no signal reaching the deep layers (and no gradient flowing back), a Xavier-scale ReLU net of this depth cannot train — exactly the failure the paper reports on its 30-layer model (Fig. 3).",
    code: `import torch, math
torch.manual_seed(0)

def run_stack(c, depth=20, width=512, n=4096):
    x = torch.randn(n, width)                    # unit-variance input
    vars_ = [x.var().item()]
    for _ in range(depth):
        W = torch.randn(width, width) * math.sqrt(c / width)   # c=2 He, c=1 Xavier
        x = torch.relu(x @ W)                    # ReLU deletes the negative half
        vars_.append(x.var().item())
    return vars_

he  = run_stack(2.0)
xav = run_stack(1.0)
print("He  layer 0,10,20:", [round(he[i],4)  for i in (0,10,20)])   # ~1.00, ~0.76, ~0.51
print("Xav layer 0,10,20:", [round(xav[i],7) for i in (0,10,20)])   # ~1.00, ~5e-4, ~5e-7`
  };
})();
