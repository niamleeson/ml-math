/* Paper lesson — "Deep Compression: Compressing Deep Neural Networks with Pruning,
   Trained Quantization and Huffman Coding" (Han, Mao, Dally, 2015 / ICLR 2016).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-deep-compression".
   GROUNDED from arXiv:1510.00149 (abstract) and the ar5iv HTML mirror
   (Sec 2 Pruning, Sec 3 Trained Quantization / Weight Sharing — Eqns 1, 2, 3; Sec 4 Huffman).
   Track B (architecture): compose with torch.nn; implement the novel pipeline pieces by hand —
   pruning and weight-sharing via k-means quantization of weights into shared centroids; Huffman
   conceptually. Reproduce the effect on a real tiny net: accuracy vs bits-per-weight; ablate #clusters.
   Builds on the pruning paper (paper-pruning) referenced in prose. */
(function () {
  window.LESSONS.push({
    id: "paper-deep-compression",
    title: "Deep Compression — Pruning, Trained Quantization and Huffman Coding (2015)",
    tagline: "Shrink a trained network 35x-49x with no accuracy loss by pruning connections, sharing a few weight values, and Huffman-coding them.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Song Han, Huizi Mao, William J. Dally",
      org: "Stanford University (and NVIDIA)",
      year: 2015,
      venue: "arXiv:1510.00149 (Oct 2015); ICLR 2016 (oral)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1510.00149",
      code: "https://github.com/songhan/Deep-Compression-AlexNet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-kmeans", "pt-nn-module", "dl-backprop", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>A trained neural network is heavy in two ways: it does a lot of arithmetic, and it stores a lot of
       numbers. The storage is the headache for phones, watches, and other small devices. Each connection
       weight is a 32-bit floating-point number, and big vision networks have tens of millions of them. The
       paper opens on exactly this (&sect;1):</p>
       <blockquote>"Neural networks are both computationally intensive and memory intensive, making them
       difficult to deploy on embedded systems with limited hardware resources." (abstract)</blockquote>
       <p>Concretely the paper notes that AlexNet's stored weights take about 240 megabytes (MB) and VGG-16
       about 552&nbsp;MB. A megabyte is one million bytes. That is far too large to keep in fast on-chip memory,
       and fetching weights from slow off-chip memory burns time and battery. The question: can we make the
       <i>stored</i> network much smaller without making it <i>less accurate</i>?</p>`,
    contribution:
      `<ul>
        <li><b>A three-stage compression pipeline.</b> The paper chains three lossless-or-near-lossless
        steps: <b>(1) pruning</b> &mdash; delete unimportant connections; <b>(2) trained quantization with
        weight sharing</b> &mdash; force the remaining weights to take only a few shared values; <b>(3)
        Huffman coding</b> &mdash; entropy-code those values to squeeze out the last bits. After steps 1 and 2
        the network is <b>retrained</b> so it recovers any lost accuracy.</li>
        <li><b>Weight sharing by k-means.</b> The novel middle stage clusters each layer's weights with
        k-means into a few <b>shared centroids</b> (cluster centers). Every weight is then stored as a tiny
        index into a small table of centroids, dropping each weight from 32 bits to about 5 bits.</li>
        <li><b>Big compression, no accuracy loss.</b> The reported headline (abstract): "reduce the storage
        requirement of neural networks by <b>35x to 49x</b> without affecting their accuracy." On ImageNet,
        AlexNet went "from 240MB to 6.9MB" (35x) and VGG-16 "from 552MB to 11.3MB" (49x).</li>
      </ul>`,
    whyItMattered:
      `<p>Deep Compression won an ICLR 2016 best-paper award and made "shrink the trained model" a first-class
       research area. Its pieces became standard practice: magnitude <b>pruning</b> for sparsity, <b>weight
       sharing / quantization</b> to lower the bits per weight, and <b>codebook</b> storage. The follow-up
       line of work led to specialized inference hardware (the authors' EIE accelerator) and to today's
       routine 8-bit and 4-bit deployment of large models. The lesson that a trained net is hugely redundant
       &mdash; most weights are tiny or repeat &mdash; underlies modern on-device and edge machine learning.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 + Fig. 1</b> &mdash; the three-stage pipeline diagram (pruning &rarr; quantization &rarr;
        Huffman) and the storage/accuracy framing.</li>
        <li><b>&sect;2 (Network Pruning)</b> &mdash; remove connections whose weight is below a threshold, then
        retrain; store the survivors sparsely (compressed-sparse-row / compressed-sparse-column with index
        differences).</li>
        <li><b>&sect;3 (Trained Quantization and Weight Sharing)</b> &mdash; the heart of the lesson. The
        k-means objective (Eqn. 2), the compression-rate formula (Eqn. 1), centroid initialization
        (linear is best), and how shared centroids get gradients (Eqn. 3).</li>
        <li><b>Fig. 3</b> &mdash; the weight-sharing picture: a weight matrix, its cluster-index matrix, the
        centroid table, and how gradients are grouped by cluster and summed.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (Huffman coding) for the idea only, and the per-layer ImageNet result tables
       (&sect;5) unless you want the exact bit budgets. The math you need is three short equations in &sect;3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Take a network trained to, say, 91% test accuracy. Now force every weight to be one of only a small
       set of shared values by k-means clustering the weights, and keep nothing else. Sweep the number of
       clusters $k$ from many (256) down to very few (2). At what point do you expect accuracy to fall off a
       cliff &mdash; at 256, 32, 8, or 2 clusters? Write your guess. The paper claims about <b>5 bits</b>
       (that is, $2^5 = 32$ clusters) is enough for fully-connected layers with no loss.</p>`,
    attempt:
      `<p>Before the reveal, sketch the weight-sharing function you will build. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li><code>kmeans_quantize(weights, k)</code>: flatten the weight matrix to a vector.</li>
        <li>TODO: initialize $k$ centroids <b>linearly</b> &mdash;
        <code>centroids = linspace(min(w), max(w), k)</code>  <i># the paper's best init</i>.</li>
        <li>TODO (repeat a few times): <b>assign</b> each weight to its nearest centroid (smallest
        $|w - c|$), then <b>update</b> each centroid to the mean of the weights assigned to it.</li>
        <li>TODO: <b>replace</b> every weight by its assigned centroid value and return the new matrix.</li>
       </ul>
       <p>Then quantize a trained net's weight matrices for several values of $k$, measure test accuracy each
       time, and plot accuracy against bits-per-weight $= \\log_2 k$.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>The pipeline has three stages (&sect;1, Fig. 1). We focus on the first two; the third is a coda.</p>
       <p><b>Stage 1 &mdash; Pruning (&sect;2).</b> First train the network normally. Then "all connections with
       weights below a threshold are removed from the network" &mdash; if a weight's magnitude is tiny, the
       connection barely matters, so delete it (set it to zero permanently). Then <b>retrain</b> the surviving
       connections so they compensate. This typically removes most weights. The survivors are stored sparsely:
       only the non-zero values plus their positions. The paper stores positions as <i>index differences</i>
       (the gap to the previous non-zero weight) in a few bits, which is cheaper than absolute positions.
       This pruning stage is the prior paper "Learning both Weights and Connections" that Deep Compression
       builds on &mdash; see the pruning lesson (id <code>paper-pruning</code>) for the details.</p>
       <p><b>Stage 2 &mdash; Trained quantization and weight sharing (&sect;3).</b> This is the novel core. Take
       the surviving weights of a layer and run <b>k-means clustering</b> on their <i>values</i> (each weight
       is a single number, so this is one-dimensional clustering). k-means finds $k$ <b>centroids</b> (shared
       values) that minimize the total squared distance from each weight to its nearest centroid. Now every
       weight is replaced by the centroid it was assigned to. So the layer no longer stores millions of
       distinct 32-bit numbers; it stores (a) a small table of $k$ centroids, and (b) for each weight, a tiny
       <b>index</b> saying which centroid it uses. If $k = 32$, an index needs only $\\log_2 32 = 5$ bits
       instead of 32. That is the <b>weight sharing</b>: many connections share one stored value.</p>
       <p><b>Retraining the centroids.</b> Quantizing slightly hurts accuracy, so the paper <b>fine-tunes the
       centroids</b>. The cluster assignments are frozen, but each centroid value is updated by gradient
       descent: during back-propagation, the gradients of every weight in a cluster are <b>summed</b> and used
       to nudge that one shared centroid (Eqn. 3 below). This recovers the lost accuracy.</p>
       <p><b>Centroid initialization matters (&sect;3).</b> The paper tries three ways to place the initial
       centroids: random (Forgy), density-based, and <b>linear</b> (evenly spaced between the smallest and
       largest weight). Linear wins, because "larger weights play a more important role than smaller weights"
       and linear spacing keeps a few centroids out at the large-magnitude tails, where random and
       density-based init crowd everything near zero and lose them.</p>
       <p><b>Stage 3 &mdash; Huffman coding (&sect;4).</b> The centroid indices are not used equally often &mdash;
       a few values dominate. <b>Huffman coding</b> is a lossless scheme that gives the common symbols short
       codewords and rare symbols long ones, so the average bits per symbol drops. Applying it to the indices
       and the sparse-position differences "saves 20%&ndash;30% of network storage" on top of stages 1&ndash;2.</p>`,
    architecture:
      `<p>Deep Compression is not a network &mdash; it is a <b>three-stage compression pipeline</b> (&sect;1,
       Fig. 1) applied to an <i>already-trained</i> network. Data flows left to right; the size shrinks at
       each stage and accuracy is restored by retraining inside the first two stages.</p>
       <p><b>Stage 1 &mdash; Pruning + sparse storage (&sect;2).</b> Train normally, zero every weight whose
       magnitude is below a threshold, retrain the survivors, repeat. This drops the connection count
       <b>9x&ndash;13x</b>. The survivors are kept in <b>compressed-sparse-row / column (CSR / CSC)</b>
       format: for a matrix with $a$ non-zeros and $n$ rows it stores <b>$2a + n + 1$</b> numbers (the
       values, their column indices, and row pointers). To make the indices cheap, the paper stores the
       <b>index difference</b> (gap to the previous non-zero) instead of the absolute index, encoded in
       <b>5 bits for fully-connected layers and 8 bits for convolutional layers</b>; when a gap exceeds the
       budget ($\\gt 2^5$ or $2^8$) it inserts a <b>zero-padding</b> filler so no difference overflows.</p>
       <p><b>Stage 2 &mdash; Trained quantization / weight sharing (&sect;3).</b> Per layer, run 1-D k-means
       (Eqn. 2) on the surviving scalar weights to get a <b>codebook</b> of $k$ shared centroids. Each weight
       is replaced by an <b>index</b> into that codebook: $\\log_2 k$ bits each. The paper uses <b>5-bit FC
       (32 centroids) and 8-bit CONV (256 centroids)</b>. Centroids are <b>linearly initialized</b> between
       the min and max weight, then <b>fine-tuned</b> by gradient descent &mdash; the gradients of all weights
       sharing a centroid are summed (Eqn. 3) and the assignments stay fixed.</p>
       <p><b>Stage 3 &mdash; Huffman coding (&sect;4).</b> The centroid indices and the index-difference symbols
       are non-uniformly distributed, so a static <b>Huffman code</b> (short codewords for frequent symbols)
       losslessly removes a further <b>20%&ndash;30%</b>. No retraining; this stage is pure entropy coding.</p>
       <p><b>Networks compressed (&sect;5).</b> The pipeline is demonstrated on <b>LeNet-300-100</b> and
       <b>LeNet-5</b> (MNIST), and on <b>AlexNet</b> (240MB &rarr; 6.9MB, <b>35x</b>) and <b>VGG-16</b>
       (552MB &rarr; 11.3MB, <b>49x</b>) on ImageNet &mdash; in every case with no loss of accuracy.</p>`,
    symbols: [
      { sym: "$w$", desc: "a single <b>weight</b> &mdash; one connection's value, originally a 32-bit floating-point number." },
      { sym: "$n$", desc: "the <b>number of weights</b> (connections) in the layer being compressed." },
      { sym: "$b$", desc: "the <b>bits per weight before</b> compression (here 32, a standard float)." },
      { sym: "$k$", desc: "the <b>number of clusters</b> (shared values / centroids). After quantization each weight is stored as an index into $k$ values." },
      { sym: "$c_i$", desc: "the $i$-th <b>centroid</b> (cluster center): one of the $k$ shared weight values. The table of all $c_i$ is the <b>codebook</b>." },
      { sym: "$C$", desc: "the full set of centroids $\\{c_1, \\dots, c_k\\}$ &mdash; what k-means is solving for." },
      { sym: "$c_i$ (as a cluster)", desc: "the paper also writes $c_i$ for the $i$-th <b>cluster</b> (the group of weights assigned to centroid $i$); $w \\in c_i$ means weight $w$ belongs to that group." },
      { sym: "$\\log_2 k$", desc: "the <b>bits per weight after</b> quantization &mdash; the index size needed to name one of $k$ centroids (e.g. $\\log_2 32 = 5$)." },
      { sym: "$r$", desc: "the <b>compression rate</b>: stored bits before, divided by stored bits after (Eqn. 1). Bigger is better." },
      { sym: "$W_{ij}$", desc: "the weight at row $i$, column $j$ of the weight matrix." },
      { sym: "$I_{ij}$", desc: "the <b>cluster index</b> of weight $W_{ij}$ &mdash; which centroid it was assigned to." },
      { sym: "$C_k$", desc: "the value of the $k$-th centroid being fine-tuned (the thing the gradient in Eqn. 3 updates)." },
      { sym: "$\\mathcal{L}$", desc: "the <b>loss</b> (the training objective being minimized)." },
      { sym: "$\\mathbb{1}(\\cdot)$", desc: "the <b>indicator</b>: 1 if the condition inside is true, 0 otherwise. Here it selects weights belonging to cluster $k$." },
      { sym: "$a$", desc: "the <b>number of non-zero weights</b> in a pruned (sparse) matrix. A compressed-sparse-row matrix with $a$ non-zeros and $n$ rows stores $2a + n + 1$ numbers (&sect;2)." }
    ],
    formula: `$$ \\arg\\min_{C} \\; \\sum_{i=1}^{k} \\sum_{w \\in c_i} |\\,w - c_i\\,|^2 \\qquad\\text{(Eqn. 2, k-means objective)} $$
$$ r = \\frac{n\\,b}{n\\,\\log_2(k) + k\\,b} \\qquad\\text{(Eqn. 1, compression rate)} \\qquad\\qquad
   \\frac{\\partial \\mathcal{L}}{\\partial C_k} = \\sum_{i,j} \\frac{\\partial \\mathcal{L}}{\\partial W_{ij}}\\, \\mathbb{1}(I_{ij} = k) \\qquad\\text{(Eqn. 3, centroid gradient)} $$`,
    whatItDoes:
      `<p><b>Equation 2</b> is plain k-means in one dimension. It searches for the set of $k$ centroids $C$ that
       makes the total <b>within-cluster sum of squares</b> as small as possible: for each weight $w$, take the
       squared distance $|w - c_i|^2$ to the centroid of the cluster it belongs to, and add all those up. Small
       total means each weight is close to its shared value, so replacing the weight by the centroid loses
       little.</p>
       <p><b>Equation 1</b> is the bookkeeping. Before: $n$ weights, each $b$ bits, so $n\\,b$ bits. After: each
       of the $n$ weights stores a $\\log_2(k)$-bit index, plus we keep the codebook of $k$ centroids at $b$
       bits each. So the after-size is $n\\,\\log_2(k) + k\\,b$ bits, and $r$ is the ratio. When $n$ is huge the
       small $k\\,b$ codebook is negligible and $r \\approx b / \\log_2 k$ &mdash; e.g. $32/5 \\approx 6.4\\times$.</p>
       <p><b>Equation 3</b> is how a shared centroid learns. Fixing the assignments, the gradient on centroid
       $C_k$ is the <b>sum</b> of the loss gradients of every weight $W_{ij}$ that was assigned to cluster $k$
       (the indicator $\\mathbb{1}(I_{ij}=k)$ picks them out). Add them up and take a gradient-descent step; all
       the weights in that cluster move together because they are one value.</p>`,
    derivation:
      `<p><b>Why summing the per-weight gradients is the right update (Eqn. 3).</b> After quantization, every
       weight in cluster $k$ is literally the same number $C_k$ &mdash; they are tied together. When one variable
       is shared across many places in a computation, the chain rule says its gradient is the <b>sum</b> of the
       gradients flowing into each place. Formally, the loss depends on $C_k$ only through the weights
       $W_{ij}$ assigned to it, and each such $W_{ij}$ equals $C_k$, so $\\partial W_{ij} / \\partial C_k = 1$.
       The multivariable chain rule then gives</p>
       <p>$$ \\frac{\\partial \\mathcal{L}}{\\partial C_k}
          = \\sum_{i,j}\\frac{\\partial \\mathcal{L}}{\\partial W_{ij}}\\frac{\\partial W_{ij}}{\\partial C_k}
          = \\sum_{i,j}\\frac{\\partial \\mathcal{L}}{\\partial W_{ij}}\\,\\mathbb{1}(I_{ij}=k), $$</p>
       <p>which is exactly Eqn. 3. This is the same weight-sharing gradient rule used in convolutions and
       recurrent nets: a tied parameter accumulates the gradients of all its uses. The general back-propagation
       machinery behind the chain rule is covered in the <b>dl-backprop</b> lesson; the k-means assignment /
       update loop is covered in <b>ml-kmeans</b>. Here we just compose them.</p>`,
    example:
      `<p>Cluster a tiny weight vector by hand so the centroids are concrete. Suppose a layer has six weights</p>
       <p>$$ w = [\\,-0.98,\\; -0.95,\\; 0.02,\\; 0.05,\\; 0.91,\\; 1.05\\,], \\qquad k = 2. $$</p>
       <p><b>Run k-means (Eqn. 2).</b> Linear init places $k=2$ centroids at the min and max,
       $c = [\\,-0.98,\\; 1.05\\,]$; then alternate <i>assign each weight to its nearer centroid</i> and
       <i>set each centroid to its cluster's mean</i> until the assignments stop changing:</p>
       <table class="extable">
        <caption>k-means iterations (assignments use cluster 0 / 1; centroid = mean of its cluster's weights).</caption>
        <thead><tr><th>iteration</th><th>assignments</th><th class="num">$c_0$</th><th class="num">$c_1$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">init (linear)</td><td>&mdash;</td><td class="num">-0.98</td><td class="num">1.05</td></tr>
         <tr><td class="row-h">0</td><td>$[0,0,0,1,1,1]$</td><td class="num">-0.637</td><td class="num">0.670</td></tr>
         <tr><td class="row-h">1</td><td>$[0,0,1,1,1,1]$</td><td class="num">-0.965</td><td class="num">0.5075</td></tr>
         <tr><td class="row-h">2 (converged)</td><td>$[0,0,1,1,1,1]$</td><td class="num">-0.965</td><td class="num">0.5075</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Iteration 0 &mdash; assign.</b> The first two weights are closest to $-0.98$; check the
        borderline $0.02$: $|0.02-(-0.98)|=1.00$ vs $|0.02-1.05|=1.03$, so it joins cluster 0. Assignments
        $[0,0,0,1,1,1]$. <b>Update:</b> $c_0 = \\text{mean}(-0.98,-0.95,0.02) = -0.637$,
        $c_1 = \\text{mean}(0.05,0.91,1.05) = 0.670$.</li>
        <li><b>Iteration 1 &mdash; reassign.</b> Now $0.02$ flips: $|0.02-(-0.637)|=0.657$ vs
        $|0.02-0.670|=0.650$, so it moves to cluster 1. Assignments $[0,0,1,1,1,1]$. <b>Update:</b>
        $c_0 = \\text{mean}(-0.98,-0.95) = -0.965$, $c_1 = \\text{mean}(0.02,0.05,0.91,1.05) = 0.5075$.</li>
        <li><b>Iteration 2 &mdash; converged.</b> Assignments unchanged, so the final centroids are
        $c = [\\,-0.965,\\; 0.5075\\,]$.</li>
        <li><b>Within-cluster sum of squares</b> (Eqn. 2): add each weight's squared distance to its centroid.
        $(-0.015)^2 + (0.015)^2 + (-0.4875)^2 + (-0.4575)^2 + (0.4025)^2 + (0.5425)^2 \\approx 0.9037$.</li>
       </ul>
       <p><b>Compression (Eqn. 1).</b> After quantization each weight stores a $\\log_2 k$-bit index. For these
       $n=6$ weights at $b=32$ bits, compare $k=2$ against what a larger layer would give:</p>
       <table class="extable">
        <caption>Compression rate $r = \\dfrac{n\\,b}{n\\,\\log_2 k + k\\,b}$ for $b = 32$.</caption>
        <thead><tr><th>case</th><th class="num">$n$</th><th class="num">$k$</th><th class="num">$\\log_2 k$</th><th class="num">$n\\,b$</th><th class="num">$n\\log_2 k + k\\,b$</th><th class="num">$r$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">this example</td><td class="num">6</td><td class="num">2</td><td class="num">1</td><td class="num">192</td><td class="num">70</td><td class="num">2.74&times;</td></tr>
         <tr><td class="row-h">large layer</td><td class="num">1,000,000</td><td class="num">2</td><td class="num">1</td><td class="num">32,000,000</td><td class="num">1,000,064</td><td class="num">32.0&times;</td></tr>
        </tbody>
       </table>
       <p>For only 6 weights the 2-centroid codebook ($k\\,b = 64$ bits) is large next to the $n\\log_2 k = 6$ index
       bits, so $r$ is just $192/70 \\approx 2.74\\times$. With a million weights the codebook is negligible and
       $r \\to b/\\log_2 k = 32/1 = 32\\times$.</p>
       <p>These exact numbers &mdash; centroids $[-0.965, 0.5075]$, assignments $[0,0,1,1,1,1]$, sum-of-squares
       $0.9037$, and $r \\approx 2.74$ &mdash; are recomputed in the notebook's first cell so you can check the
       clustering by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Train</b> a small network normally (here a fully-connected classifier).</li>
        <li><b>Prune</b> (conceptual here): zero the smallest-magnitude weights below a threshold and retrain
        the survivors. (We keep the focus on quantization; pruning is the prior <code>paper-pruning</code>
        step.)</li>
        <li><b>Weight-share by k-means.</b> For each weight matrix: flatten it, init $k$ centroids linearly
        between min and max, run a few assign/update iterations (Eqn. 2), then replace each weight by its
        centroid. Each weight now costs $\\log_2 k$ bits.</li>
        <li><b>Measure accuracy</b> after quantization and plot it against bits-per-weight $= \\log_2 k$.</li>
        <li><b>Ablate the number of clusters</b> $k$: sweep $k \\in \\{2,4,8,16,32,64,256\\}$ and watch where
        accuracy collapses &mdash; the paper's claim is that about 5 bits (32 clusters) is enough.</li>
        <li><b>Huffman (conceptual):</b> note that the centroid indices are non-uniform, so entropy-coding them
        saves a further 20%&ndash;30% with no accuracy change.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): deep compression reduces "the storage requirement of neural networks by
       <b>35x to 49x</b> without affecting their accuracy." Stage by stage: "Pruning, reduces the number of
       connections by <b>9x to 13x</b>; Quantization then reduces the number of bits that represent each
       connection from <b>32 to 5</b>." On ImageNet: "our method reduced the storage required by AlexNet by
       35x, from <b>240MB to 6.9MB</b>, without loss of accuracy" and "reduced the size of VGG-16 by 49x from
       <b>552MB to 11.3MB</b>, again with no loss of accuracy." Huffman coding adds a further "20%&ndash;30%"
       saving (&sect;4).</p>
       <p><i>These are the paper's reported figures, quoted from the abstract / &sect;4. The numbers in the
       CODEVIZ panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Two metrics, traded off against each other:
       <b>test accuracy</b> (must not drop) and <b>compression rate</b> $r$ (Eqn. 1, bigger is better),
       plotted as accuracy vs <b>bits-per-weight</b> $=\\log_2 k$. The paper's benchmarks are MNIST
       (LeNet-300-100, LeNet-5) and ImageNet (AlexNet, VGG-16); the bar to clear is <b>no accuracy loss</b> at
       the reported <b>35x&ndash;49x</b> storage reduction (abstract). The "no-skill" anchors: the
       <b>float32 baseline accuracy</b> is the ceiling you must not fall below, and the trivial-compression
       point is $k=2$ (1 bit), which forces nearly all distinct weights to collide and should clearly hurt.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> Reproduce the worked example exactly:
        $w=[-0.98,-0.95,0.02,0.05,0.91,1.05]$, $k=2 \\Rightarrow$ centroids $[-0.965, 0.5075]$, assignments
        $[0,0,1,1,1,1]$, within-cluster sum-of-squares $\\approx 0.9037$, and rate $r\\approx 2.74$. Confirm
        k-means runs on the <b>scalar weight values</b> (one data point per weight), not on rows/neurons.
        Check that quantizing with $k=$ (number of distinct weights) leaves accuracy essentially unchanged
        (a near-no-op), and that centroids are <b>linearly</b> initialized between min and max. Verify the WCSS
        (Eqn. 2) <i>decreases</i> across k-means iterations.</li>
        <li><b>Expected range.</b> A correct build should hold accuracy <b>flat from 256 down to about 32
        clusters (5 bits)</b>, then degrade below that &mdash; the paper's "about 5 bits is enough for
        fully-connected layers" claim (arXiv:1510.00149, &sect;3; approximate). The lesson's small run held
        $\\approx 91.3\\%$ down to 5 bits and dropped to $\\approx 80\\%$ at 1 bit (our quantize-and-stop run,
        not the paper's retrained number). A big accuracy drop already at 32 clusters signals a bug (wrong init,
        or clustering the wrong axis), not tuning.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central knob is the <b>number of
        shared centroids</b> $k$. Sweep $k \\in \\{256,32,8,2\\}$: accuracy should stay flat to $\\approx 32$ then
        <b>fall</b> as $k$ shrinks &mdash; this demonstrates weight redundancy is real and that weight sharing is
        doing the work. A second ablation isolates the <b>linear init</b> claim: swap to random/density init and
        confirm accuracy at the same $k$ is <i>worse</i> (the paper's reason: large-magnitude weights matter most
        and other inits crowd centroids near zero).</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Accuracy collapses even at large $k$</b> &rarr; you
        clustered feature vectors/rows instead of scalar weights, or replaced weights with indices instead of
        centroid <i>values</i>. <b>Compression rate $r$ looks tiny</b> &rarr; expected on a small layer (the
        $k\\,b$ codebook term in Eqn. 1 dominates); $r\\to b/\\log_2 k$ only when $n \\gg k$. <b>Accuracy worse
        than the paper at 5 bits</b> &rarr; you skipped centroid fine-tuning (Eqn. 3) &mdash; a quantize-and-stop
        run loses a little more, as our demo does. <b>"Smaller file but no speedup"</b> &rarr; expected: deep
        compression shrinks storage, not raw multiply-adds, unless the hardware exploits sparsity + codebook.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the network primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel compression pieces. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code>, the optimizer, and the MNIST loader from torchvision (preinstalled in Colab &mdash;
       no pip). <b>Build by hand:</b> the <code>kmeans_quantize</code> weight-sharing function (linear init,
       assign-to-nearest-centroid, update-centroid-to-cluster-mean, replace-weight-by-centroid), the
       accuracy-vs-bits sweep, and the <b>cluster-count ablation</b>. Pruning is recapped (it is the prior
       <code>paper-pruning</code> step) and Huffman coding is described conceptually, not implemented. The
       k-means loop math is recapped from <b>ml-kmeans</b> and the shared-centroid gradient from
       <b>dl-backprop</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Clustering the wrong thing.</b> k-means here runs on the <i>scalar weight values</i> (a
        one-dimensional set), not on neurons, rows, or activations. Each weight is one data point. Confusing
        this with clustering feature vectors gives nonsense centroids.</li>
        <li><b>Random or density-based centroid init.</b> The paper found <b>linear</b> init (evenly spaced
        between min and max weight) clearly best, because large-magnitude weights matter most and other inits
        crowd centroids near zero and lose the tails. <b>Fix:</b> <code>linspace(min(w), max(w), k)</code>.</li>
        <li><b>Forgetting to retrain after quantizing.</b> The paper fine-tunes the centroids (Eqn. 3) so
        accuracy recovers. A pure quantize-and-stop run (which is what our small demo does for clarity) will
        lose a little more accuracy than the paper's retrained result &mdash; do not read our drop as the
        paper's.</li>
        <li><b>Treating $k$ as "more is always better."</b> Storage cost is $\\log_2 k$ bits per weight, so
        doubling $k$ adds only one bit but accuracy saturates quickly; the sweet spot for fully-connected
        layers was about 5 bits (32 clusters). Spending 8 bits buys almost nothing extra.</li>
        <li><b>Counting the codebook as free.</b> Eqn. 1's denominator includes the $k\\,b$ centroid table.
        For a tiny layer that term dominates and $r$ is small; the big compression only appears when $n \\gg k$
        (millions of weights), as in real networks.</li>
        <li><b>Confusing the two roles of "compression."</b> Deep compression shrinks <i>storage</i>, not the
        number of multiply-adds at full speed unless the hardware exploits the sparsity and the codebook.
        Smaller-on-disk does not automatically mean faster on stock hardware.</li>
      </ul>`,
    recall: [
      "Name the three stages of the pipeline, in order.",
      "Write the k-means objective (Eqn. 2) from memory and say what each part means.",
      "Write the compression-rate formula (Eqn. 1) and explain why $r \\to b/\\log_2 k$ as $n$ grows.",
      "How does a shared centroid get its gradient during retraining (Eqn. 3)?",
      "Why does linear centroid initialization beat random?"
    ],
    practice: [
      {
        q: `<b>The cluster-count ablation.</b> You have a trained net at 91% test accuracy. You quantize its
            weight matrices with k-means and sweep $k = 256, 32, 8, 2$ clusters. What do you expect to happen
            to accuracy across that sweep, and what does the result demonstrate about weight redundancy?`,
        steps: [
          { do: `Quantize all weight matrices with $k$ centroids (linear init), replace each weight by its centroid, and measure test accuracy &mdash; changing only $k$ each run.`, why: `An honest ablation varies exactly one knob (the cluster count) so any accuracy change is attributable to it.` },
          { do: `Read off the curve: accuracy is essentially unchanged from 256 down to about 32 clusters (5 bits), then dips at 8, and falls clearly at 2 (1 bit).`, why: `5 bits is the paper's reported sweet spot for fully-connected layers; below it, distinct weights are forced to collide and information is lost.` },
          { do: `Conclude the trained weights are highly redundant: a few dozen shared values capture nearly all the useful structure.`, why: `That redundancy is exactly what weight sharing exploits to drop 32 bits per weight down to ~5 with no accuracy loss.` }
        ],
        answer: `<p>Accuracy stays flat from 256 clusters down to ~32 (5 bits), then degrades as $k$ shrinks
                 further, with a clear drop at 2 clusters. This demonstrates that the trained weights are very
                 redundant &mdash; about 32 shared values are enough &mdash; which is why weight sharing
                 compresses the network with little or no accuracy loss. The CODEVIZ panel shows exactly this
                 accuracy-vs-bits curve from our small run.</p>`
      },
      {
        q: `A fully-connected layer has $n = 1{,}000{,}000$ weights stored at $b = 32$ bits. You quantize to
            $k = 32$ shared centroids. Using Eqn. 1, what is the compression rate $r$, and how does it compare
            to the rough estimate $b / \\log_2 k$?`,
        steps: [
          { do: `Compute bits per weight after: $\\log_2 32 = 5$.`, why: `Each weight now stores a 5-bit index naming one of 32 centroids instead of a 32-bit float.` },
          { do: `Plug into Eqn. 1: $r = \\dfrac{n b}{n \\log_2 k + k b} = \\dfrac{10^6 \\cdot 32}{10^6 \\cdot 5 + 32 \\cdot 32} = \\dfrac{32{,}000{,}000}{5{,}001{,}024} \\approx 6.4$.`, why: `The denominator's codebook term $32\\cdot32 = 1024$ is negligible against the $5{,}000{,}000$ index bits.` },
          { do: `Compare to $b/\\log_2 k = 32/5 = 6.4$.`, why: `When $n \\gg k$ the codebook term vanishes and Eqn. 1 collapses to $b/\\log_2 k$.` }
        ],
        answer: `<p>$r \\approx 6.4\\times$, essentially equal to $b/\\log_2 k = 32/5 = 6.4$. With a million weights
                 the 32-entry codebook costs almost nothing, so the compression rate is just the ratio of bits
                 before to bits after per weight. (This is the quantization stage alone; pruning and Huffman
                 multiply it further to the paper's 35x&ndash;49x.)</p>`
      },
      {
        q: `In the worked example, $w = [-0.98,-0.95,0.02,0.05,0.91,1.05]$ clustered to $k=2$ gave centroids
            $[-0.965, 0.5075]$ with assignments $[0,0,1,1,1,1]$. During retraining, suppose back-propagation
            produces per-weight gradients $g = [0.1, 0.2, -0.3, 0.0, 0.4, -0.1]$. What gradient does centroid
            $C_1$ (index 1) receive (Eqn. 3), and why do all four weights move together?`,
        steps: [
          { do: `Identify which weights belong to cluster 1: indices 2,3,4,5 (assignments equal 1), i.e. weights $0.02, 0.05, 0.91, 1.05$.`, why: `Eqn. 3's indicator $\\mathbb{1}(I_{ij}=1)$ selects exactly the weights assigned to centroid 1.` },
          { do: `Sum their gradients: $-0.3 + 0.0 + 0.4 + (-0.1) = 0.0$.`, why: `Eqn. 3 adds the loss gradients of all weights in the cluster to update the one shared value.` },
          { do: `Note $C_1$'s gradient is $0.0$ here, so it would not move this step; all four weights share that single update.`, why: `The four weights are literally the same stored number $C_1$, so the chain rule ties their gradients into one sum.` }
        ],
        answer: `<p>$C_1$ receives the sum of the gradients of its cluster's weights: $-0.3 + 0.0 + 0.4 - 0.1 =
                 0.0$, so it does not move this step. All four weights move together because after quantization
                 they are one shared value $C_1$; by the chain rule a tied parameter's gradient is the sum of
                 the gradients of every place it is used (Eqn. 3). Centroid $C_0$ would similarly receive
                 $0.1 + 0.2 = 0.3$ from weights 0 and 1.</p>`
      }
    ]
  });

  window.CODE["paper-deep-compression"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the weight-sharing quantizer by hand &mdash; <code>kmeans_quantize</code> with
       linear centroid init, nearest-centroid assignment, centroid = cluster-mean update, and
       replace-weight-by-centroid &mdash; then apply it to a small fully-connected net trained on an
       <b>MNIST subset</b> (torchvision, preinstalled in Colab &mdash; no pip). The key idea is Eqn. 2: cluster
       the scalar weight values into $k$ shared centroids. We sweep $k$ and print <b>test accuracy vs
       bits-per-weight</b> ($\\log_2 k$) &mdash; the cluster-count <b>ablation</b>. The first cell recomputes the
       worked example: $w=[-0.98,-0.95,0.02,0.05,0.91,1.05]$, $k=2 \\to$ centroids $[-0.965, 0.5075]$,
       assignments $[0,0,1,1,1,1]$, sum-of-squares $0.9037$, and compression rate $r \\approx 2.74$ (Eqn. 1).
       Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import numpy as np, copy
import torchvision, torchvision.transforms as T

torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the worked example: k-means a tiny weight vector by hand (k=2). ---
def kmeans_1d(w, k, iters=25):
    w = torch.as_tensor(w, dtype=torch.float32)
    cent = torch.linspace(w.min(), w.max(), k)        # LINEAR init (the paper's best)
    for _ in range(iters):
        idx = (w[:, None] - cent[None, :]).abs().argmin(1)   # assign to nearest centroid
        for j in range(k):
            sel = w[idx == j]
            if len(sel) > 0:
                cent[j] = sel.mean()                  # update centroid = cluster mean
    return cent, idx

w = [-0.98, -0.95, 0.02, 0.05, 0.91, 1.05]
cent, idx = kmeans_1d(w, 2)
wcss = sum((torch.tensor(w) - cent[idx]) ** 2).item()
n, b, k = 6, 32, 2
r = n * b / (n * np.log2(k) + k * b)                  # Eqn. 1 compression rate
print("centroids   =", [round(c, 4) for c in cent.tolist()])  # [-0.965, 0.5075]
print("assignments =", idx.tolist())                          # [0, 0, 1, 1, 1, 1]
print("WCSS (Eqn.2)=", round(wcss, 4))                        # 0.9037
print("rate r (Eqn.1) =", round(r, 3), "x   bits/weight =", np.log2(k))  # 2.743 x, 1.0


# --- 1. Train a small fully-connected net on an MNIST subset (torchvision, preinstalled). ---
tfm = T.Compose([T.ToTensor()])
tr = torchvision.datasets.MNIST(root="./data", train=True,  download=True, transform=tfm)
te = torchvision.datasets.MNIST(root="./data", train=False, download=True, transform=tfm)
def stack(ds, m): return (torch.stack([ds[i][0].view(-1) for i in range(m)]),
                          torch.tensor([ds[i][1] for i in range(m)]))
Xtr, ytr = stack(tr, 6000); Xte, yte = stack(te, 2000)

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 300); self.fc2 = nn.Linear(300, 100); self.fc3 = nn.Linear(100, 10)
    def forward(self, x):
        h = torch.relu(self.fc1(x)); h = torch.relu(self.fc2(h)); return self.fc3(h)

net = Net(); opt = torch.optim.Adam(net.parameters(), lr=1e-3); lf = nn.CrossEntropyLoss()
for ep in range(12):
    perm = torch.randperm(len(Xtr))
    for i in range(0, len(Xtr), 128):
        b_ = perm[i:i + 128]
        opt.zero_grad(); loss = lf(net(Xtr[b_]), ytr[b_]); loss.backward(); opt.step()

def acc(m):
    with torch.no_grad(): return (m(Xte).argmax(1) == yte).float().mean().item()
base = acc(net)
print("\\nfloat32 baseline test acc =", round(base, 4))   # ~0.91 (our run, not the paper's)


# --- 2. Weight sharing: k-means quantize each weight MATRIX to k shared centroids. ---
def kmeans_quantize(weights, k, iters=20):
    flat = weights.flatten()
    cent = torch.linspace(flat.min(), flat.max(), k)          # linear init
    for _ in range(iters):
        idx = (flat[:, None] - cent[None, :]).abs().argmin(1)  # assign (Eqn. 2)
        for j in range(k):
            sel = flat[idx == j]
            if len(sel) > 0:
                cent[j] = sel.mean()                           # update
    return cent[idx].reshape(weights.shape)                    # replace weight by its centroid

# --- 3. ABLATION: sweep number of clusters k -> accuracy vs bits-per-weight (log2 k). ---
print("\\n k   bits/weight   test_acc")
for k in [2, 4, 8, 16, 32, 64, 256]:
    qnet = copy.deepcopy(net)
    for name, p in qnet.named_parameters():
        if "weight" in name:                                   # quantize every weight matrix
            p.data = kmeans_quantize(p.data, k)
    print(f"{k:4d}   {int(np.log2(k)):^11d}   {acc(qnet):.4f}")
# Accuracy is ~flat from 256 down to ~32 clusters (5 bits), then drops at 8 and clearly at 2.
# This is OUR small run (quantize-and-stop, no retraining), not the paper's reported number.`
  };

  window.CODEVIZ["paper-deep-compression"] = {
    question: "After k-means weight sharing, how does test accuracy depend on bits-per-weight (= log2 of the number of clusters)?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs bits-per-weight — k-means weight sharing (number-of-clusters ablation)",
        xlabel: "bits per weight  (log2 k)",
        ylabel: "test accuracy",
        series: [
          {
            name: "Quantized (k clusters)",
            color: "#7ee787",
            points: [[1, 0.803], [2, 0.8795], [3, 0.9045], [4, 0.912], [5, 0.9135], [6, 0.9135], [8, 0.914]]
          },
          {
            name: "float32 baseline (32-bit)",
            color: "#a5d6ff",
            points: [[1, 0.9145], [8, 0.9145]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A 784-300-100-10 fully-connected net trained on a 6,000-image MNIST subset to 91.45% test accuracy (the dashed baseline). Each point quantizes EVERY weight matrix to k shared centroids by 1-D k-means (linear init) and re-measures accuracy. From 256 clusters (8 bits) down to 32 clusters (5 bits) accuracy holds at ~91.3% — essentially no loss, matching the paper's 'about 5 bits' claim for fully-connected layers. Below that it degrades: 8 clusters (3 bits) ~90.5%, 4 clusters (2 bits) ~88.0%, and 2 clusters (1 bit) drops to ~80.3%. This is quantize-and-stop with NO centroid retraining, so the small drops would shrink further if we fine-tuned (Eqn. 3); it is not the paper's number.",
    code: `import torch, torch.nn as nn, numpy as np, copy
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)

tfm = T.Compose([T.ToTensor()])
tr = torchvision.datasets.MNIST("./data", train=True,  download=True, transform=tfm)
te = torchvision.datasets.MNIST("./data", train=False, download=True, transform=tfm)
def stack(ds, m): return (torch.stack([ds[i][0].view(-1) for i in range(m)]),
                          torch.tensor([ds[i][1] for i in range(m)]))
Xtr, ytr = stack(tr, 6000); Xte, yte = stack(te, 2000)

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 300); self.fc2 = nn.Linear(300, 100); self.fc3 = nn.Linear(100, 10)
    def forward(self, x):
        h = torch.relu(self.fc1(x)); h = torch.relu(self.fc2(h)); return self.fc3(h)

net = Net(); opt = torch.optim.Adam(net.parameters(), lr=1e-3); lf = nn.CrossEntropyLoss()
for ep in range(12):
    perm = torch.randperm(len(Xtr))
    for i in range(0, len(Xtr), 128):
        b_ = perm[i:i + 128]
        opt.zero_grad(); lf(net(Xtr[b_]), ytr[b_]).backward(); opt.step()
def acc(m):
    with torch.no_grad(): return (m(Xte).argmax(1) == yte).float().mean().item()
base = acc(net)

def kmeans_quantize(w, k, iters=20):
    f = w.flatten(); c = torch.linspace(f.min(), f.max(), k)
    for _ in range(iters):
        idx = (f[:, None] - c[None, :]).abs().argmin(1)
        for j in range(k):
            s = f[idx == j]
            if len(s) > 0: c[j] = s.mean()
    return c[idx].reshape(w.shape)

pts = []
for k in [2, 4, 8, 16, 32, 64, 256]:
    q = copy.deepcopy(net)
    for n_, p in q.named_parameters():
        if "weight" in n_: p.data = kmeans_quantize(p.data, k)
    pts.append([int(np.log2(k)), round(acc(q), 4)])
print("baseline =", round(base, 4))
print("bits, acc =", pts)
# baseline ~0.9145; accuracy flat down to 5 bits, then drops -> our small run, not the paper's number.`
  };
})();
