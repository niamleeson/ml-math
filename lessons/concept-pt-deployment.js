/* =====================================================================
   PyTorch (a complete course) — Deploying a trained model to production.
   id: pt-deployment
   Self-contained lesson: window.LESSONS / window.CODE / window.CODEVIZ.
   CODE runs in Google Colab (torch preinstalled; onnx/onnxruntime auto-installed).
   CODEVIZ computes real numbers with numpy (param-count -> bytes; latency table).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "pt-deployment",
    title: "Deploying a trained model",
    tagline: "Take the trained weights out of the notebook: export to a Python-free runtime (TorchScript / ONNX), quantize to int8, and serve it behind an API.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["pt-save-load", "pt-nn-module", "skill-monitoring", "skill-limitations"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>put a model in serving mode (<code>eval()</code> + <code>inference_mode()</code>) and export it to a Python-free graph with TorchScript &mdash; knowing when to <code>trace</code> and when to <code>script</code>;</li>
<li>export to ONNX (Open Neural Network Exchange), run it with ONNX Runtime, and verify the outputs match PyTorch across the boundary;</li>
<li>shrink and speed up a model with dynamic int8 quantization, and sketch a minimal serving endpoint.</li>
</ul>
<p><b>The API you'll own:</b> <code>torch.jit.trace/script</code>, <code>torch.jit.save/load</code>, <code>torch.onnx.export</code>, <code>onnxruntime.InferenceSession</code>, <code>torch.ao.quantization.quantize_dynamic</code>.</p>`,

    concept: `<p>A trained model in a notebook is the <i>start</i> of the work, not the end. The notebook gives you weights that work; production demands a graph that is fast, portable, observable, and cheap to run. Three moves get you there.</p>
<p><b>1. Export</b> &mdash; freeze the model into a standalone graph that no longer needs Python or the training code. Your model is Python that executes a sequence of tensor operations; TorchScript captures that sequence as a static <i>graph</i> and saves it with the weights, so a C++ runtime can replay it directly. ONNX freezes it into a framework-neutral file other engines can run. Either way the result is a single artifact you drop onto a server, a phone, or a C++ binary.</p>
<p>The key distinction is <b>trace vs script</b>. <code>torch.jit.trace</code> runs the model once on an example and records only the operations that actually executed &mdash; a data-dependent <code>if</code> is baked to whichever branch that example took. <code>torch.jit.script</code> compiles the Python source of <code>forward()</code> instead, so branches and loops survive. Rule of thumb: <b>script</b> when behavior depends on the data, <b>trace</b> for straight-line tensor math.</p>
<p><b>2. Make it cheaper</b> &mdash; quantization stores weights as 8-bit integers instead of 32-bit floats: the file shrinks ~4x (4 bytes &rarr; 1 byte) and integer math is cheaper, while you watch accuracy to confirm the trade is worth it.</p>
<p><b>3. Serve it well</b> &mdash; <code>model.eval()</code> once at load and every prediction inside <code>torch.inference_mode()</code> (correctness and no wasted autograd graph), request batching for throughput, and monitoring for drift (see <code>skill-monitoring</code>).</p>`,

    apiTable: [
      { sig: "model.eval()", does: "Switch to inference mode: dropout off, batch-norm uses running stats. The non-negotiable first step before export.", snippet: "model = model.eval()" },
      { sig: "torch.jit.trace(model, example)", does: "Record the ops that run on one example. Fast, but freezes data-dependent control flow. Use for straight-line code.", snippet: "ts = torch.jit.trace(model, x)" },
      { sig: "torch.jit.script(model)", does: "Compile the Python <code>forward()</code> into a graph, preserving <code>if</code>/loops. Use when behavior depends on the data.", snippet: "ts = torch.jit.script(model)" },
      { sig: "ts.save(path) / torch.jit.load(path)", does: "Persist and reload the graph + weights. The reloaded module runs <i>without</i> the original Python class.", snippet: "ts.save(\"m.ts\"); torch.jit.load(\"m.ts\")" },
      { sig: "torch.onnx.export(model, x, path, opset_version=)", does: "Trace the model into a portable ONNX file. Pin the opset; mark variable dims with <code>dynamic_axes</code>.", snippet: "torch.onnx.export(model, x, \"m.onnx\", opset_version=17)" },
      { sig: "ort.InferenceSession(path).run(out, feed)", does: "Run the ONNX graph with ONNX Runtime &mdash; no PyTorch installed. The production inference path.", snippet: "sess = ort.InferenceSession(\"m.onnx\")" },
      { sig: "quantize_dynamic(model, {nn.Linear}, qint8)", does: "Store Linear weights as int8 (1 byte) instead of float32 &mdash; ~4x smaller, faster. Re-validate accuracy.", snippet: "torch.ao.quantization.quantize_dynamic(m, {nn.Linear}, dtype=torch.qint8)" },
      { sig: "torch.inference_mode()", does: "A stricter, faster <code>no_grad()</code>: skips autograd bookkeeping you never use at serving, cutting memory and latency.", snippet: "with torch.inference_mode():\n    logits = model(x)" },
      { sig: "onnx.checker.check_model(onnx.load(path))", does: "Structural validity check on the exported ONNX file before shipping.", snippet: "onnx.checker.check_model(onnx.load(\"m.onnx\"))" }
    ],

    codeTour: [
      {
        explain: `<b>Build the classifier and put it in serving mode.</b> <code>eval()</code> is the famous must-do: it turns dropout off and batch-norm to running stats. We grab a reference output under <code>inference_mode()</code> to compare every exported artifact against.`,
        code: `import torch, torch.nn as nn, numpy as np, os\ntorch.manual_seed(0)\n\nclass Net(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)\n        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)\n        self.pool  = nn.MaxPool2d(2)\n        self.fc1   = nn.Linear(32 * 8 * 8, 128)\n        self.fc2   = nn.Linear(128, 10)\n    def forward(self, x):\n        x = self.pool(torch.relu(self.conv1(x)))\n        x = self.pool(torch.relu(self.conv2(x)))\n        x = x.flatten(1)\n        x = torch.relu(self.fc1(x))\n        return self.fc2(x)\n\nmodel = Net().eval()\nn = sum(p.numel() for p in model.parameters())\nprint("params:", n, "| fp32 MB:", round(n * 4 / 1e6, 3))\nx = torch.randn(1, 3, 32, 32)\nwith torch.inference_mode():\n    ref = model(x)`,
        output: `params: 268650 | fp32 MB: 1.075`
      },
      {
        explain: `<b>Export to TorchScript, save, reload.</b> <code>trace</code> records the ops for this input; the saved graph carries its own ops and weights, so the reloaded module runs without the <code>Net</code> class. Always check it reproduces the original numerically.`,
        code: `ts = torch.jit.trace(model, x)\nts.save("model_ts.pt")\nreloaded = torch.jit.load("model_ts.pt")   # no Net class needed\nwith torch.inference_mode():\n    print("TorchScript matches:", torch.allclose(reloaded(x), ref, atol=1e-5))`,
        output: `TorchScript matches: True`
      },
      {
        explain: `<b>Export to ONNX and run it with ONNX Runtime.</b> Pin <code>opset_version</code> and mark the batch dim dynamic. <code>onnx.checker</code> validates the structure; then compare the runtime's output to PyTorch &mdash; numeric drift across this boundary is a classic deployment bug.`,
        code: `import onnx, onnxruntime as ort\ntorch.onnx.export(\n    model, x, "model.onnx",\n    input_names=["input"], output_names=["logits"],\n    opset_version=17,\n    dynamic_axes={"input": {0: "batch"}, "logits": {0: "batch"}})\nonnx.checker.check_model(onnx.load("model.onnx"))\nsess = ort.InferenceSession("model.onnx", providers=["CPUExecutionProvider"])\nonnx_out = sess.run(["logits"], {"input": x.numpy()})[0]\nprint("ONNX matches:", np.allclose(onnx_out, ref.numpy(), atol=1e-4))`,
        output: `ONNX matches: True`
      },
      {
        explain: `<b>Dynamic int8 quantization.</b> One line converts the Linear weights to 8-bit integers. Save both state dicts and compare bytes &mdash; about a 4x shrink. Always re-validate accuracy on a held-out set before shipping int8.`,
        code: `qmodel = torch.ao.quantization.quantize_dynamic(\n    model, {nn.Linear}, dtype=torch.qint8).eval()\ntorch.save(model.state_dict(),  "fp32.pt")\ntorch.save(qmodel.state_dict(), "int8.pt")\nprint("fp32 KB:", round(os.path.getsize("fp32.pt") / 1e3, 1))\nprint("int8 KB:", round(os.path.getsize("int8.pt") / 1e3, 1))`,
        output: `fp32 KB: 1078.0\nint8 KB: 283.1`
      },
      {
        explain: `<b>Serve it.</b> A minimal endpoint loads the exported graph in <code>eval()</code> mode, shares the <i>same</i> preprocessing as training (no train/serve skew), and runs each request inside <code>inference_mode()</code>. This sketch prints; in production it would be a FastAPI <code>/predict</code> route.`,
        code: `served = torch.jit.load("model_ts.pt").eval()\ndef preprocess(pixels):\n    t = torch.tensor(pixels).float().reshape(1, 3, 32, 32)\n    return (t - 0.5) / 0.5            # match training normalization\nwith torch.inference_mode():\n    logits = served(x)\nprint("predicted class:", logits.argmax(1).item())`,
        output: `predicted class: 4`
      }
    ],

    expected: `<p>Run the tour top to bottom (Colab auto-installs <code>onnx</code> + <code>onnxruntime</code>):</p>
<ul>
<li>The model has <code>268650</code> parameters &mdash; at float32 (4 bytes each) that is <code>1.075 MB</code>, the number the size chart reproduces.</li>
<li><code>TorchScript matches: True</code> proves the reloaded graph &mdash; with no <code>Net</code> class in scope &mdash; computes the same output as eager PyTorch.</li>
<li><code>ONNX matches: True</code> proves the portable ONNX graph, run by a non-PyTorch engine, agrees within <code>1e-4</code>. If this ever prints <code>False</code>, suspect an unsupported op or an opset mismatch.</li>
<li>The int8 state dict is roughly a quarter the size of the float32 one &mdash; the ~4x shrink, on disk.</li>
<li>The final line prints a class index (an untrained model, so the actual value is arbitrary). With <code>torch.manual_seed(0)</code> set, it is reproducible; the predicted class itself is meaningless until the model is trained.</li>
</ul>`,

    cheatsheet: [
      { code: "model.eval()", note: "must-do before export and at serving" },
      { code: "ts = torch.jit.trace(model, example)", note: "straight-line code; freezes control flow" },
      { code: "ts = torch.jit.script(model)", note: "keeps data-dependent if/loops" },
      { code: "ts.save('m.ts') / torch.jit.load('m.ts')", note: "runs without the Python class" },
      { code: "torch.onnx.export(model, x, 'm.onnx', opset_version=17)", note: "portable; pin the opset, set dynamic_axes" },
      { code: "ort.InferenceSession('m.onnx').run(out, feed)", note: "run with no PyTorch installed" },
      { code: "quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)", note: "int8 -> ~4x smaller; re-validate accuracy" },
      { code: "with torch.inference_mode(): ...", note: "no autograd graph per request" },
      { code: "np.allclose(onnx_out, torch_out, atol=1e-4)", note: "verify across the export boundary" }
    ],

    deeper: `<p>The deployment moves rest on ideas from earlier lessons. <code>eval()</code> matters because <a onclick="App.open('dl-dropout')">dropout</a> and <a onclick="App.open('dl-batchnorm')">batch-norm</a> behave differently in training vs inference &mdash; ship in <code>train()</code> mode and predictions are wrong and non-deterministic. The exported graph is the same forward pass you built in <code>pt-nn-module</code>, just frozen and stripped of Python; saving and loading weights is the subject of <code>pt-save-load</code>. Quantization trades a little numerical precision for memory and speed: each weight becomes an integer plus a scale, with the real value approximately <code>scale * (q - zero_point)</code> &mdash; usually a tiny rounding error, but one you must measure, never assume.</p>`,

    whenToUse:
      `<p>The moment a model stops being a research artifact and starts being a <b>product</b>. Reach for this whenever you must:</p>
       <ul>
         <li><b>Ship behind an API (Application Programming Interface).</b> A web or mobile app sends inputs over the network and expects predictions back, fast, all day long.</li>
         <li><b>Run without the training stack.</b> Production servers should not carry your whole research environment just to call <code>forward()</code>. Export a self-contained graph instead.</li>
         <li><b>Run on other hardware.</b> A GPU (Graphics Processing Unit) farm, a CPU (Central Processing Unit) box, a phone, an edge device, a C++ service — each wants a portable format.</li>
         <li><b>Hit a latency or cost budget.</b> Make each prediction faster and the model smaller, so you serve more requests on fewer machines.</li>
       </ul>
       <p>Training answers "can the model learn?". Deployment answers "can it serve millions of requests cheaply, correctly, and observably?" — a different and harder question.</p>`,

    application:
      `<p>Four tools, used together, get a trained model into production:</p>
       <ul>
         <li><b>TorchScript</b> — <code>torch.jit.script</code> or <code>torch.jit.trace</code> turn your model into a <i>serialized graph</i> that runs without a Python interpreter, inside a C++ runtime or on mobile.</li>
         <li><b>ONNX (Open Neural Network Exchange)</b> — a portable, framework-neutral model format. <code>torch.onnx.export</code> writes a <code>.onnx</code> file that engines like ONNX Runtime or TensorRT run across many kinds of hardware.</li>
         <li><b>Quantization</b> — store and compute weights in 8-bit integers (int8) instead of 32-bit floats. The file shrinks ~4x and inference speeds up, with little accuracy loss.</li>
         <li><b>Serving</b> — wrap the model in a service: TorchServe, an NVIDIA Triton instance, or a small FastAPI (a Python web framework) <code>/predict</code> endpoint. For phones and edge devices, ExecuTorch / PyTorch Mobile run the exported graph on-device.</li>
       </ul>
       <p>Once live, treat it like any service: a <b>latency budget</b>, request <b>batching</b> for throughput, and <b>monitoring</b> of inputs and predictions for drift (cross-link <code>skill-monitoring</code>). Always document what it cannot do (cross-link <code>skill-limitations</code>).</p>`,

    pitfalls:
      `<ul>
         <li><b>Forgetting <code>model.eval()</code> and <code>no_grad</code> at serving.</b> In training mode dropout still zeroes units and batch-norm uses batch statistics, so predictions are wrong and non-deterministic; without <code>no_grad</code>/<code>inference_mode</code> PyTorch also builds the autograd graph for every request, wasting memory and time. <b>Fix:</b> <code>model.eval()</code> once at load, and wrap inference in <code>torch.inference_mode()</code> (or <code>torch.no_grad()</code>).</li>
         <li><b><code>trace</code> silently drops data-dependent control flow.</b> <code>torch.jit.trace</code> records the operations for <i>one</i> example input, so an <code>if</code> on the data or a variable-length loop gets frozen to whatever happened on that one run. <b>Fix:</b> use <code>torch.jit.script</code> for any model with real control flow; reserve <code>trace</code> for straight-line tensor code.</li>
         <li><b>Train/serve preprocessing skew.</b> The model only ever saw <i>normalized, resized, tokenized</i> inputs. If the serving path resizes differently, forgets the normalization, or uses a different tokenizer, predictions quietly degrade. <b>Fix:</b> share one preprocessing function (or bake it into the exported graph) for both training and serving.</li>
         <li><b>Not pinning versions / unsupported ops across the ONNX boundary.</b> A model exported with one <code>opset_version</code> may not load in an older ONNX Runtime, and some PyTorch ops have no ONNX equivalent. <b>Fix:</b> pin the opset and the runtime version, verify <code>onnx.checker</code> passes, and compare ONNX outputs against PyTorch numerically before shipping.</li>
         <li><b>Quantization accuracy drop you never measured.</b> int8 is lossy; on some models it barely moves accuracy, on others it cuts it noticeably. <b>Fix:</b> <i>validate the quantized model on a held-out set</i> and only ship if the accuracy loss is within budget.</li>
         <li><b>No monitoring and no latency budget.</b> A model that is correct on day one drifts as inputs change, and a p99 latency spike can break the calling product. <b>Fix:</b> set an explicit latency target, log inputs/outputs, and watch for drift (cross-link <code>skill-monitoring</code>).</li>
         <li><b>Loading the whole training stack just to infer.</b> Importing your full research environment to call one <code>forward()</code> bloats the container and slows cold starts. <b>Fix:</b> serve the exported TorchScript/ONNX graph with a minimal runtime instead.</li>
       </ul>`,

    bigIdea:
      `<p>A trained model in a notebook is the <i>start</i> of the work, not the end. The notebook gives you weights that work; production demands a graph that is fast, portable, observable, and cheap to run.</p>
       <p>The core move is <b>export</b>: freeze the model into a standalone graph that no longer needs Python or the training code. TorchScript freezes it into a PyTorch-native serialized graph; ONNX freezes it into a framework-neutral file that other engines can run. Either way, the result is a single artifact you can drop onto a server, a phone, or a C++ binary.</p>
       <p>The second move is <b>make it cheaper</b>: quantization swaps 32-bit floats for 8-bit integers, shrinking the file ~4x and speeding up the math, while you watch the accuracy to make sure the trade is worth it.</p>
       <p>The third move is <b>serve it well</b>: <code>eval()</code> + <code>inference_mode()</code> for correctness, batching for throughput, and monitoring for the long run.</p>`,

    buildup:
      `<p><b>1. Put the model in inference mode.</b> <code>model.eval()</code> once, and every prediction inside <code>with torch.inference_mode():</code>. This is non-negotiable and the most common deployment bug.</p>
       <p><b>2. Export to a Python-free graph.</b></p>
       <ul>
         <li><b>TorchScript by tracing:</b> <code>ts = torch.jit.trace(model, example_input)</code> — fast, but only for straight-line code.</li>
         <li><b>TorchScript by scripting:</b> <code>ts = torch.jit.script(model)</code> — compiles the actual Python control flow, so <code>if</code>/loops survive.</li>
         <li>Save/reload: <code>ts.save('m.ts')</code> / <code>torch.jit.load('m.ts')</code> — the loaded graph runs without your model class.</li>
       </ul>
       <p><b>3. Or export to ONNX</b> for cross-hardware runtimes: <code>torch.onnx.export(model, example_input, 'm.onnx', opset_version=..., dynamic_axes=...)</code>. Run it with ONNX Runtime: <code>ort.InferenceSession('m.onnx').run(...)</code>. Always compare its outputs to PyTorch's.</p>
       <p><b>4. Quantize</b> to shrink and speed up: dynamic quantization is one line — <code>torch.ao.quantization.quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)</code> — then re-validate accuracy.</p>
       <p><b>5. Serve.</b> A minimal FastAPI <code>/predict</code> endpoint for a quick service; TorchServe or Triton for a managed, scalable one; ExecuTorch / PyTorch Mobile to run the exported graph on a phone. Batch incoming requests to raise throughput.</p>`,

    symbols: [],

    derivation:
      `<p><b>What "a serialized graph" means.</b> Your model is Python code that, when called, executes a sequence of tensor operations. TorchScript captures that sequence as a static <i>graph</i> of operations and saves it with the weights. A C++ runtime can then replay the graph directly — no Python interpreter in the loop. That is why a TorchScript or ONNX artifact can run inside a mobile app or a C++ service where Python is unavailable.</p>
       <p><b>Trace vs script — why they differ.</b> <code>trace</code> runs your model once on an example and <i>records the operations that actually executed</i>. A branch not taken on that example is simply absent from the recording, so a data-dependent <code>if</code> is baked to one side forever. <code>script</code> instead <i>compiles the Python source</i> of <code>forward()</code> into the graph language, so branches and loops are preserved as real control flow. Rule of thumb: <code>script</code> when behavior depends on the data, <code>trace</code> for pure straight-line tensor math.</p>
       <p><b>Why ONNX needs an example and an opset.</b> <code>torch.onnx.export</code> also traces the model to discover its operations, then maps each PyTorch op to a standard ONNX operator at a chosen <i>opset version</i> (the version of the operator catalogue). The example input fixes the shapes; <code>dynamic_axes</code> marks which dimensions (e.g. batch size) may vary at run time. The receiving runtime must support that opset, which is why pinning versions matters.</p>
       <p><b>How int8 quantization saves time and space.</b> A float32 weight is 4 bytes; an int8 weight is 1 byte, so the model is ~4x smaller. Quantization stores each tensor as integers plus a scale (and zero-point): the real value is approximately <code>scale * (q - zero_point)</code>. Integer matrix multiplies are cheaper than float ones on most hardware, so inference speeds up. The cost is rounding error — usually tiny, but it must be measured, never assumed.</p>
       <p><b>Why <code>inference_mode</code> matters for the server.</b> Normally every forward pass also records the operations needed for a future <code>backward()</code>. At serving time you never call backward, so that bookkeeping is pure waste. <code>torch.inference_mode()</code> (a stricter, faster cousin of <code>no_grad()</code>) turns it off entirely, cutting memory and latency per request.</p>`,

    example:
      `<p>Work the float32 &rarr; int8 size win with the lesson's real param count: an image classifier with
       <b>268,650</b> parameters (conv1 448 + conv2 4,640 + fc1 262,272 + fc2 1,290 = 268,650).</p>
       <ul class="steps">
         <li><b>float32 size:</b> 4 bytes per weight, so $268650 \\times 4 = 1{,}074{,}600$ bytes
         $= 1{,}074{,}600 / 10^6 \\approx 1.07$ MB (megabytes).</li>
         <li><b>int8 size:</b> 1 byte per weight, so $268650 \\times 1 = 268{,}650$ bytes $\\approx 0.27$ MB.</li>
         <li><b>shrink factor:</b> $1.07 / 0.27 = 4\\times$ &mdash; the 4-bytes-to-1-byte ratio, exactly. Equivalently
         the int8 file is $0.27 / 1.07 \\approx 25\\%$ of the float32 file.</li>
       </ul>
       <table class="extable">
         <caption>Same 268,650 weights, four artifacts &mdash; export does not shrink; quantization does</caption>
         <thead><tr><th>artifact</th><th class="num">bytes/weight</th><th class="num">size (MB)</th><th class="num">vs float32</th></tr></thead>
         <tbody>
           <tr><td class="row-h">float32 (.pt)</td><td class="num">4</td><td class="num">1.07</td><td class="num">1.00&times;</td></tr>
           <tr><td class="row-h">TorchScript</td><td class="num">4</td><td class="num">1.07</td><td class="num">1.00&times;</td></tr>
           <tr><td class="row-h">ONNX</td><td class="num">4</td><td class="num">1.07</td><td class="num">1.00&times;</td></tr>
           <tr><td class="row-h">int8 quantized</td><td class="num">1</td><td class="num">0.27</td><td class="num">0.25&times;</td></tr>
         </tbody>
       </table>
       <p>Export it two ways. <code>ts = torch.jit.trace(model, x)</code> freezes it into a TorchScript graph you can
       <code>ts.save('m.ts')</code> and load in a C++ service. <code>torch.onnx.export(model, x, 'm.onnx', opset_version=17)</code>
       writes a portable file that <code>onnxruntime</code> runs on a CPU box with no PyTorch installed &mdash; both carry
       the <i>same</i> float32 weights, so the table shows their size unchanged at 1.07 MB.</p>
       <p>Before trusting either, you compare: run the same input through PyTorch (in <code>eval()</code> +
       <code>inference_mode()</code>) and through ONNX Runtime, and check <code>np.allclose(torch_out, onnx_out, atol=1e-4)</code>
       &mdash; a max absolute difference like $2 \\times 10^{-5}$ passes (below $10^{-4}$), while $0.41$ flags an export bug.
       If that passes and the quantized model's validation accuracy is within budget, you ship the smallest, fastest
       artifact behind a FastAPI <code>/predict</code> endpoint.</p>`,

    practice: [
      {
        q: `<b>Type this in Colab.</b> Build a tiny <code>nn.Linear(4, 3)</code> model, put it in <code>model.eval()</code>, trace it with <code>torch.jit.trace(model, example)</code> using an example of shape <code>(1, 4)</code>, and confirm the TorchScript output matches the eager output with <code>torch.allclose</code>. Use <code>torch.manual_seed(0)</code>.`,
        steps: [
          { do: `Call <code>model.eval()</code> before exporting, then <code>torch.jit.trace(model, example)</code>.`, why: `<code>eval()</code> is the must-do before any export; <code>trace</code> records the ops that run on the example input.` },
          { do: `Compare <code>ts(x)</code> to <code>model(x)</code> with <code>torch.allclose</code>.`, why: `Always verify the exported graph reproduces the original numerically before trusting it.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

torch.manual_seed(0)
model = nn.Linear(4, 3).eval()      # eval() before export -- the must-do
example = torch.randn(1, 4)
ts = torch.jit.trace(model, example)
with torch.inference_mode():
    print(torch.allclose(ts(example), model(example)))   # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Demonstrate the <b>trace-vs-script control-flow gotcha</b>. Write a module whose <code>forward</code> returns <code>x.sum()</code> if <code>x.sum() &gt; 0</code> else <code>-x.sum()</code>. Trace it on a POSITIVE example, then feed it a NEGATIVE input and show the traced output is wrong. Re-export with <code>torch.jit.script</code> and show it is now correct.`,
        steps: [
          { do: `Trace on a positive example, then call the traced module on a negative input.`, why: `<code>trace</code> freezes whichever branch the example took, so the <code>if</code> is baked to one side for all future inputs.` },
          { do: `Re-export with <code>torch.jit.script(m)</code> and call it on the same negative input.`, why: `<code>script</code> compiles the Python control flow, so the data-dependent <code>if</code> survives.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

class M(nn.Module):
    def forward(self, x):
        if x.sum() &gt; 0:
            return x.sum()
        return -x.sum()

m = M().eval()
traced = torch.jit.trace(m, torch.tensor([1.0, 2.0]))   # positive example
print(traced(torch.tensor([-5.0])).item())   # -5.0  (WRONG: branch frozen)

scripted = torch.jit.script(m)
print(scripted(torch.tensor([-5.0])).item()) #  5.0  (correct: if preserved)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Save a TorchScript module to disk and reload it WITHOUT the original class. Trace an <code>nn.Linear(4, 2)</code>, call <code>ts.save("m.ts")</code>, then <code>reloaded = torch.jit.load("m.ts")</code>, and confirm <code>reloaded</code> produces the same output on a <code>(3, 4)</code> input. Predict the output shape first.`,
        steps: [
          { do: `Persist with <code>ts.save("m.ts")</code> and bring it back with <code>torch.jit.load</code>.`, why: `A saved TorchScript graph carries its own ops + weights, so it runs without the Python model class &mdash; the whole point of exporting.` },
          { do: `Run a <code>(3, 4)</code> batch through the reloaded module and check the shape.`, why: `A <code>Linear(4, 2)</code> maps the last dim 4&rarr;2, so a batch of 3 gives <code>(3, 2)</code>.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn

torch.manual_seed(0)
model = nn.Linear(4, 2).eval()
ts = torch.jit.trace(model, torch.randn(1, 4))
ts.save("m.ts")

reloaded = torch.jit.load("m.ts")     # no Net class needed
x = torch.randn(3, 4)
print(reloaded(x).shape)              # torch.Size([3, 2])
print(torch.allclose(reloaded(x), model(x)))   # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Export a model to <b>ONNX</b> and verify the file exists. Build <code>nn.Linear(8, 4).eval()</code>, call <code>torch.onnx.export</code> with an example of shape <code>(1, 8)</code>, <code>opset_version=17</code>, and <code>dynamic_axes</code> on the batch dimension, then use <code>os.path.exists("m.onnx")</code> and <code>os.path.getsize</code> to confirm the file was written.`,
        steps: [
          { do: `Call <code>torch.onnx.export(model, example, "m.onnx", opset_version=17, dynamic_axes=...)</code>.`, why: `Exporting traces the model into a portable ONNX graph; pinning the opset keeps it loadable across runtime versions.` },
          { do: `Check <code>os.path.exists("m.onnx")</code> and the byte size.`, why: `Confirms the export actually produced an artifact on disk.` }
        ],
        answer: `<pre><code>import torch, torch.nn as nn, os

model = nn.Linear(8, 4).eval()
x = torch.randn(1, 8)
torch.onnx.export(
    model, x, "m.onnx",
    input_names=["input"], output_names=["out"],
    opset_version=17,
    dynamic_axes={"input": {0: "batch"}, "out": {0: "batch"}},
)
print(os.path.exists("m.onnx"))           # True
print(os.path.getsize("m.onnx") &gt; 0)      # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Run an exported ONNX model with <code>onnxruntime</code> and check it matches PyTorch across the boundary. Export <code>nn.Linear(8, 4).eval()</code> to <code>m.onnx</code>, create an <code>InferenceSession</code>, run a <code>(2, 8)</code> input through it, and assert <code>np.allclose(onnx_out, torch_out, atol=1e-4)</code>. (onnxruntime is auto-installed by the notebook setup cell.)`,
        steps: [
          { do: `Create <code>ort.InferenceSession("m.onnx")</code> and call <code>.run(...)</code> with the numpy input.`, why: `ONNX Runtime executes the portable graph with no PyTorch installed &mdash; the production path.` },
          { do: `Compare the ONNX output to PyTorch's with <code>np.allclose</code>.`, why: `Numeric drift across the ONNX boundary is a classic deployment bug; verify before shipping.` }
        ],
        answer: `<pre><code>import torch, torch.nn as nn, numpy as np
import onnxruntime as ort

torch.manual_seed(0)
model = nn.Linear(8, 4).eval()
x = torch.randn(2, 8)
torch.onnx.export(model, x, "m.onnx",
                  input_names=["input"], output_names=["out"],
                  opset_version=17,
                  dynamic_axes={"input": {0: "batch"}, "out": {0: "batch"}})

with torch.inference_mode():
    torch_out = model(x).numpy()
sess = ort.InferenceSession("m.onnx", providers=["CPUExecutionProvider"])
onnx_out = sess.run(["out"], {"input": x.numpy()})[0]
print(np.allclose(onnx_out, torch_out, atol=1e-4))   # True</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Apply <b>dynamic int8 quantization</b> to the linear layers and measure the file-size drop. Build a model with two <code>nn.Linear</code> layers, quantize with <code>torch.ao.quantization.quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)</code>, save both state dicts, and print the float32 vs int8 file sizes in KB.`,
        steps: [
          { do: `Call <code>quantize_dynamic(model, {nn.Linear}, dtype=torch.qint8)</code>.`, why: `Dynamic quantization stores Linear weights as int8 (1 byte) instead of float32 (4 bytes) &mdash; about 4&times; smaller.` },
          { do: `Save both <code>state_dict</code>s and compare <code>os.path.getsize</code>.`, why: `Showing the real byte sizes makes the ~4&times; shrink concrete.` }
        ],
        answer: `<pre><code>import torch, torch.nn as nn, os

model = nn.Sequential(nn.Linear(256, 256), nn.ReLU(), nn.Linear(256, 64)).eval()
qmodel = torch.ao.quantization.quantize_dynamic(
    model, {nn.Linear}, dtype=torch.qint8).eval()

torch.save(model.state_dict(),  "fp32.pt")
torch.save(qmodel.state_dict(), "int8.pt")
print("fp32 KB:", round(os.path.getsize("fp32.pt") / 1e3, 1))   # ~ 345.x
print("int8 KB:", round(os.path.getsize("int8.pt") / 1e3, 1))   # ~  92.x (much smaller)
# NOTE: always re-validate accuracy on a held-out set before shipping int8!</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Save a whole TorchScript MODULE (not just a state_dict) and reload it for serving. Trace a 2-layer model, save it with <code>ts.save("served.ts")</code>, load it with <code>torch.jit.load</code> into <code>eval()</code> mode, and run one prediction inside <code>torch.inference_mode()</code>, printing the predicted class via <code>argmax</code>.`,
        steps: [
          { do: `Save the TorchScript module and reload it, then call <code>.eval()</code>.`, why: `Serving loads the self-contained graph; <code>eval()</code> is non-negotiable so dropout/batch-norm behave deterministically.` },
          { do: `Run the prediction inside <code>torch.inference_mode()</code> and take <code>argmax</code>.`, why: `<code>inference_mode</code> skips autograd bookkeeping you never use at serving, cutting per-request memory and latency.` }
        ],
        answer: `<pre><code>import torch, torch.nn as nn

torch.manual_seed(0)
model = nn.Sequential(nn.Linear(8, 16), nn.ReLU(), nn.Linear(16, 3)).eval()
ts = torch.jit.trace(model, torch.randn(1, 8))
ts.save("served.ts")

served = torch.jit.load("served.ts").eval()   # eval() for correct serving
x = torch.randn(1, 8)
with torch.inference_mode():                   # no autograd graph per request
    logits = served(x)
print(logits.argmax(1).item())                 # 2  (the predicted class index)</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Show why <code>model.eval()</code> matters at serving. Build <code>nn.Sequential(nn.Linear(4, 4), nn.Dropout(0.5))</code>. With the model in <code>train()</code> mode, run the SAME input twice and print whether the two outputs match (they won't, because dropout is random). Switch to <code>eval()</code> and show the two outputs now match. Use <code>torch.manual_seed(0)</code>.`,
        steps: [
          { do: `In <code>train()</code> mode, call the model twice on one input and compare with <code>torch.equal</code>.`, why: `Dropout randomly zeroes units in training mode, so the same input gives different, non-deterministic answers &mdash; the famous serving bug.` },
          { do: `Call <code>model.eval()</code> and repeat.`, why: `<code>eval()</code> turns dropout off (and batch-norm to running stats), making predictions deterministic.` }
        ],
        answer: `<pre><code>import torch, torch.nn as nn

torch.manual_seed(0)
model = nn.Sequential(nn.Linear(4, 4), nn.Dropout(0.5))
x = torch.randn(1, 4)

model.train()
print(torch.equal(model(x), model(x)))   # False  -- dropout is random!

model.eval()
print(torch.equal(model(x), model(x)))   # True   -- deterministic at serving</code></pre>`
      }
    ]
  });

  window.CODE["pt-deployment"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>One Colab cell that walks the whole deployment path. It builds a tiny image classifier, puts it in <b><code>eval()</code></b> mode, then: (1) exports to <b>TorchScript</b> by both <code>trace</code> and <code>script</code>, saves and reloads it; (2) exports to <b>ONNX (Open Neural Network Exchange)</b> with <code>torch.onnx.export</code> and runs it with <b>onnxruntime</b>, checking the outputs match PyTorch; (3) applies <b>dynamic int8 quantization</b> and prints the size drop; (4) sketches a minimal <b>FastAPI</b> <code>/predict</code> function. <code>onnx</code> and <code>onnxruntime</code> are auto-installed by the notebook setup cell.</p>`,
    code: `import torch, torch.nn as nn, numpy as np, os

torch.manual_seed(0)

# ---- a tiny image classifier (3x32x32 -> 10 classes) ----
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 16, 3, padding=1)
        self.conv2 = nn.Conv2d(16, 32, 3, padding=1)
        self.pool  = nn.MaxPool2d(2)
        self.fc1   = nn.Linear(32 * 8 * 8, 128)
        self.fc2   = nn.Linear(128, 10)
    def forward(self, x):
        x = self.pool(torch.relu(self.conv1(x)))   # 16x16
        x = self.pool(torch.relu(self.conv2(x)))   #  8x8
        x = x.flatten(1)
        x = torch.relu(self.fc1(x))
        return self.fc2(x)                          # logits

model = Net().eval()                                # <-- inference mode (the famous must-do)
n_params = sum(p.numel() for p in model.parameters())
print("params:", n_params, "| fp32 MB:", round(n_params * 4 / 1e6, 3))

x = torch.randn(1, 3, 32, 32)                       # one example input
with torch.inference_mode():                        # no autograd graph at serving
    ref = model(x)

# ================================================================
# 1) TORCHSCRIPT: trace (straight-line) and script (keeps control flow)
# ================================================================
ts_traced = torch.jit.trace(model, x)               # records ops for THIS input
ts_scripted = torch.jit.script(model)               # compiles the Python -> graph
ts_traced.save("model_ts.pt")
reloaded = torch.jit.load("model_ts.pt")            # runs WITHOUT the Net class / Python
with torch.inference_mode():
    print("TorchScript matches PyTorch:",
          torch.allclose(reloaded(x), ref, atol=1e-5))

# ================================================================
# 2) ONNX (Open Neural Network Exchange): export + run with onnxruntime
# ================================================================
# (the notebook setup cell installs onnx + onnxruntime)
import onnx, onnxruntime as ort
torch.onnx.export(
    model, x, "model.onnx",
    input_names=["input"], output_names=["logits"],
    opset_version=17,                               # PIN the opset across the boundary
    dynamic_axes={"input": {0: "batch"}, "logits": {0: "batch"}},  # variable batch size
)
onnx.checker.check_model(onnx.load("model.onnx"))   # structural validity
sess = ort.InferenceSession("model.onnx", providers=["CPUExecutionProvider"])
onnx_out = sess.run(["logits"], {"input": x.numpy()})[0]
print("ONNX Runtime matches PyTorch:",
      np.allclose(onnx_out, ref.numpy(), atol=1e-4))   # ALWAYS verify across the boundary

# ================================================================
# 3) DYNAMIC QUANTIZATION: int8 the Linear layers -> smaller + faster
# ================================================================
qmodel = torch.ao.quantization.quantize_dynamic(
    model, {nn.Linear}, dtype=torch.qint8
).eval()
torch.save(model.state_dict(),  "fp32.pt")
torch.save(qmodel.state_dict(), "int8.pt")
print("fp32 file KB:", round(os.path.getsize("fp32.pt") / 1e3, 1),
      "| int8 file KB:", round(os.path.getsize("int8.pt") / 1e3, 1))
# NOTE: always re-validate accuracy on a held-out set before shipping int8!

# ================================================================
# 4) SERVE: a minimal FastAPI /predict sketch (preprocess shared w/ training)
# ================================================================
SERVE = '''
from fastapi import FastAPI
import torch
app = FastAPI()
model = torch.jit.load("model_ts.pt").eval()      # load the exported graph, eval mode

def preprocess(payload):                           # SAME steps as training -> no skew
    t = torch.tensor(payload["pixels"]).float().reshape(1, 3, 32, 32)
    return (t - 0.5) / 0.5                          # match the training normalization

@app.post("/predict")
def predict(payload: dict):
    x = preprocess(payload)
    with torch.inference_mode():                   # no grad graph per request
        logits = model(x)
    return {"class": int(logits.argmax(1).item())}
'''
print(SERVE)`
  };

  window.CODEVIZ["pt-deployment"] = {
    question: "Across the deployment pipeline (FP32 -> TorchScript -> ONNX -> int8), how do you READ the size/latency bars — and the two charts that catch the things that go WRONG (int8 accuracy drop, ONNX output drift)?",
    charts: [
      {
        type: "bars",
        title: "Healthy: model size on disk (MB) — int8 is ~4x smaller",
        xlabel: "artifact",
        ylabel: "size (MB)",
        labels: ["FP32 (.pt)", "TorchScript", "ONNX Runtime", "int8 quantized"],
        values: [1.075, 1.085, 1.075, 0.269],
        valueLabels: ["1.07", "1.08", "1.07", "0.27"],
        colors: ["#ff7b72", "#4ea1ff", "#c89bff", "#7ee787"],
        interpret: "<b>Each bar is one artifact; height = bytes on disk.</b> Real numbers: the classifier has 268,650 params, so at float32 (4 bytes each) it is ~1.07 MB. TorchScript and ONNX carry the SAME float32 weights, so their bars are essentially identical (tiny graph/metadata overhead) — <b>export alone does not shrink the model</b>. Only the green int8 bar drops, to ~0.27 MB, because each weight is now 1 byte instead of 4. Read it as: if you need a smaller file, quantization is the lever, not export."
      },
      {
        type: "bars",
        title: "Healthy: inference latency per request (ms) — each runtime faster",
        xlabel: "runtime",
        ylabel: "latency (ms, lower is better)",
        labels: ["FP32 eager", "TorchScript", "ONNX Runtime", "int8 quantized"],
        values: [12.0, 9.0, 6.5, 4.0],
        valueLabels: ["12.0", "9.0", "6.5", "4.0"],
        colors: ["#ff7b72", "#4ea1ff", "#c89bff", "#7ee787"],
        interpret: "<b>Lower is better</b> here — each bar is per-request latency. The staircase down means each step removes overhead: TorchScript drops the Python interpreter, ONNX Runtime adds graph-level op optimization, int8 swaps float math for cheaper integer math (~3x faster than eager overall). Numbers are <b>illustrative but plausible</b>; latency is hardware-dependent, so always benchmark on your own serving box — read the SHAPE (monotonic improvement), not the exact values."
      },
      {
        type: "bars",
        title: "Pitfall: int8 accuracy drop you never measured",
        xlabel: "model",
        ylabel: "validation accuracy (%)",
        labels: ["FP32 (baseline)", "int8 (mild loss, ship)", "int8 (big loss, DON'T ship)"],
        values: [91.2, 90.7, 78.3],
        valueLabels: ["91.2", "90.7", "78.3"],
        colors: ["#9aa7b4", "#7ee787", "#ff7b72"],
        interpret: "Illustrative. <b>The size win is free; the accuracy cost is not.</b> int8 is lossy: on a forgiving model the green bar barely moves from the grey FP32 baseline (91.2 -> 90.7, ship it), but on a sensitive model the red bar craters (91.2 -> 78.3). The whole point of this chart is that you cannot tell which case you are in WITHOUT measuring — <b>re-validate the quantized model on a held-out set</b> and only ship if the drop is within budget."
      },
      {
        type: "bars",
        title: "Pitfall: ONNX output drifts from PyTorch (export bug)",
        xlabel: "case",
        ylabel: "max abs difference vs PyTorch",
        labels: ["healthy (allclose True)", "drift: bad opset / unsupported op"],
        values: [0.00002, 0.41],
        valueLabels: ["2e-5", "0.41"],
        colors: ["#7ee787", "#ff7b72"],
        interpret: "Illustrative. After export you compare ONNX Runtime output to PyTorch with <code>np.allclose(..., atol=1e-4)</code>; this bar is the max absolute difference. <b>The green bar (~2e-5) is below tolerance — the graphs agree, ship it.</b> The red bar (0.41) is far above: an unsupported op was approximated, or the opset version mismatched the runtime. Read a tall bar as 'do NOT ship' — pin the opset, run <code>onnx.checker</code>, and find the op that diverged before serving."
      }
    ],
    caption: "Four charts: read the two healthy pipeline bars (size shrinks only at int8; latency steps down at each runtime), then the two that catch deployment bugs. The accuracy chart shows int8 can be free OR costly — you must measure. The drift chart shows the cross-boundary check: a small max-diff means ONNX matches PyTorch; a large one means an export bug. Size bars use the real param count; latency, accuracy, and drift bars are illustrative but qualitatively honest.",
    code: `import numpy as np

# ---- model param count, layer by layer (real architecture from the CODE cell) ----
def conv(cin, cout, k):  return cout * cin * k * k + cout
def lin(fin, fout):      return fin * fout + fout

params = (
    conv(3, 16, 3)          # conv1 -> 448
  + conv(16, 32, 3)         # conv2 -> 4640
  + lin(32 * 8 * 8, 128)    # fc1   -> 262272
  + lin(128, 10)            # fc2   -> 1290
)
print("total params:", params)                      # 268650

# ---- size from param count: float32 = 4 bytes, int8 = 1 byte ----
fp32_mb = params * 4 / 1e6
int8_mb = params * 1 / 1e6
sizes = {
    "FP32 (.pt)":     round(fp32_mb, 3),            # 1.075
    "TorchScript":    round(fp32_mb * 1.01, 3),     # ~same weights + tiny graph overhead
    "ONNX Runtime":   round(fp32_mb, 3),            # same float32 weights
    "int8 quantized": round(int8_mb, 3),            # ~4x smaller -> 0.269
}
print("size MB:", sizes)
print("size reduction (int8):", round(fp32_mb / int8_mb, 2), "x")  # 4.0x

# ---- latency: illustrative, monotonically improving across optimized runtimes ----
latency_ms = {
    "FP32 eager":     12.0,
    "TorchScript":     9.0,
    "ONNX Runtime":    6.5,
    "int8 quantized":  4.0,
}
print("latency ms:", latency_ms)
print("speedup (int8 vs eager):", round(12.0 / 4.0, 2), "x")        # 3.0x

# ---- charts ----
import matplotlib.pyplot as plt
fig, ax = plt.subplots(1, 2, figsize=(11, 4))
cols = ["#ff7b72", "#4ea1ff", "#c89bff", "#7ee787"]
ax[0].bar(list(sizes.keys()), list(sizes.values()), color=cols)
ax[0].set_ylabel("size (MB)"); ax[0].set_title("model size on disk")
ax[0].tick_params(axis="x", rotation=20)
ax[1].bar(list(latency_ms.keys()), list(latency_ms.values()), color=cols)
ax[1].set_ylabel("latency (ms)"); ax[1].set_title("inference latency (lower is better)")
ax[1].tick_params(axis="x", rotation=20)
plt.tight_layout(); plt.show()`
  };
})();
