/* Paper lesson — "Emerging Properties in Self-Supervised Vision Transformers" (DINO),
   Mathilde Caron, Hugo Touvron, Ishan Misra, Hervé Jégou, Julien Mairal, Piotr Bojanowski,
   Armand Joulin — Facebook AI Research, Inria, Sorbonne University, 2021.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-dino".
   GROUNDED from arXiv:2104.14294 (abstract) and the ar5iv HTML mirror (Section 3 Method:
   softmax-with-temperature P_s / P_t Eqn. 1; cross-entropy distillation loss Eqn. 2; multi-crop
   loss Eqn. 3; center update Eqn. 4; teacher EMA in Algorithm 1; Section 5.3 collapse analysis with
   the H = h(P_t) + D_KL(P_t || P_s) decomposition Eqn. 5). Track B (architecture): build the
   student/momentum-teacher self-distillation pipeline — softmax-with-temperature, centering +
   sharpening of the teacher, cross-entropy loss, EMA teacher — by hand on nn primitives; pretrain on
   an MNIST subset WITHOUT labels; linear probe beats from-scratch; ablation removing CENTERING
   collapses the teacher distribution. No conceptLink. Cross-links paper-byol (self-distillation, no
   labels, EMA target). */
(function () {
  window.LESSONS.push({
    id: "paper-dino",
    title: "DINO — Emerging Properties in Self-Supervised Vision Transformers (2021)",
    tagline: "A student matches a momentum-teacher's output distribution with no labels; centering + sharpening stop collapse.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Mathilde Caron, Hugo Touvron, Ishan Misra, Hervé Jégou, Julien Mairal, Piotr Bojanowski, Armand Joulin",
      org: "Facebook AI Research, Inria, Sorbonne University",
      year: 2021,
      venue: "arXiv:2104.14294 (Apr 2021); ICCV 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2104.14294",
      code: "https://github.com/facebookresearch/dino"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["unl-simclr", "paper-byol", "ml-softmax", "dl-cross-entropy", "pt-cnn", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>By 2021, self-supervised learning — training image features with <b>no labels</b> — had a working
       recipe: make two distorted copies (called <b>views</b>) of one image and pull their representations
       together. <b>BYOL</b> (see <b>paper-byol</b>) showed you can even drop the "push other images apart"
       step (the <b>negatives</b>) and still avoid <b>collapse</b> — the failure where the network outputs
       the <i>same</i> constant vector for every image, making every pair trivially match while learning
       nothing.</p>
       <p>Two things were unresolved (§1). First, those methods were studied mostly on <b>convolutional</b>
       networks; the <b>Vision Transformer</b> (ViT, see <b>mod-vit</b>) — which cuts an image into patches
       and runs self-attention over them — had just arrived, and nobody had a clean self-supervised recipe
       built <i>for</i> it. Second, the negative-free methods used a grab-bag of tricks (a predictor head, a
       stop-gradient, an exponential-moving-average target). DINO asks: is there a <b>simpler</b> way to
       phrase "the student should agree with a slow teacher" that works especially well on ViT — and what
       <i>emerges</i> in the features when you do?</p>`,
    contribution:
      `<ul>
        <li><b>DINO = self-<u>DI</u>stillation with <u>NO</u> labels.</b> A <b>student</b> network is trained
        so its output <b>probability distribution</b> matches a <b>teacher</b> network's output distribution,
        measured by <b>cross-entropy</b>. There are no labels and no negatives — only "match the teacher."</li>
        <li><b>A momentum teacher built from the student, kept from collapsing by CENTERING + SHARPENING.</b>
        The teacher is an exponential-moving-average (EMA) copy of the student. To stop the no-label loss
        from collapsing, DINO applies two cheap operations to the teacher's output: <b>centering</b>
        (subtract a running mean — stops one output dimension from dominating) and <b>sharpening</b> (a low
        softmax <b>temperature</b> — stops the output from flattening to uniform). The two push in opposite
        directions and balance each other (§3, §5.3).</li>
        <li><b>Multi-crop, and emergent ViT properties.</b> Many small <b>local crops</b> plus a few large
        <b>global crops</b> are fed to the student; only global crops go to the teacher (Eqn. 3). The paper's
        headline finding (§1, abstract): a self-supervised ViT's attention maps contain explicit
        <b>object segmentation</b>, and its frozen features are an excellent <b>k-nearest-neighbour</b>
        classifier — properties that do <i>not</i> emerge the same way with labels or with conv nets.</li>
      </ul>`,
    whyItMattered:
      `<p>DINO gave the self-supervised-ViT field its reference recipe and is the "DINO" that DINOv2 and a
       whole line of foundation-vision encoders are named after. Two results made it famous (abstract, §1):
       (1) <b>without any labels</b>, the self-attention of the [CLS] token in a ViT highlights object
       boundaries — you can read a rough segmentation straight off the attention map; and (2) DINO features
       reach strong ImageNet accuracy under both a <b>linear probe</b> and a simple <b>k-NN</b> classifier.
       It also distilled negative-free SSL down to one clean idea — <b>cross-entropy to a centered,
       sharpened momentum teacher</b> — that is much easier to reason about than the predictor/stop-grad
       machinery of BYOL while solving the same collapse problem a different way.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§3 (Method) + Figure 2 + Algorithm 1</b> — the whole loop fits on one page. The four equations
        you will transcribe are here: the <b>softmax-with-temperature</b> for the student/teacher
        distributions $P_s, P_t$ (Eqn. 1), the <b>cross-entropy loss</b> $H(P_t,P_s)$ (Eqn. 2), the
        <b>multi-crop</b> sum over global/local views (Eqn. 3), and the <b>center update</b> (Eqn. 4). The
        teacher's <b>EMA</b> weight update is the <code>ema</code> line of Algorithm 1.</li>
        <li><b>§5.3 (Avoiding collapse)</b> — the key analysis. The cross-entropy decomposes as
        $H(P_t,P_s)=h(P_t)+D_{KL}(P_t\\Vert P_s)$ (Eqn. 5); centering and sharpening act on the
        teacher-entropy term $h(P_t)$ in <i>opposite</i> directions, and Figure 6 shows what happens when you
        drop one of them (the loss converges to $\\ln K$ — uniform collapse — or the KL term goes to $0$).</li>
       </ul>
       <p><b>Skim:</b> §4 (the big ImageNet / segmentation / retrieval tables and the ViT-vs-ResNet
       comparisons), the appendix hyperparameter grids, and the distillation-interpretation discussion —
       unless you want the empirical scaling story. The core you must understand is the §3 loop and the
       §5.3 collapse argument.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>DINO trains the student to match the teacher's output <i>distribution</i> with cross-entropy, and
       there are <b>no labels and no negatives</b>. As in BYOL, the obvious cheat is <b>collapse</b>: if the
       teacher always outputs the <i>same</i> distribution for every image, the student can match it trivially
       and the loss is low while nothing is learned. DINO's defense is two operations on the teacher only:
       <b>centering</b> (subtract a running mean of teacher outputs) and <b>sharpening</b> (a small
       temperature).</p>
       <p>Before you run it: if you keep sharpening but <b>remove centering</b>, do you expect the teacher's
       output distribution to (a) stay healthy and spread across many images, or (b) collapse so that one
       output dimension dominates for <i>every</i> image? Write your guess and one sentence of reasoning, then
       run the no-centering ablation and watch the teacher's per-image entropy.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Two views.</b> For each image, augment it <i>twice</i> to get views $x_1, x_2$ (DINO uses many
        crops; we use two to keep it tiny). Both go to the student; both go to the teacher.</li>
        <li><b>Student.</b> Encoder + projection head giving a length-$K$ logit vector. TODO: turn logits into
        a distribution $P_s$ with a softmax at temperature $\\tau_s$ (Eqn. 1).</li>
        <li><b>Teacher (EMA, stop-gradient).</b> A copy of the student updated only by EMA. TODO: take the
        teacher logits, <b>subtract the center</b> $c$ (centering), then softmax at a <i>small</i>
        $\\tau_t$ (sharpening) to get $P_t$. Wrap in <code>torch.no_grad()</code>.</li>
        <li><b>Loss.</b> TODO: cross-entropy $H(P_t,P_s)=-\\sum_k P_t^{(k)}\\log P_s^{(k)}$ (Eqn. 2),
        with the teacher view paired against the <i>other</i> student view; symmetrize over the two pairings.</li>
        <li><b>Center update.</b> TODO: after each step, $c \\leftarrow m\\,c + (1-m)\\,\\overline{g_t}$, the
        EMA of the batch-mean teacher logits (Eqn. 4).</li>
        <li><b>EMA teacher.</b> TODO: after the student step, $\\theta_t \\leftarrow \\lambda\\,\\theta_t + (1-\\lambda)\\,\\theta_s$.</li>
       </ul>
       <p>Then freeze the student encoder, train a one-line <code>nn.Linear</code> probe, compare to
       from-scratch, and run the <b>no-centering</b> ablation to watch the teacher distribution collapse.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>DINO (§3) keeps <b>two</b> networks of the same shape: a <b>student</b> $g_{\\theta_s}$ and a
       <b>teacher</b> $g_{\\theta_t}$. Each maps an image to a length-$K$ vector of raw scores
       (<b>logits</b>). $K$ is just the width of the output head (a few thousand in the paper) — these are
       <i>not</i> class labels; they are arbitrary coordinates, and the network learns to use them.</p>
       <p>Take one image and make several <b>views</b>: a couple of large <b>global crops</b> and several
       small <b>local crops</b> (the <b>multi-crop</b> strategy). All views go to the student; only the global
       views go to the teacher. The learning goal: <b>the student's output distribution for one view should
       match the teacher's output distribution for another view of the same image.</b> No labels, no other
       images, no negatives.</p>
       <p>To turn logits into a distribution we apply a <b>softmax with temperature</b> (Eqn. 1). Softmax
       exponentiates each logit and normalizes so the $K$ numbers are positive and sum to $1$ — a probability
       distribution (this is the <b>ml-softmax</b> lesson's operation). The <b>temperature</b> $\\tau$ divides
       the logits first: a <i>small</i> $\\tau$ makes the distribution <b>sharp</b> (peaky, confident); a
       <i>large</i> $\\tau$ makes it <b>flat</b> (spread out). The student uses temperature $\\tau_s$; the
       teacher uses a <i>smaller</i> $\\tau_t$ — that is the <b>sharpening</b>.</p>
       <p>The loss is the <b>cross-entropy</b> $H(P_t,P_s) = -\\sum_k P_t^{(k)} \\log P_s^{(k)}$ (Eqn. 2): it
       is smallest when the student distribution $P_s$ puts its probability mass exactly where the teacher
       distribution $P_t$ does (this is the same cross-entropy as in <b>dl-cross-entropy</b>, but the target
       is a soft teacher distribution, not a one-hot label). The teacher is treated as a fixed target —
       <b>stop-gradient</b> — so gradients flow only into the student $\\theta_s$.</p>
       <p>Where does the teacher come from? It is an <b>exponential moving average</b> (EMA) of the student:
       after each student step, $\\theta_t \\leftarrow \\lambda\\,\\theta_t + (1-\\lambda)\\,\\theta_s$ with
       $\\lambda$ close to $1$, so the teacher is a slow, stable version of the student (the same
       <b>momentum / EMA target</b> idea as BYOL — see <b>paper-byol</b> — but here the student matches a
       <i>distribution</i> with cross-entropy instead of a vector with MSE).</p>
       <p>Now the collapse problem and DINO's two-part fix (§3, §5.3). With no negatives, the loss is happy if
       the teacher emits the <i>same</i> distribution for every image. Two trivial-but-bad teacher
       distributions exist: (a) <b>one dimension dominates</b> (always near-one-hot on the same coordinate),
       or (b) <b>uniform</b> (every dimension $1/K$). DINO blocks both with operations on the <i>teacher
       only</i>:</p>
       <ul>
        <li><b>Centering</b> — subtract a running mean $c$ from the teacher logits before the softmax. This
        stops any single dimension from dominating across the batch (it removes the part of the output that is
        the same for every image). On its own, centering <i>encourages</i> the uniform collapse (b).</li>
        <li><b>Sharpening</b> — the small teacher temperature $\\tau_t$. A peaky teacher pushes <i>away</i>
        from uniform. On its own, sharpening <i>encourages</i> the one-dimension collapse (a).</li>
       </ul>
       <p>Used together they <b>cancel</b>: centering fights (a), sharpening fights (b), and the teacher
       distribution stays spread across images and informative. The center is itself updated by an EMA of the
       batch-mean teacher logits (Eqn. 4). After pretraining you <b>freeze</b> the student encoder and read
       its features with a <b>linear probe</b> or k-NN — the standard label-free evaluation.</p>`,
    architecture:
      `<p>DINO is two identical-shape networks plus a few scalar operations — no labels, no negatives, no
       memory bank (§3).</p>
       <ul>
        <li><b>Backbone (student and teacher).</b> Both $g_{\\theta_s}$ and $g_{\\theta_t}$ are the <b>same
        architecture</b> with different weights. The paper's main model is a <b>Vision Transformer (ViT)</b>:
        the image is cut into non-overlapping <b>patches</b> (16×16 or 8×8), each patch is linearly embedded,
        a learned <b>[CLS] token</b> is prepended, position embeddings are added, and a stack of
        Transformer self-attention blocks runs over the sequence. The representation used downstream is the
        <b>[CLS]-token output</b>. (DINO also works with a ResNet backbone; ViT is the headline.)</li>
        <li><b>Projection head.</b> On top of the backbone sits a <b>3-layer MLP</b> (hidden dim 2048) with
        GELU, then $\\ell_2$-normalization, then a weight-normalized linear layer to <b>$K$ output logits</b>.
        Paper default <b>$K = 65536$</b>. These $K$ logits — <i>not</i> the backbone features — are what the
        softmax-with-temperature acts on. The head is <b>discarded after pretraining</b>; only the backbone is
        kept for evaluation.</li>
        <li><b>Multi-crop data flow.</b> From one image, build <b>2 global crops</b> ($224^2$, &gt;50% area)
        and <b>several local crops</b> ($96^2$, &lt;50% area). <b>All</b> crops (the set $V$) go through the
        <b>student</b>; <b>only the 2 global crops</b> go through the <b>teacher</b> (Eqn. 3). This
        "local-to-global" correspondence is the learning signal: small local views must predict the teacher's
        view of the whole object.</li>
        <li><b>Teacher branch.</b> Teacher logits are <b>centered</b> (subtract $c$) then <b>sharpened</b>
        (small $\\tau_t$) before softmax (Eqn. 1), all under <b>stop-gradient</b>. The teacher's weights are
        never trained by backprop — they are an <b>EMA</b> of the student, $\\theta_t\\leftarrow\\lambda\\theta_t
        +(1-\\lambda)\\theta_s$, with $\\lambda$ on a cosine schedule $0.996\\to 1$.</li>
        <li><b>Loss + two EMAs per step.</b> Cross-entropy (Eqn. 2) couples each teacher (global) view to each
        <i>other</i> student view and is symmetrized. After the student gradient step, two EMA updates run with
        no gradients: the <b>center</b> $c$ (Eqn. 4, momentum $m$) and the <b>teacher weights</b> $\\theta_t$
        (momentum $\\lambda$).</li>
       </ul>
       <p>Our demo shrinks this to fit a CPU notebook: a small conv encoder instead of a ViT, $K=256$, and two
       global-style views instead of full multi-crop — but the wiring (student/teacher, centering, sharpening,
       cross-entropy, center EMA, teacher EMA) is identical.</p>`,
    symbols: [
      { sym: "$g_{\\theta_s},\\ g_{\\theta_t}$", desc: "the <b>student</b> and <b>teacher</b> networks (encoder + projection head). Same shape, different weights. Each outputs a length-$K$ vector of raw scores (logits)." },
      { sym: "$\\theta_s,\\ \\theta_t$", desc: "the student / teacher <b>weights</b>. Only $\\theta_s$ is trained by gradient descent; $\\theta_t$ is updated by EMA (no gradients ever)." },
      { sym: "$K$", desc: "the <b>output dimension</b> of the head (the number of logits). NOT class labels — arbitrary learned coordinates. A few thousand in the paper; we use $K$ small in the demo." },
      { sym: "$x,\\ x'$ (and $x_1^g, x_2^g, V$)", desc: "<b>views</b>: augmented crops of one image. $x_1^g, x_2^g$ are the two <b>global</b> crops (large); $V$ is the full set including small <b>local</b> crops. Student sees all of $V$; teacher sees only the globals." },
      { sym: "$P_s,\\ P_t$", desc: "the student / teacher output <b>probability distributions</b> — softmax-with-temperature of the logits. Length $K$, entries positive, sum to $1$. $P_t$ is the target the student matches." },
      { sym: "$P_s^{(k)}$", desc: "the $k$-th entry of the student distribution: the probability the student assigns to output coordinate $k$." },
      { sym: "$\\tau_s,\\ \\tau_t$", desc: "the student / teacher softmax <b>temperatures</b>. Logits are divided by $\\tau$ before softmax. Small $\\tau$ → sharp/peaky; large $\\tau$ → flat. $\\tau_t \\lt \\tau_s$ — the teacher is <b>sharpened</b>." },
      { sym: "softmax", desc: "the function $\\text{softmax}(z)_k = e^{z_k}/\\sum_j e^{z_j}$ — turns logits into a probability distribution (owner: <b>ml-softmax</b>)." },
      { sym: "$H(a,b)$", desc: "the <b>cross-entropy</b> $H(a,b) = -\\sum_k a^{(k)}\\log b^{(k)}$ between two distributions $a$ (target) and $b$ (prediction). Smallest when $b$ matches $a$ (owner: <b>dl-cross-entropy</b>)." },
      { sym: "$c$", desc: "the <b>center</b>: a length-$K$ running mean of teacher logits, subtracted from the teacher logits before its softmax. This is the <b>centering</b> operation." },
      { sym: "$m$", desc: "the <b>center momentum</b> in $[0,1]$ — the EMA rate for updating $c$ (Eqn. 4). Paper default $m=0.9$ in the released code / Algorithm 1; the appendix ablation sweeps $m\\in\\{0,0.9,0.99,0.999\\}$. We use $m=0.9$ in the demo." },
      { sym: "$\\overline{g_t} = \\frac{1}{B}\\sum_{i=1}^{B} g_{\\theta_t}(x_i)$", desc: "the <b>batch mean</b> of the teacher logits over the $B$ images in the batch — what the center $c$ chases." },
      { sym: "$\\lambda$", desc: "the <b>teacher EMA rate</b> (momentum) in $[0,1]$, close to $1$. $\\theta_t \\leftarrow \\lambda\\theta_t + (1-\\lambda)\\theta_s$. Paper: cosine schedule $0.996 \\to 1$." },
      { sym: "$h(P_t)$", desc: "the <b>entropy</b> of the teacher distribution, $h(P_t) = -\\sum_k P_t^{(k)}\\log P_t^{(k)}$. High = spread out; low = peaky. Centering raises it; sharpening lowers it." },
      { sym: "$D_{KL}(P_t \\Vert P_s)$", desc: "the <b>Kullback–Leibler divergence</b> $\\sum_k P_t^{(k)}\\log\\frac{P_t^{(k)}}{P_s^{(k)}}$ — how far the student distribution is from the teacher's. $\\ge 0$, and $=0$ only when $P_s=P_t$." },
      { sym: "stop-gradient (sg)", desc: "treating the teacher branch as a fixed constant during backprop — no gradient flows into $\\theta_t$. Gradients update only the student $\\theta_s$." }
    ],
    formula: `$$ P_s(x)^{(k)} = \\frac{\\exp\\!\\big(g_{\\theta_s}(x)^{(k)}/\\tau_s\\big)}{\\sum_{j=1}^{K}\\exp\\!\\big(g_{\\theta_s}(x)^{(j)}/\\tau_s\\big)} \\qquad P_t(x)^{(k)} = \\frac{\\exp\\!\\big((g_{\\theta_t}(x)^{(k)}-c^{(k)})/\\tau_t\\big)}{\\sum_{j=1}^{K}\\exp\\!\\big((g_{\\theta_t}(x)^{(j)}-c^{(j)})/\\tau_t\\big)} $$
<div class="cap">Softmax-with-temperature for the student and teacher output distributions (\\S3 Eqn. 1). The teacher's logits have the center $c$ subtracted first (centering) and use a smaller temperature $\\tau_t$ (sharpening); the student uses $\\tau_s$.</div>
$$ H(a,b) = -\\sum_{k} a^{(k)}\\log b^{(k)} \\qquad\\quad \\min_{\\theta_s}\\; H\\big(P_t(x),\\,P_s(x)\\big) $$
<div class="cap">Cross-entropy distillation loss between a fixed teacher target and the student (\\S3 Eqn. 2). The student is trained ($\\min_{\\theta_s}$) to match the teacher's distribution; the teacher is a stop-gradient target.</div>
$$ \\min_{\\theta_s}\\; \\sum_{x\\in\\{x_1^g,\\,x_2^g\\}}\\;\\sum_{\\substack{x'\\in V\\\\ x'\\neq x}} H\\big(P_t(x),\\,P_s(x')\\big) $$
<div class="cap">Multi-crop loss (\\S3 Eqn. 3): summed over the two global crops $x_1^g,x_2^g$ passed to the teacher and every other view $x'$ in the full set $V$ (global + local crops) passed to the student. A view never supervises its own student copy ($x'\\neq x$).</div>
$$ c \\;\\leftarrow\\; m\\,c + (1-m)\\,\\frac{1}{B}\\sum_{i=1}^{B} g_{\\theta_t}(x_i) $$
<div class="cap">Center update (\\S3 Eqn. 4): the center $c$ is an exponential moving average of the batch-mean teacher logits, with center momentum $m$.</div>
$$ \\theta_t \\;\\leftarrow\\; \\lambda\\,\\theta_t + (1-\\lambda)\\,\\theta_s $$
<div class="cap">Teacher exponential-moving-average update (\\S3, Algorithm 1): the teacher weights track the student with momentum $\\lambda$ (cosine schedule $0.996\\to 1$). No gradient ever flows into $\\theta_t$.</div>
$$ H(P_t,P_s) = h(P_t) + D_{KL}(P_t\\Vert P_s) $$
<div class="cap">Collapse decomposition (\\S5.3 Eqn. 5): the loss splits into the teacher's own entropy $h(P_t)$ (set by centering vs sharpening) plus the KL divergence the student drives to $0$.</div>`,
    whatItDoes:
      `<p><b>The two softmaxes (Eqn. 1)</b> turn the student's and teacher's logits into probability
       distributions. Dividing the logits by the temperature $\\tau$ before exponentiating controls how peaky
       the result is: the teacher's smaller $\\tau_t$ makes $P_t$ <b>sharp</b> (a confident target), the
       student's $\\tau_s$ a bit flatter. Notice the teacher's logits have the <b>center</b> $c$ subtracted
       first — that is centering, baked into $P_t$.</p>
       <p><b>The loss (Eqn. 2)</b> is the cross-entropy $H(P_t,P_s)=-\\sum_k P_t^{(k)}\\log P_s^{(k)}$. It is
       smallest when the student puts probability exactly where the teacher does. Because the teacher is a
       stop-gradient target, minimizing it <b>pulls the student's distribution onto the teacher's</b> — and
       since the teacher is a slow EMA of the student, the student is chasing a stable version of itself.</p>
       <p><b>The center update (Eqn. 4)</b> keeps $c$ as an EMA of the average teacher logit across the batch.
       Subtracting $c$ removes whatever is common to every image's logits, so no single output dimension can
       dominate everything.</p>
       <p><b>The decomposition (Eqn. 5)</b> is the punchline of §5.3: the loss splits into the teacher's own
       <b>entropy</b> $h(P_t)$ plus the <b>KL divergence</b> from teacher to student. Centering pushes $P_t$
       toward uniform (raises $h(P_t)$); sharpening pushes $P_t$ toward peaky (lowers $h(P_t)$). Balanced,
       $h(P_t)$ stays in a healthy middle and the teacher target stays informative — neither one-hot nor flat.
       Drop centering and the teacher collapses to one dominant dimension; drop sharpening and it collapses to
       uniform ($H \\to \\ln K$).</p>`,
    derivation:
      `<p><b>Why the cross-entropy splits as $H(P_t,P_s)=h(P_t)+D_{KL}(P_t\\Vert P_s)$ (Eqn. 5; full
       derivation, no conceptLink).</b> Start from the definitions. The cross-entropy of $P_s$ relative to
       target $P_t$ is $H(P_t,P_s) = -\\sum_k P_t^{(k)}\\log P_s^{(k)}$. The teacher's own entropy is
       $h(P_t) = -\\sum_k P_t^{(k)}\\log P_t^{(k)}$. The KL divergence is
       $D_{KL}(P_t\\Vert P_s) = \\sum_k P_t^{(k)}\\log\\frac{P_t^{(k)}}{P_s^{(k)}}$. Add the last two:</p>
       <p>$h(P_t) + D_{KL}(P_t\\Vert P_s) = -\\sum_k P_t^{(k)}\\log P_t^{(k)} + \\sum_k P_t^{(k)}\\big(\\log P_t^{(k)} - \\log P_s^{(k)}\\big).$</p>
       <p>The $+P_t^{(k)}\\log P_t^{(k)}$ inside the KL sum cancels the $-P_t^{(k)}\\log P_t^{(k)}$ from the
       entropy, leaving $-\\sum_k P_t^{(k)}\\log P_s^{(k)} = H(P_t,P_s)$. That is Eqn. 5.</p>
       <p><b>Why this explains the collapse fix.</b> The student only controls the <b>KL term</b> (it drives
       $P_s\\to P_t$, pushing $D_{KL}\\to 0$). The <b>entropy term</b> $h(P_t)$ is a property of the
       <i>teacher</i> alone, set by centering and sharpening. A collapsed teacher has tiny entropy in one of
       two ways: peaked on one dimension ($h$ small, near $0$) or — the other failure — driven to <b>uniform</b>,
       where $h(P_t)=\\ln K$ is maximal but the target carries <i>no information</i> (every image looks the
       same). Centering raises $h(P_t)$ toward uniform; sharpening lowers it toward peaky; tuned together they
       hold $h(P_t)$ at a useful intermediate value, so the teacher's distribution differs meaningfully across
       images and the KL term the student minimizes actually teaches something. §5.3's Figure 6 shows the
       single-operation failures: <b>no centering</b> → the loss/KL drops to $0$ (the student trivially copies
       a degenerate teacher), <b>no sharpening</b> → the loss converges to $\\ln K$ (uniform collapse).</p>`,
    example:
      `<p>Work the centered + sharpened teacher target and the cross-entropy loss (Eqns. 1, 2) by hand for one
       view, with a tiny $K=4$. Take the <b>teacher logits</b> for one global view, the running <b>center</b>,
       and the teacher temperature:</p>
       <ul>
        <li>teacher logits $g_t = [\\,2.0,\\ 1.0,\\ 0.0,\\ -1.0\\,]$</li>
        <li>center $c = [\\,0.5,\\ 0.5,\\ 0.0,\\ 0.0\\,]$</li>
        <li>teacher temperature $\\tau_t = 0.5$ &nbsp;(sharpening: small $\\tau$)</li>
       </ul>
       <ul class="steps">
        <li><b>Center</b> (subtract $c$): $g_t - c = [\\,1.5,\\ 0.5,\\ 0.0,\\ -1.0\\,].$</li>
        <li><b>Sharpen</b> (divide by $\\tau_t=0.5$): $(g_t-c)/\\tau_t = [\\,3.0,\\ 1.0,\\ 0.0,\\ -2.0\\,].$</li>
        <li><b>Softmax → teacher target $P_t$.</b> Exponentiate and normalize:
        $P_t = [\\,0.8390,\\ 0.1135,\\ 0.0418,\\ 0.0057\\,]$ (sums to $1$). A confident target peaked on dim 1.</li>
        <li><b>Student distribution $P_s$.</b> Say the student's logits for the <i>other</i> view are
        $g_s = [\\,1.0,\\ 0.5,\\ 0.0,\\ 0.0\\,]$ at $\\tau_s = 1.0$ (no centering on the student):
        $P_s = [\\,0.4269,\\ 0.2589,\\ 0.1571,\\ 0.1571\\,].$</li>
        <li><b>Cross-entropy loss (Eqn. 2).</b>
        $H(P_t,P_s) = -\\sum_k P_t^{(k)}\\log P_s^{(k)} = 0.9553.$</li>
        <li><b>Check the decomposition (Eqn. 5).</b> Teacher entropy
        $h(P_t) = -\\sum_k P_t^{(k)}\\log P_t^{(k)} = 0.5562$; &nbsp;
        $D_{KL}(P_t\\Vert P_s) = 0.3991$; &nbsp; sum $= 0.5562 + 0.3991 = 0.9553.$ ✓ matches $H$.</li>
       </ul>
       <p><b>Collapse peek.</b> If we had <b>skipped centering</b> and sharpened the raw logits
       $g_t/\\tau_t = [\\,4,2,0,-2\\,]$, the teacher target becomes <i>more</i> peaked on dim 1,
       $P_t' = [\\,0.8650,\\ 0.1171,\\ 0.0158,\\ 0.0021\\,]$ — and with no centering across the batch, that same
       dim 1 dominates for <i>every</i> image: the one-dimension collapse. For reference, a fully uniform
       teacher would have entropy $\\ln K = \\ln 4 = 1.3863$ (the no-sharpening collapse). These exact numbers
       ($H=0.9553$, $h(P_t)=0.5562$, $D_{KL}=0.3991$) are recomputed in the notebook's first cell so you can
       check your softmax, centering, and cross-entropy code.</p>`,
    recipe:
      `<ol>
        <li><b>Views.</b> For each image make global + local crops (we use two views $x_1,x_2$ to keep it
        tiny). All views to the student; global views to the teacher.</li>
        <li><b>Student forward.</b> $x \\to g_{\\theta_s} \\to$ logits $\\to$ softmax at $\\tau_s$ → $P_s$ (Eqn. 1).</li>
        <li><b>Teacher forward (stop-gradient).</b> $x' \\to g_{\\theta_t} \\to$ logits; <b>subtract center $c$</b>
        (centering), softmax at small $\\tau_t$ (sharpening) → $P_t$. Compute inside <code>torch.no_grad()</code>.</li>
        <li><b>Cross-entropy loss (Eqn. 2).</b> $H(P_t,P_s) = -\\sum_k P_t^{(k)}\\log P_s^{(k)}$, teacher on one
        view vs student on the <i>other</i>; <b>symmetrize</b> over the two pairings.</li>
        <li><b>Student step.</b> One optimizer step on $\\theta_s$ only.</li>
        <li><b>Center update (Eqn. 4).</b> $c \\leftarrow m\\,c + (1-m)\\,\\overline{g_t}$ (EMA of batch-mean
        teacher logits).</li>
        <li><b>Teacher EMA.</b> $\\theta_t \\leftarrow \\lambda\\,\\theta_t + (1-\\lambda)\\,\\theta_s$.</li>
        <li><b>Pretrain</b> for some epochs on an <b>unlabelled</b> image subset — no labels, no negatives.</li>
        <li><b>Linear probe.</b> Freeze the student encoder, train one <code>nn.Linear</code> on its features
        from a few labels; compare to from-scratch.</li>
        <li><b>Ablate.</b> Remove <b>centering</b> (keep sharpening) and re-pretrain → the teacher distribution
        collapses onto one dimension (its per-image entropy crashes toward $0$), the §5.3 failure mode.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): DINO "achieve[s] <b>80.1% top-1 on ImageNet in linear evaluation with
       ViT-Base</b>," and the paper emphasizes two emergent properties — self-supervised ViT features
       "contain explicit information about the semantic segmentation of an image, which does not emerge as
       clearly with supervised ViTs, nor with convnets," and "are also excellent <b>k-NN</b> classifiers."
       The §5.3 collapse study (Figure 6) shows that removing <b>either</b> centering <b>or</b> sharpening
       breaks training: without sharpening the loss converges to $\\ln K$ (uniform collapse), without
       centering the KL term collapses to $0$.</p>
       <p><i>These are the paper's reported figures, quoted from the abstract / §5.3. The numbers in the
       CODEVIZ panel below are from our own tiny MNIST run — not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.Linear</code>, <code>nn.ReLU</code>, <code>F.log_softmax</code>/<code>F.softmax</code>, the
       optimizer, <code>torch.no_grad()</code>, and the MNIST loader + augmentations from torchvision
       (preinstalled in Colab — no pip). <b>Build by hand:</b> the two-view pipeline, the student and EMA
       teacher (encoder + projection head), the <b>softmax-with-temperature</b> for $P_s$ and $P_t$ (Eqn. 1),
       the <b>centering</b> + <b>sharpening</b> of the teacher, the <b>cross-entropy</b> distillation loss
       (Eqn. 2) with symmetrization, the <b>center update</b> (Eqn. 4) and <b>teacher EMA</b>, the
       <b>linear-probe vs from-scratch</b> comparison, and the <b>no-centering collapse</b> ablation. There
       is no conceptLink — softmax (<b>ml-softmax</b>) and cross-entropy (<b>dl-cross-entropy</b>) are
       recapped here, and the EMA / momentum-target idea is cross-linked to <b>paper-byol</b>.</p>`,
    pitfalls:
      `<ul>
        <li><b>Letting gradients into the teacher.</b> The teacher distribution $P_t$ must be computed under
        <code>torch.no_grad()</code> (stop-gradient). If you backprop into $\\theta_t$, the student and
        teacher descend the loss together and collapse. <b>Fix:</b> wrap the teacher branch in
        <code>no_grad</code>; update $\\theta_t$ ONLY by EMA.</li>
        <li><b>Dropping centering.</b> Centering subtracts the running mean $c$ from teacher logits BEFORE its
        softmax. Remove it and (with sharpening still on) one output dimension dominates for every image — the
        collapse the §5.3 ablation reproduces. <b>Fix:</b> keep the center EMA (Eqn. 4) and subtract it.</li>
        <li><b>Temperatures backwards.</b> The teacher must be <i>sharper</i> than the student:
        $\\tau_t \\lt \\tau_s$ (paper: $\\tau_t \\approx 0.04$–$0.07$, $\\tau_s = 0.1$). If $\\tau_t \\ge \\tau_s$
        the teacher is no sharper than the student and provides no sharpening pressure → uniform collapse.</li>
        <li><b>Cross-entropy on the wrong argument order / using a one-hot.</b> The target is the <b>soft</b>
        teacher distribution $P_t$, not a label. Use $-\\sum_k P_t^{(k)}\\log P_s^{(k)}$ (multiply by the full
        soft $P_t$), not <code>F.cross_entropy(logits, class_index)</code>.</li>
        <li><b>Forgetting to symmetrize / cross the views.</b> The teacher of view $x_1$ supervises the student
        of view $x_2$ and vice-versa (a view never supervises its own student copy). Using one direction halves
        the signal.</li>
        <li><b>Probing the wrong vector.</b> Your representation is the student <b>encoder</b> output — not the
        projection-head logits. Probe the encoder; the head is discarded after pretraining.</li>
      </ul>`,
    recall: [
      "Write the teacher distribution $P_t$ (Eqn. 1) and say where centering and sharpening appear in it.",
      "Write the DINO loss (Eqn. 2) and explain why the teacher target is a soft distribution, not a label.",
      "State the decomposition $H(P_t,P_s)=h(P_t)+D_{KL}(P_t\\Vert P_s)$ and which term the student controls.",
      "Centering and sharpening each, alone, cause a DIFFERENT collapse — name both failure modes.",
      "Where does the teacher come from, and which side gets the stop-gradient?"
    ],
    practice: [
      {
        q: `<b>The headline (no labels).</b> You pretrained a small encoder with DINO on unlabelled images —
            <i>no labels, no negatives</i>, just student-matches-teacher cross-entropy — froze it, and trained
            a linear probe on just 20 labels; you also trained a from-scratch model on the same 20 labels. The
            probe scores much higher. What does that demonstrate, and how does DINO's collapse defense differ
            from BYOL's (paper-byol)?`,
        steps: [
          { do: `Compare the two accuracies at the smallest label budget; the frozen-DINO probe wins.`, why: `With only 20 labels a from-scratch net has too little signal; the probe inherits features learned from thousands of <i>unlabelled</i> images.` },
          { do: `Note the DINO loss had no labels and no negatives — only cross-entropy to a centered, sharpened EMA teacher.`, why: `The structure came from self-distillation, not supervision.` },
          { do: `Contrast the anti-collapse mechanism: DINO uses <b>centering + sharpening</b> on the teacher; BYOL uses an <b>asymmetric predictor + stop-grad</b>.`, why: `Both avoid the constant-output collapse without negatives, but by different means — DINO operates on the teacher's output distribution, BYOL on the network architecture.` }
        ],
        answer: `<p>It demonstrates that <b>label-free self-distillation transfers</b>: in the low-label regime
                 a linear probe on frozen DINO features beats from-scratch because the features were shaped by
                 thousands of unlabelled images via cross-entropy to a momentum teacher. DINO avoids collapse
                 with <b>centering + sharpening of the teacher distribution</b> (Eqns. 1, 4), whereas BYOL uses
                 an <b>asymmetric predictor head + stop-gradient</b> — same goal (no constant collapse, no
                 negatives), different mechanism. Our CODEVIZ panel shows the probe beating from-scratch across
                 the label budgets.</p>`
      },
      {
        q: `Your worked example gave teacher target $P_t=[0.839,0.114,0.042,0.006]$, student
            $P_s=[0.427,0.259,0.157,0.157]$, and loss $H(P_t,P_s)=0.9553$. Suppose the student improves so its
            distribution becomes $P_s'=[0.80,0.13,0.04,0.03]$ (much closer to the teacher). Does the loss go up
            or down, and roughly toward what floor?`,
        steps: [
          { do: `Compute $H(P_t,P_s') = -\\sum_k P_t^{(k)}\\log P_s'^{(k)}$ with the new $P_s'$.`, why: `Cross-entropy is smallest when the student matches the teacher.` },
          { do: `$H \\approx -(0.839\\ln 0.80 + 0.114\\ln 0.13 + 0.042\\ln 0.04 + 0.006\\ln 0.03) \\approx 0.62$.`, why: `Mass now sits where the teacher's mass is, so $-\\log P_s$ is small exactly where $P_t$ is large.` },
          { do: `Compare to the floor: the smallest possible $H$ here is the teacher entropy $h(P_t)=0.5562$ (when $P_s=P_t$ exactly, the KL term is $0$).`, why: `By Eqn. 5, $H=h(P_t)+D_{KL}$, and $D_{KL}\\ge 0$ with equality iff $P_s=P_t$.` }
        ],
        answer: `<p>The loss <b>goes down</b>, from $0.9553$ to about $0.62$, because the student distribution
                 now puts its mass where the teacher's is (the KL term shrank). It cannot fall below the
                 teacher's own entropy $h(P_t)=0.5562$: by Eqn. 5, $H=h(P_t)+D_{KL}(P_t\\Vert P_s)$ and the KL
                 term is $\\ge 0$, hitting $0$ only when $P_s=P_t$ exactly. So $h(P_t)$ is the floor the student
                 is driving toward.</p>`
      },
      {
        q: `<b>Ablation (the assigned one).</b> You <b>remove centering</b> (keep sharpening at small $\\tau_t$)
            and re-pretrain DINO. The training loss drops fast and the teacher's mean per-image output entropy
            crashes from ~4.7 (spread over $K$ slots) toward $0$. What happened to the teacher's output, and
            which design choice prevents it in real DINO?`,
        steps: [
          { do: `Inspect the teacher distribution $P_t$ across different images after the no-centering run.`, why: `They are nearly identical and peaked on the <i>same</i> single dimension for every image — the one-dimension collapse.` },
          { do: `See why the loss fell: a degenerate, near-constant teacher is trivial for the student to match, so cross-entropy (and the KL term) drop without learning anything useful.`, why: `With no negatives and no centering, sharpening alone drives the teacher to a dominant dimension; nothing forces different images to differ.` },
          { do: `Restore <b>centering</b>: subtract the running center $c$ (Eqn. 4) from teacher logits before the softmax.`, why: `Centering removes the component common to all images, stopping any one dimension from dominating — it balances sharpening (paper §5.3, Figure 6).` }
        ],
        answer: `<p>The teacher distribution <b>collapsed onto one dimension</b>: with centering gone, sharpening
                 alone makes the teacher emit the same near-one-hot distribution for <i>every</i> image, so the
                 student matches a target that carries no information — the per-image entropy crashes toward $0$
                 and the loss falls without learning. Real DINO prevents this with <b>centering</b> (Eqn. 4):
                 subtracting the running mean $c$ of teacher logits removes what is common across the batch,
                 balancing sharpening so the teacher stays informative (paper §5.3). Our CODEVIZ panel shows the
                 teacher's mean per-image entropy crushed from ~4.7 toward ~0 in the no-centering run versus the
                 healthy value with centering on. (At full scale this teacher collapse drags the learned
                 features down too; in our tiny short run the clean, decisive signal is the teacher's
                 entropy.)</p>`
      }
    ]
  });

  window.CODE["paper-dino"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the student and EMA teacher (encoder + projection head), the
       <b>softmax-with-temperature</b> for $P_s$ and $P_t$ (Eqn. 1), the teacher <b>centering</b> +
       <b>sharpening</b>, the <b>cross-entropy</b> distillation loss (Eqn. 2) with symmetrization, and the
       <b>center update</b> (Eqn. 4) + <b>teacher EMA</b> — all by hand on <code>nn</code> primitives — then
       pretrain on an <b>MNIST subset</b> with <b>no labels and no negatives</b> (torchvision, preinstalled in
       Colab — no pip). The first cell recomputes the worked example: teacher target $P_t$, loss
       $H=0.9553$, and the decomposition $h(P_t)=0.5562$, $D_{KL}=0.3991$. After pretraining we
       <b>freeze</b> the encoder and run a <b>linear probe</b> vs a <b>from-scratch</b> model on the same few
       labels (probe wins in the low-label regime), then the <b>no-centering ablation</b> that collapses the
       teacher distribution. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np, copy
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: teacher target P_t, loss H, and decomposition (Eqns. 1,2,5). ---
gt = torch.tensor([2.0, 1.0, 0.0, -1.0])      # teacher logits, K=4
c  = torch.tensor([0.5, 0.5, 0.0, 0.0])       # center
tau_t, tau_s = 0.5, 1.0
Pt = F.softmax((gt - c) / tau_t, dim=0)        # center -> sharpen -> softmax  (Eqn. 1)
gs = torch.tensor([1.0, 0.5, 0.0, 0.0])       # student logits (other view)
Ps = F.softmax(gs / tau_s, dim=0)
H  = -(Pt * Ps.log()).sum()                    # cross-entropy  (Eqn. 2)
hPt = -(Pt * Pt.log()).sum()                   # teacher entropy
KL  = (Pt * (Pt.log() - Ps.log())).sum()       # D_KL(Pt || Ps)
print("Pt =", [round(v,4) for v in Pt.tolist()], " Ps =", [round(v,4) for v in Ps.tolist()])
print("H(Pt,Ps) =", round(H.item(),4), " h(Pt) =", round(hPt.item(),4),
      " KL =", round(KL.item(),4), " h+KL =", round((hPt+KL).item(),4), " lnK =", round(np.log(4),4))
# Pt = [0.839, 0.1135, 0.0418, 0.0057]  Ps = [0.4269, 0.2589, 0.1571, 0.1571]
# H(Pt,Ps) = 0.9553  h(Pt) = 0.5562  KL = 0.3991  h+KL = 0.9553  lnK = 1.3863


# --- 1. Building blocks: encoder f + projection head (-> K logits) from nn primitives. ---
K = 256                                        # output dim of the head (NOT class labels)
class Encoder(nn.Module):
    def __init__(self, feat=64):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.ReLU(), nn.MaxPool2d(2),
            nn.AdaptiveAvgPool2d(1), nn.Flatten())
        self.fc = nn.Linear(32, feat)
    def forward(self, x): return F.relu(self.fc(self.net(x)))

def head(fin=64, hid=128, out=K):              # projection head -> K logits
    return nn.Sequential(nn.Linear(fin, hid), nn.GELU(), nn.Linear(hid, out))


# --- 2. The DINO pair: student (trained) + teacher (EMA, stop-grad, centered+sharpened). ---
class DINO(nn.Module):
    def __init__(self, use_centering=True, tau_s=0.1, tau_t=0.04, lam=0.99, m=0.9):
        super().__init__()
        self.tau_s, self.tau_t, self.lam, self.m = tau_s, tau_t, lam, m
        self.use_centering = use_centering
        self.enc_s, self.hd_s = Encoder(), head()                 # student
        self.enc_t = copy.deepcopy(self.enc_s)                    # teacher = EMA copy (no grad)
        self.hd_t  = copy.deepcopy(self.hd_s)
        for p in list(self.enc_t.parameters()) + list(self.hd_t.parameters()):
            p.requires_grad_(False)
        self.register_buffer("center", torch.zeros(K))           # the center c (Eqn. 4)
    def student(self, x):                       # logits -> P_s (softmax @ tau_s, Eqn. 1)
        return F.log_softmax(self.hd_s(self.enc_s(x)) / self.tau_s, dim=1)   # log P_s
    @torch.no_grad()
    def teacher(self, x):                       # center -> sharpen -> softmax -> P_t (stop-gradient)
        g = self.hd_t(self.enc_t(x))
        if self.use_centering: g = g - self.center
        return F.softmax(g / self.tau_t, dim=1), g                # return P_t and raw logits for center
    def loss_and_update_center(self, v1, v2):   # symmetrized cross-entropy (Eqn. 2)
        Pt1, g1 = self.teacher(v1); Pt2, g2 = self.teacher(v2)
        logPs1, logPs2 = self.student(v1), self.student(v2)
        # teacher of one view supervises student of the OTHER view (cross)
        loss = -(Pt1 * logPs2).sum(1).mean() - (Pt2 * logPs1).sum(1).mean()
        with torch.no_grad():                   # center update (Eqn. 4): EMA of batch-mean teacher logits
            batch_mean = torch.cat([g1, g2], 0).mean(0)
            self.center.mul_(self.m).add_(batch_mean, alpha=1 - self.m)
        return loss
    @torch.no_grad()
    def ema_update(self):                       # teacher EMA: theta_t <- lam*theta_t + (1-lam)*theta_s
        for s, t in [(self.enc_s, self.enc_t), (self.hd_s, self.hd_t)]:
            for ps, pt in zip(s.parameters(), t.parameters()):
                pt.mul_(self.lam).add_(ps.detach(), alpha=1 - self.lam)
    @torch.no_grad()
    def teacher_entropy(self, X):               # mean per-image entropy of P_t (collapse monitor)
        Pt, _ = self.teacher(X)
        return -(Pt * (Pt + 1e-9).log()).sum(1).mean().item()


# --- 3. Two-view augmentation + an UNLABELLED MNIST subset (torchvision, preinstalled). ---
aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5, 1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]
labels = torch.tensor([raw[i][1] for i in idx])     # used ONLY for the probe later

def pretrain(use_centering=True, epochs=15):
    torch.manual_seed(0); m = DINO(use_centering=use_centering).to(device)
    opt = torch.optim.Adam([p for p in m.parameters() if p.requires_grad], lr=1e-3)
    m.train(); B = 128
    for ep in range(epochs):
        perm = np.random.permutation(len(imgs)); tot = 0.0; nb = 0
        for s in range(0, len(imgs), B):
            bi = perm[s:s + B]
            v1 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            v2 = torch.stack([aug(imgs[i]) for i in bi]).to(device)
            loss = m.loss_and_update_center(v1, v2)
            opt.zero_grad(); loss.backward(); opt.step(); m.ema_update()   # student step THEN EMA
            tot += loss.item(); nb += 1
        if ep % 3 == 0:
            Xs = torch.stack([base(im) for im in imgs[:500]]).to(device)
            print(f"  pretrain ep {ep}  loss {tot/nb:.4f}  teacher entropy {m.teacher_entropy(Xs):.4f}")
    return m

print("\\n=== full DINO (centering + sharpening) ===")
m = pretrain(use_centering=True)

# --- 4. FREEZE the student encoder, extract features (linear-evaluation protocol). ---
def features(model):
    model.eval()
    with torch.no_grad():
        return model.enc_s(torch.stack([base(im) for im in imgs]).to(device)).cpu()
feats = features(m)
print("feature std across images (full DINO):", round(feats.std(0).mean().item(), 4), "(healthy: > 0)")

def linear_probe(feats, n_lab):                 # train ONLY a linear classifier on frozen features
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

def from_scratch(n_lab):                         # train a fresh conv net end-to-end on the few labels
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

print("\\nlabels | probe(frozen DINO) | from-scratch")
for n in [20, 50, 100, 300]:
    print(f"{n:6d} |       {linear_probe(feats, n):.3f}       |    {from_scratch(n):.3f}")

# --- 5. ABLATION: remove CENTERING -> teacher distribution collapses onto one dimension. ---
print("\\n=== ablation: NO centering (expect teacher collapse) ===")
m_ab = pretrain(use_centering=False)
feats_ab = features(m_ab)
Xs = torch.stack([base(im) for im in imgs[:500]]).to(device)
print("teacher entropy  full vs no-centering:", round(m.teacher_entropy(Xs), 4),
      "vs", round(m_ab.teacher_entropy(Xs), 4), "(collapsed: ~0)")
print("probe(no-centering DINO) @100 labels:", round(linear_probe(feats_ab, 100), 3))
# Full DINO: probe beats from-scratch at every budget; teacher entropy stays healthy (~4.7 over K=256).
# No centering: teacher entropy collapses toward 0 -- it emits the SAME near-one-hot distribution for
#   every image (one dimension dominates), exactly the paper's Sec 5.3 collapse. At this tiny scale the
#   frozen backbone probe degrades only mildly in 15 epochs, but the teacher-distribution collapse -- the
#   thing centering exists to prevent -- is unambiguous (entropy ~4.7 -> ~0).
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-dino"] = {
    question: "Does DINO learn useful features with NO labels — and does removing CENTERING collapse the teacher?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs number of labels — frozen-DINO linear probe vs from-scratch (MNIST subset)",
        xlabel: "number of labelled examples",
        ylabel: "test accuracy",
        series: [
          {
            name: "Linear probe (frozen DINO, no labels)",
            color: "#7ee787",
            points: [[20, 0.204], [50, 0.213], [100, 0.243], [300, 0.272]]
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
        title: "Collapse ablation — mean per-image teacher entropy h(P_t)",
        xlabel: "pretraining variant",
        ylabel: "teacher entropy (0 = collapsed onto one dimension)",
        series: [
          {
            name: "teacher entropy",
            color: "#a5d6ff",
            points: [["Full DINO (centering + sharpening)", 4.737], ["No centering (ablation)", 0.002]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A small conv encoder + projection head was pretrained with DINO (student matches a centered, sharpened EMA teacher's output distribution via cross-entropy; NO labels, NO negatives) on 3,000 <b>unlabelled</b> MNIST images for 15 epochs, then <b>frozen</b>. <b>Left:</b> a one-layer linear probe on its features (green) beats a from-scratch conv net on the <i>same</i> few labels (red) at every budget — e.g. 0.204 vs 0.110 at 20 labels — so label-free self-distillation supplied the useful structure. <b>Right:</b> the assigned ablation — removing <b>centering</b> (keeping sharpening) collapses the teacher: its mean per-image output entropy falls from ~4.74 (full DINO, spread across the $K=256$ output dimensions) to ~0.002 (the teacher emits the same near-one-hot distribution for every image, dominated by a single dimension), so the student matches an uninformative target. This reproduces the paper's §5.3 finding that centering and sharpening must be used together. (Accuracies are modest because the encoder is tiny and pretraining is short; the qualitative gap and the collapse are the point.)",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np, copy
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)

# DINO with NO labels on UNLABELLED MNIST: freeze, probe vs from-scratch, and the
# no-centering collapse ablation (toy reproduction of paper Section 5.3).
K = 256
class Encoder(nn.Module):
    def __init__(s, feat=64):
        super().__init__()
        s.net = nn.Sequential(nn.Conv2d(1,16,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.Conv2d(16,32,3,padding=1), nn.ReLU(), nn.MaxPool2d(2),
                              nn.AdaptiveAvgPool2d(1), nn.Flatten())
        s.fc = nn.Linear(32, feat)
    def forward(s, x): return F.relu(s.fc(s.net(x)))
def head(fin=64, hid=128, out=K):
    return nn.Sequential(nn.Linear(fin,hid), nn.GELU(), nn.Linear(hid,out))

class DINO(nn.Module):
    def __init__(s, use_centering=True, tau_s=0.1, tau_t=0.04, lam=0.99, m=0.9):
        super().__init__(); s.tau_s,s.tau_t,s.lam,s.m,s.use_centering = tau_s,tau_t,lam,m,use_centering
        s.enc_s, s.hd_s = Encoder(), head()
        s.enc_t, s.hd_t = copy.deepcopy(s.enc_s), copy.deepcopy(s.hd_s)
        for p in list(s.enc_t.parameters())+list(s.hd_t.parameters()): p.requires_grad_(False)
        s.register_buffer("center", torch.zeros(K))
    def student(s, x): return F.log_softmax(s.hd_s(s.enc_s(x))/s.tau_s, dim=1)
    @torch.no_grad()
    def teacher(s, x):
        g = s.hd_t(s.enc_t(x))
        if s.use_centering: g = g - s.center
        return F.softmax(g/s.tau_t, dim=1), g
    def step_loss(s, v1, v2):
        Pt1,g1 = s.teacher(v1); Pt2,g2 = s.teacher(v2)
        L = -(Pt1*s.student(v2)).sum(1).mean() - (Pt2*s.student(v1)).sum(1).mean()
        with torch.no_grad():
            s.center.mul_(s.m).add_(torch.cat([g1,g2],0).mean(0), alpha=1-s.m)
        return L
    @torch.no_grad()
    def ema(s):
        for a,b in [(s.enc_s,s.enc_t),(s.hd_s,s.hd_t)]:
            for ps,pt in zip(a.parameters(), b.parameters()):
                pt.mul_(s.lam).add_(ps.detach(), alpha=1-s.lam)
    @torch.no_grad()
    def tent(s, X):
        Pt,_ = s.teacher(X); return -(Pt*(Pt+1e-9).log()).sum(1).mean().item()

aug  = T.Compose([T.RandomResizedCrop(28, scale=(0.5,1.0)),
                  T.RandomApply([T.GaussianBlur(3)], 0.5), T.ToTensor()])
base = T.ToTensor()
raw  = torchvision.datasets.MNIST("./data", train=True, download=True)
idx  = np.random.RandomState(0).permutation(len(raw))[:3000]
imgs = [raw[i][0] for i in idx]; labels = torch.tensor([raw[i][1] for i in idx])

def pretrain(use_centering=True, epochs=15):
    torch.manual_seed(0); m = DINO(use_centering=use_centering)
    opt = torch.optim.Adam([p for p in m.parameters() if p.requires_grad], lr=1e-3)
    m.train(); B=128
    for ep in range(epochs):
        perm = np.random.permutation(len(imgs))
        for s0 in range(0, len(imgs), B):
            bi = perm[s0:s0+B]
            v1 = torch.stack([aug(imgs[i]) for i in bi]); v2 = torch.stack([aug(imgs[i]) for i in bi])
            loss = m.step_loss(v1, v2)
            opt.zero_grad(); loss.backward(); opt.step(); m.ema()
    return m
def features(m):
    m.eval()
    with torch.no_grad(): return m.enc_s(torch.stack([base(im) for im in imgs]))

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

m_full = pretrain(use_centering=True); f_full = features(m_full)
for n in [20,50,100,300]:
    print(n, "probe", probe(f_full, n), "scratch", scratch(n))
Xs = torch.stack([base(im) for im in imgs[:500]])
print("full DINO teacher entropy:", round(m_full.tent(Xs),3))

m_ab = pretrain(use_centering=False); f_ab = features(m_ab)
print("no-centering teacher entropy:", round(m_ab.tent(Xs),3), "(collapsed ~0)")
print("no-centering probe @100:", probe(f_ab, 100))
# Full DINO probe > from-scratch at every budget (no labels used).
# No centering -> teacher entropy collapses toward 0 (one dim dominates) -- the paper's Sec 5.3 collapse.`
  };
})();
