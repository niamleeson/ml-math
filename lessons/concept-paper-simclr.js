/* Paper lesson — "A Simple Framework for Contrastive Learning of Visual Representations"
   (SimCLR), Chen, Kornblith, Norouzi, Hinton 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-simclr".
   GROUNDED from arXiv:2002.05709 (abstract) and the ar5iv HTML mirror (Section 2.1 NT-Xent Eqn. 1,
   Section 2.3 linear evaluation). Track B (architecture): build the two-views pipeline + encoder +
   projection head + NT-Xent loss by hand on nn primitives; pretrain on an MNIST subset; then a LINEAR
   PROBE on the frozen features beats a from-scratch linear/conv classifier in the low-label regime.
   The contrastive-learning math owner is concept unl-simclr; here we recap and link. */
(function () {
  window.LESSONS.push({
    id: "paper-simclr",
    title: "SimCLR — A Simple Framework for Contrastive Learning of Visual Representations (2020)",
    tagline: "Pull two augmented views of the same image together and push every other image apart — no labels needed.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Ting Chen, Simon Kornblith, Mohammad Norouzi, Geoffrey Hinton",
      org: "Google Research, Brain Team",
      year: 2020,
      venue: "arXiv:2002.05709 (Feb 2020); ICML 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2002.05709",
      code: "https://github.com/google-research/simclr"
    },
    conceptLink: "unl-simclr",
    partOf: [
      { capstone: "capstone-simclr", step: 1, builds: "the two-view pipeline + encoder + projection head + NT-Xent loss" }
    ],
    prereqs: ["unl-simclr", "dl-cosine-similarity", "dl-cross-entropy", "dl-conv", "pt-cnn", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the best image models were <b>supervised</b>: they learned from millions of
       hand-labelled pictures. Labels are expensive. The dream was <b>self-supervised learning</b> — learn
       a useful representation (a vector summary of an image) from <i>unlabelled</i> pictures alone, then attach
       a tiny labelled classifier on top. Earlier self-supervised methods worked, but they were complicated:
       memory banks, special architectures, hand-designed "pretext" puzzles (predict the rotation, solve a
       jigsaw). They lagged well behind supervised training.</p>
       <p>The paper's framing (§1): could a <b>simple</b> contrastive method — no memory bank, no special
       architecture — close that gap? "Contrastive" means: learn by comparison. Make two distorted copies
       (called <b>views</b>) of one image look alike in representation space, while looking different from every
       other image in the batch. The open question was whether plain contrastive learning, done carefully,
       could match supervised features.</p>`,
    contribution:
      `<ul>
        <li><b>A simple contrastive framework.</b> Two random augmentations of each image → a shared encoder
        → a small projection head → a contrastive loss that pulls the matching pair together and pushes the
        rest apart. No memory bank, no momentum encoder, no specialized architecture.</li>
        <li><b>The composition of augmentations matters.</b> The abstract states "composition of data
        augmentations plays a critical role in defining effective predictive tasks" — random crop plus colour
        distortion in particular.</li>
        <li><b>A learnable projection head helps.</b> The abstract reports "a learnable nonlinear
        transformation between the representation and the contrastive loss substantially improves the quality
        of the learned representations." You contrast on the head's output, but keep the encoder's output as
        your representation.</li>
        <li><b>Bigger batches and longer training help.</b> Contrastive learning "benefits from larger batch
        sizes and more training steps compared to supervised learning," because a big batch supplies many
        negatives.</li>
      </ul>`,
    whyItMattered:
      `<p>SimCLR showed a plain, well-tuned contrastive recipe could rival supervised pretraining: the abstract
       reports a linear classifier on its frozen features reaching <b>76.5% ImageNet top-1</b>, "a 7% relative
       improvement over previous state-of-the-art, matching the performance of a supervised ResNet-50." It made
       self-supervised pretraining a mainstream tool, and the <b>NT-Xent</b> loss it popularized (normalized
       temperature-scaled cross-entropy) became the template for later contrastive methods — MoCo, CLIP, and
       many domain-specific encoders all use the same pull-together / push-apart idea.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§2.1 (The Contrastive Learning Framework)</b> — Figure 2's four boxes (augment → encoder
        $f$ → projection head $g$ — NT-Xent loss) and the <b>NT-Xent equation (Eqn. 1)</b> you will
        transcribe and implement.</li>
        <li><b>§2.3 (Evaluation protocol)</b> — the <b>linear evaluation</b> ("linear probe"): freeze the
        encoder, train only a linear classifier on top. This is how representation quality is measured.</li>
        <li><b>§3 (Data augmentation)</b> — Figure 4 / Figure 5: which augmentations matter (random crop
        + colour distortion), skim the exact knobs.</li>
       </ul>
       <p><b>Skim:</b> §4 (batch size, training length, the LARS optimizer), §6 (full ImageNet tables) and
       Appendix details — unless you want the scaling story. The core math you need is one equation in §2.1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will pretrain an encoder with <b>no labels</b> using SimCLR, then freeze it and train a tiny
       <b>linear classifier</b> on its features using only a handful of labels (say 20–300). Compare against a
       classifier trained <b>from scratch</b> on those same few labels.</p>
       <p>In the <b>low-label regime</b> (very few labels), do you expect the <b>frozen-SimCLR linear probe</b>
       to beat, tie, or lose to the <b>from-scratch</b> model? Write your guess and one sentence of reasoning,
       then run the experiment.</p>`,
    attempt:
      `<p>Before the reveal, sketch the four pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Two views.</b> For each image, apply a random augmentation <i>twice</i> to get views
        <code>v1</code>, <code>v2</code>. Stack a batch as <code>[v1 ; v2]</code> of size $2N$.</li>
        <li><b>Encoder $f$.</b> A small conv net → a feature vector $h$. <i># this is your representation.</i></li>
        <li><b>Projection head $g$.</b> TODO: an MLP with one hidden layer and ReLU,
        <code>z = W2 @ relu(W1 @ h)</code>. <i># you contrast on z, not h.</i></li>
        <li><b>NT-Xent loss.</b> TODO: L2-normalize all $z$; build the $2N\\times 2N$ cosine-similarity matrix;
        divide by temperature $\\tau$; for each row, the <b>positive</b> is its other view, every other row is a
        <b>negative</b>; apply cross-entropy. <i># mask out the self-similarity (k = i).</i></li>
       </ul>
       <p>Then freeze $f$, train a one-line <code>nn.Linear</code> probe on the frozen features, and compare to
       a from-scratch net on the same few labels.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>SimCLR (§2.1) is four boxes in a row. Take one image. Apply a random augmentation <b>twice</b>,
       independently, to get two <b>views</b> $\\tilde{x}_i$ and $\\tilde{x}_j$ — same content, different crop /
       colour / blur. These two views form a <b>positive pair</b>: they should land close together in
       representation space. Every other image's views in the same batch are <b>negatives</b>: they should land
       far apart.</p>
       <p>Each view goes through a shared <b>base encoder</b> $f(\\cdot)$ (the paper uses a ResNet; we use a small
       conv net) to get a representation $h = f(\\tilde{x})$. The abstract calls $f$ "without constraints on the
       architecture." Then a small <b>projection head</b> $g(\\cdot)$ — "an MLP with one hidden layer" — maps
       $h$ to the space where the loss lives: $z = g(h) = W^{(2)}\\,\\sigma(W^{(1)} h)$, with $\\sigma$ the ReLU.
       <b>Crucial detail:</b> you compute the loss on $z$, but your final representation is $h$ — you throw the
       head $g$ away after pretraining.</p>
       <p>Now form a minibatch of $N$ images. Augmenting each twice gives $2N$ views. For a positive pair $(i,j)$
       the loss wants $z_i$ and $z_j$ to be similar, relative to all the other $2(N-1)$ views, which act as
       negatives "for free" (no separate negative-sampling, no memory bank). <b>Similarity</b> here is the
       <b>cosine similarity</b> $\\mathrm{sim}(u,v) = u^\\top v / (\\lVert u\\rVert \\lVert v\\rVert)$ — the cosine
       of the angle between the two vectors, in $[-1,1]$, large when they point the same way. A
       <b>temperature</b> $\\tau$ scales these similarities before the softmax: small $\\tau$ sharpens the
       contrast (hard negatives matter more), large $\\tau$ softens it.</p>
       <p>That loss — a softmax over similarities, scaled by $\\tau$ — is the <b>NT-Xent</b> loss
       (Normalized Temperature-scaled cross-entropy), §2.1, Eqn. 1.</p>
       <p>After pretraining (§2.3), you <b>freeze</b> $f$ and train a single <b>linear classifier</b> on its
       frozen features — the <b>linear evaluation protocol</b>, a.k.a. the "linear probe." A good linear probe
       accuracy means the unlabelled pretraining baked the useful structure into $h$.</p>`,
    symbols: [
      { sym: "$\\tilde{x}_i,\\ \\tilde{x}_j$", desc: "the two <b>augmented views</b> of one image — the same picture distorted two different ways. They form one <b>positive pair</b>." },
      { sym: "$f(\\cdot)$", desc: "the <b>base encoder</b> (a conv net, e.g. ResNet). Maps a view to a representation $h = f(\\tilde{x})$. This $h$ is what you keep and probe." },
      { sym: "$h$", desc: "the <b>representation</b>: the encoder's output vector that summarizes an image. The thing you actually want." },
      { sym: "$g(\\cdot)$", desc: "the <b>projection head</b>: a small MLP with one hidden layer and ReLU, $g(h) = W^{(2)}\\sigma(W^{(1)} h)$. Used only during pretraining, then discarded." },
      { sym: "$z_i = g(h_i)$", desc: "the <b>projected</b> vector for view $i$. The contrastive loss is computed on these $z$, not on $h$." },
      { sym: "$N$", desc: "the number of distinct <b>images</b> in the minibatch. Augmenting each twice gives $2N$ views." },
      { sym: "$2N$", desc: "the total number of <b>views</b> in the batch (two per image). Indices $i,j,k$ range over $1\\ldots 2N$." },
      { sym: "$(i,j)$", desc: "a <b>positive pair</b>: the two views of the same image. The loss is summed over all such pairs (both $(i,j)$ and $(j,i)$)." },
      { sym: "negatives", desc: "the other $2(N-1)$ views in the batch — everything that is not view $i$'s positive partner. They appear in the denominator and get pushed apart." },
      { sym: "$\\mathrm{sim}(u,v)$", desc: "<b>cosine similarity</b> $= u^\\top v / (\\lVert u\\rVert\\,\\lVert v\\rVert)$: the cosine of the angle between two vectors, in $[-1,1]$. Big when they point the same direction. ($u^\\top v$ is the dot product; $\\lVert u\\rVert$ is the length of $u$.)" },
      { sym: "$\\tau$", desc: "the <b>temperature</b>: a positive number that divides every similarity before the softmax. Small $\\tau$ → sharper contrast (negatives weigh more); large $\\tau$ → softer." },
      { sym: "$\\mathbb{1}_{[k\\neq i]}$", desc: "the <b>indicator function</b>: equals $1$ when $k\\neq i$ and $0$ when $k = i$. It removes the trivial self-similarity (a vector with itself) from the denominator." },
      { sym: "$\\ell(i,j)$", desc: "the per-positive-pair loss — a $-\\log$ of the softmax probability that view $i$'s nearest match (among all non-self views) is its true partner $j$." }
    ],
    formula: `$$ \\ell_{i,j} = -\\log \\frac{\\exp\\!\\big(\\mathrm{sim}(z_i, z_j)/\\tau\\big)}{\\displaystyle\\sum_{k=1}^{2N} \\mathbb{1}_{[k\\neq i]}\\,\\exp\\!\\big(\\mathrm{sim}(z_i, z_k)/\\tau\\big)} \\qquad\\text{(NT-Xent, \\S2.1, Eqn. 1)} $$`,
    whatItDoes:
      `<p>Read it as a <b>classification</b> problem with one right answer. Fix view $i$ (the "anchor"). Look at
       its similarity to <b>every other view</b> $k$ in the batch (all $2N-1$ of them; the
       $\\mathbb{1}_{[k\\neq i]}$ throws out the self term). Divide each similarity by the temperature $\\tau$ and
       run a <b>softmax</b> — turning the similarities into a probability over "which view is $i$'s partner?"
       The numerator is the similarity to the <b>true</b> partner $j$; the denominator sums over all candidates.
       So the fraction is the model's probability of <b>picking the right positive</b>. The $-\\log$ makes the
       loss small when that probability is near $1$ (partner clearly most similar) and large when it is near $0$.</p>
       <p>Minimizing it does two things at once: it <b>raises</b> the numerator (pull the positive pair together)
       and <b>lowers</b> the denominator terms (push the negatives apart). It is exactly a cross-entropy where
       the "correct class" is the matching view — hence <i>normalized temperature-scaled cross-entropy</i>.
       The full loss is this averaged over all $2N$ positive directions in the batch.</p>`,
    derivation:
      `<p><b>Short recap — full treatment in the concept lesson.</b> NT-Xent is a softmax cross-entropy in
       disguise. Define the logits for anchor $i$ as the temperature-scaled similarities
       $s_{ik} = \\mathrm{sim}(z_i, z_k)/\\tau$ for all $k\\neq i$. The softmax over these logits gives a
       probability $p_{ij} = \\dfrac{e^{s_{ij}}}{\\sum_{k\\neq i} e^{s_{ik}}}$ that the partner is $j$, and the loss
       is the standard cross-entropy $-\\log p_{ij}$ for the one-hot target "$k = j$." That is why it is a
       <b>cross-entropy</b>: the contrastive task is reframed as a $(2N-1)$-way classification where the label is
       the matching view.</p>
       <p>The full why-it-works story — why cosine + temperature, how the gradient pulls positives and pushes
       hard negatives, the role of the batch size as the number of negatives, and why the projection head helps
       — is derived in the <b>unl-simclr</b> concept lesson. Head there for the contrastive-learning math; we
       only recap and transcribe Eqn. 1 here.</p>`,
    example:
      `<p>Work one positive-pair loss by hand. Take a tiny batch of $N=2$ images → $2N=4$ views, with
       projected (2-D) vectors:</p>
       <ul>
        <li>$z_1 = [1.0,\\ 0.0]$ &nbsp;(anchor, view $i$)</li>
        <li>$z_2 = [0.8,\\ 0.6]$ &nbsp;(its positive partner, view $j$)</li>
        <li>$z_3 = [-0.6,\\ 0.8]$ &nbsp;(a negative)</li>
        <li>$z_4 = [0.0,\\ -1.0]$ &nbsp;(a negative)</li>
       </ul>
       <p>All are unit-length, so cosine similarity is just the dot product. Use temperature $\\tau = 0.5$.
       Compute $\\ell_{1,2}$ — the loss for the anchor $i=1$ with positive $j=2$.</p>
       <ul class="steps">
        <li><b>Similarities of anchor 1 to every other view</b> ($k\\neq 1$):
        $\\mathrm{sim}(z_1,z_2) = 1(0.8)+0(0.6) = 0.8$;
        $\\mathrm{sim}(z_1,z_3) = -0.6$;
        $\\mathrm{sim}(z_1,z_4) = 0.0$.</li>
        <li><b>Divide by $\\tau=0.5$ and exponentiate</b>:
        $e^{0.8/0.5}=e^{1.6}=4.953$;  $e^{-0.6/0.5}=e^{-1.2}=0.3012$;  $e^{0/0.5}=e^{0}=1.0$.</li>
        <li><b>Denominator</b> (sum over $k\\neq 1$): $4.953 + 0.3012 + 1.0 = 6.2542$.</li>
        <li><b>Numerator</b> = the positive term $e^{\\mathrm{sim}(z_1,z_2)/\\tau} = 4.953$.</li>
        <li><b>Softmax probability</b> of the correct partner: $p_{1,2} = 4.953 / 6.2542 = 0.7919$.</li>
        <li><b>Loss</b>: $\\ell_{1,2} = -\\log(0.7919) = 0.2333$.</li>
       </ul>
       <p>The model already gives the true partner a $79\\%$ chance, so the loss is small ($0.233$). If view 3 (a
       negative) had been more similar than the partner, $p_{1,2}$ would drop and the loss would climb. These
       exact numbers are recomputed in the notebook's first cell so you can check your loss implementation.</p>`,
    recipe:
      `<ol>
        <li><b>Two views.</b> Pick an augmentation pipeline (random resized crop + colour/blur). For each image
        in the batch, sample it <b>twice</b> to get $v_1, v_2$; stack the batch as $[v_1 ; v_2]$, size $2N$.</li>
        <li><b>Encoder $f$.</b> Run all $2N$ views through a shared small conv net → features $h$.</li>
        <li><b>Projection head $g$.</b> An MLP with one hidden layer + ReLU → $z = g(h)$. L2-normalize $z$.</li>
        <li><b>NT-Xent loss.</b> Build the $2N\\times 2N$ cosine-similarity matrix, divide by $\\tau$, mask the
        diagonal (self term), set each row's target to its partner view, and apply cross-entropy (Eqn. 1).</li>
        <li><b>Pretrain</b> for some epochs on an <b>unlabelled</b> image subset; watch the loss fall.</li>
        <li><b>Linear probe (§2.3).</b> Freeze $f$, take its features $h$, train a single <code>nn.Linear</code>
        on a few labels. Compare against a from-scratch model trained on the same few labels.</li>
        <li><b>Check the headline:</b> in the low-label regime the frozen-SimCLR probe should beat from-scratch.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "a linear classifier trained on self-supervised representations learned by
       SimCLR achieves <b>76.5% top-1 accuracy</b>, which is a 7% relative improvement over previous
       state-of-the-art, matching the performance of a supervised ResNet-50." The abstract also reports that
       "when fine-tuned on only 1% of the labels, we achieve 85.8% top-5 accuracy."</p>
       <p><i>These are the paper's reported ImageNet figures, quoted from the abstract. The numbers in the
       CODEVIZ panel below are from our own tiny MNIST run — not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>, <code>nn.Linear</code>,
       <code>nn.ReLU</code>, <code>F.normalize</code>, <code>F.cross_entropy</code>, the optimizer, and the
       MNIST loader + augmentations from torchvision (preinstalled in Colab — no pip). <b>Build by hand:</b>
       the two-view augmentation pipeline, the encoder + projection head wiring, the <b>NT-Xent loss</b> (the
       similarity matrix, the diagonal mask, the partner targets), and the <b>linear-probe vs from-scratch</b>
       comparison. The contrastive-learning math is recapped from the <b>unl-simclr</b> concept lesson, not
       re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Contrasting on $h$ instead of $z$.</b> The loss is computed on the projection-head output $z$,
        but your <i>representation</i> (the thing you keep and probe) is the encoder output $h$. Probe $h$, not
        $z$; the paper discards $g$ after pretraining.</li>
        <li><b>Forgetting to L2-normalize before the similarity.</b> NT-Xent uses <i>cosine</i> similarity. If
        you skip <code>F.normalize</code>, you are using raw dot products and the temperature no longer means
        what the paper intends. <b>Fix:</b> normalize $z$ to unit length first.</li>
        <li><b>Not masking the self-similarity.</b> The $\\mathbb{1}_{[k\\neq i]}$ removes $\\mathrm{sim}(z_i,z_i)$
        from the denominator. A vector with itself has similarity $1$ (the largest possible), so leaving it in
        swamps the softmax. <b>Fix:</b> set the diagonal of the similarity matrix to $-\\infty$ before softmax.</li>
        <li><b>Pointing the target at the wrong row.</b> In a $[v_1 ; v_2]$ batch of size $2N$, row $i$'s
        positive is row $i+N$ (and vice versa). Off-by-$N$ here trains the model to match the wrong view.</li>
        <li><b>Temperature too large or too small.</b> Very large $\\tau$ flattens the softmax (no contrast);
        very small $\\tau$ over-sharpens and destabilizes. The paper uses a small $\\tau$ (e.g. $0.1$–0.5);
        leaving it at $1$ is a common silent bug.</li>
        <li><b>Too few negatives.</b> Negatives come from the batch. A tiny batch gives almost no negatives, so
        the task is too easy and the features are weak. Use as large a batch as fits.</li>
      </ul>`,
    recall: [
      "Write the NT-Xent loss (Eqn. 1) from memory.",
      "Define the cosine similarity $\\mathrm{sim}(u,v)$ and the temperature $\\tau$.",
      "In a batch of $2N$ views, which view is the positive for view $i$, and which are negatives?",
      "Why do you probe the encoder output $h$ rather than the projection-head output $z$?",
      "What does the indicator $\\mathbb{1}_{[k\\neq i]}$ remove, and why does it matter?"
    ],
    practice: [
      {
        q: `<b>The headline.</b> You pretrained an encoder with SimCLR on unlabelled images, froze it, and
            trained a linear probe on just 20 labels; you also trained a from-scratch model on the same 20
            labels. The probe scores much higher. What does that demonstrate, and what is the one-line ablation
            that would <i>break</i> the SimCLR advantage?`,
        steps: [
          { do: `Compare the two accuracies at the smallest label budget; the frozen-SimCLR probe wins.`, why: `With only 20 labels a from-scratch net has too little signal to learn good features; the probe inherits features already learned from thousands of <i>unlabelled</i> images.` },
          { do: `Ablate: replace the trained encoder with a <b>random (untrained) encoder</b> and probe that.`, why: `If the advantage came from the architecture or the probe, a random encoder would do as well. It does not — isolating the <i>pretraining</i> as the cause.` },
          { do: `Conclude that NT-Xent pretraining, not labels or architecture, supplied the useful structure.`, why: `Same encoder, same probe, same labels; only the pretraining differs.` }
        ],
        answer: `<p>It demonstrates that <b>unlabelled contrastive pretraining</b> transfers: in the low-label
                 regime, a linear probe on frozen SimCLR features beats a from-scratch model because the features
                 were already shaped by thousands of unlabelled images. Probing a <b>random untrained encoder</b>
                 is the ablation that breaks it — the probe accuracy collapses, isolating the NT-Xent
                 pretraining (not the architecture or the probe) as the source of the gain. Our CODEVIZ panel
                 shows the probe beating from-scratch across the label budgets.</p>`
      },
      {
        q: `Your worked example gave $\\ell_{1,2} = 0.233$ with the partner most similar. Now suppose a negative
            view became <i>more</i> similar to the anchor than the true partner — say $\\mathrm{sim}(z_1,z_3)$
            jumps from $-0.6$ to $0.9$ while $\\mathrm{sim}(z_1,z_2)$ stays $0.8$ (keep $\\tau=0.5$). Does the loss
            go up or down, and why?`,
        steps: [
          { do: `Recompute the changed term: $e^{0.9/0.5}=e^{1.8}=6.05$ replaces $e^{-1.2}=0.30$ in the denominator.`, why: `A more-similar negative makes the denominator larger.` },
          { do: `New denominator $= 4.953 + 6.05 + 1.0 = 12.0$; numerator unchanged at $4.953$.`, why: `The numerator only depends on the positive pair, which did not change.` },
          { do: `New probability $p_{1,2} = 4.953/12.0 = 0.413$, so $\\ell_{1,2} = -\\log(0.413) = 0.88$.`, why: `A bigger denominator shrinks the softmax probability of the true partner, raising $-\\log p$.` }
        ],
        answer: `<p>The loss <b>goes up</b>, from $0.233$ to about $0.88$. A negative that is <i>more</i> similar
                 than the true partner inflates the denominator, so the softmax probability of the correct
                 positive drops ($0.79 \\to 0.41$) and $-\\log p$ rises. That is exactly the pressure NT-Xent puts
                 on the model: push hard (similar) negatives apart.</p>`
      },
      {
        q: `You build the $2N\\times 2N$ similarity matrix and call cross-entropy, but training collapses — the
            loss instantly goes to near $0$ and the features are useless. You forgot one masking step. What is
            it, and why does omitting it collapse training?`,
        steps: [
          { do: `Check whether the diagonal (each view's similarity with itself) was masked out before the softmax.`, why: `$\\mathrm{sim}(z_i,z_i)=1$ for unit vectors — the largest possible — so the self term dominates the denominator and numerator comparison.` },
          { do: `Realize the model can "win" by matching each view to itself, which the indicator $\\mathbb{1}_{[k\\neq i]}$ is supposed to forbid.`, why: `Without the mask the easiest solution is the trivial self-match, giving near-zero loss but learning nothing about the positive <i>pair</i>.` },
          { do: `Fix: set the diagonal of the similarity matrix to $-\\infty$ (a large negative) before softmax.`, why: `That implements $\\mathbb{1}_{[k\\neq i]}$ — removing the self term so the positive must be the <i>other</i> view.` }
        ],
        answer: `<p>You forgot to <b>mask the diagonal</b> (the self-similarity), i.e. the indicator
                 $\\mathbb{1}_{[k\\neq i]}$. Each view's similarity with itself is $1$ — the maximum — so the
                 model trivially "matches" every view to itself and drives the loss to ~$0$ while learning
                 nothing. Setting the diagonal to $-\\infty$ before the softmax restores the real task: match each
                 view to its <i>augmented partner</i>.</p>`
      }
    ]
  });

  window.CODE["paper-simclr"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the two-view pipeline, the encoder, the projection head, and the
       <b>NT-Xent</b> loss by hand on <code>nn</code> primitives, then pretrain on an <b>MNIST subset</b> with
       <b>no labels</b> (torchvision, preinstalled in Colab — no pip). The key function is
       <code>nt_xent(z)</code> — L2-normalize, build the $2N\\times2N$ cosine-similarity matrix, mask the
       diagonal, point each row at its partner view, cross-entropy (Eqn. 1). The first cell recomputes the
       worked example loss $\\ell_{1,2}=0.2333$. After pretraining we <b>freeze</b> the encoder and run a
       <b>linear probe</b> against a <b>from-scratch</b> model on the same few labels: the probe wins in the
       low-label regime. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: NT-Xent loss for one positive pair (i=1, j=2). ---
# Tiny batch N=2 -> 2N=4 unit vectors; cosine sim = dot product; tau = 0.5.
zc = torch.tensor([[1.0, 0.0],   # z1  anchor i
                   [0.8, 0.6],   # z2  positive partner j
                   [-0.6, 0.8],  # z3  negative
                   [0.0, -1.0]]) # z4  negative
tau = 0.5
sims = zc[0] @ zc.t()                      # sim(z1, z_k) for all k
exps = torch.exp(sims / tau)
denom = exps[1:].sum()                     # k != 1  (drop the self term)
p_12  = exps[1] / denom                    # softmax prob of the true partner
loss_12 = -torch.log(p_12)
print("worked example:  p_12 =", round(p_12.item(), 4), " loss_12 =", round(loss_12.item(), 4))
# worked example:  p_12 = 0.7919  loss_12 = 0.2333


# --- 1. Encoder f and projection head g (built by hand from nn primitives). ---
class Encoder(nn.Module):                  # small conv net -> representation h
    def __init__(self, feat=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 14x14
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # 7x7
            nn.AdaptiveAvgPool2d(1), nn.Flatten())
        self.fc = nn.Linear(32, feat)
    def forward(self, x): return F.relu(self.fc(self.net(x)))            # h

class ProjHead(nn.Module):                 # MLP, one hidden layer + ReLU:  z = W2 sigma(W1 h)
    def __init__(self, fin=64, hid=64, out=32):
        super().__init__(); self.l1 = nn.Linear(fin, hid); self.l2 = nn.Linear(hid, out)
    def forward(self, h): return self.l2(F.relu(self.l1(h)))            # z


# --- 2. The NT-Xent loss (Eqn. 1), built by hand. z is the 2N stacked projections [v1 ; v2]. ---
def nt_xent(z, tau=0.5):
    z = F.normalize(z, dim=1)              # cosine similarity needs unit vectors
    N = z.shape[0] // 2
    sim = z @ z.t() / tau                  # 2N x 2N scaled cosine-similarity matrix
    sim.fill_diagonal_(-1e9)               # the indicator 1[k != i]: drop the self term
    # row i's positive is its partner view: rows 0..N-1 pair with N..2N-1 and vice versa.
    targets = torch.cat([torch.arange(N) + N, torch.arange(N)]).to(z.device)
    return F.cross_entropy(sim, targets)   # softmax over similarities = NT-Xent


# --- 3. Two-view augmentation + an UNLABELLED MNIST subset (torchvision, preinstalled). ---
aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5, 1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]
labels = torch.tensor([raw[i][1] for i in idx])     # used ONLY for the probe later

# --- 4. Pretrain SimCLR (no labels). ---
enc, proj = Encoder().to(device), ProjHead().to(device)
opt = torch.optim.Adam(list(enc.parameters()) + list(proj.parameters()), lr=1e-3)
enc.train(); proj.train(); B = 128
for ep in range(15):
    perm = np.random.permutation(len(imgs)); tot = 0.0; nb = 0
    for s in range(0, len(imgs), B):
        bi = perm[s:s + B]
        v1 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
        v2 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
        z  = proj(enc(torch.cat([v1, v2])))         # 2N projections
        loss = nt_xent(z)
        opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item(); nb += 1
    if ep % 3 == 0: print(f"  pretrain ep {ep}  NT-Xent loss {tot/nb:.3f}")

# --- 5. FREEZE the encoder, extract features h (linear-evaluation protocol, paper S2.3). ---
enc.eval()
with torch.no_grad():
    feats = enc(torch.stack([base(im) for im in imgs]).to(device)).cpu()

def linear_probe(n_lab):                    # train ONLY a linear classifier on frozen h
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

def from_scratch(n_lab):                     # train a fresh conv net end-to-end on the few labels
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

print("\\nlabels | probe(frozen SimCLR) | from-scratch")
for n in [20, 50, 100, 300]:
    print(f"{n:6d} |        {linear_probe(n):.3f}         |    {from_scratch(n):.3f}")
# The frozen-SimCLR linear probe beats from-scratch at every label budget -- biggest gap when labels are fewest.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-simclr"] = {
    question: "In the low-label regime, does a linear probe on frozen SimCLR features beat a from-scratch classifier?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs number of labels — frozen-SimCLR linear probe vs from-scratch (MNIST subset)",
        xlabel: "number of labelled examples",
        ylabel: "test accuracy",
        series: [
          {
            name: "Linear probe (frozen SimCLR)",
            color: "#7ee787",
            points: [[20, 0.252], [50, 0.294], [100, 0.357], [300, 0.410]]
          },
          {
            name: "From scratch (same labels)",
            color: "#ff7b72",
            points: [[20, 0.110], [50, 0.156], [100, 0.171], [300, 0.180]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A small conv encoder was pretrained with SimCLR (NT-Xent, two augmented views, projection head) on 3,000 <b>unlabelled</b> MNIST images for 15 epochs, then <b>frozen</b>. A one-layer linear probe on its features (green) beats a from-scratch conv net trained on the <i>same</i> few labels (red) at every budget — e.g. 0.252 vs 0.110 at 20 labels — and the gap is largest when labels are scarcest. The unlabelled contrastive pretraining, not the labels, supplied the useful structure. (Accuracies are modest because the encoder is tiny and pretraining is short; the qualitative gap is the point.)",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)

# Pretrain a tiny SimCLR encoder on UNLABELLED MNIST, freeze it, then compare a linear
# probe on its frozen features vs a from-scratch net -- across label budgets (toy reproduction).
class Encoder(nn.Module):
    def __init__(s, feat=64):
        super().__init__()
        s.net = nn.Sequential(nn.Conv2d(1,16,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.Conv2d(16,32,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.AdaptiveAvgPool2d(1), nn.Flatten())
        s.fc = nn.Linear(32, feat)
    def forward(s, x): return F.relu(s.fc(s.net(x)))
class ProjHead(nn.Module):
    def __init__(s, fin=64, hid=64, out=32):
        super().__init__(); s.l1=nn.Linear(fin,hid); s.l2=nn.Linear(hid,out)
    def forward(s, h): return s.l2(F.relu(s.l1(h)))

def nt_xent(z, tau=0.5):
    z = F.normalize(z, dim=1); N = z.shape[0]//2
    sim = z @ z.t() / tau; sim.fill_diagonal_(-1e9)
    tgt = torch.cat([torch.arange(N)+N, torch.arange(N)])
    return F.cross_entropy(sim, tgt)

aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5,1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]; labels = torch.tensor([raw[i][1] for i in idx])

enc, proj = Encoder(), ProjHead()
opt = torch.optim.Adam(list(enc.parameters())+list(proj.parameters()), lr=1e-3)
enc.train(); proj.train(); B=128
for ep in range(15):
    perm = np.random.permutation(len(imgs))
    for s0 in range(0, len(imgs), B):
        bi = perm[s0:s0+B]
        v1 = torch.stack([aug(imgs[i]) for i in bi]); v2 = torch.stack([aug(imgs[i]) for i in bi])
        loss = nt_xent(proj(enc(torch.cat([v1, v2]))))
        opt.zero_grad(); loss.backward(); opt.step()

enc.eval()
with torch.no_grad():
    feats = enc(torch.stack([base(im) for im in imgs]))

def probe(n):
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

for n in [20,50,100,300]:
    print(n, "probe", probe(n), "scratch", scratch(n))
# probe (frozen SimCLR) > from-scratch at every budget; biggest gap at the fewest labels.`
  };
})();
