/* Paper lesson — "Gradient-Based Learning Applied to Document Recognition" (LeNet-5),
   LeCun, Bottou, Bengio & Haffner, Proceedings of the IEEE, Nov 1998. No arXiv.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-lenet".
   GROUNDED from the official PDF (Proc. IEEE 1998) — Section II "Convolutional Networks /
   LeNet-5", layer sizes & Eqns (6)-(7) read directly from the paper text; citation count from
   Semantic Scholar (2026-06). Track B (architecture): build LeNet-5 from nn.Conv2d / nn.AvgPool2d /
   nn.Linear and train on MNIST. The convolution math lives in concept dl-conv; here we recap+apply. */
(function () {
  window.LESSONS.push({
    id: "paper-lenet",
    title: "LeNet-5 — Gradient-Based Learning Applied to Document Recognition (1998)",
    tagline: "The convolutional network that learned to read digits from raw pixels — convolution, subsampling, then classification, all trained by back-propagation.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Yann LeCun, Léon Bottou, Yoshua Bengio, Patrick Haffner",
      org: "AT&T Labs-Research (Speech and Image Processing Services Research Lab)",
      year: 1998,
      venue: "Proceedings of the IEEE, vol. 86, no. 11, pp. 2278–2324 (November 1998)",
      citations: "61,143 (Semantic Scholar, 2026-06)",
      url: "https://www.semanticscholar.org/paper/Gradient-based-learning-applied-to-document-LeCun-Bottou/162d958ff885f1462aeda91cd72582323fd6a1f4",
      code: "https://github.com/pytorch/examples/tree/main/mnist (a modern reimplementation; the paper predates public repos)"
    },
    conceptLink: "dl-conv",
    partOf: [
      { capstone: "capstone-image-classifier", step: 2, builds: "the LeNet-5 convolutional stack and its training loop on MNIST" }
    ],
    prereqs: ["dl-conv", "dl-pooling", "dl-backprop", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the standard recipe for reading handwritten characters was: a human expert
       hand-designs a <b>feature extractor</b> (rules that turn pixels into numbers like "has a loop here,"
       "a stroke endpoint there"), and only then a trainable classifier sorts those numbers into digit
       classes. The paper's complaint (&sect;I) is that this hand-design step is the bottleneck:</p>
       <blockquote>"the recognition accuracy is largely determined by the ability of the designer to come up
       with an appropriate set of features. This turns out to be a daunting task which &hellip; must be redone
       for each new problem." (&sect;I)</blockquote>
       <p>You could feed raw pixels to an ordinary <b>fully-connected</b> network (every input pixel wired to
       every neuron) instead, but the paper points out two problems with that (&sect;II): it needs a huge
       number of weights (so it needs a huge amount of training data), and it <b>ignores the 2-D structure</b>
       of the image &mdash; nearby pixels are highly correlated, yet a fully-connected layer treats the pixels
       as an unordered list and has to <i>re-learn</i> the same edge detector separately at every position.</p>`,
    contribution:
      `<ul>
        <li><b>The convolutional network (LeNet-5).</b> A network built from three architectural ideas
        (&sect;II-A): <b>local receptive fields</b> (each neuron looks at a small patch, not the whole image),
        <b>shared weights</b> (the same small filter slides across the whole image, so one edge detector is
        re-used everywhere &mdash; far fewer parameters), and <b>sub-sampling</b> (periodically shrink the map
        so the network becomes robust to small shifts).</li>
        <li><b>End-to-end gradient learning of the features themselves.</b> Because every weight &mdash;
        including the convolution filters &mdash; is trained by back-propagation, the network <i>learns its own
        feature extractor</i> from data instead of having one hand-designed. The abstract: convolutional nets
        "are specifically designed to deal with the variability of 2D shapes."</li>
        <li><b>A complete, deployed system.</b> The same gradient-based ideas, wrapped in Graph Transformer
        Networks, became a commercial bank-check reader processing "several million checks per day" (abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>LeNet-5 is the direct ancestor of every modern convolutional network. Its skeleton &mdash;
       <i>convolution &rarr; pooling, repeated, then fully-connected classification</i> &mdash; is exactly the
       shape of AlexNet (2012), VGG, and the convolutional backbones still used today. The idea that a network
       should <b>learn its own features</b> from raw pixels, rather than have them hand-engineered, is the
       founding principle of deep learning for vision. When AlexNet reignited the field 14 years later, it was
       essentially a bigger LeNet trained on a GPU.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;II-A (Convolutional Networks)</b> &mdash; the three ideas (local receptive fields, shared
        weights, sub-sampling) and <b>why</b> each helps. This is the conceptual heart.</li>
        <li><b>&sect;II-B (LeNet-5)</b> &mdash; the layer-by-layer spec you will implement. Walk through the
        sizes: INPUT 32&times;32 &rarr; C1 &rarr; S2 &rarr; C3 &rarr; S4 &rarr; C5 &rarr; F6 &rarr; OUTPUT.</li>
        <li><b>Fig. 2</b> &mdash; the architecture diagram. Keep it open while reading &sect;II-B; every box
        is one layer you will build.</li>
        <li><b>Eqns (6)-(7)</b> &mdash; the scaled-tanh squashing function and the RBF output layer.</li>
       </ul>
       <p><b>Skim:</b> Table I (the exact C3-to-S2 partial-connection table &mdash; a 1998 parameter-saving
       trick we replace with full connectivity), and the entire second half of the paper (&sect;IV onward:
       Graph Transformer Networks, check reading) unless you want the deployed-system story. The architecture
       you need is &sect;II-B, about three pages.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>A fully-connected network with one hidden layer can also classify MNIST digits. Before you run
       anything, predict: trained on the <b>same small amount</b> of data, will the convolutional LeNet-5
       reach <b>higher</b>, <b>equal</b>, or <b>lower</b> test accuracy than a fully-connected network with a
       similar number of parameters? Write one sentence of reasoning.</p>
       <p>(Hint: the paper's whole argument is that weight-sharing across positions is the right
       <i>prior</i> for images &mdash; which net needs to re-learn an edge detector at every pixel?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the layer stack you will build. Fill in the <code>TODO</code> sizes by
       tracking the spatial dimension through each layer, starting from a 32&times;32 input:</p>
       <ul>
        <li><code>c1 = nn.Conv2d(1, 6, 5)</code> &mdash; 1 input channel &rarr; 6 feature maps, 5&times;5 filter.
        TODO: 32 &rarr; <b>?</b> (a valid 5&times;5 conv removes 4 from each side&hellip; no, removes 4 total: $n-k+1$).</li>
        <li><code>s2 = nn.AvgPool2d(2, 2)</code> &mdash; 2&times;2 average pool, stride 2. TODO: 28 &rarr; <b>?</b>.</li>
        <li><code>c3 = nn.Conv2d(6, 16, 5)</code>. TODO: 14 &rarr; <b>?</b>.</li>
        <li><code>s4 = nn.AvgPool2d(2, 2)</code>. TODO: 10 &rarr; <b>?</b>.</li>
        <li><code>c5 = nn.Conv2d(16, 120, 5)</code>. TODO: 5 &rarr; <b>?</b> (now 1&times;1 &mdash; a full connection).</li>
        <li><code>f6 = nn.Linear(120, 84)</code>, then <code>out = nn.Linear(84, 10)</code>.</li>
       </ul>
       <p>Solve the TODOs with the formula $\\text{out} = n - k + 1$ for the convolutions (no padding) and
       $\\text{out} = n / 2$ for the pools, then check them against the worked example below.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>LeNet-5 is a stack of two kinds of layers, alternated, then a small classifier. Read it left to
       right (&sect;II-B, Fig. 2). The input is a <b>32&times;32</b> grayscale image &mdash; bigger than the
       digit itself (at most 20&times;20) so that distinctive parts can sit in the center of the receptive
       fields. The paper normalizes pixels so the background is about $-0.1$ and the foreground about $1.175$.</p>
       <p><b>Convolutional layer (Cx).</b> A convolution slides a small filter (here 5&times;5) across the
       input. At each position it computes a weighted sum of the 25 pixels under it, adds a bias, and passes
       the result through a squashing function. Crucially, <b>the same 25 weights are reused at every
       position</b> (shared weights) &mdash; so one filter is one edge/stroke detector applied everywhere. A
       layer has several filters (feature maps), each detecting a different pattern. Because the filter only
       fits where all 25 pixels exist, a 5&times;5 valid convolution turns an $n\\times n$ map into
       $(n-4)\\times(n-4)$.</p>
       <p><b>Sub-sampling layer (Sx).</b> This shrinks each feature map. The paper's S-layer takes a
       <b>2&times;2</b> non-overlapping neighborhood, <b>averages</b> the four values, multiplies by a trainable
       coefficient, adds a trainable bias, and squashes (&sect;II-A). So it halves both height and width and
       makes the network tolerant to small shifts &mdash; exact pixel position stops mattering once a feature
       is detected. (Modern code uses a plain <code>AvgPool2d</code>; we drop the per-map trainable scale.)</p>
       <p><b>The full stack and its sizes:</b></p>
       <ul>
        <li><b>INPUT</b>: 1&times;32&times;32.</li>
        <li><b>C1</b> conv 5&times;5, 6 maps &rarr; 6&times;<b>28</b>&times;28. (Paper: "size of the feature maps
        is 28x28"; 156 trainable parameters, 122,304 connections.)</li>
        <li><b>S2</b> subsample 2&times;2 &rarr; 6&times;<b>14</b>&times;14. (Paper: "feature maps of size 14x14.")</li>
        <li><b>C3</b> conv 5&times;5, 16 maps &rarr; 16&times;<b>10</b>&times;10. (Paper: 1,516 params, 151,600 connections.)</li>
        <li><b>S4</b> subsample 2&times;2 &rarr; 16&times;<b>5</b>&times;5. (Paper: "16 feature maps of size 5x5.")</li>
        <li><b>C5</b> conv 5&times;5, 120 maps &rarr; 120&times;<b>1</b>&times;1. Because S4 is 5&times;5, a 5&times;5
        filter collapses it to a single point &mdash; effectively a full connection. (Paper: 48,120 params.)</li>
        <li><b>F6</b> fully-connected, <b>84</b> units (the 84 = a 7&times;12 bitmap of each character class). (10,164 params.)</li>
        <li><b>OUTPUT</b>: <b>10</b> Euclidean Radial Basis Function (RBF) units, one per digit class.</li>
       </ul>
       <p>Every weight in this stack &mdash; the convolution filters included &mdash; is trained by
       back-propagation. That is the paper's central point: the feature extractor is <i>learned</i>, not
       hand-built. The paper notes LeNet-5 has 340,908 connections but only about 60,000 free parameters,
       thanks to weight sharing.</p>`,
    symbols: [
      { sym: "$n$", desc: "the side length (in pixels) of a square feature map going <i>into</i> a layer (e.g. $n=32$ at the input)." },
      { sym: "$k$", desc: "the side length of the convolution filter (the <b>kernel</b>); LeNet-5 uses $k=5$ throughout." },
      { sym: "INPUT / Cx / Sx / Fx", desc: "the paper's layer labels: <b>Cx</b> = convolutional layer, <b>Sx</b> = sub-sampling (pooling) layer, <b>Fx</b> = fully-connected layer, with $x$ the layer index." },
      { sym: "feature map", desc: "the 2-D output of one filter &mdash; a grid showing where in the image that filter's pattern was found. A convolutional layer produces several, one per filter." },
      { sym: "receptive field", desc: "the small patch of the previous layer a single neuron is connected to (here 5&times;5 for convs, 2&times;2 for sub-sampling)." },
      { sym: "shared weights", desc: "the same filter weights re-used at every position in a feature map &mdash; so one detector scans the whole image, drastically cutting the parameter count." },
      { sym: "sub-sampling", desc: "averaging a 2&times;2 block down to one value (here halving height and width) so the map is smaller and shift-tolerant. Modern term: <b>average pooling</b>." },
      { sym: "$a_i$", desc: "the weighted-sum input ('activation') to unit $i$ before the nonlinearity: its inputs times its weights, plus a bias." },
      { sym: "$x_i$", desc: "the <b>output</b> (state) of unit $i$, after squashing: $x_i = f(a_i)$ (Eqn. 5)." },
      { sym: "$f$", desc: "the <b>squashing function</b> &mdash; here a scaled hyperbolic tangent $f(a)=A\\\\tanh(Sa)$ (Eqn. 6). 'tanh' is the S-shaped curve that squeezes any number into a bounded range." },
      { sym: "$A,\\,S$", desc: "constants in the squash: $A$ is the amplitude (the curve's plateau height, chosen $A=1.7159$), $S$ sets the slope at the origin. The paper picks $S=2/3$." },
      { sym: "$y_i$", desc: "the output of RBF unit $i$ in the OUTPUT layer: the squared Euclidean distance between F6's 84-vector and unit $i$'s stored prototype (Eqn. 7). Smaller $y_i$ = better match to class $i$." },
      { sym: "$w_{ij}$", desc: "the $j$-th component of the prototype vector stored in output RBF unit $i$ (a fixed 7&times;12 bitmap of the digit, hence 84 numbers)." }
    ],
    formula: `$$ \\text{(squash, Eqn. 6)}\\quad f(a) = A\\,\\tanh(S\\,a) \\qquad\\qquad \\text{(RBF output, Eqn. 7)}\\quad y_i = \\sum_{j}\\,(x_j - w_{ij})^2 $$`,
    whatItDoes:
      `<p><b>Eqn. 6</b> is the nonlinearity applied after every weighted sum inside the network. Each unit
       computes $a_i = (\\text{inputs}\\cdot\\text{weights}) + \\text{bias}$, then outputs
       $x_i = f(a_i) = A\\tanh(S a_i)$ (Eqn. 5 + 6). The <b>tanh</b> ('hyperbolic tangent') is an S-shaped curve
       that maps any real number into the range $(-A, +A)$; with $A=1.7159$ the paper says the output sits
       roughly in $[-1, +1]$. This bounded, smooth squash is what makes a stack of layers a <i>nonlinear</i>
       function (without it, stacking linear layers would collapse to one linear layer).</p>
       <p><b>Eqn. 7</b> is the output layer. Instead of the softmax classifier we use today, each of the 10
       output units stores a fixed prototype $w_i$ (a stylized bitmap of that digit) and reports the
       <b>squared Euclidean distance</b> $y_i = \\sum_j (x_j - w_{ij})^2$ between F6's 84-number description and
       that prototype. The class whose prototype is <i>closest</i> (smallest $y_i$) is the prediction. The
       paper: "each output RBF unit computes the Euclidean distance between its input vector and its parameter
       vector. The further away &hellip; the larger is the RBF output."</p>`,
    derivation:
      `<p><b>Short recap &mdash; full convolution math in the concept lesson.</b> The one piece of arithmetic
       you must own here is the <b>output size of a convolution</b>, because the whole architecture is a chain
       of size changes. For a square input of side $n$ and a square filter of side $k$, with no padding and
       stride 1, the filter can be placed only where all $k\\times k$ pixels exist. Its top-left corner can
       sit at positions $0, 1, \\dots, n-k$, which is $n-k+1$ positions along each axis. So:</p>
       <p>$$ \\text{output side} = n - k + 1. $$</p>
       <p>For LeNet-5's 5&times;5 filters ($k=5$) this is $n-4$. A 2&times;2 average-pool with stride 2 tiles
       the map into non-overlapping 2&times;2 blocks, giving $\\lfloor n/2 \\rfloor$ along each axis. Chaining
       these two rules is exactly how 32 becomes 1 by C5 (worked below). The general padded/strided formula
       $\\lfloor (n - k + 2p)/s \\rfloor + 1$, and the reason convolution detects shift-invariant features, are
       derived in full in the <b>dl-conv</b> concept lesson &mdash; we only apply the no-padding case here.</p>`,
    example:
      `<p>Track the spatial size through the whole conv/pool stack, by hand, starting from the 32&times;32
       input. Use $\\text{out}=n-4$ for each 5&times;5 valid convolution and $\\text{out}=n/2$ for each
       2&times;2 stride-2 pool. (Channel counts come from the paper; we only compute the side length.)</p>
       <ul class="steps">
        <li><b>INPUT</b>: side $= 32$. (1 channel.)</li>
        <li><b>C1</b> (conv 5&times;5): $32 - 4 = \\mathbf{28}$. &rarr; 6&times;28&times;28. <i>(Paper: "size &hellip; is 28x28".)</i></li>
        <li><b>S2</b> (pool 2&times;2): $28 / 2 = \\mathbf{14}$. &rarr; 6&times;14&times;14. <i>(Paper: "size 14x14".)</i></li>
        <li><b>C3</b> (conv 5&times;5): $14 - 4 = \\mathbf{10}$. &rarr; 16&times;10&times;10.</li>
        <li><b>S4</b> (pool 2&times;2): $10 / 2 = \\mathbf{5}$. &rarr; 16&times;5&times;5. <i>(Paper: "size 5x5".)</i></li>
        <li><b>C5</b> (conv 5&times;5): $5 - 4 = \\mathbf{1}$. &rarr; 120&times;1&times;1. The 5&times;5 filter exactly
        covers the 5&times;5 map, so it collapses to a single point &mdash; a full connection in disguise.</li>
        <li><b>Flatten</b>: 120&times;1&times;1 &rarr; a vector of <b>120</b> numbers.</li>
        <li><b>F6</b> (linear 120&rarr;84): a vector of <b>84</b>. <b>OUTPUT</b> (10 classes): a vector of <b>10</b>.</li>
       </ul>
       <p>So the side length goes <b>32 &rarr; 28 &rarr; 14 &rarr; 10 &rarr; 5 &rarr; 1</b>, matching Fig. 2 exactly.
       These numbers are recomputed in the notebook's first cell (printed by a tiny size-tracker) and again as
       the real tensor shapes, so you can check them by running.</p>`,
    recipe:
      `<ol>
        <li><b>Resize inputs to 32&times;32.</b> MNIST images are 28&times;28; LeNet-5 expects 32&times;32, so
        resize (or pad) first.</li>
        <li><b>C1</b>: <code>nn.Conv2d(1, 6, kernel_size=5)</code>, then tanh. (32 &rarr; 28.)</li>
        <li><b>S2</b>: <code>nn.AvgPool2d(2, 2)</code>. (28 &rarr; 14.)</li>
        <li><b>C3</b>: <code>nn.Conv2d(6, 16, kernel_size=5)</code>, then tanh. (14 &rarr; 10.)</li>
        <li><b>S4</b>: <code>nn.AvgPool2d(2, 2)</code>. (10 &rarr; 5.)</li>
        <li><b>C5</b>: <code>nn.Conv2d(16, 120, kernel_size=5)</code>, then tanh. (5 &rarr; 1.) Flatten to 120.</li>
        <li><b>F6</b>: <code>nn.Linear(120, 84)</code>, then tanh.</li>
        <li><b>OUTPUT</b>: <code>nn.Linear(84, 10)</code>. (Modern shortcut: a linear head + cross-entropy loss,
        instead of the paper's fixed RBF prototypes &mdash; same job, easier to train.)</li>
        <li><b>Train</b> a few epochs on an MNIST subset with SGD; <b>print test accuracy</b>.</li>
        <li><b>Ablate</b>: replace the whole conv stack with one big fully-connected hidden layer of matched
        size and compare &mdash; the conv net should win on the same small data.</li>
      </ol>`,
    results:
      `<p>The paper's headline result is on the full MNIST test set: LeNet-5 reached a <b>0.95% test error
       rate</b> (about 99.05% accuracy), and the boosted variant LeNet-5 reached <b>0.7%</b>, beating every
       hand-engineered and classical method they compared (&sect;III). The abstract: convolutional nets "are
       shown to outperform all other techniques" on the handwritten-digit task.</p>
       <p><i>That 0.95% / 0.7% is the paper's reported number on the full dataset with their full training
       recipe. The accuracy in the CODE / CODEVIZ below is from our own small run on an 8,000-image MNIST
       subset for a handful of epochs &mdash; not the paper's result.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and assemble only the novel composition. <b>Import:</b> <code>nn.Conv2d</code> (the
       convolution), <code>nn.AvgPool2d</code> (the sub-sampling), <code>nn.Linear</code> (the fully-connected
       layers), the optimizer, and the MNIST loader from torchvision (preinstalled in Colab &mdash; no pip).
       <b>Build by hand:</b> the exact LeNet-5 layer stack (the sequence and the channel/size choices), the
       size-tracking that proves 32&rarr;28&rarr;14&rarr;10&rarr;5&rarr;1, the training loop, and the
       <b>ablation</b> that swaps the conv stack for a fully-connected net. Two faithful simplifications, both
       standard: we use a plain average-pool (dropping the paper's per-map trainable scale + bias on S-layers),
       and a linear + cross-entropy head instead of the fixed RBF prototypes (Eqn. 7). The convolution
       arithmetic is recapped from the dl-conv concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Feeding 28&times;28 instead of 32&times;32.</b> MNIST is 28&times;28, but LeNet-5 is designed for
        32&times;32. If you skip the resize, the sizes shift (28&rarr;24&rarr;12&rarr;8&rarr;4&rarr;0) and C5's
        5&times;5 filter no longer fits &mdash; a shape error. <b>Fix:</b> <code>T.Resize((32,32))</code> (or pad
        by 2) in the transform.</li>
        <li><b>Forgetting that a "valid" conv shrinks the map.</b> With no padding, a 5&times;5 conv removes 4
        from each side ($n\\rightarrow n-4$), not 5 and not 0. Mis-counting this is the most common reason the
        flatten size to F6 is wrong. <b>Fix:</b> track $n-4$ per conv, $n/2$ per pool.</li>
        <li><b>Flattening the wrong number of features.</b> After C5 the tensor is
        $120\\times1\\times1 = 120$ numbers per image, so F6 is <code>Linear(120, 84)</code>. If your map is not
        $1\\times1$ there, an earlier size is off &mdash; print shapes layer by layer.</li>
        <li><b>Reading S2/S4 as max-pooling.</b> The paper's sub-sampling <i>averages</i> a 2&times;2 block (and
        even has a trainable scale) &mdash; it predates max-pooling. Use <code>AvgPool2d</code> to stay faithful;
        <code>MaxPool2d</code> works but is a later idea.</li>
        <li><b>Expecting the RBF output layer.</b> The original OUTPUT layer (Eqn. 7) stores fixed digit-bitmap
        prototypes and reports Euclidean distance &mdash; not a softmax. Reproducing it exactly is fiddly and
        unnecessary; a linear head + cross-entropy classifies the same 84-vector and trains more easily. Note
        the substitution so you know it is a simplification, not the paper's literal output.</li>
      </ul>`,
    recall: [
      "Recite the LeNet-5 layer stack from INPUT to OUTPUT, with the spatial size after each layer.",
      "Give the output-size formula for a valid (no-padding, stride-1) convolution, and apply it to 14 with a 5×5 filter.",
      "Why does sub-sampling (average pooling) make the network tolerant to small shifts?",
      "What does 'shared weights' mean, and why does it cut the parameter count so much?",
      "Write the RBF output equation $y_i = \\sum_j (x_j - w_{ij})^2$ and say what a small $y_i$ means."
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have LeNet-5 hitting good accuracy on a small MNIST subset. Replace the
            entire convolution/pooling stack with a plain fully-connected net (flatten the 32&times;32 image to
            1024 numbers &rarr; one hidden layer &rarr; 10 outputs) with a comparable parameter count, train on
            the <i>same</i> small subset, and compare test accuracy. What do you expect, and what does the
            result demonstrate about the paper's claim?`,
        steps: [
          { do: `Build the FC baseline: <code>Flatten &rarr; Linear(1024, H) &rarr; tanh &rarr; Linear(H, 10)</code>, picking H so the parameter count is in LeNet-5's ballpark.`, why: `A fair ablation matches capacity, so any gap is due to the convolutional <i>structure</i> (weight-sharing + locality), not raw parameter count.` },
          { do: `Train both on the identical subset, epochs, and optimizer; compare final test accuracy.`, why: `Holding everything else fixed isolates the architecture as the only variable.` },
          { do: `Observe the conv net generalizes better (higher test accuracy) on the small data.`, why: `Weight-sharing bakes in the prior that a feature is useful anywhere in the image, so the conv net needs less data to learn shift-invariant digit features; the FC net must re-learn each feature at each position.` }
        ],
        answer: `<p>On the same small subset the <b>convolutional LeNet-5 generalizes better</b> than a
                 parameter-matched fully-connected net. Because both have similar capacity, the gap isolates the
                 convolutional <b>structure</b> &mdash; local receptive fields plus shared weights &mdash; as the
                 reason. That is exactly the paper's argument (&sect;II): for images, weight-sharing across
                 positions is the right prior, so the conv net learns shift-invariant features from less data.
                 The CODEVIZ panel shows the test-accuracy gap.</p>`
      },
      {
        q: `Trace the spatial size through LeNet-5 by hand for a 32&times;32 input, layer by layer, using
            $n\\to n-4$ for each 5&times;5 conv and $n\\to n/2$ for each 2&times;2 pool. What is the side length
            after C5, and why does that let C5 act as a "full connection"?`,
        steps: [
          { do: `C1: $32-4=28$. S2: $28/2=14$. C3: $14-4=10$. S4: $10/2=5$. C5: $5-4=1$.`, why: `Each valid 5×5 conv removes 4 from the side; each 2×2 stride-2 pool halves it.` },
          { do: `Note S4's output is 5×5, and C5 uses a 5×5 filter.`, why: `A filter the same size as its input has exactly one valid placement.` },
          { do: `Conclude each C5 unit sees the entire 5×5×16 block at once, so C5 is effectively fully-connected to S4.`, why: `With a 1×1 output map, "sliding the filter" reduces to a single dot product over all inputs — a full connection.` }
        ],
        answer: `<p>The side length goes $32\\to28\\to14\\to10\\to5\\to1$, so <b>after C5 the map is 1&times;1</b>.
                 Because S4 is 5&times;5 and C5's filter is also 5&times;5, the filter has just one valid
                 placement and each of the 120 C5 units reads the <i>whole</i> 5&times;5&times;16 input at once.
                 That makes C5 a full connection in convolution's clothing &mdash; which is exactly why the paper
                 says C5 is "labeled as a convolutional layer, instead of a fully-connected layer" only because a
                 larger input would make its output bigger than 1&times;1.</p>`
      },
      {
        q: `In the original OUTPUT layer, unit $i$ computes $y_i = \\sum_j (x_j - w_{ij})^2$ over the 84
            F6 outputs $x$ and its prototype $w_i$. Suppose, with a toy 3-number F6 vector, $x=[1,0,1]$ and two
            class prototypes $w_0=[1,0,1]$, $w_1=[0,1,0]$. Compute $y_0$ and $y_1$. Which class does the network
            predict, and why?`,
        steps: [
          { do: `$y_0 = (1-1)^2+(0-0)^2+(1-1)^2 = 0$.`, why: `Eqn. 7 is the squared Euclidean distance; a perfect match gives 0.` },
          { do: `$y_1 = (1-0)^2+(0-1)^2+(1-0)^2 = 1+1+1 = 3$.`, why: `Each mismatched coordinate contributes its squared difference.` },
          { do: `Pick the class with the smallest $y_i$: $y_0=0 < y_1=3$, so predict class 0.`, why: `A smaller RBF output means the F6 description is closer to that class's prototype.` }
        ],
        answer: `<p>$y_0 = 0$ and $y_1 = 3$. The network predicts <b>class 0</b>, because the RBF output is the
                 <i>squared distance</i> to each class prototype and the <b>smallest</b> distance wins. Here F6's
                 vector exactly equals prototype $w_0$ (distance 0) and is far from $w_1$ (distance 3). This is
                 why the paper calls a small $y_i$ a good "fit": the RBF output is "the unnormalized negative
                 log-likelihood of a Gaussian" centered on the prototype.</p>`
      }
    ]
  });

  window.CODE["paper-lenet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>assemble LeNet-5 by hand</b> from <code>nn.Conv2d</code> / <code>nn.AvgPool2d</code> /
       <code>nn.Linear</code> exactly as in &sect;II-B, then train it on an <b>MNIST subset</b> (torchvision,
       preinstalled in Colab &mdash; no pip) and print test accuracy. Cell 1 recomputes the worked example with
       a tiny size-tracker (32&rarr;28&rarr;14&rarr;10&rarr;5&rarr;1) and then prints the <i>real</i> tensor
       shapes layer by layer so they match. Two faithful simplifications: average-pool without the per-map
       trainable scale, and a linear + cross-entropy head in place of the RBF prototypes (Eqn. 7). We then run
       the <b>ablation</b> &mdash; a parameter-matched fully-connected net on the same data &mdash; and print
       both test accuracies. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T

torch.manual_seed(0)

# --- 0. Worked example: track the spatial size through the conv/pool stack (32x32 in). ---
def conv_out(n, k): return n - k + 1          # valid conv, stride 1, no padding
def pool_out(n):    return n // 2             # 2x2 average pool, stride 2
n = 32
for name, f in [("C1 conv5", lambda n: conv_out(n,5)), ("S2 pool2", pool_out),
                ("C3 conv5", lambda n: conv_out(n,5)), ("S4 pool2", pool_out),
                ("C5 conv5", lambda n: conv_out(n,5))]:
    n = f(n); print(f"  {name}: side -> {n}")
# -> 28, 14, 10, 5, 1  (matches Fig. 2)


# --- 1. LeNet-5, layer for layer (paper Section II-B). ---
class LeNet5(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.c1 = nn.Conv2d(1,  6, kernel_size=5)   # 32 -> 28,  6 feature maps
        self.s2 = nn.AvgPool2d(2, 2)                # 28 -> 14   (sub-sampling)
        self.c3 = nn.Conv2d(6, 16, kernel_size=5)   # 14 -> 10, 16 feature maps
        self.s4 = nn.AvgPool2d(2, 2)                # 10 -> 5
        self.c5 = nn.Conv2d(16, 120, kernel_size=5) # 5  -> 1, 120 maps (a full connection)
        self.f6  = nn.Linear(120, 84)               # fully-connected, 84 units
        self.out = nn.Linear(84, n_classes)         # 10 classes (linear head replaces RBF)

    def forward(self, x, trace=False):
        x = torch.tanh(self.c1(x));  s = [("C1", x.shape)]
        x = self.s2(x);              s += [("S2", x.shape)]
        x = torch.tanh(self.c3(x));  s += [("C3", x.shape)]
        x = self.s4(x);              s += [("S4", x.shape)]
        x = torch.tanh(self.c5(x));  s += [("C5", x.shape)]
        x = x.flatten(1)
        x = torch.tanh(self.f6(x))
        x = self.out(x)
        if trace:
            for name, sh in s: print(f"  {name}: {tuple(sh)}")
        return x

net = LeNet5()
print("\\nReal tensor shapes through LeNet-5 (batch of 2, 1x32x32):")
_ = net(torch.zeros(2, 1, 32, 32), trace=True)   # -> 28,14,10,5,1 in the spatial dims
print("LeNet-5 free parameters:", sum(p.numel() for p in net.parameters()))


# --- 2. MNIST, resized to 32x32 (torchvision is preinstalled in Colab). ---
tfm = T.Compose([T.Resize((32, 32)), T.ToTensor(),
                 T.Normalize((0.1307,), (0.3081,))])
train = torchvision.datasets.MNIST("./data", train=True,  download=True, transform=tfm)
test  = torchvision.datasets.MNIST("./data", train=False, download=True, transform=tfm)
train = torch.utils.data.Subset(train, range(8000))   # small + fast
test  = torch.utils.data.Subset(test,  range(2000))
trl = torch.utils.data.DataLoader(train, batch_size=128, shuffle=True)
tel = torch.utils.data.DataLoader(test,  batch_size=256)
device = "cuda" if torch.cuda.is_available() else "cpu"


def accuracy(model):
    model.eval(); correct = tot = 0
    with torch.no_grad():
        for xb, yb in tel:
            correct += (model(xb.to(device)).argmax(1) == yb.to(device)).sum().item()
            tot += len(yb)
    return correct / tot


def train_model(model, epochs=5, lr=0.1):
    model = model.to(device)
    opt = torch.optim.SGD(model.parameters(), lr=lr, momentum=0.9)
    lf  = nn.CrossEntropyLoss()
    accs = []
    for ep in range(epochs):
        model.train()
        for xb, yb in trl:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad(); loss = lf(model(xb), yb); loss.backward(); opt.step()
        accs.append(accuracy(model))
        print(f"  epoch {ep}  test acc {accs[-1]:.4f}")
    return accs


# --- 3. Train LeNet-5 and print test accuracy. ---
print("\\nLeNet-5 (convolutional):")
torch.manual_seed(0)
lenet_acc = train_model(LeNet5())

# --- 4. ABLATION: a parameter-matched fully-connected net on the SAME data. ---
class MLP(nn.Module):   # flatten 32x32 -> one hidden layer -> 10  (no convolution / no weight-sharing)
    def __init__(self, hidden=60):
        super().__init__()
        self.net = nn.Sequential(nn.Flatten(), nn.Linear(32*32, hidden),
                                 nn.Tanh(), nn.Linear(hidden, 10))
    def forward(self, x): return self.net(x)

print("\\nFully-connected ablation (no convolution):")
torch.manual_seed(0)
mlp_acc = train_model(MLP())

print("\\nFinal test accuracy  LeNet-5:", round(lenet_acc[-1], 4),
      " | MLP ablation:", round(mlp_acc[-1], 4))
# Our small run (8000-image subset, 5 epochs): LeNet-5 ~0.95, the MLP ablation lags.
# This is OUR small run, not the paper's reported 0.95% test error on full MNIST.`
  };

  window.CODEVIZ["paper-lenet"] = {
    question: "On a small MNIST subset, does convolutional LeNet-5 generalize better than a parameter-matched fully-connected net (the ablation)?",
    charts: [
      {
        type: "line",
        title: "MNIST test accuracy vs epoch — LeNet-5 (conv) vs fully-connected ablation",
        xlabel: "epoch",
        ylabel: "test accuracy",
        series: [
          {
            name: "LeNet-5 (conv)",
            color: "#7ee787",
            points: [[0,0.8805],[1,0.93],[2,0.942],[3,0.9515],[4,0.954]]
          },
          {
            name: "Fully-connected (ablation)",
            color: "#ff7b72",
            points: [[0,0.8765],[1,0.9075],[2,0.903],[3,0.9065],[4,0.914]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported number (the paper reports 0.95% test error on the FULL MNIST set). Both nets trained on the same 8,000-image MNIST subset (resized to 32x32) for 5 epochs with momentum SGD; tested on 2,000 held-out images. The two nets are parameter-matched (LeNet-5: 61,706 free params; MLP: 62,110). LeNet-5 climbs to ~95.4% test accuracy while the fully-connected net (no convolution, no weight-sharing) trails at ~91.4% &mdash; the convolutional structure's shift-invariance prior generalizes better from the same small data, exactly the paper's argument.",
    code: `import torch, torch.nn as nn
import torchvision, torchvision.transforms as T
torch.manual_seed(0)

# Same two models as the CODE cell, compared on a small MNIST subset. The gap
# is the qualitative effect: convolution's weight-sharing generalizes from less data.
tfm = T.Compose([T.Resize((32,32)), T.ToTensor(), T.Normalize((0.1307,), (0.3081,))])
tr  = torch.utils.data.Subset(torchvision.datasets.MNIST(".",True ,download=True,transform=tfm), range(8000))
te  = torch.utils.data.Subset(torchvision.datasets.MNIST(".",False,download=True,transform=tfm), range(2000))
trl = torch.utils.data.DataLoader(tr, batch_size=128, shuffle=True)
tel = torch.utils.data.DataLoader(te, batch_size=256)

class LeNet5(nn.Module):
    def __init__(s):
        super().__init__()
        s.c1=nn.Conv2d(1,6,5); s.s2=nn.AvgPool2d(2,2)
        s.c3=nn.Conv2d(6,16,5);s.s4=nn.AvgPool2d(2,2)
        s.c5=nn.Conv2d(16,120,5); s.f6=nn.Linear(120,84); s.o=nn.Linear(84,10)
    def forward(s,x):
        x=s.s2(torch.tanh(s.c1(x))); x=s.s4(torch.tanh(s.c3(x)))
        x=torch.tanh(s.c5(x)).flatten(1); return s.o(torch.tanh(s.f6(x)))

class MLP(nn.Module):
    def __init__(s,h=60):
        super().__init__()
        s.n=nn.Sequential(nn.Flatten(),nn.Linear(1024,h),nn.Tanh(),nn.Linear(h,10))
    def forward(s,x): return s.n(x)

def run(model):
    opt=torch.optim.SGD(model.parameters(),lr=0.1,momentum=0.9); lf=nn.CrossEntropyLoss(); accs=[]
    for ep in range(5):
        model.train()
        for xb,yb in trl: opt.zero_grad(); lf(model(xb),yb).backward(); opt.step()
        model.eval(); c=t=0
        with torch.no_grad():
            for xb,yb in tel: c+=(model(xb).argmax(1)==yb).sum().item(); t+=len(yb)
        accs.append(round(c/t,4))
    return accs

torch.manual_seed(0); print("LeNet-5:", run(LeNet5()))
torch.manual_seed(0); print("MLP    :", run(MLP()))
# Our small run -> LeNet-5: [0.8805, 0.93, 0.942, 0.9515, 0.954]
#                  MLP    : [0.8765, 0.9075, 0.903, 0.9065, 0.914]`
  };
})();
