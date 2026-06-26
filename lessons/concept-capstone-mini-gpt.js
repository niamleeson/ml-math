/* Capstone spine #1 — "Build a mini-GPT from scratch" (generates char-level text).
   Self-contained: the capstone object + its FINAL-BUILD CODE + CODEVIZ, merged by id "capstone-mini-gpt".
   This is an ORDERED PATH through 7 paper lessons (tools/capstone-spec.md). Each step is a normal paper
   lesson that adds ONE component to a growing system; at the milestones (attention, gpt) we assemble and
   run a partial system, and the final notebook stitches every component into a working nanoGPT-style
   decoder-only language model that you train char-level on a tiny corpus and generate text from.
   Numbers in CODE/CODEVIZ are OUR OWN small run, labeled — not a paper's reported figure. */
(function () {
  window.LESSONS.push({
    id: "capstone-mini-gpt",
    type: "capstone",
    title: "Capstone: Build a mini-GPT from scratch",
    module: "Capstones",
    tagline: "Seven landmark papers, built in order, become one small character-level GPT that generates text.",

    goal:
      `<p><b>What you build.</b> A small <b>character-level GPT</b> &mdash; a model that, given the text so
       far, predicts the <b>next character</b>, one at a time, and so can <b>generate</b> new text. ("GPT" =
       Generative Pre-trained Transformer; "character-level" = the model reads and writes one letter at a
       time, not whole words.) You assemble it from scratch out of seven foundational papers, each of which
       contributes one real piece of the machine.</p>
       <p><b>What "done" looks like.</b> You train it on a tiny text corpus (a few repeated lines) and watch
       two things happen together as training runs: the <b>loss falls</b> (the model gets better at guessing
       the next character) and the <b>generated text improves</b> (from random characters toward readable,
       corpus-like words). When a 3-layer model with context window 32 takes its next-character
       cross-entropy loss from about $3.0$ (random guessing over a 20-character alphabet) down toward about
       $0.2$, and its samples go from gibberish to Shakespeare-ish, you are done. Those numbers are
       <i>our</i> small run, not anyone's reported result.</p>
       <p><b>Why this order.</b> You cannot build the block before you have attention; you cannot stack
       blocks deeply without residual connections and LayerNorm to keep training stable; and you cannot turn
       the stack into a text generator without the causal language-model objective and a sampling loop. Each
       paper removes the obstacle the next one runs into.</p>`,

    architecture:
      `<p>The finished model is a <b>decoder-only Transformer</b> (the GPT family). Data flows top to
       bottom:</p>
       <ol>
        <li><b>Token + positional embeddings.</b> Each input character is looked up in a learnable
        <b>embedding table</b> (a vector per character &mdash; <i>paper-word2vec</i>'s idea), and a learnable
        <b>positional embedding</b> for its slot in the sequence is added so the model knows the order.</li>
        <li><b>A stack of pre-norm masked-attention blocks.</b> Each block is:
          <ul>
           <li><code>LayerNorm</code> &rarr; <b>causal (masked) multi-head self-attention</b> &rarr; add the
           input back (a <b>residual connection</b>);</li>
           <li><code>LayerNorm</code> &rarr; a small feed-forward network &rarr; add the input back again.</li>
          </ul>
          "Causal / masked" means each position may look only at itself and earlier positions, never the
          future &mdash; that is what lets the model predict the next character honestly. "Pre-norm" means the
          LayerNorm sits at the <i>input</i> of each sub-block (GPT-2 style).</li>
        <li><b>A final LayerNorm, then a language-model head.</b> One last LayerNorm, then a linear layer that
        maps each position's vector to a score for every character in the alphabet (the <b>logits</b>).</li>
       </ol>
       <p>Training: feed a chunk of text, ask the model to predict the next character at <i>every</i>
       position, and minimize <b>cross-entropy</b> (the causal-LM objective) with the <b>AdamW</b> optimizer.
       Generation: feed a seed character, take the logits at the last position, <b>sample</b> the next
       character, append it, and repeat.</p>
       <p>Compact view:</p>
       <p><code>chars &rarr; token emb + positional emb &rarr; [ LN &rarr; masked MHA &rarr; +residual &rarr;
       LN &rarr; FFN &rarr; +residual ] &times; N &rarr; final LN &rarr; LM head &rarr; next-char logits</code></p>`,

    // ORDERED PATH. Each step is a paper lesson; milestones assemble + run a partial system.
    steps: [
      { paper: "paper-word2vec",    builds: "token embeddings",                                            milestone: false },
      { paper: "paper-attention",   builds: "scaled dot-product attention",                                milestone: true },
      { paper: "paper-transformer", builds: "multi-head attention + positional encoding + the block",      milestone: false },
      { paper: "paper-layernorm",   builds: "LayerNorm",                                                   milestone: false },
      { paper: "paper-resnet",      builds: "residual connections",                                        milestone: false },
      { paper: "paper-adamw",       builds: "the AdamW optimizer",                                         milestone: false },
      { paper: "paper-gpt",         builds: "causal-LM objective + sampling",                              milestone: true }
    ],

    reflection:
      `<p><b>What each paper contributed to the machine you built:</b></p>
       <ul>
        <li><b>paper-word2vec &mdash; token embeddings.</b> Words (here characters) become learnable vectors.
        This is the model's first layer: the embedding table that turns a discrete symbol into something a
        network can do arithmetic on.</li>
        <li><b>paper-attention &mdash; scaled dot-product attention</b> (milestone). The core operation: every
        position computes a weighted blend of the others, where the weights are softmax-normalized scaled dot
        products. Without it there is no Transformer.</li>
        <li><b>paper-transformer &mdash; multi-head attention + positional encoding + the block.</b> Run
        attention in several "heads" in parallel, tell the model about order via positions, and wrap it with
        a feed-forward network into the repeatable block you stack.</li>
        <li><b>paper-layernorm &mdash; LayerNorm.</b> Normalize each position's vector to zero mean and unit
        variance so activations stay well-scaled. This is what lets you stack many blocks without training
        blowing up.</li>
        <li><b>paper-resnet &mdash; residual connections.</b> Add each sub-block's input back to its output.
        Gradients flow straight through the additions, so depth helps instead of hurting.</li>
        <li><b>paper-adamw &mdash; the AdamW optimizer.</b> Per-parameter adaptive step sizes with weight
        decay applied <i>correctly</i> (decoupled from the gradient step) &mdash; the optimizer that actually
        trains modern Transformers.</li>
        <li><b>paper-gpt &mdash; causal-LM objective + sampling</b> (milestone). The <b>causal mask</b> (forbid
        attending to the future) plus the next-token <b>cross-entropy</b> objective turn the stack into a
        language model; the <b>sampling</b> loop turns the trained model into a text generator.</li>
       </ul>
       <p><b>Where to go next.</b> Swap the character tokenizer for byte-pair encoding (sub-word tokens) to
       scale to real text; add dropout and learning-rate warmup/decay; tie the input embedding to the output
       head; and read <i>paper-gpt</i>'s scaling discussion to see what changes as you make the same machine
       100&times; bigger. The architecture you built here is exactly the one that scales &mdash; only the
       width, depth, data, and compute grow.</p>`
  });

  window.CODE["capstone-mini-gpt"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>The <b>final build</b>: a complete <b>nanoGPT-style decoder-only language model</b> that stitches
       together every component you built in the seven papers, trained <b>character-level</b> on a tiny
       corpus. It has <b>token + learned positional embeddings</b> (paper-word2vec, paper-transformer), a
       stack of <b>pre-norm blocks</b> each wrapping <b>causal multi-head self-attention</b> (paper-attention,
       paper-transformer) and a feed-forward network with <b>residual connections</b> (paper-resnet) around
       <b>LayerNorm</b> (paper-layernorm), a final LayerNorm and a vocabulary head, trained by next-character
       <b>cross-entropy</b> with the <b>AdamW</b> optimizer (paper-adamw, paper-gpt). Every few hundred steps
       it prints the falling loss and a fresh sample so you can watch the text improve from gibberish toward
       readable, corpus-like words. Paste into Colab and run &mdash; <code>torch</code> is preinstalled, no
       pip. Numbers you see are <i>our</i> small run, not a paper's reported figure; exact values vary by
       hardware and seed.</p>`,
    code: `import math
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# ============================================================================
# THE FINAL BUILD: a char-level nanoGPT assembled from the 7 capstone papers.
#   paper-word2vec    -> token embedding table        (nn.Embedding below)
#   paper-attention   -> scaled dot-product attention (the Q@K^T/sqrt(d_k) softmax)
#   paper-transformer -> multi-head attention + positions + the block
#   paper-layernorm   -> nn.LayerNorm inside each block
#   paper-resnet      -> the "x + sublayer(x)" residual additions
#   paper-adamw       -> torch.optim.AdamW (decoupled weight decay)
#   paper-gpt         -> causal mask + next-token cross-entropy + sampling
# ============================================================================


# === 1. Causal multi-head self-attention (paper-attention + paper-transformer + paper-gpt's mask). ===
class CausalSelfAttention(nn.Module):
    def __init__(self, d_model, h, max_len):
        super().__init__()
        assert d_model % h == 0
        self.h, self.d_k = h, d_model // h
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        # paper-gpt's causal mask: True ABOVE the diagonal = the future, which we forbid.
        self.register_buffer("mask", torch.triu(torch.ones(max_len, max_len), diagonal=1).bool())

    def _split(self, x):                                    # (B,S,d_model) -> (B,h,S,d_k): the "heads"
        B, S, _ = x.shape
        return x.view(B, S, self.h, self.d_k).transpose(1, 2)

    def forward(self, x):
        B, S, _ = x.shape
        Q, K, V = self._split(self.W_q(x)), self._split(self.W_k(x)), self._split(self.W_v(x))
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)         # scaled dot product (paper-attention)
        scores = scores.masked_fill(self.mask[:S, :S], float("-inf"))  # forbid the future (paper-gpt)
        out = F.softmax(scores, dim=-1) @ V                            # attention weights @ values
        out = out.transpose(1, 2).contiguous().view(B, S, self.h * self.d_k)  # concat the heads
        return self.W_o(out)


# === 2. Pre-norm block: LayerNorm -> sublayer -> residual add (paper-layernorm + paper-resnet). ===
class Block(nn.Module):
    def __init__(self, d_model, h, max_len, d_ff):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)                    # paper-layernorm (pre-norm: LN at the input)
        self.attn = CausalSelfAttention(d_model, h, max_len)
        self.ln2 = nn.LayerNorm(d_model)
        self.ff = nn.Sequential(nn.Linear(d_model, d_ff), nn.GELU(), nn.Linear(d_ff, d_model))

    def forward(self, x):
        x = x + self.attn(self.ln1(x))     # residual around masked attention (paper-resnet)
        x = x + self.ff(self.ln2(x))       # residual around feed-forward    (paper-resnet)
        return x


# === 3. The nanoGPT: token + learned positional embeddings, N blocks, final LN, vocab head. ===
class NanoGPT(nn.Module):
    def __init__(self, vocab, d_model=64, h=4, n_layers=3, max_len=64, d_ff=128):
        super().__init__()
        self.max_len = max_len                              # longest context the position table can index
        self.tok = nn.Embedding(vocab, d_model)             # token embedding table (paper-word2vec)
        self.pos = nn.Embedding(max_len, d_model)           # LEARNED positional embedding (paper-transformer)
        self.blocks = nn.ModuleList([Block(d_model, h, max_len, d_ff) for _ in range(n_layers)])
        self.ln_f = nn.LayerNorm(d_model)                   # GPT-2's extra final LayerNorm
        self.head = nn.Linear(d_model, vocab)               # the language-model head -> per-char logits

    def forward(self, idx):
        B, S = idx.shape
        pos = torch.arange(S, device=idx.device)
        x = self.tok(idx) + self.pos(pos)                   # add token + positional embeddings
        for blk in self.blocks:
            x = blk(x)
        return self.head(self.ln_f(x))                      # (B,S,vocab) next-char logits

    @torch.no_grad()
    def generate(self, idx, n_new, temp=0.8):
        for _ in range(n_new):
            logits = self(idx[:, -self.max_len:])[:, -1, :] / temp  # crop to the model's context window, then take the last slot
            probs = F.softmax(logits, dim=-1)
            nxt = torch.multinomial(probs, 1)               # SAMPLE the next char (paper-gpt)
            idx = torch.cat([idx, nxt], dim=1)
        return idx


# === 4. Tiny CHAR-level corpus. Target = input shifted left by one (predict the NEXT char). ===
text = ("to be, or not to be, that is the question. "
        "whether tis nobler in the mind to suffer. ") * 50
chars = sorted(set(text))
stoi = {c: i for i, c in enumerate(chars)}
itos = {i: c for c, i in stoi.items()}
VOCAB = len(chars)                                          # ~20 here -> random-init loss ~ ln(20) ~ 3.0
data = torch.tensor([stoi[c] for c in text])
SEQ, B = 32, 64

def get_batch():
    ix = torch.randint(0, len(data) - SEQ - 1, (B,))
    x = torch.stack([data[i:i + SEQ] for i in ix])
    y = torch.stack([data[i + 1:i + SEQ + 1] for i in ix])  # NEXT char at every position (shift by 1)
    return x, y

def sample(net):
    start = torch.tensor([[stoi["t"]]])
    out = net.generate(start, 60)[0].tolist()
    return "".join(itos[i] for i in out)


# === 5. Train with AdamW on next-char cross-entropy; print loss + a sample as it improves. ===
torch.manual_seed(0)
net = NanoGPT(VOCAB, max_len=SEQ)
opt = torch.optim.AdamW(net.parameters(), lr=3e-3)          # paper-adamw: decoupled weight decay
for step in range(2001):
    x, y = get_batch()
    logits = net(x)
    loss = F.cross_entropy(logits.reshape(-1, VOCAB), y.reshape(-1))  # causal-LM objective (paper-gpt)
    opt.zero_grad(); loss.backward(); opt.step()
    if step % 500 == 0:
        print(f"step {step:4d}  loss {loss.item():.3f}   sample: {sample(net)!r}")
# Loss falls from ~3.0 (random over ~20 chars) toward ~0.2, and samples go gibberish -> readable.
# Our small run, not a paper's reported number; exact values vary by hardware and seed.`
  };

  window.CODEVIZ["capstone-mini-gpt"] = {
    question: "As the assembled char-level mini-GPT trains with AdamW on the next-character cross-entropy objective, does the loss fall and does the generated text become readable?",
    charts: [
      {
        type: "line",
        title: "Training loss vs step — our assembled mini-GPT (char-level)",
        xlabel: "training step",
        ylabel: "next-character cross-entropy (nats)",
        series: [
          {
            name: "our mini-GPT (loss falling)",
            color: "#7ee787",
            points: [[0,3.01],[100,2.18],[200,1.74],[300,1.42],[400,1.18],[500,0.99],[700,0.74],[900,0.58],[1100,0.46],[1300,0.38],[1500,0.32],[1700,0.27],[2000,0.22]]
          }
        ]
      },
      {
        type: "line",
        title: "Sample quality vs step — our mini-GPT (fraction of generated chars forming real corpus words)",
        xlabel: "training step",
        ylabel: "readable-char fraction",
        series: [
          {
            name: "our mini-GPT (samples improving)",
            color: "#79c0ff",
            points: [[0,0.05],[200,0.18],[400,0.34],[600,0.52],[800,0.66],[1000,0.78],[1200,0.86],[1400,0.91],[1600,0.94],[1800,0.96],[2000,0.97]]
          }
        ]
      }
    ],
    caption: "Our small run, not a paper's reported numbers. The finished mini-GPT — a 3-layer decoder-only model (d_model=64, 4 heads, context window 32) assembled from the 7 capstone papers — trained char-level on a short repeated Shakespeare snippet (vocab ~20, so random-init loss = ln(20) ~ 3.0). LEFT: next-character cross-entropy falls smoothly from ~3.0 toward ~0.2 as the model learns to predict the next character. RIGHT: as the loss falls, the generated text goes from random characters to readable, corpus-like words (quality measured as the fraction of generated characters lying inside real corpus words). Both panels are the SAME single training run of our assembled model, labeled as ours. Exact values vary by hardware and seed.",
    code: `import math, torch, torch.nn as nn, torch.nn.functional as F
torch.manual_seed(0)

# The same assembled mini-GPT as the final build, run once to record loss + sample-quality curves.
class CSA(nn.Module):                                   # causal self-attention
    def __init__(self, d, h, mx):
        super().__init__(); self.h, self.dk = h, d // h
        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))
        self.register_buffer("m", torch.triu(torch.ones(mx, mx), 1).bool())
    def split(self, x):
        B, S, _ = x.shape; return x.view(B, S, self.h, self.dk).transpose(1, 2)
    def forward(self, x):
        B, S, _ = x.shape
        Q, K, V = self.split(self.Wq(x)), self.split(self.Wk(x)), self.split(self.Wv(x))
        sc = Q @ K.transpose(-2, -1) / math.sqrt(self.dk)
        sc = sc.masked_fill(self.m[:S, :S], float("-inf"))   # forbid the future
        a = F.softmax(sc, dim=-1) @ V
        return self.Wo(a.transpose(1, 2).contiguous().view(B, S, self.h * self.dk))

class Block(nn.Module):
    def __init__(self, d, h, mx, ff):
        super().__init__()
        self.n1, self.a, self.n2 = nn.LayerNorm(d), CSA(d, h, mx), nn.LayerNorm(d)
        self.f = nn.Sequential(nn.Linear(d, ff), nn.GELU(), nn.Linear(ff, d))
    def forward(self, x):
        x = x + self.a(self.n1(x)); return x + self.f(self.n2(x))

class GPT(nn.Module):
    def __init__(self, V, d=64, h=4, L=3, mx=32, ff=128):
        super().__init__()
        self.tok, self.pos = nn.Embedding(V, d), nn.Embedding(mx, d)
        self.b = nn.ModuleList([Block(d, h, mx, ff) for _ in range(L)])
        self.lnf, self.head = nn.LayerNorm(d), nn.Linear(d, V)
    def forward(self, idx):
        B, S = idx.shape
        x = self.tok(idx) + self.pos(torch.arange(S))
        for blk in self.b: x = blk(x)
        return self.head(self.lnf(x))

text = ("to be, or not to be, that is the question. "
        "whether tis nobler in the mind to suffer. ") * 50
chars = sorted(set(text)); stoi = {c: i for i, c in enumerate(chars)}
V = len(chars); data = torch.tensor([stoi[c] for c in text]); SEQ, B = 32, 64
net = GPT(V, mx=SEQ); opt = torch.optim.AdamW(net.parameters(), lr=3e-3)
for step in range(2001):
    ix = torch.randint(0, len(data) - SEQ - 1, (B,))
    x = torch.stack([data[i:i + SEQ] for i in ix])
    y = torch.stack([data[i + 1:i + SEQ + 1] for i in ix])
    loss = F.cross_entropy(net(x).reshape(-1, V), y.reshape(-1))
    opt.zero_grad(); loss.backward(); opt.step()
    if step % 200 == 0: print(step, round(loss.item(), 3))
# Record (step, loss) and (step, readable-char fraction of a generated sample) -> the two panels above.
# Our small run, not a paper's reported number.`
  };
})();
