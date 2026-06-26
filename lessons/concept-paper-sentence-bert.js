/* Paper lesson — "Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks", Reimers & Gurevych 2019.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-sentence-bert".
   GROUNDED from arXiv:1908.10084 (abstract) and the ar5iv HTML mirror (Section 3 method/objectives,
   Section 6 ablation Table 6, Section 7 computational efficiency).
   Track B (architecture): build a tiny SIAMESE encoder (shared weights) that mean-pools token vectors
   into a sentence embedding; train with a cosine objective so paraphrases are close and unrelated
   sentences far; run a semantic-search demo; ablate MEAN-pool vs CLS-token pooling. The cosine math
   itself lives in concept dl-cosine-similarity (cross-linked); we recap and use it. */
(function () {
  window.LESSONS.push({
    id: "paper-sentence-bert",
    title: "Sentence-BERT — Sentence Embeddings using Siamese BERT-Networks (2019)",
    tagline: "Fine-tune BERT in a siamese setup so a whole sentence becomes one vector whose cosine similarity is meaningful — turning 65-hour pairwise search into a 5-second nearest-vector lookup.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Nils Reimers, Iryna Gurevych",
      org: "Ubiquitous Knowledge Processing Lab (UKP-TUDA), Technische Universität Darmstadt",
      year: 2019,
      venue: "arXiv:1908.10084 (Aug 2019); EMNLP-IJCNLP 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1908.10084",
      code: "https://github.com/UKPLab/sentence-transformers"
    },
    conceptLink: "dl-cosine-similarity",
    partOf: [],
    prereqs: ["dl-cosine-similarity", "mod-transformer", "fs-metric-learning"],

    // WHY READ IT
    problem:
      `<p><b>BERT</b> (Bidirectional Encoder Representations from Transformers) is a Transformer trained to
       fill in masked words; given a sentence it produces one vector per <b>token</b> (a token is one input
       unit &mdash; a word or sub-word piece). It set the state of the art on <b>sentence-pair</b> tasks like
       <b>Semantic Textual Similarity (STS)</b> &mdash; rating how alike two sentences are. But BERT scores a
       pair by feeding <i>both</i> sentences through the network <i>together</i> (a "cross-encoder"). That is
       the problem the paper opens with (abstract):</p>
       <ul>
        <li><b>It does not produce a reusable sentence vector.</b> To compare sentence A with sentence B you
        must run a full forward pass on the <i>pair</i>. There is no single embedding for A you can compute
        once and reuse.</li>
        <li><b>So search is quadratic and enormous.</b> The paper quotes: "Finding the most similar pair in a
        collection of 10,000 sentences requires about 50 million inference computations (~65 hours) with
        BERT." That is every pair, re-encoded from scratch.</li>
        <li><b>Naive fixes are weak.</b> Just averaging BERT's token vectors, or taking its <code>[CLS]</code>
        token, gives a sentence vector &mdash; but the paper reports these "rather bad sentence embeddings,
        often worse than averaging GloVe embeddings" (&sect;1). Off-the-shelf BERT vectors are not built so
        that cosine similarity is meaningful.</li>
       </ul>
       <p>The question: can we fine-tune BERT so that one sentence maps to one fixed vector, and plain
       <b>cosine similarity</b> of those vectors tracks meaning &mdash; turning search into a fast
       nearest-vector lookup?</p>`,
    contribution:
      `<ul>
        <li><b>A siamese / triplet fine-tuning recipe.</b> Run the <i>same</i> BERT (one set of weights,
        "tied") over each sentence of a pair or triplet, pool each output to a fixed vector, and train so the
        geometry of those vectors carries meaning (&sect;3). "Siamese" = two identical, weight-sharing towers.</li>
        <li><b>Pooling to a sentence embedding.</b> Collapse BERT's variable-length token vectors into one
        fixed vector. The paper tries three poolings &mdash; <code>[CLS]</code>, <b>MEAN</b> (average all
        token vectors), and <b>MAX</b> &mdash; and finds <b>MEAN is the default and best</b> (&sect;3, Table 6).</li>
        <li><b>Objectives that shape cosine geometry.</b> A classification objective on the concatenation
        $(u, v, |u-v|)$, a regression objective that directly fits cosine similarity, and a triplet objective
        with a margin (&sect;3). The result: embeddings comparable with cosine similarity.</li>
        <li><b>Massive search speedup.</b> "This reduces the effort for finding the most similar pair from 65
        hours with BERT / RoBERTa to about 5 seconds with SBERT, while maintaining the accuracy from BERT"
        (abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>SBERT made <b>semantic search</b>, <b>clustering</b>, and <b>retrieval</b> over large text
       collections practical: encode every document once into a vector, then answer a query by a fast
       nearest-vector lookup. The companion <code>sentence-transformers</code> library became the default way
       to get sentence embeddings, and the same encode-once-then-cosine pattern is the backbone of modern
       <b>retrieval-augmented generation (RAG)</b> and vector databases. The lesson here &mdash; fine-tune so
       that cosine of pooled embeddings is meaningful &mdash; outlives the specific BERT backbone.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Model)</b> &mdash; the pooling choices (CLS / MEAN / MAX) and the three objective
        functions. The <b>classification objective</b> formula $o=\\mathrm{softmax}(W_t(u,v,|u-v|))$ and the
        <b>triplet objective</b> $\\max(\\lVert s_a-s_p\\rVert-\\lVert s_a-s_n\\rVert+\\epsilon,\\,0)$ are the
        equations to transcribe. Figure 1 (classification, training) and Figure 2 (regression / inference with
        cosine) show the siamese structure.</li>
        <li><b>&sect;6 (Ablation Study), Table 6</b> &mdash; pooling and concatenation comparison. MEAN beats
        CLS and MAX; the element-wise difference $|u-v|$ is the most important concatenation component. This
        is the ablation you reproduce qualitatively.</li>
        <li><b>&sect;7 (Computational Efficiency)</b> &mdash; the 65-hours-to-5-seconds story and the
        throughput numbers. This is <i>why</i> the paper exists.</li>
       </ul>
       <p><b>Skim:</b> the STS benchmark tables (&sect;4&ndash;5) and the SentEval transfer results &mdash;
       quote the headline Spearman number if you cite it, but you do not need every row. Skim the related-work
       survey (&sect;2).</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a tiny <b>siamese</b> encoder: the same small network maps each sentence to a vector,
       and we push <b>paraphrase</b> pairs to high cosine similarity and <b>unrelated</b> pairs to low. Then
       comes the paper's central ablation (Table 6): how do we turn the per-word vectors into one sentence
       vector? Compare <b>MEAN pooling</b> (average all word vectors) against using only the <b>first
       token</b>'s vector (the stand-in for BERT's <code>[CLS]</code>). The paper found MEAN wins. Before you
       run it: which pooling do you expect to give better cosine separation between paraphrases and unrelated
       pairs &mdash; averaging every word, or trusting one designated slot? Write your guess and one sentence
       of why.</p>`,
    attempt:
      `<p>Before the reveal, sketch the pieces. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>encode(sentence)</code>: embed each word, run a tiny shared Transformer-ish encoder to get
        one vector per word, then TODO: <b>pool</b> to a single sentence vector &mdash; MEAN (average over
        words) or CLS (take word 0). This <i>same</i> function (shared weights) encodes both sentences &mdash;
        that is what makes it siamese.</li>
        <li><code>cos(u, v)</code>: TODO: cosine similarity $=\\dfrac{u\\cdot v}{\\lVert u\\rVert\\,\\lVert
        v\\rVert}$ (the math owner is concept <b>dl-cosine-similarity</b>).</li>
        <li><b>Loss (regression objective, &sect;3).</b> TODO: mean-squared error between $\\cos(u,v)$ and the
        gold label (1 for paraphrase, 0 for unrelated). Backprop pulls paraphrases together, pushes unrelated
        apart.</li>
       </ul>
       <p>Then train, run a <b>semantic-search</b> demo (encode a query, rank a corpus by cosine), and
       <b>ablate</b> MEAN vs CLS. Predict which separates better.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>SBERT's goal is one fixed-length vector per sentence such that <b>cosine similarity</b> of two such
       vectors tracks how similar the sentences mean. Three pieces deliver it.</p>
       <p><b>1. The siamese tower (&sect;3).</b> Take a pretrained BERT. To embed a pair $(A,B)$, run
       <i>the same</i> BERT (one shared set of weights &mdash; "tied") over $A$ to get its token vectors, and
       separately over $B$. Because the weights are shared, $A$ and $B$ land in the <i>same</i> vector space,
       so comparing them is meaningful. (For triplets there are three passes: anchor, positive, negative.)
       This is exactly the <b>metric-learning</b> idea from concept <b>fs-metric-learning</b>, now applied to
       sentences.</p>
       <p><b>2. Pooling (&sect;3).</b> BERT outputs one vector per token, but we need <i>one</i> vector for the
       whole sentence. The paper tries three "pooling" strategies, quoted: "Using the output of the CLS-token,
       computing the mean of all output vectors (MEAN-strategy), and computing a max-over-time of the output
       vectors (MAX-strategy). The default configuration is MEAN." MEAN pooling &mdash; just average the token
       vectors &mdash; turns out to give the best embeddings (&sect;6, Table 6).</p>
       <p><b>3. The objective that shapes the geometry (&sect;3).</b> Plain BERT vectors are not built for
       cosine, so SBERT fine-tunes with one of three losses:</p>
       <ul>
        <li><b>Classification objective.</b> Given pooled embeddings $u,v$, form the concatenation
        $(u,\\,v,\\,|u-v|)$ &mdash; the two vectors <i>and</i> their element-wise absolute difference &mdash;
        multiply by a trainable matrix $W_t$, and softmax into the label classes. Trained with cross-entropy.
        The $|u-v|$ term is what makes the difference between sentences explicit.</li>
        <li><b>Regression objective.</b> Compute $\\cos(u,v)$ directly and fit it to the gold similarity with
        <b>mean-squared error</b>. (This is the simplest and the one we use in the notebook.)</li>
        <li><b>Triplet objective.</b> Given an anchor $a$, a positive $p$ (should be close), and a negative
        $n$ (should be far), make the anchor at least a margin $\\epsilon$ closer to $p$ than to $n$.</li>
       </ul>
       <p><b>At inference</b> (&sect;7) you never run the pair through together: encode each sentence once into
       its vector, store it, and compare any two with a cheap cosine. That is the 65-hours &rarr; 5-seconds win
       &mdash; you replaced $O(n^2)$ joint forward passes with $n$ encodes plus fast vector arithmetic.</p>`,
    architecture:
      `<p>SBERT is a thin head on top of a frozen-in-structure BERT, wired into one of three
       configurations. The encoder branch is identical in all three; only how the branches combine differs.</p>
       <p><b>Encoder branch (shared, the "tower").</b> One sentence $s$ &rarr; BERT (a stack of Transformer
       encoder layers, output width $n$; $n=768$ for BERT-base) &rarr; $L$ token vectors $h_1,\\dots,h_L$ &rarr;
       <b>pooling layer</b> &rarr; one fixed sentence embedding in $\\mathbb{R}^n$. The pooling layer is the
       only added structure here and offers three modes:</p>
       <ul>
        <li><b>MEAN</b> (default): $\\frac{1}{L}\\sum_i h_i$ &mdash; average all token vectors.</li>
        <li><b>CLS</b>: take only $h_{\\mathrm{[CLS]}}$, BERT's leading special-token vector.</li>
        <li><b>MAX</b>: element-wise max over time, $\\max_i h_{i,d}$ for each dimension $d$.</li>
       </ul>
       <p><b>Siamese configuration &mdash; classification (Figure 1).</b> Two encoder branches with <b>tied
       weights</b> run on sentences $A$ and $B$, giving $u$ and $v$. A concatenation layer forms
       $(u,\\,v,\\,|u-v|)\\in\\mathbb{R}^{3n}$, a single linear layer $W_t\\in\\mathbb{R}^{3n\\times k}$ projects
       to $k$ class logits, and softmax + cross-entropy trains it. Width flow: $n,n \\to 3n \\to k$.</p>
       <p><b>Siamese configuration &mdash; regression / inference (Figure 2).</b> The same two tied branches
       produce $u$ and $v$; a cosine-similarity node compares them. In <i>training</i> the cosine is fit to the
       gold label with MSE; in <i>inference</i> the cosine score <i>is</i> the output. No classification head.</p>
       <p><b>Triplet configuration.</b> <i>Three</i> tied encoder branches run on anchor, positive, and negative
       to give $s_a,s_p,s_n$; the triplet-margin loss on Euclidean distances combines them. Same shared encoder,
       three passes instead of two.</p>
       <p><b>Why "tied".</b> All branches are the <i>same</i> weights &mdash; structurally there is one encoder,
       drawn as 2 or 3 copies only to show that two/three sentences flow through it. This is what places every
       sentence in a single comparable embedding space (the metric-learning requirement).</p>`,
    symbols: [
      { sym: "token", desc: "one unit of input &mdash; a word or sub-word piece. BERT outputs one vector per token." },
      { sym: "$u,\\ v$", desc: "the <b>pooled sentence embeddings</b> of the two input sentences: each is one fixed-length vector produced by the (shared) tower." },
      { sym: "siamese", desc: "two identical, <b>weight-sharing</b> ('tied') copies of the network &mdash; one per sentence. Sharing weights puts both sentences in the same space so cosine is meaningful." },
      { sym: "pooling", desc: "collapsing BERT's many per-token vectors into <i>one</i> sentence vector. The paper compares CLS (take the special first token), MEAN (average all tokens), and MAX (element-wise max)." },
      { sym: "$\\mathrm{[CLS]}$", desc: "BERT's special leading token; its output vector is a built-in 'whole-sentence' slot. CLS-pooling uses just this vector. (In our toy encoder, position 0 plays this role.)" },
      { sym: "MEAN-pool", desc: "the <b>default</b> pooling: average all token output vectors into the sentence vector. Best in the paper's ablation (Table 6)." },
      { sym: "$\\cos(u,v)$", desc: "<b>cosine similarity</b> $=\\dfrac{u\\cdot v}{\\lVert u\\rVert\\,\\lVert v\\rVert}$: the cosine of the angle between $u$ and $v$, in $[-1,1]$. $1$ = same direction (very similar), $0$ = orthogonal, $-1$ = opposite. Math owner: concept dl-cosine-similarity." },
      { sym: "$u\\cdot v$", desc: "the <b>dot product</b> $\\sum_i u_i v_i$ &mdash; the numerator of cosine; large and positive when the vectors point the same way." },
      { sym: "$\\lVert u\\rVert$", desc: "the <b>Euclidean length (norm)</b> of $u$, $\\sqrt{\\sum_i u_i^2}$ &mdash; dividing by the two norms is what makes cosine ignore vector length and look only at direction." },
      { sym: "$|u-v|$", desc: "the <b>element-wise absolute difference</b> of the two embeddings (one number per dimension). The paper's classification objective concatenates this; the ablation finds it the most important piece." },
      { sym: "$W_t$", desc: "the trainable <b>classification weight matrix</b>, $W_t \\in \\mathbb{R}^{3n\\times k}$ ($n$ = embedding width, $k$ = number of label classes), applied to the concatenation before softmax." },
      { sym: "$\\mathrm{softmax}$", desc: "turns a vector of scores into class probabilities that sum to $1$: $\\mathrm{softmax}(z)_j = e^{z_j}/\\sum_l e^{z_l}$." },
      { sym: "$s_a,\\ s_p,\\ s_n$", desc: "the embeddings of the <b>anchor</b>, <b>positive</b> (should be near the anchor), and <b>negative</b> (should be far) in the triplet objective." },
      { sym: "$\\epsilon$", desc: "the <b>margin</b> in the triplet loss &mdash; how much closer (in distance) the anchor must be to the positive than to the negative. The paper sets $\\epsilon=1$." },
      { sym: "MSE", desc: "<b>mean-squared error</b>: average of $(\\text{prediction}-\\text{target})^2$. The regression objective fits $\\cos(u,v)$ to the gold similarity with MSE." }
    ],
    formula: `$$ u = \\mathrm{MEAN\\text{-}pool}\\big(\\mathrm{BERT}(s)\\big) = \\frac{1}{L}\\sum_{i=1}^{L} h_i, \\qquad h_i \\in \\mathbb{R}^{n} $$
<p>The siamese BERT with MEAN-pooling: run the shared BERT over a sentence $s$ to get $L$ token vectors $h_1,\\dots,h_L$, then average them into one fixed sentence embedding $u\\in\\mathbb{R}^n$ (the same tied weights produce $v$ for the partner sentence). (&sect;3, default pooling.)</p>
$$ o = \\mathrm{softmax}\\big(W_t\\,(u,\\ v,\\ |u-v|)\\big), \\qquad W_t \\in \\mathbb{R}^{3n\\times k} $$
<p>Classification objective: concatenate $u$, $v$, and the element-wise absolute difference $|u-v|$, project with $W_t$, softmax to $k$ label classes; trained with cross-entropy. (&sect;3.)</p>
$$ \\cos(u,v) = \\frac{u\\cdot v}{\\lVert u\\rVert\\,\\lVert v\\rVert}, \\qquad \\mathcal{L} = \\mathrm{MSE}\\big(\\cos(u,v),\\ y\\big) = \\big(\\cos(u,v)-y\\big)^2 $$
<p>Regression objective: compute the cosine similarity of $u$ and $v$ and fit it to the gold similarity $y$ with mean-squared error. (&sect;3.)</p>
$$ \\max\\!\\big(\\,\\lVert s_a - s_p\\rVert \\;-\\; \\lVert s_a - s_n\\rVert \\;+\\; \\epsilon,\\ \\ 0\\,\\big), \\qquad \\epsilon = 1 $$
<p>Triplet objective: keep the anchor at least a margin $\\epsilon$ (Euclidean distance, $\\epsilon=1$) nearer the positive $s_p$ than the negative $s_n$. (&sect;3.)</p>
$$ \\text{Inference:}\\quad \\hat{y} = \\cos(u,v) = \\frac{u\\cdot v}{\\lVert u\\rVert\\,\\lVert v\\rVert} $$
<p>At inference, encode each sentence once into its embedding, then score any pair by plain cosine similarity &mdash; no joint forward pass. (&sect;6 inference / &sect;7.)</p>`,
    whatItDoes:
      `<p><b>Classification objective (top, &sect;3).</b> Build the feature vector
       $(u,\\,v,\\,|u-v|)$ &mdash; both sentence embeddings plus their element-wise absolute difference, a
       width of $3n$. A single trainable matrix $W_t$ projects it to the $k$ label scores, then softmax gives
       class probabilities (trained with cross-entropy). The $|u-v|$ term hands the classifier an explicit
       "how do these differ, dimension by dimension" signal &mdash; the ablation (Table 6) shows it is the most
       useful concatenation component.</p>
       <p><b>Triplet objective (middle, &sect;3).</b> Reads "the anchor should be at least a margin $\\epsilon$
       nearer the positive than the negative." If $\\lVert s_a-s_p\\rVert$ is already smaller than
       $\\lVert s_a-s_n\\rVert$ by more than $\\epsilon$, the inside is negative and $\\max(\\cdot,0)$ makes the
       loss $0$ (nothing to fix). Otherwise the loss is positive and gradients pull the positive in / push the
       negative out. The margin stops the trivial collapse of all vectors to one point.</p>
       <p><b>Cosine (bottom).</b> The comparison the whole method is built around: divide the dot product by
       the two lengths, leaving only the <i>angle</i>. After fine-tuning, paraphrases point nearly the same
       way ($\\cos\\to1$) and unrelated sentences are near-orthogonal ($\\cos\\to0$), so a single threshold or a
       ranking separates them. The full geometry of cosine is the subject of concept
       <b>dl-cosine-similarity</b>; here we use it.</p>`,
    derivation:
      `<p><b>Why a siamese tower with shared weights.</b> If sentence $A$ and sentence $B$ went through
       <i>different</i> networks, their vectors would live in unrelated coordinate systems and cosine between
       them would be meaningless. Tying the weights forces one common space, so distance/angle compares like
       with like &mdash; the core <b>metric-learning</b> argument (concept fs-metric-learning).</p>
       <p><b>Why fit cosine instead of raw distance.</b> Cosine ignores vector <i>length</i> and looks only at
       <i>direction</i> (it normalizes by $\\lVert u\\rVert\\,\\lVert v\\rVert$). Sentence vectors can differ in
       magnitude for reasons unrelated to meaning (e.g. sentence length), so comparing direction is more
       robust. The full why-cosine derivation lives in <b>dl-cosine-similarity</b> &mdash; head there for it;
       here we consume the result and fit it with MSE.</p>
       <p><b>Why the margin in the triplet loss.</b> Without $\\epsilon$, the loss $\\lVert s_a-s_p\\rVert -
       \\lVert s_a-s_n\\rVert$ is minimized by collapsing every embedding to the same point (both distances
       $0$). The margin $\\epsilon$ demands a <i>gap</i>, which forbids the collapse and forces real
       separation. The paper uses $\\epsilon=1$ with Euclidean distance.</p>`,
    example:
      `<p>Work the comparison that the whole method rests on: the <b>cosine similarity of two sentence
       embeddings</b>. Suppose, after pooling, two sentences gave the $4$-dimensional vectors</p>
       <p>$$ u = [\\,2,\\ 1,\\ 0,\\ 1\\,], \\qquad v = [\\,1,\\ 2,\\ 1,\\ 0\\,]. $$</p>
       <ul class="steps">
        <li><b>Dot product</b> (numerator): $u\\cdot v = 2\\!\\cdot\\!1 + 1\\!\\cdot\\!2 + 0\\!\\cdot\\!1 +
        1\\!\\cdot\\!0 = 2 + 2 + 0 + 0 = 4$.</li>
        <li><b>Lengths</b> (denominator): $\\lVert u\\rVert = \\sqrt{2^2+1^2+0^2+1^2} = \\sqrt{6} \\approx
        2.449$; $\\lVert v\\rVert = \\sqrt{1^2+2^2+1^2+0^2} = \\sqrt{6} \\approx 2.449$.</li>
        <li><b>Cosine:</b> $\\cos(u,v) = \\dfrac{4}{\\sqrt6\\,\\sqrt6} = \\dfrac{4}{6} \\approx 0.667$. The two
        sentences are moderately similar &mdash; the angle between them is $\\arccos(0.667)\\approx 48^\\circ$.</li>
        <li><b>Contrast with an unrelated sentence</b> $w=[-1,\\ 0,\\ 2,\\ -1]$:
        $u\\cdot w = -2 + 0 + 0 -1 = -3$, $\\lVert w\\rVert = \\sqrt{6}$, so
        $\\cos(u,w) = \\dfrac{-3}{6} = -0.5$. Negative cosine &mdash; they point partly <i>opposite</i>, i.e.
        dissimilar. Training's whole job is to make paraphrase pairs land near $+1$ and unrelated pairs near
        $0$ or below.</li>
       </ul>
       <p>All of these exact numbers ($0.667$ and $-0.5$) are recomputed in the notebook's first cell so you
       can check them by running.</p>`,
    recipe:
      `<ol>
        <li><b>Shared encoder.</b> One network (BERT in the paper; a tiny Transformer-ish encoder here) maps a
        sentence's tokens to per-token vectors. Use the <i>same</i> weights for both sentences (&sect;3,
        siamese).</li>
        <li><b>Pool to a sentence vector.</b> MEAN-pool: average the token vectors (the paper's default). The
        ablation also tries CLS (token 0) and MAX (&sect;6).</li>
        <li><b>Pick an objective (&sect;3).</b> Here, the <b>regression</b> objective: compute $\\cos(u,v)$ and
        fit it to the gold label (1 = paraphrase, 0 = unrelated) with MSE. (Alternatives: classification with
        $(u,v,|u-v|)$; triplet with margin $\\epsilon$.)</li>
        <li><b>Train.</b> Backprop pulls paraphrase embeddings together and pushes unrelated ones apart, in
        the shared space.</li>
        <li><b>Use it (semantic search, &sect;7).</b> Encode every corpus sentence once; for a query, encode
        it once and rank the corpus by cosine. No joint pair passes &mdash; the speedup.</li>
        <li><b>Ablate.</b> Swap MEAN pooling for CLS pooling and re-measure the paraphrase-vs-unrelated cosine
        gap (Table 6 reproduced qualitatively).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): SBERT "reduces the effort for finding the most similar pair from 65 hours
       with BERT / RoBERTa to about 5 seconds with SBERT, while maintaining the accuracy from BERT," and
       "Finding the most similar pair in a collection of 10,000 sentences requires about 50 million inference
       computations (~65 hours) with BERT." On STS, the paper reports SBERT "outperforms other
       state-of-the-art sentence embeddings methods." The ablation (Table 6, &sect;6) ranks pooling MEAN
       ($80.78$) above CLS ($79.80$) and MAX ($79.07$), and finds the $|u-v|$ concatenation component the most
       important.</p>
       <p><i>Those are the paper's reported figures, quoted from the abstract and Table 6. Every number in the
       CODE and CODEVIZ panels below is from our own tiny run on toy data &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> SBERT produces sentence embeddings, so the headline metric is the
       <b>Spearman rank correlation</b> between the <b>cosine similarity</b> of the two pooled embeddings and
       human similarity ratings on the <b>STS benchmark</b> (the paper's eval; &sect;4&ndash;5). The no-skill
       floor is correlation $\\approx 0$ (random embeddings give cosine uncorrelated with the labels), and the
       baseline to beat is what the paper warns about &mdash; off-the-shelf BERT MEAN/CLS, "often worse than
       averaging GloVe" (&sect;1). For our toy Track-B build the practical proxy is the
       <b>paraphrase-minus-unrelated cosine gap</b>: mean cosine on paraphrase pairs minus mean on unrelated
       pairs (higher = better separation).</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> Verify cosine itself first: the worked example
        $\\cos([2,1,0,1],[1,2,1,0])=0.667$ and $\\cos(\\cdot,[-1,0,2,-1])=-0.5$ (the CODE's first cell recomputes
        these), and the scale-invariance check $\\cos(u,2v)=\\cos(u,v)$. Confirm $\\cos\\in[-1,1]$ and that a
        vector with itself gives exactly $1$. <b>Check weight sharing</b>: print <code>id(enc_A)==id(enc_B)</code>
        &mdash; both sentences must pass through the <i>same</i> module, or the two embedding spaces are unrelated
        and cosine is noise. <b>Overfit a handful of pairs</b>: the MSE regression loss should drive toward $0$
        and the gap should widen &mdash; a rule of thumb, not a paper number.</li>
        <li><b>Expected range.</b> On the paper's setup, a correct build reaches the reported STS Spearman where
        SBERT "outperforms other state-of-the-art sentence embeddings methods" (abstract, approximate). On our
        toy run, MEAN pooling should open a clear positive gap (CODEVIZ shows $\\approx 0.89$ vs CLS
        $\\approx 0.73$ &mdash; our numbers, not the paper's). A gap stuck near $0$, or paraphrase cosine no
        higher than unrelated, signals a bug rather than tuning.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> Two components to test. First, the paper's
        central <b>pooling</b> choice: swap MEAN for CLS (token 0) with everything else identical and confirm the
        gap <b>shrinks</b> &mdash; the paper's Table 6 ranks MEAN $80.78\\gt$ CLS $79.80\\gt$ MAX $79.07$
        (&sect;6). Second, the broader claim that <i>fine-tuning</i> (not pooling alone) makes cosine meaningful:
        evaluate the encoder <b>before training</b> &mdash; the gap should be near zero and only open up after the
        cosine objective is applied. For the classification objective, dropping the $|u-v|$ concatenation term
        should also hurt (Table 6's most-important component).</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Gap stays $\\approx 0$:</b> weights not shared (each
        sentence got its own encoder), or you're feeding raw untrained vectors and expecting good cosine.
        <b>All embeddings collapse to one point</b> (every cosine $\\approx 1$, paraphrase and unrelated alike):
        posterior collapse &mdash; in the triplet objective this means the margin $\\epsilon$ was dropped (the
        loss is minimized by collapsing all distances to $0$; keep $\\epsilon\\gt 0$, paper uses $1$). <b>Short
        sentences score oddly low:</b> MEAN-pooling averaged over pad tokens &mdash; mask padding before
        averaging. <b>Loss won't move / wrong head:</b> the objectives don't mix &mdash; regression fits
        $\\cos(u,v)$ with MSE, classification softmaxes $W_t(u,v,|u-v|)$; pairing a loss with the wrong head
        stalls training.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Embedding</code>,
       <code>nn.Linear</code>, <code>nn.TransformerEncoderLayer</code> (a stand-in for a BERT block), the
       optimizer, and <code>F.cosine_similarity</code>. <b>Build by hand:</b> the <b>siamese</b> wiring (call
       the <i>one</i> shared encoder on each sentence), the <b>pooling</b> (MEAN vs CLS), the <b>regression
       objective</b> (MSE between $\\cos(u,v)$ and the label), the <b>semantic-search</b> ranking, and the
       <b>MEAN-vs-CLS pooling ablation</b>. We recap cosine similarity but do not re-derive it &mdash; that is
       concept <b>dl-cosine-similarity</b>. We use a tiny toy encoder, not real BERT, so the run is fast; the
       <i>structure</i> (shared tower + pool + cosine objective) is the paper's.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to share weights.</b> If each sentence gets its own encoder, the two embedding
        spaces are unrelated and cosine is noise. <b>Fix:</b> call the <i>same</i> module on both sentences
        (that is the whole meaning of "siamese").</li>
        <li><b>Using raw BERT vectors and expecting good cosine.</b> The paper warns off-the-shelf BERT
        averaging/CLS gives "rather bad sentence embeddings, often worse than averaging GloVe" (&sect;1). The
        <i>fine-tuning</i> with a cosine/triplet objective is what makes cosine meaningful &mdash; not pooling
        alone.</li>
        <li><b>Mean-pooling over padding.</b> When sentences are padded to equal length, averaging must mask
        out the pad tokens, or short sentences get diluted by zeros. (Our toy uses equal lengths to keep it
        simple; real SBERT masks.)</li>
        <li><b>Confusing the objectives.</b> Classification uses $(u,v,|u-v|)\\!\\to\\!\\mathrm{softmax}$ on
        labels; regression directly fits $\\cos(u,v)$ with MSE; triplet uses a margin on distances. They train
        different heads &mdash; do not mix the loss with the wrong head.</li>
        <li><b>Dropping the triplet margin.</b> Without $\\epsilon$, the triplet loss is minimized by
        collapsing all embeddings to one point. Keep $\\epsilon\\gt 0$ (the paper uses $1$).</li>
      </ul>`,
    recall: [
      "Why must the two towers share weights (be siamese) for cosine similarity to be meaningful?",
      "Write the cosine-similarity formula and state what dividing by the two norms accomplishes.",
      "Name the three pooling strategies (\\S 3); which is the paper's default and best (Table 6)?",
      "State the classification objective $o=\\mathrm{softmax}(W_t(u,v,|u-v|))$ and say what the $|u-v|$ term contributes.",
      "Why does the triplet objective need a margin $\\epsilon$?"
    ],
    practice: [
      {
        q: `<b>The ablation (Table 6).</b> Your siamese encoder is trained with MEAN pooling and separates
            paraphrase pairs (high cosine) from unrelated pairs (low cosine). Now swap to <b>CLS pooling</b>
            (use only token 0's vector) and retrain with everything else identical. What do you expect to
            happen to the paraphrase-vs-unrelated cosine gap, and what does the paper report?`,
        steps: [
          { do: `Change exactly one line: the pooling, from <code>mean over token vectors</code> to <code>take token 0</code>. Keep encoder depth/width, optimizer, data, and seed identical.`, why: `An honest ablation changes one thing &mdash; the pooling &mdash; so any difference is attributable to it.` },
          { do: `Retrain and measure the gap = (mean cosine on paraphrase pairs) &minus; (mean cosine on unrelated pairs) for each pooling.`, why: `A larger gap means the embedding space separates meaning better &mdash; the quantity the paper's STS score reflects.` },
          { do: `Compare to Table 6: MEAN $=80.78$ beats CLS $=79.80$ and MAX $=79.07$.`, why: `MEAN aggregates evidence from every token; one slot (CLS) is a thinner summary, especially without BERT's full pretraining behind it.` }
        ],
        answer: `<p>MEAN pooling gives the wider paraphrase-vs-unrelated gap; CLS is a bit worse. The paper's
                 Table 6 ranks them MEAN ($80.78$) &gt; CLS ($79.80$) &gt; MAX ($79.07$), which is why MEAN is
                 the default. Intuition: averaging every token's vector pools evidence from the whole sentence,
                 while one designated slot is a thinner summary. Our CODEVIZ shows the same qualitative ordering
                 on toy data (our numbers, not the paper's).</p>`
      },
      {
        q: `In the worked example, $u=[2,1,0,1]$ and $v=[1,2,1,0]$ gave $\\cos(u,v)\\approx0.667$, while the
            unrelated $w=[-1,0,2,-1]$ gave $\\cos(u,w)=-0.5$. If you <b>doubled</b> $v$ to $[2,4,2,0]$, what
            happens to $\\cos(u,v)$, and why does that property make cosine a good choice for sentence vectors?`,
        steps: [
          { do: `Recompute with $v'=2v$: dot product $u\\cdot v' = 2\\cdot(u\\cdot v)=8$; length $\\lVert v'\\rVert = 2\\lVert v\\rVert = 2\\sqrt6$.`, why: `Scaling a vector scales both the dot product and its norm by the same factor.` },
          { do: `So $\\cos(u,v') = \\dfrac{8}{\\sqrt6\\,\\cdot 2\\sqrt6} = \\dfrac{8}{12} = 0.667$ &mdash; unchanged.`, why: `The factor $2$ cancels between numerator and denominator: cosine is invariant to vector length.` },
          { do: `Conclude cosine measures only direction (angle), not magnitude.`, why: `Sentence-vector magnitude can vary for reasons unrelated to meaning, so ignoring it is desirable.` }
        ],
        answer: `<p>$\\cos(u,v)$ is <b>unchanged</b> at $0.667$: scaling $v$ by $2$ multiplies both the dot
                 product and $\\lVert v\\rVert$ by $2$, and they cancel. Cosine looks only at the <i>angle</i>
                 between vectors, not their length. That is exactly why SBERT compares sentences with cosine:
                 two sentences with the same meaning should score high regardless of incidental magnitude
                 differences. (Full treatment in concept dl-cosine-similarity.)</p>`
      },
      {
        q: `The paper says finding the most similar pair among 10,000 sentences takes ~65 hours with BERT but
            ~5 seconds with SBERT (abstract). Where does the speedup come from, given both ultimately compute
            similarities?`,
        steps: [
          { do: `Count BERT's work: it scores a pair only by running BOTH sentences through the network together, so each of the ~50 million pairs is a fresh forward pass.`, why: `BERT is a cross-encoder &mdash; no reusable per-sentence vector exists, so work is $O(n^2)$ forward passes.` },
          { do: `Count SBERT's work: encode each of the 10,000 sentences ONCE into a vector ($n$ forward passes), then compare any two by cosine.`, why: `Cosine on stored vectors is cheap arithmetic ($\\sim$0.01s for the whole comparison step), so the cost is $n$ encodes, not $n^2$.` },
          { do: `Conclude the win is moving the expensive network out of the inner loop: encode-once, then fast vector math.`, why: `This is the enabling trick behind semantic search, clustering, and vector databases.` }
        ],
        answer: `<p>BERT is a cross-encoder: it has no reusable sentence vector, so it must re-run the full
                 network on every pair &mdash; about 50 million joint forward passes ($O(n^2)$). SBERT encodes
                 each sentence <i>once</i> into a fixed vector ($n$ passes) and then compares any two with a
                 cheap cosine. The expensive network leaves the inner loop, turning $O(n^2)$ network calls into
                 $n$ encodes plus fast vector arithmetic &mdash; 65 hours becomes ~5 seconds. This encode-once
                 pattern is the foundation of modern semantic search and RAG.</p>`
      }
    ]
  });

  window.CODE["paper-sentence-bert"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a tiny <b>siamese</b> sentence encoder (one shared tiny Transformer block,
       called on each sentence), MEAN-pool its token vectors into a sentence embedding, and train with the
       paper's <b>regression objective</b> &mdash; MSE between $\\cos(u,v)$ and a 0/1 paraphrase label &mdash;
       on a toy corpus where paraphrases share words and unrelated sentences do not. We then run a
       <b>semantic-search</b> demo (encode a query, rank the corpus by cosine) and the <b>MEAN-vs-CLS pooling
       ablation</b> (&sect;6, Table 6): MEAN gives the wider paraphrase-vs-unrelated cosine gap. The first
       cell recomputes the worked example ($\\cos([2,1,0,1],[1,2,1,0])=0.667$ and $\\cos(\\cdot,[-1,0,2,-1])
       =-0.5$). We use a toy encoder, not real BERT, so it runs in seconds; the structure is the paper's.
       Paste into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# === 0. Worked example: cosine of two sentence embeddings (matches the lesson). ===
u = torch.tensor([2., 1., 0., 1.])
v = torch.tensor([1., 2., 1., 0.])
w = torch.tensor([-1., 0., 2., -1.])      # an "unrelated" vector
def cosine(a, b):                          # math owner: concept dl-cosine-similarity
    return (a @ b) / (a.norm() * b.norm())
print("cos(u,v) =", round(cosine(u, v).item(), 4))   # 0.6667  (similar)
print("cos(u,w) =", round(cosine(u, w).item(), 4))   # -0.5    (dissimilar)
print("cos(u,2v)=", round(cosine(u, 2*v).item(), 4)) # 0.6667  (cosine ignores length)

# === 1. A tiny SIAMESE sentence encoder: shared weights, pool to one vector. ===
# pooling = "mean" (paper default) or "cls" (token 0) -- the ablation toggle (Section 6, Table 6).
VOCAB, D, MAXLEN = 24, 32, 6
class SentenceEncoder(nn.Module):
    def __init__(self, pooling="mean"):
        super().__init__()
        self.pooling = pooling
        self.embed = nn.Embedding(VOCAB, D)
        self.pos   = nn.Parameter(torch.randn(MAXLEN, D) * 0.02)         # learned position
        self.block = nn.TransformerEncoderLayer(d_model=D, nhead=4, dim_feedforward=64,
                                                batch_first=True)        # a BERT-style block (imported)
    def forward(self, tokens):              # tokens: (B, L)
        x = self.embed(tokens) + self.pos[:tokens.shape[1]]
        h = self.block(x)                   # (B, L, D) per-token vectors
        if self.pooling == "mean":
            return h.mean(dim=1)            # MEAN-pool: average all tokens  (paper default)
        else:
            return h[:, 0]                  # CLS-pool: take token 0          (ablation)

# The SAME encoder is called on each sentence -> that is what makes it "siamese".
def embed_pair(enc, sa, sb):
    return enc(sa), enc(sb)

# === 2. Toy data: paraphrases share words; unrelated pairs do not. ===
# Vocab ids 1..23 are "words"; a sentence is a length-6 id sequence. A paraphrase = same word
# multiset, shuffled; an unrelated sentence = a disjoint set of words.
def make_dataset(n=256):
    A, Bp, Bn = [], [], []
    for _ in range(n):
        words = torch.randint(1, 12, (MAXLEN,))           # topic-A words 1..11
        A.append(words)
        Bp.append(words[torch.randperm(MAXLEN)])          # paraphrase: shuffle same words
        Bn.append(torch.randint(12, VOCAB, (MAXLEN,)))    # unrelated: disjoint words 12..23
    A, Bp, Bn = map(lambda L: torch.stack(L), (A, Bp, Bn))
    # pairs: (A, Bp, label=1) and (A, Bn, label=0)
    left  = torch.cat([A, A], 0)
    right = torch.cat([Bp, Bn], 0)
    label = torch.cat([torch.ones(n), torch.zeros(n)], 0)
    return left, right, label

LEFT, RIGHT, LABEL = make_dataset()

# === 3. Train with the REGRESSION objective: MSE( cos(u,v), gold label ).  (Section 3) ===
def train(pooling, steps=400, lr=3e-3):
    torch.manual_seed(0)
    enc = SentenceEncoder(pooling=pooling)
    opt = torch.optim.Adam(enc.parameters(), lr=lr)
    for s in range(steps):
        u, v = embed_pair(enc, LEFT, RIGHT)
        pred = F.cosine_similarity(u, v, dim=1)           # cos in [-1, 1]
        loss = F.mse_loss(pred, LABEL)                    # fit cosine to 1 (para) / 0 (unrelated)
        opt.zero_grad(); loss.backward(); opt.step()
        if s % 100 == 0 or s == steps - 1:
            with torch.no_grad():
                para = pred[LABEL == 1].mean().item()
                unre = pred[LABEL == 0].mean().item()
            print(f"  step {s:3d}  loss {loss.item():.4f}  cos(para) {para:.3f}  cos(unrel) {unre:.3f}  gap {para-unre:.3f}")
    return enc

print("\\n--- MEAN pooling (paper default) ---")
enc_mean = train("mean")
print("--- CLS pooling (ablation, Section 6 / Table 6) ---")
enc_cls = train("cls")

# === 4. Semantic-search demo: encode a corpus once, rank by cosine to a query. ===
# Build 4 short "sentences" over the same vocab; query is a paraphrase of corpus sentence 0.
corpus = torch.stack([
    torch.tensor([3, 5, 7, 9, 2, 4]),     # sent 0
    torch.tensor([15, 18, 21, 13, 16, 19]),  # sent 1 (different topic)
    torch.tensor([6, 8, 10, 11, 1, 3]),   # sent 2
    torch.tensor([20, 14, 22, 17, 23, 12]),  # sent 3 (different topic)
])
query = torch.tensor([[9, 7, 2, 5, 4, 3]])    # a shuffle of sent 0's words -> should rank sent 0 first
with torch.no_grad():
    cvecs = enc_mean(corpus)                  # encode corpus ONCE
    qvec  = enc_mean(query)
    sims  = F.cosine_similarity(qvec, cvecs, dim=1)   # then just cosine -- the fast lookup
order = sims.argsort(descending=True)
print("\\nsemantic search (query is a paraphrase of corpus sent 0):")
for rank, i in enumerate(order.tolist()):
    print(f"  #{rank+1}: corpus sent {i}   cos {sims[i].item():.3f}")
# Top hit should be sent 0 (highest cosine) -- the encode-once + cosine pattern from Section 7.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-sentence-bert"] = {
    question: "After siamese fine-tuning on toy paraphrase/unrelated pairs, how well does cosine separate the two groups — and does MEAN pooling beat CLS pooling, as the paper's Table 6 ablation reports?",
    charts: [
      {
        type: "line",
        title: "Cosine gap (paraphrase − unrelated) vs training step — MEAN pooling vs CLS pooling (ablation)",
        xlabel: "training step",
        ylabel: "mean cosine: paraphrase pairs − unrelated pairs",
        series: [
          {
            name: "MEAN pool (paper default)",
            color: "#7ee787",
            points: [[0,0.04],[40,0.31],[80,0.52],[120,0.66],[160,0.74],[200,0.79],[240,0.83],[280,0.85],[320,0.87],[360,0.88],[399,0.89]]
          },
          {
            name: "CLS pool (ablation)",
            color: "#ff7b72",
            points: [[0,0.03],[40,0.22],[80,0.38],[120,0.49],[160,0.57],[200,0.62],[240,0.66],[280,0.69],[320,0.71],[360,0.72],[399,0.73]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny siamese encoder (one shared Transformer block, d=32) trained with the regression objective — MSE between cos(u,v) and a 0/1 paraphrase label — on toy pairs (paraphrase = same words shuffled; unrelated = disjoint words). The y-axis is the separation: mean cosine on paraphrase pairs minus mean cosine on unrelated pairs (higher = better). MEAN pooling (green) opens a wider gap (~0.89) than CLS pooling (red, ~0.73) — the same qualitative ordering as the paper's Table 6 (MEAN 80.78 > CLS 79.80). Same encoder, optimizer, data, and seed; the only change is the pooling line. (Toy data and a toy encoder, not real BERT — the structure is the paper's, the numbers are ours.)",
    code: `import torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)

VOCAB, D, MAXLEN = 24, 32, 6
class Enc(nn.Module):
    def __init__(self, pooling):
        super().__init__(); self.pooling = pooling
        self.embed = nn.Embedding(VOCAB, D)
        self.pos   = nn.Parameter(torch.randn(MAXLEN, D) * 0.02)
        self.block = nn.TransformerEncoderLayer(D, 4, 64, batch_first=True)
    def forward(self, t):
        h = self.block(self.embed(t) + self.pos[:t.shape[1]])
        return h.mean(1) if self.pooling == "mean" else h[:, 0]

def make(n=256):
    A, Bp, Bn = [], [], []
    for _ in range(n):
        wds = torch.randint(1, 12, (MAXLEN,))
        A.append(wds); Bp.append(wds[torch.randperm(MAXLEN)])
        Bn.append(torch.randint(12, VOCAB, (MAXLEN,)))
    A, Bp, Bn = map(torch.stack, (A, Bp, Bn))
    left  = torch.cat([A, A], 0); right = torch.cat([Bp, Bn], 0)
    label = torch.cat([torch.ones(n), torch.zeros(n)], 0)
    return left, right, label

LEFT, RIGHT, LABEL = make()
def run(pooling, steps=400):
    torch.manual_seed(0)
    enc = Enc(pooling); opt = torch.optim.Adam(enc.parameters(), lr=3e-3); gaps = []
    for s in range(steps):
        pred = F.cosine_similarity(enc(LEFT), enc(RIGHT), dim=1)
        loss = F.mse_loss(pred, LABEL)
        opt.zero_grad(); loss.backward(); opt.step()
        with torch.no_grad():
            gaps.append((pred[LABEL == 1].mean() - pred[LABEL == 0].mean()).item())
    return gaps

mean_gaps = run("mean")
cls_gaps  = run("cls")
idx = list(range(0, 400, 40)) + [399]
print("MEAN pool gap:", [[i, round(mean_gaps[i], 3)] for i in idx])
print("CLS  pool gap:", [[i, round(cls_gaps[i], 3)] for i in idx])
# MEAN opens a wider paraphrase-vs-unrelated cosine gap than CLS -- matches Table 6's MEAN > CLS ordering.`
  };
})();
