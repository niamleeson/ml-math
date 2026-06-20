/* =====================================================================
   CODE SECTION for MODULE 10 (part B) — Modern Deep Learning & AI.
   One window.CODE entry per lesson id in 10-modern-b.js.
   Primary library: PyTorch (copy-only, runnable:false), current API,
   tiny synthetic tensors so each snippet is self-contained.
   ===================================================================== */
window.CODE = Object.assign(window.CODE || {}, {

  /* ---- 1. GRAPH NEURAL NETWORKS -------------------------------------- */
  "mod-gnn": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>One graph-convolution layer as pure PyTorch. We average each node's
      neighbour features (a permutation-invariant mean), pass the result through a shared
      linear map, then ReLU. The averaging is done with a row-normalized adjacency matrix
      <code>A_hat</code> so a single matrix multiply updates every node at once.</p>`,
    code: `import torch
import torch.nn as nn

class GCNLayer(nn.Module):
    def __init__(self, in_dim, out_dim):
        super().__init__()
        self.lin = nn.Linear(in_dim, out_dim)   # shared weight matrix W

    def forward(self, H, A_hat):
        # H: (N, in_dim) node features ; A_hat: (N, N) row-normalized adjacency
        agg = A_hat @ H                          # mean of each node's neighbours
        return torch.relu(self.lin(agg))         # sigma(W . agg)

# tiny synthetic graph: 4 nodes, a couple of edges (+ self-loops)
A = torch.tensor([[1., 1., 0., 1.],
                  [1., 1., 1., 0.],
                  [0., 1., 1., 1.],
                  [1., 0., 1., 1.]])
A_hat = A / A.sum(dim=1, keepdim=True)           # normalize rows -> averaging
H = torch.randn(4, 3)                            # 4 nodes, 3 features each

layer = GCNLayer(in_dim=3, out_dim=2)
H2 = layer(H, A_hat)                             # (4, 2) updated features
print(H2.shape)`
  },

  /* ---- 2. DEEP Q-NETWORKS -------------------------------------------- */
  "mod-dqn": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>One DQN update step. A small Q-network outputs a Q value per action.
      We build the TD target <code>y = r + gamma * max_a' Q_target(s')</code> using a frozen
      target network, gather the Q for the action actually taken, and minimize the squared
      TD error. <code>detach()</code> keeps gradients off the target.</p>`,
    code: `import torch
import torch.nn as nn

class QNet(nn.Module):
    def __init__(self, state_dim, n_actions):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 32), nn.ReLU(),
            nn.Linear(32, n_actions))            # one Q value per action
    def forward(self, s):
        return self.net(s)

state_dim, n_actions, gamma = 4, 2, 0.9
q_net, target_net = QNet(state_dim, n_actions), QNet(state_dim, n_actions)
target_net.load_state_dict(q_net.state_dict())   # target = slow copy
opt = torch.optim.Adam(q_net.parameters(), lr=1e-3)

# a synthetic mini-batch of transitions (s, a, r, s', done)
s  = torch.randn(8, state_dim)
a  = torch.randint(0, n_actions, (8, 1))
r  = torch.randn(8)
s2 = torch.randn(8, state_dim)
done = torch.zeros(8)

q_sa = q_net(s).gather(1, a).squeeze(1)          # Q(s, a) taken
with torch.no_grad():
    max_q2 = target_net(s2).max(dim=1).values    # max_a' Q_target(s')
    y = r + gamma * (1 - done) * max_q2          # TD target
loss = nn.functional.mse_loss(q_sa, y)           # (y - Q(s,a))^2
opt.zero_grad(); loss.backward(); opt.step()
print(float(loss))`
  },

  /* ---- 3. POLICY GRADIENTS (REINFORCE) ------------------------------- */
  "mod-policy-gradient": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The REINFORCE loss. A policy network outputs action logits; a Categorical
      distribution turns them into probabilities. The loss is
      <code>-(log_prob * return)</code> summed over the episode — pushing up actions that
      led to a high return G and down those that did not.</p>`,
    code: `import torch
import torch.nn as nn
from torch.distributions import Categorical

class Policy(nn.Module):
    def __init__(self, state_dim, n_actions):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(state_dim, 32), nn.ReLU(),
            nn.Linear(32, n_actions))            # logits over actions
    def forward(self, s):
        return self.net(s)

policy = Policy(state_dim=4, n_actions=2)
opt = torch.optim.Adam(policy.parameters(), lr=1e-2)

# synthetic episode: 5 states visited, with a per-step return G
states  = torch.randn(5, 4)
returns = torch.tensor([2.0, 1.5, 1.0, -0.5, -1.0])
returns = (returns - returns.mean()) / (returns.std() + 1e-8)  # baseline

logits = policy(states)
dist   = Categorical(logits=logits)
actions = dist.sample()                          # actions actually taken
log_probs = dist.log_prob(actions)               # log pi(a | s)

loss = -(log_probs * returns).sum()              # REINFORCE objective
opt.zero_grad(); loss.backward(); opt.step()
print(float(loss))`
  },

  /* ---- 4. ACTOR-CRITIC (A2C, PPO) ------------------------------------ */
  "mod-actor-critic": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>An actor-critic update with a shared trunk and two heads: the actor (action
      logits) and the critic (a scalar value V(s)). We form the one-step advantage
      <code>A = r + gamma * V(s') - V(s)</code>, scale the policy gradient by A (detached),
      and fit the critic to the TD target with MSE.</p>`,
    code: `import torch
import torch.nn as nn
from torch.distributions import Categorical

class ActorCritic(nn.Module):
    def __init__(self, state_dim, n_actions):
        super().__init__()
        self.body   = nn.Sequential(nn.Linear(state_dim, 32), nn.ReLU())
        self.actor  = nn.Linear(32, n_actions)   # policy logits
        self.critic = nn.Linear(32, 1)           # value V(s)
    def forward(self, s):
        h = self.body(s)
        return self.actor(h), self.critic(h).squeeze(-1)

ac = ActorCritic(state_dim=4, n_actions=2)
opt = torch.optim.Adam(ac.parameters(), lr=1e-3)
gamma = 0.9

# synthetic one-step batch (s, a, r, s')
s, s2 = torch.randn(6, 4), torch.randn(6, 4)
r = torch.randn(6)

logits, V = ac(s)
with torch.no_grad():
    _, V2 = ac(s2)
    target = r + gamma * V2                      # TD target for critic
    adv = target - V                             # advantage A(s, a)

dist = Categorical(logits=logits)
a = dist.sample()
actor_loss  = -(dist.log_prob(a) * adv).mean()   # scale by advantage
critic_loss = nn.functional.mse_loss(V, target)
loss = actor_loss + 0.5 * critic_loss
opt.zero_grad(); loss.backward(); opt.step()
print(float(actor_loss), float(critic_loss))`
  },

  /* ---- 5. CONTRASTIVE LEARNING (SimCLR / CLIP) ----------------------- */
  "mod-contrastive": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The NT-Xent / InfoNCE loss. We L2-normalize the embeddings of two augmented
      views, build the cosine-similarity matrix scaled by temperature, mask the diagonal,
      and apply cross-entropy where each row's "correct class" is its positive partner in the
      other view. This pulls positives together and pushes negatives apart.</p>`,
    code: `import torch
import torch.nn.functional as F

def nt_xent(z1, z2, tau=0.1):
    # z1, z2: (B, d) embeddings of the two views of the same B inputs
    B = z1.size(0)
    z = F.normalize(torch.cat([z1, z2], dim=0), dim=1)  # (2B, d) unit vectors
    sim = (z @ z.t()) / tau                              # cosine sim matrix (2B, 2B)
    sim.fill_diagonal_(float('-inf'))                    # no self-comparison
    # positive of row i is its partner B positions away (and vice versa)
    targets = torch.cat([torch.arange(B, 2 * B),
                         torch.arange(0, B)])
    return F.cross_entropy(sim, targets)                 # InfoNCE = softmax CE

# synthetic batch: 4 items, 8-dim embeddings, two views each
z1 = torch.randn(4, 8)
z2 = z1 + 0.05 * torch.randn(4, 8)   # view 2 is a slightly perturbed view 1
loss = nt_xent(z1, z2, tau=0.1)
print(float(loss))`
  },

  /* ---- 6. VISION TRANSFORMERS (ViT) ---------------------------------- */
  "mod-vit": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>The patch-embedding front of a ViT plus a transformer encoder. A strided
      Conv2d cuts the image into non-overlapping patches and embeds each into a token. We
      prepend a learned <code>[CLS]</code> token, add position embeddings, and run a
      <code>TransformerEncoder</code> so every patch can attend to every other.</p>`,
    code: `import torch
import torch.nn as nn

class ViT(nn.Module):
    def __init__(self, img=32, patch=8, dim=64, depth=2, heads=4, n_cls=10):
        super().__init__()
        n_patches = (img // patch) ** 2                  # N = (H/P)*(W/P)
        # one strided conv = flatten-each-patch then linear-embed
        self.embed = nn.Conv2d(3, dim, kernel_size=patch, stride=patch)
        self.cls = nn.Parameter(torch.zeros(1, 1, dim))  # [CLS] token
        self.pos = nn.Parameter(torch.zeros(1, n_patches + 1, dim))
        enc = nn.TransformerEncoderLayer(dim, heads, batch_first=True)
        self.encoder = nn.TransformerEncoder(enc, num_layers=depth)
        self.head = nn.Linear(dim, n_cls)

    def forward(self, x):                                 # x: (B, 3, H, W)
        t = self.embed(x).flatten(2).transpose(1, 2)     # (B, N, dim) tokens
        cls = self.cls.expand(x.size(0), -1, -1)
        t = torch.cat([cls, t], dim=1) + self.pos        # prepend CLS, add pos
        t = self.encoder(t)                              # attention over patches
        return self.head(t[:, 0])                        # classify from CLS

model = ViT()
x = torch.randn(2, 3, 32, 32)        # 2 synthetic RGB images
logits = model(x)                    # (2, 10) class scores
print(logits.shape)`
  },

  /* ---- 7. TIME-SERIES FORECASTING (LSTM) ----------------------------- */
  "mod-timeseries": {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>An LSTM forecaster — the modern deep-learning take on the ARIMA idea of
      predicting the next value from recent history. The LSTM reads a window of past values,
      and a linear head maps its last hidden state to the next-step prediction. One training
      step minimizes MSE against the true next value.</p>`,
    code: `import torch
import torch.nn as nn

class LSTMForecaster(nn.Module):
    def __init__(self, in_dim=1, hidden=32):
        super().__init__()
        self.lstm = nn.LSTM(in_dim, hidden, batch_first=True)
        self.head = nn.Linear(hidden, 1)         # predict next value
    def forward(self, x):                         # x: (B, T, in_dim)
        out, _ = self.lstm(x)                     # out: (B, T, hidden)
        return self.head(out[:, -1, :])           # use last time step -> (B, 1)

model = LSTMForecaster()
opt = torch.optim.Adam(model.parameters(), lr=1e-2)

# synthetic batch: 16 windows of length 20 (univariate series)
seq = torch.sin(torch.linspace(0, 8, 21)).repeat(16, 1)
x = seq[:, :20].unsqueeze(-1)                     # (16, 20, 1) input window
y = seq[:, 20:21]                                 # (16, 1) next value

pred = model(x)
loss = nn.functional.mse_loss(pred, y)
opt.zero_grad(); loss.backward(); opt.step()
print(float(loss))`
  }

});
