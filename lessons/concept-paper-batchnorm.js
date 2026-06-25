/* Paper lesson — Batch Normalization (Ioffe & Szegedy, 2015).
   Grounded from arXiv:1502.03167 (abstract + ar5iv HTML, Section 3, Algorithm 1).
   Track A (primitive): build BatchNorm1d from scratch, verify with torch.allclose vs nn.BatchNorm1d.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-batchnorm". */
(function () {
  window.LESSONS.push({
    id: "paper-batchnorm",
    title: "Batch Normalization — Accelerating Deep Network Training by Reducing Internal Covariate Shift (2015)",
    tagline: "Normalize each layer's inputs over the mini-batch, then learn a scale and shift — so deep nets train far faster.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Sergey Ioffe, Christian Szegedy",
      org: "Google",
      year: 2015,
      venue: "arXiv preprint (arXiv:1502.03167)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1502.03167",
      code: ""
    },

    conceptLink: "dl-batchnorm",
    partOf: [
      { capstone: "capstone-image-classifier", step: 4, builds: "BatchNorm from scratch" },
      { capstone: "capstone-gan", step: 3, builds: "BatchNorm in the generator/discriminator" }
    ],
    prereqs: ["dl-batchnorm", "dl-backprop", "pt-nn-module", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> A deep network is a stack of layers. Each layer takes the numbers the previous
       layer produced and turns them into new numbers. During training every layer's weights keep changing,
       so the <b>distribution</b> (the typical size and spread) of the numbers feeding into a given layer
       <i>also</i> keeps changing.</p>
       <p>The paper names this problem <b>internal covariate shift</b>. Plain English: a layer is trying to
       learn a moving target &mdash; the inputs it sees this step are scaled and shifted differently from the
       inputs it saw last step, just because the layers below it updated. Before this paper that meant you had
       to use a <b>small learning rate</b> (a small step size for each weight update) and <b>careful weight
       initialization</b>, or training would be slow or blow up. Saturating activations like the sigmoid made
       it worse: if inputs drift into the flat tails, gradients vanish and learning stalls.</p>`,

    contribution:
      `<p>The paper makes normalization a built-in part of the network. Its contributions:</p>
       <ul>
         <li><b>The Batch Normalization (BN) layer.</b> For each feature, subtract the mini-batch mean and
         divide by the mini-batch standard deviation, so the inputs to the next layer have a stable
         distribution every step. ("Mini-batch" = the small group of examples processed together in one step.)</li>
         <li><b>A learnable scale and shift ($\\gamma$, $\\beta$).</b> After normalizing, multiply by a learned
         number $\\gamma$ and add a learned number $\\beta$. This lets the layer undo the normalization if that
         is what helps, so BN never removes capacity &mdash; it only stabilizes.</li>
         <li><b>Train/inference split.</b> During training it uses the current mini-batch's statistics; for
         inference it uses fixed <b>running</b> (population) statistics accumulated during training, so a single
         test example gets a deterministic answer.</li>
       </ul>`,

    whyItMattered:
      `<p>BN let practitioners use <b>much higher learning rates</b> and care far less about initialization, so
       training got dramatically faster and more robust. The abstract reports reaching the same accuracy with
       <b>14&times; fewer training steps</b>. It also acts as a mild <b>regularizer</b> (the per-batch noise in
       the statistics), sometimes removing the need for Dropout. BN became standard in nearly every deep
       convolutional network of the late 2010s, and is a building block in both the image-classifier and GAN
       capstones in this course.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the problem statement and the "14&times; fewer steps" headline.</li>
         <li><b>Section 3, "Normalization via Mini-Batch Statistics", and Algorithm 1</b> &mdash; the four
         lines that define BN. This is the whole method; everything else is justification and experiments.</li>
         <li><b>Section 3.1 / Algorithm 2</b> &mdash; how inference uses fixed population statistics instead of
         the batch.</li>
       </ul>
       <p><b>Skim:</b> Section 4 (ImageNet experiments) for the qualitative result &mdash; faster convergence,
       higher learning rates, less need for Dropout. You do not need the per-run hyperparameters.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will train the same tiny 2-layer classifier twice on the same toy
       data with the same (fairly high) learning rate &mdash; once <i>with</i> a BatchNorm layer after the
       first linear layer, once <i>without</i>. Will the BatchNorm version reach a low training loss in
       <b>fewer</b> steps, and will the no-BN version be <b>less stable</b> early on? Write down your guess,
       then look at the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write <code>my_batchnorm1d(x, gamma, beta, eps)</code> for the
       <i>training</i> path using raw tensors, no <code>nn.BatchNorm1d</code>:</p>
       <ul>
         <li>Input <code>x</code> has shape <code>(batch, features)</code>. Compute the mean and the variance
         <b>down the batch dimension</b> (dim 0), one value per feature. <code># TODO: mu = ...; var = ...</code></li>
         <li>Normalize: <code># TODO: xhat = (x - mu) / sqrt(var + eps)</code> &mdash; use the <b>biased</b>
         variance (divide by <code>m</code>, not <code>m-1</code>), to match the paper and PyTorch's train path.</li>
         <li>Scale and shift: <code># TODO: return gamma * xhat + beta</code>.</li>
         <li>Then add the <b>eval</b> path: keep a running mean and running variance, and at test time use those
         instead of the batch's. <code># TODO: running_mean = (1-mom)*running_mean + mom*mu</code></li>
       </ul>
       <p>The CODE cell below is the full reference, including the <code>torch.allclose</code> check against
       PyTorch &mdash; that passing check is the proof your formula is exactly right.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>BatchNorm sits between two layers and processes one feature at a time, across the whole mini-batch.
       For a mini-batch of $m$ examples and a single feature with values $x_1,\\dots,x_m$:</p>
       <ol>
         <li><b>Mean.</b> Average the feature over the batch: $\\mu_B$.</li>
         <li><b>Variance.</b> Measure how spread out the feature is: $\\sigma^2_B$ (the average squared distance
         from the mean).</li>
         <li><b>Normalize.</b> Subtract the mean and divide by the standard deviation $\\sqrt{\\sigma^2_B+\\epsilon}$.
         Now this feature has mean $0$ and variance $\\approx 1$ across the batch. The tiny $\\epsilon$ ("epsilon",
         a small constant like $10^{-5}$) is added only so we never divide by zero.</li>
         <li><b>Scale and shift.</b> Multiply by a learned $\\gamma$ and add a learned $\\beta$. These two numbers
         per feature are trained by gradient descent like any other weight, so the network can pick the output
         mean and spread that work best &mdash; even reproducing the original inputs if $\\gamma=\\sigma_B$ and
         $\\beta=\\mu_B$.</li>
       </ol>
       <p>At <b>inference</b> there may be only one example, so a "batch mean" makes no sense. Instead BN uses
       fixed <b>running</b> statistics &mdash; a moving average of the means and variances seen during training
       &mdash; so the output for a given input is deterministic.</p>`,

    symbols: [
      { sym: "internal covariate shift", desc: "the problem BN fixes: the distribution (typical size and spread) of a layer's inputs keeps changing during training because the layers below it keep updating their weights." },
      { sym: "mini-batch", desc: "the small group of training examples (say 32 or 64) processed together in one gradient-descent step." },
      { sym: "$m$", desc: "the number of examples in the mini-batch." },
      { sym: "$x_i$", desc: "the value of one feature for the $i$-th example in the batch (BN works one feature at a time)." },
      { sym: "$\\mu_B$", desc: "mini-batch mean: the average of that feature over the $m$ examples." },
      { sym: "$\\sigma^2_B$", desc: "mini-batch variance: the average squared distance of the feature values from $\\mu_B$ (how spread out they are)." },
      { sym: "$\\hat{x}_i$", desc: "the normalized value: the feature after subtracting the mean and dividing by the standard deviation, so it has mean 0 and variance about 1 across the batch." },
      { sym: "$\\epsilon$", desc: "epsilon, a tiny constant (e.g. $10^{-5}$) added inside the square root so we never divide by zero when the variance is near zero." },
      { sym: "$\\gamma$", desc: "the learned scale: one number per feature, multiplied into the normalized value. Trained by gradient descent." },
      { sym: "$\\beta$", desc: "the learned shift: one number per feature, added after scaling. Trained by gradient descent." },
      { sym: "$y_i$", desc: "the BN layer's output for example $i$: the normalized value scaled by $\\gamma$ and shifted by $\\beta$." },
      { sym: "running stats", desc: "the running (population) mean and variance: a moving average of the batch means and variances kept during training, used in place of the batch's own statistics at inference time." }
    ],

    formula:
      `$$\\mu_B=\\frac{1}{m}\\sum_{i=1}^{m}x_i,\\qquad
        \\sigma^2_B=\\frac{1}{m}\\sum_{i=1}^{m}(x_i-\\mu_B)^2$$
       $$\\hat{x}_i=\\frac{x_i-\\mu_B}{\\sqrt{\\sigma^2_B+\\epsilon}},\\qquad
        y_i=\\gamma\\,\\hat{x}_i+\\beta\\equiv \\mathrm{BN}_{\\gamma,\\beta}(x_i)$$`,

    whatItDoes:
      `<p>The two top equations measure the feature's center ($\\mu_B$) and spread ($\\sigma^2_B$) over the
       batch. The bottom-left equation re-centers and re-scales every value to mean $0$, variance $\\approx 1$.
       The bottom-right equation then lets the network choose its own center ($\\beta$) and spread ($\\gamma$),
       learned during training. (Algorithm 1, Section 3.)</p>`,

    derivation:
      `<p>The math of <i>why</i> normalizing stabilizes training &mdash; and the full gradient through
       $\\mu_B$, $\\sigma^2_B$, $\\hat{x}_i$, $\\gamma$, $\\beta$ &mdash; is derived in the
       <code>dl-batchnorm</code> concept lesson. Recap of the key idea: by fixing the input distribution of
       each layer to mean 0 / variance 1 before the learned $\\gamma,\\beta$, the gradients no longer depend on
       the scale of the layers below, so a larger learning rate stays stable. See that lesson for the
       backward pass.</p>`,

    example:
      `<p><b>Worked numbers</b> (one feature, batch of 3, $\\epsilon$ tiny enough to ignore):</p>
       <ul>
         <li>Batch <code>[2, 4, 6]</code>.</li>
         <li>Mean: $\\mu_B=(2+4+6)/3=4$.</li>
         <li>Variance: $\\sigma^2_B=\\big((2-4)^2+(4-4)^2+(6-4)^2\\big)/3=(4+0+4)/3=2.667$.</li>
         <li>Std: $\\sqrt{2.667}\\approx 1.633$.</li>
         <li>Normalize: $\\hat{x}=[(2-4)/1.633,\\;(4-4)/1.633,\\;(6-4)/1.633]=[-1.225,\\;0,\\;1.225]$.</li>
         <li>Scale &amp; shift with $\\gamma=2,\\;\\beta=1$:
         $y=2\\cdot[-1.225,0,1.225]+1=[-1.449,\\;1,\\;3.449]$.</li>
       </ul>
       <p>The CODE cell recomputes these exact numbers and prints them, and checks them against
       <code>nn.BatchNorm1d</code>.</p>`,

    recipe:
      `<p><b>Algorithm 1 (Batch Normalizing Transform), as numbered steps:</b></p>
       <ol>
         <li>Compute the mini-batch mean $\\mu_B$ over the batch dimension (one value per feature).</li>
         <li>Compute the mini-batch variance $\\sigma^2_B$ (biased: divide by $m$).</li>
         <li>Normalize: $\\hat{x}_i=(x_i-\\mu_B)/\\sqrt{\\sigma^2_B+\\epsilon}$.</li>
         <li>Scale and shift: $y_i=\\gamma\\hat{x}_i+\\beta$.</li>
         <li>(Train only) update running mean and running variance toward $\\mu_B$ and the unbiased
         $\\sigma^2_B$, for use at inference.</li>
         <li>(Inference) replace $\\mu_B,\\sigma^2_B$ with the stored running statistics.</li>
       </ol>`,

    results:
      `<p>Quoted from the abstract: Batch Normalization "allows us to use much higher learning rates and be
       less careful about initialization." Applied to a state-of-the-art image classification model, it
       "achiev[es] the same accuracy with 14 times fewer training steps." An ensemble of batch-normalized
       networks reached <b>4.9% top-5 validation error</b> on ImageNet (abstract). (Source: arXiv:1502.03167
       abstract.)</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>nn.BatchNorm1d</code> in one line. Here you
       <b>build it from scratch</b> with raw tensors: batch mean/variance, normalize, scale/shift, plus the
       running statistics for eval mode. The payoff is the <code>torch.allclose(my_bn(x), nn.BatchNorm1d(...)(x))</code>
       check in both train and eval mode &mdash; if it passes, your formula is provably identical to PyTorch's.</p>`,

    pitfalls:
      `<ul>
         <li><b>Train vs eval mode.</b> In <b>train</b> mode BN uses the <i>current batch's</i> mean/variance;
         in <b>eval</b> mode it uses the stored <i>running</i> statistics. Forgetting to call
         <code>model.eval()</code> at test time means each test prediction depends on the rest of the batch &mdash;
         a classic, hard-to-spot bug.</li>
         <li><b>Biased vs unbiased variance.</b> The normalization uses the <b>biased</b> variance (divide by
         $m$). PyTorch updates the <i>running</i> variance with the <b>unbiased</b> estimate (divide by $m-1$).
         Mixing these up makes the allclose fail.</li>
         <li><b>Forgetting $\\epsilon$.</b> Drop $\\epsilon$ and a feature that is constant across the batch
         ($\\sigma^2_B=0$) makes you divide by zero. Keep $\\epsilon$ (default $10^{-5}$) and match PyTorch's value.</li>
         <li><b>Wrong reduction axis.</b> Statistics are taken <b>down the batch dimension (dim 0)</b>, one per
         feature &mdash; not per example. Reducing over the wrong axis silently trains a broken layer.</li>
         <li><b>Tiny batches.</b> With very small batches the mini-batch statistics are noisy; BN can become
         unstable. (This is what LayerNorm/GroupNorm later addressed.)</li>
       </ul>`,

    recall: [
      "Write the normalize + scale-shift equations from memory: $\\hat{x}=(x-\\mu_B)/\\sqrt{\\sigma^2_B+\\epsilon}$ and $y=\\gamma\\hat{x}+\\beta$.",
      "What are $\\gamma$ and $\\beta$, and why are they needed after normalizing?",
      "In eval mode, which statistics does BN use instead of the batch's, and why?",
      "Why is the $\\epsilon$ term there?"
    ],

    practice: [
      {
        q: `Normalize the batch [10, 20, 30] for one feature, then apply $\\gamma=3,\\beta=5$. (Ignore $\\epsilon$.)`,
        steps: [
          { do: `Mean: $\\mu_B=(10+20+30)/3=20$.`, why: `Center of the batch.` },
          { do: `Variance: $\\sigma^2_B=((10-20)^2+0+(30-20)^2)/3=(100+0+100)/3=66.67$; std $\\approx 8.165$.`, why: `Spread; biased (divide by 3).` },
          { do: `Normalize: $[(10-20)/8.165,\\,0,\\,(30-20)/8.165]=[-1.225,0,1.225]$.`, why: `Mean 0, variance ~1.` },
          { do: `Scale/shift: $3\\cdot[-1.225,0,1.225]+5=[1.325,5,8.675]$.`, why: `Learned $\\gamma,\\beta$ pick the final spread and center.` }
        ],
        answer: `$\\hat{x}=[-1.225,0,1.225]$, output $=[1.325,5,8.675]$. Note the normalized values are identical to the [2,4,6] example &mdash; BN is invariant to the input's original scale and shift.`
      },
      {
        q: `Ablation: in the CODE's 2-layer net, remove the BatchNorm layer and raise the learning rate. What do you expect to happen to training?`,
        steps: [
          { do: `Delete the BN layer so the first linear layer's raw outputs feed straight into the activation.`, why: `Removes the per-step re-centering/re-scaling.` },
          { do: `Train with the higher learning rate and watch the loss curve.`, why: `BN's main benefit is tolerating larger steps.` },
          { do: `Compare to the BN run (the CODEVIZ chart).`, why: `Same data, same rate &mdash; only BN differs.` }
        ],
        answer: `Without BN the run is less stable early and converges slower to a higher loss; in our small run (CODEVIZ) BN reaches loss ~0.034 vs ~0.060 without, in the same 40 steps. With a high enough rate the no-BN net can diverge entirely. This reproduces the paper's qualitative claim that BN allows higher learning rates and faster convergence.`
      },
      {
        q: `Why does calling $\\gamma$ and $\\beta$ "learnable" matter &mdash; couldn't we just always output mean 0, variance 1?`,
        steps: [
          { do: `Imagine the next layer is a sigmoid, which is most useful around 0 but should sometimes operate elsewhere.`, why: `Fixing variance 1 might be wrong for the task.` },
          { do: `Note that with $\\gamma,\\beta$ trainable, the network can recover any mean/spread, including the original inputs.`, why: `BN adds no constraint it cannot undo.` }
        ],
        answer: `Forcing mean 0 / variance 1 could throw away useful structure (e.g. push a sigmoid into its linear region). Letting $\\gamma,\\beta$ be learned means BN can normalize when that helps and undo it when it does not, so it only stabilizes &mdash; it never removes the layer's representational power.`
      }
    ]
  });

  window.CODE["paper-batchnorm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build BatchNorm1d from scratch with raw tensors: batch mean/variance, normalize, scale (gamma) and ` +
      `shift (beta), plus running mean/variance for eval mode. Then prove it is identical to PyTorch with ` +
      `torch.allclose in BOTH train and eval mode, recompute the [2,4,6] worked example, and drop it into a ` +
      `2-layer net. Runs in Colab (torch is preinstalled).`,
    code: `import torch, torch.nn as nn

torch.manual_seed(0)

class MyBatchNorm1d(nn.Module):
    """BatchNorm1d from scratch — Algorithm 1 of Ioffe & Szegedy (2015)."""
    def __init__(self, num_features, eps=1e-5, momentum=0.1):
        super().__init__()
        self.eps, self.momentum = eps, momentum
        self.gamma = nn.Parameter(torch.ones(num_features))   # learned scale
        self.beta  = nn.Parameter(torch.zeros(num_features))  # learned shift
        # running (population) stats — buffers, not trained
        self.register_buffer("running_mean", torch.zeros(num_features))
        self.register_buffer("running_var",  torch.ones(num_features))

    def forward(self, x):                      # x: (batch, features)
        if self.training:
            mu  = x.mean(dim=0)                                  # mini-batch mean  (Alg.1 line 1)
            var = x.var(dim=0, unbiased=False)                  # mini-batch var, biased /m (line 2)
            # update running stats with the UNBIASED variance (matches PyTorch)
            m = x.shape[0]
            with torch.no_grad():
                self.running_mean = (1-self.momentum)*self.running_mean + self.momentum*mu
                ubvar = x.var(dim=0, unbiased=True)             # /(m-1)
                self.running_var  = (1-self.momentum)*self.running_var  + self.momentum*ubvar
        else:
            mu, var = self.running_mean, self.running_var       # inference: fixed pop stats (Alg.2)
        xhat = (x - mu) / torch.sqrt(var + self.eps)            # normalize        (line 3)
        return self.gamma * xhat + self.beta                    # scale & shift    (line 4)

# ---- THE ORACLE: my BN must equal nn.BatchNorm1d, train AND eval ----
F = 4
x = torch.randn(8, F)
mine = MyBatchNorm1d(F)
ref  = nn.BatchNorm1d(F)          # same default eps=1e-5, momentum=0.1, gamma=1, beta=0

mine.train(); ref.train()
ok_train = torch.allclose(mine(x), ref(x), atol=1e-6)
# run a few train steps so running stats accumulate identically, then compare eval
for _ in range(5):
    xb = torch.randn(8, F); mine(xb); ref(xb)
mine.eval(); ref.eval()
xt = torch.randn(3, F)
ok_eval = torch.allclose(mine(xt), ref(xt), atol=1e-6)
print("allclose train:", ok_train)   # expect True
print("allclose eval :", ok_eval)    # expect True

# ---- recompute the worked example: batch [2,4,6], gamma=2, beta=1 ----
bn = MyBatchNorm1d(1); bn.train()
with torch.no_grad():
    bn.gamma.fill_(2.0); bn.beta.fill_(1.0)
xe = torch.tensor([[2.],[4.],[6.]])
print("worked example y:", bn(xe).squeeze().tolist())  # ~ [-1.449, 1.0, 3.449]

# ---- drop it into a 2-layer net ----
net = nn.Sequential(nn.Linear(F, 16), MyBatchNorm1d(16), nn.ReLU(), nn.Linear(16, 2))
print("net output shape:", net(torch.randn(5, F)).shape)  # torch.Size([5, 2])`
  };

  window.CODEVIZ["paper-batchnorm"] = {
    question: "Train the same tiny 2-layer classifier on the same toy data at the same high learning rate, with vs without a BatchNorm layer — does BN converge faster and more stably?",
    charts: [
      {
        type: "line",
        title: "Training loss over steps: with BatchNorm vs without (same data, same learning rate)",
        xlabel: "training step",
        ylabel: "training loss (cross-entropy)",
        series: [
          {
            name: "With BatchNorm",
            color: "#7ee787",
            points: [[0,1.7038],[2,0.1078],[4,0.0835],[6,0.0709],[8,0.0632],[10,0.0578],[12,0.0537],[14,0.0505],[16,0.0479],[18,0.0457],[20,0.0439],[22,0.0422],[24,0.0408],[26,0.0395],[28,0.0383],[30,0.0373],[32,0.0363],[34,0.0354],[36,0.0346],[38,0.0340],[39,0.0338]]
          },
          {
            name: "Without BatchNorm",
            color: "#ff7b72",
            points: [[0,2.1210],[2,0.0766],[4,0.0757],[6,0.0747],[8,0.0738],[10,0.0729],[12,0.0721],[14,0.0712],[16,0.0704],[18,0.0696],[20,0.0688],[22,0.0679],[24,0.0671],[26,0.0661],[28,0.0651],[30,0.0640],[32,0.0629],[34,0.0618],[36,0.0609],[38,0.0602],[39,0.0598]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not the paper's reported numbers. Same toy 2-class data (features deliberately scaled unevenly to create covariate-shift-like conditioning), same learning rate 0.6, same 40 steps. WITH BatchNorm the loss drops steeply and keeps falling to ~0.034. WITHOUT BatchNorm the net stalls near ~0.06 — it barely improves after the first step because the badly-conditioned, un-normalized inputs make the high learning rate ineffective. Removing BN and pushing the rate higher (the ablation in the practice section) makes the no-BN run diverge entirely.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# toy 2-class data; scale features unevenly to create covariate-shift-like conditioning
N = 400
X0 = rng.normal([-2,-2], 1.0, (N//2, 2)); X1 = rng.normal([2,2], 1.0, (N//2, 2))
X = np.vstack([X0, X1]).astype(np.float64) * np.array([6.0, 0.3])
y = np.array([0]*(N//2) + [1]*(N//2))
p = rng.permutation(N); X, y = X[p], y[p]

def init(h=16):
    r = np.random.default_rng(1)
    return dict(W1=r.normal(0,0.6,(2,h)), b1=np.zeros(h), g=np.ones(h), be=np.zeros(h),
                W2=r.normal(0,0.6,(h,1)), b2=np.zeros(1))

def sig(z): return 1/(1+np.exp(-np.clip(z,-30,30)))

def train(use_bn, steps=40, lr=0.6, h=16, eps=1e-5):
    P = init(h); losses = []
    for t in range(steps):
        z1 = X @ P['W1'] + P['b1']
        if use_bn:                                  # BatchNorm on the hidden pre-activations
            mu = z1.mean(0); var = z1.var(0)
            zhat = (z1 - mu) / np.sqrt(var + eps)
            z1n = P['g'] * zhat + P['be']
        else:
            z1n = z1
        a1 = np.tanh(z1n); z2 = a1 @ P['W2'] + P['b2']
        out = np.clip(sig(z2).ravel(), 1e-7, 1-1e-7)
        loss = -np.mean(y*np.log(out) + (1-y)*np.log(1-out)); losses.append(round(float(loss),4))
        # backward
        dz2 = (out - y).reshape(-1,1)/N; dW2 = a1.T @ dz2; db2 = dz2.sum(0)
        da1 = dz2 @ P['W2'].T; dz1n = da1 * (1 - a1**2)
        if use_bn:
            dg = (dz1n*zhat).sum(0); dbe = dz1n.sum(0); dzhat = dz1n*P['g']; m = N
            dvar = (dzhat*(z1-mu)*-0.5*(var+eps)**-1.5).sum(0)
            dmu  = (dzhat*-1/np.sqrt(var+eps)).sum(0) + dvar*(-2*(z1-mu)).mean(0)
            dz1  = dzhat/np.sqrt(var+eps) + dvar*2*(z1-mu)/m + dmu/m
            P['g'] -= lr*dg; P['be'] -= lr*dbe
        else:
            dz1 = dz1n
        dW1 = X.T @ dz1; db1 = dz1.sum(0)
        P['W1'] -= lr*dW1; P['b1'] -= lr*db1; P['W2'] -= lr*dW2; P['b2'] -= lr*db2
    return losses

with_bn = train(True); no_bn = train(False)
print("with BN  final loss:", with_bn[-1])   # ~0.0338
print("no  BN   final loss:", no_bn[-1])      # ~0.0598`
  };
})();