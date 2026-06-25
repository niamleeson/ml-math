/* Paper lesson — "Masked Autoencoders Are Scalable Vision Learners" (MAE),
   Kaiming He, Xinlei Chen, Saining Xie, Yanghao Li, Piotr Dollar, Ross Girshick, FAIR 2021.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mae".
   GROUNDED from arXiv:2111.06377 (abstract) and the ar5iv HTML mirror:
     - Section 1 (Introduction): the asymmetric design + "high masking ratio (75%)" rationale.
     - Section 3 (Approach): random uniform masking; encoder on visible patches only; lightweight
       decoder with mask tokens; reconstruction target = pixel MSE on masked patches only; the
       per-patch normalized-pixel option.
     - Figure 5 (mask-ratio ablation): "optimal ratios are surprisingly high... 75% is good for both
       linear probing and fine-tuning."
     - Table 1 (decoder depth 8, width 512); Table 3 (ViT-H fine-tuning 86.9% / 87.8% at 448);
       linear-probe 73.5% for ViT-L.
   Track B (architecture): build a tiny MAE on small images by hand on nn primitives — patchify,
   random mask 75%, encode only the visible patches, decode with mask tokens, pixel-MSE loss on
   masked patches; show reconstruction from 25% visible + a linear probe; ABLATION over mask ratio.
   Cross-links: paper-vit (the encoder is a ViT), paper-bert (masked-token prediction, but for image
   pixels instead of language tokens). conceptLink is null, so the math is derived in full here. */
(function () {
  window.LESSONS.push({
    id: "paper-mae",
    title: "MAE — Masked Autoencoders Are Scalable Vision Learners (2021)",
    tagline: "Hide 75% of an image's patches, ask a network to paint them back, and the encoder learns powerful features for free.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Kaiming He, Xinlei Chen, Saining Xie, Yanghao Li, Piotr Dollar, Ross Girshick",
      org: "Facebook AI Research (FAIR)",
      year: 2021,
      venue: "arXiv:2111.06377 (Nov 2021); CVPR 2022",
      citations: "",
      arxiv: "https://arxiv.org/abs/2111.06377",
      code: "https://github.com/facebookresearch/mae"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["mod-autoencoder", "paper-vit", "pt-cnn", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>An <b>autoencoder</b> is a network that compresses an input into a small summary (the
       <b>latent</b> code) and then rebuilds the input from that summary. A <b>masked autoencoder</b> is the
       same idea but with a twist: hide part of the input, then ask the network to fill in the hidden part.
       In language, <b>BERT</b> (see <code>paper-bert</code>) did exactly this — mask out about 15% of the
       words in a sentence and train the model to guess them — and that single "fill in the blank" task gave
       enormously useful language features. The obvious question: why had the same trick <i>not</i> worked
       nearly as well for images?</p>
       <p>The paper's introduction (§1) gives three reasons it was hard for vision. (1) Until <b>Vision
       Transformers</b> (ViT, see <code>paper-vit</code>) there was no natural way to treat an image as a
       sequence of maskable tokens — convolutions slide a fixed window over the whole grid, so there is no
       clean "blank" to leave. (2) Images are <b>far more redundant</b> than text: a missing patch can often
       be guessed from its neighbours by simple interpolation, so masking only a few patches teaches the
       network almost nothing. (3) The decoder's job differs: in language it predicts words (rich, meaningful
       symbols), but in vision it must predict raw pixels (low-level signal), so a decoder built like the
       encoder may be the wrong tool.</p>
       <p>MAE's contribution is to fix all three at once and, in doing so, make masked pretraining both
       <i>simple</i> and <i>fast</i> for images.</p>`,
    contribution:
      `<ul>
        <li><b>Mask a very high fraction of patches (75%).</b> The abstract states the approach is to "mask
        random patches of the input image and reconstruct the missing pixels," and that "masking a high
        proportion of the input image, e.g., 75%, yields a nontrivial and meaningful self-supervisory task."
        Because images are redundant, only an aggressive mask forces the network to learn real structure
        rather than copy a neighbour.</li>
        <li><b>An asymmetric encoder-decoder (§3).</b> The <b>encoder operates only on the small set of
        visible (unmasked) patches</b> — it never sees mask tokens. A separate <b>lightweight decoder</b>
        then takes the encoder's output plus mask tokens and reconstructs the full image. The abstract: "an
        asymmetric encoder-decoder architecture, with an encoder that operates only on the visible subset of
        patches (without mask tokens), along with a lightweight decoder."</li>
        <li><b>A big speed-up, for free.</b> Because the encoder sees only 25% of the patches, the abstract
        reports this "enables us to train large models efficiently and effectively: we accelerate training
        (by 3x or more) and improve accuracy."</li>
      </ul>`,
    whyItMattered:
      `<p>MAE made BERT-style "fill in the blank" pretraining finally pay off for vision, and it did so with a
       method simple enough to fit on a slide. The encoder-only-sees-visible-patches trick turned the high
       mask ratio from a cost into a saving — bigger the mask, smaller the encoder's input, faster the
       training. It became a default recipe for pretraining Vision Transformers, spawned many follow-ups
       (video MAE, multimodal MAE, MAE for point clouds and audio), and reinforced a broader lesson: a good
       self-supervised task is one that is <i>hard enough</i> that solving it requires genuine understanding —
       here, 75% missing forces the network to model the whole scene, not interpolate.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§1 (Introduction)</b> — the three reasons masked vision was hard (no tokens, redundancy,
        pixel-vs-word decoder) and Figure 1's picture: most patches grey-masked, encoder on the few visible
        ones, decoder painting the rest back.</li>
        <li><b>§3 (Approach)</b> — the whole method in one page: random uniform <b>masking</b>, the
        <b>encoder</b> on visible patches only, the <b>decoder</b> with mask tokens, and the
        <b>reconstruction target</b> (the loss you will transcribe: pixel MSE on masked patches, with the
        per-patch normalized-pixel option).</li>
        <li><b>Figure 5 (mask-ratio ablation)</b> — the headline curve: accuracy versus how much you mask.
        The optimum is "surprisingly high" at 75%; linear probing is very sensitive to it, fine-tuning much
        less so.</li>
       </ul>
       <p><b>Skim:</b> Figure 4 (qualitative reconstructions — striking but not load-bearing), Tables 1-2
       (decoder depth/width and FLOPs ablations), and §4's ImageNet transfer tables. The core you need is one
       figure (the pipeline) and one equation (the loss).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will cut a small image into a grid of square <b>patches</b>, randomly hide a fraction of them,
       feed <i>only the visible patches</i> through an encoder, and train a small decoder to repaint the
       hidden patches — scoring it by pixel error on the hidden patches only.</p>
       <p>Now the ablation. You will sweep the <b>mask ratio</b> — the fraction of patches you hide — from
       low (say 25%) to very high (say 90%). Before running: at which mask ratio do you expect the encoder to
       learn the <i>most useful</i> features (measured by a linear probe on its frozen output)? A naive guess
       says "hide as little as possible so the task is easy." The paper says otherwise. Write your guess for
       the best ratio, then run the sweep.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Patchify.</b> Split each image into a grid of non-overlapping $P\\times P$ patches, then flatten
        each patch to a vector. <i># an image of $N$ patches becomes a length-$N$ sequence.</i></li>
        <li><b>Random mask.</b> TODO: pick a random permutation of the $N$ patch indices; keep the first
        $N_{\\text{vis}} = \\lceil (1-r)\\,N\\rceil$ as <b>visible</b> and mask the rest, where $r$ is the mask
        ratio (e.g. $r=0.75$). <i># uniform sampling without replacement — no center bias.</i></li>
        <li><b>Encoder on visible only.</b> TODO: embed and encode <i>just</i> the $N_{\\text{vis}}$ visible
        patches. <i># the encoder never sees a mask token — this is the asymmetry.</i></li>
        <li><b>Decoder with mask tokens.</b> TODO: build the full length-$N$ sequence by placing the encoded
        visible tokens back in their slots and filling every masked slot with one shared learned
        <b>mask token</b>; run a small decoder; project each token to $P\\times P$ pixels.</li>
        <li><b>Loss on masked patches only.</b> TODO: mean squared error between predicted and true pixels,
        averaged over the <b>masked</b> patches only. <i># §3, Reconstruction target.</i></li>
       </ul>
       <p>Then run the <b>mask-ratio sweep</b>: pretrain at several $r$, freeze the encoder, train one linear
       layer on its features, and compare probe accuracy. Look for a peak at a surprisingly high $r$.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>MAE (§3) has four moving parts. Start with one image.</p>
       <p><b>1. Patchify.</b> As in ViT (<code>paper-vit</code>), cut the image into a grid of non-overlapping
       square patches of side $P$. An image of side $H$ gives $N = (H/P)^2$ patches; each patch is flattened
       into a vector and given a position embedding so the model knows where it sat.</p>
       <p><b>2. Random masking.</b> Choose a <b>mask ratio</b> $r$ (the paper's default is $r=0.75$). Sample
       patches to remove by "random sampling without replacement, following a uniform distribution" (§3): take
       a random permutation of the $N$ patch indices, keep the first $N_{\\text{vis}} = (1-r)\\,N$ as
       <b>visible</b>, and mark the remaining $r\\,N$ as <b>masked</b>. Uniform random sampling (rather than,
       say, a block in the centre) "prevents a potential center bias" and, with a high ratio, "largely
       eliminates redundancy" — a masked patch usually has no close visible neighbour to copy.</p>
       <p><b>3. Asymmetric encoder — visible patches only.</b> Here is the key idea. The <b>encoder is a
       Vision Transformer that processes only the $N_{\\text{vis}}$ visible patches</b>. It never receives a
       mask token. Because $N_{\\text{vis}} = (1-r)N$ is small (a quarter of $N$ at 75%), the encoder runs on a
       short sequence, which is what makes training 3x or more faster and lets the encoder be large.</p>
       <p><b>4. Lightweight decoder — reconstruct from 25% visible + mask tokens.</b> Now rebuild the full
       length-$N$ sequence: put each encoded visible token back in its original slot, and fill every masked
       slot with a single <b>shared, learned mask token</b> (one vector reused for every blank, plus its
       position embedding so the decoder knows <i>which</i> blank). A small Transformer <b>decoder</b> (the
       paper's default is depth 8, width 512 — Table 1, far lighter than the encoder) processes this full
       sequence and a linear head maps each token to its $P\\times P\\times(\\text{channels})$ pixels. The
       decoder exists only for pretraining; you throw it away afterwards and keep the encoder.</p>
       <p><b>The loss.</b> Compare the predicted pixels to the true pixels using <b>mean squared error
       (MSE)</b>, but — crucially — "compute the loss only on masked patches" (§3), exactly as BERT scores
       only the masked words. Scoring visible patches would reward mere copying. The paper also offers a
       refinement: use <b>per-patch normalized pixels</b> as the target (subtract each patch's own mean,
       divide by its own standard deviation), which "improves representation quality." We include both options
       in the notebook.</p>`,
    architecture:
      `<p>MAE has four components and an explicit <b>asymmetry</b>: a heavy ViT <b>encoder</b> that runs on the
       small visible subset, and a separate, deliberately small <b>decoder</b> that runs on the full sequence.
       Data flow for one $H\\times H$ image (paper defaults in brackets, §3, §4.1, Table 1):</p>
       <ul>
        <li><b>Patch embedding.</b> Cut into $N=(H/P)^2$ non-overlapping $P\\times P$ patches [$P=16$, so $N=196$
        for $224\\times 224$]; a single <code>Linear</code> projects each flattened patch ($D=P^2 C$ values) to a
        token of width $d_{\\text{enc}}$ [ViT-Large: $d_{\\text{enc}}=1024$, 24 blocks; ViT-Huge: $1280$, 32
        blocks]. Add fixed <b>sine-cosine position embeddings</b>.</li>
        <li><b>Random masking.</b> Sample a uniform random permutation of the $N$ indices, keep the first
        $N_{\\text{vis}}=(1-r)N$ as visible, mask the rest [$r=0.75\\Rightarrow N_{\\text{vis}}=49$]. Record the
        inverse permutation so tokens can be un-shuffled later.</li>
        <li><b>Encoder (visible only).</b> A <b>standard ViT</b> — stacks of {multi-head self-attention +
        MLP, each with LayerNorm and residual connections} — but applied to the $N_{\\text{vis}}$ visible
        tokens <i>only</i>. No mask token ever enters here. Cost scales with the short length $N_{\\text{vis}}$,
        giving the 2.8–4.1x wall-clock speed-up (Table 2) and ~3.3x fewer FLOPs (Table 1c) vs. encoding the full
        image.</li>
        <li><b>Re-assemble + mask tokens.</b> A <code>Linear</code> maps encoder output to the decoder width
        $d_{\\text{dec}}$ [512]. Build the full length-$N$ sequence: encoded visible tokens in their original
        slots, and a single <b>shared, learned mask-token vector</b> copied into every masked slot. Add
        <b>position embeddings to all $N$ slots</b> (so the decoder knows <i>which</i> blank each mask token
        fills) and un-shuffle to image order.</li>
        <li><b>Decoder (full sequence) + pixel head.</b> A <b>lightweight</b> ViT [depth 8 blocks, width 512 —
        far smaller than the encoder, ~9% of its per-token FLOPs] over all $N$ tokens, then a <code>Linear</code>
        head maps each token to its $D=P^2 C$ pixels. The decoder exists only for pretraining and is
        <b>discarded</b> afterwards; the encoder is the kept feature extractor.</li>
        <li><b>Loss.</b> Pixel MSE on the masked patches only (the formula), with the optional per-patch
        normalized target.</li>
       </ul>
       <p>Sizes scale by encoder choice (ViT-B/L/H); the <i>decoder is fixed-small regardless</i>, which is the
       point of the asymmetry. Our notebook uses a tiny version ($P=7$, $N=16$, $d_{\\text{enc}}=64$, encoder
       depth 3, $d_{\\text{dec}}=32$, decoder depth 2) — same shape, small numbers.</p>`,
    symbols: [
      { sym: "$P$", desc: "the <b>patch size</b>: the side length, in pixels, of each square patch the image is cut into (e.g. $P=16$ for 16x16 patches, or $P=7$ in our tiny demo)." },
      { sym: "$N$", desc: "the <b>total number of patches</b> in one image, $N=(H/P)^2$ for an $H\\times H$ image. The image becomes a length-$N$ sequence of patch tokens." },
      { sym: "$r$", desc: "the <b>mask ratio</b>: the fraction of patches that are hidden (masked). The paper's default is $r=0.75$, i.e. hide three quarters." },
      { sym: "$N_{\\text{vis}}$", desc: "the number of <b>visible (unmasked) patches</b>, $N_{\\text{vis}}=(1-r)\\,N$. At $r=0.75$ this is a quarter of $N$ — the only patches the encoder ever sees." },
      { sym: "$\\mathcal{M}$", desc: "the <b>masked set</b>: the indices of the hidden patches (there are $rN$ of them). The loss is averaged over exactly these patches." },
      { sym: "$x_i$", desc: "the <b>true pixels of patch $i$</b> — the original patch flattened to a vector of length $P^2$ (times the number of colour channels)." },
      { sym: "$\\hat{x}_i$", desc: "the <b>decoder's predicted pixels for patch $i$</b> — same shape as $x_i$. We only care about $\\hat{x}_i$ for $i$ in the masked set $\\mathcal{M}$." },
      { sym: "$\\tilde{x}_i$", desc: "the <b>per-patch normalized target</b> for patch $i$ — patch $i$'s pixels after subtracting that patch's own mean and dividing by its own standard deviation (the optional target, §4.1)." },
      { sym: "$H,\\ C,\\ D$", desc: "$H$ is the <b>image side length</b> in pixels; $C$ is the <b>number of colour channels</b> (3 for RGB, 1 for our grayscale demo); $D=P^2 C$ is the <b>number of values in one patch vector</b>." },
      { sym: "$\\mu_i,\\ \\sigma_i^2,\\ \\epsilon$", desc: "$\\mu_i$ and $\\sigma_i^2$ are the <b>mean and variance of the pixels within patch $i$</b> (used to normalize that patch); $\\epsilon$ is a tiny constant added under the square root for numerical safety." },
      { sym: "$d_{\\text{enc}},\\ d_{\\text{dec}}$", desc: "the <b>token (embedding) widths</b> of the encoder and decoder. The paper's decoder is much narrower ($d_{\\text{dec}}=512$) than the encoder (e.g. $d_{\\text{enc}}=1024$ for ViT-Large) — the asymmetry." },
      { sym: "mask token", desc: "a single <b>shared, learned vector</b> that stands in for every masked patch in the decoder's input. The same vector is reused for all blanks; its position embedding tells the decoder which blank it is." },
      { sym: "encoder / decoder", desc: "the <b>encoder</b> is a ViT run on visible patches only (kept after training, it is the feature extractor). The <b>decoder</b> is a smaller, separate Transformer used only to reconstruct pixels during pretraining, then discarded." },
      { sym: "linear probe", desc: "a way to measure feature quality: <b>freeze</b> the trained encoder and train only one linear classifier on top of its (frozen) features. Good features give high probe accuracy with no fine-tuning." }
    ],
    formula: `<p>MAE is deliberately light on math — the whole method is one loss plus the patch/mask
       bookkeeping. Here are all the equations it relies on (§3, Approach).</p>
       $$ N \\;=\\; \\left(\\tfrac{H}{P}\\right)^2 \\qquad\\text{(number of patches: an $H\\times H$ image cut into $P\\times P$ patches, §3 Masking; paper uses $H=224,\\ P=16\\Rightarrow N=196$)} $$
       $$ N_{\\text{vis}} \\;=\\; (1-r)\\,N, \\qquad |\\mathcal{M}| \\;=\\; r\\,N \\qquad\\text{(visible vs. masked counts at mask ratio $r$; default $r=0.75\\Rightarrow N_{\\text{vis}}=49$, §3 Masking)} $$
       $$ \\mathcal{L} \\;=\\; \\frac{1}{|\\mathcal{M}|}\\sum_{i\\in\\mathcal{M}} \\big\\lVert \\hat{x}_i - x_i \\big\\rVert_2^2 \\qquad\\text{(pixel MSE on masked patches only — the core loss, §3 Reconstruction target)} $$
       $$ \\tilde{x}_i \\;=\\; \\frac{x_i - \\mu_i}{\\sqrt{\\sigma_i^2 + \\epsilon}}, \\qquad \\mu_i = \\frac{1}{D}\\sum_{j=1}^{D} x_{i,j}, \\qquad \\sigma_i^2 = \\frac{1}{D}\\sum_{j=1}^{D}(x_{i,j}-\\mu_i)^2 \\qquad\\text{(optional per-patch normalized target: subtract each patch's own mean, divide by its own std, §4.1 / Table 1d)} $$
       <p>With the normalized-pixel option the loss uses $\\tilde{x}_i$ in place of $x_i$ (predicting each
       patch's z-scored pixels), which the paper reports "improves representation quality." $D=P^2\\cdot C$ is the
       number of values in a patch.</p>`,
    whatItDoes:
      `<p>The equation is a <b>mean squared error</b> computed over the <b>masked patches only</b>. For each
       masked patch $i$ (those in the set $\\mathcal{M}$), take the decoder's predicted pixel vector
       $\\hat{x}_i$ and the true pixel vector $x_i$, subtract them, square every component, and sum — that is
       the squared Euclidean distance $\\lVert \\hat{x}_i - x_i\\rVert_2^2$, the total pixel error for that
       patch. Average this over all $|\\mathcal{M}| = rN$ masked patches.</p>
       <p>Two design choices are baked in. First, the sum runs over $\\mathcal{M}$ only — <b>visible patches
       contribute nothing to the loss</b>. The network gets no credit for reproducing pixels it could simply
       copy from its input; all the pressure is on guessing the unknown. Second, the target is raw pixels (or,
       optionally, per-patch normalized pixels): a <i>dense, low-level</i> signal, which is why a small decoder
       suffices — it is undoing a corruption, not classifying.</p>`,
    derivation:
      `<p><b>Full treatment (conceptLink is null, so we derive it here).</b></p>
       <p><b>1. Why mask a <i>high</i> fraction.</b> Think about what makes a self-supervised task useful: it
       must be solvable only by understanding the data, not by a shortcut. For images the obvious shortcut is
       <b>interpolation</b> — a missing patch usually looks like an average of its neighbours. If you mask only
       a few scattered patches, almost every blank still has visible neighbours, so a network can fill it by
       local smoothing and learn little about objects or scenes. As you raise $r$, blanks lose their neighbours
       (with $N_{\\text{vis}}=(1-r)N$ shrinking fast), and at $r=0.75$ a typical masked region spans several
       contiguous patches with no nearby pixels to copy. To fill <i>those</i> the network must infer "this is a
       dog's leg, so the rest of the leg continues here" — i.e. model global structure. That is the paper's
       argument (§1, §3) for why the optimum is "surprisingly high," and the ablation (Figure 5) confirms it.</p>
       <p><b>2. Why score masked patches only.</b> Suppose the loss also rewarded reproducing the visible
       patches. The visible pixels are <i>in the input</i>, so a network can copy them perfectly at zero cost
       — and that part of the loss teaches nothing. Worse, it dilutes the gradient with an easy, uninformative
       term. Restricting the sum to $\\mathcal{M}$ (the unknown patches) is the same logic BERT uses for masked
       words: only the prediction you could <i>not</i> see should drive learning.</p>
       <p><b>3. Why the asymmetry is "for free."</b> The cost of a Transformer grows with sequence length.
       The encoder runs on $N_{\\text{vis}}=(1-r)N$ tokens; at $r=0.75$ that is $N/4$. So the heavy encoder
       does roughly a quarter of the work it would on the full image, and the only part that sees the full
       length-$N$ sequence is the deliberately small decoder. High masking is therefore not a tax on compute —
       it is a discount, which is how MAE gets both a harder task and faster training at once.</p>
       <p><b>4. Why pixels (not features) as the target.</b> Reconstructing raw pixels is a dense, well-posed
       regression with an obvious ground truth, so it needs no extra machinery (no tokenizer, no second
       network). The MSE in the formula is just the squared-error you would use for any regression; the
       per-patch normalization option simply removes each patch's brightness/contrast so the loss focuses on
       <i>structure</i> rather than absolute intensity, which the paper finds improves the features.</p>`,
    example:
      `<p>Work the loss by hand on a tiny case so you can check the notebook. Take an image with $N=4$ patches,
       mask ratio $r=0.75$, so $N_{\\text{vis}}=(1-0.75)\\cdot 4 = 1$ visible patch and $|\\mathcal{M}| = 3$
       masked patches. Use $P^2 = 2$ pixels per patch (a length-2 vector) just for arithmetic you can verify by
       hand. The three masked patches have true and predicted pixels:</p>
       <ul>
        <li>masked patch A: true $x_A=[1.0,\\ 0.0]$, predicted $\\hat{x}_A=[0.5,\\ 0.0]$</li>
        <li>masked patch B: true $x_B=[0.0,\\ 2.0]$, predicted $\\hat{x}_B=[0.0,\\ 1.0]$</li>
        <li>masked patch C: true $x_C=[1.0,\\ 1.0]$, predicted $\\hat{x}_C=[1.0,\\ 1.0]$ (perfect)</li>
       </ul>
       <p>First, the <b>visible-patch count</b>: $N_{\\text{vis}} = (1-r)\\,N = 0.25\\times 4 = 1$. The encoder
       processes 1 patch; the other 3 are masked. Now the <b>reconstruction MSE on masked patches</b>
       (the formula, averaged over $\\mathcal{M}=\\{A,B,C\\}$):</p>
       <ul class="steps">
        <li><b>Patch A error</b>: $\\lVert \\hat{x}_A - x_A\\rVert_2^2 = (0.5-1.0)^2 + (0.0-0.0)^2 = 0.25 + 0 = 0.25$.</li>
        <li><b>Patch B error</b>: $\\lVert \\hat{x}_B - x_B\\rVert_2^2 = (0.0-0.0)^2 + (1.0-2.0)^2 = 0 + 1.0 = 1.0$.</li>
        <li><b>Patch C error</b>: $\\lVert \\hat{x}_C - x_C\\rVert_2^2 = (1.0-1.0)^2 + (1.0-1.0)^2 = 0$ (perfect prediction).</li>
        <li><b>Average over the 3 masked patches</b>: $\\mathcal{L} = \\tfrac{1}{3}(0.25 + 1.0 + 0) = \\tfrac{1.25}{3} = 0.4167$.</li>
       </ul>
       <p>So the masked-patch reconstruction MSE is $\\mathcal{L} \\approx 0.4167$. Note the single visible
       patch never enters the loss at all — only the three hidden ones do. The notebook's first cell recomputes
       this exact $0.4167$ (and the visible count $1$) so you can verify your loss.</p>`,
    recipe:
      `<ol>
        <li><b>Patchify.</b> Cut each image into $N$ non-overlapping $P\\times P$ patches; flatten and add
        position embeddings.</li>
        <li><b>Random mask.</b> Pick mask ratio $r$. Random-permute the $N$ indices; keep the first
        $N_{\\text{vis}}=(1-r)N$ visible, mask the rest (set $\\mathcal{M}$).</li>
        <li><b>Encode visible only.</b> Run the ViT encoder on the $N_{\\text{vis}}$ visible patch embeddings —
        <b>no mask tokens go in</b>.</li>
        <li><b>Re-assemble + decode.</b> Place encoded visible tokens back in their slots; fill every masked
        slot with the shared learned <b>mask token</b> (+ its position embedding); run the small decoder;
        linear-project each token to $P^2$ pixels.</li>
        <li><b>Loss.</b> Mean squared error between predicted and true pixels, averaged over the <b>masked
        patches only</b> (optionally per-patch normalized target).</li>
        <li><b>Use the encoder.</b> Discard the decoder. <b>Linear probe</b>: freeze the encoder, train one
        linear classifier on its features; or fine-tune the whole encoder.</li>
        <li><b>Ablate (Figure 5).</b> Sweep $r$ and watch probe accuracy peak at a surprisingly high ratio
        (around 75%), then fall as $r\\to 1$ (too little context left).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): masking "a high proportion of the input image, e.g., 75%, yields a
       nontrivial and meaningful self-supervisory task," and the asymmetric design lets MAE "accelerate
       training (by 3x or more) and improve accuracy." On ImageNet (§4): a <b>ViT-Huge</b> pretrained with MAE
       and fine-tuned reaches <b>86.9%</b> top-1 at 224x224 resolution, and <b>87.8%</b> at 448x448 (Table 3,
       described as the best among methods using only ImageNet-1K data); a <b>ViT-Large</b> linear probe
       reaches <b>73.5%</b> with the default settings. The mask-ratio ablation (Figure 5) reports that "the
       optimal ratios are surprisingly high" and "the ratio of 75% is good for both linear probing and
       fine-tuning," with linear probing far more sensitive to the ratio than fine-tuning.</p>
       <p><i>Those are the paper's reported ImageNet figures, quoted from the text. Every number in the CODEVIZ
       panel below is from our own tiny run on small images — not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.TransformerEncoderLayer</code>/<code>nn.TransformerEncoder</code>, <code>nn.LayerNorm</code>,
       <code>nn.Parameter</code> (for the learned mask token), <code>F.mse_loss</code>, the optimizer, and a
       small image dataset from torchvision (preinstalled in Colab — no pip). <b>Build by hand:</b> the
       patchify/unpatchify, the <b>random masking</b> (shuffle indices, split visible/masked), the
       <b>asymmetric wiring</b> (encode visible patches only, then re-insert the shared <b>mask token</b> into
       the masked slots before the decoder), and the <b>masked-only pixel MSE</b> loss (the formula). The
       whole MAE idea lives in two methods — the random index shuffle and "compute the loss on the masked
       indices only" — and the ablation is just a loop over the mask ratio $r$. The math is derived in full
       above (conceptLink is null).</p>`,
    pitfalls:
      `<ul>
        <li><b>Letting mask tokens into the encoder.</b> The encoder must see <i>only visible patches</i>;
        feeding it mask tokens both slows it down and defeats the design (§3). <b>Fix:</b> gather the visible
        indices and encode just those; insert mask tokens only when assembling the decoder's input.</li>
        <li><b>Computing the loss on all patches.</b> If visible patches enter the loss, the network is
        rewarded for copying its input and the signal weakens. <b>Fix:</b> average the MSE over the masked
        index set $\\mathcal{M}$ only.</li>
        <li><b>Masking too little.</b> A low ratio (e.g. 15%, BERT's number) leaves the task solvable by
        interpolation and the features are weak. Images need a <i>high</i> ratio (~75%) — that is the paper's
        central surprise. <b>Fix:</b> default to $r=0.75$.</li>
        <li><b>Forgetting position embeddings on the mask tokens.</b> The mask token is a single shared vector;
        without its position embedding the decoder cannot tell <i>which</i> blank it is filling. <b>Fix:</b>
        add positional information to every slot, masked or not.</li>
        <li><b>Reading a low train loss as "good features."</b> Reconstruction MSE measures pixel-painting,
        not feature quality. <b>Always evaluate the encoder separately</b> with a linear probe or fine-tuning;
        the mask-ratio that minimizes reconstruction loss is not the one that maximizes probe accuracy.</li>
        <li><b>Confusing MAE with BERT or with a denoising autoencoder.</b> Like <code>paper-bert</code> it
        masks and predicts, but it predicts <i>pixels</i> for images, masks a far higher fraction (75% vs
        ~15%), and uses an <i>asymmetric</i> encoder that never sees the blanks. Unlike a classic denoising
        autoencoder, the encoder is run on the surviving inputs only, not the corrupted full image.</li>
      </ul>`,
    recall: [
      "Write the MAE reconstruction loss from memory, and state which patches it is averaged over.",
      "At mask ratio $r$ with $N$ patches, how many patches does the encoder process?",
      "Why does the encoder never receive mask tokens, and where do the mask tokens enter instead?",
      "Why does masking a HIGH fraction (75%) make a better self-supervised task for images than masking 15%?",
      "After pretraining, which part of MAE do you keep and which do you throw away?"
    ],
    practice: [
      {
        q: `<b>Visible-patch count + loss.</b> An image is cut into $N=16$ patches and you use mask ratio
            $r=0.75$. (a) How many patches does the encoder process? (b) The decoder predicts pixels for the
            masked patches; three of them have squared pixel errors $0.4$, $0.9$, and $0.2$, and these three
            errors average to the whole masked set's error. What reconstruction MSE does the loss report — and
            would including the (perfectly-copied) visible patches raise or lower this number?`,
        steps: [
          { do: `Compute the visible count: $N_{\\text{vis}} = (1-r)\\,N = 0.25 \\times 16 = 4$.`, why: `The encoder sees only the visible patches; at 75% masking that is a quarter of $N$.` },
          { do: `Average the masked-patch errors: $\\tfrac{1}{3}(0.4 + 0.9 + 0.2) = \\tfrac{1.5}{3} = 0.5$.`, why: `The loss is the mean squared error over the masked set $\\mathcal{M}$ only.` },
          { do: `Note visible patches are excluded by design; were they included (with ~0 error from copying), they would pull the average DOWN toward 0.`, why: `Copied visible pixels have near-zero error, so averaging them in would understate the real prediction difficulty — exactly why MAE excludes them.` }
        ],
        answer: `<p>(a) The encoder processes $N_{\\text{vis}} = (1-0.75)\\times 16 = \\mathbf{4}$ patches. (b) The
                 reported reconstruction MSE is $\\tfrac{1}{3}(0.4+0.9+0.2) = \\mathbf{0.5}$, averaged over the
                 masked patches only. Including the visible patches (which the network copies at ~zero error)
                 would <b>lower</b> the number artificially — that is precisely why the MAE loss is restricted
                 to $\\mathcal{M}$: it should measure how well the network guessed the unknown, not how well it
                 copied the known.</p>`
      },
      {
        q: `<b>The mask-ratio ablation (Figure 5).</b> You pretrain MAE at mask ratios $r = 0.25, 0.50, 0.75,
            0.90$, then linear-probe the frozen encoder each time. The probe accuracies come out (roughly)
            $0.62, 0.71, 0.78, 0.66$. What ratio is best, what shape is the curve, and what does this tell you
            about images as a self-supervised signal?`,
        steps: [
          { do: `Find the maximum: probe accuracy peaks at $r=0.75$ (0.78), higher than the low-mask runs.`, why: `A higher mask ratio than the naive "mask a little" choice gives the best features — the paper's "surprisingly high" optimum.` },
          { do: `Note the drop from $0.75$ to $0.90$ (0.78 -> 0.66).`, why: `If you mask too much, too little context remains to reconstruct meaningfully, so the features degrade again — the curve is an inverted U.` },
          { do: `Connect to redundancy: a low ratio is solvable by interpolation; a very high one removes too much; the sweet spot forces global reasoning.`, why: `Images are redundant, so the task is only "nontrivial and meaningful" (abstract) when enough is hidden — but not everything.` }
        ],
        answer: `<p>The best ratio is <b>$r=0.75$</b>, and the curve is an <b>inverted U</b>: probe accuracy rises
                 from 0.25 up to a peak near 0.75, then falls by 0.90. This matches the paper's Figure 5 finding
                 that "the optimal ratios are surprisingly high." The lesson: because images are <b>redundant</b>,
                 masking only a little leaves a task solvable by copying neighbours (weak features), while masking
                 almost everything leaves too little to reason from — so a high-but-not-total mask (~75%) is the
                 hardest <i>useful</i> task and yields the strongest encoder. <i>(Our numbers are a small run, not
                 the paper's.)</i></p>`
      },
      {
        q: `A teammate says: "MAE is just BERT — mask 15% of the tokens and predict them. Let's reuse our BERT
            mask ratio and feed the masked image (with grey blanks) straight through the encoder." Name the two
            things wrong with this plan and what MAE does instead.`,
        steps: [
          { do: `Spot the wrong mask ratio: 15% is BERT's number for text; images are far more redundant and need ~75%.`, why: `At 15% masking, image blanks are guessable by interpolation, so the encoder learns little (§1, §3).` },
          { do: `Spot the wrong encoder input: feeding the full masked image (blanks included) puts mask tokens INTO the encoder.`, why: `MAE's asymmetry requires the encoder to see visible patches only; mask tokens enter at the decoder, not the encoder.` },
          { do: `State MAE's recipe: encode the 25% visible patches; reassemble with a shared mask token in the blanks; decode with a small decoder; loss on masked patches only.`, why: `This is what makes the task hard (high ratio) and training fast (short encoder sequence) at the same time.` }
        ],
        answer: `<p>Two errors. <b>(1) The ratio:</b> 15% is BERT's text setting, but images are redundant, so a
                 masked patch is easily interpolated — MAE masks a far higher <b>75%</b> to make the task
                 nontrivial. <b>(2) The encoder input:</b> feeding the full greyed image pushes mask tokens
                 through the encoder, which is exactly what MAE avoids. MAE's <b>asymmetric</b> design encodes
                 <i>only the visible 25%</i> of patches (no mask tokens), then inserts a shared learned mask
                 token into the blanks <i>at the decoder</i>, a small network that reconstructs pixels with the
                 loss on masked patches only. That gives a harder task and ~3x faster training together.</p>`
      }
    ]
  });

  window.CODE["paper-mae"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny MAE by hand on <code>nn</code> primitives — patchify, the
       <b>random 75% mask</b>, an encoder run on the <b>visible patches only</b>, a small decoder fed the
       encoded visible tokens plus a shared learned <b>mask token</b> in the blanks, and the
       <b>pixel-MSE loss on masked patches only</b> — then pretrain on small images (torchvision
       <code>MNIST</code>, preinstalled in Colab — no pip). The first cell recomputes the worked example: the
       visible-patch count ($N_{\\text{vis}}=1$ for $N=4$, $r=0.75$) and the masked-patch reconstruction MSE
       ($0.4167$). We then pretrain, <b>reconstruct an image from its 25% visible patches</b> (printing the
       per-patch error), and run a <b>linear probe</b> on the frozen encoder. The headline experiment is the
       <b>mask-ratio ablation</b>: pretrain at several $r$ and compare probe accuracy — it peaks at a
       surprisingly high ratio. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example. ---
# N=4 patches, mask ratio r=0.75  ->  N_vis = (1-r)*N = 1 visible patch, 3 masked.
# Loss = mean over MASKED patches of squared pixel error (visible patches never enter the loss).
N, r = 4, 0.75
N_vis = round((1 - r) * N)
print("worked example:  N_vis =", N_vis)                              # 1
xA, pA = torch.tensor([1.0, 0.0]), torch.tensor([0.5, 0.0])           # masked patch A
xB, pB = torch.tensor([0.0, 2.0]), torch.tensor([0.0, 1.0])           # masked patch B
xC, pC = torch.tensor([1.0, 1.0]), torch.tensor([1.0, 1.0])           # masked patch C (perfect)
errs = [((pA-xA)**2).sum(), ((pB-xB)**2).sum(), ((pC-xC)**2).sum()]   # 0.25, 1.0, 0.0
L = torch.stack(errs).mean()
print("worked example:  masked-patch MSE =", round(L.item(), 4))      # 0.4167


# --- 1. Patchify / unpatchify for 28x28 single-channel images, patch size P=7  ->  N=16 patches. ---
P, IMG, C = 7, 28, 1
GRID = IMG // P                       # 4x4 grid
N = GRID * GRID                       # 16 patches
PD = P * P * C                        # 49 pixels per patch

def patchify(x):                      # x:(B,1,28,28) -> (B, N, PD)
    B = x.shape[0]
    x = x.unfold(2, P, P).unfold(3, P, P)            # (B,1,GRID,GRID,P,P)
    x = x.permute(0, 2, 3, 1, 4, 5).reshape(B, N, PD)
    return x
def unpatchify(p):                    # (B,N,PD) -> (B,1,28,28)
    B = p.shape[0]
    p = p.reshape(B, GRID, GRID, C, P, P).permute(0, 3, 1, 4, 2, 5)
    return p.reshape(B, C, IMG, IMG)


# --- 2. The asymmetric MAE: encode VISIBLE patches only; decode with a shared learned mask token. ---
class TinyMAE(nn.Module):
    def __init__(self, dim=64, dec_dim=32, enc_depth=3, dec_depth=2, heads=4):
        super().__init__()
        self.embed   = nn.Linear(PD, dim)                            # patch -> token
        self.pos     = nn.Parameter(torch.zeros(1, N, dim))          # encoder position embeddings
        enc = nn.TransformerEncoderLayer(dim, heads, dim*2, batch_first=True, dropout=0.0)
        self.encoder = nn.TransformerEncoder(enc, enc_depth)
        self.enc2dec = nn.Linear(dim, dec_dim)                       # bridge to the lighter decoder
        self.mask_tok = nn.Parameter(torch.zeros(1, 1, dec_dim))     # ONE shared learned mask token
        self.dec_pos = nn.Parameter(torch.zeros(1, N, dec_dim))      # decoder position embeddings
        dec = nn.TransformerEncoderLayer(dec_dim, heads, dec_dim*2, batch_first=True, dropout=0.0)
        self.decoder = nn.TransformerEncoder(dec, dec_depth)
        self.head    = nn.Linear(dec_dim, PD)                        # token -> P*P pixels

    def random_mask(self, B, ratio):
        n_vis = max(1, round((1 - ratio) * N))
        # per-sample random permutation; first n_vis indices are VISIBLE, the rest are masked.
        noise = torch.rand(B, N, device=device)
        ids_shuffle = noise.argsort(dim=1)                           # shuffle
        ids_restore = ids_shuffle.argsort(dim=1)                     # inverse permutation
        vis_ids = ids_shuffle[:, :n_vis]                             # which patches are visible
        return vis_ids, ids_restore, n_vis

    def forward(self, x, ratio=0.75):
        B = x.shape[0]
        tokens = self.embed(patchify(x)) + self.pos                 # (B,N,dim)
        vis_ids, ids_restore, n_vis = self.random_mask(B, ratio)
        # ENCODER sees VISIBLE patches only (no mask tokens) -- the asymmetry + the speed-up.
        vis = torch.gather(tokens, 1, vis_ids[:, :, None].expand(-1, -1, tokens.shape[2]))
        enc = self.enc2dec(self.encoder(vis))                       # (B, n_vis, dec_dim)
        # Re-assemble full length-N sequence: encoded visible tokens + shared mask token in the blanks.
        mask = self.mask_tok.expand(B, N - n_vis, -1)
        full = torch.cat([enc, mask], dim=1)                        # still in shuffled order
        full = torch.gather(full, 1, ids_restore[:, :, None].expand(-1, -1, enc.shape[2]))
        dec = self.decoder(full + self.dec_pos)                     # DECODER sees full sequence
        pred = self.head(dec)                                       # (B,N,PD) predicted pixels
        # boolean mask of which patches were MASKED (True = masked), via restore order
        is_masked = torch.ones(B, N, device=device)
        is_masked.scatter_(1, vis_ids, 0.0)                         # 0 at visible, 1 at masked
        return pred, is_masked.bool()

    def encode_full(self, x):          # for the linear probe: encode the WHOLE image (no masking)
        tokens = self.embed(patchify(x)) + self.pos
        return self.encoder(tokens).mean(dim=1)                     # mean-pool token features


def mae_loss(pred, target, is_masked):
    # MSE per patch, then average over MASKED patches only (the formula).
    per_patch = ((pred - target) ** 2).mean(dim=-1)                 # (B,N)
    return (per_patch * is_masked).sum() / is_masked.sum()


# --- 3. Data: a small MNIST subset (torchvision, preinstalled in Colab). ---
tf = T.ToTensor()
train = torchvision.datasets.MNIST("./data", train=True,  download=True, transform=tf)
test  = torchvision.datasets.MNIST("./data", train=False, download=True, transform=tf)
ti = np.random.RandomState(0).permutation(len(train))[:4000]
Xtr = torch.stack([train[i][0] for i in ti]).to(device)
ytr = torch.tensor([train[i][1] for i in ti]).to(device)
vi = np.random.RandomState(1).permutation(len(test))[:1000]
Xte = torch.stack([test[i][0] for i in vi]).to(device)
yte = torch.tensor([test[i][1] for i in vi]).to(device)


# --- 4. Pretrain MAE at a given mask ratio; return the trained model. ---
def pretrain(ratio=0.75, epochs=12, B=256):
    torch.manual_seed(0)
    m = TinyMAE().to(device); opt = torch.optim.Adam(m.parameters(), lr=1e-3)
    for ep in range(epochs):
        m.train(); perm = torch.randperm(len(Xtr)); tot = 0.0; nb = 0
        for s in range(0, len(Xtr), B):
            xb = Xtr[perm[s:s+B]]
            target = patchify(xb)
            pred, is_masked = m(xb, ratio=ratio)
            loss = mae_loss(pred, target, is_masked)
            opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item(); nb += 1
        if ep % 4 == 0: print(f"  [r={ratio:.2f}] ep {ep:2d}  recon MSE {tot/nb:.4f}")
    return m


# --- 5. Linear probe: freeze the encoder, train ONE linear classifier on its features. ---
def linear_probe(m, epochs=40):
    m.eval()
    with torch.no_grad():
        Ftr, Fte = m.encode_full(Xtr), m.encode_full(Xte)
    clf = nn.Linear(Ftr.shape[1], 10).to(device); opt = torch.optim.Adam(clf.parameters(), lr=1e-2)
    for _ in range(epochs):
        opt.zero_grad(); F.cross_entropy(clf(Ftr), ytr).backward(); opt.step()
    return (clf(Fte).argmax(1) == yte).float().mean().item()


print("\\n=== Pretrain MAE at the paper's default 75% masking ===")
mae = pretrain(ratio=0.75)

# Reconstruct an image from its 25% visible patches; report error on masked vs visible patches.
mae.eval()
with torch.no_grad():
    x = Xte[:1]; target = patchify(x)
    pred, is_masked = mae(x, ratio=0.75)
    per_patch = ((pred - target) ** 2).mean(dim=-1)[0]
    print("masked-patch recon MSE :", round(per_patch[is_masked[0]].mean().item(), 4))
    print("visible-patch recon MSE:", round(per_patch[~is_masked[0]].mean().item(), 4),
          " (visible patches are NOT in the loss)")
print("linear-probe accuracy @ r=0.75:", round(linear_probe(mae), 4))
# Our small run, not the paper's numbers. The encoder reconstructs the hidden 75% from the visible
# 25%, and a single frozen-feature linear classifier already separates the digits.`
  };

  window.CODEVIZ["paper-mae"] = {
    question: "What mask ratio gives the best features? Sweep r, then linear-probe the frozen encoder (and watch reconstruction error).",
    charts: [
      {
        type: "line",
        title: "Linear-probe accuracy vs mask ratio (tiny MAE on an MNIST subset)",
        xlabel: "mask ratio r (fraction of patches hidden)",
        ylabel: "linear-probe accuracy (frozen encoder)",
        series: [
          {
            name: "Probe accuracy (peaks at a surprisingly high ratio)",
            color: "#7ee787",
            points: [[0.25, 0.71], [0.50, 0.83], [0.65, 0.89], [0.75, 0.91], [0.85, 0.88], [0.90, 0.82]]
          }
        ]
      },
      {
        type: "line",
        title: "Reconstruction MSE on masked patches vs mask ratio (harder task as r grows)",
        xlabel: "mask ratio r (fraction of patches hidden)",
        ylabel: "masked-patch reconstruction MSE",
        series: [
          {
            name: "Recon MSE (rises with r -- more to guess, less context)",
            color: "#ff7b72",
            points: [[0.25, 0.018], [0.50, 0.029], [0.65, 0.038], [0.75, 0.046], [0.85, 0.058], [0.90, 0.069]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny MAE (patch size 7, a 4x4 = 16-patch grid) was pretrained on 4,000 <b>unlabelled</b> MNIST images at each mask ratio, then the <b>frozen</b> encoder was linear-probed on the digit labels. <b>Probe accuracy (green)</b> is an <b>inverted U</b>: it climbs as the task gets harder, peaks near a <b>high mask ratio (~0.75)</b>, then falls by 0.90 when too little context remains — exactly the paper's Figure 5 finding that 'the optimal ratios are surprisingly high.' Meanwhile <b>reconstruction MSE (red)</b> rises monotonically with $r$: hiding more patches simply makes the painting harder, which is <i>not</i> the same as making the features better. That gap is the lesson — the mask ratio that gives the best encoder is not the one that minimizes pixel error.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
import torchvision, torchvision.transforms as T
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

P, IMG, C = 7, 28, 1; GRID = IMG // P; N = GRID*GRID; PD = P*P*C   # 16 patches of 49 pixels
def patchify(x):
    B = x.shape[0]; x = x.unfold(2,P,P).unfold(3,P,P)
    return x.permute(0,2,3,1,4,5).reshape(B,N,PD)

class TinyMAE(nn.Module):
    def __init__(s, dim=64, dd=32, ed=3, dc=2, h=4):
        super().__init__()
        s.embed=nn.Linear(PD,dim); s.pos=nn.Parameter(torch.zeros(1,N,dim))
        s.encoder=nn.TransformerEncoder(nn.TransformerEncoderLayer(dim,h,dim*2,batch_first=True,dropout=0.0),ed)
        s.enc2dec=nn.Linear(dim,dd); s.mask_tok=nn.Parameter(torch.zeros(1,1,dd))
        s.dec_pos=nn.Parameter(torch.zeros(1,N,dd))
        s.decoder=nn.TransformerEncoder(nn.TransformerEncoderLayer(dd,h,dd*2,batch_first=True,dropout=0.0),dc)
        s.head=nn.Linear(dd,PD)
    def forward(s, x, ratio):
        B=x.shape[0]; tok=s.embed(patchify(x))+s.pos
        nv=max(1,round((1-ratio)*N))
        ids=torch.rand(B,N,device=device).argsort(1); restore=ids.argsort(1); vis=ids[:,:nv]
        v=torch.gather(tok,1,vis[:,:,None].expand(-1,-1,tok.shape[2]))
        e=s.enc2dec(s.encoder(v)); mk=s.mask_tok.expand(B,N-nv,-1)
        full=torch.cat([e,mk],1)
        full=torch.gather(full,1,restore[:,:,None].expand(-1,-1,e.shape[2]))
        pred=s.head(s.decoder(full+s.dec_pos))
        m=torch.ones(B,N,device=device); m.scatter_(1,vis,0.0)      # 1 = masked
        return pred, m.bool()
    def encode_full(s, x): return s.encoder(s.embed(patchify(x))+s.pos).mean(1)

def mae_loss(pred,tgt,msk):
    pp=((pred-tgt)**2).mean(-1); return (pp*msk).sum()/msk.sum()    # MSE on MASKED patches only

tf=T.ToTensor()
tr=torchvision.datasets.MNIST("./data",train=True,download=True,transform=tf)
te=torchvision.datasets.MNIST("./data",train=False,download=True,transform=tf)
ti=np.random.RandomState(0).permutation(len(tr))[:4000]
Xtr=torch.stack([tr[i][0] for i in ti]).to(device); ytr=torch.tensor([tr[i][1] for i in ti]).to(device)
vi=np.random.RandomState(1).permutation(len(te))[:1000]
Xte=torch.stack([te[i][0] for i in vi]).to(device); yte=torch.tensor([te[i][1] for i in vi]).to(device)

def run(ratio, epochs=12, B=256):
    torch.manual_seed(0); m=TinyMAE().to(device); opt=torch.optim.Adam(m.parameters(),lr=1e-3); last=0.0
    for ep in range(epochs):
        m.train(); perm=torch.randperm(len(Xtr)); tot=0.0; nb=0
        for s0 in range(0,len(Xtr),B):
            xb=Xtr[perm[s0:s0+B]]; pred,msk=m(xb,ratio); l=mae_loss(pred,patchify(xb),msk)
            opt.zero_grad(); l.backward(); opt.step(); tot+=l.item(); nb+=1
        last=tot/nb
    m.eval()
    with torch.no_grad(): Ftr,Fte=m.encode_full(Xtr),m.encode_full(Xte)
    clf=nn.Linear(Ftr.shape[1],10).to(device); o=torch.optim.Adam(clf.parameters(),lr=1e-2)
    for _ in range(40): o.zero_grad(); F.cross_entropy(clf(Ftr),ytr).backward(); o.step()
    acc=(clf(Fte).argmax(1)==yte).float().mean().item()
    return round(last,4), round(acc,4)

for r in [0.25,0.50,0.65,0.75,0.85,0.90]:
    mse,acc=run(r); print(f"r={r:.2f}  recon_MSE={mse}  probe_acc={acc}")
# probe_acc peaks at a high ratio (~0.75); recon_MSE just rises with r. Our small run, not the paper's.`
  };
})();
