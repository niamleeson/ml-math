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
const M = "Classical ML (beyond the cheat sheet)";
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
     <p>To avoid cheating, the base predictions used to train $g$ come from held-out folds (out-of-fold predictions), not from data the base models already memorized.</p>`,
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
    `<p>Three base models predict a house price (in \\$k). The truth is $y = 300$.</p>
     <ul class="steps">
       <li>Tree predicts $z_1 = 310$. Linear predicts $z_2 = 290$. kNN predicts $z_3 = 330$.</li>
       <li>A meta-model learned the weights $w = (0.5,\\ 0.4,\\ 0.1)$ on past data (it trusts the tree and linear model most).</li>
       <li>Combine: $\\hat{y} = 0.5{\\cdot}310 + 0.4{\\cdot}290 + 0.1{\\cdot}330 = 155 + 116 + 33 = 304$.</li>
       <li>A plain average would give $(310 + 290 + 330)/3 = 310$ — further from the true $300$ than the learned $304$.</li>
     </ul>`,
  application:
    `<p>Stacking wins Kaggle competitions and powers production ranking systems. Netflix's famous \\$1M prize was won by a stacked blend of many models. Anywhere a single model plateaus, stacking a few diverse models squeezes out extra accuracy.</p>`,
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
     <p>If $x$ is easy to isolate, $E[h(x)]$ is small, the exponent is near 0, and $s(x)$ is near $2^0 = 1$: an anomaly.</p>
     <p>If $x$ is buried in a crowd, $E[h(x)]$ is large, the exponent is very negative, and $s(x)$ drops toward 0: normal.</p>
     <p>The score is bounded in $(0,1)$, so a single threshold (say $0.6$) flags outliers.</p>`,
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
    `<p>A forest of trees is built. A normal point and an outlier are scored. Suppose $c(n) = 4$ (the typical depth).</p>
     <ul class="steps">
       <li>Normal point: average path length $E[h] = 5$. Exponent $= -5/4 = -1.25$. Score $s = 2^{-1.25} \\approx 0.42$. Below threshold — normal.</li>
       <li>Outlier: average path length $E[h] = 1.5$. Exponent $= -1.5/4 = -0.375$. Score $s = 2^{-0.375} \\approx 0.77$. Above threshold — flag it red.</li>
       <li>The outlier was isolated in just $1.5$ cuts on average; the normal point needed $5$.</li>
     </ul>`,
  application:
    `<p>Isolation Forests catch credit-card fraud, server intrusions, and faulty sensors. They are fast (linear time), need no labels, and handle high-dimensional data — the default tool when you must find "the weird ones" without knowing in advance what weird looks like.</p>`,
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
    `<p>The full ratings matrix $R$ is huge but mostly empty. We assume it is secretly low-rank.</p>
     <p>"Low-rank" means it can be rebuilt from a few hidden dimensions — like "amount of comedy", "amount of action".</p>
     <p>Factor $R$ into a tall user matrix $U$ and a tall item matrix $V$. Each has only $k$ columns.</p>
     <p>Then $R \\approx U V^\\top$. We learn $U$ and $V$ from the ratings we <i>do</i> have.</p>`,
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
    `<p>Two factors: [comedy, action]. We predict whether user Ann likes the movie "Hot Fuzz".</p>
     <ul class="steps">
       <li>Ann's factor row: $u_{\\text{Ann}} = [0.9,\\ 0.2]$ (loves comedy, mild on action).</li>
       <li>Hot Fuzz's factor row: $v_{\\text{HF}} = [0.8,\\ 0.6]$ (very funny, fairly action-packed).</li>
       <li>Dot product: $\\hat{R} = 0.9{\\times}0.8 + 0.2{\\times}0.6 = 0.72 + 0.12 = 0.84$.</li>
       <li>On a 0–1 scale that is a high predicted rating, so the system recommends Hot Fuzz to Ann.</li>
     </ul>`,
  application:
    `<p>This is the engine behind Netflix, Spotify, Amazon, and YouTube recommendations. From a sparse log of "who watched/bought/liked what", matrix factorization fills in the rest and surfaces items you have not seen but probably want.</p>`,
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
  title: "t-SNE / UMAP",
  tagline: "Squash high-dimensional data to 2-D while keeping neighbors together.",
  prereqs: ["ml-pca", "ml-knn"],
  bigIdea:
    `<p><b>t-SNE</b> and <b>UMAP</b> are tools for <i>seeing</i> high-dimensional data on a flat screen.</p>
     <p>They place each point in 2-D so that points close in the original space stay close on the map.</p>
     <p>Unlike PCA, they can bend and curve — they capture nonlinear structure.</p>
     <p>The payoff: hidden clusters pop out as visible blobs.</p>`,
  buildup:
    `<p>PCA keeps the directions of biggest spread, but flattens curved structure.</p>
     <p>t-SNE instead cares only about <i>neighborhoods</i>. It turns distances into probabilities of "being neighbors".</p>
     <p>It builds these neighbor-probabilities in the high-D space ($p$) and in the 2-D map ($q$).</p>
     <p>Then it nudges the 2-D points until $q$ matches $p$ as closely as possible.</p>`,
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
    `<p>Two map points are at distance $d = 1$; another pair at $d = 3$. Compute the (unnormalized) map affinity $(1+d^2)^{-1}$.</p>
     <ul class="steps">
       <li>Close pair, $d = 1$: $(1 + 1^2)^{-1} = 1/2 = 0.50$. High affinity — they read as neighbors.</li>
       <li>Far pair, $d = 3$: $(1 + 3^2)^{-1} = 1/10 = 0.10$. Lower affinity — different clusters.</li>
       <li>The ratio $0.50 / 0.10 = 5$: the close pair is five times more "neighborly", so the layout keeps it tight and the far pair loose.</li>
     </ul>`,
  application:
    `<p>t-SNE and UMAP are everywhere in exploratory data analysis: visualizing word embeddings, single-cell RNA data (cell types appear as islands), and the hidden layers of neural nets. They turn a 50- or 500-dimensional dataset into a picture you can actually read.</p>`,
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
    `<p>Imagine ten test scores per student. They are correlated — a strong student does well across the board.</p>
     <p>Maybe one hidden factor, "general ability", explains most of that correlation.</p>
     <p>Each test responds to ability by its own amount (its <b>loading</b>), plus a private wobble.</p>
     <p>Factor analysis finds those loadings and the hidden factors from the correlations alone.</p>`,
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
     <p>Because the noise $\\epsilon$ is modeled <i>per variable</i> (the diagonal $\\Psi$), factor analysis separates shared structure from per-signal junk — something plain PCA does not do.</p>`,
  derivation:
    `<p><b>Why this implies a specific correlation pattern.</b></p>
     <p>Center the data so $\\mu = 0$, giving $x = \\Lambda z + \\epsilon$. Find the covariance of $x$ (how its components vary together).</p>
     <ul class="steps">
       <li>Covariance is $\\mathbb{E}[x x^\\top] = \\mathbb{E}[(\\Lambda z + \\epsilon)(\\Lambda z + \\epsilon)^\\top]$.</li>
       <li>Expand. The cross terms $\\mathbb{E}[\\Lambda z\\,\\epsilon^\\top]$ vanish because factors $z$ and noise $\\epsilon$ are independent (and mean zero).</li>
       <li>Use $\\mathbb{E}[z z^\\top] = I$ (factors are standardized) and $\\mathbb{E}[\\epsilon \\epsilon^\\top] = \\Psi$ (diagonal noise).</li>
       <li>What remains is $\\text{Cov}(x) = \\Lambda \\Lambda^\\top + \\Psi$. The shared correlations live entirely in the low-rank part $\\Lambda \\Lambda^\\top$; $\\Psi$ only adds to the diagonal. Fitting the model means choosing $\\Lambda$ and $\\Psi$ so this matches the observed covariance. ∎</li>
     </ul>
     <p><b>Intuition.</b> Correlation <i>between</i> different signals can only come from shared factors, so it must be carried by $\\Lambda\\Lambda^\\top$. Each signal's own private variance is the diagonal $\\Psi$. The model cleanly splits the two.</p>`,
  example:
    `<p>One hidden factor "general ability" $z$. Three test scores load on it: $\\Lambda = [2,\\ 1.5,\\ 1]^\\top$, with baselines $\\mu = [70,\\ 60,\\ 80]$.</p>
     <ul class="steps">
       <li>A strong student has $z = +1.5$ (1.5 standard deviations above average).</li>
       <li>Test 1: $2{\\times}1.5 + 70 = 3 + 70 = 73$ (plus small noise).</li>
       <li>Test 2: $1.5{\\times}1.5 + 60 = 2.25 + 60 = 62.25$.</li>
       <li>Test 3: $1{\\times}1.5 + 80 = 1.5 + 80 = 81.5$.</li>
       <li>One hidden number $z$ moved all three scores up together — that is the shared factor at work.</li>
     </ul>`,
  application:
    `<p>Factor analysis was born in psychology (the "g" factor of intelligence) and is a staple in finance (a few market factors drive many stock returns), marketing (survey questions reduce to a few attitudes), and any field drowning in correlated measurements.</p>`,
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
     <p>The term $\\tfrac12\\|w\\|^2$ keeps the function as flat as possible; $C$ trades flatness against fitting the outside points.</p>
     <p>The solution depends only on the support vectors (the outside points), so SVR is robust to the many points sitting comfortably inside.</p>`,
  derivation:
    `<p><b>Why only the support vectors matter.</b></p>
     <p>The fit minimizes $\\tfrac12\\|w\\|^2 + C\\sum_i L_\\varepsilon$. Look at how each point pulls on the weights via the gradient.</p>
     <ul class="steps">
       <li>For a point <i>inside</i> the tube, $|y_i - f(x_i)| < \\varepsilon$, so $L_\\varepsilon = 0$ — flat. Its gradient contribution is $0$. It exerts no force on $w$.</li>
       <li>For a point <i>outside</i>, $L_\\varepsilon = |y_i - f(x_i)| - \\varepsilon$, whose slope is $\\pm 1$. It pushes $w$ with a fixed-size force, in the direction that pulls the line toward it.</li>
       <li>So the optimal $w$ is determined entirely by the outside points balancing against the flatness term. Inside points could be deleted without changing the answer.</li>
       <li>Those decisive outside points are the support vectors — the regression literally rests on them. ∎</li>
     </ul>
     <p><b>Intuition.</b> If a point is already "close enough", nudging the line does not help it and does not hurt it — so it stays silent. Only the points the line fails to cover get a vote.</p>`,
  example:
    `<p>Tube half-width $\\varepsilon = 1$. The fitted line predicts $f(x) = 5$ at some $x$. Score three points there.</p>
     <ul class="steps">
       <li>True $y = 5.5$: error $= |5.5 - 5| = 0.5$. Since $0.5 < 1$, it is inside the tube. Loss $= \\max(0,\\ 0.5 - 1) = 0$.</li>
       <li>True $y = 6.0$: error $= 1.0$. Exactly at the edge. Loss $= \\max(0,\\ 1.0 - 1) = 0$.</li>
       <li>True $y = 7.5$: error $= 2.5$. Outside. Loss $= \\max(0,\\ 2.5 - 1) = 1.5$. This point is a support vector and pulls on the fit.</li>
       <li>Only the third point pays — the first two are absorbed by the tube.</li>
     </ul>`,
  application:
    `<p>SVR forecasts stock prices, electricity demand, and sensor readings where small jitter should be ignored but real trends tracked. The $\\varepsilon$-tube gives a built-in tolerance band, making it sturdier than least squares on noisy time series.</p>`,
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
     <p>The average $\\bar{x}_i$ is an estimate from $n_i$ samples, so it has error. We want a bound that is true with high probability.</p>
     <ul class="steps">
       <li>Hoeffding's inequality says: for $n_i$ samples of a bounded reward, the true mean exceeds $\\bar{x}_i + u$ with probability at most $e^{-2 n_i u^2}$.</li>
       <li>We want that failure probability to fall like $t^{-4}$ as the game goes on, so set $e^{-2 n_i u^2} = t^{-4}$.</li>
       <li>Take logs: $-2 n_i u^2 = -4\\ln t$, so $u^2 = \\dfrac{2\\ln t}{n_i}$, giving $u = \\sqrt{\\dfrac{2\\ln t}{n_i}}$.</li>
       <li>So $\\bar{x}_i + \\sqrt{2\\ln t / n_i}$ is a high-confidence upper bound on the arm's true value. Pulling the largest such bound is "optimism in the face of uncertainty". ∎</li>
     </ul>
     <p><b>Intuition.</b> Give every arm the benefit of the doubt, sized by how little you know about it. Pulling the most-promising-it-could-be arm either pays off or teaches you fast.</p>`,
  example:
    `<p>Three arms after $t = 10$ total pulls. $\\ln 10 \\approx 2.303$, so $2\\ln t \\approx 4.6$.</p>
     <ul class="steps">
       <li>Arm A: $\\bar{x} = 0.6$, $n = 6$. Bonus $= \\sqrt{4.6 / 6} = \\sqrt{0.767} \\approx 0.876$. UCB $\\approx 1.476$.</li>
       <li>Arm B: $\\bar{x} = 0.5$, $n = 3$. Bonus $= \\sqrt{4.6 / 3} = \\sqrt{1.533} \\approx 1.238$. UCB $\\approx 1.738$.</li>
       <li>Arm C: $\\bar{x} = 0.7$, $n = 1$. Bonus $= \\sqrt{4.6 / 1} = \\sqrt{4.6} \\approx 2.145$. UCB $\\approx 2.845$.</li>
       <li>Arm C wins, even though it was pulled only once — its huge uncertainty bonus says "worth another look".</li>
     </ul>`,
  application:
    `<p>Bandits power A/B testing that adapts in real time, news and ad selection, clinical-trial dosing, and recommendation cold-starts. Wherever you must keep earning while still learning, a bandit beats a fixed split-test.</p>`,
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
