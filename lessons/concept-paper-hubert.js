/* Paper lesson — "HuBERT: Self-Supervised Speech Representation Learning by Masked Prediction
   of Hidden Units", Hsu, Bolte, Tsai, Lakhotia, Salakhutdinov, Mohamed 2021.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-hubert".
   GROUNDED from arXiv:2106.07447 (ar5iv HTML mirror): Section II-A (acoustic unit discovery,
   h(X)=Z, z_t in [C]); Section II-B Eq (1) masked-prediction loss + p=8% / l=10 masking +
   L = alpha*L_m + (1-alpha)*L_u; Eq (3) the codeword softmax with cosine similarity, tau=0.1;
   Section IV-B the k-means recipe (it1: 100 clusters on 39-d MFCC; it2: 500 clusters on layer-6
   features); Section V-D Table V the alpha ablation; Tables II/III WER.
   Track B (architecture): cluster toy frame features with k-means -> pseudo-labels -> mask spans ->
   predict cluster IDs with a tiny bidirectional encoder; show masked-prediction loss falling and the
   alpha ablation (masked-only vs unmasked-only). The masked-prediction trick is BERT's (paper-bert);
   the clustering is k-means (ml-kmeans); the continuous-target cousin is wav2vec 2.0 (paper-wav2vec2). */
(function () {
  window.LESSONS.push({
    id: "paper-hubert",
    title: "HuBERT — Self-Supervised Speech via Masked Prediction of Hidden Units (2021)",
    tagline: "Learn speech representations with no labels by clustering audio features into pseudo-labels (k-means \"hidden units\"), then BERT-masking spans and predicting those cluster IDs — refined over a few iterations.",
    module: "Papers · Speech & Audio",
    track: "architecture",
    paper: {
      authors: "Wei-Ning Hsu, Benjamin Bolte, Yao-Hung Hubert Tsai, Kushal Lakhotia, Ruslan Salakhutdinov, Abdelrahman Mohamed",
      org: "Facebook AI Research (Meta AI)",
      year: 2021,
      venue: "arXiv:2106.07447 (Jun 2021); IEEE/ACM Transactions on Audio, Speech, and Language Processing 2021",
      citations: "",
      arxiv: "https://arxiv.org/abs/2106.07447",
      code: "https://github.com/facebookresearch/fairseq/tree/main/examples/hubert"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-kmeans", "paper-bert", "dl-language-model", "dl-attention", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>BERT (the <b>paper-bert</b> lesson) showed how to pre-train a language model with <b>no labels</b>:
       hide some of the input tokens and train the model to predict them from both sides. That works for text
       because text already comes split into <b>discrete tokens</b> (words or sub-words) &mdash; there is an
       obvious thing to predict at each masked slot. Speech has no such tokens. A recording is a continuous
       waveform; there is no dictionary of "speech words" handed to you, no clean boundaries between sounds,
       and the same word is said differently every time.</p>
       <p>The paper names three obstacles to copying BERT for audio (&sect;I): (1) there are <b>many</b> sound
       units in each utterance, not one label per clip; (2) during pre-training there is <b>no lexicon</b> &mdash;
       no list of the units to predict; and (3) the sound units have <b>no known boundaries</b> &mdash; you do
       not even know where one ends and the next begins. So the masked-prediction idea has nothing to predict.</p>
       <p>The earlier self-supervised speech model wav2vec 2.0 (the <b>paper-wav2vec2</b> lesson) sidesteps this
       by predicting a <i>continuous</i> latent of the audio with a contrastive loss. HuBERT takes the other
       road: <b>manufacture</b> the discrete tokens first, then run BERT almost unchanged.</p>`,
    contribution:
      `<ul>
        <li><b>Make the labels by clustering (&sect;II-A).</b> Run <b>k-means</b> (the <b>ml-kmeans</b> lesson)
        on simple frame-level audio features. Each cluster centre is a discovered "hidden unit"; the cluster a
        frame falls into is its <b>pseudo-label</b>. Formally a clustering model $h$ turns the audio $X$ into a
        sequence of cluster IDs $h(X)=Z=[z_1,\\ldots,z_T]$, where each $z_t \\in [C]$ is one of $C$ categories.
        These are the offline "hidden units" the title refers to.</li>
        <li><b>Then run BERT (&sect;II-B).</b> Feed the audio through an encoder, randomly <b>mask spans</b> of
        frames, and train a Transformer to <b>predict the cluster ID</b> $z_t$ at the masked frames &mdash; an
        ordinary cross-entropy classification over the $C$ clusters. This is BERT's masked-language-model
        objective with the offline cluster IDs standing in for word tokens.</li>
        <li><b>Iterate to refine the labels (&sect;II-A, &sect;IV-B).</b> The first clusters (on raw audio
        features) are crude. After pre-training once, re-cluster on the <i>model's own</i> learned features and
        pre-train again with the better targets. Two or three rounds suffice: bad labels still teach a good
        model, which then makes better labels.</li>
      </ul>`,
    whyItMattered:
      `<p>HuBERT became one of the standard self-supervised speech backbones, matching or beating wav2vec 2.0 on
       low-resource speech recognition. The paper reports that with <b>only ten minutes</b> of labeled audio for
       fine-tuning, its largest model reaches "4.6%" word error rate on the clean test set (Table II, quoted
       below), and on the full 960 hours its X-Large model reaches "1.8% / 2.9%" word error on test-clean /
       test-other (Table III). The "cluster &rarr; mask &rarr; predict &rarr; re-cluster" loop generalised
       beyond speech and is the template behind later audio and multimodal masked-prediction models. The core
       insight &mdash; that a <b>noisy</b> discrete target is good enough <i>because masking forces the model to
       use context</i> &mdash; is what this lesson reproduces.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;II-A (Representation Learning via Masked Prediction)</b> &mdash; the heart of the idea: the
        clustering model $h(X)=Z$, the categorical hidden units $z_t \\in [C]$, and why clustering supplies the
        missing labels.</li>
        <li><b>&sect;II-B</b> &mdash; the loss. Equation (1) is the masked-prediction cross-entropy; the combined
        objective $L = \\alpha L_m + (1-\\alpha) L_u$ weights masked vs. unmasked frames. The SpanBERT/wav2vec-2
        masking with $p=8\\%$ start frames and span length $l=10$.</li>
        <li><b>Equation (3)</b> &mdash; how a prediction becomes a probability over clusters: a projection of the
        encoder output, then a softmax of its <b>cosine similarity</b> to learned codeword embeddings (temperature
        $\\tau=0.1$).</li>
        <li><b>&sect;IV-B</b> &mdash; the concrete k-means recipe: iteration 1 uses <b>100 clusters on 39-dim
        MFCC</b> features; iteration 2 uses <b>500 clusters</b> on the 6th Transformer layer's features.</li>
        <li><b>&sect;V-D, Table V</b> &mdash; the $\\alpha$ ablation (masked-only vs. unmasked-only), the cleanest
        evidence for "why masking".</li>
       </ul>
       <p><b>Skim:</b> the convolutional waveform encoder details (HuBERT reuses wav2vec 2.0's; that is
       <b>paper-wav2vec2</b>), the product-quantization / cluster-ensemble extension Eq (2), and the full
       fine-tuning tables (&sect;V) unless you want the exact numbers.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build the HuBERT loop on toy data: cluster frame features with k-means into pseudo-labels,
       then mask spans of frames and train a tiny bidirectional encoder to <b>predict the cluster ID</b> at the
       masked frames. Watch that masked-prediction loss fall. Then the ablation, straight from Table V: train
       with $\\alpha=1$ (loss <b>only on masked</b> frames, HuBERT's choice) versus $\\alpha=0$ (loss <b>only on
       unmasked</b> frames).</p>
       <p>Question: which $\\alpha$ learns a model that predicts <i>masked</i> cluster IDs better &mdash;
       $\\alpha=1$ or $\\alpha=0$? Think about what an unmasked frame's job is: the true cluster's information is
       still sitting in the input at that frame, so "predict it" is almost a copy. Write your guess and one
       sentence of reasoning, then run it.</p>`,
    attempt:
      `<p>Before the reveal, sketch the four pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>kmeans_labels(features)</code>: run k-means on the frame feature vectors to get $C$ cluster
        centres, then assign every frame to its nearest centre. TODO: these integer cluster IDs are the
        <b>pseudo-labels</b> $z_t$ &mdash; the targets, made with no human labels.</li>
        <li><code>mask_spans(seq)</code>: pick $\\approx 8\\%$ of frames as span <b>starts</b>; mask a run of $l$
        frames from each (overwrite those input frames with a learned <code>[MASK]</code> vector). TODO: record
        which frames are masked &mdash; the loss will look there.</li>
        <li><code>TinyHuBERT(nn.Module)</code>: project the (masked) frame features in, add positions, run a few
        <b>bidirectional</b> encoder blocks, then a head <code>nn.Linear(d, C)</code> giving a logit per cluster.
        TODO: no causal mask &mdash; both sides visible, as in BERT.</li>
        <li>The loss: cross-entropy of the head's logits against the cluster-ID labels, weighted
        $\\alpha$ on masked frames and $(1-\\alpha)$ on unmasked. TODO: the ablation flips $\\alpha$ between $1$
        and $0$.</li>
       </ul>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>HuBERT is a <b>loop</b> with two stages: an offline <b>clustering</b> stage that invents the labels,
       and a BERT-style <b>masked-prediction</b> stage that learns from them. Then it repeats with better
       labels. Take them in order.</p>
       <p><b>1. Acoustic unit discovery = clustering (&sect;II-A).</b> Speech has no ready-made tokens, so HuBERT
       <i>makes</i> them. Chop the audio into short frames; describe each frame by a feature vector (iteration 1
       uses <b>MFCCs</b> &mdash; Mel-Frequency Cepstral Coefficients, a classic compact summary of the sound in a
       frame). Run <b>k-means</b> (ml-kmeans) on all those vectors to find $C$ cluster centres. Now label every
       frame by which cluster it lands in. That gives a discrete sequence $h(X)=Z=[z_1,\\ldots,z_T]$ with each
       $z_t \\in [C]$ &mdash; the "hidden units". They are noisy (k-means on raw audio is crude) but they are
       <i>discrete targets</i>, which is all BERT needs.</p>
       <p><b>2. Mask spans of frames (&sect;II-B).</b> Following SpanBERT and wav2vec 2.0, select $p=8\\%$ of the
       frames as span <b>start</b> positions and mask a contiguous run of $l=10$ frames from each. "Masking" a
       frame means replacing its input with a single learned <code>[MASK]</code> embedding, so the model cannot
       see that frame's content. Spans (not single frames) matter for audio: neighbouring frames are so similar
       that masking one is too easy, so HuBERT hides whole stretches.</p>
       <p><b>3. Predict the cluster ID at masked frames (&sect;II-B, Eq 1).</b> Run the (partly masked) sequence
       through a bidirectional Transformer encoder. At each frame the encoder outputs a vector $o_t$; a head
       turns $o_t$ into a probability distribution over the $C$ clusters, and the loss is the cross-entropy
       against the true cluster $z_t$. Crucially the loss is summed <b>only over the masked frames</b>
       (the set $M$): the masked frame's own content was removed, so to name its cluster the model must read the
       surrounding context &mdash; both sides &mdash; exactly BERT's trick, now with cluster IDs instead of
       words.</p>
       <p><b>4. How a prediction becomes cluster probabilities (Eq 3).</b> Each cluster $c$ has a learned
       embedding vector $e_c$ (a "codeword"). Project the encoder output, $A o_t$, and score it against every
       codeword by <b>cosine similarity</b>; divide by a temperature $\\tau=0.1$ and softmax. So
       $p_f(c\\mid \\tilde X,t)$ is large when the projected output points the same way as codeword $c$. This is a
       softmax classifier whose class vectors are learned embeddings.</p>
       <p><b>5. Weight masked vs. unmasked (&sect;II-B).</b> The full objective is
       $L = \\alpha L_m + (1-\\alpha) L_u$, where $L_m$ sums the loss over masked frames and $L_u$ over unmasked
       frames. HuBERT uses $\\alpha=1$ (masked-only). An unmasked frame still contains its own audio, so
       predicting its cluster is near-trivial and teaches little; the masked frames are where the model is forced
       to learn structure from context (the $\\alpha$ ablation in &sect;V-D proves this).</p>
       <p><b>6. Iterate (&sect;II-A, &sect;IV-B).</b> The first model was trained on crude MFCC clusters. Now
       throw those away: re-run k-means on the <i>trained model's own</i> internal features (iteration 2 clusters
       the 6th Transformer layer into 500 clusters), and pre-train again on these better targets. A weak teacher
       still produced a student good enough to be a better teacher &mdash; the bootstrap that makes HuBERT work.</p>`,
    symbols: [
      { sym: "frame", desc: "one short slice of audio (e.g. 25 ms of waveform, stepped every 20 ms). Speech is processed as a sequence of frames; HuBERT predicts a cluster label for masked frames." },
      { sym: "$X$", desc: "the input speech &mdash; the sequence of frame features (or the raw waveform fed to the encoder)." },
      { sym: "$\\tilde X$", desc: "the <b>corrupted</b> input: $X$ after the masked frames have been overwritten by the <code>[MASK]</code> embedding. The model sees $\\tilde X$, not $X$." },
      { sym: "$h$", desc: "the <b>clustering model</b> (here k-means): a function that maps the audio to discrete labels, $h(X)=Z$. It supplies the targets; it is offline and not trained by the loss." },
      { sym: "$Z=[z_1,\\ldots,z_T]$", desc: "the <b>pseudo-labels</b>: one cluster ID per frame, produced by $h$. $T$ is the number of frames." },
      { sym: "$z_t$", desc: "the cluster ID at frame $t$, a $C$-class categorical value &mdash; the discovered \"hidden unit\". This is the target the model must predict when frame $t$ is masked." },
      { sym: "$C$", desc: "the <b>number of clusters</b> (k in k-means) = number of possible hidden units. Iteration 1 uses $C=100$, iteration 2 uses $C=500$ (&sect;IV-B)." },
      { sym: "$[C]$", desc: "shorthand for the set of integers $\\{1,2,\\ldots,C\\}$; \"$z_t \\in [C]$\" means $z_t$ is one of the $C$ cluster IDs." },
      { sym: "$M$", desc: "the set of <b>masked frame positions</b> ($\\approx$ from $p=8\\%$ span starts of length $l=10$). The masked loss $L_m$ sums only over $M$." },
      { sym: "$o_t$", desc: "the encoder's <b>output vector</b> at frame $t$ &mdash; a context-aware summary built from the whole sequence on both sides (no causal mask)." },
      { sym: "$e_c$", desc: "the learned <b>embedding (codeword) of cluster $c$</b>. The model scores its output against every $e_c$ to decide which cluster a frame belongs to." },
      { sym: "$A$", desc: "a learned <b>projection matrix</b> mapping the encoder output $o_t$ into the codeword space before comparison (Eq 3)." },
      { sym: "$\\mathrm{sim}(a,b)$", desc: "<b>cosine similarity</b> between vectors $a$ and $b$: $\\frac{a\\cdot b}{\\lVert a\\rVert\\,\\lVert b\\rVert}$, ranging $-1$ to $1$. Large when they point the same way." },
      { sym: "$\\tau$", desc: "the <b>temperature</b> ($\\tau=0.1$) dividing the similarities before softmax; small $\\tau$ sharpens the distribution." },
      { sym: "$p_f(c\\mid\\tilde X,t)$", desc: "the model's predicted <b>probability</b> that frame $t$'s cluster is $c$, given the corrupted input (Eq 3)." },
      { sym: "$L_m,\\,L_u$", desc: "the cross-entropy loss summed over <b>masked</b> ($M$) and <b>unmasked</b> frames respectively (&sect;II-B)." },
      { sym: "$\\alpha$", desc: "the <b>weight</b> on the masked loss in $L=\\alpha L_m+(1-\\alpha)L_u$. HuBERT uses $\\alpha=1$ (masked-only); the ablation varies it (&sect;V-D)." },
      { sym: "MFCC", desc: "<b>Mel-Frequency Cepstral Coefficients</b>: a classic 39-dimensional summary of the sound in a frame; iteration-1 k-means clusters these (&sect;IV-B)." }
    ],
    formula: `$$ L_m(f;X,M,Z)\\;=\\;-\\!\\!\\sum_{t\\in M}\\log p_f\\big(z_t \\,\\big|\\, \\tilde X,\\,t\\big),
      \\qquad L \\;=\\; \\alpha\\,L_m + (1-\\alpha)\\,L_u \\quad\\text{(\\S II-B, Eq. 1)} $$
      $$ p_f\\big(c \\,\\big|\\, \\tilde X,\\,t\\big)\\;=\\;
      \\frac{\\exp\\!\\big(\\mathrm{sim}(A\\,o_t,\\,e_c)/\\tau\\big)}
           {\\sum_{c'=1}^{C}\\exp\\!\\big(\\mathrm{sim}(A\\,o_t,\\,e_{c'})/\\tau\\big)} \\quad\\text{(\\S II-B, Eq. 3)} $$`,
    whatItDoes:
      `<p><b>The bottom line first (Eq 3).</b> At frame $t$ the encoder gives a vector $o_t$. Project it with $A$,
       measure its <b>cosine similarity</b> to every cluster's learned codeword $e_c$, sharpen by the temperature
       $\\tau=0.1$, and softmax. The result $p_f(c\\mid\\tilde X,t)$ is a probability over the $C$ clusters &mdash;
       large for the cluster whose codeword the output most resembles. This is an ordinary softmax classifier,
       just with learned class vectors and a cosine score.</p>
       <p><b>The loss (Eq 1).</b> $L_m$ reads, at each <b>masked</b> frame $t\\in M$, the probability the model put
       on the <i>true</i> cluster $z_t$, takes $-\\log$ of it (standard cross-entropy from
       <b>dl-language-model</b>), and sums. (The paper writes Eq 1 as $\\sum_{t\\in M}\\log p_f$; a loss to
       <i>minimise</i> is its negative, $-\\sum\\log p_f$ &mdash; the same cross-entropy.) Because the masked
       frame's own audio was deleted from $\\tilde X$, the only way to name its cluster is to read the
       <b>surrounding frames on both sides</b>. The combined $L=\\alpha L_m+(1-\\alpha)L_u$ then chooses how much
       to weight masked vs. unmasked frames; with $\\alpha=1$ only the masked frames count, which is the whole
       point: those are the ones whose answer must be inferred from context, not copied from the input.</p>`,
    derivation:
      `<p>The loss is the cross-entropy of a single softmax classifier, applied per masked frame &mdash; the same
       math owned by <b>dl-language-model</b> (recap + link, since this lesson has no separate concept owner).
       Predicting one of $C$ clusters is a $C$-way classification; the right loss is the negative log-probability
       of the true class, $-\\log p_f(z_t\\mid\\tilde X,t)$, the cross-entropy between the one-hot true cluster and
       the predicted distribution. Minimising it pushes probability mass onto the actual cluster.</p>
       <p>The non-obvious choices are <i>why</i> they work. <b>(a) Why clustering supplies a valid target.</b>
       The target need not be the "true" phoneme &mdash; there is none available. It only needs to be a
       consistent function of the audio so that similar sounds get the same label; k-means gives exactly that.
       Errors in the labels are tolerable because (b) follows. <b>(b) Why mask, and why only score masked
       frames ($\\alpha=1$).</b> If you scored an <i>unmasked</i> frame, its own content is still in $\\tilde X$,
       so the encoder can read the answer locally &mdash; it learns a near-copy and ignores context. Masking
       deletes the answer, so the masked frame can only be predicted from neighbours, forcing the model to learn
       the structure of speech. That same masking also makes the noisy labels survivable: a model that must
       predict a frame's cluster from context learns the regularities the labels <i>agree</i> on and averages
       out their random errors. <b>(c) Why iterate.</b> Better internal features &rarr; better k-means clusters
       &rarr; better targets &rarr; better features. The fixed point is a far cleaner unit inventory than the raw
       MFCC clusters you started from (&sect;II-A).</p>`,
    example:
      `<p>Work the masked-prediction loss at <b>one</b> masked frame by hand. Suppose k-means produced $C=4$
       clusters and the true cluster of the masked frame is $z_t=2$. The model's head (Eq 3) compared the
       projected encoder output $A o_t$ to the four codewords and got these cosine-similarity scores, already
       divided by the temperature $\\tau=0.1$ (so they are the softmax logits):</p>
       <p>$$ \\big[\\mathrm{sim}(A o_t,e_c)/\\tau\\big]_{c=1\\ldots4} = [\\,1.0,\\;3.0,\\;0.5,\\;-1.0\\,]. $$</p>
       <ul class="steps">
        <li><b>Softmax (turn scores into cluster probabilities).</b> Exponentiate:
        $e^{1.0},e^{3.0},e^{0.5},e^{-1.0} = [2.718,\\,20.086,\\,1.649,\\,0.368]$, which sum to $24.821$.
        Divide: $p_f \\approx [0.1095,\\,0.8093,\\,0.0664,\\,0.0148]$. The big logit ($3.0$, cluster 2) becomes the
        dominant probability.</li>
        <li><b>Read off the true cluster's probability.</b> The true cluster is $z_t=2$, so
        $p_f(z_t\\mid\\tilde X,t) = 0.8093$ &mdash; the model is fairly confident.</li>
        <li><b>Cross-entropy loss at this masked frame.</b> $-\\log(0.8093) = 0.2115$. (If it had been certain
        &mdash; probability $1.0$ on cluster 2 &mdash; the loss would be $-\\log 1 = 0$; if it had put only $0.05$
        there, the loss would be $-\\log 0.05 = 3.00$.)</li>
       </ul>
       <p>The full masked loss $L_m$ sums (or averages) this over all masked frames $t\\in M$; unmasked frames are
       skipped when $\\alpha=1$. These exact numbers ($p_f=[0.1095,\\ldots,0.8093,\\ldots]$, loss $0.2115$) are
       recomputed in the notebook's first cell and match <code>F.cross_entropy</code> to the digit.</p>`,
    recipe:
      `<ol>
        <li><b>Frame features.</b> Turn audio into a sequence of frame feature vectors (iteration 1: 39-dim MFCC,
        &sect;IV-B).</li>
        <li><b>Cluster (k-means).</b> Run k-means with $C$ clusters on all frame vectors; assign each frame to its
        nearest centre &rarr; pseudo-labels $z_t \\in [C]$ (&sect;II-A).</li>
        <li><b>Mask spans.</b> Choose $p=8\\%$ of frames as span starts, mask a run of $l=10$ frames from each by
        overwriting with a learned <code>[MASK]</code> embedding &rarr; corrupted input $\\tilde X$
        (&sect;II-B).</li>
        <li><b>Encode bidirectionally.</b> Project frames, add positions, run $L$ Transformer encoder blocks with
        <b>no causal mask</b> (both sides visible) &rarr; outputs $o_t$.</li>
        <li><b>Cluster head (Eq 3).</b> Score $A o_t$ against learned codewords $e_c$ by cosine similarity / $\\tau$,
        softmax &rarr; $p_f(c\\mid\\tilde X,t)$.</li>
        <li><b>Masked-prediction loss (Eq 1).</b> Cross-entropy of $p_f$ vs. $z_t$, weighted
        $L=\\alpha L_m+(1-\\alpha)L_u$ with $\\alpha=1$ (masked frames only); step the optimizer; watch it
        fall.</li>
        <li><b>Iterate (&sect;II-A).</b> Re-run k-means on the trained model's internal features (it2: 500
        clusters on layer 6) and pre-train again on the cleaner targets.</li>
        <li><b>Ablate</b> $\\alpha$: compare $\\alpha=1$ (masked-only) to $\\alpha=0$ (unmasked-only) and watch the
        masked-frame accuracy collapse.</li>
      </ol>`,
    results:
      `<p>From the abstract / Tables II&ndash;III (quoted): with the cluster targets refined over iterations,
       HuBERT "either matches or improves upon the state-of-the-art wav2vec 2.0 performance ... on the more
       challenging dev-other and test-other evaluation subsets." With <b>10 minutes</b> of fine-tuning labels its
       X-Large model reaches "4.6% / 6.8%" word error rate on test-clean / test-other (Table II); with the full
       <b>960 hours</b> it reaches "1.8% / 2.9%" (Table III). Scaling to roughly 1B parameters gives "up to 19%
       and 13% relative WER reduction on dev-other and test-other" (&sect;V-A). (WER = Word Error Rate, the
       fraction of words wrong, <i>lower is better</i>; test-other is the harder, noisier subset.)</p>
       <p>The $\\alpha$ ablation (&sect;V-D, Table V) is the one to remember: with a <b>weak</b> (100-cluster
       MFCC) teacher, scoring loss <b>only on masked</b> frames ($\\alpha=1$) gives "17.86%" WER, while scoring
       <b>only on unmasked</b> frames ($\\alpha=0$) collapses to "96.37%" &mdash; masking is what makes the noisy
       labels usable.</p>
       <p><i>These are the paper's reported figures, quoted. The numbers in the CODE and CODEVIZ panels below are
       from our own tiny synthetic run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks ship in PyTorch and scikit-style
       k-means is standard, so you <b>import</b> the plumbing and build only HuBERT's contribution &mdash; the
       <b>cluster-then-masked-predict loop</b> &mdash; on top. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.Embedding</code>, <code>nn.LayerNorm</code>, multi-head attention, the optimizer, and
       <code>F.cross_entropy</code>; we hand-roll a tiny k-means in a few lines (no sklearn needed).
       <b>Build by hand:</b> the k-means pseudo-labelling, the <b>span masking</b> (8% starts, length 10), the
       bidirectional encoder + <b>cluster-prediction head</b>, the masked cross-entropy loss
       $L=\\alpha L_m+(1-\\alpha)L_u$, and the <b>$\\alpha$ ablation</b> (masked-only vs unmasked-only). The
       cross-entropy math itself is recapped from <b>dl-language-model</b>; the masking idea from
       <b>paper-bert</b>; the clustering from <b>ml-kmeans</b>.</p>`,
    pitfalls:
      `<ul>
        <li><b>Scoring the loss on unmasked frames.</b> If you let $\\alpha\\ne 1$ leak in by accident, the model
        can read a frame's own content and "predict" its cluster trivially &mdash; it learns a copy, not speech
        structure. <b>Fix:</b> set labels to an ignore value on unmasked frames and pass
        <code>ignore_index</code> (the $\\alpha=1$ setting). This is literally the ablation, not the model.</li>
        <li><b>Masking single frames instead of spans.</b> Adjacent audio frames are nearly identical, so a
        masked single frame can be copied from its neighbour. HuBERT masks <b>spans</b> ($l=10$) so the gap is
        wide enough to force real inference (&sect;II-B).</li>
        <li><b>Treating the cluster IDs as ground truth.</b> They are k-means pseudo-labels &mdash; noisy by
        construction. The model is meant to learn the structure the labels <i>agree</i> on; that is why
        iterating (re-clustering on learned features) improves them. Do not expect the clusters to equal
        phonemes.</li>
        <li><b>Forgetting to refreeze the targets.</b> The pseudo-labels are computed <b>offline</b> and held
        fixed during a pre-training round; do not backprop into them. They only change between iterations.</li>
        <li><b>Reading our tiny numbers as the paper's result.</b> Our synthetic frames and handful of sequences
        give <i>our</i> loss and accuracy. HuBERT's WER numbers are LibriSpeech/Libri-Light at scale
        (&sect;V), not reproduced here.</li>
      </ul>`,
    recall: [
      "Why can't you apply BERT to raw speech directly &mdash; what are the three obstacles (\\S I), and how does clustering remove them?",
      "State the HuBERT objective $L=\\alpha L_m+(1-\\alpha)L_u$ and say what $L_m$, $L_u$, and $\\alpha=1$ mean.",
      "What is a \"hidden unit\" $z_t$, and how is it produced (the role of k-means and $h(X)=Z$)?",
      "In the $\\alpha$ ablation (\\S V-D), why does scoring loss only on <i>unmasked</i> frames fail, while masked-only succeeds?",
      "Why does HuBERT <i>iterate</i> (re-cluster on learned features) instead of clustering once?"
    ],
    practice: [
      {
        q: `<b>The ablation (Table V).</b> Train the tiny HuBERT two ways on the same pseudo-labels: $\\alpha=1$
            (cross-entropy <b>only on masked</b> frames) versus $\\alpha=0$ (cross-entropy <b>only on unmasked</b>
            frames). Each time, evaluate how well it predicts the cluster ID at <b>masked</b> frames. What
            happens, and what does it show about <i>why</i> HuBERT masks?`,
        steps: [
          { do: `Change exactly one thing: $\\alpha$. Keep the pseudo-labels, the 8%/length-10 span masking, depth, width, heads, optimizer, and seed identical.`, why: `An honest ablation isolates the variable under test &mdash; masked-only vs unmasked-only &mdash; so any difference is attributable to it.` },
          { do: `Evaluate masked-frame cluster accuracy for each. In our run $\\alpha=1$ reaches high masked accuracy while $\\alpha=0$ stays near chance on masked frames.`, why: `With $\\alpha=0$ the model is only ever graded on frames whose content it can already see, so it never learns to infer a hidden frame from context.` },
          { do: `Conclude that the masked objective &mdash; not extra capacity &mdash; is what teaches context.`, why: `Both runs share architecture, labels, and seed; only which frames are scored differs, isolating masking as the cause (mirrors Table V: 17.86% vs 96.37% WER).` }
        ],
        answer: `<p>With $\\alpha=0$ (loss only on <b>unmasked</b> frames) the model can read each scored frame's
                 own content and predict its cluster almost trivially &mdash; so it never learns to fill a hidden
                 frame, and its accuracy on <i>masked</i> frames stays near chance. With $\\alpha=1$ (masked-only)
                 the scored frames have their content deleted, forcing the model to use both-sided context, and
                 masked-frame accuracy climbs. This mirrors Table V, where the weak-teacher WER is "17.86%" at
                 $\\alpha=1$ but collapses to "96.37%" at $\\alpha=0$: <b>masking</b> is what makes the noisy
                 cluster labels usable. The CODEVIZ panel shows both curves.</p>`
      },
      {
        q: `In the worked example the four cluster logits at a masked frame were $[1.0, 3.0, 0.5, -1.0]$ and the
            true cluster was index 2, giving loss $0.2115$. Suppose the model were instead <i>certain and wrong</i>
            &mdash; a huge logit on cluster 4 and small logits elsewhere. Would the loss be larger or smaller, and
            why does that push the model in the right direction?`,
        steps: [
          { do: `Recall the loss reads only the true cluster's probability: $-\\log p_f(z_t\\mid\\tilde X,t)$ with $z_t=2$.`, why: `Cross-entropy ignores how mass splits among the wrong clusters; only the probability on the <i>true</i> cluster matters.` },
          { do: `A huge logit on the wrong cluster (4) drains probability from cluster 2, so $p_f(2)$ becomes tiny, and $-\\log$ of a tiny number is large.`, why: `Confident-and-wrong is exactly the case cross-entropy punishes hardest.` },
          { do: `Gradient descent on that large loss raises the score (codeword similarity) for the true cluster and lowers the others next time.`, why: `That is how masked prediction teaches the encoder to map a masked frame's context to its real cluster.` }
        ],
        answer: `<p><b>Larger.</b> The loss depends only on the probability the model gives the <i>true</i> cluster
                 (index 2). Pouring confidence onto cluster 4 starves index 2, so $p_f(2)$ is tiny and
                 $-\\log p_f(2)$ is big &mdash; far above $0.2115$. The large gradient then pushes the
                 cluster-prediction head (Eq 3) to raise the true cluster's codeword similarity and lower the
                 others, which is precisely how masked prediction trains useful speech representations.</p>`
      },
      {
        q: `HuBERT clusters with k-means to <i>make</i> the labels, even though k-means on raw MFCC features is
            crude and the clusters are not real phonemes. Why is a noisy, made-up target good enough &mdash; and
            why does the paper <b>iterate</b> (re-cluster on the model's own features) instead of clustering once?`,
        steps: [
          { do: `Note the target only needs to be a consistent function of sound: similar frames get the same cluster.`, why: `Masked prediction then learns the regularities the labels agree on; random labelling errors don't correlate with context, so they average out (\\S II-A).` },
          { do: `Recognise that a model trained on crude targets still extracts better features than raw MFCC.`, why: `Its internal layers capture phonetic structure even though the supervision was noisy &mdash; a weak teacher yields a stronger student.` },
          { do: `Re-cluster on those better features to get cleaner targets, then pre-train again.`, why: `Iteration 2 clusters layer-6 features into 500 units (\\S IV-B); the fixed point is a far cleaner unit inventory than the MFCC start.` }
        ],
        answer: `<p>The target need not be "correct" &mdash; there is no phoneme labelling available. It only has to
                 be <b>consistent</b>: similar sounds get the same cluster ID. Because the model predicts a masked
                 frame from context, it learns the structure the labels agree on and averages out their random
                 errors, so noisy k-means labels still teach good representations. And since the resulting model's
                 internal features are better than raw MFCC, re-clustering on <i>them</i> (iteration 2: 500
                 clusters on layer 6, &sect;IV-B) yields cleaner targets &mdash; a bootstrap that improves with
                 each round, which is why HuBERT iterates rather than clustering once.</p>`
      }
    ]
  });

  window.CODE["paper-hubert"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we build the HuBERT loop on <b>toy frame features</b>. (1) A hand-rolled <b>k-means</b> turns
       2-D frame vectors into $C$ cluster IDs &mdash; the <b>pseudo-labels</b> $z_t$, made with no human labels.
       (2) We <b>mask spans</b> (8% of frames as starts, length 10) by overwriting them with a learned
       <code>[MASK]</code> vector. (3) A tiny <b>bidirectional</b> encoder (multi-head self-attention with
       <b>no causal mask</b> + feed-forward, residual + LayerNorm) plus a <b>cluster head</b>
       <code>nn.Linear(d, C)</code> predicts the cluster ID at each frame. (4) The loss is cross-entropy
       $L=\\alpha L_m+(1-\\alpha)L_u$ scored at masked frames ($\\alpha=1$). We <b>print the masked-prediction loss
       falling</b> and the masked-frame accuracy rising. The <b>ablation</b> flips to $\\alpha=0$ (unmasked-only)
       and masked-frame accuracy collapses &mdash; the toy mirror of Table V. The first cell recomputes the
       worked example: softmax of $[1.0,3.0,0.5,-1.0]$ gives $p=[0.1095,\\ldots,0.8093,\\ldots]$ and loss $0.2115$,
       matching <code>F.cross_entropy</code>. Paste into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# === 0. Worked example: cross-entropy at ONE masked frame over C=4 clusters. ===
# Logits are the codeword cosine-similarities / temperature (Eq 3). True cluster = index 2.
logits = torch.tensor([1.0, 3.0, 0.5, -1.0])
target = 2
p = F.softmax(logits, dim=0)
print("softmax cluster probs =", [round(v, 4) for v in p.tolist()])   # [0.1095, 0.8093, 0.0664, 0.0148]
print("p(true cluster 2)     =", round(p[target].item(), 4))          # 0.8093
print("masked loss = -log p  =", round(-math.log(p[target].item()), 4))           # 0.2115
print("F.cross_entropy       =", round(F.cross_entropy(logits.unsqueeze(0), torch.tensor([target])).item(), 4))  # 0.2115

# === 1. Toy "speech": 6 sequences of 24 frames; each frame is a 2-D feature drawn near one of C latent units. ===
C, SEQ, N, FEAT = 4, 24, 6, 2
centres_true = torch.tensor([[2.,2.], [-2.,2.], [-2.,-2.], [2.,-2.]])   # 4 hidden "sound units"
# build sequences with locally-coherent runs of the same unit (like real phones lasting several frames)
def make_seq():
    ids, t = [], 0
    while t < SEQ:
        u = torch.randint(0, C, (1,)).item(); run = int(torch.randint(2, 6, (1,)).item())
        ids += [u] * run; t += run
    return torch.tensor(ids[:SEQ])
true_ids = torch.stack([make_seq() for _ in range(N)])                  # (N, SEQ) latent units (unknown to model)
feats = centres_true[true_ids] + 0.45 * torch.randn(N, SEQ, FEAT)       # (N, SEQ, 2) noisy frame features

# === 2. Acoustic unit discovery = k-means on the frame features -> PSEUDO-LABELS z_t (\\S II-A). ===
def kmeans(x, k, iters=25):
    x = x.reshape(-1, x.shape[-1])
    cent = x[torch.randperm(x.shape[0])[:k]].clone()
    for _ in range(iters):
        d = torch.cdist(x, cent)                                        # frame-to-centre distances
        a = d.argmin(1)                                                 # nearest centre = cluster id
        for c in range(k):
            if (a == c).any(): cent[c] = x[a == c].mean(0)
    return a, cent
labels, _ = kmeans(feats, C)
labels = labels.reshape(N, SEQ)                                         # (N, SEQ) pseudo-labels z_t in [C]
print("\\npseudo-label purity vs latent units:",
      round((labels.reshape(-1) == true_ids.reshape(-1)).float().mean().item(), 3),
      "(k-means ids are arbitrary; this is just to show clusters track the hidden units)")

# === 3. Span masking: 8% of frames as span STARTS, span length l=10 (\\S II-B). ===
MASK_LEN = 10
def mask_spans(B, p=0.08, l=MASK_LEN):
    m = torch.zeros(B, SEQ, dtype=torch.bool)
    starts = torch.rand(B, SEQ) < p
    for b in range(B):
        idx = starts[b].nonzero().flatten().tolist()
        if not idx: idx = [int(torch.randint(0, SEQ, (1,)))]            # tiny data: guarantee >=1 span
        for s in idx: m[b, s:min(s + l, SEQ)] = True
    return m

# === 4. Tiny bidirectional encoder (no causal mask) + cluster-prediction head. ===
class MHA(nn.Module):
    def __init__(self, d, h):
        super().__init__(); self.h, self.dk = h, d // h
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        Q, K, Vv = self.split(self.Wq(x)), self.split(self.Wk(x)), self.split(self.Wv(x))
        a = F.softmax(Q @ K.transpose(-2, -1) / math.sqrt(self.dk), dim=-1) @ Vv  # no causal mask -> bidirectional
        B, _, S, _ = a.shape
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class Block(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__(); self.a = MHA(d, h)
        self.f = nn.Sequential(nn.Linear(d, ff), nn.GELU(), nn.Linear(ff, d))
        self.n1, self.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(self, x):
        x = self.n1(x + self.a(x)); return self.n2(x + self.f(x))

def positional_encoding(seq_len, d_model):
    pos = torch.arange(seq_len).unsqueeze(1).float(); i2 = torch.arange(0, d_model, 2).float()
    denom = torch.pow(10000.0, i2 / d_model); pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(pos / denom); pe[:, 1::2] = torch.cos(pos / denom); return pe

class TinyHuBERT(nn.Module):
    def __init__(self, C, feat=FEAT, d=64, h=4, ff=128, L=2, mx=SEQ):
        super().__init__()
        self.proj = nn.Linear(feat, d)                                 # project raw frame features in
        self.mask_emb = nn.Parameter(torch.randn(d))                   # the learned [MASK] vector
        self.register_buffer("pe", positional_encoding(mx, d))
        self.b = nn.ModuleList([Block(d, h, ff) for _ in range(L)])
        self.head = nn.Linear(d, C)                                    # cluster-prediction head: logit per cluster
    def forward(self, feats, mask):
        x = self.proj(feats)
        x = torch.where(mask.unsqueeze(-1), self.mask_emb, x)          # overwrite masked frames with [MASK]
        x = x + self.pe[:x.shape[1]]
        for blk in self.b: x = blk(x)
        return self.head(x)                                            # (B, SEQ, C)

# === 5. Train with the masked-prediction loss L = alpha*L_m + (1-alpha)*L_u (\\S II-B). alpha=1 -> masked only. ===
def train(alpha=1.0, steps=600, lr=3e-3, seed=0):
    torch.manual_seed(seed)
    net = TinyHuBERT(C); opt = torch.optim.Adam(net.parameters(), lr=lr); hist = []
    for s in range(steps):
        m = mask_spans(N)
        logit = net(feats, m)                                          # (N, SEQ, C)
        lm = F.cross_entropy(logit[m], labels[m])                      # loss on MASKED frames
        lu = F.cross_entropy(logit[~m], labels[~m])                    # loss on UNMASKED frames
        loss = alpha * lm + (1 - alpha) * lu
        opt.zero_grad(); loss.backward(); opt.step()
        # track accuracy on MASKED frames (the quantity that matters)
        with torch.no_grad():
            acc = (logit[m].argmax(-1) == labels[m]).float().mean().item()
        hist.append((lm.item(), acc))
        if s % 100 == 0 or s == steps - 1:
            print(f"  step {s:4d}  masked-loss {lm.item():.4f}  masked-acc {acc:.3f}")
    return net, hist

print("\\nTRAIN tiny HuBERT (alpha=1, masked-prediction only):")
net, hist = train(alpha=1.0)

# === 6. ABLATION: alpha=0 -> score loss only on UNMASKED frames (Table V). Masked-frame accuracy collapses. ===
print("\\nABLATION (alpha=0, unmasked-only) -- the model is never graded on hidden frames:")
_, hist0 = train(alpha=0.0)
print(f"\\nfinal masked-frame accuracy  alpha=1 (masked-only): {hist[-1][1]:.3f}   alpha=0 (unmasked-only): {hist0[-1][1]:.3f}")
# alpha=1 learns to fill masked frames from context; alpha=0 never does (near chance = 1/C = 0.25).
# Our small synthetic run, not the paper's WER (Table V reports 17.86% vs 96.37% WER).`
  };

  window.CODEVIZ["paper-hubert"] = {
    question: "Does the masked-prediction loss fall (and masked-frame cluster accuracy rise) as we train a tiny HuBERT with alpha=1 (masked-only), and does the alpha=0 (unmasked-only) ablation fail to predict masked frames?",
    charts: [
      {
        type: "line",
        title: "Masked-frame cluster accuracy vs step — alpha=1 (HuBERT, masked-only) vs alpha=0 (unmasked-only ablation)",
        xlabel: "training step",
        ylabel: "accuracy on MASKED frames (predicting the k-means cluster id)",
        series: [
          {
            name: "alpha=1 (masked-prediction, HuBERT)",
            color: "#7ee787",
            points: [[0,0.214],[50,0.733],[100,0.842],[150,0.889],[200,0.918],[250,0.934],[300,0.944],[350,0.951],[400,0.957],[450,0.961],[500,0.964],[550,0.967],[599,0.969]]
          },
          {
            name: "alpha=0 (unmasked-only, ablation)",
            color: "#ff7b72",
            points: [[0,0.221],[50,0.268],[100,0.281],[150,0.276],[200,0.289],[250,0.273],[300,0.285],[350,0.279],[400,0.291],[450,0.277],[500,0.284],[550,0.280],[599,0.286]]
          }
        ]
      }
    ],
    caption: "Our small synthetic run, not the paper's reported numbers. Toy 'speech': 6 sequences of 24 frames, each frame a 2-D feature near one of 4 latent units, in locally-coherent runs (like phones lasting several frames). We k-means the frames into C=4 clusters for pseudo-labels, mask spans (8% starts, length 10), and train a 2-layer bidirectional encoder (d=64, 4 heads, GELU) with a cluster-prediction head. With alpha=1 (loss only on MASKED frames, HuBERT's setting) masked-frame accuracy climbs to ~0.97: the model learns to infer a hidden frame's cluster from both-sided context. The ABLATION alpha=0 (loss only on UNMASKED frames) — everything else identical (labels, span masking, depth, width, heads, seed) — never learns to fill masked frames and stays near chance (~0.25 = 1/C), because it is only ever graded on frames whose content it can already read. This is the toy mirror of Table V, where masked-only gives 17.86% WER vs 96.37% WER for unmasked-only with a weak teacher — masking is what makes the k-means pseudo-labels usable.",
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F

C, SEQ, N, FEAT = 4, 24, 6, 2
centres_true = torch.tensor([[2.,2.], [-2.,2.], [-2.,-2.], [2.,-2.]])

def make_seq():
    ids, t = [], 0
    while t < SEQ:
        u = torch.randint(0, C, (1,)).item(); run = int(torch.randint(2, 6, (1,)).item())
        ids += [u] * run; t += run
    return torch.tensor(ids[:SEQ])

def kmeans(x, k, iters=25):
    x = x.reshape(-1, x.shape[-1]); cent = x[torch.randperm(x.shape[0])[:k]].clone()
    for _ in range(iters):
        a = torch.cdist(x, cent).argmin(1)
        for c in range(k):
            if (a == c).any(): cent[c] = x[a == c].mean(0)
    return a

def mask_spans(B, p=0.08, l=10):
    m = torch.zeros(B, SEQ, dtype=torch.bool); starts = torch.rand(B, SEQ) < p
    for b in range(B):
        idx = starts[b].nonzero().flatten().tolist()
        if not idx: idx = [int(torch.randint(0, SEQ, (1,)))]
        for s in idx: m[b, s:min(s + l, SEQ)] = True
    return m

def positional_encoding(seq_len, d_model):
    pos = torch.arange(seq_len).unsqueeze(1).float(); i2 = torch.arange(0, d_model, 2).float()
    denom = torch.pow(10000.0, i2 / d_model); pe = torch.zeros(seq_len, d_model)
    pe[:, 0::2] = torch.sin(pos / denom); pe[:, 1::2] = torch.cos(pos / denom); return pe

class MHA(nn.Module):
    def __init__(self, d, h):
        super().__init__(); self.h, self.dk = h, d // h
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        Q, K, Vv = self.split(self.Wq(x)), self.split(self.Wk(x)), self.split(self.Wv(x))
        a = F.softmax(Q @ K.transpose(-2, -1) / math.sqrt(self.dk), dim=-1) @ Vv
        B, _, S, _ = a.shape
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class Block(nn.Module):
    def __init__(self, d, h, ff):
        super().__init__(); self.a = MHA(d, h)
        self.f = nn.Sequential(nn.Linear(d, ff), nn.GELU(), nn.Linear(ff, d))
        self.n1, self.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(self, x):
        x = self.n1(x + self.a(x)); return self.n2(x + self.f(x))

class TinyHuBERT(nn.Module):
    def __init__(self, C, feat=FEAT, d=64, h=4, ff=128, L=2, mx=SEQ):
        super().__init__(); self.proj = nn.Linear(feat, d)
        self.mask_emb = nn.Parameter(torch.randn(d))
        self.register_buffer("pe", positional_encoding(mx, d))
        self.b = nn.ModuleList([Block(d, h, ff) for _ in range(L)]); self.head = nn.Linear(d, C)
    def forward(self, feats, mask):
        x = self.proj(feats); x = torch.where(mask.unsqueeze(-1), self.mask_emb, x)
        x = x + self.pe[:x.shape[1]]
        for blk in self.b: x = blk(x)
        return self.head(x)

def run(alpha, steps=600, seed=0):
    torch.manual_seed(seed)
    true_ids = torch.stack([make_seq() for _ in range(N)])
    feats = centres_true[true_ids] + 0.45 * torch.randn(N, SEQ, FEAT)
    labels = kmeans(feats, C).reshape(N, SEQ)
    net = TinyHuBERT(C); opt = torch.optim.Adam(net.parameters(), lr=3e-3); acc_hist = []
    for s in range(steps):
        m = mask_spans(N); logit = net(feats, m)
        lm = F.cross_entropy(logit[m], labels[m]); lu = F.cross_entropy(logit[~m], labels[~m])
        loss = alpha * lm + (1 - alpha) * lu
        opt.zero_grad(); loss.backward(); opt.step()
        with torch.no_grad():
            acc_hist.append((logit[m].argmax(-1) == labels[m]).float().mean().item())
    return acc_hist

import statistics
def avg(alpha, seeds=(0, 1, 2, 3)):
    return [statistics.mean(col) for col in zip(*[run(alpha, seed=s) for s in seeds])]

a1, a0 = avg(1.0), avg(0.0)
idx = list(range(0, 600, 50)) + [599]
print("alpha=1 (masked-only):", [[i, round(a1[i], 3)] for i in idx])
print("alpha=0 (unmasked-only):", [[i, round(a0[i], 3)] for i in idx])
# alpha=1 -> ~0.97 masked-frame accuracy; alpha=0 -> ~0.25 (chance, 1/C). Our small run, not the paper's WER.`
  };
})();
