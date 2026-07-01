/* All ML — authored content for Part 7: Computer Vision (7.1–7.31).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every displayed number was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 7.1 Image representation & color spaces ---------------- */

window.ALLML_CONTENT["7.1"] = {
  tagline: "An image is not magic to a model; it is a carefully ordered stack of numbers whose color convention decides what every later filter sees.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.1-image-representation-color-spaces.ipynb",
  context: String.raw`
    <p>This lesson is the ground floor of computer vision: before edges, convolutions, or networks, a picture must become an array with a meaning attached to each axis.</p>
    <ul>
      <li><b>Matrices and tensors</b> provide the storage model: a grayscale image is height by width, while an RGB image adds a channel axis of length $3$.</li>
      <li><b>Linear combinations</b> explain grayscale conversion: luminance is not a plain average, but a weighted sum chosen to match human sensitivity.</li>
      <li><b>Indexing conventions</b> decide whether the first channel is red or blue; the same numbers can render correctly or wrongly depending on that contract.</li>
    </ul>
    <p>Where it leads: classical features (7.2) measure changes in these intensity arrays; convolution (7.3) slides learned kernels across them; CNN blocks (7.4) preserve or shrink their spatial axes; and segmentation or detection later must map predictions back onto the original pixel grid. If this representation is off by one channel or one scale, every later visual conclusion is built on a lie.</p>`,
  intuition: String.raw`
    <p>The concrete problem: a camera gives us a scene, but a model can only receive numbers. The act of choosing those numbers is already a modeling decision: are intensities stored from $0$ to $255$ or from $0$ to $1$, are colors red-green-blue or blue-green-red, and is a single-channel image a matrix or a tensor with a singleton channel?</p>
    <p>The naive habit is to say "pixels are pixels" and move on. That fails the moment an OpenCV BGR array is shown as RGB, or when a network trained on normalized floats is handed raw byte values. The picture may still look like an array of the right shape, so the bug does not crash; it merely teaches the model the wrong colors or wrong contrast.</p>
    <p>The useful mental model is a labeled coordinate system. A pixel value is not just $128$; it is row, column, channel, scale, and color basis. The design decision people gloss over is <b>which visual distinctions to preserve</b>. Grayscale intentionally discards hue but keeps brightness; RGB keeps hue but triples storage; alternative color spaces separate brightness from chroma so illumination changes can be handled differently from object color.</p>`,
  mathematics: String.raw`
    <p>For an RGB pixel with channels in the order $(R,G,B)$, the standard luminance conversion used here is:</p>
    <div class="formula-box">$$Y=0.299R+0.587G+0.114B$$</div>
    <p>Here $R$, $G$, and $B$ are channel intensities on the same scale, and $Y$ is the single grayscale intensity. The larger green weight means green contributes most to perceived brightness.</p>

    <p><b>A grayscale image is a matrix.</b> The notebook's grayscale example stores byte values in a $2\times3$ grid and divides by $255$:</p>
    <ol class="work">
      <li>top-right entry: $128/255=0.5019607843$</li>
      <li>smallest entry: $0/255=0$</li>
      <li>largest entry: $255/255=1$</li>
    </ol>
    <p>The shape is $(2,3)$, not $(2,3,3)$, because each location carries one intensity. Normalizing to $[0,1]$ keeps the same visual ordering while making the scale friendlier for learning.</p>

    <p><b>An RGB image is a three-channel tensor.</b> The tiny color image has four pixels: red, green, blue, and white:</p>
    <ol class="work">
      <li>red pixel sum: $1+0+0=1$</li>
      <li>green pixel sum: $0+1+0=1$</li>
      <li>blue pixel sum: $0+0+1=1$</li>
      <li>white pixel sum: $1+1+1=3$</li>
      <li>whole tensor sum: $1+1+1+3=6$</li>
    </ol>
    <p>That total $6$ is not a brightness score for the image; it is a quick sanity check that the tensor shape $(2,2,3)$ and the channel values are exactly what we think they are.</p>

    <p><b>Luminance is weighted, not averaged.</b> Apply the formula to pure red, pure green, and pure blue:</p>
    <ol class="work">
      <li>red: $0.299(1)+0.587(0)+0.114(0)=0.299$</li>
      <li>green: $0.299(0)+0.587(1)+0.114(0)=0.587$</li>
      <li>blue: $0.299(0)+0.587(0)+0.114(1)=0.114$</li>
    </ol>
    <p>The resulting row $[0.299,0.587,0.114]$ says a green pixel is brighter than a red pixel at the same numeric channel value, and a blue pixel is darkest under this convention.</p>

    <p><b>Channel order changes the meaning without changing the shape.</b> Reverse the last axis of an RGB tensor to get BGR:</p>
    <ol class="work">
      <li>RGB red pixel $[1,0,0]$ becomes BGR-stored value $[0,0,1]$</li>
      <li>RGB blue pixel $[0,0,1]$ becomes $[1,0,0]$</li>
      <li>RGB yellow pixel $[1,1,0]$ becomes $[0,1,1]$</li>
    </ol>
    <p>The array is still $2\times2\times3$, but the semantic labels moved. A model expecting RGB will read the reversed red pixel as blue evidence.</p>

    <p><b>Scale and color convention combine.</b> Take byte RGB $[255,128,0]$, normalize it, and compute luminance:</p>
    <ol class="work">
      <li>normalized channels: $R=255/255=1$, $G=128/255=0.5019607843$, $B=0/255=0$</li>
      <li>luminance: $0.299(1)+0.587(0.5019607843)+0.114(0)=0.5936509804$</li>
      <li>plain average would be $(1+0.5019607843+0)/3=0.5006535948$</li>
    </ol>
    <p>The weighted value is higher because green carries a large perceptual weight. This is why a correct preprocessing line must specify both scale and color formula, not merely say "convert to gray".</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Swapping RGB and BGR.</b> The tensor shape stays $(H,W,3)$, so the error survives type checks while red evidence becomes blue evidence.</li>
      <li><b>Averaging channels when luminance is intended.</b> The orange pixel above gives $0.5006535948$ by averaging but $0.5936509804$ by luminance; that difference changes edge strength and contrast downstream.</li>
      <li><b>Mixing byte and float scales.</b> A network trained on $[0,1]$ inputs sees a raw $255$ as two hundred fifty-five times too large.</li>
      <li><b>Losing the channel axis accidentally.</b> A grayscale matrix with shape $(H,W)$ and a one-channel tensor with shape $(H,W,1)$ may render alike but batch and convolution code treat them differently.</li>
      <li><b>Forgetting that display and storage can disagree.</b> An image library may display a BGR array after silently interpreting it as RGB; always track the channel contract, not just the picture on screen.</li>
    </ul>`
};

window.ALLML_CONTENT["7.2"] = {
  tagline: "Classical features turn local intensity changes into explicit measurements, so vision can reason before it learns millions of weights.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.2-classical-features.ipynb",
  context: String.raw`
    <p>Before deep learning, vision systems survived by hand-designing the measurements they wanted from an image.</p>
    <ul>
      <li><b>Finite differences</b> turn nearby pixel comparisons into gradients, the raw material for edges and HOG descriptors.</li>
      <li><b>Histograms</b> summarize many local gradients into a robust description of a patch instead of trusting one noisy pixel.</li>
      <li><b>Voting in parameter space</b> powers the Hough transform: many weak edge pixels can jointly identify one strong line or circle.</li>
    </ul>
    <p>Where it leads: convolution (7.3) learns filters that resemble these hand-built edge detectors; CNN building blocks (7.4) automate multiscale feature extraction; and modern detectors still inherit classical habits such as local gradients, nonmaximum suppression, and geometric voting. These methods are not obsolete trivia; they are the visible skeleton under learned vision.</p>`,
  intuition: String.raw`
    <p>The concrete problem: raw pixels are too literal. Move an object a little, change lighting, or add texture, and exact pixel matching breaks. Classical features ask a better question: what local structure is present here — an edge, a corner, a repeated orientation, a line through many points?</p>
    <p>The naive approach is template matching: compare a patch directly to a stored patch. It is brittle because the same object rarely returns the exact same intensities twice. SIFT, HOG, edge filters, and Hough voting keep the parts of the image that survive nuisance changes: gradients, orientations, local neighborhoods, and geometric agreement.</p>
    <p>The design decision people gloss over is <b>what invariance to buy</b>. A HOG cell ignores the exact pixel that produced each gradient and keeps an orientation count; that helps with small shifts but loses precise texture. SIFT normalizes local orientation and scale; that helps matching but deliberately discards some pose information. Classical vision is full of these trades, made by hand rather than learned from data.</p>`,
  mathematics: String.raw`
    <p>For horizontal and vertical finite differences $G_x$ and $G_y$, a gradient feature records magnitude and orientation:</p>
    <div class="formula-box">$$m=\sqrt{G_x^2+G_y^2},\qquad \theta=\operatorname{atan2}(G_y,G_x)$$</div>
    <p>Here $G_x$ measures left-to-right change, $G_y$ measures top-to-bottom change, $m$ is edge strength, and $\theta$ is the edge's local direction before it is pooled into a descriptor or used for voting.</p>

    <p><b>A small filter already behaves like an edge test.</b> Use the notebook's patch and diagonal-difference kernel:</p>
    <ol class="work">
      <li>patch $=\begin{bmatrix}1&2\\3&4\end{bmatrix}$ and kernel $=\begin{bmatrix}1&0\\0&-1\end{bmatrix}$</li>
      <li>element products: $1,0,0,-4$</li>
      <li>sum: $1+0+0-4=-3$</li>
    </ol>
    <p>The negative response says the bottom-right intensity is larger than the top-left. Classical filters are exactly this kind of deliberately chosen comparison.</p>

    <p><b>Sliding the same test makes a feature map.</b> On the ramp from $1$ to $9$, every valid $2\times2$ window has the same diagonal gap:</p>
    <ol class="work">
      <li>top-left window gives $1-5=-4$</li>
      <li>top-right window gives $2-6=-4$</li>
      <li>bottom-left window gives $4-8=-4$</li>
      <li>bottom-right window gives $5-9=-4$</li>
    </ol>
    <p>The $2\times2$ map of all $-4$ values is what a hand-made feature detector returns when the same structure appears everywhere.</p>

    <p><b>HOG bins gradients instead of preserving pixels.</b> Suppose one cell has four gradient vectors $(3,4)$, $(0,2)$, $(-3,4)$, and $(4,0)$:</p>
    <ol class="work">
      <li>magnitudes: $\sqrt{3^2+4^2}=5$, $\sqrt{0^2+2^2}=2$, $\sqrt{(-3)^2+4^2}=5$, $\sqrt{4^2+0^2}=4$</li>
      <li>orientations are about $53.1^\circ$, $90^\circ$, $126.9^\circ$, and $0^\circ$</li>
      <li>if bins are $0^\circ$, $90^\circ$, and $180^\circ$, the middle bin receives $5+2+5=12$ while the first receives $4$</li>
    </ol>
    <p>The descriptor says this cell is dominated by upright-ish structure, even though it no longer remembers the exact four pixels that caused it.</p>

    <p><b>The Hough transform lets points vote for a line.</b> For the line form $\rho=x\cos\theta+y\sin\theta$, test vertical-line angle $\theta=0^\circ$ on three edge points:</p>
    <ol class="work">
      <li>point $(2,0)$: $\rho=2\cdot1+0\cdot0=2$</li>
      <li>point $(2,1)$: $\rho=2\cdot1+1\cdot0=2$</li>
      <li>point $(2,3)$: $\rho=2\cdot1+3\cdot0=2$</li>
    </ol>
    <p>Three separate pixels land in the same accumulator bin $(\rho,	heta)=(2,0^\circ)$, so the algorithm detects one vertical line rather than three unrelated edge points.</p>

    <p><b>Pooling makes a feature less jumpy.</b> The notebook's $4\times4$ activation map is max-pooled over non-overlapping $2\times2$ blocks:</p>
    <ol class="work">
      <li>top-left block $\begin{bmatrix}1&3\\4&6\end{bmatrix}$ has max $6$</li>
      <li>top-right block $\begin{bmatrix}2&0\\5&1\end{bmatrix}$ has max $5$</li>
      <li>bottom-left block $\begin{bmatrix}1&2\\0&1\end{bmatrix}$ has max $2$</li>
      <li>bottom-right block $\begin{bmatrix}9&8\\7&3\end{bmatrix}$ has max $9$</li>
    </ol>
    <p>The result $\begin{bmatrix}6&5\\2&9\end{bmatrix}$ keeps the strongest local evidence while forgetting its exact location inside each small block.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Calling a gradient magnitude an edge by itself.</b> The formula gives strength and orientation; a full edge detector still needs smoothing and thinning or it will fire on noise.</li>
      <li><b>Using degrees and radians interchangeably.</b> Hough voting at $0^\circ$ and $\pi/2$ radians are different bins; a unit mistake scatters votes.</li>
      <li><b>Over-pooling descriptors.</b> The max-pool example kept $6,5,2,9$ but discarded within-block positions, which is helpful for small shifts and harmful for precise localization.</li>
      <li><b>Expecting SIFT or HOG to learn new features.</b> Their measurements are fixed; if the hand-designed gradients miss the useful cue, more data will not change the descriptor.</li>
      <li><b>Forgetting that invariance loses information.</b> Orientation or histogram normalization makes matching robust, but it can erase the very pose or contrast a downstream task needs.</li>
    </ul>`
};

window.ALLML_CONTENT["7.3"] = {
  tagline: "A convolution is one small pattern-detector slid across the whole image, so the same handful of weights explains a picture of any size.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.3-convolution-operation.ipynb",
  context: String.raw`
    <p>This is the operation that turned neural networks loose on images, and it is built from parts you have already met.</p>
    <ul>
      <li><b>The dot product</b> from linear algebra is the whole engine: each output number is one kernel-sized window multiplied elementwise with the kernel and summed, so a convolution is just a dot product taken over and over at every location.</li>
      <li><b>Image representation</b> (7.1) is the input: a grid of intensities (or three stacked channels) is exactly the array the kernel slides across.</li>
      <li><b>Classical edge and gradient filters</b> (7.2) are the hand-designed version of a kernel; convolution keeps their sliding-window machinery but lets the weights be learned instead of chosen.</li>
    </ul>
    <p>Where it leads: once you can slide one kernel, the CNN building blocks (7.4) add stride, padding, and pooling to control resolution; depthwise-separable (7.6) and dilated variants (7.5) change which multiplications happen; and residual stacks (7.10) pile these layers deep. Every convolutional architecture in this part is this one operation, repeated with different kernels.</p>`,
  intuition: String.raw`
    <p>The concrete problem: an image has far too many pixels to wire each one to its own weight. A modest $200\times200$ image is $40{,}000$ inputs; a fully connected layer to another $40{,}000$ units would need $1.6$ billion weights, and it would have to learn what an edge looks like separately at every position.</p>
    <p>The naive approach — a dense layer per pixel — is not just expensive, it is blind to a basic fact about images: a cat is a cat whether it sits in the top-left or the bottom-right. The dense layer relearns the same pattern at every location from scratch. The mental model behind convolution is a single small stencil, a <b>kernel</b>, that you slide over the whole image; wherever it sits, it reports how strongly its little pattern is present.</p>
    <p>The design decision people gloss over is <b>weight sharing</b>. We deliberately force every location to use the same kernel weights. That is what makes the pattern-detector translation-equivariant (shift the input, the response shifts with it) and what collapses those billions of weights down to the handful in one kernel. The cost we accept in return is that a single kernel can only see a small neighborhood at a time — which is exactly why we later stack many layers to grow the reach.</p>`,
  mathematics: String.raw`
    <p>For an input $x$ and a $k\times k$ kernel $w$, the (cross-correlation form used in deep learning) output at location $(i,j)$ with stride $s$ is:</p>
    <div class="formula-box">$$y[i,j]=\sum_{u=0}^{k-1}\sum_{v=0}^{k-1} x[i\cdot s+u,\ j\cdot s+v]\,\; w[u,v]$$</div>
    <p>Here $x$ is the input grid, $w$ is the learned kernel (shape $k\times k$), $s$ is the stride, and $y$ is the feature map. Every entry of $y$ is one dot product between the kernel and the window it currently covers.</p>

    <p><b>One window is one dot product.</b> Place the kernel $w=\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ over the patch $\begin{bmatrix}1&2\\3&4\end{bmatrix}$. Multiply elementwise, then sum:</p>
    <ol class="work">
      <li>elementwise product: $1{\cdot}1=1,\ \ 2{\cdot}0=0,\ \ 3{\cdot}0=0,\ \ 4{\cdot}(-1)=-4$</li>
      <li>sum: $1+0+0-4=-3$</li>
    </ol>
    <p>That single number, $-3$, is the kernel's response at this position: it compared the top-left corner against the bottom-right and reported their difference. This kernel is a diagonal-gradient detector, and $-3$ says the value is rising along that diagonal.</p>

    <p><b>Sliding the kernel builds a feature map.</b> Take the ramp $x=\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}$ and slide the same kernel over all four valid $2\times2$ positions:</p>
    <ol class="work">
      <li>top-left window $\begin{bmatrix}1&2\\4&5\end{bmatrix}$: $1-5=-4$</li>
      <li>top-right window $\begin{bmatrix}2&3\\5&6\end{bmatrix}$: $2-6=-4$</li>
      <li>all four positions give $-4$, so the feature map is $\begin{bmatrix}-4&-4\\-4&-4\end{bmatrix}$</li>
    </ol>
    <p>The response is constant because the input is a perfectly linear ramp: the diagonal difference is the same everywhere. That uniform $-4$ is the visual signature of "this feature is present the same amount across the whole image" — precisely the translation-equivariance weight sharing was meant to give.</p>

    <p><b>Stride and padding set the output size.</b> Take a $5\times5$ input and a $2\times2$ kernel. The output height follows $H_{out}=\lfloor (H+2p-k)/s\rfloor+1$:</p>
    <ol class="work">
      <li>stride $s=1$, pad $p=0$: $\lfloor(5-2)/1\rfloor+1=4$, so a $4\times4$ map</li>
      <li>stride $s=2$, pad $p=0$: $\lfloor(5-2)/2\rfloor+1=2$, so a $2\times2$ map</li>
      <li>stride $s=1$, pad $p=1$: $\lfloor(5+2-2)/1\rfloor+1=6$, so a $6\times6$ map</li>
    </ol>
    <p>Stride greater than one subsamples — it is how a network shrinks resolution on purpose — while padding adds a border so the kernel can sit on edge pixels and keep the map from shrinking. The same formula in both dimensions is all the shape bookkeeping a CNN ever needs.</p>

    <p><b>Weight sharing is what makes it cheap.</b> Count the parameters this $2\times2$ kernel uses, and compare to a dense layer over the same $5\times5$ input:</p>
    <ol class="work">
      <li>convolution: $2\times2=4$ weights (plus one bias), reused at every one of the output positions</li>
      <li>dense layer $25\to25$: $25\times25=625$ weights, a different one for every input-output pair</li>
    </ol>
    <p>Four weights versus six hundred and twenty-five, and the four are the ones that generalize across position. This is the whole bargain of convolution: drastically fewer parameters, plus the built-in assumption that a useful pattern is useful wherever it appears.</p>

    <p><b>Receptive field grows with depth.</b> One output pixel of a $k\times k$ convolution depends on a $k\times k$ window of the input. Stack two such layers and the reach compounds:</p>
    <ol class="work">
      <li>one $3\times3$ layer: each output sees a $3\times3$ region</li>
      <li>two stacked $3\times3$ layers: each final output sees a $5\times5$ region</li>
      <li>after $L$ layers of a $3\times3$ kernel: receptive field $=1+2L$ in each dimension</li>
    </ol>
    <p>A single kernel is deliberately near-sighted, but stacking is how the network earns a wide view without ever using a wide kernel. That trade — small local operations composed into global understanding — is the design idea the rest of Part 7 keeps exploiting.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing convolution with true mathematical convolution.</b> Deep-learning "convolution" does not flip the kernel; it is cross-correlation, the sum $\sum x[i s+u,\,j s+v]\,w[u,v]$ above. It rarely matters because the weights are learned, but it will bite you when comparing to signal-processing formulas.</li>
      <li><b>Forgetting padding, then wondering why maps shrink.</b> Each unpadded $k\times k$ layer removes $k-1$ from every side's size; stack a few and the map silently vanishes. The shape formula with $p=0$ is what predicts it.</li>
      <li><b>Reading a constant feature map as a bug.</b> The uniform $-4$ above is correct, not broken — a linear input genuinely has a constant gradient. Expecting variety everywhere misreads what the kernel measures.</li>
      <li><b>Assuming a big receptive field for free.</b> One layer only sees $k\times k$; if a task needs global context, one convolution cannot supply it, which is the exact gap dilation (7.5) and deep stacks (7.10) exist to close.</li>
      <li><b>Treating stride and pooling as interchangeable.</b> Both shrink resolution, but a strided convolution still learns weights while max pooling just forwards the strongest activation; swapping them changes what the layer can represent.</li>
    </ul>`
};

window.ALLML_CONTENT["7.4"] = {
  tagline: "Stride, padding, and pooling are the small shape decisions that decide how much detail a CNN keeps, moves past, or throws away.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.4-cnn-building-blocks.ipynb",
  context: String.raw`
    <p>After you know what a convolution computes, this lesson explains how CNNs control where those computations land.</p>
    <ul>
      <li><b>Convolution (7.3)</b> supplies the local dot product; stride decides how many local positions are skipped between dot products.</li>
      <li><b>Image tensor shapes (7.1)</b> define the height, width, and channel axes that padding and pooling change.</li>
      <li><b>Max and average operators</b> summarize a neighborhood without learning new weights, which is why pooling can shrink maps cheaply.</li>
    </ul>
    <p>Where it leads: transposed convolutions (7.5) reverse some downsampling choices, MobileNet (7.6) makes each block cheaper, and ResNet (7.10) depends on matching shapes across shortcut paths. Most CNN bugs are not exotic math errors; they are one mistaken stride, pad, or pooling window.</p>`,
  intuition: String.raw`
    <p>The concrete problem: a CNN cannot keep every activation at full resolution forever. High-resolution maps are expensive, but shrinking too early destroys the small evidence needed for corners, text, and object boundaries.</p>
    <p>The naive approach is to stack convolutions and hope the dimensions work out. They will not. Unpadded convolutions shrink maps, stride skips positions, and pooling discards within-window location. If you do not plan these operations, the network either runs out of spatial size or produces tensors that cannot be added or concatenated.</p>
    <p>The mental model is a camera zoom schedule. Padding decides whether border pixels get a fair chance; stride decides how coarsely the kernel samples the image; pooling decides which local response survives when resolution is reduced. The design decision people gloss over is <b>where to spend resolution</b>: early layers need fine grids for edges, later layers can trade resolution for semantic breadth.</p>`,
  mathematics: String.raw`
    <p>For an input of size $n$, kernel size $k$, padding $p$, and stride $s$, the one-dimensional output size of a convolution or pooling window is:</p>
    <div class="formula-box">$$n_{out}=\left\lfloor\frac{n+2p-k}{s}\right\rfloor+1$$</div>
    <p>The same calculation applies independently to height and width. The floor is the warning: if the window does not land cleanly, the leftover border is ignored.</p>

    <p><b>A local convolution still begins with a dot product.</b> Use the same $2\times2$ patch and kernel:</p>
    <ol class="work">
      <li>$\begin{bmatrix}1&2\\3&4\end{bmatrix}\odot\begin{bmatrix}1&0\\0&-1\end{bmatrix}=\begin{bmatrix}1&0\\0&-4\end{bmatrix}$</li>
      <li>sum $=1+0+0-4=-3$</li>
    </ol>
    <p>Stride, padding, and pooling do not change what one response means; they change which windows are evaluated and how responses are retained.</p>

    <p><b>Stride shrinks by skipping landing positions.</b> A $5\times5$ input with a $2\times2$ kernel and stride $2$ gives:</p>
    <ol class="work">
      <li>$n_{out}=\left\lfloor(5+0-2)/2\right\rfloor+1$</li>
      <li>$=\lfloor1.5\rfloor+1=2$</li>
      <li>output shape is $2\times2$</li>
    </ol>
    <p>The kernel does not cover every possible starting column; it lands at positions $0$ and $2$, and the last possible offset is dropped by the floor.</p>

    <p><b>Padding gives the border more chances.</b> Use the same $5\times5$ input and $2\times2$ kernel, but add pad $1$ and stride $1$:</p>
    <ol class="work">
      <li>$n_{out}=\left\lfloor(5+2\cdot1-2)/1\right\rfloor+1$</li>
      <li>$=\lfloor5\rfloor+1=6$</li>
      <li>output shape is $6\times6$</li>
    </ol>
    <p>Padding has enlarged the working canvas from $5$ to $7$ before the $2$-wide kernel slides, so the feature map grows instead of shrinks.</p>

    <p><b>Pooling summarizes windows without weights.</b> The notebook's max pool uses $2\times2$ windows with stride $2$ on a $4\times4$ map:</p>
    <ol class="work">
      <li>$\max\begin{bmatrix}1&3\\4&6\end{bmatrix}=6$</li>
      <li>$\max\begin{bmatrix}2&0\\5&1\end{bmatrix}=5$</li>
      <li>$\max\begin{bmatrix}1&2\\0&1\end{bmatrix}=2$</li>
      <li>$\max\begin{bmatrix}9&8\\7&3\end{bmatrix}=9$</li>
    </ol>
    <p>The pooled output $\begin{bmatrix}6&5\\2&9\end{bmatrix}$ keeps strongest local evidence, which is useful for recognition but costly for exact localization.</p>

    <p><b>Channels change the parameter count, not the spatial formula.</b> Suppose a $3\times3$ convolution maps $3$ input channels to $8$ output channels on a padded $32\times32$ image:</p>
    <ol class="work">
      <li>spatial size: $\left\lfloor(32+2\cdot1-3)/1\right\rfloor+1=32$</li>
      <li>weights per output channel: $3\times3\times3=27$</li>
      <li>total weights: $27\times8=216$</li>
      <li>output tensor shape: $32\times32\times8$</li>
    </ol>
    <p>The padding preserves height and width, while the number of filters chooses the new channel depth.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Dropping the floor in the size formula.</b> The stride-$2$ example gives $2$, not $2.5$; fractional landings are not real output cells.</li>
      <li><b>Assuming padding always preserves size.</b> With a $2\times2$ kernel and pad $1$, the map grew to $6\times6$; same-size padding depends on kernel size.</li>
      <li><b>Using pooling where a learned downsampler is needed.</b> Max pooling forwards $6,5,2,9$ but cannot learn to prefer a weaker activation that is more meaningful.</li>
      <li><b>Forgetting channel depth in parameters.</b> A $3\times3$ filter over RGB has $27$ weights, not $9$.</li>
      <li><b>Breaking residual or concat paths with one shape choice.</b> A shortcut add needs identical spatial and channel dimensions, so a stray stride or missing projection becomes a structural bug.</li>
    </ul>`
};

window.ALLML_CONTENT["7.5"] = {
  tagline: "Dilated convolutions widen what a filter can see, while transposed convolutions learn how to put coarse maps back onto a larger grid.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.5-transposed-dilated-convolutions.ipynb",
  context: String.raw`
    <p>This lesson is about changing spatial reach without simply stacking more ordinary convolutions.</p>
    <ul>
      <li><b>CNN shape arithmetic (7.4)</b> supplies the output-size formulas that dilation and transposed convolution modify.</li>
      <li><b>Convolutional kernels (7.3)</b> remain the learned local patterns; dilation spaces their taps apart instead of adding more weights.</li>
      <li><b>Encoder-decoder thinking</b> motivates learned upsampling: segmentation and generation need maps that recover spatial detail after compression.</li>
    </ul>
    <p>Where it leads: semantic segmentation (7.18) uses dilation to keep resolution while seeing context, super-resolution (7.24) needs learned upsampling, and modern decoders combine transposed convolutions with skip connections to avoid blurry outputs. These operations are shape tools, but they change what evidence each output can access.</p>`,
  intuition: String.raw`
    <p>The concrete problem: standard convolution has a narrow view, and standard pooling or stride makes maps smaller. Sometimes you want a larger view without losing resolution; other times you already lost resolution and need to rebuild a larger feature map.</p>
    <p>The naive fixes are unsatisfying. A huge kernel adds many weights, many layers add latency, and nearest-neighbor upsampling only copies values without learning how boundaries should look. Dilation inserts gaps between kernel taps, expanding receptive field at the same parameter count. Transposed convolution spreads each input activation across a larger output grid using learned weights.</p>
    <p>The design decision people gloss over is <b>where zeros enter the computation</b>. Dilation inserts gaps inside the kernel footprint; transposed convolution inserts gaps between input positions before filtering. Those zeros are not harmless bookkeeping: they decide which outputs share evidence and can create gridding or checkerboard artifacts when strides and kernels line up badly.</p>`,
  mathematics: String.raw`
    <p>A dilated convolution has effective kernel size $k_{eff}=k+(k-1)(d-1)$, while a transposed convolution has output size:</p>
    <div class="formula-box">$$n_{out}^{trans}=(n_{in}-1)s-2p+k+o$$</div>
    <p>Here $k$ is kernel size, $d$ is dilation rate, $s$ is stride, $p$ is padding, and $o$ is output padding. Dilation changes the receptive footprint; transposed convolution changes how a smaller grid expands.</p>

    <p><b>Dilation widens a kernel without adding weights.</b> Take a $3$-tap one-dimensional kernel with dilation $2$:</p>
    <ol class="work">
      <li>$k_{eff}=3+(3-1)(2-1)$</li>
      <li>$=3+2=5$</li>
      <li>the three learned taps touch positions $0,2,4$ inside a width-$5$ footprint</li>
    </ol>
    <p>The filter sees across five input positions but still owns only three weights, which is the attraction of dilation for dense prediction.</p>

    <p><b>A dilated dot product skips over input values.</b> Use input $[1,2,3,4,5]$ and weights $[1,0,-1]$ at dilation $2$:</p>
    <ol class="work">
      <li>sampled input positions are $1,3,5$</li>
      <li>products are $1\cdot1=1$, $3\cdot0=0$, $5\cdot(-1)=-5$</li>
      <li>sum $=1+0-5=-4$</li>
    </ol>
    <p>The middle values $2$ and $4$ are inside the footprint but not touched by this kernel. That is why dilation can miss fine alternating patterns.</p>

    <p><b>Transposed convolution expands a grid by formula.</b> Start from a length-$3$ feature map, stride $2$, kernel $3$, no padding, and output padding $0$:</p>
    <ol class="work">
      <li>$n_{out}^{trans}=(3-1)2-2\cdot0+3+0$</li>
      <li>$=4+3=7$</li>
      <li>three coarse positions become a length-$7$ learned output</li>
    </ol>
    <p>This is not the inverse of a particular convolution's values; it is the shape-adjoint operation that learns how coarse activations paint a larger canvas.</p>

    <p><b>Output padding resolves one-cell ambiguity.</b> Keep $n_{in}=3$, $s=2$, $p=1$, $k=3$, and compare $o=0$ to $o=1$:</p>
    <ol class="work">
      <li>with $o=0$: $(3-1)2-2+3+0=5$</li>
      <li>with $o=1$: $(3-1)2-2+3+1=6$</li>
      <li>one parameter changes the output length from $5$ to $6$</li>
    </ol>
    <p>Output padding does not add learned content; it chooses the target shape when stride arithmetic leaves two plausible sizes.</p>

    <p><b>Uneven overlap explains checkerboards.</b> In one dimension, stride $2$ and kernel $3$ cause adjacent expanded positions to receive different numbers of contributions:</p>
    <ol class="work">
      <li>input activation at position $0$ writes to output positions $0,1,2$</li>
      <li>input activation at position $1$ writes to output positions $2,3,4$</li>
      <li>position $2$ receives $2$ contributions, while positions $0,1,3,4$ receive $1$ each</li>
    </ol>
    <p>That uneven coverage is the arithmetic source of checkerboard texture in images; resize-then-convolve avoids it by making coverage uniform before learning the filter.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Thinking dilation creates more parameters.</b> A $3$-tap kernel at dilation $2$ still has $3$ weights; only its effective footprint grows to $5$.</li>
      <li><b>Calling transposed convolution true deconvolution.</b> The formula expands shape, but it does not recover information destroyed by stride or pooling.</li>
      <li><b>Ignoring output padding.</b> The same transposed settings above produce length $5$ or $6$ depending on $o$, so decoder skip connections can miss by one.</li>
      <li><b>Creating gridding with large dilation.</b> The skipped values $2$ and $4$ show how dilation can repeatedly overlook interleaved evidence.</li>
      <li><b>Using stride-kernel pairs with uneven overlap.</b> When some output pixels receive two contributions and others one, checkerboard artifacts are a mathematical consequence, not a mysterious training failure.</li>
    </ul>`
};

window.ALLML_CONTENT["7.6"] = {
  tagline: "Depthwise-separable convolution saves work by separating where to look from how channels should mix.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.6-depthwise-separable-convolutions.ipynb",
  context: String.raw`
    <p>MobileNet's central trick is not a new visual feature; it is a cheaper factorization of the same convolutional job.</p>
    <ul>
      <li><b>Standard convolution (7.3)</b> mixes spatial neighborhoods and input channels in one dense kernel.</li>
      <li><b>Channel-aware tensor shapes (7.1)</b> tell us why an RGB or feature tensor has both spatial axes and a channel axis to process.</li>
      <li><b>Parameter counting</b> exposes the bargain: split a costly operation into a depthwise spatial step and a pointwise channel-mixing step.</li>
    </ul>
    <p>Where it leads: MobileNet-style blocks make CNNs practical on phones and browsers, squeeze-and-excitation (7.7) then learns which channels matter, and EfficientNet (7.11) scales these efficient blocks carefully. The lesson is a recurring engineering idea: factor the expensive tensor operation along axes that have different roles.</p>`,
  intuition: String.raw`
    <p>The concrete problem: a normal convolution is expensive because every output channel looks at every input channel across every spatial offset. That is powerful, but it repeats channel mixing inside each spatial location of the kernel.</p>
    <p>The naive solution is to use fewer filters, which saves compute by shrinking the model's vocabulary of visual features. Depthwise-separable convolution is more surgical: first learn one spatial filter per input channel, then use $1\times1$ filters to combine channels. It keeps local pattern detection and cross-channel mixing, but refuses to pay for doing both at once.</p>
    <p>The design decision people gloss over is <b>accepting a factorization constraint</b>. A standard kernel can learn a different spatial pattern for every input-output channel pair. A separable block says: spatial filtering happens independently per channel, and only afterward do channels talk. That restriction is the source of both the speedup and the possible accuracy loss.</p>`,
  mathematics: String.raw`
    <p>For a $D\times D$ kernel, $C$ input channels, and $C'$ output channels, the multiply count per output pixel is:</p>
    <div class="formula-box">$$M_{std}=D^2CC',\qquad M_{sep}=D^2C+CC'$$</div>
    <p>$M_{std}$ is the ordinary convolution cost, and $M_{sep}$ is the depthwise spatial cost plus the $1\times1$ pointwise channel-mixing cost.</p>

    <p><b>A standard convolution pays for every channel pair.</b> With $D=3$, $C=3$, and $C'=8$:</p>
    <ol class="work">
      <li>spatial weights per pair: $3\times3=9$</li>
      <li>input-output channel pairs: $3\times8=24$</li>
      <li>total multiplies per output pixel: $9\times24=216$</li>
    </ol>
    <p>Those $216$ multiplications let every output channel use a separate spatial kernel for every input channel.</p>

    <p><b>The depthwise step filters each channel alone.</b> Use the same $D=3$ and $C=3$:</p>
    <ol class="work">
      <li>one $3\times3$ spatial filter has $9$ weights</li>
      <li>one filter per input channel gives $9\times3=27$ multiplies</li>
      <li>the number of channels after depthwise filtering is still $3$</li>
    </ol>
    <p>This step learns where to look inside each channel but cannot yet combine red with green or one feature map with another.</p>

    <p><b>The pointwise step mixes channels cheaply.</b> Now map $C=3$ channels to $C'=8$ channels using $1\times1$ kernels:</p>
    <ol class="work">
      <li>one output channel uses $3$ weights across the input channels</li>
      <li>eight output channels use $3\times8=24$ weights</li>
      <li>pointwise cost per spatial location is $24$ multiplies</li>
    </ol>
    <p>The $1\times1$ layer is where channels finally interact, but it has no spatial footprint beyond the current pixel.</p>

    <p><b>The savings are large even in a toy case.</b> Compare the two costs:</p>
    <ol class="work">
      <li>separable cost: $27+24=51$</li>
      <li>standard cost: $216$</li>
      <li>ratio: $51/216=0.236111\ldots$</li>
      <li>reduction: $1-0.236111\ldots=0.763888\ldots$</li>
    </ol>
    <p>The separable block uses about $23.6$ percent of the multiplications, a $76.4$ percent cut, before considering hardware effects.</p>

    <p><b>On a small feature map, the per-pixel saving multiplies.</b> For a $5\times5$ output grid with the same channels:</p>
    <ol class="work">
      <li>standard multiplies: $25\times216=5400$</li>
      <li>separable multiplies: $25\times51=1275$</li>
      <li>saved multiplies: $5400-1275=4125$</li>
    </ol>
    <p>MobileNet wins because this arithmetic repeats at every location and every layer, turning a local factorization into a network-level speedup.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Forgetting the pointwise cost.</b> Depthwise alone costs $27$ in the toy case, but the full separable block costs $51$ because channels still need to mix.</li>
      <li><b>Expecting identical expressiveness.</b> The standard $216$-multiply kernel can choose a different spatial pattern for every channel pair; the separable version cannot.</li>
      <li><b>Using depthwise filters when channels are already too narrow.</b> If $C$ is tiny, the $CC'$ pointwise term dominates and the representational bottleneck can hurt.</li>
      <li><b>Ignoring memory movement.</b> Arithmetic drops sharply, but hardware speed also depends on reading and writing the intermediate depthwise tensor.</li>
      <li><b>Confusing groups with depthwise.</b> Depthwise means one spatial filter per input channel; grouped convolution is a broader family where each group may contain multiple channels.</li>
    </ul>`
};

window.ALLML_CONTENT["7.7"] = {
  tagline: "Squeeze-and-Excitation lets a CNN pause, look across the whole feature map, and decide which channels deserve a louder voice.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.7-squeeze-excitation-blocks.ipynb",
  context: String.raw`
    <p>Convolutions build channels, but an SE block teaches the network to recalibrate those channels based on the image it is actually seeing.</p>
    <ul>
      <li><b>Global average pooling</b> compresses each feature map into one channel descriptor, preserving channel identity while discarding spatial position.</li>
      <li><b>Small neural networks</b> turn the descriptor into gates through a bottleneck, nonlinearity, and sigmoid.</li>
      <li><b>Channel-wise multiplication</b> applies the learned gates back to the original tensor, boosting useful maps and damping weaker ones.</li>
    </ul>
    <p>Where it leads: MobileNet variants (7.6) and EfficientNet (7.11) use channel attention to recover accuracy from efficient blocks, while later attention models generalize the same idea from channel selection to token and patch selection. SE is the bridge between plain convolution and adaptive attention.</p>`,
  intuition: String.raw`
    <p>The concrete problem: a convolutional layer emits many channels, but their usefulness changes from image to image. A "fur texture" channel may matter for a dog image and be irrelevant for a traffic-sign image.</p>
    <p>The naive CNN treats each channel with fixed importance once the weights are trained. SE adds an image-conditioned volume knob. It squeezes each channel down to its average activation, passes those summaries through a tiny gating network, and multiplies each original channel by its gate.</p>
    <p>The design decision people gloss over is <b>using global context to modulate local maps</b>. The squeeze step throws away where a feature occurred, keeping only how strongly it appeared overall. That is exactly right when you want channel importance, and exactly wrong if the task needs the gate to depend on location.</p>`,
  mathematics: String.raw`
    <p>For feature tensor $U\in\mathbb{R}^{H\times W\times C}$, an SE block computes channel means $z_c$ and gates $s$:</p>
    <div class="formula-box">$$z_c={1\over HW}\sum_{i=1}^{H}\sum_{j=1}^{W}U_{i,j,c},\qquad s=\sigma\left(W_2\operatorname{ReLU}(W_1z)\right),\qquad \tilde U_{i,j,c}=s_cU_{i,j,c}$$</div>
    <p>Here $z$ summarizes channels, $W_1$ and $W_2$ form the excitation network, $s_c$ is the channel gate, and $\tilde U$ is the recalibrated tensor.</p>

    <p><b>Squeeze turns each map into one number.</b> For channel $1$ with activations $\begin{bmatrix}1&3\\5&7\end{bmatrix}$:</p>
    <ol class="work">
      <li>sum $=1+3+5+7=16$</li>
      <li>number of spatial positions $=2\times2=4$</li>
      <li>mean $z_1=16/4=4$</li>
    </ol>
    <p>The channel descriptor says this feature is strongly present overall, but it no longer knows whether the peak was top-right or bottom-left.</p>

    <p><b>A second channel can tell a different story.</b> For channel $2$ with activations $\begin{bmatrix}2&0\\2&0\end{bmatrix}$:</p>
    <ol class="work">
      <li>sum $=2+0+2+0=4$</li>
      <li>mean $z_2=4/4=1$</li>
      <li>descriptor vector is $z=[4,1]$</li>
    </ol>
    <p>The squeeze stage has reduced a $2\times2\times2$ tensor to two global channel statistics.</p>

    <p><b>The bottleneck can mix channel evidence.</b> Let $W_1=[0.5, -1]$ map $z=[4,1]$ to one hidden unit:</p>
    <ol class="work">
      <li>pre-activation $=0.5\cdot4+(-1)\cdot1=1$</li>
      <li>ReLU output $=\max(0,1)=1$</li>
      <li>the hidden summary keeps positive evidence after combining both channels</li>
    </ol>
    <p>The excitation network is not just thresholding each mean independently; it can learn that one channel should change the interpretation of another.</p>

    <p><b>Sigmoid turns scores into gates.</b> Let $W_2=\begin{bmatrix}2\\-1\end{bmatrix}$ and hidden value $1$:</p>
    <ol class="work">
      <li>channel scores are $[2\cdot1,-1\cdot1]=[2,-1]$</li>
      <li>$\sigma(2)=1/(1+e^{-2})\approx0.8808$</li>
      <li>$\sigma(-1)=1/(1+e^1)\approx0.2689$</li>
    </ol>
    <p>The first channel is amplified relative to the second, not by a fixed constant but by the current image's own channel summary.</p>

    <p><b>Gates rescale the original maps.</b> Apply $s=[0.8808,0.2689]$ to the two channels above:</p>
    <ol class="work">
      <li>channel $1$ top-left value: $0.8808\cdot1=0.8808$</li>
      <li>channel $1$ bottom-right value: $0.8808\cdot7=6.1656$</li>
      <li>channel $2$ left-column value: $0.2689\cdot2=0.5378$</li>
      <li>channel $2$ zero value remains $0.2689\cdot0=0$</li>
    </ol>
    <p>The spatial pattern inside each channel is preserved, but the channel's volume changes everywhere.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Reading SE as spatial attention.</b> The gate $s_c$ is constant over $i,j$, so it cannot highlight one corner of a feature map differently from another.</li>
      <li><b>Forgetting the squeeze loses location.</b> The mean $z_1=4$ would be identical for many different $2\times2$ arrangements.</li>
      <li><b>Letting sigmoid saturate.</b> Very large positive or negative scores make gates near $1$ or $0$, where gradients through $\sigma$ become small.</li>
      <li><b>Using too narrow a bottleneck.</b> If $W_1$ compresses many channels into too few hidden units, useful channel interactions are forced through an information pinch point.</li>
      <li><b>Multiplying the wrong axis.</b> The gate vector has length $C$; broadcasting it over height or width instead of channels silently changes the operation.</li>
    </ul>`
};

window.ALLML_CONTENT["7.8"] = {
  tagline: "LeNet and AlexNet show the moment vision networks became engineered pipelines: local filters, shrinking maps, nonlinearities, and classifiers arranged end to end.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.8-lenet-alexnet.ipynb",
  context: String.raw`
    <p>This lesson studies two historical architectures because they made different eras of CNN design concrete.</p>
    <ul>
      <li><b>Convolution and pooling (7.3, 7.4)</b> provide the repeated pattern: detect local features, then reduce spatial size.</li>
      <li><b>Nonlinear activations</b> let stacked filters build richer decisions than a single linear template could.</li>
      <li><b>Parameter and shape accounting</b> explains why AlexNet needed GPUs, data augmentation, and regularization while LeNet could stay small.</li>
    </ul>
    <p>Where it leads: VGG and Inception (7.9) refine the block choices, ResNet (7.10) fixes optimization at far greater depth, and EfficientNet (7.11) scales architectures more systematically. LeNet and AlexNet are the prototypes behind those later improvements.</p>`,
  intuition: String.raw`
    <p>The concrete problem: handwritten digits and natural images both contain local patterns, but their scale and variability differ enormously. A digit recognizer can be compact; an ImageNet model needs many filters and aggressive regularization.</p>
    <p>The naive pre-CNN approach flattened the image early, losing the fact that neighboring pixels form strokes and textures. LeNet kept spatial structure through convolution and pooling before classification. AlexNet kept the same core idea but made it much wider and deeper, used ReLU to train faster, and leaned on data and compute.</p>
    <p>The design decision people gloss over is <b>when to stop being spatial</b>. Early layers should preserve layout, because edges and corners live in neighborhoods. Late fully connected layers discard exact position to make a category decision. LeNet and AlexNet differ partly in how much spatial processing they can afford before that flattening step.</p>`,
  mathematics: String.raw`
    <p>For each convolutional layer, the output size is governed by the same CNN shape equation:</p>
    <div class="formula-box">$$H_{out}=\left\lfloor{H+2p-k\over s}\right\rfloor+1,\qquad W_{out}=\left\lfloor{W+2p-k\over s}\right\rfloor+1$$</div>
    <p>Here $H,W$ are input height and width, $k$ is kernel size, $p$ is padding, and $s$ is stride. Architecture diagrams are just this formula repeated layer by layer.</p>

    <p><b>LeNet's first convolution turns a digit into feature maps.</b> Use the classic $32\times32$ input, $5\times5$ kernels, stride $1$, no padding, and $6$ filters:</p>
    <ol class="work">
      <li>spatial size: $(32+0-5)/1+1=28$</li>
      <li>output shape: $28\times28\times6$</li>
      <li>weights: $5\times5\times1\times6=150$</li>
    </ol>
    <p>The layer learns six local stroke detectors and applies each one across the whole digit.</p>

    <p><b>LeNet pooling halves the grid.</b> A $2\times2$ pool with stride $2$ acts on the $28\times28\times6$ maps:</p>
    <ol class="work">
      <li>height: $\left\lfloor(28-2)/2\right\rfloor+1=14$</li>
      <li>width: $14$ by the same calculation</li>
      <li>output shape: $14\times14\times6$</li>
    </ol>
    <p>The channel count stays $6$ because pooling summarizes within each channel rather than creating new filters.</p>

    <p><b>AlexNet's first layer is deliberately coarse.</b> With input $227\times227\times3$, $11\times11$ kernels, stride $4$, and $96$ filters:</p>
    <ol class="work">
      <li>spatial size: $\left\lfloor(227-11)/4\right\rfloor+1=55$</li>
      <li>output shape: $55\times55\times96$</li>
      <li>weights: $11\times11\times3\times96=34848$</li>
    </ol>
    <p>The large stride quickly reduces a natural image to a manageable grid, at the cost of skipping fine landing positions.</p>

    <p><b>ReLU made AlexNet easier to optimize.</b> Compare a few pre-activations under $\operatorname{ReLU}(a)=\max(0,a)$:</p>
    <ol class="work">
      <li>$\operatorname{ReLU}(-3)=0$</li>
      <li>$\operatorname{ReLU}(0.5)=0.5$</li>
      <li>$\operatorname{ReLU}(4)=4$</li>
    </ol>
    <p>Positive signals pass without the saturation that slowed older sigmoid networks, which mattered when training a much deeper visual model.</p>

    <p><b>Fully connected layers dominate parameters.</b> If a late feature tensor has $6\times6\times256$ activations and connects to $4096$ units:</p>
    <ol class="work">
      <li>flattened inputs: $6\times6\times256=9216$</li>
      <li>dense weights: $9216\times4096=37{,}748{,}736$</li>
      <li>biases add $4096$, for $37{,}752{,}832$ parameters</li>
    </ol>
    <p>This is why AlexNet needed dropout and why later architectures worked hard to reduce or replace huge dense classifiers.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Flattening too early.</b> Once an image becomes a vector, the network no longer gets convolution's weight sharing over rows and columns.</li>
      <li><b>Forgetting AlexNet's stride cost.</b> The first layer jumps by $4$ pixels, which saves compute but can lose small details.</li>
      <li><b>Comparing LeNet and AlexNet only by depth.</b> Input scale, channel count, ReLU, augmentation, and dense-layer size all changed the training problem.</li>
      <li><b>Ignoring dense parameter explosions.</b> The $37{,}752{,}832$-parameter classifier can dominate memory even after convolutions have shrunk the map.</li>
      <li><b>Copying historical kernels blindly.</b> An $11\times11$ first kernel made sense for early ImageNet hardware and design; modern networks often prefer smaller stacked kernels.</li>
    </ul>`
};

window.ALLML_CONTENT["7.9"] = {
  tagline: "VGG asks how far simple repeated small filters can go, while Inception asks the network to choose among several filter scales at once.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.9-vgg-inception.ipynb",
  context: String.raw`
    <p>This lesson compares two architectural philosophies that grew out of AlexNet's success.</p>
    <ul>
      <li><b>Receptive fields</b> explain why stacked $3\times3$ filters can cover the same area as one larger filter while adding more nonlinearities.</li>
      <li><b>Channel concatenation</b> is Inception's assembly rule: branch outputs line up spatially and stack along channels.</li>
      <li><b>Pointwise convolution</b> makes multi-branch design affordable by reducing channel counts before expensive spatial filters.</li>
    </ul>
    <p>Where it leads: ResNet (7.10) keeps VGG's small-kernel habit but adds shortcuts, EfficientNet (7.11) inherits Inception's obsession with efficient scaling, and later vision transformers (7.20) continue the same question of how to combine evidence at multiple scales.</p>`,
  intuition: String.raw`
    <p>The concrete problem: visual objects contain small edges, medium parts, and larger arrangements. One fixed kernel size is a bet about the scale that matters most.</p>
    <p>VGG makes a disciplined bet: use $3\times3$ everywhere, stack many layers, and let depth build large receptive fields. Inception makes a plural bet: run several branches in parallel — $1\times1$, $3\times3$, $5\times5$, pooling — then concatenate their answers so the next layer can decide which scale was useful.</p>
    <p>The design decision people gloss over is <b>simplicity versus branching</b>. VGG is easy to read and expensive. Inception is more efficient but demands careful channel budgeting so branches produce compatible spatial shapes and affordable channel counts.</p>`,
  mathematics: String.raw`
    <p>The two core calculations are VGG's stacked receptive field and Inception's channel concatenation:</p>
    <div class="formula-box">$$r_L=1+L(k-1),\qquad C_{out}=C_1+C_3+C_5+C_p$$</div>
    <p>For stride-$1$ stacked kernels, $r_L$ is the receptive field after $L$ layers of kernel size $k$. In an Inception module, branch channel counts add when spatial sizes match.</p>

    <p><b>Two VGG-style small filters see a $5\times5$ patch.</b> Stack two $3\times3$ convolutions at stride $1$:</p>
    <ol class="work">
      <li>after one layer: $r_1=1+1(3-1)=3$</li>
      <li>after two layers: $r_2=1+2(3-1)=5$</li>
      <li>the final activation depends on a $5\times5$ input region</li>
    </ol>
    <p>VGG gets a large view by composition, not by immediately using a large kernel.</p>

    <p><b>Stacked $3\times3$ filters can use fewer weights than one $5\times5$.</b> Compare one input channel and one output channel for intuition:</p>
    <ol class="work">
      <li>one $5\times5$ layer uses $25$ weights</li>
      <li>two $3\times3$ layers use $9+9=18$ weights</li>
      <li>saving is $25-18=7$ weights, plus an extra nonlinearity between layers</li>
    </ol>
    <p>With real channel counts the comparison is more nuanced, but this arithmetic explains why small kernels became attractive.</p>

    <p><b>Inception concatenates branch channels.</b> Suppose four branches produce $16$, $32$, $8$, and $8$ channels at the same spatial size:</p>
    <ol class="work">
      <li>total channels: $16+32+8+8=64$</li>
      <li>if the spatial grid is $28\times28$, output shape is $28\times28\times64$</li>
      <li>the next layer receives all branch features side by side</li>
    </ol>
    <p>The module does not average scales; it preserves separate scale-specific evidence as channels.</p>

    <p><b>A $1\times1$ bottleneck saves a larger branch.</b> Feed a $5\times5$ branch from $64$ channels to $32$ outputs, either directly or after reducing to $16$ channels:</p>
    <ol class="work">
      <li>direct $5\times5$ cost per pixel: $5\times5\times64\times32=51200$</li>
      <li>reduction cost: $1\times1\times64\times16=1024$</li>
      <li>reduced $5\times5$ cost: $5\times5\times16\times32=12800$</li>
      <li>total with bottleneck: $1024+12800=13824$</li>
    </ol>
    <p>The bottleneck keeps the branch affordable, cutting this branch from $51200$ to $13824$ multiplies per location.</p>

    <p><b>Branches must agree spatially before concatenation.</b> On a $28\times28$ input, compare a padded $3\times3$ branch and an unpadded one:</p>
    <ol class="work">
      <li>with pad $1$: $\left\lfloor(28+2-3)/1\right\rfloor+1=28$</li>
      <li>with pad $0$: $\left\lfloor(28-3)/1\right\rfloor+1=26$</li>
      <li>$28\times28$ and $26\times26$ cannot be concatenated along channels</li>
    </ol>
    <p>Inception modules look flexible, but they are held together by strict shape arithmetic.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Thinking VGG's small filters are shallow.</b> Two $3\times3$ layers already see $5\times5$, and deeper stacks keep expanding the receptive field.</li>
      <li><b>Concatenating mismatched branch sizes.</b> Channels can add only after height and width agree, as the $28$ versus $26$ example shows.</li>
      <li><b>Omitting the bottleneck in Inception.</b> The direct $5\times5$ branch cost of $51200$ multiplies can swamp the module.</li>
      <li><b>Assuming branch outputs are competing probabilities.</b> Inception concatenates features; it does not choose one branch and discard the others.</li>
      <li><b>Copying VGG depth without residual shortcuts.</b> Plain deep stacks become hard to optimize, which is precisely why ResNet follows next.</li>
    </ul>`
};

window.ALLML_CONTENT["7.10"] = {
  tagline: "Residual learning makes a deep network learn corrections to an identity path instead of rebuilding the whole signal at every block.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.10-resnet-residual-learning.ipynb",
  context: String.raw`
    <p>ResNet solved a practical mystery: making a plain CNN deeper could make training worse, even when the deeper model should have enough capacity.</p>
    <ul>
      <li><b>Function composition</b> explains the problem: many nonlinear layers must preserve useful information while also transforming it.</li>
      <li><b>Shape matching</b> from CNN blocks (7.4) is required because a residual add needs tensors with identical dimensions.</li>
      <li><b>Gradient flow</b> improves because the shortcut gives derivatives a direct route backward through the identity term.</li>
    </ul>
    <p>Where it leads: DenseNet (7.11) pushes feature reuse further with concatenation, modern ConvNeXt blocks (7.12) still inherit residual design, and vision transformers (7.20) use residual connections around attention and MLP sublayers. The shortcut became a default piece of deep learning architecture.</p>`,
  intuition: String.raw`
    <p>The concrete problem: a very deep plain network should be able to imitate a shallower one by learning identity layers, but in practice that identity is hard to discover through many stacked convolutions.</p>
    <p>The naive block asks its layers to produce the entire desired output $H(x)$. A residual block instead carries $x$ forward unchanged and asks the layers to learn only $F(x)=H(x)-x$, the correction. If no correction is useful, setting $F(x)$ near zero keeps the block near identity.</p>
    <p>The design decision people gloss over is <b>addition rather than concatenation</b>. Addition keeps the channel count fixed and forces the residual branch to speak in the same coordinate system as the shortcut. That is efficient and stabilizing, but it means shapes must match exactly or a projection must be learned.</p>`,
  mathematics: String.raw`
    <p>A residual block computes:</p>
    <div class="formula-box">$$y=x+F(x;W)$$</div>
    <p>Here $x$ is the shortcut tensor, $F(x;W)$ is the learned residual branch with weights $W$, and $y$ is the block output. Addition is elementwise, so $x$ and $F(x;W)$ must have the same shape.</p>

    <p><b>The residual branch learns a correction.</b> Use the concrete vector $x=[1,2,3]$ and residual $F=[0.1,-0.2,0.3]$:</p>
    <ol class="work">
      <li>first coordinate: $1+0.1=1.1$</li>
      <li>second coordinate: $2+(-0.2)=1.8$</li>
      <li>third coordinate: $3+0.3=3.3$</li>
      <li>output $y=[1.1,1.8,3.3]$</li>
    </ol>
    <p>The block changed the input only where the learned branch supplied a nonzero correction.</p>

    <p><b>Identity is easy when the correction is zero.</b> If the same block has $F=[0,0,0]$:</p>
    <ol class="work">
      <li>$1+0=1$</li>
      <li>$2+0=2$</li>
      <li>$3+0=3$</li>
      <li>$y=x=[1,2,3]$</li>
    </ol>
    <p>A deep residual network can choose to leave a representation alone, which a plain stack must learn through its weights.</p>

    <p><b>The backward path also has an identity term.</b> For scalar loss $L$ and scalar block $y=x+F(x)$, the derivative is $dL/dx=(dL/dy)(1+dF/dx)$. Let $dL/dy=2$ and $dF/dx=0.1$:</p>
    <ol class="work">
      <li>$1+dF/dx=1+0.1=1.1$</li>
      <li>$dL/dx=2\cdot1.1=2.2$</li>
      <li>without the shortcut term, the branch-only contribution would be $2\cdot0.1=0.2$</li>
    </ol>
    <p>The shortcut does not make gradients magical, but it gives them a direct additive route that plain deep stacks lack.</p>

    <p><b>Projection fixes channel mismatch.</b> Suppose $x$ has $64$ channels but the residual branch outputs $128$ channels:</p>
    <ol class="work">
      <li>plain addition is invalid: $64\ne128$</li>
      <li>a $1\times1$ projection from $64$ to $128$ uses $1\times1\times64\times128=8192$ weights</li>
      <li>after projection, both paths have $128$ channels and can be added</li>
    </ol>
    <p>The projection is not decoration; it changes the shortcut into the right coordinate system for the residual sum.</p>

    <p><b>Downsampling residual blocks must align both paths.</b> If a block takes $56\times56\times64$ to $28\times28\times128$ with stride $2$:</p>
    <ol class="work">
      <li>residual branch spatial size: $56/2=28$ under stride $2$</li>
      <li>shortcut must also use stride $2$ to become $28\times28$</li>
      <li>shortcut projection must map $64$ channels to $128$ channels</li>
      <li>only then are both tensors $28\times28\times128$</li>
    </ol>
    <p>A residual add is simple only after the architecture has done careful shape matching.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Adding tensors with mismatched shapes.</b> Residual addition is elementwise, so height, width, and channels must all agree.</li>
      <li><b>Thinking the residual branch should learn the full target.</b> The formula is $x+F(x)$; the branch learns the correction, not a replacement for the shortcut.</li>
      <li><b>Forgetting projection cost.</b> The $1\times1$ shortcut with $8192$ weights is sometimes necessary, but it is still a learned layer.</li>
      <li><b>Using a shortcut across incompatible semantics.</b> Addition assumes both paths use the same coordinate meaning; careless projections can align shape while mixing incompatible features.</li>
      <li><b>Assuming shortcuts remove all optimization problems.</b> They improve gradient flow, but normalization, initialization, learning rate, and depth still matter.</li>
    </ul>`
};

window.ALLML_CONTENT["7.11"] = {
  tagline: "DenseNet reuses features by concatenating them, while EfficientNet scales depth, width, and resolution as a coordinated budget rather than a guessing game.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.11-densenet-efficientnet.ipynb",
  context: String.raw`
    <p>This lesson pairs two answers to the same question: how should a CNN grow without wasting computation?</p>
    <ul>
      <li><b>Residual learning (7.10)</b> motivates feature reuse; DenseNet keeps earlier features by concatenating rather than adding.</li>
      <li><b>Channel accounting</b> is central because DenseNet's growth rate increases channels layer by layer.</li>
      <li><b>Scaling laws</b> frame EfficientNet's compound rule, where depth, width, and input resolution rise together under a compute budget.</li>
    </ul>
    <p>Where it leads: efficient architecture design continues into ConvNeXt (7.12), mobile CNNs, and model-family scaling across many deployment budgets. DenseNet teaches reuse; EfficientNet teaches disciplined scaling.</p>`,
  intuition: String.raw`
    <p>The concrete problem: deeper and wider CNNs often improve accuracy, but naive growth repeats features, bloats channels, and burns compute unevenly. If you only add layers, the model may lack capacity per layer; if you only widen, it may miss depth; if you only raise image resolution, it may not have enough features to use the detail.</p>
    <p>DenseNet's mental model is a shared notebook: every layer writes a few new feature maps and every later layer can read all previous pages. EfficientNet's mental model is a balanced zoom: make the network deeper, wider, and fed by higher-resolution images in linked proportions.</p>
    <p>The design decision people gloss over is <b>how growth changes interfaces</b>. DenseNet concatenation means channel count grows after every layer, so later convolutions get larger inputs. EfficientNet's compound scaling means a single coefficient changes several dimensions, so compute rises multiplicatively rather than in one isolated place.</p>`,
  mathematics: String.raw`
    <p>DenseNet channel growth and EfficientNet compound scaling can be summarized as:</p>
    <div class="formula-box">$$C_L=C_0+kL,\qquad d=\alpha^\phi,\quad w=\beta^\phi,\quad r=\gamma^\phi$$</div>
    <p>Here $C_0$ is the initial channel count, $k$ is DenseNet growth rate, $L$ is the number of dense layers, and $d,w,r$ are EfficientNet depth, width, and resolution multipliers for compound coefficient $\phi$.</p>

    <p><b>DenseNet channels grow by concatenation.</b> Start with $C_0=16$ channels and growth rate $k=12$:</p>
    <ol class="work">
      <li>after one layer: $C_1=16+12\cdot1=28$</li>
      <li>after two layers: $C_2=16+12\cdot2=40$</li>
      <li>after four layers: $C_4=16+12\cdot4=64$</li>
    </ol>
    <p>Each layer contributes only $12$ new maps, but the block's shared feature stack grows steadily.</p>

    <p><b>A DenseNet layer reads all earlier channels.</b> If the third layer receives $40$ channels and outputs $12$ new channels with a $3\times3$ convolution:</p>
    <ol class="work">
      <li>weights per output channel: $3\times3\times40=360$</li>
      <li>for $12$ output channels: $360\times12=4320$ weights</li>
      <li>after concatenation the block has $40+12=52$ channels</li>
    </ol>
    <p>Dense connectivity improves reuse, but the input side of later layers grows, so transition layers are needed to compress.</p>

    <p><b>Compression controls DenseNet growth.</b> Apply a transition layer with compression $\theta=0.5$ to $64$ channels:</p>
    <ol class="work">
      <li>compressed channels: $\theta C=0.5\times64=32$</li>
      <li>channels removed: $64-32=32$</li>
      <li>a $1\times1$ transition can perform this reduction before pooling</li>
    </ol>
    <p>Without compression, concatenation can make later blocks too wide and expensive.</p>

    <p><b>EfficientNet scales dimensions together.</b> Let $\alpha=1.2$, $\beta=1.1$, $\gamma=1.15$, and $\phi=2$:</p>
    <ol class="work">
      <li>depth multiplier: $d=1.2^2=1.44$</li>
      <li>width multiplier: $w=1.1^2=1.21$</li>
      <li>resolution multiplier: $r=1.15^2=1.3225$</li>
    </ol>
    <p>A larger model is not merely deeper; it also has more channels and sees a larger input.</p>

    <p><b>Compute rises through all three scaled axes.</b> A rough convolutional cost scales like $d\cdot w^2\cdot r^2$. Using the multipliers above:</p>
    <ol class="work">
      <li>$w^2=1.21^2=1.4641$</li>
      <li>$r^2=1.3225^2=1.74800625$</li>
      <li>combined factor $\approx1.44\times1.4641\times1.74800625=3.685$</li>
    </ol>
    <p>The single coefficient $\phi=2$ produces roughly $3.7$ times the convolutional compute under these sample constants, which is why compound scaling must be budgeted carefully.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing DenseNet addition with ResNet addition.</b> DenseNet concatenates features, so channel counts grow; ResNet adds tensors and keeps shape fixed unless projected.</li>
      <li><b>Ignoring DenseNet's widening inputs.</b> The layer with $40$ input channels already needs $4320$ weights to add only $12$ maps.</li>
      <li><b>Forgetting transition compression.</b> Concatenation without $\theta$ can make later blocks too costly.</li>
      <li><b>Scaling only one EfficientNet dimension.</b> Increasing resolution without enough depth and width gives the model more pixels than it can use well.</li>
      <li><b>Underestimating compound compute.</b> Depth, squared width, and squared resolution multiply, which is how modest-looking factors can become about $3.7$ times the work.</li>
    </ul>`
};

window.ALLML_CONTENT["7.12"] = {
  tagline:"ConvNeXt keeps the convolutional promise of local pattern-finding, but borrows just enough transformer-era discipline to make a modern CNN train like a giant model.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.12-convnext.ipynb",
  context:String.raw`
    <p>ConvNeXt sits at the moment CNNs stopped defending old habits and asked which transformer design choices were simply good engineering.</p>
    <ul>
      <li><b>Convolution</b> (7.3) supplies the spatial operator: a learned kernel still scans nearby pixels, so translation-equivariant evidence remains the foundation.</li>
      <li><b>CNN blocks</b> (7.4) provide the resolution ladder that ConvNeXt keeps, with stages that downsample and widen channels.</li>
      <li><b>Residual learning</b> (7.10) explains why ConvNeXt can make each block a small correction instead of asking every layer to rewrite the representation.</li>
      <li><b>Normalization</b> controls feature scale inside deep stacks; ConvNeXt moves toward LayerNorm-style channel normalization rather than relying on BatchNorm statistics.</li>
    </ul>
    <p>Where it leads: ConvNeXt is the convolutional counterpoint to ViT (7.20) and Swin (7.21), and its features plug naturally into FPN detectors (7.16), Mask R-CNN (7.19), and dense prediction heads where spatial grids are still convenient.</p>`,
  intuition:String.raw`
    <p>The concrete problem: classic ResNet-style CNNs were strong, but transformer models changed the recipe for scale — larger kernels, fewer activation bottlenecks, smoother normalization, and inverted channel expansion. ConvNeXt asks whether a CNN can adopt those improvements without abandoning convolution.</p>
    <p>The naive answer is to paste attention into every stage. ConvNeXt does the braver, simpler thing: keep depthwise spatial convolution as the local mixer, then modernize the block around it. The mental picture is a careful renovation, not a demolition: widen the window, normalize per token, expand channels for computation, then add the corrected signal back.</p>
    <p>The design decision people often miss is <b>separating spatial mixing from channel mixing</b>. A depthwise $7\times7$ convolution lets each channel gather local context cheaply; the following pointwise layers let channels negotiate meaning. That split is why ConvNeXt can look transformer-like in training behavior while still behaving like a convolutional feature pyramid.</p>`,
  mathematics:String.raw`
    <p>A compact ConvNeXt block can be written as depthwise spatial mixing, channel LayerNorm, channel expansion, projection, and a residual add:</p>
    <div class="formula-box">$$y=x+W_2\,\phi\!\left(W_1\,\operatorname{LN}(\operatorname{DWConv}_{7\times7}(x))\right)$$</div>
    <p>Here $x\in\mathbb{R}^{H\times W\times C}$ is a feature grid, $\operatorname{DWConv}_{7\times7}$ applies one spatial kernel per channel, $\operatorname{LN}$ normalizes the $C$ channels at each location, $W_1$ expands channels, $W_2$ projects them back, and $y$ has the same shape as $x$.</p>

    <p><b>A depthwise filter is local evidence per channel.</b> The notebook's same $2\times2$ diagonal kernel gives the primitive convolution number:</p>
    <ol class="work">
      <li>patch $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ times kernel $\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ gives $1,0,0,-4$</li>
      <li>the depthwise response is $1+0+0-4=-3$</li>
    </ol>
    <p>ConvNeXt usually uses a larger $7\times7$ depthwise kernel, but the arithmetic idea is identical: each channel collects spatial evidence before channels are mixed.</p>

    <p><b>Sliding still creates a feature map.</b> On the notebook ramp $\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}$, the same kernel responds uniformly:</p>
    <ol class="work">
      <li>top-left window: $1-5=-4$</li>
      <li>top-right window: $2-6=-4$</li>
      <li>bottom-left and bottom-right also give $-4$, so $y=\begin{bmatrix}-4&-4\\-4&-4\end{bmatrix}$</li>
    </ol>
    <p>The constant map is not dull; it says the same local slope appears everywhere, exactly the kind of spatial regularity a convolutional backbone should preserve.</p>

    <p><b>LayerNorm stabilizes one location.</b> Suppose one pixel has three channel values $[1,2,3]$ before the pointwise expansion:</p>
    <ol class="work">
      <li>mean $\mu=(1+2+3)/3=2$</li>
      <li>variance $\sigma^2=((1-2)^2+(2-2)^2+(3-2)^2)/3=2/3$</li>
      <li>normalized channels are approximately $[-1.225,0,1.225]$</li>
    </ol>
    <p>Normalizing across channels at each spatial location makes the following channel MLP see comparable scales, even when batch statistics are small or unstable.</p>

    <p><b>The inverted bottleneck spends computation in channels.</b> With $C=3$ channels and expansion ratio $4$, the hidden width becomes $12$:</p>
    <ol class="work">
      <li>expand: $3\times4=12$ hidden channels</li>
      <li>project back: $12\to3$, so the residual add can match the original $3$ channels</li>
      <li>for one location, pointwise weights count $3\times12+12\times3=72$</li>
    </ol>
    <p>The block makes the expensive reasoning happen after local spatial mixing, then returns to the original channel count so the residual path stays clean.</p>

    <p><b>Downsampling changes the grid deliberately.</b> The notebook's shape arithmetic shows what a strided convolution does to a $5\times5$ map with a $2\times2$ kernel:</p>
    <ol class="work">
      <li>stride $2$ without padding gives $\lfloor(5-2)/2\rfloor+1=2$, a $2\times2$ map</li>
      <li>padding $1$ with stride $1$ gives $\lfloor(5+2-2)/1\rfloor+1=6$, a $6\times6$ map</li>
    </ol>
    <p>ConvNeXt stages use this kind of controlled resolution change: shrink the grid when the network needs broader semantics, then spend more channels at the coarser scale.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Calling ConvNeXt attention.</b> The formula uses $\operatorname{DWConv}_{7\times7}$, not $QK^T$; the model modernizes a CNN block without making every token attend globally.</li>
      <li><b>Normalizing over the wrong axis.</b> LayerNorm here acts across channels at one spatial position; mixing height and width into the statistic changes the feature meaning.</li>
      <li><b>Forgetting the residual shape constraint.</b> If $W_2$ does not return to $C$ channels, $x+$ the correction is invalid or silently broadcast in a bad implementation.</li>
      <li><b>Replacing depthwise convolution with full convolution by accident.</b> Full $7\times7$ mixing multiplies channel cost, while the ConvNeXt block expects one spatial filter per channel before pointwise mixing.</li>
      <li><b>Treating larger kernels as free context.</b> A $7\times7$ kernel broadens local evidence, but global interactions still require depth, pooling, or transformer-style attention.</li>
    </ul>`
};

window.ALLML_CONTENT["7.13"] = {
  tagline:"Detection metrics are the contract that turns messy boxes into decisions: overlap decides matches, NMS removes echoes, and AP rewards confident recall.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.13-anchors-iou-nms-map.ipynb",
  context:String.raw`
    <p>This lesson is the measuring kit every object detector carries before any architecture enters the room.</p>
    <ul>
      <li><b>Coordinate geometry</b> gives each box its corners $(x_1,y_1,x_2,y_2)$, so area and overlap become arithmetic.</li>
      <li><b>Greedy algorithms</b> explain NMS: sort by confidence, keep the strongest box, and suppress nearby duplicates.</li>
      <li><b>Precision and recall</b> turn a ranked list of detections into AP, the area under the precision-recall curve.</li>
    </ul>
    <p>Where it leads: R-CNN variants (7.14), YOLO and SSD (7.15), RetinaNet (7.16), DETR (7.17), and Mask R-CNN (7.19) all use these same ideas to decide whether a predicted object is right, duplicated, or missed.</p>`,
  intuition:String.raw`
    <p>The concrete problem: a detector rarely says simply "there is one dog." It emits many rectangles with scores, some tight, some shifted, and several piled on the same object. We need rules that turn that cloud into a fair score.</p>
    <p>The naive rule "the center is close" fails because a box can have the right center and the wrong size. IoU fixes that by comparing shared area to total covered area. NMS then handles the duplicate problem: if two high-overlap boxes are probably the same object, keep the more confident one.</p>
    <p>The design decision people gloss over is the matching threshold. A threshold such as $0.5$ is not a law of nature; it encodes how tight a localization must be for the task. AP is powerful because it evaluates the whole confidence ranking instead of one arbitrary score cutoff.</p>`,
  mathematics:String.raw`
    <p>For boxes $A$ and $B$, intersection-over-union is the localization backbone:</p>
    <div class="formula-box">$$\operatorname{IoU}(A,B)=\frac{|A\cap B|}{|A\cup B|}=\frac{|A\cap B|}{|A|+|B|-|A\cap B|}$$</div>
    <p>$A$ and $B$ are axis-aligned boxes in corner coordinates, $|A|$ is box area, and the ratio is $0$ for no overlap and $1$ for perfect alignment.</p>

    <p><b>IoU measures the shared rectangle.</b> The notebook compares $A=[0,0,3,3]$ with $B=[1,1,4,4]$:</p>
    <ol class="work">
      <li>intersection width $=3-1=2$ and height $=3-1=2$, so intersection area $=4$</li>
      <li>each box area is $3\times3=9$</li>
      <li>union $=9+9-4=14$, so $\operatorname{IoU}=4/14\approx0.286$</li>
    </ol>
    <p>The overlap is substantial but not tight; the denominator punishes both the missed part and the extra covered part.</p>

    <p><b>Anchors are chosen by best IoU.</b> For ground truth $[1,1,3,3]$, the notebook scores three anchors:</p>
    <ol class="work">
      <li>$[0,0,2,2]$ overlaps in a $1\times1$ square, so $1/(4+4-1)=1/7\approx0.143$</li>
      <li>$[0,0,3,3]$ overlaps the whole $2\times2$ object, so $4/(9+4-4)=4/9\approx0.444$</li>
      <li>$[1,1,4,4]$ also gives $4/(9+4-4)=4/9\approx0.444$</li>
    </ol>
    <p>The notebook's argmax picks index $1$ because it is the first maximum; ties matter when assigning training targets.</p>

    <p><b>NMS removes a lower-scored duplicate.</b> The boxes have scores $0.9,0.8,0.7$ and threshold $0.3$:</p>
    <ol class="work">
      <li>keep box $0$ first because $0.9$ is highest</li>
      <li>box $1$ has overlap area $2.5\times2.5=6.25$ with box $0$ and union $9+9-6.25=11.75$</li>
      <li>$6.25/11.75\approx0.532\gt0.3$, so suppress box $1$; box $2$ has IoU $0$ and is kept</li>
    </ol>
    <p>The kept list $[0,2]$ is not the two highest scores; it is the highest score per sufficiently separated object.</p>

    <p><b>AP integrates precision over recall jumps.</b> The notebook uses precision $[1.0,0.75,0.6]$ at recall $[0.33,0.67,1.0]$:</p>
    <ol class="work">
      <li>recall increments are $0.33$, $0.67-0.33=0.34$, and $1.0-0.67=0.33$</li>
      <li>weighted precision terms are $1.0\cdot0.33=0.33$, $0.75\cdot0.34=0.255$, $0.6\cdot0.33=0.198$</li>
      <li>AP $=0.33+0.255+0.198=0.783$, matching the asserted value within rounding</li>
    </ol>
    <p>Late false positives still hurt, but high precision during early recall gives the detector credit for ranking good boxes first.</p>

    <p><b>Assignment costs choose a one-to-one match.</b> The notebook's cost matrix is $\begin{bmatrix}0.3&1.1\\0.7&0.5\end{bmatrix}$:</p>
    <ol class="work">
      <li>diagonal assignment cost $=0.3+0.5=0.8$</li>
      <li>cross assignment cost $=1.1+0.7=1.8$</li>
      <li>$0.8\lt1.8$, so prediction $0$ matches target $0$ and prediction $1$ matches target $1$</li>
    </ol>
    <p>Even before DETR, detection evaluation depends on matching predictions to objects rather than counting boxes independently.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Using intersection over predicted area.</b> IoU divides by union, so oversized boxes are penalized; dividing only by prediction area hides sloppy localization.</li>
      <li><b>Ignoring tie policy in anchor assignment.</b> The two $4/9$ anchors tie, but the notebook's argmax chooses the first, which changes which anchor receives the positive label.</li>
      <li><b>Running NMS before sorting.</b> The suppression rule assumes higher confidence boxes get priority; without sorting, weak boxes can delete strong boxes.</li>
      <li><b>Confusing AP with accuracy.</b> AP is a ranking integral over recall steps, not the fraction of correct boxes at one score threshold.</li>
      <li><b>Comparing AP numbers across different IoU thresholds.</b> A model can look strong at $0.5$ and weak at $0.75$ because localization strictness changed.</li>
    </ul>`
};

window.ALLML_CONTENT["7.14"] = {
  tagline:"The R-CNN family made detection a two-stage conversation: first ask where objects might be, then classify and refine each region carefully.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.14-rcnn-family.ipynb",
  context:String.raw`
    <p>R-CNN is the bridge from image classification to object detection: it reuses a classifier, but only after proposing candidate regions.</p>
    <ul>
      <li><b>CNN feature maps</b> (7.4) provide shared visual evidence so Fast and Faster R-CNN do not run a full network separately for every proposal.</li>
      <li><b>IoU and NMS</b> (7.13) decide which proposals train as positives and which overlapping detections survive at inference.</li>
      <li><b>Regression</b> supplies the box refinement head, moving a rough proposal toward the ground-truth rectangle.</li>
    </ul>
    <p>Where it leads: Faster R-CNN's region proposal network becomes the ancestor of Mask R-CNN (7.19), while one-stage detectors (7.15) are best understood as removing this explicit proposal-and-refine stage.</p>`,
  intuition:String.raw`
    <p>The concrete problem: classification tells you what is in an image, but detection must also say where. Exhaustively classifying every possible rectangle is impossible because the number of windows explodes with scale, aspect ratio, and position.</p>
    <p>R-CNN's answer is selective attention before attention was fashionable: generate a manageable set of candidate boxes, crop or pool features for each one, and run a classifier plus a box regressor on those regions. Fast R-CNN shares the expensive convolutional map; Faster R-CNN learns the proposals too.</p>
    <p>The design decision people gloss over is <b>alignment</b>. A region proposal is a floating rectangle on a feature map, not a neat array index. RoI pooling and later RoIAlign exist because rounding the crop badly can move small objects by a meaningful fraction of their size.</p>`,
  mathematics:String.raw`
    <p>A two-stage detector scores a proposal $r$ by pooling features inside it, classifying the pooled vector, and regressing a box correction:</p>
    <div class="formula-box">$$h_r=\operatorname{RoIPool}(F,r),\qquad p_r=\operatorname{softmax}(W_c h_r),\qquad \hat b_r=r+\Delta b_r$$</div>
    <p>$F$ is the shared CNN feature map, $r$ is a proposed box, $h_r$ is its fixed-size region feature, $p_r$ is the class distribution, and $\Delta b_r$ is the learned coordinate correction.</p>

    <p><b>A proposal becomes positive by overlap.</b> Reusing the notebook boxes $A=[0,0,3,3]$ and $B=[1,1,4,4]$:</p>
    <ol class="work">
      <li>intersection is $2\times2=4$</li>
      <li>union is $9+9-4=14$</li>
      <li>IoU is $4/14\approx0.286$</li>
    </ol>
    <p>If a training rule requires IoU at least $0.5$, this proposal is not yet a positive object crop; the region is too loose or misplaced.</p>

    <p><b>The region proposal network chooses anchors.</b> With ground truth $[1,1,3,3]$, the notebook anchor IoUs are:</p>
    <ol class="work">
      <li>anchor $0$: $1/7\approx0.143$</li>
      <li>anchor $1$: $4/9\approx0.444$</li>
      <li>anchor $2$: $4/9\approx0.444$, so the first best anchor is index $1$</li>
    </ol>
    <p>Faster R-CNN trains the RPN to make this choice automatically, replacing hand-built proposal methods with learned objectness.</p>

    <p><b>RoI pooling turns an uneven crop into a fixed vector.</b> Suppose a proposal covers feature values $\begin{bmatrix}1&3\\2&4\end{bmatrix}$ and we pool it to one bin:</p>
    <ol class="work">
      <li>max pooling gives $\max(1,3,2,4)=4$</li>
      <li>average pooling would give $(1+3+2+4)/4=2.5$</li>
      <li>a classifier expecting one feature receives either $[4]$ or $[2.5]$, regardless of the proposal's original pixel size</li>
    </ol>
    <p>The fixed-size representation is the trick that lets many differently shaped proposals share one classifier head.</p>

    <p><b>NMS cleans up per-region predictions.</b> The notebook's three scored boxes produce a duplicate suppression:</p>
    <ol class="work">
      <li>box $0$ with score $0.9$ is kept first</li>
      <li>box $1$ overlaps box $0$ by IoU $6.25/11.75\approx0.532$, above threshold $0.3$</li>
      <li>box $1$ is suppressed, box $2$ has IoU $0$, and the kept indices are $[0,2]$</li>
    </ol>
    <p>R-CNN heads often score many neighboring proposals for the same object, so this post-processing is part of the detector, not an optional cosmetic step.</p>

    <p><b>Box regression is a small coordinate correction.</b> If a proposal is $r=[0,0,3,3]$ and the regressor predicts $\Delta b=[1,1,1,1]$ in this simple corner-coordinate example:</p>
    <ol class="work">
      <li>updated box $\hat b=[0+1,0+1,3+1,3+1]=[1,1,4,4]$</li>
      <li>its IoU with target $[1,1,4,4]$ is $9/(9+9-9)=1$</li>
    </ol>
    <p>The classifier names the region; the regressor makes the region geometrically worthy of that name.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Thinking proposals are final detections.</b> A proposal $r$ is only a candidate; the formula still needs classification and $\Delta b_r$ refinement.</li>
      <li><b>Training positives with poor IoU thresholds.</b> The $0.286$ proposal above would teach a sloppy crop if labeled positive under a strict detection task.</li>
      <li><b>Rounding RoIs too early.</b> Coarse pooling can shift small boxes; RoIAlign was introduced because alignment errors propagate directly into mask and box heads.</li>
      <li><b>Skipping NMS after the second stage.</b> Region classifiers often fire on overlapping proposals, so duplicates remain unless the IoU suppression is applied.</li>
      <li><b>Forgetting background proposals.</b> The classifier must learn "no object" regions; otherwise every proposal is forced into a foreground class.</li>
    </ul>`
};

window.ALLML_CONTENT["7.15"] = {
  tagline:"YOLO and SSD make detection feel like dense prediction: every grid location proposes boxes now, so speed comes from refusing a separate proposal stage.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.15-yolo-ssd.ipynb",
  context:String.raw`
    <p>One-stage detectors trade the careful second-stage crop for a single pass over a feature grid.</p>
    <ul>
      <li><b>Convolutional grids</b> (7.4) provide one prediction site per spatial cell, letting the model emit boxes everywhere at once.</li>
      <li><b>Anchors and IoU</b> (7.13) assign each object to the grid cell or default box that should learn it.</li>
      <li><b>Classification losses</b> supply class probabilities while regression losses tune center, width, and height.</li>
    </ul>
    <p>Where it leads: FPN and RetinaNet (7.16) repair small-object and class-imbalance weaknesses of one-stage detection; DETR (7.17) later removes anchors and NMS by changing the assignment problem.</p>`,
  intuition:String.raw`
    <p>The concrete problem: two-stage detectors are accurate but expensive because they pause to form and process region proposals. YOLO and SSD ask a different question: what if every cell in a feature map directly predicts a small set of boxes?</p>
    <p>The naive dense approach produces chaos unless each location has responsibility rules. YOLO ties an object's center to a grid cell; SSD ties objects to default boxes of different shapes. A prediction is therefore not "some box somewhere" — it is a correction to a specific cell or anchor.</p>
    <p>The overlooked design choice is <b>objectness</b>. The detector must learn not only class labels but whether a proposed box corresponds to any object at all. That scalar gates the flood of easy background boxes and determines which predictions are allowed to matter.</p>`,
  mathematics:String.raw`
    <p>A one-stage detector predicts, for cell $(i,j)$ and anchor $a$, an objectness score, a class distribution, and a box:</p>
    <div class="formula-box">$$\hat b=(\sigma(t_x)+j,\ \sigma(t_y)+i,\ a_w e^{t_w},\ a_h e^{t_h}),\qquad s=\sigma(t_o)$$</div>
    <p>Here $(i,j)$ names the grid cell, $(a_w,a_h)$ is the anchor size, $(t_x,t_y,t_w,t_h)$ are network outputs, and $s$ is the objectness probability.</p>

    <p><b>IoU still judges localization.</b> The notebook's boxes $[0,0,3,3]$ and $[1,1,4,4]$ overlap as follows:</p>
    <ol class="work">
      <li>intersection area $=(3-1)(3-1)=4$</li>
      <li>union area $=9+9-4=14$</li>
      <li>IoU $=4/14\approx0.286$</li>
    </ol>
    <p>A one-stage detector may be fast, but the box is not considered well localized unless this ratio clears the chosen threshold.</p>

    <p><b>A grid offset decodes a center.</b> Suppose cell $(i,j)=(2,3)$ predicts $\sigma(t_x)=0.25$ and $\sigma(t_y)=0.75$:</p>
    <ol class="work">
      <li>center $x=3+0.25=3.25$ cells</li>
      <li>center $y=2+0.75=2.75$ cells</li>
      <li>with stride $16$, image coordinates are $(3.25\cdot16,2.75\cdot16)=(52,44)$ pixels</li>
    </ol>
    <p>The sigmoid keeps the center inside its responsible cell, which is how YOLO prevents every cell from chasing the same object center.</p>

    <p><b>Anchors or default boxes receive objects by IoU.</b> The notebook's ground truth $[1,1,3,3]$ gives anchor overlaps:</p>
    <ol class="work">
      <li>$[0,0,2,2]$ gives $1/7\approx0.143$</li>
      <li>$[0,0,3,3]$ gives $4/9\approx0.444$</li>
      <li>$[1,1,4,4]$ gives $4/9\approx0.444$, and the first maximum is anchor index $1$</li>
    </ol>
    <p>SSD's default boxes use exactly this logic across several feature maps so different object scales find a responsible predictor.</p>

    <p><b>Objectness changes the final confidence.</b> If a box has objectness $s=0.8$ and class probability $p(\textsf{car})=0.6$:</p>
    <ol class="work">
      <li>class-specific detection confidence $=0.8\cdot0.6=0.48$</li>
      <li>another box with $s=0.5$ and $p(\textsf{car})=0.9$ scores $0.45$</li>
      <li>the first box ranks higher despite the lower class probability</li>
    </ol>
    <p>This multiplication is why background calibration matters: an overconfident objectness head floods NMS with boxes.</p>

    <p><b>NMS is still needed after dense prediction.</b> The notebook's scored boxes behave like a miniature YOLO output:</p>
    <ol class="work">
      <li>scores are $0.9$, $0.8$, and $0.7$, so box $0$ is considered first</li>
      <li>box $1$ has IoU $6.25/11.75\approx0.532\gt0.3$ with box $0$ and is removed</li>
      <li>box $2$ has IoU $0$ with kept boxes, leaving $[0,2]$</li>
    </ol>
    <p>One-stage speed comes before this cleanup; it does not remove the duplicate-box problem by itself.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Decoding box centers without the cell offset.</b> The formula adds $(j,i)$; forgetting it collapses predictions from different cells into the same coordinate frame.</li>
      <li><b>Multiplying class scores but not objectness.</b> A class probability alone says "if there is an object"; the objectness scalar says whether that condition holds.</li>
      <li><b>Using one feature scale for every object.</b> Small objects vanish on coarse grids, which is why SSD uses multiple maps and RetinaNet adds FPN.</li>
      <li><b>Letting too many easy negatives dominate.</b> Dense detectors see far more background anchors than foreground objects; losses or sampling must account for that imbalance.</li>
      <li><b>Applying NMS across unrelated classes incorrectly.</b> Suppressing a car because it overlaps a person is a class-handling bug, not a model insight.</li>
    </ul>`
};

window.ALLML_CONTENT["7.16"] = {
  tagline:"FPN gives detectors a multi-scale memory, and RetinaNet adds a loss that stops easy background boxes from drowning the rare objects.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.16-fpn-retinanet.ipynb",
  context:String.raw`
    <p>FPN and RetinaNet solve two practical failures of dense detection: small objects need high-resolution features, and foreground examples are scarce.</p>
    <ul>
      <li><b>CNN stages</b> (7.4) create a pyramid naturally because later layers are semantically strong but spatially coarse.</li>
      <li><b>One-stage prediction</b> (7.15) supplies anchors at many locations, which makes class imbalance severe.</li>
      <li><b>IoU, NMS, and AP</b> (7.13) remain the evaluation language for whether the multi-scale boxes are useful.</li>
    </ul>
    <p>Where it leads: FPN features feed Faster R-CNN, RetinaNet, and Mask R-CNN (7.19); the scale-aware detection idea also shapes modern backbones such as Swin (7.21).</p>`,
  intuition:String.raw`
    <p>The concrete problem: a deep feature map knows what an object is but may be too coarse to place a small one; a shallow feature map knows where edges are but lacks category meaning. FPN merges them so each scale has both location and semantics.</p>
    <p>RetinaNet then tackles the one-stage detector's training imbalance. Most anchors are easy background, and their tiny individual losses add up until they dominate. Focal loss multiplies cross-entropy by a factor that nearly silences examples the model already gets right.</p>
    <p>The design choice worth pausing on is <b>top-down addition</b>. FPN does not merely concatenate every layer; it upsamples a semantic coarse map, projects a lateral fine map to the same channel count, and adds them. That addition creates a feature at the fine resolution carrying high-level meaning.</p>`,
  mathematics:String.raw`
    <p>FPN builds a pyramid by lateral projection plus top-down upsampling, while RetinaNet trains dense classifiers with focal loss:</p>
    <div class="formula-box">$$P_l=W_l C_l+\operatorname{Up}(P_{l+1}),\qquad \operatorname{FL}(p_t)=-\alpha(1-p_t)^\gamma\log p_t$$</div>
    <p>$C_l$ is a backbone feature at level $l$, $P_l$ is the merged pyramid feature, $W_l$ is a $1\times1$ projection, and $p_t$ is the predicted probability assigned to the true class.</p>

    <p><b>A top-down merge is numeric addition after alignment.</b> Suppose a lateral projected feature is $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ and the upsampled coarser feature is $\begin{bmatrix}10&10\\20&20\end{bmatrix}$:</p>
    <ol class="work">
      <li>top-left merged value $=1+10=11$</li>
      <li>bottom-right merged value $=4+20=24$</li>
      <li>the merged map is $\begin{bmatrix}11&12\\23&24\end{bmatrix}$</li>
    </ol>
    <p>The fine grid remains fine, but every location receives semantic information from the coarser level.</p>

    <p><b>Anchors still depend on IoU assignment.</b> The notebook's ground truth $[1,1,3,3]$ gives:</p>
    <ol class="work">
      <li>small anchor $[0,0,2,2]$: IoU $=1/7\approx0.143$</li>
      <li>larger anchors $[0,0,3,3]$ and $[1,1,4,4]$: IoU $=4/9\approx0.444$ each</li>
      <li>the first best anchor is index $1$</li>
    </ol>
    <p>FPN's scale levels increase the chance that one anchor shape and resolution lands near the object.</p>

    <p><b>Focal loss shrinks easy-example gradients.</b> Use RetinaNet's common $\alpha=0.25$, $\gamma=2$:</p>
    <ol class="work">
      <li>easy example $p_t=0.9$: loss $=-0.25(0.1)^2\log(0.9)\approx0.00026$</li>
      <li>hard example $p_t=0.1$: loss $=-0.25(0.9)^2\log(0.1)\approx0.466$</li>
      <li>the hard example is about $0.466/0.00026\approx1770$ times larger</li>
    </ol>
    <p>The loss does not ignore easy background by rule; it makes their contribution mathematically tiny once they are confidently classified.</p>

    <p><b>NMS remains the dense-output cleanup.</b> The notebook's boxes show duplicate suppression:</p>
    <ol class="work">
      <li>box $0$ score $0.9$ is kept first</li>
      <li>box $1$ overlaps it with IoU $6.25/11.75\approx0.532\gt0.3$ and is suppressed</li>
      <li>box $2$ has no overlap and remains, so kept indices are $[0,2]$</li>
    </ol>
    <p>Even with a better pyramid and focal loss, dense prediction still emits neighboring boxes that need geometric pruning.</p>

    <p><b>AP rewards the ranked detections.</b> With notebook precision $[1.0,0.75,0.6]$ and recall $[0.33,0.67,1.0]$:</p>
    <ol class="work">
      <li>recall increments are $0.33$, $0.34$, and $0.33$</li>
      <li>area terms are $0.33$, $0.255$, and $0.198$</li>
      <li>AP $=0.783$</li>
    </ol>
    <p>RetinaNet's focal loss is valuable only if it improves this final ranked precision-recall behavior, not merely the training loss.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Adding feature maps before matching resolution.</b> $P_l=W_lC_l+\operatorname{Up}(P_{l+1})$ only makes sense after height, width, and channels align.</li>
      <li><b>Using focal loss with probabilities for the wrong class.</b> $p_t$ is the probability of the true class; substituting the background probability for a foreground anchor reverses the weighting.</li>
      <li><b>Expecting FPN to fix bad anchors alone.</b> Multi-scale features help, but poor anchor sizes still produce weak IoU matches.</li>
      <li><b>Turning focal loss into a magic imbalance cure.</b> If labels are noisy, the loss can emphasize hard mislabeled examples very strongly.</li>
      <li><b>Evaluating only large objects.</b> FPN's main gain often appears on small and medium objects, so aggregate AP can hide the scale-specific story.</li>
    </ul>`
};

window.ALLML_CONTENT["7.17"] = {
  tagline:"DETR treats detection as set prediction: make a fixed set of object guesses, then match them to the ground truth instead of cleaning duplicates afterward.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.17-detr.ipynb",
  context:String.raw`
    <p>DETR is the detection lesson where transformer thinking changes the output format, not just the backbone.</p>
    <ul>
      <li><b>IoU and AP</b> (7.13) still judge boxes, but DETR trains with an explicit one-to-one matching cost.</li>
      <li><b>Attention</b> from transformer models lets object queries gather evidence from the full image feature sequence.</li>
      <li><b>CNN or ViT features</b> (7.4, 7.20) provide the encoded image tokens that the decoder queries inspect.</li>
    </ul>
    <p>Where it leads: DETR motivates anchor-free, NMS-free detectors and connects directly to segmentation variants that attach masks to matched object queries, including the instance ideas in 7.19.</p>`,
  intuition:String.raw`
    <p>The concrete problem: classic detectors produce many candidate boxes and then rely on anchors plus NMS to remove duplicates. DETR asks the model to output a set directly — each query should claim one object or say "no object."</p>
    <p>The naive set loss is ambiguous because predictions have no natural order. If the first predicted box is a dog and the first label is a bicycle, that may just be a permutation, not a mistake. Hungarian matching solves the bookkeeping: find the lowest-cost pairing between predictions and targets, then train those pairs.</p>
    <p>The design decision people miss is the <b>no-object class</b>. DETR emits more queries than objects; unmatched queries must learn to stay empty. Without that pressure, every query tries to hallucinate a foreground object.</p>`,
  mathematics:String.raw`
    <p>DETR trains by choosing the permutation $\hat\sigma$ that gives the lowest total matching cost, then applying classification and box losses to matched pairs:</p>
    <div class="formula-box">$$\hat\sigma=\arg\min_{\sigma}\sum_{i=1}^{N}\left[-\log p_{\sigma(i)}(c_i)+\lambda_1\lVert b_i-\hat b_{\sigma(i)}\rVert_1+\lambda_2(1-\operatorname{IoU}(b_i,\hat b_{\sigma(i)}))\right]$$</div>
    <p>$N$ is the number of ground-truth objects, $c_i$ and $b_i$ are the class and box for object $i$, and prediction $\sigma(i)$ is the query assigned to it.</p>

    <p><b>Matching selects a permutation.</b> The notebook cost matrix is $\begin{bmatrix}0.3&1.1\\0.7&0.5\end{bmatrix}$:</p>
    <ol class="work">
      <li>diagonal assignment cost $=0.3+0.5=0.8$</li>
      <li>cross assignment cost $=1.1+0.7=1.8$</li>
      <li>the diagonal wins because $0.8\lt1.8$</li>
    </ol>
    <p>This is the tiny version of Hungarian matching: one prediction per target, with duplicates discouraged by the assignment itself.</p>

    <p><b>IoU remains part of the box cost.</b> For $[0,0,3,3]$ and $[1,1,4,4]$:</p>
    <ol class="work">
      <li>intersection area $=2\times2=4$</li>
      <li>union $=9+9-4=14$</li>
      <li>$1-\operatorname{IoU}=1-4/14\approx0.714$</li>
    </ol>
    <p>A poor overlap increases matching cost even if the class probability is high.</p>

    <p><b>Class cost can overturn geometry.</b> Suppose two candidate costs for one object are built from class and box terms:</p>
    <ol class="work">
      <li>prediction A: class cost $0.2$ plus box cost $0.6$ gives $0.8$</li>
      <li>prediction B: class cost $0.7$ plus box cost $0.1$ gives $0.8$</li>
      <li>they tie, so changing $\lambda_1$ or $\lambda_2$ decides whether class confidence or geometry matters more</li>
    </ol>
    <p>DETR's loss weights are not decoration; they define what "best match" means during training.</p>

    <p><b>Extra queries learn emptiness.</b> If DETR uses $5$ object queries and an image contains $2$ objects:</p>
    <ol class="work">
      <li>$2$ queries are matched to real boxes</li>
      <li>$5-2=3$ queries are assigned to the no-object class</li>
      <li>the output set still has $5$ slots, but only $2$ should survive as foreground</li>
    </ol>
    <p>This fixed-size set is how DETR avoids anchors while still handling a variable number of objects.</p>

    <p><b>AP still evaluates the ranked foreground predictions.</b> The notebook precision-recall numbers give:</p>
    <ol class="work">
      <li>$1.0\cdot0.33=0.33$</li>
      <li>$0.75\cdot0.34=0.255$</li>
      <li>$0.6\cdot0.33=0.198$, so AP $=0.783$</li>
    </ol>
    <p>DETR changes training and decoding, but the reported detector quality is still measured by ranked correct boxes.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Sorting predictions before matching.</b> DETR outputs a set; imposing an arbitrary order defeats the permutation-invariant loss.</li>
      <li><b>Dropping the no-object class.</b> Unmatched queries need a target, or they learn to duplicate real objects.</li>
      <li><b>Using only L1 box loss.</b> Coordinate distance without IoU can prefer boxes with similar corners but poor overlap.</li>
      <li><b>Expecting NMS-style fixes at inference.</b> DETR is designed so one-to-one training removes duplicates; adding NMS can hide a matching problem rather than solve it.</li>
      <li><b>Mis-scaling the matching weights.</b> If the class term dwarfs the box terms, the assignment can pair correct labels with badly localized boxes.</li>
    </ul>`
};

window.ALLML_CONTENT["7.18"] = {
  tagline:"Semantic segmentation is classification without looking away from the grid: every pixel receives a class, so boundaries become first-class predictions.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.18-semantic-segmentation.ipynb",
  context:String.raw`
    <p>Segmentation asks a CNN to stop summarizing the image too early and instead return a label at each pixel.</p>
    <ul>
      <li><b>Convolutional feature maps</b> (7.4) preserve spatial layout, which is why they can be decoded back into pixel labels.</li>
      <li><b>Upsampling</b> restores resolution after downsampling, letting coarse semantic features become dense predictions.</li>
      <li><b>Softmax classification</b> runs independently at every pixel, producing a class distribution instead of one image label.</li>
    </ul>
    <p>Where it leads: U-Net-style skip connections support medical and scientific segmentation, while instance and panoptic segmentation (7.19) add object identity on top of these per-pixel class maps.</p>`,
  intuition:String.raw`
    <p>The concrete problem: image classification can say "road" or "person" but not which pixels are road or person. Semantic segmentation keeps the spatial question alive all the way to the output.</p>
    <p>The naive fully connected classifier destroys location. FCNs replace those dense layers with convolutions so the network produces a coarse label grid; U-Net then adds skip connections because upsampling a coarse grid alone gives blurry boundaries.</p>
    <p>The subtle design decision is <b>what counts as one prediction</b>. In semantic segmentation, the unit is a pixel-class pair, not an object. Two cars of the same class receive the same label unless a later instance mechanism separates them.</p>`,
  mathematics:String.raw`
    <p>At each pixel $(u,v)$, semantic segmentation applies a class softmax and trains with per-pixel cross-entropy:</p>
    <div class="formula-box">$$p_{u,v,c}=\frac{e^{z_{u,v,c}}}{\sum_{k=1}^{C}e^{z_{u,v,k}}},\qquad L=-\frac{1}{HW}\sum_{u,v}\log p_{u,v,y_{u,v}}$$</div>
    <p>$z_{u,v,c}$ is the logit for class $c$, $y_{u,v}$ is the ground-truth class at pixel $(u,v)$, and $H\times W$ is the number of pixels.</p>

    <p><b>A mask is a class grid.</b> The notebook mask is $\begin{bmatrix}0&0&1\\0&1&1\\2&2&1\end{bmatrix}$:</p>
    <ol class="work">
      <li>class $0$ appears at three pixels</li>
      <li>class $1$ appears at four pixels</li>
      <li>class $2$ appears at two pixels, so there are $3$ unique labels</li>
    </ol>
    <p>The output is not a box or a caption; it is a class decision at each of the nine grid positions.</p>

    <p><b>Pixel accuracy counts exact matches.</b> The notebook prediction differs from the ground truth at one location:</p>
    <ol class="work">
      <li>there are $9$ pixels total</li>
      <li>$8$ predicted labels equal the ground-truth labels</li>
      <li>accuracy $=8/9\approx0.889$</li>
    </ol>
    <p>This metric is easy to understand but can overpraise a model when background pixels dominate the image.</p>

    <p><b>Class IoU focuses on one label's region.</b> For class $1$, the notebook computes:</p>
    <ol class="work">
      <li>intersection: $3$ pixels are predicted as $1$ and truly $1$</li>
      <li>union: $4$ pixels are predicted as $1$ or truly $1$</li>
      <li>IoU for class $1$ is $3/4=0.75$</li>
    </ol>
    <p>Unlike pixel accuracy, IoU punishes both missing a class pixel and inventing one.</p>

    <p><b>U-Net skip concatenation restores detail.</b> The notebook joins encoder features of shape $2\times2\times3$ with decoder features of shape $2\times2\times2$:</p>
    <ol class="work">
      <li>height stays $2$ and width stays $2$</li>
      <li>channels add: $3+2=5$</li>
      <li>the concatenated tensor shape is $2\times2\times5$</li>
    </ol>
    <p>The decoder receives both coarse semantic context and high-resolution encoder detail at the same spatial positions.</p>

    <p><b>Per-pixel softmax turns logits into loss.</b> For one pixel with logits $[1,2,0]$ and true class $1$:</p>
    <ol class="work">
      <li>$e^1\approx2.718$, $e^2\approx7.389$, $e^0=1$, sum $\approx11.107$</li>
      <li>$p_{\text{true}}=7.389/11.107\approx0.665$</li>
      <li>cross-entropy $=-\log(0.665)\approx0.408$</li>
    </ol>
    <p>A confident correct pixel contributes a small loss; boundary pixels often produce larger losses because their logits are less certain.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Reporting only pixel accuracy.</b> The $8/9$ example looks strong, but class IoU exposes whether a specific region was missed or overdrawn.</li>
      <li><b>Upsampling without skips and expecting sharp edges.</b> The $2\times2\times5$ concatenation shows why U-Net gives the decoder fine features, not just coarse semantics.</li>
      <li><b>Mixing class labels with instance identities.</b> Semantic class $1$ does not distinguish two separate objects of that class.</li>
      <li><b>Applying softmax over pixels instead of classes.</b> The denominator sums over $C$ classes at one pixel; summing over spatial positions changes the task.</li>
      <li><b>Ignoring label alignment after resizing.</b> If masks are interpolated like photographs, class IDs can become invalid fractional labels.</li>
    </ul>`
};

window.ALLML_CONTENT["7.19"] = {
  tagline:"Instance and panoptic segmentation add identity to pixels: not just what class is here, but which object owns this region.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.19-instance-panoptic-segmentation.ipynb",
  context:String.raw`
    <p>This lesson begins where semantic segmentation stops: class labels are useful, but objects also need identities.</p>
    <ul>
      <li><b>Semantic segmentation</b> (7.18) supplies per-pixel class probabilities, the "what" part of the problem.</li>
      <li><b>R-CNN regions</b> (7.14) supply per-object proposals, the "which object" handle used by Mask R-CNN.</li>
      <li><b>IoU matching</b> (7.13) evaluates masks and boxes by overlap, so duplicate or missing instances become measurable.</li>
    </ul>
    <p>Where it leads: Mask R-CNN is the classic instance segmentation model, and panoptic segmentation combines its countable objects with semantic labels for amorphous stuff such as sky or road.</p>`,
  intuition:String.raw`
    <p>The concrete problem: a semantic mask labels every person pixel as "person," but it cannot tell whether those pixels belong to one person or three. Instance segmentation separates same-class objects into different masks.</p>
    <p>Mask R-CNN's idea is surgical: keep Faster R-CNN's boxes and classes, then attach a small mask head to each aligned RoI. The mask is predicted inside the proposal, so object identity comes from the RoI that generated it.</p>
    <p>The design decision people gloss over is <b>class-specific masks versus class labels</b>. The mask head can predict a binary silhouette for each class, but the chosen class head selects which silhouette is used. Geometry and category meet at the RoI, not at the full image grid.</p>`,
  mathematics:String.raw`
    <p>Mask R-CNN augments each RoI with a mask probability map and trains it by binary cross-entropy on the matched object region:</p>
    <div class="formula-box">$$m_r=\sigma(W_m\operatorname{RoIAlign}(F,r)),\qquad L_{mask}=-\frac{1}{K^2}\sum_{u,v}\left[y_{u,v}\log m_{u,v}+(1-y_{u,v})\log(1-m_{u,v})\right]$$</div>
    <p>$r$ is a detected RoI, $F$ is the feature map, $m_r$ is a $K\times K$ mask for that RoI, and $y$ is the binary target mask for the matched instance.</p>

    <p><b>Semantic labels do not separate objects.</b> The notebook mask $\begin{bmatrix}0&0&1\\0&1&1\\2&2&1\end{bmatrix}$ has:</p>
    <ol class="work">
      <li>three unique class labels: $0$, $1$, and $2$</li>
      <li>four pixels with label $1$</li>
      <li>no identity telling whether the four class-$1$ pixels are one object or several</li>
    </ol>
    <p>Instance segmentation adds that missing ownership information.</p>

    <p><b>Mask IoU compares regions pixelwise.</b> For class $1$ in the notebook prediction and ground truth:</p>
    <ol class="work">
      <li>intersection contains $3$ pixels</li>
      <li>union contains $4$ pixels</li>
      <li>mask IoU is $3/4=0.75$</li>
    </ol>
    <p>The same overlap idea used for boxes becomes a pixel-set comparison for masks.</p>

    <p><b>RoIAlign avoids crude coordinate jumps.</b> Suppose a one-dimensional RoI spans feature coordinate $1.5$ between values $10$ at index $1$ and $14$ at index $2$:</p>
    <ol class="work">
      <li>linear interpolation halfway gives $0.5\cdot10+0.5\cdot14=12$</li>
      <li>rounding down would give $10$</li>
      <li>the alignment error would be $12-10=2$ feature units</li>
    </ol>
    <p>For masks, a two-unit feature shift can move a boundary, which is why Mask R-CNN replaced coarse RoI pooling with RoIAlign.</p>

    <p><b>Two instance masks can share a class but not pixels.</b> The notebook creates two $4\times4$ binary masks:</p>
    <ol class="work">
      <li>mask $m_1$ fills the top-left $2\times2$ block, so $m_1$ area is $4$</li>
      <li>mask $m_2$ fills the bottom-right $2\times2$ block, so $m_2$ area is $4$</li>
      <li>their combined labeled display can use values $1$ and $2$ to preserve identity</li>
    </ol>
    <p>Both could be "person," yet the instance IDs keep them from merging into one semantic blob.</p>

    <p><b>Panoptic output assigns exactly one owner per pixel.</b> In a $4\times4$ image with the two masks above and the rest background:</p>
    <ol class="work">
      <li>instance pixels total $=4+4=8$</li>
      <li>image pixels total $=16$</li>
      <li>background stuff pixels $=16-8=8$</li>
    </ol>
    <p>Panoptic segmentation demands a non-overlapping final map: each pixel is either owned by one thing instance or by one stuff class.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Confusing semantic and instance masks.</b> Four pixels labeled class $1$ do not by themselves identify separate objects.</li>
      <li><b>Using box IoU as a substitute for mask IoU.</b> Two masks can share a box while occupying different pixels, so the mask loss and mask IoU matter.</li>
      <li><b>Skipping RoIAlign for small objects.</b> The interpolation example shows how rounding can move boundaries before the mask head sees them.</li>
      <li><b>Allowing overlapping panoptic owners.</b> Panoptic output must pick one owner per pixel; overlapping instance probabilities need conflict resolution.</li>
      <li><b>Training the mask head on the wrong class channel.</b> The selected class determines which predicted silhouette is compared to the binary target.</li>
    </ul>`
};

window.ALLML_CONTENT["7.20"] = {
  tagline:"A Vision Transformer treats an image as a sentence of patches, then lets attention decide which patches should borrow information from each other.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.20-vision-transformers-vit.ipynb",
  context:String.raw`
    <p>ViT is the point where the transformer recipe is applied to images with almost shocking directness.</p>
    <ul>
      <li><b>Image representation</b> (7.1) supplies the pixel grid that will be chopped into fixed-size patches.</li>
      <li><b>Linear algebra</b> turns each flattened patch into an embedding vector through a learned projection.</li>
      <li><b>Attention</b> computes normalized similarities between patch queries and keys, then mixes value vectors.</li>
    </ul>
    <p>Where it leads: ViT contrasts with convolutional ConvNeXt (7.12), provides a foundation for DETR-style global reasoning (7.17), and motivates Swin (7.21), which restores locality and hierarchy for dense vision tasks.</p>`,
  intuition:String.raw`
    <p>The concrete problem: CNNs bake in locality and translation structure, while transformers are excellent at global token interactions. ViT asks whether an image can simply become a token sequence.</p>
    <p>The naive pixel-token version is too long: every pixel attending to every other pixel is expensive and forgets useful patch-level structure. ViT groups pixels into patches, embeds each patch, adds positional information, and feeds the resulting sequence to a transformer encoder.</p>
    <p>The design decision people gloss over is <b>patch size</b>. A larger patch shortens the sequence and lowers attention cost, but it also makes the first tokenization coarser. Before the model learns anything, the patch size has already chosen the granularity of visual words.</p>`,
  mathematics:String.raw`
    <p>ViT flattens image patches into tokens, adds positions, and applies scaled dot-product attention:</p>
    <div class="formula-box">$$X=[x_{patch}E]+P,\\qquad \operatorname{Attn}(Q,K,V)=\operatorname{softmax}\!\left(\frac{QK^T}{\sqrt d}\right)V$$</div>
    <p>$x_{patch}$ is a flattened patch, $E$ is the patch embedding matrix, $P$ is the positional embedding table, and $Q,K,V\in\mathbb{R}^{N\times d}$ are query, key, and value matrices for $N$ tokens.</p>

    <p><b>Patches become tokens.</b> The notebook reshapes a $4\times4$ image into non-overlapping $2\times2$ patches:</p>
    <ol class="work">
      <li>patches per side $=4/2=2$</li>
      <li>number of patches $=2\times2=4$</li>
      <li>each patch has $2\times2=4$ pixels, so the token table shape is $4\times4$</li>
    </ol>
    <p>The image is now a short sequence of four visual tokens, each carrying four raw pixel values before projection.</p>

    <p><b>Position embeddings break identical-token symmetry.</b> The notebook starts with $4\times3$ ones and adds positions $0/100$ through $11/100$:</p>
    <ol class="work">
      <li>token $0$ becomes $[1.00,1.01,1.02]$</li>
      <li>token $1$ becomes $[1.03,1.04,1.05]$</li>
      <li>the difference is $[0.03,0.03,0.03]$, so the rows are no longer equal</li>
    </ol>
    <p>Without position information, the transformer would know which patches exist but not where they came from.</p>

    <p><b>Attention is normalized similarity.</b> The notebook uses $Q=K=\begin{bmatrix}1&0\\0&1\end{bmatrix}$ and values $V=\begin{bmatrix}2&0\\0&3\end{bmatrix}$, without the scale factor in code:</p>
    <ol class="work">
      <li>scores $QK^T=\begin{bmatrix}1&0\\0&1\end{bmatrix}$</li>
      <li>row softmax of $[1,0]$ is approximately $[0.731,0.269]$</li>
      <li>first output row $=0.731[2,0]+0.269[0,3]=[1.462,0.807]$</li>
    </ol>
    <p>The first token mostly keeps its own value but still borrows from the second token.</p>

    <p><b>Similar embeddings land close by cosine.</b> The notebook compares $v_1=[1.1,2,2.9]$ and $v_2=[0.9,2.05,3.1]$:</p>
    <ol class="work">
      <li>dot product $=1.1\cdot0.9+2\cdot2.05+2.9\cdot3.1=14.08$</li>
      <li>norms are approximately $3.686$ and $3.823$</li>
      <li>cosine $=14.08/(3.686\cdot3.823)\approx0.998$</li>
    </ol>
    <p>Patch representations that point in nearly the same direction can be treated as a strong positive pair or semantic neighbor.</p>

    <p><b>A head turns logits into probabilities.</b> The notebook logits $[0.1,2.0,0.5]$ yield:</p>
    <ol class="work">
      <li>softmax probabilities approximately $[0.109,0.728,0.163]$</li>
      <li>the largest probability is the second entry</li>
      <li>the probabilities sum to $0.109+0.728+0.163=1.000$</li>
    </ol>
    <p>For classification, the ViT class token would feed such a head; for caption-style decoding, the same softmax idea chooses the next word.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Forgetting positional embeddings.</b> The token rows of ones become distinguishable only after $P$ is added.</li>
      <li><b>Choosing patch size only for speed.</b> Fewer patches reduce attention cost, but coarse patches can erase small objects before attention begins.</li>
      <li><b>Applying softmax over the wrong axis in attention.</b> The notebook normalizes each query row so its weights over keys sum to one.</li>
      <li><b>Dropping the $\sqrt d$ scale in large models.</b> The toy code omits it harmlessly at $d=2$, but real dot products grow with dimension and saturate softmax.</li>
      <li><b>Reading ViT attention as guaranteed explanation.</b> Attention weights show token mixing, not automatically a faithful causal account of the prediction.</li>
    </ul>`
};

window.ALLML_CONTENT["7.21"] = {
  tagline:"Swin makes transformers behave like vision backbones by attending locally, shifting the windows, and building a hierarchy of larger visual tokens.",
  colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.21-swin-transformer.ipynb",
  context:String.raw`
    <p>Swin starts from ViT's patch-token idea, then restores the locality and pyramids that dense vision tasks need.</p>
    <ul>
      <li><b>Vision Transformers</b> (7.20) provide patch embeddings and attention as the core token-mixing operation.</li>
      <li><b>CNN pyramids</b> (7.4, 7.16) explain why resolution should decrease while channels increase across stages.</li>
      <li><b>Segmentation and detection</b> (7.18, 7.19) need multi-scale feature maps, which plain ViT does not naturally produce.</li>
    </ul>
    <p>Where it leads: Swin is a transformer backbone for FPN detectors (7.16), Mask R-CNN (7.19), and dense prediction systems that need both local detail and global context.</p>`,
  intuition:String.raw`
    <p>The concrete problem: full ViT attention over all patches is expensive, and its flat sequence is awkward for detection and segmentation. Swin keeps attention but restricts it to local windows, then shifts those windows in alternating blocks so information crosses boundaries.</p>
    <p>The naive local-window approach traps each patch inside its first neighborhood. A shifted window is the elegant repair: move the partition, let former neighbors change, and local attention gradually spreads across the image.</p>
    <p>The design decision people often skip is <b>hierarchy through patch merging</b>. Swin does not keep one fixed token grid forever; it merges neighboring tokens, lowers resolution, and raises channels so later stages see larger structures at manageable cost.</p>`,
  mathematics:String.raw`
    <p>Swin replaces global attention with window attention and alternates it with shifted-window attention:</p>
    <div class="formula-box">$$\operatorname{W\mbox{-}MSA}(X)=\bigcup_{w}\operatorname{softmax}\!\left(\frac{Q_wK_w^T+B_w}{\sqrt d}\right)V_w,\qquad X' = \operatorname{Shift}(X)$$</div>
    <p>$X$ is the patch-token grid, $w$ indexes local windows, $Q_w,K_w,V_w$ are tokens inside one window, $B_w$ is relative position bias, and $\operatorname{Shift}$ changes the next window partition.</p>

    <p><b>Patch tokens begin like ViT.</b> The notebook splits a $4\times4$ image into $2\times2$ patches:</p>
    <ol class="work">
      <li>$4/2=2$ patches fit along each side</li>
      <li>total patches $=2\times2=4$</li>
      <li>each flattened patch has $4$ entries, so the table is $4\times4$</li>
    </ol>
    <p>Swin's first tokens are ordinary patch tokens; the difference is how later attention is constrained and staged.</p>

    <p><b>Window attention lowers pair count.</b> For a $4\times4$ token grid with $2\times2$ windows:</p>
    <ol class="work">
      <li>global attention compares $16\times16=256$ query-key pairs</li>
      <li>there are $4$ windows, each with $4$ tokens, so local pairs $=4\cdot4\cdot4=64$</li>
      <li>window attention uses $64/256=0.25$ of the pair comparisons</li>
    </ol>
    <p>The saving is the reason Swin can scale dense backbones without making every patch attend to every other patch at every block.</p>

    <p><b>Attention inside a window is still the same operation.</b> The notebook's two-token attention has scores $\begin{bmatrix}1&0\\0&1\end{bmatrix}$ and values $\begin{bmatrix}2&0\\0&3\end{bmatrix}$:</p>
    <ol class="work">
      <li>row softmax of $[1,0]$ is $[0.731,0.269]$</li>
      <li>first output row is $0.731[2,0]+0.269[0,3]=[1.462,0.807]$</li>
      <li>second output row is $0.269[2,0]+0.731[0,3]=[0.538,2.193]$</li>
    </ol>
    <p>Swin changes which tokens are allowed into the attention group; it does not change the softmax-weighted value mixing inside that group.</p>

    <p><b>A shifted window crosses old borders.</b> In a one-dimensional toy row of $8$ tokens with window size $4$ and shift $2$:</p>
    <ol class="work">
      <li>unshifted windows are $[0,1,2,3]$ and $[4,5,6,7]$</li>
      <li>shifted grouping includes $[2,3,4,5]$ across the old boundary</li>
      <li>tokens $3$ and $4$ could not attend together before, but now share a window</li>
    </ol>
    <p>That alternating partition is how local attention becomes cross-region communication over depth.</p>

    <p><b>Patch merging builds the hierarchy.</b> If a stage has a $4\times4$ grid with $C=3$ channels, merging each $2\times2$ neighborhood gives:</p>
    <ol class="work">
      <li>new grid size $=2\times2$ because each side halves</li>
      <li>concatenated channels before projection $=4C=12$</li>
      <li>a projection to $2C$ yields $6$ channels per merged token</li>
    </ol>
    <p>The representation becomes coarser but richer, matching the pyramid behavior detectors and segmenters expect.</p>`,
  pitfalls:String.raw`
    <ul>
      <li><b>Thinking window attention is global attention with a mask only for speed.</b> The locality changes information flow; shifted windows are needed so regions communicate.</li>
      <li><b>Forgetting relative position bias.</b> Inside a window, token order still matters, and $B_w$ gives attention a spatial preference.</li>
      <li><b>Skipping patch merging in dense tasks.</b> Without hierarchy, Swin loses the multi-scale structure that makes it useful as a backbone.</li>
      <li><b>Shifting without handling boundaries.</b> Implementations must mask wrapped tokens correctly, or opposite image edges can attend as if adjacent.</li>
      <li><b>Comparing Swin and ViT only by parameter count.</b> The key difference is attention pattern and feature pyramid behavior, not just model size.</li>
    </ul>`
};

window.ALLML_CONTENT["7.22"] = { tagline:"Self-supervised vision turns an image into its own teacher: hide, crop, or perturb it, then make the representation keep the identity that should survive.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.22-self-supervised-vision.ipynb", context:String.raw`
  <p>Self-supervised vision sits between ordinary augmentation and full visual pretraining: it learns from images before anyone supplies class labels.</p>
  <ul>
    <li><b>Patch embeddings</b> from Vision Transformers (7.21) provide the units MAE masks and reconstructs; the checked $4\times4$ image becomes four $2\times2$ patch tokens.</li>
    <li><b>Softmax attention</b> from Transformers gives DINO a way to compare a student view against a teacher view through normalized token similarities.</li>
    <li><b>Cosine similarity</b> from metric learning measures whether two augmentations of the same image land almost on the same direction in embedding space.</li>
  </ul>
  <p>Where it leads: pretrained visual encoders feed captioning (7.23), retrieval-style face matching (7.28), video backbones (7.29), and multimodal models in Part 8. The promise is simple but powerful: labels become a small finishing step instead of the only source of visual supervision.</p>`, intuition:String.raw`
  <p>The concrete problem: labeled image data is expensive, but unlabeled images are everywhere. If a model waits for human labels before learning edges, parts, textures, and object layout, it wastes the biggest signal available.</p>
  <p>The older shortcut was to train on a labeled proxy task and hope the features transferred. Self-supervision makes the proxy task from the image itself: SimCLR asks two augmented views to agree, MAE asks a model to reconstruct hidden patches, and DINO asks a student to match a teacher's distribution across views.</p>
  <p>The design decision people often miss is <b>what invariance is being purchased</b>. A contrastive crop should ignore color jitter and small translations, but it must not erase the object identity. MAE should understand structure well enough to fill holes, but not memorize pixels. The lesson is not that every perturbation is good; it is that the pretext task defines exactly which visual information the representation is encouraged to keep.</p>`, mathematics:String.raw`
  <p>For a SimCLR-style batch, one augmented view $i$ chooses its matching view $j$ as the positive and treats the other views as negatives:</p>
  <div class="formula-box">$$\mathcal L_i=-\log\frac{\exp(\operatorname{sim}(z_i,z_j)/\tau)}{\sum_{k\ne i}\exp(\operatorname{sim}(z_i,z_k)/\tau)}$$</div>
  <p>Here $z_i$ is the normalized embedding of one image view, $z_j$ is the embedding of the other view of the same image, $\tau$ is the temperature, and $\operatorname{sim}$ is cosine similarity. MAE changes the target to masked-patch reconstruction; DINO changes it to matching a teacher probability vector.</p>

  <p><b>Patches are the pieces MAE can hide.</b> The checked example reshapes a $4\times4$ image into non-overlapping $2\times2$ patches:</p>
  <ol class="work">
    <li>the image has $4\times4=16$ pixels</li>
    <li>each patch has $2\times2=4$ pixels</li>
    <li>the grid has $(4/2)\times(4/2)=4$ patches, so the patch-token table has shape $4\times4$</li>
  </ol>
  <p>MAE can now mask whole patch tokens instead of individual pixels. That is why the reconstruction task teaches spatial structure rather than isolated grayscale guessing.</p>

  <p><b>Position breaks a dangerous tie.</b> The checked example starts with four identical token rows of length $3$ and adds positions $0/100$ through $11/100$:</p>
  <ol class="work">
    <li>row $0$ receives $[0.00,0.01,0.02]$, so it becomes $[1.00,1.01,1.02]$</li>
    <li>row $1$ receives $[0.03,0.04,0.05]$, so it becomes $[1.03,1.04,1.05]$</li>
    <li>the first coordinate differs by $1.03-1.00=0.03$, so the two rows are no longer equal</li>
  </ol>
  <p>Without positional information, a masked-patch model cannot know whether a visible patch came from the top-left or bottom-right. Reconstruction needs both appearance and address.</p>

  <p><b>Attention makes a view aggregate matching evidence.</b> With $Q=K=\begin{bmatrix}1&0\\0&1\end{bmatrix}$ and $V=\begin{bmatrix}2&0\\0&3\end{bmatrix}$, the first query prefers the first key:</p>
  <ol class="work">
    <li>raw scores for query $0$ are $[1,0]$</li>
    <li>softmax weights are $[e^1/(e^1+e^0),e^0/(e^1+e^0)]\approx[0.731,0.269]$</li>
    <li>output coordinate values are $0.731\cdot2=1.462$ and $0.269\cdot3=0.807$</li>
  </ol>
  <p>The checked example's assertion that the first output coordinate is larger is not incidental: attention is using similarity to pull more strongly from the matching token.</p>

  <p><b>Positive views nearly coincide under cosine.</b> The two checked vectors are $v_1=[1.1,2.0,2.9]$ and $v_2=[0.9,2.05,3.1]$:</p>
  <ol class="work">
    <li>dot product $=1.1\cdot0.9+2.0\cdot2.05+2.9\cdot3.1=14.08$</li>
    <li>norms are $\|v_1\|\approx3.688$ and $\|v_2\|\approx3.823$</li>
    <li>cosine $=14.08/(3.688\cdot3.823)\approx0.9984$</li>
  </ol>
  <p>A value above $0.99$ says the augmentation changed the pixels much more than it changed the representation. That is exactly the invariant SimCLR is trying to learn.</p>

  <p><b>A contrastive loss rewards that agreement against negatives.</b> Use the positive cosine $0.9984$, a negative cosine $0.20$, and temperature $\tau=0.5$:</p>
  <ol class="work">
    <li>positive score $\exp(0.9984/0.5)=\exp(1.9968)\approx7.365$</li>
    <li>negative score $\exp(0.20/0.5)=\exp(0.4)\approx1.492$</li>
    <li>loss $=-\log(7.365/(7.365+1.492))\approx0.184$</li>
  </ol>
  <p>The loss is already small because the positive view dominates the denominator. If a false negative were too similar, that denominator would grow and the model would be pushed to separate examples it perhaps should not separate.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Using augmentations that change the label-like content.</b> The loss assumes $z_i$ and $z_j$ should match; a crop that removes the object turns the positive term into a lie.</li>
    <li><b>Forgetting positions in masked reconstruction.</b> The $0.03$ row difference above is what lets a decoder know where a patch belongs; removing it makes the same token ambiguous across locations.</li>
    <li><b>Letting temperature hide bad batches.</b> A very small $\tau$ can make the softmax overconfident even when negatives are weak, so the InfoNCE denominator stops reflecting useful competition.</li>
    <li><b>Reading high cosine as semantic proof.</b> The $0.9984$ positive similarity only says two views agree under the encoder; collapse can also make all views agree unless the objective prevents it.</li>
    <li><b>Mixing MAE and contrastive targets carelessly.</b> Reconstruction rewards pixel detail while contrastive learning rewards invariance; optimizing both without balance can make one objective undo the other.</li>
  </ul>` };

window.ALLML_CONTENT["7.23"] = { tagline:"Captioning is a translation problem where the source language is visual evidence and the target language is a sentence spoken one token at a time.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.23-image-captioning.ipynb", context:String.raw`
  <p>Image captioning is where a vision encoder must become useful to a language decoder, not merely accurate on classes.</p>
  <ul>
    <li><b>CNN or ViT features</b> from earlier vision lessons supply region or patch vectors that say what is visible before any word is generated.</li>
    <li><b>Attention</b> lets each word look back at the relevant visual tokens, so the word <b>dog</b> can attend to the animal patch rather than the sky patch.</li>
    <li><b>Softmax language modeling</b> turns decoder logits into a probability distribution over the vocabulary at each position.</li>
  </ul>
  <p>Where it leads: captioning is a bridge to visual question answering, image-text retrieval, and multimodal instruction models. It reuses self-supervised encoders (7.22), depends on transformer attention (7.21), and foreshadows the sequence models used throughout Part 8.</p>`, intuition:String.raw`
  <p>The concrete problem: classification can say <b>dog</b>, but a caption must say something structured like <b>a dog runs</b>. That requires both visual grounding and word order.</p>
  <p>A tempting but brittle approach is to detect objects, then paste labels into a template. Templates break as soon as relationships matter: <b>dog chasing ball</b> and <b>ball chasing dog</b> contain the same nouns but mean different scenes. A decoder instead predicts the next word conditioned on visual features and on the words already emitted.</p>
  <p>The design decision people gloss over is whether the image enters once or at every word. Feeding a single pooled vector is cheap, but it forces the decoder to remember all visual detail internally. Cross-attention is heavier, yet it lets later words re-check the image; that is why modern captioners treat visual tokens as a memory the sentence can consult repeatedly.</p>`, mathematics:String.raw`
  <p>At decoding step $t$, a caption model predicts the next token from previous tokens $y_{\lt t}$ and image features $V$:</p>
  <div class="formula-box">$$p(y_t=w\mid y_{\lt t},V)=\frac{\exp(o_w)}{\sum_{v\in\mathcal V}\exp(o_v)}$$</div>
  <p>The vector $o$ contains one logit per vocabulary word, $\mathcal V$ is the caption vocabulary, and training minimizes the negative log probability of the ground-truth next word.</p>

  <p><b>The image first becomes visual tokens.</b> The checked $4\times4$ image is split into $2\times2$ patches before any language is produced:</p>
  <ol class="work">
    <li>$16$ pixels divided by $4$ pixels per patch gives $4$ patches</li>
    <li>each flattened patch has length $4$</li>
    <li>the encoder input is therefore a $4\times4$ table of visual tokens</li>
  </ol>
  <p>A captioner can attend over these four tokens when it needs visual evidence for the next word. The sentence is generated serially, but the image memory stays available.</p>

  <p><b>Positions tell the decoder which patch is where.</b> Adding position values makes identical appearance tokens distinguishable:</p>
  <ol class="work">
    <li>token row $0$ becomes $[1.00,1.01,1.02]$</li>
    <li>token row $1$ becomes $[1.03,1.04,1.05]$</li>
    <li>their coordinate-wise difference is $[0.03,0.03,0.03]$</li>
  </ol>
  <p>That tiny offset carries layout. A caption such as <b>dog beside car</b> cannot be grounded if the visual memory forgets the difference between one patch address and another.</p>

  <p><b>Cross-attention chooses visual evidence for a word.</b> With the checked example's $Q=K=I$ and $V=\begin{bmatrix}2&0\\0&3\end{bmatrix}$, the first query attends more to the first visual token:</p>
  <ol class="work">
    <li>softmax over scores $[1,0]$ gives weights approximately $[0.731,0.269]$</li>
    <li>visual mixture $=0.731[2,0]+0.269[0,3]$</li>
    <li>the attended vector is approximately $[1.462,0.807]$</li>
  </ol>
  <p>If the next word is visually tied to the first token, the attention weights make that evidence louder before the vocabulary softmax runs.</p>

  <p><b>The decoder softmax picks the next word.</b> The checked example uses logits $[0.1,2.0,0.5]$ for the vocabulary $[\textsf{a},\textsf{dog},\textsf{runs}]$:</p>
  <ol class="work">
    <li>subtracting the max gives $[-1.9,0,-1.5]$</li>
    <li>exponentials are approximately $[0.150,1.000,0.223]$, whose sum is $1.373$</li>
    <li>probabilities are $[0.109,0.728,0.162]$, so the argmax is <b>dog</b></li>
  </ol>
  <p>The model is not outputting a word by magic; it is normalizing competing word scores, and the second logit wins by a large margin.</p>

  <p><b>Training reads the chosen word as loss.</b> If the target next word is <b>dog</b>, the probability above becomes a cross-entropy term:</p>
  <ol class="work">
    <li>target probability for <b>dog</b> is $0.728$</li>
    <li>negative log likelihood $=-\log(0.728)\approx0.317$</li>
    <li>if <b>runs</b> were the target, the loss would be $-\log(0.162)\approx1.820$</li>
  </ol>
  <p>The arithmetic explains why teacher forcing works: each known next word supplies a precise penalty to the decoder distribution.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Relying on object tags instead of visual grounding.</b> The softmax can say <b>dog</b>, but without attention to $V$ it may hallucinate words common in captions rather than words supported by the image.</li>
    <li><b>Dropping positional encodings.</b> The $0.03$ row offsets are small, yet they are the only cue that separates identical-looking patches by location.</li>
    <li><b>Training and decoding with different histories.</b> Teacher forcing conditions on correct previous words; greedy inference conditions on its own mistakes, so errors can compound across the sentence.</li>
    <li><b>Judging only the argmax token.</b> The gap between $0.728$ for <b>dog</b> and $0.162$ for <b>runs</b> matters; calibration affects beam search and caption diversity.</li>
    <li><b>Ignoring the end token.</b> A captioner is a sequence model; without a well-trained stop probability it either truncates too early or repeats fluent fragments forever.</li>
  </ul>` };

window.ALLML_CONTENT["7.24"] = { tagline:"Super-resolution is not just enlarging an image; it is deciding which high-frequency detail is justified by the low-resolution evidence.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.24-super-resolution.ipynb", context:String.raw`
  <p>Super-resolution starts with a small image and asks for a larger one that preserves content while inventing plausible detail only where the evidence permits.</p>
  <ul>
    <li><b>Interpolation</b> supplies the baseline: nearest-neighbor copying, bilinear averaging, and bicubic kernels all fill missing pixels without learning.</li>
    <li><b>Convolutional reconstruction</b> lets a network predict residual detail after a simple upsample has placed pixels on the larger grid.</li>
    <li><b>Image quality metrics</b> such as MSE and PSNR quantify fidelity, even when perceptual sharpness may disagree with pixel accuracy.</li>
  </ul>
  <p>Where it leads: super-resolution connects low-level restoration to generative modeling, diffusion-based image enhancement, video upscaling, and the practical question of whether a sharpened image is faithful evidence or a plausible fabrication.</p>`, intuition:String.raw`
  <p>The concrete problem: a $2\times2$ crop may need to become $4\times4$, but the missing twelve pixels were never observed. Copying pixels makes blocky squares; averaging smooths edges; hallucinating freely can create details that were not in the scene.</p>
  <p>The useful mental model is a two-stage bargain. First place the low-resolution evidence onto the high-resolution grid. Then learn a correction that restores edges and texture while staying close to the measured image when downsampled again.</p>
  <p>The design decision people gloss over is the loss. Pixel losses reward safe, average answers with high PSNR; adversarial or perceptual losses reward sharpness but can invent structure. A good super-resolution system is therefore not only an upsampler, but a statement about what kind of error is acceptable.</p>`, mathematics:String.raw`
  <p>For a ground-truth high-resolution image $I$ and a prediction $\hat I$, the pixel-fidelity metric PSNR is built from mean squared error:</p>
  <div class="formula-box">$$\operatorname{PSNR}=10\log_{10}\left(\frac{L^2}{\frac{1}{N}\sum_{p=1}^{N}(I_p-\hat I_p)^2}\right)$$</div>
  <p>Here $L$ is the maximum pixel value, $N$ is the number of high-resolution pixels, and each $p$ indexes one pixel. Larger PSNR means smaller average squared error.</p>

  <p><b>Nearest upsampling copies evidence into blocks.</b> The checked example upsamples $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ by repeating each row and column twice:</p>
  <ol class="work">
    <li>height changes from $2$ to $2\cdot2=4$ and width changes from $2$ to $4$</li>
    <li>the top-left low-resolution value $1$ fills high-resolution locations $(0,0),(0,1),(1,0),(1,1)$</li>
    <li>therefore the checked pixel is $\hat I[1,1]=1$</li>
  </ol>
  <p>This is a valid enlargement, but it has no new edge information. A learned model usually starts from this kind of grid and predicts what the copy step cannot know.</p>

  <p><b>Bilinear interpolation softens a jump.</b> Along one row, suppose two observed low-resolution samples are $1$ and $2$, and the missing high-resolution position lies halfway between them:</p>
  <ol class="work">
    <li>left weight $=0.5$ and right weight $=0.5$</li>
    <li>interpolated value $=0.5\cdot1+0.5\cdot2=1.5$</li>
    <li>nearest-neighbor would choose either $1$ or $2$, so bilinear reduces the step size to $0.5$ from each side</li>
  </ol>
  <p>Averaging removes blockiness but also blurs thin detail. That is why super-resolution networks are asked to add high-frequency residuals, not merely resize.</p>

  <p><b>Bicubic uses a wider local stencil.</b> A simple cubic-style one-dimensional estimate can combine four neighboring samples $[1,2,3,4]$ with weights $[-0.0625,0.5625,0.5625,-0.0625]$:</p>
  <ol class="work">
    <li>weighted sum $=-0.0625\cdot1+0.5625\cdot2+0.5625\cdot3-0.0625\cdot4$</li>
    <li>the value is $-0.0625+1.125+1.6875-0.25=2.5$</li>
    <li>the weights sum to $1.0$, so a constant region would stay constant</li>
  </ol>
  <p>Bicubic can look smoother than bilinear because it uses more context, but it is still a fixed rule. It cannot know whether a blurred diagonal was a wire, a shadow, or text.</p>

  <p><b>PSNR turns pixel error into a scale-aware score.</b> Compare a four-pixel prediction $[1,1,3,4]$ against target $[1,2,3,4]$ with pixel maximum $L=4$:</p>
  <ol class="work">
    <li>squared errors are $[0,1,0,0]$</li>
    <li>MSE $=(0+1+0+0)/4=0.25$</li>
    <li>PSNR $=10\log_{10}(16/0.25)=10\log_{10}(64)\approx18.06$ dB</li>
  </ol>
  <p>The one wrong pixel is visible in the score. If the model makes many small texture differences, PSNR can fall even when the image looks sharper to a person.</p>

  <p><b>A residual model only needs to learn the missing detail.</b> If nearest upsampling gives $[1,1,2,2]$ along a row and the desired sharp row is $[1,1.5,2,2.5]$, the residual is small:</p>
  <ol class="work">
    <li>residual $=$ target minus upsample $=[0,0.5,0,0.5]$</li>
    <li>adding it back gives $[1,1,2,2]+[0,0.5,0,0.5]=[1,1.5,2,2.5]$</li>
    <li>the correction energy is $0^2+0.5^2+0^2+0.5^2=0.5$</li>
  </ol>
  <p>Learning residuals focuses capacity on edges and texture: the coarse color placement came from the upsampler, while the network spends its parameters on what was missing.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Confusing bigger with better.</b> The checked $4\times4$ copy is larger but not more informative; every $2\times2$ block still repeats one measured value.</li>
    <li><b>Optimizing PSNR as if it were perception.</b> The MSE term rewards pixel averages, so a high-PSNR output may look waxy while a sharper output scores worse.</li>
    <li><b>Inventing evidence.</b> A perceptual loss can synthesize plausible letters or faces that were not present; super-resolution should not be treated as forensic recovery.</li>
    <li><b>Forgetting the downsampling model.</b> If training pairs are made with one blur kernel and deployment images came from another camera pipeline, the residuals target the wrong degradation.</li>
    <li><b>Evaluating on misaligned images.</b> A one-pixel shift creates squared errors even when the image is visually correct, because PSNR compares $I_p$ and $\hat I_p$ at exact locations.</li>
  </ul>` };

window.ALLML_CONTENT["7.25"] = { tagline:"Optical flow asks every pixel a delicate question: where did this same brightness move between two nearby frames?", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.25-optical-flow.ipynb", context:String.raw`
  <p>Optical flow is motion estimation at pixel resolution, turning two frames into a field of small displacement vectors.</p>
  <ul>
    <li><b>Image gradients</b> provide the local derivatives $I_x$, $I_y$, and $I_t$ used by the brightness-constancy equation.</li>
    <li><b>Linear equations</b> explain why one pixel gives one constraint for two unknowns, forcing local smoothness or learned priors.</li>
    <li><b>Warping</b> uses the estimated vector $(u,v)$ to sample one frame at the location predicted by the other.</li>
  </ul>
  <p>Where it leads: flow supports video understanding (7.29), tracking, stabilization, interpolation, and self-supervised learning from frame prediction. It is also the classical ancestor of many learned correspondence models.</p>`, intuition:String.raw`
  <p>The concrete problem: a video does not merely contain objects; it contains how image evidence moves. A ball moving right by one pixel should produce a rightward vector at its visible pixels, not a new independent detection in each frame.</p>
  <p>The naive solution is to search every possible displacement for every patch. That is expensive and brittle under repeated texture. The classical insight is local: if brightness is conserved over a tiny motion, derivatives constrain the velocity.</p>
  <p>The design decision people often skip is how to handle ambiguity. A single edge can only reveal motion perpendicular to the edge; motion along the edge looks unchanged. Practical flow methods add a neighborhood assumption, a pyramid, or a learned prior because the equation at one pixel is underdetermined.</p>`, mathematics:String.raw`
  <p>For image intensity $I(x,y,t)$ and small displacement $(u,v)$ between frames, brightness constancy gives the optical-flow constraint:</p>
  <div class="formula-box">$$I_xu+I_yv+I_t=0$$</div>
  <p>Here $I_x$ and $I_y$ are spatial derivatives, $I_t$ is the temporal derivative, and $(u,v)$ is horizontal and vertical pixel motion. One equation cannot determine both components without more information.</p>

  <p><b>The checked field encodes one-pixel rightward motion.</b> It creates a $3\times3\times2$ flow array and sets the horizontal channel to $1$ everywhere:</p>
  <ol class="work">
    <li>there are $3\times3=9$ pixel locations</li>
    <li>each location stores two components, so the tensor has $18$ scalar entries</li>
    <li>at the center, $\operatorname{flow}[1,1,0]=1$ and the vertical component is $0$</li>
  </ol>
  <p>The center vector therefore means: sample the corresponding content one pixel to the right, with no vertical shift.</p>

  <p><b>Brightness constancy fits that rightward motion.</b> Suppose a local patch has $I_x=2$, $I_y=0$, and the second frame is explained by $I_t=-2$:</p>
  <ol class="work">
    <li>plug in $u=1$ and $v=0$</li>
    <li>$I_xu+I_yv+I_t=2\cdot1+0\cdot0-2=0$</li>
    <li>the residual is $0$, so the motion is consistent with the derivative model</li>
  </ol>
  <p>This is the clean case the formula was built for: a small horizontal move across a horizontal brightness gradient.</p>

  <p><b>One pixel leaves an aperture ambiguity.</b> If the same temporal change occurs where $I_x=2$ and $I_y=0$, many vertical velocities satisfy the equation:</p>
  <ol class="work">
    <li>with $u=1,v=0$, the residual is $2\cdot1+0\cdot0-2=0$</li>
    <li>with $u=1,v=5$, the residual is $2\cdot1+0\cdot5-2=0$</li>
    <li>the vertical component is invisible because $I_y=0$</li>
  </ol>
  <p>That is the aperture problem in arithmetic form. The image edge tells you the component across the edge, but not the component along it.</p>

  <p><b>A small neighborhood can solve both components.</b> Use two nearby pixels with equations $2u+0v-2=0$ and $0u+3v-3=0$:</p>
  <ol class="work">
    <li>the first equation gives $u=1$</li>
    <li>the second equation gives $v=1$</li>
    <li>the local flow estimate is therefore $(u,v)=(1,1)$</li>
  </ol>
  <p>Lucas-Kanade-style methods rely on exactly this: a patch supplies differently oriented gradients so the velocity becomes identifiable.</p>

  <p><b>Warping tests the vector field.</b> Take a pixel at $(x,y)=(1,1)$ with checked flow $(u,v)=(1,0)$:</p>
  <ol class="work">
    <li>the predicted source location is $(x+u,y+v)=(2,1)$</li>
    <li>a frame value $I_2(2,1)=7$ would be compared to $I_1(1,1)$</li>
    <li>if $I_1(1,1)=7$, the photometric error is $7-7=0$</li>
  </ol>
  <p>Flow is useful because it can be checked by reconstruction: move along the vector, sample the other frame, and measure whether brightness agrees.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Assuming brightness really stays constant.</b> Shadows, specularities, and exposure changes violate the $I_t$ term even when the geometric flow is correct.</li>
    <li><b>Forgetting the aperture problem.</b> The equation with $I_y=0$ could not constrain $v$; a confident vertical component from one edge is usually a prior, not evidence.</li>
    <li><b>Mixing coordinate conventions.</b> The checked example's horizontal component is channel $0$; swapping $(u,v)$ makes a rightward field warp downward instead.</li>
    <li><b>Using large motions with a small-motion formula.</b> The derivative equation is a first-order approximation; pyramids or learned matching are needed when the displacement is many pixels.</li>
    <li><b>Ignoring occlusion.</b> Some pixels in frame one have no counterpart in frame two, so forcing photometric error to zero there trains the model on impossible matches.</li>
  </ul>` };

window.ALLML_CONTENT["7.26"] = { tagline:"Pose estimation turns a person from a blob of pixels into a small graph of joints, each found by asking where its heatmap is most confident.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.26-pose-estimation-keypoints.ipynb", context:String.raw`
  <p>Pose estimation is dense localization with semantics: not just where a person is, but where each named joint sits.</p>
  <ul>
    <li><b>Heatmaps</b> convert coordinate prediction into image-shaped confidence maps, one per keypoint such as wrist, elbow, or ankle.</li>
    <li><b>Gaussian targets</b> give smooth supervision around the annotated joint instead of punishing every near miss as completely wrong.</li>
    <li><b>Geometric grouping</b> connects detected joints into skeletons when multiple people appear in one image.</li>
  </ul>
  <p>Where it leads: keypoints support action recognition (7.29), human-computer interaction, sports analytics, tracking, and 3D body reconstruction. They also show why localization errors matter differently from classification errors.</p>`, intuition:String.raw`
  <p>The concrete problem: a bounding box can say <b>person</b>, but it cannot say whether the arm is raised or the knee is bent. Pose needs a coordinate for each joint.</p>
  <p>Directly regressing coordinates is possible, but it asks a network to jump from spatial features to two numbers. Heatmaps preserve the image grid: the model paints confidence over possible locations, and the coordinate is read from the peak or an expectation over the map.</p>
  <p>The design decision people often miss is the heatmap resolution. A low-resolution map is cheap and stable, but every cell covers many input pixels. A high-resolution map is precise but expensive and noisy. Good pose systems spend much of their design budget recovering sharp spatial detail without losing context.</p>`, mathematics:String.raw`
  <p>For keypoint type $k$, a heatmap estimator returns the coordinate with highest confidence:</p>
  <div class="formula-box">$$\hat p_k=\operatorname*{arg\,max}_{(y,x)} H_k(y,x)$$</div>
  <p>Here $H_k$ is the heatmap for one joint, indexed by row $y$ and column $x$. A soft-argmax replaces the hard maximum with a probability-weighted coordinate average.</p>

  <p><b>The checked heatmap peaks at the joint.</b> It builds $H(y,x)=\exp(-((x-3)^2+(y-1)^2)/2)$ on a $5\times5$ grid:</p>
  <ol class="work">
    <li>at $(y,x)=(1,3)$, the squared distance is $(3-3)^2+(1-1)^2=0$</li>
    <li>the heat value is $\exp(0)=1$</li>
    <li>therefore $\operatorname{argmax}(H)=(1,3)$</li>
  </ol>
  <p>The coordinate is not guessed from a label; it is the row and column where the joint confidence surface is highest.</p>

  <p><b>Nearby pixels are plausible but lower.</b> Move one column left to $(y,x)=(1,2)$:</p>
  <ol class="work">
    <li>squared distance is $(2-3)^2+(1-1)^2=1$</li>
    <li>heat value is $\exp(-1/2)\approx0.607$</li>
    <li>the peak-to-neighbor margin is $1.000-0.607=0.393$</li>
  </ol>
  <p>This smooth target teaches the model that a one-pixel miss is less wrong than a far-away joint. That is why Gaussian heatmaps train more gently than one-hot coordinate labels.</p>

  <p><b>A soft-argmax can recover subpixel evidence.</b> In one dimension, suppose three column probabilities around a joint are $[0.2,0.6,0.2]$ at columns $2,3,4$:</p>
  <ol class="work">
    <li>weighted coordinate $=0.2\cdot2+0.6\cdot3+0.2\cdot4$</li>
    <li>the result is $0.4+1.8+0.8=3.0$</li>
    <li>if the probabilities shift to $[0.1,0.6,0.3]$, the coordinate becomes $0.2+1.8+1.2=3.2$</li>
  </ol>
  <p>The hard argmax would still output column $3$ in both cases. The soft version preserves the direction of uncertainty.</p>

  <p><b>Resolution changes coordinate scale.</b> If the $5\times5$ heatmap was produced from a $20\times20$ image, each heatmap step represents $4$ input pixels:</p>
  <ol class="work">
    <li>heatmap peak $(y,x)=(1,3)$ maps to coarse input coordinate $(4,12)$</li>
    <li>adding a half-cell center offset gives $(1.5\cdot4,3.5\cdot4)=(6,14)$</li>
    <li>the two conventions differ by $2$ input pixels in each direction</li>
  </ol>
  <p>This is a common silent bug: the model is right on the heatmap, but the postprocessor maps rows and columns back to the image with the wrong convention.</p>

  <p><b>Skeleton grouping checks limb geometry.</b> Suppose shoulder, elbow, and wrist are at $(1,1)$, $(1,3)$, and $(1,5)$:</p>
  <ol class="work">
    <li>upper-arm length $=\sqrt{(1-1)^2+(3-1)^2}=2$</li>
    <li>forearm length $=\sqrt{(1-1)^2+(5-3)^2}=2$</li>
    <li>the straight-line shoulder-to-wrist distance is $4$</li>
  </ol>
  <p>Keypoints become pose only after they are connected into a plausible body graph. Geometry helps reject swapped wrists and elbows that individual heatmaps may score highly.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Swapping row and column.</b> The checked example peak is $(y,x)=(1,3)$; reporting $(3,1)$ moves the joint to a different body part with no runtime error.</li>
    <li><b>Using an overly sharp target.</b> A one-hot heatmap gives no gradient to near misses, while the Gaussian value $0.607$ tells the model it is close.</li>
    <li><b>Forgetting output stride.</b> The mapping from $5\times5$ heatmap coordinates back to a larger image must match the network stride and center convention.</li>
    <li><b>Trusting isolated peaks in crowded scenes.</b> A wrist heatmap peak can belong to one person while the elbow peak belongs to another unless grouping is handled explicitly.</li>
    <li><b>Evaluating only classification confidence.</b> A high heatmap score at the wrong location is still a pose error; the argmax coordinate is the output that matters.</li>
  </ul>` };

window.ALLML_CONTENT["7.27"] = { tagline:"OCR is visual sequence modeling: find text-shaped evidence in the image, then align a variable-width strip of features to characters.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.27-ocr-scene-text.ipynb", context:String.raw`
  <p>OCR and scene text recognition combine detection, rectification, and sequence decoding under messy real-world typography.</p>
  <ul>
    <li><b>Convolutional features</b> turn strokes and corners into a left-to-right feature sequence for a cropped word image.</li>
    <li><b>CTC alignment</b> trains from the final string even when we do not know which image column produced each character.</li>
    <li><b>Language priors</b> repair visual ambiguity, especially when signs are blurred, curved, occluded, or stylized.</li>
  </ul>
  <p>Where it leads: OCR powers document AI, accessibility, visual search, license-plate reading, and multimodal agents that must read screens. It is one of the clearest places where vision becomes a symbolic sequence.</p>`, intuition:String.raw`
  <p>The concrete problem: a scene image may contain a word at an angle, in perspective, with letters touching or stretched. The system must output a string, not a class label.</p>
  <p>The naive approach segments each character first, then classifies the segments. That breaks when letters touch, spacing varies, or the font is unusual. CTC avoids explicit segmentation: it lets many frame-level alignments collapse to the same final text.</p>
  <p>The design decision people often overlook is the blank symbol. Blank is not a character in the output; it is the alignment glue that lets the model represent repeated letters and variable spacing. Without blank, <b>book</b> and <b>bok</b> become painfully hard to distinguish.</p>`, mathematics:String.raw`
  <p>Connectionist Temporal Classification sums the probabilities of all frame-level paths $\pi$ that collapse to the target string $y$:</p>
  <div class="formula-box">$$P(y\mid x)=\sum_{\pi\in\mathcal B^{-1}(y)}\prod_{t=1}^{T}p_t(\pi_t\mid x)$$</div>
  <p>Here $x$ is the word image, $T$ is the number of feature steps, $p_t$ is the character distribution at step $t$, and $\mathcal B$ removes blanks and repeated adjacent labels.</p>

  <p><b>A text crop becomes a time sequence.</b> Suppose a recognizer reduces a $32\times100$ word image by a horizontal stride of $4$:</p>
  <ol class="work">
    <li>the output width is $100/4=25$ feature steps</li>
    <li>if each step has $64$ channels, the sequence has shape $25\times64$</li>
    <li>a five-character word therefore has more frames than characters, leaving room for blanks and repeats</li>
  </ol>
  <p>This mismatch is exactly why OCR needs alignment. The image columns and the final characters do not arrive one-to-one.</p>

  <p><b>CTC collapse removes blanks and repeated labels.</b> Let the frame path be $[\textsf{b},\varnothing,\textsf{o},\textsf{o},\varnothing,\textsf{k}]$:</p>
  <ol class="work">
    <li>first merge adjacent repeats only; the two separated <b>o</b> labels are not adjacent because no blank lies between them in this path, so adjacent equal labels collapse to one <b>o</b></li>
    <li>remove blanks $\varnothing$</li>
    <li>the collapsed output is <b>bok</b>, not <b>book</b></li>
  </ol>
  <p>The example shows why repeated letters require care: to keep two <b>o</b> characters, CTC needs a blank or another symbol between repeated labels before collapsing.</p>

  <p><b>A blank can preserve a doubled letter.</b> Use the path $[\textsf{b},\varnothing,\textsf{o},\varnothing,\textsf{o},\textsf{k}]$ instead:</p>
  <ol class="work">
    <li>there are no adjacent repeated nonblank labels to merge</li>
    <li>removing blanks leaves $[\textsf{b},\textsf{o},\textsf{o},\textsf{k}]$</li>
    <li>the final string is <b>book</b></li>
  </ol>
  <p>The blank symbol is therefore a modeling device, not decoration. It gives the network a way to separate repeated characters across time.</p>

  <p><b>Path probability multiplies frame decisions.</b> For three frames predicting <b>c</b>, blank, and <b>t</b> with probabilities $0.8$, $0.5$, and $0.7$:</p>
  <ol class="work">
    <li>path probability $=0.8\cdot0.5\cdot0.7$</li>
    <li>the product is $0.28$</li>
    <li>another valid path with probability $0.12$ would raise the string probability to $0.28+0.12=0.40$</li>
  </ol>
  <p>CTC does not bet everything on one segmentation. It sums over all segmentations that spell the same text.</p>

  <p><b>The checked neighboring vision numbers show common OCR subroutines.</b> A text detector may upsample a crop or use keypoint-like corners before recognition:</p>
  <ol class="work">
    <li>nearest upsampling of $\begin{bmatrix}1&2\\3&4\end{bmatrix}$ creates a $4\times4$ crop and keeps position $(1,1)$ equal to $1$</li>
    <li>a corner heatmap with center $(y,x)=(1,3)$ has value $\exp(0)=1$ at its peak</li>
    <li>a rightward rectification flow can store $u=1$ at the crop center</li>
  </ol>
  <p>Those mechanics are off the final string path, but they often prepare the scene-text crop so the CTC recognizer sees letters in a clean left-to-right order.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Segmenting characters too early.</b> Scene text rarely provides clean character boxes; CTC's sum over alignments exists to avoid that brittle preprocessing step.</li>
    <li><b>Deleting blanks incorrectly.</b> Removing blanks before merging repeats changes whether <b>book</b> survives as two <b>o</b> characters.</li>
    <li><b>Multiplying many probabilities without log space.</b> Products such as $0.8\cdot0.5\cdot0.7$ shrink quickly; real OCR decoders use log probabilities to avoid underflow.</li>
    <li><b>Forgetting perspective rectification.</b> A correct recognizer can fail if the crop is curved or slanted enough that the left-to-right feature sequence no longer matches reading order.</li>
    <li><b>Over-trusting a language model.</b> Priors can turn rare names, codes, or serial numbers into common words even when the visual evidence says otherwise.</li>
  </ul>` };

window.ALLML_CONTENT["7.28"] = { tagline:"Face recognition is classification at enrollment time and geometry at verification time: compare normalized identities by angle, not by raw pixels.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.28-face-recognition-metric-learning.ipynb", context:String.raw`
  <p>Face recognition uses a neural network to map each face crop into an embedding space where identity is measured by distance or cosine similarity.</p>
  <ul>
    <li><b>Feature normalization</b> places embeddings on a unit hypersphere so cosine similarity becomes a controlled angular comparison.</li>
    <li><b>Metric learning losses</b> pull same-identity faces together and push different identities apart, often with margins such as triplet, contrastive, or ArcFace losses.</li>
    <li><b>Threshold calibration</b> turns a similarity score into a verification decision with explicit false-accept and false-reject tradeoffs.</li>
  </ul>
  <p>Where it leads: the same metric-learning machinery appears in product search, person re-identification, image retrieval, and clustering. It also raises fairness, privacy, and deployment questions far beyond ordinary image classification.</p>`, intuition:String.raw`
  <p>The concrete problem: the system may see a new person at test time, so it cannot simply choose among the identities seen during training. It must decide whether two face images depict the same identity.</p>
  <p>Raw pixel distance is useless because lighting, pose, crop, and expression dominate identity. The model instead learns an embedding where identity-relevant directions align and nuisance variation is suppressed.</p>
  <p>The design decision people often miss is normalization. Without it, a model can inflate vector norms to win a classifier. With normalized embeddings and normalized class weights, the decision is angular: who points in the same direction? That is why cosine margins became central to modern face recognition.</p>`, mathematics:String.raw`
  <p>With normalized face embeddings $\hat f_a$ and $\hat f_b$, verification uses cosine similarity, while ArcFace trains angular separation with a margin $m$:</p>
  <div class="formula-box">$$s(a,b)=\hat f_a^\top\hat f_b,\qquad \ell=-\log\frac{e^{r\cos(\theta_y+m)}}{e^{r\cos(\theta_y+m)}+\sum_{j\ne y}e^{r\cos\theta_j}}$$</div>
  <p>Here $s(a,b)$ is the verification score, $r$ is a scale, $\theta_y$ is the angle to the correct identity weight, and $m$ is the angular margin imposed during training.</p>

  <p><b>The checked example normalizes a face vector before comparison.</b> It starts with $u=[3,4]$:</p>
  <ol class="work">
    <li>norm $\|u\|=\sqrt{3^2+4^2}=5$</li>
    <li>normalized vector $\hat u=[3/5,4/5]=[0.6,0.8]$</li>
    <li>the unit vector has norm $\sqrt{0.6^2+0.8^2}=1$</li>
  </ol>
  <p>After normalization, magnitude no longer decides identity similarity. Direction does.</p>

  <p><b>Cosine similarity becomes a dot product.</b> The checked example compares $\hat u=[0.6,0.8]$ with $v=[1,0]$:</p>
  <ol class="work">
    <li>dot product $=0.6\cdot1+0.8\cdot0$</li>
    <li>similarity $=0.6$</li>
    <li>the angle is $\arccos(0.6)\approx53.13^\circ$</li>
  </ol>
  <p>A threshold such as $0.7$ would reject this pair; a threshold such as $0.5$ would accept it. The same score can mean different decisions depending on the operating point.</p>

  <p><b>A contrastive margin penalizes impostors that are too close.</b> Suppose a negative pair has cosine $0.6$ and the allowed maximum similarity is $0.4$:</p>
  <ol class="work">
    <li>margin violation $=0.6-0.4=0.2$</li>
    <li>squared penalty $=0.2^2=0.04$</li>
    <li>if the negative cosine were $0.3$, the violation would be $
\max(0,0.3-0.4)=0$</li>
  </ol>
  <p>The loss only spends effort on impostor pairs that are inside the forbidden angular neighborhood.</p>

  <p><b>ArcFace makes the correct class work harder.</b> If the correct-class angle has $\cos\theta_y=0.8$ and the margin changes it to an effective cosine $0.6$, with scale $r=10$:</p>
  <ol class="work">
    <li>unmargined correct logit $=10\cdot0.8=8$</li>
    <li>margined correct logit $=10\cdot0.6=6$</li>
    <li>the logit drops by $2$, so the model must reduce the angle further to classify confidently</li>
  </ol>
  <p>The margin is not a postprocessing threshold. It shapes the embedding space during training so identities occupy cleaner angular regions.</p>

  <p><b>Verification thresholds trade two kinds of error.</b> Consider three genuine-pair scores $[0.9,0.8,0.6]$ and three impostor scores $[0.7,0.4,0.2]$:</p>
  <ol class="work">
    <li>threshold $0.65$ accepts $0.9,0.8,0.7$ and rejects $0.6,0.4,0.2$</li>
    <li>false accepts: one impostor score, $0.7$, out of $3$ impostors</li>
    <li>false rejects: one genuine score, $0.6$, out of $3$ genuine pairs</li>
  </ol>
  <p>A face system is incomplete without this calibration step. Embeddings produce scores; policy chooses the risk balance.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Comparing unnormalized embeddings.</b> The checked $[3,4]$ must become $[0.6,0.8]$; otherwise vector length contaminates identity similarity.</li>
    <li><b>Treating a threshold as universal.</b> The same cosine $0.6$ can be accepted or rejected depending on false-accept tolerance, population, and image quality.</li>
    <li><b>Training with classification but deploying as verification without margins.</b> A closed-set classifier may separate training identities while leaving poor geometry for unseen identities.</li>
    <li><b>Ignoring demographic and capture-condition shifts.</b> A threshold calibrated on one camera or population can produce very different error rates elsewhere.</li>
    <li><b>Letting alignment errors masquerade as identity differences.</b> Bad crops rotate or shift facial features before embedding, changing the cosine term for reasons unrelated to the person.</li>
  </ul>` };

window.ALLML_CONTENT["7.29"] = { tagline:"Video understanding is image understanding with time made explicit: evidence must be pooled, ordered, or convolved across frames before an action can be named.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.29-video-understanding-action-recognition.ipynb", context:String.raw`
  <p>Action recognition asks what happened, not merely what appears in one frame.</p>
  <ul>
    <li><b>Frame encoders</b> extract spatial features from each image, often reusing CNN or ViT backbones from earlier lessons.</li>
    <li><b>Temporal pooling and attention</b> combine frame features when order is weak or long-range context matters.</li>
    <li><b>3D convolutions</b> learn short motion patterns by applying kernels across time, height, and width together.</li>
  </ul>
  <p>Where it leads: video features support surveillance, sports analytics, content moderation, robotics, and multimodal timeline reasoning. Optical flow (7.25) offers motion cues, while pose keypoints (7.26) provide a compact human-centric alternative to raw frames.</p>`, intuition:String.raw`
  <p>The concrete problem: a single frame of a person with a raised arm could mean waving, throwing, reaching, or dancing. The action is in the change over time.</p>
  <p>The simplest baseline encodes frames independently and averages them. That can work for actions defined by objects, but it loses order: opening a door and closing a door can contain similar frames in reverse. Temporal models add either learned filters or attention so order and motion can affect the decision.</p>
  <p>The design decision people often understate is sampling. A clip that is too short misses the action; a clip that is too sparse aliases fast motion; a clip that is too dense costs too much. Video models are as much about choosing the temporal view as they are about network architecture.</p>`, mathematics:String.raw`
  <p>A basic video classifier pools frame features and then applies a classifier:</p>
  <div class="formula-box">$$\bar h=\frac{1}{T}\sum_{t=1}^{T}h_t,\qquad p(y\mid x_{1:T})=\operatorname{softmax}(W\bar h+b)$$</div>
  <p>Here $h_t$ is the feature vector for frame $t$, $T$ is the number of frames, and $\bar h$ is the clip representation. A 3D convolution instead computes features from local $(t,y,x)$ neighborhoods before pooling.</p>

  <p><b>The checked example pools evidence over three frames.</b> Its frame features are $[[1,0],[2,1],[3,1]]$:</p>
  <ol class="work">
    <li>first coordinate mean $=(1+2+3)/3=2$</li>
    <li>second coordinate mean $=(0+1+1)/3=2/3$</li>
    <li>the pooled clip feature is $[2,2/3]$</li>
  </ol>
  <p>This is the cleanest video baseline: collect evidence frame by frame, then average it into one clip descriptor.</p>

  <p><b>Mean pooling forgets order.</b> Reverse the same frames to $[[3,1],[2,1],[1,0]]$:</p>
  <ol class="work">
    <li>first coordinate mean $=(3+2+1)/3=2$</li>
    <li>second coordinate mean $=(1+1+0)/3=2/3$</li>
    <li>the reversed clip still pools to $[2,2/3]$</li>
  </ol>
  <p>That equality is dangerous for actions where direction matters. Pooling is robust, but it is blind to temporal order unless the frame features already encode it.</p>

  <p><b>A temporal difference keeps motion direction.</b> Compare consecutive first-coordinate values $1,2,3$:</p>
  <ol class="work">
    <li>forward differences are $2-1=1$ and $3-2=1$</li>
    <li>their average motion feature is $(1+1)/2=1$</li>
    <li>in the reversed clip, differences are $2-3=-1$ and $1-2=-1$, averaging to $-1$</li>
  </ol>
  <p>The sign distinguishes increasing from decreasing evidence. This is the tiny arithmetic version of why temporal convolutions and flow can help.</p>

  <p><b>A 3D convolution sees time and space at once.</b> Suppose a $2\times1\times1$ temporal kernel $[1,-1]$ is applied to two scalar frame values $1$ and $3$:</p>
  <ol class="work">
    <li>response $=1\cdot1+3\cdot(-1)$</li>
    <li>the value is $-2$</li>
    <li>reversing the frames gives $3\cdot1+1\cdot(-1)=2$</li>
  </ol>
  <p>A learned 3D filter can therefore encode direction-sensitive motion directly, instead of hoping the classifier infers it after pooling.</p>

  <p><b>Clip logits turn pooled evidence into an action.</b> Use pooled feature $[2,2/3]$ and two class weights $w_{	extsf{run}}=[1,0]$, $w_{	extsf{sit}}=[0,1]$:</p>
  <ol class="work">
    <li>run logit $=1\cdot2+0\cdot(2/3)=2$</li>
    <li>sit logit $=0\cdot2+1\cdot(2/3)=2/3$</li>
    <li>softmax run probability $=e^2/(e^2+e^{2/3})\approx0.791$</li>
  </ol>
  <p>The classifier prefers the action whose weight aligns with the averaged evidence. Better temporal modeling changes the evidence before this final softmax.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Averaging away the action.</b> The forward and reversed clips both produced $[2,2/3]$ under mean pooling, so order-sensitive labels need more than a mean.</li>
    <li><b>Sampling too sparsely.</b> Fast events can disappear between frames, making the temporal model reason over missing evidence.</li>
    <li><b>Confusing camera motion with object motion.</b> Optical flow or 3D convolutions may learn panning and zooming unless stabilization or data diversity controls it.</li>
    <li><b>Overfitting to backgrounds.</b> A model can classify <b>swimming</b> from water without recognizing the body motion, especially when datasets are biased.</li>
    <li><b>Ignoring clip boundaries.</b> Pooling frames before and after an action dilutes the signal; temporal localization and action classification are different tasks.</li>
  </ul>` };

window.ALLML_CONTENT["7.30"] = { tagline:"PointNet respects a point cloud's odd truth: the shape is the set of points, not the order in which the file happened to list them.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.30-point-clouds-pointnet.ipynb", context:String.raw`
  <p>3D point clouds represent surfaces as unordered samples in space, which makes them unlike images, text, or videos.</p>
  <ul>
    <li><b>Coordinate geometry</b> supplies the raw input: each point is an $(x,y,z)$ sample on or near an object surface.</li>
    <li><b>Shared multilayer perceptrons</b> apply the same feature extractor to every point, preventing the network from depending on list position.</li>
    <li><b>Symmetric pooling</b> such as max pooling collapses point features into one global shape descriptor that is invariant to permutation.</li>
  </ul>
  <p>Where it leads: point-cloud networks support autonomous driving, robotics, AR scanning, 3D retrieval, and neural rendering pipelines. They also prepare the geometric thinking needed for rays and densities in NeRF (7.31).</p>`, intuition:String.raw`
  <p>The concrete problem: a chair scanned by a depth sensor may produce thousands of points, and shuffling their order does not change the chair. A normal sequence model would treat the shuffle as a different input.</p>
  <p>PointNet's answer is disciplined: process each point with the same function, then use a symmetric operation that gives the same result under any permutation. Max pooling says which learned features are present anywhere in the shape.</p>
  <p>The design decision people often miss is what max pooling loses. It is excellent for detecting existence, but it discards counts and fine spatial relationships unless later architecture adds neighborhoods or segmentation heads. PointNet wins permutation invariance by choosing a very particular summary.</p>`, mathematics:String.raw`
  <p>PointNet computes a shared point feature $h(p_i)$ and aggregates with a symmetric max over the set:</p>
  <div class="formula-box">$$g(P)=\max_{p_i\in P} h(p_i)$$</div>
  <p>Here $P$ is an unordered point set, $p_i\in\mathbb R^3$ is one point, $h$ is the same learned function for every point, and the max is taken coordinate-wise across point features.</p>

  <p><b>The checked point cloud is a set of four 3D samples.</b> It uses points $[0,0,0]$, $[1,0,0]$, $[0,1,0]$, and $[0,0,1]$:</p>
  <ol class="work">
    <li>there are $4$ rows</li>
    <li>each row has $3$ coordinates</li>
    <li>the point-cloud array has shape $4\times3$</li>
  </ol>
  <p>The row order is a storage detail. The geometry is the four sampled locations.</p>

  <p><b>Coordinate-wise max pooling creates the global feature.</b> The checked feature table is $\begin{bmatrix}1&3\\2&1\\0&5\end{bmatrix}$:</p>
  <ol class="work">
    <li>first feature maximum $=\max(1,2,0)=2$</li>
    <li>second feature maximum $=\max(3,1,5)=5$</li>
    <li>global pooled feature $g=[2,5]$</li>
  </ol>
  <p>The shape descriptor records that some point strongly activated feature $0$ and some point strongly activated feature $1$; they need not be the same point.</p>

  <p><b>Permutation does not change the max.</b> The checked example reorders rows as $[2,0,1]$, giving $\begin{bmatrix}0&5\\1&3\\2&1\end{bmatrix}$:</p>
  <ol class="work">
    <li>first maximum remains $\max(0,1,2)=2$</li>
    <li>second maximum remains $\max(5,3,1)=5$</li>
    <li>the pooled vector is still $[2,5]$</li>
  </ol>
  <p>This is the core PointNet proof in numbers: a symmetric aggregator makes the output invariant to point ordering.</p>

  <p><b>A shared point function avoids index-specific meaning.</b> Suppose $h([x,y,z])=[x+2y,z]$ and apply it to $[1,0,0]$ and $[0,1,0]$:</p>
  <ol class="work">
    <li>$h([1,0,0])=[1+0,0]=[1,0]$</li>
    <li>$h([0,1,0])=[0+2,0]=[2,0]$</li>
    <li>max over these two features is $[2,0]$ regardless of which point was listed first</li>
  </ol>
  <p>The same $h$ sees every point. If different rows had different weights, a file shuffle would change the prediction.</p>

  <p><b>Max pooling ignores multiplicity.</b> Compare feature sets $A=\{[2,5],[1,3]\}$ and $B=\{[2,5],[2,5],[1,3]\}$:</p>
  <ol class="work">
    <li>$\max A=[2,5]$</li>
    <li>$\max B=[2,5]$</li>
    <li>duplicating the strongest point changes the count but not the global feature</li>
  </ol>
  <p>That is both strength and weakness. PointNet is robust to sampling order and some density changes, but pure max pooling cannot represent how often a feature appears.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Feeding point order into the model.</b> Any operation that depends on row index breaks the invariance demonstrated by the $[2,5]$ max under reordering.</li>
    <li><b>Forgetting coordinate normalization.</b> Raw scanner coordinates can encode location and scale more strongly than shape unless points are centered and scaled consistently.</li>
    <li><b>Assuming max pooling counts parts.</b> The duplicated strongest feature produced the same $[2,5]$, so object density and repeated structures can vanish from the global descriptor.</li>
    <li><b>Ignoring local neighborhoods.</b> PointNet can detect features anywhere, but fine geometry often needs PointNet++-style local grouping or graph neighborhoods.</li>
    <li><b>Mixing coordinate frames.</b> A rotated or mirrored point cloud changes coordinates even though the object is the same; invariance to permutation is not invariance to rotation.</li>
  </ul>` };

window.ALLML_CONTENT["7.31"] = { tagline:"NeRF renders a scene by asking a neural field what color and density live along each camera ray, then compositing those answers front to back.", colab:"https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/7.31-neural-rendering-nerf.ipynb", context:String.raw`
  <p>Neural rendering replaces an explicit mesh with a continuous function queried at points in space and viewed from camera rays.</p>
  <ul>
    <li><b>Ray geometry</b> maps each pixel to sample locations $r(t)=o+td$ through the scene.</li>
    <li><b>Density-to-opacity conversion</b> turns predicted volume density into the chance that a ray terminates at a sample.</li>
    <li><b>Alpha compositing</b> accumulates colors while tracking how much light has survived previous samples.</li>
  </ul>
  <p>Where it leads: NeRF connects 3D vision, inverse graphics, view synthesis, differentiable rendering, and generative 3D models. It also explains why camera calibration and sampling strategy matter as much as network size.</p>`, intuition:String.raw`
  <p>The concrete problem: given several posed images of a scene, we want to render a new camera view. A mesh requires explicit surfaces; a NeRF learns a radiance field that can be queried anywhere.</p>
  <p>The mental model is fog with color. Along a ray, empty space has low density and contributes little. Dense regions become opaque and contribute their color while reducing the light that reaches farther samples.</p>
  <p>The design decision people often gloss over is sampling along the ray. Too few samples miss thin surfaces; too many waste computation in empty space. The compositing equation is differentiable, but it only learns what the sampled points allow it to see.</p>`, mathematics:String.raw`
  <p>For samples along a ray, NeRF converts density $\sigma_i$ over interval $\delta_i$ to opacity $\alpha_i$, then composites color front to back:</p>
  <div class="formula-box">$$C(r)=\sum_i T_i\left(1-e^{-\sigma_i\delta_i}\right)c_i,\qquad T_i=\prod_{j\lt i}e^{-\sigma_j\delta_j}$$</div>
  <p>Here $c_i$ is the RGB color at sample $i$, $\alpha_i=1-e^{-\sigma_i\delta_i}$ is opacity, and $T_i$ is transmittance: the fraction of light that reaches sample $i$.</p>

  <p><b>A ray is a line of queried points.</b> The checked example uses origin $[0,0]$, direction $[1,0.5]$, and $t=[0,1,2,3]$:</p>
  <ol class="work">
    <li>$r(0)=[0,0]+0[1,0.5]=[0,0]$</li>
    <li>$r(2)=[0,0]+2[1,0.5]=[2,1]$</li>
    <li>$r(3)=[0,0]+3[1,0.5]=[3,1.5]$</li>
  </ol>
  <p>Each pixel casts one of these rays in 3D; the network is evaluated at sampled points along it.</p>

  <p><b>Density becomes alpha opacity.</b> The checked example uses densities $[0.1,1,3]$ with interval $\delta=0.5$:</p>
  <ol class="work">
    <li>for $\sigma=0.1$, $\alpha=1-e^{-0.05}\approx0.0488$</li>
    <li>for $\sigma=1$, $\alpha=1-e^{-0.5}\approx0.3935$</li>
    <li>for $\sigma=3$, $\alpha=1-e^{-1.5}\approx0.7769$, which is larger than $0.0488$</li>
  </ol>
  <p>Higher density over the same interval blocks more light. That is why the checked comparison tests the last opacity against the first.</p>

  <p><b>Transmittance tracks what reaches each sample.</b> With alpha values $[0.2,0.5,0.1]$, the checked example computes cumulative survival before each point:</p>
  <ol class="work">
    <li>$T_1=1$ because nothing is in front</li>
    <li>$T_2=1-0.2=0.8$</li>
    <li>$T_3=(1-0.2)(1-0.5)=0.8\cdot0.5=0.4$</li>
  </ol>
  <p>Farther samples can still contribute, but only the fraction of light not already absorbed in front of them.</p>

  <p><b>Weights are transmittance times opacity.</b> Using the same alpha values:</p>
  <ol class="work">
    <li>$w_1=T_1\alpha_1=1\cdot0.2=0.2$</li>
    <li>$w_2=T_2\alpha_2=0.8\cdot0.5=0.4$</li>
    <li>$w_3=T_3\alpha_3=0.4\cdot0.1=0.04$</li>
  </ol>
  <p>The middle sample contributes most because enough light reaches it and it is fairly opaque. This front-to-back weighting is the heart of NeRF rendering.</p>

  <p><b>Color is the weighted sum along the ray.</b> The checked colors are red, green, and blue unit vectors:</p>
  <ol class="work">
    <li>red contribution $0.2[1,0,0]=[0.2,0,0]$</li>
    <li>green contribution $0.4[0,1,0]=[0,0.4,0]$</li>
    <li>blue contribution $0.04[0,0,1]=[0,0,0.04]$, so RGB $=[0.2,0.4,0.04]$</li>
  </ol>
  <p>The rendered pixel is not the color of one surface sample. It is the accumulated radiance of every sampled point, discounted by what the ray has already encountered.</p>`, pitfalls:String.raw`
  <ul>
    <li><b>Forgetting transmittance.</b> Summing $\alpha_i c_i$ without $T_i$ lets hidden samples shine through foreground density.</li>
    <li><b>Using the wrong interval length.</b> The opacity $1-e^{-\sigma_i\delta_i}$ depends on $\delta_i$; changing sample spacing without updating it changes brightness and geometry.</li>
    <li><b>Sampling too coarsely.</b> Thin structures can fall between the $t$ values, so the renderer never receives gradients for them.</li>
    <li><b>Assuming density is a hard surface.</b> NeRF represents volumetric opacity; surfaces emerge from high-density regions but are not stored as explicit triangles.</li>
    <li><b>Training with inaccurate camera poses.</b> The ray equation $r(t)=o+td$ is only correct if the camera calibration is correct; pose errors become blurry geometry.</li>
  </ul>` };
