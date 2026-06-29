/* =====================================================================
   "Learning from Unlabeled Data" — unl-moco
   MoCo: Momentum Contrast (He et al. 2019; v2 2020).
   Self-contained: pushes the lesson, its CODE entry, and its CODEVIZ entry.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "unl-moco",
    title: "MoCo: Momentum Contrast",
    tagline: "Get SimCLR's many negatives for free with a memory queue and a slowly-moving key encoder.",
    module: "Semi & Self-Supervised Learning",
    prereqs: ["dl-cosine-similarity", "mod-contrastive", "fs-metric-learning", "dl-data-augmentation"],

    whenToUse:
      `<p><b>Reach for MoCo when you want strong self-supervised features but cannot afford SimCLR's giant batches.</b> SimCLR draws its negatives from the current mini-batch, so it needs batches of 4096+ images (many GPUs) to get enough of them. MoCo keeps a separate <b>queue</b> of negatives from past batches, so even a single 8-GPU machine with a batch of 256 sees thousands of negatives.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>SimCLR [unl-simclr]</b> — when your hardware budget is small. MoCo decouples the number of negatives from the batch size, so you do not pay for huge batches.</li>
         <li><b>A supervised classifier</b> — when you have a mountain of unlabeled images and few labels. MoCo pre-trains the encoder with no labels, then you fine-tune on the few labels you have.</li>
       </ul>
       <p><b>Pick a different tool when:</b></p>
       <ul>
         <li>You already train with batch size 4096+ — plain SimCLR is simpler and there is no queue to maintain.</li>
         <li>You want to skip negatives entirely — BYOL / SimSiam learn from positives alone (at the cost of careful collapse-avoidance tricks).</li>
       </ul>
       <p><b>Which library:</b> the official <code>facebookresearch/moco</code> repo, or <code>lightly</code> for a higher-level MoCo / MoCo v2 trainer. This lesson builds on contrastive learning [mod-contrastive] and the cosine-similarity score [dl-cosine-similarity].</p>`,

    application:
      `<p>MoCo is a workhorse for <b>pre-training vision backbones without labels</b>. Train a ResNet on millions of unlabeled photos with MoCo, then fine-tune on a small labeled set; the features transfer to classification, detection, and segmentation, often matching or beating supervised pre-training.</p>
       <p>It shines wherever labels are scarce or expensive: medical imaging, satellite imagery, industrial defect detection. The same momentum-encoder idea later powered <b>MoCo v3</b> (Vision Transformers) and influenced BYOL's target network. Anywhere you have lots of unlabeled data and a few labels, MoCo-style pre-training is a strong default.</p>`,

    pitfalls:
      `<ul>
         <li><b>Momentum $m$ too low.</b> The key encoder is an Exponential Moving Average (EMA) of the query encoder with $\\theta_k \\leftarrow m\\,\\theta_k + (1-m)\\,\\theta_q$. If $m$ is small (say 0.9) the key encoder lurches every step, so keys made many batches ago no longer match keys made now — the queue becomes <b>inconsistent</b> and the loss is noisy. Keep $m$ high, around <b>0.999</b>, so the key encoder evolves slowly and the whole queue stays comparable.</li>
         <li><b>Queue too small or too large.</b> Too small (a few hundred) and you lose MoCo's advantage over a plain batch. Too large (well past the dataset size, or far beyond what the encoder's drift can keep consistent) and the oldest keys are stale. A queue of <b>65536</b> works well on ImageNet; tune it to the dataset.</li>
         <li><b>Temperature $\\tau$ mis-set.</b> The loss divides every similarity by $\\tau$. Too large and every negative looks equally bad (no signal); too small and one hard negative dominates and training is unstable. Around <b>0.07</b> (v1) to <b>0.2</b> (v2) is typical.</li>
         <li><b>BatchNorm signal leakage.</b> Standard BatchNorm computes statistics over the batch, so the network can <b>cheat</b>: it reads the batch statistics to tell the positive apart, instead of learning real features. MoCo fixes this with <b>Shuffling BN</b> — shuffle the key batch across GPUs before the key encoder, then unshuffle the output — so the positive and its negatives never share BatchNorm statistics.</li>
         <li><b>Representation collapse.</b> Without enough negatives (or with a broken queue) the encoder can map every image to nearly the same vector and trivially minimize the loss. A large, consistent queue of negatives is exactly what prevents this — the network must keep different images apart.</li>
         <li><b>Weak augmentation.</b> If the two views of an image are too similar, matching them is trivial and the features are weak. <b>MoCo v2</b> borrowed SimCLR's recipe — an MLP (Multi-Layer Perceptron) projection head plus stronger augmentation (color jitter, blur) — and jumped several accuracy points.</li>
       </ul>`,

    bigIdea:
      `<p>Contrastive learning [mod-contrastive] makes two augmented views of the <i>same</i> image agree, while pushing them away from views of <i>other</i> images (the <b>negatives</b>). The more negatives you contrast against, the sharper the features. SimCLR [unl-simclr] gets negatives from the current mini-batch, so it needs a <b>huge</b> batch — which means many GPUs.</p>
       <p><b>MoCo</b> (Momentum Contrast) gets the same many negatives cheaply with two ideas:</p>
       <ul>
         <li>A <b>dictionary queue</b>: a running buffer of recent key vectors. Each step you <b>enqueue</b> the current batch's keys and <b>dequeue</b> the oldest. The queue can hold tens of thousands of negatives without ever being in a single forward pass.</li>
         <li>A <b>momentum encoder</b>: the keys are produced by a second encoder that is a slow-moving copy (Exponential Moving Average) of the main encoder. Because it changes only a sliver each step, keys made long ago still match keys made now, so the queue stays <b>consistent</b>.</li>
       </ul>
       <p>The result: SimCLR-quality features on a fraction of the hardware.</p>`,

    buildup:
      `<p>There are two encoders. The <b>query encoder</b> $f_q$ (weights $\\theta_q$) is trained normally by gradient descent. The <b>key encoder</b> $f_k$ (weights $\\theta_k$) makes the vectors we compare against; it is <b>never</b> updated by gradients.</p>
       <p>Each step, take a batch of images. Make two augmented views of each. The query encoder turns one view into a query vector $q$. The key encoder turns the other view into a key $k_+$ — this is the <b>positive</b>, because it comes from the same image as $q$.</p>
       <p>The <b>negatives</b> are all the keys sitting in the queue from previous batches. We score $q$ against its one positive $k_+$ and against the $K$ queued negatives, and train $q$ to pick out $k_+$.</p>
       <p>Why not just train $f_k$ by backprop too? Because the queue holds keys made by <i>past</i> versions of $f_k$. If $f_k$ jumped every step, those old keys would be made by a different network than today's, and comparing them would be apples to oranges. So instead we move $f_k$ <b>slowly</b>: $\\theta_k \\leftarrow m\\,\\theta_k + (1-m)\\,\\theta_q$. With $m \\approx 0.999$ the key encoder barely changes per step, keeping the whole queue <b>consistent</b>.</p>
       <p>After the loss, we <b>enqueue</b> the current batch's keys and <b>dequeue</b> the oldest, keeping the queue size fixed.</p>`,

    symbols: [
      { sym: "$f_q$", desc: "the query encoder: the main network, trained by gradient descent. It turns an image view into a query vector." },
      { sym: "$f_k$", desc: "the key encoder: a slow-moving copy of $f_q$, never trained by gradients. It turns an image view into a key vector." },
      { sym: "$\\theta_q$", desc: "the weights of the query encoder $f_q$ (updated by the optimizer)." },
      { sym: "$\\theta_k$", desc: "the weights of the key encoder $f_k$ (updated only by the momentum rule below)." },
      { sym: "$q$", desc: "the query vector: $f_q$ applied to one augmented view of the current image." },
      { sym: "$k_+$", desc: "the positive key: $f_k$ applied to a different augmented view of the SAME image. The query should match this one." },
      { sym: "$k_i$", desc: "a key in the queue. $k_0 = k_+$ is the positive; $k_1,\\dots,k_K$ are the $K$ queued negatives from past batches." },
      { sym: "$K$", desc: "the number of negative keys in the queue (e.g. 65536). It is set by the queue length, NOT by the batch size — that is MoCo's key win." },
      { sym: "$m$", desc: "the momentum (Greek 'm'): how much of the old key-encoder weights to keep each step, near 1 (e.g. 0.999). Higher $m$ means a slower, more consistent key encoder." },
      { sym: "$\\tau$", desc: "the temperature (Greek 'tau'): a small positive number (e.g. 0.07) that divides every similarity, sharpening or softening how hard the loss pushes." },
      { sym: "$q\\cdot k$", desc: "the dot product of the query and a key. On L2-normalized vectors this is the cosine similarity [dl-cosine-similarity]: high means they point the same way." }
    ],

    formula: `$$ \\theta_k \\leftarrow m\\,\\theta_k + (1-m)\\,\\theta_q \\qquad\\qquad \\mathcal{L} = -\\log\\frac{\\exp(q\\cdot k_+/\\tau)}{\\sum_{i=0}^{K}\\exp(q\\cdot k_i/\\tau)} $$`,

    whatItDoes:
      `<p><b>Left — the momentum update.</b> After each gradient step on $\\theta_q$, nudge the key encoder's weights a tiny step toward the query encoder's: keep a fraction $m$ of the old weights and add $(1-m)$ of the new ones. With $m = 0.999$ the key encoder moves only $0.1\\%$ of the way per step, so it drifts slowly and the queued keys stay mutually comparable.</p>
       <p><b>Right — the InfoNCE (Information Noise-Contrastive Estimation) loss.</b> Read it as a softmax classification over the queue. There are $K+1$ candidates: the one positive $k_+$ and the $K$ negatives $k_1,\\dots,k_K$. Each candidate gets a score $\\exp(q\\cdot k_i/\\tau)$. The fraction is the probability the model assigns to the <i>correct</i> one ($k_+$). The $-\\log$ makes the loss small when that probability is near 1.</p>
       <p>In one sentence: <b>among the positive and the whole queue of negatives, learn to pick the positive.</b> More negatives in the denominator makes the task harder and the features stronger.</p>`,

    derivation:
      `<p><b>Why this loss works.</b> InfoNCE is a $(K+1)$-way softmax cross-entropy where the right answer is always slot 0 (the positive). Minimizing it maximizes $q\\cdot k_+$ (pull the two views of one image together) while minimizing $q\\cdot k_i$ for negatives (push different images apart). Crucially, InfoNCE is a <b>lower bound on the mutual information</b> between the two views: pushing the loss down provably increases how much the query and its positive share. A larger $K$ (more negatives) tightens that bound — the deeper reason MoCo wants a big queue.</p>
       <p><b>Why the momentum encoder is needed.</b> The denominator mixes keys made across many past steps. For the comparison $q\\cdot k_i$ to be meaningful, every $k_i$ must live in roughly the <i>same</i> vector space. If we trained $f_k$ by backprop, its weights would change a lot every step, so a key made 500 steps ago would come from a very different network — the queue would be an inconsistent jumble and the gradient would be noise. The momentum update solves this directly: $\\theta_k$ changes by only $(1-m)$ of the gap each step, so over hundreds of steps the key encoder evolves smoothly and the whole queue stays consistent. This is the single idea that lets MoCo decouple the negative count from the batch size.</p>
       <p><b>MoCo v2.</b> Two cheap changes from SimCLR lift accuracy a lot: replace the single linear projection with a 2-layer MLP (Multi-Layer Perceptron) <b>projection head</b>, and use <b>stronger augmentation</b> (color jitter, Gaussian blur). Same queue, same momentum — just a better head and harder views.</p>`,

    example:
      `<p>Tiny 2-D example with temperature $\\tau = 0.1$ and a queue of just $K = 2$ negatives. The (already L2-normalized) query and keys give the cosine similarities in the first column; the InfoNCE loss turns them into a softmax over the $K+1=3$ candidates.</p>
       <table class="extable">
         <caption>InfoNCE over the positive and 2 queued negatives ($\\tau=0.1$).</caption>
         <thead><tr><th>candidate</th><th class="num">$q\\cdot k_i$</th><th class="num">$\\div\\,\\tau$</th><th class="num">$\\exp$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">positive $k_+$</td><td class="num">0.9</td><td class="num">9.0</td><td class="num">8103</td></tr>
           <tr><td class="row-h">negative $k_1$</td><td class="num">0.2</td><td class="num">2.0</td><td class="num">7.39</td></tr>
           <tr><td class="row-h">negative $k_2$</td><td class="num">0.1</td><td class="num">1.0</td><td class="num">2.72</td></tr>
           <tr><td class="row-h">sum</td><td class="num"></td><td class="num"></td><td class="num">8113</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li>Divide each similarity by $\\tau = 0.1$: scores become $9.0,\\ 2.0,\\ 1.0$.</li>
         <li>Exponentiate: $e^{9.0} \\approx 8103$, $e^{2.0} \\approx 7.39$, $e^{1.0} \\approx 2.72$.</li>
         <li>Sum the denominator: $8103 + 7.39 + 2.72 \\approx 8113$.</li>
         <li>Probability of the positive: $\\frac{8103}{8113} \\approx 0.9988$.</li>
         <li>Loss: $-\\log(0.9988) \\approx 0.0012$ — tiny, because the positive already wins easily.</li>
       </ul>
       <p>Now imagine the queue grows to $K = 65535$ negatives, a few of them genuinely confusable with $q$. Those add real mass to the denominator, the positive's probability drops below 1, and the loss has something to teach — which is exactly why MoCo's large queue produces sharper features.</p>`,

    practice: [
      {
        q: `MoCo uses temperature $\\tau = 0.2$. A query scores $q\\cdot k_+ = 0.8$ against its positive and $q\\cdot k_1 = 0.4$ against a single queued negative ($K = 1$). What probability does the loss assign to the positive, and what is the loss?`,
        steps: [
          { do: `Divide both similarities by $\\tau = 0.2$.`, why: `The temperature scales every score before the softmax; this is the "sharpening" knob.` },
          { do: `Exponentiate each scaled score.`, why: `InfoNCE is a softmax, so each candidate's weight is $\\exp(\\text{score})$.` },
          { do: `Form the probability of the positive as its weight over the sum of all weights, then take $-\\log$.`, why: `The loss is the negative log-probability of picking the correct (positive) key.` }
        ],
        answer: `<p>Scaled: $0.8/0.2 = 4.0$ and $0.4/0.2 = 2.0$. Exponentiate: $e^{4.0} \\approx 54.6$, $e^{2.0} \\approx 7.39$. Probability of the positive: $\\frac{54.6}{54.6 + 7.39} = \\frac{54.6}{61.99} \\approx 0.881$. Loss $= -\\log(0.881) \\approx 0.127$. With only one negative the loss is small; a full queue of thousands of negatives would push it higher and give a stronger learning signal.</p>`
      },
      {
        q: `The key encoder uses momentum $m = 0.999$. In plain English, how far does $\\theta_k$ move toward $\\theta_q$ in one step, and why must $m$ be this close to 1?`,
        steps: [
          { do: `Read the update $\\theta_k \\leftarrow m\\,\\theta_k + (1-m)\\,\\theta_q$ and find the fraction of the gap closed.`, why: `The new weights are a blend; $(1-m)$ is the share taken from the query encoder.` },
          { do: `Connect a slow-moving $f_k$ to the consistency of keys made many batches ago.`, why: `The queue compares keys made at different times, so they must come from a near-identical encoder.` }
        ],
        answer: `<p>$1 - m = 0.001$, so the key encoder moves just $0.1\\%$ of the way toward the query encoder each step — it barely changes. It must be this slow because the queue holds keys produced hundreds of steps ago; if $f_k$ jumped each step, those old keys would come from a very different network and comparing them to today's query would be meaningless. A high $m$ keeps the whole queue <b>consistent</b>, which is the trick that lets MoCo use a huge bank of negatives.</p>`
      },
      {
        q: `Why can MoCo see 65{,}536 negatives with a batch size of only 256, while SimCLR would need a batch of 65{,}536 to see the same number?`,
        steps: [
          { do: `Recall where each method's negatives come from.`, why: `SimCLR's negatives are the other images in the current batch; MoCo's are the queue.` },
          { do: `Note that the queue persists across steps and is decoupled from the forward pass.`, why: `Queued keys were computed in earlier steps and are just stored vectors, not re-encoded now.` }
        ],
        answer: `<p>SimCLR draws negatives from the current mini-batch, so the only way to get $N$ negatives is a batch of about $N$ — which is why it needs thousands-wide batches and many GPUs. MoCo stores keys from past batches in a <b>queue</b>; those vectors are already computed and just sit in memory. Each step adds 256 fresh keys and drops the 256 oldest, but the queue can hold 65{,}536 of them. So the number of negatives is set by the queue length, not the batch size, and MoCo gets SimCLR-scale negatives on modest hardware.</p>`
      }
    ]
  });

  window.CODE["unl-moco"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>One MoCo training step: encode the query and key views, do the Exponential Moving Average (EMA) momentum update of the key encoder, build the InfoNCE logits as [positive | queue of negatives], and enqueue/dequeue the new keys. This is the real method (runs on a Colab GPU), not pseudocode.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class MoCo(nn.Module):
    """Momentum Contrast (He et al. 2019). v2: pass an MLP head as encoder."""
    def __init__(self, encoder_q, encoder_k, dim=128, K=65536, m=0.999, T=0.07):
        super().__init__()
        self.K, self.m, self.T = K, m, T
        self.encoder_q = encoder_q          # trained by gradient descent
        self.encoder_k = encoder_k          # momentum (EMA) copy, no grads

        # key encoder starts as an exact copy of the query encoder
        for pq, pk in zip(self.encoder_q.parameters(), self.encoder_k.parameters()):
            pk.data.copy_(pq.data)
            pk.requires_grad = False        # never updated by backprop

        # the dictionary queue: dim x K column-normalized key vectors
        self.register_buffer("queue", F.normalize(torch.randn(dim, K), dim=0))
        self.register_buffer("queue_ptr", torch.zeros(1, dtype=torch.long))

    @torch.no_grad()
    def _momentum_update(self):
        # theta_k <- m * theta_k + (1 - m) * theta_q
        for pq, pk in zip(self.encoder_q.parameters(), self.encoder_k.parameters()):
            pk.data.mul_(self.m).add_(pq.data, alpha=1.0 - self.m)

    @torch.no_grad()
    def _dequeue_and_enqueue(self, keys):
        batch = keys.shape[0]
        ptr = int(self.queue_ptr)
        # overwrite the oldest 'batch' columns with the new keys (wrap allowed for divisor sizes)
        self.queue[:, ptr:ptr + batch] = keys.T
        self.queue_ptr[0] = (ptr + batch) % self.K

    def forward(self, im_q, im_k):
        # 1) query features (gradients flow here)
        q = F.normalize(self.encoder_q(im_q), dim=1)        # (N, dim)

        # 2) key features from the momentum encoder (no gradients)
        with torch.no_grad():
            self._momentum_update()
            # NOTE: real MoCo shuffles im_k across GPUs here (Shuffling BN) to
            # stop BatchNorm statistics from leaking the positive's identity.
            k = F.normalize(self.encoder_k(im_k), dim=1)    # (N, dim)

        # 3) InfoNCE logits: positive is column 0, negatives are the queue
        l_pos = torch.einsum("nc,nc->n", q, k).unsqueeze(1)            # (N, 1)
        l_neg = torch.einsum("nc,ck->nk", q, self.queue.clone())      # (N, K)
        logits = torch.cat([l_pos, l_neg], dim=1) / self.T            # (N, 1+K)

        # the correct class is index 0 (the positive) for every query
        labels = torch.zeros(logits.shape[0], dtype=torch.long, device=logits.device)
        loss = F.cross_entropy(logits, labels)               # == InfoNCE

        # 4) push the fresh keys into the queue, drop the oldest
        self._dequeue_and_enqueue(k)
        return loss

# --- one optimization step ---
# loss = model(im_q, im_k)          # im_q, im_k = two augmented views of a batch
# optimizer.zero_grad(); loss.backward(); optimizer.step()`
  };

  window.CODEVIZ["unl-moco"] = {
    question: "On real digit embeddings, how do you read a contrastive-retrieval curve — and how do you spot a collapsed encoder or an inconsistent queue from its shape?",
    charts: [
      {
        type: "line",
        title: "Healthy encoder: accuracy falls with more negatives but stays far above chance",
        xlabel: "number of negatives N (as 2^x; x=1 means N=2, x=10 means N=1024)",
        ylabel: "top-1 match accuracy (fraction correct, 0 to 1)",
        series: [
          {
            name: "MoCo-style retrieval (cosine match)",
            color: "#7ee787",
            points: [[1, 0.827], [2, 0.647], [3, 0.455], [4, 0.277], [5, 0.227], [6, 0.13], [7, 0.09], [8, 0.048], [9, 0.023], [10, 0.017]]
          },
          {
            name: "random-guess baseline (1/N)",
            color: "#9aa7b4",
            points: [[1, 0.5], [2, 0.25], [3, 0.125], [4, 0.0625], [5, 0.0312], [6, 0.0156], [7, 0.0078], [8, 0.0039], [9, 0.002], [10, 0.001]]
          }
        ],
        interpret: "<b>The main chart, real numbers from load_digits.</b> The x-axis is the exponent: N = 2^x negatives, so x runs 1 to 10 meaning N runs 2 to 1024. The y-axis is the fraction of trials where the augmented query's nearest key (by cosine) is its true original. Both lines slide down to the right because picking the right key out of a bigger crowd is harder. What matters is the <b>gap</b>: the green line sits far above the grey 1/N chance line at every N. That gap is real discriminative signal — the encoder genuinely tells images apart — and it is exactly what MoCo's big queue buys you without needing huge batches."
      },
      {
        type: "line",
        title: "Collapsed encoder: retrieval sits on the chance line (illustrative)",
        xlabel: "number of negatives N (as 2^x)",
        ylabel: "top-1 match accuracy (fraction correct, 0 to 1)",
        series: [
          {
            name: "collapsed encoder (all vectors nearly identical)",
            color: "#ff7b72",
            points: [[1, 0.51], [2, 0.26], [3, 0.13], [4, 0.07], [5, 0.033], [6, 0.017], [7, 0.008], [8, 0.004], [9, 0.002], [10, 0.001]]
          },
          {
            name: "random-guess baseline (1/N)",
            color: "#9aa7b4",
            points: [[1, 0.5], [2, 0.25], [3, 0.125], [4, 0.0625], [5, 0.0312], [6, 0.0156], [7, 0.0078], [8, 0.0039], [9, 0.002], [10, 0.001]]
          }
        ],
        interpret: "<b>Illustrative failure case.</b> Same axes as above, but here the red retrieval line lies right on top of the grey 1/N chance line. When you see this — accuracy no better than random guessing at every N — the encoder has <b>collapsed</b>: it maps every image to nearly the same vector, so cosine similarity carries no information and matching is pure luck. In MoCo this happens when the queue of negatives is too small or broken, so nothing forces the network to keep different images apart. The fix is a large, consistent queue of negatives."
      },
      {
        type: "line",
        title: "Inconsistent queue (momentum too low): a healthy curve sags toward chance (illustrative)",
        xlabel: "number of negatives N (as 2^x)",
        ylabel: "top-1 match accuracy (fraction correct, 0 to 1)",
        series: [
          {
            name: "healthy reference (high momentum)",
            color: "#7ee787",
            points: [[1, 0.827], [2, 0.647], [3, 0.455], [4, 0.277], [5, 0.227], [6, 0.13], [7, 0.09], [8, 0.048], [9, 0.023], [10, 0.017]]
          },
          {
            name: "inconsistent queue (stale keys from a lurching encoder)",
            color: "#ffb454",
            points: [[1, 0.69], [2, 0.45], [3, 0.27], [4, 0.14], [5, 0.085], [6, 0.045], [7, 0.022], [8, 0.011], [9, 0.005], [10, 0.0025]]
          },
          {
            name: "random-guess baseline (1/N)",
            color: "#9aa7b4",
            points: [[1, 0.5], [2, 0.25], [3, 0.125], [4, 0.0625], [5, 0.0312], [6, 0.0156], [7, 0.0078], [8, 0.0039], [9, 0.002], [10, 0.001]]
          }
        ],
        interpret: "<b>Illustrative in-between case.</b> The orange line still beats chance, but it sags well below the green healthy reference everywhere — and the gap over chance is much thinner. This is what a low momentum (say m=0.9) looks like: the key encoder lurches every step, so keys queued many batches ago were made by a very different network and no longer line up with today's query. The negatives become a noisy, stale jumble. You recognise it as 'better than random but disappointing'; the fix is to push the momentum up near 0.999 so the whole queue stays comparable."
      }
    ],
    caption: "Reproducible scikit-learn proxy for MoCo's 'negatives from a queue' idea (NOT MoCo itself — real MoCo needs a GPU). The first chart uses real numbers; the collapsed and inconsistent-queue charts are illustrative shapes that show how the same retrieval curve looks when the encoder collapses or the queue goes stale.",
    code: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.preprocessing import normalize

# real bundled dataset: 1797 handwritten digits, 64 pixels each
X = load_digits().data.astype(float) / 16.0
# a small encoder proxy: PCA to a 16-D embedding (so noisy views are confusable)
emb = PCA(n_components=16, random_state=0).fit_transform(X)
n = emb.shape[0]

def topk_acc(N, sigma=1.5, trials=600, seed=0):
    """Match an augmented view of one image to its original among N candidates."""
    rng = np.random.RandomState(seed)
    correct = 0
    for _ in range(trials):
        idx = rng.choice(n, N, replace=False)          # N originals = the 'keys'
        gallery = normalize(emb[idx])                  # L2-normalize -> cosine
        pos = rng.randint(N)                           # which one is the positive
        q = emb[idx[pos]] + rng.normal(0, sigma, emb.shape[1])  # 'augmented' query
        q = q / (np.linalg.norm(q) + 1e-9)
        sims = gallery @ q                             # cosine similarity to each key
        correct += (np.argmax(sims) == pos)            # top-1 retrieval hit
    return correct / trials

Ns = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]
acc = [topk_acc(N, seed=N) for N in Ns]
chance = [1.0 / N for N in Ns]

xs = np.log2(Ns)
plt.plot(xs, acc, "-o", c="#4ea1ff", label="MoCo-style retrieval (cosine match)")
plt.plot(xs, chance, "--", c="#9aa7b4", label="random-guess baseline (1/N)")
plt.title("Contrastive retrieval: top-1 match accuracy vs number of negatives (load_digits)")
plt.xlabel("number of negatives N (log scale of 2^x)")
plt.ylabel("top-1 match accuracy")
plt.legend()
plt.show()`
  };
})();
