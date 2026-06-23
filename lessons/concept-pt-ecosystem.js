/* =====================================================================
   PyTorch (a complete course) — CAPSTONE: the PyTorch ecosystem.
   What to reach for: domain libraries (torchvision/torchaudio/text+HF),
   high-level training frameworks (Lightning, fastai, Ignite, Accelerate),
   Hugging Face (transformers/datasets/Trainer), experiment tracking,
   deployment/optimization, and PyTorch vs Keras/TF vs JAX.
   Self-contained: pushes one lesson into window.LESSONS and one entry
   each into window.CODE and window.CODEVIZ.
   CODE runs in Google Colab (the setup cell auto-installs lightning).
   CODEVIZ numbers are real — produced by the tiny numpy script in its code.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "pt-ecosystem",
    title: "The PyTorch ecosystem — what to reach for",
    tagline: "The course finale: the libraries around PyTorch, and when to use each.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-training-loop", "pt-nn-module", "pt-save-load", "dl-attention", "dl-cnn-params", "mod-llm"],

    whenToUse: `<p>You have written the raw loop. Now: when do you keep writing it, and when do you let a library do the work?</p>
<ul>
<li><b>Raw PyTorch</b> — to <i>learn</i>, to debug, or to build something the frameworks do not support. Full control, every line yours.</li>
<li><b>PyTorch Lightning</b> — to scale a <i>standard</i> training job without re-writing the loop. You organize your code into a <code>LightningModule</code> and get multi-GPU (Graphics Processing Unit), AMP (Automatic Mixed Precision), checkpointing, and logging for free.</li>
<li><b>Hugging Face</b> — whenever a <i>pretrained Transformer</i> exists for your task. Text, and increasingly vision/audio/LLMs (Large Language Models). One <code>from_pretrained</code> call beats weeks of training.</li>
<li><b>Domain libraries</b> — <code>torchvision</code> for images (models, datasets, transforms), <code>torchaudio</code> for audio, the Hugging Face stack for text.</li>
</ul>
<p>Versus the alternatives: <b>Keras / TensorFlow</b> trades some flexibility for a simpler, more "batteries-included" production path; <b>JAX</b> is the functional, just-in-time-compiled choice for TPU (Tensor Processing Unit) and cutting-edge research. PyTorch sits in the middle and dominates research and most production today.</p>`,

    application: `<p>This is the map you actually use on the job. A vision team grabs a pretrained <code>torchvision</code> ResNet and fine-tunes it. An NLP (Natural Language Processing) team loads a BERT or Llama checkpoint from Hugging Face and calls <code>Trainer.train()</code>. A research lab writes a <code>LightningModule</code> so the same code runs on one GPU on a laptop and on 64 GPUs on a cluster — unchanged. Every serious team wires in experiment tracking (Weights &amp; Biases, TensorBoard, or MLflow) and, at ship time, exports through ONNX (Open Neural Network Exchange) or serves with TorchServe. Knowing which tool to reach for is half the skill.</p>`,

    pitfalls: `<ul>
<li><b>Reinventing what a library already does well.</b> Hand-rolling data augmentation, a learning-rate scheduler, or a tokenizer that <code>torchvision</code> / Lightning / Hugging Face already ship — tested and fast. Reach for the library first.</li>
<li><b>Abstractions hiding bugs you cannot debug.</b> Lightning and the Hugging Face <code>Trainer</code> are wrappers over the same raw loop you learned. If you never learned the loop, a wrong-shape tensor or a missing <code>zero_grad</code> deep inside becomes magic you cannot fix. Learn the raw loop first; then the frameworks are conveniences, not mysteries.</li>
<li><b>Over-engineering a simple task.</b> A 50-line script does not need a <code>LightningTrainer</code> with callbacks and a sweep config. Match the tool to the size of the job.</li>
<li><b>Version churn across the ecosystem.</b> <code>torch</code>, <code>lightning</code>, <code>transformers</code>, and CUDA (Compute Unified Device Architecture) versions drift and break each other. Pin versions (<code>requirements.txt</code> / a lockfile) and read release notes before upgrading.</li>
<li><b>Trusting a pretrained model blindly.</b> A Hugging Face checkpoint may expect specific preprocessing (its own tokenizer/normalization) and may carry licensing or bias baggage. Use the model's own processor and read its model card.</li>
<li><b>Not learning the raw loop first.</b> The single biggest one: frameworks save time only <i>after</i> the fundamentals are solid. Skip them and every framework error is unfixable. (See <code>pt-training-loop</code>.)</li>
</ul>`,

    bigIdea: `<p>PyTorch is a small, sharp core — tensors and autograd — surrounded by a huge ecosystem. The skill is not memorizing every library; it is knowing the <b>three layers</b> and reaching for the right one: the <b>core</b> (raw control), <b>high-level trainers</b> (remove boilerplate at scale), and <b>pretrained-model hubs</b> (skip training entirely).</p>`,

    buildup: `<p>Think of three concentric rings.</p>
<ol>
<li><b>Core PyTorch</b> — <code>torch</code>, <code>torch.nn</code>, autograd, the loop you wrote by hand. Maximum control. Everything else is built on this.</li>
<li><b>Domain libraries</b> — <code>torchvision</code> (image models, datasets, transforms), <code>torchaudio</code> (audio I/O, spectrograms, pretrained speech models), and for text the Hugging Face <code>datasets</code> + tokenizers stack. They hand you the data plumbing and ready model architectures.</li>
<li><b>High-level frameworks</b> — these remove the training-loop boilerplate:
  <ul>
  <li><b>PyTorch Lightning</b> — you put your model, <code>training_step</code>, and <code>configure_optimizers</code> in a <code>LightningModule</code>; a <code>Trainer</code> runs it, and toggles multi-GPU, AMP, gradient accumulation, and logging with flags.</li>
  <li><b>fastai</b> — opinionated, very few lines to a strong baseline, great for learning.</li>
  <li><b>Ignite</b> — a lighter event/handler engine for the loop.</li>
  <li><b>Accelerate</b> (Hugging Face) — minimal wrapper that makes a raw loop run on multi-GPU/TPU with a few lines.</li>
  <li><b>Hugging Face <code>transformers</code> + <code>Trainer</code></b> — the default for pretrained Transformers and LLMs: <code>from_pretrained</code> to load, <code>Trainer.train()</code> to fine-tune.</li>
  </ul>
</li>
</ol>
<p>Around all of this sit <b>tracking</b> (Weights &amp; Biases, TensorBoard, MLflow — log metrics, compare runs) and <b>deployment</b> (TorchServe to serve; ONNX as a portable export format; TensorRT to optimize for NVIDIA GPUs). See <code>pt-save-load</code> for export and serving.</p>`,

    symbols: [
      { sym: "LightningModule", def: "a class bundling model + training_step + configure_optimizers; the Trainer runs it" },
      { sym: "Trainer", def: "the engine that runs the loop; in Lightning and (separately) in Hugging Face" },
      { sym: "from_pretrained", def: "Hugging Face call that downloads pretrained weights for a named model" },
      { sym: "pipeline", def: "Hugging Face one-liner: load model + tokenizer and run a task end to end" },
      { sym: "ONNX", def: "Open Neural Network Exchange — a portable model format for cross-runtime deployment" }
    ],

    derivation: `<p>How does a framework "remove the loop" without changing the math? It does not. Lightning's <code>Trainer.fit()</code> calls the <i>exact</i> five steps you wrote — <code>zero_grad</code>, forward, loss, <code>backward</code>, <code>step</code> — but it owns the <code>for epoch / for batch</code> scaffolding and the device/precision plumbing. You supply only the part that changes per project: what one training step computes (<code>training_step</code>) and which optimizer to use (<code>configure_optimizers</code>). Flags like <code>devices=4</code> or <code>precision="16-mixed"</code> swap the plumbing (DDP — Distributed Data Parallel — across GPUs, or AMP) without touching your step.</p>
<p>The Hugging Face <code>Trainer</code> is the same idea one ring out: it also owns the loop, but it is specialized for Transformers and pairs with a <code>from_pretrained</code> model + tokenizer, so you usually skip training a model from scratch entirely. The cost of both is the same: when something breaks inside the hidden loop, you need the fundamentals from this course to find it.</p>`,

    example: `<p>Same task — fine-tune an image classifier — three ways. <b>Raw PyTorch</b>: write the <code>DataLoader</code>, the model, and the full epoch/batch loop (the <code>pt-training-loop</code> lesson — roughly 100+ lines for multi-GPU + logging). <b>Lightning</b>: move the per-batch logic into a <code>training_step</code>, add <code>configure_optimizers</code>, then <code>Trainer(max_epochs=5, devices=2).fit(model, dl)</code> — the loop, multi-GPU, and logging are gone from your code. <b>Hugging Face</b>: <code>pipeline("image-classification")</code> may already solve it with <i>zero</i> training. The math is identical; only how much boilerplate you write changes.</p>`,

    demo: function (host) {
      var s = getComputedStyle(document.documentElement);
      var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
      var ink = g("--ink", "#e6edf3"), dim = g("--ink-dim", "#9aa7b4"),
          accent = g("--accent", "#4ea1ff"), accent2 = g("--accent-2", "#7ee787"),
          warn = g("--warn", "#ffb454"), border = g("--border", "#2a3340");

      var rows = [
        { name: "Raw PyTorch", loc: 120, color: warn, note: "most control, most code" },
        { name: "PyTorch Lightning", loc: 50, color: accent, note: "loop + multi-GPU/AMP/logging free" },
        { name: "Hugging Face", loc: 12, color: accent2, note: "pretrained model, least code" }
      ];

      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 240;
      cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var out = document.createElement("div"); out.className = "out";
      out.style.marginTop = "6px"; host.appendChild(out);

      var W = cv.width, H = cv.height, padL = 150, padR = 60, padT = 18, padB = 22;
      var maxL = 120, barH = 34, gap = 26;
      ctx.clearRect(0, 0, W, H);
      ctx.font = "13px sans-serif";
      for (var i = 0; i < rows.length; i++) {
        var y = padT + i * (barH + gap);
        var w = (rows[i].loc / maxL) * (W - padL - padR);
        ctx.fillStyle = rows[i].color;
        ctx.fillRect(padL, y, w, barH);
        ctx.fillStyle = ink; ctx.textAlign = "right";
        ctx.fillText(rows[i].name, padL - 10, y + barH / 2 + 4);
        ctx.textAlign = "left";
        ctx.fillText(rows[i].loc + " lines", padL + w + 8, y + barH / 2 + 4);
        ctx.fillStyle = dim; ctx.font = "11px sans-serif";
        ctx.fillText(rows[i].note, padL + 2, y - 4);
        ctx.font = "13px sans-serif";
      }
      ctx.fillStyle = dim; ctx.textAlign = "left"; ctx.font = "12px sans-serif";
      ctx.fillText("setup effort (lines of code) for the same fine-tune task", padL, H - 4);
      out.innerHTML = "Same task, three stacks. Raw gives every line to you; Lightning hands you the loop and the multi-GPU/AMP/logging plumbing; Hugging Face often needs almost nothing because the model is already trained. <i>Illustrative counts.</i>";
    },

    practice: [
      {
        q: `You need to fine-tune a well-known text classifier (a Transformer) on your labeled data, and you want it working by tomorrow. Which part of the ecosystem do you reach for, and why?`,
        steps: [
          { do: `Notice the model already exists pretrained.`, why: `A pretrained Transformer means you skip training from scratch — the expensive part.` },
          { do: `Pick the hub built for exactly this.`, why: `Hugging Face <code>transformers</code> gives <code>AutoModelForSequenceClassification.from_pretrained</code> + a matching tokenizer + a <code>Trainer</code>.` }
        ],
        answer: `Hugging Face. Load with <code>from_pretrained</code>, tokenize with the model's own tokenizer, and fine-tune with the <code>Trainer</code> — far less code than a raw loop, and you start from learned weights instead of random ones.`
      },
      {
        q: `Your raw training script works on one GPU. You now have 4 GPUs and want multi-GPU training plus mixed precision, but you would rather not rewrite the loop with Distributed Data Parallel by hand. What is the lightest-touch move?`,
        steps: [
          { do: `Identify what is reusable vs. what is plumbing.`, why: `Your per-batch math (forward/loss/backward) stays; only the loop scaffolding and device/precision handling change.` },
          { do: `Move the per-batch logic into a framework's hook.`, why: `In Lightning, put it in <code>training_step</code> + <code>configure_optimizers</code>, then set <code>Trainer(devices=4, precision="16-mixed")</code>.` }
        ],
        answer: `Use PyTorch Lightning (or Hugging Face Accelerate for a thinner wrapper). Lightning's <code>Trainer</code> flags turn on multi-GPU (DDP) and AMP without you writing the distributed loop. Your math is unchanged.`
      },
      {
        q: `A teammate insists on using Lightning and Hugging Face for everything and never writing a raw loop. Why is that risky for a learner?`,
        steps: [
          { do: `Recall that these frameworks wrap the same five-step loop.`, why: `They hide <code>zero_grad</code>/forward/loss/<code>backward</code>/<code>step</code>, not replace them.` },
          { do: `Imagine a subtle bug inside the hidden loop.`, why: `A wrong tensor shape or a device mismatch surfaces as a cryptic framework error; without the fundamentals you cannot trace it.` }
        ],
        answer: `Frameworks save time only after you understand the raw loop. Skip the fundamentals and every framework error is unfixable magic. Learn the loop first (<code>pt-training-loop</code>), then use Lightning/Hugging Face as conveniences — not crutches.`
      }
    ]
  });

  window.CODE["pt-ecosystem"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Two snippets that replace hand-written work. <b>(A)</b> A <code>LightningModule</code> with <code>training_step</code> and <code>configure_optimizers</code>, run by <code>Trainer(max_epochs=...).fit(...)</code> — the same five steps as <code>pt-training-loop</code>, but the loop, device handling, and logging are now the framework's job. <b>(B)</b> A Hugging Face snippet using a high-level <code>pipeline</code> and a raw <code>AutoModel</code> to use a <i>pretrained</i> model with no training at all. Paste into Google Colab — the first cell auto-installs <code>lightning</code> and <code>transformers</code> (torch ships preinstalled there).</p>`,
    code: `# Colab setup: torch is preinstalled; install the framework layers.
!pip -q install lightning transformers

# =====================================================================
# (A) PyTorch Lightning — the hand-written loop, organized away.
# =====================================================================
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import TensorDataset, DataLoader
import lightning as L

torch.manual_seed(0)

# tiny synthetic 2-class dataset (same spirit as the training-loop lesson)
N, D = 1000, 8
y = torch.randint(0, 2, (N,))
X = torch.randn(2, D)[y] * 2.0 + torch.randn(N, D)
train_dl = DataLoader(TensorDataset(X[:800], y[:800]), batch_size=32, shuffle=True)
val_dl   = DataLoader(TensorDataset(X[800:], y[800:]), batch_size=64)

class LitClassifier(L.LightningModule):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(D, 32), nn.ReLU(), nn.Dropout(0.2),
            nn.Linear(32, 2),                 # raw logits (no softmax!)
        )

    def forward(self, x):
        return self.net(x)

    def training_step(self, batch, batch_idx):
        x, y = batch
        logits = self(x)
        loss = F.cross_entropy(logits, y)     # expects logits + int labels
        self.log("train_loss", loss, prog_bar=True)
        return loss                            # Lightning calls backward()+step()

    def validation_step(self, batch, batch_idx):
        x, y = batch
        logits = self(x)
        acc = (logits.argmax(1) == y).float().mean()
        self.log("val_acc", acc, prog_bar=True)

    def configure_optimizers(self):
        return torch.optim.Adam(self.parameters(), lr=1e-2)

# No epoch/batch loop, no .to(device), no zero_grad/backward/step in YOUR code.
# Flip on multi-GPU + mixed precision with flags: devices=4, precision="16-mixed".
trainer = L.Trainer(max_epochs=15, accelerator="auto", devices=1,
                    logger=False, enable_checkpointing=False)
trainer.fit(LitClassifier(), train_dl, val_dl)

# =====================================================================
# (B) Hugging Face — use a PRETRAINED model, often with no training.
# =====================================================================
from transformers import pipeline, AutoTokenizer, AutoModel

# High-level: one line loads model + tokenizer and runs the task.
clf = pipeline("sentiment-analysis")          # downloads a pretrained model
print(clf("PyTorch's ecosystem makes shipping models fast."))
# -> [{'label': 'POSITIVE', 'score': 0.99...}]

# Lower-level: load a backbone + tokenizer yourself to get embeddings.
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
bert = AutoModel.from_pretrained("bert-base-uncased")
enc = tok("hello pytorch", return_tensors="pt")   # tokenizer = the model's own
with torch.no_grad():                              # inference: no graph
    out = bert(**enc)
print("sequence embedding shape:", out.last_hidden_state.shape)  # [1, seq, 768]
`
  };

  window.CODEVIZ["pt-ecosystem"] = {
    question: "For the same fine-tune task, how much code do you write in raw PyTorch vs. Lightning vs. Hugging Face?",
    charts: [{
      type: "bars",
      title: "Setup effort (lines of code) for the same task — less code, less control",
      xlabel: "stack",
      ylabel: "lines of code (illustrative)",
      labels: ["Raw PyTorch", "PyTorch Lightning", "Hugging Face"],
      values: [120, 50, 12],
      valueLabels: ["120", "50", "12"],
      colors: ["#ffb454", "#4ea1ff", "#7ee787"]
    }],
    caption: "Illustrative line counts for fine-tuning the same classifier (with multi-GPU + AMP + logging) three ways. Raw PyTorch writes every line — the most control and the most code (~120). Lightning keeps your data and model but absorbs the loop, device handling, multi-GPU, and logging (~50). Hugging Face often starts from a pretrained model, so you write the least (~12) and trade away the most control. The trend is the lesson, not the exact numbers: more code buys more control; less code buys speed on standard tasks.",
    code: `import numpy as np

# Illustrative line-count breakdown for the SAME task (fine-tune + multi-GPU
# + AMP + logging), summed per stack. Components are plausible estimates;
# the point is the monotonic trend, not exact counts.
labels = ["Raw PyTorch", "PyTorch Lightning", "Hugging Face"]
#            data  model  loop  scale  logging  misc
raw   = np.array([18,   14,   40,   22,     12,    14])  # write everything
light = np.array([18,   14,   12,    0,      0,     6])  # Trainer owns loop/scale/log
hf    = np.array([ 6,    2,    0,    0,      0,     4])  # pretrained model, pipeline

vals = [int(raw.sum()), int(light.sum()), int(hf.sum())]
for name, v in zip(labels, vals):
    print(f"{name:18s} {v:3d} lines")
print("ratio raw:lightning:hf =",
      round(vals[0] / vals[2], 1), ": ",
      round(vals[1] / vals[2], 1), ": 1")
# -> Raw PyTorch        120 lines
#    PyTorch Lightning   50 lines
#    Hugging Face        12 lines
`
  };
})();
