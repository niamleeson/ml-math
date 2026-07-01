# Part 13 — Speech & Audio

> Plan only — per-topic revamp plan. See ../00-MASTER-PLAN.md for the shared design & family registry (F1–F17).
> **Code style:** every notebook code cell is written one statement per line (newline-split, blank lines between logical groups) for readability — never dense, semicolon-packed one-liners. See ../00-MASTER-PLAN.md §B.4.
> Dominant family: F7 (Sequence/NLP — audio-as-sequence).

### 13.1 — Audio representation (waveform, spectrogram, MFCC)   [notebook: 13.1-audio-representation.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Voice assistants' front-end features — convert microphone pressure at lesson rate $f_s=8000$ Hz into frames; a 440 Hz tone has $x[1]=0.339$ (lesson).
2. Keyword spotting on embedded devices — use STFT bins instead of raw samples; with $N=256$ at 8000 Hz, bin spacing is $31.25$ Hz and 440 Hz maps near 437.5 Hz (lesson).
3. Call-center speech analytics — summarize long calls as MFCC-like log filterbank vectors; use 20 mel bands as an illustrative compact feature count.
4. Music pitch displays — spectrogram peaks expose tone frequency; a 512-sample window at 8000 Hz gives $8000/512=15.625$ Hz bins (illustrative).
5. Acoustic anomaly monitoring — log-energy features need a floor; set empty-band energy to $10^{-6}$ before $\log E$ so the value is finite at about $-13.8$ (illustrative).

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `represent_audio(x, fs, n_fft, hop)` for waveform, STFT magnitude, log energy, and MFCC-like DCT; verify the lesson's 440 Hz at 8000 Hz first samples and the 437.5 Hz nearest bin for $N=256$.
- Datasets D1–D5: D1 single synthetic sine · D2 two-tone · D3 +noise · D4 chirp/multi-segment synthetic · D5 longer/noisier segment
- Metric: peak-frequency reconstruction error across rungs.
- Closing viz: (a) waveform plus spectrogram panels per rung  (b) frequency-error-vs-complexity curve.
- Pitfall on D5: long STFT windows smear onsets; reproduce with one transient segment, then fix by reducing window length and keeping a log floor.
- Notes: delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).

### 13.2 — Automatic Speech Recognition   [notebook: 13.2-asr.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Voice dictation — decode many acoustic frames into fewer words; illustrate 100 frames to 10 tokens as a $10:1$ compression.
2. Captioning meetings — score frame symbols with softmax; lesson logits $[1.2,0.3,-0.7]$ yield normalized evidence after max-shift $[1.000,0.407,0.150]$.
3. Contact-center transcription — HMM-style decoding keeps duration state via $\alpha_t(j)$ instead of labeling each 10 ms frame independently (10 ms from lesson intuition).
4. In-car command recognition — combine acoustic emissions and language constraints; use an illustrative acoustic weight of 0.7 and LM weight of 0.3.
5. Accessibility live captions — evaluate transcript quality rather than frame accuracy; one substitution in a 5-word utterance gives illustrative WER $1/5=20\%$.

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `decode_asr(frames, emissions, transitions, lm_weight)` using softmax probabilities and Viterbi/forward-style recurrence; verify the lesson's logits normalization and one-frame cross-entropy.
- Datasets D1–D5: D1 single synthetic sine token · D2 two-tone two-word command · D3 +noise · D4 chirp/multi-segment synthetic utterance · D5 longer/noisier segment with repeated tokens
- Metric: transcript exact-match accuracy across rungs.
- Closing viz: (a) spectrogram panels with decoded token timelines per rung  (b) accuracy-vs-complexity curve.
- Pitfall on D5: language model overpowers acoustics; reproduce a fluent wrong command, then fix by lowering LM weight and adding duration constraints.
- Notes: delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).

### 13.3 — CTC & sequence transduction   [notebook: 13.3-ctc-sequence-transduction.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. End-to-end ASR training — train from transcripts without frame labels; 300 acoustic frames to 10 characters is an illustrative $30:1$ alignment gap.
2. OCR handwriting recognition — sum frame paths that collapse to text; lesson path blank, blank, $a$ has probability $0.6\cdot0.5\cdot0.6=0.180$.
3. Captcha/audio-token alignment — blanks handle pauses; for 3 frames and alphabet $[\varnothing,a,b]$, there are $3^3=27$ raw paths (lesson setup).
4. Lip-reading sequence labels — repeated letters require blanks because CTC merges repeats before deleting blanks; two $l$ letters need an intervening blank path (lesson pitfall).
5. Command-word spotting — use monotonic left-to-right alignment; a two-token command over 5 frames has illustrative path length 5 but target length 2.

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `ctc_score(probs, target, blank)` with collapse and dynamic programming; verify the lesson's $P(\text{blank,blank,a})=0.180$ and show all paths for target `a` on 3 frames.
- Datasets D1–D5: D1 single synthetic sine labeled `a` · D2 two-tone `ab` · D3 +noise frame probabilities · D4 chirp/multi-segment synthetic word · D5 longer/noisier repeated-letter segment
- Metric: sequence exact-match accuracy across rungs.
- Closing viz: (a) spectrogram plus CTC alignment heatmaps per rung  (b) sequence-accuracy-vs-complexity curve.
- Pitfall on D5: using only the best path underestimates sequence probability; reproduce argmax-only failure, then fix by summing all CTC alignments with correct collapse order.
- Notes: delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).

### 13.4 — Text-to-Speech synthesis   [notebook: 13.4-tts-synthesis.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Screen-reader voices — expand text tokens into acoustic frames; lesson durations $[2,1,2,1]$ create $2+1+2+1=6$ frames.
2. Navigation prompts — predict pitch as well as mel bins; use lesson loss form $\|\hat M-M\|_1+\lambda_f\|\hat f_0-f_0\|_1$ with illustrative $\lambda_f=0.5$.
3. Call-center virtual agents — vary speaking rate by durations; increasing four token durations from $[2,1,2,1]$ to $[3,2,3,2]$ gives 10 frames (illustrative).
4. Audiobook narration — preserve prosody; a flat $f_0$ over 6 frames has zero pitch range, illustrating the lesson's lifeless-speech pitfall.
5. Voice cloning prototypes — condition on speaker embedding while predicting mel frames; a 4-token phrase expanded to 6 frames gives 6 acoustic targets per mel bin (lesson).

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `synthesize_mel(tokens, durations, pitch)` that expands token states and predicts a toy mel contour; verify the lesson's $T=6$ from durations $[2,1,2,1]$ and compute L1 reconstruction.
- Datasets D1–D5: D1 single synthetic sine/vowel token · D2 two-tone token sequence · D3 +noise in mel targets · D4 chirp/multi-segment synthetic phrase · D5 longer/noisier phrase with duration mismatch
- Metric: mel reconstruction MAE across rungs.
- Closing viz: (a) target vs predicted mel/spectrogram panels per rung  (b) MAE-vs-complexity curve.
- Pitfall on D5: duration alignment drift causes skipped/repeated sounds; reproduce wrong $\sum_i d_i$, then fix by normalizing durations to the target frame count and adding pitch loss.
- Notes: delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).

### 13.5 — Self-supervised audio (wav2vec, HuBERT)   [notebook: 13.5-self-supervised-audio.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Pretraining ASR encoders — use unlabeled speech before transcripts; one contrastive decision in the lesson compares 1 positive and 1 negative.
2. Low-resource language bootstrapping — cosine similarities $[0.800,0.100]$ with $\tau=0.1$ become a sharp contrastive softmax (lesson numbers).
3. Speaker/task transfer features — mask frames and predict bootstrap clusters; 20 masked frames in 100 is an illustrative 20% mask rate.
4. Audio search embeddings — hard negatives teach fine distinctions; adding 9 negatives makes a 10-way contrastive decision (illustrative).
5. Quality monitoring for recordings — cluster-label pretext tasks flag noisy regions; 3 clusters over 60 frames gives 20 frames per cluster if balanced (illustrative).

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `contrastive_audio_score(context, positive, negatives, tau)` and a masked-cluster variant; verify lesson cosines $0.800$ and $0.100$ with $\tau=0.1$.
- Datasets D1–D5: D1 single synthetic sine patch · D2 two-tone positive/negative pair · D3 +noise negatives · D4 chirp/multi-segment synthetic contexts · D5 longer/noisier segment with easy and hard negatives
- Metric: contrastive top-1 accuracy across rungs.
- Closing viz: (a) masked waveform/spectrogram panels plus positive-negative similarity bars per rung  (b) top-1-vs-complexity curve.
- Pitfall on D5: negatives that are too easy make the loss tiny without learning acoustics; reproduce easy-negative success, then fix with same-frequency/noisy hard negatives and a calibrated mask rate.
- Notes: delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).

### 13.6 — Speaker identification & diarization   [notebook: 13.6-speaker-diarization.ipynb]   (family: F7, gap)

**Lesson — Real World Applications (5):**
1. Voice login — compare query and enrolled embeddings; lesson query $[1,2]$ vs $A=[1.2,2.1]$ has cosine $0.998$.
2. Fraud detection in calls — reject impostors; lesson query vs $B=[-1,0]$ has cosine $-0.447$, far below threshold 0.75.
3. Meeting diarization — label who spoke when; two speakers over 60 s with 15 s each is an illustrative 50% speech coverage.
4. Podcast speaker turns — cluster segment embeddings; 12 segments split across 3 speakers gives 4 segments per speaker if balanced (illustrative).
5. Personalized TTS conditioning — reuse speaker embeddings for voice style; threshold $0.75$ accepts $0.998\gt0.75$ in the lesson's verification example.

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `speaker_verify(query, enrollments, threshold)` using normalized cosine plus simple segment clustering; verify lesson cosines $0.998$ and $-0.447$ and threshold 0.75.
- Datasets D1–D5: D1 single synthetic sine speaker · D2 two-tone two-speaker segments · D3 +noise/mic gain · D4 chirp/multi-segment synthetic conversation · D5 longer/noisier segment with overlap
- Metric: speaker/segment assignment accuracy across rungs.
- Closing viz: (a) waveform/spectrogram timelines colored by speaker per rung  (b) assignment-accuracy-vs-complexity curve.
- Pitfall on D5: unnormalized dot products let loudness/norm masquerade as identity; reproduce gain-biased assignment, then fix with cosine normalization and overlap-aware labels.
- Notes: gap topic: lesson content is present but flagged `gap:true`; delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).

### 13.7 — Sound event detection   [notebook: 13.7-sound-event-detection.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Smart-home alarm detection — label event frames independently with sigmoid; lesson probabilities $[0.1,0.7,0.8,0.2,0.6]$ threshold at 0.5 to $[0,1,1,0,1]$.
2. Wildlife acoustic monitoring — detect brief calls in long clips; one 0.5 s event in a 10 s recording occupies 5% of the clip (lesson intuition numbers).
3. Factory anomaly monitoring — support overlapping events; two active sounds in one frame require multilabel probabilities, not softmax (lesson pitfall).
4. Video safety tagging — tune operating point; raising threshold from 0.5 to 0.75 keeps only the 0.8 frame from the lesson probabilities.
5. Urban sound maps — report precision/recall/F1; with lesson thresholded labels matching truth, illustrative frame F1 is 1.0.

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `detect_events(frame_features, threshold)` with sigmoid/BCE and grouping; verify lesson BCE average 0.284 and thresholded labels at 0.5.
- Datasets D1–D5: D1 single synthetic sine event · D2 two-tone non-overlap events · D3 +noise · D4 chirp/multi-segment synthetic events · D5 longer/noisier segment with overlapping events
- Metric: frame/event F1 across rungs.
- Closing viz: (a) spectrogram panels with predicted and true event intervals per rung  (b) F1-vs-complexity curve.
- Pitfall on D5: softmax cannot represent overlapping events and threshold choice can flicker; reproduce missed overlap, then fix with independent sigmoids plus calibrated threshold and duration smoothing.
- Notes: delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).

### 13.8 — Music information retrieval & generation   [notebook: 13.8-music-ir-generation.ipynb]   (family: F7)

**Lesson — Real World Applications (5):**
1. Music key/chroma displays — fold frequency into 12 pitch classes; lesson 440 Hz maps to chroma class 0.
2. Tempo estimation in DJ tools — compute $\mathrm{BPM}=60/\Delta t$; beat interval $\Delta t=0.5$ s gives 120 BPM (illustrative from lesson formula).
3. Cover-song matching — octave folding makes same pitch class align; 440 Hz and 880 Hz differ by one octave but both map modulo 12 (lesson formula).
4. Drum/onset transcription — separate onset rate from tempo; 8 transients over 4 s is 2 Hz onset rate, not necessarily 120 BPM (illustrative).
5. Melody generation — sample from softmax rather than argmax; a 4-note distribution with max probability 0.55 still leaves 45% alternative mass (illustrative).

**Notebook plan:**
- Family: F7 Sequence/NLP (audio)
- Concept built once (D1): implement `music_features_and_generate(x, fs)` for chroma, beat intervals, and next-note sampling; verify lesson pitch-class formula maps 440 Hz to class 0 and use a 512-point FFT at 8000 Hz.
- Datasets D1–D5: D1 single synthetic sine note · D2 two-tone interval · D3 +noise · D4 chirp/multi-segment synthetic melody · D5 longer/noisier melody with octave shifts and repetitive decoding
- Metric: pitch-class/beat recognition accuracy across rungs.
- Closing viz: (a) chroma/spectrogram and generated-note panels per rung  (b) recognition-accuracy-vs-complexity curve.
- Pitfall on D5: treating frequency as pitch without octave folding and always taking argmax in generation; reproduce octave mismatch/repetition, then fix with chroma modulo 12 and stochastic sampling.
- Notes: delete dead template helpers; CPU-only, synthesize audio with NumPy (no large audio downloads).
