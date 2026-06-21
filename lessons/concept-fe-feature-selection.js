(function () {
  window.LESSONS.push({
    id: "fe-feature-selection",
    title: "Feature Selection",
    tagline: "Throw away features that do not help, so the model is cheaper, faster, and overfits less.",
    module: "Feature Engineering (Zheng & Casari)",
    prereqs: ["ml-regularization", "met-association", "skill-validation"],
    whenToUse:
      `<p><b>Feature selection is pruning.</b> You have many input columns. Some carry signal about the target. Many do not. <b>Feature selection</b> keeps the useful ones and drops the rest. Chapter 2 of Zheng &amp; Casari frames the payoff plainly: fewer features means a model that is <b>cheaper to train and serve</b>, <b>less prone to overfitting</b>, and <b>easier to understand</b>.</p>
       <p>The book sorts every method into <b>three families</b>. Reach for them in this order:</p>
       <ul>
         <li><b>Filter methods</b> &mdash; for a <i>fast first cut</i> when you have many features. Score each feature on its own by a statistic (correlation, chi-square, or mutual information with the target) and keep the top ones. Cheap, but blind to how features work together.</li>
         <li><b>Wrapper methods</b> &mdash; when <i>accuracy matters and you can afford the compute</i>. Try subsets of features, train the actual model on each, and keep the subset that scores best. Expensive, but it accounts for the model you will really use.</li>
         <li><b>Embedded methods</b> &mdash; the <i>practical default</i>. Selection happens <i>inside</i> model training: an L1 (Lasso) penalty zeroes out useless weights, or a tree reports feature importances. One training run gives you both the model and the selection.</li>
       </ul>`,
    application:
      `<p>The book motivates selection on its high-dimensional text examples, but the three families show up everywhere a pipeline has more columns than it needs.</p>
       <ul>
         <li><b>Text models (the book's setting):</b> a bag-of-words (BoW) or tf-idf (term frequency&ndash;inverse document frequency) matrix has tens of thousands of columns. A <b>filter</b> by chi-square or mutual information against the label is the standard fast prune before training.</li>
         <li><b>Tabular ML with hundreds of sensors / signals:</b> an <b>embedded</b> Lasso or a tree's importances cut the list to the handful that move the prediction.</li>
         <li><b>Small, high-value problems (medical, scientific):</b> a <b>wrapper</b> such as recursive feature elimination (RFE) is worth the cost when each retained feature must be justified.</li>
         <li><b>Serving cost:</b> every dropped feature is one fewer value to compute, fetch, and monitor in production.</li>
       </ul>
       <p>This builds on <a>[met-association]</a> (the statistics that score a feature against the target), <a>[ml-regularization]</a> (how an L1 penalty produces sparsity), and <a>[skill-validation]</a> (why selection must live inside cross-validation, not before it).</p>`,
    pitfalls:
      `<ul>
         <li><b>Selecting on the WHOLE dataset (leakage).</b> The tell: <code>SelectKBest(...).fit(X, y)</code> runs on all the data <i>before</i> the train/test split. The held-out rows helped choose the features, so your score is optimistic. Fix: put the selector <i>inside</i> a <code>Pipeline</code> and select on the training fold only, re-fit in every cross-validation fold.</li>
         <li><b>Filter methods miss interactions.</b> A filter scores each feature alone. Two features that are useless individually but predictive <i>together</i> (e.g. an XOR pattern) both get dropped. Fix: when interactions are likely, use a wrapper or an embedded tree method that sees features jointly.</li>
         <li><b>Correlation &ne; usefulness.</b> A high univariate score does not mean a feature helps the final model, and a low score does not mean it is useless once combined with others. The filter statistic is a heuristic, not the model's verdict.</li>
         <li><b>Unstable selection.</b> Re-run on a slightly different sample and a different set of features is chosen &mdash; common when features are correlated (Lasso arbitrarily keeps one of a correlated pair). Fix: check stability across folds; prefer methods or aggregation that are robust to resampling.</li>
         <li><b>Redundant features survive a filter.</b> Filters rank features independently, so a cluster of near-duplicate columns can all score high and all be kept &mdash; you keep ten copies of the same signal. Wrappers and embedded methods naturally avoid this.</li>
       </ul>`,
    bigIdea:
      `<p>More features is not more knowledge. Past a point, extra columns add <b>noise</b>, <b>cost</b>, and <b>overfitting</b> &mdash; the model fits quirks of the training sample instead of the real pattern. The goal of selection is a small subset that keeps the signal and drops the rest.</p>
       <p>The hard part is <i>how</i> you judge a feature. The three families are three answers, trading off speed against faithfulness to the real model:</p>
       <ul>
         <li><b>Filter:</b> judge each feature by a cheap statistic against the target, ignore the model entirely. Fastest, least faithful.</li>
         <li><b>Wrapper:</b> judge a <i>subset</i> by training the real model on it. Slowest, most faithful.</li>
         <li><b>Embedded:</b> let the model's own training do the judging (sparsity penalty or importances). A middle ground &mdash; one training run, model-aware.</li>
       </ul>`,
    buildup:
      `<p>Picture a table with $d$ columns. A <b>filter</b> walks the columns once, scoring each against the label $y$, and keeps the top $k$. Cost is roughly $d$ cheap computations &mdash; trivial even for $d$ in the tens of thousands.</p>
       <p>A <b>wrapper</b> instead searches over <i>subsets</i> of columns, training the model on each candidate. The full subset space has $2^d$ members, so wrappers use a greedy walk: recursive feature elimination (RFE) trains once, drops the weakest feature, retrains, and repeats down to $k$. Cost is roughly $d$ model fits &mdash; far more than a filter, but it asks the real model what it wants.</p>
       <p>An <b>embedded</b> method folds selection into the single fit. Add an L1 penalty $\\lambda\\sum_j|w_j|$ to the loss and the optimizer drives many weights $w_j$ exactly to zero; the surviving non-zero weights ARE the selected features. A tree does the same implicitly: features it never splits on get zero importance.</p>`,
    symbols: [
      { sym: "$d$", desc: "the number of candidate features (input columns) you start with." },
      { sym: "$k$", desc: "the number of features you decide to keep ($k$ is much smaller than $d$)." },
      { sym: "$x_j$", desc: "the $j$-th feature (the $j$-th column of the data)." },
      { sym: "$y$", desc: "the target (the label you are trying to predict)." },
      { sym: "$s(x_j, y)$", desc: "a filter score: how strongly feature $x_j$ relates to the target $y$, by itself. Bigger means keep it." },
      { sym: "$w_j$", desc: "the weight (coefficient) a linear model gives feature $x_j$. An L1 penalty pushes useless ones to exactly $0$." },
      { sym: "$\\lambda$", desc: "the strength of the L1 (Lasso) penalty. Larger $\\lambda$ zeroes out more weights, keeping fewer features." },
      { sym: "$I(x_j; y)$", desc: "mutual information between feature $x_j$ and target $y$: how many bits knowing $x_j$ tells you about $y$. A filter score that also catches non-linear relationships." }
    ],
    formula: `$$ \\underbrace{s(x_j,\\,y)}_{\\text{FILTER: score each feature}} \\qquad\\quad \\underbrace{\\arg\\max_{S \\subseteq \\{1..d\\},\\ |S|=k}\\ \\mathrm{CV\\text{-}score}\\big(\\text{model}(x_S)\\big)}_{\\text{WRAPPER: best subset for the real model}} \\qquad\\quad \\underbrace{\\min_{w}\\ \\mathcal{L}(w) + \\lambda\\sum_{j=1}^{d}|w_j|}_{\\text{EMBEDDED: L1 zeroes weights}} $$`,
    whatItDoes:
      `<p><b>Left &mdash; the filter.</b> Compute one number $s(x_j, y)$ per feature (chi-square, correlation, or mutual information with the target), sort, keep the top $k$. No model is trained, so it is the cheapest option; but because each feature is judged alone, the filter is blind to feature interactions.</p>
       <p><b>Middle &mdash; the wrapper.</b> Search over subsets $S$ of size $k$ and pick the one whose <i>real model</i> gets the best cross-validation (CV) score. Exhaustive search is $2^d$ subsets, so in practice recursive feature elimination (RFE) walks greedily: drop the weakest feature, refit, repeat. Expensive (one model fit per step) but it accounts for the model and for interactions.</p>
       <p><b>Right &mdash; embedded.</b> Train one model with an L1 penalty $\\lambda\\sum_j|w_j|$ added to its loss $\\mathcal{L}$. The penalty's corner geometry forces many weights to exactly zero, so the fit and the selection happen at once. Trees do the analogous thing through split-based importances.</p>`,
    derivation:
      `<p><b>Why an L1 (Lasso) penalty SELECTS, while an L2 (ridge) penalty only shrinks.</b> This is the heart of embedded selection.</p>
       <ul class="steps">
         <li>Minimizing loss subject to a budget on the weights is equivalent to penalizing the weights. With L1 the budget region is a <b>diamond</b> $\\sum_j|w_j|\\le t$; with L2 it is a <b>circle</b> $\\sum_j w_j^2\\le t$.</li>
         <li>The solution sits where the loss contours first touch the budget region. A diamond has sharp <b>corners on the axes</b> &mdash; points where some $w_j=0$. Contours very often touch a corner first, so some weights land <i>exactly</i> at zero. That zero is a dropped feature.</li>
         <li>A circle is smooth with no corners, so the touch point almost never has an exact zero. L2 shrinks every weight toward zero but keeps them all non-zero &mdash; it does not select.</li>
         <li>So L1 gives a <b>sparse</b> solution: increasing $\\lambda$ tightens the diamond and zeroes out more features. The surviving non-zero $w_j$ are the selected subset, for free, in one fit. $\\blacksquare$</li>
       </ul>
       <p><i>Why a filter is so cheap:</i> it never solves an optimization over $w$ at all &mdash; it computes $d$ independent statistics $s(x_j,y)$ and sorts. That is also exactly why it cannot see interactions: each statistic ignores every other feature.</p>`,
    example:
      `<p>Tiny worked filter: 4 features, label $y\\in\\{0,1\\}$, judged by mutual information $I(x_j; y)$ (in bits).</p>
       <ul class="steps">
         <li><b>Feature A</b> equals $y$ on almost every row &mdash; knowing A nearly pins down $y$. $I=0.85$ bits.</li>
         <li><b>Feature B</b> leans toward $y$ but is noisy. $I=0.30$ bits.</li>
         <li><b>Feature C</b> is a coin flip independent of $y$. $I\\approx 0.00$ bits.</li>
         <li><b>Feature D</b> is a copy of Feature A (redundant). $I=0.85$ bits.</li>
         <li><b>Filter, keep top $k=2$:</b> sort by score &rarr; $\\{A, D\\}$. Notice the trap &mdash; the filter keeps A and its <i>duplicate</i> D, and drops the weaker-but-complementary B. It scored each feature alone, so it cannot see that D adds nothing new. A wrapper or an embedded method would have caught the redundancy and kept $\\{A, B\\}$ instead.</li>
       </ul>
       <p>The lesson the book stresses: a filter is a fast first cut, not the final word &mdash; high score does not imply usefulness once features are combined.</p>`,
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
      // 8 fake features with a univariate "filter score". Slider = how many (k) we keep.
      // Bars sorted by score; the top-k are highlighted (kept), the rest dimmed (dropped).
      var feats = [
        { name: "f1", score: 0.92 }, { name: "f2", score: 0.78 },
        { name: "f3", score: 0.61 }, { name: "f4", score: 0.40 },
        { name: "f5", score: 0.22 }, { name: "f6", score: 0.13 },
        { name: "f7", score: 0.06 }, { name: "f8", score: 0.02 }
      ];
      feats.sort(function (a, b) { return b.score - a.score; });
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginBottom = "8px";
      host.appendChild(rd);
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 260; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var row = document.createElement("div"); row.style.margin = "10px 0";
      var lab = document.createElement("span"); lab.style.color = col.dim; lab.style.marginRight = "8px";
      var sld = document.createElement("input"); sld.type = "range"; sld.min = "1"; sld.max = "8"; sld.value = "3"; sld.style.verticalAlign = "middle";
      row.appendChild(lab); row.appendChild(sld); host.appendChild(row);

      function draw() {
        var k = parseInt(sld.value, 10);
        lab.textContent = "keep top k = " + k + " features";
        ctx.clearRect(0, 0, 640, 260);
        ctx.font = "13px sans-serif"; ctx.textBaseline = "middle";
        var x0 = 70, barMax = 480, h = 22, gap = 8, y = 18;
        for (var i = 0; i < feats.length; i++) {
          var kept = i < k;
          var w = barMax * feats[i].score;
          ctx.fillStyle = col.dim; ctx.textAlign = "right";
          ctx.fillText(feats[i].name, x0 - 10, y + h / 2);
          ctx.fillStyle = kept ? col.accent2 : col.border;
          ctx.fillRect(x0, y, Math.max(2, w), h);
          ctx.fillStyle = kept ? "#0b0e13" : col.dim; ctx.textAlign = "left";
          ctx.fillText(feats[i].score.toFixed(2) + (kept ? "  KEEP" : "  drop"), x0 + Math.max(2, w) + 8, y + h / 2);
          y += h + gap;
        }
        ctx.textAlign = "left";
        rd.innerHTML = "A <b>filter</b> scores every feature against the target, sorts, and keeps the top <b>k</b>. The <b style='color:" + col.accent2 + "'>green</b> bars are kept; the grey ones are dropped. Slide k: small k is a hard prune (cheap, risks losing signal), large k keeps almost everything (little pruning). The filter never looks at how features combine &mdash; that is its blind spot.";
      }
      sld.addEventListener("input", draw);
      draw();
    },
    practice: [
      {
        q: `You have a tf-idf matrix with 40,000 columns and need a quick first prune before training anything. Which family do you reach for, and what is the one number it cannot see?`,
        steps: [
          { do: `Note the scale: 40,000 features means anything that trains a model per feature is too slow for a first pass.`, why: `Wrappers train a model many times; that is impractical at 40,000 columns for a quick cut.` },
          { do: `Use a FILTER: score each column by chi-square or mutual information against the label and keep the top k.`, why: `A filter costs one cheap statistic per feature and sorts &mdash; fast even at this width.` },
          { do: `Remember its blind spot: it scores each feature alone, so it cannot see INTERACTIONS between features.`, why: `Two columns useless apart but predictive together would both be dropped by a filter.` }
        ],
        answer: `Use a filter method (e.g. SelectKBest with chi2 or mutual information). It is the only family cheap enough for a fast first cut on 40,000 features. Its blind spot: it judges each feature on its own, so it cannot see feature interactions.`
      },
      {
        q: `A colleague runs SelectKBest on the entire dataset, THEN splits into train and test, and is thrilled by the test accuracy. What did they do wrong, and how do you fix it?`,
        steps: [
          { do: `Spot that the selector saw the test rows: the whole dataset, including test, was used to choose the features.`, why: `Information from the held-out rows leaked into the feature choice, inflating the test score.` },
          { do: `Name it: this is data leakage. The test set is no longer truly unseen.`, why: `Any step fit on data that includes the test set makes the score optimistic.` },
          { do: `Move the selector INSIDE a Pipeline and run it inside cross-validation, fitting on the training fold only.`, why: `Then selection is re-done per fold on training data alone, so the held-out fold stays genuinely unseen.` }
        ],
        answer: `They leaked: selecting on the whole dataset let the test rows influence which features were kept, so the test accuracy is optimistic. Fix: wrap the selector in a Pipeline and select inside cross-validation on the training fold only, never on the full data before the split.`
      },
      {
        q: `You want feature selection to come "for free" as part of training a linear model, and you want unhelpful features driven to exactly zero. What do you use, and why does it produce exact zeros where ridge would not?`,
        steps: [
          { do: `Choose an EMBEDDED method: a linear model with an L1 (Lasso) penalty.`, why: `Embedded selection happens during the single fit; no separate scoring or subset search is needed.` },
          { do: `Recall the geometry: the L1 budget region is a diamond with corners on the axes; the loss contours often touch a corner.`, why: `A corner is a point where some weights are exactly zero &mdash; those features are dropped.` },
          { do: `Contrast with L2 (ridge): its budget region is a smooth circle with no corners, so it shrinks weights but rarely zeroes them.`, why: `Ridge keeps every feature (just smaller), so it does not select; Lasso does.` }
        ],
        answer: `Use Lasso (an L1-penalized linear model) &mdash; selection is embedded in training. L1's diamond-shaped budget has corners on the axes, so the loss contours frequently touch at a point where some weights are exactly zero, dropping those features. L2 (ridge) has a smooth circular budget with no corners, so it only shrinks weights and never zeroes them.`
      }
    ]
  });

  window.CODE["fe-feature-selection"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Chapter 2 of Zheng &amp; Casari sorts feature selection into three families. Here is one faithful example of each, in the book's scikit-learn style, on the bundled <code>load_breast_cancer</code> dataset (the book demonstrates the same ideas on its high-dimensional text data; the dataset and full notebooks are at <code>github.com/alicezheng/feature-engineering-book</code>). A <b>filter</b> scores each feature with <code>SelectKBest(chi2, k=...)</code>; a <b>wrapper</b> uses recursive feature elimination (<code>RFE</code>) around a real model; an <b>embedded</b> method reads selection straight out of a <code>Lasso</code> (L1) fit. Note that every selector sits inside a <code>Pipeline</code> so it is fit on training data only &mdash; no leakage.</p>`,
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.feature_selection import SelectKBest, chi2, RFE
from sklearn.linear_model import LogisticRegression, Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import cross_val_score, StratifiedKFold

# The book demonstrates selection on high-dimensional text (bag-of-words / tf-idf).
# Same three families here on a bundled tabular dataset.
# Full notebooks: github.com/alicezheng/feature-engineering-book
X, y = load_breast_cancer(return_X_y=True)
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)

# ---------- (1) FILTER: score each feature alone, keep the top k ----------
# chi2 needs non-negative features (breast-cancer features are all >= 0).
filter_pipe = Pipeline([
    ("filter", SelectKBest(chi2, k=10)),   # univariate scores vs the target
    ("clf",    LogisticRegression(max_iter=5000)),
])
print("filter  (SelectKBest chi2, k=10):",
      round(cross_val_score(filter_pipe, X, y, cv=cv).mean(), 3))

# Inspect which features the filter kept (fit on all data only to LOOK):
skb = SelectKBest(chi2, k=10).fit(X, y)
print("  top-10 chi2 scores:", np.round(np.sort(skb.scores_)[::-1][:10], 1))

# ---------- (2) WRAPPER: recursive feature elimination around the model ----------
# RFE trains the model, drops the weakest feature, refits, repeats down to k.
wrapper_pipe = Pipeline([
    ("scale", StandardScaler()),
    ("rfe",   RFE(LogisticRegression(max_iter=5000),
                  n_features_to_select=10, step=1)),
    ("clf",   LogisticRegression(max_iter=5000)),
])
print("wrapper (RFE, k=10):",
      round(cross_val_score(wrapper_pipe, X, y, cv=cv).mean(), 3))

# ---------- (3) EMBEDDED: L1 (Lasso) sparsity selects during training ----------
# A larger alpha (lambda) zeroes out more coefficients -> fewer features kept.
lasso = Pipeline([("scale", StandardScaler()),
                  ("lasso", Lasso(alpha=0.05))]).fit(X, y)
coef = lasso.named_steps["lasso"].coef_
kept = np.flatnonzero(coef)              # non-zero weights == selected features
print("embedded (Lasso L1): kept %d of %d features" % (kept.size, X.shape[1]))
print("  selected feature indices:", kept.tolist())`
  };

  window.CODEVIZ["fe-feature-selection"] = {
    question: "On real data, how many features do you actually need? A FILTER (mutual information with the target) ranks the features; we keep the top-k and watch accuracy. The curve plateaus fast: a handful of features gets almost all the accuracy.",
    charts: [{
      type: "bars",
      title: "Accuracy vs number of filter-selected features (load_breast_cancer)",
      xlabel: "k = number of top features kept (by mutual information)",
      ylabel: "5-fold CV accuracy",
      labels: ["k=1", "k=2", "k=3", "k=5", "k=8", "k=12", "k=20", "k=30 (all)"],
      values: [0.917, 0.923, 0.917, 0.947, 0.954, 0.951, 0.977, 0.979],
      valueLabels: ["0.917", "0.923", "0.917", "0.947", "0.954", "0.951", "0.977", "0.979"],
      colors: ["#7ee787", "#7ee787", "#7ee787", "#7ee787", "#7ee787", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
    }],
    caption: "Real numbers from load_breast_cancer (30 features). A filter ranks features by mutual information with the target; we keep the top k and score a scaled logistic-regression pipeline with 5-fold cross-validation. Just the top 8 features (green) reach 0.954 accuracy, versus 0.979 with all 30 (blue) — a 2.5-point gap for keeping less than a third of the columns. That is the whole pitch of selection: most of the signal lives in a few features, and the curve plateaus quickly. The book makes the same point on high-dimensional text; this is the same idea on a bundled dataset. Selection runs INSIDE the cross-validation pipeline, so no held-out rows leak into the feature ranking.",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, StratifiedKFold

X, y = load_breast_cancer(return_X_y=True)   # 569 rows, 30 features
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=0)

# A FILTER ranks features by mutual information with the target; keep the top k.
# The selector lives INSIDE the pipeline, so it is re-fit on the training fold
# of every split -> no leakage of held-out rows into the ranking.
def mi(Xx, yy):
    return mutual_info_classif(Xx, yy, random_state=0)

ks = [1, 2, 3, 5, 8, 12, 20, 30]
accs = []
for k in ks:
    pipe = make_pipeline(
        StandardScaler(),
        SelectKBest(mi, k=k),                # filter: top-k by mutual information
        LogisticRegression(max_iter=5000),
    )
    accs.append(round(cross_val_score(pipe, X, y, cv=cv).mean(), 3))

for k, a in zip(ks, accs):
    print("k=%-3d  accuracy=%.3f" % (k, a))
# k=1 0.917 ... k=8 0.954 ... k=30 0.979  -> a few features get most of the accuracy.`
  };
})();
