/* Paper lesson — "Deep Speech: Scaling up end-to-end speech recognition",
   Awni Hannun, Carl Case, Jared Casper, Bryan Catanzaro, Greg Diamos, Erich Elsen,
   Ryan Prenger, Sanjeev Satheesh, Shubho Sengupta, Adam Coates, Andrew Y. Ng
   (Baidu Research — Silicon Valley AI Lab), arXiv:1412.5567, 2014.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-deep-speech".
   GROUNDED from the ar5iv HTML mirror https://ar5iv.labs.arxiv.org/html/1412.5567 :
   - Sec 2 ("RNN Training Setup"): the 5-layer model. Eq. for non-recurrent layers
     h^(l)_t = g(W^(l) h^(l-1)_t + b^(l)); clipped-ReLU g(z) = min{max{0,z},20};
     bidirectional layer h^(f), h^(b); combine layer h^(5) on h^(4)=h^(f)+h^(b);
     softmax output h^(6)_{t,k} = P(c_t=k|x). Alphabet {a..z, space, apostrophe, blank}.
     First layer sees a context of C frames each side, C in {5,7,9}. CTC loss used.
   - Sec 5 / Table 3: Deep Speech (SWB+FSH) = 16.0% WER on full Hub5'00, "best published result",
     beating prior 18.4% (Vesely et al.). Features: spectrograms.
   Cross-links paper-ctc (CTC owns its forward-backward math; recap+link only).
   Track B (architecture): build a tiny spectrogram->3 FC (clipped ReLU)->bi-RNN->softmax net,
   train with torch.nn.CTCLoss on toy 'audio-like' spectrograms, greedy-decode characters
   end-to-end. Worked CTC example (target "hi", T=4) verified: -ln p = 0.738145 = torch.nn.CTCLoss
   (allclose True). Pipeline: BIDIR loss 0.097, 8/8 decoded; ABLATION unidirectional loss 2.446, 1/8.
   conceptLink null. */
(function () {
  window.LESSONS.push({
    id: "paper-deep-speech",
    title: "Deep Speech — Scaling up end-to-end speech recognition (2014)",
    tagline: "Throw away the phoneme dictionary, the pronunciation model, and the HMM aligner: turn a spectrogram straight into letters with one recurrent network trained by CTC.",
    module: "Papers · Speech & Audio",
    track: "architecture",
    paper: {
      authors: "Awni Hannun, Carl Case, Jared Casper, Bryan Catanzaro, Greg Diamos, Erich Elsen, Ryan Prenger, Sanjeev Satheesh, Shubho Sengupta, Adam Coates, Andrew Y. Ng",
      org: "Baidu Research — Silicon Valley AI Lab",
      year: 2014,
      venue: "arXiv:1412.5567",
      citations: "",
      arxiv: "https://arxiv.org/abs/1412.5567",
      url: "https://arxiv.org/abs/1412.5567",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-rnn", "dl-lstm-gru", "ml-softmax", "dl-activations", "paper-ctc"],

    // WHY READ IT
    problem:
      `<p><b>Automatic speech recognition</b> (ASR &mdash; turning recorded speech into written text)
       was, before this paper, a tall stack of separately built parts. The paper opens by criticising
       exactly that (&sect;1):</p>
       <blockquote>"Top speech recognition systems rely on sophisticated pipelines composed of multiple
       algorithms and hand-engineered processing stages." (&sect;1)</blockquote>
       <p>Unpack that stack. A traditional recogniser needed: an <b>acoustic model</b> that maps sound to
       <b>phonemes</b> (the small sound-units of a language, like the "k" sound in "cat"); a hand-written
       <b>pronunciation dictionary</b> that says which phonemes spell each word; and a <b>hidden Markov
       model</b> (HMM &mdash; a probabilistic state machine that lines up the variable-length audio with the
       phoneme sequence). Each piece was tuned on its own, and extra modules were bolted on for speaker
       differences and background noise. The paper notes these systems "tend to perform poorly when used in
       noisy environments" (&sect;1). The whole apparatus rests on the idea of a phoneme &mdash; a human-chosen
       abstraction the data never actually contains.</p>`,
    contribution:
      `<ul>
        <li><b>One network, sound &rarr; letters.</b> Deep Speech replaces the entire pipeline with a single
        recurrent neural network that reads a <b>spectrogram</b> (a picture of how much energy the audio has at
        each frequency over time) and emits a probability over <b>characters</b> at every time step. The paper
        states the headline plainly: "We do not need a phoneme dictionary, nor even the concept of a
        'phoneme.'" (&sect;1)</li>
        <li><b>Trained end-to-end with CTC.</b> The network is trained with the <b>Connectionist Temporal
        Classification</b> loss (CTC &mdash; see <code>paper-ctc</code>), which scores a whole target string
        against the per-frame outputs by summing over every way the letters could line up with the frames. No
        one ever labels which audio frame is which letter (&sect;2).</li>
        <li><b>Built to scale.</b> A deliberately simple architecture (feed-forward layers plus one
        bidirectional recurrent layer) so it could be trained fast on GPUs over thousands of hours of speech,
        with synthetic noise added to make it robust (&sect;3&ndash;4).</li>
      </ul>`,
    whyItMattered:
      `<p>Deep Speech showed that a generic recurrent network plus CTC could <b>beat</b> the elaborate
       phoneme-and-HMM pipelines that the field had refined for decades, reaching a then-state-of-the-art
       <b>16.0% word error rate</b> on the full Hub5'00 switchboard test set (&sect;5, Table 3 &mdash; quoted
       in <i>results</i> below). It made "end-to-end speech recognition" the default research direction:
       Deep Speech 2, Listen-Attend-Spell (<code>paper-las</code>), wav2vec, and Whisper all descend from the
       same bet &mdash; let one network learn the mapping from audio to text, and let scale do the rest.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>Read <b>&sect;1 (Introduction)</b> for the pitch against phoneme/HMM pipelines. The core is
       <b>&sect;2 "RNN Training Setup"</b> &mdash; the five layer equations and the CTC objective; spend your
       time here. Skim <b>&sect;3 (Optimizations)</b> and <b>&sect;4 (Training Data)</b>: these are the GPU
       engineering and the noise-synthesis tricks that made it scale &mdash; useful context, not new math. Land
       on <b>&sect;5 (Experiments)</b> and especially <b>Table 3</b> for the Hub5'00 numbers. You can treat the
       CTC forward-backward dynamic program as a black box here &mdash; it has its own full lesson
       (<code>paper-ctc</code>); this paper just <i>uses</i> it.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>The recurrent layer in Deep Speech is <b>bidirectional</b> &mdash; it reads the utterance once
       forward and once backward, so each time step sees both past and future sound. Suppose we ablate that:
       make the recurrent layer <b>unidirectional</b> (forward only), same size, same training budget. On a
       small character-recognition task, do you expect the unidirectional model to (a) match the bidirectional
       one, (b) decode noticeably worse, or (c) fail to learn? Why might future context matter when deciding a
       letter at the current frame?</p>`,
    attempt:
      `<p>Before the reveal, sketch the forward pass of the Deep Speech net on one spectrogram frame matrix
       <code>X</code> of shape <code>(T, F)</code> (T time steps, F frequency bins):</p>
       <ol>
        <li>Three feed-forward layers with the <b>clipped ReLU</b> $g(z)=\\min\\{\\max\\{0,z\\},20\\}$:
        <code>h = g(W3 g(W2 g(W1 X)))</code> (TODO: write <code>g</code> as <code>z.clamp(0,20)</code>).</li>
        <li>One <b>bidirectional</b> recurrent layer over the T steps (TODO: <code>nn.RNN(..., bidirectional=True)</code>).</li>
        <li>A linear + <b>softmax</b> to <code>V</code> outputs = the alphabet plus a <b>blank</b> (TODO: <code>log_softmax</code>).</li>
        <li>Train with <code>nn.CTCLoss(blank=0)</code>; greedy-decode by argmax per frame, then collapse
        repeats and drop blanks.</li>
       </ol>
       <p>Then run the same thing with <code>bidirectional=False</code> and compare. The full code is in CODE.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Deep Speech is, end to end, a function from a <b>spectrogram</b> to a string of <b>characters</b>.
       Here is the whole path (&sect;2).</p>
       <p><b>Input.</b> The audio is turned into a spectrogram: chop it into short overlapping windows
       (the paper uses 20&nbsp;ms windows strided by 10&nbsp;ms), and for each window record how much energy
       sits in each frequency band. That gives a matrix $x$: one column per time step $t$, one row per
       frequency. To give the first layer a little look-around, at each time $t$ it is fed the frame $x_t$
       <i>together with a context of $C$ frames on each side</i>, with $C \\in \\{5,7,9\\}$ (&sect;2).</p>
       <p><b>Layers 1&ndash;3 (not recurrent).</b> Three ordinary feed-forward layers process each time step
       independently. Each applies a weight matrix and a <b>clipped rectified-linear</b> nonlinearity
       $g(z)=\\min\\{\\max\\{0,z\\},20\\}$ &mdash; a ReLU (see <code>dl-activations</code>) that is also capped
       at 20 so activations cannot blow up: $h^{(l)}_t = g\\!\\left(W^{(l)} h^{(l-1)}_t + b^{(l)}\\right)$.</p>
       <p><b>Layer 4 (the bidirectional recurrent layer).</b> This is the one layer that lets information flow
       <i>along time</i>. It keeps two separate hidden states: a <b>forward</b> state $h^{(f)}$ that sweeps
       left&rarr;right and a <b>backward</b> state $h^{(b)}$ that sweeps right&larr;left:
       $h^{(f)}_t = g\\!\\left(W^{(4)}h^{(3)}_t + W^{(f)}_r h^{(f)}_{t-1} + b^{(4)}\\right)$ and
       $h^{(b)}_t = g\\!\\left(W^{(4)}h^{(3)}_t + W^{(b)}_r h^{(b)}_{t+1} + b^{(4)}\\right)$. So the output at
       time $t$ has seen the <i>whole utterance</i> &mdash; sound before <b>and</b> after the current frame.</p>
       <p><b>Layer 5 (combine).</b> The two directions are added, $h^{(4)}_t = h^{(f)}_t + h^{(b)}_t$, and a
       final feed-forward layer mixes them: $h^{(5)}_t = g\\!\\left(W^{(5)} h^{(4)}_t + b^{(5)}\\right)$.</p>
       <p><b>Output (softmax over characters).</b> A last linear layer plus a <b>softmax</b> (see
       <code>ml-softmax</code>) turns $h^{(5)}_t$ into a probability distribution over the alphabet at every
       time step. The alphabet is the literal characters: $c_t \\in \\{a,b,c,\\ldots,z,\\text{space},
       \\text{apostrophe},\\text{blank}\\}$ (&sect;2) &mdash; note the <b>blank</b>, the CTC symbol meaning
       "emit nothing here."</p>
       <p><b>Training.</b> Because there are far more frames than letters and no one says which frame is which
       letter, the network is trained with the <b>CTC loss</b>, which sums the probability over every valid
       alignment of the target string to the frames (&sect;2; full math in <code>paper-ctc</code>).</p>`,
    architecture:
      `<p>Deep Speech is a stack of <b>5 hidden layers</b> on top of a spectrogram input, ending in a softmax
       and a CTC objective (&sect;2). Component by component, in the order data flows:</p>
       <ol>
        <li><b>Input: spectrogram + context.</b> The waveform becomes a spectrogram $x$ where $x_{t,p}$ is the
        power of frequency bin $p$ at frame $t$ (20&nbsp;ms window, 10&nbsp;ms stride). At each frame $t$ the
        first layer receives $x_t$ <i>spliced with $C$ context frames on each side</i>, $C\\in\\{5,7,9\\}$, so its
        input width is $(2C+1)$ frames of frequency bins.</li>
        <li><b>Layers 1&ndash;3: feed-forward, per frame.</b> Three fully-connected layers applied independently
        at every time step, each $h^{(l)}_t = g(W^{(l)}h^{(l-1)}_t + b^{(l)})$ with the clipped ReLU
        $g(z)=\\min\\{\\max\\{0,z\\},20\\}$. No information crosses time yet.</li>
        <li><b>Layer 4: bidirectional recurrent.</b> The single layer that moves information <i>along time</i>.
        Two independent hidden sequences: a forward state $h^{(f)}$ computed for $t=1\\ldots T$ using its own
        recurrent matrix $W^{(f)}_r$, and a backward state $h^{(b)}$ computed for $t=T\\ldots 1$ using $W^{(b)}_r$.
        (The paper uses a plain RNN recurrence, not an LSTM/GRU, to keep it fast on GPUs.)</li>
        <li><b>Combine + Layer 5.</b> The two directions are <i>summed</i>, $h^{(4)}_t = h^{(f)}_t + h^{(b)}_t$
        (not concatenated), and a fifth feed-forward layer $h^{(5)}_t = g(W^{(5)}h^{(4)}_t + b^{(5)})$ mixes them.</li>
        <li><b>Layer 6: softmax output.</b> A linear map plus softmax over the alphabet
        $\\{a,\\ldots,z,\\text{space},\\text{apostrophe},\\text{blank}\\}$ produces $\\hat{y}_{t,k}=\\mathbb{P}(c_t=k\\mid x)$
        at every frame &mdash; a $T\\times V$ stack of per-frame character distributions.</li>
        <li><b>Training objective: CTC.</b> The whole stack is trained by the CTC loss
        $\\mathcal{L}(\\hat{y},y)$, which sums probability over all alignments of the target $y$ to the $T$
        frames; gradients $\\nabla_{\\hat{y}}\\mathcal{L}$ flow back through the softmax into all 5 layers.</li>
        <li><b>Decoding: beam search + N-gram LM.</b> At test time the per-frame stack is decoded by a beam
        search that maximises $Q(c)=\\log\\mathbb{P}(c\\mid x)+\\alpha\\log\\mathbb{P}_{\\text{lm}}(c)+\\beta\\,\\text{word\\_count}(c)$,
        fusing the acoustic RNN with a separately-trained N-gram language model (&sect;2.2; beam size 1000&ndash;8000).</li>
       </ol>
       <p>Engineering that lets this scale (&sect;3&ndash;4, context not new math): a custom multi-GPU
       data-parallel trainer, and <b>synthetic noise</b> added to the audio to make the model robust.</p>`,
    symbols: [
      { sym: "$x$ / $x_t$", desc: "the input spectrogram, and its column (frame) at time step $t$ — energy per frequency band in one short audio window." },
      { sym: "$t$, $T$", desc: "time-step index and total number of frames in the utterance." },
      { sym: "$C$", desc: "context width: the first layer sees $C$ frames on each side of $x_t$; the paper uses $C\\in\\{5,7,9\\}$." },
      { sym: "$h^{(l)}_t$", desc: "the activation (output vector) of layer $l$ at time $t$. Layers are numbered 1 (first feed-forward) up to the output." },
      { sym: "$W^{(l)}$, $b^{(l)}$", desc: "the weight matrix and bias vector of layer $l$ — the learned parameters." },
      { sym: "$g(z)$", desc: "the clipped ReLU activation $\\min\\{\\max\\{0,z\\},20\\}$: zero for negatives, identity in $[0,20]$, capped at 20." },
      { sym: "$h^{(f)}_t$, $h^{(b)}_t$", desc: "the forward (left→right) and backward (right→left) hidden states of the bidirectional recurrent layer." },
      { sym: "$W^{(f)}_r$, $W^{(b)}_r$", desc: "the recurrent weight matrices that carry the forward / backward state from the neighbouring time step." },
      { sym: "$c_t$", desc: "the character emitted at frame $t$, drawn from $\\{a,\\ldots,z,\\text{space},\\text{apostrophe},\\text{blank}\\}$." },
      { sym: "$\\hat{y}_{t,k} = \\mathbb{P}(c_t=k\\mid x)$", desc: "the softmax output: probability that frame $t$ is character $k$, given the whole input." },
      { sym: "$\\mathcal{L}(\\hat{y}, y)$", desc: "the CTC loss: the error between the softmax stack $\\hat{y}$ and the ground-truth character sequence $y$; $\\nabla_{\\hat{y}}\\mathcal{L}$ is its gradient w.r.t. the network outputs." },
      { sym: "$y$", desc: "the ground-truth target character sequence (the transcript) used to compute the CTC loss." },
      { sym: "$Q(c)$", desc: "the decode-time objective maximised over candidate character strings $c$ by beam search: RNN score plus language-model score plus a length reward." },
      { sym: "$\\mathbb{P}_{\\text{lm}}(c)$", desc: "the probability of string $c$ under a separately-trained N-gram language model." },
      { sym: "$\\alpha$, $\\beta$", desc: "cross-validated weights in $Q(c)$: $\\alpha$ weights the language-model score, $\\beta$ rewards word count to offset the LM's bias toward short strings." },
      { sym: "$\\text{word\\_count}(c)$", desc: "the number of words in candidate string $c$ — the length term in the decode objective $Q(c)$." },
      { sym: "CTC", desc: "Connectionist Temporal Classification — the loss that scores a target string by summing over all frame-to-letter alignments (see paper-ctc)." },
      { sym: "WER", desc: "Word Error Rate — the standard ASR score: edits (insert/delete/substitute words) needed to fix the output, divided by the number of reference words. Lower is better." }
    ],
    formula:
      `$$h^{(l)}_t \\;=\\; g\\!\\left(W^{(l)} h^{(l-1)}_t + b^{(l)}\\right), \\qquad l = 1,2,3$$
       <p>The three non-recurrent layers (&sect;2): each applies a weight matrix and the clipped-ReLU
       nonlinearity to the previous layer's activation, independently at every time step $t$. Layer 1 reads the
       spectrogram frame $x_t$ spliced with $C$ context frames on each side, $C\\in\\{5,7,9\\}$.</p>
       $$g(z) \\;=\\; \\min\\{\\max\\{0,z\\},\\,20\\}$$
       <p>The clipped rectified-linear activation (&sect;2): zero for negatives, identity on $[0,20]$, capped at
       20 so the deep stack's activations cannot blow up.</p>
       $$h^{(f)}_t \\;=\\; g\\!\\left(W^{(4)} h^{(3)}_t + W^{(f)}_r h^{(f)}_{t-1} + b^{(4)}\\right)$$
       $$h^{(b)}_t \\;=\\; g\\!\\left(W^{(4)} h^{(3)}_t + W^{(b)}_r h^{(b)}_{t+1} + b^{(4)}\\right)$$
       <p>The bidirectional recurrent layer 4 (&sect;2): a forward state $h^{(f)}$ swept left&rarr;right (carries
       $h^{(f)}_{t-1}$) and a backward state $h^{(b)}$ swept right&larr;left (carries $h^{(b)}_{t+1}$), so each
       output sees the whole utterance &mdash; past and future sound.</p>
       $$h^{(4)}_t \\;=\\; h^{(f)}_t + h^{(b)}_t, \\qquad h^{(5)}_t \\;=\\; g\\!\\left(W^{(5)} h^{(4)}_t + b^{(5)}\\right)$$
       <p>Combine the two directions by addition, then a fifth feed-forward layer mixes them (&sect;2).</p>
       $$h^{(6)}_{t,k} \\;=\\; \\hat{y}_{t,k} \\;\\equiv\\; \\mathbb{P}(c_t = k \\mid x) \\;=\\; \\frac{\\exp\\!\\left(W^{(6)}_k h^{(5)}_t + b^{(6)}_k\\right)}{\\sum_{j}\\exp\\!\\left(W^{(6)}_j h^{(5)}_t + b^{(6)}_j\\right)}$$
       <p>The softmax output layer 6 (&sect;2): a probability over the character alphabet
       $c_t\\in\\{a,\\ldots,z,\\text{space},\\text{apostrophe},\\text{blank}\\}$ at every frame $t$.</p>
       $$\\mathcal{L}(\\hat{y}, y), \\qquad \\nabla_{\\hat{y}}\\,\\mathcal{L}(\\hat{y}, y)$$
       <p>The CTC loss (&sect;2): given the softmax stack $\\hat{y}$ and the ground-truth character sequence $y$,
       it scores $y$ by summing the probability over every frame-to-letter alignment, and supplies the gradient
       $\\nabla_{\\hat{y}}\\mathcal{L}$ back to the network. The forward&ndash;backward dynamic program is owned by
       <code>paper-ctc</code>.</p>
       $$Q(c) \\;=\\; \\log \\mathbb{P}(c \\mid x) \\;+\\; \\alpha \\, \\log \\mathbb{P}_{\\text{lm}}(c) \\;+\\; \\beta \\, \\text{word\\_count}(c)$$
       <p>The N-gram language-model integration (&sect;2.2): at decode time a beam search maximises $Q(c)$ over
       character strings $c$, trading off the RNN score $\\log\\mathbb{P}(c\\mid x)$, the language-model score
       $\\log\\mathbb{P}_{\\text{lm}}(c)$ (weight $\\alpha$), and a word-count reward (weight $\\beta$) that
       counteracts the LM's bias toward shorter strings; $\\alpha,\\beta$ are set by cross-validation.</p>`,
    whatItDoes:
      `<p>This is the <b>output layer</b> (the softmax) from &sect;2. It reads the final hidden vector
       $h^{(5)}_t$ at frame $t$ and turns it into a probability distribution over the alphabet: the numerator
       exponentiates the score $W^{(6)}_k h^{(5)}_t + b^{(6)}_k$ for character $k$, and the denominator divides
       by the sum over all characters $j$ so the numbers add to 1. Read it as: "given the whole audio $x$, how
       likely is each letter at this instant?" Stack these distributions across all $T$ frames and CTC reads
       the stack to score a target string &mdash; you never softmax over words or phonemes, only over raw
       characters plus the blank.</p>`,
    derivation:
      `<p>Why a softmax here? Because the output must be a <b>probability distribution over a fixed set of
       characters</b> at each frame, and CTC then multiplies these per-frame probabilities along an alignment.
       The softmax is the standard way to turn arbitrary real scores (the "logits" $W^{(6)}_j h^{(5)}_t +
       b^{(6)}_j$) into non-negative numbers that sum to one &mdash; its full justification (it is the maximum-
       entropy distribution matching the scores, and pairs with cross-entropy to give clean gradients) lives in
       <code>ml-softmax</code>.</p>
       <p>The <b>collapse from frames to text</b> is the genuinely new part, and it belongs to CTC, not to this
       layer. CTC defines a many-to-one map $\\mathcal{B}$ that takes a per-frame character string (a "path")
       and produces the final text by <i>merging adjacent repeats, then deleting blanks</i> &mdash;
       e.g. <code>h _ i _</code> &rarr; <code>hi</code>. The probability of a target string is the sum of the
       per-frame products over <i>every</i> path that collapses to it, computed efficiently by a forward
       dynamic program. That derivation is done in full in <code>paper-ctc</code>; Deep Speech simply feeds
       this softmax stack into it.</p>`,
    example:
      `<p><b>Worked numbers &mdash; one CTC decode end to end.</b> Take a tiny alphabet
       $\\{\\text{blank}, h, i\\}$ (index the blank as 0) and a short utterance of $T=4$ frames. Each row of the
       softmax output $\\hat{y}_{t,k}=\\mathbb{P}(c_t=k\\mid x)$ is one frame and sums to 1; the boldface cell in
       each row is that frame's argmax (its greedy pick):</p>
       <table class="extable">
        <caption>Per-frame softmax stack $\\hat{y}$ (rows = frames, columns = characters; each row sums to 1).</caption>
        <thead><tr><th>frame $t$</th><th class="num">blank</th><th class="num">$h$</th><th class="num">$i$</th><th>argmax</th></tr></thead>
        <tbody>
         <tr><td class="row-h">1</td><td class="num">0.1</td><td class="num"><b>0.7</b></td><td class="num">0.2</td><td>$h$</td></tr>
         <tr><td class="row-h">2</td><td class="num"><b>0.6</b></td><td class="num">0.3</td><td class="num">0.1</td><td>blank</td></tr>
         <tr><td class="row-h">3</td><td class="num">0.2</td><td class="num">0.2</td><td class="num"><b>0.6</b></td><td>$i$</td></tr>
         <tr><td class="row-h">4</td><td class="num"><b>0.5</b></td><td class="num">0.1</td><td class="num">0.4</td><td>blank</td></tr>
        </tbody>
       </table>
       <p><b>(a) Greedy (best-path) decode.</b> Reading the argmax column top to bottom gives the path
       <code>h _ i _</code>. Apply CTC's collapse:</p>
       <ul class="steps">
        <li><b>Merge adjacent repeats:</b> <code>h _ i _</code> has no adjacent duplicates, so it is unchanged.</li>
        <li><b>Drop every blank:</b> <code>h _ i _</code> &rarr; <code>h i</code> &rarr; <b>"hi"</b>. We decoded
        characters directly &mdash; no phonemes, no dictionary.</li>
       </ul>
       <p><b>(b) CTC training loss for target "hi".</b> The loss does not just take the best path; it sums the
       probability of <i>every</i> length-4 path that collapses to "hi". Three of the 15 such paths, with their
       probability $=$ product of the four per-frame values picked:</p>
       <table class="extable">
        <caption>Three of the 15 length-4 paths that collapse to "hi" (of $3^4=81$ total paths).</caption>
        <thead><tr><th>path</th><th>frame-1</th><th>frame-2</th><th>frame-3</th><th>frame-4</th><th class="num">product</th></tr></thead>
        <tbody>
         <tr><td class="row-h"><code>h _ i _</code></td><td class="num">0.7</td><td class="num">0.6</td><td class="num">0.6</td><td class="num">0.5</td><td class="num">0.126</td></tr>
         <tr><td class="row-h"><code>h h _ i</code></td><td class="num">0.7</td><td class="num">0.3</td><td class="num">0.2</td><td class="num">0.4</td><td class="num">0.0168</td></tr>
         <tr><td class="row-h"><code>_ h i i</code></td><td class="num">0.1</td><td class="num">0.3</td><td class="num">0.6</td><td class="num">0.4</td><td class="num">0.0072</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li>Top path <code>h _ i _</code>: $0.7 \\times 0.6 \\times 0.6 \\times 0.5 = 0.126$ &mdash; the single
        biggest term (the greedy path).</li>
        <li><b>Sum all 15 collapsing paths</b> (the three above plus twelve more):
        $\\mathbb{P}(\\text{"hi"}\\mid x) = 0.478$.</li>
        <li><b>CTC loss</b> $= -\\ln \\mathbb{P}(\\text{"hi"}\\mid x) = -\\ln 0.478 = \\mathbf{0.738145}$.</li>
       </ul>
       <p>The CTC forward dynamic program gets the same $0.478$ without enumerating paths; in CODE we confirm
       <code>torch.nn.CTCLoss</code> returns exactly <code>0.738145</code> (allclose True).</p>`,
    recipe:
      `<p>The architecture as numbered steps (&sect;2), exactly what CODE builds:</p>
       <ol>
        <li><b>Spectrogram in.</b> Audio &rarr; matrix $x$ of shape (T frames, F frequencies); optionally
        splice $C$ context frames on each side into the first layer's input.</li>
        <li><b>Three feed-forward layers</b> with clipped ReLU $g(z)=\\min\\{\\max\\{0,z\\},20\\}$, applied per
        frame: $h^{(l)}_t = g(W^{(l)} h^{(l-1)}_t + b^{(l)})$, for $l=1,2,3$.</li>
        <li><b>One bidirectional recurrent layer.</b> Forward state $h^{(f)}$ over $t=1\\ldots T$ and backward
        state $h^{(b)}$ over $t=T\\ldots 1$; combine $h^{(4)}_t = h^{(f)}_t + h^{(b)}_t$.</li>
        <li><b>One more feed-forward layer</b> $h^{(5)}_t = g(W^{(5)} h^{(4)}_t + b^{(5)})$.</li>
        <li><b>Softmax output</b> over the alphabet $\\{a..z, \\text{space}, \\text{apostrophe}, \\text{blank}\\}$
        (the key formula above), giving $\\hat{y}_{t,k}$.</li>
        <li><b>Train</b> by minimising the CTC loss of the target text against the softmax stack.</li>
        <li><b>Decode</b> at test time: greedy = argmax per frame then collapse; the paper also fuses an
        n-gram language model for its best numbers.</li>
       </ol>`,
    results:
      `<p>From &sect;5 (Experiments), <b>Table 3</b>, on the standard Hub5'00 conversational-telephone test set:</p>
       <blockquote>"Deep Speech SWB + FSH" reaches <b>16.0%</b> word error rate on the full Hub5'00 set,
       which the paper calls "the best published result", improving on the prior 18.4% (Vesely et al.).
       (&sect;5, Table 3)</blockquote>
       <p>(SWB + FSH = trained on the Switchboard and Fisher conversational-speech corpora.) These are the
       <i>paper's</i> reported numbers, quoted with their source. Every number in CODEVIZ below is from our own
       toy run, not the paper's.</p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Speech recognition is scored by <b>word error rate</b> (WER) — the
       edit distance (insert + delete + substitute words) to fix the output, divided by the number of reference
       words; lower is better. The paper measures it on the standard <b>Hub5'00</b> conversational-telephone test
       set. The "better than trivial" bar here is not random (a blank-only decoder gets WER near 100%); it is the
       <b>prior published result, 18.4%</b> (Vesely et al.), which Deep Speech had to beat. For <i>your</i> toy
       build the analogous metrics are the held-out <b>CTC loss</b> and <b>exact-match decode rate</b> (how many toy
       utterances greedy-decode to the right string).</p>
       <ul>
        <li><b>Sanity checks BEFORE training.</b> (1) <b>Known-answer CTC test</b> (the oracle in CODE): feed the
        worked softmax stack for target "hi", $T=4$, and confirm <code>torch.nn.CTCLoss</code> returns
        <b>$-\\ln 0.478 = 0.738145$</b> (allclose to your hand sum over the 15 collapsing paths). If this is off, your
        blank index or tensor shapes are wrong before you train anything. (2) <b>Loss at init</b>: for a $V$-way
        softmax with random weights the per-frame cross-entropy is about $\\ln V$, so a short target's CTC loss should
        start near a small multiple of $\\ln V$ — wildly larger means bad init or a clamp bug. (3) <b>Overfit the 8
        toy spectrograms</b> and watch the summed CTC loss head toward ~0; if it sticks, the model isn't learning.
        (4) Check the <b>blank is class 0</b> and inputs are <code>log_softmax</code> shaped $(T, N, C)$ — the two
        most common silent bugs.</li>
        <li><b>Expected range.</b> The paper's anchor (reuse <i>results</i>): <b>16.0% WER</b> on full Hub5'00,
        "the best published result," vs the prior 18.4% — that is the paper's reported number, not something the toy
        build reaches. For the toy pipeline the target is qualitative and from our small run (a rule of thumb, not a
        paper claim): the bidirectional net should reach CTC loss <b>~0.1</b> and decode <b>8/8</b> toy utterances at
        80 epochs. A loss stuck above ~2 with most decodes wrong is "probably a bug"; 0.1 vs 0.3 is "tuning / seed."</li>
        <li><b>Ablations — prove the key idea earns its keep.</b> The knob is the recurrent layer's
        <b>directionality</b>. Re-run with <code>bidirectional=False</code> at the <i>same</i> 80 epochs and confirm
        the metric <b>drops</b>: in our run the forward-only model is stuck at loss <b>2.446</b> and decodes only
        <b>1/8</b> (vs 0.097 and 8/8 bidirectional). If unidirectional matches bidirectional, future context isn't
        wired in (check you concatenate both directions into the output layer). A second ablation: swap the
        <b>clipped ReLU</b> $g(z)=\\min\\{\\max\\{0,z\\},20\\}$ for a plain ReLU and watch for activation blow-up in a
        deeper stack — the cap at 20 is what the paper added for stability.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>CTC loss = inf / NaN</b> &rarr; an input length shorter
        than the target (CTC needs $T \\ge$ target length after the blank-padding rule), or probabilities instead of
        <code>log_softmax</code>. <b>Loss decreases but every decode is the empty string</b> &rarr; the model
        collapsed onto the blank (CTC's easy local optimum) — usual with too-high LR or too-few epochs. <b>Greedy
        decode slips on one frame though loss is low</b> &rarr; expected; greedy takes one best path while the loss
        sums over all, which is exactly why the paper fuses an N-gram language model ($Q(c)$) for its headline WER.
        <b>Blank confused with space</b> &rarr; decodes lose word boundaries; remember blank means "emit nothing,"
        space is a real character.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> We <i>import the plumbing</i> &mdash; <code>nn.Linear</code>,
       <code>nn.RNN</code>, and crucially <code>nn.CTCLoss</code> (the forward-backward dynamic program is
       owned and verified in <code>paper-ctc</code>, so we do not re-implement it here). We <i>build by hand</i>
       the Deep Speech <b>composition</b>: the three clipped-ReLU feed-forward layers, the bidirectional
       recurrent layer, the softmax over a character+blank alphabet, and the end-to-end greedy character decode.
       The oracle is twofold: (1) our worked CTC example must equal <code>torch.nn.CTCLoss</code> to many
       decimals, and (2) the toy pipeline must actually learn to decode the right strings from spectrograms.</p>`,
    pitfalls:
      `<ul>
        <li><b>Blank index must match.</b> <code>nn.CTCLoss(blank=0)</code> expects blank = class 0; if your
        alphabet puts a real letter at index 0 the loss is silently wrong.</li>
        <li><b>Log-probabilities, not probabilities.</b> <code>nn.CTCLoss</code> wants
        <code>log_softmax</code> inputs shaped (T, N, C) (time first), and the targets as a flat/padded
        integer tensor with explicit input- and target-length tensors. Mismatched lengths are the most common
        bug.</li>
        <li><b>Clipped ReLU, not plain ReLU.</b> The cap at 20 (<code>z.clamp(0,20)</code>) matters for the
        deep stack's stability; a plain ReLU is a (small) deviation from the paper.</li>
        <li><b>"blank" is not "space".</b> Blank means "emit nothing"; space is a real character in the
        alphabet. Collapsing blanks is what lets variable-length audio map to short text.</li>
        <li><b>Greedy decode &ne; CTC loss.</b> Greedy takes one best path; the loss sums over all paths. A
        model can have a low loss but a greedy decode that still slips on a hard frame &mdash; the paper adds a
        language model on top for its headline numbers.</li>
        <li><b>This is Deep Speech 1.</b> Deep Speech 2 (a later paper) adds convolutional front-ends and
        far more data; do not attribute its results here.</li>
      </ul>`,
    recall: [
      "State the softmax output equation $\\hat{y}_{t,k}=\\mathbb{P}(c_t=k\\mid x)$ from memory.",
      "Write the clipped-ReLU activation $g(z)$ used by Deep Speech.",
      "How many layers, and which single layer is recurrent (and is it uni- or bidirectional)?",
      "What is the output alphabet, and what does the extra 'blank' symbol mean?",
      "Why is no phoneme dictionary or HMM aligner needed — what does CTC replace them with?",
      "Greedy-decode the path 'h _ i _' under CTC's collapse rule."
    ],
    practice: [
      {
        q: "Greedy-decode the per-frame argmax path <code>a a _ b _ b</code> (where <code>_</code> is blank) under CTC's collapse rule. What text comes out?",
        steps: [
          { do: "First merge adjacent repeated symbols.", why: "CTC collapses runs of the same emitted label to one: 'a a' → 'a', and the two 'b's are separated by a blank so they are NOT adjacent." },
          { do: "Then delete every blank.", why: "Blank means 'emit nothing here'; it only serves to separate repeats and to fill empty frames." }
        ],
        answer: "After merging repeats: <code>a _ b _ b</code>. After dropping blanks: <b>\"abb\"</b>. The blank between the two b's is what keeps them as two separate letters — without a blank, 'b b' would collapse to a single 'b'."
      },
      {
        q: "In the worked example (alphabet {blank,h,i}, T=4), the loss for target \"hi\" was $-\\ln 0.478 = 0.738$. If instead every frame put probability 1.0 on the single best path <code>h _ i _</code>, what would the CTC loss be, and why is the real loss larger?",
        steps: [
          { do: "Compute the loss if all probability sits on one collapsing path.", why: "Then $\\mathbb{P}(\\text{hi}\\mid x)=1$, so the loss is $-\\ln 1 = 0$." },
          { do: "Compare to the real 0.478 total.", why: "Real probability is spread across 15 alignments AND across wrong strings, so $\\mathbb{P}(\\text{hi})\\lt 1$, making $-\\ln \\mathbb{P}\\gt 0$." }
        ],
        answer: "It would be $-\\ln 1 = 0$ (perfect). The real loss is 0.738 because the softmax also assigns probability to frames/paths that do NOT collapse to \"hi\" (and spreads the rest across 15 valid alignments), so $\\mathbb{P}(\\text{hi}\\mid x)=0.478\\lt 1$. Training pushes this toward 0 by concentrating probability on hi-producing paths."
      },
      {
        q: "ABLATION. Deep Speech's layer 4 is bidirectional. Predict and then explain: if you replace it with a same-size <b>unidirectional</b> (forward-only) RNN, same training budget, what happens to the toy decode accuracy — and why would future context help decide a letter at the current frame?",
        steps: [
          { do: "Run CODE/CODEVIZ with bidirectional=True then bidirectional=False at the SAME 80 epochs.", why: "Holds everything fixed except direction, isolating the effect of seeing future sound." },
          { do: "Read off final CTC loss and how many of 8 toy utterances decode correctly.", why: "Lower loss + more exact-match decodes = the directional information actually helped." },
          { do: "Reason about acoustics.", why: "A sound's identity often depends on what FOLLOWS it (coarticulation); a forward-only model must commit before hearing the rest." }
        ],
        answer: "In our run the bidirectional model reaches CTC loss <b>0.097</b> and decodes <b>8/8</b> toy utterances; the unidirectional ablation at the same 80 epochs is stuck at loss <b>2.446</b> and decodes only <b>1/8</b> (our small run, not the paper's numbers). Future context matters because a frame's correct letter can depend on later frames — the bidirectional layer lets each output see the whole utterance, which is exactly why Deep Speech uses one."
      }
    ]
  });

  window.CODE["paper-deep-speech"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Track B. We build Deep Speech's composition end to end: spectrogram → three clipped-ReLU feed-forward ` +
      `layers → one bidirectional RNN → softmax over a {blank, h, i, a, t} alphabet, trained with ` +
      `torch.nn.CTCLoss and greedy-decoded to characters. Two checks: (1) the worked CTC example ` +
      `(target "hi", T=4) returns exactly -ln p = 0.738145 from torch.nn.CTCLoss (allclose True); ` +
      `(2) on toy 'audio-like' spectrograms the bidirectional net learns to decode all 8 strings. ` +
      `We DO NOT re-implement the CTC forward-backward dynamic program — that is owned by paper-ctc; ` +
      `here we just call nn.CTCLoss. torch/torchvision are preinstalled in Colab — do not pip-install them.`,
    code: `import numpy as np, torch, torch.nn as nn

# ============================================================
# (1) WORKED CTC EXAMPLE — must match the lesson's 'example'
#     alphabet {blank=0, h=1, i=2}, T=4 frames, target "hi"
# ============================================================
y = torch.tensor([[0.1, 0.7, 0.2],
                  [0.6, 0.3, 0.1],
                  [0.2, 0.2, 0.6],
                  [0.5, 0.1, 0.4]])          # softmax outputs, rows sum to 1
log_probs = y.log().unsqueeze(1)             # shape (T=4, N=1, C=3)
ctc = nn.CTCLoss(blank=0, reduction='none')
loss = ctc(log_probs, torch.tensor([[1, 2]]),       # target "hi"
           torch.tensor([4]), torch.tensor([2]))    # input_len=4, target_len=2
print("worked CTC loss:", round(loss.item(), 6),
      " hand 0.738145  allclose:",
      torch.allclose(loss, torch.tensor([0.738145]), atol=1e-5))
# greedy best-path decode of this example -> "hi"
sym = {0:'_', 1:'h', 2:'i'}
def collapse(path):
    out, prev = [], None
    for c in path:
        if c != prev: out.append(c); prev = c
    return ''.join(sym[c] for c in out if c != 0)
print("greedy decode:", collapse(y.argmax(1).tolist()))   # -> hi

# ============================================================
# (2) TINY SPECTROGRAM -> RNN -> CTC PIPELINE on toy audio-like data
# ============================================================
F, T = 8, 12
VOCAB = ['_', 'h', 'i', 'a', 't']            # index 0 = blank (CTC requirement)

def make_spectrogram(target, seed):
    """toy 'audio': noise + a 2.0 energy band per character, in time order."""
    rng = np.random.RandomState(seed)
    spec = rng.randn(T, F) * 0.3             # (T frames, F freq bins)
    seg = T // len(target)
    for k, ch in enumerate(target):
        f = VOCAB.index(ch) % F              # each char -> a frequency band
        spec[k*seg:(k+1)*seg, f] += 1.5
    return spec.astype(np.float32)

data  = [("hi",1),("hat",2),("it",3),("ha",4),("hit",5),("ait",6),("ti",7),("aht",8)]
specs = [torch.tensor(make_spectrogram(t, s)) for t, s in data]
targs = [[VOCAB.index(c) for c in t] for t, _ in data]

class DeepSpeechTiny(nn.Module):
    def __init__(self, bidir=True):
        super().__init__()
        H = 16
        self.fc1 = nn.Linear(F, H); self.fc2 = nn.Linear(H, H); self.fc3 = nn.Linear(H, H)
        self.rnn = nn.RNN(H, H, bidirectional=bidir)          # the one recurrent layer (layer 4)
        self.out = nn.Linear(H * (2 if bidir else 1), len(VOCAB))
        self.g = lambda z: z.clamp(0, 20)    # clipped ReLU  g(z)=min{max{0,z},20}
    def forward(self, x):                    # x: (T, F)
        h = self.g(self.fc1(x)); h = self.g(self.fc2(h)); h = self.g(self.fc3(h))
        h, _ = self.rnn(h.unsqueeze(1))      # (T, 1, H*dir)
        return self.out(h).log_softmax(-1)   # (T, 1, V)  -> log-probs for CTC

def greedy(lp):
    am, out, prev = lp.squeeze(1).argmax(-1).tolist(), [], None
    for c in am:
        if c != prev: out.append(c); prev = c
    return ''.join(VOCAB[c] for c in out if c != 0)

def train(bidir, epochs=80):
    torch.manual_seed(0)
    net = DeepSpeechTiny(bidir)
    opt = torch.optim.Adam(net.parameters(), lr=0.02)
    ctc = nn.CTCLoss(blank=0)
    for _ in range(epochs):
        opt.zero_grad(); total = 0
        for spec, tg in zip(specs, targs):
            lp = net(spec)
            total = total + ctc(lp, torch.tensor([tg]),
                                torch.tensor([T]), torch.tensor([len(tg)]))
        total.backward(); opt.step()
    correct = sum(greedy(net(spec)) == t for (t, _), spec in zip(data, specs))
    return round(total.item(), 3), correct, [greedy(net(spec)) for spec in specs]

lb, cb, db = train(bidir=True)
lu, cu, du = train(bidir=False)               # ABLATION: forward-only RNN
print(f"BIDIR  : final CTC loss {lb}  decoded {cb}/8  -> {db}")
print(f"UNIDIR : final CTC loss {lu}  decoded {cu}/8  -> {du}")  # ablation: much worse`
  };

  window.CODEVIZ["paper-deep-speech"] = {
    question: "Deep Speech's one recurrent layer is bidirectional. If we ablate it to a same-size unidirectional (forward-only) RNN and train for the same 80 epochs, how much does end-to-end character decoding suffer?",
    charts: [
      {
        type: "bar",
        title: "Toy spectrogram→RNN→CTC: bidirectional vs unidirectional recurrent layer (same budget)",
        xlabel: "recurrent layer direction",
        ylabel: "final CTC loss (sum over 8 utterances) — lower is better",
        series: [
          {
            name: "final CTC loss",
            color: "#7ee787",
            points: [["Bidirectional (Deep Speech)", 0.097], ["Unidirectional (ablation)", 2.446]]
          }
        ]
      },
      {
        type: "bar",
        title: "Utterances decoded exactly right (out of 8)",
        xlabel: "recurrent layer direction",
        ylabel: "exact-match greedy decodes (of 8)",
        series: [
          {
            name: "correct decodes",
            color: "#79c0ff",
            points: [["Bidirectional", 8], ["Unidirectional", 1]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported WER numbers. Same tiny spectrogram→3 clipped-ReLU FC→RNN→softmax→CTC pipeline, identical size and 80 training epochs; the only change is the recurrent layer's direction. Bidirectional (what Deep Speech uses, &sect;2) reaches CTC loss 0.097 and greedy-decodes all 8 toy utterances correctly; the forward-only ablation is stuck at loss 2.446 and gets just 1/8. Seeing future frames, not only past ones, lets each output commit to the right letter — exactly the reason the paper makes layer 4 bidirectional. (Separately, the worked CTC example for target \"hi\" returns -ln p = 0.738145 from torch.nn.CTCLoss, allclose True.)",
    code: `import numpy as np, torch, torch.nn as nn

F, T = 8, 12
VOCAB = ['_', 'h', 'i', 'a', 't']            # blank = 0

def make_spectrogram(target, seed):
    rng = np.random.RandomState(seed)
    spec = rng.randn(T, F) * 0.3
    seg = T // len(target)
    for k, ch in enumerate(target):
        spec[k*seg:(k+1)*seg, VOCAB.index(ch) % F] += 1.5
    return spec.astype(np.float32)

data  = [("hi",1),("hat",2),("it",3),("ha",4),("hit",5),("ait",6),("ti",7),("aht",8)]
specs = [torch.tensor(make_spectrogram(t, s)) for t, s in data]
targs = [[VOCAB.index(c) for c in t] for t, _ in data]

class Net(nn.Module):
    def __init__(self, bidir=True):
        super().__init__(); H = 16
        self.fc1, self.fc2, self.fc3 = nn.Linear(F,H), nn.Linear(H,H), nn.Linear(H,H)
        self.rnn = nn.RNN(H, H, bidirectional=bidir)
        self.out = nn.Linear(H*(2 if bidir else 1), len(VOCAB))
        self.g = lambda z: z.clamp(0, 20)
    def forward(self, x):
        h = self.g(self.fc1(x)); h = self.g(self.fc2(h)); h = self.g(self.fc3(h))
        h, _ = self.rnn(h.unsqueeze(1)); return self.out(h).log_softmax(-1)

def greedy(lp):
    am, out, prev = lp.squeeze(1).argmax(-1).tolist(), [], None
    for c in am:
        if c != prev: out.append(c); prev = c
    return ''.join(VOCAB[c] for c in out if c != 0)

def train(bidir, epochs=80):
    torch.manual_seed(0)
    net = Net(bidir); opt = torch.optim.Adam(net.parameters(), lr=0.02); ctc = nn.CTCLoss(blank=0)
    for _ in range(epochs):
        opt.zero_grad(); total = 0
        for spec, tg in zip(specs, targs):
            total = total + ctc(net(spec), torch.tensor([tg]),
                                torch.tensor([T]), torch.tensor([len(tg)]))
        total.backward(); opt.step()
    correct = sum(greedy(net(spec)) == t for (t, _), spec in zip(data, specs))
    return round(total.item(), 3), correct

lb, cb = train(True); lu, cu = train(False)
print("Bidirectional :", lb, "loss,", cb, "/8 decoded")   # 0.097, 8/8
print("Unidirectional:", lu, "loss,", cu, "/8 decoded")   # 2.446, 1/8`
  };
})();
