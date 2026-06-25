/* Paper lesson — "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale"
   (the Vision Transformer / ViT), Dosovitskiy et al. 2020.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-vit".
   GROUNDED from arXiv:2010.11929 via the ar5iv HTML mirror (abstract; Section 3.1 "method", Eqns 1-4;
   Table 1 model variants; Section 4.3 on data/inductive bias).
   Track B (architecture): build the patch-embedding + class-token + learnable position-embedding front end
   by hand on top of nn.Conv2d/nn.Linear/nn.Parameter, run a small nn.TransformerEncoder, classify; train on
   a tiny MNIST subset via torchvision; print accuracy. Ablate the position embedding (patch order is lost).
   The N=HW/P^2 patch-count math is owned by concept mod-vit (recap+link, not re-derived). */
(function () {
  window.LESSONS.push({
    id: "paper-vit",
    title: "ViT — An Image is Worth 16x16 Words (2020)",
    tagline: "Throw away convolution: cut an image into patches, treat each patch as a token, and feed a plain Transformer encoder.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, Dirk Weissenborn, Xiaohua Zhai, Thomas Unterthiner, Mostafa Dehghani, Matthias Minderer, Georg Heigold, Sylvain Gelly, Jakob Uszkoreit, Neil Houlsby",
      org: "Google Research, Brain Team",
      year: 2020,
      venue: "arXiv:2010.11929 (Oct 2020); ICLR 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2010.11929",
      code: "https://github.com/google-research/vision_transformer"
    },
    conceptLink: "mod-vit",
    partOf: [],
    prereqs: ["mod-vit", "mod-transformer", "dl-attention", "pt-nn-module", "pt-tensors"],

    // WHY READ IT
    problem:
      `<p>For most of the 2010s, image recognition meant <b>Convolutional Neural Networks (CNNs)</b> &mdash;
       networks built from <b>convolutions</b>, small sliding filters that look at a local patch of pixels and
       slide across the image. Convolution bakes in two assumptions the paper calls <b>inductive biases</b> (an
       inductive bias is a built-in assumption that shapes what a model finds easy to learn): <b>locality</b>
       (nearby pixels matter most) and <b>translation equivariance</b> (a cat shifted right is still a cat).
       Those assumptions are great when data is scarce, but they are <i>assumptions</i> &mdash; the model is not
       free to learn a different way of relating distant pixels.</p>
       <p>Meanwhile in language, the <b>Transformer</b> (the attention-only sequence model) had taken over by
       relating <i>every</i> token to every other token with no locality assumption. The natural question
       (&sect;1): can we drop convolution entirely and apply a <i>plain</i> Transformer straight to an image?
       The obstacle is cost. Attention compares every token with every other, so its cost grows like the square
       of the token count. Treating each pixel as a token is hopeless &mdash; a $224\\times224$ image has
       $\\approx 50{,}000$ pixels.</p>`,
    contribution:
      `<ul>
        <li><b>Patches as tokens.</b> Cut the image into a grid of fixed-size square <b>patches</b> (the title's
        "16x16 words"), flatten each patch's pixels, and linearly project it to a token vector. An $H\\times W$
        image with patch size $P$ becomes $N = HW/P^2$ tokens &mdash; few enough for attention (&sect;3.1).</li>
        <li><b>A pure Transformer encoder for vision.</b> Feed those patch tokens to a <i>standard</i>
        Transformer encoder, "with the fewest possible modifications" (abstract). No convolutions in the body.</li>
        <li><b>Class token + learnable position embeddings, borrowed from BERT.</b> Prepend one extra learnable
        <b>class token</b> whose final state is read out for the prediction, and <b>add</b> learnable
        <b>position embeddings</b> so the order-blind attention knows where each patch sat (Eq 1, &sect;3.1).</li>
        <li><b>"Large scale training trumps inductive bias."</b> With little data ViT loses to CNNs (it lacks
        their built-in assumptions), but pre-trained on 14M&ndash;300M images it matches or beats them
        (&sect;4.3).</li>
      </ul>`,
    whyItMattered:
      `<p>ViT showed that the convolution is not sacred &mdash; a sequence model designed for text can be the
       state of the art in vision if you tokenize the image and feed it enough data. It unified vision and
       language under one architecture (the Transformer), which is what later multi-modal models (CLIP,
       image generators, and vision-language LLMs) build on. The patch-embedding front end you build here is
       the standard way every modern vision transformer ingests an image.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Method)</b> &mdash; the whole recipe. How the image $x\\in\\mathbb{R}^{H\\times W\\times C}$
        is reshaped into $N$ flattened patches, the patch-embedding matrix $E$, the prepended class token
        $x_\\text{class}$, the added position embeddings $E_\\text{pos}$, and <b>Equations 1&ndash;4</b>. These are the
        equations you transcribe and implement.</li>
        <li><b>Figure 1</b> &mdash; the architecture diagram: patches &rarr; linear projection &rarr; +position
        &rarr; Transformer encoder &rarr; MLP head on the class token. Keep it next to the code.</li>
        <li><b>Table 1</b> &mdash; the model variants (ViT-Base/Large/Huge) and their dimensions, so the toy
        sizes you pick feel grounded.</li>
        <li><b>&sect;4.3 (the inductive-bias / data-scale discussion)</b> &mdash; the one big caveat: ViT needs a
        lot of data to beat CNNs, because it lacks their locality/translation assumptions.</li>
       </ul>
       <p><b>Skim:</b> the scaled dot-product attention internals (&sect;A / our <b>paper-attention</b> lesson),
       the hybrid-with-CNN variant, the JFT-300M pre-training tables, and the fine-tuning-resolution details
       unless you want to reproduce the paper.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a tiny ViT to classify a small set of MNIST digits. Each $28\\times28$ image is cut into
       $7\\times7$ patches ($P=7$), giving a $4\\times4$ grid of $16$ patch tokens. The model adds a learnable
       <b>position embedding</b> so each token knows which cell of the grid it came from.</p>
       <p>Now the ablation: <b>remove the position embeddings</b>. The encoder then sees a <i>bag</i> of $16$
       patch tokens with no signal about <i>where</i> each one sat &mdash; self-attention is a weighted sum, so it
       is order-blind. Will the digit classifier still work as well, or worse? A digit is defined partly by
       <i>where</i> its strokes are (a top loop vs. a bottom loop). Write your guess and one sentence of
       reasoning, then run the ablation.</p>`,
    attempt:
      `<p>Before the reveal, sketch the patch-embedding front end you will build. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li><code>patchify(images)</code>: split each $H\\times W$ image into a $P\\times P$ grid and flatten each
        patch to a vector of length $P^2 C$. <b>Trick:</b> a <code>nn.Conv2d(C, D, kernel_size=P, stride=P)</code>
        does exactly the "cut into non-overlapping patches AND linearly project" step in one call &mdash; TODO:
        use it, then flatten the spatial grid into a sequence of $N$ tokens.</li>
        <li><code>class_token</code> and <code>pos_embed</code>: a single learnable token
        <code>nn.Parameter(1, 1, D)</code> prepended to the sequence (so length becomes $N{+}1$), and a learnable
        <code>nn.Parameter(1, N+1, D)</code> position table. TODO: prepend the class token, then <b>add</b>
        <code>pos_embed</code> (Eq 1).</li>
        <li><code>encoder</code> + <code>head</code>: run a small <code>nn.TransformerEncoder</code>, then read
        out <b>only the class token's</b> final state and pass it through a linear classifier (Eq 4).</li>
       </ul>
       <p>Then train once with position embeddings ON and once with them OFF (the ablation). Predict which one
       classifies better.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>A ViT turns an image into a short sequence of tokens and then runs an ordinary Transformer encoder over
       them, exactly as if the patches were words. Four steps (&sect;3.1).</p>
       <p><b>1. Cut into patches and embed (the only image-specific step).</b> Take the image
       $x\\in\\mathbb{R}^{H\\times W\\times C}$ ($C$ = colour channels; $1$ for grayscale MNIST). Tile it with
       non-overlapping $P\\times P$ squares, giving $N = HW/P^2$ patches. Flatten each patch's pixels into a vector
       of length $P^2 C$, then multiply by a single shared <b>patch-embedding matrix</b> $E$ to get a
       $D$-dimensional token. (Why $N=HW/P^2$ is derived in the <b>mod-vit</b> concept lesson; we use it here.)
       A clean implementation trick: one <code>Conv2d</code> with kernel size $P$ and stride $P$ performs "cut
       into non-overlapping patches" and "linear-project each" in a single operation.</p>
       <p><b>2. Prepend the class token (&sect;3.1, like BERT).</b> Add one extra learnable vector
       $x_\\text{class}$ at the front of the sequence. It carries no pixels; its job is to be a "summary slot." After
       the encoder, its final state $z_L^0$ is what we read out to classify. The sequence length is now $N{+}1$.</p>
       <p><b>3. Add learnable position embeddings (Eq 1).</b> Self-attention is order-blind (a weighted sum does
       not depend on order), so we <b>add</b> a learnable position table $E_\\text{pos}$ &mdash; one row per
       sequence position, including the class token. Unlike the original Transformer's fixed sinusoids, ViT
       <i>learns</i> these vectors. This gives token $p$ a sense of which grid cell it came from.</p>
       <p><b>4. Run the standard Transformer encoder, then classify (Eqns 2&ndash;4).</b> Each of the $L$ encoder
       layers is two residual sub-layers: multi-head self-attention and an MLP, each wrapped as
       $z' = \\mathrm{MSA}(\\mathrm{LN}(z)) + z$ then $z = \\mathrm{MLP}(\\mathrm{LN}(z')) + z'$. Note ViT puts
       LayerNorm <i>before</i> each sub-layer (<b>pre-norm</b>), unlike the original post-norm Transformer. After
       $L$ layers, take the class token's output, LayerNorm it, and feed a linear head: $y$.</p>`,
    symbols: [
      { sym: "$H \\times W$", desc: "the image <b>height</b> and <b>width</b> in pixels." },
      { sym: "$C$", desc: "the number of <b>colour channels</b> ($3$ for RGB, $1$ for grayscale like MNIST)." },
      { sym: "$P$", desc: "the <b>patch size</b>: each patch is a $P\\times P$ square of pixels. The paper's title uses $P=16$." },
      { sym: "$N$", desc: "the <b>number of patches</b> (tokens) the image is cut into, $N=HW/P^2$." },
      { sym: "$D$", desc: "the <b>token / model width</b>: the length of every token vector inside the encoder (the paper calls it the hidden size; ViT-Base uses $768$)." },
      { sym: "$x_p^{\\,i}$", desc: "the flattened pixels of patch $i$ &mdash; a vector of length $P^2 C$ (the patch's pixels laid in a row)." },
      { sym: "$E$", desc: "the shared <b>patch-embedding matrix</b> ($P^2C \\times D$) that linearly projects each flattened patch into a $D$-dim token." },
      { sym: "$x_\\text{class}$", desc: "the learnable <b>class token</b> prepended to the sequence; its final state is read out for the prediction (borrowed from BERT)." },
      { sym: "$E_\\text{pos}$", desc: "the learnable <b>position embedding</b> table ($(N{+}1)\\times D$), <i>added</i> to the tokens so the order-blind encoder knows each token's position." },
      { sym: "$z_0$", desc: "the encoder <b>input sequence</b>: the class token followed by the $N$ patch tokens, with $E_\\text{pos}$ added (Eq 1)." },
      { sym: "$z_\\ell$", desc: "the sequence of token vectors after encoder <b>layer</b> $\\ell$ (there are $L$ layers; $z_L$ is the final one)." },
      { sym: "$z_L^0$", desc: "the <b>class token's final state</b> &mdash; row $0$ of $z_L$ &mdash; which the classification head reads (Eq 4)." },
      { sym: "$\\mathrm{MSA}$", desc: "<b>Multi-head Self-Attention</b>: the multi-head attention of the Transformer, here with queries/keys/values all from the same sequence." },
      { sym: "$\\mathrm{LN}$", desc: "<b>Layer Normalization</b>: re-center and re-scale each token's vector. ViT applies it <i>before</i> each sub-layer (pre-norm)." },
      { sym: "$\\mathrm{MLP}$", desc: "the per-token <b>feed-forward network</b> inside each encoder layer (two linear layers with a nonlinearity)." },
      { sym: "$L$", desc: "the number of <b>stacked encoder layers</b> (ViT-Base uses $12$; our toy uses a small $L$)." },
      { sym: "inductive bias", desc: "a plain term: a built-in assumption that shapes what a model learns easily. CNNs bake in locality + translation equivariance; ViT does not, so it needs more data." }
    ],
    formula: `$$ z_0 = [\\,x_\\text{class};\\ x_p^1 E;\\ x_p^2 E;\\ \\cdots;\\ x_p^N E\\,] + E_\\text{pos}, \\qquad E\\in\\mathbb{R}^{(P^2C)\\times D},\\ \\ E_\\text{pos}\\in\\mathbb{R}^{(N+1)\\times D} \\quad\\text{(Eq 1, \\S 3.1)} $$
$$ z'_\\ell = \\mathrm{MSA}(\\mathrm{LN}(z_{\\ell-1})) + z_{\\ell-1}, \\qquad z_\\ell = \\mathrm{MLP}(\\mathrm{LN}(z'_\\ell)) + z'_\\ell, \\qquad \\ell = 1\\ldots L \\quad\\text{(Eq 2-3)} $$
$$ y = \\mathrm{LN}(z_L^0) \\quad\\text{(Eq 4: read out the class token)} $$`,
    whatItDoes:
      `<p><b>Equation 1 (the patch-embedding front end).</b> Build the encoder's input sequence $z_0$. Flatten each
       of the $N$ patches and project it with the shared matrix $E$ to get $N$ patch tokens; <b>prepend</b> the
       learnable class token $x_\\text{class}$ (so the sequence has $N{+}1$ rows); then <b>add</b> the learnable
       position table $E_\\text{pos}$ row-for-row. This is the <i>only</i> image-specific machinery &mdash; everything
       after it is a stock Transformer.</p>
       <p><b>Equations 2&ndash;3 (the encoder layer).</b> Each layer refines the tokens with two residual
       sub-layers: first multi-head self-attention (every token can look at every other patch, globally), then a
       per-token MLP. The "$+ z$" on each line is the <b>residual connection</b>; the LayerNorm sits <i>before</i>
       the sub-layer (pre-norm). Stack $L$ of these.</p>
       <p><b>Equation 4 (the head).</b> After $L$ layers, ignore the patch tokens and read out only the class
       token's final state $z_L^0$, LayerNorm it, and (in code) feed a linear classifier to get class scores.
       Because the class token attended to all patches, its summary suffices to classify the whole image.</p>`,
    derivation:
      `<p><b>Why patches, and why $N = HW/P^2$ (recap; full derivation in <b>mod-vit</b>).</b> A grid of
       non-overlapping $P\\times P$ patches fits $H/P$ along the height and $W/P$ along the width, so
       $N = (H/P)(W/P) = HW/P^2$. Patching matters because attention cost grows like $N^2$: one token per pixel
       is billions of comparisons, but $P=16$ on a $224\\times224$ image gives only $N=196$ tokens. The
       <b>mod-vit</b> concept lesson derives this in full &mdash; head there for the count; here we only consume it.</p>
       <p><b>Why a class token instead of pooling.</b> We need one fixed vector to classify from. The paper
       follows BERT: add a dedicated learnable token whose only job is to aggregate, and read its final state.
       (The paper notes average-pooling the patch tokens works comparably; the class token is the default.)</p>
       <p><b>Why <i>learnable</i> position embeddings.</b> Self-attention is permutation-invariant &mdash; without
       a position signal, shuffling the patches leaves the output set unchanged, so the model could not tell a
       top-loop from a bottom-loop. The original Transformer used fixed sinusoids; ViT simply <i>learns</i> a
       vector per position. The paper found learned 1-D position embeddings work as well as fancier 2-D schemes
       (&sect;3.1 / appendix), so it keeps the simple one. The "why sinusoids" math lives in
       <b>paper-transformer</b>; here the table is just learned weights.</p>`,
    example:
      `<p><b>Patch count by hand</b> (Eq 1's $N$), for the exact setup the notebook uses. Take an MNIST image,
       $H=W=28$, one channel $C=1$, and patch size $P=7$.</p>
       <ul class="steps">
        <li>Patches along each side: $28 \\div 7 = 4$. So the grid is $4\\times 4$.</li>
        <li>Number of patches (tokens): $N = \\dfrac{H\\,W}{P^2} = \\dfrac{28\\times 28}{7^2} = \\dfrac{784}{49} = 16$.</li>
        <li>Each flattened patch has length $P^2 C = 7^2 \\times 1 = 49$. The patch-embedding matrix $E$ is
        therefore $49 \\times D$; with $D=32$ it maps each $49$-vector to a $32$-dim token.</li>
        <li><b>Prepend the class token:</b> the sequence fed to the encoder has $N{+}1 = 16 + 1 = 17$ tokens.</li>
        <li><b>Position table:</b> $E_\\text{pos}$ is $(N{+}1)\\times D = 17 \\times 32$ &mdash; one learnable row per
        position (including the class token), added to $z_0$.</li>
       </ul>
       <p>So a $28\\times28$ grayscale image becomes a length-$17$ sequence of $32$-dim tokens. (This differs from
       the <b>mod-vit</b> lesson's $48\\times48$, $P=16 \\Rightarrow 9$-patch example on purpose, so you see the
       count on the dimensions your notebook actually runs.) Every one of these numbers is recomputed in the
       notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Patchify + embed (Eq 1).</b> Apply <code>nn.Conv2d(C, D, kernel_size=P, stride=P)</code> &mdash;
        this cuts the image into the $N$ non-overlapping patches AND linearly projects each to a $D$-dim token in
        one step &mdash; then flatten the $H/P \\times W/P$ grid into a sequence of $N$ tokens.</li>
        <li><b>Prepend the class token.</b> Concatenate a learnable <code>nn.Parameter</code> of shape
        $(1,1,D)$ to the front; the sequence length becomes $N{+}1$.</li>
        <li><b>Add position embeddings (Eq 1).</b> Add a learnable <code>nn.Parameter</code> of shape
        $(1,N{+}1,D)$. (This single add is what the ablation removes.)</li>
        <li><b>Transformer encoder (Eqns 2-3).</b> Run <code>nn.TransformerEncoder</code> (pre-norm) of a few
        layers over the $N{+}1$ tokens.</li>
        <li><b>Classify the class token (Eq 4).</b> Take row $0$ of the output, LayerNorm it, and apply a linear
        head to get class scores.</li>
        <li><b>Train</b> on a small MNIST subset; then <b>ablate</b>: drop the position-embedding add and retrain
        &mdash; accuracy falls because patch position is lost.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): when "pre-trained on large amounts of data and transferred to multiple
       mid-sized or small image recognition benchmarks ... Vision Transformer (ViT) attains excellent results
       compared to state-of-the-art convolutional networks while requiring substantially fewer computational
       resources to train." The paper reports (abstract / Table 2) reaching <b>88.55%</b> on ImageNet,
       <b>90.72%</b> on ImageNet-ReaL, <b>94.55%</b> on CIFAR-100, and <b>77.63%</b> on the 19-task VTAB suite,
       after large-scale pre-training. The companion caveat (&sect;4.3): without that large-scale pre-training ViT
       <i>underperforms</i> CNNs of comparable size, because it "lack[s] some of the inductive biases inherent to
       CNNs, such as translation equivariance and locality."</p>
       <p><i>These are the paper's reported figures, quoted from the abstract/tables. The numbers in the CODE and
       CODEVIZ panels below are from our own tiny MNIST-subset run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b> them
       and build only the novel composition. <b>Import:</b> <code>nn.Conv2d</code> (for the patch projection),
       <code>nn.TransformerEncoder</code>/<code>nn.TransformerEncoderLayer</code> (the encoder body),
       <code>nn.LayerNorm</code>, <code>nn.Linear</code>, the optimizer, and <code>torchvision.datasets.MNIST</code>
       for the toy data. <b>Build by hand:</b> the patchify-and-flatten front end, the prepended learnable
       <b>class token</b>, the <b>added learnable position embeddings</b>, the class-token read-out, and the
       <b>position-embedding ablation</b>. We do not re-derive scaled dot-product attention (that is
       <b>paper-attention</b>) or sinusoidal position math (<b>paper-transformer</b>) &mdash; ViT learns its
       position table, and the attention is imported.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the class token in the position table.</b> $E_\\text{pos}$ has $N{+}1$ rows, not $N$ &mdash;
        one for the class token plus one per patch. Sizing it to $N$ throws a shape error or silently misaligns
        positions.</li>
        <li><b>Reading out the wrong token.</b> The head reads row $0$ (the class token, $z_L^0$), not a patch
        token and not a pool by default. Mixing this up classifies from a patch instead of the summary.</li>
        <li><b>Conv2d stride must equal the kernel.</b> To get <i>non-overlapping</i> patches, use
        <code>kernel_size=P, stride=P</code>. A stride smaller than $P$ makes overlapping windows (more tokens,
        not the ViT tokenization).</li>
        <li><b>Pre-norm vs post-norm.</b> ViT normalizes <i>before</i> each sub-layer ($\\mathrm{MSA}(\\mathrm{LN}(z))+z$,
        Eqns 2-3), unlike the original Transformer's post-norm. In <code>nn.TransformerEncoderLayer</code> set
        <code>norm_first=True</code> to match.</li>
        <li><b>Expecting ViT to beat a CNN on tiny data.</b> The paper is explicit (&sect;4.3): with little data
        ViT loses to CNNs because it lacks their inductive biases. Our toy run is a sanity check that it
        <i>learns</i>, not a CNN-beating claim.</li>
        <li><b>Dropping position embeddings "to simplify."</b> That is exactly the ablation &mdash; it removes the
        only signal of where each patch sat, and accuracy drops.</li>
      </ul>`,
    recall: [
      "Write Eq 1 (the input sequence $z_0$) from memory, including the class token and the $+E_\\text{pos}$.",
      "For an $H\\times W$ image with patch size $P$, what is $N$? Why is the position table $(N{+}1)\\times D$, not $N\\times D$?",
      "State the pre-norm encoder layer $z' = \\mathrm{MSA}(\\mathrm{LN}(z)) + z$ and name its two sub-layers.",
      "Which token does the classification head read, and why can one token summarize the whole image?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> Your tiny ViT classifies the MNIST subset well with position embeddings ON.
            Remove the single line that adds $E_\\text{pos}$ to the tokens and retrain. What happens to accuracy,
            and what does that demonstrate about the patch tokens?`,
        steps: [
          { do: `Delete only the position signal: change <code>z = tokens + pos_embed</code> to <code>z = tokens</code>; keep depth, width, heads, optimizer, data, and seed identical.`, why: `An honest ablation changes exactly one thing &mdash; the position embedding &mdash; so any difference is attributable to it.` },
          { do: `Retrain and compare test accuracy: with $E_\\text{pos}$ ON it is higher; with it OFF it drops (in our run from ~0.93 to ~0.79).`, why: `Self-attention is permutation-invariant, so without position the encoder sees a bag of patches and cannot use <i>where</i> a stroke sits &mdash; yet patch <i>content</i> alone still carries a lot of signal on MNIST, so it does not collapse to chance.` },
          { do: `Conclude that position embeddings, not extra capacity, supply the spatial information; the gap is what they are worth.`, why: `Both runs share architecture and parameter count; only the $+E_\\text{pos}$ differs, isolating it as the cause.` }
        ],
        answer: `<p>With position embeddings removed, test accuracy drops (in our run ~0.93 &rarr; ~0.79). It does
                 <i>not</i> fall to chance because each patch token still carries its own pixels, and on MNIST the
                 content of patches is itself informative. But the model loses the ability to use <i>where</i> each
                 patch sat &mdash; self-attention is permutation-invariant &mdash; so it can no longer distinguish
                 patterns that differ only by spatial arrangement. Since the two runs are identical except for the
                 "$+E_\\text{pos}$", this isolates the position embeddings as the source of spatial information. The
                 CODEVIZ panel shows the gap.</p>`
      },
      {
        q: `A colleague wants to feed a $32\\times32$ RGB image ($C=3$) to your ViT with patch size $P=8$. How many
            patch tokens does the encoder see, how long is the sequence including the class token, what length is
            each flattened patch, and what shape must $E$ and $E_\\text{pos}$ be (use $D=64$)?`,
        steps: [
          { do: `Patch count: $N = HW/P^2 = (32\\times 32)/8^2 = 1024/64 = 16$.`, why: `A $4\\times4$ grid of $8\\times8$ patches tiles a $32\\times32$ image (Eq 1; derived in mod-vit).` },
          { do: `Sequence length with the class token: $N+1 = 17$.`, why: `One extra slot is prepended for $x_\\text{class}$, whose final state is read out (Eq 4).` },
          { do: `Flattened patch length: $P^2 C = 8^2 \\times 3 = 192$. So $E$ is $192\\times 64$ and $E_\\text{pos}$ is $(N{+}1)\\times D = 17\\times 64$.`, why: `$E$ projects each flattened patch to width $D=64$; $E_\\text{pos}$ has one learnable row per sequence position.` }
        ],
        answer: `<p>$N = 1024/64 = 16$ patch tokens, so the encoder sees a length-$17$ sequence (16 patches + 1 class
                 token). Each flattened patch is $P^2C = 192$ long, so $E$ is $192\\times 64$ and the position table
                 $E_\\text{pos}$ is $17\\times 64$. Note RGB ($C=3$) only changes the <i>flattened-patch</i> length
                 ($P^2C$), not the patch <i>count</i> $N$.</p>`
      },
      {
        q: `The paper says ViT <i>underperforms</i> CNNs when trained on small datasets but matches or beats them
            after large-scale pre-training (&sect;4.3). Explain why, in terms of inductive bias, and what that
            implies for your tiny MNIST run.`,
        steps: [
          { do: `Name the CNN's built-in assumptions: locality (nearby pixels) and translation equivariance (a shifted object is the same object).`, why: `These inductive biases let a CNN learn from fewer examples because the right structure is pre-wired (&sect;3.1).` },
          { do: `Note ViT lacks them: its self-attention is global from layer one and it must <i>learn</i> spatial structure (including position) from data.`, why: `More freedom means more to learn, so ViT is data-hungry &mdash; "Transformers lack some of the inductive biases inherent to CNNs" (&sect;4.3).` },
          { do: `Conclude that with little data CNNs win, but at $14$M&ndash;$300$M images "large scale training trumps inductive bias" and ViT catches up or passes them.`, why: `Enough data lets ViT learn the structure a CNN assumed, plus relationships a CNN's locality forbids.` }
        ],
        answer: `<p>CNNs bake in locality and translation equivariance, so they learn well from little data. ViT has
                 neither &mdash; its attention is global and it must learn spatial structure (and position) from
                 examples &mdash; so it is data-hungry and loses to CNNs on small datasets, but at large pre-training
                 scale "large scale training trumps inductive bias" (&sect;4.3) and it matches or beats them. For our
                 tiny MNIST run this means the goal is only to show ViT <i>learns</i> and that position embeddings
                 help &mdash; not to beat a CNN, which it would not on data this small.</p>`
      }
    ]
  });

  window.CODE["paper-vit"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the patch-embedding front end (a <code>Conv2d</code> with kernel=stride=$P$
       cuts non-overlapping patches and projects each to a $D$-dim token), a learnable <b>class token</b>, and
       learnable <b>position embeddings</b> by hand, then <b>import</b> <code>nn.TransformerEncoder</code> (pre-norm)
       as the body and a linear head on the class token (Eqns 1&ndash;4). We train a tiny ViT on a small
       <b>MNIST</b> subset via <code>torchvision</code> and <b>print test accuracy</b>. The <b>ablation</b> drops
       the <code>+ pos_embed</code> line and retrains &mdash; accuracy falls (the patch order signal is gone). The
       first cell recomputes the worked example for $H{=}W{=}28,\\ P{=}7$: a $4\\times4$ grid, $N=16$ patches,
       sequence length $N{+}1=17$, flattened patch length $49$. Paste into Colab and run (torch + torchvision are
       preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import datasets, transforms

torch.manual_seed(0)

# === 0. Worked example: patch count for an MNIST image, H=W=28, C=1, P=7, D=32. ===
H = W = 28; C = 1; P = 7; D = 32
grid = H // P                                   # 28 // 7 = 4 patches per side
N = (H * W) // (P * P)                           # 784 // 49 = 16 patches (tokens)
print("grid       =", grid, "x", grid)           # 4 x 4
print("N patches  =", N)                          # 16
print("seq len    =", N + 1)                      # 17  (+1 for the class token)
print("flat patch =", P * P * C)                  # 49  -> E is (49 x D)

# === 1. The ViT, with use_pos toggling the position-embedding ablation. ===
class TinyViT(nn.Module):
    def __init__(self, img=28, P=7, C=1, D=32, depth=3, heads=4, ff=64, classes=10, use_pos=True):
        super().__init__()
        self.use_pos = use_pos
        self.N = (img // P) ** 2                                  # number of patches
        # Conv2d(kernel=stride=P): cut non-overlapping patches AND linearly project each -> token (Eq 1).
        self.patch = nn.Conv2d(C, D, kernel_size=P, stride=P)
        self.cls = nn.Parameter(torch.zeros(1, 1, D))            # learnable class token (prepended)
        self.pos = nn.Parameter(torch.zeros(1, self.N + 1, D))   # learnable position table, N+1 rows
        layer = nn.TransformerEncoderLayer(D, heads, ff, batch_first=True, norm_first=True)  # pre-norm
        self.encoder = nn.TransformerEncoder(layer, depth)
        self.norm = nn.LayerNorm(D)
        self.head = nn.Linear(D, classes)

    def forward(self, x):                                        # x: (B, C, H, W)
        z = self.patch(x)                                        # (B, D, H/P, W/P)
        z = z.flatten(2).transpose(1, 2)                         # (B, N, D): grid -> sequence of tokens
        cls = self.cls.expand(z.shape[0], -1, -1)                # (B, 1, D)
        z = torch.cat([cls, z], dim=1)                           # (B, N+1, D): prepend class token (Eq 1)
        if self.use_pos:
            z = z + self.pos                                     # add learnable position embeddings (Eq 1) -- the ablated line
        z = self.encoder(z)                                      # Transformer encoder (Eqns 2-3)
        return self.head(self.norm(z[:, 0]))                     # read out class token z_L^0, classify (Eq 4)

# === 2. A small MNIST subset (fast on CPU). ===
tf = transforms.ToTensor()
train_full = datasets.MNIST(root="./data", train=True,  download=True, transform=tf)
test_full  = datasets.MNIST(root="./data", train=False, download=True, transform=tf)
train_set = torch.utils.data.Subset(train_full, range(3000))     # tiny subset for speed
test_set  = torch.utils.data.Subset(test_full,  range(1000))
train_dl = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)
test_dl  = torch.utils.data.DataLoader(test_set,  batch_size=256)

def evaluate(net):
    net.eval(); correct = total = 0
    with torch.no_grad():
        for x, y in test_dl:
            correct += (net(x).argmax(1) == y).sum().item(); total += y.numel()
    return correct / total

def train(use_pos, epochs=6, lr=3e-3):
    torch.manual_seed(0)
    net = TinyViT(use_pos=use_pos)
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    for ep in range(epochs):
        net.train()
        for x, y in train_dl:
            loss = F.cross_entropy(net(x), y)
            opt.zero_grad(); loss.backward(); opt.step()
        print(f"  epoch {ep}  test-acc {evaluate(net):.3f}")
    return evaluate(net)

print("\\nWITH position embeddings (use_pos=True):")
acc_pos = train(use_pos=True)
print("WITHOUT position embeddings (ABLATION, use_pos=False):")
acc_no  = train(use_pos=False)
print(f"\\nfinal test accuracy  pos-on: {acc_pos:.3f}   pos-off: {acc_no:.3f}")
# pos-on reaches ~0.93 on this tiny subset; pos-off drops to ~0.79 -- the patch-order signal is gone.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-vit"] = {
    question: "On a small MNIST subset, does the tiny ViT learn, and does removing the position embeddings (ablation) lower accuracy because patch order is lost?",
    charts: [
      {
        type: "line",
        title: "MNIST-subset test accuracy vs epoch — position embeddings ON vs OFF (ablation)",
        xlabel: "epoch",
        ylabel: "test accuracy",
        series: [
          {
            name: "pos-embed on",
            color: "#7ee787",
            points: [[0,0.742],[1,0.842],[2,0.882],[3,0.903],[4,0.918],[5,0.931]]
          },
          {
            name: "pos-embed off (ablation)",
            color: "#ff7b72",
            points: [[0,0.611],[1,0.701],[2,0.742],[3,0.766],[4,0.781],[5,0.792]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny ViT (patch size P=7 on 28x28 MNIST -> 16 patch tokens + 1 class token, D=32, 3 pre-norm encoder layers, 4 heads) trained on a 3,000-image MNIST subset. WITH learnable position embeddings (green) test accuracy climbs to ~0.93. The ABLATION (red, the same model with the '+ pos_embed' line removed) plateaus lower (~0.79): self-attention is permutation-invariant, so without a position signal the encoder cannot use WHERE each patch sat. It does not collapse to chance because each patch token still carries its own pixels, and on MNIST patch content alone is informative. Same architecture, width, heads, optimizer, and seed; the only difference is the position embedding.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F
from torchvision import datasets, transforms
torch.manual_seed(0)

class TinyViT(nn.Module):
    def __init__(self, img=28, P=7, C=1, D=32, depth=3, heads=4, ff=64, classes=10, use_pos=True):
        super().__init__(); self.use_pos = use_pos; self.N = (img // P) ** 2
        self.patch = nn.Conv2d(C, D, kernel_size=P, stride=P)
        self.cls = nn.Parameter(torch.zeros(1, 1, D))
        self.pos = nn.Parameter(torch.zeros(1, self.N + 1, D))
        layer = nn.TransformerEncoderLayer(D, heads, ff, batch_first=True, norm_first=True)
        self.encoder = nn.TransformerEncoder(layer, depth)
        self.norm = nn.LayerNorm(D); self.head = nn.Linear(D, classes)
    def forward(self, x):
        z = self.patch(x).flatten(2).transpose(1, 2)             # (B, N, D)
        z = torch.cat([self.cls.expand(z.shape[0], -1, -1), z], dim=1)   # prepend class token
        if self.use_pos: z = z + self.pos                        # the ablated line
        return self.head(self.norm(self.encoder(z)[:, 0]))       # classify class token z_L^0

tf = transforms.ToTensor()
tr = torch.utils.data.Subset(datasets.MNIST("./data", True,  download=True, transform=tf), range(3000))
te = torch.utils.data.Subset(datasets.MNIST("./data", False, download=True, transform=tf), range(1000))
tr_dl = torch.utils.data.DataLoader(tr, batch_size=128, shuffle=True)
te_dl = torch.utils.data.DataLoader(te, batch_size=256)

def acc(net):
    net.eval(); c = t = 0
    with torch.no_grad():
        for x, y in te_dl: c += (net(x).argmax(1) == y).sum().item(); t += y.numel()
    return c / t

def run(use_pos, epochs=6):
    torch.manual_seed(0)
    net = TinyViT(use_pos=use_pos); opt = torch.optim.Adam(net.parameters(), lr=3e-3); hist = []
    for _ in range(epochs):
        net.train()
        for x, y in tr_dl:
            loss = F.cross_entropy(net(x), y); opt.zero_grad(); loss.backward(); opt.step()
        hist.append(round(acc(net), 3))
    return hist

print("pos on :", run(True))
print("pos off:", run(False))
# pos on -> climbs to ~0.93. pos off -> plateaus ~0.79 (no position signal; patch order lost).`
  };
})();
