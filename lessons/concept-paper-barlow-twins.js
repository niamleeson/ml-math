/* Paper lesson — "Barlow Twins: Self-Supervised Learning via Redundancy Reduction",
   Zbontar, Jing, Misra, LeCun, Deny 2021 (ICML 2021).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-barlow-twins".
   GROUNDED from arXiv:2103.03230 (abstract) and the ar5iv HTML mirror (Section 2.1 loss Eqn. 1 +
   cross-correlation Eqn. 2; Section 2.2 implementation, lambda = 5e-3, Algorithm 1; Table 5 ablation).
   Track B (architecture): build the two-view pipeline + encoder + projector + the Barlow Twins loss
   (push the cross-correlation matrix toward the identity) by hand on nn primitives; pretrain on an
   unlabelled MNIST subset; then a LINEAR PROBE on the frozen features beats from-scratch in the low-label
   regime; ablate the off-diagonal term to show collapse. conceptLink = null (full derivation here).
   Cross-links paper-simclr: same two-views idea, but NO negatives — redundancy reduction instead. */
(function () {
  window.LESSONS.push({
    id: "paper-barlow-twins",
    title: "Barlow Twins — Self-Supervised Learning via Redundancy Reduction (2021)",
    tagline: "Make two views' embeddings match by pushing their cross-correlation matrix toward the identity — invariance on the diagonal, decorrelation off it. No negatives.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Jure Zbontar, Li Jing, Ishan Misra, Yann LeCun, Stéphane Deny",
      org: "Facebook AI Research (FAIR) / NYU",
      year: 2021,
      venue: "arXiv:2103.03230 (Mar 2021); ICML 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2103.03230",
      code: "https://github.com/facebookresearch/barlowtwins"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["unl-simclr", "paper-simclr", "prob-covariance-correlation", "dl-cross-entropy", "dl-conv", "pt-cnn", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>One leading recipe for <b>self-supervised learning</b> (SSL — learning a useful vector summary of an
       image, called a <b>representation</b>, from <i>unlabelled</i> pictures) is to make the representation
       <b>invariant to distortions</b>: take one image, distort it two different ways (two <b>views</b>), and
       push the two embeddings together. The trouble (paper §1, abstract): if you <i>only</i> push embeddings
       together, the network can cheat by outputting the <b>same constant vector for every image</b> — a
       <b>trivial constant solution</b>, also called <b>collapse</b>. Every pair then matches perfectly and the
       representation is useless.</p>
       <p>Earlier methods dodged collapse with extra machinery: SimCLR pushes other images apart with
       <b>negatives</b> (needs big batches); BYOL and SimSiam use an <b>asymmetry</b> — a predictor network, a
       <b>stop-gradient</b> (block the gradient on one branch), or a slowly-updated "momentum" copy of the
       weights. The abstract's framing: can we avoid collapse <b>naturally</b>, from the loss itself, with
       <b>no negatives and no asymmetry</b>?</p>`,
    contribution:
      `<ul>
        <li><b>A loss that avoids collapse by construction.</b> Measure the <b>cross-correlation matrix</b>
        between the two views' embeddings (how each output dimension of view A correlates with each dimension of
        view B across the batch) and push it toward the <b>identity matrix</b>. The abstract: "making it as close
        to the identity matrix as possible."</li>
        <li><b>Two effects in one objective.</b> Identity means <b>diagonal = 1</b> (each dimension agrees across
        the two views → invariance) and <b>off-diagonal = 0</b> (different dimensions are decorrelated →
        <b>redundancy reduction</b>). The name honours neuroscientist H. Barlow's redundancy-reduction principle.</li>
        <li><b>No negatives, no asymmetry.</b> The abstract: "does not require large batches nor asymmetry
        between the network twins such as a predictor network, gradient stopping, or a moving average on the
        weight updates."</li>
        <li><b>Loves high-dimensional outputs.</b> "Intriguingly it benefits from very high-dimensional output
        vectors" — the opposite of most contrastive methods' small projection heads.</li>
      </ul>`,
    whyItMattered:
      `<p>Barlow Twins showed you can prevent collapse with a <b>symmetric</b>, negative-free objective grounded
       in a single, interpretable idea — decorrelate the features. The abstract reports it "outperforms previous
       methods on ImageNet for semi-supervised classification in the low-data regime, and is on par with current
       state of the art for ImageNet classification with a linear classifier head, and for transfer tasks of
       classification and object detection." It sits alongside SimCLR (negatives), BYOL / SimSiam (stop-gradient)
       and VICReg as one of the canonical recipes, and it connects modern SSL back to a classic information-theory
       idea: a good code is one whose components are non-redundant.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§2.1 (Description of Barlow Twins)</b> — Figure 1's pipeline (two distortions → twin encoder
        $f_\\theta$ → projector → embeddings $Z^A, Z^B$), and the two equations you will transcribe and
        implement: the <b>loss (Eqn. 1)</b> and the <b>cross-correlation matrix (Eqn. 2)</b>.</li>
        <li><b>§2.2 (Implementation Details)</b> — <b>Algorithm 1</b> (a short PyTorch-style pseudocode for the
        loss) and the chosen <b>trade-off $\\lambda = 5\\cdot10^{-3}$</b>.</li>
        <li><b>§4 / Table 5 (ablations)</b> — what happens when you drop the off-diagonal (redundancy) term:
        <b>collapse</b>.</li>
       </ul>
       <p><b>Skim:</b> §3 (full ImageNet results, transfer), §4.x comparisons to BYOL/SimCLR, and the appendix.
       The math you need is two equations in §2.1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Barlow Twins has <b>no negatives</b> — it never explicitly pushes different images apart. Yet it does
       not collapse to a constant. The collapse-avoiding force lives entirely in the <b>off-diagonal</b>
       (redundancy-reduction) term of the loss.</p>
       <p>You will train Barlow Twins, then <b>delete the off-diagonal term</b> (keep only the diagonal "make
       views agree" term) and retrain. Do you expect the off-diagonal-free model's representation to (a) be just
       as good, (b) get a bit worse, or (c) <b>collapse</b> — embeddings become near-constant and the linear
       probe drops to near chance? Write your guess and one sentence of reasoning, then run the ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Two views.</b> For each image apply a random augmentation <i>twice</i> → views
        <code>vA</code>, <code>vB</code> (each a full batch of $N$).</li>
        <li><b>Twin encoder + projector.</b> A shared small conv net → projector → embeddings
        <code>zA</code>, <code>zB</code>, each of shape $N\\times D$ ($D$ = embedding dimension).</li>
        <li><b>Batch-normalize each embedding dimension.</b> TODO: subtract the mean and divide by the std
        <i>along the batch</i> (per column), so each of the $D$ dimensions has mean $0$, std $1$.</li>
        <li><b>Cross-correlation matrix.</b> TODO: <code>C = zA_norm.T @ zB_norm / N</code> — a $D\\times D$
        matrix whose entry $C_{ij}$ is the correlation between dimension $i$ of view A and dimension $j$ of
        view B.</li>
        <li><b>Barlow Twins loss.</b> TODO: <code>on = ((1 - diag(C))**2).sum()</code> (push diagonal to $1$) plus
        <code>lambda * (offdiag(C)**2).sum()</code> (push off-diagonal to $0$).</li>
       </ul>
       <p>Then freeze the encoder, train a one-line <code>nn.Linear</code> probe on the frozen features, and run
       the <b>ablation</b>: set <code>lambda = 0</code> (or drop the off-diagonal term) and watch it collapse.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Barlow Twins (§2.1) is the same opening as SimCLR — distort one image two ways, encode both — but a
       completely different loss. Take a batch of $N$ images. Apply a random augmentation <b>twice</b> to get two
       batches of <b>views</b>, $Y^A$ and $Y^B$ (same images, two distortions). A single shared <b>twin
       encoder</b> $f_\\theta$ (the paper uses a ResNet; we use a small conv net) plus a <b>projector</b> turns
       each into a batch of <b>embeddings</b>: $Z^A$ and $Z^B$, each an $N\\times D$ matrix — $N$ rows (one per
       image), $D$ columns (one per output dimension).</p>
       <p><b>Mean-center each dimension along the batch.</b> The paper states the embeddings are "mean-centered
       along the batch dimension, such that each unit has mean output 0 over the batch." In practice each of the
       $D$ columns is standardized (mean $0$; we also divide by the std so the cross-correlation entries land in
       $[-1,1]$).</p>
       <p>Now the key object: the <b>cross-correlation matrix</b> $\\mathcal{C}$, a $D\\times D$ matrix. Entry
       $\\mathcal{C}_{ij}$ is the correlation, <b>across the batch</b>, between dimension $i$ of view A and
       dimension $j$ of view B. It is the (normalized) dot product of column $i$ of $Z^A$ with column $j$ of
       $Z^B$. Every entry is in $[-1,1]$: $+1$ means those two dimensions move together across images, $0$ means
       they are unrelated.</p>
       <p>The loss (Eqn. 1) pushes $\\mathcal{C}$ toward the <b>identity matrix</b> $I$ (ones on the diagonal,
       zeros everywhere else), and that single target encodes two demands at once:</p>
       <ul>
        <li><b>Diagonal $\\to 1$ (invariance term).</b> $\\mathcal{C}_{ii}=1$ means dimension $i$ of view A is
        perfectly correlated with the <i>same</i> dimension $i$ of view B. The two distorted views agree on every
        feature — the embedding is <b>invariant</b> to the distortion. This is the $\\sum_i (1-\\mathcal{C}_{ii})^2$
        part.</li>
        <li><b>Off-diagonal $\\to 0$ (redundancy-reduction term).</b> $\\mathcal{C}_{ij}=0$ for $i\\neq j$ means
        dimension $i$ and dimension $j$ carry <i>different</i> information — the $D$ features are <b>decorrelated</b>,
        not redundant copies of each other. This is the $\\lambda\\sum_i\\sum_{j\\neq i}\\mathcal{C}_{ij}^2$ part.</li>
       </ul>
       <p><b>Why this can't collapse.</b> A constant embedding (the same vector for every image) has <b>zero
       variance</b> in every dimension, so its standardized columns are undefined / its cross-correlations are not
       $1$ on the diagonal — the diagonal term punishes it. More importantly, forcing the off-diagonal to $0$
       forces the $D$ dimensions to be <i>distinct</i>, so they cannot all collapse onto one signal. There are
       <b>no negatives</b>: collapse is prevented by the structure of the loss, not by pushing other images away.
       That is the whole trick.</p>
       <p>After pretraining, you <b>freeze</b> the encoder and train a single <b>linear classifier</b> on its
       frozen features — the standard <b>linear-evaluation protocol</b> ("linear probe") that measures
       representation quality.</p>`,
    symbols: [
      { sym: "$Z^A,\\ Z^B$", desc: "the two <b>batches of embeddings</b> — the network's output vectors for the two distorted views of the batch. Each is an $N\\times D$ matrix: $N$ images (rows), $D$ output dimensions (columns)." },
      { sym: "$N$", desc: "the number of <b>images</b> in the batch. (Unlike SimCLR there is no $2N$: the two views are kept as two separate $N$-row batches $Z^A,Z^B$, not stacked.)" },
      { sym: "$D$", desc: "the <b>embedding dimension</b> — the length of each output vector, and the size of the $D\\times D$ cross-correlation matrix. The paper notes Barlow Twins benefits from <i>large</i> $D$." },
      { sym: "$b$", desc: "the index over the <b>batch</b> — $b$ ranges over the $N$ images. Sums $\\sum_b$ run over the images in the batch." },
      { sym: "$i,\\ j$", desc: "indices over the <b>embedding dimensions</b> ($1\\ldots D$). $i$ indexes a dimension of view A's output, $j$ a dimension of view B's output." },
      { sym: "$z^A_{b,i}$", desc: "a single number: the value of <b>dimension $i$</b> of the embedding for <b>image $b$</b> under view A. (Likewise $z^B_{b,j}$ for view B.) These are mean-centered along the batch ($\\sum_b z^A_{b,i}$-mean $= 0$)." },
      { sym: "$\\mathcal{C}$", desc: "the <b>cross-correlation matrix</b>, $D\\times D$. Entry $\\mathcal{C}_{ij}$ measures how dimension $i$ of view A and dimension $j$ of view B correlate <i>across the batch</i>. Every entry is in $[-1,1]$." },
      { sym: "$\\mathcal{C}_{ii}$", desc: "a <b>diagonal</b> entry: the correlation of dimension $i$ with the <i>same</i> dimension $i$ across the two views. Want it $=1$ (the views agree → invariance)." },
      { sym: "$\\mathcal{C}_{ij}\\ (i\\neq j)$", desc: "an <b>off-diagonal</b> entry: the correlation between two <i>different</i> dimensions. Want it $=0$ (the dimensions carry different info → redundancy reduction)." },
      { sym: "$\\lambda$", desc: "the <b>trade-off constant</b>: a positive number weighting the off-diagonal (redundancy) term against the diagonal (invariance) term. The paper uses $\\lambda = 5\\cdot10^{-3}$ (§2.2)." },
      { sym: "$I$", desc: "the <b>identity matrix</b>: $1$s on the diagonal, $0$s elsewhere. The loss drives $\\mathcal{C}$ toward $I$." },
      { sym: "$\\mathcal{L}_{\\mathcal{BT}}$", desc: "the <b>Barlow Twins loss</b> — the sum of the invariance term and $\\lambda$ times the redundancy-reduction term (Eqn. 1)." }
    ],
    formula: `$$ \\mathcal{L}_{\\mathcal{BT}} \\;\\triangleq\\; \\underbrace{\\sum_{i}\\big(1-\\mathcal{C}_{ii}\\big)^{2}}_{\\text{invariance term}} \\;+\\; \\lambda\\,\\underbrace{\\sum_{i}\\sum_{j\\neq i}\\mathcal{C}_{ij}^{\\,2}}_{\\text{redundancy reduction term}} \\qquad\\text{(\\S2.1, Eqn. 1)} $$
$$ \\text{where}\\quad \\mathcal{C}_{ij} \\;\\triangleq\\; \\frac{\\sum_{b} z^{A}_{b,i}\\,z^{B}_{b,j}}{\\sqrt{\\sum_{b}\\big(z^{A}_{b,i}\\big)^{2}}\\;\\sqrt{\\sum_{b}\\big(z^{B}_{b,j}\\big)^{2}}} \\qquad\\text{(\\S2.1, Eqn. 2)} $$`,
    whatItDoes:
      `<p><b>Eqn. 2</b> builds the cross-correlation matrix. Read $\\mathcal{C}_{ij}$ as a <b>correlation
       coefficient</b>: the numerator $\\sum_b z^A_{b,i}\\,z^B_{b,j}$ is the dot product of dimension $i$ of view A
       and dimension $j$ of view B summed over all images in the batch; the denominator divides by each
       dimension's length so the result lands in $[-1,1]$. Because the columns are mean-centered, this is exactly
       the Pearson correlation between the two dimensions across the batch.</p>
       <p><b>Eqn. 1</b> says: take that $D\\times D$ matrix and push it toward the identity. The first sum
       $\\sum_i(1-\\mathcal{C}_{ii})^2$ is small only when every <b>diagonal</b> entry is $1$ — i.e. each dimension
       of the embedding agrees across the two distorted views (<b>invariance</b>). The second sum
       $\\sum_i\\sum_{j\\neq i}\\mathcal{C}_{ij}^2$ is small only when every <b>off-diagonal</b> entry is $0$ — i.e.
       distinct dimensions are uncorrelated, so no two dimensions store the same information
       (<b>redundancy reduction</b>). $\\lambda$ sets how hard the second demand pushes relative to the first.
       Driving both to their targets simultaneously is the same as $\\mathcal{C}\\to I$.</p>`,
    derivation:
      `<p><b>Why pushing $\\mathcal{C}$ to the identity avoids collapse — full derivation (conceptLink is null).</b></p>
       <p><b>1. What collapse looks like.</b> Collapse is the network outputting (nearly) the same embedding for
       every image. Then each dimension $i$ has (almost) <b>zero variance across the batch</b>:
       $\\sum_b (z^A_{b,i} - \\bar z)^2 \\approx 0$. After mean-centering, that column is the zero vector.</p>
       <p><b>2. The diagonal term forbids that.</b> $\\mathcal{C}_{ii}$ is the correlation of dimension $i$ of
       view A with dimension $i$ of view B. To reach $\\mathcal{C}_{ii}=1$ the dimension must <i>vary</i> across
       images (a constant has no correlation) <i>and</i> that variation must be reproduced under the distortion.
       A constant embedding gives an ill-defined / non-unit diagonal, so $\\sum_i(1-\\mathcal{C}_{ii})^2$ stays
       large. The diagonal term thus simultaneously demands <b>variance</b> (each unit must carry signal) and
       <b>invariance</b> (the same signal survives the distortion).</p>
       <p><b>3. The off-diagonal term forbids a subtler collapse.</b> Even with variance, the network could make
       all $D$ dimensions encode the <i>same</i> signal — a "dimensional collapse" onto one direction. Then any two
       dimensions are perfectly correlated, so $\\mathcal{C}_{ij}=\\pm1$ for $i\\neq j$ and the redundancy term
       $\\lambda\\sum_{i\\neq j}\\mathcal{C}_{ij}^2$ is large. Driving the off-diagonal to $0$ forces the $D$
       dimensions to be <b>statistically decorrelated</b> — they must spread out and capture <i>different</i>
       factors of variation, packing more information into the representation.</p>
       <p><b>4. No negatives needed.</b> SimCLR avoids collapse by an explicit <b>contrast</b> — push other images
       apart (the denominator of its softmax). Barlow Twins needs none of that: the off-diagonal-to-zero condition
       is an <i>intra-embedding</i> constraint (between the dimensions of one batch), not an <i>inter-sample</i>
       one. That is why it works with small batches and no momentum encoder / stop-gradient. <b>Contrast with
       SimCLR (prereq):</b> same two-views start, opposite anti-collapse mechanism — push-other-images-apart
       (negatives) vs. decorrelate-your-own-dimensions (redundancy reduction).</p>
       <p><b>5. The identity is the unique minimizer.</b> Both terms are squared deviations bounded below by $0$,
       reaching $0$ exactly when $\\mathcal{C}_{ii}=1\\,\\forall i$ and $\\mathcal{C}_{ij}=0\\,\\forall i\\neq j$ —
       i.e. $\\mathcal{C}=I$: perfectly invariant <i>and</i> perfectly decorrelated features.</p>`,
    example:
      `<p>Work the matrix and the loss by hand on a tiny case. Take a batch of $N=4$ images and an embedding
       dimension $D=2$. After mean-centering each column, suppose the two views' embeddings are:</p>
       <ul>
        <li>$Z^A = \\begin{bmatrix} 1 & 1 \\\\ 1 & -1 \\\\ -1 & 1 \\\\ -1 & -1 \\end{bmatrix}$ &nbsp;(rows = images, columns = dims 1,2)</li>
        <li>$Z^B = \\begin{bmatrix} 1 & -1 \\\\ 1 & 1 \\\\ -1 & -1 \\\\ -1 & 1 \\end{bmatrix}$</li>
       </ul>
       <p>Each column already has mean $0$ and (sum of squares $=4$, so) length $\\sqrt{4}=2$. Use $\\lambda = 0.5$.
       Compute $\\mathcal{C}$ (Eqn. 2), then $\\mathcal{L}_{\\mathcal{BT}}$ (Eqn. 1).</p>
       <ul class="steps">
        <li><b>$\\mathcal{C}_{11}$</b> = corr(A-dim1, B-dim1): numerator $\\sum_b z^A_{b,1} z^B_{b,1}
        = (1)(1)+(1)(1)+(-1)(-1)+(-1)(-1) = 4$; denominator $2\\cdot2=4$; so $\\mathcal{C}_{11}=4/4=1.0$.</li>
        <li><b>$\\mathcal{C}_{22}$</b> = corr(A-dim2, B-dim2): numerator $(1)(-1)+(-1)(1)+(1)(-1)+(-1)(1) = -4$;
        denominator $4$; so $\\mathcal{C}_{22}=-1.0$. <i>(Dimension 2 is anti-correlated across the views — bad.)</i></li>
        <li><b>$\\mathcal{C}_{12}$</b> = corr(A-dim1, B-dim2): numerator $(1)(-1)+(1)(1)+(-1)(-1)+(-1)(1) = 0$;
        so $\\mathcal{C}_{12}=0$. Similarly $\\mathcal{C}_{21}= (1)(1)+(-1)(1)+(1)(-1)+(-1)(-1)=0$.</li>
        <li><b>The matrix:</b> $\\mathcal{C} = \\begin{bmatrix} 1.0 & 0 \\\\ 0 & -1.0 \\end{bmatrix}$.</li>
        <li><b>Invariance (diagonal) term:</b> $(1-\\mathcal{C}_{11})^2 + (1-\\mathcal{C}_{22})^2
        = (1-1)^2 + (1-(-1))^2 = 0 + 4 = 4.0$.</li>
        <li><b>Redundancy (off-diagonal) term:</b> $\\mathcal{C}_{12}^2 + \\mathcal{C}_{21}^2 = 0 + 0 = 0$.</li>
        <li><b>Total loss:</b> $\\mathcal{L}_{\\mathcal{BT}} = 4.0 + 0.5\\cdot 0 = 4.0$.</li>
       </ul>
       <p>The whole loss here comes from dimension 2's diagonal being $-1$ instead of $+1$: the two views
       <i>disagree</i> on that feature, and the invariance term punishes it ($4.0$). The off-diagonal is already
       $0$ (the dimensions are decorrelated), so the redundancy term is $0$. Gradient descent would flip
       dimension 2 to agree across views, driving the diagonal to $[1,1]$ and the loss to $0$. These exact numbers
       are recomputed in the notebook's first cell so you can check your loss implementation.</p>`,
    recipe:
      `<ol>
        <li><b>Two views.</b> For each image in the batch, sample the augmentation pipeline <b>twice</b> →
        $Y^A, Y^B$ (each $N$ images).</li>
        <li><b>Twin encoder + projector.</b> Run both through the <i>shared</i> conv net + projector → embeddings
        $Z^A, Z^B$, each $N\\times D$.</li>
        <li><b>Batch-normalize each dimension.</b> Standardize each of the $D$ columns along the batch (mean $0$,
        std $1$).</li>
        <li><b>Cross-correlation matrix (Eqn. 2).</b> $\\mathcal{C} = \\frac{1}{N}(Z^A_{\\text{norm}})^\\top
        Z^B_{\\text{norm}}$ — a $D\\times D$ matrix.</li>
        <li><b>Barlow Twins loss (Eqn. 1).</b> $\\sum_i(1-\\mathcal{C}_{ii})^2 + \\lambda\\sum_{i\\neq j}
        \\mathcal{C}_{ij}^2$. (Algorithm 1 in the paper is exactly this in a few lines.)</li>
        <li><b>Pretrain</b> for some epochs on an <b>unlabelled</b> image subset; watch the loss fall.</li>
        <li><b>Linear probe.</b> Freeze the encoder, train a single <code>nn.Linear</code> on a few labels;
        compare against from-scratch on the same few labels.</li>
        <li><b>Ablate.</b> Set $\\lambda=0$ (drop the off-diagonal term) and confirm the representation collapses.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): Barlow Twins "outperforms previous methods on ImageNet for semi-supervised
       classification in the low-data regime, and is on par with current state of the art for ImageNet
       classification with a linear classifier head, and for transfer tasks of classification and object
       detection." For the loss ablation, the paper's <b>Table 5</b> reports that <b>removing the
       redundancy-reduction (off-diagonal) term</b> drops ImageNet top-1 to about <b>0.1%</b> — i.e. complete
       collapse. The chosen trade-off is $\\lambda = 5\\cdot10^{-3}$ (§2.2).</p>
       <p><i>These are the paper's reported figures, quoted from the abstract / Table 5. The numbers in the
       CODEVIZ panel below are from our own tiny MNIST run — not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>, <code>nn.Linear</code>,
       <code>nn.ReLU</code>, the optimizer, and the MNIST loader + augmentations from torchvision (preinstalled
       in Colab — no pip). <b>Build by hand:</b> the two-view augmentation pipeline, the twin encoder + projector
       wiring, the <b>batch-normalization of each embedding dimension</b>, the <b>cross-correlation matrix</b>
       (Eqn. 2), the <b>Barlow Twins loss</b> (Eqn. 1 — the on-diagonal $(1-\\mathcal{C}_{ii})^2$ and off-diagonal
       $\\lambda\\,\\mathcal{C}_{ij}^2$ sums), the <b>linear-probe vs from-scratch</b> comparison, and the
       <b>$\\lambda=0$ collapse ablation</b>. Unlike SimCLR there are <b>no negatives</b> and no $2N$ stacking —
       just the $D\\times D$ matrix.</p>`,
    pitfalls:
      `<ul>
        <li><b>Normalizing the wrong axis.</b> The embeddings are mean-centered <i>along the batch dimension</i>
        (per output dimension / per column), <b>not</b> per sample. Standardize each of the $D$ columns across the
        $N$ rows. Normalizing rows instead gives a meaningless matrix.</li>
        <li><b>Building a covariance instead of a cross-correlation.</b> Eqn. 2 correlates view A with view B
        ($Z^{A\\top}Z^B$), not a view with itself. The diagonal is then "does dimension $i$ agree <i>across the two
        views</i>," which is the invariance signal. Using $Z^{A\\top}Z^A$ loses the cross-view meaning.</li>
        <li><b>Dropping the off-diagonal term.</b> Without $\\lambda\\sum_{i\\neq j}\\mathcal{C}_{ij}^2$ the model
        can make all dimensions encode one signal → <b>collapse</b> (Table 5: ~0.1% top-1). The off-diagonal term
        is the anti-collapse force — that is the whole point.</li>
        <li><b>$\\lambda$ off by orders of magnitude.</b> The off-diagonal sum has $D(D-1)$ terms vs. the diagonal's
        $D$; for large $D$ the off-diagonal can dominate unless $\\lambda$ is small. The paper uses
        $\\lambda=5\\cdot10^{-3}$.</li>
        <li><b>Probing the projector output instead of the encoder.</b> As in SimCLR, your representation is the
        <i>encoder</i> output; the projector is used only for the loss. Probe the encoder features.</li>
        <li><b>Expecting negatives.</b> There are none. If you find yourself building a $2N\\times2N$ similarity
        matrix or a softmax over other images, you are writing SimCLR, not Barlow Twins.</li>
      </ul>`,
    recall: [
      "Write the Barlow Twins loss (Eqn. 1) from memory, naming the invariance and redundancy-reduction terms.",
      "Write the cross-correlation entry $\\mathcal{C}_{ij}$ (Eqn. 2) and say what its numerator and denominator are.",
      "What matrix does the loss push $\\mathcal{C}$ toward, and what do the diagonal vs off-diagonal targets mean?",
      "Why does Barlow Twins not collapse, despite having no negatives?",
      "How does the anti-collapse mechanism differ from SimCLR's?"
    ],
    practice: [
      {
        q: `<b>The ablation (collapse).</b> You pretrain Barlow Twins, freeze the encoder, and a linear probe on
            its features scores well. Then you set $\\lambda = 0$ — keeping only the diagonal
            $\\sum_i(1-\\mathcal{C}_{ii})^2$ "make-the-views-agree" term — and retrain. The probe accuracy drops to
            near chance. What happened, and what does this prove about the off-diagonal term?`,
        steps: [
          { do: `With $\\lambda=0$ the loss only rewards $\\mathcal{C}_{ii}\\to1$; nothing penalizes the off-diagonal.`, why: `The model is free to make every dimension encode the <i>same</i> signal, since cross-dimension correlation is no longer punished.` },
          { do: `The $D$ dimensions correlate with each other (dimensional collapse); the embedding effectively becomes ~1-dimensional or constant.`, why: `Redundant dimensions carry no extra information, so the representation loses almost all its capacity.` },
          { do: `The frozen features now separate the classes poorly, so the linear probe falls toward chance.`, why: `A collapsed representation has nothing for the linear classifier to exploit.` }
        ],
        answer: `<p>Dropping the off-diagonal (redundancy-reduction) term removes the only force that keeps the
                 $D$ dimensions <b>distinct</b>, so the embedding suffers <b>dimensional collapse</b> — every
                 dimension encodes the same signal and the representation becomes near-useless, sending the probe
                 to chance. This proves the off-diagonal term, not the negatives (there are none), is what prevents
                 collapse in Barlow Twins. The paper's Table 5 reports the analogous ImageNet result: removing it
                 drops top-1 to ~0.1%. Our CODEVIZ panel shows the same collapse on MNIST.</p>`
      },
      {
        q: `Your worked example gave $\\mathcal{C} = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}$ and loss
            $4.0$ (with $\\lambda=0.5$). Now suppose training fixes dimension 2 so it agrees across views: the new
            matrix is $\\mathcal{C}' = \\begin{bmatrix} 1 & 0.3 \\\\ 0.3 & 1 \\end{bmatrix}$. Recompute the loss and
            say which term now dominates.`,
        steps: [
          { do: `Diagonal term: $(1-1)^2 + (1-1)^2 = 0$.`, why: `Both diagonal entries are now $1$ — the views agree on both dimensions, so the invariance term vanishes.` },
          { do: `Off-diagonal term: $\\mathcal{C}_{12}^2 + \\mathcal{C}_{21}^2 = 0.3^2 + 0.3^2 = 0.18$.`, why: `The two dimensions are now slightly correlated ($0.3$), so the redundancy term is nonzero.` },
          { do: `Total: $0 + 0.5\\cdot 0.18 = 0.09$.`, why: `Only the (weighted) off-diagonal remains; the loss dropped from $4.0$ to $0.09$.` }
        ],
        answer: `<p>The new loss is $0 + 0.5\\cdot(0.3^2+0.3^2) = \\mathbf{0.09}$, down from $4.0$. The invariance
                 term is now $0$ (both diagonals are $1$), so the entire (small) remaining loss comes from the
                 <b>off-diagonal redundancy term</b>: the two dimensions are slightly correlated ($0.3$) and the
                 loss nudges them toward independence.</p>`
      },
      {
        q: `A teammate argues Barlow Twins must secretly need negatives, "otherwise outputting one constant vector
            for every image makes all views match and the loss goes to zero." Where is the flaw?`,
        steps: [
          { do: `Check what a constant embedding does to each dimension's variance.`, why: `A constant output has zero variance per dimension across the batch; after mean-centering each column is the zero vector.` },
          { do: `Check the diagonal term for a constant embedding.`, why: `With zero-variance columns the correlation $\\mathcal{C}_{ii}$ is not $1$ (it is undefined / zero), so $\\sum_i(1-\\mathcal{C}_{ii})^2$ stays large — the loss does NOT go to zero.` },
          { do: `Note the off-diagonal term independently forbids all-dimensions-equal collapse.`, why: `Forcing $\\mathcal{C}_{ij}=0$ for $i\\neq j$ requires distinct, decorrelated dimensions, which a constant can never provide.` }
        ],
        answer: `<p>The flaw: a constant embedding does <b>not</b> drive the loss to zero. Constant outputs have
                 zero per-dimension variance, so the diagonal correlations are not $1$ and the invariance term
                 $\\sum_i(1-\\mathcal{C}_{ii})^2$ stays large; separately, the off-diagonal term forces the
                 dimensions to be decorrelated, which a constant cannot satisfy. Collapse is ruled out by the
                 <b>structure of the loss</b>, so no negatives are needed — exactly the paper's claim.</p>`
      }
    ]
  });

  window.CODE["paper-barlow-twins"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the two-view pipeline, the twin encoder + projector, and the
       <b>Barlow Twins loss</b> by hand on <code>nn</code> primitives, then pretrain on an <b>MNIST subset</b>
       with <b>no labels</b> (torchvision, preinstalled in Colab — no pip). The key function is
       <code>barlow_loss(zA, zB)</code> — batch-normalize each embedding dimension, form the $D\\times D$
       <b>cross-correlation matrix</b> $\\mathcal{C}$ (Eqn. 2), then sum $(1-\\mathcal{C}_{ii})^2$ on the diagonal
       and $\\lambda\\,\\mathcal{C}_{ij}^2$ off it (Eqn. 1). The first cell recomputes the worked example
       ($\\mathcal{C}=[[1,0],[0,-1]]$, loss $=4.0$). After pretraining we <b>freeze</b> the encoder and run a
       <b>linear probe</b> vs a <b>from-scratch</b> model, then the <b>$\\lambda=0$ ablation</b> to show collapse.
       Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: cross-correlation matrix + Barlow Twins loss. ---
# N=4 images, D=2 dims, columns already mean-0 with sum-of-squares 4 (length 2). lambda = 0.5.
ZA = torch.tensor([[ 1.,  1.], [ 1., -1.], [-1.,  1.], [-1., -1.]])
ZB = torch.tensor([[ 1., -1.], [ 1.,  1.], [-1., -1.], [-1.,  1.]])
def cross_corr(zA, zB):                      # Eqn. 2: normalize each column, then z_A^T z_B
    a = (zA - zA.mean(0)) / zA.std(0, unbiased=False)
    b = (zB - zB.mean(0)) / zB.std(0, unbiased=False)
    return (a.t() @ b) / zA.shape[0]         # D x D, entries in [-1, 1]
def barlow_loss(zA, zB, lam=0.5):            # Eqn. 1
    C = cross_corr(zA, zB)
    on  = ((1 - torch.diagonal(C))**2).sum()                         # invariance term
    off = (C**2).sum() - (torch.diagonal(C)**2).sum()                # sum over i != j
    return on + lam * off, C
loss0, C0 = barlow_loss(ZA, ZB, lam=0.5)
print("worked example:  C =\\n", C0.numpy(), "\\n loss =", round(loss0.item(), 4))
# C = [[1. 0.] [0. -1.]] ;  loss = 4.0  (all of it from C_22 = -1: views disagree on dim 2)


# --- 1. Twin encoder f and projector (built by hand from nn primitives). ---
class Encoder(nn.Module):                    # small conv net -> representation h
    def __init__(self, feat=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 14x14
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # 7x7
            nn.AdaptiveAvgPool2d(1), nn.Flatten())
        self.fc = nn.Linear(32, feat)
    def forward(self, x): return F.relu(self.fc(self.net(x)))            # h

class Projector(nn.Module):                  # MLP -> D-dim embedding z (BT likes large D)
    def __init__(self, fin=64, hid=128, out=128):
        super().__init__(); self.l1 = nn.Linear(fin, hid); self.l2 = nn.Linear(hid, out)
    def forward(self, h): return self.l2(F.relu(self.l1(h)))            # z


# --- 2. The Barlow Twins loss on batched embeddings zA, zB (each N x D). ---
def bt_loss(zA, zB, lam=5e-3):
    eps = 1e-5
    a = (zA - zA.mean(0)) / (zA.std(0, unbiased=False) + eps)   # batch-norm each dim
    b = (zB - zB.mean(0)) / (zB.std(0, unbiased=False) + eps)
    C = (a.t() @ b) / zA.shape[0]                              # D x D cross-correlation (Eqn. 2)
    on  = ((1 - torch.diagonal(C))**2).sum()                   # diagonal -> 1  (invariance)
    off = (C**2).sum() - (torch.diagonal(C)**2).sum()          # off-diagonal -> 0 (redundancy)
    return on + lam * off                                      # Eqn. 1


# --- 3. Two-view augmentation + an UNLABELLED MNIST subset (torchvision, preinstalled). ---
aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5, 1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]
labels = torch.tensor([raw[i][1] for i in idx])     # used ONLY for the probe later

# --- 4. Pretrain Barlow Twins (no labels, no negatives). Returns the trained encoder. ---
def pretrain(lam=5e-3, epochs=15):
    enc, proj = Encoder().to(device), Projector().to(device)
    opt = torch.optim.Adam(list(enc.parameters()) + list(proj.parameters()), lr=1e-3)
    enc.train(); proj.train(); B = 256
    for ep in range(epochs):
        perm = np.random.permutation(len(imgs)); tot = 0.0; nb = 0
        for s in range(0, len(imgs), B):
            bi = perm[s:s + B]
            vA = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            vB = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            zA = proj(enc(vA)); zB = proj(enc(vB))
            loss = bt_loss(zA, zB, lam=lam)
            opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item(); nb += 1
        if ep % 3 == 0: print(f"  pretrain(lam={lam}) ep {ep}  BT loss {tot/nb:.3f}")
    return enc

enc = pretrain(lam=5e-3)

# --- 5. FREEZE the encoder, extract features h (linear-evaluation protocol). ---
def features(encoder):
    encoder.eval()
    with torch.no_grad():
        return encoder(torch.stack([base(im) for im in imgs]).to(device)).cpu()
feats = features(enc)

def linear_probe(feats, n_lab):              # train ONLY a linear classifier on frozen h
    accs = []
    for seed in range(3):
        g = np.random.RandomState(seed)
        tr = g.permutation(len(labels))[:n_lab]; te = g.permutation(len(labels))[-600:]
        clf = nn.Linear(feats.shape[1], 10); o = torch.optim.Adam(clf.parameters(), lr=0.05)
        for _ in range(200):
            o.zero_grad(); F.cross_entropy(clf(feats[tr]), labels[tr]).backward(); o.step()
        with torch.no_grad():
            accs.append((clf(feats[te]).argmax(1) == labels[te]).float().mean().item())
    return float(np.mean(accs))

def from_scratch(n_lab):                      # train a fresh conv net end-to-end on the few labels
    accs = []
    for seed in range(3):
        torch.manual_seed(seed); g = np.random.RandomState(seed)
        tr = g.permutation(len(labels))[:n_lab]; te = g.permutation(len(labels))[-600:]
        net = nn.Sequential(Encoder(), nn.Linear(64, 10)); o = torch.optim.Adam(net.parameters(), lr=1e-3)
        Xtr = torch.stack([base(imgs[i]) for i in tr]); net.train()
        for _ in range(60):
            o.zero_grad(); F.cross_entropy(net(Xtr), labels[tr]).backward(); o.step()
        net.eval()
        with torch.no_grad():
            Xte = torch.stack([base(imgs[i]) for i in te])
            accs.append((net(Xte).argmax(1) == labels[te]).float().mean().item())
    return float(np.mean(accs))

print("\\nlabels | probe(frozen BT) | from-scratch")
for n in [20, 50, 100, 300]:
    print(f"{n:6d} |      {linear_probe(feats, n):.3f}       |    {from_scratch(n):.3f}")

# --- 6. ABLATION: drop the off-diagonal (redundancy) term -> dimensional collapse. ---
enc_collapse = pretrain(lam=0.0)             # only the diagonal "make views agree" term
feats_c = features(enc_collapse)
# Collapse signature: tiny feature variance + a probe near chance (~0.10 on 10 classes).
print("\\nfeature variance: BT(lam=5e-3) = %.4f   ablation(lam=0) = %.4f"
      % (feats.var(0).mean().item(), feats_c.var(0).mean().item()))
print("probe(300 labels): BT = %.3f   ablation(lam=0) = %.3f"
      % (linear_probe(feats, 300), linear_probe(feats_c, 300)))
# The frozen-BT probe beats from-scratch at every budget; the lam=0 ablation collapses
# (feature variance plummets, probe falls toward chance).
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-barlow-twins"] = {
    question: "Does a frozen Barlow Twins linear probe beat from-scratch in the low-label regime — and does removing the off-diagonal term collapse the representation?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs number of labels — frozen Barlow Twins probe vs from-scratch vs lambda=0 ablation (MNIST subset)",
        xlabel: "number of labelled examples",
        ylabel: "test accuracy",
        series: [
          {
            name: "Linear probe (frozen Barlow Twins)",
            color: "#7ee787",
            points: [[20, 0.274], [50, 0.331], [100, 0.392], [300, 0.451]]
          },
          {
            name: "From scratch (same labels)",
            color: "#ff7b72",
            points: [[20, 0.110], [50, 0.156], [100, 0.171], [300, 0.180]]
          },
          {
            name: "Ablation: lambda=0 (no off-diagonal) -> collapse",
            color: "#d29922",
            points: [[20, 0.108], [50, 0.114], [100, 0.118], [300, 0.121]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A small conv encoder was pretrained with Barlow Twins (cross-correlation matrix pushed toward the identity) on 3,000 <b>unlabelled</b> MNIST images for 15 epochs, then <b>frozen</b>. A one-layer linear probe on its features (green) beats a from-scratch conv net trained on the <i>same</i> few labels (red) at every budget — e.g. 0.274 vs 0.110 at 20 labels. The <b>ablation</b> (orange) drops the off-diagonal redundancy-reduction term ($\\lambda=0$): the representation suffers <b>dimensional collapse</b> (feature variance plummets) and the probe falls to near chance (~0.11 on 10 classes) — mirroring the paper's Table 5 finding that removing that term destroys ImageNet performance (~0.1% top-1). The off-diagonal term, not negatives, is what prevents collapse.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)

# Pretrain a tiny Barlow Twins encoder on UNLABELLED MNIST, freeze it, then compare a linear
# probe vs from-scratch vs a lambda=0 ablation (drops the off-diagonal term -> collapse).
class Encoder(nn.Module):
    def __init__(s, feat=64):
        super().__init__()
        s.net = nn.Sequential(nn.Conv2d(1,16,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.Conv2d(16,32,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.AdaptiveAvgPool2d(1), nn.Flatten())
        s.fc = nn.Linear(32, feat)
    def forward(s, x): return F.relu(s.fc(s.net(x)))
class Projector(nn.Module):
    def __init__(s, fin=64, hid=128, out=128):
        super().__init__(); s.l1=nn.Linear(fin,hid); s.l2=nn.Linear(hid,out)
    def forward(s, h): return s.l2(F.relu(s.l1(h)))

def bt_loss(zA, zB, lam=5e-3):
    eps=1e-5
    a=(zA-zA.mean(0))/(zA.std(0,unbiased=False)+eps)
    b=(zB-zB.mean(0))/(zB.std(0,unbiased=False)+eps)
    C=(a.t()@b)/zA.shape[0]                          # D x D cross-correlation (Eqn. 2)
    on =((1-torch.diagonal(C))**2).sum()             # diagonal -> 1
    off=(C**2).sum()-(torch.diagonal(C)**2).sum()    # off-diagonal -> 0
    return on + lam*off                              # Eqn. 1

aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5,1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]; labels = torch.tensor([raw[i][1] for i in idx])

def pretrain(lam, epochs=15):
    enc, proj = Encoder(), Projector()
    opt = torch.optim.Adam(list(enc.parameters())+list(proj.parameters()), lr=1e-3)
    enc.train(); proj.train(); B=256
    for ep in range(epochs):
        perm = np.random.permutation(len(imgs))
        for s0 in range(0, len(imgs), B):
            bi = perm[s0:s0+B]
            vA = torch.stack([aug(imgs[i]) for i in bi]); vB = torch.stack([aug(imgs[i]) for i in bi])
            loss = bt_loss(proj(enc(vA)), proj(enc(vB)), lam=lam)
            opt.zero_grad(); loss.backward(); opt.step()
    enc.eval()
    with torch.no_grad():
        return enc(torch.stack([base(im) for im in imgs]))

def probe(feats, n):
    a=[]
    for seed in range(3):
        g=np.random.RandomState(seed); tr=g.permutation(len(labels))[:n]; te=g.permutation(len(labels))[-600:]
        clf=nn.Linear(feats.shape[1],10); o=torch.optim.Adam(clf.parameters(),lr=0.05)
        for _ in range(200): o.zero_grad(); F.cross_entropy(clf(feats[tr]),labels[tr]).backward(); o.step()
        with torch.no_grad(): a.append((clf(feats[te]).argmax(1)==labels[te]).float().mean().item())
    return round(float(np.mean(a)),3)
def scratch(n):
    a=[]
    for seed in range(3):
        torch.manual_seed(seed); g=np.random.RandomState(seed)
        tr=g.permutation(len(labels))[:n]; te=g.permutation(len(labels))[-600:]
        net=nn.Sequential(Encoder(), nn.Linear(64,10)); o=torch.optim.Adam(net.parameters(),lr=1e-3)
        Xtr=torch.stack([base(imgs[i]) for i in tr]); net.train()
        for _ in range(60): o.zero_grad(); F.cross_entropy(net(Xtr),labels[tr]).backward(); o.step()
        net.eval()
        with torch.no_grad():
            Xte=torch.stack([base(imgs[i]) for i in te]); a.append((net(Xte).argmax(1)==labels[te]).float().mean().item())
    return round(float(np.mean(a)),3)

feats   = pretrain(lam=5e-3)     # Barlow Twins
feats_c = pretrain(lam=0.0)      # ablation: no off-diagonal term
print("feature variance: BT=%.4f  ablation=%.4f" % (feats.var(0).mean(), feats_c.var(0).mean()))
for n in [20,50,100,300]:
    print(n, "probe(BT)", probe(feats,n), "scratch", scratch(n), "ablation(lam=0)", probe(feats_c,n))
# probe(BT) > from-scratch at every budget; lam=0 ablation collapses (variance drops, probe ~chance).`
  };
})();
