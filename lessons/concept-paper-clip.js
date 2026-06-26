/* Paper lesson — "Learning Transferable Visual Models From Natural Language Supervision"
   (CLIP), Radford, Kim, Hallacy, Ramesh, Goh, Agarwal, Sastry, Askell, Mishkin, Clark, Krueger,
   Sutskever 2021. OpenAI.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-clip".
   GROUNDED from arXiv:2103.00020 (abstract page) and the ar5iv HTML mirror (Section 2 / Approach:
   the symmetric contrastive objective, the learned log-parameterized temperature, Figure 3 numpy-like
   pseudocode, and the zero-shot prompt-matching procedure). Track B (architecture): build an image
   encoder + a text encoder from nn primitives, train them with the SYMMETRIC InfoNCE contrastive loss
   over a batch of (image-vector, text-vector) pairs on a toy set, then do ZERO-SHOT classification by
   matching a held-out image to class-name text embeddings. The contrastive-learning math owner is
   concept mod-contrastive; here we recap and link. */
(function () {
  window.LESSONS.push({
    id: "paper-clip",
    title: "CLIP — Learning Transferable Visual Models From Natural Language Supervision (2021)",
    tagline: "Train an image encoder and a text encoder to agree, then classify any image by matching it to text prompts — zero labels at test time.",
    module: "Papers · Self-supervised & Representation",
    track: "architecture",
    paper: {
      authors: "Alec Radford, Jong Wook Kim, Chris Hallacy, Aditya Ramesh, Gabriel Goh, Sandhini Agarwal, Girish Sastry, Amanda Askell, Pamela Mishkin, Jack Clark, Gretchen Krueger, Ilya Sutskever",
      org: "OpenAI",
      year: 2021,
      venue: "arXiv:2103.00020 (Feb 2021); ICML 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2103.00020",
      code: "https://github.com/openai/CLIP"
    },
    conceptLink: "mod-contrastive",
    partOf: [
      { capstone: "capstone-simclr", step: 3, builds: "the two-encoder (image + text) symmetric-InfoNCE contrastive learner with zero-shot matching" }
    ],
    prereqs: ["mod-contrastive", "unl-simclr", "dl-cosine-similarity", "dl-cross-entropy", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>Before this paper, the standard recipe for an image model was <b>supervised classification</b> over a
       <b>fixed, closed set of categories</b>. You picked, say, the 1,000 ImageNet classes, hand-labelled millions
       of pictures into exactly those buckets, and trained. The model learned only those 1,000 concepts. To
       recognize a new category you had to collect new labelled data and retrain. The paper's framing (§1):
       this supervision is "a restricted form" — the model can only ever output one of the categories it was
       trained on, and the labels are expensive to collect.</p>
       <p>Meanwhile the internet already contains hundreds of millions of <b>(image, caption)</b> pairs — a
       photo and the text someone wrote next to it. That text is a far richer, open-ended signal than a single
       class index: "a black cat on a red sofa" tells you much more than the label <code>cat</code>. The open
       question: can we learn visual concepts <b>directly from this natural-language supervision</b>, with no
       fixed label set, so the model can recognize concepts it was never explicitly trained to classify?</p>`,
    contribution:
      `<ul>
        <li><b>Learn from raw (image, text) pairs at scale.</b> CLIP (Contrastive Language–Image Pre-training)
        trains on a dataset of <b>400 million</b> (image, text) pairs collected from the internet (§2.2). No
        human-curated class labels — the caption <i>is</i> the supervision.</li>
        <li><b>A simple symmetric contrastive objective.</b> Two encoders — one for images, one for text —
        are trained so that a matching (image, text) pair has high <b>cosine similarity</b> and every
        mismatched pair has low similarity. The loss is a <b>symmetric cross-entropy</b> over the batch's
        similarity matrix (§2.3, Figure 3) — InfoNCE done both ways (image→text and text→image).</li>
        <li><b>Zero-shot transfer through prompts.</b> At test time you do <b>not</b> fine-tune. You write the
        candidate classes as text prompts ("a photo of a {class}"), embed them with the text encoder, embed the
        image, and pick the class whose text embedding is <b>most similar</b> to the image. The model classifies
        into categories it was never trained on (§3.1).</li>
      </ul>`,
    whyItMattered:
      `<p>From the abstract (quoted): "After pre-training, natural language is used to reference learned visual
       concepts (or describe new ones) enabling zero-shot transfer of the model to downstream tasks. We study the
       performance of this approach ... The model transfers non-trivially to most tasks and is often competitive
       with a fully supervised baseline without the need for any dataset specific training. For instance, we match
       the accuracy of the original ResNet-50 on ImageNet <b>zero-shot</b> without needing to use any of the 1.28
       million training examples it was trained on."</p>
       <p>CLIP made <b>open-vocabulary</b> recognition mainstream: instead of a fixed softmax over $k$ classes, you
       compare an image to <i>any</i> text you can write. Its image+text joint embedding space became the backbone
       for text-to-image generation (it guides Stable Diffusion and DALL·E 2), open-vocabulary detection and
       segmentation, and image retrieval. It is the canonical example of <b>contrastive cross-modal</b>
       learning — the same pull-together / push-apart idea as SimCLR (capstone step 1) and MoCo (step 2), but now
       across <i>two different modalities</i>.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§2.3 (Selecting an Efficient Pre-Training Method) and Figure 3</b> — the heart of the paper. Figure 1
        shows the contrastive idea (the $N\\times N$ image–text similarity grid, diagonal = positives); Figure 3 is
        the numpy-like <b>training pseudocode</b> you will transcribe and implement: project both modalities,
        L2-normalize, scaled cosine logits, symmetric cross-entropy.</li>
        <li><b>§3.1 (Zero-Shot Transfer)</b> and <b>Figure 1 (right)</b> — how a trained CLIP is used as a
        classifier: build text prompts for the candidate classes, embed, pick the most similar.</li>
        <li>The <b>learned temperature</b> detail in §2.3: $\\tau$ is "directly optimized during training as a
        log-parameterized multiplicative scalar," initialized so that $1/\\tau = 0.07^{-1}$, and clipped for
        stability.</li>
       </ul>
       <p><b>Skim:</b> §2.4–§2.5 (the exact ResNet/ViT and Transformer encoder choices and scaling), §3.1.4–§4
       (the large zero-shot/linear-probe transfer tables across 30+ datasets), §5–§7 (robustness, limitations,
       broader impacts) — unless you want the full empirical story. The core mechanism you need is one pseudocode
       block and the prompt-matching rule.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two small encoders — one that turns an <b>image feature vector</b> into an embedding, one
       that turns a <b>class-name (text) vector</b> into an embedding — with the symmetric contrastive loss, so
       that an image and its <i>own</i> class name land close together. Then, with the encoders <b>frozen</b>, you
       will classify <b>held-out</b> images by matching each to the class-name embeddings — <b>zero-shot</b>, never
       having trained a classifier head.</p>
       <p>Do you expect zero-shot matching (compare image embedding to each class-name embedding, take the
       most similar) to recover the correct class on held-out images <b>well above chance</b>, even though no
       image was ever paired with an explicit class label? Write your guess and one sentence of reasoning, then
       run the experiment.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Two encoders.</b> An image encoder $I(\\cdot)$ and a text encoder $T(\\cdot)$, each a small MLP
        (<code>nn.Linear → ReLU → nn.Linear</code>) mapping its input to a shared $d$-dimensional embedding.</li>
        <li><b>Normalize.</b> TODO: L2-normalize every image embedding and every text embedding to unit length
        (so the dot product <i>is</i> the cosine similarity).</li>
        <li><b>Logits.</b> TODO: for a batch of $N$ pairs, build the $N\\times N$ matrix of cosine similarities
        between every image and every text, and multiply by $1/\\tau$ (the learned temperature scale).</li>
        <li><b>Symmetric loss.</b> TODO: the correct match for row $i$ is column $i$ (the diagonal). Apply
        cross-entropy across <i>rows</i> (each image picks its text) <b>and</b> across <i>columns</i> (each text
        picks its image); average the two. <i># labels = [0,1,...,N-1].</i></li>
        <li><b>Zero-shot.</b> TODO: freeze both encoders; embed a held-out image and all class-name texts; predict
        $\\arg\\max$ cosine similarity.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>CLIP (§2.3) has two towers. The <b>image encoder</b> $I(\\cdot)$ (the paper uses a ResNet or a Vision
       Transformer) turns an image into a vector; the <b>text encoder</b> $T(\\cdot)$ (a Transformer over the
       caption tokens) turns a piece of text into a vector. Each tower ends in a linear projection into the
       <b>same</b> $d$-dimensional <b>joint embedding space</b>, and both outputs are <b>L2-normalized</b> to unit
       length so that a dot product equals the <b>cosine similarity</b> — the cosine of the angle between two
       vectors, in $[-1,1]$, large when they point the same way.</p>
       <p>Now take a minibatch of $N$ real (image, text) pairs. Embed all images into $I_1,\\dots,I_N$ and all
       texts into $T_1,\\dots,T_N$. Form the $N\\times N$ grid of cosine similarities: entry $(i,k)$ is
       $\\mathrm{sim}(I_i, T_k)$. The <b>diagonal</b> entries $(i,i)$ are the $N$ <b>real</b> pairs (image $i$ with
       its own caption) — these are the <b>positives</b>. The $N^2-N$ <b>off-diagonal</b> entries are mismatched
       image–text combinations — the <b>negatives</b>. The objective: make the diagonal large and everything else
       small. The paper (Figure 1) calls this "jointly training an image encoder and text encoder to predict the
       correct pairings of a batch."</p>
       <p>Concretely, scale every similarity by $1/\\tau$ where $\\tau$ is a <b>temperature</b> (small $\\tau$
       sharpens the contrast). The paper learns $\\tau$ as a "log-parameterized multiplicative scalar" — it stores
       $\\log(1/\\tau)$ as a parameter and optimizes it, initialized at $1/\\tau = 1/0.07$. Then read each <b>row</b>
       of the scaled grid as a classification problem: "given image $i$, which of the $N$ texts is its caption?"
       The correct answer is column $i$, so a cross-entropy with target $i$ pulls the diagonal up. Do the same
       down each <b>column</b>: "given text $k$, which image is it describing?" Average the two cross-entropies —
       the <b>symmetric</b> loss. This is exactly <b>InfoNCE</b> applied in both directions.</p>
       <p><b>Zero-shot classification</b> (§3.1) reuses the trained text encoder as a classifier builder. To
       classify an image among $C$ classes you have <i>never</i> trained a head for: write each class as a text
       prompt — e.g. "a photo of a {class}." — and embed all $C$ prompts with $T(\\cdot)$. These $C$ text vectors
       act like the rows of a classifier weight matrix. Embed the image with $I(\\cdot)$, compute its cosine
       similarity to each of the $C$ prompt embeddings, and predict the $\\arg\\max$. No fine-tuning, no labelled
       images of those classes — the alignment learned from captions does the work.</p>`,
    architecture:
      `<p><b>Dual-encoder (two-tower) contrastive model</b> (§2.4–2.5). The two towers never share weights; they
       only meet in the shared embedding space.</p>
       <p><b>1 · Image encoder.</b> Either a modified <b>ResNet</b> (ResNet-50 family, with antialiased
       blur-pool, ResNet-D stem, and an attention-pooling head replacing global average pooling) or a <b>Vision
       Transformer</b> (ViT-B/32, ViT-B/16, ViT-L/14). Input image → feature vector $I^f\\in\\mathbb{R}^{d_i}$.</p>
       <p><b>2 · Text encoder.</b> A <b>Transformer</b>: 63M params, 12 layers, 512-wide, 8 attention heads, over a
       49,152-token byte-pair-encoded vocabulary, max context 76 tokens. The caption is bracketed by [SOS]/[EOS];
       the activation at the [EOS] position is the text feature $T^f\\in\\mathbb{R}^{d_t}$.</p>
       <p><b>3 · Linear projections.</b> $W_i$ maps $I^f$ and $W_t$ maps $T^f$ into the <b>same</b> $d$-dim joint
       multimodal embedding; each output is <b>L2-normalized</b> to the unit sphere. No nonlinear projection head
       (unlike SimCLR) — a single linear layer per tower.</p>
       <p><b>4 · Contrastive pretraining.</b> Trained from scratch on <b>WIT</b> — 400 million (image, text) pairs
       scraped from the public internet (§2.2) — with a <b>very large minibatch of 32,768</b> for 32 epochs. The
       other pairs in each batch are the negatives, so a huge batch gives ~32k negatives per positive. A single
       <b>learned temperature</b> scalar $t=\\log(1/\\tau)$ scales the logits. Loss: symmetric cross-entropy over
       the $N\\times N$ similarity grid (Figure 3).</p>
       <p><b>5 · Inference (zero-shot).</b> Both towers freeze. The text tower turns class-name prompts into a
       "classifier weight matrix" of $C$ embeddings; the image tower embeds the image; prediction is the
       $\\arg\\max$ cosine similarity (§3.1). Our lesson replaces the ResNet/ViT and Transformer with small MLPs on
       toy feature vectors so the contrastive mechanism is the focus.</p>`,
    symbols: [
      { sym: "$I(\\cdot)$", desc: "the <b>image encoder</b> (a ResNet or Vision Transformer in the paper). Maps an image to a vector, then projects it into the shared embedding space." },
      { sym: "$T(\\cdot)$", desc: "the <b>text encoder</b> (a Transformer over caption tokens). Maps a piece of text to a vector in the <i>same</i> shared embedding space." },
      { sym: "$I^f,\\ T^f$", desc: "the raw <b>feature vectors</b> out of the image and text towers, <i>before</i> projection: $I^f\\in\\mathbb{R}^{N\\times d_i}$, $T^f\\in\\mathbb{R}^{N\\times d_t}$. They live in different-sized spaces." },
      { sym: "$W_i,\\ W_t$", desc: "the <b>linear projection</b> matrices: $W_i\\in\\mathbb{R}^{d_i\\times d}$ and $W_t\\in\\mathbb{R}^{d_t\\times d}$ map image and text features into the shared $d$-dim joint embedding." },
      { sym: "$d_i,\\ d_t$", desc: "the (different) output dimensions of the image-feature space and the text-feature space before projection." },
      { sym: "$I_i$", desc: "the L2-normalized <b>image embedding</b> of the $i$-th image in the batch (unit length)." },
      { sym: "$T_k$", desc: "the L2-normalized <b>text embedding</b> of the $k$-th caption in the batch (unit length)." },
      { sym: "$N$", desc: "the number of real <b>(image, text) pairs</b> in the minibatch. There are $N$ positives (the diagonal) and $N^2-N$ negatives (off-diagonal)." },
      { sym: "$d$", desc: "the dimension of the <b>joint embedding space</b> that both encoders project into." },
      { sym: "$\\mathrm{sim}(u,v)$", desc: "<b>cosine similarity</b> $= u^\\top v / (\\lVert u\\rVert\\,\\lVert v\\rVert)$: the cosine of the angle between two vectors, in $[-1,1]$. Since $I_i,T_k$ are unit-length, this is just the dot product $I_i^\\top T_k$. ($u^\\top v$ is the dot product; $\\lVert u\\rVert$ is the length of $u$.)" },
      { sym: "$\\tau$", desc: "the <b>temperature</b>: a positive number that divides every similarity before the softmax. The paper learns it as a log-parameterized scalar (it stores $\\log(1/\\tau)$). Small $\\tau$ → sharper contrast." },
      { sym: "$t$", desc: "the <b>learned log-temperature</b> stored as a parameter, $t=\\log(1/\\tau)$; the logits are multiplied by $\\exp(t)=1/\\tau$ (Figure 3), clipped so $1/\\tau\\le 100$." },
      { sym: "$L_{ik}$", desc: "the <b>logit</b> grid: $L_{ik} = \\mathrm{sim}(I_i, T_k)\\cdot\\exp(t) = \\mathrm{sim}(I_i, T_k)/\\tau$, an $N\\times N$ matrix. The diagonal $L_{ii}$ holds the true pairs." },
      { sym: "$\\text{CE}$", desc: "<b>cross-entropy</b>: the standard classification loss $-\\log$ of the softmax probability the model assigns to the correct class. Here the 'correct class' for row $i$ is column $i$." },
      { sym: "$C$", desc: "the number of candidate <b>classes</b> at zero-shot time. Each class name is written as a text prompt and embedded by $T(\\cdot)$ into one of $C$ prompt vectors $T_e^{(c)}$." },
      { sym: "$\\arg\\max$", desc: "<b>argument of the maximum</b>: the index of the largest entry. Zero-shot prediction is the class whose text embedding has the largest cosine similarity to the image." }
    ],
    formula: `$$ I^f = \\text{image\\_encoder}(I) \\in \\mathbb{R}^{N\\times d_i}, \\qquad T^f = \\text{text\\_encoder}(T) \\in \\mathbb{R}^{N\\times d_t} $$
       <p>The two towers (§2.4–2.5, Figure 3): an image encoder (ResNet or Vision Transformer) gives image features $I^f$; a text encoder (Transformer) gives text features $T^f$. They live in different-sized spaces ($d_i$ vs $d_t$).</p>
       $$ I_e = \\frac{I^f W_i}{\\lVert I^f W_i\\rVert_2}, \\qquad T_e = \\frac{T^f W_t}{\\lVert T^f W_t\\rVert_2} $$
       <p>Linear projections $W_i\\in\\mathbb{R}^{d_i\\times d}$ and $W_t\\in\\mathbb{R}^{d_t\\times d}$ map both into the <b>same</b> $d$-dim joint embedding, then each row is L2-normalized to unit length (Figure 3). $I_e,T_e$ are $N\\times d$.</p>
       $$ \\mathrm{sim}(I_i, T_k) \\;=\\; I_{e,i}^\\top T_{e,k} \\;=\\; \\cos\\angle(I_{e,i}, T_{e,k}) \\;\\in\\; [-1, 1] $$
       <p>Because both embeddings are unit length, the dot product equals the <b>cosine similarity</b> — the cosine of the angle between the image and text vectors (§2.3).</p>
       $$ \\text{logits} \\;=\\; I_e\\, T_e^\\top \\cdot \\exp(t), \\qquad L_{ik} = \\mathrm{sim}(I_i,T_k)\\cdot \\exp(t) = \\frac{\\mathrm{sim}(I_i,T_k)}{\\tau} $$
       <p>The $N\\times N$ similarity grid is scaled by a <b>learned temperature</b>. The paper stores $t=\\log(1/\\tau)$ as a parameter and multiplies by $\\exp(t)=1/\\tau$ (Figure 3); $\\exp(t)$ is clipped so $1/\\tau\\le 100$ (§2.5).</p>
       $$ L \\;=\\; \\tfrac{1}{2}\\,\\big[\\,\\underbrace{\\text{CE}_{\\text{row}}\\big(\\text{logits},\\ \\text{labels}=[0,1,\\dots,N\\!-\\!1]\\big)}_{\\text{loss\\_i: image} \\to \\text{text (axis }0)} \\;+\\; \\underbrace{\\text{CE}_{\\text{col}}\\big(\\text{logits},\\ \\text{labels}=[0,1,\\dots,N\\!-\\!1]\\big)}_{\\text{loss\\_t: text} \\to \\text{image (axis }1)}\\,\\big] $$
       <p>The <b>symmetric cross-entropy</b> objective (§2.3, Figure 3): the diagonal (label $i$ for row/col $i$) is the true pair. One cross-entropy across rows (each image picks its text), one across columns (each text picks its image), averaged — InfoNCE both ways.</p>
       $$ \\hat{y} \\;=\\; \\arg\\max_{c \\in \\{1,\\dots,C\\}} \\; \\mathrm{sim}\\!\\big(I_e,\\ T_e^{(c)}\\big), \\qquad T_e^{(c)} = T(\\text{“a photo of a } \\{\\text{class}_c\\}\\text{.”}) $$
       <p>Zero-shot classification (§3.1): embed each of the $C$ class names as a text prompt, embed the image, and predict the class whose prompt embedding has the largest cosine similarity to the image — no trained classifier head.</p>`,
    whatItDoes:
      `<p>Read the $N\\times N$ logit grid $L$ twice. <b>Row-wise</b> (image→text): each row $i$ is a softmax over
       "which of the $N$ texts is image $i$'s caption?"; the correct answer is text $i$ (the diagonal), so the
       cross-entropy with target $i$ pushes up $L_{ii}$ and pushes down the other $L_{ik}$ in that row.
       <b>Column-wise</b> (text→image): each column $k$ is a softmax over "which of the $N$ images does text $k$
       describe?"; the correct answer is image $k$, again the diagonal. Averaging the two directions makes the
       loss <b>symmetric</b> — neither modality is privileged.</p>
       <p>Minimizing $L$ does two things at once: it <b>raises the diagonal</b> (pull each real image–caption pair
       together) and <b>lowers the off-diagonal</b> (push every mismatched image–text pair apart). The temperature
       $\\tau$ controls how hard the softmax pushes: a small $\\tau$ magnifies differences so even slightly-wrong
       negatives are penalized. Because the labels are simply $[0,1,\\dots,N\\!-\\!1]$ — "the right text for image
       $i$ is the one at position $i$" — no human annotation is needed; the <i>pairing itself</i> is the label.</p>`,
    derivation:
      `<p><b>Short recap — full treatment in the concept lesson.</b> Each direction is an ordinary softmax
       cross-entropy. For the image→text direction, fix image $i$; its logits over the $N$ texts are
       $L_{ik} = \\mathrm{sim}(I_i,T_k)/\\tau$. The softmax gives
       $p_{ik} = e^{L_{ik}} / \\sum_{m} e^{L_{im}}$, the probability that text $k$ is image $i$'s caption, and the
       loss is $-\\log p_{ii}$ for the one-hot target "$k=i$." That is exactly the <b>InfoNCE</b> contrastive loss:
       one positive ($T_i$) against $N\\!-\\!1$ in-batch negatives. The text→image direction is the same expression
       transposed (softmax down columns). Averaging them is the symmetric InfoNCE. CLIP's only twist over SimCLR's
       NT-Xent is that the two "views" are now <b>different modalities</b> (an image and a caption) instead of two
       augmentations of one image, and the loss is read in both directions explicitly.</p>
       <p>The full why-it-works story — why cosine + temperature, how the gradient pulls positives and pushes hard
       negatives, why in-batch negatives suffice, and the link to mutual-information lower bounds — is in the
       <b>mod-contrastive</b> concept lesson. Head there for the contrastive-learning math; we recap and transcribe
       the Figure 3 objective here.</p>`,
    example:
      `<p>Work the symmetric loss by hand on a tiny batch of $N=2$ pairs. Suppose the embeddings are already
       unit-length, so cosine similarity is the dot product, and the model has produced this $2\\times2$
       similarity matrix $S$ (rows = images, columns = texts):</p>
       <ul>
        <li>$S = \\begin{bmatrix} \\mathrm{sim}(I_1,T_1) & \\mathrm{sim}(I_1,T_2) \\\\ \\mathrm{sim}(I_2,T_1) & \\mathrm{sim}(I_2,T_2) \\end{bmatrix} = \\begin{bmatrix} 0.9 & 0.1 \\\\ 0.2 & 0.8 \\end{bmatrix}$</li>
       </ul>
       <p>The diagonal entries ($0.9$ and $0.8$) are the <b>true</b> pairs. Use temperature $\\tau = 0.5$, so the
       logits are $L = S/\\tau = 2S$.</p>
       <ul class="steps">
        <li><b>Scale by $1/\\tau = 2$</b>: $L = \\begin{bmatrix} 1.8 & 0.2 \\\\ 0.4 & 1.6 \\end{bmatrix}$.</li>
        <li><b>Row 1 (image 1 → texts), softmax</b>: $e^{1.8}=6.0496,\\ e^{0.2}=1.2214$; sum $=7.2710$.
        Probability of the correct text (column 1): $p_{11} = 6.0496/7.2710 = 0.8320$. Row loss
        $=-\\log(0.8320) = 0.1839$.</li>
        <li><b>Row 2 (image 2 → texts), softmax</b>: $e^{0.4}=1.4918,\\ e^{1.6}=4.9530$; sum $=6.4448$.
        Probability of the correct text (column 2): $p_{22} = 4.9530/6.4448 = 0.7686$. Row loss
        $=-\\log(0.7686) = 0.2633$.</li>
        <li><b>Image→text cross-entropy</b> (average the two rows): $\\text{CE}_{\\text{row}} = (0.1839 + 0.2633)/2 = 0.2236$.</li>
        <li><b>Column 1 (text 1 → images), softmax</b> down the column: $e^{1.8}=6.0496,\\ e^{0.4}=1.4918$; sum $=7.5414$.
        Correct image is row 1: $p = 6.0496/7.5414 = 0.8022$; loss $=-\\log(0.8022)=0.2204$.</li>
        <li><b>Column 2 (text 2 → images), softmax</b>: $e^{0.2}=1.2214,\\ e^{1.6}=4.9530$; sum $=6.1744$.
        Correct image is row 2: $p = 4.9530/6.1744 = 0.8022$; loss $=-\\log(0.8022)=0.2204$.</li>
        <li><b>Text→image cross-entropy</b>: $\\text{CE}_{\\text{col}} = (0.2204 + 0.2204)/2 = 0.2204$.</li>
        <li><b>Symmetric loss</b>: $L = (0.2236 + 0.2204)/2 = 0.2220$.</li>
       </ul>
       <p>The loss is small ($0.222$) because the diagonal already dominates each row and column. If an
       off-diagonal entry grew larger than the diagonal — a mismatched pair looking more similar than the true
       one — the corresponding probability would fall and the loss would climb. These exact numbers are recomputed
       in the notebook's first cell so you can check your symmetric-loss implementation.</p>`,
    recipe:
      `<ol>
        <li><b>Two encoders.</b> An image encoder $I(\\cdot)$ and a text encoder $T(\\cdot)$, each projecting into
        the same $d$-dim embedding space (the paper: ResNet/ViT and a Transformer; we use small MLPs on toy
        feature vectors).</li>
        <li><b>Embed a batch of $N$ pairs.</b> Run the $N$ images and their $N$ captions through their encoders →
        $I_1\\dots I_N$, $T_1\\dots T_N$. <b>L2-normalize</b> every embedding to unit length.</li>
        <li><b>Logit grid.</b> Compute the $N\\times N$ cosine-similarity matrix $L = (I\\,T^\\top)/\\tau$, scaled by
        the learned temperature.</li>
        <li><b>Symmetric loss.</b> Targets are $[0,1,\\dots,N\\!-\\!1]$ (diagonal = positives). Cross-entropy across
        rows (image→text) + cross-entropy across columns (text→image), averaged (Figure 3).</li>
        <li><b>Train</b> both encoders jointly; watch the loss fall and the diagonal of $S$ rise above the
        off-diagonal.</li>
        <li><b>Zero-shot (§3.1).</b> Freeze both encoders. Embed each class name as a text prompt; embed a held-out
        image; predict $\\arg\\max$ cosine similarity. No classifier head, no fine-tuning.</li>
        <li><b>Check the headline:</b> zero-shot accuracy on held-out images should sit well above chance.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "we match the accuracy of the original ResNet-50 on ImageNet zero-shot
       without needing to use any of the 1.28 million training examples it was trained on." The paper studies
       this transfer across "over 30 different existing computer vision datasets, spanning tasks such as OCR,
       action recognition in videos, geo-localization, and many types of fine-grained object classification."</p>
       <p><i>These are the paper's reported figures, quoted from the abstract. The numbers in the CODEVIZ panel
       below are from our own tiny toy run — not the paper's results.</i></p>`,
    evaluation:
      `<p><b>What "working" means here.</b> This is a Track B build that actually trains, so you can measure it
       directly: two encoders trained with the symmetric loss should let <b>frozen</b> encoders classify
       <i>held-out</i> images zero-shot, well above chance.</p>
       <ul>
        <li><b>Metric &amp; benchmark.</b> The primary metric is <b>zero-shot accuracy on held-out images</b>:
        embed each class name as a prompt, embed the image, predict $\\arg\\max$ cosine similarity, compare to the
        true class (no trained head, &sect;3.1). The no-skill floor is the <b>chance rate $1/C$</b> &mdash; here
        $1/8 = 0.125$ for the toy 8-class set &mdash; and a stronger baseline is <b>random untrained encoders</b>
        with the same architecture (they should sit at chance). The paper's real-scale analogue: zero-shot CLIP
        "match[ing] the accuracy of the original ResNet-50 on ImageNet" (Abstract).</li>
        <li><b>Sanity checks before the full run.</b> Known-answer check on the worked example: the symmetric loss
        on $S = \\big[[0.9,0.1],[0.2,0.8]\\big]$ at $\\tau=0.5$ must equal <b>0.2220</b> (i2t $=0.2236$, t2i $=0.2204$);
        the code's cell 0 prints exactly this. Loss-at-init check: before training, with random embeddings on a
        batch of $N$, each direction is a near-uniform $N$-way softmax, so the symmetric loss should start near
        $-\\ln(1/N) = \\ln N$ (rule of thumb) &mdash; far from that means mis-scaled logits or a bad temperature init.
        Shape/range checks: embeddings are unit-length after <code>F.normalize</code> (norm $=1$); the logit grid is
        $N\\times N$; cosine similarities lie in $[-1,1]$ before the $1/\\tau$ scale. <b>Overfit one batch:</b> train
        on a single small batch and watch the loss fall toward $0$ as the diagonal of $S$ rises above the
        off-diagonal &mdash; if it won't overfit, the targets <code>torch.arange(N)</code> or the transpose are
        wrong.</li>
        <li><b>Expected range.</b> For the toy run, zero-shot held-out accuracy should land <b>far above
        $1/8 = 0.125$</b> &mdash; the CODEVIZ shows $\\approx 0.95$ for trained vs $\\approx 0.14$ for random (our toy
        numbers, seed/hardware-dependent, not the paper's). Anything hovering near $0.125$ after training is
        "probably a bug"; $0.6$&ndash;$0.9$ is "tuning" (noise level, batch size, epochs, lr). For the real paper the
        target is approximate and cited: zero-shot matching ResNet-50 on ImageNet (Abstract) &mdash; not reproduced
        here.</li>
        <li><b>Ablation &mdash; prove the central idea earns its keep.</b> CLIP's central component is the
        <b>symmetric</b> contrastive objective. Turn off one half: compute cross-entropy on the <i>rows only</i>
        (image&rarr;text), dropping the <code>logits.t()</code> (text&rarr;image) term. The text encoder now gets a
        weak one-sided signal; text&rarr;image retrieval and zero-shot accuracy should <b>drop</b> and the text
        embeddings degenerate. A second ablation: replace the trained encoders with <b>random untrained</b> ones
        and redo the same $\\arg\\max$ &mdash; accuracy must collapse to chance, proving the <i>training</i> (not the
        architecture or the matching rule) built the shared space. If neither ablation lowers the metric, the loss
        or the freeze isn't wired as intended.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Zero-shot stuck at $\\sim1/C$</b> &rarr; labels shuffled,
        wrong diagonal targets, or comparing image embeddings against the wrong (un-normalized / training-time)
        space. <b>Loss NaN or $1/\\tau$ exploding</b> &rarr; temperature learned directly instead of as
        $\\log(1/\\tau)$ with the clip to $1/\\tau\\le 100$ (&sect;2.5), or lr too high. <b>Collapsed / identical
        embeddings (all similarities equal)</b> &rarr; missing <code>F.normalize</code>, so the dot product isn't a
        cosine and the temperature is meaningless; or batch too small to supply real negatives. <b>Train loss falls
        but text&rarr;image is poor</b> &rarr; the asymmetric (row-only) loss above &mdash; restore the column term.
        <b>Worked-example loss $\\ne 0.222$</b> &rarr; forgot the $1/\\tau$ scale or averaged the two directions
        wrong.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b> them
       and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>, <code>nn.ReLU</code>,
       <code>F.normalize</code>, <code>F.cross_entropy</code>, and the optimizer. <b>Build by hand:</b> the two
       encoder towers projecting into a shared space, the L2-normalization, the scaled $N\\times N$ logit grid with
       a <b>learned</b> temperature, the <b>symmetric</b> cross-entropy (row direction + column direction,
       averaged — i.e. Figure 3), and the <b>zero-shot</b> $\\arg\\max$ matching on held-out data. We run on toy
       (image-feature, class-name-feature) vectors rather than real pixels/tokens so the whole thing trains in
       seconds and the contrastive mechanism is the star; the encoder choices (ResNet/ViT, Transformer) are
       orthogonal plumbing. The contrastive-learning math is recapped from the <b>mod-contrastive</b> concept
       lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to L2-normalize before the similarity.</b> CLIP uses <i>cosine</i> similarity. If you
        skip <code>F.normalize</code> you are using raw dot products, and the learned temperature no longer means
        what the paper intends. <b>Fix:</b> normalize both $I$ and $T$ to unit length first.</li>
        <li><b>Doing the loss in only one direction.</b> CLIP's loss is <b>symmetric</b> — image→text <i>and</i>
        text→image, averaged. Using just the row direction (image→text) trains the image encoder to find texts but
        gives the text encoder a weaker signal. <b>Fix:</b> apply cross-entropy to both <code>logits</code> and
        <code>logits.t()</code> and average.</li>
        <li><b>Mislabelling the diagonal.</b> The correct match for row $i$ is column $i$, so the targets are
        <code>torch.arange(N)</code>. An off-by-one or a shuffle here trains the model to align the wrong pairs.</li>
        <li><b>Letting the temperature run away.</b> Learning $\\tau$ directly can make $1/\\tau$ explode and
        destabilize training; the paper learns $\\log(1/\\tau)$ and <b>clips</b> it (to $1/\\tau \\le 100$).
        Optimizing $\\tau$ without the log-parameterization / clip is a common instability.</li>
        <li><b>Too few negatives (small batch).</b> The negatives are the other pairs in the batch. A tiny batch
        gives almost no off-diagonal negatives, so the task is too easy and the embeddings are weak. CLIP used very
        large batches; use as large a batch as fits.</li>
        <li><b>Probing the wrong space at zero-shot time.</b> Zero-shot compares the image embedding to <i>text</i>
        prompt embeddings in the <b>shared</b> space — both produced by the trained encoders and L2-normalized. Use
        the same normalization at test time as in training.</li>
      </ul>`,
    recall: [
      "Write the symmetric CLIP loss (Figure 3) from memory: what are the two directions and how are they combined?",
      "What sits on the diagonal of the $N\\times N$ similarity grid, and what is off-diagonal?",
      "Define the cosine similarity $\\mathrm{sim}(u,v)$ and the temperature $\\tau$; how does CLIP parameterize $\\tau$?",
      "Describe zero-shot classification with CLIP in two sentences (prompts → embed → argmax).",
      "Why is CLIP called a <i>cross-modal</i> contrastive method, and how does that differ from SimCLR's two views?"
    ],
    practice: [
      {
        q: `<b>The headline.</b> You trained image and text encoders with the symmetric contrastive loss on toy
            (image, class-name) pairs, then froze them and classified <i>held-out</i> images by matching each to
            the class-name embeddings — never training a classifier head. Zero-shot accuracy is well above chance.
            What does that demonstrate, and what is the one-line ablation that would <i>break</i> it?`,
        steps: [
          { do: `Confirm zero-shot accuracy on held-out images sits well above the $1/C$ chance rate.`, why: `Above-chance matching with no trained head means the joint image–text space generalizes to unseen images.` },
          { do: `Ablate: replace the trained encoders with <b>random (untrained)</b> ones and redo the argmax matching.`, why: `If the alignment came from the architecture or the argmax rule rather than training, random encoders would match too. They do not — isolating the contrastive <i>training</i>.` },
          { do: `Conclude the symmetric InfoNCE training, not the architecture or the matching rule, built the shared space.`, why: `Same encoders, same argmax, same data; only whether they were trained differs.` }
        ],
        answer: `<p>It demonstrates that the <b>symmetric contrastive training aligned images and class-name text
                 into one shared space</b> that generalizes: a held-out image lands nearest its own class name, so
                 plain $\\arg\\max$ cosine similarity classifies it — <b>zero-shot</b>, no head. Swapping in
                 <b>random untrained encoders</b> is the ablation that breaks it: matching collapses to chance,
                 isolating the InfoNCE training (not the architecture or the argmax) as the source of the
                 alignment. Our CODEVIZ panel shows trained-encoder zero-shot accuracy far above the random-encoder
                 baseline.</p>`
      },
      {
        q: `Your worked example gave a symmetric loss of $0.222$ with the diagonal dominating. Now suppose the
            model gets confused on pair 1: $\\mathrm{sim}(I_1,T_2)$ jumps from $0.1$ to $0.95$ while
            $\\mathrm{sim}(I_1,T_1)$ stays $0.9$ (keep the rest of $S$ and $\\tau=0.5$). Does the image→text loss
            for row 1 go up or down, and why?`,
        steps: [
          { do: `Recompute row-1 logits at $1/\\tau=2$: $L_{11}=1.8$ (unchanged), $L_{12}=2\\times0.95=1.9$ (was $0.2$).`, why: `Only the off-diagonal entry in row 1 changed; scale by $1/\\tau$.` },
          { do: `Softmax row 1: $e^{1.8}=6.0496,\\ e^{1.9}=6.6859$; sum $=12.7355$. $p_{11}=6.0496/12.7355=0.4750$.`, why: `A negative now <i>more</i> similar than the true text inflates the denominator and steals probability.` },
          { do: `Row-1 loss $=-\\log(0.4750)=0.7444$, up from $0.1839$.`, why: `Smaller probability for the correct text means larger $-\\log p$.` }
        ],
        answer: `<p>The row-1 loss <b>goes up sharply</b>, from $0.184$ to about $0.744$ (and the overall symmetric
                 loss rises with it). A mismatched text ($T_2$) that is <i>more</i> similar to image 1 than its true
                 caption ($T_1$) inflates the softmax denominator, so the probability of the correct pair drops
                 ($0.83 \\to 0.48$) and $-\\log p$ climbs. That is exactly the pressure the contrastive loss applies:
                 push the off-diagonal (wrong) pairs below the diagonal (right) ones.</p>`
      },
      {
        q: `You implement the loss as cross-entropy on the rows only (image→text) and skip the column direction.
            Training "works" — the loss falls — but zero-shot matching of <i>texts to images</i> is poor and the
            text embeddings look degenerate. What did the missing term provide, and why does omitting it hurt?`,
        steps: [
          { do: `Recall the loss is symmetric: $\\tfrac12(\\text{CE}_{\\text{row}} + \\text{CE}_{\\text{col}})$.`, why: `The row term trains "given an image, find its text"; the column term trains "given a text, find its image."` },
          { do: `Note that with only the row term, the gradient signal to the <b>text</b> encoder is weaker and one-sided.`, why: `Each text appears as a target in exactly one row, but the column term would make every text actively compete to pick its own image — a stronger, balanced signal.` },
          { do: `Fix: add cross-entropy on <code>logits.t()</code> with the same targets and average the two.`, why: `That restores the text→image direction, so both encoders get a symmetric pull-together / push-apart signal.` }
        ],
        answer: `<p>You dropped the <b>text→image</b> (column) cross-entropy, so the loss became asymmetric. The
                 missing term trains the <i>text</i> encoder to pick the right image out of the batch; without it
                 the text side gets a weak, one-sided signal and its embeddings drift, so text→image retrieval
                 fails. <b>Fix:</b> compute cross-entropy on both the logits and their transpose with targets
                 $[0,\\dots,N\\!-\\!1]$ and average — the symmetric objective of Figure 3.</p>`
      }
    ]
  });

  window.CODE["paper-clip"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> two encoder towers (image + text), the L2-normalization, the scaled
       $N\\times N$ logit grid with a <b>learned</b> temperature, and the <b>symmetric</b> contrastive loss by
       hand on <code>nn</code> primitives — then train on a toy set of (image-vector, class-name-vector) pairs and
       do <b>zero-shot</b> matching on <i>held-out</i> images. The first cell recomputes the worked example: the
       symmetric loss on the $2\\times2$ matrix $\\big[[0.9,0.1],[0.2,0.8]\\big]$ at $\\tau=0.5$ equals
       <b>0.2220</b>. The toy data gives each of $C$ classes a hidden prototype vector; an "image" is its class
       prototype plus noise and its "text" is the (different-dimensional) class-name vector — so the encoders must
       <i>learn</i> the cross-modal alignment. After training we freeze both encoders and classify held-out images
       by $\\arg\\max$ cosine similarity to the class-name embeddings. Paste into Colab and run (no GPU needed).</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Sanity-check the worked example: symmetric CLIP loss on a 2x2 similarity matrix. ---
# S rows = images, cols = texts; diagonal = true pairs; temperature tau = 0.5  ->  logits = S/tau.
S = torch.tensor([[0.9, 0.1],
                  [0.2, 0.8]])
tau = 0.5
logits = S / tau                                    # N x N scaled cosine-similarity (image rows)
labels = torch.arange(S.shape[0])                   # diagonal is the positive: [0, 1, ..., N-1]
loss_i2t = F.cross_entropy(logits,     labels)      # image -> text  (across rows)
loss_t2i = F.cross_entropy(logits.t(), labels)      # text  -> image (across columns)
clip_loss = (loss_i2t + loss_t2i) / 2
print("worked example:  i2t =", round(loss_i2t.item(),4),
      " t2i =", round(loss_t2i.item(),4),
      " symmetric =", round(clip_loss.item(),4))
# worked example:  i2t = 0.2236  t2i = 0.2204  symmetric = 0.222


# --- 1. Toy cross-modal data: C classes, each with a hidden prototype. ---
# An "image" = class prototype (in image space) + noise; its "text" = class-name vector (text space).
# The two spaces have DIFFERENT dimensions, so the encoders must learn a shared alignment.
C, IMG_DIM, TXT_DIM, D = 8, 32, 24, 16              # classes, image-dim, text-dim, shared embed dim
img_proto = torch.randn(C, IMG_DIM)                 # hidden image prototype per class
txt_proto = torch.randn(C, TXT_DIM)                 # the class-name (text) vector per class

def sample(n_per_class, noise=0.6):
    ys = torch.arange(C).repeat_interleave(n_per_class)
    imgs = img_proto[ys] + noise * torch.randn(len(ys), IMG_DIM)   # noisy image features
    txts = txt_proto[ys]                                           # class-name text features
    return imgs, txts, ys

train_imgs, train_txts, train_y = sample(40)        # training pairs
train_imgs, train_txts = train_imgs.to(device), train_txts.to(device)


# --- 2. Two encoder towers -> shared D-dim space (built by hand from nn primitives). ---
class Encoder(nn.Module):                            # small MLP into the joint embedding space
    def __init__(self, din, d=D, hid=64):
        super().__init__(); self.l1 = nn.Linear(din, hid); self.l2 = nn.Linear(hid, d)
    def forward(self, x): return self.l2(F.relu(self.l1(x)))      # raw embedding (normalized later)

img_enc, txt_enc = Encoder(IMG_DIM).to(device), Encoder(TXT_DIM).to(device)
# learned temperature, log-parameterized as in the paper: store log(1/tau), init 1/tau = 1/0.07.
log_inv_tau = nn.Parameter(torch.tensor(np.log(1/0.07), dtype=torch.float32, device=device))
params = list(img_enc.parameters()) + list(txt_enc.parameters()) + [log_inv_tau]
opt = torch.optim.Adam(params, lr=1e-3)


# --- 3. The symmetric CLIP loss (Figure 3), built by hand. ---
def clip_step(imgs, txts):
    Ie = F.normalize(img_enc(imgs), dim=1)           # L2-normalize -> cosine = dot product
    Te = F.normalize(txt_enc(txts), dim=1)
    scale = log_inv_tau.exp().clamp(max=100.0)       # 1/tau, clipped for stability (paper)
    logits = scale * Ie @ Te.t()                     # N x N scaled cosine-similarity grid
    tgt = torch.arange(len(imgs), device=imgs.device)
    return (F.cross_entropy(logits, tgt) + F.cross_entropy(logits.t(), tgt)) / 2   # symmetric

# --- 4. Train both encoders jointly with in-batch negatives. ---
img_enc.train(); txt_enc.train(); B = 64; M = len(train_imgs)
for ep in range(300):
    perm = torch.randperm(M, device=device); tot = 0.0; nb = 0
    for s in range(0, M, B):
        bi = perm[s:s+B]
        loss = clip_step(train_imgs[bi], train_txts[bi])
        opt.zero_grad(); loss.backward(); opt.step(); tot += loss.item(); nb += 1
    if ep % 60 == 0: print(f"  ep {ep:3d}  symmetric loss {tot/nb:.3f}  (1/tau={log_inv_tau.exp().item():.1f})")

# --- 5. ZERO-SHOT: freeze encoders; classify HELD-OUT images by matching to class-name embeddings. ---
img_enc.eval(); txt_enc.eval()
test_imgs, _, test_y = sample(50)                    # fresh held-out images, never seen in training
test_imgs = test_imgs.to(device)
with torch.no_grad():
    class_emb = F.normalize(txt_enc(txt_proto.to(device)), dim=1)   # one text embedding per class
    img_emb   = F.normalize(img_enc(test_imgs), dim=1)
    sims = img_emb @ class_emb.t()                   # cosine sim of each image to every class name
    pred = sims.argmax(1).cpu()                      # zero-shot prediction = most similar class name
acc = (pred == test_y).float().mean().item()
print(f"\\nZERO-SHOT accuracy on held-out images: {acc:.3f}   (chance = {1/C:.3f})")
# Trained CLIP-style encoders match held-out images to their class name far above chance.
# (Exact numbers vary by hardware/seed; this is our small toy run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-clip"] = {
    question: "Does symmetric contrastive training let frozen encoders classify held-out images zero-shot, far above a random-encoder baseline?",
    charts: [
      {
        type: "bar",
        title: "Zero-shot accuracy on held-out images (8-class toy) — trained vs random encoders vs chance",
        xlabel: "encoders",
        ylabel: "zero-shot accuracy",
        series: [
          {
            name: "zero-shot accuracy",
            color: "#7ee787",
            points: [["trained (CLIP loss)", 0.945], ["random (untrained)", 0.135], ["chance (1/8)", 0.125]]
          }
        ]
      }
    ],
    caption: "Our small toy run, not the paper's reported numbers. Two small MLP encoders (image-feature tower + class-name/text tower) were trained with the <b>symmetric contrastive loss</b> (InfoNCE both ways, learned temperature) on 8-class toy (image, class-name) pairs, then <b>frozen</b>. Classifying <i>held-out</i> images <b>zero-shot</b> — argmax cosine similarity to the class-name embeddings, no trained head — reaches ~0.95 accuracy (green), versus ~0.14 for the same architecture with <b>random untrained</b> encoders and the 1/8 = 0.125 chance rate. The contrastive <i>training</i>, not the architecture or the argmax rule, built the shared image-text space. (Toy data, tiny encoders; the qualitative gap is the point.)",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

# Train two encoders with the SYMMETRIC contrastive loss on toy (image, class-name) pairs, freeze
# them, then ZERO-SHOT classify held-out images by argmax cosine similarity to class-name embeddings.
# Compare trained encoders vs random (untrained) encoders vs the 1/C chance rate (toy reproduction).
C, IMG_DIM, TXT_DIM, D = 8, 32, 24, 16
img_proto = torch.randn(C, IMG_DIM); txt_proto = torch.randn(C, TXT_DIM)

def sample(n, noise=0.6):
    ys = torch.arange(C).repeat_interleave(n)
    return img_proto[ys] + noise*torch.randn(len(ys), IMG_DIM), txt_proto[ys], ys

class Encoder(nn.Module):
    def __init__(s, din, d=D, hid=64):
        super().__init__(); s.l1=nn.Linear(din,hid); s.l2=nn.Linear(hid,d)
    def forward(s, x): return s.l2(F.relu(s.l1(x)))

def clip_loss(ie, te, scale):
    Ie=F.normalize(ie,dim=1); Te=F.normalize(te,dim=1)
    logits = scale * Ie @ Te.t(); tgt = torch.arange(len(ie))
    return (F.cross_entropy(logits,tgt) + F.cross_entropy(logits.t(),tgt))/2

def zero_shot_acc(img_enc, txt_enc):
    img_enc.eval(); txt_enc.eval()
    ti, _, ty = sample(50)
    with torch.no_grad():
        ce = F.normalize(txt_enc(txt_proto), dim=1)
        ie = F.normalize(img_enc(ti), dim=1)
        pred = (ie @ ce.t()).argmax(1)
    return (pred == ty).float().mean().item()

tr_i, tr_t, _ = sample(40)
# --- trained encoders ---
ie_t, te_t = Encoder(IMG_DIM), Encoder(TXT_DIM)
log_inv_tau = nn.Parameter(torch.tensor(np.log(1/0.07)))
opt = torch.optim.Adam(list(ie_t.parameters())+list(te_t.parameters())+[log_inv_tau], lr=1e-3)
ie_t.train(); te_t.train(); B=64; M=len(tr_i)
for ep in range(300):
    perm = torch.randperm(M)
    for s in range(0, M, B):
        bi = perm[s:s+B]; scale = log_inv_tau.exp().clamp(max=100.0)
        loss = clip_loss(ie_t(tr_i[bi]), te_t(tr_t[bi]), scale)
        opt.zero_grad(); loss.backward(); opt.step()
acc_trained = zero_shot_acc(ie_t, te_t)
# --- random (untrained) encoders, same architecture ---
acc_random = zero_shot_acc(Encoder(IMG_DIM), Encoder(TXT_DIM))

print("trained", round(acc_trained,3), "random", round(acc_random,3), "chance", round(1/C,3))
# trained zero-shot accuracy >> random ~ chance: the contrastive training built the shared space.`
  };
})();
