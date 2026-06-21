(function () {
  window.LESSONS.push({
    id: "fs-in-context",
    title: "In-context learning (few-shot prompting)",
    tagline: "Show a Large Language Model a few worked examples in the prompt, and it does the task on the spot — no training, no weight changes.",
    module: "Few-shot & Transfer Learning",
    prereqs: ["fs-few-shot", "mod-transformer"],
    bigIdea:
      `<p>A <b>Large Language Model (LLM)</b> is a big neural network trained to predict the next word.</p>
       <p><b>In-context learning</b> is a surprise: you can make the LLM do a brand-new task just by typing a few worked examples into the prompt. The prompt is called the <b>context</b>.</p>
       <p>The amazing part: the model's weights (its internal numbers) do not change at all. It learns the pattern inside one forward pass, by reading the examples you gave it. Read examples, then answer.</p>`,
    buildup:
      `<p>You write the prompt as a short list of demonstrations. Each demonstration is one input paired with its correct output.</p>
       <p>After the examples, you place the real question (the <b>query</b>) and let the model finish it.</p>
       <p>We count the examples with the letter $K$. There are three common settings:</p>
       <ul class="steps">
         <li><b>Zero-shot</b> ($K = 0$): no examples. Just the instruction and the query.</li>
         <li><b>One-shot</b> ($K = 1$): exactly one example, then the query.</li>
         <li><b>Few-shot</b> ($K$ &gt; 1, often 2 to 32): several examples, then the query.</li>
       </ul>
       <p>Notice that none of this is "training". You never run gradient descent. You only change the text you feed in.</p>`,
    symbols: [
      { sym: "$x$", desc: "the query: the new input you want an answer for." },
      { sym: "$y$", desc: "the output the model should produce for the query $x$." },
      { sym: "$K$", desc: "the number of demonstration examples placed in the prompt (the context size)." },
      { sym: "$(x_1, y_1), \\dots, (x_K, y_K)$", desc: "the $K$ demonstration pairs: each is an input $x_i$ next to its correct output $y_i$." },
      { sym: "$p(\\,\\cdot \\mid \\cdot\\,)$", desc: "a conditional probability: 'how likely is the thing on the left, given the things on the right'." }
    ],
    formula: `$$ p\\big(\\, y \\mid x, \\; (x_1,y_1), \\dots, (x_K,y_K) \\,\\big) $$`,
    whatItDoes:
      `<p>Read it as: "the probability of output $y$ for query $x$, <i>given</i> the $K$ demonstration pairs in the prompt."</p>
       <p>The bar $\\mid$ means "given". Everything to the right of it is the context: the query plus the worked examples. The model conditions on all of it at once and predicts $y$.</p>
       <p>The key word is <b>conditioning</b>. The examples are not used to update weights; they just sit in the input and steer the single forward pass that produces the answer.</p>`,
    derivation:
      `<p>How does in-context learning differ from the other few-shot methods? They all face the same problem — learn a task from few examples — but they touch very different things.</p>
       <ul class="steps">
         <li><b>[fs-meta-learning]</b> and <b>[fs-transfer-learning]</b> change the model's <b>weights</b> with gradient descent: they run a few training steps on the new examples. In-context learning runs <i>zero</i> training steps; the weights are frozen.</li>
         <li><b>[fs-few-shot]</b> prototypical networks compute a <b>prototype</b> (the average embedding) for each class, then label a query by nearest prototype. That is an explicit, hand-built rule outside the network.</li>
         <li>In-context learning hides everything inside one forward pass. The <b>attention</b> mechanism of the transformer looks back at the demonstrations while reading the query.</li>
         <li>A leading <b>hypothesis</b>: that attention is quietly doing a nearest-neighbour or regression over the in-context examples. In effect, the model matches the query against the demonstrations and copies the pattern — like prototypical nets, but learned and implicit rather than coded by hand.</li>
       </ul>
       <p>So the same goal (few-shot) is reached three ways: change weights (meta/transfer), compute prototypes (few-shot nets), or condition a frozen model (in-context). ∎</p>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
        var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
        return {
          ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"),
          accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
          border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
        };
      }
      var W = 640, H = 320;
      var cv = document.createElement("canvas"); cv.width = W; cv.height = H; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      // Real-shape proxy curve: accuracy vs K demonstrations per class (k-NN over digit pixels).
      var pts = [[0, 0.102], [1, 0.213], [2, 0.566], [5, 0.794], [10, 0.879], [20, 0.93]];
      var labels = ["zero-shot", "one-shot", "few-shot", "few-shot", "few-shot", "few-shot"];
      var sel = 2;
      var out = document.createElement("div"); out.className = "out"; out.style.cssText = "margin-top:8px;font-size:14px;line-height:1.6";
      function px(k) { return 60 + (k / 20) * (W - 100); }
      function py(a) { return (H - 60) - a * (H - 90); }
      function draw() {
        var c = C(); ctx.clearRect(0, 0, W, H);
        ctx.textBaseline = "alphabetic"; ctx.textAlign = "start";
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(60, 30); ctx.lineTo(60, H - 60); ctx.lineTo(W - 40, H - 60); ctx.stroke();
        ctx.fillStyle = c.dim; ctx.font = "12px sans-serif";
        ctx.fillText("accuracy", 8, 24);
        ctx.fillText("K = number of in-context demonstrations per class", 120, H - 24);
        ctx.fillText("0", 56, H - 46); ctx.fillText("1.0", 40, 36);
        // curve
        ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.beginPath();
        for (var i = 0; i < pts.length; i++) { var X = px(pts[i][0]), Y = py(pts[i][1]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
        // points
        for (var j = 0; j < pts.length; j++) {
          var x = px(pts[j][0]), y = py(pts[j][1]);
          ctx.beginPath(); ctx.fillStyle = (j === sel) ? c.accent2 : c.accent;
          ctx.arc(x, y, (j === sel) ? 7 : 5, 0, 7); ctx.fill();
          ctx.fillStyle = c.dim; ctx.font = "11px sans-serif"; ctx.textAlign = "center";
          ctx.fillText("K=" + pts[j][0], x, H - 46);
          ctx.textAlign = "start";
        }
        out.innerHTML = "At <b>K = " + pts[sel][0] + "</b> demonstrations per class (" + labels[sel] +
          "), the proxy accuracy is <b style='color:" + c.accent2 + "'>" + (pts[sel][1] * 100).toFixed(1) +
          "%</b>.<br>More demonstrations help fast at first, then the curve <b>plateaus</b>: going from K=10 to K=20 barely moves it. Click a point to inspect each setting.";
      }
      cv.style.cursor = "pointer";
      cv.addEventListener("click", function (ev) {
        var rect = cv.getBoundingClientRect();
        var mx = (ev.clientX - rect.left) * (W / rect.width);
        var my = (ev.clientY - rect.top) * (H / rect.height);
        var best = -1, bd = 1e9;
        for (var i = 0; i < pts.length; i++) {
          var dx = mx - px(pts[i][0]), dy = my - py(pts[i][1]); var d = dx * dx + dy * dy;
          if (d < bd) { bd = d; best = i; }
        }
        if (best >= 0) { sel = best; draw(); }
      });
      var row = document.createElement("div"); row.style.margin = "8px 0";
      function mkBtn(label, cb) {
        var b = document.createElement("button"); b.textContent = label;
        b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin:0 8px 0 0";
        b.addEventListener("click", cb); row.appendChild(b); return b;
      }
      mkBtn("Zero-shot (K=0)", function () { sel = 0; draw(); });
      mkBtn("One-shot (K=1)", function () { sel = 1; draw(); });
      mkBtn("Few-shot (K=10)", function () { sel = 4; draw(); });
      host.appendChild(cv); host.appendChild(out); host.appendChild(row);
      draw();
    },
    example:
      `<p>Suppose you want an LLM to label a movie review as positive or negative. You never train it; you just write a prompt.</p>
       <ul class="steps">
         <li><b>K = 2 demonstrations</b> go first: &nbsp; "Review: I loved it. Sentiment: positive" &nbsp; and &nbsp; "Review: A total bore. Sentiment: negative".</li>
         <li>Then the <b>query</b>: "Review: The best film this year. Sentiment:" — and you stop, letting the model continue.</li>
         <li>The model reads all of it as one context and predicts the next word: "positive".</li>
         <li>This is exactly $p\\big(y \\mid x, (x_1,y_1), (x_2,y_2)\\big)$ with $K = 2$: the chance of the answer $y$ given the query $x$ and the two demonstration pairs.</li>
       </ul>
       <p>One warning: the answer is sensitive to the examples. Swap in worse examples, or reorder them, and the prediction can flip. The format and the choice of demonstrations matter.</p>`,
    application:
      `<p>In-context learning is why modern chatbots feel so flexible. You can paste a couple of examples of the formatting or style you want, and the model copies it — with no fine-tuning, no GPUs, no waiting. It powers prompt-engineering tricks like giving a model two or three labelled examples before asking it to classify, translate, or extract data in the same shape.</p>`,
    practice: [
      {
        q: `You give an LLM three labelled examples in the prompt, then a new sentence to classify. What is $K$, and is this zero-shot, one-shot, or few-shot?`,
        steps: [
          { do: `Count the demonstration pairs placed before the query.`, why: `$K$ is just the number of worked examples in the context — here there are three.` },
          { do: `Match $K$ to the naming rule: $K = 0$ is zero-shot, $K = 1$ is one-shot, $K$ &gt; 1 is few-shot.`, why: `Three examples is more than one, so it falls in the few-shot range.` }
        ],
        answer: `$K = 3$, so this is <b>few-shot</b> prompting. The model conditions on all three pairs in a single forward pass; its weights never change.`
      },
      {
        q: `A teammate says in-context learning "fine-tunes the model on the prompt examples". Why is that wrong?`,
        steps: [
          { do: `Recall what fine-tuning does: it runs gradient descent and updates the model's weights.`, why: `Fine-tuning, like [fs-transfer-learning] and [fs-meta-learning], physically changes the network's numbers.` },
          { do: `Recall what in-context learning does: it only places examples in the input text and runs one forward pass.`, why: `No gradients are computed and no weight is updated — the model is frozen.` }
        ],
        answer: `It is wrong because in-context learning changes <b>no weights</b>. The examples only condition a single frozen forward pass; nothing is trained. That is the sharp contrast with [fs-transfer-learning] and [fs-meta-learning], which do update weights by gradient descent.`
      }
    ]
  });

  window.CODEVIZ["fs-in-context"] = {
    question: "As we add more in-context demonstrations per class, how does accuracy on a held-out query set rise and then plateau?",
    charts: [{
      type: "line",
      title: "Accuracy vs number of in-context demonstrations (k-NN proxy on load_digits)",
      xlabel: "K = demonstrations per class in the context",
      ylabel: "accuracy on held-out queries",
      series: [{
        name: "k-NN proxy accuracy",
        color: "#4ea1ff",
        points: [[0, 0.102], [1, 0.213], [2, 0.566], [5, 0.794], [10, 0.879], [20, 0.93]]
      }]
    }],
    caption: "Real LLMs (Large Language Models) cannot run in the browser, so this is a k-NN (k-Nearest Neighbors) proxy that reproduces the same shape. Using real load_digits pixel features (1797 handwritten 8x8 digit images), 'K demonstrations per class in the prompt' is modeled as a k-NN trained on K real examples per class. Accuracy climbs fast — 0.10 (a zero-shot most-frequent baseline) to 0.21, 0.57, 0.79 — then plateaus near 0.88 and 0.93, exactly the rising-then-flattening curve seen as you add in-context examples to a real LLM.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.dummy import DummyClassifier

# REAL data: 1797 handwritten 8x8 digit images, pixel features scaled 0..1.
# Real LLMs can't run here, so this is a k-NN proxy: "K demonstrations per class
# placed in the prompt" becomes "a k-NN given K real examples per class".
digits = load_digits()
X = digits.data / 16.0
y = digits.target
classes = np.unique(y)

# Fixed held-out query (test) set; the rest is the demonstration pool.
X_pool, X_test, y_pool, y_test = train_test_split(
    X, y, test_size=0.3, random_state=0, stratify=y)

rng = np.random.default_rng(0)
by_class = {c: np.where(y_pool == c)[0] for c in classes}

Ks = [0, 1, 2, 5, 10, 20]      # in-context demonstrations PER CLASS
accs = []
for K in Ks:
    if K == 0:
        # zero-shot: no demonstrations -> can only guess the most-frequent class
        acc = DummyClassifier(strategy="most_frequent").fit(X_pool, y_pool).score(X_test, y_test)
    else:
        trials = []
        for _ in range(20):            # average over random example draws (choice matters)
            idx = []
            for c in classes:
                pool_c = by_class[c]
                idx += rng.choice(pool_c, size=min(K, len(pool_c)), replace=False).tolist()
            idx = np.array(idx)
            knn = KNeighborsClassifier(n_neighbors=min(5, len(idx))).fit(X_pool[idx], y_pool[idx])
            trials.append(knn.score(X_test, y_test))
        acc = float(np.mean(trials))
    accs.append(round(acc, 3))

print(list(zip(Ks, accs)))
# -> [(0, 0.102), (1, 0.213), (2, 0.566), (5, 0.794), (10, 0.879), (20, 0.93)]`
  };
})();
