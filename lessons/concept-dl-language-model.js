/* =====================================================================
   STANDALONE LESSON — Language models: n-grams & perplexity.
   From the Stanford CS230 "Deep Learning" cheat sheet
   (Recurrent Neural Networks section: language modelling, the chain-rule
   factorization, the n-gram approximation, and perplexity).
   Module: "Deep Learning (CS230)".
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - HTML teaching fields; math in $...$ / $$...$$ with DOUBLED backslashes
     - CODE = a real, runnable bigram language model + perplexity in pure Python
     - CODEVIZ = held-out perplexity of unigram/bigram/trigram, real numbers
   Pushed into window.LESSONS; its code/codeviz merged into window.CODE/CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "dl-language-model",
    title: "Language models: n-grams & perplexity",
    tagline: "A language model puts a probability on a sentence — n-grams estimate it from counts, and perplexity grades it.",
    module: "Deep Learning (CS230)",
    prereqs: ["dl-cross-entropy", "dl-rnn", "ml-naive-bayes", "fe-ngrams", "mod-llm"],

    whenToUse:
      `<p>A <b>language model (LM)</b> answers one question: how probable is this sentence? Reach for the <b>n-gram</b> version when you want a fast, transparent baseline you can build from raw counts:</p>
       <ul>
         <li><b>You need a quick baseline.</b> Before training a neural network, a bigram or trigram model on counts tells you how hard the language is and gives a perplexity number to beat.</li>
         <li><b>You want something interpretable.</b> Every probability is a visible count ratio. You can point at exactly why the model liked or disliked a sentence.</li>
         <li><b>Data and compute are small.</b> N-grams need no gradient descent and no graphics card — just a pass over the text to tally counts.</li>
       </ul>
       <p><b>Move beyond n-grams</b> to a neural LM (a Recurrent Neural Network, see <i>dl-rnn</i>, or a Transformer, see <i>mod-llm</i>) when long-range context matters. An n-gram only looks back $n-1$ words; "the keys to the cabinet <i>are</i>" needs memory an n-gram does not have.</p>
       <p>An <b>n-gram</b> is a run of $n$ words in a row (see <i>fe-ngrams</i>). $n=1$ is a unigram, $n=2$ a bigram, $n=3$ a trigram. This lesson uses n-grams to <i>predict the next word</i>, not just to count features.</p>`,

    application:
      `<p>Language models are everywhere a machine must judge or generate text: <b>speech recognition</b> (pick the wording that sounds most probable), <b>machine translation</b> (score candidate translations), <b>autocomplete</b> and <b>spelling correction</b>, and as the scoring engine inside search. The chain-rule view here is exactly the one a Large Language Model (LLM) uses — it just replaces the count ratio with a neural network.</p>
       <p><b>Perplexity</b> is the standard yardstick. When you read that one LM "has lower perplexity" than another on the same test text, that is this lesson's number: a smaller perplexity means the model was less surprised by real sentences, which usually means it is the better model.</p>`,

    pitfalls:
      `<ul>
         <li><b>Zero-probability traps.</b> A word-pair never seen in training gets count $0$, so its probability is $0$ — and one zero in the product makes the whole sentence probability $0$ and perplexity infinite. Fix: <b>smoothing</b>. The simplest is <b>Laplace (add-one) smoothing</b> — add $1$ to every count so nothing is exactly impossible (the same trick you use in Naive Bayes, see <i>ml-naive-bayes</i>).</li>
         <li><b>Data sparsity grows with $n$.</b> There are vastly more possible trigrams than bigrams, so most trigrams are seen rarely or never. A bigger $n$ sees more context but has far less data per context — the model memorizes the training set instead of generalizing. That is <b>overfitting</b>.</li>
         <li><b>Perplexity is not comparable across vocabularies.</b> Two models with different vocabulary sizes or different tokenization cannot have their perplexities compared directly. Only compare on the <i>same</i> test set and <i>same</i> vocabulary.</li>
         <li><b>Forgetting sentence boundaries.</b> If you do not pad sentences with a start token and score an end token, the model never learns where sentences begin and end. Add <code>&lt;s&gt;</code> and <code>&lt;/s&gt;</code> markers.</li>
         <li><b>Reading perplexity as accuracy.</b> Perplexity is a branching factor, not a percent. A perplexity of $20$ means "on average as uncertain as a fair 20-sided die," not "20% wrong."</li>
       </ul>`,

    bigIdea:
      `<p>A <b>language model</b> assigns a probability to a whole sentence. "the cat sat on the mat" should score higher than "mat the on cat sat the" — the model has learned what real English looks like.</p>
       <p>Scoring a whole sentence at once is hopeless: there are too many possible sentences. So we <b>factor</b> the sentence probability into a product of next-word probabilities, one word at a time, using the <b>chain rule</b> of probability. Each factor is "how likely is this word, given everything before it."</p>
       <p>Those "everything before it" histories are still too long to count. The <b>n-gram approximation</b> chops the history down to the last $n-1$ words and estimates each probability by a simple <b>count ratio</b>. Then <b>perplexity</b> tells us how good the model is: how surprised it is, on average, by held-out text. Lower is better.</p>`,

    buildup:
      `<p><b>Step 1 — the chain rule.</b> Any joint probability factors into a chain of conditionals. For a sentence of words $y_1, y_2, \\dots, y_T$:</p>
       <p>$$ P(y_1, \\dots, y_T) = P(y_1)\\,P(y_2 \\mid y_1)\\,P(y_3 \\mid y_1, y_2)\\cdots P(y_T \\mid y_1, \\dots, y_{T-1}). $$</p>
       <p>This is exact — no approximation yet. Each factor is "the next word given the history so far."</p>
       <p><b>Step 2 — the n-gram cut.</b> The full history is too long to estimate. We <i>assume</i> the next word depends only on the previous $n-1$ words and forget the rest. That is the <b>Markov assumption</b>. For a bigram ($n=2$) the history shrinks to a single previous word.</p>
       <p><b>Step 3 — estimate by counting.</b> With a short history we can just tally how often each word-run appears in the training text and divide. "How often did 'mat' follow 'the', out of all the times 'the' appeared?"</p>
       <p><b>Step 4 — grade with perplexity.</b> Run the model on held-out text and ask how surprised it was. Surprise is measured by cross-entropy (see <i>dl-cross-entropy</i>); perplexity is just its exponential, read as an average branching factor.</p>`,

    symbols: [
      { sym: "$y_t$", desc: "the word (token) at position $t$ in the sentence. $y_1$ is the first word, $y_T$ the last." },
      { sym: "$T$", desc: "the number of words in the sentence." },
      { sym: "$P(y)$", desc: "the probability the language model assigns to the whole sentence $y = y_1, \\dots, y_T$." },
      { sym: "$P(y_t \\mid y_1, \\dots, y_{t-1})$", desc: "the probability of word $y_t$ given all the words before it — one factor of the chain rule." },
      { sym: "$n$", desc: "the n-gram order: how many words in a row the model conditions on. A bigram is $n=2$, a trigram $n=3$." },
      { sym: "$\\text{count}(\\cdots)$", desc: "how many times that exact word-run appears in the training text." },
      { sym: "$|V|$", desc: "the vocabulary size — the number of distinct words the model knows." },
      { sym: "$\\hat{y}^{(t)}_j$", desc: "the model's predicted probability that word $j$ of the vocabulary is the word at position $t$." },
      { sym: "$y^{(t)}_j$", desc: "the one-hot true label at position $t$: $1$ for the word that actually occurred, $0$ for every other vocabulary word." },
      { sym: "$\\text{PP}$", desc: "the perplexity — the model's average surprise per word. Lower is better." }
    ],

    formula:
      `$$ P(y) = \\prod_{t=1}^{T} P\\left(y_t \\mid y_1, \\dots, y_{t-1}\\right) $$
       $$ P\\left(y_t \\mid y_{t-n+1}, \\dots, y_{t-1}\\right) = \\frac{\\operatorname{count}(y_{t-n+1}, \\dots, y_t)}{\\operatorname{count}(y_{t-n+1}, \\dots, y_{t-1})} $$
       $$ \\text{PP} = \\prod_{t=1}^{T}\\left(\\frac{1}{\\sum_{j=1}^{|V|} y_j^{(t)}\\,\\hat{y}_j^{(t)}}\\right)^{1/T} = \\exp\\!\\big(\\text{average cross-entropy}\\big) $$`,

    whatItDoes:
      `<p><b>The chain rule (top line).</b> The probability of a sentence is the product of next-word probabilities. The symbol $\\prod$ means "multiply together," running $t$ from $1$ to $T$. Each factor asks "given the words so far, how likely is the next one?"</p>
       <p><b>The n-gram estimate (middle line).</b> Replace the full history by just the previous $n-1$ words, then estimate the conditional probability by a <b>count ratio</b>: how often the full $n$-word run appeared, divided by how often its $(n-1)$-word prefix appeared. For a bigram this is $\\operatorname{count}(\\text{prev word}, \\text{this word}) / \\operatorname{count}(\\text{prev word})$.</p>
       <p><b>Perplexity (bottom line).</b> The sum $\\sum_j y^{(t)}_j \\hat{y}^{(t)}_j$ picks out one number: because $y^{(t)}$ is one-hot (a single $1$), the sum equals $\\hat{y}^{(t)}_{\\text{true word}}$ — the probability the model gave to the word that actually occurred. Perplexity is the <b>geometric mean</b> of the <i>reciprocals</i> of those probabilities (the $1/T$ exponent makes it a per-word average). The right-hand identity, $\\text{PP} = \\exp(\\text{average cross-entropy})$, is the same number and is usually how you compute it. Read perplexity as a <b>branching factor</b>: a perplexity of $20$ means the model is, on average, as unsure as if it were guessing uniformly among $20$ words at each step.</p>`,

    derivation:
      `<p><b>Why the two perplexity forms are equal.</b> Start from the geometric-mean form. Let $p_t = \\sum_j y^{(t)}_j \\hat{y}^{(t)}_j$ be the probability the model gave the true word at step $t$. Then</p>
       <p>$$ \\text{PP} = \\left(\\prod_{t=1}^{T} \\frac{1}{p_t}\\right)^{1/T}. $$</p>
       <p>Take the natural logarithm of both sides. The log of a product is a sum, and the log of $1/p_t$ is $-\\log p_t$:</p>
       <p>$$ \\log \\text{PP} = \\frac{1}{T}\\sum_{t=1}^{T} -\\log p_t. $$</p>
       <p>That right-hand side is exactly the <b>average cross-entropy</b> per word — the average of $-\\log(\\text{prob given to the true word})$, which is the cross-entropy loss from <i>dl-cross-entropy</i>. Exponentiating both sides undoes the log:</p>
       <p>$$ \\text{PP} = \\exp\\!\\left(\\frac{1}{T}\\sum_{t=1}^{T} -\\log p_t\\right) = \\exp(\\text{average cross-entropy}). $$</p>
       <p><b>Why smoothing is needed.</b> The count ratio gives probability $0$ to any word-run never seen in training. One $0$ inside the product $\\prod_t p_t$ makes the whole sentence probability $0$, so $1/p_t = \\infty$ and perplexity blows up. <b>Laplace (add-one) smoothing</b> fixes this by adding $1$ to every count and $|V|$ to every denominator:</p>
       <p>$$ P_{\\text{add-1}}(y_t \\mid \\text{history}) = \\frac{\\operatorname{count}(\\text{history}, y_t) + 1}{\\operatorname{count}(\\text{history}) + |V|}. $$</p>
       <p>Now every word gets a small but nonzero probability — the same defense against the zero-probability trap used in Naive Bayes (see <i>ml-naive-bayes</i>).</p>
       <p><b>Why perplexity drops then rises as $n$ grows.</b> A larger $n$ gives the model more context, so it predicts better and perplexity <i>falls</i> — at first. But the data per context shrinks fast: there are far more possible trigrams than bigrams, so most trigram counts are tiny or zero. The estimates get noisy, the model memorizes training quirks, and held-out perplexity <i>rises</i> again. That U-shape is the <b>bias–variance / overfitting</b> tradeoff in n-gram form.</p>`,

    example:
      `<p>Train a <b>bigram</b> model on two tiny sentences:</p>
       <ul>
         <li><code>the cat sat</code></li>
         <li><code>the cat ran</code></li>
       </ul>
       <p><b>Count the pairs.</b> "the" is followed by "cat" both times. "cat" is followed by "sat" once and "ran" once. So, without smoothing:</p>
       <ul class="steps">
         <li>$P(\\text{cat} \\mid \\text{the}) = \\dfrac{\\operatorname{count}(\\text{the cat})}{\\operatorname{count}(\\text{the})} = \\dfrac{2}{2} = 1.0$.</li>
         <li>$P(\\text{sat} \\mid \\text{cat}) = \\dfrac{\\operatorname{count}(\\text{cat sat})}{\\operatorname{count}(\\text{cat})} = \\dfrac{1}{2} = 0.5$.</li>
       </ul>
       <p><b>Score a sentence.</b> $P(\\text{the cat sat}) = P(\\text{cat}\\mid\\text{the})\\cdot P(\\text{sat}\\mid\\text{cat}) = 1.0 \\times 0.5 = 0.5$.</p>
       <p><b>The zero trap.</b> Now try "the cat jumped." The pair "cat jumped" was never seen, so $P(\\text{jumped}\\mid\\text{cat}) = 0/2 = 0$, and the whole sentence gets probability $0$ — perplexity infinite. Add-one smoothing rescues it: with vocabulary size $|V|=5$, $P_{\\text{add-1}}(\\text{jumped}\\mid\\text{cat}) = (0+1)/(2+5) = 1/7 \\approx 0.143$. Small, but no longer impossible.</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340") };
      }
      var corpus = [
        "the cat sat on the mat",
        "the dog sat on the log",
        "the cat ran on the mat",
        "the dog ran on the log",
        "a cat sat on a mat",
        "a dog sat on a log",
        "the cat sat on a log",
        "the dog ran on the mat"
      ];
      var test = [
        "the cat sat on the log",
        "a dog ran on the mat"
      ];
      function pad(s, n) {
        var w = s.trim().toLowerCase().split(/\s+/).filter(Boolean);
        var start = [];
        for (var k = 0; k < n - 1; k++) start.push("<s>");
        return start.concat(w).concat(["</s>"]);
      }
      // vocabulary including boundary tokens
      var vocab = {};
      corpus.forEach(function (s) { s.trim().toLowerCase().split(/\s+/).forEach(function (t) { vocab[t] = 1; }); });
      vocab["<s>"] = 1; vocab["</s>"] = 1;
      var V = Object.keys(vocab).length;
      function buildCounts(n) {
        var ng = {}, ctx = {};
        corpus.forEach(function (s) {
          var w = pad(s, n);
          for (var i = 0; i + n <= w.length; i++) {
            var gram = w.slice(i, i + n).join(" ");
            var pre = w.slice(i, i + n - 1).join(" ");
            ng[gram] = (ng[gram] || 0) + 1;
            ctx[pre] = (ctx[pre] || 0) + 1;
          }
        });
        return { ng: ng, ctx: ctx };
      }
      function perplexity(n) {
        var c = buildCounts(n), logp = 0, N = 0;
        test.forEach(function (s) {
          var w = pad(s, n);
          for (var i = 0; i + n <= w.length; i++) {
            var gram = w.slice(i, i + n).join(" ");
            var pre = w.slice(i, i + n - 1).join(" ");
            var cf = c.ng[gram] || 0, cc = c.ctx[pre] || 0;
            var p = (cf + 1) / (cc + V);          // add-one smoothing
            logp += Math.log(p); N += 1;
          }
        });
        return Math.exp(-logp / N);
      }
      var wrap = document.createElement("div"); wrap.style.marginBottom = "8px";
      wrap.innerHTML = "<div style='font-size:12px;margin-bottom:4px'>train: 8 short sentences &nbsp;|&nbsp; held-out test: 2 sentences. add-one smoothing, vocab $|V|$ = " + V + ".</div>" +
        "<div style='font-size:12px;margin-bottom:4px'>held-out perplexity by n-gram order (lower is better):</div>";
      host.appendChild(wrap);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 240; host.appendChild(cv);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      var c = C();
      var pp1 = perplexity(1), pp2 = perplexity(2), pp3 = perplexity(3);
      if (window.Charts) {
        window.Charts.draw(cv, {
          type: "bars",
          labels: ["unigram (n=1)", "bigram (n=2)", "trigram (n=3)"],
          values: [pp1, pp2, pp3],
          valueLabels: [pp1.toFixed(2), pp2.toFixed(2), pp3.toFixed(2)],
          colors: [c.accent, c.accent2, c.warn]
        });
      }
      rd.innerHTML = "Perplexity drops from <b>" + pp1.toFixed(2) + "</b> (unigram) to <b>" + pp2.toFixed(2) +
        "</b> (bigram) as context helps — then rises to <b>" + pp3.toFixed(2) +
        "</b> (trigram), because trigram counts are too sparse on this tiny corpus and the model overfits. That U-shape is the n-gram overfitting tradeoff.";
    },

    practice: [
      {
        q: `Train a bigram model on <code>the dog barks</code> and <code>the dog runs</code>. Using raw counts (no smoothing), what is $P(\\text{the dog runs})$? Treat the first word "the" as given.`,
        steps: [
          { do: `Count "the dog": it appears twice. Count "the": twice. So $P(\\text{dog}\\mid\\text{the}) = 2/2 = 1.0$.`, why: `The count ratio is how often "dog" follows "the" out of all "the" occurrences.` },
          { do: `Count "dog runs": once. Count "dog": twice. So $P(\\text{runs}\\mid\\text{dog}) = 1/2 = 0.5$.`, why: `"dog" is followed by "barks" once and "runs" once.` },
          { do: `Multiply the chain: $P(\\text{the dog runs}) = 1.0 \\times 0.5 = 0.5$.`, why: `The chain rule makes a sentence probability the product of its next-word probabilities.` }
        ],
        answer: `$P(\\text{the dog runs}) = P(\\text{dog}\\mid\\text{the}) \\cdot P(\\text{runs}\\mid\\text{dog}) = 1.0 \\times 0.5 = 0.5$.`
      },
      {
        q: `A bigram model gives a 10-word held-out sentence an average cross-entropy of $2.3$ nats per word. What is its perplexity, and what does that number mean in plain words?`,
        steps: [
          { do: `Use the identity $\\text{PP} = \\exp(\\text{average cross-entropy}) = \\exp(2.3)$.`, why: `Perplexity is just the exponential of the per-word cross-entropy.` },
          { do: `$\\exp(2.3) \\approx 10.0$.`, why: `$e^{2.3} \\approx 9.97$, which rounds to $10$.` },
          { do: `Read it as a branching factor: about 10.`, why: `Perplexity is the model's average number of equally-likely next-word guesses.` }
        ],
        answer: `Perplexity $\\approx \\exp(2.3) \\approx 10$. The model is, on average, as uncertain about the next word as if it were guessing uniformly among 10 words at each step. Lower would be better.`
      },
      {
        q: `You move from a bigram to a trigram model and held-out perplexity goes <i>up</i>, not down, even though the trigram sees more context. What is happening, and name one fix.`,
        steps: [
          { do: `More context per prediction should help — but trigram counts are far sparser than bigram counts.`, why: `There are many more possible trigrams than bigrams, so most trigram contexts have very few examples.` },
          { do: `With tiny counts the estimates are noisy and the model fits training quirks instead of real patterns — it overfits.`, why: `Low data per context means high variance in the estimated probabilities.` },
          { do: `Fix: smooth more aggressively (or back off to bigram/unigram estimates), or simply gather more training data.`, why: `Smoothing and back-off borrow strength from lower orders; more data fills in the sparse trigram contexts.` }
        ],
        answer: `Data sparsity: trigram contexts have too few examples, so the model overfits and held-out perplexity rises. Fix it with stronger smoothing or back-off (blend in bigram/unigram estimates), or train on more text.`
      }
    ]
  });

  window.CODE["dl-language-model"] = {
    lib: "Pure Python (collections.Counter, math)",
    runnable: false,
    explain: `<p>A complete <b>bigram language model</b> from scratch — no libraries beyond the standard library, so it runs as-is in Colab. It (1) pads each training sentence with start/end markers, (2) tallies unigram and bigram counts, (3) turns them into conditional probabilities with <b>add-one (Laplace) smoothing</b> so unseen pairs are never exactly zero, (4) scores a held-out sentence word by word, and (5) prints its <b>perplexity</b> using the identity $\\text{PP} = \\exp(\\text{average cross-entropy})$. The printed per-word probabilities let you see exactly how the sentence probability is built.</p>`,
    code: `import math
from collections import Counter

# tiny training corpus (one sentence per line)
corpus = [
    "the cat sat on the mat",
    "the dog sat on the log",
    "the cat ran on the mat",
    "the dog ran on the log",
    "a cat sat on a mat",
    "a dog sat on a log",
]

def pad(sentence):
    # mark the start and end of every sentence
    return ["<s>"] + sentence.split() + ["</s>"]

# vocabulary, including the boundary tokens
vocab = set(["<s>", "</s>"])
for s in corpus:
    vocab.update(s.split())
V = len(vocab)

# count unigrams (contexts) and bigrams (word pairs)
unigram = Counter()
bigram = Counter()
for s in corpus:
    w = pad(s)
    for i in range(len(w) - 1):
        unigram[w[i]] += 1
        bigram[(w[i], w[i + 1])] += 1

def bigram_prob(prev, cur):
    # P(cur | prev) with add-one (Laplace) smoothing
    return (bigram[(prev, cur)] + 1) / (unigram[prev] + V)

# score a HELD-OUT sentence the model did not train on
test = "the dog sat on the mat"
w = pad(test)
log_prob = 0.0
N = 0
for i in range(len(w) - 1):
    p = bigram_prob(w[i], w[i + 1])
    log_prob += math.log(p)          # work in log-space to avoid underflow
    N += 1
    print("P(%4s | %4s) = %.4f" % (w[i + 1], w[i], p))

avg_cross_entropy = -log_prob / N    # nats per word
perplexity = math.exp(avg_cross_entropy)

print()
print("vocab size V          =", V)
print("tokens scored         =", N)
print("avg cross-entropy     = %.4f nats" % avg_cross_entropy)
print("PERPLEXITY = exp(CE)  = %.2f" % perplexity)

# ---- actual output ----
# P( the |  <s>) = 0.2941
# P( dog |  the) = 0.1579
# P( sat |  dog) = 0.2143
# P(  on |  sat) = 0.3333
# P( the |   on) = 0.2941
# P( mat |  the) = 0.1579
# P(</s> |  mat) = 0.2857
#
# vocab size V          = 11
# tokens scored         = 7
# avg cross-entropy     = 1.4330 nats
# PERPLEXITY = exp(CE)  = 4.19`
  };

  window.CODEVIZ["dl-language-model"] = {
    question: "On a small corpus, how does held-out perplexity change as we go from a unigram to a bigram to a trigram model? Does more context always help?",
    charts: [{
      type: "bars",
      title: "Held-out perplexity: unigram vs bigram vs trigram (add-one smoothing, lower is better)",
      xlabel: "n-gram order",
      ylabel: "held-out perplexity",
      labels: ["unigram (n=1)", "bigram (n=2)", "trigram (n=3)"],
      values: [9.30, 4.17, 4.68],
      valueLabels: ["9.30", "4.17", "4.68"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454"]
    }],
    caption: "Eight short training sentences, two held-out test sentences, add-one smoothing, vocabulary |V| = 11. Perplexity DROPS from 9.30 (unigram) to 4.17 (bigram) because one word of context helps a lot — then RISES to 4.68 (trigram) because trigram counts are too sparse on this tiny corpus and the model overfits. That U-shape is the n-gram bias–variance tradeoff: bigger n sees more context but has far less data per context. Numbers below are real Python outputs.",
    code: `import math
from collections import Counter

# 8-sentence training corpus + 2 held-out test sentences
train = [
    "the cat sat on the mat",
    "the dog sat on the log",
    "the cat ran on the mat",
    "the dog ran on the log",
    "a cat sat on a mat",
    "a dog sat on a log",
    "the cat sat on a log",
    "the dog ran on the mat",
]
test = [
    "the cat sat on the log",
    "a dog ran on the mat",
]

def pad(sentence, n):
    # n-1 start markers, then the words, then one end marker
    return ["<s>"] * (n - 1) + sentence.split() + ["</s>"]

# shared vocabulary (training words + boundary tokens)
vocab = set(["<s>", "</s>"])
for s in train:
    vocab.update(s.split())
V = len(vocab)

def build_counts(n):
    ngram = Counter()   # full n-word run
    ctx = Counter()     # its (n-1)-word prefix
    for s in train:
        w = pad(s, n)
        for i in range(len(w) - n + 1):
            gram = tuple(w[i:i + n])
            ngram[gram] += 1
            ctx[gram[:-1]] += 1
    return ngram, ctx

def perplexity(n):
    ngram, ctx = build_counts(n)
    log_prob, N = 0.0, 0
    for s in test:
        w = pad(s, n)
        for i in range(len(w) - n + 1):
            gram = tuple(w[i:i + n])
            c_full = ngram.get(gram, 0)
            c_ctx = ctx.get(gram[:-1], 0)
            p = (c_full + 1) / (c_ctx + V)   # add-one (Laplace) smoothing
            log_prob += math.log(p)
            N += 1
    return math.exp(-log_prob / N)           # exp(avg cross-entropy)

print("vocab |V| =", V)
for n in (1, 2, 3):
    print("n=%d  held-out perplexity = %.2f" % (n, perplexity(n)))

# ---- actual output ----
# vocab |V| = 11
# n=1  held-out perplexity = 9.30
# n=2  held-out perplexity = 4.17   <- best: context helps
# n=3  held-out perplexity = 4.68   <- rises: trigrams too sparse, overfits

import matplotlib.pyplot as plt
orders = ["unigram", "bigram", "trigram"]
vals = [perplexity(1), perplexity(2), perplexity(3)]
plt.bar(orders, vals, color=["#4ea1ff", "#7ee787", "#ffb454"])
plt.ylabel("held-out perplexity (lower is better)")
plt.title("Perplexity drops then rises as n grows")
for i, v in enumerate(vals):
    plt.text(i, v, "%.2f" % v, ha="center", va="bottom")
plt.show()`
  };
})();
