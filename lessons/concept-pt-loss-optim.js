(function () {
  window.LESSONS.push({
    id: "pt-loss-optim",
    title: "Loss functions and optimizers",
    tagline: "The two pieces that turn a model into learning: a loss to score it, an optimizer to fix it.",
    module: "PyTorch (a complete course)",
    prereqs: ["dl-cross-entropy", "dl-optimizers", "ml-gradient-descent"],
    whenToUse:
      `<p><b>Every trained model needs both.</b> A <b>loss function</b> turns the model's output into one
        number — how wrong it is right now. An <b>optimizer</b> reads the gradients of that number and
        nudges the weights to make it smaller.</p>
       <ul>
         <li><b>Pick the loss by the task.</b> Regression (predict a number) &rarr; <code>nn.MSELoss</code>.
             Single-label classification &rarr; <code>nn.CrossEntropyLoss</code>. Binary or multi-label
             (each label independent) &rarr; <code>nn.BCEWithLogitsLoss</code>.</li>
         <li><b>Default optimizer:</b> reach for <code>Adam</code> or <code>AdamW</code> first. They adapt
             the step size per parameter and "just work" on most problems with little tuning. Use plain
             <code>SGD</code> with momentum when you want the very best final accuracy and have time to tune.</li>
       </ul>`,
    application:
      `<p>This is the heart of the training loop. Whether you are fine-tuning a language model, training a
        convolutional network on images, or fitting a tiny tabular model, the same three lines appear every
        step: <code>optimizer.zero_grad()</code> &rarr; <code>loss.backward()</code> &rarr;
        <code>optimizer.step()</code>. Get the loss and optimizer right and the rest is plumbing.</p>`,
    pitfalls:
      `<ul>
        <li><b>Softmax before <code>CrossEntropyLoss</code> (double softmax).</b> <code>nn.CrossEntropyLoss</code>
            applies log-softmax <i>internally</i>. If your model's last layer is a softmax, you apply it twice
            and training breaks. <b>Fix:</b> the model outputs raw <b>logits</b> — no softmax in the network.</li>
        <li><b>One-hot targets to <code>CrossEntropyLoss</code>.</b> It wants <b>integer class indices</b>
            (a 1-D <code>LongTensor</code> like <code>[2, 0, 1]</code>), not one-hot rows. <b>Fix:</b> pass the
            class index per sample.</li>
        <li><b>Forgetting <code>optimizer.zero_grad()</code>.</b> PyTorch <i>accumulates</i> gradients across
            <code>backward()</code> calls. Skip the reset and this step's gradient is added on top of last step's
            — the update is wrong. <b>Fix:</b> call <code>zero_grad()</code> at the top of every step.</li>
        <li><b>Learning rate too high &rarr; diverge</b> (loss explodes to <code>nan</code>); <b>too low &rarr;
            crawl</b> (loss barely moves). <b>Fix:</b> start near <code>1e-3</code> for Adam, <code>1e-2</code>
            for SGD, and adjust by a factor of 10.</li>
        <li><b>Optimizer not given the model's parameters.</b> <code>optim.Adam(lr=...)</code> with no params,
            or params from the wrong model, means <code>step()</code> updates nothing. <b>Fix:</b>
            <code>optim.Adam(model.parameters(), lr=...)</code>.</li>
        <li><b>Not stepping the scheduler.</b> A learning-rate scheduler only changes the rate when you call
            <code>scheduler.step()</code> (once per epoch, after the optimizer steps). Forget it and the rate
            never moves.</li>
      </ul>`,
    bigIdea:
      `<p>Learning is a feedback loop. The <b>loss</b> answers "how wrong are we?" as a single number. Calling
        <code>loss.backward()</code> fills every parameter's <code>.grad</code> with the slope of that number
        with respect to that parameter. The <b>optimizer</b> then takes one downhill step.</p>
       <p>You attach the optimizer to the model's parameters once. From then on it remembers where they live and,
        for adaptive methods like Adam, keeps running statistics (a moving average of past gradients) to size each
        step automatically.</p>`,
    buildup:
      `<p>The math of why we descend the gradient is in <code>ml-gradient-descent</code>; why cross-entropy is
        the right loss for classification is in <code>dl-cross-entropy</code>; and how Adam improves on plain
        gradient descent is in <code>dl-optimizers</code>. Here we focus on the <i>PyTorch</i> (Python deep-learning
        library) wiring: which class to instantiate, and the exact three-step update that runs every iteration.</p>
       <p>The <b>three-step update</b>, in order, every step:</p>
       <ol>
         <li><code>optimizer.zero_grad()</code> — clear last step's gradients so they don't accumulate.</li>
         <li><code>loss.backward()</code> — backpropagate; fill every <code>.grad</code>.</li>
         <li><code>optimizer.step()</code> — move each parameter one step downhill.</li>
       </ol>`,
    symbols: [],
    formula: `$$w \\leftarrow w - \\eta \\, \\nabla_w \\, \\mathcal{L}$$`,
    whatItDoes:
      `<p>This is the plain-SGD update that <code>optimizer.step()</code> performs. Read it as: the new weight
        <code>w</code> equals the old weight minus the learning rate (the small positive number we call
        <code>η</code>, "eta") times the gradient of the loss <code>L</code> with respect to that weight. The
        gradient points uphill, so subtracting it walks downhill. <code>Adam</code> uses the same shape but
        rescales the step per parameter using running gradient statistics.</p>`,
    derivation:
      `<p><b>What each loss actually computes.</b></p>
       <ul>
         <li><code>nn.MSELoss</code> — mean of the squared differences between prediction and target. For a
             regression output and a float target of the same shape.</li>
         <li><code>nn.CrossEntropyLoss</code> — takes raw <b>logits</b> of shape <code>(N, C)</code> for N samples
             and C classes, plus integer targets of shape <code>(N,)</code>. It does log-softmax then negative
             log-likelihood in one numerically stable step. <b>No softmax in your model.</b></li>
         <li><code>nn.BCEWithLogitsLoss</code> — binary cross-entropy that takes logits and applies the sigmoid
             internally (stable). Use it for one-vs-rest / multi-label targets (floats in <code>{0,1}</code>).</li>
         <li><code>nn.NLLLoss</code> — negative log-likelihood; expects <i>already</i> log-probabilities (e.g. from
             <code>F.log_softmax</code>). <code>CrossEntropyLoss</code> = <code>LogSoftmax</code> + <code>NLLLoss</code>,
             so prefer <code>CrossEntropyLoss</code> and skip the manual softmax.</li>
       </ul>
       <p><b>Optimizers.</b> Construct with the model's parameters and a learning rate:
        <code>opt = torch.optim.Adam(model.parameters(), lr=1e-3)</code>. <code>SGD</code> is the textbook update
        above (add <code>momentum=0.9</code> in practice). <code>Adam</code> adapts the step per parameter from
        moving averages of the gradient and its square. <code>AdamW</code> is Adam with correct weight decay and is
        the modern default for transformers.</p>
       <p><b>Learning-rate schedulers</b> shrink the rate over time so training settles. <code>StepLR</code> multiplies
        the rate by a factor every few epochs; <code>CosineAnnealingLR</code> glides it down a cosine curve to near
        zero. Call <code>scheduler.step()</code> once per epoch.</p>`,
    example:
      `<p>Three classes, two samples. The model emits logits (no softmax):</p>
       <p><code>logits = [[2.0, 0.5, -1.0], [0.1, 1.5, 0.2]]</code> &nbsp; (shape <code>(2, 3)</code>)<br>
          <code>targets = [0, 1]</code> &nbsp; (class indices, shape <code>(2,)</code> — NOT one-hot)</p>
       <p><code>nn.CrossEntropyLoss()(logits, targets)</code> log-softmaxes each row and picks out the log-probability
        of the true class, then averages and negates. Sample 0's true class (index 0) already has the largest logit,
        so its loss is small; sample 1's true class (index 1) is the largest too, so the total loss is low and will
        drop further as training sharpens these logits.</p>`,
    practice: [
      {
        q: `Your image classifier ends with <code>nn.Softmax(dim=1)</code> and you train it with
            <code>nn.CrossEntropyLoss</code>. Accuracy is stuck. What's wrong and how do you fix it?`,
        steps: [
          { do: `Recall what CrossEntropyLoss does to its input.`, why: `It applies log-softmax internally, so it expects raw logits.` },
          { do: `Notice the model already applied softmax.`, why: `You are now softmaxing twice — the gradients are tiny and learning stalls.` }
        ],
        answer: `Remove the <code>Softmax</code> layer so the model outputs raw logits. <code>CrossEntropyLoss</code>
                 handles the softmax itself. (For inference, apply softmax separately if you need probabilities.)`
      },
      {
        q: `You write the loop as <code>loss.backward(); optimizer.step()</code> with no
            <code>zero_grad()</code>. The loss behaves erratically. Why?`,
        steps: [
          { do: `Recall PyTorch's gradient behavior.`, why: `<code>.grad</code> accumulates across backward calls; it is not reset automatically.` },
          { do: `Trace step 2.`, why: `Its gradient is added on top of step 1's leftover gradient — the update direction is corrupted.` }
        ],
        answer: `Call <code>optimizer.zero_grad()</code> at the top of every step, before
                 <code>loss.backward()</code>. Then each step uses only its own gradient.`
      },
      {
        q: `Pick the loss: (a) predicting house price (a number), (b) predicting one of 10 digit classes,
            (c) tagging an image with any of 5 non-exclusive labels.`,
        steps: [
          { do: `Match task type to loss.`, why: `Regression &rarr; squared error; single-label &rarr; cross-entropy; independent labels &rarr; per-label binary.` }
        ],
        answer: `(a) <code>nn.MSELoss</code>. (b) <code>nn.CrossEntropyLoss</code> on logits with integer targets.
                 (c) <code>nn.BCEWithLogitsLoss</code> on logits with multi-hot float targets.`
      }
    ]
  });

  window.CODE["pt-loss-optim"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>A tiny 3-class classification problem. We build a small network that outputs <b>raw logits</b> (note:
        <i>no softmax</i> at the end), pick <code>nn.CrossEntropyLoss</code> + <code>optim.Adam</code>, and run the
        <code>zero_grad</code> &rarr; <code>backward</code> &rarr; <code>step</code> trio for a few iterations. Watch the
        loss fall. The comments flag the famous <code>CrossEntropyLoss</code> gotchas: it eats logits, and its targets
        are integer class indices, not one-hot.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)  # reproducible

# --- tiny synthetic 3-class problem: 60 points, 4 features ---
N, D_in, C = 60, 4, 3
X = torch.randn(N, D_in)
# integer class labels 0/1/2 -- NOT one-hot. CrossEntropyLoss wants indices.
y = torch.randint(0, C, (N,))            # shape (N,), dtype long

# --- model: outputs raw LOGITS of shape (N, C). NO softmax at the end! ---
model = nn.Sequential(
    nn.Linear(D_in, 16),
    nn.ReLU(),
    nn.Linear(16, C),                    # last layer -> raw logits, that's it
)

# loss + optimizer. Adam is given the model's parameters and a learning rate.
criterion = nn.CrossEntropyLoss()        # applies log-softmax INTERNALLY
optimizer = torch.optim.Adam(model.parameters(), lr=1e-2)

for step in range(20):
    logits = model(X)                    # (N, C) raw logits
    loss = criterion(logits, y)          # pass logits + integer targets

    optimizer.zero_grad()                # 1. clear old grads (else they accumulate)
    loss.backward()                      # 2. backprop: fill every .grad
    optimizer.step()                     # 3. one downhill step

    if step % 4 == 0:
        acc = (logits.argmax(1) == y).float().mean().item()
        print(f"step {step:2d}  loss {loss.item():.4f}  train_acc {acc:.2f}")

# --- the GOTCHA, shown ---
# WRONG: softmax before CrossEntropyLoss -> double softmax, training degrades.
#   bad = nn.CrossEntropyLoss()(torch.softmax(logits, dim=1), y)
# WRONG: one-hot targets -> CrossEntropyLoss wants class indices, not one-hot.
#   y_onehot = torch.nn.functional.one_hot(y, C).float()  # do NOT pass this
# RIGHT: raw logits + integer indices, exactly as above.

print("done. note: the model has NO softmax layer -- CrossEntropyLoss adds it.")`
  };

  window.CODEVIZ["pt-loss-optim"] = {
    question: "On the same tiny noisy problem, how do SGD and Adam compare step by step?",
    charts: [{
      type: "line",
      title: "Training loss per step: SGD vs Adam (same problem, same start)",
      xlabel: "optimizer step",
      ylabel: "full-data MSE loss",
      series: [
        { name: "SGD (lr 0.0025)", color: "#ff7b72", points: [[0,428.061],[1,60.893],[2,50.551],[3,45.074],[4,51.288],[5,28.030],[6,20.560],[7,30.032],[8,19.986],[9,12.654],[10,11.708],[11,12.100],[12,10.461],[13,9.749],[14,9.795],[15,9.792],[16,10.154],[17,8.286],[18,7.724],[19,8.203],[20,6.114],[21,7.545],[22,5.692],[23,9.120],[24,5.209],[25,5.211],[26,5.177],[27,4.632],[28,4.692],[29,5.491],[30,4.643],[31,4.548],[32,5.071],[33,8.223],[34,5.149],[35,6.416],[36,3.679],[37,3.931],[38,3.212],[39,4.211],[40,3.063],[41,3.295],[42,3.587],[43,2.981],[44,2.770],[45,2.724],[46,2.524],[47,3.391],[48,2.699],[49,2.281]] },
        { name: "Adam (lr 0.15)", color: "#4ea1ff", points: [[0,428.061],[1,323.516],[2,244.862],[3,174.923],[4,124.233],[5,87.050],[6,57.753],[7,36.114],[8,21.111],[9,13.401],[10,11.573],[11,13.786],[12,17.540],[13,22.703],[14,28.017],[15,31.921],[16,34.836],[17,34.448],[18,31.736],[19,27.238],[20,22.455],[21,16.952],[22,12.436],[23,8.564],[24,5.951],[25,4.394],[26,3.579],[27,3.405],[28,3.669],[29,4.139],[30,4.652],[31,5.283],[32,5.748],[33,5.741],[34,5.235],[35,4.452],[36,3.844],[37,3.410],[38,3.004],[39,2.715],[40,2.612],[41,2.377],[42,2.095],[43,1.763],[44,1.407],[45,1.084],[46,0.849],[47,0.744],[48,0.824],[49,1.008]] }
      ]
    }],
    caption: "Real runs on an ill-conditioned, noisy least-squares problem (8 features scaled very differently, mini-batches of 16). Plain SGD is held back by the steepest feature direction and stays noisy, ending at loss 2.28. Adam adapts the step per feature and settles to a lower, smoother 1.01 by step 49 — the textbook reason Adam is the default first choice.",
    code: `import numpy as np

rng = np.random.default_rng(0)
N, d = 200, 8
# ill-conditioned features: columns scaled 1..20 so one direction is far steeper
X = rng.standard_normal((N, d)) * np.array([1, 1, 3, 3, 8, 8, 20, 20.0])
w_true = rng.standard_normal(d)
y = X @ w_true + 0.1 * rng.standard_normal(N)   # noisy linear target

def full_loss(w):
    r = X @ w - y
    return 0.5 * np.mean(r * r)                  # MSE over ALL data (what we plot)

def batch_grad(w, idx):
    Xb, yb = X[idx], y[idx]
    return Xb.T @ (Xb @ w - yb) / len(idx)       # mini-batch gradient (noisy)

steps, bs, w0 = 50, 16, np.zeros(d)

def run(opt, lr):
    w = w0.copy(); m = np.zeros(d); v = np.zeros(d); hist = []
    rs = np.random.default_rng(42)               # same batch stream for both
    for t in range(1, steps + 1):
        hist.append(full_loss(w))
        g = batch_grad(w, rs.integers(0, N, bs))
        if opt == "sgd":
            w = w - lr * g                        # plain SGD step
        else:                                     # Adam
            b1, b2, eps = 0.9, 0.999, 1e-8
            m = b1 * m + (1 - b1) * g
            v = b2 * v + (1 - b2) * g * g
            mh = m / (1 - b1**t); vh = v / (1 - b2**t)
            w = w - lr * mh / (np.sqrt(vh) + eps)
    return hist

sgd  = run("sgd",  0.0025)
adam = run("adam", 0.15)
print("final loss -- SGD:", round(sgd[-1], 3), " Adam:", round(adam[-1], 3))
# -> final loss -- SGD: 2.281  Adam: 1.008`
  };
})();
