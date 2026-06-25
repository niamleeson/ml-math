/* Paper lesson — "Going Deeper with Convolutions" (GoogLeNet / Inception), Szegedy et al. 2014.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-inception".
   GROUNDED from arXiv:1409.4842 (abstract) and the ar5iv HTML mirror (Sec. 3-5, Table 1).
   Track B (architecture): build the dimension-reduced Inception module by hand on top of
   nn.Conv2d / nn.MaxPool2d, verify the concatenated output shape, work the 1x1-bottleneck
   FLOP/param savings numerically, and ablate the bottleneck. The 1x1-conv intuition lives
   in concept dl-inception; here we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-inception",
    title: "GoogLeNet / Inception — Going Deeper with Convolutions (2014)",
    tagline: "Run 1×1, 3×3, 5×5, and pooling in parallel and concatenate them — with 1×1 bottlenecks to keep it cheap.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Christian Szegedy, Wei Liu, Yangqing Jia, Pierre Sermanet, Scott Reed, Dragomir Anguelov, Dumitru Erhan, Vincent Vanhoucke, Andrew Rabinovich",
      org: "Google (and collaborators at UNC Chapel Hill, Univ. of Michigan)",
      year: 2014,
      venue: "arXiv:1409.4842 (Sep 2014); CVPR 2015; ILSVRC 2014 winner",
      citations: "",
      arxiv: "https://arxiv.org/abs/1409.4842",
      code: ""
    },
    conceptLink: "dl-inception",
    partOf: [],
    prereqs: ["dl-inception", "dl-conv", "dl-conv-hyperparams", "dl-pooling", "dl-cnn-params"],

    // WHY READ IT
    problem:
      `<p>By 2014 the obvious way to make a Convolutional Neural Network (CNN) more accurate was to make it
       <b>bigger</b> &mdash; deeper (more layers) and wider (more filters per layer). The paper points out two
       costs of just scaling up (&sect;3):</p>
       <ul>
        <li><b>Too many parameters.</b> A bigger net "is prone to overfitting, especially if the number of
        labeled examples in the training set is limited."</li>
        <li><b>Too much compute.</b> "Uniformly increased network size" means a "dramatic increase in use of
        computational resources" &mdash; and most of that compute is wasted if many weights end up near zero.</li>
       </ul>
       <p>The authors also note a tension: the best filter size is <b>not obvious</b>. Objects appear at many
       scales, so the "right" receptive field (the patch of input one filter sees) varies. Picking a single
       $3\\times3$ or $5\\times5$ for a layer throws information away. The question this paper answers:
       <b>how do you get the accuracy of a big, multi-scale network without the parameter and compute blow-up?</b></p>`,
    contribution:
      `<ul>
        <li><b>The Inception module.</b> Instead of choosing one filter size per layer, run several in
        <b>parallel</b> &mdash; a $1\\times1$, a $3\\times3$, a $5\\times5$ convolution, and a $3\\times3$
        max-pool &mdash; on the <i>same</i> input, then <b>concatenate</b> their output channels into one
        tensor (&sect;4). The next layer sees features at several scales at once.</li>
        <li><b>The $1\\times1$ bottleneck.</b> A naive parallel stack explodes in cost. The fix: put a cheap
        $1\\times1$ convolution <i>before</i> each expensive $3\\times3$ and $5\\times5$ to <b>shrink the
        channel count</b> first (a "dimension reduction"), and one <i>after</i> the pool branch. This is the
        idea that makes the module affordable.</li>
        <li><b>GoogLeNet.</b> A 22-layer network built by stacking 9 Inception modules. It won the ImageNet
        Large-Scale Visual Recognition Challenge 2014 (ILSVRC 2014) classification task while using, per the
        paper, "12&times; fewer parameters than the winning architecture of Krizhevsky et al" (AlexNet, 2012).</li>
      </ul>`,
    whyItMattered:
      `<p>Inception showed that <b>architecture</b> &mdash; not just raw size &mdash; buys accuracy, and it made
       the $1\\times1$ convolution a standard tool for cheaply changing channel count. The "shrink channels with
       a $1\\times1$, do the expensive work, expand again" pattern reappears everywhere after: the
       <b>bottleneck block</b> in ResNet, the depthwise-separable convolutions of MobileNet, and the squeeze
       step in SqueezeNet all descend from it. The parallel-multi-scale idea was refined across Inception-v2/v3
       and Inception-ResNet.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Motivation and High Level Considerations)</b> &mdash; why blindly scaling up fails
        (overfitting + compute), and the sparsity argument that motivates the design.</li>
        <li><b>&sect;4 (Architectural Details)</b> &mdash; the heart of the paper: the naive Inception module
        (Fig. 2a), the cost problem, and the $1\\times1$ dimension-reduced version (Fig. 2b). This is what you
        will build.</li>
        <li><b>Table 1</b> &mdash; the exact channel counts per branch for each of GoogLeNet's 9 modules
        (the #1×1, #3×3 reduce, #3×3, #5×5 reduce, #5×5, pool-proj columns). We use module <b>(3a)</b>.</li>
       </ul>
       <p><b>Skim:</b> the Hebbian / sparse-network theory in &sect;3 (intuition, not needed to implement),
       the <b>auxiliary classifiers</b> (two small side-heads added during training for gradient flow, then
       discarded), and the training/ensembling tricks in &sect;6-7. The implementable core is one module.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Module (3a) takes a $28\\times28$ feature map with <b>192</b> channels. Its $5\\times5$ branch must
       output 32 channels. Compare two ways to do it:</p>
       <ul>
        <li><b>Naive:</b> one $5\\times5$ convolution straight from 192 &rarr; 32 channels.</li>
        <li><b>Bottleneck:</b> a $1\\times1$ that first shrinks 192 &rarr; <b>16</b> channels, then a
        $5\\times5$ from 16 &rarr; 32.</li>
       </ul>
       <p>Guess: roughly how many times <b>fewer</b> weights (and multiply-adds) does the bottleneck version
       use? Write down 2&times;, 5&times;, 10&times;? Then check the worked numbers below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the module you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>Inception(nn.Module)</code> with <b>four parallel branches</b> all reading the same input
        <code>x</code>:</li>
        <li>branch 1: a single $1\\times1$ <code>nn.Conv2d(Cin, c1, 1)</code>.</li>
        <li>branch 2: TODO &mdash; a $1\\times1$ <b>reduce</b> <code>(Cin &rarr; c3r)</code>, ReLU, then a
        $3\\times3$ <code>(c3r &rarr; c3, padding=1)</code>.</li>
        <li>branch 3: TODO &mdash; a $1\\times1$ <b>reduce</b> <code>(Cin &rarr; c5r)</code>, ReLU, then a
        $5\\times5$ <code>(c5r &rarr; c5, padding=2)</code>.</li>
        <li>branch 4: a $3\\times3$ <code>nn.MaxPool2d(3, stride=1, padding=1)</code> then a $1\\times1$
        <b>pool-proj</b> <code>(Cin &rarr; pp)</code>.</li>
        <li>forward: TODO &mdash; <code>torch.cat([b1, b2, b3, b4], dim=1)</code>  <i># concatenate on the channel axis</i></li>
       </ul>
       <p>Predict the output channel count for module (3a) with
       <code>(c1, c3, c5, pp) = (64, 128, 32, 32)</code> before you run it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>A normal CNN layer makes you pick <i>one</i> operation &mdash; say a single $3\\times3$ convolution.
       The Inception module's idea (&sect;4) is to stop choosing and run several operations <b>side by side</b>
       on the same input, then glue their outputs together. The paper describes the naive version as a
       "combination of all those layers with their output filter banks concatenated into a single output
       vector forming the input of the next stage." The four operations are: a $1\\times1$ convolution, a
       $3\\times3$ convolution, a $5\\times5$ convolution, and a $3\\times3$ max-pooling.</p>
       <p>Each branch is given <b>same-padding</b> so every output keeps the input's height and width
       ($28\\times28$ stays $28\\times28$). Because the spatial size matches, you can stack the four outputs
       along the <b>channel</b> axis &mdash; that is the <b>concatenation</b>. If the branches emit
       $64 + 128 + 32 + 32$ channels, the module outputs a $28\\times28$ map with $256$ channels.</p>
       <p><b>The cost problem.</b> The paper warns that "even a modest number of $5\\times5$ convolutions can be
       prohibitively expensive on top of a convolutional layer with a large number of filters." Worse, the
       pooling branch passes <i>all</i> input channels through, so "merging of the output of the pooling layer
       with the outputs of convolutional layers would lead to an inevitable increase in the number of outputs."
       Concatenating naively, stage after stage, makes the channel count balloon.</p>
       <p><b>The fix &mdash; $1\\times1$ bottlenecks.</b> A $1\\times1$ convolution mixes channels at a single
       pixel: it maps a $C_{in}$-channel pixel to a $C_{out}$-channel pixel by a learned linear combination,
       costing only $C_{in}\\cdot C_{out}$ weights per pixel (no spatial extent). The paper uses it as a
       <b>dimension reduction</b>: "$1\\times1$ convolutions are used to compute reductions before the
       expensive $3\\times3$ and $5\\times5$ convolutions." So branch 2 becomes $1\\times1$ (shrink channels)
       &rarr; $3\\times3$, branch 3 becomes $1\\times1$ (shrink) &rarr; $5\\times5$, and the pool branch gets a
       $1\\times1$ projection after it. The expensive spatial convolution now runs on far fewer input channels.
       (The $1\\times1$ idea comes from Lin et al.'s "Network in Network".)</p>`,
    symbols: [
      { sym: "$C_{in}$", desc: "the <b>number of input channels</b> (feature maps) entering the module &mdash; e.g. $192$ for GoogLeNet module (3a)." },
      { sym: "$C_{out}$", desc: "the <b>number of output channels</b> a branch produces (its number of filters)." },
      { sym: "$H, W$", desc: "the <b>height and width</b> of the feature map. Same-padding keeps these unchanged across every branch, so the outputs can be concatenated." },
      { sym: "$k$", desc: "the <b>kernel size</b> (filter side length): $1$, $3$, or $5$. A $k\\times k$ filter looks at a $k\\times k$ patch." },
      { sym: "$1\\times1$ convolution", desc: "a convolution with a $1\\times1$ kernel: it does <b>no spatial mixing</b>, only a learned linear combination across channels at each pixel. Used here as a cheap <b>channel reducer</b> (bottleneck)." },
      { sym: "“reduce” / “bottleneck”", desc: "plain terms: the $1\\times1$ layer that <b>shrinks</b> $C_{in}$ to a small number before an expensive $3\\times3$ or $5\\times5$ runs. '#3×3 reduce' and '#5×5 reduce' in Table 1 are these channel counts." },
      { sym: "“pool-proj”", desc: "the $1\\times1$ <b>projection</b> placed after the pooling branch to cut its channel count before concatenation." },
      { sym: "concatenation ($\\oplus$)", desc: "stacking the four branch outputs along the <b>channel axis</b> (<code>dim=1</code> in PyTorch's $N,C,H,W$ tensors). Total output channels $=$ sum of the four branch channel counts." },
      { sym: "FLOP / MAC", desc: "a <b>floating-point operation</b>; here we count <b>multiply-accumulates</b> (MACs) &mdash; one multiply plus one add per filter weight per output pixel. The cost metric the bottleneck slashes." }
    ],
    formula: `$$ \\text{cost}(k\\text{-conv}) \\;=\\; \\underbrace{H\\cdot W}_{\\text{output pixels}} \\cdot \\underbrace{k^2\\, C_{in}\\, C_{out}}_{\\text{MACs per pixel}} \\qquad\\text{(standard conv cost; } \\S 4 \\text{ counts these)} $$`,
    whatItDoes:
      `<p>This is the <b>multiply-accumulate (MAC) count</b> of one convolution: for every one of the $H\\cdot W$
       output pixels, the layer does $k^2\\,C_{in}\\,C_{out}$ multiply-adds (each of the $C_{out}$ filters slides a
       $k\\times k\\times C_{in}$ kernel over the input). The weight count drops the $H\\cdot W$ factor:
       $k^2\\,C_{in}\\,C_{out}$.</p>
       <p>Read off the two levers: cost is <b>linear</b> in $C_{in}$ and in $C_{out}$, and <b>quadratic</b> in
       the kernel size $k$. A $1\\times1$ has $k^2=1$, so it is the cheapest way to change channels. Putting a
       $1\\times1$ in front of a $5\\times5$ ($k^2=25$) replaces "$5\\times5$ on a big $C_{in}$" with
       "$5\\times5$ on a tiny reduced $C_{in}$" &mdash; that is where the savings come from.</p>`,
    derivation:
      `<p><b>Why the bottleneck saves so much.</b> Compare the $5\\times5$ branch of module (3a) two ways. Input
       is $H\\times W = 28\\times28$ with $C_{in}=192$ channels; the branch must output $C_{out}=32$ channels;
       the reduce width is $r=16$ (Table 1).</p>
       <p><b>Naive</b> &mdash; one $5\\times5$ straight from 192 to 32:</p>
       <p>$$ \\text{MACs} = H\\,W\\cdot 5^2\\cdot C_{in}\\cdot C_{out} = 28\\cdot28\\cdot25\\cdot192\\cdot32. $$</p>
       <p><b>Bottleneck</b> &mdash; a $1\\times1$ (192&rarr;16) <i>then</i> a $5\\times5$ (16&rarr;32):</p>
       <p>$$ \\text{MACs} = \\underbrace{H\\,W\\cdot 1^2\\cdot 192\\cdot 16}_{\\text{the } 1\\times1 \\text{ reduce}} \\;+\\; \\underbrace{H\\,W\\cdot 5^2\\cdot 16\\cdot 32}_{\\text{the } 5\\times5 \\text{ on 16 ch}}. $$</p>
       <p>The expensive $5\\times5$ now runs on $16$ input channels instead of $192$ &mdash; a $12\\times$ smaller
       $C_{in}$ &mdash; and the extra $1\\times1$ is cheap because $k^2=1$. The same algebra holds for weights
       (drop the $H\\,W$). The exact numbers are worked below and recomputed in the notebook.</p>
       <p>The deeper <i>why a $1\\times1$ can afford to throw away channels</i> &mdash; the redundancy /
       sparsity argument &mdash; is recapped from the <b>dl-inception</b> concept lesson, not re-derived here.</p>`,
    example:
      `<p>Work the $5\\times5$ branch of module (3a) in <b>weights</b> (ignore bias) and in <b>MACs</b>, using
       $H\\,W = 28\\times28 = 784$, $C_{in}=192$, $C_{out}=32$, reduce $r=16$.</p>
       <ul class="steps">
        <li><b>Naive weights:</b> $5^2\\cdot192\\cdot32 = 25\\cdot192\\cdot32 = 153{,}600$.</li>
        <li><b>Bottleneck weights:</b> the $1\\times1$ is $1\\cdot192\\cdot16 = 3{,}072$; the $5\\times5$ is
        $25\\cdot16\\cdot32 = 12{,}800$. Total $= 3{,}072 + 12{,}800 = 15{,}872$.</li>
        <li><b>Weight ratio:</b> $153{,}600 / 15{,}872 \\approx \\mathbf{9.68\\times}$ fewer weights.</li>
        <li><b>Naive MACs:</b> $784\\cdot153{,}600 = 120{,}422{,}400 \\approx 120.4$ million.</li>
        <li><b>Bottleneck MACs:</b> $784\\cdot15{,}872 = 12{,}443{,}648 \\approx 12.4$ million &mdash; the same
        $\\mathbf{9.68\\times}$ saving (the $H\\,W$ factor cancels in the ratio).</li>
       </ul>
       <p>So the $1\\times1$ bottleneck makes the $5\\times5$ branch almost <b>ten times</b> cheaper while still
       producing 32 output channels. These exact numbers are recomputed in the notebook's worked-example cell.</p>`,
    recipe:
      `<ol>
        <li><b>Branch 1 &mdash; $1\\times1$:</b> <code>nn.Conv2d(Cin, c1, 1)</code>.</li>
        <li><b>Branch 2 &mdash; $3\\times3$ with reduce:</b> $1\\times1$ <code>(Cin&rarr;c3r)</code> &rarr; ReLU
        &rarr; $3\\times3$ <code>(c3r&rarr;c3, padding=1)</code>.</li>
        <li><b>Branch 3 &mdash; $5\\times5$ with reduce:</b> $1\\times1$ <code>(Cin&rarr;c5r)</code> &rarr; ReLU
        &rarr; $5\\times5$ <code>(c5r&rarr;c5, padding=2)</code>.</li>
        <li><b>Branch 4 &mdash; pool:</b> $3\\times3$ <code>MaxPool2d(stride=1, padding=1)</code> &rarr;
        $1\\times1$ pool-proj <code>(Cin&rarr;pp)</code>.</li>
        <li><b>Concatenate</b> the four outputs on the channel axis: <code>torch.cat([...], dim=1)</code>. Output
        channels $= c1 + c3 + c5 + pp$.</li>
        <li><b>Stack</b> several modules (interleaved with stride-2 pooling) into a small GoogLeNet, end with
        global average pooling + a linear head.</li>
        <li><b>Ablate</b> the bottleneck: rebuild the module with the $1\\times1$ reduces removed and compare
        parameter/MAC counts (and that the concat shape is unchanged).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): the Inception architecture "was responsible for setting the new state of
       the art for classification and detection in the ImageNet Large-Scale Visual Recognition Challenge 2014
       (ILSVRC 2014)," via "GoogLeNet, a 22 layers deep network." The paper's reported classification result is
       a <b>top-5 error of 6.67%</b> (an ensemble of 7 models with 144 crops per image), which won 1st place,
       while using "12&times; fewer parameters than" AlexNet.</p>
       <p><i>These are the paper's reported figures, quoted from the fetched text. The numbers in the CODEVIZ
       panel below are computed from the module's exact channel counts &mdash; our own arithmetic, not a headline
       metric from the paper.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.MaxPool2d</code>, <code>nn.ReLU</code>, and <code>torch.cat</code>. <b>Build by hand:</b> the
       four-branch Inception module with $1\\times1$ reduces, the channel-axis concatenation, and the
       <b>ablation</b> that removes the bottlenecks. The FLOP/param savings are <b>computed exactly</b> from the
       conv-cost formula and printed; the sparsity intuition behind the $1\\times1$ reduce is recapped from the
       <b>dl-inception</b> concept lesson, not re-derived. There is no allclose here (Track B): the oracle is
       the verified concat shape plus the exact, reproducible cost arithmetic.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting same-padding.</b> The four branches are concatenated on the channel axis, which
        requires identical $H\\times W$. A $3\\times3$ needs <code>padding=1</code> and a $5\\times5$ needs
        <code>padding=2</code> (and the pool needs <code>padding=1</code>) or the shapes will not line up and
        <code>torch.cat</code> errors. <b>Fix:</b> set padding $= (k-1)/2$ for every branch.</li>
        <li><b>Putting the reduce after the big conv.</b> The $1\\times1$ must come <i>before</i> the
        $3\\times3$/$5\\times5$ to shrink $C_{in}$ first &mdash; that is the whole saving. A $1\\times1$
        <i>after</i> a full $5\\times5$ on 192 channels saves nothing on the expensive layer.</li>
        <li><b>Pool branch order.</b> It is <b>pool then $1\\times1$ project</b>, not project then pool. Pooling
        keeps all $C_{in}$ channels; the $1\\times1$ after it trims them before concatenation.</li>
        <li><b>Concatenating on the wrong axis.</b> Channels are <code>dim=1</code> in PyTorch's
        $(N, C, H, W)$ layout; <code>dim=0</code> would stack the batch instead. <b>Fix:</b>
        <code>torch.cat([...], dim=1)</code>.</li>
        <li><b>Reading "12× fewer params" as "12× less compute."</b> The paper's $12\\times$ is a
        <i>parameter</i> comparison to AlexNet for the whole net; the $\\sim\\!9.68\\times$ here is the
        <i>per-branch</i> bottleneck saving on the $5\\times5$ branch. Different scopes &mdash; do not conflate.</li>
      </ul>`,
    recall: [
      "Name the four parallel branches of an Inception module and how their outputs are combined.",
      "Write the MAC cost of a k×k convolution in terms of H, W, k, C_in, C_out.",
      "Why does a 1×1 'reduce' before a 5×5 cut cost so much? Which factor does it shrink?",
      "What output channel count does module (3a) produce, and why must all branches use same-padding?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Take working module (3a) and <b>remove the $1\\times1$ reduces</b> (so the
            $3\\times3$ and $5\\times5$ read all 192 input channels directly, and the pool branch keeps all 192).
            The concatenated output is still 256 channels. So what actually changed, and what does that
            demonstrate about the bottleneck's role?`,
        steps: [
          { do: `Keep every branch's <i>output</i> channel count the same (1×1=64, 3×3=128, 5×5=32, pool-proj=32), so the concat is still 256 — the shape is unchanged.`, why: `An honest ablation changes one thing: the presence of the 1×1 reduces, not the module's output interface.` },
          { do: `Count parameters/MACs for both versions and compare. The naive 5×5 alone jumps from 15,872 to 153,600 weights; the 3×3 and pool-proj also grow.`, why: `Removing the reduce forces the expensive spatial convs to run on the full 192 input channels — exactly the 'prohibitively expensive' blow-up the paper warns about.` },
          { do: `Conclude the bottleneck did not change <i>what</i> the module outputs, only <i>how cheaply</i> it computes it.`, why: `Same output shape, far fewer weights/MACs — the 1×1 reduce is a pure efficiency win, which is the paper's point.` }
        ],
        answer: `<p>The output shape is unchanged (still $28\\times28\\times256$), but the parameter and MAC counts
                 jump sharply &mdash; the $5\\times5$ branch alone goes from $\\sim\\!15.9$k to $153.6$k weights
                 ($\\approx 9.68\\times$). This isolates the $1\\times1$ reduce as a <b>compute/parameter</b>
                 optimization: it buys the same multi-scale output far more cheaply, which is what let GoogLeNet
                 go 22 layers deep without a parameter explosion. The CODEVIZ panel shows this per-branch.</p>`
      },
      {
        q: `You build the module but <code>torch.cat</code> throws a shape-mismatch error. The $3\\times3$ branch
            output is $28\\times28$ but the $5\\times5$ branch output is $24\\times24$. What went wrong, and how
            do you fix it?`,
        steps: [
          { do: `Check padding: a 5×5 conv with padding=0 shrinks 28→24 (loses (k-1)=4 pixels), while the 3×3 with padding=1 stayed at 28.`, why: `Concatenation on the channel axis requires identical H and W; a branch with too little padding comes out smaller.` },
          { do: `Set padding = (k-1)/2 for each branch: 0 for 1×1, 1 for 3×3, 2 for 5×5, and padding=1 on the 3×3 pool.`, why: `Same-padding keeps every branch at 28×28 so the four outputs align spatially.` },
          { do: `Re-run; all four branches are now 28×28 and concatenate to 28×28×(sum of channels).`, why: `Matching spatial size is the precondition for the channel-axis concat.` }
        ],
        answer: `<p>The $5\\times5$ branch lacked padding, so it shrank to $24\\times24$ while the $3\\times3$ stayed
                 $28\\times28$ &mdash; and <code>torch.cat</code> on the channel axis needs equal $H,W$. Fix it with
                 <b>same-padding</b>: padding $=(k-1)/2$, i.e. $2$ for the $5\\times5$ (and $1$ for the $3\\times3$
                 and the pool). All branches return $28\\times28$ and the concat succeeds.</p>`
      },
      {
        q: `Repeat the worked example for the <b>$3\\times3$ branch</b> of module (3a): naive is a $3\\times3$
            from 192&rarr;128; the bottleneck is $1\\times1$ (192&rarr;96) then $3\\times3$ (96&rarr;128).
            Compute the weight counts and the savings ratio. Why is it smaller than the $5\\times5$ branch's
            $\\sim\\!9.68\\times$?`,
        steps: [
          { do: `Naive 3×3 weights: 3²·192·128 = 9·192·128 = 221,184.`, why: `k²·C_in·C_out with k=3, C_in=192, C_out=128.` },
          { do: `Bottleneck: 1×1 is 1·192·96 = 18,432; 3×3 is 9·96·128 = 110,592; total = 129,024.`, why: `The reduce trims 192→96 channels before the 3×3 runs.` },
          { do: `Ratio = 221,184 / 129,024 ≈ 1.71×. The reduce here only halves channels (192→96, not 192→16), and k²=9 is much smaller than 25, so the saving is milder.`, why: `Savings scale with how aggressively you reduce C_in and with k²; the 5×5 branch reduces 12× and pays k²=25, so it gains far more.` }
        ],
        answer: `<p>Naive $3\\times3$: $9\\cdot192\\cdot128 = 221{,}184$ weights. Bottleneck:
                 $18{,}432 + 110{,}592 = 129{,}024$. Ratio $\\approx \\mathbf{1.71\\times}$ &mdash; real, but far less
                 than the $5\\times5$ branch's $9.68\\times$. Two reasons: the $3\\times3$ reduce is gentle
                 ($192\\to96$, only $2\\times$) whereas the $5\\times5$ reduce is aggressive ($192\\to16$,
                 $12\\times$); and $k^2=9$ for the $3\\times3$ versus $25$ for the $5\\times5$, so the expensive
                 layer the bottleneck shrinks is itself cheaper. The bottleneck pays off most where the kernel is
                 big and the reduce is deep.</p>`
      }
    ]
  });

  window.CODE["paper-inception"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the dimension-reduced Inception module by hand on top of
       <code>nn.Conv2d</code> / <code>nn.MaxPool2d</code> and verify the concatenated output shape. The key line
       is <code>torch.cat([b1, b3, b5, bp], dim=1)</code> &mdash; four parallel branches glued on the channel
       axis. We use GoogLeNet module <b>(3a)</b>'s exact channel counts from Table 1
       (<code>192 &rarr; 64, (96)128, (16)32, 32</code>) and confirm the output is
       $28\\times28\\times256$. Then the worked-example cell recomputes the $5\\times5$-branch FLOP/param
       <b>savings</b> ($153{,}600$ vs $15{,}872$ weights $\\approx 9.68\\times$), and the <b>ablation</b> rebuilds
       the module without the $1\\times1$ reduces and prints the parameter blow-up. Paste into Colab and run
       (torch is preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Worked example: the 1x1 bottleneck's FLOP/param saving on the 5x5 branch. ---
# Module (3a): H=W=28, C_in=192, 5x5 branch outputs C_out=32, reduce r=16  (Table 1).
H, W, Cin, Cout, r = 28, 28, 192, 32, 16
naive_w = 5*5 * Cin * Cout                      # one 5x5: 192 -> 32
bott_w  = 1*1 * Cin * r + 5*5 * r * Cout        # 1x1 (192->16) then 5x5 (16->32)
naive_macs = H*W * naive_w
bott_macs  = H*W * bott_w
print("5x5 branch  NAIVE   weights =", naive_w, " MACs =", naive_macs)
print("5x5 branch  BOTTLE  weights =", bott_w,  " MACs =", bott_macs)
print("weight saving =", round(naive_w/bott_w, 2), "x   MAC saving =", round(naive_macs/bott_macs, 2), "x")
# 5x5 branch  NAIVE   weights = 153600  MACs = 120422400
# 5x5 branch  BOTTLE  weights = 15872   MACs = 12443648
# weight saving = 9.68 x   MAC saving = 9.68 x


# --- 1. The dimension-reduced Inception module (built by hand). ---
class Inception(nn.Module):
    def __init__(self, Cin, c1, c3r, c3, c5r, c5, pp):
        super().__init__()
        # branch 1: a single 1x1 conv
        self.b1 = nn.Conv2d(Cin, c1, kernel_size=1)
        # branch 2: 1x1 REDUCE -> 3x3 (same-padding=1)
        self.b3 = nn.Sequential(
            nn.Conv2d(Cin, c3r, 1), nn.ReLU(inplace=True),
            nn.Conv2d(c3r, c3, 3, padding=1))
        # branch 3: 1x1 REDUCE -> 5x5 (same-padding=2)
        self.b5 = nn.Sequential(
            nn.Conv2d(Cin, c5r, 1), nn.ReLU(inplace=True),
            nn.Conv2d(c5r, c5, 5, padding=2))
        # branch 4: 3x3 max-pool (stride 1, padding 1) -> 1x1 project
        self.bp = nn.Sequential(
            nn.MaxPool2d(3, stride=1, padding=1),
            nn.Conv2d(Cin, pp, 1))

    def forward(self, x):
        return torch.cat([self.b1(x), self.b3(x), self.b5(x), self.bp(x)], dim=1)  # channel axis


# --- 2. Module (3a) from Table 1: Cin=192, 1x1=64, (3x3r=96)3x3=128, (5x5r=16)5x5=32, pool-proj=32. ---
m3a = Inception(192, c1=64, c3r=96, c3=128, c5r=16, c5=32, pp=32)
x = torch.randn(2, 192, 28, 28)                 # (N, C, H, W)
y = m3a(x)
print("\\ninput :", tuple(x.shape))
print("output:", tuple(y.shape), "  (channels = 64+128+32+32 =", 64+128+32+32, ")")
assert y.shape == (2, 256, 28, 28), "concat shape must be 28x28x256"
print("shape check passed: parallel branches concatenated on the channel axis.")
params_reduced = sum(p.numel() for p in m3a.parameters())
print("dim-reduced module (3a) params (incl. bias):", params_reduced)


# --- 3. ABLATION: the SAME module without 1x1 reduces (3x3/5x5 read all 192 channels). ---
class NaiveInception(nn.Module):
    def __init__(self, Cin, c1, c3, c5, pp):
        super().__init__()
        self.b1 = nn.Conv2d(Cin, c1, 1)
        self.b3 = nn.Conv2d(Cin, c3, 3, padding=1)        # no reduce -> 192 -> 128 directly
        self.b5 = nn.Conv2d(Cin, c5, 5, padding=2)        # no reduce -> 192 -> 32 directly
        self.bp = nn.Sequential(nn.MaxPool2d(3, 1, 1), nn.Conv2d(Cin, pp, 1))
    def forward(self, x):
        return torch.cat([self.b1(x), self.b3(x), self.b5(x), self.bp(x)], dim=1)

m3a_naive = NaiveInception(192, c1=64, c3=128, c5=32, pp=32)
y_naive = m3a_naive(x)
params_naive = sum(p.numel() for p in m3a_naive.parameters())
print("\\nABLATION (no 1x1 reduces):")
print("output:", tuple(y_naive.shape), " -> SAME 256 channels, so the interface is unchanged")
print("naive module (3a) params (incl. bias):", params_naive)
print("whole-module param blow-up without bottlenecks =",
      round(params_naive / params_reduced, 2), "x")
# The output shape is identical; only the parameter/MAC cost changed. The 1x1 reduces are a
# pure efficiency win -- the paper's reason GoogLeNet could be 22 layers deep cheaply.
# (Our exact arithmetic from the channel counts, not a headline number from the paper.)`
  };

  window.CODEVIZ["paper-inception"] = {
    question: "Per branch, how many parameters does the 1×1 bottleneck save versus a naive Inception module on module (3a)'s channel counts?",
    charts: [
      {
        type: "bar",
        title: "Weights per branch — naive vs 1×1-bottleneck (Inception module 3a, C_in=192)",
        xlabel: "branch:  0 = 5×5 (192→32)   1 = 3×3 (192→128)",
        ylabel: "weights (thousands)",
        series: [
          {
            name: "Naive (no reduce)",
            color: "#ff7b72",
            points: [[0, 153.6], [1, 221.184]]
          },
          {
            name: "1×1 bottleneck",
            color: "#7ee787",
            points: [[0, 15.872], [1, 129.024]]
          }
        ]
      }
    ],
    caption: "Our own exact arithmetic from the conv-cost formula k²·C_in·C_out on module (3a)'s Table-1 channel counts — not a headline number from the paper. The 5×5 branch (left): naive is one 5×5 from 192→32 = 153,600 weights; the bottleneck (1×1 192→16, then 5×5 16→32) is 3,072 + 12,800 = 15,872 — a 9.68× cut. The 3×3 branch (right): naive 192→128 = 221,184; bottleneck (1×1 192→96, then 3×3 96→128) = 18,432 + 110,592 = 129,024 — a 1.71× cut. Both branches produce the SAME output channels; only the cost differs. The 5×5 gains most because its reduce is aggressive (192→16) and k²=25 is large. MAC counts scale by the same ratios (multiply each weight count by H·W = 784).",
    code: `# Exact parameter counts from the convolution cost formula: weights = k^2 * C_in * C_out.
# Module (3a), C_in = 192 (Table 1).
def conv_w(k, cin, cout): return k*k*cin*cout

Cin = 192
# 5x5 branch: naive 192->32  vs  bottleneck 1x1(192->16) + 5x5(16->32)
n5 = conv_w(5, Cin, 32)
b5 = conv_w(1, Cin, 16) + conv_w(5, 16, 32)
# 3x3 branch: naive 192->128 vs  bottleneck 1x1(192->96) + 3x3(96->128)
n3 = conv_w(3, Cin, 128)
b3 = conv_w(1, Cin, 96) + conv_w(3, 96, 128)

print("5x5  naive =", n5, " bottleneck =", b5, " ratio =", round(n5/b5, 2))
print("3x3  naive =", n3, " bottleneck =", b3, " ratio =", round(n3/b3, 2))
# 5x5  naive = 153600  bottleneck = 15872  ratio = 9.68
# 3x3  naive = 221184  bottleneck = 129024 ratio = 1.71
# (thousands, for the bars: 153.6 / 15.872 and 221.184 / 129.024)`
  };
})();
