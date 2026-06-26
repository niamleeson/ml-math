(function () {
  window.LESSONS.push({
    id: "fe-scaling-normalization",
    title: "Feature Scaling or Normalization",
    tagline: "Put features that live on wildly different scales onto a common footing — so distance- and gradient-based models stop being bullied by the big-numbered column.",
    module: "Feature Engineering",
    prereqs: ["met-distribution", "skill-validation", "skill-leakage"],
    whenToUse:
      `<p><b>Reach for scaling whenever a feature's raw magnitude — not its information — would dominate the model.</b> One column might be "number of words" (in the hundreds) and another "color hue" (around 1). A model that measures distances or follows gradients treats the hundreds-column as if it mattered hundreds of times more, purely because of the units. Scaling fixes the units so every feature gets a fair say.</p>
       <p><b>The three tools from the book, and when each fits:</b></p>
       <ul>
         <li><b>Min-max scaling</b> &rarr; squashes a feature into <code>[0, 1]</code>. Use it for <i>bounded</i> inputs — pixel intensities for images, or anything with a known, stable floor and ceiling.</li>
         <li><b>Standardization (z-score / variance scaling)</b> &rarr; re-centers to mean 0 and rescales to variance 1. This is the <b>safe default</b> for linear models with regularization, stochastic-gradient-descent (SGD) learners, and neural networks.</li>
         <li><b>L2 normalization</b> &rarr; divides each <i>row</i> (each example's vector) by its own length, so every example lands on the unit sphere. Use it when only <i>direction</i> matters — cosine similarity, text feature vectors.</li>
       </ul>
       <p><b>Key fact the book stresses:</b> scaling only stretches or shifts the axis — it does <i>not</i> change the <i>shape</i> of a feature's distribution. A skewed feature is still skewed after scaling. Reshaping the distribution is the job of the <i>log</i> / <i>power</i> transform, a different tool. And <b>tree-based models</b> (decision trees, random forests, gradient-boosted trees) are <b>scale-invariant</b> — they split on thresholds, so monotone rescaling changes nothing. Skip scaling for them.</p>`,
    application:
      `<p>Chapter 2 of Zheng &amp; Casari demonstrates scaling on the <b>Online News Popularity</b> dataset (UCI), using the feature <code>n_tokens_content</code> — the number of words in an article. That count runs from zero into the thousands, so on its own it would swamp small-valued companions like <code>global_rate_positive_words</code>.</p>
       <ul>
         <li><b>Linear models &amp; logistic regression with L1/L2 penalties:</b> the penalty shrinks all coefficients with one shared strength. If features are on different scales, the penalty hits them unequally — standardization makes the regularization fair.</li>
         <li><b>k-NN, k-means, SVMs (Support Vector Machines) with radial kernels:</b> they compute Euclidean distances; a single large-scaled feature dictates the distance unless you scale.</li>
         <li><b>Neural networks &amp; any SGD-trained model:</b> wildly different feature scales make the loss surface a stretched ravine, so gradient descent zig-zags and converges slowly. Scaling rounds out the ravine.</li>
         <li><b>Images:</b> pixel values in <code>[0, 255]</code> are min-max scaled to <code>[0, 1]</code> almost universally.</li>
         <li><b>Text / TF-IDF vectors:</b> L2-normalized rows so that long and short documents compare by direction, not by length.</li>
       </ul>
       <p>This builds on <a>[met-distribution]</a> (shape vs. location vs. spread), and the leakage discipline from <a>[skill-leakage]</a> / <a>[skill-validation]</a> dictates <i>how</i> you fit the scaler.</p>`,
    pitfalls:
      `<ul>
         <li><b>Fitting the scaler on ALL the data (the leakage trap).</b> The tell: <code>StandardScaler().fit_transform(X)</code> appears <i>above</i> the train/test split. The held-out rows' mean and variance leak into training, so your validation score is optimistic. <b>Fix:</b> fit the scaler on the <i>training fold only</i> and put it inside a <code>Pipeline</code>, so it is re-fit on each fold automatically.</li>
         <li><b>Outliers wrecking min-max scaling.</b> The tell: one extreme value sets the <code>max</code>, so every ordinary point gets crushed into a tiny sliver near 0. <b>Fix:</b> prefer standardization, or <code>RobustScaler</code> (which uses the median and the interquartile range instead of min/max).</li>
         <li><b>Expecting scaling to fix skew.</b> The tell: a long-tailed feature is "still ugly" after standardization. Scaling shifts and stretches the axis but <i>cannot</i> change the distribution's shape. <b>Fix:</b> that is the <i>log</i> / <i>power</i> transform's job, applied <i>before</i> scaling.</li>
         <li><b>Centering sparse data.</b> The tell: standardizing a huge sparse matrix (subtracting the mean) fills in all the zeros and explodes memory. <b>Fix:</b> use <code>StandardScaler(with_mean=False)</code> or <code>MaxAbsScaler</code>, which preserve sparsity by not centering.</li>
         <li><b>Scaling tree models for no reason.</b> The tell: a <code>StandardScaler</code> sits in front of a random forest or gradient-boosted tree. Trees split on thresholds, so any monotone rescaling leaves the splits unchanged — it is wasted work. <b>Fix:</b> drop the scaler for tree-based models.</li>
       </ul>`,
    bigIdea:
      `<p>A feature's <i>units</i> are arbitrary. Whether you record a length in millimeters or kilometers does not change the underlying information, yet it changes the raw number by a factor of a million. Many models cannot tell the difference between "this feature carries more signal" and "this feature just has bigger numbers".</p>
       <p><b>Scaling removes the units.</b> It rewrites every feature into a comparable range so that the model judges features by their <i>information</i>, not their <i>magnitude</i>. Crucially, all three methods here are <b>affine per-feature</b> (min-max, standardization) or <b>per-row rescaling</b> (L2) — they move and stretch points but never bend the cloud. The <i>shape</i> of each feature's histogram is preserved; only its location and spread change.</p>`,
    buildup:
      `<p>Imagine two columns: word-count in the hundreds, hue around 1. Plot every example as a point. The cloud is a thin horizontal pancake — almost all of its width comes from word-count, almost none from hue.</p>
       <p>A k-nearest-neighbours model asks "which points are close?" Distance is dominated by the wide axis, so hue is effectively ignored. <b>Standardization</b> divides each axis by its own spread, turning the pancake into a round blob: now both features contribute comparably to distance, and the model can actually use hue.</p>
       <p><b>Min-max</b> does the same fairness job but maps to a fixed <code>[0, 1]</code> box instead of unit variance — handy when you need bounded inputs. <b>L2 normalization</b> takes a different view entirely: it projects every example onto the unit sphere, so two examples are "the same" if they point the same direction regardless of length — exactly what cosine similarity wants.</p>`,
    symbols: [
      { sym: "$x$", desc: "one raw value of a feature, before scaling." },
      { sym: "$\\tilde{x}$", desc: "the scaled value of that same feature ('x-tilde' — the tilde marks the transformed version)." },
      { sym: "$\\min,\\ \\max$", desc: "the smallest and largest values the feature takes across the training set." },
      { sym: "$\\mu$", desc: "the mean (Greek 'mu') of the feature over the training set — its center." },
      { sym: "$\\sigma$", desc: "the standard deviation (Greek 'sigma') of the feature — how spread out it is. $\\sigma^2$ is the variance." },
      { sym: "$\\mathbf{x}$", desc: "a whole row — one example's feature vector $(x_1,\\dots,x_d)$ across all $d$ features." },
      { sym: "$\\lVert \\mathbf{x} \\rVert_2$", desc: "the L2 norm (Euclidean length) of the row: $\\sqrt{x_1^2+\\dots+x_d^2}$." }
    ],
    formula: `$$ \\underbrace{\\tilde{x}=\\frac{x-\\min}{\\max-\\min}}_{\\text{min-max} \\to [0,1]} \\qquad \\underbrace{\\tilde{x}=\\frac{x-\\mu}{\\sigma}}_{\\text{standardize} \\to \\text{mean }0,\\ \\text{var }1} \\qquad \\underbrace{\\tilde{\\mathbf{x}}=\\frac{\\mathbf{x}}{\\lVert \\mathbf{x} \\rVert_2}}_{\\text{L2 normalize} \\to \\text{unit sphere}} $$`,
    whatItDoes:
      `<p><b>Min-max</b> subtracts the minimum (so the smallest value becomes 0) and divides by the range (so the largest becomes 1). Every value lands in <code>[0, 1]</code>. It is a <i>per-column</i> operation.</p>
       <p><b>Standardization</b> subtracts the mean (re-centering the feature on 0) and divides by the standard deviation (rescaling its spread to 1). After it, the feature has mean 0 and variance 1. Also <i>per-column</i>. It does not bound the values — outliers can still sit several units from 0, which is exactly why it tolerates outliers better than min-max.</p>
       <p><b>L2 normalization</b> is different: it works <i>per-row</i>. It divides an example's whole vector by that vector's own Euclidean length, so the result has length 1. The example's <i>direction</i> is preserved, its <i>magnitude</i> is discarded — perfect for cosine similarity, where only the angle between vectors matters.</p>`,
    derivation:
      `<p><b>Why standardization gives mean 0 and variance 1.</b></p>
       <ul class="steps">
         <li>Start with the mean of the scaled feature. Linearity of the mean lets us pull the constants out: $\\operatorname{mean}\\!\\left(\\frac{x-\\mu}{\\sigma}\\right)=\\frac{\\operatorname{mean}(x)-\\mu}{\\sigma}=\\frac{\\mu-\\mu}{\\sigma}=0$. The subtraction of $\\mu$ centers it on zero.</li>
         <li>Now the variance. Multiplying a variable by a constant $a$ multiplies its variance by $a^2$; adding a constant changes nothing. Here $a=1/\\sigma$, so $\\operatorname{Var}\\!\\left(\\frac{x-\\mu}{\\sigma}\\right)=\\frac{1}{\\sigma^2}\\operatorname{Var}(x)=\\frac{\\sigma^2}{\\sigma^2}=1$. Dividing by $\\sigma$ normalizes the spread to one.</li>
         <li><b>Why the shape is unchanged.</b> Both min-max and standardization are <b>affine</b> maps $\\tilde{x}=ax+b$ with $a>0$. An affine map only stretches and shifts the number line; it cannot create or remove a tail. So a histogram that was right-skewed before is right-skewed by the same amount after — only its labels on the axis changed. To <i>reshape</i> the distribution you need a <i>non-linear</i> map like $\\log$, which is the log/power transform's territory.</li>
         <li><b>Why trees ignore scaling.</b> A tree split asks "is $x \\lt t$?". Under any increasing rescaling $\\tilde{x}=ax+b$, the equivalent threshold is $\\tilde{t}=at+b$, and the <i>same rows</i> fall on each side. The partition is identical, so the tree is unchanged. $\\blacksquare$</li>
       </ul>`,
    example:
      `<p>Take two real <code>load_wine</code> features that live on very different scales. Across the 178 wines:</p>
       <ul class="steps">
         <li><b><code>proline</code></b> (an amino acid, in milligrams per liter) runs min <b>278</b>, mean <b>746.9</b>, max <b>1680</b> &mdash; hundreds.</li>
         <li><b><code>hue</code></b> (a color ratio) runs min <b>0.48</b>, mean <b>0.957</b>, max <b>1.71</b> &mdash; around one.</li>
         <li><b>Standardize <code>proline</code>.</b> Its standard deviation is about <b>314</b>. So the smallest wine maps to $\\tilde{x}=\\frac{278-746.9}{314}\\approx -1.49$, the mean maps to $0$, and the largest to $\\frac{1680-746.9}{314}\\approx +2.97$. The hundreds-sized column now lives in roughly $[-1.5,\\ 3.0]$.</li>
         <li><b>Standardize <code>hue</code>.</b> Its standard deviation is about <b>0.228</b>. The smallest maps to $\\frac{0.48-0.957}{0.228}\\approx -2.10$, the mean to $0$, the largest to $\\frac{1.71-0.957}{0.228}\\approx +3.30$. The around-one column now lives in roughly $[-2.1,\\ 3.3]$.</li>
         <li><b>The payoff:</b> before scaling, <code>proline</code>'s numbers were ~700&times; larger than <code>hue</code>'s, so any distance was all proline. After scaling, both features have mean 0 and a comparable spread, so a k-NN or SGD model weighs them fairly. Note the shapes did not change &mdash; only the axes did.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var col = {
        ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"),
        accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"),
        warn: g("--warn", "#ffb454"), bad: g("--bad", "#ff7b72"),
        border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
      };
      var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";

      // Two synthetic features on very different scales, mimicking wine's proline (~hundreds)
      // and hue (~1). Scatter shows the cloud reshaped from a thin pancake to a round blob.
      var N = 60;
      function randn() {
        var u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
      }
      var seed = [];
      for (var i = 0; i < N; i++) seed.push([randn(), randn()]);
      // big-scale feature (proline-like): mean ~750, sd ~314 ; small-scale (hue-like): mean ~0.96, sd ~0.23
      var pro = seed.map(function (p) { return 746.9 + 314 * p[0]; });
      var hue = seed.map(function (p) { return 0.957 + 0.228 * p[1]; });

      function stats(a) {
        var m = a.reduce(function (s2, x) { return s2 + x; }, 0) / a.length;
        var v = a.reduce(function (s2, x) { return s2 + (x - m) * (x - m); }, 0) / a.length;
        return { m: m, sd: Math.sqrt(v), min: Math.min.apply(null, a), max: Math.max.apply(null, a) };
      }
      function standardize(a) { var st = stats(a); return a.map(function (x) { return (x - st.m) / st.sd; }); }

      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginBottom = "8px";
      host.appendChild(rd);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");

      var rowEl = document.createElement("div"); rowEl.style.margin = "10px 0";
      var btnRaw = document.createElement("button"); btnRaw.style.cssText = BTN; btnRaw.textContent = "Raw (different scales)";
      var btnStd = document.createElement("button"); btnStd.style.cssText = BTN; btnStd.textContent = "Standardized (mean 0, var 1)";
      rowEl.appendChild(btnRaw); rowEl.appendChild(btnStd); host.appendChild(rowEl);

      function draw(mode) {
        var X, Y, xlab, ylab;
        if (mode === "std") { X = standardize(pro); Y = standardize(hue); xlab = "proline (standardized)"; ylab = "hue (standardized)"; }
        else { X = pro; Y = hue; xlab = "proline (raw, ~hundreds)"; ylab = "hue (raw, ~1)"; }
        var sx = stats(X), sy = stats(Y);
        ctx.clearRect(0, 0, cv.width, cv.height);
        var L = 70, R = cv.width - 20, T = 20, B = cv.height - 40;
        // axes
        ctx.strokeStyle = col.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
        // For standardized mode use a fixed symmetric window so the "round blob" is visible.
        var xlo, xhi, ylo, yhi;
        if (mode === "std") { xlo = -4; xhi = 4; ylo = -4; yhi = 4; }
        else { xlo = sx.min - 20; xhi = sx.max + 20; ylo = sy.min - 0.05; yhi = sy.max + 0.05; }
        function px(x) { return L + (x - xlo) / (xhi - xlo) * (R - L); }
        function py(y) { return B - (y - ylo) / (yhi - ylo) * (B - T); }
        ctx.fillStyle = col.accent;
        for (var i = 0; i < X.length; i++) {
          ctx.beginPath(); ctx.arc(px(X[i]), py(Y[i]), 3.5, 0, 2 * Math.PI); ctx.fill();
        }
        ctx.fillStyle = col.dim; ctx.font = "12px sans-serif";
        ctx.fillText(xlab, (L + R) / 2 - 60, cv.height - 12);
        ctx.save(); ctx.translate(16, (T + B) / 2 + 30); ctx.rotate(-Math.PI / 2); ctx.fillText(ylab, 0, 0); ctx.restore();
        rd.innerHTML = mode === "std"
          ? "<b>Standardized.</b> Both axes now have mean &asymp; 0 and variance 1, so the cloud is a roughly round blob &mdash; a k-NN/SGD model weighs <code>proline</code> and <code>hue</code> equally. Spread of proline: " + sx.sd.toFixed(2) + ", hue: " + sy.sd.toFixed(2) + "."
          : "<b>Raw.</b> The cloud is a thin horizontal pancake: <code>proline</code> (sd&asymp;" + sx.sd.toFixed(0) + ") swamps <code>hue</code> (sd&asymp;" + sy.sd.toFixed(2) + "). Any Euclidean distance is essentially all proline, so hue is ignored.";
      }
      btnRaw.onclick = function () { draw("raw"); };
      btnStd.onclick = function () { draw("std"); };
      draw("raw");
    },
    practice: [
      {
        q: `You feed a k-nearest-neighbours classifier two features: annual income (tens of thousands) and number of children (0-5). Without scaling, the model is essentially ignoring the number of children. Explain why, and fix it.`,
        steps: [
          { do: `Write the Euclidean distance between two people across the two raw features.`, why: `Distance squared is (income difference)^2 + (children difference)^2; income differences are in the thousands, children differences at most 5.` },
          { do: `Observe that the income term dwarfs the children term by a factor of millions once squared.`, why: `k-NN finds 'nearest' points almost entirely by income, so number of children barely affects who counts as a neighbor.` },
          { do: `Standardize both features (subtract mean, divide by standard deviation), fit on the training set only.`, why: `Now both features have variance 1, so they contribute comparably to the distance and the model can use both.` }
        ],
        answer: `k-NN uses Euclidean distance, and income's raw magnitude (tens of thousands) overwhelms children (0-5), so 'nearest' is decided almost entirely by income. Standardize each feature to mean 0, variance 1 (fit the scaler on training data only, inside a Pipeline). Then both features contribute comparably and the model uses number of children too.`
      },
      {
        q: `A teammate runs StandardScaler().fit_transform(X) on the full dataset, THEN splits into train and test and reports a cross-validation AUC. Why is the reported score optimistic, and what is the correct protocol?`,
        steps: [
          { do: `Identify that the scaler's mean and standard deviation were computed using the test rows too.`, why: `Information about the held-out rows (their statistics) has flowed into the transform applied to the training rows.` },
          { do: `Name this as data leakage: the validation rows are no longer truly unseen.`, why: `The model gets a peek at the held-out distribution, so the validation score overstates real-world performance.` },
          { do: `Move the scaler inside a Pipeline and fit it within each cross-validation fold, on the training fold only.`, why: `A Pipeline re-fits the scaler on each fold's training data, so the held-out fold's statistics never leak in.` }
        ],
        answer: `Fitting the scaler on all of X lets the test rows' mean and standard deviation leak into the training transform — that is leakage, and it inflates the AUC. Correct protocol: put StandardScaler inside a Pipeline so it is fit on the training fold only within each cross-validation split. The honest score will usually be a bit lower.`
      },
      {
        q: `You have a right-skewed feature (a long tail of large values). A colleague says "just standardize it and the skew will go away." Is that right? What actually removes the skew, and in what order relative to scaling?`,
        steps: [
          { do: `Recall that standardization is an affine map: subtract a constant, divide by a constant.`, why: `Affine maps only shift and stretch the axis; they cannot bend the distribution or shorten a tail.` },
          { do: `Conclude the histogram's shape (the skew) is unchanged by standardization — only its center and spread move.`, why: `A right-skewed feature is still right-skewed by the same amount after standardizing.` },
          { do: `Apply a log or power transform FIRST to compress the tail, THEN standardize the result for the model.`, why: `The non-linear log/power transform reshapes the distribution; scaling afterward puts it on a comparable footing.` }
        ],
        answer: `No — standardization is an affine (shift-and-scale) map, so it leaves the distribution's shape, including the skew, unchanged. To remove skew you need a non-linear log or power transform, applied BEFORE scaling. Then standardize the transformed feature for the model.`
      },
      {
        q: `You are about to put a StandardScaler in front of a gradient-boosted tree model. A reviewer says it is pointless. Are they right? What kind of model WOULD need the scaler here?`,
        steps: [
          { do: `Recall how a tree splits: it asks 'is feature x below a threshold t?'.`, why: `The split depends only on the ordering of values, not their absolute magnitude.` },
          { do: `Note that any increasing rescaling maps the threshold along with the values, so the same rows fall on each side.`, why: `Monotone rescaling leaves every split — and therefore the whole tree — identical, so scaling does nothing.` },
          { do: `Identify the models that DO need scaling: linear/SGD/neural-net and any distance-based model (k-NN, k-means, RBF-SVM).`, why: `Those use gradients or distances, which are sensitive to feature magnitude, unlike threshold splits.` }
        ],
        answer: `The reviewer is right: tree-based models split on thresholds, and any monotone rescaling moves the threshold with the values, leaving the splits unchanged — so scaling is wasted work for gradient-boosted trees. Scaling matters for gradient-based models (linear with regularization, SGD, neural nets) and distance-based models (k-NN, k-means, RBF-SVM).`
      }
    ]
  });

  window.CODE["fe-scaling-normalization"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>The book's Chapter 2 example scales the <code>n_tokens_content</code> feature (article word count) from the <b>Online News Popularity</b> dataset, comparing min-max scaling, standardization (variance scaling), and L2 normalization. Download the data from the book's repo: <code>github.com/alicezheng/feature-engineering-book</code> (the UCI Online News Popularity CSV). Note that scaling changes the <i>range</i> but not the <i>shape</i> of the histogram, and that L2 normalization works per row, not per column.</p>`,
    code: `import pandas as pd
from sklearn import preprocessing

# Online News Popularity dataset (UCI). Get it from the book's repo:
#   github.com/alicezheng/feature-engineering-book
df = pd.read_csv('OnlineNewsPopularity.csv')
df.columns = [c.strip() for c in df.columns]   # the CSV has leading spaces

# The book scales n_tokens_content: the number of words in an article.
# preprocessing.minmax_scale expects a 2-D array, so pass a single-column DataFrame.

# 1. MIN-MAX SCALING -> every value mapped into [0, 1].
df['minmax'] = preprocessing.minmax_scale(df[['n_tokens_content']])

# 2. STANDARDIZATION (variance scaling / z-score) -> mean 0, variance 1.
df['standardized'] = (
    preprocessing.StandardScaler().fit_transform(df[['n_tokens_content']])
)

# 3. L2 NORMALIZATION -> divide each ROW vector by its L2 norm (unit sphere).
#    (Per-row: here on a single column it just maps each value to +/-1, but on a
#     full feature matrix it makes every example's vector have length 1.)
df['l2_normalized'] = preprocessing.normalize(
    df[['n_tokens_content']], norm='l2', axis=0
)

print(df[['n_tokens_content', 'minmax', 'standardized', 'l2_normalized']].head())

# Scaling changes the RANGE, not the SHAPE: plot to confirm the histograms
# have identical shape, only different x-axis units.
import matplotlib.pyplot as plt
fig, axes = plt.subplots(3, 1, figsize=(6, 8))
df['n_tokens_content'].hist(ax=axes[0], bins=100)
axes[0].set_title('Original n_tokens_content')
df['minmax'].hist(ax=axes[1], bins=100)
axes[1].set_title('Min-max scaled to [0, 1]')
df['standardized'].hist(ax=axes[2], bins=100)
axes[2].set_title('Standardized (mean 0, var 1)')
plt.tight_layout()
plt.show()`
  };

  window.CODEVIZ["fe-scaling-normalization"] = {
    question: "Two real features on wildly different scales: wine 'proline' (~hundreds) vs 'hue' (~1). How do you READ a scaling diagram — and what do the healthy case and the common failure modes look like?",
    charts: [
      {
        type: "bars",
        title: "Ideal: AFTER standardization both features share one z-score axis",
        xlabel: "feature & statistic",
        ylabel: "standardized value (z-score)",
        labels: ["proline min", "proline mean", "proline max", "hue min", "hue mean", "hue max"],
        values: [-1.493, 0.0, 2.971, -2.095, 0.0, 3.302],
        valueLabels: ["-1.49", "0.00", "2.97", "-2.10", "0.00", "3.30"],
        colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#7ee787", "#7ee787", "#7ee787"],
        interpret: "Real numbers from sklearn's load_wine (178 wines). Each bar is a min / mean / max statistic; the y-axis is the standardized value (z-score = how many standard deviations from that feature's own mean). Read it like this: <b>both colours now reach a comparable height</b> — every mean sits exactly at 0 and both maxima land near +3. That is the goal: proline (blue) and hue (green) speak the same units, so a k-NN / SGD / neural-net model weighs them fairly. The book scales Online News Popularity's n_tokens_content; same idea here."
      },
      {
        type: "bars",
        title: "Problem you might see: raw, un-scaled — proline dwarfs hue",
        xlabel: "feature & statistic",
        ylabel: "raw value",
        labels: ["proline min", "proline mean", "proline max", "hue min", "hue mean", "hue max"],
        values: [278.0, 746.9, 1680.0, 0.48, 0.957, 1.71],
        valueLabels: ["278", "746.9", "1680", "0.48", "0.96", "1.71"],
        colors: ["#ff7b72", "#ff7b72", "#ff7b72", "#9aa7b4", "#9aa7b4", "#9aa7b4"],
        interpret: "Same six statistics, but the y-axis is now the RAW value (no scaling). Recognise this failure by the grey bars being <b>invisibly flat against the floor</b>: proline (red) runs to 1680 while hue (grey) never leaves the 0-2 band, ~700x smaller. On one shared axis hue carries no visible height, so any Euclidean distance or gradient step is essentially all proline and hue is ignored. If your before/after pair looks like this, you forgot to scale."
      },
      {
        type: "bars",
        title: "Trap: one outlier crushes min-max-scaled values toward 0",
        xlabel: "data point (sorted)",
        ylabel: "min-max scaled value in [0,1]",
        labels: ["p1", "p2", "p3", "p4", "p5", "p6", "outlier"],
        values: [0.012, 0.018, 0.021, 0.027, 0.033, 0.041, 1.0],
        valueLabels: ["0.01", "0.02", "0.02", "0.03", "0.03", "0.04", "1.00"],
        colors: ["#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ffb454", "#ff7b72"],
        interpret: "Illustrative. Each bar is one example's min-max scaled value, which by definition lives in [0,1]. The single red bar is a far-out outlier — it alone sets the max, so it sits at 1.00. The tell-tale shape: <b>one tall bar on the right, every other bar squashed into a tiny sliver near 0</b>. All the ordinary points got crushed together and lost their spread. When you see this, switch from min-max to standardization or RobustScaler (median + interquartile range), which the outlier cannot dominate."
      },
      {
        type: "bars",
        title: "Trap: standardizing does NOT remove skew (shape unchanged)",
        xlabel: "histogram bin (low value to high tail)",
        ylabel: "count of examples in bin",
        labels: ["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8"],
        values: [62, 40, 22, 12, 7, 4, 2, 1],
        valueLabels: ["62", "40", "22", "12", "7", "4", "2", "1"],
        colors: ["#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff", "#c89bff"],
        interpret: "Illustrative histogram. The x-axis is value bins from low to high; bar height is how many examples fall in each bin. This is a right-skewed feature — a tall stack on the left and a long thin tail to the right. The lesson: this <b>exact same picture appears before AND after standardizing</b>, because standardization is an affine (shift-and-stretch) map and only relabels the x-axis — it cannot bend the shape or shorten the tail. So if a feature still looks skewed after scaling, that is expected; reach for a log / power transform (applied before scaling) to actually reshape it."
      }
    ],
    caption: "How to read scaling diagrams: the ideal (all features share one z-score axis) plus three things you actually meet — raw un-scaled features, an outlier wrecking min-max, and skew surviving standardization. Each chart explains itself below it.",
    code: `import numpy as np
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler

d = load_wine()
names = list(d.feature_names)
pi, hi = names.index('proline'), names.index('hue')
proline = d.data[:, pi]   # amino acid, ~hundreds
hue     = d.data[:, hi]   # color ratio, ~1

def mmm(a):  # min, mean, max
    return round(a.min(), 3), round(a.mean(), 3), round(a.max(), 3)

print('BEFORE proline min/mean/max:', mmm(proline))  # (278.0, 746.893, 1680.0)
print('BEFORE hue     min/mean/max:', mmm(hue))       # (0.48, 0.957, 1.71)

# Standardize each feature: subtract mean, divide by std -> mean 0, variance 1.
Z = StandardScaler().fit_transform(np.c_[proline, hue])
print('AFTER  proline min/mean/max:', mmm(Z[:, 0]))   # (-1.493, -0.0, 2.971)
print('AFTER  hue     min/mean/max:', mmm(Z[:, 1]))   # (-2.095, 0.0, 3.302)`
  };
})();
