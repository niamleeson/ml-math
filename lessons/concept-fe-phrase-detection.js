/* =====================================================================
   FEATURE ENGINEERING LESSON — Parsing, Tokenization & Phrase Detection.
   From Zheng & Casari, "Feature Engineering for Machine Learning"
   (O'Reilly 2018), Chapter 3: "Text Data: Flattening, Filtering, and
   Chunking" — the "Parsing and Tokenization" and "Collocation Extraction
   for Phrase Detection" sections.
   Self-contained: pushes one lesson into window.LESSONS and registers one
   window.CODE entry and one window.CODEVIZ entry.
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - the book's faithful code (Yelp dataset, nltk collocations, spaCy)
   The CODEVIZ numbers are REAL: computed with numpy on a small inline text
   corpus where the phrase "machine learning" repeats, scoring pointwise
   mutual information for candidate bigrams.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-phrase-detection",
    title: "Parsing, tokenization & phrase detection",
    tagline: "Keep meaningful multi-word phrases like \"New York\" as single features instead of splitting them into useless single words.",
    module: "Feature Engineering",
    prereqs: ["met-distribution"],

    whenToUse:
      `<p>Reach for phrase detection when the <b>meaning lives in the word pair, not the single words</b>.</p>
       <ul>
         <li>"New York" is a place. Split into "new" and "york", and the city is gone.</li>
         <li>"machine learning" is a field. The two words apart are nearly meaningless.</li>
         <li>Entity and term extraction: pulling product names, brands, technical terms out of reviews or articles.</li>
         <li>Building a <b>phrase vocabulary</b>: a feature set where good multi-word terms each get their own column.</li>
       </ul>
       <p>If single words already capture what you need, plain tokenization is enough and you can skip this. Use phrase detection only when splitting destroys meaning.</p>`,

    application:
      `<p>In the book, this is part of turning raw review text into features.</p>
       <ul>
         <li>The running dataset is the <b>Yelp reviews dataset</b> (from the Yelp Dataset Challenge): millions of free-text restaurant and business reviews.</li>
         <li>A bag-of-words (BoW) model counts each word as a feature. But "happy hour", "customer service", and "wait staff" are real concepts that a word-only model splits apart.</li>
         <li>The pipeline: <b>parse</b> the raw string, <b>tokenize</b> into words, then <b>detect phrases</b> (collocations) and add the good ones as new features.</li>
         <li>The book also mentions <b>spaCy</b> for noun-phrase parsing and <b>nltk</b> for statistical collocation scoring.</li>
       </ul>`,

    pitfalls:
      `<ul>
         <li><b>Raw frequency over-ranks common-word pairs.</b> "of the", "in the", "and a" are extremely frequent bigrams, but they are filler, not phrases. Frequency alone surfaces them at the top. The fix: score with a statistical test (likelihood ratio or pointwise mutual information) that asks whether the pair co-occurs <i>more than chance</i>, not just <i>a lot</i>.</li>
         <li><b>Pointwise mutual information (PMI) is unstable for rare words.</b> A word pair seen once gets a wildly high PMI just because each word is rare. The fix: apply a <b>frequency floor</b> (for example, drop bigrams seen fewer than 5 or 10 times) before scoring.</li>
         <li><b>Language and tokenizer dependence.</b> Tokenization rules differ by language and by domain. Contractions, hyphens, URLs, and emoji all need handling. A tokenizer tuned for English news may butcher tweets or code.</li>
         <li><b>Phrase explosion.</b> Every adjacent word pair is a candidate. The candidate set is huge, and most candidates are junk. You must filter aggressively (frequency floor plus a score threshold) or the feature space blows up.</li>
       </ul>`,

    bigIdea:
      `<p>Raw text is just a string of characters. A model needs numbers, so the first job is to chop the string into <b>tokens</b> (usually words).</p>
       <p>The naive way treats each word as its own feature. This is the bag-of-words (BoW) model. It throws away word order and, worse, it splits real phrases.</p>
       <p>"New York" becomes "new" + "york". "machine learning" becomes "machine" + "learning". The phrase carried the meaning; the pieces do not.</p>
       <p><b>Phrase detection</b> (also called <b>collocation extraction</b>) finds word groups that belong together and keeps them as single features.</p>
       <p>The key question: out of all adjacent word pairs, which ones are real phrases and which are just two common words that happened to land next to each other?</p>`,

    buildup:
      `<p>Start with <b>parsing and tokenization</b>.</p>
       <ul class="steps">
         <li><b>Parsing</b> handles structure. A web page or email has markup, headers, and boilerplate. Parsing strips that and pulls out the actual text to analyze.</li>
         <li><b>Tokenization</b> splits that text into tokens. The simplest rule: cut on whitespace and punctuation. Real tokenizers also lowercase, handle contractions, and keep URLs intact.</li>
       </ul>
       <p>A <b>token</b> is one unit of text, usually a single word. A <b>bigram</b> is a pair of adjacent tokens, like ("machine", "learning").</p>
       <p>Now the core problem. The book gives three ways to detect phrases, in increasing sophistication:</p>
       <ol class="steps">
         <li><b>Frequency-based.</b> Keep the most frequent bigrams. Simple, but it over-ranks filler like "of the".</li>
         <li><b>Part-of-speech (POS) based chunking.</b> Tag each word with its grammatical role, then keep patterns that look like noun phrases (for example, adjective followed by noun, or noun followed by noun). spaCy's noun-chunk parser does this. It captures "fast service" and "happy hour" while ignoring "of the".</li>
         <li><b>Statistical.</b> Score each bigram by how much more often the two words co-occur than chance predicts. The book uses a <b>likelihood-ratio test</b> and <b>pointwise mutual information (PMI)</b>. "San Francisco" co-occurs far more than any random pair of words, so it scores high; "of the" co-occurs a lot but only because both words are everywhere, so it scores low.</li>
       </ol>
       <p>Side by side, on the same test pair "happy hour" versus the filler "of the":</p>
       <table class="extable">
         <caption>The three methods, and how each verdicts the real phrase "happy hour" vs the filler "of the".</caption>
         <thead><tr><th>method</th><th>what it looks at</th><th>"happy hour"</th><th>"of the"</th><th>cost</th></tr></thead>
         <tbody>
           <tr><td class="row-h">frequency</td><td>raw count of the pair</td><td>keeps it (if frequent)</td><td>keeps it (filler ranks high)</td><td>cheapest</td></tr>
           <tr><td class="row-h">POS chunking</td><td>grammar (adjective + noun, noun + noun)</td><td>keeps it (adj + noun)</td><td>drops it (prep + article)</td><td>needs a tagger</td></tr>
           <tr><td class="row-h">statistical (PMI)</td><td>co-occurrence vs chance</td><td>keeps it (PMI high)</td><td>drops it (PMI &asymp; 0)</td><td>needs counts</td></tr>
         </tbody>
       </table>
       <p>Only the bottom two methods reject the filler. The statistical view is the deepest, so the formula below makes it precise.</p>`,

    symbols: [
      { sym: "$a$", desc: "the first word of a candidate bigram (for example, \"machine\")." },
      { sym: "$b$", desc: "the second word of the candidate bigram (for example, \"learning\")." },
      { sym: "$p(a)$", desc: "probability of word $a$: how often $a$ appears, as a fraction of all words." },
      { sym: "$p(b)$", desc: "probability of word $b$: how often $b$ appears, as a fraction of all words." },
      { sym: "$p(a,b)$", desc: "joint probability of the bigram: how often $a$ and $b$ appear together as a pair, as a fraction of all bigrams." },
      { sym: "$\\mathrm{PMI}(a,b)$", desc: "pointwise mutual information: how much more (or less) often $a$ and $b$ co-occur than if they were independent." }
    ],

    formula: `$$ \\mathrm{PMI}(a,b) = \\log \\frac{p(a,b)}{p(a)\\,p(b)} $$`,

    whatItDoes:
      `<p>The denominator $p(a)\\,p(b)$ is what the joint probability <i>would</i> be if the two words were <b>independent</b> — if they just landed next to each other by chance.</p>
       <p>The numerator $p(a,b)$ is how often they <i>actually</i> co-occur.</p>
       <p>The ratio compares reality to chance:</p>
       <ul>
         <li>Ratio $\\gt 1$ (so PMI $\\gt 0$): they co-occur <b>more</b> than chance. A real phrase.</li>
         <li>Ratio $= 1$ (so PMI $= 0$): exactly chance. Independent words.</li>
         <li>Ratio $\\lt 1$ (so PMI $\\lt 0$): they co-occur <b>less</b> than chance. They avoid each other.</li>
       </ul>
       <p>The $\\log$ turns the ratio into an additive score and stretches the interesting range. The base does not matter for ranking; the book uses natural $\\log$.</p>
       <p>Why this beats raw frequency: "of the" has a huge $p(a,b)$, but "of" and "the" are so common that $p(a)\\,p(b)$ is also huge, so the ratio is near 1 and PMI is near 0. "San Francisco" has a modest $p(a,b)$, but "francisco" is rare, so $p(a)\\,p(b)$ is tiny and the ratio explodes.</p>`,

    derivation:
      `<p>Why does dividing by $p(a)\\,p(b)$ correct for commonness?</p>
       <p>Suppose two words were thrown into the text independently. Then the chance of seeing $a$ followed by $b$ is just $p(a)$ times $p(b)$ — the multiplication rule for independent events.</p>
       <p>So $p(a)\\,p(b)$ is the <b>baseline</b>: what we'd expect from chance alone, given how common each word is.</p>
       <p>Dividing the observed $p(a,b)$ by that baseline cancels out the effect of commonness. A common word like "the" inflates both the numerator and the denominator, so it cancels. Only a genuine <i>attraction</i> between the two words survives.</p>
       <p>The <b>likelihood-ratio test</b> the book prefers does the same thing more carefully. It compares two hypotheses with a proper statistical model:</p>
       <ul>
         <li><b>$H_1$ (independent):</b> $b$ is just as likely after $a$ as after any other word.</li>
         <li><b>$H_2$ (dependent):</b> $b$ is more likely right after $a$.</li>
       </ul>
       <p>The test reports how much better $H_2$ explains the counts. It is more stable than PMI for low counts, which is why the book recommends it over plain PMI for ranking.</p>`,

    example:
      `<p>A tiny corpus of 100 words (so 99 bigrams). We score two candidate pairs: the real phrase "machine learning" and the filler "of the".</p>
       <table class="extable">
         <caption>Counts from the 100-word corpus. $N=100$ words, $B=99$ bigrams.</caption>
         <thead><tr><th>pair $(a,b)$</th><th class="num">count $a$</th><th class="num">count $b$</th><th class="num">count $(a,b)$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">machine learning</td><td class="num">10</td><td class="num">12</td><td class="num">8</td></tr>
           <tr><td class="row-h">of the</td><td class="num">25</td><td class="num">30</td><td class="num">7</td></tr>
         </tbody>
       </table>
       <p><b>Score "machine learning":</b></p>
       <ul class="steps">
         <li>$p(a) = 10/100 = 0.10$, $p(b) = 12/100 = 0.12$.</li>
         <li>$p(a,b) = 8/99 \\approx 0.0808$.</li>
         <li>Chance baseline: $p(a)\\,p(b) = 0.10 \\times 0.12 = 0.012$.</li>
         <li>Ratio: $0.0808 / 0.012 \\approx 6.73$ &mdash; about 6.7 times more than chance.</li>
         <li>$\\mathrm{PMI} = \\log(6.73) \\approx 1.91$ (natural log). Strongly positive &mdash; a real phrase.</li>
       </ul>
       <p><b>Score "of the":</b></p>
       <ul class="steps">
         <li>$p(a) = 25/100 = 0.25$, $p(b) = 30/100 = 0.30$ &mdash; both words are very common.</li>
         <li>$p(a,b) = 7/99 \\approx 0.0707$ &mdash; the pair is frequent too.</li>
         <li>Chance baseline: $p(a)\\,p(b) = 0.25 \\times 0.30 = 0.075$.</li>
         <li>Ratio: $0.0707 / 0.075 \\approx 0.943$.</li>
         <li>$\\mathrm{PMI} = \\log(0.943) \\approx -0.06$ &mdash; essentially zero (slightly negative).</li>
       </ul>
       <table class="extable">
         <caption>Same raw frequency, opposite verdict once you divide out commonness.</caption>
         <thead><tr><th>pair</th><th class="num">$p(a,b)$</th><th class="num">$p(a)p(b)$</th><th class="num">ratio</th><th class="num">PMI</th></tr></thead>
         <tbody>
           <tr><td class="row-h">machine learning</td><td class="num">0.0808</td><td class="num">0.012</td><td class="num">6.73</td><td class="num">+1.91</td></tr>
           <tr><td class="row-h">of the</td><td class="num">0.0707</td><td class="num">0.075</td><td class="num">0.94</td><td class="num">-0.06</td></tr>
         </tbody>
       </table>
       <p>"of the" co-occurs <i>just as often</i> as "machine learning" by raw count, but because "of" and "the" are everywhere its chance baseline is huge, so its PMI collapses to ~0. That gap is the whole point.</p>`,

    practice: [
      {
        q: `In a 1000-word corpus, "happy" appears 20 times, "hour" appears 25 times, and the bigram "happy hour" appears 15 times (out of 999 bigrams). Is this a phrase? Compute $\\mathrm{PMI}$.`,
        steps: [
          { do: `Word probabilities: $p(\\text{happy}) = 20/1000 = 0.02$, $p(\\text{hour}) = 25/1000 = 0.025$.`, why: `Each word probability is its count over the total word count.` },
          { do: `Joint probability: $p(a,b) = 15/999 \\approx 0.015$.`, why: `The bigram probability is the pair count over the number of bigrams.` },
          { do: `Chance baseline: $p(a)\\,p(b) = 0.02 \\times 0.025 = 0.0005$.`, why: `Independent words would co-occur this often, given how common each is.` },
          { do: `Ratio: $0.015 / 0.0005 = 30$. So $\\mathrm{PMI} = \\log(30) \\approx 3.40$.`, why: `Co-occurs 30 times more than chance; a large positive PMI.` }
        ],
        answer: `Yes, a strong phrase: ratio 30, $\\mathrm{PMI} \\approx 3.40$.`
      },
      {
        q: `"of the" is the most frequent bigram in a corpus. Why is raw frequency a bad way to decide it is a phrase, and what fixes it?`,
        steps: [
          { do: `Note that "of" and "the" are each extremely common on their own.`, why: `Common words land next to each other often, with no special meaning.` },
          { do: `Raw frequency counts only $p(a,b)$ and ignores $p(a)$ and $p(b)$.`, why: `It cannot tell "frequent because meaningful" from "frequent because both words are everywhere".` },
          { do: `PMI divides by the chance baseline $p(a)\\,p(b)$, which is huge for "of the", so the ratio collapses toward 1.`, why: `Dividing by the baseline cancels the effect of commonness.` }
        ],
        answer: `Raw frequency over-ranks filler. A statistical score (PMI or likelihood ratio) divides out commonness, so "of the" scores near zero.`
      },
      {
        q: `A bigram appears exactly once, and both its words are rare. Its PMI is enormous. Should you keep it as a phrase? What guards against this?`,
        steps: [
          { do: `Recall PMI: rare words make $p(a)\\,p(b)$ tiny, so a single co-occurrence gives a giant ratio.`, why: `PMI is unstable when counts are tiny; one accident looks like strong attraction.` },
          { do: `One observation is not evidence of a reliable phrase.`, why: `It could easily be a coincidence; nothing repeats it.` },
          { do: `Apply a frequency floor: drop bigrams seen fewer than, say, 5 or 10 times before scoring.`, why: `Only pairs with enough evidence survive, so PMI's instability is contained.` }
        ],
        answer: `No — discard it. A frequency floor before scoring guards against PMI's rare-word instability.`
      }
    ]
  });

  window.CODE["fe-phrase-detection"] = {
    lib: "nltk / spaCy / pandas",
    runnable: false,
    explain:
      `<p>The book's Chapter 3 pipeline on the <b>Yelp reviews dataset</b>: tokenize the review text, then find phrases (collocations) with two methods — spaCy's noun-chunk parser and nltk's statistical bigram scorer. Get the data from the book's repo: <code>github.com/alicezheng/feature-engineering-book</code> (Yelp Dataset Challenge round 6).</p>`,
    code: `import json
import pandas as pd
import spacy
import nltk
from nltk.collocations import BigramAssocMeasures, BigramCollocationFinder

# --- Load a slice of the Yelp reviews dataset (from the book's GitHub) ---
# github.com/alicezheng/feature-engineering-book
f = open('data/yelp/v6/yelp_academic_dataset_review.json')
js = [json.loads(f.readline()) for _ in range(10000)]
f.close()
review_df = pd.DataFrame(js)

# --- 1) Tokenization & parsing with spaCy (also gives noun chunks) ---
nlp = spacy.load('en_core_web_sm')
doc_df = review_df['text'].apply(nlp)          # parse each review

# spaCy tokenizes AND tags part-of-speech in one pass
for tok in doc_df[0]:
    print(tok.text, tok.pos_)                  # token + POS tag

# spaCy noun-chunk parsing: grammar-based noun phrases ("happy hour", "wait staff")
print([chunk.text for chunk in doc_df[0].noun_chunks])

# --- 2) Statistical phrase detection with nltk collocations ---
# Flatten all reviews into one token stream (lowercased words)
nltk.download('punkt')
words = [w.lower() for review in review_df['text']
                   for w in nltk.word_tokenize(review)
                   if w.isalpha()]

bigram_measures = BigramAssocMeasures()
finder = BigramCollocationFinder.from_words(words)
finder.apply_freq_filter(10)                   # frequency floor: drop rare bigrams

# Likelihood-ratio test: the book's preferred collocation score
print("Top by likelihood ratio:")
print(finder.nbest(bigram_measures.likelihood_ratio, 20))

# Pointwise mutual information: the same idea, simpler formula
print("Top by PMI:")
print(finder.nbest(bigram_measures.pmi, 20))

# Contrast: raw frequency over-ranks filler like ('of', 'the')
print("Top by raw frequency (note the junk):")
print(finder.nbest(bigram_measures.raw_freq, 20))`
  };

  window.CODEVIZ["fe-phrase-detection"] = {
    question: "How do you read a bigram-score bar chart to tell real phrases from filler -- and what does it look like when PMI misfires on rare words or when you score by raw frequency instead?",
    charts: [
      {
        type: "bars",
        title: "Healthy PMI ranking: real phrases tower over filler (inline corpus, numpy)",
        xlabel: "candidate bigram",
        ylabel: "PMI = log( p(a,b) / (p(a) p(b)) )",
        labels: ["machine learning", "deep learning", "of the", "in the", "the model"],
        values: [2.67, 2.67, 1.16, 1.02, 0.65],
        valueLabels: ["2.67", "2.67", "1.16", "1.02", "0.65"],
        colors: ["#7ee787", "#7ee787", "#ff7b72", "#ff7b72", "#ffb454"],
        interpret: "<b>This is what success looks like.</b> Each bar is one candidate word-pair; bar height is its PMI -- how much more often the two words co-occur than chance, given how common each word is on its own. Read it top-down by height: the genuine phrases <b>machine learning</b> and <b>deep learning</b> (green) sit at 2.67, more than double the filler pairs <b>of the</b> (1.16) and <b>in the</b> (1.02, red). Conclusion: PMI has pushed the meaningful phrases to the top and demoted the common-word filler, so a threshold around 2 cleanly separates phrases from junk. Real numpy output on the small inline corpus."
      },
      {
        type: "bars",
        title: "PMI misfire: a rare pair seen ONCE gets a giant score (illustrative)",
        xlabel: "candidate bigram",
        ylabel: "PMI = log( p(a,b) / (p(a) p(b)) )",
        labels: ["quokka spotted (seen 1x)", "machine learning", "deep learning", "of the"],
        values: [5.2, 2.67, 2.67, 1.16],
        valueLabels: ["5.20", "2.67", "2.67", "1.16"],
        colors: ["#ff7b72", "#7ee787", "#7ee787", "#9aa7b4"],
        interpret: "<b>Illustrative trap: do not trust the tallest bar blindly.</b> The red bar towers over even the true phrases -- but it is a pair seen exactly once, where both words are rare. Because PMI divides by p(a)p(b), two rare words make that denominator tiny, so a single accidental co-occurrence explodes the score. The shape to recognise: an outlier bar far above everything else, backed by a count of 1 or 2. The fix is a <b>frequency floor</b> (drop bigrams seen fewer than ~5-10 times) BEFORE scoring, which removes this bar entirely. Lesson: always read PMI alongside the raw count."
      },
      {
        type: "bars",
        title: "Wrong metric: raw frequency puts filler on top (illustrative)",
        xlabel: "candidate bigram",
        ylabel: "raw bigram count",
        labels: ["of the", "in the", "the model", "machine learning", "deep learning"],
        values: [41, 33, 19, 8, 6],
        valueLabels: ["41", "33", "19", "8", "6"],
        colors: ["#ff7b72", "#ff7b72", "#ffb454", "#7ee787", "#7ee787"],
        interpret: "<b>Illustrative: same data, wrong y-axis.</b> Here the bars are raw co-occurrence counts, not PMI. The order flips: filler <b>of the</b> and <b>in the</b> (red) sit on top simply because their words are everywhere, while the real phrases <b>machine learning</b> and <b>deep learning</b> (green) sink to the bottom. Recognise this failure when your top-ranked bigrams are all stopword pairs -- it means you ranked by frequency and forgot to correct for commonness. Switch the score to PMI or a likelihood-ratio test (which divide out p(a)p(b)) and the ranking inverts back to the healthy chart above."
      }
    ],
    caption: "How to read a bigram-score bar chart: bar = candidate word-pair, height = its score. With PMI (chart 1) real phrases tower over filler -- the healthy case. The variants are illustrative warnings: PMI on a once-seen rare pair (chart 2) produces a giant but meaningless spike fixed by a frequency floor, and ranking by raw frequency (chart 3) puts stopword filler on top. The book scores Yelp bigrams with nltk's likelihood-ratio test; this is the same idea by hand.",
    code: `import numpy as np

# A small REAL corpus: the phrase "machine learning" repeats on purpose.
corpus = (
    "machine learning is fun . machine learning powers a model in a lab . "
    "deep learning extends machine learning . a model uses deep learning . "
    "in a lab we study machine learning and we study deep learning . "
    "the cost of a model and the price of a dataset matter in the end . "
    "the team in an office near a river by a lake in a big city of the world . "
    "many of the books on the shelves of a room of the house in a quiet town . "
    "we love machine learning . they teach deep learning . the model in a room . "
    "of course the of the in the the of of in the a the of in in the of the ."
)

tokens = corpus.split()
N = len(tokens)
bigrams = list(zip(tokens[:-1], tokens[1:]))
B = len(bigrams)

# Unigram and bigram counts (numpy only, dict-based counting)
def counts(seq):
    keys, c = np.unique(np.array(seq, dtype=object), return_counts=True)
    return dict(zip(keys.tolist(), c.tolist()))

uni = counts(tokens)
bi  = counts([a + " " + b for a, b in bigrams])

def pmi(a, b):
    p_a  = uni[a] / N
    p_b  = uni[b] / N
    p_ab = bi[a + " " + b] / B
    return float(np.log(p_ab / (p_a * p_b)))

candidates = [("machine", "learning"), ("deep", "learning"),
              ("of", "the"), ("in", "the"), ("the", "model")]
for a, b in candidates:
    print(f"{a} {b}: PMI = {pmi(a, b):.2f}")

# -> machine learning: PMI = 2.67
#    deep learning:    PMI = 2.67
#    of the:           PMI = 1.16
#    in the:           PMI = 1.02
#    the model:        PMI = 0.65`
  };
})();
