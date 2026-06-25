/* Paper lesson — word2vec / skip-gram (Mikolov et al., 2013).
   Grounded from arXiv:1301.3781 (abstract + ar5iv HTML, Section 3.2, Eq. 5).
   NOTE: 1301.3781 introduces the skip-gram ARCHITECTURE + complexity (Eq.5) and the analogy
   result (king-man+woman~queen, intro). The explicit softmax probability p(w_O|w_I) is written
   out in the companion paper "Distributed Representations" (arXiv:1310.4546, Eq.2); we attribute
   it there and recap the math from the dl-word2vec concept lesson — not invented here.
   Track A (primitive): build skip-gram + full-softmax objective from raw tensors; verify the loss
   equals F.cross_entropy with torch.allclose; train on a tiny corpus; show nearest-neighbor words. */
(function () {
  window.LESSONS.push({
    id: "paper-word2vec",
    title: "word2vec — Efficient Estimation of Word Representations in Vector Space (2013)",
    tagline: "Learn a dense vector for each word by predicting its neighbors — cheaply enough to train on billions of words.",
    module: "Papers · Sequence & NLP",
    track: "primitive",

    paper: {
      authors: "Tomas Mikolov, Kai Chen, Greg Corrado, Jeffrey Dean",
      org: "Google",
      year: 2013,
      venue: "arXiv preprint (arXiv:1301.3781); ICLR 2013 Workshop",
      citations: "",
      arxiv: "https://arxiv.org/abs/1301.3781",
      code: "https://code.google.com/archive/p/word2vec/"
    },

    conceptLink: "dl-word2vec",
    partOf: [
      { capstone: "capstone-mini-gpt", step: 1, builds: "the embedding table — words as learnable vectors" },
      { capstone: "capstone-sentiment", step: 1, builds: "pretrained-style word vectors as features" }
    ],
    prereqs: ["dl-word2vec", "dl-word-embeddings", "ml-logistic-regression", "pt-autograd", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A computer cannot do arithmetic on the letters of a word. Before this paper the
       common trick was <b>one-hot encoding</b>: give each of the $V$ words in the vocabulary its own slot, and
       represent a word as a vector that is $1$ in its slot and $0$ everywhere else. ("Vocabulary" = the set of
       distinct words; $V$ is how many there are, often hundreds of thousands.)</p>
       <p>One-hot vectors are <b>huge</b> (length $V$) and <b>tell you nothing about meaning</b>: "cat" and "dog"
       are just as far apart as "cat" and "Tuesday" &mdash; every pair of distinct words is exactly equally
       dissimilar. Earlier <b>neural network language models</b> (NNLMs) could learn smaller, meaningful word
       vectors, but they had a costly hidden layer and were too slow to train on really large text. The paper's
       question (Section 1): can we learn high-quality word vectors from <i>billions</i> of words at low cost?</p>`,

    contribution:
      `<p>The paper introduces <b>two cheap log-linear models</b> for learning word vectors (Section 3):</p>
       <ul>
         <li><b>Continuous Bag-of-Words (CBOW)</b> &mdash; predict the current (center) word from the average of
         its surrounding context words (Section 3.1).</li>
         <li><b>Skip-gram</b> &mdash; the reverse: from the current word, predict the surrounding context words
         (Section 3.2). This is the variant we build here.</li>
         <li><b>Removing the expensive hidden layer.</b> Both models drop the nonlinear hidden layer of older
         NNLMs, leaving essentially a lookup-table embedding plus a softmax classifier. That is what makes them
         fast enough to scale to billions of words.</li>
       </ul>
       <p>A striking by-product, highlighted in the introduction: the learned vectors support <b>analogy
       arithmetic</b> &mdash; quoting the paper, "vector(\\"King\\") - vector(\\"Man\\") + vector(\\"Woman\\")
       results in a vector that is closest to the vector representation of the word Queen."</p>`,

    whyItMattered:
      `<p>word2vec made dense word vectors a <b>standard first layer</b> for nearly all natural-language
       processing in the mid-2010s: you could train embeddings on a giant unlabeled corpus once, then reuse them
       as input features for sentiment analysis, translation, search, and more. The skip-gram embedding table is
       the direct ancestor of the token-embedding layer at the bottom of every modern Transformer and large
       language model &mdash; including the mini-GPT capstone in this course. The analogy result also reframed
       what "meaning" could look like to a machine: <b>directions in vector space</b> that encode relationships
       like gender or plurality.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 1 (Introduction)</b> &mdash; the problem with one-hot vectors and the famous
         King&minus;Man+Woman&asymp;Queen example.</li>
         <li><b>Section 3.2 (Continuous Skip-gram Model)</b> &mdash; the architecture we implement: use each
         current word to predict the words in a window before and after it.</li>
         <li><b>Equation 5</b> &mdash; the training complexity of skip-gram, $Q = C\\times(D + D\\log_2 V)$, which
         shows why dropping the hidden layer and using a log-time output (hierarchical softmax) makes it cheap.</li>
       </ul>
       <p><b>Skim:</b> Section 3.1 (CBOW) for the contrast, Section 4 (the analogy/similarity test set) and
       Section 5 (results tables) for the qualitative outcome. You do not need to memorize the benchmark numbers.</p>
       <p><b>Read alongside:</b> the explicit softmax objective (next section) is written out in the companion
       paper <i>Distributed Representations of Words and Phrases</i> (arXiv:1310.4546, Eq. 2); this 2013 paper
       describes skip-gram in words and gives its complexity.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We will train skip-gram on a tiny made-up corpus that mixes two topics &mdash;
       royalty words (king, queen, prince, princess, man, woman, boy, girl) and animal words (cat, dog, kitten,
       puppy) &mdash; that mostly appear next to words from their own topic. After training, we ask for each
       word's <b>nearest neighbors</b> by cosine similarity. Will "cat" land nearest the other animals, and "king"
       nearest the other royalty/people words, even though we never told the model which topic any word belongs
       to? Write your guess, then look at the CODEVIZ scatter.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write the skip-gram <b>full-softmax loss</b> for a batch of
       (center, context) word-index pairs, using two raw embedding tables and no <code>nn.Embedding</code> /
       <code>F.cross_entropy</code>:</p>
       <ul>
         <li>Keep two tables of shape <code>(V, D)</code>: <code>V_in</code> (the center/input vectors $e_c$) and
         <code>V_out</code> (the context/output vectors $\\theta_w$). <code># TODO: requires_grad=True on both</code></li>
         <li>Look up the center vectors: <code># TODO: e_c = V_in[center]   # (B, D)</code></li>
         <li>Score every vocabulary word against each center: <code># TODO: scores = e_c @ V_out.T  # (B, V)</code></li>
         <li>Turn scores into the negative log-likelihood of the true context word. Use the numerically stable
         <code>torch.logsumexp</code> for the denominator:
         <code># TODO: loss = (logsumexp(scores,1) - scores[range(B), context]).mean()</code></li>
       </ul>
       <p>The CODE cell is the full reference, including the <code>torch.allclose</code> check that this equals
       PyTorch's <code>F.cross_entropy</code> &mdash; that passing check is the proof your objective is exactly the
       softmax cross-entropy.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Skip-gram learns <b>one vector per word</b> by playing a prediction game over a sliding window. Each word
       actually gets <b>two</b> vectors during training: an <b>input</b> vector $e_c$ used when the word is the
       center, and an <b>output</b> vector $\\theta_w$ used when the word is a context target. (After training we
       keep the input table as "the" embeddings.) The steps:</p>
       <ol>
         <li><b>Slide a window.</b> Walk through the text. At each position take the current word as the
         <b>center</b> word $c$, and the words within a small window (say 2 on each side) as its <b>context</b>
         words. The paper picks the window size randomly up to a maximum $C$ (Section 3.2), which gently weights
         closer words more.</li>
         <li><b>Score.</b> For the center $c$ and a candidate target word $t$, the model's score is the
         <b>dot product</b> $\\theta_t^\\top e_c$ &mdash; large when the two vectors point the same way.</li>
         <li><b>Softmax.</b> Turn the scores for all $V$ words into probabilities by exponentiating and dividing
         by the total. The probability of the true context word should be high.</li>
         <li><b>Train.</b> Maximize the probability of the words that really appear in the window. By gradient
         descent this pushes a center word's vector toward the output vectors of the words it co-occurs with &mdash;
         so words that share neighbors end up with similar vectors.</li>
       </ol>
       <p>The $V$-way softmax is expensive when $V$ is huge, so the paper uses a <b>hierarchical softmax</b> over a
       Huffman tree (Section 2.1), cutting the output cost from $V$ to about $\\log_2 V$. We use the plain softmax
       in code because our toy vocabulary is tiny, and verify it against PyTorch's cross-entropy.</p>`,

    symbols: [
      { sym: "$V$", desc: "vocabulary size: the number of distinct words. The softmax has one term per word, so it runs over all $V$." },
      { sym: "$D$", desc: "embedding dimension: how many numbers are in each word's vector (e.g. 100-300 in the paper; 8 in our toy run)." },
      { sym: "$C$", desc: "the maximum window size: the farthest a context word can be from the center. The paper uses $C=10$ (Section 3.2)." },
      { sym: "$c$", desc: "the center (current) word — the one we look out from to predict its neighbors." },
      { sym: "$t$ (or $w_O$)", desc: "a target/context word: a word actually sitting in the window around the center. $w_O$ = 'output word'." },
      { sym: "$w_I$", desc: "the input word — another name for the center word $c$ (the model's input)." },
      { sym: "$e_c$ (or $v_{w_I}$)", desc: "the input/center vector: the embedding of the center word, read from the input table. This is what we keep as the word's final vector." },
      { sym: "$\\theta_t$ (or $v'_{w_O}$)", desc: "the output/context vector for word $t$, read from a separate output table; used only to score targets during training (Greek 'theta')." },
      { sym: "$\\theta_t^\\top e_c$", desc: "the dot product (sum of element-wise products) of the two vectors — the raw score of target $t$ given center $c$. High when the vectors agree." },
      { sym: "$\\exp$", desc: "the exponential function $e^{(\\cdot)}$, which turns any real score into a positive number so it can act like an unnormalized probability." },
      { sym: "$j$", desc: "an index running over every word in the vocabulary; the denominator sum adds one $\\exp(\\text{score})$ term per word $j$." },
      { sym: "$p(w_O \\mid w_I)$", desc: "the model's probability of seeing context word $w_O$ given center word $w_I$ (the bar means 'given'). The thing skip-gram tries to make large for true neighbors." },
      { sym: "$Q$", desc: "the per-training-example computational cost (number of operations); Eq. 5 gives it for skip-gram." }
    ],

    formula:
      `$$p(w_O \\mid w_I) \\;=\\; \\frac{\\exp\\!\\big(\\theta_{w_O}^{\\top}\\, e_{w_I}\\big)}
        {\\sum_{j=1}^{V} \\exp\\!\\big(\\theta_{j}^{\\top}\\, e_{w_I}\\big)}
        \\qquad\\text{(softmax objective)}$$
       $$Q \\;=\\; C \\times \\big(D + D\\log_2 V\\big)\\qquad\\text{(skip-gram complexity, Eq. 5)}$$`,

    whatItDoes:
      `<p>The <b>top</b> equation is the skip-gram training objective: it scores the true context word $w_O$ by the
       dot product $\\theta_{w_O}^\\top e_{w_I}$ (top), and divides by the same exponentiated score summed over
       <i>all</i> $V$ words (bottom), giving a probability between 0 and 1 that adds to 1 across the vocabulary.
       Training maximizes this for the words that really appear in the window. (The 1301.3781 paper describes this
       in words in Section 3.2; the explicit formula is Eq. 2 of the companion arXiv:1310.4546.)</p>
       <p>The <b>bottom</b> equation, <b>Eq. 5</b> of the paper, is the cost $Q$ of one training example: $C$
       context predictions, each costing a $D$-dimensional lookup plus a $D\\log_2 V$ output evaluation (the
       $\\log_2 V$ comes from the hierarchical softmax). The point is that there is <i>no</i> $V$ or hidden-layer
       term &mdash; that is why it scales.</p>`,

    derivation:
      `<p>The full math of the softmax and why maximizing log-likelihood pulls co-occurring words together is
       derived in the <code>dl-word2vec</code> concept lesson. Short recap: exponentiating makes every score
       positive, and dividing by the sum forces the $V$ probabilities to add to 1, so the expression is a valid
       probability distribution over the next word. The negative log of that probability is exactly the
       <b>cross-entropy</b> loss between the model's distribution and a one-hot "the answer is $w_O$" target &mdash;
       which is why our hand-written loss matches <code>F.cross_entropy</code> in the CODE. See the concept lesson
       for the gradient.</p>`,

    example:
      `<p><b>Worked numbers</b> for one (center, target) pair with a tiny $D=2$, $V=3$ vocabulary
       (words $0,1,2$). Center vector $e_c = [1,\\,2]$; output vectors
       $\\theta_0=[1,0]$, $\\theta_1=[0.5,1]$, $\\theta_2=[-1,1]$. The true target is word $1$.</p>
       <ul>
         <li><b>Scores</b> $\\theta_j^\\top e_c$:
         $\\theta_0^\\top e_c = 1\\cdot1 + 0\\cdot2 = 1$;
         $\\theta_1^\\top e_c = 0.5\\cdot1 + 1\\cdot2 = 2.5$;
         $\\theta_2^\\top e_c = -1\\cdot1 + 1\\cdot2 = 1$. Scores $=[1,\\,2.5,\\,1]$.</li>
         <li><b>Exponentiate:</b> $[e^{1},\\,e^{2.5},\\,e^{1}]=[2.71828,\\,12.18249,\\,2.71828]$.</li>
         <li><b>Denominator</b> $\\sum_j$: $2.71828+12.18249+2.71828 = 17.61906$.</li>
         <li><b>Softmax probabilities:</b> $[2.71828,\\,12.18249,\\,2.71828]/17.61906 =
         [0.15428,\\,0.69144,\\,0.15428]$ (they sum to $1$).</li>
         <li><b>Loss</b> for true target $1$: $-\\ln(0.69144) = 0.36898$.</li>
       </ul>
       <p>The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>Skip-gram training, as numbered steps (Section 3.2):</b></p>
       <ol>
         <li>Initialize two embedding tables of shape $(V, D)$: input vectors $e$ and output vectors $\\theta$.</li>
         <li>Slide a window over the corpus; for each center word emit one (center, context) pair per word in its
         window (window size sampled up to $C$).</li>
         <li>For a batch of pairs, look up the center vectors $e_c$ and score every vocabulary word:
         $\\text{scores} = e_c\\,\\theta^\\top$.</li>
         <li>Compute the softmax negative log-likelihood of the true context words
         (use $\\log\\sum\\exp$ for stability).</li>
         <li>Backpropagate and update both tables with an optimizer (we use Adam).</li>
         <li>Keep the input table $e$ as the final word vectors; measure word similarity by cosine similarity.</li>
       </ol>`,

    results:
      `<p>From the abstract: the new architectures give "large improvements in accuracy at much lower computational
       cost," learning "high quality word vectors from a 1.6 billion words data set" in "less than a day," and
       reaching "state of the art performance ... for measuring syntactic and semantic word similarities." The
       analogy result (Section 1) is the well-known
       vector(\\"King\\")&minus;vector(\\"Man\\")+vector(\\"Woman\\")&asymp;vector(\\"Queen\\"). (Source:
       arXiv:1301.3781 abstract and Section 1.) Specific benchmark percentages are in the paper's Section 5 tables;
       we do not quote them from memory.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships embeddings as <code>nn.Embedding</code> and the softmax loss as
       <code>F.cross_entropy</code> in one line each. Here you <b>build skip-gram from scratch</b>: two raw
       embedding tensors with <code>requires_grad=True</code>, a hand-written dot-product score over the whole
       vocabulary, and the $\\log\\sum\\exp$ negative log-likelihood. The payoff is the
       <code>torch.allclose(my_loss, F.cross_entropy(scores, context))</code> check &mdash; if it passes, your
       objective <i>is</i> the softmax cross-entropy. Then we train it on a toy corpus and read off nearest
       neighbors and an embedding scatter, reproducing the paper's qualitative clustering effect.</p>`,

    pitfalls:
      `<ul>
         <li><b>Two tables, not one.</b> Skip-gram uses a separate input table ($e$) and output table ($\\theta$).
         Tying them to a single table still trains but is a different model; keep them separate to match the paper,
         and remember the <i>input</i> table is the one you keep.</li>
         <li><b>Naive softmax over a real vocabulary.</b> Our toy $V$ is small, so a full softmax is fine. On a real
         vocabulary the $\\sum_{j=1}^{V}$ denominator is the bottleneck &mdash; that is exactly why the paper uses
         hierarchical softmax (and the companion paper, negative sampling).</li>
         <li><b>Numerical overflow.</b> Computing $\\exp(\\text{score})$ directly can overflow. Use
         <code>torch.logsumexp</code> (as in the CODE), which subtracts the max internally.</li>
         <li><b>Self-prediction.</b> When building window pairs, skip the center word itself ($j \\neq i$); a word
         is not its own context.</li>
         <li><b>Reading too much into a tiny run.</b> Our corpus has a few dozen tokens, so the exact neighbor
         ordering is noisy. The <i>clustering</i> (animals together, royalty together) is the real, reproducible
         effect &mdash; not any single similarity number.</li>
       </ul>`,

    recall: [
      "Write the skip-gram softmax objective $p(w_O\\mid w_I)$ from memory, including what the denominator sums over.",
      "What are the two vectors each word has during training, and which one do you keep?",
      "Why is the full softmax expensive, and what did the paper use instead (Section 2.1)?",
      "State Eq. 5, the skip-gram complexity, and say why there is no $V$ term in it.",
      "Explain why the negative-log of the softmax equals cross-entropy against a one-hot target."
    ],

    practice: [
      {
        q: `Compute the skip-gram softmax for center $e_c=[2,1]$ with output vectors $\\theta_0=[1,0]$, $\\theta_1=[0,2]$, $\\theta_2=[1,1]$, and give the loss if the true target is word $2$.`,
        steps: [
          { do: `Scores: $\\theta_0^\\top e_c=2$, $\\theta_1^\\top e_c=2$, $\\theta_2^\\top e_c=3$.`, why: `Dot product = the raw score per word.` },
          { do: `Exponentiate: $[e^2,e^2,e^3]=[7.389,7.389,20.086]$; sum $=34.864$.`, why: `Numerator candidates and the softmax denominator.` },
          { do: `Probabilities: $[0.2119,0.2119,0.5762]$ (sum 1).`, why: `Divide each by the total.` },
          { do: `Loss for target 2: $-\\ln(0.5762)=0.5514$.`, why: `Negative log-likelihood of the true context word.` }
        ],
        answer: `Probabilities $\\approx[0.212,0.212,0.576]$; loss $\\approx 0.551$. Word 2 has the highest dot product with $e_c$, so it gets the most probability and the smallest loss.`
      },
      {
        q: `Using Eq. 5, $Q=C(D+D\\log_2 V)$, compare the per-example cost for $C=10,\\ D=300$ at $V=1000$ vs $V=1{,}000{,}000$. Why does the model still scale?`,
        steps: [
          { do: `$\\log_2 1000\\approx 9.97$, so $Q=10(300+300\\cdot9.97)\\approx 10\\cdot3290=32{,}900$.`, why: `Plug in the small vocabulary.` },
          { do: `$\\log_2 10^6\\approx 19.93$, so $Q=10(300+300\\cdot19.93)\\approx 10\\cdot6280=62{,}800$.`, why: `A 1000x bigger vocabulary.` },
          { do: `Cost roughly doubles, not 1000x.`, why: `The output term grows like $\\log_2 V$, not $V$.` }
        ],
        answer: `A thousand-fold larger vocabulary only about doubles the cost, because the hierarchical-softmax output term is $D\\log_2 V$. A plain softmax would have a $D\\cdot V$ term and blow up linearly with $V$ — that is the whole point of Eq. 5.`
      },
      {
        q: `Ablation: in the CODE, replace the two separate tables (input $e$ and output $\\theta$) with a single shared table used for both center and context. What changes, and what should stay the same?`,
        steps: [
          { do: `Set V_out = V_in (one tensor) and retrain on the same corpus.`, why: `Ties each word's input and output vector together.` },
          { do: `Re-check the torch.allclose oracle.`, why: `It only tests the loss formula, not the table structure, so it should still pass.` },
          { do: `Re-read the nearest neighbors / scatter.`, why: `See whether the topic clusters survive.` }
        ],
        answer: `The allclose check still passes — it verifies the softmax-cross-entropy loss, which does not care whether the tables are shared. The clustering usually still appears on this toy data, but a shared table is a different (more constrained) model than the paper's skip-gram; with one table a word's dot product with itself is its squared norm, which can distort similarities. Keeping the tables separate matches Section 3.2.`
      }
    ]
  });

  window.CODE["paper-word2vec"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build skip-gram from scratch: two raw embedding tensors (input e and output theta), a hand-written ` +
      `dot-product score over the whole vocabulary, and the logsumexp negative-log-likelihood objective. Prove ` +
      `the loss equals PyTorch's F.cross_entropy with torch.allclose, recompute the worked [1,2.5,1] example, ` +
      `then train on a tiny two-topic corpus and print nearest-neighbor words. Runs in Colab (torch preinstalled).`,
    code: `import torch, torch.nn.functional as F
torch.manual_seed(0)

class MySkipGram:
    """Skip-gram with full softmax — raw tensors, autograd on.
       V_in[w]  = input/center vector  e_c  (kept as the word's final embedding)
       V_out[w] = output/context vector theta_w (used only to score targets)."""
    def __init__(self, vocab, dim, scale=0.1):
        self.V_in  = (torch.randn(vocab, dim) * scale).requires_grad_(True)
        self.V_out = (torch.randn(vocab, dim) * scale).requires_grad_(True)

    def loss(self, center, context):
        e_c    = self.V_in[center]                       # (B, D) center vectors
        scores = e_c @ self.V_out.t()                    # (B, V) theta_j . e_c for every word j
        logZ   = torch.logsumexp(scores, dim=1)          # (B,) log softmax denominator (stable)
        gold   = scores[torch.arange(len(center)), context]   # (B,) numerator score of true target
        return (logZ - gold).mean()                      # mean negative log-likelihood

# ---- THE ORACLE: my hand-rolled loss must equal F.cross_entropy on the same scores ----
V, D = 6, 4
m = MySkipGram(V, D)
center  = torch.tensor([0, 2, 4])
context = torch.tensor([1, 3, 5])
mine = m.loss(center, context)
with torch.no_grad():
    scores = m.V_in[center] @ m.V_out.t()
ref = F.cross_entropy(scores, context)                  # PyTorch's softmax + NLL in one call
print("my skip-gram loss :", round(mine.item(), 6))     # 1.796847
print("F.cross_entropy   :", round(ref.item(), 6))      # 1.796847
print("allclose          :", torch.allclose(mine, ref, atol=1e-6))   # True

# ---- recompute the WORKED EXAMPLE: e_c=[1,2], thetas=[[1,0],[0.5,1],[-1,1]], target=1 ----
e_c    = torch.tensor([1.0, 2.0])
thetas = torch.tensor([[1.0, 0.0], [0.5, 1.0], [-1.0, 1.0]])
sc     = thetas @ e_c
probs  = torch.softmax(sc, dim=0)
print("worked scores     :", sc.tolist())               # [1.0, 2.5, 1.0]
print("worked softmax    :", [round(p, 6) for p in probs.tolist()])  # [0.154281, 0.691438, 0.154281]
print("worked loss(t=1)  :", round(-torch.log(probs[1]).item(), 6))  # 0.368981

# ---- train on a tiny two-topic corpus, then nearest neighbors ----
torch.manual_seed(1)
corpus = ("king queen man woman king queen prince princess man woman boy girl "
          "king prince man boy queen princess woman girl cat dog cat dog kitten puppy "
          "cat kitten dog puppy king queen prince princess").split()
vocab = sorted(set(corpus)); stoi = {w: i for i, w in enumerate(vocab)}
V = len(vocab)
pairs = []                                               # window = 2 on each side
for i, w in enumerate(corpus):
    for j in range(max(0, i - 2), min(len(corpus), i + 3)):
        if j != i:                                       # a word is not its own context
            pairs.append((stoi[w], stoi[corpus[j]]))
ctr = torch.tensor([a for a, _ in pairs]); ctx = torch.tensor([b for _, b in pairs])

sg  = MySkipGram(V, 8)
opt = torch.optim.Adam([sg.V_in, sg.V_out], lr=0.05)
for epoch in range(300):
    opt.zero_grad()
    L = sg.loss(ctr, ctx)
    L.backward(); opt.step()
print("final train loss  :", round(L.item(), 4))         # ~1.73

E  = sg.V_in.detach()                                     # keep the INPUT table as the embeddings
En = E / E.norm(dim=1, keepdim=True)
sim = En @ En.t()                                         # cosine similarity (rows normalized)
def neighbors(w, k=3):
    i = stoi[w]; s = sim[i].clone(); s[i] = -9            # exclude the word itself
    return [vocab[t] for t in s.topk(k).indices.tolist()]
for w in ["king", "cat", "man"]:
    print(f"nearest to {w:6s}:", neighbors(w))
# e.g. -> cat: ['dog','kitten','puppy']  king: ['princess','queen','boy']`
  };

  window.CODEVIZ["paper-word2vec"] = {
    question: "Train skip-gram on a tiny corpus that mixes royalty/people words and animal words — do the learned embeddings cluster by topic without ever being told the topics?",
    charts: [
      {
        type: "scatter",
        title: "Learned skip-gram embeddings, projected to 2D (PCA) and labeled by word",
        xlabel: "PCA component 1",
        ylabel: "PCA component 2",
        series: [
          {
            name: "Animals",
            color: "#7ee787",
            points: [
              { x: 0.895, y: 0.744, label: "cat" },
              { x: 1.333, y: 0.643, label: "dog" },
              { x: 1.542, y: 0.608, label: "kitten" },
              { x: 1.384, y: -0.625, label: "puppy" }
            ]
          },
          {
            name: "Royalty / people",
            color: "#79c0ff",
            points: [
              { x: -0.404, y: 1.075, label: "king" },
              { x: -0.675, y: -0.563, label: "queen" },
              { x: -1.476, y: 0.033, label: "prince" },
              { x: -1.166, y: 0.927, label: "princess" },
              { x: -0.547, y: -2.0, label: "man" },
              { x: -0.885, y: 0.285, label: "woman" },
              { x: -0.749, y: 0.273, label: "boy" },
              { x: 0.748, y: -1.4, label: "girl" }
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seeds 0/1), not the paper's reported numbers. We trained skip-gram from scratch on ~50 toy tokens for 400 steps, kept the input embedding table, centered it and projected to 2D with PCA. The four animal words (green) land together on the right; the royalty/people words (blue) spread across the left. Nearest-neighbor checks agree — 'cat' -> kitten/dog and 'dog' -> kitten/puppy/cat. The model was never told which words are animals; clustering emerges only from which words share neighbors in the text. (Exact positions are noisy on so few tokens — the topic split is the reproducible effect, reproducing the paper's qualitative similarity result.)",
    code: `import torch
torch.manual_seed(1)
corpus = ("king queen man woman king queen prince princess man woman boy girl "
          "king prince man boy queen princess woman girl cat dog cat dog kitten puppy "
          "cat kitten dog puppy king queen prince princess man woman boy girl "
          "cat dog kitten puppy").split()
vocab = sorted(set(corpus)); stoi = {w: i for i, w in enumerate(vocab)}; V = len(vocab)
pairs = []
for i, w in enumerate(corpus):
    for j in range(max(0, i - 2), min(len(corpus), i + 3)):
        if j != i:
            pairs.append((stoi[w], stoi[corpus[j]]))
ctr = torch.tensor([a for a, _ in pairs]); ctx = torch.tensor([b for _, b in pairs])

Vin  = (torch.randn(V, 8) * 0.1).requires_grad_(True)
Vout = (torch.randn(V, 8) * 0.1).requires_grad_(True)
opt  = torch.optim.Adam([Vin, Vout], lr=0.05)
for epoch in range(400):
    opt.zero_grad()
    sc = Vin[ctr] @ Vout.t()
    L  = (torch.logsumexp(sc, 1) - sc[torch.arange(len(ctr)), ctx]).mean()
    L.backward(); opt.step()

E   = Vin.detach()
Ec  = E - E.mean(0)                                   # center, then PCA via SVD
U, S, Vt = torch.linalg.svd(Ec, full_matrices=False)
P   = (Ec @ Vt[:2].t())
P   = P / P.abs().max() * 2.0                          # scale to a readable range
for w in vocab:
    x, y = P[stoi[w]].tolist()
    print(f"{w:9s} {x:6.3f} {y:6.3f}")                 # the labeled coordinates plotted above`
  };
})();
