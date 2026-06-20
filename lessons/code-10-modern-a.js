/* =====================================================================
   MODULE 10 — MODERN DEEP LEARNING & AI — CODE SECTION.
   One window.CODE entry per lesson id in 10-modern-a.js.
   PyTorch snippets are copy-only (runnable:false): the browser Pyodide
   runtime has no torch. Each shows the KEY mechanism of its lesson with
   a tiny synthetic input tensor so the snippet is self-contained.
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {

  /* 1. Transformers & self-attention — scaled dot-product attention from scratch. */
  "mod-transformer": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Scaled dot-product attention in a few lines. We score every query against every key with a dot product, divide by sqrt(d) to keep the numbers tame, softmax each row into weights that sum to 1, then take a weighted blend of the value vectors. The output has one context-aware vector per token.</p>`,
    code:
`import torch
import torch.nn.functional as F

def attention(Q, K, V):
    # Q,K,V: (batch, seq_len, d). One query/key/value vector per token.
    d = Q.size(-1)
    scores = Q @ K.transpose(-2, -1) / d ** 0.5   # (batch, seq, seq)
    weights = F.softmax(scores, dim=-1)           # each row sums to 1
    return weights @ V, weights                   # blended values

torch.manual_seed(0)
batch, seq, d = 1, 4, 8                            # 4 tokens, dim 8
x = torch.randn(batch, seq, d)
# learnable projections build Q, K, V from the same input (self-attention)
Wq, Wk, Wv = (torch.randn(d, d) for _ in range(3))
Q, K, V = x @ Wq, x @ Wk, x @ Wv
out, attn = attention(Q, K, V)
print("output shape:", out.shape)                 # (1, 4, 8)
print("row 0 weights sum:", attn[0, 0].sum().item())  # ~1.0`
  },

  /* 2. Multi-head attention — nn.MultiheadAttention, several heads in parallel. */
  "mod-multihead": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Multi-head attention splits the model vector into several heads, runs scaled dot-product attention in each, then concatenates and mixes the results with an output projection. PyTorch's nn.MultiheadAttention does all of this; we pass batch_first=True so tensors are shaped (batch, seq, dim). The returned weights are averaged over heads by default.</p>`,
    code:
`import torch
import torch.nn as nn

torch.manual_seed(0)
batch, seq, d_model, heads = 1, 4, 16, 4          # 16 dims split into 4 heads of 4
mha = nn.MultiheadAttention(embed_dim=d_model, num_heads=heads, batch_first=True)

x = torch.randn(batch, seq, d_model)              # tiny synthetic input
# self-attention: query, key, value all come from x
out, weights = mha(x, x, x, need_weights=True)
print("output shape:", out.shape)                 # (1, 4, 16)
print("attn weights shape:", weights.shape)       # (1, 4, 4) averaged over heads
print("each query row sums to:", weights[0, 0].sum().item())  # ~1.0

# each head works in d_model // heads dims; concat returns to d_model
print("per-head dim:", d_model // heads)           # 4`
  },

  /* 3. LLMs (BERT/GPT) — a tiny GPT-style decoder block + next-token loss. */
  "mod-llm": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A minimal GPT-style decoder block: causal (masked) self-attention so each token only sees earlier tokens, plus a feed-forward MLP, both wrapped in residual connections and layer norm. The training sketch shifts the input by one to make next-token targets and uses cross-entropy over the vocabulary, exactly the next-word game an LLM plays.</p>`,
    code:
`import torch
import torch.nn as nn
import torch.nn.functional as F

class DecoderBlock(nn.Module):
    def __init__(self, d, heads):
        super().__init__()
        self.attn = nn.MultiheadAttention(d, heads, batch_first=True)
        self.ff = nn.Sequential(nn.Linear(d, 4 * d), nn.GELU(), nn.Linear(4 * d, d))
        self.n1, self.n2 = nn.LayerNorm(d), nn.LayerNorm(d)
    def forward(self, x):
        T = x.size(1)
        mask = torch.triu(torch.ones(T, T), diagonal=1).bool()  # block future tokens
        a, _ = self.attn(self.n1(x), self.n1(x), self.n1(x), attn_mask=mask)
        x = x + a                                  # residual
        return x + self.ff(self.n2(x))             # residual

torch.manual_seed(0)
vocab, d, T = 50, 32, 6
emb = nn.Embedding(vocab, d)
block, head = DecoderBlock(d, 4), nn.Linear(d, vocab)
tokens = torch.randint(0, vocab, (1, T))           # tiny synthetic sequence
logits = head(block(emb(tokens)))                  # (1, T, vocab)
# next-token loss: predict token t+1 from positions up to t
loss = F.cross_entropy(logits[:, :-1].reshape(-1, vocab), tokens[:, 1:].reshape(-1))
print("logits shape:", logits.shape, "loss:", round(loss.item(), 3))`
  },

  /* 4. Autoencoders — encoder + decoder nn.Module with a tight bottleneck. */
  "mod-autoencoder": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>An autoencoder is just an encoder MLP that squeezes the input down to a small code, and a decoder MLP that rebuilds it. The training signal is the reconstruction loss (mean squared error) between input and output. The narrow bottleneck forces the network to keep only the essential structure.</p>`,
    code:
`import torch
import torch.nn as nn
import torch.nn.functional as F

class Autoencoder(nn.Module):
    def __init__(self, n_in=5, code=2):
        super().__init__()
        self.encoder = nn.Sequential(nn.Linear(n_in, 4), nn.ReLU(), nn.Linear(4, code))
        self.decoder = nn.Sequential(nn.Linear(code, 4), nn.ReLU(), nn.Linear(4, n_in))
    def forward(self, x):
        z = self.encoder(x)        # tiny code (bottleneck)
        return self.decoder(z), z  # reconstruction + code

torch.manual_seed(0)
model = Autoencoder(n_in=5, code=2)
x = torch.rand(8, 5)               # 8 synthetic samples, 5 features each
x_hat, z = model(x)
loss = F.mse_loss(x_hat, x)        # reconstruction loss
loss.backward()                    # gradients flow back through both nets
print("code shape:", z.shape)      # (8, 2) -> squeezed to 2 numbers
print("recon shape:", x_hat.shape) # (8, 5)
print("recon MSE:", round(loss.item(), 4))`
  },

  /* 5. VAE — encoder to (mu, logvar), reparameterization trick, KL + recon loss. */
  "mod-vae": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The VAE encoder outputs a mean and a log-variance per latent dimension. The reparameterization trick samples a code z = mu + sigma * eps with eps ~ N(0, I), so gradients still flow through the random step. The loss adds reconstruction error to a KL term that pulls every encoded distribution toward N(0, I), keeping the latent space smooth and samplable.</p>`,
    code:
`import torch
import torch.nn as nn
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, n_in=5, latent=2):
        super().__init__()
        self.enc = nn.Linear(n_in, 8)
        self.mu = nn.Linear(8, latent)
        self.logvar = nn.Linear(8, latent)     # log-variance keeps sigma positive
        self.dec = nn.Sequential(nn.Linear(latent, 8), nn.ReLU(), nn.Linear(8, n_in))
    def reparam(self, mu, logvar):
        std = torch.exp(0.5 * logvar)          # sigma
        eps = torch.randn_like(std)            # noise ~ N(0, I)
        return mu + std * eps                  # z = mu + sigma * eps
    def forward(self, x):
        h = F.relu(self.enc(x))
        mu, logvar = self.mu(h), self.logvar(h)
        z = self.reparam(mu, logvar)
        return self.dec(z), mu, logvar

torch.manual_seed(0)
model = VAE()
x = torch.rand(8, 5)                            # synthetic batch
x_hat, mu, logvar = model(x)
recon = F.mse_loss(x_hat, x, reduction="sum")
kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())  # KL to N(0, I)
loss = recon + kl
print("recon:", round(recon.item(), 2), "kl:", round(kl.item(), 2))`
  },

  /* 6. Diffusion — forward noising at random t + denoising (noise-prediction) step. */
  "mod-diffusion": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>Diffusion training in one step: pick a random timestep t, use the closed-form forward process to jump straight to a noisy sample x_t = sqrt(alpha_bar) * x_0 + sqrt(1 - alpha_bar) * eps, then ask the network to predict the noise eps it added. The loss is the squared error between the true noise and the prediction. Once trained, subtracting predicted noise denoises from pure static.</p>`,
    code:
`import torch
import torch.nn as nn
import torch.nn.functional as F

T = 200
betas = torch.linspace(1e-4, 0.02, T)          # noise schedule
alpha_bar = torch.cumprod(1.0 - betas, dim=0)  # product of (1 - beta) up to t

# tiny noise-predictor: takes x_t and a (scaled) timestep, predicts the noise
net = nn.Sequential(nn.Linear(5 + 1, 32), nn.ReLU(), nn.Linear(32, 5))

torch.manual_seed(0)
x0 = torch.rand(8, 5)                           # clean synthetic data
t = torch.randint(0, T, (8,))                   # a random step per sample
ab = alpha_bar[t].unsqueeze(1)                  # (8, 1)
eps = torch.randn_like(x0)                      # the noise we add
x_t = ab.sqrt() * x0 + (1 - ab).sqrt() * eps    # closed-form forward jump

t_feat = (t.float() / T).unsqueeze(1)           # timestep as a feature
eps_pred = net(torch.cat([x_t, t_feat], dim=1)) # predict the added noise
loss = F.mse_loss(eps_pred, eps)                # train to name the noise
loss.backward()
print("x_t shape:", x_t.shape, "loss:", round(loss.item(), 4))`
  },

  /* 7. Normalizing flows — an affine coupling layer with its log-determinant. */
  "mod-normalizing-flows": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>An affine coupling layer (RealNVP style) splits the input in two. The first half passes through unchanged and also conditions a small network that outputs a scale and shift for the second half. Because the first half is untouched, the layer is exactly invertible and its log-determinant is simply the sum of the scale terms, so we get exact log-likelihoods.</p>`,
    code:
`import torch
import torch.nn as nn

class CouplingLayer(nn.Module):
    def __init__(self, dim):
        super().__init__()
        self.half = dim // 2
        # net reads the untouched half, outputs scale (log s) and shift (t)
        self.net = nn.Sequential(nn.Linear(self.half, 16), nn.ReLU(),
                                 nn.Linear(16, 2 * (dim - self.half)))
    def forward(self, x):
        xa, xb = x[:, :self.half], x[:, self.half:]   # split
        log_s, t = self.net(xa).chunk(2, dim=1)
        log_s = torch.tanh(log_s)                      # stabilize the scale
        yb = xb * torch.exp(log_s) + t                 # affine transform on xb
        y = torch.cat([xa, yb], dim=1)
        log_det = log_s.sum(dim=1)                      # Jacobian log-det
        return y, log_det

torch.manual_seed(0)
dim = 4
layer = CouplingLayer(dim)
x = torch.randn(8, dim)                                # base samples ~ N(0, I)
y, log_det = layer(x)
# exact log-likelihood under the flow = base log-prob + log|det Jacobian|
base_logp = (-0.5 * y.pow(2) - 0.5 * torch.log(torch.tensor(2 * 3.14159))).sum(1)
log_prob = base_logp + log_det
print("y shape:", y.shape, "log_det[0]:", round(log_det[0].item(), 4))
print("log_prob[0]:", round(log_prob[0].item(), 4))`
  }

});
