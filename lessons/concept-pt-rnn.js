/* PyTorch (a complete course) — sequence models: nn.RNN, nn.LSTM, nn.GRU.
   Concept lesson pushed into window.LESSONS; CODE + CODEVIZ keyed by id.
   CODE is real PyTorch meant to run in Google Colab (torch preinstalled; runnable:false here).
   CODEVIZ numbers are computed for real (0.7^t decay vs 0.98^t memory carry). */
(function () {
  window.LESSONS.push({
    id: "pt-rnn",
    title: "Sequence models: nn.RNN, nn.LSTM, nn.GRU",
    tagline: "PyTorch modules that read an ordered sequence one step at a time and carry a hidden state forward.",
    module: "PyTorch (a complete course)",
    prereqs: ["pt-tensors", "dl-rnn", "dl-lstm-gru"],
    whenToUse: `<p>Reach for a recurrent module when your data is an <b>ordered sequence</b> and order matters: a time series, a sentence of tokens, a stream of sensor readings, audio frames.</p>
<ul>
<li>Sequences and time series, or text, when a Transformer is overkill or your dataset is small. RNNs (RNN = Recurrent Neural Network — a network that feeds its own previous output back in as it walks a sequence) have far fewer parameters and train fine on modest data.</li>
<li><b>Streaming / online</b> settings: a recurrent cell processes one new step at a time and keeps a running hidden state, so it is natural for live data where you cannot see the whole sequence at once.</li>
<li>Teaching and intuition: RNNs make the idea of "memory over time" concrete and are a clean stepping stone to attention.</li>
</ul>
<p>The math of <i>why</i> these work — the recurrence, and how gates fix forgetting — lives in <i>dl-rnn</i> and <i>dl-lstm-gru</i>. This lesson is about <i>how</i> to wire them up in PyTorch.</p>
<p><b>A note on relevance.</b> Transformers (<code>nn.Transformer</code>) have largely replaced RNNs for large-scale text and have become the default for most sequence work. But RNNs are still useful (small data, streaming, low latency, embedded) and they remain the clearest way to learn how sequence models hold state.</p>`,
    application: `<p>Recurrent modules show up wherever order carries meaning: language modeling and text classification before Transformers took over, speech and audio, financial and sensor forecasting, and as encoders or decoders inside larger systems. In PyTorch you almost always reach for <code>nn.LSTM</code> or <code>nn.GRU</code> (LSTM = Long Short-Term Memory; GRU = Gated Recurrent Unit) rather than the plain <code>nn.RNN</code>, because the gated versions hold information over far longer sequences without the signal decaying away.</p>`,
    pitfalls: `<ul>
<li><b>The #1 RNN bug: shape convention.</b> By default these modules expect input shaped <code>(seq_len, batch, features)</code> — sequence-length first. If you pass the much more natural <code>(batch, seq_len, features)</code> without saying so, it runs <i>silently</i> with the wrong axes and your results are garbage. The fix: construct the module with <code>batch_first=True</code>, then feed <code>(batch, seq_len, features)</code>. Pick one convention and be consistent.</li>
<li><b>Using the wrong return.</b> The module returns <i>two</i> things: <code>output</code> (the hidden state at <i>every</i> timestep) and <code>h_n</code> (the hidden state at the <i>last</i> timestep only). For a single label per sequence (classification), take the last hidden state. For a label per step (sequence-to-sequence, tagging), use <code>output</code>. Grabbing the wrong one is a quiet correctness bug.</li>
<li><b>Not handling variable lengths.</b> A batch must be a rectangle, so shorter sequences get <b>padded</b> with a filler value. If you feed raw padded batches, the cell wastes steps on padding and the last hidden state reflects padding, not your data. Fix: <code>nn.utils.rnn.pack_padded_sequence</code> tells the module the true length of each sequence so it stops at the real end.</li>
<li><b>Exploding / vanishing gradients.</b> Long sequences make gradients blow up or shrink to nothing. Use <code>nn.LSTM</code>/<code>nn.GRU</code> (gates ease vanishing) and clip exploding gradients with <code>torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)</code> before <code>optimizer.step()</code>.</li>
<li><b>Forgetting to reset the hidden state.</b> Between two <i>unrelated</i> sequences you must start from a fresh (zero) hidden state, or memory from one bleeds into the next. PyTorch zeros it for you when you do not pass one — so the safe default is to <i>not</i> carry <code>h_n</code> across unrelated batches.</li>
<li><b>Embedding index out of range.</b> <code>nn.Embedding(num_embeddings, dim)</code> is a lookup table with rows <code>0 .. num_embeddings-1</code>. A token id equal to or larger than <code>num_embeddings</code> raises an index error. Size the table to your full vocabulary (including a slot for padding and unknown tokens).</li>
</ul>`,
    bigIdea: `<p>A recurrent module is a small function applied in a loop. It keeps a <b>hidden state</b> — a vector that summarizes everything seen so far — and at each timestep it combines the new input with the old hidden state to produce a new hidden state. PyTorch runs that loop for you over the whole sequence in one call; you just hand it the data and read off the results.</p>`,
    buildup: `<p>All three modules — <code>nn.RNN</code>, <code>nn.LSTM</code>, <code>nn.GRU</code> — share the same shape and the same call signature. They differ only in what happens inside one step:</p>
<ul>
<li><b><code>nn.RNN</code></b> is the plain version: one <code>tanh</code> update. Simple, but its memory decays fast (the vanishing-gradient story from <i>dl-rnn</i>).</li>
<li><b><code>nn.LSTM</code></b> adds gates and a separate <b>cell state</b> that acts like a conveyor belt for information, so it remembers over long spans (see <i>dl-lstm-gru</i>). It returns an extra cell state.</li>
<li><b><code>nn.GRU</code></b> is a lighter gated version: fewer gates, no separate cell state, often as good as the LSTM and a bit faster.</li>
</ul>
<p>Construct any of them with <code>(input_size, hidden_size)</code> — how many features come in per step, and how big the hidden vector is. Add <code>num_layers=k</code> to stack them, and <code>batch_first=True</code> to use the <code>(batch, seq_len, features)</code> layout.</p>`,
    symbols: [],
    derivation: `<p><b>What you pass in, and what comes back.</b></p>
<ul>
<li><b>Input.</b> A 3-D tensor. With <code>batch_first=True</code> its shape is <code>(batch, seq_len, input_size)</code>: a stack of sequences, each a run of feature vectors. Without it, the default is <code>(seq_len, batch, input_size)</code> — same numbers, axes swapped.</li>
<li><b>The call.</b> <code>output, h_n = rnn(x)</code> for RNN/GRU; <code>output, (h_n, c_n) = lstm(x)</code> for LSTM (the LSTM bundles its hidden and cell state in a tuple).</li>
<li><b><code>output</code></b> has shape <code>(batch, seq_len, hidden_size)</code> — the hidden state at <i>every</i> step. Use it when you need a prediction per step (tagging, seq-to-seq).</li>
<li><b><code>h_n</code></b> has shape <code>(num_layers, batch, hidden_size)</code> — only the <i>final</i> step's hidden state, per layer. For one label per sequence, take the top layer's final hidden state: <code>h_n[-1]</code>, shape <code>(batch, hidden_size)</code>, and feed it to an <code>nn.Linear</code> classifier.</li>
<li><b>Tokens in.</b> If your inputs are integer token ids, put an <code>nn.Embedding</code> in front: it maps each id to a learned dense vector, turning <code>(batch, seq_len)</code> of ids into <code>(batch, seq_len, embed_dim)</code> for the recurrent layer.</li>
<li><b>Variable lengths.</b> Sort or record each sequence's true length, pad the batch to the longest, then wrap with <code>pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)</code> before the module and <code>pad_packed_sequence</code> after. The packed form skips padding so <code>h_n</code> reflects each real end.</li>
</ul>`,
    example: `<p>One LSTM over a tiny batch, classifying each sequence:</p>
<ul>
<li>Data: <code>x</code> of shape <code>(4, 6, 3)</code> — 4 sequences, 6 steps each, 3 features per step. Built an LSTM with <code>nn.LSTM(input_size=3, hidden_size=8, batch_first=True)</code>.</li>
<li>Call it: <code>output, (h_n, c_n) = lstm(x)</code>. Now <code>output.shape</code> is <code>(4, 6, 8)</code> (every step) and <code>h_n.shape</code> is <code>(1, 4, 8)</code> (last step only).</li>
<li>For a label per sequence, take <code>last = h_n[-1]</code> &rarr; shape <code>(4, 8)</code>, then <code>logits = nn.Linear(8, num_classes)(last)</code> &rarr; shape <code>(4, num_classes)</code>.</li>
<li>Score with <code>nn.CrossEntropyLoss()</code>, which wants <i>raw logits</i> (no softmax) and integer class labels.</li>
</ul>`,
    practice: [
      {
        q: `You build <code>nn.LSTM(10, 20)</code> with the defaults and pass a tensor shaped <code>(32, 15, 10)</code>, meaning 32 sequences of length 15 with 10 features. Training "works" but accuracy is stuck near random. What is the likely cause and the fix?`,
        steps: [
          { do: `Recall the default input layout of an LSTM.`, why: `Without <code>batch_first=True</code> it expects <code>(seq_len, batch, features)</code>.` },
          { do: `Compare that to the tensor you passed.`, why: `Your tensor is <code>(batch, seq_len, features)</code> — the first two axes are swapped, so it treated 32 as the sequence length and 15 as the batch.` }
        ],
        answer: `The shape convention is reversed. Either construct it as <code>nn.LSTM(10, 20, batch_first=True)</code> so it expects <code>(batch, seq_len, features)</code>, or transpose your input to <code>(15, 32, 10)</code>. This is the single most common RNN bug.`
      },
      {
        q: `You want one class label for each whole sequence. After <code>output, (h_n, c_n) = lstm(x)</code>, should you feed <code>output</code> or <code>h_n[-1]</code> to your <code>nn.Linear</code> classifier, and why?`,
        steps: [
          { do: `Recall what each return holds.`, why: `<code>output</code> is every timestep's hidden state; <code>h_n</code> is only the last step.` },
          { do: `Match that to "one label per sequence".`, why: `A single label needs a single summary vector, not one per step.` }
        ],
        answer: `Use <code>h_n[-1]</code> — the final hidden state of the top layer, shape <code>(batch, hidden_size)</code>. It summarizes the whole sequence. You would use <code>output</code> instead only when you need a prediction at <i>every</i> step (sequence-to-sequence or tagging).`
      },
      {
        q: `A batch contains sentences of lengths 5, 9, and 3. You pad them all to length 9 and feed the raw padded batch to your LSTM, then read <code>h_n[-1]</code> for classification. Why might the short sentences classify poorly, and what is the fix?`,
        steps: [
          { do: `Think about what the LSTM does on the padding steps.`, why: `It keeps updating the hidden state on filler tokens past the real end.` },
          { do: `Recall what <code>h_n</code> reflects then.`, why: `For the length-3 and length-5 sentences, the final hidden state reflects padding, not the real last word.` }
        ],
        answer: `The last hidden state of short sequences is contaminated by padding. Wrap the input with <code>nn.utils.rnn.pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)</code> before the LSTM. Packing tells the module each sequence's true length so it stops at the real end, and <code>h_n</code> then reflects the actual last token.`
      }
    ]
  });

  window.CODE["pt-rnn"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>This runs in Google Colab (torch is preinstalled). It builds a small <b>synthetic sequence-classification</b> task — each sequence is either trending up or trending down, and the model must say which. It uses <code>nn.LSTM(input_size, hidden_size, batch_first=True)</code>, takes the <i>last</i> hidden state into an <code>nn.Linear</code>, trains a few epochs, and prints accuracy. Watch the shape comments: they spell out the <code>(batch, seq_len, features)</code> layout that <code>batch_first=True</code> selects, and how <code>h_n[-1]</code> pulls the final state.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)  # reproducible

# ---- SYNTHETIC TASK: is each sequence trending UP (1) or DOWN (0)? ----
# Each sample: a length-SEQ_LEN sequence of 1-feature values.
# Up sequences rise on average; down sequences fall. Plus noise so it is not trivial.
N, SEQ_LEN, FEAT = 600, 12, 1
HIDDEN, N_CLASSES = 16, 2

def make_batch(n):
    y = torch.randint(0, 2, (n,))                 # class label per sequence: 0 or 1
    slope = torch.where(y == 1, 0.3, -0.3)        # up -> +slope, down -> -slope
    t = torch.arange(SEQ_LEN).float()             # 0,1,...,SEQ_LEN-1
    base = slope[:, None] * t[None, :]            # (n, SEQ_LEN): the trend line
    noise = 0.5 * torch.randn(n, SEQ_LEN)         # make it noisy
    x = (base + noise).unsqueeze(-1)              # (n, SEQ_LEN, FEAT)  <- batch_first layout
    return x, y

X_train, y_train = make_batch(N)
X_test,  y_test  = make_batch(200)
print("input shape (batch, seq_len, features):", tuple(X_train.shape))  # (600, 12, 1)

# ---- MODEL: LSTM -> take LAST hidden state -> Linear classifier ----
class SeqClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        # batch_first=True => input is (batch, seq_len, features). The classic shape fix.
        self.lstm = nn.LSTM(input_size=FEAT, hidden_size=HIDDEN, batch_first=True)
        self.fc   = nn.Linear(HIDDEN, N_CLASSES)  # logits; CrossEntropyLoss adds softmax

    def forward(self, x):
        # output: (batch, seq_len, HIDDEN) -- hidden state at EVERY step
        # h_n:    (num_layers, batch, HIDDEN) -- hidden state at the LAST step only
        output, (h_n, c_n) = self.lstm(x)
        last = h_n[-1]            # (batch, HIDDEN): top layer's final hidden state
        return self.fc(last)      # (batch, N_CLASSES): raw logits

model = SeqClassifier()
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.CrossEntropyLoss()  # expects raw logits + integer class indices

# ---- TRAIN a few epochs ----
model.train()
for epoch in range(15):
    opt.zero_grad()                 # clear old grads (they accumulate otherwise)
    logits = model(X_train)         # forward
    loss = loss_fn(logits, y_train)
    loss.backward()                 # backprop through time
    nn.utils.clip_grad_norm_(model.parameters(), 1.0)  # tame exploding grads
    opt.step()
    if epoch % 3 == 0:
        print(f"epoch {epoch:2d}  loss {loss.item():.3f}")

# ---- EVALUATE: accuracy on held-out sequences ----
model.eval()
with torch.no_grad():               # no graph at inference -> saves memory
    pred = model(X_test).argmax(dim=1)
    acc = (pred == y_test).float().mean().item()
print(f"test accuracy: {acc:.3f}")  # ~0.9+ on this easy synthetic task

# ---- shapes, made explicit ----
with torch.no_grad():
    out, (h_n, c_n) = model.lstm(X_test[:4])   # peek at a 4-sequence batch
print("output (every step):", tuple(out.shape))    # (4, 12, 16)
print("h_n (last step)    :", tuple(h_n.shape))    # (1, 4, 16)
print("h_n[-1] -> Linear  :", tuple(h_n[-1].shape))# (4, 16)
`
  };

  window.CODEVIZ["pt-rnn"] = {
    question: "Why do plain RNNs forget? How a gated cell keeps a signal alive over long sequences.",
    charts: [{
      type: "line",
      title: "Strength of a signal seen at step 0, as the sequence goes on",
      xlabel: "timestep t",
      ylabel: "retained signal strength",
      series: [
        { name: "plain RNN  (0.7^t, forgets)", color: "#ff7b72", points: [[0, 1.0], [2, 0.49], [4, 0.2401], [6, 0.1176], [8, 0.0576], [10, 0.0282], [12, 0.0138], [14, 0.0068], [16, 0.0033], [18, 0.0016], [20, 0.0008], [22, 0.0004], [24, 0.0002], [26, 0.0001], [28, 0.0], [30, 0.0], [32, 0.0], [34, 0.0], [36, 0.0], [38, 0.0], [40, 0.0]] },
        { name: "LSTM/GRU cell  (0.98^t, remembers)", color: "#7ee787", points: [[0, 1.0], [2, 0.9604], [4, 0.9224], [6, 0.8858], [8, 0.8508], [10, 0.8171], [12, 0.7847], [14, 0.7536], [16, 0.7238], [18, 0.6951], [20, 0.6676], [22, 0.6412], [24, 0.6158], [26, 0.5914], [28, 0.568], [30, 0.5455], [32, 0.5239], [34, 0.5031], [36, 0.4832], [38, 0.4641], [40, 0.4457]] }
      ]
    }],
    caption: "A signal seen once at step 0, tracked as the sequence rolls on. The plain RNN multiplies its memory by a factor below 1 every step (here 0.7), so the signal decays geometrically: by step 20 only 0.0008 remains — effectively forgotten. The gated cell's near-1 forget gate (here 0.98) holds it: 0.67 still remains at step 20 and 0.45 at step 40. This is the vanishing-gradient story behind why nn.LSTM and nn.GRU beat nn.RNN on long sequences.",
    code: `import numpy as np

# A plain RNN's recurrent weight shrinks the hidden state each step; a gated cell's
# forget gate sits near 1, so its 'conveyor belt' carries the signal far longer.
T = np.arange(0, 41, 2)          # timesteps 0, 2, ..., 40
rnn  = 0.7 ** T                  # plain RNN decay factor 0.7
lstm = 0.98 ** T                 # LSTM/GRU near-constant carry, factor 0.98

for t, r, l in zip(T, rnn, lstm):
    print(f"t={t:2d}  rnn={r:.4f}  lstm={l:.4f}")
# t= 0  rnn=1.0000  lstm=1.0000
# t=20  rnn=0.0008  lstm=0.6676   <- RNN has forgotten; LSTM still remembers
# t=40  rnn=0.0000  lstm=0.4457`
  };
})();
