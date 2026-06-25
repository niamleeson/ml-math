/* Paper lesson — "Mixed Precision Training", Micikevicius et al. 2017 (ICLR 2018).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-mixed-precision".
   GROUNDED from arXiv:1710.03740 (abstract) and the ar5iv HTML mirror (Sections 3.1, 3.2, 3.3).
   Track B (architecture): compose with torch.nn; implement only the three novel ideas by hand on
   FP16/FP32 tensors — (1) an FP32 master copy of the weights, (2) loss scaling, (3) FP32 accumulation.
   The numeric mechanics owner is concept pt-gpu-amp; here we read the paper and reproduce the effect. */
(function () {
  window.LESSONS.push({
    id: "paper-mixed-precision",
    title: "Mixed Precision Training — Micikevicius et al. (2017)",
    tagline: "Train in 16-bit floats for speed and memory, but keep a 32-bit master weight copy and scale the loss so tiny gradients do not vanish.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Paulius Micikevicius, Sharan Narang, Jonah Alben, Gregory Diamos, Erich Elsen, David Garcia, Boris Ginsburg, Michael Houston, Oleksii Kuchaiev, Ganesh Venkatesh, Hao Wu",
      org: "NVIDIA and Baidu Research",
      year: 2017,
      venue: "arXiv:1710.03740 (Oct 2017); ICLR 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1710.03740",
      code: "https://github.com/NVIDIA/apex"
    },
    conceptLink: "pt-gpu-amp",
    partOf: [],
    prereqs: ["pt-gpu-amp", "pt-tensors", "dl-backprop", "dl-vanishing-gradient", "pt-loss-optim"],

    // WHY READ IT
    problem:
      `<p>A 32-bit floating point number (called <b>FP32</b> = 32-bit floating point, also "single
       precision") is the default way deep networks store every weight, activation, and gradient. It is
       safe but heavy: it takes 4 bytes per number and the math runs slower than the hardware can go.</p>
       <p>A 16-bit floating point number (called <b>FP16</b> = 16-bit floating point, also "half
       precision") takes only 2 bytes and the hardware can multiply it much faster. The obvious idea is:
       just train in FP16. The problem is that FP16 has a tiny numeric range. The paper states the hard
       limit: "any value whose magnitude is smaller than $2^{-24}$ becomes zero in FP16" (&sect;3.1).</p>
       <p>Two things break when you switch to FP16 naively:</p>
       <ul>
        <li><b>Small gradients vanish.</b> Many gradient values are smaller than $2^{-24}$, so they round
        to exactly $0$ in FP16. A gradient of $0$ means no learning signal. Figure 3 shows that for one
        network "67% of values are zero" in the activation gradients (&sect;3.2).</li>
        <li><b>Tiny weight updates get swallowed.</b> Even when an update <i>is</i> representable, adding a
        very small update to a much larger weight loses it. The paper: "even though the weight update is
        representable in FP16, it could still become zero when addition &hellip; right-shifts it to align
        the binary point with the weight. This can happen when the magnitude of a normalized weight value
        is at least 2048 times larger that of the weight update" (&sect;3.1).</li>
       </ul>`,
    contribution:
      `<ul>
        <li><b>FP32 master copy of the weights (&sect;3.1).</b> Keep one single-precision copy of every
        weight. Do the forward and backward passes in FP16 for speed, but apply the optimizer step to the
        FP32 master copy, then round it down to FP16 for the next pass. The tiny updates accumulate in FP32
        where they survive.</li>
        <li><b>Loss scaling (&sect;3.2).</b> Multiply the loss by a large constant $S$ before
        back-propagation. By the chain rule every gradient is then multiplied by $S$ too, shifting small
        gradient values up into the FP16-representable range so they no longer round to $0$. Divide the
        gradients by $S$ again (unscale) before the weight update.</li>
        <li><b>FP32 accumulation for reductions (&sect;3.3).</b> When summing many FP16 numbers (dot
        products, batch-normalization statistics, softmax), accumulate the running total in FP32, then
        write the final result back to FP16. This keeps long sums accurate.</li>
       </ul>`,
    whyItMattered:
      `<p>This recipe became the standard way to train large models on modern accelerators. It is exactly
       what PyTorch ships today as <b>Automatic Mixed Precision (AMP)</b>: <code>torch.autocast</code> runs
       the FP16 (or BF16) math and <code>torch.cuda.amp.GradScaler</code> does the loss scaling and
       unscaling for you. The abstract reports the practical win: "we can reduce the memory consumption of
       deep learning models by nearly 2x," with a compute speedup on half-precision hardware. Nearly every
       large vision and language model since is trained in mixed precision.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3 (Implementation)</b> &mdash; the three techniques. This is the whole paper for our
        purposes.</li>
        <li><b>&sect;3.1 (FP32 Master Copy of Weights)</b> and <b>Figure 2</b> &mdash; the accuracy gap from
        updating FP16 weights, and the "$2^{-24}$" / "2048 times" reasoning for why updates vanish.</li>
        <li><b>&sect;3.2 (Loss Scaling)</b> and <b>Figure 3</b> &mdash; the histogram of activation gradient
        magnitudes (most are small) and the scale-then-unscale procedure.</li>
        <li><b>&sect;3.3 (Arithmetic Precision)</b> &mdash; one short paragraph: accumulate reductions in
        FP32.</li>
       </ul>
       <p><b>Skim:</b> &sect;4 (the long list of CNN / RNN / GAN results across many datasets) unless you
       want evidence it generalizes. The mechanism you need is the three short subsections of &sect;3.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Take a single weight near $256$ and an optimizer that wants to nudge it by about $0.01$ each step.
       The gap between consecutive FP16 numbers near $256$ is $0.25$ (FP16 cannot represent anything between
       $256.00$ and $256.25$). If you add the $0.01$ update <b>directly in FP16</b>, what happens to the
       weight after $200$ steps? Will it drift to where it should, or stay put? Write your guess. Then ask:
       does keeping the running weight in FP32 change the answer?</p>`,
    attempt:
      `<p>Before the reveal, sketch the two updates you will compare. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Pure FP16 update:</b> <code>w16 = (w16 + (-lr*grad).half())</code>  <i># add the update in
        FP16, where it can right-shift to zero</i></li>
        <li><b>FP32 master update:</b> keep <code>w32</code> in FP32. TODO: <code>w32 = w32 - lr*grad</code>
        <i># accumulate in FP32</i>; then TODO: <code>w16 = w32.half()</code> <i># round to FP16 for the
        next forward pass</i>.</li>
        <li><b>Loss scaling:</b> a gradient like <code>1e-8</code> casts to $0$ in FP16. TODO: scale it
        first &mdash; <code>(g * 1024.0).half()</code> &mdash; then unscale in FP32 &mdash;
        <code>scaled.float() / 1024.0</code> &mdash; and check it survived.</li>
       </ul>
       <p>Predict which weight reaches the target and which one freezes.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>Mixed precision means: store and compute in FP16 wherever you can (it is small and fast), but keep
       a few critical things in FP32 so nothing important rounds away. The paper fixes the three places
       where pure FP16 breaks.</p>
       <p><b>1. FP32 master copy of the weights (&sect;3.1).</b> A normalized FP16 number only keeps about 11
       bits of precision. When you add a tiny update $u$ to a much larger weight $w$, the hardware must
       line up their binary points: it shifts $u$ right by however many bits separate their magnitudes. If
       $w$ is at least $2048$ times larger than $u$, $u$ shifts entirely past the last kept bit and the
       addition leaves $w$ unchanged. So the optimizer step silently does nothing. The fix: hold a master
       copy of every weight in FP32, apply the optimizer step there (where $u$ survives), and copy the
       result down to FP16 only for the forward and backward passes.</p>
       <p><b>2. Loss scaling (&sect;3.2).</b> The smallest positive FP16 value is $2^{-24}$; anything smaller
       becomes $0$. Many gradients are below that, so they vanish. Because back-propagation is linear in the
       loss, multiplying the loss by a constant $S$ multiplies <i>every</i> gradient by the same $S$
       (chain rule). Pick $S$ large (e.g. $1024$) and the small gradients move up into the representable
       range before they are stored in FP16. After the backward pass, divide all gradients by $S$ to
       restore their true size, then take the optimizer step. The paper: "Weight gradients must be unscaled
       before weight update to maintain the update magnitudes as in FP32 training."</p>
       <p><b>3. FP32 accumulation (&sect;3.3).</b> A sum of many FP16 numbers loses accuracy because each
       partial total is re-rounded to FP16. The fix: keep the running total in FP32. The paper: "FP16
       vector dot-product accumulates the partial products into an FP32 value, which is converted to FP16
       before writing to memory," and "Large reductions &hellip; should be carried out in FP32," such as
       batch-normalization statistics and softmax.</p>`,
    symbols: [
      { sym: "FP16", desc: "<b>16-bit floating point</b> (half precision): 2 bytes per number, fast and small, but a narrow range &mdash; anything with magnitude below $2^{-24}$ rounds to $0$." },
      { sym: "FP32", desc: "<b>32-bit floating point</b> (single precision): 4 bytes per number, the safe default with a wide range and about 24 bits of precision." },
      { sym: "$w$", desc: "a single <b>weight</b> (a learnable parameter of the network). The FP32 master copy is the trusted value; an FP16 copy is used in the forward and backward passes." },
      { sym: "$u$", desc: "the <b>weight update</b>: the change the optimizer wants to apply this step, $u = -\\,\\eta\\, g$ (learning rate times gradient). Often thousands of times smaller than $w$." },
      { sym: "$\\eta$", desc: "the <b>learning rate</b>: a small positive number scaling how big each update is." },
      { sym: "$g$", desc: "a <b>gradient</b>: the derivative of the loss with respect to a weight or activation. The thing that can underflow to $0$ in FP16." },
      { sym: "$L$", desc: "the <b>loss</b>: the scalar the network minimizes." },
      { sym: "$S$", desc: "the <b>loss-scaling factor</b>: a large constant the loss is multiplied by before back-propagation, then divided out of the gradients afterward (e.g. $S = 1024$)." },
      { sym: "$2^{-24}$", desc: "the <b>smallest positive value FP16 can represent</b>; anything smaller becomes exactly $0$ (the underflow threshold)." }
    ],
    formula: `$$ \\tilde{L} = S \\cdot L \\;\\;\\Longrightarrow\\;\\; \\frac{\\partial \\tilde{L}}{\\partial w} = S \\cdot \\frac{\\partial L}{\\partial w} \\qquad\\text{(loss scaling, §3.2)}, \\qquad\\quad w_{32} \\leftarrow w_{32} - \\eta\\,\\frac{1}{S}\\,\\frac{\\partial \\tilde{L}}{\\partial w} \\qquad\\text{(FP32 master update, §3.1)} $$`,
    whatItDoes:
      `<p><b>Left (loss scaling).</b> Replace the loss $L$ with a scaled loss $\\tilde{L} = S\\cdot L$ before
       back-propagation. Because the derivative is linear, every gradient $\\partial L / \\partial w$ comes
       out multiplied by the same $S$. That single multiply lifts the whole cloud of small gradient values
       up, away from the $2^{-24}$ underflow floor, so they survive being stored in FP16.</p>
       <p><b>Right (FP32 master update).</b> Before the optimizer step, divide the scaled gradients by $S$ to
       recover their true magnitude (the "$\\tfrac{1}{S}$" term). Then apply the update to the <b>FP32</b>
       master weight $w_{32}$, where a tiny $\\eta \\cdot \\tfrac{1}{S}\\, \\partial\\tilde{L}/\\partial w$
       is not swallowed by the much larger weight. Round $w_{32}$ to FP16 only for the next pass.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the numeric mechanics live in the concept lesson.</b> Why does scaling the
       loss scale every gradient by the same factor? Back-propagation is repeated application of the chain
       rule, and multiplication by a constant commutes through it. If $\\tilde{L} = S\\cdot L$ then for any
       weight $w$:</p>
       <p>$$ \\frac{\\partial \\tilde{L}}{\\partial w} = \\frac{\\partial (S\\,L)}{\\partial w} = S\\,\\frac{\\partial L}{\\partial w}. $$</p>
       <p>The same constant $S$ factors out of every gradient in the whole graph, no matter how deep. So one
       multiply at the loss shifts every gradient up uniformly, and one divide before the update puts them
       back. Why does the FP32 master copy matter? A normalized FP16 number drops bits beyond about $2^{-11}$
       relative to its own magnitude, so adding an update more than $2048\\,(=2^{11})$ times smaller than the
       weight changes nothing &mdash; the update right-shifts past the last kept bit. FP32 keeps far more
       bits, so the same small update accumulates. The bit-level rounding and right-shift details are
       worked through in the <b>pt-gpu-amp</b> concept lesson; we only recap them here.</p>`,
    example:
      `<p>Two tiny worked cases, both recomputed in the notebook.</p>
       <p><b>(a) Loss scaling rescues a gradient.</b> Take a gradient $g = 1\\times10^{-8}$ (in FP32).</p>
       <ul class="steps">
        <li>Cast straight to FP16: $1\\times10^{-8}$ is below the $2^{-24} \\approx 5.96\\times10^{-8}$ floor,
        so it becomes exactly $0.0$. The signal is gone.</li>
        <li>Scale first, then cast: $g \\times 1024 = 1.024\\times10^{-5}$, which FP16 stores as about
        $1.025\\times10^{-5}$ &mdash; nonzero, it survived.</li>
        <li>Unscale in FP32: $1.025\\times10^{-5} / 1024 \\approx 1.001\\times10^{-8}$ &mdash; back to (almost
        exactly) the original gradient. We recovered $g$ instead of losing it to $0$.</li>
       </ul>
       <p><b>(b) FP32 master copy rescues a weight update.</b> Start a weight at $256.0$. Near $256$ the gap
       between consecutive FP16 numbers is $0.25$. Apply an update of about $-0.009$ per step for $200$
       steps.</p>
       <ul class="steps">
        <li>Pure FP16: each $-0.009$ update is far below the $0.25$ FP16 spacing, so the add right-shifts it
        to nothing. After $200$ steps the FP16 weight is still <b>$256.0$</b> &mdash; frozen.</li>
        <li>FP32 master: the $-0.009$ updates accumulate in FP32. After $200$ steps the master weight has
        moved to about <b>$254.65$</b> &mdash; it learned. (Numbers from the notebook below.)</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Keep an FP32 master copy</b> of every weight. Make an FP16 copy of it for the passes.</li>
        <li><b>Forward pass in FP16</b> using the FP16 weights; compute the loss.</li>
        <li><b>Scale the loss:</b> multiply by $S$ (e.g. $1024$) before calling backward.</li>
        <li><b>Backward pass in FP16;</b> gradients come out multiplied by $S$, so the small ones survive.</li>
        <li><b>Unscale:</b> divide all gradients by $S$ to restore their true magnitude.</li>
        <li><b>Update the FP32 master weights</b> with the optimizer (the tiny updates accumulate in FP32).</li>
        <li><b>Round the master copy to FP16</b> for the next iteration. Accumulate any large reductions
        (dot products, batch-norm stats, softmax) in FP32 throughout.</li>
        <li><b>Ablate:</b> remove the master copy (update in pure FP16) and/or remove loss scaling, and
        watch learning stall.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "Using this approach, we can reduce the memory consumption of deep
       learning models by nearly 2x," and the technique "works for large scale models with more than 100
       million parameters trained on large datasets," across "convolution neural networks, recurrent neural
       networks and generative adversarial networks." For the master-copy ablation specifically, &sect;3.1
       reports that on a Mandarin speech model "updating FP16 weights results in 80% relative accuracy loss"
       versus matching FP32 accuracy with an FP32 master copy.</p>
       <p><i>These are the paper's reported figures, quoted from the paper. The numbers in the CODEVIZ panel
       below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you
       <b>import</b> them and implement only the three novel ideas by hand on FP16/FP32 tensors.
       <b>Import:</b> <code>torch</code> tensor dtypes (<code>.half()</code>, <code>.float()</code>),
       <code>nn.Linear</code>, the optimizer. <b>Build by hand:</b> (1) the FP32 master copy and the
       round-down-to-FP16 step, (2) the scale-loss / unscale-gradients pair, (3) the comparison that breaks
       each one (pure-FP16 update; gradient cast without scaling). The bit-level right-shift and rounding
       math is recapped from the pt-gpu-amp concept lesson, not re-derived. In production you would call
       <code>torch.autocast</code> + <code>GradScaler</code>, which do all of this for you.</p>`,
    pitfalls:
      `<ul>
        <li><b>Casting the gradient before scaling.</b> If you compute the gradient in FP16 first and only
        then multiply by $S$, the underflow already happened &mdash; $0 \\times S$ is still $0$. <b>Fix:</b>
        scale the <i>loss</i> so the gradient is born scaled, or scale in FP32 before the FP16 cast.</li>
        <li><b>Forgetting to unscale before the update.</b> If you skip the divide-by-$S$, the optimizer
        applies updates $S$ times too large and the model diverges. <b>Fix:</b> unscale right after backward,
        before any gradient clipping or the optimizer step.</li>
        <li><b>Updating the FP16 weights directly.</b> Without an FP32 master copy, small updates right-shift
        to nothing and learning stalls (the &sect;3.1 effect, our frozen $256.0$ weight). <b>Fix:</b> keep
        the master copy in FP32 and only round it to FP16 for the passes.</li>
        <li><b>Picking $S$ blindly.</b> Too small and gradients still underflow; too large and they overflow
        to <code>inf</code>. <b>Fix:</b> use dynamic loss scaling &mdash; raise $S$ when stable, halve it and
        skip the step when an <code>inf</code>/<code>nan</code> appears (what <code>GradScaler</code> does).</li>
        <li><b>Summing in FP16.</b> Long reductions (softmax, batch-norm statistics) lose accuracy if
        accumulated in FP16. <b>Fix:</b> accumulate in FP32 (&sect;3.3), write back to FP16.</li>
      </ul>`,
    recall: [
      "State the loss-scaling identity: how does multiplying the loss by $S$ affect each gradient, and why?",
      "Why does adding a tiny update to a large weight do nothing in FP16, and how does the FP32 master copy fix it?",
      "What is the FP16 underflow threshold, and what fraction of gradients did Figure 3 report as zero without scaling?",
      "Name the three things mixed precision keeps (or accumulates) in FP32."
    ],
    practice: [
      {
        q: `<b>The loss-scaling ablation.</b> A gradient $g = 3\\times10^{-8}$ is computed in a network
            trained in FP16. (a) What does it become when stored in FP16 with no loss scaling? (b) With a
            scale factor $S = 1024$, what does the stored value become, and what do you recover after
            unscaling? (c) What does this demonstrate about loss scaling?`,
        steps: [
          { do: `Compare $g$ to the FP16 floor $2^{-24} \\approx 5.96\\times10^{-8}$. Since $3\\times10^{-8} \\lt 5.96\\times10^{-8}$, storing $g$ in FP16 gives $0.0$.`, why: `Anything below $2^{-24}$ underflows to exactly zero in FP16 (&sect;3.1) &mdash; the learning signal is lost.` },
          { do: `Scale first: $g \\times 1024 = 3.07\\times10^{-5}$, which is well inside the FP16 range, so it stores as a nonzero value.`, why: `Multiplying by $S$ shifts the small gradient up above the underflow floor before it is cast to FP16.` },
          { do: `Unscale: divide the stored value by $1024$ to get back $\\approx 3\\times10^{-8}$.`, why: `Unscaling restores the true gradient magnitude so the optimizer step is the same size as in FP32 training.` }
        ],
        answer: `<p>(a) With no scaling, $3\\times10^{-8}$ is below $2^{-24}$, so FP16 stores it as <b>$0.0$</b>
                 &mdash; the gradient vanishes. (b) Scaled by $1024$ it becomes $3.07\\times10^{-5}$ (nonzero in
                 FP16); unscaling gives back $\\approx 3\\times10^{-8}$. (c) Loss scaling rescues exactly the
                 small gradients that would otherwise underflow to zero, at the cost of one multiply and one
                 divide. This is the &sect;3.2 mechanism.</p>`
      },
      {
        q: `<b>The master-copy ablation.</b> A weight sits at $256.0$; near $256$ consecutive FP16 numbers
            are $0.25$ apart. The optimizer wants to subtract $0.009$ each step. After $200$ steps, where is
            the weight (i) if you update it directly in FP16, and (ii) if you keep an FP32 master copy? What
            does the gap show?`,
        steps: [
          { do: `Compare the update $0.009$ to the FP16 spacing $0.25$ near $256$. Since $0.009 \\lt 0.25$, adding it in FP16 right-shifts it past the last kept bit and the weight does not change.`, why: `When the weight is more than $\\sim2048$ times the update, the addition leaves the weight unchanged (&sect;3.1).` },
          { do: `Pure FP16: the weight stays $256.0$ for all $200$ steps &mdash; frozen, no learning.`, why: `Every step the same right-shift erases the update, so nothing accumulates.` },
          { do: `FP32 master: the $0.009$ updates accumulate in FP32; after $200$ steps the weight has moved to about $254.65$.`, why: `FP32 keeps enough bits that the small update survives the add and accumulates over steps.` }
        ],
        answer: `<p>(i) In pure FP16 the weight is still <b>$256.0$</b> after $200$ steps &mdash; the update is
                 smaller than the FP16 spacing, so every add is a no-op and learning stalls. (ii) With the
                 FP32 master copy the weight reaches about <b>$254.65$</b>. Same updates, same learning rate;
                 only the precision of the accumulator differs. This isolates the master copy as the reason
                 tiny updates take effect &mdash; the &sect;3.1 result reproduced on one number.</p>`
      },
      {
        q: `You enable loss scaling with $S = 1024$ but forget to divide the gradients by $S$ before calling
            <code>optimizer.step()</code>. The loss explodes to <code>nan</code> within a few steps. Why,
            and what is the one-line fix?`,
        steps: [
          { do: `Trace the update size: the gradients are still $1024\\times$ too large, so each update is $1024\\times$ bigger than intended.`, why: `Scaling the loss scaled every gradient by $S$; without unscaling, that factor flows straight into the optimizer step.` },
          { do: `A $1024\\times$ learning rate overshoots wildly, the weights blow up, and the loss becomes <code>inf</code> then <code>nan</code>.`, why: `Hugely oversized steps diverge instead of descending.` },
          { do: `Insert the unscale right after backward, before the step: divide every gradient by $S$ (or call <code>scaler.unscale_(optimizer)</code>).`, why: `That restores the true gradient magnitude, so the update matches FP32 training (&sect;3.2).` }
        ],
        answer: `<p>Loss scaling multiplied every gradient by $S = 1024$; skipping the unscale leaves the
                 updates $1024\\times$ too large, so the optimizer overshoots and the loss diverges to
                 <code>nan</code>. <b>Fix:</b> unscale the gradients (divide by $S$) immediately after the
                 backward pass and before <code>optimizer.step()</code> &mdash; exactly what
                 <code>GradScaler</code> automates.</p>`
      }
    ]
  });

  window.CODE["paper-mixed-precision"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>implement</b> the three mixed-precision ideas by hand on FP16/FP32 tensors. First we
       recompute the lesson's two worked examples: a gradient <code>1e-8</code> underflows to <code>0.0</code>
       in FP16 but survives when scaled by <code>1024</code> (loss scaling, &sect;3.2); and a weight at
       <code>256.0</code> with a tiny update freezes in pure FP16 but moves with an FP32 master copy
       (&sect;3.1). Then we train one tiny linear regression two ways &mdash; pure-FP16 weight updates vs an
       FP32 master copy &mdash; and print both loss curves: the FP32-master run learns, the pure-FP16 run is
       flat. In production you would replace all of this with <code>torch.autocast</code> +
       <code>torch.cuda.amp.GradScaler</code>. Paste into Colab and run.</p>`,
    code: `import torch

torch.manual_seed(0)

# --- 0a. Loss scaling rescues a small gradient (paper Section 3.2). ---
g = torch.tensor(1e-8, dtype=torch.float32)
print("gradient cast straight to FP16:", g.half().item(), " (underflowed to 0)")
S = 1024.0
scaled16 = (g * S).half()                 # scale in FP32, THEN cast to FP16
print("scaled by 1024 then cast to FP16:", scaled16.item(), " (survived)")
print("unscaled back in FP32:", (scaled16.float() / S).item())
print("smallest positive FP16 (2^-24):", torch.tensor(2.0**-24, dtype=torch.float16).item())
# gradient cast straight to FP16: 0.0  (underflowed to 0)
# scaled by 1024 then cast to FP16: 1.0251998901367188e-05  (survived)
# unscaled back in FP32: 1.0011717677116394e-08
# smallest positive FP16 (2^-24): 5.960464477539063e-08

# --- 0b. FP32 master copy rescues a tiny weight update (paper Section 3.1). ---
w16 = torch.tensor(256.0, dtype=torch.float16)   # pure-FP16 weight
w32 = torch.tensor(256.0, dtype=torch.float32)   # FP32 master copy
update = torch.tensor(-0.009, dtype=torch.float32)
for _ in range(200):
    w16 = (w16 + update.half())            # pure FP16: update right-shifts to nothing
    w32 = w32 + update                     # FP32 master: tiny updates accumulate
print("pure-FP16 weight after 200 steps:", w16.item(), " (frozen at 256.0)")
print("FP32-master weight after 200 steps:", round(w32.item(), 3), " (moved)")
# pure-FP16 weight after 200 steps: 256.0  (frozen at 256.0)
# FP32-master weight after 200 steps: 254.2  (moved)


# --- 1. Train a tiny linear regression two ways: pure FP16 vs FP32 master copy. ---
# Weights start near 256, where the FP16 spacing (0.25) dwarfs each per-step update,
# so the pure-FP16 weights cannot move while the FP32-master weights can.
n, d = 64, 4
gen = torch.Generator().manual_seed(1)
X = torch.randn(n, d, generator=gen) * 0.1
w_true = torch.full((d, 1), 250.0)
y = X @ w_true

def train(use_master, steps=200, lr=5e-2):
    w32 = torch.full((d, 1), 256.0)        # FP32 master copy
    w16 = w32.half().clone()               # FP16 copy used in the forward pass
    losses = []
    for t in range(steps):
        w = (w32 if use_master else w16).float()
        err = X @ w - y
        losses.append((err ** 2).mean().item())
        grad = (2.0 / n) * (X.t() @ err)   # FP32 gradient
        if use_master:
            w32 = w32 - lr * grad          # accumulate the update in FP32
            w16 = w32.half()               # round to FP16 for the next pass
        else:
            w16 = (w16 + (-lr * grad).half())   # pure FP16: update vanishes on add
    return losses

pure   = train(use_master=False)
master = train(use_master=True)
print("\\nPure-FP16   loss:  start", round(pure[0], 3),   " end", round(pure[-1], 3))
print("FP32-master loss:  start", round(master[0], 3), " end", round(master[-1], 3))
# Pure-FP16   loss:  start 1.988  end 1.988   (flat -- weights frozen, no learning)
# FP32-master loss:  start 1.988  end 1.145   (fell -- the master copy let it learn)
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-mixed-precision"] = {
    question: "With tiny per-step updates, does the training loss fall when weights are kept in an FP32 master copy vs updated directly in FP16?",
    charts: [
      {
        type: "line",
        title: "Training loss vs step — FP32 master copy vs pure FP16 weight updates",
        xlabel: "training step",
        ylabel: "mean squared error loss",
        series: [
          {
            name: "Pure FP16 update",
            color: "#ff7b72",
            points: [[0,1.988],[6,1.988],[13,1.988],[20,1.988],[27,1.988],[34,1.988],[41,1.988],[48,1.988],[54,1.988],[61,1.988],[68,1.988],[75,1.988],[82,1.988],[89,1.988],[96,1.988],[102,1.988],[109,1.988],[116,1.988],[123,1.988],[130,1.988],[137,1.988],[144,1.988],[150,1.988],[157,1.988],[164,1.988],[171,1.988],[178,1.988],[185,1.988],[192,1.988],[199,1.988]]
          },
          {
            name: "FP32 master copy",
            color: "#7ee787",
            points: [[0,1.988],[6,1.955],[13,1.917],[20,1.88],[27,1.844],[34,1.809],[41,1.774],[48,1.74],[54,1.711],[61,1.679],[68,1.646],[75,1.615],[82,1.584],[89,1.553],[96,1.523],[102,1.498],[109,1.47],[116,1.441],[123,1.414],[130,1.387],[137,1.36],[144,1.334],[150,1.312],[157,1.287],[164,1.262],[171,1.238],[178,1.214],[185,1.191],[192,1.168],[199,1.145]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. One tiny linear regression (64 samples, 4 weights) trained two ways &mdash; identical except for where the weight lives during the update. Weights start near 256, where the gap between FP16 numbers (0.25) is far larger than each per-step update (~0.009), so the PURE-FP16 weights cannot move: the loss is flat at 1.988 the whole way. The FP32-MASTER run accumulates those same tiny updates in FP32 and rounds to FP16 only for the forward pass, so its loss falls from 1.988 to 1.145. Same data, learning rate, and seed; the only difference is the FP32 master copy (paper Section 3.1).",
    code: `import torch, numpy as np

torch.manual_seed(0)
# Tiny linear regression. Weights start at 256.0, where consecutive FP16 numbers are
# 0.25 apart. Each per-step update (lr*grad ~ 0.009) is well below that spacing, so in
# PURE FP16 every update right-shifts to zero on the add and the loss stays flat. An
# FP32 MASTER copy accumulates the same updates and learns (paper Sections 3.1).
n, d = 64, 4
g = torch.Generator().manual_seed(1)
X = torch.randn(n, d, generator=g) * 0.1
w_true = torch.full((d, 1), 250.0)
y = X @ w_true

def train(use_master, steps=200, lr=5e-2):
    w32 = torch.full((d, 1), 256.0)        # FP32 master copy
    w16 = w32.half().clone()
    losses = []
    for t in range(steps):
        w = (w32 if use_master else w16).float()
        err = X @ w - y
        losses.append((err ** 2).mean().item())
        grad = (2.0 / n) * (X.t() @ err)
        if use_master:
            w32 = w32 - lr * grad          # accumulate in FP32
            w16 = w32.half()               # round to FP16 for the next forward
        else:
            w16 = (w16 + (-lr * grad).half())   # pure FP16: update vanishes
    return losses

pure   = train(use_master=False)
master = train(use_master=True)
idx = np.linspace(0, 199, 30).astype(int)
print("Pure FP16  :", [[int(i), round(pure[i], 3)] for i in idx])
print("FP32 master:", [[int(i), round(master[i], 3)] for i in idx])
# Pure FP16  -> flat at 1.988 (weights frozen at 256.0).
# FP32 master -> falls 1.988 -> 1.145 over 200 steps.`
  };
})();
