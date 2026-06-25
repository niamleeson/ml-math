/* PyTorch (a complete course) — sequence models: nn.RNN, nn.LSTM, nn.GRU.
   Concept lesson pushed into window.LESSONS; CODE + CODEVIZ keyed by id.
   CODE is real PyTorch meant to run in Google Colab (torch preinstalled; runnable:false here).
   CODEVIZ numbers are computed for real (0.7^t decay vs 0.98^t memory carry). */
(function () {
  window.LESSONS.push({
    id: "pt-rnn",
    title: "Sequence models: nn.RNN, nn.LSTM, nn.GRU",
    tagline: "PyTorch modules that read an ordered sequence one step at a time and carry a hidden state forward.",
    module: "PyTorch",
    template: "pytorch",
    prereqs: ["pt-tensors", "dl-rnn", "dl-lstm-gru"],

    objective: `<p><b>By the end of this lesson you can:</b></p>
<ul>
<li>build an <code>nn.RNN</code> / <code>nn.LSTM</code> / <code>nn.GRU</code> with <code>batch_first=True</code> and feed it a <code>(batch, seq_len, features)</code> tensor;</li>
<li>read the two returns — <code>output</code> (every step) and <code>h_n</code> (last step) — and pick the right one for per-sequence vs per-step prediction;</li>
<li>wire an <code>nn.Embedding</code> in front for token ids, handle variable-length batches with packing, and train a tiny sequence classifier end to end.</li>
</ul>
<p><b>The API you'll own:</b> <code>nn.LSTM</code> / <code>nn.GRU</code> / <code>nn.RNN</code>, <code>batch_first=True</code>, <code>h_n[-1]</code>, <code>nn.Embedding</code>, <code>pack_padded_sequence</code> / <code>pad_packed_sequence</code>, <code>nn.utils.clip_grad_norm_</code>.</p>`,

    concept: `<p>A <b>recurrent module</b> reads an ordered sequence one step at a time and carries a <b>hidden state</b> forward — a vector that summarizes everything seen so far. At each step it combines the new input with the old hidden state to make a new hidden state. PyTorch runs that loop over the whole sequence in one call; you hand it the data and read off the results. Reach for one when order carries meaning: a time series, a sentence of tokens, a stream of sensor readings, audio frames.</p>
<p>All three modules share the same shape and call signature and differ only inside one step:</p>
<ul>
<li><b><code>nn.RNN</code></b> — the plain version, one <code>tanh</code> update. Its memory decays fast (the vanishing-gradient story from <a onclick="App.open('dl-rnn')">dl-rnn</a>).</li>
<li><b><code>nn.LSTM</code></b> — adds gates and a separate <b>cell state</b> that acts like a conveyor belt for information, so it remembers over long spans (see <a onclick="App.open('dl-lstm-gru')">dl-lstm-gru</a>). It returns an extra cell state.</li>
<li><b><code>nn.GRU</code></b> — a lighter gated version: fewer gates, no separate cell state, often as good as the LSTM and a bit faster.</li>
</ul>
<p>In practice you almost always reach for <code>nn.LSTM</code> or <code>nn.GRU</code> rather than plain <code>nn.RNN</code>. Transformers have largely replaced RNNs at large scale, but recurrent cells are still useful for small data, streaming, and low latency — and they are the clearest way to learn how sequence models hold state.</p>`,

    apiTable: [
      { sig: "nn.RNN(input_size, hidden_size, batch_first=True)", does: "Plain recurrent layer: one <code>tanh</code> update per step. Returns <code>output, h_n</code>.", snippet: "rnn = nn.RNN(3, 5, batch_first=True)" },
      { sig: "nn.LSTM(input_size, hidden_size, batch_first=True)", does: "Gated cell with a separate cell state; remembers over long spans. Returns <code>output, (h_n, c_n)</code>.", snippet: "lstm = nn.LSTM(3, 8, batch_first=True)" },
      { sig: "nn.GRU(input_size, hidden_size, batch_first=True)", does: "Lighter gated cell, no cell state. Returns <code>output, h_n</code> like RNN.", snippet: "gru = nn.GRU(4, 6, batch_first=True)" },
      { sig: "output, h_n = rnn(x)", does: "<code>output</code> is <code>(batch, seq, hidden)</code> — every step; <code>h_n</code> is <code>(num_layers, batch, hidden)</code> — last step.", snippet: "output, h_n = rnn(x)   # x: (B, T, F)" },
      { sig: "h_n[-1]", does: "The top layer's final hidden state, shape <code>(batch, hidden)</code> — the per-sequence summary for a classifier head.", snippet: "last = h_n[-1]          # (B, hidden)" },
      { sig: "nn.Embedding(num_embeddings, embedding_dim)", does: "Lookup table turning <code>(batch, seq)</code> integer ids into <code>(batch, seq, dim)</code> dense vectors.", snippet: "emb = nn.Embedding(10, 4); emb(ids)" },
      { sig: "pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)", does: "Tells the module each sequence's true length so it skips padding and <code>h_n</code> reflects the real end.", snippet: "packed = pack_padded_sequence(x, lens, batch_first=True, enforce_sorted=False)" },
      { sig: "pad_packed_sequence(out_packed, batch_first=True)", does: "Restores the rectangular <code>(batch, seq, hidden)</code> shape after the recurrent layer.", snippet: "out, lens = pad_packed_sequence(out_packed, batch_first=True)" },
      { sig: "nn.utils.clip_grad_norm_(params, max_norm)", does: "Clips exploding gradients through time; call it before <code>optimizer.step()</code>.", snippet: "nn.utils.clip_grad_norm_(model.parameters(), 1.0)" }
    ],

    codeTour: [
      {
        explain: `<b>A synthetic sequence task.</b> Each sample is a length-12 sequence of one feature: "up" sequences rise on average, "down" ones fall, plus noise. The model must say which. Building the batch with <code>unsqueeze(-1)</code> gives the <code>(batch, seq_len, features)</code> layout that <code>batch_first=True</code> expects.`,
        code: `import torch
import torch.nn as nn

torch.manual_seed(0)

N, SEQ_LEN, FEAT = 600, 12, 1
HIDDEN, N_CLASSES = 16, 2

def make_batch(n):
    y = torch.randint(0, 2, (n,))            # 0 = down, 1 = up
    slope = torch.where(y == 1, 0.3, -0.3)
    t = torch.arange(SEQ_LEN).float()
    base = slope[:, None] * t[None, :]
    noise = 0.5 * torch.randn(n, SEQ_LEN)
    x = (base + noise).unsqueeze(-1)         # (n, SEQ_LEN, FEAT)
    return x, y

X_train, y_train = make_batch(N)
X_test,  y_test  = make_batch(200)
print("input shape (batch, seq_len, features):", tuple(X_train.shape))`,
        output: `input shape (batch, seq_len, features): (600, 12, 1)`
      },
      {
        explain: `<b>The model: LSTM then the last hidden state.</b> <code>batch_first=True</code> selects the natural <code>(batch, seq_len, features)</code> layout — the classic shape fix. The LSTM returns <code>output, (h_n, c_n)</code>; we take <code>h_n[-1]</code>, the top layer's final hidden state, and feed that single per-sequence vector to an <code>nn.Linear</code> for raw logits.`,
        code: `class SeqClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(input_size=FEAT, hidden_size=HIDDEN, batch_first=True)
        self.fc   = nn.Linear(HIDDEN, N_CLASSES)
    def forward(self, x):
        output, (h_n, c_n) = self.lstm(x)    # output: every step; h_n: last step
        last = h_n[-1]                       # (batch, HIDDEN)
        return self.fc(last)                 # (batch, N_CLASSES) raw logits

model = SeqClassifier()
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.CrossEntropyLoss()             # wants raw logits + class indices`,
        output: `(model built — no output yet)`
      },
      {
        explain: `<b>Train through time.</b> The standard loop: <code>zero_grad</code> (grads accumulate otherwise), forward, <code>backward</code> (backprop through time), then <code>clip_grad_norm_</code> to tame exploding gradients before <code>step</code>. Loss falls steadily.`,
        code: `model.train()
for epoch in range(15):
    opt.zero_grad()
    logits = model(X_train)
    loss = loss_fn(logits, y_train)
    loss.backward()
    nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step()
    if epoch % 3 == 0:
        print(f"epoch {epoch:2d}  loss {loss.item():.3f}")`,
        output: `epoch  0  loss 0.694
epoch  3  loss 0.553
epoch  6  loss 0.421
epoch  9  loss 0.331
epoch 12  loss 0.272`
      },
      {
        explain: `<b>Evaluate.</b> Switch to <code>eval()</code> and wrap inference in <code>torch.no_grad()</code> so no autograd graph is built. <code>argmax(dim=1)</code> turns logits into class predictions; the synthetic task is easy, so accuracy is high.`,
        code: `model.eval()
with torch.no_grad():
    pred = model(X_test).argmax(dim=1)
    acc = (pred == y_test).float().mean().item()
print(f"test accuracy: {acc:.3f}")`,
        output: `test accuracy: 0.935`
      },
      {
        explain: `<b>The shapes, made explicit.</b> Peek at a 4-sequence batch to see the return shapes: <code>output</code> carries a hidden vector for every one of the 12 steps; <code>h_n</code> carries only the last step (one row per layer); <code>h_n[-1]</code> is the <code>(batch, hidden)</code> vector the classifier consumes.`,
        code: `with torch.no_grad():
    out, (h_n, c_n) = model.lstm(X_test[:4])
print("output (every step):", tuple(out.shape))
print("h_n (last step)    :", tuple(h_n.shape))
print("h_n[-1] -> Linear  :", tuple(h_n[-1].shape))`,
        output: `output (every step): (4, 12, 16)
h_n (last step)    : (1, 4, 16)
h_n[-1] -> Linear  : (4, 16)`
      }
    ],

    expected: `<p>Run the walkthrough top to bottom in Colab and read each printed line:</p>
<ul>
<li>The first line confirms the input is <code>(600, 12, 1)</code> — 600 sequences, 12 steps, 1 feature — the <code>(batch, seq_len, features)</code> layout <code>batch_first=True</code> demands.</li>
<li>The loss falls from ~0.69 (that is ln(2), a coin flip at random init) toward ~0.27, proof the LSTM is learning the up/down trend.</li>
<li>Test accuracy lands around <code>0.93</code> — strong, because the synthetic task is easy and separable.</li>
<li>The final shapes spell out the whole point: <code>output</code> is <code>(4, 12, 16)</code> (hidden at every step), <code>h_n</code> is <code>(1, 4, 16)</code> (last step only, one row per layer), and <code>h_n[-1]</code> is <code>(4, 16)</code> — the per-sequence vector the <code>nn.Linear</code> head consumes.</li>
</ul>
<p>Numbers assume <code>torch.manual_seed(0)</code>; without the seed the loss curve and accuracy wobble. On a GPU runtime the math is identical but may differ in the last decimal.</p>`,

    cheatsheet: [
      { code: "lstm = nn.LSTM(input_size, hidden_size, batch_first=True)", note: "batch_first => input is (batch, seq, features)" },
      { code: "output, (h_n, c_n) = lstm(x)", note: "LSTM returns a (h_n, c_n) tuple; RNN/GRU return just h_n" },
      { code: "last = h_n[-1]   # (batch, hidden)", note: "top layer's final state -> one label per sequence" },
      { code: "logits = fc(h_n[-1])", note: "classifier head on the last hidden state; CrossEntropyLoss wants raw logits" },
      { code: "emb = nn.Embedding(num_embeddings, dim); e = emb(ids)", note: "token ids -> (batch, seq, dim); size table > max id" },
      { code: "packed = pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)", note: "skip padding so h_n hits the real end" },
      { code: "nn.utils.clip_grad_norm_(model.parameters(), 1.0)", note: "clip exploding grads BEFORE optimizer.step()" },
      { code: "with torch.no_grad(): model.eval()", note: "inference mode — no graph, deterministic" }
    ],

    deeper: `<p>This lesson is the <i>how</i> in PyTorch; the <i>why</i> is the math:</p>
<ul>
<li>the recurrence itself and why a plain RNN's gradients vanish or explode: <a onclick="App.open('dl-rnn')">dl-rnn</a>;</li>
<li>how gates and a cell state fix the forgetting problem: <a onclick="App.open('dl-lstm-gru')">dl-lstm-gru</a>;</li>
<li>the optimizer step that updates these weights through time: <a onclick="App.open('dl-optimizers')">dl-optimizers</a>.</li>
</ul>
<p>Transformers (<code>nn.Transformer</code>) replaced RNNs for large-scale text, but the hidden-state-over-time idea here is the cleanest stepping stone to attention.</p>`,
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
        q: `<b>Type this in Colab.</b> Build <code>rnn = nn.RNN(input_size=3, hidden_size=5, batch_first=True)</code>. Feed it <code>x = torch.randn(2, 4, 3)</code> (2 sequences, 4 steps, 3 features). Call <code>output, h_n = rnn(x)</code>. Predict the shapes of <code>output</code> and <code>h_n</code> before running, then print both.`,
        steps: [
          { do: `Construct with <code>batch_first=True</code> so input is <code>(batch, seq_len, features)</code>.`, why: `It matches the <code>(2, 4, 3)</code> tensor you are passing.` },
          { do: `Unpack <code>output, h_n = rnn(x)</code> and print each <code>.shape</code>.`, why: `<code>output</code> is every step <code>(batch, seq, hidden)</code>; <code>h_n</code> is the last step <code>(num_layers, batch, hidden)</code>.` }
        ],
        answer: `<pre><code>import torch
import torch.nn as nn
torch.manual_seed(0)
rnn = nn.RNN(input_size=3, hidden_size=5, batch_first=True)
x = torch.randn(2, 4, 3)
output, h_n = rnn(x)
print(output.shape)   # torch.Size([2, 4, 5])  hidden at every step
print(h_n.shape)      # torch.Size([1, 2, 5])  last step only</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> THE classic RNN shape bug. Build <code>lstm = nn.LSTM(10, 20)</code> with the <i>defaults</i> (no <code>batch_first</code>). You have data shaped <code>(32, 15, 10)</code> = 32 sequences, length 15, 10 features. First feed it raw and print <code>h_n.shape</code> — notice the batch dimension is wrong. Then rebuild with <code>batch_first=True</code> and confirm <code>h_n</code> reports 32 sequences.`,
        steps: [
          { do: `With the default layout, the module reads axis 0 as <code>seq_len</code> and axis 1 as <code>batch</code>.`, why: `So <code>(32, 15, 10)</code> is misread as 32 steps of a 15-sequence batch — silently wrong.` },
          { do: `Rebuild with <code>nn.LSTM(10, 20, batch_first=True)</code>.`, why: `Now axis 0 is the batch, so <code>h_n</code> correctly reports 32 sequences.` }
        ],
        answer: `<pre><code>x = torch.randn(32, 15, 10)
bad = nn.LSTM(10, 20)                      # default: (seq, batch, feat)
_, (h_n, _) = bad(x)
print(h_n.shape)   # torch.Size([1, 15, 20])  <-- batch read as 15, WRONG

good = nn.LSTM(10, 20, batch_first=True)   # (batch, seq, feat)
_, (h_n, _) = good(x)
print(h_n.shape)   # torch.Size([1, 32, 20])  <-- batch is 32, correct</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Build <code>lstm = nn.LSTM(input_size=3, hidden_size=8, batch_first=True)</code> and feed <code>x = torch.randn(4, 6, 3)</code>. Unpack the LSTM's return correctly (it bundles hidden and cell state in a tuple), then take the top layer's last hidden state and print its shape.`,
        steps: [
          { do: `Unpack as <code>output, (h_n, c_n) = lstm(x)</code>.`, why: `An LSTM returns <code>(h_n, c_n)</code> as a tuple, unlike RNN/GRU which return just <code>h_n</code>.` },
          { do: `Take <code>h_n[-1]</code> for the top layer's final hidden state.`, why: `That single vector per sequence is what a classifier head consumes.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
lstm = nn.LSTM(input_size=3, hidden_size=8, batch_first=True)
x = torch.randn(4, 6, 3)
output, (h_n, c_n) = lstm(x)
print(output.shape)    # torch.Size([4, 6, 8])  every step
print(h_n.shape)       # torch.Size([1, 4, 8])  last step
last = h_n[-1]
print(last.shape)      # torch.Size([4, 8])  -> feed to nn.Linear</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> One label per whole sequence. Reuse the LSTM above (<code>hidden_size=8</code>), add <code>fc = nn.Linear(8, 3)</code> for 3 classes, run <code>x = torch.randn(4, 6, 3)</code> through both, and print the logits shape. Use <code>h_n[-1]</code> — the last timestep — not <code>output</code>.`,
        steps: [
          { do: `Pass <code>h_n[-1]</code> (shape <code>(4, 8)</code>) into <code>fc</code>.`, why: `A single label per sequence needs one summary vector, not one per step.` },
          { do: `Print the resulting logits shape.`, why: `It should be <code>(batch, num_classes)</code> = <code>(4, 3)</code>, ready for <code>CrossEntropyLoss</code>.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
lstm = nn.LSTM(3, 8, batch_first=True)
fc = nn.Linear(8, 3)
x = torch.randn(4, 6, 3)
_, (h_n, _) = lstm(x)
logits = fc(h_n[-1])        # last timestep -> classifier
print(logits.shape)   # torch.Size([4, 3])  raw logits, one row per sequence</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Tokens in. Build <code>emb = nn.Embedding(num_embeddings=10, embedding_dim=4)</code> and a batch of token ids <code>ids = torch.tensor([[1, 2, 3, 4], [5, 6, 7, 8]])</code> (shape <code>(2, 4)</code>). Embed it and print the new shape, then feed it to <code>nn.GRU(4, 6, batch_first=True)</code> and print the GRU output shape.`,
        steps: [
          { do: `Apply <code>emb(ids)</code> to map each id to a length-4 vector.`, why: `It turns <code>(batch, seq)</code> of ids into <code>(batch, seq, embed_dim)</code> for the recurrent layer.` },
          { do: `Pass the embeddings to the GRU and unpack <code>output, h_n</code>.`, why: `A GRU returns just <code>h_n</code> (no cell state), unlike the LSTM.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
emb = nn.Embedding(num_embeddings=10, embedding_dim=4)
ids = torch.tensor([[1, 2, 3, 4], [5, 6, 7, 8]])
e = emb(ids)
print(e.shape)        # torch.Size([2, 4, 4])  (batch, seq, embed_dim)
gru = nn.GRU(4, 6, batch_first=True)
output, h_n = gru(e)
print(output.shape)   # torch.Size([2, 4, 6])
print(h_n.shape)      # torch.Size([1, 2, 6])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Embedding index out of range. Build <code>emb = nn.Embedding(num_embeddings=5, embedding_dim=3)</code> — valid ids are 0..4. Run <code>emb(torch.tensor([5]))</code> and observe the error. Then fix it by sizing the table to <code>num_embeddings=6</code> and re-run on the same id.`,
        steps: [
          { do: `Look up an id equal to <code>num_embeddings</code>.`, why: `Row indices only go <code>0 .. num_embeddings-1</code>, so id 5 is out of range and raises an <code>IndexError</code>.` },
          { do: `Enlarge the table to cover your full vocabulary.`, why: `<code>num_embeddings</code> must exceed the largest token id (leave slots for padding/unknown too).` }
        ],
        answer: `<pre><code># Broken: IndexError -- index 5 is out of bounds for a table of size 5
# emb = nn.Embedding(num_embeddings=5, embedding_dim=3)
# emb(torch.tensor([5]))

torch.manual_seed(0)
emb = nn.Embedding(num_embeddings=6, embedding_dim=3)   # ids 0..5 now valid
print(emb(torch.tensor([5])).shape)   # torch.Size([1, 3])</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Variable lengths. You have 3 sequences of lengths 5, 9, 3 with 2 features each, all padded to length 9 — build <code>x = torch.zeros(3, 9, 2)</code> and <code>lengths = torch.tensor([5, 9, 3])</code>. Pack it, run an LSTM, unpack, and confirm the <i>output</i> comes back at shape <code>(3, 9, hidden)</code>.`,
        steps: [
          { do: `Wrap with <code>pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)</code>.`, why: `Packing tells the LSTM each true length so it skips padding and <code>h_n</code> reflects the real last token.` },
          { do: `Run the LSTM on the packed input, then <code>pad_packed_sequence(out, batch_first=True)</code>.`, why: `It restores the padded rectangular shape for downstream layers.` }
        ],
        answer: `<pre><code>from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence
torch.manual_seed(0)
x = torch.zeros(3, 9, 2)
lengths = torch.tensor([5, 9, 3])
lstm = nn.LSTM(2, 4, batch_first=True)
packed = pack_padded_sequence(x, lengths, batch_first=True, enforce_sorted=False)
out_packed, (h_n, c_n) = lstm(packed)
out, lens = pad_packed_sequence(out_packed, batch_first=True)
print(out.shape)    # torch.Size([3, 9, 4])
print(lens)         # tensor([5, 9, 3])  true lengths preserved</code></pre>`
      },
      {
        q: `<b>Type this in Colab.</b> Tiny end-to-end sequence classifier. Generate <code>x = torch.randn(8, 5, 2)</code> and <code>y = torch.randint(0, 2, (8,))</code>. Build an LSTM(2 &rarr; 16, batch_first) plus <code>nn.Linear(16, 2)</code>, run one training step with <code>CrossEntropyLoss</code> and Adam (remember <code>zero_grad</code> and gradient clipping), and print the loss.`,
        steps: [
          { do: `Forward: take <code>h_n[-1]</code> into the linear head to get logits, score with <code>CrossEntropyLoss</code>.`, why: `Cross-entropy wants raw logits and integer class indices — no softmax.` },
          { do: `<code>zero_grad()</code>, <code>backward()</code>, <code>clip_grad_norm_(..., 1.0)</code>, <code>step()</code>.`, why: `Clipping tames exploding gradients through time; zeroing prevents accumulation.` }
        ],
        answer: `<pre><code>torch.manual_seed(0)
x = torch.randn(8, 5, 2)
y = torch.randint(0, 2, (8,))
lstm = nn.LSTM(2, 16, batch_first=True)
fc = nn.Linear(16, 2)
params = list(lstm.parameters()) + list(fc.parameters())
opt = torch.optim.Adam(params, lr=0.01)
loss_fn = nn.CrossEntropyLoss()

opt.zero_grad()
_, (h_n, _) = lstm(x)
logits = fc(h_n[-1])          # (8, 2) raw logits
loss = loss_fn(logits, y)
loss.backward()
nn.utils.clip_grad_norm_(params, 1.0)
opt.step()
print(round(loss.item(), 4))   # ~0.70  (near ln(2), random start)</code></pre>`
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
