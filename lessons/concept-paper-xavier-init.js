/* Paper lesson — Understanding the difficulty of training deep feedforward neural networks
   (Xavier Glorot & Yoshua Bengio, 2010; AISTATS / PMLR v9). NO arXiv — grounded from the official
   PMLR PDF: proceedings.mlr.press/v9/glorot10a (Section 4.2.1 "Theoretical Considerations for Weight
   Initialization", eqs. (8)–(16); Section 4.2.2 "Gradient Propagation Study", Figs. 6–7; Table 1 and
   the Section 5 conclusions).
   Track A (primitive): build Xavier/Glorot initialization from scratch with raw torch, verify with
   torch.allclose against torch.nn.init.xavier_uniform_'s bound; then show activation + gradient
   variance stay stable across a deep tanh net with Xavier vs collapse with naive init.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-xavier-init". */
(function () {
  window.LESSONS.push({
    id: "paper-xavier-init",
    title: "Xavier / Glorot Init — Understanding the difficulty of training deep feedforward networks (2010)",
    tagline: "Scale the random starting weights to $\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$ so signal and gradient variance stay roughly constant through a deep net instead of vanishing or exploding.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Xavier Glorot, Yoshua Bengio",
      org: "DIRO, Université de Montréal",
      year: 2010,
      venue: "AISTATS 2010 (Proceedings of Machine Learning Research, Vol. 9)",
      citations: "",
      arxiv: "",
      url: "https://proceedings.mlr.press/v9/glorot10a",
      code: ""
    },

    conceptLink: "dl-init",
    partOf: [],
    prereqs: ["dl-init", "dl-backprop", "dl-activations", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A neural network starts from <b>random</b> weights and is trained by
       <b>gradient descent</b> &mdash; repeatedly nudging the weights downhill on a loss. ("Gradient" = the
       slope of the loss with respect to a weight; the direction and steepness of downhill.) Each layer
       computes <code>z = activation(x &middot; W + b)</code>, where <code>W</code> is that layer's weight
       <b>matrix</b> (a grid of numbers), <code>x</code> the layer's input, and the <b>activation</b> is a
       squashing function such as <b>tanh</b> (the hyperbolic tangent, which maps any number into the range
       $(-1,1)$).</p>
       <p><b>What was broken.</b> In 2010 deep feedforward networks (many stacked layers) trained badly from
       random starts &mdash; the abstract asks why "standard gradient descent from random initialization is
       doing so poorly with deep neural networks." The authors traced it to how the <b>variance</b> of two
       quantities behaves as you go <i>through</i> the layers. ("Variance" = how spread out a set of numbers
       is around their average; large variance = big swings, near-zero variance = everything bunched near
       one value.) If each layer multiplies the signal's variance by a factor bigger than 1, the signal
       <b>explodes</b> with depth; if smaller than 1, it <b>vanishes</b> toward zero. The same happens to the
       <b>back-propagated gradient</b> (the error signal sent backward to update earlier layers). With the
       initialization people used, deep layers saturated and early-layer gradients shrank to almost nothing,
       so the bottom of the network barely learned.</p>`,

    contribution:
      `<p>The paper diagnoses the failure with a simple variance analysis and proposes a fix
       (Section 4.2.1):</p>
       <ul>
         <li><b>A variance budget for the forward pass.</b> To keep the activation variance the same in every
         layer, the weights must satisfy $n_\\text{in}\\,\\mathrm{Var}(W)=1$ (eq. 10): bigger fan-in needs
         smaller weights.</li>
         <li><b>A variance budget for the backward pass.</b> To keep the back-propagated <i>gradient</i>
         variance the same in every layer, the weights must satisfy $n_\\text{out}\\,\\mathrm{Var}(W)=1$
         (eq. 11).</li>
         <li><b>The compromise &mdash; "normalized initialization."</b> The two budgets disagree unless every
         layer is the same width, so the paper splits the difference: $\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$
         (eq. 12). Drawing from a uniform distribution with this variance gives the rule now called
         <b>Xavier (or Glorot) initialization</b>: $W\\sim U\\!\\left[-\\sqrt6/\\sqrt{n_\\text{in}+n_\\text{out}},\\,
         +\\sqrt6/\\sqrt{n_\\text{in}+n_\\text{out}}\\right]$ (eq. 16).</li>
       </ul>`,

    whyItMattered:
      `<p>This was one of the results that made training deep networks <i>routine</i> rather than a black art.
       The "keep the variance constant across layers" principle is now the default reasoning behind every
       initializer. It directly fathered <b>He initialization</b> (2015), which redoes exactly this variance
       budget for <b>ReLU</b> activations (where half the inputs are zeroed, so the right scale is
       $\\mathrm{Var}(W)=2/n_\\text{in}$ instead) &mdash; see the cross-linked <code>paper-he-init</code>
       lesson. PyTorch ships this paper as <code>torch.nn.init.xavier_uniform_</code> and
       <code>xavier_normal_</code>, and it remains the standard initializer for tanh- and sigmoid-style and
       attention layers.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the one-paragraph pitch: random init + plain gradient descent trains deep
         nets poorly; they study how activations and gradients vary across layers and propose a new
         initialization.</li>
         <li><b>Section 4.2.1 ("Theoretical Considerations for Weight Initialization")</b> &mdash; the heart of
         the paper. The forward condition (eq. 10), the backward condition (eq. 11), the compromise (eq. 12),
         and the final uniform rule (eq. 16). This is the part you implement.</li>
         <li><b>Section 4.2.2 ("Gradient Propagation Study") with Figures 6 and 7</b> &mdash; the empirical
         payoff: with standard init the activation histograms and back-propagated gradients shrink for higher
         layers; with normalized init they stay healthy.</li>
       </ul>
       <p><b>Skim:</b> Sections 2&ndash;3 (the saturation study of sigmoid units) for motivation; Section 5 and
       Table 1 for the headline error numbers (you can quote them, you do not need to reproduce them).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will push a unit-variance input through <b>10 tanh layers</b> twice
       from the same start: once with weights initialized by <b>Xavier</b> ($\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$),
       once with a <b>naive</b> init that ignores fan-in. As you go deeper, will the per-layer activation
       spread (its standard deviation) stay roughly steady under Xavier but collapse toward zero under the
       naive init? And will the <b>back-propagated gradient</b> survive to the first layer under Xavier but
       nearly vanish under the naive init? Write your guesses, then check the worked example and the CODEVIZ
       chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>xavier_uniform(n_in, n_out)</code> that returns an
       $n_\\text{in}\\times n_\\text{out}$ weight matrix sampled by the paper's eq. (16), using only raw torch:</p>
       <ul>
         <li><code># TODO: limit = sqrt(6 / (n_in + n_out))</code> &mdash; the uniform bound from eq. (16),
         rewritten as $\\sqrt{6/(n_\\text{in}+n_\\text{out})}$.</li>
         <li><code># TODO: W = torch.empty(n_in, n_out).uniform_(-limit, +limit)</code> &mdash; sample each weight
         from $U[-\\text{limit},+\\text{limit}]$.</li>
         <li><code># TODO: return W</code> &mdash; its variance should be $\\text{limit}^2/3 = 2/(n_\\text{in}+n_\\text{out})$.</li>
       </ul>
       <p>The CODE cell below is the full reference, including the
       <code>torch.allclose</code> check that your <code>limit</code> equals the bound PyTorch's
       <code>torch.nn.init.xavier_uniform_</code> uses &mdash; that passing check is the proof your formula is
       exactly PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Track one number through the network: the <b>variance</b> of the signal in each layer. Assume (the
       paper's linear-regime hypothesis, eq. 4) we are near initialization where tanh is roughly the identity,
       so $f'(s)\\approx 1$ and one layer is just $z = x\\,W$. Assume the inputs and weights are independent,
       mean-zero, and each layer has $n_\\text{in}$ inputs.</p>
       <ol>
         <li><b>One layer multiplies the variance by $n_\\text{in}\\,\\mathrm{Var}(W)$.</b> Each output is a sum
         of $n_\\text{in}$ independent products (input &times; weight). The variance of a sum of independent
         terms is the sum of their variances, and the variance of a product of two independent mean-zero things
         is the product of their variances. So $\\mathrm{Var}(z)=n_\\text{in}\\,\\mathrm{Var}(W)\\,\\mathrm{Var}(x)$.
         The factor that changes the variance from input to output is therefore $n_\\text{in}\\,\\mathrm{Var}(W)$.</li>
         <li><b>Forward condition (eq. 10).</b> To keep the activation variance the same in every layer
         (eq. 8 wants $\\mathrm{Var}(z^i)=\\mathrm{Var}(z^{i'})$ for all layers), set that factor to 1:
         $n_\\text{in}\\,\\mathrm{Var}(W)=1$, i.e. $\\mathrm{Var}(W)=1/n_\\text{in}$.</li>
         <li><b>Backward condition (eq. 11).</b> The same algebra applied to the gradient flowing
         <i>backward</i> uses the number of <i>outputs</i> $n_\\text{out}$ instead (each weight fans the error
         out to $n_\\text{out}$ units). To keep the gradient variance constant (eq. 9) you need
         $n_\\text{out}\\,\\mathrm{Var}(W)=1$, i.e. $\\mathrm{Var}(W)=1/n_\\text{out}$.</li>
         <li><b>The compromise (eq. 12).</b> Both can hold at once only if $n_\\text{in}=n_\\text{out}$. For a
         general layer the paper averages the two denominators, giving
         $\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$.</li>
         <li><b>Turn a target variance into a sampling rule (eq. 16).</b> A uniform distribution $U[-r,r]$ has
         variance $r^2/3$. Setting $r^2/3 = 2/(n_\\text{in}+n_\\text{out})$ and solving gives
         $r=\\sqrt{6}/\\sqrt{n_\\text{in}+n_\\text{out}}$. So sample each weight from
         $U\\!\\left[-\\sqrt6/\\sqrt{n_\\text{in}+n_\\text{out}},\\,+\\sqrt6/\\sqrt{n_\\text{in}+n_\\text{out}}\\right]$.</li>
       </ol>
       <p><b>Why the old "standard" init failed.</b> The init people used (the paper's eq. 1,
       $U[-1/\\sqrt n,\\,1/\\sqrt n]$) gives $n\\,\\mathrm{Var}(W)=1/3$ (eq. 15). A factor of $1/3 \\lt 1$ per
       layer means the back-propagated gradient is multiplied by less than 1 at every step, so it
       <b>shrinks geometrically with depth</b> &mdash; exactly the vanishing the paper measures in Figure 7.</p>`,

    symbols: [
      { sym: "$W$", desc: "the weight matrix of one layer: the grid of numbers the layer multiplies its input by. We choose its random starting values." },
      { sym: "$n_\\text{in}$", desc: "the layer's fan-in: how many inputs feed each output unit (the paper writes $n_i$, the size of layer $i$). More inputs means each output is a sum of more terms." },
      { sym: "$n_\\text{out}$", desc: "the layer's fan-out: how many output units the layer has (the paper writes $n_{i+1}$). It governs how the backward gradient spreads." },
      { sym: "$\\mathrm{Var}(\\cdot)$", desc: "variance: how spread out a set of numbers is around their average. Big variance = big swings; near-zero = bunched near one value." },
      { sym: "$\\mathrm{Var}(W)$", desc: "the variance of the (shared) random weights in a layer — the single number this paper tells us how to set." },
      { sym: "$z^i$ / $\\mathbf{z}^i$", desc: "the activation vector of layer $i$ — the layer's output after the activation function. Eq. (8) asks its variance be equal across all layers $i$." },
      { sym: "$\\partial \\text{Cost}/\\partial s^i$", desc: "the back-propagated gradient at layer $i$: the error signal sent backward. Eq. (9) asks its variance be equal across all layers." },
      { sym: "$f$, $f'(0)$", desc: "the activation function (e.g. tanh) and its slope at 0. The paper assumes a symmetric activation with $f'(0)=1$, so near initialization the layer behaves linearly (eq. 4: $f'(s)\\approx 1$)." },
      { sym: "$U[-r,\\,r]$", desc: "the uniform distribution between $-r$ and $+r$: every value in that range equally likely. Its variance is $r^2/3$." },
      { sym: "linear regime", desc: "the assumption that, right after random init, inputs to tanh are small, so tanh acts almost like the identity line $f(s)\\approx s$. This makes the variance algebra exact." },
      { sym: "vanishing / exploding", desc: "when the per-layer variance factor is &lt;1 the signal (or gradient) shrinks toward 0 through depth (vanishing); when &gt;1 it blows up (exploding)." }
    ],

    formula:
      `$$\\textbf{Forward (eq. 10):}\\quad n_\\text{in}\\,\\mathrm{Var}(W)=1
        \\qquad\\textbf{Backward (eq. 11):}\\quad n_\\text{out}\\,\\mathrm{Var}(W)=1$$
       $$\\textbf{Compromise (eq. 12):}\\quad \\mathrm{Var}(W)=\\frac{2}{n_\\text{in}+n_\\text{out}}$$
       $$\\textbf{Sampling rule (eq. 16):}\\quad
         W\\sim U\\!\\left[-\\frac{\\sqrt6}{\\sqrt{n_\\text{in}+n_\\text{out}}},\\;
         +\\frac{\\sqrt6}{\\sqrt{n_\\text{in}+n_\\text{out}}}\\right]$$`,

    whatItDoes:
      `<p>The first line says: to keep the signal from shrinking or growing as it passes <i>forward</i> through
       a layer, the weight variance must be $1/n_\\text{in}$; to keep the gradient steady as it passes
       <i>backward</i>, it must be $1/n_\\text{out}$. Since both rarely hold at once, the compromise (eq. 12)
       sets the variance to $2/(n_\\text{in}+n_\\text{out})$ &mdash; the average of the two demands. The last
       line just turns that target variance into a concrete way to draw the weights: a uniform range whose
       half-width is $\\sqrt6/\\sqrt{n_\\text{in}+n_\\text{out}}$, because $U[-r,r]$ has variance $r^2/3$ and
       $(\\sqrt6/\\sqrt{n_\\text{in}+n_\\text{out}})^2/3 = 2/(n_\\text{in}+n_\\text{out})$.</p>`,

    derivation:
      `<p>The "what is initialization and why does scale matter" picture is owned by the <code>dl-init</code>
       concept lesson &mdash; see it for the intuition and the interactive variance-vs-depth demo. Here is the
       one piece specific to this paper: <b>where $\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$ comes from</b>
       (Section 4.2.1).</p>
       <p><b>Step 1 — one layer's variance factor.</b> Near init we are in the linear regime (eq. 4,
       $f'(s)\\approx 1$), so output unit $j$ is $z_j=\\sum_{k=1}^{n_\\text{in}} x_k W_{kj}$. The $x_k$ and
       $W_{kj}$ are independent and mean-zero, so each product has variance
       $\\mathrm{Var}(x)\\,\\mathrm{Var}(W)$, and a sum of $n_\\text{in}$ independent such terms has variance
       $n_\\text{in}$ times that:</p>
       $$\\mathrm{Var}(z) = n_\\text{in}\\,\\mathrm{Var}(W)\\,\\mathrm{Var}(x).$$
       <p><b>Step 2 — forward condition (eq. 10).</b> To leave the variance unchanged ($\\mathrm{Var}(z)=\\mathrm{Var}(x)$,
       which chained over layers gives eq. 8), the factor must be 1: $n_\\text{in}\\,\\mathrm{Var}(W)=1$.</p>
       <p><b>Step 3 — backward condition (eq. 11).</b> The back-propagated gradient at a layer is, by the chain
       rule, a sum over the $n_\\text{out}$ units it feeds (the paper's eqs. 2&ndash;7). The same independent-sum
       argument gives a per-layer factor $n_\\text{out}\\,\\mathrm{Var}(W)$; keeping the gradient variance constant
       (eq. 9) needs $n_\\text{out}\\,\\mathrm{Var}(W)=1$.</p>
       <p><b>Step 4 — compromise (eq. 12).</b> The two ask for $\\mathrm{Var}(W)=1/n_\\text{in}$ and
       $\\mathrm{Var}(W)=1/n_\\text{out}$. They agree only when $n_\\text{in}=n_\\text{out}$. The paper takes the
       harmonic-style average by using the <i>sum</i> of fan-in and fan-out in the denominator:
       $\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$, which reduces to $1/n$ when the widths are equal.</p>
       <p><b>Step 5 — sampling rule (eq. 16).</b> A draw from $U[-r,r]$ has variance $r^2/3$ (standard fact for
       a uniform distribution). Solve $r^2/3 = 2/(n_\\text{in}+n_\\text{out})$:
       $r = \\sqrt{6/(n_\\text{in}+n_\\text{out})} = \\sqrt6/\\sqrt{n_\\text{in}+n_\\text{out}}$, which is eq. (16).</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; a layer with fan-in $n_\\text{in}=4$ and fan-out $n_\\text{out}=6$:</p>
       <ul>
         <li>Target variance (eq. 12): $\\mathrm{Var}(W)=\\dfrac{2}{n_\\text{in}+n_\\text{out}}=\\dfrac{2}{4+6}=\\dfrac{2}{10}=0.2$.</li>
         <li>Uniform half-width (eq. 16): $r=\\dfrac{\\sqrt6}{\\sqrt{n_\\text{in}+n_\\text{out}}}=\\dfrac{\\sqrt6}{\\sqrt{10}}=\\sqrt{0.6}\\approx 0.7746$.</li>
         <li><b>Check the variance:</b> $U[-r,r]$ has variance $r^2/3=(0.7746)^2/3=0.6/3=0.2$. &check; It matches the target exactly.</li>
       </ul>
       <p>So we sample every weight in this layer uniformly from about $[-0.775,\\,+0.775]$ and the resulting
       weight variance is $0.2$, the value eq. (12) demands. Compare the old standard init's
       $U[-1/\\sqrt n,1/\\sqrt n]$, which gives $n\\,\\mathrm{Var}(W)=1/3$ (eq. 15) &mdash; a per-layer factor of
       $1/3\\lt 1$, so signal and gradient shrink with depth. The CODE cell recomputes these exact numbers and
       prints them.</p>`,

    recipe:
      `<p><b>Xavier (normalized) initialization, as numbered steps</b> &mdash; for each layer with fan-in
       $n_\\text{in}$ and fan-out $n_\\text{out}$:</p>
       <ol>
         <li>Compute the target variance $\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$ (eq. 12).</li>
         <li>Compute the uniform half-width $r=\\sqrt{6/(n_\\text{in}+n_\\text{out})}$ (eq. 16).</li>
         <li>Draw every weight independently from $U[-r,\\,r]$.</li>
         <li>Set the biases to 0 (a mean-zero start; the analysis assumes mean-zero signals).</li>
         <li>(Normal variant) Alternatively draw from a Gaussian with mean 0 and standard deviation
         $\\sqrt{2/(n_\\text{in}+n_\\text{out})}$ &mdash; same variance, what
         <code>torch.nn.init.xavier_normal_</code> does.</li>
       </ol>`,

    results:
      `<p>Quoted from the paper (Section 5): on the Shapeset-$3\\times2$ task the baseline RBF SVM "obtained
       59.47% test error, while on the same set we obtained 50.47% with a depth five hyperbolic tangent network
       with normalized initialization." Table 1 also reports, for 5-hidden-layer nets, tanh with standard init
       at <b>27.15%</b> versus tanh with normalized init ("Tanh N") at <b>15.60%</b> on Shapeset-$3\\times2$ (and
       1.76% &rarr; 1.64% on MNIST). The paper's qualitative conclusion: "for tanh networks, the proposed
       normalized initialization can be quite helpful, presumably because the layer-to-layer transformations
       maintain magnitudes of activations (flowing upward) and gradients (flowing backward)." (Source:
       proceedings.mlr.press/v9/glorot10a, Section 5 and Table 1.) The CODEVIZ numbers below are our own small
       run, not the paper's reported results.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>torch.nn.init.xavier_uniform_</code> in one
       call. Here you <b>derive and build it from scratch</b>: compute the half-width
       $\\sqrt{6/(n_\\text{in}+n_\\text{out})}$ and sample $U[-r,r]$ with raw torch. The payoff is the
       <code>torch.allclose</code> check that your bound equals the one PyTorch computes internally &mdash; if it
       passes, your initializer <i>is</i> PyTorch's. Then you push a unit-variance input through a deep tanh net
       (forward) and back-propagate a dummy loss (backward) to <b>verify</b> that activation and gradient
       variance stay stable with Xavier but collapse with a naive init &mdash; reproducing the paper's
       Figures 6&ndash;7 qualitatively on toy data.</p>`,

    pitfalls:
      `<ul>
         <li><b>$\\sqrt6$ vs $\\sqrt3$ vs $\\sqrt2$ confusion.</b> The $\\sqrt6$ in eq. (16) is specific to the
         <i>uniform</i> rule (because $U[-r,r]$ has variance $r^2/3$). The <i>normal</i> variant uses standard
         deviation $\\sqrt{2/(n_\\text{in}+n_\\text{out})}$. Don't put $\\sqrt6$ on a Gaussian.</li>
         <li><b>fan-in + fan-out, not fan-in alone.</b> Xavier uses <i>both</i> (eq. 12). Using only
         $n_\\text{in}$ is the <b>He init</b> rule for ReLU (a different paper, $2/n_\\text{in}$). Match the
         activation: Xavier for tanh/sigmoid, He for ReLU.</li>
         <li><b>Reading fan-in/fan-out off the weight shape.</b> For a <code>Linear</code> layer PyTorch stores
         <code>weight</code> as <code>(out_features, in_features)</code>, so fan-in is the <i>second</i>
         dimension. Get this backwards and the scale is wrong for non-square layers.</li>
         <li><b>The linear-regime assumption is approximate.</b> The variance algebra assumes tanh acts linearly
         ($f'(0)=1$). It is exact only near init; once activations saturate, the constant-variance guarantee
         weakens (the paper notes this in Section 4.3). It is a <i>starting</i>-point guarantee.</li>
         <li><b>Forgetting to zero the biases.</b> The derivation assumes mean-zero signals; nonzero biases
         shift the mean and break the clean variance accounting.</li>
       </ul>`,

    recall: [
      "State the Xavier variance target from memory: $\\mathrm{Var}(W)=2/(n_\\text{in}+n_\\text{out})$ (eq. 12).",
      "Give the uniform sampling rule (eq. 16) and explain where the $\\sqrt6$ comes from.",
      "What are the forward (eq. 10) and backward (eq. 11) conditions, and why do they force a compromise?",
      "Why does the old standard init $U[-1/\\sqrt n,1/\\sqrt n]$ (with $n\\,\\mathrm{Var}(W)=1/3$) make gradients vanish with depth?",
      "How does He init differ from Xavier, and why ($2/n_\\text{in}$ vs $2/(n_\\text{in}+n_\\text{out})$)?"
    ],

    practice: [
      {
        q: `Compute the Xavier uniform bound for a hidden layer with $n_\\text{in}=256$ and $n_\\text{out}=256$, and check its variance.`,
        steps: [
          { do: `Target variance: $\\mathrm{Var}(W)=2/(256+256)=2/512=1/256\\approx 0.00391$.`, why: `Eq. (12) with equal widths reduces to $1/n$.` },
          { do: `Half-width: $r=\\sqrt{6/512}=\\sqrt{0.011719}\\approx 0.1083$.`, why: `Eq. (16).` },
          { do: `Variance of $U[-r,r]$: $r^2/3=(0.1083)^2/3\\approx 0.01173/3\\approx 0.00391$.`, why: `Confirms it equals the target.` }
        ],
        answer: `Sample weights from $U[-0.108,\\,+0.108]$; the variance is $\\approx 0.00391 = 1/256$, exactly eq. (12). For a square layer Xavier's $2/(n_\\text{in}+n_\\text{out})$ collapses to $1/n$, satisfying both the forward and backward conditions at once.`
      },
      {
        q: `Why does keeping the per-layer variance factor at 1 stop both vanishing AND exploding signals in a deep net?`,
        steps: [
          { do: `One layer multiplies the variance by $n_\\text{in}\\,\\mathrm{Var}(W)$.`, why: `Sum of independent products (walkthrough step 1).` },
          { do: `Through $L$ layers the variance is multiplied by that factor $L$ times: $(\\text{factor})^L$.`, why: `Each layer applies it again.` },
          { do: `If factor $\\lt 1$, $(\\text{factor})^L\\to 0$ (vanish); if $\\gt 1$, $\\to\\infty$ (explode); if $=1$ it stays put.`, why: `Geometric growth/decay with depth.` }
        ],
        answer: `Because the factor compounds multiplicatively across depth, anything other than 1 grows or decays geometrically — fatal in deep nets. Setting $n_\\text{in}\\,\\mathrm{Var}(W)=1$ makes the factor exactly 1, so the signal variance is preserved layer after layer. Xavier picks the variance to keep this factor near 1 for both the forward signal and the backward gradient at once.`
      },
      {
        q: `Ablation: in the CODE's deep-tanh experiment, replace the Xavier init with the naive init (weights $\\sim U[-1,1]$, ignoring fan-in). What happens to the activation and gradient variance across the 10 layers, and why?`,
        steps: [
          { do: `Swap the Xavier limit $\\sqrt{6/(n_\\text{in}+n_\\text{out})}$ for a fixed limit of 1.`, why: `Removes the fan-in scaling; per-layer factor is now far from 1.` },
          { do: `Re-run the forward pass and print each layer's activation std.`, why: `Inputs to tanh become large, so tanh saturates to $\\pm 1$ (or, for too-small inits, collapse to 0).` },
          { do: `Re-run the backward pass and print each layer's gradient std.`, why: `Saturated tanh has slope $\\approx 0$, so $f'$ kills the back-propagated gradient.` }
        ],
        answer: `The naive init does not keep the per-layer variance factor near 1, so the variance compounds the wrong way through depth. In our CODEVIZ run, the paper's "standard" init drives the activation std from 1.0 down to ~0.003 by layer 10 (vanishing), and its early-layer gradient is ~200× smaller than its late-layer gradient. Xavier keeps the activation std healthy (1.0 → ~0.22) and the gradient far better preserved (early-layer gradient only ~4× smaller). This is the paper's Figures 6–7 reproduced on toy data: matching the variance budget is what keeps a deep tanh net trainable.`
      }
    ]
  });

  window.CODE["paper-xavier-init"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build Xavier/Glorot init from scratch: compute the uniform half-width sqrt(6/(fan_in+fan_out)) and ` +
      `sample U[-r, r]. Prove it matches PyTorch by checking your bound equals the one ` +
      `torch.nn.init.xavier_uniform_ uses (torch.allclose). Then VERIFY the paper's claim: push a ` +
      `unit-variance input through 10 tanh layers and back-propagate a dummy loss, with Xavier vs a naive ` +
      `(standard) init, and print per-layer activation + gradient std — stable with Xavier, collapsing ` +
      `with naive. Finally recompute the worked example (n_in=4, n_out=6). Runs in Colab (torch preinstalled).`,
    code: `import torch, math
torch.manual_seed(0)

# ---- Xavier uniform from scratch: eq.(16) of Glorot & Bengio (2010) ----
def xavier_uniform(n_in, n_out):
    """W ~ U[-sqrt(6/(n_in+n_out)), +sqrt(6/(n_in+n_out))]  (variance = 2/(n_in+n_out))."""
    limit = math.sqrt(6.0 / (n_in + n_out))            # eq.(16) half-width
    return torch.empty(n_in, n_out).uniform_(-limit, limit)

# ---- THE ORACLE: my bound must equal torch.nn.init.xavier_uniform_'s bound ----
# PyTorch's xavier_uniform_ fills weight (shape out,in) using a = gain*sqrt(6/(fan_in+fan_out)).
n_in, n_out = 256, 128
W = torch.empty(n_out, n_in)                            # PyTorch stores (out_features, in_features)
torch.nn.init.xavier_uniform_(W)                        # gain=1 by default
mine_limit = math.sqrt(6.0 / (n_in + n_out))            # my eq.(16) bound
torch_limit = W.abs().max().item()                      # PyTorch's actual max |weight| ~= its bound
print("my limit  :", round(mine_limit, 6))
print("torch limit:", round(torch_limit, 6))
print("allclose vs torch.nn.init bound:",
      torch.allclose(torch.tensor(mine_limit), torch.tensor(torch_limit), atol=2e-3))  # expect True

# ---- recompute the worked example: n_in=4, n_out=6 ----
nin, nout = 4, 6
varW = 2.0 / (nin + nout)                               # eq.(12) -> 0.2
r = math.sqrt(6.0 / (nin + nout))                       # eq.(16) -> 0.7746
print("worked example: Var(W)=2/(4+6)=", varW, " r=sqrt(6/10)=", round(r, 4),
      " check r^2/3=", round(r*r/3, 4))                 # 0.2, 0.7746, 0.2

# ---- VERIFY: activation + gradient variance through a deep tanh net ----
def deep_tanh_pass(init, depth=10, width=128):
    x = torch.randn(256, width); x = x / x.std()         # unit-variance input
    Ws = []
    for _ in range(depth):
        if init == "xavier":
            Ws.append(xavier_uniform(width, width))      # eq.(16) scaling
        else:                                            # naive "standard" init, eq.(1)
            lim = 1.0 / math.sqrt(width)                 # U[-1/sqrt(n), 1/sqrt(n)] -> n*Var=1/3
            Ws.append(torch.empty(width, width).uniform_(-lim, lim))
    for W in Ws: W.requires_grad_(True)
    h = x; acts = [h.std().item()]
    for W in Ws:
        h = torch.tanh(h @ W); acts.append(h.std().item())
    loss = h.mean()                                      # dummy scalar loss
    loss.backward()
    grads = [W.grad.std().item() for W in Ws]            # per-layer weight-gradient std
    return acts, grads

for init in ["xavier", "naive"]:
    a, g = deep_tanh_pass(init)
    print(f"\\n[{init}] activation std by layer:", [round(v, 4) for v in a])
    print(f"[{init}] grad std layer0 vs last : {g[0]:.2e}  ->  {g[-1]:.2e}  (ratio {g[0]/g[-1]:.3f})")
# Xavier: activations stay ~O(0.2), gradient survives to layer 0.
# Naive (standard, n*Var=1/3 < 1): activations collapse toward 0, early gradient ~vanishes.`
  };

  window.CODEVIZ["paper-xavier-init"] = {
    question: "Push a unit-variance input through 10 tanh layers with Xavier vs the paper's 'standard' init — does the activation variance stay stable with Xavier but collapse toward zero with the standard init (the paper's Figure 6)?",
    charts: [
      {
        type: "line",
        title: "Activation std per layer through a 10-layer tanh net: Xavier (normalized) vs standard init",
        xlabel: "layer depth (0 = input)",
        ylabel: "activation standard deviation",
        series: [
          {
            name: "Xavier  Var(W)=2/(n_in+n_out)",
            color: "#7ee787",
            points: [[0,1.0],[1,0.6303],[2,0.4888],[3,0.4066],[4,0.3552],[5,0.3175],[6,0.2875],[7,0.2618],[8,0.241],[9,0.2265],[10,0.217]]
          },
          {
            name: "standard  U[-1/sqrt(n),1/sqrt(n)]",
            color: "#ff7b72",
            points: [[0,1.0],[1,0.4629],[2,0.2518],[3,0.1407],[4,0.0803],[5,0.046],[6,0.0262],[7,0.0148],[8,0.0084],[9,0.0048],[10,0.0028]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 3), not the paper's reported numbers. A unit-variance input is pushed through 10 width-128 tanh layers. With the paper's standard initialization the activation std collapses from 1.0 to ~0.003 by layer 10 — the signal vanishes, exactly the saturation the paper shows in Figure 6 (top). Xavier's normalized init holds the std in a healthy band (1.0 → ~0.22), because it keeps the per-layer variance factor near 1 (Figure 6, bottom). In the same run the back-propagated gradient at layer 0 is ~200x smaller than at the last layer under standard init, but only ~4x smaller under Xavier — the gradient-stability claim of Section 4.2.2 / Figure 7.",
    code: `import numpy as np
def run(init, depth=10, width=128, seed=3):
    rng = np.random.default_rng(seed)
    x = rng.standard_normal((256, width)); x /= x.std()   # unit-variance input
    Ws = []
    for _ in range(depth):
        if init == "normalized":                          # Xavier, eq.(16)
            lim = np.sqrt(6) / np.sqrt(2 * width)
        else:                                             # standard, eq.(1)
            lim = 1.0 / np.sqrt(width)
        Ws.append(rng.uniform(-lim, lim, (width, width)))
    h = x; post = [h]
    for W in Ws:
        h = np.tanh(h @ W); post.append(h)
    act_std = [round(p.std(), 4) for p in post]
    # backprop a unit dummy gradient to read gradient std per layer
    g = rng.standard_normal(post[-1].shape); g /= np.linalg.norm(g)
    gstd = []
    for l in reversed(range(depth)):
        g = g * (1 - post[l + 1] ** 2)                    # tanh'
        gstd.append(g.std()); g = g @ Ws[l].T
    gstd = gstd[::-1]
    return act_std, gstd

for init in ["normalized", "standard"]:
    a, gr = run(init)
    print(init, "act std:", a)
    print(init, "grad ratio layer0/last:", round(gr[0] / gr[-1], 3))
# normalized act std: [1.0, 0.6303, ..., 0.217]   grad ratio ~0.267
# standard   act std: [1.0, 0.4629, ..., 0.0028]   grad ratio ~0.005`
  };
})();
