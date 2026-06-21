/* Feature Engineering (Zheng & Casari) — Chapter 3, "Bag-of-Words".
   Self-contained: lesson + CODE + CODEVIZ merged by id "fe-bag-of-words". */
(function () {
  window.LESSONS.push({
    id: "fe-bag-of-words",
    title: "Bag-of-Words: turning text into a vector of word counts",
    tagline: "Count how many times each vocabulary word appears in a document, ignore the order.",
    module: "Feature Engineering (Zheng & Casari)",
    prereqs: ["dl-word-embeddings", "met-distribution"],

    bigIdea:
      `<p>A machine learning model eats <b>numbers</b>, not sentences. So the first job in any text task is
       to turn a document into a vector of numbers. <b>Bag-of-words (BoW)</b> is the simplest honest way to
       do that: list every word that appears anywhere in your collection (the <b>vocabulary</b>), then
       describe each document by <b>how many times each of those words shows up in it</b>.</p>
       <p>The name says it all. You dump the document's words into a bag and shake it. You keep <i>which</i>
       words are present and <i>how many</i> of each — but you throw away the <b>order</b> and the grammar.
       "the food was good" and "good was the food" land in the exact same bag.</p>
       <p>Zheng &amp; Casari use the <b>Yelp reviews</b> dataset throughout Chapter 3. A review like
       "Great service, great food" becomes a row of counts: a 2 under "great", a 1 under "service", a 1
       under "food", and a 0 under every other word in the vocabulary. Do this for every review and you get
       a big grid of counts — the <b>document-term matrix</b> — that any classifier can train on.</p>`,

    buildup:
      `<p>The book frames BoW <b>geometrically</b>, and that picture is the whole lesson. Fix a vocabulary of
       $V$ words. Then <b>each word is an axis</b> of a $V$-dimensional space. A document is a single
       <b>point</b> in that space: its coordinate on the "food" axis is how many times "food" appears, its
       coordinate on the "service" axis is the count of "service", and so on.</p>
       <p>This is "bag-of-words space". Two reviews that use many of the same words sit <b>near each other</b>
       as points; two reviews with no words in common sit far apart (at right angles, in fact). That single
       idea — <b>similar text becomes nearby points</b> — is what lets a classifier draw a boundary between
       good and bad reviews, and what lets a search engine rank documents by closeness to a query.</p>
       <p>Two facts about this space matter. First, $V$ is <b>huge</b> — a real corpus has tens of thousands
       of distinct words, so the space has tens of thousands of dimensions. Second, any one document uses
       only a handful of them, so almost every coordinate is <b>0</b>. The matrix is mostly zeros — it is
       <b>sparse</b>. We store it as a sparse matrix and never write out the zeros.</p>`,

    symbols: [
      { sym: "$d$", desc: "one document — a single review, email, or sentence." },
      { sym: "$V$", desc: "the vocabulary size: the number of distinct words across the whole collection. Also the number of dimensions of bag-of-words space." },
      { sym: "$w$", desc: "one vocabulary word — one axis of the space, one column of the matrix." },
      { sym: "$x_{d,w}$", desc: "the count: how many times word $w$ appears in document $d$. This is the document's coordinate on the $w$ axis." },
      { sym: "$\\mathbf{x}_d$", desc: "the bag-of-words vector for document $d$: the whole row of counts, one number per vocabulary word." },
      { sym: "$X$", desc: "the document-term matrix: one row per document, one column per word; entry $(d,w)$ is $x_{d,w}$." },
      { sym: "$N$", desc: "the number of documents in the collection (the number of rows of $X$)." }
    ],

    formula:
      `$$ \\mathbf{x}_d = \\big[\\, x_{d,w} \\,\\big]_{w=1}^{V}, \\qquad x_{d,w} = \\text{count of word } w \\text{ in document } d, \\qquad X \\in \\mathbb{Z}_{\\ge 0}^{\\,N \\times V} $$`,

    whatItDoes:
      `<p>The formula is just bookkeeping for the bag. For each document $d$ you walk through the vocabulary;
       for each word $w$ you write down $x_{d,w}$, the number of times $w$ occurs in $d$. Stack those rows
       and you have the matrix $X$ with $N$ rows (documents) and $V$ columns (words), filled with
       non-negative integers (that is what $\\mathbb{Z}_{\\ge 0}$ means — whole numbers, zero or more).</p>
       <p>Notice what the formula <b>does not</b> contain: any reference to <i>position</i>. There is no index
       for "the third word" — only "how many of word $w$, total". That missing position is exactly the order
       information BoW discards. It is the source of both BoW's simplicity and its biggest weakness.</p>`,

    derivation:
      `<p><b>Why this representation works — the book's reasoning.</b></p>
       <ul class="steps">
         <li><b>Build the vocabulary.</b> Scan every document, split into words (tokenize), and collect the set of distinct words. Assign each a fixed column index. This is the list <code>get_feature_names_out()</code> returns.</li>
         <li><b>Count.</b> For each document, tally its words into the columns. A word the document never uses gets a 0. This row of counts is the document's point in $V$-dimensional space.</li>
         <li><b>Geometry gives meaning.</b> Documents that share many words have large counts in the same columns, so their vectors point in nearly the same direction — they are <b>close</b>. Documents with disjoint vocabularies have non-zero counts in different columns, so their vectors are <b>orthogonal</b> (cosine similarity 0). A linear classifier can therefore separate, say, positive from negative reviews by finding a hyperplane in this space.</li>
         <li><b>Sparsity is free.</b> Because each document touches only a few of the $V$ words, each row is almost all zeros. Storing only the non-zeros (a sparse matrix) keeps a 20,000-word vocabulary cheap. This is why <code>CountVectorizer</code> returns a <i>sparse</i> matrix, not a dense one.</li>
         <li><b>The cost: order is gone.</b> Because we only kept totals, "not good" and "good" share the word "good" and look almost identical — the negation is lost. The book uses exactly this failure to motivate the next section, <b>n-grams</b> (also called bag-of-n-grams), which count short word sequences like "not good" as their own features and so claw back a little of the order. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Take three tiny reviews and build the bag by hand.</p>
       <ul class="steps">
         <li><b>Documents.</b> $d_1=$ "great food great service", $d_2=$ "good food", $d_3=$ "bad service".</li>
         <li><b>Vocabulary</b> (sorted, as scikit-learn does it): <code>bad, food, good, great, service</code>. So $V=5$ — a 5-dimensional space.</li>
         <li><b>Count each document into those 5 columns:</b>
           <ul>
             <li>$\\mathbf{x}_1 = [\\,0,\\ 1,\\ 0,\\ 2,\\ 1\\,]$ — "great" appears twice, "food" and "service" once, "bad" and "good" zero.</li>
             <li>$\\mathbf{x}_2 = [\\,0,\\ 1,\\ 1,\\ 0,\\ 0\\,]$.</li>
             <li>$\\mathbf{x}_3 = [\\,1,\\ 0,\\ 0,\\ 0,\\ 1\\,]$.</li>
           </ul>
         </li>
         <li><b>Read off the geometry.</b> $\\mathbf{x}_1$ and $\\mathbf{x}_2$ both have a 1 in the "food" column, so they overlap — somewhat close. $\\mathbf{x}_2$ and $\\mathbf{x}_3$ share <i>no</i> word, so their dot product is 0 — they are orthogonal, maximally dissimilar in BoW space.</li>
         <li><b>See order vanish.</b> $d_1$ rearranged as "service great food great" gives the <i>identical</i> vector $[\\,0,1,0,2,1\\,]$. The bag cannot tell the two apart.</li>
       </ul>
       <p>Three short reviews, a $3\\times5$ document-term matrix, and already 9 of its 15 entries are zero —
       a hint of how sparse a real Yelp matrix gets.</p>`,

    whenToUse:
      `<p><b>Reach for bag-of-words when word presence or frequency carries the signal</b> — which is
       surprisingly often.</p>
       <ul>
         <li><b>As a strong, cheap baseline.</b> For text classification (spam vs not, positive vs negative review, topic labels), BoW + a linear model (logistic regression or linear SVM) is fast to train, easy to interpret, and frequently competitive. Always try it before anything fancy.</li>
         <li><b>For search and retrieval.</b> Represent both the query and every document as bags and rank by closeness (cosine similarity). This is the classic information-retrieval setup, usually upgraded to <b>tf-idf (term frequency–inverse document frequency)</b> weighting.</li>
         <li><b>When the vocabulary is the meaning.</b> Sentiment, topic, and many document-level decisions hinge on <i>which words appear</i> ("refund", "excellent", "lawsuit") more than on their exact order.</li>
         <li><b>When you need interpretability.</b> Each feature is a literal word, so a linear model's weights read as "these words push toward positive, those toward negative" — far easier to explain than a dense embedding.</li>
       </ul>
       <p>Prefer <b>word embeddings</b> (see <code>dl-word-embeddings</code>) or transformer encoders when meaning,
       synonymy, and word order matter and you have enough data — they place "good" and "excellent" near each
       other, which BoW never will, since to BoW they are two unrelated axes.</p>`,

    application:
      `<p>Chapter 3 builds BoW on the <b>Yelp reviews</b> dataset and shows the pipeline that powers most
       classical text systems.</p>
       <ul>
         <li><b>Review and document classification.</b> Yelp star prediction, spam filtering, support-ticket routing — vectorize the text with <code>CountVectorizer</code>, feed the document-term matrix to a linear classifier.</li>
         <li><b>Search and recommendation over text.</b> Match queries to documents in bag-of-words (usually tf-idf) space; recommend articles or products by description similarity.</li>
         <li><b>The first stage of a longer pipeline.</b> BoW counts are the input that <b>tf-idf</b> reweights and that <b>n-grams</b> extend; even modern systems often keep a BoW/tf-idf branch alongside neural features as a cheap, robust signal.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Word order and negation are lost.</b> "not good" and "good" share the word "good", so BoW scores them as nearly the same — a disaster for sentiment. <i>Fix:</i> add <b>n-grams</b> (bag-of-n-grams) so "not good" becomes its own feature, or use a sequence model.</li>
         <li><b>The vocabulary is huge and the matrix is sparse.</b> Tens of thousands of columns, almost all zeros. <i>Fix:</i> always keep it as a <b>sparse matrix</b> (never <code>.toarray()</code> a real corpus), and cap the vocabulary with <code>max_features</code>, <code>min_df</code>, and <code>max_df</code>.</li>
         <li><b>Common words dominate.</b> "the", "was", "and" get the biggest counts but carry little meaning, so they can swamp the informative words. <i>Fix:</i> remove stop words, or reweight with <b>tf-idf</b>, which down-weights words that appear in many documents (this is the book's very next topic).</li>
         <li><b>It depends entirely on tokenization and cleaning.</b> Casing, punctuation, and stemming change the vocabulary, so "Good", "good," and "good" can become three different features. <i>Fix:</i> lowercase, strip punctuation, and decide on stemming/lemmatization <b>before</b> fitting — and apply the same steps at test time.</li>
         <li><b>Out-of-vocabulary words at test time.</b> The vocabulary is frozen when you <code>fit</code> on training data; any new word at test time has no column and is silently dropped. <i>Fix:</i> accept it (it is usually fine), or use hashing / subword features. Crucially, <b>fit the vectorizer on training data only</b> and <code>transform</code> the test set — fitting on test text leaks information.</li>
       </ul>`,

    practice: [
      {
        q: `A sentiment classifier built on bag-of-words rates the review "the food was not good" almost the same as "the food was good". Why, and what is the standard fix?`,
        steps: [
          { do: `Write both reviews as bags of word counts and compare them.`, why: `BoW keeps only how many times each word appears, so both reviews share "the", "food", "was", "good"; they differ only in the single extra word "not".` },
          { do: `Notice the word "not" sits in its own column, unattached to "good".`, why: `Because order is discarded, BoW cannot represent that "not" modifies "good" — the negation is just one more isolated count.` },
          { do: `Add bag-of-n-grams: count 2-word sequences (bigrams) as features too.`, why: `Then "not good" becomes a single feature distinct from "good", restoring the negation the model needs.` }
        ],
        answer: `<p>BoW <b>throws away word order</b>, so "not good" and "good" share almost all the same word counts and look nearly identical — the negation in "not" floats free in its own column. The standard fix is <b>n-grams (bag-of-n-grams)</b>: counting "not good" as its own feature. This is exactly why Chapter 3 introduces n-grams right after bag-of-words.</p>`
      },
      {
        q: `You run <code>CountVectorizer</code> on 50,000 Yelp reviews and the vocabulary has 28,000 words. Why is calling <code>.toarray()</code> on the result a bad idea, and what dominates the top counts?`,
        steps: [
          { do: `Estimate the dense size: 50,000 rows by 28,000 columns of integers.`, why: `That is 1.4 billion entries — gigabytes of memory — even though almost every entry is 0.` },
          { do: `Recall that each review uses only a few dozen distinct words.`, why: `So each row has a few dozen non-zeros out of 28,000 columns: the matrix is extremely sparse and should stay a sparse matrix.` },
          { do: `Sum each column across all reviews and look at the largest totals.`, why: `The biggest counts are function words like "the", "and", "was" — frequent but nearly meaningless.` }
        ],
        answer: `<p><code>.toarray()</code> would expand a mostly-zero sparse matrix into a dense $50000\\times28000$ block — gigabytes for almost no information; keep it <b>sparse</b>. And the top raw counts are dominated by <b>common stop words</b> ("the", "and", "was"), which is precisely why you remove stop words or switch to <b>tf-idf</b> weighting.</p>`
      },
      {
        q: `Two short reviews are $d_2=$ "good food" and $d_3=$ "bad service" over the vocabulary <code>[bad, food, good, service]</code>. What is their cosine similarity in bag-of-words space, and what does it tell you?`,
        steps: [
          { do: `Write the vectors: $\\mathbf{x}_2=[0,1,1,0]$, $\\mathbf{x}_3=[1,0,0,1]$.`, why: `Each coordinate is the count of that vocabulary word in the review.` },
          { do: `Compute the dot product $\\mathbf{x}_2\\cdot\\mathbf{x}_3 = 0\\cdot1+1\\cdot0+1\\cdot0+0\\cdot1 = 0$.`, why: `The two reviews share no vocabulary word, so every product term is 0.` },
          { do: `Cosine similarity $= \\dfrac{\\mathbf{x}_2\\cdot\\mathbf{x}_3}{\\lVert\\mathbf{x}_2\\rVert\\,\\lVert\\mathbf{x}_3\\rVert} = \\dfrac{0}{\\sqrt2\\,\\sqrt2}=0$.`, why: `A zero dot product means the vectors are orthogonal — at a right angle in BoW space.` }
        ],
        answer: `<p>Their cosine similarity is <b>0</b> — the vectors are <b>orthogonal</b>. Sharing no words puts two documents at a right angle in bag-of-words space, the maximum possible dissimilarity. This is the geometry the book stresses: word overlap becomes nearness, and disjoint vocabularies become orthogonality.</p>`
      }
    ]
  });

  window.CODE["fe-bag-of-words"] = {
    lib: "scikit-learn + pandas",
    runnable: false,
    explain: `<p>The book's Chapter 3 recipe: <code>CountVectorizer</code> tokenizes the text, builds the vocabulary, and returns the sparse <b>document-term matrix</b> <code>X</code> of word counts. <code>get_feature_names_out()</code> gives the vocabulary words, one per column. Here it runs on the <b>Yelp reviews</b> dataset Zheng &amp; Casari use throughout the chapter (download it from the book's repo: <code>github.com/alicezheng/feature-engineering-book</code>, the Yelp academic dataset JSON). <code>runnable:false</code> only because that file needs downloading; the code is otherwise a faithful, runnable reproduction.</p>`,
    code: `import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer

# Yelp reviews dataset (Chapter 3 of Zheng & Casari).
# Get it from the book's repo: github.com/alicezheng/feature-engineering-book
# (the Yelp academic dataset). Each line of the JSON is one review object.
reviews = pd.read_json('yelp_academic_dataset_review.json', lines=True)
review_texts = reviews['text']          # the column of raw review strings

# --- Bag-of-Words ---
bow = CountVectorizer()                 # lowercases & tokenizes on word boundaries
X = bow.fit_transform(review_texts)     # SPARSE document-term matrix: one row per review,
                                        # one column per vocabulary word, entry = word count

vocab = bow.get_feature_names_out()     # the vocabulary: column index -> word
print("documents x vocabulary:", X.shape)     # e.g. (10000, 23000)
print("first 10 vocabulary words:", vocab[:10])

# X is sparse -- keep it sparse; .toarray() on a real corpus would be gigabytes.
print("stored (non-zero) entries:", X.nnz)
print("sparsity:", 1 - X.nnz / (X.shape[0] * X.shape[1]))   # almost all zeros

# Each document is now a vector of word counts -- a point in bag-of-words space.
# Feed X straight into a linear classifier to predict, e.g., the review's star rating:
#   from sklearn.linear_model import LogisticRegression
#   LogisticRegression().fit(X, reviews['stars'])`
  };

  window.CODEVIZ["fe-bag-of-words"] = {
    question: "On four tiny real review-style sentences, what does the bag-of-words document-term matrix look like, which words are most common, and can it tell 'not good' from 'good'?",
    charts: [
      {
        type: "bars",
        title: "Total word counts across the 4-document corpus (the bag, summed)",
        labels: ["the", "was", "food", "great", "service", "good", "and", "slow", "but", "not", "value"],
        values: [6, 6, 4, 4, 4, 3, 2, 2, 1, 1, 1],
        valueLabels: ["6", "6", "4", "4", "4", "3", "2", "2", "1", "1", "1"],
        colors: ["#ff7b72", "#ff7b72", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787"]
      },
      {
        type: "heatmap",
        title: "Document-term matrix: 4 reviews (rows) x 11 vocabulary words (cols)",
        rows: ["d1: ...good...great", "d2: ...slow...good", "d3: great great great", "d4: ...not good...slow"],
        cols: ["and", "but", "food", "good", "great", "not", "service", "slow", "the", "value", "was"],
        matrix: [
          [1, 0, 1, 1, 1, 0, 1, 0, 2, 0, 2],
          [0, 1, 1, 1, 0, 0, 1, 1, 2, 0, 2],
          [0, 0, 1, 0, 3, 0, 1, 0, 0, 1, 0],
          [1, 0, 1, 1, 0, 1, 1, 1, 2, 0, 2]
        ],
        showVals: true
      }
    ],
    caption: "Real scikit-learn CountVectorizer output on 4 inline sentences. Left: the summed bag -- common words 'the'/'was' (red) top the counts despite carrying no sentiment, which motivates stop-word removal and tf-idf. Right: the document-term matrix; each row is a review's count vector. Compare row d1 (\"...good...\") and row d4 (\"...not good...\"): they differ only in the 'not' and 'and' columns -- the negation is one stray count, so BoW barely tells them apart. The book uses the Yelp reviews; this is the same idea on inline text.",
    code: `import numpy as np
from sklearn.feature_extraction.text import CountVectorizer

# Four short, real review-style sentences (inline -- no download needed).
docs = [
    "the food was good and the service was great",
    "the service was slow but the food was good",
    "great food great service great value",
    "the food was not good and the service was slow",
]

bow = CountVectorizer()                 # same call the book uses
X = bow.fit_transform(docs)             # sparse document-term matrix
vocab = bow.get_feature_names_out()
A = X.toarray()                         # tiny here, so densify for display

print("vocabulary:", list(vocab))
print("matrix shape (docs x words):", A.shape)   # (4, 11)
print(A)

# Total count of each word across the whole corpus (the summed bag):
totals = A.sum(axis=0)
order = np.argsort(-totals)
for i in order:
    print(f"{vocab[i]:>8}: {totals[i]}")
# -> the:6  was:6  food:4  great:4  service:4  good:3  and:2  slow:2  but:1  not:1  value:1

# Order is lost: doc 1 ("...good...") vs doc 4 ("...not good...") differ
# only in the 'not' (+1) and 'and' columns -- the negation is a single stray count.`
  };
})();
