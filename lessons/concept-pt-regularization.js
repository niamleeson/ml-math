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
        q: `Your validation predictions change a little every time you run them on the same input, and they are worse than your training metrics suggest. The model has <code>nn.Dropout(0.5)</code> and <code>nn.BatchNorm1d</code> layers. What did you most likely forget, and what is the fix?`,
        steps: [
          { do: `Note the symptom: <b>non-deterministic</b> predictions on identical input.`, why: `Only a training-mode layer injects randomness; at eval everything should be deterministic.` },
          { do: `Recall that dropout randomly zeros activations and batch norm uses batch statistics — but only while the module is in <code>train()</code> mode.`, why: `These layers are mode-dependent; leaving them in train mode keeps the noise on.` }
        ],
        answer: `You forgot <code>model.eval()</code> before evaluating. Dropout was still randomly zeroing units (hence the changing outputs) and batch norm was using batch statistics instead of its running averages. <b>Fix:</b> call <code>model.eval()</code> (and wrap inference in <code>torch.no_grad()</code>), then <code>model.train()</code> when you resume training.`
      },
      {
        q: `You want true L2 regularization with the Adam family. Why is <code>optim.Adam(params, weight_decay=1e-2)</code> not quite what you want, and what should you use instead?`,
        steps: [
          { do: `Recall that classic L2 adds $\\lambda \\lVert w \\rVert^2$ to the loss, so the decay term passes through Adam's per-parameter adaptive scaling.`, why: `Adam rescales every gradient component, which distorts the intended uniform shrink.` },
          { do: `Recall that <code>AdamW</code> <i>decouples</i> the decay: it subtracts $\\eta\\,\\lambda\\,w$ directly, outside the adaptive update.`, why: `That gives the clean weight-shrink the L2 penalty is supposed to produce.` }
        ],
        answer: `With plain <code>Adam</code> the <code>weight_decay</code> gets entangled with the adaptive learning-rate scaling, so it is not the L2 you intended. Use <code>optim.AdamW(params, lr=1e-3, weight_decay=1e-2)</code>, which applies decoupled weight decay correctly.`
      },
      {
        q: `Your early-stopping loop stops 5 epochs after the best validation loss, then you save and deploy <code>model</code> as-is. Why might the deployed model be worse than the best one you saw, and how do you fix it?`,
        steps: [
          { do: `Note that you keep training (and updating weights) for the 5 patience epochs after the best point.`, why: `Those extra steps move the weights past the best-generalizing state — validation loss was rising.` },
          { do: `Recall that you must snapshot <code>model.state_dict()</code> at each new best and reload it at the end.`, why: `Otherwise the final in-memory weights are the worse, later ones.` }
        ],
        answer: `The weights in memory are from 5 epochs <i>after</i> the best, where validation loss had already risen. <b>Fix:</b> save <code>best_state = copy.deepcopy(model.state_dict())</code> whenever validation loss hits a new low, and <code>model.load_state_dict(best_state)</code> before saving / deploying — restore the BEST weights, not the last ones.`
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
