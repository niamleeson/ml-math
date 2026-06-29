/* Paper lesson — "Learning both Weights and Connections for Efficient Neural Networks"
   (Han, Pool, Tran, Dally, NIPS 2015). Self-contained: lesson + CODE + CODEVIZ merged by id
   "paper-pruning".
   GROUNDED from arXiv:1506.02626 (abstract) and the ar5iv HTML mirror (Sections 3, 3.1-3.5, 4).
   Track B (architecture): compose with torch.nn; implement the novel part by hand — magnitude-based
   weight pruning (mask weights below a threshold) followed by retraining the surviving weights.
   Ablation: prune-without-retrain vs prune-then-retrain. All CODEVIZ numbers are from our own small
   run, not the paper's reported figures. */
(function () {
  window.LESSONS.push({
    id: "paper-pruning",
    title: "Pruning — Learning both Weights and Connections for Efficient Neural Networks (2015)",
    tagline: "Delete the small-magnitude weights of a trained net, then retrain the survivors — shrink the model an order of magnitude with no accuracy loss.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Song Han, Jeff Pool, John Tran, William J. Dally",
      org: "Stanford University / NVIDIA",
      year: 2015,
      venue: "arXiv:1506.02626 (Jun 2015); NIPS 2015",
      citations: "",
      arxiv: "https://arxiv.org/abs/1506.02626",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-neuron", "dl-backprop", "pt-nn-module", "pt-training-loop", "pt-loss-optim", "pt-regularization"],

    // WHY READ IT
    problem:
      `<p>By 2015 the best image networks had tens of millions of weights. A <b>weight</b> is one learnable
       number on a connection between two neurons. AlexNet had about 61 million of them; VGG-16 about 138
       million. That is a lot of memory and a lot of multiply-add operations. The paper's opening worry is
       deployment: such models are "both computationally intensive and memory intensive, making them
       difficult to deploy on embedded systems" (Abstract). A phone or a sensor has little memory and a tight
       power budget.</p>
       <p>There is a second, sharper point. A normal network "fixes the architecture before training starts;
       as a result, training cannot improve the architecture" (Abstract). You pick the number of connections
       up front, and you are stuck with all of them &mdash; even the ones that end up contributing almost
       nothing. The paper asks: which connections actually matter, and can we throw the rest away?</p>`,
    contribution:
      `<ul>
        <li><b>Magnitude-based weight pruning.</b> After a network is trained, look at each weight's absolute
        value. Connections whose weight is small in size barely affect the output, so remove them: "All
        connections with weights below a threshold are removed from the network &mdash; converting a dense
        network into a sparse network" (&sect;3).</li>
        <li><b>The three-step recipe: train &rarr; prune &rarr; retrain.</b> "First, we train the network to
        learn which connections are important. Next, we prune the unimportant connections. Finally, we retrain
        the network to fine tune the weights of the remaining connections" (Abstract). The retrain step is the
        part people forget &mdash; and it is what makes high pruning safe.</li>
        <li><b>Iterative pruning.</b> Repeating prune-then-retrain several times reaches far higher sparsity
        than one aggressive cut: it "can boost pruning rate from 5&times; to 9&times; on AlexNet compared with
        single-step aggressive pruning" (&sect;3.4).</li>
       </ul>`,
    whyItMattered:
      `<p>This paper started the modern <b>model-compression</b> line of work. The reported headline: AlexNet
       shrank 9&times; (61M &rarr; 6.7M weights) and VGG-16 shrank 13&times; (138M &rarr; 10.3M) "without
       affecting their accuracy" (Abstract, Table 1). The same authors' follow-up, <b>Deep Compression</b>,
       stacked pruning with weight-sharing and Huffman coding for even larger savings. The core idea
       &mdash; trained nets are hugely over-parameterized, and most weights can be deleted if you fine-tune
       the rest &mdash; later seeded the "Lottery Ticket Hypothesis" and a whole sub-field of sparse and
       efficient networks.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Learning Connections in Addition to Weights)</b> &mdash; the three-step loop and the
        one sentence that defines pruning: connections below a threshold are removed.</li>
        <li><b>&sect;3.1 (Regularization)</b> &mdash; why <b>L2</b> regularization (a penalty on the sum of
        squared weights) gives the best pruned-and-retrained result.</li>
        <li><b>&sect;3.3 (Local Pruning and Parameter Co-adaptation)</b> &mdash; the rule that you must
        <i>keep the surviving weights</i> and fine-tune them, not re-initialize from scratch.</li>
        <li><b>&sect;3.4 (Iterative Pruning)</b> &mdash; repeat prune+retrain to push sparsity higher.</li>
        <li><b>&sect;4 + Figures 5/6</b> &mdash; the accuracy-vs-pruning curves. Look for the gap between
        "with retraining" and "without retraining": without retraining, accuracy falls much sooner.</li>
       </ul>
       <p><b>Skim:</b> &sect;3.2 (dropout-rate bookkeeping after pruning) and the exact per-layer sparsity
       tables &mdash; the idea is in the three steps and the threshold rule.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Train a small network to high accuracy. Now delete a fraction of its weights &mdash; the ones
       smallest in absolute value &mdash; by setting them to zero. As you delete <b>more and more</b> (50%,
       then 80%, then 95%), what happens to test accuracy if you do <b>not</b> retrain? And does a round of
       retraining on just the survivors <b>recover</b> the lost accuracy? Write a guess for each, then run the
       ablation below.</p>
       <p>(Hint: a trained net has lots of redundant connections. The question is how far that redundancy goes
       before accuracy falls off a cliff &mdash; and whether retraining moves that cliff.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the pruning routine you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Train a dense multi-layer perceptron (a stack of <code>nn.Linear</code> layers) to high accuracy.</li>
        <li>TODO: build a <b>binary mask</b> per weight matrix. Collect every weight's <code>.abs()</code>,
        find the threshold that keeps the top fraction, and set <code>mask = (W.abs() &gt; threshold)</code>.</li>
        <li>TODO: <b>apply</b> the mask &mdash; <code>W.mul_(mask)</code> &mdash; zeroing the small weights.</li>
        <li>TODO (the ablation): measure accuracy <b>now</b> (prune, no retrain). Then <b>retrain</b> the
        surviving weights for a few steps, re-applying the mask after every optimizer step so the pruned
        weights stay at zero, and measure again.</li>
       </ul>
       <p>Predict the two accuracy-vs-sparsity curves: prune-only vs prune-then-retrain.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The method has three steps, run in order (&sect;3, Abstract).</p>
       <p><b>Step 1 &mdash; train for connectivity.</b> Train the dense network normally. This is not really
       about the final weight values; it is about learning <i>which connections matter</i>. After training,
       a weight that ended up large in size carries a strong signal; a weight near zero barely changes the
       output. The size of a weight is used as a proxy for its importance.</p>
       <p><b>Step 2 &mdash; prune by magnitude.</b> Pick a threshold. Then "all connections with weights below
       a threshold are removed from the network" (&sect;3). "Removed" means the weight is forced to zero and
       kept there &mdash; the dense weight matrix becomes a sparse one with mostly zeros. The paper chooses
       the threshold per layer as "a quality parameter multiplied by the standard deviation of a layer's
       weights" (&sect;4). The <b>standard deviation</b> is the typical spread of the weights around zero;
       multiplying it by a small quality factor gives a cutoff in the same units as the weights.</p>
       <p><b>Step 3 &mdash; retrain the survivors.</b> The pruned net has lost accuracy. Retrain it &mdash;
       but only the weights that survived, with the zeros held fixed. Crucially you <b>keep the surviving
       weights</b> and fine-tune from there rather than restarting from random values: "when we retrain the
       pruned layers, we should keep the surviving parameters instead of re-initializing them" (&sect;3.3),
       because the network's features are "fragile co-adapted" and re-initializing throws away that
       structure. The paper is blunt that this step is not optional: "This step is critical. If the pruned
       network is used without retraining, accuracy is significantly impacted."</p>
       <p><b>Iterate (&sect;3.4).</b> One pass of prune+retrain is one iteration. Repeating it &mdash; prune a
       bit more, retrain, prune a bit more &mdash; reaches much higher sparsity than a single aggressive cut,
       because each retrain lets the survivors compensate before the next removal.</p>
       <p>Two supporting choices. <b>Regularization (&sect;3.1):</b> a regularizer adds a penalty on weight
       size to the loss to keep weights small. L1 (penalize the sum of absolute weights) pushes more weights
       to near-zero, so it looks better right after pruning; but L2 (penalize the sum of squared weights)
       wins after retraining, so the paper uses L2. <b>Dead neurons (&sect;3.5):</b> once a neuron loses all
       its input or all its output connections it contributes nothing, and retraining with regularization
       drives its remaining weights to zero too &mdash; it is pruned away for free.</p>`,
    architecture:
      `<p>This is an <b>algorithm</b> that wraps any trained network, not a new layer type. The procedure, as a
       loop (&sect;3, &sect;3.4):</p>
       <ol>
        <li><b>Initial training.</b> Train the dense network with <b>L2</b> regularization
        ($\\min_W L(W) + \\lambda\\sum_i w_i^2$, &sect;3.1) to convergence. Output: trained weights $W^{(0)}$.</li>
        <li><b>Prune (per layer).</b> For each layer, compute the weight standard deviation $\\sigma$, set the
        threshold $\\tau = q\\,\\sigma$ (&sect;4), and form the binary mask $m_i = \\mathbb{1}[|w_i| \\ge \\tau]$.
        Apply it: $W \\leftarrow m \\odot W$. The dense matrix becomes sparse.</li>
        <li><b>Dropout fix-up (&sect;3.2).</b> Because connections were removed, recompute each layer's
        connection count $C_i = N_i N_{i-1}$ and lower the dropout rate to $D_r = D_o\\sqrt{C_{ir}/C_{io}}$ for
        retraining.</li>
        <li><b>Retrain the survivors (&sect;3.3).</b> Resume gradient descent from $m \\odot W^{(0)}$ (do NOT
        re-initialize), re-applying the mask after every optimizer step so pruned weights stay zero. In very
        deep nets, freeze CONV layers while retraining FC layers and vice-versa to avoid vanishing gradients.</li>
        <li><b>Dead-neuron cleanup (&sect;3.5).</b> Neurons left with no input or no output connections are
        dropped for free &mdash; regularization zeros their remaining weights during retraining.</li>
        <li><b>Iterate (&sect;3.4).</b> Steps 2&ndash;5 are one iteration. Repeat &mdash; prune a little more,
        retrain &mdash; to push sparsity higher than any single aggressive cut.</li>
       </ol>
       <p>Pruning is applied <b>per layer</b> (the threshold uses each layer's own $\\sigma$), giving
       unstructured sparsity: individual weights vanish, not whole neurons or channels. The networks pruned in
       the paper are standard CNNs/MLPs (LeNet-300-100, LeNet-5, AlexNet, VGG-16); the method changes their
       <i>connectivity</i>, not their layer types.</p>`,
    symbols: [
      { sym: "$w_i$", desc: "a single <b>weight</b>: one learnable number on a connection between two neurons. Pruning decides, per weight, keep or delete." },
      { sym: "$|w_i|$", desc: "the <b>absolute value</b> (size, ignoring sign) of the weight. The pruning importance score: small size means the connection barely affects the output." },
      { sym: "$\\sigma$", desc: "the <b>standard deviation</b> of a layer's weights: how spread out they are around zero. Used to set the threshold in the weights' own units." },
      { sym: "$q$", desc: "the <b>quality parameter</b>: a small chosen factor. The pruning threshold is $q\\,\\sigma$. Larger $q$ deletes more weights." },
      { sym: "$\\tau$", desc: "the <b>threshold</b> on weight size, $\\tau = q\\,\\sigma$. Any weight with $|w_i| \\lt \\tau$ is pruned (set to zero)." },
      { sym: "$m_i$", desc: "the <b>binary mask</b> for weight $i$: $m_i = 1$ if $|w_i| \\ge \\tau$ (keep), else $m_i = 0$ (prune). The pruned weight is $m_i\\,w_i$." },
      { sym: "“sparsity”", desc: "a plain term: the fraction of weights set to zero. 0.9 sparsity means 90% of weights are pruned and 10% remain." },
      { sym: "“L1 / L2 regularization”", desc: "penalties added to the loss to keep weights small: L1 penalizes the sum of $|w_i|$, L2 the sum of $w_i^2$. The paper uses L2 (best after retraining, &sect;3.1)." },
      { sym: "“co-adaptation”", desc: "a plain term: neighboring weights learn to work together. Re-initializing pruned layers breaks this, so the paper keeps the surviving weights (&sect;3.3)." },
      { sym: "$m \\odot W$", desc: "the <b>masked weights</b>: elementwise (Hadamard) product of the binary mask and the weight matrix &mdash; survivors kept, pruned entries forced to zero." },
      { sym: "$L(W)$", desc: "the <b>data loss</b> (e.g. cross-entropy) the network minimizes during training and retraining." },
      { sym: "$R(W),\\ \\lambda$", desc: "the <b>regularization penalty</b> on weight size and its strength. $R_{L1}=\\sum_i|w_i|$, $R_{L2}=\\sum_i w_i^2$; $\\lambda$ scales how hard the penalty pulls weights toward zero (&sect;3.1)." },
      { sym: "$C_i,\\ N_i$", desc: "the <b>connection count</b> of layer $i$ and its <b>neuron count</b>: $C_i = N_i\\,N_{i-1}$ (Eq. 1, &sect;3.2)." },
      { sym: "$D_o,\\ D_r$", desc: "the <b>original</b> and <b>retraining dropout rates</b>. After pruning, $D_r = D_o\\sqrt{C_{ir}/C_{io}}$ &mdash; fewer connections means less co-adaptation to drop out (Eq. 2, &sect;3.2)." },
      { sym: "$C_{io},\\ C_{ir}$", desc: "the connection count of layer $i$ <b>originally</b> ($o$) and <b>after pruning / retraining</b> ($r$); their ratio sets the dropout adjustment." },
      { sym: "$m_{ij}$", desc: "the mask entry for the connection from neuron $i$ to neuron $j$. A neuron is dead when all its input or all its output mask entries are zero (&sect;3.5)." }
    ],
    formula:
      `$$ W^{(0)} = \\text{train}(W),\\quad m = \\text{prune}(W^{(0)}),\\quad W^\\star = \\text{retrain}(m \\odot W^{(0)}) $$
       <p>The three-step procedure (&sect;3, Abstract): train to learn which connections matter, prune to a sparse
       mask $m$, then retrain the survivors. $\\odot$ is elementwise (Hadamard) product.</p>
       $$ \\tau = q \\cdot \\sigma $$
       <p>Per-layer pruning threshold (&sect;4): quality parameter $q$ times the layer's weight standard
       deviation $\\sigma$. Larger $q$ deletes more.</p>
       $$ m_i = \\mathbb{1}[\\,|w_i| \\ge \\tau\\,] = \\begin{cases} 1 & |w_i| \\ge \\tau \\\\ 0 & |w_i| \\lt \\tau \\end{cases} \\qquad w_i \\leftarrow m_i\\, w_i $$
       <p>Binary mask by magnitude (&sect;3): keep weight $i$ iff its size is at least the threshold, then zero
       the rest. $\\mathbb{1}[\\cdot]$ is the indicator (1 if true, else 0).</p>
       $$ \\min_W\\; L(W) + \\lambda\\, R(W), \\qquad R_{L1}(W) = \\sum_i |w_i|, \\qquad R_{L2}(W) = \\sum_i w_i^2 $$
       <p>Regularized training objective (&sect;3.1): data loss $L$ plus a weight penalty $R$ scaled by
       $\\lambda$. L1 drives more weights toward zero (better right after pruning); L2 wins after retraining, so
       the paper uses L2.</p>
       $$ \\text{repeat: } \\; W \\leftarrow \\text{retrain}(m \\odot W), \\; m \\leftarrow \\text{prune}(W) $$
       <p>Iterative pruning (&sect;3.4): one prune+retrain pass is one iteration; repeating reaches far higher
       sparsity (AlexNet 5&times; &rarr; 9&times;) than a single aggressive cut.</p>
       $$ C_i = N_i\\, N_{i-1} \\qquad D_r = D_o\\,\\sqrt{\\dfrac{C_{ir}}{C_{io}}} $$
       <p>Dropout-rate adjustment after pruning (&sect;3.2, Eq. 1&ndash;2): $C_i$ is the connection count of layer
       $i$ (its neurons $N_i$ times the previous layer's $N_{i-1}$); since pruning removes connections, the
       retraining dropout $D_r$ is scaled down from the original $D_o$ by the square root of the surviving
       connection ratio.</p>
       $$ \\text{neuron } j \\text{ pruned} \\iff \\textstyle\\sum_i m_{ij} = 0 \\;\\text{ or }\\; \\sum_k m_{jk} = 0 $$
       <p>Dead-neuron pruning (&sect;3.5): a neuron with no surviving input connections or no surviving output
       connections contributes nothing; retraining with regularization drives its remaining weights to zero, so
       it is removed for free.</p>`,
    whatItDoes:
      `<p>The magnitude criterion in three short pieces. First set the <b>threshold</b> $\\tau$ to a small
       quality factor $q$ times the layer's weight spread $\\sigma$ (&sect;4). Second, build a <b>mask</b>:
       keep a weight ($m_i = 1$) if its size $|w_i|$ is at least $\\tau$, otherwise prune it ($m_i = 0$).
       Third, <b>apply</b> the mask &mdash; replace each weight by $m_i\\,w_i$, which zeros the pruned ones and
       leaves the survivors untouched.</p>
       <p>The paper states this in words rather than as a numbered equation: "All connections with weights
       below a threshold are removed from the network &mdash; converting a dense network into a sparse
       network" (&sect;3), with the threshold "a quality parameter multiplied by the standard deviation of a
       layer's weights" (&sect;4). The mask is the bookkeeping that makes "removed" precise: during retraining
       you re-apply $m$ after each step so the pruned weights stay exactly zero.</p>`,
    derivation:
      `<p>Why does deleting the small-magnitude weights cost so little? Consider one neuron computing a
       weighted sum $z = \\sum_i w_i\\,x_i$ of its inputs $x_i$. Dropping connection $i$ changes that sum by
       exactly $w_i\\,x_i$. If $|w_i|$ is tiny, the term $w_i\\,x_i$ is tiny too (for inputs of typical size),
       so the neuron's output barely moves. Magnitude is a cheap, first-order estimate of how much a
       connection matters: small weight, small effect.</p>
       <p>But "barely moves" is not "does not move," and across millions of weights the small errors add up
       &mdash; which is why a heavily pruned net loses accuracy <i>before</i> retraining. Retraining fixes
       this. Hold the pruned weights at zero (the mask) and let gradient descent adjust the survivors. The
       surviving weights re-absorb the work the deleted ones were doing. Because you start from the trained
       weights rather than from scratch, the network's "fragile co-adapted features" (&sect;3.3) are
       preserved, so the survivors only need a nudge, not a full re-learn. That is the whole reason the
       three-step recipe beats one-shot deletion: pruning proposes which connections to drop, retraining pays
       the bill.</p>
       <p>The full math owner for the pruning criterion is this paper itself (there is no separate concept
       lesson), so the argument above is the derivation: magnitude approximates importance, and retraining
       recovers the residual error.</p>`,
    example:
      `<p>Prune one tiny weight vector by hand using the paper's threshold rule. Take one layer's weights
       $w = [0.80,\\,-0.05,\\,0.30,\\,0.02,\\,-0.60,\\,0.10]$ and quality $q = 0.5$.</p>
       <ul class="steps">
        <li><b>Weight spread.</b> The standard deviation of these six numbers is $\\sigma \\approx 0.458$
        (the typical distance of a weight from zero).</li>
        <li><b>Threshold.</b> $\\tau = q\\,\\sigma = 0.5 \\times 0.458 \\approx 0.229$.</li>
        <li><b>Sizes.</b> Score by absolute value: $|w| = [0.80,\\,0.05,\\,0.30,\\,0.02,\\,0.60,\\,0.10]$.</li>
        <li><b>Mask</b> ($|w_i| \\ge 0.229$ keeps): $0.80,\\,0.30,\\,0.60$ pass; $0.05,\\,0.02,\\,0.10$ fail.
        So $m = [1,\\,0,\\,1,\\,0,\\,1,\\,0]$.</li>
        <li><b>Apply.</b> $m \\odot w = [0.80,\\,0,\\,0.30,\\,0,\\,-0.60,\\,0]$. We kept 3 of 6 weights &mdash;
        <b>50% sparsity</b>.</li>
       </ul>
       <table class="extable">
        <caption>Per-weight pruning decision against threshold $\\tau \\approx 0.229$ ($q=0.5$, $\\sigma\\approx0.458$).</caption>
        <thead><tr><th class="num">$w_i$</th><th class="num">$|w_i|$</th><th class="num">$|w_i| \\ge \\tau$?</th><th class="num">mask $m_i$</th><th class="num">$m_i\\,w_i$</th></tr></thead>
        <tbody>
         <tr><td class="num">0.80</td><td class="num">0.80</td><td class="num">yes</td><td class="num">1</td><td class="num">0.80</td></tr>
         <tr><td class="num">&minus;0.05</td><td class="num">0.05</td><td class="num">no</td><td class="num">0</td><td class="num">0.00</td></tr>
         <tr><td class="num">0.30</td><td class="num">0.30</td><td class="num">yes</td><td class="num">1</td><td class="num">0.30</td></tr>
         <tr><td class="num">0.02</td><td class="num">0.02</td><td class="num">no</td><td class="num">0</td><td class="num">0.00</td></tr>
         <tr><td class="num">&minus;0.60</td><td class="num">0.60</td><td class="num">yes</td><td class="num">1</td><td class="num">&minus;0.60</td></tr>
         <tr><td class="num">0.10</td><td class="num">0.10</td><td class="num">no</td><td class="num">0</td><td class="num">0.00</td></tr>
        </tbody>
       </table>
       <p>The three big-signal connections survive; the three near-zero ones are gone &mdash; 3 of 6 kept,
       <b>50% sparsity</b>. Note $-0.60$ survives despite its negative sign: we score by $|w_i|$, not raw value.
       These exact numbers are recomputed in the notebook's first cell so you can check the threshold and mask by
       running it.</p>`,
    recipe:
      `<ol>
        <li><b>Train a dense net.</b> A stack of <code>nn.Linear</code> layers (a multi-layer perceptron),
        trained to high accuracy. Record the baseline accuracy.</li>
        <li><b>Score by magnitude.</b> For each weight matrix, take <code>W.abs()</code>. Pool the sizes and
        find the threshold $\\tau$ that keeps the desired fraction (the paper uses $q\\,\\sigma$; a percentile
        is the equivalent way to hit a target sparsity).</li>
        <li><b>Build and apply the mask.</b> <code>mask = (W.abs() &gt; tau)</code>; then
        <code>W.mul_(mask)</code> to zero the pruned weights.</li>
        <li><b>Measure pruned (no retrain).</b> Test accuracy now &mdash; this is the "without retraining"
        curve.</li>
        <li><b>Retrain the survivors.</b> Keep the surviving weights (do <i>not</i> re-initialize). Train a
        few steps; after every optimizer step, re-apply the mask so pruned weights stay at zero. Measure again
        &mdash; the "with retraining" curve.</li>
        <li><b>Ablate.</b> Sweep sparsity from 50% to 99% and plot both curves. Optionally iterate
        (prune a little, retrain, repeat) to push sparsity higher.</li>
      </ol>`,
    results:
      `<p>From the abstract and Table 1 (quoted): the method reduces parameters "by an order of magnitude
       without affecting their accuracy." Specifically, on ImageNet "the number of parameters of AlexNet
       <b>can be reduced by 9&times;</b>, from 61 million to 6.7 million, without incurring accuracy loss.
       Similar experiments with VGG-16 found the network as a whole <b>can be reduced 13&times;</b>" (138M
       &rarr; 10.3M). On the smaller LeNet networks the reported reduction is about 12&times;. Iterative
       pruning is what reaches the high AlexNet rate: it "can boost pruning rate from 5&times; to 9&times;"
       over a single aggressive cut (&sect;3.4).</p>
       <p><i>These are the paper's reported figures, quoted from the abstract / &sect;3.4 / Table 1. The
       numbers in the CODEVIZ panel below are from our own tiny run on synthetic data &mdash; not the paper's
       results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> Pruning is judged by <b>compression vs accuracy</b>: the
        <b>parameter-reduction factor</b> (or equivalently the <b>sparsity</b>, fraction of weights zeroed) reached
        <b>without losing the dense baseline's test accuracy</b>, on the paper's nets/datasets (LeNet on MNIST,
        AlexNet and VGG-16 on ImageNet). The "no-skill" anchor is the <b>dense baseline accuracy</b> at $0\\%$
        sparsity &mdash; pruning is only "working" if a heavily pruned net retrains back to (essentially) that same
        number. The paper's bar: "reduced by an order of magnitude without affecting accuracy" &mdash; AlexNet
        <b>$9\\times$</b> ($61\\text{M}\\to6.7\\text{M}$), VGG-16 <b>$13\\times$</b> ($138\\text{M}\\to10.3\\text{M}$)
        (abstract / Table 1).</p>
       <ul>
        <li><b>2. Sanity checks BEFORE the sparsity sweep.</b> (a) <b>Known-answer unit test</b> &mdash; recompute
        the worked example: $w=[0.80,-0.05,0.30,0.02,-0.60,0.10]$, $q=0.5$ &rarr; $\\sigma\\approx0.458$,
        $\\tau\\approx0.229$, mask $[1,0,1,0,1,0]$, i.e. $50\\%$ sparsity (CODE panel's first cell asserts this).
        (b) <b>Sign test</b> &mdash; confirm $-0.60$ <i>survives</i> and $-0.05$ is pruned: you must score by
        $|w_i|$, not raw value. (c) <b>Real-sparsity check</b> &mdash; after applying the mask, <i>count the zeros</i>
        and confirm it matches the target fraction; after <i>each</i> retrain step, re-count to confirm the mask
        held (pruned weights still exactly $0$). (d) A correct dense baseline should first reach high accuracy at
        $0\\%$ sparsity &mdash; if it does not, fix that before pruning.</li>
        <li><b>3. Expected range.</b> A correct implementation should match the paper's headline: roughly
        <b>$9$&ndash;$13\\times$ parameter reduction with no accuracy loss</b> on the paper's nets (about
        <b>$12\\times$</b> on the LeNets), reached via <b>iterative</b> prune+retrain (&sect;3.4). These are the
        paper's reported figures &mdash; targets, not guarantees. Rule of thumb: up to moderate sparsity, accuracy
        should barely move; if accuracy craters at, say, $50\\%$ sparsity even <i>with</i> retraining, that is
        "probably a bug" (mask not re-applied, or scoring by raw value), not "needs tuning." Our CODEVIZ run
        (synthetic 10-class MLP) is our own, not the paper's numbers.</li>
        <li><b>4. Ablation &mdash; prove the key idea earns its keep.</b> The paper's load-bearing claim is the
        <b>retrain step</b>. The ablation (CODE/CODEVIZ, practice Q1): at each sparsity measure accuracy
        <b>prune-only</b> vs <b>prune-then-retrain</b>, holding the trained net and masks identical. With retraining
        OFF, accuracy should drop much sooner as sparsity climbs; turning it ON should recover it &mdash; the paper
        calls the step "critical." A second ablation isolates <b>keeping the survivors</b>: re-initialize the pruned
        layers from scratch instead of fine-tuning the trained weights, and recovery should be worse (the co-adapted
        features, &sect;3.3, are destroyed). If prune-only and prune-then-retrain look the same at high sparsity,
        the retrain (or the mask re-apply) is not actually running.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>Sparsity silently shrinks back toward $0$ during
        retraining</b> &rarr; you forgot to re-apply the mask after every <code>opt.step()</code>; gradients refill
        the zeroed weights. <b>Even low sparsity tanks accuracy</b> &rarr; pruning by raw value instead of $|w_i|$
        (a large negative weight got deleted), or pruning the wrong tensor. <b>Retraining does not recover at high
        sparsity (e.g. $95\\%$)</b> &rarr; you cut too aggressively in one shot past the point of no return; iterate
        (prune a little, retrain, repeat, &sect;3.4) instead. <b>Retrain accuracy worse than prune-only</b> &rarr;
        you re-initialized the survivors instead of keeping the trained weights (&sect;3.3), or the retrain LR is too
        high. <b>Loss NaN during retrain</b> &rarr; LR too high on the now-sparse net.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the plumbing already ships in PyTorch, so you
       <b>compose</b> with it and build only the novel part. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code>, the optimizer, and the loss. <b>Build by hand:</b> the magnitude criterion
       &mdash; collecting weight sizes, choosing the threshold, building the binary mask, and re-applying the
       mask after every retrain step so pruned weights stay zero &mdash; plus the prune-no-retrain vs
       prune-then-retrain <b>ablation</b>. There is no concept lesson to recap; the importance argument
       (small weight = small effect, retraining pays the residual) is the derivation above.</p>`,
    pitfalls:
      `<ul>
        <li><b>Skipping the retrain step.</b> Pruning alone collapses accuracy at high sparsity. The paper
        calls retraining "critical." If you only mask and never fine-tune, you are measuring the wrong thing.</li>
        <li><b>Re-initializing before retraining.</b> Tempting, but wrong. The paper keeps the surviving
        weights (&sect;3.3) because the features are co-adapted; restart from random and accuracy does not come
        back as well.</li>
        <li><b>Letting pruned weights drift back to non-zero.</b> The optimizer updates every parameter,
        including the ones you zeroed. You must re-apply the mask after <i>every</i> optimizer step &mdash;
        otherwise the gradient quietly refills the holes and your sparsity evaporates.</li>
        <li><b>Pruning by raw value instead of absolute value.</b> A weight of $-0.9$ is a strong connection,
        not a small one. Score by $|w_i|$; a large negative weight must survive.</li>
        <li><b>One aggressive cut to extreme sparsity.</b> Deleting 95%+ in a single shot can pass a point of
        no return that retraining cannot recover. The paper iterates (&sect;3.4): prune a bit, retrain, repeat
        &mdash; gentler and reaches higher final sparsity.</li>
        <li><b>Confusing weight pruning with neuron/structured pruning.</b> This paper zeros individual
        weights (unstructured sparsity), which needs sparse hardware/libraries to actually speed up. Removing
        whole neurons or channels is a different, later line of work.</li>
      </ul>`,
    recall: [
      "State the three steps of the method in order.",
      "Write the magnitude pruning rule: what is the threshold, and which weights are removed?",
      "Why must you keep the surviving weights instead of re-initializing before retraining?",
      "In the ablation, what happens to accuracy at high sparsity with vs without retraining?",
      "Why must you re-apply the mask after every optimizer step during retraining?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a dense net at high accuracy. You prune it to 90% sparsity (delete
            the 90% smallest-magnitude weights). You measure accuracy, then retrain only the survivors and
            measure again. What do you expect for each, and what does the comparison demonstrate?`,
        steps: [
          { do: `Prune to 90% sparsity and test <i>without</i> retraining: accuracy drops noticeably (in our run, from 100% to ~90%).`, why: `Deleting weights changes every neuron's weighted sum a little; across the whole net those small errors accumulate.` },
          { do: `Keep the surviving weights, retrain a few steps re-applying the mask each step, and test again: accuracy climbs back up (in our run, back to ~100%).`, why: `The survivors re-absorb the work the deleted connections did; starting from the trained weights preserves the co-adapted features (&sect;3.3).` },
          { do: `Conclude that the recipe is prune <i>and</i> retrain, not prune alone.`, why: `Pruning proposes which connections to drop; retraining pays the residual error. The paper calls the retrain step "critical."` }
        ],
        answer: `<p>Without retraining, accuracy falls at 90% sparsity; with retraining it recovers to near the
                 dense baseline. Since the only difference is the retrain step, this isolates retraining as the
                 reason high sparsity is safe &mdash; exactly the paper's claim that the step is critical. Push
                 to 95%+ and even retraining cannot fully recover, marking the limit of one-shot pruning (the
                 paper iterates to go further, &sect;3.4).</p>`
      },
      {
        q: `A layer has weights $w = [0.80, -0.05, 0.30, 0.02, -0.60, 0.10]$ with standard deviation
            $\\sigma \\approx 0.458$. Using the paper's rule with quality $q = 0.5$, which weights are pruned,
            and what sparsity does that give?`,
        steps: [
          { do: `Compute the threshold $\\tau = q\\,\\sigma = 0.5 \\times 0.458 \\approx 0.229$.`, why: `The paper sets the threshold to a quality parameter times the layer's weight standard deviation (&sect;4).` },
          { do: `Compare each $|w_i|$ to $\\tau$: sizes are $[0.80, 0.05, 0.30, 0.02, 0.60, 0.10]$.`, why: `Pruning scores by absolute value &mdash; sign does not matter, magnitude does.` },
          { do: `Keep $|w_i| \\ge 0.229$: $\\{0.80, 0.30, 0.60\\}$ survive; $\\{0.05, 0.02, 0.10\\}$ are zeroed.`, why: `Three of six weights pass the threshold.` }
        ],
        answer: `<p>Pruned weights: the $-0.05$, $0.02$, and $0.10$ (all below $\\tau \\approx 0.229$). The mask
                 is $[1,0,1,0,1,0]$, so the layer becomes $[0.80, 0, 0.30, 0, -0.60, 0]$ &mdash; 3 of 6 kept,
                 i.e. <b>50% sparsity</b>. Note $-0.60$ survives: it is large in magnitude despite the negative
                 sign.</p>`
      },
      {
        q: `During retraining of a pruned net, you forget to re-apply the mask after each optimizer step. After
            a few epochs your network is no longer sparse. Explain what happened and how to fix it.`,
        steps: [
          { do: `Recall that the optimizer updates <i>every</i> parameter using its gradient, including the weights you zeroed.`, why: `A zeroed weight still has a gradient; backprop will push it away from zero on the next step.` },
          { do: `Re-apply the mask immediately after <code>opt.step()</code> every iteration: <code>W.mul_(mask)</code>.`, why: `This forces the pruned weights back to exactly zero before the next forward pass, holding sparsity fixed.` },
          { do: `Verify sparsity afterward by counting zeros in each weight matrix.`, why: `An honest sparse-retrain keeps the same set of weights at zero throughout; checking confirms the mask stuck.` }
        ],
        answer: `<p>The optimizer refilled the pruned weights: gradients are non-zero on zeroed connections, so
                 each step nudges them off zero and the holes close. Fix it by re-applying the mask after every
                 optimizer step (<code>W.mul_(mask)</code>), which pins the pruned weights at zero throughout
                 retraining. Then verify by counting zeros that the target sparsity is preserved.</p>`
      }
    ]
  });

  window.CODE["paper-pruning"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> with <code>nn.Linear</code> and implement the novel part &mdash;
       magnitude-based weight pruning &mdash; by hand. We train a dense multi-layer perceptron on a synthetic
       10-class problem, then prune the smallest-magnitude weights to a target sparsity by building a
       <b>binary mask</b> (<code>mask = (W.abs() &gt; tau)</code>) and applying it (<code>W.mul_(mask)</code>).
       The headline is the <b>ablation</b>: at each sparsity we measure accuracy <i>without</i> retraining,
       then <i>with</i> retraining the survivors (re-applying the mask after every optimizer step so pruned
       weights stay zero). The first cell recomputes the worked example
       ($w=[0.80,-0.05,0.30,0.02,-0.60,0.10]$, $q=0.5$ &rarr; threshold $\\approx 0.229$, mask
       $[1,0,1,0,1,0]$). Paste into Colab and run.</p>`,
    code: `import copy
import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example: threshold = q * std, then mask by magnitude. ---
w   = torch.tensor([0.80, -0.05, 0.30, 0.02, -0.60, 0.10])
std = w.std(unbiased=True).item()
q   = 0.5
tau = q * std                                   # threshold = quality * std  (paper, Sec 4)
mask = (w.abs() > tau).int()
print("std =", round(std, 4), " threshold =", round(tau, 4))
print("mask =", mask.tolist(), " pruned =", (w * mask).tolist())
# std = 0.458  threshold = 0.229
# mask = [1, 0, 1, 0, 1, 0]  pruned = [0.8, 0.0, 0.3, 0.0, -0.6, 0.0]   -> 50% sparsity


# --- 1. A synthetic, learnable 10-class problem (no downloads needed). ---
D, K = 64, 10
g = torch.Generator().manual_seed(1)
centers = torch.randn(K, D, generator=g) * 2.5
def make(n, gen):
    y = torch.randint(0, K, (n,), generator=gen)
    X = centers[y] + torch.randn(n, D, generator=gen) * 1.0
    return X, y
Xtr, ytr = make(4000, g)
Xte, yte = make(1000, g)


# --- 2. A dense multi-layer perceptron (we import nn.Linear; the pruning is ours). ---
class MLP(nn.Module):
    def __init__(self, h=256):
        super().__init__()
        self.fc1 = nn.Linear(D, h); self.fc2 = nn.Linear(h, h); self.fc3 = nn.Linear(h, K)
        self.act = nn.ReLU()
    def forward(self, x):
        x = self.act(self.fc1(x)); x = self.act(self.fc2(x)); return self.fc3(x)

def lin(net):                                   # the weight-bearing layers we prune
    return [net.fc1, net.fc2, net.fc3]

def acc(net, X, y):
    net.eval()
    with torch.no_grad():
        return (net(X).argmax(1) == y).float().mean().item()

def train(net, epochs, lr, mask=None):
    opt = torch.optim.Adam(net.parameters(), lr=lr); lf = nn.CrossEntropyLoss(); net.train()
    for _ in range(epochs):
        opt.zero_grad(); lf(net(Xtr), ytr).backward(); opt.step()
        if mask is not None:                    # KEEP pruned weights at zero after every step
            with torch.no_grad():
                for i, l in enumerate(lin(net)):
                    l.weight.mul_(mask[i])
    return net


# --- 3. The novel part: magnitude pruning to a target sparsity (global threshold). ---
def make_mask(net, sparsity):
    all_w = torch.cat([l.weight.detach().abs().flatten() for l in lin(net)])
    k = int(sparsity * all_w.numel())
    tau = -1.0 if k == 0 else all_w.kthvalue(k).values.item()   # threshold = the k-th smallest size
    return {i: (l.weight.detach().abs() > tau).float() for i, l in enumerate(lin(net))}

def apply_mask(net, mask):
    with torch.no_grad():
        for i, l in enumerate(lin(net)):
            l.weight.mul_(mask[i])

def real_sparsity(net):
    tot = sum(l.weight.numel() for l in lin(net))
    zero = sum((l.weight.detach() == 0).sum().item() for l in lin(net))
    return zero / tot


# --- 4. Train dense baseline, then the ablation: prune-no-retrain vs prune-then-retrain. ---
base = MLP(); train(base, epochs=80, lr=0.005)
print("\\nDENSE baseline test acc:", round(acc(base, Xte, yte), 4))

print("\\n sparsity | no-retrain | retrain")
for s in [0.5, 0.7, 0.8, 0.9, 0.95]:
    a = copy.deepcopy(base); m = make_mask(a, s); apply_mask(a, m)
    no_rt = acc(a, Xte, yte)                                    # prune only
    b = copy.deepcopy(base); mb = make_mask(b, s); apply_mask(b, mb)
    train(b, epochs=50, lr=0.002, mask=mb)                      # prune THEN retrain survivors
    rt = acc(b, Xte, yte)
    print(f"   {real_sparsity(a):.2f}   |   {no_rt:.3f}    |  {rt:.3f}")

# Our small run (not the paper's numbers): up to ~80% sparsity both stay ~1.00 (redundant weights).
# At 90% the no-retrain net drops while retraining recovers it; at 95% retraining only partly recovers
# -- the limit of one-shot pruning (the paper ITERATES, Sec 3.4, to push sparsity higher).`
  };

  window.CODEVIZ["paper-pruning"] = {
    question: "As we prune more weights of a trained net, what happens to test accuracy WITHOUT retraining vs WITH retraining the survivors?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs sparsity — prune-only vs prune-then-retrain",
        xlabel: "sparsity (fraction of weights pruned)",
        ylabel: "test accuracy",
        series: [
          {
            name: "Prune, no retrain",
            color: "#ff7b72",
            points: [[0.0,1.0],[0.5,1.0],[0.7,1.0],[0.8,1.0],[0.9,0.905],[0.95,0.184],[0.97,0.093],[0.99,0.093]]
          },
          {
            name: "Prune, then retrain",
            color: "#7ee787",
            points: [[0.0,1.0],[0.5,1.0],[0.7,1.0],[0.8,1.0],[0.9,1.0],[0.95,0.667],[0.97,0.093],[0.99,0.093]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A dense 3-layer multi-layer perceptron (hidden width 256) trained to 100% test accuracy on a synthetic 10-class problem, then pruned by weight magnitude to each sparsity. Up to 80% of the weights can be deleted with NO accuracy loss either way &mdash; the net is that redundant. At 90% sparsity the prune-only curve (red) drops to 90.5% while retraining the survivors (green) fully recovers to 100%. At 95% sparsity retraining still helps a lot (66.7% vs 18.4%) but cannot fully recover &mdash; the limit of single-shot pruning, which the paper pushes past by iterating (&sect;3.4). Same trained net, same masks; the only difference is the retrain step.",
    code: `import copy, torch
import torch.nn as nn
torch.manual_seed(0)

D, K = 64, 10
g = torch.Generator().manual_seed(1)
centers = torch.randn(K, D, generator=g) * 2.5
def make(n, gen):
    y = torch.randint(0, K, (n,), generator=gen)
    X = centers[y] + torch.randn(n, D, generator=gen) * 1.0
    return X, y
Xtr, ytr = make(4000, g); Xte, yte = make(1000, g)

class MLP(nn.Module):
    def __init__(self, h=256):
        super().__init__()
        self.fc1 = nn.Linear(D, h); self.fc2 = nn.Linear(h, h); self.fc3 = nn.Linear(h, K)
        self.act = nn.ReLU()
    def forward(self, x):
        x = self.act(self.fc1(x)); x = self.act(self.fc2(x)); return self.fc3(x)

def lin(n): return [n.fc1, n.fc2, n.fc3]
def acc(n, X, y):
    n.eval()
    with torch.no_grad(): return (n(X).argmax(1) == y).float().mean().item()
def train(n, ep, lr, mask=None):
    opt = torch.optim.Adam(n.parameters(), lr=lr); lf = nn.CrossEntropyLoss(); n.train()
    for _ in range(ep):
        opt.zero_grad(); lf(n(Xtr), ytr).backward(); opt.step()
        if mask is not None:
            with torch.no_grad():
                for i, l in enumerate(lin(n)): l.weight.mul_(mask[i])
def make_mask(n, s):
    aw = torch.cat([l.weight.detach().abs().flatten() for l in lin(n)])
    k = int(s * aw.numel()); tau = -1.0 if k == 0 else aw.kthvalue(k).values.item()
    return {i: (l.weight.detach().abs() > tau).float() for i, l in enumerate(lin(n))}
def apply_mask(n, m):
    with torch.no_grad():
        for i, l in enumerate(lin(n)): l.weight.mul_(m[i])

base = MLP(); train(base, 80, 0.005)
no_rt, rt = [], []
for s in [0.0, 0.5, 0.7, 0.8, 0.9, 0.95, 0.97, 0.99]:
    a = copy.deepcopy(base); m = make_mask(a, s); apply_mask(a, m); no_rt.append((s, round(acc(a, Xte, yte), 3)))
    b = copy.deepcopy(base); mb = make_mask(b, s); apply_mask(b, mb); train(b, 50, 0.002, mb); rt.append((s, round(acc(b, Xte, yte), 3)))
print("Prune, no retrain :", no_rt)
print("Prune, then retrain:", rt)
# Prune, no retrain : [(0.0,1.0),(0.5,1.0),(0.7,1.0),(0.8,1.0),(0.9,0.905),(0.95,0.184),(0.97,0.093),(0.99,0.093)]
# Prune, then retrain: [(0.0,1.0),(0.5,1.0),(0.7,1.0),(0.8,1.0),(0.9,1.0),(0.95,0.667),(0.97,0.093),(0.99,0.093)]`
  };
})();
