(function () {
  window.LESSONS.push({
    id: "unl-cpc",
    title: "Contrastive Predictive Coding (CPC v2)",
    tagline: "Learn representations by predicting the future in latent space — and judge the prediction by picking the true future out of a crowd of negatives.",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["mod-contrastive", "dl-attention", "dl-cosine-similarity", "dl-cross-entropy", "fs-metric-learning"],
    bigIdea:
      `<p>Suppose nobody labels your data. How do you still learn a useful representation? CPC (Contrastive Predictive Coding) has a clever answer: <b>predict the future</b>.</p>
       <p>Not the raw future pixels — those are noisy and full of detail you do not care about. Instead, predict the <i>future in latent space</i>: a short summary vector of what comes next.</p>
       <p>And do not predict it by regression. Predicting an exact vector tempts the model to copy low-level texture. Instead, make it a <b>multiple-choice quiz</b>: here is the true future latent, here are many wrong ones (the "negatives"); score them all and the model must point at the true one. That quiz is a contrastive loss called <b>InfoNCE (Information Noise-Contrastive Estimation)</b>.</p>
       <p>For images, CPC splits a picture into a grid of overlapping patches and predicts patches <i>below and to the right</i> from the patches <i>above and to the left</i> — the same predict-what-comes-next idea, but in 2-D.</p>`,
    buildup:
      `<p>Three moving parts. Read them in order.</p>
       <ol>
         <li><b>Encoder</b> $g_{\\text{enc}}$. It turns each timestep (a patch, an audio window, a pixel-row) into a latent vector $z_t = g_{\\text{enc}}(x_t)$. This throws away noise and keeps a compact summary.</li>
         <li><b>Autoregressive context</b> $g_{\\text{ar}}$. It walks through the latents up to now and squeezes the whole past into one context vector $c_t = g_{\\text{ar}}(z_{\\le t})$. In practice $g_{\\text{ar}}$ is a GRU (Gated Recurrent Unit) or a masked Transformer [dl-attention].</li>
         <li><b>Prediction heads</b> $W_k$, one per step $k$ into the future. From the context $c_t$ we form a guess $W_k\\,c_t$ at the latent $z_{t+k}$ that is $k$ steps ahead.</li>
       </ol>
       <p>Now the contrastive part. We do not ask "is $W_k c_t$ exactly equal to $z_{t+k}$?". We collect a set of candidates: the one true future latent $z_{t+k}$ plus a pile of <b>negatives</b> $z_j$ — latents sampled from other times or other images. The model scores each candidate and must rank the true one first. This is the same NT-Xent / InfoNCE idea you saw in the contrastive-learning lesson [mod-contrastive], here used to match a prediction to its target rather than two augmented views.</p>
       <p>CPC <b>v2</b> (Hénaff et al., 2019) keeps the v1 recipe (Oord et al., 2018) but scales it up: a much bigger ResNet encoder, layer normalization instead of batch normalization, patch-based data augmentation, and predicting in <i>more</i> directions and over more offsets. Those changes pushed self-supervised features to strong low-label ImageNet accuracy — competitive with supervised training while using a fraction of the labels.</p>`,
    symbols: [
      { sym: "$x_t$", desc: "the input at timestep $t$ — an audio window, a patch of an image, or one row of pixels." },
      { sym: "$z_t = g_{\\text{enc}}(x_t)$", desc: "the latent (a short vector) for timestep $t$, produced by the encoder $g_{\\text{enc}}$. It keeps the useful summary and drops noise." },
      { sym: "$c_t = g_{\\text{ar}}(z_{\\le t})$", desc: "the context: one vector that summarizes all latents up to and including time $t$. Made by an autoregressive net $g_{\\text{ar}}$ (a GRU or masked Transformer)." },
      { sym: "$z_{t+k}$", desc: "the TRUE future latent, $k$ steps ahead. This is the candidate we want the model to pick out." },
      { sym: "$W_k$", desc: "the prediction head for offset $k$: a learned matrix. $W_k\\,c_t$ is the model's guess at the future latent $k$ steps ahead. One $W_k$ per offset." },
      { sym: "$z_j \\in N$", desc: "a negative: a latent drawn from the negative set $N$ (other times or other images) that is NOT the true future. The model must score it lower." },
      { sym: "$z_{t+k}^\\top W_k c_t$", desc: "the score (a single number) for the true future: a bilinear match between the future latent and the predicted future. Higher means a better match. The same form scores each negative." },
      { sym: "$\\mathbb{E}$", desc: "the expectation (average) over all sampled timesteps and negative sets." },
      { sym: "$I(z_{t+k}; c_t)$", desc: "the mutual information between the future latent and the context: how many bits the context tells you about the future. InfoNCE pushes this up." }
    ],
    formula: `$$ \\mathcal{L}_{\\text{InfoNCE}} = -\\,\\mathbb{E}\\!\\left[\\, \\log \\frac{\\exp\\!\\big(z_{t+k}^\\top W_k\\, c_t\\big)}{\\sum_{z_j \\in N} \\exp\\!\\big(z_j^\\top W_k\\, c_t\\big)} \\,\\right] $$`,
    whatItDoes:
      `<p>Read the fraction as a softmax over candidates, exactly like a classifier that has to name the one correct class.</p>
       <ul>
         <li>The numerator $\\exp(z_{t+k}^\\top W_k c_t)$ is the score of the <b>true</b> future latent. We want it big.</li>
         <li>The denominator sums $\\exp(z_j^\\top W_k c_t)$ over the whole candidate set $N$, which <b>includes</b> the true one plus all the negatives. So the fraction is the model's probability of choosing the true future among them.</li>
         <li>Taking $-\\log$ of that probability is the cross-entropy [dl-cross-entropy] of a one-correct-answer classification. Minimizing it means: make the true future score high and every negative's score low.</li>
       </ul>
       <p>The score $z^\\top W_k c_t$ is a <b>bilinear</b> form: it is a dot product between a candidate latent $z$ and the predicted future $W_k c_t$. If the latents are normalized, it is a scaled cosine similarity [dl-cosine-similarity] — "how aligned is this candidate with what I predicted?".</p>
       <p>One head $W_k$ per offset $k$ means the model makes several predictions from the same context — 1 step ahead, 2 steps ahead, and so on — and pays an InfoNCE penalty on each.</p>`,
    derivation:
      `<p>Why does this loss learn anything useful? Because <b>minimizing InfoNCE maximizes a lower bound on the mutual information</b> $I(z_{t+k}; c_t)$ between the future and the context. Here is the chain of reasoning.</p>
       <p>The candidate set $N$ has one positive drawn from the true joint distribution $p(z_{t+k}, c_t)$ and $|N|-1$ negatives drawn independently from $p(z)$. The optimal score for telling positive from negatives is proportional to the density ratio $\\frac{p(z_{t+k}\\mid c_t)}{p(z_{t+k})}$. The bilinear term $\\exp(z^\\top W_k c_t)$ is trained to model exactly that ratio.</p>
       <p>Plug the optimal scorer into the loss and the algebra gives</p>
       $$ I(z_{t+k}; c_t) \\;\\ge\\; \\log|N| - \\mathcal{L}_{\\text{InfoNCE}}. $$
       <p>Read it carefully. Driving the loss $\\mathcal{L}_{\\text{InfoNCE}}$ <i>down</i> pushes the lower bound on $I$ <i>up</i>. So the model is forced to make the context carry as much information about the future as it can — which is precisely a representation that "understands" the signal. The $\\log|N|$ term also explains a practical fact: <b>more negatives raise the ceiling of the bound</b>, so bigger negative sets give a tighter estimate and usually better features.</p>
       <p>The intuition: to win a hard multiple-choice quiz about the future, knowing only low-level texture is not enough — the context has to capture the slow, high-level structure (the phoneme, the object, the stroke) that actually predicts what comes next. That high-level structure is the representation we wanted all along.</p>`,
    example:
      `<p>One prediction, one offset, with tiny 1-D "latents" so the arithmetic is visible. Suppose the predicted future is $W_k c_t = 2.0$ (just a number here), the true future latent is $z_{t+k} = 1.8$, and there are two negatives $z = 0.3$ and $z = -1.0$. Scores are products $z \\cdot (W_k c_t)$.</p>
       <ul class="steps">
         <li>True score: $1.8 \\times 2.0 = 3.6$. Negative scores: $0.3 \\times 2.0 = 0.6$ and $-1.0 \\times 2.0 = -2.0$.</li>
         <li>Exponentiate: $e^{3.6} \\approx 36.6$, $e^{0.6} \\approx 1.82$, $e^{-2.0} \\approx 0.14$. Sum $\\approx 38.6$.</li>
         <li>Probability of the true future $= 36.6 / 38.6 \\approx 0.948$.</li>
         <li>Loss $= -\\log(0.948) \\approx 0.053$. Small, because the true future already dominates.</li>
         <li>Now imagine a confusing negative at $z = 1.7$ (almost as aligned as the true one). Its score is $1.7 \\times 2.0 = 3.4$, $e^{3.4} \\approx 30.0$. The true probability drops to $36.6 / (36.6 + 30.0 + 1.82 + 0.14) \\approx 0.534$, and the loss climbs to $-\\log(0.534) \\approx 0.627$. <b>Hard negatives are where the learning happens.</b></li>
       </ul>`,
    application:
      `<p>CPC started in <b>audio</b>: predict the next latent of a speech waveform and you learn phoneme- and speaker-aware features with no transcripts. The same recipe carries to <b>images</b> (predict patches below/right from above/left), <b>text</b>, <b>video</b>, and <b>reinforcement-learning</b> states.</p>
       <p>CPC v2's headline result was <b>label efficiency</b>: pretrain on unlabeled ImageNet, then fine-tune a linear or small classifier on a tiny labeled fraction and still reach strong top-1 accuracy. That is the dream for domains where labels are expensive — medical imaging, audio, satellite — but raw data is plentiful. The predict-the-future-contrastively idea also underlies later self-supervised systems and sits in the same family as SimCLR-style view-contrastive methods [mod-contrastive].</p>`,
    whenToUse:
      `<p><b>Reach for CPC when your data has sequential or spatial structure and almost no labels</b> — audio streams, video, time series, or images viewed as a grid of patches — and you want a pretrained encoder you can fine-tune with very few labels. The self-supervised signal is "predict what comes next in latent space", so you need data where the future is partly predictable from the past.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>View-contrastive methods (SimCLR-style) [mod-contrastive]</b> — when your signal is naturally <i>ordered</i> (a sequence) rather than a single image you augment two ways. CPC contrasts a predicted future against negatives; SimCLR contrasts two augmented views of the same item.</li>
         <li><b>A masked-reconstruction model (predict the missing pixels/tokens exactly)</b> — when you want to avoid wasting capacity on low-level detail. CPC's contrastive target ignores pixel-perfect reconstruction and keeps only what helps tell the true future from negatives.</li>
         <li><b>Plain supervised training</b> — when labels are scarce but unlabeled data is abundant; CPC turns that unlabeled pile into a pretraining signal.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>You already have plenty of labels — supervised training is simpler and usually wins.</li>
         <li>The future is essentially unpredictable from the past (no temporal/spatial structure) — there is nothing for CPC to latch onto.</li>
         <li>Compute is tight — many predictions over many offsets, large negative sets, and a big encoder make CPC v2 expensive.</li>
       </ul>`,
    pitfalls:
      `<ul>
         <li><b>Trivial shortcuts from leaked low-level statistics.</b> Overlapping patches share edges, color, and brightness, so the model can "predict the future" by matching texture or mean intensity instead of learning structure. <b>Fix:</b> normalize each patch (per-patch layer normalization / color and contrast jitter) so cheap statistics no longer leak across patch boundaries — this was a key CPC v2 change.</li>
         <li><b>Too-easy negatives.</b> If negatives are obviously different from the target, the quiz is trivial and the loss teaches nothing. <b>Fix:</b> draw many negatives, and draw them from the same image / nearby times so they are genuine distractors; more negatives also tighten the mutual-information bound.</li>
         <li><b>Predicting too far ahead.</b> The far future is barely predictable, so distant offsets give noisy, near-chance gradients. <b>Fix:</b> keep the set of offsets $k$ modest and weight or cap how far you predict.</li>
         <li><b>Compute of many predictions.</b> One InfoNCE term per offset per position, each over a big negative set, gets expensive fast. <b>Fix:</b> share negatives across positions, reuse the encoder's features, and tune the number of offsets vs. batch size.</li>
         <li><b>Forgetting to normalize the bilinear score.</b> Unnormalized latents let a few large-magnitude dimensions dominate the dot product. <b>Fix:</b> L2-normalize latents (turning the score into a scaled cosine similarity) and use a temperature.</li>
       </ul>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // True future score vs hardest negative score; InfoNCE softmax probability of the true one.
      var st = { trueScore: 3.6, hard: 1.0, temp: 1.0 };
      var fixedNegs = [0.6, -2.0]; // two extra easy negatives (already as score values)
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 250; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function draw() {
        var c = C();
        ctx.clearRect(0, 0, 640, 250);
        var scores = [st.trueScore, st.hard].concat(fixedNegs);
        var t = st.temp;
        var ex = scores.map(function (v) { return Math.exp(v / t); });
        var Z = ex.reduce(function (a, b) { return a + b; }, 0);
        var probs = ex.map(function (e) { return e / Z; });
        var loss = -Math.log(probs[0]);
        var labels = ["true future", "hard negative", "easy neg", "easy neg"];
        var cols = [c.accent2, c.warn, c.dim, c.dim];
        var x0 = 60, w = 110, gap = 24, base = 190, h = 130;
        ctx.font = "12px sans-serif"; ctx.textBaseline = "alphabetic";
        for (var i = 0; i < probs.length; i++) {
          var bh = probs[i] * h;
          ctx.fillStyle = cols[i];
          ctx.fillRect(x0 + i * (w + gap), base - bh, w, bh);
          ctx.fillStyle = c.ink; ctx.textAlign = "center";
          ctx.fillText(probs[i].toFixed(2), x0 + i * (w + gap) + w / 2, base - bh - 6);
          ctx.fillStyle = c.dim;
          ctx.fillText(labels[i], x0 + i * (w + gap) + w / 2, base + 16);
        }
        ctx.strokeStyle = c.border; ctx.beginPath(); ctx.moveTo(40, base); ctx.lineTo(620, base); ctx.stroke();
        ctx.fillStyle = c.ink; ctx.textAlign = "start"; ctx.font = "13px sans-serif";
        ctx.fillText("softmax over candidate scores (InfoNCE picks the true future)", 40, 30);
        return { loss: loss, p: probs[0] };
      }
      function slider(label, key, min, max, step) {
        var row = document.createElement("div"); row.style.margin = "6px 0";
        var lab = document.createElement("label"); lab.style.display = "block"; lab.textContent = label;
        var inp = document.createElement("input"); inp.type = "range"; inp.min = min; inp.max = max; inp.step = step; inp.value = st[key];
        inp.addEventListener("input", function () { st[key] = parseFloat(inp.value); render(); });
        row.appendChild(lab); row.appendChild(inp); host.appendChild(row);
      }
      slider("true future score (z·Wc for the real next latent)", "trueScore", -1, 6, 0.1);
      slider("hard negative score (a confusing distractor)", "hard", -1, 6, 0.1);
      slider("temperature", "temp", 0.3, 3, 0.05);
      var rd = document.createElement("div"); rd.className = "out"; rd.style.marginTop = "6px"; host.appendChild(rd);
      function render() {
        var r = draw();
        rd.innerHTML = "InfoNCE probability of the true future = <b>" + r.p.toFixed(3) +
          "</b>, loss = &minus;log(prob) = <b>" + r.loss.toFixed(3) +
          "</b>. Raise the hard negative toward the true score and watch the loss climb: the model has to keep the true future clearly ahead of every distractor.";
      }
      render();
    },
    practice: [
      {
        q: `A CPC step has a true future score $z_{t+k}^\\top W_k c_t = 2.0$ and three negatives with scores $1.0, 0.0, -1.0$. Find the InfoNCE loss for this position (use natural log).`,
        steps: [
          { do: `Exponentiate every score, including the true one: $e^{2.0}, e^{1.0}, e^{0.0}, e^{-1.0}$.`, why: `The denominator of InfoNCE sums $\\exp(\\text{score})$ over the whole candidate set, true plus negatives.` },
          { do: `Add them up to get the normalizer $Z$.`, why: `This turns the scores into a softmax — a probability distribution over candidates.` },
          { do: `Compute the true future's probability $e^{2.0}/Z$, then take $-\\log$ of it.`, why: `InfoNCE is the cross-entropy of picking the one correct candidate.` }
        ],
        answer: `<p>$e^{2.0} \\approx 7.39$, $e^{1.0} \\approx 2.72$, $e^{0.0} = 1.0$, $e^{-1.0} \\approx 0.37$. Sum $Z \\approx 11.48$. True probability $= 7.39/11.48 \\approx 0.644$. Loss $= -\\log(0.644) \\approx 0.440$. The model is fairly confident but the hard negative at score 1.0 still costs it some loss.</p>`
      },
      {
        q: `Why does adding more negatives generally improve the features CPC learns, and what does the bound $I(z_{t+k};c_t) \\ge \\log|N| - \\mathcal{L}_{\\text{InfoNCE}}$ have to do with it?`,
        steps: [
          { do: `Look at the $\\log|N|$ term in the lower bound on mutual information.`, why: `$|N|$ is the size of the candidate set; more negatives means a larger $|N|$.` },
          { do: `Note that a bigger $|N|$ raises the ceiling the bound can reach.`, why: `The tightest the bound can ever certify is about $\\log|N|$ bits of mutual information.` }
        ],
        answer: `<p>InfoNCE is a lower bound on the mutual information $I(z_{t+k};c_t)$, and that bound is capped near $\\log|N|$. With few negatives the bound saturates early — even a great model cannot prove it captured much information. Adding negatives raises $\\log|N|$, so the contrastive task can certify (and push the model toward) more mutual information between context and future. More negatives also means harder distractors on average, so the quiz teaches more. The cost is compute and memory.</p>`
      }
    ]
  });

  window.CODE["unl-cpc"] = {
    lib: "PyTorch",
    runnable: false, // the in-browser engine has no torch; THIS CODE IS REAL and RUNS ON A COLAB GPU
    explain: `<p>One CPC training step. We encode each timestep to a latent, run a GRU to get an
      autoregressive context $c_t$, then for several offsets $k$ form the predicted future $W_k\\,c_t$
      and score it against the true future latent and a batch of in-batch negatives with InfoNCE
      (cross-entropy where the "correct class" is the true future).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class CPC(nn.Module):
    def __init__(self, in_dim=1, latent=64, ctx=64, n_pred=4):
        super().__init__()
        self.n_pred = n_pred                          # predict k = 1..n_pred steps ahead
        # encoder g_enc: each timestep x_t -> latent z_t
        self.enc = nn.Sequential(
            nn.Linear(in_dim, 128), nn.LayerNorm(128), nn.ReLU(),
            nn.Linear(128, latent),
        )
        # autoregressive context g_ar: summarize z_{<=t} into c_t
        self.ar = nn.GRU(latent, ctx, batch_first=True)
        # one prediction head W_k per future offset k
        self.Wk = nn.ModuleList([nn.Linear(ctx, latent, bias=False)
                                 for _ in range(n_pred)])

    def forward(self, x):
        # x: (B, T, in_dim) — B sequences of length T
        B, T, _ = x.shape
        z = self.enc(x)                               # (B, T, latent)
        c, _ = self.ar(z)                             # (B, T, ctx) contexts at every t

        loss = 0.0
        for k in range(1, self.n_pred + 1):
            t_max = T - k                             # last anchor that has a real future
            ct = c[:, :t_max, :]                      # (B, t_max, ctx) contexts
            z_true = z[:, k:k + t_max, :]             # (B, t_max, latent) true z_{t+k}
            pred = self.Wk[k - 1](ct)                 # (B, t_max, latent) = W_k c_t

            # flatten (B * t_max) into one pool; every other latent is a negative
            P = pred.reshape(-1, pred.size(-1))       # (M, latent) predictions
            Z = z_true.reshape(-1, z_true.size(-1))   # (M, latent) true futures = candidates
            P = F.normalize(P, dim=1)
            Z = F.normalize(Z, dim=1)

            logits = P @ Z.t()                        # (M, M) score every pred vs every candidate
            # row i's correct candidate is its own true future, on the diagonal
            targets = torch.arange(P.size(0), device=x.device)
            loss = loss + F.cross_entropy(logits / 0.1, targets)   # InfoNCE for offset k

        return loss / self.n_pred

# toy run: 8 sequences, length 20, scalar signal per step
model = CPC(in_dim=1, n_pred=4)
x = torch.randn(8, 20, 1)
loss = model(x)
loss.backward()                                       # gradients flow into enc, GRU, and W_k
print(float(loss))`
  };

  window.CODEVIZ["unl-cpc"] = {
    question: "On real digit images read as a sequence of 8 pixel-rows, can a context vector predict the TRUE next row's latent out of N negatives by cosine InfoNCE — and how do you tell a healthy CPC signal apart from a collapsed one, a too-easy quiz, or predicting too far ahead?",
    charts: [
      {
        type: "line", title: "Healthy CPC proxy: top-1 accuracy beats chance, fades with gap k (16 negatives)",
        xlabel: "prediction gap k (rows ahead)", ylabel: "top-1 accuracy (pick the true future)",
        series: [
          { name: "CPC proxy (cosine InfoNCE)", color: "#7ee787", points: [[1, 0.280], [2, 0.149], [3, 0.118], [4, 0.132], [5, 0.148]] },
          { name: "chance (1 / (1+N))", color: "#9aa7b4", points: [[1, 0.059], [2, 0.059], [3, 0.059], [4, 0.059], [5, 0.059]] }
        ],
        interpret: "<b>The ideal, computed from real load_digits.</b> X is how far ahead we predict (gap k, in rows); Y is how often cosine similarity to the predicted future ranks the TRUE next-row latent above all 16 negatives. The green curve sits clearly above the grey chance line (1/(1+16) = 0.059) at every gap, so the context really does carry information about the future — that gap is what InfoNCE is teaching. It is highest at k=1 (the near future is most predictable) and sags for larger k. <b>Conclusion:</b> green well above grey = a real, useful contrastive signal."
      },
      {
        type: "line", title: "Healthy: accuracy drops as the negative pool grows, but always beats chance (gap k=1)",
        xlabel: "number of negatives N", ylabel: "top-1 accuracy",
        series: [
          { name: "CPC proxy (cosine InfoNCE)", color: "#7ee787", points: [[1, 0.813], [4, 0.574], [8, 0.404], [16, 0.284], [32, 0.173], [64, 0.105]] },
          { name: "chance (1 / (1+N))", color: "#9aa7b4", points: [[1, 0.500], [4, 0.200], [8, 0.111], [16, 0.059], [32, 0.030], [64, 0.015]] }
        ],
        interpret: "<b>Same healthy model, computed, now varying the quiz difficulty.</b> X is the number of negatives N in each multiple-choice quiz; Y is top-1 accuracy at gap k=1. Both curves fall as N grows because guessing one-of-many is harder, but the gap between green and grey (chance = 1/(1+N)) <i>stays open</i> — at N=64 the model still scores 0.105 versus 0.015 chance, about 7x better. <b>Conclusion:</b> a true signal beats chance by a wide margin at every N; absolute accuracy dropping with N is expected, not a failure."
      },
      {
        type: "line", title: "Collapsed / shortcut representation: hugs the chance line (illustrative)",
        xlabel: "prediction gap k (rows ahead)", ylabel: "top-1 accuracy",
        series: [
          { name: "collapsed encoder", color: "#ff7b72", points: [[1, 0.068], [2, 0.061], [3, 0.058], [4, 0.062], [5, 0.060]] },
          { name: "chance (1 / (1+N))", color: "#9aa7b4", points: [[1, 0.059], [2, 0.059], [3, 0.059], [4, 0.059], [5, 0.059]] }
        ],
        interpret: "<b>Illustrative failure mode.</b> Same axes as the ideal, but the red curve lies right on top of the grey chance line at every gap. This is what you see when the encoder has <i>collapsed</i> (every latent maps to nearly the same vector) or learned nothing predictive — the context tells you no more about the future than a coin flip. <b>How to recognise it:</b> accuracy near 1/(1+N) everywhere, flat, never pulling away from chance. <b>Conclusion:</b> no mutual information was captured — check for representation collapse, a broken target, or negatives sampled from the positive."
      },
      {
        type: "line", title: "Too-easy negatives: near-perfect accuracy that means nothing (illustrative)",
        xlabel: "prediction gap k (rows ahead)", ylabel: "top-1 accuracy",
        series: [
          { name: "easy-negative quiz", color: "#ffb454", points: [[1, 0.992], [2, 0.985], [3, 0.984], [4, 0.983], [5, 0.981]] },
          { name: "chance (1 / (1+N))", color: "#9aa7b4", points: [[1, 0.059], [2, 0.059], [3, 0.059], [4, 0.059], [5, 0.059]] }
        ],
        interpret: "<b>Illustrative trap — high accuracy is not always good.</b> Here the negatives are drawn from obviously different images, so telling the true future apart is trivial and accuracy sits near 1.0 even far into the future (orange almost flat at the top). The quiz is too easy: the model can win by matching cheap low-level statistics (brightness, texture) instead of learning structure, so the loss is tiny but the representation is weak. <b>How to recognise it:</b> accuracy suspiciously high and barely dropping with gap k. <b>Conclusion:</b> draw harder negatives (same image / nearby times) so the score reflects real learning, not an easy quiz."
      }
    ],
    caption: "A faithful small-scale proxy of CPC's core move: predict the future contrastively. Each real load_digits image (8x8) is read as a sequence of 8 pixel-rows; PCA encodes each row to a latent, a per-gap linear head W_k predicts the latent k rows ahead from a context row, and we score how often cosine similarity picks the TRUE future latent over N negatives. The first two charts are the computed ideal; the last two are illustrative failure modes you should learn to spot. Each chart's interpret box explains how to read it.",
    code: `import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA

# Read each 8x8 digit as a SEQUENCE of 8 pixel-ROWS. Encode each row to a latent (PCA),
# learn a per-gap linear prediction head W_k (CPC's z_{t+k} ~ W_k c_t), then measure top-1
# contrastive accuracy: pick the TRUE row-(t+k) latent out of N negatives by cosine
# similarity to W_k c_t. Average over every valid anchor t to isolate the GAP effect.

rng = np.random.default_rng(0)
X = load_digits().data.reshape(-1, 8, 8) / 16.0   # (1797, 8 rows, 8 cols), real images
N_IMG = X.shape[0]

D = 8
rows = X.reshape(-1, 8)                            # one row = one timestep
Z = PCA(n_components=D, random_state=0).fit_transform(rows).reshape(N_IMG, 8, D)

perm = rng.permutation(N_IMG)
tr, te = perm[:1200], perm[1200:]                 # split images train / test

def unit(a):
    return a / (np.linalg.norm(a, axis=-1, keepdims=True) + 1e-9)

def fit_head(t, k):                               # ridge-regress z_{t+k} from z_t
    Ctr, Ztr = Z[tr, t, :], Z[tr, t + k, :]
    A = Ctr.T @ Ctr + 1e-2 * np.eye(D)
    return np.linalg.solve(A, Ctr.T @ Ztr)        # (D, D) prediction head W_k

def accuracy(k, n_neg, n_trials_per=1500):
    hits = total = 0
    for t in range(8):                            # every valid anchor with a future at t+k
        if t + k >= 8:
            continue
        W = fit_head(t, k)
        pred = unit(Z[te, t, :] @ W)              # predicted future latent
        Zt = unit(Z[te, t + k, :])                # true latents at row t+k
        M = len(te)
        for _ in range(n_trials_per):
            i = rng.integers(M)
            negs = Zt[rng.integers(M, size=n_neg)]
            cand = np.vstack([Zt[i][None, :], negs])   # 1 positive + n_neg negatives
            if np.argmax(cand @ pred[i]) == 0:    # cosine InfoNCE picks index 0?
                hits += 1
            total += 1
    return hits / total

print("accuracy vs prediction gap k (N=16):")
for k in [1, 2, 3, 4, 5]:
    print(" k", k, round(accuracy(k, 16), 3))

print("accuracy vs number of negatives (k=1):")
for n in [1, 4, 8, 16, 32, 64]:
    print(" N", n, "chance", round(1 / (n + 1), 3), "acc", round(accuracy(1, n), 3))`
  };
})();
