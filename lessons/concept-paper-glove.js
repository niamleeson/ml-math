/* Paper lesson — GloVe: Global Vectors for Word Representation (Pennington, Socher, Manning, 2014).
   Grounded from the official PDF nlp.stanford.edu/pubs/glove.pdf (EMNLP 2014). NO arXiv.
   Equations transcribed from the PDF: ratio model Eq.(1)-(6), bias form Eq.(7), the weighted
   least-squares objective Eq.(8), and the weighting function f Eq.(9) with x_max=100, alpha=3/4.
   Results from Table 2 (word-analogy % accuracy) and the abstract (75% on the analogy task).
   Track A (primitive): build a co-occurrence matrix X from a toy corpus, then minimize the GloVe
   objective J with raw NumPy/Adagrad; show nearest neighbors cluster by topic and the analogy
   king-man+woman ~ queen holds. Cross-links paper-word2vec: GloVe uses GLOBAL co-occurrence counts,
   not the LOCAL sliding windows of skip-gram. */
(function () {
  window.LESSONS.push({
    id: "paper-glove",
    title: "GloVe — Global Vectors for Word Representation (2014)",
    tagline: "Learn word vectors by fitting their dot products to the log of how often words co-occur across the whole corpus.",
    module: "Papers · Sequence & NLP",
    track: "primitive",

    paper: {
      authors: "Jeffrey Pennington, Richard Socher, Christopher D. Manning",
      org: "Stanford University (Computer Science Department)",
      year: 2014,
      venue: "EMNLP 2014 (Conference on Empirical Methods in Natural Language Processing)",
      citations: "",
      url: "https://nlp.stanford.edu/pubs/glove.pdf",
      code: "https://nlp.stanford.edu/projects/glove/"
    },

    conceptLink: "dl-word2vec",
    partOf: [],
    prereqs: ["dl-word2vec", "dl-word-embeddings", "ml-linear-regression", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> By 2014 there were <b>two</b> rival families of methods for turning words into
       vectors, and each was good at exactly what the other was bad at (Section 1 / Section 2 of the paper).</p>
       <ul>
         <li><b>Global matrix factorization</b> &mdash; e.g. <b>Latent Semantic Analysis (LSA)</b>. ("Matrix
         factorization" = approximating a big table of numbers by the product of two smaller tables.) These build
         one giant table of corpus-wide statistics and factor it. They <b>use the whole corpus efficiently</b>,
         but the paper reports they "do relatively poorly on the word analogy task," meaning a "sub-optimal vector
         space structure" (Section 1).</li>
         <li><b>Local context-window methods</b> &mdash; e.g. <b>skip-gram</b> (the <code>paper-word2vec</code>
         lesson). These slide a small window over the text and learn from each window. They do <b>well on
         analogies</b>, but the paper notes they "poorly utilize the statistics of the corpus since they train on
         separate local context windows instead of on global co-occurrence counts" (Section 1).</li>
       </ul>
       <p>The question (Section 3): can one model get <b>both</b> &mdash; the global statistics of LSA <i>and</i> the
       meaningful linear structure of skip-gram?</p>`,

    contribution:
      `<p>GloVe (short for <b>Glo</b>bal <b>Ve</b>ctors) is "a new global log-bilinear regression model" (abstract)
       that fuses the two families. Its contributions:</p>
       <ul>
         <li><b>Train on global co-occurrence counts.</b> Build one word-word co-occurrence matrix $X$ over the
         whole corpus, then fit the vectors to it. This captures corpus-wide statistics like LSA does.</li>
         <li><b>A weighted least-squares objective</b> (Eq. 8) whose target is the <b>logarithm of the
         co-occurrence count</b>, $\\log X_{ij}$. The paper derives this from the insight that <b>ratios</b> of
         co-occurrence probabilities, not the raw probabilities, carry the meaning (Section 3).</li>
         <li><b>A weighting function $f(X_{ij})$</b> (Eq. 9) that down-weights very rare and very frequent word
         pairs, so neither noisy rare pairs nor uninformative pairs like "the/and" dominate.</li>
         <li><b>Efficiency:</b> it trains "only on the nonzero elements in a word-word co-occurrence matrix, rather
         than on the entire sparse matrix or on individual context windows" (abstract).</li>
       </ul>`,

    whyItMattered:
      `<p>GloVe became, alongside word2vec, one of the two <b>standard pretrained word-vector sets</b> of the
       mid-2010s; the public Stanford vectors (trained on Wikipedia and Common Crawl) were dropped into countless
       natural-language systems as a ready-made first layer. It also made a clean intellectual point: the
       meaningful <b>linear structure</b> ("king is to queen as man is to woman") can be <i>derived</i> from a
       transparent objective over global counts, not just observed as a happy accident of a neural net. Word
       vectors like these are the conceptual ancestor of the token-embedding layer at the bottom of every modern
       Transformer.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3 (The GloVe Model)</b> &mdash; the heart of the paper. Follow the chain from Eq. (1) to
         Eq. (8): why ratios, why the log, how the bias terms appear.</li>
         <li><b>Table 1</b> &mdash; the <i>ice</i>/<i>steam</i> example. It shows why the <b>ratio</b>
         $P_{ik}/P_{jk}$ separates meaning while raw probabilities do not (the ratio is 8.9 for <i>solid</i>,
         0.085 for <i>gas</i>, but near 1 for the irrelevant <i>water</i>/<i>fashion</i>).</li>
         <li><b>Eq. (8) and Eq. (9)</b> &mdash; the objective $J$ and the weighting function $f$ (with
         Figure 1 showing $f$'s shape and the cutoff $x_{\\max}$).</li>
       </ul>
       <p><b>Skim:</b> Section 3.1 (relationship to skip-gram), Section 3.2 (complexity analysis with the
       harmonic-number math), and Section 4's benchmark tables &mdash; note the headline 75% analogy number but do
       not memorize every row.</p>
       <p><b>Read alongside:</b> the <code>paper-word2vec</code> lesson. GloVe's key contrast is that it uses
       <b>global</b> co-occurrence counts where skip-gram uses <b>local</b> sliding windows.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We will build a small co-occurrence matrix $X$ from a toy corpus whose
       sentences are either about royalty/people (king, queen, man, woman, ...) or about animals (cat, dog,
       kitten, puppy), then fit GloVe vectors to $\\log X$. Two questions: (1) After training, will the four
       animal words land near each other and the people words near each other, even though we never label the
       topics? (2) Will the analogy vector $v_{\\text{king}}-v_{\\text{man}}+v_{\\text{woman}}$ point nearest to
       <i>queen</i>? Write your guesses, then check the CODEVIZ scatter and the CODE output.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Build the GloVe objective from a co-occurrence matrix
       <code>X</code> (shape <code>(V, V)</code>), two vector tables <code>W</code>, <code>Wt</code>
       (shape <code>(V, D)</code>) and two bias vectors <code>b</code>, <code>bt</code> (length <code>V</code>),
       using raw NumPy &mdash; no library word-vector call:</p>
       <ul>
         <li>The weighting function: <code># TODO: f(x) = (x/xmax)**alpha if x &lt; xmax else 1.0</code></li>
         <li>For each <b>nonzero</b> entry $(i,j)$ of $X$, the inner residual:
         <code># TODO: r = W[i]·Wt[j] + b[i] + bt[j] - log(X[i,j])</code></li>
         <li>Its contribution to the loss: <code># TODO: J += f(X[i,j]) * r**2</code></li>
         <li>Its gradient w.r.t. each parameter: <code># TODO: g = 2 * f(X[i,j]) * r</code>, then push
         <code>W[i]</code> by <code>g * Wt[j]</code>, <code>Wt[j]</code> by <code>g * W[i]</code>, and each bias by
         <code>g</code>.</li>
       </ul>
       <p>The CODE cell is the full reference: it builds $X$ from the corpus, trains with Adagrad (the paper's
       optimizer), recomputes the worked example exactly, and prints nearest neighbors plus the analogy result.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>GloVe's logic walks from a concrete observation to a clean objective. ("Co-occurrence count" $X_{ij}$ =
       how many times word $j$ shows up near word $i$ across the entire corpus.)</p>
       <ol>
         <li><b>Build the co-occurrence matrix $X$.</b> Scan the corpus once; for every word $i$, count how often
         each other word $j$ appears in its context, optionally weighting closer words more (we use $1/\\text{distance}$).
         This single matrix is the <b>global</b> statistic GloVe trains on &mdash; unlike skip-gram, which revisits
         each local window separately.</li>
         <li><b>Meaning lives in <i>ratios</i>, not raw counts.</b> Define $P_{ij}=P(j\\mid i)=X_{ij}/X_i$, the
         probability word $j$ appears in the context of $i$ ($X_i=\\sum_k X_{ik}$ is $i$'s total). The paper's
         Table 1 shows that for $i=$<i>ice</i>, $j=$<i>steam</i>, the <b>ratio</b> $P_{ik}/P_{jk}$ is large for
         <i>solid</i> (8.9), small for <i>gas</i> (0.085), and $\\approx 1$ for irrelevant words like <i>water</i>.
         The ratio cancels out non-discriminative words; the raw probability does not.</li>
         <li><b>Turn the ratio into a vector equation.</b> The paper asks for a function $F$ of the word vectors
         that reproduces the ratio: $F(w_i,w_j,\\tilde w_k)=P_{ik}/P_{jk}$ (Eq. 1). Restricting $F$ to the
         <b>difference</b> $w_i-w_j$ and a <b>dot product</b>, and requiring it to respect the multiplicative
         structure of ratios (a homomorphism), forces $F=\\exp$. That gives
         $w_i^\\top\\tilde w_k=\\log P_{ik}=\\log X_{ik}-\\log X_i$ (Eqs. 5-6).</li>
         <li><b>Absorb the leftover terms into biases.</b> The $\\log X_i$ term depends only on $i$, so it becomes a
         bias $b_i$; adding a matching bias $\\tilde b_k$ for the context word restores symmetry, giving the clean
         relation $w_i^\\top\\tilde w_k+b_i+\\tilde b_k=\\log X_{ik}$ (Eq. 7).</li>
         <li><b>Fit it by weighted least squares.</b> Eq. 7 is only approximately true, so GloVe minimizes the
         squared error between the two sides, summed over all word pairs, each weighted by $f(X_{ij})$ (Eq. 8).</li>
       </ol>
       <p>So the dot product of two word vectors is trained to equal the log of how often the words co-occur.
       Words with similar co-occurrence profiles end up with similar vectors.</p>`,

    architecture:
      `<p>GloVe is not a deep network — it is a <b>single log-bilinear regression layer</b> over a precomputed
       count matrix, plus a per-iteration training procedure. Its "architecture" is the data structures and the
       update loop (Section 3, Section 4.2).</p>
       <p><b>Parameters (the whole model).</b> For a vocabulary of size $V$ and embedding dimension $D$:</p>
       <ul>
         <li><b>Word-vector table $W$</b> — shape $(V, D)$. One row $w_i$ per word.</li>
         <li><b>Context-vector table $\\tilde W$</b> — shape $(V, D)$. One row $\\tilde w_j$ per word, a <i>separate</i>
         set used while training. When $X$ is symmetric, $W$ and $\\tilde W$ end up equivalent up to random
         initialization.</li>
         <li><b>Bias vectors $b$ and $\\tilde b$</b> — length $V$ each (one scalar per word).</li>
       </ul>
       <p>The only operation is the bilinear score $w_i^\\top \\tilde w_j + b_i + \\tilde b_j$ — no hidden layers, no
       nonlinearity. There is nothing else: GloVe has roughly $2VD + 2V$ parameters.</p>
       <p><b>Input: the global co-occurrence matrix $X$</b> — shape $(V, V)$, built <b>once</b> before training by a
       single pass over the corpus. The paper uses a symmetric context window of 10 words to the left and 10 to the
       right, with a decreasing weight: a word pair $d$ positions apart contributes $1/d$ to the count (so closer
       words matter more). On a 6-billion-token corpus with a 400k vocabulary this pass takes about 85 minutes
       (Section 4.6). The matrix is sparse — zero entries are 75-95% of cells — and only nonzero entries are used.</p>
       <p><b>Per-iteration training procedure (the "forward/backward pass").</b> The optimizer is <b>AdaGrad</b>
       (Duchi et al., 2011) with initial learning rate $0.05$, stochastically sampling the nonzero entries of $X$:</p>
       <ol>
         <li>Pick a nonzero entry $(i,j)$. Compute the residual $r = w_i^\\top \\tilde w_j + b_i + \\tilde b_j - \\log X_{ij}$
         (the bilinear forward pass) and the weight $f(X_{ij})$ (Eq. 9).</li>
         <li>Accumulate the loss $f(X_{ij})\\,r^2$ (Eq. 8) and form the shared gradient factor $g = 2 f(X_{ij})\\,r$.</li>
         <li>Backprop to the four parameter groups: $w_i \\leftarrow w_i - \\eta\\,g\\,\\tilde w_j$,
         $\\tilde w_j \\leftarrow \\tilde w_j - \\eta\\,g\\,w_i$, $b_i \\leftarrow b_i - \\eta\\,g$,
         $\\tilde b_j \\leftarrow \\tilde b_j - \\eta\\,g$, where AdaGrad scales $\\eta$ per-parameter by the inverse
         square root of accumulated squared gradients.</li>
       </ol>
       <p><b>Hyperparameters (Section 4):</b> dimension $D$ up to 600 with diminishing returns past $\\sim$200;
       50 iterations for $D \\lt 300$, 100 otherwise; $x_{\\max}=100$, $\\alpha=3/4$.</p>
       <p><b>Output (the embedding).</b> After training, the embedding for a word is the <b>sum</b> $w_i + \\tilde w_i$
       of its two vectors — the paper reports this gives a small boost, especially on the semantic analogy task.</p>`,

    symbols: [
      { sym: "$V$", desc: "vocabulary size: the number of distinct words. The matrix $X$ is $V\\times V$ and the sum in $J$ runs over word pairs $i,j$ from $1$ to $V$." },
      { sym: "$X_{ij}$", desc: "the co-occurrence count: how many times word $j$ appears in the context of word $i$ across the whole corpus (we weight by $1/$distance, so closer words count more)." },
      { sym: "$X_i$", desc: "$\\sum_k X_{ik}$ — the total number of times any word appears in the context of word $i$ (the row total of $X$)." },
      { sym: "$P_{ij}$", desc: "$=P(j\\mid i)=X_{ij}/X_i$ — the probability that word $j$ appears in the context of word $i$ (the bar means 'given')." },
      { sym: "$P_{ik}/P_{jk}$", desc: "a ratio of two such probabilities. Large means probe word $k$ is more associated with $i$ than $j$; near $1$ means $k$ does not distinguish them. This ratio carries the meaning (Table 1)." },
      { sym: "$w_i$", desc: "the word vector for word $i$ — a list of $D$ real numbers (the embedding we keep)." },
      { sym: "$\\tilde w_j$", desc: "a separate context vector for word $j$ (tilde = 'context'). Each word has both a word vector and a context vector during training; the final embedding sums them." },
      { sym: "$w_i^\\top \\tilde w_j$", desc: "the dot product (sum of element-wise products) of the word vector of $i$ and the context vector of $j$ — the quantity GloVe fits to $\\log X_{ij}$." },
      { sym: "$b_i,\\ \\tilde b_j$", desc: "bias terms (one scalar per word) for the word and context vectors. They absorb the per-word $\\log X_i$ offset and restore symmetry (Eq. 7)." },
      { sym: "$\\log X_{ij}$", desc: "the natural logarithm of the co-occurrence count — the regression target that the dot product plus biases is fit to." },
      { sym: "$f(X_{ij})$", desc: "the weighting function (Eq. 9): how much each pair contributes to the loss. It is $0$ at $0$, rises, and flattens at $1$ for frequent pairs, so rare and very common pairs are both down-weighted." },
      { sym: "$x_{\\max}$", desc: "the cutoff count at which $f$ reaches its maximum of $1$. The paper fixes $x_{\\max}=100$ (Section 3.1, Figure 1)." },
      { sym: "$\\alpha$", desc: "the exponent shaping $f$ below the cutoff. The paper uses $\\alpha=3/4$, which it found 'gives a modest improvement over a linear version with $\\alpha=1$' (Section 3.1)." },
      { sym: "$J$", desc: "the total cost (objective) that training minimizes — the weighted sum of squared residuals over all word pairs (Eq. 8)." },
      { sym: "$F$", desc: "the unknown function (Eqs. 1-5) the derivation seeks: it maps the word vectors to the co-occurrence ratio. Imposing linearity, a dot product, and a homomorphism pins it down to $\\exp$." },
      { sym: "$D$", desc: "the embedding dimension — the length of each word vector $w_i$. The paper uses up to 600, with diminishing returns past about 200." },
      { sym: "$r_{ij}$", desc: "the frequency rank of the word pair $(i,j)$ — its position when all pairs are sorted by count. Used in the complexity analysis's power-law model $X_{ij}=k/r_{ij}^{\\alpha}$ (Eq. 17)." },
      { sym: "$|X|$", desc: "the number of nonzero entries in the co-occurrence matrix — what GloVe's cost actually scales with (it skips the zeros). Bounded by $O(|V|^2)$, but tighter in practice." },
      { sym: "$|C|$", desc: "the corpus size: the total number of words (tokens) in the training text. The window-based methods scale with this." },
      { sym: "$\\zeta$", desc: "the Riemann zeta function, $\\zeta(s)=\\sum_{n\\ge 1} n^{-s}$. It appears (Eq. 21) when the count sum is evaluated as a generalized harmonic number for large $|X|$." }
    ],

    formula:
      `$$P_{ij} \\;=\\; P(j\\mid i) \\;=\\; \\frac{X_{ij}}{X_i},\\qquad X_i \\;=\\; \\sum_{k} X_{ik}$$
       <p>The co-occurrence matrix $X$ and its probabilities (Section 3): $X_{ij}$ counts how often word $j$ occurs in the context of word $i$; $P_{ij}$ is the conditional probability, $X_i$ is the row total.</p>
       $$F\\!\\big(w_i,\\,w_j,\\,\\tilde w_k\\big) \\;=\\; \\frac{P_{ik}}{P_{jk}}\\qquad\\text{(Eq. 1)}$$
       <p>The starting demand: some function $F$ of the word vectors must reproduce the co-occurrence-probability <b>ratio</b> $P_{ik}/P_{jk}$ — the quantity Table 1 shows carries the meaning (8.9 for <i>solid</i> vs <i>ice/steam</i>, $\\approx 1$ for irrelevant <i>water</i>).</p>
       $$F\\!\\big((w_i-w_j)^{\\top}\\tilde w_k\\big) \\;=\\; \\frac{P_{ik}}{P_{jk}}\\qquad\\text{(Eq. 3)}$$
       <p>Restrict $F$ to the vector <b>difference</b> $w_i-w_j$ (vector spaces are linear) and take a <b>dot product</b> to keep a scalar (Eqs. 2-3).</p>
       $$F\\!\\big(w_i^{\\top}\\tilde w_k\\big) \\;=\\; P_{ik} \\;=\\; \\frac{X_{ik}}{X_i}\\qquad\\text{(Eq. 5)}$$
       <p>Requiring $F$ to be a homomorphism from $(\\mathbb{R},+)$ to $(\\mathbb{R}_{\\gt 0},\\times)$ — turning subtraction of vectors into division of ratios (Eq. 4) — solves to $F=\\exp$, so each side matches one probability (Eq. 5).</p>
       $$w_i^{\\top}\\tilde w_k \\;=\\; \\log\\!\\big(P_{ik}\\big) \\;=\\; \\log\\!\\big(X_{ik}\\big) - \\log\\!\\big(X_i\\big)\\qquad\\text{(Eq. 6)}$$
       <p>Taking logs of Eq. 5: the dot product equals $\\log P_{ik}$. This is the central insight that <b>motivates</b> the whole model — fitting dot products to log co-occurrence probabilities.</p>
       $$w_i^{\\top}\\tilde w_k + b_i + \\tilde b_k \\;=\\; \\log\\!\\big(X_{ik}\\big)\\qquad\\text{(Eq. 7)}$$
       <p>The $\\log X_i$ term depends only on $i$, so absorb it into a bias $b_i$; add $\\tilde b_k$ to restore the word$\\leftrightarrow$context symmetry. Now the target is simply $\\log X_{ik}$.</p>
       $$J \\;=\\; \\sum_{i,j=1}^{V} f\\!\\big(X_{ij}\\big)\\,\\big(\\,w_i^{\\top}\\tilde w_j + b_i + \\tilde b_j - \\log X_{ij}\\,\\big)^{2}\\qquad\\text{(Eq. 8)}$$
       <p>Eq. 7 holds only approximately, so cast it as <b>weighted least squares</b>: sum the squared residual over all word pairs, each weighted by $f(X_{ij})$. This is the GloVe objective.</p>
       $$f(x) \\;=\\; \\begin{cases}\\,(x/x_{\\max})^{\\alpha} & \\text{if } x \\lt x_{\\max}\\\\[2pt] \\,1 & \\text{otherwise}\\end{cases}\\qquad x_{\\max}=100,\\ \\alpha=\\tfrac{3}{4}\\qquad\\text{(Eq. 9)}$$
       <p>The weighting function: $f(0)=0$, rising as a power law below the cutoff $x_{\\max}=100$ then flat at $1$, so empty pairs cost nothing and very frequent pairs (like "the/and") do not dominate. The paper found $\\alpha=3/4$ beats the linear $\\alpha=1$.</p>
       $$X_{ij} \\;=\\; \\frac{k}{(r_{ij})^{\\alpha}},\\qquad |C| \\;\\sim\\; \\frac{|X|}{1-\\alpha} + \\zeta(\\alpha)\\,|X|^{\\alpha} + O(1)\\qquad\\text{(Eqs. 17, 21)}$$
       $$|X| \\;=\\; \\begin{cases}\\,O(|C|) & \\text{if } \\alpha \\lt 1\\\\[2pt] \\,O\\!\\big(|C|^{1/\\alpha}\\big) & \\text{if } \\alpha \\gt 1\\end{cases}\\qquad\\Longrightarrow\\qquad |X| = O\\!\\big(|C|^{0.8}\\big)\\qquad\\text{(Eq. 22)}$$
       <p><b>Complexity (Section 3.2).</b> Cost scales with the number of nonzero entries $|X|$, trivially bounded by $O(|V|^2)$. Modeling counts as a power law of frequency rank $r_{ij}$ (Eq. 17, here a different exponent than $f$'s $\\alpha$) and summing via the generalized harmonic number / Riemann zeta function $\\zeta$ (Eqs. 18-21) gives the tighter bound Eq. 22. For the studied corpora the fit gives an exponent of $1.25$, so $|X| = O(|C|^{0.8})$ — better than the worst-case $O(|V|^2)$ and even better than the window methods' $O(|C|)$ in the corpus size $|C|$.</p>`,

    whatItDoes:
      `<p><b>Eq. 8</b> is the GloVe objective. For each pair of words $(i,j)$ it measures how far the model's
       prediction $w_i^\\top\\tilde w_j + b_i + \\tilde b_j$ is from the target $\\log X_{ij}$, <b>squares</b> that
       error (so over- and under-shooting both cost), and <b>weights</b> it by $f(X_{ij})$. Summing over all pairs
       and minimizing pushes each dot product toward the log co-occurrence count. Because the sum only has nonzero
       terms where $X_{ij}\\gt 0$, GloVe touches only the populated cells of $X$ &mdash; the abstract notes
       "even just the zero entries account for 75-95% of the data in $X$," so skipping them is a big saving.</p>
       <p><b>Eq. 9</b> is the weight. The paper lists three desiderata (Section 3.1): $f(0)=0$ (so empty pairs cost
       nothing and the $\\log 0$ divergence never appears); $f$ non-decreasing (rare pairs are not over-weighted);
       and $f$ small for large $x$ (so frequent pairs like "the/and" do not dominate). The piecewise power law in
       Eq. 9 with $\\alpha=3/4$ and $x_{\\max}=100$ satisfies all three.</p>`,

    derivation:
      `<p>The softmax/log-likelihood machinery that <i>also</i> underlies skip-gram is derived in the
       <code>dl-word2vec</code> concept lesson; here is the short version of GloVe's <i>own</i> derivation, which
       is regression-based rather than probabilistic.</p>
       <p>Start from the demand that the word vectors reproduce co-occurrence <b>ratios</b>,
       $F(w_i,w_j,\\tilde w_k)=P_{ik}/P_{jk}$ (Eq. 1). Two reasonable choices pin down $F$: (a) since vector spaces
       are linear, let $F$ depend on the <b>difference</b> $w_i-w_j$; (b) to keep things a scalar, feed it the
       <b>dot product</b> $(w_i-w_j)^\\top\\tilde w_k$ (Eqs. 2-3). Requiring $F$ to turn the <i>subtraction</i> of
       vectors into the <i>division</i> of ratios (a group homomorphism from $(\\mathbb{R},+)$ to
       $(\\mathbb{R}_{\\gt 0},\\times)$) forces $F=\\exp$. Taking logs gives
       $w_i^\\top\\tilde w_k=\\log P_{ik}=\\log X_{ik}-\\log X_i$ (Eqs. 5-6). The $\\log X_i$ term depends only on
       $i$, so fold it into a bias $b_i$, and add $\\tilde b_k$ for symmetry &mdash; that is Eq. 7,
       $w_i^\\top\\tilde w_k+b_i+\\tilde b_k=\\log X_{ik}$. Since Eq. 7 holds only approximately, GloVe casts it as a
       <b>least-squares</b> problem and adds the weight $f$ &mdash; arriving at Eq. 8. The full
       homomorphism-and-bias steps are in Section 3 of the paper.</p>`,

    example:
      `<p><b>Worked numbers</b> for <b>one term</b> of $J$ (Eq. 8). Take a tiny $D=3$. Suppose the pair $(i,j)$
       has co-occurrence count $X_{ij}=30$, with $x_{\\max}=100$ and $\\alpha=0.75$. Let
       $w_i=[0.5,\\,{-0.2},\\,0.1]$, $\\tilde w_j=[0.3,\\,0.4,\\,{-0.1}]$, $b_i=0.2$, $\\tilde b_j=0.1$.</p>
       <ul class="steps">
         <li><b>The weight</b> $f(30)$: since $30\\lt 100$, $f=(30/100)^{0.75}=0.3^{0.75}=0.40536$.</li>
         <li><b>The dot product</b> $w_i^\\top\\tilde w_j = (0.5)(0.3)+(-0.2)(0.4)+(0.1)(-0.1)$
         $= 0.15-0.08-0.01 = 0.06$.</li>
         <li><b>The target</b> $\\log X_{ij}=\\ln 30 = 3.401197$.</li>
         <li><b>The residual</b> (inside the parentheses):
         $0.06 + 0.2 + 0.1 - 3.401197 = -3.041197$.</li>
         <li><b>Square it:</b> $(-3.041197)^2 = 9.248882$.</li>
         <li><b>This term of $J$:</b> $f(30)\\times 9.248882 = 0.40536\\times 9.248882 = 3.749127$.</li>
       </ul>
       <p>Now see how the weight $f$ scales the same squared error down for rarer pairs. Hold the residual fixed
       at $-3.041197$ (so the squared error is $9.248882$) and vary only the count $X_{ij}$:</p>
       <table class="extable">
         <caption>The weight $f(X_{ij})=(X_{ij}/100)^{0.75}$ shrinks a pair's contribution as it gets rarer (same squared error $9.248882$).</caption>
         <thead><tr><th>$X_{ij}$</th><th class="num">$f(X_{ij})$</th><th class="num">squared error</th><th class="num">term of $J$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">$100$ (cutoff)</td><td class="num">1.000000</td><td class="num">9.248882</td><td class="num">9.248882</td></tr>
           <tr><td class="row-h">$30$</td><td class="num">0.405360</td><td class="num">9.248882</td><td class="num">3.749127</td></tr>
           <tr><td class="row-h">$1$</td><td class="num">0.031623</td><td class="num">9.248882</td><td class="num">0.292468</td></tr>
         </tbody>
       </table>
       <p>The rare pair ($X_{ij}=1$, $f=(1/100)^{0.75}=0.031623$) contributes far less than the common one,
       exactly as intended &mdash; noisy rare counts cannot dominate the fit. The CODE cell recomputes the
       $X_{ij}=30$ row's exact numbers and prints them.</p>`,

    recipe:
      `<p><b>GloVe training, as numbered steps (Section 3):</b></p>
       <ol>
         <li>Scan the corpus once and build the $V\\times V$ co-occurrence matrix $X$ (weight context words by
         $1/$distance).</li>
         <li>Initialize two vector tables $W,\\tilde W$ of shape $(V,D)$ and two bias vectors $b,\\tilde b$.</li>
         <li>Collect the list of <b>nonzero</b> entries $(i,j)$ of $X$ &mdash; the only ones the loss touches.</li>
         <li>For each such entry compute the residual $r=w_i^\\top\\tilde w_j+b_i+\\tilde b_j-\\log X_{ij}$, the
         weight $f(X_{ij})$, and the gradient $g=2f(X_{ij})\\,r$.</li>
         <li>Update $w_i\\mathrel{-}= \\eta\\,g\\,\\tilde w_j$, $\\tilde w_j\\mathrel{-}= \\eta\\,g\\,w_i$,
         $b_i\\mathrel{-}= \\eta\\,g$, $\\tilde b_j\\mathrel{-}= \\eta\\,g$ (the paper uses Adagrad for the learning
         rate $\\eta$).</li>
         <li>Repeat over all entries for many epochs. The final embedding for a word is $w_i+\\tilde w_i$ (the
         paper sums the word and context vectors).</li>
       </ol>`,

    results:
      `<p>From the abstract: GloVe "produces a vector space with meaningful substructure, as evidenced by its
       performance of <b>75% on a recent word analogy task</b>. It also outperforms related models on similarity
       tasks and named entity recognition." In Table 2 (word-analogy % accuracy), the 300-dimensional GloVe trained
       on 42 billion tokens reaches <b>75.0% total</b> (81.9% semantic, 69.3% syntactic) &mdash; the best overall
       row. On a common 6-billion-token corpus, GloVe scores 71.7% total versus 69.1% for the skip-gram (SG) model
       the authors trained with the word2vec tool. (Source: <code>nlp.stanford.edu/pubs/glove.pdf</code>, abstract
       and Table 2.) We do <b>not</b> reproduce these large-corpus numbers; our CODE run is a tiny toy used only to
       show the qualitative clustering and analogy effect.</p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The paper's primary metric is <b>word-analogy accuracy</b> (% of
       "a is to b as c is to ?" questions answered correctly by nearest vector to
       $w_b-w_a+w_c$), on the standard analogy task (Table 2), split into <b>semantic</b> and <b>syntactic</b>
       subsets. Secondary metrics: word-similarity correlation and NER F1 (abstract). The "no-skill" floor is
       near-$0\\%$ on analogies (random vectors almost never put the right word first out of a large vocabulary);
       the baseline to beat is the authors' <b>skip-gram</b> model trained with word2vec, which on a 6B-token
       corpus scores <b>69.1%</b> total vs GloVe's <b>71.7%</b> (arXiv-less; <code>nlp.stanford.edu/pubs/glove.pdf</code>,
       Table 2).</p>
       <p><b>Sanity checks BEFORE the full run.</b> The build has a numeric oracle: the worked-example term of $J$
       must reproduce to the printed digits &mdash; $f(30)=0.40536$, dot $=0.06$, residual $=-3.041197$, term
       $=3.749127$. Check that the objective <b>decreases monotonically</b> (our toy run ends $J\\approx0.0016$);
       a flat or rising $J$ means the gradient sign or an update is wrong. Verify $f(0)=0$ and that the sum runs
       <i>only</i> over nonzero $X_{ij}$ (never $\\log 0$). Gradient-check one parameter by finite differences:
       perturb $w_i$ by $\\pm\\varepsilon$, confirm $(J_+-J_-)/2\\varepsilon$ matches your analytic
       $2f(X_{ij})\\,r\\,\\tilde w_j$. Confirm $X$ is symmetric for a symmetric window so $W$ and $\\tilde W$ stay
       comparable.</p>
       <p><b>Expected range.</b> On a real corpus a correct GloVe should approach the paper's <b>75.0% total</b>
       (81.9% semantic, 69.3% syntactic) for 300-d vectors on 42B tokens (approximate, Table 2) &mdash; landing
       tens of points below at that scale signals a bug (bad weighting, $\\log$ on raw counts, or local-window
       training). On the <b>tiny toy corpus</b> in the CODE there is no analogy-accuracy number to hit: the
       reproducible targets are <i>qualitative</i> &mdash; animal words cluster, people words cluster, and
       $w_{\\text{king}}-w_{\\text{man}}+w_{\\text{woman}}$ has <i>queen</i> as its nearest word (our run; exact
       neighbour orderings wobble across seeds, so treat the topic split and analogy direction, not any single
       similarity, as the pass criterion).</p>
       <p><b>Ablations &mdash; prove the key idea earns its keep.</b> The central knob is the <b>weighting function
       $f$</b> (Eq. 9): replace it with the constant $1$ (plain least squares on $\\log X$) and the fit should
       degrade &mdash; on a real corpus analogy accuracy drops because frequent pairs dominate and noisy rare
       pairs are over-weighted (the paper reports the weighted version helps). A second ablation isolates GloVe's
       <i>thesis</i> &mdash; global vs local: training must use the <b>global</b> matrix $X$ built once over the
       corpus; if you loop over sliding windows you have re-implemented skip-gram, not GloVe. Optionally ablate
       summing $w+\\tilde w$ vs using $w$ alone (the paper reports the sum gives a small boost).</p>
       <p><b>Failure signals &amp; what they mean.</b> $J$ explodes to $\\infty$/NaN: you took $\\log$ of a zero
       cell, or $f(0)\\ne0$, or AdaGrad's accumulator started at $0$ (division by zero) &mdash; seed it at $1$.
       $J$ flat / not falling: gradient sign flipped or you updated $W$ and $\\tilde W$ with each other's stale
       values. No topic clustering and analogy fails on the toy corpus: the gradient math is wrong (per
       <code>implementBoundary</code>, both effects vanish together when the update is broken). Vectors collapse
       to identical rows: learning rate far too high, or you forgot the per-word biases so every pair fits the
       same offset. Clustering appears but analogy points to a frequent word like "the": expected on a tiny
       corpus with too few tokens &mdash; not a bug, just under-trained statistics.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> There is no single library call that "is" GloVe the way
       <code>nn.BatchNorm</code> is batch-norm, so here you build the whole pipeline by hand: construct the
       co-occurrence matrix $X$ from a corpus, implement the weighting function $f$ (Eq. 9), and minimize the
       weighted least-squares objective $J$ (Eq. 8) with raw NumPy and an Adagrad update written out explicitly.
       The "oracle" for this track is twofold: (1) the worked-example numbers above are recomputed in code and must
       match to the printed digits, and (2) after training, the qualitative GloVe effect must appear &mdash; animal
       words cluster, people words cluster, and $w_{\\text{king}}-w_{\\text{man}}+w_{\\text{woman}}$ points nearest
       to <i>queen</i>. If your gradient is wrong, $J$ will not fall and neither effect appears &mdash; fix the
       math.</p>`,

    pitfalls:
      `<ul>
         <li><b>Global counts vs local windows.</b> GloVe's whole point is that it trains on the <b>global</b>
         co-occurrence matrix $X$ built once over the corpus, not on the <b>local</b> sliding windows that
         skip-gram (<code>paper-word2vec</code>) revisits one at a time. If you find yourself looping over windows
         during training, you have re-implemented skip-gram, not GloVe.</li>
         <li><b>$\\log 0$ blows up.</b> The objective only sums over nonzero $X_{ij}$. Never take $\\log$ of an
         empty cell; $f(0)=0$ is precisely the device that keeps the loss finite (Section 3.1).</li>
         <li><b>Forgetting the weight.</b> Dropping $f$ (using plain least squares on $\\log X$) lets a handful of
         very frequent pairs dominate and over-weights noisy rare pairs &mdash; the ablation below.</li>
         <li><b>Two tables, summed at the end.</b> Each word has a word vector $w$ and a context vector
         $\\tilde w$; the final embedding is their <b>sum</b> $w+\\tilde w$, not just $w$. (For a symmetric $X$ the
         two end up nearly equal up to initialization noise.)</li>
         <li><b>Reading too much into a tiny run.</b> Our corpus is a few hundred toy tokens, so exact neighbor
         orderings wobble between seeds. The reproducible facts are the <i>topic clustering</i> and the
         <i>analogy direction</i>, not any single similarity number.</li>
       </ul>`,

    recall: [
      "Write the GloVe objective $J$ (Eq. 8) from memory, naming what each of $w_i^\\top\\tilde w_j$, $b_i$, $\\tilde b_j$ and $\\log X_{ij}$ contributes.",
      "Define $X_{ij}$ and $P_{ij}$, and explain why GloVe argues meaning lives in the ratio $P_{ik}/P_{jk}$ (Table 1).",
      "State the three desiderata for $f$ (Section 3.1) and give Eq. 9 with its $x_{\\max}$ and $\\alpha$.",
      "What is the one-sentence difference between GloVe and skip-gram in terms of global vs local statistics?",
      "Why does the sum in $J$ run only over nonzero entries of $X$, and what would $\\log X_{ij}$ do otherwise?"
    ],

    practice: [
      {
        q: `Compute one term of $J$ for a pair with $X_{ij}=50$, $x_{\\max}=100$, $\\alpha=0.75$, where $w_i^\\top\\tilde w_j = 2.5$, $b_i=0.5$, $\\tilde b_j=0.5$. (Use $\\ln 50 = 3.912023$.)`,
        steps: [
          { do: `Weight: $f(50)=(50/100)^{0.75}=0.5^{0.75}=0.594604$.`, why: `$50\\lt x_{\\max}$, so use the power-law branch of Eq. 9.` },
          { do: `Residual: $2.5+0.5+0.5-3.912023=-0.412023$.`, why: `Model prediction minus the target $\\log X_{ij}$ (Eq. 8 inner term).` },
          { do: `Square: $(-0.412023)^2=0.169763$.`, why: `Least-squares penalizes the error symmetrically.` },
          { do: `Term: $0.594604\\times0.169763=0.100942$.`, why: `Scale the squared error by the weight.` }
        ],
        answer: `The term is $\\approx 0.1009$. Because the model's prediction $3.5$ is already close to $\\log 50\\approx 3.912$, the residual is small and this pair contributes little to $J$.`
      },
      {
        q: `Using Table 1's logic, the corpus gives $P(\\text{solid}\\mid\\text{ice})=1.9\\times10^{-4}$ and $P(\\text{solid}\\mid\\text{steam})=2.2\\times10^{-5}$. Why does GloVe build its model around the ratio of these rather than either probability alone?`,
        steps: [
          { do: `Ratio $=1.9\\times10^{-4} / 2.2\\times10^{-5}\\approx 8.6$ (paper rounds to 8.9).`, why: `A ratio much greater than 1 flags that 'solid' is specific to 'ice'.` },
          { do: `Compare to an irrelevant probe like 'water': its ratio is $\\approx 1.36$, near 1.`, why: `Words related to both (or neither) cancel in the ratio.` },
          { do: `Note both raw probabilities are tiny ($\\sim10^{-4}$) and hard to compare directly.`, why: `Raw magnitudes are dominated by overall word frequency, not relatedness.` }
        ],
        answer: `The ratio cancels out frequency effects and non-discriminative context words (their ratio $\\approx 1$), leaving only the signal that distinguishes 'ice' from 'steam'. That is why Eq. 1 sets the model's target to $P_{ik}/P_{jk}$, which after the homomorphism argument becomes the $\\log X_{ij}$ regression of Eq. 7.`
      },
      {
        q: `Ablation: in the CODE, replace the weighting $f(X_{ij})$ with the constant $1$ (plain, unweighted least squares on $\\log X$). What should you expect to change, and what should stay the same?`,
        steps: [
          { do: `Set f to return 1.0 for every count and retrain on the same $X$.`, why: `Removes GloVe's down-weighting of rare and very frequent pairs (Eq. 9 → constant).` },
          { do: `Watch the rare/noisy pairs (small $X_{ij}$): they now contribute as much as frequent ones.`, why: `Property 2 of $f$ (non-decreasing, small for rare) is what protected against this.` },
          { do: `Re-check the topic clustering and the analogy.`, why: `See whether the qualitative effect survives the change.` }
        ],
        answer: `With $f\\equiv 1$, every nonzero pair counts equally, so a few very frequent pairs and many noisy rare pairs both pull harder on the fit; on a real corpus this degrades the vectors (the paper reports the weighted version helps). On our tiny clean toy corpus the clustering and analogy usually still appear, but the loss landscape is worse-conditioned and the result is more seed-sensitive — illustrating exactly why GloVe introduced $f$.`
      }
    ]
  });

  window.CODE["paper-glove"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `Build GloVe from scratch in raw NumPy: (1) scan a tiny two-topic corpus and build the word-word ` +
      `co-occurrence matrix X with 1/distance weighting; (2) recompute the worked example (one term of J) and ` +
      `check it matches; (3) minimize the weighted least-squares objective J (Eq. 8) over the nonzero entries of ` +
      `X with an explicit Adagrad update and the f weighting (Eq. 9, xmax=100->scaled, alpha=3/4); (4) keep ` +
      `w + w_tilde as the embeddings and print nearest neighbors and the king-man+woman analogy. Runs in Colab ` +
      `(NumPy preinstalled).`,
    code: `import numpy as np
import math

# ---- recompute the WORKED EXAMPLE: one term of J (Eq. 8) ----
def f(x, xmax, alpha):                       # Eq. 9 weighting function
    return (x / xmax) ** alpha if x < xmax else 1.0
wi  = np.array([0.5, -0.2, 0.1]); wj = np.array([0.3, 0.4, -0.1])
bi, bj, X_ij = 0.2, 0.1, 30.0
w  = f(X_ij, 100.0, 0.75)                     # 0.405360
dot = wi @ wj                                 # 0.06
res = dot + bi + bj - math.log(X_ij)          # -3.041197
term = w * res ** 2                           # 3.749127
print("f(30)      :", round(w, 6))            # 0.40536
print("dot        :", round(dot, 6))          # 0.06
print("log X      :", round(math.log(X_ij), 6))  # 3.401197
print("residual   :", round(res, 6))          # -3.041197
print("term of J  :", round(term, 6))         # 3.749127

# ---- build the GLOBAL co-occurrence matrix X from a tiny two-topic corpus ----
roy = ['king','queen','prince','princess','man','woman','boy','girl']
ani = ['cat','dog','kitten','puppy']
rng = np.random.default_rng(42)
sents  = [list(rng.choice(roy, size=5, replace=True)) for _ in range(40)]
sents += [list(rng.choice(ani, size=4, replace=True)) for _ in range(30)]
vocab = sorted(set(w for s in sents for w in s)); stoi = {w: i for i, w in enumerate(vocab)}
V = len(vocab)
X = np.zeros((V, V))
for s in sents:                               # ONE global matrix, not per-window training
    for a in range(len(s)):
        for b in range(len(s)):
            if a != b:
                X[stoi[s[a]], stoi[s[b]]] += 1.0 / abs(a - b)   # 1/distance weighting
print("V =", V, " nonzero entries =", int((X > 0).sum()))

# ---- minimize the GloVe objective J (Eq. 8) with explicit Adagrad ----
D, xmax, alpha, lr = 16, 30.0, 0.75, 0.05
r = np.random.default_rng(7)
W  = r.standard_normal((V, D)) * 0.1; Wt = r.standard_normal((V, D)) * 0.1
b  = np.zeros(V); bt = np.zeros(V)
gW = np.ones_like(W); gWt = np.ones_like(Wt); gb = np.ones_like(b); gbt = np.ones_like(bt)
nz = np.argwhere(X > 0)                        # only the populated cells contribute
def fw(x): return np.where(x < xmax, (x / xmax) ** alpha, 1.0)
for epoch in range(250):
    r.shuffle(nz); J = 0.0
    for i, j in nz:
        xij = X[i, j]
        res = W[i] @ Wt[j] + b[i] + bt[j] - np.log(xij)   # Eq. 7 residual
        wt  = fw(xij)                                       # Eq. 9 weight
        J  += wt * res ** 2                                 # Eq. 8 term
        g   = 2 * wt * res                                  # dJ/d(residual)
        gwi, gwj = g * Wt[j], g * W[i]
        W[i]  -= lr / np.sqrt(gW[i])  * gwi; gW[i]  += gwi ** 2   # Adagrad
        Wt[j] -= lr / np.sqrt(gWt[j]) * gwj; gWt[j] += gwj ** 2
        b[i]  -= lr / np.sqrt(gb[i])  * g;   gb[i]  += g ** 2
        bt[j] -= lr / np.sqrt(gbt[j]) * g;   gbt[j] += g ** 2
print("final J    :", round(J, 4))             # ~0.0016

# ---- keep w + w_tilde as the embeddings; nearest neighbors + analogy ----
E  = W + Wt
En = E / np.linalg.norm(E, axis=1, keepdims=True)
sim = En @ En.T
def neighbors(word, k=3):
    i = stoi[word]; s = sim[i].copy(); s[i] = -9
    return [vocab[t] for t in np.argsort(-s)[:k]]
for word in ['king', 'cat', 'man', 'dog']:
    print(f"nearest to {word:5s}:", neighbors(word))
# -> cat: ['kitten','dog','puppy']   king: ['man','boy','queen']

v = En[stoi['king']] - En[stoi['man']] + En[stoi['woman']]   # the analogy direction
v = v / np.linalg.norm(v)
s = En @ v
for w in ['king', 'man', 'woman']: s[stoi[w]] = -9            # exclude the inputs
print("king - man + woman ->", [vocab[t] for t in np.argsort(-s)[:3]])
# -> ['queen', 'boy', 'prince']`
  };

  window.CODEVIZ["paper-glove"] = {
    question: "Fit GloVe to a global co-occurrence matrix built from a tiny corpus that mixes royalty/people words and animal words — do the learned vectors cluster by topic (and support the king-man+woman analogy) without ever being told the topics?",
    charts: [
      {
        type: "scatter",
        title: "Learned GloVe embeddings (w + w-tilde), projected to 2D (PCA) and labeled by word",
        xlabel: "PCA component 1",
        ylabel: "PCA component 2",
        series: [
          {
            name: "Animals",
            color: "#7ee787",
            points: [
              { x: -1.685, y: -0.171, label: "cat" },
              { x: -2.000, y: -0.112, label: "dog" },
              { x: -1.749, y: -0.208, label: "kitten" },
              { x: -1.517, y: -0.366, label: "puppy" }
            ]
          },
          {
            name: "Royalty / people",
            color: "#79c0ff",
            points: [
              { x: 1.369, y: -1.241, label: "king" },
              { x: 0.991, y: 0.115, label: "queen" },
              { x: 0.879, y: 0.078, label: "prince" },
              { x: 0.425, y: 1.397, label: "princess" },
              { x: 1.093, y: -0.638, label: "man" },
              { x: 0.760, y: 0.564, label: "woman" },
              { x: 1.327, y: -0.249, label: "boy" },
              { x: 0.108, y: 0.832, label: "girl" }
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (NumPy, seeds 42/7), not the paper's reported numbers. We built a 12x12 global co-occurrence matrix X from ~70 toy sentences, then minimized GloVe's weighted least-squares objective J (Eq. 8) over the 80 nonzero entries with Adagrad, kept w + w-tilde as the embeddings, centered them and projected to 2D with PCA. The four animal words (green) collapse to a tight cluster on the left (PCA-1 between -1.5 and -2.0); the royalty/people words (blue) sit on the right. Nearest-neighbor checks agree completely — every animal's top-3 neighbors are animals, every people word's are people — and the analogy king - man + woman points nearest to 'queen'. The model was never told the topics; structure emerges only from global co-occurrence counts. (Exact positions are noisy on so few tokens; the topic split and the analogy direction are the reproducible effects, mirroring the paper's qualitative result.)",
    code: `import numpy as np
roy = ['king','queen','prince','princess','man','woman','boy','girl']
ani = ['cat','dog','kitten','puppy']
rng = np.random.default_rng(42)
sents  = [list(rng.choice(roy, size=5, replace=True)) for _ in range(40)]
sents += [list(rng.choice(ani, size=4, replace=True)) for _ in range(30)]
vocab = sorted(set(w for s in sents for w in s)); stoi = {w: i for i, w in enumerate(vocab)}; V = len(vocab)
X = np.zeros((V, V))
for s in sents:
    for a in range(len(s)):
        for b in range(len(s)):
            if a != b: X[stoi[s[a]], stoi[s[b]]] += 1.0 / abs(a - b)

D, xmax, alpha, lr = 16, 30.0, 0.75, 0.05
r = np.random.default_rng(7)
W  = r.standard_normal((V, D)) * 0.1; Wt = r.standard_normal((V, D)) * 0.1
b  = np.zeros(V); bt = np.zeros(V)
gW = np.ones_like(W); gWt = np.ones_like(Wt); gb = np.ones_like(b); gbt = np.ones_like(bt)
nz = np.argwhere(X > 0)
fw = lambda x: np.where(x < xmax, (x / xmax) ** alpha, 1.0)
for epoch in range(250):
    r.shuffle(nz)
    for i, j in nz:
        xij = X[i, j]
        res = W[i] @ Wt[j] + b[i] + bt[j] - np.log(xij); wt = fw(xij); g = 2 * wt * res
        gwi, gwj = g * Wt[j], g * W[i]
        W[i]  -= lr / np.sqrt(gW[i])  * gwi; gW[i]  += gwi ** 2
        Wt[j] -= lr / np.sqrt(gWt[j]) * gwj; gWt[j] += gwj ** 2
        b[i]  -= lr / np.sqrt(gb[i])  * g;   gb[i]  += g ** 2
        bt[j] -= lr / np.sqrt(gbt[j]) * g;   gbt[j] += g ** 2

E  = W + Wt                                    # GloVe sums the two vector sets
Ec = E - E.mean(0)                             # center, then PCA via SVD
U, S, Vt = np.linalg.svd(Ec, full_matrices=False)
P  = Ec @ Vt[:2].T
P  = P / np.abs(P).max() * 2.0                 # scale to a readable range
for w in vocab:
    x, y = P[stoi[w]]
    print(f"{w:9s} {x:6.3f} {y:6.3f}")          # the labeled coordinates plotted above`
  };
})();
