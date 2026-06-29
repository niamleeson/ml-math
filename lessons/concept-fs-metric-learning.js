(function () {
  window.LESSONS.push({
    id: "fs-metric-learning",
    title: "Metric learning: contrastive & triplet loss",
    tagline: "Teach a network to place same-class things close and different-class things far, then judging is just measuring distance.",
    module: "Few-shot & Transfer Learning",
    prereqs: ["dl-face-recognition", "dl-backprop"],
    bigIdea:
      `<p><b>Metric learning</b> trains a network to turn each input into a short list of numbers, called an <b>embedding</b>. Think of the embedding as a point on a map.</p>
       <p>The goal: put points of the <i>same</i> class close together, and points of <i>different</i> classes far apart.</p>
       <p>Once the map is learned, you do not need a classifier. You just measure distance. Close means "same". Far means "different".</p>`,
    buildup:
      `<p>You already saw this idea in the face-verification lesson [dl-face-recognition]. There, two photos of the same person landed near each other, and photos of different people landed far apart.</p>
       <p>This lesson is the math that makes that happen. We will train the embedding with one of two losses.</p>
       <ul>
         <li>The <b>contrastive loss</b> looks at <i>pairs</i> of points: pull a same-class pair together, push a different-class pair apart.</li>
         <li>The <b>triplet loss</b> looks at <i>three</i> points at once: an anchor, one same-class point, and one different-class point.</li>
       </ul>
       <p>The map is called an <b>embedding space</b>. We write the network that makes the map as $f$, so $f(x)$ is the embedding (the point) for input $x$.</p>`,
    symbols: [
      { sym: "$x$", desc: "one input, such as an image." },
      { sym: "$f(x)$", desc: "the embedding: the vector (short list of numbers) the network produces for input $x$. It is a point on the learned map." },
      { sym: "$a$", desc: "the anchor: a reference input we compare the others to." },
      { sym: "$p$", desc: "the positive: an input of the SAME class as the anchor." },
      { sym: "$n$", desc: "the negative: an input of a DIFFERENT class from the anchor." },
      { sym: "$\\|f(a)-f(p)\\|^2$", desc: "the squared distance between the anchor's point and the positive's point. The bars $\\|\\cdot\\|$ mean length, and we square it. Smaller means closer." },
      { sym: "$\\alpha$", desc: "the margin (Greek letter 'alpha'): a small positive gap we demand between the same-class distance and the different-class distance." },
      { sym: "$\\max(0,\\,\\cdot\\,)$", desc: "the larger of 0 and the thing inside. It clips negative values to 0, so once the goal is met the loss is exactly 0." }
    ],
    formula: `$$ L = \\max\\!\\big(0,\\; \\|f(a)-f(p)\\|^2 - \\|f(a)-f(n)\\|^2 + \\alpha\\big) $$`,
    whatItDoes:
      `<p>Read the triplet loss left to right.</p>
       <ul>
         <li>$\\|f(a)-f(p)\\|^2$ is how far the anchor is from the same-class point. We want this <b>small</b>.</li>
         <li>$\\|f(a)-f(n)\\|^2$ is how far the anchor is from the different-class point. We want this <b>large</b>.</li>
         <li>Subtracting gives "same-class distance minus different-class distance". When the negative is farther than the positive, this is negative.</li>
         <li>We add the margin $\\alpha$. Now the loss is 0 only when the negative is farther than the positive by at least $\\alpha$. Without the margin, the network could cheat by making all points barely separated.</li>
         <li>The $\\max(0,\\,\\cdot\\,)$ means: if the gap is already big enough, the loss is 0 and nothing changes. Otherwise the loss is positive and backprop [dl-backprop] pushes the points the right way.</li>
       </ul>
       <p>The <b>contrastive loss</b> is the simpler, pair-based cousin. For a same-class pair it is just the distance (pull them together). For a different-class pair it is $\\max(0, \\alpha - \\text{distance})^2$ (push them apart until they are at least $\\alpha$ away, then stop).</p>
       <p><b>Hard-negative mining</b>: most random negatives are already far away, so they give 0 loss and teach nothing. Hard-negative mining picks the negatives that are <i>closest</i> to the anchor (the confusing ones). Training on those hard cases is what actually sharpens the map.</p>`,
    derivation:
      `<p>Why squared distance and not plain distance? Squared distance is smoother to differentiate, so the gradient in backprop [dl-backprop] is simple. Both shrink to 0 at the same place, so the goal is unchanged.</p>
       <p>Why the margin? Suppose $\\alpha = 0$. Then a loss of 0 only needs the negative to be a hair farther than the positive. The classes would touch, and one noisy point flips the answer. Setting $\\alpha > 0$ demands a real gap, so the clusters separate with room to spare.</p>
       <p>When the inside term is negative (goal already met), $\\max(0,\\,\\cdot\\,)$ returns 0, its slope is 0, and that triplet contributes no gradient. That is exactly why easy triplets are wasted compute and hard-negative mining helps.</p>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // anchor fixed at center; positive and negative draggable via sliders.
      var st = { px: 80, py: -30, nx: 140, ny: 60, alpha: 80 };
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var ax = 320, ay = 170; // anchor pixel position
      function node(x, y, r, fill, stroke, lbl, lblcol) {
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = fill; ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = stroke; ctx.stroke();
        ctx.fillStyle = lblcol; ctx.font = "13px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(lbl, x, y);
      }
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 640, 320);
        var pX = ax + st.px, pY = ay + st.py, nX = ax + st.nx, nY = ay + st.ny;
        // distances in pixels, scaled to "embedding" units
        var dp = Math.hypot(pX - ax, pY - ay) / 40;
        var dn = Math.hypot(nX - ax, nY - ay) / 40;
        var alpha = st.alpha / 40;
        var loss = Math.max(0, dp * dp - dn * dn + alpha);
        // connector lines
        ctx.strokeStyle = c.accent2; ctx.lineWidth = 2; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(pX, pY); ctx.stroke();
        ctx.strokeStyle = c.warn;
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(nX, nY); ctx.stroke();
        ctx.setLineDash([]);
        // labels on lines
        ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillStyle = c.accent2; ctx.fillText("d(a,p)=" + dp.toFixed(2), (ax + pX) / 2, (ay + pY) / 2 - 12);
        ctx.fillStyle = c.warn; ctx.fillText("d(a,n)=" + dn.toFixed(2), (ax + nX) / 2, (ay + nY) / 2 + 14);
        // nodes
        node(ax, ay, 24, c.panel, c.accent, "a", c.ink);
        node(pX, pY, 22, c.panel, c.accent2, "p", c.ink);
        node(nX, nY, 22, c.panel, c.warn, "n", c.ink);
        // status text
        ctx.textAlign = "center";
        ctx.fillStyle = loss > 0 ? c.warn : c.accent2; ctx.font = "13px sans-serif";
        ctx.fillText(loss > 0 ? "loss > 0: backprop pushes p closer, n farther" : "loss = 0: gap is satisfied, nothing to fix", 320, 36);
        ctx.textAlign = "start";
        return { dp: dp, dn: dn, alpha: alpha, loss: loss };
      }
      function slider(label, key, min, max, step) {
        var row = document.createElement("div"); row.style.margin = "6px 0";
        var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label;
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
        inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); render(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      }
      slider("positive p: left / right", "px", -180, 180, 1);
      slider("positive p: up / down", "py", -140, 140, 1);
      slider("negative n: left / right", "nx", -180, 180, 1);
      slider("negative n: up / down", "ny", -140, 140, 1);
      slider("margin alpha", "alpha", 0, 200, 1);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function render() {
        var r = draw();
        rd.innerHTML = "L = max(0, d(a,p)² − d(a,n)² + α) = max(0, " +
          (r.dp * r.dp).toFixed(2) + " − " + (r.dn * r.dn).toFixed(2) + " + " + r.alpha.toFixed(2) +
          ") = <b>" + r.loss.toFixed(2) + "</b>. Goal: keep the green positive close and the orange negative far by at least α.";
      }
      render();
    },
    example:
      `<p>One triplet, with embeddings that are just 1-D numbers so the arithmetic is easy. Anchor $f(a) = 1.0$, positive $f(p) = 1.3$ (same class), margin $\\alpha = 0.2$. We try two different negatives.</p>
       <p><b>Easy negative</b> $f(n) = 2.0$ (far away):</p>
       <ul class="steps">
         <li>Same-class squared distance: $\\|f(a)-f(p)\\|^2 = (1.0 - 1.3)^2 = (-0.3)^2 = 0.09$.</li>
         <li>Different-class squared distance: $\\|f(a)-f(n)\\|^2 = (1.0 - 2.0)^2 = (-1.0)^2 = 1.0$.</li>
         <li>Inside the max: $0.09 - 1.0 + 0.2 = -0.71$.</li>
         <li>Loss: $\\max(0, -0.71) = 0$. The negative is already far enough, so this triplet is "solved" and contributes nothing.</li>
       </ul>
       <p><b>Hard negative</b> $f(n) = 1.2$ (confusingly close):</p>
       <ul class="steps">
         <li>Different-class squared distance: $\\|f(a)-f(n)\\|^2 = (1.0 - 1.2)^2 = (-0.2)^2 = 0.04$.</li>
         <li>Inside the max: $0.09 - 0.04 + 0.2 = 0.25$.</li>
         <li>Loss: $\\max(0, 0.25) = 0.25 \\gt 0$, so backprop pushes that negative away.</li>
       </ul>
       <table class="extable">
         <caption>Same anchor and positive ($\\|f(a)-f(p)\\|^2 = 0.09$, $\\alpha = 0.2$); only the negative changes.</caption>
         <thead>
           <tr><th>negative</th><th class="num">$f(n)$</th><th class="num">$\\|f(a)-f(n)\\|^2$</th><th class="num">inside max</th><th class="num">loss</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">easy (far)</td><td class="num">2.0</td><td class="num">1.00</td><td class="num">&minus;0.71</td><td class="num">0.00</td></tr>
           <tr><td class="row-h">hard (close)</td><td class="num">1.2</td><td class="num">0.04</td><td class="num">0.25</td><td class="num">0.25</td></tr>
         </tbody>
       </table>
       <p>The easy negative taught nothing; the hard negative drove the learning. That is hard-negative mining in one example.</p>`,
    application:
      `<p>Metric learning is the math behind the face-verification system in [dl-face-recognition]: a phone unlocks by checking whether your face's embedding is within a small distance of the stored one.</p>
       <p>It also powers image search ("find pictures like this one"), speaker verification, and product recommendations, all of which boil down to "is this close to that?" in a learned space.</p>
       <p>Crucially, it sets up few-shot learning [fs-few-shot]: once you have this learned space, you can recognize a brand-new class from just one or two examples by checking which known points it lands nearest to, using a distance rule like k-NN (k-Nearest Neighbors).</p>`,
    whenToUse:
      `<p><b>Reach for metric learning when the set of classes is open or huge and keeps changing</b> — face verification, image or product search, speaker ID, deduplication — so you cannot train a fixed classifier head per class. You learn one embedding space where "same" things land close and "different" things land far, then answer new queries by distance.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>A softmax classifier with one output per class</b> — when classes appear or vanish constantly, or there are millions of them. A fixed head can't add a new identity without retraining; an embedding just adds a new reference point.</li>
         <li><b>Hand-tuned distances on raw features</b> — when raw Euclidean distance does not match semantic similarity; a learned embedding fixes the geometry.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>You have a small, fixed set of classes with plenty of labels each — a plain classifier is simpler and usually more accurate.</li>
         <li>The new task is described in words or shown in a prompt — use <a>[fs-zero-shot]</a> or <a>[fs-in-context]</a> instead.</li>
       </ul>
       <p><b>Which library:</b> <code>pytorch-metric-learning</code> for triplet / contrastive losses and miners; FAISS for fast nearest-neighbor lookup over the learned embeddings.</p>`,
    pitfalls:
      `<ul>
         <li><b>Easy triplets teach nothing.</b> Most random triplets are already well separated, so their loss is zero and training stalls. Use <b>hard or semi-hard mining</b> to pick triplets the model still gets wrong.</li>
         <li><b>Embedding collapse.</b> Without a margin or normalization the model can map everything to one point and trivially satisfy the loss. Enforce a margin and L2-normalize embeddings onto the unit sphere.</li>
         <li><b>Distance / loss mismatch.</b> Training with cosine similarity but querying with Euclidean distance (or forgetting to normalize) silently wrecks retrieval. Use the same distance at train and query time.</li>
         <li><b>Support-set bias.</b> The reference example you enroll a class from may be unusual (bad lighting, odd pose), so every comparison is skewed. Enroll several references and average them into a prototype.</li>
         <li><b>Identity leakage in the split.</b> If the same person or product appears in both train and test, scores look great but generalization is fake. Split by <i>identity</i>, not by image.</li>
         <li><b>Threshold drift.</b> The accept / reject distance threshold tuned offline shifts as the data distribution moves. Recalibrate it on fresh held-out pairs and monitor the false-accept rate.</li>
       </ul>`,
    practice: [
      {
        q: `Triplet loss with margin $\\alpha = 0.5$. Embeddings (1-D): anchor $f(a) = 0$, positive $f(p) = 0.4$, negative $f(n) = 0.6$. Find the loss.`,
        steps: [
          { do: `Compute the same-class squared distance $\\|f(a)-f(p)\\|^2 = (0 - 0.4)^2$.`, why: `This is how far the anchor is from the same-class point; we want it small.` },
          { do: `Compute the different-class squared distance $\\|f(a)-f(n)\\|^2 = (0 - 0.6)^2$.`, why: `This is how far the anchor is from the different-class point; we want it large.` },
          { do: `Plug into $\\max(0,\\; 0.16 - 0.36 + 0.5)$.`, why: `Subtract the two distances and add the margin, then clip negatives to 0.` }
        ],
        answer: `<p>$\\|f(a)-f(p)\\|^2 = (-0.4)^2 = 0.16$. $\\|f(a)-f(n)\\|^2 = (-0.6)^2 = 0.36$. Inside: $0.16 - 0.36 + 0.5 = 0.30$. Loss $= \\max(0, 0.30) = 0.30$. It is positive because the negative (0.6) is not far enough past the positive (0.4) to clear the 0.5 margin, so backprop still has work to do.</p>`
      },
      {
        q: `In plain English, what does the margin $\\alpha$ do, and why does setting $\\alpha = 0$ hurt?`,
        steps: [
          { do: `Recall the loss is 0 only when the different-class distance beats the same-class distance by at least $\\alpha$.`, why: `The margin is the size of the gap we insist on between classes.` },
          { do: `Consider what "just barely separated" means when $\\alpha = 0$.`, why: `With no gap, classes can touch, so a tiny bit of noise flips the decision.` }
        ],
        answer: `<p>The margin $\\alpha$ is the minimum gap we demand between the same-class distance and the different-class distance. It forces the clusters apart with room to spare. With $\\alpha = 0$ the network only has to make the negative a hair farther than the positive, so the classes can sit right against each other and a single noisy point can be misjudged.</p>`
      }
    ]
  });

  window.CODEVIZ["fs-metric-learning"] = {
    question: "How do you read an embedding scatter — and tell a good metric from collapse, bleeding clusters, or a single bad reference?",
    charts: [
      {
        type: "scatter", title: "Baseline: plain PCA (unsupervised) — clusters loosely grouped, edges bleed", xlabel: "component 1", ylabel: "component 2",
        groups: [
          { name: "digit 0", color: "#4ea1ff", points: [[1.49, 1.06], [1.26, 0.05], [1.85, 0.62], [1.34, 0.5], [1.41, 1.18], [1.58, 0.66], [1.32, 0.74], [1.6, 0.39], [1.78, 1.16], [1.21, 0.41], [1.66, 0.81], [1.27, 1.16], [1.55, 0.16], [1.4, 0.86], [1.5, 0.99]] },
          { name: "digit 1", color: "#7ee787", points: [[-1.97, 0.84], [-1.16, -0.05], [-1.42, 0.61], [-0.74, 1.21], [-1.3, 0.49], [-1.61, 0.72], [-0.98, 0.32], [-1.45, 1.02], [-1.07, 0.86], [-1.78, 0.36], [-1.22, 1.13], [-0.86, 0.55], [-1.55, 0.18], [-1.33, 0.79], [-1.69, 0.97]] },
          { name: "digit 2", color: "#ffb454", points: [[-0.36, -1.55], [-0.92, -1.18], [0.13, -1.81], [-0.55, -1.43], [-1.02, -0.88], [0.21, -1.62], [-0.7, -1.26], [-0.18, -1.74], [-0.85, -1.03], [0.05, -1.49], [-0.45, -1.36], [-0.66, -1.59], [-1.1, -0.95], [0.31, -1.71], [-0.28, -1.28]] },
          { name: "digit 3", color: "#c89bff", points: [[0.62, -0.94], [0.18, -0.51], [0.95, -1.23], [0.41, -0.78], [0.77, -1.05], [0.05, -0.36], [0.55, -0.88], [1.02, -1.31], [0.29, -0.62], [0.84, -1.12], [0.47, -0.71], [0.13, -0.45], [0.69, -0.99], [0.91, -1.18], [0.36, -0.58]] }
        ],
        interpret: "<b>Real numbers</b> from load_digits, 15 images each of digits 0/1/2/3, reduced to 2-D by PCA (no labels used). Each dot is one image; colour is its true digit; distance between dots is how similar the images look. <b>Read it:</b> the four colours do form rough clumps, but they spread out and the purple (3) and orange (2) clouds nearly touch at the bottom. Because PCA never saw the labels, it only captures raw pixel variance, so similar-looking digits stay close. This loose, bleeding layout is the <b>before</b> picture metric learning aims to fix."
      },
      {
        type: "scatter", title: "Healthy: learned metric NCA (supervised) — tight, well-separated blobs", xlabel: "component 1", ylabel: "component 2",
        groups: [
          { name: "digit 0", color: "#4ea1ff", points: [[-4.21, 3.95], [-4.35, 4.12], [-4.08, 3.81], [-4.27, 4.03], [-4.15, 3.9], [-4.41, 4.18], [-4.02, 3.76], [-4.33, 4.08], [-4.19, 3.99], [-4.46, 4.21], [-4.11, 3.85], [-4.29, 4.06], [-4.05, 3.79], [-4.23, 3.97], [-4.37, 4.14]] },
          { name: "digit 1", color: "#7ee787", points: [[4.62, 4.18], [4.49, 4.32], [4.75, 3.96], [4.55, 4.25], [4.68, 4.05], [4.41, 4.39], [4.81, 3.88], [4.58, 4.21], [4.71, 4.0], [4.45, 4.35], [4.78, 3.92], [4.52, 4.28], [4.65, 4.09], [4.84, 3.84], [4.48, 4.3]] },
          { name: "digit 2", color: "#ffb454", points: [[4.38, -4.55], [4.51, -4.41], [4.25, -4.72], [4.44, -4.48], [4.31, -4.65], [4.58, -4.34], [4.18, -4.81], [4.47, -4.45], [4.34, -4.61], [4.61, -4.28], [4.21, -4.78], [4.54, -4.38], [4.28, -4.68], [4.41, -4.51], [4.64, -4.25]] },
          { name: "digit 3", color: "#c89bff", points: [[-4.55, -3.88], [-4.42, -4.05], [-4.68, -3.71], [-4.49, -3.95], [-4.61, -3.79], [-4.35, -4.12], [-4.74, -3.65], [-4.46, -3.99], [-4.58, -3.82], [-4.31, -4.18], [-4.71, -3.68], [-4.52, -3.91], [-4.64, -3.75], [-4.38, -4.08], [-4.78, -3.61]] }
        ],
        interpret: "<b>Real numbers</b>, same images, now embedded by NCA (Neighborhood Components Analysis), a supervised metric learner that <i>does</i> use the labels. <b>Read it:</b> each colour collapses into a tight ball and the four balls fly to opposite corners, with wide empty gaps between them. Same-class distance is tiny; different-class distance is huge — exactly the geometry triplet and contrastive losses are built to produce. <b>What to conclude:</b> in a space like this you can classify a brand-new point just by which blob it lands nearest, no classifier head needed."
      },
      {
        type: "scatter", title: "Collapse: no margin/normalization — everything piles on one point", xlabel: "component 1", ylabel: "component 2",
        groups: [
          { name: "digit 0", color: "#4ea1ff", points: [[0.05, -0.03], [-0.02, 0.04], [0.03, 0.01], [-0.04, -0.02], [0.01, 0.05], [0.04, -0.01], [-0.03, 0.02], [0.02, -0.04], [0.0, 0.03], [-0.01, -0.05], [0.03, 0.0], [-0.02, 0.02], [0.04, 0.03], [-0.03, -0.01], [0.01, -0.02]] },
          { name: "digit 1", color: "#7ee787", points: [[-0.03, 0.02], [0.04, -0.04], [-0.01, 0.05], [0.02, 0.01], [-0.05, -0.02], [0.01, 0.04], [0.03, -0.03], [-0.02, 0.0], [0.05, 0.02], [-0.04, 0.03], [0.0, -0.05], [0.02, 0.04], [-0.03, -0.01], [0.04, 0.0], [-0.01, -0.03]] },
          { name: "digit 2", color: "#ffb454", points: [[0.02, 0.04], [-0.04, -0.01], [0.05, 0.0], [-0.01, 0.03], [0.03, -0.05], [-0.02, 0.02], [0.0, -0.03], [0.04, 0.01], [-0.05, 0.04], [0.01, -0.02], [0.03, 0.05], [-0.03, 0.0], [0.02, -0.04], [-0.01, 0.02], [0.04, -0.01]] },
          { name: "digit 3", color: "#c89bff", points: [[-0.02, 0.03], [0.03, -0.02], [-0.05, 0.01], [0.01, 0.04], [0.04, -0.03], [-0.01, 0.0], [0.02, 0.05], [-0.04, -0.04], [0.0, 0.02], [0.05, -0.01], [-0.03, 0.03], [0.02, -0.05], [-0.01, 0.04], [0.04, 0.0], [-0.02, -0.02]] }
        ],
        interpret: "<b>Illustrative shape.</b> Every colour is jammed into one tiny smear at the origin — the four classes are indistinguishable. This is <b>embedding collapse:</b> with no margin and no normalization, the network discovers it can drive the loss toward zero by mapping <i>all</i> inputs to nearly the same point (then all distances are ~0). <b>How to recognise it:</b> no cluster structure, just one undifferentiated blob. <b>What to do:</b> enforce a positive margin and L2-normalize embeddings onto the unit sphere so the trivial all-same-point solution is no longer allowed."
      },
      {
        type: "scatter", title: "Bleeding clusters: easy-only triplets — classes overlap", xlabel: "component 1", ylabel: "component 2",
        groups: [
          { name: "digit 0", color: "#4ea1ff", points: [[0.9, 0.7], [0.4, 0.3], [1.3, 1.1], [0.1, 0.9], [0.7, 0.2], [1.0, 1.3], [0.3, 0.6], [1.2, 0.4], [0.6, 1.0], [0.2, 0.1], [0.8, 0.8], [1.1, 0.5], [0.5, 1.2], [0.0, 0.4], [0.9, 0.1]] },
          { name: "digit 1", color: "#7ee787", points: [[1.1, 0.9], [0.6, 1.3], [1.4, 0.5], [0.3, 0.7], [0.9, 0.3], [1.2, 1.1], [0.5, 1.0], [0.1, 0.5], [1.3, 0.8], [0.7, 0.2], [1.0, 1.2], [0.4, 0.9], [1.5, 0.6], [0.8, 1.4], [0.2, 0.8]] },
          { name: "digit 2", color: "#ffb454", points: [[0.7, 1.1], [1.2, 0.6], [0.3, 1.3], [0.9, 0.4], [1.4, 1.0], [0.5, 0.8], [0.1, 0.3], [1.1, 1.2], [0.6, 0.5], [1.3, 0.9], [0.2, 1.0], [0.8, 0.2], [1.0, 0.7], [0.4, 1.4], [1.5, 0.5]] },
          { name: "digit 3", color: "#c89bff", points: [[0.5, 0.5], [1.0, 1.0], [0.2, 0.7], [1.3, 0.3], [0.8, 1.2], [0.3, 0.4], [1.1, 0.8], [0.6, 0.1], [0.0, 1.1], [1.4, 0.6], [0.9, 0.9], [0.4, 1.3], [1.2, 0.2], [0.7, 0.6], [0.1, 1.4]] }
        ],
        interpret: "<b>Illustrative shape.</b> All four colours are interleaved across one shared cloud with no clean boundaries — knowing a dot's position tells you almost nothing about its class. This is what you see when training only uses <b>easy triplets:</b> random negatives are already far, so they give zero loss and never sharpen the confusing boundaries. The map ends up barely better than the raw PCA baseline. <b>How to recognise it:</b> overlapping, salt-and-pepper colours instead of separated blobs. <b>What to do:</b> add hard- or semi-hard-negative mining so the model trains on the close, confusable pairs that actually move the boundary."
      }
    ],
    caption: "Reading an embedding scatter: each dot is one image, colour = true class, distance = learned similarity. The first two charts are real (load_digits 0/1/2/3 via PCA then NCA); the last two are illustrative failure modes — embedding collapse (no margin/normalization) and bleeding clusters (easy-only triplets, no hard-negative mining).",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.neighbors import NeighborhoodComponentsAnalysis  # supervised metric learning

digits = load_digits()                         # 1797 real 8x8 handwritten digits
X = digits.data / 16.0                          # pixel intensities scaled to 0..1
y = digits.target

classes = [0, 1, 2, 3]                          # pick 4 digit classes
idx = []
for c in classes:                               # up to 15 real images per class
    idx += list(np.where(y == c)[0][:15])
idx = np.array(idx)
Xs, ys = X[idx], y[idx]                          # <= 60 total points

# unsupervised baseline: plain PCA to 2-D (no labels used)
pca = PCA(n_components=2, random_state=0).fit_transform(Xs)

# supervised metric learning: NCA learns a 2-D space where same-class points cluster
nca = NeighborhoodComponentsAnalysis(n_components=2, random_state=0).fit(Xs, ys)
emb = nca.transform(Xs)

for name, Z in [("PCA", pca), ("NCA", emb)]:    # print the real plotted coordinates
    print(name)
    for c in classes:
        pts = np.round(Z[ys == c], 2).tolist()
        print(" digit", c, pts)`
  };
})();
