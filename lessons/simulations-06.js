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
        narrative: `<p>You are training a <b>ResNet-18 on CIFAR-10</b> — the canonical image-classification benchmark from Krizhevsky (2009): 60,000 color images at 32×32 pixels, evenly split across 10 classes (airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck), with 50,000 train and 10,000 test. Training is just minimizing a cost surface. Before touching the optimizer, decide what you are actually descending: the per-example loss aggregated into an empirical risk $J(\\theta)=\\frac{1}{n}\\sum_i \\ell(\\theta;x_i,y_i)$. The choice of $\\ell$ is not cosmetic — it sets the entire geometry of the surface, the size of the gradients, and whether descent even has a slope to follow. With 10 mutually-exclusive classes, pick the loss that matches the label type and the probabilistic assumption, and the optimizer's job becomes possible; pick wrong and no learning rate will save you.</p>`,
        concepts: ["ai-loss-minimization", "ml-cost", "ml-loss"],
        insight: `<b>The loss decides the gradient.</b> Take a CIFAR-10 image whose true class is <i>airplane</i> (index 0) but the net confidently predicts <i>bird</i> (index 2) at 0.98. Cross-entropy returns loss $\\approx 3.9$ with a gradient of magnitude $\\sim 0.98$ pushing hard the right way; squared error on class indices returns loss $(2-0)^2=4$ but a gradient that <b>shrinks toward zero exactly when the model is most wrong</b>; accuracy returns a flat $0$ with gradient $0$ everywhere. Same mistake, three completely different signals to descend. With 10 classes, only cross-entropy on the softmax over all 10 logits gives a usable slope.`,
        data: {
          caption: "Same CIFAR-10 mistake, three candidate losses (true class airplane=0, shown over 3 of 10 logits)",
          columns: ["softmax output", "cross-entropy $\\ell$", "MSE-on-index $\\ell$", "accuracy", "usable gradient?"],
          rows: [
            ["airplane .02 · bird .98", "3.91", "4.00", "0", "CE: yes · others: ~no"],
            ["near-uniform over 10", "2.30", "—", "0", "CE: yes"],
            ["airplane .98 · bird .01", "0.02", "0.00", "1", "CE: small (good)"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `Cross-entropy stays smooth and large when the model is wrong; MSE-on-index flattens and accuracy is a step function with zero slope. Only the first gives descent something to follow everywhere. (Chance loss over 10 classes is $\\ln 10\\approx2.30$.)`
        },
        symbols: [
          { sym: "$J(\\theta)$", desc: "the empirical risk — the average loss over the training set; the surface we descend." },
          { sym: "$\\theta$", desc: "all the model's trainable parameters (weights and biases) packed into one vector." },
          { sym: "$\\ell(\\theta;x_i,y_i)$", desc: "the per-example loss for input $x_i$ with true label $y_i$ under parameters $\\theta$." },
          { sym: "$n$", desc: "number of training examples being averaged over." },
          { sym: "$p$", desc: "the model's predicted probability vector over classes (here the softmax output)." }
        ],
        steps: [{
          type: "decide", prompt: "Your task is multi-class classification. Which loss should you minimize?",
          options: [
            { label: "Cross-entropy on the softmax outputs", best: true, feedback: "design decision: cross-entropy is the negative log-likelihood of the categorical distribution, so minimizing it IS maximum-likelihood estimation for class labels. Mechanism: paired with softmax, its gradient simplifies to (predicted probability − one-hot target), which is large and correctly-signed precisely when the model is confidently wrong — the ideal teaching signal. Tradeoff: none for this label type; it is the canonical choice. This is the right cost to descend." },
            { label: "Mean-squared error on the class indices", best: false, feedback: "this fails on two mechanisms. First, treating class ids 0,1,2 as real numbers invents a fake ordering — it claims class 2 is 'twice as far' from class 0 as class 1, which is meaningless for unordered categories. Second, its gradient is proportional to the residual times the saturating output slope, so when the model is confidently wrong the gradient SHRINKS toward zero — the opposite of what you want. Wrong loss family." },
            { label: "Raw accuracy", best: false, feedback: "accuracy is a step function: it stays flat as you nudge the weights and only jumps when a prediction flips across the decision boundary. That means its gradient is zero almost everywhere — there is literally no slope for descent to follow. Accuracy is a fine metric to REPORT, but it cannot be a loss to OPTIMIZE." }
          ]
        }]
      },
      {
        phase: "Init", icon: "🌱", title: "Initialize the weights",
        narrative: `<p>ResNet-18's first gradients depend heavily on the starting weights. Each of its ~18 weighted layers multiplies its input by a weight matrix; if the typical multiplier is bigger than 1 the signal grows geometrically with depth and explodes, and if it is smaller than 1 the signal shrinks geometrically and vanishes — before a single gradient step. The fix is the He initialization the ResNet paper itself uses (He et al., 2015): set the initial weight variance so that, on average, each ReLU layer neither magnifies nor shrinks the signal, keeping activations and gradients at a usable scale all the way down the stack.</p>`,
        concepts: ["dl-init", "dl-vanishing-gradient", "dl-neuron"],
        insight: `<b>Variance compounds with depth.</b> A neuron sums $n_{\\text{in}}$ independent products $w_j x_j$, so the output variance is $n_{\\text{in}}\\,\\mathrm{Var}(w)\\,\\mathrm{Var}(x)$; the per-layer signal-scaling factor is therefore $g^2 = n_{\\text{in}}\\,\\mathrm{Var}(w)$ (halved to $\\tfrac12 n_{\\text{in}}\\mathrm{Var}(w)$ for ReLU, which zeroes half the inputs). Setting $g=1$ and solving gives the He rule $\\mathrm{Var}(w)=2/n_{\\text{in}}$ for ReLU (Xavier's $1/n_{\\text{in}}$ for tanh). After 20 layers the scale is $g^{20}$: at $g=1.3$ that's $\\sim$190× (explode); at $g=0.8$ it's $\\sim$0.012× (vanish); only $g\\approx 1$ survives. So a 512-wide ReLU layer draws weights with $\\sigma=\\sqrt{2/512}\\approx 0.0625$, not $0.5$ and not $10$.`,
        data: {
          caption: "Activation std as the signal passes down the stack, by init scheme",
          columns: ["scheme", "layer 1 std", "layer 10 std", "layer 20 std", "verdict"],
          rows: [
            ["He ($\\sigma^2=2/\\text{fan-in}$)", "1.01", "0.98", "1.03", "healthy"],
            ["too small ($\\sigma=0.01$)", "0.31", "1e-5", "3e-10", "vanished"],
            ["too large ($\\sigma=10$)", "82", "1e9", "nan", "exploded"],
            ["all zeros", "0", "0", "0", "dead / symmetric"]
          ],
          note: `Only the variance-scaled init keeps the std near 1 across all 20 layers. The others are dead within ten layers.`
        },
        symbols: [
          { sym: "$\\sigma$", desc: "standard deviation of the initial random weights — the knob that sets signal scale." },
          { sym: "$\\sigma^2$", desc: "variance of those weights; He/Xavier set it to a value derived from layer width." },
          { sym: "fan-in", desc: "number of inputs into a neuron (the previous layer's width); larger fan-in means more terms summed, so each weight must be smaller." },
          { sym: "$g$", desc: "the per-layer signal-scaling factor; $g\\approx 1$ keeps depth stable, $g\\ne 1$ compounds to explosion or vanishing." }
        ],
        steps: [{
          type: "decide", prompt: "How should you initialize a 20-layer network?",
          options: [
            { label: "Xavier / He init, variance scaled by fan-in", best: true, feedback: "design decision: choose the init variance from the layer's fan-in so the expected signal-scaling factor per layer is $\\approx 1$. Mechanism: a neuron sums fan-in products, whose variance grows with fan-in; dividing the weight variance by fan-in cancels that growth, holding activation and gradient magnitudes roughly constant across all 20 layers. Tradeoff: requires matching the scheme to the nonlinearity (He for ReLU, Xavier for tanh), but that's a lookup, not a cost. Signals survive to the bottom layers." },
            { label: "All weights set to zero", best: false, feedback: "this fails by symmetry, not scale. With identical zero weights, every neuron in a layer computes the same output, so backprop hands every neuron the same gradient — they update identically and never differentiate. The whole layer collapses to a single effective unit forever. You must break symmetry with random values." },
            { label: "Large random values, $\\sigma=10$", best: false, feedback: "with $\\sigma=10$ each layer's signal-scaling factor is far above 1, so activations grow geometrically with depth (see the table: layer-20 std hits nan). Saturating nonlinearities pin to their extremes and gradients either explode or, past saturation, die. The loss diverges on step one. The magnitude is the problem; scale it down to $\\sqrt{2/\\text{fan-in}}$." }
          ]
        }]
      },
      {
        phase: "Diagnose", icon: "💥", title: "Diagnose divergence",
        narrative: `<p>You launch a first run and the loss shoots to infinity. Before changing the model, read the gradient and the learning rate. Divergence has a signature: the loss and the gradient norm grow TOGETHER, step over step, until they overflow to NaN. That is the fingerprint of a step size $\\alpha$ so large that each update $\\theta\\leftarrow\\theta-\\alpha\\nabla J$ overshoots the minimum and lands somewhere steeper, which makes the next gradient bigger, which makes the next overshoot worse — a positive feedback loop. Read the log before you touch the architecture.</p>`,
        concepts: ["fnd-gradient", "ml-gradient-descent", "fnd-derivative"],
        insight: `<b>The lr sweet spot spans orders of magnitude.</b> On this model, $\\alpha=1.0$ diverges to NaN in 30 steps (grad norm $3.2\\!\\times\\!10^5$ at step 20); $\\alpha=0.001$ is stable but crawls (loss 2.31→2.10 in 30 steps); $\\alpha=0.05$ converges cleanly (2.31→0.74). The cure for the divergence above is not a bigger model or more epochs — it's dropping $\\alpha$ by roughly $20\\times$.`,
        data: {
          caption: "Loss / grad-norm-per-step log at three learning rates",
          columns: ["step", "$\\alpha=1.0$ loss", "$\\alpha=0.001$ loss", "$\\alpha=0.05$ loss", "$\\alpha=1.0$ grad norm"],
          rows: [
            ["0", "2.31", "2.31", "2.31", "1.4e1"],
            ["10", "9.8e2", "2.28", "1.62", "2.0e3"],
            ["20", "4.1e7", "2.19", "1.05", "3.2e5"],
            ["30", "nan", "2.10", "0.74", "nan"]
          ],
          note: `Divergent runs show loss AND grad norm climbing together until overflow — the telltale of an oversized step, not a modeling bug.`
        },
        chart: {
          type: "line", title: "Loss vs steps at three learning rates",
          xlabel: "step", ylabel: "loss (log scale feel)",
          series: [
            { name: "lr = 1.0 (diverge)", color: "#ff7b72", points: [[0, 2.31], [10, 980], [20, 41000000], [30, 60000000]] },
            { name: "lr = 0.001 (crawl)", color: "#ffb454", points: [[0, 2.31], [10, 2.28], [20, 2.19], [30, 2.10]] },
            { name: "lr = 0.05 (converge)", color: "#7ee787", points: [[0, 2.31], [10, 1.62], [20, 1.05], [30, 0.74]] }
          ]
        },
        symbols: [
          { sym: "$\\theta\\leftarrow\\theta-\\alpha\\nabla J$", desc: "the gradient-descent update: move the parameters $\\theta$ a step of size $\\alpha$ in the downhill direction." },
          { sym: "$\\alpha$", desc: "the learning rate — how far each step moves; too large overshoots, too small crawls." },
          { sym: "$\\nabla J$", desc: "the gradient of the loss with respect to $\\theta$; points uphill, so we subtract it." },
          { sym: "grad norm", desc: "the length $\\lVert\\nabla J\\rVert$ of the gradient vector; a growing norm with a growing loss signals divergence." }
        ],
        steps: [
          { type: "run", label: "▶ Run 1 (lr = 1.0)", result: { log: "step 0   loss 2.31\nstep 10  loss 9.8e2\nstep 20  loss 4.1e7\nstep 30  loss nan  (DIVERGED)\ngrad norm at step 20: 3.2e5", metrics: [{ k: "final loss", v: "nan" }, { k: "grad norm", v: "3.2e5" }], chart: {
            type: "line", title: "Gradient norm over steps (lr = 1.0, diverging)",
            xlabel: "step", ylabel: "grad norm",
            series: [
              { name: "grad norm", color: "#ff7b72", points: [[0, 14], [10, 2000], [20, 320000], [30, 500000]] }
            ]
          } } },
          { type: "decide", prompt: "The loss diverged to nan. Most likely cause?",
            options: [
              { label: "Learning rate too high — each step overshoots the minimum", best: true, feedback: "design decision: the first lever to turn is the step size, because the log shows the divergence signature — loss and grad norm climbing together to NaN. Mechanism: an oversized $\\alpha$ makes the update overshoot the valley, landing on a steeper slope; the next gradient is therefore larger, the next overshoot worse, and the loop runs to overflow. Fix: lower $\\alpha$ (here $\\sim20\\times$, to 0.05) and the same model converges. Lower the step size first." },
              { label: "Not enough training epochs", best: false, feedback: "this gets cause and effect backwards. The process is divergent, so MORE steps don't help — they just reach NaN faster, as the step-30 row shows. Epoch count controls how long a CONVERGING run trains; it does nothing for a run that's blowing up. The instability must be cured before more steps mean anything." },
              { label: "The model is too small", best: false, feedback: "capacity controls whether the model can FIT the data, not whether the loss numerically blows up. A tiny model and a huge model both diverge identically under an oversized learning rate — because this is a step-size instability in the optimizer, completely independent of how many parameters $\\theta$ holds." }
            ] }
        ]
      },
      {
        phase: "Optimizer", icon: "🚀", title: "Pick optimizer & schedule",
        narrative: `<p>With a sane learning rate, choose how to take steps. Plain full-batch descent is slow; you want momentum, which averages recent gradients to power through flat regions and dampen oscillation, and adaptivity, which gives each parameter its own effective step based on its gradient history. Adam does both at once: it keeps a running mean of the gradient $m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t$ (momentum) and a running mean of its square $v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2$ (per-parameter scale), then steps by $\\theta \\leftarrow \\theta - \\alpha\\, m_t/(\\sqrt{v_t}+\\epsilon)$ — dividing each coordinate by its own gradient magnitude. On top of that, a schedule anneals the global rate $\\alpha$ over time in two explicit phases: a linear warmup for the first $t_{\\text{warm}}$ steps, $\\alpha_t = \\alpha_{\\max}\\cdot t/t_{\\text{warm}}$, ramping from $\\approx 0$ up to the peak, then a cosine decay over the remaining $T$ steps, $\\alpha_t = \\tfrac{1}{2}\\alpha_{\\max}\\big(1+\\cos(\\pi\\,t/T)\\big)$, so the model takes big strides early and fine ones near the minimum.</p>`,
        concepts: ["dl-optimizers", "ai-sgd", "fnd-chain"],
        insight: `<b>Adaptivity + schedule earns its keep.</b> On this run, plain SGD reaches valid loss 0.49 in 60 epochs; Adam with warmup+cosine reaches 0.41 in 30 — fewer epochs AND a better minimum. Plug into the schedule with $\\alpha_{\\max}=3\\!\\times\\!10^{-4}$, $t_{\\text{warm}}=500$, $T=$ 30 epochs: at step 250 (mid-warmup) $\\alpha = 3\\!\\times\\!10^{-4}\\cdot 250/500 = 1.5\\!\\times\\!10^{-4}$; at the halfway point of decay $\\alpha = \\tfrac12(3\\!\\times\\!10^{-4})(1+\\cos\\tfrac{\\pi}{2}) = 1.5\\!\\times\\!10^{-4}$; at the end $\\tfrac12(3\\!\\times\\!10^{-4})(1+\\cos\\pi)=0$. Skipping warmup and starting at the full $3\\!\\times\\!10^{-4}$ spikes the loss in the first 200 steps before settling; the 500-step linear ramp is monotone from the start.`,
        data: {
          caption: "Valid loss by epoch, optimizer + schedule comparison",
          columns: ["epoch", "SGD fixed-lr", "Adam fixed-lr", "Adam warmup+cosine", "lr (cosine)"],
          rows: [
            ["1", "1.95", "1.74", "1.71", "3.0e-4"],
            ["10", "0.88", "0.55", "0.49", "1.8e-4"],
            ["30", "0.61", "0.46", "0.41", "2.0e-5"],
            ["60", "0.49", "0.45", "0.41 (early-stopped)", "—"]
          ],
          note: `Momentum + per-parameter adaptivity reach a lower loss in half the epochs; the schedule's late decay is what locks in the final 0.04.`
        },
        symbols: [
          { sym: "$m_t,\\ v_t$", desc: "Adam's running averages of the gradient and of its square; $m_t$ is the momentum direction, $\\sqrt{v_t}$ the per-parameter scale the step is divided by." },
          { sym: "$\\beta_1,\\ \\beta_2$", desc: "decay rates for those running averages (defaults 0.9, 0.999); closer to 1 means a longer memory of past gradients." },
          { sym: "$\\alpha_t = \\alpha_{\\max}\\,t/t_{\\text{warm}}$", desc: "the warmup rule: at step $t$ the learning rate is a linear fraction of its peak, reaching $\\alpha_{\\max}$ at step $t_{\\text{warm}}$." },
          { sym: "$\\alpha_t = \\tfrac12\\alpha_{\\max}(1+\\cos(\\pi t/T))$", desc: "the cosine-decay rule: $\\alpha$ follows a half-cosine from $\\alpha_{\\max}$ at $t=0$ down to $0$ at $t=T$." },
          { sym: "$\\alpha_{\\max}$", desc: "the peak learning rate reached at the end of warmup and the start of decay (here $3\\times10^{-4}$)." }
        ],
        steps: [
          { type: "decide", prompt: "Which optimizer + schedule for a noisy deep model?",
            options: [
              { label: "Adam with a warmup then cosine-decay learning-rate schedule", best: true, feedback: "design decision: combine adaptivity, momentum, and an annealing schedule. Mechanism: Adam keeps $m_t=\\beta_1 m_{t-1}+(1-\\beta_1)g_t$ and $v_t=\\beta_2 v_{t-1}+(1-\\beta_2)g_t^2$, then steps $\\theta\\leftarrow\\theta-\\alpha\\,m_t/(\\sqrt{v_t}+\\epsilon)$ — dividing each parameter's step by its own gradient magnitude, so steep and flat directions get right-sized moves despite mini-batch noise; momentum averages out that noise; warmup ($\\alpha_t=\\alpha_{\\max}t/t_{\\text{warm}}$) avoids the early-step spike and cosine decay ($\\alpha_t=\\tfrac12\\alpha_{\\max}(1+\\cos\\pi t/T)$) shrinks steps near the minimum, locking in the last fraction of loss. Tradeoff: a few more hyperparameters, but the defaults are robust. Best fit for a noisy deep model." },
              { label: "Vanilla full-batch gradient descent, fixed lr", best: false, feedback: "this is a correct, honest baseline — and that's its only role. It has no momentum, so it stalls in flat regions and zig-zags in ravines; one global fixed rate can't adapt to per-parameter curvature; and full-batch gradients are exact but expensive. The table shows it trailing at 0.49 where Adam hits 0.41. Keep it as a sanity check, not the production optimizer." },
              { label: "Random search over weights", best: false, feedback: "this throws away the single most valuable piece of information you have — the gradient, which tells you which way is downhill. In a space of millions of parameters, random perturbations are astronomically unlikely to improve the loss; the search is essentially blind. Descent works precisely because it uses slope information that random search ignores." }
            ] },
          { type: "run", label: "▶ Trace the lr schedule", result: { log: "alpha_max = 3.0e-4   warmup = 500 steps   decay over T = 30 epochs\nstep 0    (warmup)  alpha = 3.0e-4 * 0/500   = 0.0\nstep 250  (warmup)  alpha = 3.0e-4 * 250/500 = 1.5e-4\nstep 500  (peak)    alpha = 3.0e-4\nmid-decay           alpha = 0.5*3.0e-4*(1+cos(pi/2)) = 1.5e-4\nepoch 30 (end)      alpha = 0.5*3.0e-4*(1+cos(pi))  = 0.0", metrics: [{ k: "peak lr", v: "3.0e-4" }, { k: "warmup", v: "500 steps" }] } }
        ]
      },
      {
        phase: "Batch", icon: "📦", title: "Choose the batch size",
        narrative: `<p>The mini-batch size $B$ trades gradient noise for throughput. A mini-batch gradient is an average over $B$ examples, so its noise shrinks like $1/\\sqrt{B}$: tiny batches give noisy, jittery updates and poor hardware use, while huge batches give smooth gradients and great throughput but cost memory and can land in sharper minima that generalize worse. The craft is to take the largest batch that fits memory and runs efficiently, then scale the learning rate with it so the effective step stays sensible.</p>`,
        concepts: ["dl-minibatch", "ai-sgd", "ml-gradient-descent"],
        insight: `<b>Throughput rises, then generalization breaks.</b> Going bs=32→256 cuts epoch time 88s→19s (4.6× faster) with valid loss essentially unchanged (0.41→0.40). Pushing to bs=4096 is barely faster again (19s→11s) but opens a generalization gap (valid loss 0.47). The sweet spot here is 256 — and the learning rate is scaled $\\sim8\\times$ alongside it (linear scaling rule) so the effective per-example step matches the bs=32 baseline.`,
        data: {
          caption: "Batch-size sweep: throughput vs generalization (lr scaled with $B$)",
          columns: ["batch $B$", "epoch time", "valid loss", "lr (scaled)", "verdict"],
          rows: [
            ["32", "88s", "0.41", "1×", "noisy, slow/epoch"],
            ["256", "19s", "0.40", "8×", "sweet spot"],
            ["4096", "11s", "0.47", "128×", "gen. gap opens"],
            ["full data", "—", "OOM", "—", "won't fit"]
          ],
          note: `Bigger batches average over more examples (noise $\\propto 1/\\sqrt{B}$) and use the accelerator better — until memory or a generalization gap stops you.`
        },
        symbols: [
          { sym: "$B$", desc: "the mini-batch size — number of examples whose gradients are averaged per update step." },
          { sym: "$1/\\sqrt{B}$", desc: "how the standard error of the mini-batch gradient shrinks as $B$ grows; quadrupling $B$ halves the noise." },
          { sym: "$\\alpha$", desc: "the learning rate; the linear scaling rule raises it roughly in proportion to $B$." },
          { sym: "epoch", desc: "one full pass over the training set; larger $B$ means fewer, faster update steps per epoch." }
        ],
        steps: [
          { type: "decide", prompt: "How should you set the batch size?",
            options: [
              { label: "Pick the largest batch that fits memory, then tune lr roughly with it (linear scaling)", best: true, feedback: "design decision: size the batch to the hardware, then keep the effective step constant by scaling $\\alpha$ with $B$. Mechanism: averaging over more examples cuts gradient noise like $1/\\sqrt{B}$ and lets the accelerator run dense, full-occupancy matmuls; raising $\\alpha$ in proportion (linear scaling rule) means each example still contributes the same-sized update, so convergence is preserved. Tradeoff: too large eventually opens a generalization gap, so stop at the largest batch that doesn't hurt valid loss — here 256." },
              { label: "Always use batch size 1", best: false, feedback: "pure online SGD has the maximum possible gradient noise (no averaging), so updates jitter and convergence is erratic. Worse, a batch of 1 leaves the accelerator almost idle — a GPU built for thousands of parallel lanes processes a single example, so you get terrible throughput AND noisy steps at once. The $1/\\sqrt{B}$ table row for small $B$ is exactly this pain." },
              { label: "Use the full dataset every step", best: false, feedback: "full-batch gives the exact gradient, but at scale it simply will not fit in memory (the table's OOM row), and even when it does you lose the mild stochastic regularization that mini-batch noise provides — full-batch tends toward sharper minima. You pay maximum memory for a gradient barely more useful than a large mini-batch's. Mini-batches are the sweet spot between the two extremes." }
            ] },
          { type: "run", label: "▶ Sweep batch sizes", result: { log: "bs=32    epoch time 88s   valid loss 0.41\nbs=256   epoch time 19s   valid loss 0.40\nbs=4096  epoch time 11s   valid loss 0.47  (generalization gap)\nchose bs=256 with lr scaled 8x", metrics: [{ k: "batch", v: "256" }, { k: "epoch time", v: "19s" }] } }
        ]
      },
      {
        phase: "Regularize", icon: "🧪", title: "Fight overfitting",
        narrative: `<p>Training loss keeps dropping but validation loss has started to rise — the classic overfit signature. The widening gap between train and valid loss is variance: the model is memorizing training quirks that don't transfer. The fix is capacity CONTROL, not more capacity — weight decay penalizes large weights to favor smoother functions, dropout randomly zeroes units so no neuron can rely on a fragile co-adaptation, and early stopping halts at the valid-loss minimum before memorization sets in.</p>`,
        concepts: ["ml-regularization", "dl-early-stopping", "ml-bias-variance"],
        insight: `<b>The gap IS the diagnosis.</b> Here train loss is 0.05 but valid loss has climbed to 0.6 — a 0.55 generalization gap screaming variance. Adding weight decay ($\\lambda=10^{-4}$) + dropout (p=0.3) and stopping at the valid minimum lifts train loss to a healthier 0.18 but drops valid loss to 0.32 — you trade a little train fit for a big generalization win. More epochs would only push the valid curve further up.`,
        data: {
          caption: "Train vs valid loss as overfitting sets in (and the fix)",
          columns: ["epoch", "train loss", "valid loss", "gap", "state"],
          rows: [
            ["10", "0.30", "0.34", "0.04", "healthy"],
            ["25", "0.11", "0.42", "0.31", "overfitting"],
            ["40", "0.05", "0.60", "0.55", "memorized ✗"],
            ["with reg.", "0.18", "0.32", "0.14", "fixed ✓"]
          ],
          note: `A small, stable gap is healthy; a gap that widens while valid loss rises is overfit. Regularization shrinks the gap by constraining the model, not by adding capacity.`
        },
        chart: {
          type: "line", title: "Train vs valid loss as capacity is used (overfitting gap)",
          xlabel: "epoch (effective capacity)", ylabel: "loss",
          series: [
            { name: "train loss", color: "#4ea1ff", points: [[10, 0.30], [25, 0.11], [40, 0.05]] },
            { name: "valid loss", color: "#ff7b72", points: [[10, 0.34], [25, 0.42], [40, 0.60]] }
          ]
        },
        symbols: [
          { sym: "gap", desc: "valid loss minus train loss; a widening gap with rising valid loss is the overfitting signature." },
          { sym: "weight decay $\\lambda$", desc: "strength of the penalty on large weights ($L_2$ regularization); larger $\\lambda$ favors smoother, simpler functions." },
          { sym: "dropout $p$", desc: "probability of zeroing each unit during training, preventing fragile co-adaptation between neurons." },
          { sym: "early stopping", desc: "halting training at the epoch where valid loss is minimal, before memorization raises it again." }
        ],
        steps: [{
          type: "decide", prompt: "Train loss is 0.05, valid loss is climbing to 0.6. Best fix?",
          options: [
            { label: "Add weight decay + dropout and enable early stopping on the valid metric", best: true, feedback: "design decision: the train/valid gap of 0.55 is pure variance, so apply capacity control. Mechanism: weight decay penalizes large weights, biasing toward smoother functions that generalize; dropout breaks fragile co-adaptations so the network can't memorize via brittle neuron combos; early stopping freezes the model at the valid-loss minimum, before memorization raises it. Tradeoff: train loss rises slightly (0.05→0.18) but valid loss falls a lot (0.60→0.32) — exactly the trade you want. Closes the gap without shrinking the model." },
            { label: "Train for many more epochs", best: false, feedback: "this makes it strictly worse. Valid loss is ALREADY rising — the model is past its best generalization point and is now memorizing. Every extra epoch deepens that memorization, widening the gap further (the epoch-40 row shows the endpoint). More training is the right move when valid loss is still falling; here it's the exact opposite of the fix." },
            { label: "Remove all regularization to fit harder", best: false, feedback: "the problem is too MUCH variance, and stripping regularization adds more — the model gets even freer to chase training-set noise, so the gap explodes. 'Fit harder' improves the one number (train loss) that's already too good and worsens the one (valid loss) you actually care about. You need to constrain the model, not unleash it." }
          ]
        }]
      },
      {
        phase: "Train", icon: "🔥", title: "Run the real training",
        narrative: `<p>Optimizer, schedule, batch, and regularization are set. Launch the full run and watch the curves converge. A healthy run has three signatures at once: train and valid loss falling together (no widening gap), the learning rate annealing down its schedule, and the gradient norm holding steady in a sane range — not exploding to NaN, not vanishing to zero. When the valid curve plateaus, early stopping ends the run.</p>`,
        concepts: ["ml-gradient-descent", "dl-optimizers", "dl-minibatch"],
        insight: `<b>What a clean convergence looks like.</b> Valid loss falls 1.71→0.32 over 40 epochs while train tracks it closely (gap stays under 0.04 — regularization is holding). The cosine schedule drops $\\alpha$ from $3\\!\\times\\!10^{-4}$ to $2\\!\\times\\!10^{-5}$, and the grad norm stays parked near 2.1 the whole way — the smoking-gun that init, lr, and optimizer are all healthy. Early stopping fires at epoch 40 when valid plateaus.`,
        data: {
          caption: "The training log: three health signals per checkpoint",
          columns: ["epoch", "train loss", "valid loss", "lr", "grad norm"],
          rows: [
            ["1", "1.92", "1.71", "3.0e-4", "2.4"],
            ["10", "0.44", "0.49", "1.8e-4", "2.0"],
            ["30", "0.21", "0.33", "2.0e-5", "2.1"],
            ["40", "0.18", "0.32", "—", "2.1 (early stop)"]
          ],
          note: `Train and valid descend together (gap stable), lr anneals on schedule, grad norm steady ~2.1 — all three green means the run is healthy.`
        },
        symbols: [
          { sym: "train / valid loss", desc: "average loss on the training set and on the held-out validation set; the two curves descending together signals healthy learning." },
          { sym: "$\\alpha$ (lr)", desc: "the learning rate at that checkpoint, annealing down the cosine schedule." },
          { sym: "grad norm", desc: "the gradient vector's length; a steady value (here ~2.1) means stable optimization." },
          { sym: "early stop", desc: "training halts when valid loss stops improving, to avoid overfitting the final epochs." }
        ],
        steps: [
          { type: "run", label: "▶ Train (Adam, cosine decay, bs=256)", result: { log: "epoch 1   train 1.92  valid 1.71  lr 3.0e-4\nepoch 10  train 0.44  valid 0.49  lr 1.8e-4\nepoch 30  train 0.21  valid 0.33  lr 2.0e-5\nepoch 40  train 0.18  valid 0.32  (early stop: valid plateaued)\ngrad norm stable ~2.1", metrics: [{ k: "valid loss", v: "0.32" }, { k: "epochs", v: "40" }, { k: "grad norm", v: "~2.1" }] } }
        ]
      },
      {
        phase: "Tune", icon: "🎛️", title: "Second-order check",
        narrative: `<p>Convergence is slow in a narrow valley of the loss surface. The curvature — captured by the Hessian $H$, the matrix of second derivatives — explains why first-order steps zig-zag. When the valley is far steeper in one direction than another (an ill-conditioned $H$), a single global step size is simultaneously too big for the steep direction (it overshoots and bounces) and too small for the flat one (it crawls). The cure is to scale each direction by its own curvature so the valley looks round again.</p>`,
        concepts: ["la-hessian", "mlx-newton", "fnd-gradient"],
        insight: `<b>Condition number sets the zig-zag.</b> The Hessian's curvature ranges from $\\lambda_{\\max}=400$ (steep) to $\\lambda_{\\min}=0.5$ (flat), a condition number $\\kappa=800$. Plain gradient descent needs $\\sim\\kappa=800$ steps to cross such a valley; a curvature-aware step (Adam's per-dim scaling, or a Newton preconditioner $H^{-1}\\nabla J$) effectively makes $\\kappa\\approx 1$, converging in tens of steps instead of hundreds.`,
        data: {
          caption: "Hessian eigen-spectrum of the loss valley (curvature per direction)",
          columns: ["direction", "curvature $\\lambda$", "GD step that's safe", "behavior under one global lr"],
          rows: [
            ["steepest", "400", "small", "overshoots, bounces"],
            ["mid", "12", "medium", "ok"],
            ["flattest", "0.5", "large", "crawls"],
            ["$\\kappa=\\lambda_{\\max}/\\lambda_{\\min}$", "800", "—", "zig-zag"]
          ],
          note: `One global $\\alpha$ can't serve both ends of an 800:1 curvature ratio. Per-direction scaling (or $H^{-1}$) un-stretches the valley.`
        },
        symbols: [
          { sym: "$H$", desc: "the Hessian — the matrix of second derivatives of $J$; its eigenvalues are the curvatures along each direction." },
          { sym: "$\\lambda_{\\max},\\ \\lambda_{\\min}$", desc: "the largest and smallest curvatures (Hessian eigenvalues); their ratio is the condition number." },
          { sym: "$\\kappa$", desc: "condition number $\\lambda_{\\max}/\\lambda_{\\min}$; large $\\kappa$ means a stretched valley and slow first-order convergence." },
          { sym: "$H^{-1}\\nabla J$", desc: "the Newton step — rescaling the gradient by inverse curvature so all directions converge at once." }
        ],
        steps: [{
          type: "decide", prompt: "The loss valley is ill-conditioned (very different curvature in different directions). What helps?",
          options: [
            { label: "Use curvature-aware steps (Adam's per-dim scaling, or a Newton-like preconditioner)", best: true, feedback: "design decision: attack the geometry by rescaling each direction by its own curvature. Mechanism: dividing the steep direction's step by its large curvature and the flat direction's by its small one effectively sets $\\kappa\\approx 1$ — the stretched valley becomes round, so the step points straight at the minimum instead of ricocheting across the walls. Adam approximates this per-parameter; a Newton preconditioner does it exactly via $H^{-1}$. Tradeoff: curvature estimates cost memory/compute, but it turns hundreds of steps into tens." },
            { label: "Just raise the global learning rate", best: false, feedback: "a single global $\\alpha$ is the very thing that can't handle anisotropic curvature. Raise it and the step that's now barely big enough for the flat direction becomes catastrophic for the steep one — that direction overshoots and diverges. Lower it and the flat direction crawls forever. No single value works across an 800:1 curvature ratio; you need PER-direction scaling." },
            { label: "Switch back to MSE loss", best: false, feedback: "the slowness lives in the SHAPE of the surface (its Hessian), not in which loss function generated it. Swapping cross-entropy for MSE changes the surface entirely — and for classification it's the wrong loss anyway (see the Frame stage) — without addressing the ill-conditioning. Wrong lever; the conditioning problem is geometric." }
          ]
        }]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor the training loop",
        narrative: `<p>Training engines run for days. You need live eyes on gradient health, loss curves, and learning-rate state so a silent divergence doesn't burn a week of compute. The most insidious failure is a vanishing gradient deep in the network: the loss curve goes flat and looks 'converged', but a specific deep block has stopped learning because its gradient norm collapsed toward zero. Only a PER-LAYER grad-norm panel catches this — and a NaN/inf guard that auto-halts saves the compute when the opposite (explosion) strikes.</p>`,
        concepts: ["dl-vanishing-gradient", "ml-cost", "dl-optimizers"],
        insight: `<b>A flat loss can hide a dead layer.</b> Here the overall loss sat flat for 500 steps — looking 'done' — while layer 18's grad norm quietly decayed $2.0\\to0.003$ (a 660× collapse) over 200 steps. That deep block had stopped learning entirely. The per-layer monitor caught it; a single aggregate loss number never would have. The fix sends you back to <b>Init</b> to add a residual/batchnorm path.`,
        data: {
          caption: "Per-layer grad-norm panel (what the monitor surfaces)",
          columns: ["layer", "grad norm @ step 0", "grad norm @ step 200", "trend", "status"],
          rows: [
            ["layer 2", "1.8", "1.9", "stable", "ok"],
            ["layer 10", "1.5", "1.4", "stable", "ok"],
            ["layer 18", "2.0", "0.003", "↓ 660×", "VANISHING ⚠"],
            ["loss (overall)", "0.71", "0.71", "flat", "misleadingly 'done'"]
          ],
          note: `The aggregate loss is flat and looks converged; only the per-layer grad norms reveal layer 18 has died. Watch the signal health, not just the objective.`
        },
        chart: {
          type: "bars", title: "Per-layer grad norm at step 200 (layer 18 vanished)",
          labels: ["layer 2", "layer 10", "layer 18"],
          values: [1.9, 1.4, 0.003],
          valueLabels: ["1.9", "1.4", "0.003"],
          colors: ["#7ee787", "#7ee787", "#ff7b72"]
        },
        symbols: [
          { sym: "grad norm per layer", desc: "the length of the gradient flowing into each layer; a collapse toward 0 means that layer has stopped learning (vanishing gradient)." },
          { sym: "NaN/inf guard", desc: "an auto-halt that stops the run the instant any value overflows, preventing days of wasted compute on a divergent run." },
          { sym: "loss curve", desc: "the objective over time; can plateau even while a sub-block is silently broken — why it's not enough alone." }
        ],
        steps: [
          { type: "decide", prompt: "What should the training dashboard track?",
            options: [
              { label: "Train/valid loss, gradient-norm per layer, learning rate, and NaN/inf guards with auto-halt", best: true, feedback: "design decision: instrument the objective AND the mechanism. Mechanism: train/valid loss tracks progress, but per-LAYER grad norms catch a vanishing or exploding block long before it shows up in the aggregate loss (the table's layer-18 collapse under a flat loss), the lr readout confirms the schedule is firing, and the NaN/inf guard is a kill-switch that halts a divergent run automatically. Tradeoff: a richer dashboard to build, but it turns a silent week-long failure into a step-200 alert." },
              { label: "Only the final accuracy after the run finishes", best: false, feedback: "this is the worst possible monitoring for a multi-day run. If the model diverged or a deep block died on day one, you discover it only after the run finishes — having burned the entire compute budget on a corpse. And a single end-of-run number tells you nothing about WHERE it broke. Live, per-layer signals are the whole reason monitoring exists." }
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
        narrative: `<p>You're building an income classifier on the <b>UCI Adult ("Census Income") dataset</b> (Kohavi, 1996): 48,842 rows drawn from the 1994 US Census, 14 features (age, workclass, education, marital-status, occupation, hours-per-week, capital-gain, …), predicting whether a person earns <b>&gt;\\$50K/year</b>. Only <b>23.9%</b> of rows are positive (&gt;50K), so the classes are imbalanced. You cannot tune toward a metric you haven't chosen, and it must match the cost and the balance — not just be the default. A model that predicts '≤50K' for everyone is 76% accurate and 100% useless. What you actually pay for is captured by precision (of those we flag as high-earners, how many really earn &gt;50K) and recall (of the true high-earners, how many we caught), read at the threshold you'll deploy.</p>`,
        concepts: ["ml-classification-metrics", "ml-roc-auc", "ml-regression-metrics"],
        insight: `<b>Accuracy lies under imbalance.</b> With a 23.9% positive rate, the do-nothing 'predict ≤50K' model scores <b>76.1% accuracy</b> while catching <b>0%</b> of high-earners — precision and recall both 0. A real model at threshold 0.5 might post 73% precision and 60% recall: of every 100 people it flags as &gt;50K, ~73 truly are, and it catches ~60 of every 100 actual high-earners. Those two numbers, not the 76%, are the levers that matter.`,
        data: {
          caption: "Confusion-matrix counts on 9,769 test rows (23.9% earn >50K = 2,335 positives)",
          columns: ["model", "true >50K caught", "false alarms", "accuracy", "precision / recall"],
          rows: [
            ["predict ≤50K", "0", "0", "76.1%", "0 / 0"],
            ["model @ thr 0.5", "1401", "518", "85.0%", "0.73 / 0.60"],
            ["model @ thr 0.7", "934", "187", "83.3%", "0.83 / 0.40"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `The do-nothing model 'wins' on accuracy while catching zero high-earners. Precision and recall expose exactly the errors that matter.`
        },
        symbols: [
          { sym: "precision", desc: "of the people the model flags as >50K, the fraction that truly earn >50K; low precision means many false high-earner labels." },
          { sym: "recall", desc: "of the people who truly earn >50K, the fraction the model catches; low recall means missed high-earners." },
          { sym: "AUC", desc: "area under the ROC curve — the probability the model ranks a random >50K earner above a random ≤50K one, independent of threshold." },
          { sym: "threshold", desc: "the probability cutoff that turns a score into a yes/no decision; trades precision against recall." }
        ],
        steps: [{
          type: "decide", prompt: "Adult-income prediction: 23.9% earn >50K and the classes are imbalanced. Pick a metric.",
          options: [
            { label: "Precision/recall (and AUC) at the operating threshold", best: true, feedback: "design decision: match the metric to both the imbalance and the asymmetric costs. Mechanism: precision is the false-positive rate among flagged high-earners and recall is the caught-high-earner rate; reading them at the deployed threshold quantifies the exact trade at stake, and AUC summarizes ranking quality across thresholds. Tradeoff: you must pick an operating threshold, but that's a feature — it's where you trade the two error costs." },
            { label: "Plain accuracy", best: false, feedback: "under 23.9% imbalance accuracy is misleading: the do-nothing 'predict ≤50K' model already scores 76% (table, row 1) while catching zero high-earners. Accuracy averages over the 76% majority and drowns out performance on the 24% you care about. It hides the very false-negatives and false-positives you pay for." },
            { label: "RMSE", best: false, feedback: "RMSE measures the average squared error of a continuous PREDICTION against a continuous TARGET — it's a regression metric. Income >50K is a binary yes/no label, so there's no real-valued target to take a residual against. Using RMSE here is a category error: wrong metric family for a classification label." }
          ]
        }]
      },
      {
        phase: "Split", icon: "✂️", title: "Build honest splits",
        narrative: `<p>Every reliable number comes from data the model never saw while training. The Adult dataset ships with an official split — 32,561 train rows and 16,281 test rows — but two pitfalls still ruin evaluation if you're careless. First, if the SAME individual appears in both train and test (duplicate or near-duplicate census records), the model memorizes that row rather than generalizing; the Adult set contains a few exact duplicates that must be de-duplicated across the boundary. Second, the split must be STRATIFIED so each fold preserves the ~23.9% &gt;50K rate — a lopsided fold skews every metric. The honest setup de-duplicates, stratifies on the income label, and reserves the official test set untouched.</p>`,
        concepts: ["mlx-cross-validation", "ml-supervised", "mlx-error-analysis"],
        insight: `<b>A careless split inflates the score.</b> If you ignore the duplicate rows and let them straddle train/test, the reported AUC creeps up to 0.91 — illusory, because the model is recognizing memorized rows. De-duplicating and stratifying gives an honest 0.78. The clean split holds the official 16,281-row test set the model never touched, with the &gt;50K rate preserved (23.9% / 23.8% / 24.0%) so the metric isn't skewed by a lopsided fold.`,
        data: {
          caption: "Split designs on Adult Income and the AUC each reports",
          columns: ["split design", "dup leak?", "stratified?", "reported AUC", "honest?"],
          rows: [
            ["ignore dups, unstratified", "yes", "no", "0.91", "no — inflated"],
            ["de-dup only", "no", "no", "0.84", "partial"],
            ["de-dup + stratified", "no", "yes", "0.78", "yes ✓"],
            ["train = test", "yes", "—", "0.999", "no — memorized"]
          ],
          note: `Each leak you remove drops the reported AUC closer to the truth. The honest 0.78 is the number you'll actually see on the held-out census test set.`
        },
        symbols: [
          { sym: "de-duplication", desc: "removing exact/near-duplicate census rows so no individual record appears in both train and test (prevents memorization leakage)." },
          { sym: "official test split", desc: "Adult's provided 16,281-row test set, kept untouched until the final readout." },
          { sym: "leakage", desc: "any way test information reaches the model during training; it inflates the score above what held-out data will deliver." },
          { sym: "class balance", desc: "the >50K positive rate (here ~23.9%) within each fold; preserving it keeps the metric comparable across splits." }
        ],
        steps: [
          { type: "decide", prompt: "You're splitting the Adult census rows. How do you do it honestly?",
            options: [
              { label: "De-duplicate across the boundary and stratify on the income label, keeping the official test set untouched", best: true, feedback: "design decision: remove both leak channels at once. Mechanism: de-duplicating guarantees no individual record straddles train and test, so the score measures generalization to NEW people, not memorization of seen rows; stratifying on >50K means every fold preserves the 23.9% positive rate, so the metric isn't skewed by a lopsided fold. Tradeoff: slightly less data after de-dup and more bookkeeping, but the resulting 0.78 is the number the held-out census test set will reproduce." },
              { label: "Shuffle all rows together and let duplicates fall anywhere", best: false, feedback: "ignoring duplicates leaks: an individual's near-identical record lands in both train and test, so the model recognizes the memorized row, not the pattern. The table shows the result: AUC inflates to 0.91, a number the clean held-out set will never reproduce." },
              { label: "Test on the same data you trained on", best: false, feedback: "this is the extreme leak — the model has already seen every test answer, so the score (0.999 in the table) measures memorization, not generalization. A model can ace its own training rows by rote and fail completely on anything new. An evaluation set the model trained on carries zero information about real-world performance." }
            ] },
          { type: "run", label: "▶ Build train/val/test", result: { log: "Adult Income: 48,842 rows total\nde-duplicated across the train/test boundary\nstratified on income label (>50K)\ntrain 29,305 | val 3,256 | test 16,281 (official)\nclass balance preserved (23.9% / 23.8% / 24.0%)", metrics: [{ k: "train", v: "29.3k" }, { k: "test", v: "16.3k" }, { k: ">50K rate", v: "~23.9%" }] } }
        ]
      },
      {
        phase: "Baseline", icon: "📏", title: "Set a baseline",
        narrative: `<p>A score means nothing without a reference. Fit a simple, honest baseline so every later gain is measured against it. Two references matter: the trivial majority-class predictor (always '≤50K', AUC 0.50 — pure chance ranking) tells you the floor, and a plain L2-regularized logistic regression on the Adult features tells you what an easy, interpretable model already achieves. Any complex model you build later must beat the logistic baseline by enough to justify its cost — and if it beats it by a suspiciously huge margin, that's a leakage red flag, not a triumph.</p>`,
        concepts: ["ml-logistic-regression", "ml-learning-theory", "ml-bias-variance"],
        insight: `<b>Two floors to clear.</b> The majority-class predictor scores AUC 0.50 (it ranks no better than a coin); the L2 logistic regression on the Adult features (14 raw columns, ~108 after one-hot encoding the categoricals) scores 0.78 with precision 0.41 / recall 0.55 at threshold 0.5. From now on, 0.78 is the bar. A later model at 0.85 is a real +0.07 win; a later model at 0.99 is almost certainly leaking (a 0.21 jump over a solid linear baseline doesn't happen honestly).`,
        data: {
          caption: "Baseline scoreboard (every later model is judged against this)",
          columns: ["reference model", "val AUC", "precision@0.5", "recall@0.5", "role"],
          rows: [
            ["majority class (≤50K)", "0.50", "—", "0.00", "chance floor"],
            ["L2 logistic reg (14 feat)", "0.78", "0.41", "0.55", "the bar to beat"],
            ["target: complex model", "0.85?", "?", "?", "must justify cost"],
            ["AUC 0.99", "—", "—", "—", "leakage suspect ⚠"]
          ],
          note: `A locked baseline turns every future number into a delta. Gains are measured against 0.78; an implausible jump signals a leak, not a win.`
        },
        symbols: [
          { sym: "AUC", desc: "area under the ROC curve; 0.50 is chance, 1.0 is perfect ranking of positives above negatives." },
          { sym: "L2 logistic regression", desc: "linear classifier with a weight penalty; a strong, interpretable, low-variance baseline." },
          { sym: "precision@0.5 / recall@0.5", desc: "precision and recall evaluated at the 0.5 probability threshold." },
          { sym: "majority-class baseline", desc: "always predicting the most common label; the trivial floor any real model must clear." }
        ],
        steps: [
          { type: "run", label: "▶ Fit logistic-regression baseline", result: { log: "fitting L2 logistic regression on Adult (14 cols, ~108 one-hot features)...\nval AUC 0.78   precision@0.5 0.41   recall@0.5 0.55\nmajority-class baseline AUC: 0.50\nbaseline locked.", metrics: [{ k: "baseline AUC", v: "0.78" }, { k: "prec@0.5", v: "0.41" }] } }
        ]
      },
      {
        phase: "CV", icon: "🔁", title: "Cross-validate",
        narrative: `<p>A single validation split is noisy — its score depends on the luck of which rows landed in that one fold. K-fold cross-validation partitions the data into K parts, trains on K−1 and tests on the held-out one, rotating so every point is tested exactly once. Building the folds correctly here means GROUPED folds: assign whole users (not rows) to one of K buckets so no person straddles a fold, and stratify so each fold keeps the ~8% positive rate — the same two leak-guards from the Split stage, applied K times. Averaging the K fold-scores gives a more stable estimate (the mean) PLUS a spread (the standard deviation) that tells you whether a 0.005 difference between two models is a real win or just fold-to-fold noise. The error bar is the point.</p>`,
        concepts: ["mlx-cross-validation", "prob-estimation", "prob-variance"],
        insight: `<b>The spread separates signal from noise.</b> Five folds here score AUC 0.781, 0.793, 0.770, 0.788, 0.775 — mean 0.781, std 0.009. A rival config averaging 0.786 is INSIDE that ±0.009 band, so the 0.005 'win' is noise, not a real improvement. A single 80/20 split would have reported just one of those five numbers and given you no way to know.`,
        data: {
          caption: "5-fold CV fold-score table (AUC per held-out fold)",
          columns: ["fold", "train rows", "val rows", "AUC", "note"],
          rows: [
            ["1", "~26k", "~6.5k", "0.781", "—"],
            ["2", "~26k", "~6.5k", "0.793", "best fold"],
            ["3", "~26k", "~6.5k", "0.770", "worst fold"],
            ["mean ± std", "—", "—", "0.781 ± 0.009", "the estimate + error bar"]
          ],
          note: `Each row is held out exactly once. The mean is a stable score; the std tells you which differences between models are real.`
        },
        chart: {
          type: "bars", title: "5-fold CV AUC per held-out fold (mean 0.781)",
          labels: ["fold 1", "fold 2", "fold 3", "fold 4", "fold 5"],
          values: [0.781, 0.793, 0.770, 0.788, 0.775],
          valueLabels: ["0.781", "0.793", "0.770", "0.788", "0.775"],
          colors: ["#4ea1ff", "#7ee787", "#ffb454", "#4ea1ff", "#4ea1ff"]
        },
        symbols: [
          { sym: "K", desc: "the number of folds (here 5); the data is split into K equal parts, each held out once." },
          { sym: "mean AUC", desc: "the average score across folds — a more stable estimate of generalization than any single split." },
          { sym: "std", desc: "standard deviation across folds; the error bar that says whether a difference between models is signal or noise." },
          { sym: "fold", desc: "one of the K held-out partitions used for validation while the other K−1 train the model." }
        ],
        steps: [
          { type: "run", label: "▶ Build the 5 stratified folds", result: { log: "32,561 de-duplicated Adult train rows\nstep 1: stratified k-fold on the >50K label -> 5 buckets\nstep 2: fold sizes ~6,512 rows each; check >50K rate per fold\n  fold1 23.9%  fold2 23.8%  fold3 24.0%  fold4 23.9%  fold5 23.9%  (stratified OK)\nstep 3: round k: train on the other 4 folds (~26k), score on fold k (~6.5k)\nno duplicate straddles folds; each row scored exactly once", metrics: [{ k: "folds", v: "5" }, { k: "rows/fold", v: "~6.5k" }, { k: ">50K rate", v: "~23.9% each" }] } },
          { type: "decide", prompt: "Why use 5-fold CV instead of one 80/20 split?",
            options: [
              { label: "It averages the score over 5 held-out folds, giving a mean and a variance estimate", best: true, feedback: "design decision: trade a little compute (5 fits instead of 1) for a far more trustworthy estimate. Mechanism: rotating the held-out fold so every point is tested exactly once averages away the lucky/unlucky-split noise, and the spread across folds (±0.009 here) becomes an error bar that tells you whether a model-vs-model difference is real or within noise. Tradeoff: 5× the training cost, almost always worth it for the variance estimate alone." },
              { label: "It lets the model see the test set 5 times", best: false, feedback: "this describes leakage, which is the opposite of what CV does. In each of the 5 rounds, that round's validation fold is strictly excluded from the model that scores it — the held-out data is never used to fit the model evaluated on it. If a fold's data DID train its own model, the scores would be inflated and meaningless." },
              { label: "It always raises the accuracy", best: false, feedback: "CV is a measurement protocol, not a training trick — it changes how reliably you ESTIMATE the score, not the model's underlying quality. The true generalization performance is whatever it is; CV just measures it with error bars instead of a single noisy point. Expecting CV to 'raise accuracy' confuses the thermometer with the temperature." }
            ] }
        ]
      },
      {
        phase: "Search", icon: "🔍", title: "Hyperparameter search",
        narrative: `<p>Now tune. Search the hyperparameter space using the CV estimate as the objective — but search efficiently, since each trial costs a full K-fold fit. With ~6 hyperparameters, an exhaustive grid explodes combinatorially and wastes most of its budget on dimensions that don't matter. Random search draws each point independently and uniformly from the ranges, covering the important dimensions far better for the same number of trials. Bayesian search goes further by actually MODELLING the objective: it fits a cheap surrogate (e.g. a Gaussian process) to the trials scored so far, predicting both a mean CV score and an uncertainty at every untried point, then picks the next point that MAXIMIZES an acquisition function — typically Expected Improvement, $\\mathrm{EI}(x)=\\mathbb{E}[\\max(0,\\,f(x)-f^*)]$, which balances exploiting near the current best $f^*$ against exploring where the surrogate is uncertain. Crucially, every trial is scored by NESTED CV: an inner K-fold loop picks each trial's score and an outer fold is held out so the search itself never sees the data it's ultimately judged on — that's what stops the tuning from leaking into the final estimate.</p>`,
        concepts: ["mlx-model-selection", "ml-regularization", "mlx-cross-validation"],
        insight: `<b>Random beats grid at equal budget; Bayesian steers.</b> A grid of just 4 values across 6 hyperparameters is $4^6=4096$ trials; 60 random trials cover the high-impact dimensions better than a coarse grid could. Bayesian search spends those 60 trials smarter: after ~10 random seed trials it fits a surrogate, and each new point is the argmax of Expected Improvement — so it clusters trials around the promising depth-8 / lr-0.03 region instead of wasting them on depth-12 (which the surrogate has already learned overfits). Here trial 41 (depth 8, lr 0.03, l2 2.0) wins at CV AUC 0.857 ± 0.005, beating the 0.78 baseline by +0.077. Note trial 58 (depth 12) scores LOWER at 0.831 with high variance — deeper isn't better; it overfits.`,
        data: {
          caption: "Hyperparameter search trials (CV-scored)",
          columns: ["trial", "depth", "lr", "l2", "CV AUC ± std"],
          rows: [
            ["12", "6", "0.05", "1.0", "0.842 ± 0.006"],
            ["41", "8", "0.03", "2.0", "0.857 ± 0.005 *best"],
            ["58", "12", "0.10", "0.1", "0.831 (overfit)"],
            ["…", "…", "…", "…", "… (60 total)"]
          ],
          note: `Each row is a full 5-fold fit. Random/Bayesian sampling spends the 60-trial budget on the dimensions that move the score; the CV std flags overfit configs like trial 58.`
        },
        chart: {
          type: "line", title: "CV AUC vs model capacity (depth) — peaks then overfits",
          xlabel: "tree depth (capacity)", ylabel: "CV AUC",
          series: [
            { name: "CV AUC", color: "#4ea1ff", points: [[6, 0.842], [8, 0.857], [12, 0.831]] }
          ]
        },
        symbols: [
          { sym: "depth", desc: "max tree depth — a capacity hyperparameter; too large overfits (see trial 58)." },
          { sym: "lr", desc: "the boosting learning rate (shrinkage per tree); smaller is more careful, needs more trees." },
          { sym: "l2", desc: "L2 leaf-weight regularization strength; larger penalizes complex leaves." },
          { sym: "CV AUC ± std", desc: "the cross-validated objective for each trial — the honest score used to rank configs and pick complexity." },
          { sym: "surrogate model", desc: "Bayesian search's cheap stand-in (often a Gaussian process) for the true objective; predicts a mean score and an uncertainty at any untried hyperparameter point." },
          { sym: "$\\mathrm{EI}(x)=\\mathbb{E}[\\max(0,f(x)-f^*)]$", desc: "Expected Improvement — the acquisition function; its argmax is the next point to try, balancing exploiting near the best-so-far $f^*$ against exploring where the surrogate is unsure." },
          { sym: "nested CV", desc: "an inner CV loop tunes/scores each trial while an outer fold is held out from the search entirely, so hyperparameter selection can't leak into the reported estimate." }
        ],
        steps: [
          { type: "decide", prompt: "Boosted-tree model with ~6 hyperparameters. How do you search?",
            options: [
              { label: "Random / Bayesian search over the space, scored by 5-fold CV, with model-selection criteria to pick complexity", best: true, feedback: "design decision: spend a fixed trial budget where it matters and judge each trial honestly. Mechanism: in 6-D, only a few hyperparameters actually move the score; random sampling tries many distinct values along EACH axis (a grid wastes trials repeating the same value of the unimportant ones), and Bayesian search steers toward promising regions using past results. CV scoring (not test) keeps every comparison leak-free. Tradeoff: results are stochastic, but at equal budget this dominates grid search." },
              { label: "Exhaustive grid over every combination", best: false, feedback: "the grid is the trap that looks rigorous. With 6 hyperparameters even 4 values each is $4^6\\approx 4000$ fits, and it spends equal effort on dimensions that don't affect the score — so for any fixed budget it samples far fewer distinct values of the dimensions that DO matter than random search would. Classic result: random search dominates grid at equal cost." },
              { label: "Tune by hand on the test set", best: false, feedback: "this destroys the one number you're protecting. Every time you peek at the test set to choose a hyperparameter, you fit your choices to that specific test sample — leaking it into the model-selection process. After a few rounds the test 'score' reflects your tuning, not generalization, and your final readout is no longer trustworthy. The test set must stay sealed until the very end; tune on CV." }
            ] },
          { type: "run", label: "▶ Run 60 search trials (nested CV)", result: { log: "trials 1-10: random seed points (sample depth/lr/l2 uniformly)\nfit surrogate (GP) on the 10 scores; propose next = argmax Expected Improvement\ntrial 12  depth 6  lr 0.05  l2 1.0   cv AUC 0.842 +/- 0.006\nEI now favors depth~8, lr~0.03 -> propose there\ntrial 41  depth 8  lr 0.03  l2 2.0   cv AUC 0.857 +/- 0.005  *best\ntrial 58  depth 12 lr 0.10 l2 0.1   cv AUC 0.831 (overfit, high variance)\nouter CV fold never seen by the search; selected trial 41", metrics: [{ k: "best cv AUC", v: "0.857" }, { k: "trials", v: "60" }] } }
        ]
      },
      {
        phase: "Leakage", icon: "🕳️", title: "Hunt leakage & overfit",
        narrative: `<p>A suspiciously high score is a red flag, not a victory. Before celebrating, check whether the model is learning the future or just memorizing the train set. The classic culprit is target leakage: a feature that encodes the label or information unavailable at prediction time slips into the matrix. A feature-importance audit usually unmasks it — the leaky column dominates everything else, and it's something you couldn't actually know when the prediction must be made (a value populated only AFTER the outcome).</p>`,
        concepts: ["mlx-error-analysis", "ml-bias-variance", "mlx-cross-validation"],
        insight: `<b>A 0.21 jump over a strong baseline is a leak, not genius.</b> CV AUC of 0.99 against a 0.78 logistic baseline should set off alarms — honest gains over a solid linear model are measured in hundredths, not 0.21. The feature-importance audit here shows an engineered <code>weekly_paycheck</code> column with 71% importance, dwarfing the real census features: it's derived from annual income itself, so it literally encodes the &gt;50K label. Drop it and AUC falls to a believable 0.856.`,
        data: {
          caption: "Feature-importance audit (what a leak looks like)",
          columns: ["feature", "importance", "available at predict time?", "verdict"],
          rows: [
            ["weekly_paycheck (engineered)", "0.71", "no (derived from income)", "LEAK ⚠"],
            ["education-num", "0.08", "yes", "ok"],
            ["hours-per-week", "0.06", "yes", "ok"],
            ["after dropping leak", "—", "—", "AUC 0.99 → 0.856"]
          ],
          note: `One feature owning 71% of importance — and derived from the very label — is the fingerprint of target leakage. Remove it before trusting any number.`
        },
        symbols: [
          { sym: "target leakage", desc: "a feature that encodes the label or future information; it won't exist at real prediction time, so it fakes a high score." },
          { sym: "feature importance", desc: "how much each feature contributes to the model's predictions; a single dominant feature is a leak red flag." },
          { sym: "CV AUC", desc: "the cross-validated AUC; a huge jump over a strong baseline signals leakage rather than skill." }
        ],
        steps: [{
          type: "decide", prompt: "CV AUC is 0.99 but the baseline was 0.78. Most likely?",
          options: [
            { label: "Target leakage — a feature encodes the label or future info; audit and remove it", best: true, feedback: "design decision: treat an implausible gain as a bug to find, not a win to ship. Mechanism: a +0.21 jump over a strong linear baseline is far beyond what honest signal yields, so audit feature importances — a leaky feature (here the engineered weekly_paycheck at 0.71) dominates because it's a near-copy of the label, derived directly from annual income. Removing it drops AUC to a believable 0.856. Tradeoff: none — you lose a fake score and gain a trustworthy model." },
            { label: "The model is just excellent, ship it", best: false, feedback: "this is exactly the mistake the stage exists to prevent. A near-perfect score that leaps 0.21 over a solid baseline is the SIGNATURE of leakage, not breakthrough modeling — real improvements over a strong baseline arrive in small increments. Shipping it means deploying a model that scores 0.99 offline and collapses in production once the leaky feature isn't available. Verify before believing." },
            { label: "CV is broken", best: false, feedback: "CV mechanics almost never manufacture a score this high on their own — the cross-validation protocol just rotates held-out folds, and a bug there would more likely produce a too-LOW or erratic score. The 0.99 is real on this data; the problem is that the data contains a feature that cheats. The leak is in the features, not the protocol — audit importances, don't blame CV." }
          ]
        }]
      },
      {
        phase: "Test", icon: "🔒", title: "Final test-set readout",
        narrative: `<p>The test set is opened exactly once, after all tuning is frozen. This is the single unbiased estimate of how the chosen config will perform — every earlier decision used CV, so the test data is genuinely untouched. The key check: the test score should land WITHIN the CV error bar. If it does, your CV estimate was honest and you can report the number with confidence; if test is far below CV, you over-tuned to the CV folds.</p>`,
        concepts: ["ml-roc-auc", "ml-classification-metrics", "prob-estimation"],
        insight: `<b>Test confirms CV when it lands in the band.</b> The CV estimate was 0.857 ± 0.005; the one-time test readout is 0.851 — comfortably within the error bar, so the estimate held up. At the deployed threshold 0.62 it posts precision 0.71 / recall 0.58, and it beats the 0.78 logistic baseline by +0.07 AUC. That +0.07 is the real, defensible gain the complex model bought.`,
        data: {
          caption: "Frozen-config evaluation: CV estimate vs one-time test",
          columns: ["metric", "CV estimate", "test (held-out)", "baseline", "verdict"],
          rows: [
            ["AUC", "0.857 ± 0.005", "0.851", "0.78", "within band ✓"],
            ["precision @ 0.62", "—", "0.71", "0.41", "+0.30"],
            ["recall @ 0.62", "—", "0.58", "0.55", "+0.03"],
            ["gain over baseline", "—", "+0.07 AUC", "—", "real & defensible"]
          ],
          note: `Test (0.851) sitting inside the CV band (0.857 ± 0.005) means the evaluation was honest. The number you report is the number production should deliver.`
        },
        symbols: [
          { sym: "test AUC", desc: "AUC on the sealed held-out set, opened once after all tuning froze — the unbiased performance estimate." },
          { sym: "within error", desc: "test score falling inside the CV mean ± std band, confirming the CV estimate wasn't over-fit to the folds." },
          { sym: "threshold 0.62", desc: "the chosen operating cutoff where precision/recall are read for deployment." }
        ],
        steps: [
          { type: "run", label: "▶ Evaluate frozen config on test", result: { log: "loading the official held-out test (16,281 rows, untouched)...\ntest AUC 0.851  (cv estimate was 0.857 — within error)\n@ threshold 0.62: precision 0.71  recall 0.58\nbaseline beaten by +0.07 AUC", metrics: [{ k: "test AUC", v: "0.851" }, { k: "precision", v: "0.71" }, { k: "recall", v: "0.58" }], chart: {
            type: "roc", title: "ROC of the final model on held-out test", auc: 0.851,
            points: [[0, 0], [0.03, 0.30], [0.08, 0.50], [0.15, 0.66], [0.28, 0.80], [0.45, 0.90], [0.70, 0.97], [1, 1]]
          } } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor after ship",
        narrative: `<p>Evaluation doesn't end at launch. As real labels arrive, the live metric is the only ground truth — and it drifts as the world changes. The test number was a snapshot of last month's population; once you ship, you must recompute precision/recall/AUC on freshly-labeled data, AND segment by cohort, because an overall metric can hold steady while it quietly rots for one group. A drift alert on either the aggregate or a segment is the trigger to re-run the Search stage on fresh data.</p>`,
        concepts: ["ml-roc-auc", "mlx-error-analysis", "prob-estimation"],
        insight: `<b>The aggregate can hide a rotting cohort.</b> Scored on a fresh census wave, live AUC slipped only modestly overall (0.851 → 0.812) — easy to wave off — but segmenting by occupation reveals the 'self-employed' cohort cratered: precision 0.71 → 0.49. A shift in that population's income distribution moved it away from the training data. The segment view caught what the aggregate buried, and it sends you back to <b>Search</b> to re-tune on recent data.`,
        data: {
          caption: "Live metrics by census cohort (fresh wave vs launch)",
          columns: ["segment", "AUC at launch", "live AUC", "precision shift", "status"],
          rows: [
            ["overall", "0.851", "0.812", "0.71 → 0.64", "drift ⚠"],
            ["salaried (Private)", "0.853", "0.844", "0.72 → 0.70", "ok"],
            ["self-employed", "0.840", "0.690", "0.71 → 0.49", "ROTTING ✗"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `Overall AUC dips a little; the self-employed segment collapses. Segment-level monitoring is what turns a shrug into an actionable alert.`
        },
        symbols: [
          { sym: "live AUC", desc: "AUC recomputed on freshly-labeled production data; the only true measure of current performance." },
          { sym: "segment / cohort", desc: "a subgroup (e.g. self-employed) tracked separately, because an overall metric can mask a failing group." },
          { sym: "drift", desc: "a metric moving away from its launch value as the population shifts; the trigger to retune." }
        ],
        steps: [
          { type: "decide", prompt: "What evaluation should run continuously in production?",
            options: [
              { label: "Recompute precision/recall/AUC on freshly-labeled data, segment by cohort, and alert on metric drift", best: true, feedback: "design decision: monitor the real score, sliced finely enough to catch localized rot. Mechanism: live labels are the only ground truth once the population moves off the test snapshot; segmenting by cohort catches a metric that's fine in aggregate but collapsing for one group (the self-employed row), and drift alerts auto-trigger a retune before the damage compounds. Tradeoff: you need a labeling pipeline and per-segment dashboards, but that's the cost of not flying blind." },
              { label: "Trust the test number forever", best: false, feedback: "the test set froze a single moment of the past; it says nothing about how the population evolves over later census waves. Economic shifts, new occupations, and demographic change all move the distribution out from under the model, and without live evaluation the real score degrades silently — you'd keep quoting 0.851 while a fresh wave has slid to 0.812 (or worse for a cohort). A static number can't track a moving world." }
            ] },
          { type: "run", label: "▶ Check this wave's live metrics", result: { log: "live AUC (fresh census wave): 0.851 -> 0.812  drift ALERT\nsegment 'self-employed': precision 0.71 -> 0.49 (worst hit)\naction: re-run search on recent data, re-validate, re-ship", metrics: [{ k: "live AUC", v: "0.812 ⚠" }, { k: "drift", v: "detected" }] }, note: `The loop closes: drifting live metrics on a cohort send you back to <b>Search</b> to re-tune on fresh data. Evaluation is a habit, not a one-time gate.` }
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
        narrative: `<p>You're rebuilding a <b>MYCIN-style antimicrobial-therapy advisor</b> — modeled on Shortliffe's MYCIN (Stanford, 1976), the landmark expert system that diagnosed bacterial bloodstream/meningitis infections and recommended antibiotics from a base of roughly <b>600 IF-THEN rules</b>. Given facts about a patient and a culture (site, Gram stain, morphology, oxygen requirement), decide which therapy rules fire. Decide first whether this is a learned model or a reasoning problem. Three factors settle it: the rules are already KNOWN (elicited from infectious-disease physicians, not hidden in data), there is LITTLE training data (a few hundred labeled cases), and every recommendation must be AUDITABLE (a clinician demands 'why this antibiotic'). When all three hold, an explicit logic/rule engine beats a learned model — exact, justifiable conclusions instead of an opaque score.</p>`,
        concepts: ["ai-search-problem", "ai-propositional-logic", "ai-csp"],
        insight: `<b>Match the method to the problem shape.</b> A neural net would need thousands of labeled cultures to learn what MYCIN's expert-written rules already state exactly — and it could never emit a rule-by-rule justification a physician will trust. The rule engine derives each recommendation from an explicit chain (R037 → R055 → therapy), so 100% of answers carry an audit trace. With only ~300 historical cases and a hard auditability requirement, logic is the correct frame, not a fallback.`,
        data: {
          caption: "Choosing the method by problem characteristics",
          columns: ["characteristic", "this advisor", "favors rule engine", "favors neural net"],
          rows: [
            ["training data", "~300 cases", "yes (works with few)", "needs 1000s"],
            ["rules known?", "yes, MD-elicited", "yes", "learns implicitly"],
            ["auditable?", "required", "yes (proof trace)", "no (opaque)"],
            ["…", "…", "…", "…"]
          ],
          note: `Every row points the same way: known rules + little data + hard auditability = explicit logic, not a learned model. This is exactly MYCIN's original design rationale.`
        },
        symbols: [
          { sym: "knowledge base (KB)", desc: "the explicit collection of facts and MD-elicited rules the engine reasons over (MYCIN's ~600 rules)." },
          { sym: "rule", desc: "an IF-THEN statement (premises ⇒ conclusion) the engine fires when its premises are satisfied." },
          { sym: "auditable", desc: "every recommendation comes with the chain of rules that produced it, so a clinician can verify the 'why'." }
        ],
        steps: [{
          type: "decide", prompt: "Rules are elicited from physicians and every therapy recommendation must be auditable. Best approach?",
          options: [
            { label: "A logic/rule-based reasoning engine over an explicit knowledge base", best: true, feedback: "design decision: when rules are already known, data is scarce, and auditability is mandatory, encode the rules as logic. Mechanism: the engine derives conclusions by chaining explicit rules, so every answer is exact and comes with a proof trace a clinician can inspect; it needs no large training set because the knowledge is supplied directly. Tradeoff: someone must maintain the rule base by hand, but that's exactly the expert knowledge you already have. Right frame for an auditable advisor — MYCIN's whole point." },
            { label: "A deep neural network trained on a few hundred cases", best: false, feedback: "this fails on both data and explainability. A few hundred cultures is far too little to learn rules a net would otherwise need thousands of examples to induce — it would overfit and generalize poorly. And even if it worked, it outputs an opaque score with no rule-by-rule justification, which is the OPPOSITE of what an auditable therapy advisor requires. You'd be relearning, badly, knowledge you already have written down." },
            { label: "Random guessing weighted by frequency", best: false, feedback: "this throws away the explicit expert knowledge entirely and reasons about nothing — it just samples the base rates. It can't explain a decision, can't respect the actual rules, and will mishandle any case whose correct answer differs from the common one. There's literally nothing to reason with; it's not a method, it's a coin flip." }
          ]
        }]
      },
      {
        phase: "Encode", icon: "📚", title: "Encode the knowledge",
        narrative: `<p>Translate physician statements into formal sentences. This is MYCIN's RULE037 territory — its real organism-identification rule reads: IF the organism is gram-negative AND rod-shaped AND aerobic THEN it is (probably) Enterobacteriaceae. Propositional logic handles fixed yes/no facts (no notion of objects or variables); first-order logic (FOL) adds objects, variables, quantifiers, and relations — so it can say 'for EVERY organism with these properties...'. The choice hinges on whether the rule quantifies over a class of objects. A rule about one fixed proposition is propositional; a rule that ranges over all cultured organisms needs FOL, or you'd write a separate symbol for every individual isolate.</p>`,
        concepts: ["ai-propositional-logic", "aix-fol", "ai-inference-rules"],
        insight: `<b>One FOL rule replaces thousands of propositional ones.</b> MYCIN's RULE037, 'every gram-negative aerobic rod is Enterobacteriaceae', is a single FOL sentence: $\\forall o\\ (Gram(o)=neg \\wedge Morph(o)=rod \\wedge Air(o)=aerobic) \\Rightarrow Entero(o)$. To say the same propositionally you'd need one symbol per isolate — $Entero_{org1}, Entero_{org2}, \\ldots$ — an unbounded base. FOL's $\\forall o$ quantifier captures the whole class in one line, and the relations $Gram(o), Morph(o)$ let the premise depend on each organism's properties.`,
        data: {
          caption: "Encoding MYCIN's RULE037: propositional vs first-order",
          columns: ["statement", "propositional form", "first-order form", "scales?"],
          rows: [
            ["is Enterobacteriaceae", "$Entero_{org1}$ (one per isolate)", "$\\forall o\\,\\ldots\\Rightarrow Entero(o)$", "FOL: yes"],
            ["gram stain = neg", "$GramNeg_{org1}$ (one per isolate)", "$Gram(o)=neg$", "FOL: yes"],
            ["morphology = rod", "$Rod_{org1}$ (one per isolate)", "$Morph(o)=rod$", "FOL: yes"],
            ["# symbols for N isolates", "$3N$", "3 relations + 1 rule", "—"]
          ],
          note: `Propositional logic needs a fresh symbol per isolate ($3N$ total); FOL states the rule once with a quantifier over the variable $o$.`
        },
        symbols: [
          { sym: "$\\forall o$", desc: "the universal quantifier 'for every object $o$'; lets one rule range over all cultured organisms." },
          { sym: "$o$", desc: "a variable standing for any organism isolate the rule applies to." },
          { sym: "$Gram(o),\\ Morph(o)$", desc: "relations/functions reading a property of organism $o$ (its Gram stain, its morphology)." },
          { sym: "$\\Rightarrow$", desc: "logical implication: if the premises on the left hold, the conclusion on the right follows." }
        ],
        steps: [{
          type: "decide", prompt: "MYCIN's RULE037 reads 'every gram-negative aerobic rod is Enterobacteriaceae.' How do you encode it?",
          options: [
            { label: "First-order logic with quantified variables and relations (gramStain, morphology, oxygen)", best: true, feedback: "design decision: the rule quantifies over a class ('every organism such that...'), so reach for FOL. Mechanism: the $\\forall o$ quantifier binds a variable to range over all isolates, and relations like $Gram(o)$ and $Morph(o)$ let the premise test each organism's properties — one sentence covers every isolate past, present, and future. Tradeoff: FOL inference is heavier than propositional, but it's the only form that expresses 'for all objects with these properties' without an unbounded symbol set." },
            { label: "A single propositional symbol $IsEntero$", best: false, feedback: "a flat propositional symbol is a single global yes/no with no notion of WHICH organism — it can't express 'for all isolates satisfying a condition'. To represent the rule propositionally you'd need a distinct symbol for every individual isolate ($3N$ symbols in the table), which doesn't scale and can't handle cultures you haven't seen yet. Propositional logic lacks the quantifiers and objects this rule fundamentally needs." },
            { label: "A floating-point score", best: false, feedback: "this confuses a logical rule with a learned weight. The premise is a crisp, discrete condition — gram-negative AND rod AND aerobic ⇒ Enterobacteriaceae. Encoding it as a continuous weight loses the exact condition, can't be chained by an inference engine, and produces a fuzzy number where the advisor needs a definite identification with a proof. (MYCIN attached a separate certainty factor to the CONCLUSION, but the premise structure stays discrete logic.)" }
          ]
        }]
      },
      {
        phase: "Infer", icon: "⚙️", title: "Choose inference direction",
        narrative: `<p>With facts and rules in the base, you derive conclusions in one of two directions. Forward chaining is DATA-driven and runs to a FIXPOINT: scan every rule, fire each whose premises are all currently in the fact set (assert its conclusion as a new fact), and repeat the whole scan; when a full pass adds nothing new, the fact set has stopped growing — that's the closure. Backward chaining is GOAL-driven: to prove a goal, find every rule whose conclusion UNIFIES with it, and recurse to prove each of that rule's premises as sub-goals; a goal already in the facts succeeds immediately, and the search stops the moment the original goal is proven. For a single targeted query, backward chaining touches a tiny relevant subset; forward chaining computes everything.</p>`,
        concepts: ["ai-inference-rules", "ai-graph-search", "ai-tree-search"],
        insight: `<b>Goal-driven search prunes the work — exactly how MYCIN ran.</b> For the single query 'is organism-1 Enterobacteriaceae?', backward chaining expands only ~6 rules on the proof path (Entero ← GramNeg ∧ Rod ∧ Aerobic ← …) and stops once proved. Forward chaining instead fires all 412 rules to compute the full closure — deriving hundreds of facts about other organism classes, drug sensitivities, and dosing that the one question never asked about. Same answer, ~70× the rule firings. MYCIN was deliberately built backward-chaining for this reason.`,
        data: {
          caption: "Forward vs backward chaining on one query (org-1 Enterobacteriaceae?)",
          columns: ["direction", "starts from", "rules expanded", "facts derived", "fit for 1 query"],
          rows: [
            ["backward", "the goal", "~6 (on proof path)", "only relevant", "yes ✓"],
            ["forward", "all facts", "412 (to closure)", "hundreds (mostly unused)", "wasteful"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `Backward chaining follows only the sub-rules that could prove the goal; forward chaining derives the entire fact closure regardless of the question.`
        },
        chart: {
          type: "bars", title: "Rules expanded for one query: backward vs forward",
          labels: ["backward (goal)", "forward (closure)"],
          values: [6, 412],
          valueLabels: ["6", "412"],
          colors: ["#7ee787", "#ff7b72"]
        },
        symbols: [
          { sym: "forward chaining", desc: "data-driven inference: repeatedly scan rules, assert the conclusion of any whose premises are all facts, and loop until a full pass adds nothing new (the closure)." },
          { sym: "fixpoint", desc: "the state where another forward-chaining pass derives no new facts; reaching it means the closure is complete." },
          { sym: "backward chaining", desc: "goal-driven inference: unify the goal with a rule's conclusion, recurse to prove that rule's premises as sub-goals, and stop once the goal is established." },
          { sym: "closure", desc: "the complete set of facts derivable from the base; what forward chaining computes in full." },
          { sym: "goal", desc: "the specific query to prove (here, whether organism-1 is Enterobacteriaceae)." }
        ],
        steps: [
          { type: "run", label: "▶ Trace backward chaining on org-1", result: { log: "facts: Gram(org1)=neg, Morph(org1)=rod, Air(org1)=aerobic\ngoal:  Entero(org1)?\n  match R037:  GramNeg(o) & Rod(o) & Aerobic(o) => Entero(o)\n  sub-goal GramNeg(org1)?\n    Gram(org1)=neg is a fact           -> GramNeg(org1) PROVEN\n  sub-goal Rod(org1)?\n    Morph(org1)=rod is a fact          -> Rod(org1) PROVEN\n  sub-goal Aerobic(org1)?\n    Air(org1)=aerobic is a fact        -> Aerobic(org1) PROVEN\n  all premises of R037 hold            -> Entero(org1) PROVEN\nproof: R037 ;  ~6 rules touched (vs 412 in forward closure)", metrics: [{ k: "rules touched", v: "~6" }, { k: "result", v: "Entero=yes" }] } },
          { type: "decide", prompt: "You want to answer one specific query: 'is organism-1 Enterobacteriaceae?' Which is more efficient?",
            options: [
              { label: "Backward chaining from the goal, expanding only rules that could prove it", best: true, feedback: "design decision: a single targeted query is a goal-driven search, so chain backward. Mechanism: starting from the goal, the engine finds rules whose conclusion unifies with it (R037 here), then recurses on that rule's premises as sub-goals (GramNeg, Rod, Aerobic), each proven by another rule or by a fact — touching just the ~6 rules on the proof path and stopping the instant the goal is proved. Tradeoff: backward chaining re-derives sub-goals if you ask many different queries, but for one question it's dramatically cheaper than computing the whole closure. (This is exactly how MYCIN reasoned.)" },
              { label: "Forward chaining every rule to exhaustion", best: false, feedback: "forward chaining computes the ENTIRE closure — it scans and fires rules to a fixpoint, deriving every consequence of the facts, the vast majority irrelevant to your one identification question (other organism classes, drug sensitivities, dosing, ...). You get the right answer buried in hundreds of unused derivations. Forward chaining shines when you need MANY conclusions at once; for a single goal it's wasteful." },
              { label: "Guess yes", best: false, feedback: "guessing skips inference entirely and produces no proof trace — which destroys the whole point of an expert system. Even if the guess happened to be right, you couldn't justify it to an auditor, and on the next shipment it'll be wrong. The desk's value is exact, explainable conclusions; a guess delivers neither." }
            ] }
        ]
      },
      {
        phase: "Constraints", icon: "🧮", title: "Model the constraints",
        narrative: `<p>Beyond yes/no rules, the desk must assign trucks to routes under capacity and time-window limits — a constraint-satisfaction problem (CSP). A CSP is defined by three things: variables (each route's assigned truck), domains (which trucks are eligible per route), and constraints (no truck over capacity, no overlapping time windows). Backtracking search assigns one variable at a time and, crucially, propagates constraints to prune values that can no longer work — killing whole branches of the exponential space before exploring them.</p>`,
        concepts: ["ai-csp", "ai-csp-search", "ai-search-problem"],
        insight: `<b>Propagation collapses an exponential space.</b> With 18 routes and 12 trucks, brute force is $12^{18}\\approx 2.7\\!\\times\\!10^{19}$ full assignments — utterly intractable. Backtracking with constraint propagation assigns route-by-route and, each time it picks a truck, removes that truck from any route whose capacity or time window it now blocks; a domain emptying to zero triggers an immediate backtrack. In practice this prunes to a few thousand nodes — solved in milliseconds.`,
        data: {
          caption: "The CSP: variables, domains, constraints",
          columns: ["route (variable)", "domain (eligible trucks)", "after propagation", "binding constraint"],
          rows: [
            ["R1 (8am, 5t)", "{T1,T2,T5,T9}", "{T2,T5}", "capacity ≥ 5t"],
            ["R2 (8am, 2t)", "{T1..T12}", "{T1,T3,T9}", "time-window overlap R1"],
            ["R3 (2pm, 9t)", "{T2,T5}", "{T5}", "capacity ≥ 9t"],
            ["…", "…", "…", "…"]
          ],
          note: `Propagation shrinks each route's domain as trucks get assigned; a domain hitting empty means backtrack. This prunes $12^{18}$ down to thousands of nodes.`
        },
        symbols: [
          { sym: "variable", desc: "an item to assign — here, which truck serves each route." },
          { sym: "domain", desc: "the set of values a variable may take — the trucks eligible for that route." },
          { sym: "constraint", desc: "a rule restricting allowed combinations — capacity limits and non-overlapping time windows." },
          { sym: "backtracking", desc: "assigning variables one at a time and undoing a choice when a constraint makes the rest unsolvable." },
          { sym: "propagation", desc: "after each assignment, pruning now-impossible values from other variables' domains to cut the search early." }
        ],
        steps: [{
          type: "decide", prompt: "How should the truck-to-route assignment be solved?",
          options: [
            { label: "Formulate as a CSP (variables, domains, constraints) and solve with backtracking search", best: true, feedback: "design decision: model it as a CSP and exploit structure. Mechanism: defining variables (routes), domains (eligible trucks), and constraints (capacity, time windows) lets backtracking search assign one route at a time and PROPAGATE — each assignment prunes now-impossible trucks from other routes' domains, so a domain emptying triggers an early backtrack and entire infeasible branches die unexplored. Tradeoff: formulating the constraints takes care, but it turns a $12^{18}$ space into thousands of nodes." },
            { label: "Enumerate every possible full assignment and test each", best: false, feedback: "brute force ignores the structure that makes the problem tractable. The assignment space is exponential ($12^{18}\\approx 2.7\\!\\times\\!10^{19}$ here), and testing complete assignments one-by-one explores astronomically many that a single early constraint check could have killed. Without propagation to prune partial assignments, it's intractable past a handful of trucks — the constraints are exactly the lever brute force throws away." },
            { label: "Assign trucks randomly", best: false, feedback: "random assignment ignores the constraints, which ARE the entire problem — it will overload trucks past capacity and double-book time windows constantly, producing mostly-invalid schedules. You'd then have to check and re-roll endlessly, with no guarantee of ever landing a feasible solution. The point is to satisfy the constraints by construction, not to gamble against them." }
          ]
        }]
      },
      {
        phase: "Conflict", icon: "⚔️", title: "Resolve rule conflicts",
        narrative: `<p>Two rules fire with opposite conclusions: a 'hazmat' rule forbids air transport, an 'express' rule requires it. The engine needs a conflict-resolution policy, because an unresolved contradiction is fatal — in classical logic, from a contradiction you can derive ANYTHING (the principle of explosion), so the KB becomes useless. The right design is an explicit precedence ordering — typically specificity (the more specific rule wins) or a documented priority class (safety beats convenience) — and you LOG every override so the audit trail records which rule was suppressed and why.</p>`,
        concepts: ["ai-inference-rules", "ai-propositional-logic", "aix-fol"],
        insight: `<b>Contradiction is fatal, so precedence must be principled.</b> The hazmat rule (forbid air) and express rule (require air) both fire on shipment #482. With an explicit priority — Safety(10) > Service(3) — the engine deterministically suppresses the express rule, logs 'R-EXPRESS overridden by R-HAZMAT (safety)', and returns a consistent answer. Resolving by file order instead would flip the decision the moment someone reorders the rules file — same facts, different (unexplainable) outcome.`,
        data: {
          caption: "The conflicting rules and how precedence resolves them",
          columns: ["rule", "conclusion on #482", "priority class", "outcome"],
          rows: [
            ["R-HAZMAT", "forbid air", "Safety (10)", "wins, logged"],
            ["R-EXPRESS", "require air", "Service (3)", "suppressed, logged"],
            ["resolve by file order", "depends on edit order", "—", "arbitrary ✗"],
            ["fire both", "air ∧ ¬air", "—", "explosion ✗"]
          ],
          note: `An explicit priority class makes the resolution deterministic AND explainable; file-order or firing-both make it arbitrary or inconsistent.`
        },
        symbols: [
          { sym: "priority / specificity", desc: "an explicit ordering that decides which of two conflicting rules wins (e.g. safety > service, or more-specific > general)." },
          { sym: "override log", desc: "a record of which rule was suppressed and why, preserving the audit trail." },
          { sym: "explosion", desc: "the logical principle that from a contradiction ($p \\wedge \\neg p$) any statement can be 'proved' — why contradictions must be resolved." },
          { sym: "consistency", desc: "the property that the KB contains no contradiction, so its conclusions remain meaningful." }
        ],
        steps: [{
          type: "decide", prompt: "Two fired rules contradict each other. What's the right design?",
          options: [
            { label: "Define explicit priority/specificity ordering so the more specific (safety) rule wins, and log the override", best: true, feedback: "design decision: encode a principled precedence and record every override. Mechanism: assigning rules to priority classes (Safety > Service) makes conflict resolution deterministic and JUSTIFIABLE — the engine always suppresses the lower-priority rule for the same documented reason — while logging the override preserves the audit trail an auditor needs. Tradeoff: someone must design the priority scheme, but that captures real domain judgment (safety genuinely should beat convenience)." },
            { label: "Fire whichever rule was added to the file first", best: false, feedback: "file position is an accident of editing history, not a reasoned priority. Resolving conflicts by it means the SAME facts produce DIFFERENT decisions whenever someone reorders or inserts rules — and there's no principled answer to 'why did hazmat lose?' beyond 'it was typed later'. That's arbitrary and unexplainable, exactly what an auditable desk can't tolerate." },
            { label: "Fire both and return a contradiction", best: false, feedback: "leaving the contradiction unresolved is the worst option: a KB containing $p \\wedge \\neg p$ is inconsistent, and by the principle of explosion it can then 'prove' literally any conclusion — the reasoning becomes meaningless. The engine must pick one rule via a precedence policy; returning both as a contradiction passes a broken, unusable state downstream." }
          ]
        }]
      },
      {
        phase: "Test", icon: "✅", title: "Test entailment",
        narrative: `<p>Verify the engine: feed known cases and confirm the conclusions it derives are exactly those the knowledge base logically entails — no MISSING firings (a rule that should have fired didn't) and no SPURIOUS firings (a rule fired that shouldn't have). The two error types point to different defects: missing conclusions mean a gap in the rule base, while spurious conclusions mean an over-broad rule. Clustering the failures tells you which: if all mismatches share one cause, a single rule edit fixes them all.</p>`,
        concepts: ["ai-inference-rules", "ai-graph-search", "ai-csp-search"],
        insight: `<b>Clustered failures point to one root cause.</b> 114/120 cases match the expert labels; all 6 failures are MISSING conclusions (the engine didn't flag temperature-controlled handling), and every one traces to the same gap — no rule covers 'temperature-controlled' goods. No spurious firings appear, so the existing rules aren't over-broad. One new rule should close all 6 at once; patching them individually would mask the shared gap.`,
        data: {
          caption: "Entailment test results (120 expert-labeled cases)",
          columns: ["case type", "count", "match?", "error type", "root cause"],
          rows: [
            ["standard handling", "114", "yes", "—", "—"],
            ["temp-controlled", "6", "no", "missing firing", "no temp rule"],
            ["spurious firings", "0", "—", "—", "rules not over-broad"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `All 6 failures are the same error type from the same cause — a single missing rule. That's a one-edit fix, not six exceptions.`
        },
        symbols: [
          { sym: "entailment", desc: "the conclusions the KB logically implies from the facts; the test checks the engine derives exactly these." },
          { sym: "missing firing", desc: "a conclusion the KB should entail but the engine failed to derive — signals a gap in the rules." },
          { sym: "spurious firing", desc: "a conclusion the engine derived that the KB shouldn't entail — signals an over-broad rule." },
          { sym: "closure", desc: "the full set of derived facts from forward chaining, compared against the expert labels." }
        ],
        steps: [
          { type: "run", label: "▶ Run the entailment test suite", result: { log: "loaded 120 expert-labeled cases\nforward-chaining closure computed...\n114/120 conclusions match expert labels\n6 mismatches: all trace to one missing rule on 'temperature-controlled' goods\nno spurious firings detected", metrics: [{ k: "match", v: "114/120" }, { k: "missing rules", v: "1" }], chart: {
            type: "bars", title: "Entailment test outcomes (120 cases)",
            labels: ["matched", "missing firing", "spurious firing"],
            values: [114, 6, 0],
            valueLabels: ["114", "6", "0"],
            colors: ["#7ee787", "#ffb454", "#4ea1ff"]
          } } },
          { type: "decide", prompt: "Six cases failed, all from one missing rule. Fix?",
            options: [
              { label: "Add the missing temperature-controlled rule and re-run the suite", best: true, feedback: "design decision: fix the root cause, not the symptoms. Mechanism: all 6 failures are the same missing-firing error from one gap (no temp-controlled rule), so encoding that single general rule closes every one of them AND correctly handles the next temperature-controlled shipment you've never seen. Re-running the suite then confirms no regression. Tradeoff: none — a general rule is both the smaller change and the more correct one." },
              { label: "Hard-code the 6 cases as exceptions", best: false, feedback: "hard-coding patches the 6 failing cases by ID but leaves the actual gap — the missing rule — in place. The next temperature-controlled shipment (a different ID) will fail exactly the same way, because the engine still has no general rule for that class. You'd be accumulating brittle special-cases instead of teaching the KB the real principle. Fix the rule, not the symptoms." }
            ] }
        ]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the engine",
        narrative: `<p>Ship the reasoner as a service the dispatch desk calls. Two things make a rule system deployable: every decision must return its PROOF TRACE (the chain of rules that fired) so a human can audit and debug it, and the knowledge base must be VERSIONED so a bad rule edit can be rolled back instantly. A canary release — routing a small slice of traffic to the new KB first — catches a regression before it hits every query.</p>`,
        concepts: ["ai-search-problem", "ai-inference-rules", "ai-graph-search"],
        insight: `<b>The proof trace IS the product.</b> KB v3 ships 412 rules behind a versioned, canaried deploy: 5% of dispatch queries first, median inference latency 12ms, and an explanation trace attached to 100% of responses. That trace is what lets a dispatcher see 'liftgate required because R12 (heavy) ∧ R31 (residential)' and trust it — versioning means a faulty rule edit rolls back to v2 in one step instead of a hotfix scramble.`,
        data: {
          caption: "Deploy configuration (KB v3 canary)",
          columns: ["property", "value", "why it matters"],
          rows: [
            ["rules in KB", "412", "the full rule base"],
            ["canary traffic", "5% → 100%", "catch regressions early"],
            ["median latency", "12ms", "fast enough for live desk"],
            ["explanation coverage", "100%", "every decision auditable"]
          ],
          note: `Versioned KB + canary + 100% trace coverage are what turn a correct reasoner into a deployable, rollback-able service.`
        },
        symbols: [
          { sym: "proof trace", desc: "the ordered chain of rules that fired to reach a decision; the explanation that makes the answer auditable." },
          { sym: "versioned KB", desc: "the knowledge base tagged by version so a bad edit can be rolled back to a known-good state." },
          { sym: "canary", desc: "releasing the new KB to a small traffic slice (5%) first to detect regressions before full rollout." },
          { sym: "inference latency", desc: "time to compute a decision per query; must stay low for a live dispatch desk." }
        ],
        steps: [
          { type: "decide", prompt: "How should the engine respond to each query in production?",
            options: [
              { label: "Return the decision plus the chain of rules that fired (an explanation), behind a versioned knowledge base", best: true, feedback: "design decision: ship the explanation alongside the answer, behind a rollback-able KB. Mechanism: the proof trace lets a dispatcher (or auditor) see exactly which rules produced the decision and verify it — the core value of a reasoning system over a black box — while versioning means a faulty rule edit reverts to the previous KB in one step. Tradeoff: attaching and storing traces costs a little overhead, trivial against the trust and debuggability gained." },
              { label: "Return only a yes/no with no justification", best: false, feedback: "stripping the justification throws away the single biggest advantage a rule engine has over a learned model. An unexplained yes/no can't be audited by a regulator, can't be debugged when it's wrong, and gives the dispatcher no reason to trust it. You've spent all the effort to build an explainable system and then hidden the explanation — the proof trace is the whole point." }
            ] },
          { type: "run", label: "▶ Deploy KB v3 (canary)", result: { log: "publishing knowledge base v3 (412 rules)...\ncanary 5% of dispatch queries\nmedian inference latency 12ms\nexplanation trace attached to 100% of responses\npromoting to 100%.", metrics: [{ k: "rules", v: "412" }, { k: "latency", v: "12ms" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor coverage",
        narrative: `<p>The world adds new shipment types the rules never anticipated. The key health signal for a rule engine is not CPU — it's COVERAGE: how often a query falls through with no firing rule (the engine has no knowledge for that case) and how often conflicts go unresolved (new contradictions). A rising no-rule-fired rate is the fingerprint of a new case type the KB doesn't yet handle. Pair it with expert spot-checks of explanation traces to catch rules that fire but reason wrongly.</p>`,
        concepts: ["ai-inference-rules", "ai-search-problem", "aix-fol"],
        insight: `<b>A spiking no-rule rate reveals an unmodeled case type.</b> This week's 41,200 queries show no-rule-fired jumping 1.1% → 4.3% — and the uncovered cases cluster on a brand-new category: drone-delivery shipments the KB has never seen. Unresolved conflicts stayed low at 0.2%, so the existing rules aren't newly contradictory; the problem is a coverage GAP. That sends you back to <b>Encode</b> to add drone-delivery rules.`,
        data: {
          caption: "Coverage monitors this week (41,200 queries)",
          columns: ["signal", "baseline", "this week", "what it means"],
          rows: [
            ["no rule fired", "1.1%", "4.3%", "coverage gap ⚠"],
            ["uncovered cluster", "—", "drone-delivery", "new case type"],
            ["unresolved conflicts", "0.2%", "0.2%", "rules consistent"],
            ["…", "…", "…", "…"]
          ],
          note: `A jump in 'no rule fired', clustered on one new category, is the signal the KB needs new knowledge — not a performance problem.`
        },
        chart: {
          type: "bars", title: "Coverage signals: baseline vs this week (percent)",
          labels: ["no rule fired (base)", "no rule fired (now)", "conflicts (base)", "conflicts (now)"],
          values: [1.1, 4.3, 0.2, 0.2],
          valueLabels: ["1.1%", "4.3%", "0.2%", "0.2%"],
          colors: ["#7ee787", "#ff7b72", "#4ea1ff", "#4ea1ff"]
        },
        symbols: [
          { sym: "no-rule-fired rate", desc: "fraction of queries where no rule's premises matched; a rising rate reveals case types the KB doesn't cover." },
          { sym: "unresolved-conflict rate", desc: "fraction of queries where conflicting rules fired without a precedence resolving them; spikes mean new contradictions." },
          { sym: "coverage gap", desc: "a class of cases the rule base has no knowledge for; closed by encoding new rules." }
        ],
        steps: [
          { type: "decide", prompt: "What's the key health signal for a deployed rule engine?",
            options: [
              { label: "Rate of 'no rule fired' / unresolved-conflict cases, plus expert spot-checks of explanations", best: true, feedback: "design decision: monitor the engine's KNOWLEDGE coverage, not just its compute. Mechanism: a query with no matching rule means the KB has a blind spot, and a rising no-rule rate clustered on one category (drone-delivery here) pinpoints exactly which new knowledge to add; a conflict-rate spike flags new contradictions needing precedence; expert spot-checks of traces catch rules that fire but reason wrongly. Tradeoff: needs logging and expert review time, but it's the only way to see the KB going stale." },
              { label: "Only CPU usage", best: false, feedback: "CPU and latency tell you the engine is FAST, not that it's RIGHT. The real failure mode of a deployed rule system is silent: a new shipment type arrives, no rule covers it, and the engine returns nothing useful — all while CPU looks perfectly healthy. Performance metrics completely miss coverage gaps and new contradictions, which are the actual ways a rule base decays." }
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
        narrative: `<p>You're running the <b>ALARM network</b> (Beinlich et al., 1989) — the standard 37-node, 46-edge Bayesian network for monitoring an anesthetized patient in the ICU/OR, with 8 diagnostic root causes (e.g. hypovolemia, kinked tube, pulmonary embolus), 16 measurement nodes, and 13 intermediate nodes. A monitor flags an abnormally low blood-pressure reading. Diagnosis is cause→effect inference reversed: causes are HIDDEN (you can't see hypovolemia directly), but the measurements are OBSERVED (the monitors). You want the posterior $P(\\text{cause}\\mid\\text{readings})$ — the probability of each root cause given the monitor outputs — which Bayes' rule computes from the prior $P(\\text{cause})$ and the likelihood $P(\\text{readings}\\mid\\text{cause})$. Reporting just the most common cause ignores the very evidence in front of you.</p>`,
        concepts: ["prob-bayes", "prob-conditional", "ai-bayes-net"],
        insight: `<b>Evidence flips the ranking.</b> The prior says 'hypovolemia' is a common cause, so a frequency-only system leans that way. But once you observe the readings (low blood pressure, high heart rate, low CVP), Bayes shifts the posterior toward a different cause: $P(\\text{LV failure}\\mid\\text{evidence})=0.68$ vs $P(\\text{hypovolemia}\\mid\\text{evidence})=0.14$. The same evidence that the marginal ignores is exactly what turns a generic guess into a specific diagnosis.`,
        data: {
          caption: "Prior vs posterior once monitor readings are observed (ALARM)",
          columns: ["cause", "prior $P(c)$", "posterior $P(c\\mid e)$", "rank shift"],
          rows: [
            ["hypovolemia", "0.40", "0.14", "1st → 2nd"],
            ["LV failure", "0.25", "0.68", "2nd → 1st"],
            ["anaphylaxis", "0.20", "0.13", "—"],
            ["…", "…", "…", "…"]
          ],
          note: `Ignoring the evidence (using the prior alone) would diagnose 'hypovolemia'. The posterior, conditioned on the readings, correctly elevates 'LV failure'.`
        },
        chart: {
          type: "bars", title: "Prior vs posterior over ALARM causes (after readings)",
          labels: ["hypovolemia (prior)", "hypovolemia (post)", "LV-fail (prior)", "LV-fail (post)", "anaphylaxis (prior)", "anaphylaxis (post)"],
          values: [0.40, 0.14, 0.25, 0.68, 0.20, 0.13],
          valueLabels: ["0.40", "0.14", "0.25", "0.68", "0.20", "0.13"],
          colors: ["#4ea1ff", "#4ea1ff", "#7ee787", "#7ee787", "#ffb454", "#ffb454"]
        },
        symbols: [
          { sym: "$P(\\text{cause}\\mid\\text{evidence})$", desc: "the posterior — probability of a hidden cause given the observed symptoms; the thing to compute." },
          { sym: "$P(\\text{cause})$", desc: "the prior — base-rate probability of each cause before seeing any symptoms." },
          { sym: "$P(\\text{symptoms}\\mid\\text{cause})$", desc: "the likelihood — how probable the observed symptoms are if that cause is true." },
          { sym: "evidence", desc: "the observed sensor readings (symptoms) that condition the posterior." }
        ],
        steps: [{
          type: "decide", prompt: "What quantity does the diagnostic system need to compute?",
          options: [
            { label: "The posterior $P(\\text{cause}\\mid\\text{evidence})$ over hidden causes given observed symptoms", best: true, feedback: "design decision: diagnosis is inverse inference — observed effects to hidden causes — which is exactly a posterior. Mechanism: Bayes' rule combines the prior $P(c)$ with the likelihood $P(e\\mid c)$ to give $P(c\\mid e)$, so the readings reweight the causes (the table's LV failure jumps 0.25→0.68). Tradeoff: you must specify priors and likelihoods, but that's exactly the physiological knowledge you have. This is the correct quantity to compute." },
            { label: "Just the most frequent cause overall", best: false, feedback: "the marginal $P(\\text{cause})$ is the prior — it's the same for every case and ignores the readings entirely. It would diagnose 'hypovolemia' for every patient regardless of what the monitors say, because it never conditions on the evidence. That's not diagnosis, it's quoting a base rate; the whole job is letting THIS patient's readings move the answer." },
            { label: "A point regression of severity", best: false, feedback: "a single severity number is the wrong output type. Diagnosis needs a probability distribution over DISCRETE causes (which condition) with honest uncertainty, so a clinician can triage the top candidates. A scalar severity collapses the multi-cause question into one number and discards both the identity of the cause and the confidence in it." }
          ]
        }]
      },
      {
        phase: "Structure", icon: "🕸️", title: "Build the network structure",
        narrative: `<p>Lay out the ALARM graph: physiological causes point to the measurements they produce, so each arrow follows the real medical mechanism. The structure isn't decoration — a missing edge ASSERTS conditional independence, which is exactly what keeps the model tractable. A node's conditional probability table has one row per combination of its PARENTS' states, so the table size is exponential in the number of incoming edges. Directing edges causally keeps parent-counts small; a fully-connected graph makes every table exponential in all variables.</p>`,
        concepts: ["ai-bayes-net", "prob-independence", "prob-joint-marginal"],
        insight: `<b>Edges you DON'T draw are the savings.</b> ALARM's 37 nodes are multi-valued (2–4 states each); the fully-connected joint would need on the order of $10^{17}$ free parameters. The real sparse causal DAG — 46 edges, where each node has at most 4 parents — needs only <b>509</b> parameters (the published ALARM count). Each absent edge encodes a real independence (the blood-pressure reading is independent of the ventilation alarm given the true blood pressure), which both shrinks the tables and makes them clinically interpretable.`,
        data: {
          caption: "Parameter cost: ALARM's sparse causal DAG vs fully-connected",
          columns: ["structure", "max parents/node", "params per node", "total free params"],
          rows: [
            ["ALARM causal DAG (cause→measure)", "4", "≤ $3^4$", "509"],
            ["fully connected", "36", "astronomical", "~$10^{17}$"],
            ["measurement→cause (reversed)", "many", "bloated, unnatural", "blows up"],
            ["…", "…", "…", "…"]
          ],
          note: `Each missing edge asserts an independence and removes parameters. The causal orientation gives the smallest, most interpretable tables — 509 vs an intractable full joint.`
        },
        symbols: [
          { sym: "DAG", desc: "directed acyclic graph — nodes are variables, edges point from cause to effect, no cycles." },
          { sym: "parents", desc: "the nodes with edges INTO a given node; its conditional table has a row per combination of their states." },
          { sym: "conditional independence", desc: "what a missing edge asserts: two variables are independent given the values of the nodes between them." },
          { sym: "free parameters", desc: "the numbers you must specify to define the network; sparse structure drastically reduces them." }
        ],
        steps: [{
          type: "decide", prompt: "How should you orient the edges?",
          options: [
            { label: "From causes to measurements (cause -> monitor reading), matching the physical mechanism", best: true, feedback: "design decision: align edges with the generative mechanism. Mechanism: a cause directly produces its measurements, so cause→measurement edges give each node few parents (≤4 in ALARM), keeping its conditional table small and its numbers easy to elicit ('given LV failure, P(low blood pressure)?'). The edges you omit assert real independencies that hold the parameter count to ALARM's 509 instead of an intractable full joint. Tradeoff: you must know the causal structure, but that's the physiology clinicians already understand." },
            { label: "Connect every variable to every other variable", best: false, feedback: "a fully-connected graph asserts NO independencies, so every node's table is exponential in all the others (the ~$10^{17}$-parameter row). You'd have to specify astronomically many probabilities, most of them meaningless, and inference would be intractable. The entire power of a Bayesian network comes from the edges you DON'T draw — full connectivity throws that away." },
            { label: "From measurements to causes only", best: false, feedback: "reversing the arrows fights the mechanism. Physically a cause produces measurements, so $P(\\text{measurement}\\mid\\text{cause})$ is natural to specify, but $P(\\text{cause}\\mid\\text{measurements})$ as a stored table requires conditioning each cause on many readings at once — bigger, unnatural tables (the reversed row). You'd also lose the clean independence structure. Let inference compute the cause-given-reading direction; store the network in the causal direction." }
          ]
        }]
      },
      {
        phase: "Priors", icon: "🎲", title: "Set priors & CPTs",
        narrative: `<p>Each ALARM node needs numbers: prior probabilities for the root causes and conditional probability tables (CPTs) giving $P(\\text{measurement}\\mid\\text{parents})$ for every parent combination — 509 parameters in all. You have two knowledge sources — months of monitored OR cases (data) and anesthesiologist estimates (expert priors) — and the right move blends them: estimate cells from logged frequencies where data is plentiful, and fall back to expert priors for the rare cells data can't cover. Smoothing a sparse cell with a prior prevents a count of 0/1 from becoming an overconfident 0% or 100%.</p>`,
        concepts: ["prob-conditional", "prob-total-prob", "ai-bayes-net"],
        insight: `<b>Blend data where you have it, priors where you don't.</b> Of the 509 CPT parameters, the bulk came from 14 months of monitored cases with hundreds of samples each — well-calibrated. But a handful of cells describe rare cause+reading combos with under 5 observations; estimating those from raw counts would give brittle 0% or 100% values, so they're smoothed toward expert priors. Setting everything to uniform instead would erase all the diagnostic signal the case logs contain.`,
        data: {
          caption: "An ALARM CPT for a measurement node: $P(\\text{BP reading}\\mid\\text{true BP})$",
          columns: ["true BP", "LV failure", "$P(\\text{reading}=low)$", "source", "n samples"],
          rows: [
            ["low", "yes", "0.97", "case logs", "612"],
            ["low", "no", "0.88", "case logs", "430"],
            ["normal", "yes", "0.31", "case logs", "210"],
            ["high", "no", "0.04 (smoothed)", "logs+prior", "3 ⚠"]
          ],
          note: `Each row is one parent-combination. Well-sampled rows come straight from logged frequencies; the sparse last row (n=3) is smoothed with an expert prior to avoid a brittle estimate.`
        },
        symbols: [
          { sym: "CPT", desc: "conditional probability table — one probability per combination of a node's parents' states." },
          { sym: "$P(\\text{symptom}\\mid\\text{parents})$", desc: "the likelihood a symptom appears given its parent causes; the entries of each CPT." },
          { sym: "prior", desc: "the base-rate probability of each root cause before any evidence; also used to smooth sparse cells." },
          { sym: "smoothing", desc: "pulling a low-sample estimate toward a prior so a count of 0 or 1 doesn't become a brittle 0% or 100%." }
        ],
        steps: [
          { type: "decide", prompt: "You have plant logs plus engineer estimates. How do you fill the CPTs?",
            options: [
              { label: "Estimate from logged frequencies where data is plentiful, fall back to expert priors where it's sparse", best: true, feedback: "design decision: use each knowledge source where it's strongest. Mechanism: cells with hundreds of logged samples get calibrated frequency estimates straight from the data; rare cells with a handful of observations get smoothed toward expert priors so a 0/3 count doesn't become a brittle, overconfident 0%. Tradeoff: you must decide a sample threshold for 'plentiful', but the blend is strictly better than either source alone — data where it's trustworthy, expertise where it isn't." },
              { label: "Set every probability to 0.5", best: false, feedback: "uniform 0.5 tables encode maximum ignorance — they throw away both the 14 months of logged frequencies AND the engineers' knowledge. The network would then have no diagnostic signal at all: every symptom would be equally likely under every cause, so the posterior could never move off the prior. You'd have built an elaborate graph that computes nothing." },
              { label: "Use only one engineer's guesses, ignoring the logs", best: false, feedback: "discarding the logs wastes your best asset for the COMMON cells — hundreds of real observations that would calibrate those probabilities far better than any single engineer's estimate. Expert priors are valuable precisely where data is thin; using them everywhere, even where you have abundant data, leaves the well-sampled cells less accurate than they should be. Blend, don't pick one." }
            ] },
          { type: "run", label: "▶ Fit CPTs from case logs", result: { log: "ALARM: 37 nodes (8 causes, 16 measurements, 13 intermediate)\ncause priors from 14 months of monitored cases\nCPTs: 509 parameters, sparse cells smoothed with expert priors\nstructure validated: acyclic (46 edges)", metrics: [{ k: "nodes", v: "37" }, { k: "params", v: "509" }] } }
        ]
      },
      {
        phase: "Infer", icon: "⚙️", title: "Run exact inference",
        narrative: `<p>Given observed symptoms, compute the posterior over causes. The brute-force way — enumerate the full joint distribution and sum — costs $2^9=512$ terms here and grows exponentially. Variable elimination instead works with FACTORS (the CPTs and priors, each a small table) and does two operations: it MULTIPLIES the factors that mention a variable, then SUMS OUT that variable (adds up the table over its values), collapsing several factors into one smaller factor. Sum out every variable that is neither the query nor the evidence, one at a time, and what remains — once renormalized to total 1 — is the posterior $P(\\text{cause}\\mid e)$. The elimination order matters: a smart order keeps the intermediate factors small, giving exact posteriors orders of magnitude faster than enumeration.</p>`,
        concepts: ["ai-bayes-inference", "aix-variable-elimination", "prob-total-prob"],
        insight: `<b>Order turns exponential into cheap.</b> Full-joint enumeration touches all $2^9=512$ entries. Variable elimination with a good order sums out the 6 hidden symptom/intermediate nodes through small factors — about 40 multiply-adds total, a ~13× saving — and returns the SAME exact posterior. A bad elimination order can balloon an intermediate factor back toward the full joint, which is why ordering, not just the algorithm, is the craft.`,
        data: {
          caption: "Inference cost: enumeration vs variable elimination",
          columns: ["method", "intermediate work", "exact?", "scales?"],
          rows: [
            ["full-joint enumeration", "$2^9=512$ terms", "yes", "no (exp.)"],
            ["VE, good order", "~40 factor ops", "yes", "yes"],
            ["VE, bad order", "→ near full joint", "yes", "no"],
            ["…", "…", "…", "…"]
          ],
          note: `Variable elimination gives the identical exact answer at a fraction of the cost — when the elimination order keeps intermediate factors small.`
        },
        symbols: [
          { sym: "posterior", desc: "$P(\\text{cause}\\mid\\text{evidence})$ — the target distribution to compute given the observed symptoms." },
          { sym: "variable elimination", desc: "summing out hidden variables one at a time via intermediate factors, avoiding the full joint." },
          { sym: "joint distribution", desc: "$P$ over all variables at once; its size is exponential in the number of variables." },
          { sym: "elimination order", desc: "the sequence in which hidden variables are summed out; a good order keeps intermediate factors small." }
        ],
        steps: [
          { type: "run", label: "▶ Variable-elimination by hand: P(LV-fail | BP=low)", result: { log: "query: LV-failure L,  evidence: BP-reading=low,  hidden: anaphylaxis A\nfactors: prior P(L): [l=1: 0.25, l=0: 0.75]\n         prior P(A): [a=1: 0.20, a=0: 0.80]\n         CPT P(BP=low | L,A):  l1a1 0.97  l1a0 0.88  l0a1 0.31  l0a0 0.04\nstep 1 - multiply the 3 factors, then SUM OUT A (add over a=1,a=0):\n  f(L=1) = P(L=1)[ P(A1)*0.97 + P(A0)*0.88 ] = 0.25*(0.20*0.97 + 0.80*0.88) = 0.25*0.898 = 0.2245\n  f(L=0) = P(L=0)[ P(A1)*0.31 + P(A0)*0.04 ] = 0.75*(0.20*0.31 + 0.80*0.04) = 0.75*0.094 = 0.0705\nstep 2 - normalize (divide by the total = the evidence prob):\n  Z = 0.2245 + 0.0705 = 0.2950\n  P(LV-fail | BP=low) = 0.2245 / 0.2950 = 0.761   P(not) = 0.239\n(other readings in the full net pull this to the reported 0.68)", metrics: [{ k: "P(LV-fail|e)", v: "0.76 (this factor)" }, { k: "ops", v: "~40 vs 512" }] } },
          { type: "decide", prompt: "The network is moderate-sized and you need exact posteriors. Which inference?",
            options: [
              { label: "Variable elimination, marginalizing out unobserved nodes in a good order", best: true, feedback: "design decision: for a moderate network needing exact answers, eliminate hidden variables smartly. Mechanism: VE multiplies the factors mentioning a hidden variable and sums that variable out (as in the run: multiply P(B),P(M),P(vib|B,M) and add over M), collapsing them into one smaller factor; repeat for every non-query, non-evidence node, then normalize — exact, ~40 ops vs the 512 of the full joint. Tradeoff: finding a good elimination order takes thought (a bad order can blow the factors back up), but for a moderate net it's the right exact method." },
            { label: "Enumerate every entry of the full joint distribution", best: false, feedback: "full enumeration is exactly the exponential cost VE exists to avoid. It materializes all $2^9=512$ joint entries (and $2^n$ in general) just to sum most of them away — doing redundant work that VE shares via intermediate factors. For anything beyond a handful of nodes it's intractable; it gives the same answer as VE at far greater cost." },
            { label: "Ignore the readings and report the priors", best: false, feedback: "this skips inference altogether and returns the prior unchanged — defeating the purpose. The whole point of observing readings is to let them shift the posterior away from the base rates (recall the LV failure jumping 0.25→0.68). Reporting priors means the diagnosis is identical for every patient regardless of their monitors. You must condition on the evidence, which is what VE does." }
          ]
        }]
      },
      {
        phase: "Scale", icon: "🌊", title: "Approximate when needed",
        narrative: `<p>You extend the model and exact inference gets too slow on a densely connected sub-graph — variable elimination's intermediate factors blow up when many variables interconnect. Sampling approximates the posterior instead: Gibbs sampling walks through the variables, resampling each one from its Markov blanket (its parents, children, and children's other parents — the only nodes whose values it depends on). Average over many samples and the empirical frequencies converge to the true posterior, trading exactness for tractability.</p>`,
        concepts: ["aix-gibbs-particle", "aix-markov-blanket", "ai-bayes-inference"],
        insight: `<b>Sampling converges to the exact answer as you draw more.</b> On the dense sub-network, exact VE became intractable, so Gibbs sampling draws each node conditioned only on its Markov blanket. With 10k samples the estimated $P(\\text{LV-fail}\\mid e)$ is 0.66 ± 0.04; at 100k it tightens to 0.681 ± 0.012 — closing on the exact 0.68. The error shrinks like $1/\\sqrt{N}$, so you dial accuracy by buying more samples instead of more exact computation.`,
        data: {
          caption: "Gibbs sampling estimate vs draws (target exact = 0.68)",
          columns: ["samples $N$", "estimate", "std error", "vs exact"],
          rows: [
            ["1k", "0.71", "0.13", "rough"],
            ["10k", "0.66", "0.04", "close"],
            ["100k", "0.681", "0.012", "converged"],
            ["exact (VE, if feasible)", "0.680", "0", "—"]
          ],
          note: `More samples shrink the error like $1/\\sqrt{N}$. Sampling buys tractability on dense graphs at the cost of a controllable approximation.`
        },
        symbols: [
          { sym: "Gibbs sampling", desc: "an MCMC method that resamples each variable in turn from its conditional given the others, producing samples from the posterior." },
          { sym: "Markov blanket", desc: "a node's parents, children, and children's co-parents — the only variables needed to resample it." },
          { sym: "$N$", desc: "number of samples drawn; estimate error shrinks like $1/\\sqrt{N}$." },
          { sym: "particle / sample", desc: "one drawn assignment of all variables; averaging many approximates the posterior." }
        ],
        steps: [{
          type: "decide", prompt: "Exact inference is now intractable on a dense sub-network. What do you use?",
          options: [
            { label: "Gibbs / particle sampling, resampling each node from its Markov blanket", best: true, feedback: "design decision: when exact inference blows up, switch to a controllable approximation. Mechanism: Gibbs sampling resamples each variable from its Markov blanket (the only nodes it depends on), and the long-run sample frequencies converge to the true posterior — error shrinking like $1/\\sqrt{N}$, so you trade compute for accuracy on demand. Tradeoff: the answer is approximate and needs enough samples to converge, but it stays tractable where VE cannot." },
            { label: "Round all probabilities to 0 or 1", best: false, feedback: "hard-thresholding to 0/1 destroys the very thing the network exists to represent: uncertainty. A diagnosis of 'definitely LV failure, 100%' when the real posterior is 0.68 misleads the clinician into ignoring the 0.32 chance it's something else. This isn't an approximation of the posterior — it's a deletion of it." },
            { label: "Delete the dense sub-network", best: false, feedback: "removing variables to make inference cheap throws away real diagnostic structure — those interconnected nodes encode genuine cause-symptom relationships. You'd get a fast answer to the WRONG model, diagnosing worse rather than approximately-but-correctly. The goal is to approximate inference on the true network, not to mutilate the network into something trivial." }
          ]
        }]
      },
      {
        phase: "Calibrate", icon: "📊", title: "Evaluate calibration",
        narrative: `<p>A diagnostic probability is only useful if it's HONEST: among the cases the model calls '70% LV failure', about 70% should truly be LV failures. Calibration is checked by binning predictions by confidence and comparing the predicted probability in each bin to the observed fraction that were actually correct. A bin where predicted greatly exceeds observed is OVERCONFIDENT — and accuracy can look fine even while the probabilities lie, because top-1 accuracy only checks the ranking, not the numbers.</p>`,
        concepts: ["ai-bayes-inference", "prob-bayes", "prob-conditional"],
        insight: `<b>Accuracy can hide dishonest probabilities.</b> Top-1 accuracy is a healthy 0.82, but the calibration bins tell a worse story: the 0.6–0.7 bin is honest (predicted 0.65, observed 0.66), while the high-confidence 0.8–0.9 bin says 0.85 but only 0.71 are truly correct — a 0.14 overconfidence gap. A clinician who acts on '85% sure' is being misled. The over-sharpening usually traces to a few sparse CPT cells estimated from too little data.`,
        data: {
          caption: "Calibration report: predicted vs observed by confidence bin",
          columns: ["confidence bin", "predicted", "observed", "n cases", "verdict"],
          rows: [
            ["0.5-0.6", "0.55", "0.57", "180", "good"],
            ["0.6-0.7", "0.65", "0.66", "240", "good"],
            ["0.8-0.9", "0.85", "0.71", "150", "OVERCONFIDENT ⚠"],
            ["…", "…", "…", "…", "…"]
          ],
          note: `Well-calibrated bins sit on the predicted=observed diagonal. The high-confidence bin drifting below it (0.85 vs 0.71) is the model lying about how sure it is.`
        },
        chart: {
          type: "line", title: "Calibration: predicted vs observed by confidence bin",
          xlabel: "predicted probability", ylabel: "observed fraction correct",
          series: [
            { name: "perfect (diagonal)", color: "#c89bff", points: [[0.5, 0.5], [0.9, 0.9]] },
            { name: "model", color: "#ff7b72", points: [[0.55, 0.57], [0.65, 0.66], [0.85, 0.71]] }
          ]
        },
        symbols: [
          { sym: "calibration", desc: "agreement between predicted probability and observed frequency; a calibrated 0.85 means 85% of such cases are truly correct." },
          { sym: "confidence bin", desc: "a band of predictions (e.g. 0.8–0.9) grouped to compare predicted vs observed correctness." },
          { sym: "overconfident", desc: "predicted probability exceeds the observed fraction correct; the model claims more certainty than it has." },
          { sym: "top-1 accuracy", desc: "fraction of cases where the highest-probability cause is the true one; checks ranking, not probability honesty." }
        ],
        steps: [
          { type: "run", label: "▶ Build a calibration report", result: { log: "held-out: 900 diagnosed cases\nbin 0.6-0.7: predicted 0.65, observed 0.66  (good)\nbin 0.8-0.9: predicted 0.85, observed 0.71  (OVERCONFIDENT)\nmost-probable-cause accuracy: 0.82", metrics: [{ k: "top-1 acc", v: "0.82" }, { k: "high-conf bin", v: "0.85 vs 0.71 ⚠" }] } },
          { type: "decide", prompt: "The high-confidence bin is overconfident (says 0.85, real 0.71). Likely fix?",
            options: [
              { label: "Revisit the CPTs feeding that branch — sparse cells likely over-sharpened; re-smooth and re-estimate", best: true, feedback: "design decision: trace the overconfidence to its source in the CPTs. Mechanism: a cell estimated from a handful of samples can land at an extreme like 0.98 by chance, and that over-sharp likelihood propagates into an over-sharp posterior; re-smoothing those sparse cells toward a prior softens the extremes and pulls the high-confidence bin back onto the predicted=observed diagonal. Tradeoff: smoothing slightly blurs well-sampled cells too, so apply it where samples are thin, not everywhere." },
              { label: "Just trust the model — accuracy is fine", best: false, feedback: "this confuses two different things. Top-1 accuracy (0.82) only checks whether the most-probable cause is right — it says nothing about whether '85% sure' means 85%. The calibration report shows it doesn't: only 71% of the high-confidence cases were actually correct. A clinician who trusts that inflated 0.85 acts with false certainty. Honest probabilities matter independently of accuracy, and here they're broken." }
            ] }
        ]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the diagnostician",
        narrative: `<p>Ship the network behind the ICU monitoring console. The output design matters as much as the math: present a RANKED list of causes with their posterior probabilities, plus the evidence that drove each — so a clinician can triage the most-probable cause first AND see why. Hiding the uncertainty (a single cause, no probability) discards the network's main advantage, because the difference between a 95%-sure and a 55%-sure diagnosis completely changes what the clinician should do next.</p>`,
        concepts: ["ai-bayes-net", "ai-bayes-inference", "prob-joint-marginal"],
        insight: `<b>Ranked posteriors plus evidence enable triage.</b> Net v2 returns the top-3 causes with probabilities and an evidence trace, at p99 latency 8ms. On a query it reports LV failure 0.68, hypovolemia 0.14, anaphylaxis 0.13 — the clinician treats the LV failure first but knows it's not certain. In shadow mode it agreed with senior anesthesiologists on 88% of cases. A bare 'LV failure' with no number would hide that 32% chance it's something else.`,
        data: {
          caption: "A deployed ALARM diagnosis response (top-3 + evidence)",
          columns: ["rank", "cause", "posterior", "key evidence"],
          rows: [
            ["1", "LV failure", "0.68", "low BP, high HR, low CVP"],
            ["2", "hypovolemia", "0.14", "low BP"],
            ["3", "anaphylaxis", "0.13", "—"],
            ["meta", "p99 latency", "8ms", "MD agreement 88%"]
          ],
          note: `Ranking lets the clinician triage; the probabilities convey confidence; the evidence makes the reasoning auditable. All three ship together.`
        },
        chart: {
          type: "bars", title: "Deployed diagnosis: ranked posterior over causes",
          labels: ["LV failure", "hypovolemia", "anaphylaxis"],
          values: [0.68, 0.14, 0.13],
          valueLabels: ["0.68", "0.14", "0.13"],
          colors: ["#7ee787", "#ffb454", "#4ea1ff"]
        },
        symbols: [
          { sym: "ranked posteriors", desc: "the candidate causes sorted by $P(\\text{cause}\\mid\\text{evidence})$, so the most likely is checked first." },
          { sym: "evidence trace", desc: "which observed symptoms most drove each cause's probability; makes the diagnosis transparent." },
          { sym: "p99 latency", desc: "the 99th-percentile inference time per query; must stay low for an interactive console." },
          { sym: "shadow agreement", desc: "how often the deployed net matches senior anesthesiologists while running silently alongside them." }
        ],
        steps: [
          { type: "decide", prompt: "How should the deployed system present a diagnosis?",
            options: [
              { label: "A ranked list of causes with posterior probabilities and which evidence drove them", best: true, feedback: "design decision: surface the full posterior, ranked, with its drivers. Mechanism: ranking by probability lets the clinician triage (treat the LV failure first), the probabilities themselves convey confidence (0.68 means investigate-but-not-certain), and the evidence trace makes the reasoning auditable and trustworthy. Tradeoff: a richer UI than a single label, but that richness IS the diagnostic value — it tells the clinician both what and how sure." },
              { label: "A single cause with no probability", best: false, feedback: "collapsing the posterior to one bare cause throws away the network's entire reason for existing: calibrated uncertainty. When the model is only 55% sure, the clinician urgently needs to know that — they'd check a backup hypothesis or gather more data rather than treating the wrong condition. A confident-looking single answer that's actually a coin-flip is more dangerous than an honest ranked list." }
            ] },
          { type: "run", label: "▶ Deploy network v2", result: { log: "publishing ALARM Bayesian net v2 (37 nodes)...\ninference p99: 8ms per query\nreturns top-3 causes + posteriors + evidence trace\nshadow agreement with senior anesthesiologists: 88%\nlive.", metrics: [{ k: "p99", v: "8ms" }, { k: "MD agreement", v: "88%" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor in production",
        narrative: `<p>As equipment ages and lines change, the real cause frequencies drift away from the priors you fit — and a Bayesian network does NOT self-correct, because it only updates within its fixed structure and CPTs. Three signals matter: confirmed-cause frequencies vs the fitted priors (drift means stale tables), ongoing calibration (recurring overconfidence erodes trust), and the rate of 'all causes low-probability' cases (many flat posteriors hint the true cause has no node yet). Each points to a different repair: refit priors, re-smooth CPTs, or add structure.</p>`,
        concepts: ["prob-bayes", "ai-bayes-inference", "prob-total-prob"],
        insight: `<b>Drifting frequencies silently bias every diagnosis.</b> This quarter, confirmed 'hypovolemia' jumped 12% → 27% (a new trauma-surgery caseload presents more bleeding), so the fitted prior is now wrong and quietly under-diagnoses it. Calibration drifted in 2 bins, and 3.5% of cases now return ALL causes below 0.3 — a signature that some new failure mode has no node in the network. That sends you back to <b>Priors</b> to refit and maybe <b>Structure</b> to add a cause.`,
        data: {
          caption: "Production monitors this quarter vs fitted model",
          columns: ["signal", "fitted", "this quarter", "implied repair"],
          rows: [
            ["hypovolemia frequency", "12%", "27%", "refit priors"],
            ["calibration bins off", "0", "2", "re-smooth CPTs"],
            ["all-causes-low cases", "1%", "3.5%", "add a cause node"],
            ["…", "…", "…", "…"]
          ],
          note: `Each drifting signal maps to a specific fix. The network can't notice these itself — its tables are frozen until you refit.`
        },
        symbols: [
          { sym: "confirmed-cause frequency", desc: "the observed rate of each true cause in production; drift from the fitted prior means stale tables." },
          { sym: "calibration drift", desc: "predicted vs observed correctness diverging over time; erodes trust in the probabilities." },
          { sym: "flat posterior", desc: "a diagnosis where every cause is low-probability; many of them hint at a missing cause node." }
        ],
        steps: [
          { type: "decide", prompt: "What should you monitor for a deployed diagnostic network?",
            options: [
              { label: "Confirmed-cause frequencies vs the priors, ongoing calibration, and the rate of 'all causes low-probability' cases", best: true, feedback: "design decision: watch the three signals that each reveal a different kind of staleness. Mechanism: confirmed-cause frequencies drifting from the fitted priors (hypovolemia 12%→27%) means the tables no longer match reality and bias every diagnosis; recurring miscalibration means the probabilities have stopped being honest; and a rising rate of all-low-probability posteriors means a real failure mode has no node yet. Tradeoff: needs confirmed-outcome tracking, but each signal maps to a precise repair." },
              { label: "Nothing — Bayes is self-correcting", best: false, feedback: "this is a dangerous misconception. Bayesian updating only adjusts beliefs WITHIN the fixed structure and CPTs you specified — it does not re-learn the priors or add missing causes on its own. When the world's cause frequencies shift (a new trauma caseload), the frozen priors keep quietly biasing every posterior, and nothing in the math notices. Without external monitoring and periodic refitting, the network goes stale invisibly." }
            ] },
          { type: "run", label: "▶ Check this quarter's monitors", result: { log: "confirmed-cause mix shifted: 'hypovolemia' 12% -> 27% (new trauma caseload)\ncalibration drift in 2 bins\n3.5% of cases: all causes < 0.3 (possible missing cause)\naction: re-fit priors/CPTs, consider adding a cause node", metrics: [{ k: "prior drift", v: "detected ⚠" }, { k: "flat posteriors", v: "3.5%" }] }, note: `The loop closes: drifting cause frequencies and flat posteriors send you back to <b>Priors</b> (and maybe <b>Structure</b>) to refit. A diagnostic net must track a changing world.` }
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
        narrative: `<p>You measured reaction rate versus temperature — the classic <b>Arrhenius kinetics experiment</b> (a setup tabulated in the NIST Chemical Kinetics Database and reproduced in every physical-chemistry lab): rate constants $k$ recorded across a temperature sweep, here 84 measurements from 350–700 K. Theory gives the Arrhenius law, $\\log(\\text{rate}) = a - b/T$, where the slope $b = E_a/R$ encodes the activation energy. The first decision is the FUNCTIONAL FORM, not the fitting method. The mechanistic form has two huge advantages over a generic curve: its parameters $a$ and $b$ are physically meaningful (a log pre-exponential factor and an activation-energy term), and because it embeds the real physics, it extrapolates sensibly outside the measured range. A flexible curve might fit the points better in-sample yet be meaningless and wildly wrong just past the data.</p>`,
        concepts: ["ml-linear-regression", "ml-likelihood", "probx-derived"],
        insight: `<b>In-sample fit hides extrapolation disaster.</b> A 12th-degree polynomial drives training $R^2$ to 0.999 — better than the Arrhenius fit's 0.987 — but its prediction at $T=720$K (just past the data) is off by a factor of $40\\times$ as the polynomial oscillates out of control. The 2-parameter mechanistic law, with its physically-grounded $a,b$, predicts that same point within the measurement noise. Fitting the noise is not the same as learning the physics.`,
        data: {
          caption: "Candidate model forms: in-sample vs extrapolation",
          columns: ["model form", "# params", "train $R^2$", "error at $T=720$K (extrap.)"],
          rows: [
            ["Arrhenius $a-b/T$", "2", "0.987", "within noise ✓"],
            ["12-degree polynomial", "13", "0.999", "40× off ✗"],
            ["connect-the-dots", "= n points", "1.000", "undefined past data ✗"],
            ["…", "…", "…", "…"]
          ],
          note: `Higher in-sample $R^2$ does NOT mean a better model. The mechanistic form's physically-meaningful parameters are what let it extrapolate honestly.`
        },
        symbols: [
          { sym: "$\\log(\\text{rate})=a-b/T$", desc: "the Arrhenius law after a log transform — linear in $1/T$, with physically-meaningful coefficients." },
          { sym: "$a$", desc: "the intercept (log pre-exponential factor); the baseline log-rate as $1/T \\to 0$." },
          { sym: "$b$", desc: "the slope in $1/T$, proportional to the activation energy of the reaction." },
          { sym: "$T$", desc: "the temperature (in K) at which each rate was measured; the predictor variable." },
          { sym: "$R^2$", desc: "fraction of variance explained in-sample; high $R^2$ can still mean terrible extrapolation." }
        ],
        steps: [{
          type: "decide", prompt: "Theory predicts $\\log(\\text{rate}) = a - b/T$. How do you set up the model?",
          options: [
            { label: "Fit the theory-driven form (linear in $1/T$ after the log transform), so parameters $a,b$ are physically meaningful", best: true, feedback: "design decision: let the physics pick the form. Mechanism: after the log transform the Arrhenius law is linear in $1/T$, so a 2-parameter fit recovers $a$ (intercept) and $b$ (activation-energy slope) as interpretable physical constants — and because the form encodes the real mechanism, it extrapolates within noise even past the data (table). Tradeoff: the form is rigid, so it can't absorb genuine deviations from Arrhenius behavior — but if the theory holds, that rigidity is exactly what gives honest extrapolation." },
            { label: "Fit a 12th-degree polynomial in $T$", best: false, feedback: "a 13-parameter polynomial has more than enough flexibility to thread every noisy point, driving in-sample $R^2$ to 0.999 — and that's the trap. Between and beyond the points it oscillates wildly (Runge's phenomenon), so its extrapolation at $T=720$K is 40× off. The coefficients carry no physical meaning, so you can't reason about them. Great in-sample, useless physics." },
            { label: "Connect the dots with straight segments", best: false, feedback: "linear interpolation passes exactly through every measurement — including the noise — so it has no smooth, parameterized law you can reason about or extrapolate from. There's no $a$ or $b$ to interpret, no activation energy to report, and the model is simply undefined past the last data point. You'd have memorized the measurements, not modeled the process." }
          ]
        }]
      },
      {
        phase: "Noise", icon: "🌫️", title: "Model the measurement noise",
        narrative: `<p>Each measurement carries error, and the NOISE MODEL determines the right objective. This is the deep link between statistics and fitting: if you assume the errors are independent and Gaussian (symmetric bell-shaped scatter), then maximizing the likelihood of the data is ALGEBRAICALLY identical to minimizing the sum of squared residuals. The derivation is one line: each point's likelihood is $\\frac{1}{\\sqrt{2\\pi}\\sigma}\\exp\\!\\big(-\\frac{(y_i-\\hat y_i)^2}{2\\sigma^2}\\big)$, so the negative log-likelihood of the whole dataset is $\\sum_i \\frac{(y_i-\\hat y_i)^2}{2\\sigma^2} + \\text{const}$ — and minimizing that over the parameters is exactly minimizing $\\sum_i (y_i-\\hat y_i)^2$. So 'use least-squares' is not an arbitrary choice — it's the maximum-likelihood estimator UNDER the Gaussian assumption. Change the noise model (fat tails, say) and the right loss changes too.</p>`,
        concepts: ["probx-convolution", "prob-uniform-exponential", "ml-likelihood"],
        insight: `<b>The noise assumption picks the loss.</b> Repeated readings of one point scatter symmetrically (e.g. 4.01, 3.98, 4.03, 3.99) — textbook Gaussian — so squared loss is MLE and a handful of normal-sized residuals each contribute fairly. But squared loss weights a residual by its SQUARE: a single 5σ outlier contributes 25× the pull of a 1σ point, so if the tails are actually fat you'd need a robust loss (Huber/SVR) instead. The data's noise shape, not habit, dictates the objective.`,
        data: {
          caption: "Noise model → matching objective",
          columns: ["noise shape", "right objective", "why", "wrong if used elsewhere"],
          rows: [
            ["Gaussian (symmetric)", "sum of squared residuals", "= MLE", "—"],
            ["heavy-tailed / outliers", "robust (Huber/SVR)", "caps outlier pull", "squared lets 1 pt dominate"],
            ["zero noise (assumed)", "exact interpolation", "—", "fits the noise ✗"],
            ["…", "…", "…", "…"]
          ],
          note: `Least-squares is the maximum-likelihood estimator only WHEN the noise is Gaussian. The objective should follow the noise model, not the other way round.`
        },
        symbols: [
          { sym: "residual", desc: "the gap between a measured value and the model's prediction at that point; what the objective penalizes." },
          { sym: "Gaussian noise", desc: "errors drawn from a symmetric bell curve, independent across measurements; the assumption behind least-squares." },
          { sym: "MLE", desc: "maximum-likelihood estimation — choosing parameters that make the observed data most probable under the noise model." },
          { sym: "sum of squared residuals", desc: "$\\sum_i (y_i-\\hat y_i)^2$, the least-squares objective; equals the negative log-likelihood under Gaussian noise." }
        ],
        steps: [{
          type: "decide", prompt: "Repeated readings scatter symmetrically around the true value. What noise model and objective?",
          options: [
            { label: "Independent Gaussian noise -> minimize sum of squared residuals (= MLE)", best: true, feedback: "design decision: read the noise shape, then derive the objective. Mechanism: symmetric, independent scatter is well-described by a Gaussian, and the negative log-likelihood of Gaussian errors is exactly the sum of squared residuals — so least-squares IS maximum likelihood here, not a guess. Tradeoff: it assumes thin tails, so it's the right call precisely because the readings scatter symmetrically without wild outliers. Match the loss to the noise." },
            { label: "Assume zero noise and fit exactly through every point", best: false, feedback: "real measurements always carry error, so a model forced through every point is fitting the NOISE, not the signal. It will report absurdly tight parameter precision (zero residual ⇒ zero apparent uncertainty) that's a complete fiction, and it'll wiggle to chase each random fluctuation. Acknowledging the noise — and modeling it as Gaussian — is what lets least-squares average it out instead of memorizing it." },
            { label: "Heavy outliers but use plain least-squares anyway", best: false, feedback: "this is the right loss for the WRONG noise model. Squared loss penalizes a residual by its square, so under fat tails a few outliers each pull 25× harder than a normal point and yank the whole fit toward themselves. If the scatter genuinely has heavy tails, the Gaussian assumption is violated and you need a robust loss (Huber/SVR) that caps each point's influence — squared loss is only MLE when the tails are thin." }
          ]
        }]
      },
      {
        phase: "Fit", icon: "📈", title: "Fit the parameters",
        narrative: `<p>Estimate $a$ and $b$ by least squares / maximum likelihood. Because $\\log(\\text{rate})=a-b/T$ is LINEAR in its parameters, the fit is closed-form: stack the data into a design matrix $X$ whose rows are $[1,\\,-1/T_i]$ and the targets into $y=\\log(\\text{rate}_i)$, then the minimizer of $\\lVert X\\theta - y\\rVert^2$ is the solution of the NORMAL EQUATIONS $X^\\top X\\,\\theta = X^\\top y$, i.e. $\\theta = (X^\\top X)^{-1}X^\\top y$ with $\\theta=[a,\\,b]$. The fit returns these point estimates AND residuals $r_i = y_i - \\hat y_i$ — and the residuals are where you check the model, not just the numbers. The key diagnostic: residuals should look like unstructured noise with no pattern against $T$. If they curve or fan out, the functional form is wrong (the Arrhenius law doesn't hold) or the noise isn't constant-variance. Unstructured residuals plus a high $R^2$ together say the model captured the signal and left only noise.</p>`,
        concepts: ["ml-linear-regression", "ml-likelihood", "ml-loss"],
        insight: `<b>The residual plot validates the form.</b> The fit gives $a=9.41$, $b=4820$K (a physically plausible activation-energy term), residual std 0.061, and $R^2=0.987$. Crucially the residuals show NO pattern versus $T$ — they're scattered flat around zero. Had they curved (say, systematically positive at high $T$), it would mean the straight-line-in-$1/T$ assumption is broken and Arrhenius doesn't fit, no matter how high $R^2$ looked.`,
        data: {
          caption: "Fit output and residual diagnostics",
          columns: ["quantity", "value", "interpretation"],
          rows: [
            ["$a$ (intercept)", "9.41", "log pre-exponential factor"],
            ["$b$ (slope in $1/T$)", "4820 K", "∝ activation energy"],
            ["residual std", "0.061", "scatter left after fit"],
            ["residual pattern vs $T$", "none", "form is correct ✓"]
          ],
          note: `Point estimates are interpretable physical constants; the flat, patternless residuals confirm the Arrhenius form actually fits.`
        },
        chart: {
          type: "scatter", title: "Residuals vs T (flat, patternless, std 0.061)",
          xlabel: "temperature T (K)",
          groups: [
            { name: "residuals", color: "#4ea1ff", points: [[350, -0.06], [385, 0.05], [410, 0.04], [450, 0.00], [480, -0.07], [510, 0.03], [545, 0.04], [580, -0.05], [610, 0.05], [640, 0.00], [670, -0.06], [700, -0.03]] },
            { name: "zero line", color: "#c89bff", points: [[350, 0], [700, 0]] }
          ]
        },
        symbols: [
          { sym: "$X$", desc: "the design matrix; each row is $[1,\\,-1/T_i]$ so that $X\\theta$ reproduces $a - b/T_i$." },
          { sym: "$\\theta=(X^\\top X)^{-1}X^\\top y$", desc: "the normal-equations solution — the $\\theta=[a,b]$ that minimizes the sum of squared residuals $\\lVert X\\theta-y\\rVert^2$." },
          { sym: "$a,\\ b$", desc: "the fitted Arrhenius coefficients — intercept and the $1/T$ slope (activation-energy term)." },
          { sym: "residual std", desc: "standard deviation of the leftover residuals $r_i=y_i-\\hat y_i$; the noise scale the model couldn't explain." },
          { sym: "$R^2$", desc: "fraction of variance explained; 0.987 means the law captures almost all the structure." },
          { sym: "residual pattern", desc: "any systematic shape in residuals vs $T$; its ABSENCE confirms the functional form is right." }
        ],
        steps: [
          { type: "run", label: "▶ Fit by least squares (normal equations)", result: { log: "n = 84 measurements\nbuild design matrix X: row i = [1, -1/T_i];  target y_i = log(rate_i)\nsolve normal equations  X^T X theta = X^T y\n  X^T X = [[84, -0.1735],[-0.1735, 3.79e-4]]   X^T y = [-30.2, 0.4071]\n  theta = (X^T X)^-1 X^T y = [a, b]\na = 9.41   b = 4820 K\nresidual std: 0.061   R^2 = 0.987\nresiduals look unstructured (no pattern vs T)", metrics: [{ k: "R^2", v: "0.987" }, { k: "b (K)", v: "4820" }, { k: "resid std", v: "0.061" }], chart: {
            type: "scatter", title: "Measured log(rate) vs Arrhenius fit (a=9.41, b=4820K)",
            xlabel: "temperature T (K)",
            groups: [
              { name: "measurements", color: "#4ea1ff", points: [[350, -4.42], [400, -2.59], [450, -1.30], [500, -0.20], [550, 0.69], [600, 1.43], [650, 2.00], [700, 2.49]] },
              { name: "Arrhenius fit", color: "#7ee787", points: [[350, -4.36], [400, -2.64], [450, -1.30], [500, -0.23], [550, 0.65], [600, 1.38], [650, 2.00], [700, 2.52]] }
            ]
          } } }
        ]
      },
      {
        phase: "Uncertainty", icon: "📐", title: "Quantify uncertainty",
        narrative: `<p>A fit without error bars is half an answer — a scientific claim needs to say how sure it is. Two kinds of uncertainty matter: credible intervals on the parameters $a,b$ (how tightly the data constrains them), and predictive bands on the rate (how uncertain a future measurement is). Both fall straight out of the least-squares math: the parameter covariance is $\\mathrm{Cov}(\\hat\\theta)=\\sigma^2(X^\\top X)^{-1}$ (with $\\sigma^2$ the residual variance), whose diagonal square-roots are the $\\pm$ on $a,b$; and at a new input $x_* = [1,\\,-1/T_*]$ the predictive variance is $\\sigma^2\\big(1 + x_*^\\top (X^\\top X)^{-1} x_*\\big)$ — the leading $\\sigma^2$ is the measurement noise, the second term GROWS as $x_*$ moves away from the data's center, which is exactly why the band WIDENS where data is thin. A Bayesian regression or Gaussian process produces the same widening bands probabilistically, so an extrapolated prediction honestly advertises its lower confidence instead of pretending to know.</p>`,
        concepts: ["cls-bayesian-regression", "probx-total-variance", "cls-gaussian-process"],
        insight: `<b>Honest bands widen where you have no data.</b> Bayesian regression returns $a=9.41\\pm0.05$, $b=4820\\pm70$K as credible intervals — tight because 84 points constrain a 2-parameter law well. The predictive band is ±0.12 in the data-rich mid-range but balloons to ±0.41 at $T=720$K where no measurements exist. That widening is the whole point: it tells a reviewer exactly where the law is well-pinned and where it's an educated extrapolation.`,
        data: {
          caption: "Uncertainty report: parameter intervals + predictive bands",
          columns: ["region", "predictive band (±)", "data density", "honest?"],
          rows: [
            ["$T$=350K (data-rich)", "0.09", "dense", "tight, justified"],
            ["$T$=500K (mid)", "0.12", "moderate", "ok"],
            ["$T$=720K (extrapolate)", "0.41", "none", "wide ✓"],
            ["params: $a=9.41\\pm0.05$, $b=4820\\pm70$", "—", "—", "credible intervals"]
          ],
          note: `The band narrows where data is plentiful and widens where it's absent — exactly the behavior point estimates can't express.`
        },
        chart: {
          type: "bars", title: "Predictive band width (±) by region — widens where data is thin",
          labels: ["T=350K (rich)", "T=500K (mid)", "T=720K (extrap.)"],
          values: [0.09, 0.12, 0.41],
          valueLabels: ["0.09", "0.12", "0.41"],
          colors: ["#7ee787", "#ffb454", "#ff7b72"]
        },
        symbols: [
          { sym: "$\\mathrm{Cov}(\\hat\\theta)=\\sigma^2(X^\\top X)^{-1}$", desc: "the covariance of the fitted parameters; its diagonal square-roots give the $\\pm$ on $a$ and $b$." },
          { sym: "$\\sigma^2(1+x_*^\\top(X^\\top X)^{-1}x_*)$", desc: "the predictive variance at a new point $x_*$; the second term grows as $x_*$ leaves the data center, widening the band in extrapolation." },
          { sym: "credible interval", desc: "a Bayesian range (e.g. $a=9.41\\pm0.05$) that the parameter lies in with stated probability." },
          { sym: "predictive band", desc: "the uncertainty range around a predicted rate; widens where data is sparse, per the variance formula above." },
          { sym: "Bayesian regression", desc: "fitting that returns a posterior distribution over parameters, not just point estimates." },
          { sym: "Gaussian process (GP)", desc: "a nonparametric probabilistic model whose predictive variance grows away from observed points." }
        ],
        steps: [{
          type: "decide", prompt: "How do you report uncertainty on the fitted law?",
          options: [
            { label: "Bayesian regression (or GP) giving posterior parameter intervals and predictive bands that widen where data is thin", best: true, feedback: "design decision: report distributions, not just points. Mechanism: a probabilistic fit yields credible intervals on $a,b$ (how tightly the data pins them) and predictive bands that automatically widen where observations are sparse — so an extrapolated rate comes with an honestly larger error bar (±0.41 at 720K vs ±0.09 in the data-rich range). Tradeoff: more machinery than a point fit, but a scientific claim is incomplete without quantified uncertainty." },
            { label: "Report only the point estimates", best: false, feedback: "bare point estimates silently claim infinite precision. A reviewer can't distinguish a parameter the 84 measurements pin to ±0.05 from one that's barely constrained, and an extrapolated prediction looks exactly as confident as an interpolated one — even though it's far shakier. Without error bars the result is unfalsifiable and untrustworthy; the uncertainty IS half the answer." },
            { label: "Quote $R^2$ as the uncertainty", best: false, feedback: "$R^2$ answers a different question entirely. It's an in-sample summary of how much variance the fit explained on the data you have — it says nothing about how tightly $a$ and $b$ are constrained or how uncertain a NEW prediction is, especially in extrapolation. A model can have $R^2=0.99$ and still have wide parameter intervals or huge predictive bands outside the data. Wrong quantity for uncertainty." }
          ]
        }]
      },
      {
        phase: "Robustness", icon: "🛡️", title: "Handle outliers",
        narrative: `<p>A few sensor glitches sit far off the trend. Plain squared loss would let them yank the fit, because it penalizes a residual by its SQUARE — so a point 10× farther off pulls 100× harder. A robust regression (SVR with an ε-insensitive loss, or a Huber loss) caps the influence of large residuals: beyond a threshold the penalty grows linearly, not quadratically, so a handful of glitches can no longer dominate. This keeps the estimate stable WITHOUT hand-deleting data, which would be cherry-picking.</p>`,
        concepts: ["cls-svr", "mlx-lwr", "ml-ica"],
        insight: `<b>Squared loss lets 3 glitches bend the whole curve.</b> Three outliers at ~8σ contribute $\\sim64\\times$ the pull of a normal point under squared loss, dragging the slope $b$ from its true 4820K to a corrupted 5210K (−8% error in the activation energy). Switching to a Huber loss caps each outlier's contribution at the linear regime, recovering $b=4830$K — within noise of the clean fit — while keeping all 84 points in play.`,
        data: {
          caption: "Effect of three 8σ glitches on the fit, by loss",
          columns: ["loss", "outlier pull (rel.)", "fitted $b$", "vs true 4820K"],
          rows: [
            ["squared (least-sq)", "~64×", "5210 K", "−8% ✗"],
            ["Huber / SVR (robust)", "capped (linear)", "4830 K", "within noise ✓"],
            ["delete-then-least-sq", "0 (removed)", "4825 K", "but cherry-picked ✗"],
            ["…", "…", "…", "…"]
          ],
          note: `Robust loss demotes the glitches automatically; squared loss amplifies them; hand-deleting works numerically but is scientifically dishonest.`
        },
        symbols: [
          { sym: "robust regression", desc: "fitting with a loss that caps large-residual influence (Huber, SVR), so outliers don't dominate." },
          { sym: "squared loss", desc: "penalty $\\propto$ residual$^2$; amplifies outliers, since far points contribute disproportionately." },
          { sym: "Huber loss", desc: "quadratic for small residuals, linear beyond a threshold — robust to outliers yet smooth near zero." },
          { sym: "$\\varepsilon$-insensitive loss", desc: "SVR's loss that ignores residuals within a tube of width $\\varepsilon$ and penalizes larger ones linearly." }
        ],
        steps: [{
          type: "decide", prompt: "Three measurements are clearly instrument glitches, far off-trend. Best response?",
          options: [
            { label: "Use a robust regression (e.g. SVR / Huber-style loss) so outliers don't dominate the fit", best: true, feedback: "design decision: change the LOSS so outliers self-demote, rather than touching the data. Mechanism: a robust loss is quadratic near zero but only linear for large residuals, so an 8σ glitch contributes a bounded pull instead of a $64\\times$ one — the slope recovers to 4830K (within noise) while every point stays in the fit. Tradeoff: a robust loss is slightly less efficient if there are NO outliers, a cheap insurance premium against the ones you have." },
            { label: "Keep plain least-squares and ignore them", best: false, feedback: "ignoring them doesn't make them harmless — squared loss squares their large residuals, so the three glitches each pull ~64× as hard as a normal point and drag the slope $b$ to a corrupted 5210K (−8% in the activation energy). 'Ignore' under squared loss actually means 'let them dominate'. You must either cap their influence with a robust loss or model the heavy tail." },
            { label: "Quietly delete any point that hurts $R^2$", best: false, feedback: "deleting points because they lower the score is data dredging: you'd be sculpting the dataset to produce a pretty fit rather than measuring the process honestly. Even if these three are genuine glitches, a blanket 'drop anything that hurts $R^2$' rule will also delete legitimate informative points and manufacture false precision. A robust loss down-weights outliers transparently and defensibly, with no hand-picking." }
          ]
        }]
      },
      {
        phase: "Validate", icon: "🔒", title: "Validate on held-out data",
        narrative: `<p>The real test of a scientific model is prediction on measurements it never saw — ideally at temperatures OUTSIDE the fitted range, the hardest test. Two things must both hold: the held-out RMSE should match the training residual scale (the fit generalizes), AND the coverage should match the nominal level — about 95% of held-out points should land inside the 95% predictive band. If coverage is right, the error bars are honest; a point falling outside isn't failure, it's the band doing its job, especially where the band is wide.</p>`,
        concepts: ["ml-regression-metrics", "cls-bayesian-regression", "cls-gaussian-process"],
        insight: `<b>Honest bands mean ~95% coverage, not 100%.</b> On 20 held-out runs the in-range RMSE is 0.058 — matching the training residual std of 0.061, so the fit generalizes. 19/20 points (95%) fall inside the 95% predictive band: exactly the nominal rate. The one point outside, at $T=720$K, is in the extrapolation zone where the band was widest — and a calibrated 95% band SHOULD miss about 1 in 20. A model that captured all 20 would have dishonestly-wide error bars.`,
        data: {
          caption: "Held-out validation: fit quality + band coverage",
          columns: ["set", "RMSE", "points in 95% band", "verdict"],
          rows: [
            ["in-range (15 runs)", "0.058", "15/15", "matches train ✓"],
            ["extrapolation (5 runs)", "0.11", "4/5", "band wide & honest ✓"],
            ["overall (20 runs)", "—", "19/20 = 95%", "nominal coverage ✓"],
            ["…", "…", "…", "…"]
          ],
          note: `RMSE matching the training scale shows generalization; 95% coverage (not 100%) shows the uncertainty is calibrated, not inflated.`
        },
        symbols: [
          { sym: "RMSE", desc: "root-mean-square error on held-out data; matching the training residual std means the fit generalizes." },
          { sym: "predictive band", desc: "the model's stated uncertainty interval; a 95% band should contain ~95% of new points." },
          { sym: "coverage", desc: "the fraction of held-out points actually inside the band; should match the band's nominal level." },
          { sym: "extrapolation", desc: "predicting at inputs (here $T$) outside the fitted range; the hardest, most honest test." }
        ],
        steps: [
          { type: "run", label: "▶ Predict on held-out runs", result: { log: "held-out: 20 runs, incl. 5 at higher T (extrapolation)\nin-range RMSE 0.058 (matches train)\nextrapolation: 4/5 inside 95% predictive band\none point outside band at T = 720K (band correctly wide there)", metrics: [{ k: "RMSE", v: "0.058" }, { k: "in-band", v: "19/20" }] } },
          { type: "decide", prompt: "Validation looks good and the bands behaved sensibly. What does this confirm?",
            options: [
              { label: "The model generalizes and its uncertainty is honest — including widening correctly in extrapolation", best: true, feedback: "design decision: read BOTH signals together. Mechanism: held-out RMSE (0.058) matching the training residual scale (0.061) shows the fit generalizes rather than having memorized, and 19/20 = 95% coverage matching the band's nominal 95% shows the error bars are calibrated — neither over- nor under-confident — with the one miss landing exactly where the band was honestly widest. Tradeoff: none; this is the textbook outcome of a trustworthy probabilistic fit." },
              { label: "The model is perfect and needs no uncertainty", best: false, feedback: "this misreads the single out-of-band point as a flaw when it's actually proof the uncertainty is honest. A 95% predictive band is SUPPOSED to miss about 1 in 20 points — that's what 95% means. A model that captured all 20 would have error bars inflated past their nominal level, overstating uncertainty. 'Perfect, no uncertainty' is exactly the dishonest-error-bar trap this stage exists to avoid." }
            ] }
        ]
      },
      {
        phase: "Deploy", icon: "🚀", title: "Deploy the model",
        narrative: `<p>Ship the fitted law as a calibration service the lab software calls to convert temperature into a predicted rate. Two safeguards travel with every prediction: the PREDICTIVE INTERVAL (so downstream tools can trust-or-flag a value by its uncertainty), and an EXTRAPOLATION GUARD that warns when the input falls outside the validated 320–700K range. The guard matters because the model can return a confident-looking number far outside where it was checked — the band widens there, but a hard flag makes the risk impossible to miss.</p>`,
        concepts: ["ml-linear-regression", "cls-bayesian-regression", "ml-regression-metrics"],
        insight: `<b>The band plus a guard make a prediction safe to consume.</b> Calibration model v1 serves the predicted rate with a 95% band at 2ms latency, and the out-of-range guard is armed for the validated 320–700K window. A query at 650K returns 'rate=X ± 0.10, OK'; a query at 760K returns 'rate=Y ± 0.55, EXTRAPOLATION — outside validated range'. The downstream tool can then refuse or down-weight the second value instead of trusting it blindly.`,
        data: {
          caption: "Deployed calibration service behavior",
          columns: ["input $T$", "in validated range?", "band (±)", "guard flag"],
          rows: [
            ["350K", "yes", "0.09", "OK"],
            ["650K", "yes", "0.13", "OK"],
            ["760K", "no (>700K)", "0.55", "EXTRAPOLATION ⚠"],
            ["meta: latency 2ms, range 320–700K", "—", "—", "—"]
          ],
          note: `Inside the validated range the band is tight and unflagged; outside it the band widens AND the guard fires — two layers of honesty.`
        },
        symbols: [
          { sym: "predictive interval", desc: "the ± band shipped with each prediction so consumers know its uncertainty." },
          { sym: "extrapolation guard", desc: "a hard flag raised when the input leaves the validated range, regardless of the band." },
          { sym: "validated range", desc: "the input interval (320–700K) where the model was checked against held-out data." },
          { sym: "latency", desc: "time to serve one prediction; must stay low for a live lab calibration call." }
        ],
        steps: [
          { type: "decide", prompt: "How should the deployed model serve predictions?",
            options: [
              { label: "Return the predicted rate with its predictive interval, and flag inputs far outside the fitted range", best: true, feedback: "design decision: ship two safety layers with every value. Mechanism: the predictive interval lets a downstream tool weigh the prediction by its uncertainty (tight inside the data, wide outside), and the extrapolation guard raises a hard flag the instant the input leaves the validated 320–700K range — so a confident-looking out-of-range number can't be consumed silently. Tradeoff: a richer response contract, but it's what makes the model safe to build on." },
              { label: "Return a single number with no caveats", best: false, feedback: "a bare number is a trap precisely where it's most dangerous: far outside the fitted temperature range the law can be wildly wrong, yet a lone scalar looks exactly as authoritative as an in-range value. Without the band, the consumer can't tell a ±0.09 prediction from a ±0.55 one; without the guard, nothing warns that the input left the validated regime. Those two safeguards exist for exactly this failure." }
            ] },
          { type: "run", label: "▶ Deploy calibration model v1", result: { log: "publishing Arrhenius fit v1...\nserves predicted rate + 95% band\nout-of-range guard active (320K-700K validated)\nlatency 2ms\nlive.", metrics: [{ k: "valid range", v: "320-700K" }, { k: "latency", v: "2ms" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor against new data",
        narrative: `<p>New equipment, reagents, or conditions can shift the true relationship — the physical law may be fixed, but the instrument and chemistry around it are not. You watch two signals: the rate of incoming measurements falling OUTSIDE the predictive band (should sit near the nominal 5%; a spike means the model no longer predicts well), and the residual MEAN drifting off zero (a systematic bias creeping in, e.g. a new reagent batch shifting every reading). Either one rising is the trigger to collect fresh data and refit.</p>`,
        concepts: ["ml-regression-metrics", "probx-total-variance", "cls-gaussian-process"],
        insight: `<b>Out-of-band rate and residual drift both flag staleness.</b> Over the last 200 measurements the out-of-band rate held at the expected 5% in the mid-range but jumped to 18% above 600K — the high-temperature regime has shifted. Simultaneously the residual mean drifted to +0.04 (it should sit at 0), traced to a new reagent batch biasing every reading upward. Both signals point the same way: collect fresh high-$T$ data and refit. That sends you back to <b>Fit</b>.`,
        data: {
          caption: "Production monitors vs expected (last 200 measurements)",
          columns: ["signal", "expected", "observed", "implication"],
          rows: [
            ["out-of-band rate (mid-$T$)", "~5%", "5%", "stable"],
            ["out-of-band rate (>600K)", "~5%", "18%", "regime shifted ⚠"],
            ["residual mean", "0.00", "+0.04", "new reagent bias"],
            ["…", "…", "…", "…"]
          ],
          note: `A localized out-of-band spike plus a nonzero residual mean together say the world moved out from under the fit — time to refit.`
        },
        symbols: [
          { sym: "out-of-band rate", desc: "fraction of new measurements falling outside the predictive band; should stay near the nominal 5%." },
          { sym: "residual mean", desc: "the average residual of new data; should be 0, so a nonzero value signals systematic bias." },
          { sym: "drift", desc: "a slow change in the measured relationship as instruments, reagents, or conditions shift." },
          { sym: "refit", desc: "re-estimating the model on fresh data once monitoring shows the old fit has gone stale." }
        ],
        steps: [
          { type: "decide", prompt: "What should you watch once the model is in use?",
            options: [
              { label: "Rate of new measurements falling outside the predictive band, and residual mean drift over time", best: true, feedback: "design decision: monitor both a spread signal and a bias signal. Mechanism: the out-of-band rate should hover near the nominal 5%, so a localized spike (18% above 600K) pinpoints a regime where the model has stopped predicting well; the residual mean should be 0, so a drift to +0.04 reveals a systematic bias (a new reagent batch). Together they distinguish 'wider scatter' from 'shifted center' and trigger a targeted refit. Tradeoff: needs ongoing labeled measurements, the cost of not going stale silently." },
              { label: "Nothing — physical laws don't change", best: false, feedback: "the LAW may be constant, but everything you measure it WITH is not — instrument calibration drifts, reagent batches change, ambient conditions move. The monitors caught exactly this: a +0.04 residual bias from a new reagent and an 18% out-of-band rate at high $T$. An unmonitored fit keeps serving confident predictions while reality slides out from under it; 'laws don't change' is true and irrelevant to whether the model stays valid." }
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
        narrative: `<p>You're computing the <b>eigen-digits of MNIST</b> (LeCun et al., 1998): the 70,000 handwritten-digit images, each a 28×28 grayscale grid flattened to a 784-pixel vector, stacked into a $70{,}000 \\times 784$ data matrix $X$. You want to compress those 784 pixels to a handful of directions that capture most of the variance. PCA looks for an ORTHONORMAL basis of pixel-space directions, ordered so the first captures the most variance, the second the most of what remains, and so on — these are the top eigenvectors of the covariance matrix (the "eigenfaces"-style principal components of the digit images). Keep the leading few and you summarize each 784-pixel image with a handful of coordinates, losing almost no variance.</p>`,
        concepts: ["fnd-matrix", "fnd-vector", "ml-pca"],
        insight: `<b>A few directions hold most of the variance.</b> The 784 pixels aren't independent — neighboring pixels are strongly correlated and the digit strokes live on a low-dimensional manifold, so the variance concentrates. PCA finds it: on MNIST the top 12 of 784 eigen-directions already capture <b>90%</b> of total variance, the top 28 capture <b>95%</b>. Picking the largest-magnitude rows or a random projection would both miss this concentrated structure; PCA targets it exactly by ranking directions by their eigenvalue (the variance along them).`,
        data: {
          caption: "Variance concentrated in few directions (of 784 MNIST pixels)",
          columns: ["# directions kept", "cumulative variance", "compression", "fit for goal"],
          rows: [
            ["1", "10%", "784:1", "too lossy"],
            ["12", "90%", "~65:1", "good"],
            ["28", "95%", "~28:1", "high-fidelity"],
            ["784 (all)", "100%", "1:1 (no reduction)", "pointless"]
          ],
          note: `Because the pixels are correlated, variance piles into the leading directions — exactly the structure PCA's eigen-ranking exploits.`
        },
        symbols: [
          { sym: "$X$", desc: "the MNIST data matrix, 70,000 rows (images) by 784 columns (pixels)." },
          { sym: "variance", desc: "spread of the images along a pixel-space direction; PCA orders directions by how much of it they capture." },
          { sym: "eigenvector", desc: "a principal direction — an 'eigen-digit' axis of the orthonormal basis PCA finds." },
          { sym: "orthonormal basis", desc: "a set of mutually perpendicular unit-length directions; PCA's components form one, ranked by variance." }
        ],
        steps: [{
          type: "decide", prompt: "What is PCA looking for in this matrix?",
          options: [
            { label: "The orthogonal directions of maximum variance — the top eigenvectors of the covariance matrix", best: true, feedback: "design decision: define PCA by what it optimizes — variance captured. Mechanism: it finds an orthonormal basis where each successive direction (eigenvector of the covariance) captures the most remaining variance, so the leading few summarize correlated 784-pixel images in a handful of coordinates (top 12 → 90%). Tradeoff: it's a linear method, so it can't capture curved structure — but for variance-based compression it's exactly right." },
            { label: "The rows with the largest values", best: false, feedback: "this confuses rows (images) with directions (pixels). PCA operates in PIXEL space, finding axes along which the whole dataset varies — it never picks individual images, and the magnitude of a single entry says nothing about the variance structure across the data. Selecting big-valued rows would just grab a few images, not compress the 784 pixels." },
            { label: "A random low-dimensional projection", best: false, feedback: "a random projection ignores WHERE the variance lives — it would throw away high-variance directions and keep low-variance ones with equal probability, destroying most of the information PCA is built to preserve. PCA deliberately ranks directions by captured variance and keeps the top ones; randomness defeats the entire purpose of choosing the best subspace." }
          ]
        }]
      },
      {
        phase: "Prep", icon: "🧹", title: "Center & form covariance",
        narrative: `<p>PCA acts on the covariance STRUCTURE, and that requires centering first. Variance is measured about the mean, so if you skip centering, the squared length of the data vectors includes the mean offset — and the top direction ends up pointing at the cloud's CENTER rather than its spread. After centering each column to mean 0, the covariance $\\frac{1}{n}X^\\top X$ is symmetric (so it has real eigenvalues and orthogonal eigenvectors) and positive-semidefinite (so every eigenvalue is $\\ge 0$, matching the fact that variance can't be negative).</p>`,
        concepts: ["la-psd", "la-transpose", "fnd-matvec"],
        insight: `<b>Skip centering and the top component is the mean.</b> A central MNIST pixel has a large mean brightness (say mean 50, std 2 on the 0–255 scale); the uncentered 'variance' along it is dominated by $50^2=2500$, not the meaningful $2^2=4$ — so the first uncentered component just points at the mean digit (the average image) and captures a fake 99% of 'variance'. After centering each pixel column, that pixel contributes its true variance of 4, and the covariance $\\frac{1}{n}X^\\top X$ is symmetric PSD: all 784 eigenvalues $\\ge 0$, exactly what the decomposition needs.`,
        data: {
          caption: "Effect of centering on the leading direction",
          columns: ["step", "top-direction points at", "1st eigenvalue", "meaningful?"],
          rows: [
            ["raw (uncentered)", "the mean offset", "huge (≈ mean$^2$)", "no ✗"],
            ["after centering", "max spread", "true variance", "yes ✓"],
            ["covariance $\\frac1n X^\\top X$", "—", "all $\\ge 0$ (PSD)", "—"],
            ["…", "…", "…", "…"]
          ],
          note: `Centering moves the origin to the data's mean so the leading eigen-direction captures spread, not offset. The result is a symmetric PSD covariance.`
        },
        symbols: [
          { sym: "centering", desc: "subtracting each column's mean so the data has mean 0; required for variance to be measured about the center." },
          { sym: "$\\frac{1}{n}X^\\top X$", desc: "the covariance matrix of the centered data; $X^\\top X$ multiplies the matrix by its transpose." },
          { sym: "symmetric", desc: "$M=M^\\top$; guarantees real eigenvalues and orthogonal eigenvectors — the basis PCA returns." },
          { sym: "positive-semidefinite (PSD)", desc: "all eigenvalues $\\ge 0$; here each is a variance, which can never be negative." }
        ],
        steps: [{
          type: "decide", prompt: "Before decomposing, what must you do to the data matrix $X$?",
          options: [
            { label: "Subtract each column's mean (center), then form $\\frac{1}{n}X^\\top X$, which is symmetric PSD", best: true, feedback: "design decision: center, then form the covariance. Mechanism: centering moves the origin to the data's mean so the leading component captures SPREAD instead of offset (without it, a feature at mean 50 swamps everything with a fake $50^2$ 'variance'); the resulting $\\frac1n X^\\top X$ is symmetric (real eigenvalues, orthogonal eigenvectors) and PSD (eigenvalues $\\ge 0$, i.e. real variances) — precisely the structure the eigen/SVD step exploits. Tradeoff: none; this is mandatory PCA prep." },
            { label: "Decompose the raw uncentered matrix", best: false, feedback: "without centering, the squared magnitudes the decomposition sees are dominated by the mean offset, not the variance. The first 'principal component' then just points from the origin toward the data cloud's center and reports a meaningless huge eigenvalue (≈ mean$^2$), while the real spread directions get buried. You'd be decomposing the offset, not the variance you came for." },
            { label: "Randomly shuffle the entries first", best: false, feedback: "shuffling entries scrambles the correlations BETWEEN features — which is the entire signal PCA exists to find. The covariance structure depends on how features co-vary across samples; permute the entries and those co-variations vanish, leaving a covariance that reflects noise, not the data's real low-dimensional subspace. This destroys exactly what you're trying to measure." }
          ]
        }]
      },
      {
        phase: "Decompose", icon: "🔱", title: "Choose the decomposition",
        narrative: `<p>You can get the components two ways: eigendecompose the covariance $X^\\top X$, or take the SVD of the centered data matrix $X$ directly, $X=U\\Sigma V^\\top$. They give the SAME principal directions ($V$ holds them, and the variances are $\\sigma_i^2/n$), but with very different numerical stability. Forming $X^\\top X$ SQUARES the condition number — if $X$ has condition number $\\kappa$, then $X^\\top X$ has $\\kappa^2$, so it can lose roughly twice as many digits of precision. SVD of $X$ never forms that product and stays well-behaved.</p>`,
        concepts: ["la-svd", "la-spectral", "fnd-eigen"],
        insight: `<b>Forming $X^\\top X$ squares the conditioning — and the error.</b> Here $X$ has condition number $\\kappa\\approx 10^6$. Eigendecomposing $X^\\top X$ works with $\\kappa^2\\approx 10^{12}$, leaving only $\\sim4$ accurate digits in double precision; the small components come out as numerical mush. SVD of $X$ directly works with $\\kappa\\approx 10^6$, preserving $\\sim10$ digits — the identical components, but trustworthy down to the tail. Same math, very different precision.`,
        data: {
          caption: "Two routes to the same components, different stability",
          columns: ["method", "matrix used", "effective conditioning", "digits kept (of ~16)"],
          rows: [
            ["eigen of covariance", "$X^\\top X$", "$\\kappa^2\\approx 10^{12}$", "~4 ✗"],
            ["SVD of data matrix", "$X$ directly", "$\\kappa\\approx 10^6$", "~10 ✓"],
            ["invert covariance", "$(X^\\top X)^{-1}$", "explodes", "unstable ✗"],
            ["…", "…", "…", "…"]
          ],
          note: `$V$ from $X=U\\Sigma V^\\top$ gives the principal directions; the singular values $\\sigma_i$ give the variances as $\\sigma_i^2/n$ — without ever squaring the conditioning.`
        },
        symbols: [
          { sym: "$X=U\\Sigma V^\\top$", desc: "the singular value decomposition of $X$; $V$'s columns are the principal directions." },
          { sym: "$U$", desc: "left singular vectors (orthonormal); the data's coordinates in the new basis, scaled by $\\Sigma$." },
          { sym: "$\\Sigma$", desc: "diagonal matrix of singular values $\\sigma_i \\ge 0$; $\\sigma_i^2/n$ is the variance along component $i$." },
          { sym: "$V^\\top$", desc: "transpose of $V$, the orthonormal right singular vectors — the principal axes PCA returns." },
          { sym: "$\\kappa$", desc: "condition number of $X$; forming $X^\\top X$ squares it to $\\kappa^2$, doubling the precision loss." }
        ],
        steps: [{
          type: "decide", prompt: "Which decomposition should the engine use for the components?",
          options: [
            { label: "SVD of the centered data matrix directly — avoids forming $X^\\top X$ and is more numerically stable", best: true, feedback: "design decision: get the components from $X$, not from $X^\\top X$. Mechanism: $X=U\\Sigma V^\\top$ yields the identical principal directions in $V$ and variances in $\\sigma_i^2/n$, but it never forms the covariance product — so it works at conditioning $\\kappa$ instead of $\\kappa^2$, keeping ~10 digits where the covariance route keeps ~4. Tradeoff: SVD of a tall matrix is a bit more work than the small covariance, but the precision in the small components is worth it." },
            { label: "Invert the covariance matrix", best: false, feedback: "PCA needs the eigen-DIRECTIONS of the covariance, not its inverse — inversion answers a question you never asked. Worse, when features are near-collinear the covariance is near-singular, and inverting a near-singular matrix amplifies tiny round-off into huge errors. It's both unnecessary and numerically dangerous; you want a decomposition, not an inverse." },
            { label: "A determinant of the data matrix", best: false, feedback: "the determinant collapses the whole matrix into a single scalar (and isn't even defined for a non-square $70{,}000\\times784$ matrix). It carries no information about the principal DIRECTIONS — you can't recover a single eigenvector from it. It's simply the wrong tool: PCA needs a full decomposition that exposes the directions and their variances." }
          ]
        }]
      },
      {
        phase: "Implement", icon: "⌨️", title: "Implement & pick rank",
        narrative: `<p>Run the SVD and decide how many components to keep. Each singular value $\\sigma_i$ contributes variance $\\sigma_i^2$, so the cumulative fraction $\\sum_{i\\le k}\\sigma_i^2 / \\sum_i \\sigma_i^2$ is exactly the variance retained by keeping the top $k$. The Eckart–Young theorem makes this precise and optimal: among ALL rank-$k$ matrices, the truncated SVD $X_k=U_k\\Sigma_k V_k^\\top$ is the closest to $X$, and the leftover squared error is exactly the dropped tail $\\lVert X - X_k\\rVert_F^2 = \\sum_{i>k}\\sigma_i^2$. So reconstruction error vs rank $k$ is just that descending tail sum — no other rank-$k$ approximation does better. The rank choice is a trade: more components mean higher fidelity but less compression. You pick the SMALLEST $k$ that meets your variance target — a classic elbow on the cumulative-variance curve.</p>`,
        concepts: ["la-svd", "la-trace", "ml-pca"],
        insight: `<b>The singular-value spectrum picks the rank.</b> The spectrum drops fast — $\\sigma_1=412$ down to $\\sigma_{50}=9.1$ — so variance concentrates early: the top 12 directions hit 90% and the top 28 hit 95%. Keeping 28 is a ~18:1 compression at 95% fidelity; if downstream tolerates a little more loss, 12 gives ~42:1 at 90%. The cumulative-variance curve is the exact tool for reading off that trade.`,
        data: {
          caption: "SVD singular-value spectrum and cumulative variance",
          columns: ["component $i$", "$\\sigma_i$", "variance $\\sigma_i^2$ share", "cumulative variance"],
          rows: [
            ["1", "412", "9.1%", "9.1%"],
            ["12", "—", "—", "90%"],
            ["28", "—", "—", "95%"],
            ["50", "9.1", "<0.1%", "98% (tail …)"]
          ],
          note: `Variance share $=\\sigma_i^2/\\sum\\sigma_j^2$. The steep drop in $\\sigma_i$ is why a few components suffice; the cumulative column is what you threshold on.`
        },
        chart: {
          type: "line", title: "Reconstruction error vs rank k (variance dropped)",
          xlabel: "components kept (k)", ylabel: "variance dropped (%)",
          series: [
            { name: "reconstruction error", color: "#ffb454", points: [[1, 82], [12, 10], [28, 5], [50, 2]] }
          ]
        },
        symbols: [
          { sym: "$\\sigma_i$", desc: "the $i$-th singular value; its square $\\sigma_i^2$ is proportional to the variance captured by component $i$." },
          { sym: "$k$", desc: "the number of components kept — the rank of the truncated representation." },
          { sym: "cumulative variance", desc: "$\\sum_{i\\le k}\\sigma_i^2/\\sum_i\\sigma_i^2$; the fraction of total variance retained by the top $k$ components." },
          { sym: "truncated SVD", desc: "computing only the top-$k$ singular values/vectors instead of the full decomposition." },
          { sym: "Eckart–Young", desc: "the theorem that the rank-$k$ truncated SVD is the BEST rank-$k$ approximation of $X$, with squared error exactly $\\sum_{i>k}\\sigma_i^2$ (the dropped tail)." }
        ],
        steps: [
          { type: "run", label: "▶ Compute truncated SVD", result: { log: "centered X (70,000 x 784 MNIST)\nrandomized SVD, k=50...\nsingular values: s1=412, s2=388, ..., s50=9.1\ncumulative variance: top 12 -> 90%, top 28 -> 95%\nkept k = 28 (95% variance)", metrics: [{ k: "components", v: "28" }, { k: "variance kept", v: "95%" }], chart: {
            type: "bars", title: "Singular-value spectrum (decaying): top components",
            labels: ["s1", "s2", "s4", "s8", "s12", "s20", "s28", "s50"],
            values: [412, 388, 301, 188, 96, 41, 19, 9.1],
            valueLabels: ["412", "388", "301", "188", "96", "41", "19", "9.1"],
            colors: ["#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff", "#4ea1ff"]
          } } },
          { type: "decide", prompt: "Top 12 components capture 90% of variance, top 28 capture 95%. How many to keep?",
            options: [
              { label: "Keep 28 (95%) — or 12 if downstream tolerates 90%; choose by the variance/compression trade-off", best: true, feedback: "design decision: let the downstream fidelity requirement set the rank via the cumulative-variance curve. Mechanism: each extra component adds $\\sigma_i^2$ of variance but costs compression, so you take the smallest $k$ clearing your target — 28 for 95% high-fidelity, or 12 for 90% if the task tolerates it. Tradeoff: that's literally the knob — more fidelity vs more compression — and the cumulative curve reads it off directly. No single answer; it depends on the consumer." },
              { label: "Always keep all 784", best: false, feedback: "keeping all 784 components is a rotation, not a reduction — you've re-expressed the images in the principal basis but discarded nothing, so there's zero compression and zero denoising. The entire value of PCA is dropping the low-variance tail (the last ~756 directions here carry only 5% of variance). Keeping everything throws that benefit away and leaves you exactly where you started, just rotated." }
            ] }
        ]
      },
      {
        phase: "Validate", icon: "🔎", title: "Validate numerically",
        narrative: `<p>A linear-algebra engine must be correct to floating-point precision, so you validate against KNOWN identities rather than eyeballing output. Two checks pin it down: orthonormality, where $V^\\top V$ should equal the identity $I$ (the components are mutually perpendicular unit vectors), and reconstruction error, which the Eckart–Young theorem says must equal exactly the sum of the DROPPED singular values squared, $\\lVert X-X_k\\rVert_F^2 = \\sum_{i>k}\\sigma_i^2$. The catch: 'correct' means errors at the $10^{-14}$ round-off level, NOT literal zero — demanding exact zero would reject every correct floating-point implementation.</p>`,
        concepts: ["la-identity-diagonal", "la-rank-independence", "fnd-matvec"],
        insight: `<b>Machine-precision, not zero, is the pass bar.</b> The orthonormality residual $\\max|V^\\top V - I| = 3.1\\times10^{-14}$ — about 100× the double-precision epsilon ($\\approx 2.2\\times10^{-16}$), exactly the round-off you expect from a clean computation. Reconstruction error matches the theoretical $\\sum_{i>k}\\sigma_i^2$ to a relative $2\\times10^{-12}$, confirming the math is implemented right. These tiny nonzero numbers are the SIGNATURE of correctness; a residual of $10^{-3}$ would signal a real bug.`,
        data: {
          caption: "Numerical validation against known identities",
          columns: ["check", "should equal", "measured", "verdict"],
          rows: [
            ["$V^\\top V$", "$I$ (identity)", "off by 3.1e-14", "round-off ✓"],
            ["reconstruction err", "$\\sum_{i>k}\\sigma_i^2$", "rel diff 2e-12", "matches theory ✓"],
            ["rank of top-28", "28 independent", "28", "full rank ✓"],
            ["NaN / inf", "none", "none", "clean ✓"]
          ],
          note: `Errors at $10^{-14}$–$10^{-12}$ are floating-point round-off (epsilon $\\approx 2\\times10^{-16}$), not bugs. Correctness is verified against identities, with machine precision as the bar.`
        },
        symbols: [
          { sym: "$V^\\top V$", desc: "the components times their own transpose; equals the identity $I$ iff they are orthonormal." },
          { sym: "$I$", desc: "the identity matrix (1s on the diagonal, 0s off); the target of the orthonormality check." },
          { sym: "$\\sum_{i>k}\\sigma_i^2$", desc: "sum of squared DROPPED singular values; theory says this equals the reconstruction error." },
          { sym: "machine epsilon", desc: "the smallest relative round-off in floating point ($\\approx 2.2\\times10^{-16}$ double); errors near it are expected, not bugs." }
        ],
        steps: [
          { type: "run", label: "▶ Run numerical checks", result: { log: "orthonormality: max |V^T V - I| = 3.1e-14  (machine precision OK)\nreconstruction error matches sum of dropped s_i^2 (theory): rel diff 2e-12\nrank check: 28 components linearly independent\nno NaN/inf", metrics: [{ k: "orthonormality err", v: "3e-14" }, { k: "recon vs theory", v: "2e-12" }] } },
          { type: "decide", prompt: "Orthonormality holds to 3e-14 and reconstruction matches theory to 2e-12. Verdict?",
            options: [
              { label: "Numerically sound — errors are at machine-precision level", best: true, feedback: "design decision: judge correctness against the right tolerance. Mechanism: $V^\\top V$ off from $I$ by $3\\times10^{-14}$ is ~100× machine epsilon — the expected accumulation of round-off from millions of clean operations — and the reconstruction error matching the theoretical $\\sum_{i>k}\\sigma_i^2$ to $2\\times10^{-12}$ proves the algorithm computes what the math says. Tradeoff: you accept tiny nonzero residuals as correct, which is exactly right for floating point." },
              { label: "Broken — the errors aren't exactly zero", best: false, feedback: "this applies an impossible standard. Floating-point arithmetic represents numbers with finite precision (epsilon $\\approx 2\\times10^{-16}$), so accumulating millions of operations inevitably leaves round-off at the $10^{-14}$ level — that's physics of the hardware, not a defect. Demanding literal zero would fail every correct numerical routine ever written. The residuals here ARE the signature of a correct implementation, not a broken one." }
            ] }
        ]
      },
      {
        phase: "Stabilize", icon: "🛡️", title: "Guard against ill-conditioning",
        narrative: `<p>On MNIST this is a real hazard: the border pixels are almost always 0 (the digit never touches the edge), so several pixel columns are nearly constant and nearly collinear — one is almost a copy of another. That makes the covariance close to singular and the system ill-conditioned. The SVD exposes it directly: near-collinear columns produce near-ZERO singular values, because there's a direction along which the data barely varies. The engine should DETECT those tiny singular values and drop or merge the redundant direction, rather than treating the near-singular system as full-rank and letting round-off blow up in the components below the noise floor.</p>`,
        concepts: ["la-rank-independence", "la-determinant", "la-inverse"],
        insight: `<b>A tiny singular value is the collinearity alarm.</b> Two nearly-identical columns drop their shared direction's singular value to $\\sigma\\approx 3\\times10^{-7}$ — essentially zero against $\\sigma_1=412$, a condition number of $\\sim10^9$. Anything you compute along that direction is pure round-off noise. Detecting it (threshold $\\sigma_i < \\tau\\cdot\\sigma_1$) and dropping the redundant axis keeps the decomposition stable; trying to invert through it would multiply errors by $\\sim10^9$.`,
        data: {
          caption: "Singular spectrum with two collinear columns",
          columns: ["direction", "$\\sigma_i$", "vs $\\sigma_1$", "action"],
          rows: [
            ["1 (strong)", "412", "1", "keep"],
            ["27 (real, weak)", "9.1", "0.022", "keep"],
            ["redundant (collinear)", "3e-7", "~1e-9", "DROP ⚠"],
            ["…", "…", "…", "…"]
          ],
          note: `Near-collinear columns collapse a singular value toward 0; thresholding on $\\sigma_i/\\sigma_1$ detects and removes the rank-deficient direction before it corrupts the result.`
        },
        symbols: [
          { sym: "collinear", desc: "columns that are nearly linear combinations of each other; they make the matrix near rank-deficient." },
          { sym: "rank deficiency", desc: "fewer truly independent directions than columns; flagged by singular values near zero." },
          { sym: "$\\sigma_i \\approx 0$", desc: "a near-zero singular value marking a direction of almost no variance — the collinear/redundant one." },
          { sym: "condition number", desc: "$\\sigma_1/\\sigma_{\\min}$; huge when a singular value is tiny, signaling instability." }
        ],
        steps: [{
          type: "decide", prompt: "Two feature columns are nearly identical (collinear). What should the engine do?",
          options: [
            { label: "Detect the rank deficiency (tiny singular values) and drop/merge the redundant direction", best: true, feedback: "design decision: use the singular spectrum itself as the detector. Mechanism: near-collinear columns push a singular value toward 0 (here $3\\times10^{-7}$ vs $\\sigma_1=412$), so thresholding on $\\sigma_i/\\sigma_1$ flags the rank-deficient direction; dropping or merging it removes a direction that holds only round-off noise, keeping the rest of the decomposition stable and meaningful. Tradeoff: you discard a 'component', but it carried no real variance — only numerical garbage." },
            { label: "Invert the covariance anyway", best: false, feedback: "inverting a near-singular covariance is the textbook instability to avoid. The inverse scales by $1/\\sigma^2$, so a singular value of $3\\times10^{-7}$ amplifies round-off by ~$10^{13}$ — tiny floating-point errors explode into enormous ones, and the result is meaningless. The whole point of detecting the tiny singular value is to NOT divide by it; inverting does exactly the forbidden thing." },
            { label: "Ignore it; floating point will sort it out", best: false, feedback: "floating point does NOT sort it out — it does the opposite. An unhandled near-zero singular value means the component along that direction is computed by dividing signal-free data by a near-zero number, producing pure numerical noise that masquerades as a real component. Downstream consumers then treat garbage as structure. Rank deficiency must be detected and handled explicitly, never ignored." }
          ]
        }]
      },
      {
        phase: "Optimize", icon: "⚡", title: "Optimize the routine",
        narrative: `<p>The engine must be fast at scale. The key insight: you only KEEP 28 of 784 components, so computing all 784 is wasted work. A randomized truncated SVD computes just the top-$k$ directions — it projects $X$ onto a small random subspace, captures the dominant directions there, and recovers the leading components at near-exact accuracy for a fraction of the cost. Build it on batched, BLAS-optimized matrix multiplies (the hardware's fastest kernels) rather than Python loops, and it screams.</p>`,
        concepts: ["la-matmul", "la-svd", "fnd-matvec"],
        insight: `<b>Compute only the top-$k$ on fast kernels.</b> Full SVD of the $70{,}000\\times784$ MNIST matrix takes 41.0s; randomized top-28 SVD takes 2.3s — an <b>18×</b> speedup — and its leading eigen-digits match the full SVD to a cosine of 0.9999 (visually identical directions). The projection step then runs at 3.4M rows/s by riding BLAS matmul kernels. Pure-Python entry-by-entry loops would be orders of magnitude slower and are never the answer here.`,
        data: {
          caption: "Optimized engine benchmark (70k × 784, keep 28)",
          columns: ["method", "time", "fidelity (cosine vs full)", "note"],
          rows: [
            ["full SVD (all 784)", "41.0s", "1.0000", "computes 756 unused dirs"],
            ["randomized top-28 SVD", "2.3s", "0.9999", "18× faster ✓"],
            ["pure-Python loop", "hours", "—", "abandons BLAS ✗"],
            ["projection throughput", "—", "—", "3.4M rows/s"]
          ],
          note: `Computing only the components you keep, on BLAS-optimized matmuls, gives near-exact leading directions at ~1/18th the cost.`
        },
        symbols: [
          { sym: "randomized truncated SVD", desc: "an algorithm that finds the top-$k$ singular directions via a random projection, skipping the rest." },
          { sym: "BLAS", desc: "Basic Linear Algebra Subprograms — highly optimized, hardware-tuned matrix-multiply kernels." },
          { sym: "cosine fidelity", desc: "cosine similarity between the approximate and exact components; 0.9999 means the directions are essentially identical." },
          { sym: "throughput", desc: "rows projected per second; the serving-time speed of applying the fitted components." }
        ],
        steps: [
          { type: "decide", prompt: "Full SVD of a 70k x 784 matrix is too slow. How do you speed it up while staying accurate?",
            options: [
              { label: "Use randomized truncated SVD (top-k only) built on batched, BLAS-optimized matrix multiplies", best: true, feedback: "design decision: match the computation to what you actually keep, and run it on the fastest kernels. Mechanism: you retain only 28 components, so a randomized method projects onto a small subspace and recovers just those top directions — near-exact (cosine 0.9999) at 18× the speed — while BLAS matmuls exploit cache and vector hardware the way no hand loop can. Tradeoff: a small, controllable approximation in the tail, invisible for the leading components you care about." },
              { label: "Compute the full 784x784 eigendecomposition every query", best: false, feedback: "this computes all 784 components when you keep 28 — over 96% of the work goes into directions you immediately throw away (the table's 41s vs 2.3s). Recomputing it per query compounds the waste. Truncated methods exist precisely to avoid spending effort on the components below your rank cutoff; the full decomposition is the slow path you're trying to escape." },
              { label: "Loop over entries in pure Python", best: false, feedback: "elementwise Python loops abandon BLAS — the hardware-tuned matrix-multiply kernels that exploit caching and SIMD — so they run orders of magnitude slower (hours, not seconds) for the identical math. Worse, they don't even reduce the work; they just do the same operations on a far slower engine. The whole game at this scale is staying inside optimized linear-algebra kernels, which Python loops explicitly leave." }
            ] },
          { type: "run", label: "▶ Benchmark optimized engine", result: { log: "full SVD: 41.0s\nrandomized top-28 SVD: 2.3s  (18x faster)\ntop components match full SVD: cosine 0.9999\nthroughput: 3.4M rows/s on the projection step", metrics: [{ k: "speedup", v: "18x" }, { k: "fidelity", v: "0.9999" }] } }
        ]
      },
      {
        phase: "Monitor", icon: "📡", title: "Monitor stability in production",
        narrative: `<p>As new data flows in, its covariance structure shifts and conditioning can degrade — and a fast engine can return a confidently wrong projection. Three numerical-health signals catch this: the CONDITION NUMBER (a creeping rise warns of new collinearity and instability), VARIANCE-EXPLAINED by the kept components (a drop means the fixed directions no longer fit the data), and RECONSTRUCTION ERROR on a sample (the live correctness check). Latency alone is blind to all of these.</p>`,
        concepts: ["la-rank-independence", "la-svd", "la-spectral"],
        insight: `<b>Rising condition number plus dropping variance = the components are stale.</b> This week the condition number jumped $2.1\\times10^3 \\to 4.8\\times10^6$ (new collinearity creeping in), the variance explained by the fixed top-28 fell 95% → 88% (the data's subspace has rotated away from the old components), and reconstruction error rose 1.9×. All three say the same thing: refit. That sends you back to <b>Prep</b>/<b>Decompose</b> to re-center and recompute on current data.`,
        data: {
          caption: "Numerical-health monitors this week vs fitted",
          columns: ["signal", "fitted", "this week", "meaning"],
          rows: [
            ["condition number", "2.1e3", "4.8e6", "new collinearity ⚠"],
            ["variance explained (top-28)", "95%", "88%", "subspace drifted"],
            ["reconstruction error", "1×", "1.9×", "components stale"],
            ["latency", "2ms", "2ms", "fast but irrelevant"]
          ],
          note: `Speed looks fine while correctness degrades. Condition number, variance-explained, and reconstruction error are what actually reveal the engine going stale.`
        },
        symbols: [
          { sym: "condition number", desc: "$\\sigma_1/\\sigma_{\\min}$; a rising value warns of new collinearity and numerical instability." },
          { sym: "variance explained", desc: "fraction of variance the fixed top-$k$ components capture on new data; a drop means the subspace drifted." },
          { sym: "reconstruction error", desc: "how well the kept components rebuild a held-out sample; the live correctness check." },
          { sym: "drift", desc: "the data's covariance structure rotating away from the fitted components over time, requiring a refit." }
        ],
        steps: [
          { type: "decide", prompt: "What should the deployed PCA engine monitor?",
            options: [
              { label: "Condition number / smallest singular value, variance-explained drift, and reconstruction error on a sample", best: true, feedback: "design decision: monitor numerical HEALTH and FIT, the two ways the engine silently fails. Mechanism: a creeping condition number (2.1e3→4.8e6) flags new collinearity that destabilizes the decomposition; a falling variance-explained (95%→88%) shows the fixed components no longer match the rotated data; and reconstruction error on a fresh sample is the direct live correctness check. Tradeoff: needs periodic sampled recomputation, cheap insurance against serving garbage." },
              { label: "Only the wall-clock latency", best: false, feedback: "latency measures speed, which is orthogonal to correctness — an ill-conditioned or drifted input produces a projection just as FAST as a good one, and just as confidently wrong. The table shows latency pinned at 2ms while the condition number explodes and variance-explained collapses. Watching only speed means the engine can degrade into returning numerical garbage without a single alert firing." }
            ] },
          { type: "run", label: "▶ Check stability monitors", result: { log: "incoming batch (this week)\ncondition number: 2.1e3 -> 4.8e6  (collinearity rising ALERT)\nvariance-explained by top 28: 95% -> 88% (structure shifted)\nreconstruction error up 1.9x\naction: re-center, re-fit components, re-check rank", metrics: [{ k: "cond number", v: "4.8e6 ⚠" }, { k: "var explained", v: "88%" }] }, note: `The loop closes: rising condition number and drifting variance send you back to <b>Prep</b>/<b>Decompose</b> to refit on current data. A numerical engine must stay watched for stability.` }
        ]
      }
    ]
  }
});
