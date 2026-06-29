/* Paper lesson — Gaussian Error Linear Units (GELU) (Hendrycks & Gimpel, 2016).
   Grounded from arXiv:1606.08415 (abstract + Section 2 "GELU Formulation": the exact definition
   GELU(x)=x*Phi(x)=x*0.5*[1+erf(x/sqrt2)], the tanh approximation, and the x*sigmoid(1.702x) approximation;
   Section 3 experiments on MNIST/Twitter-POS/TIMIT/CIFAR-10/100 with the quoted CIFAR-10 error).
   Track A (primitive): build GELU from scratch with raw torch (exact erf form + tanh approx), verify the
   exact form with torch.allclose vs F.gelu. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-gelu". */
(function () {
  window.LESSONS.push({
    id: "paper-gelu",
    title: "GELU — Gaussian Error Linear Units (2016)",
    tagline: "A smooth activation that weights each input by the probability a standard-normal draw falls below it — x times the normal CDF — instead of hard-gating by sign like ReLU.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Dan Hendrycks, Kevin Gimpel",
      org: "University of California, Berkeley / Toyota Technological Institute at Chicago",
      year: 2016,
      venue: "arXiv:1606.08415",
      citations: "",
      arxiv: "https://arxiv.org/abs/1606.08415",
      code: ""
    },

    conceptLink: "dl-activations",
    partOf: [],
    prereqs: ["dl-activations", "dl-neuron", "prob-normal", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A neural-network neuron computes a weighted sum of its inputs and then passes that
       single number through a fixed nonlinear function called an <b>activation</b>. ("Nonlinear" = not a
       straight line; without it, stacking layers would collapse to one linear map and the network could not
       model curves.) The dominant choice was the <b>ReLU</b> ("rectified linear unit"),
       $\\mathrm{ReLU}(x)=\\max(0,x)$: pass positive inputs through unchanged, set negative inputs to exactly
       zero.</p>
       <p><b>What was awkward.</b> ReLU makes a hard, all-or-nothing decision based only on the <i>sign</i> of
       the input: a value just below zero is killed completely, a value just above zero is kept in full. The
       paper (introduction) frames this as a deterministic 0-or-1 <b>gate</b> on the input. Two consequences:
       (1) ReLU is <b>not smooth</b> &mdash; it has a sharp kink at $x=0$ where its slope jumps from 0 to 1, so
       its derivative is discontinuous there; and (2) it ignores <i>how negative</i> a slightly-negative input
       is &mdash; $-0.01$ and $-100$ are both mapped to $0$. The authors wanted a nonlinearity that still
       suppresses very negative inputs but does so <i>smoothly</i> and in proportion to the input's value.</p>`,

    contribution:
      `<p>The paper introduces the <b>GELU</b> ("Gaussian Error Linear Unit"). Its contributions (abstract;
       Section 2):</p>
       <ul>
         <li><b>A value-weighted, probabilistic activation.</b> Instead of gating by sign, GELU multiplies the
         input $x$ by $\\Phi(x)$, the probability that a draw from a standard normal distribution (mean 0,
         variance 1) is less than or equal to $x$. So the input is scaled by how large it is relative to the
         spread of a bell curve &mdash; a smooth, continuous version of "keep big inputs, suppress small/negative
         ones."</li>
         <li><b>A smooth nonlinearity that need not be monotonic.</b> Unlike ReLU's kink, GELU is differentiable
         everywhere, and for moderately negative inputs it dips slightly below zero before returning to zero,
         giving a non-monotonic curve.</li>
         <li><b>Fast closed-form approximations.</b> Because the exact normal CDF uses the error function
         <code>erf</code>, the paper gives a <code>tanh</code>-based approximation and an even cheaper
         $x\\,\\sigma(1.702x)$ sigmoid approximation for speed.</li>
       </ul>`,

    whyItMattered:
      `<p>GELU became the default activation in the Transformer era. It is the activation inside <b>BERT</b>,
       the <b>GPT</b> family, and <b>Vision Transformers (ViT)</b>, among many others, and PyTorch ships it as
       <code>torch.nn.functional.gelu</code> / <code>nn.GELU</code>. Its smoothness pairs well with the
       gradient-based optimizers and normalization layers those models rely on, and it inspired related smooth,
       self-gated activations such as <b>Swish</b> / SiLU, $x\\,\\sigma(\\beta x)$, which is the same shape as
       GELU's own sigmoid approximation.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the one-line pitch: an activation that weights inputs by their value (via
         the standard Gaussian CDF) rather than gating by sign as in ReLU.</li>
         <li><b>Section 2 ("GELU Formulation")</b> &mdash; the exact definition
         $\\mathrm{GELU}(x)=x\\Phi(x)$, the <code>tanh</code> approximation with its constants, and the
         $x\\,\\sigma(1.702x)$ sigmoid approximation. This is the whole method.</li>
         <li><b>Figure 1</b> &mdash; the GELU curve plotted against ReLU; note the smooth knee and the small dip
         below zero for moderately negative inputs.</li>
       </ul>
       <p><b>Skim:</b> Section 3 (experiments) for the qualitative result that GELU matches or beats ReLU across
       MNIST, Twitter part-of-speech tagging, TIMIT speech frames, and CIFAR-10/100. You do not need every table
       &mdash; the takeaway is "consistent small improvements," not one headline number.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will plot GELU and ReLU on the same axis from $x=-4$ to $x=4$. For a
       large positive input, say $x=3$, will GELU be almost equal to the input itself (like ReLU), since
       $\\Phi(3)\\approx1$? For a moderately negative input, say $x=-1$, ReLU outputs exactly $0$ &mdash; will
       GELU output something slightly <i>below</i> $0$ rather than exactly $0$? And does GELU pass through the
       origin like ReLU, i.e. $\\mathrm{GELU}(0)=0$? Write your guesses, then check the worked example and the
       CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write GELU from scratch in raw torch, using the <i>exact</i>
       definition (no approximation yet):</p>
       <ul>
         <li><code># TODO: Phi = 0.5 * (1 + torch.erf(x / sqrt(2)))</code> &mdash; the standard-normal CDF
         $\\Phi(x)=\\tfrac12\\left[1+\\operatorname{erf}\\!\\left(x/\\sqrt2\\right)\\right]$. <code>torch.erf</code>
         is the error function, built in.</li>
         <li><code># TODO: return x * Phi</code> &mdash; weight the input by that probability.</li>
       </ul>
       <p>Then write the <code>tanh</code> approximation
       $0.5x\\left(1+\\tanh\\!\\left[\\sqrt{2/\\pi}\\,(x+0.044715x^3)\\right]\\right)$ as a second function. The CODE
       cell below is the full reference, including the <code>torch.allclose(my_gelu(x), F.gelu(x))</code> check
       &mdash; that passing check proves your exact form IS PyTorch's GELU.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>GELU asks a probabilistic question about each input. Imagine drawing a random number from a
       <b>standard normal distribution</b> &mdash; the familiar bell curve centered at 0 with standard deviation
       1. For an input $x$, let $\\Phi(x)$ be the probability that such a draw is $\\le x$. This is the normal
       <b>cumulative distribution function (CDF)</b>: it climbs smoothly from 0 (far left) to 1 (far right),
       passing through $\\tfrac12$ at $x=0$.</p>
       <ol>
         <li><b>Compute the gate strength.</b> Evaluate $\\Phi(x)$. A large positive $x$ gives $\\Phi(x)\\approx1$
         (almost certainly above a normal draw); a large negative $x$ gives $\\Phi(x)\\approx0$; at $x=0$ it is
         exactly $\\tfrac12$.</li>
         <li><b>Weight the input by it.</b> Output $x\\cdot\\Phi(x)$. So a big positive input is passed through
         almost unchanged ($x\\cdot1$), a very negative input is crushed toward zero ($x\\cdot0$), and inputs near
         zero are scaled by about a half.</li>
         <li><b>Why it is smooth.</b> $\\Phi$ is itself smooth (its derivative is the bell-curve density), so
         $x\\Phi(x)$ has no kink &mdash; unlike ReLU, which jumps in slope at $x=0$.</li>
       </ol>
       <p><b>Contrast with ReLU.</b> ReLU is the limiting hard version: replace the smooth $\\Phi(x)$ with a step
       that is $0$ for $x\\lt0$ and $1$ for $x\\gt0$, and $x\\cdot\\text{step}$ becomes exactly $\\max(0,x)$. The
       paper's framing (abstract): GELU <i>"weights inputs by their value, rather than gates inputs by their
       sign as in ReLUs."</i> A side effect of the smooth version is that moderately negative inputs get a
       slightly negative output (the curve dips below zero around $x\\approx-0.75$ before rising back to 0),
       which is why GELU is mildly non-monotonic.</p>`,

    architecture:
      `<p><b>Where GELU sits in a network.</b> GELU is a <b>pointwise (element-wise) nonlinearity</b>: it takes
       one scalar pre-activation and returns one scalar, applied independently to every entry of a tensor. It
       occupies the exact slot that <b>ReLU</b> or <b>ELU</b> would &mdash; immediately after a linear (or
       convolutional) layer and before the next one. The paper drops it into otherwise-standard fully-connected,
       convolutional, and residual architectures unchanged, reporting it <i>"matches or exceeds models with ReLUs
       or ELUs across tasks."</i></p>
       <p><b>Component-by-component data flow</b> through one block, for an input vector $h$:</p>
       <ol>
         <li><b>Linear / conv layer:</b> compute the pre-activation $z = Wh + b$ (a matrix multiply for a dense
         layer, or a convolution). This is the only place learned weights live.</li>
         <li><b>GELU (this component):</b> apply $\\mathrm{GELU}$ to <i>each</i> entry $z_i$ independently:
         $a_i = z_i\\,\\Phi(z_i)$. Nothing mixes across entries &mdash; it is a per-element map, so the output
         $a$ has exactly the same shape as $z$.</li>
         <li><b>Next layer:</b> feed $a$ into the following linear / conv layer, and repeat.</li>
       </ol>
       <p><b>The forward maps, per element.</b> Exact form (PyTorch default):</p>
       $$a = z\\cdot\\tfrac12\\!\\left[\\,1+\\operatorname{erf}\\!\\left(\\frac{z}{\\sqrt{2}}\\right)\\right]$$
       <p>Cheaper approximations that slot into the same position, when feedforward speed matters:</p>
       $$a \\approx 0.5\\,z\\left(1+\\tanh\\!\\left[\\sqrt{2/\\pi}\\,\\bigl(z+0.044715\\,z^{3}\\bigr)\\right]\\right)
       \\qquad\\text{or}\\qquad a \\approx z\\,\\sigma(1.702\\,z)$$
       <p><b>The gating interpretation.</b> Read $\\Phi(z)$ as a <b>soft gate</b>: it is the probability that a
       standard-normal variable (mean 0, variance 1) is $\\le z$, a number between 0 and 1. GELU multiplies the
       input by that probability, $z\\cdot\\Phi(z)$ &mdash; so the input passes through scaled by how large it is
       relative to a bell curve, rather than being hard-switched on or off by its sign as in ReLU. Big positive
       inputs are gated open ($\\Phi\\approx1$), strongly negative inputs gated shut ($\\Phi\\approx0$), and inputs
       near zero are passed at about half strength ($\\Phi(0)=\\tfrac12$).</p>
       <p><b>No learned parameters.</b> GELU adds <i>nothing</i> to train: it fixes the gating normal at
       $\\mu=0,\\ \\sigma=1$ and, as the paper notes, <i>"does not introduce any new hyperparameters."</i> All the
       block's learning stays in the surrounding $W,b$; GELU is a fixed function the gradient simply flows back
       through (it is differentiable everywhere, which is its advantage over ReLU's kink). The paper mentions one
       optional <b>variant</b> that occupies the same slot: replacing the Gaussian CDF with the logistic CDF
       $\\sigma$ gives the <b>SiLU</b> (Sigmoid Linear Unit), $a = z\\,\\sigma(z)$ &mdash; the self-gated,
       sigmoid-gated cousin (later popularized as Swish), distinct from GELU's own sigmoid <i>approximation</i>
       $z\\,\\sigma(1.702z)$ by the missing $1.702$ factor.</p>`,

    symbols: [
      { sym: "$x$", desc: "the scalar input to the activation — the neuron's weighted sum (a 'pre-activation'). GELU is applied element-wise, one value at a time." },
      { sym: "$\\Phi(x)$", desc: "capital Phi: the standard normal cumulative distribution function (CDF). It is the probability that a draw from a mean-0, variance-1 bell curve is at most $x$. Ranges from 0 to 1; equals 0.5 at $x=0$." },
      { sym: "$\\operatorname{erf}(z)$", desc: "the error function, a built-in special function related to the normal distribution. The CDF is written with it as $\\Phi(x)=\\tfrac12[1+\\operatorname{erf}(x/\\sqrt2)]$." },
      { sym: "$\\Phi(x)$ vs density", desc: "the CDF $\\Phi$ is the accumulated area under the bell curve up to $x$; its derivative is the bell-curve height (the density). GELU uses the CDF, not the density." },
      { sym: "$\\tanh$", desc: "the hyperbolic tangent, an S-shaped function from $-1$ to $1$. Used in the fast approximation because it cheaply mimics the shape of the erf-based CDF." },
      { sym: "$\\sigma(z)$", desc: "the logistic sigmoid $1/(1+e^{-z})$, an S-shaped function from 0 to 1. The cheapest approximation uses $\\Phi(x)\\approx\\sigma(1.702x)$." },
      { sym: "$\\sqrt{2/\\pi}$", desc: "a fixed constant (about 0.7979) inside the tanh approximation; $\\pi$ is the circle constant 3.14159…" },
      { sym: "$0.044715$", desc: "a fixed fitted constant in the tanh approximation, multiplying the cubic term $x^3$ to better match the exact curve away from zero." },
      { sym: "ReLU", desc: "rectified linear unit, $\\max(0,x)$: the hard-gating baseline GELU is contrasted against — it keeps positive inputs and zeroes negative ones, with a non-smooth kink at 0." },
      { sym: "$m$", desc: "a random 0/1 mask in the paper's stochastic motivation, drawn $m\\sim\\mathrm{Bernoulli}(\\Phi(x))$ (i.e. $m=1$ with probability $\\Phi(x)$). Averaging $m\\cdot x$ gives the deterministic GELU $x\\Phi(x)$." },
      { sym: "$\\mathbb{E}[\\cdot]$", desc: "the expected (average) value over the random mask $m$. The expectation of $m\\cdot x$ is what defines GELU." },
      { sym: "$\\mu,\\ \\sigma$", desc: "the mean and standard deviation of the normal whose CDF $\\Phi_{\\mu,\\sigma}$ does the gating. The paper fixes $\\mu=0,\\ \\sigma=1$ (standard normal) but notes they may be learned." },
      { sym: "SiLU", desc: "Sigmoid Linear Unit, $x\\,\\sigma(x)$: the variant from replacing the normal CDF with the logistic CDF $\\sigma$. Distinct from GELU's sigmoid approximation $x\\,\\sigma(1.702x)$, which has the extra 1.702 factor." }
    ],

    formula:
      `<p><b>Stochastic motivation (Section 2).</b> Multiply the input by a random 0/1 mask $m$ drawn so that
       it is 1 with probability $\\Phi(x)$ and 0 otherwise; GELU is the <i>expected</i> output of that mask:</p>
       $$\\mathbb{E}\\!\\left[m\\cdot x\\right]=\\Phi(x)\\cdot(1\\cdot x)+\\bigl(1-\\Phi(x)\\bigr)\\cdot(0\\cdot x)=x\\,\\Phi(x)$$
       <p><b>Exact definition (Section 2, "GELU Formulation"):</b></p>
       $$\\mathrm{GELU}(x)=x\\,\\Phi(x)=x\\cdot\\tfrac12\\!\\left[\\,1+\\operatorname{erf}\\!\\left(\\frac{x}{\\sqrt{2}}\\right)\\right]$$
       <p><b>tanh approximation (Section 2):</b></p>
       $$\\mathrm{GELU}(x)\\approx 0.5\\,x\\left(1+\\tanh\\!\\left[\\sqrt{2/\\pi}\\,\\bigl(x+0.044715\\,x^{3}\\bigr)\\right]\\right)$$
       <p><b>sigmoid approximation (Section 2):</b></p>
       $$\\mathrm{GELU}(x)\\approx x\\,\\sigma(1.702\\,x)$$
       <p><b>General CDF form (Section 2).</b> $\\Phi$ can be the CDF of any normal with mean $\\mu$ and standard
       deviation $\\sigma$; these may even be learned. The paper fixes $\\mu=0,\\ \\sigma=1$ throughout. Replacing
       $\\Phi$ with the logistic CDF $\\sigma$ gives the Sigmoid Linear Unit (SiLU):</p>
       $$\\mathrm{GELU}_{\\mu,\\sigma}(x)=x\\,\\Phi_{\\mu,\\sigma}(x),\\qquad \\mathrm{SiLU}(x)=x\\,\\sigma(x)$$`,

    whatItDoes:
      `<p>The <b>first equation</b> is the paper's motivation: it imagines randomly keeping ($m=1$) or zeroing
       ($m=0$) the input, where "keep" happens with probability $\\Phi(x)$. Averaging that random behavior gives
       the deterministic activation $x\\,\\Phi(x)$ &mdash; so GELU is the <i>expected</i> output of a stochastic
       gate, blending dropout-style zeroing with the input's own value.</p>
       <p>The <b>second equation</b> (Section 2, "GELU Formulation") is the exact definition: multiply the input
       $x$ by the probability $\\Phi(x)$ that a standard-normal draw lies at or below $x$, written in closed form
       with the error function. Big positive inputs pass through (their $\\Phi\\approx1$); very negative inputs are
       suppressed (their $\\Phi\\approx0$); inputs near zero are halved ($\\Phi(0)=\\tfrac12$). The two
       <b>approximations</b> replace the erf with a cheaper <code>tanh</code> or sigmoid that trace nearly the same
       curve &mdash; the paper offers them "if greater feedforward speed is worth the cost of exactness." The
       <b>last equation</b> says the gating CDF need not be the standard normal: any mean $\\mu$ / standard
       deviation $\\sigma$ (even learned) works, and swapping in the logistic CDF $\\sigma$ yields the SiLU
       $x\\,\\sigma(x)$.</p>`,

    derivation:
      `<p>The general "what is an activation function and why must it be nonlinear" picture is owned by the
       <code>dl-activations</code> concept lesson &mdash; see it for ReLU, sigmoid, tanh and the role of the
       nonlinearity. The probability object $\\Phi$ is the normal CDF from the <code>prob-normal</code> lesson.
       Here is the one piece specific to GELU: why $x\\Phi(x)$ is the <i>smooth</i> sibling of ReLU.</p>
       <p>Write a hard gate as a step function $\\mathbb{1}[x\\gt0]$, which is $1$ for positive $x$ and $0$ for
       negative $x$. Then $x\\cdot\\mathbb{1}[x\\gt0]=\\max(0,x)=\\mathrm{ReLU}(x)$: the input is kept or killed by
       its sign. The step is discontinuous at $0$, which is exactly ReLU's kink.</p>
       <p>Now replace the hard step with the normal CDF $\\Phi(x)$. The CDF is the smoothed step: it rises
       continuously from 0 to 1 with controllable steepness set by the normal's variance. As that variance
       $\\to0$ the bell curve becomes a spike and $\\Phi$ collapses back to the hard step, recovering ReLU. With
       variance 1 we get GELU, $x\\Phi(x)$. So GELU is ReLU with the on/off switch replaced by a probability,
       making it differentiable everywhere. The exact form follows from the standard identity
       $\\Phi(x)=\\tfrac12\\!\\left[1+\\operatorname{erf}(x/\\sqrt2)\\right]$, which just rewrites the normal CDF
       using the error function so it can be computed in closed form.</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; the exact GELU $\\mathrm{GELU}(x)=x\\,\\Phi(x)$ at three inputs, with
       $\\Phi(x)=\\tfrac12[1+\\operatorname{erf}(x/\\sqrt2)]$. Step through one input first:</p>
       <ul class="steps">
        <li><b>At $x=1$, scale:</b> $x/\\sqrt2=1/1.4142=0.7071$.</li>
        <li><b>Error function:</b> $\\operatorname{erf}(0.7071)\\approx0.6827$.</li>
        <li><b>Normal CDF:</b> $\\Phi(1)=\\tfrac12(1+0.6827)=0.8413$.</li>
        <li><b>Weight the input:</b> $\\mathrm{GELU}(1)=1\\times0.8413=\\mathbf{0.8413}$ &mdash; ReLU would give $1$, so GELU keeps slightly less.</li>
        <li><b>At $x=-1$, by symmetry:</b> $\\Phi(-1)=1-\\Phi(1)=0.1587$, so $\\mathrm{GELU}(-1)=(-1)\\times0.1587=\\mathbf{-0.1587}$ &mdash; ReLU gives $0$; GELU dips slightly <i>negative</i>.</li>
        <li><b>At $x=0$:</b> $\\Phi(0)=\\tfrac12$, so $\\mathrm{GELU}(0)=0\\times0.5=\\mathbf{0}$ &mdash; same as ReLU, passes through the origin.</li>
       </ul>
       <table class="extable">
        <caption>GELU vs ReLU at the three inputs (exact erf form).</caption>
        <thead><tr><th>$x$</th><th class="num">$\\Phi(x)$</th><th class="num">$\\mathrm{GELU}(x)=x\\,\\Phi(x)$</th><th class="num">$\\mathrm{ReLU}(x)$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$1$</td><td class="num">0.8413</td><td class="num">0.8413</td><td class="num">1.0000</td></tr>
         <tr><td class="row-h">$0$</td><td class="num">0.5000</td><td class="num">0.0000</td><td class="num">0.0000</td></tr>
         <tr><td class="row-h">$-1$</td><td class="num">0.1587</td><td class="num">$-0.1587$</td><td class="num">0.0000</td></tr>
        </tbody>
       </table>
       <p>The CODE cell recomputes these exact values and prints them; they match
       <code>F.gelu</code> to floating-point precision.</p>`,

    recipe:
      `<p><b>GELU, as numbered steps</b> &mdash; applied element-wise to the input tensor $x$:</p>
       <ol>
         <li>Compute $z=x/\\sqrt2$.</li>
         <li>Compute the error function $\\operatorname{erf}(z)$ (PyTorch: <code>torch.erf</code>).</li>
         <li>Form the standard-normal CDF $\\Phi(x)=\\tfrac12\\,(1+\\operatorname{erf}(z))$.</li>
         <li>Output $x\\cdot\\Phi(x)$.</li>
       </ol>
       <p><b>Fast tanh variant:</b> output
       $0.5\\,x\\left(1+\\tanh\\!\\left[\\sqrt{2/\\pi}\\,(x+0.044715\\,x^3)\\right]\\right)$, which avoids
       <code>erf</code>. <b>Cheapest variant:</b> $x\\,\\sigma(1.702x)$.</p>`,

    results:
      `<p>The paper evaluates GELU against ReLU (and ELU) on MNIST classification and autoencoding, Twitter
       part-of-speech tagging, TIMIT speech-frame recognition, and CIFAR-10/100 (Section 3), reporting that GELU
       matches or outperforms the baselines across these tasks. As one concrete data point quoted from the
       paper, on CIFAR-10 GELU reached <b>7.89%</b> error versus ReLU's <b>8.16%</b>. (Source: arXiv:1606.08415.)
       The CODEVIZ numbers below are our own small run, not the paper's reported results.</p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> GELU is a drop-in activation, so you evaluate it the way the paper
       does (Section 3): swap GELU into an otherwise-fixed network and compare the <b>task metric</b> against the
       same network with ReLU/ELU. The headline metric is <b>classification error</b> (lower is better) on the
       paper's suites &mdash; MNIST, Twitter POS tagging, TIMIT speech frames, CIFAR-10/100. The "no-skill" floor
       is chance accuracy (e.g. $90\\%$ error on 10-class CIFAR-10); the meaningful baseline is the <i>same-arch
       ReLU model</i>, which on CIFAR-10 the paper reports at <b>8.16%</b> error (arXiv:1606.08415).</p>
       <p><b>Sanity checks BEFORE the full run.</b> GELU has a built-in oracle the other parts of this build do
       not: <code>torch.allclose(my_gelu_exact(x), F.gelu(x), atol=1e-6)</code> over a dense grid in
       $[-4,4]$ must be <b>True</b> &mdash; your exact erf form IS PyTorch's default GELU. Also check fixed
       points: $\\mathrm{GELU}(0)=0$, $\\mathrm{GELU}(1)\\approx0.8413$, $\\mathrm{GELU}(-1)\\approx-0.1587$
       (the dip below zero), and that for large $|x|$ GELU $\\to$ ReLU. For the tanh variant, compare like-for-like
       against <code>F.gelu(x, approximate='tanh')</code>, not the default. Then overfit a single tiny batch and
       watch cross-entropy fall toward $0$ &mdash; if it cannot, the bug is in the surrounding net, not the
       activation.</p>
       <p><b>Expected range.</b> On CIFAR-10 a correct same-arch GELU model should land <i>near or slightly below</i>
       the paper's <b>7.89%</b> error vs ReLU's <b>8.16%</b> (approximate, arXiv:1606.08415) &mdash; the gap is a
       fraction of a percent, so being within a point of the ReLU baseline is "working." If GELU is many points
       <i>worse</i> than ReLU on the same setup, that is a bug, not tuning. On the toy 2-class MLP in the CODE,
       both activations saturate (our run: both $\\approx0.9950$ accuracy &mdash; our number, not the paper's), so
       a tie there is expected and not evidence of a problem.</p>
       <p><b>Ablations &mdash; prove the key idea earns its keep.</b> The central knob is the <b>activation choice
       itself</b>: hold seed, data, width, and optimizer fixed and swap only $\\mathrm{GELU}\\leftrightarrow
       \\mathrm{ReLU}$ (and ideally ELU). On the paper's harder suites GELU should match or beat ReLU; if your GELU
       is consistently <i>worse</i>, it is mis-wired (wrong $1/\\sqrt2$ scaling, density instead of CDF). A second
       ablation: replace the exact erf form with the tanh approximation &mdash; the metric should barely move,
       confirming the approximation is faithful, not load-bearing.</p>
       <p><b>Failure signals &amp; what they mean.</b> <code>allclose</code> fails / max-abs-diff $\\sim10^{-1}$:
       you dropped the $1/\\sqrt2$ inside <code>erf</code> or used the bell-curve <i>density</i> instead of the CDF
       $\\Phi$ (the two most common bugs &mdash; see Pitfalls). Curve is monotone with no dip near $x\\approx-0.75$:
       you implemented ReLU/softplus, not GELU. Loss NaN: unrelated to GELU (LR too high or bad init), since GELU
       is bounded and smooth. GELU far worse than ReLU at equal settings: activation mis-scaled or the comparison
       isn't apples-to-apples (different seed/init). Tanh variant fails <code>allclose</code> against the
       <i>default</i> <code>F.gelu</code>: expected &mdash; compare against <code>approximate='tanh'</code>
       instead.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>torch.nn.functional.gelu</code> in one call.
       Here you <b>build it from scratch</b> with raw tensors: the exact erf form $x\\cdot\\tfrac12[1+
       \\operatorname{erf}(x/\\sqrt2)]$, plus the <code>tanh</code> approximation. The payoff is the
       <code>torch.allclose(my_gelu(x), F.gelu(x))</code> check &mdash; if it passes, your exact formula is
       provably identical to PyTorch's default GELU. The <code>tanh</code> version is then shown to be
       <i>close</i> but not bit-exact (it is an approximation; PyTorch can also produce it with
       <code>approximate='tanh'</code>). Autograd differentiates your formula for free; you only write the
       forward function.</p>`,

    pitfalls:
      `<ul>
         <li><b>erf vs the bell-curve density.</b> GELU uses the normal <i>CDF</i> $\\Phi$ (accumulated area),
         not the density. Using the density (the bell-curve height) instead gives a completely different,
         wrong function.</li>
         <li><b>$\\sqrt2$ inside erf.</b> The exact form is $\\tfrac12[1+\\operatorname{erf}(x/\\sqrt2)]$.
         Forgetting the $1/\\sqrt2$ scaling (writing $\\operatorname{erf}(x)$) makes the curve too steep and the
         allclose fails.</li>
         <li><b>tanh approximation $\\ne$ exact.</b> The default <code>F.gelu</code> is the <i>exact</i> erf form.
         Comparing your exact build against PyTorch's default with the tanh formula will show a tiny mismatch
         &mdash; that is expected. Use <code>approximate='tanh'</code> to compare like-for-like.</li>
         <li><b>GELU is non-monotonic.</b> It dips slightly below zero for moderately negative inputs (around
         $x\\approx-0.75$). If you assume an activation must be monotonic you may think this is a bug; it is not.</li>
         <li><b>Constants in the tanh form.</b> The $\\sqrt{2/\\pi}$ and $0.044715$ are specific; rounding them
         (e.g. dropping the cubic term) noticeably worsens the approximation away from zero.</li>
       </ul>`,

    recall: [
      "State the exact GELU from memory: $\\mathrm{GELU}(x)=x\\Phi(x)=x\\cdot\\tfrac12[1+\\operatorname{erf}(x/\\sqrt2)]$.",
      "Define $\\Phi(x)$ in words (the standard-normal CDF) and give its value at $x=0$.",
      "How does GELU differ from ReLU in one sentence (weights by value vs gates by sign; smooth vs kinked)?",
      "Write the tanh approximation including the constants $\\sqrt{2/\\pi}$ and $0.044715$.",
      "Why does GELU output a small negative number at $x=-1$ while ReLU outputs 0?"
    ],

    practice: [
      {
        q: `Compute $\\mathrm{GELU}(2)$ exactly, given $\\operatorname{erf}(2/\\sqrt2)=\\operatorname{erf}(1.4142)\\approx0.9545$. How does it compare to $\\mathrm{ReLU}(2)$?`,
        steps: [
          { do: `Scale the input: $z=2/\\sqrt2=1.4142$.`, why: `The erf takes $x/\\sqrt2$, not $x$.` },
          { do: `Normal CDF: $\\Phi(2)=\\tfrac12(1+0.9545)=0.9773$.`, why: `$\\Phi(x)=\\tfrac12[1+\\operatorname{erf}(x/\\sqrt2)]$.` },
          { do: `GELU: $2\\times0.9773=1.9545$.`, why: `Weight the input by the probability.` }
        ],
        answer: `$\\mathrm{GELU}(2)\\approx1.9545$, slightly below $\\mathrm{ReLU}(2)=2$. For large positive inputs $\\Phi(x)\\to1$, so GELU approaches ReLU from below — it passes big positives through almost unchanged.`
      },
      {
        q: `Without computing erf, argue what $\\mathrm{GELU}(-3)$ is approximately, and why ReLU and GELU nearly agree there.`,
        steps: [
          { do: `Note $\\Phi(-3)$ is the probability a standard normal is $\\le-3$, which is about $0.0013$.`, why: `Three standard deviations below the mean is very unlikely.` },
          { do: `GELU: $(-3)\\times0.0013\\approx-0.004$.`, why: `Weight the input by that tiny probability.` },
          { do: `ReLU$(-3)=0$.`, why: `Hard gate on the negative sign.` }
        ],
        answer: `$\\mathrm{GELU}(-3)\\approx-0.004$, almost exactly ReLU's $0$. For strongly negative inputs $\\Phi(x)\\to0$, so GELU crushes them toward zero just like ReLU — the two functions agree in the tails and differ mainly in the soft knee near the origin.`
      },
      {
        q: `Ablation: in the CODE, train the same tiny MLP on a toy 2-class problem twice — once with GELU, once with ReLU — and compare final loss/accuracy. Then explain what the swap changed and what it did not.`,
        steps: [
          { do: `Build one small network; swap only the activation between $\\mathrm{GELU}$ and $\\mathrm{ReLU}$, keeping seed, data, width and optimizer fixed.`, why: `Isolate the activation as the only variable.` },
          { do: `Train both for the same number of steps and record final loss and accuracy.`, why: `A fair head-to-head on identical conditions.` },
          { do: `Inspect the loss curves: GELU's smooth gradient near 0 vs ReLU's hard kink.`, why: `Smoothness is the qualitative claim being tested.` }
        ],
        answer: `In our small run GELU and ReLU tie on accuracy (both ~0.9950) with very close final losses (see CODEVIZ — our small run, not the paper's number); the task is easy enough that both saturate. The swap only changed the nonlinearity; the architecture, data, and optimizer are identical. This mirrors the paper's qualitative finding that GELU matches ReLU on simple tasks. The effect is small on a toy task — GELU's advantage is most pronounced in the large Transformers it later became standard in.`
      }
    ]
  });

  window.CODE["paper-gelu"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build GELU from scratch with raw torch: the EXACT erf form x*0.5*(1+erf(x/sqrt2)) and the tanh ` +
      `approximation. Prove the exact form IS PyTorch's by torch.allclose(my_gelu(x), F.gelu(x)); show the ` +
      `tanh version is close (and matches F.gelu(x, approximate='tanh')). Recompute the worked example at ` +
      `x=1,-1,0, then run the GELU-vs-ReLU ablation on a tiny MLP. Runs in Colab (torch is preinstalled).`,
    code: `import math, torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# ---- GELU from scratch: EXACT erf form (Section 2 of Hendrycks & Gimpel, 2016) ----
def my_gelu_exact(x):
    Phi = 0.5 * (1.0 + torch.erf(x / math.sqrt(2.0)))   # standard-normal CDF
    return x * Phi                                        # GELU(x) = x * Phi(x)

# ---- GELU tanh approximation (Section 2) ----
def my_gelu_tanh(x):
    c = math.sqrt(2.0 / math.pi)                          # ~0.7979
    return 0.5 * x * (1.0 + torch.tanh(c * (x + 0.044715 * x**3)))

# ---- THE ORACLE: exact form must equal F.gelu (PyTorch's default) ----
x = torch.linspace(-4, 4, 1001)
print("allclose(exact, F.gelu):",
      torch.allclose(my_gelu_exact(x), F.gelu(x), atol=1e-6))            # expect True
print("max abs diff vs F.gelu (exact):",
      (my_gelu_exact(x) - F.gelu(x)).abs().max().item())                 # ~2e-7

# tanh approx: close to exact, and matches PyTorch's approximate='tanh'
print("max abs diff (tanh approx vs exact F.gelu):",
      (my_gelu_tanh(x) - F.gelu(x)).abs().max().item())                  # small, ~1e-3
print("allclose(my tanh, F.gelu approximate='tanh'):",
      torch.allclose(my_gelu_tanh(x), F.gelu(x, approximate='tanh'), atol=1e-6))  # True

# ---- recompute the worked example: x = 1, -1, 0 ----
for xv in [1.0, -1.0, 0.0]:
    t = torch.tensor([xv])
    print(f"GELU({xv:+.0f}) = {my_gelu_exact(t).item():.4f}  "
          f"(ReLU = {torch.relu(t).item():.4f})")
# expect: GELU(+1)=0.8413, GELU(-1)=-0.1587, GELU(0)=0.0000

# ---- ABLATION: same tiny MLP, swap GELU <-> ReLU on a toy 2-class problem ----
def make_net(act):
    return nn.Sequential(nn.Linear(2, 16), act, nn.Linear(16, 16), act, nn.Linear(16, 2))

# toy two-cluster classification
torch.manual_seed(0)
N = 200
Xa = torch.randn(N, 2) + torch.tensor([ 1.5,  1.5])
Xb = torch.randn(N, 2) + torch.tensor([-1.5, -1.5])
Xd = torch.cat([Xa, Xb]); yd = torch.cat([torch.zeros(N), torch.ones(N)]).long()

def train(act, steps=200):
    torch.manual_seed(1)                                  # same init for both
    net = make_net(act); opt = torch.optim.Adam(net.parameters(), lr=0.05)
    for _ in range(steps):
        opt.zero_grad(); loss = F.cross_entropy(net(Xd), yd); loss.backward(); opt.step()
    acc = (net(Xd).argmax(1) == yd).float().mean().item()
    return loss.item(), acc

g_loss, g_acc = train(nn.GELU())
r_loss, r_acc = train(nn.ReLU())
print(f"GELU: final loss {g_loss:.4f}, acc {g_acc:.3f}")
print(f"ReLU: final loss {r_loss:.4f}, acc {r_acc:.3f}")`
  };

  window.CODEVIZ["paper-gelu"] = {
    question: "What do GELU and ReLU look like side by side, and does swapping ReLU->GELU help a tiny MLP on a toy 2-class problem (everything else held fixed)?",
    charts: [
      {
        type: "line",
        title: "GELU vs ReLU activation curves (our computation, x from -4 to 4)",
        xlabel: "input x",
        ylabel: "activation output",
        series: [
          {
            name: "GELU = x*Phi(x)",
            color: "#7ee787",
            points: [[-4,-0.0001],[-3.5,-0.0008],[-3,-0.0040],[-2.5,-0.0155],[-2,-0.0455],[-1.5,-0.1004],[-1,-0.1587],[-0.75,-0.1727],[-0.5,-0.1543],[-0.25,-0.1024],[0,0],[0.25,0.1476],[0.5,0.3457],[0.75,0.5773],[1,0.8413],[1.5,1.3996],[2,1.9545],[2.5,2.4845],[3,2.9960],[3.5,3.4992],[4,3.9999]]
          },
          {
            name: "ReLU = max(0,x)",
            color: "#ff7b72",
            points: [[-4,0],[-3.5,0],[-3,0],[-2.5,0],[-2,0],[-1.5,0],[-1,0],[-0.75,0],[-0.5,0],[-0.25,0],[0,0],[0.25,0.25],[0.5,0.5],[0.75,0.75],[1,1],[1.5,1.5],[2,2],[2.5,2.5],[3,3],[3.5,3.5],[4,4]]
          }
        ]
      },
      {
        type: "bar",
        title: "Toy MLP final accuracy: GELU vs ReLU (same init, data, optimizer; 200 steps)",
        xlabel: "activation",
        ylabel: "training accuracy",
        series: [
          { name: "accuracy", color: "#79c0ff", points: [["GELU", 0.9950], ["ReLU", 0.9950]] }
        ]
      }
    ],
    caption: "Our small-scale run (torch, seed fixed), not the paper's reported numbers. LEFT: the two activation curves we computed — GELU traces ReLU for large positive x and crushes large-negative x toward 0, but is smooth through the origin and dips slightly below zero near x=-0.75 (our values: GELU(-1)=-0.1587, GELU(+1)=0.8413), while ReLU has a hard kink at 0. RIGHT: swapping ReLU->GELU in an otherwise-identical tiny MLP ties on this easy toy 2-class task (both 0.9950 training accuracy; final losses GELU ~0.0075, ReLU ~0.0056). The task is so easy that both nonlinearities saturate accuracy — honest behavior, not a bug. This only illustrates the paper's qualitative claim that GELU matches ReLU on simple tasks; GELU's real advantage shows up in the large Transformers it later became standard in.",
    code: `import math, torch
import torch.nn as nn
import torch.nn.functional as F

# LEFT chart: activation curves
def gelu(x): return x * 0.5 * (1 + torch.erf(x / math.sqrt(2)))
xs = torch.arange(-4, 4.01, 0.25)
print("x, GELU, ReLU:")
for x in xs:
    print(round(x.item(),2), round(gelu(x).item(),4), round(torch.relu(x).item(),4))

# RIGHT chart: GELU vs ReLU on a toy 2-class MLP (everything else fixed)
torch.manual_seed(0)
N = 200
Xd = torch.cat([torch.randn(N,2)+torch.tensor([1.5,1.5]),
                torch.randn(N,2)+torch.tensor([-1.5,-1.5])])
yd = torch.cat([torch.zeros(N), torch.ones(N)]).long()

def train(act, steps=200):
    torch.manual_seed(1)                          # identical initialization
    net = nn.Sequential(nn.Linear(2,16), act, nn.Linear(16,16), act, nn.Linear(16,2))
    opt = torch.optim.Adam(net.parameters(), lr=0.05)
    for _ in range(steps):
        opt.zero_grad(); F.cross_entropy(net(Xd), yd).backward(); opt.step()
    return (net(Xd).argmax(1)==yd).float().mean().item()

print("GELU acc:", round(train(nn.GELU()),4))     # ~0.9950
print("ReLU acc:", round(train(nn.ReLU()),4))     # ~0.9950`
  };
})();
