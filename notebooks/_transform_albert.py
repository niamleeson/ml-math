import json

PATH = "/Users/jaykim/workspace/ml-math-tutor/notebooks/paper-albert.ipynb"
nb = json.load(open(PATH))
orig = nb["cells"]


def md(text):
    return {"cell_type": "markdown", "metadata": {}, "source": text}


def code(text):
    return {"cell_type": "code", "metadata": {}, "execution_count": None,
            "outputs": [], "source": text}


def lines(text):
    """Split a source string into nbformat source list (keep trailing newlines)."""
    return text.splitlines(keepends=True)


# --- cell 0: title/intro -- keep, lightly warm the final paragraph ---
intro = (
    "# ALBERT — A Lite BERT for Self-supervised Learning of Language Representations (2019)\n"
    "\n"
    "_Papers · Transformers & LLMs_\n"
    "\n"
    "**Shrink BERT with two parameter-reduction tricks — factorize the embedding and share one block across all layers — and swap next-sentence prediction for sentence-order prediction.**\n"
    "\n"
    "---\n"
    "\n"
    "This notebook is a practice scaffold for the **ALBERT — A Lite BERT for Self-supervised Learning of Language Representations (2019)** lesson. We build it up one step at a time: count the parameters the two tricks save, assemble a tiny ALBERT-style encoder, and watch weight sharing trade a little accuracy for a big parameter cut. Run each cell, read the note above it, then tackle the practice problems at the bottom. _Save a copy to your Drive (File → Save a copy in Drive) to edit and keep your work._"
)

# --- setup cell: split combined import ---
setup = (
    "# Setup — numpy / pandas / scikit-learn / matplotlib ship with Colab.\n"
    "import numpy as np\n"
    "import matplotlib.pyplot as plt"
)

cells = []
cells.append(md(lines(intro)))
cells.append(code(lines(setup)))

# --- Reference implementation header (orig cell 2) ---
cells.append(md(lines(
    "## Reference implementation — PyTorch\n"
    "\n"
    "We build a miniature ALBERT in four steps: (1) count the parameters the embedding "
    "factorization saves, (2) define a standard Transformer encoder block, (3) wire up a tiny "
    "ALBERT-style encoder whose two flags toggle the parameter-reduction tricks, and (4) train it "
    "on a small masked-language task to see what cross-layer sharing costs."
)))

# === Step 1 - embedding factorization arithmetic ===
cells.append(md(lines(
    "### Step 1 — Count what the embedding factorization saves\n"
    "\n"
    "BERT stores one $H$-dimensional vector per vocabulary token, a $V\\times H$ table. ALBERT "
    "instead keeps a smaller $V\\times E$ table and a single shared $E\\times H$ up-projection. "
    "Because $V$ is huge (30,000) and $E$ is much smaller than $H$, this slashes the embedding "
    "parameters. Here we plug in the paper's ALBERT-base numbers (Table 1) and confirm the ~6x cut."
)))
cells.append(code(lines(
    "import math\n"
    "import torch\n"
    "import torch.nn as nn\n"
    "import torch.nn.functional as F\n"
    "\n"
    "torch.manual_seed(0)\n"
    "\n"
    "# Worked example: ALBERT-base embedding factorization (Table 1: V=30000, H=768, E=128).\n"
    "V_big, H_big, E_big = 30000, 768, 128\n"
    "\n"
    "emb_bert = V_big * H_big                      # one H-dim vector per token: 23,040,000\n"
    "emb_albert = V_big * E_big + E_big * H_big    # V->E table plus E->H up-projection: 3,938,304\n"
    "\n"
    "saving = emb_bert - emb_albert               # absolute parameters removed\n"
    "ratio = emb_bert / emb_albert                # how many times smaller\n"
    "\n"
    "print(\"BERT-base embedding   V*H      =\", emb_bert)        # 23040000\n"
    "print(\"ALBERT-base embedding V*E+E*H  =\", emb_albert,\n"
    "      \"=\", V_big * E_big, \"+\", E_big * H_big)               # 3938304 = 3840000 + 98304\n"
    "print(\"saving =\", saving, \" ratio = %.2fx smaller\" % ratio)   # 19101696, 5.85x"
)))

# === Step 2 - standard encoder block ===
cells.append(md(lines(
    "### Step 2 — Build a standard Transformer encoder block\n"
    "\n"
    "ALBERT reuses the same encoder block as BERT — multi-head self-attention followed by a "
    "feed-forward network, each wrapped in a residual connection and LayerNorm. We define it once "
    "here; the ALBERT tricks in the next step only change *how many distinct copies* of this block "
    "exist, not what the block does."
)))
cells.append(code(lines(
    "# A standard Transformer encoder block (from paper-transformer): MHA + FFN, residual + LayerNorm.\n"
    "class MHA(nn.Module):\n"
    "    def __init__(self, d, h):\n"
    "        super().__init__()\n"
    "        self.h = h\n"
    "        self.dk = d // h\n"
    "        self.Wq, self.Wk, self.Wv, self.Wo = (nn.Linear(d, d) for _ in range(4))\n"
    "\n"
    "    def _split(self, x):\n"
    "        B, S, _ = x.shape\n"
    "        return x.view(B, S, self.h, self.dk).transpose(1, 2)   # (B, heads, S, dk)\n"
    "\n"
    "    def forward(self, x):\n"
    "        Q = self._split(self.Wq(x))\n"
    "        K = self._split(self.Wk(x))\n"
    "        Vv = self._split(self.Wv(x))\n"
    "        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.dk)\n"
    "        attn = F.softmax(scores, dim=-1) @ Vv\n"
    "        B, _, S, _ = attn.shape\n"
    "        merged = attn.transpose(1, 2).contiguous().view(B, S, self.h * self.dk)\n"
    "        return self.Wo(merged)\n"
    "\n"
    "class EncoderBlock(nn.Module):\n"
    "    def __init__(self, d, h, ff):\n"
    "        super().__init__()\n"
    "        self.attn = MHA(d, h)\n"
    "        self.ff = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d))\n"
    "        self.n1 = nn.LayerNorm(d)\n"
    "        self.n2 = nn.LayerNorm(d)\n"
    "\n"
    "    def forward(self, x):\n"
    "        x = self.n1(x + self.attn(x))   # attention sub-layer + residual + norm\n"
    "        return self.n2(x + self.ff(x))  # feed-forward sub-layer + residual + norm"
)))

# === Step 3 - tiny ALBERT encoder + param comparison ===
cells.append(md(lines(
    "### Step 3 — Wire up a tiny ALBERT and compare parameter counts\n"
    "\n"
    "`TinyALBERT` has two flags. `factorized` chooses the $V\\to E\\to H$ embedding (ALBERT) versus "
    "a direct $V\\to H$ embedding (BERT). `shared` chooses *one* encoder block reused $L$ times "
    "(ALBERT) versus $L$ distinct blocks (BERT). With both tricks on, the model is just as deep "
    "but holds far fewer parameters — which we confirm by counting both variants."
)))
cells.append(code(lines(
    "# Tiny ALBERT-style encoder. Two flags toggle the tricks (and the ablation).\n"
    "V, H, E, L, h, ff = 32, 64, 16, 4, 4, 128   # tiny vocab/width so it trains fast\n"
    "SEQ, B = 12, 64\n"
    "MASK = 1                                    # token id reserved for [MASK]\n"
    "\n"
    "def positional_encoding(n, d):\n"
    "    pos = torch.arange(n).unsqueeze(1).float()\n"
    "    i2 = torch.arange(0, d, 2).float()\n"
    "    den = torch.pow(10000.0, i2 / d)\n"
    "    pe = torch.zeros(n, d)\n"
    "    pe[:, 0::2] = torch.sin(pos / den)\n"
    "    pe[:, 1::2] = torch.cos(pos / den)\n"
    "    return pe\n"
    "\n"
    "class TinyALBERT(nn.Module):\n"
    "    def __init__(self, factorized=True, shared=True):\n"
    "        super().__init__()\n"
    "        self.shared = shared\n"
    "        if factorized:                                  # ALBERT: V->E then E->H  (\\S 3.1)\n"
    "            self.emb = nn.Embedding(V, E)\n"
    "            self.proj = nn.Linear(E, H)\n"
    "        else:                                           # BERT: V->H directly\n"
    "            self.emb = nn.Embedding(V, H)\n"
    "            self.proj = None\n"
    "        self.register_buffer(\"pe\", positional_encoding(SEQ, H))\n"
    "        if shared:                                      # ALBERT: ONE block reused L times (\\S 3.1)\n"
    "            self.block = EncoderBlock(H, h, ff)\n"
    "            self.blocks = None\n"
    "        else:                                           # BERT: L distinct blocks (ablation)\n"
    "            self.blocks = nn.ModuleList([EncoderBlock(H, h, ff) for _ in range(L)])\n"
    "            self.block = None\n"
    "        self.head = nn.Linear(H, V)                     # MLM head: predict the token at each position\n"
    "\n"
    "    def forward(self, t):\n"
    "        x = self.emb(t)\n"
    "        if self.proj is not None:\n"
    "            x = self.proj(x)                            # up-project E -> H\n"
    "        x = x + self.pe[:x.shape[1]]\n"
    "        if self.shared:\n"
    "            for _ in range(L):                          # same weights, applied L times (still L deep)\n"
    "                x = self.block(x)\n"
    "        else:\n"
    "            for b in self.blocks:\n"
    "                x = b(x)\n"
    "        return self.head(x)\n"
    "\n"
    "    def nparams(self):\n"
    "        return sum(p.numel() for p in self.parameters())\n"
    "\n"
    "# Parameter-count comparison on the tiny model.\n"
    "bert_style = TinyALBERT(factorized=False, shared=False)    # no tricks\n"
    "albert_style = TinyALBERT(factorized=True,  shared=True)   # both tricks\n"
    "print(\"\\ntiny BERT-style   (no factorize, no share) params:\", bert_style.nparams())\n"
    "print(\"tiny ALBERT-style (factorize + share)      params:\", albert_style.nparams())\n"
    "print(\"tiny embedding  V*H =\", V * H, \"  vs  V*E+E*H =\", V * E + E * H)"
)))

# === Step 4 - MLM task + training ablation ===
cells.append(md(lines(
    "### Step 4 — Train an MLM and measure what sharing costs\n"
    "\n"
    "We give the model a learnable masked-language task: each sequence is an arithmetic progression, "
    "so a masked token is recoverable from its neighbors. We train two variants — sharing ON and "
    "sharing OFF — with identical data, optimizer, and seed, and compare final masked-token "
    "accuracy against parameter count. This is ALBERT's bet: a small accuracy drop for a large "
    "parameter cut (§ 3.1, Table 4)."
)))
cells.append(code(lines(
    "# Small MLM task with LEARNABLE structure: arithmetic-progression sequences.\n"
    "# token[i] = (start + i*step) mod (V-2) + 2  -> a masked token is recoverable from its neighbors.\n"
    "def mask_batch():\n"
    "    start = torch.randint(0, V - 2, (B, 1))\n"
    "    step = torch.randint(1, 5, (B, 1))\n"
    "    idx = torch.arange(SEQ).unsqueeze(0)\n"
    "    t = ((start + idx * step) % (V - 2)) + 2          # tokens 2..V-1 (0,1 reserved)\n"
    "    inp = t.clone()\n"
    "    m = (torch.rand(B, SEQ) < 0.15)                   # mask ~15% (BERT/ALBERT rate)\n"
    "    inp[m] = MASK\n"
    "    return inp, t, m\n"
    "\n"
    "def train(factorized, shared, steps=600, lr=3e-3):\n"
    "    torch.manual_seed(0)\n"
    "    net = TinyALBERT(factorized, shared)\n"
    "    opt = torch.optim.Adam(net.parameters(), lr=lr)\n"
    "    for s in range(steps):\n"
    "        inp, tgt, m = mask_batch()\n"
    "        logits = net(inp)\n"
    "        loss = F.cross_entropy(logits[m], tgt[m])     # loss over masked positions only\n"
    "        opt.zero_grad()\n"
    "        loss.backward()\n"
    "        opt.step()\n"
    "        if s % 150 == 0 or s == steps - 1:\n"
    "            acc = (logits[m].argmax(-1) == tgt[m]).float().mean().item()\n"
    "            print(f\"  step {s:4d}  loss {loss.item():.4f}  masked-acc {acc:.3f}\")\n"
    "    return net, acc\n"
    "\n"
    "print(\"\\nALBERT-style (factorize + SHARE):\")\n"
    "net_share, acc_share = train(factorized=True, shared=True)\n"
    "print(\"BERT-style ablation (factorize, NO share):\")\n"
    "net_nosh, acc_nosh = train(factorized=True, shared=False)\n"
    "print(f\"\\nfinal masked-acc  shared: {acc_share:.3f} ({net_share.nparams()} params)\"\n"
    "      f\"   not-shared: {acc_nosh:.3f} ({net_nosh.nparams()} params)\")\n"
    "# shared reaches ~0.80 acc with ~37k params; not-shared ~0.87 with ~138k params (~3.7x more).\n"
    "# Sharing trades a small accuracy drop for a big parameter cut -- ALBERT's bet (\\S 3.1, Table 4).\n"
    "# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)"
)))

# === Visualization section (orig cells 4,5) ===
cells.append(md(lines(orig[4]["source"]) if isinstance(orig[4]["source"], str) else orig[4]["source"]))

# Break the dense visualization code (orig cell 5) into steps.
cells.append(md(lines(
    "### Step 1 — Re-declare the tiny model for a standalone run\n"
    "\n"
    "This panel is self-contained so it runs even if you jump straight here. We re-import torch and "
    "redefine the same hyperparameters, positional-encoding table, attention, encoder block, and "
    "ALBERT module — identical to the reference implementation above, just gathered in one place."
)))
cells.append(code(lines(
    "import math\n"
    "import torch\n"
    "import torch.nn as nn\n"
    "import torch.nn.functional as F\n"
    "\n"
    "V, H, E, L, h, ff = 32, 64, 16, 4, 4, 128\n"
    "SEQ, B, MASK = 12, 64, 1\n"
    "\n"
    "def pe_table(n, d):\n"
    "    pos = torch.arange(n).unsqueeze(1).float()\n"
    "    i2 = torch.arange(0, d, 2).float()\n"
    "    den = torch.pow(10000.0, i2 / d)\n"
    "    t = torch.zeros(n, d)\n"
    "    t[:, 0::2] = torch.sin(pos / den)\n"
    "    t[:, 1::2] = torch.cos(pos / den)\n"
    "    return t\n"
    "\n"
    "class MHA(nn.Module):\n"
    "    def __init__(s, d, h):\n"
    "        super().__init__()\n"
    "        s.h, s.dk = h, d // h\n"
    "        s.Wq, s.Wk, s.Wv, s.Wo = (nn.Linear(d, d) for _ in range(4))\n"
    "\n"
    "    def sp(s, x):\n"
    "        B, S, _ = x.shape\n"
    "        return x.view(B, S, s.h, s.dk).transpose(1, 2)\n"
    "\n"
    "    def forward(s, x):\n"
    "        Q, K, Vv = s.sp(s.Wq(x)), s.sp(s.Wk(x)), s.sp(s.Wv(x))\n"
    "        a = F.softmax(Q @ K.transpose(-2, -1) / math.sqrt(s.dk), -1) @ Vv\n"
    "        B, _, S, _ = a.shape\n"
    "        return s.Wo(a.transpose(1, 2).contiguous().view(B, S, s.h * s.dk))\n"
    "\n"
    "class Block(nn.Module):\n"
    "    def __init__(s, d, h, ff):\n"
    "        super().__init__()\n"
    "        s.a = MHA(d, h)\n"
    "        s.f = nn.Sequential(nn.Linear(d, ff), nn.ReLU(), nn.Linear(ff, d))\n"
    "        s.n1, s.n2 = nn.LayerNorm(d), nn.LayerNorm(d)\n"
    "\n"
    "    def forward(s, x):\n"
    "        x = s.n1(x + s.a(x))\n"
    "        return s.n2(x + s.f(x))\n"
    "\n"
    "class ALBERT(nn.Module):\n"
    "    def __init__(s, shared=True):\n"
    "        super().__init__()\n"
    "        s.shared = shared\n"
    "        s.emb = nn.Embedding(V, E)\n"
    "        s.proj = nn.Linear(E, H)   # factorized embedding (both runs)\n"
    "        s.register_buffer(\"pe\", pe_table(SEQ, H))\n"
    "        if shared:\n"
    "            s.block = Block(H, h, ff)\n"
    "            s.blocks = None\n"
    "        else:\n"
    "            s.blocks = nn.ModuleList([Block(H, h, ff) for _ in range(L)])\n"
    "            s.block = None\n"
    "        s.head = nn.Linear(H, V)\n"
    "\n"
    "    def forward(s, t):\n"
    "        x = s.proj(s.emb(t)) + s.pe[:t.shape[1]]\n"
    "        if s.shared:\n"
    "            for _ in range(L):\n"
    "                x = s.block(x)\n"
    "        else:\n"
    "            for b in s.blocks:\n"
    "                x = b(x)\n"
    "        return s.head(x)\n"
    "\n"
    "    def n(s):\n"
    "        return sum(p.numel() for p in s.parameters())"
)))

cells.append(md(lines(
    "### Step 2 — Run both variants and record the accuracy curve\n"
    "\n"
    "We train the shared and not-shared models again, this time saving the masked-token accuracy at "
    "every step so we can see the full learning curve rather than just the final number. Same data, "
    "optimizer, and seed for both, so any difference is due to weight sharing alone."
)))
cells.append(code(lines(
    "def mask_batch():\n"
    "    start = torch.randint(0, V - 2, (B, 1))\n"
    "    step = torch.randint(1, 5, (B, 1))\n"
    "    idx = torch.arange(SEQ).unsqueeze(0)\n"
    "    t = ((start + idx * step) % (V - 2)) + 2\n"
    "    inp = t.clone()\n"
    "    m = (torch.rand(B, SEQ) < 0.15)\n"
    "    inp[m] = MASK\n"
    "    return inp, t, m\n"
    "\n"
    "def run(shared, steps=600):\n"
    "    torch.manual_seed(0)\n"
    "    net = ALBERT(shared)\n"
    "    opt = torch.optim.Adam(net.parameters(), lr=3e-3)\n"
    "    accs = []\n"
    "    for s in range(steps):\n"
    "        inp, tgt, m = mask_batch()\n"
    "        lg = net(inp)\n"
    "        loss = F.cross_entropy(lg[m], tgt[m])\n"
    "        opt.zero_grad()\n"
    "        loss.backward()\n"
    "        opt.step()\n"
    "        accs.append((lg[m].argmax(-1) == tgt[m]).float().mean().item())\n"
    "    return net, accs\n"
    "\n"
    "ns, sh = run(True)\n"
    "nn_, no = run(False)"
)))

cells.append(md(lines(
    "### Step 3 — Read off the trade-off\n"
    "\n"
    "We sample the accuracy curves at a few checkpoints and print each variant's parameter count. "
    "The shared model lands near ~0.80 accuracy with ~37k parameters; the not-shared model reaches "
    "~0.87 with ~138k parameters (~3.7x more) — a small accuracy cost for a big parameter saving."
)))
cells.append(code(lines(
    "idx = list(range(0, 600, 50)) + [599]\n"
    "print(\"shared  (%d params):\" % ns.n(),  [[i, round(sh[i], 3)] for i in idx])\n"
    "print(\"noshare (%d params):\" % nn_.n(), [[i, round(no[i], 3)] for i in idx])\n"
    "# shared -> ~0.80 acc, ~37k params; noshare -> ~0.87 acc, ~138k params (~3.7x more)."
)))

# === Practice section (orig cells 6..15) -- keep exactly ===
for c in orig[6:]:
    cells.append(c)

nb["cells"] = cells
nb["metadata"]["enhanced_walkthrough"] = True

json.dump(nb, open(PATH, "w"), indent=1)
print("wrote", len(cells), "cells")
