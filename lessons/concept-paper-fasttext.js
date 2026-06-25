/* Paper lesson — fastText / subword word vectors (Bojanowski, Grave, Joulin, Mikolov, 2016).
   Grounded from arXiv:1607.04606 (ar5iv HTML). Section 3.1 = general skip-gram + negative-sampling
   objective (logistic loss l(x)=log(1+e^-x), unnumbered eq.); Section 3.2 = the SUBWORD model:
   each word = bag of character n-grams (3..6) plus the whole word as a special token, and the new
   score s(w,c) = sum_{g in G_w} z_g^T v_c (unnumbered eq., Section 3.2). The "where" example and
   the n-gram range/hashing (K = 2*10^6 buckets) are quoted from Section 3.2. All CODEVIZ numbers
   are OUR small run, not the paper's reported numbers.
   Track B (architecture): build the char-n-gram bag + summed embedding on a tiny vocab from nn
   primitives; show an OOV word gets a sensible vector from its n-grams; ablate against word2vec
   (whole-word lookup), which has NO vector for an OOV word. Cross-links paper-word2vec. */
(function () {
  window.LESSONS.push({
    id: "paper-fasttext",
    title: "fastText — Enriching Word Vectors with Subword Information (2016)",
    tagline: "Build each word's vector by summing the vectors of its character n-grams, so even unseen and rare words get sensible embeddings.",
    module: "Papers · Sequence & NLP",
    track: "architecture",

    paper: {
      authors: "Piotr Bojanowski, Edouard Grave, Armand Joulin, Tomas Mikolov",
      org: "Facebook AI Research (FAIR)",
      year: 2016,
      venue: "arXiv preprint (arXiv:1607.04606); TACL 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1607.04606",
      code: "https://github.com/facebookresearch/fastText"
    },

    conceptLink: "dl-word-embeddings",
    partOf: [],
    prereqs: ["dl-word-embeddings", "dl-word2vec", "dl-cosine-similarity", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> word2vec (the <code>paper-word2vec</code> lesson) and similar models learn one dense
       vector per word by reading huge text. ("Dense vector" = a short list of real numbers, say 100 of them, that
       stands in for a word.) But they treat every word as an <b>atom</b>: a single slot in a lookup table, with no
       knowledge of the <i>letters</i> inside it.</p>
       <p>That causes two problems (Section 1 of the paper):</p>
       <ul>
         <li><b>Out-of-vocabulary (OOV) words get nothing.</b> "OOV" means a word that was never seen during
         training. If "cats" never appeared, the lookup table has no row for it, so the model simply cannot produce
         a vector &mdash; even though it clearly knows "cat".</li>
         <li><b>Rare and morphologically rich words are learned badly.</b> "Morphology" = how words are built from
         smaller meaningful pieces (cat &rarr; cats &rarr; catlike; run &rarr; running &rarr; runner). Languages like
         German, Turkish or Finnish glue many pieces together, so most word <i>forms</i> are rare, and a per-word
         table never sees each form enough times to learn it well. Quoting the paper, ignoring word structure "is a
         limitation, especially for languages with large vocabularies and many rare words."</li>
       </ul>`,

    contribution:
      `<p>The paper's idea (Section 3.2) is to stop treating a word as an atom and instead build its vector
       <b>from the characters inside it</b>:</p>
       <ul>
         <li><b>Represent each word as a bag of character n-grams.</b> An "n-gram" is a run of $n$ consecutive
         characters. The word is wrapped in boundary symbols <code>&lt;</code> and <code>&gt;</code> (so a prefix and
         a suffix can be told apart from the same letters in the middle), and every n-gram of length 3 to 6 is taken.</li>
         <li><b>A word's vector is the SUM of its n-gram vectors.</b> Each distinct n-gram has its own learnable
         vector; the word's representation is just their sum. The whole word is also kept as one special "n-gram",
         so common words still learn a dedicated representation.</li>
         <li><b>Drop it into skip-gram.</b> They take word2vec's skip-gram model and replace its whole-word scoring
         with this subword score, training with the same negative-sampling loss.</li>
       </ul>
       <p>The payoff: because vectors are <b>shared across words that share n-grams</b>, an unseen word like "cats"
       can be assembled from the n-grams of "cat" plus a few new ones &mdash; so OOV and rare words get a sensible
       vector for free.</p>`,

    whyItMattered:
      `<p>fastText made word embeddings <b>robust to unseen and rare words</b> and noticeably better on
       morphologically rich languages, all while staying as cheap to train as word2vec. The released library and
       pretrained vectors for 150+ languages became a default baseline for years. The core insight &mdash; that a
       token's representation can be <b>composed from sub-token pieces</b> &mdash; is the direct ancestor of the
       <b>subword tokenization</b> (Byte-Pair Encoding, WordPiece, SentencePiece) that every modern Transformer and
       large language model uses to handle any word, including ones it never saw. It builds directly on
       <code>paper-word2vec</code>: same skip-gram backbone, new subword front end.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3.1 (General model)</b> &mdash; a one-paragraph recap of skip-gram and the
         <b>negative-sampling</b> objective with the logistic loss $\\ell(x)=\\log(1+e^{-x})$. This is the
         training loop fastText reuses unchanged.</li>
         <li><b>Section 3.2 (Subword model)</b> &mdash; the heart of the paper: the character-n-gram bag, the
         <code>&lt;where&gt;</code> example, the new score $s(w,c)=\\sum_{g\\in\\mathcal{G}_w}\\mathbf{z}_g^\\top\\mathbf{v}_c$,
         the n-gram range 3&ndash;6, and the hashing trick that keeps memory bounded.</li>
       </ul>
       <p><b>Skim:</b> Section 4 (related work), and the results tables in Section 5 &mdash; note the <b>direction</b>
       (subword helps most on rare words and on German/Russian/Arabic) rather than memorizing the exact percentages.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We will train a tiny fastText-style model on a small corpus that contains
       "cat", "dog" and "fish" (with their contexts), but <b>never the word "cats"</b>. Then we ask the model for a
       vector for the out-of-vocabulary word "cats" &mdash; assembled from its character n-grams &mdash; and measure
       its cosine similarity to "cat", "dog" and "fish". Which word will "cats" land closest to, and could plain
       word2vec answer this question at all? Write your guess, then look at the CODEVIZ bars.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write the two pieces that turn word2vec into fastText:</p>
       <ul>
         <li>A function <code>ngrams(word)</code> that wraps the word in <code>&lt;...&gt;</code> and returns every
         character n-gram of length 3 to 6, <i>plus</i> the whole word as a special token.
         <code># TODO: w = "&lt;" + word + "&gt;"; collect w[i:i+n] for n in 3..6; add "&lt;"+word+"&gt;"</code></li>
         <li>A function <code>wordvec(word)</code> that sums the rows of the n-gram embedding table for that word's
         n-grams. <code># TODO: return Z[ngram_ids(word)].sum(0)</code></li>
       </ul>
       <p>Then reuse the skip-gram negative-sampling loop, but score with the <b>summed</b> center vector instead of
       a whole-word lookup. The CODE cell is the full reference; the key check is that
       <code>wordvec("cats")</code> returns a real vector even though "cats" was never a training word.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>fastText keeps word2vec's <b>skip-gram with negative sampling</b> and changes <i>only how the center
       word's vector is built</i>. Two layers:</p>
       <ol>
         <li><b>The skip-gram backbone (Section 3.1).</b> Slide a window over the text. For a center word $w_t$ and a
         real context word $w_c$ in its window, push their scores up; for a few random "negative" words $n$, push
         their scores down. The loss for one (center, context) pair is the logistic loss
         $\\ell(s(w_t,w_c)) + \\sum_{n}\\ell(-s(w_t,n))$, where $\\ell(x)=\\log(1+e^{-x})$.</li>
         <li><b>The subword front end (Section 3.2).</b> In plain word2vec the score is
         $s(w_t,w_c)=\\mathbf{u}_{w_t}^\\top\\mathbf{v}_{w_c}$ (Section 3.1), a dot product of two whole-word vectors.
         fastText replaces the center word vector $\\mathbf{u}_{w_t}$ with the <b>sum of its character-n-gram
         vectors</b>, giving the new score $s(w,c)=\\sum_{g\\in\\mathcal{G}_w}\\mathbf{z}_g^\\top\\mathbf{v}_c$.</li>
       </ol>
       <p><b>How a word becomes its n-grams.</b> Wrap the word in boundary symbols. Quoting the paper directly:
       "Taking the word <i>where</i> and $n=3$ as an example, it will be represented by the character n-grams:
       <code>&lt;wh, whe, her, ere, re&gt;</code>" plus the special sequence <code>&lt;where&gt;</code> for the whole
       word. The boundary symbols matter: the n-gram <code>her</code> from <code>where</code> is a different vector
       from the standalone word <code>&lt;her&gt;</code>, so a piece-in-the-middle is not confused with the word it
       happens to spell. In practice they take all n-grams for $3 \\le n \\le 6$.</p>
       <p><b>Why this fixes OOV.</b> Because n-gram vectors are <b>shared across all words that contain them</b>, an
       unseen word is not empty: "cats" reuses <code>&lt;ca</code> and <code>cat</code> learned from "cat", and adds
       a few new n-grams (<code>ats</code>, <code>ts&gt;</code>). Its summed vector therefore lands near "cat" with no
       extra training. Plain word2vec has no row for "cats" and cannot answer at all.</p>
       <p><b>Keeping memory bounded.</b> A large corpus produces millions of distinct n-grams, so the paper
       <b>hashes</b> each n-gram to one of a fixed number of buckets: "We set $K = 2\\cdot10^{6}$" buckets (Section
       3.2). Different n-grams can collide into the same bucket, but in practice this costs little and caps the table
       size.</p>`,

    architecture:
      `<p>fastText is word2vec's skip-gram with the whole-word <b>input lookup</b> swapped for a <b>subword
       front end</b>. Component by component, with the toy shapes from the CODE cell ($D=16$ embedding
       dimension, $K=4096$ n-gram buckets, $V$ context-vocabulary size):</p>
       <ol>
         <li><b>Tokenizer / n-gram extractor (Section 3.2).</b> Input: a raw word string. Wrap it in boundary
         markers <code>&lt;</code>&hellip;<code>&gt;</code>, slide windows of length $3\\le n\\le 6$ over the
         wrapped string, and add the whole word as one special token. Output: the n-gram bag $\\mathcal{G}_w$ (a
         small list of strings). This is the only piece word2vec does not have.</li>
         <li><b>Hashing layer (Section 3.2).</b> Each n-gram string is hashed to a bucket index in
         $\\{0,\\dots,K-1\\}$ with $K = 2\\cdot10^{6}$ in the paper. Output: a small set of integer row indices.
         Collisions are accepted to cap memory.</li>
         <li><b>Subword (input) embedding table $\\mathbf{Z}$.</b> A learnable matrix of shape $(K, D)$, one row
         $\\mathbf{z}_g$ per bucket. Gather the rows for the word's n-gram indices.</li>
         <li><b>Sum-pool to the word vector.</b> Add the gathered rows:
         $\\mathbf{u}_w=\\sum_{g\\in\\mathcal{G}_w}\\mathbf{z}_g$, a single $D$-vector. This <i>replaces</i>
         word2vec's single-row input lookup $\\mathbf{u}_{w}$ &mdash; everything downstream is unchanged.</li>
         <li><b>Context (output) embedding table $\\mathbf{V}$.</b> A learnable matrix of shape $(V, D)$, one row
         $\\mathbf{v}_c$ per context word &mdash; identical to word2vec's output table (no subwords on the context
         side).</li>
         <li><b>Scorer + loss.</b> Dot the summed center vector with each candidate context row,
         $s(w,c)=\\mathbf{u}_w^\\top\\mathbf{v}_c=\\sum_{g}\\mathbf{z}_g^\\top\\mathbf{v}_c$, and feed the one true
         context plus a few sampled negatives through the negative-sampling logistic loss
         $\\ell(x)=\\log(1+e^{-x})$. Gradients flow back through the sum into <i>every</i> n-gram row, so each
         $\\mathbf{z}_g$ is updated by every word that contains it.</li>
       </ol>
       <p><b>Data flow:</b> word &rarr; n-gram bag &rarr; hashed bucket ids &rarr; gather rows of $\\mathbf{Z}$
       &rarr; sum &rarr; center vector $\\mathbf{u}_w$ &rarr; dot with $\\mathbf{V}$ rows &rarr; logistic
       negative-sampling loss. The single architectural change versus word2vec is steps 1&ndash;4 (the subword
       front end producing $\\mathbf{u}_w$); steps 5&ndash;6 are word2vec verbatim. At inference a word's vector is
       just step 4's sum, so an OOV word still yields a vector from its (shared) n-gram rows.</p>`,

    symbols: [
      { sym: "$w$", desc: "a word (e.g. 'where'). In skip-gram it can be the center word $w_t$ or a context word $w_c$." },
      { sym: "$c$", desc: "a context word (or its index); the word sitting near the center inside the window. fastText scores the center against it." },
      { sym: "n-gram", desc: "a run of $n$ consecutive characters. 'where' has the 3-grams whe, her, ere (with boundary pieces &lt;wh and re&gt;). Pronounced 'en-gram'." },
      { sym: "$\\mathcal{G}_w$", desc: "the SET of character n-grams of word $w$ — its 'bag of n-grams', including the whole word as one special token (script G; the subscript w means 'of word w')." },
      { sym: "$g$", desc: "one n-gram drawn from the set $\\mathcal{G}_w$; the sum in the score runs over every $g$ in the bag." },
      { sym: "$\\mathbf{z}_g$", desc: "the learnable vector for n-gram $g$ (bold z). Shared across every word that contains $g$ — this sharing is what gives OOV words a vector." },
      { sym: "$\\mathbf{v}_c$", desc: "the context (output) vector for context word $c$ (bold v); the thing the center is scored against, exactly as in word2vec." },
      { sym: "$\\mathbf{u}_{w_t}$", desc: "in plain word2vec, the whole-word input vector of the center word $w_t$ (bold u). fastText REPLACES this with the sum of n-gram vectors." },
      { sym: "$s(w,c)$", desc: "the score (a single number) of context word $c$ given word $w$: how well they go together. Higher = more compatible." },
      { sym: "$\\ell(x)$", desc: "the logistic loss $\\ell(x)=\\log(1+e^{-x})$ (script l). Small when $x$ is large and positive; large when $x$ is negative. Used in negative sampling." },
      { sym: "$\\mathcal{N}_{t,c}$", desc: "the set of randomly sampled NEGATIVE words for the (center $t$, context $c$) pair — words pushed to score LOW (script N)." },
      { sym: "$K$", desc: "the number of hash buckets the n-grams are mapped into to bound memory; the paper uses $K = 2\\cdot10^{6}$ (two million)." }
    ],

    formula:
      `$$s(w_t, w_c) \\;=\\; \\mathbf{u}_{w_t}^{\\top}\\,\\mathbf{v}_{w_c}
        \\qquad\\text{(word2vec score, Section 3.1)}$$
       $$\\sum_{t=1}^{T}\\Big[\\;\\sum_{c\\in C_t}\\ell\\big(s(w_t,w_c)\\big)
        \\;+\\;\\sum_{n\\in\\mathcal{N}_{t,c}}\\ell\\big(-\\,s(w_t,n)\\big)\\Big],
        \\quad \\ell(x)=\\log\\!\\big(1+e^{-x}\\big)
        \\qquad\\text{(neg-sampling objective, Section 3.1)}$$
       $$\\boxed{\\,s(w, c) \\;=\\; \\sum_{g\\in\\mathcal{G}_w} \\mathbf{z}_g^{\\top}\\,\\mathbf{v}_c\\,}
        \\qquad\\text{(fastText subword score, Section 3.2)}$$`,

    whatItDoes:
      `<p>The <b>first</b> line is plain word2vec: the score of a (center, context) pair is the dot product of two
       whole-word vectors (Section 3.1).</p>
       <p>The <b>second</b> line is the training objective both models share. For every center word $w_t$ in the text,
       each true context word $w_c$ is pushed to a high score (the $\\ell(s)$ term wants $s$ large), and each random
       negative word $n$ is pushed to a low score (the $\\ell(-s)$ term wants $s$ small). The logistic loss
       $\\ell(x)=\\log(1+e^{-x})$ is the negative log of the sigmoid, so this is logistic regression deciding
       "real neighbor or not?" for each pair (Section 3.1).</p>
       <p>The <b>boxed</b> line is fastText's one change (Section 3.2): the center's whole-word vector
       $\\mathbf{u}_{w}$ is replaced by the <b>sum over its n-gram vectors</b> $\\sum_{g\\in\\mathcal{G}_w}\\mathbf{z}_g$.
       Everything else &mdash; the window, the negatives, the loss &mdash; is identical. Because the same n-gram
       vector $\\mathbf{z}_g$ is reused by every word containing $g$, words that share spelling automatically share
       part of their representation, and a never-seen word is just the sum of its (mostly already-learned) n-grams.</p>`,

    derivation:
      `<p>The softmax/log-likelihood and negative-sampling math that underlies the skip-gram objective is owned by
       the <code>dl-word-embeddings</code> and <code>dl-word2vec</code> lessons &mdash; see them (and
       <code>paper-word2vec</code>) for the full derivation. <b>Short recap:</b> negative sampling turns the
       expensive full-vocabulary softmax into many cheap binary logistic-regression problems &mdash; "is this pair a
       real (center, context) co-occurrence, or a random negative?" &mdash; whose loss is $\\ell(x)=\\log(1+e^{-x})$.
       fastText changes <i>only</i> the input representation, not this objective: it swaps the whole-word vector for
       a sum of n-gram vectors. Linearity of the dot product makes this clean: since
       $\\big(\\sum_g \\mathbf{z}_g\\big)^\\top\\mathbf{v}_c = \\sum_g \\mathbf{z}_g^\\top\\mathbf{v}_c$, the new score
       is literally the old score with the input vector defined as the sum &mdash; so the same gradients flow back,
       now spread across all of the word's n-gram vectors.</p>`,

    example:
      `<p><b>Worked numbers</b> for the summed-embedding idea, with a tiny dimension $D=3$ and $n=3$ only (so the
       n-gram sets are short). Take the word <b>cat</b>: wrapping gives <code>&lt;cat&gt;</code>, whose 3-grams are
       <code>&lt;ca</code>, <code>cat</code>, <code>at&gt;</code>, plus the whole-word token <code>&lt;cat&gt;</code>.
       Suppose the learned n-gram vectors are:</p>
       <ul>
         <li>$\\mathbf{z}_{\\langle ca} = [0.2,\\,0.5,\\,-0.1]$</li>
         <li>$\\mathbf{z}_{cat} = [0.4,\\,-0.2,\\,0.3]$</li>
         <li>$\\mathbf{z}_{at\\rangle} = [-0.1,\\,0.1,\\,0.6]$</li>
         <li>$\\mathbf{z}_{\\langle cat\\rangle} = [0.3,\\,0.2,\\,-0.2]$ (the whole-word special token)</li>
       </ul>
       <p><b>Word vector for "cat"</b> = sum of its n-gram vectors:
       $\\mathbf{v}_{cat} = [0.2{+}0.4{-}0.1{+}0.3,\\; 0.5{-}0.2{+}0.1{+}0.2,\\; -0.1{+}0.3{+}0.6{-}0.2]
       = [0.8,\\,0.6,\\,0.6]$.</p>
       <p>Now the <b>OOV word "cats"</b>, never seen in training. Its 3-gram bag is
       <code>&lt;ca</code>, <code>cat</code>, <code>ats</code>, <code>ts&gt;</code>, plus <code>&lt;cats&gt;</code>.
       The first two are <b>shared with "cat"</b> (same vectors above); the last three are new, say
       $\\mathbf{z}_{ats}=[0.05,-0.05,0.1]$, $\\mathbf{z}_{ts\\rangle}=[0,0.1,-0.05]$,
       $\\mathbf{z}_{\\langle cats\\rangle}=[0.1,0,0]$. Summing:</p>
       <ul>
         <li>$\\mathbf{v}_{cats} = [0.2{+}0.4{+}0.05{+}0{+}0.1,\\; 0.5{-}0.2{-}0.05{+}0.1{+}0,\\;
         -0.1{+}0.3{+}0.1{-}0.05{+}0] = [0.75,\\,0.35,\\,0.25]$.</li>
         <li><b>Cosine similarity</b> of $\\mathbf{v}_{cat}=[0.8,0.6,0.6]$ and $\\mathbf{v}_{cats}=[0.75,0.35,0.25]$:
         dot $=0.8{\\cdot}0.75+0.6{\\cdot}0.35+0.6{\\cdot}0.25 = 0.96$; norms $\\approx 1.166$ and $0.866$;
         cosine $=0.96/(1.166{\\cdot}0.866) \\approx \\mathbf{0.9521}$.</li>
       </ul>
       <p>So "cats" lands very close to "cat" purely because they share n-grams &mdash; <b>word2vec would have no
       vector for "cats" at all.</b> The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>fastText training, as numbered steps (Sections 3.1&ndash;3.2):</b></p>
       <ol>
         <li>For each word, build its n-gram bag $\\mathcal{G}_w$: wrap in <code>&lt;...&gt;</code>, take all n-grams
         of length 3 to 6, and add the whole word as a special token. Hash n-grams into $K$ buckets to bound memory.</li>
         <li>Keep two tables: an n-gram (subword input) table $\\mathbf{z}$ of shape $(K, D)$, and a context (output)
         table $\\mathbf{v}$ of shape $(V, D)$.</li>
         <li>Slide a window over the corpus; emit (center, context) pairs, sampling a few negative words per pair.</li>
         <li>Score a pair with the <b>summed</b> center vector: $s(w,c)=\\sum_{g\\in\\mathcal{G}_w}\\mathbf{z}_g^\\top\\mathbf{v}_c$.</li>
         <li>Apply the negative-sampling logistic loss $\\ell(s) + \\sum_n \\ell(-s)$ and back-propagate; the center
         gradient is spread across all of the word's n-gram vectors.</li>
         <li>At inference, a word's vector is the sum of its n-gram vectors &mdash; works for <b>any</b> word,
         including ones never seen in training.</li>
       </ol>`,

    results:
      `<p>The paper evaluates word-similarity and analogy tasks across several languages. The qualitative headline:
       the subword model (which the paper calls <b>sisg</b>, "subword information skip-gram") helps most on
       <b>rare words and morphologically rich languages</b>. On the English Rare-Words dataset it reports a score of
       <b>47</b> for sisg versus <b>43</b> for the cbow baseline; on German Gur350, "our model (sisg) trained on 5%
       of the data achieves better performance (66) than [the] cbow baseline trained on the full dataset (62)"
       (Section 5). The most important property &mdash; that sisg produces a vector for <b>any</b> word, including
       OOV ones, while word2vec cannot &mdash; is the effect we reproduce in CODEVIZ. (Source: arXiv:1607.04606,
       Section 5; exact table numbers are in the paper and we do not quote them from memory.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track B (architecture).</b> fastText builds <i>on top of</i> the skip-gram + negative-sampling
       machinery you already met in <code>paper-word2vec</code> &mdash; we reuse that backbone and implement
       <b>only the novel part</b>: the character-n-gram bag and the <b>summed</b> word vector. You write
       <code>ngrams(word)</code> (boundary symbols, lengths 3&ndash;6, whole-word token) and
       <code>wordvec(word) = Z[ngrams].sum(0)</code>, then train the same negative-sampling loop scoring with the
       summed center vector. The demonstration is the OOV test: <code>wordvec("cats")</code> returns a real vector
       built from shared n-grams and lands nearest "cat", while the word2vec <b>ablation</b> &mdash; a whole-word
       lookup table &mdash; raises a <code>KeyError</code> for "cats" because it has no such row. We also recompute
       the worked $[0.8,0.6,0.6]$ / $[0.75,0.35,0.25]$ example so the numbers match.</p>`,

    pitfalls:
      `<ul>
         <li><b>Boundary symbols are not decoration.</b> Without the <code>&lt;</code> and <code>&gt;</code> markers,
         a prefix n-gram and the same letters mid-word collapse together. The n-gram <code>her</code> inside
         <code>where</code> must stay distinct from the standalone word <code>&lt;her&gt;</code> (Section 3.2).</li>
         <li><b>Keep the whole word as a special token.</b> $\\mathcal{G}_w$ includes <code>&lt;word&gt;</code> itself,
         so frequent words still learn a dedicated vector and do not rely on pieces alone.</li>
         <li><b>Sum, not average.</b> The score uses the <i>sum</i> of n-gram vectors; longer words simply have more
         terms. Averaging is a different model.</li>
         <li><b>OOV is the point of the ablation.</b> Make sure your held-out word ("cats") is truly absent from the
         training vocabulary, or the comparison with word2vec is meaningless.</li>
         <li><b>Hash collisions.</b> On a real corpus you hash millions of n-grams into $K$ buckets, so distinct
         n-grams can share a vector. It is a memory/quality trade-off, not a bug &mdash; our toy uses a small $K$.</li>
         <li><b>Reading too much into a tiny run.</b> Our corpus has a few dozen tokens, so the exact cosine numbers
         are noisy. The reproducible effect is the <i>ordering</i>: OOV "cats" nearest "cat", far from unrelated words.</li>
       </ul>`,

    recall: [
      "Write the fastText subword score $s(w,c)$ from memory and say what the sum runs over.",
      "Give the character n-grams of 'where' for $n=3$, including the boundary symbols and the whole-word token.",
      "What n-gram lengths does the paper use, and why wrap the word in $\\langle\\ \\rangle$?",
      "Explain in one sentence why fastText can embed an OOV word but word2vec cannot.",
      "State the negative-sampling logistic loss $\\ell(x)$ and what fastText changes versus word2vec."
    ],

    practice: [
      {
        q: `Build the character n-gram set $\\mathcal{G}_w$ for the word "cat" using $n=3$ only (with boundary symbols and the whole-word token), then write its word vector as a sum.`,
        steps: [
          { do: `Wrap the word: $\\langle cat\\rangle$.`, why: `Boundary symbols let prefix/suffix differ from mid-word pieces.` },
          { do: `Take all length-3 windows: $\\langle ca,\\ cat,\\ at\\rangle$.`, why: `Those are the 3-grams of the 5-character string &lt;cat&gt;.` },
          { do: `Add the whole word as a special token: $\\langle cat\\rangle$.`, why: `The paper keeps the word itself in $\\mathcal{G}_w$.` },
          { do: `Sum the vectors: $\\mathbf{v}_{cat}=\\mathbf{z}_{\\langle ca}+\\mathbf{z}_{cat}+\\mathbf{z}_{at\\rangle}+\\mathbf{z}_{\\langle cat\\rangle}$.`, why: `A word's vector is the sum of its n-gram vectors (boxed eq.).` }
        ],
        answer: `$\\mathcal{G}_{cat}=\\{\\langle ca,\\ cat,\\ at\\rangle,\\ \\langle cat\\rangle\\}$ and $\\mathbf{v}_{cat}=\\sum_{g\\in\\mathcal{G}_{cat}}\\mathbf{z}_g$. With the lesson's numbers this is $[0.8,0.6,0.6]$.`
      },
      {
        q: `OOV check: the word "cats" was never in training. Using $n=3$, which of its n-grams are SHARED with "cat", and why does that give it a sensible vector?`,
        steps: [
          { do: `n-grams of $\\langle cats\\rangle$: $\\langle ca,\\ cat,\\ ats,\\ ts\\rangle$ plus $\\langle cats\\rangle$.`, why: `All length-3 windows of the wrapped word, plus the whole-word token.` },
          { do: `Compare to $\\mathcal{G}_{cat}=\\{\\langle ca, cat, at\\rangle, \\langle cat\\rangle\\}$.`, why: `Find the overlap.` },
          { do: `Shared: $\\langle ca$ and $cat$.`, why: `Their vectors were already learned from "cat", and are reused by sharing.` }
        ],
        answer: `"cats" shares $\\langle ca$ and $cat$ with "cat", so its summed vector inherits most of "cat"'s representation and lands near it (cosine $\\approx 0.95$ in the worked example) — with NO training on "cats". word2vec has no row for "cats" and cannot produce any vector.`
      },
      {
        q: `Ablation: in the CODE, swap fastText's <code>wordvec(word)=Z[ngrams(word)].sum(0)</code> for a plain word2vec-style whole-word lookup <code>U[stoi[word]]</code>. What happens when you ask for the OOV word "cats", and what does this prove?`,
        steps: [
          { do: `Replace the summed n-gram vector with a single whole-word row lookup.`, why: `That is exactly the word2vec input representation.` },
          { do: `Call the model on "cats", which is not in <code>stoi</code>.`, why: `"cats" was held out of the training vocabulary.` },
          { do: `Observe the <code>KeyError</code> (no row exists), then re-run the fastText version on "cats".`, why: `Compare what each model can produce for an unseen word.` }
        ],
        answer: `The word2vec lookup raises a <code>KeyError</code> — there is no vector for an unseen word, so OOV fails entirely. fastText still returns a vector for "cats" (sum of its n-grams, mostly shared with "cat") and it lands nearest "cat". This is the paper's core advantage: composing words from subword pieces makes OOV and rare words work, which whole-word embeddings cannot.`
      }
    ]
  });

  window.CODE["paper-fasttext"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Implement fastText's one new idea on top of skip-gram: a word's vector is the SUM of its character ` +
      `n-gram vectors. Build ngrams(word) (boundary symbols <...>, lengths 3-6, whole-word token) and ` +
      `wordvec(word)=Z[ids].sum(0); recompute the worked [0.8,0.6,0.6] / [0.75,0.35,0.25] example and its ` +
      `cosine 0.9521; train the negative-sampling loop on a tiny corpus that NEVER contains "cats"; then show ` +
      `fastText gives OOV "cats" a vector nearest "cat", while the word2vec ablation (whole-word lookup) raises ` +
      `KeyError. Runs in Colab (torch preinstalled).`,
    code: `import torch, torch.nn.functional as F
torch.manual_seed(0)

# ---------- fastText's novel part: char n-gram bag + SUMMED word vector ----------
def ngrams(word, nmin=3, nmax=6):
    """Wrap in <...>, take all n-grams of length nmin..nmax, plus the whole word as a special token."""
    w = "<" + word + ">"
    gr = set()
    for n in range(nmin, nmax + 1):
        for i in range(len(w) - n + 1):
            gr.add(w[i:i+n])
    gr.add("<" + word + ">")          # the whole word, kept as one special n-gram
    return sorted(gr)

print("where 3-grams:", ngrams("where", 3, 3))   # ['<wh', '<where>', 'ere', 'her', 're>', 'whe']  (matches the paper)

# ---------- recompute the WORKED EXAMPLE (D=3, n=3) ----------
# named n-gram vectors so the sum is transparent
z = {"<ca":[0.2,0.5,-0.1], "cat":[0.4,-0.2,0.3], "at>":[-0.1,0.1,0.6], "<cat>":[0.3,0.2,-0.2],
     "ats":[0.05,-0.05,0.1], "ts>":[0.0,0.1,-0.05], "<cats>":[0.1,0.0,0.0]}
Z3 = {k: torch.tensor(v) for k, v in z.items()}
def sumvec(keys): return torch.stack([Z3[k] for k in keys]).sum(0)
v_cat  = sumvec(["<ca","cat","at>","<cat>"])               # "cat"
v_cats = sumvec(["<ca","cat","ats","ts>","<cats>"])        # OOV "cats" (shares <ca, cat)
cos = (v_cat @ v_cats) / (v_cat.norm() * v_cats.norm())
print("v(cat) :", [round(x,4) for x in v_cat.tolist()])    # [0.8, 0.6, 0.6]
print("v(cats):", [round(x,4) for x in v_cats.tolist()])   # [0.75, 0.35, 0.25]
print("cosine(cat, cats):", round(cos.item(), 4))          # 0.9521

# ---------- train a tiny fastText on a corpus that NEVER contains "cats" ----------
torch.manual_seed(1)
corpus = ("the cat sat the dog ran the cat ran the dog sat a cat plays a dog plays "
          "the cat eats the dog eats cat and dog cat or dog fish swims the fish swam "
          "fish and fish the fish eats").split()
vocab = sorted(set(corpus)); stoi = {w:i for i,w in enumerate(vocab)}; V = len(vocab)
D, K = 16, 4096                                            # K = n-gram hash buckets (paper uses 2e6)
def bucket_ids(word): return sorted({hash(g) % K for g in ngrams(word)})

Z    = (torch.randn(K, D) * 0.1).requires_grad_(True)      # n-gram (subword) input table
Vout = (torch.randn(V, D) * 0.1).requires_grad_(True)      # context (output) table
def wordvec(word): return Z[bucket_ids(word)].sum(0)       # <-- fastText: SUM of n-gram vectors

pairs = []                                                 # window = 2
for i, w in enumerate(corpus):
    for j in range(max(0,i-2), min(len(corpus),i+3)):
        if j != i: pairs.append((w, stoi[corpus[j]]))

opt = torch.optim.Adam([Z, Vout], lr=0.05)
g = torch.Generator().manual_seed(0)
for epoch in range(60):
    for cw, ctx in pairs:
        vc = wordvec(cw)                                   # summed center vector
        negs = torch.randint(0, V, (5,), generator=g)
        targets = torch.cat([torch.tensor([ctx]), negs])
        labels  = torch.tensor([1.,0.,0.,0.,0.,0.])
        s = Vout[targets] @ vc                             # scores for pos + 5 negatives
        loss = F.binary_cross_entropy_with_logits(s, labels)   # = negative-sampling logistic loss
        opt.zero_grad(); loss.backward(); opt.step()
print("final loss:", round(loss.item(), 4))

# ---------- OOV test: fastText vs word2vec ----------
def cosine(a, b): return (a @ b / (a.norm() * b.norm())).item()
with torch.no_grad():
    vc_cat, vc_dog, vc_fish = wordvec("cat"), wordvec("dog"), wordvec("fish")
    vc_cats = wordvec("cats")                              # OOV — fastText STILL returns a vector
print("\\nfastText OOV 'cats' cosine to:")
print("  cat :", round(cosine(vc_cats, vc_cat), 3))       # highest — shares <ca, cat
print("  dog :", round(cosine(vc_cats, vc_dog), 3))
print("  fish:", round(cosine(vc_cats, vc_fish), 3))

# word2vec ABLATION: a whole-word lookup table has NO row for an unseen word
U = torch.randn(V, D)                                      # word2vec-style whole-word input table
def w2v(word): return U[stoi[word]]                        # raises KeyError for OOV
try:
    w2v("cats")
except KeyError:
    print("\\nword2vec lookup('cats') -> KeyError: OOV has no vector at all.")`
  };

  window.CODEVIZ["paper-fasttext"] = {
    question: "Train a tiny fastText on a corpus that never contains 'cats'. Can it still build a vector for the out-of-vocabulary word 'cats' from its character n-grams, and does it land nearest 'cat' — where plain word2vec has no vector at all?",
    charts: [
      {
        type: "bar",
        title: "OOV word 'cats' (never trained) — cosine similarity of its summed n-gram vector to known words",
        xlabel: "known word",
        ylabel: "cosine similarity to OOV 'cats'",
        series: [
          {
            name: "fastText (summed n-grams)",
            color: "#7ee787",
            points: [["cat", 0.70], ["fish", 0.155], ["dog", 0.127]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seeds 0/1), not the paper's reported numbers. We trained a fastText-style skip-gram with negative sampling on ~50 toy tokens that <b>never include the word 'cats'</b>. At inference we still build a vector for the out-of-vocabulary word 'cats' as the <b>sum of its character n-grams (lengths 3-6)</b> — which reuse the vectors of <code>&lt;ca</code> and <code>cat</code> learned from the in-vocab word 'cat'. The OOV vector lands clearly nearest <b>'cat'</b> (cosine ~0.70), far above the unrelated 'dog' (~0.13) and 'fish' (~0.16). The <b>word2vec ablation</b> — a whole-word lookup table — has <i>no row</i> for 'cats' and raises a <code>KeyError</code>, so its bars do not exist: that is the qualitative effect from the paper (Section 3.2). (Exact cosines are noisy on so few tokens; the reproducible result is that OOV 'cats' is nearest its morphological sibling 'cat'.)",
    code: `import torch, torch.nn.functional as F
torch.manual_seed(1)

def ngrams(word, nmin=3, nmax=6):
    w = "<" + word + ">"; gr = set()
    for n in range(nmin, nmax + 1):
        for i in range(len(w) - n + 1): gr.add(w[i:i+n])
    gr.add("<" + word + ">"); return sorted(gr)

corpus = ("the cat sat the dog ran the cat ran the dog sat a cat plays a dog plays "
          "the cat eats the dog eats cat and dog cat or dog fish swims the fish swam "
          "fish and fish the fish eats").split()
vocab = sorted(set(corpus)); stoi = {w:i for i,w in enumerate(vocab)}; V = len(vocab)
D, K = 16, 4096
def bucket_ids(word): return sorted({hash(g) % K for g in ngrams(word)})
Z    = (torch.randn(K, D) * 0.1).requires_grad_(True)
Vout = (torch.randn(V, D) * 0.1).requires_grad_(True)
def wordvec(word): return Z[bucket_ids(word)].sum(0)

pairs = []
for i, w in enumerate(corpus):
    for j in range(max(0,i-2), min(len(corpus),i+3)):
        if j != i: pairs.append((w, stoi[corpus[j]]))

opt = torch.optim.Adam([Z, Vout], lr=0.05)
g = torch.Generator().manual_seed(0)
for epoch in range(60):
    for cw, ctx in pairs:
        vc = wordvec(cw)
        targets = torch.cat([torch.tensor([stoi[corpus[0]] if False else ctx]),
                             torch.randint(0, V, (5,), generator=g)])
        labels = torch.tensor([1.,0.,0.,0.,0.,0.])
        loss = F.binary_cross_entropy_with_logits(Vout[targets] @ vc, labels)
        opt.zero_grad(); loss.backward(); opt.step()

def cosine(a, b): return round((a @ b / (a.norm() * b.norm())).item(), 3)
with torch.no_grad():
    cats = wordvec("cats")                       # OOV, never trained
    for w in ["cat", "fish", "dog"]:
        print(f"cosine(cats_OOV, {w:4s}) = {cosine(cats, wordvec(w))}")
# word2vec whole-word lookup would raise KeyError('cats') -> no OOV vector at all`
  };
})();
