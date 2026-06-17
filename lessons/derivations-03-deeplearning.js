/* =====================================================================
   DERIVATIONS / PROOFS / INTUITION for the Deep Learning (CS230) module.
   Same style as derivations-00-foundations.js (the gold standard).
   Each value is HTML. It answers: WHERE does the formula come from?
   WHY is it true? What is the INTUITION? Show steps, keep sentences short.
   ===================================================================== */
(function () {
Object.assign(window.DERIVATIONS, {

/* ---------------------------------------------------------------- */
"dl-neuron":
  `<p><b>Why $z=w^\\top x+b$?</b> A neuron is not a magic box. It is a vote.</p>
   <ul class="steps">
     <li>Each input $x_i$ is a piece of evidence. The weight $w_i$ says how much that piece counts. Multiply: $w_i x_i$ is one weighted vote.</li>
     <li>Add up all the votes: $\\sum_i w_i x_i = w^\\top x$. That sum is the total evidence. The dot product is just "weighted sum" written short.</li>
     <li>Add the bias $b$. This is a fixed offset, a threshold. It shifts the whole sum up or down before we decide.</li>
   </ul>
   <p><b>Why the bias matters.</b> Without $b$, the line $w^\\top x$ always passes through zero. The neuron could never say "fire only when the evidence beats 5". The bias moves the threshold so the neuron can sit wherever it needs to.</p>
   <p><b>Intuition.</b> Think of a committee. Each member ($x_i$) has an opinion. Each opinion has a weight ($w_i$). You tally the weighted opinions, add a built-in bias for or against, and get a score $z$. The activation (next lesson) then bends that score into a decision.</p>`,

/* ---------------------------------------------------------------- */
"dl-activations":
  `<p><b>Why do we need a non-linear $g$ at all?</b> Here is the proof that without it, depth is useless.</p>
   <p><b>Claim.</b> Stacking linear layers gives one linear layer.</p>
   <ul class="steps">
     <li>Layer 1 with no activation: $a^{[1]} = W_1 x$. (Drop biases for clarity; they fold in the same way.)</li>
     <li>Layer 2 on top: $a^{[2]} = W_2 a^{[1]} = W_2 (W_1 x)$.</li>
     <li>Matrix multiply is associative: $W_2(W_1 x) = (W_2 W_1)\\,x$.</li>
     <li>Let $W = W_2 W_1$. Then $a^{[2]} = W x$. That is a single linear layer. The two layers collapsed into one. ∎</li>
   </ul>
   <p>So ten linear layers still only draw a straight line (or flat plane). Depth bought you nothing. The non-linear $g$ is what breaks this collapse: $W_2\\,g(W_1 x)$ can <b>not</b> be flattened, because $g$ sits between the two multiplies and blocks them from merging.</p>
   <p><b>Why a "bend" helps.</b> Real patterns are curvy (a cat is not a straight line in pixel space). Each non-linear layer adds a fold. Stack folds and you can carve any shape.</p>
   <p><b>Comparing the three.</b></p>
   <ul class="steps">
     <li><b>Sigmoid</b> $\\sigma(z)=\\frac{1}{1+e^{-z}}$ squishes to $(0,1)$. Problem: for big $|z|$ the curve is flat, so its slope is near 0. A near-0 slope means a near-0 gradient. The neuron stops learning. This is <b>saturation</b>.</li>
     <li><b>Tanh</b> is a sigmoid centered at 0, range $(-1,1)$. Centering helps learning, but it still saturates at the ends.</li>
     <li><b>ReLU</b> $\\max(0,z)$ has slope exactly 1 for positive $z$, so no saturation on that side and gradients flow freely. Its tradeoff is the <b>dying ReLU</b>: if a neuron is always negative, its output and slope are both 0 forever, so it never recovers. Leaky ReLU's tiny negative slope keeps it barely alive.</li>
   </ul>`,

/* ---------------------------------------------------------------- */
"dl-forward-prop":
  `<p><b>Where the formula comes from: it is just function composition.</b> Nothing new is invented; you only chain the neuron from the first lesson, layer after layer.</p>
   <ul class="steps">
     <li>One layer is a function: take input, compute $z=Wx+b$, squish to $a=g(z)$. Call this function $f_1$. So $a^{[1]}=f_1(x)$.</li>
     <li>The next layer is another function $f_2$ that eats $a^{[1]}$: $a^{[2]}=f_2(a^{[1]})$.</li>
     <li>Substitute: $a^{[2]}=f_2(f_1(x))$. The whole network is $f_L(\\dots f_2(f_1(x))\\dots)$, one big composed function.</li>
   </ul>
   <p><b>Why "the output of one layer is the input to the next".</b> That is exactly what composition means: feed the answer forward. Left to right, each $a$ becomes the next layer's $x$.</p>
   <p><b>Intuition.</b> An assembly line. Raw pixels enter. Layer 1 finds edges. Layer 2 combines edges into corners. Layer 3 into shapes. The last layer reads "cat". Each station only knows how to do its own small job on whatever the previous station handed it.</p>`,

/* ---------------------------------------------------------------- */
"dl-cross-entropy":
  `<p><b>Where does this strange formula come from?</b> It is not guessed. It falls out of <b>maximum likelihood</b> on a yes/no label.</p>
   <p>Setup: the label $y$ is 1 or 0. The model outputs $z$, which it claims is the probability that $y=1$.</p>
   <ul class="steps">
     <li>A coin that lands "1" with probability $z$ is a <b>Bernoulli</b>. Its probability for the actual outcome $y$ is $P(y\\mid z)=z^{y}(1-z)^{1-y}$.</li>
     <li>Check it: if $y=1$, this is $z^1(1-z)^0=z$. If $y=0$, this is $z^0(1-z)^1=1-z$. Correct both ways.</li>
     <li>We want the model to make the real data likely, so <b>maximize</b> $P(y\\mid z)$. Maximizing a product is hard; take $\\log$ (it is increasing, so the best $z$ is the same).</li>
     <li>$\\log P(y\\mid z)=y\\log z+(1-y)\\log(1-z)$.</li>
     <li>Loss should be small when good. So <b>minimize the negative</b>: $L=-[\\,y\\log z+(1-y)\\log(1-z)\\,]$. That is cross-entropy. ∎</li>
   </ul>
   <p><b>Why $-\\log$ punishes confident wrong answers.</b> Suppose the truth is $y=1$ but the model says $z=0.01$. Then $L=-\\log(0.01)\\approx 4.6$, huge. As $z\\to 0$, $-\\log z\\to\\infty$. Being sure and wrong costs you near-infinite loss. Being sure and right ($z\\to 1$) costs near 0.</p>
   <p><b>Intuition.</b> The loss is "surprise". A confident, correct guess is unsurprising (cheap). A confident, wrong guess is a shock (expensive). Training flees from shock.</p>`,

/* ---------------------------------------------------------------- */
"dl-backprop":
  `<p><b>Backprop IS the chain rule, run backward.</b> Let us derive the one-weight formula.</p>
   <p>The dependency chain is: weight $w$ sets $z=wx+b$, then $z$ sets $a=g(z)$, then $a$ sets the loss $L$.</p>
   <ul class="steps">
     <li>How does $L$ change when $w$ wiggles? Use the chain rule, peeling one link at a time:</li>
     <li>$\\frac{\\partial L}{\\partial w}=\\frac{\\partial L}{\\partial a}\\cdot\\frac{\\partial a}{\\partial z}\\cdot\\frac{\\partial z}{\\partial w}$.</li>
     <li>Each factor is a local slope: $\\frac{\\partial L}{\\partial a}$ (how loss reacts to the output), $\\frac{\\partial a}{\\partial z}$ (slope of the activation), $\\frac{\\partial z}{\\partial w}=x$ (since $z=wx+b$). ∎</li>
   </ul>
   <p>Then step downhill: $w \\leftarrow w-\\eta\\,\\frac{\\partial L}{\\partial w}$, where $\\eta$ is the learning rate.</p>
   <p><b>Why go backward, not forward?</b> Look at the chain. The factor $\\frac{\\partial L}{\\partial a}$ is shared by <b>every</b> weight feeding into $a$. Compute it once, near the output, then reuse it for all of them.</p>
   <ul class="steps">
     <li>Start at the loss. Compute $\\frac{\\partial L}{\\partial a}$ for the last layer.</li>
     <li>Pass that backward one layer. Multiply by the local slopes there to get that layer's gradients, and a new "$\\frac{\\partial L}{\\partial a}$" to pass further back.</li>
     <li>Each layer reuses the number handed to it from the right. No work is repeated.</li>
   </ul>
   <p><b>Intuition.</b> This reuse is <b>dynamic programming</b> over the network's graph. A forward-only approach would recompute the same downstream slopes for every weight, which is hopelessly slow. Backprop computes each shared slope exactly once and shares it. That is the whole reason training deep nets is feasible.</p>`,

/* ---------------------------------------------------------------- */
"dl-optimizers":
  `<p><b>Why plain descent struggles.</b> Picture a long narrow ravine. The walls are steep, the floor gently slopes to the goal. Plain gradient descent bounces between the steep walls (big sideways gradient) and crawls along the floor (tiny forward gradient). Zig-zag, slow.</p>
   <p><b>Momentum: a running average that damps oscillation.</b></p>
   <ul class="steps">
     <li>Keep a velocity $v$. Each step add in the new gradient: $v \\leftarrow \\beta v+\\frac{\\partial L}{\\partial w}$, then $w \\leftarrow w-\\eta v$. Here $\\beta$ (near 0.9) is how much of the past velocity you keep, so consistent gradients pile up into speed.</li>
     <li>The sideways gradient flips sign every step (left wall, right wall, left...). Averaging opposite signs cancels them out. The oscillation dies.</li>
     <li>The forward gradient always points the same way, so its average keeps growing. You accelerate down the floor. A heavy ball ignores the wobble and rolls straight to the bottom.</li>
   </ul>
   <p><b>RMSprop: scale each step by recent gradient size.</b></p>
   <ul class="steps">
     <li>Track a running average $s$ of the <i>squared</i> gradient, then divide the step by $\\sqrt{s}$.</li>
     <li>A direction with big recent gradients (steep wall) gets a big $\\sqrt{s}$, so its step is shrunk. A flat direction gets a small $\\sqrt{s}$, so its step grows.</li>
     <li>Result: every direction moves at a similar, sane pace. No single steep wall hijacks the step.</li>
   </ul>
   <p><b>Adam = Momentum + RMSprop.</b> It keeps both a velocity (momentum's smoothing) and a squared-gradient average (RMSprop's per-direction scaling). So it rolls straight <i>and</i> sizes each direction's step. That is why Adam "just works" and is the default.</p>`,

/* ---------------------------------------------------------------- */
"dl-minibatch":
  `<p><b>Why is a mini-batch gradient a fair stand-in for the full one?</b> Because it is an <b>unbiased estimate</b>. Here is the idea.</p>
   <ul class="steps">
     <li>The full gradient is the average of every example's gradient: $g_{\\text{full}}=\\frac{1}{N}\\sum_{i=1}^{N} g_i$, where $g_i$ is the gradient from example $i$ and $N$ is the dataset size.</li>
     <li>A mini-batch picks a random handful and averages just those: $g_{\\text{batch}}=\\frac{1}{m}\\sum_{i\\in\\text{batch}} g_i$, with $m$ the batch size.</li>
     <li>Pick the batch at random. Then the <b>expected value</b> of each picked $g_i$ is the average over all examples, which is $g_{\\text{full}}$. Averaging $m$ such picks still has expectation $g_{\\text{full}}$. So on average, the batch gradient equals the true gradient. That is what "unbiased" means. ∎</li>
   </ul>
   <p><b>The trade.</b> The batch gradient is right on average but noisy on any single step (you only sampled $m$ points). More examples in the batch means less noise but more compute per step. So you trade noise for speed.</p>
   <p>One full pass over all $N$ examples is an <b>epoch</b>, taking $N/m$ steps (iterations).</p>
   <p><b>Intuition.</b> To gauge a country's mood you do not poll everyone; you poll a random sample. The sample wobbles a bit but points the same way as the whole country. A mini-batch is that poll for the gradient. The wobble even helps: it can shake the model out of bad spots.</p>`,

/* ---------------------------------------------------------------- */
"dl-init":
  `<p>Three facts decide why init matters: zeros freeze, big values explode, and Xavier is the careful middle.</p>
   <p><b>Why all-zero weights are fatal (the symmetry argument).</b></p>
   <ul class="steps">
     <li>If every weight in a layer starts at 0 (or any single shared value), then every neuron in that layer computes the exact same $z$, hence the same output $a$.</li>
     <li>In backprop they all receive the exact same gradient, so they all update by the same amount.</li>
     <li>After the update they are still identical. They stay identical forever. The whole layer acts like one neuron. The symmetry never breaks. ∎</li>
   </ul>
   <p>Random init breaks the tie: different starting weights get different gradients, so neurons specialize.</p>
   <p><b>Why too-large weights break things.</b> Each layer multiplies the signal. If weights are big, the signal grows layer by layer and explodes; or for saturating activations it slams into the flat ends and the gradient vanishes. Either way, learning stalls.</p>
   <p><b>Why Xavier sets $\\text{Var}(w)=\\frac{1}{n_{in}}$.</b> A neuron sums $n_{in}$ terms $w_i x_i$. When you add $n_{in}$ independent pieces, their variances add, so the sum's spread grows with $n_{in}$. To keep the output spread the same as the input spread, shrink each weight's variance by exactly the factor $n_{in}$. That is the rule. It keeps the signal's variance roughly constant from layer to layer, so it neither fades to nothing nor blows up across a deep stack.</p>`,

/* ---------------------------------------------------------------- */
"dl-dropout":
  `<p><b>Why does randomly deleting neurons help?</b> Two reasons: it stops co-adaptation, and it secretly trains an ensemble.</p>
   <p><b>No co-adaptation.</b></p>
   <ul class="steps">
     <li>Without dropout, a neuron can grow lazy: "neuron B always fixes my mistakes, so I'll lean on B". This brittle teamwork is <b>co-adaptation</b>. It memorizes the training set instead of learning robust features.</li>
     <li>With dropout, B might vanish at any step. So a neuron cannot trust any single partner. Each neuron must learn a feature that is useful <i>on its own</i>.</li>
     <li>Features that stand alone generalize better. Overfitting drops.</li>
   </ul>
   <p><b>An ensemble of sub-networks.</b> Each training step, a random subset of neurons is active, so a different "thinned" sub-network is trained. Over many steps you train exponentially many overlapping sub-networks that share weights. At test time you keep all neurons; that approximates averaging this whole ensemble. Averaging many models is a classic way to cut variance and overfitting.</p>
   <p><b>Intuition.</b> A team where any member might be out sick on any day. Everyone learns to do their part without depending on one specific colleague. The team becomes resilient.</p>`,

/* ---------------------------------------------------------------- */
"dl-batchnorm":
  `<p><b>Why normalize a layer's inputs to mean 0, variance 1?</b></p>
   <ul class="steps">
     <li>As data flows through layers, its scale drifts. One layer might suddenly see inputs in the thousands, the next in the tiny decimals. Each layer must constantly re-adjust to its shifting input scale. That is wasted, slow work.</li>
     <li>Batch norm pins the input distribution in place: subtract the batch mean $\\mu_B$, divide by the batch spread $\\sqrt{\\sigma_B^2+\\epsilon}$. Now every layer always sees inputs centered at 0 with spread 1. (The $\\epsilon$ just avoids dividing by zero.)</li>
     <li>A steady input scale means the loss surface is smoother, so you can take bigger, safer steps. Training speeds up and is less fragile to the learning rate.</li>
   </ul>
   <p><b>Why the learnable $\\gamma$ and $\\beta$?</b> Forcing mean 0, variance 1 might be wrong for some layer. Sigmoid, for instance, is nearly linear right around 0, which throws away its non-linearity. So after normalizing, we let the network rescale by $\\gamma$ and reshift by $\\beta$:</p>
   <div class="formula-box">$$ \\text{out}=\\gamma\\,\\frac{x-\\mu_B}{\\sqrt{\\sigma_B^2+\\epsilon}}+\\beta $$</div>
   <p>If the network ever wants the original, it can learn $\\gamma=\\sqrt{\\sigma_B^2+\\epsilon}$ and $\\beta=\\mu_B$, which exactly undoes the normalization. So batch norm never costs the network expressive power; it only adds the <i>option</i> of a tidy scale.</p>
   <p><b>Intuition.</b> Reset each layer's input to a clean, standard footing, then hand the network two dials to re-stretch and re-shift if it really needs to.</p>`,

/* ---------------------------------------------------------------- */
"dl-early-stopping":
  `<p><b>Why does the validation curve turn back up while training error keeps falling?</b> That gap is the whole story of overfitting.</p>
   <ul class="steps">
     <li>Training error is measured on the data the model studies. The model can always lower it more, even by memorizing noise unique to the training set. So it keeps falling, toward 0.</li>
     <li>Validation error is measured on held-out data the model never sees during training. It reflects real, general performance.</li>
     <li>Early on, the model learns true patterns that help everywhere, so validation error falls too.</li>
     <li>At some point the model runs out of true patterns and starts memorizing training-set quirks. Those quirks do not exist in the validation data, so they <i>hurt</i> there. Validation error bottoms out, then rises.</li>
   </ul>
   <p>The bottom of that valley is the best, most general model. <b>Early stopping</b> simply stops there: it watches validation error and quits once it stops improving (after a little "patience" to avoid quitting on a fluke).</p>
   <p><b>Intuition.</b> A student who keeps cramming eventually memorizes the practice exam's exact answers. Practice scores keep rising; the real-exam score peaks and then falls as cramming crowds out real understanding. Stop at the peak of the real-exam score.</p>`,

/* ---------------------------------------------------------------- */
"dl-conv":
  `<p><b>Why slide one small filter across the whole image?</b> Two big wins: far fewer parameters, and translation invariance.</p>
   <ul class="steps">
     <li><b>Fewer parameters.</b> A fully-connected layer on a $1000\\times 1000$ image would give each neuron a million weights. A $3\\times 3$ filter has just 9. And we reuse those same 9 numbers at every position, so the layer learns 9 weights, not millions.</li>
     <li><b>Translation invariance.</b> A vertical edge is a vertical edge wherever it appears. Since the <i>same</i> filter scans every location, it detects that edge in the top-left and the bottom-right with no extra learning. The pattern detector is shared across space.</li>
   </ul>
   <p><b>Why a filter is a pattern detector (via dot product).</b> At each spot, the output is $\\sum(\\text{filter}\\odot\\text{patch})$, the dot product of the filter with the pixels under it. From the dot-product geometry, that value is largest when the patch <i>points the same way</i> as the filter, i.e. when the patch looks like the filter's pattern. A high output means "this pattern is here". The feature map is a heat-map of where the pattern was found.</p>
   <p><b>Intuition.</b> One rubber stamp (the filter) is pressed everywhere on the page. Where the underneath matches the stamp's shape, you get a strong mark. Slide it everywhere and you have mapped out every place that shape occurs.</p>`,

/* ---------------------------------------------------------------- */
"dl-pooling":
  `<p><b>Why downsample by summarizing each little region?</b></p>
   <ul class="steps">
     <li>A feature map already answers "is the pattern near here?". We rarely need the exact pixel; the rough location is enough. So we can shrink the map and lose little.</li>
     <li><b>Max pooling</b> keeps the strongest response in each window: $\\text{out}=\\max(\\text{window})$. The strongest response is the clearest evidence the feature is present, so we keep that and drop the weaker numbers around it.</li>
     <li>Smaller maps mean less computation in every later layer, and fewer numbers to overfit on.</li>
   </ul>
   <p><b>Why it adds small-shift tolerance.</b> If the cat moves one pixel, the peak of a feature usually stays inside the same pooling window, so the max is unchanged. The network's answer does not flinch at a tiny shift. This is <b>local translation invariance</b>, bought cheaply.</p>
   <p><b>Average vs max.</b> Average pooling blends the whole window (smoother, keeps the general level). Max pooling grabs only the peak (sharper, keeps the strongest cue). Max is the common choice for "did this feature fire anywhere here?".</p>
   <p><b>Intuition.</b> Summarize each neighborhood by its loudest voice. The summary is smaller, and it barely changes if everyone shuffles a step.</p>`,

/* ---------------------------------------------------------------- */
"dl-conv-hyperparams":
  `<p><b>Let us derive the output-size formula by counting filter positions.</b></p>
   <p>We want $O$, the number of places a filter of width $F$ can sit along an input.</p>
   <ul class="steps">
     <li><b>Padding first.</b> Padding adds $P$ zeros on the left and $P$ on the right. So the padded width is $I+2P$. (Padding lets the filter reach edge pixels.)</li>
     <li><b>Place the filter, stride 1.</b> The filter's left edge can sit at position $1,2,3,\\dots$ until its right edge hits the end. Counting those slots on a width-$(I+2P)$ strip gives $(I+2P)-F+1$ positions.</li>
     <li><b>Now stride $S$.</b> Stride means we jump $S$ pixels between placements, so we use only every $S$-th slot. The number of placements becomes $\\frac{(I+2P)-F}{S}+1$.</li>
     <li>That is the formula:</li>
   </ul>
   <div class="formula-box">$$ O=\\frac{I-F+2P}{S}+1 $$</div>
   <p>The "$+1$" is the fence-post count: with a gap of $S$ between placements, the number of placements is one more than the number of gaps. ∎</p>
   <p><b>Sanity checks (intuition).</b> No padding, stride 1, $F=I$: $O=\\frac{I-I}{1}+1=1$, one placement, correct. A bigger stride $S$ shrinks $O$ (fewer placements). Padding $P=\\frac{F-1}{2}$ with stride 1 gives $O=I$, the "same" padding that keeps the size.</p>`,

/* ---------------------------------------------------------------- */
"dl-cnn-params":
  `<p><b>Let us derive the parameter count $(F\\cdot F\\cdot C+1)\\cdot K$ by just listing what one layer learns.</b></p>
   <ul class="steps">
     <li>One filter covers an $F\\times F$ window. That is $F\\cdot F$ weights per channel.</li>
     <li>The input has $C$ channels (e.g. red, green, blue). The filter looks at all of them, so it has a separate $F\\times F$ grid for each channel: $F\\cdot F\\cdot C$ weights total.</li>
     <li>Add one bias per filter: $F\\cdot F\\cdot C+1$ numbers for a single filter.</li>
     <li>The layer has $K$ filters (each makes one feature map). Multiply: $(F\\cdot F\\cdot C+1)\\cdot K$. ∎</li>
   </ul>
   <p><b>Why the image size never appears.</b> The same filter is reused at every position by sliding. Whether the image is $32\\times 32$ or $1000\\times 1000$, the filter still holds the same $F\\cdot F\\cdot C+1$ numbers. Weight sharing is exactly why this count is tiny and image-size-free.</p>
   <p><b>Receptive field intuition.</b> One output value depends only on the small patch under its filter. Stack layers and each value depends on a patch-of-patches, so deeper neurons "see" a wider slice of the original image. Early layers see edges; deep layers see whole objects.</p>`,

/* ---------------------------------------------------------------- */
"dl-object-detection":
  `<p><b>Why is IoU a fair 0-to-1 match score?</b></p>
   <ul class="steps">
     <li>We compare a predicted box with the true box. We want one number: 1 for a perfect overlap, 0 for none.</li>
     <li><b>Intersection</b> = the area both boxes share. Bigger overlap should score higher, so it goes on top.</li>
     <li><b>Union</b> = the total area either box covers (shared part counted once). It goes on the bottom as a fair size reference.</li>
     <li>$\\text{IoU}=\\frac{\\text{intersection}}{\\text{union}}$. If the boxes match perfectly, intersection $=$ union, so IoU $=1$. If they do not touch, intersection $=0$, so IoU $=0$. Always between 0 and 1.</li>
   </ul>
   <p><b>Why divide by union, not by box area?</b> Dividing by union punishes both kinds of mistake at once: a box that is too small misses part of the object (small intersection), and a box that is too big wastes area (big union). Both pull IoU down. So a high IoU means the prediction is the right size <i>and</i> in the right place.</p>
   <p><b>Why non-max suppression (NMS).</b> A detector often fires several overlapping boxes on one object. We want one box per object. NMS keeps the highest-confidence box, then deletes any other box whose IoU with it is high (it is a duplicate of the same object). Repeat. The duplicates vanish; one clean box per object remains.</p>`,

/* ---------------------------------------------------------------- */
"dl-face-recognition":
  `<p><b>Why does $\\ell=\\max(d(A,P)-d(A,N)+\\alpha,\\,0)$ do the right thing?</b> Read the inside piece by piece.</p>
   <p>$d(A,P)$ is the distance from the anchor to a same-person photo (want it small). $d(A,N)$ is the distance to a different person (want it large). $\\alpha$ is a margin, a required gap.</p>
   <ul class="steps">
     <li>We want $d(A,P)$ small and $d(A,N)$ big. Combine that wish into one expression: $d(A,P)-d(A,N)$. This is negative exactly when the positive is closer than the negative, which is what we want.</li>
     <li>Add a margin: $d(A,P)-d(A,N)+\\alpha$. Now we demand the negative be farther by at least $\\alpha$, not just barely farther. The expression is $\\le 0$ only once that gap is met.</li>
     <li>Wrap in $\\max(\\cdot,0)$. If the gap is already satisfied, the inside is $\\le 0$, so the loss is exactly 0, nothing to fix. If not, the loss is the positive shortfall, and minimizing it pulls $A,P$ together and pushes $A,N$ apart. ∎</li>
   </ul>
   <p><b>Why the margin $\\alpha$?</b> Without it, the model could make $d(A,N)$ just a hair bigger than $d(A,P)$ and call it done, leaving same and different people almost on top of each other. The margin forces a real, safe separation.</p>
   <p><b>Why "zero loss once far enough" is good.</b> Triplets that are already correct contribute nothing, so training focuses its effort on the hard, still-confused triplets.</p>
   <p><b>Intuition.</b> A magnet that pulls two photos of you together and shoves a stranger away, but stops pushing once the stranger is a safe distance off.</p>`,

/* ---------------------------------------------------------------- */
"dl-style-transfer":
  `<p><b>The core insight: in a trained CNN, content and style live in different places.</b></p>
   <ul class="steps">
     <li><b>Content = deep-layer activations.</b> Deep layers fire on high-level things ("there is a building here, a road there"). Two images with the same content produce similar deep activations. So the <b>content cost</b> measures how far the generated image's deep activations are from the photo's. Driving it down keeps the subject.</li>
     <li><b>Style = feature correlations (the Gram matrix).</b> Style is texture: which features tend to fire <i>together</i>, regardless of where. The <b>Gram matrix</b> records, for each pair of feature channels, how strongly they co-activate (their dot product across the map). It throws away position and keeps "what goes with what". So the <b>style cost</b> matches the generated image's Gram matrices to the painting's. Driving it down copies the brushstrokes and palette.</li>
   </ul>
   <p><b>Why the Gram matrix captures style, not layout.</b> It sums products of features over <i>all</i> positions, so it forgets where each feature was and remembers only how often features pair up. Texture is exactly "what pairs up, everywhere". That is why it transfers a look without dragging the painting's objects along.</p>
   <p><b>The recipe.</b> Start from a noisy image. Minimize a weighted sum: $\\text{total}=w_c\\,(\\text{content cost})+w_s\\,(\\text{style cost})$. Tune the pixels (not the network) to lower both. The weights $w_c,w_s$ set how photo-like vs how painterly the result is.</p>`,

/* ---------------------------------------------------------------- */
"dl-gan":
  `<p><b>Why does pitting two networks against each other produce realistic samples?</b> It is a <b>minimax game</b>.</p>
   <ul class="steps">
     <li>The <b>discriminator</b> $D$ wants to label real data as real and fakes as fake. It <i>maximizes</i> its accuracy at telling them apart.</li>
     <li>The <b>generator</b> $G$ turns random noise into fakes and wants $D$ to call them real. It <i>minimizes</i> $D$'s ability to spot the fakes.</li>
     <li>One objective, pulled in opposite directions: $G$ minimizes what $D$ maximizes. That is the minimax game $\\min_G \\max_D$.</li>
   </ul>
   <p><b>Why they improve each other.</b></p>
   <ul class="steps">
     <li>When $D$ gets sharper, it exposes exactly what is unrealistic about $G$'s fakes. That signal (via backprop) tells $G$ how to fix those flaws.</li>
     <li>When $G$ gets better, the old tells vanish, so $D$ must find subtler cues to keep catching fakes.</li>
     <li>This arms race ratchets both upward. It settles when $G$'s fakes are indistinguishable from real data, so $D$ can only guess (about 50/50). At that point the fakes look real. ∎ (in spirit)</li>
   </ul>
   <p><b>Intuition.</b> A forger and a detective locked in a duel. Every time the detective learns a new tell, the forger erases it. Push this to its limit and the forgeries become flawless.</p>`,

/* ---------------------------------------------------------------- */
"dl-rnn":
  `<p><b>Why share the same weights across every time step?</b></p>
   <ul class="steps">
     <li>Sequences vary in length: a tweet, a sentence, a paragraph. We need one rule that works for any length. A fixed set of per-position weights could not handle a sequence longer than expected.</li>
     <li>So the RNN applies the <i>same</i> update rule at every step: $a^{<t>}=g(W_{aa}\\,a^{<t-1>}+W_{ax}\\,x^{<t>}+b_a)$. The weights $W_{aa},W_{ax},b_a$ do not change with $t$.</li>
     <li>Reusing one rule means far fewer weights, and the pattern it learns ("how this word relates to the running context") applies at every position. Just like a conv filter shares weights across space, an RNN shares weights across time.</li>
   </ul>
   <p><b>Why the hidden state is memory.</b> Each step's new state $a^{<t>}$ is computed from the previous state $a^{<t-1>}$ plus the new input. So $a^{<t-1>}$ carries a squeezed summary of everything seen so far into the next step. That carried summary is the network's memory; it is how an earlier word can still influence a later one.</p>
   <p><b>Intuition.</b> Reading a sentence one word at a time, you keep a running gist in your head. Each new word updates the gist. The gist is the hidden state; the "how to update" habit is the shared weights.</p>`,

/* ---------------------------------------------------------------- */
"dl-vanishing-gradient":
  `<p><b>Why do gradients vanish or explode over long sequences?</b> Backprop through time <i>multiplies</i> one factor per step, and a long product of similar numbers runs away.</p>
   <ul class="steps">
     <li>To send the gradient from step $t$ back to step $1$, the chain rule passes it through every step in between. Each hop multiplies by a local factor $r$ (roughly the recurrent weight times the activation's slope).</li>
     <li>Over $k$ steps that is the same factor multiplied $k$ times: about $r^k$.</li>
     <li>If $r<1$ (say $r=0.5$): $0.5^{20}\\approx 0.000001$. The gradient <b>vanishes</b>. Early steps get almost no update, so the network cannot learn long-range links.</li>
     <li>If $r>1$ (say $r=1.5$): $1.5^{20}\\approx 3300$. The gradient <b>explodes</b>. Updates overshoot and training blows up.</li>
   </ul>
   <p>It is the same math as compound interest: a rate just under 1, compounded many times, decays to nothing; a rate just over 1 rockets to infinity. Multiplying many factors is unforgiving.</p>
   <p><b>The fix for explosion: clipping.</b> If the gradient's size $\\lVert g\\rVert$ exceeds a threshold, rescale it down to that threshold while keeping its direction: $g \\leftarrow \\text{threshold}\\cdot\\frac{g}{\\lVert g\\rVert}$. Same direction, capped length, so one giant step cannot wreck training. (Vanishing needs a different fix, gated cells, next lesson.)</p>`,

/* ---------------------------------------------------------------- */
"dl-lstm-gru":
  `<p><b>Why does a gated, additive cell state let gradients flow far?</b> The previous lesson showed the killer was a long <i>product</i> of factors. Gated cells turn the key step into an <i>addition</i>.</p>
   <ul class="steps">
     <li>A gate is a sigmoid output in $(0,1)$: 0 means "block", 1 means "let through". The forget gate $f$ and update gate $u$ are such gates.</li>
     <li>The cell state updates additively: $c^{<t>}=f\\cdot c^{<t-1>}+u\\cdot \\tilde{c}^{<t>}$. The old memory passes through scaled by $f$, and new content is <i>added</i>, not multiplied in.</li>
     <li>When the network wants to remember something, it learns $f\\approx 1$. Then $c^{<t>}\\approx c^{<t-1>}+\\dots$: the old memory survives nearly untouched, step after step.</li>
     <li>In backprop, a path where each factor is $\\approx 1$ does not shrink (no $0.5^{20}$ decay) and does not blow up. Gradients flow across many steps. The gates created a near-1 "highway" for memory. ∎ (intuitively)</li>
   </ul>
   <p><b>Why gates, not fixed behavior?</b> Different moments need different memory. "Remember the subject is plural until the verb" vs "forget that, new sentence". Gates let the network <i>decide</i>, per step and per input, what to keep, forget, and output.</p>
   <p><b>GRU</b> is a lighter cell with fewer gates; it merges some roles, runs faster, and often matches the LSTM.</p>
   <p><b>Intuition.</b> A conveyor belt (the cell state) runs straight through. At each station, gates decide what to drop off, what to add, and what to read. Because the belt itself flows freely, a note placed early can ride all the way to the end.</p>`,

/* ---------------------------------------------------------------- */
"dl-word-embeddings":
  `<p><b>Why is one-hot a bad way to represent words?</b> Because it makes every pair of words equally far apart, so it cannot express similarity.</p>
   <ul class="steps">
     <li>A one-hot vector is all 0 with a single 1 at the word's slot. "cat" might be $[0,1,0,0]$, "dog" $[0,0,1,0]$.</li>
     <li>Any two different one-hots differ in exactly two slots, so the distance between any two distinct words is the same. "cat"-"dog" is as far as "cat"-"car". The geometry knows nothing about meaning.</li>
     <li>They are also huge: one dimension per vocabulary word (tens of thousands), almost all zeros. Wasteful.</li>
   </ul>
   <p><b>Why a learned dense vector is better.</b> An embedding is a short list of real numbers, learned so that similar words land near each other. "cat" and "dog" end up close; "car" sits elsewhere. Now distance <i>means</i> similarity, which is exactly what later layers need.</p>
   <p><b>How $e_w=E\\,o_w$ works.</b> $E$ is the embedding matrix, one column per word. Multiplying $E$ by the one-hot $o_w$ simply selects word $w$'s column. So the one-hot is just an index, and the embedding is the dense vector stored at that index.</p>
   <p><b>Intuition.</b> One-hot gives every word its own private room with no doors, so no word is "near" any other. An embedding instead places words on a map where neighbors share meaning.</p>`,

/* ---------------------------------------------------------------- */
"dl-word2vec":
  `<p><b>Why does "predict the nearby words" produce meaningful vectors?</b> This is the distributional idea: words used in similar contexts have similar meanings.</p>
   <ul class="steps">
     <li>The model scores a context word $t$ given a center word $c$ by a dot product of their vectors, then softmaxes into a probability: $P(t\\mid c)=\\frac{\\exp(\\theta_t^\\top e_c)}{\\sum_j \\exp(\\theta_j^\\top e_c)}$.</li>
     <li>Training raises $P(t\\mid c)$ for words $t$ that really appear near $c$. To raise that probability, the dot product $\\theta_t^\\top e_c$ must grow, which pulls the vectors of co-occurring words to point alike.</li>
     <li>Two words that appear in the same kinds of contexts (e.g. "doctor" and "nurse" near "hospital", "patient") get pulled toward the same neighbors, so they end up near each other. Similar contexts $\\Rightarrow$ similar vectors.</li>
   </ul>
   <p><b>Why king − man + woman ≈ queen.</b> Because consistent relationships become consistent <i>directions</i> in the space. The "male $\\to$ female" change is roughly the same vector step for many pairs (man$\\to$woman, king$\\to$queen). So king $-$ man strips out the male-and-royal part, and adding woman puts femaleness back, landing on queen. Meaning is encoded in directions, so analogies become arithmetic.</p>
   <p><b>Intuition.</b> You are known by the company you keep. Words that hang out with the same crowd get similar coordinates, and recurring relationships turn into reusable arrows.</p>`,

/* ---------------------------------------------------------------- */
"dl-cosine-similarity":
  `<p><b>Where the formula comes from.</b> Start from the two-faced dot product:</p>
   <div class="formula-box">$$ w_1\\cdot w_2=\\lVert w_1\\rVert\\,\\lVert w_2\\rVert\\cos\\theta $$</div>
   <ul class="steps">
     <li>This identity (proven in the foundations dot-product lesson) says the dot product equals the two lengths times the cosine of the angle $\\theta$ between the vectors.</li>
     <li>Solve for $\\cos\\theta$: divide both sides by the two lengths.</li>
     <li>$\\cos\\theta=\\dfrac{w_1\\cdot w_2}{\\lVert w_1\\rVert\\,\\lVert w_2\\rVert}$. That is cosine similarity. ∎</li>
   </ul>
   <p><b>Why divide out the lengths?</b> The raw dot product is big both when vectors agree <i>and</i> when they are merely long. We care about <b>direction</b> (meaning), not size. Dividing by $\\lVert w_1\\rVert\\,\\lVert w_2\\rVert$ cancels the length, leaving pure direction. A word vector and the same vector scaled $\\times 10$ point the same way, so they should score identical, and now they do (both give 1).</p>
   <p><b>Reading the score.</b> $\\cos 0^\\circ=1$ (same direction, very similar). $\\cos 90^\\circ=0$ (perpendicular, unrelated). $\\cos 180^\\circ=-1$ (opposite). A clean $-1$ to $1$ similarity that ignores magnitude.</p>
   <p><b>Intuition.</b> Two arrows. Cosine asks only "do they point the same way?", not "how long are they?". For comparing meanings, direction is what counts.</p>`,

/* ---------------------------------------------------------------- */
"dl-attention":
  `<p><b>Why turn raw relevance scores into softmax weights that sum to 1?</b> Because that makes a soft, differentiable look-up.</p>
   <ul class="steps">
     <li>For output step $t$, score each input part $t'$ by a relevance number $e^{<t,t'>}$: higher means "more worth looking at".</li>
     <li>Softmax them: $\\alpha^{<t,t'>}=\\frac{\\exp(e^{<t,t'>})}{\\sum_{t'}\\exp(e^{<t,t'>})}$. Exponentiating makes every weight positive; dividing by the sum makes the weights add to 1.</li>
     <li>Weights that are positive and sum to 1 are exactly the recipe for a weighted average. The context is $c=\\sum_{t'}\\alpha^{<t,t'>}\\,a^{<t'>}$, a blend of the inputs leaning on the relevant ones.</li>
   </ul>
   <p><b>Why "soft" and "differentiable" matter.</b> A hard look-up ("grab input #2") cannot be trained by gradients; you cannot take a derivative of a discrete pick. Softmax gives a <i>soft</i> pick: mostly input 2, a little of 1 and 3. It is smooth, so backprop can nudge the scores and the model can <i>learn</i> where to look. As one score dominates, its weight approaches 1 and it acts like a real look-up, but it stays trainable.</p>
   <p><b>Why this is the heart of Transformers.</b> Attention lets any output position pull directly from any input position, no matter how far apart, with learned weights. That direct, learnable any-to-any link is what made Transformers and modern large language models possible.</p>
   <p><b>Intuition.</b> A spotlight you can split: shine 67% on one word, 24% on another, 9% on a third. The blend under the light is the context.</p>`,

/* ---------------------------------------------------------------- */
"dl-data-augmentation":
  `<p><b>Why do label-preserving transforms help?</b> They teach <b>invariance</b> and effectively enlarge the dataset, for free.</p>
   <ul class="steps">
     <li>A flipped cat is still a cat. A rotated, cropped, or re-lit cat is still a cat. The transform changes the pixels but <i>not the label</i>. That is the whole trick: new inputs, same target.</li>
     <li>So each original image spawns many variants, all correctly labeled. The model trains on a much larger, more varied set without you collecting a single new photo.</li>
   </ul>
   <p><b>Why this teaches invariance.</b> By showing the model the same object flipped, rotated, and shifted, you tell it directly: "the answer must not depend on orientation, position, or lighting". The model is forced to latch onto what truly defines a cat (shape, fur, ears), not accidental facts like "the cat faced left in every training photo". Latching onto the real signal is exactly what generalization is.</p>
   <p><b>Why it fights overfitting.</b> Overfitting is memorizing specific training images. If the model almost never sees the exact same pixels twice (a fresh random transform each epoch), there is little to memorize. It must learn the general pattern instead.</p>
   <p><b>Intuition.</b> To teach a child "dog", you do not show one photo a thousand times. You show dogs big and small, left and right, in sun and shade. Augmentation manufactures that variety from the few photos you have.</p>`

});
})();
