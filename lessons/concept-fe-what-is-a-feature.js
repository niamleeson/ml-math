/* =====================================================================
   CONCEPT LESSON — What is a feature? (Feature Engineering, Zheng &
   Casari, Chapter 1: "The Machine Learning Pipeline").
   The intro lesson of the Feature Engineering module. It frames the
   data -> features -> model pipeline and maps the rest of the module.
   Self-contained: pushes one lesson into window.LESSONS and registers
   one window.CODE and one window.CODEVIZ entry.
   The CODEVIZ numbers are REAL: a logistic-regression classifier on the
   bundled load_breast_cancer data (569 real tumors), raw vs standardized.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-what-is-a-feature",
    title: "What is a feature?",
    tagline: "A feature is a number that stands for one aspect of your raw data; features sit between the data and the model.",
    module: "Feature Engineering",
    prereqs: ["ml-classification-metrics"],

    whenToUse:
      `<p><b>This is the framing lesson for the whole Feature Engineering module.</b> Reach for the ideas here at the very start of any modeling project, before you pick an algorithm.</p>
       <p>Chapter 1 of Zheng &amp; Casari makes one promise: how you turn raw data into numbers decides whether your model can learn at all. A model only ever sees <i>features</i> — never the raw world. So the features you build are the lens the model looks through.</p>
       <p><b>Why this matters so much:</b></p>
       <ul>
         <li>Good features make the modeling step easy. The right numbers let even a simple model draw a clean line between classes.</li>
         <li>Bad features make modeling impossible. No amount of tuning fixes numbers that hide the signal.</li>
         <li>The right features depend on <b>both</b> the model and the data. A transform that helps a linear model may do nothing for a tree, and a transform that suits skewed counts may hurt clean measurements.</li>
       </ul>
       <p>This is also where practitioners spend most of their time. Picking and training a model is often the quick part; <b>feature engineering is the long part</b>, and it is where domain knowledge pays off.</p>`,

    application:
      `<p>The book frames feature engineering as one stage of a pipeline that runs: <b>raw data &rarr; features &rarr; model &rarr; prediction</b>. Every later lesson in this module is a tool for the middle arrow. Here is the map so you know where each one fits.</p>
       <p><b>Numeric data.</b> The simplest features start from numbers you already have, but raw numbers rarely feed a model well.</p>
       <ul>
         <li><b>Counts and binarization</b> — turn "how many times" into a feature, or collapse it to "did it happen at all".</li>
         <li><b>Binning (quantization)</b> — group a continuous range into buckets.</li>
         <li><b>Log and power transforms</b> — tame skewed, heavy-tailed values so the model sees a fairer spread.</li>
         <li><b>Feature scaling / normalization</b> — put features on a common range so big-valued columns do not drown out small ones.</li>
         <li><b>Interaction features</b> — multiply features together to capture "this matters only when that is also true".</li>
         <li><b>Feature selection</b> — drop features that add noise, not signal.</li>
       </ul>
       <p><b>Text data.</b> Raw text is not numbers at all, so it needs its own pipeline.</p>
       <ul>
         <li><b>Bag-of-words (BoW)</b> — count each word; the document becomes a vector of counts.</li>
         <li><b>N-grams</b> — count short word sequences, not just single words, to keep some order.</li>
         <li><b>Filtering</b> — strip stopwords and rare tokens that only add noise.</li>
         <li><b>Phrase detection (collocations)</b> — find multi-word units like "New York" that mean more together.</li>
         <li><b>tf-idf (term frequency&ndash;inverse document frequency)</b> — down-weight words common across all documents and up-weight distinctive ones.</li>
       </ul>
       <p><b>Categorical data.</b> Labels like city or product need encoding before a model can use them.</p>
       <ul>
         <li><b>Encoding</b> — one-hot, dummy, and effect coding turn categories into 0/1 columns.</li>
         <li><b>Feature hashing</b> — squeeze a huge number of categories into a fixed-size vector.</li>
         <li><b>Bin-counting</b> — replace a category with a statistic (like its historical click rate).</li>
       </ul>
       <p><b>Automatic and learned features.</b> Sometimes the data builds its own features.</p>
       <ul>
         <li><b>PCA (Principal Component Analysis)</b> — compress many correlated features into a few uncorrelated ones.</li>
         <li><b>k-means featurization</b> — use cluster membership as a new feature.</li>
         <li><b>Image features</b> — from hand-built gradients to learned representations.</li>
         <li><b>Deep features</b> — let a neural network learn the features for you, end-to-end.</li>
       </ul>
       <p>The module closes with an <b>end-to-end</b> example that stacks several of these on a real dataset. Every one of them is an answer to the same question this lesson asks: what numbers should the model see?</p>`,

    pitfalls:
      `<ul>
         <li><b>Garbage in, garbage out.</b> The book's central warning. If the features do not carry the signal, the model cannot invent it. A great algorithm on bad features loses to a plain algorithm on good features.</li>
         <li><b>A good model can't fix bad features.</b> It is tempting to answer poor results with a fancier model. Usually the fix is upstream — better features — not downstream.</li>
         <li><b>Forgetting that the right feature depends on the model.</b> Tree models split on order and barely care about scaling; linear and distance-based models care a lot. Engineer features <i>for the model you will use</i>.</li>
         <li><b>Forgetting that the right feature depends on the data.</b> A log transform helps skewed positive counts but is meaningless on values that can be zero or negative. Look at the data before choosing a transform.</li>
         <li><b>Treating feature engineering as a one-time step.</b> It is iterative: build features, train, look at the errors, and revise. Most project time lives in this loop.</li>
         <li><b>Leaking the target.</b> A feature built using information you would not have at prediction time inflates your scores and fails in production. Build features only from inputs available at predict time.</li>
       </ul>`,

    bigIdea:
      `<p><b>Data</b> are observations of real-world phenomena. A photo, a sentence, a purchase, a sensor reading — each is a trace of something that happened in the world.</p>
       <p>A model cannot work with the world directly. It works with numbers. So we need a bridge.</p>
       <p>That bridge is a <b>feature</b>: a numeric representation of one aspect of the raw data. "How long is this review?" is a feature. "How many times does the word <i>great</i> appear?" is a feature. Each one is a single number that captures a slice of the raw thing.</p>
       <p><b>Feature engineering</b> is the act of building those numbers: extracting features from raw data and shaping them into a format the model can use well. It is the whole job of this module.</p>`,

    buildup:
      `<p>Zheng &amp; Casari draw the machine learning pipeline as a chain. Each link feeds the next.</p>
       <ul class="steps">
         <li><b>Raw data.</b> The messy real thing: text, images, logs, tables.</li>
         <li><b>Features.</b> Numbers extracted from the raw data. This is the layer you design.</li>
         <li><b>Model.</b> A mathematical recipe that maps features to an answer. It only ever sees the features.</li>
         <li><b>Prediction / task.</b> The output you actually wanted — a label, a number, a ranking.</li>
       </ul>
       <p>The key insight: <b>features sit between the data and the model</b>. The model never touches the raw data. Whatever you fail to put into the features is invisible to the model forever.</p>
       <p>So feature engineering is not a side chore. It is where you decide what the model gets to know. Two practitioners with the same data and the same algorithm can get wildly different results purely from the features they build.</p>
       <p>And there is no single "best" feature. The right choice depends on two things at once: the <b>model</b> (what kind of patterns it can fit) and the <b>data</b> (its shape, scale, and quirks). The rest of this module is a toolbox of transforms, each suited to certain model/data pairings.</p>`,

    symbols: [
      { sym: "$x$", desc: "one raw observation — a single review, image, or row. The unprocessed input." },
      { sym: "$\\phi$", desc: "a feature function: it takes a raw observation and returns a number. Greek letter 'phi'." },
      { sym: "$\\phi(x)$", desc: "the feature value for observation $x$: the number that $\\phi$ extracts from it." },
      { sym: "$d$", desc: "the number of features you build. Each observation becomes a list of $d$ numbers." },
      { sym: "$\\mathbf{z}$", desc: "the feature vector for one observation: $\\mathbf{z} = [\\phi_1(x), \\phi_2(x), \\ldots, \\phi_d(x)]$. This is what the model actually sees." },
      { sym: "$f$", desc: "the model: a function that maps a feature vector to a prediction." },
      { sym: "$\\hat{y}$", desc: "the prediction. The hat means 'the model's guess'." }
    ],

    formula: `$$ x \\;\\xrightarrow{\\;\\phi\\;}\\; \\mathbf{z} = \\big[\\phi_1(x),\\, \\phi_2(x),\\, \\ldots,\\, \\phi_d(x)\\big] \\;\\xrightarrow{\\;f\\;}\\; \\hat{y} $$`,

    whatItDoes:
      `<p>This one line <i>is</i> the pipeline. Read it left to right.</p>
       <p><b>Start with $x$</b>, a raw observation. It is not numbers a model can use — maybe it is a paragraph of text or an image.</p>
       <p><b>Apply the feature functions $\\phi_1, \\ldots, \\phi_d$.</b> Each $\\phi_j$ looks at $x$ and returns one number $\\phi_j(x)$. Stacking those numbers gives the feature vector $\\mathbf{z}$. This arrow is the part you control; it is feature engineering.</p>
       <p><b>Feed $\\mathbf{z}$ to the model $f$.</b> The model never saw $x$. It only saw $\\mathbf{z}$. Out comes the prediction $\\hat{y}$.</p>
       <p>The lesson of the formula: the model's whole view of the world is $\\mathbf{z}$. If $\\mathbf{z}$ captures the signal, $f$ has an easy job. If $\\mathbf{z}$ hides it, no model can recover it. That is why the middle arrow gets most of your effort.</p>`,

    derivation:
      `<p><b>Why features can make or break the model.</b> Think of a model as drawing a boundary in feature space — say, a straight line that separates "spam" from "not spam". The model can only draw shapes in the space you hand it. If your features place the two classes on opposite sides of a line, a simple linear model finds that line easily. If your features tangle the classes together, no straight line works, and even a powerful model struggles.</p>
       <p>So feature engineering is really about <b>reshaping the space</b> until the answer becomes easy to draw. A log transform spreads out a squashed cluster. Scaling stops one big-valued feature from dominating a distance. An interaction term lets a linear model express "both at once". Each transform in this module bends the space toward a shape the model can handle.</p>
       <p><b>Why the right feature depends on the model.</b> A decision tree splits on whether a feature is above or below a threshold, so it cares only about <i>order</i> — rescaling a feature changes nothing for a tree. A linear model multiplies each feature by a weight, so the <i>scale</i> matters a lot. The same transform can be vital for one model and pointless for another.</p>
       <p><b>Why the right feature depends on the data.</b> The shape of the raw values decides what helps. Heavily skewed positive counts beg for a log transform; clean bounded measurements do not. Many rare categories call for hashing; a handful call for one-hot encoding. You must look at the data before choosing the tool.</p>
       <p><b>Why practitioners live here.</b> Because there is no formula that hands you the right features — only judgment, iteration, and domain knowledge. You build features, train, study the mistakes, and revise. That loop, not the model fit, is where most of the work and most of the gains live.</p>`,

    example:
      `<p>A tiny worked example in the spirit of Chapter 1: turning raw text into a feature.</p>
       <p>Raw observation $x$ = the review <i>"Great great food and great service"</i>. A model cannot read that. We need a feature.</p>
       <ul class="steps">
         <li><b>Pick a feature function.</b> Let $\\phi(x)$ = the number of times the word "great" appears. This is one numeric aspect of the raw review.</li>
         <li><b>Apply it.</b> "great" appears 3 times, so $\\phi(x) = 3$.</li>
         <li><b>Now the review is a number.</b> The single value $3$ is something a model can multiply by a weight and learn from.</li>
       </ul>
       <p>Add a second feature: $\\phi_2(x)$ = total word count = $6$. Now $\\mathbf{z} = [3, 6]$. The raw sentence has become a 2-number vector the model can use.</p>
       <p>Notice the choice we made. We could have counted any word, used presence-vs-absence instead of counts, or weighted rare words higher with tf-idf. Each is a different feature for the same raw data — and which is best depends on the model and the rest of the corpus. That space of choices is exactly what the rest of this module explores.</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // The pipeline made tangible: type a review, watch two feature functions
      // turn it into a 2-number vector, then watch a tiny fixed linear model
      // turn that vector into a sentiment guess. The model NEVER sees the text.
      var st = { text: "Great great food and great service" };
      var wrap = document.createElement("div"); host.appendChild(wrap);

      var lab = document.createElement("label"); lab.style.display = "block"; lab.style.marginBottom = "4px"; lab.textContent = "Raw observation x (a review):";
      wrap.appendChild(lab);
      var inp = document.createElement("input"); inp.type = "text"; inp.value = st.text;
      inp.style.width = "100%"; inp.style.boxSizing = "border-box"; inp.style.padding = "6px";
      wrap.appendChild(inp);

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 220; cv.style.marginTop = "10px"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var out = document.createElement("div"); out.className = "out"; out.style.marginTop = "8px"; host.appendChild(out);

      function feats(t) {
        var words = t.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 0; });
        var great = 0;
        for (var i = 0; i < words.length; i++) if (words[i].replace(/[^a-z]/g, "") === "great") great++;
        return { great: great, count: words.length };
      }
      function box(x, y, w, h, fill, stroke) {
        ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke();
      }
      function arrow(x1, y, x2, label) {
        var c = C();
        ctx.strokeStyle = c.dim; ctx.fillStyle = c.dim; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2 - 7, y - 4); ctx.lineTo(x2 - 7, y + 4); ctx.closePath(); ctx.fill();
        if (label) { ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText(label, (x1 + x2) / 2, y - 8); }
      }
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, cv.width, cv.height);
        var f = feats(st.text);
        // tiny fixed "model": score = 0.9*great - 0.15*count + 0.5 ; >0 -> positive
        var score = 0.9 * f.great - 0.15 * f.count + 0.5;
        var pos = score > 0;
        var yMid = 70;
        // raw data box
        box(20, yMid - 30, 150, 60, c.panel, c.border);
        ctx.fillStyle = c.ink; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("raw data x", 95, yMid - 14);
        ctx.fillStyle = c.dim;
        var shown = st.text.length > 22 ? st.text.slice(0, 20) + "..." : st.text;
        ctx.fillText('"' + (shown || " ") + '"', 95, yMid + 6);
        // arrow phi
        arrow(172, yMid, 232, "phi");
        // feature vector box
        box(234, yMid - 30, 150, 60, c.panel, c.accent);
        ctx.fillStyle = c.ink; ctx.fillText("feature vector z", 309, yMid - 14);
        ctx.fillStyle = c.accent;
        ctx.fillText("z = [ " + f.great + " , " + f.count + " ]", 309, yMid + 8);
        // arrow f
        arrow(386, yMid, 446, "model f");
        // prediction box
        box(448, yMid - 30, 170, 60, c.panel, pos ? c.accent2 : c.warn);
        ctx.fillStyle = c.ink; ctx.fillText("prediction y-hat", 533, yMid - 14);
        ctx.fillStyle = pos ? c.accent2 : c.warn;
        ctx.fillText(pos ? "POSITIVE" : "NEGATIVE", 533, yMid + 8);
        // legend under z
        ctx.fillStyle = c.dim; ctx.font = "10px sans-serif"; ctx.textAlign = "center";
        ctx.fillText('["great" count, word count]', 309, yMid + 46);
        ctx.fillText("the model only ever sees z, never x", cv.width / 2, 175);
        ctx.fillText("score = 0.9*great - 0.15*count + 0.5 = " + score.toFixed(2), cv.width / 2, 195);
        ctx.textAlign = "start";
        return { f: f, score: score, pos: pos };
      }
      function render() {
        var r = draw();
        out.innerHTML = "Two feature functions turn the text into <b style='color:" + C().accent + "'>z = [" + r.f.great + ", " + r.f.count + "]</b>. " +
          "A fixed tiny linear model scores it <b>" + r.score.toFixed(2) + "</b> &rarr; <b style='color:" + (r.pos ? C().accent2 : C().warn) + "'>" + (r.pos ? "POSITIVE" : "NEGATIVE") + "</b>. " +
          "Change the text and the features change; the model reacts only to the numbers.";
      }
      inp.addEventListener("input", function () { st.text = inp.value; render(); });
      render();
    },

    practice: [
      {
        q: `Your text classifier does poorly. A teammate says "let's swap the logistic regression for a deep neural network". According to Chapter 1's framing, why might that be the wrong first move, and what should you check instead?`,
        steps: [
          { do: `Recall the pipeline order: raw data &rarr; features &rarr; model &rarr; prediction.`, why: `The model only ever sees the features, never the raw data.` },
          { do: `Ask whether the features carry the signal. If they do not, the model cannot recover it.`, why: `Garbage in, garbage out — a fancier model cannot invent information the features left out.` },
          { do: `Inspect and improve the features first: better tokenization, tf-idf weighting, n-grams, dropping noise.`, why: `Most projects gain more from better features than from a bigger model.` }
        ],
        answer: `A more powerful model can't fix bad features. Check the features first — the model only sees what feature engineering puts in front of it. Improve the features before reaching for a bigger model.`
      },
      {
        q: `The raw review is "good food good price". You build two features: $\\phi_1$ = count of the word "good", and $\\phi_2$ = total word count. What feature vector $\\mathbf{z}$ does the model receive?`,
        steps: [
          { do: `Apply $\\phi_1$: count "good". It appears twice, so $\\phi_1(x) = 2$.`, why: `Each feature function returns one number extracted from the raw text.` },
          { do: `Apply $\\phi_2$: count all words. "good food good price" has 4 words, so $\\phi_2(x) = 4$.`, why: `A second feature captures a different aspect of the same raw observation.` },
          { do: `Stack them into the feature vector $\\mathbf{z} = [\\phi_1(x), \\phi_2(x)] = [2, 4]$.`, why: `The vector $\\mathbf{z}$ is exactly what the model sees — the raw text is gone.` }
        ],
        answer: `$\\mathbf{z} = [2, 4]$.`
      },
      {
        q: `You add a feature scaling step that rescales every column to a similar range. It noticeably helps your logistic regression but does almost nothing for your gradient-boosted trees. Why does the same feature transform help one model and not the other?`,
        steps: [
          { do: `Recall how a linear model uses features: it multiplies each by a weight and adds them, so the scale of a feature directly affects its influence and the optimizer.`, why: `Wildly different scales let one column dominate and slow or distort fitting — Chapter 1's point that the right feature depends on the model.` },
          { do: `Recall how a tree uses features: it splits on whether a feature is above or below a threshold, caring only about order.`, why: `A monotone rescaling does not change the order, so the same splits remain available.` },
          { do: `Conclude that scaling matters for the scale-sensitive model but is invisible to the order-only model.`, why: `The best feature engineering choice depends on the model you will use.` }
        ],
        answer: `Scaling helps the linear model because it weights features by their raw scale; trees split only on order, so a monotone rescale leaves them unchanged. The right feature depends on the model.`
      }
    ]
  });

  window.CODE["fe-what-is-a-feature"] = {
    lib: "pandas",
    runnable: false,
    explain: `<p>In the spirit of Chapter 1, this loads a real dataset with <code>pandas</code> and shows raw data sitting next to a simple numeric <b>feature</b> extracted from it. The book introduces feature engineering on the Yelp reviews and Online News Popularity datasets (get them from the book's GitHub: <code>github.com/alicezheng/feature-engineering-book</code>). Here we use the Online News Popularity table: the raw rows are articles, and a feature is one number per article — for example, the article's word count, or a binary "is it long?" flag built from that count. The point of the example is the contrast: the raw <code>DataFrame</code> versus the single numeric column the model will actually consume.</p>`,
    code: `import pandas as pd

# Online News Popularity dataset from the book's GitHub:
# github.com/alicezheng/feature-engineering-book
# (each row is one article; columns are raw measurements about it)
df = pd.read_csv('OnlineNewsPopularity.csv')
df.columns = df.columns.str.strip()          # the file has leading spaces

# --- RAW DATA: observations of a real-world phenomenon (published articles) ---
print(df[['n_tokens_content', 'shares']].head())
#    n_tokens_content  shares
# 0             219.0     593
# 1             255.0     711
# 2             211.0    1500
# 3             531.0    1200
# 4            1072.0     505

# --- A FEATURE: a numeric representation of one aspect of the raw data ---
# Feature 1: the raw word count is already numeric -> use it directly.
df['word_count'] = df['n_tokens_content']

# Feature 2: a SIMPLE engineered feature -- a binary "is this a long article?"
# (1 if the article is longer than the median, else 0). One number per article.
median_len = df['n_tokens_content'].median()
df['is_long'] = (df['n_tokens_content'] > median_len).astype(int)

print(df[['word_count', 'is_long']].head())
#    word_count  is_long
# 0       219.0        0
# 1       255.0        0
# 2       211.0        0
# 3       531.0        1
# 4      1072.0        1

# The model never sees the raw article -- only feature columns like these.
X = df[['word_count', 'is_long']]   # what the model consumes
y = df['shares']                    # the target we want to predict`
  };

  window.CODEVIZ["fe-what-is-a-feature"] = {
    question: "On real tumor data, does a simple feature transform actually change how well the model does — and what are the cases where it helps, does nothing, hurts, or looks too good to be true?",
    charts: [
      {
        type: "bars",
        title: "Helps: scaling lifts a linear model (real load_breast_cancer)",
        xlabel: "feature set fed to the same linear model",
        ylabel: "test accuracy",
        labels: ["raw features", "scaled features"],
        values: [0.936, 0.959],
        valueLabels: ["0.936", "0.959"],
        colors: ["#ffb454", "#7ee787"],
        interpret: "Each bar is the same logistic regression on the same train/test split — <b>only the features change</b>. The y-axis is test accuracy, so taller is better. The raw columns span wildly different scales (mean area 143–2501 vs mean smoothness ≈0.1), so the raw model lags at 0.936 (orange); one StandardScaler step lifts it to 0.959 (green). Read this as: the feature transform, not the model, moved the score."
      },
      {
        type: "bars",
        title: "Does nothing: same scaling on a tree model",
        xlabel: "feature set fed to the same tree model",
        ylabel: "test accuracy",
        labels: ["raw features", "scaled features"],
        values: [0.953, 0.953],
        valueLabels: ["0.953", "0.953"],
        colors: ["#9aa7b4", "#9aa7b4"],
        interpret: "Illustrative. Same two feature sets, but fed to a decision-tree / gradient-boosted model. The bars are the <b>same height</b>: a tree splits on whether a feature is above or below a threshold, so it cares only about order, and a monotone rescale leaves every split unchanged. Recognise this flat pair when a transform that helped your linear model does nothing for trees — the right feature depends on the model."
      },
      {
        type: "bars",
        title: "Hurts: wrong transform for the data",
        xlabel: "feature set fed to the same linear model",
        ylabel: "test accuracy",
        labels: ["raw features", "log-transformed"],
        values: [0.936, 0.872],
        valueLabels: ["0.936", "0.872"],
        colors: ["#ffb454", "#ff7b72"],
        interpret: "Illustrative failure. Here a log transform is applied blindly to columns that include zeros and near-symmetric values, so accuracy <b>drops</b> from 0.936 to 0.872 (red shorter than orange). A transform is not automatically good: log helps skewed positive counts but mangles data it does not suit. Recognise this when 'feature engineering' makes things worse — the right feature depends on the data, so look before you transform."
      },
      {
        type: "bars",
        title: "Too good to be true: target leakage",
        xlabel: "feature set fed to the same linear model",
        ylabel: "test accuracy",
        labels: ["honest features", "with a leaked feature"],
        values: [0.959, 1.000],
        valueLabels: ["0.959", "1.000"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "Illustrative. The right bar hits a suspiciously <b>perfect 1.000</b> because a feature was built from information you would not have at prediction time (a stand-in for the label leaked in). Treat a near-perfect jump as a <b>red flag</b>, not a win: it vanishes in production where that information is missing. Recognise leakage by the implausibly high score, then trace each feature back to what is truly known at predict time."
      }
    ],
    caption: "Same data, same train/test split — only the features change. The first chart is real (load_breast_cancer, StandardScaler lifts 0.936 to 0.959); the rest are illustrative cases you actually meet — a transform that does nothing (trees), one that hurts (wrong tool for the data), and the perfect-score smell of target leakage.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

data = load_breast_cancer()          # 569 real tumors, 30 numeric features
X, y = data.data, data.target
Xtr, Xte, ytr, yte = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

# --- Model on the RAW features (very different column scales) ---
clf_raw = LogisticRegression(max_iter=200).fit(Xtr, ytr)
raw_acc = clf_raw.score(Xte, yte)

# --- Model on a SIMPLE engineered feature: standardized columns ---
scaler = StandardScaler().fit(Xtr)
clf_scaled = LogisticRegression(max_iter=200).fit(scaler.transform(Xtr), ytr)
scaled_acc = clf_scaled.score(scaler.transform(Xte), yte)

print(round(raw_acc, 3), round(scaled_acc, 3))
# -> 0.936 0.959   (same model + data; only the features changed)`
  };
})();
