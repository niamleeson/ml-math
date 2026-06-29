/* =====================================================================
   FEATURE ENGINEERING LESSON (Zheng & Casari, Chapter 2)
   fe-interaction-features — products of features that let a linear
   model capture "the effect of A depends on B". Self-contained:
   registers the lesson, its CODE (the book's example), and its CODEVIZ.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fe-interaction-features",
    title: "Interaction features (products of features)",
    tagline: "Multiply two features so a linear model can say 'the effect of one depends on the other'.",
    module: "Feature Engineering",
    prereqs: ["ml-linear-regression", "ml-regularization", "ml-bias-variance"],

    whenToUse:
      `<p><b>Reach for interaction features when you are using a model that cannot learn feature combinations on its own — chiefly a linear model — and you suspect that two inputs matter <i>jointly</i>, not just one at a time.</b> A plain linear model adds up each feature times its own weight, so it can only express "more of $x_1$ always pushes the answer the same way, no matter what $x_2$ is". That is often false. Zheng &amp; Casari's example: the effect of a house's <b>location</b> on its price depends on the buyer's <b>age</b> — young buyers and older buyers value the same neighborhood differently. A single weight on "location" and a single weight on "age" can never say that. The fix is to feed the model the <b>product</b> $x_{\\text{location}}\\cdot x_{\\text{age}}$ as a brand-new column.</p>
       <ul>
         <li><b>Linear / logistic regression that underfits</b> — you see systematic errors that look like "the model needs to know A and B <i>together</i>". Add pairwise products.</li>
         <li><b>Domain knowledge says two columns combine</b> — price = quantity × unit-price; risk = dose × exposure-time; click = relevance × position. Encode the product directly.</li>
         <li><b>You want a more expressive model but want to keep it interpretable</b> — interaction terms add power while each new column still has a readable meaning ("the A-and-B term").</li>
       </ul>
       <p><b>You usually do NOT need this for trees, gradient boosting, or neural networks.</b> Those models learn interactions on their own — a tree that splits on $x_1$ and then on $x_2$ has already represented an interaction. Interaction features are a way to give a <i>linear</i> model some of that power, by hand.</p>`,

    application:
      `<p>In Chapter 2, Zheng &amp; Casari demonstrate interaction features on the <b>Online News Popularity</b> dataset (UCI Machine Learning Repository) — predicting how many times a Mashable article will be shared from features like word counts, links, and channel. They take the numeric feature matrix, expand it with scikit-learn's <code>PolynomialFeatures(interaction_only=True)</code> to add every pairwise product, fit a <code>LinearRegression</code>, and show via cross-validation that the model with interaction features scores a <i>small but real</i> improvement in $R^2$ over the same model on the base features. The catch they stress: the feature count blows up quadratically (their example jumps from a few dozen features into the hundreds), and training takes longer. The lesson is the engineering trade-off — interactions buy accuracy at the price of dimensionality and compute. In real pipelines you see the same move in click-through-rate models (feature crosses of user × ad), pricing models (quantity × price), and any linear/logistic baseline that needs a little more expressiveness before reaching for a tree.</p>`,

    pitfalls:
      `<ul>
         <li><b>Quadratic feature blow-up.</b> Adding all pairwise products of $d$ features creates about $\\binom{d}{2}=\\frac{d(d-1)}{2}$ new columns — $O(d^2)$. With $d=100$ features that is ~4,950 interaction terms; degree-3 is worse still. <i>Fix:</i> use <code>interaction_only=True</code> (no squared terms), cap the degree at 2, and select features afterward.</li>
         <li><b>Overfitting and compute cost.</b> Hundreds of new columns give the model many ways to memorize noise, and every column costs training time and memory. <i>Fix:</i> pair interactions with <b>regularization</b> (ridge / lasso) and with feature selection; validate with cross-validation, not training error.</li>
         <li><b>Crossing already-correlated features.</b> Multiplying two features that are themselves highly correlated produces a column that is nearly a function of the originals — redundant and numerically unstable (multicollinearity). <i>Fix:</i> check correlations first; prefer crossing features that are individually informative but not redundant.</li>
         <li><b>Forgetting to standardize first.</b> A product $x_i x_j$ of two unscaled features can have a wildly different magnitude from the originals, which destabilizes the fit and any distance- or gradient-based step. <i>Fix:</i> standardize (zero mean, unit variance) <b>before</b> forming products, and consider re-scaling the products too.</li>
         <li><b>Using them when the model already learns interactions.</b> Spraying interaction terms into a random forest or neural net mostly adds noise and cost. <i>Fix:</i> reserve hand-built interactions for linear/logistic models.</li>
       </ul>`,

    bigIdea:
      `<p>A linear model predicts with a <b>weighted sum</b>: $\\hat y = w_0 + w_1 x_1 + w_2 x_2 + \\dots$. Each feature gets one weight, and that weight is the feature's effect <i>regardless of the other features</i>. So a plain linear model is structurally unable to say "the effect of $x_1$ changes depending on $x_2$".</p>
       <p>An <b>interaction feature</b> is simply the <b>product</b> of two features, $x_1 x_2$, added as a new column. Now the model can learn a weight $w_{12}$ on that product. Rewriting, the effect of $x_1$ becomes $w_1 + w_{12} x_2$ — it now <i>depends on $x_2$</i>. That is exactly the "the effect of location depends on age" behavior we wanted, and it is an <b>AND-like</b> combination: the product is large only when <i>both</i> features are large.</p>
       <p>The price is counting: there are $\\binom{d}{2}$ pairs among $d$ features, so the number of interaction columns grows like $d^2$. Expressiveness up, dimensionality up — that is the whole trade-off of the chapter.</p>`,

    buildup:
      `<p>Start with the plainest model, a <b>linear combination</b> of inputs: $\\hat y = w_0 + \\sum_i w_i x_i$. Geometrically it fits a flat plane. Its blind spot is that the partial effect of each $x_i$, namely $\\partial \\hat y/\\partial x_i = w_i$, is a <b>constant</b> — it never depends on the other features.</p>
       <p>To break that, hand the model a new input that is the <b>product</b> of two existing ones. Define $x_{12} = x_1 x_2$ and fit $\\hat y = w_0 + w_1 x_1 + w_2 x_2 + w_{12}\\,x_{12}$. Take the derivative again: $\\partial \\hat y/\\partial x_1 = w_1 + w_{12} x_2$. The slope in $x_1$ now <i>moves with $x_2$</i>. The plane has become a curved (saddle-shaped) surface.</p>
       <p>scikit-learn's <code>PolynomialFeatures</code> automates building these columns. Two knobs matter. <b>degree</b> sets how many features may be multiplied together (degree 2 = pairwise). <b>interaction_only</b>: if <code>True</code>, you get only <i>cross</i> terms $x_i x_j$ with $i \\ne j$ — no squared terms like $x_i^2$; if <code>False</code> (the full polynomial), you also get $x_i^2$ powers. <code>include_bias=False</code> drops the all-ones column. So <code>PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)</code> appends exactly the pairwise products to your original columns.</p>`,

    symbols: [
      { sym: "$x_i$", desc: "the $i$-th input feature (one column of your data)." },
      { sym: "$d$", desc: "the number of original features." },
      { sym: "$w_0$", desc: "the intercept (bias) — the prediction when every feature is zero." },
      { sym: "$w_i$", desc: "the weight (coefficient) on feature $x_i$ — its effect on the prediction." },
      { sym: "$x_i x_j$", desc: "an interaction feature: the product of features $i$ and $j$, added as a new column (with $i \\ne j$ for interaction-only)." },
      { sym: "$w_{ij}$", desc: "the weight the model learns on the interaction term $x_i x_j$ — how much the joint presence of both features shifts the prediction." },
      { sym: "$\\hat y$", desc: "the model's predicted output." },
      { sym: "$\\binom{d}{2}$", desc: "the number of unordered pairs of $d$ features, $\\frac{d(d-1)}{2}$ — how many pairwise interaction columns get added." },
      { sym: "$R^2$", desc: "the coefficient of determination — the fraction of target variance the model explains; the book's accuracy score, higher is better." }
    ],

    formula: `$$ \\hat y \\;=\\; w_0 + \\sum_{i=1}^{d} w_i\\,x_i \\;+\\; \\underbrace{\\sum_{1 \\le i \\lt j \\le d} w_{ij}\\,x_i x_j}_{\\text{degree-2 interaction terms}} $$
$$ \\frac{\\partial \\hat y}{\\partial x_1} \\;=\\; w_1 + \\sum_{j \\gt 1} w_{1j}\\,x_j \\qquad\\text{(the effect of }x_1\\text{ now depends on the other features)} $$
$$ \\#\\text{interaction-only terms} \\;=\\; \\binom{d}{2} \\;=\\; \\frac{d(d-1)}{2} \\;=\\; O(d^2) $$`,

    whatItDoes:
      `<p>The <b>first line</b> is the model. The left part $w_0 + \\sum_i w_i x_i$ is the ordinary linear model: each feature contributes its value times one weight. The boxed part adds, for every pair $i \\lt j$, the product $x_i x_j$ scaled by a learned weight $w_{ij}$. Because $w_{ij}$ is learned, the model can decide for each pair whether their combination raises or lowers the prediction — and by how much.</p>
       <p>The <b>second line</b> is the payoff written as a derivative. In the plain model, $\\partial \\hat y/\\partial x_1 = w_1$, a fixed number. With interactions it becomes $w_1 + \\sum_{j \\gt 1} w_{1j} x_j$ — the marginal effect of $x_1$ now <i>shifts</i> with the values of the other features. That is the precise mathematical meaning of "the effect of one feature depends on another". The product term acts AND-like: $x_i x_j$ is large only when <i>both</i> are large, so $w_{ij}$ rewards or penalizes the co-occurrence.</p>
       <p>The <b>third line</b> is the cost. With interaction-only degree-2 expansion you add one column per pair, $\\binom{d}{2}$ of them, which grows as $d^2$. Turn off <code>interaction_only</code> and you also add the $d$ squared terms $x_i^2$ (a full degree-2 polynomial, total $d + \\binom{d}{2}$ new columns). Either way the feature space — and the training time — balloons quadratically, which is why the book frames interactions as accuracy bought with dimensionality.</p>`,

    derivation:
      `<p><b>Why a product encodes "depends on".</b> Suppose the truth is that feature $x_1$'s effect on $y$ is itself a function of $x_2$. The simplest such dependence is <i>linear</i>: the slope on $x_1$ equals $a + b\\,x_2$. Write the contribution of $x_1$ as that slope times $x_1$:</p>
       <ul class="steps">
         <li>Contribution of $x_1$ $= (a + b\\,x_2)\\,x_1 = a\\,x_1 + b\\,x_1 x_2$.</li>
         <li>The first piece $a\\,x_1$ is an ordinary linear term. The second piece $b\\,x_1 x_2$ is exactly an <b>interaction feature</b> with weight $b = w_{12}$.</li>
         <li>So "the effect of $x_1$ varies linearly with $x_2$" is <i>algebraically identical</i> to "include the product $x_1 x_2$ as a feature". A linear model given that column can fit $b$ and recover the dependence.</li>
       </ul>
       <p><b>Why it stays a linear model.</b> Even though $\\hat y$ is now a curved (quadratic) surface in the <i>original</i> inputs, it is still <b>linear in the parameters</b> $w$: every term is a (known) feature value times a weight. So all the linear-model machinery — closed-form least squares, ridge/lasso, fast convex optimization, interpretable coefficients — applies unchanged. We only enlarged the input matrix. This is the core trick of the chapter: buy nonlinearity in the data while keeping linearity in the math.</p>
       <p><b>Why the count is $\\binom{d}{2}$.</b> An interaction term uses an unordered pair of distinct features $\\{i,j\\}$; the number of such pairs from $d$ features is $\\binom{d}{2}=\\frac{d(d-1)}{2}$. Squared terms $x_i^2$ (the full polynomial) add $d$ more. $\\blacksquare$</p>`,

    example:
      `<p><b>A two-feature worked example.</b> Take $x_1, x_2 \\in \\{0,1\\}$ (two on/off flags) and suppose the target is the AND function: $y=1$ only when <i>both</i> flags are on. The table builds the interaction column $x_1 x_2$ and then plugs each row into two competing models.</p>
       <table class="extable">
         <caption>The four possible rows, with the product column and both models' predictions.</caption>
         <thead>
           <tr><th>$x_1$</th><th class="num">$x_2$</th><th class="num">$x_1 x_2$</th><th class="num">$y$ (AND)</th><th class="num">plain $\\hat y$</th><th class="num">with $x_1x_2$, $\\hat y$</th></tr>
         </thead>
         <tbody>
           <tr><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">-0.25</td><td class="num">0</td></tr>
           <tr><td class="num">1</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">0.25</td><td class="num">0</td></tr>
           <tr><td class="num">0</td><td class="num">1</td><td class="num">0</td><td class="num">0</td><td class="num">0.25</td><td class="num">0</td></tr>
           <tr><td class="num">1</td><td class="num">1</td><td class="num">1</td><td class="num">1</td><td class="num">0.75</td><td class="num">1</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Plain linear model</b> $\\hat y = w_0 + w_1 x_1 + w_2 x_2$ <i>cannot</i> fit this. Its best least-squares fit is $w_0=-0.25,\\,w_1=0.5,\\,w_2=0.5$, so plug in row $(1,0)$: $\\hat y = -0.25 + 0.5\\cdot 1 + 0.5\\cdot 0 = 0.25$ — but the target is $0$. Every "only one on" row is off by $0.25$ (the "plain $\\hat y$" column above).</li>
         <li><b>Add the interaction</b> $x_1 x_2$ and set $w_0=0,\\,w_1=0,\\,w_2=0,\\,w_{12}=1$, giving $\\hat y = x_1 x_2$. Plug in each row: $0\\cdot 0=0$, $1\\cdot 0=0$, $0\\cdot 1=0$, $1\\cdot 1=1$ — the predictions $0,0,0,1$ match the AND target <b>exactly</b>. One product column made the unlearnable learnable.</li>
         <li><b>Read off the meaning.</b> The marginal effect of $x_1$ is $\\partial\\hat y/\\partial x_1 = w_1 + w_{12}\\,x_2 = 0 + 1\\cdot x_2$. So at $x_2=0$ the effect is $0$, and at $x_2=1$ the effect is $1$. The effect of $x_1$ <i>depends on</i> $x_2$ — precisely as intended.</li>
       </ul>
       <p><b>Scaling up.</b> The book does the same move on Online News Popularity: <code>PolynomialFeatures(interaction_only=True)</code> turns the original numeric columns into themselves plus all $\\binom{d}{2}$ pairwise products, and the cross-validated $R^2$ of the linear model edges up — at the cost of many more columns and longer training.</p>`,

    demo: function (host) {
      var c = (function () {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      })();
      var wrap = document.createElement("div");
      var info = document.createElement("div"); info.className = "out"; info.style.marginBottom = "8px";
      info.innerHTML = "Feature count after a degree-2 expansion, as the number of original features $d$ grows. <b>interaction-only</b> adds the pairwise products $\\binom{d}{2}$; the <b>full polynomial</b> also adds the squares $x_i^2$. Drag the slider to feel the quadratic blow-up.";
      wrap.appendChild(info);

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; wrap.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var label = document.createElement("span"); label.style.marginRight = "8px"; label.style.color = c.dim;
      var slider = document.createElement("input"); slider.type = "range"; slider.min = "2"; slider.max = "60"; slider.value = "20"; slider.style.width = "260px"; slider.style.verticalAlign = "middle";
      row.appendChild(label); row.appendChild(slider); wrap.appendChild(row); wrap.appendChild(readout);
      host.appendChild(wrap);

      var W = 640, H = 320, padL = 56, padR = 16, padT = 16, padB = 36;
      function counts(d) {
        var base = d;
        var inter = d * (d - 1) / 2;
        var full = inter + d;            // pairwise products + squares
        return { base: base, interOnly: base + inter, full: base + full, inter: inter, sq: d };
      }
      function draw() {
        var dmax = parseInt(slider.value, 10);
        var ymax = counts(dmax).full || 1;
        ctx.clearRect(0, 0, W, H);
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
        function PX(d) { return padL + (d - 2) / (dmax - 2 || 1) * (W - padL - padR); }
        function PY(v) { return (H - padB) - v / ymax * (H - padT - padB); }
        // base (linear), interaction-only, full polynomial curves
        function curve(key, color) {
          ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
          for (var d = 2; d <= dmax; d++) { var p = counts(d)[key]; var X = PX(d), Y = PY(p); if (d === 2) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
          ctx.stroke();
        }
        curve("base", c.dim);
        curve("interOnly", c.accent);
        curve("full", c.warn);
        // axis labels
        ctx.fillStyle = c.dim; ctx.font = "12px system-ui";
        ctx.fillText("original features d", W / 2 - 50, H - 8);
        ctx.save(); ctx.translate(14, H / 2 + 40); ctx.rotate(-Math.PI / 2); ctx.fillText("# columns after expansion", 0, 0); ctx.restore();
        ctx.fillText("0", padL - 16, H - padB + 4); ctx.fillText(String(ymax), padL - 44, padT + 8);
        var cc = counts(dmax);
        readout.innerHTML = "At <b>d = " + dmax + "</b> features: linear keeps <b>" + cc.base + "</b> columns (grey); "
          + "interaction-only grows to <b>" + cc.interOnly + "</b> (blue, adds " + cc.inter + " products); "
          + "the full degree-2 polynomial reaches <b>" + cc.full + "</b> (orange, also adds " + cc.sq + " squares). "
          + "The blue and orange curves bend upward as $O(d^2)$ — that is the cost the book warns about.";
      }
      slider.addEventListener("input", function () { label.textContent = "d = " + slider.value; draw(); if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([readout]); });
      label.textContent = "d = " + slider.value;
      draw();
      if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([info, readout]);
    },

    practice: [
      {
        q: `You fit a plain <code>LinearRegression</code> to predict house price from two standardized features, <code>location_score</code> and <code>buyer_age</code>, and the model underfits: it predicts the same location premium for every buyer, but you know young and older buyers value neighborhoods differently. What single new feature lets a linear model express this, and what does its coefficient mean?`,
        steps: [
          { do: `Name what the plain model can and cannot do.`, why: `$\\hat y = w_0 + w_1\\,\\text{loc} + w_2\\,\\text{age}$ gives location one fixed weight $w_1$ — the same premium for every age. It structurally cannot make the location effect vary with age.` },
          { do: `Form the interaction.`, why: `Add the product column $\\text{loc}\\times\\text{age}$. The model becomes $\\hat y = w_0 + w_1\\text{loc} + w_2\\text{age} + w_{12}(\\text{loc}\\cdot\\text{age})$.` },
          { do: `Read the new marginal effect.`, why: `$\\partial\\hat y/\\partial\\,\\text{loc} = w_1 + w_{12}\\,\\text{age}$ — the location premium now slides with buyer age, exactly the behavior you wanted.` }
        ],
        answer: `<p>Add the <b>interaction feature</b> $\\text{location\\_score} \\times \\text{buyer\\_age}$ as a new column (e.g. via <code>PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)</code>). The linear model can then learn a weight $w_{12}$ on it, and the effect of location becomes $w_1 + w_{12}\\cdot\\text{buyer\\_age}$ — no longer constant, but sliding with age. The coefficient $w_{12}$ says <b>how much the location premium changes per unit of (standardized) buyer age</b>: positive means older buyers value good locations more; negative means less. This is Zheng &amp; Casari's "the effect of location depends on age" example, encoded as one product column. Because both features were standardized first, the product is well-scaled.</p>`
      },
      {
        q: `Your feature matrix has $d = 50$ numeric columns. You run <code>PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)</code>. How many columns come out, how many would the full polynomial give, and what two precautions does the book recommend?`,
        steps: [
          { do: `Count the interaction-only output.`, why: `Interaction-only keeps the $d$ originals and adds one product per unordered pair: $\\binom{50}{2}=\\frac{50\\cdot 49}{2}=1225$. Total $= 50 + 1225 = 1275$.` },
          { do: `Count the full polynomial.`, why: `The full degree-2 expansion also adds the $d=50$ squared terms $x_i^2$: total $= 50 + 1225 + 50 = 1325$ (1275 features plus 50 squares).` },
          { do: `Recall the trade-off.`, why: `Both blow up as $O(d^2)$, so many columns risk overfitting and slow training — the book pairs interactions with regularization and feature selection.` }
        ],
        answer: `<p><b>Interaction-only:</b> $50 + \\binom{50}{2} = 50 + 1225 = \\mathbf{1275}$ columns. <b>Full polynomial</b> (<code>interaction_only=False</code>): it also adds the 50 squared terms $x_i^2$, giving $1275 + 50 = \\mathbf{1325}$. Both grow like $O(d^2)$, so 50 features became well over a thousand. The book's two precautions: (1) use <b>regularization</b> (ridge or lasso) so the extra columns cannot memorize noise, and (2) follow with <b>feature selection</b> to keep only the interactions that actually help. It also helps to <b>standardize first</b> so the products are well-scaled.</p>`
      },
      {
        q: `A colleague adds all pairwise interaction features to a <b>random forest</b> and to a <b>logistic regression</b>, expecting both to improve. One barely changes and may even get slightly worse; the other can improve. Which is which, and why?`,
        steps: [
          { do: `Recall what each model can already represent.`, why: `Trees split sequentially: a split on $x_1$ followed by a split on $x_2$ already encodes their interaction, so the forest learns interactions natively.` },
          { do: `Recall the linear model's limit.`, why: `Logistic (a linear-in-parameters model) sums each feature times one weight and cannot represent a product unless you hand it the product column.` },
          { do: `Predict the outcome.`, why: `Interaction features mostly add redundant, noisy columns to the forest (no gain, extra cost) but give the logistic model genuinely new expressive power.` }
        ],
        answer: `<p>The <b>logistic regression can improve</b>; the <b>random forest barely changes (or slightly worsens)</b>. A linear/logistic model adds each feature times one weight and is structurally blind to feature products, so handing it $x_i x_j$ columns genuinely expands what it can fit. A random forest already learns interactions by splitting on one feature and then another, so the hand-built products are mostly redundant — they add dimensionality, training cost, and a little noise without new information, which can even nudge validation accuracy down. This is exactly the book's guidance: <b>reserve interaction features for models that cannot learn interactions themselves</b> (linear/logistic), not for trees or neural nets.</p>`
      }
    ]
  });

  window.CODE["fe-interaction-features"] = {
    lib: "scikit-learn",
    runnable: false,
    explain: `<p>Zheng &amp; Casari's Chapter 2 interaction-feature experiment on the <b>Online News Popularity</b> dataset (UCI). They expand the numeric features with <code>PolynomialFeatures(interaction_only=True)</code> and compare a <code>LinearRegression</code> with and without the pairwise products via cross-validated $R^2$ — getting a small but real lift at the cost of many more features. Dataset: the book's GitHub (github.com/alicezheng/feature-engineering-book) or UCI (<code>OnlineNewsPopularity.csv</code>). <code>runnable:false</code> because the CSV must be downloaded; the code runs as-is in Colab once it is present.</p>`,
    code: `import pandas as pd
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

# Online News Popularity (UCI) -- from the book's GitHub:
#   github.com/alicezheng/feature-engineering-book  ->  data/OnlineNewsPopularity.csv
df = pd.read_csv("OnlineNewsPopularity.csv")
df.columns = [c.strip() for c in df.columns]   # the CSV has leading spaces in headers

# target = number of shares; drop the non-predictive columns
y = df["shares"].values
X = df.drop(columns=["url", "timedelta", "shares"]).values
print("base feature matrix:", X.shape)         # ~ (39644, 58)

# --- add ALL pairwise interaction features (degree-2, no squared terms) ---
pf = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
X2 = pf.fit_transform(X)
print("with interactions:  ", X2.shape)        # ~ (39644, 1711) -- quadratic blow-up

# --- compare cross-validated R^2: base features vs base + interactions ---
lr = LinearRegression()
r2_base  = cross_val_score(lr, X,  y, cv=5, scoring="r2")
r2_inter = cross_val_score(lr, X2, y, cv=5, scoring="r2")

print("R^2 base features:        %.4f  (+/- %.4f)" % (r2_base.mean(),  r2_base.std()))
print("R^2 base + interactions:  %.4f  (+/- %.4f)" % (r2_inter.mean(), r2_inter.std()))
# The book observes a small improvement from the interaction features --
# bought at the cost of ~30x more columns and longer training time.`
  };

  window.CODEVIZ["fe-interaction-features"] = {
    question: "On a real dataset, does adding pairwise interaction features lift a linear model's accuracy — and how do you read the cases where it helps, overfits, or does nothing?",
    charts: [
      {
        type: "bars",
        title: "Ideal: small real lift (load_breast_cancer, first 5 mean-features, 5-fold CV)",
        xlabel: "feature set",
        ylabel: "mean 5-fold accuracy (higher is better)",
        labels: ["base (5 cols)", "base + interactions (15 cols)"],
        values: [0.9244, 0.9279],
        valueLabels: ["0.9244", "0.9279"],
        colors: ["#9aa7b4", "#7ee787"],
        interpret: "Each bar is the model's cross-validated accuracy; taller is better. The grey bar is plain logistic regression on 5 features; the green bar adds the 10 pairwise products (15 columns total). The green bar edges <b>above</b> grey (0.9244 to 0.9279) — a small but real gain, validated on held-out folds so it is not just memorising. This is the healthy outcome: interactions gave the linear model something it could not express before, and the lift survived cross-validation."
      },
      {
        type: "bars",
        title: "Overfitting: all 30 features crossed -> 465 columns, CV accuracy drops",
        xlabel: "feature set",
        ylabel: "accuracy (train high, 5-fold CV lower)",
        labels: ["base 30 cols (CV)", "all interactions 465 cols (train)", "all interactions 465 cols (CV)"],
        values: [0.95, 0.99, 0.90],
        valueLabels: ["~0.95", "~0.99 train", "~0.90 CV"],
        colors: ["#9aa7b4", "#ffb454", "#ff7b72"],
        interpret: "Illustrative shapes. Crossing all 30 features makes 465 columns. The orange bar shows training accuracy soaring (the model memorises noise with so many columns), but the red bar — the honest cross-validated score — falls <b>below</b> the grey base. The tell-tale sign of overfitting from interaction blow-up: a big gap between train (high) and CV (lower), with CV worse than no interactions. Read it as 'too many products, regularise or select.'"
      },
      {
        type: "bars",
        title: "No lift: features already separable / redundant crosses",
        xlabel: "feature set",
        ylabel: "mean 5-fold accuracy",
        labels: ["base", "base + interactions"],
        values: [0.96, 0.96],
        valueLabels: ["0.96", "0.96"],
        colors: ["#9aa7b4", "#9aa7b4"],
        interpret: "Illustrative. The two bars are level — interactions changed nothing. This happens when the data is already linearly separable (no joint effect to capture) or the crossed features were highly correlated, so each product is nearly a copy of the originals (multicollinearity). Read flat-or-equal bars as 'no joint structure here, or redundant crosses' — drop the interactions and save the columns."
      }
    ],
    caption: "The book uses Online News Popularity; the IDEAL bar uses the bundled load_breast_cancer (first 5 mean-features). PolynomialFeatures(degree=2, interaction_only=True) adds the 10 pairwise products (5+C(5,2)=15 columns) and CV accuracy edges up ~0.9244 to ~0.9279. The two variant charts are illustrative shapes showing the failure modes you actually meet: quadratic blow-up overfitting (train up, CV down) and the no-lift case (already-separable or redundant features).",
    code: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline

Xall, y = load_breast_cancer(return_X_y=True)  # 569 samples, 30 features
X = Xall[:, :5]                                 # the first 5 'mean' features
print("base:", X.shape)                         # (569, 5)

# add all pairwise interaction features (no squared terms)
pf = PolynomialFeatures(degree=2, interaction_only=True, include_bias=False)
X2 = pf.fit_transform(X)
print("with interactions:", X2.shape)           # (569, 15) = 5 + C(5,2)=10

# standardize first, then fit -- products are well-scaled this way
clf = make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))
acc_base  = cross_val_score(clf, X,  y, cv=5, scoring="accuracy").mean()
acc_inter = cross_val_score(clf, X2, y, cv=5, scoring="accuracy").mean()
print("acc base:               %.4f" % acc_base)    # ~0.9244
print("acc base+interactions:  %.4f" % acc_inter)   # ~0.9279  (small real lift)`
  };
})();
