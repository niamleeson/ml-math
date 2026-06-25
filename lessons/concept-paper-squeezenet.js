/* Paper lesson — "SqueezeNet: AlexNet-level accuracy with 50x fewer parameters and <0.5MB model size",
   Iandola, Han, Moskewicz, Ashraf, Dally, Keutzer, 2016.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-squeezenet".
   GROUNDED from arXiv:1602.07360 (abstract) and the ar5iv HTML mirror
   (Sect. 3.1 three design strategies; Sect. 3.2 the Fire module: squeeze 1x1 layer feeding an expand
   layer that mixes 1x1 and 3x3 filters, hyperparameters s_1x1 / e_1x1 / e_3x3; Sect. 5.2 squeeze ratio
   SR; Table 2 SqueezeNet vs AlexNet model size and accuracy).
   Track B (architecture): build the Fire module from nn.Conv2d, show a Fire-module net hits near-equal
   accuracy to a plain-conv net at FAR fewer parameters on a tiny image task, and ABLATE the squeeze
   ratio. Every CODEVIZ number is from our own small CPU run — not the paper's reported figures. */
(function () {
  window.LESSONS.push({
    id: "paper-squeezenet",
    title: "SqueezeNet — AlexNet-level accuracy with 50x fewer parameters (2016)",
    tagline: "Squeeze channels down with a 1×1 conv, then expand back out with a cheap mix of 1×1 and 3×3 convs — a tiny net that matches a big one.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Forrest N. Iandola, Song Han, Matthew W. Moskewicz, Khalid Ashraf, William J. Dally, Kurt Keutzer",
      org: "DeepScale, UC Berkeley, and Stanford University",
      year: 2016,
      venue: "arXiv:1602.07360 (cs.CV; ICLR 2017 submission)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1602.07360",
      url: "https://arxiv.org/abs/1602.07360",
      code: "https://github.com/forresti/SqueezeNet"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-conv", "dl-conv-hyperparams", "pt-cnn", "pt-nn-module", "dl-batchnorm", "dl-activations", "paper-mobilenet"],

    // WHY READ IT
    problem:
      `<p>By 2016 most deep-network research chased one thing: higher accuracy. A <b>deep neural network</b>
       (a "DNN" &mdash; many stacked layers of learned filters) like <b>AlexNet</b> (the 2012 network that won
       the ImageNet image-classification contest) reached good accuracy but carried about <b>60&nbsp;million
       parameters</b> &mdash; a "parameter" is a single learned number (a weight) the network stores and tunes.
       Storing all of them made the saved model around <b>240&nbsp;megabytes</b> (MB; a megabyte is a million
       bytes). This paper (&sect;1) asks a different question: <i>for a fixed accuracy, how SMALL can the network
       be?</i></p>
       <p>The paper lists three reasons a smaller network helps (&sect;1): (1) less data to send between
       machines during training, (2) less bandwidth to push a fresh model from the cloud to a device such as a
       self-driving car, and (3) it fits on hardware with little memory, like a <b>field-programmable gate
       array</b> (FPGA &mdash; a reconfigurable chip with a small on-chip memory). The goal: keep the accuracy,
       shrink the parameter count by a large factor.</p>`,
    contribution:
      `<ul>
        <li><b>The Fire module</b> (&sect;3.2) &mdash; a small reusable building block. It first <b>squeezes</b>
        the channel count with a layer of $1\\times1$ convolutions, then <b>expands</b> it back out with a mix of
        $1\\times1$ and $3\\times3$ convolutions whose outputs are concatenated. A "channel" is one feature map
        (one filtered version of the image); "squeezing" means temporarily using fewer of them.</li>
        <li><b>Three design strategies</b> (&sect;3.1) for spending parameters wisely: prefer $1\\times1$ filters,
        feed the expensive $3\\times3$ filters as few input channels as possible, and downsample late so layers
        keep large feature maps (which helps accuracy).</li>
        <li><b>A whole network, SqueezeNet</b>, built only from Fire modules, that the paper reports reaches
        AlexNet-level ImageNet accuracy with far fewer parameters &mdash; and, once compressed, a model file
        under half a megabyte (Table&nbsp;2, abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>SqueezeNet was an early, influential demonstration that you can hold accuracy fixed and aggressively
       cut model size by <i>architecture design alone</i> &mdash; not just by compressing a big network after the
       fact. The squeeze-then-expand idea (shrink channels cheaply, do the costly spatial work on few channels)
       is the same instinct behind the bottleneck blocks in later efficient networks such as MobileNet and
       ShuffleNet. It helped open the whole "efficiency and compression" line of work: design the network to be
       small from the start, so it can run on phones, cameras, and embedded chips.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Architectural Design Strategies)</b> &mdash; the three rules (Strategy&nbsp;1: replace
        $3\\times3$ with $1\\times1$ filters; Strategy&nbsp;2: shrink the input-channel count to $3\\times3$
        filters; Strategy&nbsp;3: downsample late). These motivate the Fire module.</li>
        <li><b>&sect;3.2 (The Fire Module)</b> and <b>Figure&nbsp;1</b> &mdash; the squeeze layer (only $1\\times1$
        filters), the expand layer (a mix of $1\\times1$ and $3\\times3$), and the three knobs
        $s_{1\\times1}$, $e_{1\\times1}$, $e_{3\\times3}$.</li>
        <li><b>&sect;5.2</b> &mdash; the <b>squeeze ratio</b> (SR): how thin to make the squeeze layer relative
        to the expand layer, and how accuracy trades off against parameter count as SR changes.</li>
        <li><b>Table&nbsp;2</b> &mdash; SqueezeNet vs AlexNet: model size and top-1 / top-5 accuracy on ImageNet,
        and the effect of compression.</li>
       </ul>
       <p><b>Skim:</b> the Deep-Compression details (the quantization/pruning pipeline used to reach the
       &lt;0.5MB number) and the design-space-exploration sweeps (&sect;5.1, &sect;5.3) unless you want the full
       ablation grid.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build two small networks for the same tiny image task. <b>Net&nbsp;A</b> is a plain stack of
       ordinary $3\\times3$ convolutions. <b>Net&nbsp;B</b> replaces those with <b>Fire modules</b> that first
       squeeze the channels down with $1\\times1$ convolutions, then expand with a $1\\times1$/$3\\times3$ mix.
       Net&nbsp;B has far fewer parameters. Before running: do you expect Net&nbsp;B to reach <i>much lower</i>,
       <i>roughly the same</i>, or <i>higher</i> test accuracy than Net&nbsp;A? Write your guess, then check it
       against the run &mdash; and against the squeeze-ratio ablation, where the squeeze layer is made thinner
       and thinner.</p>`,
    attempt:
      `<p>Before the reveal, sketch the Fire module you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><code>Fire(nn.Module)</code> with <code>in_ch</code> input channels and three width knobs
        <code>s1x1</code>, <code>e1x1</code>, <code>e3x3</code>.</li>
        <li>TODO: the <b>squeeze</b> step &mdash; a $1\\times1$ <code>nn.Conv2d(in_ch, s1x1, 1)</code>, then ReLU.
        This drops the channel count from <code>in_ch</code> down to the small <code>s1x1</code>.</li>
        <li>TODO: the <b>expand</b> step &mdash; <i>two</i> parallel convolutions reading the squeezed tensor: a
        $1\\times1$ <code>nn.Conv2d(s1x1, e1x1, 1)</code> and a $3\\times3$
        <code>nn.Conv2d(s1x1, e3x3, 3, padding=1)</code>.</li>
        <li>TODO: <b>concatenate</b> the two expand outputs along the channel axis
        (<code>torch.cat([..., ...], dim=1)</code>), then ReLU. The module outputs <code>e1x1 + e3x3</code>
        channels.</li>
       </ul>
       <p>Then build the <b>ablation</b>: rerun the Fire-module net at several <b>squeeze ratios</b> (squeeze
       width as a fraction of the expand width) and predict how accuracy and parameter count move as the squeeze
       gets thinner.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start with the three design strategies (&sect;3.1), because the Fire module is built to obey all three.</p>
       <ol>
        <li><b>Strategy&nbsp;1 &mdash; prefer $1\\times1$ filters.</b> A $3\\times3$ convolution filter looks at a
        $3\\times3 = 9$-pixel window per input channel; a $1\\times1$ filter looks at a single pixel. So a
        $1\\times1$ filter has $9\\times$ fewer weights than a $3\\times3$ filter for the same channel counts.
        Wherever a $1\\times1$ can do the job, use it.</li>
        <li><b>Strategy&nbsp;2 &mdash; feed the $3\\times3$ filters fewer input channels.</b> A convolution layer's
        weight count is <code>(input channels) × (output channels) × (filter area)</code>. The $3\\times3$
        filters are the expensive ones, so cut their <i>input</i>-channel count down first. A thin "squeeze"
        layer does exactly this.</li>
        <li><b>Strategy&nbsp;3 &mdash; downsample late.</b> "Downsampling" means shrinking the feature map's height
        and width (e.g. with pooling or a stride). Doing it late keeps the feature maps large for most of the
        network, which the paper finds raises accuracy at a given parameter budget.</li>
       </ol>
       <p>Now the <b>Fire module</b> itself (&sect;3.2, Figure&nbsp;1). It has two parts:</p>
       <ol>
        <li><b>Squeeze layer</b> &mdash; a convolution layer made of <i>only</i> $1\\times1$ filters. It reads the
        module's input (say $C$ channels) and outputs a <b>small</b> number of channels $s_{1\\times1}$ (Strategy
        1 + Strategy 2: it is a cheap $1\\times1$ layer, and it makes the channel count small for whatever comes
        next). Then a ReLU (Rectified Linear Unit: keep positive values, set negatives to zero).</li>
        <li><b>Expand layer</b> &mdash; <i>two</i> convolutions run in parallel on the squeezed tensor: a
        $1\\times1$ convolution producing $e_{1\\times1}$ channels, and a $3\\times3$ convolution producing
        $e_{3\\times3}$ channels. Their outputs are <b>concatenated</b> along the channel axis into one tensor of
        $e_{1\\times1} + e_{3\\times3}$ channels, then a ReLU. Crucially the costly $3\\times3$ convolution reads
        only the $s_{1\\times1}$ squeezed channels, not the full $C$ &mdash; that is Strategy&nbsp;2 in action.</li>
       </ol>
       <p>So data flows <b>wide&nbsp;$\\rightarrow$&nbsp;thin&nbsp;(squeeze)&nbsp;$\\rightarrow$&nbsp;wide&nbsp;(expand)</b>.
       The expensive spatial filtering happens while the tensor is thin, which is where the parameter savings come
       from. SqueezeNet is just a stack of these Fire modules with a small classifier on top.</p>`,
    architecture:
      `<p><b>The Fire module</b> (&sect;3.2, Figure&nbsp;1) &mdash; the reusable block. Input: a tensor of $C$
       channels at height $H$, width $W$.</p>
       <ol>
        <li><b>Squeeze layer</b>: a $1\\times1$ convolution $C \\to s_{1\\times1}$ (so $s_{1\\times1}$ filters, each
        $1\\times1\\times C$), then ReLU. Output: $s_{1\\times1}$ channels at $H\\times W$ &mdash; the thin waist.</li>
        <li><b>Expand layer</b> (two convolutions in parallel, both reading the $s_{1\\times1}$ squeezed channels):
        <ul>
         <li>a $1\\times1$ convolution $s_{1\\times1} \\to e_{1\\times1}$;</li>
         <li>a $3\\times3$ convolution $s_{1\\times1} \\to e_{3\\times3}$ with padding $1$ (so $H,W$ are preserved and
         the two outputs are the same spatial size).</li>
        </ul></li>
        <li><b>Concatenate</b> the two expand outputs along the channel axis &rarr; $e_{1\\times1}+e_{3\\times3}$
        channels at $H\\times W$, then ReLU. (The paper uses no bottleneck-bias trick; just plain convs + ReLU.)</li>
       </ol>
       <p>Constraint: $s_{1\\times1} \\lt e_{1\\times1}+e_{3\\times3}$, so the module narrows before it widens.</p>

       <p><b>The SqueezeNet macroarchitecture</b> (&sect;3.3, Table&nbsp;1) &mdash; one $3\\times3$ stem convolution,
       eight Fire modules with three max-pools placed late (Strategy&nbsp;3), a final $1\\times1$ convolution to the
       class count, then global average pooling and softmax. There are <b>no fully-connected layers</b>; the
       classifier is the $1\\times1$ <code>conv10</code> followed by averaging. Input is a $224\\times224\\times3$
       ImageNet image:</p>
       <ul>
        <li><b>conv1</b>: $3\\times3$ conv, stride&nbsp;2, $\\to 64$ channels &rarr; ReLU.</li>
        <li><b>maxpool1</b>: $3\\times3$, stride&nbsp;2.</li>
        <li><b>fire2</b>: $s_{1\\times1}{=}16$, $e_{1\\times1}{=}64$, $e_{3\\times3}{=}64$ (out&nbsp;128).</li>
        <li><b>fire3</b>: $16,\\,64,\\,64$ (out&nbsp;128).</li>
        <li><b>fire4</b>: $32,\\,128,\\,128$ (out&nbsp;256).</li>
        <li><b>maxpool4</b>: $3\\times3$, stride&nbsp;2.</li>
        <li><b>fire5</b>: $32,\\,128,\\,128$ (out&nbsp;256).</li>
        <li><b>fire6</b>: $48,\\,192,\\,192$ (out&nbsp;384).</li>
        <li><b>fire7</b>: $48,\\,192,\\,192$ (out&nbsp;384).</li>
        <li><b>fire8</b>: $64,\\,256,\\,256$ (out&nbsp;512).</li>
        <li><b>maxpool8</b>: $3\\times3$, stride&nbsp;2.</li>
        <li><b>fire9</b>: $64,\\,256,\\,256$ (out&nbsp;512).</li>
        <li><b>conv10</b>: $1\\times1$ conv $\\to 1000$ channels (one per ImageNet class) &rarr; ReLU.</li>
        <li><b>avgpool10</b>: $13\\times13$ global average pool &rarr; a length-1000 vector &rarr; softmax.</li>
       </ul>
       <p>Note the squeeze widths grow with depth ($16\\to32\\to48\\to64$) while the expand widths grow in step
       ($\\text{base}_e{=}128$, $\\text{incr}_e{=}128$ every $\\text{freq}{=}2$ modules, $\\text{pct}_{3\\times3}{=}0.5$
       so $e_{1\\times1}=e_{3\\times3}$), and every Fire module here sits at SR&nbsp;$=0.125$ (e.g. fire2:
       $16/128$). The three pools are concentrated late, keeping the activation maps large for most of the network.
       The paper also studies two variants &mdash; "simple bypass" (a residual skip around alternate Fire modules)
       and "complex bypass" (a $1\\times1$ conv on the skip where channel counts differ) &mdash; with the simple
       bypass giving the best reported accuracy (&sect;6).</p>
       <p>The CODE panel builds a <i>scaled-down</i> version of this for a toy task: a $3\\times3$ stem, four Fire
       modules, one mid-network max-pool (downsample late), global average pool, and a linear classifier &mdash; the
       same skeleton, smaller widths.</p>`,
    symbols: [
      { sym: "$C$", desc: "the number of <b>input channels</b> to a Fire module (how many feature maps come in). A 'feature map' is one filtered version of the image." },
      { sym: "$s_{1\\times1}$", desc: "the number of $1\\times1$ filters in the <b>squeeze</b> layer &mdash; i.e. how many channels the squeeze layer outputs. Kept small (this is the thin waist of the module)." },
      { sym: "$e_{1\\times1}$", desc: "the number of $1\\times1$ filters in the <b>expand</b> layer." },
      { sym: "$e_{3\\times3}$", desc: "the number of $3\\times3$ filters in the <b>expand</b> layer. The module's output has $e_{1\\times1}+e_{3\\times3}$ channels." },
      { sym: "SR", desc: "the <b>squeeze ratio</b> (&sect;5.2): squeeze width divided by expand width, $s_{1\\times1} / (e_{1\\times1}+e_{3\\times3})$. A small SR means a very thin squeeze (fewer parameters); a large SR means a wider squeeze (more parameters). SqueezeNet uses SR&nbsp;$=0.125$." },
      { sym: "$a, b, k$", desc: "in the convolution rule: $a$ = a layer's input-channel count, $b$ = its output-channel count, $k$ = its filter side length (so a $k\\times k$ filter has area $k^2$). The layer holds $a\\,b\\,k^2$ weights plus $b$ biases." },
      { sym: "$H, W$", desc: "the <b>height</b> and <b>width</b> (in pixels) of a feature map. Padding the $3\\times3$ expand by 1 keeps $H$ and $W$ unchanged so the two expand outputs can be concatenated." },
      { sym: "$\\text{pct}_{3\\times3}$", desc: "(&sect;5.1) the fraction of expand filters that are $3\\times3$, i.e. $e_{3\\times3}/(e_{1\\times1}+e_{3\\times3})$. SqueezeNet uses $0.5$, so the two expand widths are equal." },
      { sym: "$\\text{base}_e,\\ \\text{incr}_e,\\ \\text{freq}$", desc: "(&sect;5.1) the macroarchitecture knobs that set each Fire module's expand width: it starts at $\\text{base}_e$ ($=128$) and grows by $\\text{incr}_e$ ($=128$) every $\\text{freq}$ ($=2$) modules. $i$ indexes the Fire module." },
      { sym: "“channel”", desc: "one feature map &mdash; one of the stacked 2-D arrays a convolution layer produces. More channels = more capacity but more parameters." },
      { sym: "“squeeze layer”", desc: "the $1\\times1$-only convolution that REDUCES the channel count from $C$ down to the small $s_{1\\times1}$." },
      { sym: "“expand layer”", desc: "the parallel $1\\times1$ and $3\\times3$ convolutions whose channel outputs are concatenated to INCREASE the channel count back up." },
      { sym: "ReLU", desc: "the activation $\\max(0,x)$: keep positive numbers, replace negatives with zero. Applied after both the squeeze and the expand step." },
      { sym: "“parameter”", desc: "a single learned weight stored by the network. A convolution layer holds $(\\text{in channels})\\times(\\text{out channels})\\times(\\text{filter area})$ weights, plus one bias per output channel." }
    ],
    formula:
      `$$ \\text{params}(\\text{conv}) \\;=\\; a\\cdot b\\cdot k^2 \\;+\\; b $$
       <p>The standard convolution weight rule (used throughout the paper, never written as a numbered equation): a
       convolution layer with $a$ input channels, $b$ output channels, and a $k\\times k$ filter holds $a\\,b\\,k^2$
       weights plus $b$ biases. Everything below is this rule applied and summed.</p>

       $$ \\text{Strategy 1:}\\quad \\frac{\\text{params}(3\\times3\\text{ filter})}{\\text{params}(1\\times1\\text{ filter})} \\;=\\; \\frac{3^2}{1^2} \\;=\\; 9 $$
       <p>&sect;3.1, Strategy&nbsp;1 (replace $3\\times3$ with $1\\times1$ filters): a $3\\times3$ filter has $9\\times$ as
       many weights as a $1\\times1$ filter for the same channel counts, so prefer $1\\times1$ wherever possible.</p>

       $$ \\text{cost of the }3\\times3\\text{ expand} \\;=\\; \\underbrace{s_{1\\times1}}_{\\text{inputs}}\\cdot e_{3\\times3}\\cdot 3^2 \\qquad\\text{not}\\qquad \\underbrace{C}_{\\text{full inputs}}\\cdot e_{3\\times3}\\cdot 3^2 $$
       <p>&sect;3.1, Strategy&nbsp;2 (decrease input channels to $3\\times3$ filters): the squeeze layer makes the
       costly $3\\times3$ filters read only $s_{1\\times1}$ channels instead of the module's full $C$, cutting their
       weight count by a factor $C / s_{1\\times1}$.</p>

       $$ \\text{Fire: } x \\in \\mathbb{R}^{C\\times H\\times W} \\;\\xrightarrow{\\;1\\times1\\text{ squeeze}\\;}\\; \\mathbb{R}^{s_{1\\times1}\\times H\\times W} \\;\\xrightarrow[\\text{concat}]{\\;1\\times1\\,\\|\\,3\\times3\\text{ expand}\\;}\\; \\mathbb{R}^{(e_{1\\times1}+e_{3\\times3})\\times H\\times W} $$
       <p>&sect;3.2 (the Fire module): squeeze the $C$ input channels down to $s_{1\\times1}$ with a $1\\times1$-only
       layer, then expand back out by running a $1\\times1$ ($\\to e_{1\\times1}$) and a $3\\times3$ ($\\to e_{3\\times3}$)
       convolution in parallel and concatenating along the channel axis. Height $H$ and width $W$ are preserved.</p>

       $$ s_{1\\times1} \\;\\lt\\; (e_{1\\times1} + e_{3\\times3}) $$
       <p>&sect;3.2 (the squeeze constraint): the squeeze width is set below the total expand width, so the squeeze
       layer genuinely limits the number of input channels reaching the $3\\times3$ filters.</p>

       $$ \\text{SR} \\;=\\; \\frac{s_{1\\times1}}{\\,e_{1\\times1} + e_{3\\times3}\\,} \\;\\in\\; [0,1] $$
       <p>&sect;5.2 (squeeze ratio): the ratio of squeeze-layer width to expand-layer width. SqueezeNet uses
       SR&nbsp;$=0.125$. Small SR = a very thin squeeze = fewer parameters but less capacity; large SR = a wider
       squeeze = more parameters.</p>

       $$ \\text{pct}_{3\\times3} \\;=\\; \\frac{e_{3\\times3}}{\\,e_{1\\times1} + e_{3\\times3}\\,}, \\qquad e_i \\;=\\; \\text{base}_e \\;+\\; \\Big(\\text{incr}_e \\cdot \\big\\lfloor \\tfrac{i}{\\text{freq}} \\big\\rfloor\\Big) $$
       <p>&sect;5.1 (the macroarchitecture metaparameters that generate the whole net): $\\text{pct}_{3\\times3}$ is
       the fraction of expand filters that are $3\\times3$ (SqueezeNet uses $0.5$, so $e_{1\\times1}=e_{3\\times3}$);
       the expand width of Fire module $i$ starts at $\\text{base}_e$ and grows by $\\text{incr}_e$ every $\\text{freq}$
       modules. SqueezeNet uses $\\text{base}_e=128$, $\\text{incr}_e=128$, $\\text{freq}=2$.</p>

       $$ \\text{params(Fire)} \\;=\\; \\underbrace{C\\cdot s_{1\\times1}\\cdot 1^2}_{\\text{squeeze }1\\times1} \\;+\\; \\underbrace{s_{1\\times1}\\cdot e_{1\\times1}\\cdot 1^2}_{\\text{expand }1\\times1} \\;+\\; \\underbrace{s_{1\\times1}\\cdot e_{3\\times3}\\cdot 3^2}_{\\text{expand }3\\times3} \\;+\\; \\underbrace{(s_{1\\times1}+e_{1\\times1}+e_{3\\times3})}_{\\text{biases}} $$
       <p>The parameter count of one Fire module: the convolution rule above summed over its three convolutions plus
       their biases. The squeeze width $s_{1\\times1}$ multiplies <i>both</i> expand terms, so it is the dominant
       lever on the module's size (it follows from the &sect;3.2 structure; the paper states no closed-form for it).</p>`,
    whatItDoes:
      `<p>This counts the learned weights in one Fire module. There is no single equation in the paper for this
       (the paper gives the module structure in &sect;3.2 and Figure&nbsp;1); the count below follows directly from
       that structure and the standard convolution weight rule. Each term is one convolution's
       <code>(in&nbsp;channels)×(out&nbsp;channels)×(filter&nbsp;area)</code>:</p>
       <ul>
        <li><b>Squeeze $1\\times1$</b>: reads $C$ channels, writes $s_{1\\times1}$, filter area $1^2=1$ &rarr;
        $C\\cdot s_{1\\times1}$ weights.</li>
        <li><b>Expand $1\\times1$</b>: reads $s_{1\\times1}$ channels, writes $e_{1\\times1}$, area $1$ &rarr;
        $s_{1\\times1}\\cdot e_{1\\times1}$ weights.</li>
        <li><b>Expand $3\\times3$</b>: reads $s_{1\\times1}$ channels (NOT $C$ &mdash; Strategy&nbsp;2), writes
        $e_{3\\times3}$, area $3^2=9$ &rarr; $9\\cdot s_{1\\times1}\\cdot e_{3\\times3}$ weights.</li>
        <li><b>Biases</b>: one per output channel of each of the three convolutions.</li>
       </ul>
       <p>The big lever is the squeeze width $s_{1\\times1}$: it multiplies <i>both</i> expand terms. Make the
       squeeze thin and the whole module gets cheap &mdash; especially the $9\\times$-heavier $3\\times3$ term.</p>`,
    derivation:
      `<p>This is just the standard convolution-parameter rule applied three times and summed. Recall: a
       convolution layer with $a$ input channels, $b$ output channels, and a $k\\times k$ filter holds
       $a\\cdot b\\cdot k^2$ weights (one $k\\times k$ filter per (output, input) channel pair) plus $b$ biases (one
       per output channel). The Fire module is three such layers wired squeeze&nbsp;&rarr;&nbsp;(expand-1×1,
       expand-3×3):</p>
       <p><b>Squeeze</b> ($1\\times1$, $C\\to s_{1\\times1}$): $\\;C\\cdot s_{1\\times1}\\cdot 1^2 = C\\,s_{1\\times1}$ weights, $+\\,s_{1\\times1}$ biases.</p>
       <p><b>Expand $1\\times1$</b> ($s_{1\\times1}\\to e_{1\\times1}$): $\\;s_{1\\times1}\\cdot e_{1\\times1}\\cdot 1^2$ weights, $+\\,e_{1\\times1}$ biases.</p>
       <p><b>Expand $3\\times3$</b> ($s_{1\\times1}\\to e_{3\\times3}$): $\\;s_{1\\times1}\\cdot e_{3\\times3}\\cdot 3^2$ weights, $+\\,e_{3\\times3}$ biases.</p>
       <p>Add them to get the formula above. The key observation &mdash; and the whole point of the squeeze &mdash;
       is that the expensive $3\\times3$ convolution's input-channel count is $s_{1\\times1}$, the SMALL squeezed
       width, not the module's full input width $C$. That is Strategy&nbsp;2 baked into the parameter count. This is
       self-contained &mdash; no separate concept lesson to defer to.</p>`,
    example:
      `<p>Work one Fire module by hand. Take a module with $C=32$ input channels, squeeze
       $s_{1\\times1}=8$, and expand $e_{1\\times1}=32$, $e_{3\\times3}=32$. The output has
       $e_{1\\times1}+e_{3\\times3}=64$ channels.</p>
       <ul class="steps">
        <li><b>Squeeze $1\\times1$</b> ($32\\to8$): weights $=C\\,s_{1\\times1}=32\\cdot8=256$, plus $8$ biases
        $=\\mathbf{264}$.</li>
        <li><b>Expand $1\\times1$</b> ($8\\to32$): weights $=s_{1\\times1}\\,e_{1\\times1}=8\\cdot32=256$, plus $32$
        biases $=\\mathbf{288}$.</li>
        <li><b>Expand $3\\times3$</b> ($8\\to32$, area $9$): weights $=9\\cdot s_{1\\times1}\\,e_{3\\times3}=9\\cdot8\\cdot32
        =2304$, plus $32$ biases $=\\mathbf{2336}$.</li>
        <li><b>Module total</b>: $264+288+2336=\\mathbf{2888}$ parameters.</li>
       </ul>
       <p>For comparison, a single ordinary $3\\times3$ convolution doing $32\\to64$ on the same input would cost
       $32\\cdot64\\cdot9 + 64 = 18432 + 64 = \\mathbf{18496}$ parameters &mdash; about $6.4\\times$ more than the whole
       Fire module, even though both turn 32 channels into 64. The savings come from squeezing to 8 channels
       before the $3\\times3$ work. <b>The notebook recomputes 2888 and checks it equals PyTorch's own parameter
       count for the exact same module &mdash; and it matches.</b></p>`,
    recipe:
      `<ol>
        <li><b>Build the Fire module</b> (<code>Fire</code>): squeeze $1\\times1$ ($C\\to s_{1\\times1}$) &rarr;
        ReLU; then in parallel expand $1\\times1$ ($s_{1\\times1}\\to e_{1\\times1}$) and expand $3\\times3$
        ($s_{1\\times1}\\to e_{3\\times3}$, with <code>padding=1</code> so sizes match); concatenate the two along
        the channel axis &rarr; ReLU.</li>
        <li><b>Stack Fire modules</b> into a tiny SqueezeNet-style net: a small convolution "stem", a few Fire
        modules, one pooling step in the middle (downsample late), then global average pool and a linear
        classifier.</li>
        <li><b>Build a plain-conv baseline</b> of similar depth using ordinary $3\\times3$ convolutions, so you can
        compare parameters and accuracy fairly.</li>
        <li><b>Count parameters and train both</b> on a toy image task. The Fire-module net should reach
        <i>near-equal</i> test accuracy with <i>far fewer</i> parameters &mdash; the paper's qualitative effect.</li>
        <li><b>Run the squeeze-ratio ablation</b>: rebuild the Fire net at several squeeze ratios (thin to wide
        squeeze) and plot accuracy vs parameter count. A thinner squeeze means fewer parameters but, past a point,
        lower accuracy &mdash; the SR trade-off of &sect;5.2.</li>
      </ol>`,
    results:
      `<p>The paper's headline (abstract; Table&nbsp;2): SqueezeNet reaches <b>AlexNet-level accuracy on ImageNet
       with 50&times; fewer parameters</b>. Table&nbsp;2 reports SqueezeNet at <b>57.5%</b> top-1 and <b>80.3%</b>
       top-5 accuracy versus AlexNet's <b>57.2%</b> top-1 / <b>80.3%</b> top-5, while shrinking the model from
       AlexNet's <b>240MB</b> to about <b>4.8MB</b> (50&times; smaller). With the separate <b>Deep Compression</b>
       pipeline (pruning plus low-bit quantization) the paper compresses SqueezeNet further to <b>under 0.5MB</b>
       (it reports ~0.47MB, 510&times; smaller than AlexNet) at the same accuracy.</p>
       <p><i>These are the paper's reported figures, quoted from its abstract and Table&nbsp;2. The numbers in the
       CODEVIZ panel below are from our own tiny CPU run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: convolutions, ReLU, and concatenation already ship in
       PyTorch, so you <b>import</b> them and build only the novel composition. <b>Import:</b>
       <code>nn.Conv2d</code> (for the $1\\times1$ squeeze, the $1\\times1$ expand, and the $3\\times3$ expand),
       <code>nn.ReLU</code>, <code>torch.cat</code> for the concatenation, and the optimizer. <b>Build by hand:</b>
       the Fire module (squeeze &rarr; parallel expand &rarr; concat), the by-hand parameter count that confirms
       2888 against PyTorch, the tiny Fire-net vs plain-net comparison, and the <b>squeeze-ratio ablation</b>. The
       parameter algebra and the three design strategies are covered here in full (no separate concept lesson).
       For the related "shrink channels cheaply" idea in a later efficient net, see <code>paper-mobilenet</code>.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting <code>padding=1</code> on the $3\\times3$ expand.</b> The two expand convolutions must
        produce the same height and width before you concatenate them. A $1\\times1$ keeps the size; a $3\\times3$
        without padding shrinks it by 2 pixels, so the concat shapes mismatch and the code crashes. <b>Fix:</b>
        <code>padding=1</code> on the $3\\times3$.</li>
        <li><b>Concatenating on the wrong axis.</b> The expand outputs are joined along the <b>channel</b> axis
        (<code>dim=1</code> for an NCHW tensor: N=batch, C=channels, H, W). Concatenating on a spatial axis is a
        silent bug. <b>Fix:</b> <code>torch.cat([y1, y3], dim=1)</code>.</li>
        <li><b>Making the squeeze layer too thin.</b> A very small $s_{1\\times1}$ saves the most parameters but
        can starve the network of capacity and drop accuracy (the SR trade-off, &sect;5.2). The ablation here shows
        accuracy falling once the squeeze is too narrow.</li>
        <li><b>Confusing the squeeze with the expand.</b> Squeeze is $1\\times1$-<i>only</i> and REDUCES channels;
        expand is the $1\\times1$/$3\\times3$ <i>mix</i> and INCREASES them. Swapping them defeats Strategy&nbsp;2
        (you would feed the $3\\times3$ filters the full channel count again).</li>
        <li><b>Reading the &lt;0.5MB number as architecture alone.</b> The under-half-megabyte size needs the
        separate Deep-Compression step (pruning + quantization); the architecture alone gives the ~4.8MB / 50&times;
        figure. Don't conflate the two.</li>
      </ul>`,
    recall: [
      "Draw the Fire module from memory: what does the squeeze layer do, and what two convolutions make up the expand layer?",
      "Write the Fire-module parameter count and say which term the squeeze width $s_{1\\times1}$ multiplies.",
      "State the three design strategies from &sect;3.1 in one line each.",
      "What is the squeeze ratio (SR), and what happens to accuracy and parameters as SR shrinks?"
    ],
    practice: [
      {
        q: `<b>The squeeze-ratio ablation.</b> You have a working tiny SqueezeNet-style net. Rebuild it at several
            squeeze ratios &mdash; making the squeeze layer thinner (small SR) or wider (large SR) &mdash; while
            keeping everything else identical, and retrain each. What happens to the parameter count and the test
            accuracy as SR changes, and what does the trend demonstrate?`,
        steps: [
          { do: `Change one thing only: the squeeze width $s_{1\\times1}$ (via SR = squeeze / expand width). Keep depth, expand widths, optimizer, data, and seed identical.`, why: `An honest ablation isolates the squeeze ratio; any change in accuracy or params is attributable to it alone.` },
          { do: `Record the parameter count and test accuracy at each SR.`, why: `A thinner squeeze multiplies both expand terms by a smaller number, so it directly shrinks the parameter count &mdash; the lever from the param formula.` },
          { do: `Plot accuracy vs parameters across SR values.`, why: `It reveals the trade-off: more squeeze width buys accuracy at a parameter cost, with diminishing returns &mdash; the &sect;5.2 finding.` }
        ],
        answer: `<p>Parameter count rises monotonically with SR (a wider squeeze = more weights), and accuracy
                 rises with it too, but with diminishing returns. In our small CPU run a thin squeeze
                 (SR=0.125, 4728 params) reached 0.840 test accuracy, SR=0.25 (7848 params) reached 0.988,
                 SR=0.5 (14088 params) reached 0.996, and SR=0.75 (20328 params) reached 1.000. So you can trade
                 a few points of accuracy for a big parameter cut by squeezing harder &mdash; exactly the
                 SR trade-off the paper explores in &sect;5.2. The CODEVIZ panel plots this curve. (Our small run,
                 not the paper's reported numbers.)</p>`
      },
      {
        q: `A Fire module has $C=64$ input channels, squeeze $s_{1\\times1}=16$, and expand
            $e_{1\\times1}=64$, $e_{3\\times3}=64$. Compute its parameter count (weights + biases), and compare to
            one ordinary $3\\times3$ convolution doing $64\\to128$ on the same input.`,
        steps: [
          { do: `Squeeze $1\\times1$ ($64\\to16$): $64\\cdot16 = 1024$ weights $+\\,16$ biases $=1040$.`, why: `Standard conv rule $a\\cdot b\\cdot k^2 + b$ with $k=1$.` },
          { do: `Expand $1\\times1$ ($16\\to64$): $16\\cdot64 = 1024$ weights $+\\,64$ biases $=1088$. Expand $3\\times3$ ($16\\to64$): $9\\cdot16\\cdot64 = 9216$ weights $+\\,64$ biases $=9280$.`, why: `The $3\\times3$ reads only the 16 squeezed channels, not the full 64 — Strategy 2.` },
          { do: `Standard conv ($64\\to128$, $3\\times3$): $9\\cdot64\\cdot128 = 73728$ weights $+\\,128$ biases $=73856$.`, why: `One full $3\\times3$ conv reading all 64 input channels and writing 128.` }
        ],
        answer: `<p>The Fire module totals $1040 + 1088 + 9280 = \\mathbf{11{,}408}$ parameters and outputs
                 $64+64=128$ channels. A single standard $3\\times3$ convolution producing the same 128 output
                 channels costs $\\mathbf{73{,}856}$ parameters &mdash; about $6.5\\times$ more. The Fire module is
                 dramatically cheaper because the expensive $3\\times3$ filters read only the 16 squeezed channels
                 instead of the full 64 (Strategy&nbsp;2), and because the channel-mixing is done by cheap
                 $1\\times1$ filters (Strategy&nbsp;1).</p>`
      },
      {
        q: `Why does the squeeze layer come <i>before</i> the $3\\times3$ filters in a Fire module, rather than
            applying the $3\\times3$ filters straight to the module's full input? Tie your answer to the design
            strategies.`,
        steps: [
          { do: `Recall a conv layer's weight count grows with its INPUT-channel count.`, why: `Weights $=(\\text{in})\\times(\\text{out})\\times(\\text{filter area})$; halving the inputs halves the weights.` },
          { do: `Note the $3\\times3$ filter has $9\\times$ the area of a $1\\times1$, so it is the costly one to feed.`, why: `Strategy 1: $3\\times3$ filters are 9× more expensive per (in,out) pair than $1\\times1$.` },
          { do: `Put a thin $1\\times1$ squeeze first so the $3\\times3$ sees only $s_{1\\times1}$ inputs, not the full $C$.`, why: `Strategy 2: shrink the input-channel count to the $3\\times3$ filters before they run.` }
        ],
        answer: `<p>Because the $3\\times3$ convolution is the expensive one (it has $9\\times$ the filter area of a
                 $1\\times1$, Strategy&nbsp;1), and a convolution's weight count is proportional to its
                 <b>input</b>-channel count. The squeeze layer is a cheap $1\\times1$ that first drops the channel
                 count from the full $C$ down to a small $s_{1\\times1}$, so when the $3\\times3$ filters run they
                 read only $s_{1\\times1}$ channels instead of $C$ (Strategy&nbsp;2). Applying the $3\\times3$
                 filters straight to the full input would multiply their weight count by $C/s_{1\\times1}$ &mdash;
                 in the worked example, $32/8 = 4\\times$ more &mdash; defeating the savings. Squeeze-then-expand is
                 how the module obeys both Strategy&nbsp;1 and Strategy&nbsp;2 at once.</p>`
      }
    ]
  });

  window.CODE["paper-squeezenet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the Fire module by hand on top of <code>nn.Conv2d</code> (squeeze $1\\times1$
       &rarr; ReLU, then a parallel $1\\times1$ expand and $3\\times3$ expand whose outputs are
       <code>torch.cat</code>'d on the channel axis &rarr; ReLU), then compare a tiny SqueezeNet-style net to a
       plain $3\\times3$-conv baseline and run the squeeze-ratio ablation. The first cell recomputes the worked
       example &mdash; squeeze 264, expand-1×1 288, expand-3×3 2336, Fire total 2888 &mdash; and verifies it
       equals PyTorch's own <code>sum(p.numel())</code> for the identical module (prints <code>match: True</code>).
       The headline lines are <code>nn.Conv2d(in_ch, s1x1, 1)</code> (squeeze), the parallel
       <code>nn.Conv2d(s1x1, e1x1, 1)</code> and <code>nn.Conv2d(s1x1, e3x3, 3, padding=1)</code> (expand), and
       <code>torch.cat([y1, y3], dim=1)</code> (concat). Paste into Colab and run (torch/torchvision are
       preinstalled &mdash; no pip). A small BatchNorm is added inside Fire so the very thin squeeze layers still
       train stably; the parameter-count oracle uses the plain no-BatchNorm convs to match the by-hand math.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Worked example: a single Fire module's parameter count by hand. ---
# Fire(C=32, s1x1=8, e1x1=32, e3x3=32). A conv has in*out*k*k weights + out biases.
C, s1, e1, e3 = 32, 8, 32, 32
squeeze = C*s1*1*1 + s1        # 1x1 squeeze: 32->8
exp1    = s1*e1*1*1 + e1       # 1x1 expand: 8->32
exp3    = s1*e3*3*3 + e3       # 3x3 expand: 8->32
total   = squeeze + exp1 + exp3
print("squeeze =", squeeze, " expand1x1 =", exp1, " expand3x3 =", exp3, " Fire total =", total)
# squeeze = 264  expand1x1 = 288  expand3x3 = 2336  Fire total = 2888

# Verify against PyTorch's own count for the SAME (no-BatchNorm) module.
class FireParamOracle(nn.Module):
    def __init__(self, cin, s1, e1, e3):
        super().__init__()
        self.sq = nn.Conv2d(cin, s1, 1)
        self.e1 = nn.Conv2d(s1, e1, 1)
        self.e3 = nn.Conv2d(s1, e3, 3, padding=1)
pt = sum(p.numel() for p in FireParamOracle(32, 8, 32, 32).parameters())
print("PyTorch Fire params =", pt, " match:", pt == total)
# PyTorch Fire params = 2888  match: True


# --- 1. The Fire module (built by hand). BatchNorm added so thin squeezes train. ---
class Fire(nn.Module):
    def __init__(self, in_ch, s1x1, e1x1, e3x3):
        super().__init__()
        self.squeeze = nn.Conv2d(in_ch, s1x1, 1)          # 1x1 squeeze: reduce channels
        self.sbn = nn.BatchNorm2d(s1x1)
        self.expand1 = nn.Conv2d(s1x1, e1x1, 1)           # 1x1 expand
        self.expand3 = nn.Conv2d(s1x1, e3x3, 3, padding=1)# 3x3 expand (padding keeps H,W)
        self.ebn = nn.BatchNorm2d(e1x1 + e3x3)
        self.act = nn.ReLU(inplace=True)
    def forward(self, x):
        x = self.act(self.sbn(self.squeeze(x)))           # squeeze -> ReLU
        y1, y3 = self.expand1(x), self.expand3(x)         # two parallel expands
        return self.act(self.ebn(torch.cat([y1, y3], 1))) # concat on channel axis -> ReLU


# --- 2. A tiny SqueezeNet-style net (Fire modules) and a plain-conv baseline. ---
def n_params(m): return sum(p.numel() for p in m.parameters())

class PlainNet(nn.Module):          # ordinary 3x3 convs only
    def __init__(self, ch=32, K=8):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True),
            nn.Conv2d(ch, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
            nn.Conv2d(ch, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True),
            nn.Conv2d(ch, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True))
        self.head = nn.Linear(ch, K)
    def forward(self, x): return self.head(self.net(x).mean(dim=(2, 3)))

class FireNet(nn.Module):           # SR = squeeze ratio = squeeze width / expand width
    def __init__(self, SR=0.5, base=32, K=8):
        super().__init__()
        sq = max(1, int(round(SR * base)))     # squeeze width; expand = base/2 + base/2 = base
        self.stem = nn.Sequential(nn.Conv2d(3, base, 3, padding=1), nn.BatchNorm2d(base), nn.ReLU(inplace=True))
        self.f1 = Fire(base, sq, base//2, base//2)
        self.f2 = Fire(base, sq, base//2, base//2)
        self.pool = nn.MaxPool2d(2)            # downsample LATE (Strategy 3)
        self.f3 = Fire(base, sq, base//2, base//2)
        self.f4 = Fire(base, sq, base//2, base//2)
        self.head = nn.Linear(base, K)
    def forward(self, x):
        x = self.stem(x); x = self.f2(self.f1(x)); x = self.pool(x); x = self.f4(self.f3(x))
        return self.head(x.mean(dim=(2, 3)))   # global average pool -> classifier


# --- 3. Toy task: 8 noisy image classes. ---
g = torch.Generator().manual_seed(1)
N, Cc, H, W, K = 1000, 3, 16, 16, 8
y = torch.randint(0, K, (N,), generator=g)
proto = torch.randn(K, Cc, H, W, generator=g)
X = proto[y] + 0.9 * torch.randn(N, Cc, H, W, generator=g)
Xtr, ytr, Xte, yte = X[:750], y[:750], X[750:], y[750:]

def train(net, epochs=120, lr=0.05):
    torch.manual_seed(0)
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9, weight_decay=1e-4)
    lf = nn.CrossEntropyLoss()
    for _ in range(epochs):
        net.train(); opt.zero_grad(); lf(net(Xtr), ytr).backward(); opt.step()
    net.eval()
    with torch.no_grad():
        return (net(Xte).argmax(1) == yte).float().mean().item()

plain = PlainNet()
fire  = FireNet(SR=0.5)
acc_plain = train(plain)
acc_fire  = train(fire)

print("\\n                 params     test acc")
print("plain 3x3 convs  %6d     %.3f" % (n_params(plain), acc_plain))
print("Fire modules     %6d     %.3f" % (n_params(fire),  acc_fire))
print("param ratio plain/fire = %.2fx" % (n_params(plain) / n_params(fire)))
# plain 3x3 convs   29160     1.000
# Fire modules      14088     0.996   (~2x fewer params, near-equal accuracy)

# --- 4. Squeeze-ratio ablation. ---
print("\\nsqueeze-ratio ablation:")
for SR in [0.125, 0.25, 0.5, 0.75]:
    net = FireNet(SR=SR)
    print("  SR=%.3f  params=%5d  acc=%.3f" % (SR, n_params(net), train(net)))
# SR=0.125 params= 4728 acc=0.840   SR=0.250 params= 7848 acc=0.988
# SR=0.500 params=14088 acc=0.996   SR=0.750 params=20328 acc=1.000
# (varies by hardware/seed; our small run, not the paper's reported number.)`
  };

  window.CODEVIZ["paper-squeezenet"] = {
    question: "Can a Fire-module net match a plain-conv net's accuracy with far fewer parameters — and how does the squeeze ratio trade params for accuracy?",
    charts: [
      {
        type: "bar",
        title: "Params vs accuracy — plain 3×3-conv net vs Fire-module net (same toy task)",
        labels: ["plain convs (29160 params)", "Fire modules (14088 params)"],
        values: [1.000, 0.996],
        colors: ["#ff7b72", "#7ee787"]
      },
      {
        type: "line",
        title: "Squeeze-ratio ablation — test accuracy vs squeeze ratio (SR)",
        xlabel: "squeeze ratio SR (squeeze width / expand width)",
        ylabel: "test accuracy",
        series: [
          {
            name: "Fire net accuracy vs SR",
            color: "#7ee787",
            points: [[0.125, 0.840], [0.25, 0.988], [0.5, 0.996], [0.75, 1.000]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. LEFT: a tiny SqueezeNet-style net (stem + four Fire modules, one mid-network pool) reaches 0.996 test accuracy with 14088 parameters, essentially tying a plain four-layer 3×3-conv net that scores 1.000 with 29160 parameters — about 2× fewer parameters at near-equal accuracy, the same qualitative effect SqueezeNet shows against AlexNet (Table 2, 50× fewer params at equal accuracy). RIGHT: the squeeze-ratio ablation — as the squeeze layer is widened (SR 0.125→0.75, params 4728→20328), accuracy climbs from 0.840 to 1.000 with diminishing returns, the parameters-vs-accuracy trade-off the paper explores in §5.2. Task: 8 noisy classes, 3×16×16 images, SGD, identical depth/optimizer/seed across nets.",
    code: `import torch, torch.nn as nn

torch.manual_seed(0)
g = torch.Generator().manual_seed(1)
N, C, H, W, K = 1000, 3, 16, 16, 8
y = torch.randint(0, K, (N,), generator=g)
proto = torch.randn(K, C, H, W, generator=g)
X = proto[y] + 0.9 * torch.randn(N, C, H, W, generator=g)
Xtr, ytr, Xte, yte = X[:750], y[:750], X[750:], y[750:]

class Fire(nn.Module):                 # squeeze 1x1 -> ReLU; expand (1x1 || 3x3) -> concat -> ReLU
    def __init__(s, cin, s1, e1, e3):
        super().__init__()
        s.sq = nn.Conv2d(cin, s1, 1); s.sbn = nn.BatchNorm2d(s1)
        s.e1 = nn.Conv2d(s1, e1, 1); s.e3 = nn.Conv2d(s1, e3, 3, padding=1)
        s.ebn = nn.BatchNorm2d(e1 + e3); s.a = nn.ReLU(inplace=True)
    def forward(s, x):
        x = s.a(s.sbn(s.sq(x)))
        return s.a(s.ebn(torch.cat([s.e1(x), s.e3(x)], 1)))

def nparams(m): return sum(p.numel() for p in m.parameters())

class PlainNet(nn.Module):
    def __init__(s, ch=32):
        super().__init__()
        s.net = nn.Sequential(
            nn.Conv2d(3, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True),
            nn.Conv2d(ch, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True),
            nn.MaxPool2d(2),
            nn.Conv2d(ch, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True),
            nn.Conv2d(ch, ch, 3, padding=1), nn.BatchNorm2d(ch), nn.ReLU(inplace=True))
        s.head = nn.Linear(ch, K)
    def forward(s, x): return s.head(s.net(x).mean(dim=(2, 3)))

class FireNet(nn.Module):
    def __init__(s, SR=0.5, base=32):
        super().__init__()
        sq = max(1, int(round(SR * base)))
        s.stem = nn.Sequential(nn.Conv2d(3, base, 3, padding=1), nn.BatchNorm2d(base), nn.ReLU(inplace=True))
        s.f1 = Fire(base, sq, base//2, base//2); s.f2 = Fire(base, sq, base//2, base//2)
        s.pool = nn.MaxPool2d(2)
        s.f3 = Fire(base, sq, base//2, base//2); s.f4 = Fire(base, sq, base//2, base//2)
        s.head = nn.Linear(base, K)
    def forward(s, x):
        x = s.stem(x); x = s.f2(s.f1(x)); x = s.pool(x); x = s.f4(s.f3(x))
        return s.head(x.mean(dim=(2, 3)))

def train(net, epochs=120, lr=0.05):
    torch.manual_seed(0)
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9, weight_decay=1e-4)
    lf = nn.CrossEntropyLoss()
    for _ in range(epochs):
        net.train(); opt.zero_grad(); lf(net(Xtr), ytr).backward(); opt.step()
    net.eval()
    with torch.no_grad():
        return (net(Xte).argmax(1) == yte).float().mean().item()

plain, fire = PlainNet(), FireNet(SR=0.5)
print("plain params=%d acc=%.3f" % (nparams(plain), train(plain)))
print("fire  params=%d acc=%.3f" % (nparams(fire),  train(fire)))
for SR in [0.125, 0.25, 0.5, 0.75]:
    net = FireNet(SR=SR)
    print("SR=%.3f params=%d acc=%.3f" % (SR, nparams(net), train(net)))
# plain params=29160 acc=1.000 ; fire params=14088 acc=0.996 (~2x fewer, near-equal)
# SR=0.125 p=4728 a=0.840 | SR=0.25 p=7848 a=0.988 | SR=0.5 p=14088 a=0.996 | SR=0.75 p=20328 a=1.000
# Our small run, not the paper's reported number.`
  };
})();
