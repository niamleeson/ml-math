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
    module: "PyTorch (a complete course)",
    prereqs: ["pt-save-load", "pt-nn-module", "skill-monitoring", "skill-limitations"],

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
      `<p>Suppose a small image classifier with about 268,650 parameters. At float32 (4 bytes each) the weights are roughly <code>268650 x 4 ≈ 1.07 MB (megabytes)</code>. Quantize the linear layers to int8 (1 byte each) and the same numbers take roughly a quarter of the space — about <code>0.27 MB</code>.</p>
       <p>Export it two ways. <code>ts = torch.jit.trace(model, x)</code> freezes it into a TorchScript graph you can <code>ts.save('m.ts')</code> and load in a C++ service. <code>torch.onnx.export(model, x, 'm.onnx', opset_version=17)</code> writes a portable file that <code>onnxruntime</code> runs on a CPU box with no PyTorch installed.</p>
       <p>Before trusting either, you compare: run the same input through PyTorch (in <code>eval()</code> + <code>inference_mode()</code>) and through ONNX Runtime, and check <code>np.allclose(torch_out, onnx_out)</code>. If that passes and the quantized model's validation accuracy is within budget, you ship the smallest, fastest artifact behind a FastAPI <code>/predict</code> endpoint.</p>`,

    practice: [
      {
        q: `Your model has an <code>if x.sum() &gt; 0:</code> branch inside <code>forward()</code>. You export it with <code>torch.jit.trace</code> and deploy. Some inputs now give clearly wrong answers. What happened, and how do you fix the export?`,
        steps: [
          { do: `Recall what <code>trace</code> records.`, why: `<code>trace</code> runs the model on one example and records only the operations that actually ran — the branch <i>not</i> taken on that example is missing from the graph.` },
          { do: `Realize the branch was frozen.`, why: `Whichever side of the <code>if</code> the example triggered is baked in for every future input, so inputs that should take the other branch are handled wrongly.` },
          { do: `Re-export with <code>torch.jit.script(model)</code>.`, why: `<code>script</code> compiles the actual Python control flow, so the <code>if</code> survives as a real branch in the graph.` }
        ],
        answer: `<code>trace</code> dropped the data-dependent branch (it only saw one path). Use <code>ts = torch.jit.script(model)</code> instead, which preserves the <code>if</code>. Reserve <code>trace</code> for straight-line tensor code.`
      },
      {
        q: `You quantized your model to int8 to make it 4x smaller and faster. How do you decide whether it is safe to ship?`,
        steps: [
          { do: `Remember quantization is lossy.`, why: `int8 rounds every weight, so the model's outputs shift slightly; the effect on accuracy varies by model and cannot be assumed.` },
          { do: `Evaluate the quantized model on a held-out validation set.`, why: `The only way to know the real cost is to measure the same metric you used in training on data the model never saw.` },
          { do: `Compare against your accuracy budget.`, why: `Ship only if the drop is within the budget the product can tolerate; otherwise keep float32 or try a less aggressive scheme.` }
        ],
        answer: `Validate the int8 model on held-out data and compare its accuracy to the float32 model against an explicit budget. Never assume "little loss" — measure it.`
      },
      {
        q: `Your FastAPI <code>/predict</code> endpoint works but is slow and occasionally returns inconsistent answers for the same input. List the two serving-time fixes.`,
        steps: [
          { do: `Set the model to inference mode at load: <code>model.eval()</code>.`, why: `In training mode dropout randomly zeroes units and batch-norm uses batch stats, so the same input can give different (and wrong) answers.` },
          { do: `Wrap every prediction in <code>with torch.inference_mode():</code>.`, why: `Stops PyTorch from building the autograd graph you never use at serving, cutting per-request memory and latency.` }
        ],
        answer: `Call <code>model.eval()</code> once at load (fixes the non-determinism from dropout/batch-norm) and run each request inside <code>torch.inference_mode()</code> (fixes the wasted memory/latency). Batching requests further raises throughput.`
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
    question: "How much smaller and faster does the model get as you move from FP32 eager PyTorch to TorchScript, to ONNX Runtime, to int8 quantization?",
    charts: [
      {
        type: "bars",
        title: "Model size on disk (MB) — int8 is ~4x smaller",
        xlabel: "artifact",
        ylabel: "size (MB)",
        labels: ["FP32 (.pt)", "TorchScript", "ONNX Runtime", "int8 quantized"],
        values: [1.075, 1.085, 1.075, 0.269],
        valueLabels: ["1.07", "1.08", "1.07", "0.27"],
        colors: ["#ff7b72", "#4ea1ff", "#c89bff", "#7ee787"]
      },
      {
        type: "bars",
        title: "Inference latency per request (ms) — each runtime faster",
        xlabel: "runtime",
        ylabel: "latency (ms, lower is better)",
        labels: ["FP32 eager", "TorchScript", "ONNX Runtime", "int8 quantized"],
        values: [12.0, 9.0, 6.5, 4.0],
        valueLabels: ["12.0", "9.0", "6.5", "4.0"],
        colors: ["#ff7b72", "#4ea1ff", "#c89bff", "#7ee787"]
      }
    ],
    caption: "Left (size, real): the classifier has 268,650 parameters; at float32 (4 bytes each) that is 268650 x 4 ≈ 1.07 MB. TorchScript and ONNX carry the same float32 weights, so their size barely changes (a small graph/metadata overhead); int8 quantization stores each weight in 1 byte, ≈ 0.27 MB — a 4x shrink, computed from the real param count. Right (latency, illustrative but plausible): exporting to a Python-free graph removes interpreter overhead (TorchScript), a dedicated engine optimizes the op graph (ONNX Runtime), and int8 integer math is cheaper than float (quantized) — here a 3x speedup over eager FP32. Latency is hardware-dependent: always benchmark on your own serving box. The size numbers are reproduced exactly by the numpy below.",
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
