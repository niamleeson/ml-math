/* All ML — authored content for Part 13: Speech & Audio (13.1–13.8).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 13.1 Audio representation (waveform, spectrogram, MFCC) ---------------- */
window.ALLML_CONTENT["13.1"] = {
  tagline: "Audio becomes learnable when pressure over time is turned into local frequency evidence and compact spectral features.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.1-audio-representation.ipynb",
  context: String.raw`
    <p>This lesson is the front door for every speech and audio model in Part 13.</p>
    <ul>
      <li><b>Sampling and vectors</b> turn air pressure into a length-$T$ array $x[0],\ldots,x[T-1]$; every later model consumes some transformation of that array.</li>
      <li><b>Fourier analysis</b> supplies the mechanism that separates a mixed waveform into frequencies, which is exactly what spectrograms display frame by frame.</li>
      <li><b>Log transforms and linear projections</b> compress raw spectral energy into MFCC-like coordinates, the classical feature language that predates deep speech systems.</li>
    </ul>
    <p>Where it leads: ASR (13.2), sound event detection (13.7), speaker diarization (13.6), and music models (13.8) all begin by deciding which representation preserves the evidence they need. Self-supervised audio (13.5) later learns representations directly, but it still starts from waveforms or spectrogram-like patches.</p>`,
  intuition: String.raw`
    <p>The concrete problem is simple: a microphone gives you a long list of numbers, but the events we care about — vowels, speaker traits, drums, alarms — are patterns in frequency that change over time. A raw waveform is too literal; shifting a sound by a few samples changes many numbers without changing what we hear.</p>
    <p>The naive approach would feed the waveform as-is and hope the model discovers pitch and timbre from scratch. That can work with enough data, but it asks the learner to rediscover physics. A spectrogram makes the useful compromise: keep time local, but summarize each short window by how much energy lives at each frequency. MFCCs go one step further by smoothing frequency bands on a perceptual scale and keeping only a few cepstral coefficients.</p>
    <p>The design decision people gloss over is the window. We do not Fourier-transform the whole recording because speech is nonstationary: a vowel, consonant, and pause can all occur in one second. We analyze short overlapping frames, pretending each is locally stable. That small lie is what makes the representation useful.</p>`,
  mathematics: String.raw`
    <p>A waveform sampled at rate $f_s$ is a vector $x[n]$ where $n$ is a sample index and time is $t=n/f_s$. A short-time Fourier transform uses a window $w[n]$ of length $N$:</p>
    <div class="formula-box">$$X_m[k]=\sum_{n=0}^{N-1} x[n+mH]w[n]e^{-j2\pi kn/N}$$</div>
    <p>Here $m$ is the frame index, $H$ is the hop size, $k$ is the frequency-bin index, and bin $k$ corresponds to $k f_s/N$ Hz. MFCC-like features take filterbank energies $E_b$, log them, then apply a cosine projection.</p>

    <p><b>Waveform scale.</b> At $f_s=8000$ Hz, a 440 Hz sine wave is $x[n]=\sin(2\pi 440 n/8000)$. Its first samples and energy are:</p>
    <ol class="work">
      <li>$x[0]=0.000$, $x[1]=0.339$, $x[2]=0.637$, $x[3]=0.861$, $x[4]=0.982$</li>
      <li>mean squared energy over the first 0.01 s $=0.506$</li>
    </ol>
    <p>The waveform oscillates quickly, but the energy already tells you the signal is strong without caring where the phase begins.</p>

    <p><b>Spectrogram binning.</b> With $N=256$, the bin nearest 440 Hz is:</p>
    <ol class="work">
      <li>$k=\operatorname{round}(440\cdot256/8000)=14$</li>
      <li>bin frequency $=14\cdot8000/256=437.5$ Hz</li>
      <li>Hann-windowed FFT peak magnitude $=63.489$ at bin $14$</li>
    </ol>
    <p>The spectrogram has converted a hard-to-read oscillation into a bright local frequency ridge, which is exactly the evidence ASR and music systems can use.</p>

    <p><b>MFCC-like compression.</b> Four triangular bands with centers $324.5$, $799.3$, $1494.3$, and $2511.4$ Hz receive energies:</p>
    <ol class="work">
      <li>energies $=[4631.027,1488.973,0.000,0.000]$</li>
      <li>log energies $=[8.441,7.306,-11.485,-15.659]$</li>
      <li>cosine-projected coefficients $=[-11.397,29.456,-2.149,-8.138]$</li>
    </ol>
    <p>The large first two band energies say the 440 Hz tone lives in the low-frequency region; the cepstral coefficients summarize that spectral envelope in a compact vector.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using a window that is too long.</b> The STFT frame assumes local stationarity; long frames smear consonants and onsets across $X_m[k]$.</li>
      <li><b>Forgetting frequency resolution.</b> Bin spacing is $f_s/N$; with $N=256$ at 8000 Hz, 440 Hz lands at 437.5 Hz, not exactly 440 Hz.</li>
      <li><b>Taking logs without a floor.</b> Empty filter bands have $E_b=0$; log energy needs a small floor or the MFCC vector becomes undefined.</li>
    </ul>`
};

/* ---------------- 13.2 Automatic Speech Recognition ---------------- */
window.ALLML_CONTENT["13.2"] = {
  tagline: "ASR turns acoustic evidence into words by combining frame-level probabilities, temporal structure, and language constraints.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.2-asr.ipynb",
  context: String.raw`
    <p>ASR is the first full speech task built on the representation choices of 13.1.</p>
    <ul>
      <li><b>Spectrogram or MFCC features (13.1)</b> provide a sequence of frame vectors; ASR assigns each frame evidence for phonemes, characters, or subword tokens.</li>
      <li><b>Classification losses</b> turn acoustic logits into probabilities, so each frame can say which symbol it supports.</li>
      <li><b>Dynamic programming</b> supplies the mechanism for decoding over time when the best word sequence is not the same as the best frame independently.</li>
    </ul>
    <p>Where it leads: CTC (13.3) solves the missing-alignment version of this problem; TTS (13.4) runs the direction in reverse; self-supervised audio (13.5) improves ASR when labeled transcripts are scarce.</p>`,
  intuition: String.raw`
    <p>The concrete problem is to map a variable-length acoustic signal to a shorter sequence of words. The pain is that speech does not come with clean boundaries: the sound for one phoneme bleeds into the next, speakers vary, and the same word can stretch or compress in time.</p>
    <p>A naive frame classifier would label every 10 ms slice independently, then read off the labels. That fails because language is sequential. A noisy frame that briefly likes the wrong phoneme should be corrected by neighboring frames and by word-level plausibility. ASR is therefore a structured prediction problem, not just classification repeated many times.</p>
    <p>The design decision worth noticing is the unit of prediction. Phones are close to acoustics but need lexicons; characters and subwords remove the lexicon but make alignment harder. Modern ASR often chooses characters or subwords because end-to-end training and decoding become simpler, even though the acoustic model must learn more of the pronunciation mapping itself.</p>`,
  mathematics: String.raw`
    <p>An ASR model estimates a transcript $y=(y_1,\ldots,y_U)$ from acoustic frames $x_{1:T}$. In a simple frame classifier, logits $z_c$ become probabilities:</p>
    <div class="formula-box">$$p(c\mid x_t)=\frac{e^{z_c}}{\sum_{c'}e^{z_{c'}}}, \qquad \ell_t=-\log p(c_t\mid x_t)$$</div>
    <p>For sequence decoding, an HMM-style model combines transition probabilities $A_{ij}$ and emission probabilities $B_j(x_t)$ with the forward recursion $\alpha_t(j)=B_j(x_t)\sum_i\alpha_{t-1}(i)A_{ij}$.</p>

    <p><b>Frame evidence.</b> For one frame with logits $[1.2,0.3,-0.7]$ over three symbols:</p>
    <ol class="work">
      <li>exponentiate after max-shift: $[e^0,e^{-0.9},e^{-1.9}]=[1.000,0.407,0.150]$</li>
      <li>sum $=1.557$, divide: probabilities $=[0.643,0.261,0.096]$</li>
      <li>if the correct class is the first, cross-entropy $=-\log(0.643)=0.442$</li>
    </ol>
    <p>The loss is small but not zero: the frame supports the right symbol while still leaving uncertainty for the decoder to resolve.</p>

    <p><b>Temporal evidence.</b> With three hidden speech states, transition matrix rows roughly prefer staying put, and three emissions favor states 0, 1, then 2. Normalized forward probabilities after the three frames are:</p>
    <ol class="work">
      <li>start $\alpha_0=[1,0,0]$</li>
      <li>after frame 1, 2, and 3, the final normalized state probabilities are $[0.173,0.329,0.497]$</li>
    </ol>
    <p>The decoder ends most confident in state 2 because the final acoustic frame and allowed transitions agree there.</p>

    <p><b>Word error rate.</b> If a 5-word reference needs $S=1$ substitution, $D=1$ deletion, and $I=1$ insertion to match the hypothesis, then:</p>
    <ol class="work">
      <li>$\mathrm{WER}=(S+D+I)/N=(1+1+1)/5=0.600$</li>
    </ol>
    <p>WER is harsh but useful: it measures transcript edit damage, not frame accuracy, which is the quantity users actually experience.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing frame accuracy instead of transcript quality.</b> The softmax term scores one $x_t$, but WER depends on the decoded sequence after insertions, deletions, and substitutions.</li>
      <li><b>Ignoring duration.</b> The forward recursion carries state over time; treating frames independently loses the fact that phones persist across multiple frames.</li>
      <li><b>Letting the language model overpower acoustics.</b> A strong prior can choose fluent words even when $B_j(x_t)$ points elsewhere, producing confident hallucinations.</li>
    </ul>`
};

/* ---------------- 13.3 CTC & sequence transduction ---------------- */
window.ALLML_CONTENT["13.3"] = {
  tagline: "CTC learns from unsegmented sequences by summing the probabilities of every frame-level alignment that collapses to the target.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.3-ctc-sequence-transduction.ipynb",
  context: String.raw`
    <p>CTC is the alignment engine that makes many end-to-end ASR systems trainable.</p>
    <ul>
      <li><b>ASR (13.2)</b> needs transcripts but rarely knows which frame produced which character; CTC supplies the missing alignment sum.</li>
      <li><b>Dynamic programming</b> lets us sum exponentially many alignments without enumerating them in real systems.</li>
      <li><b>Softmax frame probabilities</b> are still the local evidence; CTC changes how those probabilities are combined into a sequence loss.</li>
    </ul>
    <p>Where it leads: sequence transduction appears in speech, OCR, handwriting, and biosequence labeling. Later attention-based and encoder-decoder models solve alignment differently, but CTC remains the cleanest first model of monotonic alignment.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that the target is shorter than the input. Three hundred acoustic frames may correspond to ten characters, and no one tells us which frames are blanks, repeats, or real letters. If we demanded exact frame labels, we would need expensive forced alignment before training.</p>
    <p>CTC's mental model is generous: let every frame choose a symbol or a special blank, then collapse consecutive repeats and delete blanks. Any frame path that collapses to the transcript gets credit. The model is trained by summing all such paths, not by betting on one hidden alignment.</p>
    <p>The design decision people miss is the blank. Without a blank, the paths "aa" and a stretched "a" are hard to distinguish. The blank creates separation: $a$, blank, $a$ can mean two $a$ characters, while repeated $a,a$ can collapse to one. That extra symbol is what makes repeated letters possible.</p>`,
  mathematics: String.raw`
    <p>Let $\pi=(\pi_1,\ldots,\pi_T)$ be a frame-level path over symbols plus blank $\varnothing$. The collapse map $B(\pi)$ first merges consecutive repeats, then removes blanks. CTC assigns:</p>
    <div class="formula-box">$$P(y\mid x)=\sum_{\pi:B(\pi)=y}\prod_{t=1}^{T}p_t(\pi_t), \qquad \mathcal{L}_{CTC}=-\log P(y\mid x)$$</div>
    <p>For a toy alphabet $[\varnothing,a,b]$ and three frames with probabilities $[0.6,0.3,0.1]$, $[0.5,0.4,0.1]$, $[0.2,0.6,0.2]$, compute the target $y=a$.</p>

    <p><b>Path probabilities.</b> The best individual path that collapses to $a$ is blank, blank, $a$:</p>
    <ol class="work">
      <li>probability $=0.6\cdot0.5\cdot0.6=0.180$</li>
      <li>collapse $[\varnothing,\varnothing,a]\mapsto a$</li>
    </ol>
    <p>That path is plausible, but CTC does not stop there because many alignments say the same transcript.</p>

    <p><b>Sum all valid paths.</b> Enumerating all $3^3=27$ paths and adding only those that collapse to $a$ gives:</p>
    <ol class="work">
      <li>$P(a\mid x)=0.498$</li>
      <li>CTC loss $=-\log(0.498)=0.697$</li>
    </ol>
    <p>The sequence probability is much larger than the best single path's $0.180$, because uncertainty over alignment is being treated as a feature, not a bug.</p>

    <p><b>Forward recursion for the same target.</b> Use the expanded states blank, $a$, blank. After three frames the forward values are:</p>
    <ol class="work">
      <li>state masses $=[0.0600,0.3960,0.1020]$</li>
      <li>accepting probability $=0.3960+0.1020=0.498$</li>
    </ol>
    <p>The recursion reaches the same number as enumeration, but it scales to real utterances where enumeration would be impossible.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Forgetting the collapse order.</b> CTC merges repeats before deleting blanks; changing that order changes which paths map to repeated letters.</li>
      <li><b>Training on the best path only.</b> The formula sums all $\pi$ with $B(\pi)=y$; using only the argmax path throws away alignment uncertainty and underestimates $P(y\mid x)$.</li>
      <li><b>Using CTC for non-monotonic tasks.</b> The alignment moves left to right through time; translation-like reorderings violate the mechanism CTC assumes.</li>
    </ul>`
};

/* ---------------- 13.4 Text-to-Speech synthesis ---------------- */
window.ALLML_CONTENT["13.4"] = {
  tagline: "TTS turns text into sound by predicting what to say, how long to hold it, and how the acoustic contour should move.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.4-tts-synthesis.ipynb",
  context: String.raw`
    <p>TTS reverses the ASR direction: instead of reading acoustics into text, it expands text into acoustics.</p>
    <ul>
      <li><b>Audio representation (13.1)</b> gives the target space: mel spectrograms are easier to predict than raw waveform samples.</li>
      <li><b>Sequence modeling</b> handles the fact that a short text sequence expands into many acoustic frames.</li>
      <li><b>Regression losses</b> train predicted mel bins, durations, pitch, and energy to match reference speech.</li>
    </ul>
    <p>Where it leads: vocoders convert predicted spectrograms back to waveforms, speaker embeddings from 13.6 control voice identity, and self-supervised audio representations from 13.5 can improve prosody and naturalness.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not just pronunciation. A synthetic voice must decide duration, rhythm, pitch, loudness, and timbre. Text says "hello" once; the waveform may need thousands of samples, and many different natural readings are possible.</p>
    <p>A naive system might map characters directly to waveform samples. That is unnecessarily hard because waveform phase is brittle. Most TTS systems split the task: text becomes a mel spectrogram or acoustic feature sequence, then a vocoder renders the waveform. The intermediate representation keeps the perceptual content while hiding sample-level oscillation.</p>
    <p>The design decision people gloss over is explicit duration. Attention-based systems can learn alignment, but they may skip or repeat words. Duration-based TTS makes the expansion from tokens to frames deliberate: each token owns a number of frames, which makes synthesis more controllable.</p>`,
  mathematics: String.raw`
    <p>A duration-based TTS model predicts a duration $d_i$ for each input token $i$, expands token states into $T=\sum_i d_i$ frames, then predicts acoustic features such as mel bins $M_{t,b}$, pitch $f_0(t)$, and energy.</p>
    <div class="formula-box">$$\hat M_{t,b}=g(\operatorname{expand}(h_i,d_i)), \qquad \mathcal{L}=\|\hat M-M\|_1+\lambda_f\|\hat f_0-f_0\|_1$$</div>
    <p>Here $h_i$ is a token representation, $d_i$ is its frame count, $b$ indexes mel bins, and $\lambda_f$ controls how strongly pitch errors matter.</p>

    <p><b>Duration expansion.</b> For tokens $[h,e,l,o]$ with predicted durations $[2,1,2,1]$:</p>
    <ol class="work">
      <li>total acoustic frames $T=2+1+2+1=6$</li>
      <li>token start frames $=[0,2,3,5]$</li>
      <li>expanded sequence $=[h,h,e,l,l,o]$</li>
    </ol>
    <p>This is the alignment made visible: the model decides how long each token occupies before it predicts the spectrogram.</p>

    <p><b>Pitch contour.</b> For six predicted frame pitches $[180,190,210,200,170,160]$ Hz:</p>
    <ol class="work">
      <li>mean pitch $=(180+190+210+200+170+160)/6=185.0$ Hz</li>
      <li>range $=210-160=50$ Hz</li>
    </ol>
    <p>The contour rises then falls, which is prosody; two utterances with the same words can sound different because this curve changes.</p>

    <p><b>Acoustic loss.</b> If one mel bin is predicted as $0.7$ and the target is $1.0$, while pitch error is $10$ Hz with $\lambda_f=0.01$:</p>
    <ol class="work">
      <li>mel absolute error $=|0.7-1.0|=0.300$</li>
      <li>weighted pitch error $=0.01\cdot10=0.100$</li>
      <li>combined toy loss $=0.300+0.100=0.400$</li>
    </ol>
    <p>The loss tells the model that spectral shape and prosody both matter, but the weighting decides their exchange rate.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Letting alignment drift.</b> If the duration sum $\sum_i d_i$ is wrong, spectrogram frames are assigned to the wrong token and words skip or repeat.</li>
      <li><b>Training only mel loss.</b> The $\hat M$ term can look reasonable while $f_0(t)$ is flat, producing intelligible but lifeless speech.</li>
      <li><b>Predicting waveform samples too early.</b> Raw samples encode phase; a mel target removes a burden that the vocoder is better designed to handle.</li>
    </ul>`
};

/* ---------------- 13.5 Self-supervised audio (wav2vec, HuBERT) ---------------- */
window.ALLML_CONTENT["13.5"] = {
  tagline: "Self-supervised audio learns speech features by hiding or contrasting parts of the signal before any transcript is available.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.5-self-supervised-audio.ipynb",
  context: String.raw`
    <p>This lesson answers the data bottleneck behind ASR and speaker tasks.</p>
    <ul>
      <li><b>Audio representations (13.1)</b> provide the waveform or spectrogram patches that can be masked, quantized, or contrasted.</li>
      <li><b>ASR (13.2)</b> benefits because unlabeled audio is abundant while transcripts are expensive.</li>
      <li><b>Cross-entropy and contrastive losses</b> supply the same probability machinery, but now the labels are created from the audio itself.</li>
    </ul>
    <p>Where it leads: wav2vec-style contrastive pretraining and HuBERT-style masked cluster prediction become reusable encoders for ASR, diarization (13.6), and sound event detection (13.7).</p>`,
  intuition: String.raw`
    <p>The concrete problem is that labeled speech is scarce, but unlabeled speech is everywhere. A model that waits for transcripts wastes the largest source of information: the structure of the audio stream itself.</p>
    <p>The naive supervised approach learns only from pairs of audio and text. Self-supervision creates its own training signal: hide a region and predict its identity, or make a representation of the true future frame closer than distractors. The model learns which acoustic details are stable and predictive before it ever sees words.</p>
    <p>The design decision people gloss over is not to reconstruct every waveform sample. Sample-level reconstruction rewards phase and tiny details that may not help speech understanding. Predicting masked units or contrasting latent vectors pushes the encoder toward phonetic and speaker structure instead.</p>`,
  mathematics: String.raw`
    <p>A contrastive audio objective compares a context vector $c_t$ to a positive future vector $q^+$ and negative vectors $q^-_j$:</p>
    <div class="formula-box">$$\mathcal{L}=-\log\frac{\exp(\operatorname{sim}(c_t,q^+)/\tau)}{\exp(\operatorname{sim}(c_t,q^+)/\tau)+\sum_j\exp(\operatorname{sim}(c_t,q^-_j)/\tau)}$$</div>
    <p>Here $\operatorname{sim}$ is cosine similarity and $\tau$ is a temperature. HuBERT-like training instead masks frames and predicts discrete cluster labels with cross-entropy.</p>

    <p><b>One contrastive decision.</b> Let $c=[1,0]$, $q^+=[0.8,0.6]$, $q^-=[0.1,0.995]$, and $\tau=0.1$:</p>
    <ol class="work">
      <li>cosine similarities $=[0.800,0.100]$</li>
      <li>softmax over scaled scores gives positive probability $0.9991$</li>
      <li>loss $=-\log(0.9991)=0.0009$</li>
    </ol>
    <p>The model is rewarded because the context already points strongly toward the true latent vector and away from the distractor.</p>

    <p><b>Masking ratio.</b> If 3 of 10 time steps are masked:</p>
    <ol class="work">
      <li>mask fraction $=3/10=0.300$</li>
    </ol>
    <p>Masking forces the encoder to use context; with no masking it could simply copy local acoustics, and with too much masking the task becomes guesswork.</p>

    <p><b>Cluster prediction.</b> If a masked frame has target cluster 2 and predicted probabilities $[0.1,0.2,0.7]$:</p>
    <ol class="work">
      <li>cross-entropy $=-\log(0.7)=0.357$</li>
    </ol>
    <p>The number is a transcript-free training signal: the model learns acoustic categories before anyone tells it the words.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Choosing negatives that are too easy.</b> In the contrastive denominator, weak negatives make the loss tiny without learning fine acoustic distinctions.</li>
      <li><b>Masking the wrong amount.</b> The mask fraction controls task difficulty; too low permits copying, too high destroys the context needed for prediction.</li>
      <li><b>Treating cluster labels as truth.</b> HuBERT targets are bootstrap units; bad clusters inject noise into the cross-entropy term.</li>
    </ul>`
};

/* ---------------- 13.6 Speaker identification & diarization ---------------- */
window.ALLML_CONTENT["13.6"] = {
  tagline: "Speaker systems compare voice embeddings, then diarization asks who spoke when across time.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.6-speaker-diarization.ipynb",
  context: String.raw`
    <p>Speaker modeling uses audio features for identity rather than words.</p>
    <ul>
      <li><b>Audio representation (13.1)</b> supplies spectral cues such as vocal tract shape and pitch statistics that differ across speakers.</li>
      <li><b>Metric learning</b> turns utterances into embeddings where same-speaker vectors are close and different-speaker vectors are far.</li>
      <li><b>Clustering and segmentation</b> add the timeline: diarization is not only "who" but "who spoke when."</li>
    </ul>
    <p>Where it leads: speaker embeddings can condition TTS voices (13.4), improve ASR personalization (13.2), and separate overlapping acoustic evidence in meetings and videos.</p>`,
  intuition: String.raw`
    <p>The concrete problem changes from recognizing content to recognizing source. Two people can say the same word; the system must ignore the word and keep the voice identity. Diarization adds a harder version: split a recording into regions and assign each region to a speaker.</p>
    <p>The naive approach would compare raw spectrograms. That fails because the same speaker changes words, pitch, microphone, and emotion. Speaker embeddings compress an utterance into a vector meant to preserve identity while discarding content. Cosine similarity then becomes a simple test of whether two utterances sound like the same person.</p>
    <p>The design decision people gloss over is thresholding. Verification is not "nearest speaker always wins"; real systems must decide when the similarity is high enough to accept, and diarization must decide whether a segment starts a new cluster. That threshold sets the tradeoff between false merges and false splits.</p>`,
  mathematics: String.raw`
    <p>Given an embedding $e\in\mathbb{R}^d$, speaker comparison often uses cosine similarity:</p>
    <div class="formula-box">$$\operatorname{cos}(e,a)=\frac{e^\top a}{\|e\|_2\|a\|_2}$$</div>
    <p>Diarization then assigns each time segment to a speaker cluster and evaluates timing errors, including overlap.</p>

    <p><b>Speaker verification.</b> Compare query $e=[1,2]$ with enrolled speaker $A=[1.2,2.1]$ and impostor $B=[-1,0]$:</p>
    <ol class="work">
      <li>$\cos(e,A)=0.998$</li>
      <li>$\cos(e,B)=-0.447$</li>
    </ol>
    <p>The query is almost collinear with $A$ and points partly opposite $B$, so the embedding space has made identity a geometric decision.</p>

    <p><b>Threshold decision.</b> With threshold $0.75$:</p>
    <ol class="work">
      <li>$0.998\gt0.75$ accepts speaker $A$</li>
      <li>$-0.447\lt0.75$ rejects speaker $B$</li>
    </ol>
    <p>The same scores can produce different behavior if the threshold changes; calibration is part of the model, not an afterthought.</p>

    <p><b>Diarization overlap.</b> Suppose speaker segments are $A:0$–$2$, $B:1$–$3$, and $A:3$–$4$ seconds in a 4-second clip:</p>
    <ol class="work">
      <li>overlap between $A:0$–$2$ and $B:1$–$3$ is $1$ second</li>
      <li>overlap fraction $=1/4=0.250$</li>
    </ol>
    <p>Overlapped speech is not a small bookkeeping detail; it is exactly where single-speaker assumptions break.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Comparing unnormalized embeddings with dot products.</b> Cosine divides by $\|e\|\|a\|$; otherwise loudness or embedding norm can masquerade as identity.</li>
      <li><b>Using one threshold everywhere.</b> The accept rule $\cos(e,a)\gt\theta$ depends on microphones, language, and enrollment quality.</li>
      <li><b>Ignoring overlap in diarization.</b> A single label per time point cannot represent simultaneous speakers, so DER rises even if each voice embedding is good.</li>
    </ul>`
};

/* ---------------- 13.7 Sound event detection ---------------- */
window.ALLML_CONTENT["13.7"] = {
  tagline: "Sound event detection labels what happened and when, often with multiple events active at the same time.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.7-sound-event-detection.ipynb",
  context: String.raw`
    <p>Sound event detection extends audio learning beyond speech.</p>
    <ul>
      <li><b>Spectrograms (13.1)</b> reveal event signatures such as short broadband claps or sustained sirens.</li>
      <li><b>Multilabel classification</b> is necessary because events can overlap; a frame may contain speech and a door slam.</li>
      <li><b>Sequence smoothing</b> turns frame probabilities into onset and offset decisions on a timeline.</li>
    </ul>
    <p>Where it leads: event detection shares segmentation ideas with diarization (13.6) and representation learning with self-supervised audio (13.5), while music tagging (13.8) uses similar multilabel frame evidence.</p>`,
  intuition: String.raw`
    <p>The concrete problem is to answer both "what sound occurred" and "when did it occur." A clip-level label like "dog bark" is not enough if the bark lasts half a second inside a ten-second recording.</p>
    <p>The naive approach would classify the whole clip once. That misses timing and fails when multiple events overlap. SED instead predicts event probabilities over frames, then thresholds and groups them into segments. It is detection, not just recognition.</p>
    <p>The design decision people gloss over is multilabel output. Events are not mutually exclusive like digit classes. A sigmoid per event is the right mechanism because each label can be on or off independently; a softmax would force one event to explain the whole frame.</p>`,
  mathematics: String.raw`
    <p>For event $c$ at frame $t$, a model predicts $p_{t,c}\in[0,1]$ with a sigmoid. Binary cross-entropy is:</p>
    <div class="formula-box">$$\mathcal{L}_{t,c}=-y_{t,c}\log p_{t,c}-(1-y_{t,c})\log(1-p_{t,c})$$</div>
    <p>After thresholding probabilities, detection quality is often summarized with precision, recall, and F1.</p>

    <p><b>Frame loss.</b> For probabilities $[0.1,0.7,0.8,0.2,0.6]$ and labels $[0,1,1,0,1]$:</p>
    <ol class="work">
      <li>binary cross-entropy averaged over frames $=0.284$</li>
    </ol>
    <p>The low loss reflects confident negatives at frames 1 and 4 and confident positives at frames 2, 3, and 5.</p>

    <p><b>Thresholding.</b> With threshold $0.5$:</p>
    <ol class="work">
      <li>predicted labels $=[0,1,1,0,1]$</li>
      <li>true positives $=3$, false positives $=0$, false negatives $=0$</li>
    </ol>
    <p>This toy sequence is perfect after thresholding, so the event boundary is preserved.</p>

    <p><b>F1 score.</b> From those counts:</p>
    <ol class="work">
      <li>precision $=3/(3+0)=1.000$</li>
      <li>recall $=3/(3+0)=1.000$</li>
      <li>F1 $=2\cdot1\cdot1/(1+1)=1.000$</li>
    </ol>
    <p>F1 reads the detection as flawless, but only because the threshold matched the probability scale and the event was not fragmented.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using softmax for overlapping events.</b> Softmax forces probabilities to sum to one, but SED needs independent $p_{t,c}$ values for simultaneous labels.</li>
      <li><b>Choosing a threshold without calibration.</b> The counts in precision and recall change sharply as the cutoff moves; a good BCE does not guarantee a good operating point.</li>
      <li><b>Ignoring event duration.</b> Frame-level BCE can look good while predictions flicker; onset and offset grouping determine whether the detection is usable.</li>
    </ul>`
};

/* ---------------- 13.8 Music information retrieval & generation ---------------- */
window.ALLML_CONTENT["13.8"] = {
  tagline: "Music models read pitch, rhythm, and structure, then generation turns those learned regularities into new sequences.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/13.8-music-ir-generation.ipynb",
  context: String.raw`
    <p>Music information retrieval uses the same audio tools as speech, but listens for different structure.</p>
    <ul>
      <li><b>Spectrograms (13.1)</b> expose harmonics and onsets, the raw evidence for pitch and rhythm.</li>
      <li><b>Sequence models</b> capture temporal repetition, meter, and motifs, which are stronger in music than in many environmental sounds.</li>
      <li><b>Generative modeling</b> reuses prediction losses: if a model can predict the next note or frame distribution, it can sample from it.</li>
    </ul>
    <p>Where it leads: MIR overlaps with sound event detection (13.7) for tagging and with self-supervised audio (13.5) for representation learning; generation adds the modeling choices that later appear in broader sequence generation systems.</p>`,
  intuition: String.raw`
    <p>The concrete problem is to infer musically meaningful facts — pitch class, tempo, chords, sections, genre — from audio, and sometimes to generate new audio or symbolic notes that obey similar patterns.</p>
    <p>The naive approach would treat music as arbitrary sound. That wastes structure. Musical pitch repeats every octave, beats recur in time, and notes form patterns. MIR features such as chroma deliberately fold frequencies into twelve pitch classes, while tempo estimators look for regular onset spacing.</p>
    <p>The design decision people gloss over is invariance. For pitch-class tasks, a 440 Hz A and an 880 Hz A should often count as the same class even though their frequencies differ. Chroma bakes in octave invariance; generation models must decide which invariances to keep and which expressive details to leave free.</p>`,
  mathematics: String.raw`
    <p>A chroma feature maps frequency energy into 12 pitch classes. For frequency $f$, relative to $440$ Hz, the class index is:</p>
    <div class="formula-box">$$c(f)=\operatorname{round}(12\log_2(f/440))\bmod 12$$</div>
    <p>Tempo from evenly spaced beat times uses $\mathrm{BPM}=60/\Delta t$, where $\Delta t$ is the average inter-beat interval in seconds.</p>

    <p><b>Pitch class.</b> A 440 Hz sine wave analyzed with a 512-point FFT at 8000 Hz produces a chroma vector whose peak is class 0:</p>
    <ol class="work">
      <li>peak chroma class $=0$</li>
      <li>fraction of total chroma energy in class 0 $=0.475$</li>
    </ol>
    <p>The peak says the model hears an A-like pitch class; the fraction is below one because windowing and FFT leakage spread energy into neighboring bins.</p>

    <p><b>Tempo.</b> For beat times $[0.0,0.5,1.0,1.5]$ seconds:</p>
    <ol class="work">
      <li>intervals $=[0.5,0.5,0.5]$ seconds</li>
      <li>mean interval $=0.5$ seconds</li>
      <li>BPM $=60/0.5=120.0$</li>
    </ol>
    <p>The tempo calculation is just reciprocal time, but it is meaningful because beats are regular enough for the average interval to represent the pulse.</p>

    <p><b>Generation as next-token sampling.</b> If note logits are $[2.0,1.0,0.0]$:</p>
    <ol class="work">
      <li>softmax probabilities $=[0.665,0.245,0.090]$</li>
      <li>choosing the highest probability emits note 0; sampling would sometimes choose notes 1 or 2</li>
    </ol>
    <p>The same distribution can be conservative or creative depending on the decoding rule, so generation is not only a model but also a sampling decision.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating frequency as pitch class directly.</b> Chroma uses $\log_2(f/440)$ and modulo 12; without octave folding, the same note in two octaves looks unrelated.</li>
      <li><b>Confusing onset rate with tempo.</b> BPM comes from periodic beat intervals, not every transient in the spectrogram.</li>
      <li><b>Always taking argmax in generation.</b> The softmax distribution represents alternatives; deterministic decoding can make music repetitive even when the model learned variety.</li>
    </ul>`
};
