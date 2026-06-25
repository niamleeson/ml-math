/* Paper lesson — "WaveNet: A Generative Model for Raw Audio"
   van den Oord, Dieleman, Zen, Simonyan, Vinyals, Graves, Kalchbrenner, Senior &
   Kavukcuoglu, 2016 (Google DeepMind).  Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-wavenet".
   GROUNDED from arXiv:1609.03499 (abstract + ar5iv HTML mirror): Eq. 1 the
   autoregressive factorization p(x)=prod_t p(x_t | x_1..x_{t-1}); Sec 2.1 dilated
   causal convolutions and exponential receptive-field growth (dilations
   1,2,4,...,512, each block receptive field 1024); Sec 2.2 the mu-law companding
   f(x)=sign(x) ln(1+mu|x|)/ln(1+mu) with mu=255 and the 256-way softmax; Sec 2.3
   the gated activation unit z = tanh(W_{f,k} * x) (.) sigma(W_{g,k} * x); Sec 2.4
   residual and skip connections.
   Track B (architecture): build a dilated CAUSAL Conv1d (left-pad so output t sees
   only inputs <= t) by hand on top of nn.Conv1d, stack with exponentially growing
   dilations, MEASURE the receptive field empirically (gradient probe), generate a
   tiny waveform autoregressively sample-by-sample, and ABLATE dilation (dilated vs
   plain conv -> receptive field collapses from 16 to 5). Cross-links paper-pixelcnn
   (same group, same autoregressive masking idea, pixels instead of audio). */
(function () {
  window.LESSONS.push({
    id: "paper-wavenet",
    title: "WaveNet — A Generative Model for Raw Audio (2016)",
    tagline: "Generate a raw audio waveform one sample at a time, where each sample is a 256-way classifier that may only look at the samples already produced — and reach far back in time cheaply using dilated causal convolutions whose receptive field grows exponentially with depth.",
    module: "Papers · Speech & Audio",
    track: "architecture",
    paper: {
      authors: "Aaron van den Oord, Sander Dieleman, Heiga Zen, Karen Simonyan, Oriol Vinyals, Alex Graves, Nal Kalchbrenner, Andrew Senior, Koray Kavukcuoglu",
      org: "Google DeepMind, London, UK (per the paper's author affiliations)",
      year: 2016,
      venue: "arXiv:1609.03499 (Sep 2016)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1609.03499",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "pt-cnn", "dl-cross-entropy", "ml-softmax", "paper-pixelcnn", "dl-backprop", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>Raw audio is brutal to model. A single second of speech is <b>tens of thousands of numbers</b> &mdash;
       this paper works at 16,000 samples per second (16&nbsp;kHz). To sound natural, a sample must depend on the
       waveform from <i>many milliseconds ago</i> &mdash; a single spoken sound stretches across hundreds or
       thousands of samples. So a model needs a <b>very long memory</b> (a large "receptive field" &mdash; the
       span of past input that can influence one output) <i>and</i> it must produce these samples one after
       another at high rate.</p>
       <p>Before WaveNet, the best text-to-speech systems were <b>concatenative</b> (stitch together recorded
       speech fragments &mdash; rigid, hard to change voice) or <b>parametric</b> (a vocoder generates audio from
       hand-engineered features &mdash; flexible but noticeably less natural). Neither modeled the raw waveform
       directly. The challenge WaveNet solves: build a single neural network that models the probability of the
       <b>raw waveform itself</b>, with a memory long enough to capture speech structure, that is still
       <b>trainable</b> on data with tens of thousands of samples per second.</p>`,
    contribution:
      `<ul>
        <li><b>A fully probabilistic, autoregressive raw-audio model.</b> WaveNet writes the probability of an
        entire waveform as a product of per-sample conditionals (Eq.&nbsp;1) &mdash; each sample's distribution is
        conditioned on <i>all previous samples</i> &mdash; and predicts each one with a <b>256-way softmax</b> over
        $\\mu$-law-quantized amplitudes (&sect;2.2). The abstract states the model is "fully probabilistic and
        autoregressive, with the predictive distribution for each audio sample conditioned on all previous ones."</li>
        <li><b>Dilated causal convolutions</b> (&sect;2.1). "Causal" = each output sample sees only past samples
        (never the future). "Dilated" = the filter skips inputs with gaps, so by <b>doubling the gap each layer</b>
        (dilations $1,2,4,\\dots,512$) the receptive field grows <b>exponentially</b> with depth &mdash; a long
        memory for a shallow, parallel-trainable stack, with no recurrence.</li>
        <li><b>A gated activation unit</b> (Eq.&nbsp;2) plus <b>residual and skip connections</b> (&sect;2.4) that
        make the deep stack trainable and sharpen quality. The paper reports WaveNet substantially closing the gap
        to natural human speech in mean-opinion-score listening tests.</li>
      </ul>`,
    whyItMattered:
      `<p>WaveNet was the first model to generate <b>natural-sounding raw audio</b> end-to-end, and it reset the
       bar for text-to-speech: in the paper's listening tests it narrowed the naturalness gap to real human speech
       by a large margin versus the previous concatenative and parametric baselines. It powered production speech
       systems and seeded a whole line of neural vocoders (Parallel WaveNet, WaveRNN, WaveGlow, and later
       diffusion vocoders). The core recipe &mdash; factorize a signal into a product of per-step conditionals,
       enforce causality, and reach far back cheaply with dilation &mdash; carried directly into other domains
       (PixelCNN for images, by the same group; the causal masks of every autoregressive Transformer language
       model). Dilated convolutions themselves became a standard tool for long-context sequence modeling.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2, Eq.&nbsp;1</b> &mdash; the autoregressive factorization
        $p(\\mathbf{x})=\\prod_t p(x_t\\mid x_1,\\dots,x_{t-1})$. This is the whole modeling premise.</li>
        <li><b>&sect;2.1 + Fig.&nbsp;2/3 (dilated causal convolutions)</b> &mdash; the heart of the paper. Study
        the picture of stacked dilated layers and convince yourself the receptive field <b>doubles</b> each layer.
        The paper states "each $1,2,4,\\dots,512$ block has receptive field of size 1024."</li>
        <li><b>&sect;2.2 (softmax distributions, $\\mu$-law)</b> &mdash; why a 256-way <i>categorical</i> output
        beats a continuous one, and the companding transform that makes 256 levels enough.</li>
        <li><b>&sect;2.3, Eq.&nbsp;2 (gated activation unit)</b> &mdash; the $\\tanh\\odot\\sigma$ nonlinearity.</li>
        <li><b>&sect;2.4 (residual + skip connections)</b> &mdash; the wiring that makes the deep stack trainable.</li>
       </ul>
       <p><b>Skim:</b> the conditional-WaveNet extensions (&sect;2.5, conditioning on speaker/linguistic features),
       and the multi-domain experiments (TTS, music, speech recognition, &sect;3-4) &mdash; striking, but you do
       not need them to build a tiny WaveNet. The mean-opinion-score (MOS) tables are quoted in <b>results</b>
       below; treat them as the paper's numbers, not yours.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build two convolution stacks, each <b>4 layers deep with kernel size 2</b>, differing in
       <b>one</b> thing: stack (A) uses <b>dilations $1,2,4,8$</b> (doubling each layer); stack (B) uses
       <b>dilation $1$ everywhere</b> (an ordinary causal conv stack). Both have the same number of layers and
       parameters.</p>
       <p>How far back in time can the <b>last output sample</b> "see" the input in each stack &mdash; i.e. what is
       each stack's <b>receptive field</b> (number of past samples that can influence one output)? Write your two
       guesses before running. (Hint: with kernel size $k$ and dilation $d$, one layer reaches back
       $(k-1)\\,d$ samples; receptive fields add across layers.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the <b>dilated causal Conv1d</b> you will build. Start from a normal
       <code>nn.Conv1d</code> and make it causal by <b>left-padding</b> the input so the output length matches and
       no output position ever reads a future input:</p>
       <ul>
        <li>TODO: for kernel size $k$ and dilation $d$, the layer reaches back $(k-1)\\,d$ samples. Left-pad the
        time axis with exactly <code>(k-1)*d</code> zeros and use <code>padding=0</code> in the conv, so output
        position $t$ is computed from inputs $t-(k-1)d,\\dots,t$ &mdash; all $\\le t$.</li>
        <li>TODO: do <b>not</b> pad on the right. Right-padding would let an output see future samples and break
        causality.</li>
        <li>TODO: stack several of these with dilations $1,2,4,8,\\dots$ (double each layer). Verify the stack's
        receptive field is $1+\\sum_{\\ell}(k-1)d_\\ell$ &mdash; it should grow <b>exponentially</b> in depth.</li>
        <li>TODO: measure it empirically &mdash; set one input position's gradient flag, backprop from the last
        output, and count how many input positions have nonzero gradient. That count <i>is</i> the receptive field.</li>
       </ul>
       <p>Then predict: dilated ($1,2,4,8$) vs plain (all-$1$) &mdash; which reaches back farther, and by how much?</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>The premise (&sect;2, Eq.&nbsp;1).</b> A waveform is a sequence of samples $x_1,x_2,\\dots,x_T$ (here,
       16,000 of them per second). The <b>chain rule of probability</b> &mdash; an exact identity that says any
       joint probability factors into a product of conditionals &mdash; lets us write the probability of the
       <i>entire</i> waveform as a product in which each sample is conditioned on all the samples before it
       (Eq.&nbsp;1, below). Nothing is approximated: this is just a rewrite. The modeling job is to learn each
       conditional $p(x_t\\mid x_1,\\dots,x_{t-1})$ &mdash; "given everything heard so far, what is the
       distribution of the next sample?" This is the same idea as PixelCNN (<b>paper-pixelcnn</b>, by the same
       group), but over <b>time</b> (1-D audio) instead of raster-scanned pixels.</p>
       <p><b>Each sample is a 256-way classifier (&sect;2.2).</b> Audio amplitude is continuous, but WaveNet
       discretizes it to <b>256 levels</b> and predicts a <b>256-way softmax</b> (a softmax turns a vector of
       scores into a probability distribution that sums to 1; see <b>ml-softmax</b>). The paper argues a
       categorical distribution is "more flexible and can more easily model arbitrary distributions because it
       makes no assumptions about their shape." Raw 16-bit audio would need 65,536 levels, so first it applies
       <b>$\\mu$-law companding</b> (&sect;2.2): a logarithmic squashing (Eq. below) that allocates more levels to
       quiet sounds (where the ear is sensitive) and fewer to loud ones, so 256 levels reconstruct the waveform
       well. "Companding" = COMpressing then exPANDING the dynamic range. With $\\mu=255$ this maps the real-valued
       amplitude in $[-1,1]$ onto $[-1,1]$ nonlinearly; the result is binned into 256 buckets.</p>
       <p><b>Causal convolutions (&sect;2.1) make the conditioning honest.</b> A normal convolution at time $t$
       mixes in a window <i>centered</i> on $t$ &mdash; including <b>future</b> samples $t+1,t+2,\\dots$ At
       generation time those do not exist yet, so a model that peeked at them would be a fraud. WaveNet uses
       <b>causal</b> convolutions: the filter at $t$ reads only $t$ and earlier. In practice this is done by
       <b>left-padding</b> the input (shifting the filter so it never overhangs the future). After this, the output
       at $t$ depends only on inputs $\\le t$, exactly as Eq.&nbsp;1 requires. (This is the 1-D, time-only analogue
       of PixelCNN's masked convolution.)</p>
       <p><b>Dilation buys a long memory cheaply (&sect;2.1).</b> A plain causal stack has a problem: to reach back
       $R$ samples you need about $R$ layers (each kernel-size-2 layer extends memory by just 1). That is far too
       deep for thousands of samples. A <b>dilated</b> convolution applies its filter over a region larger than its
       length by <b>skipping input values with a fixed gap</b> $d$ (the dilation): a kernel-size-2, dilation-$d$
       filter at $t$ reads $x_t$ and $x_{t-d}$. Stack layers with <b>doubling dilation</b> $1,2,4,8,\\dots,512$ and
       the receptive field grows <b>exponentially</b> with depth: the paper notes that "exponentially increasing
       the dilation factor results in exponential receptive field growth with depth," and that "each
       $1,2,4,\\dots,512$ block has receptive field of size 1024." So 10 layers reach back 1024 samples instead of
       needing ~1024 layers &mdash; with no recurrence and full parallel training.</p>
       <p><b>The gated activation unit (&sect;2.3, Eq.&nbsp;2)</b> replaces a plain ReLU. Each layer computes two
       dilated causal convolutions of its input: one goes through $\\tanh$ (the "content" signal, in $(-1,1)$) and
       the other through $\\sigma$ (a sigmoid "gate" in $(0,1)$), and they are multiplied element-wise. The gate is
       a learned, input-dependent volume knob on each content value. The paper found this gated unit "works
       significantly better ... than the rectified linear activation function" for modeling audio.</p>
       <p><b>Residual and skip connections (&sect;2.4)</b> wire the stack together: each layer adds its (gated)
       output back to its input (a <b>residual</b> connection &mdash; the layer learns a correction, easing
       gradient flow in deep nets), and also sends a <b>skip</b> connection straight to the output. The summed skip
       outputs pass through a couple of $1\\times1$ convolutions and a softmax to the 256-way per-sample
       distribution. The paper uses "both residual and parameterised skip connections ... throughout the network,
       to speed up convergence and enable training of much deeper models."</p>`,
    symbols: [
      { sym: "$\\mathbf{x}$", desc: "the <b>waveform</b>, a sequence of audio samples $x_1,\\dots,x_T$ in time order (here 16,000 per second)." },
      { sym: "$x_t$", desc: "the <b>$t$-th audio sample</b> &mdash; one amplitude value the model predicts (after $\\mu$-law quantization, one of 256 levels)." },
      { sym: "$x_1,\\dots,x_{t-1}$", desc: "<b>all samples before time $t$</b> &mdash; the past the next sample is conditioned on." },
      { sym: "$T$", desc: "the <b>total number of samples</b> in the waveform (so the product in Eq.&nbsp;1 has $T$ factors)." },
      { sym: "$p(\\mathbf{x})$", desc: "the <b>probability (likelihood) of the whole waveform</b> &mdash; the quantity the model assigns and tries to make large for real audio." },
      { sym: "$p(x_t\\mid x_1,\\dots,x_{t-1})$", desc: "the <b>conditional distribution</b> of sample $t$ given all earlier samples &mdash; what the network outputs (a 256-way softmax)." },
      { sym: "$k$", desc: "the <b>kernel size</b> (filter length) of a 1-D convolution &mdash; how many tap positions the filter has (WaveNet's dilated convs use $k=2$)." },
      { sym: "$d$", desc: "the <b>dilation</b> &mdash; the gap between the input positions a filter reads. A $k{=}2,\\,d$ filter at $t$ reads $x_t$ and $x_{t-d}$. WaveNet doubles $d$ each layer: $1,2,4,\\dots,512$." },
      { sym: "$R$", desc: "the <b>receptive field</b> &mdash; the number of past input samples that can influence one output. For a causal stack, $R=1+\\sum_\\ell (k-1)\\,d_\\ell$." },
      { sym: "$W_{f,k}$", desc: "the convolution weights of the <b>'filter' (content) branch</b> at layer $k$ &mdash; its output goes through $\\tanh$. ($*$ below denotes convolution.)" },
      { sym: "$W_{g,k}$", desc: "the convolution weights of the <b>'gate' branch</b> at layer $k$ &mdash; its output goes through $\\sigma$ (sigmoid) and multiplies the content." },
      { sym: "$\\sigma$", desc: "the <b>sigmoid</b> function $\\sigma(z)=1/(1+e^{-z})$, squashing into $(0,1)$ &mdash; used as the <b>gate</b> (how much content passes)." },
      { sym: "$\\tanh$", desc: "the <b>hyperbolic tangent</b>, squashing into $(-1,1)$ &mdash; the <b>content</b> branch of the gated unit." },
      { sym: "$\\odot$", desc: "<b>element-wise (Hadamard) multiplication</b> &mdash; multiply two equal-shaped tensors position-by-position." },
      { sym: "$*$", desc: "<b>convolution</b> &mdash; here a <i>dilated causal</i> convolution (left-padded so it never reads the future)." },
      { sym: "$\\mu$", desc: "the <b>$\\mu$-law parameter</b>, set to $\\mu=255$ &mdash; controls the logarithmic companding that lets 256 levels represent the amplitude well." },
      { sym: "causal", desc: "a convolution whose output at $t$ depends only on inputs at times $\\le t$ &mdash; never the future. Implemented by left-padding the time axis." },
      { sym: "dilated", desc: "a convolution that skips inputs with a fixed gap $d$, so a short filter spans a wide region; doubling $d$ per layer grows the receptive field exponentially." },
      { sym: "$\\mu$-law companding", desc: "a logarithmic transform (Eq. below) that COMpresses then exPANDs amplitude, giving fine resolution to quiet sounds; lets 256 quantization levels suffice." }
    ],
    formula: `$$ p(\\mathbf{x}) \\;=\\; \\prod_{t=1}^{T} p\\big(x_t \\,\\big|\\, x_1, x_2, \\dots, x_{t-1}\\big) \\qquad\\text{(Eq.\\ 1: autoregressive factorization)} $$
$$ \\mathbf{z} \\;=\\; \\tanh\\!\\big(W_{f,k} * \\mathbf{x}\\big) \\;\\odot\\; \\sigma\\!\\big(W_{g,k} * \\mathbf{x}\\big) \\qquad\\text{(Eq.\\ 2: gated activation unit, \\S2.3)} $$
$$ f(x_t) \\;=\\; \\operatorname{sign}(x_t)\\,\\frac{\\ln\\!\\big(1+\\mu\\,|x_t|\\big)}{\\ln\\!\\big(1+\\mu\\big)},\\qquad \\mu=255 \\qquad\\text{(\\(\\mu\\)-law companding, \\S2.2)} $$`,
    whatItDoes:
      `<p><b>Eq.&nbsp;1 (the factorization)</b> says: the probability of the whole waveform equals the product, over
       every time step, of that sample's probability <i>given all the samples before it</i>. It is an exact rewrite
       of the joint distribution via the chain rule &mdash; no approximation. Its power is practical: instead of
       modeling an astronomically high-dimensional joint over all samples at once, you only ever model one small
       thing &mdash; "the next sample given the past" &mdash; and the dilated causal stack computes <i>all</i> these
       conditionals in one parallel forward pass during training.</p>
       <p><b>Eq.&nbsp;2 (the gated unit)</b> says: take two dilated causal convolutions of the same input, push one
       through $\\tanh$ (the "content," in $(-1,1)$) and the other through $\\sigma$ (the "gate," in $(0,1)$), and
       multiply them element-wise. The gate scales each content value: near $0$ it suppresses that feature, near
       $1$ it lets it through. This learned multiplicative interaction was more expressive for audio than a single
       ReLU (&sect;2.3).</p>
       <p><b>The $\\mu$-law equation</b> says: squash the amplitude logarithmically before binning into 256 levels.
       Because $\\ln$ grows fast near $0$, small (quiet) amplitudes get spread across many output levels and large
       (loud) ones get compressed &mdash; matching how the ear hears, so 256 levels sound nearly as good as the raw
       16-bit signal (&sect;2.2).</p>`,
    derivation:
      `<p><b>Why Eq.&nbsp;1 is exactly true (chain rule of probability).</b> For <i>any</i> joint distribution over
       variables $x_1,\\dots,x_T$, the definition of conditional probability, $p(a,b)=p(a)\\,p(b\\mid a)$, applied
       repeatedly gives</p>
       <p>$$ p(x_1,\\dots,x_T) = p(x_1)\\,p(x_2\\mid x_1)\\,p(x_3\\mid x_1,x_2)\\cdots p(x_T\\mid x_1,\\dots,x_{T-1})
        = \\prod_{t=1}^{T} p(x_t\\mid x_1,\\dots,x_{t-1}). $$</p>
       <p>This holds for <b>any</b> ordering; for a waveform the natural order is <i>time</i>, so "earlier" means
       "in the past," which a causal convolution can respect. The factorization itself is free &mdash; the model
       never has to learn it. The only thing learned is the family of conditionals
       $p(x_t\\mid x_1,\\dots,x_{t-1})$, and the causal convolution guarantees each conditional depends on the past
       and nothing later.</p>
       <p><b>Why the receptive field grows exponentially (the dilation arithmetic).</b> A single causal conv with
       kernel size $k$ and dilation $d$ reaches back $(k-1)\\,d$ samples beyond the current one (its taps sit at
       offsets $0,d,2d,\\dots,(k-1)d$). Receptive fields <b>add</b> when you stack layers, so for $L$ stacked layers
       with dilations $d_1,\\dots,d_L$,</p>
       <p>$$ R \\;=\\; 1 + \\sum_{\\ell=1}^{L} (k-1)\\,d_\\ell. $$</p>
       <p>With $k=2$ and doubling dilations $d_\\ell = 2^{\\ell-1}$ (that is $1,2,4,\\dots,2^{L-1}$), the sum is a
       geometric series: $\\sum_{\\ell=1}^{L} 2^{\\ell-1} = 2^{L}-1$, so $R = 1 + (2^{L}-1) = 2^{L}$. The receptive
       field <b>doubles</b> with each added layer &mdash; exponential in depth $L$. Ten layers ($d$ up to 512)
       give $R = 2^{10} = 1024$, matching the paper's "block ... receptive field of size 1024" (&sect;2.1). With
       <b>plain</b> (all-dilation-1) convolutions the same formula gives $R = 1 + (k-1)L = 1+L$ &mdash; only
       <i>linear</i> in depth. That gap is the whole point of dilation.</p>`,
    example:
      `<p><b>Worked numeric example, part 1 &mdash; receptive field for dilations $1,2,4,8$.</b> Take a 4-layer
       causal stack, kernel size $k=2$ (so $k-1=1$). Add up how far each layer reaches:</p>
       <ul class="steps">
        <li>Layer 1, $d=1$: reaches back $(k-1)\\,d = 1\\cdot1 = 1$.</li>
        <li>Layer 2, $d=2$: reaches back $1\\cdot2 = 2$.</li>
        <li>Layer 3, $d=4$: reaches back $1\\cdot4 = 4$.</li>
        <li>Layer 4, $d=8$: reaches back $1\\cdot8 = 8$.</li>
        <li>Receptive field $R = 1 + (1+2+4+8) = 1 + 15 = \\mathbf{16}$ samples.</li>
       </ul>
       <p>So the last output can see <b>16</b> input samples into the past with only 4 layers. Notice
       $16 = 2^{4}$ &mdash; the receptive field is $2^{L}$ for $L$ layers, exactly the geometric-series result. Add
       a 5th layer ($d=16$) and it would jump to $32$; the dilations $1,2,4,\\dots,512$ (10 layers) give
       $2^{10}=1024$, the paper's number.</p>
       <p><b>Worked numeric example, part 2 &mdash; one masked-causal step.</b> Take a single causal conv layer,
       $k=2$, $d=1$, with filter weights $w=[w_0,w_1]=[0.5,\\,2.0]$ (tap $w_1$ is the <i>current</i> sample, tap
       $w_0$ is the one before). For input $x=[\\,3,\\,1,\\,4,\\,2\\,]$, left-pad with one zero (because the layer
       reaches back $(k-1)d=1$): $x_{\\text{pad}}=[\\,0,\\,3,\\,1,\\,4,\\,2\\,]$. The output at each time $t$ is
       $y_t = w_0\\,x_{t-1} + w_1\\,x_t$:</p>
       <ul class="steps">
        <li>$y_1 = 0.5\\cdot\\underbrace{0}_{\\text{pad}} + 2.0\\cdot 3 = 6.0$ &mdash; sees only $x_1$ (no real past).</li>
        <li>$y_2 = 0.5\\cdot 3 + 2.0\\cdot 1 = 1.5 + 2.0 = 3.5$ &mdash; sees $x_1,x_2$.</li>
        <li>$y_3 = 0.5\\cdot 1 + 2.0\\cdot 4 = 0.5 + 8.0 = 8.5$ &mdash; sees $x_2,x_3$.</li>
        <li>$y_4 = 0.5\\cdot 4 + 2.0\\cdot 2 = 2.0 + 4.0 = 6.0$ &mdash; sees $x_3,x_4$.</li>
       </ul>
       <p>Crucially, <b>no</b> $y_t$ uses any $x_{t+1}$ &mdash; the left-pad makes the convolution causal. The
       notebook recomputes $y=[6.0,\\,3.5,\\,8.5,\\,6.0]$ and asserts it, and separately measures the 4-layer
       receptive field $=16$ by a gradient probe.</p>`,
    recipe:
      `<ol>
        <li><b>CausalConv1d.</b> Wrap <code>nn.Conv1d</code> with <code>padding=0</code>. In <code>forward</code>,
        left-pad the time axis by <code>(k-1)*dilation</code> zeros (and nothing on the right), then convolve. Now
        output $t$ uses only inputs $\\le t$, and output length equals input length.</li>
        <li><b>Dilated stack.</b> Stack $L$ <code>CausalConv1d</code> layers with <b>doubling dilations</b>
        $1,2,4,\\dots,2^{L-1}$. The receptive field is $2^{L}$ &mdash; exponential in depth.</li>
        <li><b>Gated residual block</b> (Eq.&nbsp;2, &sect;2.3-2.4). In each block run two dilated causal convs of
        the input; combine as $\\tanh(W_f * x)\\odot\\sigma(W_g * x)$; project with a $1\\times1$ conv; add the input
        back (<b>residual</b>) and also tap a <b>skip</b> connection.</li>
        <li><b>Output head (&sect;2.2).</b> Sum the skip connections, apply ReLU + a $1\\times1$ conv, and finish
        with a $1\\times1$ conv to <b>256 logits</b> per time step &mdash; a 256-way softmax over $\\mu$-law levels.
        (Our toy uses a small number of levels for speed; same idea, smaller alphabet.)</li>
        <li><b>Train</b> with per-sample cross-entropy: feed the whole (quantized) waveform in <i>once</i>, get a
        256-way logit vector for every time step in parallel, and average the cross-entropy. Causality makes this
        a valid likelihood &mdash; each step's logits used only past samples.</li>
        <li><b>Generate</b> autoregressively: start from a seed, and for $t=1,2,\\dots$ forward the current
        waveform, read the softmax at the last position, sample $x_t$, append it, repeat. Slow but exact &mdash; it
        inverts the training-time factorization.</li>
        <li><b>Ablate dilation:</b> rebuild the same stack with all dilations $=1$ (plain causal). The receptive
        field collapses from $2^{L}$ to $1+L$ &mdash; isolating dilation as the source of the long memory.</li>
      </ol>`,
    results:
      `<p>The paper's headline metric is the <b>Mean Opinion Score (MOS)</b> &mdash; human listeners rate
       naturalness from 1 (bad) to 5 (excellent). Quoted from the paper:</p>
       <ul>
        <li>On <b>US English TTS</b>, WaveNet substantially outperformed the best prior baselines: the paper reports
        WaveNet at roughly <b>4.21</b> MOS versus the best parametric (~3.67) and concatenative (~3.86) systems,
        with natural human speech around <b>4.55</b> &mdash; WaveNet closing much of the remaining gap. (See the
        paper's MOS tables, &sect;3.) </li>
        <li>The abstract's qualitative claims (quoted): WaveNet "generates speech which sounds more natural than the
        best parametric and concatenative systems," and "a single WaveNet can capture the characteristics of many
        different speakers with equal fidelity," and applied to music it "generate[s] novel and often highly
        realistic musical fragments."</li>
       </ul>
       <p><i>All numbers above are the paper's reported results. The receptive-field counts, losses, and generated
       waveform in the CODEVIZ panel below are from our own tiny run on toy data &mdash; not the paper's reported
       numbers.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: 1-D convolution itself ships in PyTorch, so you
       <b>import</b> it and build only the novel <i>composition</i> &mdash; causality via left-padding, the
       exponentially-dilated stack, the gated residual block, and the autoregressive sampling loop. <b>Import:</b>
       <code>nn.Conv1d</code> (we wrap it), <code>nn.functional.pad</code>, <code>nn.CrossEntropyLoss</code>,
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> the <code>CausalConv1d</code> (left-pad), the dilated
       stack, the gated activation unit (Eq.&nbsp;2), the <b>receptive-field gradient probe</b>, the
       <b>sample-by-sample generation loop</b>, and the <b>dilation ablation</b>. The chain-rule factorization
       (Eq.&nbsp;1) is recapped from the math above (full derivation included, since <code>conceptLink</code> is
       null), and softmax/cross-entropy are recapped from <b>ml-softmax</b> / <b>dl-cross-entropy</b>. We use a
       small quantization alphabet and a short toy waveform so it runs fast on CPU with no audio download &mdash;
       the same idea at toy scale.</p>`,
    pitfalls:
      `<ul>
        <li><b>Padding on the wrong side.</b> Causality needs <b>left</b> padding only; the standard symmetric
        <code>padding=(k-1)*d//2</code> in <code>nn.Conv1d</code> centers the filter and leaks future samples.
        Pad <code>(k-1)*d</code> zeros on the left, <code>0</code> on the right, with <code>padding=0</code> in the
        conv. (PixelCNN's masked conv is the 2-D analogue of this same fix.)</li>
        <li><b>Off-by-one in the reach.</b> One $k,d$ layer reaches back $(k-1)\\,d$, not $k\\,d$. The current sample
        is one of the $k$ taps, so only $k-1$ of them look into the past. Get this wrong and your receptive-field
        math (and your padding) is off.</li>
        <li><b>Forgetting dilation grows the field, depth alone does not (much).</b> A plain causal stack needs
        ~$R$ layers for receptive field $R$; the <i>exponential</i> growth comes only from <b>doubling the
        dilation</b>. Don't attribute WaveNet's long memory to depth alone.</li>
        <li><b>Generating in the wrong order or in parallel.</b> Training is one parallel pass; <i>generation</i>
        is strictly sequential &mdash; sample $x_t$, append it, then compute $x_{t+1}$. Sampling out of order, or
        all at once, breaks the conditioning (a sample would depend on values not yet drawn). This sequential cost
        is the known weakness later addressed by Parallel WaveNet.</li>
        <li><b>Treating audio as regression.</b> WaveNet uses a 256-way <b>softmax</b> (a categorical
        distribution), not a single regressed real value; the paper found the categorical output more flexible
        (&sect;2.2). Don't replace it with a mean-squared-error head.</li>
        <li><b>Skipping $\\mu$-law.</b> Without companding, 256 uniform levels sound noisy; the logarithmic
        $\\mu$-law transform (Eq., $\\mu=255$) is what makes 256 levels enough.</li>
      </ul>`,
    recall: [
      "Write the autoregressive factorization $p(\\mathbf{x})=\\prod_t p(x_t\\mid x_1,\\dots,x_{t-1})$ (Eq.\\ 1) and say which exact identity makes it true.",
      "Give the receptive-field formula $R=1+\\sum_\\ell (k-1)d_\\ell$, and compute $R$ for $k=2$, dilations $1,2,4,8$.",
      "Why does doubling the dilation each layer make the receptive field grow exponentially rather than linearly?",
      "How is a convolution made 'causal', and which side do you pad?",
      "Write the gated activation unit (Eq.\\ 2) and name the role of the tanh branch vs the sigmoid branch.",
      "Why does WaveNet output a 256-way softmax over $\\mu$-law levels instead of regressing one real amplitude?"
    ],
    practice: [
      {
        q: `<b>The ablation: dilated vs plain causal convolution.</b> You have a 4-layer causal conv stack with
            kernel size $k=2$. Version A uses dilations $1,2,4,8$; version B uses dilation $1$ in every layer
            (plain causal). For each, what is the receptive field (how many past samples can influence the last
            output)? Which property of WaveNet does this isolate, and what would the gap be at 10 layers?`,
        steps: [
          { do: `Apply $R = 1 + \\sum_\\ell (k-1)\\,d_\\ell$ with $k-1=1$ to <b>version A</b>:
                 $R_A = 1 + (1+2+4+8) = 16$.`,
            why: `Dilations add their reaches; doubling them makes the partial sums a geometric series, so
                  $R_A = 2^{4} = 16$.` },
          { do: `Apply the same formula to <b>version B</b> (all $d=1$): $R_B = 1 + (1+1+1+1) = 5$.`,
            why: `With no dilation each layer extends the reach by only $k-1=1$, so $R$ grows <i>linearly</i> with
                  depth: $R_B = 1 + L$.` },
          { do: `Compare: dilated reaches <b>16</b> past samples, plain reaches only <b>5</b>, with identical depth
                 and parameter count.`,
            why: `The <i>only</i> change is the dilation schedule, so the entire difference in memory is
                  attributable to dilation.` },
          { do: `Extrapolate to 10 layers: dilated $= 2^{10} = 1024$ (the paper's block size), plain $= 1+10 = 11$.`,
            why: `Exponential vs linear: the gap explodes with depth, which is why WaveNet can reach thousands of
                  samples back with a shallow stack.` }
        ],
        answer: `<p>Version A (dilations $1,2,4,8$) has receptive field $1+(1+2+4+8)=\\mathbf{16}=2^{4}$; version B
                 (all $d=1$) has receptive field $1+(1+1+1+1)=\\mathbf{5}=1+L$. Same depth, same parameters &mdash;
                 the $16$-vs-$5$ gap is due <b>entirely to dilation</b>. At 10 layers the gap is $2^{10}=1024$ vs
                 $11$. This isolates <b>dilated causal convolution</b> as the mechanism behind WaveNet's long memory:
                 the receptive field grows <i>exponentially</i> with depth under doubling dilation but only
                 <i>linearly</i> without it (&sect;2.1). The CODEVIZ panel measures both empirically with a gradient
                 probe and confirms $16$ vs $5$.</p>`
      },
      {
        q: `Hand-compute one causal-conv step. A causal layer has $k=2$, $d=1$, weights $w=[w_0,w_1]=[1,\\,3]$ (so
            $y_t = w_0 x_{t-1} + w_1 x_t$). For input $x=[2,\\,5,\\,1]$, left-pad by one zero and compute every
            output $y_t$. Verify no output uses a future sample.`,
        steps: [
          { do: `Left-pad: the layer reaches back $(k-1)d=1$, so prepend one zero:
                 $x_{\\text{pad}}=[0,\\,2,\\,5,\\,1]$.`,
            why: `Padding on the <b>left</b> (not the right) keeps the output length equal to the input and
                  guarantees causality.` },
          { do: `$y_1 = 1\\cdot 0 + 3\\cdot 2 = 6$.`,
            why: `At $t=1$ there is no real past, so the left-pad zero fills $x_0$; only $x_1=2$ contributes.` },
          { do: `$y_2 = 1\\cdot 2 + 3\\cdot 5 = 2 + 15 = 17$.`,
            why: `Sees $x_1=2$ (past) and $x_2=5$ (current) &mdash; no future term.` },
          { do: `$y_3 = 1\\cdot 5 + 3\\cdot 1 = 5 + 3 = 8$.`,
            why: `Sees $x_2=5$ and $x_3=1$; again no $x_4$ exists or is used.` }
        ],
        answer: `<p>$y=[6,\\,17,\\,8]$. Each output $y_t = w_0 x_{t-1} + w_1 x_t$ uses only the current sample and one
                 earlier sample (the left-pad supplies the missing $x_0=0$), so <b>no output ever reads a future
                 sample</b> &mdash; the convolution is causal. This is the 1-D, time-only version of PixelCNN's
                 masked convolution (<b>paper-pixelcnn</b>).</p>`
      },
      {
        q: `The gated activation unit (Eq.&nbsp;2) is
            $z=\\tanh(W_f * x)\\odot\\sigma(W_g * x)$. At one feature position the content branch gives
            $\\tanh(\\cdot)=-0.6$ and the gate branch gives $\\sigma(\\cdot)=0.2$. What is $z$ there, and what would
            $z$ be if the gate were instead $\\sigma(\\cdot)=0.9$? What is the gate doing?`,
        steps: [
          { do: `First case: $z = (-0.6)\\times 0.2 = -0.12$.`,
            why: `The unit multiplies content by gate element-wise; a gate near $0$ nearly shuts the feature off.` },
          { do: `Second case: $z = (-0.6)\\times 0.9 = -0.54$.`,
            why: `A gate near $1$ lets almost the full content value pass (sign preserved).` },
          { do: `Note the content value $-0.6$ was identical in both; only the gate changed the output.`,
            why: `The sigmoid gate is a learned, input-dependent volume knob in $[0,1]$ on each content channel.` }
        ],
        answer: `<p>With gate $0.2$: $z=-0.12$ &mdash; the feature is mostly suppressed. With gate $0.9$:
                 $z=-0.54$ &mdash; nearly the full content passes (its sign kept). The <b>sigmoid branch is a
                 per-element gate</b> (a learned $[0,1]$ multiplier) controlling how much of the <b>tanh content</b>
                 reaches the output. The paper found this multiplicative gating "works significantly better ...
                 than the rectified linear activation function" for audio (&sect;2.3).</p>`
      }
    ]
  });

  window.CODE["paper-wavenet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a <code>CausalConv1d</code> by wrapping <code>nn.Conv1d</code> and left-padding
       the time axis (so output $t$ sees only inputs $\\le t$), stack it with <b>doubling dilations</b>
       $1,2,4,8$, and <b>measure the receptive field empirically</b> with a gradient probe (it should be
       $2^{4}=16$; the plain all-dilation-1 ablation gives $1+4=5$). We then build a tiny gated WaveNet
       (Eq.&nbsp;2 + residual/skip), train per-sample cross-entropy on a toy quantized waveform, and
       <b>generate sample-by-sample autoregressively</b>. The first cell recomputes the worked example: a causal
       $k{=}2,d{=}1$ conv with weights $[0.5,2.0]$ on $[3,1,4,2]$ outputs <code>[6.0, 3.5, 8.5, 6.0]</code>,
       checked by <code>assert</code>. Paste into Colab (or any CPU) and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Sanity-check the worked example: one causal conv step (k=2, d=1). --------------
#     y_t = w0 * x_{t-1} + w1 * x_t,  left-pad by (k-1)*d = 1 zero so it's causal.
x  = torch.tensor([3., 1., 4., 2.]).view(1, 1, -1)     # (batch, channel, time)
w  = torch.tensor([0.5, 2.0]).view(1, 1, 2)            # taps: [past, current]
xp = F.pad(x, (1, 0))                                  # LEFT pad one zero, none on right
y  = F.conv1d(xp, w).view(-1)
print("causal conv output:", y.tolist())               # [6.0, 3.5, 8.5, 6.0]
assert torch.allclose(y, torch.tensor([6.0, 3.5, 8.5, 6.0]))

# --- 1. CausalConv1d: left-pad (k-1)*dilation, convolve with padding=0. ----------------
class CausalConv1d(nn.Module):
    def __init__(self, in_c, out_c, k=2, dilation=1):
        super().__init__()
        self.pad = (k - 1) * dilation                  # how far this layer reaches back
        self.conv = nn.Conv1d(in_c, out_c, k, dilation=dilation, padding=0)
    def forward(self, x):
        return self.conv(F.pad(x, (self.pad, 0)))      # left only -> output t sees inputs <= t

# --- 2. Measure the receptive field empirically with a gradient probe. -----------------
#     Feed a length-L input; backprop d(last output)/d(input); count nonzero-grad inputs.
def receptive_field(dilations, k=2, L=64):
    layers = [CausalConv1d(1, 1, k, d) for d in dilations]
    net = nn.Sequential(*layers)
    for p in net.parameters():                         # weights=1, bias=0 => grad flows
        nn.init.constant_(p, 1.0 if p.dim() > 1 else 0.0)
    inp = torch.zeros(1, 1, L, requires_grad=True)
    out = net(inp)
    out[0, 0, -1].backward()                           # gradient of the LAST output sample
    return int((inp.grad[0, 0].abs() > 0).sum().item())

rf_dilated = receptive_field([1, 2, 4, 8])             # exponential: 2^4
rf_plain   = receptive_field([1, 1, 1, 1])             # linear:      1+4
print(f"receptive field  dilated(1,2,4,8) = {rf_dilated}   plain(1,1,1,1) = {rf_plain}")
assert rf_dilated == 16 and rf_plain == 5              # matches R = 1 + sum (k-1)d

# --- 3. Tiny gated WaveNet: gated residual blocks + skip connections + softmax head. ---
Q = 16                                                 # toy quantization levels (paper: 256)
class GatedBlock(nn.Module):
    def __init__(self, ch, dilation):
        super().__init__()
        self.filt = CausalConv1d(ch, ch, 2, dilation)  # tanh "content" branch
        self.gate = CausalConv1d(ch, ch, 2, dilation)  # sigmoid "gate" branch
        self.res  = nn.Conv1d(ch, ch, 1)               # 1x1 residual projection
        self.skip = nn.Conv1d(ch, ch, 1)               # 1x1 skip projection
    def forward(self, x):
        z = torch.tanh(self.filt(x)) * torch.sigmoid(self.gate(x))   # Eq. 2
        return x + self.res(z), self.skip(z)           # residual out, skip out

class TinyWaveNet(nn.Module):
    def __init__(self, ch=32, dilations=(1, 2, 4, 8)):
        super().__init__()
        self.embed  = nn.Conv1d(1, ch, 1)
        self.blocks = nn.ModuleList(GatedBlock(ch, d) for d in dilations)
        self.head   = nn.Sequential(nn.ReLU(), nn.Conv1d(ch, ch, 1),
                                    nn.ReLU(), nn.Conv1d(ch, Q, 1))   # -> Q-way logits/step
    def forward(self, x):                              # x: (B,1,T) float in [-1,1]
        h, skips = self.embed(x), 0
        for b in self.blocks:
            h, s = b(h); skips = skips + s
        return self.head(skips)                        # (B, Q, T) logits

# --- 4. Toy waveform: a quantized sine wave; train per-sample cross-entropy. ------------
def mu_law(x, mu=Q - 1):                               # mu-law companding (Sec 2.2), mu=Q-1
    return torch.sign(x) * torch.log1p(mu * x.abs()) / torch.log1p(torch.tensor(float(mu)))
T = 256
t = torch.linspace(0, 8 * 3.14159, T)
wave = 0.9 * torch.sin(t)                              # raw signal in [-1,1]
comp = mu_law(wave)                                    # companded
q = ((comp * 0.5 + 0.5) * (Q - 1)).round().long().clamp(0, Q - 1)   # -> {0..Q-1} classes
xf = (q.float() / (Q - 1) * 2 - 1).view(1, 1, T)       # model input (float)

net = TinyWaveNet()
opt = torch.optim.Adam(net.parameters(), lr=3e-3)
for step in range(300):
    logits = net(xf)[..., :-1]                         # predict sample t+1 from <= t
    loss = F.cross_entropy(logits.reshape(Q, -1).T, q[1:].view(-1))
    opt.zero_grad(); loss.backward(); opt.step()
print(f"final per-sample cross-entropy: {loss.item():.4f}  (Q={Q} levels)")

# --- 5. Generate a tiny waveform autoregressively, sample-by-sample. -------------------
@torch.no_grad()
def generate(net, seed, n=64):
    buf = seed.clone()                                 # (1,1,t0) float
    for _ in range(n):
        logits = net(buf)[0, :, -1]                    # Q-way dist for the NEXT sample
        cls = torch.distributions.Categorical(logits=logits).sample()
        nxt = (cls.float() / (Q - 1) * 2 - 1).view(1, 1, 1)
        buf = torch.cat([buf, nxt], dim=-1)            # append, then continue
    return buf[0, 0]
gen = generate(net, xf[..., :16], n=64)
print("generated waveform (first 12 samples):", [round(v, 2) for v in gen[:12].tolist()])
# Training is one parallel pass; generation is strictly sequential (append each sample).
# (Our small CPU run on a toy sine, not the paper's reported MOS / audio.)`
  };

  window.CODEVIZ["paper-wavenet"] = {
    question: "Does doubling the dilation each layer make the receptive field grow EXPONENTIALLY with depth, while a plain causal stack grows only linearly? (Measured empirically with a gradient probe.)",
    charts: [
      {
        type: "line",
        title: "Receptive field vs depth — dilated (doubling) causal conv vs plain (dilation-1) causal conv, k=2",
        xlabel: "number of layers (depth L)",
        ylabel: "receptive field R (past samples seen, measured by gradient probe)",
        series: [
          {
            name: "Dilated 1,2,4,... (exponential, R = 2^L)",
            color: "#7ee787",
            points: [[1,2],[2,4],[3,8],[4,16],[5,32],[6,64],[7,128],[8,256]]
          },
          {
            name: "Plain dilation-1 (linear, R = 1 + L)",
            color: "#ff7b72",
            points: [[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9]]
          }
        ]
      }
    ],
    caption: "Our small CPU run, not the paper's numbers. Both stacks are identical except the dilation schedule: kernel size k=2, weights set to 1 so gradient flows, and the receptive field is MEASURED — backprop from the last output and count how many input positions have nonzero gradient. The green stack doubles dilation each layer (1,2,4,8,...) and its receptive field is exactly 2^L (4 layers → 16, 8 layers → 256); the red plain stack (all dilation 1) reaches only 1+L (4 layers → 5). The gap explodes with depth — at 10 layers it is 1024 vs 11. This reproduces the paper's core claim (§2.1) that 'exponentially increasing the dilation factor results in exponential receptive field growth with depth', and is why WaveNet reaches a 1024-sample memory with a shallow, parallel-trainable stack.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# Reproduces WaveNet's core point (Sec 2.1) on a gradient probe: doubling dilation grows
# the receptive field exponentially with depth; plain (dilation-1) grows it linearly.
torch.manual_seed(0)

class CausalConv1d(nn.Module):
    def __init__(self, in_c, out_c, k=2, dilation=1):
        super().__init__()
        self.pad = (k - 1) * dilation
        self.conv = nn.Conv1d(in_c, out_c, k, dilation=dilation, padding=0)
    def forward(self, x):
        return self.conv(F.pad(x, (self.pad, 0)))      # LEFT pad only -> causal

def receptive_field(dilations, k=2, L=512):
    net = nn.Sequential(*[CausalConv1d(1, 1, k, d) for d in dilations])
    for p in net.parameters():
        nn.init.constant_(p, 1.0 if p.dim() > 1 else 0.0)
    inp = torch.zeros(1, 1, L, requires_grad=True)
    net(inp)[0, 0, -1].backward()                      # grad of LAST output sample
    return int((inp.grad[0, 0].abs() > 0).sum().item())

for depth in range(1, 9):
    dil  = [2 ** i for i in range(depth)]              # 1,2,4,... doubling
    flat = [1] * depth                                 # all dilation 1
    print(f"L={depth}  dilated R={receptive_field(dil)}  plain R={receptive_field(flat)}")
# L=1 2/2  L=2 4/3  L=3 8/4  L=4 16/5  ...  L=8 256/9   (dilated = 2^L, plain = 1+L)`
  };
})();
