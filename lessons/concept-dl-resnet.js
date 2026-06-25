/* Deep Learning (CS230) — "Residual networks (skip connections)".
   Self-contained: lesson + CODE + CODEVIZ merged by id "dl-resnet". */
(function () {
  window.LESSONS.push({
    id: "dl-resnet",
    title: "Residual networks (skip connections)",
    tagline: "Add the layer's input back to its output, so very deep nets train instead of stalling.",
    module: "Deep Learning",
    prereqs: ["dl-conv", "dl-backprop", "dl-vanishing-gradient", "dl-forward-prop", "dl-activations", "dl-cnn-params"],

    whenToUse:
      `<p><b>Reach for residual connections whenever you want a deep network</b> &mdash; more than about
       20 layers &mdash; to actually train. Below that depth a plain stack is fine; above it, plain stacks
       hit the <b>degradation problem</b> (explained below) and a ResNet (Residual Network) is the standard fix.</p>
       <ul>
         <li><b>Reach for it</b> to go deep: ResNet-50, ResNet-101, and almost every modern Convolutional
         Neural Network (CNN) backbone are built from residual blocks.</li>
         <li><b>Reach for it</b> when a deeper version of your model trains <i>worse</i> than a shallower one
         &mdash; that is the telltale sign a skip connection will help.</li>
       </ul>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>A plain (no-skip) deep stack</b> &mdash; past ~20 layers the plain stack degrades; the skip
         connection removes that ceiling.</li>
         <li><b>Just making the net wider instead of deeper</b> &mdash; sometimes cheaper, but depth captures
         hierarchy that width cannot, and residuals make depth safe.</li>
       </ul>
       <p><b>Pick a different idea when:</b> the net is shallow (skips add nothing), or you are on sequences
       where attention (a Transformer) is the better deep architecture &mdash; though note Transformers use
       residual connections too.</p>`,

    application:
      `<p>Residual blocks are the backbone of modern computer vision: ResNet-50 powers image classification,
       object detection, and segmentation in production. The same trick &mdash; add the input back to the
       output &mdash; is reused inside Transformers (every attention and feed-forward sub-layer is wrapped in
       a residual connection), so skip connections quietly sit under most of today's large models.</p>`,

    pitfalls:
      `<ul>
         <li><b>Channel / shape mismatch on the shortcut.</b> The skip adds $a^{[l]}$ to $z^{[l+2]}$, so the
         two must have the same shape. If the block changes the number of channels or downsamples, you cannot
         add a 64-channel input to a 128-channel output. <b>Fix:</b> put a 1&times;1 convolution (a
         <b>projection shortcut</b>) on the skip to match channels and stride.</li>
         <li><b>Putting the activation in the wrong place.</b> The standard block adds <i>before</i> the final
         activation: $g(a^{[l]} + z^{[l+2]})$. Squashing each path separately and then adding breaks the clean
         identity path. <b>Fix:</b> add first, then apply $g$.</li>
         <li><b>Skipping normalization.</b> Without Batch Normalization the two added paths can be on wildly
         different scales and the block destabilizes. <b>Fix:</b> use the conv &rarr; BatchNorm &rarr; ReLU
         (Rectified Linear Unit) ordering inside the block.</li>
         <li><b>Thinking skips fix overfitting.</b> They fix the <i>optimization</i> problem (training error),
         not generalization. <b>Fix:</b> still use regularization and data augmentation for the test gap.</li>
         <li><b>Assuming deeper is always better.</b> Residuals make depth <i>safe</i>, not automatically
         <i>better</i>. <b>Fix:</b> add depth only while validation accuracy improves.</li>
       </ul>`,

    bigIdea:
      `<p>Stack enough plain layers and something surprising happens: the deeper network trains <b>worse</b>
       than a shallower one &mdash; worse <i>training</i> error, not just worse test error. This is the
       <b>degradation problem</b>. It is not overfitting (overfitting would still drive training error down);
       the deep net simply fails to optimize.</p>
       <p>That is strange, because a deep net <i>could</i> match a shallow one: make the extra layers do
       nothing (the identity function) and you recover the shallow net. The trouble is that learning to be the
       identity is hard for a stack of nonlinear layers.</p>
       <p><b>The residual idea:</b> hand the layers the identity for free. Instead of asking a block to learn
       the whole desired mapping $H(x)$, add the input back at the end and let the block learn only the
       <b>residual</b> $F(x) = H(x) - x$. If the best thing to do is nothing, the block just learns
       $F(x)=0$ &mdash; easy. That free identity path is the <b>skip connection</b> (or <b>shortcut</b>).</p>`,

    buildup:
      `<p>Take a normal two-layer block. Call its input $a^{[l]}$. The first layer produces a pre-activation
       $z^{[l+1]}$ and an activation $a^{[l+1]} = g(z^{[l+1]})$. The second layer produces a pre-activation
       $z^{[l+2]}$.</p>
       <p>In a <b>plain</b> block you would finish with $a^{[l+2]} = g(z^{[l+2]})$ &mdash; the output depends
       only on what flowed through the two layers.</p>
       <p>In a <b>residual</b> block you instead route the original input $a^{[l]}$ straight to the end and
       <b>add</b> it before the final activation:</p>
       <p>$$ a^{[l+2]} = g\\left(a^{[l]} + z^{[l+2]}\\right) $$</p>
       <p>The added $a^{[l]}$ is the skip connection. Now the two stacked layers only have to produce the
       <i>difference</i> between the desired output and the input &mdash; the residual &mdash; because the
       input is already supplied for free by the shortcut.</p>
       <p>When the block's input and output have the same number of channels, the shortcut is just a wire
       (an <b>identity shortcut</b>, no parameters). When the block changes the channel count or downsamples,
       you put a 1&times;1 convolution on the shortcut to reshape $a^{[l]}$ first &mdash; a
       <b>projection shortcut</b>.</p>`,

    symbols: [
      { sym: "$a^{[l]}$", desc: "the activation (output) of layer $l$ &mdash; the input fed into this block, and the value carried by the skip connection." },
      { sym: "$z^{[l+2]}$", desc: "the pre-activation of the second layer in the block: its weighted sum before any activation is applied." },
      { sym: "$a^{[l+2]}$", desc: "the activation (output) of the whole residual block." },
      { sym: "$g(\\cdot)$", desc: "the activation function (here a ReLU, Rectified Linear Unit): the nonlinear squish applied at the end." },
      { sym: "$+\\,a^{[l]}$", desc: "the skip / shortcut: the block's input added back in, so the layers only learn the residual." },
      { sym: "$F(x)=H(x)-x$", desc: "the residual the two layers must learn: $H(x)$ is the mapping you want, $x$ is the input the shortcut supplies for free." }
    ],
    formula: `$$ a^{[l+2]} = g\\left(a^{[l]} + z^{[l+2]}\\right) $$`,
    whatItDoes:
      `<p>Run the input $a^{[l]}$ through the two layers of the block to get the pre-activation $z^{[l+2]}$.
       Then, before the final activation, <b>add the original input back</b>: $a^{[l]} + z^{[l+2]}$. Finally
       apply the activation $g$.</p>
       <p>Because the input is added back, the two layers only need to learn $F(x) = H(x) - x$, the
       <b>residual</b> &mdash; the correction on top of "leave the input alone." Learning $F(x)=0$ to copy the
       input is trivial, so adding depth can never make things worse: the network can always fall back to the
       identity.</p>`,

    derivation:
      `<p><b>Why the shortcut keeps gradients alive.</b> Recall the vanishing-gradient problem: during
       back-propagation, the gradient at an early layer is a long <i>product</i> of per-layer Jacobians (the
       chain rule), and if each factor is &lt; 1 the product shrinks toward 0 over many layers, so the early
       layers barely learn.</p>
       <p>Write a residual block (ignoring the final $g$ for the gradient argument, as is standard) as
       $a^{[l+2]} = a^{[l]} + F(a^{[l]})$, where $F$ is the two-layer mapping. Differentiate the output with
       respect to the input:</p>
       <p>$$ \\frac{\\partial a^{[l+2]}}{\\partial a^{[l]}} = 1 + \\frac{\\partial F(a^{[l]})}{\\partial a^{[l]}} $$</p>
       <p>That leading $\\,1\\,$ is the whole trick. When back-propagation multiplies its way through the block,
       the gradient gets multiplied by $(1 + \\partial F/\\partial a)$ instead of just $\\partial F/\\partial a$.
       The additive $1$ is a clean <b>"+1" highway</b>: even if $\\partial F/\\partial a$ is tiny, the gradient
       still passes through essentially undamped. Stack many blocks and the gradient flows from output back to
       input along that highway instead of decaying to 0. The CODEVIZ panel below shows exactly this &mdash;
       a plain stack's gradient norm collapses to ~0 with depth, while the residual stack's stays around 1.</p>`,

    example:
      `<p>Suppose a block's input is the vector $a^{[l]} = [2,\\,-1]$, and the two layers compute a
       pre-activation $z^{[l+2]} = [0.1,\\,0.3]$. Take $g$ to be ReLU (keep positives, zero out negatives).</p>
       <ul class="steps">
         <li>Add the skip: $a^{[l]} + z^{[l+2]} = [2+0.1,\\;-1+0.3] = [2.1,\\,-0.7]$.</li>
         <li>Apply $g$: $\\mathrm{ReLU}([2.1,\\,-0.7]) = [2.1,\\,0]$. So $a^{[l+2]} = [2.1,\\,0]$.</li>
         <li>Notice what the layers had to do: the output's first component, $2.1$, is mostly the input's
         $2$ plus a small residual $0.1$. The two layers only learned the little correction &mdash; the bulk
         of the answer came for free through the shortcut.</li>
       </ul>
       <p>If the layers had learned $z^{[l+2]} = [0,0]$ (the residual $F(x)=0$), the block would output
       $g(a^{[l]}) = \\mathrm{ReLU}([2,-1]) = [2,0]$ &mdash; just passing the input along. That is the
       "do nothing safely" fallback a plain stack struggles to learn.</p>`,

    practice: [
      {
        q: `A team makes their plain CNN deeper, from 20 to 56 layers, and the <i>training</i> error goes UP. They assume it is overfitting and add dropout. Why is that diagnosis wrong, and what should they do?`,
        steps: [
          { do: `Separate the two failure modes: overfitting raises the <i>test</i> gap while training error keeps falling; here the <i>training</i> error itself rose.`, why: `Rising training error means the deeper net cannot even fit the data &mdash; an <b>optimization</b> failure, not a generalization one.` },
          { do: `Name it: this is the <b>degradation problem</b> &mdash; a deeper plain stack trains worse even though it could in principle copy the shallow net via identity layers.`, why: `Plain nonlinear layers find the identity mapping hard to learn, so extra depth hurts optimization.` },
          { do: `Switch the blocks to <b>residual</b> blocks: add the input back, $a^{[l+2]} = g(a^{[l]} + z^{[l+2]})$, so each block need only learn the residual $F(x)=H(x)-x$.`, why: `The skip hands the layers the identity for free, so depth can no longer make training worse, and gradients keep a "+1" highway back to early layers.` }
        ],
        answer: `<p>It is not overfitting &mdash; <i>training</i> error rose, so the deep net cannot even optimize: the <b>degradation problem</b>. Dropout fights overfitting, the wrong target. The fix is <b>skip connections</b>: turn the blocks into residual blocks so each learns only $F(x)=H(x)-x$ and the identity path keeps gradients flowing. ResNet (Residual Network) was built exactly for this.</p>`
      },
      {
        q: `In a residual block, the input $a^{[l]}$ has 64 channels but the block's second layer outputs $z^{[l+2]}$ with 128 channels. You try $a^{[l]} + z^{[l+2]}$ and it errors. What is wrong and how do you fix it?`,
        steps: [
          { do: `Check the add: $a^{[l]} + z^{[l+2]}$ is element-wise, so both must have the same shape &mdash; 64 channels cannot add to 128.`, why: `The shortcut and the main path have to match in channels (and spatial size) to be summed.` },
          { do: `Put a <b>1&times;1 convolution</b> on the shortcut to project $a^{[l]}$ from 64 to 128 channels (and match stride if you also downsampled).`, why: `A 1&times;1 conv is a cheap, learnable per-pixel linear map that reshapes the channel count without touching spatial structure.` },
          { do: `Now add the projected shortcut to $z^{[l+2]}$ and apply $g$.`, why: `Shapes match, so the residual sum and final activation work.` }
        ],
        answer: `<p>The element-wise add needs matching shapes, and 64 &ne; 128. Replace the identity shortcut with a <b>projection shortcut</b>: a 1&times;1 convolution on the skip path that maps $a^{[l]}$ to 128 channels (and applies the same stride if you downsampled). Then $a^{[l+2]} = g(\\text{proj}(a^{[l]}) + z^{[l+2]})$ adds cleanly.</p>`
      },
      {
        q: `Why does ResNet-50 use a <b>bottleneck</b> block (1&times;1 &rarr; 3&times;3 &rarr; 1&times;1) instead of two 3&times;3 convolutions, and how does the skip connection survive the channel squeeze?`,
        steps: [
          { do: `Read the bottleneck: the first 1&times;1 conv <b>reduces</b> channels (e.g. 256 &rarr; 64), the 3&times;3 conv does the spatial work cheaply at 64 channels, and the last 1&times;1 conv <b>restores</b> channels (64 &rarr; 256).`, why: `Doing the expensive 3&times;3 convolution at a low channel count cuts the FLOPs (Floating-Point Operations) a lot, so very deep nets stay affordable.` },
          { do: `Trace the skip: the shortcut carries the 256-channel input around the whole three-conv stack and is added to the 256-channel output.`, why: `The block input and output both have 256 channels, so an identity shortcut matches &mdash; the squeeze to 64 happens only inside the main path.` },
          { do: `If the block also changes channels or downsamples at its boundary, put a 1&times;1 projection on the skip.`, why: `Same shape-matching rule as any residual block.` }
        ],
        answer: `<p>The bottleneck (1&times;1 &rarr; 3&times;3 &rarr; 1&times;1) squeezes channels down for the costly 3&times;3 conv and expands them back, so deep ResNets like ResNet-50 spend far fewer FLOPs (Floating-Point Operations). The skip connection wraps the <i>whole</i> three-conv stack: input and output are both at the full channel count, so an identity (or 1&times;1 projection) shortcut matches and the residual sum still works.</p>`
      }
    ]
  });

  window.CODE["dl-resnet"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>A residual block and a tiny ResNet (Residual Network) from scratch in PyTorch. The key line is
      <code>out = self.relu(out + identity)</code> &mdash; the skip connection that implements
      $a^{[l+2]} = g(a^{[l]} + z^{[l+2]})$. We stack six residual blocks and train on a tiny synthetic
      3-class image set; the printed loss falls from ~1.86 to ~0.001 in 60 steps. torch is preinstalled in
      Colab &mdash; paste and run, no install needed.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# A residual block: two conv layers, then ADD the input back (the skip / shortcut).
class BasicBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.conv1 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn1   = nn.BatchNorm2d(channels)
        self.conv2 = nn.Conv2d(channels, channels, 3, padding=1, bias=False)
        self.bn2   = nn.BatchNorm2d(channels)
        self.relu  = nn.ReLU(inplace=True)

    def forward(self, x):
        identity = x                                 # the skip connection: a^[l]
        out = self.relu(self.bn1(self.conv1(x)))     # z^[l+1] -> a^[l+1]
        out = self.bn2(self.conv2(out))              # z^[l+2]
        out = self.relu(out + identity)              # a^[l+2] = g(a^[l] + z^[l+2])
        return out

# A tiny ResNet: stem -> stack of residual blocks -> global pool -> linear head.
class TinyResNet(nn.Module):
    def __init__(self, n_blocks=6, channels=16, n_classes=3):
        super().__init__()
        self.stem   = nn.Conv2d(3, channels, 3, padding=1, bias=False)
        self.blocks = nn.Sequential(*[BasicBlock(channels) for _ in range(n_blocks)])
        self.head   = nn.Linear(channels, n_classes)

    def forward(self, x):
        x = self.stem(x)
        x = self.blocks(x)
        x = x.mean(dim=(2, 3))                        # global average pool
        return self.head(x)

# Tiny synthetic "images": 3 classes, each a noisy constant-color 8x8 patch.
N, C, H, W, K = 240, 3, 8, 8, 3
y = torch.randint(0, K, (N,))
base = torch.tensor([[1., 0., 0.], [0., 1., 0.], [0., 0., 1.]])[y]
X = base[:, :, None, None] + 0.3 * torch.randn(N, C, H, W)

model = TinyResNet()
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.CrossEntropyLoss()

model.train()
for step in range(60):
    opt.zero_grad()
    loss = loss_fn(model(X), y)
    loss.backward()
    opt.step()
    if step % 10 == 0 or step == 59:
        acc = (model(X).argmax(1) == y).float().mean().item()
        print(f"step {step:2d}  loss {loss.item():.4f}  acc {acc:.3f}")

# step  0  loss 1.8582  acc 0.033
# step 10  loss 0.0324  acc 1.000
# step 20  loss 0.0103  acc 1.000
# step 30  loss 0.0038  acc 1.000
# step 40  loss 0.0019  acc 1.000
# step 50  loss 0.0012  acc 1.000
# step 59  loss 0.0010  acc 1.000`
  };

  window.CODEVIZ["dl-resnet"] = {
    question: "As a gradient back-propagates through a 50-layer network, does it survive to the early layers WITH vs WITHOUT skip connections?",
    charts: [
      {
        type: "line",
        title: "Gradient norm at each layer depth, 50-layer net: plain vs residual",
        xlabel: "layer depth (1 = first layer, near input)",
        ylabel: "gradient norm",
        series: [
          {
            name: "Plain",
            color: "#ff7b72",
            points: [[1,0.0],[2,0.0],[3,0.0],[4,0.0],[5,0.0],[6,0.0],[7,0.0],[8,0.0],[9,0.0],[10,0.0],[11,0.0],[12,0.0],[13,0.0],[14,0.0],[15,0.0],[16,0.0],[17,0.0],[18,0.0],[19,0.0],[20,0.0],[21,0.0],[22,0.0],[23,0.0],[24,0.0],[25,0.0],[26,0.0],[27,0.0],[28,0.0],[29,0.0],[30,0.0],[31,0.0],[32,0.0],[33,0.0],[34,0.0],[35,0.0],[36,0.0],[37,0.0],[38,0.0],[39,0.0],[40,0.0],[41,0.0],[42,0.0],[43,0.0],[44,0.0],[45,0.0],[46,0.0],[47,0.0005],[48,0.0061],[49,0.0789],[50,1.0]]
          },
          {
            name: "Residual",
            color: "#7ee787",
            points: [[1,1.099],[2,1.1106],[3,1.1128],[4,1.0955],[5,1.0994],[6,1.091],[7,1.0892],[8,1.0851],[9,1.0679],[10,1.0734],[11,1.0884],[12,1.0922],[13,1.0763],[14,1.0631],[15,1.0528],[16,1.0602],[17,1.0628],[18,1.0689],[19,1.0625],[20,1.043],[21,1.0259],[22,1.0251],[23,1.0326],[24,1.0206],[25,1.0312],[26,1.0284],[27,1.0575],[28,1.0516],[29,1.0335],[30,1.0467],[31,1.0465],[32,1.0391],[33,1.0315],[34,1.0325],[35,1.0272],[36,1.0303],[37,1.0289],[38,1.0417],[39,1.0413],[40,1.0242],[41,1.008],[42,0.9933],[43,0.9769],[44,0.9811],[45,0.9933],[46,0.9871],[47,0.9978],[48,1.0048],[49,1.0167],[50,1.0]]
          }
        ]
      }
    ],
    caption: "One real backward pass through a 50-layer linearized net (numpy), starting from a unit-norm gradient at the output (layer 50). PLAIN: each layer multiplies the back-flowing gradient by a sub-unit Jacobian (gain 0.15), so the norm collapses to ~0 by layer ~46 and the first 45 layers see essentially no gradient (the vanishing-gradient problem). RESIDUAL: the skip adds a '+1' to every layer's Jacobian, so the gradient passes through nearly undamped and the norm stays in [0.98, 1.11] all the way back to layer 1 &mdash; an O(1) highway. Same Jacobians in both runs; the only difference is the skip connection.",
    code: `import numpy as np

rng = np.random.default_rng(0)
L = 50              # depth: 50 layers
n = 64              # hidden width
gain = 0.15         # sub-unit per-layer gain -> plain net gradient vanishes

# Build per-layer Jacobian factors (network linearized around its operating point).
# Plain layer:    a_{l+1} = J_l @ a_l            -> backward multiplies by J^T (gain<1)
# Residual layer: a_{l+1} = a_l + J_l @ a_l      -> backward multiplies by (I + J^T): the +1
# Use the SAME J_l for both runs so the only difference is the skip connection.
Js = []
for _ in range(L):
    A = rng.standard_normal((n, n))
    A = A / np.linalg.norm(A, 2)     # spectral norm 1
    Js.append(gain * A)

g0 = rng.standard_normal(n); g0 /= np.linalg.norm(g0)   # unit-norm gradient at the output
plain, resid = [], []
gp, gr = g0.copy(), g0.copy()
for l in reversed(range(L)):          # back-prop from output (layer L) to input (layer 1)
    plain.append(np.linalg.norm(gp))
    resid.append(np.linalg.norm(gr))
    gp = Js[l].T @ gp                 # plain: chain-rule product of Jacobians
    gr = gr + Js[l].T @ gr            # residual: (I + J^T) keeps the "+1" highway
plain.reverse(); resid.reverse()      # index 0 -> layer 1 (input side)

depths = np.arange(1, L + 1)
print("Plain   :", [[int(d), round(float(p), 4)] for d, p in zip(depths, plain)])
print("Residual:", [[int(d), round(float(r), 4)] for d, r in zip(depths, resid)])
# Plain    -> norm decays to ~0.0 by depth ~46, spiking only at the output (depth 50)
# Residual -> norm stays in [0.98, 1.11] across all 50 layers`
  };
})();
