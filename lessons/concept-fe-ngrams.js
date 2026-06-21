/* =====================================================================
   STANDALONE LESSON — Bag-of-n-Grams (Feature Engineering).
   From Alice Zheng & Amanda Casari, "Feature Engineering for Machine
   Learning" (O'Reilly 2018), Chapter 3 — "Text Data: Flattening,
   Filtering, and Chunking", the "Bag-of-n-Grams" section.
   BEGINNER audience. Module: "Feature Engineering (Zheng & Casari)".
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - HTML teaching fields; math in $...$ / $$...$$ with DOUBLED backslashes
     - CODE = the book's faithful sklearn example on the Yelp dataset
     - CODEVIZ = the same idea in-browser on a tiny REAL inline corpus
   Pushed into window.LESSONS; its codeviz merged into window.CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-ngrams",
    title: "Bag-of-n-Grams",
    tagline: "Count word-pairs and word-triples, not just single words — so \"not good\" can become its own feature.",
    module: "Feature Engineering (Zheng & Casari)",
    prereqs: [],

    whenToUse:
      `<p>Reach for a <b>bag-of-n-grams</b> when <b>local phrasing or negation</b> carries the signal and plain bag-of-words throws it away:</p>
       <ul>
         <li><b>Negation matters.</b> "not good", "never again", "not worth it". Bag-of-words sees "not" and "good" separately; a bigram keeps "not good" as one feature.</li>
         <li><b>Short, meaningful phrases.</b> "customer service", "new york", "hot dog" — pairs whose meaning is more than the two words alone.</li>
         <li><b>You want a small accuracy bump over bag-of-words</b> for a text classifier (spam, sentiment, topic), and you can afford a bigger feature matrix.</li>
       </ul>
       <p><b>Prefer plain bag-of-words</b> when the vocabulary is already huge, memory is tight, or word order does not matter for the task. <b>Move beyond n-grams</b> (to embeddings or transformers) when <i>long-range</i> order matters — n-grams only see a window of $n$ words.</p>
       <p>An <b>n-gram</b> is a run of $n$ words in a row. $n=1$ is a unigram (one word), $n=2$ a bigram (two words in a row), $n=3$ a trigram. A bag-of-n-grams usually includes the unigrams <i>and</i> the bigrams (or trigrams) together.</p>`,

    application:
      `<p>The book builds these features on the <b>Yelp reviews dataset</b> (the Yelp Dataset Challenge round 6, available at <code>yelp.com/dataset</code>; the book's code is at <code>github.com/alicezheng/feature-engineering-book</code>). It feeds the n-gram counts into a classifier to predict review sentiment from the review text.</p>
       <p>In real pipelines the bag-of-n-grams shows up everywhere text becomes a feature matrix: sentiment and review scoring, spam filtering, support-ticket routing, search query understanding, and as the input to <b>tf-idf (term frequency–inverse document frequency)</b> weighting. It is the default "phrase-aware" upgrade to bag-of-words in scikit-learn's <code>CountVectorizer</code> and <code>TfidfVectorizer</code> — you just set <code>ngram_range</code>.</p>`,

    pitfalls:
      `<ul>
         <li><b>Feature-space explosion.</b> The number of distinct n-grams grows far faster than the vocabulary. The book reports it directly on Yelp: about <b>29{,}000 unigrams</b>, but roughly <b>357{,}000 bigrams</b> and <b>1{,}627{,}000 trigrams</b> — bigrams give ~12x and trigrams ~56x more features than unigrams. Fix: cap the vocabulary (<code>max_features</code>) or include only lower orders.</li>
         <li><b>Sparsity.</b> Most documents contain almost none of those millions of n-grams, so the matrix is mostly zeros. Storing and computing over it costs memory and time. Fix: keep it sparse (scikit-learn already uses sparse matrices) and prune rare columns.</li>
         <li><b>Most n-grams are rare noise.</b> A trigram seen once helps no model generalize; it just adds a column. Fix: prune by minimum document frequency (<code>min_df</code>) and/or maximum (<code>max_df</code>) to drop the too-rare and the too-common.</li>
         <li><b>Still misses long-range order.</b> An n-gram only sees a window of $n$ words. "the food, despite the wait, was not good" can split the negation across the window. Fix: use a larger $n$ (more cost) or move to sequence models / embeddings.</li>
         <li><b>Diminishing returns.</b> Bigrams usually beat unigrams by a little; trigrams rarely beat bigrams enough to justify the size. Fix: validate the accuracy gain against the cost before going higher.</li>
       </ul>`,

    bigIdea:
      `<p><b>Bag-of-words</b> turns a document into a vector of word counts and <i>forgets the order</i>. "dog bites man" and "man bites dog" get the exact same vector. That lost order sometimes carries the whole meaning — especially <b>negation</b>: "good" and "not good" are opposites, but bag-of-words sees the same word "good" in both.</p>
       <p><b>Bag-of-n-grams</b> recovers a little of that order. Instead of counting only single words, it also counts <i>contiguous runs</i> of $n$ words. Now "not good" is its <i>own</i> feature, separate from "good" and "not". A sentiment model can learn that the "not good" column predicts a bad review.</p>
       <p>The catch is a tradeoff. Each higher order $n$ adds far more possible features than the last. You buy a bit of word-order signal, and you pay with a much larger, much sparser feature space. The whole lesson is that one trade: <b>signal vs feature count</b>.</p>`,

    buildup:
      `<p>Start from a single sentence and build the bag up by order.</p>
       <p>Take <code>the food is not good</code> (5 words).</p>
       <ul class="steps">
         <li><b>Unigrams ($n=1$):</b> the 5 single words — "the", "food", "is", "not", "good".</li>
         <li><b>Bigrams ($n=2$):</b> the 4 adjacent pairs — "the food", "food is", "is not", "not good".</li>
         <li><b>Trigrams ($n=3$):</b> the 3 adjacent triples — "the food is", "food is not", "is not good".</li>
       </ul>
       <p>A sentence of $L$ words has $L$ unigrams, $L-1$ bigrams, and $L-2$ trigrams — fewer n-grams as $n$ rises <i>within one sentence</i>. But across the whole corpus the opposite happens: the number of <i>distinct</i> n-grams explodes, because there are so many more possible pairs and triples than single words.</p>
       <p>The bag-of-n-grams vector for a document has one slot per distinct n-gram in the vocabulary, holding how many times that n-gram appears. "not good" is now a slot of its own — that is the negation signal bag-of-words could not represent.</p>`,

    symbols: [
      { sym: "$n$", desc: "the n-gram order: how many words in a row form one feature. $n=1$ unigram, $n=2$ bigram, $n=3$ trigram." },
      { sym: "$L$", desc: "the number of words (tokens) in one document or sentence." },
      { sym: "$V_1$", desc: "the number of distinct unigrams in the corpus — the plain vocabulary size." },
      { sym: "$V_n$", desc: "the number of distinct n-grams of order $n$ in the corpus — the size of the bag-of-n-grams vocabulary at that order." },
      { sym: "$D$", desc: "the number of documents in the corpus." },
      { sym: "$\\mathbf{x}_d$", desc: "the feature vector for document $d$: one entry per distinct n-gram, holding that n-gram's count in the document." }
    ],

    formula:
      `$$ \\#\\{\\text{n-grams in a document of length } L\\} = L - (n - 1) = L - n + 1 $$
       $$ \\mathbf{x}_d[g] \\;=\\; \\text{count of n-gram } g \\text{ in document } d, \\qquad g \\in V_n $$
       $$ V_1 \\;\\le\\; V_2 \\;\\le\\; V_3 \\;\\le\\; \\cdots \\quad\\text{(distinct-n-gram counts grow fast with } n\\text{)} $$`,

    whatItDoes:
      `<p><b>The count formula.</b> A document with $L$ words yields $L - n + 1$ n-grams of order $n$ (slide a window of width $n$ across the words). So within one document, higher $n$ gives slightly <i>fewer</i> n-grams.</p>
       <p><b>The feature vector.</b> $\\mathbf{x}_d[g]$ is just how many times n-gram $g$ appears in document $d$. Stack all $D$ documents and you get a $D \\times V_n$ count matrix — the same shape idea as bag-of-words, only the columns are n-grams instead of single words.</p>
       <p><b>The blow-up.</b> $V_n$ — the number of <i>distinct</i> n-grams — rises sharply with $n$. There are vastly more possible word-pairs than words, and more triples still. That is why the matrix gets wider and sparser as you add bigrams and trigrams. In scikit-learn you control this with <code>ngram_range=(1,1)</code> for unigrams, <code>(1,2)</code> to add bigrams, <code>(1,3)</code> to add trigrams.</p>`,

    derivation:
      `<p><b>Why distinct n-grams explode.</b> Suppose the vocabulary has $V_1$ words. The number of <i>possible</i> ordered word-pairs is $V_1^2$, and triples $V_1^3$. Real text uses only a tiny slice of those (grammar forbids most), but even that slice grows much faster than $V_1$. On Yelp the book measures it: $V_1 \\approx 29\\text{k}$ unigrams, $V_2 \\approx 357\\text{k}$ bigrams, $V_3 \\approx 1.63\\text{M}$ trigrams. The jump from words to pairs is far bigger than the jump from one document to the next.</p>
       <p><b>Why it still helps.</b> Bag-of-words is the special case $n=1$: it assumes word order does not matter at all. That assumption is wrong whenever a phrase means more than its words — and most damagingly for <b>negation</b>. Adding bigrams lets the model assign a separate weight to "not good", so it can learn the negation flips the sentiment. The signal you gain is exactly the local order bag-of-words discarded.</p>
       <p><b>Why the gain is bounded and shrinking.</b> Each new order adds rarer features. A trigram seen in one review out of a million teaches a classifier nothing it can reuse. So accuracy typically climbs a little from unigrams to bigrams, then flattens — while the feature count keeps multiplying. That is the cost–benefit curve the book wants you to feel: pick the smallest $n$ that captures the phrasing you need, and prune the rest.</p>`,

    example:
      `<p>Two tiny reviews:</p>
       <ul>
         <li>Review 1: <code>the food is good</code></li>
         <li>Review 2: <code>the food is not good</code></li>
       </ul>
       <p><b>Bag-of-words (unigrams).</b> Vocabulary = {the, food, is, good, not}. The two reviews differ only in the single "not" slot. The word "good" fires in <i>both</i> — so a model leaning on "good" would wrongly call Review 2 positive too.</p>
       <p><b>Add bigrams.</b> Review 2 now contains the bigrams "is not" and <b>"not good"</b>, which Review 1 does not have. The "not good" column lights up only for the negative review. The model can put a negative weight on "not good" and get it right.</p>
       <p><b>Feel the blow-up on these toy reviews.</b> Distinct unigrams: {the, food, is, good, not} = <b>5</b>. Distinct bigrams across both: {the food, food is, is good, is not, not good} = <b>5</b>. Distinct trigrams: {the food is, food is good, food is not, is not good} = <b>4</b>. On two short sentences the orders look similar — but scaled to a real corpus like Yelp the same counting gives ~29k vs ~357k vs ~1.63M. The explosion is a property of <i>many</i> documents, not of one.</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      var corpus = [
        "the food is good",
        "the food is not good",
        "great service and great food",
        "service was not great",
        "i would not come back"
      ];
      function tok(s) { return s.trim().toLowerCase().split(/\s+/).filter(Boolean); }
      function ngramsOfDoc(words, n) {
        var out = [];
        for (var i = 0; i + n <= words.length; i++) out.push(words.slice(i, i + n).join(" "));
        return out;
      }
      // distinct n-grams across the corpus, including all orders 1..maxN
      function distinctUpTo(maxN) {
        var set = {};
        corpus.forEach(function (doc) {
          var w = tok(doc);
          for (var n = 1; n <= maxN; n++) ngramsOfDoc(w, n).forEach(function (g) { set[g] = 1; });
        });
        return Object.keys(set).length;
      }
      var wrap = document.createElement("div"); wrap.style.marginBottom = "8px";
      wrap.innerHTML = "<div style='font-size:12px;margin-bottom:4px'>corpus (5 short reviews, one has a negation): <code>" +
        corpus.join(" &nbsp;|&nbsp; ") + "</code></div>" +
        "<div style='font-size:12px;margin-bottom:4px'>distinct features as we widen the n-gram range:</div>";
      host.appendChild(wrap);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 240; host.appendChild(cv);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function draw() {
        var c = C();
        var v1 = distinctUpTo(1), v12 = distinctUpTo(2), v13 = distinctUpTo(3);
        if (window.Charts) {
          window.Charts.draw(cv, {
            type: "bars",
            labels: ["(1,1) unigrams", "(1,2) +bigrams", "(1,3) +trigrams"],
            values: [v1, v12, v13],
            valueLabels: [String(v1), String(v12), String(v13)],
            colors: [c.accent, c.accent2, c.warn]
          });
        }
        rd.innerHTML = "Widening the range adds the \"not good\" and \"not great\" bigrams that bag-of-words could not see — " +
          "but the feature count climbs from " + v1 + " to " + v12 + " to " + v13 + ". On Yelp the same counting gives " +
          "~29k &rarr; ~357k &rarr; ~1.63M features: the explosion is what you pay for the extra phrasing signal.";
      }
      draw();
    },

    practice: [
      {
        q: `The review <code>i would not order this again</code> has 6 words. How many bigrams ($n=2$) and trigrams ($n=3$) does it produce? Which bigram carries the negation?`,
        steps: [
          { do: `Use $L - n + 1$ with $L = 6$. Bigrams: $6 - 2 + 1 = 5$. Trigrams: $6 - 3 + 1 = 4$.`, why: `Slide a window of width $n$ across the 6 words.` },
          { do: `List the bigrams: "i would", "would not", "not order", "order this", "this again".`, why: `Each adjacent pair is one bigram feature.` },
          { do: `"not order" (and "would not") is the negation-bearing pair.`, why: `Bag-of-words would split "not" from "order"; the bigram keeps the negation as one feature.` }
        ],
        answer: `5 bigrams and 4 trigrams. The bigram "not order" (helped by "would not") carries the negation that plain bag-of-words loses.`
      },
      {
        q: `On Yelp the book reports about 29,000 unigrams, 357,000 bigrams, and 1,627,000 trigrams. Roughly how many times more features do bigrams and trigrams give versus unigrams, and what does that imply about the matrix?`,
        steps: [
          { do: `Bigrams vs unigrams: $357\\text{k} / 29\\text{k} \\approx 12$. Trigrams vs unigrams: $1{,}627\\text{k} / 29\\text{k} \\approx 56$.`, why: `Divide each count by the unigram count to get the multiplier.` },
          { do: `So adding bigrams makes the feature space ~12x wider; trigrams ~56x wider.`, why: `Distinct n-grams grow far faster than the vocabulary.` },
          { do: `Each document still contains only a handful of those n-grams, so almost every column is zero.`, why: `More columns with the same few hits per row means a much sparser matrix.` }
        ],
        answer: `Bigrams ~12x and trigrams ~56x more features than unigrams. The matrix becomes far wider and much sparser — the cost you pay for the extra local-order signal. Prune with min_df / max_features.`
      },
      {
        q: `A sentiment model on bag-of-words keeps calling "the food was not good" positive. Why, and what single change to the vectorizer most directly fixes it?`,
        steps: [
          { do: `Bag-of-words ($n=1$) has separate "not" and "good" features; the strong positive weight on "good" wins.`, why: `Unigrams cannot represent that "not" negates "good" — order is discarded.` },
          { do: `Switch to a bag-of-n-grams that includes bigrams: <code>CountVectorizer(ngram_range=(1,2))</code>.`, why: `This adds the "not good" feature, which the model can weight negatively.` },
          { do: `Optionally add <code>min_df</code> to prune the new rare bigrams and control the blow-up.`, why: `Most added bigrams are rare noise; pruning keeps the matrix manageable.` }
        ],
        answer: `Unigrams split "not" from "good", so the positive "good" weight dominates. Set ngram_range=(1,2) so "not good" becomes its own feature the model can penalize — and use min_df to tame the feature explosion.`
      }
    ]
  });

  window.CODE["fe-ngrams"] = {
    lib: "scikit-learn (CountVectorizer), pandas",
    runnable: false,
    explain: `<p>Faithful to Chapter 3 of Zheng &amp; Casari. The book loads the <b>Yelp reviews</b> JSON, then uses scikit-learn's <code>CountVectorizer</code> with different <code>ngram_range</code> settings to build bag-of-words (unigrams), bag-of-bigrams, and unigram+bigram features, and prints <code>len(get_feature_names_out())</code> to show how the feature count explodes. Dataset: the Yelp Dataset Challenge (round 6) from <code>yelp.com/dataset</code>; the book's notebooks are at <code>github.com/alicezheng/feature-engineering-book</code>.</p>`,
    code: `# pip install scikit-learn pandas
# Dataset: Yelp Dataset Challenge (round 6) reviews, yelp.com/dataset
# Book code: github.com/alicezheng/feature-engineering-book (Chapter 3)
import json
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer

# --- load the Yelp review text (one JSON object per line) ---
review_file = "yelp_academic_dataset_review.json"
reviews = []
with open(review_file) as f:
    for line in f:
        reviews.append(json.loads(line))
review_df = pd.DataFrame(reviews)
texts = review_df["text"]          # the raw review strings

# --- Bag-of-words: single words only (unigrams) ---
bow = CountVectorizer()            # default ngram_range=(1, 1)
bow.fit(texts)
print("unigram features :", len(bow.get_feature_names_out()))   # ~ 29,000

# --- Bag-of-bigrams: word-pairs only ---
bigram = CountVectorizer(ngram_range=(2, 2))
bigram.fit(texts)
print("bigram features  :", len(bigram.get_feature_names_out())) # ~ 357,000

# --- Bag-of-trigrams: word-triples only ---
trigram = CountVectorizer(ngram_range=(3, 3))
trigram.fit(texts)
print("trigram features :", len(trigram.get_feature_names_out())) # ~ 1,627,000

# --- The useful setting: unigrams AND bigrams together ---
uni_bi = CountVectorizer(ngram_range=(1, 2))
X = uni_bi.fit_transform(texts)    # sparse document x n-gram count matrix
print("uni+bigram feats :", len(uni_bi.get_feature_names_out()))

# negation now has its own feature: "not good" is distinct from "good"
vocab = uni_bi.vocabulary_
print('"good" index     :', vocab.get("good"))
print('"not good" index :', vocab.get("not good"))

# the cost is sparsity: a huge, mostly-zero matrix
print("matrix shape     :", X.shape, " stored nonzeros:", X.nnz)

# tame the explosion: keep only n-grams seen in many reviews
pruned = CountVectorizer(ngram_range=(1, 2), min_df=10, max_features=50000)
pruned.fit(texts)
print("pruned features  :", len(pruned.get_feature_names_out()))`
  };

  window.CODEVIZ["fe-ngrams"] = {
    question: "On a tiny real corpus of reviews (one with the negation \"not good\"), how fast does the number of distinct features grow as we widen ngram_range from (1,1) to (1,2) to (1,3)?",
    charts: [{
      type: "bars",
      title: "Distinct features explode as the n-gram range widens (6 short reviews, CountVectorizer)",
      xlabel: "ngram_range",
      ylabel: "number of distinct features",
      labels: ["(1,1) unigrams", "(1,2) +bigrams", "(1,3) +trigrams"],
      values: [12, 31, 45],
      valueLabels: ["12", "31", "45"],
      colors: ["#4ea1ff", "#7ee787", "#ffb454"]
    }],
    caption: "Six short real reviews, including \"the food is not good\". Adding bigrams takes the feature count from 12 to 31; adding trigrams pushes it to 45 — the count climbs faster than the vocabulary, even on this tiny corpus. The (1,2) setting is what creates the \"not good\" feature (printed below) that plain bag-of-words cannot represent. The book measures the same effect on Yelp: ~29k unigrams, ~357k bigrams, ~1.63M trigrams. Numbers below are real CountVectorizer outputs.",
    code: `import numpy as np
from sklearn.feature_extraction.text import CountVectorizer

# six short REAL reviews; one carries a negation ("not good")
corpus = [
    "the food is good",
    "the food is not good",
    "great service and great food",
    "service was not great",
    "i would not come back",
    "good food and good service",
]

# count distinct features for three n-gram ranges
counts = {}
for rng in [(1, 1), (1, 2), (1, 3)]:
    vec = CountVectorizer(ngram_range=rng)
    vec.fit(corpus)
    counts[rng] = len(vec.get_feature_names_out())
    print("ngram_range", rng, "->", counts[rng], "features")
# ngram_range (1, 1) -> 12 features
# ngram_range (1, 2) -> 31 features
# ngram_range (1, 3) -> 45 features
# (sklearn's default token pattern drops 1-char tokens like "i")

# the (1,2) bag now has "not good" as its OWN feature, distinct from "good"
vec12 = CountVectorizer(ngram_range=(1, 2)).fit(corpus)
vocab = vec12.vocabulary_
print('"good" in vocab     :', "good" in vocab)        # True
print('"not good" in vocab :', "not good" in vocab)    # True  <- recovered negation

# the cost: a wider, sparser document x feature matrix
X = vec12.transform(corpus)
print("matrix shape", X.shape, "nonzeros", X.nnz,
      "sparsity %.1f%%" % (100 * (1 - X.nnz / (X.shape[0] * X.shape[1]))))

import matplotlib.pyplot as plt
ranges = ["(1,1)", "(1,2)", "(1,3)"]
vals = [counts[(1, 1)], counts[(1, 2)], counts[(1, 3)]]
plt.bar(ranges, vals, color=["#4ea1ff", "#7ee787", "#ffb454"])
plt.ylabel("number of distinct features")
plt.title("Feature count explodes as ngram_range widens")
for i, v in enumerate(vals):
    plt.text(i, v, str(v), ha="center", va="bottom")
plt.show()`
  };
})();
