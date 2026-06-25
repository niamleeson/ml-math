/* Paper lesson — "LLaMA: Open and Efficient Foundation Language Models",
   Touvron, Lavril, Izacard, Martinet, Lachaux, Lacroix, Roziere, Goyal, Hambro,
   Azhar, Rodriguez, Joulin, Grave, Lample (Meta AI, 2023).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-llama".
   GROUNDED from arXiv:2302.13971 (abstract) and the ar5iv HTML mirror:
   Abstract (7B-65B params, trillions of tokens, public data only, LLaMA-13B vs
   GPT-3, LLaMA-65B vs Chinchilla-70B / PaLM-540B); Introduction (inference-budget
   vs training-budget argument, the "smaller model trained longer is cheaper at
   inference" claim, and the Hoffmann/Chinchilla "10B on 200B tokens" contrast vs
   "7B keeps improving past 1T tokens"); Section 2.1 (data mixture + ~1.4T tokens);
   Section 2.2 Architecture (RMSNorm pre-normalization [GPT-3 ref], SwiGLU [PaLM ref,
   dimension 2/3*4d], RoPE [GPTNeo ref]); Section 2 optimizer (AdamW b1=0.9 b2=0.95,
   cosine schedule to 10%, weight decay 0.1, grad clip 1.0, 2000 warmup steps);
   Table 2 (per-model dim / heads / layers / tokens).
   NOTE the paper does NOT print the RMSNorm formula — it cites Zhang & Sennrich
   (2019). The RMSNorm equation we show is the STANDARD definition from that source,
   clearly flagged as such, not transcribed from the LLaMA paper.
   Track: read-only (open-model / training-recipe result). No from-scratch full model.
   The CODEVIZ is OUR conceptual illustration: RMSNorm vs LayerNorm on one toy
   tensor on CPU — NOT a number from the paper. */
(function () {
  window.LESSONS.push({
    id: "paper-llama",
    title: "LLaMA — Open and Efficient Foundation Language Models (2023)",
    tagline: "Train smaller models on far more tokens, on public data only, with three clean architecture tweaks.",
    module: "Papers · Transformers & LLMs",
    track: "read-only",
    paper: {
      authors: "Hugo Touvron, Thibaut Lavril, Gautier Izacard, Xavier Martinet, Marie-Anne Lachaux, Timothee Lacroix, Baptiste Roziere, Naman Goyal, Eric Hambro, Faisal Azhar, Aurelien Rodriguez, Armand Joulin, Edouard Grave, Guillaume Lample",
      org: "Meta AI (FAIR)",
      year: 2023,
      venue: "arXiv:2302.13971 (Feb 2023)",
      citations: "",
      arxiv: "https://arxiv.org/abs/2302.13971",
      code: "https://github.com/facebookresearch/llama"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-transformer", "paper-chinchilla", "paper-layernorm", "dl-activations", "dl-language-model"],

    // WHY READ IT
    problem:
      `<p>Before LLaMA, the strongest large language models had two problems for everyone outside a few big labs.
       First, the best ones were trained on <b>private data</b> you could not see or reuse, and the model weights
       were often closed. Second, the field's scaling advice pushed toward <b>ever-bigger models</b>. A
       <b>large language model</b> (often shortened to LLM) is a network trained to predict the next
       <b>token</b> (a word or word-piece) in text; "scaling" means making it bigger or training it on more data.</p>
       <p>The dominant scaling rule at the time came from the Chinchilla paper (Hoffmann et al., 2022). It asked:
       given a fixed <b>training compute budget</b> &mdash; the total arithmetic you can afford <i>while training</i>
       &mdash; what model size and how many training tokens give the lowest loss? Its answer favored training a
       model of a given size on a matched amount of data, then stopping. LLaMA's authors point out a gap in that
       framing. As they put it (Introduction): "this objective disregards the inference budget, which becomes
       critical when serving a language model at scale."</p>
       <p>The <b>inference budget</b> is the compute you spend <i>every single time you run the finished model</i>
       to answer a query. A model you deploy to millions of users runs billions of times. So the real question
       LLaMA asks is not "what is cheapest to train?" but "what is cheapest to <i>train and then serve</i>?"</p>`,
    contribution:
      `<ul>
        <li><b>Train smaller models on far more tokens.</b> LLaMA deliberately trains modest-sized models well
        past the point Chinchilla's compute-optimal rule would stop, because a smaller model that was trained
        longer is cheaper to run at inference forever after. The paper notes (Introduction) that whereas
        "Hoffmann et al. (2022) recommends training a 10B model on 200B tokens, we find that the performance of a
        7B model continues to improve even after 1T tokens."</li>
        <li><b>Public data only.</b> From the abstract: LLaMA shows "it is possible to train state-of-the-art
        models using publicly available datasets exclusively, without resorting to proprietary and inaccessible
        datasets." The whole training set (about 1.4 trillion tokens) is built from public sources (&sect;2.1).</li>
        <li><b>Three concrete architecture tweaks (&sect;2.2).</b> On top of the standard Transformer, LLaMA uses
        <b>RMSNorm pre-normalization</b> (normalize the input of each sub-layer), the <b>SwiGLU</b> activation
        function in the feed-forward block, and <b>Rotary Position Embeddings (RoPE)</b> instead of absolute
        position embeddings. Each is borrowed from prior work; together they define the recipe a whole generation
        of open models copied.</li>
      </ul>`,
    whyItMattered:
      `<p>LLaMA reframed the goal of scaling from "lowest training loss per training-FLOP" to "best model you can
       cheaply <i>serve</i>." That single shift &mdash; train a smaller model longer &mdash; made strong models
       runnable on modest hardware, which is why open models exploded after this paper. From the abstract:
       "LLaMA-13B outperforms GPT-3 (175B) on most benchmarks, and LLaMA-65B is competitive with the best models,
       Chinchilla-70B and PaLM-540B." A 13-billion-parameter model beating a 175-billion-parameter one on most
       tasks is the headline that made the train-longer argument concrete.</p>
       <p>Just as important, the exact architecture LLaMA settled on &mdash; RMSNorm, SwiGLU, RoPE &mdash; became
       the <b>default recipe</b> for open large language models that followed. The lasting idea:
       <b>open data, a smaller model trained on more tokens, and a small set of well-chosen architecture tweaks
       can match models many times larger.</b></p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Introduction</b> &mdash; the inference-budget argument. This is the "why" of the whole paper: the
        sentences about serving cost, and the contrast with the Chinchilla recommendation. Everything else follows
        from it.</li>
        <li><b>&sect;2.1 (Pre-training data)</b> &mdash; the public-data mixture and the total token count
        (about 1.4 trillion tokens). Note <i>which</i> sources, and that all are public.</li>
        <li><b>&sect;2.2 (Architecture)</b> &mdash; the three tweaks: RMSNorm pre-normalization, SwiGLU, and RoPE.
        This is the part you should be able to explain in plain words.</li>
        <li><b>Table 2</b> &mdash; the four model sizes with their dimension, head count, layer count, and training
        tokens. Notice the smallest models still see 1 trillion tokens.</li>
       </ul>
       <p><b>Skim:</b> the optimizer details (AdamW, cosine schedule), the efficient-implementation notes, and the
       long benchmark tables (common-sense reasoning, question answering, etc.) &mdash; useful for replication, not
       needed to grasp the core idea. You do <b>not</b> implement this paper; it is an open-model and
       training-recipe result. Read it for the inference-budget reasoning and the three architecture tweaks.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Chinchilla's compute-optimal rule, for a fixed <b>training</b> budget, would stop a 10-billion-parameter
       model after roughly 200 billion tokens. LLaMA instead trains a 7-billion-parameter model on more than
       1 trillion tokens &mdash; about five times as many tokens, on a <i>smaller</i> model.</p>
       <p>Here is the question to guess before reading on: LLaMA's training cost (per model, in FLOPs) is
       <i>higher</i> than the compute-optimal choice for that quality level, not lower. So why is that a smart
       trade? Write one sentence about which budget &mdash; training or inference &mdash; LLaMA is optimizing, and
       why that budget can dwarf the training cost once a model is deployed.</p>
       <p>(Hint: a model is trained once but runs every time anyone uses it.)</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch. Instead, before the reveal, reason
       through the two architecture tweaks you will see illustrated, on paper:</p>
       <ul>
        <li><b>Normalization.</b> Standard <b>LayerNorm</b> (layer normalization) re-centers a vector to mean zero
        and rescales it to unit variance, then applies a learned scale and shift. <b>RMSNorm</b> (root-mean-square
        normalization) drops the re-centering: it divides by the root-mean-square of the entries only. Predict:
        if you feed both the same vector, when would their outputs differ most &mdash; when the vector's mean is
        near zero, or far from zero?</li>
        <li><b>Pre- vs post-normalization.</b> The original Transformer normalized the <i>output</i> of each
        sub-layer. LLaMA normalizes the <i>input</i> of each sub-layer ("pre-normalization"). Predict: which
        placement keeps the residual (skip-connection) path cleaner for gradients to flow through?</li>
        <li>TODO: write, in one line each, what RMSNorm, SwiGLU, and RoPE replace in a standard Transformer block.</li>
       </ul>
       <p>The CODEVIZ panel below runs RMSNorm and LayerNorm on one small toy vector so you can see exactly how
       the missing re-centering changes the output &mdash; clearly labeled as our own illustration, not a number
       from the paper.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>LLaMA is a <b>decoder-only Transformer</b> &mdash; the same family as GPT &mdash; with one strategic
       <i>training</i> decision and three small <i>architecture</i> changes. Take them in turn.</p>

       <p><b>The strategic decision: train smaller, train longer.</b> The Chinchilla scaling laws answer "for a
       fixed amount of <i>training</i> compute, what size model and how many tokens minimize loss?" LLaMA's authors
       observe this ignores what happens <i>after</i> training. As they write (Introduction): "although it may be
       cheaper to train a large model to reach a certain level of performance, a smaller one trained longer will
       ultimately be cheaper at inference." A deployed model runs billions of times, so its per-run cost &mdash;
       which scales with model size &mdash; matters more than a one-time training bill. The practical consequence:
       keep the model small, and pour in far more tokens than the compute-optimal rule suggests. The paper reports
       that a 7-billion-parameter model "continues to improve even after 1T tokens," well past Chinchilla's
       stopping point. (See the cross-linked Chinchilla lesson for the compute-optimal rule LLaMA is departing
       from.)</p>

       <p><b>The data: public only (&sect;2.1).</b> The training set is roughly 1.4 trillion tokens, drawn entirely
       from publicly available sources. The approximate mixture is: English CommonCrawl (a large web crawl) about
       67%, C4 (a cleaned web corpus) about 15%, GitHub code about 4.5%, Wikipedia about 4.5%, public books
       (Project Gutenberg and Books3) about 4.5%, ArXiv scientific papers about 2.5%, and Stack Exchange about 2%.
       The point of &sect;2.1 is that no proprietary data is needed.</p>

       <p><b>Tweak 1 &mdash; RMSNorm pre-normalization (&sect;2.2).</b> A normalization layer rescales the vector
       flowing through the network so its size stays stable across depth, which keeps training well-behaved.
       Standard <b>LayerNorm</b> does two things to a vector $x$ with $d$ entries: it subtracts the mean (re-centering)
       and divides by the standard deviation (rescaling). LLaMA instead uses <b>RMSNorm</b>, which keeps only the
       rescaling: it divides by the <b>root mean square</b> (the square root of the average of the squared entries)
       and skips the mean-subtraction entirely. Fewer operations, and in practice just as stable. LLaMA also moves
       the normalization to the <i>input</i> of each sub-layer ("pre-normalization") rather than the output, which
       keeps the residual path &mdash; the skip connection that adds a sub-layer's input back to its output &mdash;
       a clean, unnormalized highway for gradients. <i>Important:</i> the LLaMA paper cites RMSNorm (Zhang and
       Sennrich, 2019) but does <b>not</b> print its formula; the equation in the next section is the standard
       definition from that source, shown here so you can see exactly what changed.</p>

       <p><b>Tweak 2 &mdash; SwiGLU activation (&sect;2.2).</b> Inside each Transformer block is a small
       <b>feed-forward network</b> (two linear layers with a non-linear function between them). The original used
       <b>ReLU</b> (rectified linear unit), which simply zeroes out negatives. LLaMA replaces it with <b>SwiGLU</b>
       (a "gated" activation): the input is sent through two linear maps, one of which acts as a smooth gate that
       multiplies the other, letting the network modulate how much of each feature passes. The paper notes it uses
       "a dimension of $2/3 \\cdot 4d$ instead of $4d$ as in PaLM" &mdash; that is, it shrinks the hidden width to
       keep the parameter count comparable, because SwiGLU uses three weight matrices instead of two. SwiGLU is
       borrowed from the PaLM model.</p>

       <p><b>Tweak 3 &mdash; Rotary Position Embeddings, RoPE (&sect;2.2).</b> A Transformer needs to know the
       <i>order</i> of tokens. The original added a fixed "absolute" position signal to each token. LLaMA removes
       those and instead <b>rotates</b> each query and key vector by an angle proportional to its position, inside
       every attention layer. The elegant consequence: when attention compares a query at position $m$ with a key
       at position $n$, the rotation leaves the comparison depending only on the <b>relative</b> distance
       $m - n$, not the absolute positions. This handles relative position naturally and tends to generalize better
       to longer sequences. RoPE is borrowed from the GPTNeo model (Su et al.).</p>

       <p>Put together: a decoder-only Transformer, normalized with RMSNorm at each sub-layer input, using SwiGLU
       feed-forward blocks and RoPE attention, trained on 1.4 trillion public tokens &mdash; small model, lots of
       tokens, cheap to serve.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input vector</b> to a normalization layer: the $d$ numbers (the hidden state) for one token at one layer. RMSNorm and LayerNorm both transform this vector." },
      { sym: "$d$", desc: "the <b>model dimension</b> (hidden size): how many numbers represent each token at a layer. In LLaMA it ranges from $4096$ (the 7B model) to $8192$ (the 65B model), per Table 2." },
      { sym: "$x_i$", desc: "the $i$-th entry of the vector $x$, for $i = 1, \\ldots, d$. The sum and average in the formulas below run over these entries." },
      { sym: "$\\mathrm{RMS}(x)$", desc: "the <b>root mean square</b> of $x$: the square root of the average of the squared entries, $\\sqrt{\\tfrac{1}{d}\\sum_i x_i^2}$. RMSNorm divides by this. It measures the typical magnitude of the entries." },
      { sym: "$g$ (or $g_i$)", desc: "the <b>learned gain</b> (scale): one trainable number per entry that RMSNorm multiplies the normalized value by, letting the network re-stretch each feature. (LayerNorm additionally has a learned shift; RMSNorm in its basic form has only the gain.)" },
      { sym: "$\\epsilon$", desc: "a tiny constant (for example $10^{-6}$) added inside the square root so we never divide by zero when the vector is all zeros. A numerical-safety term." },
      { sym: "$\\mu,\\ \\sigma$", desc: "the <b>mean</b> and <b>standard deviation</b> of the entries of $x$, used by LayerNorm (for comparison). RMSNorm uses neither $\\mu$ (no re-centering) nor a variance that subtracts $\\mu$." },
      { sym: "“RMSNorm”", desc: "a plain term: <b>root-mean-square normalization</b>. Rescales a vector by its root mean square, with a learned per-entry gain. It is LayerNorm <i>without</i> the mean-subtraction (re-centering) step." },
      { sym: "“LayerNorm”", desc: "a plain term: <b>layer normalization</b>. Re-centers a vector to mean zero, rescales to unit variance, then applies a learned scale and shift. The baseline LLaMA replaces with RMSNorm." },
      { sym: "“SwiGLU”", desc: "a plain term: a <b>gated activation</b> for the feed-forward block. It splits the input into two linear projections and uses one (passed through a smooth Swish/SiLU curve) to gate the other by element-wise multiplication, replacing the plain ReLU." },
      { sym: "“RoPE”", desc: "a plain term: <b>Rotary Position Embedding</b>. Encodes a token's position by rotating its query and key vectors by an angle proportional to position, so attention scores depend only on the <i>relative</i> distance between tokens." },
      { sym: "“inference budget”", desc: "a plain term: the compute spent each time the trained model runs to answer a query (as opposed to the one-time training budget). For a deployed model it is paid billions of times, so it can dwarf the training cost." }
    ],
    formula: `$$ \\mathrm{RMSNorm}(x)_i \\;=\\; \\frac{x_i}{\\mathrm{RMS}(x)} \\, g_i, \\qquad \\mathrm{RMS}(x) \\;=\\; \\sqrt{\\frac{1}{d}\\sum_{j=1}^{d} x_j^{2} \\,+\\, \\epsilon}. $$ $$ \\text{Contrast: } \\;\\; \\mathrm{LayerNorm}(x)_i \\;=\\; \\frac{x_i - \\mu}{\\sigma}\\, g_i + b_i, \\qquad \\mu = \\frac{1}{d}\\sum_j x_j, \\;\\; \\sigma = \\sqrt{\\frac{1}{d}\\sum_j (x_j-\\mu)^2}. $$`,
    whatItDoes:
      `<p><b>The RMSNorm equation (top)</b> says: take each entry $x_i$, divide it by the root mean square of the
       whole vector, then multiply by a learned gain $g_i$. Dividing by $\\mathrm{RMS}(x)$ forces the output to have
       a fixed overall magnitude no matter how large the input was &mdash; that is what keeps signals stable as they
       pass through many layers. The key feature is what is <i>missing</i>: there is <b>no subtraction of the mean
       $\\mu$</b>. RMSNorm only rescales; it never re-centers.</p>
       <p><b>The LayerNorm equation (bottom, for contrast)</b> first subtracts the mean $\\mu$ (re-centering to zero)
       and divides by the standard deviation $\\sigma$, then applies a learned scale <i>and</i> a learned shift
       $b_i$. RMSNorm strips the paper's network of the $\\mu$ subtraction and the shift. The practical payoff is
       speed and simplicity &mdash; one fewer pass over the vector and fewer learned parameters &mdash; with
       essentially the same training stability. When a vector already happens to have mean near zero, the two give
       nearly the same result; the gap grows when the vector's mean is far from zero, because only LayerNorm removes
       it. The CODEVIZ shows exactly this on a toy vector.</p>`,
    derivation:
      `<p>This is a <b>read-only</b> paper, and the RMSNorm formula above is a <i>definition</i> (from Zhang and
       Sennrich, 2019), not a theorem to prove. So "why it is true" here means "why dropping the mean-subtraction
       is reasonable, and what it buys."</p>
       <p><b>Why rescaling alone is enough.</b> The job of a normalization layer is to keep the <i>magnitude</i> of
       the hidden vector from drifting as it flows through dozens of layers &mdash; if it grew or shrank
       unchecked, gradients would explode or vanish. Magnitude is exactly what the root mean square measures, and
       dividing by $\\mathrm{RMS}(x)$ pins it down: the result always has root mean square equal to the gain. The
       re-centering step in LayerNorm (subtracting $\\mu$) controls a <i>different</i> thing &mdash; the offset of
       the vector &mdash; which the authors of RMSNorm argued contributes little to the stabilization. Remove it
       and you keep the part that matters.</p>
       <p><b>Why it is cheaper.</b> LayerNorm passes over the vector to compute $\\mu$, then again to compute the
       variance around $\\mu$. RMSNorm needs only one quantity, $\\sum_j x_j^2$, so it does less work and stores one
       fewer learned vector (no shift $b$). At the scale of a large language model, run billions of times, those
       small savings add up &mdash; which fits LLaMA's whole inference-cost theme.</p>
       <p><b>Why pre-normalization.</b> Placing the norm on the <i>input</i> of each sub-layer (rather than the
       output) leaves the residual skip-connection path un-normalized end to end. That gives gradients a clean,
       direct route from the loss back to early layers, which makes deep Transformers train more stably. This
       placement choice is independent of RMSNorm-vs-LayerNorm; LLaMA does both.</p>`,
    example:
      `<p>Run one small vector through both formulas by hand so you can see the missing re-centering. Take the
       toy vector $x = (1, 2, 3, 4)$, so $d = 4$. Set the gain $g_i = 1$ and ignore the tiny $\\epsilon$.</p>
       <ul class="steps">
        <li><b>RMSNorm.</b> Sum of squares: $1 + 4 + 9 + 16 = 30$. Mean of squares: $30/4 = 7.5$. Root mean
        square: $\\mathrm{RMS}(x) = \\sqrt{7.5} \\approx 2.7386$. Divide each entry:
        $x / \\mathrm{RMS}(x) \\approx (0.3651,\\, 0.7303,\\, 1.0954,\\, 1.4606)$. Notice the values stay
        <i>positive and ordered</i> &mdash; RMSNorm never shifted them.</li>
        <li><b>LayerNorm.</b> Mean: $\\mu = (1+2+3+4)/4 = 2.5$. Subtract it: $(-1.5,\\, -0.5,\\, 0.5,\\, 1.5)$.
        Variance: $(2.25 + 0.25 + 0.25 + 2.25)/4 = 1.25$, so $\\sigma = \\sqrt{1.25} \\approx 1.1180$. Divide:
        $\\approx (-1.3416,\\, -0.4472,\\, 0.4472,\\, 1.3416)$. Now the values are <i>centered around zero</i> &mdash;
        two negative, two positive.</li>
        <li><b>The difference.</b> The two outputs are not just scaled copies of each other; LayerNorm's
        mean-subtraction flipped the lower half negative, while RMSNorm kept everything positive. The gap comes
        entirely from the $\\mu = 2.5$ that LayerNorm removed and RMSNorm did not. Had $x$ already had mean zero,
        the two would have produced proportional results.</li>
       </ul>
       <p>The CODEVIZ recomputes these exact numbers in PyTorch and prints both vectors so you can verify them.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no model to build from scratch. Here is LLaMA's recipe stated as
       the steps you would follow to reproduce its <i>design</i> (&sect;2):</p>
       <ol>
        <li><b>Pick a small model size and a large token budget.</b> Choose the model you can afford to <i>serve</i>,
        then train it on far more tokens than the compute-optimal rule suggests (LLaMA: 7B to 65B params, about
        1.0&ndash;1.4 trillion tokens). Optimize the inference budget, not just the training budget.</li>
        <li><b>Assemble a public-only dataset (&sect;2.1).</b> Mix CommonCrawl, C4, GitHub, Wikipedia, public
        books, ArXiv, and Stack Exchange to about 1.4 trillion tokens. No proprietary data.</li>
        <li><b>Start from a decoder-only Transformer</b> (the GPT family).</li>
        <li><b>Swap in RMSNorm pre-normalization.</b> Replace LayerNorm with RMSNorm and normalize the
        <i>input</i> of each sub-layer.</li>
        <li><b>Swap in SwiGLU</b> in the feed-forward block (replacing ReLU), with hidden width $\\tfrac{2}{3}\\cdot 4d$
        to keep the parameter count comparable.</li>
        <li><b>Swap in RoPE.</b> Remove absolute position embeddings; rotate queries and keys by position in each
        attention layer.</li>
        <li><b>Train with AdamW</b> ($\\beta_1 = 0.9$, $\\beta_2 = 0.95$), a cosine learning-rate schedule decaying
        to 10% of the maximum, weight decay $0.1$, gradient clipping $1.0$, and 2000 warmup steps (&sect;2).</li>
       </ol>`,
    results:
      `<p><b>From the abstract (quoted):</b> "We introduce LLaMA, a collection of foundation language models ranging
       from 7B to 65B parameters. We train our models on trillions of tokens, and show that it is possible to train
       state-of-the-art models using publicly available datasets exclusively, without resorting to proprietary and
       inaccessible datasets."</p>
       <p><b>The headline comparison (quoted, abstract):</b> "LLaMA-13B outperforms GPT-3 (175B) on most benchmarks,
       and LLaMA-65B is competitive with the best models, Chinchilla-70B and PaLM-540B."</p>
       <p><b>On training longer (quoted, Introduction):</b> "Hoffmann et al. (2022) recommends training a 10B model
       on 200B tokens, we find that the performance of a 7B model continues to improve even after 1T tokens."</p>
       <p><b>The four models (Table 2):</b> the 6.7B model uses dimension 4096, 32 heads, 32 layers, 1.0 trillion
       tokens; the 13.0B uses dimension 5120, 40 heads, 40 layers, 1.0 trillion tokens; the 32.5B uses dimension
       6656, 52 heads, 60 layers, 1.4 trillion tokens; the 65.2B uses dimension 8192, 64 heads, 80 layers, 1.4
       trillion tokens.</p>
       <p><i>These are the paper's own statements and table values, transcribed from the abstract, the
       Introduction, and &sect;2 / Table 2. The numbers in the CODEVIZ panel below come from our own small
       RMSNorm-vs-LayerNorm illustration &mdash; not from the paper.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: an open-model and training-recipe result, with no model to build from
       scratch here. There is no PyTorch primitive to reconstruct and no novel module to compose end to end. What
       you <i>do</i> instead is <b>understand and use</b> the ideas: explain why a smaller model trained on more
       tokens wins on the inference budget, and explain each of the three architecture tweaks. The optional code
       below is a tiny <b>conceptual illustration</b> of <i>one</i> tweak &mdash; it runs RMSNorm and LayerNorm on
       the toy vector from the worked example, on CPU, and prints both outputs so you can see the effect of the
       missing mean-subtraction. It reproduces our hand calculation; it does <b>not</b> train a language model or
       reproduce any number from the paper.</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking LLaMA is cheaper to <i>train</i>.</b> It is not &mdash; training a small model on 1 trillion
        tokens costs <i>more</i> FLOPs than the compute-optimal choice for that quality. The win is at
        <b>inference</b>: the deployed model is small, so every one of its billions of runs is cheap. <b>Fix:</b>
        always say which budget &mdash; training or inference &mdash; you are comparing.</li>
        <li><b>Confusing RMSNorm with LayerNorm.</b> RMSNorm is LayerNorm <i>minus the mean-subtraction</i> (and
        minus the learned shift). It rescales by root mean square only. If your reimplementation subtracts the mean,
        it is LayerNorm, not RMSNorm. <b>Fix:</b> RMSNorm divides by $\\sqrt{\\tfrac{1}{d}\\sum x_i^2}$ &mdash; no
        $\\mu$ anywhere.</li>
        <li><b>Expecting the RMSNorm formula in the LLaMA paper.</b> It is not written there; the paper cites Zhang
        and Sennrich (2019). The equation in this lesson is that standard definition, shown for understanding, not
        transcribed from LLaMA. <b>Fix:</b> cite the right source when you quote the formula.</li>
        <li><b>Forgetting SwiGLU's width adjustment.</b> SwiGLU uses three weight matrices, so LLaMA shrinks the
        feed-forward hidden width to $\\tfrac{2}{3}\\cdot 4d$ to keep the parameter count comparable. Use the full
        $4d$ and you inflate the model. <b>Fix:</b> apply the $\\tfrac{2}{3}$ factor (&sect;2.2).</li>
        <li><b>Treating RoPE as an added vector.</b> RoPE does not <i>add</i> a position signal; it <i>rotates</i>
        the query and key vectors by a position-dependent angle inside attention, which makes scores depend on
        relative distance. <b>Fix:</b> think "rotate queries/keys," not "add a position embedding."</li>
      </ul>`,
    recall: [
      "State LLaMA's central training choice in one sentence, and say which budget (training or inference) it optimizes.",
      "Write the RMSNorm formula from memory, and say exactly what it drops compared to LayerNorm.",
      "Name the three architecture tweaks (&sect;2.2) and what each replaces in a standard Transformer.",
      "Why does SwiGLU use a feed-forward hidden width of $\\tfrac{2}{3}\\cdot 4d$ instead of $4d$?",
      "What does RoPE do to query and key vectors, and what property of the attention score does that produce?"
    ],
    practice: [
      {
        q: `<b>Why train the smaller model longer?</b> Suppose model A has 65 billion parameters and model B has
            13 billion, and (hypothetically) they reach the same quality &mdash; B only by being trained on many
            more tokens. You will deploy the winner to serve 1 billion requests. (a) Which model is cheaper to
            <i>serve</i>, and roughly by what factor per request? (b) Why might B still be the right choice even
            though it cost more FLOPs to train?`,
        steps: [
          { do: `Inference cost per request scales with model size (number of parameters used per forward pass).`, why: `Each generated token runs the whole network once; a bigger network does proportionally more arithmetic per token.` },
          { do: `Compare sizes: 65B vs 13B is a ratio of $65/13 = 5$. So model B is about $5\\times$ cheaper per request.`, why: `Five times fewer parameters means roughly five times less compute per forward pass.` },
          { do: `Multiply by request volume: across 1 billion requests, that $5\\times$ saving is paid 1 billion times, while the extra training cost is paid once.`, why: `This is exactly LLaMA's argument: the one-time training premium is dwarfed by the repeated inference savings at deployment scale.` }
        ],
        answer: `<p>(a) The 13B model is about $65/13 = 5\\times$ cheaper to serve per request. (b) Because that
                 $5\\times$ saving is paid on every one of the billion requests, while B's higher training FLOPs are a
                 one-time cost. That is LLaMA's thesis (Introduction): "a smaller one trained longer will ultimately
                 be cheaper at inference." Optimize the inference budget, not just the training budget.</p>`
      },
      {
        q: `<b>RMSNorm by hand.</b> Take the vector $x = (3, 4)$ with gain $g = 1$ and $\\epsilon$ ignored.
            (a) Compute $\\mathrm{RMSNorm}(x)$. (b) Compute $\\mathrm{LayerNorm}(x)$ (no learned shift). (c) State in
            one sentence why the two differ here.`,
        steps: [
          { do: `RMSNorm: sum of squares $= 9 + 16 = 25$, mean of squares $= 25/2 = 12.5$, $\\mathrm{RMS} = \\sqrt{12.5} \\approx 3.5355$. Divide: $(3/3.5355,\\, 4/3.5355) \\approx (0.8485,\\, 1.1314)$.`, why: `RMSNorm divides each entry by the root mean square and never subtracts the mean, so both stay positive.` },
          { do: `LayerNorm: mean $\\mu = 3.5$, centered $(-0.5, 0.5)$, variance $= (0.25 + 0.25)/2 = 0.25$, $\\sigma = 0.5$. Divide: $(-1, 1)$.`, why: `LayerNorm subtracts the mean first, which here flips the smaller entry negative.` },
          { do: `Compare: RMSNorm gave $(0.85, 1.13)$, LayerNorm gave $(-1, 1)$. The difference is the mean $\\mu = 3.5$ that LayerNorm removed.`, why: `The only structural difference between the two is LayerNorm's re-centering step; with a nonzero mean it changes the output.` }
        ],
        answer: `<p>(a) $\\mathrm{RMSNorm}(x) \\approx (0.8485,\\, 1.1314)$. (b) $\\mathrm{LayerNorm}(x) = (-1,\\, 1)$.
                 (c) They differ because LayerNorm subtracts the mean $\\mu = 3.5$ (re-centering) while RMSNorm does
                 not; the nonzero mean is exactly what RMSNorm leaves in. With a mean-zero input the two would be
                 proportional.</p>`
      },
      {
        q: `<b>Ablation: put the mean-subtraction back.</b> You modify a LLaMA-style block by switching RMSNorm
            back to LayerNorm, changing nothing else. (a) What computational cost does this add per normalization
            call? (b) The paper's claim is that the two are similar in stability &mdash; so what is the argument for
            preferring RMSNorm, given they perform comparably? Tie it to the paper's theme.`,
        steps: [
          { do: `Identify the extra work LayerNorm does: a pass to compute the mean $\\mu$, then a variance around $\\mu$, plus a learned shift $b$ to store and update.`, why: `RMSNorm needs only $\\sum x_i^2$ (one statistic) and only a gain; LayerNorm needs the mean and a centered variance and a shift.` },
          { do: `Note that this extra work runs at every sub-layer, every token, every forward pass &mdash; including at inference.`, why: `Normalization is called constantly; a small per-call saving is multiplied by an enormous number of calls.` },
          { do: `Connect to LLaMA's theme: the model is meant to be served cheaply, so even small per-call savings at inference are worth taking when quality is unchanged.`, why: `The whole paper optimizes the inference budget; RMSNorm is a small instance of that same principle.` }
        ],
        answer: `<p>(a) Putting LayerNorm back adds the mean-subtraction (an extra pass over the vector to compute
                 $\\mu$ and a centered variance) plus a learned shift $b$ to store &mdash; more compute and one more
                 parameter vector per norm. (b) Since the paper reports the two are comparably stable, RMSNorm wins
                 on <b>cost</b>: it is slightly cheaper at every sub-layer, every token, every forward pass,
                 including inference. That fits LLaMA's central theme &mdash; optimize the inference budget &mdash;
                 so the cheaper option is preferred when quality is unchanged.</p>`
      }
    ]
  });

  window.CODE["paper-llama"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no language model to train or verify here. The snippet below
       is a tiny <b>conceptual illustration</b> of <i>one</i> architecture tweak: it implements RMSNorm in three
       lines and runs it next to PyTorch's own LayerNorm on the toy vector from the worked example,
       $x = (1, 2, 3, 4)$. It prints both outputs so you can see that RMSNorm keeps every value positive (it only
       rescales) while LayerNorm re-centers around zero (it subtracts the mean first). It then prints the missing
       mean, $\\mu = 2.5$, the single quantity that explains the whole difference. This recomputes our hand
       calculation; it is <b>our own illustration</b>, not a number from the paper, and it trains nothing. Pure
       PyTorch on CPU, runs in well under a second.</p>`,
    code: `import torch
import torch.nn as nn

# ---------------------------------------------------------------------------
# RMSNorm: LayerNorm WITHOUT the mean-subtraction. Divide by the root mean
# square only, then apply a per-entry gain. (Standard definition, Zhang &
# Sennrich 2019 -- the LLaMA paper cites it but does not print the formula.)
# ---------------------------------------------------------------------------
def rms_norm(x, gain, eps=1e-6):
    rms = torch.sqrt(x.pow(2).mean(dim=-1, keepdim=True) + eps)
    return x / rms * gain

# The toy vector from the worked example.
x    = torch.tensor([1.0, 2.0, 3.0, 4.0])
gain = torch.ones(4)                      # g_i = 1, so we see the raw effect

# (1) RMSNorm -- rescale only, no re-centering.
y_rms = rms_norm(x, gain)

# (2) PyTorch's own LayerNorm -- re-centers (subtracts the mean) then rescales.
ln = nn.LayerNorm(4, elementwise_affine=False)   # no learned scale/shift
y_ln = ln(x)

torch.set_printoptions(precision=4)
print("x          =", x.tolist())
print("RMSNorm(x) =", [round(v, 4) for v in y_rms.tolist()])
print("LayerNorm  =", [round(v, 4) for v in y_ln.tolist()])
print("mean mu    =", x.mean().item(), "  <- the offset only LayerNorm removes")
# x          = [1.0, 2.0, 3.0, 4.0]
# RMSNorm(x) = [0.3651, 0.7303, 1.0954, 1.4606]   <- all positive: rescale only
# LayerNorm  = [-1.3416, -0.4472, 0.4472, 1.3416] <- centered at 0: mean removed
# mean mu    = 2.5   <- the offset only LayerNorm removes
# The whole gap between the two outputs is that mu = 2.5. RMSNorm leaves it in;
# LayerNorm subtracts it. This is OUR illustration, not a number from the paper.`
  };

  window.CODEVIZ["paper-llama"] = {
    question: "RMSNorm is LayerNorm without the mean-subtraction. On one toy vector, how do their outputs differ -- and is the whole difference just the mean that RMSNorm leaves in?",
    charts: [
      {
        type: "bar",
        title: "RMSNorm vs LayerNorm on the toy vector x = (1,2,3,4) (OUR illustration, not the paper's numbers)",
        xlabel: "vector entry index",
        ylabel: "output value",
        series: [
          { name: "RMSNorm (rescale only)", color: "#7ee787", points: [[1, 0.3651], [2, 0.7303], [3, 1.0954], [4, 1.4606]] },
          { name: "LayerNorm (mean removed first)", color: "#ff7b72", points: [[1, -1.3416], [2, -0.4472], [3, 0.4472], [4, 1.3416]] }
        ]
      }
    ],
    caption: "OUR illustration of ONE LLaMA tweak (RMSNorm), NOT a number from the paper. We feed the toy vector x=(1,2,3,4) (gain=1, no learned shift) through RMSNorm and through PyTorch's LayerNorm. RMSNorm divides by the root mean square only -- RMS=sqrt(30/4)=2.7386 -- giving (0.3651,0.7303,1.0954,1.4606), all positive. LayerNorm first subtracts the mean mu=2.5, giving the centered (-1.3416,-0.4472,0.4472,1.3416). The entire difference is that single mean mu=2.5: RMSNorm leaves it in, LayerNorm removes it. That missing re-centering -- one fewer pass over the vector and one fewer learned vector -- is the whole change LLaMA makes (Section 2.2). The LLaMA paper does not print this formula; it cites Zhang & Sennrich (2019).",
    code: `import torch
import torch.nn as nn

def rms_norm(x, gain, eps=1e-6):
    rms = torch.sqrt(x.pow(2).mean(dim=-1, keepdim=True) + eps)
    return x / rms * gain

x    = torch.tensor([1.0, 2.0, 3.0, 4.0])
gain = torch.ones(4)

y_rms = rms_norm(x, gain)
y_ln  = nn.LayerNorm(4, elementwise_affine=False)(x)

print("RMS(x)     =", round(torch.sqrt(x.pow(2).mean()).item(), 4))
print("RMSNorm(x) =", [round(v, 4) for v in y_rms.tolist()])
print("LayerNorm  =", [round(v, 4) for v in y_ln.tolist()])
print("mean mu    =", x.mean().item())
# RMS(x)     = 2.7386
# RMSNorm(x) = [0.3651, 0.7303, 1.0954, 1.4606]
# LayerNorm  = [-1.3416, -0.4472, 0.4472, 1.3416]
# mean mu    = 2.5
# The whole gap is the mean mu=2.5 that only LayerNorm removes. OUR illustration,
# not the paper's numbers.`
  };
})();
