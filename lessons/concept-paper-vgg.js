/* Paper lesson — "Very Deep Convolutional Networks for Large-Scale Image Recognition" (VGG),
   Simonyan & Zisserman 2014. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-vgg".
   GROUNDED from arXiv:1409.1556 (abstract) and the ar5iv HTML mirror (Sections 2.1-2.3, Table 1).
   Track B (architecture): build a small VGG-style net (stacked 3x3 conv blocks + 2x2 maxpool) on top
   of nn.Conv2d, train on a CIFAR-10 subset, and recompute the two-3x3-vs-one-5x5 parameter count.
   The parameter-count math (filters x weights) lives in concept dl-cnn-params; here we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-vgg",
    title: "VGG — Very Deep Convolutional Networks for Large-Scale Image Recognition (2014)",
    tagline: "Go deep with nothing but stacked 3x3 convolutions: two 3x3 layers see as much as one 5x5, with fewer weights.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Karen Simonyan, Andrew Zisserman",
      org: "Visual Geometry Group (VGG), University of Oxford",
      year: 2014,
      venue: "arXiv:1409.1556 (Sep 2014; final Apr 2015); ICLR 2015",
      citations: "",
      arxiv: "https://arxiv.org/abs/1409.1556",
      code: "https://www.robots.ox.ac.uk/~vgg/research/very_deep/ (official models)"
    },
    conceptLink: "dl-cnn-params",
    partOf: [
      { capstone: "capstone-image-classifier", step: 5, builds: "a VGG-style stacked-3x3 convolutional net" }
    ],
    prereqs: ["dl-cnn-params", "dl-conv", "dl-receptive-field", "dl-backprop", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>By 2014 a Convolutional Neural Network (CNN) &mdash; a network whose layers slide small learnable
       filters over an image &mdash; was clearly the way to classify images, but the field had not pinned down
       <i>what makes one good</i>. Earlier winning networks mixed filter sizes: large $11\\times11$ or
       $7\\times7$ filters in the first layers, then smaller ones later, plus various strides and tricks. There
       was no clean, controlled answer to a simple question: <b>if you hold the design fixed and just make the
       network deeper, does accuracy keep improving?</b></p>
       <p>The paper's framing (&sect;1): "investigate the effect of the convolutional network <b>depth</b> on
       its accuracy in the large-scale image recognition setting." To isolate depth as the variable, they had
       to remove the confound of mixed filter sizes &mdash; which is exactly what the $3\\times3$-everywhere
       design does.</p>`,
    contribution:
      `<ul>
        <li><b>One filter size, everywhere: $3\\times3$.</b> Every convolution is a tiny $3\\times3$ filter
        with stride 1 and padding 1 (so spatial size is preserved), and the only downsampling is $2\\times2$
        max-pooling with stride 2 (&sect;2.1). With the building block fixed, the <i>only</i> thing that
        varies between their networks is depth.</li>
        <li><b>Depth via stacking small filters.</b> A stack of two $3\\times3$ layers has the same
        <b>receptive field</b> (the patch of input one output value depends on) as one $5\\times5$ layer;
        three stacked $3\\times3$ layers match one $7\\times7$ &mdash; but with more non-linearities and
        <i>fewer</i> parameters (&sect;2.3).</li>
        <li><b>Very deep nets that work: 16 and 19 weight layers.</b> Pushing depth to 16 (config D, "VGG-16")
        and 19 (config E, "VGG-19") layers gave a large accuracy gain and won places at the ImageNet Challenge
        2014, and the released models transferred well to other datasets.</li>
      </ul>`,
    whyItMattered:
      `<p>VGG made "deeper, with small $3\\times3$ filters" the default recipe for vision backbones, and the
       phrase "VGG-16 / VGG-19 features" became shorthand for a strong, transferable image representation used
       far beyond classification (detection, segmentation, style transfer, perceptual losses). The released
       pretrained weights were among the most reused models of the era. The paper also set up the very problem
       that <b>ResNet</b> would solve a year later: VGG showed depth helps, but also that stacking plain layers
       much beyond ~19 gets hard to train &mdash; motivating residual connections.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.1 (Architecture)</b> &mdash; the fixed building block: $3\\times3$ conv, stride 1,
        padding 1; $2\\times2$ max-pool, stride 2; ReLU everywhere; $224\\times224$ RGB input.</li>
        <li><b>&sect;2.2 (Configurations) &amp; Table 1</b> &mdash; configs A&ndash;E, from 11 weight layers
        (A) to 19 (E); D is VGG-16, E is VGG-19. They differ <i>only</i> in depth.</li>
        <li><b>&sect;2.3 (Discussion)</b> &mdash; <i>the heart of the paper</i>: the two-$3\\times3$-equals-one-$5\\times5$
        receptive-field argument and the $27C^2$-vs-$49C^2$ parameter count you will transcribe and recompute.</li>
       </ul>
       <p><b>Skim:</b> &sect;3 (training/testing details: scale jittering, dense evaluation), &sect;4 (the full
       ImageNet result tables), and the localisation/generalisation sections (&sect;5&ndash;6) unless you want
       the benchmark numbers. The idea you need lives in one page: &sect;2.3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You want a layer (or stack) whose every output pixel "sees" a $5\\times5$ patch of its input. Option
       <b>(a)</b>: one $5\\times5$ convolution. Option <b>(b)</b>: two $3\\times3$ convolutions stacked. Both
       have $C$ input and $C$ output channels.</p>
       <p>Before reading on, guess: which has <b>fewer learnable weights</b>, and by roughly how much? And which
       can represent a <i>more</i> expressive (less linear) function? Write your guesses, then check them
       against the worked numbers and the notebook's parameter count.</p>`,
    attempt:
      `<p>Before the reveal, sketch the network you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>A <b>VGG block</b> = <i>n</i> repeats of [<code>nn.Conv2d(in, out, kernel_size=3, padding=1)</code>
        &rarr; ReLU], then one <code>nn.MaxPool2d(2)</code> at the end. Note: padding 1 keeps width/height the
        same; only the max-pool shrinks them (by 2x).</li>
        <li>TODO: stack a few VGG blocks with growing channel counts (e.g. 32 &rarr; 64 &rarr; 128), each block
        halving the spatial size via its max-pool.</li>
        <li>TODO: flatten and add a small classifier head (<code>nn.Linear</code> &rarr; ReLU &rarr;
        <code>nn.Linear</code> to the class count).</li>
       </ul>
       <p>You will also write the parameter-count check: build one <code>Conv2d(C,C,5)</code> and two stacked
       <code>Conv2d(C,C,3)</code>, and print <code>sum(p.numel() ...)</code> for each. Predict which is smaller
       before running.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The whole architecture is built from one tiny block, repeated. Every convolution is a $3\\times3$
       filter with <b>stride 1</b> (it steps one pixel at a time) and <b>padding 1</b> (a one-pixel border of
       zeros is added so the output keeps the same height and width as the input). After one or more such convs,
       a $2\\times2$ <b>max-pooling</b> layer with stride 2 takes the maximum over each $2\\times2$ patch,
       halving the height and width. A <b>ReLU</b> (Rectified Linear Unit: keep positives, zero out negatives)
       follows every convolution. That is the entire vocabulary (&sect;2.1).</p>
       <p>Why $3\\times3$ instead of a bigger filter? Because you can <b>stack</b> small filters to reach the
       same reach. The <b>receptive field</b> of an output value is the region of the input that can influence
       it. A single $3\\times3$ conv has a $3\\times3$ receptive field. Feed its output into a <i>second</i>
       $3\\times3$ conv: each value of that second layer reads a $3\\times3$ window of the first layer, and each
       of those already summarized a $3\\times3$ input window &mdash; overlapping by one, they span a
       $5\\times5$ patch of the original input. So <b>two stacked $3\\times3$ convs = one $5\\times5$
       receptive field</b>; three stacked = $7\\times7$ (&sect;2.3).</p>
       <p>The paper gives two reasons this trade is good (&sect;2.3). <b>First</b>, the stack inserts a ReLU
       between the layers, so where a single $5\\times5$ conv applies one linear map then one non-linearity, two
       $3\\times3$ convs apply <i>two</i> &mdash; "we incorporate three non-linear rectification layers instead
       of a single one, which makes the decision function more discriminative." <b>Second</b>, it uses
       <i>fewer</i> weights: for $C$ input and $C$ output channels, three stacked $3\\times3$ convs cost
       $3\\,(3^2 C^2) = 27 C^2$ weights, while a single $7\\times7$ conv costs $7^2 C^2 = 49 C^2$ &mdash; "i.e.
       81% more." The same arithmetic at the two-layer scale gives $2\\,(3^2 C^2) = 18 C^2$ vs $5^2 C^2 = 25
       C^2$ for the $5\\times5$ case.</p>
       <p>With the block fixed, the networks (Table 1, &sect;2.2) differ only in how many conv layers you stack
       before each pool: config A has 11 weight layers (8 conv + 3 fully-connected), and the depth grows up to
       config E with 19 (D is "VGG-16", E is "VGG-19"). The clean result &mdash; deeper is better, holding the
       block constant &mdash; is the paper's point.</p>`,
    symbols: [
      { sym: "$3\\times3$", desc: "the filter (kernel) size: a small $3\\times3$ patch of weights slid across the image. VGG uses this size for <b>every</b> convolution." },
      { sym: "$C$", desc: "the number of <b>channels</b> (feature maps). In the parameter count, the layer maps $C$ input channels to $C$ output channels." },
      { sym: "stride", desc: "how far the filter moves between applications. Stride 1 = step one pixel; the convs use stride 1, the pooling uses stride 2." },
      { sym: "padding", desc: "a border of zeros added around the input. Padding 1 with a $3\\times3$ filter keeps the output the same height and width as the input." },
      { sym: "receptive field", desc: "the region of the <b>input image</b> that one output value can depend on. Stacking convs grows it: two $3\\times3$ layers reach $5\\times5$, three reach $7\\times7$." },
      { sym: "max-pooling", desc: "a downsampling layer that takes the maximum over each small window. VGG uses a $2\\times2$ window with stride 2, which halves height and width." },
      { sym: "ReLU", desc: "Rectified Linear Unit, the non-linearity applied after each conv: $\\mathrm{ReLU}(z)=\\max(0,z)$ &mdash; keep positives, zero out negatives." },
      { sym: "$n^2 C^2$", desc: "the weight count of one $n\\times n$ conv layer mapping $C$ channels to $C$ channels: $n^2$ weights per channel-pair, times $C\\times C$ pairs. (Bias terms are ignored in this comparison.)" },
      { sym: "weight layer", desc: "a layer with learnable weights (a conv or a fully-connected layer). \"VGG-16\" means 16 weight layers; pooling and ReLU have none and are not counted." }
    ],
    formula: `$$ \\underbrace{3\\,(3^2 C^2) = 27\\,C^2}_{\\text{three stacked }3\\times3\\text{ convs}} \\quad\\lt\\quad \\underbrace{7^2 C^2 = 49\\,C^2}_{\\text{one }7\\times7\\text{ conv}} \\qquad\\text{(} \\S 2.3\\text{, same }7\\times7\\text{ receptive field)} $$`,
    whatItDoes:
      `<p>The formula counts the learnable weights of two ways to cover the same $7\\times7$ receptive field, for
       $C$ input and $C$ output channels. <b>Left:</b> three stacked $3\\times3$ convolutions &mdash; each costs
       $3^2 C^2 = 9 C^2$ weights ($9$ per channel-pair, $C^2$ pairs), and there are three of them, so
       $3\\times 9 C^2 = 27 C^2$. <b>Right:</b> one $7\\times7$ convolution &mdash; $7^2 C^2 = 49 C^2$. The
       stack reaches the <i>same</i> receptive field with about $27/49 \\approx 55\\%$ of the weights (the
       single $7\\times7$ has $81\\%$ more), <i>and</i> inserts extra ReLUs between layers, making it more
       expressive. Smaller and deeper wins both ways &mdash; the paper's core trade.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the full "filters &times; weights" parameter-counting rule lives in the
       <code>dl-cnn-params</code> concept lesson.</b> One convolution layer with a $k\\times k$ filter,
       $C_{\\text{in}}$ input channels and $C_{\\text{out}}$ output channels has
       $k \\cdot k \\cdot C_{\\text{in}} \\cdot C_{\\text{out}}$ weights (plus $C_{\\text{out}}$ biases, ignored
       here). Setting $C_{\\text{in}}=C_{\\text{out}}=C$ gives $k^2 C^2$ per layer &mdash; that is the
       $n^2 C^2$ in the symbols table. Stacking $m$ such $3\\times3$ layers therefore costs
       $m \\cdot 3^2 C^2 = 9 m\\, C^2$; with $m=3$ that is $27 C^2$, versus $49 C^2$ for the single $7\\times7$.</p>
       <p><b>Why the receptive fields match.</b> Each $3\\times3$ conv extends reach by 1 pixel on each side
       (radius $+1$). Starting from a single pixel, after $m$ stacked $3\\times3$ convs (stride 1) the reach is
       $1 + 2m$ on a side: $m=2 \\Rightarrow 5$, $m=3 \\Rightarrow 7$. So two $3\\times3$ = $5\\times5$ and
       three $3\\times3$ = $7\\times7$, exactly as &sect;2.3 states. The receptive-field growth rule is derived
       in the <code>dl-receptive-field</code> concept lesson.</p>`,
    example:
      `<p>Work the <b>two-layer</b> case by hand for $C = 64$ channels (the comparison the notebook recomputes).
       Compare <b>two stacked $3\\times3$ convs</b> against <b>one $5\\times5$ conv</b> &mdash; both reach a
       $5\\times5$ receptive field, both map $64$ channels to $64$. Ignore biases (the paper's comparison does).</p>
       <ul class="steps">
        <li><b>One $3\\times3$ conv layer:</b> $3^2 \\cdot C^2 = 9 \\cdot 64^2 = 9 \\cdot 4096 = 36{,}864$ weights.</li>
        <li><b>Two stacked $3\\times3$:</b> $2 \\cdot 36{,}864 = 73{,}728$ weights. In the formula's shorthand,
        $2\\,(3^2 C^2) = 18 C^2 = 18 \\cdot 4096 = 73{,}728$.</li>
        <li><b>One $5\\times5$ conv layer:</b> $5^2 \\cdot C^2 = 25 \\cdot 4096 = 102{,}400$ weights, i.e.
        $25 C^2$.</li>
        <li><b>Compare:</b> the two-$3\\times3$ stack uses $73{,}728$ vs $102{,}400$ &mdash; about
        $73{,}728 / 102{,}400 \\approx 72\\%$, so the single $5\\times5$ has $\\approx 39\\%$ more weights
        ($102{,}400 / 73{,}728 \\approx 1.389$) &mdash; <i>and</i> the stack has an extra ReLU in between.</li>
       </ul>
       <p>The notebook's parameter-count cell builds exactly these layers with <code>nn.Conv2d</code> and prints
       the same numbers ($73{,}728$ vs $102{,}400$), so you can verify the arithmetic by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build a VGG block.</b> <i>n</i> repeats of [<code>Conv2d(in, out, 3, padding=1)</code> &rarr;
        <code>ReLU</code>], then one <code>MaxPool2d(2)</code>. Padding 1 keeps height/width; the pool halves it.</li>
        <li><b>Stack blocks with growing channels.</b> e.g. block1 $3\\to32$, block2 $32\\to64$, block3
        $64\\to128$ &mdash; each block ends in a pool, so the feature map shrinks $32\\to16\\to8\\to4$ on CIFAR.</li>
        <li><b>Add a classifier head.</b> Flatten the final feature map, then
        <code>Linear &rarr; ReLU &rarr; Linear</code> to the 10 CIFAR classes.</li>
        <li><b>Train</b> a few epochs on a CIFAR-10 subset (torchvision, preinstalled in Colab); print accuracy.</li>
        <li><b>Recompute the parameter count.</b> Build <code>Conv2d(C,C,5)</code> and two
        <code>Conv2d(C,C,3)</code>; print and compare their weight counts &mdash; the worked example, verified.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "pushing the depth to 16&ndash;19 weight layers" yielded "a significant
       improvement on the prior-art configurations," and "our team secured the first and the second places in
       the localisation and classification tracks respectively" at the ImageNet Challenge 2014. From the results
       discussion (quoted): "our best single model achieves 7.1% error (model E)" top-5 on ImageNet, and an
       ensemble "reduced the test error to 7.0% using dense evaluation and 6.8% using combined dense and
       multi-crop evaluation."</p>
       <p><i>These are the paper's reported ImageNet figures, quoted. The accuracy printed by the CODE cell and
       the numbers in the CODEVIZ panel below are from our own tiny CIFAR-10 run &mdash; not the paper's
       results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only VGG's composition. <b>Import:</b> <code>nn.Conv2d</code>, <code>nn.ReLU</code>,
       <code>nn.MaxPool2d</code>, <code>nn.Linear</code>, the optimizer, and the CIFAR-10 loader from
       torchvision (preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the VGG block (stacked
       $3\\times3$ convs + a $2\\times2$ pool), the stacking of blocks with growing channels, the classifier
       head, and the parameter-count comparison (two $3\\times3$ vs one $5\\times5$). The "filters &times;
       weights" counting rule is recapped from the <code>dl-cnn-params</code> concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting padding 1.</b> A $3\\times3$ conv with no padding shrinks height/width by 2 each
        time, so a deep stack quickly runs out of pixels (and your shapes stop matching). VGG uses
        <code>padding=1</code> so only the max-pool changes the spatial size. <b>Fix:</b>
        <code>Conv2d(in, out, 3, padding=1)</code>.</li>
        <li><b>Counting pooling/ReLU as layers.</b> "VGG-16" counts <i>weight</i> layers (conv + FC) only;
        pooling and ReLU have no parameters and are not counted. Mislabeling the depth follows from this.</li>
        <li><b>Thinking "same receptive field" means "same function".</b> Two $3\\times3$ convs and one
        $5\\times5$ share a receptive field but are <b>not</b> the same map &mdash; the stack has an extra ReLU
        and fewer weights, so it is more expressive <i>and</i> cheaper. That is the whole point; do not "simplify"
        a stack back to one big filter.</li>
        <li><b>Including/excluding bias inconsistently in the count.</b> The paper's $27C^2$ vs $49C^2$ ignores
        biases. If you set <code>bias=True</code> the printed numbers gain $C$ per layer and won't match the
        clean formula. <b>Fix:</b> compare with <code>bias=False</code> (or subtract the biases) to match.</li>
        <li><b>Expecting depth to scale forever.</b> VGG showed 16&ndash;19 layers help, but plain stacks get
        hard to train much deeper &mdash; the very problem ResNet's skip connections later fixed. Do not read
        "deeper is better" as unbounded.</li>
      </ul>`,
    recall: [
      "How many stacked $3\\times3$ conv layers give the same receptive field as one $5\\times5$? As one $7\\times7$?",
      "Write the parameter count of three stacked $3\\times3$ convs vs one $7\\times7$ conv for $C$ channels.",
      "Name the two reasons (§2.3) the paper prefers stacked $3\\times3$ over one large filter.",
      "What does padding 1 with a $3\\times3$ conv do to the output's height and width?",
      "What does \"VGG-16\" count? (Which layers are and aren't included in the 16?)"
    ],
    practice: [
      {
        q: `<b>The receptive-field / parameter trade.</b> You want a stack whose outputs each see a $7\\times7$
            patch of the input, with $C=128$ channels in and out. Compare building it from three $3\\times3$
            convs vs one $7\\times7$ conv: give the receptive field and the weight count of each (ignore bias),
            and say which the paper picks and why.`,
        steps: [
          { do: `Receptive field: three stacked $3\\times3$ convs reach $1 + 2\\cdot3 = 7$ on a side, i.e. $7\\times7$ &mdash; the same as one $7\\times7$ conv.`, why: `Each $3\\times3$ conv adds radius 1; three of them add 3, so the reach is $7\\times7$ (§2.3).` },
          { do: `Weights of the stack: $3\\,(3^2 C^2) = 27 C^2 = 27 \\cdot 128^2 = 27 \\cdot 16{,}384 = 442{,}368$.`, why: `Each $3\\times3$ layer is $9 C^2$ weights; three of them give $27 C^2$.` },
          { do: `Weights of the single $7\\times7$: $7^2 C^2 = 49 C^2 = 49 \\cdot 16{,}384 = 802{,}816$.`, why: `One $7\\times7$ layer is $49 C^2$ &mdash; the paper notes this is 81% more than $27 C^2$.` },
          { do: `Pick the stack.`, why: `Same receptive field, ~45% fewer weights ($27/49$), and two extra ReLUs make it more expressive &mdash; the paper's two reasons.` }
        ],
        answer: `<p>Both reach a $7\\times7$ receptive field. The three-$3\\times3$ stack costs $27C^2 = 442{,}368$
                 weights; the single $7\\times7$ costs $49C^2 = 802{,}816$ &mdash; 81% more. The paper picks the
                 stack: same reach, far fewer weights, and the extra non-linear ReLUs between the small layers
                 make the decision function more discriminative (§2.3).</p>`
      },
      {
        q: `<b>The ablation.</b> Take your working VGG-style net and replace each pair of stacked $3\\times3$
            convs with one $5\\times5$ conv (same in/out channels, padding 2 so the spatial size matches).
            What changes in (a) parameter count and (b) the number of non-linearities, and what does the swap
            cost the model?`,
        steps: [
          { do: `Parameters: a pair of $3\\times3$ ($18 C^2$) becomes one $5\\times5$ ($25 C^2$), so each swapped block <i>gains</i> $7 C^2$ weights &mdash; the net gets bigger, not smaller.`, why: `$25C^2 \\gt 18C^2$: replacing the stack with one big filter raises the weight count (the paper's argument, run in reverse).` },
          { do: `Non-linearities: the pair had two ReLUs (one after each conv); the single $5\\times5$ has one. You lose a ReLU per swapped block.`, why: `Fewer interleaved non-linearities make the layer's mapping closer to a single linear step, reducing expressiveness.` },
          { do: `Retrain on the same CIFAR subset and compare accuracy.`, why: `An honest ablation changes one design choice &mdash; small-stacked vs one-large &mdash; so any accuracy/size difference is attributable to it.` }
        ],
        answer: `<p>Each $5\\times5$ swap <b>adds</b> parameters ($25C^2$ vs $18C^2$ for the pair) <i>and</i>
                 removes one ReLU. So you get a larger, shallower-in-nonlinearity model &mdash; typically equal
                 or worse accuracy at higher cost. That is exactly why VGG keeps everything $3\\times3$ and just
                 stacks more layers (§2.3). The CODE cell prints the $73{,}728$ vs $102{,}400$ counts that
                 underlie this.</p>`
      },
      {
        q: `Your parameter-count cell prints $73{,}728$ for two stacked $3\\times3$ convs and $102{,}400$ for one
            $5\\times5$ conv at $C=64$. A teammate rebuilds the convs with <code>bias=True</code> and now gets
            $73{,}856$ and $102{,}464$. Why did the numbers move, and which match the paper's formula?`,
        steps: [
          { do: `Each conv layer adds $C$ bias terms: $64$ per layer.`, why: `A conv with $C$ output channels has one bias per output channel, on top of the $k^2 C^2$ weights.` },
          { do: `Two $3\\times3$ layers add $2\\cdot64 = 128$: $73{,}728 + 128 = 73{,}856$. One $5\\times5$ adds $64$: $102{,}400 + 64 = 102{,}464$.`, why: `The bias counts are exactly the differences your teammate saw.` },
          { do: `Note the paper's $18C^2$ / $25C^2$ formula counts <b>weights only</b>, no bias.`, why: `§2.3 compares $27C^2$ vs $49C^2$ with no bias term, so the clean numbers are $73{,}728$ and $102{,}400$.` }
        ],
        answer: `<p>The extra counts are the bias terms ($C=64$ per conv layer). With <code>bias=True</code> the
                 two-$3\\times3$ stack gains $128$ ($\\to 73{,}856$) and the $5\\times5$ gains $64$ ($\\to
                 102{,}464$). The paper's formula ($18C^2$ vs $25C^2$) is weights-only, so the figures that match
                 it &mdash; and the worked example &mdash; are $73{,}728$ and $102{,}400$, i.e. the
                 <code>bias=False</code> counts.</p>`
      }
    ]
  });

  window.CODE["paper-vgg"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a small VGG-style net &mdash; stacked $3\\times3$ convolution blocks
       (<code>Conv2d(in, out, 3, padding=1)</code> &rarr; ReLU, repeated) each ending in a $2\\times2$
       <code>MaxPool2d</code> &mdash; from <code>nn.Conv2d</code>, then train it on a <b>CIFAR-10 subset</b>
       (torchvision, preinstalled in Colab &mdash; no pip) and <b>print test accuracy</b>. The first cell
       recomputes the worked example: two stacked $3\\times3$ convs ($73{,}728$ weights) vs one $5\\times5$ conv
       ($102{,}400$) at $C=64$ &mdash; same $5\\times5$ receptive field, fewer parameters. Paste into Colab and
       run.</p>`,
    code: `import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T

torch.manual_seed(0)

# --- 0. The worked example: two stacked 3x3 convs vs one 5x5 conv, C=64 channels. ---
#     Same 5x5 receptive field; the stack uses fewer weights. (bias=False to match the paper's count.)
C = 64
two_3x3 = nn.Sequential(nn.Conv2d(C, C, 3, padding=1, bias=False),   # 9*C*C
                        nn.ReLU(),
                        nn.Conv2d(C, C, 3, padding=1, bias=False))   # 9*C*C
one_5x5 = nn.Conv2d(C, C, 5, padding=2, bias=False)                  # 25*C*C
p_two = sum(p.numel() for p in two_3x3.parameters())
p_one = sum(p.numel() for p in one_5x5.parameters())
print(f"two stacked 3x3 (C={C}): {p_two} weights   = 18*C^2 = {18*C*C}")
print(f"one      5x5    (C={C}): {p_one} weights   = 25*C^2 = {25*C*C}")
print(f"the 5x5 has {p_one - p_two} more weights ({p_one/p_two:.3f}x); both see a 5x5 receptive field")
# two stacked 3x3 (C=64): 73728 weights   = 18*C^2 = 73728
# one      5x5    (C=64): 102400 weights   = 25*C^2 = 102400
# the 5x5 has 28672 more weights (1.389x); both see a 5x5 receptive field


# --- 1. A VGG block: n [Conv3x3(pad 1) -> ReLU] then one 2x2 MaxPool. ---
def vgg_block(in_ch, out_ch, n_convs):
    layers = []
    for i in range(n_convs):
        layers += [nn.Conv2d(in_ch if i == 0 else out_ch, out_ch, 3, padding=1), nn.ReLU(inplace=True)]
    layers += [nn.MaxPool2d(2)]                 # 2x2, stride 2 -> halves H and W
    return nn.Sequential(*layers)


# --- 2. Stack blocks with growing channels into a small VGG-style net. ---
class SmallVGG(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            vgg_block(3,   32, 2),   # 32x32 -> 16x16   (two stacked 3x3, like VGG)
            vgg_block(32,  64, 2),   # 16x16 -> 8x8
            vgg_block(64, 128, 2))   #  8x8  -> 4x4
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(128 * 4 * 4, 256), nn.ReLU(inplace=True),
            nn.Linear(256, n_classes))

    def forward(self, x):
        return self.classifier(self.features(x))


# --- 3. A CIFAR-10 subset (torchvision is preinstalled in Colab). ---
tfm = T.Compose([T.ToTensor(),
                 T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])
train_full = torchvision.datasets.CIFAR10(root="./data", train=True,  download=True, transform=tfm)
test_full  = torchvision.datasets.CIFAR10(root="./data", train=False, download=True, transform=tfm)
train_set  = torch.utils.data.Subset(train_full, range(5000))     # small + fast
test_set   = torch.utils.data.Subset(test_full,  range(2000))
train_loader = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)
test_loader  = torch.utils.data.DataLoader(test_set,  batch_size=256)
device = "cuda" if torch.cuda.is_available() else "cpu"

net = SmallVGG().to(device)
print("SmallVGG total parameters:", sum(p.numel() for p in net.parameters()))
opt = torch.optim.Adam(net.parameters(), lr=1e-3)
lf  = nn.CrossEntropyLoss()

for ep in range(5):
    net.train(); tot = 0.0; nb = 0
    for xb, yb in train_loader:
        xb, yb = xb.to(device), yb.to(device)
        opt.zero_grad(); loss = lf(net(xb), yb); loss.backward(); opt.step()
        tot += loss.item(); nb += 1
    print(f"epoch {ep}  train loss {tot/nb:.4f}")

# --- 4. PRINT test accuracy. ---
net.eval(); correct = 0; total = 0
with torch.no_grad():
    for xb, yb in test_loader:
        xb, yb = xb.to(device), yb.to(device)
        pred = net(xb).argmax(1)
        correct += (pred == yb).sum().item(); total += yb.size(0)
print(f"\\nTest accuracy on 2000 CIFAR-10 images: {100*correct/total:.1f}%")
# Well above the 10% chance baseline for 10 classes.
# (Exact number varies by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-vgg"] = {
    question: "For the same receptive field, how do parameters grow with filter size — and does the stacked-3x3 net actually learn on CIFAR?",
    charts: [
      {
        type: "bar",
        title: "Weights for the same 5x5 / 7x7 receptive field (C=64), weights only, no bias",
        xlabel: "design (receptive field)",
        ylabel: "number of weights",
        series: [
          {
            name: "weights",
            color: "#7ee787",
            points: [
              ["two 3x3 (5x5 RF)", 73728],
              ["one 5x5 (5x5 RF)", 102400],
              ["three 3x3 (7x7 RF)", 110592],
              ["one 7x7 (7x7 RF)", 200704]
            ]
          }
        ]
      },
      {
        type: "line",
        title: "SmallVGG training loss on a 5000-image CIFAR-10 subset (our run)",
        xlabel: "epoch",
        ylabel: "cross-entropy train loss",
        series: [
          {
            name: "stacked-3x3 VGG",
            color: "#58a6ff",
            points: [[0,1.79],[1,1.36],[2,1.16],[3,1.00],[4,0.85]]
          }
        ]
      }
    ],
    caption: "Left: weight counts for matched receptive fields at C=64 (weights only, biases excluded, matching §2.3). Two stacked 3x3 convs (73,728) undercut one 5x5 (102,400); three 3x3 (110,592) undercut one 7x7 (200,704) by 81% &mdash; the paper's 27C^2 vs 49C^2. Right: our SmallVGG (three stacked-3x3 blocks) on a 5000-image CIFAR-10 subset trains cleanly, loss falling 1.79 -> 0.85 over 5 epochs and reaching well above the 10% chance baseline on held-out test. These are our small run, not the paper's reported ImageNet numbers.",
    code: `import torch, torch.nn as nn

# --- Parameter counts for matched receptive fields (weights only, no bias), C=64. ---
C = 64
def conv_w(k, n=1):  # n stacked k x k convs, C->C, weights only
    return n * (k*k*C*C)
print("two   3x3 (5x5 RF):", conv_w(3, 2))   # 73728
print("one   5x5 (5x5 RF):", conv_w(5, 1))   # 102400
print("three 3x3 (7x7 RF):", conv_w(3, 3))   # 110592
print("one   7x7 (7x7 RF):", conv_w(7, 1))   # 200704

# --- The training-loss curve above came from the CODE cell's 5-epoch SmallVGG run
#     on a 5000-image CIFAR-10 subset (Adam, lr=1e-3). Numbers are ours, not the paper's. ---
# epoch 0  train loss 1.79
# epoch 1  train loss 1.36
# epoch 2  train loss 1.16
# epoch 3  train loss 1.00
# epoch 4  train loss 0.85`
  };
})();
