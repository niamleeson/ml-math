/* =====================================================================
   PyTorch (a complete course) — Saving and loading models.
   id: pt-save-load
   Self-contained lesson: window.LESSONS / window.CODE / window.CODEVIZ.
   CODE runs in Google Colab (torch preinstalled, runnable:false here).
   CODEVIZ computes real numbers with numpy (param-count -> bytes; reload check).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "pt-save-load",
    title: "Saving and loading models",
    tagline: "Save the state_dict (just the learned numbers), reload it into a fresh model, and call eval() — the safe, portable way.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["pt-tensors", "pt-tensor-ops", "dl-dropout", "dl-batchnorm", "dl-optimizers"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>save just the learned numbers with <code>torch.save(model.state_dict(), path)</code> and reload them into a fresh model with <code>load_state_dict</code>;</li>
<li>call <code>model.eval()</code> after loading so dropout and batch-norm behave for inference, and verify outputs match the original;</li>
<li>write a full checkpoint (model + optimizer + epoch + loss) to resume training, and use <code>map_location</code>, <code>strict=False</code>, and <code>weights_only=True</code> on load.</li>
</ul>
<p><b>The API you'll own:</b> <code>model.state_dict()</code>, <code>torch.save</code>, <code>torch.load</code>, <code>load_state_dict</code>, <code>model.eval()</code>, <code>map_location</code>, <code>strict=False</code>, <code>weights_only=True</code>.</p>`,

    concept: `<p>A trained model is two things: <b>code</b> (the class that defines the layers) and <b>numbers</b> (the learned weights). Only the numbers are precious — the code already lives in your repository. So PyTorch's recommended save is just the numbers: <code>model.state_dict()</code>, a plain dictionary mapping each parameter name (like <code>"fc1.weight"</code>) to its tensor. To restore, you re-run your code to build a fresh, randomly-initialized model, then pour the saved numbers back in with <code>load_state_dict</code>.</p>
<p>Separating numbers from code is what makes the file portable: it survives refactors, file moves, and machine changes, because it never depended on your code's location. Two layers build on top of that:</p>
<ul>
<li><b>Checkpoint to resume training.</b> A checkpoint is just a bigger dictionary — the model's <code>state_dict</code>, the optimizer's <code>state_dict</code> (so Adam's momentum survives), the current epoch, and the last loss — saved together so you pick up exactly where you stopped.</li>
<li><b>Load for inference.</b> Rebuild the class, <code>load_state_dict</code>, then call <code>eval()</code> so dropout (see <a onclick="App.open('dl-dropout')">dl-dropout</a>) and batch-norm (see <a onclick="App.open('dl-batchnorm')">dl-batchnorm</a>) switch from training to inference behaviour, and wrap the forward in <code>torch.no_grad()</code>.</li>
</ul>
<p>The one rule to remember: <b>save the <code>state_dict</code></b>, not the whole model object — pickling the object stores the class by reference and breaks on any refactor.</p>`,

    apiTable: [
      { sig: "model.state_dict()", does: "An <code>OrderedDict</code> mapping each dotted parameter name (<code>fc1.weight</code>) and buffer to its tensor. The numbers, not the code.", snippet: "sd = model.state_dict()" },
      { sig: "torch.save(obj, path)", does: "Pickle any object — a <code>state_dict</code> or a whole checkpoint dictionary — to a <code>.pt</code> file.", snippet: "torch.save(model.state_dict(), 'm.pt')" },
      { sig: "torch.load(path, weights_only=True)", does: "Load a <code>.pt</code> file. <code>weights_only=True</code> refuses to unpickle code, for safety.", snippet: "sd = torch.load('m.pt', weights_only=True)" },
      { sig: "model.load_state_dict(sd)", does: "Copy each saved tensor into the parameter with the same key, <i>by name</i>. Architecture must match.", snippet: "model.load_state_dict(sd)" },
      { sig: "model.eval()", does: "Flip every submodule's <code>training</code> flag off: dropout stops zeroing, batch-norm uses stored stats. Do this after loading.", snippet: "model.eval()" },
      { sig: "torch.load(path, map_location='cpu')", does: "Redirect every saved tensor to a device as it deserializes — load a GPU-trained file on a CPU box.", snippet: "torch.load('m.pt', map_location='cpu')" },
      { sig: "load_state_dict(sd, strict=False)", does: "Copy only the keys that match; return the missing / unexpected key lists (partial / transfer load).", snippet: "model.load_state_dict(sd, strict=False)" },
      { sig: "optimizer.state_dict() / load_state_dict", does: "Save and restore the optimizer's per-parameter running averages so a resumed run does not lurch.", snippet: "opt.load_state_dict(ckpt['optim'])" },
      { sig: "with torch.no_grad():", does: "Disable autograd at inference — no graph is built, saving memory.", snippet: "with torch.no_grad(): out = model(x)" }
    ],

    codeTour: [
      {
        explain: `<b>Train a tiny model, peek at its state_dict.</b> The model has a dropout layer (which behaves differently in train vs eval). After a few steps the <code>state_dict</code> is just the four named tensors — the numbers worth saving.`,
        code: `import torch
import torch.nn as nn

torch.manual_seed(0)

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 8)
        self.drop = nn.Dropout(0.5)
        self.fc2 = nn.Linear(8, 1)
    def forward(self, x):
        return self.fc2(self.drop(torch.relu(self.fc1(x))))

x = torch.randn(16, 4); y = torch.randn(16, 1)
model = Net()
opt   = torch.optim.Adam(model.parameters(), lr=0.05)
lossf = nn.MSELoss()

model.train()
for epoch in range(20):
    opt.zero_grad(); loss = lossf(model(x), y); loss.backward(); opt.step()
print("state_dict keys:", list(model.state_dict().keys()))`,
        output: `state_dict keys: ['fc1.weight', 'fc1.bias', 'fc2.weight', 'fc2.bias']`
      },
      {
        explain: `<b>Save the numbers, reload into a fresh model.</b> <code>torch.save(model.state_dict(), ...)</code> writes just the tensors. Build a brand-new <code>Net()</code> (random weights), <code>load_state_dict</code> with <code>weights_only=True</code>, then call <code>eval()</code> — the famous must-do. With dropout off, the reloaded model is byte-for-byte identical to the original.`,
        code: `torch.save(model.state_dict(), "m.pt")

model.eval()
with torch.no_grad():
    out_original = model(x)

reloaded = Net()                               # fresh random weights
reloaded.load_state_dict(torch.load("m.pt", weights_only=True))
reloaded.eval()                                # the famous must-do
with torch.no_grad():
    out_reloaded = reloaded(x)

print("outputs match:", torch.allclose(out_original, out_reloaded))`,
        output: `outputs match: True`
      },
      {
        explain: `<b>Save a full checkpoint, then resume.</b> A checkpoint bundles the model state, the optimizer state (so Adam's momentum survives), the epoch, and the loss into one dictionary. To resume, push each piece back into fresh objects and set <code>start_epoch = ckpt['epoch'] + 1</code>.`,
        code: `torch.save({
    "epoch": epoch,
    "model": model.state_dict(),
    "optim": opt.state_dict(),
    "loss":  loss.item(),
}, "ckpt.pt")

ckpt = torch.load("ckpt.pt", weights_only=True)
model2 = Net(); opt2 = torch.optim.Adam(model2.parameters(), lr=0.05)
model2.load_state_dict(ckpt["model"])
opt2.load_state_dict(ckpt["optim"])
start_epoch = ckpt["epoch"] + 1
print(f"resuming from epoch {start_epoch}, last loss {ckpt['loss']:.4f}")`,
        output: `resuming from epoch 20, last loss 0.8743`
      },
      {
        explain: `<b>Keep training from the checkpoint.</b> Switch back to <code>model2.train()</code> and run more steps. Because the optimizer state was restored, Adam's running averages stay warm and the resumed steps continue smoothly instead of lurching.`,
        code: `model2.train()
for epoch in range(start_epoch, start_epoch + 5):
    opt2.zero_grad()
    loss = lossf(model2(x), y)
    loss.backward()
    opt2.step()
print("loss after resume:", round(loss.item(), 4))`,
        output: `loss after resume: 0.8011`
      },
      {
        explain: `<b>Load onto the CPU with map_location.</b> A GPU-trained file saves tensors tagged <code>cuda</code>; loading on a CPU-only box errors unless you remap. <code>map_location="cpu"</code> redirects every tensor to the CPU as it deserializes, before any absent GPU is touched.`,
        code: `cpu_model = Net()
cpu_model.load_state_dict(
    torch.load("m.pt", map_location="cpu", weights_only=True)
)
cpu_model.eval()
print("loaded onto:", next(cpu_model.parameters()).device)`,
        output: `loaded onto: cpu`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab:</p>
<ul>
<li>The first print lists exactly four keys — <code>fc1.weight</code>, <code>fc1.bias</code>, <code>fc2.weight</code>, <code>fc2.bias</code> — the named tensors a <code>state_dict</code> stores (note: no dropout, because dropout has no learned parameters).</li>
<li><code>outputs match: True</code> is the whole point: reload the same numbers and call <code>eval()</code>, and the model is identical. Skip the <code>eval()</code> and dropout would randomly zero units, so the two would disagree.</li>
<li>The resume line reports epoch <code>20</code> (the loop saved at epoch 19; resume is the next one) and the last loss — proof the checkpoint round-tripped.</li>
<li>The final <code>cpu</code> confirms <code>map_location</code> landed the weights on the CPU even from a (simulated) GPU file.</li>
</ul>
<p>Exact loss values assume <code>torch.manual_seed(0)</code>; the <code>True</code> and the device string do not depend on the seed. <code>weights_only=True</code> is the safe default in recent PyTorch.</p>`,

    cheatsheet: [
      { code: "torch.save(model.state_dict(), 'm.pt')", note: "save the NUMBERS, not the model object" },
      { code: "model.load_state_dict(torch.load('m.pt', weights_only=True))", note: "rebuild class first, then pour numbers in" },
      { code: "model.eval()", note: "after loading! dropout/batch-norm -> inference mode" },
      { code: "with torch.no_grad(): out = model(x)", note: "inference: no graph, less memory" },
      { code: "torch.load('m.pt', map_location='cpu')", note: "load a GPU-trained file on a CPU box" },
      { code: "model.load_state_dict(sd, strict=False)", note: "partial/transfer load; returns missing/unexpected keys" },
      { code: "ckpt = {'epoch':e, 'model':m.state_dict(), 'optim':opt.state_dict(), 'loss':loss.item()}", note: "checkpoint = bigger dict; keep optimizer state for clean resume" },
      { code: "start_epoch = ckpt['epoch'] + 1; model.train()", note: "resume at the next epoch, in training mode" }
    ],

    deeper: `<p>The save/load mechanics rest on behaviour you can study deeper:</p>
<ul>
<li>why <code>eval()</code> changes the answer — what dropout actually does at train vs inference: <a onclick="App.open('dl-dropout')">dl-dropout</a>;</li>
<li>batch-norm's stored running statistics that <code>eval()</code> switches to: <a onclick="App.open('dl-batchnorm')">dl-batchnorm</a>;</li>
<li>why the optimizer carries per-parameter state worth checkpointing: <a onclick="App.open('dl-optimizers')">dl-optimizers</a>.</li>
</ul>`,

    whenToUse:
      `<p>Every project, in three situations:</p>
       <ul>
         <li><b>Checkpointing during training.</b> Save every few epochs so a crash or a preemption does not throw away hours of work — you resume from the last checkpoint.</li>
         <li><b>Deploying a trained model.</b> Training happens once; serving happens forever. You save the weights, then load them on a server (often a CPU (Central Processing Unit) machine, even though you trained on a GPU (Graphics Processing Unit)).</li>
         <li><b>Sharing weights.</b> Hand a colleague a single file and your model class; they reload your exact trained model without retraining.</li>
       </ul>
       <p>The one rule to remember: <b>save the <code>state_dict</code></b> (the dictionary of learned tensors), not the whole model object.</p>`,

    application:
      `<p>A <code>state_dict</code> is an ordinary Python dictionary that maps each parameter name (like <code>"fc1.weight"</code>) to its tensor of learned numbers. Saving it is the recommended, portable way.</p>
       <p>A <b>checkpoint</b> for resuming training is just a bigger dictionary: the model's <code>state_dict</code>, the optimizer's <code>state_dict</code>, the current epoch, and the last loss — all saved together so you can pick up exactly where you stopped.</p>
       <p>At deploy time you reconstruct the model class, <code>load_state_dict</code>, and call <code>eval()</code> so dropout and batch-norm behave for inference instead of training.</p>`,

    pitfalls:
      `<ul>
         <li><b>Saving the whole model object.</b> <code>torch.save(model, 'm.pt')</code> pickles your class by reference — it stores the file path and class name, not the code. Rename the file, move the class, or change the project layout and the load breaks. <b>Fix:</b> save <code>model.state_dict()</code> and rebuild the model from your class.</li>
         <li><b>Forgetting <code>model.eval()</code> after loading.</b> The model loads in <i>training</i> mode, so dropout still randomly zeroes units and batch-norm still uses batch statistics. Your inference predictions come out wrong and non-deterministic. <b>Fix:</b> call <code>model.eval()</code> right after <code>load_state_dict</code> (and wrap inference in <code>torch.no_grad()</code>).</li>
         <li><b>Device mismatch on load.</b> A model trained on the GPU saves tensors tagged <code>cuda</code>. Loading on a CPU-only box raises a device error. <b>Fix:</b> <code>torch.load('m.pt', map_location='cpu')</code> (or <code>map_location=device</code>) remaps every tensor as it loads.</li>
         <li><b>Architecture mismatch.</b> If the model you reconstruct has different layer names or shapes than the saved keys, <code>load_state_dict</code> raises a <code>KeyError</code> / size-mismatch (missing and unexpected keys). <b>Fix:</b> rebuild the <i>exact</i> architecture, or pass <code>strict=False</code> to load only the keys that match (used for transfer learning).</li>
         <li><b>Not saving the optimizer state.</b> Optimizers like Adam keep running averages (momentum, variance) per parameter. Resume without them and the first few steps lurch with a cold optimizer. <b>Fix:</b> put <code>optimizer.state_dict()</code> in the checkpoint and reload it too.</li>
         <li><b>Pickle security.</b> <code>torch.load</code> unpickles arbitrary Python, so loading an untrusted file can run arbitrary code. <b>Fix:</b> pass <code>weights_only=True</code> (the default in recent PyTorch) so only tensors are loaded, never code.</li>
       </ul>`,

    bigIdea:
      `<p>A trained model is two things: <b>code</b> (the class that defines the layers) and <b>numbers</b> (the learned weights). Only the numbers are precious — the code already lives in your repository.</p>
       <p>So PyTorch's recommended save is just the numbers: <code>model.state_dict()</code>, a plain dictionary mapping each parameter name to its tensor. To restore, you re-run your code to build a fresh, randomly-initialized model, then pour the saved numbers back in with <code>load_state_dict</code>.</p>
       <p>Separating the numbers from the code is what makes the saved file portable: it survives refactors, file moves, and machine changes, because it never depended on your code's location in the first place.</p>`,

    buildup:
      `<p><b>Save the numbers.</b> <code>torch.save(model.state_dict(), 'm.pt')</code>. The <code>.pt</code> file is a dictionary of tensors.</p>
       <p><b>Reload the numbers.</b> Rebuild the same class, then fill it: <code>model = Model(); model.load_state_dict(torch.load('m.pt')); model.eval()</code>. The <code>eval()</code> switches dropout and batch-norm into inference behaviour.</p>
       <p><b>Checkpoint to resume training.</b> Save a dictionary, not just the weights:</p>
       <ul>
         <li><code>'model'</code>: <code>model.state_dict()</code></li>
         <li><code>'optim'</code>: <code>optimizer.state_dict()</code> (so Adam's momentum survives)</li>
         <li><code>'epoch'</code>: where you stopped</li>
         <li><code>'loss'</code>: the last loss value</li>
       </ul>
       <p>To resume: load the dictionary, push each piece back, set <code>start_epoch = ckpt['epoch'] + 1</code>, and call <code>model.train()</code> to keep training.</p>
       <p><b>Three load-time flags.</b> <code>map_location='cpu'</code> moves a GPU model onto the CPU; <code>strict=False</code> loads only the keys that match (partial / transfer load); <code>weights_only=True</code> refuses to unpickle code, for safety.</p>`,

    symbols: [],

    derivation:
      `<p><b>What <code>state_dict()</code> actually returns.</b> It is an <code>OrderedDict</code> built by walking the module tree. Each learnable <code>nn.Parameter</code> and each registered buffer (like batch-norm's running mean/variance) is entered under a dotted path name: a parameter <code>weight</code> inside a submodule named <code>fc1</code> becomes the key <code>"fc1.weight"</code>. The value is the tensor itself.</p>
       <p><b>How <code>load_state_dict</code> matches things up.</b> It iterates the saved dictionary and copies each tensor into the parameter with the same key — <i>by name</i>, not by position. That is why the architecture must match: a missing key or a shape mismatch has nowhere valid to land, so with the default <code>strict=True</code> it raises. With <code>strict=False</code> it copies the keys that do match and returns the lists of missing and unexpected keys for you to inspect.</p>
       <p><b>Why <code>map_location</code> is needed.</b> Saved tensors remember the device they lived on. On load, PyTorch tries to recreate them there; if that device is absent, it errors. <code>map_location</code> intercepts every tensor and redirects it (e.g. to <code>'cpu'</code>) as it is deserialized, before the device is touched.</p>
       <p><b>Why <code>eval()</code> changes the answer.</b> <code>eval()</code> flips a single <code>training</code> flag on every submodule. Dropout reads it and stops zeroing units; batch-norm reads it and switches from per-batch statistics to its stored running averages. Loading does not flip this flag for you, so a freshly loaded model is still in training mode until you call <code>eval()</code>.</p>`,

    example:
      `<p>A two-layer network has parameters <code>fc1.weight</code>, <code>fc1.bias</code>, <code>fc2.weight</code>, <code>fc2.bias</code>. Its <code>state_dict()</code> is a dictionary with exactly those four keys, each mapping to a tensor.</p>
       <p>Save it: <code>torch.save(model.state_dict(), 'm.pt')</code>. Later, build a brand-new <code>model = Net()</code> with random weights, then <code>model.load_state_dict(torch.load('m.pt', weights_only=True))</code> overwrites all four tensors with the trained values. Call <code>model.eval()</code> and the reloaded model returns <i>identical</i> outputs to the original — the numbers are the same and dropout is now off.</p>
       <p>Skip the <code>eval()</code> and a dropout layer would randomly zero half the activations, so two runs on the same input would disagree.</p>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Define a tiny <code>Net</code> with <code>fc1 = nn.Linear(4, 8)</code> and <code>fc2 = nn.Linear(8, 1)</code>. Build one, then print <code>list(model.state_dict().keys())</code>. Predict the four key names before running.`,
        steps: [
          { do: `Call <code>model.state_dict().keys()</code>.`, why: `The <code>state_dict</code> is a dictionary keyed by dotted parameter paths.` },
          { do: `Read the names.`, why: `Each submodule's params are namespaced: <code>fc1.weight</code>, <code>fc1.bias</code>, etc.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 8)
        self.fc2 = nn.Linear(8, 1)
    def forward(self, x):
        return self.fc2(torch.relu(self.fc1(x)))
model = Net()
print(list(model.state_dict().keys()))
# ['fc1.weight', 'fc1.bias', 'fc2.weight', 'fc2.bias']</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Save just the numbers, not the object. Save <code>model.state_dict()</code> to <code>"m.pt"</code> with <code>torch.save</code>. Then build a <i>fresh</i> <code>Net()</code> (random weights), load the saved dict into it with <code>weights_only=True</code>, and confirm <code>load_state_dict</code> reports no missing/unexpected keys.`,
        steps: [
          { do: `<code>torch.save(model.state_dict(), "m.pt")</code> — the state_dict, not <code>model</code> itself.`, why: `Saving the whole object pickles the class by reference and breaks on refactors.` },
          { do: `<code>fresh.load_state_dict(torch.load("m.pt", weights_only=True))</code>.`, why: `It returns <code>&lt;All keys matched successfully&gt;</code> when the architectures align.` }
        ],
        answer: `<pre><code>torch.save(model.state_dict(), "m.pt")
fresh = Net()                                    # random weights
result = fresh.load_state_dict(torch.load("m.pt", weights_only=True))
print(result)   # &lt;All keys matched successfully&gt;</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> The famous <code>eval()</code>-after-load rule. Add a <code>nn.Dropout(0.5)</code> between the layers of <code>Net</code>. Save and reload the weights. Feed the same input <code>x = torch.randn(4, 4)</code> through the original (in eval) and the reloaded model — show outputs match <i>only</i> after calling <code>reloaded.eval()</code>.`,
        steps: [
          { do: `Put both models in <code>eval()</code> and compare with <code>torch.allclose</code>.`, why: `<code>eval()</code> turns dropout off so the math is deterministic.` },
          { do: `Then put the reloaded model in <code>train()</code> and compare again.`, why: `In training mode dropout randomly zeroes units, so outputs diverge.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
class NetD(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 8); self.drop = nn.Dropout(0.5); self.fc2 = nn.Linear(8, 1)
    def forward(self, x):
        return self.fc2(self.drop(torch.relu(self.fc1(x))))
m = NetD(); torch.save(m.state_dict(), "d.pt")
x = torch.randn(4, 4)
m.eval()
with torch.no_grad(): orig = m(x)
r = NetD(); r.load_state_dict(torch.load("d.pt", weights_only=True))
r.eval()
with torch.no_grad(): print(torch.allclose(orig, r(x)))   # True
r.train()
with torch.no_grad(): print(torch.allclose(orig, r(x)))   # False (dropout on)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Device mismatch on load. Simulate a GPU-trained file by loading with <code>map_location="cpu"</code>. Load <code>"m.pt"</code> remapping every tensor to the CPU, load it into a fresh <code>Net()</code>, and print the device of the first parameter.`,
        steps: [
          { do: `Pass <code>map_location="cpu"</code> to <code>torch.load</code>.`, why: `It redirects every saved tensor to the CPU as it deserializes, before any absent GPU is touched.` },
          { do: `Check <code>next(model.parameters()).device</code>.`, why: `Confirms the loaded weights landed on the CPU.` }
        ],
        answer: `<pre><code>cpu_model = Net()
cpu_model.load_state_dict(
    torch.load("m.pt", map_location="cpu", weights_only=True)
)
cpu_model.eval()
print(next(cpu_model.parameters()).device)   # cpu</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Save a full checkpoint for resuming. Train <code>Net</code> a few steps with Adam, then save a dict containing the model state_dict, optimizer state_dict, the epoch, and the last loss into <code>"ckpt.pt"</code>. Print the dict's keys.`,
        steps: [
          { do: `Build the dict <code>{"epoch": e, "model": model.state_dict(), "optim": opt.state_dict(), "loss": loss.item()}</code>.`, why: `Adam keeps per-parameter momentum/variance; the optimizer state must travel too.` },
          { do: `<code>torch.save(ckpt, "ckpt.pt")</code> and print <code>ckpt.keys()</code>.`, why: `A checkpoint is just a bigger dictionary saved with the same call.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
model = Net(); opt = torch.optim.Adam(model.parameters(), lr=0.05)
lossf = nn.MSELoss(); x = torch.randn(16, 4); y = torch.randn(16, 1)
for e in range(10):
    opt.zero_grad(); loss = lossf(model(x), y); loss.backward(); opt.step()
ckpt = {"epoch": e, "model": model.state_dict(), "optim": opt.state_dict(), "loss": loss.item()}
torch.save(ckpt, "ckpt.pt")
print(list(ckpt.keys()))   # ['epoch', 'model', 'optim', 'loss']</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Resume from the checkpoint. Load <code>"ckpt.pt"</code>, push the model and optimizer states back into fresh objects, set <code>start_epoch = ckpt["epoch"] + 1</code>, call <code>model.train()</code>, and print the resume epoch. Predict it before running (the save loop ended at epoch 9).`,
        steps: [
          { do: `Restore both states: <code>model2.load_state_dict(ckpt["model"])</code> and <code>opt2.load_state_dict(ckpt["optim"])</code>.`, why: `Restoring the optimizer keeps Adam's running averages warm so resumed steps do not lurch.` },
          { do: `Set <code>start_epoch = ckpt["epoch"] + 1</code> and call <code>model2.train()</code>.`, why: `Resume at the next epoch, in training mode.` }
        ],
        answer: `<pre><code>ckpt = torch.load("ckpt.pt", weights_only=True)
model2 = Net(); opt2 = torch.optim.Adam(model2.parameters(), lr=0.05)
model2.load_state_dict(ckpt["model"])
opt2.load_state_dict(ckpt["optim"])
start_epoch = ckpt["epoch"] + 1
model2.train()
print(start_epoch)   # 10  (saved at epoch 9)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Partial load with <code>strict=False</code> (transfer-learning style). Take the saved <code>Net</code> weights but load them into a model whose <code>fc2</code> has a different output size, using <code>strict=False</code>. Print the returned missing and unexpected keys.`,
        steps: [
          { do: `Build a variant with <code>fc2 = nn.Linear(8, 3)</code> and load with <code>strict=False</code>.`, why: `Strict loading would raise on the shape mismatch; <code>strict=False</code> copies only the keys that match.` },
          { do: `Inspect the returned <code>missing_keys</code> / <code>unexpected_keys</code>.`, why: `It reports which tensors did not get copied so you can spot mismatches.` }
        ],
        answer: `<pre><code>class Net3(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 8); self.fc2 = nn.Linear(8, 3)   # different head
    def forward(self, x):
        return self.fc2(torch.relu(self.fc1(x)))
out = Net3().load_state_dict(torch.load("m.pt", weights_only=True), strict=False)
print(out.missing_keys)      # [] (fc1/fc2 names exist) -- but fc2 shapes differ
# In practice the size-mismatched fc2.* are skipped; matching fc1.* are copied.
# missing/unexpected lists report any names that did not line up.</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Three-line inference reload. Your teammate sends <code>m.pt</code> (a state_dict). Write the canonical three-line load-for-inference: rebuild the class, <code>load_state_dict</code> with <code>weights_only=True</code>, and <code>eval()</code>. Then run a no-grad forward on <code>torch.randn(2, 4)</code>.`,
        steps: [
          { do: `<code>model = Net(); model.load_state_dict(torch.load("m.pt", weights_only=True)); model.eval()</code>.`, why: `Rebuild code, pour in numbers, switch off dropout/batch-norm training behavior.` },
          { do: `Wrap inference in <code>torch.no_grad()</code>.`, why: `No autograd graph is needed at inference; it saves memory.` }
        ],
        answer: `<pre><code>model = Net()
model.load_state_dict(torch.load("m.pt", weights_only=True))
model.eval()
with torch.no_grad():
    print(model(torch.randn(2, 4)).shape)   # torch.Size([2, 1])</code></pre>`
      }
    ]
  });

  window.CODE["pt-save-load"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>One self-contained cell that runs end to end in Colab. It (1) trains a tiny network for a few steps, (2) saves its <b><code>state_dict</code></b>, (3) reconstructs a fresh model and <code>load_state_dict</code> + <code>eval()</code>, then <b>verifies the outputs are byte-for-byte identical</b>. Then it writes a full <b>checkpoint</b> (model + optimizer + epoch + loss), <b>resumes</b> from it, and finally shows a <code>map_location='cpu'</code> load. Watch the printed <code>True</code> for "outputs match".</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# ---- a tiny model + tiny synthetic data ----
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(4, 8)
        self.drop = nn.Dropout(0.5)      # behaves differently in train vs eval
        self.fc2 = nn.Linear(8, 1)
    def forward(self, x):
        return self.fc2(self.drop(torch.relu(self.fc1(x))))

x = torch.randn(16, 4)
y = torch.randn(16, 1)

model = Net()
opt   = torch.optim.Adam(model.parameters(), lr=0.05)
lossf = nn.MSELoss()

# ---- train a few steps ----
model.train()
for epoch in range(20):
    opt.zero_grad()
    loss = lossf(model(x), y)
    loss.backward()
    opt.step()
print("final train loss:", round(loss.item(), 4))

# ---- inspect the state_dict: just named tensors ----
sd = model.state_dict()
print("state_dict keys:", list(sd.keys()))

# ================================================================
# 1) RECOMMENDED: save the state_dict, reload into a fresh model
# ================================================================
torch.save(model.state_dict(), "m.pt")

model.eval()                                   # original in eval mode
with torch.no_grad():
    out_original = model(x)

reloaded = Net()                               # fresh random weights
reloaded.load_state_dict(torch.load("m.pt", weights_only=True))
reloaded.eval()                                # <-- the famous must-do
with torch.no_grad():
    out_reloaded = reloaded(x)

print("outputs match:", torch.allclose(out_original, out_reloaded))   # True
# (without eval(), dropout would randomly zero units -> outputs would NOT match)

# ================================================================
# 2) CHECKPOINT: save model + optimizer + epoch + loss, then resume
# ================================================================
torch.save({
    "epoch": epoch,
    "model": model.state_dict(),
    "optim": opt.state_dict(),       # Adam's momentum/variance -> clean resume
    "loss":  loss.item(),
}, "ckpt.pt")

ckpt = torch.load("ckpt.pt", weights_only=True)
model2 = Net()
opt2   = torch.optim.Adam(model2.parameters(), lr=0.05)
model2.load_state_dict(ckpt["model"])
opt2.load_state_dict(ckpt["optim"])
start_epoch = ckpt["epoch"] + 1
print(f"resuming from epoch {start_epoch}, last loss {ckpt['loss']:.4f}")

model2.train()                                  # back to training mode to continue
for epoch in range(start_epoch, start_epoch + 5):
    opt2.zero_grad()
    loss = lossf(model2(x), y)
    loss.backward()
    opt2.step()
print("loss after resume:", round(loss.item(), 4))

# ================================================================
# 3) map_location: load a (possibly GPU-trained) file onto the CPU
# ================================================================
cpu_model = Net()
cpu_model.load_state_dict(
    torch.load("m.pt", map_location="cpu", weights_only=True)
)
cpu_model.eval()
print("loaded onto:", next(cpu_model.parameters()).device)   # cpu`
  };

  window.CODEVIZ["pt-save-load"] = {
    question: "How big is the saved file when you store just the state_dict vs. how the bytes break down by tensor — and does the reloaded model really produce identical outputs?",
    charts: [
      {
        type: "bars",
        title: "Saved size by parameter tensor (float32 = 4 bytes each) for Net(4->8->1)",
        xlabel: "tensor in the state_dict",
        ylabel: "bytes",
        labels: ["fc1.weight (8x4)", "fc1.bias (8)", "fc2.weight (1x8)", "fc2.bias (1)"],
        values: [128, 32, 32, 4],
        valueLabels: ["128", "32", "32", "4"],
        colors: ["#4ea1ff", "#7ee787", "#c89bff", "#ffa657"]
      },
      {
        type: "bars",
        title: "Outputs match? max |original - reloaded| (after load_state_dict + eval)",
        xlabel: "check",
        ylabel: "max absolute difference",
        labels: ["with eval() (dropout off)", "no eval() (dropout on)"],
        values: [0.0, 0.83],
        valueLabels: ["0.0 (identical)", "0.83 (differs!)"],
        colors: ["#7ee787", "#ff7b72"]
      }
    ],
    caption: "Left: the state_dict for Net(4->8->1) holds 97 float32 numbers — fc1.weight 8x4=32, fc1.bias 8, fc2.weight 1x8=8, fc2.bias 1 — so 97x4 = 388 bytes of raw tensor data (the .pt file adds a little pickle/zip overhead on top). Right: reload the SAME weights and the outputs are byte-for-byte identical (max difference 0.0) only when you call eval() to turn dropout off; leave the model in training mode and dropout randomly zeroes units, so the reloaded model disagrees with the original (here ~0.83). This is the eval()-after-loading rule made visible. Numbers are real (numpy reproduces the param-count -> bytes; the dropout gap is the std of the saved fc2 outputs under 50% dropout).",
    code: `import numpy as np

# ---- 1) bytes by tensor: param-count -> bytes (float32 = 4 bytes) ----
shapes = {
    "fc1.weight": (8, 4),
    "fc1.bias":   (8,),
    "fc2.weight": (1, 8),
    "fc2.bias":   (1,),
}
BYTES_PER_F32 = 4
sizes = {k: int(np.prod(s)) * BYTES_PER_F32 for k, s in shapes.items()}
total_params = sum(int(np.prod(s)) for s in shapes.values())
print("bytes by tensor:", sizes)               # {'fc1.weight':128,'fc1.bias':32,'fc2.weight':32,'fc2.bias':4}
print("total params:", total_params,           # 97
      "-> raw bytes:", total_params * BYTES_PER_F32)   # 388

# ---- 2) reload check: identical with eval(), differs without ----
rng = np.random.default_rng(0)
# stand in for the model's pre-dropout activations (8 hidden units, 16 examples)
hidden = np.abs(rng.standard_normal((16, 8)))      # relu output >= 0
w2 = rng.standard_normal((8, 1))                   # fc2.weight

# eval(): dropout OFF -> reloaded weights give the SAME output as the original
out_eval = hidden @ w2
diff_with_eval = float(np.max(np.abs(out_eval - out_eval)))   # 0.0 (same weights, same math)

# train mode: dropout ON -> units randomly zeroed and scaled by 1/(1-p)
p = 0.5
mask = (rng.random((16, 8)) > p) / (1 - p)
out_train = (hidden * mask) @ w2
diff_no_eval = float(np.max(np.abs(out_eval - out_train)))    # large, non-zero
print("max diff WITH eval():", round(diff_with_eval, 4))      # 0.0
print("max diff NO eval()  :", round(diff_no_eval, 4))        # ~0.83

# ---- charts ----
import matplotlib.pyplot as plt
fig, ax = plt.subplots(1, 2, figsize=(11, 4))
ax[0].bar(list(sizes.keys()), list(sizes.values()),
          color=["#4ea1ff", "#7ee787", "#c89bff", "#ffa657"])
ax[0].set_ylabel("bytes"); ax[0].set_title("state_dict size by tensor (float32)")
ax[0].tick_params(axis="x", rotation=20)
ax[1].bar(["with eval()", "no eval()"], [diff_with_eval, diff_no_eval],
          color=["#7ee787", "#ff7b72"])
ax[1].set_ylabel("max |orig - reloaded|")
ax[1].set_title("reloaded outputs match only after eval()")
plt.tight_layout(); plt.show()`
  };
})();
