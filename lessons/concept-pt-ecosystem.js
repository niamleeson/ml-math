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
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["pt-training-loop", "pt-nn-module", "pt-save-load", "dl-attention", "dl-cnn-params", "mod-llm"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>place any tool in the three rings of the ecosystem &mdash; core PyTorch, domain libraries, high-level frameworks &mdash; and reach for the right one for the job;</li>
<li>organize a training job into a <code>LightningModule</code> + <code>Trainer</code> and know that it runs the <i>exact</i> five steps you wrote by hand;</li>
<li>load a pretrained model from Hugging Face (a <code>pipeline</code> or <code>from_pretrained</code> + its own tokenizer) and skip training entirely.</li>
</ul>
<p><b>The API you'll own:</b> <code>lightning.LightningModule</code>, <code>lightning.Trainer</code>, <code>transformers.pipeline</code>, <code>AutoModel.from_pretrained</code>, <code>torchvision.models</code>.</p>`,

    concept: `<p>PyTorch is a small, sharp core &mdash; tensors and autograd &mdash; surrounded by a huge ecosystem. The skill is not memorizing every library; it is knowing the <b>three rings</b> and reaching for the right one:</p>
<ul>
<li><b>Core PyTorch</b> &mdash; <code>torch</code>, <code>torch.nn</code>, autograd, the loop you wrote by hand. Maximum control; everything else is built on it. Reach for it to learn, to debug, or to build what the frameworks do not support.</li>
<li><b>Domain libraries</b> &mdash; <code>torchvision</code> (image models, datasets, transforms), <code>torchaudio</code> (audio), and the Hugging Face stack for text. They hand you the data plumbing and ready architectures.</li>
<li><b>High-level frameworks</b> &mdash; <b>PyTorch Lightning</b> (organize your code into a <code>LightningModule</code>, get multi-GPU, AMP, checkpointing, logging for free), fastai, Ignite, Accelerate, and Hugging Face <code>transformers</code> + <code>Trainer</code>.</li>
</ul>
<p>A framework does not change the math. Lightning's <code>Trainer.fit()</code> calls the <i>exact</i> five steps you learned &mdash; <code>zero_grad</code>, forward, loss, <code>backward</code>, <code>step</code> &mdash; but it owns the <code>for epoch / for batch</code> scaffolding and the device/precision plumbing. You supply only what changes per project: <code>training_step</code> and <code>configure_optimizers</code>. Flags like <code>devices=4</code> or <code>precision="16-mixed"</code> swap in DDP or AMP without touching your step. The Hugging Face <code>Trainer</code> is the same idea one ring out, specialized for Transformers and paired with <code>from_pretrained</code> so you often skip training a model from scratch.</p>
<p>The catch: frameworks save time only <i>after</i> the fundamentals are solid. When something breaks inside the hidden loop, you need the raw loop from this course to find it. Versus alternatives, <b>Keras/TensorFlow</b> trades flexibility for a simpler production path and <b>JAX</b> is the functional, just-in-time-compiled choice for TPUs and cutting-edge research; PyTorch sits in the middle and dominates today.</p>`,

    apiTable: [
      { sig: "class M(L.LightningModule): ...", does: "Bundle the model + <code>training_step</code> + <code>configure_optimizers</code>. The <code>Trainer</code> supplies the loop.", snippet: "import lightning as L\nclass LitNet(L.LightningModule): ..." },
      { sig: "training_step(self, batch, batch_idx)", does: "Compute and <code>return</code> the loss for one batch. Lightning calls <code>backward()</code> + <code>step()</code> for you.", snippet: "def training_step(self, batch, i):\n    x, y = batch\n    return F.cross_entropy(self(x), y)" },
      { sig: "configure_optimizers(self)", does: "Return the optimizer (and optional scheduler) Lightning will drive.", snippet: "return torch.optim.Adam(self.parameters(), lr=1e-2)" },
      { sig: "L.Trainer(max_epochs=, devices=, precision=)", does: "The engine that runs the loop. Flags toggle multi-GPU, AMP, accumulation, logging &mdash; without touching your step.", snippet: "trainer = L.Trainer(max_epochs=5, devices=1)" },
      { sig: "trainer.fit(model, train_dl, val_dl)", does: "Run the whole loop &mdash; you never write <code>for batch</code>, <code>.to(device)</code>, or <code>zero_grad</code> yourself.", snippet: "trainer.fit(LitNet(), train_dl)" },
      { sig: "pipeline(task)", does: "Hugging Face one-liner: download a pretrained model + tokenizer and run a task end to end &mdash; zero training.", snippet: "clf = pipeline(\"sentiment-analysis\")" },
      { sig: "AutoModel.from_pretrained(name)", does: "Download a pretrained backbone. Pair with its own <code>AutoTokenizer</code> to avoid train/serve skew.", snippet: "bert = AutoModel.from_pretrained(\"bert-base-uncased\")" },
      { sig: "torchvision.models.resnet18(weights=\"DEFAULT\")", does: "A ready architecture with pretrained ImageNet weights &mdash; fine-tune instead of training from scratch.", snippet: "model = torchvision.models.resnet18(weights=\"DEFAULT\")" },
      { sig: "torch.onnx.export(model, x, path, opset_version=)", does: "The deployment ring: write a portable ONNX artifact to hand to other runtimes.", snippet: "torch.onnx.export(model, x, \"m.onnx\", opset_version=17)" }
    ],

    codeTour: [
      {
        explain: `<b>A minimal <code>LightningModule</code>.</b> Two hooks are the whole contract: <code>training_step</code> returns a loss, <code>configure_optimizers</code> returns the optimizer. The <code>__mro__</code> check confirms it subclasses <code>LightningModule</code>. Colab auto-installs <code>lightning</code>.`,
        code: `import torch, torch.nn as nn, torch.nn.functional as F\nimport lightning as L\n\nclass LitNet(L.LightningModule):\n    def __init__(self):\n        super().__init__()\n        self.net = nn.Linear(4, 2)        # raw logits (no softmax)\n    def forward(self, x):\n        return self.net(x)\n    def training_step(self, batch, batch_idx):\n        x, y = batch\n        return F.cross_entropy(self(x), y)   # Lightning runs backward()+step()\n    def configure_optimizers(self):\n        return torch.optim.Adam(self.parameters(), lr=1e-2)\n\nm = LitNet()\nprint(type(m).__mro__[1].__name__)`,
        output: `LightningModule`
      },
      {
        explain: `<b>The <code>Trainer</code> runs the loop.</b> Wrap synthetic tensors in a <code>DataLoader</code> and call <code>fit</code> &mdash; no <code>for batch</code>, no <code>.to(device)</code> in your code. Flipping <code>devices=4, precision="16-mixed"</code> would turn on multi-GPU + AMP without any other change.`,
        code: `from torch.utils.data import TensorDataset, DataLoader\ntorch.manual_seed(0)\nX = torch.randn(100, 4)\ny = torch.randint(0, 2, (100,))\ntrain_dl = DataLoader(TensorDataset(X, y), batch_size=16, shuffle=True)\n\ntrainer = L.Trainer(max_epochs=2, accelerator="cpu", devices=1,\n                    logger=False, enable_checkpointing=False)\ntrainer.fit(LitNet(), train_dl)\nprint("done")`,
        output: `done`
      },
      {
        explain: `<b>The framework does not change the math.</b> The same update done by hand: the explicit five steps Lightning's <code>training_step</code> hides. Seeing them raw is the fundamentals the lesson insists on.`,
        code: `torch.manual_seed(0)\nmodel = nn.Linear(4, 2)\nopt = torch.optim.Adam(model.parameters(), lr=1e-2)\nx = torch.randn(8, 4)\ny = torch.randint(0, 2, (8,))\nopt.zero_grad()                       # 1\nlogits = model(x)                     # 2 forward\nloss = F.cross_entropy(logits, y)     # 3 loss\nloss.backward()                       # 4 backward\nopt.step()                            # 5 step\nprint(round(loss.item(), 4))`,
        output: `0.7311`
      },
      {
        explain: `<b>Hugging Face, no training.</b> One <code>pipeline</code> call downloads a pretrained model + its tokenizer and runs the task. The result is a list of dicts with a label and a confidence score.`,
        code: `from transformers import pipeline\nclf = pipeline("sentiment-analysis")\nout = clf("PyTorch's ecosystem makes shipping fast.")\nprint(out[0]["label"])\nprint(round(out[0]["score"], 2))`,
        output: `POSITIVE\n1.0`
      },
      {
        explain: `<b>A pretrained backbone with its own tokenizer.</b> Pair <code>AutoTokenizer</code> with <code>AutoModel.from_pretrained</code> so preprocessing matches the model. BERT-base emits a 768-dim hidden state per token; the four tokens are <code>[CLS] hello pytorch [SEP]</code>.`,
        code: `from transformers import AutoTokenizer, AutoModel\ntok = AutoTokenizer.from_pretrained("bert-base-uncased")\nbert = AutoModel.from_pretrained("bert-base-uncased")\nenc = tok("hello pytorch", return_tensors="pt")\nwith torch.no_grad():\n    out = bert(**enc)\nprint(out.last_hidden_state.shape)`,
        output: `torch.Size([1, 4, 768])`
      }
    ],

    expected: `<p>Run the tour in Colab (the setup cell installs <code>lightning</code> and <code>transformers</code>):</p>
<ul>
<li>The first block prints <code>LightningModule</code> &mdash; the class you wrote is indeed a Lightning module, with just two hooks defined.</li>
<li><code>done</code> prints after <code>fit</code> ran the entire 2-epoch loop for you &mdash; you never wrote the batch loop, device moves, or <code>zero_grad/backward/step</code>.</li>
<li>The raw-loop block prints the same loss (<code>0.7311</code> at seed 0) the framework would compute &mdash; direct proof the math is identical; only the boilerplate differs.</li>
<li>The pipeline prints <code>POSITIVE</code> with a score near <code>1.0</code> on a clearly positive sentence, using a model you never trained.</li>
<li>The BERT shape is <code>[1, 4, 768]</code>: batch 1, four tokens, 768 hidden dim. The exact loss/score can shift slightly with library versions; the shapes and labels are what matter.</li>
</ul>`,

    cheatsheet: [
      { code: "class LitNet(L.LightningModule): ...", note: "model + two hooks" },
      { code: "def training_step(self, batch, i): return loss", note: "Lightning runs backward()+step()" },
      { code: "def configure_optimizers(self): return Adam(...)", note: "the optimizer the Trainer drives" },
      { code: "L.Trainer(max_epochs=5, devices=1).fit(model, dl)", note: "runs the loop; devices=4 -> multi-GPU" },
      { code: "clf = pipeline('sentiment-analysis')", note: "pretrained model + tokenizer, zero training" },
      { code: "AutoModel.from_pretrained('bert-base-uncased')", note: "backbone; pair with its AutoTokenizer" },
      { code: "torchvision.models.resnet18(weights='DEFAULT')", note: "ready architecture + pretrained weights" },
      { code: "torch.onnx.export(model, x, 'm.onnx', opset_version=17)", note: "portable export for deployment" }
    ],

    deeper: `<p>The frameworks organize away the loop you built in <code>pt-training-loop</code>, but the pieces are exactly the course's fundamentals: a model is the <a onclick="App.open('dl-cnn-params')">layered architecture</a> from <code>pt-nn-module</code>, and the Hugging Face Transformers you load with <code>from_pretrained</code> are stacks of the <a onclick="App.open('dl-attention')">attention</a> mechanism scaled up into <a onclick="App.open('mod-llm')">large language models</a>. The deployment ring &mdash; ONNX export, TorchServe &mdash; is covered in <code>pt-save-load</code> and <code>pt-deployment</code>. Lightning's <code>devices=4</code> flag is the <code>pt-distributed</code> lesson's DDP, turned on by a single argument. The lesson stands: more code buys control, less code buys speed on standard tasks &mdash; but only the fundamentals let you debug when an abstraction leaks.</p>`,

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

    example: `<p>Same task &mdash; fine-tune an image classifier with multi-GPU + AMP + logging &mdash; three ways. Count the
       (illustrative) lines you write per stack, summed over the components of the job:</p>
       <table class="extable">
         <caption>Lines of code you write, by component, for the SAME fine-tune job</caption>
         <thead><tr><th>stack</th><th class="num">data</th><th class="num">model</th><th class="num">loop</th><th class="num">scale</th><th class="num">logging</th><th class="num">misc</th><th class="num">total</th></tr></thead>
         <tbody>
           <tr><td class="row-h">Raw PyTorch</td><td class="num">18</td><td class="num">14</td><td class="num">40</td><td class="num">22</td><td class="num">12</td><td class="num">14</td><td class="num">120</td></tr>
           <tr><td class="row-h">PyTorch Lightning</td><td class="num">18</td><td class="num">14</td><td class="num">12</td><td class="num">0</td><td class="num">0</td><td class="num">6</td><td class="num">50</td></tr>
           <tr><td class="row-h">Hugging Face</td><td class="num">6</td><td class="num">2</td><td class="num">0</td><td class="num">0</td><td class="num">0</td><td class="num">4</td><td class="num">12</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Raw PyTorch:</b> you write everything &mdash; $18 + 14 + 40 + 22 + 12 + 14 = 120$ lines (the
         <code>pt-training-loop</code> lesson's full epoch/batch loop, plus DDP and logging by hand).</li>
         <li><b>Lightning:</b> the <code>Trainer</code> owns the loop, scaling, and logging, so those columns drop to
         12/0/0: $18 + 14 + 12 + 0 + 0 + 6 = 50$ lines. <code>Trainer(max_epochs=5, devices=2).fit(model, dl)</code>
         turns on multi-GPU with one flag.</li>
         <li><b>Hugging Face:</b> a pretrained model means almost no data/model/loop code:
         $6 + 2 + 0 + 0 + 0 + 4 = 12$ lines &mdash; <code>pipeline("image-classification")</code> may solve it with
         <i>zero</i> training.</li>
       </ul>
       <p>Ratio of effort: $120 : 50 : 12 \\approx 10 : 4.2 : 1$. The math is identical across all three; only how much
       boilerplate you write changes &mdash; and every line a framework removes is a line you can no longer reach in
       when an abstraction leaks.</p>`,

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
        q: `<b>Type this in Colab.</b> Define a minimal <code>LightningModule</code> called <code>LitNet</code> wrapping <code>nn.Linear(4, 2)</code>, with a <code>training_step</code> that computes <code>F.cross_entropy</code> on a <code>(batch, labels)</code> tuple and a <code>configure_optimizers</code> returning <code>Adam(lr=1e-2)</code>. Instantiate it and print <code>type(m).__mro__[1].__name__</code> to confirm it subclasses <code>LightningModule</code>. (lightning is auto-installed by the setup cell.)`,
        steps: [
          { do: `Subclass <code>L.LightningModule</code> and implement <code>training_step</code> + <code>configure_optimizers</code>.`, why: `These two hooks are the minimum a <code>LightningModule</code> needs; the <code>Trainer</code> supplies the loop, device handling, and logging.` },
          { do: `Return the loss from <code>training_step</code>.`, why: `Lightning calls <code>backward()</code> and <code>optimizer.step()</code> for you on whatever loss you return &mdash; the same five steps, organized away.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
import torch.nn.functional as F
import lightning as L

class LitNet(L.LightningModule):
    def __init__(self):
        super().__init__()
        self.net = nn.Linear(4, 2)        # raw logits (no softmax)
    def forward(self, x):
        return self.net(x)
    def training_step(self, batch, batch_idx):
        x, y = batch
        loss = F.cross_entropy(self(x), y)   # Lightning runs backward()+step()
        return loss
    def configure_optimizers(self):
        return torch.optim.Adam(self.parameters(), lr=1e-2)

m = LitNet()
print(type(m).__mro__[1].__name__)   # LightningModule</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Train the <code>LitNet</code> from the previous task for 2 epochs on a tiny synthetic dataset (100 samples, 4 features, 2 classes) using a <code>Trainer</code>. Build a <code>DataLoader</code>, run <code>L.Trainer(max_epochs=2, accelerator="cpu", devices=1, logger=False, enable_checkpointing=False).fit(...)</code>, and print "done". Use <code>torch.manual_seed(0)</code>.`,
        steps: [
          { do: `Wrap the synthetic tensors in a <code>TensorDataset</code> + <code>DataLoader</code>.`, why: `The <code>Trainer</code> iterates the loader; you never write the <code>for batch</code> loop yourself.` },
          { do: `Call <code>Trainer(...).fit(model, train_dl)</code>.`, why: `<code>fit</code> runs the whole loop &mdash; flipping <code>devices=4, precision="16-mixed"</code> would turn on multi-GPU + AMP without touching your code.` }
        ],
        answer: `<pre><code>import torch
from torch.utils.data import TensorDataset, DataLoader
import lightning as L

torch.manual_seed(0)
X = torch.randn(100, 4)
y = torch.randint(0, 2, (100,))
train_dl = DataLoader(TensorDataset(X, y), batch_size=16, shuffle=True)

trainer = L.Trainer(max_epochs=2, accelerator="cpu", devices=1,
                    logger=False, enable_checkpointing=False)
trainer.fit(LitNet(), train_dl)
print("done")     # Lightning ran the loop for you</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Use a Hugging Face <code>pipeline</code> with NO training. Create <code>clf = pipeline("sentiment-analysis")</code>, run it on the string <code>"PyTorch's ecosystem makes shipping fast."</code>, and print the predicted <code>label</code> and rounded <code>score</code>. (transformers is auto-installed by the setup cell.)`,
        steps: [
          { do: `Call <code>pipeline("sentiment-analysis")</code>.`, why: `One line downloads a pretrained model + its tokenizer and wires them into a ready task &mdash; zero training.` },
          { do: `Read <code>result[0]["label"]</code> and <code>["score"]</code>.`, why: `The pipeline returns a list of dicts; the label is the class and the score is its confidence.` }
        ],
        answer: `<pre><code>from transformers import pipeline

clf = pipeline("sentiment-analysis")    # downloads a pretrained model
out = clf("PyTorch's ecosystem makes shipping fast.")
print(out[0]["label"])                  # POSITIVE
print(round(out[0]["score"], 2))        # 1.0  (high confidence)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Load a pretrained backbone with <code>from_pretrained</code> and inspect the embedding shape. Use <code>AutoTokenizer</code> and <code>AutoModel</code> on <code>"bert-base-uncased"</code>, tokenize <code>"hello pytorch"</code> with <code>return_tensors="pt"</code>, run it under <code>torch.no_grad()</code>, and print <code>out.last_hidden_state.shape</code>. Predict the last dimension before running.`,
        steps: [
          { do: `Pair the model's OWN tokenizer with <code>AutoModel.from_pretrained</code>.`, why: `A pretrained model expects its own preprocessing; using the matching tokenizer avoids train/serve skew.` },
          { do: `Run inference inside <code>torch.no_grad()</code> and read <code>last_hidden_state.shape</code>.`, why: `BERT-base outputs a 768-dim hidden state per token; the batch is 1 and seq length includes the [CLS]/[SEP] tokens.` }
        ],
        answer: `<pre><code>import torch
from transformers import AutoTokenizer, AutoModel

tok = AutoTokenizer.from_pretrained("bert-base-uncased")
bert = AutoModel.from_pretrained("bert-base-uncased")
enc = tok("hello pytorch", return_tensors="pt")   # model's own tokenizer
with torch.no_grad():
    out = bert(**enc)
print(out.last_hidden_state.shape)   # torch.Size([1, 4, 768])
# batch 1, 4 tokens ([CLS] hello pytorch [SEP]), 768 hidden dim</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Grab a pretrained <code>torchvision</code> model and count its parameters. Load <code>torchvision.models.resnet18(weights="DEFAULT")</code>, put it in <code>eval()</code>, and print the total parameter count with <code>sum(p.numel() for p in model.parameters())</code>. Then run a random <code>(1, 3, 224, 224)</code> image through it and print the output shape.`,
        steps: [
          { do: `Load <code>resnet18(weights="DEFAULT")</code> from <code>torchvision.models</code>.`, why: `Domain libraries ship ready architectures with pretrained weights, so you fine-tune instead of training from scratch.` },
          { do: `Run a <code>(1, 3, 224, 224)</code> tensor through it and read the shape.`, why: `ImageNet ResNet-18 outputs 1000 class logits, so the shape is <code>(1, 1000)</code>.` }
        ],
        answer: `<pre><code>import torch
import torchvision

model = torchvision.models.resnet18(weights="DEFAULT").eval()
print(sum(p.numel() for p in model.parameters()))   # 11689512  (~11.7M)

x = torch.randn(1, 3, 224, 224)
with torch.no_grad():
    out = model(x)
print(out.shape)     # torch.Size([1, 1000])  -- ImageNet logits</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show that a framework does NOT change the math. Take the <code>LitNet</code>'s <code>training_step</code> logic and write the equivalent RAW five-step update by hand on <code>nn.Linear(4, 2)</code>: <code>zero_grad</code>, forward, <code>cross_entropy</code>, <code>backward</code>, <code>step</code>. Run one step on a <code>(8, 4)</code> batch and print the loss. Use <code>torch.manual_seed(0)</code>.`,
        steps: [
          { do: `Write the explicit <code>optimizer.zero_grad()</code> &rarr; <code>forward</code> &rarr; <code>loss</code> &rarr; <code>backward()</code> &rarr; <code>step()</code> sequence.`, why: `These are the exact five steps Lightning's <code>training_step</code> hides; seeing them raw is the fundamentals the lesson insists on.` },
          { do: `Print <code>loss.item()</code>.`, why: `Confirms the hand-written step computes the same quantity the framework would.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)
model = nn.Linear(4, 2)
optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)

x = torch.randn(8, 4)
y = torch.randint(0, 2, (8,))

optimizer.zero_grad()              # 1
logits = model(x)                  # 2 forward
loss = F.cross_entropy(logits, y)  # 3 loss
loss.backward()                    # 4 backward
optimizer.step()                   # 5 step
print(round(loss.item(), 4))       # 0.7311</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Export a model to ONNX (the deployment ring of the ecosystem) and confirm the artifact. Build <code>nn.Linear(10, 3).eval()</code>, call <code>torch.onnx.export</code> with a <code>(1, 10)</code> example and <code>opset_version=17</code>, then print <code>os.path.exists("eco.onnx")</code> and the file size in bytes.`,
        steps: [
          { do: `Call <code>torch.onnx.export(model, example, "eco.onnx", opset_version=17)</code>.`, why: `ONNX is the portable export format the ecosystem uses to hand a model to other runtimes (ONNX Runtime, TensorRT).` },
          { do: `Verify with <code>os.path.exists</code> and <code>os.path.getsize</code>.`, why: `Confirms the export wrote a real artifact you could ship.` }
        ],
        answer: `<pre><code>import torch, torch.nn as nn, os

model = nn.Linear(10, 3).eval()
x = torch.randn(1, 10)
torch.onnx.export(model, x, "eco.onnx",
                  input_names=["input"], output_names=["out"],
                  opset_version=17)
print(os.path.exists("eco.onnx"))     # True
print(os.path.getsize("eco.onnx") &gt; 0)  # True</code></pre>`
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
    question: "Read the trade-off chart: each bar is a stack, taller = more code you write. The right tool is the shortest bar whose control you still need — and the standard ladder (raw > Lightning > Hugging Face) only holds for a STANDARD task.",
    charts: [
      {
        type: "bars",
        title: "Standard task: more code buys more control (raw > Lightning > HF)",
        xlabel: "stack",
        ylabel: "lines of code (illustrative)",
        labels: ["Raw PyTorch", "PyTorch Lightning", "Hugging Face"],
        values: [120, 50, 12],
        valueLabels: ["120", "50", "12"],
        colors: ["#ffb454", "#4ea1ff", "#7ee787"],
        interpret: "<b>Each bar = one way to do the SAME fine-tune job (with multi-GPU + mixed precision + logging); height = lines of code you write.</b> Read it left to right as a ladder: raw PyTorch writes every line (~120, orange = most work), Lightning absorbs the loop, device handling, and logging (~50, blue), Hugging Face starts from a pretrained model so you write almost nothing (~12, green). <b>Conclude:</b> the bars shrink as you climb the rings, but the control you give up grows the same way. Pick the shortest bar that still lets you change what you need to change. Illustrative counts; the monotonic trend is the point."
      },
      {
        type: "bars",
        title: "The hidden axis: code DOWN means control DOWN",
        xlabel: "stack",
        ylabel: "control retained (%) vs code written (lines)",
        series: [
          { name: "lines of code", color: "#9aa7b4", points: [[0, 120], [1, 50], [2, 12]] },
          { name: "control retained (%)", color: "#c89bff", points: [[0, 100], [1, 60], [2, 25]] }
        ],
        labels: ["Raw PyTorch", "PyTorch Lightning", "Hugging Face"],
        interpret: "<b>Illustrative. Same three stacks, but now two bars per stack: grey = lines you write, purple = how much of the loop you still control.</b> They fall together left to right — that is the whole trade-off in one picture. The grey bars dropping is the appeal (less work); the purple bars dropping is the cost (when something breaks deep in a hidden loop, you have fewer knobs and less visibility). <b>Read it as:</b> there is no free lunch; every line a framework removes is a line you can no longer easily reach in."
      },
      {
        type: "bars",
        title: "Wrong tool for a tiny task: the ladder inverts",
        xlabel: "stack",
        ylabel: "lines of code for a 1-file, 1-GPU script (illustrative)",
        labels: ["Raw PyTorch", "PyTorch Lightning", "Hugging Face"],
        values: [25, 45, 10],
        valueLabels: ["25", "45", "10"],
        colors: ["#7ee787", "#ff7b72", "#7ee787"],
        interpret: "<b>Illustrative.</b> Same axes, but now the job is tiny: one file, one GPU, no logging, no multi-GPU. The ladder breaks — <b>Lightning is now the TALLEST bar (red)</b>, because its boilerplate (a LightningModule, configure_optimizers, a Trainer) costs more than just writing the 25-line raw loop. <b>Diagnose:</b> this is over-engineering. A framework only pays off when the work it removes (scaling, AMP, logging) actually exists. <b>Fix:</b> match the tool to the size of the job; reach for raw PyTorch (or a pretrained pipeline) for small scripts."
      }
    ],
    caption: "",
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
