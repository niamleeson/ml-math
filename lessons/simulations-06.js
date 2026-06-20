/* Mock ML-engineering "lab" scenarios. Merged into window.SIMULATIONS by application id.
   { title, icon, goal, stages:[ { phase, icon, title, narrative(HTML), concepts:[lessonIds],
     steps:[ {type:"decide", prompt, options:[{label, feedback, best?}]} | {type:"run", label, prompt?, result:{log?, metrics?:[{k,v}], note?}} ] } ] } */
window.SIMULATIONS = Object.assign(window.SIMULATIONS || {}, {
  "ml-optimization-engine": {
    title: "Training Engine & Optimization",
    icon: "⚙️",
    goal: "Take a model that won't converge and get it to train fast, stably, and without overfitting.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the optimization",
        narrative: `<p>Training is just minimizing a cost surface. Before touching the optimizer, decide what you are actually descending: the per-example loss aggregated into an empirical risk $J(\\theta)=\\frac{1}{n}\\sum_i \\ell(\\theta;x_i,y_i)$.</p>`,
        concepts: ["ai-loss-minimization", "ml-cost", "ml-loss"],
        steps: [{
          type: "decide", prompt: "Your task is multi-class classification. Which loss should you minimize?",
          options: [
            { label: "Cross-entropy on the softmax outputs", best: true, feedback: "cross-entropy matches the maximum-likelihood objective for categorical labels and gives clean, well-scaled gradients. This is the right cost to descend." },
            { label: "Mean-squared error on the class indices", best: false, feedback: "treating class ids 0,1,2 as numbers invents a fake ordering and gives tiny gradients when the model is confidently wrong. Wrong loss family." },
            { label: "Raw accuracy", best: false, feedback: "accuracy is flat almost everywhere, so its gradient is zero — there is nothing for descent to follow. It's a metric, not a loss." }
          ]
        }]
      },
      {
        phase: "Init", icon: "🌱", title: "Initialize the weights",
        narrative: `<p>A deep net's first gradients depend heavily on the starting weights. Bad scale and the signal either explodes or vanishes before training even begins.</p>`,
        concepts: ["dl-init", "dl-vanishing-gradient", "dl-neuron"],
        steps: [{
          type: "decide", prompt: "How should you initialize a 20-layer network?",
          options: [
            { label: "Xavier / He init, variance scaled by fan-in", best: true, feedback: "scaling the initial variance by layer width keeps activation and gradient magnitudes roughly constant across depth, so signals survive to the bottom layers." },
            { label: "All weights set to zero", best: false, feedback: "every neuron in a layer then computes the same thing and gets the same gradient — they never differentiate. Symmetry must be broken." },
            { label: "Large random values, $\\sigma=10$", best: false, feedback: "activations saturate and gradients explode in the early layers. The loss diverges on step one." }
          ]
        }]
      },
      {
        phase: "Diagnose", icon: "💥", title: "Diagnose divergence",
        narrative: `<p>You launch a first run and the loss shoots to infinity. Before changing the model, read the gradient and the learning rate.</p>`,
        concepts: ["fnd-gradient", "ml-gradient-descent", "fnd-derivative"],
        steps: [
          { type: "run", label: "▶ Run 1 (lr = 1.0)", result: { log: "step 0   loss 2.31\nstep 10  loss 9.8e2\nstep 20  loss 4.1e7\nstep 30  loss nan  (DIVERGED)\ngrad norm at step 20: 3.2e5", metrics: [{ k: "final loss", v: "nan" }, { k: "grad norm", v: "3.2e5" }] } },
          { type: "decide", prompt: "The loss diverged to nan. Most likely cause?",
            options: [
              { label: "Learning rate too high — each step overshoots the minimum", best: true, feedback: "an lr that overshoots makes the gradient grow each step, a positive feedback loop into nan. Lower the step size first." },
              { label: "Not enough training epochs", best: false, feedback: "more steps of a divergent process just reach nan faster. Epoch count isn't the problem." },
              { label: "The model is too small", best: false, feedback: "capacity has nothing to do with the loss blowing up; this is a step-size instability." }
            ] }
        ]
      },
      {
        phase: "Optimizer", icon: "🚀", title: "Pick optimizer & schedule",
        narrative: `<p>With a sane learning rate, choose how to take steps. Plain full-batch descent is slow; you want momentum and adaptivity, plus a schedule that anneals the rate.</p>`,
        concepts: ["dl-optimizers", "ai-sgd", "fnd-chain"],
        steps: [{
          type: "decide", prompt: "Which optimizer + schedule for a noisy deep model?",
          options: [
            { label: "Adam with a warmup then cosine-decay learning-rate schedule", best: true, feedback: "Adam's per-parameter adaptive steps plus momentum handle messy gradients, and warmup avoids early instability while decay sharpens late convergence." },
            { label: "Vanilla full-batch gradient descent, fixed lr", best: false, feedback: "a correct baseline, but it crawls on large data and has no momentum to escape flat regions. Fine as a sanity check only." },
            { label: "Random search over weights", best: false, feedback: "ignores the gradient entirely — hopeless in high dimensions where descent's slope information is the whole point." }
          ]
        }]
      },
      {
        phase: "Batch", icon: "📦", title: "Choose the batch size",
        narrative: `<p>The mini-batch size trades gradient noise for throughput. Too small is noisy and slow per epoch; too large wastes memory and can hurt generalization.</p>`,
        concepts: ["dl-minibatch", "ai-sgd", "ml-gradient-descent"],
        steps: [
          { type: "decide", prompt: "How should you set the batch size?",
            options: [
              { label: "Pick the largest batch that fits memory, then tune lr roughly with it (linear scaling)", best: true, feedback: "bigger batches give smoother gradients and better hardware use; you scale the learning rate alongside so the effective step stays sensible." },
              { label: "Always use batch size 1", best: false, feedback: "pure SGD is extremely noisy and under-utilizes the accelerator — each step barely uses the hardware." },
              { label: "Use the full dataset every step", best: false, feedback: "exact gradients but no stochastic regularization, and it won't fit in memory at scale. Mini-batches are the sweet spot." }
            ] },
          { type: "run", label: "▶ Sweep batch sizes", result: { log: "bs=32    epoch time 88s   valid loss 0.41\nbs=256   epoch time 19s   valid loss 0.40\nbs=4096  epoch time 11s   valid loss 0.47  (generalization gap)\nchose bs=256 with lr scaled 8x", metrics: [{ k: "batch", v: "256" }, { k: "epoch time", v: "19s" }] } }
        ]
      },
      {
        phase: "Regularize", icon: "🧪", title: "Fight overfitting",
        narrative: `<p>Training loss keeps dropping but validation loss has started to rise — the classic overfit signature. Add capacity control, not more capacity.</p>`,
        concepts: ["ml-regularization", "dl-early-stopping", "ml-bias-variance"],
        steps: [{
          type: "decide", prompt: "Train loss is 0.05, valid loss is climbing to 0.6. Best fix?",
          options: [
            { label: "Add weight decay + dropout and enable early stopping on the valid metric", best: true, feedback: "the gap between train and valid loss is variance/overfit. Penalizing weights and stopping at the valid minimum closes it without shrinking the model." },
            { label: "Train for many more epochs", best: false, feedback: "the valid loss is already rising — more epochs deepen the overfit. This is the opposite of the fix." },
            { label: "Remove all regularization to fit harder", best: false, feedback: "that increases variance further. You want to constrain, not unleash, the model here." }
          ]
        }]
      },
      {
        phase: "Train", icon: "🔥", title: "Run the real training",
        narrative: `<p>Optimizer, schedule, batch, and regularization are set. Launch the full run and watch the curves converge.</p>`,
        concepts: ["ml-gradient-descent", "dl-optimizers", "dl-minibatch"],
        steps: [
          { type: "run", label: "▶ Train (Adam, cosine decay, bs=256)", result: { log: "epoch 1   train 1.92  valid 1.71  lr 3.0e-4\nepoch 10  train 0.44  valid 0.49  lr 1.8e-4\nepoch 30  train 0.21  valid 0.33  lr 2.0e-5\nepoch 40  train 0.18  valid 0.32  (early stop: valid plateaued)\ngrad norm stable ~2.1", metrics: [{ k: "valid loss", v: "0.32" }, { k: "epochs", v: "40" }, { k: "grad norm", v: "~2.1" }] } }
        ]
      },
      {
        phase: "Tune", icon: "🎛️", title: "Second-order check",
        narrative: `<p>Convergence is slow in a narrow valley of the loss surface. The curvature — captured by the Hessian — explains why first-order steps zig-zag.</p>`,
        concepts: ["la-hessian", "mlx-newton", "fnd-gradient"],
        steps: [{
          type: "decide", prompt: "The loss valley is ill-conditioned (very different curvature in different directions). What helps?",
          options: [
            { label: "Use curvature-aware steps (Adam's per-dim scaling, or a Newton-like preconditioner)", best: true, feedback: "scaling each direction by its curvature un-stretches the valley so steps point at the minimum instead of bouncing across it." },
            { label: "Just raise the global learning rate", best: false, feedback: "a single global rate can't fix anisotropic curvature — raise it and the steep direction diverges while the flat one still crawls." },
            { label: "Switch back to MSE loss", best: false, feedback: "the conditioning problem is in the surface geometry, not the loss family. Changing the loss is unrelated." }
          ]
        }]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor the training loop",
        narrative: `<p>Training engines run for days. You need live eyes on gradient health, loss curves, and learning-rate state so a silent divergence doesn't burn a week of compute.</p>`,
        concepts: ["dl-vanishing-gradient", "ml-cost", "dl-optimizers"],
        steps: [
          { type: "decide", prompt: "What should the training dashboard track?",
            options: [
              { label: "Train/valid loss, gradient-norm per layer, learning rate, and NaN/inf guards with auto-halt", best: true, feedback: "you watch the objective (loss), the signal health (grad norms catch vanishing/exploding early), the schedule, and a kill-switch so a divergent run stops itself." },
              { label: "Only the final accuracy after the run finishes", best: false, feedback: "you'd discover a 3-day divergence at the very end, having wasted all the compute. Live signals are the whole point." }
            ] },
          { type: "run", label: "▶ Check live training monitors", result: { log: "layer 18 grad norm: 2.0 -> 0.003 over 200 steps (VANISHING in deep block)\nloss curve: flat for 500 steps\naction: add residual/batchnorm path, re-init the deep block, resume", metrics: [{ k: "grad norm L18", v: "0.003 ⚠" }, { k: "loss", v: "flat" }] }, note: `The loop closes: a monitor caught vanishing gradients in a deep block, sending you back to the <b>Init</b> stage to fix the signal path. That is the real optimization job.` }
        ]
      }
    ]
  },
  "model-evaluation": {
    title: "Model Evaluation & Tuning",
    icon: "📐",
    goal: "Rigorously evaluate and tune a model so the number you report is the number you'll get in production.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Choose the metric",
        narrative: `<p>You cannot tune toward a metric you haven't chosen. The metric must match the business cost and the data balance, not just be the default.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "ml-regression-metrics"],
        steps: [{
          type: "decide", prompt: "Churn prediction: 8% of users churn, and a false 'will-churn' triggers an expensive retention offer. Pick a metric.",
          options: [
            { label: "Precision/recall (and AUC) at the operating threshold", best: true, feedback: "with 8% positives and a real cost per false alarm, you care about precision and recall at the threshold you'll actually deploy — accuracy would be dominated by the 92% majority." },
            { label: "Plain accuracy", best: false, feedback: "predicting 'no churn' for everyone already scores 92%. Accuracy hides the very errors you pay for." },
            { label: "RMSE", best: false, feedback: "that's a regression metric; churn is a yes/no classification outcome." }
          ]
        }]
      },
      {
        phase: "Split", icon: "✂️", title: "Build honest splits",
        narrative: `<p>Every reliable number comes from data the model never saw while training. The split design is where evaluation lives or dies.</p>`,
        concepts: ["mlx-cross-validation", "ml-supervised", "mlx-error-analysis"],
        steps: [
          { type: "decide", prompt: "Your data is per-user events over time. How do you split?",
            options: [
              { label: "Group by user and split by time: train on earlier users/dates, test on later, no user in two folds", best: true, feedback: "grouping by user stops the same person leaking across folds, and the time order mimics how you'll actually predict the future from the past." },
              { label: "Shuffle all rows and take a random 20% test set", best: false, feedback: "rows from the same user (and future timestamps) leak into train, inflating the score versus reality." },
              { label: "Test on the same data you trained on", best: false, feedback: "that measures memorization, not generalization — the score is meaningless." }
            ] },
          { type: "run", label: "▶ Build train/val/test", result: { log: "grouped by user_id (no overlap)\ntime split: train < 2026-03, val 2026-03, test 2026-04\ntrain 640k rows | val 80k | test 80k\nclass balance preserved (8.0% / 8.1% / 7.9%)", metrics: [{ k: "train", v: "640k" }, { k: "test", v: "80k" }, { k: "pos rate", v: "~8%" }] } }
        ]
      },
      {
        phase: "Baseline", icon: "📏", title: "Set a baseline",
        narrative: `<p>A score means nothing without a reference. Fit a simple, honest baseline so every later gain is measured against it.</p>`,
        concepts: ["ml-logistic-regression", "ml-learning-theory", "ml-bias-variance"],
        steps: [
          { type: "run", label: "▶ Fit logistic-regression baseline", result: { log: "fitting L2 logistic regression on 22 features...\nval AUC 0.78   precision@0.5 0.41   recall@0.5 0.55\nmajority-class baseline AUC: 0.50\nbaseline locked.", metrics: [{ k: "baseline AUC", v: "0.78" }, { k: "prec@0.5", v: "0.41" }] } }
        ]
      },
      {
        phase: "CV", icon: "🔁", title: "Cross-validate",
        narrative: `<p>A single validation split is noisy. K-fold cross-validation averages over folds so your estimate of generalization has error bars, not just a point.</p>`,
        concepts: ["mlx-cross-validation", "prob-estimation", "prob-variance"],
        steps: [{
          type: "decide", prompt: "Why use 5-fold CV instead of one 80/20 split?",
          options: [
            { label: "It averages the score over 5 held-out folds, giving a mean and a variance estimate", best: true, feedback: "every point is held out exactly once, so you get a more stable mean and a spread that tells you whether a 'win' is real or noise." },
            { label: "It lets the model see the test set 5 times", best: false, feedback: "that's leakage, not CV — each fold's validation data is never used to fit that fold's model." },
            { label: "It always raises the accuracy", best: false, feedback: "CV estimates the score more reliably; it doesn't change the model's true quality." }
          ]
        }]
      },
      {
        phase: "Search", icon: "🔍", title: "Hyperparameter search",
        narrative: `<p>Now tune. Search the hyperparameter space using the CV estimate as the objective — but search efficiently, since each trial costs a full fit.</p>`,
        concepts: ["mlx-model-selection", "ml-regularization", "mlx-cross-validation"],
        steps: [
          { type: "decide", prompt: "Boosted-tree model with ~6 hyperparameters. How do you search?",
            options: [
              { label: "Random / Bayesian search over the space, scored by 5-fold CV, with model-selection criteria to pick complexity", best: true, feedback: "random and Bayesian search cover a high-dim space far better than a coarse grid for the same budget, and CV scoring keeps the choice honest." },
              { label: "Exhaustive grid over every combination", best: false, feedback: "the grid explodes combinatorially and wastes budget on dimensions that don't matter; random search dominates it at equal cost." },
              { label: "Tune by hand on the test set", best: false, feedback: "touching the test set during tuning leaks it — your final number stops being trustworthy." }
            ] },
          { type: "run", label: "▶ Run 60 search trials (CV-scored)", result: { log: "trial 12  depth 6  lr 0.05  l2 1.0   cv AUC 0.842 +/- 0.006\ntrial 41  depth 8  lr 0.03  l2 2.0   cv AUC 0.857 +/- 0.005  *best\ntrial 58  depth 12 lr 0.10 l2 0.1   cv AUC 0.831 (overfit, high variance)\nselected trial 41", metrics: [{ k: "best cv AUC", v: "0.857" }, { k: "trials", v: "60" }] } }
        ]
      },
      {
        phase: "Leakage", icon: "🕳️", title: "Hunt leakage & overfit",
        narrative: `<p>A suspiciously high score is a red flag. Before celebrating, check whether the model is learning the future or just memorizing the train set.</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "mlx-cross-validation"],
        steps: [{
          type: "decide", prompt: "CV AUC is 0.99 but the baseline was 0.78. Most likely?",
          options: [
            { label: "Target leakage — a feature encodes the label or future info; audit and remove it", best: true, feedback: "a jump that large from a strong baseline almost always means a feature unavailable at prediction time slipped in. Find it before trusting anything." },
            { label: "The model is just excellent, ship it", best: false, feedback: "a near-perfect jump over a solid baseline is the signature of leakage, not genius. Verify first." },
            { label: "CV is broken", best: false, feedback: "CV mechanics rarely fabricate a score this high; the leak is in the features, not the protocol." }
          ]
        }]
      },
      {
        phase: "Test", icon: "🔒", title: "Final test-set readout",
        narrative: `<p>The test set is opened exactly once, after all tuning is frozen. This is the unbiased estimate of how the chosen config will perform.</p>`,
        concepts: ["ml-roc-auc", "ml-classification-metrics", "prob-estimation"],
        steps: [
          { type: "run", label: "▶ Evaluate frozen config on test", result: { log: "loading held-out test (80k rows, untouched)...\ntest AUC 0.851  (cv estimate was 0.857 — within error)\n@ threshold 0.62: precision 0.71  recall 0.58\nbaseline beaten by +0.07 AUC", metrics: [{ k: "test AUC", v: "0.851" }, { k: "precision", v: "0.71" }, { k: "recall", v: "0.58" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor after ship",
        narrative: `<p>Evaluation doesn't end at launch. As real labels arrive, the live metric is the only ground truth — and it drifts as the world changes.</p>`,
        concepts: ["ml-roc-auc", "mlx-error-analysis", "prob-estimation"],
        steps: [
          { type: "decide", prompt: "What evaluation should run continuously in production?",
            options: [
              { label: "Recompute precision/recall/AUC on freshly-labeled data, segment by cohort, and alert on metric drift", best: true, feedback: "live labels give the real score; segmenting catches a metric that holds overall but rots for one group, and drift alerts trigger a retune." },
              { label: "Trust the test number forever", best: false, feedback: "the test set is a snapshot of the past; populations shift and the gap widens silently without live evaluation." }
            ] },
          { type: "run", label: "▶ Check this month's live metrics", result: { log: "live AUC (last 30d): 0.851 -> 0.812  drift ALERT\nsegment 'new signups': precision 0.71 -> 0.49 (worst hit)\naction: re-run search on recent data, re-validate, re-ship", metrics: [{ k: "live AUC", v: "0.812 ⚠" }, { k: "drift", v: "detected" }] }, note: `The loop closes: drifting live metrics on a cohort send you back to <b>Search</b> to re-tune on fresh data. Evaluation is a habit, not a one-time gate.` }
        ]
      }
    ]
  },
  "expert-systems-reasoning": {
    title: "Expert System & Reasoning",
    icon: "🧩",
    goal: "Build a rule-based reasoning engine that answers queries correctly, resolves conflicts, and stays explainable.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the knowledge task",
        narrative: `<p>You're automating a logistics eligibility desk: given facts about a shipment, decide which handling rules fire. Decide first whether this is a learned model or a reasoning problem.</p>`,
        concepts: ["ai-search-problem", "ai-propositional-logic", "ai-csp"],
        steps: [{
          type: "decide", prompt: "Rules are written down by domain experts and must be auditable. Best approach?",
          options: [
            { label: "A logic/rule-based reasoning engine over an explicit knowledge base", best: true, feedback: "when the rules are known, must be explainable, and have little training data, encoding them as logic gives exact, auditable conclusions." },
            { label: "A deep neural network trained on a few hundred cases", best: false, feedback: "too little data, and it can't justify a decision rule-by-rule — the opposite of what an auditable desk needs." },
            { label: "Random guessing weighted by frequency", best: false, feedback: "ignores the explicit expert knowledge you already have. There's nothing to reason with." }
          ]
        }]
      },
      {
        phase: "Encode", icon: "📚", title: "Encode the knowledge",
        narrative: `<p>Translate expert statements into formal sentences. Propositional logic handles fixed facts; first-order logic adds objects, variables, and relations.</p>`,
        concepts: ["ai-propositional-logic", "aix-fol", "ai-inference-rules"],
        steps: [{
          type: "decide", prompt: "A rule reads 'every shipment over 30kg to a residential address needs a liftgate.' How do you encode it?",
          options: [
            { label: "First-order logic with quantified variables and relations (weight, destinationType)", best: true, feedback: "the 'every shipment such that...' pattern needs quantifiers over objects and their properties — exactly what first-order logic provides." },
            { label: "A single propositional symbol $LiftgateNeeded$", best: false, feedback: "one flat symbol can't express the 'for all shipments with these properties' structure; you'd need a separate symbol per shipment." },
            { label: "A floating-point weight", best: false, feedback: "this is a discrete logical rule, not a numeric score. Encoding it as a weight loses the exact condition." }
          ]
        }]
      },
      {
        phase: "Infer", icon: "⚙️", title: "Choose inference direction",
        narrative: `<p>With facts and rules in the base, you derive conclusions. Forward chaining pushes from facts to all consequences; backward chaining works from a goal you want to prove.</p>`,
        concepts: ["ai-inference-rules", "ai-graph-search", "ai-tree-search"],
        steps: [{
          type: "decide", prompt: "You want to answer one specific query: 'does shipment #482 need a liftgate?' Which is more efficient?",
          options: [
            { label: "Backward chaining from the goal, expanding only rules that could prove it", best: true, feedback: "starting from the goal explores only the relevant sub-rules instead of deriving every fact in the base — far cheaper for a single targeted query." },
            { label: "Forward chaining every rule to exhaustion", best: false, feedback: "that derives the entire closure of facts, most irrelevant to your one question. Wasteful for a single goal." },
            { label: "Guess yes", best: false, feedback: "skips reasoning entirely and gives no proof — defeating the purpose of an expert system." }
          ]
        }]
      },
      {
        phase: "Constraints", icon: "🧮", title: "Model the constraints",
        narrative: `<p>Beyond yes/no rules, the desk must assign trucks to routes under capacity and time-window limits — a constraint-satisfaction problem.</p>`,
        concepts: ["ai-csp", "ai-csp-search", "ai-search-problem"],
        steps: [{
          type: "decide", prompt: "How should the truck-to-route assignment be solved?",
          options: [
            { label: "Formulate as a CSP (variables, domains, constraints) and solve with backtracking search", best: true, feedback: "assignment under capacity and time-window limits is a textbook CSP; backtracking with constraint propagation prunes impossible partial assignments early." },
            { label: "Enumerate every possible full assignment and test each", best: false, feedback: "the assignment space is exponential; brute force without constraint propagation is intractable past a handful of trucks." },
            { label: "Assign trucks randomly", best: false, feedback: "it will violate capacity and time constraints constantly — the constraints are the whole problem." }
          ]
        }]
      },
      {
        phase: "Conflict", icon: "⚔️", title: "Resolve rule conflicts",
        narrative: `<p>Two rules fire with opposite conclusions: a 'hazmat' rule forbids air transport, an 'express' rule requires it. The engine needs a conflict-resolution policy.</p>`,
        concepts: ["ai-inference-rules", "ai-propositional-logic", "aix-fol"],
        steps: [{
          type: "decide", prompt: "Two fired rules contradict each other. What's the right design?",
          options: [
            { label: "Define explicit priority/specificity ordering so the more specific (safety) rule wins, and log the override", best: true, feedback: "a documented precedence (e.g. safety beats convenience) makes the resolution deterministic and explainable, and logging it keeps the audit trail." },
            { label: "Fire whichever rule was added to the file first", best: false, feedback: "file order is an accident of editing, not a justified priority — it'll produce arbitrary, unexplainable decisions." },
            { label: "Fire both and return a contradiction", best: false, feedback: "an unresolved contradiction makes the knowledge base inconsistent, from which it can 'prove' anything. You must resolve it." }
          ]
        }]
      },
      {
        phase: "Test", icon: "✅", title: "Test entailment",
        narrative: `<p>Verify the engine: feed known cases and confirm the conclusions it derives are exactly those the knowledge base logically entails — no missing and no spurious firings.</p>`,
        concepts: ["ai-inference-rules", "ai-graph-search", "ai-csp-search"],
        steps: [
          { type: "run", label: "▶ Run the entailment test suite", result: { log: "loaded 120 expert-labeled cases\nforward-chaining closure computed...\n114/120 conclusions match expert labels\n6 mismatches: all trace to one missing rule on 'temperature-controlled' goods\nno spurious firings detected", metrics: [{ k: "match", v: "114/120" }, { k: "missing rules", v: "1" }] } },
          { type: "decide", prompt: "Six cases failed, all from one missing rule. Fix?",
            options: [
              { label: "Add the missing temperature-controlled rule and re-run the suite", best: true, feedback: "the failures share a single gap in the knowledge base; encoding that rule should close all six at once. Then re-verify entailment." },
              { label: "Hard-code the 6 cases as exceptions", best: false, feedback: "patching individual cases hides the gap and won't generalize to the next temperature-controlled shipment. Fix the rule." }
            ] }
        ]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the engine",
        narrative: `<p>Ship the reasoner as a service the dispatch desk calls. Every decision must return its proof trace so a human can audit it.</p>`,
        concepts: ["ai-search-problem", "ai-inference-rules", "ai-graph-search"],
        steps: [
          { type: "decide", prompt: "How should the engine respond to each query in production?",
            options: [
              { label: "Return the decision plus the chain of rules that fired (an explanation), behind a versioned knowledge base", best: true, feedback: "the proof trace is what makes a rule system trustworthy and auditable, and versioning the KB lets you roll back a bad rule edit." },
              { label: "Return only a yes/no with no justification", best: false, feedback: "an unexplained decision can't be audited or debugged — you lose the main advantage of a reasoning system." }
            ] },
          { type: "run", label: "▶ Deploy KB v3 (canary)", result: { log: "publishing knowledge base v3 (412 rules)...\ncanary 5% of dispatch queries\nmedian inference latency 12ms\nexplanation trace attached to 100% of responses\npromoting to 100%.", metrics: [{ k: "rules", v: "412" }, { k: "latency", v: "12ms" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor coverage",
        narrative: `<p>The world adds new shipment types the rules never anticipated. You monitor how often queries fall through with no firing rule — the coverage gap.</p>`,
        concepts: ["ai-inference-rules", "ai-search-problem", "aix-fol"],
        steps: [
          { type: "decide", prompt: "What's the key health signal for a deployed rule engine?",
            options: [
              { label: "Rate of 'no rule fired' / unresolved-conflict cases, plus expert spot-checks of explanations", best: true, feedback: "queries with no matching rule reveal coverage gaps, and conflict spikes reveal new contradictions — both signal the KB needs new knowledge." },
              { label: "Only CPU usage", best: false, feedback: "performance metrics miss the real failure mode: the engine confidently mishandling or failing to handle new case types." }
            ] },
          { type: "run", label: "▶ Check coverage this week", result: { log: "queries: 41,200\nno-rule-fired: 1.1% -> 4.3% (NEW: drone-delivery shipments)\nunresolved conflicts: 0.2%\naction: encode drone-delivery rules, re-test entailment, redeploy", metrics: [{ k: "uncovered", v: "4.3% ⚠" }, { k: "conflicts", v: "0.2%" }] }, note: `The loop closes: a coverage gap on a brand-new shipment type sends you back to <b>Encode</b> to add knowledge. A rule base is never finished.` }
        ]
      }
    ]
  },
  "probabilistic-diagnosis": {
    title: "Bayesian Diagnostic Network",
    icon: "🔮",
    goal: "Build a Bayesian network that diagnoses likely causes from noisy evidence and reports calibrated probabilities.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Frame the diagnosis",
        narrative: `<p>A machine on the line throws intermittent faults. You want $P(\\text{cause}\\mid\\text{symptoms})$ — the probability of each root cause given the sensor readings you observe.</p>`,
        concepts: ["prob-bayes", "prob-conditional", "ai-bayes-net"],
        steps: [{
          type: "decide", prompt: "What quantity does the diagnostic system need to compute?",
          options: [
            { label: "The posterior $P(\\text{cause}\\mid\\text{evidence})$ over hidden causes given observed symptoms", best: true, feedback: "diagnosis is inferring hidden causes from observed effects — exactly a posterior over causes conditioned on the evidence you can measure." },
            { label: "Just the most frequent fault overall", best: false, feedback: "the marginal $P(\\text{cause})$ ignores the symptoms in front of you, so it can't tell this case apart from any other." },
            { label: "A point regression of fault severity", best: false, feedback: "you need a probability over discrete causes with uncertainty, not a single severity number." }
          ]
        }]
      },
      {
        phase: "Structure", icon: "🕸️", title: "Build the network structure",
        narrative: `<p>Lay out the graph: causes point to the symptoms they produce. The arrows encode which variables directly influence which.</p>`,
        concepts: ["ai-bayes-net", "prob-independence", "prob-joint-marginal"],
        steps: [{
          type: "decide", prompt: "How should you orient the edges?",
          options: [
            { label: "From causes to symptoms (cause -> sensor reading), matching the physical mechanism", best: true, feedback: "directing edges along the causal mechanism keeps the conditional tables small and interpretable, and the structure encodes the real independencies." },
            { label: "Connect every variable to every other variable", best: false, feedback: "a fully-connected graph throws away all independence structure, so the joint table blows up exponentially and inference becomes intractable." },
            { label: "From symptoms to causes only", best: false, feedback: "reversing the causal direction inflates the network and makes the conditional probabilities unnatural to specify." }
          ]
        }]
      },
      {
        phase: "Priors", icon: "🎲", title: "Set priors & CPTs",
        narrative: `<p>Each node needs numbers: prior probabilities for the root causes and conditional probability tables (CPTs) for $P(\\text{symptom}\\mid\\text{parents})$.</p>`,
        concepts: ["prob-conditional", "prob-total-prob", "ai-bayes-net"],
        steps: [
          { type: "decide", prompt: "You have plant logs plus engineer estimates. How do you fill the CPTs?",
            options: [
              { label: "Estimate from logged frequencies where data is plentiful, fall back to expert priors where it's sparse", best: true, feedback: "data-driven counts give calibrated CPTs where you have samples; expert priors cover the rare-event cells that data alone can't, blending both knowledge sources." },
              { label: "Set every probability to 0.5", best: false, feedback: "uniform tables throw away everything you know — the network would carry no real diagnostic signal." },
              { label: "Use only one engineer's guesses, ignoring the logs", best: false, feedback: "discarding the logged frequencies leaves the common cells less calibrated than they could be." }
            ] },
          { type: "run", label: "▶ Fit CPTs from logs", result: { log: "nodes: 9 (3 causes, 6 symptoms)\ncause priors from 14 months of logs\nCPTs: 41 parameters, 6 cells smoothed with expert priors (sparse)\nstructure validated: acyclic", metrics: [{ k: "nodes", v: "9" }, { k: "params", v: "41" }] } }
        ]
      },
      {
        phase: "Infer", icon: "⚙️", title: "Run exact inference",
        narrative: `<p>Given observed symptoms, compute the posterior over causes. Variable elimination sums out the unobserved variables in an efficient order.</p>`,
        concepts: ["ai-bayes-inference", "aix-variable-elimination", "prob-total-prob"],
        steps: [{
          type: "decide", prompt: "The network is moderate-sized and you need exact posteriors. Which inference?",
          options: [
            { label: "Variable elimination, marginalizing out unobserved nodes in a good order", best: true, feedback: "for a moderate network, eliminating hidden variables in a smart order gives exact posteriors far faster than enumerating the full joint." },
            { label: "Enumerate every entry of the full joint distribution", best: false, feedback: "the joint grows exponentially in the number of variables; full enumeration is what variable elimination exists to avoid." },
            { label: "Ignore the symptoms and report the priors", best: false, feedback: "that skips inference entirely — the evidence is exactly what should shift the posterior away from the prior." }
          ]
        }]
      },
      {
        phase: "Scale", icon: "🌊", title: "Approximate when needed",
        narrative: `<p>You extend the model and exact inference gets too slow on a densely connected sub-graph. Sampling approximates the posterior instead.</p>`,
        concepts: ["aix-gibbs-particle", "aix-markov-blanket", "ai-bayes-inference"],
        steps: [{
          type: "decide", prompt: "Exact inference is now intractable on a dense sub-network. What do you use?",
          options: [
            { label: "Gibbs / particle sampling, resampling each node from its Markov blanket", best: true, feedback: "when exact inference blows up, sampling each variable conditioned on its Markov blanket approximates the posterior and trades exactness for tractability." },
            { label: "Round all probabilities to 0 or 1", best: false, feedback: "hard-thresholding destroys the uncertainty the whole network exists to represent." },
            { label: "Delete the dense sub-network", best: false, feedback: "removing variables to make it easy discards real diagnostic structure — you'd diagnose worse, not faster-and-correct." }
          ]
        }]
      },
      {
        phase: "Calibrate", icon: "📊", title: "Evaluate calibration",
        narrative: `<p>A diagnostic probability is only useful if it's honest: among cases the model calls '70% bearing fault,' about 70% should truly be bearing faults.</p>`,
        concepts: ["ai-bayes-inference", "prob-bayes", "prob-conditional"],
        steps: [
          { type: "run", label: "▶ Build a calibration report", result: { log: "held-out: 900 diagnosed cases\nbin 0.6-0.7: predicted 0.65, observed 0.66  (good)\nbin 0.8-0.9: predicted 0.85, observed 0.71  (OVERCONFIDENT)\nmost-probable-cause accuracy: 0.82", metrics: [{ k: "top-1 acc", v: "0.82" }, { k: "high-conf bin", v: "0.85 vs 0.71 ⚠" }] } },
          { type: "decide", prompt: "The high-confidence bin is overconfident (says 0.85, real 0.71). Likely fix?",
            options: [
              { label: "Revisit the CPTs feeding that branch — sparse cells likely over-sharpened; re-smooth and re-estimate", best: true, feedback: "overconfidence usually traces to CPT cells estimated from too few samples; softening those with priors pulls the posteriors back toward honesty." },
              { label: "Just trust the model — accuracy is fine", best: false, feedback: "accuracy can look fine while the probabilities lie; an overconfident 0.85 misleads the technicians who act on it." }
            ] }
        ]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the diagnostician",
        narrative: `<p>Ship the network behind the maintenance console. It ranks likely causes with probabilities so a technician can act on the most-probable explanation first.</p>`,
        concepts: ["ai-bayes-net", "ai-bayes-inference", "prob-joint-marginal"],
        steps: [
          { type: "decide", prompt: "How should the deployed system present a diagnosis?",
            options: [
              { label: "A ranked list of causes with posterior probabilities and which evidence drove them", best: true, feedback: "ranked posteriors let the technician triage, and surfacing the influential evidence makes the reasoning transparent and trustworthy." },
              { label: "A single cause with no probability", best: false, feedback: "hiding the uncertainty removes the network's main value — when it's only 55% sure, the technician needs to know that." }
            ] },
          { type: "run", label: "▶ Deploy network v2", result: { log: "publishing Bayesian net v2 (9 nodes)...\ninference p99: 8ms per query\nreturns top-3 causes + posteriors + evidence trace\nshadow agreement with senior techs: 88%\nlive.", metrics: [{ k: "p99", v: "8ms" }, { k: "tech agreement", v: "88%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor in production",
        narrative: `<p>As equipment ages and lines change, the real cause frequencies drift away from the priors you fit. You watch for that drift and for fresh miscalibration.</p>`,
        concepts: ["prob-bayes", "ai-bayes-inference", "prob-total-prob"],
        steps: [
          { type: "decide", prompt: "What should you monitor for a deployed diagnostic network?",
            options: [
              { label: "Confirmed-cause frequencies vs the priors, ongoing calibration, and the rate of 'all causes low-probability' cases", best: true, feedback: "drifting cause frequencies mean the priors/CPTs are stale, recurring miscalibration erodes trust, and many flat posteriors hint at a missing cause node." },
              { label: "Nothing — Bayes is self-correcting", best: false, feedback: "the network only updates within its fixed structure and tables; if the underlying frequencies shift, stale priors quietly bias every diagnosis." }
            ] },
          { type: "run", label: "▶ Check this quarter's monitors", result: { log: "confirmed-cause mix shifted: 'belt wear' 12% -> 27% (new supplier belts)\ncalibration drift in 2 bins\n3.5% of cases: all causes < 0.3 (possible missing cause)\naction: re-fit priors/CPTs, consider adding a cause node", metrics: [{ k: "prior drift", v: "detected ⚠" }, { k: "flat posteriors", v: "3.5%" }] }, note: `The loop closes: drifting cause frequencies and flat posteriors send you back to <b>Priors</b> (and maybe <b>Structure</b>) to refit. A diagnostic net must track a changing world.` }
        ]
      }
    ]
  },
  "scientific-modeling": {
    title: "Scientific Model Fitting",
    icon: "🔬",
    goal: "Fit a physical model to noisy experimental data, quantify uncertainty, and validate it against held-out measurements.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Choose the model form",
        narrative: `<p>You measured reaction rate versus temperature. Theory suggests an Arrhenius-style relationship. The first decision is the functional form, not the fitting method.</p>`,
        concepts: ["ml-linear-regression", "ml-likelihood", "probx-derived"],
        steps: [{
          type: "decide", prompt: "Theory predicts $\\log(\\text{rate}) = a - b/T$. How do you set up the model?",
          options: [
            { label: "Fit the theory-driven form (linear in $1/T$ after the log transform), so parameters $a,b$ are physically meaningful", best: true, feedback: "using the mechanistic form makes the fitted coefficients interpretable physical constants and extrapolates sensibly, unlike a generic curve." },
            { label: "Fit a 12th-degree polynomial in $T$", best: false, feedback: "a high-degree polynomial chases the noise and oscillates wildly between points — great in-sample fit, meaningless physics, terrible extrapolation." },
            { label: "Connect the dots with straight segments", best: false, feedback: "interpolating the raw points fits the noise exactly and gives no smooth, parameterized law to reason about." }
          ]
        }]
      },
      {
        phase: "Noise", icon: "🌫️", title: "Model the measurement noise",
        narrative: `<p>Each measurement carries error. The noise model determines the right objective: independent Gaussian noise makes least-squares equal to maximum likelihood.</p>`,
        concepts: ["probx-convolution", "prob-uniform-exponential", "ml-likelihood"],
        steps: [{
          type: "decide", prompt: "Repeated readings scatter symmetrically around the true value. What noise model and objective?",
          options: [
            { label: "Independent Gaussian noise -> minimize sum of squared residuals (= MLE)", best: true, feedback: "symmetric, independent scatter is well modeled as Gaussian, and under that assumption least-squares is exactly maximum likelihood." },
            { label: "Assume zero noise and fit exactly through every point", best: false, feedback: "real measurements always have error; forcing the curve through every point fits the noise and inflates the parameters' apparent precision." },
            { label: "Heavy outliers but use plain least-squares anyway", best: false, feedback: "if the scatter actually has fat tails, squared loss lets a few outliers dominate — you'd need a robust loss instead." }
          ]
        }]
      },
      {
        phase: "Fit", icon: "📈", title: "Fit the parameters",
        narrative: `<p>Estimate $a$ and $b$ by least squares / maximum likelihood. The fit returns point estimates and residuals to inspect.</p>`,
        concepts: ["ml-linear-regression", "ml-likelihood", "ml-loss"],
        steps: [
          { type: "run", label: "▶ Fit by least squares", result: { log: "n = 84 measurements\nfitting log(rate) = a - b/T ...\na = 9.41   b = 4820 K\nresidual std: 0.061   R^2 = 0.987\nresiduals look unstructured (no pattern vs T)", metrics: [{ k: "R^2", v: "0.987" }, { k: "b (K)", v: "4820" }, { k: "resid std", v: "0.061" }] } }
        ]
      },
      {
        phase: "Uncertainty", icon: "📐", title: "Quantify uncertainty",
        narrative: `<p>A fit without error bars is half an answer. You need uncertainty on the parameters and predictive bands that widen where data is sparse.</p>`,
        concepts: ["cls-bayesian-regression", "probx-total-variance", "cls-gaussian-process"],
        steps: [{
          type: "decide", prompt: "How do you report uncertainty on the fitted law?",
          options: [
            { label: "Bayesian regression (or GP) giving posterior parameter intervals and predictive bands that widen where data is thin", best: true, feedback: "a probabilistic fit reports credible intervals on $a,b$ and prediction bands that honestly widen in extrapolation regions — exactly what a scientific claim needs." },
            { label: "Report only the point estimates", best: false, feedback: "point estimates with no error bars overstate certainty; a reviewer can't tell a tight constraint from a guess." },
            { label: "Quote $R^2$ as the uncertainty", best: false, feedback: "$R^2$ is in-sample fit quality, not a confidence interval on the parameters or predictions." }
          ]
        }]
      },
      {
        phase: "Robustness", icon: "🛡️", title: "Handle outliers",
        narrative: `<p>A few sensor glitches sit far off the trend. Plain squared loss would let them yank the fit. Decide how to keep the estimate stable.</p>`,
        concepts: ["cls-svr", "mlx-lwr", "ml-ica"],
        steps: [{
          type: "decide", prompt: "Three measurements are clearly instrument glitches, far off-trend. Best response?",
          options: [
            { label: "Use a robust regression (e.g. SVR / Huber-style loss) so outliers don't dominate the fit", best: true, feedback: "a loss that caps the influence of large residuals keeps a handful of glitches from bending the whole curve, without hand-deleting data." },
            { label: "Keep plain least-squares and ignore them", best: false, feedback: "squared loss squares those big residuals, so the few glitches dominate and pull the line off the true trend." },
            { label: "Quietly delete any point that hurts $R^2$", best: false, feedback: "dropping points just because they lower the score is data dredging — you'd manufacture a fit, not measure one." }
          ]
        }]
      },
      {
        phase: "Validate", icon: "🔒", title: "Validate on held-out data",
        narrative: `<p>The real test of a scientific model is prediction on measurements it never saw — ideally at temperatures outside the fitted range.</p>`,
        concepts: ["ml-regression-metrics", "cls-bayesian-regression", "cls-gaussian-process"],
        steps: [
          { type: "run", label: "▶ Predict on held-out runs", result: { log: "held-out: 20 runs, incl. 5 at higher T (extrapolation)\nin-range RMSE 0.058 (matches train)\nextrapolation: 4/5 inside 95% predictive band\none point outside band at T = 720K (band correctly wide there)", metrics: [{ k: "RMSE", v: "0.058" }, { k: "in-band", v: "19/20" }] } },
          { type: "decide", prompt: "Validation looks good and the bands behaved sensibly. What does this confirm?",
            options: [
              { label: "The model generalizes and its uncertainty is honest — including widening correctly in extrapolation", best: true, feedback: "matching held-out RMSE plus coverage near the nominal 95% means both the fit and its error bars are trustworthy out of sample." },
              { label: "The model is perfect and needs no uncertainty", best: false, feedback: "one point fell outside the band — the uncertainty is doing its job. A model that's never wrong is a model with dishonest error bars." }
            ] }
        ]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the model",
        narrative: `<p>Ship the fitted law as a calibration service the lab software calls to convert temperature into a predicted rate, with bands attached.</p>`,
        concepts: ["ml-linear-regression", "cls-bayesian-regression", "ml-regression-metrics"],
        steps: [
          { type: "decide", prompt: "How should the deployed model serve predictions?",
            options: [
              { label: "Return the predicted rate with its predictive interval, and flag inputs far outside the fitted range", best: true, feedback: "shipping the band with the point estimate lets downstream tools trust-or-flag a value, and an extrapolation guard warns when the input leaves the validated regime." },
              { label: "Return a single number with no caveats", best: false, feedback: "a bare prediction far outside the fitted temperature range can be wildly wrong with no warning — the band and the guard exist for exactly that." }
            ] },
          { type: "run", label: "▶ Deploy calibration model v1", result: { log: "publishing Arrhenius fit v1...\nserves predicted rate + 95% band\nout-of-range guard active (320K-700K validated)\nlatency 2ms\nlive.", metrics: [{ k: "valid range", v: "320-700K" }, { k: "latency", v: "2ms" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor against new data",
        narrative: `<p>New equipment, reagents, or conditions can shift the true relationship. You compare incoming measurements against the model's predictive bands to catch drift.</p>`,
        concepts: ["ml-regression-metrics", "probx-total-variance", "cls-gaussian-process"],
        steps: [
          { type: "decide", prompt: "What should you watch once the model is in use?",
            options: [
              { label: "Rate of new measurements falling outside the predictive band, and residual mean drift over time", best: true, feedback: "a rising out-of-band rate or a residual mean drifting off zero signals the physical relationship (or the instrument) has changed and a refit is due." },
              { label: "Nothing — physical laws don't change", best: false, feedback: "the law may not, but reagents, calibration, and equipment do; an unmonitored fit silently goes stale as conditions shift." }
            ] },
          { type: "run", label: "▶ Check incoming measurements", result: { log: "last 200 measurements\nout-of-band rate: 5% (expected) -> 18% above 600K\nresidual mean drifted +0.04 (new reagent batch)\naction: collect fresh high-T data, refit, re-validate", metrics: [{ k: "out-of-band", v: "18% ⚠" }, { k: "resid drift", v: "+0.04" }] }, note: `The loop closes: drift against the predictive bands sends you back to <b>Fit</b> with fresh data. A scientific model is only valid while its conditions hold.` }
        ]
      }
    ]
  },
  "linear-algebra-engines": {
    title: "Numerical PCA Engine",
    icon: "🧮",
    goal: "Build a numerically stable PCA / dimensionality-reduction engine — formulate, decompose, validate, and optimize it.",
    stages: [
      {
        phase: "Frame", icon: "🎯", title: "Formulate the problem",
        narrative: `<p>You have a $10^6 \\times 500$ data matrix and want to compress it to a handful of directions that capture most of the variance. Frame what PCA actually computes.</p>`,
        concepts: ["fnd-matrix", "fnd-vector", "ml-pca"],
        steps: [{
          type: "decide", prompt: "What is PCA looking for in this matrix?",
          options: [
            { label: "The orthogonal directions of maximum variance — the top eigenvectors of the covariance matrix", best: true, feedback: "PCA finds an orthonormal basis ordered by how much data variance each direction captures; the leading ones summarize the data with few coordinates." },
            { label: "The rows with the largest values", best: false, feedback: "PCA is about directions in feature space, not picking raw rows; magnitude of individual entries isn't the target." },
            { label: "A random low-dimensional projection", best: false, feedback: "a random projection ignores where the variance actually is; PCA deliberately keeps the high-variance directions." }
          ]
        }]
      },
      {
        phase: "Prep", icon: "🧹", title: "Center & form covariance",
        narrative: `<p>PCA acts on the covariance structure. You must center the columns first; otherwise the leading direction just points at the mean. The covariance matrix is symmetric positive-semidefinite.</p>`,
        concepts: ["la-psd", "la-transpose", "fnd-matvec"],
        steps: [{
          type: "decide", prompt: "Before decomposing, what must you do to the data matrix $X$?",
          options: [
            { label: "Subtract each column's mean (center), then form $\\frac{1}{n}X^\\top X$, which is symmetric PSD", best: true, feedback: "centering makes the first component capture variance rather than the offset, and the resulting covariance is symmetric PSD — exactly the structure the decomposition exploits." },
            { label: "Decompose the raw uncentered matrix", best: false, feedback: "without centering, the top direction is dominated by the mean offset, not the variance you care about." },
            { label: "Randomly shuffle the entries first", best: false, feedback: "shuffling destroys the correlations between features that PCA is meant to find." }
          ]
        }]
      },
      {
        phase: "Decompose", icon: "🔱", title: "Choose the decomposition",
        narrative: `<p>You can get the components by eigendecomposing the covariance or by taking the SVD of the (centered) data matrix directly. One is far more numerically stable.</p>`,
        concepts: ["la-svd", "la-spectral", "fnd-eigen"],
        steps: [{
          type: "decide", prompt: "Which decomposition should the engine use for the components?",
          options: [
            { label: "SVD of the centered data matrix directly — avoids forming $X^\\top X$ and is more numerically stable", best: true, feedback: "computing $X^\\top X$ squares the condition number and loses precision; SVD of $X$ gives the same components while staying numerically well-behaved." },
            { label: "Invert the covariance matrix", best: false, feedback: "you need its eigen-directions, not its inverse; inverting a near-singular covariance is unstable and unnecessary." },
            { label: "A determinant of the data matrix", best: false, feedback: "the determinant is a single scalar; it tells you nothing about the principal directions you need." }
          ]
        }]
      },
      {
        phase: "Implement", icon: "⌨️", title: "Implement & pick rank",
        narrative: `<p>Run the SVD and decide how many components to keep. The singular values tell you how much variance each direction explains; you keep enough to hit a variance target.</p>`,
        concepts: ["la-svd", "la-trace", "ml-pca"],
        steps: [
          { type: "run", label: "▶ Compute truncated SVD", result: { log: "centered X (1.0M x 500)\nrandomized SVD, k=50...\nsingular values: s1=412, s2=388, ..., s50=9.1\ncumulative variance: top 12 -> 90%, top 28 -> 95%\nkept k = 28 (95% variance)", metrics: [{ k: "components", v: "28" }, { k: "variance kept", v: "95%" }] } },
          { type: "decide", prompt: "Top 12 components capture 90% of variance, top 28 capture 95%. How many to keep?",
            options: [
              { label: "Keep 28 (95%) — or 12 if downstream tolerates 90%; choose by the variance/compression trade-off", best: true, feedback: "the cumulative variance curve is exactly the right tool: pick the smallest rank that meets your accuracy target, balancing fidelity against compression." },
              { label: "Always keep all 500", best: false, feedback: "keeping every component defeats the purpose — you've done a rotation, not a reduction." }
            ] }
        ]
      },
      {
        phase: "Validate", icon: "🔎", title: "Validate numerically",
        narrative: `<p>A linear-algebra engine must be correct to floating-point precision. Check orthonormality of the components and the reconstruction error against theory.</p>`,
        concepts: ["la-identity-diagonal", "la-rank-independence", "fnd-matvec"],
        steps: [
          { type: "run", label: "▶ Run numerical checks", result: { log: "orthonormality: max |V^T V - I| = 3.1e-14  (machine precision OK)\nreconstruction error matches sum of dropped s_i^2 (theory): rel diff 2e-12\nrank check: 28 components linearly independent\nno NaN/inf", metrics: [{ k: "orthonormality err", v: "3e-14" }, { k: "recon vs theory", v: "2e-12" }] } },
          { type: "decide", prompt: "Orthonormality holds to 3e-14 and reconstruction matches theory to 2e-12. Verdict?",
            options: [
              { label: "Numerically sound — errors are at machine-precision level", best: true, feedback: "errors near $10^{-14}$ are just floating-point round-off, and reconstruction matching the dropped singular values confirms the math is implemented correctly." },
              { label: "Broken — the errors aren't exactly zero", best: false, feedback: "exact zero is impossible in floating point; $10^{-14}$ is round-off, not a bug. Demanding literal zero would reject every correct implementation." }
            ] }
        ]
      },
      {
        phase: "Stabilize", icon: "🛡️", title: "Guard against ill-conditioning",
        narrative: `<p>Some feature columns are nearly collinear, making the covariance close to singular. The engine needs to detect and handle this rank deficiency gracefully.</p>`,
        concepts: ["la-rank-independence", "la-determinant", "la-inverse"],
        steps: [{
          type: "decide", prompt: "Two feature columns are nearly identical (collinear). What should the engine do?",
          options: [
            { label: "Detect the rank deficiency (tiny singular values) and drop/merge the redundant direction", best: true, feedback: "near-collinear columns produce near-zero singular values; recognizing them keeps the decomposition stable instead of amplifying round-off in a near-singular system." },
            { label: "Invert the covariance anyway", best: false, feedback: "inverting a near-singular matrix explodes tiny errors into huge ones — exactly the instability you must avoid." },
            { label: "Ignore it; floating point will sort it out", best: false, feedback: "unhandled rank deficiency silently corrupts the small components with numerical noise." }
          ]
        }]
      },
      {
        phase: "Optimize", icon: "⚡", title: "Optimize the routine",
        narrative: `<p>The engine must be fast at scale. Replace the full SVD with a randomized/truncated method that only computes the top components, and lean on optimized matrix multiplies.</p>`,
        concepts: ["la-matmul", "la-svd", "fnd-matvec"],
        steps: [
          { type: "decide", prompt: "Full SVD of a 1M x 500 matrix is too slow. How do you speed it up while staying accurate?",
            options: [
              { label: "Use randomized truncated SVD (top-k only) built on batched, BLAS-optimized matrix multiplies", best: true, feedback: "you only need the top components, so a randomized method that skips the rest — riding fast matmul kernels — gets near-exact leading directions at a fraction of the cost." },
              { label: "Compute the full 500x500 eigendecomposition every query", best: false, feedback: "computing all 500 components when you keep 28 wastes most of the work; truncated methods exist precisely for this." },
              { label: "Loop over entries in pure Python", best: false, feedback: "elementwise Python loops abandon the optimized linear-algebra kernels and are orders of magnitude slower." }
            ] },
          { type: "run", label: "▶ Benchmark optimized engine", result: { log: "full SVD: 41.0s\nrandomized top-28 SVD: 2.3s  (18x faster)\ntop components match full SVD: cosine 0.9999\nthroughput: 3.4M rows/s on the projection step", metrics: [{ k: "speedup", v: "18x" }, { k: "fidelity", v: "0.9999" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor stability in production",
        narrative: `<p>As new data flows in, its covariance structure shifts and conditioning can degrade. You watch the engine's numerical health so a silently ill-conditioned input doesn't return garbage.</p>`,
        concepts: ["la-rank-independence", "la-svd", "la-spectral"],
        steps: [
          { type: "decide", prompt: "What should the deployed PCA engine monitor?",
            options: [
              { label: "Condition number / smallest singular value, variance-explained drift, and reconstruction error on a sample", best: true, feedback: "a creeping condition number warns of instability, drifting variance-explained means the components no longer fit the data, and reconstruction error is the live correctness check." },
              { label: "Only the wall-clock latency", best: false, feedback: "speed says nothing about correctness; an ill-conditioned input can return a fast, completely wrong projection." }
            ] },
          { type: "run", label: "▶ Check stability monitors", result: { log: "incoming batch (this week)\ncondition number: 2.1e3 -> 4.8e6  (collinearity rising ALERT)\nvariance-explained by top 28: 95% -> 88% (structure shifted)\nreconstruction error up 1.9x\naction: re-center, re-fit components, re-check rank", metrics: [{ k: "cond number", v: "4.8e6 ⚠" }, { k: "var explained", v: "88%" }] }, note: `The loop closes: rising condition number and drifting variance send you back to <b>Prep</b>/<b>Decompose</b> to refit on current data. A numerical engine must stay watched for stability.` }
        ]
      }
    ]
  }
});
