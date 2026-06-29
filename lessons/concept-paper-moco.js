/* Paper lesson — "Momentum Contrast for Unsupervised Visual Representation Learning" (MoCo),
   He, Fan, Wu, Xie, Girshick, 2019 (CVPR 2020).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-moco".
   GROUNDED from arXiv:1911.05722 (abstract) and the ar5iv HTML mirror
   (Section 3: Eqn. 1 InfoNCE loss, Eqn. 2 momentum update, Algorithm 1 pseudocode, ablations).
   Track B (architecture): build the query/key encoders, the momentum update, the negatives queue,
   and the InfoNCE loop by hand on top of nn.Linear; train on toy data; linear-probe the features;
   ablate the momentum update. The contrastive-learning math lives in concept unl-moco; here we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-moco",
    title: "MoCo — Momentum Contrast for Unsupervised Visual Representation Learning (2019)",
    tagline: "Learn image features with no labels by matching two views of the same image against a big queue of negatives, kept consistent by a slowly-moving key encoder.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Kaiming He, Haoqi Fan, Yuxin Wu, Saining Xie, Ross Girshick",
      org: "Facebook AI Research (FAIR)",
      year: 2019,
      venue: "arXiv:1911.05722 (Nov 2019); CVPR 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/1911.05722",
      code: "https://github.com/facebookresearch/moco"
    },
    conceptLink: "unl-moco",
    partOf: [
      { capstone: "capstone-simclr", step: 2, builds: "the momentum-encoder + negatives-queue contrastive learner" }
    ],
    prereqs: ["unl-moco", "unl-simclr", "dl-cosine-similarity", "dl-data-augmentation", "dl-cross-entropy", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>Unsupervised</b> means "learn from images with <i>no</i> labels." One way to do that is
       <b>contrastive learning</b>: take one image, make two randomly-augmented <i>views</i> of it (a random
       crop, a color jitter), push their feature vectors <b>together</b>, and push them <b>apart</b> from the
       features of <i>other</i> images. The "other images" you compare against are called <b>negatives</b>, and
       the collection of negatives you score against is the <b>dictionary</b>.</p>
       <p>The paper's framing (&sect;1): a good contrastive dictionary should be <b>large</b> (many negatives =
       a harder, more informative comparison) <b>and consistent</b> (all the negative vectors should be encoded
       by the <i>same</i>, or nearly the same, network, so the comparison is fair). Before MoCo, the two known
       recipes each broke one of those:</p>
       <ul>
        <li><b>End-to-end</b> (the SimCLR style): use the other images in the current mini-batch as negatives.
        They are perfectly consistent (one shared encoder, freshly updated), but the dictionary is only as
        <b>large</b> as the batch &mdash; so you need an enormous batch, which needs a lot of memory.</li>
        <li><b>Memory bank</b>: store a feature vector for <i>every</i> image in the dataset and sample
        negatives from that bank. Now the dictionary is large, but the stored vectors were computed by
        <i>many different past versions</i> of the encoder, so they are <b>inconsistent</b> &mdash; stale.</li>
       </ul>
       <p>MoCo's question: can we get a dictionary that is large <b>and</b> consistent at the same time, without
       a giant batch?</p>`,
    contribution:
      `<ul>
        <li><b>A queue as the dictionary.</b> Keep negatives in a first-in-first-out <b>queue</b> of fixed size
        $K$. Each step you enqueue the current mini-batch's key vectors and dequeue the oldest ones. Now the
        dictionary size $K$ is <b>decoupled from the batch size</b> &mdash; you can have $K=65536$ negatives
        with a normal-sized batch (&sect;3.2).</li>
        <li><b>A momentum-updated key encoder.</b> Use two networks: a <b>query encoder</b> $f_q$ trained
        normally by gradients, and a <b>key encoder</b> $f_k$ that is <i>not</i> trained by gradients but
        instead slowly tracks $f_q$ via an exponential moving average (Eqn. 2). Because $f_k$ moves slowly, the
        keys sitting in the queue &mdash; even old ones &mdash; were all produced by <i>almost the same</i>
        encoder, so the dictionary stays <b>consistent</b> (&sect;3.1).</li>
        <li><b>State-of-the-art unsupervised features.</b> The combination closes much of the gap to supervised
        pre-training on several downstream vision tasks.</li>
       </ul>`,
    whyItMattered:
      `<p>From the abstract (quoted): MoCo "can outperform its supervised pre-training counterpart in 7
       detection/segmentation tasks on PASCAL VOC, COCO, and other datasets," and the authors conclude that
       "the gap between unsupervised and supervised representation learning has been largely closed in many
       vision tasks." The queue-plus-momentum trick became a standard building block for self-supervised
       learning, and the follow-up MoCo v2 folded in SimCLR's projection head and stronger augmentations.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>Short paper &mdash; read it in this order:</p>
       <ul>
        <li><b>&sect;1 + Figure 1</b>: the "large and consistent dictionary" goal, and the three diagrams
        (end-to-end vs memory-bank vs MoCo). This is the whole idea in one figure.</li>
        <li><b>&sect;3.1 (Contrastive Learning as Dictionary Look-up)</b>: <b>Eqn. 1</b>, the InfoNCE loss.</li>
        <li><b>&sect;3.2-3.3 + Eqn. 2</b>: the queue, and the momentum update of the key encoder. The single
        most important equation to internalize is Eqn. 2.</li>
        <li><b>Algorithm 1</b>: the PyTorch-style pseudocode &mdash; read it line by line; our notebook is a
        direct transcription.</li>
        <li><b>Skim</b> the ImageNet numbers and the 7-task transfer tables on a first pass; <b>do read</b> the
        ablations on momentum $m$ and queue size $K$ &mdash; they justify the two design choices.</li>
       </ul>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Before running: you will train a query encoder with MoCo on <b>unlabeled</b> toy data, then freeze it
       and fit a single linear classifier on its features (a <b>linear probe</b>). You will compare against the
       same-shape encoder left <b>untrained</b> (random weights). <b>Guess:</b> will the MoCo-trained features
       give a higher linear-probe accuracy than the random encoder? And in the ablation where we set the
       momentum $m=1.0$ (so the key encoder <i>never</i> updates), do you expect the features to get better or
       worse?</p>`,
    attempt:
      `<p>Implement the MoCo loop (this mirrors the CODE below &mdash; TODOs marked):</p>
       <ul>
        <li>Make two encoders $f_q$, $f_k$ with identical initial weights; freeze $f_k$'s gradients.</li>
        <li>Each step: draw a batch, make two augmented views; encode view 1 with $f_q$ (the <b>query</b> $q$),
        view 2 with $f_k$ (the <b>positive key</b> $k_+$), both L2-normalized. <i>TODO:</i> compute the positive
        logit $q\\!\\cdot\\!k_+$ and the negative logits $q\\,Q^{\\top}$ against the queue $Q$.</li>
        <li><i>TODO:</i> form the InfoNCE loss (Eqn. 1): cross-entropy over <code>[pos, negs]/τ</code> with the
        positive in slot 0.</li>
        <li><i>TODO:</i> after the gradient step on $f_q$, momentum-update $f_k$ (Eqn. 2), then enqueue the new
        keys and dequeue the oldest.</li>
        <li>Linear-probe the frozen $f_q$; compare to the random encoder; then re-run with $m=1.0$.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>MoCo frames contrastive learning as a <b>dictionary look-up</b> (&sect;3.1). Picture an encoded
       <b>query</b> $q$ and a dictionary of encoded <b>keys</b> $\\{k_0, k_1, k_2, \\dots\\}$. Exactly one key,
       written $k_+$, is the <b>match</b> &mdash; it is the encoding of <i>another augmented view of the same
       image</i> that produced $q$. All the other keys are <b>negatives</b> (different images). The training
       objective is simply: make $q$ most <b>similar</b> to its one match $k_+$ and dissimilar to every
       negative. Similarity is the <b>dot product</b> $q\\!\\cdot\\!k$ (after L2-normalizing each vector, this
       is cosine similarity).</p>
       <p>Three moving parts make this work at scale:</p>
       <ol>
        <li><b>Two encoders.</b> The query $q = f_q(x^q)$ comes from the <b>query encoder</b> $f_q$; the keys
        $k = f_k(x^k)$ come from the <b>key encoder</b> $f_k$. They start identical.</li>
        <li><b>The queue (the dictionary).</b> The keys for the current batch are computed and used, then
        <b>pushed onto a queue</b> of the last $K$ keys; the oldest batch of keys falls off the back. So at any
        step the dictionary holds $K$ negatives drawn from many recent batches &mdash; far more than one batch
        could hold &mdash; and it costs no extra backprop, because the queued keys are just stored vectors
        (&sect;3.2).</li>
        <li><b>The momentum update.</b> If we trained $f_k$ by gradients too, it would lurch every step, and the
        old keys still sitting in the queue would be encoded by a stale, very different $f_k$ &mdash; an
        <i>inconsistent</i> dictionary, which the paper found "yields poor results" (&sect;3.3). Instead
        $f_k$'s weights are an <b>exponential moving average</b> of $f_q$'s weights (Eqn. 2): each step
        $f_k$ takes a tiny step toward $f_q$. With a large momentum ($m=0.999$), $f_k$ barely changes per step,
        so every key in the queue &mdash; old or new &mdash; was made by nearly the same encoder. <b>Large +
        consistent.</b></li>
       </ol>
       <p>The loss that ties it together is <b>InfoNCE</b> (Eqn. 1): a $(K{+}1)$-way softmax classifier whose
       job is to pick the one positive key out of the $1$ positive $+$ $K$ negatives.</p>`,
    architecture:
      `<p>MoCo has three components plus the contrastive head. The pretext task is <b>instance
       discrimination</b>: a query and a key are a positive pair iff they are two augmented views of the
       <i>same</i> source image (&sect;3.4).</p>
       <ol>
        <li><b>Query encoder $f_q$.</b> A backbone (the paper uses a <b>ResNet-50</b>) whose final
        fully-connected layer, after global average pooling, outputs a fixed <b>$C=128$-D</b> vector; that
        vector is <b>L2-normalized</b> &mdash; this normalized $128$-D vector is "the representation." Trained by
        backprop. Input view $x^q$ is a <b>$224{\\times}224$ random-resized crop</b> of the image with random
        color jitter, horizontal flip, and grayscale conversion.</li>
        <li><b>Key / momentum encoder $f_k$.</b> An <b>identical-architecture copy</b> of $f_q$ (same ResNet-50
        &rarr; $128$-D &rarr; L2-norm). It is <i>not</i> trained by gradients; its weights $\\theta_k$ are an
        exponential moving average of $\\theta_q$ (Eqn. 2, $m=0.999$). It encodes a <i>second</i> augmented view
        $x^k$ of the same image into the positive key $k_+$. Its forward pass runs under <code>no_grad</code> and
        the keys are <b>detached</b>.</li>
        <li><b>Queue (the dictionary).</b> A first-in-first-out buffer holding the last <b>$K=65536$</b> keys as a
        $C\\times K$ matrix. Each step the current batch's $N$ keys are <b>enqueued</b> and the oldest $N$ are
        <b>dequeued</b>. The queue is just stored vectors &mdash; no backprop &mdash; so its size is
        <b>decoupled from the batch size $N$</b> (&sect;3.2).</li>
        <li><b>Contrastive head (data flow, Algorithm 1).</b> Encode $q=f_q(x^q)$ ($N\\times C$) and
        $k=f_k(x^k)$ ($N\\times C$, detached). Positive logits $l_{\\text{pos}}=$ row-wise $q\\!\\cdot\\!k_+$
        (batched matmul, $N\\times 1$); negative logits $l_{\\text{neg}}=q\\,Q^{\\top}$ against the queue
        ($N\\times K$). Concatenate to $N\\times(1{+}K)$, divide by $\\tau=0.07$, and apply cross-entropy with the
        <b>all-zeros</b> label (the positive sits in column 0) &mdash; that is exactly Eqn. 1.</li>
       </ol>
       <p><b>Per-step flow:</b> two augmentations &rarr; $f_q$/$f_k$ forward &rarr; build $[l_{\\text{pos}},
       l_{\\text{neg}}]$ &rarr; InfoNCE loss &rarr; SGD on $\\theta_q$ &rarr; momentum-update $\\theta_k$ (Eqn. 2)
       &rarr; enqueue new keys / dequeue oldest. One implementation detail: <b>shuffling BatchNorm</b> &mdash;
       the key encoder's mini-batch sample order is shuffled across GPUs before encoding (and unshuffled after),
       so a query and its positive key never share BN statistics; without it "the model appears to 'cheat' the
       pretext task" and learns poor representations (&sect;3.4). Our toy MLP has no BatchNorm, so we skip it.</p>`,
    symbols: [
      { sym: "$x^q,\\ x^k$", desc: "the two <b>augmented views</b> of the <i>same</i> source image: $x^q$ is fed to the query encoder, $x^k$ to the key encoder. Different random crops/jitter of one picture." },
      { sym: "$f_q$", desc: "the <b>query encoder</b> &mdash; the network we actually train with gradients. Its parameters are $\\theta_q$." },
      { sym: "$f_k$", desc: "the <b>key encoder</b> &mdash; <i>not</i> trained by gradients; its parameters $\\theta_k$ slowly track $\\theta_q$ (Eqn. 2). Also called the <b>momentum encoder</b>." },
      { sym: "$q = f_q(x^q)$", desc: "the <b>query</b> feature vector (L2-normalized): one image's representation we are trying to place." },
      { sym: "$k_+$", desc: "the <b>positive key</b>: $f_k$ applied to the <i>other</i> view of the <i>same</i> image. The one correct match for $q$." },
      { sym: "$k_i$", desc: "a <b>key</b> in the dictionary; for $i\\gt 0$ these are the <b>negatives</b> (keys from other images, sitting in the queue)." },
      { sym: "$q\\!\\cdot\\!k$", desc: "the <b>dot product</b> (similarity score) between the query and a key. With both L2-normalized, it equals the <b>cosine similarity</b>, in $[-1,1]$." },
      { sym: "$\\tau$", desc: "the <b>temperature</b>: a small positive number (paper uses $\\tau=0.07$) that divides every similarity. Smaller $\\tau$ &rarr; sharper softmax &rarr; the loss focuses harder on the closest negatives." },
      { sym: "$K$", desc: "the <b>queue size</b> = number of negatives in the dictionary (paper default $K=65536$). Decoupled from the batch size $N$." },
      { sym: "$C$", desc: "the <b>feature dimension</b> of each encoded vector (paper uses $C=128$): the width of $q$ and every key $k$ after the encoder's final layer and L2-normalization." },
      { sym: "$N$", desc: "the <b>mini-batch size</b>: how many images per training step. Each step enqueues $N$ keys and dequeues the oldest $N$." },
      { sym: "$\\theta_q,\\ \\theta_k$", desc: "the <b>weight vectors</b> of $f_q$ and $f_k$. $\\theta_q$ is updated by the optimizer; $\\theta_k$ by the momentum rule." },
      { sym: "$m$", desc: "the <b>momentum coefficient</b> in $[0,1)$ (paper default $m=0.999$): how much of the <i>old</i> key weights to keep each step. Closer to $1$ = slower-moving, more-consistent key encoder." },
      { sym: "$\\mathcal{L}_q$", desc: "the <b>InfoNCE loss</b> for one query $q$ &mdash; a $(K{+}1)$-way cross-entropy with the positive as the correct class." },
      { sym: "“linear probe”", desc: "a plain term: freeze the trained encoder and fit a single linear classifier on top of its features. Its accuracy measures how <b>linearly separable</b>, hence how useful, the learned features are." }
    ],
    formula: `$$ \\mathcal{L}_q = -\\log \\frac{\\exp(q\\!\\cdot\\!k_+ / \\tau)}{\\sum_{i=0}^{K}\\exp(q\\!\\cdot\\!k_i / \\tau)} \\qquad\\text{(Eqn. 1, InfoNCE)} \\qquad\\qquad \\theta_k \\leftarrow m\\,\\theta_k + (1-m)\\,\\theta_q \\qquad\\text{(Eqn. 2, momentum update)} $$`,
    whatItDoes:
      `<p><b>Equation 1 (the loss).</b> Read it as the cross-entropy of a softmax classifier with $K{+}1$
       classes &mdash; one positive and $K$ negatives. The score of each class is the similarity $q\\!\\cdot\\!k_i$
       divided by the temperature $\\tau$. The numerator is the positive's score; the denominator sums over the
       positive <i>and</i> all $K$ negatives. Minimizing $\\mathcal{L}_q$ pushes the positive's score up and the
       negatives' scores down &mdash; i.e. <b>"of all $K{+}1$ keys, the matching one $k_+$ should look most like
       $q$."</b> The paper states it is "the log loss of a $(K{+}1)$-way softmax-based classifier that tries to
       classify $q$ as $k_+$" (&sect;3.1).</p>
       <p><b>Equation 2 (the update).</b> Don't backprop into the key encoder. Instead, after each gradient step
       on $\\theta_q$, nudge $\\theta_k$ a tiny fraction $(1-m)$ of the way toward the new $\\theta_q$, keeping a
       fraction $m$ of its old value. With $m=0.999$ the key encoder moves at one-thousandth the speed, so the
       keys in the queue stay mutually consistent. The paper notes "only the parameters $\\theta_q$ are updated
       by back-propagation" (&sect;3.3).</p>`,
    derivation:
      `<p><b>Short recap &mdash; full math in the concept lesson.</b> Why is Eqn. 1 the right loss? It is the
       <b>InfoNCE</b> objective: with $K{+}1$ items, exactly one positive, and softmax scores
       $\\propto \\exp(q\\!\\cdot\\!k/\\tau)$, minimizing the negative-log-probability of the positive is exactly
       maximizing a lower bound on the <b>mutual information</b> between the two views &mdash; the encoder is
       forced to keep whatever is shared between two augmentations of the same image (its <i>identity</i>) and
       discard the augmentation noise. The full "why InfoNCE bounds mutual information," the role of $\\tau$,
       and the contrast with SimCLR's NT-Xent loss are derived in the <b>unl-moco</b> concept lesson &mdash;
       head there for the information-theory argument; we only recap it here.</p>
       <p>Eqn. 2 needs no derivation &mdash; it is a design choice (an exponential moving average). Its
       justification is empirical: the paper's ablation shows the EMA is what keeps the large queue consistent
       (see <i>results</i>).</p>`,
    example:
      `<p>Two tiny worked computations &mdash; both are recomputed in the notebook so you can check them.</p>
       <p><b>(a) The momentum update (Eqn. 2), with $m=0.999$.</b> Take a single key-encoder weight vector
       $\\theta_k = [0.40,\\,-0.20]$ and the current query-encoder weights $\\theta_q = [0.60,\\,0.10]$. Apply
       $\\theta_k \\leftarrow m\\,\\theta_k + (1-m)\\,\\theta_q$ component by component:</p>
       <ul class="steps">
        <li>Component 0: $0.999\\times 0.40 + 0.001\\times 0.60 = 0.3996 + 0.0006 = \\mathbf{0.40020}$.</li>
        <li>Component 1: $0.999\\times(-0.20) + 0.001\\times 0.10 = -0.1998 + 0.0001 = \\mathbf{-0.19970}$.</li>
        <li><b>Read it:</b> the key weights moved from $[0.40,-0.20]$ to $[0.4002,-0.1997]$ &mdash; a
        microscopic step toward $\\theta_q$. After the optimizer changes $\\theta_q$ a lot in one step, $\\theta_k$
        barely budges. That is exactly why every key already in the queue is still "almost current."</li>
       </ul>
       <p><b>(b) The InfoNCE loss (Eqn. 1)</b> for $1$ positive and $K=2$ negatives, with $\\tau=0.07$. Suppose
       the (cosine) similarities are: positive $q\\!\\cdot\\!k_+ = 0.8$, negatives $0.5$ and $0.3$. The table builds
       the softmax denominator one key at a time:</p>
       <table class="extable">
        <caption>Per-key terms of the InfoNCE softmax ($\\tau=0.07$). The positive sits in column&nbsp;0.</caption>
        <thead>
         <tr><th>key</th><th class="num">sim $q\\!\\cdot\\!k$</th><th class="num">logit $=$ sim$/\\tau$</th><th class="num">$\\exp(\\text{logit})$</th></tr>
        </thead>
        <tbody>
         <tr><td class="row-h">$k_+$ (positive)</td><td class="num">0.8</td><td class="num">11.4286</td><td class="num">91910.6</td></tr>
         <tr><td class="row-h">$k_1$ (negative)</td><td class="num">0.5</td><td class="num">7.1429</td><td class="num">1265.0</td></tr>
         <tr><td class="row-h">$k_2$ (negative)</td><td class="num">0.3</td><td class="num">4.2857</td><td class="num">72.7</td></tr>
         <tr><td class="row-h"><b>denominator (sum)</b></td><td class="num">&mdash;</td><td class="num">&mdash;</td><td class="num"><b>93248.3</b></td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Divide by $\\tau$:</b> logits $= [0.8,\\,0.5,\\,0.3]/0.07 = [11.4286,\\,7.1429,\\,4.2857]$ (column 3).</li>
        <li><b>Exponentiate &amp; sum:</b> the last column sums to $91910.6 + 1265.0 + 72.7 = 93248.3$.</li>
        <li><b>Loss</b> $= -\\log\\!\\big(91910.6 / 93248.3\\big) = -\\log(0.98565) = \\mathbf{0.0144}$.</li>
        <li><b>Read it:</b> the positive already dominates the denominator, so the loss is tiny &mdash; the query
        is correctly "classified" as its positive key. Had a negative scored $0.8$ too, its $\\exp$ term would
        rival the positive's and the loss would jump.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Build two encoders</b> $f_q$ and $f_k$ with identical initial weights (<code>fk.load_state_dict(fq.state_dict())</code>); turn OFF gradients for $f_k$.</li>
        <li><b>Init the queue:</b> an $(K\\times d)$ buffer of random L2-normalized vectors, plus a write pointer.</li>
        <li><b>Per step:</b> draw a batch; make two augmented views $x^q,x^k$. Encode $q=\\text{norm}(f_q(x^q))$ and (no grad) $k=\\text{norm}(f_k(x^k))$.</li>
        <li><b>Logits:</b> positive $l_{\\text{pos}} = $ row-wise $q\\!\\cdot\\!k$ (shape $N\\times1$); negatives $l_{\\text{neg}} = qQ^{\\top}$ against the queue (shape $N\\times K$). Concatenate, divide by $\\tau$.</li>
        <li><b>Loss:</b> cross-entropy with the all-zeros label (positive in column 0) &mdash; that IS Eqn. 1.</li>
        <li><b>Update $f_q$</b> with the optimizer (backprop).</li>
        <li><b>Momentum-update $f_k$</b> (Eqn. 2): <code>θk ← m·θk + (1−m)·θq</code> for every parameter, under <code>no_grad</code>.</li>
        <li><b>Enqueue/dequeue:</b> write the new keys $k$ into the queue at the pointer; advance it (wrap around) &mdash; the oldest keys are overwritten.</li>
        <li><b>Linear-probe:</b> freeze $f_q$, fit a single linear layer on its features, report test accuracy. <b>Ablate:</b> set $m=1.0$ (key encoder never moves) and watch the probe drop.</li>
      </ol>`,
    results:
      `<p>Quoted figures from the paper (do not memorize as gold &mdash; these are the authors' large-scale
       numbers). On the ImageNet <b>linear classification protocol</b> (freeze features, train a linear
       classifier), MoCo with a ResNet-50 backbone reports <b>60.6%</b> top-1 accuracy (Table 1), rising to
       <b>65.4%</b> and <b>68.6%</b> with $2\\times$ and $4\\times$ wider backbones. The momentum ablation
       (&sect;4.1) shows the moving-average key encoder matters: <b>$m=0.999$ gives 59.0%</b> vs
       <b>$m=0.99$ &rarr; 57.8%</b> and <b>$m=0.9$ &rarr; 55.2%</b>, and the paper notes that with no momentum
       at all ($m=0$) "the training loss oscillates and fails to converge." On transfer, the abstract states
       MoCo "can outperform its supervised pre-training counterpart in 7 detection/segmentation tasks."</p>
       <p><i>Those are the paper's reported numbers, quoted from the abstract/Tables. The numbers in the CODEVIZ
       panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> The headline metric is the <b>ImageNet linear-classification
        protocol</b>: freeze the MoCo-trained encoder $f_q$ and fit a single linear classifier on its features
        &mdash; top-1 accuracy measures how linearly separable, hence useful, the learned features are. The
        "no-skill" floor is the <b>random (untrained) encoder of the same shape</b>: if a linear probe on MoCo
        features doesn't beat the random-encoder probe, MoCo learned nothing. The paper's anchor is
        <b>60.6% top-1</b> with a ResNet-50 backbone (Table&nbsp;1). The secondary metric is the <b>InfoNCE
        training loss</b> itself (Eqn.&nbsp;1) &mdash; it should fall as $f_q$ learns to pick $k_+$ out of the
        $K{+}1$ keys.</p>
       <p><b>2. Sanity checks before the full run.</b></p>
       <ul>
        <li><b>Known-answer unit tests.</b> Recompute the lesson's two worked examples: the momentum step
        $[0.40,-0.20]\\to[0.4002,-0.1997]$ at $m=0.999$ (Eqn.&nbsp;2), and the InfoNCE loss $\\approx 0.0144$
        for sims $[0.8,0.5,0.3]$ at $\\tau=0.07$ (Eqn.&nbsp;1).</li>
        <li><b>Loss at init.</b> Before learning, the query is no closer to $k_+$ than to a random negative, so
        the InfoNCE loss should sit near $\\ln(K{+}1)$ &mdash; the $(K{+}1)$-way uniform-softmax value. A loss
        far from this at step&nbsp;0 means the logits or label are wrong.</li>
        <li><b>Shapes &amp; label.</b> Assert $l_{\\text{pos}}$ is $N\\times1$, $l_{\\text{neg}}$ is $N\\times K$,
        the concatenation is $N\\times(1{+}K)$, and the cross-entropy target is <b>all zeros</b> (positive in
        column&nbsp;0). Confirm $q$ and every key are L2-normalized (norms $=1$) so dot products are cosine
        similarities in $[-1,1]$.</li>
        <li><b>No-grad check.</b> Verify $f_k$'s parameters have <code>requires_grad=False</code> and the queue
        entries are detached &mdash; nothing should backprop into the key encoder or the stored negatives.</li>
       </ul>
       <p><b>3. Expected range.</b> The paper's anchor is <b>60.6% ImageNet top-1</b> under the linear protocol
        (Table&nbsp;1, approximate, cited above) &mdash; not reproducible on a toy run, so judge by the
        <i>ordering</i>: MoCo probe $\\gt$ random-encoder probe by a clear margin, and the InfoNCE loss visibly
        decreasing. In our small 8-cluster run the MoCo probe hit ~0.99 vs ~0.81 random (our numbers, not the
        paper's). Rule of thumb (not a paper claim): if MoCo barely beats random, the contrastive signal is too
        weak &mdash; check $\\tau$, queue size, and that the two views are different augmentations.</p>
       <p><b>4. Ablation &mdash; prove the momentum encoder earns its keep.</b> The central idea is the
        <b>momentum (EMA) update of the key encoder</b> (Eqn.&nbsp;2). Turn it OFF by setting $m=1.0$ so $f_k$
        stays frozen at its random init and never tracks $f_q$ &mdash; keep encoders, queue, $\\tau$, optimizer,
        and data identical. The InfoNCE loss should stay high (the query chases a fixed, mismatched target) and
        the linear probe should <b>drop</b>. In our run loss ~4.4 (vs ~3.6) and probe ~0.93 (vs ~0.99). The
        paper's own ablation (&sect;4.1): $m=0.999\\to59.0\\%$, $m=0.9\\to55.2\\%$, and at $m=0$ the loss
        "oscillates and fails to converge."</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Probe stuck at the random-encoder level.</b> No features learned &mdash; gradients leaking into
        $f_k$, the two views identical (so the task is trivial), or the label not pointing at column&nbsp;0.</li>
        <li><b>InfoNCE loss flat / non-decreasing.</b> Momentum too small or $m=1.0$ (stale/frozen key encoder),
        or the queue isn't being updated &mdash; the dictionary is inconsistent.</li>
        <li><b>Loss collapses to ~0 almost immediately.</b> The query can "cheat" the pretext task &mdash; e.g.
        BatchNorm statistics leaking between $f_q$ and $f_k$ (the paper's shuffling-BN issue), or the positive
        being trivially identifiable; features will probe poorly despite the tiny loss.</li>
        <li><b>Loss NaN / unbounded logits.</b> Missing L2-normalization, so dot products blow up and $\\tau$
        loses meaning &mdash; normalize $q$ and every $k$.</li>
        <li><b>Loss NaN or oscillating wildly.</b> LR too high, or (per the paper) momentum at $m=0$ &mdash;
        raise $m$ toward $0.99$&ndash;$0.999$.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so we <b>import</b>
       them and build only MoCo's novel composition. <b>Import:</b> <code>nn.Linear</code>, <code>nn.ReLU</code>,
       <code>F.normalize</code>, <code>F.cross_entropy</code>, and the optimizer (all preinstalled in Colab
       &mdash; no pip). <b>Build by hand:</b> (1) the two encoders with the gradient-frozen key encoder, (2) the
       <b>FIFO queue</b> of negatives with enqueue/dequeue, (3) the <b>InfoNCE</b> logits + loss (Eqn. 1), (4)
       the <b>momentum update</b> (Eqn. 2), and (5) the <b>linear probe</b> + the $m=1.0$ <b>ablation</b>. The
       "why InfoNCE bounds mutual information" math is recapped from the unl-moco concept lesson, not
       re-derived.</p>
       <p><b>Cross-link &mdash; MoCo vs SimCLR (paper-simclr / unl-simclr).</b> Both minimize an InfoNCE-style
       contrastive loss over two augmented views. They differ in <i>where the negatives come from</i> and
       <i>how the key features are produced</i>:</p>
       <ul>
        <li><b>SimCLR (end-to-end):</b> negatives are the <i>other images in the current batch</i>, encoded by
        the <i>same</i> network as the query (one encoder, fully end-to-end). Dictionary = batch &mdash;
        consistent by construction, but you need a <b>very large batch</b> for many negatives.</li>
        <li><b>MoCo (queue + momentum):</b> negatives come from a <b>queue</b> spanning many past batches, and
        the keys are made by a separate <b>momentum encoder</b> so those queued vectors stay consistent. This
        buys a <b>large dictionary with a small batch</b> &mdash; the queue replaces batch size, and the
        momentum update replaces "same network" as the consistency mechanism.</li>
       </ul>
       <p>So: <b>queue + momentum (MoCo) vs large batch (SimCLR)</b> are two answers to the same "large AND
       consistent dictionary" problem.</p>`,
    pitfalls:
      `<ul>
        <li><b>Backpropagating into the key encoder.</b> The keys are computed under <code>no_grad</code> and
        $f_k$ is updated <i>only</i> by Eqn. 2. If you let gradients flow into $f_k$, the queue's old keys become
        inconsistent and training destabilizes. <b>Fix:</b> <code>requires_grad=False</code> on $f_k$ and wrap
        the key forward + momentum update in <code>torch.no_grad()</code>.</li>
        <li><b>Forgetting to detach/stop-grad the queue.</b> The queued negatives are stored vectors, not part
        of the graph &mdash; they must not carry gradients. Enqueue with <code>.detach()</code>.</li>
        <li><b>Momentum too small.</b> A small $m$ (e.g. $0.9$) lets $f_k$ lurch, so old queued keys are stale.
        The paper's ablation shows accuracy falls and at $m=0$ the loss "fails to converge." <b>Use $m$ close to
        $1$</b> (0.99-0.999).</li>
        <li><b>Not L2-normalizing.</b> InfoNCE uses cosine similarity; without <code>F.normalize</code> the dot
        products are unbounded and $\\tau$ no longer means what the paper intends. Normalize $q$ and every $k$.</li>
        <li><b>Wrong label for the cross-entropy.</b> The positive logit sits in <b>column 0</b> of the
        concatenated <code>[pos, negs]</code> matrix, so the target label is <b>all zeros</b>. A different label
        trains the model to match a negative.</li>
        <li><b>BatchNorm "cheating" across the two encoders.</b> The paper uses <b>shuffling BN</b> so the model
        can't use batch statistics to trivially tell query from key. Our toy MLP has no BatchNorm, so this does
        not bite here &mdash; but at scale it is a real repro gotcha.</li>
      </ul>`,
    recall: [
      "Write the InfoNCE loss (Eqn. 1) from memory; what are the $K{+}1$ classes?",
      "Write the momentum update (Eqn. 2); which encoder does it apply to, and which gets gradients?",
      "Why does a LARGE momentum $m$ keep the dictionary consistent?",
      "What is the queue for, and what does it decouple?",
      "In one line: how does MoCo differ from SimCLR's way of getting negatives?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working MoCo whose linear probe beats a random encoder. Set the
            momentum $m=1.0$ so the key encoder <i>never</i> updates (it stays at its initial random weights),
            retrain, and re-probe. What happens to the InfoNCE training loss and to the probe accuracy, and
            what does that demonstrate?`,
        steps: [
          { do: `Change only the momentum: skip the Eqn. 2 update so $\\theta_k$ is frozen at init; keep encoders, queue, $\\tau$, optimizer, and data identical.`, why: `An honest ablation changes exactly one thing &mdash; the momentum update &mdash; so any difference is attributable to it.` },
          { do: `Retrain and watch the InfoNCE loss: it stays high / does not fall the way the $m=0.99$ run's did, because $f_q$ is chasing a fixed, mismatched target encoder.`, why: `If $f_k$ never tracks $f_q$, the positive key is produced by an encoder that disagrees with the query encoder, so the positive can't be made reliably most-similar &mdash; the loss can't drop much.` },
          { do: `Linear-probe the frozen $f_q$: accuracy is noticeably lower than the $m=0.99$ run.`, why: `A worse contrastive objective yields worse features, which a linear probe exposes directly.` }
        ],
        answer: `<p>With $m=1.0$ the key encoder is frozen at random init, so $f_q$ chases a fixed, inconsistent
                 target: the InfoNCE loss stays high (in our run ~4.4 vs ~3.6 for $m=0.99$) and the linear-probe
                 accuracy drops (~0.93 vs ~0.99 in our run). Since the only change is the momentum update, this
                 isolates Eqn. 2 as the mechanism that keeps the dictionary consistent enough to learn good
                 features &mdash; matching the paper's momentum ablation (&sect;4.1). The CODEVIZ panel shows the
                 two loss curves.</p>`
      },
      {
        q: `Recompute the momentum update by hand. The key weight is $\\theta_k = [1.0,\\,0.0]$, the query weight
            is $\\theta_q = [0.0,\\,1.0]$, and $m=0.99$. What is the new $\\theta_k$, and how far did it move
            toward $\\theta_q$?`,
        steps: [
          { do: `Apply Eqn. 2 component-wise: $\\theta_k \\leftarrow 0.99\\,\\theta_k + 0.01\\,\\theta_q$.`, why: `The update is an element-wise exponential moving average.` },
          { do: `Component 0: $0.99\\times 1.0 + 0.01\\times 0.0 = 0.99$. Component 1: $0.99\\times 0.0 + 0.01\\times 1.0 = 0.01$.`, why: `Keep $99\\%$ of the old weight, add $1\\%$ of the query weight.` },
          { do: `Compare to the $m=0.999$ case: there it would be $[0.999,\\,0.001]$ &mdash; an even smaller step.`, why: `Larger $m$ &rarr; slower key encoder &rarr; more-consistent dictionary.` }
        ],
        answer: `<p>$\\theta_k \\leftarrow [0.99,\\,0.01]$ &mdash; it moved just $1\\%$ of the way toward
                 $\\theta_q$. With $m=0.999$ it would move only $0.1\\%$ (to $[0.999,0.001]$). The bigger the
                 momentum, the slower and more consistent the key encoder, which is why the paper defaults to
                 $m=0.999$.</p>`
      },
      {
        q: `Your InfoNCE worked example had positive similarity $0.8$ and negatives $0.5, 0.3$ ($\\tau=0.07$),
            giving loss $\\approx 0.0144$. Now suppose one negative also scores $0.8$ (a "hard negative"): the
            similarities are positive $0.8$, negatives $0.8$ and $0.3$. Does the loss go up or down, and why?`,
        steps: [
          { do: `Logits $= [0.8,0.8,0.3]/0.07 = [11.4286, 11.4286, 4.2857]$; exponentiate: $[91910.6, 91910.6, 72.7]$, sum $= 183893.9$.`, why: `The hard negative now has the same score as the positive, so its $\\exp$ term equals the positive's.` },
          { do: `Loss $= -\\log(91910.6 / 183893.9) = -\\log(0.49980) \\approx 0.6933$.`, why: `The positive now holds only ~half the softmax mass instead of ~99%.` },
          { do: `Compare: $0.6933 \\gg 0.0144$ &mdash; the loss jumped by ~48×.`, why: `InfoNCE punishes a negative that looks as similar as the positive; that is exactly the signal that trains the encoder.` }
        ],
        answer: `<p>The loss <b>rises sharply</b>, from $\\approx 0.0144$ to $\\approx 0.693$. A negative scoring as
                 high as the positive splits the softmax mass roughly in half, so $-\\log(0.4998)\\approx0.693$.
                 This is the point of contrastive learning: <b>hard negatives</b> (other images that currently
                 look like the query) produce the large gradients that push the encoder to separate them &mdash;
                 and a large queue makes such hard negatives more likely to be present.</p>`
      }
    ]
  });

  window.CODE["paper-moco"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> MoCo's novel parts by hand &mdash; the query encoder $f_q$, the
       gradient-frozen <b>momentum key encoder</b> $f_k$, the FIFO <b>queue</b> of negatives, the <b>InfoNCE</b>
       loss (Eqn. 1), and the <b>momentum update</b> (Eqn. 2) &mdash; on top of <code>nn.Linear</code>
       (preinstalled in Colab, no pip). We train on <b>unlabeled</b> toy clusters, then freeze $f_q$ and fit a
       single <b>linear probe</b>; MoCo's features beat a random encoder. The key lines are
       <code>logits = cat([l_pos, l_neg]) / tau</code> with an all-zeros label (Eqn. 1) and
       <code>pk.data = m*pk.data + (1-m)*pq.data</code> (Eqn. 2). Cell 0 recomputes both worked examples:
       the momentum step $[0.40,-0.20]\\to[0.4002,-0.1997]$ and the InfoNCE loss $0.0144$. The ablation sets
       $m=1.0$ (key encoder never moves) and shows the probe drop. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the lesson's two worked examples. ---
# (a) Momentum update (Eqn. 2): theta_k <- m*theta_k + (1-m)*theta_q,  m=0.999
m = 0.999
tk = torch.tensor([0.40, -0.20]); tq = torch.tensor([0.60, 0.10])
print("worked momentum:", [round(v, 5) for v in (m*tk + (1-m)*tq).tolist()])
# worked momentum: [0.4002, -0.1997]

# (b) InfoNCE (Eqn. 1): 1 positive + K=2 negatives, tau=0.07, sims [0.8, 0.5, 0.3]
tau0 = 0.07
sims = torch.tensor([0.8, 0.5, 0.3])
loss0 = F.cross_entropy((sims/tau0).unsqueeze(0), torch.tensor([0]))   # positive in slot 0
print("worked InfoNCE loss:", round(loss0.item(), 4))           # ~0.0144


# --- 1. Unlabeled toy data: 8 clusters in 16-D. An "instance" = center + identity offset. ---
Din, Dz, Kcls = 16, 8, 8
gC = torch.Generator().manual_seed(7)
centers = torch.randn(Kcls, Din, generator=gC) * 1.2
def gen(nb, gen):
    y = torch.randint(0, Kcls, (nb,), generator=gen)
    x = centers[y] + torch.randn(nb, Din, generator=gen) * 0.7   # per-instance identity
    return x, y
def aug(x):                                                       # two views = two noise draws
    return x + torch.randn_like(x) * 0.5

def make_enc():
    torch.manual_seed(3)                                         # SAME init for fq, fk, and the baseline
    return nn.Sequential(nn.Linear(Din, 64), nn.ReLU(), nn.Linear(64, Dz)).to(device)


# --- 2. MoCo training loop. mm<1.0 -> momentum update; mm=1.0 -> ABLATION (key never updates). ---
def train_moco(mm, steps=500, lr=0.05, tau=0.2, Q=512):
    fq = make_enc(); fk = make_enc()
    fk.load_state_dict(fq.state_dict())                          # identical start (Algorithm 1)
    for p in fk.parameters():
        p.requires_grad = False                                 # key encoder gets NO gradients
    queue = F.normalize(torch.randn(Q, Dz, device=device), dim=1)
    ptr = 0
    opt = torch.optim.SGD(fq.parameters(), lr=lr, momentum=0.9, weight_decay=1e-4)
    g = torch.Generator().manual_seed(42); losses = []
    for s in range(steps):
        x, _ = gen(128, g)
        xq, xk = aug(x).to(device), aug(x).to(device)           # two augmented views
        q = F.normalize(fq(xq), dim=1)                          # query
        with torch.no_grad():
            k = F.normalize(fk(xk), dim=1)                      # positive key (no grad)
        l_pos = (q * k).sum(1, keepdim=True)                    # N x 1   : q . k+
        l_neg = q @ queue.t()                                   # N x K   : q . negatives
        logits = torch.cat([l_pos, l_neg], dim=1) / tau         # Eqn. 1 numerator/denominator scores
        labels = torch.zeros(q.size(0), dtype=torch.long, device=device)   # positive is column 0
        loss = F.cross_entropy(logits, labels)                  # InfoNCE
        opt.zero_grad(); loss.backward(); opt.step()            # update fq only
        losses.append(loss.item())
        with torch.no_grad():
            if mm < 1.0:                                         # Eqn. 2: momentum update of fk
                for pk, pq in zip(fk.parameters(), fq.parameters()):
                    pk.data = mm * pk.data + (1 - mm) * pq.data
            bs = k.size(0)                                       # enqueue new keys, dequeue oldest
            queue[ptr:ptr+bs] = k.detach() if ptr+bs <= Q else k.detach()[:Q-ptr]
            ptr = (ptr + bs) % Q
    return fq, losses


# --- 3. Linear probe: freeze features, fit ONE linear layer, report test accuracy. ---
gtr = torch.Generator().manual_seed(11); gte = torch.Generator().manual_seed(99)
xtr, ytr = gen(800, gtr); xte, yte = gen(800, gte)
xtr, xte, ytr, yte = xtr.to(device), xte.to(device), ytr.to(device), yte.to(device)

def probe(enc):
    with torch.no_grad():
        ftr = F.normalize(enc(xtr), dim=1); fte = F.normalize(enc(xte), dim=1)
    clf = nn.Linear(Dz, Kcls).to(device)
    o = torch.optim.Adam(clf.parameters(), lr=0.05)
    for _ in range(500):
        o.zero_grad(); F.cross_entropy(clf(ftr), ytr).backward(); o.step()
    return (clf(fte).argmax(1) == yte).float().mean().item()

print("\\ntraining MoCo (m=0.99) ...")
fq_moco, loss_moco = train_moco(0.99)
print("training ABLATION (m=1.0, key encoder frozen) ...")
fq_abl,  loss_abl  = train_moco(1.0)
acc_moco = probe(fq_moco)
acc_abl  = probe(fq_abl)
acc_rand = probe(make_enc())                                    # random untrained encoder baseline

print("\\nlinear-probe accuracy")
print("  MoCo (m=0.99) features : %.3f" % acc_moco)
print("  ABLATION (m=1.0)       : %.3f" % acc_abl)
print("  random encoder         : %.3f" % acc_rand)
print("final InfoNCE loss  MoCo %.3f  vs  ablation %.3f" % (loss_moco[-1], loss_abl[-1]))
# MoCo features beat the random encoder; the m=1.0 ablation (stale key encoder) lands in between
# with a higher, non-decreasing InfoNCE loss.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-moco"] = {
    question: "Does MoCo (momentum encoder + queue) learn useful unlabeled features, and does the momentum update matter? Linear-probe accuracy + InfoNCE loss vs an m=1.0 ablation.",
    charts: [
      {
        type: "bar",
        title: "Linear-probe accuracy on frozen features (8-class toy, our run)",
        xlabel: "encoder",
        ylabel: "test accuracy",
        series: [
          {
            name: "linear-probe accuracy",
            color: "#7ee787",
            points: [["MoCo m=0.99", 0.993], ["Ablation m=1.0", 0.933], ["Random encoder", 0.808]]
          }
        ]
      },
      {
        type: "line",
        title: "InfoNCE training loss — MoCo (m=0.99) vs ablation (m=1.0, key never updates)",
        xlabel: "training step",
        ylabel: "InfoNCE loss",
        series: [
          {
            name: "Ablation (m=1.0)",
            color: "#ff7b72",
            points: [[0,3.419],[22,4.44],[43,4.46],[65,4.637],[87,4.479],[108,4.434],[130,4.405],[152,4.475],[174,4.46],[195,4.417],[217,4.337],[239,4.43],[260,4.479],[282,4.435],[304,4.392],[325,4.476],[347,4.597],[369,4.375],[391,4.499],[412,4.472],[434,4.474],[456,4.516],[477,4.352],[499,4.414]]
          },
          {
            name: "MoCo (m=0.99)",
            color: "#7ee787",
            points: [[0,3.419],[22,4.078],[43,3.92],[65,3.918],[87,3.776],[108,3.788],[130,3.712],[152,3.762],[174,3.635],[195,3.71],[217,3.674],[239,3.632],[260,3.735],[282,3.684],[304,3.63],[325,3.641],[347,3.735],[369,3.634],[391,3.709],[412,3.683],[434,3.7],[456,3.638],[477,3.659],[499,3.611]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. An 8-cluster, 16-D unlabeled toy set; a 2-layer MLP encoder trained with MoCo (FIFO queue of 512 negatives, InfoNCE with &tau;=0.2). LEFT: a linear probe on the frozen MoCo features reaches 0.993 test accuracy, far above the same-shape random (untrained) encoder at 0.808 &mdash; MoCo learned useful features from no labels. The m=1.0 ablation (the key encoder is frozen at init, so Eqn. 2 never runs) lands at 0.933. RIGHT: with the momentum update (green) the InfoNCE loss settles lower (~3.6); the ablation (red) stays high (~4.4) and never really falls, because the query encoder is chasing a fixed, inconsistent key encoder. Same init, data, optimizer, queue, and &tau; &mdash; the only difference is the Eqn. 2 momentum update.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# Reproduces the qualitative MoCo effect on unlabeled toy data: a linear probe on the
# learned features beats a random encoder, and the momentum update (Eqn. 2) is what
# keeps the InfoNCE loss falling. (See the CODE block above for the full annotated loop.)
torch.manual_seed(0)
Din, Dz, Kcls = 16, 8, 8
gC = torch.Generator().manual_seed(7)
centers = torch.randn(Kcls, Din, generator=gC) * 1.2
def gen(nb, gen):
    y = torch.randint(0, Kcls, (nb,), generator=gen)
    return centers[y] + torch.randn(nb, Din, generator=gen) * 0.7, y
def aug(x): return x + torch.randn_like(x) * 0.5
def make_enc():
    torch.manual_seed(3)
    return nn.Sequential(nn.Linear(Din, 64), nn.ReLU(), nn.Linear(64, Dz))

def train_moco(mm, steps=500, tau=0.2, Q=512):
    fq, fk = make_enc(), make_enc(); fk.load_state_dict(fq.state_dict())
    for p in fk.parameters(): p.requires_grad = False
    queue = F.normalize(torch.randn(Q, Dz), dim=1); ptr = 0
    opt = torch.optim.SGD(fq.parameters(), lr=0.05, momentum=0.9, weight_decay=1e-4)
    g = torch.Generator().manual_seed(42); losses = []
    for s in range(steps):
        x, _ = gen(128, g); q = F.normalize(fq(aug(x)), dim=1)
        with torch.no_grad(): k = F.normalize(fk(aug(x)), dim=1)
        logits = torch.cat([(q*k).sum(1, keepdim=True), q @ queue.t()], 1) / tau
        loss = F.cross_entropy(logits, torch.zeros(q.size(0), dtype=torch.long))
        opt.zero_grad(); loss.backward(); opt.step(); losses.append(loss.item())
        with torch.no_grad():
            if mm < 1.0:
                for pk, pq in zip(fk.parameters(), fq.parameters()):
                    pk.data = mm*pk.data + (1-mm)*pq.data            # Eqn. 2
            bs = k.size(0)
            queue[ptr:ptr+bs] = k.detach() if ptr+bs <= Q else k.detach()[:Q-ptr]
            ptr = (ptr + bs) % Q
    return fq, losses

gtr = torch.Generator().manual_seed(11); gte = torch.Generator().manual_seed(99)
xtr, ytr = gen(800, gtr); xte, yte = gen(800, gte)
def probe(enc):
    with torch.no_grad():
        ftr, fte = F.normalize(enc(xtr), dim=1), F.normalize(enc(xte), dim=1)
    clf = nn.Linear(Dz, Kcls); o = torch.optim.Adam(clf.parameters(), lr=0.05)
    for _ in range(500):
        o.zero_grad(); F.cross_entropy(clf(ftr), ytr).backward(); o.step()
    return (clf(fte).argmax(1) == yte).float().mean().item()

fq_moco, lm = train_moco(0.99); fq_abl, la = train_moco(1.0)
print("probe  MoCo %.3f  ablation %.3f  random %.3f"
      % (probe(fq_moco), probe(fq_abl), probe(make_enc())))
# probe  MoCo 0.993  ablation 0.933  random 0.808   (our run, not the paper's numbers)`
  };
})();
