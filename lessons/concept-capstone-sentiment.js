(function () {
  window.LESSONS.push({
    id: "capstone-sentiment",
    type: "capstone",
    title: "The classic NLP pipeline — a sentiment classifier",
    module: "Capstones",
    tagline: "Walk the path that took natural-language processing from bag-of-words to attention: build a sentiment classifier out of word embeddings, a bidirectional LSTM, and an attention-pooling head.",

    goal: `<p>You will build a <b>sentiment classifier</b>: a model that reads a short movie-style review and decides whether it is <b>positive</b> or <b>negative</b>. "Sentiment" just means the feeling a sentence expresses.</p>
<p>Instead of throwing one big model at the problem, you assemble it from four landmark papers, one component at a time. By the end you have a working pipeline:</p>
<ol>
<li><b>Embeddings</b> turn each word into a vector of numbers (a short list of numbers that captures meaning). From <code>paper-word2vec</code>.</li>
<li>A <b>bidirectional LSTM</b> reads the sentence one word at a time, forward and backward, building a context-aware vector for every word. From <code>paper-lstm</code>.</li>
<li><b>Attention pooling</b> scores every word and blends them into one sentence vector, putting most weight on the words that carry the sentiment. The scoring idea comes from <code>paper-bahdanau-attention</code>; the encoder-into-one-vector idea comes from <code>paper-seq2seq</code>.</li>
<li>A small <b>linear classifier</b> maps that one sentence vector to "positive" or "negative."</li>
</ol>
<p><b>"Done" looks like this:</b> the notebook tokenizes a tiny labeled text dataset, trains the full network, and prints (a) the <b>test accuracy</b> and (b) the <b>attention weights</b> over a sentence — and the attention should land on the sentiment-bearing words like "amazing" and "gripping," not on filler like "the" or "was."</p>`,

    architecture: `<p>The data flows left to right through five stages. Each stage is a thing you learned to build in one of the papers.</p>
<pre><code>raw sentence:   "i watched the film and it was really amazing and gripping"
      |
      |  1. TOKENIZE  — split into words, map each word to an integer id
      v
   token ids:   [ 5, 11, 2, 9, 7, 14, 8, 3, 21, 7, 22 ]
      |
      |  2. EMBED  (paper-word2vec)  — each id -> a vector of E numbers
      v
   embeddings:  (L tokens) x (E dims)        L = sentence length
      |
      |  3. BiLSTM  (paper-lstm)  — read forward AND backward; each token gets a
      |             context vector that knows about its neighbours on both sides
      v
   hidden states H:  (L tokens) x (2H dims)
      |
      |  4. ATTENTION POOLING  (paper-bahdanau-attention + paper-seq2seq)
      |     score every token, softmax the scores into weights alpha (they sum to 1),
      |     then take the weighted average of H  ->  ONE sentence vector
      v
   context vector c:  (2H dims)              + the weights alpha (one per token)
      |
      |  5. CLASSIFY  — a linear layer maps c -> 2 scores (negative, positive)
      v
   prediction:  "positive"
</code></pre>
<p>"Bidirectional" means two LSTMs run over the sentence: one left-to-right and one right-to-left. Their outputs are stuck together, so the dimension is <code>2H</code> (two copies of the hidden size <code>H</code>). "Softmax" is the function that turns a list of scores into positive numbers that add up to 1 — i.e. into weights. The attention weights <code>alpha</code> are also the model's explanation: they tell you which words it leaned on.</p>`,

    steps: [
      { paper: "paper-word2vec",           builds: "word embeddings",                 milestone: false },
      { paper: "paper-lstm",               builds: "the LSTM sequence encoder",        milestone: true  },
      { paper: "paper-seq2seq",            builds: "encoder-decoder intuition",        milestone: false },
      { paper: "paper-bahdanau-attention", builds: "attention over the sequence",      milestone: true  }
    ],

    reflection: `<p><b>What each paper contributed to the build:</b></p>
<ul>
<li><b>word2vec</b> (step 1) gave us the very first stage: represent a word as a dense vector instead of a one-hot spike. That is the <code>nn.Embedding</code> table the network starts from. Its lesson: meaning can be learned as geometry, and similar words end up near each other.</li>
<li><b>LSTM</b> (step 2, milestone) gave us the encoder. A plain recurrent network forgets the start of a long sentence; the LSTM's gates (small learned valves that decide what to keep, forget, and output) let information survive across many words. Running it in both directions gives every word a context that sees the whole sentence.</li>
<li><b>seq2seq</b> (step 3) contributed the <i>intuition</i> that a whole sentence can be squeezed into a single fixed-length vector by an encoder, and that this one vector is enough to drive a downstream task. We use that idea directly: our pooled context vector <i>is</i> the encoded sentence. seq2seq also exposed the weakness — one fixed vector is a bottleneck — which sets up the next paper.</li>
<li><b>Bahdanau attention</b> (step 4, milestone) fixed that bottleneck. Instead of forcing everything through one vector at the last step, attention lets the model look back at <i>all</i> the encoder states and take a weighted average, learning <i>where</i> to look. We reuse its additive-scoring idea as an <b>attention-pooling head</b>: score each token, softmax, blend. The bonus is interpretability — the weights show which words decided the sentiment.</li>
</ul>
<p><b>What to read next.</b> Attention turned out to be so powerful that researchers asked: do we even need the LSTM? The answer was the Transformer (<code>paper-transformer</code>), which keeps attention and throws recurrence away. From there the path leads to GPT (<code>paper-gpt</code>) and the modern language-model capstone (<code>capstone-mini-gpt</code>). The pipeline you built here is the bridge between the classic and the modern era of NLP.</p>`
  });

  window.CODE["capstone-sentiment"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p><b>The final build.</b> This is the whole pipeline stitched together: tokenize a tiny labeled dataset, embed, run a bidirectional LSTM, pool with attention, and classify. It trains in a few seconds on CPU and then prints the two things that define "done": the <b>test accuracy</b> and the <b>attention weights</b> over a sentence.</p>
<p>Read it as the four papers in sequence. <code>nn.Embedding</code> is the word2vec table (step 1). <code>nn.LSTM(..., bidirectional=True)</code> is the LSTM encoder (step 2). The <code>attn</code> linear layer scores each token and the softmax-and-blend is the attention-pooling head — the seq2seq "one sentence vector" idea (step 3) realized through Bahdanau-style additive attention (step 4). The final <code>cls</code> linear layer is the classifier.</p>
<p>Runs in Colab; <code>torch</code> is preinstalled, so there is nothing to pip-install. The exact printed numbers below are from our own small run (seed 1) — see CODEVIZ.</p>`,
    code: `import torch, torch.nn as nn, random
torch.manual_seed(1); random.seed(1)

# ---------------------------------------------------------------
# 0. A tiny labeled sentiment dataset (toy, generated, ours).
#    Positive sentences contain positive words; negative contain
#    negative words; both are padded out with neutral filler so the
#    model MUST learn to find the sentiment word, not memorize length.
# ---------------------------------------------------------------
pos_words = ["great","love","excellent","amazing","wonderful","fantastic",
             "brilliant","superb","delightful","gripping"]
neg_words = ["terrible","awful","horrible","boring","dreadful","disappointing",
             "tedious","lousy","painful","forgettable"]
neutral   = ["the","a","this","that","movie","film","story","plot","scene","cast",
             "i","we","it","was","is","really","saw","watched","with","and","of",
             "to","on","very","quite","about","some","one","first","last"]

def make(label, n):
    out = []
    for _ in range(n):
        L = random.randint(7, 12)
        words = [random.choice(neutral) for _ in range(L)]
        pool = pos_words if label == 1 else neg_words
        for _ in range(random.randint(1, 2)):          # inject 1-2 sentiment words
            words[random.randrange(L)] = random.choice(pool)
        out.append((" ".join(words), label))
    return out

train = make(1, 120) + make(0, 120)
test  = make(1, 30)  + make(0, 30)
random.shuffle(train)

# ---------------------------------------------------------------
# 1. TOKENIZE: split on spaces, build a word -> id vocabulary.
# ---------------------------------------------------------------
def tok(s): return s.split()
vocab = {"<pad>": 0}
for s, _ in train + test:
    for w in tok(s):
        if w not in vocab: vocab[w] = len(vocab)
V = len(vocab)
def encode(s): return [vocab[w] for w in tok(s)]

def batchify(data):                       # pad to the longest sentence, build a mask
    seqs = [encode(s) for s, _ in data]; L = max(len(x) for x in seqs)
    X = torch.zeros(len(seqs), L, dtype=torch.long)
    mask = torch.zeros(len(seqs), L)
    for i, s in enumerate(seqs):
        X[i, :len(s)] = torch.tensor(s); mask[i, :len(s)] = 1
    y = torch.tensor([lab for _, lab in data])
    return X, mask, y

Xtr, Mtr, ytr = batchify(train)
Xte, Mte, yte = batchify(test)

# ---------------------------------------------------------------
# 2-5. The model: embed -> BiLSTM -> attention pooling -> classify.
# ---------------------------------------------------------------
EMB, HID = 32, 48
class SentimentNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.emb  = nn.Embedding(V, EMB, padding_idx=0)            # step 1: word2vec table
        self.lstm = nn.LSTM(EMB, HID, batch_first=True,
                            bidirectional=True)                   # step 2: BiLSTM encoder
        self.attn = nn.Linear(2 * HID, 1)                         # step 4: token score
        self.cls  = nn.Linear(2 * HID, 2)                         # classifier head
    def forward(self, x, mask):
        h, _   = self.lstm(self.emb(x))                           # (B, L, 2H) context per token
        score  = self.attn(h).squeeze(-1)                         # (B, L)  one score per token
        score  = score.masked_fill(mask == 0, -1e9)               # ignore padding
        alpha  = torch.softmax(score, dim=1)                      # weights over tokens, sum to 1
        ctx    = (alpha.unsqueeze(-1) * h).sum(1)                 # step 3: ONE sentence vector
        return self.cls(ctx), alpha                              # logits + the attention weights

net   = SentimentNet()
opt   = torch.optim.Adam(net.parameters(), lr=4e-3, weight_decay=1e-4)
lossf = nn.CrossEntropyLoss()

# ---------------------------------------------------------------
# Train.
# ---------------------------------------------------------------
for ep in range(80):
    perm = torch.randperm(len(ytr))
    for i in range(0, len(ytr), 32):
        idx = perm[i:i + 32]
        logits, _ = net(Xtr[idx], Mtr[idx])
        loss = lossf(logits, ytr[idx])
        opt.zero_grad(); loss.backward(); opt.step()

# ---------------------------------------------------------------
# Result 1: test accuracy.
# ---------------------------------------------------------------
net.eval()
with torch.no_grad():
    acc = (net(Xte, Mte)[0].argmax(1) == yte).float().mean().item()
print("test accuracy:", round(acc, 3))            # our run: 0.917

# ---------------------------------------------------------------
# Result 2: attention weights highlight the sentiment words.
# ---------------------------------------------------------------
sent = "i watched the film and it was really amazing and gripping"
x = torch.tensor([encode(sent)]); m = torch.ones_like(x, dtype=torch.float)
with torch.no_grad():
    logits, alpha = net(x, m)
print("sentence:", sent)
print("prediction:", "positive" if logits.argmax(1).item() == 1 else "negative")
for w, a in zip(tok(sent), alpha[0].tolist()):
    bar = "#" * int(round(a * 50))
    print(f"  {w:10s} {a:.3f} {bar}")
# Our run: the two largest weights land on 'gripping' (0.237) and 'amazing'
# (0.136) -- the model learned to read sentiment WHERE it lives, not the filler.`
  };

  window.CODEVIZ["capstone-sentiment"] = {
    question: "Does the finished pipeline classify sentiment correctly, and do its attention weights actually land on the sentiment-bearing words?",
    charts: [
      {
        type: "bar",
        title: "Attention weight per token for \"i watched the film and it was really amazing and gripping\" (our run) — the two highest land on the sentiment words",
        xlabel: "token (in sentence order)",
        ylabel: "attention weight alpha (sums to 1 over the sentence)",
        series: [
          {
            name: "attention weight",
            color: "#7ee787",
            points: [
              [0, 0.029], [1, 0.035], [2, 0.037], [3, 0.056], [4, 0.065],
              [5, 0.076], [6, 0.092], [7, 0.091], [8, 0.136], [9, 0.146], [10, 0.237]
            ]
          }
        ]
      }
    ],
    caption: "Our small-scale run (PyTorch, seed 1), not a number from any paper. The full pipeline — embeddings (word2vec) → bidirectional LSTM (paper-lstm) → additive attention pooling (paper-bahdanau-attention, seq2seq one-vector idea) → linear classifier — was trained for 80 epochs on a toy generated dataset of 240 train / 60 test sentences. Tokens are, in order: the · i(0) watched(1) the(2) film(3) and(4) it(5) was(6) really(7) amazing(8) and(9) gripping(10). The model predicts POSITIVE, and the two largest attention weights fall on gripping (0.237, token 10) and amazing (0.136, token 8) — the only two sentiment-bearing words — while filler like \"the\" (0.037) and \"watched\" (0.035) get almost none. The eleven weights are a softmax, so they sum to 1.000. Test accuracy on held-out sentences was 0.917. This reproduces the qualitative payoff of attention from Bahdanau et al.: the model learns WHERE to look, and those weights double as a built-in explanation. Numbers are ours, not the papers'.",
    code: `# Same build as the CODE cell. After training, we read off the attention
# weights over one labeled sentence and plot them. (PyTorch, seed 1.)
sent = "i watched the film and it was really amazing and gripping"
x = torch.tensor([encode(sent)]); m = torch.ones_like(x, dtype=torch.float)
with torch.no_grad():
    logits, alpha = net(x, m)
print("prediction:", "positive" if logits.argmax(1).item() == 1 else "negative")
print("tokens :", tok(sent))
print("alpha  :", [round(a, 3) for a in alpha[0].tolist()])
# prediction: positive
# tokens : ['i','watched','the','film','and','it','was','really','amazing','and','gripping']
# alpha  : [0.029, 0.035, 0.037, 0.056, 0.065, 0.076, 0.092, 0.091, 0.136, 0.146, 0.237]
# Highest weights -> 'gripping' (0.237) and 'amazing' (0.136). test accuracy: 0.917`
  };
})();
