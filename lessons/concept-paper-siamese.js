/* Paper lesson — "Siamese Neural Networks for One-shot Image Recognition", Koch, Zemel & Salakhutdinov 2015.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-siamese".
   GROUNDED from the official PDF (cs.toronto.edu/~rsalakhu/papers/oneshot1.pdf), read directly:
   Sec 3.1 Model (twin nets, weight tying, per-layer conv max-pool eqs, p = sigmoid(sum alpha_j |h1_j - h2_j|)),
   Sec 3.2 Learning (regularized cross-entropy loss L, momentum+L2 weight update, decayed LR, affine distortions),
   Sec 4.3 One-shot (C* = argmax_c p^(c)), Fig 4 (best convnet architecture), Tables 1-3 numbers.
   The metric-learning math lives in concept fs-metric-learning; here we recap. Track B (architecture): build the
   twin shared-weight encoder, the weighted-L1 + sigmoid head, BCE on same/different pairs, then N-way one-shot. */
(function () {
  window.LESSONS.push({
    id: "paper-siamese",
    title: "Siamese Networks — Siamese Neural Networks for One-shot Image Recognition (2015)",
    tagline: "Train twin shared-weight networks to say \"same or different?\", then classify a brand-new class from a single example by picking the most similar support image.",
    module: "Papers · Meta-learning, Bayesian & Robustness",
    track: "architecture",
    paper: {
      authors: "Gregory Koch, Richard Zemel, Ruslan Salakhutdinov",
      org: "University of Toronto",
      year: 2015,
      venue: "ICML 2015 Deep Learning Workshop (32nd Int. Conf. on Machine Learning, Lille; JMLR W&CP vol. 37)",
      citations: "",
      arxiv: "",
      url: "https://www.cs.toronto.edu/~rsalakhu/papers/oneshot1.pdf",
      code: ""
    },
    conceptLink: "fs-metric-learning",
    partOf: [],
    prereqs: ["fs-metric-learning", "fs-few-shot", "dl-conv", "dl-cross-entropy", "dl-activations", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>Standard deep learning needs many labelled examples per class. Show it one picture of a new
       category and it has nothing to fit. The paper calls this the <b>one-shot learning</b> setting
       &mdash; you must classify a test image correctly after seeing <i>exactly one</i> example of each new
       class:</p>
       <blockquote>"the one-shot learning setting, in which we must correctly make predictions given only a
       single example of each new class." (Abstract)</blockquote>
       <p>Worse, the new classes are ones the model was <b>never trained on</b>. A normal classifier has a
       fixed output layer &mdash; one slot per class it saw in training &mdash; so it cannot even name a class
       that did not exist at training time. Retraining for every new class is expensive or impossible when you
       only have one image. (This is different from <b>zero-shot</b> learning, where you see <i>no</i> example
       of the target class at all.)</p>`,
    contribution:
      `<ul>
        <li><b>Twin networks with tied (shared) weights.</b> Two identical copies of one convolutional
        network &mdash; the paper calls them <b>siamese twins</b> &mdash; each read one image of a pair. The
        two copies share <i>the same weights</i>, so they compute the same function and map similar images to
        nearby points in feature space.</li>
        <li><b>A verification objective that transfers.</b> Instead of "which class is this?", train the net
        on the easier yes/no question "are these two images the <b>same</b> class or <b>different</b>
        classes?". The paper's bet: features good enough to verify pairs from known classes also verify pairs
        from unknown ones.</li>
        <li><b>One-shot by nearest similarity.</b> At test time, compare the new image against one example per
        candidate class (the <b>support set</b>) and pick the class whose example scores the highest
        similarity. No retraining &mdash; one forward pass per comparison.</li>
      </ul>`,
    whyItMattered:
      `<p>This was an early, clean demonstration that a learned <b>similarity metric</b> can do
       few-shot classification: train a comparison function once, then classify novel classes by nearest
       match. The recipe &mdash; encode, compare, pick the closest support example &mdash; became a template
       for later metric-learning and meta-learning work (Matching Networks, Prototypical Networks, Relation
       Networks). The same twin-encoder idea also underlies face verification and modern contrastive
       self-supervised learning, where a shared encoder is trained to pull matching pairs together.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 intro &amp; Fig. 3</b> &mdash; the twin-network picture: the network is "replicated
        across the top and bottom sections to form twin networks, with shared weight matrices at each layer."
        This <b>weight tying</b> is the heart of the method.</li>
        <li><b>&sect;3.1 (Model)</b> &mdash; the one equation you will transcribe and implement: the
        weighted-L1 distance fed to a sigmoid, $p = \\sigma(\\sum_j \\alpha_j |h_{1,j} - h_{2,j}|)$.</li>
        <li><b>&sect;3.2 (Learning)</b> &mdash; the regularized cross-entropy loss on same/different labels.</li>
        <li><b>&sect;4.3 (One-shot Learning)</b> &mdash; how a verification net does N-way one-shot:
        $C^{*} = \\arg\\max_c\\, p(c)$ over the support set; the 20-way within-alphabet protocol.</li>
        <li><b>Table 2</b> &mdash; the headline one-shot 20-way numbers vs baselines.</li>
       </ul>
       <p><b>Skim:</b> the long related-work list (&sect;2), the exact hyperparameter ranges and Whetlab /
       affine-distortion details (&sect;3.2, &sect;4.1). The Omniglot dataset description (&sect;4.1) is worth a
       glance to know what "alphabet" and "drawer" mean.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You train a Siamese network only to answer "same class or different?" on pairs of images. You never
       train it to name classes, and the classes you test on at the end were <b>never seen during training</b>.
       In a 5-way one-shot test (one support image per class, pick the best match), random guessing scores
       $1/5 = 20\\%$. Will the trained network beat $20\\%$? By a little, or by a lot? And will a <b>random,
       untrained</b> encoder &mdash; same architecture, no training &mdash; already beat chance? Write your
       guess, then run the ablation below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the three pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>One</b> encoder module <code>Encoder</code> (a small Convolutional Neural Network, CNN). Call
        it <i>twice</i> &mdash; once per image &mdash; so the weights are automatically shared.
        <i># tied weights = one module, two calls</i></li>
        <li><b>The similarity head.</b> TODO: given embeddings <code>h1, h2</code>, compute
        <code>l1 = torch.abs(h1 - h2)</code>, then <code>p = sigmoid(alpha(l1))</code> where
        <code>alpha = nn.Linear(dim, 1)</code> holds the learned weights $\\alpha_j$.</li>
        <li><b>Training.</b> TODO: sample same/different pairs, label same $= 1$ / different $= 0$, and minimize
        <b>binary cross-entropy</b> between $p$ and the label.</li>
        <li><b>One-shot.</b> TODO: for a query image, score it against one support image per class with the same
        head, then <code>pred = argmax(similarities)</code>.</li>
       </ul>
       <p>Then run it on a tiny digit task and predict the trained-vs-untrained one-shot accuracy.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The method has three moving parts: a <b>twin encoder</b>, a <b>similarity head</b>, and a
       <b>one-shot decision rule</b>.</p>
       <p><b>1. Twin encoder with shared weights (&sect;3, Fig. 3).</b> Take one convolutional network and run
       <i>both</i> images of a pair through it. The paper stresses the two copies share weights &mdash; they
       are "twin networks, with shared weight matrices at each layer." It explains why this matters: "Weight
       tying guarantees that two extremely similar images could not possibly be mapped by their respective
       networks to very different locations in feature space because each network computes the same function."
       In code, sharing weights is trivial: you build <i>one</i> encoder module and call it twice. Let $h_1$ be
       the top-layer feature vector for the first image and $h_2$ for the second.</p>
       <p><b>2. Weighted-L1 similarity head (&sect;3.1).</b> The paper does <i>not</i> learn the distance metric
       from scratch (as the earlier contrastive-loss work did). It <b>fixes</b> the metric to a weighted
       <b>L1 distance</b> (sum of absolute differences) and feeds it through a sigmoid. The "L1 distance"
       between two vectors is $\\sum_j |h_{1,j} - h_{2,j}|$ &mdash; add up the absolute gap in each coordinate.
       Each coordinate gets its own learned weight $\\alpha_j$ saying how important that feature is. The sigmoid
       $\\sigma$ squashes the weighted sum into a probability in $(0, 1)$. That probability is the predicted
       similarity: roughly, the chance the two images are the <b>same</b> class.</p>
       <p><b>3. Training the verifier (&sect;3.2).</b> Build a balanced stream of pairs: <b>same-class</b> pairs
       labelled $y = 1$ and <b>different-class</b> pairs labelled $y = 0$. Train the whole thing &mdash; encoder
       plus the $\\alpha_j$ &mdash; with <b>binary cross-entropy</b> (the standard log-loss for a yes/no
       classifier) so that same pairs push $p$ toward $1$ and different pairs push $p$ toward $0$. Because the
       weights are tied, "the gradient is additive across the twin networks due to the tied weights"
       (&sect;3.2) &mdash; the two passes contribute to the same shared parameters.</p>
       <p><b>4. One-shot N-way classification (&sect;4.3).</b> Now the payoff, with <b>no retraining</b>. You
       get a test image $x$ and a <b>support set</b> of one labelled image per candidate class,
       $\\{x_c\\}_{c=1}^{C}$. Score $x$ against each support image with the trained head to get $p(c)$, the
       similarity to class $c$. Predict the class with the highest score: $C^{*} = \\arg\\max_c\\, p(c)$. If
       verification features learned on known classes are good, they place the test image nearest the support
       image of its true class &mdash; even for classes the network never trained on.</p>`,
    architecture:
      `<p>The paper's <b>best convolutional twin</b> (Fig. 4) is a single encoder applied to each image; the two
       copies join only at the L1 distance. Input is a <b>1-channel 105&times;105</b> binary character image.
       The general form (&sect;3.1): a stack of convolutional layers, each ReLU then $2\\times 2$ max-pool with
       stride 2; the number of filters is a multiple of 16; filter sizes vary and stride is 1. The final conv
       map is flattened to a vector, then a fully-connected layer with a sigmoid gives the embedding $h$.</p>
       <p><b>Best encoder, layer by layer (Fig. 4):</b></p>
       <ul>
        <li><b>Input:</b> 1 @ 105&times;105.</li>
        <li><b>Conv 64 @ 10&times;10</b> + ReLU &rarr; feature maps 64 @ 96&times;96; <b>max-pool 2&times;2</b> &rarr; 64 @ 48&times;48.</li>
        <li><b>Conv 128 @ 7&times;7</b> + ReLU &rarr; 128 @ 42&times;42; <b>max-pool 2&times;2</b> &rarr; 128 @ 21&times;21.</li>
        <li><b>Conv 128 @ 4&times;4</b> + ReLU &rarr; 128 @ 18&times;18; <b>max-pool 2&times;2</b> &rarr; 128 @ 9&times;9.</li>
        <li><b>Conv 256 @ 4&times;4</b> + ReLU &rarr; 256 @ 6&times;6.</li>
        <li><b>Flatten &rarr; fully-connected 4096</b> + sigmoid: this is the embedding vector $h$ (one per twin).</li>
       </ul>
       <p><b>Siamese join:</b> the two 4096-vectors $h_1, h_2$ meet at the <b>L1 component-wise distance</b>
       $|h_1 - h_2|$; a final fully-connected layer with weights $\\alpha_j$ and a sigmoid maps that distance to
       the single output probability $p$. Hyperparameters were searched (Whetlab): filter sizes 3&times;3 to
       20&times;20, filter counts 16&ndash;256, fully-connected widths 128&ndash;4096. In our toy code the same
       structure is shrunk to an 8&times;8 input with two conv+pool blocks and a 64-dim embedding so it runs on
       CPU; the join (abs-difference &rarr; Linear &rarr; sigmoid) is identical to the paper's.</p>`,
    symbols: [
      { sym: "$x_1, x_2$", desc: "the two <b>input images</b> of a pair fed to the twin networks." },
      { sym: "$h_1, h_2$", desc: "the <b>top-layer feature vectors</b> (embeddings) the shared encoder produces for $x_1$ and $x_2$. The paper writes them $h_{1,L-1}$ and $h_{2,L-1}$ &mdash; the hidden vector at the second-to-last layer." },
      { sym: "$h_{1,j}$", desc: "the $j$-th <b>coordinate</b> (one number) of the first image's embedding; $h_{2,j}$ is the same coordinate for the second image." },
      { sym: "$|h_{1,j} - h_{2,j}|$", desc: "the <b>absolute difference</b> in coordinate $j$ &mdash; how far apart the two embeddings are on that one feature. Summing these is the <b>L1 distance</b>." },
      { sym: "$\\alpha_j$", desc: "a <b>learned weight</b> for coordinate $j$: how much that feature's gap matters for the same/different decision. The paper: \"additional parameters that are learned by the model during training, weighting the importance of the component-wise distance.\"" },
      { sym: "$\\sigma$", desc: "the <b>sigmoid</b> function $\\sigma(z) = 1/(1 + e^{-z})$: squashes any real number into $(0, 1)$ so the output reads as a probability." },
      { sym: "$p$", desc: "the network's predicted <b>similarity</b>: a number in $(0, 1)$, the modelled probability that $x_1$ and $x_2$ are the <b>same</b> class." },
      { sym: "$y$", desc: "the <b>pair label</b>: $y = 1$ if the two images are the same class, $y = 0$ if different (&sect;3.2)." },
      { sym: "$\\{x_c\\}_{c=1}^{C}$", desc: "the <b>support set</b>: one labelled example image per candidate class $c$, for $c = 1 \\dots C$. \"N-way\" means $C = N$ classes." },
      { sym: "$p(c)$", desc: "the similarity score between the test image and the support image of class $c$." },
      { sym: "$C^{*}$", desc: "the <b>predicted class</b>: the support class with the highest similarity, $C^{*} = \\arg\\max_c p^{(c)}$ (&sect;4.3). $C$ is the number of candidate classes (\"N-way\" $= C$)." },
      { sym: "$a_{1,m}^{(k)}, a_{2,m}^{(k)}$", desc: "the $k$-th <b>convolutional feature map</b> in a layer for the first / second twin (&sect;3.1), after ReLU and $2\\times 2$ max-pool." },
      { sym: "$\\mathbf{W}_{l-1,l}^{(k)}$", desc: "the <b>shared convolution weights</b> (a 3-D tensor of filters) connecting layer $l-1$ to layer $l$; the $\\star$ is the <b>valid convolution</b>; $\\mathbf{b}_l$ is the layer's bias." },
      { sym: "$\\mathbf{h}_{(l-1)}$", desc: "the <b>activations of the previous layer</b> $l-1$ fed into the convolution; $h_{1,L-1}^{(j)}$ is coordinate $j$ of the final ($L-1$) feature vector." },
      { sym: "$\\mathcal{L}$", desc: "the <b>regularized binary cross-entropy loss</b> on a pair (&sect;3.2): the log-loss of the verifier plus the $L2$ penalty." },
      { sym: "$\\mathbf{y}, \\mathbf{p}$", desc: "the minibatch <b>label vector</b> ($y=1$ same class, $y=0$ different, &sect;3.2) and the verifier's <b>predicted-probability vector</b>; $x_1^{(i)}, x_2^{(i)}$ are the $i$-th pair in the minibatch." },
      { sym: "$\\boldsymbol{\\lambda}^{T}|\\mathbf{w}|^2$", desc: "the <b>$L2$ weight-regularization</b> term; $\\lambda_j$ is the layer-wise penalty weight, $\\mathbf{w}$ the network weights (&sect;3.2)." },
      { sym: "$\\Delta \\mathbf{w}_{kj}^{(T)}$", desc: "the <b>weight update step</b> at epoch $T$ for weight $w_{kj}$; $\\nabla w_{kj}$ is the loss gradient w.r.t. that weight (&sect;3.2)." },
      { sym: "$\\eta_j, \\mu_j$", desc: "the <b>per-layer learning rate</b> $\\eta_j$ (decayed by 1%/epoch, $\\eta_j^{(T)}=0.99\\,\\eta_j^{(T-1)}$) and <b>momentum</b> $\\mu_j$ (ramped up linearly), &sect;3.2." },
      { sym: "$T = (\\theta, \\rho_x, \\rho_y, s_x, s_y, t_x, t_y)$", desc: "a random <b>affine distortion</b> (rotation $\\theta$, shear $\\rho$, scale $s$, translation $t$) applied independently to each image for augmentation (&sect;4.1)." },
      { sym: "“weight tying” / “twin networks”", desc: "plain terms, not symbols: the two encoder copies use <b>the same shared weights</b>, so they compute the identical function on each image." }
    ],
    formula: `$$ a_{1,m}^{(k)} = \\text{max-pool}\\!\\Big( \\max\\big(0,\\; \\mathbf{W}_{l-1,l}^{(k)} \\star \\mathbf{h}_{1,(l-1)} + \\mathbf{b}_l \\big),\\; 2 \\Big), \\qquad a_{2,m}^{(k)} = \\text{max-pool}\\!\\Big( \\max\\big(0,\\; \\mathbf{W}_{l-1,l}^{(k)} \\star \\mathbf{h}_{2,(l-1)} + \\mathbf{b}_l \\big),\\; 2 \\Big) $$
       <p class="cap">&sect;3.1 &mdash; one convolutional layer of each twin: $k$-th filter map = ReLU ($\\max(0,\\cdot)$) of the valid convolution ($\\star$) of shared weights $\\mathbf{W}_{l-1,l}^{(k)}$ with the previous layer $\\mathbf{h}_{(l-1)}$ plus bias $\\mathbf{b}_l$, then $2\\times 2$ max-pooling. The <b>same</b> $\\mathbf{W}$ and $\\mathbf{b}$ act on both twins (weight tying).</p>

       $$ p \\;=\\; \\sigma\\!\\left( \\sum_{j} \\alpha_j \\,\\big| h_{1,L-1}^{(j)} - h_{2,L-1}^{(j)} \\big| \\right) $$
       <p class="cap">&sect;3.1 &mdash; the similarity head: weighted $L1$ distance between the two twins' final feature vectors (layer $L-1$), one learned weight $\\alpha_j$ per coordinate, through a sigmoid $\\sigma$ to a probability $p \\in (0,1)$ that the pair is the <b>same</b> class.</p>

       $$ \\mathcal{L}(x_1^{(i)}, x_2^{(i)}) \\;=\\; \\mathbf{y}(x_1^{(i)}, x_2^{(i)}) \\log \\mathbf{p}(x_1^{(i)}, x_2^{(i)}) \\;+\\; \\big(1 - \\mathbf{y}(x_1^{(i)}, x_2^{(i)})\\big) \\log\\big(1 - \\mathbf{p}(x_1^{(i)}, x_2^{(i)})\\big) \\;+\\; \\boldsymbol{\\lambda}^{T} |\\mathbf{w}|^2 $$
       <p class="cap">&sect;3.2 &mdash; the regularized binary cross-entropy objective on the verifier: same-class label $y=1$ rewards large $p$, different-class label $y=0$ rewards small $p$, plus an $L2$ weight penalty $\\boldsymbol{\\lambda}^{T}|\\mathbf{w}|^2$ (layer-wise weights $\\lambda_j$).</p>

       $$ \\mathbf{w}_{kj}^{(T)}(x_1^{(i)}, x_2^{(i)}) = \\mathbf{w}_{kj}^{(T)} + \\Delta \\mathbf{w}_{kj}^{(T)}(x_1^{(i)}, x_2^{(i)}) + 2\\lambda_j |\\mathbf{w}_{kj}|, \\qquad \\Delta \\mathbf{w}_{kj}^{(T)}(x_1^{(i)}, x_2^{(i)}) = -\\eta_j \\nabla w_{kj}^{(T)} + \\mu_j \\Delta \\mathbf{w}_{kj}^{(T-1)} $$
       <p class="cap">&sect;3.2 &mdash; the SGD update at epoch $T$: weight $w_{kj}$ (between neuron $j$ and neuron $k$ in the next layer) moves by a momentum step $\\Delta w_{kj}$ (learning rate $\\eta_j$ on the gradient $\\nabla w_{kj}$ plus momentum $\\mu_j$ times the previous step) and the $L2$ shrink $2\\lambda_j|w_{kj}|$.</p>

       $$ \\eta_j^{(T)} \\;=\\; 0.99\\,\\eta_j^{(T-1)} $$
       <p class="cap">&sect;3.2 &mdash; learning-rate schedule: the per-layer rate is decayed uniformly by 1% each epoch (momentum is instead increased linearly toward its target $\\mu_j$).</p>

       $$ \\mathbf{x}_1' = T_1(\\mathbf{x}_1), \\quad \\mathbf{x}_2' = T_2(\\mathbf{x}_2), \\qquad T = (\\theta,\\, \\rho_x,\\, \\rho_y,\\, s_x,\\, s_y,\\, t_x,\\, t_y) $$
       <p class="cap">&sect;4.1 &mdash; data augmentation: each image of a pair gets its own random affine transform $T$ (rotation $\\theta$, shear $\\rho$, scale $s$, translation $t$); each component is applied with probability 0.5.</p>

       $$ C^{*} \\;=\\; \\arg\\max_{c}\\; \\mathbf{p}^{(c)} $$
       <p class="cap">&sect;4.3 &mdash; the one-shot $N$-way rule: given a test image $\\mathbf{x}$ and a support set of one example $\\mathbf{x}_c$ per candidate class $c=1\\dots C$, score each pair and predict the class of highest similarity. No retraining.</p>`,
    whatItDoes:
      `<p>Read it inside-out. For each coordinate $j$, take the <b>absolute gap</b> between the two embeddings,
       $|h_{1,j} - h_{2,j}|$ &mdash; small if the two images agree on that feature, large if they disagree.
       Multiply by the learned importance $\\alpha_j$ and <b>add up</b> across all coordinates: that weighted
       sum is a single distance-like score. Feed it through the <b>sigmoid</b> $\\sigma$ to get a number $p$
       between $0$ and $1$, the predicted probability the two images are the <b>same</b> class.</p>
       <p>After training, the learned $\\alpha_j$ orient the head so that <b>small total distance gives high
       $p$</b> (likely same) and <b>large distance gives low $p$</b> (likely different). The $\\alpha_j$ let the
       model up-weight discriminative features and ignore noisy ones &mdash; it does not treat every coordinate
       equally.</p>
       <p><b>The conv equations (&sect;3.1)</b> just say how each $h$ is built: every layer is "convolve with shared
       filters, add bias, ReLU, then halve the resolution with $2\\times 2$ max-pool" &mdash; and the <i>same</i>
       $\\mathbf{W},\\mathbf{b}$ run on both twins. <b>The loss $\\mathcal{L}$ (&sect;3.2)</b> is ordinary
       logistic log-loss: when the pair really is the same ($y=1$) it scores $\\log p$ (so the optimizer pushes
       $p$ up); when different ($y=0$) it scores $\\log(1-p)$ (pushes $p$ down); the extra $\\boldsymbol{\\lambda}^T|\\mathbf{w}|^2$
       gently shrinks the weights to fight overfitting. <b>The update equation</b> is plain momentum SGD with an
       $L2$ shrink: each weight moves opposite its gradient (rate $\\eta_j$), keeps a fraction $\\mu_j$ of last
       step's motion, and is pulled toward zero by $2\\lambda_j|w_{kj}|$; the rate decays 1%/epoch. <b>The
       one-shot rule (&sect;4.3)</b> reuses the trained head as-is: score the query against each support image and
       take the $\\arg\\max$ &mdash; the single highest-similarity class wins.</p>`,
    derivation:
      `<p><b>Short recap &mdash; full metric-learning math lives in the concept lesson.</b> Why does a
       <i>similarity</i> objective (rather than a classifier) generalize to brand-new classes? A normal
       softmax classifier learns one fixed output slot per training class, so it has <i>no</i> slot for a class
       it never saw. A Siamese net learns a <b>comparison function</b> $p(x_1, x_2)$ instead. Comparison does
       not mention any class name &mdash; it only asks "are these two the same?". If the encoder has learned
       features that make that question answerable for known classes (edges, strokes, parts), those same
       features answer it for unknown classes too. So one-shot classification reduces to: embed everything,
       then pick the nearest support example. The sigmoid + binary-cross-entropy choice is exactly the
       standard logistic-regression setup, here applied to the weighted-L1 distance as its input score; the
       general "learn an embedding so that distance encodes class identity" argument is derived in full in the
       <b>fs-metric-learning</b> concept lesson &mdash; we only recap it here.</p>`,
    example:
      `<p>Work the similarity head $p = \\sigma(\\sum_j \\alpha_j |h_{1,j} - h_{2,j}|)$ by hand on tiny
       3-dimensional embeddings, with <b>learned</b> weights $\\alpha = [-2.0,\\,-1.0,\\,-0.5]$. (Training made
       them negative here so that <i>more</i> distance gives a <i>lower</i> "same" probability &mdash; the sign is
       whatever training finds.) Recall $\\sigma(z) = 1/(1 + e^{-z})$. We score two pairs &mdash; one close
       (same class), one far (different class) &mdash; coordinate by coordinate:</p>
       <table class="extable">
        <caption>Per-coordinate L1 head, $z = \\sum_j \\alpha_j\\,|h_{1,j}-h_{2,j}|$, for a close pair and a far pair.</caption>
        <thead><tr><th>coord $j$</th><th class="num">$\\alpha_j$</th><th class="num">close $|h_{1,j}-h_{2,j}|$</th><th class="num">close $\\alpha_j\\cdot$gap</th><th class="num">far $|h_{1,j}-h_{2,j}|$</th><th class="num">far $\\alpha_j\\cdot$gap</th></tr></thead>
        <tbody>
         <tr><td class="row-h">1</td><td class="num">$-2.0$</td><td class="num">$0.02$</td><td class="num">$-0.040$</td><td class="num">$0.8$</td><td class="num">$-1.60$</td></tr>
         <tr><td class="row-h">2</td><td class="num">$-1.0$</td><td class="num">$0.04$</td><td class="num">$-0.040$</td><td class="num">$0.5$</td><td class="num">$-0.50$</td></tr>
         <tr><td class="row-h">3</td><td class="num">$-0.5$</td><td class="num">$0.05$</td><td class="num">$-0.025$</td><td class="num">$0.7$</td><td class="num">$-0.35$</td></tr>
         <tr><td class="row-h">$z$ (sum)</td><td class="num">&mdash;</td><td class="num">&mdash;</td><td class="num">$-0.105$</td><td class="num">&mdash;</td><td class="num">$-2.45$</td></tr>
        </tbody>
       </table>
       <p><b>A same-class pair</b> (embeddings close): $h_1 = [0.80,\\,0.30,\\,0.55]$, $h_2 = [0.78,\\,0.34,\\,0.50]$.</p>
       <ul class="steps">
        <li><b>Coordinate gaps</b> $|h_1 - h_2| = [\\,|0.80-0.78|,\\;|0.30-0.34|,\\;|0.55-0.50|\\,] = [0.02,\\,0.04,\\,0.05]$.</li>
        <li><b>Weighted sum</b> $z = (-2.0)(0.02) + (-1.0)(0.04) + (-0.5)(0.05) = -0.040 - 0.040 - 0.025 = -0.105$.</li>
        <li><b>Sigmoid</b> $p = \\sigma(-0.105) = 1/(1 + e^{0.105}) \\approx 1/2.111 \\approx 0.474$. Close embeddings
        &rarr; a relatively <b>high</b> score.</li>
       </ul>
       <p><b>A different-class pair</b> (embeddings far apart): $h_1 = [0.9,\\,0.2,\\,0.8]$, $h_2 = [0.1,\\,0.7,\\,0.1]$.</p>
       <ul class="steps">
        <li><b>Coordinate gaps</b> $|h_1 - h_2| = [0.8,\\,0.5,\\,0.7]$.</li>
        <li><b>Weighted sum</b> $z = (-2.0)(0.8) + (-1.0)(0.5) + (-0.5)(0.7) = -1.60 - 0.50 - 0.35 = -2.45$.</li>
        <li><b>Sigmoid</b> $p = \\sigma(-2.45) = 1/(1 + e^{2.45}) \\approx 1/12.588 \\approx 0.079$. Far embeddings
        &rarr; a <b>low</b> score.</li>
       </ul>
       <p>The same pair ($0.474$) outscores the different pair ($0.079$), so an $\\arg\\max$ over support items
       would pick the same-class one. These exact numbers are recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Build ONE encoder</b> (a small CNN ending in an embedding vector). Call it twice &mdash; once per
        image &mdash; so the twin weights are shared automatically.</li>
        <li><b>Build the head:</b> $l1 = |h_1 - h_2|$, then $p = \\sigma(\\,\\texttt{Linear}(l1)\\,)$ where the
        linear layer's weights are the learned $\\alpha_j$.</li>
        <li><b>Sample pairs:</b> half <b>same-class</b> ($y = 1$), half <b>different-class</b> ($y = 0$).</li>
        <li><b>Train</b> the encoder + head together with <b>binary cross-entropy</b> on those labels.</li>
        <li><b>One-shot test:</b> for a query, score it against one support image per class; predict
        $C^{*} = \\arg\\max_c p(c)$. Report N-way accuracy vs the $1/N$ chance baseline.</li>
        <li><b>Ablate:</b> evaluate the <i>untrained</i> encoder (random weights, same architecture) the same
        way &mdash; it should sit near chance, isolating training as the cause.</li>
      </ol>`,
    results:
      `<p>On <b>Omniglot</b> (1623 handwritten characters across 50 alphabets), the paper evaluates a
       <b>20-way within-alphabet one-shot</b> task: one support example per class, 400 trials (&sect;4.3). From
       <b>Table 2</b>, best one-shot 20-way test accuracy:</p>
       <ul>
        <li><b>Convolutional Siamese Net: 92.0%</b> (the paper's method)</li>
        <li>Humans: 95.5% &nbsp;&middot;&nbsp; Hierarchical Bayesian Program Learning (HBPL): 95.2%</li>
        <li>Non-convolutional Siamese Net: 58.3% &nbsp;&middot;&nbsp; 1-Nearest Neighbor baseline: 21.7%
        (just above the $1/20 = 5\\%$ chance level)</li>
       </ul>
       <p>The paper: "At 92 percent our convolutional method is stronger than any model except HBPL itself"
       (&sect;4.3). They also report a <b>MNIST 10-way one-shot</b> transfer (Table 3): the convolutional
       Siamese net scores <b>70.3%</b> vs a 1-Nearest-Neighbor baseline of 26.5% &mdash; trained only on
       Omniglot, never on MNIST.</p>
       <p><i>These are the paper's reported figures, quoted from its tables. The numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's reported numbers.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The headline number is <b>N-way one-shot accuracy</b>: per trial, one
       support image per class, predict $C^{*} = \\arg\\max_c p(c)$, average over many trials. The paper's setup is
       the <b>20-way within-alphabet</b> task on Omniglot, 400 trials (&sect;4.3). Define "better than trivial"
       against the right floor: $N$-way one-shot chance is $1/N$ (5% for 20-way, 20% for 5-way), and the paper's
       own <b>1-Nearest-Neighbor baseline (21.7%)</b> is the weak-learned-feature bar your verifier must clear.</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) Overfit a tiny set of same/different pairs and watch BCE
        fall toward $0$ &mdash; if it can't, the head or label wiring is broken. (2) At init, an untrained verifier
        outputs $p \\approx 0.5$ on random pairs, so BCE should start near $-\\ln(1/2) \\approx 0.693$ (rule of thumb).
        (3) Check the head is symmetric: $p(x_1, x_2) = p(x_2, x_1)$, since $|h_1 - h_2|$ is symmetric. (4) Confirm
        $p \\in (0, 1)$ (sigmoid applied) and that a same-class pair scores higher than a hand-built far pair &mdash;
        reuse the worked example ($p \\approx 0.474$ close vs $0.079$ far).</li>
        <li><b>Expected range.</b> A correct convolutional Siamese net should reach roughly the paper's
        <b>92.0% 20-way one-shot on Omniglot</b> (Table 2, approximate target &mdash; the paper's figure), with the
        non-convolutional variant far lower at 58.3%. On our toy digit run expect 5-way around <b>0.88</b> (our
        small run, not the paper). Sitting near the $1/N$ floor means it isn't learning; landing between chance and
        the target is usually tuning (LR, pair balance, epochs), not a structural bug.</li>
        <li><b>Ablations &mdash; prove the key idea earns its keep.</b> The central component is the <b>trained
        verification metric</b> over a <b>tied (shared-weight) encoder</b>. Turn it off two ways: (1) evaluate the
        <i>untrained</i> encoder (random weights, same architecture, same one-shot protocol) &mdash; accuracy
        should drop near chance, as in the lesson's ablation (~0.40 for 5-way vs 0.88 trained). (2) Untie the
        weights (two separate encoders) and watch one-shot accuracy degrade &mdash; weight tying is what keeps
        similar images mapped close.</li>
        <li><b>Failure signals &amp; what they mean.</b> Accuracy stuck at $1/N$ &rarr; verifier never learned
        (LR off, labels shuffled, or support images leaked into training so it memorized instead of generalizing).
        Verifier always predicts "different" (low $p$ everywhere) &rarr; unbalanced pairs flooded it with negatives;
        rebalance to ~50/50. BCE NaN &rarr; logits fed to <code>nn.BCELoss</code> instead of probabilities (missing
        sigmoid), or LR too high. Train BCE good but one-shot poor &rarr; leakage or comparing against the wrong
        chance baseline (remember chance is $1/N$, not 50%).</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>, <code>nn.Linear</code>,
       <code>nn.ReLU</code> / <code>F.max_pool2d</code>, <code>torch.sigmoid</code>,
       <code>nn.BCELoss</code>, and the optimizer. <b>Build by hand:</b> (1) the <b>twin shared-weight
       encoder</b> &mdash; one module called twice; (2) the <b>weighted-L1 + sigmoid head</b>
       $p = \\sigma(\\sum_j \\alpha_j |h_{1,j} - h_{2,j}|)$, implemented as <code>sigmoid(Linear(abs(h1 - h2)))</code>;
       (3) the <b>same/different pair sampler</b> and BCE training loop; (4) the <b>one-shot
       $\\arg\\max$ decision rule</b> over a support set; and (5) the <b>ablation</b> (untrained encoder). The
       metric-learning rationale is recapped from the fs-metric-learning concept lesson, not re-derived.</p>
       <p><i>Scope note:</i> the paper's hardest claim is generalizing to <b>entirely new classes</b>, which
       needs many training classes (Omniglot has thousands of characters). Our toy run uses only ten digit
       classes, so it demonstrates the <b>verification &rarr; one-shot</b> mechanism by holding out test
       <i>images</i> the encoder never trained on, then doing N-way one-shot over them &mdash; the same
       pipeline, at toy scale.</p>`,
    pitfalls:
      `<ul>
        <li><b>Two separate encoders instead of one.</b> If you build <code>enc1</code> and <code>enc2</code> as
        distinct modules, the weights are <b>not tied</b> and the twin property is broken &mdash; similar images
        can map far apart. <b>Fix:</b> build <i>one</i> encoder and call it twice; the shared parameters and the
        additive gradient come for free.</li>
        <li><b>Feeding raw logits to <code>BCELoss</code>.</b> <code>nn.BCELoss</code> expects a probability in
        $(0,1)$, so you must apply the sigmoid first; <code>nn.BCEWithLogitsLoss</code> expects the raw score
        instead (and applies sigmoid internally). Mixing them double-applies or omits the sigmoid. <b>Fix:</b>
        pick one convention consistently.</li>
        <li><b>Unbalanced pairs.</b> Random pairs are mostly <i>different</i> (there are far more cross-class
        than same-class pairs), so naive sampling floods the model with negatives and it learns to always
        predict "different." <b>Fix:</b> sample roughly 50/50 same vs different, as we do.</li>
        <li><b>Leaking support images into training.</b> If one-shot support / query images were seen during
        pair training, the accuracy is inflated and does not measure generalization. <b>Fix:</b> draw the
        one-shot images from a held-out split (held-out classes, like the paper; or at least held-out
        instances, as in our toy run) and say which you used.</li>
        <li><b>Confusing the score's direction.</b> Higher $p$ means <b>more similar</b> (same class). The
        learned $\\alpha_j$ can be negative so that larger distance gives lower $p$; do not assume a fixed sign
        &mdash; trust the trained output and take $\\arg\\max p$, not $\\arg\\min$.</li>
        <li><b>Comparing to the wrong chance baseline.</b> N-way one-shot chance is $1/N$, not 50%. A 20-way
        score must beat $5\\%$; a 5-way score must beat $20\\%$. State $N$ whenever you quote one-shot accuracy.</li>
      </ul>`,
    recall: [
      "Write the similarity head equation $p = \\sigma(\\sum_j \\alpha_j |h_{1,j} - h_{2,j}|)$ from memory.",
      "Why does sharing weights between the twin networks matter?",
      "State the one-shot decision rule $C^{*} = \\arg\\max_c p(c)$ and what the support set is.",
      "What is chance accuracy for an N-way one-shot task, and why is verification trained instead of classification?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a trained Siamese net that does 5-way one-shot well above the
            $1/5 = 20\\%$ chance level. Now evaluate an <b>untrained</b> encoder &mdash; same architecture,
            random weights, no training &mdash; with the identical one-shot procedure. What accuracy do you
            expect, and what does the gap between trained and untrained demonstrate?`,
        steps: [
          { do: `Keep the architecture, support-set protocol, query images, and trial count identical; only skip the training loop (random initial weights).`, why: `An honest ablation changes exactly one thing &mdash; whether the encoder was trained &mdash; so any difference is attributable to training the verification metric.` },
          { do: `Run the same N-way one-shot eval and read the accuracy. Expect it near &mdash; or only modestly above &mdash; the $1/N$ chance line.`, why: `Random features carry little class structure, so nearest-by-similarity is close to guessing; any small lift is incidental separability of the toy images.` },
          { do: `Compare to the trained net's accuracy and attribute the gap to the learned similarity metric.`, why: `Same architecture and protocol, so the only cause of the much higher trained accuracy is that binary-cross-entropy training shaped the embedding + $\\alpha_j$ into a useful metric.` }
        ],
        answer: `<p>The untrained encoder sits near chance (in our run about <b>0.40</b> for 5-way, vs the
                 $0.20$ floor), while the trained net reaches roughly <b>0.88</b>. Since architecture and
                 protocol are identical, the large gap isolates <b>training the verification metric</b> as the
                 cause &mdash; not the architecture, the support-set trick, or the data. The CODEVIZ panel shows
                 this contrast (our small run, not the paper's numbers).</p>`
      },
      {
        q: `Plug numbers through the head. Two embeddings are $h_1 = [0.6,\\,0.1,\\,0.4]$ and
            $h_2 = [0.5,\\,0.3,\\,0.4]$, with learned weights $\\alpha = [-2.0,\\,-1.0,\\,-0.5]$. Compute the
            similarity $p = \\sigma(\\sum_j \\alpha_j |h_{1,j} - h_{2,j}|)$.`,
        steps: [
          { do: `Coordinate gaps: $|h_1 - h_2| = [\\,|0.6-0.5|,\\,|0.1-0.3|,\\,|0.4-0.4|\\,] = [0.1,\\,0.2,\\,0.0]$.`, why: `The L1 head works coordinate-by-coordinate on absolute differences.` },
          { do: `Weighted sum: $z = (-2.0)(0.1) + (-1.0)(0.2) + (-0.5)(0.0) = -0.2 - 0.2 - 0 = -0.4$.`, why: `Multiply each gap by its learned $\\alpha_j$ and add, exactly as in Section 3.1.` },
          { do: `Sigmoid: $p = \\sigma(-0.4) = 1/(1 + e^{0.4}) \\approx 0.401$.`, why: `The sigmoid maps the weighted distance to a probability in $(0,1)$.` }
        ],
        answer: `<p>$|h_1 - h_2| = [0.1, 0.2, 0.0]$, weighted sum $z = -0.4$, so
                 $p = \\sigma(-0.4) \\approx \\mathbf{0.401}$. A moderate distance gives a middling similarity,
                 between the close-pair and far-pair cases of the worked example.</p>`
      },
      {
        q: `In a one-shot trial the test image scores these similarities against the four support images
            (4-way): $p = [0.31,\\, 0.77,\\, 0.62,\\, 0.20]$ for classes $A, B, C, D$. Which class does the
            model predict, and what is chance accuracy here? If the true class is $B$, is the trial correct?`,
        steps: [
          { do: `Apply the decision rule $C^{*} = \\arg\\max_c p(c)$: the largest score is $0.77$ at class $B$.`, why: `One-shot prediction is the support class with the highest similarity &mdash; not a threshold, just the max.` },
          { do: `Chance for 4-way one-shot is $1/4 = 25\\%$.`, why: `With one example per class and $N=4$ classes, random guessing is $1/N$.` },
          { do: `Compare prediction ($B$) to the true class ($B$).`, why: `Accuracy counts a trial correct only when the $\\arg\\max$ class equals the true class.` }
        ],
        answer: `<p>The model predicts <b>class $B$</b> (highest similarity, $0.77$). Chance accuracy is
                 $1/4 = 25\\%$. Since the true class is $B$, the trial is <b>correct</b>. Note the prediction
                 uses the $\\arg\\max$ of $p$, so the absolute values do not need to exceed any threshold &mdash;
                 only their ranking matters.</p>`
      }
    ]
  });

  window.CODE["paper-siamese"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the twin shared-weight encoder, the weighted-L1 + sigmoid head, the
       same/different pair sampler, the binary-cross-entropy training loop, and the N-way one-shot
       $\\arg\\max$ rule by hand on top of <code>nn.Conv2d</code> / <code>nn.Linear</code>. The task is a
       <b>tiny digit set</b> (scikit-learn's 8&times;8 <code>load_digits</code>, 1797 images, no download) so
       it runs in seconds on CPU. We split images into a 70% train / 30% held-out set, train the verifier on
       same/different pairs from the train split, then do N-way one-shot using <b>only held-out images</b> as
       support and query &mdash; images the encoder never saw. The first cell recomputes the worked example
       ($p \\approx 0.474$ for the close pair, $0.079$ for the far pair). We print one-shot accuracy each epoch
       and the final 2-/5-/10-way numbers vs their $1/N$ chance lines, plus the <b>untrained-encoder
       ablation</b>. Paste into Colab (or run locally with scikit-learn) and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import random
from sklearn.datasets import load_digits

torch.manual_seed(0); random.seed(0)

# --- 0. Sanity-check the lesson's worked example: p = sigmoid(sum_j alpha_j |h1_j - h2_j|). ---
alpha = torch.tensor([-2.0, -1.0, -0.5])               # learned weights (negative here)
def head(h1, h2):                                      # the paper's Section 3.1 similarity head
    return torch.sigmoid((alpha * (h1 - h2).abs()).sum())
same = head(torch.tensor([0.80, 0.30, 0.55]), torch.tensor([0.78, 0.34, 0.50]))
diff = head(torch.tensor([0.9, 0.2, 0.8]),    torch.tensor([0.1, 0.7, 0.1]))
print(f"worked example:  same-pair p = {same:.3f}   diff-pair p = {diff:.3f}")
# worked example:  same-pair p = 0.474   diff-pair p = 0.079

# --- 1. A tiny digit task: scikit-learn 8x8 digits (no download). Disjoint train / held-out images. ---
digits = load_digits()
imgs   = torch.tensor(digits.images, dtype=torch.float32) / 16.0     # (1797, 8, 8) in [0, 1]
labels = torch.tensor(digits.target, dtype=torch.long)              # 10 classes (0-9)
N = len(labels); perm = list(range(N)); random.Random(7).shuffle(perm)
cut = int(0.7 * N)
Xtr, ytr = imgs[perm[:cut]], labels[perm[:cut]]                     # train the verifier on these
Xte, yte = imgs[perm[cut:]], labels[perm[cut:]]                     # one-shot uses ONLY these held-out images

# --- 2. ONE encoder = shared (tied) weights. Call it twice -> the twin networks. ---
class Encoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.fc    = nn.Linear(32 * 2 * 2, 64)
    def forward(self, x):
        x = F.max_pool2d(F.relu(self.conv1(x)), 2)     # 8 -> 4
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)     # 4 -> 2
        return torch.sigmoid(self.fc(x.flatten(1)))    # embedding h in (0, 1)^64

# --- 3. Siamese net: weighted-L1 distance + sigmoid (Section 3.1). ---
class Siamese(nn.Module):
    def __init__(self):
        super().__init__()
        self.enc   = Encoder()                          # ONE encoder -> weights are tied
        self.alpha = nn.Linear(64, 1)                   # the learned alpha_j (Section 3.1)
    def encode(self, x): return self.enc(x.unsqueeze(1))
    def forward(self, x1, x2):
        h1, h2 = self.encode(x1), self.encode(x2)
        l1 = torch.abs(h1 - h2)                         # |h1 - h2|, coordinate-wise
        return torch.sigmoid(self.alpha(l1)).squeeze(1) # p = sigmoid( sum_j alpha_j |h1_j - h2_j| )

def make_pairs(X, y, n, seed):                          # balanced same/different pairs (Section 3.2)
    rng = random.Random(seed); by = {}
    for i, c in enumerate(y.tolist()): by.setdefault(c, []).append(i)
    cls = list(by.keys()); a, b, lab = [], [], []
    for _ in range(n):
        if rng.random() < 0.5:                          # SAME pair -> label 1
            c = rng.choice(cls); i, j = rng.sample(by[c], 2); t = 1.0
        else:                                           # DIFFERENT pair -> label 0
            c1, c2 = rng.sample(cls, 2)
            i = rng.choice(by[c1]); j = rng.choice(by[c2]); t = 0.0
        a.append(i); b.append(j); lab.append(t)
    return X[a], X[b], torch.tensor(lab)

def oneshot(net, X, y, n_way, trials, seed=123):        # N-way one-shot: C* = argmax_c p(c) (Section 4.3)
    rng = random.Random(seed); by = {}
    for i, c in enumerate(y.tolist()): by.setdefault(c, []).append(i)
    classes = list(by.keys()); net.eval(); correct = 0
    with torch.no_grad():
        for _ in range(trials):
            ways = rng.sample(classes, n_way); true = rng.choice(ways)
            support = [rng.choice(by[c]) for c in ways]            # 1 example per class
            qi = rng.choice([k for k in by[true] if k not in support])
            q = X[qi].unsqueeze(0).repeat(n_way, 1, 1); s = X[support]
            if int(torch.argmax(net(q, s))) == ways.index(true): correct += 1
    return correct / trials

net = Siamese(); opt = torch.optim.Adam(net.parameters(), lr=1e-3); bce = nn.BCELoss()

# --- 4. ABLATION baseline: untrained (random) encoder, same one-shot eval. ---
print(f"untrained 5-way one-shot = {oneshot(net, Xte, yte, 5, 1000):.3f}   (chance = 1/5 = 0.200)")

# --- 5. Train the verifier on same/different pairs, watch one-shot accuracy climb. ---
for ep in range(10):
    net.train(); tot = 0.0
    for s in range(40):
        x1, x2, t = make_pairs(Xtr, ytr, 128, ep * 40 + s)
        opt.zero_grad(); loss = bce(net(x1, x2), t); loss.backward(); opt.step(); tot += loss.item()
    print(f"  epoch {ep}  bce {tot/40:.4f}  5-way one-shot {oneshot(net, Xte, yte, 5, 1000):.3f}")

print("FINAL one-shot on HELD-OUT images (encoder never saw them):")
for nway in [2, 5, 10]:
    print(f"  {nway}-way one-shot = {oneshot(net, Xte, yte, nway, 2000):.3f}   chance = {1.0/nway:.3f}")
# Our small run: trained 5-way ~0.88 vs untrained ~0.40 and chance 0.20.
# Numbers vary by hardware/seed; this is our small run, not the paper's reported number.`
  };

  window.CODEVIZ["paper-siamese"] = {
    question: "As we train the same/different verifier, does N-way one-shot accuracy on held-out images rise far above the 1/N chance baseline?",
    charts: [
      {
        type: "line",
        title: "5-way one-shot accuracy vs training epoch (held-out digit images)",
        xlabel: "epoch",
        ylabel: "5-way one-shot accuracy",
        series: [
          {
            name: "Trained Siamese (one-shot acc)",
            color: "#7ee787",
            points: [[0,0.574],[1,0.610],[2,0.721],[3,0.737],[4,0.770],[5,0.791],[6,0.827],[7,0.834],[8,0.873],[9,0.876]]
          },
          {
            name: "Untrained encoder (ablation)",
            color: "#ff7b72",
            points: [[0,0.396],[1,0.396],[2,0.396],[3,0.396],[4,0.396],[5,0.396],[6,0.396],[7,0.396],[8,0.396],[9,0.396]]
          },
          {
            name: "Chance (1/5)",
            color: "#8b949e",
            points: [[0,0.200],[1,0.200],[2,0.200],[3,0.200],[4,0.200],[5,0.200],[6,0.200],[7,0.200],[8,0.200],[9,0.200]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A twin shared-weight encoder + weighted-L1/sigmoid head trained with binary cross-entropy on same/different pairs of scikit-learn 8&times;8 digits. One-shot evaluation uses only HELD-OUT images (a 30% split the encoder never trained on), support = 1 image per class, prediction = argmax similarity. As the verification loss drops (BCE 0.68 &rarr; 0.25), 5-way one-shot accuracy climbs from 0.57 to 0.88 &mdash; far above the 1/5 = 0.20 chance line and far above the matched UNTRAINED encoder (0.40). Final N-way: 2-way 0.964 (chance 0.50), 5-way 0.879 (chance 0.20), 10-way 0.782 (chance 0.10). The trained verification metric is what carries one-shot accuracy.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, random
from sklearn.datasets import load_digits
torch.manual_seed(0); random.seed(0)

digits = load_digits()
imgs   = torch.tensor(digits.images, dtype=torch.float32) / 16.0
labels = torch.tensor(digits.target, dtype=torch.long)
N = len(labels); perm = list(range(N)); random.Random(7).shuffle(perm)
cut = int(0.7 * N)
Xtr, ytr = imgs[perm[:cut]], labels[perm[:cut]]
Xte, yte = imgs[perm[cut:]], labels[perm[cut:]]        # one-shot uses ONLY held-out images

class Encoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.fc    = nn.Linear(32 * 2 * 2, 64)
    def forward(self, x):
        x = F.max_pool2d(F.relu(self.conv1(x)), 2)
        x = F.max_pool2d(F.relu(self.conv2(x)), 2)
        return torch.sigmoid(self.fc(x.flatten(1)))

class Siamese(nn.Module):                               # weighted-L1 + sigmoid head, tied encoder
    def __init__(self):
        super().__init__(); self.enc = Encoder(); self.alpha = nn.Linear(64, 1)
    def encode(self, x): return self.enc(x.unsqueeze(1))
    def forward(self, x1, x2):
        h1, h2 = self.encode(x1), self.encode(x2)
        return torch.sigmoid(self.alpha(torch.abs(h1 - h2))).squeeze(1)

def make_pairs(X, y, n, seed):
    rng = random.Random(seed); by = {}
    for i, c in enumerate(y.tolist()): by.setdefault(c, []).append(i)
    cls = list(by.keys()); a, b, lab = [], [], []
    for _ in range(n):
        if rng.random() < 0.5:
            c = rng.choice(cls); i, j = rng.sample(by[c], 2); t = 1.0
        else:
            c1, c2 = rng.sample(cls, 2); i = rng.choice(by[c1]); j = rng.choice(by[c2]); t = 0.0
        a.append(i); b.append(j); lab.append(t)
    return X[a], X[b], torch.tensor(lab)

def oneshot(net, X, y, n_way, trials, seed=123):
    rng = random.Random(seed); by = {}
    for i, c in enumerate(y.tolist()): by.setdefault(c, []).append(i)
    classes = list(by.keys()); net.eval(); correct = 0
    with torch.no_grad():
        for _ in range(trials):
            ways = rng.sample(classes, n_way); true = rng.choice(ways)
            support = [rng.choice(by[c]) for c in ways]
            qi = rng.choice([k for k in by[true] if k not in support])
            q = X[qi].unsqueeze(0).repeat(n_way, 1, 1); s = X[support]
            if int(torch.argmax(net(q, s))) == ways.index(true): correct += 1
    return correct / trials

net = Siamese(); opt = torch.optim.Adam(net.parameters(), lr=1e-3); bce = nn.BCELoss()
print("untrained 5-way one-shot:", round(oneshot(net, Xte, yte, 5, 1000), 3))   # ~0.396 (ablation)
acc = []
for ep in range(10):
    net.train()
    for s in range(40):
        x1, x2, t = make_pairs(Xtr, ytr, 128, ep*40+s)
        opt.zero_grad(); bce(net(x1, x2), t).backward(); opt.step()
    acc.append(round(oneshot(net, Xte, yte, 5, 1000), 3))
print("trained 5-way one-shot per epoch:", acc)        # rises 0.57 -> 0.88
print("final 10-way one-shot:", round(oneshot(net, Xte, yte, 10, 2000), 3))  # ~0.78 vs chance 0.10
# Our small run, not the paper's reported number.`
  };
})();
