(function () {
  window.LESSONS.push({
    id: "dl-receptive-field",
    title: "The receptive field of a CNN",
    tagline: "How big a patch of the original image one deep output neuron actually sees.",
    module: "Deep Learning",
    prereqs: ["dl-conv", "dl-conv-hyperparams", "dl-pooling", "dl-cnn-params"],
    whenToUse:
      `<p><b>Reach for the receptive-field idea whenever you need to know how much of the input one output neuron depends on.</b> The <b>receptive field</b> of a neuron is the patch of the ORIGINAL input image that can change its value. It tells you whether a layer can "see" enough context to make its decision.</p>
       <p><b>Use it to:</b></p>
       <ul>
         <li><b>Decide network depth.</b> If the object you want to recognize spans 50 pixels but your output neuron only sees a 25-pixel patch, no amount of training fixes that — you need more layers, larger strides, or dilation.</li>
         <li><b>Justify small filters.</b> It explains why modern CNNs (Convolutional Neural Networks) stack 3×3 filters instead of using one big filter.</li>
         <li><b>Place strides and pooling.</b> A stride or pool early in the network multiplies the receptive-field growth of every later layer.</li>
       </ul>
       <p><b>Pick a different lens when:</b> you care about output spatial <i>size</i> (use the conv output-size formula), or about parameter <i>cost</i> (count parameters). Receptive field is about <i>context</i>, not size or cost.</p>`,
    application:
      `<p>Receptive-field reasoning drives real architecture choices: VGG (Visual Geometry Group net) replaced 5×5 and 7×7 filters with stacks of 3×3; segmentation networks use <b>dilated (atrous) convolutions</b> to grow the receptive field without losing resolution; and detectors size their layers so the deepest features see whole objects. When a model misses large-scale structure, "the receptive field is too small" is often the diagnosis.</p>`,
    pitfalls:
      `<ul>
         <li><b>Receptive field too small for the task.</b> Deep features that only see a tiny patch cannot reason about global structure. Add depth, strides, or dilation to grow it.</li>
         <li><b>Confusing receptive field with output size.</b> Output size is how many neurons the map has; receptive field is how much input each one sees. They follow different formulas.</li>
         <li><b>Forgetting strides multiply.</b> A stride of 2 does not just shrink the map — it doubles the input step of every <i>later</i> layer, so it multiplies their receptive-field contribution. People underestimate how fast a strided net grows its receptive field.</li>
         <li><b>Assuming all of the receptive field matters equally.</b> The <i>effective</i> receptive field is smaller and Gaussian-shaped: center pixels influence the output far more than the edges. The formula gives the theoretical maximum, not the effective one.</li>
         <li><b>Padding ignored in the count.</b> Padding changes output size but not the receptive-field <i>growth</i> per layer; do not let "same" padding fool you into thinking the receptive field is bigger than it is.</li>
       </ul>`,
    bigIdea:
      `<p>Pick one number in a deep feature map. Ask: which input pixels, if you changed them, would change this number? That set of input pixels is its <b>receptive field</b>.</p>
       <p>Each convolutional layer's filter looks at a small window, but that window sits on the previous layer's neurons — which themselves looked at windows of the layer before. So as you stack layers, the patch of the ORIGINAL input that one neuron depends on keeps growing.</p>
       <p>The receptive field grows <b>additively</b> with depth, and each <b>stride</b> earlier in the net <b>multiplies</b> how fast later layers add to it.</p>`,
    buildup:
      `<p>Layer 1, a 3×3 filter: each output sees a 3×3 patch of the input. Receptive field = 3.</p>
       <p>Layer 2, another 3×3 filter on top: each output combines a 3×3 patch of <i>layer-1</i> neurons. But each of those already sees 3×3 input pixels, and neighbours overlap by one step, so the combined input patch is 5×5. Receptive field = 5.</p>
       <p>Every extra 3×3 stride-1 layer adds 2 more (one on each side): 3, 5, 7, 9, ... — linear growth. Now insert a stride-2 layer: it makes each step on the input twice as wide, so every later layer's contribution is doubled. The growth speeds up.</p>`,
    symbols: [
      { sym: "$R_k$", desc: "the receptive field at layer $k$: the side length, in original-input pixels, of the patch one neuron at layer $k$ depends on." },
      { sym: "$F_j$", desc: "the filter (kernel) size of layer $j$ — e.g. $3$ for a $3\\times3$ filter." },
      { sym: "$S_i$", desc: "the stride of layer $i$ — how many input pixels the filter moves between positions. Convention $S_0 = 1$." },
      { sym: "$\\sum_{j=1}^{k}$", desc: "add up the contribution of every layer from the first up to layer $k$." },
      { sym: "$\\prod_{i=0}^{j-1} S_i$", desc: "multiply the strides of all layers BEFORE $j$ — the cumulative downsampling that scales layer $j$'s contribution." }
    ],
    formula: `$$ R_k = 1 + \\sum_{j=1}^{k} (F_j - 1)\\prod_{i=0}^{j-1} S_i $$`,
    whatItDoes:
      `<p>It computes the side length, in original-input pixels, of the patch that one neuron at layer $k$ can see. Start from a single pixel (the $1$). For each layer $j$, the filter adds $F_j - 1$ to the patch (a $3\\times3$ filter adds $2$). That contribution is scaled by the product of every earlier layer's stride — because each earlier stride stretches the spacing of the input pixels this layer reaches.</p>
       <p>The convention $S_0 = 1$ just makes the first layer's product empty (equal to $1$), so layer $1$ contributes its raw $F_1 - 1$.</p>`,
    derivation:
      `<p><b>Why additive.</b> Let $r$ be the receptive field of a neuron at the previous layer and let $g$ be the "jump" — how many input pixels apart two adjacent previous-layer neurons are. A new $F$-wide filter combines $F$ such neurons, spaced $g$ apart. The leftmost reaches back $r$ pixels; each extra filter tap reaches $g$ more. So the new receptive field is</p>
       <p>$$ r_{\\text{new}} = r + (F - 1)\\,g. $$</p>
       <p><b>Why the jump is a product of strides.</b> Each layer with stride $S$ multiplies the spacing of its outputs by $S$. Starting from $g = 1$ at the input, after layers $1..j-1$ the jump is $g = \\prod_{i=0}^{j-1} S_i$ (with $S_0 = 1$). Plugging this jump into the update for each layer $j$ and summing from $1$ to $k$, starting at a single pixel ($r=1$):</p>
       <p>$$ R_k = 1 + \\sum_{j=1}^{k} (F_j - 1)\\prod_{i=0}^{j-1} S_i. $$</p>
       <p><b>Two 3×3 versus one 5×5.</b> Set $F_1 = F_2 = 3$, $S_1 = S_2 = 1$. Then $R_2 = 1 + (3-1)\\cdot 1 + (3-1)\\cdot 1 = 5$ — the same receptive field as a single $5\\times5$ filter. But two $3\\times3$ filters cost $2\\times(3{\\cdot}3) = 18$ weights per channel pair, versus $5{\\cdot}5 = 25$ for the $5\\times5$ — fewer parameters, plus an extra nonlinearity in between. That is exactly why deep nets stack small filters.</p>`,
    example:
      `<p>The cheat-sheet's own example. Two stacked $3\\times3$ filters, both stride $1$: $F_1 = F_2 = 3$, $S_1 = S_2 = 1$.</p>
       <ul class="steps">
         <li>Layer 1: $(F_1 - 1)\\prod_{i=0}^{0} S_i = 2 \\cdot 1 = 2$.</li>
         <li>Layer 2: $(F_2 - 1)\\prod_{i=0}^{1} S_i = 2 \\cdot (S_0 S_1) = 2 \\cdot (1\\cdot 1) = 2$.</li>
         <li>Add to the starting pixel: $R_2 = 1 + 2\\cdot 1 + 2\\cdot 1 = 5$.</li>
       </ul>
       <p>So two $3\\times3$ stride-1 layers see a $5\\times5$ input patch — matching one $5\\times5$ filter, with fewer weights.</p>`,
    practice: [
      {
        q: `You stack three $3\\times3$ stride-1 convolutional layers. What is the receptive field at layer 3?`,
        steps: [
          { do: `Each $3\\times3$ stride-1 layer contributes $(F-1)\\prod S_i = 2\\cdot 1 = 2$.`, why: `All strides are 1, so every product is 1; each layer adds $F-1 = 2$.` },
          { do: `Sum three contributions and add the starting pixel: $1 + 2 + 2 + 2$.`, why: `The formula starts at 1 (a single pixel) and adds each layer's term.` }
        ],
        answer: `<p>$R_3 = 1 + 2 + 2 + 2 = 7$. Three stacked $3\\times3$ stride-1 layers match a single $7\\times7$ filter's receptive field.</p>`
      },
      {
        q: `Layer 1 is $3\\times3$ stride 2; layer 2 is $3\\times3$ stride 1. What is $R_2$, and why is it bigger than the all-stride-1 case ($R_2 = 5$)?`,
        steps: [
          { do: `Layer 1: $(3-1)\\prod_{i=0}^{0} S_i = 2 \\cdot S_0 = 2 \\cdot 1 = 2$.`, why: `The product before layer 1 is empty, equal to $S_0 = 1$.` },
          { do: `Layer 2: $(3-1)\\prod_{i=0}^{1} S_i = 2 \\cdot (S_0 S_1) = 2 \\cdot (1\\cdot 2) = 4$.`, why: `Layer 1's stride of 2 now multiplies layer 2's contribution.` },
          { do: `Add: $1 + 2 + 4$.`, why: `Start at one pixel, add both layer terms.` }
        ],
        answer: `<p>$R_2 = 1 + 2 + 4 = 7$. The early stride of 2 doubled layer 2's reach, so the receptive field grew faster than the all-stride-1 value of 5.</p>`
      },
      {
        q: `Your deepest feature must see a $32\\times32$ object, but it currently sees only a $17\\times17$ patch. Name two cheap ways to grow the receptive field without adding many parameters.`,
        steps: [
          { do: `Add a stride (or pooling) layer.`, why: `A stride multiplies the contribution of all later layers, so the receptive field grows much faster per added layer.` },
          { do: `Use dilated (atrous) convolutions.`, why: `Dilation spreads the same $F$ filter taps over a wider input span, enlarging $F-1$'s effective reach with no extra weights.` }
        ],
        answer: `<p>Insert a strided/pooling layer (multiplies later layers' growth) and/or switch some layers to <b>dilated convolutions</b> (wider reach at the same parameter count). Both grow the receptive field cheaply; adding plain stride-1 layers grows it only linearly.</p>`
      }
    ]
  });

  window.CODE["dl-receptive-field"] = {
    lib: "NumPy",
    runnable: false,
    explain: `<p>A direct implementation of the receptive-field recursion. We pass a list of <code>(filter, stride)</code> per layer and apply $R \\leftarrow R + (F-1)\\cdot \\text{jump}$, then grow the jump by the layer's stride. We run it on a real small stack: three $3\\times3$ stride-1 layers followed by a $3\\times3$ stride-2 layer, and print the receptive field after each layer.</p>`,
    code: `import numpy as np

def receptive_field(layers):
    """layers: list of (filter_size F, stride S) per layer.
    Returns the receptive field after each layer using the recursion
        R <- R + (F - 1) * jump,   jump <- jump * S
    where 'jump' = product of all earlier strides (starts at 1, since S0 = 1).
    """
    R = 1          # one pixel sees itself
    jump = 1       # spacing between adjacent neurons, in input pixels (S0 = 1)
    out = []
    for (F, S) in layers:
        R = R + (F - 1) * jump   # this layer adds (F-1) scaled by the cumulative stride
        jump = jump * S          # later layers now step 'S' times wider
        out.append(R)
    return np.array(out)

# real small stack: three 3x3 stride-1 layers, then a 3x3 stride-2 layer
stack = [(3, 1), (3, 1), (3, 1), (3, 2)]
rf = receptive_field(stack)

for k, ((F, S), R) in enumerate(zip(stack, rf), start=1):
    print("layer %d: %dx%d stride %d  ->  receptive field = %d" % (k, F, F, S, R))

# sanity check: cheat-sheet example F1=F2=3, S1=S2=1 gives R2 = 5
print("check two 3x3 stride-1 layers, R2 =", receptive_field([(3, 1), (3, 1)])[-1])`
  };

  window.CODEVIZ["dl-receptive-field"] = {
    question: "How fast does the receptive field grow with depth — for an all-stride-1 3x3 net versus one with a few stride-2 layers?",
    charts: [{
      type: "line",
      title: "Receptive field vs depth: all-stride-1 vs strided 3x3 nets",
      xlabel: "layer depth k",
      ylabel: "receptive field (input pixels)",
      series: [
        {
          name: "all 3x3 stride-1 (linear)",
          color: "#4ea1ff",
          points: [[1, 3], [2, 5], [3, 7], [4, 9], [5, 11], [6, 13], [7, 15], [8, 17], [9, 19], [10, 21], [11, 23], [12, 25]]
        },
        {
          name: "3x3 with stride-2 at layers 3,6,9 (faster)",
          color: "#ff7b72",
          points: [[1, 3], [2, 5], [3, 7], [4, 11], [5, 15], [6, 19], [7, 27], [8, 35], [9, 43], [10, 59], [11, 75], [12, 91]]
        }
      ]
    }],
    caption: "Both nets use 3x3 filters. The all-stride-1 net grows the receptive field linearly (3, 5, 7, ... 25). Adding a stride-2 layer at depths 3, 6, and 9 multiplies every later layer's contribution, so the receptive field reaches 91 pixels by layer 12 instead of 25 — far cheaper context than stacking stride-1 layers.",
    code: `import numpy as np

def receptive_field(layers):
    R, jump = 1, 1                 # R0 = 1 pixel, jump = product of earlier strides (S0 = 1)
    out = []
    for (F, S) in layers:
        R = R + (F - 1) * jump     # additive growth, scaled by cumulative stride
        jump = jump * S
        out.append(R)
    return np.array(out)

depth = 12
arch_a = [(3, 1)] * depth                                   # all 3x3 stride-1
arch_b = [(3, 2 if k in (3, 6, 9) else 1) for k in range(1, depth + 1)]  # stride-2 at 3,6,9

ra = receptive_field(arch_a)
rb = receptive_field(arch_b)
layers = np.arange(1, depth + 1)

print("layer :", layers.tolist())
print("all s1:", ra.tolist())     # [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]
print("strided:", rb.tolist())    # [3, 5, 7, 11, 15, 19, 27, 35, 43, 59, 75, 91]`
  };
})();
