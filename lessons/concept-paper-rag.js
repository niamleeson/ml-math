/* Paper lesson — "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
   (RAG), Lewis et al., Facebook AI Research, NeurIPS 2020. Self-contained: lesson +
   CODE + CODEVIZ merged by id "paper-rag".
   GROUNDED from arXiv:2005.11401 (abstract page) and the ar5iv HTML mirror
   (Section 2 Methods: marginalization; Section 2.1 RAG-Sequence and RAG-Token models;
   Section 2.2 Retriever: DPR + MIPS; Section 2.3 Generator: BART).
   Track B (architecture): compose a tiny embedding retriever and a tiny attention
   "reader" generator with torch.nn, then implement the NOVEL part by hand — score docs
   by inner product (Maximum Inner Product Search), take the top-K, and MARGINALIZE the
   generator over them: p(y|x) = sum_z p(z|x) p(y|x,z). Reproduce the effect: a parametric
   -only model (no retrieval) gets the answer wrong because it lives in a retrieved passage. */
(function () {
  window.LESSONS.push({
    id: "paper-rag",
    title: "RAG — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)",
    tagline: "Let a generator read documents fetched on the fly, and average its answer over them.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela",
      org: "Facebook AI Research; University College London; New York University",
      year: 2020,
      venue: "arXiv:2005.11401 (May 2020); NeurIPS 2020",
      citations: "",
      arxiv: "https://arxiv.org/abs/2005.11401",
      code: "https://github.com/huggingface/transformers/blob/main/examples/research_projects/rag/README.md"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ml-softmax", "fnd-dot", "dl-cosine-similarity", "dl-word-embeddings", "dl-attention", "mod-transformer", "paper-bart", "paper-seq2seq", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A large language model stores what it knows inside its weights. We call that
       <b>parametric memory</b> &mdash; "parametric" just means "held in the model's parameters
       (its trained numbers)." This works, but it has hard limits. The facts are frozen at
       training time, you cannot point to <i>which</i> weight holds a fact, and updating one
       fact means retraining. On <b>knowledge-intensive</b> tasks &mdash; tasks whose answer is a
       specific fact, like open-domain question answering &mdash; a parametric-only model lags
       behind systems that look things up. From the abstract:</p>
       <blockquote>"Large pre-trained language models have been shown to store factual knowledge
       in their parameters... However, their ability to access and precisely manipulate knowledge
       is still limited, and hence on knowledge-intensive tasks, their performance lags behind
       task-specific architectures." (Abstract)</blockquote>
       <p>The open question: can we give a general text generator a <b>non-parametric memory</b>
       &mdash; an external store of documents it can search &mdash; so it reads the relevant
       passage at answer time instead of trying to have memorized it?</p>`,
    contribution:
      `<ul>
        <li><b>Combine parametric and non-parametric memory.</b> RAG (Retrieval-Augmented
        Generation) pairs a pre-trained sequence-to-sequence generator (parametric) with a
        searchable document index (non-parametric). The abstract calls it a model that
        "combine[s] pre-trained parametric and non-parametric memory for language generation."</li>
        <li><b>Treat the retrieved document as a latent variable and marginalize over it.</b>
        The generator does not condition on one document; it averages its output over the
        top-$K$ retrieved documents, weighted by how relevant each is. That single equation is
        the paper's core (&sect;2).</li>
        <li><b>Two formulations &mdash; RAG-Sequence and RAG-Token.</b> One uses the same document
        for the whole answer; the other can switch documents per generated token (&sect;2.1).
        Both retriever and generator train end-to-end with ordinary gradients.</li>
      </ul>`,
    whyItMattered:
      `<p>RAG named and popularized the now-standard pattern: <b>retrieve, then generate.</b>
       Almost every "chat with your documents" system, every grounded-answer assistant, and most
       enterprise question-answering stacks descend from this design. The framing &mdash; an
       external index as swappable memory you can update without retraining &mdash; is why
       "RAG" became a household acronym in applied machine learning. The paper "set the
       state-of-the-art on three open domain QA tasks" (abstract) and showed retrieval-grounded
       generation is "more specific, diverse and factual" than a parametric-only baseline.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Methods), intro</b> &mdash; the marginalization idea: the retrieved
        document $z$ is a latent variable, and the output probability sums over the retrieved
        documents. This is the equation you transcribe and implement.</li>
        <li><b>&sect;2.1 (Models)</b> &mdash; <b>RAG-Sequence</b> (one document for the whole
        answer) and <b>RAG-Token</b> (a possibly different document per token). Compare the two
        equations carefully &mdash; where the sum sits relative to the product is the only
        difference.</li>
        <li><b>&sect;2.2 (Retriever: DPR)</b> &mdash; documents and queries are embedded by two
        BERT encoders; relevance is their inner product; the top-$K$ are found by
        <b>Maximum Inner Product Search (MIPS)</b>. This is the non-parametric memory.</li>
        <li><b>&sect;2.3 (Generator: BART)</b> &mdash; the generator concatenates the input with
        a retrieved document and produces the answer. Any encoder-decoder works.</li>
       </ul>
       <p><b>Skim:</b> &sect;3 (training detail &mdash; the document encoder is kept fixed) and
       &sect;4-5 (the open-domain QA, abstractive QA, Jeopardy and fact-verification experiments)
       unless you want a specific benchmark. Read the one paragraph contrasting RAG-Sequence and
       RAG-Token decoding &mdash; it clarifies when each is used.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a tiny toy world. There are several countries, and a small
       <b>document store</b> with one short passage per fact, like
       <code>"france capital paris"</code>. A <b>retriever</b> scores passages against the
       question by embedding similarity and keeps the top few. A small <b>generator</b> reads the
       retrieved passages and answers. You will also train a matched <b>parametric-only</b> model
       that sees the same training signal but <i>never</i> reads a passage at answer time &mdash;
       it must have memorized everything in its weights.</p>
       <p>Crucially, in each training episode the country&rarr;capital mapping is
       <b>re-randomized</b>, so the only reliable way to answer is to read the retrieved passage.
       At test time, on fresh random document stores, which model answers correctly: the
       retrieval-augmented one, the parametric-only one, or do they tie? Write your guess and one
       sentence of reasoning.</p>`,
    attempt:
      `<p>Before the reveal, sketch the retrieve-then-marginalize step you will build. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li><b>Embed.</b> Encode the question into a query vector $q(x)$ and every document into a
        vector $d(z)$ (here a small bag-of-embeddings; the paper uses BERT).</li>
        <li><b>Retrieve.</b> Score each document by the inner product $d(z)^\\top q(x)$, then take
        the top-$K$. TODO &mdash; turn the top-$K$ scores into retriever weights $p(z|x)$ with a
        <code>softmax</code>.</li>
        <li><b>Marginalize.</b> TODO &mdash; for each retrieved document $z$, run the generator to
        get $p(y|x,z)$, then combine:
        <code>p_y = sum over z of p(z|x) * p_gen(y | x, z)</code>. Train by minimizing
        $-\\log p_y$ at the true answer.</li>
        <li>TODO &mdash; why does randomizing the mapping each episode <i>force</i> the generator
        to copy the answer out of the retrieved passage rather than memorize it?</li>
       </ul>
       <p>Then build the matched baseline: the same answer head, but it reads only the question
       (no document). Predict which one wins on fresh document stores.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>RAG has <b>two parts</b>: a <b>retriever</b> that picks documents, and a <b>generator</b>
       that writes the answer. The new idea is how they combine &mdash; the retrieved document is
       a hidden (latent) variable, and the answer probability is an <i>average</i> over documents.</p>
       <p><b>Retriever (&sect;2.2).</b> Embed the query $x$ into a vector $q(x)$ and each document
       $z$ into a vector $d(z)$, using two encoders (the paper uses BERT; "bi-encoder" means two
       separate encoders, one per side). The relevance score is their <b>inner product</b>
       $d(z)^\\top q(x)$ &mdash; bigger means more relevant. Turn scores into a probability over
       documents with a softmax:</p>
       <p>$$ p_\\eta(z \\mid x) \\;\\propto\\; \\exp\\!\\big(d(z)^\\top q(x)\\big),
       \\qquad d(z) = \\mathrm{BERT}_d(z), \\quad q(x) = \\mathrm{BERT}_q(x). $$</p>
       <p>Finding the top-$K$ highest-scoring documents is a <b>Maximum Inner Product Search
       (MIPS)</b> &mdash; literally "find the items whose inner product with the query is largest."
       The paper notes MIPS "can be approximately solved in sub-linear time," so the store can be
       huge.</p>
       <p><b>Generator (&sect;2.3).</b> Pick a retrieved document $z$, concatenate it with the
       input $x$, and feed both to a sequence-to-sequence transformer (the paper uses BART-large).
       It outputs $p_\\theta(y \\mid x, z)$, the answer probability <i>given that document</i>.</p>
       <p><b>The combination (&sect;2, &sect;2.1) &mdash; the whole trick.</b> We do not commit to a
       single document. We treat $z$ as latent and <b>marginalize</b>: average the generator's
       output over the top-$K$ documents, each weighted by its retriever probability $p_\\eta(z|x)$.
       Read it as: "probability of answer $y$ = how likely each document is, times how likely the
       answer is if you read that document, summed up."</p>
       <p>Two flavours differ in <i>when</i> the sum happens (&sect;2.1). <b>RAG-Sequence</b> commits
       to one document for the entire answer, so the sum over documents wraps the whole sequence.
       <b>RAG-Token</b> may use a different document for each token, so the sum sits inside, per
       token. Both let gradients flow into the generator and the query encoder.</p>`,
    architecture:
      `<p>RAG is two trained modules plus a fixed index, wired so a single forward pass retrieves
       documents and marginalizes the generator over them.</p>
       <p><b>1. Document index (non-parametric memory, &sect;2.2).</b> The knowledge source is the
       December 2018 Wikipedia dump, split into <b>21 million</b> 100-word chunks. Each chunk $z$ is
       encoded once, offline, by the document encoder $\\mathrm{BERT}_d$ (BERT-base) into a vector
       $d(z)$. All 21M vectors are stored in a <b>FAISS</b> Maximum Inner Product Search index, which
       returns approximate top-$K$ neighbours in sub-linear time. This index is built once and
       <b>frozen</b> &mdash; never recomputed during training.</p>
       <p><b>2. Query encoder (&sect;2.2).</b> A second BERT-base, $\\mathrm{BERT}_q$, maps the input
       query $x$ to a vector $q(x)$. The retriever score for a document is the inner product
       $d(z)^\\top q(x)$; a softmax over the top-$K$ scores gives $p_\\eta(z|x)$. The retriever is a
       <b>DPR bi-encoder</b>: two separate BERT-base towers (~110M parameters each), initialized from
       a DPR model already trained for open-domain QA.</p>
       <p><b>3. Generator (&sect;2.3).</b> <b>BART-large</b> (~400M parameters), a pre-trained
       encoder-decoder transformer. For each retrieved document $z$, its tokens are
       <b>concatenated</b> with the input $x$ and fed to BART, which decodes the answer token by token
       to produce $p_\\theta(y_i \\mid x, z, y_{1:i-1})$. BART runs once per retrieved document
       ($K$ forward passes).</p>
       <p><b>4. Marginalization head (the novel composition, &sect;2 / &sect;2.1).</b> The $K$ generator
       outputs are combined with the retriever weights $p_\\eta(z|x)$ &mdash; sum-outside-product for
       RAG-Sequence, sum-inside-product for RAG-Token &mdash; into a single answer distribution
       $p(y|x)$. No new parameters; it is just the weighted sum.</p>
       <p><b>Data flow:</b> $x \\rightarrow q(x) \\rightarrow$ MIPS over the frozen index
       $\\rightarrow$ top-$K$ documents $z_1{\\ldots}z_K$ with weights $p_\\eta(z|x)
       \\rightarrow$ BART reads each $[x;z_k] \\rightarrow$ marginalize $\\rightarrow p(y|x)$.</p>
       <p><b>End-to-end training (&sect;2.4).</b> Minimize $\\sum_j -\\log p(y_j|x_j)$ with ordinary
       backprop. Gradients update <b>only</b> $\\mathrm{BERT}_q$ (the query encoder) and <b>BART</b>
       (the generator). The document encoder $\\mathrm{BERT}_d$ and the FAISS index are held
       <b>fixed</b>, so the 21M-vector index never has to be rebuilt mid-training &mdash; the paper
       found re-encoding documents periodically was expensive and not needed for strong results. Total
       trainable parameters: ~626M (vs. an 11B-parameter T5 baseline).</p>`,
    symbols: [
      { sym: "$x$", desc: "the <b>input</b> (the query / question), e.g. \"capital of france\"." },
      { sym: "$y$", desc: "the <b>output sequence</b> (the answer). $y_i$ is its $i$-th token; $y_{1:i-1}$ are the tokens already generated before position $i$." },
      { sym: "$z$", desc: "a single <b>retrieved document</b> (a passage). It is a <b>latent variable</b> &mdash; a hidden quantity we do not observe directly and sum over rather than fix to one value." },
      { sym: "$p_\\eta(z \\mid x)$", desc: "the <b>retriever</b>: the probability it assigns to document $z$ given query $x$. $\\eta$ (eta) are the retriever's parameters. Bigger = more relevant." },
      { sym: "$p_\\theta(y \\mid x, z)$", desc: "the <b>generator</b>: probability of answer $y$ given the query $x$ <i>and</i> a specific retrieved document $z$. $\\theta$ (theta) are the generator's parameters." },
      { sym: "$d(z)$", desc: "the <b>document embedding</b> &mdash; document $z$ encoded into a vector by the document encoder (BERT in the paper)." },
      { sym: "$q(x)$", desc: "the <b>query embedding</b> &mdash; the input $x$ encoded into a vector by the query encoder." },
      { sym: "$d(z)^\\top q(x)$", desc: "the <b>inner product</b> (dot product) of the two vectors: the relevance score. \"$^\\top$\" means transpose, so this multiplies the vectors element-wise and sums &mdash; one number." },
      { sym: "$\\mathrm{top}\\text{-}k$", desc: "the set of the $K$ documents with the highest retriever scores. $K$ is small (the paper tries values like 5 and 10)." },
      { sym: "“MIPS”", desc: "a plain term: <b>Maximum Inner Product Search</b> &mdash; the operation of finding the stored vectors whose inner product with the query is largest. This is how the top-$k$ documents are found, in sub-linear time." },
      { sym: "$N$", desc: "the <b>length</b> of the answer $y$ in tokens; the product $\\prod_i^N$ runs over the answer's tokens." },
      { sym: "$\\mathrm{BERT}_d,\\ \\mathrm{BERT}_q$", desc: "the two encoders of the DPR bi-encoder: $\\mathrm{BERT}_d$ turns a document into $d(z)$, $\\mathrm{BERT}_q$ turns the query into $q(x)$. \"Bi-encoder\" = two separate BERT towers, one per side." },
      { sym: "BART", desc: "a plain term: the pre-trained encoder-decoder transformer (BART-large, ~400M parameters) used as the generator; it reads the input concatenated with a retrieved document and decodes the answer." },
      { sym: "$p'_\\theta(y_i \\mid x, y_{1:i-1})$", desc: "the <b>RAG-Token transition probability</b> (&sect;2.5): the per-token answer probability after folding in the document sum $\\sum_z p_\\eta(z|x)\\,p_\\theta(\\cdot)$, used as the score inside standard beam search." },
      { sym: "$\\mathcal{L}$", desc: "the <b>training loss</b>: the negative marginal log-likelihood $\\sum_j -\\log p(y_j \\mid x_j)$ summed over training pairs $(x_j, y_j)$ &mdash; minimized by gradient descent." },
      { sym: "“parametric memory”", desc: "a plain term: knowledge stored <i>inside the model's weights</i>. \"Non-parametric memory\" is the opposite: knowledge stored <i>outside</i>, in the searchable document store." }
    ],
    formula: `$$ p(y \\mid x) \\;=\\; \\sum_{z \\in \\text{top-}k(p(\\cdot|x))} p_\\eta(z \\mid x)\\, p_\\theta(y \\mid x, z) $$
       <p>The core idea (&sect;2): treat the retrieved document $z$ as a latent variable and marginalize &mdash; the answer probability is the retriever weight times the generator probability, summed over the top-$K$ documents.</p>
       $$ p_{\\text{RAG-Sequence}}(y \\mid x) \\;\\approx\\; \\sum_{z \\in \\text{top-}k(p(\\cdot|x))} p_\\eta(z \\mid x)\\, \\prod_i^N p_\\theta(y_i \\mid x, z, y_{1:i-1}) $$
       <p>RAG-Sequence (&sect;2.1): one document for the whole answer &mdash; the sum over documents sits <i>outside</i> the per-token product.</p>
       $$ p_{\\text{RAG-Token}}(y \\mid x) \\;\\approx\\; \\prod_i^N \\sum_{z \\in \\text{top-}k(p(\\cdot|x))} p_\\eta(z \\mid x)\\, p_\\theta(y_i \\mid x, z, y_{1:i-1}) $$
       <p>RAG-Token (&sect;2.1): a possibly different document per token &mdash; the sum sits <i>inside</i> the product, re-weighting documents at every position.</p>
       $$ p_\\eta(z \\mid x) \\;\\propto\\; \\exp\\!\\big(d(z)^\\top q(x)\\big), \\qquad d(z) = \\mathrm{BERT}_d(z), \\quad q(x) = \\mathrm{BERT}_q(x) $$
       <p>DPR retriever (&sect;2.2): relevance is the inner product of a BERT document embedding and a BERT query embedding (a bi-encoder); a softmax over these scores gives the document distribution. The top-$K$ are found by Maximum Inner Product Search (MIPS).</p>
       $$ p'_\\theta(y_i \\mid x, y_{1:i-1}) \\;=\\; \\sum_{z \\in \\text{top-}k(p(\\cdot|x))} p_\\eta(z \\mid x)\\, p_\\theta(y_i \\mid x, z, y_{1:i-1}) $$
       <p>RAG-Token decoding (&sect;2.5): fold the document sum into a single per-token transition probability, then run standard beam search.</p>
       $$ \\mathcal{L} \\;=\\; \\sum_j -\\log p(y_j \\mid x_j) $$
       <p>Training objective (&sect;2.4): minimize the negative marginal log-likelihood of each target answer $y_j$. Only the query encoder $\\mathrm{BERT}_q$ and the BART generator are updated; the document encoder and index are kept fixed.</p>`,
    whatItDoes:
      `<p>Both equations say the same plain thing: the answer probability is an <b>average over the
       top-$K$ retrieved documents</b>, weighted by how relevant the retriever thinks each one is.
       The general form is $p(y \\mid x) = \\sum_z p(z \\mid x)\\, p(y \\mid x, z)$ &mdash;
       "(chance of this document) times (chance of the answer if you read it), summed over
       documents" (&sect;2). The $\\approx$ is because the true sum is over <i>all</i> documents;
       in practice we sum only over the top-$K$, which carry almost all the weight.</p>
       <p><b>RAG-Sequence</b> (left) puts the sum <i>outside</i> the product over answer tokens: it
       picks one document $z$, generates the whole answer conditioned on it, scores that, and
       averages those whole-answer scores across documents. One document per answer.</p>
       <p><b>RAG-Token</b> (right) puts the sum <i>inside</i>, per token: at every position it can
       re-weight the documents, so different tokens of one answer can be supported by different
       documents. More flexible &mdash; useful when an answer draws on several passages.</p>
       <p>Because the retriever weight $p_\\eta(z|x)$ multiplies the generator term, gradients flow
       back into the query encoder: documents that helped get up-weighted. The document encoder is
       kept fixed (&sect;3), so the index need not be rebuilt during training.</p>`,
    derivation:
      `<p>This lesson owns the math (there is no separate concept lesson), so here is the full,
       short story. We want $p(y \\mid x)$, the probability of the answer given the query. We do
       not know which document is relevant, so introduce the document $z$ as a hidden variable and
       use the <b>law of total probability</b> &mdash; the rule that to get the probability of an
       event you can split over a hidden cause and sum:</p>
       <p>$$ p(y \\mid x) \\;=\\; \\sum_{z} p(z \\mid x)\\, p(y \\mid x, z). $$</p>
       <p>In words: enumerate every document $z$, multiply "how likely document $z$ is given the
       query" by "how likely the answer is if we condition on $x$ and $z$," and add them up. This
       is exact if the sum is over all documents. Two practical moves turn it into RAG:</p>
       <ol>
        <li><b>Truncate to top-$K$.</b> Summing over every document is impossible for a large store,
        and most documents have near-zero $p(z|x)$. So we sum only over the top-$K$ by retriever
        score &mdash; hence the $\\approx$ and the $z \\in \\mathrm{top}\\text{-}k$ in the equation
        (&sect;2.1). Found by MIPS.</li>
        <li><b>Factor the answer over tokens.</b> The generator produces the answer one token at a
        time, so $p_\\theta(y \\mid x, z) = \\prod_i^N p_\\theta(y_i \\mid x, z, y_{1:i-1})$. Where
        you place the document sum relative to this product gives the two variants:
        <b>RAG-Sequence</b> = sum outside the product (one $z$ for the whole answer);
        <b>RAG-Token</b> = sum inside the product (a fresh document weighting per token).</li>
       </ol>
       <p>The retriever term $p_\\eta(z|x) \\propto \\exp(d(z)^\\top q(x))$ is just a softmax over
       inner-product scores (&sect;2.2). Substituting it back gives the formulas above. Nothing is
       added beyond marginalization plus a top-$K$ approximation &mdash; that is the elegance.</p>`,
    example:
      `<p>Work the marginalization by hand on three documents. The retriever's inner-product scores
       are $s=[\\,2.0,\\; 1.0,\\; 0.5\\,]$; we keep the top $K=2$ (documents 0 and 1). The generator
       assigns the correct answer probabilities $p_\\theta(y|x,z_0)=0.8$ (the answer is plainly in
       document 0) and $p_\\theta(y|x,z_1)=0.1$ (document 1 barely supports it). We compute (a) the
       retriever weights $p(z|x)$ and (b) the marginal answer probability.</p>
       <ul class="steps">
        <li><b>Exponentiate each score.</b> $e^{2.0}=7.389$, $e^{1.0}=2.718$, $e^{0.5}=1.649$.</li>
        <li><b>Softmax over all three</b> (for intuition). Sum $=7.389+2.718+1.649=11.756$, so the
        full distribution is $[7.389,\\,2.718,\\,1.649]/11.756 = [0.6285,\\; 0.2312,\\; 0.1402]$.</li>
        <li><b>Renormalize over the top-2.</b> RAG sums only over the retrieved documents, so softmax
        over just $[2.0,1.0]$: denominator $7.389+2.718=10.107$, giving
        $p(z_0|x)=7.389/10.107=0.7311$ and $p(z_1|x)=2.718/10.107=0.2689$.</li>
        <li><b>Marginalize the generator over the two documents.</b>
        $p(y|x)=p(z_0|x)\\,p_\\theta(y|x,z_0) + p(z_1|x)\\,p_\\theta(y|x,z_1)
        = 0.7311\\cdot0.8 + 0.2689\\cdot0.1 = 0.5849 + 0.0269 = 0.6117.$</li>
        <li><b>Read the result.</b> The marginal $0.6117$ sits between the two per-document answer
        probabilities ($0.8$ and $0.1$), pulled toward $0.8$ because document 0 is far more
        relevant ($p(z_0|x)=0.73$). The retriever's confidence steers the average.</li>
       </ul>
       <table class="extable">
        <caption>Marginalizing the generator over the top-2 retrieved documents: $p(y|x)=\\sum_z p(z|x)\\,p_\\theta(y|x,z)$.</caption>
        <thead><tr><th>document $z$</th><th class="num">score $s$</th><th class="num">$e^{s}$</th><th class="num">$p(z|x)$ (top-2)</th><th class="num">$p_\\theta(y|x,z)$</th><th class="num">$p(z|x)\\,p_\\theta$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$z_0$ (kept)</td><td class="num">2.0</td><td class="num">7.389</td><td class="num">0.7311</td><td class="num">0.8</td><td class="num">0.5849</td></tr>
         <tr><td class="row-h">$z_1$ (kept)</td><td class="num">1.0</td><td class="num">2.718</td><td class="num">0.2689</td><td class="num">0.1</td><td class="num">0.0269</td></tr>
         <tr><td class="row-h">$z_2$ (dropped)</td><td class="num">0.5</td><td class="num">1.649</td><td class="num">&mdash;</td><td class="num">&mdash;</td><td class="num">&mdash;</td></tr>
         <tr><td class="row-h">marginal $p(y|x)$</td><td class="num"></td><td class="num"></td><td class="num">1.0000</td><td class="num"></td><td class="num">0.6117</td></tr>
        </tbody>
       </table>
       <p>These exact numbers &mdash; the full softmax $[0.6285,0.2312,0.1402]$, the top-2 weights
       $[0.7311,0.2689]$, and the marginal $0.6117$ &mdash; are recomputed in the notebook's first
       cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build the document store.</b> A handful of short passages, one per fact
        (<code>"france capital paris"</code>), plus a few distractor passages.</li>
        <li><b>Build the retriever</b> with <code>torch.nn</code>: an <code>nn.Embedding</code>
        bag-of-embeddings encoder for query and documents. Score by inner product
        $d(z)^\\top q(x)$; take the top-$K$ (a tiny exact MIPS); softmax the kept scores into
        $p_\\eta(z|x)$.</li>
        <li><b>Build the generator</b> with <code>torch.nn</code>: a tiny attention "reader" that
        attends from the query over the retrieved passage's tokens and emits an answer
        distribution $p_\\theta(y|x,z)$.</li>
        <li><b>Marginalize (by hand):</b> $p(y|x)=\\sum_{z}p_\\eta(z|x)\\,p_\\theta(y|x,z)$ over the
        top-$K$. Train by minimizing $-\\log p(y|x)$ at the true answer (RAG-Sequence with
        single-token answers).</li>
        <li><b>Randomize each episode.</b> Re-shuffle the country&rarr;capital mapping every step so
        memorizing is useless &mdash; the answer must come from the retrieved passage.</li>
        <li><b>Baseline:</b> the same answer head reading <i>only</i> the query (no document) &mdash;
        parametric memory only.</li>
        <li><b>Evaluate:</b> on fresh random document stores, measure accuracy <b>with</b> retrieval
        (RAG) vs <b>without</b> (parametric-only). <b>Ablate</b> retrieval by zeroing the document
        the generator reads.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): RAG models "set the state-of-the-art on three open domain QA
       tasks, outperforming parametric seq2seq models and task-specific retrieve-and-extract
       architectures." The abstract also reports that "for language generation tasks, we find that
       RAG models generate more specific, diverse and factual language than a state-of-the-art
       parametric-only seq2seq baseline."</p>
       <p><i>We deliberately do not quote the paper's Natural Questions / open-domain QA accuracy
       numbers here &mdash; consult &sect;4 of the paper for the exact figures with their settings.
       The numbers in the CODE and CODEVIZ panels below are from our own tiny toy run &mdash; not
       the paper's reported results.</i></p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> RAG is an open-domain QA system, so the metric is
        <b>answer accuracy / exact match</b> on knowledge-intensive QA (the paper's setting: Natural Questions,
        TriviaQA, WebQuestions). The "no-skill" anchor is the <b>matched parametric-only baseline</b> &mdash; the
        same answer head that reads only the question, never a passage. In the toy run the answer lives only in
        the retrieved passage and is re-randomized per episode, so the floor is <b>random guessing</b>
        $1/A = 1/12 \\approx 0.083$ over $A$ capitals; "working" means RAG sits far above that floor and far above
        the parametric-only baseline.</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> (1) Run the worked-example cell: scores $[2.0,1.0,0.5]$
        must softmax to $[0.6285,0.2312,0.1402]$, the top-2 weights to $[0.7311,0.2689]$, and the marginal to
        <b>$0.6117$</b> &mdash; a known-answer test for the retrieve-then-marginalize math. (2) Check the
        retriever weights $p_\\eta(z|x)$ over the top-$K$ <b>sum to 1</b> (softmax). (3) Check the marginal
        $p(y|x)=\\sum_z p_\\eta(z|x)\\,p_\\theta(y|x,z)$ always lies <b>between</b> the smallest and largest
        per-document answer probabilities. (4) Overfit a <i>single fixed</i> document store for a few steps and
        watch $-\\log p(y|x)$ drop toward $0$ &mdash; if it cannot even fit one store, the gradient path through
        the marginalization is broken.</li>
        <li><b>Expected range.</b> The paper reports RAG "set the state-of-the-art on three open domain QA tasks,
        outperforming parametric seq2seq models and task-specific retrieve-and-extract architectures" (abstract)
        &mdash; <i>qualitative; consult &sect;4 for exact Natural Questions figures with their settings</i>. In
        the toy build, a correct RAG reaches <b>~1.0</b> (it reads the answer out of the passage) while the
        parametric-only baseline stays near the <b>$0.083$</b> random floor. <b>Rule of thumb:</b> if RAG sits
        only a little above the parametric-only baseline, retrieval is not actually feeding the generator.</li>
        <li><b>Ablation &mdash; prove the key idea earns its keep.</b> The central component is
        <b>retrieval (the non-parametric memory)</b>. Turn it OFF: feed the generator a <b>zero / empty document
        vector</b> for every query, everything else identical. Accuracy must <b>collapse toward the random floor</b>
        $1/A$ &mdash; if it does not, the generator was answering from its weights and the passage was never being
        read. A second ablation: replace the top-$K$ sum with $\\arg\\max_z$ (single best document) &mdash; that
        discards the marginalization and stops gradient flowing to lower-ranked-but-useful documents.</li>
        <li><b>Failure signals &amp; what they mean.</b> <b>Both RAG and baseline near $1.0$</b> &rarr; the
        country&rarr;capital mapping is fixed, so the generator memorized it; re-randomize per episode. <b>RAG
        stuck near the random floor</b> &rarr; the inner-product MIPS is not surfacing the answer passage, or the
        generator ignores the retrieved tokens. <b>Marginal $p(y|x)$ outside $[0,1]$ or NaN</b> &rarr; you summed
        un-normalized scores instead of a softmax, or took a log of $0$ (add the $+10^{-9}$). <b>Accuracy caps
        well below $1.0$ despite a confident generator</b> &rarr; the retriever ranks the answer document low
        (mis-ranking muffles a strong $p_\\theta$, as in the $0.46$ worked variant); train the query encoder.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The pieces &mdash; embeddings, attention,
       a sequence-to-sequence generator &mdash; already ship in PyTorch, so you <b>import</b> them
       and build only the novel composition. <b>Import:</b> <code>nn.Embedding</code> for the
       encoders, <code>nn.Linear</code> + a small <code>softmax</code> attention for the reader
       generator, and <code>torch.optim.Adam</code>. <b>Build by hand:</b> the
       <b>retrieve-then-marginalize</b> mechanism &mdash; score documents by inner product
       $d(z)^\\top q(x)$ (a tiny exact Maximum Inner Product Search), take the top-$K$, softmax
       their scores into $p_\\eta(z|x)$, run the generator once per retrieved document, and combine
       $p(y|x)=\\sum_z p_\\eta(z|x)\\,p_\\theta(y|x,z)$. That marginalization is the paper's
       contribution. We do <b>not</b> download a real language model or BERT &mdash; everything is
       a few-parameter toy so it runs on CPU in one pass; the mechanism is identical to the
       paper's, only the encoders are tiny.</p>`,
    pitfalls:
      `<ul>
        <li><b>Picking one document instead of averaging.</b> Taking only the single best document
        ($\\arg\\max_z$) throws away the marginalization &mdash; it is no longer RAG, and gradients
        stop flowing to the lower-ranked-but-useful documents. <b>Fix:</b> sum over the whole
        top-$K$ weighted by $p_\\eta(z|x)$.</li>
        <li><b>Mixing up the two variants.</b> RAG-Sequence sums over documents <i>outside</i> the
        per-token product; RAG-Token sums <i>inside</i>, per token. Putting the sum in the wrong
        place changes the model. <b>Fix:</b> for single-token answers (like our toy) the two
        coincide; for multi-token answers, place the sum deliberately.</li>
        <li><b>Letting the generator memorize instead of read.</b> If the question&rarr;answer
        mapping is fixed, the generator can ignore the passage and memorize, hiding whether
        retrieval works. <b>Fix:</b> randomize the mapping per episode (or use a large open store)
        so the answer is only obtainable from the retrieved passage.</li>
        <li><b>Confusing "no retrieval" with "bad retrieval."</b> The parametric-only baseline must
        get the <i>same</i> supervised target and the <i>same</i> capacity &mdash; it simply never
        sees a document. Otherwise the comparison is unfair. <b>Fix:</b> share the answer head;
        feed it the query only.</li>
        <li><b>Forgetting MIPS is approximate at scale.</b> Our toy does exact top-$K$; a real store
        uses approximate Maximum Inner Product Search, which can miss a document. The marginal is
        only as good as the retrieved set.</li>
      </ul>`,
    recall: [
      "Write the marginalization $p(y \\mid x) = \\sum_z p(z\\mid x)\\,p(y \\mid x, z)$ from memory and say what each factor is.",
      "What is the difference between RAG-Sequence and RAG-Token (where does the sum over $z$ sit)?",
      "Define MIPS and say what the retriever scores documents by.",
      "Why must the document be treated as a latent variable rather than fixed to the single best one?"
    ],
    practice: [
      {
        q: `<b>The retrieval ablation.</b> You have a working RAG. Now break retrieval: feed the
            generator a zero (empty) document vector for every query, everything else identical,
            and re-evaluate on fresh random document stores. What did you remove, and what do you
            expect to happen to accuracy?`,
        steps: [
          { do: `Replace the retrieved document the generator reads with zeros (or a constant), so $p_\\theta(y|x,z)$ no longer depends on any real passage.`, why: `This severs the non-parametric memory: the generator can only use what is in its weights, which is nothing reliable because the mapping is re-randomized each store.` },
          { do: `Identify what is gone: the term $p_\\theta(y \\mid x, z)$ stops carrying document content, so the marginal $\\sum_z p_\\eta(z|x)\\,p_\\theta(y|x,z)$ degrades to a content-free guess.`, why: `The retriever weights $p_\\eta(z|x)$ still exist, but they multiply a generator that can no longer read the answer out of $z$.` },
          { do: `Re-evaluate: expect accuracy to collapse toward the random-guess baseline ($1/\\text{number of capitals}$).`, why: `With the mapping randomized per store, the answer exists only in the passage; remove the passage and there is nothing left to be right about.` }
        ],
        answer: `<p>You removed the <b>non-parametric memory</b> &mdash; the generator no longer reads
                 a real passage, so $p_\\theta(y|x,z)$ is content-free and the marginal becomes a
                 guess. Accuracy collapses toward $1/A$ (random over $A$ capitals). This mirrors our
                 main result: with retrieval, the model is ~100% on the toy task; without it (the
                 parametric-only baseline) it sits near the random-guess floor, because the answer
                 lives in the retrieved passage, not in the weights.</p>`
      },
      {
        q: `Re-derive the worked example with a <b>different generator</b>. Keep the top-2 retriever
            weights $[0.7311, 0.2689]$, but now the generator assigns
            $p_\\theta(y|x,z_0)=0.3$ and $p_\\theta(y|x,z_1)=0.9$ &mdash; i.e. the answer is
            actually in the <i>second</i> (less-retrieved) document. Compute the marginal
            $p(y|x)$. What does the result reveal about retriever quality?`,
        steps: [
          { do: `Apply the marginalization: $p(y|x) = 0.7311\\cdot 0.3 + 0.2689\\cdot 0.9$.`, why: `Same equation $p(y|x)=\\sum_z p(z|x)p(y|x,z)$; only the per-document answer probabilities changed.` },
          { do: `Compute: $0.7311\\cdot 0.3 = 0.2193$ and $0.2689\\cdot 0.9 = 0.2420$, so $p(y|x) = 0.2193 + 0.2420 = 0.4613$.`, why: `The answer-bearing document ($z_1$) is down-weighted to $0.27$, so its strong $0.9$ is muffled; the marginal lands at only $0.46$.` },
          { do: `Conclude: a good answer is wasted if the retriever ranks its document low.`, why: `The generator can only contribute in proportion to $p_\\eta(z|x)$; a mis-ranked retriever caps the achievable answer probability.` }
        ],
        answer: `<p>$p(y|x) = 0.7311\\cdot 0.3 + 0.2689\\cdot 0.9 = 0.2193 + 0.2420 = 0.4613$. Even
                 though one document supports the answer with probability $0.9$, the marginal is only
                 $0.46$ &mdash; far below the original $0.6117$ &mdash; because the retriever put most
                 weight ($0.73$) on the <i>wrong</i> document. The lesson: RAG is bottlenecked by the
                 retriever. If relevance ranking is poor, marginalizing cannot recover; this is why
                 the paper trains the query encoder end-to-end and uses a strong DPR retriever.</p>`
      },
      {
        q: `In our experiment the country&rarr;capital mapping is re-randomized every training
            episode, and the parametric-only baseline still scores near the random-guess floor.
            Why does randomizing the mapping make the comparison <i>fair</i> &mdash; and what would
            happen to the baseline if we had used a single fixed mapping the whole time?`,
        steps: [
          { do: `Reason about a fixed mapping: if "france" always maps to "paris," a parametric model can store that pair in its weights and answer without ever reading a passage.`, why: `With a fixed mapping the answer is recoverable from the question alone, so retrieval is not actually necessary &mdash; the test would not isolate retrieval's contribution.` },
          { do: `Reason about a randomized mapping: when "france" maps to a different capital each store, no question&rarr;answer rule fits in fixed weights.`, why: `The answer becomes a property of the current document store, not the question; only a model that reads the store can be right.` },
          { do: `Conclude: randomization forces the task to be genuinely knowledge-intensive, so the gap between RAG and parametric-only measures retrieval, not memorization.`, why: `This mirrors the paper's setting: real-world facts the model never memorized, where looking them up is the only way.` }
        ],
        answer: `<p>Randomizing the mapping makes the answer depend on the <i>current</i> document
                 store rather than on the question, so memorization in weights cannot help &mdash; the
                 model must retrieve. That is exactly what isolates retrieval's contribution. With a
                 single fixed mapping, the parametric-only baseline would simply memorize all the
                 pairs and score ~100% too, and the experiment would prove nothing. By randomizing, we
                 force the task to be knowledge-intensive: in our run RAG reaches ~100% while the
                 parametric-only model stays near the random-guess floor of $1/A$.</p>`
      }
    ]
  });

  window.CODE["paper-rag"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a tiny embedding retriever and a tiny attention "reader"
       generator with <code>nn.Embedding</code> / <code>nn.Linear</code>, then build the
       <b>novel</b> part by hand &mdash; retrieve-then-marginalize. The retriever scores documents
       by the inner product $d(z)^\\top q(x)$ (a tiny exact Maximum Inner Product Search), keeps the
       top-$K$, and softmaxes their scores into $p_\\eta(z|x)$. The generator reads each retrieved
       passage and emits $p_\\theta(y|x,z)$. We then <b>marginalize</b>:
       $p(y|x)=\\sum_z p_\\eta(z|x)\\,p_\\theta(y|x,z)$ (&sect;2; RAG-Sequence with single-token
       answers, so RAG-Sequence and RAG-Token coincide). The toy task: a document store of
       <code>"country capital city"</code> facts whose mapping is <b>re-randomized every episode</b>,
       so the answer is only obtainable by reading the retrieved passage. We compare RAG against a
       matched <b>parametric-only</b> baseline that reads only the question. The first cell recomputes
       the worked example (softmax over scores, top-2 weights, marginal $0.6117$). No real language
       model is downloaded &mdash; CPU, one pass. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F
import numpy as np
torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the worked example: marginalize the generator over top-2 docs. ---
scores3 = torch.tensor([2.0, 1.0, 0.5])
print("softmax over 3 scores:", [round(v,4) for v in torch.softmax(scores3,0).tolist()])
w = torch.softmax(torch.tensor([2.0, 1.0]), 0)        # top-2 retriever weights p(z|x)
g = torch.tensor([0.8, 0.1])                          # generator p(answer | x, z_j)
marg = (w*g).sum()
print("top-2 retriever weights:", [round(v,4) for v in w.tolist()])
print("marginal p(y|x) = %.4f*%.1f + %.4f*%.1f = %.4f" % (w[0],g[0],w[1],g[1],marg))
# softmax over 3 scores: [0.6285, 0.2312, 0.1402]
# top-2 retriever weights: [0.7311, 0.2689]
# marginal p(y|x) = 0.7311*0.8 + 0.2689*0.1 = 0.6117


# --- 1. Toy world: countries, capitals, and a document store (one passage per fact). ---
countries = ["france","japan","egypt","peru","norway","kenya","brazil","canada"]
caps      = ["paris","tokyo","cairo","lima","oslo","nairobi","brasilia","ottawa",
             "marseille","kyoto","rio","toronto"]            # a pool to draw answers from
distract  = ["river nile flows","mount fuji tall","ocean wide blue","desert sand hot"]
toks = set(["capital"]) | set(countries) | set(caps)
for d in distract: toks |= set(d.split())
vocab = {t:i for i,t in enumerate(sorted(toks))}; V = len(vocab)
def enc(txt): return [vocab[t] for t in txt.split()]
cap_id = {c:i for i,c in enumerate(caps)}; A = len(caps)

D = 24
emb = nn.Embedding(V, D)                                # shared retriever/reader embeddings
def bag(ids): return emb(torch.tensor(ids)).mean(0)     # bag-of-embeddings encoder

# --- 2. Generator: a tiny attention "reader". Query attends over the passage tokens. ---
class Reader(nn.Module):
    def __init__(self):
        super().__init__()
        self.q = nn.Linear(D, D); self.k = nn.Linear(D, D); self.v = nn.Linear(D, D)
        self.out = nn.Linear(D, A)
    def forward(self, qv, doc_ids):
        toks = emb(torch.tensor(doc_ids))               # (L, D) passage token embeddings
        att  = torch.softmax(self.k(toks) @ self.q(qv) / D**0.5, 0)   # (L,) attention
        ctx  = (att.unsqueeze(1) * self.v(toks)).sum(0) # (D,) read-out
        return self.out(ctx)                            # (A,) answer logits
gen = Reader()

# --- 3. Parametric-only baseline: same answer head, but reads ONLY the question. ---
emb2 = nn.Embedding(V, D)
def bag2(ids): return emb2(torch.tensor(ids)).mean(0)
class ParamOnly(nn.Module):
    def __init__(self):
        super().__init__(); self.net = nn.Sequential(nn.Linear(D,32), nn.ReLU(), nn.Linear(32,A))
    def forward(self, qv): return self.net(qv)
po = ParamOnly()

K = 3
def build_docs(mapping): return [f"{c} capital {mapping[c]}" for c in countries] + distract
def retrieve(country, doc_vecs, k):
    q = bag(enc(country)); sc = doc_vecs @ q            # inner products = MIPS scores
    tv, ti = torch.topk(sc, k)                          # top-K documents
    return q, ti, torch.softmax(tv, 0)                 # p_eta(z|x) over the top-K
def random_map():
    pool = caps[:]; np.random.shuffle(pool)
    return {c: pool[i] for i,c in enumerate(countries)}

# --- 4. TRAIN. Each episode re-randomizes the mapping, so the answer must be RETRIEVED. ---
optR = torch.optim.Adam(list(gen.parameters()) + list(emb.parameters()), lr=5e-3)
optP = torch.optim.Adam(list(po.parameters()) + list(emb2.parameters()), lr=5e-3)
for ep in range(1200):
    m = random_map(); docs = build_docs(m)
    # RAG: retrieve top-K, then MARGINALIZE the generator over them (the novel step).
    optR.zero_grad(); dv = torch.stack([bag(enc(d)) for d in docs]); loss = 0.0
    for c in countries:
        q, ti, w = retrieve(c, dv, K)
        py = 0.0
        for j in range(K):                             # p(y|x) = sum_z p(z|x) p(y|x,z)
            py = py + w[j] * torch.softmax(gen(q, enc(docs[ti[j]])), 0)
        loss = loss - torch.log(py[cap_id[m[c]]] + 1e-9)
    loss.backward(); optR.step()
    # Parametric-only: same target, but it only sees the question (no document).
    optP.zero_grad(); loss2 = 0.0
    for c in countries:
        loss2 = loss2 + F.cross_entropy(po(bag2(enc(c))).unsqueeze(0), torch.tensor([cap_id[m[c]]]))
    loss2.backward(); optP.step()

# --- 5. EVALUATE on 50 FRESH random document stores (= 400 queries). ---
np.random.seed(123)
def rag_pred(c, dv, docs):
    q, ti, w = retrieve(c, dv, K); py = 0.0
    for j in range(K): py = py + w[j] * torch.softmax(gen(q, enc(docs[ti[j]])), 0)
    return caps[int(py.argmax())]
def po_pred(c): return caps[int(po(bag2(enc(c))).argmax())]

rag_ok = po_ok = tot = 0
for t in range(50):
    m = random_map(); docs = build_docs(m); dv = torch.stack([bag(enc(d)) for d in docs])
    for c in countries:
        rag_ok += (rag_pred(c, dv, docs) == m[c]); po_ok += (po_pred(c) == m[c]); tot += 1

print("\\nEval on 50 fresh document stores (8 countries each = %d queries):" % tot)
print("  with retrieval (RAG)          : %d/%d = %.3f" % (rag_ok, tot, rag_ok/tot))
print("  without retrieval (param-only): %d/%d = %.3f" % (po_ok, tot, po_ok/tot))
print("  random-guess baseline         : 1/%d = %.3f" % (A, 1/A))
# with retrieval (RAG)          : 400/400 = 1.000   <- reads the answer from the passage
# without retrieval (param-only): 39/400  = 0.098   <- near the random-guess floor
# random-guess baseline         : 1/12    = 0.083
# (Our small run, not the paper's reported numbers. The answer lives in the retrieved passage,
#  so the parametric-only model cannot get it; retrieval makes it solvable.)`
  };

  window.CODEVIZ["paper-rag"] = {
    question: "On a knowledge task whose answer lives only in a retrieved passage, how does accuracy compare with retrieval (RAG) versus without it (parametric-only)?",
    charts: [
      {
        type: "bar",
        title: "Accuracy on 400 held-out queries — with retrieval vs without",
        xlabel: "model",
        ylabel: "accuracy (fraction correct)",
        series: [
          {
            name: "accuracy",
            color: "#7ee787",
            points: [
              ["RAG (with retrieval)", 1.000],
              ["Parametric-only (no retrieval)", 0.098],
              ["Random-guess baseline", 0.083]
            ]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny inner-product retriever (bag-of-embeddings, dim 24, exact top-K=3 Maximum Inner Product Search) plus a tiny attention 'reader' generator, marginalized over the retrieved documents via p(y|x)=&Sigma;_z p(z|x)p(y|x,z). The toy task is a document store of 'country capital city' facts whose mapping is re-randomized every training episode, so the answer is only obtainable from the retrieved passage. Evaluated on 50 fresh random document stores (8 countries each = 400 queries): RAG reads the answer out of the passage and scores 400/400 = 1.000, while the matched parametric-only model (same target, reads only the question) scores 39/400 = 0.098 &mdash; barely above the 1/12 = 0.083 random-guess floor. The answer lives in the retrieved passage, so retrieval is what makes the task solvable.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np
torch.manual_seed(0); np.random.seed(0)

countries = ["france","japan","egypt","peru","norway","kenya","brazil","canada"]
caps = ["paris","tokyo","cairo","lima","oslo","nairobi","brasilia","ottawa",
        "marseille","kyoto","rio","toronto"]
distract = ["river nile flows","mount fuji tall","ocean wide blue","desert sand hot"]
toks = set(["capital"]) | set(countries) | set(caps)
for d in distract: toks |= set(d.split())
vocab = {t:i for i,t in enumerate(sorted(toks))}; V=len(vocab)
def enc(t): return [vocab[w] for w in t.split()]
cap_id = {c:i for i,c in enumerate(caps)}; A=len(caps); D=24; K=3

emb = nn.Embedding(V,D)
def bag(ids): return emb(torch.tensor(ids)).mean(0)
class Reader(nn.Module):
    def __init__(s):
        super().__init__(); s.q=nn.Linear(D,D); s.k=nn.Linear(D,D); s.v=nn.Linear(D,D); s.out=nn.Linear(D,A)
    def forward(s,qv,d):
        t=emb(torch.tensor(d)); a=torch.softmax(s.k(t)@s.q(qv)/D**0.5,0)
        return s.out((a.unsqueeze(1)*s.v(t)).sum(0))
gen=Reader()
emb2=nn.Embedding(V,D)
def bag2(ids): return emb2(torch.tensor(ids)).mean(0)
class PO(nn.Module):
    def __init__(s): super().__init__(); s.net=nn.Sequential(nn.Linear(D,32),nn.ReLU(),nn.Linear(32,A))
    def forward(s,qv): return s.net(qv)
po=PO()
def docs_of(m): return [f"{c} capital {m[c]}" for c in countries]+distract
def retrieve(c,dv,k):
    q=bag(enc(c)); sc=dv@q; tv,ti=torch.topk(sc,k); return q,ti,torch.softmax(tv,0)
def rmap():
    p=caps[:]; np.random.shuffle(p); return {c:p[i] for i,c in enumerate(countries)}

optR=torch.optim.Adam(list(gen.parameters())+list(emb.parameters()),lr=5e-3)
optP=torch.optim.Adam(list(po.parameters())+list(emb2.parameters()),lr=5e-3)
for ep in range(1200):
    m=rmap(); ds=docs_of(m)
    optR.zero_grad(); dv=torch.stack([bag(enc(d)) for d in ds]); L=0.0
    for c in countries:
        q,ti,w=retrieve(c,dv,K); py=0.0
        for j in range(K): py=py+w[j]*torch.softmax(gen(q,enc(ds[ti[j]])),0)
        L=L-torch.log(py[cap_id[m[c]]]+1e-9)
    L.backward(); optR.step()
    optP.zero_grad(); L2=0.0
    for c in countries: L2=L2+F.cross_entropy(po(bag2(enc(c))).unsqueeze(0),torch.tensor([cap_id[m[c]]]))
    L2.backward(); optP.step()

np.random.seed(123)
rag_ok=po_ok=tot=0
for t in range(50):
    m=rmap(); ds=docs_of(m); dv=torch.stack([bag(enc(d)) for d in ds])
    for c in countries:
        q,ti,w=retrieve(c,dv,K); py=0.0
        for j in range(K): py=py+w[j]*torch.softmax(gen(q,enc(ds[ti[j]])),0)
        rag_ok+=(caps[int(py.argmax())]==m[c])
        po_ok+=(caps[int(po(bag2(enc(c))).argmax())]==m[c]); tot+=1
print("RAG (with retrieval)   :", rag_ok, "/", tot, "=", round(rag_ok/tot,3))
print("Parametric-only        :", po_ok, "/", tot, "=", round(po_ok/tot,3))
print("Random-guess baseline  : 1 /", A, "=", round(1/A,3))
# RAG (with retrieval)   : 400 / 400 = 1.0
# Parametric-only        : 39 / 400 = 0.098
# Random-guess baseline  : 1 / 12 = 0.083
# Our small run, not the paper's number. The answer lives in the retrieved passage.`
  };
})();
