/* =====================================================================
   STANDALONE LESSON — Filtering for cleaner text features.
   Feature Engineering for Machine Learning (Zheng & Casari, O'Reilly 2018),
   Chapter 3: "Filtering for Cleaner Features".
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - HTML teaching fields; math in $...$ / $$...$$ with DOUBLED backslashes
     - a worked example with real numbers and a real-data CODEVIZ
   Pushed into window.LESSONS; its code/codeviz merged into window.CODE/CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-text-filtering",
    title: "Filtering for cleaner text features",
    tagline: "Throw away the words that carry no signal — stopwords, the too-common and too-rare, and word variants — so your bag-of-words is small and meaningful.",
    module: "Feature Engineering",
    prereqs: [],

    whenToUse:
      `<p>You filter text <b>around</b> the moment you turn it into a bag-of-words. The goal is a smaller, cleaner vocabulary — fewer columns, each carrying real signal.</p>
       <p>Reach for each tool when:</p>
       <ul>
         <li><b>Stopword removal</b> — drop ultra-common function words ("the", "a", "is", "and"). They appear everywhere, so they tell you almost nothing about <i>which</i> document is which. Use a ready-made list (<code>stop_words='english'</code>) as your first pass.</li>
         <li><b>Frequency-based filtering</b> — when a stopword list is not enough. Drop words that appear in <i>almost every</i> document (they act like stopwords for your corpus) and words that appear only <i>once or twice</i> (likely typos, names, or noise). This prunes both tails of the word-frequency curve.</li>
         <li><b>Stemming (or lemmatization)</b> — when variants of one word ("flower", "flowers", "flowering") are splitting your counts across several columns. Stemming collapses them to one root so they count as a single feature.</li>
       </ul>
       <p>Rule of thumb: always clean text before vectorizing. Use <code>min_df</code> / <code>max_df</code> to prune the frequency tails, and stemming/lemmatization to merge variants.</p>`,

    application:
      `<p>The book demonstrates all three on the <b>Yelp reviews dataset</b> (the Yelp Dataset Challenge, Round 6 — millions of business reviews). Building a bag-of-words straight from raw review text gives a huge, noisy vocabulary: every misspelling and every word ending becomes its own feature.</p>
       <p>In real pipelines this filtering is standard. Search engines strip stopwords before indexing. Topic-modeling and document-classification systems prune rare and over-common words to shrink the feature matrix. Sentiment and review systems stem variants so "love", "loved", and "loving" reinforce one signal instead of three weak ones. The book's own examples wire these directly into scikit-learn's <code>CountVectorizer</code> (the data is on the book's GitHub: github.com/alicezheng/feature-engineering-book).</p>`,

    pitfalls:
      `<ul>
         <li><b>Stopword lists are domain-specific.</b> Generic lists remove "not", "no", "never" — which are exactly the words that flip the meaning in sentiment analysis. Removing them turns "not good" into "good". Fix: customize the list for your task; keep negation words when polarity matters.</li>
         <li><b>Over-stemming merges distinct words.</b> The Porter stemmer maps "news" &rarr; "new", collapsing two unrelated meanings into one feature. It also crushes "universal", "university", and "universe" toward the same root. Fix: prefer lemmatization (dictionary-aware) when precision matters, and inspect the merges.</li>
         <li><b>Filtering thresholds must be fit on the training set only.</b> The vocabulary, the <code>min_df</code>/<code>max_df</code> cutoffs, and which words survive are all learned from data. Fit the vectorizer on train, then <code>transform</code> validation and test with that same fitted vocabulary — never refit on test, or you leak information.</li>
         <li><b>It is language-specific.</b> An English stopword list and an English stemmer do nothing useful for French or Chinese text. Fix: use the right list and stemmer per language (and tokenization itself differs by language).</li>
         <li><b>Too-aggressive frequency cutoffs delete signal.</b> A rare but highly informative word (a product name, a key symptom) can sit in the rare tail. Fix: tune <code>min_df</code>/<code>max_df</code> and check what got dropped.</li>
       </ul>`,

    bigIdea:
      `<p>A bag-of-words turns each document into a long vector of word counts. But most of those words are useless. A few function words appear so often they drown out everything; a long tail of words appears once and is probably noise. <b>Filtering</b> deletes the useless columns so the useful ones stand out.</p>
       <p>The book gives three complementary filters:</p>
       <ul class="steps">
         <li><b>Stopwords.</b> A fixed list of ultra-common, low-meaning words to delete outright ("the", "a", "is", "of", "and").</li>
         <li><b>Frequency-based filtering.</b> Look at how many documents each word appears in. Delete the <i>too-frequent</i> (top tail — they behave like stopwords for your corpus) and the <i>too-rare</i> (bottom tail — likely typos/noise). The book plots the word-frequency curve and shows both tails are unhelpful.</li>
         <li><b>Stemming.</b> Collapse word variants to a common root so they count as one feature: "flowers" &rarr; "flower", "swimming" &rarr; "swim".</li>
       </ul>
       <p>Same goal — a small, meaningful vocabulary — attacked from three angles: by meaning (stopwords), by frequency (the tails), and by morphology (stemming).</p>`,

    buildup:
      `<p>Start from the bag-of-words. For a corpus of $D$ documents, you build a <b>vocabulary</b> of every distinct word; each document becomes a row of counts. The number of distinct words is the <b>vocabulary size</b> $V$ — that is how many feature columns you have.</p>
       <p>Filtering shrinks $V$. To decide what to cut, we need one key number per word: the <b>document frequency</b>. The document frequency of a word, written $\\mathrm{df}(w)$, is the number of documents that contain word $w$ at least once. (Not the total count — just <i>how many documents</i> have it.)</p>
       <p>Now the two tails:</p>
       <ul class="steps">
         <li><b>The high-frequency tail.</b> Words with $\\mathrm{df}(w)$ close to $D$ appear in almost every document. They cannot distinguish documents, so they are uninformative — corpus-specific stopwords. Cut with an upper cutoff <code>max_df</code>.</li>
         <li><b>The low-frequency tail.</b> Words with $\\mathrm{df}(w) = 1$ or $2$ appear in just one or two documents. They are often typos, rare names, or noise, and a model cannot learn anything reliable from them. Cut with a lower cutoff <code>min_df</code>.</li>
       </ul>
       <p>Stopword removal is the special, hand-curated version of cutting the high tail. Stemming is orthogonal: it happens at tokenization time, before counting, by replacing each word with its root so variants merge into one vocabulary entry.</p>`,

    symbols: [
      { sym: "$D$", desc: "the number of documents in the corpus (here, the number of reviews)." },
      { sym: "$V$", desc: "the vocabulary size: the number of distinct words kept, which equals the number of feature columns." },
      { sym: "$w$", desc: "a single word (a token) in the vocabulary." },
      { sym: "$\\mathrm{df}(w)$", desc: "the document frequency of word $w$: how many of the $D$ documents contain $w$ at least once." },
      { sym: "$\\mathrm{min\\_df}$", desc: "the lower cutoff. Keep a word only if $\\mathrm{df}(w) \\ge \\mathrm{min\\_df}$. Drops the rare tail (typos, noise)." },
      { sym: "$\\mathrm{max\\_df}$", desc: "the upper cutoff. Keep a word only if it appears in at most this many documents (often given as a fraction of $D$). Drops the too-common tail." },
      { sym: "$\\mathrm{stem}(w)$", desc: "the root that a stemmer maps word $w$ to. Variants with the same root collapse to one feature, e.g. $\\mathrm{stem}(\\text{flowers}) = \\text{flower}$." }
    ],

    formula:
      `$$ \\text{keep word } w \\iff \\Big(\\,\\mathrm{df}(w) \\ge \\mathrm{min\\_df}\\,\\Big)\\ \\text{ and }\\ \\Big(\\,\\mathrm{df}(w) \\le \\mathrm{max\\_df}\\,\\Big)\\ \\text{ and }\\ \\big(w \\notin \\text{stopwords}\\big) $$
       $$ \\mathrm{df}(w) = \\sum_{d=1}^{D} \\mathbb{1}\\big[\\,w \\in \\text{document } d\\,\\big], \\qquad \\text{(stemming first replaces each token } w \\text{ by } \\mathrm{stem}(w)\\text{)} $$`,

    whatItDoes:
      `<p>The filter is a logical AND of simple per-word tests. A word survives into the final vocabulary only if it passes <i>all</i> of them:</p>
       <ul>
         <li><b>Stopword test:</b> the word is not on the stopword list.</li>
         <li><b>Lower-tail test:</b> $\\mathrm{df}(w) \\ge \\mathrm{min\\_df}$ — it appears in enough documents to be trusted.</li>
         <li><b>Upper-tail test:</b> $\\mathrm{df}(w) \\le \\mathrm{max\\_df}$ — it does not appear in so many documents that it is uninformative.</li>
       </ul>
       <p>$\\mathrm{df}(w)$ is just a count of documents containing $w$ (the indicator $\\mathbb{1}[\\cdot]$ is $1$ when the word is in document $d$, else $0$, summed over all $D$ documents). <code>max_df=0.9</code> means "drop any word appearing in more than 90% of documents". <code>min_df=2</code> means "drop any word appearing in fewer than 2 documents".</p>
       <p><b>Stemming</b> happens one step earlier, during tokenization: each token $w$ is replaced by $\\mathrm{stem}(w)$ before counting, so "flower", "flowers", and "flowering" all become the same column. The net effect of every filter is the same: a smaller $V$, with each surviving column carrying more signal.</p>`,

    derivation:
      `<p><b>Why both tails are useless — the book's word-frequency plot.</b> Zheng & Casari plot how many documents each word appears in, words sorted from most to least frequent. The curve is extremely skewed (a Zipf-like shape): a handful of words appear in nearly every document, then frequency falls off a cliff into a very long flat tail of words that appear once or twice.</p>
       <p>The <b>top of the curve</b> is the function words — "the", "and", "of". A word in (almost) every document has $\\mathrm{df}(w) \\approx D$. Think of what a feature is for: to <i>separate</i> documents. A column that is non-zero for every row separates nothing; its information content is near zero. So the top tail is dead weight. That is exactly why stopword lists exist, and why <code>max_df</code> generalizes them to your specific corpus.</p>
       <p>The <b>bottom of the curve</b> is the rare words. A word with $\\mathrm{df}(w) = 1$ touches a single document. A model cannot estimate anything reliable from one example — it usually just memorizes that one document, which is overfitting. Many of these are typos ("greaaat"), one-off names, or junk. Cutting them with <code>min_df</code> removes huge numbers of columns at almost no loss of signal, because the long tail is where most of the vocabulary <i>lives</i> but almost none of the <i>information</i> is.</p>
       <p><b>Why stemming helps.</b> If "flower" appears in 3 documents and "flowers" in 3 others, each is a weak, half-strength feature, and the rare-word filter might even delete both. Merge them and you get one column with $\\mathrm{df} = 6$ — a stronger, more reliable feature. Stemming trades a little precision (the over-collapse risk, "news" &rarr; "new") for denser, less fragmented counts.</p>`,

    example:
      `<p>Take this tiny 5-review corpus ($D = 5$):</p>
       <ol>
         <li><code>The food was great and the service was great</code></li>
         <li><code>The pizza is the best pizza in the city</code></li>
         <li><code>Service was slow but the food was good</code></li>
         <li><code>A great place with great food and great drinks</code></li>
         <li><code>The best food and the best service ever</code></li>
       </ol>
       <p><b>No filtering.</b> Count every distinct word. The vocabulary has $V = 18$ words: <code>and, best, but, city, drinks, ever, food, good, great, in, is, pizza, place, service, slow, the, was, with</code>. The top words by total count are "the" (8), "great" (5), "was" (4), "food" (4) — three of those four are function words carrying no topic signal.</p>
       <p><b>Remove English stopwords.</b> Out go "the", "and", "was", "is", "in", "but", "a", "with", "ever". Vocabulary shrinks to $V = 10$: <code>best, city, drinks, food, good, great, pizza, place, service, slow</code>. Now the top words are "great" (5), "food" (4), "service" (3), "best" (3) — all meaningful.</p>
       <p><b>Add frequency filtering (<code>min_df=2</code>).</b> Drop any word in fewer than 2 documents. That deletes the rare tail: "city", "drinks", "good", "pizza", "place", "slow" each appear in only one review. Vocabulary shrinks to $V = 4$: <code>best, food, great, service</code> — a tiny, dense, high-signal feature set.</p>
       <p>So $V$ fell $18 \\rightarrow 10 \\rightarrow 4$, and what remains are exactly the words you would use to describe a restaurant review. (Separately, a Porter stemmer would map "flowers" &rarr; "flower" and "swimming" &rarr; "swim", merging variants — but watch the over-collapse "news" &rarr; "new".)</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // small English stopword set (a representative slice of sklearn's list)
      var STOP = { "the": 1, "a": 1, "an": 1, "and": 1, "or": 1, "but": 1, "is": 1, "was": 1, "were": 1, "are": 1, "be": 1, "in": 1, "on": 1, "of": 1, "to": 1, "with": 1, "for": 1, "it": 1, "this": 1, "that": 1, "ever": 1, "at": 1, "by": 1 };
      var corpus = [
        "The food was great and the service was great",
        "The pizza is the best pizza in the city",
        "Service was slow but the food was good",
        "A great place with great food and great drinks",
        "The best food and the best service ever"
      ];
      function tok(s) { return s.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean); }
      // build vocab + per-word document-frequency under given filters
      function build(removeStop, minDf) {
        var df = {};
        corpus.forEach(function (doc) {
          var seen = {};
          tok(doc).forEach(function (w) {
            if (removeStop && STOP[w]) return;
            if (!seen[w]) { seen[w] = 1; df[w] = (df[w] || 0) + 1; }
          });
        });
        var vocab = Object.keys(df).filter(function (w) { return df[w] >= minDf; });
        return vocab.length;
      }
      var v0 = build(false, 1), v1 = build(true, 1), v2 = build(true, 2);
      var wrap = document.createElement("div"); wrap.style.marginBottom = "8px";
      wrap.innerHTML = "<div style='font-size:12px;margin-bottom:6px'>5 short reviews &mdash; watch the vocabulary (feature columns) shrink as you filter:</div>";
      host.appendChild(wrap);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 240; host.appendChild(cv);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function draw() {
        var c = C();
        if (window.Charts) {
          window.Charts.draw(cv, {
            type: "bars",
            title: "Vocabulary size V shrinks as filters are added",
            labels: ["no filtering", "stopwords removed", "stopwords + min_df=2"],
            values: [v0, v1, v2],
            valueLabels: ["" + v0, "" + v1, "" + v2],
            colors: [c.warn, c.accent, c.accent2]
          });
        }
        rd.innerHTML = "Vocabulary fell " + v0 + " &rarr; " + v1 + " &rarr; " + v2 +
          ". Removing stopwords drops uninformative function words; <code>min_df=2</code> then deletes the rare tail (words in only one review). Fewer columns, each carrying more signal.";
      }
      draw();
    },

    practice: [
      {
        q: `A corpus has $D = 100$ documents. The word "data" appears in 98 of them and the word "quux" appears in just 1. You set <code>CountVectorizer(min_df=2, max_df=0.9)</code>. Which of the two words survives, and why?`,
        steps: [
          { do: `Compute document frequencies: $\\mathrm{df}(\\text{data}) = 98$, $\\mathrm{df}(\\text{quux}) = 1$.`, why: `Filtering decisions use $\\mathrm{df}$, the number of documents containing the word.` },
          { do: `Apply max_df: $\\mathrm{max\\_df} = 0.9 \\times 100 = 90$. "data" has $\\mathrm{df} = 98 \\gt 90$, so it is dropped (too common).`, why: `A word in 98% of documents cannot separate documents — it behaves like a stopword.` },
          { do: `Apply min_df: $\\mathrm{min\\_df} = 2$. "quux" has $\\mathrm{df} = 1 \\lt 2$, so it is dropped (too rare).`, why: `A word in a single document is likely noise; a model cannot learn from one example.` }
        ],
        answer: `Neither survives. "data" is cut by <code>max_df</code> (too common, the high tail), and "quux" is cut by <code>min_df</code> (too rare, the low tail). The filter prunes both ends of the word-frequency curve.`
      },
      {
        q: `You are building a <b>sentiment</b> classifier and you apply <code>stop_words='english'</code>. Reviews like "not good" and "good" now look identical. What went wrong, and how do you fix it?`,
        steps: [
          { do: `Check the stopword list: standard English lists include negation words like "not", "no", "never".`, why: `Generic stopword lists are built for topic/search tasks, not sentiment.` },
          { do: `Realize that removing "not" turns "not good" into "good", flipping the label.`, why: `Negation words are low-information for topics but high-information for polarity.` },
          { do: `Customize the stopword list: keep negation words (and other polarity-bearing words) for sentiment.`, why: `Stopword lists are domain-specific; the right list depends on the task.` }
        ],
        answer: `The generic English stopword list removed "not", erasing the negation. Fix: customize the list for sentiment by keeping negation words (e.g. remove them from the stopword set). Stopword filtering is domain-specific.`
      },
      {
        q: `A Porter stemmer maps "universities" and "university" both to "univers", which helps. But it also maps "news" to "new". Explain the trade-off and one safer alternative.`,
        steps: [
          { do: `Stemming chops suffixes by rule, with no dictionary. Merging "universities"/"university" is good: same meaning, now one denser feature.`, why: `Collapsing true variants strengthens the count and reduces vocabulary size.` },
          { do: `But "news" &rarr; "new" merges two unrelated words ("news" the noun, "new" the adjective).`, why: `Rule-based stemming over-collapses because it ignores meaning — the classic Porter pitfall.` },
          { do: `Use lemmatization instead, which uses a dictionary and part-of-speech, so "news" stays "news".`, why: `Lemmatization is meaning-aware and avoids these spurious merges, at higher cost.` }
        ],
        answer: `Stemming trades precision for denser features: good merges (university variants) come with bad ones (news&rarr;new). A safer, dictionary-aware alternative is lemmatization, which keeps "news" distinct from "new".`
      }
    ]
  });

  window.CODE["fe-text-filtering"] = {
    lib: "scikit-learn, nltk, pandas",
    runnable: false,
    explain: `<p>The book's Chapter 3 recipe on the <b>Yelp reviews</b> dataset. Stopword removal and both frequency tails are handled by a single <code>CountVectorizer</code> with <code>stop_words='english'</code>, <code>min_df</code>, and <code>max_df</code>. Stemming is shown separately with NLTK's Porter stemmer (including the over-stemming gotcha "news" &rarr; "new"). Download the data from the book's GitHub: github.com/alicezheng/feature-engineering-book.</p>`,
    code: `# pip install scikit-learn nltk pandas
# Dataset: Yelp reviews (Yelp Dataset Challenge). Get it via the book's repo:
#   github.com/alicezheng/feature-engineering-book
import json
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer

# --- load a slice of Yelp reviews into a DataFrame ---
with open('yelp_academic_dataset_review.json') as f:
    reviews = pd.DataFrame([json.loads(line) for line in f][:10000])
texts = reviews['text']

# --- 1) Bag-of-words with NO filtering: huge, noisy vocabulary ---
bow = CountVectorizer()
X_raw = bow.fit_transform(texts)
print("no filtering  : vocab size =", len(bow.get_feature_names_out()))

# --- 2) Remove English stopwords (ultra-common function words) ---
bow_stop = CountVectorizer(stop_words='english')
X_stop = bow_stop.fit_transform(texts)
print("stopwords     : vocab size =", len(bow_stop.get_feature_names_out()))

# --- 3) Frequency-based filtering: drop the rare tail (min_df) AND the
#        too-common tail (max_df). This prunes both ends of the curve. ---
bow_freq = CountVectorizer(stop_words='english', min_df=2, max_df=0.9)
X_freq = bow_freq.fit_transform(texts)
print("stop+min/max  : vocab size =", len(bow_freq.get_feature_names_out()))
# min_df=2  -> drop words appearing in fewer than 2 documents (typos, noise)
# max_df=0.9-> drop words appearing in more than 90% of documents (de-facto stopwords)

# --- 4) Stemming with the Porter stemmer: collapse variants to a root ---
import nltk
from nltk.stem.porter import PorterStemmer
stemmer = PorterStemmer()
print(stemmer.stem('flowers'))   # -> 'flower'
print(stemmer.stem('swimming'))  # -> 'swim'
print(stemmer.stem('news'))      # -> 'new'   (over-stemming! 'news' != 'new')

# Plug stemming into the tokenizer so variants merge into one feature:
import re
def stemmed_tokens(doc):
    tokens = re.findall(r"[a-z]+", doc.lower())
    return [stemmer.stem(t) for t in tokens]

bow_stem = CountVectorizer(tokenizer=stemmed_tokens, stop_words='english',
                           min_df=2, max_df=0.9)
X_stem = bow_stem.fit_transform(texts)
print("stemmed       : vocab size =", len(bow_stem.get_feature_names_out()))

# Fit the vocabulary on TRAIN only, then transform val/test with it (no leakage):
# bow_freq.fit(train_texts); X_val = bow_freq.transform(val_texts)`
  };

  window.CODEVIZ["fe-text-filtering"] = {
    question: "How do you READ a text-filtering diagram? The ideal vocabulary-shrink, the Zipf word-frequency curve the cutoffs act on, and two ways filtering goes wrong.",
    charts: [
      {
        type: "bars",
        title: "Ideal: vocabulary V shrinks as each filter is added",
        xlabel: "filtering applied",
        ylabel: "vocabulary size V (number of feature columns)",
        labels: ["no filtering", "stopwords removed", "stopwords + min_df=2"],
        values: [18, 10, 4],
        valueLabels: ["18", "10", "4"],
        colors: ["#9aa7b4", "#4ea1ff", "#7ee787"],
        interpret: "Five short restaurant reviews, real counts from CountVectorizer. The x-axis lists filters added left to right; bar height is V, the number of surviving word columns. Read the <b>downward staircase</b>: 18 raw words (dominated by \"the\" x8, \"was\" x4), down to 10 after dropping English stopwords (now \"great\", \"food\", \"service\", \"best\" lead), down to 4 dense high-signal features after min_df=2. Falling bars with the surviving words still meaningful = healthy filtering."
      },
      {
        type: "line",
        title: "The curve cutoffs act on: Zipf word-frequency, both tails dead",
        xlabel: "word rank (most frequent = 1, on the left)",
        ylabel: "document frequency df(w)  (how many docs contain it)",
        series: [{
          name: "df(w) by rank",
          color: "#4ea1ff",
          points: [[1, 98], [2, 92], [3, 80], [4, 55], [6, 30], [10, 14], [20, 6], [40, 3], [80, 2], [160, 1], [300, 1]]
        }],
        interpret: "Illustrative, corpus of 100 docs. X-axis is word rank (commonest word at left); y-axis is df(w), the number of documents a word appears in. The curve is <b>steep at the left then a long flat tail at the bottom</b> — the Zipf shape. The left shoulder (df near 100) is function words that appear everywhere and separate nothing: max_df cuts them. The endless flat tail (df = 1 or 2) is typos and one-off names a model cannot learn from: min_df cuts them. You keep the informative middle."
      },
      {
        type: "bars",
        title: "Trap: over-stemming merges unrelated words into one column",
        xlabel: "stem produced (and what got merged into it)",
        ylabel: "document frequency df of the merged stem",
        labels: ["univers (good)", "new=news (BAD)", "organ=organize (BAD)"],
        values: [9, 12, 8],
        valueLabels: ["9", "12", "8"],
        colors: ["#7ee787", "#ff7b72", "#ff7b72"],
        interpret: "Illustrative. Each bar is one stem the Porter stemmer produced; height is the df it ended up with after merging. The green bar is a GOOD merge: \"university\"/\"universities\" -> \"univers\", same meaning, one denser feature. The red bars are the trap — \"news\" crushed into \"new\", and \"organ\" merged with \"organize\". The tell: <b>a single column secretly mixes two unrelated meanings</b>, which you only catch by inspecting the merge list. When precision matters, prefer dictionary-aware lemmatization, which keeps \"news\" distinct from \"new\"."
      },
      {
        type: "bars",
        title: "Trap: min_df too high deletes a rare but informative word",
        xlabel: "word (its document frequency)",
        ylabel: "document frequency df(w)",
        labels: ["food (40)", "great (33)", "antibiotic (3)", "min_df=5 line"],
        values: [40, 33, 3, 5],
        valueLabels: ["40", "33", "3 -> CUT", "cutoff=5"],
        colors: ["#7ee787", "#7ee787", "#ff7b72", "#9aa7b4"],
        interpret: "Illustrative. Bar height is each word's df(w); the grey bar marks the min_df=5 cutoff. \"food\" and \"great\" (green) sit well above the line and survive. But \"antibiotic\" (red, df=3) falls below the cutoff and is deleted — even though in a medical-review task it may be exactly the word you care about. The lesson: a cutoff is blind to meaning, so <b>a rare bar below the line is not automatically noise</b>. After setting min_df/max_df, inspect what got dropped and loosen the cutoff if a signal word is in the casualty list."
      }
    ],
    caption: "How to read text-filtering diagrams: the ideal vocabulary-shrink staircase, the Zipf curve the min_df/max_df cutoffs actually slice, and two failure modes — over-stemming collapsing distinct words, and a min_df set so high it deletes a rare-but-useful word. Each chart self-explains below it. Book uses Yelp; this is the same idea on an inline corpus.",
    code: `import numpy as np
from sklearn.feature_extraction.text import CountVectorizer

corpus = [
    "The food was great and the service was great",
    "The pizza is the best pizza in the city",
    "Service was slow but the food was good",
    "A great place with great food and great drinks",
    "The best food and the best service ever",
]

# 1) No filtering: full bag-of-words vocabulary
bow = CountVectorizer()
X0 = bow.fit_transform(corpus)
print("no filtering :", len(bow.get_feature_names_out()))   # 18

# 2) Remove English stopwords (the, a, is, was, and, ...)
bow_stop = CountVectorizer(stop_words='english')
X1 = bow_stop.fit_transform(corpus)
print("stopwords    :", len(bow_stop.get_feature_names_out()))  # 10

# 3) Stopwords + frequency filtering: drop the rare tail (min_df=2)
bow_freq = CountVectorizer(stop_words='english', min_df=2)
X2 = bow_freq.fit_transform(corpus)
print("stop+min_df  :", len(bow_freq.get_feature_names_out()))  # 4
print("survivors    :", sorted(bow_freq.get_feature_names_out()))
# ['best', 'food', 'great', 'service']

# Most-frequent tokens before vs after stopword removal (total counts):
def top_tokens(vec, X, k=4):
    counts = np.asarray(X.sum(axis=0)).ravel()
    feats = vec.get_feature_names_out()
    order = counts.argsort()[::-1][:k]
    return [(feats[i], int(counts[i])) for i in order]
print("top, no filter:", top_tokens(bow, X0))   # the:8, great:5, was:4, food:4
print("top, stopwords:", top_tokens(bow_stop, X1))  # great:5, food:4, service:3, best:3

import matplotlib.pyplot as plt
labels = ["no filtering", "stopwords", "stopwords+min_df=2"]
sizes = [len(bow.get_feature_names_out()),
         len(bow_stop.get_feature_names_out()),
         len(bow_freq.get_feature_names_out())]
plt.bar(labels, sizes, color=["#ffb454", "#4ea1ff", "#7ee787"])
plt.ylabel("vocabulary size V"); plt.title("Filtering shrinks the bag-of-words")
for i, v in enumerate(sizes):
    plt.text(i, v + 0.2, str(v), ha="center")
plt.show()`
  };
})();
