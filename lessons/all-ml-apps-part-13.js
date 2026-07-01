/* All ML — Part 13 applications (5 each). Loaded after content-part-13.js, before all-ml-register.js. */

/* ---- _apps-part13-A.js ---- */
(window.ALLML_CONTENT["13.1"] = window.ALLML_CONTENT["13.1"] || {}).applications = [
  {
    title: "Voice assistant front-end features",
    background: "<p>Wake-word and dictation systems do not feed raw microphone pressure directly to every later component. They first sample the pressure signal and create local spectral evidence that can survive speaker and device variation.</p>",
    numbers: "<p>At the lesson rate $f_s=8000$ Hz, a 440 Hz sine has $x[n]=\sin(2\pi 440n/8000)$. The second sample is $x[1]=0.339$, so the pressure wave has become a concrete numeric vector.</p>"
  },
  {
    title: "Keyword spotting on embedded devices",
    background: "<p>Small devices often use compact STFT features because repeated raw-sample comparisons are expensive and phase-sensitive. Frequency bins make stable tone and phoneme evidence easier to classify.</p>",
    numbers: "<p>With an illustrative $N=256$ window at 8000 Hz, bin spacing is $8000/256=31.25$ Hz. A 440 Hz component maps to $k=\operatorname{round}(440\cdot256/8000)=14$, or $14\cdot31.25=437.5$ Hz.</p>"
  },
  {
    title: "Call-center speech analytics",
    background: "<p>Long customer calls are too large to inspect as waveforms. Log filterbank and MFCC-like vectors summarize spectral envelopes so downstream models can search, cluster, or classify speech segments.</p>",
    numbers: "<p>Using 20 mel bands as an illustrative compact front end turns each frame into 20 log-energy values before any cosine projection, far smaller than hundreds of FFT bins per frame.</p>"
  },
  {
    title: "Music pitch displays",
    background: "<p>Tuners and pitch visualizers rely on spectrogram peaks because the frequency ridge is easier to read than fast waveform oscillations. Better frequency resolution makes nearby notes easier to distinguish.</p>",
    numbers: "<p>For a 512-sample window at 8000 Hz, the bin spacing is $8000/512=15.625$ Hz, half the 31.25 Hz spacing of the 256-sample example.</p>"
  },
  {
    title: "Acoustic anomaly monitoring",
    background: "<p>Factories and devices often monitor log-energy features for sudden acoustic changes. Empty or near-empty bands must be floored so a silent band does not become an undefined value.</p>",
    numbers: "<p>With an illustrative floor $E=10^{-6}$, the log energy is $\log E=\log(10^{-6})\approx -13.8$, finite enough for a model or dashboard.</p>"
  }
];

(window.ALLML_CONTENT["13.2"] = window.ALLML_CONTENT["13.2"] || {}).applications = [
  {
    title: "Voice dictation",
    background: "<p>Dictation systems transform many acoustic frames into a much shorter word or subword sequence. The decoder must compress repeated frame evidence without losing the transcript.</p>",
    numbers: "<p>An illustrative utterance with 100 acoustic frames and 10 output tokens has a $100:10=10:1$ frame-to-token compression ratio.</p>"
  },
  {
    title: "Meeting captioning",
    background: "<p>Captioning services score each frame with acoustic logits, then decode those probabilities into words. Stable softmax normalization avoids overflow and makes frame evidence comparable.</p>",
    numbers: "<p>For lesson logits $[1.2,0.3,-0.7]$, subtracting the max gives evidence $[e^0,e^{-0.9},e^{-1.9}]=[1.000,0.407,0.150]$, probabilities $[0.643,0.261,0.096]$, and cross-entropy $-\log(0.643)=0.442$ for the first class.</p>"
  },
  {
    title: "Contact-center transcription",
    background: "<p>Phones and words last across multiple frames, so call-center ASR cannot treat every 10 ms slice as independent. HMM-style recurrences preserve duration state.</p>",
    numbers: "<p>The lesson recurrence $\alpha_t(j)=B_j(x_t)\sum_i\alpha_{t-1}(i)A_{ij}$ carries state across frames; with three lesson frames the normalized final state probabilities are $[0.173,0.329,0.497]$.</p>"
  },
  {
    title: "In-car command recognition",
    background: "<p>Voice commands in cars need both acoustic evidence and language constraints because noise can make frame probabilities ambiguous. The language model must help without hallucinating a fluent wrong command.</p>",
    numbers: "<p>With illustrative weights 0.7 acoustic and 0.3 language-model, a combined score can be written as $0.7\log B_j(x_t)+0.3\log P_{LM}(j)$ for each candidate state.</p>"
  },
  {
    title: "Accessibility live captions",
    background: "<p>Users experience transcript errors, not frame errors. Word error rate counts substitutions, deletions, and insertions after decoding.</p>",
    numbers: "<p>If one substitution occurs in a 5-word utterance, the illustrative WER is $\frac{1}{5}=0.20=20\%$. The lesson's harsher example with $S=D=I=1$ gives $\frac{1+1+1}{5}=0.600$.</p>"
  }
];

(window.ALLML_CONTENT["13.3"] = window.ALLML_CONTENT["13.3"] || {}).applications = [
  {
    title: "End-to-end ASR training",
    background: "<p>CTC lets an ASR model train from transcripts without knowing which frame emitted each character. It sums all monotonic alignments that collapse to the same text.</p>",
    numbers: "<p>An illustrative 300-frame utterance aligned to 10 characters has a $300:10=30:1$ frame-to-character gap, which is exactly the missing-alignment problem CTC addresses.</p>"
  },
  {
    title: "Handwriting and OCR recognition",
    background: "<p>OCR and handwriting systems also see long frame or column sequences but short text labels. Blank states allow the model to spend time between visible characters.</p>",
    numbers: "<p>For the lesson path blank, blank, $a$, the probability is $0.6\cdot0.5\cdot0.6=0.180$, and it collapses to target $a$.</p>"
  },
  {
    title: "Captcha and audio-token alignment",
    background: "<p>Token alignment tasks can enumerate tiny examples to build intuition, then switch to dynamic programming for realistic lengths. The alphabet includes blank plus symbols.</p>",
    numbers: "<p>With 3 frames and alphabet $[\varnothing,a,b]$, there are $3^3=27$ raw paths. The lesson target $a$ receives total probability $P(a\mid x)=0.498$ after summing valid paths.</p>"
  },
  {
    title: "Lip-reading sequence labels",
    background: "<p>Repeated letters are a common CTC trap. Because CTC merges repeats before deleting blanks, adjacent identical symbols need a separating blank to remain distinct.</p>",
    numbers: "<p>A target such as two $l$ letters needs a path like $l,\varnothing,l$; a path $l,l$ collapses repeats first and becomes just one $l$.</p>"
  },
  {
    title: "Command-word spotting",
    background: "<p>Short voice commands often stretch over more acoustic frames than output labels. CTC is useful when the ordering is monotonic and left-to-right.</p>",
    numbers: "<p>An illustrative two-token command over 5 frames uses path length 5 but target length 2, so three positions are alignment slack handled by repeats and blanks.</p>"
  }
];

(window.ALLML_CONTENT["13.4"] = window.ALLML_CONTENT["13.4"] || {}).applications = [
  {
    title: "Screen-reader voices",
    background: "<p>Screen readers turn text tokens into acoustic frames. Duration prediction is the visible alignment step before any mel spectrogram or waveform is produced.</p>",
    numbers: "<p>For lesson durations $[2,1,2,1]$, the total frame count is $T=2+1+2+1=6$, with token starts $[0,2,3,5]$ and expansion $[h,h,e,l,l,o]$.</p>"
  },
  {
    title: "Navigation prompts",
    background: "<p>Navigation voices must sound intelligible and prosodic, so TTS predicts pitch as well as spectral shape. A pitch term discourages flat, lifeless speech.</p>",
    numbers: "<p>Using the lesson form $\|\hat M-M\|_1+\lambda_f\|\hat f_0-f_0\|_1$ with illustrative $\lambda_f=0.5$, a pitch absolute error of 4 Hz contributes $0.5\cdot4=2$ loss units.</p>"
  },
  {
    title: "Call-center virtual agents",
    background: "<p>Virtual agents vary speaking rate by changing token durations while preserving the same phrase. Longer durations produce slower speech and more acoustic frames.</p>",
    numbers: "<p>Increasing four illustrative token durations from $[2,1,2,1]$ to $[3,2,3,2]$ changes total frames from 6 to $3+2+3+2=10$.</p>"
  },
  {
    title: "Audiobook narration",
    background: "<p>Narration quality depends on prosody, not only intelligibility. A mel prediction can look plausible while pitch remains too flat.</p>",
    numbers: "<p>The lesson pitch contour $[180,190,210,200,170,160]$ has mean $185.0$ Hz and range $210-160=50$ Hz. A flat six-frame contour has range 0 Hz.</p>"
  },
  {
    title: "Voice cloning prototypes",
    background: "<p>Voice cloning conditions acoustic prediction on speaker identity while still expanding the text into frame-level targets. The alignment determines how many frames each mel bin must match.</p>",
    numbers: "<p>A 4-token phrase expanded to 6 frames creates 6 acoustic targets per mel bin; with 24 illustrative mel bins, that is $6\cdot24=144$ scalar mel targets.</p>"
  }
];

/* ---- _apps-part13-B.js ---- */
(window.ALLML_CONTENT["13.5"] = window.ALLML_CONTENT["13.5"] || {}).applications = [
  { title: "Pretraining ASR encoders", background: "<p>wav2vec-style systems use large unlabeled speech collections before any transcript loss is applied, reducing the amount of labeled audio needed for ASR.</p>", numbers: "<p>The lesson contrastive decision has 1 positive and 1 negative, so the model chooses among 2 candidates; a no-skill top-1 baseline is $1/2=0.5$.</p>" },
  { title: "Low-resource language bootstrapping", background: "<p>When transcripts are scarce, self-supervised audio can still learn phonetic structure from raw recordings and transfer it to a small supervised task.</p>", numbers: "<p>With cosine similarities $[0.800,0.100]$ and $\tau=0.1$, scaled scores are $[8,1]$, giving positive probability about $0.9991$ and loss about $0.0009$.</p>" },
  { title: "Speaker and task transfer features", background: "<p>Masked prediction creates reusable frame representations for speaker, event, and ASR models without changing the upstream encoder.</p>", numbers: "<p>An illustrative 20 masked frames in 100 total frames gives a mask rate of $20/100=0.20$.</p>" },
  { title: "Audio search embeddings", background: "<p>Contrastive audio search trains query and clip embeddings so acoustically similar clips land near one another while distractors are pushed away.</p>", numbers: "<p>Adding 9 negatives to 1 positive makes a 10-way decision, so a random top-1 baseline is $1/10=0.10$.</p>" },
  { title: "Recording quality monitoring", background: "<p>HuBERT-like cluster targets can reveal noisy or unstable regions when frames no longer fit learned acoustic units.</p>", numbers: "<p>With 3 balanced clusters over 60 frames, each cluster would contain $60/3=20$ frames.</p>" }
];

(window.ALLML_CONTENT["13.6"] = window.ALLML_CONTENT["13.6"] || {}).applications = [
  { title: "Voice login", background: "<p>Speaker verification compares a query voice embedding with enrolled identities to decide whether to accept access.</p>", numbers: "<p>The lesson query $[1,2]$ versus $A=[1.2,2.1]$ has cosine $0.998$, which passes the illustrative threshold because $0.998\gt0.75$.</p>" },
  { title: "Fraud detection in calls", background: "<p>Call-risk systems compare voices against known or enrolled speakers and reject embeddings that point in a different direction.</p>", numbers: "<p>The query versus impostor $B=[-1,0]$ has cosine $-0.447$, far below $0.75$, so it is rejected.</p>" },
  { title: "Meeting diarization", background: "<p>Diarization turns a meeting into speaker-labeled time spans, making transcripts searchable by who spoke when.</p>", numbers: "<p>Two speakers with 15 s each in a 60 s meeting produce $30/60=0.50$ speech coverage in the illustrative plan example.</p>" },
  { title: "Podcast speaker turns", background: "<p>Segment embeddings can be clustered so hosts, guests, and callers are separated without manual labels for every turn.</p>", numbers: "<p>If 12 segments split evenly across 3 speakers, each speaker contributes $12/3=4$ segments.</p>" },
  { title: "Personalized TTS conditioning", background: "<p>Speaker embeddings can condition generated voices while the same cosine threshold logic checks whether the target voice was matched.</p>", numbers: "<p>The lesson verification score accepts because $0.998\gt0.75$, while the impostor score rejects because $-0.447\lt0.75$.</p>" }
];

(window.ALLML_CONTENT["13.7"] = window.ALLML_CONTENT["13.7"] || {}).applications = [
  { title: "Smart-home alarm detection", background: "<p>Small audio models can flag alarm-like frames and group them into events for home monitoring.</p>", numbers: "<p>The lesson probabilities $[0.1,0.7,0.8,0.2,0.6]$ thresholded at $0.5$ become labels $[0,1,1,0,1]$.</p>" },
  { title: "Wildlife acoustic monitoring", background: "<p>Long field recordings can be scanned for short calls, saving biologists from listening to every clip manually.</p>", numbers: "<p>A 0.5 s call in a 10 s recording occupies $0.5/10=0.05$, or 5% of the clip.</p>" },
  { title: "Factory anomaly monitoring", background: "<p>Industrial recordings may contain overlapping normal and abnormal sounds, so each event class needs its own sigmoid probability.</p>", numbers: "<p>Two active sounds in one frame require two labels equal to 1; a softmax over two classes cannot assign both as active because its probabilities must sum to 1.</p>" },
  { title: "Video safety tagging", background: "<p>Audio events such as crashes, shouting, or sirens can help tag video segments for safety review.</p>", numbers: "<p>Raising the lesson threshold from $0.5$ to $0.75$ keeps only the $0.8$ frame, changing $[0,1,1,0,1]$ to $[0,0,1,0,0]$.</p>" },
  { title: "Urban sound maps", background: "<p>City-scale sound maps summarize detected events with precision, recall, and F1 rather than only average loss.</p>", numbers: "<p>For the lesson thresholded labels, true positives are 3 and false positives and false negatives are 0, so precision $=1$, recall $=1$, and F1 $=1.000$.</p>" }
];

(window.ALLML_CONTENT["13.8"] = window.ALLML_CONTENT["13.8"] || {}).applications = [
  { title: "Music key and chroma displays", background: "<p>MIR tools fold spectral energy into 12 pitch classes so musicians can see the harmonic center of a clip.</p>", numbers: "<p>The lesson formula $c(f)=\operatorname{round}(12\log_2(f/440))\bmod 12$ maps 440 Hz to chroma class 0.</p>" },
  { title: "Tempo estimation in DJ tools", background: "<p>Beat trackers estimate tempo so tracks can be aligned, looped, or searched by rhythmic feel.</p>", numbers: "<p>With beat interval $\Delta t=0.5$ s, $\mathrm{BPM}=60/0.5=120$ BPM.</p>" },
  { title: "Cover-song matching", background: "<p>Chroma features let matching systems compare songs even when melodies move between octaves.</p>", numbers: "<p>440 Hz and 880 Hz differ by one octave; the modulo-12 chroma formula folds both to the same pitch class.</p>" },
  { title: "Drum and onset transcription", background: "<p>Onset detectors find transient hits, but MIR systems must separate raw onset rate from a stable beat period.</p>", numbers: "<p>Eight transients over 4 s give onset rate $8/4=2$ Hz, which is not automatically the same as 120 BPM.</p>" },
  { title: "Melody generation", background: "<p>Generated music can sample from a next-note distribution instead of always choosing the most likely note.</p>", numbers: "<p>If a 4-note distribution has maximum probability 0.55, the alternative notes still carry $1-0.55=0.45$ probability mass.</p>" }
];

