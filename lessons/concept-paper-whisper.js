/* Paper lesson — "Robust Speech Recognition via Large-Scale Weak Supervision" (Whisper),
   Radford, Kim, Xu, Brockman, McLeavey, Sutskever 2022. OpenAI.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-whisper".
   GROUNDED from arXiv:2212.04356 (abstract page) and the ar5iv HTML mirror:
     - §2.1 Data: 680,000 hours of weakly-supervised audio; 117,000 h across 96 non-English
       languages; 125,000 h of X->English translation.
     - §2.2 Model: a plain encoder-decoder Transformer; 80-channel log-magnitude Mel spectrogram
       input (25 ms windows, 10 ms stride, 16 kHz), two-conv stem, sinusoidal (encoder) + learned
       (decoder) position embeddings.
     - §2.3 Multitask Format: the decoder special-token sequence (<|startoftranscript|>, language
       token, task token <|transcribe|>/<|translate|>, <|notimestamps|> or timestamp tokens,
       <|endoftext|>); timestamps quantized to 20 ms.
     - §3.3 / Table 2: robustness — averaged over many out-of-distribution datasets, far lower
       relative error than equally-accurate supervised LibriSpeech models.
   READ-ONLY track: Whisper's contribution is large-scale (680k-hour) weakly-supervised TRAINING,
   which is NOT reproducible here. NO training cell. A small CONCEPTUAL demo PARSES the multitask
   token sequence; CODEVIZ is a LABELED CONCEPTUAL chart (our illustration). Cross-links the
   Transformer (paper-transformer / mod-transformer). conceptLink is null. CODE.runnable false. */
(function () {
  window.LESSONS.push({
    id: "paper-whisper",
    title: "Whisper — Robust Speech Recognition via Large-Scale Weak Supervision (2022)",
    tagline: "Take a plain encoder-decoder Transformer, train it on 680,000 hours of weakly-labelled internet audio, and prompt it with special tokens so one model transcribes, translates, and detects the language — zero-shot.",
    module: "Papers · Speech & Audio",
    track: "read-only",
    paper: {
      authors: "Alec Radford, Jong Wook Kim, Tao Xu, Greg Brockman, Christine McLeavey, Ilya Sutskever",
      org: "OpenAI",
      year: 2022,
      venue: "arXiv:2212.04356 (Dec 2022); later ICML 2023",
      citations: "",
      arxiv: "https://arxiv.org/abs/2212.04356",
      code: "https://github.com/openai/whisper"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-transformer", "mod-transformer", "dl-attention", "dl-language-model", "dl-cross-entropy", "dl-beam-search"],

    // WHY READ IT
    problem:
      `<p>Before Whisper, the strongest <b>automatic speech recognition</b> (ASR — turning recorded speech into
       text) results came from one of two recipes, and both had a catch. <b>Recipe one: supervised training on a
       clean benchmark.</b> You take a carefully transcribed corpus — most famously <b>LibriSpeech</b>, about a
       thousand hours of read audiobooks — and train a model to map audio to its exact transcript. These models
       reach very low error on <i>that</i> benchmark. But the paper's central complaint (§1): they are
       <b>brittle</b>. Move them to a different microphone, accent, background noise, or recording style — anything
       <b>out of distribution</b> (data unlike the training set) — and the error rate jumps. The model learned the
       quirks of one dataset, not speech in general.</p>
       <p><b>Recipe two: self-supervised pre-training</b> (the wav2vec 2.0 line). Learn audio representations from
       huge amounts of <i>unlabelled</i> audio, then <b>fine-tune</b> on a small labelled set. This uses far more
       audio, but the unsupervised pre-training has no notion of <i>what was said</i>, so you still need a
       supervised fine-tuning step and a hand-built decoder — and the result is again tuned to one dataset. The
       open question the paper poses (§1): can we train directly on a <b>huge, messy, weakly-labelled</b> pile of
       audio-plus-transcript pairs scraped from the internet, skip fine-tuning entirely, and get a model that is
       <b>robust</b> — that works on data it has never seen — out of the box?</p>`,
    contribution:
      `<ul>
        <li><b>Large-scale weak supervision.</b> Whisper is trained on <b>680,000 hours</b> of audio paired with
        transcripts collected from the internet (§2.1). The labels are <i>weak</i> — automatically harvested, not
        gold-standard — but there are so many, and so varied, that the model learns general, robust speech-to-text
        instead of one benchmark's quirks. Of those hours, <b>117,000 are non-English</b> (96 languages) and
        <b>125,000 are X&rarr;English translation</b> pairs (§2.1).</li>
        <li><b>One plain encoder-decoder Transformer, many tasks.</b> The architecture is deliberately
        <i>ordinary</i> (§2.2): an off-the-shelf encoder-decoder Transformer fed a log-Mel spectrogram. The novelty
        is <b>not</b> a new layer — it is the <i>scale and weak supervision</i>, plus a <b>multitask token
        format</b> (§2.3) that turns transcription, translation, language identification, and timestamp prediction
        into one sequence the same decoder produces.</li>
        <li><b>Zero-shot robustness.</b> Because it never fine-tunes on any benchmark, Whisper is evaluated
        <b>zero-shot</b> — run as-is on each dataset. The paper's headline (§3): zero-shot Whisper approaches human
        accuracy and robustness, and on out-of-distribution data makes far fewer errors than supervised models that
        match it on LibriSpeech (§3.3, Table 2).</li>
      </ul>`,
    whyItMattered:
      `<p>From the abstract (quoted): "When scaled to 680,000 hours of multilingual and multitask supervision, the
       resulting models generalize well to standard benchmarks and are often competitive with prior fully
       supervised results but in a zero-shot transfer setting without the need for any fine-tuning. When compared
       to humans, the models approach their accuracy and robustness. We are releasing models and inference code to
       serve as a foundation for further work on robust speech processing."</p>
       <p>Whisper made a <b>single open model</b> that you can point at almost any audio — any language, clean or
       noisy, transcribe or translate — and get a usable transcript with no setup. The released checkpoints became
       the default ASR backbone for countless products and research projects, and the paper is the clearest
       demonstration that, for speech, <b>weakly-labelled scale beats clean-benchmark tuning</b> for robustness.
       It also popularized the idea of <b>steering one sequence model with special tokens</b> (language, task,
       timestamps) — the same prompt-as-control idea seen across modern multitask models.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>§2.1 (Data)</b> — how the 680,000 hours were collected and filtered. Note the <i>weak</i> in weak
        supervision: transcripts are scraped, not hand-checked, and machine-generated transcripts are filtered
        OUT so the model does not just learn to imitate another ASR system.</li>
        <li><b>§2.2 (Model)</b> — confirm it is a <b>plain encoder-decoder Transformer</b>. The audio front end is
        an <b>80-channel log-magnitude Mel spectrogram</b> (25 ms windows, 10 ms stride, 16 kHz); the encoder has a
        two-convolution stem then standard Transformer blocks. The point is how <i>little</i> is novel here.</li>
        <li><b>§2.3 (Multitask Format) and Figure 1</b> — the heart of this lesson. The single decoder produces a
        sequence of <b>special control tokens</b> followed by text. Read the exact order:
        <code>&lt;|startoftranscript|&gt;</code> &rarr; language token &rarr; task token
        (<code>&lt;|transcribe|&gt;</code> or <code>&lt;|translate|&gt;</code>) &rarr;
        <code>&lt;|notimestamps|&gt;</code> (or timestamp tokens) &rarr; the text &rarr;
        <code>&lt;|endoftext|&gt;</code>. This format is what makes one model do many tasks.</li>
        <li><b>§3.3 and Table 2</b> — the robustness result: average error over many out-of-distribution datasets,
        compared against supervised models matched on LibriSpeech.</li>
       </ul>
       <p><b>Skim:</b> §2.4–§2.5 (training hyperparameters and model sizes), §3.4–§3.9 (the long multilingual,
       translation, and human-comparison tables) unless you want the full empirical story, and §4–§6 (analysis,
       limitations, broader impacts). The mechanism you need is the data story and one token-format figure.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>This is a <b>read-only</b> lesson: Whisper's contribution is a <b>680,000-hour training run</b>, which we
       cannot reproduce in a notebook. So instead of training, you will reason about the <b>multitask token
       format</b> (§2.3) — the special-token sequence the decoder emits.</p>
       <p>Here is the question to commit to before the reveal. The <i>same</i> encoder-decoder model is asked to do
       very different jobs: transcribe German speech as German text, transcribe English, or translate Spanish
       speech into English text. The architecture and weights do not change between these jobs. <b>What, then,
       tells the model which job to do on a given clip?</b> Write your guess in one sentence — is it a separate
       model per task, a flag passed outside the sequence, or something inside the token stream itself?</p>`,
    attempt:
      `<p>Before the reveal, sketch the special-token sequence Whisper's decoder produces (§2.3). Fill in the
       <code>TODO</code>s with the tokens in the right order:</p>
       <ul>
        <li><b>Start.</b> Every sequence begins with a single start-of-transcript token. TODO: name it.</li>
        <li><b>Which language?</b> Next comes a <b>language token</b> — one of 99 — naming the spoken language.
        TODO: what does the model do with this slot when the language is unknown? (Hint: §2.3 lets the model
        <i>predict</i> it — that is zero-shot <b>language identification</b>, or LID.)</li>
        <li><b>Which task?</b> Then a <b>task token</b>: TODO: list the two options and say which one outputs text
        in the <i>same</i> language vs. <i>English</i>.</li>
        <li><b>Timestamps or not?</b> TODO: the token that says "just give text, no timing," versus emitting
        <b>timestamp tokens</b> (quantized to 20 ms) interleaved with the text.</li>
        <li><b>The text, then stop.</b> TODO: the text tokens, ending in the end-of-transcript token.</li>
       </ul>
       <p>The conceptual demo below parses exactly this sequence, so check your sketch against it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Whisper has two halves, exactly like the original Transformer (see the <b>paper-transformer</b> lesson):
       an <b>encoder</b> that reads the audio and a <b>decoder</b> that writes the text, with the decoder attending
       to the encoder (§2.2). The input is not raw waveform but a <b>log-Mel spectrogram</b>: the 16 kHz audio is
       chopped into 25-millisecond windows every 10 milliseconds, and each window is summarized by <b>80 Mel
       channels</b> (frequency bands spaced the way human hearing is, with the log taken so loud and quiet sounds
       are on a comparable scale). So the encoder sees an image-like grid of "how much energy in each frequency
       band over time." A two-convolution stem plus standard Transformer blocks turn that grid into a sequence of
       audio feature vectors.</p>
       <p>The <b>decoder</b> is an ordinary autoregressive Transformer language model — it predicts the next token
       given all previous tokens, while cross-attending to the encoder's audio features. What makes one decoder do
       <i>many</i> jobs is the <b>multitask token format</b> (§2.3): before any text, the decoder emits a short
       run of <b>special control tokens</b> that declare the task. Concretely, the sequence is:</p>
       <ol>
        <li><code>&lt;|startoftranscript|&gt;</code> — marks the beginning.</li>
        <li>a <b>language token</b> — one of 99 language tags (e.g. <code>&lt;|en|&gt;</code>,
        <code>&lt;|de|&gt;</code>). If you do not supply it, the model <i>predicts</i> it from the audio — that is
        <b>language identification</b> (LID) for free. (If the clip has no speech, a <code>&lt;|nospeech|&gt;</code>
        token can appear here instead.)</li>
        <li>a <b>task token</b> — either <code>&lt;|transcribe|&gt;</code> (output text in the <i>same</i> language
        as the audio) or <code>&lt;|translate|&gt;</code> (output the <i>English</i> translation).</li>
        <li>a <b>timestamp control</b> — <code>&lt;|notimestamps|&gt;</code> to emit plain text, or, if omitted,
        the model interleaves <b>timestamp tokens</b> (quantized to 20-millisecond resolution) marking when each
        chunk of speech starts and ends.</li>
        <li>the <b>transcript text tokens</b>, and finally <code>&lt;|endoftext|&gt;</code> to stop.</li>
       </ol>
       <p>Because the task is encoded <i>inside the same sequence the decoder generates</i>, training is uniform:
       every example — English transcription, German transcription, Spanish&rarr;English translation, with or
       without timestamps — is just "predict the next token" over a sequence in this format. At inference you can
       <b>force</b> the early tokens (e.g. set the task to <code>&lt;|translate|&gt;</code>) to steer the model, or
       <b>let it predict</b> them (e.g. the language) to get zero-shot detection. One model, one objective, many
       tasks — selected by a handful of tokens.</p>`,
    architecture:
      `<p>Whisper is a <b>deliberately plain encoder-decoder Transformer</b> (§2.2). Trace the data from waveform to
       text:</p>
       <p><b>1. Audio front end (feature extraction).</b> Resample to <b>16 kHz</b>. Compute an <b>80-channel
       log-magnitude Mel spectrogram</b> using <b>25 ms</b> analysis windows with a <b>10 ms</b> stride, then
       globally scale to roughly [-1, 1]. A 30-second clip (Whisper's fixed window) becomes a grid of shape
       <b>80 &times; 3000</b> (80 frequency channels, 3000 time frames).</p>
       <p><b>2. Convolutional stem.</b> Two 1-D convolutions over the spectrogram, each with <b>filter width 3</b>
       and <b>GELU</b> activation; the <b>second conv has stride 2</b>, halving the time axis to <b>1500</b> frames
       of width $d_{\\text{model}}$. <b>Sinusoidal position embeddings</b> are then added.</p>
       <p><b>3. Transformer encoder.</b> A stack of standard pre-activation residual Transformer blocks
       (multi-head self-attention + MLP), with a final layer normalization. Output: <b>1500 audio feature
       vectors</b> — this is $\\text{enc}(x)$, what the decoder attends to.</p>
       <p><b>4. Transformer decoder.</b> An autoregressive Transformer of the <b>same width and same number of
       blocks</b> as the encoder, with <b>learned position embeddings</b> and <b>tied input/output token
       embeddings</b>. Each block does causal self-attention over previous tokens, <b>cross-attention</b> to the
       encoder features, then an MLP. A final softmax over the vocabulary gives the next-token distribution.</p>
       <p><b>5. Vocabulary and multitask prefix.</b> The text tokenizer is GPT-2's <b>byte-level BPE</b> (refit, same
       size, for multilingual), <b>plus the special control tokens</b>: <code>&lt;|startoftranscript|&gt;</code>,
       <b>99 language tokens</b>, <code>&lt;|nospeech|&gt;</code>, <code>&lt;|transcribe|&gt;</code>,
       <code>&lt;|translate|&gt;</code>, <code>&lt;|notimestamps|&gt;</code>, <b>timestamp tokens</b> (one per 20 ms),
       <code>&lt;|startofprev|&gt;</code>, and <code>&lt;|endoftext|&gt;</code>. The decoder produces the control
       prefix and the text as one sequence.</p>
       <p><b>6. Model sizes (Table 1).</b> Five widths, encoder and decoder always matched:
       Tiny (4 blocks, width 384, 6 heads, 39M params), Base (6 / 512 / 8, 74M), Small (12 / 768 / 12, 244M),
       Medium (24 / 1024 / 16, 769M), Large (32 / 1280 / 20, 1550M).</p>
       <p><b>7. Training (§2.4).</b> One next-token cross-entropy objective over all 680,000 hours, AdamW with linear
       LR decay, gradient-norm clipping, FP16 with dynamic loss scaling, batch 256 segments, 2–3 epochs, no
       augmentation in V1. Crucially, <b>no fine-tuning per benchmark</b> — every downstream evaluation is zero-shot.
       The architecture is intentionally off-the-shelf; the contribution is the data and the token format, not the
       network.</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>audio input</b>, represented as an 80-channel <b>log-Mel spectrogram</b> — a grid of [frequency band] &times; [time frame] energies, log-scaled (§2.2)." },
      { sym: "$\\text{enc}(x)$", desc: "the <b>encoder</b> output: a sequence of audio feature vectors the decoder attends to. A plain Transformer encoder over the spectrogram, after a two-convolution stem." },
      { sym: "$y_{1:T}$", desc: "the full <b>decoder token sequence</b>: the special control tokens followed by the transcript text tokens, length $T$." },
      { sym: "$y_t$", desc: "the <b>$t$-th token</b> the decoder emits. Early positions hold control tokens (start, language, task, timestamp flag); later positions hold the text." },
      { sym: "$y_{\\lt t}$", desc: "all tokens <b>before</b> position $t$ (here <code>&lt;</code> means \"earlier than\"). The decoder conditions on these plus the audio when choosing $y_t$." },
      { sym: "$\\langle\\text{sot}\\rangle$", desc: "the <code>&lt;|startoftranscript|&gt;</code> token: marks the start of every sequence." },
      { sym: "$\\langle\\text{lang}\\rangle$", desc: "the <b>language token</b> (one of 99): names the spoken language. Predicted by the model when not supplied &rarr; zero-shot <b>language identification</b> (LID)." },
      { sym: "$\\langle\\text{task}\\rangle$", desc: "the <b>task token</b>: <code>&lt;|transcribe|&gt;</code> (same-language text) or <code>&lt;|translate|&gt;</code> (English text)." },
      { sym: "$\\langle\\text{ts}\\rangle$", desc: "the <b>timestamp control</b>: <code>&lt;|notimestamps|&gt;</code> for plain text, else <b>timestamp tokens</b> at 20 ms resolution interleaved with the text." },
      { sym: "$\\langle\\text{eot}\\rangle$", desc: "the <code>&lt;|endoftext|&gt;</code> (end-of-transcript) token: tells the decoder to stop." },
      { sym: "$P(\\cdot\\mid\\cdot)$", desc: "the decoder's <b>next-token probability</b>: a softmax over the vocabulary given the audio and the tokens so far. Trained by cross-entropy (next-token prediction)." },
      { sym: "$\\theta$", desc: "the <b>model parameters</b> (encoder + decoder Transformer weights), shared across all tasks and languages — one network, selected by the prefix tokens, not per-task weights." },
      { sym: "$\\mathcal{D}$", desc: "the <b>training set</b>: 680,000 hours of (audio, transcript) pairs, each cut to a 30-second segment, mixing transcription and translation across languages (§2.1)." },
      { sym: "$N$", desc: "the number of hours of training data <b>for one language</b> (the x-axis of the scaling trend in §3.5)." },
      { sym: "$\\langle\\text{nospeech}\\rangle$", desc: "the <code>&lt;|nospeech|&gt;</code> token: emitted after the language slot when the clip has <b>no speech</b> — i.e. voice-activity detection (§2.3)." },
      { sym: "$\\langle\\text{prev}\\rangle$", desc: "the <code>&lt;|startofprev|&gt;</code> token plus the <b>previous segment's transcript</b>, optionally prepended as context; its loss is masked so the model conditions on but does not predict it (§2.3)." }
    ],
    formula: `$$ \\hat{\\theta} \\;=\\; \\arg\\max_{\\theta}\\; \\sum_{(x,\\,y)\\in\\mathcal{D}} \\sum_{t=1}^{T} \\log P_{\\theta}\\big(y_t \\,\\big|\\, y_{\\lt t},\\, \\text{enc}(x)\\big) $$
       <p>The <b>only</b> objective (§2.4): maximize next-token log-likelihood over all 680,000 hours. There is no task-specific loss — every example, every language, transcription or translation, contributes one term in this same sum. ("AdamW, linear LR decay, no augmentation"; the loss equation itself is not written out in the paper — it is plain next-token cross-entropy.)</p>
       $$ P_{\\theta}\\big(y_{1:T}\\mid x\\big) \\;=\\; \\prod_{t=1}^{T} P_{\\theta}\\big(y_t \\,\\big|\\, y_{\\lt t},\\, \\text{enc}(x)\\big) $$
       <p>The <b>autoregressive factorization</b> the decoder computes (chain rule): the whole-sequence probability is the product of per-token conditionals, each cross-attending to the encoded audio $\\text{enc}(x)$. Standard for any encoder-decoder Transformer (see paper-transformer).</p>
       $$ y \\;=\\; \\big[\\,\\underbrace{\\langle\\text{prev}\\rangle?,\\ \\langle\\text{sot}\\rangle,\\ \\langle\\text{lang}\\rangle,\\ \\langle\\text{nospeech}\\rangle?,\\ \\langle\\text{task}\\rangle,\\ \\langle\\text{ts}\\rangle}_{\\text{control prefix}},\\ \\underbrace{t_1, w_1, w_2, \\ldots, t_2, \\ldots}_{\\text{(timestamp,)\\ text}},\\ \\langle\\text{eot}\\rangle\\,\\big] $$
       <p>The <b>multitask token format</b> (§2.3, Fig. 1) — the paper's true "formula." A control prefix declares language, speech/no-speech, task, and timestamp mode; then text (optionally interleaved with start/end timestamp tokens $t_i$ quantized to 20 ms); then end-of-transcript. The "$?$" marks optional slots. This sequence <i>is</i> the multitask interface.</p>
       $$ x \\;\\in\\; \\mathbb{R}^{80 \\times 3000}, \\qquad \\text{enc}(x) \\;\\in\\; \\mathbb{R}^{1500 \\times d_{\\text{model}}} $$
       <p>Front-end shapes (§2.2): a 30-second clip at 16 kHz becomes an 80-channel log-Mel spectrogram of 3000 frames (10 ms hop), which the two-conv stem (the second conv has <b>stride 2</b>) downsamples to 1500 audio feature vectors of width $d_{\\text{model}}$.</p>
       $$ \\text{WER}(N) \\;\\approx\\; \\text{WER}(16N) \\,\\cdot\\, 2 \\quad\\text{(per-language; §3.5, empirical)} $$
       <p>The one quantitative <b>scaling trend</b> the paper reports: per-language word error rate roughly <b>halves for every 16× increase</b> in that language's training hours. Described in words, not as a fitted equation — this is an honest paraphrase, not a precise law.</p>
       <p><b>Be honest:</b> Whisper is mostly an empirical / data-scale paper. The four boxes above are essentially <i>one</i> idea (autoregressive next-token modeling over a multitask token sequence) plus the input shapes and a stated scaling trend. The contribution is the <b>680,000-hour weakly-supervised data</b> and the <b>token interface</b>, not new mathematics.</p>`,
    whatItDoes:
      `<p>The equation is just the standard <b>autoregressive</b> factorization of a sequence (the same one any
       Transformer language model uses): the probability of the whole token sequence is the product of each
       token's probability given the audio and all earlier tokens. There is nothing special-purpose in the
       <i>math</i> — and that is the point. Whisper's idea lives entirely in <b>what the early tokens
       $y_{1:4}$ are</b>: the control prefix $[\\langle\\text{sot}\\rangle, \\langle\\text{lang}\\rangle,
       \\langle\\text{task}\\rangle, \\langle\\text{ts}\\rangle]$ declares the language, the task, and whether to
       emit timestamps, <i>inside the same sequence</i>.</p>
       <p>So a single objective — "predict the next token, given the audio and the prefix so far" — covers
       transcription, translation, language identification, and timing. Want translation? Make $\\langle\\text{task}
       \\rangle = $ <code>&lt;|translate|&gt;</code>. Want the model to <i>tell you</i> the language? Leave
       $\\langle\\text{lang}\\rangle$ unspecified and read off whichever language token the model assigns highest
       probability. The control tokens are levers on one shared model, not switches between many models.</p>`,
    derivation:
      `<p><b>Why this works — full treatment lives in the Transformer lessons; here is the short recap.</b> The
       factorization $P(y_{1:T}\\mid x) = \\prod_t P(y_t\\mid y_{\\lt t}, \\text{enc}(x))$ is the <b>chain rule of
       probability</b> applied left-to-right: any joint distribution over a sequence can be written as a product of
       conditionals, each predicting the next item from the ones before. An autoregressive Transformer decoder
       (causal self-attention over $y_{\\lt t}$, cross-attention to $\\text{enc}(x)$) computes exactly these
       conditionals, and is trained by <b>cross-entropy</b> on the true next token — see <b>dl-language-model</b>,
       <b>dl-cross-entropy</b>, and the encoder-decoder mechanics in <b>paper-transformer</b> / <b>mod-transformer</b>.</p>
       <p>The Whisper-specific insight needs no new derivation: by <b>promoting task descriptors to ordinary
       tokens</b> in this same sequence, you make multitasking <i>free</i>. The control tokens occupy the first few
       positions of $y$, so the decoder conditions every subsequent text token on them automatically. Forcing a
       control token at inference (e.g. <code>&lt;|translate|&gt;</code>) is just fixing $y_t$ and decoding the
       rest; predicting one (e.g. the language) is just reading the decoder's softmax at that position. The
       robustness — the headline result — comes not from this format but from the <b>680,000 hours</b> of varied
       weak supervision the format let the authors train on uniformly. There is no clever loss to reproduce; the
       lesson is the data scale and the token interface.</p>`,
    example:
      `<p>Work through the <b>special-token decoding sequence</b> for one clip by hand, the way the demo parses it.
       Suppose the audio is a German speaker, and we want a <b>same-language transcript without timestamps</b>. The
       decoder emits this 7-token sequence; the table walks each position:</p>
       <table class="extable">
         <caption>One Whisper target sequence (German, transcribe, no timestamps &rarr; "Guten Tag"). Positions 1&ndash;4 are the control prefix; 5&ndash;6 are text; 7 stops.</caption>
         <thead><tr><th class="num">pos</th><th>token</th><th>slot</th><th>role</th></tr></thead>
         <tbody>
           <tr><td class="num">1</td><td><code>&lt;|startoftranscript|&gt;</code></td><td>$\\langle\\text{sot}\\rangle$</td><td>marks the start; always first</td></tr>
           <tr><td class="num">2</td><td><code>&lt;|de|&gt;</code></td><td>$\\langle\\text{lang}\\rangle$</td><td>language = German (predict this slot &rarr; language ID)</td></tr>
           <tr><td class="num">3</td><td><code>&lt;|transcribe|&gt;</code></td><td>$\\langle\\text{task}\\rangle$</td><td>same-language output (flip to <code>&lt;|translate|&gt;</code> for English)</td></tr>
           <tr><td class="num">4</td><td><code>&lt;|notimestamps|&gt;</code></td><td>$\\langle\\text{ts}\\rangle$</td><td>plain text (omit &rarr; 20 ms timestamp tokens)</td></tr>
           <tr><td class="num">5</td><td><code>"Guten"</code></td><td>text</td><td>transcript token</td></tr>
           <tr><td class="num">6</td><td><code>"Tag"</code></td><td>text</td><td>transcript token</td></tr>
           <tr><td class="num">7</td><td><code>&lt;|endoftext|&gt;</code></td><td>$\\langle\\text{eot}\\rangle$</td><td>stop</td></tr>
         </tbody>
       </table>
       <p>Count it out: the first <b>4</b> tokens are pure control (start, language, task, timestamps) and the
       remaining <b>2</b> are content, ending in the stop token &mdash; $4+2+1=7$ positions total. Flip the
       language token (position 2) and you change LID; flip the task token (position 3) and you switch transcribe
       vs. translate; drop the no-timestamps token (position 4) and you get timing &mdash; all from the same
       model, same weights. The demo below parses this exact sequence and recomputes the same breakdown
       ($4$ control tokens, $2$ text tokens).</p>`,
    recipe:
      `<ol>
        <li><b>Front end.</b> Resample audio to 16 kHz; compute an <b>80-channel log-Mel spectrogram</b> (25 ms
        windows, 10 ms stride). This grid is the encoder input (§2.2).</li>
        <li><b>Encoder.</b> A two-convolution stem then a stack of standard Transformer blocks (with sinusoidal
        position embeddings) turns the spectrogram into audio feature vectors.</li>
        <li><b>Decoder.</b> A standard autoregressive Transformer (learned position embeddings, tied input/output
        embeddings) that cross-attends to the encoder and predicts the next token.</li>
        <li><b>Multitask prefix (§2.3).</b> Begin every target sequence with control tokens:
        <code>&lt;|startoftranscript|&gt;</code> &rarr; language token &rarr; task token
        (<code>&lt;|transcribe|&gt;</code>/<code>&lt;|translate|&gt;</code>) &rarr;
        <code>&lt;|notimestamps|&gt;</code> or timestamp tokens, then the text, then
        <code>&lt;|endoftext|&gt;</code>.</li>
        <li><b>Train.</b> One objective — next-token cross-entropy — over all 680,000 hours of weakly-labelled
        audio in this format, mixing languages, transcription, and translation (§2.1).</li>
        <li><b>Inference.</b> <i>Force</i> control tokens to steer (e.g. set the task), or <i>let the model
        predict</i> them (e.g. the language) for zero-shot LID. Decode the text with greedy or beam search.</li>
        <li><b>Evaluate zero-shot.</b> Run as-is on each benchmark — no fine-tuning — and measure <b>word error
        rate</b> (WER), especially on out-of-distribution data (§3.3).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): zero-shot Whisper models "are often competitive with prior fully supervised
       results but in a zero-shot transfer setting without the need for any fine-tuning," and "approach [human]
       accuracy and robustness." The robustness claim is made precise in <b>§3.3 / Table 2</b>: averaged over many
       out-of-distribution datasets, Whisper makes far fewer errors than supervised LibriSpeech models that match
       it on LibriSpeech itself — i.e. equal in-distribution accuracy, much better generalization.</p>
       <p><i>These are the paper's reported claims, quoted/paraphrased from the abstract and §3.3. The bars in the
       CODEVIZ panel below are OUR OWN labeled illustration of the robustness <b>gap</b> — not measured numbers
       from the paper.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> Whisper is a <b>read-only</b> lesson &mdash; you cannot reproduce the
       680,000-hour training run &mdash; so "is it working?" has two layers. (1) For the <b>code you actually
       run</b> (the §2.3 token-format parser), correctness is exact: the assembled control prefix must be
       <code>&lt;|startoftranscript|&gt;</code> &rarr; language &rarr; task &rarr; timestamp-flag, in that order,
       and the parser must split off exactly those four control tokens from the text. (2) For the <b>real model</b>
       (a released checkpoint you load, not train), the paper's primary metric is <b>word error rate (WER)</b>
       &mdash; the fraction of words wrong &mdash; evaluated <b>zero-shot</b> (no fine-tuning) on each benchmark,
       headlined by <b>average WER across many out-of-distribution datasets</b> (§3.3, Table 2). The "no-skill"
       reference is a <b>supervised model matched to Whisper's LibriSpeech WER</b>: equal in-distribution, so any
       out-of-distribution gap is pure robustness. (A trivial lower bound on any WER task: copying / empty output
       gives WER near $100\\%$.)</p>
       <ul>
         <li><b>Sanity checks before trusting anything.</b> (1) <b>Known-answer parse test</b>: feed the worked
         example (German, transcribe, no timestamps) and assert the sequence is exactly
         <code>[&lt;|startoftranscript|&gt;, &lt;|de|&gt;, &lt;|transcribe|&gt;, &lt;|notimestamps|&gt;, "Guten",
         "Tag", &lt;|endoftext|&gt;]</code> with 4 control tokens + 2 text tokens. (2) Front-end shape check: a
         30 s, 16 kHz clip &rarr; log-Mel grid $80\\times 3000$, and after the stride-2 conv stem &rarr;
         $1500\\times d_{\\text{model}}$ encoder features (§2.2). (3) If you load a released checkpoint, run it on
         one clean LibriSpeech clip and confirm a sensible transcript &mdash; a smoke test that the tokenizer and
         prefix are wired correctly. (4) Language-ID check: leave the language slot unforced on an English clip and
         confirm the top predicted language token is <code>&lt;|en|&gt;</code>.</li>
         <li><b>Expected range.</b> The parser is binary &mdash; it matches the §2.3 order or it doesn't. For the
         released model, the paper's claim is <b>comparative, not a single number</b>: zero-shot Whisper is "often
         competitive with prior fully supervised results" and on out-of-distribution data makes "far fewer errors"
         than matched supervised models (abstract, §3.3). <b>Do not quote a specific WER from memory</b> &mdash;
         the bars in our CODEVIZ (supervised $3\\to 12$ vs Whisper $3\\to 5.5$) are <i>our illustration of the
         shape</i>, not the paper's measurements. As a rule of thumb, a correct zero-shot setup should land in the
         same ballpark as the published checkpoint for that model size; an order-of-magnitude-worse WER signals a
         broken prefix or front end, not tuning.</li>
         <li><b>Ablation &mdash; prove the central ideas earn their keep.</b> The two contributions are
         <b>weak-supervision scale</b> and the <b>multitask token interface</b> &mdash; neither is retrainable
         here, so ablate <i>conceptually / at inference</i>. (a) <b>Robustness ablation</b> (§3.3 framing): hold
         LibriSpeech WER fixed against a supervised model, then compare average out-of-distribution WER &mdash; the
         gap should appear; if a supervised model matched in-distribution is <i>also</i> robust out-of-distribution,
         the scale claim wouldn't hold. (b) <b>Interface ablation</b>: force the <i>wrong</i> control token &mdash;
         set task to <code>&lt;|translate|&gt;</code> and the output language flips to English; force the wrong
         language token and transcription quality should <b>degrade</b>, confirming the prefix actually steers the
         one shared model.</li>
         <li><b>Failure signals &amp; what they mean.</b> <i>Parser mislabels tokens</i> &rarr; control order
         wrong (task placed before language, or timestamp flag dropped). <i>Garbled / repeated text from the real
         model</i> &rarr; wrong or out-of-order prefix, or audio not resampled to 16 kHz / wrong Mel front end.
         <i>Transcript in the wrong language</i> &rarr; a forced language token mismatched to the audio (leave it
         unforced for zero-shot LID). <i>Output is a translation when you wanted a transcript</i> &rarr; task token
         set to <code>&lt;|translate|&gt;</code> instead of <code>&lt;|transcribe|&gt;</code>. <i>Low LibriSpeech
         WER but poor out-of-distribution WER</i> &rarr; that's the <b>supervised baseline's</b> failure mode, the
         very brittleness Whisper's weak-supervision scale is meant to fix &mdash; if <i>Whisper</i> shows it,
         suspect a broken inference setup rather than a model limitation.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: its contribution is a <b>680,000-hour weakly-supervised training
       run</b>, which is <i>not</i> reproducible in a notebook (no comparable data, compute, or time). So there is
       <b>no training cell and no <code>torch.allclose</code> check</b>. Instead the CODE payload is a small
       <b>conceptual demo</b> that <b>parses the multitask token sequence</b> of §2.3 — start, language, task,
       timestamp flag, text, end — and prints the role of each token, recomputing the worked example. It also shows
       (commented, since the package is not preinstalled) the few-line call you would make with the released
       <code>whisper</code>/<code>transformers</code> library to actually transcribe a clip. Nothing here trains
       anything; we are reading and decoding the <i>interface</i>, which is the part you can understand fully
       without OpenAI-scale resources. The Transformer mechanics (encoder-decoder, cross-attention, autoregressive
       decoding) are recapped from <b>paper-transformer</b> / <b>mod-transformer</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Thinking Whisper invented a new architecture.</b> It is a <b>plain encoder-decoder Transformer</b>
        (§2.2). The contribution is the <i>data scale</i>, the <i>weak supervision</i>, and the <i>token format</i>
        — not a new layer. Reading it expecting a novel block misses the point.</li>
        <li><b>Confusing weak supervision with self-supervision.</b> Whisper uses <b>(audio, transcript) pairs</b>
        — there <i>are</i> labels, just noisy/automatic ones. That differs from wav2vec 2.0's
        <b>label-free</b> pre-training. Whisper needs no fine-tuning; the self-supervised line does.</li>
        <li><b>Getting the control-token order wrong.</b> The sequence is start &rarr; <b>language</b> &rarr;
        <b>task</b> &rarr; <b>timestamp flag</b> &rarr; text &rarr; end. Putting the task before the language, or
        forgetting the timestamp control, will not match the format the decoder was trained on.</li>
        <li><b>Assuming you must <i>specify</i> the language.</b> If you leave the language token unspecified the
        model <b>predicts</b> it — that is the zero-shot language-identification (LID) feature. Forcing the wrong
        language token degrades transcription.</li>
        <li><b>Reading a metric from memory.</b> Do not quote a specific WER from recall. The paper's robustness
        claim (§3.3) is comparative ("far fewer errors than matched supervised models"); cite it that way, and
        treat any number in our CODEVIZ as <i>our illustration</i>, not the paper's.</li>
        <li><b>Expecting to reproduce the result.</b> You cannot — that is why this is read-only. The demo parses
        the interface; it does not, and cannot, recreate the 680,000-hour training.</li>
      </ul>`,
    recall: [
      "How many hours of audio is Whisper trained on, and what makes the supervision <i>weak</i>?",
      "State the multitask token sequence from §2.3 in order: which token comes first, and what are the four control slots?",
      "Define the task tokens <code>&lt;|transcribe|&gt;</code> and <code>&lt;|translate|&gt;</code> — how do their outputs differ?",
      "How does Whisper do zero-shot <b>language identification</b> with no extra component?",
      "Why is this a read-only lesson — what about the contribution can't be reproduced in a notebook?",
      "What is the architecture, in one phrase, and why is that surprising given the results?"
    ],
    practice: [
      {
        q: `<b>The interface.</b> You have one frozen Whisper model. A colleague wants three things from the same
            Spanish audio clip: (a) a Spanish transcript with no timing, (b) an English translation, and (c) for
            the model to <i>tell them</i> what language it is. Without retraining anything, how do you get all
            three, and what changes between them?`,
        steps: [
          { do: `For (a): set the control prefix to <code>&lt;|startoftranscript|&gt;</code>, <code>&lt;|es|&gt;</code>, <code>&lt;|transcribe|&gt;</code>, <code>&lt;|notimestamps|&gt;</code>, then decode text.`, why: `Forcing language=es and task=transcribe yields same-language (Spanish) output; the no-timestamps token suppresses timing.` },
          { do: `For (b): keep the same audio but set the task token to <code>&lt;|translate|&gt;</code>.`, why: `<code>&lt;|translate|&gt;</code> outputs the English translation of the audio — only the task slot changes.` },
          { do: `For (c): leave the language token <i>unspecified</i> and read the highest-probability language token the decoder emits at that position.`, why: `Predicting the language slot instead of forcing it IS Whisper's zero-shot language identification.` }
        ],
        answer: `<p>All three come from the <b>same model</b> by changing only the <b>control tokens</b> in the
                 decoder prefix. (a) Force <code>&lt;|es|&gt;</code> + <code>&lt;|transcribe|&gt;</code> +
                 <code>&lt;|notimestamps|&gt;</code> &rarr; plain Spanish transcript. (b) Switch the task token to
                 <code>&lt;|translate|&gt;</code> &rarr; English translation; nothing else changes. (c) Leave the
                 language token unforced and read the model's predicted language token &rarr; zero-shot
                 <b>language identification</b>. The weights never change — the token interface (§2.3) is the only
                 lever.</p>`
      },
      {
        q: `<b>Robustness ablation (conceptual).</b> A teammate argues: "Whisper just has a low LibriSpeech word
            error rate, so it's a good ASR model — nothing special." Using the paper's §3.3 framing, what
            comparison shows their reasoning is incomplete, and what would the result look like?`,
        steps: [
          { do: `Pick a supervised model whose LibriSpeech WER <i>matches</i> Whisper's — equal in-distribution accuracy.`, why: `Controlling for in-distribution skill isolates robustness as the remaining variable.` },
          { do: `Evaluate both, zero-shot, on many <b>out-of-distribution</b> datasets (other accents, domains, noise) and average the WER.`, why: `Robustness is about data the model was NOT tuned on; one benchmark cannot reveal it.` },
          { do: `Compare the averaged out-of-distribution WER of the two models.`, why: `§3.3 reports Whisper makes far fewer errors here despite equal LibriSpeech WER — the gap IS the robustness contribution.` }
        ],
        answer: `<p>Equal LibriSpeech WER does not imply equal robustness. The paper's §3.3 comparison holds
                 <b>in-distribution accuracy fixed</b> — pick a supervised model that matches Whisper on
                 LibriSpeech — then measures average WER across many <b>out-of-distribution</b> datasets. There,
                 Whisper makes <b>far fewer errors</b>: same benchmark skill, much better generalization. That gap,
                 not the LibriSpeech number, is the contribution, and it comes from training on 680,000 hours of
                 varied weak supervision. Our CODEVIZ panel illustrates this gap qualitatively (our bars, not the
                 paper's numbers).</p>`
      },
      {
        q: `<b>Format reasoning.</b> Why did the authors put the task descriptor <i>inside</i> the decoder's token
            sequence (as <code>&lt;|transcribe|&gt;</code>/<code>&lt;|translate|&gt;</code> tokens) instead of, say,
            training a separate model per task or passing a task flag outside the sequence? Give the practical
            payoff.`,
        steps: [
          { do: `Note that with tokens in the sequence, every example — any language, any task — is just "predict the next token" in one format.`, why: `A single objective and one model can absorb all 680,000 hours uniformly; no per-task heads or separate training runs.` },
          { do: `Note the decoder conditions all later (text) tokens on the control prefix automatically.`, why: `Self-attention over earlier tokens means the task descriptor steers generation with no architectural plumbing.` },
          { do: `Note you can force OR predict each control token at inference.`, why: `Forcing gives controllability (set the task); predicting gives free abilities like language identification.` }
        ],
        answer: `<p>Encoding the task as <b>ordinary tokens in the same sequence</b> means one model and one
                 next-token objective cover transcription, translation, LID, and timing — so all 680,000 hours train
                 the <i>same</i> network uniformly, no per-task models or external flags. The decoder's causal
                 attention makes the control prefix automatically condition every text token, and at inference you
                 can <b>force</b> a control token to steer (set the task) or <b>let the model predict</b> it for
                 free zero-shot abilities (identify the language). That uniform, promptable interface is what let
                 weak supervision scale into one robust multitask model.</p>`
      }
    ]
  });

  window.CODE["paper-whisper"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p><b>Read-only — no training.</b> Whisper's contribution is a 680,000-hour weakly-supervised training run we
       cannot reproduce, so this is a <b>conceptual demo</b>, not a reproduction. The cell <b>parses the multitask
       token sequence</b> of §2.3 — <code>&lt;|startoftranscript|&gt;</code>, language token, task token, timestamp
       flag, text, <code>&lt;|endoftext|&gt;</code> — and prints the role of each token, recomputing the worked
       example (German, transcribe, no timestamps &rarr; "Guten Tag"). It then shows how <b>forcing</b> a different
       control token (task = translate, or leaving the language slot for the model to <b>predict</b> = language
       identification) changes the job, all on one model. At the bottom, a <b>commented</b> block shows the
       few-line call you would make with the released <code>whisper</code> library to actually transcribe a clip —
       commented because that package is not preinstalled in Colab; install it with
       <code>pip install -U openai-whisper</code> if you want to run it. Nothing here trains or downloads a model;
       it is pure interface parsing.</p>`,
    code: `# READ-ONLY conceptual demo: parse Whisper's MULTITASK TOKEN FORMAT (paper sec 2.3).
# We do NOT train or reproduce Whisper (680,000-hour weakly-supervised run -> not reproducible).
# We decode the SPECIAL-TOKEN SEQUENCE the decoder emits, and show how forcing/predicting
# control tokens selects the task on ONE model.

# --- The four control slots that prefix every Whisper target sequence (sec 2.3) ---
SOT, EOT = "<|startoftranscript|>", "<|endoftext|>"
LANG_TOKENS = {"en": "<|en|>", "de": "<|de|>", "es": "<|es|>"}   # 99 languages in the real model
TASK_TOKENS = {"transcribe": "<|transcribe|>", "translate": "<|translate|>"}
TS_TOKENS   = {"notimestamps": "<|notimestamps|>"}              # else: 20ms-quantized timestamp tokens

def build_sequence(language, task, timestamps, text_tokens):
    """Assemble the decoder target sequence in the paper's order (sec 2.3)."""
    seq = [SOT, LANG_TOKENS[language], TASK_TOKENS[task]]
    seq.append("<timestamps...>" if timestamps else TS_TOKENS["notimestamps"])
    seq += list(text_tokens) + [EOT]
    return seq

def parse_sequence(seq):
    """Label each control token's role; everything after the 4-token prefix is text."""
    roles = ["<|startoftranscript|> : start of transcript",
             f"{seq[1]:<22}: LANGUAGE  (predict this slot -> language identification / LID)",
             f"{seq[2]:<22}: TASK      (transcribe=same language | translate=English)",
             f"{seq[3]:<22}: TIMESTAMPS(notimestamps=plain text | else 20ms timestamp tokens)"]
    text = [t for t in seq[4:] if t != EOT]
    return roles, text

# --- Worked example: German speaker, transcribe, no timestamps -> "Guten Tag" ---
seq = build_sequence("de", "transcribe", timestamps=False, text_tokens=["Guten", "Tag"])
print("decoded sequence:", seq)
roles, text = parse_sequence(seq)
print("\\ncontrol-token roles:")
for r in roles: print("  " + r)
print("transcript text   :", " ".join(text))
print("number of control (prefix) tokens:", 4, " | text tokens:", len(text))
# decoded sequence: ['<|startoftranscript|>', '<|de|>', '<|transcribe|>', '<|notimestamps|>', 'Guten', 'Tag', '<|endoftext|>']
# transcript text   : Guten Tag

# --- Same model, different jobs: only the control tokens change ---
print("\\n-- flip the TASK token: translate the SAME audio to English --")
print(build_sequence("es", "translate", timestamps=False, text_tokens=["Good", "morning"]))
print("-- leave the LANGUAGE slot for the model to PREDICT -> that prediction IS language ID --")
print("  prefix: ['<|startoftranscript|>', <model predicts <|xx|>>, '<|transcribe|>', '<|notimestamps|>', ...]")

# --- (Optional) actually transcribe with the released model. Commented: not preinstalled. ---
# !pip install -U openai-whisper
# import whisper
# model  = whisper.load_model("tiny")              # small Whisper checkpoint
# result = model.transcribe("audio.mp3")           # auto language ID + transcription
# print(result["text"])
# # To force translation to English instead: model.transcribe("audio.mp3", task="translate")`
  };

  window.CODEVIZ["paper-whisper"] = {
    question: "Conceptual: how does Whisper's robustness (out-of-distribution error) compare to a supervised model matched to it in-distribution? (labeled illustration of the paper's sec 3.3 framing)",
    charts: [
      {
        type: "bar",
        title: "Word error rate: in-distribution vs out-of-distribution (CONCEPTUAL illustration, not the paper's numbers)",
        xlabel: "evaluation setting",
        ylabel: "illustrative word error rate (lower is better)",
        series: [
          {
            name: "supervised model (LibriSpeech-tuned)",
            color: "#f0883e",
            points: [["in-distribution (LibriSpeech)", 3.0], ["out-of-distribution (avg)", 12.0]]
          },
          {
            name: "Whisper (zero-shot, weak supervision)",
            color: "#7ee787",
            points: [["in-distribution (LibriSpeech)", 3.0], ["out-of-distribution (avg)", 5.5]]
          }
        ]
      }
    ],
    caption: "A LABELED CONCEPTUAL illustration — these bars are OUR drawing of the paper's sec 3.3 framing, NOT measured numbers from the paper. The two models are set <b>equal in-distribution</b> (same LibriSpeech word error rate, left pair). The paper's point is the <b>right pair</b>: averaged over many <i>out-of-distribution</i> datasets, the LibriSpeech-tuned supervised model degrades sharply (orange), while zero-shot Whisper — trained on 680,000 hours of varied weak supervision and never fine-tuned — stays far closer to its in-distribution error (green). The <b>gap</b>, not any single number, is the robustness contribution. (Illustrative values only; see sec 3.3 / Table 2 for the paper's actual measurements.)",
    code: `# CONCEPTUAL illustration of the paper's sec 3.3 robustness framing.
# These are HAND-CHOSEN illustrative values to show the SHAPE of the result,
# NOT measured numbers from the paper. We draw two models matched in-distribution,
# then show their average OUT-OF-DISTRIBUTION word error rate (WER).
settings = ["in-distribution (LibriSpeech)", "out-of-distribution (avg)"]
supervised_wer = [3.0, 12.0]   # tuned to LibriSpeech: great in-dist, degrades out-of-dist (illustrative)
whisper_wer    = [3.0,  5.5]   # zero-shot, weak supervision: stays robust out-of-dist (illustrative)

for name, wer in [("supervised", supervised_wer), ("whisper", whisper_wer)]:
    print(name, dict(zip(settings, wer)))
print("Same in-distribution WER; the out-of-distribution GAP is the robustness story (sec 3.3).")
print("NOTE: illustrative values only, not the paper's reported numbers.")`
  };
})();
