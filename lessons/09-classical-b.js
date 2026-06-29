/* =====================================================================
   MODULE 9B — CLASSICAL ML (beyond the cheat sheet).
   Seven more classical methods that round out the toolbox:
     stacking, isolation-forest anomaly detection, collaborative filtering,
     t-SNE / UMAP, factor analysis, support vector regression, bandits.
   Style copied from 02-ml.js (the gold standard):
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real derivation ending in ∎
     - a real-world application
     - a bespoke, theme-aware demo that renders on load (never NaN/Infinity)
   ===================================================================== */
(function () {
const M = "Classical ML";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---------------------------------------------------------------- */
L({
  id: "cls-stacking",
  title: "Stacking ensembles",
  tagline: "Let several models vote, then train a model to combine the votes.",
  prereqs: ["ml-ensembles", "ml-linear-regression"],
  bigIdea:
    `<p><b>Stacking</b> blends several different models into one stronger model.</p>
     <p>First, many <b>base models</b> each make a prediction.</p>
     <p>Those predictions become the inputs to a final <b>meta-model</b>.</p>
     <p>The meta-model learns how much to trust each base model, then gives the final answer.</p>`,
  buildup:
    `<p>Bagging and boosting combine copies of <i>one</i> kind of model. Stacking combines <i>different</i> kinds.</p>
     <p>Say you have a tree, a linear model, and a nearest-neighbor model. Each is good at different things.</p>
     <p>Instead of averaging them by hand, you let a small model learn the best mix.</p>
     <p>That small model sees only the base predictions as features.</p>`,
  symbols: [
    { sym: "$x$", desc: "one input example (a vector of features)." },
    { sym: "$h_1, \\dots, h_K$", desc: "the $K$ base models. Each $h_k$ turns the input $x$ into a prediction." },
    { sym: "$z_k = h_k(x)$", desc: "the prediction of base model $k$ on input $x$. These become the new features." },
    { sym: "$g$", desc: "the meta-model (the combiner). It takes the base predictions and outputs the final answer." },
    { sym: "$\\hat{y}$", desc: "the final stacked prediction." }
  ],
  formula: `$$ \\hat{y} = g\\big(h_1(x),\\, h_2(x),\\, \\dots,\\, h_K(x)\\big) $$`,
  whatItDoes:
    `<p>Run all $K$ base models on the input. Collect their $K$ predictions into a short vector.</p>
     <p>Feed that vector into the meta-model $g$. Its output is the final prediction.</p>
     <p>If $g$ is a linear model, the final answer is a weighted sum of the base predictions, $\\hat{y} = \\sum_k w_k\\,z_k$, and training learns the weights $w_k$.</p>
     <p><b>What is "out-of-fold"?</b> A model is always too optimistic about data it has already seen — it half-memorized those exact answers. So to get honest base predictions for training the combiner, we split the training data into a few equal slices called <b>folds</b> (say 5). For each fold, we train the base models on the <i>other</i> four folds and let them predict the one fold they have <i>not</i> seen. Stitching together all the held-out predictions gives one honest prediction per training row.</p>
     <p>To avoid cheating, the base predictions used to train $g$ are exactly these <b>out-of-fold</b> predictions, not predictions on data the base models already memorized. Think of it like grading students on questions they did not get to practice — only then do the scores reflect real skill.</p>`,
  derivation:
    `<p><b>Why a learned combiner beats a fixed average.</b></p>
     <p>Suppose two base models give predictions $z_1$ and $z_2$ for a true value $y$. Each has an error: $e_1 = z_1 - y$ and $e_2 = z_2 - y$.</p>
     <ul class="steps">
       <li>A plain average uses weights $w_1 = w_2 = \\tfrac12$. Its error is $\\tfrac12 e_1 + \\tfrac12 e_2$.</li>
       <li>A stacked linear combiner is free to pick any weights $w_1, w_2$ with $w_1 + w_2 = 1$. Minimize the expected squared error $\\mathbb{E}[(w_1 e_1 + w_2 e_2)^2]$.</li>
       <li>If model 1 is twice as noisy as model 2, the math (inverse-variance weighting) says give model 2 more weight, not an equal half. The optimum puts $w_k \\propto 1/\\text{Var}(e_k)$.</li>
       <li>The plain average is just the special case where the combiner is forced to use equal weights. Since the learned combiner can always reproduce that average, it can only do as well or better. ∎</li>
     </ul>
     <p><b>Intuition.</b> A fixed average trusts every model the same. A learned combiner notices which model is reliable and leans on it.</p>`,
  example:
    `<p>Three base models predict a house price (in \\$k). The truth is $y = 300$. The meta-model $g$ learned weights $w$ on past data (it trusts the tree and linear model most).</p>
     <table class="extable"><caption>Base predictions $z_k$ and learned meta-weights $w_k$</caption><thead><tr><th>base model</th><th class="num">prediction $z_k$</th><th class="num">weight $w_k$</th><th class="num">$w_k z_k$</th></tr></thead><tbody><tr><td class="row-h">Tree</td><td class="num">310</td><td class="num">0.5</td><td class="num">155</td></tr><tr><td class="row-h">Linear</td><td class="num">290</td><td class="num">0.4</td><td class="num">116</td></tr><tr><td class="row-h">kNN</td><td class="num">330</td><td class="num">0.1</td><td class="num">33</td></tr></tbody></table>
     <ul class="steps">
       <li>Combine the base predictions: $\\hat{y} = g(z_1, z_2, z_3) = \\sum_k w_k z_k$.</li>
       <li>$\\hat{y} = 0.5{\\cdot}310 + 0.4{\\cdot}290 + 0.1{\\cdot}330 = 155 + 116 + 33 = 304$.</li>
       <li>A plain (equal-weight) average gives $(310 + 290 + 330)/3 = 930/3 = 310$.</li>
       <li>The learned $\\hat{y} = 304$ is 4 off the true 300; the plain average of 310 is 10 off. The learned combiner wins.</li>
     </ul>`,
  application:
    `<p>Stacking wins Kaggle competitions and powers production ranking systems. Netflix's famous \\$1M prize was won by a stacked blend of many models. Anywhere a single model plateaus, stacking a few diverse models squeezes out extra accuracy.</p>`,
  whenToUse:
    `<p><b>Reach for stacking when a single model has plateaued</b> and you have a handful of <i>diverse</i> base models that each capture different structure — a gradient-boosted tree, a linear model, and a neural net, say. Stacking pays off most when the base models make <i>uncorrelated</i> errors; combining models that agree adds nothing.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A simple average or blend</b> — when you want a learned weighting that leans on the reliable models, not a fixed equal vote. Stacking strictly dominates a plain average because the meta-model can reproduce it.</li>
       <li><b>One bigger, better-tuned model</b> — when you have already squeezed the most out of your strongest learner and need the last 1–2% for a competition or high-stakes ranking.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You need low latency or a small footprint — running $K$ base models plus a meta-model is expensive; ship a single distilled model instead.</li>
       <li>The base models are near-duplicates — diversity is the whole point, so a stack of correlated models is wasted effort.</li>
       <li>You lack the data to build clean out-of-fold predictions — stacking needs honest held-out folds to train the combiner.</li>
     </ul>
     <p><b>In practice:</b> scikit-learn's <code>StackingClassifier</code> / <code>StackingRegressor</code> handle the out-of-fold plumbing; keep the meta-model simple (regularized linear or logistic regression).</p>`,
  pitfalls:
    `<ul>
       <li><b>Leakage from in-sample base predictions.</b> If the meta-model trains on predictions the base models made on data they already saw, those predictions are unrealistically good and the stack collapses out of sample. Always use <b>out-of-fold</b> predictions to build the meta-features.</li>
       <li><b>A heavy meta-model overfits.</b> The combiner sees only $K$ tiny inputs, so a deep tree or another boosting model there just memorizes. Keep $g$ simple — regularized linear or logistic regression.</li>
       <li><b>Correlated base models add nothing.</b> Stacking three flavors of the same boosted tree barely beats one. Deliberately diversify the model families and feature views.</li>
       <li><b>Double cross-validation is mandatory for honest scoring.</b> Estimating the stack's true performance needs an <i>outer</i> CV (Cross-Validation) loop around the inner out-of-fold loop, or you will report an optimistic number.</li>
       <li><b>Serving cost multiplies.</b> Every prediction runs all $K$ base models. Budget the latency and memory, and consider distilling the stack into one model for production.</li>
       <li><b>Train / serving skew across many pipelines.</b> Each base model has its own feature pipeline; all of them must match offline and online, or the live blend drifts from your offline numbers.</li>
     </ul>`,
  quiz: {
    q: `Base models predict $z_1 = 8$ and $z_2 = 12$. The meta-model uses weights $w_1 = 0.75$, $w_2 = 0.25$. What is the stacked prediction?`,
    a: `<p>$\\hat{y} = 0.75 \\times 8 + 0.25 \\times 12 = 6 + 3 = 9$. The combiner leans toward model 1.</p>`
  },
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var base = [
      { name: "Tree", z: 310, w: 0.5 },
      { name: "Linear", z: 290, w: 0.4 },
      { name: "kNN", z: 330, w: 0.1 }
    ];
    function box(x, y, w, h, fill, stroke) { ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.fill(); ctx.stroke(); }
    function draw() {
      var c = C(); ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      var yhat = 0; for (var i = 0; i < base.length; i++) yhat += base[i].w * base[i].z;
      var bx = 30, bw = 120, bh = 56, gap = 30;
      var mx = 330, mw = 130, mh = 90;
      var ox = 560, ow = 70, oh = 70;
      for (var k = 0; k < base.length; k++) {
        var by = 40 + k * (bh + gap);
        box(bx, by, bw, bh, c.panel, c.accent);
        ctx.fillStyle = c.ink; ctx.font = "13px sans-serif";
        ctx.fillText(base[k].name, bx + bw / 2, by + 18);
        ctx.fillStyle = c.accent2; ctx.font = "12px sans-serif";
        ctx.fillText("z = " + base[k].z, bx + bw / 2, by + 38);
        var sy = by + bh / 2, sx = bx + bw;
        var ty = 40 + mh / 2 + 30, tx = mx;
        ctx.strokeStyle = c.dim; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(sx, sy); ctx.bezierCurveTo(sx + 50, sy, tx - 50, ty, tx, ty); ctx.stroke();
        ctx.fillStyle = c.warn; ctx.font = "11px sans-serif";
        ctx.fillText("w=" + base[k].w.toFixed(2), (sx + tx) / 2, (sy + ty) / 2 - 8);
      }
      var my = 40 + 30;
      box(mx, my, mw, mh, c.panel, c.purple);
      ctx.fillStyle = c.ink; ctx.font = "13px sans-serif";
      ctx.fillText("Meta-model g", mx + mw / 2, my + 26);
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif";
      ctx.fillText("Σ wₖ·zₖ", mx + mw / 2, my + 50);
      var oy = my + mh / 2 - oh / 2 + 8;
      ctx.strokeStyle = c.dim; ctx.lineWidth = 1.5; ctx.beginPath();
      ctx.moveTo(mx + mw, my + mh / 2); ctx.lineTo(ox, oy + oh / 2); ctx.stroke();
      box(ox, oy, ow, oh, c.panel, c.accent2);
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.fillText("ŷ", ox + ow / 2, oy + 18);
      ctx.fillStyle = c.accent2; ctx.font = "16px sans-serif"; ctx.fillText(yhat.toFixed(0), ox + ow / 2, oy + 44);
      ctx.fillStyle = c.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Base predictions flow in; the meta-model outputs ŷ = " + yhat.toFixed(0) + " (true price 300)", cv.width / 2, cv.height - 14);
    }
    draw();
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "cls-anomaly",
  title: "Anomaly detection (Isolation Forest)",
  tagline: "Outliers are easy to fence off. Few random cuts isolate them.",
  prereqs: ["ml-ensembles"],
  bigIdea:
    `<p>An <b>Isolation Forest</b> finds outliers by trying to <i>isolate</i> each point with random cuts.</p>
     <p>Pick a feature at random, then a random split value. Repeat, narrowing down to one point.</p>
     <p>A point in a crowd needs many cuts to be isolated. A lonely outlier needs only a few.</p>
     <p>So a <b>short isolation path</b> means anomaly.</p>`,
  buildup:
    `<p>Most methods model what "normal" looks like, then flag what is far from it. Isolation Forest flips this.</p>
     <p>It does not model normal at all. It just measures how hard each point is to separate.</p>
     <p>Build many random trees. In each, keep cutting until a point sits alone in its own region.</p>
     <p>Count how many cuts that took — the <b>path length</b>. Average it over all the trees.</p>`,
  symbols: [
    { sym: "$x$", desc: "one data point we want to score." },
    { sym: "$h(x)$", desc: "the path length: how many random cuts it took to isolate $x$ in one tree." },
    { sym: "$E[h(x)]$", desc: "the average path length for $x$ across all the trees in the forest." },
    { sym: "$n$", desc: "the number of points used to build a tree." },
    { sym: "$c(n)$", desc: "the typical path length for a normal point — a normalizing constant that depends on $n$." },
    { sym: "$s(x)$", desc: "the anomaly score, between 0 and 1. Near 1 means anomaly; near 0.5 means normal." }
  ],
  formula: `$$ s(x) = 2^{\\,-\\,\\dfrac{E[h(x)]}{c(n)}} $$`,
  whatItDoes:
    `<p>Compute the average number of cuts $E[h(x)]$ needed to isolate $x$. Divide by the typical depth $c(n)$.</p>
     <p><b>What is $c(n)$, and why divide by it?</b> Raw cut-counts are not comparable across datasets — a big dataset naturally needs more cuts to isolate any point, just because there are more points to separate. So we measure each point's path <i>relative to</i> what a normal point would take. $c(n)$ is that yardstick: the average path length for an ordinary point when the tree was built from $n$ points. (It is computed from a known formula for random binary trees, but you can read it as "how deep a typical point sits".) Dividing by $c(n)$ turns "5 cuts" into "5 cuts compared to a normal 4", a fair, dataset-independent ratio.</p>
     <p>If $x$ is easy to isolate, $E[h(x)]$ is small, the exponent is near 0, and $s(x)$ is near $2^0 = 1$: an anomaly.</p>
     <p>If $x$ is buried in a crowd, $E[h(x)]$ is large, the exponent is very negative, and $s(x)$ drops toward 0: normal.</p>
     <p>The score is bounded in $(0,1)$, so a single threshold (say $0.6$) flags outliers. The exponential $2^{-\\,\\cdot}$ is just a tidy way to squeeze any path-length ratio into that clean $0$-to-$1$ band.</p>`,
  derivation:
    `<p><b>Why short paths mean outliers.</b></p>
     <p>A random split is more likely to land in a region where points are spread out (low density) than where they are packed tight.</p>
     <ul class="steps">
       <li>Pick a random feature and a random threshold inside its range. The chance the threshold falls <i>between</i> a lone point and the crowd is high when the point sits far away in empty space.</li>
       <li>So an isolated point gets sliced off the rest of the data very early — often on the first or second cut.</li>
       <li>A point inside a dense cluster has neighbors on all sides. Many cuts are needed before it ends up alone, because each random cut usually keeps it together with neighbors.</li>
       <li>Path length therefore measures local emptiness. Short path = surrounded by emptiness = outlier. The exponential map $2^{-E[h]/c(n)}$ just rescales path length into a clean $(0,1)$ score. ∎</li>
     </ul>
     <p><b>Intuition.</b> To find the one person standing alone in a field, you only need a couple of fences. To single out one person in a packed stadium, you need fence after fence after fence.</p>`,
  example:
    `<p>A forest of trees is built and two points are scored. Suppose the typical depth $c(n) = 4$. The score is $s(x) = 2^{-E[h(x)]/c(n)}$; a threshold of $0.6$ flags outliers.</p>
     <table class="extable"><caption>Two points scored at $c(n) = 4$</caption><thead><tr><th>point</th><th class="num">$E[h(x)]$</th><th class="num">exponent $-E[h]/c(n)$</th><th class="num">score $s(x)$</th><th>verdict</th></tr></thead><tbody><tr><td class="row-h">Normal</td><td class="num">5</td><td class="num">−1.25</td><td class="num">0.42</td><td>normal</td></tr><tr><td class="row-h">Outlier</td><td class="num">1.5</td><td class="num">−0.375</td><td class="num">0.77</td><td>flag red</td></tr></tbody></table>
     <ul class="steps">
       <li>Normal point: exponent $= -5/4 = -1.25$, so $s = 2^{-1.25} \\approx 0.42$. Below $0.6$ — normal.</li>
       <li>Outlier: exponent $= -1.5/4 = -0.375$, so $s = 2^{-0.375} \\approx 0.77$. Above $0.6$ — flag it.</li>
       <li>The outlier was isolated in just $1.5$ cuts on average; the normal point needed $5$. Short path means anomaly.</li>
     </ul>`,
  application:
    `<p>Isolation Forests catch credit-card fraud, server intrusions, and faulty sensors. They are fast (linear time), need no labels, and handle high-dimensional data — the default tool when you must find "the weird ones" without knowing in advance what weird looks like.</p>`,
  whenToUse:
    `<p><b>Reach for an Isolation Forest when you need unsupervised outlier detection</b> on tabular data and you have few or no labels of what "weird" looks like. It shines on medium-to-high-dimensional numeric data, scales to large datasets (near-linear time), and needs little tuning beyond the expected contamination rate.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>One-Class SVM (Support Vector Machine)</b> — when you have many points and want speed; the SVM is more sensitive but scales badly past tens of thousands of rows.</li>
       <li><b>LOF (Local Outlier Factor)</b> — when anomalies are <i>global</i> rather than tied to local density; LOF is better for clusters of varying density but slower.</li>
       <li><b>A simple statistical rule (z-score, IQR)</b> — when relationships <i>across</i> features matter, not just per-column extremes.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You actually have labeled anomalies — train a supervised classifier; it will beat any unsupervised method.</li>
       <li>The data is sequences, images, or text — use an autoencoder or a domain model; trees can't read raw structure.</li>
       <li>Anomalies hide in <i>local</i> density dips — prefer LOF or a density model.</li>
     </ul>
     <p><b>In practice:</b> scikit-learn's <code>IsolationForest</code>; set <code>contamination</code> from a domain estimate of the outlier rate.</p>`,
  pitfalls:
    `<ul>
       <li><b>The contamination rate sets the threshold.</b> Setting <code>contamination</code> wrong shifts the cutoff and floods you with false positives or hides real anomalies. Estimate it from the domain, or rank by score and review the top slice instead of trusting a fixed threshold.</li>
       <li><b>Axis-aligned cuts miss diagonal structure.</b> The standard split is along one feature at a time, so anomalies that are only odd along a <i>combination</i> of correlated features can slip through. Use the Extended Isolation Forest for oblique cuts.</li>
       <li><b>Scores are relative, not absolute.</b> The $(0,1)$ score is calibrated to the training sample, so a "0.7" on one dataset is not comparable to a "0.7" on another. Re-threshold per dataset.</li>
       <li><b>Drift silently rots the model.</b> Today's normal becomes tomorrow's anomaly as traffic shifts. Retrain on recent data on a schedule and monitor the score distribution.</li>
       <li><b>Mixed feature scales and categoricals confuse the cuts.</b> Encode categoricals deliberately and be aware that raw scale affects where random thresholds land; consider standardizing.</li>
       <li><b>It flags the unusual, not the malicious.</b> A rare-but-benign event scores high too. Pair the score with business rules or a human review queue before acting.</li>
     </ul>`,
  quiz: {
    q: `Point A is isolated after an average of 2 cuts; point B after 8 cuts. With $c(n) = 4$, which has the higher anomaly score, and is it the outlier?`,
    a: `<p>A: $s = 2^{-2/4} = 2^{-0.5} \\approx 0.71$. B: $s = 2^{-8/4} = 2^{-2} = 0.25$. Point A scores higher and is the outlier — short paths mean easy to isolate.</p>`
  },
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var pts = [
      {x:0.42,y:0.50},{x:0.46,y:0.54},{x:0.50,y:0.48},{x:0.54,y:0.52},{x:0.48,y:0.56},
      {x:0.52,y:0.45},{x:0.44,y:0.46},{x:0.56,y:0.50},{x:0.50,y:0.58},{x:0.47,y:0.43},
      {x:0.10,y:0.85},{x:0.88,y:0.16}
    ];
    var x0=40, y0=20, W=400, H=300;
    function PX(x){return x0 + x*W;} function PY(y){return y0 + (1-y)*H;}
    var splits = [
      {axis:0, v:0.25},
      {axis:1, v:0.30},
      {axis:0, v:0.70},
      {axis:1, v:0.70}
    ];
    function depth(p) {
      var lo={x:0,y:0}, hi={x:1,y:1}, d=0;
      for (var i=0;i<splits.length;i++){
        var s=splits[i];
        var coord = s.axis===0 ? "x":"y";
        if (s.v>lo[coord] && s.v<hi[coord]) {
          d++;
          if (p[coord] < s.v) hi[coord]=s.v; else lo[coord]=s.v;
          if ((hi.x-lo.x)<0.35 && (hi.y-lo.y)<0.45) return d;
        }
      }
      return d + 2;
    }
    function draw() {
      var c=C(); ctx.clearRect(0,0,cv.width,cv.height);
      ctx.strokeStyle=c.border; ctx.lineWidth=1; ctx.strokeRect(x0,y0,W,H);
      ctx.strokeStyle=c.dim; ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
      for (var i=0;i<splits.length;i++){var s=splits[i];ctx.beginPath();
        if(s.axis===0){ctx.moveTo(PX(s.v),y0);ctx.lineTo(PX(s.v),y0+H);} else {ctx.moveTo(x0,PY(s.v));ctx.lineTo(x0+W,PY(s.v));}
        ctx.stroke();}
      ctx.setLineDash([]);
      ctx.font="11px sans-serif";
      // precompute each point's isolation depth, then flag the shallowest (most easily
      // isolated, in sparse regions) as anomalies so they get the anomaly color
      var depths = pts.map(depth);
      var minDepth = Infinity; for (var di=0; di<depths.length; di++) if (depths[di] < minDepth) minDepth = depths[di];
      for (var k=0;k<pts.length;k++){
        var d=depths[k]; var anom = d <= minDepth + 1;
        ctx.fillStyle = anom ? c.warn : c.accent;
        ctx.beginPath(); ctx.arc(PX(pts[k].x),PY(pts[k].y), anom?7:5, 0, Math.PI*2); ctx.fill();
        if (anom){ ctx.strokeStyle=c.warn; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(PX(pts[k].x),PY(pts[k].y),11,0,Math.PI*2); ctx.stroke();
          ctx.fillStyle=c.warn; ctx.textAlign="center"; ctx.fillText("depth "+d, PX(pts[k].x), PY(pts[k].y)-16); }
      }
      var lx=470;
      ctx.textAlign="left";
      ctx.fillStyle=c.ink; ctx.font="13px sans-serif"; ctx.fillText("Isolation depth", lx, 40);
      ctx.fillStyle=c.accent; ctx.beginPath(); ctx.arc(lx+8,66,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=c.dim; ctx.font="12px sans-serif"; ctx.fillText("normal (deep)", lx+22,70);
      ctx.fillStyle=c.warn; ctx.beginPath(); ctx.arc(lx+8,92,5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=c.dim; ctx.fillText("anomaly (shallow)", lx+22,96);
      ctx.fillStyle=c.dim; ctx.font="11px sans-serif";
      ctx.fillText("Outliers in sparse", lx, 130);
      ctx.fillText("regions are cut off", lx, 146);
      ctx.fillText("after 1–2 splits, so", lx, 162);
      ctx.fillText("their path is short.", lx, 178);
    }
    draw();
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "cls-recommender",
  title: "Collaborative filtering / matrix factorization",
  tagline: "Fill the blanks in a ratings table by factoring it into two thin matrices.",
  prereqs: ["ml-linear-regression", "ml-pca"],
  bigIdea:
    `<p>You have a big grid: rows are users, columns are items, cells are ratings. Most cells are blank.</p>
     <p><b>Collaborative filtering</b> fills the blanks by learning hidden tastes.</p>
     <p>Each user gets a short vector of <b>latent factors</b> (taste). Each item gets one too.</p>
     <p>A predicted rating is the dot product of the user's vector and the item's vector.</p>`,
  buildup:
    `<p>The full ratings matrix $R$ is huge but mostly empty. We assume it is secretly <b>low-rank</b>.</p>
     <p>"Low-rank" is a fancy way of saying: the table looks complicated, but it is really driven by only a <i>few</i> underlying knobs. Picture a movie grid where every rating is just "how much you like comedy" times "how funny the movie is" plus "how much you like action" times "how action-packed it is". Two knobs per person, two per movie — yet they reproduce thousands of ratings. That is low rank: a few hidden dimensions explain the whole table.</p>
     <p>These hidden dimensions are the <b>latent factors</b>. "Latent" just means hidden — we never label them by hand; the model invents them. Each user gets a short list of $k$ numbers (their taste), each item gets $k$ numbers (its traits).</p>
     <p>Factor $R$ into a tall user matrix $U$ (one row of $k$ numbers per user) and a tall item matrix $V$ (one row of $k$ numbers per item). Each has only $k$ columns — far fewer than the number of items.</p>
     <p>Then $R \\approx U V^\\top$, which is just shorthand for "fill every cell with the matching user-row · item-row dot product". We learn $U$ and $V$ from the ratings we <i>do</i> have, then read off the blanks.</p>`,
  symbols: [
    { sym: "$R$", desc: "the ratings matrix: rows = users, columns = items. Entry $R_{ui}$ is user $u$'s rating of item $i$ (blank if unrated)." },
    { sym: "$k$", desc: "the number of latent factors (hidden taste dimensions). Small, like 10–100." },
    { sym: "$U$", desc: "the user-factor matrix: one row $u_u$ per user, with $k$ numbers describing that user's taste." },
    { sym: "$V$", desc: "the item-factor matrix: one row $v_i$ per item, with $k$ numbers describing that item." },
    { sym: "$V^\\top$", desc: "$V$ transposed (rows and columns swapped), so the shapes line up for multiplication." },
    { sym: "$\\hat{R}_{ui}$", desc: "the predicted rating of item $i$ by user $u$: the dot product $u_u \\cdot v_i$." }
  ],
  formula: `$$ R \\approx U\\,V^\\top, \\qquad \\hat{R}_{ui} = u_u \\cdot v_i = \\sum_{f=1}^{k} U_{uf}\\,V_{if} $$`,
  whatItDoes:
    `<p>Give every user a row of $k$ numbers and every item a row of $k$ numbers.</p>
     <p>To predict how user $u$ rates item $i$, dot their two rows together.</p>
     <p>Training adjusts all the rows so the dot products match the ratings we already know, then those same rows predict the blanks.</p>
     <p>We minimize squared error only over observed cells: $\\sum_{(u,i)\\,\\text{known}} (R_{ui} - u_u\\cdot v_i)^2$, usually with a small penalty on the vector sizes.</p>`,
  derivation:
    `<p><b>Why a dot product predicts taste.</b></p>
     <p>Let one latent factor be "how much comedy". Put it in coordinate 1 of every vector.</p>
     <ul class="steps">
       <li>For user $u$, let $U_{u1}$ be how much they love comedy. For item $i$, let $V_{i1}$ be how much comedy it has.</li>
       <li>The product $U_{u1} V_{i1}$ is large only when a comedy-lover meets a comedy-heavy item — exactly when the rating should be high.</li>
       <li>Add a second factor (say "amount of action"), and the contributions add: $U_{u1}V_{i1} + U_{u2}V_{i2}$. That sum is the dot product $u_u \\cdot v_i$.</li>
       <li>So the dot product scores how well a user's preferences align with an item's traits across all $k$ factors. Stacking every user-item dot product gives the matrix product $U V^\\top$. ∎</li>
     </ul>
     <p><b>Intuition.</b> Aligned tastes point the same way, so their dot product is big (high rating). Opposite tastes cancel, so it is small (low rating). The model never needs to be told what the factors mean — it discovers them.</p>`,
  example:
    `<p>Two latent factors ($k = 2$): [comedy, action]. We predict the blank $\\hat{R}_{ui} = u_u \\cdot v_i$ for user Ann and the movie "Hot Fuzz".</p>
     <table class="extable"><caption>The $k = 2$ factor rows being dotted</caption><thead><tr><th>row</th><th class="num">factor 1 (comedy)</th><th class="num">factor 2 (action)</th></tr></thead><tbody><tr><td class="row-h">$u_{\\text{Ann}}$</td><td class="num">0.9</td><td class="num">0.2</td></tr><tr><td class="row-h">$v_{\\text{HF}}$</td><td class="num">0.8</td><td class="num">0.6</td></tr></tbody></table>
     <ul class="steps">
       <li>Ann loves comedy (0.9), is mild on action (0.2). Hot Fuzz is very funny (0.8), fairly action-packed (0.6).</li>
       <li>Factor 1 term: $U_{u1} V_{i1} = 0.9{\\times}0.8 = 0.72$.</li>
       <li>Factor 2 term: $U_{u2} V_{i2} = 0.2{\\times}0.6 = 0.12$.</li>
       <li>Sum the terms: $\\hat{R} = 0.72 + 0.12 = 0.84$. On a 0–1 scale that is a high rating, so recommend Hot Fuzz to Ann.</li>
     </ul>`,
  application:
    `<p>This is the engine behind Netflix, Spotify, Amazon, and YouTube recommendations. From a sparse log of "who watched/bought/liked what", matrix factorization fills in the rest and surfaces items you have not seen but probably want.</p>`,
  whenToUse:
    `<p><b>Reach for matrix factorization when you have a large, sparse user–item interaction log</b> — ratings, clicks, plays, purchases — and want personalized recommendations from collaborative signal alone. It is the workhorse baseline for recommenders: cheap to train, fast to serve (a dot product), and strong when interactions are plentiful.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Content-based filtering</b> — when you have rich behavior but weak item metadata; factorization discovers latent taste without hand-built features.</li>
       <li><b>Item-item or user-user kNN (k-Nearest Neighbors)</b> — when the matrix is huge; factorization compresses it to small vectors that generalize and serve faster.</li>
       <li><b>A deep recommender (two-tower, neural CF)</b> — when you want a strong, interpretable baseline before paying for the extra data and compute a neural model needs.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You face the <b>cold-start</b> problem — brand-new users or items have no interactions, so blend in content features or a hybrid model.</li>
       <li>Side information (text, images, context, time) carries most of the signal — use a feature-rich model like factorization machines or a two-tower network.</li>
       <li>You only have implicit feedback at massive scale — prefer ALS (Alternating Least Squares) with confidence weighting or BPR (Bayesian Personalized Ranking).</li>
     </ul>
     <p><b>In practice:</b> the <code>implicit</code> library (ALS) for implicit data, <code>Surprise</code> or <code>LightFM</code> for explicit ratings and hybrids.</p>`,
  pitfalls:
    `<ul>
       <li><b>Cold start breaks the dot product.</b> A new user or item has no learned vector, so it cannot be scored. Fall back to popularity, onboarding questions, or a content-feature hybrid until interactions accumulate.</li>
       <li><b>Train only on observed cells.</b> Treating every blank as a zero rating biases the model toward "dislike everything". Minimize error over <i>known</i> entries, and for implicit data weight observed interactions by confidence.</li>
       <li><b>Popularity bias and feedback loops.</b> The model recommends popular items, which gets them more clicks, which makes them look even better. Add diversity, debiasing, or exploration to avoid collapsing the catalog.</li>
       <li><b>Random splits leak the future.</b> Splitting interactions at random lets the model train on events that happened after the test events. Use a <i>time-based</i> split so the test set is genuinely future behavior.</li>
       <li><b>Implicit feedback is not a rating.</b> A click means "looked", not "loved", and a non-click is ambiguous. Model confidence explicitly rather than treating clicks as 1-vs-0 labels.</li>
       <li><b>Regularization and factor count are coupled.</b> Too many latent factors with weak penalty overfits the sparse cells. Tune $k$ and the regularization strength together on a held-out time slice.</li>
       <li><b>Stale embeddings drift.</b> Tastes and catalogs change; retrain on a schedule and refresh vectors, or recommendations slowly go stale.</li>
     </ul>`,
  quiz: {
    q: `User vector $u = [1,\\ 0.5]$, item vector $v = [0.6,\\ 0.4]$. What is the predicted rating $u \\cdot v$?`,
    a: `<p>$\\hat{R} = 1 \\times 0.6 + 0.5 \\times 0.4 = 0.6 + 0.2 = 0.8$. A high predicted rating.</p>`
  },
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var users = ["Ann","Bo","Cy"];
    var items = ["I1","I2","I3","I4"];
    var U = [[0.9,0.2],[0.3,0.9],[0.6,0.6]];
    var V = [[0.8,0.6],[0.1,0.9],[0.9,0.2],[0.5,0.5]];
    function dot(a,b){return a[0]*b[0]+a[1]*b[1];}
    var R = [
      [Math.round(dot(U[0],V[0])*10)/10, null, Math.round(dot(U[0],V[2])*10)/10, null],
      [null, Math.round(dot(U[1],V[1])*10)/10, null, Math.round(dot(U[1],V[3])*10)/10],
      [Math.round(dot(U[2],V[0])*10)/10, null, Math.round(dot(U[2],V[2])*10)/10, null]
    ];
    var predU = 0, predI = 3;
    function draw() {
      var c=C(); ctx.clearRect(0,0,cv.width,cv.height);
      ctx.textAlign="center"; ctx.textBaseline="middle";
      var gx=70, gy=40, cw=58, ch=42;
      ctx.fillStyle=c.dim; ctx.font="12px sans-serif";
      for (var j=0;j<items.length;j++) ctx.fillText(items[j], gx+cw/2+j*cw, gy-14);
      for (var i=0;i<users.length;i++){
        ctx.fillStyle=c.dim; ctx.fillText(users[i], gx-26, gy+ch/2+i*ch);
        for (var j2=0;j2<items.length;j2++){
          var x=gx+j2*cw, y=gy+i*ch, val=R[i][j2];
          var isPred = (i===predU && j2===predI);
          ctx.fillStyle = c.panel; ctx.strokeStyle = isPred? c.warn : c.border; ctx.lineWidth = isPred?2.5:1;
          ctx.beginPath(); ctx.rect(x,y,cw-4,ch-4); ctx.fill(); ctx.stroke();
          if (isPred){ var pv=dot(U[i],V[j2]); ctx.fillStyle=c.warn; ctx.font="14px sans-serif"; ctx.fillText(pv.toFixed(2), x+(cw-4)/2, y+(ch-4)/2); }
          else if (val!=null){ ctx.fillStyle=c.accent2; ctx.font="13px sans-serif"; ctx.fillText(val.toFixed(1), x+(cw-4)/2, y+(ch-4)/2); }
          else { ctx.fillStyle=c.dim; ctx.font="13px sans-serif"; ctx.fillText("?", x+(cw-4)/2, y+(ch-4)/2); }
        }
      }
      var u=U[predU], v=V[predI], pv=dot(u,v);
      var by=220;
      ctx.textAlign="left";
      ctx.fillStyle=c.ink; ctx.font="13px sans-serif";
      ctx.fillText("Predict blank ("+users[predU]+", "+items[predI]+"):", gx-26, by);
      ctx.fillStyle=c.accent; ctx.font="13px sans-serif";
      ctx.fillText("user row u = ["+u[0].toFixed(1)+", "+u[1].toFixed(1)+"]", gx-26, by+26);
      ctx.fillStyle=c.purple;
      ctx.fillText("item col v = ["+v[0].toFixed(1)+", "+v[1].toFixed(1)+"]", gx-26, by+50);
      ctx.fillStyle=c.warn;
      ctx.fillText("u · v = "+u[0].toFixed(1)+"·"+v[0].toFixed(1)+" + "+u[1].toFixed(1)+"·"+v[1].toFixed(1)+" = "+pv.toFixed(2), gx-26, by+78);
      ctx.fillStyle=c.dim; ctx.font="11px sans-serif";
      ctx.fillText("Green = known ratings, ? = blanks, orange = the filled-in prediction.", gx-26, by+106);
    }
    draw();
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "cls-tsne",
  title: "t-SNE (t-distributed Stochastic Neighbor Embedding) / UMAP (Uniform Manifold Approximation and Projection)",
  tagline: "Squash high-dimensional data to 2-D while keeping neighbors together.",
  prereqs: ["ml-pca", "ml-knn"],
  bigIdea:
    `<p><b>t-SNE</b> and <b>UMAP</b> are tools for <i>seeing</i> high-dimensional data on a flat screen.</p>
     <p>They place each point in 2-D so that points close in the original space stay close on the map.</p>
     <p>Unlike PCA (Principal Component Analysis), they can bend and curve — they capture nonlinear structure.</p>
     <p>The payoff: hidden clusters pop out as visible blobs.</p>`,
  buildup:
    `<p>PCA keeps the directions of biggest spread, but flattens curved structure.</p>
     <p>t-SNE instead cares only about <i>neighborhoods</i>. It turns distances into <b>probabilities of "being neighbors"</b>. What does that mean? Instead of recording an exact distance like "4.7 units apart", it records a softer fact: "there is a 30% chance these two points count as neighbors". Close points get a high chance; far points get a low one. This soft version is more forgiving — it does not insist on preserving every exact distance, only on keeping friends as friends.</p>
     <p>It builds these neighbor-probabilities twice: once in the original high-D space (call the pattern $p$) and once in the 2-D map we are drawing (call it $q$).</p>
     <p>Then it nudges the 2-D points until $q$ matches $p$ as closely as possible. The single number measuring "how different are these two neighbor-patterns" is the <b>KL divergence</b> $\\text{KL}(P\\,\\|\\,Q)$ — read it as a mismatch score that is $0$ when the patterns are identical and grows as they diverge. Shrinking it is the whole job.</p>
     <p><b>Analogy.</b> Imagine seating people from a huge banquet hall into a small room so that everyone keeps the same friends nearby. You cannot preserve exact distances in the smaller room, but you <i>can</i> keep each clique together. t-SNE solves exactly that seating puzzle.</p>`,
  symbols: [
    { sym: "$x_i, x_j$", desc: "two data points in the original high-dimensional space." },
    { sym: "$y_i, y_j$", desc: "the same two points placed on the 2-D map (what we solve for)." },
    { sym: "$p_{ij}$", desc: "the high-D neighbor probability: how likely $i$ and $j$ are neighbors, from their original distance." },
    { sym: "$q_{ij}$", desc: "the 2-D neighbor probability: the same likelihood computed from the map positions." },
    { sym: "$\\text{KL}(P\\,\\|\\,Q)$", desc: "the Kullback–Leibler divergence: a number measuring how different the neighbor pattern $Q$ is from $P$. Zero means identical." }
  ],
  formula: `$$ q_{ij} = \\frac{(1 + \\|y_i - y_j\\|^2)^{-1}}{\\sum_{k \\neq l}(1 + \\|y_k - y_l\\|^2)^{-1}}, \\qquad C = \\text{KL}(P\\,\\|\\,Q) = \\sum_{i \\neq j} p_{ij}\\log\\frac{p_{ij}}{q_{ij}} $$`,
  whatItDoes:
    `<p>For every pair of points, measure how "neighborly" they are — in high-D ($p_{ij}$) and on the 2-D map ($q_{ij}$).</p>
     <p>The cost $C$ is the mismatch between those two neighbor patterns. Gradient descent moves the 2-D points to shrink $C$.</p>
     <p>The map's $q_{ij}$ uses a heavy-tailed shape $(1+d^2)^{-1}$. That heavy tail lets far-apart clusters spread out instead of crushing together.</p>
     <p>UMAP does the same job with a different neighbor model; it is faster and tends to preserve global layout better.</p>`,
  derivation:
    `<p><b>Why the heavy tail prevents crowding.</b></p>
     <p>In high dimensions there is far more "room" than in 2-D. If we used a Gaussian for the map too, moderately-distant points would all pile up.</p>
     <ul class="steps">
       <li>A Gaussian $q \\propto e^{-d^2}$ falls off fast: once $d$ is moderate, $q$ is already tiny, so the map cannot tell "medium-far" from "very-far".</li>
       <li>t-SNE uses a Student-t shape $q \\propto (1+d^2)^{-1}$ for the map. It falls off slowly — a heavy tail.</li>
       <li>So a pair that must be far apart can be placed at a <i>large but finite</i> map distance and still contribute a sensible $q$. The model is not forced to cram them in.</li>
       <li>Matching the high-D $p$ (built with Gaussians) to this heavy-tailed $q$ pushes distinct clusters apart while pulling true neighbors together — the gap between clusters opens up. ∎</li>
     </ul>
     <p><b>Intuition.</b> Use a forgiving ruler for the 2-D map. It says "far is far" without insisting on an exact distance, leaving space for clusters to separate cleanly.</p>`,
  example:
    `<p>The central trick is the <b>heavy tail</b>: it lets far-apart clusters sit at a finite distance instead of crushing together. Compare the Student-t map shape $(1+d^2)^{-1}$ against a Gaussian $e^{-d^2}$ at a close pair ($d = 1$) and a far pair ($d = 3$).</p>
     <table class="extable"><caption>Map affinity: Student-t (t-SNE) vs Gaussian</caption><thead><tr><th>distance $d$</th><th class="num">Student-t $(1+d^2)^{-1}$</th><th class="num">Gaussian $e^{-d^2}$</th></tr></thead><tbody><tr><td class="row-h">close, $d = 1$</td><td class="num">0.50</td><td class="num">0.37</td></tr><tr><td class="row-h">far, $d = 3$</td><td class="num">0.10</td><td class="num">0.00012</td></tr><tr><td class="row-h">far/close ratio</td><td class="num">0.20</td><td class="num">0.0003</td></tr></tbody></table>
     <ul class="steps">
       <li>Close pair, $d = 1$: Student-t $(1 + 1)^{-1} = 0.50$; Gaussian $e^{-1} \\approx 0.37$. Both call it a neighbor.</li>
       <li>Far pair, $d = 3$: Student-t $(1 + 9)^{-1} = 0.10$; Gaussian $e^{-9} \\approx 0.00012$.</li>
       <li>Gaussian far/close ratio $= 0.00012 / 0.37 \\approx 0.0003$: affinity collapsed to near-zero, so the Gaussian map cannot tell "far" from "even farther" — it crushes distant clusters into one blob.</li>
       <li>Student-t ratio $= 0.10 / 0.50 = 0.2$: the far pair still carries real affinity, so the layout places those clusters at a large but finite gap and they separate cleanly. That is the crowding problem t-SNE solves.</li>
     </ul>`,
  application:
    `<p>t-SNE and UMAP are everywhere in exploratory data analysis: visualizing word embeddings, single-cell RNA data (cell types appear as islands), and the hidden layers of neural nets. They turn a 50- or 500-dimensional dataset into a picture you can actually read.</p>`,
  whenToUse:
    `<p><b>Reach for t-SNE or UMAP when you want to <i>see</i> the structure of high-dimensional data</b> as a 2-D picture — to spot clusters, check whether classes separate, or inspect embeddings from a model. These are <b>visualization and exploration</b> tools, not a preprocessing step that feeds a downstream model.</p>
     <p><b>Choose them over:</b></p>
     <ul>
       <li><b>PCA (Principal Component Analysis)</b> — when the structure is nonlinear and curved; PCA only keeps linear directions of spread and smears curved manifolds together.</li>
       <li><b>UMAP over t-SNE specifically</b> — when you have many points and care about <i>global</i> layout and speed; UMAP is faster and preserves coarse structure better. Use t-SNE when fine local neighborhoods matter most.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You need features for a classifier or to compress data for a model — use PCA, an autoencoder, or the raw embedding; t-SNE coordinates are not meaningful features.</li>
       <li>You need a reproducible, interpretable projection — PCA's axes have meaning; t-SNE's do not.</li>
       <li>You must embed <i>new</i> points later — plain t-SNE has no transform; use UMAP (which can) or PCA.</li>
     </ul>
     <p><b>In practice:</b> <code>umap-learn</code> for speed and out-of-sample transform; scikit-learn's <code>TSNE</code> (or openTSNE for large data) for the classic method.</p>`,
  pitfalls:
    `<ul>
       <li><b>Cluster sizes and gaps are not real.</b> t-SNE distorts density and distance — a tight blob and a loose blob can look the same size, and the space <i>between</i> clusters carries no meaning. Never read quantitative structure off the picture.</li>
       <li><b>Perplexity (t-SNE) changes everything.</b> Too low fragments real clusters into specks; too high merges them. Try several values (5–50) and trust only structure that survives across them.</li>
       <li><b>Random initialization gives different maps.</b> Re-running with a new seed reshuffles the layout. Fix the seed (or use a PCA initialization) and confirm findings are stable.</li>
       <li><b>You can hallucinate clusters from noise.</b> t-SNE will happily carve random data into neat blobs. Validate apparent clusters against labels or a clustering metric before believing them.</li>
       <li><b>Do not feed the coordinates into a model.</b> The 2-D output is for human eyes, not features — distances are non-Euclidean and unstable across runs.</li>
       <li><b>Scale and preprocess first.</b> Run PCA down to ~50 dimensions and standardize before t-SNE/UMAP; otherwise it is slow and dominated by whichever feature has the largest range.</li>
     </ul>`,
  quiz: {
    q: `On the 2-D map, pair A is at distance 2 and pair B at distance 4. Using affinity $(1+d^2)^{-1}$, which pair is treated as closer neighbors?`,
    a: `<p>A: $(1+4)^{-1} = 0.2$. B: $(1+16)^{-1} \\approx 0.059$. Pair A has higher affinity, so it is treated as closer neighbors.</p>`
  },
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var seed=12345; function rnd(){seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff;}
    function gauss(){return (rnd()+rnd()+rnd()+rnd()-2)/2;}
    var clusters = [
      {cx:0.30,cy:0.30,col:"accent"},
      {cx:0.30,cy:0.42,col:"accent2"},
      {cx:0.30,cy:0.36,col:"warn"}
    ];
    var mapCenters = [{x:0.25,y:0.30},{x:0.72,y:0.30},{x:0.50,y:0.72}];
    var pts=[];
    for (var ci=0;ci<3;ci++){ for (var n=0;n<14;n++){
      pts.push({ci:ci, lx:clusters[ci].cx+gauss()*0.06, ly:clusters[ci].cy+gauss()*0.05,
                 mx:mapCenters[ci].x+gauss()*0.05, my:mapCenters[ci].y+gauss()*0.05}); } }
    function draw(){
      var c=C(); ctx.clearRect(0,0,cv.width,cv.height);
      var colOf={accent:c.accent,accent2:c.accent2,warn:c.warn};
      var lx=20,ly=40,lw=270,lh=270;
      ctx.strokeStyle=c.border; ctx.strokeRect(lx,ly,lw,lh);
      ctx.fillStyle=c.dim; ctx.font="12px sans-serif"; ctx.textAlign="center";
      ctx.fillText("high-D data (clusters overlap)", lx+lw/2, ly-12);
      for (var i=0;i<pts.length;i++){var p=pts[i];
        ctx.fillStyle=colOf[clusters[p.ci].col];
        ctx.beginPath(); ctx.arc(lx+p.lx*lw, ly+p.ly*lh, 4, 0, Math.PI*2); ctx.fill();}
      ctx.strokeStyle=c.dim; ctx.lineWidth=2; ctx.beginPath();
      ctx.moveTo(300,175); ctx.lineTo(345,175); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(345,175); ctx.lineTo(337,170); ctx.lineTo(337,180); ctx.closePath(); ctx.fillStyle=c.dim; ctx.fill();
      ctx.fillStyle=c.dim; ctx.font="11px sans-serif"; ctx.fillText("t-SNE", 322, 165);
      var rx=360,ry=40,rw=270,rh=270;
      ctx.strokeStyle=c.border; ctx.strokeRect(rx,ry,rw,rh);
      ctx.fillStyle=c.dim; ctx.font="12px sans-serif"; ctx.fillText("2-D map (clusters separate)", rx+rw/2, ry-12);
      for (var j=0;j<pts.length;j++){var q=pts[j];
        ctx.fillStyle=colOf[clusters[q.ci].col];
        ctx.beginPath(); ctx.arc(rx+q.mx*rw, ry+q.my*rh, 4, 0, Math.PI*2); ctx.fill();}
      ctx.fillStyle=c.dim; ctx.font="11px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Same points, same colors — nearby stays nearby, clusters pull apart.", cv.width/2, 340);
    }
    draw();
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "cls-factor-analysis",
  title: "Factor analysis",
  tagline: "Explain many measured signals with a few hidden causes plus noise.",
  prereqs: ["ml-pca", "ml-linear-regression"],
  bigIdea:
    `<p><b>Factor analysis</b> says your many observed variables are driven by a few hidden ones.</p>
     <p>Each hidden <b>factor</b> influences several observed signals at once.</p>
     <p>What is left over after the factors is treated as measurement <b>noise</b>.</p>
     <p>So observed = (factors mixed together) + (its own average) + noise.</p>`,
  buildup:
    `<p>Imagine ten test scores per student. They are <b>correlated</b> — "correlated" just means they tend to move together: a strong student does well across the board, a weak one does poorly across the board.</p>
     <p>Maybe one hidden factor, "general ability", explains most of that togetherness.</p>
     <p>Each test responds to ability by its own amount, called its <b>loading</b>. A loading is simply a dial: "for every one unit more ability, this test's score goes up by <i>this</i> much." A math test might have a big loading on ability; a spelling test a smaller one. On top of that each test has its own private wobble (noise) unrelated to the others.</p>
     <p>Factor analysis works backward: from the pattern of which scores move together, it recovers those loadings and the hidden factors — without ever being told what "ability" is. It infers the hidden cause purely from the correlations.</p>`,
  symbols: [
    { sym: "$x$", desc: "the vector of observed variables (e.g. the ten test scores). It has many dimensions." },
    { sym: "$z$", desc: "the vector of hidden factors. Few dimensions — often just 1 or 2." },
    { sym: "$\\Lambda$", desc: "the loading matrix ('Lambda'). Each row says how strongly one observed signal responds to each factor." },
    { sym: "$\\mu$", desc: "the mean vector ('mu'): the baseline average of each observed signal." },
    { sym: "$\\epsilon$", desc: "the noise vector ('epsilon'): the private, unexplained wobble in each observed signal." }
  ],
  formula: `$$ x = \\Lambda z + \\mu + \\epsilon, \\qquad z \\sim \\mathcal{N}(0, I), \\quad \\epsilon \\sim \\mathcal{N}(0, \\Psi) $$`,
  whatItDoes:
    `<p>Pick a few hidden factor values $z$ (drawn from a standard bell curve). Multiply by the loadings $\\Lambda$ to spread them across the observed signals.</p>
     <p>Add the baseline $\\mu$ so each signal sits at its normal level. Add a little private noise $\\epsilon$.</p>
     <p>The result is the observed vector $x$. Training learns $\\Lambda$, $\\mu$, and the noise sizes $\\Psi$ from data.</p>
     <p>Because the noise $\\epsilon$ is modeled <i>per variable</i> (the diagonal $\\Psi$), factor analysis separates shared structure from per-signal junk — something plain PCA (Principal Component Analysis) does not do.</p>`,
  derivation:
    `<p><b>Why this implies a specific correlation pattern.</b></p>
     <p>First, two words. <b>Center the data</b> means subtract each signal's average so everything is measured as "above or below normal" — this just sets $\\mu = 0$ to clean up the algebra. The <b>covariance</b> of $x$ is a grid of numbers recording, for every pair of signals, how strongly they swing together (big positive = rise together, near zero = unrelated).</p>
     <p>Center the data so $\\mu = 0$, giving $x = \\Lambda z + \\epsilon$. Now find the covariance of $x$ and see what the model forces it to look like.</p>
     <ul class="steps">
       <li>Covariance is $\\mathbb{E}[x x^\\top] = \\mathbb{E}[(\\Lambda z + \\epsilon)(\\Lambda z + \\epsilon)^\\top]$.</li>
       <li>Expand. The cross terms $\\mathbb{E}[\\Lambda z\\,\\epsilon^\\top]$ vanish because factors $z$ and noise $\\epsilon$ are independent (and mean zero).</li>
       <li>Use $\\mathbb{E}[z z^\\top] = I$ (factors are standardized) and $\\mathbb{E}[\\epsilon \\epsilon^\\top] = \\Psi$ (diagonal noise).</li>
       <li>What remains is $\\text{Cov}(x) = \\Lambda \\Lambda^\\top + \\Psi$. The shared correlations live entirely in the low-rank part $\\Lambda \\Lambda^\\top$; $\\Psi$ only adds to the diagonal. Fitting the model means choosing $\\Lambda$ and $\\Psi$ so this matches the observed covariance. ∎</li>
     </ul>
     <p><b>Intuition.</b> Correlation <i>between</i> different signals can only come from shared factors, so it must be carried by $\\Lambda\\Lambda^\\top$. Each signal's own private variance is the diagonal $\\Psi$. The model cleanly splits the two.</p>`,
  example:
    `<p>One hidden factor "general ability" $z$. Three test scores load on it with $\\Lambda = [2,\\ 1.5,\\ 1]^\\top$ and baselines $\\mu = [70,\\ 60,\\ 80]$ (ignore noise $\\epsilon$). Each score is $x_j = \\Lambda_j z + \\mu_j$. Compute both students.</p>
     <table class="extable"><caption>Scores $x_j = \\Lambda_j z + \\mu_j$ for two students</caption><thead><tr><th>student</th><th class="num">factor $z$</th><th class="num">Test 1 ($\\Lambda{=}2,\\mu{=}70$)</th><th class="num">Test 2 ($\\Lambda{=}1.5,\\mu{=}60$)</th><th class="num">Test 3 ($\\Lambda{=}1,\\mu{=}80$)</th></tr></thead><tbody><tr><td class="row-h">Strong</td><td class="num">+1.5</td><td class="num">73</td><td class="num">62.25</td><td class="num">81.5</td></tr><tr><td class="row-h">Weak</td><td class="num">−1.0</td><td class="num">68</td><td class="num">58.5</td><td class="num">79</td></tr></tbody></table>
     <ul class="steps">
       <li>Strong student, $z = +1.5$: Test 1 $= 2{\\times}1.5 + 70 = 73$; Test 2 $= 1.5{\\times}1.5 + 60 = 62.25$; Test 3 $= 1{\\times}1.5 + 80 = 81.5$.</li>
       <li>Weak student, $z = -1.0$: Test 1 $= 2{\\times}({-}1) + 70 = 68$; Test 2 $= 1.5{\\times}({-}1) + 60 = 58.5$; Test 3 $= 1{\\times}({-}1) + 80 = 79$.</li>
       <li>One hidden number moved <i>all three</i> tests the same way — strong is up on every test, weak down on every test. That lock-step co-movement is correlation, and it came entirely from $z$.</li>
       <li>Check $\\text{Cov} = \\Lambda\\Lambda^\\top + \\Psi$: the off-diagonal coupling of tests 1 and 2 is $\\Lambda_1\\Lambda_2 = 2{\\times}1.5 = 3$ — purely the factor. Noise $\\Psi$ only sits on the diagonal, so the shared factor is the sole source of between-test correlation. ∎</li>
     </ul>`,
  application:
    `<p>Factor analysis was born in psychology (the "g" factor of intelligence) and is a staple in finance (a few market factors drive many stock returns), marketing (survey questions reduce to a few attitudes), and any field drowning in correlated measurements.</p>`,
  whenToUse:
    `<p><b>Reach for factor analysis when you believe a few hidden causes generate many correlated measurements</b> and you want to <i>explain</i> that correlation, not just compress it. It is the right tool when the measurements carry genuinely different amounts of noise — surveys, test batteries, financial returns, sensor panels.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>PCA (Principal Component Analysis)</b> — when you want a generative model that separates shared structure from <i>per-variable</i> noise. PCA folds noise into its components; factor analysis isolates it in the diagonal $\\Psi$.</li>
       <li><b>A plain correlation heatmap</b> — when you want named, quantitative drivers (loadings) rather than just "these move together".</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>You only need to compress or whiten data for a downstream model — PCA is simpler and faster.</li>
       <li>The hidden sources are non-Gaussian and you want to <i>separate signals</i> (e.g. audio sources) — use ICA (Independent Component Analysis).</li>
       <li>The latent structure is nonlinear — use an autoencoder or a nonlinear latent-variable model.</li>
       <li>The data is counts or categorical — use a model built for that (e.g. item-response theory, topic models), not Gaussian factor analysis.</li>
     </ul>
     <p><b>In practice:</b> scikit-learn's <code>FactorAnalysis</code>; rotate loadings (e.g. varimax) afterward for interpretability.</p>`,
  pitfalls:
    `<ul>
       <li><b>Factors are unidentified without rotation.</b> Any rotation of $\\Lambda$ fits the covariance equally well, so the raw loadings are arbitrary. Apply a rotation (varimax for independent factors, oblimin for correlated ones) before interpreting them.</li>
       <li><b>Choosing the number of factors is a judgment call.</b> Too few hides real structure; too many fits noise. Use a scree plot, parallel analysis, or held-out likelihood — not a single heuristic.</li>
       <li><b>It assumes linear, Gaussian relationships.</b> Heavy tails, skew, or nonlinearity break the covariance derivation. Transform variables or switch models when the assumption fails.</li>
       <li><b>Sensitive to scale.</b> Loadings depend on each variable's units, so standardize (or analyze the correlation matrix) unless the scales are genuinely comparable.</li>
       <li><b>Loadings are not causation.</b> A factor labeled "general ability" is a statistical summary, not a proven mechanism. Resist over-reading the names you assign.</li>
       <li><b>Needs enough samples per variable.</b> With too few observations the covariance estimate is noisy and factors are unstable; a common rule of thumb is several times as many rows as columns.</li>
     </ul>`,
  quiz: {
    q: `A signal has loading $\\Lambda = 3$ on a single factor, baseline $\\mu = 50$ (ignore noise). If the factor value is $z = -2$, what is the observed signal $x$?`,
    a: `<p>$x = \\Lambda z + \\mu = 3 \\times (-2) + 50 = -6 + 50 = 44$. The negative factor pulls the signal below its baseline.</p>`
  },
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var z1 = 1.0, z2 = 0.0;
    var L1 = [2.0, -1.5, 1.0, 0.5];
    var L2 = [0.5, 1.0, -2.0, 1.5];
    var mu = [3, 5, 4, 6];
    function draw() {
      var c=C(); ctx.clearRect(0,0,cv.width,cv.height);
      var x0=50, y0=30, W=540, H=210, base=y0+H;
      ctx.strokeStyle=c.border; ctx.lineWidth=1; ctx.beginPath();
      ctx.moveTo(x0,y0); ctx.lineTo(x0,base); ctx.lineTo(x0+W,base); ctx.stroke();
      var n=L1.length, bw=70, gap=(W-n*bw)/(n+1);
      var ymax=12;
      for (var i=0;i<n;i++){
        var val = L1[i]*z1 + L2[i]*z2 + mu[i];
        val = Math.max(0, Math.min(ymax, val));
        var bx = x0 + gap + i*(bw+gap);
        var bh = val/ymax * H;
        ctx.fillStyle = c.accent; ctx.fillRect(bx, base-bh, bw, bh);
        ctx.fillStyle = c.ink; ctx.font="12px sans-serif"; ctx.textAlign="center";
        ctx.fillText(val.toFixed(1), bx+bw/2, base-bh-8);
        ctx.fillStyle = c.dim; ctx.fillText("x"+(i+1), bx+bw/2, base+16);
      }
      ctx.fillStyle=c.dim; ctx.font="12px sans-serif"; ctx.textAlign="left";
      ctx.fillText("Observed signals follow the hidden factors: x = Λz + μ", x0, y0-10);
    }
    function mkSlider(label, init, min, max, set){
      var row=document.createElement("div"); row.style.margin="6px 0";
      var lab=document.createElement("label"); lab.style.display="block"; lab.textContent=label+" ";
      var span=document.createElement("span"); span.className="out"; span.style.marginLeft="6px"; span.textContent=init.toFixed(2); lab.appendChild(span);
      var inp=document.createElement("input"); inp.setAttribute("type","range"); inp.min=min; inp.max=max; inp.step=0.05; inp.value=init;
      inp.addEventListener("input",function(){var v=parseFloat(inp.value); span.textContent=v.toFixed(2); set(v); draw();});
      row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    }
    mkSlider("factor z₁", z1, -2, 2, function(v){z1=v;});
    mkSlider("factor z₂", z2, -2, 2, function(v){z2=v;});
    draw();
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "cls-svr",
  title: "Support Vector Regression",
  tagline: "Fit a line inside a tube. Ignore points the tube already covers.",
  prereqs: ["ml-svm", "ml-linear-regression"],
  bigIdea:
    `<p><b>Support Vector Regression</b> (SVR) fits a function but tolerates small errors.</p>
     <p>It draws a tube of width $\\pm\\varepsilon$ around the fitted line.</p>
     <p>Any point inside the tube counts as "close enough" and costs nothing.</p>
     <p>Only points <i>outside</i> the tube matter. Those are the <b>support vectors</b>.</p>`,
  buildup:
    `<p>Ordinary least squares punishes every error, even tiny ones. That makes it twitchy and sensitive to noise.</p>
     <p>SVR uses an <b>$\\varepsilon$-insensitive loss</b>: errors smaller than $\\varepsilon$ are forgiven entirely.</p>
     <p>So the model stays flat and simple as long as most points fall inside the tube.</p>
     <p>It pays only for how far the stubborn outside points stick out.</p>`,
  symbols: [
    { sym: "$f(x) = w^\\top x + b$", desc: "the fitted function: weights $w$ dotted with features $x$, plus offset $b$." },
    { sym: "$\\varepsilon$", desc: "the tube half-width ('epsilon'). Errors smaller than this are free." },
    { sym: "$|y - f(x)|$", desc: "the size of the error: how far the true value $y$ is from the prediction." },
    { sym: "$L_\\varepsilon$", desc: "the $\\varepsilon$-insensitive loss: zero inside the tube, then grows linearly outside." },
    { sym: "$\\|w\\|^2$", desc: "the squared size of the weights. Keeping it small keeps the function flat and smooth." }
  ],
  formula: `$$ L_\\varepsilon(y, f(x)) = \\max\\big(0,\\ |y - f(x)| - \\varepsilon\\big), \\qquad \\min_{w,b}\\ \\tfrac12\\|w\\|^2 + C\\sum_i L_\\varepsilon\\big(y_i, f(x_i)\\big) $$`,
  whatItDoes:
    `<p>Measure each point's error. Subtract $\\varepsilon$. If the result is negative (inside the tube), clamp it to 0 — free.</p>
     <p>Only points outside the tube add to the cost, and they add in proportion to how far out they are.</p>
     <p>The term $\\tfrac12\\|w\\|^2$ keeps the function as flat as possible; $C$ trades flatness against fitting the outside points. Read $C$ as a strictness knob: a big $C$ says "really do fit those outside points", a small $C$ says "stay flat, I'll tolerate misses".</p>
     <p>The solution depends only on the support vectors (the outside points), so SVR is robust to the many points sitting comfortably inside.</p>
     <p><b>What about curves?</b> So far the line is straight. The <b>kernel trick</b> lets SVR bend without extra work: instead of fitting a straight line in the raw features, it measures how <i>similar</i> two points are and fits a straight line in that similarity space — which comes out curved back in the original space. The most common similarity measure is the <b>RBF (Radial Basis Function) kernel</b>: "two points are similar if they are close, and the similarity drops off smoothly with distance." That single idea lets the same tube-fitting machinery trace wavy, nonlinear trends.</p>`,
  derivation:
    `<p><b>Why only the support vectors matter.</b></p>
     <p>The fit minimizes $\\tfrac12\\|w\\|^2 + C\\sum_i L_\\varepsilon$. Look at how each point pulls on the weights via the gradient.</p>
     <ul class="steps">
       <li>For a point <i>inside</i> the tube, $|y_i - f(x_i)| &lt; \\varepsilon$, so $L_\\varepsilon = 0$ — flat. Its gradient contribution is $0$. It exerts no force on $w$.</li>
       <li>For a point <i>outside</i>, $L_\\varepsilon = |y_i - f(x_i)| - \\varepsilon$, whose slope is $\\pm 1$. It pushes $w$ with a fixed-size force, in the direction that pulls the line toward it.</li>
       <li>So the optimal $w$ is determined entirely by the outside points balancing against the flatness term. Inside points could be deleted without changing the answer.</li>
       <li>Those decisive outside points are the support vectors — the regression literally rests on them. ∎</li>
     </ul>
     <p><b>Intuition.</b> If a point is already "close enough", nudging the line does not help it and does not hurt it — so it stays silent. Only the points the line fails to cover get a vote.</p>`,
  example:
    `<p>Tube half-width $\\varepsilon = 1$. The fitted line predicts $f(x) = 5$ at some $x$. Score three points with the $\\varepsilon$-insensitive loss $L_\\varepsilon = \\max(0,\\ |y - f(x)| - \\varepsilon)$.</p>
     <table class="extable"><caption>$\\varepsilon$-insensitive loss at $f(x) = 5$, $\\varepsilon = 1$</caption><thead><tr><th>true $y$</th><th class="num">error $|y - f(x)|$</th><th class="num">loss $L_\\varepsilon$</th><th>support vector?</th></tr></thead><tbody><tr><td class="num">5.5</td><td class="num">0.5</td><td class="num">0</td><td>no (inside)</td></tr><tr><td class="num">6.0</td><td class="num">1.0</td><td class="num">0</td><td>no (on edge)</td></tr><tr><td class="num">7.5</td><td class="num">2.5</td><td class="num">1.5</td><td>yes (outside)</td></tr></tbody></table>
     <ul class="steps">
       <li>$y = 5.5$: error $= |5.5 - 5| = 0.5$. Since $0.5 &lt; 1$ it is inside; $L_\\varepsilon = \\max(0,\\ 0.5 - 1) = 0$.</li>
       <li>$y = 6.0$: error $= 1.0$, exactly at the edge; $L_\\varepsilon = \\max(0,\\ 1.0 - 1) = 0$.</li>
       <li>$y = 7.5$: error $= 2.5$, outside; $L_\\varepsilon = \\max(0,\\ 2.5 - 1) = 1.5$. A support vector that pulls on the fit.</li>
       <li>Only the third point pays — the first two are absorbed by the tube.</li>
     </ul>`,
  application:
    `<p>SVR forecasts stock prices, electricity demand, and sensor readings where small jitter should be ignored but real trends tracked. The $\\varepsilon$-tube gives a built-in tolerance band, making it sturdier than least squares on noisy time series.</p>`,
  whenToUse:
    `<p><b>Reach for Support Vector Regression (SVR) on small-to-medium datasets</b> where you want a robust, nonlinear fit and a built-in tolerance for small noise. The $\\varepsilon$-tube ignores tiny jitter, and the kernel trick lets it bend without you hand-engineering features — a strong choice when rows number in the thousands, not millions.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>Ordinary least squares</b> — when noise is heavy and you want the model to forgive small errors instead of chasing every wobble.</li>
       <li><b>A neural network</b> — when data is limited; SVR generalizes well from few examples and has fewer knobs.</li>
       <li><b>Plain linear or polynomial regression</b> — when the relationship is nonlinear and an RBF (Radial Basis Function) kernel captures it cleanly.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The dataset is large — kernel SVR scales between quadratically and cubically in the number of rows and becomes infeasible; use gradient-boosted trees or a linear model instead.</li>
       <li>You need feature importance or an interpretable model — a tree or linear model is clearer; kernel SVR is a black box.</li>
       <li>Features are mixed-type tabular with interactions — gradient boosting usually wins with less tuning.</li>
     </ul>
     <p><b>In practice:</b> scikit-learn's <code>SVR</code> (RBF kernel) for nonlinear fits; <code>LinearSVR</code> when the relationship is linear and the data is larger.</p>`,
  pitfalls:
    `<ul>
       <li><b>You must scale the features.</b> The RBF (Radial Basis Function) kernel and the margin depend on distances, so unscaled features let the largest-range column dominate. Standardize inputs (and often the target) first.</li>
       <li><b>Three coupled hyperparameters.</b> $C$, $\\varepsilon$, and the kernel width $\\gamma$ interact strongly — bigger $C$ fits harder, bigger $\\varepsilon$ widens the free tube, bigger $\\gamma$ makes the fit wigglier. Tune them jointly with cross-validation, not one at a time.</li>
       <li><b>It scales badly.</b> Training cost grows fast with the number of rows, so kernel SVR chokes on large data. Subsample, switch to <code>LinearSVR</code>, or pick another model.</li>
       <li><b>$\\varepsilon$ is in the target's units.</b> Set it relative to the noise level you want to forgive; too large and the model underfits, too small and it chases noise like least squares.</li>
       <li><b>Time-series leakage.</b> Forecasting needs a forward-chaining split, not random K-fold CV (Cross-Validation), or the reported error is optimistic.</li>
       <li><b>No native uncertainty.</b> SVR outputs a point prediction with no error bar; wrap it (e.g. quantile or conformal methods) if you need intervals.</li>
     </ul>`,
  quiz: {
    q: `With $\\varepsilon = 0.5$, a point has error $|y - f(x)| = 2$. What is its $\\varepsilon$-insensitive loss, and is it a support vector?`,
    a: `<p>$L_\\varepsilon = \\max(0,\\ 2 - 0.5) = 1.5$. It is outside the tube, so it is a support vector and influences the fit.</p>`
  },
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var slope=0.8, intercept=1.0;
    var pts = [
      {x:0.5,y:1.6},{x:1.0,y:1.5},{x:1.5,y:2.4},{x:2.0,y:2.3},{x:2.5,y:3.6},
      {x:3.0,y:3.2},{x:3.5,y:4.6},{x:4.0,y:3.9},{x:4.5,y:5.3},{x:5.0,y:4.7},
      {x:2.2,y:5.2},{x:3.7,y:1.4}
    ];
    var eps = 0.7;
    var xmin=0,xmax=6,ymin=0,ymax=7, padL=40,padR=20,padT=20,padB=30, W=640,H=320;
    function PX(x){return padL+(x-xmin)/(xmax-xmin)*(W-padL-padR);}
    function PY(y){return (H-padB)-(y-ymin)/(ymax-ymin)*(H-padT-padB);}
    function f(x){return slope*x+intercept;}
    function draw(){
      var c=C(); ctx.clearRect(0,0,W,H);
      ctx.fillStyle = (/^#[0-9a-fA-F]{6}$/.test(c.accent)? c.accent+"22" : c.accent);
      ctx.beginPath();
      ctx.moveTo(PX(xmin), PY(f(xmin)+eps));
      ctx.lineTo(PX(xmax), PY(f(xmax)+eps));
      ctx.lineTo(PX(xmax), PY(f(xmax)-eps));
      ctx.lineTo(PX(xmin), PY(f(xmin)-eps));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle=c.dim; ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
      ctx.beginPath(); ctx.moveTo(PX(xmin),PY(f(xmin)+eps)); ctx.lineTo(PX(xmax),PY(f(xmax)+eps)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PX(xmin),PY(f(xmin)-eps)); ctx.lineTo(PX(xmax),PY(f(xmax)-eps)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle=c.warn; ctx.lineWidth=2.5; ctx.beginPath();
      ctx.moveTo(PX(xmin),PY(f(xmin))); ctx.lineTo(PX(xmax),PY(f(xmax))); ctx.stroke();
      var sv=0;
      for (var i=0;i<pts.length;i++){var p=pts[i]; var err=Math.abs(p.y-f(p.x)); var out=err>eps+1e-9;
        if (out) sv++;
        ctx.fillStyle = out? c.warn : c.accent2;
        ctx.beginPath(); ctx.arc(PX(p.x),PY(p.y), 5, 0, Math.PI*2); ctx.fill();
        if (out){ ctx.strokeStyle=c.warn; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(PX(p.x),PY(p.y),9,0,Math.PI*2); ctx.stroke(); }
      }
      ctx.fillStyle=c.dim; ctx.font="12px sans-serif"; ctx.textAlign="left";
      ctx.fillText("ε = "+eps.toFixed(2)+" tube. Ringed points (outside) are support vectors: "+sv, padL, padT+4);
    }
    var row=document.createElement("div"); row.style.margin="6px 0";
    var lab=document.createElement("label"); lab.style.display="block"; lab.textContent="tube width ε ";
    var span=document.createElement("span"); span.className="out"; span.style.marginLeft="6px"; span.textContent=eps.toFixed(2); lab.appendChild(span);
    var inp=document.createElement("input"); inp.setAttribute("type","range"); inp.min=0.1; inp.max=2.5; inp.step=0.05; inp.value=eps;
    inp.addEventListener("input",function(){eps=parseFloat(inp.value); span.textContent=eps.toFixed(2); draw();});
    row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
    draw();
  }
});

/* ---------------------------------------------------------------- */
L({
  id: "cls-bandits",
  title: "Multi-armed bandits",
  tagline: "Try arms to learn, but keep pulling the winner. Explore vs exploit.",
  prereqs: ["ml-knn"],
  bigIdea:
    `<p>A <b>multi-armed bandit</b> is a row of slot machines (arms), each with an unknown payout.</p>
     <p>Every pull gives a reward and a clue about that arm.</p>
     <p>You face a tension: <b>exploit</b> the best-looking arm, or <b>explore</b> others that might be better.</p>
     <p>Good strategies balance the two so you do not get stuck on a false favorite.</p>`,
  buildup:
    `<p>The simplest rule is <b>$\\varepsilon$-greedy</b>: usually pull the best-so-far arm, but with small chance $\\varepsilon$ pull a random one.</p>
     <p>A smarter rule is <b>UCB</b> (Upper Confidence Bound). It adds an "optimism bonus" to arms you have tried less.</p>
     <p>The bonus shrinks as an arm is pulled more, so uncertainty fades with evidence.</p>
     <p>UCB then simply pulls the arm with the highest optimistic estimate.</p>`,
  symbols: [
    { sym: "$\\bar{x}_i$", desc: "the average reward seen so far from arm $i$ (its current estimate)." },
    { sym: "$n_i$", desc: "how many times arm $i$ has been pulled." },
    { sym: "$t$", desc: "the total number of pulls so far across all arms (the round number)." },
    { sym: "$\\sqrt{\\frac{2\\ln t}{n_i}}$", desc: "the exploration bonus: big when arm $i$ is under-tried (small $n_i$), shrinking as $n_i$ grows." },
    { sym: "$\\varepsilon$", desc: "for $\\varepsilon$-greedy: the small probability of pulling a random arm instead of the best one." }
  ],
  formula: `$$ \\text{UCB}_i = \\bar{x}_i + \\sqrt{\\frac{2\\ln t}{n_i}}, \\qquad \\text{pull } \\arg\\max_i\\ \\text{UCB}_i $$`,
  whatItDoes:
    `<p>For each arm, take its average reward $\\bar{x}_i$ and add a bonus that rewards uncertainty.</p>
     <p>An arm tried only twice gets a big bonus; an arm tried a thousand times gets almost none.</p>
     <p>Pull whichever arm has the highest total. Update its average and count, then repeat.</p>
     <p>Early on the bonus dominates, so every arm gets sampled. Later the averages dominate, so the true best arm wins out.</p>`,
  derivation:
    `<p><b>Where the bonus $\\sqrt{2\\ln t / n_i}$ comes from.</b></p>
     <p>The average $\\bar{x}_i$ is an estimate from $n_i$ samples, so it has error. Pull an arm only a few times and your estimate of its payout could be way off; pull it many times and it settles down. We want a bound that says "the true payout is almost surely no more than <i>this</i>", and we want that "almost surely" to hold tighter as we collect more data.</p>
     <p>The tool for that is <b>Hoeffding's inequality</b> — a standard result that bounds how far a sample average can stray from the true average. In words: with more samples ($n_i$), the chance of a big gap $u$ shrinks fast (exponentially). We use it to size the optimism bonus $u$ so it is just big enough to cover the likely error.</p>
     <ul class="steps">
       <li>Hoeffding's inequality says: for $n_i$ samples of a bounded reward, the true mean exceeds $\\bar{x}_i + u$ with probability at most $e^{-2 n_i u^2}$. (More pulls $n_i$ or a wider gap $u$ both make this failure chance tiny.)</li>
       <li>We want that failure probability to fall like $t^{-4}$ as the game goes on, so set $e^{-2 n_i u^2} = t^{-4}$.</li>
       <li>Take logs: $-2 n_i u^2 = -4\\ln t$, so $u^2 = \\dfrac{2\\ln t}{n_i}$, giving $u = \\sqrt{\\dfrac{2\\ln t}{n_i}}$.</li>
       <li>So $\\bar{x}_i + \\sqrt{2\\ln t / n_i}$ is a high-confidence upper bound on the arm's true value. Pulling the largest such bound is "optimism in the face of uncertainty". ∎</li>
     </ul>
     <p><b>Intuition.</b> Give every arm the benefit of the doubt, sized by how little you know about it. Pulling the most-promising-it-could-be arm either pays off or teaches you fast.</p>`,
  example:
    `<p>Three arms after $t = 10$ total pulls. $\\ln 10 \\approx 2.303$, so $2\\ln t \\approx 4.6$. Each arm's score is $\\text{UCB}_i = \\bar{x}_i + \\sqrt{2\\ln t / n_i}$.</p>
     <table class="extable"><caption>UCB scores at $t = 10$ ($2\\ln t \\approx 4.6$)</caption><thead><tr><th>arm</th><th class="num">$\\bar{x}_i$</th><th class="num">$n_i$</th><th class="num">bonus $\\sqrt{4.6/n_i}$</th><th class="num">UCB</th></tr></thead><tbody><tr><td class="row-h">A</td><td class="num">0.6</td><td class="num">6</td><td class="num">0.876</td><td class="num">1.476</td></tr><tr><td class="row-h">B</td><td class="num">0.5</td><td class="num">3</td><td class="num">1.238</td><td class="num">1.738</td></tr><tr><td class="row-h">C</td><td class="num">0.7</td><td class="num">1</td><td class="num">2.145</td><td class="num">2.845</td></tr></tbody></table>
     <ul class="steps">
       <li>Arm A: bonus $= \\sqrt{4.6 / 6} = \\sqrt{0.767} \\approx 0.876$, so UCB $= 0.6 + 0.876 \\approx 1.476$.</li>
       <li>Arm B: bonus $= \\sqrt{4.6 / 3} = \\sqrt{1.533} \\approx 1.238$, so UCB $= 0.5 + 1.238 \\approx 1.738$.</li>
       <li>Arm C: bonus $= \\sqrt{4.6 / 1} = \\sqrt{4.6} \\approx 2.145$, so UCB $= 0.7 + 2.145 \\approx 2.845$.</li>
       <li>$\\arg\\max$ picks Arm C, even though it was pulled only once — its huge uncertainty bonus says "worth another look".</li>
     </ul>`,
  application:
    `<p>Bandits power A/B testing that adapts in real time, news and ad selection, clinical-trial dosing, and recommendation cold-starts. Wherever you must keep earning while still learning, a bandit beats a fixed split-test.</p>`,
  whenToUse:
    `<p><b>Reach for a multi-armed bandit when you must keep earning reward while still learning</b> which option is best — and feedback arrives one decision at a time. It fits online choices with a handful of options: which headline, ad, layout, or treatment to serve, where a fixed split-test would waste traffic on losers.</p>
     <p><b>Choose it over:</b></p>
     <ul>
       <li><b>A classic A/B test</b> — when the cost of showing the worse option is real; a bandit shifts traffic to the winner as evidence accrues instead of waiting for the test to end.</li>
       <li><b>UCB (Upper Confidence Bound) vs $\\varepsilon$-greedy</b> — UCB explores smartly (proportional to uncertainty), while $\\varepsilon$-greedy explores blindly; Thompson sampling often beats both in practice and handles delayed feedback gracefully.</li>
     </ul>
     <p><b>Pick a different tool when:</b></p>
     <ul>
       <li>The best option depends on <i>context</i> (the user, the time) — use a <b>contextual bandit</b>, which conditions the choice on features.</li>
       <li>Actions change future state and reward (sequential planning) — use full reinforcement learning, not a bandit.</li>
       <li>You need a rigorous, fixed-horizon statistical conclusion for a one-time decision — a classic controlled experiment is cleaner.</li>
     </ul>
     <p><b>In practice:</b> <code>Vowpal Wabbit</code> for contextual bandits at scale; a Beta-Bernoulli Thompson sampler is a few lines for binary rewards.</p>`,
  pitfalls:
    `<ul>
       <li><b>UCB assumes bounded, stationary rewards.</b> The $\\sqrt{2\\ln t / n_i}$ bonus is derived for rewards in a known range that do not drift. If the environment changes, use a discounted or sliding-window variant so old data does not anchor the estimates.</li>
       <li><b>Delayed feedback corrupts the counts.</b> If rewards arrive late (a purchase hours after the click), the algorithm pulls based on stale averages and over-explores. Account for in-flight pulls or use Thompson sampling, which tolerates delay better.</li>
       <li><b>Non-stationarity defeats the simple rule.</b> A formerly bad arm can become the best one. Plain UCB locks onto the historical favorite; add decay or periodic forced exploration.</li>
       <li><b>Reward scaling matters.</b> The exploration bonus is on the reward's scale, so an unscaled or wrongly-bounded reward makes the model explore far too much or too little. Normalize rewards into a known range.</li>
       <li><b>Tiny effect sizes need huge traffic.</b> Separating arms that differ by a fraction of a percent takes enormous sample sizes; estimate the volume you need before launching.</li>
       <li><b>It optimizes the chosen reward exactly.</b> Reward clicks and you may get clickbait. Define the metric to match the real business goal, and watch guardrail metrics for unintended effects.</li>
     </ul>`,
  quiz: {
    q: `At $t = 10$ ($2\\ln t \\approx 4.6$), arm X has $\\bar{x} = 0.8$ with $n = 4$. What is its UCB score?`,
    a: `<p>Bonus $= \\sqrt{4.6 / 4} = \\sqrt{1.15} \\approx 1.07$. UCB $= 0.8 + 1.07 = 1.87$.</p>`
  },
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    function C(){var s=getComputedStyle(document.documentElement);var g=function(n,d){return (s.getPropertyValue(n)||d).trim();};
      return {ink:g("--ink","#e6edf3"),dim:g("--ink-dim","#9aa7b4"),accent:g("--accent","#4ea1ff"),accent2:g("--accent-2","#7ee787"),warn:g("--warn","#ffb454"),purple:g("--purple","#c89bff"),border:g("--border","#2a3340"),panel:g("--panel","#161c24")};}
    var trueP = [0.3, 0.55, 0.7];
    var names = ["Arm A","Arm B","Arm C"];
    var sum = [0,0,0], n = [0,0,0], t = 0;
    var seed = 99; function rnd(){ seed = (seed*1103515245 + 12345) & 0x7fffffff; return seed/0x7fffffff; }
    function initPulls(){ for (var i=0;i<3;i++){ var r = rnd()<trueP[i]?1:0; sum[i]+=r; n[i]+=1; t+=1; } }
    initPulls();
    function mean(i){ return n[i]>0 ? sum[i]/n[i] : 0; }
    function ucb(i){ return n[i]>0 ? mean(i) + Math.sqrt(2*Math.log(Math.max(t,2))/n[i]) : 999; }
    function bestUCB(){ var b=0; for (var i=1;i<3;i++) if (ucb(i)>ucb(b)) b=i; return b; }
    function draw(){
      var c=C(); ctx.clearRect(0,0,cv.width,cv.height);
      var pick = bestUCB();
      var bw=150, gap=(640-3*bw)/4, by=60, bh=170;
      for (var i=0;i<3;i++){
        var bx = gap + i*(bw+gap);
        var chosen = (i===pick);
        ctx.fillStyle=c.panel; ctx.strokeStyle = chosen? c.accent2 : c.border; ctx.lineWidth = chosen?3:1.5;
        ctx.beginPath(); ctx.rect(bx,by,bw,bh); ctx.fill(); ctx.stroke();
        ctx.textAlign="center"; ctx.textBaseline="alphabetic";
        ctx.fillStyle=c.ink; ctx.font="14px sans-serif"; ctx.fillText(names[i], bx+bw/2, by+26);
        ctx.fillStyle=c.accent; ctx.font="13px sans-serif";
        ctx.fillText("avg x̄ = "+mean(i).toFixed(2), bx+bw/2, by+58);
        ctx.fillStyle=c.dim;
        ctx.fillText("pulls n = "+n[i], bx+bw/2, by+82);
        ctx.fillStyle=c.warn;
        ctx.fillText("UCB = "+ucb(i).toFixed(2), bx+bw/2, by+108);
        var rb = mean(i)*(bw-20);
        ctx.fillStyle=c.accent2; ctx.fillRect(bx+10, by+128, rb, 14);
        ctx.strokeStyle=c.border; ctx.strokeRect(bx+10, by+128, bw-20, 14);
        if (chosen){ ctx.fillStyle=c.accent2; ctx.font="12px sans-serif"; ctx.fillText("← UCB picks this", bx+bw/2, by+bh-10); }
      }
      ctx.fillStyle=c.dim; ctx.font="12px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Round t = "+t+". UCB pulls the arm with the best optimistic estimate (x̄ + bonus).", 320, 30);
    }
    function pull(){
      var i = bestUCB();
      var r = rnd() < trueP[i] ? 1 : 0;
      sum[i]+=r; n[i]+=1; t+=1; draw();
    }
    function reset(){ seed = 99; sum = [0,0,0]; n = [0,0,0]; t = 0; initPulls(); draw(); }
    var BTN = "margin:8px 8px 8px 0;padding:6px 14px;background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:13px";
    var btn=document.createElement("button"); btn.textContent="Pull best arm"; btn.style.cssText=BTN;
    btn.addEventListener("click", pull); host.appendChild(btn);
    var btn20=document.createElement("button"); btn20.textContent="Pull ×20"; btn20.style.cssText=BTN;
    btn20.addEventListener("click", function(){ for (var k=0;k<20;k++) pull(); }); host.appendChild(btn20);
    var btnR=document.createElement("button"); btnR.textContent="↺ Reset"; btnR.style.cssText=BTN;
    btnR.addEventListener("click", reset); host.appendChild(btnR);
    draw();
  }
});

})();
