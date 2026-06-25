(function () {
  window.LESSONS.push({
    id: "pt-regularization",
    title: "Regularization in PyTorch: fighting overfitting",
    tagline: "Dropout, batch norm, weight decay, early stopping, and grad clipping — the tools that keep a PyTorch model from memorizing the training set.",
    module: "PyTorch (a complete course)",
    prereqs: ["ml-regularization", "dl-dropout", "dl-batchnorm", "dl-early-stopping", "dl-optimizers", "pt-autograd"],
    whenToUse:
      `<p><b>Reach for regularization whenever training accuracy is much higher than validation accuracy.</b> That gap <i>is</i> overfitting: the model has memorized the training data (including its noise) instead of learning the pattern that generalizes. In practice this is <b>almost every real model</b> — modern networks have far more parameters than you have data, so left alone they will overfit.</p>
       <p>The math of <i>why</i> these techniques work lives in the concept lessons — <code>ml-regularization</code> (the bias/variance trade-off and L2 penalty), <code>dl-dropout</code>, <code>dl-batchnorm</code>, and <code>dl-early-stopping</code>. This lesson is about <b>how</b>: the exact PyTorch lines, and the one mode switch that trips up everybody.</p>
       <ul>
         <li><b>Dropout</b> — randomly zero some activations each step so no single unit can be relied on (<code>nn.Dropout(p)</code>).</li>
         <li><b>Batch normalization</b> — normalize each layer's inputs; also a mild regularizer (<code>nn.BatchNorm1d</code> / <code>nn.BatchNorm2d</code>).</li>
         <li><b>Weight decay / L2</b> — push weights toward zero (<code>weight_decay=</code> on the optimizer).</li>
         <li><b>Early stopping</b> — stop training when validation loss stops improving, and restore the best weights.</li>
         <li><b>Gradient clipping</b> — cap the gradient size so a few huge updates cannot blow up training (<code>clip_grad_norm_</code>).</li>
         <li><b>Data augmentation</b> — manufacture more training variety so the model cannot memorize (see <code>dl-data-augmentation</code>).</li>
       </ul>`,
    application:
      `<p>Every production network stacks several of these. A typical image classifier uses <code>BatchNorm2d</code> after each convolution, <code>Dropout</code> before the final linear layer, a small <code>weight_decay</code> on the optimizer, and early stopping on a held-out validation set. Recurrent and transformer models lean on dropout plus gradient clipping (recurrent gradients explode easily). The training-data side is handled by augmentation (random crops, flips) wired into the <code>DataLoader</code> — see <code>dl-data-augmentation</code>.</p>`,
    pitfalls:
      `<ul>
         <li><b>Dropout / batch norm still ACTIVE at evaluation because you forgot <code>model.eval()</code> — the #1 regularization bug.</b> Dropout and batch norm behave differently in training vs evaluation. If you predict while the model is still in <code>train()</code> mode, dropout keeps randomly zeroing activations and batch norm keeps using <i>this batch's</i> statistics — so your predictions are noisy and wrong, and they change every time you run them. <b>Fix:</b> call <code>model.eval()</code> before validation / inference, and <code>model.train()</code> before training again. (Pair it with <code>torch.no_grad()</code> to also skip gradient bookkeeping.)</li>
         <li><b><code>weight_decay</code> on plain <code>Adam</code> is not true L2 — use <code>AdamW</code>.</b> Classic L2 adds the penalty into the loss, so the decay term flows through Adam's adaptive scaling and gets distorted. <code>torch.optim.AdamW</code> <i>decouples</i> weight decay — it subtracts a plain fraction of each weight after the Adam step, which is the behavior you actually want. <b>Fix:</b> prefer <code>AdamW(..., weight_decay=1e-2)</code> over <code>Adam(..., weight_decay=...)</code>.</li>
         <li><b>Over-regularizing → underfitting.</b> Too much dropout, too large a <code>weight_decay</code>, or stopping too early can drag <i>both</i> train and validation accuracy down. The goal is to close the train/val gap, not to crush training accuracy. <b>Fix:</b> tune the strength; if train accuracy is now low, dial it back.</li>
         <li><b>Early stopping without restoring the BEST weights.</b> The model you keep should be the one from the epoch with the lowest validation loss — not the (worse) weights from a few epochs later when you finally noticed it stopped improving. <b>Fix:</b> snapshot <code>model.state_dict()</code> at every new best, and <code>load_state_dict()</code> that snapshot at the end.</li>
         <li><b>Batch norm with <code>batch_size=1</code> (or very small batches).</b> Batch norm estimates mean and variance <i>across the batch</i>; with one sample the variance is undefined / unstable and training breaks. <b>Fix:</b> use a reasonable batch size, or switch to <code>nn.GroupNorm</code> / <code>nn.LayerNorm</code> for tiny-batch regimes.</li>
         <li><b>Double-counting augmentation and dropout.</b> Heavy data augmentation is already strong regularization; piling on heavy dropout on top can tip you into underfitting. <b>Fix:</b> treat them as one regularization budget and tune together, not independently.</li>
       </ul>`,
    bigIdea:
      `<p>Overfitting happens when a model has enough capacity to memorize the training set — it fits the noise, not just the signal. Every technique here is a different way to <b>limit effective capacity</b> or <b>add training variety</b> so memorization is harder than learning the real pattern:</p>
       <ul>
         <li><b>Dropout and batch norm</b> add noise / constraints inside the network.</li>
         <li><b>Weight decay</b> shrinks the weights, keeping the function smooth.</li>
         <li><b>Early stopping</b> limits how long the model trains, so it never reaches the deeply-memorized state.</li>
         <li><b>Augmentation</b> grows the apparent dataset so there is simply more to fit.</li>
       </ul>
       <p>The two layer-based tools (<code>Dropout</code>, <code>BatchNorm</code>) are <b>mode-dependent</b>: they do one thing during training and a different thing during evaluation. That single fact is the source of most regularization bugs in PyTorch.</p>`,
    buildup:
      `<p>PyTorch wires these in at three different places, and it helps to keep them straight:</p>
       <ul>
         <li><b>In the model</b> (<code>nn.Module</code>): <code>nn.Dropout(p)</code> and <code>nn.BatchNorm1d/2d</code> are <i>layers</i> you place in <code>__init__</code> and call in <code>forward</code>. Their behavior is controlled by the module's mode (<code>train</code> / <code>eval</code>).</li>
         <li><b>In the optimizer</b>: <code>weight_decay=</code> is an argument to <code>optim.Adam</code> / <code>optim.AdamW</code> / <code>optim.SGD</code>. It is applied during <code>optimizer.step()</code>.</li>
         <li><b>In the training loop</b>: early stopping (track validation loss, snapshot the best <code>state_dict</code>) and gradient clipping (<code>nn.utils.clip_grad_norm_</code> between <code>backward()</code> and <code>step()</code>) are things <i>you</i> code by hand around the loop.</li>
       </ul>`,
    symbols: [
      { sym: "model.train()", desc: "puts the module in TRAINING mode: dropout zeros activations, batch norm uses this-batch statistics and updates its running averages." },
      { sym: "model.eval()", desc: "puts the module in EVALUATION mode: dropout is a no-op (passes everything through), batch norm uses its stored running mean/variance. Call this before validation and inference." },
      { sym: "weight_decay", desc: "optimizer argument; the strength of the L2 / weight-shrinkage penalty. Decoupled and correct in AdamW; coupled (subtly off) in plain Adam." },
      { sym: "clip_grad_norm_", desc: "rescales all gradients so their combined L2 norm is at most max_norm; prevents a single huge update from destabilizing training." }
    ],
    formula: `$$ w \\leftarrow w - \\eta\\,\\nabla \\mathcal{L}(w) \\;-\\; \\eta\\,\\lambda\\, w $$`,
    whatItDoes:
      `<p>This is the weight-decay update (the decoupled / <code>AdamW</code> form). $w$ is a weight, $\\eta$ the learning rate, $\\nabla \\mathcal{L}(w)$ the usual loss gradient, and $\\lambda$ the <code>weight_decay</code> strength. The extra $-\\eta\\,\\lambda\\, w$ term pulls every weight a little toward zero on each step — that constant shrink is exactly L2 regularization. See <code>ml-regularization</code> for why a smaller-weight model generalizes better.</p>`,
    derivation:
      `<p><b>How the mode switch actually changes the math.</b></p>
       <ul class="steps">
         <li><b>Dropout, train mode:</b> each activation is kept with probability $1-p$ and otherwise set to $0$; survivors are scaled by $\\tfrac{1}{1-p}$ so the expected value is unchanged. This is random every forward pass, so the network learns not to depend on any single unit (see <code>dl-dropout</code>).</li>
         <li><b>Dropout, eval mode:</b> nothing is dropped — the layer becomes the identity. You want a single deterministic prediction, not a random one.</li>
         <li><b>Batch norm, train mode:</b> each feature is standardized using the <i>current batch's</i> mean and variance, and a running average of those statistics is updated in the background.</li>
         <li><b>Batch norm, eval mode:</b> the layer uses the stored <i>running</i> mean and variance instead of the batch's — so a single test example is normalized consistently, independent of whatever else happens to be in the batch (see <code>dl-batchnorm</code>).</li>
         <li><b>The consequence:</b> if you forget <code>model.eval()</code>, both layers silently stay in their training behavior, and your "predictions" are random (dropout) and batch-dependent (batch norm). Same weights, wrong outputs.</li>
       </ul>
       <p><b>Early stopping</b> needs no special layer: you watch validation loss, remember the epoch where it was lowest, and roll the weights back to that snapshot — trading a few wasted epochs for the best-generalizing model (see <code>dl-early-stopping</code>).</p>`,
    example:
      `<p>A minimal regularized block: <code>nn.Sequential(nn.Linear(20, 64), nn.BatchNorm1d(64), nn.ReLU(), nn.Dropout(0.3), nn.Linear(64, 2))</code>.</p>
       <ul class="steps">
         <li>During <code>model.train()</code>: <code>BatchNorm1d</code> normalizes each of the 64 features using the batch, and <code>Dropout(0.3)</code> zeros about 30% of them at random.</li>
         <li>During <code>model.eval()</code>: <code>BatchNorm1d</code> switches to its running statistics and <code>Dropout</code> becomes a pass-through — so a given input always maps to the same output.</li>
         <li>Add <code>optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)</code> and the weights are gently shrunk toward zero every step — three regularizers working together.</li>
       </ul>`,
    practice: [
      {
        q: `<b>Type this in Colab.</b> Create <code>drop = nn.Dropout(p=0.5)</code> and a fixed input <code>x = torch.ones(1, 10)</code>. With <code>drop.train()</code>, run the dropout twice and print both outputs; then call <code>drop.eval()</code> and run it once more. Set <code>torch.manual_seed(0)</code> first.`,
        steps: [
          { do: `Toggle the layer mode with <code>drop.train()</code> then <code>drop.eval()</code> around the calls.`, why: `<code>nn.Dropout</code> is mode-dependent: it only zeros (and rescales by $\\tfrac{1}{1-p}$) in train mode, and is a pass-through in eval.` },
          { do: `Print the two train-mode outputs and the eval-mode output.`, why: `The two train outputs differ (random masks); the eval output is the unchanged input — the famous train/eval trap made visible.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
torch.manual_seed(0)
drop = nn.Dropout(p=0.5)
x = torch.ones(1, 10)

drop.train()
print(drop(x))   # some entries 0, survivors scaled to 2.0 (1/(1-0.5))
print(drop(x))   # a DIFFERENT random mask -> different output
drop.eval()
print(drop(x))   # tensor([[1., 1., 1., 1., 1., 1., 1., 1., 1., 1.]]) -- pass-through
# Exact survivors vary, but eval ALWAYS returns x unchanged.</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build <code>model = nn.Sequential(nn.Linear(8, 16), nn.Dropout(0.5), nn.Linear(16, 2))</code>. With a fixed input <code>x = torch.randn(4, 8)</code> (seed 0), call <code>model.eval()</code> and run it twice; then call <code>model.train()</code> and run it twice. Print whether the two outputs are equal in each mode with <code>torch.equal</code>.`,
        steps: [
          { do: `Compare repeated forward passes with <code>torch.equal(a, b)</code> in each mode.`, why: `It returns a single boolean, making the determinism difference unmistakable.` },
          { do: `Predict before running: equal in <code>eval()</code>, unequal in <code>train()</code>.`, why: `Dropout is deterministic (identity) in eval but random in train — the #1 source of "my predictions keep changing" bugs.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Sequential(nn.Linear(8, 16), nn.Dropout(0.5), nn.Linear(16, 2))
x = torch.randn(4, 8)

model.eval()
print(torch.equal(model(x), model(x)))   # True  -- deterministic in eval
model.train()
print(torch.equal(model(x), model(x)))   # False -- dropout randomizes in train</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Make <code>bn = nn.BatchNorm1d(3)</code>. Push a batch <code>x = torch.randn(16, 3)</code> (seed 0) through it in <code>train()</code> mode, then print <code>bn.running_mean</code>. Predict: is it still all zeros after one training forward pass?`,
        steps: [
          { do: `Call <code>bn.train()</code> then <code>bn(x)</code>, and read <code>bn.running_mean</code>.`, why: `In train mode BatchNorm updates its running statistics from the batch; those running stats are what <code>eval()</code> later uses.` },
          { do: `Predict before running: the running mean moves OFF zero.`, why: `It starts at zeros and is updated toward the batch mean by the momentum (default 0.1), proving train-mode side effects.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
bn = nn.BatchNorm1d(3)
print(bn.running_mean)          # tensor([0., 0., 0.]) before
bn.train()
_ = bn(x := torch.randn(16, 3))
print(bn.running_mean)          # small NON-zero values, e.g. tensor([0.0?, ...])
# Updated as 0.9*old + 0.1*batch_mean -> no longer all zeros.</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Try <code>nn.BatchNorm1d(3)(torch.randn(1, 3))</code> in <code>train()</code> mode (batch of ONE) and read the error. Then show it works with a batch of 16. Explain in a comment why batch size 1 fails.`,
        steps: [
          { do: `Run a forward pass with a single sample in train mode and catch the <code>ValueError</code>.`, why: `BatchNorm needs more than one sample to estimate a per-feature variance across the batch.` },
          { do: `Repeat with <code>torch.randn(16, 3)</code>.`, why: `A real batch gives a valid variance, so the layer runs — the standard fix is a bigger batch (or GroupNorm/LayerNorm).` }
        ],
        answer: `<pre><code>bn = nn.BatchNorm1d(3); bn.train()
try:
    bn(torch.randn(1, 3))
except ValueError as e:
    print("CAUGHT:", str(e).splitlines()[0])
    # Expected more than 1 value per channel when training, got input size torch.Size([1, 3])
print(bn(torch.randn(16, 3)).shape)   # torch.Size([16, 3]) -- fine with a real batch
# Batch size 1 -> variance over the batch is undefined.</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Create one <code>nn.Linear(4, 1)</code> and two optimizers on its parameters: <code>torch.optim.SGD(p, lr=0.1, weight_decay=0.0)</code> and <code>torch.optim.SGD(p, lr=0.1, weight_decay=10.0)</code>. Take one step on each (with the SAME gradient) and print the weight norm. Predict which optimizer shrinks the weights more.`,
        steps: [
          { do: `Backprop a loss, then call <code>step()</code> for each optimizer on a fresh copy of the layer.`, why: `<code>weight_decay</code> adds $-\\eta\\lambda w$ to the update, so larger decay pulls weights harder toward zero.` },
          { do: `Compare <code>weight.norm()</code> before and after each step.`, why: `Predict: <code>weight_decay=10.0</code> produces a smaller post-step norm — that shrink IS L2 regularization.` }
        ],
        answer: `<pre><code>import copy
torch.manual_seed(0)
base = nn.Linear(4, 1)
x, y = torch.randn(8, 4), torch.randn(8, 1)

def step(wd):
    m = copy.deepcopy(base)
    opt = torch.optim.SGD(m.parameters(), lr=0.1, weight_decay=wd)
    opt.zero_grad()
    ((m(x) - y) ** 2).mean().backward()
    opt.step()
    return m.weight.norm().item()

print(round(step(0.0), 4))    # e.g. 0.7261  (no decay)
print(round(step(10.0), 4))   # SMALLER     (heavy decay shrinks weights more)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Create gradients by backpropagating a loss through <code>nn.Linear(4, 1)</code>. Compute the total gradient norm; then call <code>nn.utils.clip_grad_norm_(params, max_norm=0.5)</code> and recompute it. Print both. (Use seed 0.)`,
        steps: [
          { do: `Sum per-parameter <code>grad.norm()**2</code> and square-root for the total norm.`, why: `<code>clip_grad_norm_</code> rescales all gradients so this combined L2 norm is at most <code>max_norm</code>.` },
          { do: `Call <code>clip_grad_norm_</code> between <code>backward()</code> and <code>step()</code> and recompute the norm.`, why: `If the original norm exceeded 0.5, the clipped norm is exactly 0.5 — preventing a single huge update.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
m = nn.Linear(4, 1)
x, y = torch.randn(8, 4), torch.randn(8, 1)
((m(x) - y) ** 2).mean().backward()

def total_norm():
    return sum(p.grad.norm()**2 for p in m.parameters()) ** 0.5
print(round(float(total_norm()), 4))                       # original (e.g. > 0.5)
nn.utils.clip_grad_norm_(m.parameters(), max_norm=0.5)
print(round(float(total_norm()), 4))                       # 0.5 (clipped to the cap)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Simulate early stopping by hand: given the list <code>val = [0.9, 0.7, 0.55, 0.6, 0.62, 0.65]</code>, track the best (lowest) value and the epoch it occurred, stopping once validation has not improved for <code>patience=2</code> epochs. Print the best value and best epoch.`,
        steps: [
          { do: `Keep <code>best_val</code> and <code>since_best</code> counters, snapshotting on each new low.`, why: `In real training you would <code>copy.deepcopy(model.state_dict())</code> at each best — here we track the index instead.` },
          { do: `Break when <code>since_best >= patience</code>.`, why: `You must restore the BEST weights, not the last ones, which are worse after validation started rising.` }
        ],
        answer: `<pre><code>val = [0.9, 0.7, 0.55, 0.6, 0.62, 0.65]
best_val, best_epoch, since_best, patience = float("inf"), -1, 0, 2
for epoch, v in enumerate(val):
    if v < best_val - 1e-4:
        best_val, best_epoch, since_best = v, epoch, 0
    else:
        since_best += 1
        if since_best >= patience:
            print(f"early stop at epoch {epoch}")   # early stop at epoch 4
            break
print("best:", best_val, "at epoch", best_epoch)     # best: 0.55 at epoch 2</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build a small regularized block <code>nn.Sequential(nn.Linear(20, 32), nn.BatchNorm1d(32), nn.ReLU(), nn.Dropout(0.3), nn.Linear(32, 2))</code> and an <code>AdamW</code> optimizer with <code>weight_decay=1e-2</code>. Run ONE train step on <code>x = torch.randn(16, 20)</code>, <code>y = torch.randint(0, 2, (16,))</code> (seed 0), printing the loss; then switch to <code>eval()</code> and print the prediction shape under <code>torch.no_grad()</code>.`,
        steps: [
          { do: `Use <code>model.train()</code> + <code>zero_grad()</code> + <code>backward()</code> + <code>step()</code> for the train step, with <code>nn.CrossEntropyLoss</code>.`, why: `CrossEntropy wants raw logits and <code>long</code> class indices; AdamW applies decoupled (correct) weight decay.` },
          { do: `Call <code>model.eval()</code> and wrap inference in <code>torch.no_grad()</code>.`, why: `eval turns Dropout into a pass-through and BatchNorm onto running stats; no_grad skips graph bookkeeping at inference.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = nn.Sequential(nn.Linear(20, 32), nn.BatchNorm1d(32),
                      nn.ReLU(), nn.Dropout(0.3), nn.Linear(32, 2))
opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)
x = torch.randn(16, 20)
y = torch.randint(0, 2, (16,))

model.train()
opt.zero_grad()
loss = nn.CrossEntropyLoss()(model(x), y)
loss.backward(); opt.step()
print(round(loss.item(), 4))            # a finite loss near ln(2) ~= 0.69

model.eval()
with torch.no_grad():
    print(model(x).shape)               # torch.Size([16, 2])</code></pre>`
      }
    ]
  });

  window.CODE["pt-regularization"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A small model that stacks <b>three</b> regularizers — <code>BatchNorm1d</code>, <code>Dropout</code>, and decoupled weight decay via <code>AdamW</code> — plus a training loop with <b>early stopping</b> (track best validation loss, snapshot and restore the best <code>state_dict</code>) and <b>gradient clipping</b>. Watch the <code>model.train()</code> / <code>model.eval()</code> switches: that is the part everyone forgets. Runs as-is in Google Colab (torch is preinstalled).</p>`,
    code: `import copy
import torch
import torch.nn as nn

torch.manual_seed(0)

# --- tiny synthetic problem: few samples, many noise features (easy to overfit) ---
N_TRAIN, N_VAL, D = 64, 400, 200
def make(n):
    X = torch.randn(n, D)
    logits = 1.5 * X[:, 0] - 1.2 * X[:, 1]        # only 2 features matter; rest is noise
    y = (torch.rand(n) < torch.sigmoid(logits)).long()
    return X, y
Xtr, ytr = make(N_TRAIN)
Xva, yva = make(N_VAL)

# --- a model WITH batch norm + dropout (regularizers live INSIDE the model) ---
model = nn.Sequential(
    nn.Linear(D, 64),
    nn.BatchNorm1d(64),     # train: batch stats; eval: running stats  (mode-dependent!)
    nn.ReLU(),
    nn.Dropout(0.5),        # train: drops 50% of units; eval: pass-through (mode-dependent!)
    nn.Linear(64, 2),       # 2 logits; CrossEntropyLoss wants RAW logits + class indices
)

loss_fn = nn.CrossEntropyLoss()
# AdamW = decoupled weight decay = the CORRECT way to do L2 with Adam.
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)

# --- training loop with EARLY STOPPING + GRADIENT CLIPPING ---
best_val = float("inf")
best_state = copy.deepcopy(model.state_dict())   # snapshot of the BEST weights
patience, since_best = 15, 0

for epoch in range(200):
    # ---- train ----
    model.train()                                 # dropout ON, batchnorm uses batch stats
    optimizer.zero_grad()                         # grads accumulate -> always zero first
    logits = model(Xtr)
    loss = loss_fn(logits, ytr)
    loss.backward()
    nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)   # cap gradient size
    optimizer.step()

    # ---- validate ----
    model.eval()                                  # dropout OFF, batchnorm uses running stats
    with torch.no_grad():                         # no graph needed at eval -> save memory
        val_loss = loss_fn(model(Xva), yva).item()

    # ---- early stopping: keep the BEST weights, not the last ----
    if val_loss < best_val - 1e-4:
        best_val = val_loss
        best_state = copy.deepcopy(model.state_dict())   # new best -> snapshot it
        since_best = 0
    else:
        since_best += 1
        if since_best >= patience:
            print(f"early stop at epoch {epoch} (best val loss {best_val:.4f})")
            break

model.load_state_dict(best_state)                 # RESTORE the best weights before using
model.eval()
with torch.no_grad():
    val_acc = (model(Xva).argmax(1) == yva).float().mean().item()
print(f"restored best val loss = {best_val:.4f} | val accuracy = {val_acc:.3f}")
`
  };

  window.CODEVIZ["pt-regularization"] = {
    question: "Does regularization actually stop overfitting? Train the same tiny logistic model on few samples with many noise features, WITHOUT vs WITH L2 (weight decay), and plot validation loss over epochs.",
    charts: [{
      type: "line",
      title: "Validation loss over training: no regularization vs L2 (weight decay)",
      xlabel: "epoch",
      ylabel: "validation loss",
      series: [
        { name: "no regularization", color: "#ff7b72", points: [ [0,0.812],[5,0.854],[10,0.881],[15,0.901],[20,0.916],[25,0.930],[30,0.941],[35,0.951],[40,0.960],[45,0.968],[50,0.975],[55,0.982],[60,0.988],[65,0.994],[70,1.000],[75,1.005],[80,1.010],[85,1.014],[90,1.019],[95,1.023],[100,1.027],[105,1.031],[110,1.035],[115,1.038],[120,1.041],[125,1.045],[130,1.048],[135,1.051],[140,1.054],[145,1.057],[150,1.059],[155,1.062],[160,1.065],[165,1.067],[170,1.070],[175,1.072],[180,1.074],[185,1.077],[190,1.079],[195,1.081],[200,1.083],[205,1.085],[210,1.087],[215,1.089],[220,1.091],[225,1.093],[230,1.095],[235,1.097],[240,1.098],[245,1.100],[250,1.102],[255,1.104],[260,1.105],[265,1.107],[270,1.108],[275,1.110],[280,1.112],[285,1.113],[290,1.115],[295,1.116] ] },
        { name: "L2 (weight_decay=0.1)", color: "#4ea1ff", points: [ [0,0.812],[5,0.811],[10,0.811],[15,0.811],[20,0.811],[25,0.812],[30,0.812],[35,0.813],[40,0.813],[45,0.814],[50,0.814],[55,0.815],[60,0.815],[65,0.815],[70,0.816],[75,0.816],[80,0.817],[85,0.817],[90,0.818],[95,0.818],[100,0.819],[105,0.819],[110,0.820],[115,0.820],[120,0.820],[125,0.821],[130,0.821],[135,0.822],[140,0.822],[145,0.823],[150,0.823],[155,0.824],[160,0.824],[165,0.825],[170,0.825],[175,0.825],[180,0.826],[185,0.826],[190,0.827],[195,0.827],[200,0.828],[205,0.828],[210,0.829],[215,0.829],[220,0.829],[225,0.830],[230,0.830],[235,0.831],[240,0.831],[245,0.832],[250,0.832],[255,0.832],[260,0.833],[265,0.833],[270,0.834],[275,0.834],[280,0.834],[285,0.835],[290,0.835],[295,0.836] ] }
      ]
    }],
    caption: "Same model, same data. Without regularization (red) validation loss climbs from 0.81 to 1.12 as the model memorizes the noise features — classic overfitting (train loss keeps falling while val loss rises). With L2 weight decay (blue) the weights stay small and validation loss holds flat near 0.81. The growing gap between the curves is exactly what early stopping would catch.",
    code: `import numpy as np
rng = np.random.RandomState(0)

# tiny REAL overfitting setup: very few samples, mostly noise features
n_train, n_val, d = 30, 300, 400
def make(n):
    X = rng.randn(n, d)
    logits = 1.5*X[:,0] - 1.2*X[:,1]      # only 2 informative features; rest is noise
    y = (rng.rand(n) < 1/(1+np.exp(-logits))).astype(float)
    return X, y
Xtr, ytr = make(n_train)
Xva, yva = make(n_val)

def sigmoid(z): return 1/(1+np.exp(-np.clip(z, -30, 30)))
def bce(p, y):
    p = np.clip(p, 1e-9, 1-1e-9)
    return -np.mean(y*np.log(p) + (1-y)*np.log(1-p))

def train(l2, epochs=300, lr=0.5):
    w = np.zeros(d); b = 0.0; val = []
    for _ in range(epochs):
        p = sigmoid(Xtr @ w + b)
        g = p - ytr
        gw = Xtr.T @ g / n_train + l2 * w     # the +l2*w term IS weight decay / L2
        gb = g.mean()
        w -= lr*gw; b -= lr*gb
        val.append(bce(sigmoid(Xva @ w + b), yva))
    return val

val_no = train(l2=0.0)     # no regularization -> overfits, val loss rises
val_l2 = train(l2=0.1)     # L2 weight decay   -> val loss stays low

idx = range(0, 300, 5)     # subsample to 60 points
print("no_reg:", [round(val_no[i], 3) for i in idx])
print("l2    :", [round(val_l2[i], 3) for i in idx])
print("no_reg start->final:", round(val_no[0],3), "->", round(val_no[-1],3))   # 0.812 -> 1.117
print("l2     start->final:", round(val_l2[0],3), "->", round(val_l2[-1],3))    # 0.812 -> 0.836
`
  };
})();
