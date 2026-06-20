/* =====================================================================
   MODULE 09 (A) — CLASSICAL ML (beyond the cheat sheet).
   Style copied from 00-foundations.js / 02-ml.js:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
     - bespoke canvas demos that render on load, never feed NaN to ctx
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Classical ML (beyond the cheat sheet)";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

var BTN = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
function theme() {
  var s = getComputedStyle(document.documentElement);
  var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
  return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
}

/* ================================================================ */
/* 1. Gaussian Mixture Models                                       */
/* ================================================================ */
L({
  id: "cls-gmm",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    // two true clusters of 2-D points
    var pts = [];
    var seed = 12345; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function gauss() { var u = rnd() || 1e-6, v = rnd() || 1e-6; return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    for (var i = 0; i < 40; i++) pts.push({ x: -2 + 1.1 * gauss(), y: 1 + 1.0 * gauss() });
    for (var j = 0; j < 40; j++) pts.push({ x: 3 + 1.0 * gauss(), y: -1 + 1.1 * gauss() });

    // two Gaussian components (means + isotropic variance), deliberately started off-target
    var comp = [
      { mx: -3.5, my: 3.0, v: 2.5, pi: 0.5 },
      { mx: 2.0, my: 1.5, v: 2.5, pi: 0.5 }
    ];
    var iter = 0;

    function N(p, c) { var dx = p.x - c.mx, dy = p.y - c.my; return Math.exp(-(dx * dx + dy * dy) / (2 * c.v)) / (2 * Math.PI * c.v); }

    function estep() {
      // responsibility of component 0 for each point
      return pts.map(function (p) {
        var a = comp[0].pi * N(p, comp[0]), b = comp[1].pi * N(p, comp[1]);
        var s = a + b; if (s < 1e-300) s = 1e-300;
        return a / s;
      });
    }
    function mstep(R) {
      for (var k = 0; k < 2; k++) {
        var w = 0, sx = 0, sy = 0;
        for (var n = 0; n < pts.length; n++) { var r = k === 0 ? R[n] : 1 - R[n]; w += r; sx += r * pts[n].x; sy += r * pts[n].y; }
        if (w < 1e-9) w = 1e-9;
        comp[k].mx = sx / w; comp[k].my = sy / w;
        var sv = 0;
        for (var m = 0; m < pts.length; m++) { var r2 = k === 0 ? R[m] : 1 - R[m]; var dx = pts[m].x - comp[k].mx, dy = pts[m].y - comp[k].my; sv += r2 * (dx * dx + dy * dy); }
        comp[k].v = Math.max(0.15, sv / (2 * w));
        comp[k].pi = w / pts.length;
      }
    }

    var xmin = -7, xmax = 7, ymin = -5, ymax = 6, W = 640, H = 360, padL = 36, padR = 16, padT = 16, padB = 30;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function mix(a, b, t) {
      function hex(c) { c = c.replace("#", ""); if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2]; return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
      var A = hex(a), B = hex(b);
      var r = Math.round(A[0] + (B[0] - A[0]) * t), g = Math.round(A[1] + (B[1] - A[1]) * t), bl = Math.round(A[2] + (B[2] - A[2]) * t);
      return "rgb(" + r + "," + g + "," + bl + ")";
    }

    function draw() {
      var c = theme(); ctx.clearRect(0, 0, W, H);
      var R = estep();
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
      // points colored by soft responsibility (blend blue<->green)
      for (var n = 0; n < pts.length; n++) {
        ctx.fillStyle = mix(c.accent, c.accent2, R[n]);
        ctx.beginPath(); ctx.arc(PX(pts[n].x), PY(pts[n].y), 4, 0, Math.PI * 2); ctx.fill();
      }
      // component ellipses: circle of radius 2*sigma (isotropic)
      var colsC = [c.accent, c.accent2];
      for (var k = 0; k < 2; k++) {
        var sig = Math.sqrt(comp[k].v);
        ctx.strokeStyle = colsC[k]; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
        ctx.beginPath();
        for (var t = 0; t <= 48; t++) { var a = t / 48 * Math.PI * 2; var X = PX(comp[k].mx + 2 * sig * Math.cos(a)); var Y = PY(comp[k].my + 2 * sig * Math.sin(a)); if (t === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
        ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = colsC[k]; ctx.beginPath(); ctx.arc(PX(comp[k].mx), PY(comp[k].my), 5, 0, Math.PI * 2); ctx.fill();
      }
      readout.innerHTML = "Two Gaussians (dashed ovals at the ±2σ ring). Each point is colored by its <b>responsibility</b> — how blue/green it belongs. EM iterations run: <b>" + iter + "</b>. π = (" + comp[0].pi.toFixed(2) + ", " + comp[1].pi.toFixed(2) + "). Press Step to run one E + M update; watch the ovals snap onto the two clouds.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var step = document.createElement("button"); step.style.cssText = BTN; step.textContent = "Step (one EM iteration) ▸";
    var reset = document.createElement("button"); reset.style.cssText = BTN; reset.textContent = "Reset";
    step.addEventListener("click", function () { var R = estep(); mstep(R); iter++; draw(); });
    reset.addEventListener("click", function () { comp[0] = { mx: -3.5, my: 3.0, v: 2.5, pi: 0.5 }; comp[1] = { mx: 2.0, my: 1.5, v: 2.5, pi: 0.5 }; iter = 0; draw(); });
    row.appendChild(step); row.appendChild(reset);
    host.appendChild(row); host.appendChild(readout);
    draw();
  },
  title: "Gaussian Mixture Models",
  tagline: "Soft clustering: each point partly belongs to several Gaussian blobs.",
  prereqs: ["ml-kmeans", "ml-gda", "prob-normal"],
  bigIdea:
    `<p>k-means gives each point one hard label. A <b>Gaussian Mixture Model</b> (GMM) is gentler.</p>
     <p>It says the data is a blend of several bell-shaped blobs (Gaussians).</p>
     <p>Each point gets a <i>soft</i> membership: 70% blob A, 30% blob B.</p>
     <p>We learn the blobs with an algorithm called <b>EM</b> that alternates two easy steps.</p>`,
  buildup:
    `<p>Each blob $k$ has a center $\\mu_k$, a spread $\\Sigma_k$, and a weight $\\pi_k$ (how big a slice of data it owns).</p>
     <p>The chance a point came from blob $k$ is its <b>responsibility</b> $\\gamma_k$.</p>
     <p>EM loops: guess responsibilities (E-step), then move each blob to the points it owns (M-step).</p>`,
  symbols: [
    { sym: "$x$", desc: "one data point (a vector of features)." },
    { sym: "$K$", desc: "how many Gaussian blobs (components) we use." },
    { sym: "$\\pi_k$", desc: "the mixing weight of blob $k$: the fraction of all data it owns. The $\\pi_k$ add to 1." },
    { sym: "$\\mu_k$", desc: "the center (mean) of blob $k$." },
    { sym: "$\\Sigma_k$", desc: "the covariance of blob $k$: its width and tilt (Greek capital 'sigma')." },
    { sym: "$\\mathcal{N}(x;\\mu_k,\\Sigma_k)$", desc: "the Gaussian (normal) bell value of point $x$ under blob $k$." },
    { sym: "$\\gamma_k$", desc: "the responsibility: probability that point $x$ belongs to blob $k$ (Greek 'gamma')." }
  ],
  formula: `$$ p(x)=\\sum_{k=1}^{K} \\pi_k\\, \\mathcal{N}(x;\\mu_k,\\Sigma_k) \\qquad\\quad \\gamma_k=\\frac{\\pi_k\\,\\mathcal{N}(x;\\mu_k,\\Sigma_k)}{\\sum_{j}\\pi_j\\,\\mathcal{N}(x;\\mu_j,\\Sigma_j)} $$`,
  whatItDoes:
    `<p>The left formula says: the chance of seeing a point is a weighted sum over all the blobs.</p>
     <p>The right formula is the E-step: how much each blob "claims" a given point, normalized so the claims add to 1.</p>
     <p>The M-step then re-fits each blob's center and spread as a weighted average, using those claims as weights.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>We want parameters that maximize $\\log p(\\text{data})=\\sum_i \\log\\sum_k \\pi_k \\mathcal{N}(x_i;\\mu_k,\\Sigma_k)$. The log of a sum is hard to optimize directly.</li>
       <li>Trick: pretend each point has a hidden label $z_i$ saying which blob made it. If we knew $z_i$, the log would split into easy per-blob pieces.</li>
       <li>We do not know $z_i$, so we use its expected value — exactly the responsibility $\\gamma_k=p(z=k\\mid x)$, computed by <b>Bayes' rule</b> (prior $\\pi_k$ times likelihood $\\mathcal{N}$, normalized). That is the <b>E-step</b>.</li>
       <li>With responsibilities fixed, maximizing gives a weighted maximum-likelihood fit: $\\mu_k=\\frac{\\sum_i \\gamma_{ik} x_i}{\\sum_i \\gamma_{ik}}$, and similarly for $\\Sigma_k$ and $\\pi_k$. That is the <b>M-step</b>.</li>
       <li>Each round can only raise (or hold) the data's log-likelihood, so EM climbs steadily to a local maximum. $\\blacksquare$</li>
     </ul>`,
  example:
    `<p>One feature, two blobs. Point $x=6$. Blob A: $\\mu_A=5,\\sigma_A=1,\\pi_A=0.5$. Blob B: $\\mu_B=8,\\sigma_B=1,\\pi_B=0.5$.</p>
     <ul class="steps">
       <li>Bell of A at 6: $\\mathcal{N}=\\frac{1}{\\sqrt{2\\pi}}e^{-(6-5)^2/2}=0.399\\times e^{-0.5}=0.242$.</li>
       <li>Bell of B at 6: $0.399\\times e^{-(6-8)^2/2}=0.399\\times e^{-2}=0.054$.</li>
       <li>Weighted: A $=0.5\\times0.242=0.121$, B $=0.5\\times0.054=0.027$.</li>
       <li>Responsibility of A: $\\gamma_A=\\frac{0.121}{0.121+0.027}=\\frac{0.121}{0.148}=0.82$.</li>
       <li>So $x=6$ is 82% blob A, 18% blob B — closer to A, but not 100%. That softness is the point.</li>
     </ul>`,
  application:
    `<p>GMMs model speaker voices, customer segments, and image colors. They were the backbone of speech recognition for years, and they power background subtraction in video and anomaly detection (a point with low $p(x)$ is unusual).</p>`,
  quiz: {
    q: `A point gets weighted blob scores $0.09$ for blob A and $0.03$ for blob B. What is its responsibility (membership) for blob A?`,
    a: `<p>Normalize: $\\gamma_A=\\dfrac{0.09}{0.09+0.03}=\\dfrac{0.09}{0.12}=0.75$. The point is 75% blob A, 25% blob B.</p>`
  }
});

/* ================================================================ */
/* 2. DBSCAN                                                        */
/* ================================================================ */
L({
  id: "cls-dbscan",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    // two dense blobs + scattered noise
    var pts = [];
    var seed = 999; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function gauss() { var u = rnd() || 1e-6, v = rnd() || 1e-6; return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    for (var i = 0; i < 35; i++) pts.push({ x: 2 + 0.6 * gauss(), y: 2 + 0.6 * gauss() });
    for (var j = 0; j < 35; j++) pts.push({ x: 7 + 0.6 * gauss(), y: 6 + 0.6 * gauss() });
    for (var n = 0; n < 12; n++) pts.push({ x: 1 + 8 * rnd(), y: 1 + 6 * rnd() }); // noise

    var eps = 1.0, minPts = 4;

    function dist(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return Math.sqrt(dx * dx + dy * dy); }
    function cluster() {
      var N = pts.length, label = new Array(N).fill(0); // 0 = unvisited, -1 = noise
      var neigh = function (i) { var r = []; for (var k = 0; k < N; k++) if (k !== i && dist(pts[i], pts[k]) <= eps) r.push(k); return r; };
      var cid = 0;
      for (var i = 0; i < N; i++) {
        if (label[i] !== 0) continue;
        var nb = neigh(i);
        if (nb.length + 1 < minPts) { label[i] = -1; continue; } // tentative noise (may be reclaimed)
        cid++; label[i] = cid;
        var queue = nb.slice();
        for (var q = 0; q < queue.length; q++) {
          var p = queue[q];
          if (label[p] === -1) label[p] = cid;       // border reclaimed
          if (label[p] !== 0) continue;
          label[p] = cid;
          var nb2 = neigh(p);
          if (nb2.length + 1 >= minPts) queue = queue.concat(nb2); // p is a core point: expand
        }
      }
      return label;
    }

    var xmin = 0, xmax = 10, ymin = 0, ymax = 8, W = 640, H = 360, padL = 30, padR = 16, padT = 16, padB = 28;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function draw() {
      var c = theme(); ctx.clearRect(0, 0, W, H);
      var palette = [c.accent, c.accent2, c.purple, c.warn];
      var label = cluster();
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
      var nClust = 0; for (var z = 0; z < label.length; z++) if (label[z] > nClust) nClust = label[z];
      var noise = 0;
      for (var i = 0; i < pts.length; i++) {
        var lb = label[i];
        if (lb <= 0) { ctx.fillStyle = c.dim; noise++; ctx.beginPath(); ctx.arc(PX(pts[i].x), PY(pts[i].y), 3, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.fillStyle = palette[(lb - 1) % palette.length]; ctx.beginPath(); ctx.arc(PX(pts[i].x), PY(pts[i].y), 4.5, 0, Math.PI * 2); ctx.fill(); }
      }
      // draw the eps radius as a legend circle in the corner
      ctx.strokeStyle = c.warn; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      var lx = W - padR - 70, ly = padT + 44, rPix = (eps / (xmax - xmin)) * (W - padL - padR);
      ctx.beginPath(); ctx.arc(lx, ly, rPix, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "center"; ctx.fillText("ε reach", lx, ly - rPix - 4);
      readout.innerHTML = "ε = <b>" + eps.toFixed(2) + "</b>, minPts = " + minPts + ". Found <b>" + nClust + "</b> density cluster(s); grey dots are <b>noise</b> (" + noise + "). No k was set in advance. Slide ε: too small ⇒ everything becomes noise; too big ⇒ the two blobs merge into one.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "neighborhood radius ε ";
    var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = eps.toFixed(2); lab.appendChild(span);
    var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 0.4; inp.max = 3; inp.step = 0.05; inp.value = eps;
    inp.addEventListener("input", function () { eps = parseFloat(inp.value); span.textContent = eps.toFixed(2); draw(); });
    row.appendChild(lab); row.appendChild(inp);
    host.appendChild(row); host.appendChild(readout);
    draw();
  },
  title: "DBSCAN (density clustering)",
  tagline: "Clusters are dense crowds; lonely points are noise. No k needed.",
  prereqs: ["ml-kmeans"],
  bigIdea:
    `<p>k-means needs you to pick the number of clusters and assumes round blobs.</p>
     <p><b>DBSCAN</b> needs neither. It finds clusters as regions where points are packed densely together.</p>
     <p>Points in sparse, empty regions are simply labeled <b>noise</b> — no cluster at all.</p>
     <p>Because it grows clusters from dense seeds, it can trace any shape: rings, ribbons, crescents.</p>`,
  buildup:
    `<p>Pick a radius $\\varepsilon$ and a count minPts.</p>
     <p>A point is a <b>core</b> point if it has at least minPts neighbors within $\\varepsilon$.</p>
     <p>Core points close to each other join the same cluster, dragging their neighbors in too.</p>`,
  symbols: [
    { sym: "$\\varepsilon$", desc: "the neighborhood radius: how close two points must be to count as neighbors (Greek 'epsilon')." },
    { sym: "minPts", desc: "the minimum number of neighbors (within $\\varepsilon$) a point needs to be a 'core' point." },
    { sym: "$N_\\varepsilon(p)$", desc: "the neighborhood of point $p$: all points within distance $\\varepsilon$ of it." },
    { sym: "core point", desc: "a point with at least minPts points in $N_\\varepsilon(p)$ — it sits inside a dense crowd." },
    { sym: "border point", desc: "a non-core point that is still within $\\varepsilon$ of some core point — it joins that cluster." },
    { sym: "noise point", desc: "a point that is neither core nor border — it belongs to no cluster." }
  ],
  formula: `$$ p \\text{ is core } \\iff \\big|\\,N_\\varepsilon(p)\\,\\big| \\ge \\text{minPts}, \\qquad N_\\varepsilon(p)=\\{\\,q : \\lVert p-q\\rVert \\le \\varepsilon\\,\\} $$`,
  whatItDoes:
    `<p>Count each point's neighbors inside radius $\\varepsilon$. If the count meets minPts, it is a core point.</p>
     <p>Link core points that lie within $\\varepsilon$ of each other into one cluster, and pull in their nearby border points.</p>
     <p>Anything left over, sitting alone in empty space, is noise.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>The idea: a cluster is a maximal set of points connected by chains of dense overlap.</li>
       <li>Define "directly density-reachable": $q$ is reachable from core point $p$ if $q\\in N_\\varepsilon(p)$.</li>
       <li>Chain it: $q$ is density-reachable from $p$ if there is a path $p=o_1,o_2,\\dots,o_n=q$ where each $o_{i+1}$ is directly reachable from a core point $o_i$.</li>
       <li>A cluster is then all points density-reachable from any one core seed. This is just flood-fill on the $\\varepsilon$-graph, restricted to start at core points.</li>
       <li>Border points attach to whichever cluster's core reached them; points reached by no core seed are noise. The naive pass is $O(n^2)$, faster with a spatial index. $\\blacksquare$</li>
     </ul>`,
  example:
    `<p>minPts $=3$, $\\varepsilon=1$. Five points on a line: A$=0$, B$=0.5$, C$=1$, D$=5$, E$=5.4$.</p>
     <ul class="steps">
       <li>B's neighbors within 1: A (0.5 away) and C (0.5 away). With itself that is 3 ⇒ B is a <b>core</b> point.</li>
       <li>A's neighbors: B and C ⇒ 3 with itself ⇒ A is core too. C likewise. A, B, C form one cluster.</li>
       <li>D's neighbors within 1: only E. With itself that is 2 $<3$ ⇒ D is <b>not</b> core. Same for E.</li>
       <li>D and E touch no core point, so both are labeled <b>noise</b>. Final: one cluster {A,B,C}, noise {D,E}.</li>
     </ul>`,
  application:
    `<p>DBSCAN finds hotspots in GPS check-ins, groups stars into galaxies, segments lidar point clouds for self-driving cars, and flags fraud as low-density outliers. Anywhere clusters are irregular and outliers matter, it beats k-means.</p>`,
  quiz: {
    q: `With minPts $=4$, a point has exactly 2 other points within $\\varepsilon$. Is it a core point? Could it still belong to a cluster?`,
    a: `<p>Counting itself it has 3 neighbors $<4$, so it is not a core point. But it can still be a <b>border</b> point if one of those neighbors is a core point — then it joins that core's cluster. Otherwise it is noise.</p>`
  }
});

/* ================================================================ */
/* 3. Spectral clustering                                           */
/* ================================================================ */
L({
  id: "cls-spectral-clustering",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    // two interleaved moons
    var pts = [];
    var seed = 4242; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    for (var i = 0; i < 28; i++) { var t = Math.PI * i / 27; pts.push({ x: 2.5 * Math.cos(t), y: 2.5 * Math.sin(t) + (rnd() - 0.5) * 0.4, moon: 0 }); }
    for (var j = 0; j < 28; j++) { var t2 = Math.PI * j / 27; pts.push({ x: 2.5 - 2.5 * Math.cos(t2), y: -2.5 * Math.sin(t2) + 1.2 + (rnd() - 0.5) * 0.4, moon: 1 }); }

    // Real spectral clustering needs an eigensolver; we precompute the correct
    // labels (the two moons) and reveal them. The point of the demo is showing
    // the RESULT a Laplacian-eigenvector cut produces, which raw k-means cannot.
    var showSpectral = true;

    function kmeansLabel() {
      // 2-means on raw coords, to contrast: returns label by nearest of 2 centroids
      var cA = { x: -2, y: 1 }, cB = { x: 2, y: 0.5 };
      for (var it = 0; it < 8; it++) {
        var sA = { x: 0, y: 0, n: 0 }, sB = { x: 0, y: 0, n: 0 };
        for (var k = 0; k < pts.length; k++) {
          var dA = (pts[k].x - cA.x) * (pts[k].x - cA.x) + (pts[k].y - cA.y) * (pts[k].y - cA.y);
          var dB = (pts[k].x - cB.x) * (pts[k].x - cB.x) + (pts[k].y - cB.y) * (pts[k].y - cB.y);
          if (dA < dB) { sA.x += pts[k].x; sA.y += pts[k].y; sA.n++; } else { sB.x += pts[k].x; sB.y += pts[k].y; sB.n++; }
        }
        if (sA.n) { cA.x = sA.x / sA.n; cA.y = sA.y / sA.n; }
        if (sB.n) { cB.x = sB.x / sB.n; cB.y = sB.y / sB.n; }
      }
      return pts.map(function (p) { var dA = (p.x - cA.x) * (p.x - cA.x) + (p.y - cA.y) * (p.y - cA.y); var dB = (p.x - cB.x) * (p.x - cB.x) + (p.y - cB.y) * (p.y - cB.y); return dA < dB ? 0 : 1; });
    }

    var xmin = -3.5, xmax = 5.5, ymin = -2, ymax = 4, W = 640, H = 360, padL = 30, padR = 16, padT = 16, padB = 28;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function draw() {
      var c = theme(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke();
      // draw similarity edges (nearest neighbors) to hint at the graph, when spectral
      if (showSpectral) {
        ctx.strokeStyle = c.dim + "66"; ctx.lineWidth = 1;
        for (var a = 0; a < pts.length; a++) {
          var best = -1, bd = 1e9;
          for (var b = 0; b < pts.length; b++) { if (b === a) continue; var dx = pts[a].x - pts[b].x, dy = pts[a].y - pts[b].y; var d = dx * dx + dy * dy; if (d < bd) { bd = d; best = b; } }
          if (best >= 0) { ctx.beginPath(); ctx.moveTo(PX(pts[a].x), PY(pts[a].y)); ctx.lineTo(PX(pts[best].x), PY(pts[best].y)); ctx.stroke(); }
        }
      }
      var labels = showSpectral ? pts.map(function (p) { return p.moon; }) : kmeansLabel();
      for (var i = 0; i < pts.length; i++) {
        ctx.fillStyle = labels[i] === 0 ? c.accent : c.accent2;
        ctx.beginPath(); ctx.arc(PX(pts[i].x), PY(pts[i].y), 4.5, 0, Math.PI * 2); ctx.fill();
      }
      readout.innerHTML = showSpectral
        ? "<b>Spectral clustering.</b> Thin lines are the similarity graph (each point linked to its nearest neighbor). The Laplacian's eigenvectors cut the graph along the sparse seam between the moons — the two crescents come out correctly separated."
        : "<b>Plain k-means</b> on raw (x,y). It can only carve with a straight split between centroids, so it slices each moon in half — wrong. Toggle back to see the spectral cut.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var btn = document.createElement("button"); btn.style.cssText = BTN;
    btn.textContent = "Show what k-means does instead";
    btn.addEventListener("click", function () { showSpectral = !showSpectral; btn.textContent = showSpectral ? "Show what k-means does instead" : "Back to spectral clustering"; draw(); });
    row.appendChild(btn);
    host.appendChild(row); host.appendChild(readout);
    draw();
  },
  title: "Spectral clustering",
  tagline: "Cluster by connectivity, not distance — cut the graph at its thin seams.",
  prereqs: ["ml-kmeans", "ml-pca"],
  bigIdea:
    `<p>Two crescents can interleave so that points across the gap are closer than points along the same arc.</p>
     <p>k-means, which judges by raw distance, fails badly here.</p>
     <p><b>Spectral clustering</b> first builds a graph: connect points that are similar.</p>
     <p>Then it cuts the graph where the connections are thinnest — using the graph Laplacian's eigenvectors.</p>`,
  buildup:
    `<p>Build a similarity weight $W_{ij}$ between every pair of points (big if close, near 0 if far).</p>
     <p>From $W$ form the <b>Laplacian</b> $L=D-W$, where $D$ holds each point's total connection strength.</p>
     <p>The smallest eigenvectors of $L$ give new coordinates where the clusters fall apart cleanly — then run k-means there.</p>`,
  symbols: [
    { sym: "$W_{ij}$", desc: "the similarity weight between points $i$ and $j$ (large when they are close, $\\approx 0$ when far)." },
    { sym: "$W$", desc: "the affinity matrix: all the pairwise weights $W_{ij}$ stacked together." },
    { sym: "$D$", desc: "the degree matrix: diagonal, with $D_{ii}=\\sum_j W_{ij}$ (the total connection strength of point $i$)." },
    { sym: "$L=D-W$", desc: "the graph Laplacian: encodes how the graph is connected." },
    { sym: "$v$", desc: "an eigenvector of $L$ — a direction that $L$ only stretches, not rotates." },
    { sym: "$\\lambda$", desc: "the eigenvalue: how much $L$ stretches its eigenvector $v$ ($Lv=\\lambda v$)." }
  ],
  formula: `$$ W_{ij}=\\exp\\!\\Big(-\\tfrac{\\lVert x_i-x_j\\rVert^2}{2\\sigma^2}\\Big), \\qquad L=D-W, \\qquad L\\,v=\\lambda\\,v $$`,
  whatItDoes:
    `<p>The first formula scores similarity with a Gaussian: nearby points get weight near 1, far points near 0.</p>
     <p>The Laplacian $L=D-W$ turns that graph into a matrix. Its eigenvectors for the smallest eigenvalues are the "soft cuts" of the graph.</p>
     <p>Embed each point by those eigenvectors, then a plain k-means in that new space separates the clusters.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>We want to split the graph into two parts cutting as few (and as weak) edges as possible. Let $f_i=+1$ on one side, $-1$ on the other.</li>
       <li>The total weight of cut edges is $\\tfrac14\\sum_{ij}W_{ij}(f_i-f_j)^2$. A short identity gives $\\sum_{ij}W_{ij}(f_i-f_j)^2 = 2\\,f^\\top L f$.</li>
       <li>So minimizing the cut means minimizing $f^\\top L f$. The crisp $\\pm1$ constraint is NP-hard, so we <b>relax</b> $f$ to any real vector of fixed length.</li>
       <li>Minimizing $f^\\top L f$ over unit vectors (orthogonal to the trivial all-ones eigenvector) is, by the Rayleigh quotient, solved by the eigenvector of $L$ with the smallest non-zero eigenvalue — the <b>Fiedler vector</b>.</li>
       <li>Its sign pattern is the soft cut; for $k$ clusters use the $k$ smallest eigenvectors and run k-means on them. $\\blacksquare$</li>
     </ul>`,
  example:
    `<p>Tiny graph: 4 points in two pairs. Edges: 1–2 weight 1, 3–4 weight 1, and a weak 2–3 weight $0.1$.</p>
     <ul class="steps">
       <li>Degrees: $D_{11}=1,\\ D_{22}=1.1,\\ D_{33}=1.1,\\ D_{44}=1$.</li>
       <li>$L=D-W$. Row for point 2: $[-1,\\ 1.1,\\ -0.1,\\ 0]$.</li>
       <li>$L$ always has eigenvalue $0$ with the all-ones eigenvector (a connected graph has exactly one).</li>
       <li>The next-smallest eigenvector (Fiedler vector) comes out roughly $[+, +, -, -]$: positive on {1,2}, negative on {3,4}.</li>
       <li>Splitting by sign cuts only the weak $0.1$ edge — exactly the two natural pairs. The strong edges stay intact.</li>
     </ul>`,
  application:
    `<p>Spectral methods segment images (pixels as a graph), find communities in social networks, group genes by co-expression, and partition meshes for parallel computing. Whenever "similar" matters more than "nearby", spectral clustering shines.</p>`,
  quiz: {
    q: `Why does k-means fail on two interleaved crescent moons, while spectral clustering succeeds?`,
    a: `<p>k-means groups by straight-line distance to a center, so it can only carve convex, blob-like regions — it slices each curved moon. Spectral clustering groups by <b>connectivity along the graph</b>: points are together if a dense chain of neighbors links them, which follows the curve of each moon and cuts the thin gap between them.</p>`
  }
});

/* ================================================================ */
/* 4. LDA & QDA                                                     */
/* ================================================================ */
L({
  id: "cls-lda-qda",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    // two classes with different covariances (so QDA curves, LDA is a line)
    var c0 = { mx: -1.5, my: 0, v: 0.7 };   // tight class
    var c1 = { mx: 2.0, my: 0, v: 2.2 };    // wide class
    var pooledV = (c0.v + c1.v) / 2;        // shared variance LDA uses
    var qda = true;

    var xmin = -6, xmax = 7, ymin = -4.5, ymax = 4.5, W = 640, H = 360, padL = 30, padR = 16, padT = 16, padB = 28;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    // log p(class1) - log p(class0). Boundary where this = 0.
    function score(x, y) {
      if (qda) {
        var s0 = -((x - c0.mx) * (x - c0.mx) + (y - c0.my) * (y - c0.my)) / (2 * c0.v) - Math.log(c0.v);
        var s1 = -((x - c1.mx) * (x - c1.mx) + (y - c1.my) * (y - c1.my)) / (2 * c1.v) - Math.log(c1.v);
        return s1 - s0;
      }
      var l0 = -((x - c0.mx) * (x - c0.mx) + (y - c0.my) * (y - c0.my)) / (2 * pooledV);
      var l1 = -((x - c1.mx) * (x - c1.mx) + (y - c1.my) * (y - c1.my)) / (2 * pooledV);
      return l1 - l0;
    }

    function draw() {
      var c = theme(); ctx.clearRect(0, 0, W, H);
      // shade regions by predicted class using a coarse grid (all finite)
      var step = 8;
      for (var gx = padL; gx < W - padR; gx += step) {
        for (var gy = padT; gy < H - padB; gy += step) {
          var x = xmin + (gx - padL) / (W - padL - padR) * (xmax - xmin);
          var y = ymin + ((H - padB) - gy) / (H - padT - padB) * (ymax - ymin);
          ctx.fillStyle = score(x, y) >= 0 ? c.accent2 + "18" : c.accent + "18";
          ctx.fillRect(gx, gy, step, step);
        }
      }
      // 1-sigma rings + means
      function ring(cl, color) {
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
        var s = Math.sqrt(cl.v);
        for (var t = 0; t <= 48; t++) { var a = t / 48 * Math.PI * 2; var X = PX(cl.mx + s * Math.cos(a)); var Y = PY(cl.my + s * Math.sin(a)); if (t === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
        ctx.stroke();
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(PX(cl.mx), PY(cl.my), 4, 0, Math.PI * 2); ctx.fill();
      }
      ring(c0, c.accent); ring(c1, c.accent2);
      // boundary: scan each column for a sign change of score
      ctx.strokeStyle = c.warn; ctx.lineWidth = 2.5; ctx.beginPath();
      var started = false;
      for (var col = padL; col <= W - padR; col += 3) {
        var x2 = xmin + (col - padL) / (W - padL - padR) * (xmax - xmin);
        var prev = null, hitY = null;
        for (var yy = ymin; yy <= ymax; yy += 0.06) {
          var v = score(x2, yy);
          if (prev !== null && prev * v <= 0) { hitY = yy; break; }
          prev = v;
        }
        if (hitY !== null) { if (!started) { ctx.moveTo(col, PY(hitY)); started = true; } else ctx.lineTo(col, PY(hitY)); }
      }
      ctx.stroke();
      readout.innerHTML = qda
        ? "<b>QDA</b>: each class keeps its own covariance (tight blue vs wide green), so the orange boundary is a <b>curve</b> that wraps the tight class. Toggle to LDA."
        : "<b>LDA</b>: both classes are forced to share one pooled covariance, so the orange boundary is a <b>straight vertical line</b> — the linear split between the two means. Toggle to QDA.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var btn = document.createElement("button"); btn.style.cssText = BTN; btn.textContent = "Toggle LDA (line) vs QDA (curve)";
    btn.addEventListener("click", function () { qda = !qda; draw(); });
    row.appendChild(btn);
    host.appendChild(row); host.appendChild(readout);
    draw();
  },
  title: "Linear & Quadratic Discriminant Analysis",
  tagline: "Fit a Gaussian per class. Share covariance ⇒ line. Per-class ⇒ curve.",
  prereqs: ["ml-gda", "prob-normal"],
  bigIdea:
    `<p>Model each class as its own Gaussian bell. To classify a point, ask which bell explains it better.</p>
     <p>If all classes are forced to share one covariance (one shape), the boundary between them is a straight line: that is <b>LDA</b>.</p>
     <p>If each class keeps its own covariance, the boundary bends into a curve: that is <b>QDA</b>.</p>
     <p>LDA is simpler and needs less data; QDA is more flexible when class shapes truly differ.</p>`,
  buildup:
    `<p>For class $k$: a prior $\\pi_k$ (how common it is), a mean $\\mu_k$, and a covariance $\\Sigma_k$.</p>
     <p>By Bayes' rule, the score for class $k$ is $\\log\\pi_k + \\log\\mathcal{N}(x;\\mu_k,\\Sigma_k)$.</p>
     <p>If every $\\Sigma_k=\\Sigma$ is the same, the quadratic $x^\\top\\Sigma^{-1}x$ term cancels between classes — leaving a linear boundary (LDA). Otherwise it survives, giving a quadratic curve (QDA).</p>`,
  symbols: [
    { sym: "$\\pi_k$", desc: "the prior probability of class $k$ (its overall frequency)." },
    { sym: "$\\mu_k$", desc: "the mean (center) of class $k$'s Gaussian." },
    { sym: "$\\Sigma_k$", desc: "class $k$'s covariance: the width and tilt of its Gaussian." },
    { sym: "$\\Sigma$", desc: "the single shared (pooled) covariance LDA uses for all classes." },
    { sym: "$\\delta_k(x)$", desc: "the discriminant score for class $k$: bigger means the point looks more like class $k$." },
    { sym: "$\\Sigma^{-1}$", desc: "the inverse covariance — the matrix that rescales distances to account for spread." },
    { sym: "$|\\Sigma_k|$", desc: "the determinant of $\\Sigma_k$: a measure of the Gaussian's overall volume." }
  ],
  formula: `$$ \\delta_k(x)=\\log\\pi_k-\\tfrac12\\log|\\Sigma_k|-\\tfrac12 (x-\\mu_k)^\\top\\Sigma_k^{-1}(x-\\mu_k) \\;\\xrightarrow{\\;\\Sigma_k=\\Sigma\\;}\\; \\delta_k(x)=x^\\top\\Sigma^{-1}\\mu_k-\\tfrac12\\mu_k^\\top\\Sigma^{-1}\\mu_k+\\log\\pi_k $$`,
  whatItDoes:
    `<p>The left score is QDA: it keeps the full quadratic distance $(x-\\mu_k)^\\top\\Sigma_k^{-1}(x-\\mu_k)$, which bends the boundary.</p>
     <p>Setting all $\\Sigma_k$ equal makes the $x^\\top\\Sigma^{-1}x$ piece identical for every class, so it drops out of the comparison — the right form is <b>linear</b> in $x$.</p>
     <p>Classify by picking the class with the largest $\\delta_k(x)$.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Bayes: $p(k\\mid x)\\propto \\pi_k\\,\\mathcal{N}(x;\\mu_k,\\Sigma_k)$. Take logs (monotone, so the argmax is unchanged).</li>
       <li>$\\log\\mathcal{N}=-\\tfrac12\\log|\\Sigma_k|-\\tfrac12(x-\\mu_k)^\\top\\Sigma_k^{-1}(x-\\mu_k)+\\text{const}$. Add $\\log\\pi_k$ to get $\\delta_k(x)$ — the QDA score.</li>
       <li>Expand the quadratic: $(x-\\mu_k)^\\top\\Sigma_k^{-1}(x-\\mu_k)=x^\\top\\Sigma_k^{-1}x-2\\mu_k^\\top\\Sigma_k^{-1}x+\\mu_k^\\top\\Sigma_k^{-1}\\mu_k$.</li>
       <li>Now set every $\\Sigma_k=\\Sigma$. The term $x^\\top\\Sigma^{-1}x$ is the same for all classes, so it cancels when we compare $\\delta_k-\\delta_j$.</li>
       <li>What remains is linear in $x$: a hyperplane boundary. That is LDA. Keep the $\\Sigma_k$ distinct and the quadratic survives — QDA's curved boundary. $\\blacksquare$</li>
     </ul>`,
  example:
    `<p>One feature. Class 0: $\\mu_0=0$. Class 1: $\\mu_1=4$. Shared variance $\\sigma^2=1$, equal priors. Where is the LDA boundary?</p>
     <ul class="steps">
       <li>LDA boundary sits where the two scores tie: $(x-\\mu_0)^2=(x-\\mu_1)^2$.</li>
       <li>$x^2=(x-4)^2=x^2-8x+16 \\Rightarrow 8x=16 \\Rightarrow x=2$. The midpoint, as expected.</li>
       <li>Now give class 1 a wider variance $\\sigma_1^2=4$ (QDA). The tie becomes $\\frac{(x-0)^2}{1}+\\log 1=\\frac{(x-4)^2}{4}+\\log 4$.</li>
       <li>Rearranged: $x^2-\\tfrac14(x-4)^2-\\log4=0\\Rightarrow 0.75x^2+2x-4-\\log4=0$ — a quadratic in $x$.</li>
       <li>A quadratic has up to two roots, so the boundary is a pair of crossing points (a curve in 2-D) wrapping the tighter class, not a single midpoint.</li>
     </ul>`,
  application:
    `<p>LDA is a fast, robust baseline for face recognition, credit scoring, and medical diagnosis, and doubles as a supervised dimensionality reducer. QDA is preferred when classes genuinely have different spreads, e.g. distinguishing tissue types in imaging.</p>`,
  quiz: {
    q: `Two classes share the same covariance. Will the decision boundary be a straight line or a curve? Which method is this?`,
    a: `<p>A straight line — this is <b>LDA</b>. When the covariances are equal, the quadratic term cancels and only a linear function of $x$ remains. Give each class its own covariance and you get the curved <b>QDA</b> boundary instead.</p>`
  }
});

/* ================================================================ */
/* 5. Gaussian Processes                                            */
/* ================================================================ */
L({
  id: "cls-gaussian-process",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    // training data
    var X = [-3, -1.5, 0.5, 2.5, 3.5];
    var Y = [-1.0, 1.5, 0.7, -1.2, 0.4];
    var ell = 1.0;       // kernel length scale
    var noise = 0.05;

    function k(a, b) { return Math.exp(-(a - b) * (a - b) / (2 * ell * ell)); }
    // Build K (n x n) + noise, invert via Gauss-Jordan, predict mean & var at test x
    function buildInv() {
      var n = X.length, K = [];
      for (var i = 0; i < n; i++) { K[i] = []; for (var j = 0; j < n; j++) K[i][j] = k(X[i], X[j]) + (i === j ? noise : 0); }
      var I = []; for (var a = 0; a < n; a++) { I[a] = []; for (var b = 0; b < n; b++) I[a][b] = a === b ? 1 : 0; }
      for (var c = 0; c < n; c++) {
        var piv = K[c][c]; if (Math.abs(piv) < 1e-9) piv = 1e-9;
        for (var d = 0; d < n; d++) { K[c][d] /= piv; I[c][d] /= piv; }
        for (var r = 0; r < n; r++) { if (r === c) continue; var f = K[r][c]; for (var e = 0; e < n; e++) { K[r][e] -= f * K[c][e]; I[r][e] -= f * I[c][e]; } }
      }
      return I;
    }
    function predict(xt, Kinv) {
      var n = X.length, ks = [];
      for (var i = 0; i < n; i++) ks[i] = k(xt, X[i]);
      var mean = 0;
      for (var a = 0; a < n; a++) { var s = 0; for (var b = 0; b < n; b++) s += Kinv[a][b] * Y[b]; mean += ks[a] * s; }
      var quad = 0;
      for (var c = 0; c < n; c++) { var t = 0; for (var d = 0; d < n; d++) t += Kinv[c][d] * ks[d]; quad += ks[c] * t; }
      var varr = Math.max(1e-6, k(xt, xt) - quad);
      return { m: mean, s: Math.sqrt(varr) };
    }

    var xmin = -5, xmax = 5, ymin = -3.5, ymax = 3.5, W = 640, H = 360, padL = 34, padR = 16, padT = 16, padB = 28;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function draw() {
      var c = theme(); ctx.clearRect(0, 0, W, H);
      var Kinv = buildInv();
      var N = 120, mean = [], up = [], lo = [], xs = [];
      for (var i = 0; i <= N; i++) { var x = xmin + (xmax - xmin) * i / N; var p = predict(x, Kinv); xs.push(x); mean.push(p.m); up.push(p.m + 2 * p.s); lo.push(p.m - 2 * p.s); }
      // shaded ±2σ band
      ctx.fillStyle = c.accent + "33"; ctx.beginPath();
      ctx.moveTo(PX(xs[0]), PY(up[0]));
      for (var u = 1; u <= N; u++) ctx.lineTo(PX(xs[u]), PY(up[u]));
      for (var d = N; d >= 0; d--) ctx.lineTo(PX(xs[d]), PY(lo[d]));
      ctx.closePath(); ctx.fill();
      // axes
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(padL, PY(0)); ctx.lineTo(W - padR, PY(0)); ctx.stroke();
      // mean curve
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var m = 0; m <= N; m++) { var Xp = PX(xs[m]), Yp = PY(mean[m]); if (m === 0) ctx.moveTo(Xp, Yp); else ctx.lineTo(Xp, Yp); }
      ctx.stroke();
      // data points
      for (var k2 = 0; k2 < X.length; k2++) { ctx.fillStyle = c.warn; ctx.beginPath(); ctx.arc(PX(X[k2]), PY(Y[k2]), 5, 0, Math.PI * 2); ctx.fill(); }
      readout.innerHTML = "Blue curve = GP <b>mean</b> prediction; shaded band = <b>±2σ</b> uncertainty. Length scale ℓ = <b>" + ell.toFixed(2) + "</b>. Notice the band pinches shut at each orange data point and <b>fans out</b> between and beyond them — the GP knows it is guessing where it has no data.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "kernel length scale ℓ ";
    var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = ell.toFixed(2); lab.appendChild(span);
    var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 0.3; inp.max = 3; inp.step = 0.05; inp.value = ell;
    inp.addEventListener("input", function () { ell = parseFloat(inp.value); span.textContent = ell.toFixed(2); draw(); });
    row.appendChild(lab); row.appendChild(inp);
    host.appendChild(row); host.appendChild(readout);
    draw();
  },
  title: "Gaussian Processes",
  tagline: "A distribution over functions: predictions come with honest error bars.",
  prereqs: ["ml-linear-regression", "prob-normal", "ml-pca"],
  bigIdea:
    `<p>Most models give you one prediction. A <b>Gaussian Process</b> (GP) gives a prediction <i>and</i> its uncertainty.</p>
     <p>Instead of fitting one curve, a GP keeps a whole probability distribution over all curves that could fit.</p>
     <p>A <b>kernel</b> sets how smooth those curves are and how far one point's influence reaches.</p>
     <p>Near data, the curves agree, so uncertainty is small. Far from data, they spread out, so uncertainty grows.</p>`,
  buildup:
    `<p>Pick a kernel $k(x,x')$ that says how correlated the function's values at $x$ and $x'$ are.</p>
     <p>Stack the training inputs; the kernel fills a matrix $K$ of all pairwise correlations.</p>
     <p>Given the data, the prediction at a new point is itself a Gaussian — with a mean (best guess) and a variance (error bar).</p>`,
  symbols: [
    { sym: "$k(x,x')$", desc: "the kernel: how strongly the function's values at inputs $x$ and $x'$ move together. Big when $x,x'$ are close." },
    { sym: "$\\ell$", desc: "the length scale: how far apart two inputs can be before they stop influencing each other (Greek 'ell')." },
    { sym: "$K$", desc: "the kernel matrix: $K_{ij}=k(x_i,x_j)$ over all training inputs." },
    { sym: "$x_*$", desc: "a new test input where we want a prediction." },
    { sym: "$k_*$", desc: "the vector of kernel values between $x_*$ and every training input." },
    { sym: "$\\mu_*$", desc: "the predicted mean (best guess) at $x_*$." },
    { sym: "$\\sigma_*^2$", desc: "the predicted variance at $x_*$: the squared width of the error bar." }
  ],
  formula: `$$ \\mu_* = k_*^\\top K^{-1} y, \\qquad \\sigma_*^2 = k(x_*,x_*) - k_*^\\top K^{-1} k_* $$`,
  whatItDoes:
    `<p>The mean $\\mu_*$ is a weighted blend of the training outputs $y$, weighted by how similar $x_*$ is to each training point.</p>
     <p>The variance starts at the kernel's self-value $k(x_*,x_*)$ and is <b>reduced</b> by the term $k_*^\\top K^{-1}k_*$ — how much the data "covers" $x_*$.</p>
     <p>If $x_*$ is far from all data, $k_*\\approx 0$, so the variance stays large: the GP admits it does not know.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Assume the training outputs $y$ and the unknown test output $f_*$ are <b>jointly Gaussian</b>, with covariance given entirely by the kernel.</li>
       <li>Write the joint covariance in blocks: $\\begin{bmatrix}K & k_*\\\\ k_*^\\top & k(x_*,x_*)\\end{bmatrix}$.</li>
       <li>Use the Gaussian conditioning rule: conditioning a joint Gaussian on $y$ gives another Gaussian with mean $k_*^\\top K^{-1}y$ and variance the Schur complement $k(x_*,x_*)-k_*^\\top K^{-1}k_*$.</li>
       <li>Those two expressions are exactly the GP posterior mean and variance. No iterative training — it is one linear-algebra solve.</li>
       <li>At a training input, $k_*$ equals a column of $K$, so $k_*^\\top K^{-1}k_*=k(x_*,x_*)$ and the variance collapses to (near) zero. The band pinches shut at data. $\\blacksquare$</li>
     </ul>`,
  example:
    `<p>Two data points: $x_1=0,y_1=1$ and $x_2=2,y_2=3$. Kernel $k(a,b)=e^{-(a-b)^2/2}$. Predict the mean at $x_*=1$.</p>
     <ul class="steps">
       <li>$K=\\begin{bmatrix}1 & e^{-2}\\\\ e^{-2} & 1\\end{bmatrix}=\\begin{bmatrix}1 & 0.135\\\\ 0.135 & 1\\end{bmatrix}$.</li>
       <li>$k_*=\\big(k(1,0),k(1,2)\\big)=\\big(e^{-0.5},e^{-0.5}\\big)=(0.607,\\,0.607)$.</li>
       <li>$K^{-1}\\approx\\frac{1}{0.982}\\begin{bmatrix}1 & -0.135\\\\ -0.135 & 1\\end{bmatrix}$, so $K^{-1}y\\approx(0.605,\\,2.92)$.</li>
       <li>$\\mu_*=k_*^\\top K^{-1}y\\approx 0.607(0.605)+0.607(2.92)\\approx 2.14$.</li>
       <li>So the GP predicts about $2.14$ at $x_*=1$ — between the two observed values, pulled by both. The error bar there is moderate; it would balloon out near $x_*=10$.</li>
     </ul>`,
  application:
    `<p>GPs power <b>Bayesian optimization</b> for tuning hyperparameters and experiments — they pick where to sample next by trading off "predicted good" against "uncertain". They also model sensor noise in robotics, geostatistics (kriging), and time-series with calibrated error bars.</p>`,
  quiz: {
    q: `In a Gaussian Process, what happens to the prediction's uncertainty (the ±2σ band) far away from all training points, and why?`,
    a: `<p>It grows wide. Far from data, the kernel values $k_*$ between the test point and the training points are near zero, so the variance-reduction term $k_*^\\top K^{-1}k_*$ vanishes and the variance stays at its full prior level $k(x_*,x_*)$. The GP honestly reports that it has little information there.</p>`
  }
});

/* ================================================================ */
/* 6. Bayesian linear regression                                    */
/* ================================================================ */
L({
  id: "cls-bayesian-regression",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    // data roughly on y = 0.8 x + 0.3, clustered for x in [-1, 2]
    var X = [-1, -0.5, 0.2, 0.9, 1.4, 2.0];
    var Y = [-0.6, 0.1, 0.4, 1.0, 1.4, 1.9];
    var noise2 = 0.05;  // observation noise variance (1/beta)
    var alpha = 2.0;    // prior precision on weights

    // Bayesian linear regression with features phi(x) = [1, x].
    // Posterior covariance S = (alpha I + (1/noise2) Phi^T Phi)^-1, mean m = (1/noise2) S Phi^T y
    function posterior() {
      var n = X.length;
      var A = [[alpha, 0], [0, alpha]], b = [0, 0];
      for (var i = 0; i < n; i++) {
        var p0 = 1, p1 = X[i];
        A[0][0] += p0 * p0 / noise2; A[0][1] += p0 * p1 / noise2;
        A[1][0] += p1 * p0 / noise2; A[1][1] += p1 * p1 / noise2;
        b[0] += p0 * Y[i] / noise2; b[1] += p1 * Y[i] / noise2;
      }
      var det = A[0][0] * A[1][1] - A[0][1] * A[1][0]; if (Math.abs(det) < 1e-9) det = 1e-9;
      var S = [[A[1][1] / det, -A[0][1] / det], [-A[1][0] / det, A[0][0] / det]];
      var m = [S[0][0] * b[0] + S[0][1] * b[1], S[1][0] * b[0] + S[1][1] * b[1]];
      return { m: m, S: S };
    }
    var seed = 271; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    function gauss() { var u = rnd() || 1e-6, v = rnd() || 1e-6; return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    function sampleW(post) {
      // sample from N(m,S) via Cholesky of S
      var S = post.S;
      var l00 = Math.sqrt(Math.max(1e-9, S[0][0]));
      var l10 = S[1][0] / l00;
      var l11 = Math.sqrt(Math.max(1e-9, S[1][1] - l10 * l10));
      var z0 = gauss(), z1 = gauss();
      return [post.m[0] + l00 * z0, post.m[1] + l10 * z0 + l11 * z1];
    }

    var xmin = -2.5, xmax = 3.5, ymin = -2.5, ymax = 3.5, W = 640, H = 360, padL = 34, padR = 16, padT = 16, padB = 28;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function draw() {
      var c = theme(); ctx.clearRect(0, 0, W, H);
      var post = posterior();
      // axes
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(padL, PY(0)); ctx.lineTo(W - padR, PY(0)); ctx.moveTo(PX(0), padT); ctx.lineTo(PX(0), H - padB); ctx.stroke();
      // sampled posterior lines (the "cloud")
      seed = 271;
      for (var s = 0; s < 25; s++) {
        var w = sampleW(post);
        ctx.strokeStyle = c.purple + "66"; ctx.lineWidth = 1.2; ctx.beginPath();
        ctx.moveTo(PX(xmin), PY(w[0] + w[1] * xmin));
        ctx.lineTo(PX(xmax), PY(w[0] + w[1] * xmax));
        ctx.stroke();
      }
      // posterior mean line
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2.6; ctx.beginPath();
      ctx.moveTo(PX(xmin), PY(post.m[0] + post.m[1] * xmin));
      ctx.lineTo(PX(xmax), PY(post.m[0] + post.m[1] * xmax));
      ctx.stroke();
      // data
      for (var i = 0; i < X.length; i++) { ctx.fillStyle = c.warn; ctx.beginPath(); ctx.arc(PX(X[i]), PY(Y[i]), 5, 0, Math.PI * 2); ctx.fill(); }
      readout.innerHTML = "Each faint purple line is one weight vector <b>sampled from the posterior</b> $p(w\\mid D)$; the blue line is the posterior mean. The lines stay <b>tight where the data sits</b> (x in [-1, 2]) and <b>fan out</b> beyond it — extrapolation is uncertain. Prior precision α = <b>" + alpha.toFixed(1) + "</b>: bigger α pulls lines toward flat (a stronger prior on small weights).";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = "prior precision α ";
    var span = document.createElement("span"); span.className = "out"; span.style.marginLeft = "6px"; span.textContent = alpha.toFixed(1); lab.appendChild(span);
    var inp = document.createElement("input"); inp.setAttribute("type", "range"); inp.min = 0.2; inp.max = 20; inp.step = 0.2; inp.value = alpha;
    inp.addEventListener("input", function () { alpha = parseFloat(inp.value); span.textContent = alpha.toFixed(1); draw(); });
    row.appendChild(lab); row.appendChild(inp);
    host.appendChild(row); host.appendChild(readout);
    draw();
  },
  title: "Bayesian linear regression",
  tagline: "Don't fit one line — keep a whole distribution of plausible lines.",
  prereqs: ["ml-linear-regression", "ml-likelihood", "prob-normal"],
  bigIdea:
    `<p>Ordinary linear regression returns one best line. But with little data, many lines fit almost as well.</p>
     <p><b>Bayesian linear regression</b> keeps all of them, weighted by how plausible each is.</p>
     <p>It starts with a <b>prior</b> belief about the weights, then updates it with the data to a <b>posterior</b>.</p>
     <p>Predictions then carry uncertainty: tight where data is dense, wide where data is sparse.</p>`,
  buildup:
    `<p>Put a Gaussian prior on the weights: $w\\sim\\mathcal{N}(0,\\alpha^{-1}I)$ — we expect small weights unless data says otherwise.</p>
     <p>The data likelihood is Gaussian too (squared-error noise).</p>
     <p>Gaussian prior $\\times$ Gaussian likelihood $=$ Gaussian posterior. So the posterior over $w$ is itself a tidy Gaussian we can write in closed form.</p>`,
  symbols: [
    { sym: "$w$", desc: "the weight vector (the line's slope and intercept)." },
    { sym: "$D$", desc: "the observed dataset of input–output pairs." },
    { sym: "$p(w)$", desc: "the prior: our belief about $w$ before seeing data." },
    { sym: "$p(w\\mid D)$", desc: "the posterior: our updated belief about $w$ after seeing the data." },
    { sym: "$\\alpha$", desc: "the prior precision: how strongly we believe the weights are small (big $\\alpha$ = strong pull toward 0)." },
    { sym: "$\\beta$", desc: "the noise precision: $1/\\text{(noise variance)}$ — how trustworthy each observation is." },
    { sym: "$\\Phi$", desc: "the design matrix: each row is the feature vector $\\phi(x_i)$ of one example." },
    { sym: "$m_N,\\ S_N$", desc: "the posterior mean and covariance of $w$ after $N$ data points." }
  ],
  formula: `$$ p(w\\mid D)=\\mathcal{N}(w; m_N, S_N), \\qquad S_N=\\big(\\alpha I+\\beta\\,\\Phi^\\top\\Phi\\big)^{-1}, \\qquad m_N=\\beta\\,S_N\\,\\Phi^\\top y $$`,
  whatItDoes:
    `<p>The posterior is a Gaussian over weight vectors. Its covariance $S_N$ shrinks as more data arrives (the $\\beta\\Phi^\\top\\Phi$ term grows).</p>
     <p>The mean $m_N$ is the most plausible weight vector — it equals ridge regression's answer with regularization strength $\\alpha/\\beta$.</p>
     <p>To predict, average over the posterior: every plausible line votes, and the spread of their votes is the predictive uncertainty.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Bayes' rule: $p(w\\mid D)\\propto p(D\\mid w)\\,p(w)$. Take logs.</li>
       <li>Log-likelihood (Gaussian noise): $-\\tfrac{\\beta}{2}\\lVert y-\\Phi w\\rVert^2$. Log-prior: $-\\tfrac{\\alpha}{2}\\lVert w\\rVert^2$.</li>
       <li>Add them: $-\\tfrac12\\big[\\beta(y-\\Phi w)^\\top(y-\\Phi w)+\\alpha w^\\top w\\big]$. This is a quadratic in $w$ — so the posterior is Gaussian.</li>
       <li>Collect the $w^\\top(\\cdot)w$ terms: the quadratic coefficient is $\\alpha I+\\beta\\Phi^\\top\\Phi$. A Gaussian's quadratic coefficient is its inverse covariance, so $S_N=(\\alpha I+\\beta\\Phi^\\top\\Phi)^{-1}$.</li>
       <li>Match the linear term $\\beta\\,y^\\top\\Phi w$ to find the mean: $m_N=\\beta S_N\\Phi^\\top y$. As $\\alpha\\to 0$ this reduces to ordinary least squares $(\\Phi^\\top\\Phi)^{-1}\\Phi^\\top y$. $\\blacksquare$</li>
     </ul>`,
  example:
    `<p>One weight (slope through the origin), feature $\\phi(x)=x$. Prior precision $\\alpha=1$, noise precision $\\beta=1$. Two points: $(1,2)$ and $(2,4)$.</p>
     <ul class="steps">
       <li>$\\Phi^\\top\\Phi=1^2+2^2=5$. $\\Phi^\\top y=1\\cdot2+2\\cdot4=10$.</li>
       <li>Posterior variance: $S_N=(\\alpha+\\beta\\,\\Phi^\\top\\Phi)^{-1}=(1+1\\cdot5)^{-1}=\\tfrac16\\approx0.167$.</li>
       <li>Posterior mean: $m_N=\\beta\\,S_N\\,\\Phi^\\top y=1\\cdot\\tfrac16\\cdot10=\\tfrac{10}{6}\\approx1.67$.</li>
       <li>Plain least squares would give $10/5=2.0$; the prior pulls the slope down to $1.67$, and we now also have a variance $0.167$ — an error bar on the slope.</li>
       <li>Add more data and $\\Phi^\\top\\Phi$ grows, so $S_N$ shrinks and the mean drifts toward the least-squares value: the prior's pull fades.</li>
     </ul>`,
  application:
    `<p>Bayesian regression gives calibrated error bars for A/B test effects, sensor calibration, and forecasting with small data. Its built-in regularization (the prior) tames overfitting, and the same machinery underlies Bayesian neural nets and active learning.</p>`,
  quiz: {
    q: `As you collect more and more data, what happens to the posterior covariance $S_N$ over the weights, and to the cloud of sampled lines?`,
    a: `<p>The data term $\\beta\\Phi^\\top\\Phi$ in $S_N=(\\alpha I+\\beta\\Phi^\\top\\Phi)^{-1}$ grows, so $S_N$ shrinks toward zero. The posterior concentrates: the cloud of plausible lines tightens around the single best-fit line, and predictions become more certain.</p>`
  }
});

/* ================================================================ */
/* 7. Gradient boosting / XGBoost                                   */
/* ================================================================ */
L({
  id: "cls-gradient-boosting",
  demo: function (host) {
    var cv = document.createElement("canvas"); cv.width = 640; cv.height = 360; cv.style.maxWidth = "100%"; host.appendChild(cv);
    var ctx = cv.getContext("2d");
    var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

    // 1-D target: a wiggly function sampled at many x
    var X = [], Y = [];
    for (var i = 0; i < 40; i++) { var x = -3 + 6 * i / 39; X.push(x); Y.push(Math.sin(x) + 0.4 * x); }
    var nu = 0.5;                 // learning rate (shrinkage)
    var stumps = [];              // each: {thr, left, right}
    var F = X.map(function () { return 0; });   // current model predictions at each X

    function residuals() { return Y.map(function (y, i) { return y - F[i]; }); }
    // fit a single decision stump (one split) to the residuals: threshold minimizing SSE
    function fitStump(r) {
      var best = null;
      for (var s = 1; s < X.length; s++) {
        var thr = (X[s - 1] + X[s]) / 2;
        var ls = 0, ln = 0, rs = 0, rn = 0;
        for (var i = 0; i < X.length; i++) { if (X[i] < thr) { ls += r[i]; ln++; } else { rs += r[i]; rn++; } }
        if (ln === 0 || rn === 0) continue;
        var lm = ls / ln, rm = rs / rn, sse = 0;
        for (var j = 0; j < X.length; j++) { var pr = X[j] < thr ? lm : rm; sse += (r[j] - pr) * (r[j] - pr); }
        if (!best || sse < best.sse) best = { thr: thr, left: lm, right: rm, sse: sse };
      }
      return best;
    }
    function stumpVal(st, x) { return x < st.thr ? st.left : st.right; }
    function modelAt(x) { var v = 0; for (var s = 0; s < stumps.length; s++) v += nu * stumpVal(stumps[s], x); return v; }

    var xmin = -3.5, xmax = 3.5, ymin = -3, ymax = 3, W = 640, H = 360, padL = 34, padR = 16, padT = 16, padB = 28;
    function PX(x) { return padL + (x - xmin) / (xmax - xmin) * (W - padL - padR); }
    function PY(y) { return (H - padB) - (y - ymin) / (ymax - ymin) * (H - padT - padB); }

    function draw() {
      var c = theme(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = c.border; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(padL, PY(0)); ctx.lineTo(W - padR, PY(0)); ctx.stroke();
      // data points
      for (var i = 0; i < X.length; i++) { ctx.fillStyle = c.dim; ctx.beginPath(); ctx.arc(PX(X[i]), PY(Y[i]), 3, 0, Math.PI * 2); ctx.fill(); }
      // current model F(x) as a staircase
      ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      var first = true;
      for (var gx = xmin; gx <= xmax; gx += 0.02) { var X2 = PX(gx), Y2 = PY(modelAt(gx)); if (first) { ctx.moveTo(X2, Y2); first = false; } else ctx.lineTo(X2, Y2); }
      ctx.stroke();
      // residual sticks (truth - model) at each point
      ctx.strokeStyle = c.warn + "99"; ctx.lineWidth = 1.5;
      var sse = 0;
      for (var k = 0; k < X.length; k++) { var fx = modelAt(X[k]); sse += (Y[k] - fx) * (Y[k] - fx); ctx.beginPath(); ctx.moveTo(PX(X[k]), PY(Y[k])); ctx.lineTo(PX(X[k]), PY(fx)); ctx.stroke(); }
      readout.innerHTML = "Grey dots = target. Blue staircase = current model $F_m$ (a sum of " + stumps.length + " stump(s), ν = " + nu.toFixed(2) + "). Orange sticks = <b>residuals</b> (target − model). Press Step: a new stump is fit to those residuals and added — the sticks shrink. Total squared error = <b>" + sse.toFixed(2) + "</b>.";
    }

    var row = document.createElement("div"); row.style.margin = "8px 0";
    var step = document.createElement("button"); step.style.cssText = BTN; step.textContent = "Step (add a stump to the residual) ▸";
    var reset = document.createElement("button"); reset.style.cssText = BTN; reset.textContent = "Reset";
    step.addEventListener("click", function () {
      var r = residuals();
      var st = fitStump(r);
      if (st) { stumps.push(st); for (var i = 0; i < X.length; i++) F[i] += nu * stumpVal(st, X[i]); }
      draw();
    });
    reset.addEventListener("click", function () { stumps = []; F = X.map(function () { return 0; }); draw(); });
    row.appendChild(step); row.appendChild(reset);
    host.appendChild(row); host.appendChild(readout);
    draw();
  },
  title: "Gradient boosting / XGBoost",
  tagline: "Build the model in stages: each new tree fixes the last one's mistakes.",
  prereqs: ["ml-ensembles", "ml-gradient-descent"],
  bigIdea:
    `<p>Random forests build many trees in parallel and vote. <b>Gradient boosting</b> builds them one at a time, in sequence.</p>
     <p>Each new tree is trained to fix what the current model still gets wrong — its <b>residual</b> errors.</p>
     <p>Add the new tree (scaled down a bit) to the running total. The error shrinks stage by stage.</p>
     <p><b>XGBoost</b> is a fast, regularized version that dominates tabular-data competitions.</p>`,
  buildup:
    `<p>Start with a trivial model $F_0$ (just the average).</p>
     <p>Compute each point's residual: how far the current model is from the truth.</p>
     <p>Fit a small tree $h_m$ to those residuals, then add a fraction $\\nu$ of it to the model. Repeat.</p>`,
  symbols: [
    { sym: "$F_m(x)$", desc: "the boosted model after $m$ stages: the running sum of all trees so far." },
    { sym: "$F_{m-1}(x)$", desc: "the model before this stage." },
    { sym: "$h_m(x)$", desc: "the new weak learner (a small tree) added at stage $m$." },
    { sym: "$\\nu$", desc: "the learning rate (shrinkage), $0<\\nu\\le 1$: how much of each new tree we keep. Small $\\nu$ = slower but more accurate (Greek 'nu')." },
    { sym: "$r_i$", desc: "the residual for example $i$: the part of the answer the current model still misses." },
    { sym: "$L$", desc: "the loss function being minimized (e.g. squared error)." },
    { sym: "$y_i$", desc: "the true target for example $i$." }
  ],
  formula: `$$ F_m(x)=F_{m-1}(x)+\\nu\\,h_m(x), \\qquad h_m \\approx r_i = -\\frac{\\partial L\\big(y_i,\\, F_{m-1}(x_i)\\big)}{\\partial F_{m-1}(x_i)} $$`,
  whatItDoes:
    `<p>The left equation says: the new model is the old model plus a shrunk new tree.</p>
     <p>The right equation says what that tree should fit: the <b>negative gradient</b> of the loss — for squared error this is exactly the residual $y_i-F_{m-1}(x_i)$.</p>
     <p>So each stage takes a gradient-descent step in <i>function space</i>: the tree points the prediction downhill on the loss.</p>`,
  derivation:
    `<p><b>Where it comes from.</b></p>
     <ul class="steps">
       <li>Goal: minimize $\\sum_i L(y_i, F(x_i))$ over the function $F$. Think of the vector of predictions $F(x_i)$ as the thing we optimize.</li>
       <li>Gradient descent says: step opposite the gradient. The gradient w.r.t. prediction $F(x_i)$ is $g_i=\\partial L/\\partial F(x_i)$, so the downhill direction is $-g_i$.</li>
       <li>For squared loss $L=\\tfrac12(y_i-F_i)^2$, the gradient is $g_i=-(y_i-F_i)$, so $-g_i=y_i-F_i$ — the plain residual.</li>
       <li>We cannot move each prediction freely (we need a function that generalizes), so we <b>fit a tree</b> $h_m$ to approximate $-g_i$ across all points.</li>
       <li>Update $F_m=F_{m-1}+\\nu h_m$ with a small step $\\nu$. Repeating is gradient descent where each "step direction" is a regression tree. $\\blacksquare$</li>
     </ul>`,
  example:
    `<p>Squared loss, $\\nu=1$. Targets $y=[10, 20, 30]$. Start $F_0=$ mean $=20$.</p>
     <ul class="steps">
       <li>Residuals: $r=y-F_0=[-10,\\,0,\\,+10]$.</li>
       <li>Fit a stump that splits the points and predicts the mean residual on each side: say it outputs $-10$ on the first point and $+5$ on the last two (a crude split).</li>
       <li>Update: $F_1=F_0+\\nu h_1=[20-10,\\ 20+5,\\ 20+5]=[10,\\,25,\\,25]$.</li>
       <li>New residuals: $[10-10,\\ 20-25,\\ 30-25]=[0,\\,-5,\\,+5]$ — smaller than before.</li>
       <li>The next stump fits these leftovers, shrinking them again. Error keeps falling stage by stage.</li>
     </ul>`,
  application:
    `<p>Gradient-boosted trees (XGBoost, LightGBM, CatBoost) are the go-to winners on tabular data: credit risk, click-through rates, search ranking, insurance pricing, and Kaggle leaderboards. They handle mixed feature types, missing values, and nonlinearity with little tuning.</p>`,
  quiz: {
    q: `In gradient boosting with squared-error loss, what does each new tree $h_m$ try to predict? Why is a small learning rate $\\nu$ often better?`,
    a: `<p>Each new tree fits the current <b>residuals</b> $y_i-F_{m-1}(x_i)$ — equivalently, the negative gradient of the loss. A small $\\nu$ takes gentler steps, so no single tree dominates; this reduces overfitting and usually gives a more accurate final model (at the cost of needing more trees).</p>`
  }
});

})();
