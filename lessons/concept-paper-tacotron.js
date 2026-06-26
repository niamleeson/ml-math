/* Paper lesson — "Tacotron: Towards End-to-End Speech Synthesis"
   (Wang, Skerry-Ryan, Stanton, Wu, Weiss, Jaitly, Yang, Xiao, Chen, Bengio, Le,
   Agiomyrgiannakis, Clark, Saurous 2017). Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-tacotron".
   GROUNDED from arXiv:1703.10135 via the ar5iv HTML mirror (Abstract; Section 3
   Model Architecture — 3.1 CBHG, 3.2 Encoder, 3.3 Decoder, 3.4 Post-processing &
   waveform synthesis; Section 4 Model Details / Table 1; Section 5.2 MOS).
   Track B (architecture): build a tiny character -> spectrogram-frame attention
   seq2seq on toy data, train it, and VISUALIZE the monotonic alignment. The general
   content-based attention math lives in concept dl-attention; here we recap + ground
   it in the paper. Cross-links: paper-bahdanau-attention, paper-seq2seq. */
(function () {
  window.LESSONS.push({
    id: "paper-tacotron",
    title: "Tacotron — Towards End-to-End Speech Synthesis (2017)",
    tagline: "Map raw characters straight to a spectrogram with one attention seq2seq, then turn the spectrogram into sound with Griffin-Lim — no hand-built text-to-speech pipeline.",
    module: "Papers · Speech & Audio",
    track: "architecture",
    paper: {
      authors: "Yuxuan Wang, RJ Skerry-Ryan, Daisy Stanton, Yonghui Wu, Ron J. Weiss, Navdeep Jaitly, Zongheng Yang, Ying Xiao, Zhifeng Chen, Samy Bengio, Quoc Le, Yannis Agiomyrgiannakis, Rob Clark, Rif A. Saurous",
      org: "Google, Inc.",
      year: 2017,
      venue: "arXiv:1703.10135 (Mar 2017); Interspeech 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1703.10135",
      code: ""
    },
    conceptLink: "dl-attention",
    partOf: [],
    prereqs: ["dl-attention", "paper-bahdanau-attention", "paper-seq2seq", "dl-rnn", "dl-lstm-gru", "pt-rnn"],

    // WHY READ IT
    problem:
      `<p>A classic <b>text-to-speech</b> (TTS &mdash; turning written text into spoken audio) system was a
       <b>pipeline of separate stages</b>: a text-analysis frontend (which expands "Dr." to "doctor", marks
       stress, etc.), an <b>acoustic model</b> (which predicts sound features), and an <b>audio synthesis</b>
       module (a vocoder &mdash; software that turns sound features into a waveform). The paper's complaint
       (&sect;1):</p>
       <blockquote>"A text-to-speech synthesis system typically consists of multiple stages, such as a text
       analysis frontend, an acoustic model and an audio synthesis module. Building these components often
       requires extensive domain expertise and may contain brittle design choices." (Abstract)</blockquote>
       <p>Each stage is trained or tuned separately, so errors compound, and getting one to work needs linguist
       and signal-processing expertise. The dream was a single network trained end-to-end straight from
       (text, audio) pairs.</p>`,
    contribution:
      `<ul>
        <li><b>End-to-end TTS from characters.</b> "we present Tacotron, an end-to-end generative text-to-speech
        model that synthesizes speech directly from characters" (Abstract). One sequence-to-sequence
        (<b>seq2seq</b> &mdash; a network that reads one sequence and writes another) network with attention maps
        a <b>character</b> sequence to a sequence of <b>spectrogram frames</b> (a spectrogram is a picture of how
        much energy each sound frequency has over time; a frame is one short time slice of it).</li>
        <li><b>The CBHG encoder module.</b> A reusable block &mdash; "1-D convolution bank + highway network +
        bidirectional GRU" (&sect;3.1) &mdash; that reads the character embeddings into rich features for the
        attention to align against.</li>
        <li><b>Predict $r$ frames per decoder step.</b> Instead of one spectrogram frame at a time, the decoder
        emits a small block of $r$ frames at once, which "divides the total number of decoder steps by $r$,
        which reduces model size, training time, and inference time" (&sect;3.3).</li>
        <li><b>A simple Griffin-Lim vocoder.</b> The predicted spectrogram is turned into a waveform with the
        Griffin-Lim algorithm (a classic, training-free way to recover a waveform from a magnitude spectrogram).
        The authors stress this is a placeholder: "our choice of Griffin-Lim is for simplicity" (&sect;3.4).</li>
      </ul>`,
    whyItMattered:
      `<p>Tacotron showed a single attention seq2seq could replace a whole hand-built TTS pipeline and still
       sound natural &mdash; it reports a <b>3.82 mean opinion score</b> (a 5-point human naturalness rating;
       see Results) on US English, beating a production parametric system. It made the attention <b>alignment</b>
       the heart of TTS: the diagonal heatmap that maps characters to time is exactly the picture you debug when
       a TTS model "skips" or "repeats" words. The direct successor, <b>Tacotron 2</b>, kept this character
       &rarr; mel-spectrogram seq2seq and swapped the Griffin-Lim vocoder for a neural WaveNet vocoder &mdash;
       the foundation pattern (text &rarr; mel via attention, then a separate neural vocoder) behind most modern
       neural TTS.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Abstract &amp; &sect;1 (Introduction)</b> &mdash; the multi-stage-pipeline complaint and the
        end-to-end goal. One read.</li>
        <li><b>&sect;3 (Model Architecture)</b> &mdash; the three pieces: <b>encoder</b> (&sect;3.2), the
        <b>attention-based decoder</b> (&sect;3.3), and the <b>post-processing net + waveform synthesis</b>
        (&sect;3.4). Note the decoder uses "a content-based tanh attention decoder" and predicts the
        <b>80-band mel-scale spectrogram</b> as its target.</li>
        <li><b>&sect;3.3</b> for the two ideas you will implement: <b>content-based attention</b> (the same
        additive/tanh scorer as Bahdanau &mdash; cross-link paper-bahdanau-attention) and the <b>reduction
        factor $r$</b> (predict $r$ frames per step). Note the first step is conditioned on an all-zero
        <code>&lt;GO&gt;</code> frame.</li>
        <li><b>Fig. 1</b> &mdash; the full block diagram. <b>Fig. (alignment)</b> &mdash; the diagonal
        character-to-frame alignment, the picture you reproduce here.</li>
        <li><b>Table 1 (&sect;4)</b> &mdash; the hyperparameters (256-D char embedding, CBHG $K=16$, $r=2$,
        80-band mel target). <b>&sect;5.2</b> &mdash; the MOS result.</li>
       </ul>
       <p><b>Skim:</b> the CBHG internals (&sect;3.1) and the exact pre-net/highway sizes &mdash; they are
       plumbing around the core idea, which is "attention seq2seq from characters to spectrogram frames."</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a tiny <b>character &rarr; spectrogram-frame</b> attention seq2seq on toy data: each
       character is mapped to a short, fixed block of frames (so the toy "audio" for the word is the characters'
       frame-blocks laid end to end), and the model must reproduce the frame sequence from the characters.</p>
       <p>After training, you plot the <b>alignment matrix</b> $\\alpha$ (rows = decoder frame step $i$, columns
       = input character position $j$). Speech is read <b>left to right in order</b> &mdash; what shape do you
       expect the bright cells to form, and why is that different from, say, translation? Write your guess, then
       run it.</p>
       <p>(Hint: in TTS the output time index only ever moves <i>forward</i> through the characters &mdash; it
       never jumps back to an earlier letter.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the model you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Encoder:</b> <code>nn.Embedding</code> over the character vocabulary &rarr; a
        <code>nn.GRU(..., bidirectional=True)</code> giving one annotation $h_j$ per character (our tiny stand-in
        for the paper's CBHG encoder).</li>
        <li><b>Content-based attention</b> (same shape as Bahdanau): three linear maps <code>W</code> (on the
        decoder state $s$), <code>U</code> (on each annotation $h_j$), <code>v</code> (to one score).
        TODO &mdash; <b>score</b>: <code>e = v(tanh(W(s).unsqueeze(1) + U(H))).squeeze(-1)</code>;
        <b>normalize</b>: <code>alpha = softmax(e, dim=chars)</code>;
        <b>context</b>: <code>c = (alpha.unsqueeze(-1) * H).sum(chars)</code>.</li>
        <li><b>Decoder with reduction factor $r$:</b> at each step, from state $s$ and context $c$, a
        <code>nn.Linear</code> predicts a block of $r$ frames at once. First step is fed an all-zero
        <code>&lt;GO&gt;</code> frame; thereafter feed the previous (true, teacher-forced) frame block.</li>
        <li>TODO &mdash; store every $\\alpha_{i\\cdot}$; stacked, they are the alignment matrix you visualize.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Hold two sequences in mind. The <b>input</b> is the character string (length $T_x$); the encoder turns
       each character into an <b>annotation</b> $h_j$ (a vector summarizing that character in context). The
       <b>output</b> is a sequence of <b>spectrogram frames</b> (each frame is a short vector of frequency
       energies for one time slice). Tacotron is one attention seq2seq mapping the first to the second
       (&sect;3).</p>
       <p><b>1. Encoder (&sect;3.2).</b> Characters are embedded and passed through a <b>CBHG</b> module
       ("1-D convolution bank + highway network + bidirectional GRU", &sect;3.1) to produce the annotations
       $h_1,\\ldots,h_{T_x}$. In our toy build we replace CBHG with a single bidirectional GRU &mdash; the
       attention machinery is identical; CBHG just makes richer features.</p>
       <p><b>2. Attention-based decoder (&sect;3.3).</b> The decoder emits frames one block at a time. Before
       producing block $i$, it holds a state $s_{i-1}$ (its memory of the audio so far) and asks the same
       three-move attention question as Bahdanau (cross-link paper-bahdanau-attention):</p>
       <ol>
        <li><b>Score every character.</b> A <b>content-based tanh</b> scorer &mdash; the paper writes "we use a
        content-based tanh attention decoder" (&sect;3.3) &mdash; gives a scalar $e_{ij}=v^{\\top}\\tanh(W s_{i-1}+U h_j)$
        for each character $j$: "how relevant is character $j$ to the frame I am about to emit?"</li>
        <li><b>Normalize with softmax.</b> A softmax over the $T_x$ scores gives weights $\\alpha_{ij}\\ge 0$ that
        sum to 1 &mdash; a soft choice of which characters to read right now.</li>
        <li><b>Build the context.</b> $c_i=\\sum_j \\alpha_{ij}h_j$, the attention-weighted average of the
        character annotations.</li>
       </ol>
       <p>The decoder updates its state from $c_i$ and the previous output frame, then a linear layer maps
       $s_i$ to a block of <b>$r$ frames at once</b>. Predicting $r$ frames per step "divides the total number
       of decoder steps by $r$" (&sect;3.3), speeding training and inference; the paper uses $r=2$. The first
       step is conditioned on an all-zero <code>&lt;GO&gt;</code> frame.</p>
       <p><b>Why a spectrogram, not a waveform?</b> The seq2seq target is the <b>80-band mel-scale spectrogram</b>
       ("We use 80-band mel-scale spectrogram as the target", &sect;3.4) &mdash; far shorter and smoother than a
       raw waveform, so the attention can align it. The paper's reasoning: "The seq2seq target can be highly
       compressed as long as it provides sufficient intelligibility and prosody information for an inversion
       process" (&sect;3.4).</p>
       <p><b>3. Post-net + vocoder (&sect;3.4).</b> A post-processing net converts the mel target to a
       linear-scale spectrogram, and the <b>Griffin-Lim algorithm</b> turns that magnitude spectrogram into a
       waveform: "We use the Griffin-Lim algorithm to synthesize waveform from the predicted spectrogram"; they
       found "raising the predicted magnitudes by a power of 1.2 before feeding to Griffin-Lim reduces
       artifacts." The authors flag it as temporary: "our choice of Griffin-Lim is for simplicity" (&sect;3.4).</p>`,
    architecture:
      `<p>Tacotron is one attention seq2seq with three stages (&sect;3, Fig. 1); all sizes from Table 1 (&sect;4).</p>
       <p><b>1. Encoder (&sect;3.2) &mdash; characters &rarr; annotations $h_j$.</b></p>
       <ul>
        <li><b>Character embedding:</b> each character &rarr; a <b>256-D</b> embedding.</li>
        <li><b>Pre-net:</b> FC-256-ReLU &rarr; Dropout(0.5) &rarr; FC-128-ReLU &rarr; Dropout(0.5). A non-linear bottleneck that aids convergence and generalization.</li>
        <li><b>CBHG (&sect;3.1):</b> the encoder representation. In order:
          <ul>
            <li><b>C</b>onvolution <b>B</b>ank: $K=16$ sets of 1-D convolutions (the $k$-th set = filters of width $k$, 128 channels, ReLU), outputs stacked.</li>
            <li><b>Max-pool</b> along time, stride 1, width 2 (preserves time resolution, adds local invariance).</li>
            <li>Two conv projections (conv-3-128-ReLU &rarr; conv-3-128-Linear), then a <b>residual</b> add back to the pre-net output.</li>
            <li><b>H</b>ighway network: 4 layers of FC-128-ReLU (gated high-level features).</li>
            <li>Bidirectional <b>G</b>RU, 128 cells each direction &rarr; 256-D annotations $h_j$ (forward + backward context).</li>
          </ul>
        </li>
       </ul>
       <p><b>2. Attention-based decoder (&sect;3.3) &mdash; annotations &rarr; mel frames.</b> Per step $i$:</p>
       <ul>
        <li><b>Decoder pre-net</b> on the previous frame $y_{i-1}$ (same FC-256 &rarr; FC-128 with dropout). Step 0 is fed an all-zero $\\langle\\text{GO}\\rangle$ frame.</li>
        <li><b>Attention RNN:</b> a 1-layer GRU (256 cells) produces the attention query $s_{i-1}$.</li>
        <li><b>Content-based tanh attention:</b> score every annotation, softmax over characters, build context $c_i=\\sum_j\\alpha_{ij}h_j$.</li>
        <li><b>Decoder RNN:</b> concat $[c_i;\\,\\text{attn-RNN output}]$ into a 2-layer GRU (256 cells) with vertical residual connections.</li>
        <li><b>Output:</b> a linear layer emits $r$ <b>(=2)</b> frames of the <b>80-band mel</b> spectrogram at once, dividing the step count by $r$.</li>
       </ul>
       <p><b>3. Post-processing net + vocoder (&sect;3.4) &mdash; mel &rarr; waveform.</b></p>
       <ul>
        <li><b>Post-net:</b> a second CBHG ($K=8$) sees the whole decoded mel sequence (forward + backward) and converts it to a <b>linear-scale</b> magnitude spectrogram, correcting decoder errors.</li>
        <li><b>Griffin-Lim:</b> a training-free iterative algorithm reconstructs the waveform from that magnitude spectrogram; magnitudes are raised to the power <b>1.2</b> first to reduce artifacts. (A deliberate placeholder, &sect;3.4.)</li>
       </ul>
       <p><b>Training (&sect;4):</b> end-to-end with an $\\ell_1$ loss on the mel target plus an $\\ell_1$ loss on the linear post-net target (equal weights), Adam with learning-rate decay (0.001 &rarr; 0.0001).</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input character sequence</b> (the text, one symbol per character), of length $T_x$." },
      { sym: "$T_x$", desc: "the <b>number of input characters</b> &mdash; and hence the number of annotations $h_j$ the encoder produces." },
      { sym: "$h_j$", desc: "the <b>encoder annotation</b> for character position $j$: a vector summarizing character $j$ in context. Tacotron produces these with a CBHG module; our toy build uses a bidirectional GRU." },
      { sym: "$H$", desc: "the <b>full matrix of encoder annotations</b>, with column $j$ equal to $h_j$ &mdash; the CBHG output the attention reads over." },
      { sym: "$P$", desc: "the <b>input to a CBHG module</b> (the pre-net output in the encoder): the sequence the convolution bank, highway, and bidirectional GRU process." },
      { sym: "$K$", desc: "the <b>number of filter widths in the CBHG convolution bank</b>: the $k$-th set has filters of width $k$ for $k=1,\\ldots,K$ ($K=16$ in the encoder, $K=8$ in the post-net, &sect;3.1)." },
      { sym: "$\\|$", desc: "<b>concatenation</b> &mdash; here, stacking the $K$ convolution-bank outputs together along the channel axis (&sect;3.1)." },
      { sym: "$\\hat{Y}, Y$", desc: "the <b>predicted</b> and <b>ground-truth mel-scale spectrograms</b> (the seq2seq target); $\\hat{Y}$ is what the decoder emits, $Y$ is the L1 target (&sect;4)." },
      { sym: "$\\hat{Z}, Z$", desc: "the <b>predicted</b> and <b>ground-truth linear-scale magnitude spectrograms</b> (the post-net target); $\\hat{Z}$ is fed to Griffin-Lim, $Z$ is the second L1 target (&sect;4)." },
      { sym: "$\\mathcal{L}$", desc: "the <b>total training loss</b>: the $\\ell_1$ error on the mel target plus the $\\ell_1$ error on the linear target, with equal weights (&sect;4)." },
      { sym: "$y_i$", desc: "the <b>$i$-th output block</b>: a group of $r$ spectrogram frames emitted at decoder step $i$ (each frame is a vector of per-frequency energies for one time slice)." },
      { sym: "$r$", desc: "the <b>reduction factor</b>: how many spectrogram frames the decoder predicts per step. Larger $r$ means fewer decoder steps. The paper uses $r=2$ (&sect;3.3, Table 1)." },
      { sym: "$s_{i-1}$", desc: "the <b>decoder hidden state</b> just before emitting block $i$ &mdash; the decoder's running memory of the audio produced so far; it is the query that decides which characters to read." },
      { sym: "$e_{ij}$", desc: "the <b>alignment (content) score</b>: how relevant character $j$ is to output step $i$, from the content-based tanh scorer (&sect;3.3)." },
      { sym: "$\\alpha_{ij}$", desc: "the <b>attention weight</b> character $j$ receives at output step $i$: $e_{ij}$ through a softmax, so $\\alpha_{ij}\\ge 0$ and $\\sum_j\\alpha_{ij}=1$. The matrix of these is the alignment heatmap &mdash; near-diagonal for speech." },
      { sym: "$c_i$", desc: "the <b>context vector</b> for output step $i$: the attention-weighted average $\\sum_j\\alpha_{ij}h_j$ of character annotations. Recomputed every step." },
      { sym: "$W, U, v$", desc: "the <b>learned weights</b> of the content-based scorer: $W$ maps the decoder state, $U$ maps each annotation, $v$ collapses to one scalar score (same additive form as Bahdanau)." },
      { sym: "$\\langle\\text{GO}\\rangle$", desc: "the <b>all-zero start frame</b> the first decoder step is conditioned on (&sect;3.3) &mdash; the seq2seq 'begin generating' token for frames." },
      { sym: "“mel-scale spectrogram”", desc: "a plain term: a spectrogram (energy per frequency over time) whose frequency axis is warped to the <b>mel scale</b>, which spaces frequencies the way human hearing does. Tacotron's seq2seq target is an 80-band mel spectrogram." },
      { sym: "“Griffin-Lim”", desc: "a plain term: a classic, training-free iterative algorithm that recovers a time-domain <b>waveform</b> from a magnitude spectrogram by guessing and refining the missing phase. Tacotron's (placeholder) vocoder." },
      { sym: "“softmax”", desc: "a plain term: turns a list of real scores into positive numbers that sum to 1 (exponentiate, then divide by the total) &mdash; here it converts alignment scores into attention weights." }
    ],
    formula: `$$ H = \\mathrm{CBHG}\\big(\\mathrm{prenet}(\\mathrm{Embed}(x))\\big), \\qquad h_j = H_{:,j} $$
       <p>Encoder (&sect;3.2): characters $x$ are embedded, passed through a pre-net, then a CBHG module, giving one annotation $h_j$ per character.</p>
       $$ \\mathrm{CBHG}(P) = \\mathrm{BiGRU}\\Big(\\mathrm{Highway}\\big(\\underbrace{\\mathrm{Conv1D}_{1\\times3}\\big(\\mathrm{MaxPool}_{s=1}(\\,\\|_{k=1}^{K}\\,\\mathrm{Conv1D}_{k}(P))\\big) + P}_{\\text{conv bank} \\to \\text{pool} \\to \\text{proj} + \\text{residual}}\\big)\\Big) $$
       <p>The CBHG module (&sect;3.1): a bank of $K$ 1-D convolutions (the $k$-th set has filters of width $k$) is concatenated ($\\|$), max-pooled with stride 1, projected, added back to the input $P$ via a residual connection, run through a highway network, and topped with a bidirectional GRU.</p>
       $$ e_{ij} = v^{\\top}\\tanh\\!\\big(W s_{i-1} + U h_j\\big) \\qquad \\alpha_{ij} = \\frac{\\exp(e_{ij})}{\\sum_{k=1}^{T_x}\\exp(e_{ik})} \\qquad c_i = \\sum_{j=1}^{T_x}\\alpha_{ij}\\,h_j $$
       <p>Content-based tanh attention (&sect;3.3): score each character $j$ against decoder query $s_{i-1}$, softmax over the $T_x$ characters, then context = weighted average of annotations. Same additive form as Bahdanau.</p>
       $$ s_i = \\mathrm{DecoderRNN}\\big([\\,c_i\\,;\\,\\mathrm{prenet}(y_{i-1})\\,],\\, s_{i-1}\\big), \\qquad \\hat{y}_i = \\mathrm{Linear}(s_i) \\in \\mathbb{R}^{r\\times 80}, \\qquad y_0 = \\mathbf{0}\\;(\\langle\\text{GO}\\rangle) $$
       <p>Decoder step (&sect;3.3): concatenate context $c_i$ with the pre-net of the previous frame, update a stack of residual GRUs, and a linear layer emits a block of $r$ mel frames at once; the first step is fed an all-zero $\\langle\\text{GO}\\rangle$ frame. The paper uses $r=2$, 80 mel bands.</p>
       $$ \\hat{Z} = \\mathrm{CBHG}_{\\text{post}}(\\hat{Y}), \\qquad \\text{waveform} = \\mathrm{GriffinLim}\\big(\\hat{Z}^{\\,1.2}\\big) $$
       <p>Post-processing net + vocoder (&sect;3.4): a CBHG converts the predicted mel spectrogram $\\hat{Y}$ to a linear-scale magnitude spectrogram $\\hat{Z}$, then Griffin-Lim reconstructs a waveform; magnitudes are raised to the power 1.2 first to reduce artifacts.</p>
       $$ \\mathcal{L} = \\underbrace{\\|\\hat{Y} - Y\\|_1}_{\\text{mel (seq2seq)}} + \\underbrace{\\|\\hat{Z} - Z\\|_1}_{\\text{linear (post-net)}} $$
       <p>Training loss (&sect;4): a simple $\\ell_1$ (mean-absolute-error) loss on both the mel-scale seq2seq target and the linear-scale post-net target, with equal weights.</p>`,
    whatItDoes:
      `<p>These are the three steps of <b>content-based attention</b> (&sect;3.3) &mdash; the same
       "score &rarr; softmax &rarr; weighted sum" skeleton as Bahdanau, here mapping <i>characters</i> to
       <i>spectrogram frames</i>.</p>
       <p><b>Score</b> (left): for output frame step $i$ and character $j$, push the decoder state $s_{i-1}$ and
       the annotation $h_j$ through a one-hidden-layer tanh network and dot with $v$ to get a relevance score
       $e_{ij}$. It is "content-based" because the score depends on the <i>contents</i> of $s$ and $h$, not on
       position alone.</p>
       <p><b>Normalize</b> (middle): a softmax over the $T_x$ character scores turns them into weights
       $\\alpha_{ij}$ that are non-negative and sum to 1 &mdash; a soft selection over characters.</p>
       <p><b>Read</b> (right): the context $c_i=\\sum_j\\alpha_{ij}h_j$ is the weighted average of character
       annotations. Each output frame-block gets its own $c_i$, so as $i$ advances through the audio, the
       attention slides forward through the characters &mdash; the diagonal alignment.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the general attention math lives in the dl-attention concept lesson, and its
       paper grounding in paper-bahdanau-attention.</b> The only thing to convince yourself of here is
       <i>why softmax</i> and <i>why a weighted sum</i>, plus what is special about TTS alignment.</p>
       <p>We want the context to be a <b>differentiable, soft pick</b> from the character annotations, not a hard
       "choose exactly one." A hard pick (an argmax) has zero gradient almost everywhere, so the scorer could
       never learn. Softmax is the smooth relaxation: a full probability distribution over characters that is
       differentiable everywhere, so gradients flow back into $W,U,v$. Given that distribution, the natural
       summary is the <b>expected annotation</b> $\\mathbb{E}_{j\\sim\\alpha_{i\\cdot}}[h_j]=\\sum_j\\alpha_{ij}h_j$
       &mdash; exactly the context.</p>
       <p>What is special about <b>speech</b>: the output frames are read off the characters strictly
       <b>left to right, monotonically</b> &mdash; output time only moves forward, never jumping back to an
       earlier letter. So a healthy Tacotron's alignment is a <b>near-diagonal</b> band, unlike translation where
       attention can reorder words. The full vanishing-argmax argument and additive-vs-dot-product comparison are
       in dl-attention; we recap the shape and ground it in the paper's content-based decoder.</p>`,
    example:
      `<p>Work one attention step by hand with tiny vectors so "score &rarr; softmax &rarr; context" is concrete.
       Imagine the decoder is partway through the audio and is reading the second of three input characters. Take
       3 character annotations (2-dimensional) and a 2-dimensional decoder state:</p>
       <p>$$ h_1 = [1,0],\\quad h_2 = [0,1],\\quad h_3 = [1,1], \\qquad s = [0.5,\\,-0.5]. $$</p>
       <p>Use the content-based scorer $e_j = v^{\\top}\\tanh(W s + U h_j)$ with tiny weights
       $W = \\begin{bmatrix}0.5 & 0\\\\0 & 0.5\\end{bmatrix}$, $U = \\begin{bmatrix}1 & 0\\\\0 & 1\\end{bmatrix}$
       (identity), and $v = [1,1]$. Note $W s = [0.25,\\,-0.25]$ for every $j$.</p>
       <ul class="steps">
        <li><b>Score each character.</b>
        <ul>
          <li>$j=1$: $\\tanh([0.25,-0.25]+[1,0]) = \\tanh([1.25,-0.25]) = [0.848,\\,-0.245]$; $e_1 = 0.848-0.245 = \\mathbf{0.603}$.</li>
          <li>$j=2$: $\\tanh([0.25,-0.25]+[0,1]) = \\tanh([0.25,0.75]) = [0.245,\\,0.635]$; $e_2 = 0.245+0.635 = \\mathbf{0.880}$.</li>
          <li>$j=3$: $\\tanh([0.25,-0.25]+[1,1]) = \\tanh([1.25,0.75]) = [0.848,\\,0.635]$; $e_3 = 0.848+0.635 = \\mathbf{1.483}$.</li>
        </ul></li>
        <li><b>Softmax to weights.</b> $\\exp(e) = [1.828,\\,2.411,\\,4.408]$, summing to $8.647$, so
        $\\alpha = [0.211,\\,0.279,\\,0.510]$ (they sum to 1). Character 3 wins the most weight here.</li>
        <li><b>Weighted-sum context.</b>
        $c = 0.211\\,[1,0] + 0.279\\,[0,1] + 0.510\\,[1,1] = [0.211+0.510,\\;\\,0.279+0.510] = [\\mathbf{0.721},\\,\\mathbf{0.789}]$.</li>
       </ul>
       <p>So at this step the decoder reads mostly character 3 (weight 0.51) with some of 1 and 2, and gets
       context $[0.721,\\,0.789]$. In a trained Tacotron the weight would peak on whichever character the current
       frame belongs to, and that peak marches rightward as $i$ grows &mdash; the diagonal. These exact numbers
       are recomputed in the notebook's first cell so you can check the block by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Encoder.</b> Embed characters (<code>nn.Embedding</code>) and run a bidirectional RNN
        (<code>nn.GRU(..., bidirectional=True)</code>) to get one annotation $h_j$ per character. (This stands in
        for the paper's CBHG module.)</li>
        <li><b>Content-based attention block.</b> Three linear maps $W$ (on $s_{i-1}$), $U$ (on $H$), $v$ (to a
        scalar). Score $e=v^{\\top}\\tanh(Ws+UH)$; normalize $\\alpha=\\mathrm{softmax}(e)$ over characters;
        read $c=\\sum_j\\alpha_{ij}h_j$.</li>
        <li><b>Decoder loop with reduction factor $r$.</b> Start from an all-zero <code>&lt;GO&gt;</code> frame.
        At each step: compute $(c_i,\\alpha_{i\\cdot})$ from the current state, feed
        $[\\text{prev frame}; c_i]$ into a GRU cell to get $s_i$, and a <code>nn.Linear</code> maps $s_i$ to a
        block of <b>$r$ frames</b>. Teacher-force: feed the true previous frame block. <b>Store every
        $\\alpha_{i\\cdot}$</b> &mdash; stacked, they are the alignment matrix.</li>
        <li><b>Train</b> on the toy character &rarr; frame task with an $\\ell_1$ (mean-absolute-error)
        regression loss on the frames (the paper uses "simple $\\ell_1$ loss", &sect;4).</li>
        <li><b>Visualize</b> the alignment matrix $\\alpha$ &mdash; expect a near-diagonal, monotonic band.
        <b>Ablate:</b> replace attention with a single fixed context (the last encoder annotation for every
        step) and watch the frame error rise and the diagonal vanish.</li>
      </ol>`,
    results:
      `<p>From the paper (Abstract; &sect;5.2). The headline naturalness number: "Tacotron achieves a
       <b>3.82 subjective 5-scale mean opinion score</b> on US English, outperforming a production parametric
       system in terms of naturalness" (Abstract). The <b>mean opinion score</b> (MOS) is the average of human
       ratings of naturalness on a 1&ndash;5 scale, higher is better. Key hyperparameters (Table 1, &sect;4):
       256-D character embedding, CBHG with $K=16$ convolution filters, reduction factor $r=2$, 80-band mel-scale
       spectrogram target, trained with a simple $\\ell_1$ loss and Adam.</p>
       <p><i>These are the paper's reported figures, quoted from the Abstract and Table 1. The numbers in the
       CODEVIZ panel below are from our own tiny toy run &mdash; not the paper's results, and our "audio" is
       synthetic, not real speech.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> Two complementary checks. (a) <b>Reconstruction:</b> the
        $\\ell_1$ (mean-absolute-error) loss between predicted and target spectrogram frames &mdash; the
        same objective the paper trains on (&sect;4); the trivial baseline is predicting a constant
        (e.g. the mean frame), whose $\\ell_1$ your model must beat. (b) <b>Alignment health:</b> read the
        attention matrix $\\alpha$ &mdash; for real TTS the gold metric is the human <b>mean opinion score</b>,
        and the paper reports <b>3.82 MOS</b> on US English, beating a production parametric system (quoted in
        <code>results</code>); our toy stops at frames + alignment, not audio/MOS. "No skill" for alignment is a
        flat/uniform $\\alpha$ (every character weighted $1/T_x$, no diagonal).</p>
       <p><b>2. Sanity checks BEFORE the full run.</b></p>
       <ul>
        <li>Reproduce the worked attention step: $h_1=[1,0]$, $h_2=[0,1]$, $h_3=[1,1]$, $s=[0.5,-0.5]$ with the
        given $W,U,v$ must give $e=[0.603,0.880,1.483]$, $\\alpha=[0.211,0.279,0.510]$, $c=[0.721,0.789]$.
        A mismatch points to a wrong softmax axis or scorer wiring.</li>
        <li>Check shapes/ranges: each alignment row is a softmax over the $T_x$ <b>characters</b> and must sum
        to 1; the predicted frame block has shape $r\\times$ frame-dim; the decoder runs exactly
        $\\text{num\\_frames}/r$ steps.</li>
        <li>Confirm the first step is fed the all-zero $\\langle\\text{GO}\\rangle$ frame, and that the context
        $c_i$ is <b>recomputed every step</b> (not reused).</li>
        <li>Overfit a single tiny utterance: the frame $\\ell_1$ should fall toward $0$ and a clean diagonal
        should appear &mdash; proof the attention is actually learning to align.</li>
       </ul>
       <p><b>3. Expected range.</b> On the toy character&rarr;frame task the attention model should reach a low
        frame $\\ell_1$ and a clearly near-diagonal, monotonic $\\alpha$ (our small run: brightest cell on the
        matching character each row, e.g. step 0&rarr;char0 $\\approx 0.84$, in <code>results</code>/CODEVIZ &mdash;
        not a paper number). A scattered or vertical-stripe heatmap is a bug, not tuning. For real Tacotron, anchor
        naturalness to the paper's $\\approx 3.82$ MOS (approximate, see <code>results</code>).</p>
       <p><b>4. Ablation &mdash; prove the idea earns its keep.</b> The central mechanism is the <b>content-based
        attention</b> itself. Replace the per-step context with a <b>single fixed vector</b> (the last encoder
        annotation, <code>attend=False</code>) and retrain: the frame $\\ell_1$ must <b>rise</b> (later frames
        worst) and the diagonal must <b>vanish</b> &mdash; one vector cannot tell the decoder which character the
        current frame belongs to. If error and alignment barely change, attention wasn't actually driving the
        decoder.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Identical alignment rows / no diagonal</b> &rarr; the context was computed once and reused instead
        of recomputed each step (collapses to plain seq2seq).</li>
        <li><b>Rows don't sum to 1 / heatmap looks transposed</b> &rarr; softmax taken over the wrong axis (batch
        or hidden) instead of over characters.</li>
        <li><b>Non-monotonic, scattered alignment</b> &rarr; the model is "skipping" or "repeating" &mdash; the
        TTS analogue of a broken attention; real speech alignment should march strictly rightward.</li>
        <li><b>Shape error in the decoder loop</b> &rarr; mismatched step count vs frame count from the reduction
        factor $r$, or the wrong $\\langle\\text{GO}\\rangle$ frame shape at step 0.</li>
        <li><b>Loss NaN / stuck high</b> &rarr; LR too high, or feeding garbage instead of the zero start frame.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the RNN/embedding primitives ship in PyTorch, so you
       <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Embedding</code>,
       <code>nn.GRU</code> / <code>nn.GRUCell</code>, <code>nn.Linear</code>, <code>torch.softmax</code>, the
       optimizer (all preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the content-based attention
       block, the decoder loop that recomputes the context each step, predicts <b>$r$ frames per step</b>, and
       stores the alignment; and the <b>ablation</b> that swaps attention for one fixed context. <b>Simplified
       vs the paper:</b> we use a bidirectional GRU in place of CBHG, regress toy frames instead of real
       80-band mel, and skip the post-net + Griffin-Lim vocoder &mdash; the goal here is to make the
       character&rarr;frame attention <b>alignment</b> visible, which is the paper's central mechanism.</p>`,
    pitfalls:
      `<ul>
        <li><b>Softmax over the wrong axis.</b> The weights must normalize across <b>character positions</b>
        (the $T_x$ axis), not across the batch or hidden dimension. If your heatmap rows do not each sum to 1,
        you softmaxed the wrong dimension. <b>Fix:</b> <code>softmax(e, dim=char_axis)</code>.</li>
        <li><b>Recomputing the context only once.</b> $c_i$ must <b>change every decoder step</b> because
        $s_{i-1}$ changes; reusing one context silently reduces you to plain seq2seq and the alignment heatmap
        gets identical rows (no diagonal).</li>
        <li><b>Forgetting the reduction factor $r$.</b> The decoder predicts $r$ frames per step, so it runs
        <code>num_frames / r</code> steps, and the last fed-back frame for the next step is the <i>last</i> frame
        of the previous block. Mismatching the step count and the frame count is the classic shape bug.</li>
        <li><b>Forgetting the all-zero <code>&lt;GO&gt;</code> frame.</b> The first decoder step has no previous
        output, so it must be fed a zero frame (&sect;3.3). Feeding garbage or the wrong shape there breaks the
        whole rollout.</li>
        <li><b>Expecting a vocoder from this toy.</b> We visualize the alignment and regress frames; we do
        <b>not</b> run Griffin-Lim or produce audio. The paper's mel &rarr; linear post-net and Griffin-Lim are
        a separate stage (&sect;3.4) deliberately out of scope here.</li>
        <li><b>Non-monotonic alignment = a broken model.</b> Unlike translation, healthy TTS attention is
        near-diagonal and monotonic; if it scatters, the synthesized speech skips or repeats words.</li>
      </ul>`,
    recall: [
      "What does Tacotron's attention seq2seq map: input symbols to what target?",
      "Write the content-based score $e_{ij}$, the softmax weight $\\alpha_{ij}$, and the context $c_i$.",
      "What is the reduction factor $r$, and what does predicting $r$ frames per step buy you?",
      "Why is the seq2seq target a mel-spectrogram and not a raw waveform?",
      "What turns the predicted spectrogram into a waveform, and why do the authors call it a placeholder?",
      "Why should a healthy TTS alignment heatmap be near-diagonal and monotonic?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working character &rarr; frame attention model whose alignment is a
            bright monotonic diagonal. Replace the per-step attention with a <b>single fixed context</b> (use the
            last encoder annotation for every decoder step, plain-seq2seq style) and retrain. What happens to the
            frame reconstruction error and to the alignment, and what does that demonstrate?`,
        steps: [
          { do: `Swap the attention call for a fixed vector: set <code>c_i = H[:, -1, :]</code> for every output step, deleting the score/softmax/weighted-sum.`, why: `An honest ablation changes exactly one thing &mdash; the attention &mdash; so any difference is attributable to it. This recreates the fixed-length bottleneck end-to-end TTS needs attention to avoid.` },
          { do: `Retrain with everything else identical and measure the frame $\\ell_1$ error; also try to plot an alignment matrix.`, why: `With no per-step weights there is no alignment to plot, and one vector must carry every character at once.` },
          { do: `Compare: the attention model reconstructs frames well with a near-diagonal heatmap; the fixed-context model has higher error (later frames worst) and no usable alignment.`, why: `The single vector cannot say "which character does the current frame belong to," so the decoder cannot track its position in the text.` }
        ],
        answer: `<p>Frame error <b>rises</b> (later frames suffer most) and the alignment structure
                 <b>disappears</b> &mdash; there are no per-step weights to form a diagonal. Since the two models
                 differ only in "per-step attention vs one fixed context," this isolates attention as the reason
                 the decoder can track which character each frame belongs to. It reproduces Tacotron's premise:
                 attention is what lets a single seq2seq go from characters to a spectrogram.</p>`
      },
      {
        q: `Your worked example had $\\alpha=[0.211,0.279,0.510]$ and annotations $h_1=[1,0]$, $h_2=[0,1]$,
            $h_3=[1,1]$, giving context $c=[0.721,0.789]$. Suppose at this step the scores were so extreme that
            softmax returned $\\alpha=[0,0,1]$. What is the context, and what does that mean for TTS alignment?`,
        steps: [
          { do: `Plug into the context sum: $c = 0\\cdot[1,0]+0\\cdot[0,1]+1\\cdot[1,1] = [1,1]$.`, why: `A one-hot $\\alpha$ makes the context equal a single annotation &mdash; here $h_3$ exactly.` },
          { do: `Note this is "read exactly character 3" &mdash; a perfectly sharp, hard alignment for this frame.`, why: `Softmax attention contains hard alignment as its sharp limit; a near-one-hot diagonal is exactly the picture a clean TTS model produces.` },
          { do: `Contrast with the real $\\alpha=[0.211,0.279,0.510]$ giving $c=[0.721,0.789]$: a soft blend, mostly $h_3$.`, why: `Early in training the weights are soft (gradients can flow); as it learns, each frame's row sharpens onto its character, sliding rightward step by step.` }
        ],
        answer: `<p>With $\\alpha=[0,0,1]$ the context is $c=[1,1]=h_3$ &mdash; the frame reads exactly character
                 3. A trained Tacotron's alignment approaches a sharp diagonal of such near-one-hot rows that
                 moves forward as $i$ grows. So softmax attention is a soft, differentiable generalization of the
                 hard, monotonic character-to-frame alignment that speech needs.</p>`
      },
      {
        q: `The paper predicts <b>$r$ frames per decoder step</b> (it uses $r=2$). Suppose a toy clip has 12
            spectrogram frames. How many decoder steps run with $r=1$, $r=2$, and $r=4$, and what is the
            trade-off as $r$ grows?`,
        steps: [
          { do: `Decoder steps $= \\text{num frames} / r$. So $12/1=12$, $12/2=6$, $12/4=3$ steps.`, why: `Each step emits a block of $r$ frames, so larger $r$ means proportionally fewer steps &mdash; the paper: predicting $r$ frames "divides the total number of decoder steps by $r$."` },
          { do: `Note fewer steps means fewer attention computations and RNN unrollings: "reduces model size, training time, and inference time" (&sect;3.3).`, why: `Attention and recurrence cost scale with the number of decoder steps, so dividing steps by $r$ is a direct speedup.` },
          { do: `Note the cost: each step must now predict $r$ frames at once from one state, and the alignment advances $r$ frames per step, so very large $r$ can blur fine timing.`, why: `There is a sweet spot; the paper reports $r=2$ for its MOS result while noting larger $r$ (e.g. $r=5$) can also work.` }
        ],
        answer: `<p>With 12 frames: $r=1\\Rightarrow 12$ steps, $r=2\\Rightarrow 6$ steps, $r=4\\Rightarrow 3$
                 steps. Larger $r$ divides the decoder steps (and so attention/RNN work) by $r$ &mdash; less
                 model size and training/inference time &mdash; at the cost of each step having to predict a
                 bigger frame block and the alignment advancing in coarser jumps. The paper uses $r=2$.</p>`
      }
    ]
  });

  window.CODE["paper-tacotron"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny <b>character &rarr; spectrogram-frame</b> attention seq2seq &mdash; the
       core of Tacotron &mdash; and <b>plot the monotonic alignment</b>. We import <code>nn.Embedding</code> /
       <code>nn.GRU</code> / <code>nn.GRUCell</code> / <code>nn.Linear</code> and build by hand the content-based
       attention (<code>e = v(tanh(W(s).unsqueeze(1)+U(H)))</code>, <code>alpha = softmax(e, dim=1)</code>,
       <code>c = (alpha.unsqueeze(-1)*H).sum(1)</code>) and the decoder loop that emits <b>$r$ frames per step</b>
       from an all-zero <code>&lt;GO&gt;</code> start. Toy data: each character owns a fixed block of frames, so
       the target frame sequence is the characters' blocks laid end to end &mdash; the correct alignment is a
       clean diagonal. We then <b>ablate</b> attention with a single fixed context and watch the frame error rise
       and the diagonal vanish. The first cell recomputes the worked example
       ($\\alpha=[0.211,0.279,0.510]$, $c=[0.721,0.789]$). (We stop at the spectrogram; the paper's
       Griffin-Lim vocoder, &sect;3.4, is out of scope.) Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked attention step: score -> softmax -> context. ---
h = torch.tensor([[1.,0.], [0.,1.], [1.,1.]])      # 3 char annotations h_j (2-dim)
s = torch.tensor([0.5, -0.5])                       # decoder state s_{i-1}
W = torch.tensor([[0.5,0.],[0.,0.5]]); U = torch.eye(2); v = torch.tensor([1.,1.])
e = (v * torch.tanh(W @ s + h @ U.T)).sum(1)        # e_j = v^T tanh(W s + U h_j)
alpha = torch.softmax(e, dim=0)
c = (alpha.unsqueeze(-1) * h).sum(0)                # weighted sum
print("e     =", [round(x,4) for x in e.tolist()])      # [0.6034, 0.8801, 1.4834]
print("alpha =", [round(x,4) for x in alpha.tolist()])  # [0.2114, 0.2788, 0.5098]
print("context c =", [round(x,4) for x in c.tolist()])  # [0.7212, 0.7886]


# --- 1. Content-based (tanh) attention block (Tacotron §3.3; same form as Bahdanau). ---
VOCAB, FPC, FRAME, R, EMB, HID = 6, 3, 4, 1, 16, 32   # vocab, frames-per-char, frame dim, reduction r
NCHAR = 5                                              # chars per toy utterance
NFRAME = NCHAR * FPC                                   # total frames per utterance (= 15)

class Attention(nn.Module):
    def __init__(self, hid, ann):
        super().__init__()
        self.W = nn.Linear(hid, hid, bias=False)      # W s_{i-1}
        self.U = nn.Linear(ann, hid, bias=False)      # U h_j
        self.v = nn.Linear(hid, 1, bias=False)        # v^T
    def forward(self, s, H):                           # s:(N,hid)  H:(N,T_x,ann)
        e = self.v(torch.tanh(self.W(s).unsqueeze(1) + self.U(H))).squeeze(-1)  # score -> (N,T_x)
        alpha = torch.softmax(e, dim=1)               # normalize over CHARACTERS
        c = (alpha.unsqueeze(-1) * H).sum(1)          # weighted-sum context -> (N,ann)
        return c, alpha


# --- 2. Char encoder + frame decoder. attend=False -> fixed-context ablation. ---
class Encoder(nn.Module):                              # stands in for the paper's CBHG
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(VOCAB, EMB)
        self.rnn = nn.GRU(EMB, HID, batch_first=True, bidirectional=True)
    def forward(self, x):
        return self.rnn(self.emb(x))[0]               # annotations -> (N, T_x, 2*HID)

class Decoder(nn.Module):
    def __init__(self, attend=True):
        super().__init__()
        self.attend = attend
        self.attn = Attention(HID, 2*HID)
        self.cell = nn.GRUCell(FRAME + 2*HID, HID)    # in: prev frame + context
        self.out  = nn.Linear(HID, FRAME * R)         # predict R frames per step
    def forward(self, H):
        N = H.size(0)
        s    = torch.zeros(N, HID)
        prev = torch.zeros(N, FRAME)                  # <GO>: all-zero start frame
        frames, attns = [], []
        for _ in range(NFRAME // R):                  # NFRAME/R decoder steps
            if self.attend:
                c, a = self.attn(s, H)                # fresh context EVERY step
            else:
                c = H[:, -1, :]                        # ABLATION: one fixed vector
                a = torch.zeros(N, NCHAR)
            s = self.cell(torch.cat([prev, c], -1), s)
            blk = self.out(s).view(N, R, FRAME)        # R frames at once
            frames.append(blk); attns.append(a)
            prev = blk[:, -1, :]                        # feed last frame of the block
        return torch.cat(frames, 1), torch.stack(attns, 1)   # (N,NFRAME,FRAME), (N,steps,T_x)


# --- 3. Toy char->frame data: each char owns a fixed random frame-block; concat them. ---
torch.manual_seed(0)
CHAR_FRAMES = torch.randn(VOCAB, FPC, FRAME)           # the "pronunciation" of each character

def make(n):
    x = torch.randint(0, VOCAB, (n, NCHAR))            # char ids
    y = CHAR_FRAMES[x].reshape(n, NFRAME, FRAME)        # target frames = chars' blocks concatenated
    return x, y

def train(attend, epochs=40, N=2000):
    torch.manual_seed(0)
    enc, dec = Encoder(), Decoder(attend=attend)
    opt = torch.optim.Adam(list(enc.parameters()) + list(dec.parameters()), lr=3e-3)
    xb, yb = make(N)
    for ep in range(epochs):
        perm = torch.randperm(N)
        for i in range(0, N, 128):
            idx = perm[i:i+128]
            pred, _ = dec(enc(xb[idx]))
            loss = (pred - yb[idx]).abs().mean()        # l1 loss on frames (paper §4)
            opt.zero_grad(); loss.backward(); opt.step()
    xt, yt = make(400)
    with torch.no_grad():
        pred, attns = dec(enc(xt))
        err = (pred - yt).abs().mean().item()
        A = attns.mean(0)                               # avg alignment (steps x chars)
    return err, A

err, A = train(attend=True)
print("\\nATTENTION frame L1 error:", round(err, 4))
print("avg alignment (rows = decoder step, cols = char pos):")
for row in A.tolist(): print("  ", [round(x, 3) for x in row])

err0, _ = train(attend=False)
print("\\nFIXED-CONTEXT (ablation) frame L1 error:", round(err0, 4))
print("Attention gives a near-diagonal monotonic alignment and low error;")
print("the fixed-context model has higher error and no alignment structure.")
# (Exact numbers vary by hardware/seed; our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-tacotron"] = {
    question: "When a tiny char→spectrogram-frame attention seq2seq is trained on toy speech (each character owns a fixed frame-block), does the learned alignment α become the near-diagonal, MONOTONIC band that real Tacotron shows?",
    charts: [
      {
        type: "heatmap",
        title: "Learned alignment α — attention from each decoder frame-step onto each input character (toy TTS)",
        xlabel: "input character position j",
        ylabel: "decoder frame step i",
        xticks: ["char 0", "char 1", "char 2", "char 3", "char 4"],
        yticks: ["f 0-2", "f 3-5", "f 6-8", "f 9-11", "f 12-14"],
        matrix: [
          [0.842, 0.118, 0.026, 0.010, 0.004],
          [0.179, 0.690, 0.094, 0.025, 0.012],
          [0.041, 0.166, 0.671, 0.092, 0.030],
          [0.019, 0.048, 0.173, 0.652, 0.108],
          [0.011, 0.026, 0.061, 0.197, 0.705]
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers, and our 'audio' is synthetic, not real speech. A bidirectional-GRU char encoder + content-based-tanh-attention frame decoder (the core of Tacotron, §3.3) trained on a toy character→frame task (5 chars, 3 frames per char, reduction factor r=1 so each row groups its 3 frames) with an ℓ1 frame loss. The matrix is α averaged over 400 test utterances. It is clearly near-DIAGONAL and MONOTONIC: at frame step i the brightest cell sits on character i (step 0→char0 = 0.84, step 2→char2 = 0.67, step 4→char4 = 0.71, each its row's max), and the peak only ever moves RIGHTWARD as the audio advances — exactly the alignment shape Tacotron shows, because speech is read left-to-right in order. Each row is a softmax so it sums to 1. The fixed-context ablation (attention removed) has higher frame error and no such band — confirming the alignment is what lets a single seq2seq map characters to a spectrogram.",
    code: `import torch, torch.nn as nn

# Reproduces the qualitative effect: a learned, near-diagonal MONOTONIC char->frame alignment.
torch.manual_seed(0)
VOCAB, NCHAR, FPC, FRAME, EMB, HID, N = 6, 5, 3, 4, 16, 32, 2000
NFRAME = NCHAR * FPC

class Encoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb = nn.Embedding(VOCAB, EMB)
        self.rnn = nn.GRU(EMB, HID, batch_first=True, bidirectional=True)
    def forward(self, x): return self.rnn(self.emb(x))[0]

class Attention(nn.Module):
    def __init__(self):
        super().__init__()
        self.W = nn.Linear(HID, HID, bias=False)
        self.U = nn.Linear(2*HID, HID, bias=False)
        self.v = nn.Linear(HID, 1, bias=False)
    def forward(self, s, H):
        e = self.v(torch.tanh(self.W(s).unsqueeze(1) + self.U(H))).squeeze(-1)  # content score
        a = torch.softmax(e, dim=1)                                             # over chars
        return (a.unsqueeze(-1) * H).sum(1), a                                  # context, weights

class Decoder(nn.Module):
    def __init__(self):
        super().__init__()
        self.attn = Attention()
        self.cell = nn.GRUCell(FRAME + 2*HID, HID)
        self.out  = nn.Linear(HID, FRAME)               # r = 1 frame per step here
    def forward(self, H):
        n = H.size(0); s = torch.zeros(n, HID); prev = torch.zeros(n, FRAME)
        fr, at = [], []
        for _ in range(NFRAME):
            c, a = self.attn(s, H)
            s = self.cell(torch.cat([prev, c], -1), s)
            prev = self.out(s); fr.append(prev); at.append(a)
        return torch.stack(fr, 1), torch.stack(at, 1)

CHAR_FRAMES = torch.randn(VOCAB, FPC, FRAME)            # each char's fixed frame-block
def make(n):
    x = torch.randint(0, VOCAB, (n, NCHAR))
    return x, CHAR_FRAMES[x].reshape(n, NFRAME, FRAME)

enc, dec = Encoder(), Decoder()
opt = torch.optim.Adam(list(enc.parameters()) + list(dec.parameters()), lr=3e-3)
xb, yb = make(N)
for ep in range(40):
    perm = torch.randperm(N)
    for i in range(0, N, 128):
        idx = perm[i:i+128]
        pred, _ = dec(enc(xb[idx]))
        loss = (pred - yb[idx]).abs().mean()            # l1 frame loss (paper §4)
        opt.zero_grad(); loss.backward(); opt.step()

xt, yt = make(400)
with torch.no_grad():
    pred, attns = dec(enc(xt))
    err = (pred - yt).abs().mean().item()
    # collapse the 3 frames of each char-block into one row to read the char-level alignment:
    A = attns.mean(0).reshape(NCHAR, FPC, NCHAR).mean(1)
print("frame L1 error:", round(err, 4))
for row in A.tolist(): print([round(x, 3) for x in row])
# Near-diagonal & monotonic: frame step i attends to char i. Our run, not the paper's numbers.`
  };
})();
