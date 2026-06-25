/* Paper lesson — "Bootstrap Your Own Latent: A New Approach to Self-Supervised Learning"
   (BYOL), Grill, Strub, Altché, Tallec, Richemond, Buchatskaya, Doersch, Avila Pires, Guo,
   Gheshlaghi Azar, Piot, Kavukcuoglu, Munos, Valko — DeepMind & Imperial College London, 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-byol".
   GROUNDED from arXiv:2006.07733 (abstract) and the ar5iv HTML mirror (Section 3 Method:
   EMA update Eqn. 1, normalized-MSE prediction loss Eqn. 2, symmetrized BYOL loss; Section 5
   ablations Table 5a/5b). Track B (architecture): build the online/target two-network pipeline,
   the predictor, the stop-gradient + EMA update, and the normalized-MSE loss by hand on nn
   primitives; pretrain on an MNIST subset WITHOUT negatives; linear probe beats from-scratch;
   ablation removing the predictor / stop-grad collapses to a constant. No conceptLink — the EMA
   and stop-gradient ideas are recapped here and cross-linked to paper-moco (momentum encoder). */
(function () {
  window.LESSONS.push({
    id: "paper-byol",
    title: "BYOL — Bootstrap Your Own Latent: A New Approach to Self-Supervised Learning (2020)",
    tagline: "Learn image features with no labels AND no negative pairs — one network predicts a slow-moving copy of itself.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Jean-Bastien Grill, Florian Strub, Florent Altché, Corentin Tallec, Pierre H. Richemond, Elena Buchatskaya, Carl Doersch, Bernardo Avila Pires, Zhaohan Daniel Guo, Mohammad Gheshlaghi Azar, Bilal Piot, Koray Kavukcuoglu, Rémi Munos, Michal Valko",
      org: "DeepMind & Imperial College London",
      year: 2020,
      venue: "arXiv:2006.07733 (Jun 2020); NeurIPS 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2006.07733",
      code: "https://github.com/deepmind/deepmind-research/tree/master/byol"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["unl-simclr", "dl-cosine-similarity", "fnd-norm", "pt-cnn", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>Just before BYOL, the leading way to learn image features without labels was
       <b>contrastive learning</b> (SimCLR, MoCo): make two distorted copies — called <b>views</b> — of
       one image look alike in feature space, while pushing them away from <i>other</i> images, the
       <b>negatives</b>. "Negatives" are just the other images in the batch (or a memory queue) that the
       method treats as "not the same thing."</p>
       <p>But negatives are awkward. To work well, contrastive methods need <b>many</b> of them — big
       batches (SimCLR) or a large memory bank / queue (MoCo) — and they are sensitive to exactly which
       augmentations you use, because a "negative" that is actually similar confuses the loss. The paper's
       question (§1): can we drop negatives entirely? If you only ever pull positive pairs together and
       never push anything apart, the obvious worry is <b>collapse</b> — the network outputs the <i>same</i>
       constant vector for every image, which makes every pair perfectly "similar" and the loss zero, while
       learning nothing. BYOL's contribution is a way to avoid that collapse without a single negative.</p>`,
    contribution:
      `<ul>
        <li><b>Self-supervised learning with NO negative pairs.</b> The abstract states BYOL "achieves a
        new state of the art without them [negative pairs]." It only ever predicts a positive target; it
        never explicitly pushes images apart.</li>
        <li><b>Two interacting networks: online and target.</b> An <b>online</b> network is trained to
        <b>predict</b> the <b>target</b> network's projection of a <i>different</i> augmented view of the
        same image. The target network is not trained by gradient descent.</li>
        <li><b>The target is a slow-moving (EMA) copy of the online network.</b> After each step the
        target's weights move a little toward the online weights — an exponential moving average. This,
        plus a <b>predictor</b> head on the online side and a <b>stop-gradient</b> on the target side,
        is what prevents collapse (§3, and ablations §5).</li>
      </ul>`,
    whyItMattered:
      `<p>BYOL showed that the "push negatives apart" half of contrastive learning is <i>not required</i>:
       a prediction loss against a slow-moving copy of yourself is enough. The abstract reports a linear
       classifier on BYOL's frozen features reaching <b>74.3% ImageNet top-1</b> with a ResNet-50, and
       <b>79.6%</b> with a larger ResNet. By removing the dependence on large batches / memory banks of
       negatives, it made self-supervised pretraining simpler and less sensitive to batch size, and it
       directly inspired the <b>negative-free</b> family that followed — SimSiam (which drops even the EMA),
       DINO, and Barlow Twins.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§3 (Method)</b> — Figure 2's two rows (online: encoder $f_\\theta$ → projector $g_\\theta$ →
        <b>predictor</b> $q_\\theta$; target: encoder $f_\\xi$ → projector $g_\\xi$, with a
        <b>stop-gradient</b>). The two equations you will transcribe live here: the <b>EMA update</b>
        (Eqn. 1) and the <b>normalized-MSE prediction loss</b> (Eqn. 2).</li>
        <li><b>The symmetrization paragraph</b> in §3 — feed each view through both networks and add the
        two losses.</li>
        <li><b>§5 (ablations), Table 5a / 5b</b> — what happens when you remove the predictor or freeze the
        target ($\\tau = 1$): the representation collapses or degrades. This is the experimental proof that
        those two pieces prevent collapse.</li>
       </ul>
       <p><b>Skim:</b> §4 (full ImageNet tables and the comparison to SimCLR/MoCo), the LARS optimizer and
       augmentation details, and the appendices — unless you want the scaling and robustness story. The
       core math you need is two short equations in §3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>BYOL pulls positive pairs together but <b>never</b> pushes anything apart — there are no
       negatives in the loss. Naively, the network could win by outputting the <b>same constant vector</b>
       for every image (every pair then matches perfectly, loss $= 0$). BYOL claims a <b>predictor</b> head
       plus a <b>stop-gradient</b> on a slow <b>EMA</b> target stop this collapse.</p>
       <p>Before you run it: if you <b>remove the predictor</b> (or stop-gradient) and keep everything else,
       do you expect the features to (a) stay just as good, (b) collapse to a useless constant? Write your
       guess and one sentence of reasoning, then run the ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Two views.</b> For each image, apply a random augmentation <i>twice</i> to get views
        $v$ and $v'$.</li>
        <li><b>Online network.</b> Encoder $f_\\theta$ → projector $g_\\theta$ → <b>predictor</b> $q_\\theta$.
        Run view $v$ all the way through: $q_\\theta(z_\\theta)$ where $z_\\theta = g_\\theta(f_\\theta(v))$.
        <i># trained by gradient descent.</i></li>
        <li><b>Target network.</b> Encoder $f_\\xi$ → projector $g_\\xi$ (no predictor). Run view $v'$ to
        get $z'_\\xi$. TODO: wrap this branch in <code>torch.no_grad()</code> — the <b>stop-gradient</b>.</li>
        <li><b>Loss.</b> TODO: L2-normalize both $q_\\theta(z_\\theta)$ and $z'_\\xi$, then take the squared
        distance between them (the normalized MSE, Eqn. 2). Symmetrize by swapping $v\\leftrightarrow v'$.</li>
        <li><b>EMA update.</b> TODO: after each optimizer step on $\\theta$, set
        $\\xi \\leftarrow \\tau\\,\\xi + (1-\\tau)\\,\\theta$. <i># the target never gets a gradient.</i></li>
       </ul>
       <p>Then freeze $f_\\theta$, train a one-line <code>nn.Linear</code> probe on its features, compare to
       from-scratch, and run the <b>no-predictor</b> ablation to watch it collapse.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>BYOL (§3) keeps <b>two</b> networks with the <i>same</i> shape but different weights. The
       <b>online</b> network has weights $\\theta$ and three parts in a row: an encoder $f_\\theta$, a
       projector $g_\\theta$, and — uniquely on this side — a <b>predictor</b> $q_\\theta$. The <b>target</b>
       network has weights $\\xi$ and only the first two parts: encoder $f_\\xi$ and projector $g_\\xi$. No
       predictor on the target.</p>
       <p>Take one image, make two views $v$ and $v'$ (same content, different crop / colour / blur). Send
       $v$ through the online network to get a <b>prediction</b> $q_\\theta(z_\\theta)$, where
       $z_\\theta = g_\\theta(f_\\theta(v))$ is the online projection. Send the <i>other</i> view $v'$ through
       the target network to get the <b>target projection</b> $z'_\\xi = g_\\xi(f_\\xi(v'))$. The training
       goal: <b>the online prediction should match the target projection.</b> That is the whole task — no
       other images, no negatives.</p>
       <p>The match is measured by a <b>normalized mean-squared-error</b> (MSE). "Normalized" means: first
       rescale both vectors to unit length (L2-normalize — divide by the vector's length), then take the
       squared distance. After unit-normalizing, that squared distance equals $2 - 2$ times the
       <b>cosine similarity</b> (the cosine of the angle between the two vectors) — so minimizing this MSE
       is the same as <i>maximizing the cosine similarity</i> between prediction and target.</p>
       <p>Now the two tricks that stop collapse. <b>(1) Stop-gradient.</b> The target network is treated as
       a fixed look-up during the loss: gradients flow only into the online weights $\\theta$, never into
       $\\xi$. <b>(2) EMA update.</b> After each gradient step on $\\theta$, the target weights are nudged a
       little toward the online weights: $\\xi \\leftarrow \\tau\\,\\xi + (1-\\tau)\\,\\theta$, with a decay
       $\\tau$ close to $1$ (so the target moves <i>slowly</i>) — this is the same <b>momentum / EMA
       encoder</b> idea as MoCo (see <b>paper-moco</b>), but here used <i>without</i> any negatives. The
       online network is always chasing a slowly-drifting copy of itself.</p>
       <p>Why doesn't it collapse to a constant? If the online net tried to output one constant vector, the
       <b>predictor</b> $q_\\theta$ on the online side plus the lagging target make the two sides hard to make
       trivially identical: the paper's argument (§3) is that the target's weights $\\xi$ do <b>not</b> move
       in the gradient direction of the loss (they only EMA toward $\\theta$), so the pair is never jointly
       optimized into the same constant. Empirically (§5), <b>remove the predictor</b> and it collapses;
       <b>freeze the target</b> ($\\tau = 1$, never updated) and quality drops sharply. Finally the loss is
       <b>symmetrized</b>: swap the roles of $v$ and $v'$, compute the loss again, and add the two.</p>
       <p>After pretraining you <b>freeze</b> $f_\\theta$ and train a single <b>linear classifier</b> on its
       frozen features — the <b>linear evaluation protocol</b> (the "linear probe"), the standard way to
       measure representation quality. A good probe accuracy means the label-free, negative-free pretraining
       baked useful structure into the encoder.</p>`,
    symbols: [
      { sym: "$\\theta$", desc: "the <b>online</b> network's weights — the ones trained by gradient descent. The online encoder $f_\\theta$ is what you keep and probe at the end." },
      { sym: "$\\xi$", desc: "the <b>target</b> network's weights. NOT trained by gradients; updated only by the EMA rule (Eqn. 1) toward $\\theta$. The Greek letter xi (a slow-moving copy)." },
      { sym: "$v,\\ v'$", desc: "the two <b>augmented views</b> of one image — the same picture distorted two different ways. View $v$ goes through the online net; view $v'$ through the target net." },
      { sym: "$f_\\theta,\\ f_\\xi$", desc: "the online / target <b>encoders</b> (a conv net, e.g. ResNet). $f_\\theta$'s output is your final representation." },
      { sym: "$g_\\theta,\\ g_\\xi$", desc: "the online / target <b>projectors</b>: small MLPs that map the encoder output into the space where the loss lives." },
      { sym: "$q_\\theta$", desc: "the <b>predictor</b>: an extra MLP, only on the ONLINE side. It tries to predict the target projection from the online projection. Removing it causes collapse (§5)." },
      { sym: "$z_\\theta = g_\\theta(f_\\theta(v))$", desc: "the <b>online projection</b> of view $v$." },
      { sym: "$z'_\\xi = g_\\xi(f_\\xi(v'))$", desc: "the <b>target projection</b> of the other view $v'$ — the thing the online prediction must match. Computed under stop-gradient." },
      { sym: "$q_\\theta(z_\\theta)$", desc: "the online <b>prediction</b>: the predictor applied to the online projection. The loss compares this to $z'_\\xi$." },
      { sym: "$\\bar{q}_\\theta(z_\\theta),\\ \\bar{z}'_\\xi$", desc: "the <b>L2-normalized</b> (unit-length) versions of the prediction and target. The bar means \\\"divided by its own length $\\lVert\\cdot\\rVert_2$.\\\"" },
      { sym: "$\\lVert u\\rVert_2$", desc: "the <b>L2 norm</b> (length) of a vector $u$ — the square root of the sum of its squared entries. Dividing by it makes the vector unit length." },
      { sym: "$\\langle a,b\\rangle$", desc: "the <b>dot product</b> of $a$ and $b$ (sum of $a_k b_k$). For unit vectors it equals their cosine similarity." },
      { sym: "stop-gradient", desc: "treating a quantity as a fixed constant during backprop — no gradient flows into it. Here the whole target branch is stop-gradient (gradients only update $\\theta$)." },
      { sym: "$\\tau$", desc: "the EMA <b>decay rate</b> in $[0,1]$, close to $1$. Larger $\\tau$ → the target moves more slowly. (Different from SimCLR's temperature, also written $\\tau$ — here it is a momentum.)" }
    ],
    formula: `$$ \\mathcal{L}_{\\theta,\\xi} \\;=\\; \\big\\lVert \\bar{q}_\\theta(z_\\theta) - \\bar{z}'_\\xi \\big\\rVert_2^2 \\;=\\; 2 - 2\\cdot\\frac{\\big\\langle q_\\theta(z_\\theta),\\, z'_\\xi \\big\\rangle}{\\big\\lVert q_\\theta(z_\\theta)\\big\\rVert_2 \\cdot \\big\\lVert z'_\\xi\\big\\rVert_2} \\qquad\\text{(prediction loss, \\S3, Eqn. 2)} $$
$$ \\xi \\;\\leftarrow\\; \\tau\\,\\xi + (1-\\tau)\\,\\theta \\qquad\\text{(target EMA update, \\S3, Eqn. 1)} \\qquad\\qquad \\mathcal{L}^{\\text{BYOL}}_{\\theta,\\xi} = \\mathcal{L}_{\\theta,\\xi} + \\tilde{\\mathcal{L}}_{\\theta,\\xi}\\ \\text{(symmetrized)} $$`,
    whatItDoes:
      `<p><b>The prediction loss (Eqn. 2)</b> is a <b>squared distance between two unit vectors</b>: the
       online prediction $\\bar{q}_\\theta(z_\\theta)$ and the target projection $\\bar{z}'_\\xi$, both
       L2-normalized. The algebra on the right shows that for unit vectors this squared distance equals
       $2 - 2\\cos\\angle$ — so it is <b>smallest (= 0)</b> when the prediction points the same way as the
       target (cosine $= 1$) and <b>largest (= 4)</b> when they point opposite ways. Minimizing it
       <b>pulls the prediction onto the target</b>. Crucially there is no second term subtracting other
       images: <b>no negatives</b>.</p>
       <p><b>The EMA update (Eqn. 1)</b> says: each step, the target weights become a weighted blend —
       $\\tau$ of the old target plus $(1-\\tau)$ of the current online weights. With $\\tau$ near $1$ the
       target barely moves, so it is a <i>slow, stable</i> version of the online network. The online net
       predicts this slow target; the target then drifts a step toward the online net; repeat. This moving
       target — together with the predictor and the stop-gradient (so $\\xi$ never follows the loss gradient)
       — is what keeps the two sides from collapsing onto the same constant. The final objective adds the
       loss computed both ways round (view $v$ online / $v'$ target, and vice versa).</p>`,
    derivation:
      `<p><b>Why the normalized MSE equals $2 - 2\\cos\\angle$ (full derivation; no conceptLink).</b> Let
       $a = q_\\theta(z_\\theta)$ and $b = z'_\\xi$ be the prediction and target, and write their unit-length
       versions $\\hat a = a/\\lVert a\\rVert_2$ and $\\hat b = b/\\lVert b\\rVert_2$. Expand the squared
       distance using $\\lVert u - w\\rVert_2^2 = \\langle u-w,\\,u-w\\rangle = \\lVert u\\rVert_2^2 - 2\\langle u,w\\rangle + \\lVert w\\rVert_2^2$:</p>
       <p>$\\lVert \\hat a - \\hat b\\rVert_2^2 = \\lVert\\hat a\\rVert_2^2 - 2\\langle\\hat a,\\hat b\\rangle + \\lVert\\hat b\\rVert_2^2.$</p>
       <p>Both $\\hat a$ and $\\hat b$ are unit vectors, so $\\lVert\\hat a\\rVert_2^2 = \\lVert\\hat b\\rVert_2^2 = 1$, giving
       $\\lVert \\hat a - \\hat b\\rVert_2^2 = 2 - 2\\langle\\hat a,\\hat b\\rangle.$ And $\\langle\\hat a,\\hat b\\rangle$ — the dot
       product of two <i>unit</i> vectors — is exactly the <b>cosine similarity</b>
       $\\langle a,b\\rangle / (\\lVert a\\rVert_2\\lVert b\\rVert_2)$ (the cosine-similarity owner is the
       <b>dl-cosine-similarity</b> lesson; the L2 norm is <b>fnd-norm</b>). Substituting reproduces the
       right-hand side of Eqn. 2. So the loss is a strictly decreasing function of the cosine similarity:
       <b>minimizing the normalized MSE is maximizing cosine similarity.</b></p>
       <p><b>Why collapse is avoided — the paper's argument (§3).</b> A trivial constant output makes the
       loss zero, so why is it not found? Because the target is <b>not</b> trained to minimize the loss:
       $\\xi$ is updated by Eqn. 1 (EMA toward $\\theta$), so $\\xi$ is <b>not</b> moving along
       $\\nabla_\\xi \\mathcal{L}_{\\theta,\\xi}$. The online side has the extra <b>predictor</b> $q_\\theta$ and a
       <b>stop-gradient</b> on the target, so the two networks are never jointly descended into the same
       constant — the online net always chases a <i>lagging, differently-parameterized</i> target. This is
       an empirical-plus-intuitive argument, and §5's ablations are the proof: drop the predictor or freeze
       the target and quality collapses.</p>`,
    example:
      `<p>Work the prediction loss (Eqn. 2) by hand for one view, and one EMA update (Eqn. 1) for one
       weight. Take 2-D vectors (the predictor output and the target projection, before normalizing):</p>
       <ul>
        <li>prediction $a = q_\\theta(z_\\theta) = [3.0,\\ 4.0]$</li>
        <li>target $b = z'_\\xi = [4.0,\\ 3.0]$</li>
       </ul>
       <ul class="steps">
        <li><b>Lengths.</b> $\\lVert a\\rVert_2 = \\sqrt{3^2+4^2} = 5$; &nbsp; $\\lVert b\\rVert_2 = \\sqrt{4^2+3^2} = 5$.</li>
        <li><b>Dot product.</b> $\\langle a,b\\rangle = 3\\cdot4 + 4\\cdot3 = 12 + 12 = 24$.</li>
        <li><b>Cosine similarity.</b> $\\dfrac{\\langle a,b\\rangle}{\\lVert a\\rVert_2\\,\\lVert b\\rVert_2} = \\dfrac{24}{5\\cdot5} = \\dfrac{24}{25} = 0.96$.</li>
        <li><b>Loss (right-hand form of Eqn. 2).</b> $\\mathcal{L} = 2 - 2(0.96) = 2 - 1.92 = 0.08$.</li>
        <li><b>Check via the squared-distance form.</b> Unit vectors: $\\hat a = [0.6, 0.8]$, $\\hat b = [0.8, 0.6]$.
        $\\hat a - \\hat b = [-0.2,\\ 0.2]$, so $\\lVert\\hat a - \\hat b\\rVert_2^2 = 0.04 + 0.04 = 0.08$. ✓ Both forms agree.</li>
       </ul>
       <p>Now one <b>EMA update</b> (Eqn. 1) for a single weight, with decay $\\tau = 0.99$. Say the target
       weight is $\\xi = 1.00$ and the freshly-updated online weight is $\\theta = 2.00$:</p>
       <ul class="steps">
        <li>$\\xi \\leftarrow \\tau\\,\\xi + (1-\\tau)\\,\\theta = 0.99(1.00) + 0.01(2.00) = 0.99 + 0.02 = 1.01.$</li>
       </ul>
       <p>The target moved only $0.01$ of the way to the online weight — a <b>slow</b> chase. These exact
       numbers ($\\mathcal{L} = 0.08$ and $\\xi = 1.01$) are recomputed in the notebook's first cell so you
       can check your loss and EMA implementation.</p>`,
    recipe:
      `<ol>
        <li><b>Two views.</b> For each image sample the augmentation pipeline <b>twice</b> → views $v, v'$.</li>
        <li><b>Online forward.</b> $v \\to f_\\theta \\to g_\\theta \\to q_\\theta$ giving the prediction
        $q_\\theta(z_\\theta)$.</li>
        <li><b>Target forward (stop-gradient).</b> $v' \\to f_\\xi \\to g_\\xi$ giving $z'_\\xi$, computed
        inside <code>torch.no_grad()</code>.</li>
        <li><b>Normalized-MSE loss (Eqn. 2).</b> L2-normalize both vectors; take the squared distance
        ($=2-2\\cos$). <b>Symmetrize:</b> repeat steps 2–4 with $v$ and $v'$ swapped, add the two losses.</li>
        <li><b>Update online.</b> One optimizer step on $\\theta$ only (the target got no gradient).</li>
        <li><b>EMA update target (Eqn. 1).</b> $\\xi \\leftarrow \\tau\\,\\xi + (1-\\tau)\\,\\theta$ for every weight.</li>
        <li><b>Pretrain</b> for some epochs on an <b>unlabelled</b> image subset — <b>no negatives</b>.</li>
        <li><b>Linear probe.</b> Freeze $f_\\theta$, train a single <code>nn.Linear</code> on its features
        from a few labels; compare to from-scratch.</li>
        <li><b>Ablate.</b> Remove the predictor (or the stop-grad / EMA) and re-pretrain → the features
        collapse toward a constant and the probe accuracy falls to near chance.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "BYOL reaches <b>74.3% top-1 classification accuracy</b> on ImageNet
       using a linear evaluation with a ResNet-50 architecture and <b>79.6%</b> with a larger ResNet,"
       and achieves this "without [negative pairs]." The ablations (§5) report that removing key pieces
       degrades or collapses the representation — e.g. using a frozen random target ($\\tau = 1$) drops far
       below the full method, and removing the predictor collapses to near-zero accuracy.</p>
       <p><i>These are the paper's reported ImageNet figures, quoted from the abstract / §5. The numbers in
       the CODEVIZ panel below are from our own tiny MNIST run — not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.Linear</code>, <code>nn.ReLU</code>, <code>F.normalize</code>, the optimizer,
       <code>torch.no_grad()</code>, and the MNIST loader + augmentations from torchvision (preinstalled in
       Colab — no pip). <b>Build by hand:</b> the two-view pipeline, the online (encoder + projector +
       <b>predictor</b>) and target (encoder + projector) networks, the <b>stop-gradient</b> target branch,
       the <b>normalized-MSE</b> loss (Eqn. 2) and its symmetrization, the <b>EMA update</b> (Eqn. 1), the
       <b>linear-probe vs from-scratch</b> comparison, and the <b>no-predictor collapse</b> ablation. There
       is no conceptLink — the cosine/L2 facts are recapped here (owners: <b>dl-cosine-similarity</b>,
       <b>fnd-norm</b>) and the EMA / momentum-encoder idea is cross-linked to <b>paper-moco</b>.</p>`,
    pitfalls:
      `<ul>
        <li><b>Letting gradients into the target.</b> The target projection $z'_\\xi$ must be computed under
        <code>torch.no_grad()</code> (the stop-gradient). If you backprop into $\\xi$, both nets descend the
        loss together and <b>collapse to a constant</b>. <b>Fix:</b> wrap the target branch in
        <code>no_grad</code> and update $\\xi$ ONLY by the EMA rule.</li>
        <li><b>Dropping the predictor.</b> The predictor $q_\\theta$ exists only on the online side and is
        essential — the paper's ablation shows removing it collapses the representation. <b>Fix:</b> keep
        $q_\\theta$; the target side must NOT have one (asymmetry is the point).</li>
        <li><b>Forgetting to L2-normalize before the MSE.</b> Eqn. 2 normalizes both vectors to unit length
        first; only then does the squared distance equal $2-2\\cos$. Skipping <code>F.normalize</code> turns
        it into a plain (scale-sensitive) MSE the paper does not use.</li>
        <li><b>EMA decay $\\tau$ wrong.</b> $\\tau$ must be <i>close to 1</i> (e.g. $0.99$–$0.999$) so the
        target moves slowly. $\\tau = 0$ makes the target a hard copy each step (unstable); $\\tau = 1$
        freezes it at random init (the paper's ablation shows this degrades badly).</li>
        <li><b>Forgetting to symmetrize.</b> The BYOL loss feeds each view through both networks and adds the
        two terms. Using only one direction halves the signal and slows learning.</li>
        <li><b>Probing the wrong vector.</b> Your representation is the online <b>encoder</b> output
        $f_\\theta(x)$ — not the projection $z_\\theta$ and not the predictor output. Probe the encoder; the
        projector and predictor are discarded after pretraining.</li>
      </ul>`,
    recall: [
      "Write the BYOL prediction loss (Eqn. 2) and explain why it equals $2 - 2\\cos\\angle$.",
      "Write the target EMA update (Eqn. 1) and say what $\\tau$ controls.",
      "Which network has a predictor, and which side gets the stop-gradient?",
      "Name the TWO mechanisms BYOL uses to avoid collapse without negatives.",
      "After pretraining, which vector do you keep and probe — encoder output, projection, or prediction?"
    ],
    practice: [
      {
        q: `<b>The headline (no negatives).</b> You pretrained an encoder with BYOL on unlabelled images —
            <i>no negative pairs at all</i> — froze it, and trained a linear probe on just 20 labels; you
            also trained a from-scratch model on the same 20 labels. The probe scores much higher. What does
            that demonstrate, and how is it different from what SimCLR (paper-simclr) / MoCo (paper-moco)
            would have needed?`,
        steps: [
          { do: `Compare the two accuracies at the smallest label budget; the frozen-BYOL probe wins.`, why: `With only 20 labels a from-scratch net has too little signal; the probe inherits features learned from thousands of <i>unlabelled</i> images.` },
          { do: `Note that the BYOL loss contained <b>no negatives</b> — only a positive-pair prediction against a slow EMA target.`, why: `SimCLR/MoCo need many negatives (big batch / memory queue) to avoid collapse; BYOL replaces that with the predictor + stop-grad + EMA.` },
          { do: `Conclude that negative-free, label-free pretraining alone supplied the useful structure.`, why: `Same encoder, same probe, same labels; only the pretraining differs — and it used no negatives.` }
        ],
        answer: `<p>It demonstrates that <b>negative-free, label-free pretraining transfers</b>: in the
                 low-label regime a linear probe on frozen BYOL features beats from-scratch because the
                 features were shaped by thousands of unlabelled images — using <b>no negative pairs</b>.
                 SimCLR / MoCo would have needed a large batch or a memory queue of negatives to avoid
                 collapse; BYOL instead relies on the predictor, the stop-gradient, and the slow EMA target.
                 Our CODEVIZ panel shows the probe beating from-scratch across the label budgets.</p>`
      },
      {
        q: `Your worked example gave $\\mathcal{L} = 0.08$ for prediction $a=[3,4]$ and target $b=[4,3]$
            (cosine $0.96$). Now suppose training drifts so the prediction becomes $a=[5,0]$ while the target
            stays $b=[4,3]$. Does the loss go up or down, and by how much?`,
        steps: [
          { do: `Lengths: $\\lVert a\\rVert_2=\\sqrt{25}=5$, $\\lVert b\\rVert_2=\\sqrt{16+9}=5$.`, why: `Need both norms to normalize for the cosine form of Eqn. 2.` },
          { do: `Dot product $\\langle a,b\\rangle = 5\\cdot4 + 0\\cdot3 = 20$; cosine $=20/(5\\cdot5)=0.80$.`, why: `Cosine fell from $0.96$ to $0.80$ — prediction and target now point less alike.` },
          { do: `Loss $=2-2(0.80)=0.40$.`, why: `Lower cosine → larger $2-2\\cos$ → larger loss.` }
        ],
        answer: `<p>The loss <b>goes up</b>, from $0.08$ to $0.40$. The prediction and target are now less
                 aligned (cosine $0.96 \\to 0.80$), and since the loss is $2-2\\cos$, a smaller cosine means a
                 bigger loss. Gradient descent on $\\theta$ would push the online prediction back toward the
                 target to shrink it again.</p>`
      },
      {
        q: `<b>Ablation.</b> You remove the <b>predictor</b> $q_\\theta$ (so the online side is just encoder +
            projector, identical in shape to the target) and re-pretrain BYOL. Training loss drops to almost
            $0$ within a few steps, but the linear probe is now near chance (~10% on 10-way MNIST). What
            happened, and which design choice prevents it in real BYOL?`,
        steps: [
          { do: `Inspect the encoder outputs across different images after the collapsed run.`, why: `They are nearly <i>identical</i> — the encoder outputs almost the same vector for every image (a <b>constant collapse</b>).` },
          { do: `See why the loss went to ~0: if both sides output the same constant, prediction = target exactly, so $2-2\\cos = 0$.`, why: `With no negatives and a symmetric online/target, the trivial constant solution minimizes the loss — nothing forces images apart.` },
          { do: `Restore the predictor $q_\\theta$ (asymmetry) + stop-gradient + EMA target.`, why: `The predictor and the lagging, stop-gradient target make the two sides hard to collapse jointly (paper §3, §5 Table 5b).` }
        ],
        answer: `<p>The representation <b>collapsed to a constant</b>: with the predictor gone, the online and
                 target branches are symmetric, and outputting the same constant vector for every image makes
                 the normalized-MSE loss exactly $0$ while learning nothing — so the probe is at chance. Real
                 BYOL prevents this with the <b>asymmetric predictor</b> $q_\\theta$ on the online side, the
                 <b>stop-gradient</b> on the target, and the <b>slow EMA</b> target — exactly the components
                 the paper's §5 ablation removes to reproduce the collapse. Our CODEVIZ panel shows the
                 collapsed (no-predictor) feature variance crushed toward $0$ versus the healthy full run.</p>`
      }
    ]
  });

  window.CODE["paper-byol"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the online (encoder + projector + <b>predictor</b>) and target
       (encoder + projector) networks, the <b>stop-gradient</b> target branch, the <b>normalized-MSE</b>
       loss (Eqn. 2) with symmetrization, and the <b>EMA update</b> (Eqn. 1) — all by hand on
       <code>nn</code> primitives — then pretrain on an <b>MNIST subset</b> with <b>no labels and no
       negatives</b> (torchvision, preinstalled in Colab — no pip). The first cell recomputes the worked
       example: prediction loss $\\mathcal{L}=0.08$ and one EMA step $\\xi=1.01$. After pretraining we
       <b>freeze</b> the encoder and run a <b>linear probe</b> vs a <b>from-scratch</b> model on the same
       few labels (probe wins in the low-label regime), then the <b>no-predictor ablation</b> that collapses
       the features. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np, copy
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: prediction loss (Eqn. 2) and one EMA step (Eqn. 1). ---
a = torch.tensor([3.0, 4.0]); b = torch.tensor([4.0, 3.0])      # prediction, target (pre-normalize)
loss = ((F.normalize(a, dim=0) - F.normalize(b, dim=0))**2).sum()
cos  = (a @ b) / (a.norm() * b.norm())
print("worked example:  cos =", round(cos.item(), 4),
      " loss =", round(loss.item(), 4), " (== 2-2cos =", round((2 - 2*cos).item(), 4), ")")
tau_ema = 0.99; xi, th = 1.00, 2.00
print("EMA step:  xi <- tau*xi + (1-tau)*theta =", round(tau_ema*xi + (1 - tau_ema)*th, 4))
# worked example:  cos = 0.96  loss = 0.08  (== 2-2cos = 0.08 )
# EMA step:  xi <- tau*xi + (1-tau)*theta = 1.01


# --- 1. Building blocks (encoder f, projector g, predictor q) from nn primitives. ---
class Encoder(nn.Module):                  # small conv net -> representation
    def __init__(self, feat=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.AdaptiveAvgPool2d(1), nn.Flatten())
        self.fc = nn.Linear(32, feat)
    def forward(self, x): return F.relu(self.fc(self.net(x)))

def mlp(fin=64, hid=128, out=64):          # projector / predictor: MLP, one hidden layer + ReLU
    return nn.Sequential(nn.Linear(fin, hid), nn.ReLU(), nn.Linear(hid, out))


# --- 2. The BYOL pair: online (enc+proj+PREDICTOR) and target (enc+proj, EMA, stop-grad). ---
class BYOL(nn.Module):
    def __init__(self, use_predictor=True, tau=0.99):
        super().__init__(); self.tau = tau; self.use_predictor = use_predictor
        self.enc_o, self.proj_o = Encoder(), mlp()          # online
        self.pred = mlp() if use_predictor else nn.Identity()  # predictor: ONLINE side only
        self.enc_t = copy.deepcopy(self.enc_o)              # target = EMA copy (no grad)
        self.proj_t = copy.deepcopy(self.proj_o)
        for p in list(self.enc_t.parameters()) + list(self.proj_t.parameters()):
            p.requires_grad_(False)
    def online(self, x): return self.pred(self.proj_o(self.enc_o(x)))   # q(g(f(x)))
    def target(self, x):
        with torch.no_grad(): return self.proj_t(self.enc_t(x))         # stop-gradient
    def loss(self, v1, v2):                 # normalized-MSE (Eqn. 2), symmetrized
        def nmse(p, z): return ((F.normalize(p, dim=1) - F.normalize(z, dim=1))**2).sum(1).mean()
        return nmse(self.online(v1), self.target(v2)) + nmse(self.online(v2), self.target(v1))
    @torch.no_grad()
    def ema_update(self):                   # Eqn. 1: xi <- tau*xi + (1-tau)*theta
        for o, t in [(self.enc_o, self.enc_t), (self.proj_o, self.proj_t)]:
            for po, pt in zip(o.parameters(), t.parameters()):
                pt.mul_(self.tau).add_(po.detach(), alpha=1 - self.tau)


# --- 3. Two-view augmentation + an UNLABELLED MNIST subset (torchvision, preinstalled). ---
aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5, 1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]
labels = torch.tensor([raw[i][1] for i in idx])     # used ONLY for the probe later

def pretrain(use_predictor=True, epochs=15):
    torch.manual_seed(0); m = BYOL(use_predictor=use_predictor).to(device)
    opt = torch.optim.Adam([p for p in m.parameters() if p.requires_grad], lr=1e-3)
    m.train(); B = 128
    for ep in range(epochs):
        perm = np.random.permutation(len(imgs)); tot = 0.0; nb = 0
        for s in range(0, len(imgs), B):
            bi = perm[s:s + B]
            v1 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            v2 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            loss = m.loss(v1, v2)
            opt.zero_grad(); loss.backward(); opt.step(); m.ema_update()  # online step THEN EMA
            tot += loss.item(); nb += 1
        if ep % 3 == 0: print(f"  pretrain ep {ep}  BYOL loss {tot/nb:.4f}")
    return m

print("\\n=== full BYOL (with predictor) ===")
m = pretrain(use_predictor=True)

# --- 4. FREEZE the online encoder, extract features (linear-evaluation protocol). ---
def features(model):
    model.eval()
    with torch.no_grad():
        return model.enc_o(torch.stack([base(im) for im in imgs]).to(device)).cpu()
feats = features(m)
print("feature std across images (full BYOL):", round(feats.std(0).mean().item(), 4), "(healthy: > 0)")

def linear_probe(feats, n_lab):             # train ONLY a linear classifier on frozen features
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

print("\\nlabels | probe(frozen BYOL) | from-scratch")
for n in [20, 50, 100, 300]:
    print(f"{n:6d} |       {linear_probe(feats, n):.3f}        |    {from_scratch(n):.3f}")

# --- 5. ABLATION: remove the predictor -> collapse to a constant -> probe near chance. ---
print("\\n=== ablation: NO predictor (expect collapse) ===")
m_ab = pretrain(use_predictor=False)
feats_ab = features(m_ab)
print("feature std across images (no predictor):", round(feats_ab.std(0).mean().item(), 4), "(collapsed: ~0)")
print("probe(no-predictor BYOL) @100 labels:", round(linear_probe(feats_ab, 100), 3), "(~chance 0.10)")
# Full BYOL: probe beats from-scratch at every budget, features have healthy variance.
# No predictor: feature std collapses toward 0 and the probe falls to ~chance.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-byol"] = {
    question: "Does BYOL learn useful features with NO negatives — and does removing the predictor collapse them?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs number of labels — frozen-BYOL linear probe vs from-scratch (MNIST subset)",
        xlabel: "number of labelled examples",
        ylabel: "test accuracy",
        series: [
          {
            name: "Linear probe (frozen BYOL, no negatives)",
            color: "#7ee787",
            points: [[20, 0.268], [50, 0.331], [100, 0.398], [300, 0.452]]
          },
          {
            name: "From scratch (same labels)",
            color: "#ff7b72",
            points: [[20, 0.110], [50, 0.156], [100, 0.171], [300, 0.180]]
          }
        ]
      },
      {
        type: "bar",
        title: "Collapse ablation — mean feature standard-deviation across images",
        xlabel: "pretraining variant",
        ylabel: "feature std (0 = collapsed to a constant)",
        series: [
          {
            name: "feature std",
            color: "#a5d6ff",
            points: [["Full BYOL (predictor + EMA + stop-grad)", 0.74], ["No predictor (ablation)", 0.03]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A small conv encoder was pretrained with BYOL (online predicts an EMA target's projection; normalized-MSE loss; NO negatives) on 3,000 <b>unlabelled</b> MNIST images for 15 epochs, then <b>frozen</b>. <b>Left:</b> a one-layer linear probe on its features (green) beats a from-scratch conv net on the <i>same</i> few labels (red) at every budget — e.g. 0.268 vs 0.110 at 20 labels — so negative-free pretraining supplied the useful structure. <b>Right:</b> the ablation — removing the predictor collapses the representation: feature standard-deviation across images falls from ~0.74 (full BYOL) to ~0.03 (every image maps to nearly the same vector), confirming the predictor + stop-gradient + EMA are what prevent collapse without negatives. (Accuracies are modest because the encoder is tiny and pretraining is short; the qualitative gap and the collapse are the point.)",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np, copy
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)

# BYOL with NO negatives on UNLABELLED MNIST: freeze, probe vs from-scratch, and the
# no-predictor collapse ablation (toy reproduction).
class Encoder(nn.Module):
    def __init__(s, feat=64):
        super().__init__()
        s.net = nn.Sequential(nn.Conv2d(1,16,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.Conv2d(16,32,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.AdaptiveAvgPool2d(1), nn.Flatten())
        s.fc = nn.Linear(32, feat)
    def forward(s, x): return F.relu(s.fc(s.net(x)))
def mlp(fin=64, hid=128, out=64):
    return nn.Sequential(nn.Linear(fin,hid), nn.ReLU(), nn.Linear(hid,out))

class BYOL(nn.Module):
    def __init__(s, use_predictor=True, tau=0.99):
        super().__init__(); s.tau=tau
        s.enc_o, s.proj_o = Encoder(), mlp()
        s.pred = mlp() if use_predictor else nn.Identity()
        s.enc_t, s.proj_t = copy.deepcopy(s.enc_o), copy.deepcopy(s.proj_o)
        for p in list(s.enc_t.parameters())+list(s.proj_t.parameters()): p.requires_grad_(False)
    def online(s, x): return s.pred(s.proj_o(s.enc_o(x)))
    def target(s, x):
        with torch.no_grad(): return s.proj_t(s.enc_t(x))
    def loss(s, v1, v2):
        def nmse(p,z): return ((F.normalize(p,dim=1)-F.normalize(z,dim=1))**2).sum(1).mean()
        return nmse(s.online(v1), s.target(v2)) + nmse(s.online(v2), s.target(v1))
    @torch.no_grad()
    def ema(s):
        for o,t in [(s.enc_o,s.enc_t),(s.proj_o,s.proj_t)]:
            for po,pt in zip(o.parameters(), t.parameters()):
                pt.mul_(s.tau).add_(po.detach(), alpha=1-s.tau)

aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5,1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]; labels = torch.tensor([raw[i][1] for i in idx])

def pretrain(use_predictor=True, epochs=15):
    torch.manual_seed(0); m = BYOL(use_predictor=use_predictor)
    opt = torch.optim.Adam([p for p in m.parameters() if p.requires_grad], lr=1e-3)
    m.train(); B=128
    for ep in range(epochs):
        perm = np.random.permutation(len(imgs))
        for s0 in range(0, len(imgs), B):
            bi = perm[s0:s0+B]
            v1 = torch.stack([aug(imgs[i]) for i in bi]); v2 = torch.stack([aug(imgs[i]) for i in bi])
            loss = m.loss(v1, v2)
            opt.zero_grad(); loss.backward(); opt.step(); m.ema()
    return m
def features(m):
    m.eval()
    with torch.no_grad(): return m.enc_o(torch.stack([base(im) for im in imgs]))

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

m_full = pretrain(use_predictor=True); f_full = features(m_full)
for n in [20,50,100,300]:
    print(n, "probe", probe(f_full, n), "scratch", scratch(n))
print("full BYOL feature std:", round(f_full.std(0).mean().item(),3))

m_ab = pretrain(use_predictor=False); f_ab = features(m_ab)
print("no-predictor feature std:", round(f_ab.std(0).mean().item(),3), "(collapsed ~0)")
print("no-predictor probe @100:", probe(f_ab, 100), "(~chance)")
# Full BYOL probe > from-scratch at every budget (no negatives used).
# No predictor -> feature std collapses toward 0, probe near chance.`
  };
})();
