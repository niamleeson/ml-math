/* =====================================================================
   FEATURE ENGINEERING (Zheng & Casari) — Chapter 4:
   "The Effects of Feature Scaling: From Bag-of-Words to Tf-Idf".
   tf-idf as a column-scaling of the bag-of-words matrix.
   Self-contained: registers the lesson, its CODE, and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-tfidf",
    title: "From bag-of-words to tf-idf: scaling text features",
    tagline: "Weight each word by how rare it is across documents, so common words stop drowning out the signal.",
    module: "Feature Engineering",
    prereqs: ["met-distribution"],

    whenToUse:
      `<p><b>Reach for tf-idf (term frequency–inverse document frequency) whenever you turn text into numbers for a classifier, search engine, or ranker and a few very common words threaten to dominate.</b> It is the standard upgrade to a plain bag-of-words (BoW) count matrix.</p>
       <p>In a bag-of-words representation each document becomes a row of word counts: column $w$ holds how many times word $w$ appears in that document. The trouble is scale. Words like "the", "and", "food" appear in almost every review, so their counts are large and present everywhere — yet they tell you almost nothing about <i>which</i> review this is.</p>
       <p>tf-idf fixes this by <b>rescaling each column</b>: it multiplies every count by a per-word weight that shrinks for words seen in many documents and grows for words seen in few. The result down-weights boilerplate and up-weights the rare, document-specific words that actually carry the signal.</p>
       <ul>
         <li><b>Use it</b> as a feature-scaling step on top of BoW for text classification, search, and ranking baselines.</li>
         <li><b>Use it</b> whenever common words drown out the distinctive ones.</li>
         <li><b>Skip it</b> only when you have moved to learned embeddings (word2vec, transformers) that capture meaning and order — tf-idf is still bag-of-words and ignores word order entirely.</li>
       </ul>`,

    application:
      `<p>The book's running example in Chapter 4 is <b>classifying Yelp reviews</b> (the Yelp Dataset Challenge, round 6 — available from <code>yelp.com/dataset</code>, and prepared in the book's repo at <code>github.com/alicezheng/feature-engineering-book</code>). Zheng &amp; Casari build a bag-of-words matrix over the review text, then compare three feature representations feeding the same logistic-regression classifier:</p>
       <ul>
         <li><b>Plain bag-of-words</b> (raw counts).</li>
         <li><b>L2-normalized bag-of-words</b> (each document row scaled to unit length).</li>
         <li><b>tf-idf</b> (each column scaled by inverse document frequency).</li>
       </ul>
       <p>The honest finding: across these three, the accuracy differences are <b>small</b>. What moves the needle more is doing proper cross-validation and <b>tuning the regularization strength</b> $C$ of the logistic regression with a grid search. The chapter's real lesson is that a tidy feature transform matters less than disciplined model selection. tf-idf shows up everywhere — search-engine ranking (it is the heart of classic TF-IDF retrieval), document clustering, spam filtering, and as the default text vectorizer in countless scikit-learn pipelines.</p>`,

    pitfalls:
      `<ul>
         <li><b>Fitting the idf on the test set.</b> The inverse document frequency must be learned from the <i>training</i> documents only. Test documents reuse the train idf — <code>transformer.fit(X_train)</code> then <code>transformer.transform(X_test)</code>, never <code>fit_transform</code> on the test data. Refitting on test leaks information and inflates your score.</li>
         <li><b>Expecting tf-idf to capture meaning.</b> It is still <b>bag-of-words</b>: no word order, no syntax, no context. "dog bites man" and "man bites dog" get identical vectors. For order or semantics you need n-grams or learned embeddings.</li>
         <li><b>Treating the scaling choice as the main lever.</b> The book's own experiment shows plain BoW, L2-normalized BoW, and tf-idf land close together; tuning the regularization $C$ with cross-validation matters more. Don't agonize over the transform before you've tuned the model.</li>
         <li><b>Forgetting the smoothing and sublinear variants.</b> Raw $\\log(N/n_w)$ blows up or hits zero at the extremes. scikit-learn's default <b>smooths</b> idf as $\\log\\frac{1+N}{1+n_w}+1$ (as if every word appeared in one extra document) and can apply <b>sublinear tf</b>, replacing the raw count by $1+\\log(\\text{count})$ so a word seen 100 times isn't worth 100 times one seen once. Know which variant you're using.</li>
         <li><b>Skipping document normalization.</b> scikit-learn L2-normalizes each tf-idf row by default. Long documents have larger raw counts; without normalization they would dominate purely by length.</li>
       </ul>`,

    bigIdea:
      `<p>Start with the bag-of-words matrix $X$: one row per document, one column per word, each entry a raw count. tf-idf is nothing more than <b>scaling each column</b> of that matrix by a single number, the word's inverse document frequency (idf).</p>
       <p>The idf is large for rare words (seen in few documents) and small — near zero — for words seen in nearly every document. Multiply a column of counts by its idf and you stretch the rare, distinctive words while flattening the ubiquitous boilerplate.</p>
       <p>So tf-idf is a <b>column-scaling transform</b>: it does not change which documents contain which words, only how loudly each word gets to speak. The loud words become the rare, informative ones.</p>`,

    buildup:
      `<p>Think of a corpus of $N$ documents. For a word $w$, let $n_w$ be the number of documents that contain $w$ at least once — its <b>document frequency</b>.</p>
       <p>A word in almost every document has $n_w \\approx N$, so $N/n_w \\approx 1$ and $\\log(N/n_w) \\approx 0$: the word is nearly silenced. A word in just one document has $n_w = 1$, so $N/n_w = N$ and $\\log N$ is as large as the weight gets: the word is amplified.</p>
       <p>The <b>term frequency</b> $\\text{tf}(w,d)$ is just how often $w$ appears in document $d$ — the original bag-of-words count. Multiply tf by idf and you get the tf-idf weight: frequent <i>within this document</i>, but rare <i>across the corpus</i>, scores highest.</p>`,

    symbols: [
      { sym: "$N$", desc: "the total number of documents in the corpus (e.g. the number of Yelp reviews)." },
      { sym: "$d$", desc: "one document (one review)." },
      { sym: "$w$", desc: "one word (one column / feature in the bag-of-words matrix)." },
      { sym: "$\\text{tf}(w,d)$", desc: "term frequency: how many times word $w$ appears in document $d$ — the raw bag-of-words count." },
      { sym: "$n_w$", desc: "document frequency: the number of documents that contain word $w$ at least once." },
      { sym: "$\\text{idf}(w)$", desc: "inverse document frequency: a per-word weight, large for rare words and near zero for ubiquitous ones." },
      { sym: "$\\text{tfidf}(w,d)$", desc: "the final weight of word $w$ in document $d$: term frequency times inverse document frequency." }
    ],

    formula: `$$ \\text{tf}(w,d)=\\big(\\text{count of } w \\text{ in } d\\big) \\qquad \\text{idf}(w)=\\log\\frac{N}{\\,n_w\\,} \\qquad \\text{tfidf}(w,d)=\\text{tf}(w,d)\\,\\cdot\\,\\text{idf}(w) $$`,

    whatItDoes:
      `<p>The first piece, <b>tf</b>, is the plain bag-of-words count: it measures how important word $w$ is <i>inside</i> document $d$. The more often a word shows up in this document, the more it describes it.</p>
       <p>The second piece, <b>idf</b> $=\\log\\frac{N}{n_w}$, measures how rare word $w$ is <i>across</i> the whole corpus. When $w$ sits in nearly every document ($n_w \\to N$), the ratio $N/n_w \\to 1$ and its log $\\to 0$: the word is down-weighted toward silence. When $w$ is rare ($n_w$ small), $N/n_w$ is large and the log is large: the word is up-weighted.</p>
       <p>Multiplying them, <b>tfidf</b> rewards words that are frequent in <i>this</i> document yet rare in the corpus — exactly the distinctive, discriminative words. Because idf depends only on the word, not the document, applying it to every entry of a column is the same as <b>multiplying that whole column of the bag-of-words matrix by one constant</b>: tf-idf is a column-scaling.</p>`,

    derivation:
      `<p><b>Why idf is a column-scaling of the bag-of-words matrix.</b></p>
       <ul class="steps">
         <li>Let $X$ be the bag-of-words matrix: $X_{d,w}=\\text{tf}(w,d)$, the count of word $w$ in document $d$. Rows are documents, columns are words.</li>
         <li>The tf-idf matrix is $X'_{d,w}=X_{d,w}\\cdot\\text{idf}(w)$. The factor $\\text{idf}(w)$ depends only on the column index $w$, never on the row $d$.</li>
         <li>Multiplying every entry of column $w$ by the same constant $\\text{idf}(w)$ is exactly right-multiplying $X$ by a diagonal matrix: $X' = X\\,\\operatorname{diag}\\!\\big(\\text{idf}(w_1),\\dots,\\text{idf}(w_V)\\big)$. Each column is rescaled independently — that is what "column-scaling" means. $\\blacksquare$</li>
       </ul>
       <p><b>Why this helps a linear classifier.</b> A logistic regression learns one weight per column. If a useless common word has huge counts, it can swamp the gradient and the regularizer spends its budget taming that column. Shrinking common columns toward zero (small idf) and stretching rare informative columns (large idf) puts the features on a more comparable footing, so the optimizer and the regularizer focus on the columns that discriminate. The book stresses, though, that this effect is <b>modest</b>: on Yelp, properly tuning the regularization strength $C$ does more than the choice between BoW, L2-normalized BoW, and tf-idf.</p>`,

    example:
      `<p>Tiny corpus of $N=4$ short documents. The word "the" appears in all four; the word "delicious" appears in only one.</p>
       <ul class="steps">
         <li>For "the": $n_{\\text{the}}=4$, so $\\text{idf}(\\text{the})=\\log\\frac{4}{4}=\\log 1 = 0$. Whatever its count, its tf-idf weight is $0$ — fully silenced.</li>
         <li>For "delicious": $n_{\\text{delicious}}=1$, so $\\text{idf}(\\text{delicious})=\\log\\frac{4}{1}=\\log 4 \\approx 1.386$ (natural log).</li>
         <li>Suppose a review reads "the food the the delicious": tf of "the" $=3$, tf of "delicious" $=1$.</li>
         <li>tf-idf of "the" $=3\\times 0 = 0$. tf-idf of "delicious" $=1\\times 1.386 = 1.386$.</li>
         <li>So even though "the" is counted three times and "delicious" once, the raw count says "the" is $3\\times$ more important, while tf-idf says "the" is worth <b>nothing</b> and "delicious" carries all the signal. That is the down-weight-common, up-weight-rare effect in one line.</li>
       </ul>
       <p>(scikit-learn's default would smooth this — $\\text{idf}(\\text{the})=\\log\\frac{1+4}{1+4}+1=1$ rather than $0$ — so even ubiquitous words keep a small nonzero weight, but rare words still dominate.)</p>`,

    practice: [
      {
        q: `A corpus has $N=1000$ documents. Word "service" appears in 900 of them; word "mediocre" appears in 10. Using the book's plain idf $\\log(N/n_w)$ (natural log), which word does tf-idf trust more, and by how much per occurrence?`,
        steps: [
          { do: `Compute idf("service") = log(1000/900).`, why: `Document frequency 900 out of 1000 means the word is nearly ubiquitous, so the ratio is barely above 1.` },
          { do: `Compute idf("mediocre") = log(1000/10).`, why: `Document frequency 10 out of 1000 means the word is rare, so the ratio is 100 and its log is large.` },
          { do: `Compare the two idf values.`, why: `Each occurrence of the word contributes (count × idf), so the idf is the per-occurrence weight.` }
        ],
        answer: `<p>$\\text{idf}(\\text{service})=\\log(1000/900)=\\log(1.111)\\approx 0.105$. $\\text{idf}(\\text{mediocre})=\\log(1000/10)=\\log(100)\\approx 4.605$. tf-idf trusts "mediocre" about $4.605/0.105 \\approx 44\\times$ more per occurrence — the rare, distinctive word dominates even though "service" is counted far more often across the corpus.</p>`
      },
      {
        q: `You vectorize your training reviews with tf-idf and get 0.93 cross-validated accuracy. Eager to report test accuracy, you call <code>TfidfVectorizer().fit_transform(test_reviews)</code> and the score jumps. Why is this wrong, and what should you do?`,
        steps: [
          { do: `Notice that fit_transform re-learns the idf on the test set.`, why: `The idf weights (and the vocabulary) are now computed from test documents, which the model is supposed to have never seen.` },
          { do: `Recognize this as data leakage.`, why: `Test-set statistics have bled into the features; the inflated score does not reflect real-world performance on unseen text.` },
          { do: `Use the train-fitted vectorizer to only transform the test set.`, why: `The book's rule: idf is fit on train only; test documents reuse the train idf and vocabulary.` }
        ],
        answer: `<p>It is leakage: <code>fit_transform</code> on the test set recomputes the idf (and vocabulary) from data the model must not see, so the score is optimistic and meaningless. Fit the vectorizer once on the training reviews — <code>vec.fit(train)</code> — then call <code>vec.transform(test)</code> so the test documents reuse the train idf. In a pipeline, put the vectorizer inside the cross-validation so it is refit on each training fold only.</p>`
      }
    ]
  });

  window.CODE["fe-tfidf"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Faithful reproduction of Chapter 4's Yelp experiment. Build a bag-of-words matrix with <code>CountVectorizer</code>, derive an L2-normalized version and a tf-idf version with <code>TfidfTransformer</code>, then compare logistic-regression accuracy across all three — each tuned over the regularization strength $C$ with <code>GridSearchCV</code>. The point the book makes: the three feature representations score close together, and tuning $C$ matters more than the scaling choice. Get the Yelp Dataset Challenge data from <code>yelp.com/dataset</code>; the prepared notebooks live at <code>github.com/alicezheng/feature-engineering-book</code>.</p>`,
    code: `import pandas as pd
from sklearn.feature_extraction.text import (
    CountVectorizer, TfidfTransformer, TfidfVectorizer)
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, GridSearchCV

# Yelp reviews (Dataset Challenge round 6). Get the data from
# yelp.com/dataset; prepared notebooks: github.com/alicezheng/feature-engineering-book
# A binary task: predict whether a review is for a restaurant (1) or not (0).
review_df = pd.read_json('yelp_academic_dataset_review.json', lines=True)
texts  = review_df['text']
labels = review_df['target']        # 0/1 class column prepared as in the book

train_x, test_x, train_y, test_y = train_test_split(
    texts, labels, train_size=0.7, random_state=123)

# 1) BAG-OF-WORDS: raw counts. Fit the vocabulary on TRAIN only.
bow = CountVectorizer()
X_tr_bow = bow.fit_transform(train_x)
X_te_bow = bow.transform(test_x)            # reuse train vocabulary

# 2) L2-NORMALIZED bag-of-words: scale each document row to unit length.
l2 = TfidfTransformer(norm='l2', use_idf=False)   # norm only, no idf
X_tr_l2 = l2.fit_transform(X_tr_bow)
X_te_l2 = l2.transform(X_te_bow)

# 3) TF-IDF: column-scale the counts by inverse document frequency.
#    idf is FIT ON TRAIN; the test set reuses the train idf.
tfidf = TfidfTransformer()                  # norm='l2', use_idf=True by default
X_tr_tfidf = tfidf.fit_transform(X_tr_bow)
X_te_tfidf = tfidf.transform(X_te_bow)
# (TfidfVectorizer() == CountVectorizer() + TfidfTransformer() in one step.)

def tuned_logreg(Xtr, ytr, Xte, yte):
    """GridSearchCV over the regularization strength C, then test accuracy."""
    grid = {'C': [1e-3, 1e-2, 1e-1, 1.0, 10.0, 100.0]}
    search = GridSearchCV(LogisticRegression(max_iter=1000), grid, cv=5)
    search.fit(Xtr, ytr)
    return search.best_params_['C'], search.score(Xte, yte)

for name, Xtr, Xte in [("bag-of-words",       X_tr_bow,   X_te_bow),
                       ("L2-normalized BoW",  X_tr_l2,    X_te_l2),
                       ("tf-idf",             X_tr_tfidf, X_te_tfidf)]:
    best_C, acc = tuned_logreg(Xtr, train_y, Xte, test_y)
    print(f"{name:<20} best C={best_C:<6}  test accuracy={acc:.4f}")

# The book's takeaway: the three accuracies land CLOSE together, and the
# choice of C (regularization) moves the score more than the scaling does.`
  };

  window.CODEVIZ["fe-tfidf"] = {
    question: "On a tiny real corpus, what happens to a COMMON word's weight versus a RARE word's weight when we switch from raw counts to tf-idf?",
    charts: [{
      type: "bars",
      title: "Raw count vs tf-idf weight: common word down-weighted, rare word up-weighted",
      xlabel: "word (and what we measure)",
      ylabel: "weight in the matrix",
      labels: ["'the' raw count", "'the' tf-idf", "'volcano' raw count", "'volcano' tf-idf"],
      values: [4.00, 0.00, 1.00, 1.61],
      valueLabels: ["4.00", "0.00", "1.00", "1.61"],
      colors: ["#ff7b72", "#ff7b72", "#7ee787", "#7ee787"]
    }],
    caption: "Real output on a 5-document inline corpus using the book's plain idf = log(N/n_w) (natural log, no smoothing, no row normalization). 'the' appears in every document, so its idf is log(5/5)=0 and its tf-idf weight collapses to 0.00 even though its raw count is the highest (4). 'volcano' appears in just one document, so its idf is log(5/1)≈1.609 and its tf-idf weight rises to ≈1.61, above its raw count of 1. The book runs this on Yelp reviews; this is the same column-scaling idea on a bundled inline corpus.",
    code: `import numpy as np
from sklearn.feature_extraction.text import CountVectorizer

# A small REAL inline corpus: 'the' is common across all docs;
# 'volcano' is rare and specific to one doc.
corpus = [
    "the food the the the was good",          # 'the' x4
    "the service was the slow",
    "the place was the busy the",
    "the menu was the long",
    "the volcano roll was the special",       # 'volcano' x1, only here
]

bow = CountVectorizer()
X = bow.fit_transform(corpus).toarray()       # raw bag-of-words counts
vocab = bow.vocabulary_
N = X.shape[0]                                 # number of documents

# The book's plain idf = log(N / n_w), natural log, no smoothing.
# tf-idf is exactly a COLUMN-SCALING of the count matrix by idf.
df  = (X > 0).sum(axis=0)                      # document frequency per word
idf = np.log(N / df)                          # idf(w) = log(N / n_w)
Xt  = X * idf                                  # column-scale -> tf-idf

def weights(word):
    j = vocab[word]
    return X[:, j].max(), Xt[:, j].max()      # raw count, tf-idf weight

the_raw,  the_tfidf  = weights("the")         # 4.0 , 0.0   (idf = log(5/5)=0)
volc_raw, volc_tfidf = weights("volcano")     # 1.0 , 1.609 (idf = log(5/1))
print([round(the_raw,2), round(the_tfidf,2),
       round(volc_raw,2), round(volc_tfidf,2)])
# -> [4.0, 0.0, 1.0, 1.61]`
  };
})();
