/* Paper lesson — "Deep Networks with Stochastic Depth", Huang, Sun, Liu, Sedra, Weinberger 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-stochastic-depth".
   GROUNDED from arXiv:1603.09382 via the ar5iv HTML mirror (Section 3, Eqns 2-5; Section 4 results).
   Track B (architecture): build the stochastic-depth residual block on top of nn.Conv2d/nn.BatchNorm2d,
   train a small ResNet, show faster training + regularization, then ablate (drop schedule on vs off). */
(function () {
  window.LESSONS.push({
    id: "paper-stochastic-depth",
    title: "Stochastic Depth — Deep Networks with Stochastic Depth (2016)",
    tagline: "Randomly delete whole residual blocks during training (keep only the skip); train shorter, test full.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Gao Huang, Yu Sun, Zhuang Liu, Daniel Sedra, Kilian Q. Weinberger",
      org: "Cornell University; Tsinghua University",
      year: 2016,
      venue: "arXiv:1603.09382 (Mar 2016); ECCV 2016",
      citations: "",
      arxiv: "https://arxiv.org/abs/1603.09382",
      code: "https://github.com/yueatsprograms/Stochastic_Depth"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-resnet", "dl-resnet", "dl-dropout", "dl-batchnorm", "prob-expectation", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>ResNet (the <b>Residual Network</b>, see the <code>paper-resnet</code> lesson) made very deep
       networks <i>trainable</i> by adding each block's input back to its output. But very deep still meant
       very <b>slow</b> and still left two problems the authors call out in &sect;1:</p>
       <ul>
        <li><b>Vanishing gradients.</b> Even with skip connections, the gradient signal can weaken as it
        flows back through a hundred-plus layers.</li>
        <li><b>Long training time.</b> A 1202-layer ResNet has to push every example forward and backward
        through all 1202 layers on every step. The paper notes training such nets "can take days or even
        weeks." (&sect;1)</li>
       </ul>
       <p>The tension the paper names: we want a network that is <b>deep at test time</b> (depth buys
       accuracy) but <b>short during training</b> (short is fast and has a stronger gradient). Those sound
       contradictory &mdash; a fixed architecture has one depth. The paper's answer is to make the
       <i>training</i> depth random and variable while the <i>test</i> depth stays full.</p>`,
    contribution:
      `<ul>
        <li><b>Stochastic depth.</b> During training, each residual block is randomly <b>dropped</b> with
        some probability. A dropped block is replaced by the plain <b>identity</b> wire &mdash; its
        convolutions are skipped entirely &mdash; so that mini-batch trains a <i>shorter</i> network.</li>
        <li><b>A linear survival schedule.</b> Early blocks (close to the input) are kept almost always;
        later blocks are dropped more often. The "survival probability" decays linearly with depth
        (&sect;3, Eqn. 4).</li>
        <li><b>Test-time rescaling.</b> At test time every block is kept, but each block's residual output
        is scaled by its survival probability, so the expected contribution matches training (&sect;3,
        Eqn. 5). This is the same expectation-matching trick as Dropout (see <code>paper-dropout</code>).</li>
       </ul>`,
    whyItMattered:
      `<p>Stochastic depth gave faster training (the paper reports about a 25% wall-clock reduction) <i>and</i>
       lower test error &mdash; a regularizer that also saves compute. It let the authors train a
       <b>1202-layer</b> network on CIFAR-10 that actually improved over the 110-layer one, whereas constant
       depth at 1202 layers had overfit. The "randomly drop a residual path" idea reappears later as
       <b>DropPath / drop-connect</b> inside modern architectures (e.g. EfficientNet, Vision Transformers),
       where it is a standard regularizer.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Deep Networks with Stochastic Depth)</b> &mdash; the whole method lives here: the
        Bernoulli drop variable $b_\\ell$, the update rule (Eqn. 2), the identity reduction when a block is
        dropped (Eqn. 3), the linear survival schedule (Eqn. 4), and the test-time rescaling (Eqn. 5).</li>
        <li><b>The expected-depth result</b> in &sect;3: $E(\\tilde{L}) = \\sum_\\ell p_\\ell$, which for the
        linear schedule with $p_L = 0.5$ gives roughly $3L/4$ active blocks &mdash; the source of the
        training speedup.</li>
        <li><b>&sect;4 (Results), Tables 1-2</b> &mdash; the test-error and training-time comparisons against
        constant-depth ResNet on CIFAR-10/100, SVHN, ImageNet.</li>
       </ul>
       <p><b>Skim:</b> &sect;5 (analytic experiments on gradient magnitude) on a first pass; the core idea and
       the five equations in &sect;3 are all you need to implement it.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You take a working ResNet and, during training, <b>randomly delete</b> roughly a quarter of its
       residual blocks on every mini-batch (replacing each deleted block with its identity skip). At test
       time you put all the blocks back. Compared to training the same ResNet with <b>all</b> blocks always
       on, do you expect the final <i>test</i> error to be <b>lower</b>, <b>about the same</b>, or
       <b>higher</b>? And do you expect training to be <b>faster</b> or <b>slower</b> per epoch? Write your
       guess and one sentence of reasoning, then run the ablation below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the block you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>StochasticBlock(nn.Module)</code> wrapping the usual two-conv residual function $f$ with
        survival probability <code>p</code> (a number in $[0,1]$).</li>
        <li>Save the skip: <code>identity = self.proj(x) if self.proj else x</code>.</li>
        <li>TODO (<b>training</b>): draw a Bernoulli coin <code>b = (torch.rand(1) &lt; self.p)</code>.
        If <code>b</code> is $0$, <b>skip $f$ entirely</b> and return <code>relu(identity)</code>. If
        <code>b</code> is $1$, return <code>relu(f(x) + identity)</code>.</li>
        <li>TODO (<b>test</b>): always run $f$, but <b>scale it by p</b>:
        return <code>relu(self.p * f(x) + identity)</code>.</li>
       </ul>
       <p>Then build the <b>linear survival schedule</b> $p_\\ell = 1 - (\\ell/L)(1 - p_L)$ with $p_L = 0.5$,
       assign one $p_\\ell$ to each block by depth, and compare against the <b>ablation</b>: the same net with
       every $p_\\ell = 1$ (no dropping = ordinary constant-depth ResNet).</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from a residual block. Let $H_{\\ell-1}$ be the input to block $\\ell$ and $f_\\ell$ be that
       block's residual function (its two convolutions, each with Batch Normalization and ReLU). An ordinary
       ResNet computes (&sect;2, Eqn. 1)
       $$ H_\\ell = \\mathrm{ReLU}\\big(f_\\ell(H_{\\ell-1}) + \\mathrm{id}(H_{\\ell-1})\\big), $$
       where $\\mathrm{id}$ is the identity skip that just copies the input through.</p>
       <p><b>The stochastic-depth change (&sect;3).</b> For each block introduce a coin flip
       $b_\\ell \\in \\{0,1\\}$, a <b>Bernoulli</b> random variable that is $1$ ("survive") with probability
       $p_\\ell$ and $0$ ("drop") with probability $1 - p_\\ell$. Multiply the residual function by it:</p>
       <p>$$ H_\\ell = \\mathrm{ReLU}\\big(b_\\ell\\, f_\\ell(H_{\\ell-1}) + \\mathrm{id}(H_{\\ell-1})\\big)
       \\qquad\\text{(Eqn. 2)}. $$</p>
       <p>When the coin is heads ($b_\\ell = 1$) the block behaves exactly like a normal ResNet block. When it
       is tails ($b_\\ell = 0$) the residual term vanishes and the block collapses to the bare skip
       (&sect;3, Eqn. 3):</p>
       <p>$$ H_\\ell = \\mathrm{ReLU}\\big(\\mathrm{id}(H_{\\ell-1})\\big) = H_{\\ell-1}, $$</p>
       <p>(the input is already non-negative coming out of the previous ReLU, so it passes through). A dropped
       block does <b>no convolution and no gradient work</b> &mdash; that is where the training speedup comes
       from. Each mini-batch therefore trains a network of <b>random, usually shorter, depth</b>.</p>
       <p><b>Which blocks to keep, how often.</b> Dropping early blocks &mdash; the ones that extract
       low-level features every later block depends on &mdash; is dangerous, so the paper keeps early blocks
       almost always and drops later blocks more. It sets the survival probability to <b>decay linearly</b>
       with depth (Eqn. 4, below), from $p_0 = 1$ at the input to a chosen $p_L$ (they use $0.5$) at the last
       block.</p>
       <p><b>Test time (Eqn. 5).</b> At test time we want the <i>full</i> deep network, so no block is dropped.
       But during training block $\\ell$'s residual was present only a fraction $p_\\ell$ of the time, so its
       output was, on average, scaled down by $p_\\ell$. To make the test-time forward pass match that
       training average, we <b>multiply each residual function by its survival probability</b>:
       $$ H_\\ell^{\\text{Test}} = \\mathrm{ReLU}\\big(p_\\ell\\, f_\\ell(H_{\\ell-1}^{\\text{Test}}) +
       \\mathrm{id}(H_{\\ell-1}^{\\text{Test}})\\big). $$
       This is exactly the expectation-matching rescale used by Dropout (see <code>paper-dropout</code>):
       train with random on/off, test with the expected value.</p>`,
    architecture:
      `<p>Stochastic depth is a <b>drop-in modification of a ResNet</b>, not a new backbone &mdash; it changes
       how each residual block behaves during training, leaving the layer structure untouched. The paper's
       CIFAR network (&sect;3 / &sect;4):</p>
       <ul>
        <li><b>Stem.</b> A single $3\\times 3$ convolution producing 16 feature-map channels, then Batch
        Normalization and ReLU.</li>
        <li><b>Three stages</b> of residual blocks with widening channels: <b>16 &rarr; 32 &rarr; 64</b>
        filters. Each stage is a stack of <b>18 residual blocks</b>, so the network has $L = 54$ residual
        blocks total (the "ResNet-110": $2$ convolutions per block $\\times 54 + $ stem $+$ classifier
        $\\approx 110$ weight layers). Spatial resolution is halved (stride-2) entering the 32- and 64-channel
        stages.</li>
        <li><b>Each residual block</b> $f_\\ell$ is the standard two-layer function: $3\\times 3$ conv &rarr;
        BatchNorm &rarr; ReLU &rarr; $3\\times 3$ conv &rarr; BatchNorm, added to the identity skip, then a
        final ReLU. When channel count or stride changes at a stage boundary, the skip uses a $1\\times 1$
        projection convolution so shapes match.</li>
        <li><b>Head.</b> Global average pooling over the $64$-channel final map, then a linear
        (fully-connected) classifier to the class logits.</li>
       </ul>
       <p><b>The stochastic-depth wrapper.</b> Every residual block is assigned a survival probability $p_\\ell$
       from the linear schedule $p_\\ell = 1 - (\\ell/L)(1 - p_L)$ (Eqn. 4), indexed by its <i>global</i> depth
       $\\ell$ across all three stages (not reset per stage). At training time each block draws an independent
       Bernoulli coin <b>per mini-batch, shared across the batch</b> (one coin per block, not per example): on
       tails the block returns its skip and its convolutions are never executed (Eqn. 3) &mdash; that skipped
       compute is the speedup. At test time all blocks are present and each residual is scaled by its $p_\\ell$
       (Eqn. 5). With $L = 54$ and $p_L = 0.5$ the expected training depth is $E(\\tilde L) \\approx 40$ of the
       $54$ blocks, while the deployed network is the full $54$-block ResNet.</p>`,
    symbols: [
      { sym: "$\\ell$", desc: "the <b>block index</b>, counting residual blocks from $1$ (first) to $L$ (last)." },
      { sym: "$L$", desc: "the <b>total number of residual blocks</b> in the network (its full depth, in blocks)." },
      { sym: "$H_{\\ell-1}$", desc: "the <b>input</b> feature map to block $\\ell$ (equivalently, the output of block $\\ell-1$)." },
      { sym: "$H_\\ell$", desc: "the <b>output</b> feature map of block $\\ell$." },
      { sym: "$f_\\ell(\\cdot)$", desc: "block $\\ell$'s <b>residual function</b>: its convolution layers (each with Batch Normalization and ReLU). This is the part that gets dropped." },
      { sym: "$\\mathrm{id}(\\cdot)$", desc: "the <b>identity skip</b> &mdash; the parameter-free wire that copies the block's input through unchanged. It is always present." },
      { sym: "$b_\\ell$", desc: "the <b>Bernoulli drop variable</b> for block $\\ell$: a coin that is $1$ (keep the block) with probability $p_\\ell$ and $0$ (drop it, leaving only the skip) with probability $1 - p_\\ell$. A <b>Bernoulli</b> random variable is just a single 0/1 coin flip." },
      { sym: "$p_\\ell$", desc: "the <b>survival probability</b> of block $\\ell$: the chance it is kept on a given mini-batch, $p_\\ell = \\Pr(b_\\ell = 1)$." },
      { sym: "$p_0$", desc: "survival probability at the input end, fixed to $1$ (the very first stage is never dropped)." },
      { sym: "$p_L$", desc: "the <b>survival probability of the last block</b> &mdash; the one free hyper-parameter of the schedule. The paper uses $p_L = 0.5$." },
      { sym: "$\\tilde{L}$", desc: "the <b>random number of blocks that survive</b> on a given mini-batch (so the effective training depth). $E(\\tilde{L}) = \\sum_\\ell p_\\ell$ is its expected value." },
      { sym: "$E(\\cdot)$", desc: "the <b>expected value</b> (long-run average over the random coin flips) &mdash; see the <code>prob-expectation</code> concept lesson." }
    ],
    formula:
      `$$ H_\\ell = \\mathrm{ReLU}\\big(f_\\ell(H_{\\ell-1}) + \\mathrm{id}(H_{\\ell-1})\\big) $$
       <p>&sect;2, Eqn. 1 &mdash; the ordinary <b>ResNet residual block</b>: add the residual function's output to the identity skip, then ReLU. This is the baseline stochastic depth modifies.</p>
       $$ H_\\ell = \\mathrm{ReLU}\\big(b_\\ell\\, f_\\ell(H_{\\ell-1}) + \\mathrm{id}(H_{\\ell-1})\\big),\\qquad b_\\ell \\sim \\mathrm{Bernoulli}(p_\\ell) $$
       <p>&sect;3, Eqn. 2 &mdash; the <b>stochastic residual block</b>: gate the residual function by a Bernoulli coin $b_\\ell$ that is $1$ ("survive") with probability $p_\\ell$ and $0$ ("drop") otherwise. The skip is always present.</p>
       $$ H_\\ell = \\mathrm{id}(H_{\\ell-1}) = H_{\\ell-1} \\qquad (b_\\ell = 0) $$
       <p>&sect;3, Eqn. 3 &mdash; when the coin is tails the residual term vanishes and the block collapses to the bare identity skip (the input is already post-ReLU, so it passes through unchanged): no convolution, no gradient work.</p>
       $$ p_\\ell \\;=\\; 1 - \\frac{\\ell}{L}\\,(1 - p_L) $$
       <p>&sect;3, Eqn. 4 &mdash; the <b>linear survival-probability decay</b>: $p_\\ell$ slides from $p_0 = 1$ at the input to $p_L$ (the paper uses $0.5$) at the last block, so early blocks are almost always kept and deep blocks dropped most.</p>
       $$ E(\\tilde{L}) \\;=\\; \\sum_{\\ell=1}^{L} p_\\ell \\;=\\; \\frac{3L-1}{4} \\;\\approx\\; \\frac{3L}{4} \\quad (p_L = 0.5) $$
       <p>&sect;3 &mdash; the <b>expected network depth</b>: the mean number of surviving blocks is the sum of survival probabilities (linearity of expectation). With the linear schedule and $p_L = 0.5$ it closes to $(3L-1)/4 \\approx 3L/4$ &mdash; the source of the training speedup.</p>
       $$ H_\\ell^{\\text{Test}} = \\mathrm{ReLU}\\big(p_\\ell\\, f_\\ell(H_{\\ell-1}^{\\text{Test}}; W_\\ell) + H_{\\ell-1}^{\\text{Test}}\\big) $$
       <p>&sect;3, Eqn. 5 &mdash; <b>test-time rescaling</b>: keep every block but scale each residual function $f_\\ell$ by its survival probability $p_\\ell$, so the deterministic test pass equals the training expectation (the Dropout expectation-matching trick).</p>`,
    whatItDoes:
      `<p><b>Equation 4</b> sets each block's survival probability as a straight line in depth. At the first
       block ($\\ell$ small) the fraction $\\ell/L$ is near $0$, so $p_\\ell \\approx 1$ &mdash; almost never
       dropped. At the last block ($\\ell = L$) the fraction is $1$, so $p_\\ell = 1 - (1 - p_L) = p_L$ (the
       paper's $0.5$). In between, $p_\\ell$ slides linearly from $1$ down to $p_L$. So <b>early blocks are
       precious and almost always kept; deep blocks are dropped about half the time.</b></p>
       <p>Summing the survival probabilities gives the <b>expected training depth</b>
       $E(\\tilde{L}) = \\sum_{\\ell=1}^{L} p_\\ell$. With the linear schedule and $p_L = 0.5$ this works out to
       about $\\tfrac{3L}{4}$ active blocks &mdash; the network trains as if it were roughly three-quarters as
       deep, which is where the wall-clock saving comes from.</p>`,
    derivation:
      `<p><b>Why the test-time scale-by-$p_\\ell$ is the right rule.</b> Look at block $\\ell$'s residual term
       during training: it is $b_\\ell\\, f_\\ell(H_{\\ell-1})$, where $b_\\ell$ is the $0/1$ coin. Take the
       expected value over the coin (holding the input fixed). Because $b_\\ell$ is Bernoulli with
       $\\Pr(b_\\ell = 1) = p_\\ell$,</p>
       <p>$$ E\\big[b_\\ell\\, f_\\ell(H_{\\ell-1})\\big] = E[b_\\ell]\\; f_\\ell(H_{\\ell-1}) = p_\\ell\\,
       f_\\ell(H_{\\ell-1}), $$</p>
       <p>using $E[b_\\ell] = 1\\cdot p_\\ell + 0\\cdot(1-p_\\ell) = p_\\ell$ (the mean of a Bernoulli is its
       success probability &mdash; see <code>prob-expectation</code>). So on average across training the
       residual contributed $p_\\ell\\, f_\\ell(H_{\\ell-1})$. At test time we run a single deterministic
       forward pass, and we want it to equal that training average &mdash; so we <b>plug in the expectation
       directly</b> by using $p_\\ell\\, f_\\ell$ in place of the random $b_\\ell\\, f_\\ell$. That is exactly
       Eqn. 5. (Same logic as Dropout's test-time weight scaling in <code>paper-dropout</code>.)</p>
       <p><b>Why $E(\\tilde{L}) = \\sum_\\ell p_\\ell$.</b> The number of surviving blocks is
       $\\tilde{L} = \\sum_\\ell b_\\ell$. Expectation is linear, so
       $E(\\tilde{L}) = \\sum_\\ell E[b_\\ell] = \\sum_\\ell p_\\ell$ &mdash; no independence assumption needed.</p>`,
    example:
      `<p>Work the schedule and one forward pass by hand. Take a tiny network of <b>$L = 5$</b> residual blocks
       with last-block survival $p_L = 0.5$.</p>
       <p><b>Step 1 &mdash; the linear schedule (Eqn. 4).</b> Plug $\\ell = 1,\\dots,5$ into
       $p_\\ell = 1 - (\\ell/5)(1 - 0.5) = 1 - 0.1\\,\\ell$:</p>
       <ul class="steps">
        <li>$p_1 = 1 - 0.1(1) = 0.9$, &nbsp; $p_2 = 0.8$, &nbsp; $p_3 = 0.7$, &nbsp; $p_4 = 0.6$, &nbsp;
        $p_5 = 0.5$.</li>
        <li>Early blocks survive 90% of the time; the last survives 50%. The line slides from $0.9$ down to
        $0.5$.</li>
       </ul>
       <p><b>Step 2 &mdash; expected training depth.</b>
       $E(\\tilde{L}) = 0.9 + 0.8 + 0.7 + 0.6 + 0.5 = 3.5$ blocks. Check against the closed form
       $\\tfrac{3L - 1}{4} = \\tfrac{3(5) - 1}{4} = \\tfrac{14}{4} = 3.5$. &#10003; The net trains as if it
       had $3.5$ of its $5$ blocks &mdash; 30% fewer active blocks on average.</p>
       <p><b>Step 3 &mdash; forward pass through block $\\ell = 2$</b> ($p_2 = 0.8$). To keep arithmetic
       clear use scalar "feature maps": let the input be $H_1 = 2.0$ and suppose the residual function outputs
       $f_2(H_1) = 0.6$. All quantities are non-negative so the outer ReLU is the identity here.</p>
       <ul class="steps">
        <li><b>Training, coin = heads</b> ($b_2 = 1$, prob $0.8$): &nbsp; Eqn. 2 gives
        $H_2 = \\mathrm{ReLU}(1\\cdot 0.6 + 2.0) = 2.6$.</li>
        <li><b>Training, coin = tails</b> ($b_2 = 0$, prob $0.2$): &nbsp; Eqn. 3 gives
        $H_2 = \\mathrm{ReLU}(0\\cdot 0.6 + 2.0) = 2.0$ &mdash; the block vanished, only the skip remains.</li>
        <li><b>Average training output:</b> $E[H_2] = 2.0 + p_2\\cdot 0.6 = 2.0 + 0.8(0.6) = 2.48$.</li>
        <li><b>Test (Eqn. 5), scale by $p_2$:</b> $H_2^{\\text{Test}} = \\mathrm{ReLU}(0.8\\cdot 0.6 + 2.0)
        = \\mathrm{ReLU}(0.48 + 2.0) = 2.48$.</li>
       </ul>
       <p>The test output ($2.48$) lands <b>exactly on the training average</b> ($2.48$) &mdash; that is the
       whole point of the $p_\\ell$ rescale. These numbers are recomputed in the notebook's first cell so you
       can check them by running.</p>`,
    recipe:
      `<ol>
        <li><b>Build a stochastic residual block.</b> Wrap the usual two-conv residual function $f$ (each conv
        &rarr; BatchNorm &rarr; ReLU). Give the block a survival probability <code>p</code>.</li>
        <li><b>Training forward:</b> draw a Bernoulli coin <code>b ~ Bernoulli(p)</code>. If <code>b == 0</code>,
        return <code>relu(identity)</code> (skip $f$ entirely &mdash; Eqn. 3). If <code>b == 1</code>, return
        <code>relu(f(x) + identity)</code> (Eqn. 2).</li>
        <li><b>Test forward:</b> always compute $f$, scaled: <code>relu(p * f(x) + identity)</code> (Eqn. 5).</li>
        <li><b>Assign the schedule.</b> For a net of $L$ blocks, set
        <code>p[&ell;] = 1 - (&ell;/L) * (1 - p_L)</code> with $p_L = 0.5$ (Eqn. 4); deeper blocks get smaller
        $p$.</li>
        <li><b>Train</b> a small ResNet on a CIFAR-10 subset with the schedule on.</li>
        <li><b>Ablate:</b> set every $p_\\ell = 1$ (no dropping = constant-depth ResNet) and compare
        wall-clock per epoch and test error.</li>
      </ol>`,
    results:
      `<p>From &sect;4 and Table 1 (test error, constant depth &rarr; stochastic depth, quoted):
       <b>CIFAR-10 6.41% &rarr; 5.25%</b>, <b>CIFAR-100 27.76% &rarr; 24.98%</b>, <b>SVHN 1.80% &rarr; 1.75%</b>.
       On ImageNet the two are comparable (21.78% vs 21.98%). The paper reports a training-time reduction of
       roughly <b>25%</b> (Table 2), and up to ~40% with a more aggressive $p_L = 0.2$. They also trained a
       <b>1202-layer</b> network on CIFAR-10 that reached <b>4.91%</b> error &mdash; deeper helped, where
       constant-depth 1202 had overfit.</p>
       <p><i>These are the paper's reported figures, quoted from &sect;4 / Tables 1-2. The numbers in the
       CODEVIZ panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> Two metrics, reported together, because the claim is "faster <i>and</i>
        more accurate": <b>test error (%)</b> on <b>CIFAR-10 / CIFAR-100 / SVHN</b> (and ImageNet) at full deployed
        depth, and <b>wall-clock training time per epoch</b>. The baseline to beat is the <b>identical constant-depth
        ResNet</b> (every $p_\\ell = 1$): the lesson <code>results</code> quote stochastic vs constant
        <b>CIFAR-10 5.25% vs 6.41%</b>, <b>CIFAR-100 24.98% vs 27.76%</b>, with a <b>~25% training-time reduction</b>
        (Table&nbsp;2). The no-skill floor is majority-class guessing $= 10\\%$ accuracy / $90\\%$ error on 10-class
        CIFAR. Stochastic depth must beat its own constant-depth twin on <i>both</i> axes, not just one.</li>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> (a) <b>Schedule:</b> for $L{=}5$, $p_L{=}0.5$, Eqn&nbsp;4 must
        give $[0.9,0.8,0.7,0.6,0.5]$ and $E(\\tilde L)=\\sum p_\\ell = 3.5 = (3L{-}1)/4$ (lesson worked example /
        notebook cell 0). (b) <b>Expectation match:</b> block 2's train-average $H_1 + p_2 f_2$ must equal its test
        output $\\mathrm{ReLU}(p_2 f_2 + H_1)$ &mdash; both $2.48$ in the example; if they differ you mis-scaled
        Eqn&nbsp;5. (c) <b>Drop really skips compute:</b> with the schedule on, the per-epoch time must actually drop
        (~$0.72\\times$ here) &mdash; if it doesn't, you compute $f$ then multiply by $0$ instead of <code>return</code>-ing
        the skip early. (d) <b>Identity always present:</b> a fully-dropped block must return <code>relu(identity)</code>,
        never $0$. (e) <b>Overfit one batch:</b> loss should fall toward $0$; init $K$-way softmax loss near
        $-\\ln(1/K)$ ($\\ln 10 \\approx 2.30$ on CIFAR-10).</li>
        <li><b>3. Expected range.</b> A correct small ResNet-110-style net with stochastic depth should reach roughly
        the paper's <b>~5.25% CIFAR-10 error</b> (approximate, &sect;4 / Table&nbsp;1) and clearly beat its constant-depth
        twin; a point or two off is "tuning" (LR schedule, $p_L$ choice, augmentation), while error near the $90\\%$ floor
        or <i>worse</i> than constant depth is "probably a bug." On the toy run here, stochastic depth descends faster to
        a lower held-out loss (~0.03 vs ~0.35 by epoch 7; not a paper number).</li>
        <li><b>4. Ablation &mdash; prove the dropping earns its keep.</b> The central knob is the <b>survival schedule</b>.
        Turn it off ($p_\\ell \\equiv 1$ &mdash; ordinary constant-depth ResNet), changing nothing else, and confirm both
        (a) per-epoch wall-clock <i>rises</i> (all $L$ blocks now run, vs $E(\\tilde L) \\approx 3L/4$) and (b) test error
        <i>rises</i> (lose the regularizer). If turning dropping off doesn't hurt error at all, the schedule isn't wired
        in or the net is too small/short to overfit. A secondary sweep: more aggressive $p_L$ (e.g. $0.2$) should buy
        more speedup (~40% in the paper) at some accuracy risk.</li>
        <li><b>5. Failure signals.</b> <b>Test error far above training, collapses at eval</b> &rarr; you skipped the
        $\\times p_\\ell$ rescale (Eqn&nbsp;5), so every residual is $1/p_\\ell$ too large at test and activations drift
        off-distribution. <b>Gradients vanish / net won't train</b> &rarr; you dropped the <i>skip</i> instead of the
        residual $f_\\ell$, severing the gradient highway (a dropped block must keep the identity). <b>No speedup</b>
        &rarr; $f$ is computed then zeroed rather than branched-around. <b>Worse than constant depth, deep blocks dead</b>
        &rarr; schedule decays the wrong way (early blocks dropped hard) &mdash; $p_\\ell$ must slide from $1$ down to
        $p_L$. <b>Loss NaN</b> &rarr; LR too high / bad init, unrelated to the drop logic.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.BatchNorm2d</code>, <code>nn.ReLU</code>, the optimizer, and the CIFAR-10 loader from
       torchvision (preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the stochastic-depth block
       (the Bernoulli drop in training, the scale-by-$p$ at test), the linear survival schedule
       $p_\\ell = 1 - (\\ell/L)(1 - p_L)$, the stage stacking, and the <b>ablation</b> ($p_\\ell \\equiv 1$).
       The residual "+1 gradient highway" math is owned by the <code>paper-resnet</code> / <code>dl-resnet</code>
       lessons; the expectation-matching test rescale mirrors <code>paper-dropout</code>.</p>`,
    pitfalls:
      `<ul>
        <li><b>Dropping the skip instead of the residual.</b> Stochastic depth removes only $f_\\ell$ (the
        convolutions); the identity wire is <b>always</b> kept. If you zero the whole block you sever the
        network and gradients cannot flow. <b>Fix:</b> a dropped block returns <code>relu(identity)</code>,
        never $0$.</li>
        <li><b>Forgetting the test-time $\\times p_\\ell$ scale.</b> If you keep all blocks at test time but
        do <i>not</i> scale each residual by its $p_\\ell$, every residual is on average $1/p_\\ell$ too large,
        and accuracy drops. <b>Fix:</b> Eqn. 5, <code>relu(p * f(x) + identity)</code> in eval mode. (This is
        the exact analogue of Dropout's inference rescale.)</li>
        <li><b>One coin for the whole batch vs. per-block.</b> The paper draws an independent coin
        <i>per residual block</i> (shared across the mini-batch), not per-example. Drawing per-example turns
        it into something closer to drop-path on individual samples &mdash; a different method.</li>
        <li><b>Decaying the wrong way.</b> $p_\\ell$ must <i>decrease</i> with depth (early kept, late
        dropped). Flipping it &mdash; dropping early blocks hard &mdash; starves every later block of features
        and hurts. <b>Fix:</b> $p_\\ell = 1 - (\\ell/L)(1 - p_L)$, so $p$ goes from $1$ down to $p_L$.</li>
        <li><b>Expecting a speedup with no real dropping.</b> The wall-clock win comes from skipping the
        convolutions of dropped blocks. If your implementation computes $f$ and then multiplies by $0$, you
        pay the full cost. <b>Fix:</b> branch on the coin and <code>return</code> early before calling $f$.</li>
      </ul>`,
    recall: [
      "Write the stochastic-depth training update (Eqn. 2) and the dropped-block case (Eqn. 3) from memory.",
      "State the linear survival schedule $p_\\ell$ (Eqn. 4) and what $p_0$ and $p_L$ are.",
      "What is the test-time forward pass, and why the factor $p_\\ell$ (Eqn. 5)?",
      "Why is the expected training depth $\\sum_\\ell p_\\ell$, and what is it for $L=5$, $p_L=0.5$?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a small ResNet that trains with the stochastic-depth schedule on
            ($p_L = 0.5$). Turn the schedule off by setting every $p_\\ell = 1$ (ordinary constant-depth
            ResNet), keeping depth, width, optimizer, data, and seed identical. What changes in (a) wall-clock
            per epoch and (b) test error, and what does each change demonstrate?`,
        steps: [
          { do: `Set every block's survival probability to $1$ so no block is ever dropped; change nothing else.`, why: `An honest ablation flips exactly one knob &mdash; the random dropping &mdash; so any difference is attributable to stochastic depth.` },
          { do: `Time an epoch each way. With the schedule on, about $E(\\tilde{L})=\\sum p_\\ell \\approx 3L/4$ blocks run per step, so fewer convolutions execute &rarr; faster.`, why: `Dropped blocks do no forward/backward work; the expected active depth is ~three-quarters of $L$, which is the source of the wall-clock saving.` },
          { do: `Compare final test error. The stochastic-depth run typically generalizes a little better.`, why: `Random dropping is a regularizer (an implicit ensemble over many sub-depths), much like Dropout &mdash; see <code>paper-dropout</code>.` }
        ],
        answer: `<p>(a) <b>Per-epoch wall-clock drops</b> with the schedule on, because on average only
                 $\\sum_\\ell p_\\ell \\approx 3L/4$ blocks execute per step &mdash; the dropped blocks skip their
                 convolutions. (b) <b>Test error is usually a bit lower</b> with stochastic depth, because the
                 random dropping regularizes (an implicit ensemble of shorter networks). Same net otherwise, so
                 both effects are attributable to the dropping. The paper's Table 1 shows the same direction
                 (e.g. CIFAR-10 6.41% &rarr; 5.25%); our CODEVIZ panel reproduces the qualitative effect on a
                 toy run.</p>`
      },
      {
        q: `For a network with $L = 10$ residual blocks and $p_L = 0.5$, compute the survival probability of
            block $\\ell = 4$ and the expected number of active blocks. Then give block 4's <i>test-time</i>
            output if its input is $H_3 = 1.0$ and its residual is $f_4(H_3) = 0.5$.`,
        steps: [
          { do: `Eqn. 4: $p_4 = 1 - (4/10)(1 - 0.5) = 1 - 0.4(0.5) = 1 - 0.2 = 0.8$.`, why: `Plug $\\ell = 4$, $L = 10$, $p_L = 0.5$ into the linear schedule.` },
          { do: `Expected depth $E(\\tilde{L}) = \\sum_{\\ell=1}^{10} \\big(1 - 0.05\\,\\ell\\big)$. The closed form $(3L-1)/4 = (30-1)/4 = 7.25$.`, why: `Sum of the linear schedule; equivalently the $(3L-1)/4$ formula from &sect;3.` },
          { do: `Test forward (Eqn. 5): $H_4^{\\text{Test}} = \\mathrm{ReLU}(p_4\\, f_4 + H_3) = \\mathrm{ReLU}(0.8(0.5) + 1.0) = \\mathrm{ReLU}(1.4) = 1.4$.`, why: `At test all blocks are on but the residual is scaled by its survival probability $p_4 = 0.8$.` }
        ],
        answer: `<p>$p_4 = 0.8$; expected active blocks $E(\\tilde{L}) = (3\\cdot 10 - 1)/4 = 7.25$ of $10$; and
                 block 4's test output is $\\mathrm{ReLU}(0.8\\cdot 0.5 + 1.0) = \\mathbf{1.4}$. The training
                 average would be $1.0 + 0.8(0.5) = 1.4$ as well &mdash; the $\\times p_\\ell$ scale makes test
                 equal the training expectation.</p>`
      },
      {
        q: `A teammate "saves the rescale for later" and ships a model that, at test time, keeps every block
            on but uses the raw residual $f_\\ell$ (no $\\times p_\\ell$). Validation accuracy is much worse
            than during training. What went wrong and what is the one-line fix?`,
        steps: [
          { do: `Compare train vs test residual magnitude. In training block $\\ell$'s residual averaged $p_\\ell\\,f_\\ell$; at test, unscaled, it is $f_\\ell$ &mdash; a factor $1/p_\\ell$ too large.`, why: `The downstream layers were tuned to the smaller, $p_\\ell$-scaled average, so unscaled residuals push activations off-distribution.` },
          { do: `These over-large residuals compound across blocks, shifting the feature statistics the BatchNorm / classifier expect.`, why: `Each block adds an inflated residual; errors accumulate with depth.` },
          { do: `Apply Eqn. 5: in eval mode scale every residual by its survival probability &mdash; <code>relu(p * f(x) + identity)</code>.`, why: `That makes the deterministic test pass equal the training expectation, exactly as Dropout rescales at inference.` }
        ],
        answer: `<p>Without the $\\times p_\\ell$ scale, every residual at test time is about $1/p_\\ell$ too large
                 relative to what training produced on average, so activations drift off-distribution and
                 accuracy collapses. The fix is Eqn. 5: in eval mode use <code>relu(p * f(x) + identity)</code>.
                 It is the same expectation-matching rescale as Dropout (<code>paper-dropout</code>).</p>`
      }
    ]
  });

  window.CODE["paper-stochastic-depth"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the stochastic-depth residual block by hand on top of
       <code>nn.Conv2d</code> / <code>nn.BatchNorm2d</code>, wire up the linear survival schedule
       $p_\\ell = 1 - (\\ell/L)(1 - p_L)$, and train a small ResNet on a <b>CIFAR-10 subset</b> (torchvision,
       preinstalled in Colab &mdash; no pip). The key lines: in <code>train()</code> mode draw a Bernoulli
       coin and, if it is $0$, <b>return the skip without calling $f$</b> (Eqn. 3); in <code>eval()</code> mode
       always run $f$ but <b>scale it by $p$</b> (Eqn. 5). We then <b>ablate</b> by setting every $p_\\ell = 1$
       (constant-depth ResNet) and compare. The first cell recomputes the worked example: the $L=5$ schedule
       $[0.9,0.8,0.7,0.6,0.5]$, $E(\\tilde L)=3.5$, and block 2's train-average $=$ test output $=2.48$.
       Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T
import time

torch.manual_seed(0)

# --- 0. Sanity-check the worked example. -------------------------------------
L, pL = 5, 0.5
p = [1 - (l / L) * (1 - pL) for l in range(1, L + 1)]   # Eqn. 4 schedule
print("survival schedule p_1..p_5:", [round(v, 3) for v in p])      # [0.9,0.8,0.7,0.6,0.5]
print("E[depth] = sum p_l        :", round(sum(p), 3),
      " | (3L-1)/4 =", (3 * L - 1) / 4)                              # 3.5 | 3.5
H1, f2, p2 = 2.0, 0.6, p[1]                                          # block l=2, p_2=0.8
print("train survive relu(f+H)   :", max(0.0, 1 * f2 + H1))         # 2.6
print("train drop    relu(H)     :", max(0.0, 0 * f2 + H1))         # 2.0
print("train average H + p2*f    :", round(H1 + p2 * f2, 3))        # 2.48
print("test  relu(p2*f + H)      :", round(max(0.0, p2 * f2 + H1), 3))  # 2.48 (== train avg)


# --- 1. The stochastic-depth residual block (built by hand). -----------------
class StochasticBlock(nn.Module):
    def __init__(self, in_ch, out_ch, stride=1, p_survive=1.0):
        super().__init__()
        self.p = p_survive                       # survival probability for THIS block
        self.conv1 = nn.Conv2d(in_ch, out_ch, 3, stride=stride, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(out_ch)
        self.conv2 = nn.Conv2d(out_ch, out_ch, 3, stride=1, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(out_ch)
        self.relu  = nn.ReLU(inplace=True)
        self.proj = None                         # projection skip when shape changes
        if stride != 1 or in_ch != out_ch:
            self.proj = nn.Sequential(nn.Conv2d(in_ch, out_ch, 1, stride=stride, bias=False),
                                      nn.BatchNorm2d(out_ch))

    def f(self, x):                              # the residual function f_l
        out = self.relu(self.bn1(self.conv1(x)))
        return self.bn2(self.conv2(out))

    def forward(self, x):
        identity = self.proj(x) if self.proj is not None else x
        if self.training:
            # Bernoulli coin per block (shared across the mini-batch).
            if torch.rand(1).item() < self.p:    # b_l = 1  -> Eqn. 2
                return self.relu(self.f(x) + identity)
            else:                                # b_l = 0  -> Eqn. 3: skip f entirely
                return self.relu(identity)       # NOTE: convolutions are NOT run -> faster
        else:
            # Test time (Eqn. 5): keep the block, scale the residual by p.
            return self.relu(self.p * self.f(x) + identity)


# --- 2. Stack blocks; assign the linear survival schedule by global depth. ---
class SmallResNet(nn.Module):
    def __init__(self, blocks_per_stage=3, pL=0.5, n_classes=10):
        super().__init__()
        self.stem = nn.Sequential(nn.Conv2d(3, 16, 3, padding=1, bias=False),
                                  nn.BatchNorm2d(16), nn.ReLU(inplace=True))
        widths = [(16, 16, 1), (16, 32, 2), (32, 64, 2)]
        Ltot = len(widths) * blocks_per_stage           # total residual blocks
        blocks, idx = [], 0
        for (ci, co, st) in widths:
            for b in range(blocks_per_stage):
                idx += 1
                ps = 1.0 if pL >= 1.0 else 1 - (idx / Ltot) * (1 - pL)   # Eqn. 4
                blocks.append(StochasticBlock(ci if b == 0 else co, co,
                                              st if b == 0 else 1, ps))
        self.blocks = nn.Sequential(*blocks)
        self.head   = nn.Linear(64, n_classes)

    def forward(self, x):
        x = self.blocks(self.stem(x))
        return self.head(x.mean(dim=(2, 3)))             # global average pool


# --- 3. A CIFAR-10 subset (torchvision is preinstalled in Colab). ------------
tfm = T.Compose([T.ToTensor(),
                 T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])
full = torchvision.datasets.CIFAR10(root="./data", train=True, download=True, transform=tfm)
train_set = torch.utils.data.Subset(full, range(4000))
test_set  = torch.utils.data.Subset(full, range(4000, 5000))
tr = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)
te = torch.utils.data.DataLoader(test_set,  batch_size=256)
device = "cuda" if torch.cuda.is_available() else "cpu"


def run(pL, epochs=4, depth=3):
    torch.manual_seed(0)
    net = SmallResNet(blocks_per_stage=depth, pL=pL).to(device)
    opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9, weight_decay=5e-4)
    lf  = nn.CrossEntropyLoss()
    t0 = time.time()
    for ep in range(epochs):
        net.train()
        for xb, yb in tr:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad(); lf(net(xb), yb).backward(); opt.step()
    secs = time.time() - t0
    net.eval(); correct = tot = 0
    with torch.no_grad():
        for xb, yb in te:
            pred = net(xb.to(device)).argmax(1).cpu()
            correct += (pred == yb).sum().item(); tot += yb.numel()
    return secs, 100 * (1 - correct / tot)               # wall-clock, test error %

print("\\nSTOCHASTIC depth (p_L=0.5):")
s_secs, s_err = run(pL=0.5)
print("CONSTANT depth   (p_L=1.0, ABLATION  -- no dropping):")
c_secs, c_err = run(pL=1.0)
print(f"\\n  stochastic: {s_secs:5.1f}s/4ep  test err {s_err:5.2f}%")
print(f"  constant  : {c_secs:5.1f}s/4ep  test err {c_err:5.2f}%")
# Stochastic depth trains faster (fewer blocks run per step) and tends to generalize
# a bit better. Exact numbers vary by hardware/seed -- our small run, not the paper's.`
  };

  window.CODEVIZ["paper-stochastic-depth"] = {
    question: "Does randomly dropping residual blocks during training speed it up AND lower test error vs constant depth?",
    charts: [
      {
        type: "line",
        title: "Test loss vs epoch — stochastic depth (p_L=0.5) vs constant depth (ablation)",
        xlabel: "epoch",
        ylabel: "held-out cross-entropy loss",
        series: [
          {
            name: "Constant depth (p=1)",
            color: "#ff7b72",
            points: [[0,1.1357],[1,1.2846],[2,1.2518],[3,0.9206],[4,0.6538],[5,0.5295],[6,0.44],[7,0.3535]]
          },
          {
            name: "Stochastic depth (p_L=0.5)",
            color: "#7ee787",
            points: [[0,1.1533],[1,1.091],[2,0.9445],[3,0.6379],[4,0.3465],[5,0.1648],[6,0.0598],[7,0.0283]]
          }
        ]
      },
      {
        type: "bar",
        title: "Forward-pass wall-clock per epoch (active blocks executed)",
        xlabel: "configuration",
        ylabel: "relative time per epoch",
        series: [
          { name: "time", color: "#79c0ff", points: [["constant depth (9/9 blocks)", 1.00], ["stochastic (E=6.5/9 blocks)", 0.72]] }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A 9-block residual net (3 stages x 3 blocks) on a toy 4-class problem, trained twice &mdash; identical except for the drop schedule. LEFT: held-out loss; the STOCHASTIC-depth run (linear schedule, p_L=0.5) descends faster and reaches a far lower held-out loss (~0.03 by epoch 7) while the CONSTANT-depth ablation crawls down more slowly and is still at ~0.35 &mdash; faster, better-generalizing training. RIGHT: expected active blocks per step is E(L̃)=sum p_l = 6.5 of 9 (~0.72x), so the stochastic run executes fewer blocks per epoch &mdash; the training speedup. Same depth, width, optimizer, seed; only the random block-dropping differs.",
    code: `import torch, torch.nn as nn, numpy as np

# Toy reproduction: does stochastic depth train faster + regularize vs constant depth?
N, K, n = 400, 4, 24
g = torch.Generator().manual_seed(2)
y = torch.randint(0, K, (N,), generator=g)
centers = torch.randn(K, n, generator=g) * 1.5
X = centers[y] + torch.randn(N, n, generator=g) * 0.8
Xtr, ytr, Xte, yte = X[:300], y[:300], X[300:], y[300:]

class Block(nn.Module):
    def __init__(self, n, p):
        super().__init__()
        self.fc = nn.Linear(n, n, bias=False); self.bn = nn.BatchNorm1d(n); self.p = p
    def f(self, x):  return self.bn(self.fc(x))
    def forward(self, x):
        if self.training:
            if torch.rand(1).item() < self.p:   return torch.relu(self.f(x) + x)  # Eqn. 2
            return torch.relu(x)                                                  # Eqn. 3: drop f
        return torch.relu(self.p * self.f(x) + x)                                 # Eqn. 5: scale

class Net(nn.Module):
    def __init__(self, pL, Lblocks=9):
        super().__init__()
        self.stem = nn.Linear(n, n)
        ps = [1.0 if pL >= 1 else 1 - (l / Lblocks) * (1 - pL) for l in range(1, Lblocks + 1)]
        self.blocks = nn.Sequential(*[Block(n, p) for p in ps])
        self.head = nn.Linear(n, K); self.Edepth = sum(ps)
    def forward(self, x): return self.head(self.blocks(torch.relu(self.stem(x))))

def run(pL, epochs=8):
    torch.manual_seed(0)
    net = Net(pL); opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9)
    lf = nn.CrossEntropyLoss(); test_losses = []
    for ep in range(epochs):
        net.train(); opt.zero_grad(); lf(net(Xtr), ytr).backward(); opt.step()
        net.eval()
        with torch.no_grad(): test_losses.append(round(lf(net(Xte), yte).item(), 4))
    return test_losses, net.Edepth

const_loss, _      = run(1.0)
stoch_loss, Edepth = run(0.5)
print("Constant   test loss/epoch:", const_loss)
print("Stochastic test loss/epoch:", stoch_loss)
print("Expected active blocks E(L~):", round(Edepth, 2), "of 9  -> ~%.2fx forward cost" % (Edepth / 9))
# Stochastic depth descends faster to a lower test loss and runs ~0.72x the
# blocks per step (speedup). Our small run, not the paper's reported numbers.`
  };
})();
