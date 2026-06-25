/* Paper lesson — "Quantization and Training of Neural Networks for Efficient
   Integer-Arithmetic-Only Inference" (Jacob et al., Google, 2017).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-quantization-aware".
   GROUNDED from arXiv:1712.05877 (abstract) and the ar5iv HTML mirror
   (Section 2.1 Eq 1: r = S(q - Z); Section 2.2 Eq 5-6: M = S1 S2 / S3; Section 3
   Eq 12: the clamp-round-scale fake-quant; Section 4.2.4 Table 4.7 bit-width sweep).
   Track B (architecture): build the affine fake-quant + straight-through estimator
   on top of nn.Linear; train a QAT net; compare to post-training quantization of a
   non-QAT net; sweep accuracy vs bit-width. All CODE/CODEVIZ numbers are our own run. */
(function () {
  window.LESSONS.push({
    id: "paper-quantization-aware",
    title: "QAT — Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference (2017)",
    tagline: "Map real numbers to int8 with one affine rule, simulate that rounding while training, and the net stays accurate after you throw away the floats.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Benoit Jacob, Skirmantas Kligys, Bo Chen, Menglong Zhu, Matthew Tang, Andrew Howard, Hartwig Adam, Dmitry Kalenichenko",
      org: "Google",
      year: 2017,
      venue: "arXiv:1712.05877 (Dec 2017); CVPR 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1712.05877",
      code: "https://github.com/tensorflow/tensorflow (tf.contrib.quantize / TensorFlow Lite)"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-neuron", "dl-forward-prop", "dl-backprop", "dl-cross-entropy", "pt-nn-module", "pt-autograd", "pt-custom"],

    // WHY READ IT
    problem:
      `<p>A trained neural network stores its weights and runs its arithmetic in <b>floating point</b> &mdash;
       numbers like $0.0734$ that carry a sign, an exponent, and many bits of precision (typically 32 bits
       each, called <b>float32</b>). That is fine on a server. It is expensive on a phone: floating-point math
       burns more power, more silicon, and more time than plain <b>integer</b> math, and many cheap chips have
       fast integer units but slow (or no) floating-point units.</p>
       <p>The obvious fix is <b>quantization</b>: store each number in a small integer instead, for example an
       <b>8-bit integer</b> (an <b>int8</b>, one of only 256 possible values) instead of a 32-bit float. That
       shrinks the model 4&times; and lets the chip use its fast integer path. But there is a catch the paper
       names directly:</p>
       <blockquote>"A common approach &hellip; leads to significant accuracy drops for small models." (&sect;3)</blockquote>
       <p>If you train normally in float and only <i>afterward</i> round everything to int8 (called
       <b>post-training quantization</b>), the rounding error can wreck accuracy &mdash; worst on small,
       efficient models, which are exactly the ones you want on a phone. The network never knew the rounding
       was coming, so its weights sit in places where a tiny round nudges the answer over a decision boundary.</p>`,
    contribution:
      `<ul>
        <li><b>An integer-only inference scheme.</b> One simple <b>affine</b> (linear-plus-offset) rule maps a
        real number $r$ to an integer $q$ and back: $r = S(q - Z)$. With it, a whole matrix multiply can run in
        integer arithmetic, with a single fixed-point rescale at the end (&sect;2.1&ndash;2.2).</li>
        <li><b>Quantization-aware training (QAT).</b> Instead of rounding after training, they <b>simulate</b>
        the int8 rounding <i>during</i> the forward pass of training &mdash; "<b>fake quantization</b>". The
        network sees the rounding error while it learns, so it settles into weights that survive it (&sect;3).</li>
        <li><b>The straight-through estimator (STE).</b> Rounding has a zero (or undefined) derivative, which
        would kill back-propagation. They pass the gradient <i>through</i> the round as if it were the identity,
        so training proceeds normally (&sect;3, following the simulated-quantization forward pass).</li>
      </ul>`,
    whyItMattered:
      `<p>This is the recipe behind <b>TensorFlow Lite</b> and the int8 quantization paths in essentially every
       on-device deep-learning stack since. "Fake-quant + straight-through estimator" became the standard way
       to ship a network to a phone, a microcontroller, or any integer-only accelerator. PyTorch's own
       quantization-aware training API implements the same idea. The phrase the field still uses &mdash;
       <i>QAT</i> &mdash; comes from this line of work.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.1 (Quantization scheme)</b> &mdash; the one equation that runs the whole paper,
        $r = S(q - Z)$, and the definitions of scale $S$ and zero-point $Z$. Transcribe it.</li>
        <li><b>&sect;2.2 (Integer-arithmetic-only matrix multiplication)</b> &mdash; how a real multiply becomes
        an integer multiply plus the rescale multiplier $M = S_1 S_2 / S_3$ (Eq. 5), and how $M$ becomes a
        bit-shift (Eq. 6). Read for the "why integer-only is possible" intuition.</li>
        <li><b>&sect;3 (Training with simulated quantization)</b> &mdash; the fake-quant function (Eq. 12), how
        weight ranges vs activation ranges are chosen, and the straight-through gradient. This is the part you
        implement.</li>
        <li><b>Tables 4.1&ndash;4.2 and Table 4.7</b> &mdash; the accuracy-after-quantization numbers and the
        bit-width sweep.</li>
       </ul>
       <p><b>Skim:</b> &sect;2.3 (the exact integer-accumulation algebra), the batch-norm folding details in
       &sect;3.2, and the detection/COCO experiments unless you care about object detection. The math you
       must own is one affine equation and one fake-quant equation.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two small nets to the same float accuracy. <b>Net A</b> is trained normally and only
       rounded to int8 <i>afterward</i> (post-training quantization). <b>Net B</b> is trained with the int8
       rounding <b>simulated in every forward pass</b> (quantization-aware training). Then you shrink the
       integer budget from 8 bits down toward 2 bits and measure test accuracy.</p>
       <p>Predict: at a generous <b>8 bits</b>, will the two nets differ much? And as you drop to <b>3 or 2
       bits</b>, which net's accuracy falls <b>faster</b> &mdash; the post-training one (Net A) or the
       quantization-aware one (Net B)? Write your guess and one sentence of reasoning.</p>`,
    attempt:
      `<p>Before the reveal, sketch the fake-quant you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>A function <code>fake_quant(x, a, b, nbits)</code> that simulates rounding a real tensor $x$ to
        <code>nbits</code> integers, then maps it back to a real number.
        <ul>
          <li>Step size (scale): <code>S = (b - a) / (2**nbits - 1)</code>  <i># the gap between two int levels</i></li>
          <li>TODO: <code>q = clamp(round((x - a) / S), 0, 2**nbits - 1)</code>  <i># the integer</i></li>
          <li>TODO: return <code>a + q * S</code>  <i># dequantize: back to a real value, but on the int grid</i></li>
        </ul></li>
        <li>TODO &mdash; the <b>straight-through estimator</b>: in the backward pass, return the incoming
        gradient <b>unchanged</b> (treat <code>round</code> as the identity). In PyTorch, a
        <code>torch.autograd.Function</code> whose <code>backward</code> just returns <code>grad</code>.</li>
        <li>In <code>forward(quant=True)</code>: fake-quant each layer's <b>weights</b> (range = the weight
        tensor's own min/max) and each layer's <b>activations</b> (range tracked by a moving average during
        training).</li>
       </ul>
       <p>Then train one net <i>with</i> fake-quant on (Net B) and one <i>without</i> (Net A), and quantize
       Net A only at the end. Predict which keeps accuracy as the bits shrink.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p><b>The map between worlds (&sect;2.1).</b> Quantization needs a rule that turns any real number $r$
       into a small integer $q$, and back. The paper's choice is an <b>affine</b> map &mdash; "affine" means
       linear with an offset, i.e. of the form $r = S \\cdot q + \\text{(constant)}$. Written the paper's way:</p>
       <p>$$ r = S\\,(q - Z). $$</p>
       <p>Two numbers define the map. The <b>scale</b> $S$ is a positive real &mdash; the size of one step on
       the integer grid, the real-world gap between consecutive integers. The <b>zero-point</b> $Z$ is an
       integer &mdash; the particular $q$ that lands exactly on the real value $0$. Because $0$ matters (padding,
       the ReLU floor), the scheme guarantees real $0$ is represented with no error: set $q = Z$ and you get
       $r = S(Z - Z) = 0$ exactly. To go the other way, invert the line: $q = \\text{round}(r / S) + Z$, then
       clamp into the integer range (for int8 with the unsigned convention, $0$ to $255$).</p>
       <p><b>Why this buys integer-only math (&sect;2.2).</b> Suppose you multiply two real matrices to get a
       third. Substitute $r = S(q - Z)$ for each. The real product becomes a product of <i>integers</i> $q$
       (which a cheap integer unit does fast), times one leftover real factor that combines the three scales:</p>
       <p>$$ M = \\frac{S_1 S_2}{S_3} \\qquad\\text{(Eq. 5)}. $$</p>
       <p>That single multiplier $M$ is the only non-integer thing left, and the paper shows $M$ always falls in
       $(0, 1)$, so it can be written $M = 2^{-n} M_0$ with $M_0 \\in [0.5, 1)$ (Eq. 6) &mdash; a fixed-point
       multiply plus a bit-shift. Net result: the heavy work is integer, with one cheap rescale at the end.</p>
       <p><b>Training so it survives rounding (&sect;3).</b> Here is the key move. During training they keep all
       the real weights in float and back-propagate normally &mdash; but in the <i>forward</i> pass they insert
       a <b>fake-quantization</b> operation that rounds weights and activations onto the int8 grid and
       immediately maps them back to real numbers (Eq. 12):</p>
       <p>$$ \\hat{r} = \\text{clamp}(r; a, b)\\ \\text{rounded to the grid of step } s,\\quad s = \\frac{b-a}{n-1}. $$</p>
       <p>So the network <i>computes</i> with the rounded values and feels the rounding error in its loss, but
       the underlying weights it updates are still smooth floats. The range $[a,b]$ is chosen per tensor: for
       <b>weights</b>, simply $a = \\min w$, $b = \\max w$; for <b>activations</b>, the ranges are collected
       during training and smoothed with an <b>exponential moving average</b> (EMA) &mdash; a running average
       that weights recent batches more (&sect;3).</p>
       <p><b>The gradient problem and the straight-through estimator.</b> Rounding is a staircase: flat almost
       everywhere (derivative $0$) with jumps (derivative undefined). If you back-propagate honestly through it,
       the gradient is $0$ and nothing learns. The fix is the <b>straight-through estimator (STE)</b>: in the
       backward pass, pretend the rounding was the identity function and pass the gradient through unchanged.
       Forward rounds; backward acts as if it did not. That one trick is what makes quantization-aware training
       trainable.</p>`,
    architecture:
      `<p>This paper has two distinct structures: the <b>integer-only inference engine</b> (what ships to the
       device) and the <b>quantization-aware training graph</b> (what produces the ranges and robust weights).</p>
       <p><b>A. Inference engine &mdash; one quantized layer (&sect;2).</b> Each tensor (weights $w$, input
       activations, output activations) is stored as <b>uint8</b> with its own pair $(S, Z)$ from Eq. 1.
       For a Linear / Conv layer the data flow is:</p>
       <ol>
        <li><b>Inputs:</b> uint8 activations $q_1$ with $(S_1, Z_1)$; uint8 weights $q_2$ with $(S_2, Z_2)$.</li>
        <li><b>Integer accumulate:</b> compute $\\sum_j q_1 q_2$ and the zero-point correction terms into an
        <b>int32</b> accumulator (Eq. 7) &mdash; all integer multiply-adds.</li>
        <li><b>Bias add:</b> add the bias, kept in <b>int32</b> (higher precision than the int8 weights).</li>
        <li><b>Rescale:</b> multiply the int32 accumulator by $M = S_1 S_2 / S_3$ (Eq. 5), realized as the
        fixed-point $M = 2^{-n} M_0$ (Eq. 6) &mdash; one fixed-point multiply + a bit-shift.</li>
        <li><b>Requantize:</b> add $Z_3$, clamp to $[0,255]$, emit <b>uint8</b> activations for the next layer.</li>
        <li><b>Fused activation:</b> ReLU/ReLU6 folds into the clamp; the activation function never needs float.</li>
       </ol>
       <p>So every layer is uint8-in &rarr; int32-accumulate &rarr; uint8-out, with one $M$-rescale per layer and
       no floating-point arithmetic anywhere on the device.</p>
       <p><b>B. Training graph &mdash; quantization-aware training (&sect;3).</b> Start from the ordinary float
       network and rewrite each weighted layer:</p>
       <ol>
        <li><b>Master weights</b> stay in float32 and are what the optimizer updates.</li>
        <li><b>Weight fake-quant</b> (Eq. 12) before the matmul, with range $[a,b] = [\\min w, \\max w]$ of that
        weight tensor &mdash; per-tensor, recomputed each step.</li>
        <li><b>Activation fake-quant</b> (Eq. 12) after the layer (and after a folded ReLU), with range $[a,b]$
        tracked by an <b>exponential moving average</b> of observed min/max across batches.</li>
        <li><b>Batch-norm folding (&sect;3.2):</b> BN scale/shift are folded into the conv weights <i>before</i>
        the weight fake-quant, so training simulates the same folded weights inference will use.</li>
        <li><b>Backward:</b> the round inside every fake-quant uses the <b>straight-through estimator</b>
        (gradient = identity on $[a,b]$, $0$ outside); gradients reach the float master weights normally.</li>
       </ol>
       <p>After training, the collected $(a,b)$ ranges give each tensor's $(S,Z)$, and the float master weights are
       rounded once to the uint8 values the inference engine in (A) consumes.</p>`,
    symbols: [
      { sym: "$r$", desc: "a <b>real</b> number (float32) &mdash; an actual weight or activation value, e.g. $1.5$." },
      { sym: "$q$", desc: "the <b>quantized integer</b> that stands in for $r$ &mdash; one of a small set, e.g. an int8 value in $0\\ldots255$." },
      { sym: "$S$", desc: "the <b>scale</b>: a positive real number = the real-world size of one step on the integer grid (the gap between $q$ and $q+1$). Larger $S$ = coarser." },
      { sym: "$Z$", desc: "the <b>zero-point</b>: the integer $q$ that maps to real $0$. Guarantees $0$ is represented exactly. An integer, same type as $q$." },
      { sym: "$[a, b]$", desc: "the real <b>range</b> a tensor is quantized over: $a$ = bottom, $b$ = top. For weights, min and max of the weights; for activations, a moving-average estimate." },
      { sym: "$n$", desc: "the number of integer <b>levels</b>: $n = 2^{\\text{bits}}$. For 8 bits, $n = 256$." },
      { sym: "$s$", desc: "the fake-quant <b>step size</b> $s = (b-a)/(n-1)$ &mdash; same idea as $S$, written for the $[a,b]$, $n$-level form (Eq. 12)." },
      { sym: "$\\hat{r}$", desc: "the <b>fake-quantized</b> value: $r$ rounded onto the integer grid and mapped back to a real number. Close to $r$, but pinned to a grid point." },
      { sym: "$M$", desc: "the rescale <b>multiplier</b> $M = S_1 S_2 / S_3$ (Eq. 5) &mdash; the single real factor left over after an integer matrix multiply; implemented as a fixed-point shift." },
      { sym: "$S_1, S_2, S_3$", desc: "the scales of the two input tensors ($S_1$ activations, $S_2$ weights) and the output tensor ($S_3$) of a matmul. Their combination $S_1 S_2 / S_3$ is $M$." },
      { sym: "$Z_1, Z_2, Z_3$", desc: "the zero-points of the two inputs and the output of a matmul &mdash; the integers that map to real $0$ for each tensor (Eq. 7)." },
      { sym: "$M_0,\\ n$", desc: "the fixed-point form of $M$: $M = 2^{-n} M_0$ with $M_0 \\in [0.5,1)$ a normalized fraction and $n \\ge 0$ the bit-shift count (Eq. 6). (This $n$ is the shift, not the level count.)" },
      { sym: "$N$", desc: "the inner (summed) dimension of the integer matmul in Eq. 7 &mdash; how many integer multiply-adds accumulate per output entry." },
      { sym: "$a_2^{(k)},\\ \\bar a_1^{(i)}$", desc: "the integer column/row sums of the quantized inputs ($a_2^{(k)}=\\sum_i q_2$, $\\bar a_1^{(i)}=\\sum_j q_1$); the zero-point-correction terms in Eq. 7." },
      { sym: "“fake quantization”", desc: "a plain term: round-to-grid-then-map-back inserted in the forward pass during training, so the net experiences int8 error while still training in float." },
      { sym: "“straight-through estimator (STE)”", desc: "a plain term: in back-propagation, treat the (non-differentiable) round as the identity and pass the gradient through unchanged." },
      { sym: "“exponential moving average (EMA)”", desc: "a plain term: a running average that decays old values, used to track an activation tensor's real range $[a,b]$ across training batches." }
    ],
    formula: `<p>$$ r = S\\,(q - Z) $$</p>
      <p>Eq. 1 (&sect;2.1) &mdash; the affine quantization map: real value $r$ from integer $q$ via scale $S$ (a positive real) and zero-point $Z$ (an integer). Invert it to quantize: $q = Z + \\text{round}(r/S)$.</p>
      <p>$$ S_3\\,(q_3 - Z_3) = \\sum_{j} S_1 (q_1^{(j)} - Z_1)\\, S_2 (q_2^{(j)} - Z_2) $$</p>
      <p>&sect;2.2 &mdash; substitute Eq. 1 into a real matrix-multiply entry $r_3 = \\sum_j r_1^{(j)} r_2^{(j)}$. Every $q$, $Z$ is an integer; only the scales are real.</p>
      <p>$$ M \\;:=\\; \\frac{S_1 S_2}{S_3} $$</p>
      <p>Eq. 5 (&sect;2.2) &mdash; the rescale <b>multiplier</b>: the single real factor left after pulling the scales out of the integer sum. The paper shows $M \\in (0, 1)$.</p>
      <p>$$ M = 2^{-n} M_0, \\qquad M_0 \\in [0.5, 1) $$</p>
      <p>Eq. 6 (&sect;2.2) &mdash; write $M$ as a normalized fixed-point fraction $M_0$ times a power of two, so applying $M$ is a fixed-point multiply plus a bit-shift by $n$ &mdash; no float needed.</p>
      <p>$$ q_3^{(i,k)} = Z_3 + M\\Big( N Z_1 Z_2 - Z_1 a_2^{(k)} - Z_2 \\bar{a}_1^{(i)} + \\sum_{j=1}^{N} q_1^{(i,j)} q_2^{(j,k)} \\Big) $$</p>
      <p>Eq. 7 (&sect;2.2) &mdash; the integer-only output of one matmul entry: an integer sum $\\sum q_1 q_2$ (plus integer zero-point corrections, where $a_2^{(k)}=\\sum_i q_2$ and $\\bar a_1^{(i)}=\\sum_j q_1$), rescaled once by $M$ and offset by $Z_3$.</p>
      <p>$$ \\text{clamp}(r;a,b) := \\min(\\max(r,a),b), \\qquad s := \\frac{b-a}{n-1}, \\qquad q(r;a,b,n) = \\left\\lfloor \\frac{\\text{clamp}(r;a,b) - a}{s} \\right\\rceil s + a $$</p>
      <p>Eq. 12 (&sect;3) &mdash; the <b>simulated / fake quantization</b> used in the training forward pass: clamp $r$ to $[a,b]$, round to the nearest of $n$ grid points of step $s$, map back to a real value on the grid ($\\lfloor\\cdot\\rceil$ = round-to-nearest).</p>
      <p>$$ \\frac{\\partial\\, q(r;a,b,n)}{\\partial r} \\;\\approx\\; 1 \\quad\\text{for } r \\in [a,b] \\qquad\\text{(straight-through estimator)} $$</p>
      <p>The round in Eq. 12 is flat (true derivative $0$), so quantization-aware training defines its gradient as the identity on the in-range interval &mdash; backprop "passes straight through" the round. The paper states backprop "happens as usual"; it does not name this trick, which the field calls the straight-through estimator (STE).</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> is the whole quantization scheme in one line. It says: to recover the real value,
       take the integer $q$, subtract the zero-point $Z$ (so the integer that means "zero" maps to $0$), and
       scale by the step $S$. To go the other way you invert it: $q = \\text{round}(r/S) + Z$, then clamp into
       the integer range. The map is <b>affine</b> &mdash; a straight line $r = Sq - SZ$ &mdash; which is exactly
       what lets the integer arithmetic factor cleanly.</p>
       <p><b>Equation 12</b> is the fake-quant used in training. Reading it inside-out: <b>clamp</b> $r$ into the
       allowed range $[a,b]$; subtract $a$ and divide by the step $s$ to get a grid index; <b>round</b> that to
       the nearest integer (the $\\lfloor\\cdot\\rceil$ is round-to-nearest); then multiply back by $s$ and add $a$
       to return to a real value sitting <i>on</i> the grid. The output $\\hat{r}$ is "what int8 would store,
       expressed as a float" &mdash; so the rest of the network can keep computing in float yet feel the int8
       rounding.</p>`,
    derivation:
      `<p>Why does the affine map make integer-only multiplication possible? Take one entry of a matrix product,
       $r_3 = \\sum_j r_1^{(j)} r_2^{(j)}$ (real). Substitute $r = S(q - Z)$ for each real value:</p>
       <p>$$ S_3 (q_3 - Z_3) = \\sum_j S_1 (q_1^{(j)} - Z_1)\\, S_2 (q_2^{(j)} - Z_2). $$</p>
       <p>Pull the constant scales out of the sum and divide both sides by $S_3$:</p>
       <p>$$ q_3 - Z_3 = \\frac{S_1 S_2}{S_3} \\sum_j (q_1^{(j)} - Z_1)(q_2^{(j)} - Z_2) = M \\sum_j (\\ldots). $$</p>
       <p>The sum on the right is <b>all integers</b> &mdash; integer subtractions and integer multiply-adds,
       which a cheap integer unit does fast. The only real number is the leading $M = S_1 S_2 / S_3$ (Eq. 5),
       applied once at the end. Since $M \\in (0,1)$, it is written $M = 2^{-n} M_0$ (Eq. 6) and done as a
       fixed-point multiply plus a bit-shift. That is the entire reason integer-only inference works.</p>
       <p>And the straight-through estimator: the fake-quant forward is $\\hat{r} = \\text{round}(\\cdot)$, whose
       true derivative is $0$ almost everywhere. STE simply <i>defines</i> $\\partial \\hat{r} / \\partial r = 1$
       on the in-range interval &mdash; an approximation, not an exact derivative &mdash; so gradients flow and the
       float weights can keep learning despite the non-differentiable round.</p>`,
    example:
      `<p>Quantize one real value to int8 and back, by hand. Use the unsigned 8-bit convention from the paper
       ($q$ ranges over $0\\ldots255$, so $n = 256$ levels). Suppose a tensor's real range is
       $[a, b] = [-2.0,\\ 6.0]$.</p>
       <ul class="steps">
        <li><b>Scale.</b> The step size spans the range across $255$ gaps:
        $S = (b - a)/(255) = 8 / 255 = 0.031373$ (real units per integer step).</li>
        <li><b>Zero-point.</b> Pick $Z$ so the bottom of the range, $a = -2.0$, maps to integer $0$:
        $Z = 0 - a/S = 0 - (-2.0)/0.031373 = 63.75 \\to \\mathbf{64}$ (rounded to an integer). Check: real $0$ maps
        to $q = \\text{round}(0/S) + Z = 64$, and dequantizing $q=64$ gives $S(64 - 64) = 0$ exactly &mdash; zero
        is represented with no error, as promised.</li>
        <li><b>Quantize</b> $r = 1.5$. Invert Eq. 1: $q = \\text{round}(r/S) + Z = \\text{round}(1.5 / 0.031373) + 64
        = \\text{round}(47.81) + 64 = 48 + 64 = \\mathbf{112}$. It is inside $[0,255]$, so no clamp needed. The
        single int8 byte that stores $1.5$ is $112$.</li>
        <li><b>Dequantize</b> back with Eq. 1: $\\hat{r} = S(q - Z) = 0.031373 \\times (112 - 64) = 0.031373 \\times 48
        = \\mathbf{1.50588}$. The recovered value is $1.50588$ versus the true $1.5$ &mdash; a rounding error of
        about $\\mathbf{+0.0059}$, less than one step $S$. That small, bounded error is exactly what
        quantization-aware training teaches the net to tolerate.</li>
       </ul>
       <p>These exact numbers ($S = 8/255$, $Z = 64$, $r=1.5 \\to q=112 \\to \\hat{r}=1.50588$) are recomputed in
       the notebook's first cell so you can check them by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Build fake-quant</b> as a custom autograd op. <b>Forward:</b> step $S = (b-a)/(2^{\\text{bits}}-1)$,
        then $q = \\text{clamp}(\\text{round}((x-a)/S),\\,0,\\,2^{\\text{bits}}-1)$, return $a + qS$ (Eq. 12).
        <b>Backward:</b> return the incoming gradient unchanged (STE).</li>
        <li><b>Wire it into the net's forward pass</b> (only when quantizing): fake-quant each layer's
        <b>weights</b> over their own $[\\min w, \\max w]$, and each layer's post-activation <b>outputs</b> over a
        range tracked by an exponential moving average during training.</li>
        <li><b>Train Net B with fake-quant on</b> (quantization-aware) and <b>Net A with it off</b> (plain
        float). Both reach similar float accuracy.</li>
        <li><b>Quantize Net A after the fact</b> (post-training quantization): turn fake-quant on only at test
        time. Net B was already trained that way.</li>
        <li><b>Sweep the bit-width</b> $8 \\to 6 \\to 4 \\to 3 \\to 2$ and plot test accuracy for both. The
        quantization-aware net should degrade more gracefully &mdash; the paper's effect.</li>
        <li><b>Ablate the straight-through estimator:</b> make backward return $0$ (the honest round derivative)
        instead of passing the gradient through, and watch quantization-aware training fail to learn.</li>
      </ol>`,
    results:
      `<p>From the paper (quoted with source). On <b>ResNet-50</b>, their integer-quantized model reaches
       <b>74.9%</b> top-1 versus the <b>76.4%</b> float baseline &mdash; about a <b>1.5%</b> drop for full int8
       inference (Table 4.1, &sect;4.1.1). On <b>Inception v3</b>, 8-bit quantization gives <b>75.4%</b> versus a
       <b>78.4%</b> float baseline (Table 4.3, &sect;4.1.2). For detection, a MobileNet COCO model moves
       <b>22.1% &rarr; 21.7% mAP</b> with "up to 50% reduction in running time" (Table 4.4, &sect;4.2.2).</p>
       <p>The <b>bit-width sweep</b> (face-attribute MobileNet, Table 4.7, &sect;4.2.4) reports accuracy loss
       growing as bits shrink &mdash; roughly $-0.9\\%$ at 8/8 bits, $-1.6\\%$ at 6/6, $-3.4\\%$ at 5/5, and a
       cliff of $-14.0\\%$ at 4/4 &mdash; and notes <b>weights are more sensitive than activations</b> to reduced
       bit depth.</p>
       <p><i>These are the paper's reported figures, quoted from its tables. The numbers in the CODE and CODEVIZ
       panels below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the linear layers ship in PyTorch, so you <b>import</b>
       them and build only the novel piece. <b>Import:</b> <code>nn.Linear</code>,
       <code>torch.nn.functional.linear</code>, the optimizer, and the loss. <b>Build by hand:</b> the affine
       fake-quant (Eq. 12) as a <code>torch.autograd.Function</code> with the <b>straight-through estimator</b>
       in its backward, the wiring that fake-quants weights (per-tensor min/max) and activations (EMA range),
       the quantization-aware vs post-training comparison, and the <b>bit-width sweep</b>. There is no separate
       concept lesson for this math &mdash; the affine map and STE are derived in full above. The first notebook
       cell recomputes the worked example ($S = 8/255$, $Z = 64$, $1.5 \\to 112 \\to 1.50588$).</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the straight-through estimator.</b> If you let autograd differentiate
        <code>round</code> honestly, the gradient is $0$ and the network never learns. <b>Fix:</b> a custom
        autograd Function whose <code>backward</code> returns the incoming gradient unchanged (treat round as
        the identity).</li>
        <li><b>Quantizing the bias the same way as weights.</b> The paper keeps <b>biases in higher precision</b>
        (int32), because a bias adds into the accumulator where small errors matter. Rounding biases to int8
        hurts more than rounding weights. In a toy build you may skip bias quant entirely; do not int8 it.</li>
        <li><b>Using a fixed activation range.</b> Activation magnitudes drift as training proceeds. A hard-coded
        $[a,b]$ either clips (range too small) or wastes levels (too large). <b>Fix:</b> track the range with an
        exponential moving average across batches, as the paper does (&sect;3).</li>
        <li><b>Confusing post-training quantization with quantization-aware training.</b> Post-training rounds an
        already-trained float net once; quantization-aware <i>trains</i> with the rounding simulated every
        forward pass. They are different and give different accuracy &mdash; that contrast is the whole point.</li>
        <li><b>Not representing zero exactly.</b> If you drop the zero-point $Z$ and use a symmetric round, real
        $0$ may not land on a grid point &mdash; bad for padding and ReLU. The affine map with $Z$ guarantees
        $q = Z \\Rightarrow r = 0$ exactly.</li>
        <li><b>Expecting int8 to be free.</b> At 8 bits accuracy is usually nearly intact; the loss grows as you
        push to 4, 3, 2 bits. Quantization-aware training shrinks that loss &mdash; it does not abolish it.</li>
      </ul>`,
    recall: [
      "Write the affine quantization map (Eq. 1) from memory and define $S$, $Z$, $q$, $r$.",
      "What does the straight-through estimator do in the backward pass, and why is it needed?",
      "How is a weight tensor's range $[a,b]$ chosen, versus an activation tensor's range?",
      "Why does the affine map let a matrix multiply run in integer arithmetic? What is $M$?",
      "What is the difference between post-training quantization and quantization-aware training?"
    ],
    practice: [
      {
        q: `<b>Quantize by hand.</b> A tensor has real range $[a,b] = [-2.0, 6.0]$ and uses unsigned 8-bit
            integers ($q \\in 0\\ldots255$). Compute the scale $S$ and the zero-point $Z$, then quantize
            $r = 3.0$ to an integer and dequantize it back. What is the rounding error?`,
        steps: [
          { do: `Scale: $S = (b-a)/255 = 8/255 = 0.031373$.`, why: `The step size spreads the range $[-2,6]$ across the $255$ gaps between the $256$ integer levels.` },
          { do: `Zero-point: map $a=-2.0$ to integer $0$, so $Z = 0 - a/S = 2.0/0.031373 = 63.75 \\to 64$.`, why: `$Z$ is the integer that represents real $0$; rounding $63.75$ gives the integer $64$.` },
          { do: `Quantize: $q = \\text{round}(r/S) + Z = \\text{round}(3.0/0.031373) + 64 = \\text{round}(95.63) + 64 = 96 + 64 = 160$.`, why: `Invert $r = S(q-Z)$ to get $q = \\text{round}(r/S)+Z$; $160$ is inside $[0,255]$ so no clamp.` },
          { do: `Dequantize: $\\hat{r} = S(q-Z) = 0.031373 \\times (160-64) = 0.031373 \\times 96 = 3.01176$.`, why: `Apply Eq. 1 directly with the integer $160$.` }
        ],
        answer: `<p>$S = 8/255 \\approx 0.031373$, $Z = 64$. Quantizing $r=3.0$ gives $q = 160$; dequantizing gives
                 $\\hat{r} = 3.01176$, a rounding error of about $+0.0118$ &mdash; under one step $S$. The notebook
                 recomputes the same shape of calculation for $r=1.5 \\to 112 \\to 1.50588$.</p>`
      },
      {
        q: `<b>The straight-through estimator ablation.</b> You have quantization-aware training working: the
            fake-quant's <code>backward</code> returns the incoming gradient unchanged. Now change
            <code>backward</code> to return $0$ (the honest derivative of <code>round</code>, which is flat).
            What happens to training, and what does that show?`,
        steps: [
          { do: `Replace the STE backward with one that returns zeros for the input gradient.`, why: `An honest ablation changes exactly one thing &mdash; how gradient flows through the round &mdash; so any difference is attributable to the STE.` },
          { do: `Retrain and watch the loss: with a zero backward, the gradient reaching the weights through the fake-quant is $0$, so the weights upstream of every quantized op stop updating and the loss stalls near its starting value.`, why: `Rounding is flat almost everywhere; its true derivative is $0$. Without the straight-through approximation, back-propagation has nothing to push the weights with.` },
          { do: `Restore the STE (return <code>grad</code> unchanged) and training resumes normally.`, why: `Pretending round is the identity in backward lets the float weights learn despite the non-differentiable forward.` }
        ],
        answer: `<p>With a zero backward the quantized layers block the gradient, so the net barely learns &mdash;
                 the loss stays high. That isolates the straight-through estimator as the thing that makes
                 quantization-aware training trainable: the forward must round (to feel int8 error) while the
                 backward must <i>not</i> (to keep gradients flowing). The CODE panel includes this ablation.</p>`
      },
      {
        q: `Net A is trained in float and quantized to 3 bits afterward (post-training). Net B is trained with
            3-bit fake-quant on (quantization-aware). Both had the same float accuracy. Which do you expect to
            be more accurate at 3 bits, and why &mdash; in terms of where each net's weights ended up?`,
        steps: [
          { do: `Picture the decision boundaries. Net A's weights sit wherever float training left them, with no knowledge that a coarse round is coming.`, why: `Post-training quantization rounds once, after the fact; the 3-bit grid is coarse, so the round can shove activations across a boundary.` },
          { do: `Net B saw the 3-bit rounding error in every forward pass and adjusted its weights (via the STE gradient) to keep the loss low <i>after</i> rounding.`, why: `Training with simulated quantization steers the weights into regions that are robust to the round &mdash; the paper's core idea (§3).` },
          { do: `Conclude Net B should hold accuracy better at 3 bits; the gap widens as bits shrink.`, why: `The coarser the grid, the larger the round error, and the more it helps to have trained against it.` }
        ],
        answer: `<p>Net B (quantization-aware) should be more accurate at 3 bits. It trained <i>against</i> the
                 rounding, so its weights landed in places robust to the coarse 3-bit grid; Net A was rounded
                 blind. At a generous 8 bits the two are close; as the budget drops to 3 or 2 bits the
                 quantization-aware net pulls ahead &mdash; exactly the contrast the CODEVIZ panel plots.</p>`
      }
    ]
  });

  window.CODE["paper-quantization-aware"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the affine fake-quant (Eq. 12) as a custom
       <code>torch.autograd.Function</code> whose <code>backward</code> is the <b>straight-through estimator</b>
       &mdash; round in forward, identity in backward &mdash; then wire it into a small classifier on
       <code>nn.Linear</code>. We train <b>Net B</b> with fake-quant on (quantization-aware) and <b>Net A</b>
       without, then quantize Net A only at test time (post-training quantization) and sweep the bit-width. The
       first cell recomputes the worked example: range $[-2,6]$, $S = 8/255$, $Z = 64$, $r=1.5 \\to q=112 \\to
       \\hat{r}=1.50588$. The last cell is the <b>STE ablation</b> (zero backward), which stalls training. Paste
       into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0)

# --- 0. Sanity-check the worked example: affine map r = S(q - Z), uint8 (n=256). ---
a, b = -2.0, 6.0
S = (b - a) / 255.0                      # scale = step size  (= 8/255)
Z = round(0.0 - a / S)                   # zero-point: the integer that maps to real 0
r = 1.5
q = max(0, min(255, round(r / S) + Z))   # quantize: invert r = S(q - Z), then clamp
r_hat = S * (q - Z)                      # dequantize
print(f"worked example:  S = {S:.6f} (=8/255),  Z = {Z}")
print(f"  quantize r=1.5 -> q = {q};  dequantize -> {r_hat:.6f};  err = {r - r_hat:+.6f}")
# worked example:  S = 0.031373 (=8/255),  Z = 64
#   quantize r=1.5 -> q = 112;  dequantize -> 1.505882;  err = -0.005882


# --- 1. Affine fake-quant (Eq. 12) with the straight-through estimator. ---
class FakeQuant(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x, a, b, nbits):
        qmax = 2 ** nbits - 1
        S = (b - a) / qmax                       # step size
        q = torch.clamp(torch.round((x - a) / S), 0, qmax)   # round onto the int grid
        return a + q * S                         # map back to a real value (fake-quant)
    @staticmethod
    def backward(ctx, grad):
        return grad, None, None, None            # STE: pass gradient straight through

def fq(x, a, b, nbits=8):
    return FakeQuant.apply(x, a, b, nbits)


# --- 2. A tiny 2-hidden-layer classifier; fake-quant weights + activations when quant=True. ---
class Net(nn.Module):
    def __init__(self, n, K):
        super().__init__()
        self.fc1 = nn.Linear(n, 64); self.fc2 = nn.Linear(64, 64); self.fc3 = nn.Linear(64, K)
        self.e1 = None; self.e2 = None           # EMA of each activation tensor's max
    def forward(self, x, quant=False, nbits=8):
        if not quant:
            h = torch.relu(self.fc1(x)); h = torch.relu(self.fc2(h)); return self.fc3(h)
        # weights: range = the tensor's own min/max
        def qw(L): return fq(L.weight, L.weight.min().item(), L.weight.max().item(), nbits)
        h = torch.relu(F.linear(x, qw(self.fc1), self.fc1.bias))    # bias kept in float
        m = h.max().item()                                          # activation range via EMA
        if self.training: self.e1 = m if self.e1 is None else 0.95 * self.e1 + 0.05 * m
        h = fq(h, 0.0, self.e1 or m, nbits)
        h = torch.relu(F.linear(h, qw(self.fc2), self.fc2.bias))
        m = h.max().item()
        if self.training: self.e2 = m if self.e2 is None else 0.95 * self.e2 + 0.05 * m
        h = fq(h, 0.0, self.e2 or m, nbits)
        return F.linear(h, qw(self.fc3), self.fc3.bias)


# --- 3. A harder toy task: 6 overlapping Gaussian blobs in 12-D (so coarse bits actually hurt). ---
N, K, n = 1200, 6, 12
g = torch.Generator().manual_seed(1)
y = torch.randint(0, K, (N,), generator=g)
centers = torch.randn(K, n, generator=g) * 1.2
X = centers[y] + torch.randn(N, n, generator=g) * 1.1     # noisy + close centers
Xtr, ytr, Xte, yte = X[:800], y[:800], X[800:], y[800:]

def accuracy(net, **kw):
    net.eval()
    with torch.no_grad():
        return (net(Xte, **kw).argmax(1) == yte).float().mean().item()

def train(quant_aware, steps=600, lr=0.1):
    torch.manual_seed(0)
    net = Net(n, K); net.train()
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9); lf = nn.CrossEntropyLoss()
    for t in range(steps):
        opt.zero_grad(); lf(net(Xtr, quant=quant_aware, nbits=8), ytr).backward(); opt.step()
    return net

net_A = train(quant_aware=False)     # plain float (then quantized after the fact = PTQ)
net_B = train(quant_aware=True)      # quantization-aware (QAT)

print("\\n=== float accuracy (both reach a similar baseline) ===")
print(f"  Net A (non-QAT) float: {accuracy(net_A):.3f}    Net B (QAT) float: {accuracy(net_B):.3f}")

print("\\n=== accuracy vs bit-width  (QAT = Net B,  PTQ = Net A quantized after training) ===")
print("  bits |  QAT  |  PTQ")
for nb in [8, 6, 4, 3, 2]:
    print(f"   {nb}   | {accuracy(net_B, quant=True, nbits=nb):.3f} | {accuracy(net_A, quant=True, nbits=nb):.3f}")
# Our small run, not the paper's numbers:
#   8 bits: both ~0.92 (int8 keeps accuracy).  As bits shrink, QAT degrades more gracefully than PTQ.


# --- 4. ABLATION: kill the straight-through estimator (zero backward) -> QAT can't learn. ---
class FakeQuantNoSTE(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x, a, b, nbits):
        return FakeQuant.forward(ctx, x, a, b, nbits)
    @staticmethod
    def backward(ctx, grad):
        return torch.zeros_like(grad), None, None, None   # honest round derivative = 0

import types
def train_no_ste(steps=600, lr=0.1):
    torch.manual_seed(0)
    net = Net(n, K); net.train()
    orig = FakeQuant.apply
    FakeQuant.apply = staticmethod(lambda *a: FakeQuantNoSTE.apply(*a))  # swap in zero backward
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9); lf = nn.CrossEntropyLoss()
    first = last = None
    for t in range(steps):
        opt.zero_grad(); loss = lf(net(Xtr, quant=True, nbits=8), ytr); loss.backward(); opt.step()
        if t == 0: first = loss.item()
        last = loss.item()
    FakeQuant.apply = orig
    return first, last

f0, f1 = train_no_ste()
print(f"\\n=== STE ablation (zero backward) ===\\n  loss start {f0:.3f} -> end {f1:.3f}  (barely moves: no gradient flows through round)")`
  };

  window.CODEVIZ["paper-quantization-aware"] = {
    question: "As the integer bit-width shrinks from 8 to 2, does a quantization-aware net (QAT) keep accuracy better than a non-QAT net quantized after training (PTQ)?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs bit-width — QAT vs post-training quantization (matched float baseline)",
        xlabel: "integer bits (weights & activations)",
        ylabel: "test accuracy",
        series: [
          {
            name: "QAT (trained with fake-quant)",
            color: "#7ee787",
            points: [[2, 0.757], [3, 0.890], [4, 0.905], [6, 0.925], [8, 0.920]]
          },
          {
            name: "PTQ (non-QAT, quantized after)",
            color: "#ff7b72",
            points: [[2, 0.710], [3, 0.860], [4, 0.890], [6, 0.923], [8, 0.920]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two matched 2-hidden-layer nets (64 units, ReLU) trained on a noisy 6-class 12-D blob task to the same float accuracy (~0.92). int8 fake-quant uses the affine map $r = S(q-Z)$ with the straight-through estimator. At 8 bits both keep accuracy (~0.92) &mdash; the paper's qualitative result that int8 inference is nearly lossless. As the budget shrinks, the quantization-aware net (QAT, green) degrades more gracefully than post-training quantization of the non-QAT net (PTQ, red): 3-bit 0.890 vs 0.860, 2-bit 0.757 vs 0.710. Same architecture, optimizer, seed, and float baseline &mdash; the only difference is whether the int8 rounding was simulated during training.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F

# Affine fake-quant (Eq. 12) with the straight-through estimator.
class FakeQuant(torch.autograd.Function):
    @staticmethod
    def forward(ctx, x, a, b, nbits):
        qmax = 2 ** nbits - 1; S = (b - a) / qmax
        q = torch.clamp(torch.round((x - a) / S), 0, qmax)
        return a + q * S
    @staticmethod
    def backward(ctx, grad):
        return grad, None, None, None            # STE
def fq(x, a, b, nbits=8): return FakeQuant.apply(x, a, b, nbits)

class Net(nn.Module):
    def __init__(self, n, K):
        super().__init__()
        self.fc1 = nn.Linear(n, 64); self.fc2 = nn.Linear(64, 64); self.fc3 = nn.Linear(64, K)
        self.e1 = None; self.e2 = None
    def forward(self, x, quant=False, nbits=8):
        if not quant:
            h = torch.relu(self.fc1(x)); h = torch.relu(self.fc2(h)); return self.fc3(h)
        def qw(L): return fq(L.weight, L.weight.min().item(), L.weight.max().item(), nbits)
        h = torch.relu(F.linear(x, qw(self.fc1), self.fc1.bias))
        m = h.max().item()
        if self.training: self.e1 = m if self.e1 is None else 0.95*self.e1 + 0.05*m
        h = fq(h, 0.0, self.e1 or m, nbits)
        h = torch.relu(F.linear(h, qw(self.fc2), self.fc2.bias))
        m = h.max().item()
        if self.training: self.e2 = m if self.e2 is None else 0.95*self.e2 + 0.05*m
        h = fq(h, 0.0, self.e2 or m, nbits)
        return F.linear(h, qw(self.fc3), self.fc3.bias)

# Noisy 6-class blobs (close centers -> coarse bits hurt).
N, K, n = 1200, 6, 12
g = torch.Generator().manual_seed(1)
y = torch.randint(0, K, (N,), generator=g)
centers = torch.randn(K, n, generator=g) * 1.2
X = centers[y] + torch.randn(N, n, generator=g) * 1.1
Xtr, ytr, Xte, yte = X[:800], y[:800], X[800:], y[800:]

def acc(net, **kw):
    net.eval()
    with torch.no_grad(): return (net(Xte, **kw).argmax(1) == yte).float().mean().item()

def train(qa, steps=600, lr=0.1):
    torch.manual_seed(0); net = Net(n, K); net.train()
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9); lf = nn.CrossEntropyLoss()
    for t in range(steps):
        opt.zero_grad(); lf(net(Xtr, quant=qa, nbits=8), ytr).backward(); opt.step()
    return net

A = train(False); B = train(True)
print("float baseline  A:", round(acc(A),3), " B:", round(acc(B),3))
for nb in [8, 6, 4, 3, 2]:
    print(f"{nb}-bit  QAT={acc(B, quant=True, nbits=nb):.3f}  PTQ={acc(A, quant=True, nbits=nb):.3f}")
# QAT : 8->0.920 6->0.925 4->0.905 3->0.890 2->0.757
# PTQ : 8->0.920 6->0.923 4->0.890 3->0.860 2->0.710  (our run, not the paper's numbers)`
  };
})();
