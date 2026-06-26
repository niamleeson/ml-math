/* =====================================================================
   Few-shot & Transfer Learning — Meta-learning (MAML).
   Self-contained lesson + codeviz. Same beginner style as the rest:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real-world application
   The codeviz numbers are REAL: computed with numpy + scikit-learn on the
   bundled load_digits dataset (1797 real 8x8 handwritten digit images).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "fs-meta-learning",
    title: "Meta-learning (MAML)",
    tagline: "Don't learn one task. Learn a starting point that adapts to a brand-new task in a few steps.",
    module: "Few-shot & Transfer Learning",
    prereqs: ["fs-few-shot", "dl-backprop"],

    bigIdea:
      `<p>Normal training learns to do <b>one</b> task well.</p>
       <p><b>Meta-learning</b> ("learning to learn") aims higher. It learns a good <b>starting point</b> for the weights. From that start, a brand-new task can be learned in just a few gradient steps.</p>
       <p><b>MAML (Model-Agnostic Meta-Learning)</b> is the most famous version. The word "model-agnostic" means it works with any model you can train by gradient descent.</p>
       <p>Picture a hiker dropped at a smart base camp. Every nearby peak is a short climb away. Meta-learning picks that base camp.</p>`,

    buildup:
      `<p>First, two small words. A <b>task</b> here is one little learning problem, like "tell digit 3 from digit 8".</p>
       <p>Each task comes with two slices of data. The <b>support set</b> is the few labeled examples you adapt on. The <b>query set</b> is held-out examples you test on after adapting.</p>
       <p>MAML runs <b>two loops</b>. The <b>inner loop</b> takes the shared start and does a few gradient steps on one task's support set. The <b>outer loop</b> then nudges the shared start so that, after that quick inner adaptation, the loss is low across many tasks.</p>
       <p>So the outer loop is not asking "what weights solve this task?" It asks "what start makes <i>every</i> task easy to reach?"</p>`,

    symbols: [
      { sym: "$\\theta$", desc: "the shared starting weights (Greek 'theta'). The thing meta-learning is really searching for." },
      { sym: "$\\theta'$", desc: "the adapted weights for one task, after the inner-loop steps (read 'theta prime')." },
      { sym: "$\\alpha$", desc: "the inner step size (Greek 'alpha'): how big each adaptation step is. A small positive number." },
      { sym: "$\\mathcal{L}_{\\text{task}}$", desc: "the loss on one task: how wrong the weights are on that task's data. The fancy $\\mathcal{L}$ just means 'loss'." },
      { sym: "$\\nabla_\\theta$", desc: "the gradient with respect to $\\theta$ (the symbol $\\nabla$ is 'nabla'): the direction that changes the loss fastest." },
      { sym: "support set", desc: "the few labeled examples used in the inner loop to adapt to a task." },
      { sym: "query set", desc: "the held-out examples used to measure how good the adaptation was." }
    ],

    formula: `$$ \\theta' = \\theta - \\alpha\\,\\nabla_\\theta\\,\\mathcal{L}_{\\text{task}}(\\theta) \\qquad \\min_\\theta \\sum_{\\text{tasks}} \\mathcal{L}_{\\text{task}}(\\theta') $$`,

    whatItDoes:
      `<p>The <b>left</b> formula is the inner loop. Start at the shared weights $\\theta$. Take one (or a few) gradient steps of size $\\alpha$ on the task's support set. That gives the adapted weights $\\theta'$.</p>
       <p>The <b>right</b> formula is the outer loop. Add up the task losses, but measured at the <i>adapted</i> weights $\\theta'$, across many tasks. Then change $\\theta$ to make that total small.</p>
       <p>Read it as: "find the start $\\theta$ such that, after a quick adapt, every task is already nearly solved."</p>`,

    derivation:
      `<p>Here is the trick that makes MAML different. The outer loop minimizes the loss at $\\theta'$, but $\\theta'$ itself was computed from $\\theta$. So when we ask "how does the final loss change when $\\theta$ changes?", we must follow the chain through the inner step.</p>
       <p>Because $\\theta' = \\theta - \\alpha\\,\\nabla_\\theta\\,\\mathcal{L}_{\\text{task}}(\\theta)$, the derivative of $\\theta'$ with respect to $\\theta$ contains a derivative of a gradient — a <b>second derivative</b>. That is why full MAML is sometimes called second-order.</p>
       <p>Those second derivatives are costly. Two popular shortcuts skip them:</p>
       <ul class="steps">
         <li><b>First-order MAML (FOMAML):</b> just ignore the second-derivative term. Treat $\\theta'$ as if it did not depend on $\\theta$. It is much cheaper and usually works almost as well.</li>
         <li><b>Reptile:</b> even simpler. Adapt on a task for a few steps to get $\\theta'$, then move the shared start a little <i>toward</i> $\\theta'$. Repeat over many tasks. No second derivatives at all, and no support/query split needed.</li>
       </ul>
       <p>How is this different from neighbors?</p>
       <ul class="steps">
         <li><b>Transfer learning</b> (see [fs-transfer-learning]) does <i>one</i> fixed pretraining, then fine-tunes. Meta-learning instead <i>optimizes the start itself</i> so that fine-tuning is fast.</li>
         <li><b>Prototypical networks</b> (see [fs-few-shot]) classify by distance to class averages and need <i>no</i> inner-loop training at test time. MAML does take a few gradient steps to adapt.</li>
       </ul>`,

    demo: function (host) {
      host.innerHTML = "";
      // REAL MAML-style fast-adaptation curves on load_digits (held-out task: 8 vs rest).
      // Computed offline with numpy + scikit-learn; see the CODEVIZ "code" for the exact recipe.
      var META = [[0, 0.497], [1, 0.497], [2, 0.237], [3, 0.222], [4, 0.201], [5, 0.201], [6, 0.213], [8, 0.198], [10, 0.198], [12, 0.198], [14, 0.195], [16, 0.201], [18, 0.204], [20, 0.207]];
      var COLD = [[0, 0.497], [1, 0.503], [2, 0.503], [3, 0.497], [4, 0.497], [5, 0.491], [6, 0.467], [8, 0.414], [10, 0.385], [12, 0.367], [14, 0.352], [16, 0.334], [18, 0.325], [20, 0.325]];

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);

      function upto(arr, k) { var out = []; for (var i = 0; i < arr.length; i++) { if (arr[i][0] <= k) out.push(arr[i]); } if (out.length < 1) out.push(arr[0]); return out; }
      function valAt(arr, k) { var v = arr[0][1]; for (var i = 0; i < arr.length; i++) { if (arr[i][0] <= k) v = arr[i][1]; } return v; }

      function render(steps) {
        window.Charts.draw(cv, {
          type: "line", xlabel: "adaptation steps on the new task", ylabel: "query error (lower = better)",
          series: [
            { name: "meta-init (warm start)", color: "#7ee787", points: upto(META, steps) },
            { name: "random init (cold start)", color: "#ff7b72", points: upto(COLD, steps) }
          ]
        });
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      var lab = document.createElement("label"); lab.style.display = "block";
      var inp = document.createElement("input"); inp.type = "range"; inp.min = 0; inp.max = 20; inp.step = 1; inp.value = 20;
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px";

      function update() {
        var k = parseInt(inp.value, 10);
        lab.textContent = "gradient steps shown = " + k;
        var m = valAt(META, k), c = valAt(COLD, k);
        rd.innerHTML = "after <b>" + k + "</b> step" + (k === 1 ? "" : "s") +
          ": &nbsp; meta-init error = <b style='color:#7ee787'>" + (m * 100).toFixed(1) + "%</b>" +
          " &nbsp; cold-start error = <b style='color:#ff7b72'>" + (c * 100).toFixed(1) + "%</b>." +
          "<br>The meta-init is already low by step 4-5; the cold start is still ~" + (valAt(COLD, 20) * 100).toFixed(0) + "% at step 20.";
        render(k);
      }
      inp.addEventListener("input", update);
      row.appendChild(lab); row.appendChild(inp);
      host.appendChild(row); host.appendChild(rd);
      update();
    },

    example:
      `<p>One task: tell digit 3 from digit 8. The support set has just a few labeled images. Inner step size $\\alpha = 0.3$.</p>
       <ul class="steps">
         <li>Start at the meta-init $\\theta$. On the support set the gradient is $\\nabla_\\theta\\,\\mathcal{L}_{\\text{task}}(\\theta) = g$.</li>
         <li>One inner step: $\\theta' = \\theta - 0.3\\,g$. Suppose this already gets most query images right.</li>
         <li>The outer loop checks the query loss at $\\theta'$, not at $\\theta$. If a tiny tweak to $\\theta$ would make $\\theta'$ even better, it makes that tweak.</li>
         <li>Repeat over many digit-pair tasks. The shared start $\\theta$ slowly becomes a place where <i>any</i> digit pair is one short hop away.</li>
       </ul>
       <p>The payoff: a brand-new pair the model never trained on is learned in a handful of steps, not from scratch.</p>`,

    application:
      `<p>Meta-learning shines when each new task has very little data. A robot arm meeting a new object, a drug-response model for a rare disease, or a phone keyboard adapting to your typing in a few taps.</p>
       <p>It also underpins fast personalization: a shared model is meta-trained across many users, then adapts to one new user from just a handful of their examples.</p>`,

    whenToUse:
      `<p><b>Reach for meta-learning when you face a stream of related tasks, each with very little data, and you want a model that <i>learns to adapt fast</i></b> — new robot objects, per-user personalization, per-patient drug response. MAML (Model-Agnostic Meta-Learning) trains an initialization from which a few gradient steps on a tiny new support set reach good accuracy.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>Plain transfer learning</b> — when you have <i>many</i> small tasks, not one; meta-learning optimizes directly for fast adaptation, while a single pretrained backbone is not tuned for few-step updates.</li>
         <li><b>Prototype-based few-shot</b> — when each new task needs real gradient updates (regression, control), not just nearest-prototype classification.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>You have one task with plenty of data — ordinary supervised training is simpler and stronger.</li>
         <li>You only ever classify new classes by similarity — <a onclick="App.open('fs-few-shot')">few-shot</a> prototypes are cheaper and need no inner-loop gradients.</li>
         <li>Adaptation can happen purely in a prompt — use <a onclick="App.open('fs-in-context')">in-context learning</a>, which adapts with no weight updates at all.</li>
       </ul>
       <p><b>Which library:</b> <code>learn2learn</code> or <code>higher</code> for MAML and its first-order variants in PyTorch.</p>`,
    pitfalls:
      `<ul>
         <li><b>Second-order cost and instability.</b> True MAML differentiates through the inner-loop gradient step, which is memory-heavy and can blow up. Use first-order MAML or Reptile when the full second-order term is too costly.</li>
         <li><b>Inner / outer learning-rate coupling.</b> The inner step size $\\alpha$ and outer step size $\\beta$ interact tightly; a bad pair gives divergence or no adaptation. Tune them together, starting with a small $\\alpha$.</li>
         <li><b>Task distribution mismatch.</b> Meta-training tasks must resemble the tasks you will face at test time. If they differ, the learned initialization adapts to the wrong thing. Sample meta-training tasks to match deployment.</li>
         <li><b>Meta-overfitting.</b> With too few or too-similar training tasks, the model memorizes them and fails on genuinely new tasks. Hold out novel <i>tasks</i> (not just examples) for evaluation.</li>
         <li><b>Support / query leakage.</b> Reusing the same examples in the inner-loop support set and the outer-loop query set inflates the meta-objective. Keep them disjoint within every episode.</li>
         <li><b>Adaptation step count drift.</b> Adapting with 5 inner steps in training but 50 at deployment changes behavior. Match the number of inner steps used at train and test time.</li>
       </ul>`,

    practice: [
      {
        q: `Why does MAML optimize the loss at the adapted weights $\\theta'$ instead of at the shared start $\\theta$?`,
        steps: [
          { do: `Recall the goal: a start that is easy to adapt from, not a start that is already good on its own.`, why: `A great start that cannot adapt is useless for new tasks.` },
          { do: `Each task first runs the inner loop: $\\theta' = \\theta - \\alpha\\,\\nabla_\\theta\\,\\mathcal{L}_{\\text{task}}(\\theta)$.`, why: `This is the few-step adaptation we actually use at test time.` },
          { do: `Measure success at $\\theta'$, then push $\\theta$ to make that post-adaptation loss small.`, why: `Scoring at $\\theta'$ rewards a start that adapts well, which is the whole point.` }
        ],
        answer: `<p>Because we care about performance <i>after</i> a quick adaptation. Scoring at $\\theta'$ makes the outer loop search for a start that is fast to adapt, not one that is already good before adapting.</p>`
      },
      {
        q: `An inner step uses $\\alpha = 0.1$ and gradient $\\nabla_\\theta\\,\\mathcal{L}_{\\text{task}}(\\theta) = 4$. What is the adapted weight $\\theta'$ if the start is $\\theta = 2$?`,
        steps: [
          { do: `Write the inner-loop rule: $\\theta' = \\theta - \\alpha\\,\\nabla_\\theta\\,\\mathcal{L}_{\\text{task}}(\\theta)$.`, why: `This is the one gradient step that adapts to the task.` },
          { do: `Plug in: $\\theta' = 2 - 0.1\\times 4$.`, why: `Substitute the given start, step size, and gradient.` },
          { do: `Compute: $2 - 0.4 = 1.6$.`, why: `Step downhill by $\\alpha$ times the gradient.` }
        ],
        answer: `<p>$\\theta' = 2 - 0.1\\times 4 = 1.6$.</p>`
      },
      {
        q: `What does first-order MAML (FOMAML) drop, and how does Reptile avoid the same cost?`,
        steps: [
          { do: `Note that $\\theta'$ depends on $\\theta$ through a gradient, so the outer gradient has a second-derivative term.`, why: `Second derivatives are the expensive part of full MAML.` },
          { do: `FOMAML simply ignores that second-derivative term.`, why: `It treats $\\theta'$ as if it did not depend on $\\theta$, which is far cheaper.` },
          { do: `Reptile skips gradients-of-gradients entirely: adapt to a task, then move $\\theta$ toward the adapted $\\theta'$.`, why: `Moving toward $\\theta'$ approximates the same effect without any second derivatives.` }
        ],
        answer: `<p>FOMAML drops the second-derivative (gradient-of-gradient) term from the outer update. Reptile avoids it by adapting on a task and then nudging the shared start <i>toward</i> the adapted weights, needing no second derivatives at all.</p>`
      }
    ]
  });

  window.CODEVIZ["fs-meta-learning"] = {
    question: "How do you read a fast-adaptation curve — and tell a healthy meta-init from one that overfits, mismatches, or diverges?",
    charts: [
      {
        type: "line", title: "Healthy: meta-init adapts fast, cold start lags",
        xlabel: "adaptation (gradient) steps on the new task", ylabel: "query error rate (lower = better)",
        series: [
          { name: "meta-init (warm start)", color: "#7ee787", points: [[0, 0.497], [1, 0.497], [2, 0.237], [3, 0.222], [4, 0.201], [5, 0.201], [6, 0.213], [8, 0.198], [10, 0.198], [12, 0.198], [14, 0.195], [16, 0.201], [18, 0.204], [20, 0.207]] },
          { name: "random/zero init (cold start)", color: "#ff7b72", points: [[0, 0.497], [1, 0.503], [2, 0.503], [3, 0.497], [4, 0.497], [5, 0.491], [6, 0.467], [8, 0.414], [10, 0.385], [12, 0.367], [14, 0.352], [16, 0.334], [18, 0.325], [20, 0.325]] }
        ],
        interpret: "<b>Real numbers</b> from load_digits, held-out task '8 vs the rest', 10 support examples. The x-axis is how many gradient steps you take on the brand-new task; the y-axis is error on held-out query images. <b>Read the green line:</b> it dives from 50% to ~20% by step 4-5 and stays flat — the meta-init was already a great base camp. The red cold start crawls and is still ~33% at step 20. The big gap between the two lines, especially at the left, is the whole payoff of meta-learning: <b>fast adaptation from a learned start.</b>"
      },
      {
        type: "line", title: "Meta-overfitting: warm start dips then climbs back up",
        xlabel: "adaptation (gradient) steps on the new task", ylabel: "query error rate (lower = better)",
        series: [
          { name: "meta-init (warm start)", color: "#ffb454", points: [[0, 0.50], [1, 0.36], [2, 0.27], [3, 0.23], [4, 0.22], [5, 0.24], [6, 0.27], [8, 0.31], [10, 0.35], [12, 0.39], [14, 0.42], [16, 0.45], [18, 0.47], [20, 0.49]] },
          { name: "random/zero init (cold start)", color: "#ff7b72", points: [[0, 0.50], [1, 0.50], [2, 0.49], [3, 0.49], [4, 0.48], [5, 0.47], [6, 0.45], [8, 0.41], [10, 0.38], [12, 0.36], [14, 0.35], [16, 0.34], [18, 0.33], [20, 0.33]] }
        ],
        interpret: "<b>Illustrative shape.</b> The green/orange warm-start curve reaches a good low point around step 4 but then turns back up — extra inner steps make query error <i>worse</i>, not better. That U-shape means the few support examples are being memorized: the adapted weights fit the support set but stop generalizing to the query set. <b>How to recognise it:</b> a clear minimum followed by a rising tail. <b>What to do:</b> use fewer inner steps (early-stop adaptation), and match the train-time step count at test time — a common cause is adapting far longer at deployment than during meta-training."
      },
      {
        type: "line", title: "Task mismatch: warm start no better than cold",
        xlabel: "adaptation (gradient) steps on the new task", ylabel: "query error rate (lower = better)",
        series: [
          { name: "meta-init (warm start)", color: "#ffb454", points: [[0, 0.50], [1, 0.49], [2, 0.48], [3, 0.47], [4, 0.46], [5, 0.45], [6, 0.44], [8, 0.41], [10, 0.39], [12, 0.37], [14, 0.36], [16, 0.35], [18, 0.34], [20, 0.34]] },
          { name: "random/zero init (cold start)", color: "#ff7b72", points: [[0, 0.50], [1, 0.50], [2, 0.49], [3, 0.49], [4, 0.48], [5, 0.47], [6, 0.45], [8, 0.42], [10, 0.40], [12, 0.38], [14, 0.37], [16, 0.36], [18, 0.35], [20, 0.35]] }
        ],
        interpret: "<b>Illustrative shape.</b> The two lines sit almost on top of each other and both descend slowly — the meta-init gives no head start. This is the signature of <b>task-distribution mismatch:</b> the new task does not resemble the tasks the start was meta-trained on, so the learned base camp is in the wrong place. <b>How to recognise it:</b> warm and cold curves overlap; no early gap. <b>What to do:</b> make meta-training tasks resemble the deployment task; if they genuinely differ, plain transfer learning may serve just as well."
      },
      {
        type: "line", title: "Diverging: inner step size too large, error blows up",
        xlabel: "adaptation (gradient) steps on the new task", ylabel: "query error rate (lower = better)",
        series: [
          { name: "meta-init, alpha too big", color: "#ff7b72", points: [[0, 0.50], [1, 0.34], [2, 0.41], [3, 0.55], [4, 0.48], [5, 0.62], [6, 0.57], [8, 0.66], [10, 0.61], [12, 0.69], [14, 0.64], [16, 0.71], [18, 0.67], [20, 0.73]] }
        ],
        interpret: "<b>Illustrative shape.</b> A single jagged curve that bounces up and down and trends <i>worse than the 50% starting point</i>. The inner step size alpha is too large, so each gradient step overshoots the minimum instead of settling into it. <b>How to recognise it:</b> oscillation plus an overall upward (worsening) trend, often ending above where it began. <b>What to do:</b> shrink alpha; tune the inner and outer learning rates together, starting small — a bad alpha/beta pair gives exactly this divergence."
      }
    ],
    caption: "Reading a MAML fast-adaptation curve: x = gradient steps on the brand-new task, y = query error. The first chart is the real, healthy result (load_digits, '8 vs the rest', 10 support examples); the rest are illustrative failure shapes a practitioner meets — meta-overfitting (U-shape), task mismatch (warm = cold), and divergence (alpha too big).",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.linear_model import LogisticRegression

digits = load_digits()                   # 1797 real 8x8 handwritten digits
X = digits.data / 16.0                    # pixels scaled to 0..1
y = digits.target

# Several binary "tasks": one digit vs the rest. They share useful structure,
# so a start learned across them transfers to a brand-new task.
digits_list = [0, 1, 2, 3, 4, 6, 7, 9]
held_out = 8                              # brand-new task: 8 vs the rest
train_digits = [d for d in digits_list if d != held_out]

def make_task(d, seed=0):
    rng = np.random.default_rng(seed)
    pos = np.where(y == d)[0]
    neg = rng.choice(np.where(y != d)[0], size=len(pos), replace=False)  # balance
    idx = np.r_[pos, neg]
    return X[idx], (y[idx] == d).astype(float)

# META-INIT: average the learned weights across the OTHER tasks (a Reptile-like
# stand-in for MAML's meta-trained initialization).
Ws = []
for d in train_digits:
    Xt, yt = make_task(d)
    lr = LogisticRegression(C=1.0, max_iter=1000).fit(Xt, yt)
    Ws.append(np.r_[lr.coef_.ravel(), lr.intercept_])
meta = np.mean(Ws, axis=0)

# Held-out task: tiny SUPPORT set (few-shot) to adapt on, big QUERY set to test on.
rng = np.random.default_rng(7)
pos = np.where(y == held_out)[0]
neg = rng.choice(np.where(y != held_out)[0], size=len(pos), replace=False)
idx = np.r_[pos, neg]; rng.shuffle(idx)
Xt, yt = X[idx], (y[idx] == held_out).astype(float)
n_support = 10                           # only 10 labeled support examples
Xs_b = np.c_[Xt[:n_support], np.ones(n_support)]; ys = yt[:n_support]
Xq_b = np.c_[Xt[n_support:], np.ones(len(Xt) - n_support)]; yq = yt[n_support:]

def sigmoid(z): return 1.0 / (1.0 + np.exp(-z))

def adapt(w0, steps=20, alpha=0.3):      # manual gradient steps = MAML inner loop
    w = w0.copy(); errs = []
    for _ in range(steps + 1):
        errs.append(float(np.mean((sigmoid(Xq_b @ w) > 0.5) != yq)))   # query error
        g = Xs_b.T @ (sigmoid(Xs_b @ w) - ys) / n_support
        w = w - alpha * g
    return errs

meta_curve = adapt(meta)                  # warm start from the meta-init
cold_curve = adapt(np.zeros_like(meta))   # cold start from zeros
print("meta:", [round(e, 3) for e in meta_curve])   # ~0.50 -> ~0.20 in a few steps
print("cold:", [round(e, 3) for e in cold_curve])   # still ~0.33 at step 20`
  };
})();
