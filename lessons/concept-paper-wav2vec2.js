/* Paper lesson — "wav2vec 2.0: A Framework for Self-Supervised Learning of Speech
   Representations", Baevski, Zhou, Mohamed, Auli 2020 (Facebook AI).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-wav2vec2".
   GROUNDED from arXiv:2006.11477 via the ar5iv HTML mirror:
     - contrastive loss L_m  (Eqn. 3, §3.2)
     - diversity loss   L_d  (Eqn. 4, §3.2)
     - total loss       L = L_m + alpha L_d  (Eqn. 2, §3.2)
     - masking (§4.2), feature encoder + context network + quantizer (§2, §4.2)
     - results (§5, Tables 1-2).
   Track B (architecture): build the MASKED CONTRASTIVE objective by hand on toy latent
   speech sequences -- a tiny context transformer must pick the TRUE quantized latent out of
   {true + K distractors} (InfoNCE). Pretrain; the pick-the-true-target accuracy climbs well
   above chance; ABLATION (remove masking) leaves it at chance.
   conceptLink is null (no single existing concept owns this); we recap the math in-lesson and
   cross-link paper-bert (masked prediction) and paper-simclr (contrastive learning). */
(function () {
  window.LESSONS.push({
    id: "paper-wav2vec2",
    title: "wav2vec 2.0 — Self-Supervised Learning of Speech Representations (2020)",
    tagline: "Learn speech from raw audio with no transcripts: mask latent frames and learn by a contrastive game over quantized targets; then fine-tune on tiny labeled data.",
    module: "Papers · Speech & Audio",
    track: "architecture",
    paper: {
      authors: "Alexei Baevski, Henry Zhou, Abdelrahman Mohamed, Michael Auli",
      org: "Facebook AI",
      year: 2020,
      venue: "arXiv:2006.11477 (Jun 2020); NeurIPS 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2006.11477",
      code: "https://github.com/facebookresearch/fairseq"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["paper-bert", "paper-simclr", "paper-vqvae", "dl-cosine-similarity", "dl-cross-entropy", "pt-nn-module", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p>To teach a computer to turn <b>speech</b> (an audio waveform) into <b>text</b> — this is called
       <b>automatic speech recognition</b> (ASR, recognizing words from sound) — the usual recipe needs
       thousands of hours of audio that humans have hand-transcribed. Transcribing audio is slow and costly,
       and for most of the world's ~7,000 languages almost none exists.</p>
       <p>Meanwhile, <i>unlabeled</i> audio (sound with no transcript) is everywhere. The paper's question
       (§1): can a model learn a good <b>representation</b> of speech — a vector summary of each short slice
       of sound — from unlabeled audio alone, so that afterward only a <i>tiny</i> amount of transcribed
       audio is enough to build a good recognizer? This is <b>self-supervised learning</b>: the data
       supervises itself, no human labels in the first stage.</p>`,
    contribution:
      `<ul>
        <li><b>A masked contrastive task for audio.</b> Take continuous audio, turn it into a sequence of
            <b>latent frames</b> (vectors), then <b>mask</b> (hide) spans of them — exactly like
            <code>paper-bert</code> hides words. The model must fill in each hidden frame, but not by
            predicting raw audio; it predicts by a <b>contrastive</b> game (see <code>paper-simclr</code>):
            pick the one TRUE answer out of a pile of decoys.</li>
        <li><b>Quantized targets via product quantization.</b> The "answers" are not the raw latent vectors
            but <b>quantized</b> ones — each latent is snapped to a small fixed <b>codebook</b> of discrete
            entries (built on <code>paper-vqvae</code>'s discrete-code idea). This gives a finite, stable set
            of targets to contrast against.</li>
        <li><b>Learn end-to-end, then fine-tune cheaply.</b> The masking, the contrastive loss, and the
            codebook are learned jointly. Afterward, a small labeled set plus a
            <b>connectionist temporal classification</b> (CTC) head — a way to train sequence labeling
            without frame-by-frame alignment — turns the pretrained model into a recognizer.</li>
       </ul>`,
    whyItMattered:
      `<p>It showed strong speech recognition is possible with <b>orders of magnitude less labeled data</b>.
       The paper reports (§5, abstract) that with only <b>10 minutes</b> of labeled audio (and the large
       LV-60k pretraining set) it reaches <b>4.8 / 8.2</b> word error rate (WER, the percentage of words
       wrong) on LibriSpeech test-clean / test-other. It became the template for self-supervised speech
       (HuBERT, <code>paper-conformer</code>-based systems, Whisper-era pipelines) and for low-resource and
       multilingual ASR. The "mask latents + contrast over quantized codes" pattern is the core idea.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b> §2 (Model: feature encoder, context network, quantization), §3.2 (Objective —
       the three loss equations, this is the math heart), §4.2 (Masking + hyper-parameters). <b>Skim:</b>
       §4.1/§4.3 (datasets, fine-tuning details), §5 Tables 1-2 (read the headline rows, not every column).
       <b>Figure 1</b> is the one-picture summary: raw audio &rarr; CNN latents Z &rarr; mask &rarr;
       Transformer context C, with quantized targets Q feeding the contrastive loss. Keep it open while you
       read §3.2.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Before running: a tiny context network sees latent speech frames with random spans hidden, and for
       each hidden frame must pick its TRUE quantized target out of itself plus <b>K random decoys</b>
       (distractors) drawn from other hidden frames. Pure guessing gives accuracy
       $\\frac{1}{K+1}$. <b>Will contrastive pretraining push the pick-the-true accuracy clearly above
       chance? And if we remove the masking, will any learning signal remain?</b></p>`,
    attempt:
      `<p>Implement (mirrors CODE):</p>
       <ol>
        <li>Make toy "latent speech": smooth autoregressive vector sequences (each frame depends on the
            previous one, so neighbors are predictive).</li>
        <li>Quantize each frame to a fixed toy codebook (product quantization, $G$ groups).</li>
        <li>A small Transformer <i>context network</i>: replace masked frames with a learned mask vector,
            run the Transformer, read out a context vector $\\mathbf{c}_t$ at each masked position.</li>
        <li>Contrastive loss: for each masked $t$, score $\\mathbf{c}_t$ against {true $\\mathbf{q}_t$ + K
            distractors} by cosine similarity over temperature $\\kappa$, cross-entropy toward the true one.</li>
        <li>ABLATION: set the mask to empty (nothing hidden) and train to merely reconstruct &mdash; then
            measure the same pick-the-true accuracy. (TODO: predict the ablation curve first.)</li>
       </ol>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p><b>Step 1 — raw audio to latents (feature encoder, §2).</b> A stack of <b>7 convolutional blocks</b>
       (512 channels, strides 5,2,2,2,2,2,2) slides over the raw waveform and outputs one latent vector about
       every 20&nbsp;ms (~49 vectors per second). Call this sequence
       $\\mathbf{z}_1,\\dots,\\mathbf{z}_T$. A convolution here is a small learned filter swept across the
       signal; "stride" is how far it hops each step.</p>
       <p><b>Step 2 — mask spans (§4.2).</b> Randomly choose starting frames (proportion $p=0.065$) and hide
       $M=10$ frames from each start, so ~49% of frames end up masked (mean masked span ~299&nbsp;ms). A hidden
       frame's latent is replaced by a single learned <b>mask vector</b>, shared everywhere &mdash; the model
       cannot see what was there. This is BERT's masked language modeling (<code>paper-bert</code>) moved to
       audio.</p>
       <p><b>Step 3 — context network (§2).</b> A <b>Transformer</b> (Base: 12 blocks, 768-dim; Large: 24
       blocks, 1024-dim) reads the whole masked sequence and produces a <b>context vector</b>
       $\\mathbf{c}_t$ at every position. Because the Transformer sees all the <i>unmasked</i> neighbors, it
       can infer what belongs in a masked slot.</p>
       <p><b>Step 4 — quantize the targets (§2, the "answers").</b> Separately, each latent $\\mathbf{z}_t$ is
       turned into a <b>quantized</b> vector $\\mathbf{q}_t$ by <b>product quantization</b>: split the vector
       into $G$ groups, and in each group snap it to one of $V$ learned <b>codebook</b> entries. The pick is
       made differentiable with the <b>Gumbel-softmax</b> (a soft, trainable way to choose one entry) using
       the <b>straight-through estimator</b> (forward pass uses the hard pick; backward pass uses the soft
       gradient). The paper uses $G=2$ groups of $V=320$ entries. This is the discrete-code idea of
       <code>paper-vqvae</code>.</p>
       <p><b>Step 5 — the contrastive game (§3.2).</b> For each masked time $t$, the model must identify the
       true quantized target $\\mathbf{q}_t$ among a set $\\mathbf{Q}_t$ of $K+1$ candidates: the true one plus
       $K=100$ <b>distractors</b> uniformly sampled from <i>other masked steps of the same utterance</i>. It
       scores each candidate by <b>cosine similarity</b> to $\\mathbf{c}_t$, divides by a temperature $\\kappa$,
       and is trained (cross-entropy / <b>InfoNCE</b>) to put most weight on the true target. "InfoNCE" =
       Information Noise-Contrastive Estimation, the standard contrastive loss also behind
       <code>paper-simclr</code>.</p>
       <p><b>Step 6 — keep the codebook diverse (§3.2).</b> A second loss, the <b>diversity loss</b>, pushes the
       model to use all codebook entries roughly equally (otherwise it could collapse onto a few). Together
       they are minimized end-to-end. Afterward, fine-tune with a CTC head on a little labeled audio.</p>`,
    symbols: [
      { sym: "$\\mathbf{z}_t$", desc: "latent frame t — the CNN feature encoder's output vector for one ~20 ms slice of raw audio." },
      { sym: "$\\mathbf{c}_t$", desc: "context vector at time t — the Transformer context network's output, having seen the (partly masked) whole sequence." },
      { sym: "$\\mathbf{q}_t$", desc: "the true quantized target at time t — z_t snapped to codebook entries (product quantization)." },
      { sym: "$\\mathbf{\\tilde{q}}$", desc: "a candidate quantized vector (read 'q-tilde'): either the true q_t or a distractor." },
      { sym: "$\\mathbf{Q}_t$", desc: "the candidate set at time t: the true target plus K distractors, so K+1 vectors total." },
      { sym: "$K$", desc: "number of distractors (decoys) — wrong quantized targets sampled from other masked steps of the same utterance. Paper: K=100." },
      { sym: "$\\text{sim}(\\mathbf{a},\\mathbf{b})$", desc: "cosine similarity = a·b / (||a|| ||b||): the cosine of the angle between two vectors, in [-1, 1]." },
      { sym: "$\\kappa$", desc: "temperature (Greek 'kappa') — divides the similarity scores; small kappa sharpens the softmax. Paper: kappa=0.1." },
      { sym: "$\\mathcal{L}_m$", desc: "the contrastive (masked) loss — the InfoNCE term that makes c_t identify the true q_t." },
      { sym: "$\\mathcal{L}_d$", desc: "the diversity loss — encourages equal use of all codebook entries." },
      { sym: "$G$", desc: "number of codebook groups in product quantization (paper: G=2). The latent is split into G parts, each quantized separately." },
      { sym: "$V$", desc: "number of entries per codebook group (paper: V=320). So G·V possible codes per group-product." },
      { sym: "$\\bar{p}_{g,v}$", desc: "the batch-averaged soft-assignment probability of group g picking entry v — used by the diversity loss." },
      { sym: "$H(\\bar{p}_g)$", desc: "the entropy of group g's average usage distribution — high when entries are used evenly." },
      { sym: "$\\alpha$", desc: "weight on the diversity loss in the total objective (paper: alpha=0.1)." }
    ],
    formula:
      `$$\\mathcal{L}=\\mathcal{L}_m+\\alpha\\,\\mathcal{L}_d \\qquad(\\text{Eqn. 2})$$
       $$\\mathcal{L}_m=-\\log\\frac{\\exp\\!\\big(\\text{sim}(\\mathbf{c}_t,\\mathbf{q}_t)/\\kappa\\big)}
        {\\sum_{\\mathbf{\\tilde{q}}\\sim\\mathbf{Q}_t}\\exp\\!\\big(\\text{sim}(\\mathbf{c}_t,\\mathbf{\\tilde{q}})/\\kappa\\big)}
        \\qquad(\\text{Eqn. 3})$$
       $$\\mathcal{L}_d=\\frac{1}{GV}\\sum_{g=1}^{G}-H(\\bar{p}_g)
        =\\frac{1}{GV}\\sum_{g=1}^{G}\\sum_{v=1}^{V}\\bar{p}_{g,v}\\log\\bar{p}_{g,v}\\qquad(\\text{Eqn. 4})$$`,
    whatItDoes:
      `<p><b>Eqn. 3 ($\\mathcal{L}_m$)</b> is a softmax cross-entropy that asks: "out of the true target and all
       its decoys, how confidently does $\\mathbf{c}_t$ point at the TRUE quantized target $\\mathbf{q}_t$?"
       The numerator is the true target's score; the denominator sums over the whole candidate set. Minimizing
       $-\\log$ of that ratio makes the context vector align with the true target and away from distractors.
       This is the InfoNCE / contrastive form &mdash; same shape as <code>paper-simclr</code>'s NT-Xent.</p>
       <p><b>Eqn. 4 ($\\mathcal{L}_d$)</b> equals minus the average <b>entropy</b> of each group's codebook usage.
       Minimizing it <i>maximizes</i> entropy, i.e. pushes usage toward uniform &mdash; "to encourage the model
       to use the codebook entries equally often" (§3.2). It stops the codebook from collapsing onto a few
       entries. <b>Eqn. 2</b> just adds them with weight $\\alpha$.</p>`,
    derivation:
      `<p><b>Why the contrastive loss is just classification.</b> Treat the $K+1$ candidates as $K+1$ classes,
       with the true target as the correct class. The similarity-over-temperature scores
       $\\text{sim}(\\mathbf{c}_t,\\cdot)/\\kappa$ are logits; the softmax turns them into a probability over
       candidates; cross-entropy toward "true target = class 0" is exactly $-\\log$ of the true target's softmax
       probability &mdash; which is Eqn. 3. So $\\mathcal{L}_m$ is an ordinary cross-entropy whose "vocabulary"
       is one true item plus its sampled decoys (this sampling is what "noise-contrastive" means: instead of
       summing over every possible target, sum over the true one and a handful of noise samples).</p>
       <p><b>Why the diversity loss is an entropy.</b> For one group $g$, $\\bar{p}_g$ is a probability vector
       over the $V$ entries (how often, on average, that entry is chosen). Its entropy
       $H(\\bar{p}_g)=-\\sum_v \\bar{p}_{g,v}\\log\\bar{p}_{g,v}$ is largest when $\\bar{p}_g$ is uniform and
       smallest when it is a spike. Eqn. 4 sums $-H$ over groups (scaled by $1/GV$); minimizing it drives each
       $\\bar{p}_g$ toward uniform &mdash; full, even codebook use.</p>
       <p>(conceptLink is null: no single existing concept lesson owns this composite objective, so the full
       derivation lives here. The contrastive piece reuses <code>paper-simclr</code>'s InfoNCE and the masking
       reuses <code>paper-bert</code>'s masked-prediction idea.)</p>`,
    example:
      `<p><b>Part A — the contrastive term $\\mathcal{L}_m$ (Eqn. 3).</b> Use a context vector and 4 candidates
       (the true target + 3 distractors), in 2-D so the cosine is hand-checkable, with $\\kappa=0.1$:</p>
       <ul>
        <li>$\\mathbf{c}=(1,\\,1)$; true $\\mathbf{q}_t=(1,\\,0.9)$; distractors $\\mathbf{d}_1=(-1,\\,0.5)$,
            $\\mathbf{d}_2=(0.2,\\,-1)$, $\\mathbf{d}_3=(0.3,\\,1)$.</li>
        <li>Cosine sims: $\\text{sim}(\\mathbf{c},\\mathbf{q}_t)=0.9986$,
            $\\text{sim}(\\mathbf{c},\\mathbf{d}_1)=-0.3162$, $\\text{sim}(\\mathbf{c},\\mathbf{d}_2)=-0.5547$,
            $\\text{sim}(\\mathbf{c},\\mathbf{d}_3)=0.8805$. (Note $\\mathbf{d}_3$ is a <i>confusable</i> decoy.)</li>
        <li>Divide by $\\kappa=0.1$ &rarr; logits $9.986,\\,-3.162,\\,-5.547,\\,8.805$.</li>
        <li>Softmax over the 4 candidates &rarr; $0.7652,\\,0.0000,\\,0.0000,\\,0.2348$.</li>
        <li>$\\mathcal{L}_m=-\\log(0.7652)=\\mathbf{0.2676}$. The true target wins (76.5% of the mass), but the
            close decoy $\\mathbf{d}_3$ keeps the loss above zero &mdash; exactly the pressure that sharpens the
            representation.</li>
       </ul>
       <p><b>Part B — the diversity term $\\mathcal{L}_d$ (Eqn. 4).</b> Toy product quantization with $G=2$
       groups, $V=3$ entries each. Batch-averaged usage $\\bar{p}$:</p>
       <ul>
        <li>Group 1 (skewed): $\\bar{p}_1=(0.7,\\,0.2,\\,0.1)$, entropy $H(\\bar{p}_1)=0.8018$.</li>
        <li>Group 2 (near-uniform): $\\bar{p}_2=(0.34,\\,0.33,\\,0.33)$, entropy $H(\\bar{p}_2)=1.0985$.</li>
        <li>$\\mathcal{L}_d=\\frac{1}{GV}\\big(-H(\\bar{p}_1)-H(\\bar{p}_2)\\big)
            =\\frac{1}{6}(-0.8018-1.0985)=\\mathbf{-0.3167}$. The more uniform group 2 lowers (improves) it more.</li>
        <li>Total (Eqn. 2) with $\\alpha=0.1$: $\\mathcal{L}=0.2676+0.1\\cdot(-0.3167)=\\mathbf{0.2359}$.</li>
       </ul>
       <p>These exact numbers are recomputed in the notebook and must match.</p>`,
    recipe:
      `<ol>
        <li><b>Feature encoder:</b> raw audio &rarr; latent frames $\\mathbf{z}_t$ (7 conv blocks; here a toy
            autoregressive latent generator stands in).</li>
        <li><b>Quantizer:</b> snap each $\\mathbf{z}_t$ to product-quantization codes &rarr; targets
            $\\mathbf{q}_t$ ($G$ groups, $V$ entries; Gumbel-softmax + straight-through in the real model).</li>
        <li><b>Mask:</b> replace spans of latents with a learned mask vector.</li>
        <li><b>Context network:</b> Transformer over the masked latents &rarr; context vectors $\\mathbf{c}_t$.</li>
        <li><b>Contrastive loss $\\mathcal{L}_m$:</b> at each masked $t$, score $\\{\\mathbf{q}_t + K$ distractors$\\}$
            by cosine/$\\kappa$; cross-entropy toward $\\mathbf{q}_t$.</li>
        <li><b>Diversity loss $\\mathcal{L}_d$:</b> add $-$entropy of average codebook usage; total
            $\\mathcal{L}=\\mathcal{L}_m+\\alpha\\mathcal{L}_d$.</li>
        <li><b>Fine-tune:</b> add a CTC head, train on a little labeled audio.</li>
       </ol>`,
    results:
      `<p>From the paper (§5, Tables 1-2), low-resource LibriSpeech results (WER = word error rate, lower is
       better; clean / other test sets), pretrained on LV-60k:</p>
       <ul>
        <li>10 minutes labeled: <b>4.8 / 8.2</b></li>
        <li>1 hour labeled: <b>2.9 / 5.8</b></li>
        <li>100 hours labeled: <b>2.0 / 4.0</b></li>
        <li>Full 960 hours labeled: <b>1.8 / 3.3</b> (Large model)</li>
       </ul>
       <p>(All quoted from the fetched paper. The CODEVIZ numbers below are OURS, from a tiny toy run &mdash; not
       the paper's reported figures.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> We import the plumbing &mdash; <code>nn.TransformerEncoder</code>,
       <code>nn.Linear</code>, cosine similarity, cross-entropy &mdash; and build by hand only the
       <b>novel composition</b>: masking latent spans, the fixed product-quantization targets, and the
       <b>InfoNCE masked-contrastive loss</b> (Eqn. 3) over {true + K distractors}. We do NOT reproduce the raw
       7-layer audio CNN, the Gumbel-softmax codebook learning, real waveforms, CTC fine-tuning, or paper-scale
       numbers &mdash; those are imported or out of scope. The point we reproduce is the QUALITATIVE one: the
       masked contrastive task makes the context network learn to identify the true target far above chance, and
       removing the masking removes the signal (ablation).</p>`,
    pitfalls:
      `<ul>
        <li><b>Contrastive needs a hard task.</b> Distractors come from <i>other masked steps of the same
            utterance</i> (§4.2), not random noise &mdash; same-utterance decoys are harder, which is the point.
            Easy decoys make the loss trivial and the features useless.</li>
        <li><b>Don't confuse $\\mathbf{z}$, $\\mathbf{c}$, $\\mathbf{q}$.</b> $\\mathbf{z}$ = raw latent,
            $\\mathbf{c}$ = contextualized output (what makes the prediction), $\\mathbf{q}$ = quantized target
            (what it predicts). The loss aligns $\\mathbf{c}$ with $\\mathbf{q}$, never with $\\mathbf{z}$.</li>
        <li><b>Quantized, not continuous, targets.</b> Targets are codebook entries, giving a finite stable set
            to contrast against (the <code>paper-vqvae</code> idea). Predicting raw continuous latents is a
            different, weaker task.</li>
        <li><b>Diversity loss is minus entropy.</b> Minimizing $\\mathcal{L}_d$ maximizes entropy (uniform code
            use). Forgetting the sign flips it into <i>collapsing</i> the codebook.</li>
        <li><b>Two stages.</b> Self-supervised pretraining first; CTC fine-tuning second. The headline
            low-resource numbers are the fine-tuning result, not the pretraining loss.</li>
       </ul>`,
    recall: [
      "State the contrastive loss $\\mathcal{L}_m$ (Eqn. 3) from memory and name every symbol.",
      "What is $\\mathbf{Q}_t$, and where do the K distractors come from?",
      "Why is the diversity loss $\\mathcal{L}_d$ a NEGATIVE entropy, and what does minimizing it achieve?",
      "Define $\\mathbf{c}_t$ vs $\\mathbf{q}_t$ vs $\\mathbf{z}_t$.",
      "What does the temperature $\\kappa$ do to the candidate softmax?"
    ],
    practice: [
      {
        q: `Compute $\\mathcal{L}_m$ for a candidate set of 3 (true + 2 distractors) with logits (after sim/$\\kappa$) $= (4,\\,1,\\,0)$, true target first.`,
        steps: [
          { do: `Exponentiate: $e^4=54.60,\\ e^1=2.718,\\ e^0=1$.`, why: `Softmax numerator/denominator pieces.` },
          { do: `Sum $=58.32$; true-target softmax $=54.60/58.32=0.9362$.`, why: `Probability mass on the true target.` },
          { do: `$\\mathcal{L}_m=-\\log(0.9362)$.`, why: `InfoNCE is $-\\log$ of the true target's softmax probability.` }
        ],
        answer: `$\\mathcal{L}_m=-\\log(0.9362)\\approx 0.0659$. A confident correct pick &rarr; small loss.`
      },
      {
        q: `A codebook group's average usage is $\\bar{p}=(0.5,\\,0.5)$ (V=2). What is its entropy, and is this good or bad for $\\mathcal{L}_d$?`,
        steps: [
          { do: `$H=-(0.5\\log 0.5+0.5\\log 0.5)=\\log 2=0.693$.`, why: `Uniform over 2 entries gives maximal entropy.` },
          { do: `Compare to a spike $(1,0)$: $H=0$.`, why: `A collapsed codebook has zero entropy.` }
        ],
        answer: `$H=0.693$ (maximal for V=2). Maximal entropy &rarr; most negative $-H$ &rarr; LOWEST $\\mathcal{L}_d$ &rarr; this is the GOOD case (even code use).`
      },
      {
        q: `<b>Ablation.</b> If you remove masking entirely (no frame is hidden) before the contrastive task, what happens, and why?`,
        steps: [
          { do: `With nothing masked, the context network can just copy each input latent to its output.`, why: `No information is removed, so $\\mathbf{c}_t$ needs no inference.` },
          { do: `There is no held-out frame to predict &rarr; the contrastive game has no real difficulty.`, why: `The task degenerates; the model learns no predictive structure.` }
        ],
        answer: `Pick-the-true-target accuracy stays at chance $\\frac{1}{K+1}$ &mdash; matching our CODEVIZ ablation curve. Masking is what creates the learning signal.`
      }
    ]
  });

  window.CODE["paper-wav2vec2"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the wav2vec 2.0 masked-contrastive objective by hand on toy latent speech. We import the ` +
      `Transformer/Linear/cosine/cross-entropy plumbing and implement only the novel parts: mask latent ` +
      `spans, quantize targets with a fixed toy product-quantization codebook, and the InfoNCE loss (Eqn. 3) ` +
      `over {true + K distractors}. The cell also recomputes the worked example (L_m and L_d) and prints it.`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

# ---- worked example: InfoNCE contrastive term L_m (Eqn. 3) and diversity loss L_d (Eqn. 4) ----
c  = torch.tensor([1.0, 1.0]); kappa = 0.1
cands = torch.tensor([[1.0,0.9],[-1.0,0.5],[0.2,-1.0],[0.3,1.0]])   # true q_t first, then 3 distractors
sims  = F.cosine_similarity(c[None], cands)                          # cosine sim to each candidate
logits = sims / kappa
Lm = F.cross_entropy(logits[None], torch.tensor([0]))               # true target is class 0
print("sims      :", [round(s,4) for s in sims.tolist()])
print("softmax   :", [round(p,4) for p in logits.softmax(0).tolist()])
print("L_m       :", round(Lm.item(), 4))                           # -> 0.2676

pbar = torch.tensor([[0.7,0.2,0.1],[0.34,0.33,0.33]])               # G=2 groups, V=3 (avg codebook usage)
G, V = pbar.shape
Ld = (1.0/(G*V)) * (pbar * pbar.log()).sum()                        # = (1/GV) sum_g -H(p_g)
print("L_d       :", round(Ld.item(), 4))                           # -> -0.3167
print("L total   :", round((Lm + 0.1*Ld).item(), 4))               # -> 0.2359

# ---- the model: toy latent speech + quantizer + masked contrastive pretraining ----
T_LEN, D, G, Vc = 40, 16, 2, 64
codebook = torch.randn(G, Vc, D//G)                                 # fixed product-quantization codebook

def make_batch(bs, seed=None):                                      # smooth autoregressive "latent speech"
    g = torch.Generator().manual_seed(seed) if seed is not None else None
    z = torch.zeros(bs, T_LEN, D); z[:,0] = torch.randn(bs, D, generator=g)
    for t in range(1, T_LEN): z[:,t] = 0.85*z[:,t-1] + 0.5*torch.randn(bs, D, generator=g)
    return z

def quantize(z):                                                   # snap each frame to nearest code, per group
    bs,T,_ = z.shape; zg = z.view(bs,T,G,D//G); out = torch.zeros_like(zg)
    for g in range(G):
        d = (zg[:,:,g,None,:] - codebook[g][None,None]).pow(2).sum(-1)
        out[:,:,g,:] = codebook[g][d.argmin(-1)]
    return out.view(bs,T,D)

class ContextNet(nn.Module):                                       # Transformer context network
    def __init__(s):
        super().__init__(); s.proj = nn.Linear(D,64)
        enc = nn.TransformerEncoderLayer(64,4,128, batch_first=True, dropout=0.0)
        s.tr = nn.TransformerEncoder(enc,2); s.out = nn.Linear(64,D)
        s.mask_emb = nn.Parameter(torch.randn(D))                  # learned mask vector
    def forward(s, z, mask):
        zin = z.clone(); zin[mask] = s.mask_emb                    # hide masked frames
        return s.out(s.tr(s.proj(zin)))

def spans(bs, seed):                                               # mask M=3-frame spans
    m = torch.zeros(bs, T_LEN, dtype=torch.bool)
    for b in range(bs):
        for st in np.random.RandomState(seed+b).choice(T_LEN-3,5,replace=False): m[b,st:st+3]=True
    return m

K = 10                                                            # distractors -> chance = 1/(K+1) = 0.091
net = ContextNet(); opt = torch.optim.Adam(net.parameters(), lr=1.5e-3)
for ep in range(150):
    z = make_batch(48, seed=ep); q = quantize(z); m = spans(48, ep*101)
    c = net(z, m); bi,ti = torch.where(m)
    ct, qt = c[bi,ti], q[bi,ti]; M = ct.shape[0]
    di = torch.randint(0, M, (M, K))                              # distractors from other masked steps
    cand = torch.cat([qt[:,None,:], qt[di]], dim=1)               # {true + K distractors}
    sims = F.cosine_similarity(ct[:,None,:], cand, dim=-1) / 0.1  # Eqn. 3 logits
    loss = F.cross_entropy(sims, torch.zeros(M, dtype=torch.long))
    opt.zero_grad(); loss.backward(); opt.step()

# pick-the-true accuracy on a fresh batch (true target is top-1 among K distractors)
with torch.no_grad():
    zv = make_batch(48, seed=9000); qv = quantize(zv); mv = spans(48, 7777)
    cv = net(zv, mv); bi,ti = torch.where(mv); ct,qt = cv[bi,ti], qv[bi,ti]; M = ct.shape[0]
    di = torch.randint(0, M, (M, K)); cand = torch.cat([qt[:,None,:], qt[di]], 1)
    acc = (F.cosine_similarity(ct[:,None,:], cand, dim=-1).argmax(1) == 0).float().mean()
print("pick-the-true accuracy:", round(acc.item(),3), " (chance =", round(1/(K+1),3), ")")`
  };

  window.CODEVIZ["paper-wav2vec2"] = {
    question: "Does the masked CONTRASTIVE task teach a tiny context network to pick the true quantized target above chance — and does removing the masking kill the signal?",
    charts: [
      {
        type: "line",
        title: "Pick-the-true-target accuracy during pretraining — masked contrastive vs no-mask ablation (toy latents)",
        xlabel: "pretraining step",
        ylabel: "accuracy (true target top-1 of 11)",
        series: [
          {
            name: "Masked + contrastive (Eqn. 3)",
            color: "#7ee787",
            points: [[0,0.0947],[15,0.1374],[30,0.2366],[45,0.3115],[60,0.2962],[75,0.3557],[90,0.3389],[105,0.3603],[120,0.3740],[135,0.3725],[149,0.3466]]
          },
          {
            name: "Ablation: no masking (reconstruct only)",
            color: "#ff7b72",
            points: [[0,0.0916],[15,0.0977],[30,0.0916],[45,0.0885],[60,0.0992],[75,0.0901],[90,0.0931],[105,0.0855],[120,0.1008],[135,0.0962],[149,0.0962]]
          },
          {
            name: "Chance = 1/(K+1)",
            color: "#8b949e",
            points: [[0,0.0909],[149,0.0909]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny Transformer context network was pretrained on synthetic latent speech with the wav2vec 2.0 masked-contrastive objective (Eqn. 3): mask 3-frame spans, then for each masked frame pick its TRUE quantized target out of {true + K=10 distractors from other masked steps}. With masking + contrastive loss (green), the pick-the-true accuracy climbs from chance (~0.091, grey) to ~0.37 — about 4x chance. The ABLATION (red) removes masking and trains the network to merely reconstruct: with nothing hidden the contrastive game is trivial and no predictive structure is learned, so accuracy stays at chance. Masking is what creates the self-supervised signal.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)
T_LEN, D, G, Vc = 40, 16, 2, 64
codebook = torch.randn(G, Vc, D//G)
def make_batch(bs, seed=None):
    g = torch.Generator().manual_seed(seed) if seed is not None else None
    z = torch.zeros(bs, T_LEN, D); z[:,0] = torch.randn(bs, D, generator=g)
    for t in range(1,T_LEN): z[:,t] = 0.85*z[:,t-1] + 0.5*torch.randn(bs, D, generator=g)
    return z
def quantize(z):
    bs,T,_ = z.shape; zg = z.view(bs,T,G,D//G); out = torch.zeros_like(zg)
    for g in range(G):
        d = (zg[:,:,g,None,:]-codebook[g][None,None]).pow(2).sum(-1)
        out[:,:,g,:] = codebook[g][d.argmin(-1)]
    return out.view(bs,T,D)
class ContextNet(nn.Module):
    def __init__(s):
        super().__init__(); s.proj=nn.Linear(D,64)
        enc=nn.TransformerEncoderLayer(64,4,128,batch_first=True,dropout=0.0)
        s.tr=nn.TransformerEncoder(enc,2); s.out=nn.Linear(64,D)
        s.mask_emb=nn.Parameter(torch.randn(D))
    def forward(s,z,mask):
        zin=z.clone(); zin[mask]=s.mask_emb; return s.out(s.tr(s.proj(zin)))
def spans(bs,seed):
    m=torch.zeros(bs,T_LEN,dtype=torch.bool)
    for b in range(bs):
        for st in np.random.RandomState(seed+b).choice(T_LEN-3,5,replace=False): m[b,st:st+3]=True
    return m
K=10
def run(use_mask, epochs=150):
    torch.manual_seed(0)
    net=ContextNet(); opt=torch.optim.Adam(net.parameters(),lr=1.5e-3); accs=[]
    for ep in range(epochs):
        z=make_batch(48,seed=ep); q=quantize(z)
        m = spans(48,ep*101) if use_mask else torch.zeros(48,T_LEN,dtype=torch.bool)
        c=net(z,m)
        if use_mask:
            bi,ti=torch.where(m); ct,qt=c[bi,ti],q[bi,ti]; M=ct.shape[0]
            di=torch.randint(0,M,(M,K)); cand=torch.cat([qt[:,None,:],qt[di]],1)
            loss=F.cross_entropy(F.cosine_similarity(ct[:,None,:],cand,dim=-1)/0.1,
                                 torch.zeros(M,dtype=torch.long))
        else:
            loss=(c-q).pow(2).mean()                      # ABLATION: reconstruct, no masking
        opt.zero_grad(); loss.backward(); opt.step()
        if ep%15==0 or ep==epochs-1:
            with torch.no_grad():
                zv=make_batch(48,seed=9000); qv=quantize(zv); mv=spans(48,7777)
                cv=net(zv,mv); bi,ti=torch.where(mv); ct,qt=cv[bi,ti],qv[bi,ti]; M=ct.shape[0]
                di=torch.randint(0,M,(M,K)); cand=torch.cat([qt[:,None,:],qt[di]],1)
                accs.append((ep, round((F.cosine_similarity(ct[:,None,:],cand,dim=-1).argmax(1)==0)
                                       .float().mean().item(),4)))
    return accs
print("chance =", round(1/(K+1),4))
print("masked+contrastive:", run(True))
print("ablation (no mask):", run(False))`
  };
})();
