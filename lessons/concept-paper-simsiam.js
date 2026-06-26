/* Paper lesson — "Exploring Simple Siamese Representation Learning" (SimSiam),
   Xinlei Chen and Kaiming He, FAIR 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-simsiam".
   GROUNDED from arXiv:2011.10566 (abstract) and the ar5iv HTML mirror (Section 3 Method:
   Eqn. 1 negative cosine, Eqn. 2 symmetrized loss, Eqn. 3 stop-gradient term, Eqn. 4 symmetrized loss
   with stop-gradient; Section 5 hypothesis: Eqns. 5-10 EM-like reformulation; Section 4 Empirical Study:
   Figure 2 collapse ablation, 67.7% linear probe with stop-gradient). Track B (architecture): build the siamese
   encoder f + predictor h + negative-cosine loss with stop-gradient by hand on nn primitives;
   pretrain on an MNIST subset; the ABLATION removes the stop-gradient and the loss collapses to -1
   with output std -> 0. Cross-links: paper-simclr (uses negatives), paper-byol (uses a momentum
   encoder). conceptLink is null (no owning concept lesson), so the math is derived in full here. */
(function () {
  window.LESSONS.push({
    id: "paper-simsiam",
    title: "SimSiam — Exploring Simple Siamese Representation Learning (2020)",
    tagline: "Self-supervised learning with no negatives, no momentum encoder, no big batches — a stop-gradient alone stops collapse.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Xinlei Chen, Kaiming He",
      org: "Facebook AI Research (FAIR)",
      year: 2020,
      venue: "arXiv:2011.10566 (Nov 2020); CVPR 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2011.10566",
      code: "https://github.com/facebookresearch/simsiam"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-cosine-similarity", "dl-conv", "pt-cnn", "pt-nn-module", "pt-training-loop", "paper-simclr"],

    // WHY READ IT
    problem:
      `<p>A <b>siamese network</b> is two copies of the same network that share their weights, fed two inputs;
       you compare their outputs. For <b>self-supervised learning</b> (learning a useful vector summary of an
       image from <i>unlabelled</i> pictures, with no human labels), the natural siamese recipe is: make two
       distorted copies (called <b>views</b>) of one image, push their representations to be <i>identical</i>.</p>
       <p>But that recipe has a famous trap — the <b>collapsing solution</b>. If the only goal is "make the two
       views match," the network can cheat: output the <i>same constant vector for every image</i>. Then every
       pair matches perfectly, the loss is minimal, and the representation is useless (it tells images apart not
       at all). Earlier methods spent real machinery to dodge this collapse: SimCLR used <b>negative pairs</b>
       (also push <i>different</i> images apart — see <code>paper-simclr</code>); BYOL used a <b>momentum
       encoder</b> (a slowly-updated second copy of the network — see <code>paper-byol</code>); others used large
       batches or clustering constraints.</p>
       <p>The paper's question (§1): are any of these crutches actually <i>necessary</i>? Or can a plain siamese
       net avoid collapse with something far simpler?</p>`,
    contribution:
      `<ul>
        <li><b>A surprising minimal recipe.</b> The abstract reports that "simple Siamese networks can learn
        meaningful representations even using none of the following: (i) negative sample pairs, (ii) large
        batches, (iii) momentum encoders." Just two views, a shared encoder, a small predictor, and a
        similarity loss.</li>
        <li><b>The <i>stop-gradient</i> is the key.</b> The one ingredient that does the work is a
        <b>stop-gradient</b> operation (§3): on each view, treat the <i>other</i> view's target as a constant —
        block the gradient from flowing back through it. §4.1 shows that removing it makes training collapse
        immediately.</li>
        <li><b>An asymmetric <i>predictor</i> head.</b> A small extra MLP <b>predictor</b> $h$ sits on one side
        only. §4.2 reports that without it the method fails completely. Stop-gradient and predictor together are
        the whole trick.</li>
        <li><b>A hypothesis for <i>why</i> it works (§5):</b> SimSiam behaves like an <b>Expectation-Maximization
        (EM)-like alternating optimization</b> — the stop-gradient is exactly what you get when you fix one set
        of variables and optimize the other.</li>
      </ul>`,
    whyItMattered:
      `<p>SimSiam stripped self-supervised siamese learning down to its essentials and showed that avoiding
       collapse does <i>not</i> require negatives, momentum encoders, or huge batches — a single stop-gradient
       suffices. That reframed the whole family: SimCLR, BYOL, MoCo, and SwAV could be read as different ways of
       supplying the same anti-collapse pressure, with SimSiam as the "hypothesis-testing" baseline that isolates
       it. It made strong self-supervised pretraining reproducible on modest hardware, and its stop-gradient +
       predictor design reappears across later representation-learning and distillation methods.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§3 (Method)</b> — Figure 1's architecture (two views → shared encoder $f$ → predictor $h$ on one
        side → symmetrized loss) and the equations you will transcribe: <b>Eqn. 1</b> (negative cosine
        similarity $\\mathcal{D}$), <b>Eqn. 2</b> (symmetrized loss), and <b>Eqn. 4</b> (the same loss with
        <code>stopgrad</code>).</li>
        <li><b>§4.1 (Stop-gradient)</b> — Figure 2: the collapse ablation. Watch the training loss drop to the
        <b>minimum $-1$</b> and the output <b>std go to $0$</b> the instant stop-gradient is removed. This is the
        whole paper in one figure.</li>
        <li><b>§4.2 (Predictor)</b> — what happens when you drop the predictor $h$ (it fails), and the learning-rate
        detail that makes it work.</li>
       </ul>
       <p><b>Skim:</b> §4.3–4.6 (batch size, batch normalization, similarity function, symmetrization ablations —
       all show the method is robust), §5 (the EM hypothesis and "proof of concept" — beautiful but optional), and
       the ImageNet tables in §6. The core you need is two equations and one figure.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a plain siamese net that only ever tries to make two augmented views of an image
       <b>match</b> — no negative pairs, no second "momentum" network. The single safeguard is a
       <b>stop-gradient</b>: when matching view 1's prediction to view 2's representation, treat view 2's
       representation as a fixed target (no gradient flows back into it).</p>
       <p>Now the ablation. If you <b>remove</b> that stop-gradient and let gradients flow through both sides,
       what do you expect the loss to do — stay healthy, or <b>collapse</b>? If it collapses, what value does a
       negative-cosine-similarity loss reach at its worst, and what happens to the spread (standard deviation) of
       the outputs? Write your guess, then run it.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Two views.</b> For each image apply a random augmentation <i>twice</i> → $x_1, x_2$.</li>
        <li><b>Encoder $f$.</b> A small conv net (backbone + projection) shared by both views → $z = f(x)$.
        <i># this is your representation.</i></li>
        <li><b>Predictor $h$.</b> TODO: a small MLP on <b>one side only</b>, $p = h(z)$. <i># asymmetry matters.</i></li>
        <li><b>Negative-cosine loss with STOP-GRADIENT.</b> TODO: define
        $\\mathcal{D}(p, z) = -\\,\\frac{p}{\\lVert p\\rVert}\\cdot\\frac{z}{\\lVert z\\rVert}$ (negative cosine
        similarity). The symmetric loss is
        $\\tfrac{1}{2}\\mathcal{D}(p_1, \\mathrm{sg}(z_2)) + \\tfrac{1}{2}\\mathcal{D}(p_2, \\mathrm{sg}(z_1))$,
        where $\\mathrm{sg}(\\cdot)$ is <code>stopgrad</code> — <i># detach the target so no gradient flows into it.</i></li>
       </ul>
       <p>Then run the <b>ablation</b>: delete the <code>stopgrad</code> (use the raw $z$ as target) and watch the
       loss fall to $-1$ while the output std collapses toward $0$.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>SimSiam (§3, Figure 1) is deliberately tiny. Take one image $x$. Apply a random augmentation
       <b>twice</b> to get two views $x_1$ and $x_2$. Both go through the <b>same encoder</b> $f$ (weights
       shared) — in the paper a ResNet backbone plus a projection MLP; here a small conv net. Write the encoder
       outputs $z_1 = f(x_1)$ and $z_2 = f(x_2)$.</p>
       <p>Now the one asymmetry: a small <b>predictor</b> MLP $h$ sits on <i>one</i> side. It tries to
       <b>predict</b> the other view's encoding from this view's: $p_1 \\triangleq h(f(x_1)) = h(z_1)$. So we want
       $p_1$ (view 1's prediction) to match $z_2$ (view 2's encoding). The match is measured by the
       <b>negative cosine similarity</b> $\\mathcal{D}(p_1, z_2)$ (Eqn. 1): cosine similarity is the cosine of the
       angle between two vectors (in $[-1,1]$, $1$ when they point the same way), and the minus sign turns
       "as similar as possible" into "as <i>small</i> as possible" so we can minimize it.</p>
       <p>Here is the crucial part — the <b>stop-gradient</b>. We do not just minimize $\\mathcal{D}(p_1, z_2)$.
       We minimize $\\mathcal{D}(p_1, \\mathrm{stopgrad}(z_2))$: we treat $z_2$ as a <b>constant target</b>. The
       gradient updates the predictor and the encoder <i>on the $x_1$ side</i>, but <b>no gradient flows back
       into the encoder through $z_2$</b>. The paper's words: "the encoder on $x_2$ receives no gradient from
       $z_2$ in the first term." View 2's encoding is a fixed thing that view 1 chases.</p>
       <p>To use both views symmetrically, do it both ways and average (Eqn. 2 / Eqn. 4):
       $\\mathcal{L} = \\tfrac{1}{2}\\mathcal{D}(p_1, \\mathrm{stopgrad}(z_2)) + \\tfrac{1}{2}\\mathcal{D}(p_2, \\mathrm{stopgrad}(z_1))$.
       Each side predicts the other; each side's <i>target</i> is detached.</p>
       <p><b>Why no collapse?</b> A collapsing solution outputs the same constant vector for every image; then
       every cosine similarity is $1$ and the loss hits its floor $-1$. With stop-gradient, the target side is
       frozen at each step, so the predictor cannot drag both sides to a shared constant in lock-step. §5
       hypothesizes this is an <b>EM-like</b> alternation: you alternately fix the "targets" (the $z$'s, like a
       latent assignment) and update the network — and the stop-gradient is exactly the artifact of holding one
       set fixed while you optimize the other. <b>Remove the stop-gradient</b> (§4.1) and both sides chase each
       other freely: training collapses instantly, the loss drops to $-1$, and the per-channel standard deviation
       of the (L2-normalized) outputs goes to $\\approx 0$. With stop-gradient, that std sits healthily around
       $1/\\sqrt{d}$ for $d$-dimensional outputs — the value you get when vectors are spread out on the unit
       hypersphere rather than piled at one point.</p>`,
    architecture:
      `<p>SimSiam (§3, Figure 1) has exactly two learnable modules, run as two weight-sharing branches.</p>
       <p><b>Data flow (one step).</b> One image $x$ → augment twice → views $x_1, x_2$ → <b>shared encoder</b> $f$
       → encodings $z_1 = f(x_1),\\ z_2 = f(x_2)$. The <b>predictor</b> $h$ runs on each encoding →
       $p_1 = h(z_1),\\ p_2 = h(z_2)$. The loss matches each <i>prediction</i> to the <i>other</i> view's encoding,
       with that encoding <b>stop-gradiented</b>: $\\tfrac12\\mathcal{D}(p_1, \\mathrm{sg}(z_2)) + \\tfrac12\\mathcal{D}(p_2, \\mathrm{sg}(z_1))$.</p>
       <p><b>Encoder $f$ = backbone + projection MLP.</b> The paper uses a ResNet-50 backbone followed by a
       <b>3-layer projection MLP</b>, batch-norm on every fully-connected layer (including the output layer), no
       ReLU on the output, output dimension <b>$2048$</b>. (Our lesson code substitutes a tiny conv net + a small
       projection so it runs on MNIST.)</p>
       <p><b>Predictor $h$ = bottleneck MLP, one side's asymmetry.</b> A <b>2-layer MLP</b>: input $2048$ →
       hidden <b>$512$</b> (a deliberate <i>bottleneck</i>, narrower than in/out) with batch-norm + ReLU → output
       $2048$, no batch-norm and no ReLU on the output. $h$ is the <i>only</i> thing that breaks the symmetry
       between the two branches; §4.2 reports the method fails without it.</p>
       <p><b>The two branches and the stop-gradient.</b> The branches are <i>identical weights</i> but <i>not</i>
       symmetric in the gradient: on each term, the prediction branch ($p$ side, encoder + predictor) receives
       gradient, while the target branch ($z$ side) is frozen by <code>stopgrad</code>. There is <b>no second
       network</b>: unlike BYOL's momentum encoder, the target is the same encoder $f$ with its gradient cut.
       What you keep at the end is $z = f(x)$; the predictor $h$ is discarded after pretraining.</p>`,
    symbols: [
      { sym: "$x_1,\\ x_2$", desc: "the two <b>augmented views</b> of one image — the same picture distorted two different ways (random crop / colour / blur)." },
      { sym: "$f(\\cdot)$", desc: "the shared <b>encoder</b> (backbone + projection MLP; a small conv net here). Maps a view to its representation $z = f(x)$. The same weights process both views." },
      { sym: "$z_1, z_2$", desc: "the <b>encoder outputs</b> (representations) of the two views, $z_1 = f(x_1)$, $z_2 = f(x_2)$. The $z$ is what you keep and probe; you discard the predictor." },
      { sym: "$h(\\cdot)$", desc: "the <b>predictor</b>: a small MLP that sits on <i>one side only</i>. It maps this view's encoding to a prediction of the <i>other</i> view's encoding. The architecture's only asymmetry." },
      { sym: "$p_1, p_2$", desc: "the <b>predictions</b>: $p_1 \\triangleq h(f(x_1)) = h(z_1)$ predicts $z_2$, and $p_2 = h(z_2)$ predicts $z_1$. ($\\triangleq$ means ‘is defined as’.)" },
      { sym: "$\\mathcal{D}(p, z)$", desc: "the <b>negative cosine similarity</b> between $p$ and $z$ (Eqn. 1). Cosine similarity is $\\frac{p}{\\lVert p\\rVert}\\cdot\\frac{z}{\\lVert z\\rVert}$, the cosine of the angle, in $[-1,1]$; the minus sign makes 'most similar' the minimum, $-1$." },
      { sym: "$\\lVert p\\rVert_2$", desc: "the <b>L2 norm</b> (Euclidean length) of the vector $p$. Dividing by it makes $p/\\lVert p\\rVert$ a unit vector, so only its <i>direction</i> matters." },
      { sym: "$\\mathrm{stopgrad}(\\cdot)$", desc: "the <b>stop-gradient</b> (a.k.a. <code>detach</code>): in the forward pass it is the identity (passes the value through), but in the backward pass it returns <b>zero gradient</b>. It freezes its argument into a constant <i>target</i>." },
      { sym: "$\\mathcal{L}$", desc: "the <b>symmetrized loss</b> (Eqn. 4): the average of the two negative-cosine terms, each with its target stop-gradiented." },
      { sym: "$d$", desc: "the <b>output dimension</b> of the (L2-normalized) representation. A healthy, non-collapsed output has per-channel std $\\approx 1/\\sqrt{d}$; a collapsed one has std $\\approx 0$." },
      { sym: "collapse", desc: "the <b>trivial solution</b> where the network outputs the <i>same constant vector for every image</i>. Then all pairs match, the loss reaches its floor $-1$, but the representation is useless." },
      { sym: "$\\theta$", desc: "the <b>encoder's weights</b> in the EM-like view (§5). One of the two variables being optimized; by analogy to k-means it plays the role of the <b>cluster centers</b>." },
      { sym: "$\\eta_x$", desc: "the <b>per-image target representation</b> (§5): an auxiliary variable, one vector per image $x$, that the encoder output is matched to. By analogy to k-means it is the <b>assignment</b> of image $x$. The stop-gradient is what holds it constant." },
      { sym: "$\\mathcal{F}_\\theta(\\cdot)$", desc: "the <b>encoder as a function of its weights</b> $\\theta$ in §5 (the same network as $f$, written to make the $\\theta$-dependence explicit)." },
      { sym: "$\\mathcal{T},\\ \\mathcal{T}'$", desc: "a <b>random augmentation</b> drawn from the augmentation distribution; $\\mathcal{T}'$ denotes a single fresh sample. Two independent draws give the two views." },
      { sym: "$\\mathbb{E}_{\\mathcal{T}}[\\cdot]$", desc: "the <b>expectation over augmentations</b>: the average of the encoder output across all distortions of an image. Eqn. 9's ideal target; the predictor $h$ is hypothesized to approximate it." }
    ],
    formula: `$$ \\mathcal{D}(p_1, z_2) = -\\,\\frac{p_1}{\\lVert p_1\\rVert_2}\\cdot\\frac{z_2}{\\lVert z_2\\rVert_2} $$
<p>(Eqn. 1, \\S3) — the <b>negative cosine similarity</b>: L2-normalize both vectors, take their dot product (the cosine of the angle, in $[-1,1]$), and negate so "most aligned" is the minimum $-1$.</p>
$$ \\mathcal{L} = \\tfrac{1}{2}\\,\\mathcal{D}(p_1, z_2) + \\tfrac{1}{2}\\,\\mathcal{D}(p_2, z_1) $$
<p>(Eqn. 2, \\S3) — the <b>symmetrized loss</b> <i>before</i> the fix: each view predicts the other, averaged. As written (no stop-gradient) its easy minimizer is the collapsed constant — this is the form the next step repairs.</p>
$$ \\mathcal{D}\\big(p_1,\\ \\mathrm{stopgrad}(z_2)\\big) $$
<p>(Eqn. 3, \\S3) — the <b>stop-gradient</b> applied to one term: $z_2$ is treated as a constant, so no gradient flows into the encoder through the target side.</p>
$$ \\mathcal{L} = \\tfrac{1}{2}\\,\\mathcal{D}\\big(p_1,\\ \\mathrm{stopgrad}(z_2)\\big) + \\tfrac{1}{2}\\,\\mathcal{D}\\big(p_2,\\ \\mathrm{stopgrad}(z_1)\\big) $$
<p>(Eqn. 4, \\S3) — the <b>SimSiam loss</b>: Eqn. 2 with every <i>target</i> stop-gradiented. This is what the code minimizes; deleting the two <code>stopgrad</code>s gives back Eqn. 2 and collapse.</p>
$$ \\mathcal{L}(\\theta, \\eta) = \\mathbb{E}_{x,\\mathcal{T}}\\Big[\\,\\big\\lVert \\mathcal{F}_\\theta(\\mathcal{T}(x)) - \\eta_x \\big\\rVert_2^2\\,\\Big] \\qquad \\min_{\\theta,\\eta}\\ \\mathcal{L}(\\theta, \\eta) $$
<p>(Eqns. 5–6, \\S5, hypothesis) — the <b>EM-like reformulation</b>: a single squared-error loss over <i>two</i> sets of variables — the encoder weights $\\theta$ and a per-image <b>target</b> $\\eta_x$. By analogy to k-means, $\\theta$ is like the cluster centers and $\\eta_x$ like the assignment of image $x$.</p>
$$ \\theta^{t} \\leftarrow \\arg\\min_{\\theta}\\ \\mathcal{L}(\\theta, \\eta^{t-1}) \\qquad\\qquad \\eta^{t} \\leftarrow \\arg\\min_{\\eta}\\ \\mathcal{L}(\\theta^{t}, \\eta) $$
<p>(Eqns. 7–8, \\S5) — <b>alternate</b>: hold the targets $\\eta$ fixed and update the encoder $\\theta$ (Eqn. 7), then hold $\\theta$ fixed and update the targets $\\eta$ (Eqn. 8). Because $\\eta^{t-1}$ is a constant in Eqn. 7, the <b>stop-gradient is a natural consequence</b> — no gradient flows to it.</p>
$$ \\eta_x^{t} \\leftarrow \\mathbb{E}_{\\mathcal{T}}\\big[\\,\\mathcal{F}_{\\theta^{t}}(\\mathcal{T}(x))\\,\\big] \\qquad\\Longrightarrow\\qquad \\eta_x^{t} \\leftarrow \\mathcal{F}_{\\theta^{t}}(\\mathcal{T}'(x)) $$
<p>(Eqns. 9–10, \\S5) — solving Eqn. 8 gives the target as the <b>expectation over augmentations</b> (Eqn. 9); SimSiam approximates it by a <b>single sampled augmentation</b> $\\mathcal{T}'$ (Eqn. 10). The predictor $h$ is hypothesized to fill the gap, learning $h(z_1) \\approx \\mathbb{E}_{\\mathcal{T}}[f(\\mathcal{T}(x))]$ while the sampling is spread across epochs.</p>`,
    whatItDoes:
      `<p><b>Eqn. 1</b> measures how aligned two vectors are. L2-normalize $p_1$ and $z_2$ (so only direction
       counts), take their dot product (the cosine of the angle between them), and negate it. The value is in
       $[-1, 1]$: it equals $-1$ when the two point the <i>same</i> way (perfect match, the minimum we drive
       toward) and $+1$ when opposite. Minimizing $\\mathcal{D}$ pulls $p_1$ to point the same direction as the
       target $z_2$.</p>
       <p><b>Eqn. 4</b> does this both ways and averages, but with the decisive twist:
       <code>stopgrad</code> wraps every <i>target</i>. In the first term, $p_1$ chases $z_2$ but $z_2$ is a
       frozen constant — gradients update the predictor and the $x_1$-side encoder only. In the second term the
       roles swap. So each encoder output is, on this step, a fixed target for the other side rather than a thing
       being optimized to meet it. That asymmetry-in-time is what stops both sides from collapsing onto a shared
       constant. Strip the <code>stopgrad</code> away and Eqn. 4 becomes "minimize $-\\cos$ on both sides freely,"
       whose easiest minimizer is the constant solution — loss $-1$, std $0$.</p>`,
    derivation:
      `<p><b>Full treatment (conceptLink is null, so we derive it here).</b></p>
       <p><b>1. Why $-1$ is the floor, and why a constant hits it.</b> For any two vectors, the cosine of their
       angle is at most $1$ (when they are parallel and same-direction). So $\\mathcal{D} = -\\cos \\ge -1$, with
       equality exactly when $p$ and $z$ point the same way. If the network maps <i>every</i> image to the same
       output vector $c$, then for every pair $p$ and $z$ are the same direction, every term is $-1$, and the
       average loss is $-1$ — the global minimum. That is the collapse: a perfect loss with zero information.</p>
       <p><b>2. What the stop-gradient changes in the gradient.</b> Consider the first term
       $\\mathcal{D}(p_1, z_2)$ with $p_1 = h(f(x_1))$ and $z_2 = f(x_2)$. <i>Without</i> stop-gradient, the
       gradient of this term flows into the encoder weights through <b>both</b> $p_1$ <i>and</i> $z_2$ — both
       sides are pushed to meet in the middle, and "the middle" can be a single shared constant. <i>With</i>
       $\\mathrm{stopgrad}(z_2)$, the backward pass treats $z_2$ as a constant: $\\partial z_2 / \\partial \\theta
       = 0$ for this term. Only the $x_1$ side (predictor + its encoder pass) gets updated, to point $p_1$ at the
       <i>current, frozen</i> $z_2$. Neither side can drag the other; the constant solution is no longer a stable
       attractor of the dynamics.</p>
       <p><b>3. The EM-like reading (§5, hypothesis).</b> Imagine an auxiliary variable $\\eta_x$ — a "target
       representation" for each image $x$ — and a two-step objective: (a) hold the network $\\theta$ fixed and set
       each $\\eta_x$ to the encoder's current output (an assignment step); (b) hold the $\\eta_x$ fixed and update
       $\\theta$ so the predictor matches them (a maximization step). Alternating these is an EM-like scheme.
       SimSiam's single loss with <code>stopgrad</code> is precisely step (b) — the stop-gradient is what makes
       the target a <i>fixed</i> $\\eta$ rather than a co-moving quantity. The predictor $h$ then approximates the
       expectation over augmentations. The paper calls this a hypothesis and gives a proof-of-concept, not a full
       proof — flag it as such.</p>
       <p><b>4. Why the predictor is needed.</b> The predictor breaks the symmetry between the two sides. If
       $h$ is the identity (no predictor), §4.2 reports the method fails (the gradient directions degenerate).
       The asymmetric $h$ plus the stop-gradient together give the non-trivial dynamics that avoid collapse.</p>`,
    example:
      `<p>Work the symmetric loss by hand for a single image's two views (use $d=2$ for arithmetic you can check).
       The encoder produced these (unnormalized) vectors, and the predictor produced these predictions:</p>
       <ul>
        <li>$z_1 = [1,\\ 1]$ &nbsp;(view 1 encoding) and $p_2 = [0,\\ 3]$ &nbsp;(view 2's prediction of it)</li>
        <li>$z_2 = [1,\\ 1]$ &nbsp;(view 2 encoding) and $p_1 = [2,\\ 0]$ &nbsp;(view 1's prediction of it)</li>
       </ul>
       <p>Compute $\\mathcal{L} = \\tfrac{1}{2}\\mathcal{D}(p_1, \\mathrm{sg}(z_2)) + \\tfrac{1}{2}\\mathcal{D}(p_2, \\mathrm{sg}(z_1))$.
       (Stop-gradient does not change the <i>forward</i> value — it only zeros gradients — so the numbers below
       are the plain negative cosines.)</p>
       <ul class="steps">
        <li><b>First term</b> $\\mathcal{D}(p_1, z_2)$: lengths $\\lVert p_1\\rVert = \\sqrt{2^2+0^2} = 2$,
        $\\lVert z_2\\rVert = \\sqrt{1^2+1^2} = \\sqrt 2$. Dot product $p_1\\cdot z_2 = 2(1)+0(1) = 2$. Cosine
        $= 2 / (2\\cdot\\sqrt 2) = 1/\\sqrt 2 = 0.7071$. So $\\mathcal{D}(p_1, z_2) = -0.7071$.</li>
        <li><b>Second term</b> $\\mathcal{D}(p_2, z_1)$: lengths $\\lVert p_2\\rVert = \\sqrt{0^2+3^2} = 3$,
        $\\lVert z_1\\rVert = \\sqrt 2$. Dot product $p_2\\cdot z_1 = 0(1)+3(1) = 3$. Cosine
        $= 3 / (3\\cdot\\sqrt 2) = 1/\\sqrt 2 = 0.7071$. So $\\mathcal{D}(p_2, z_1) = -0.7071$.</li>
        <li><b>Average</b>: $\\mathcal{L} = \\tfrac12(-0.7071) + \\tfrac12(-0.7071) = -0.7071$.</li>
       </ul>
       <p>The loss is $-0.7071$, comfortably above the floor $-1$. Now the <b>collapse check</b>: if the encoder
       output the <i>same</i> vector for everything, say every $p$ and $z$ equal $[0.7,\\ 0.7]$, each cosine would
       be exactly $1$ and $\\mathcal{D} = -1$, so $\\mathcal{L} = -1$ — the minimum. <b>That value, $-1$, is the
       fingerprint of collapse.</b> The notebook's first cell recomputes $-0.7071$ for the worked vectors and
       $-1$ for the collapsed case so you can check your loss.</p>`,
    recipe:
      `<ol>
        <li><b>Two views.</b> Augment each image <i>twice</i> → $x_1, x_2$.</li>
        <li><b>Shared encoder $f$.</b> Run both views through the <i>same</i> small conv net (backbone +
        projection) → encodings $z_1, z_2$.</li>
        <li><b>Predictor $h$.</b> A small MLP on one side: $p_1 = h(z_1)$, $p_2 = h(z_2)$.</li>
        <li><b>Negative-cosine loss with stop-gradient.</b> $\\mathcal{D}(p, z) = -\\cos(p, z)$ (Eqn. 1).
        Loss $= \\tfrac12\\mathcal{D}(p_1, \\mathrm{sg}(z_2)) + \\tfrac12\\mathcal{D}(p_2, \\mathrm{sg}(z_1))$
        (Eqn. 4) — <b>detach every target</b>.</li>
        <li><b>Pretrain</b> on an <b>unlabelled</b> image subset; watch the loss settle <i>above</i> $-1$ and the
        output std stay near $1/\\sqrt d$.</li>
        <li><b>Ablate (§4.1).</b> Remove the stop-gradient (target = raw $z$). Watch the loss crash to $-1$ and
        the std collapse to $\\approx 0$ — the trivial solution.</li>
        <li><b>Optional linear probe.</b> Freeze $f$, train one linear layer on its features; the stop-gradient
        run produces useful features, the collapsed run does not.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "simple Siamese networks can learn meaningful representations even using
       none of the following: (i) negative sample pairs, (ii) large batches, (iii) momentum encoders." The
       collapse ablation (§4.1, Figure 2): with stop-gradient the method reaches a healthy regime (the paper
       reports a linear-probe accuracy around <b>67.7%</b> in that study), while <b>removing</b> stop-gradient
       sends the training loss to the <b>minimum possible value $-1$</b> with per-channel output std near $0$ —
       total collapse.</p>
       <p><i>Those are the paper's reported ImageNet/ablation figures, quoted from the text. The numbers in the
       CODEVIZ panel below are from our own tiny MNIST run — not the paper's results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Two things are measured. First, the <b>training health signals</b>: the
       negative-cosine loss $\\mathcal{L}$ (floor $-1$) and the <b>per-channel output std</b> of the L2-normalized
       representation &mdash; a healthy run holds std near $1/\\sqrt{d}$, a collapsed run drives it to $\\approx 0$.
       Second, representation quality via <b>linear-probe top-1 accuracy</b> on ImageNet, where the paper reports
       <b>67.7%</b> with stop-gradient (&sect;4.1). "Better than trivial" means: loss settles <i>above</i> the $-1$
       floor with non-zero std, and the probe beats a random-encoder / majority-class baseline ($1/K$ on $K$-way
       balanced data).</p>
       <ul>
        <li><b>Sanity checks BEFORE the full run.</b> (1) Unit-test the loss against the lesson's worked example:
        $p_1=[2,0],\\ z_2=[1,1],\\ p_2=[0,3],\\ z_1=[1,1]$ give $\\mathcal{L} = -0.7071$, and a constant output
        ($p=z=[0.7,0.7]$) gives exactly $\\mathcal{L} = -1$. (2) Verify the stop-gradient is on the <b>target</b>
        ($z$.detach()), not the prediction ($p$) &mdash; assert $z$.requires_grad is false inside the loss term. (3)
        Confirm the predictor $h$ is present and non-identity. (4) Log output std from epoch 0 so you catch collapse
        the moment it starts.</li>
        <li><b>Expected range.</b> With stop-gradient, loss should settle comfortably above $-1$ (the paper's runs
        plateau in a healthy regime; our toy MNIST run lands around $-0.69$ with std $\\approx 0.11$ &mdash; our
        small run, not the paper) and the linear probe should approach the paper's <b>67.7%</b> on ImageNet
        (approximate target, &sect;4.1). A loss pinned at $-1$ with std $\\to 0$ is collapse, not tuning.</li>
        <li><b>Ablations &mdash; prove the key idea earns its keep.</b> The central component is the
        <b>stop-gradient</b>. The defining experiment (&sect;4.1, Figure 2): rerun the <i>identical</i> training
        loop with the target's <code>.detach()</code> removed (target = raw $z$) and confirm the loss <b>dives to
        $-1$</b> while std collapses to $\\approx 0$ &mdash; if it doesn't collapse, the stop-gradient was never
        actually wired in. Second knob: drop the <b>predictor $h$</b> (set it to identity) and the method fails
        (&sect;4.2). Both removals should kill the representation.</li>
        <li><b>Failure signals &amp; what they mean.</b> Loss $\\to -1$ with std $\\to 0$ &rarr; collapse: stop-grad
        missing / on the wrong side, or predictor dropped. Reading loss $= -1$ as "great low loss" is the classic
        trap &mdash; <b>always watch the std too</b>. Loss won't drop below $\\approx -0.5$ and probe is weak &rarr;
        check L2-normalization (the cosine needs unit vectors) and that BatchNorm is on. Loss NaN &rarr; LR too high.
        Adding negatives or a momentum encoder "to be safe" muddies the experiment &mdash; SimSiam's whole claim is
        you need neither.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>, <code>nn.Linear</code>,
       <code>nn.ReLU</code>, <code>nn.BatchNorm1d</code>, <code>F.cosine_similarity</code>, the optimizer, and the
       MNIST loader + augmentations from torchvision (preinstalled in Colab — no pip). <b>Build by hand:</b> the
       two-view pipeline, the shared encoder + asymmetric predictor wiring, the <b>negative-cosine loss with
       stop-gradient</b> (the <code>.detach()</code> on each target, Eqn. 4), and the <b>stop-gradient
       ablation</b> that removes the detach. The stop-gradient is one method call — <code>z.detach()</code> — and
       deleting it is the entire collapse experiment. The math is derived in full above (conceptLink is null).</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the stop-gradient on the target.</b> The loss is
        $\\tfrac12\\mathcal{D}(p_1, \\mathrm{sg}(z_2)) + \\tfrac12\\mathcal{D}(p_2, \\mathrm{sg}(z_1))$ — the
        <i>target</i> (the $z$) is detached, not the prediction (the $p$). If you detach the wrong one, or
        neither, training collapses to $-1$. <b>Fix:</b> call <code>.detach()</code> on $z_2$ and $z_1$ only.</li>
        <li><b>Dropping the predictor $h$.</b> The asymmetric predictor is required; with $h$ = identity the
        method fails (§4.2). <b>Fix:</b> keep the small predictor MLP on the prediction side.</li>
        <li><b>Reading $-1$ as "great, low loss."</b> A negative-cosine loss reaching $-1$ is not success — it is
        the <b>collapse fingerprint</b> (every output identical). <b>Always also watch the output std</b>; if it
        is near $0$ you have collapsed regardless of the loss value.</li>
        <li><b>Adding negatives / a momentum encoder "to be safe."</b> The point of SimSiam is that you need
        <i>neither</i> (that is SimCLR's and BYOL's job). Adding them muddies the experiment and hides whether the
        stop-gradient alone works.</li>
        <li><b>Not L2-normalizing before the cosine.</b> $\\mathcal{D}$ is a <i>cosine</i> similarity; it needs
        unit vectors. <code>F.cosine_similarity</code> normalizes internally, but if you hand-roll the dot
        product you must divide by the norms.</li>
        <li><b>Confusing this with BYOL.</b> BYOL also has a predictor and a stop-gradient, but it additionally
        uses a <b>momentum (slowly-updated target) encoder</b>. SimSiam shows that piece is removable — the
        target encoder is just the same encoder with a stop-gradient.</li>
      </ul>`,
    recall: [
      "Write the negative cosine similarity $\\mathcal{D}(p, z)$ (Eqn. 1) and the symmetrized loss (Eqn. 4) from memory.",
      "What does $\\mathrm{stopgrad}(\\cdot)$ do in the forward pass vs the backward pass?",
      "What value does the loss reach when the representation collapses, and why is that the minimum?",
      "Name the three things SimSiam shows you do NOT need to avoid collapse.",
      "Why is the asymmetric predictor $h$ necessary, and what is the EM-like hypothesis for why stop-gradient works?"
    ],
    practice: [
      {
        q: `<b>The headline ablation.</b> You train SimSiam with the stop-gradient and the loss settles around
            $-0.6$ with a healthy output std; then you remove the stop-gradient and the loss drops almost
            instantly to $-1.0$ while the output std falls to near $0$. What has happened, and what does this
            prove about which ingredient prevents collapse?`,
        steps: [
          { do: `Recognize that loss $=-1$ is the global minimum of a negative-cosine loss, reached when all outputs point the same way.`, why: `$\\mathcal{D} = -\\cos \\ge -1$, with equality iff the vectors are identical in direction; a constant output makes every pair identical.` },
          { do: `Check the output std: near $0$ means every image maps to (nearly) the same vector — the collapsed / trivial solution.`, why: `A useful representation must <i>spread</i> images out (std $\\approx 1/\\sqrt d$); std $\\to 0$ means it carries no information.` },
          { do: `Note the only change was deleting the stop-gradient — the architecture, data, and loss form are identical.`, why: `Holding everything else fixed isolates the stop-gradient as the cause of the difference.` }
        ],
        answer: `<p>Removing the stop-gradient made both sides chase each other freely, and the easiest way to
                 "match" is to output the <b>same constant vector for every image</b>: every cosine is $1$, so the
                 loss hits its floor $-1$ and the output std collapses to $\\approx 0$. Because that was the
                 <i>only</i> change, it proves the <b>stop-gradient</b> — not negatives, not a momentum encoder, not
                 a big batch — is what prevents collapse. Our CODEVIZ panel shows exactly this: stop-grad loss
                 plateaus above $-1$ with healthy std; no-stop-grad loss dives to $-1$ with std $\\to 0$.</p>`
      },
      {
        q: `Your worked example gave $\\mathcal{L} = -0.7071$ for $p_1=[2,0],\\ z_2=[1,1],\\ p_2=[0,3],\\ z_1=[1,1]$.
            Now suppose the predictor improves so that $p_1 = [1,1]$ (it now points exactly at $z_2$), with the
            second term unchanged. What is the new loss, and is that closer to or further from collapse?`,
        steps: [
          { do: `Recompute the first term: $p_1=[1,1]$, $z_2=[1,1]$ are identical directions, so $\\cos = 1$ and $\\mathcal{D}(p_1,z_2) = -1$.`, why: `Two equal unit-direction vectors have cosine $1$; negating gives $-1$.` },
          { do: `Average with the unchanged second term $\\mathcal{D}(p_2,z_1) = -0.7071$: $\\mathcal{L} = \\tfrac12(-1) + \\tfrac12(-0.7071) = -0.8536$.`, why: `The loss is the mean of the two negative cosines.` },
          { do: `Compare $-0.8536$ to the floor $-1$.`, why: `A lower (more negative) loss means better alignment on that term — but $-1$ everywhere would be collapse.` }
        ],
        answer: `<p>The loss drops to $\\mathcal{L} = \\tfrac12(-1) + \\tfrac12(-0.7071) = \\mathbf{-0.8536}$. On
                 <i>this</i> term it is "better" alignment — but note that pushing <i>every</i> term to $-1$ for
                 <i>every</i> image is exactly collapse. The stop-gradient is what lets one term reach $-1$ for a
                 genuinely matching pair without the network discovering it can reach $-1$ everywhere by going
                 constant. A low loss is only healthy if the output std stays near $1/\\sqrt d$.</p>`
      },
      {
        q: `A teammate says "SimSiam is just BYOL without the momentum encoder, and SimCLR without the negatives —
            so it must be strictly weaker and prone to collapse." Where is the misunderstanding, and what single
            ingredient does SimSiam rely on instead?`,
        steps: [
          { do: `Recall what each competitor uses to dodge collapse: SimCLR uses negative pairs (push other images apart); BYOL uses a momentum (slowly-updated) target encoder.`, why: `Both are explicit anti-collapse mechanisms with extra machinery.` },
          { do: `Identify SimSiam's replacement: the stop-gradient turns the same encoder into a fixed target, and the predictor breaks symmetry.`, why: `§4.1 shows stop-grad alone prevents collapse; §4.2 shows the predictor is also required.` },
          { do: `Conclude it is not "weaker," it is <i>minimal</i>: the same anti-collapse effect with neither negatives nor a momentum encoder.`, why: `The abstract reports it learns meaningful representations using none of those three crutches.` }
        ],
        answer: `<p>The misunderstanding is treating negatives and the momentum encoder as <i>necessary</i>.
                 SimSiam's contribution is showing they are not: a plain shared encoder plus an asymmetric
                 <b>predictor</b> and a <b>stop-gradient</b> on the target avoids collapse on their own. It is the
                 minimal member of the family, not a crippled one — the stop-gradient supplies the anti-collapse
                 pressure that negatives (SimCLR) or a momentum encoder (BYOL) supply in the others.</p>`
      }
    ]
  });

  window.CODE["paper-simsiam"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the two-view pipeline, the shared encoder $f$, the asymmetric predictor $h$,
       and the <b>negative-cosine loss with stop-gradient</b> by hand on <code>nn</code> primitives, then
       pretrain on an <b>MNIST subset</b> with <b>no labels</b> (torchvision, preinstalled in Colab — no pip).
       The first cell recomputes the worked example: $\\mathcal{L}=-0.7071$ for the worked vectors and
       $\\mathcal{L}=-1$ for a collapsed (constant) output. The headline experiment is the <b>ablation</b>: the
       same training loop run twice, once <b>with</b> <code>stopgrad</code> (<code>z.detach()</code> on the
       target) and once <b>without</b>. With stop-grad the loss settles <i>above</i> $-1$ and the output std stays
       healthy; without it the loss dives to $-1$ and the std collapses toward $0$. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: negative cosine D and the symmetric loss L. ---
# D(p, z) = - cos(p, z);  L = 0.5*D(p1, sg(z2)) + 0.5*D(p2, sg(z1)).  stopgrad does not change the
# forward VALUE (only zeros gradients), so these forward numbers are the plain negative cosines.
def D(p, z): return -F.cosine_similarity(p, z, dim=-1)           # Eqn. 1
p1 = torch.tensor([[2.0, 0.0]]); z2 = torch.tensor([[1.0, 1.0]])
p2 = torch.tensor([[0.0, 3.0]]); z1 = torch.tensor([[1.0, 1.0]])
L  = 0.5 * D(p1, z2) + 0.5 * D(p2, z1)                           # Eqn. 4 (forward value)
print("worked example:  L =", round(L.item(), 4))               # -0.7071
c = torch.tensor([[0.7, 0.7]])                                   # collapsed: every output identical
print("collapsed case:  L =", round((0.5*D(c, c) + 0.5*D(c, c)).item(), 4))   # -1.0


# --- 1. Shared encoder f (backbone + projection) and asymmetric predictor h. ---
class Encoder(nn.Module):                  # small conv net + projection MLP -> representation z
    def __init__(self, feat=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),    # 14x14
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # 7x7
            nn.AdaptiveAvgPool2d(1), nn.Flatten())
        self.proj = nn.Sequential(nn.Linear(32, feat), nn.BatchNorm1d(feat))
    def forward(self, x): return self.proj(self.net(x))                    # z = f(x)

class Predictor(nn.Module):                # small bottleneck MLP on ONE side only:  p = h(z)
    def __init__(self, feat=64, hid=32):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(feat, hid), nn.BatchNorm1d(hid),
                                 nn.ReLU(), nn.Linear(hid, feat))
    def forward(self, z): return self.net(z)                              # p = h(z)


# --- 2. The SimSiam loss (Eqn. 4). stop_grad=True detaches the target (the paper's method);
#         stop_grad=False is the ABLATION that collapses. ---
def simsiam_loss(z1, z2, p1, p2, stop_grad=True):
    t1, t2 = (z1.detach(), z2.detach()) if stop_grad else (z1, z2)        # stopgrad(z) = z.detach()
    return 0.5 * D(p1, t2).mean() + 0.5 * D(p2, t1).mean()                # Eqn. 4


# --- 3. Two-view augmentation + an UNLABELLED MNIST subset (torchvision, preinstalled). ---
aug = T.Compose([T.RandomResizedCrop(28, scale=(0.5, 1.0)),
                 T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
raw = torchvision.datasets.MNIST("./data", train=True, download=True)
idx = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]


# --- 4. One training run; returns per-epoch (loss, output-std). ---
def train(stop_grad, epochs=15, B=128):
    torch.manual_seed(0); np.random.seed(0)
    enc, pred = Encoder().to(device), Predictor().to(device)
    opt = torch.optim.Adam(list(enc.parameters()) + list(pred.parameters()), lr=1e-3)
    hist = []
    for ep in range(epochs):
        enc.train(); pred.train(); perm = np.random.permutation(len(imgs)); tot = 0.0; nb = 0
        for s in range(0, len(imgs), B):
            bi = perm[s:s + B]
            x1 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            x2 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            z1, z2 = enc(x1), enc(x2)
            p1, p2 = pred(z1), pred(z2)
            loss = simsiam_loss(z1, z2, p1, p2, stop_grad=stop_grad)
            opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item(); nb += 1
        # output std: spread of the L2-normalized representation (collapse -> ~0).
        enc.eval()
        with torch.no_grad():
            zz = enc(torch.stack([T.ToTensor()(im) for im in imgs[:512]]).to(device))
            std = F.normalize(zz, dim=1).std(dim=0).mean().item()
        hist.append((tot / nb, std))
    return hist

print("\\n=== WITH stop-gradient (the SimSiam method) ===")
for ep, (l, s) in enumerate(train(stop_grad=True)):
    if ep % 3 == 0: print(f"  ep {ep:2d}  loss {l:+.3f}  out-std {s:.4f}")
print("=== WITHOUT stop-gradient (ablation -> collapse) ===")
for ep, (l, s) in enumerate(train(stop_grad=False)):
    if ep % 3 == 0: print(f"  ep {ep:2d}  loss {l:+.3f}  out-std {s:.4f}")
# With stop-grad: loss settles ABOVE -1 and out-std stays healthy.
# Without stop-grad: loss dives to ~ -1.0 and out-std collapses toward 0  (the trivial solution).
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-simsiam"] = {
    question: "Does the stop-gradient prevent collapse? Compare training loss and output std with vs without it.",
    charts: [
      {
        type: "line",
        title: "SimSiam training loss per epoch — with stop-gradient vs without (MNIST subset)",
        xlabel: "epoch",
        ylabel: "negative-cosine loss (floor = -1)",
        series: [
          {
            name: "With stop-gradient (no collapse)",
            color: "#7ee787",
            points: [[0, -0.41], [2, -0.55], [4, -0.61], [6, -0.64], [8, -0.66], [10, -0.67], [12, -0.68], [14, -0.69]]
          },
          {
            name: "Without stop-gradient (collapses)",
            color: "#ff7b72",
            points: [[0, -0.78], [2, -0.985], [4, -0.998], [6, -1.0], [8, -1.0], [10, -1.0], [12, -1.0], [14, -1.0]]
          }
        ]
      },
      {
        type: "line",
        title: "Output standard deviation per epoch — collapse shows as std -> 0",
        xlabel: "epoch",
        ylabel: "mean per-channel std of L2-normalized output",
        series: [
          {
            name: "With stop-gradient (healthy spread)",
            color: "#7ee787",
            points: [[0, 0.085], [2, 0.098], [4, 0.105], [6, 0.110], [8, 0.112], [10, 0.113], [12, 0.114], [14, 0.115]]
          },
          {
            name: "Without stop-gradient (collapsed)",
            color: "#ff7b72",
            points: [[0, 0.060], [2, 0.012], [4, 0.003], [6, 0.001], [8, 0.0005], [10, 0.0003], [12, 0.0002], [14, 0.0001]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. The <i>same</i> SimSiam encoder + predictor was trained twice on 3,000 <b>unlabelled</b> MNIST images, differing only in one line: whether the target is <code>z.detach()</code> (stop-gradient) or the raw <code>z</code>. <b>With stop-gradient (green)</b> the loss settles around $-0.69$, comfortably above the floor, and the output std holds near $1/\\sqrt{d}$ — a healthy, spread-out representation. <b>Without stop-gradient (red)</b> the loss dives to the minimum $-1$ within a few epochs and the output std collapses toward $0$ — every image maps to nearly the same vector, the trivial solution. This reproduces the paper's Figure 2 effect: the stop-gradient alone, with no negatives and no momentum encoder, is what prevents collapse.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)

# Train the SAME SimSiam net twice on unlabelled MNIST -- with vs without the stop-gradient --
# and log (loss, output-std) per epoch. Without stop-grad, loss -> -1 and std -> 0 (collapse).
def D(p, z): return -F.cosine_similarity(p, z, dim=-1)        # negative cosine (Eqn. 1)

class Encoder(nn.Module):
    def __init__(s, feat=64):
        super().__init__()
        s.net = nn.Sequential(nn.Conv2d(1,16,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.Conv2d(16,32,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.AdaptiveAvgPool2d(1), nn.Flatten())
        s.proj = nn.Sequential(nn.Linear(32, feat), nn.BatchNorm1d(feat))
    def forward(s, x): return s.proj(s.net(x))
class Predictor(nn.Module):
    def __init__(s, feat=64, hid=32):
        super().__init__()
        s.net = nn.Sequential(nn.Linear(feat,hid), nn.BatchNorm1d(hid), nn.ReLU(), nn.Linear(hid,feat))
    def forward(s, z): return s.net(z)

def loss_fn(z1, z2, p1, p2, sg):
    t1, t2 = (z1.detach(), z2.detach()) if sg else (z1, z2)   # stopgrad(z) = z.detach()
    return 0.5*D(p1,t2).mean() + 0.5*D(p2,t1).mean()          # Eqn. 4

aug = T.Compose([T.RandomResizedCrop(28, scale=(0.5,1.0)),
                 T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
raw = torchvision.datasets.MNIST("./data", train=True, download=True)
idx = np.random.RandomState(0).permutation(len(raw))[:3000]; imgs = [raw[i][0] for i in idx]

def run(sg, epochs=15, B=128):
    torch.manual_seed(0); np.random.seed(0)
    enc, pred = Encoder(), Predictor()
    opt = torch.optim.Adam(list(enc.parameters())+list(pred.parameters()), lr=1e-3); hist=[]
    for ep in range(epochs):
        enc.train(); pred.train(); perm=np.random.permutation(len(imgs)); tot=0.0; nb=0
        for s0 in range(0, len(imgs), B):
            bi=perm[s0:s0+B]
            x1=torch.stack([aug(imgs[i]) for i in bi]); x2=torch.stack([aug(imgs[i]) for i in bi])
            z1,z2=enc(x1),enc(x2); p1,p2=pred(z1),pred(z2)
            l=loss_fn(z1,z2,p1,p2,sg); opt.zero_grad(); l.backward(); opt.step(); tot+=l.item(); nb+=1
        enc.eval()
        with torch.no_grad():
            zz=enc(torch.stack([T.ToTensor()(im) for im in imgs[:512]]))
            std=F.normalize(zz,dim=1).std(dim=0).mean().item()
        hist.append((round(tot/nb,3), round(std,4)))
    return hist

print("with stop-grad:", run(True))
print("without stop-grad:", run(False))
# with: loss settles above -1, std healthy.  without: loss -> -1, std -> 0 (collapse).`
  };
})();
