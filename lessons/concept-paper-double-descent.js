/* Paper lesson — "Deep Double Descent: Where Bigger Models and More Data Hurt"
   (Nakkiran, Kaplun, Bansal, Yang, Barak, Sutskever), arXiv:1912.02292, 2019.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-double-descent".
   GROUNDED from arXiv:1912.02292 (abstract) and the ar5iv HTML mirror
   (Section 2 Definition 1 = Effective Model Complexity; Section 2 Hypothesis 1 =
   the three regimes + test-error peak at the interpolation threshold; Section 1
   = the classical bias-variance connection; Section 4 = CIFAR / ResNet18 / label
   noise experiments).
   Track B (architecture): compose a random-feature regression model with numpy /
   torch primitives, sweep the FEATURE COUNT (model size), and reproduce the novel
   EMPIRICAL phenomenon — test error falls, then PEAKS exactly at the interpolation
   threshold (features = samples), then falls AGAIN in the over-parameterized regime. */
(function () {
  window.LESSONS.push({
    id: "paper-double-descent",
    title: "Deep Double Descent — Where Bigger Models and More Data Hurt (2019)",
    tagline: "As model size grows, test error first falls, then peaks right where the model just fits the training set, then falls again.",
    module: "Papers · Foundations & Optimization",
    track: "architecture",
    paper: {
      authors: "Preetum Nakkiran, Gal Kaplun, Yamini Bansal, Tristan Yang, Boaz Barak, Ilya Sutskever",
      org: "Harvard University and OpenAI",
      year: 2019,
      venue: "arXiv:1912.02292 (Dec 2019); ICLR 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/1912.02292",
      code: ""
    },
    conceptLink: "ml-bias-variance",
    partOf: [],
    prereqs: ["ml-bias-variance"],

    // WHY READ IT
    problem:
      `<p>Classical statistics gives a clean rule for choosing model size. A <b>model</b> is the function we
       fit to data; its <b>size</b> (or <b>capacity</b>) is roughly how many free parameters it has, that is,
       how many numbers it can tune. The rule is the <b>bias-variance tradeoff</b>, drawn as a U-shaped curve:
       a model that is too small <i>underfits</i> (cannot capture the pattern, high error), a model that is
       too big <i>overfits</i> (memorizes noise in the training data, also high error), and the best model
       sits in the middle at the bottom of the U.</p>
       <p>Modern deep learning breaks this rule in plain sight. The networks that work best have <b>far more
       parameters than training examples</b> &mdash; sometimes hundreds of times more. The classical U-curve
       says these huge models should overfit badly and generalize terribly. Instead they generalize well.
       Practitioners had a working folk rule ("bigger is better, just keep scaling") that flatly contradicts
       the textbook picture, and nobody had reconciled the two.</p>
       <p>From the abstract:</p>
       <blockquote>"We show that a variety of modern deep learning tasks exhibit a 'double-descent' phenomenon
       where, as we increase model size, performance first gets worse and then gets better." (Abstract)</blockquote>
       <p>The open question this paper answers: what actually happens to test error across the <i>whole</i>
       range of model sizes, from tiny to enormous &mdash; and where exactly does the classical U-curve hand
       off to the "bigger is better" regime?</p>`,
    contribution:
      `<ul>
        <li><b>The double-descent curve.</b> Sweep model size from small to large and plot test error.
        It is <i>not</i> a U. It descends (classical regime), rises to a <b>peak</b>, then descends a
        <b>second</b> time (the "double" descent). The over-parameterized models past the peak can beat
        every model in the classical regime.</li>
        <li><b>The peak sits at the interpolation threshold.</b> The paper pins down <i>where</i> the peak is:
        right where the model first becomes big enough to fit the training set exactly (drive training error
        to zero). They call this the <b>interpolation threshold</b>.</li>
        <li><b>Effective Model Complexity (EMC), a unifying measure.</b> They define one quantity &mdash; the
        largest number of samples the training procedure can fit to near-zero error &mdash; and show the same
        double-descent shape appears when you vary model size, training time (epochs), <i>or</i> dataset size
        against it. This is what lets them state that, in a narrow regime, adding more training data can
        actually <b>hurt</b> test error (the paper's title).</li>
      </ul>`,
    whyItMattered:
      `<p>Double descent reconciled two camps that had been talking past each other: the classical statisticians
       who warned that over-parameterized models must overfit, and the deep-learning practitioners who kept
       making models bigger and watching them improve. The paper showed both are right &mdash; on opposite
       sides of the interpolation threshold. The U-curve is real, but only in the under-parameterized regime;
       past the peak a second, modern regime takes over.</p>
       <p>It also gave a concrete warning with teeth: near the threshold, the usual intuitions invert. More
       parameters can hurt, more <i>data</i> can hurt, and more <i>training time</i> can hurt &mdash; until you
       push past the peak. The work built on earlier "double descent" observations (Belkin and colleagues, 2018)
       and extended them from simple models to deep networks at scale, making the phenomenon impossible to
       dismiss as a toy-model curiosity.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction) and Figure 1</b> &mdash; the headline double-descent picture and the
        framing against the classical bias-variance U-curve. This is the one figure to internalize.</li>
        <li><b>&sect;2 (Our Results), Definition 1</b> &mdash; <b>Effective Model Complexity (EMC)</b>. Read
        the definition slowly; it is the quantity everything else is measured against.</li>
        <li><b>&sect;2, Hypothesis 1</b> &mdash; the generalized double-descent statement: the three regimes
        (under-, critically-, over-parameterized) and the claim that the test-error peak occurs when EMC
        equals the number of training samples $n$.</li>
        <li><b>&sect;4 (Model-wise Double Descent)</b> &mdash; the experiments that sweep model <i>width</i>:
        ResNet18 and 5-layer convolutional networks on CIFAR-10 / CIFAR-100, with added <b>label noise</b>
        (mislabeled training points), which sharpens the peak.</li>
       </ul>
       <p><b>Skim:</b> &sect;5-6 (epoch-wise double descent and the sample-wise "more data hurts" experiments)
       on a first pass &mdash; they are the same phenomenon viewed along a different axis. Come back to them
       once the model-size curve is solid.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will fit a random-feature regression model to <b>noisy</b> data and sweep the number of features
       $D$ (the model size) from tiny up to far more than the number of training points $n$. A <b>random
       feature</b> is a fixed random nonlinear transform of the input; $D$ of them gives the model $D$ knobs to
       fit with. We hold $n$ fixed.</p>
       <p>Sketch what you expect the <b>test error</b> to do as $D$ grows from $2$ up past $D = n$ to $D = 10n$.
       Will it: (a) keep falling, (b) fall then rise and stay high (the classical U, never recovering), or
       (c) something else? Mark on your sketch where $D = n$ &mdash; the point where the model has exactly as
       many features as training points. Write one sentence on what you think happens to <b>training error</b>
       at and beyond that point.</p>`,
    attempt:
      `<p>Before the reveal, write the sweep you will run. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Generate $n$ training inputs and $n_{\\text{test}}$ test inputs. Build noisy training labels:
        $y = \\text{teacher}(x) + \\text{noise}$. Keep test labels <b>clean</b> (no noise) &mdash; we score
        against the true signal.</li>
        <li>Fix a big bank of random features. For each model size $D$, take the first $D$ of them to build the
        feature matrix $\\Phi$ (shape: rows = samples, columns = $D$ features).</li>
        <li><b>Fit (TODO):</b> solve least squares for the weights. When $D \\lt n$ this is ordinary regression;
        when $D \\ge n$ there are many exact fits &mdash; pick the <b>minimum-norm</b> one (the
        <i>pseudo-inverse</i> gives both automatically). Why minimum-norm? &mdash; TODO, one sentence.</li>
        <li><b>Record (TODO):</b> training mean-squared error and test mean-squared error at each $D$.</li>
        <li>Plot both versus $D$. TODO: predict the $D$ at which test error peaks <i>before</i> you look.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The paper's machinery is one definition and one hypothesis. Everything follows from them.</p>
       <p><b>Step 1 &mdash; measure "complexity" by what a procedure can fit.</b> Instead of counting parameters
       (which is a poor proxy for deep networks), the paper measures complexity operationally. The <b>Effective
       Model Complexity (EMC)</b> of a training procedure is the <i>largest number of training samples it can
       drive to near-zero training error</i> (&sect;2, Definition 1). A bigger / longer-trained / more-flexible
       procedure has higher EMC. Crucially this rolls model size, training time, and other choices into a single
       number, all measured in the same units as the dataset size $n$.</p>
       <p><b>Step 2 &mdash; the interpolation threshold.</b> The <b>interpolation threshold</b> is the point
       where EMC equals $n$: the procedure is just barely powerful enough to fit (interpolate) all $n$ training
       points exactly, including any noisy / mislabeled ones. Below it, the model cannot fit the training set;
       above it, it can fit it in many different ways.</p>
       <p><b>Step 3 &mdash; the three regimes (Hypothesis 1, &sect;2).</b> Compare EMC to $n$:</p>
       <ul>
        <li><b>Under-parameterized</b> (EMC sufficiently smaller than $n$): increasing complexity <i>decreases</i>
        test error. This is the classical regime &mdash; the left, downhill arm of the bias-variance U.</li>
        <li><b>Critically parameterized</b> (EMC $\\approx n$): right at the threshold, a small change in
        complexity "might decrease or increase test error" &mdash; this is where the <b>peak</b> lives. The
        model is forced to fit every noisy point exactly, so it contorts wildly and generalizes badly.</li>
        <li><b>Over-parameterized</b> (EMC sufficiently larger than $n$): increasing complexity <i>decreases</i>
        test error again. The model has room to fit the data <i>and</i> stay smooth (the minimum-norm fit),
        so the second descent begins.</li>
       </ul>
       <p><b>Step 4 &mdash; why "double".</b> Plotting test error against complexity therefore gives two downhill
       arms separated by a peak at EMC $= n$: descend, peak, descend. That is the double-descent curve. The
       over-parameterized arm can end up <i>below</i> the best classical point, which is why "just make it bigger"
       works in practice.</p>`,
    architecture:
      `<p>This is a theory / empirical paper, so the "architecture" is not a single layer stack &mdash; it is an
       <b>experimental pipeline</b> that <i>sweeps</i> a model family along one axis and reads off test error.
       Double descent is a property of the <b>sweep</b>, not of any one network. Here is the pipeline component
       by component (&sect;4&ndash;6).</p>
       <ol>
        <li><b>The model family being swept.</b> The paper does not study one fixed network; it studies a
        <i>family</i> indexed by a width parameter $k$, then runs every member.
         <ul>
          <li><b>ResNet18</b> with the four stages widened to $[k, 2k, 4k, 8k]$ convolutional channels; the
          standard ResNet18 is $k = 64$, and they sweep $k$ from very thin (e.g. $k = 1$) up to and past $k = 64$.</li>
          <li><b>5-layer CNNs</b> (four conv layers of width $[k, 2k, 4k, 8k]$ plus a fully-connected head),
          swept the same way.</li>
          <li><b>6-layer Transformers</b> (encoder&ndash;decoder, Vaswani et al. 2017) for translation, scaled by
          the embedding width $d_{\\text{model}}$ with feed-forward width $d_{\\text{ff}} = 4\\,d_{\\text{model}}$.</li>
         </ul>
        Each value of the index ($k$ or $d_{\\text{model}}$) is one <b>point</b> on the x-axis; the whole sweep is
        the experiment.</li>
        <li><b>The axis varied to cross the interpolation threshold.</b> The same double-descent shape appears
        along <i>three</i> different sweep axes &mdash; this is the paper's unifying move:
         <ul>
          <li><b>Model-wise</b> (&sect;4): hold data and epochs fixed, sweep <b>width</b> $k$. Test error peaks
          where width first makes the net able to interpolate the training set.</li>
          <li><b>Epoch-wise</b> (&sect;5): hold the (large) model and data fixed, sweep <b>training time</b> in
          epochs. Training longer raises effective complexity, so a fixed big model walks through under-, critical-,
          and over-parameterized regimes <i>over the course of training</i>.</li>
          <li><b>Sample-wise</b> (&sect;6): hold model and epochs fixed, sweep <b>training-set size</b> $n$. Near
          the threshold, adding samples pushes the curve so that <i>more data hurts</i> &mdash; the title effect.</li>
         </ul></li>
        <li><b>Effective Model Complexity (EMC) is the common x-coordinate.</b> Width, epochs, and sample size are
        three knobs, but they map onto <i>one</i> ruler: EMC, the largest training set the procedure can fit to
        near-zero error (tolerance $\\epsilon = 0.1$). The pipeline's job is to slide EMC from below $n$ to above
        $n$ &mdash; whichever knob does the sliding &mdash; and watch the test-error curve descend, <b>peak at
        EMC $\\approx n$</b>, and descend again. The interpolation threshold is the single point where EMC $= n$.</li>
        <li><b>Label noise (optional, but it sharpens the peak).</b> A fraction $p$ of training labels is
        randomly corrupted (uniform random label with probability $p$; the paper shows $p = 10\\%, 15\\%, 20\\%$),
        sampled <b>once</b> and frozen for all of training. Forcing the net to interpolate these wrong labels at
        the threshold is what makes the test-error spike dramatic; with clean labels the peak is faint.</li>
        <li><b>Training procedure (the rest of $\\mathcal{T}$).</b> For images: Adam at learning rate $0.0001$ for
        $4000$ epochs (or SGD with an inverse-square-root schedule, $\\sim$500K steps), batch size $128$, on
        <b>CIFAR-10 / CIFAR-100</b> ($50000$ training images). For translation: Transformers on IWSLT'14 De&rarr;En
        and WMT'14 En&rarr;Fr, $\\sim$80K gradient steps, $10\\%$ label smoothing, no dropout. The optimizer, epoch
        count, and these choices are <i>part of</i> $\\mathcal{T}$, which is exactly why EMC &mdash; not raw
        parameter count &mdash; is the right x-axis.</li>
        <li><b>The measured quantity.</b> At every point of the sweep the pipeline records <b>train error</b> and
        <b>test error</b> (for translation, per-token perplexity). Train error pinpoints the threshold (it first
        hits $\\approx 0$ exactly where EMC $= n$); test error traces the double-descent curve: descend &rarr;
        <b>peak at the threshold</b> &rarr; descend again.</li>
       </ol>
       <p>So the "architecture" to picture is a <b>loop</b>: for each setting of one axis, train a member of the
       model family to completion, log train/test error, and plot error against effective complexity. The famous
       curve is what that loop draws &mdash; an emergent property of the sweep, not a layer diagram. Our Track B
       reproduction below is exactly this pipeline shrunk to a random-feature regression whose width $D$ is the
       swept axis.</p>`,
    symbols: [
      { sym: "$n$", desc: "the <b>number of training samples</b> (labeled examples the model fits to). The interpolation threshold is measured relative to this." },
      { sym: "EMC", desc: "<b>Effective Model Complexity</b> (&sect;2, Definition 1): the <i>largest number of training samples</i> a training procedure can fit to near-zero training error. A single number, in the same units as $n$, that stands in for 'how powerful is this procedure'." },
      { sym: "$\\mathcal{T}$", desc: "a <b>training procedure</b>: the whole recipe &mdash; model architecture, size, optimizer, number of epochs &mdash; that maps a training set $S$ to a fitted classifier $\\mathcal{T}(S)$. EMC is a property of $\\mathcal{T}$, not just of the model's parameter count." },
      { sym: "$\\mathcal{D}$", desc: "the <b>data distribution</b> the samples are drawn from. $S \\sim \\mathcal{D}^n$ means a training set $S$ of $n$ independent draws from $\\mathcal{D}$." },
      { sym: "$\\text{Error}_S(\\cdot)$", desc: "the <b>mean training error</b> of a fitted model evaluated on the same training set $S$ it was fit on. EMC asks how large $S$ can be while this stays $\\le \\epsilon$." },
      { sym: "$\\epsilon$", desc: "a small <b>error tolerance</b> ('near-zero'); the paper heuristically uses $\\epsilon = 0.1$. EMC counts samples the procedure fits to training error below $\\epsilon$." },
      { sym: "$D$", desc: "in our reproduction, the <b>model size</b> we sweep: the number of random features. More features = more capacity = higher EMC. The interpolation threshold lands at $D \\approx n$." },
      { sym: "“interpolation threshold”", desc: "a plain term: the model size at which the model first fits the training set <b>exactly</b> (training error hits zero). Formally, where EMC $= n$. The test-error peak sits here." },
      { sym: "“over-parameterized”", desc: "a plain term: having <b>more parameters than training examples</b> ($D \\gt n$), so the model can fit the data in many different ways. The second descent happens here." },
      { sym: "“under-parameterized”", desc: "a plain term: having <b>fewer parameters than training examples</b> ($D \\lt n$), so the model cannot fit the training set exactly. The classical bias-variance U-curve lives here." },
      { sym: "“label noise”", desc: "a plain term: training labels that are randomly corrupted / mislabeled. The paper adds it (e.g. 15%) because it <b>sharpens</b> the peak &mdash; forcing the model to interpolate wrong labels is what makes the threshold so bad." },
      { sym: "“minimum-norm solution”", desc: "a plain term: when many weight vectors fit the data exactly (the over-parameterized case), the one with the <b>smallest size</b> ($\\sum w_i^2$). It is the smoothest such fit, and it is why the second descent generalizes well." }
    ],
    formula: `<p><b>This is an EMPIRICAL paper.</b> Its core contribution is a measured <i>phenomenon</i> &mdash;
       the double-descent risk curve (test error descends, peaks at the interpolation threshold, then descends
       again) &mdash; not a theorem with a derived closed-form equation. The math below is the paper's two formal
       objects: one <b>definition</b> (EMC) and one <b>hypothesis</b> (the regimes / the peak). Everything else
       in the paper is experimental evidence for that hypothesis.</p>

       $$ \\text{EMC}_{\\mathcal{D},\\epsilon}(\\mathcal{T}) \\;:=\\; \\max\\Big\\{\\, n \\;\\Big|\\; \\mathbb{E}_{S \\sim \\mathcal{D}^n}\\big[\\text{Error}_S(\\mathcal{T}(S))\\big] \\le \\epsilon \\,\\Big\\} $$
       <p>(&sect;2, Definition 1) <b>Effective Model Complexity.</b> The largest training-set size $n$ for which
       the procedure $\\mathcal{T}$, run on a random size-$n$ sample $S$ from distribution $\\mathcal{D}$, still
       achieves expected training error $\\text{Error}_S(\\mathcal{T}(S))$ at or below the small tolerance
       $\\epsilon$ (the paper heuristically uses $\\epsilon = 0.1$). In words: how many examples can this procedure
       fit to (near-)zero error.</p>

       $$ \\text{EMC}_{\\mathcal{D},\\epsilon}(\\mathcal{T}) \\;\\ll\\; n \\;\\;\\Longrightarrow\\;\\; \\partial_{\\text{complexity}}\\,\\text{TestError} \\,\\lt\\, 0 \\qquad\\text{(under-parameterized)} $$
       <p>(&sect;2, Hypothesis 1, first regime) When EMC is <b>sufficiently smaller</b> than $n$, any perturbation
       of $\\mathcal{T}$ that <i>increases</i> its effective complexity <b>decreases</b> test error &mdash; the
       classical downhill arm of the U-curve.</p>

       $$ \\text{EMC}_{\\mathcal{D},\\epsilon}(\\mathcal{T}) \\;\\gg\\; n \\;\\;\\Longrightarrow\\;\\; \\partial_{\\text{complexity}}\\,\\text{TestError} \\,\\lt\\, 0 \\qquad\\text{(over-parameterized)} $$
       <p>(&sect;2, Hypothesis 1, second regime) When EMC is <b>sufficiently larger</b> than $n$, increasing
       effective complexity <b>again decreases</b> test error &mdash; the modern second descent.</p>

       $$ \\text{EMC}_{\\mathcal{D},\\epsilon}(\\mathcal{T}) \\;\\approx\\; n \\;\\;\\Longrightarrow\\;\\; \\partial_{\\text{complexity}}\\,\\text{TestError} \\;\\;\\text{may be}\\;\\; \\lt 0 \\;\\text{ or }\\; \\gt 0 \\qquad\\text{(critically parameterized)} $$
       <p>(&sect;2, Hypothesis 1, third regime) When EMC $\\approx n$ &mdash; the <b>interpolation threshold</b>
       &mdash; a perturbation that increases complexity <i>might decrease or increase</i> test error. This is
       where the <b>test-error peak</b> lives: the procedure is just barely able to interpolate all $n$ points
       (including noisy ones), so the fit is wildly sensitive and generalizes worst.</p>`,
    whatItDoes:
      `<p>The formula is the definition of <b>Effective Model Complexity</b> (&sect;2, Definition 1), read inside
       out. $\\mathcal{T}(S)$ is the model you get by running the training procedure $\\mathcal{T}$ on a training
       set $S$. $\\text{Error}_S(\\cdot)$ is its <i>training</i> error on that same set. The expectation
       $\\mathbb{E}_{S \\sim \\mathcal{D}^n}$ averages over random training sets of size $n$ drawn from the data
       distribution $\\mathcal{D}$. So the condition "$\\mathbb{E}[\\text{Error}_S] \\le \\epsilon$" says: on
       average, the procedure fits a size-$n$ training set to (near-)zero error. The $\\max\\{n \\mid \\dots\\}$
       takes the <b>biggest such $n$</b> &mdash; the largest training set the procedure can still memorize.</p>
       <p>In words: EMC is "how many examples can this procedure fit perfectly?" It is a capacity measure stated
       in the currency of dataset size, so you can directly compare it to the actual $n$ you have. The whole
       paper hangs on one comparison: is EMC below $n$, equal to $n$, or above $n$?</p>`,
    derivation:
      `<p><b>Short recap &mdash; the bias-variance tradeoff lives in the ml-bias-variance concept lesson.</b>
       Recall the decomposition: expected test error splits into <b>bias</b> (error from the model being too
       rigid to capture the signal) plus <b>variance</b> (error from the model being so flexible it chases the
       noise in this particular training set) plus irreducible noise. The classical story: as model size grows,
       bias falls and variance rises, and their sum is U-shaped &mdash; one sweet spot in the middle.</p>
       <p><b>How double descent extends it.</b> The classical U-curve is computed only over the
       <b>under-parameterized</b> range ($D \\lt n$), and there it is exactly right &mdash; that is the first
       descent and the rise into the peak. The variance term keeps climbing as $D$ approaches $n$, exploding at
       the interpolation threshold: with just enough capacity to fit every point (including noisy ones) and no
       slack, the fit is forced to swing violently between training points, so it is wildly sensitive to the
       training sample. That is the peak.</p>
       <p>The new physics appears <i>past</i> $D = n$. Once the model is over-parameterized there are infinitely
       many exact fits, and the training procedure (gradient descent / the pseudo-inverse) does not pick a random
       one &mdash; it picks the <b>minimum-norm</b> fit, the smoothest function that still interpolates. As $D$
       grows further, this smoothest interpolant gets <i>smoother</i>, so variance comes <b>back down</b>. The
       classical decomposition never modeled this because it never imagined fitting the training set exactly on
       purpose. Double descent is the bias-variance curve <i>continued</i> past the threshold, where an implicit
       smoothness preference quietly tames the variance. The U-curve was not wrong &mdash; it was only the left
       half of the picture.</p>`,
    example:
      `<p>The full curve needs a computer, but you can hand-check the fitting step the sweep repeats &mdash; an
       ordinary least-squares fit in the <b>under-parameterized</b> regime. Take $n = 3$ training points and a
       model with $D = 2$ features: a bias feature (always $1$) and one input feature $x$. So the model is
       $\\hat y = a\\cdot 1 + b\\cdot x$, fit by least squares. Here $D = 2 \\lt n = 3$, so the model cannot fit
       all three points exactly &mdash; this is the classical side.</p>
       <p>Points: $x = [0, 1, 2]$ with noisy targets $y = [1, 1, 3]$; the two features per row are the bias
       ($1$) and $x$:</p>
       <table class="extable">
        <caption>The $n=3$ training points and their $D=2$ features (bias and $x$).</caption>
        <thead><tr><th></th><th class="num">feat 1 ($1$)</th><th class="num">feat 2 ($x$)</th><th class="num">target $y$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">point 0</td><td class="num">1</td><td class="num">0</td><td class="num">1</td></tr>
         <tr><td class="row-h">point 1</td><td class="num">1</td><td class="num">1</td><td class="num">1</td></tr>
         <tr><td class="row-h">point 2</td><td class="num">1</td><td class="num">2</td><td class="num">3</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Feature matrix.</b> $\\Phi = \\begin{bmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 1 & 2 \\end{bmatrix}$ (rows =
        the 3 points; columns = the 2 features). Targets $y = [1, 1, 3]$.</li>
        <li><b>Normal equations.</b> Least squares solves $\\Phi^{\\top}\\Phi\\,\\theta = \\Phi^{\\top}y$ for
        $\\theta = (a, b)$. Compute $\\Phi^{\\top}\\Phi = \\begin{bmatrix} 3 & 3 \\\\ 3 & 5 \\end{bmatrix}$ and
        $\\Phi^{\\top}y = \\begin{bmatrix} 5 \\\\ 7 \\end{bmatrix}$.</li>
        <li><b>Solve.</b> Two equations: $3a + 3b = 5$ and $3a + 5b = 7$. Subtract the first from the second:
        $2b = 2$, so $b = 1$. Back-substitute: $3a + 3 = 5$, so $a = \\tfrac{2}{3} \\approx 0.6667$. Thus
        $\\theta = (0.6667, 1)$.</li>
        <li><b>Training error.</b> Mean-squared error
        $= \\tfrac{1}{3}(0.1111 + 0.4444 + 0.1111) = \\mathbf{0.2222}$. Non-zero, because $D \\lt n$: the model is
        <b>under-parameterized</b> and cannot interpolate.</li>
       </ul>
       <table class="extable">
        <caption>Fit $\\hat y = 0.6667 + 1\\cdot x$: predictions, residuals, and squared residuals.</caption>
        <thead><tr><th></th><th class="num">$y$</th><th class="num">$\\hat y$</th><th class="num">$\\hat y - y$</th><th class="num">$(\\hat y - y)^2$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">point 0</td><td class="num">1</td><td class="num">0.6667</td><td class="num">-0.3333</td><td class="num">0.1111</td></tr>
         <tr><td class="row-h">point 1</td><td class="num">1</td><td class="num">1.6667</td><td class="num">0.6667</td><td class="num">0.4444</td></tr>
         <tr><td class="row-h">point 2</td><td class="num">3</td><td class="num">2.6667</td><td class="num">-0.3333</td><td class="num">0.1111</td></tr>
         <tr><td class="row-h">mean</td><td class="num">&mdash;</td><td class="num">&mdash;</td><td class="num">&mdash;</td><td class="num">0.2222</td></tr>
        </tbody>
       </table>
       <p>Now imagine adding a third feature ($D = 3 = n$): the matrix becomes square and invertible, the fit
       passes through all three points exactly, and training error drops to $0$. That is the interpolation
       threshold. The notebook recomputes these exact numbers, then sweeps $D$ far past it to draw the full
       double-descent curve.</p>`,
    recipe:
      `<ol>
        <li><b>Make data.</b> Draw $n$ training inputs $x \\in \\mathbb{R}^{d}$ (Gaussian, $d = 20$) and a large
        test set. Pick a fixed nonlinear <b>teacher</b> function. Training labels get <b>noise</b> added;
        test labels stay clean.</li>
        <li><b>Fix a random-feature bank.</b> Sample a big matrix $W$ of random weights once. The feature map is
        $\\phi(x) = \\text{ReLU}(Wx)$ &mdash; a fixed random nonlinear transform. (ReLU = rectified linear unit,
        $\\max(0, \\cdot)$.) Taking the first $D$ rows of $W$ gives a $D$-feature model.</li>
        <li><b>Sweep model size $D$</b> from a handful up to far more than $n$, with extra points clustered
        right around $D = n$ so the peak is visible.</li>
        <li><b>Fit by least squares</b> using the pseudo-inverse: $\\theta = \\Phi^{+} y$. Below the threshold
        this is ordinary regression; above it, it returns the <b>minimum-norm</b> exact fit automatically.</li>
        <li><b>Record</b> training mean-squared error and test mean-squared error at each $D$.</li>
        <li><b>Plot</b> both versus $D$. Confirm: training error falls to $0$ at $D = n$ and stays there; test
        error descends, <b>peaks at $D = n$</b>, then descends again. <b>Ablate</b> by setting the label noise
        to zero &mdash; the peak shrinks dramatically, confirming that interpolating <i>noise</i> is what
        creates it.</li>
      </ol>`,
    results:
      `<p>The paper's headline experiments (&sect;4) sweep network <b>width</b> on image classification. From the
       abstract, the unifying claim: performance "first gets worse and then gets better" as model size grows,
       and the same happens versus training epochs. They further state their complexity measure "allows us to
       identify certain regimes where increasing (even quadrupling) the number of train samples actually hurts
       test performance." (Abstract, quoted.)</p>
       <p>The deep-network experiments use ResNet18 and 5-layer convolutional networks on CIFAR-10 / CIFAR-100,
       with added <b>label noise</b> (e.g. mislabeling a fraction of training images) that sharpens the peak.
       <i>We do not quote specific CIFAR accuracy numbers here &mdash; consult Figure 1 and &sect;4 of the paper
       for the exact curves.</i></p>
       <p><i>The numbers in the CODEVIZ panel below are from our own tiny random-feature regression &mdash; not
       the paper's reported deep-network results. They reproduce the same qualitative double-descent shape.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> The deliverable is a <i>shape</i>, not a single score: plot
       <b>test error</b> (here mean-squared error on a clean held-out set; in the paper, test/classification
       error on <b>CIFAR-10 / CIFAR-100</b>) against model size $D$, and confirm it <b>descends, peaks at the
       interpolation threshold $D = n$, then descends again</b>. The "no-skill" reference is the
       constant-predictor error (predict the mean &mdash; MSE $\\approx \\mathrm{Var}(y)$); a correct fit in the
       under- and over-parameterized arms must beat it. The diagnostic baseline is the
       <b>classical-regime best</b> (lowest test error for $D \\lt n$): the second descent should end
       <i>below</i> it.</p>
       <p><b>2. Sanity checks BEFORE the full sweep.</b></p>
       <ul>
        <li><b>Recompute the worked example.</b> OLS on $x=[0,1,2]$, $y=[1,1,3]$ with $D=2$ ($1$ and $x$) must give
        $\\theta=(0.6667, 1)$ and training MSE $0.2222$ &mdash; the notebook's first cell prints these.</li>
        <li><b>Train error hits exactly $0$ at $D = n$.</b> The cheapest signal the build works: as $D$ crosses
        $n=60$, training MSE must fall to $\\approx 0$ and STAY there. If it never reaches $0$, your features are
        ill-conditioned (collinear) or you have a ridge penalty preventing interpolation.</li>
        <li><b>Min-norm check.</b> Past the threshold, <code>np.linalg.pinv</code> should return a solution with
        small $\\lVert\\theta\\rVert$ that still gives train MSE $\\approx 0$ &mdash; verify both before trusting the
        over-parameterized arm.</li>
       </ul>
       <p><b>3. Expected range.</b> Anchor to our tiny random-feature run (our numbers, not the paper's): test MSE
       descends to $\\approx 0.75$ in the classical regime, <b>spikes to $\\approx 48.9$ exactly at $D=n=60$</b>,
       then falls to $\\approx 0.22$ at $D=600$ &mdash; below the classical best. The paper's deep-net curves
       (Figure 1, &sect;4) show the same qualitative shape; we deliberately quote no CIFAR numbers. A peak that is
       barely above the surrounding error is "probably under-noised or under-sampled near $D=n$," not a tuning
       issue; the spike magnitude varies by seed/hardware.</p>
       <p><b>4. Ablation &mdash; prove the peak is caused by interpolating noise.</b> The central knob is the
       <b>training-label noise</b> (<code>noise_std</code>). Set it to $0$ (clean labels) and rerun, everything
       else identical: the peak at $D=n$ should <b>collapse</b> to a small bump or vanish, leaving a roughly
       monotone "bigger is a bit better" curve. If the spike survives with clean labels, your peak is an artifact
       (ill-conditioning at $D=n$), not double descent. A second ablation: add a <i>strong</i> ridge &mdash;
       training error never reaches $0$ and you recover only the classical U, confirming interpolation is required.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>No visible peak:</b> clean labels (no noise to interpolate), too-strong regularizer (no
        interpolation), or the sweep skipped over $D=n$ &mdash; cluster $D$ values densely around the threshold.</li>
        <li><b>Train error never $0$ at $D=n$:</b> collinear features in low input dimension &mdash; use
        higher-dimensional inputs ($d=20$ Gaussian) so $\\Phi$ is well-conditioned.</li>
        <li><b>Test error explodes everywhere (not just at $D=n$):</b> test labels are noisy too, or train/test
        teacher mismatch &mdash; keep test labels clean.</li>
        <li><b>Second descent never beats the classical best:</b> sweep didn't reach large enough $D$, or the
        min-norm solution wasn't used (you took a non-minimum-norm exact fit) &mdash; use the pseudo-inverse.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the contribution is an empirical <i>phenomenon</i>, not
       a new layer. So we <b>import</b> the plumbing &mdash; <code>numpy</code> for the linear algebra
       (<code>np.linalg.pinv</code> for the least-squares fit) and <code>torch</code> primitives are available
       if you prefer them &mdash; and we build the <b>experiment</b> that exposes the effect: the random-feature
       model, the noisy data, the sweep over model size $D$, and the train/test error curves. The novel thing we
       reproduce by hand is the <b>shape</b>: getting the test-error peak to land exactly at the interpolation
       threshold $D = n$, which requires (a) label noise on the training set and (b) the minimum-norm fit past
       the threshold. We do not re-derive the bias-variance decomposition &mdash; that is recapped from the
       <b>ml-bias-variance</b> concept lesson.</p>`,
    pitfalls:
      `<ul>
        <li><b>No label noise &rarr; no visible peak.</b> If the training labels are clean, interpolating them
        is harmless and the peak is tiny or absent. The double-descent <i>spike</i> comes from forcing the model
        to fit <b>noise</b> exactly at the threshold. <b>Fix:</b> add noise to the training labels (keep test
        labels clean).</li>
        <li><b>Using a strong ridge / regularizer.</b> A large ridge penalty prevents interpolation, so training
        error never reaches zero and the peak disappears &mdash; you just get the classical U. <b>Fix:</b> use
        the plain minimum-norm least-squares fit (pseudo-inverse), or at most a tiny ridge.</li>
        <li><b>Ill-conditioned features in low dimensions.</b> Random features of a 1-D input become nearly
        collinear, so the model cannot actually interpolate at $D = n$ and the curve is noise. <b>Fix:</b> use
        higher-dimensional inputs (e.g. $d = 20$ Gaussian) so the feature matrix is well-conditioned and truly
        hits zero training error at $D = n$.</li>
        <li><b>Not sampling densely enough near $D = n$.</b> The peak is narrow. If your sweep jumps from
        $D = 40$ to $D = 100$ you skip right over it. <b>Fix:</b> cluster extra $D$ values around the
        threshold.</li>
        <li><b>Confusing parameter count with EMC.</b> The paper deliberately does <i>not</i> measure complexity
        by raw parameter count &mdash; training time and other choices also raise EMC. The threshold is "where
        the procedure starts interpolating", not literally "where parameters = $n$" in every setting.</li>
      </ul>`,
    recall: [
      "State the definition of Effective Model Complexity (EMC) in one sentence.",
      "Where does the test-error peak occur, in terms of EMC and $n$?",
      "Name the three regimes and say what increasing complexity does to test error in each.",
      "Why does label noise sharpen the peak? Why does the over-parameterized arm generalize well?"
    ],
    practice: [
      {
        q: `<b>The label-noise ablation.</b> You have a working double-descent sweep with noisy training labels
            and a sharp test-error peak at $D = n$. Set the training-label noise to zero, rerun, everything else
            identical. What do you expect to happen to (a) the peak and (b) the over-parameterized arm, and why?`,
        steps: [
          { do: `Find the noise term: training labels are <code>y = teacher(x) + noise_std*randn(...)</code>. Set <code>noise_std = 0</code>.`, why: `With clean labels, the teacher signal is the only thing to fit; there is no corrupted point that forces the model to contort.` },
          { do: `Reason about the threshold $D = n$: the minimum-norm interpolant now passes through clean, consistent points, so it stays close to the smooth teacher even when forced to interpolate.`, why: `The peak's height is driven by how violently the fit must swing to hit <i>wrong</i> labels exactly. Remove the wrong labels and the swing &mdash; the variance explosion &mdash; mostly vanishes.` },
          { do: `Predict the curves: the peak shrinks to a small bump or disappears; the over-parameterized arm is roughly flat and low throughout.`, why: `Both descents persist (more features still help), but without noise there is little variance to explode at the threshold, so the dramatic spike is gone.` }
        ],
        answer: `<p>The peak <b>collapses</b>. With clean labels the model never has to fit a contradictory point,
                 so the variance explosion at $D = n$ &mdash; the source of the spike &mdash; largely disappears.
                 You are left with a curve that descends and then stays low, much closer to a monotone "bigger is
                 a bit better" shape. This is the key diagnostic: <b>double descent's spike is the cost of
                 interpolating noise.</b> The over-parameterized arm still generalizes well because the
                 minimum-norm fit of clean, consistent data is just the smooth teacher.</p>`
      },
      {
        q: `Classical bias-variance theory predicts a single U-shaped test-error curve: one sweet spot, and
            "bigger is worse" past it. Double descent shows test error <i>falling again</i> for very large
            models. Does this mean the bias-variance tradeoff is <b>wrong</b>? Explain precisely where it holds
            and where it is incomplete.`,
        steps: [
          { do: `Locate the U-curve on the double-descent plot: it is the under-parameterized region, $D \\lt n$.`, why: `Bias falls and variance rises with $D$ there, summing to a U &mdash; exactly the classical prediction. The first descent and the rise into the peak are the U.` },
          { do: `Identify what the classical theory left out: the regime $D \\gt n$, where the model fits the training set exactly and the procedure picks the minimum-norm interpolant.`, why: `Classical analysis never modeled deliberately interpolating the data, so it had no account of what happens past the threshold.` },
          { do: `Reason about variance past the threshold: as $D$ grows, the smoothest interpolant gets smoother, so variance falls again &mdash; the second descent.`, why: `An implicit smoothness preference (minimum norm) tames variance once there is slack, which the bias-variance bound did not capture.` }
        ],
        answer: `<p>It is <b>not wrong &mdash; it is incomplete</b>. The bias-variance U-curve is exactly right in
                 the <b>under-parameterized</b> regime ($D \\lt n$): that is the first descent and the climb to
                 the peak. What classical theory omitted is everything <i>past</i> the interpolation threshold,
                 because it never considered fitting the training set exactly on purpose. In the
                 over-parameterized regime the procedure picks the minimum-norm interpolant, whose variance
                 <i>falls</i> as the model grows &mdash; producing the second descent. Double descent is the
                 bias-variance curve continued past $D = n$. The U is the left half of a larger picture.</p>`
      },
      {
        q: `In the worked example you fit $\\hat y = a + b x$ to points $x = [0,1,2]$, $y = [1,1,3]$ and got
            $\\theta = (0.6667, 1)$ with training mean-squared error $0.2222$ &mdash; non-zero, because
            $D = 2 \\lt n = 3$. Now add a third feature $x^2$ so $D = 3 = n$. Without solving the full system,
            argue what the training error becomes and why this point is special.`,
        steps: [
          { do: `Count: with $D = 3$ features and $n = 3$ points, the feature matrix $\\Phi$ is $3 \\times 3$ and (for distinct $x$) invertible.`, why: `A square invertible system $\\Phi\\theta = y$ has an exact solution $\\theta = \\Phi^{-1}y$ &mdash; there is no residual left over.` },
          { do: `Conclude the fit passes through all three points exactly: $\\hat y = y$, so every residual is $0$.`, why: `Exact interpolation means zero training error by definition.` },
          { do: `Name the point: $D = n$ is the interpolation threshold &mdash; the model is just barely able to fit the training set.`, why: `Below it, training error is positive (under-parameterized); at and above it, training error is zero. This is exactly where the test-error peak sits.` }
        ],
        answer: `<p>Training error becomes <b>$0$</b>. With $D = 3$ features and $n = 3$ distinct points the
                 feature matrix is square and invertible, so $\\Phi\\theta = y$ is solved exactly and the fit
                 passes through every training point &mdash; no residual. This $D = n$ point is the
                 <b>interpolation threshold</b>: training error first hits zero here, and it is precisely where
                 double descent's test-error peak appears. Below it ($D = 2$) we had positive training error
                 $0.2222$; at it, zero; and only by going well <i>past</i> it does test error come back down.</p>`
      }
    ]
  });

  window.CODE["paper-double-descent"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a random-feature regression model and <b>reproduce the phenomenon</b>. The
       model is $\\hat y = \\Phi\\theta$ where $\\Phi = \\text{ReLU}(XW^{\\top})$ is a fixed random nonlinear
       feature map (ReLU = rectified linear unit, $\\max(0,\\cdot)$). We fit $\\theta$ by least squares with the
       pseudo-inverse (<code>np.linalg.pinv</code>): below the interpolation threshold this is ordinary
       regression; above it, it returns the <b>minimum-norm</b> exact fit. We use high-dimensional Gaussian
       inputs ($d = 20$) so the features stay well-conditioned, $n = 60$ training points with <b>noisy</b>
       labels, and clean test labels. The first cell recomputes the worked example
       ($\\theta = (0.6667, 1)$, training MSE $0.2222$). Then we sweep the feature count $D$ from $2$ to $600$,
       clustering points around $D = n = 60$, and print training and test mean-squared error. Watch training
       error hit $0$ at $D = 60$ and test error <b>peak</b> there before descending again. Pure numpy, CPU,
       runs in seconds.</p>`,
    code: `import numpy as np, math

# --- 0. Sanity-check the worked example: OLS fit, D=2 features, n=3 points. ---
Phi = np.array([[1.0, 0.0], [1.0, 1.0], [1.0, 2.0]])   # bias + x, for x in {0,1,2}
yw  = np.array([1.0, 1.0, 3.0])                          # noisy targets
theta = np.linalg.solve(Phi.T @ Phi, Phi.T @ yw)        # normal equations
pred  = Phi @ theta
print("worked example: theta=(%.4f, %.4f)  trainMSE=%.4f" % (
      theta[0], theta[1], np.mean((pred - yw)**2)))
# worked example: theta=(0.6667, 1.0000)  trainMSE=0.2222
# D=2 < n=3 : under-parameterized, cannot interpolate, error is non-zero.


# --- 1. Data: high-dim Gaussian inputs; NOISY train labels, CLEAN test labels. ---
np.random.seed(0)
d, n_train, n_test, noise_std = 20, 60, 4000, 0.5     # interpolation threshold at D = n_train = 60
Xtr = np.random.randn(n_train, d)
Xte = np.random.randn(n_test,  d)
beta = np.random.randn(d) / math.sqrt(d)
def teacher(X): return np.tanh(X @ beta) + 0.3 * (X @ beta)   # fixed nonlinear signal
ytr = teacher(Xtr) + noise_std * np.random.randn(n_train)     # train labels are NOISY
yte = teacher(Xte)                                            # test labels are CLEAN

# --- 2. A fixed bank of random ReLU features; first D columns = a size-D model. ---
Dmax  = 600
Wbank = np.random.randn(Dmax, d) / math.sqrt(d)
def feats(X, D): return np.maximum(X @ Wbank[:D].T, 0.0)      # phi(x) = ReLU(W x)

# --- 3. Sweep model size D. Min-norm least squares via the pseudo-inverse. ---
#     pinv gives ordinary regression when D<n and the MINIMUM-NORM exact fit when D>=n.
Ds = [2,5,10,15,20,30,40,48,54,58,60,62,66,72,84,100,130,180,250,350,500,600]
print("\\n   D   trainMSE     testMSE")
for D in Ds:
    Ptr, Pte = feats(Xtr, D), feats(Xte, D)
    theta = np.linalg.pinv(Ptr) @ ytr
    tr = np.mean((Ptr @ theta - ytr)**2)
    te = np.mean((Pte @ theta - yte)**2)
    mark = "  <-- interpolation threshold D = n" if D == n_train else ""
    print("%4d   %8.4f   %9.4f%s" % (D, tr, te, mark))

#    D   trainMSE     testMSE
#    2     0.9437      0.7990
#   20     0.3883      0.7561   (classical descent)
#   54     0.0897      3.3675   (rising toward the peak)
#   60     0.0000     48.8568   <-- interpolation threshold D = n  (TEST ERROR PEAK)
#   66     0.0000      3.0518   (second descent begins)
#  600     0.0000      0.2183   (over-parameterized: BEST of all)
# Train error -> 0 exactly at D=60=n and stays 0. Test error PEAKS at D=60, then falls
# again to 0.218 -- far below the classical-regime best (~0.72). That is double descent.
# (Our small run, not the paper's reported numbers. Values vary by seed/hardware.)`
  };

  window.CODEVIZ["paper-double-descent"] = {
    question: "As we grow the model size D (number of random features) past the number of training samples n=60, what happens to training error and test error?",
    charts: [
      {
        type: "line",
        title: "Train and test MSE vs model size D — the double-descent curve (peak at D = n = 60)",
        xlabel: "model size D = number of random features  (interpolation threshold at D = n = 60)",
        ylabel: "mean-squared error  (test labels clean; train labels noisy)",
        series: [
          {
            name: "test MSE",
            color: "#ff7b72",
            points: [[2,0.799],[10,0.755],[20,0.756],[30,1.067],[40,0.785],[48,1.329],[54,3.368],[58,24.931],[60,48.857],[62,19.355],[66,3.052],[72,2.0],[84,1.069],[100,0.754],[130,0.574],[180,0.506],[250,0.364],[350,0.265],[500,0.231],[600,0.218]]
          },
          {
            name: "train MSE",
            color: "#7ee787",
            points: [[2,0.944],[10,0.613],[20,0.388],[30,0.242],[40,0.168],[48,0.121],[54,0.09],[58,0.003],[60,0.0],[62,0.0],[66,0.0],[72,0.0],[84,0.0],[100,0.0],[130,0.0],[180,0.0],[250,0.0],[350,0.0],[500,0.0],[600,0.0]]
        }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Random-feature regression: features &phi;(x)=ReLU(Wx) on d=20 Gaussian inputs, n=60 training points with label noise (std 0.5), clean test labels, fit by minimum-norm least squares (pseudo-inverse). Sweeping the feature count D reproduces double descent. Train MSE (green) falls smoothly to 0 exactly at the interpolation threshold D=n=60 and stays there. Test MSE (red) descends in the classical regime, then SPIKES to ~48.9 right at D=60 where the model is forced to interpolate every noisy point, then descends a SECOND time in the over-parameterized regime to ~0.22 at D=600 &mdash; far below the classical-regime best (~0.75). The peak sits exactly at D=n, matching the paper's Hypothesis 1 (&sect;2).",
    code: `import numpy as np, math
np.random.seed(0)

# Random-feature regression -> reproduce DOUBLE DESCENT (peak at D = n).
d, n_train, n_test, noise_std = 20, 60, 4000, 0.5     # threshold at D = n = 60
Xtr = np.random.randn(n_train, d); Xte = np.random.randn(n_test, d)
beta = np.random.randn(d) / math.sqrt(d)
def teacher(X): return np.tanh(X @ beta) + 0.3 * (X @ beta)
ytr = teacher(Xtr) + noise_std * np.random.randn(n_train)   # NOISY train labels
yte = teacher(Xte)                                          # CLEAN test labels

Dmax = 600; Wbank = np.random.randn(Dmax, d) / math.sqrt(d)
def feats(X, D): return np.maximum(X @ Wbank[:D].T, 0.0)    # phi(x) = ReLU(W x)

Ds = [2,5,10,15,20,30,40,48,54,58,60,62,66,72,84,100,130,180,250,350,500,600]
train, test = [], []
for D in Ds:
    Ptr, Pte = feats(Xtr, D), feats(Xte, D)
    theta = np.linalg.pinv(Ptr) @ ytr                       # min-norm least squares
    train.append(round(float(np.mean((Ptr @ theta - ytr)**2)), 4))
    test.append( round(float(np.mean((Pte @ theta - yte)**2)), 4))

print("D    :", Ds)
print("train:", train)
print("test :", test)
print("peak test MSE = %.3f at D = %d  (= n = %d, the interpolation threshold)"
      % (max(test), Ds[test.index(max(test))], n_train))
# train: [0.9437,0.8756,0.6127,0.4781,0.3883,0.2424,0.1678,0.121,0.0897,0.0034,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0]
# test : [0.799,0.7526,0.7554,0.7231,0.7561,1.0672,0.7846,1.3292,3.3675,24.9314,48.8568,19.3551,3.0518,2.0004,1.069,0.754,0.5743,0.506,0.3637,0.2645,0.2307,0.2183]
# peak test MSE = 48.857 at D = 60  (= n = 60, the interpolation threshold)
# Train MSE -> 0 at D=60 and stays 0; test MSE peaks at D=60 then falls again to 0.218.
# Our small run, not the paper's number.`
  };
})();
