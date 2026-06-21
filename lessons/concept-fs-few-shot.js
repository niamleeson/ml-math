/* =====================================================================
   CONCEPT LESSON — One-shot & few-shot learning (Prototypical Networks).
   Self-contained: pushes one lesson into window.LESSONS and registers one
   window.CODEVIZ entry. Same beginner style as the other modules:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   The CODEVIZ numbers are REAL: computed with numpy/scikit-learn on the
   bundled load_digits dataset (1797 real 8x8 handwritten digit images),
   averaged over 200 random episodes.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fs-few-shot",
    title: "One-shot & few-shot learning",
    tagline: "Learn a brand-new class from a single picture, or just a handful, by averaging them into a prototype.",
    module: "Few-shot & Transfer Learning",
    prereqs: ["fs-metric-learning"],

    bigIdea:
      `<p>Usually a model needs hundreds or thousands of labeled examples per class to learn it.</p>
       <p><b>Few-shot learning</b> breaks that rule. You show the model a brand-new class with only a handful of labeled examples and it recognizes more of that class right away.</p>
       <p><b>One-shot learning</b> is the extreme case: just <i>one</i> labeled example of the new class.</p>
       <p>A person can do this. See one photo of a new animal, then spot that animal again. We want a model that does the same.</p>`,

    buildup:
      `<p>Few-shot tasks are described with two numbers: <b>N-way K-shot</b>.</p>
       <p><b>N-way</b> means there are $N$ different classes to tell apart in this task (for example, 5 classes).</p>
       <p><b>K-shot</b> means you get $K$ labeled examples of each class to learn from (for example, 1, 2, or 5 each).</p>
       <p>One round of this little task is called an <b>episode</b>. An episode has two piles of data:</p>
       <ul class="steps">
         <li>The <b>support set</b>: the few labeled examples you are allowed to learn from ($K$ per class).</li>
         <li>The <b>query set</b>: new, unlabeled examples of those same classes. You must guess their class.</li>
       </ul>
       <p>So a 5-way 1-shot episode gives you 5 classes, 1 labeled example each (5 support examples total), and then asks you to label fresh queries.</p>
       <p>The trick that makes this work: a good <b>embedding</b> $f(x)$ that already turns similar things into nearby points. We borrow that from <a onclick="App.open('fs-metric-learning')">metric learning</a> and <a onclick="App.open('fs-transfer-learning')">transfer learning</a>.</p>`,

    symbols: [
      { sym: "$x$", desc: "one example (for instance, an image). It is the raw input." },
      { sym: "$f(x)$", desc: "the embedding of $x$: a list of numbers (a vector) that captures its meaning. Similar inputs get nearby vectors." },
      { sym: "$N$", desc: "the number of classes in the task ('N-way'). Example: 5 classes." },
      { sym: "$K$", desc: "the number of labeled examples per class ('K-shot'). One-shot means $K = 1$." },
      { sym: "$S_k$", desc: "the support set of class $k$: the $K$ labeled examples we were given for that one class." },
      { sym: "$|S_k|$", desc: "how many examples are in $S_k$. This equals $K$." },
      { sym: "$c_k$", desc: "the prototype of class $k$: the average (mean) embedding of that class's support examples. One vector that stands for the class." },
      { sym: "$\\|\\,\\cdot\\,\\|^2$", desc: "the squared distance between two vectors: how far apart they are, squared. Smaller means more alike." },
      { sym: "$\\hat{y}$", desc: "the predicted class for a query (the little hat means 'our guess')." },
      { sym: "$\\arg\\min_k$", desc: "'the class $k$ that makes the thing smallest'. Here, the class whose prototype is nearest." }
    ],

    formula: `$$ c_k = \\frac{1}{|S_k|}\\sum_{x_i \\in S_k} f(x_i) \\qquad\\qquad \\hat{y} = \\arg\\min_k \\big\\| f(x) - c_k \\big\\|^2 $$`,

    whatItDoes:
      `<p>This is the recipe for a <b>Prototypical Network</b>. It has two steps.</p>
       <p><b>Step 1 — make a prototype.</b> For each class $k$, embed every support example with $f$, then average those vectors. That average $c_k$ is the prototype: a single point that represents the whole class. The big $\\sum$ means 'add them all up', and dividing by $|S_k|$ (the count) turns the sum into a mean.</p>
       <p><b>Step 2 — classify by nearest prototype.</b> Take a query $x$, embed it to $f(x)$, and measure the squared distance to each prototype. The closest prototype wins. That winning class is $\\hat{y}$.</p>
       <p>For <b>one-shot</b> ($K = 1$) the average is over a single example, so the prototype <i>is</i> that one embedded example. With more shots, the prototype is a steadier average and the guesses get better.</p>`,

    derivation:
      `<p><b>Why averaging is the right thing to do.</b> Suppose each class is a fuzzy blob of points in embedding space, scattered around some true center. The best one-vector summary of a blob — the point with the smallest total squared distance to all its members — is exactly the mean of those points. So $c_k$, the average of the support embeddings, is the natural center of class $k$.</p>
       <p><b>Why nearest-prototype is the right rule.</b> If every class blob has a similar round shape, then asking 'which center is closest in squared distance?' is the same as asking 'which class most likely produced this point?'. Picking the smallest $\\| f(x) - c_k \\|^2$ is just picking the most likely class. That is the whole classifier.</p>
       <p><b>Why it only works with a good embedding.</b> All of this assumes that $f$ already places same-class examples close together and different classes far apart. If $f$ scrambled things, the blobs would overlap, the averages would land in meaningless spots, and nearest-prototype would guess no better than chance. The embedding does the hard work; the prototype step is the cheap, fast part that needs no new training when a brand-new class shows up. That is why few-shot learning leans on metric learning and transfer learning to build $f$ first.</p>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // Two class blobs in 2-D embedding space. Slider K picks how many support
      // points per class; prototype = mean of the chosen support points; a movable
      // query is classified by the nearest prototype.
      var seed = 7;
      function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      function gauss() { var u = Math.max(1e-9, rnd()), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
      var centerA = [-1.2, 0.3], centerB = [1.3, -0.2], spread = 0.55;
      var ptsA = [], ptsB = [];
      for (var i = 0; i < 20; i++) {
        ptsA.push([centerA[0] + gauss() * spread, centerA[1] + gauss() * spread]);
        ptsB.push([centerB[0] + gauss() * spread, centerB[1] + gauss() * spread]);
      }
      var st = { K: 1, qx: 0.1, qy: 0.6 };
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 320; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      // world -> screen
      var xmin = -3, xmax = 3, ymin = -2.4, ymax = 2.4, padL = 40, padR = 20, padT = 16, padB = 28;
      function sx(x) { return padL + (x - xmin) / (xmax - xmin) * (cv.width - padL - padR); }
      function sy(y) { return cv.height - padB - (y - ymin) / (ymax - ymin) * (cv.height - padT - padB); }
      function proto(pts, K) {
        var mx = 0, my = 0; for (var j = 0; j < K; j++) { mx += pts[j][0]; my += pts[j][1]; }
        return [mx / K, my / K];
      }
      function dot(x, y, r, fill, stroke) { ctx.beginPath(); ctx.arc(sx(x), sy(y), r, 0, 7); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.lineWidth = 2; ctx.strokeStyle = stroke; ctx.stroke(); } }
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, cv.width, cv.height);
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(sx(xmin), sy(0)); ctx.lineTo(sx(xmax), sy(0)); ctx.moveTo(sx(0), sy(ymin)); ctx.lineTo(sx(0), sy(ymax)); ctx.stroke();
        // all class points: support points are bright, the rest are faded
        for (var a = 0; a < ptsA.length; a++) dot(ptsA[a][0], ptsA[a][1], 4, a < st.K ? c.accent : "rgba(78,161,255,0.22)");
        for (var b = 0; b < ptsB.length; b++) dot(ptsB[b][0], ptsB[b][1], 4, b < st.K ? c.accent2 : "rgba(126,231,135,0.22)");
        var pA = proto(ptsA, st.K), pB = proto(ptsB, st.K);
        // prototypes (big ringed markers)
        dot(pA[0], pA[1], 9, c.accent, c.ink); dot(pB[0], pB[1], 9, c.accent2, c.ink);
        ctx.fillStyle = c.ink; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("prototype A", sx(pA[0]), sy(pA[1]) - 14);
        ctx.fillText("prototype B", sx(pB[0]), sy(pB[1]) - 14);
        // query
        var dA = (st.qx - pA[0]) * (st.qx - pA[0]) + (st.qy - pA[1]) * (st.qy - pA[1]);
        var dB = (st.qx - pB[0]) * (st.qx - pB[0]) + (st.qy - pB[1]) * (st.qy - pB[1]);
        var winA = dA <= dB;
        // line from query to the nearest prototype
        ctx.strokeStyle = winA ? c.accent : c.accent2; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(sx(st.qx), sy(st.qy)); ctx.lineTo(sx(winA ? pA[0] : pB[0]), sy(winA ? pA[1] : pB[1])); ctx.stroke();
        dot(st.qx, st.qy, 7, c.warn, c.ink);
        ctx.fillStyle = c.warn; ctx.fillText("query", sx(st.qx), sy(st.qy) - 14);
        ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "start";
        ctx.fillText("embedding space (2-D)", padL, cv.height - 8);
        ctx.textAlign = "start";
        return { pA: pA, pB: pB, dA: dA, dB: dB, winA: winA };
      }
      function slider(label, key, min, max, step) {
        var row = document.createElement("div"); row.style.margin = "6px 0";
        var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label + " = " + st[key];
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
        inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); lab.textContent = label + " = " + st[key]; render(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      }
      slider("K (shots per class)", "K", 1, 20, 1);
      slider("query x", "qx", -3, 3, 0.1);
      slider("query y", "qy", -2.4, 2.4, 0.1);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function render() {
        var r = draw();
        rd.innerHTML = "Prototype A = mean of " + st.K + " blue support point(s); prototype B = mean of " + st.K + " green one(s).<br>" +
          "Squared distance to A = <b style='color:" + C().accent + "'>" + r.dA.toFixed(2) + "</b>, to B = <b style='color:" + C().accent2 + "'>" + r.dB.toFixed(2) + "</b> → nearest prototype is <b>" + (r.winA ? "A" : "B") + "</b>, so the query is labeled class " + (r.winA ? "A" : "B") + ".";
      }
      render();
    },

    example:
      `<p>A tiny <b>2-way 1-shot</b> task in embedding space (so each example is just a 2-number vector $f(x)$).</p>
       <p>Support set: one example of class A at $f = [0, 0]$, and one example of class B at $f = [4, 0]$.</p>
       <ul class="steps">
         <li><b>Build prototypes.</b> With one example each, the prototype is that example. So $c_A = [0, 0]$ and $c_B = [4, 0]$.</li>
         <li><b>A query arrives</b> at $f(x) = [1, 0]$. Measure squared distances.</li>
         <li>To A: $\\|[1,0] - [0,0]\\|^2 = 1^2 + 0^2 = 1$.</li>
         <li>To B: $\\|[1,0] - [4,0]\\|^2 = (-3)^2 + 0^2 = 9$.</li>
         <li>$1 &lt; 9$, so the nearest prototype is A. Predict $\\hat{y} = A$.</li>
       </ul>
       <p>Now add a second shot to class A at $[2, 0]$. The prototype moves to the mean: $c_A = \\frac{[0,0] + [2,0]}{2} = [1, 0]$. The query at $[1,0]$ now sits right on $c_A$ (distance 0) — extra shots steadied the prototype and made the call even more confident.</p>`,

    application:
      `<p>Few-shot learning shines when labels are scarce or new classes appear constantly. A face-unlock system enrolls you from a couple of photos (a few-shot support set) and then recognizes you forever after — no retraining. Drug-discovery and rare-disease models classify molecules or scans from only a handful of known cases. Product-catalog systems add a brand-new item from one reference photo. In every case a strong embedding is trained once, then new classes are handled for free by building a prototype.</p>
       <p>This is a different flavor from <a onclick="App.open('fs-in-context')">in-context few-shot learning</a>, where a large language model is simply <i>shown</i> a few examples inside its prompt and adapts without any prototypes or distance math. And it differs from <a onclick="App.open('fs-meta-learning')">meta-learning</a>, which trains a model to be good at <i>learning</i> from few examples across many tasks. Prototypical Networks are one clean, popular member of that broader few-shot family.</p>`,

    practice: [
      {
        q: `In a <b>3-way 5-shot</b> episode, how many labeled examples are in the support set, and what is $K$ for a one-shot version?`,
        steps: [
          { do: `Read off N and K. "3-way" means $N = 3$ classes. "5-shot" means $K = 5$ examples per class.`, why: `N-way K-shot fully describes the task size.` },
          { do: `Support size = $N \\times K = 3 \\times 5 = 15$ labeled examples.`, why: `Each of the 3 classes contributes its own 5 support examples.` },
          { do: `One-shot means $K = 1$.`, why: `One-shot is just the special case of K-shot with a single example per class.` }
        ],
        answer: `15 support examples; one-shot is $K = 1$.`
      },
      {
        q: `Class P has support embeddings $[2, 0]$ and $[4, 0]$. Class Q has support embeddings $[0, 4]$ and $[0, 6]$. A query embeds to $f(x) = [1, 1]$. Which class does a Prototypical Network predict?`,
        steps: [
          { do: `Prototype of P: average the two vectors. $c_P = \\frac{[2,0] + [4,0]}{2} = [3, 0]$.`, why: `The prototype is the mean embedding of that class's support set.` },
          { do: `Prototype of Q: $c_Q = \\frac{[0,4] + [0,6]}{2} = [0, 5]$.`, why: `Same averaging rule, applied to class Q.` },
          { do: `Squared distance to P: $\\|[1,1] - [3,0]\\|^2 = (-2)^2 + 1^2 = 4 + 1 = 5$.`, why: `Squared distance sums the squared gaps in each coordinate.` },
          { do: `Squared distance to Q: $\\|[1,1] - [0,5]\\|^2 = 1^2 + (-4)^2 = 1 + 16 = 17$.`, why: `Compare the query to every prototype.` },
          { do: `Pick the smallest: $5 &lt; 17$, so prototype P is nearest.`, why: `$\\hat{y} = \\arg\\min_k \\| f(x) - c_k \\|^2$ chooses the nearest prototype.` }
        ],
        answer: `Class P (distance 5 to P beats 17 to Q).`
      },
      {
        q: `Why does a Prototypical Network barely work if the embedding $f$ has not already been trained to group similar inputs together?`,
        steps: [
          { do: `Recall what the prototype depends on. Each prototype $c_k$ is a mean of embeddings $f(x_i)$.`, why: `If those embeddings are meaningless, their average is meaningless too.` },
          { do: `Recall the decision rule: nearest prototype by distance in embedding space.`, why: `The whole method assumes distance in that space reflects class similarity.` },
          { do: `If $f$ does not separate classes, the class blobs overlap and prototypes land in tangled spots.`, why: `Nearest-prototype then guesses near chance because the geometry carries no class information.` }
        ],
        answer: `The method does no per-class training; it relies entirely on $f$ placing same-class inputs near each other. A bad embedding gives overlapping blobs and near-random predictions.`
      }
    ]
  });

  window.CODEVIZ["fs-few-shot"] = {
    question: "On real handwritten digits, how much does few-shot accuracy improve as you go from one-shot to many shots per class?",
    charts: [{
      type: "line", title: "5-way prototypical accuracy vs shots per class (real load_digits)", xlabel: "shots per class K", ylabel: "query accuracy",
      series: [{
        name: "prototypical accuracy", color: "#7ee787",
        points: [[1, 0.768], [2, 0.847], [5, 0.902], [10, 0.925], [20, 0.934]]
      }]
    }],
    caption: "Real result on load_digits (classes 0-4, embedded once with NeighborhoodComponentsAnalysis, averaged over 200 random episodes): one-shot is already ~77% accurate, and adding shots lifts and then plateaus the accuracy toward ~93% — each extra example steadies the class prototype, with sharply diminishing returns after ~5 shots.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NeighborhoodComponentsAnalysis

digits = load_digits()                       # 1797 real 8x8 handwritten digits
X = digits.data / 16.0
y = digits.target

classes = [0, 1, 2, 3, 4]                     # a 5-way task
mask = np.isin(y, classes)
Xc, yc = X[mask], y[mask]

# Embed ONCE with supervised metric learning (groups similar digits together).
Xs = StandardScaler().fit_transform(Xc)
nca = NeighborhoodComponentsAnalysis(n_components=10, random_state=0, max_iter=50)
E = nca.fit_transform(Xs, yc)                 # the embedding f(x)

shots = [1, 2, 5, 10, 20]
rng = np.random.default_rng(0)
acc_by_K = []
for K in shots:
    accs = []
    for _ in range(200):                      # average over 200 random episodes
        chosen = {c: set(rng.choice(np.where(yc == c)[0], K, replace=False))
                  for c in classes}
        protos = np.stack([E[list(chosen[c])].mean(axis=0)     # prototype c_k
                           for c in classes])
        correct = total = 0
        for c in classes:                     # queries = the rest of the class
            pool = [i for i in np.where(yc == c)[0] if i not in chosen[c]]
            for qi in rng.choice(pool, min(20, len(pool)), replace=False):
                d = ((E[qi] - protos) ** 2).sum(axis=1)        # nearest prototype
                correct += (classes[d.argmin()] == c)
                total += 1
        accs.append(correct / total)
    acc_by_K.append(np.mean(accs))

print(list(zip(shots, np.round(acc_by_K, 3))))
# -> [(1, 0.768), (2, 0.847), (5, 0.902), (10, 0.925), (20, 0.934)]`
  };
})();
