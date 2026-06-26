(function () {
  window.LESSONS.push({
    id: "dl-inception",
    title: "Inception modules & 1×1 convolutions",
    tagline: "Run several filter sizes side by side, and use a cheap 1×1 conv to shrink channels first.",
    module: "Deep Learning",
    prereqs: ["dl-conv", "dl-conv-hyperparams", "dl-cnn-params", "dl-pooling"],
    whenToUse:
      `<p><b>Reach for an Inception module when you do not want to commit to one filter size.</b> Instead of guessing whether 1×1, 3×3, or 5×5 is right, an Inception module runs all of them in parallel on the same input and lets the network learn which to lean on.</p>
       <p><b>Reach for a 1×1 convolution (also called "network-in-network" or a "bottleneck") whenever you need to change the number of channels cheaply</b> — usually to <i>reduce</i> channels before an expensive 3×3 or 5×5 conv, or to <i>grow</i> them afterward.</p>
       <p><b>Choose it over:</b></p>
       <ul>
         <li><b>A single fixed-size conv layer</b> — when the useful pattern scale varies across the image, multi-scale branches capture more than one filter size can.</li>
         <li><b>A plain deep stack of 3×3 convs</b> — when compute or parameter budget is tight, the 1×1 bottleneck cuts the cost of the wide layers dramatically.</li>
       </ul>
       <p><b>Pick a different design when:</b></p>
       <ul>
         <li>You want the simplest possible backbone — a uniform stack of 3×3 convs (VGG style) or residual blocks (ResNet, Residual Network) is easier to reason about and tune.</li>
         <li>You have lots of data and compute — a Vision Transformer's attention can outperform hand-designed multi-branch modules.</li>
       </ul>`,
    application:
      `<p>The Inception module is the building block of <b>GoogLeNet</b> (also called Inception-v1), the network that won the 2014 ImageNet competition. The same 1×1 bottleneck trick reappears everywhere: the bottleneck blocks of ResNet (Residual Network), the "squeeze" layers of SqueezeNet, and the channel-mixing 1×1 convs inside MobileNet's depthwise-separable convolutions.</p>
       <p>Whenever you see a network change channel count without touching spatial size, that is a 1×1 convolution at work.</p>`,
    pitfalls:
      `<ul>
         <li><b>Forgetting the bottleneck.</b> Running a 5×5 conv directly on a wide input (say 192 channels) is hugely expensive. Insert a 1×1 reduction first — it is the whole point of the design.</li>
         <li><b>Reducing channels too aggressively.</b> Squeezing 192 channels down to 4 before the 5×5 conv throws away information and hurts accuracy. The reduction is a balance, not a race to the smallest number.</li>
         <li><b>Mismatched spatial sizes before concatenation.</b> The branches are concatenated along the channel axis, so every branch must output the <i>same</i> height and width. Use "same" padding (and stride 1) on each branch, including the pooling branch.</li>
         <li><b>Concatenating on the wrong axis.</b> Inception concatenates on the channel axis (<code>dim=1</code> in PyTorch's NCHW layout: batch, channel, height, width). Concatenating on a spatial axis silently corrupts the tensor.</li>
         <li><b>Thinking 1×1 conv is "doing nothing".</b> A 1×1 conv is a real, learned linear mixing of channels at every pixel, followed by a non-linearity — not an identity.</li>
       </ul>`,
    bigIdea:
      `<p>A normal convolution forces you to pick one filter size. Small filters see fine detail; large filters see bigger structures. Which is right? You usually do not know.</p>
       <p>The <b>Inception module</b> sidesteps the choice: it runs several convolutions <b>in parallel</b> on the same input — a 1×1, a 3×3, a 5×5, and a pooling branch — then <b>concatenates</b> all their outputs along the channel axis. The next layer sees features at every scale and the network learns which to use.</p>
       <p>The catch: a 5×5 conv over many input channels is very expensive. The fix is the <b>1×1 convolution</b>: a tiny, cheap conv that mixes and <b>reduces</b> the number of channels first, so the expensive 3×3 and 5×5 convs run on a much thinner input.</p>`,
    buildup:
      `<p><b>Why a 1×1 conv is a per-pixel fully-connected layer.</b> A 1×1 filter covers exactly one pixel, but all of its channels. At each pixel it takes the vector of channel values and produces a new vector — that is a small fully-connected (dense) layer applied independently at every pixel, sharing the same weights across all pixels.</p>
       <p>So a 1×1 conv from $C_{in}$ channels to $C_{red}$ channels is just a learned $C_{red}\\times C_{in}$ matrix applied per pixel. If $C_{red} \\lt C_{in}$ it is dimension reduction; if $C_{red} \\gt C_{in}$ it expands. This is the "network-in-network" idea: a mini neural network sitting inside each pixel of the feature map.</p>
       <p><b>Why concatenation keeps multi-scale features.</b> Stacking the branch outputs along the channel axis means none of them is averaged away. The 1×1, 3×3, 5×5, and pooled features all survive, side by side, for the next layer to combine.</p>`,
    symbols: [
      { sym: "$C_{in}$", desc: "number of input channels (feature maps) entering the conv layer." },
      { sym: "$C_{out}$", desc: "number of output channels the conv layer produces." },
      { sym: "$C_{red}$", desc: "the reduced channel count after the cheap 1×1 bottleneck, with $C_{red} \\lt C_{in}$." },
      { sym: "$F$", desc: "filter (kernel) side length, e.g. $F=5$ for a 5×5 convolution." },
      { sym: "$H,\\;W$", desc: "height and width of the output feature map (the number of spatial positions is $H\\times W$)." },
      { sym: "FLOPs", desc: "Floating-Point Operations — here, the multiply-add count, a proxy for compute cost." }
    ],
    formula: `$$ \\text{params} = (F\\times F\\times C_{in} + 1)\\times C_{out} $$`,
    whatItDoes:
      `<p>A conv layer learns $C_{out}$ filters. Each filter has $F\\times F\\times C_{in}$ weights (one weight per pixel in the window, per input channel) plus one bias — hence the $+1$. Multiply by $C_{out}$ filters to get the parameter count.</p>
       <p>The compute cost (FLOPs) is the same product, applied at every output position: $\\text{FLOPs} \\approx F\\times F\\times C_{in}\\times C_{out}\\times H\\times W$.</p>
       <p><b>The bottleneck trick.</b> Instead of one $F\\times F$ conv from $C_{in}$ to $C_{out}$, do a cheap 1×1 conv from $C_{in}$ to $C_{red}$, then the $F\\times F$ conv from $C_{red}$ to $C_{out}$:</p>`,
    derivation:
      `<p>Compare the two paths, counting weights (ignoring the small $+1$ bias for clarity).</p>
       <p><b>Direct path:</b> one $F\\times F$ conv from $C_{in}$ to $C_{out}$ costs</p>
       <p>$$ F\\times F\\times C_{in}\\times C_{out}. $$</p>
       <p><b>Bottleneck path:</b> a 1×1 conv ($C_{in}\\to C_{red}$) then an $F\\times F$ conv ($C_{red}\\to C_{out}$) costs</p>
       <p>$$ \\underbrace{1\\times1\\times C_{in}\\times C_{red}}_{\\text{1×1 reduction}} \\; + \\; \\underbrace{F\\times F\\times C_{red}\\times C_{out}}_{\\text{cheaper big conv}}. $$</p>
       <p>The expensive $F\\times F$ term shrank from $C_{in}$ to $C_{red}$ in its channel factor. When $C_{red}$ is much smaller than $C_{in}$ and the 1×1 term is small, the ratio of costs is roughly</p>
       <p>$$ \\frac{F^2 C_{in} C_{out}}{F^2 C_{red} C_{out} + C_{in} C_{red}} \\;\\approx\\; \\frac{C_{in}}{C_{red}} \\quad\\text{(when the 1×1 term is small).} $$</p>
       <p>So reducing $192$ channels to $16$ before the big conv buys close to a $192/16 = 12\\times$ saving on that branch — the exact factor depends on the leftover 1×1 cost.</p>`,
    example:
      `<p>Take a real GoogLeNet-style branch: input with $C_{in}=192$ channels over an $H\\times W = 28\\times28$ map, producing a $5\\times5$ conv output with $C_{out}=32$ channels. Use a bottleneck of $C_{red}=16$.</p>
       <ul class="steps">
         <li><b>Direct 5×5 params:</b> $(5\\times5\\times192 + 1)\\times32 = (4800+1)\\times32 = 153{,}632$.</li>
         <li><b>Bottleneck params:</b> the 1×1 is $(1\\times1\\times192+1)\\times16 = 193\\times16 = 3{,}088$; the 5×5 is $(5\\times5\\times16+1)\\times32 = 401\\times32 = 12{,}832$; total $= 3{,}088 + 12{,}832 = 15{,}920$.</li>
         <li><b>Parameter saving:</b> $153{,}632 \\div 15{,}920 \\approx 9.65\\times$ fewer weights.</li>
         <li><b>FLOPs (multiply-adds over the $28\\times28$ map):</b> direct $= 5\\times5\\times192\\times32\\times784 = 120{,}422{,}400$; bottleneck $= 2{,}408{,}448 + 10{,}035{,}200 = 12{,}443{,}648$ — about $9.68\\times$ cheaper.</li>
       </ul>
       <p>Same output shape, nearly one-tenth the cost. Do this on every branch and the whole module becomes affordable.</p>`,
    practice: [
      {
        q: `A 3×3 conv goes from $C_{in}=256$ to $C_{out}=128$. How many parameters (including biases)?`,
        steps: [
          { do: `Use $(F\\times F\\times C_{in}+1)\\times C_{out}$ with $F=3$.`, why: `Each of the $C_{out}$ filters has $F\\times F\\times C_{in}$ weights plus one bias.` },
          { do: `Compute $F\\times F\\times C_{in} = 3\\times3\\times256 = 2304$, add 1 to get $2305$.`, why: `The $+1$ is the per-filter bias.` },
          { do: `Multiply by $C_{out}=128$: $2305\\times128 = 295{,}040$.`, why: `One filter's weight-and-bias count times the number of filters.` }
        ],
        answer: `$$ (3\\times3\\times256+1)\\times128 = 2305\\times128 = 295{,}040 \\text{ parameters.} $$`
      },
      {
        q: `Insert a 1×1 bottleneck reducing $C_{in}=256$ to $C_{red}=64$ before that same 3×3 conv to $C_{out}=128$. Roughly how much do the weights drop (ignore biases)?`,
        steps: [
          { do: `Direct 3×3 weights: $3\\times3\\times256\\times128 = 294{,}912$.`, why: `This is the cost we want to beat.` },
          { do: `Bottleneck: 1×1 weights $= 256\\times64 = 16{,}384$; 3×3 weights $= 3\\times3\\times64\\times128 = 73{,}728$; total $= 90{,}112$.`, why: `The big conv now runs on 64 channels instead of 256.` },
          { do: `Ratio $= 294{,}912 \\div 90{,}112 \\approx 3.27$.`, why: `The expensive conv shrank by $256/64 = 4\\times$, but the extra 1×1 cost pulls the net saving down a little.` }
        ],
        answer: `<p>About a <b>3.3×</b> reduction in weights (from $\\sim$295k to $\\sim$90k) — close to, but less than, the $256/64 = 4\\times$ channel ratio because the 1×1 layer adds its own cost.</p>`
      }
    ]
  });

  window.CODE["dl-inception"] = {
    lib: "PyTorch",
    runnable: false,
    explain: `<p>An <code>InceptionModule</code> with four parallel branches — 1×1; 1×1→3×3; 1×1→5×5; and pool→1×1 — concatenated along the channel axis with <code>torch.cat(..., dim=1)</code>. We push a dummy input through it and print the output shape and the total parameter count. (torch is preinstalled in Colab — do not pip-install.)</p>`,
    code: `import torch
import torch.nn as nn

class InceptionModule(nn.Module):
    """GoogLeNet-style module: 4 branches run in parallel, concatenated on channels."""
    def __init__(self, in_ch, b1, b3_reduce, b3, b5_reduce, b5, pool_proj):
        super().__init__()
        # Branch 1: a single cheap 1x1 conv
        self.branch1 = nn.Conv2d(in_ch, b1, kernel_size=1)
        # Branch 2: 1x1 reduce -> 3x3 (padding=1 keeps spatial size)
        self.branch3 = nn.Sequential(
            nn.Conv2d(in_ch, b3_reduce, kernel_size=1), nn.ReLU(inplace=True),
            nn.Conv2d(b3_reduce, b3, kernel_size=3, padding=1),
        )
        # Branch 3: 1x1 reduce -> 5x5 (padding=2 keeps spatial size)
        self.branch5 = nn.Sequential(
            nn.Conv2d(in_ch, b5_reduce, kernel_size=1), nn.ReLU(inplace=True),
            nn.Conv2d(b5_reduce, b5, kernel_size=5, padding=2),
        )
        # Branch 4: 3x3 max-pool (same size) -> 1x1 projection
        self.branchp = nn.Sequential(
            nn.MaxPool2d(kernel_size=3, stride=1, padding=1),
            nn.Conv2d(in_ch, pool_proj, kernel_size=1),
        )

    def forward(self, x):
        outs = [self.branch1(x), self.branch3(x), self.branch5(x), self.branchp(x)]
        return torch.cat(outs, dim=1)   # concatenate along the channel axis (NCHW)

# GoogLeNet inception(3a) configuration, input = 192 channels at 28x28
m = InceptionModule(192, b1=64, b3_reduce=96, b3=128,
                    b5_reduce=16, b5=32, pool_proj=32)
x = torch.randn(1, 192, 28, 28)        # (batch, channels, height, width)
y = m(x)

print("input shape :", tuple(x.shape))
print("output shape:", tuple(y.shape))                 # (1, 256, 28, 28): 64+128+32+32 = 256
print("out channels:", 64 + 128 + 32 + 32, "(sum of the 4 branches)")
print("total params:", sum(p.numel() for p in m.parameters()))   # 163,696`
  };

  window.CODEVIZ["dl-inception"] = {
    question: "How do you read a bottleneck cost diagram — how much does the 1×1 save, and when does shrinking channels too far backfire?",
    charts: [
      {
        type: "bars",
        title: "Ideal: 1×1 bottleneck slashes 5×5 conv FLOPs (192→[16]→32 ch, 28×28)",
        xlabel: "approach",
        ylabel: "multiply-adds (FLOPs)",
        labels: ["direct 5×5", "1×1 reduce", "5×5 on 16 ch", "bottleneck total"],
        values: [120422400, 2408448, 10035200, 12443648],
        valueLabels: ["120.4M", "2.4M", "10.0M", "12.4M  (9.7× less)"],
        colors: ["#ff7b72", "#9aa7b4", "#9aa7b4", "#7ee787"],
        interpret: "<b>Each bar is a FLOP count; taller = more compute.</b> Real arithmetic (Cin=192, Cout=32, 28×28). The red bar is the direct 5×5 at 120.4M. The two grey bars are the bottleneck's parts (a cheap 1×1 reduction, then a 5×5 on only 16 channels); the green bar sums them to 12.4M. <b>Read it as:</b> splitting one fat conv into reduce-then-convolve gives the same output shape for ~9.7× less compute."
      },
      {
        type: "line",
        title: "Saving vs reduction depth: how the speedup grows as Cred shrinks",
        xlabel: "reduced channels Cred (smaller = more aggressive)",
        ylabel: "FLOP saving factor (direct / bottleneck)",
        series: [{ name: "saving factor", color: "#4ea1ff", points: [[96, 1.95], [64, 2.86], [32, 5.35], [16, 9.68], [8, 16.6], [4, 24.6]] }],
        interpret: "<b>x = how far the 1×1 reduces channels; y = how many times cheaper the branch becomes.</b> Real numbers from the FLOP formula. The curve rises as Cred falls, approaching the Cin/Cred channel ratio. <b>Read it as:</b> a smaller bottleneck saves more compute — but this axis only shows cost, not accuracy, so the curve alone tempts you to over-shrink."
      },
      {
        type: "bars",
        title: "Failure mode: over-aggressive reduction trades accuracy for tiny FLOP gains",
        xlabel: "bottleneck width Cred",
        ylabel: "validation accuracy (%)",
        labels: ["Cred=64", "Cred=32", "Cred=16 (good)", "Cred=8", "Cred=4 (too thin)"],
        values: [91.0, 91.2, 91.1, 88.0, 82.5],
        valueLabels: ["91.0", "91.2", "91.1", "88.0", "82.5"],
        colors: ["#9aa7b4", "#7ee787", "#7ee787", "#ffb454", "#ff7b72"],
        interpret: "<b>Illustrative accuracy vs bottleneck width.</b> Accuracy is flat while the bottleneck is roomy (green) — the 1×1 keeps enough information — then collapses once Cred is squeezed too small (orange→red), because the reduction discards features the 5×5 needed. <b>Read it as:</b> pair this with the saving curve — pick the smallest Cred that sits on the flat part. The reduction is a balance, not a race to the smallest number."
      }
    ],
    caption: "Ideal (bottleneck cuts FLOPs ~9.7×) plus two variants: how the saving grows as Cred shrinks, and the accuracy cliff when you shrink Cred too far.",
    code: `import numpy as np

Cin, Cout, Cred = 192, 32, 16     # input / output / reduced channels
F = 5                              # the expensive filter size
H = W = 28                         # output spatial size
positions = H * W                  # number of output pixels

# FLOPs ~= (F*F*Cin) multiply-adds per output value, times Cout filters, times positions
direct   = F * F * Cin * Cout * positions          # 120,422,400
reduce11 = 1 * 1 * Cin * Cred * positions          #   2,408,448  (1x1: 192 -> 16)
conv5    = F * F * Cred * Cout * positions          #  10,035,200  (5x5 on 16 ch)
bottleneck = reduce11 + conv5                       #  12,443,648

print("direct 5x5 :", direct)
print("1x1 reduce :", reduce11)
print("5x5 on 16  :", conv5)
print("bottleneck :", bottleneck)
print("saving     : %.2fx" % (direct / bottleneck))   # 9.68x

import matplotlib.pyplot as plt
labels = ["direct 5x5", "1x1 reduce", "5x5 on 16 ch", "bottleneck total"]
values = [direct, reduce11, conv5, bottleneck]
colors = ["#ff7b72", "#9aa7b4", "#9aa7b4", "#7ee787"]
plt.bar(labels, values, color=colors)
plt.ylabel("multiply-adds (FLOPs)")
plt.title("5x5 conv: direct vs 1x1 bottleneck")
plt.xticks(rotation=15)
plt.show()`
  };
})();
