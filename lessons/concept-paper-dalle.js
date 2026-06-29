/* Paper lesson — "Zero-Shot Text-to-Image Generation" (DALL-E),
   Ramesh, Pavlov, Goh, Gray, Voss, Radford, Chen, Sutskever (OpenAI, ICML 2021).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-dalle".
   GROUNDED from arXiv:2102.12092 (abstract) and the ar5iv HTML mirror:
   Section 2 (the two-stage procedure, Stage 1 dVAE + Stage 2 transformer);
   Equation 1 (the evidence lower bound / ELB on the joint likelihood of
   images x, captions y, encoded tokens z); Section 2.1 (Gumbel-softmax
   relaxation for the dVAE); Section 2.2 (the 12-billion-parameter transformer,
   256 BPE text tokens with vocabulary 16384, 1024 image tokens with vocabulary
   8192). Numbers quoted only as written.
   Track: read-only (generative-model RESULT paper). No from-scratch full model.
   The CODEVIZ is OUR illustration: a tiny discrete codebook quantizes a toy
   "image" of continuous patch values into discrete tokens, and a tiny
   autoregressive sampler draws image tokens conditioned on a text token over a
   toy vocabulary. Round, made-up numbers — NOT the paper's models. */
(function () {
  window.LESSONS.push({
    id: "paper-dalle",
    title: "DALL-E — Zero-Shot Text-to-Image Generation (2021)",
    tagline: "Compress an image into discrete tokens, then let a transformer write text-then-image as one stream.",
    module: "Papers · Generative Models",
    track: "read-only",
    paper: {
      authors: "Aditya Ramesh, Mikhail Pavlov, Gabriel Goh, Scott Gray, Chelsea Voss, Alec Radford, Mark Chen, Ilya Sutskever",
      org: "OpenAI",
      year: 2021,
      venue: "ICML 2021 (arXiv:2102.12092, Feb 2021)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2102.12092",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: [],

    // WHY READ IT
    problem:
      `<p>The goal is <b>text-to-image generation</b>: you type a caption (a short
       sentence) and the model paints a matching picture. Before this paper, the
       strong systems for this were <i>domain-specific</i>. They were trained and
       tuned on one narrow dataset, often with extra hand-built parts: object
       part labels, segmentation masks (a label for every pixel saying which
       object it belongs to), or auxiliary losses tailored to that dataset.</p>
       <p>Two things made the problem hard. First, an image is a huge object. A
       color picture of size 256 by 256 has 256 times 256 pixels, and each pixel
       has three numbers (red, green, blue). That is tens of thousands of
       numbers. Second, the natural way to model a sequence with a
       <b>transformer</b> &mdash; a neural network that reads a sequence of
       tokens and predicts the next one &mdash; would need to treat every pixel
       as a token. Modeling pixels directly "would require an inordinate amount
       of memory for high-resolution images" (&sect;1). The cost of a transformer
       grows fast with sequence length, so a sequence of tens of thousands of
       pixels is out of reach.</p>
       <p>The paper asks a blunt question: can one <b>simple</b> approach, given
       enough data and scale, match those specialized systems &mdash; without any
       of the hand-built machinery, and evaluated <b>zero-shot</b> (tested on a
       dataset it never trained on)?</p>`,
    contribution:
      `<ul>
        <li><b>A two-stage recipe.</b> Stage One trains a <b>discrete variational
        autoencoder</b> (dVAE, defined below) that compresses each 256-by-256
        image into a small grid of <b>discrete tokens</b>. Stage Two trains an
        <b>autoregressive transformer</b> over the text tokens followed by those
        image tokens, "as a single stream of data" (Abstract, &sect;2).</li>
        <li><b>Generation by sampling, then decoding.</b> To make a picture from
        a caption, the transformer samples image tokens one at a time, each
        conditioned on the caption and the tokens drawn so far. The dVAE decoder
        then turns that grid of tokens back into pixels.</li>
        <li><b>Scale instead of specialization.</b> A single 12-billion-parameter
        transformer (&sect;2.2), trained on a large corpus of caption-image pairs,
        "is competitive with previous domain-specific models when evaluated in a
        zero-shot fashion" (Abstract) &mdash; with no dataset-specific parts.</li>
      </ul>`,
    whyItMattered:
      `<p>This paper showed that a problem people attacked with bespoke,
       hand-engineered systems could instead be cast as one plain task: predict
       the next token in a sequence. The trick that made it possible &mdash;
       <b>compress the image into a short sequence of discrete tokens, then run a
       language-model-style transformer over text-then-image</b> &mdash; became a
       template. The same two-stage idea (a discrete tokenizer for images, then
       an autoregressive or other generative model over those tokens) reappears
       across later text-to-image and multimodal systems. The broader lesson
       matched the era's theme: with enough data and scale, a single general
       model trained on a simple objective can rival specialists.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; why modeling pixels directly is
        infeasible, and the one-paragraph statement of the two-stage approach.</li>
        <li><b>&sect;2 (Method), Stage One and Stage Two</b> &mdash; the heart of
        the paper. Stage One: the dVAE compresses a 256-by-256 image into a
        32-by-32 grid of tokens, each from a codebook of 8192 values. Stage Two:
        concatenate up to 256 text tokens with the 1024 image tokens and train
        the autoregressive transformer on the joint stream.</li>
        <li><b>Equation 1</b> &mdash; the evidence lower bound (ELB) the whole
        procedure maximizes. Read what $x$, $y$, $z$ stand for and what each of
        the three distributions $q_\\phi$, $p_\\theta$, $p_\\psi$ is.</li>
        <li><b>&sect;2.1</b> &mdash; the Gumbel-softmax relaxation that lets you
        train through the discrete token bottleneck.</li>
        <li><b>&sect;2.2</b> &mdash; the transformer's sizes: 12 billion
        parameters, text vocabulary 16384, image vocabulary 8192.</li>
       </ul>
       <p><b>Skim:</b> the data-collection details, the mixed-precision and
       distributed-training engineering, and the experiment tables &mdash;
       important for reproduction, not needed to grasp the core idea. You do
       <b>not</b> implement this paper; it is a generative-model result paper.
       Read it for the two-stage architecture and why discrete tokens make the
       transformer tractable.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>An image of size 256 by 256 pixels, in raw form, is a sequence of
       $256 \\times 256 = 65536$ pixel positions. The dVAE instead turns it into a
       32-by-32 grid of tokens. Before reading on, guess: by what factor does
       that shrink the number of positions the transformer must handle? Is it
       about 4 times, about 64 times, or about 192 times shorter?</p>
       <p>(Hint: compare $256 \\times 256$ positions to $32 \\times 32$ token
       positions. The paper states the exact factor in &sect;2, Stage One &mdash;
       and it folds in the three color channels too. Write your guess and your
       reasoning before the reveal.)</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch.
       Instead, before the reveal, reason about the compression on paper:</p>
       <ul>
        <li>A raw token-per-pixel sequence has $256 \\times 256 = 65536$
        positions. A token-per-grid-cell sequence has $32 \\times 32 = 1024$
        positions. Compute the ratio $65536 / 1024$. What plain factor of
        sequence-length reduction is that, ignoring color channels?</li>
        <li>Now reason about <b>why a token is not a pixel</b>. Each grid cell
        token is one symbol chosen from a <b>codebook</b> of $8192$ possible
        values. Each raw pixel is three numbers (red, green, blue). How does
        replacing 3-numbers-per-pixel by 1-symbol-per-cell add to the saving?</li>
        <li>TODO: with $1024$ image tokens, each drawn from a vocabulary of size
        $8192$, how many image tokens must the transformer sample to make one
        picture? In what order does it sample them (all at once, or one at a
        time conditioned on the previous ones)?</li>
       </ul>
       <p>The CODEVIZ below is OUR small illustration of these two mechanics: a
       tiny codebook quantizing toy patch values into discrete tokens, and a tiny
       autoregressive sampler drawing tokens one at a time. It uses made-up
       numbers, not the paper's models.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>First, four plain definitions, because the whole paper rests on them.</p>
       <ul>
        <li>A <b>token</b> is one symbol from a fixed, finite list. Text is split
        into text tokens (word-pieces). This paper also turns an image into image
        tokens.</li>
        <li>A <b>discrete token</b> means the symbol is one of a finite set, like
        a letter of an alphabet &mdash; not a continuous number. There is no
        "halfway" between token 5 and token 6.</li>
        <li>A <b>codebook</b> is that alphabet for images: a fixed list of
        possible image-token values. Here the codebook has $8192$ entries
        (&sect;2, Stage One), so every image token is a whole number from $0$ to
        $8191$.</li>
        <li><b>Autoregressive</b> means the model generates a sequence one token
        at a time, left to right, each new token conditioned on all the tokens
        before it. "Auto" = self; "regressive" = predicting from earlier values
        of the same sequence.</li>
       </ul>
       <p>A <b>variational autoencoder</b> (VAE) is a pair of networks: an
       <b>encoder</b> that maps an input to a compact code, and a <b>decoder</b>
       that maps the code back to a reconstruction of the input. A
       <b>discrete</b> VAE (dVAE) is a VAE whose code is a grid of discrete
       tokens drawn from a codebook, rather than continuous numbers.</p>
       <p><b>Stage One &mdash; compress the image into discrete tokens (&sect;2,
       Stage One).</b> The paper trains a dVAE "to compress each 256&times;256 RGB
       image into a 32&times;32 grid of image tokens, each element of which can
       assume 8192 possible values" (RGB = red-green-blue, the three color
       channels). So the encoder reads the full picture and emits a 32-by-32 grid
       where each cell holds one token from the 8192-entry codebook. The decoder
       reads that grid and paints a 256-by-256 picture back. The paper states this
       "reduces the context size of the transformer by a factor of 192"
       &mdash; the context size is how many positions the next stage must process.
       After Stage One, an image is no longer tens of thousands of pixels; it is
       $32 \\times 32 = 1024$ discrete tokens.</p>
       <p><b>The training obstacle: you cannot differentiate through a hard
       choice.</b> Picking "the codebook entry with the highest score" is a
       discrete, non-differentiable step &mdash; gradients (the slopes used to
       train networks) cannot flow back through a hard pick. Section 2.1 solves
       this with the <b>Gumbel-softmax relaxation</b>: during training the hard
       token choice is replaced by a soft, temperature-controlled blend over all
       codebook entries, which <i>is</i> differentiable. The paper writes that it
       replaces the expectation over $q_\\phi$ "with one over $q_\\phi^\\tau$, where
       the relaxation becomes tight as the temperature $\\tau \\to 0$" (&sect;2.1).
       As the temperature $\\tau$ (a knob, annealed toward zero) shrinks, the soft
       blend sharpens into the true hard choice. So you train with the soft
       version and end up with crisp discrete tokens.</p>
       <p><b>Stage Two &mdash; model text-then-image as one stream (&sect;2, Stage
       Two; &sect;2.2).</b> Now treat each caption-image pair as a single sequence:
       first the text tokens, then the image tokens. The paper "concatenate[s] up
       to 256 BPE-encoded text tokens with the 32&times;32 = 1024 image tokens,
       and train[s] an autoregressive transformer to model the joint distribution
       over the text and image tokens." BPE (byte-pair encoding) is the scheme
       that splits text into word-pieces. The text tokens use a vocabulary of
       size $16384$; the image tokens use the codebook of size $8192$ (&sect;2.2).
       The transformer has $12$ billion parameters (&sect;2.2). Because it is
       autoregressive, it learns: given the caption and the image tokens so far,
       what is the next image token?</p>
       <p><b>Generation = sample image tokens, then decode (&sect;2).</b> To turn
       a new caption into a picture: feed the caption's text tokens to the
       transformer; then sample the $1024$ image tokens one at a time, each
       conditioned on the caption and the tokens already drawn; finally hand that
       32-by-32 grid of tokens to the dVAE decoder, which paints the 256-by-256
       image. The text conditions <i>which</i> image tokens get sampled, so the
       picture matches the caption.</p>
       <p><b>The single objective (Equation 1).</b> The two stages are not ad hoc.
       The paper states "the overall procedure can be viewed as maximizing the
       evidence lower bound (ELB)" on the joint likelihood of the model's
       distributions over images, captions, and the encoded tokens. The ELB is a
       lower bound on the log-likelihood that you maximize because the exact
       log-likelihood is intractable. Equation 1 is shown next.</p>`,
    architecture:
      `<p>Two trained components, run in sequence. Stage One's dVAE is trained
       first; Stage Two's transformer is trained second on the tokens the dVAE
       produces.</p>
       <p><b>Component 1 &mdash; the discrete VAE (dVAE), Stage One (&sect;2).</b></p>
       <ul>
        <li><b>Encoder.</b> Input: one $256 \\times 256 \\times 3$ RGB image (the $3$
        is the red-green-blue channels). Output: a $32 \\times 32$ grid of
        <b>logits</b> &mdash; for each of the $1024$ grid cells, a score over all
        $8192$ codebook entries. The cell's image token is the codebook index
        with the highest score (a hard $\\arg\\max$ at inference).</li>
        <li><b>Codebook.</b> A learned table of $8192$ entries. Each image token is
        one index $0..8191$ into this table; the grid is $32 \\times 32 = 1024$ such
        indices.</li>
        <li><b>Decoder.</b> Input: the $32 \\times 32$ grid of tokens (looked up in
        the codebook). Output: a reconstructed $256 \\times 256 \\times 3$ RGB image.
        This is the only component that maps tokens back to pixels.</li>
        <li><b>Training bottleneck.</b> The hard $\\arg\\max$ is non-differentiable,
        so during training it is replaced by the temperature-$\\tau$ Gumbel-softmax
        relaxation $q_\\phi^\\tau$ (&sect;2.1), annealed $\\tau \\to 0$.</li>
       </ul>
       <p><b>Component 2 &mdash; the autoregressive transformer, Stage Two
       (&sect;2.2).</b></p>
       <ul>
        <li><b>Type.</b> A $12$-billion-parameter <b>decoder-only sparse
        transformer</b> (&sect;2.2): one stack that reads a sequence left to right
        and predicts the next token, with no separate encoder.</li>
        <li><b>Input sequence.</b> The concatenation [up to $256$ <b>text
        tokens</b>] then [$1024$ <b>image tokens</b>] &mdash; at most $1280$
        positions modeled "as a single stream of data." Text tokens come from a
        vocabulary of $16384$ (byte-pair encoding); image tokens from the
        $8192$-entry codebook.</li>
        <li><b>Attention masks.</b> Text-to-text positions use a "standard causal
        mask" (each text token attends only to earlier text). Image-to-image
        positions use a <b>row, column, or convolutional</b> attention mask
        (&sect;2.2) &mdash; sparse patterns matched to the 2-D grid layout, which
        keep attention affordable over the $1024$ image positions.</li>
        <li><b>Output head.</b> A categorical distribution over the next token: over
        the $16384$ text vocabulary while in the text region, over the $8192$ image
        codebook while in the image region.</li>
       </ul>
       <p><b>Data flow at generation.</b> caption text $\\to$ text tokens $\\to$ feed
       to transformer $\\to$ sample $1024$ image tokens left-to-right (each
       conditioned on the caption and tokens drawn so far) $\\to$ dVAE decoder
       $\\to$ $256 \\times 256$ image. The dVAE encoder is used only at training
       time (to tokenize the dataset); the decoder is used only at generation
       time.</p>`,
    symbols: [
      { sym: "$x$", desc: "an <b>image</b> (RGB, 256 by 256 pixels). The thing we want to model and, later, generate. (&sect;2, Eq 1.)" },
      { sym: "$y$", desc: "a <b>caption</b> &mdash; the text describing the image, as a sequence of text tokens. (&sect;2, Eq 1.)" },
      { sym: "$z$", desc: "the <b>image tokens</b>: the 32-by-32 grid of discrete codes the dVAE encoder produces for the image $x$. \"The tokens $z$ for the encoded RGB image\" (&sect;2). Each entry is one of 8192 codebook values." },
      { sym: "$q_\\phi(z \\mid x)$", desc: "the <b>dVAE encoder</b> distribution: given an image $x$, the distribution over the 32-by-32 image tokens $z$. The subscript $\\phi$ are the encoder's trainable weights. (&sect;2.)" },
      { sym: "$p_\\theta(x \\mid y, z)$", desc: "the <b>dVAE decoder</b> distribution: given tokens $z$ (and caption $y$), the distribution over RGB images $x$ &mdash; i.e. how the decoder paints pixels from tokens. The subscript $\\theta$ are the decoder's weights. (&sect;2.)" },
      { sym: "$p_\\psi(y, z)$", desc: "the <b>transformer prior</b>: the joint distribution over text tokens $y$ and image tokens $z$, modeled autoregressively by the Stage-Two transformer. The subscript $\\psi$ are the transformer's weights. (&sect;2.)" },
      { sym: "$\\beta$", desc: "a <b>weight on the KL term</b> in the bound. \"The bound only holds for $\\beta = 1$, while in practice we find it helpful to use larger values\" (&sect;2). The paper uses $\\beta = 6.6$, which \"promotes better codebook usage.\"" },
      { sym: "$D_{KL}$", desc: "the <b>Kullback-Leibler divergence</b>: a non-negative measure of how far one probability distribution is from another. Zero when they match; larger when they differ. Here it pulls the encoder's token distribution toward the transformer prior." },
      { sym: "$\\tau$", desc: "the <b>Gumbel-softmax temperature</b> (&sect;2.1): a knob that controls how soft the relaxed token choice is. Large $\\tau$ = very soft blend; as $\\tau \\to 0$ the relaxation \"becomes tight\" and recovers the true hard discrete choice." },
      { sym: "$q_\\phi^\\tau(z \\mid x)$", desc: "the <b>relaxed encoder</b> (&sect;2.1): the differentiable, temperature-$\\tau$ Gumbel-softmax surrogate for $q_\\phi$ used during Stage-One training. It tends to the true discrete $q_\\phi$ as $\\tau \\to 0$." },
      { sym: "$s_t$", desc: "the <b>$t$-th token of the single stream</b>: the concatenation of the text tokens $y$ followed by the image tokens $z$. The transformer predicts each $s_t$ from $s_1,\\dots,s_{t-1}$ (&sect;2.2)." },
      { sym: "$T$", desc: "the <b>total stream length</b>: up to $256$ text tokens plus $1024$ image tokens, so $T \\le 1280$ positions (&sect;2.2)." },
      { sym: "“codebook”", desc: "a plain term: the fixed list of 8192 possible image-token values. Every image token is one index into this list. The image alphabet." },
      { sym: "“autoregressive”", desc: "a plain term: generating a sequence one token at a time, left to right, each token conditioned on all previous tokens. Generation here samples the 1024 image tokens this way." }
    ],
    formula: `
      <p><b>The factorized joint likelihood the model represents (&sect;2).</b> The
      lower bound (Eq 1, next) is on this joint distribution over image $x$,
      caption $y$, and image tokens $z$:</p>
      $$ p_{\\theta,\\psi}(x, y, z) \\;=\\; p_\\theta(x \\mid y, z)\\; p_\\psi(y, z) $$
      <p>The dVAE decoder $p_\\theta(x\\mid y,z)$ paints pixels from tokens; the
      transformer prior $p_\\psi(y,z)$ models the text-and-token sequence.</p>

      <p><b>Equation 1 &mdash; the evidence lower bound (ELB) on the data
      log-likelihood $\\ln p_{\\theta,\\psi}(x,y)$ that the whole two-stage procedure
      maximizes (&sect;2):</b></p>
      $$ \\ln p_{\\theta,\\psi}(x, y) \\;\\geq\\; \\mathbb{E}_{z \\sim q_\\phi(z \\mid x)} \\Big[ \\ln p_\\theta(x \\mid y, z) \\;-\\; \\beta\\, D_{KL}\\big( q_\\phi(y, z \\mid x),\\; p_\\psi(y, z) \\big) \\Big] \\quad \\text{(Eq 1)} $$
      <p>Left: a <b>reconstruction</b> term (decode tokens back to the image).
      Right: a <b>$\\beta$-weighted KL</b> term pulling the encoder's token
      distribution toward the transformer prior. The bound is exact at $\\beta=1$;
      the paper uses $\\beta=6.6$ for "better codebook usage" (&sect;2).</p>

      <p><b>Stage One &mdash; the Gumbel-softmax relaxation (&sect;2.1).</b> The
      expectation over the discrete $q_\\phi$ is non-differentiable, so it is
      replaced by one over a soft, temperature-$\\tau$ surrogate $q_\\phi^\\tau$:</p>
      $$ \\mathbb{E}_{z \\sim q_\\phi(z \\mid x)}[\\,\\cdot\\,] \\;\\longrightarrow\\; \\mathbb{E}_{z \\sim q_\\phi^\\tau(z \\mid x)}[\\,\\cdot\\,], \\qquad q_\\phi^\\tau \\to q_\\phi \\;\\text{ as }\\; \\tau \\to 0 $$
      <p>"The relaxation becomes tight as the temperature $\\tau \\to 0$" (&sect;2.1):
      train with the soft version, anneal $\\tau$ down to recover crisp discrete
      tokens.</p>

      <p><b>Stage Two &mdash; the autoregressive prior over the joint stream
      (&sect;2.2).</b> With Stage One fixed, the transformer factorizes the prior
      $p_\\psi(y,z)$ left-to-right over the concatenation of the $|y|\\le 256$ text
      tokens then the $1024$ image tokens $z$:</p>
      $$ p_\\psi(y, z) \\;=\\; \\prod_{t} p_\\psi\\big(s_t \\mid s_{1}, \\dots, s_{t-1}\\big), \\qquad (s_1,\\dots,s_T) = (\\underbrace{y_1,\\dots,y_{|y|}}_{\\text{text}},\\, \\underbrace{z_1,\\dots,z_{1024}}_{\\text{image}}) $$
      <p>Each token $s_t$ is predicted from all earlier tokens; generation samples
      the $1024$ image tokens in exactly this order. (This per-token factorization
      is the standard autoregressive form the paper trains; the paper states the
      single-stream modeling, &sect;2 &amp; &sect;2.2.)</p>`,
    whatItDoes:
      `<p><b>The factorized joint.</b> $p_{\\theta,\\psi}(x,y,z) = p_\\theta(x\\mid y,z)\\,p_\\psi(y,z)$
       says the model generates data in two parts: the transformer prior $p_\\psi$
       produces a (caption, image-token) sequence, and the decoder $p_\\theta$ turns
       those tokens into pixels. The two factors are exactly the two trained
       components.</p>
       <p><b>Equation 1</b> says: the (log of the) likelihood the model assigns to a
       caption-image pair $(x, y)$ is <b>at least</b> the right-hand side, which
       has two readable parts inside the average over the encoder's tokens
       $z \\sim q_\\phi(z \\mid x)$.</p>
       <ul>
        <li><b>The reconstruction term, $\\ln p_\\theta(x \\mid y, z)$.</b> "Given
        the tokens $z$, how well does the decoder reproduce the original image
        $x$?" Pushing this up makes the dVAE compress-then-decode faithfully: the
        tokens must carry enough information to paint the picture back.</li>
        <li><b>The agreement term, $-\\beta\\, D_{KL}(q_\\phi \\,,\\, p_\\psi)$.</b> The
        KL divergence measures the gap between the encoder's distribution over
        text-and-image tokens, $q_\\phi$, and the transformer prior $p_\\psi$.
        Subtracting it (so, minimizing the gap) forces the transformer to
        actually learn the distribution of token sequences the encoder produces.
        This is the term the Stage-Two transformer is trained to satisfy.</li>
       </ul>
       <p>Maximizing the whole right-hand side over all weights
       $\\theta, \\phi, \\psi$ trains the encoder, the decoder, and the transformer
       toward one shared goal: tokens that both reconstruct images well and form
       sequences the transformer can model. The weight $\\beta$ tunes how hard the
       agreement term is pushed; the paper sets it above 1 (to $6.6$) for "better
       codebook usage," noting the bound is exact only at $\\beta = 1$.</p>
       <p><b>The relaxation expression</b>
       $\\mathbb{E}_{z\\sim q_\\phi} \\to \\mathbb{E}_{z\\sim q_\\phi^\\tau}$ says: swap the
       discrete sampling of tokens (which blocks gradients) for a soft,
       temperature-$\\tau$ blend that is differentiable, then anneal $\\tau \\to 0$
       so the soft blend hardens back into the true token choice. It is how Stage
       One is actually trained.</p>
       <p><b>The autoregressive factorization</b>
       $p_\\psi(y,z) = \\prod_t p_\\psi(s_t \\mid s_{\\lt t})$ says: model the whole
       text-then-image stream one token at a time, each token's probability
       conditioned on every token before it. This is what makes generation a
       left-to-right sampling loop over the $1024$ image tokens.</p>`,
    derivation:
      `<p>This is a <b>result paper</b> with no single equation to derive from
       first principles; the contribution is the architecture. But the shape of
       Equation 1 follows the standard logic of a <b>variational lower bound</b>,
       which is worth seeing in plain terms.</p>
       <p><b>Why a lower bound at all.</b> We would like to maximize the model's
       log-likelihood $\\ln p(x, y)$ &mdash; how probable the real data is under
       the model. But that quantity sums over <i>all</i> possible token codes $z$
       for an image, which is astronomically many ($8192$ choices in each of
       $1024$ cells). It cannot be computed directly. The standard escape is to
       introduce the encoder $q_\\phi(z \\mid x)$ &mdash; a cheap guess at which
       tokens explain image $x$ &mdash; and derive a quantity that (a) is
       computable and (b) is provably never larger than the true log-likelihood.
       That quantity is the <b>evidence lower bound (ELB)</b>: "evidence" is the
       data likelihood, and the ELB sits below it.</p>
       <p><b>Reading the two terms as a trade-off.</b> Any such bound splits into
       a reconstruction term and a divergence term, exactly as in Equation 1.
       Maximizing the bound therefore (a) makes the decoder reconstruct the image
       from its tokens, and (b) keeps the encoder's token distribution close to
       the prior $p_\\psi$. Because the right-hand side is always a lower bound on
       the true log-likelihood, pushing the bound up pushes the real likelihood up
       too &mdash; without ever computing the intractable sum. The paper's two
       stages are just this maximization carried out: Stage One trains
       $\\theta, \\phi$ (decoder and encoder) with $p_\\psi$ fixed to a simple
       uniform prior; Stage Two then trains $\\psi$ (the transformer) to match the
       encoder's token distribution, which is the agreement term.</p>
       <p><b>Where Gumbel-softmax enters (&sect;2.1).</b> The average is taken over
       $z \\sim q_\\phi(z \\mid x)$, but sampling discrete $z$ blocks gradients. The
       relaxation replaces that average with one over a soft, temperature-$\\tau$
       version $q_\\phi^\\tau$ that is differentiable, "where the relaxation becomes
       tight as the temperature $\\tau \\to 0$." So the bound is optimized with the
       soft surrogate during training and recovers the true discrete behavior as
       $\\tau$ is annealed down.</p>`,
    example:
      `<p>This is a read-only paper; the numbers below are the paper's stated
       architecture sizes, worked through to make the "factor of 192" compression
       concrete. (These are quoted sizes, not a training run.) The table compares
       the raw-pixel representation against the dVAE-token representation:</p>
       <table class="extable">
        <caption>Raw $256\\times256$ RGB image vs. the dVAE's $32\\times32$ token grid (&sect;2, Stage One).</caption>
        <thead><tr><th>quantity</th><th class="num">raw pixels</th><th class="num">dVAE tokens</th><th class="num">factor</th></tr></thead>
        <tbody>
         <tr><td class="row-h">grid positions</td><td class="num">$256\\times256 = 65536$</td><td class="num">$32\\times32 = 1024$</td><td class="num">$64\\times$</td></tr>
         <tr><td class="row-h">numbers per position</td><td class="num">$3$ (R,G,B)</td><td class="num">$1$ (token)</td><td class="num">$3\\times$</td></tr>
         <tr><td class="row-h">total numbers</td><td class="num">$196608$</td><td class="num">$1024$</td><td class="num">$192\\times$</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Raw pixel positions.</b> A 256-by-256 image has
        $256 \\times 256 = 65536$ pixel positions. With three color channels that
        is $65536 \\times 3 = 196608$ raw numbers.</li>
        <li><b>Token positions after the dVAE.</b> The 32-by-32 grid has
        $32 \\times 32 = 1024$ token positions &mdash; one token each.</li>
        <li><b>Sequence-length factor.</b> Comparing positions,
        $65536 / 1024 = 64$. So just in grid cells, the sequence is 64 times
        shorter than one-token-per-pixel.</li>
        <li><b>Folding in the channels.</b> A pixel carries three numbers but a
        grid cell carries one token, an extra factor of $3$: $64 \\times 3 = 192$.
        This matches the paper's statement that the dVAE "reduces the context size
        of the transformer by a factor of 192" (&sect;2, Stage One).</li>
        <li><b>What the transformer then handles.</b> Up to $256$ text tokens plus
        $1024$ image tokens gives a stream of at most $1280$ token positions
        (&sect;2, Stage Two) &mdash; tractable for a transformer, where $196608$
        raw numbers would not be.</li>
       </ul>
       <p>The CODEVIZ below recomputes this $64 \\times 3 = 192$ factor and then
       shows OUR toy codebook quantization and autoregressive sampling on made-up
       data &mdash; an illustration of the mechanics, not the paper's models.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no model to assemble by hand.
       Here is the paper's procedure as numbered steps (&sect;2) &mdash; the recipe
       you would follow to reproduce the idea:</p>
       <ol>
        <li><b>Stage One: train the dVAE.</b> Train an encoder to map each
        256-by-256 RGB image to a 32-by-32 grid of discrete tokens (codebook size
        8192) and a decoder to map that grid back to pixels. Maximize the
        reconstruction term of the ELB (Eq 1).</li>
        <li><b>Use the Gumbel-softmax relaxation (&sect;2.1)</b> so gradients flow
        through the discrete token bottleneck; anneal the temperature
        $\\tau \\to 0$ so training ends with crisp discrete tokens.</li>
        <li><b>Encode the dataset.</b> Run the trained encoder over every
        caption-image pair to turn each image into its 1024 image tokens.</li>
        <li><b>Stage Two: train the transformer.</b> For each pair, build the
        sequence [up to 256 text tokens] followed by [1024 image tokens] and train
        a 12-billion-parameter autoregressive transformer to predict the next
        token over this joint stream (&sect;2.2).</li>
        <li><b>Generate.</b> Given a new caption, feed its text tokens, then sample
        the 1024 image tokens one at a time, each conditioned on the caption and
        the tokens drawn so far.</li>
        <li><b>Decode.</b> Hand the sampled 32-by-32 token grid to the dVAE decoder
        to paint the final 256-by-256 image.</li>
       </ol>`,
    results:
      `<p><b>From the abstract (quoted):</b> the paper describes "a simple approach
       for this task based on a transformer that autoregressively models the text
       and image tokens as a single stream of data," and finds that "with
       sufficient data and scale, our approach is competitive with previous
       domain-specific models when evaluated in a zero-shot fashion."</p>
       <p><b>On the architecture sizes (quoted, &sect;2 and &sect;2.2):</b> the dVAE
       compresses "each 256&times;256 RGB image into a 32&times;32 grid of image
       tokens, each element of which can assume 8192 possible values," which
       "reduces the context size of the transformer by a factor of 192." Stage Two
       "concatenate[s] up to 256 BPE-encoded text tokens with the 32&times;32 =
       1024 image tokens." The transformer has "12-billion" parameters; the text
       vocabulary is 16384 and the image vocabulary is 8192.</p>
       <p><i>These are the paper's own statements, transcribed from the abstract
       and &sect;2. The numbers in the CODEVIZ panel below are from OUR small toy
       illustration of the codebook-and-sampling mechanics &mdash; not the paper's
       models or any of its reported results.</i></p>`,
    evaluation:
      `<p>This is a <b>read-only</b> paper, so &ldquo;is your build working?&rdquo; splits into two checkable pieces
       you can verify in spirit: the dVAE (Stage One) and the autoregressive transformer (Stage Two).</p>
       <p><b>1. Metric &amp; benchmark.</b> (a) For the <b>dVAE</b>: reconstruction quality &mdash; how faithfully the
       decoder repaints $x$ from its $32\\times32$ tokens (per-pixel error / a perceptual distance) and codebook
       usage (how many of the $8192$ entries actually get used). (b) For the <b>whole system</b>: the paper's headline
       claim is <b>zero-shot</b> competitiveness &mdash; tested on a dataset never trained on, it is &ldquo;competitive
       with previous domain-specific models&rdquo; (Abstract). The standard text-to-image scores are FID (lower is
       better) and human &ldquo;real vs fake&rdquo; / caption-match preference; the &ldquo;no-skill&rdquo; bar is the
       prior domain-specific SOTA the paper aims to match zero-shot. (c) A structural check you can do by arithmetic:
       the dVAE must reduce the transformer context by the paper's stated <b>factor of 192</b> ($64\\times3$, &sect;2)
       &mdash; the CODE recomputes this exactly.</p>
       <p><b>2. Sanity checks BEFORE the full run.</b></p>
       <ul>
        <li><b>Compression arithmetic.</b> $256\\times256 / (32\\times32) = 64$ positions, $\\times 3$ channels $= 192$.
        If your tokenizer grid does not give $1024$ tokens and a $192\\times$ context cut, the dVAE geometry is wrong.</li>
        <li><b>Transformer loss at init.</b> For a $K$-way softmax over a fresh, untrained head the cross-entropy
        should start near $-\\ln(1/K)$: $\\approx \\ln 8192 \\approx 9.0$ nats in the image region and
        $\\approx \\ln 16384 \\approx 9.7$ nats in the text region (rule of thumb). A much lower starting loss means
        labels leaked or the head is mis-sized.</li>
        <li><b>dVAE round-trip.</b> Encode then decode a handful of images; the reconstruction should be recognizable.
        Overfit the dVAE on a single image and watch reconstruction error go toward $0$.</li>
        <li><b>Gumbel-softmax limit.</b> As the temperature $\\tau \\to 0$, the relaxed $q_\\phi^\\tau$ must approach the
        hard $\\arg\\max$ choice (&sect;2.1); check that soft and hard token picks agree once $\\tau$ is annealed down.</li>
        <li><b>Autoregressive masking.</b> Confirm token $t$ cannot see tokens $\\gt t$ (a causal-mask leak makes
        training loss implausibly low and generation incoherent).</li>
       </ul>
       <p><b>3. Expected range.</b> The paper reports no single number to reproduce in a notebook here &mdash; its
       claim is qualitative (&ldquo;competitive&hellip; zero-shot,&rdquo; Abstract) plus the architecture sizes
       ($32\\times32$ grid, $8192$ codebook, $192\\times$ context reduction, $12$-billion-parameter transformer,
       $16384$ text vocab, &sect;2/&sect;2.2). Treat those quoted sizes as the targets to match; the only number in
       the CODE/CODEVIZ panels (the $192$ factor) is the paper's, while the toy codebook and sampler use made-up
       constants.</p>
       <p><b>4. Ablation &mdash; prove the discrete bottleneck earns its keep.</b> The central idea is
       <i>discrete</i> image tokens, which is what lets a language-model transformer model images at all. Ablate it:
       feed the encoder's <i>continuous</i> activations to the transformer instead of codebook indices. Two things
       break &mdash; &ldquo;sample the next image token&rdquo; is undefined with no finite alphabet, and the
       $\\beta$-weighted KL agreement term (Eq 1) no longer matches a distribution over discrete tokens. If a
       &ldquo;continuous-token&rdquo; variant trains and generates just as well, the discrete codebook was not doing
       the work the paper claims. (A milder ablation: shrink the codebook far below $8192$ and watch reconstruction
       and sample quality fall.)</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Blurry / posterized reconstructions</b> &rarr; codebook too small or under-used (collapsed onto a few
        entries); the paper raises $\\beta$ to $6.6$ specifically for &ldquo;better codebook usage&rdquo; (&sect;2).</li>
        <li><b>Incoherent samples</b> (locally fine, globally nonsense) &rarr; tokens sampled independently instead of
        left-to-right autoregressively, or a broken attention mask &mdash; the conditioning is lost.</li>
        <li><b>Generated images ignore the caption</b> &rarr; the text tokens are not actually conditioning the image
        region; check that the single stream is text-then-image and attention reaches back into the text.</li>
        <li><b>Stage-One training stalls / NaNs</b> &rarr; the hard $\\arg\\max$ has no gradient; you forgot the
        Gumbel-softmax relaxation or annealed $\\tau$ too fast (&sect;2.1).</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: a generative-model result, with a
       12-billion-parameter transformer and a large dVAE that you cannot and
       should not rebuild here. There is no from-scratch model in this lesson.
       What you <b>do</b> instead is <i>understand</i> the two-stage idea: how
       continuous image patches become a small grid of discrete codebook tokens,
       and how an autoregressive transformer then samples image tokens conditioned
       on text. The optional code below is OUR tiny <b>conceptual illustration</b>
       of exactly those two mechanics &mdash; a toy codebook quantizing made-up
       patch values, and a toy autoregressive sampler over a made-up vocabulary.
       It uses round, invented numbers to show the <i>shape</i> of the method; it
       does <b>not</b> reproduce the paper's dVAE, transformer, or any result.</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking an image token is a pixel patch of colors.</b> A token is
        a single <i>index</i> into the 8192-entry codebook &mdash; one whole
        number, not a small image. The codebook entry it points to is what carries
        the visual content. <b>Fix:</b> picture the grid as 1024 symbols from an
        8192-letter alphabet, not 1024 little pictures.</li>
        <li><b>Believing the transformer outputs pixels.</b> It outputs image
        <i>tokens</i>; only the dVAE decoder turns tokens into pixels. Skip the
        decode step and you have a grid of integers, not a picture. <b>Fix:</b>
        remember it is always sample-tokens-then-decode.</li>
        <li><b>Generating image tokens all at once.</b> Generation is
        autoregressive: token $t$ depends on tokens $1$ through $t-1$ (and the
        caption). Sampling them independently throws away that conditioning and
        breaks coherence. <b>Fix:</b> sample left to right, one token at a
        time.</li>
        <li><b>Ignoring why the discrete bottleneck needs a relaxation.</b> A hard
        codebook pick has no gradient, so naive training of Stage One stalls. The
        Gumbel-softmax relaxation (&sect;2.1), annealed via the temperature
        $\\tau \\to 0$, is what makes it trainable. <b>Fix:</b> train soft, anneal
        to hard.</li>
        <li><b>Reading $\\beta$ as fixed at 1.</b> The ELB is exact only at
        $\\beta = 1$, but the paper deliberately uses $\\beta = 6.6$ for "better
        codebook usage" (&sect;2) &mdash; a practical choice, not the textbook
        bound. <b>Fix:</b> note the bound is a guide, and the weight is tuned.</li>
      </ul>`,
    recall: [
      "Name the two stages of DALL-E and what each one trains (the dVAE and the autoregressive transformer).",
      "What grid size and codebook size does the dVAE compress a 256-by-256 image into, and what compression factor does the paper state? (&sect;2)",
      "How are text and image tokens arranged for the transformer, and how many of each? (&sect;2, &sect;2.2)",
      "Define 'discrete token', 'codebook', and 'autoregressive' in one sentence each.",
      "Why is the Gumbel-softmax relaxation needed, and what does the temperature $\\tau \\to 0$ recover? (&sect;2.1)"
    ],
    practice: [
      {
        q: `<b>Compression factor.</b> The dVAE turns a 256-by-256 RGB image into a
            32-by-32 grid of single tokens. (a) By what factor does the number of
            grid positions shrink versus one-token-per-pixel? (b) Folding in the
            three color channels (a pixel is three numbers, a cell is one token),
            what total reduction does the paper state?`,
        steps: [
          { do: `Count positions: $256 \\times 256 = 65536$ pixels vs. $32 \\times 32 = 1024$ grid cells.`, why: `The transformer's cost grows with sequence length, so the number of positions is what matters.` },
          { do: `Divide: $65536 / 1024 = 64$.`, why: `That is the position-count reduction ignoring color.` },
          { do: `A pixel carries 3 channel numbers but a cell carries 1 token, an extra $\\times 3$: $64 \\times 3 = 192$.`, why: `The paper states the dVAE 'reduces the context size of the transformer by a factor of 192' (&sect;2, Stage One).` }
        ],
        answer: `<p>(a) $65536 / 1024 = 64$ &mdash; the token grid has 64 times fewer
                 positions than one-token-per-pixel. (b) Including the three color
                 channels, $64 \\times 3 = 192$, matching the paper's stated factor
                 of 192 (&sect;2). That is why a stream that would be ~196k raw
                 numbers becomes at most ~1280 token positions the transformer can
                 actually handle.</p>`
      },
      {
        q: `<b>Generation order.</b> You have a trained DALL-E and a new caption.
            Walk through how a picture is produced, in order. Where does the dVAE
            decoder come in, and why must the image tokens be sampled one at a
            time rather than all at once?`,
        steps: [
          { do: `Feed the caption's text tokens to the transformer.`, why: `The text conditions which image tokens are likely, so the picture matches the caption.` },
          { do: `Sample the 1024 image tokens autoregressively: token $t$ conditioned on the caption and tokens $1..t-1$.`, why: `The transformer models a JOINT distribution; each token's distribution depends on the ones before it, which keeps the image coherent.` },
          { do: `Pass the completed 32-by-32 token grid to the dVAE decoder to paint a 256-by-256 image.`, why: `The transformer only produces tokens; only the decoder maps tokens back to pixels.` }
        ],
        answer: `<p>Order: (1) feed the caption's text tokens; (2) sample the 1024
                 image tokens one at a time, each conditioned on the caption and the
                 tokens already drawn; (3) hand the finished grid to the dVAE
                 decoder, which renders the pixels. Sampling must be left-to-right
                 because the transformer is autoregressive &mdash; each token's
                 distribution depends on the previous tokens, so independent
                 sampling would lose that conditioning and produce an incoherent
                 grid. The decoder is the final, separate step that turns tokens
                 into a picture.</p>`
      },
      {
        q: `<b>Ablation: kill the discrete bottleneck.</b> Suppose you replace the
            dVAE's discrete tokens with the encoder's raw continuous activations
            and feed those directly to a transformer over text-then-image.
            Conceptually, what two things break, tying each to a specific part of
            the method?`,
        steps: [
          { do: `Note the transformer (&sect;2.2) is a model over DISCRETE tokens from finite vocabularies (text 16384, image 8192).`, why: `An autoregressive transformer predicts a categorical next-token distribution; it needs a finite alphabet to predict over.` },
          { do: `Continuous activations have no finite alphabet, so 'predict the next token' is undefined; you would need a different (continuous) output model.`, why: `The whole point of the codebook is to give the image a discrete alphabet the language-model machinery can handle.` },
          { do: `Also, the Gumbel-softmax relaxation (&sect;2.1) exists precisely to train THROUGH the discrete choice; with no discrete choice there is nothing it is approximating, and the codebook-usage objective (the $\\beta$-weighted KL) loses its meaning.`, why: `Equation 1's agreement term pulls the discrete token distribution toward the prior; remove discreteness and that term changes entirely.` }
        ],
        answer: `<p>Two things break. (1) The autoregressive transformer predicts a
                 categorical distribution over a finite vocabulary; raw continuous
                 activations have no finite alphabet, so 'sample the next image
                 token' is undefined &mdash; you would need a different continuous
                 generator, losing the clean text-then-image token stream. (2) The
                 discrete bottleneck is exactly what the Gumbel-softmax relaxation
                 (&sect;2.1) and the codebook (8192 entries) are built around; the
                 ELB's $\\beta$-weighted agreement term (Eq 1) is about matching a
                 distribution over <i>discrete</i> tokens, so removing discreteness
                 guts the objective. The discrete token grid is what makes a
                 language-model-style transformer applicable to images at all.</p>`
      }
    ]
  });

  window.CODE["paper-dalle"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no DALL-E model to train or
       verify here &mdash; the real dVAE and 12-billion-parameter transformer are
       far beyond a notebook cell. The snippet below is OUR tiny <b>conceptual
       illustration</b> of the two mechanics the paper rests on. (1) It recomputes
       the paper's stated $64 \\times 3 = 192$ compression factor. (2) It runs a toy
       <b>codebook quantization</b>: a handful of continuous "patch" values are
       each snapped to the nearest of a few codebook entries, turning continuous
       patches into discrete tokens &mdash; the Stage-One idea in miniature. (3) It
       runs a toy <b>autoregressive sampler</b>: over a 4-symbol image vocabulary,
       it draws tokens one at a time from a fixed next-token table conditioned on
       a "text" symbol, the Stage-Two idea in miniature. All constants are round
       and made-up; this is NOT the paper's codebook, transformer, or any result.
       Pure NumPy, CPU, well under a second.</p>`,
    code: `import numpy as np

# ---------------------------------------------------------------------------
# (1) The paper's stated compression factor: 256x256 image -> 32x32 token grid.
#     Positions shrink 64x; folding in 3 color channels gives the 192x the
#     paper reports (Section 2, Stage One). Quoted sizes, not a training run.
# ---------------------------------------------------------------------------
pixels   = 256 * 256          # 65536 pixel positions
tokens   = 32 * 32            # 1024 token-grid positions
pos_factor = pixels // tokens                 # 64
full_factor = pos_factor * 3                  # 64 * 3 = 192 (three RGB channels)
print("pixel positions      =", pixels)
print("token positions      =", tokens)
print("position factor      =", pos_factor)
print("with 3 channels      =", full_factor, "(paper states 192)")
# pixel positions      = 65536
# token positions      = 1024
# position factor      = 64
# with 3 channels      = 192 (paper states 192)

# ---------------------------------------------------------------------------
# (2) OUR toy CODEBOOK QUANTIZATION: continuous "patch" values -> discrete
#     tokens. A real dVAE learns its codebook; here it is a tiny fixed one.
#     ILLUSTRATION of the FORM only, NOT the paper's 8192-entry codebook.
# ---------------------------------------------------------------------------
codebook = np.array([0.0, 0.25, 0.5, 0.75, 1.0])    # 5 made-up entries
patches  = np.array([0.05, 0.30, 0.52, 0.71, 0.98]) # 5 continuous patch values
# Snap each patch to the nearest codebook entry -> its discrete token index.
tokens_idx = np.argmin(np.abs(patches[:, None] - codebook[None, :]), axis=1)
print("\\ntoy codebook quantization (illustration):")
print("  patches      =", patches)
print("  -> token idx =", tokens_idx)         # the discrete tokens
print("  -> values    =", codebook[tokens_idx])
# toy codebook quantization (illustration):
#   patches      = [0.05 0.3  0.52 0.71 0.98]
#   -> token idx = [0 1 2 3 4]
#   -> values    = [0.   0.25 0.5  0.75 1.  ]

# ---------------------------------------------------------------------------
# (3) OUR toy AUTOREGRESSIVE SAMPLER over a 4-symbol image vocabulary, drawing
#     tokens one at a time conditioned on the previous token + a "text" symbol.
#     ILLUSTRATION of the FORM only, NOT the paper's transformer.
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)
vocab = ["A", "B", "C", "D"]
# Fixed next-token probability table P[prev] -> distribution over next token.
# (A real transformer LEARNS this; here it is a made-up 4x4 table.)
P = np.array([[0.1, 0.6, 0.2, 0.1],
              [0.2, 0.1, 0.6, 0.1],
              [0.1, 0.2, 0.1, 0.6],
              [0.6, 0.1, 0.2, 0.1]])
prev = 0                       # start token, chosen by a "text" condition
seq = [vocab[prev]]
for _ in range(6):             # sample 6 image tokens one at a time
    prev = rng.choice(4, p=P[prev])
    seq.append(vocab[prev])
print("\\ntoy autoregressive sample (each token depends on the previous):")
print(" ", " -> ".join(seq))
# toy autoregressive sample (each token depends on the previous):
#   A -> B -> B -> A -> A -> C -> D
# Continuous patches became discrete tokens; tokens were drawn left-to-right.
# These are OUR toy numbers, NOT the paper's codebook, transformer, or results.`
  };

  window.CODEVIZ["paper-dalle"] = {
    question: "DALL-E's two moving parts are (a) a codebook that turns continuous image patches into DISCRETE tokens, and (b) an AUTOREGRESSIVE sampler that draws image tokens one at a time. On a tiny toy, can we see continuous values snap to a small set of token levels?",
    charts: [
      {
        type: "scatter",
        title: "Toy codebook quantization: continuous patch values snap to the nearest discrete token level (OUR ILLUSTRATION, not the paper's 8192-entry codebook)",
        xlabel: "patch index (which toy patch)",
        ylabel: "value  [continuous input vs. quantized token level]",
        series: [
          {
            name: "continuous patch value (input)",
            color: "#7ee787",
            points: [[0, 0.05], [1, 0.30], [2, 0.52], [3, 0.71], [4, 0.98]]
          },
          {
            name: "quantized to nearest codebook level (the discrete token)",
            color: "#ff7b72",
            points: [[0, 0.0], [1, 0.25], [2, 0.5], [3, 0.75], [4, 1.0]]
          }
        ]
      }
    ],
    caption: "OUR small illustration of the FORM of DALL-E's mechanics, NOT the paper's models or any result. Left-to-right: five continuous toy 'patch' values (green) are each snapped to the nearest entry of a tiny 5-level codebook {0, 0.25, 0.5, 0.75, 1.0}, producing discrete token indices [0,1,2,3,4] (red). This is the Stage-One idea in miniature: a discrete VAE replaces continuous image content with tokens drawn from a fixed codebook (the paper's real codebook has 8192 entries over a 32x32 grid, Section 2). A separate toy autoregressive sampler (see the code) then draws tokens one at a time, each conditioned on the previous token -- the Stage-Two idea. The paper's actual dVAE compresses a 256x256 image into 1024 tokens (a 192x context reduction) and its 12-billion-parameter transformer models text-then-image tokens as one stream; none of those models are reproduced here.",
    code: `import numpy as np

# OUR toy illustration of DALL-E's two mechanics. ROUND, MADE-UP constants --
# this shows the FORM (discrete tokens + autoregressive sampling), NOT the
# paper's 8192-entry codebook or 12-billion-parameter transformer.

# (a) CODEBOOK QUANTIZATION: continuous patches -> nearest discrete token level.
codebook = np.array([0.0, 0.25, 0.5, 0.75, 1.0])    # tiny 5-level codebook
patches  = np.array([0.05, 0.30, 0.52, 0.71, 0.98]) # continuous toy patches
tok = np.argmin(np.abs(patches[:, None] - codebook[None, :]), axis=1)
print("patch value -> token level (the discrete token):")
for i, (p, t) in enumerate(zip(patches, tok)):
    print("  patch[%d]=%.2f -> token %d  (level %.2f)" % (i, p, t, codebook[t]))
# patch value -> token level (the discrete token):
#   patch[0]=0.05 -> token 0  (level 0.00)
#   patch[1]=0.30 -> token 1  (level 0.25)
#   patch[2]=0.52 -> token 2  (level 0.50)
#   patch[3]=0.71 -> token 3  (level 0.75)
#   patch[4]=0.98 -> token 4  (level 1.00)

# (b) AUTOREGRESSIVE SAMPLING over a 4-symbol image vocabulary, one token at a
#     time conditioned on the previous token (a made-up next-token table).
rng = np.random.default_rng(0)
vocab = ["A", "B", "C", "D"]
P = np.array([[0.1, 0.6, 0.2, 0.1],
              [0.2, 0.1, 0.6, 0.1],
              [0.1, 0.2, 0.1, 0.6],
              [0.6, 0.1, 0.2, 0.1]])
prev, seq = 0, ["A"]
for _ in range(6):
    prev = rng.choice(4, p=P[prev])
    seq.append(vocab[prev])
print("\\nautoregressive sample (each token depends on the previous):")
print(" ", " -> ".join(seq))
# autoregressive sample (each token depends on the previous):
#   A -> B -> B -> A -> A -> C -> D
# Continuous patches became discrete tokens; tokens were sampled left-to-right.
# OUR toy numbers -- NOT the paper's codebook, transformer, or reported results.`
  };
})();
