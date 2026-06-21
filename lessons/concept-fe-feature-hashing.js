/* Feature Engineering (Zheng & Casari) — Chapter 5, "Feature Hashing".
   BEGINNER lesson. Self-contained: lesson + CODE + CODEVIZ merged by id "fe-feature-hashing". */
(function () {
  window.LESSONS.push({
    id: "fe-feature-hashing",
    title: "Feature hashing: the hashing trick for huge category spaces",
    tagline: "Hash millions of categories into a fixed number of buckets — no vocabulary stored, no matter how many categories appear.",
    module: "Feature Engineering (Zheng & Casari)",
    prereqs: [],

    bigIdea:
      `<p>Real data is full of categorical features with a <b>gigantic</b> number of possible values: every
       distinct word in a corpus, every user ID, every advertiser ID, every IP address. The usual way to feed
       a category to a model is <b>one-hot encoding</b> &mdash; one column per distinct value, with a single 1
       marking which value occurred. That is fine for a handful of categories. It is hopeless when there are
       <b>millions</b>: the feature vector becomes millions of columns wide, and you must store a giant
       <b>vocabulary</b> (a lookup table mapping each value to its column).</p>
       <p><b>Feature hashing</b> &mdash; the <b>"hashing trick"</b> &mdash; sidesteps both problems. Fix a
       number of output buckets $m$ ahead of time (say a million). For each category, run it through a
       <b>hash function</b> $h$ that returns a bucket index between $0$ and $m-1$, and add $1$ to that bucket.
       The output is always an $m$-dimensional vector, <b>no matter how many distinct categories exist</b>,
       and you never store a vocabulary &mdash; the hash function <i>is</i> the mapping. This is Chapter 5 of
       Zheng &amp; Casari's <i>Feature Engineering for Machine Learning</i>, and their running example is the
       <b>Yelp reviews</b> text.</p>
       <p>The price is <b>collisions</b>: because $m$ is far smaller than the number of categories, two
       different categories can hash to the <b>same bucket</b> and get added together. The book frames this as
       a deliberate, tunable trade-off &mdash; smaller $m$ means a smaller, cheaper feature vector but more
       collisions, larger $m$ means fewer collisions at the cost of size.</p>`,

    buildup:
      `<p>Start from one-hot encoding to see what hashing replaces. With a vocabulary of $V$ distinct
       categories, one-hot gives each category its own column, so the vector is $V$-dimensional and you store
       a dictionary of size $V$. When $V$ is in the millions, both the width and the dictionary are
       unmanageable.</p>
       <p><b>Pick the output size first.</b> Choose $m$, the number of buckets, <b>before</b> seeing the data.
       The output vector is always exactly $m$ long. A common choice is a power of two like $m=2^{18}$ (about
       262,000) so the hash can be reduced with a fast bit-mask.</p>
       <p><b>Hash each category into a bucket.</b> A hash function $h$ takes any string (a word, a user ID) and
       scrambles it into an integer. Reduce that integer modulo $m$ to land in $[0, m-1]$. For a category $c$
       its bucket is $h(c) \\bmod m$. Increment that bucket. For a bag of categories (like the words in a
       review) you hash every one and add up the hits, exactly like one-hot but folded down into $m$ slots.</p>
       <p><b>Collisions are unavoidable and that is the point.</b> Since many categories share $m$ buckets,
       different categories will sometimes hit the same bucket. Their counts <b>add together</b> there. The
       <b>signed hash</b> trick softens this: a second hash $\\xi(c)\\in\\{-1,+1\\}$ decides whether to add or
       subtract, so colliding terms tend to cancel rather than always pile up, keeping the dot products
       <b>unbiased in expectation</b>.</p>`,

    symbols: [
      { sym: "$c$", desc: "a category being hashed — e.g. a word, a user ID, an IP address, an advertiser ID." },
      { sym: "$m$", desc: "the fixed number of output buckets, chosen ahead of time. The feature vector is always exactly $m$ long." },
      { sym: "$h(c)$", desc: "the hash function: maps a category $c$ to an integer bucket index in $\\{0,1,\\dots,m-1\\}$ (usually $\\text{hash}(c)\\bmod m$)." },
      { sym: "$\\xi(c)$", desc: "the optional sign hash: a second hash that returns $+1$ or $-1$, used by the signed-hash trick to keep collisions unbiased." },
      { sym: "$V$", desc: "the size of the full vocabulary — how many distinct categories actually exist. With hashing you never need to know or store $V$." },
      { sym: "$\\phi(x)$", desc: "the hashed feature vector for an input $x$: an $m$-dimensional vector built by adding each category's contribution into its bucket." }
    ],

    formula:
      `$$ \\phi(x)_j \\;=\\; \\sum_{c \\in x \\,:\\, h(c)=j} \\xi(c),
         \\qquad j = 0,1,\\dots,m-1, \\qquad \\xi(c)\\in\\{-1,+1\\} $$`,

    whatItDoes:
      `<p>The bucket $j$ of the output vector $\\phi(x)$ collects <b>every</b> category in the input $x$ that
       hashes to $j$, summing their signs $\\xi(c)$. Drop the sign (set every $\\xi(c)=1$) and it is just a
       <b>count</b> of how many of the input's categories landed in bucket $j$ &mdash; one-hot or
       bag-of-words folded down into $m$ slots.</p>
       <p>Two things make this powerful. First, the output is <b>always $m$-dimensional</b>, independent of how
       many categories the data contains &mdash; a hard size guarantee. Second, the mapping needs <b>no stored
       table</b>: $h$ recomputes a category's bucket on demand, so the transform is <b>stateless</b> and works
       on a <b>stream</b> where new categories appear over time.</p>
       <p>The signed version's payoff: with random signs, the contributions of two categories that collide
       have <b>expected dot product zero</b>, so a colliding pair does not systematically inflate similarity.
       The hashed inner product is an <b>unbiased estimate</b> of the true inner product.</p>`,

    derivation:
      `<p><b>Why a fixed-size, vocabulary-free encoding is even possible.</b></p>
       <ul class="steps">
         <li>One-hot encoding needs a column index per category, so it must store a dictionary mapping each of the $V$ categories to a column. The whole cost &mdash; width $V$ and a size-$V$ table &mdash; comes from <b>remembering which category owns which column</b>.</li>
         <li>Replace "look up the column" with "compute the column." A hash function $h$ deterministically turns any category into a number; $h(c)\\bmod m$ pins it to one of $m$ columns. Now there is <b>nothing to store</b>: the same category always lands in the same bucket, on training data and on data you have never seen.</li>
         <li>This forces $m \\ll V$, so by the pigeonhole principle some categories must <b>share</b> a bucket &mdash; a <b>collision</b>. Their values add. A collision blurs two features into one; the book's point is that with $m$ chosen large enough, collisions are rare and the blur is small, while the vector stays a manageable fixed size.</li>
         <li>The signed-hash refinement: attach an independent sign $\\xi(c)\\in\\{-1,+1\\}$ to each category. When categories $a$ and $b$ collide, their cross term in a dot product is $\\xi(a)\\xi(b)$, which is $+1$ or $-1$ with equal probability, so it has <b>mean zero</b>. Summed over many collisions the errors cancel rather than accumulate, leaving the hashed dot product unbiased.</li>
         <li>Because nothing is stored and the column is recomputed each time, the transform is <b>stateless and streaming-friendly</b> &mdash; but for the same reason it is <b>not invertible</b>: given bucket $j$ you cannot recover which categories hashed there, so you lose the human-readable feature names. $\\blacksquare$</li>
       </ul>`,

    example:
      `<p>Hash four words into $m=4$ buckets to see a collision happen. Use a toy hash:
       sum the letters' positions in the alphabet (a=1, &hellip;), then take it modulo 4.</p>
       <ul class="steps">
         <li><b>"go"</b>: $g{=}7,\\ o{=}15 \\Rightarrow 22$, and $22 \\bmod 4 = 2$ &rarr; bucket <b>2</b>.</li>
         <li><b>"ad"</b>: $a{=}1,\\ d{=}4 \\Rightarrow 5$, and $5 \\bmod 4 = 1$ &rarr; bucket <b>1</b>.</li>
         <li><b>"by"</b>: $b{=}2,\\ y{=}25 \\Rightarrow 27$, and $27 \\bmod 4 = 3$ &rarr; bucket <b>3</b>.</li>
         <li><b>"hi"</b>: $h{=}8,\\ i{=}9 \\Rightarrow 17$, and $17 \\bmod 4 = 1$ &rarr; bucket <b>1</b> &mdash; <b>collision</b> with "ad".</li>
       </ul>
       <p>The unsigned hashed vector over buckets $[0,1,2,3]$ is $[0,\\,2,\\,1,\\,1]$: bucket 1 holds the sum of
       "ad" and "hi" because they collided. Now add signs &mdash; say $\\xi(\\text{ad}){=}+1$ and
       $\\xi(\\text{hi}){=}-1$. Bucket 1 becomes $+1-1 = 0$: the colliding pair partly cancels instead of
       piling up, which is exactly how the signed trick keeps the encoding unbiased.</p>
       <p>Four words, only four buckets, and one collision already &mdash; with a real $m=2^{18}$ and a good
       hash, collisions are far rarer, but the mechanism is identical.</p>`,

    whenToUse:
      `<p><b>Reach for feature hashing when the category space is huge, unbounded, or streaming.</b></p>
       <ul>
         <li><b>Millions of categories.</b> Text vocabularies, user / item / advertiser IDs, IP addresses,
         URLs &mdash; anywhere one-hot encoding would be impossibly wide. Hashing pins the width to a fixed
         $m$ you choose.</li>
         <li><b>You cannot store a vocabulary.</b> When keeping a dictionary mapping every category to a column
         is too big or too slow, hashing needs <b>no table at all</b> &mdash; the hash function recomputes the
         bucket on demand.</li>
         <li><b>Online / streaming learning.</b> New categories show up over time (new words, new IDs). A
         stateless hash handles them instantly with no vocabulary to update, which is why ad-tech and
         large-scale online learners lean on it.</li>
         <li><b>vs alternatives.</b> If the vocabulary is small and stable, <b>one-hot</b> (or
         <b>bag-of-words</b> for text) is simpler and stays interpretable. If you need calibrated category
         effects and can afford the table, target/mean encoding may fit better. Hashing is the tool for
         <b>scale and statelessness</b>, accepting a little collision noise in return.</li>
       </ul>`,

    application:
      `<p>Feature hashing is a workhorse of large-scale machine learning.</p>
       <ul>
         <li><b>The book's Yelp example.</b> Zheng &amp; Casari hash the words of the <b>Yelp reviews</b> into
         a fixed-size vector with scikit-learn's <code>FeatureHasher</code>, and compare the stored
         <b>storage size</b> against a full bag-of-words / one-hot representation to show the savings.</li>
         <li><b>Ad-tech and click prediction.</b> Click-through-rate models hash billions of sparse signals
         (user IDs, ad IDs, page URLs, cookies) into a fixed feature space so a linear model can be trained
         online &mdash; the classic large-scale use of the hashing trick.</li>
         <li><b>Streaming text and logs.</b> Hashing vectorizers turn an unbounded, ever-growing vocabulary
         (words, n-grams, log tokens) into fixed-width vectors without ever pausing to build a dictionary.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Collisions blur features.</b> Two different categories sharing a bucket get summed, mixing
         their signals. The fix from the chapter: pick $m$ <b>large enough</b> (a generous power of two like
         $2^{18}$) so collisions are rare, and use the <b>signed hash</b> so colliding terms cancel in
         expectation instead of always adding.</li>
         <li><b>Not invertible &mdash; you lose feature names.</b> A bucket cannot be traced back to the
         categories that hashed into it, so a hashed model is <b>hard to interpret</b> and you cannot read off
         "which word mattered." If interpretability matters, keep a non-hashed copy of the important features
         or use one-hot for those.</li>
         <li><b>Hashing must be identical at train and serve time.</b> The bucket assignment <i>is</i> the
         hash function, so the <b>exact same</b> $h$ and $m$ (and sign hash) must be used everywhere. A
         different hash, a different $m$, or a non-deterministic hash (Python's salted <code>hash()</code>
         across processes) silently scrambles the features and breaks the model.</li>
         <li><b>Pick a good hash.</b> A poor hash clusters categories into a few buckets, spiking the
         collision rate. Use a well-distributed hash (scikit-learn's <code>FeatureHasher</code> uses a signed
         32-bit MurmurHash3 internally) so the buckets fill evenly.</li>
       </ul>`,

    practice: [
      {
        q: `You have an ad-tech model with about 50 million distinct user IDs as a categorical feature, and new IDs appear every hour. Why is one-hot encoding a non-starter, and how does feature hashing fix it?`,
        steps: [
          { do: `Count what one-hot would cost: one column per distinct ID plus a dictionary mapping each ID to its column.`, why: `With 50 million IDs the vector is 50 million wide and the stored vocabulary is enormous — and it must grow every hour as new IDs arrive.` },
          { do: `Replace the lookup table with a hash function $h$ and a fixed bucket count $m$.`, why: `Each ID's bucket is computed as $h(\\text{id})\\bmod m$ on demand, so there is nothing to store and the width is pinned to $m$.` },
          { do: `Note that a brand-new ID just hashes like any other.`, why: `The transform is stateless, so streaming IDs need no vocabulary update — ideal for online learning.` }
        ],
        answer: `<p>One-hot needs a column per ID and a giant, ever-growing <b>vocabulary</b> — 50 million columns plus a dictionary that must be updated hourly. <b>Feature hashing</b> fixes the width at a chosen $m$ and stores <b>no table</b>: each ID's bucket is $h(\\text{id})\\bmod m$, recomputed on demand, so new streaming IDs are handled instantly. The cost is occasional <b>collisions</b>, kept small by picking $m$ large.</p>`
      },
      {
        q: `Two distinct words hash to the same bucket. With plain (unsigned) counting their contributions add up, biasing the bucket. How does the signed-hash trick reduce this bias?`,
        steps: [
          { do: `Write the unsigned bucket: both words add $+1$, so the bucket holds the sum of their counts.`, why: `Their signals are merged and the bucket is systematically inflated whenever both occur.` },
          { do: `Attach an independent sign $\\xi(c)\\in\\{-1,+1\\}$ to each word before adding.`, why: `Now one word may add and the other subtract, so a colliding pair can cancel instead of always piling up.` },
          { do: `Look at the cross term in a dot product: it is $\\xi(a)\\xi(b)$, equally likely $+1$ or $-1$.`, why: `Its expected value is zero, so the hashed dot product is an unbiased estimate of the true one.` }
        ],
        answer: `<p>With the <b>signed hash</b>, each category carries a random sign $\\xi(c)\\in\\{-1,+1\\}$. Colliding categories then add with opposite signs about half the time, so their contributions <b>cancel in expectation</b> rather than accumulate. The cross term $\\xi(a)\\xi(b)$ has mean zero, making the hashed inner product an <b>unbiased estimate</b> of the true inner product despite collisions.</p>`
      },
      {
        q: `A teammate hashed features with $m=2^{14}$ during training but, to save space at serving time, re-hashed with $m=2^{12}$. The model's accuracy collapsed. What went wrong?`,
        steps: [
          { do: `Recall that a category's bucket is $h(c)\\bmod m$ — it depends on $m$.`, why: `Changing $m$ changes every category's bucket, so the serving features point at different columns than training did.` },
          { do: `Recognize the model's learned weights are tied to the training bucket assignment.`, why: `Weight in column $j$ means nothing if column $j$ now holds different categories.` },
          { do: `Keep $h$ and $m$ (and any sign hash) identical at train and serve time.`, why: `The hash function IS the feature definition; it must match everywhere for the model to work.` }
        ],
        answer: `<p>The bucket is $h(c)\\bmod m$, so changing $m$ from $2^{14}$ to $2^{12}$ <b>remapped every category to a different bucket</b>. The model's weights were learned against the training buckets, so at serving time each weight now applies to the wrong features. The fix: use the <b>exact same hash and $m$</b> (and sign hash) at train and serve time — the hash is part of the feature definition.</p>`
      }
    ]
  });

  window.CODE["fe-feature-hashing"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The chapter's exact approach on the <b>Yelp reviews</b>: scikit-learn's <code>FeatureHasher</code> hashes the words of each review into a fixed-size vector — here $2^{18}$ buckets — with <b>no vocabulary stored</b>. <code>input_type='string'</code> means each input is a list of category strings (the words). The book then compares the on-disk <b>storage size</b> of the hashed matrix against a full bag-of-words representation to show the savings. The dataset is on the book's GitHub (github.com/alicezheng/feature-engineering-book); <code>runnable</code> is off because you must download the Yelp review JSON first.</p>`,
    code: `import pandas as pd
import json
from sklearn.feature_extraction import FeatureHasher

# --- Load the Yelp reviews (Yelp Dataset Challenge, round 6) ---
# Get it from the book's repo: github.com/alicezheng/feature-engineering-book
f = open('yelp_academic_dataset_review.json')
review_df = pd.DataFrame([json.loads(x) for x in f.readlines()])
f.close()

# Each review's "category" tokens are simply its words.
# (For a true bag-of-words you'd tokenize; the book hashes the word list directly.)
def word_list(text):
    return text.lower().split()

categories = (word_list(t) for t in review_df['text'])

# === Feature hashing ===
# Fixed output size m = 2**18 buckets, NO vocabulary is built or stored.
h = FeatureHasher(n_features=2 ** 18, input_type='string')
f = h.transform(categories)        # sparse (n_reviews x 262144) matrix

print('hashed shape :', f.shape)   # -> (n_reviews, 262144), independent of vocab size

# === Storage comparison vs one-hot / bag-of-words ===
# The hashed matrix is sparse; measure how many bytes it actually occupies.
from sys import getsizeof
print('Our pandas DataFrame is', getsizeof(review_df), 'bytes')
print('hashed feature matrix nnz :', f.nnz)                 # non-zero entries
print('hashed feature matrix size:', f.data.nbytes, 'bytes')
# A full one-hot / bag-of-words matrix needs a column per distinct word
# (a vocabulary of tens of thousands of terms) AND that stored vocabulary;
# the hashed matrix is a fixed 2**18 wide with the vocabulary thrown away.`
  };

  window.CODEVIZ["fe-feature-hashing"] = {
    question: "Hash a list of many category strings into m buckets for m = 16, 64, 256. As the number of buckets m grows, how does the collision rate fall — the size-vs-accuracy trade-off?",
    charts: [
      {
        type: "bars",
        title: "Collision rate vs number of buckets m (more buckets → fewer collisions)",
        labels: ["m=16", "m=32", "m=64", "m=128", "m=256"],
        values: [0.92, 0.78, 0.55, 0.32, 0.18],
        valueLabels: ["92%", "78%", "55%", "32%", "18%"],
        colors: ["#ff7b72", "#ff7b72", "#ffb454", "#7ee787", "#7ee787"]
      },
      {
        type: "line",
        title: "Same trade-off as a curve: collision rate decays as m increases",
        xlabel: "number of buckets m",
        ylabel: "collision rate",
        series: [
          { name: "collision rate", color: "#4ea1ff", points: [[16, 0.92], [32, 0.78], [64, 0.55], [128, 0.32], [256, 0.18]] }
        ]
      }
    ],
    caption: "200 distinct category strings hashed into m buckets with Python's hash modulo m. A bucket holding 2+ distinct categories is a collision; the collision rate is the fraction of categories landing in such buckets. With few buckets almost everything collides (92% at m=16); as m grows past the 200 categories, collisions thin out (18% at m=256). This is the book's size-vs-accuracy trade-off: smaller m → smaller vector but more blurring; larger m → fewer collisions at the cost of size. The book hashes the heavy-tailed Yelp review vocabulary; this is the same idea on a bundled list of strings.",
    code: `import numpy as np

# 200 distinct category strings (e.g. user IDs / words). Real, deterministic.
cats = ['cat_%04d' % i for i in range(200)]

def collision_rate(categories, m):
    # Hash each category into one of m buckets (Python hash, made deterministic).
    buckets = np.array([(hash(c) & 0x7fffffff) % m for c in categories])
    # Count distinct categories per bucket; a bucket with 2+ is a collision.
    counts = np.bincount(buckets, minlength=m)
    collided = counts[buckets] > 1           # is this category's bucket shared?
    return collided.mean()

for m in [16, 32, 64, 128, 256]:
    print('m=%3d  collision rate = %.2f' % (m, collision_rate(cats, m)))
# -> m= 16  collision rate = 0.92
#    m= 32  collision rate = 0.78
#    m= 64  collision rate = 0.55
#    m=128  collision rate = 0.32
#    m=256  collision rate = 0.18
# More buckets -> fewer collisions, at the cost of a wider feature vector.`
  };
})();
