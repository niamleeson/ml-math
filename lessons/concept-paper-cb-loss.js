/* Paper lesson — "Class-Balanced Loss Based on Effective Number of Samples"
   (Cui, Jia, Lin, Song, Belongie; CVPR 2019; arXiv:1901.05555).
   The "effective number" E_n = (1-beta^n)/(1-beta) reweights ANY loss (CE, sigmoid,
   focal) for long-tailed data; CB focal = the class-balanced version of focal loss.
   Track B (architecture): implement the effective-number weights + class-balanced
   focal loss in torch; show the weight schedule head->tail; train a long-tailed
   classifier with CE vs CB-focal; ablate beta. Builds directly on paper-retinanet. */
(function () {
  window.LESSONS.push({
    id: "paper-cb-loss",
    title: "CB Loss — Class-Balanced Loss from the Effective Number of Samples (2019)",
    tagline: "Reweight any loss by 1/(effective number of samples) per class, so a long tail of rare classes stops being ignored — without the instability of raw inverse-frequency weighting.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Yin Cui, Menglin Jia, Tsung-Yi Lin, Yang Song, Serge Belongie",
      org: "Cornell University & Cornell Tech; Google",
      year: 2019,
      venue: "arXiv:1901.05555 (Jan 2019); CVPR 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1901.05555",
      code: "https://github.com/richardaecn/class-balanced-loss"
    },
    conceptLink: "dl-cross-entropy",
    partOf: [],
    prereqs: ["paper-retinanet", "dl-cross-entropy", "ml-classification-metrics", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>Real-world datasets are <b>long-tailed</b>: a few "head" classes have thousands of examples and a long
       "tail" of classes have only a handful each (think species photos, medical findings, product categories).
       Train ordinary <b>cross entropy</b> on this and the head classes dominate every batch, so the model learns
       to do well on common classes and quietly gives up on rare ones &mdash; overall accuracy can look fine while
       tail accuracy is near zero.</p>
       <blockquote>"The number of training samples per class usually decreases from one class to another...
       models trained with such data perform poorly on weakly represented classes." (paraphrasing &sect;1)</blockquote>
       <p>The old fix is <b>re-weighting</b>: scale each class's loss by something that counters its frequency. The
       two textbook choices are weighting by the <b>inverse class frequency</b> $1/n_y$ (give a class with $n_y$
       samples that much more pull) or its softer cousin $1/\\sqrt{n_y}$. But on the extreme tail, $1/n_y$
       <b>over-weights</b> the rarest classes &mdash; a class with 5 examples gets 1000&times; the pull of a class
       with 5000, so a few noisy or unlucky tail samples can dominate and destabilize training (&sect;1, &sect;5).
       What weight is actually justified by $n_y$ samples?</p>`,
    contribution:
      `<ul>
        <li><b>A new way to count data: the "effective number" of samples.</b> Adding the 1000th photo of a class
        tells you far less than the 2nd did &mdash; samples overlap. The paper models the data of a class as
        covering a region, and shows the expected covered volume after $n$ samples is
        $E_n=(1-\\beta^{n})/(1-\\beta)$ with $\\beta=(N-1)/N$ (&sect;3, Eqn 2). It saturates: past a point, more
        raw samples barely add new <i>effective</i> samples.</li>
        <li><b>One re-weighting rule that interpolates between the two classics.</b> Weight each class by
        $1/E_{n_y}=\\frac{1-\\beta}{1-\\beta^{n_y}}$ (&sect;4). The single hyper-parameter $\\beta$ slides smoothly
        from <b>no re-weighting</b> ($\\beta=0$, weight $=1$ for all) to <b>inverse-frequency</b>
        ($\\beta\\to1$, weight $\\to1/n_y$). In between, head classes <b>saturate</b> to a shared floor instead of
        being crushed &mdash; the stability that raw $1/n_y$ lacks.</li>
        <li><b>It is a drop-in term for ANY loss.</b> Multiply the per-example loss by the class weight and you get
        class-balanced softmax CE, class-balanced sigmoid CE, or &mdash; the headline &mdash; <b>class-balanced
        focal loss</b> (&sect;4, Eqn 6), which combines this per-<i>class</i> reweighting with focal loss's
        per-<i>example</i> down-weighting (see <code>paper-retinanet</code>).</li>
      </ul>`,
    whyItMattered:
      `<p>CB Loss became a standard baseline for <b>long-tailed recognition</b>: one line, no architecture change,
       no resampling pipeline. It cleanly separated two different imbalances &mdash; <b>between</b> classes (fixed
       by the effective-number weight) and <b>within</b> a class between easy and hard examples (fixed by focal
       loss) &mdash; and showed they compose. The "effective number" idea (diminishing returns of more data) also
       reframed how people think about dataset size per class, feeding later work on long-tailed learning,
       decoupled representation/classifier training, and logit adjustment.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b> &sect;3 "Effective Number of Samples" &mdash; the random-covering argument and the
       short induction that gives $E_n=(1-\\beta^{n})/(1-\\beta)$ (Eqn 2). Then &sect;4 "Class-Balanced Loss" for the
       weight $\\frac{1-\\beta}{1-\\beta^{n_y}}$ and the three instantiations (softmax, sigmoid, <b>focal</b>, Eqn 6).
       <b>Figure 2</b> plots the weight vs class index for several $\\beta$ &mdash; the whole intuition in one
       picture, which you will reproduce.</p>
       <p><b>Skim:</b> &sect;5 experiments &mdash; note the headline (effective-number weighting beats both
       no-weighting and inverse-frequency on long-tailed CIFAR, iNaturalist, and ImageNet-LT) and that $\\beta$ is
       tuned per dataset, typically $\\{0.99, 0.999, 0.9999\\}$. <b>Skip</b> the per-benchmark tables on a first pass.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have a 5-class set with sample counts $[5000, 1000, 200, 50, 10]$. Inverse-frequency weighting gives
       the rarest class $5000/10=500\\times$ the weight of the largest. Do you expect that to help or hurt, and why?
       Now imagine a knob $\\beta$ that, turned to 0, weights every class equally, and turned toward 1, approaches
       that $1/n_y$ scheme. Where in between do you think the head classes stop mattering individually?</p>`,
    attempt:
      `<p>Before the reveal, implement the effective-number weights from a list of per-class counts:</p>
       <ul>
        <li>For counts <code>n = [n_1, ..., n_C]</code> and a chosen $\\beta$, compute
        $E_{n_y}=(1-\\beta^{n_y})/(1-\\beta)$ and the raw weight $w_y=1/E_{n_y}$. <i>// TODO</i></li>
        <li>Normalize the weights so they sum to $C$ (the paper's convention, so the overall loss scale is
        comparable to unweighted). <i>// TODO</i></li>
        <li><b>Sanity check first:</b> with $\\beta=0$ every weight must come out equal (no re-weighting). As
        $\\beta\\to1$, the weights must approach $1/n_y$ (normalized). If not, the $\\beta^{n}$ bookkeeping is
        wrong. <i>// TODO</i></li>
       </ul>
       <p>Then wrap it around focal loss: multiply each example's focal loss by its class weight $w_y$.</p>`,

    // HOW IT WORKS
    walkthrough:
      `<p>Step 1 &mdash; <b>why not just count samples?</b> Picture each class's data as covering a region of some
       "feature volume" $N$. The first sample covers fresh ground. The second probably overlaps the first a little.
       By the thousandth, almost everything it covers is already covered. So the <i>useful</i> (non-redundant)
       information grows with $n$ but <b>saturates</b> &mdash; it is not linear in the raw count.</p>
       <p>Step 2 &mdash; <b>quantify the coverage.</b> Model it as random covering: drop samples one at a time; each
       new sample covers a unit of volume, but with probability $p=1/N$ it lands on already-covered ground and adds
       nothing new. Let $E_n$ be the expected covered volume after $n$ samples. Then $E_1=1$ and each new sample
       adds, on average, the fraction still uncovered: $E_n = 1 + \\frac{N-1}{N}E_{n-1} = 1 + \\beta E_{n-1}$ with
       $\\beta=(N-1)/N$. Unrolling that geometric recurrence gives $E_n = 1+\\beta+\\dots+\\beta^{n-1} =
       \\frac{1-\\beta^{n}}{1-\\beta}$ (&sect;3). This is the <b>effective number of samples</b>.</p>
       <p>Step 3 &mdash; <b>turn it into a class weight.</b> A class with $n_y$ raw samples is really worth
       $E_{n_y}$ effective ones, so weight its loss by $1/E_{n_y}=\\frac{1-\\beta}{1-\\beta^{n_y}}$ (&sect;4). Read
       the two limits: as $\\beta\\to0$, $E_n\\to1$ for all $n$ (every class weighted the same &mdash; no
       re-weighting); as $\\beta\\to1$, $E_n\\to n$ (weight $\\to1/n_y$ &mdash; inverse frequency). $\\beta$ is a
       single dial between the two classic schemes, and it is set from the dataset's volume $N$, which you tune.</p>
       <p>Step 4 &mdash; <b>attach it to a loss.</b> The class-balanced loss is just
       $w_y\\cdot\\mathcal{L}(\\text{prediction},y)$ for whatever base loss $\\mathcal{L}$ you use. With focal loss
       as the base you get <b>class-balanced focal loss</b> (Eqn 6) &mdash; the per-class weight handles the
       between-class imbalance (head vs tail) while focal's $(1-p_t)^{\\gamma}$ still handles the within-class
       easy/hard imbalance. The two are orthogonal and stack.</p>`,
    architecture:
      `<p>There is <b>no new network</b> &mdash; CB Loss changes only the loss layer, so it drops into any
       classifier (a CNN backbone + a linear head producing $C$ logits). Component by component:</p>
       <ul>
        <li><b>A precomputed weight vector</b> $\\mathbf{w}\\in\\mathbb{R}^{C}$. Once, before training, count the
        samples per class $n_1,\\dots,n_C$, compute $w_y=\\frac{1-\\beta}{1-\\beta^{n_y}}$, and normalize so
        $\\sum_y w_y = C$. This vector is fixed for the run.</li>
        <li><b>The base per-example loss.</b> Forward pass &rarr; logits $\\mathbf{z}$ &rarr; the chosen loss:
        softmax CE, sigmoid CE, or focal loss. For focal, $p_i^t$ is the predicted probability of the true class
        and the per-example loss carries the $(1-p_i^t)^{\\gamma}$ modulating factor.</li>
        <li><b>The class-balanced multiply.</b> Each example's loss is scaled by $w_y$ for its label $y$ (a gather
        from $\\mathbf{w}$), then averaged over the batch. That single multiply is the entire method.</li>
        <li><b>Backward pass:</b> gradients flow as usual; the weight $w_y$ is a constant per example, so it simply
        rescales that example's gradient &mdash; rare-class examples push harder, head-class examples push less.</li>
       </ul>`,
    symbols: [
      { sym: "$n_y$", desc: "number of <b>training samples</b> in class $y$ (the raw count)." },
      { sym: "$C$", desc: "number of classes." },
      { sym: "$N$", desc: "hypothetical total <b>volume</b> of all possible data for a class; sets $\\beta=(N-1)/N$. Tuned, not measured." },
      { sym: "$\\beta$", desc: "the re-weighting dial $=(N-1)/N\\in[0,1)$. $0$ = no re-weighting; $\\to1$ = inverse-frequency. Typical: 0.99, 0.999, 0.9999." },
      { sym: "$E_{n}$", desc: "<b>effective number of samples</b> $=(1-\\beta^{n})/(1-\\beta)$ — the saturating, non-redundant count." },
      { sym: "$w_y$", desc: "class weight $=1/E_{n_y}=\\frac{1-\\beta}{1-\\beta^{n_y}}$ (then normalized so $\\sum_y w_y=C$)." },
      { sym: "$\\gamma$", desc: "focal-loss focusing parameter (from <code>paper-retinanet</code>); $\\gamma=0$ makes the base loss plain cross entropy." },
      { sym: "$p_i^t$", desc: "model's predicted probability of the <b>true</b> class for example $i$." }
    ],
    formula:
      `$$ E_{n} \\;=\\; \\frac{1-\\beta^{\\,n}}{1-\\beta}, \\qquad \\beta=\\frac{N-1}{N}. $$
       <p class="cap">Effective number of samples (&sect;3, Eqn 2): a saturating count, ceiling $1/(1-\\beta)$.</p>
       $$ w_y \\;=\\; \\frac{1}{E_{n_y}} \\;=\\; \\frac{1-\\beta}{\\,1-\\beta^{\\,n_y}\\,}. $$
       <p class="cap">Class-balanced weight (&sect;4): how hard class $y$ should push. Normalize so $\\sum_y w_y=C$.</p>
       $$ \\mathrm{CB}_{\\text{focal}}(\\mathbf{z},y) \\;=\\; -\\,\\frac{1-\\beta}{1-\\beta^{\\,n_y}}\\;\\sum_{i=1}^{C} (1-p_i^{t})^{\\gamma}\\,\\log\\!\\big(p_i^{t}\\big). $$
       <p class="cap">Class-balanced focal loss (&sect;4, Eqn 6): the per-class weight times focal loss.</p>
       $$ \\lim_{\\beta\\to0} w_y = 1 \\;\\;(\\text{no re-weighting}), \\qquad \\lim_{\\beta\\to1} w_y \\propto \\frac{1}{n_y} \\;\\;(\\text{inverse frequency}). $$
       <p class="cap">The two limits: $\\beta$ interpolates between the two classic schemes.</p>`,
    whatItDoes:
      `<p>The first equation says "effective samples saturate": with $\\beta=0.99$ the ceiling is $1/(1-0.99)=100$,
       so a class with 5000 raw samples and one with 500 are <b>both</b> worth about 100 effective samples &mdash;
       so they get nearly the same weight. The second equation turns that into a per-class multiplier. The third
       multiplies it onto focal loss, so the loss is simultaneously balanced across classes (head vs tail) and
       across examples (easy vs hard). The limits show why this is a strict generalization: pick $\\beta$ and you
       recover "do nothing" or "inverse frequency" as special cases, plus everything in between.</p>`,
    derivation:
      `<p>The only thing to derive is $E_n$. Define $E_n$ as the expected covered volume after $n$ samples, with
       total volume $N$ and each sample covering one unit. The first sample covers fresh volume: $E_1=1$. Given the
       previous $n-1$ samples cover $E_{n-1}$, a new sample lands on <i>uncovered</i> ground with probability
       $1-\\frac{E_{n-1}}{N}$ and on covered ground otherwise &mdash; but the paper uses the simpler expectation
       $E_n = 1 + \\frac{N-1}{N}E_{n-1}$, i.e. each sample adds, on average, the fraction $\\beta=(N-1)/N$ of a new
       unit beyond the first. That recurrence is geometric:</p>
       $$ E_n = 1 + \\beta E_{n-1} = 1 + \\beta + \\beta^2 + \\dots + \\beta^{\\,n-1} = \\frac{1-\\beta^{\\,n}}{1-\\beta}. $$
       <p>Sanity-check the limits directly from this closed form: $\\beta\\to0$ gives $E_n\\to1$ (every extra sample
       is pure redundancy), and $\\beta\\to1$ gives $E_n\\to n$ (no redundancy &mdash; raw count). Both match the
       weight limits above.</p>`,
    example:
      `<p>First, watch the <b>effective number saturate</b>. Take a tiny class with $\\beta=0.9$ (ceiling
       $1/(1-0.9)=10$) and compute $E_n=(1-\\beta^n)/(1-\\beta)=1+0.9+0.9^2+\\dots$ term by term:</p>
       <ul class="steps">
        <li>$E_1 = 1$.</li>
        <li>$E_2 = 1 + 0.9 = 1.90$ &mdash; the 2nd sample added $0.90$.</li>
        <li>$E_3 = 1 + 0.9 + 0.81 = 2.71$ &mdash; the 3rd added only $2.71-1.90 = 0.81$.</li>
       </ul>
       <table class="extable">
        <caption>Each new sample adds less effective coverage ($\\beta=0.9$): diminishing returns.</caption>
        <thead><tr><th>sample $n$</th><th class="num">$E_n$</th><th class="num">added ($E_n-E_{n-1}$)</th></tr></thead>
        <tbody>
         <tr><td class="row-h">1</td><td class="num">1.00</td><td class="num">1.00</td></tr>
         <tr><td class="row-h">2</td><td class="num">1.90</td><td class="num">0.90</td></tr>
         <tr><td class="row-h">3</td><td class="num">2.71</td><td class="num">0.81</td></tr>
        </tbody>
       </table>
       <p>Now a 5-class long tail with counts $[5000,1000,200,50,10]$ and $\\beta=0.99$ (ceiling $100$). Compute
       $w_y=1/E_{n_y}$ and normalize so $\\sum_y w_y = C = 5$, and compare against inverse-frequency
       ($w_y \\propto 1/n_y$, also normalized to sum $5$):</p>
       <table class="extable">
        <caption>CB ($\\beta=0.99$) caps the head to a shared floor; inverse-frequency starves it.</caption>
        <thead><tr><th>count $n_y$</th><th class="num">no re-weight</th><th class="num">CB $\\beta=0.99$</th><th class="num">inverse-freq</th></tr></thead>
        <tbody>
         <tr><td class="row-h">5000 (head)</td><td class="num">1.00</td><td class="num">0.31</td><td class="num">0.008</td></tr>
         <tr><td class="row-h">1000</td><td class="num">1.00</td><td class="num">0.31</td><td class="num">0.040</td></tr>
         <tr><td class="row-h">200</td><td class="num">1.00</td><td class="num">0.36</td><td class="num">0.198</td></tr>
         <tr><td class="row-h">50</td><td class="num">1.00</td><td class="num">0.78</td><td class="num">0.792</td></tr>
         <tr><td class="row-h">10 (tail)</td><td class="num">1.00</td><td class="num">3.24</td><td class="num">3.96</td></tr>
        </tbody>
       </table>
       <p>The two <b>head</b> classes (5000 and 1000) get the <i>same</i> CB weight $0.31$ — both saturated the
       $\\beta=0.99$ ceiling — while the rarest gets $3.24$. Inverse-frequency instead hands the rarest an even
       bigger share and gives the head almost nothing ($0.008$). CB sits between "treat all classes equally" and
       "inverse frequency," capping the head rather than starving it.</p>`,
    recipe:
      `<ol>
        <li>Count samples per class on the <b>training</b> split: $n_1,\\dots,n_C$.</li>
        <li>Pick $\\beta$ (start at $0.999$; tune in $\\{0.99,0.999,0.9999\\}$). Compute
        $w_y=\\frac{1-\\beta}{1-\\beta^{n_y}}$ and normalize so $\\sum_y w_y=C$.</li>
        <li>Choose a base loss. For the headline method use <b>focal loss</b> ($\\gamma=2$ or tuned;
        $\\gamma=0$ = class-balanced cross entropy).</li>
        <li>Per batch: compute the base per-example loss, multiply each by its class weight $w_{y}$ (gather from
        $\\mathbf{w}$), average.</li>
        <li>Train as usual. Evaluate with <b>per-class / balanced</b> metrics, not overall accuracy (see Evaluate).</li>
       </ol>`,
    results:
      `<p>On long-tailed benchmarks &mdash; CIFAR-10/100-LT, iNaturalist 2017/2018, and ImageNet-LT &mdash; the
       class-balanced term improved every base loss it was added to, and <b>class-balanced focal loss</b> was the
       strongest, beating both plain training and inverse-frequency re-weighting (&sect;5). The gains are largest
       when the imbalance is most extreme, and $\\beta$ is tuned per dataset (the paper uses values in
       $\\{0.99, 0.999, 0.9999\\}$). The paper's framing &mdash; "a class-balanced term that can be applied to any
       loss" &mdash; is the lasting result; the precise per-benchmark numbers are in &sect;5's tables.</p>`,
    evaluation:
      `<p><b>Metric &amp; benchmark.</b> Long-tail performance is hidden by overall accuracy (the head dominates),
       so measure <b>per-class recall</b> and especially <b>tail-class / balanced accuracy</b> (mean of per-class
       accuracies) on a <i>balanced</i> test set. Baselines: plain cross entropy (the floor for the tail) and
       inverse-frequency weighting (the scheme CB should match or beat with less instability).</p>
       <ul>
        <li><b>Sanity checks before training.</b> (1) With $\\beta=0$ your normalized weights must all equal 1
        (no re-weighting) — assert it. (2) As $\\beta\\to1$ the normalized weights must approach $1/n_y$
        (normalized) — assert it on a toy count vector. (3) With $\\gamma=0$, class-balanced focal must equal
        class-balanced cross entropy exactly. (4) Effective number must satisfy $E_1=1$ and stay below the ceiling
        $1/(1-\\beta)$.</li>
        <li><b>Expected range.</b> On a long-tailed toy set, CB-focal should lift <b>tail-class recall</b> well
        above plain CE (which often sits near 0 on the rarest classes) while keeping head accuracy roughly intact;
        overall accuracy may move little or even dip slightly — that trade is the point. The paper reports the
        consistent ordering CE $&lt;$ inverse-freq $\\le$ CB $\\le$ CB-focal on its benchmarks; reproduce the
        <i>ordering</i>, not its exact APs.</li>
        <li><b>Ablation.</b> Sweep $\\beta\\in\\{0, 0.9, 0.99, 0.999, 0.9999\\}$: tail accuracy should rise then,
        as $\\beta\\to1$, can wobble or drop as the rarest classes get over-weighted (the instability CB exists to
        temper). Also ablate the class weight off entirely ($w_y\\equiv1$) to confirm it is doing the work.</li>
        <li><b>Failure signals.</b> Tail recall unchanged from CE &rArr; weights not actually applied (forgot the
        gather/normalize, or $\\beta=0$). Head accuracy collapses &rArr; $\\beta$ too close to 1, rare classes
        over-weighted. NaN loss &rArr; $1-\\beta^{n_y}$ underflow for huge $n_y$ (use a numerically safe form) or
        $\\log(0)$ in focal (clamp $p_t$). Overall accuracy up but balanced accuracy flat &rArr; you are measuring
        the wrong thing — switch to per-class metrics.</li>
       </ul>`,
    implementBoundary:
      `<p><b>Build from scratch</b> (it is tiny and the whole point): the effective-number weights
       $\\frac{1-\\beta}{1-\\beta^{n_y}}$ and the multiply onto your base loss. Implement
       class-balanced focal loss directly so you see the per-class and per-example factors side by side.</p>
       <p><b>Import</b> the base pieces: <code>torch.nn.functional.cross_entropy</code> /
       <code>binary_cross_entropy_with_logits</code> and your model/backbone. In production, libraries expose a
       <code>weight=</code> argument on the CE losses &mdash; passing your normalized effective-number vector there
       gives class-balanced cross entropy for free; focal you still wrap yourself.</p>`,
    pitfalls:
      `<ul>
        <li><b>Counting on the wrong split.</b> $n_y$ must be the <b>training</b> counts. Using a balanced
        val/test set to compute weights defeats the purpose.</li>
        <li><b>Treating $\\beta$ as fixed.</b> $\\beta$ encodes the assumed data volume $N$; it must be tuned. Too
        low and you barely re-weight; too high and you reproduce inverse-frequency's tail over-weighting.</li>
        <li><b>Forgetting to normalize.</b> Un-normalized $w_y$ changes the overall loss scale, which interacts
        with the learning rate. Normalize so $\\sum_y w_y=C$ (or to mean 1).</li>
        <li><b>Judging by overall accuracy.</b> The head can mask everything. Always report per-class / balanced
        accuracy, or the tail gains are invisible.</li>
        <li><b>$1-\\beta^{n_y}$ underflow.</b> For very large $n_y$ and $\\beta$ near 1, $\\beta^{n_y}$ can underflow
        to 0 (fine) but intermediate forms can lose precision; compute in float64 or use the stable
        <code>expm1</code>/<code>log1p</code> route.</li>
       </ul>`,
    recall: [
      `Write the effective number $E_n$ in terms of $\\beta$ and $n$, and state its ceiling.`,
      `What two classic re-weighting schemes do $\\beta\\to0$ and $\\beta\\to1$ recover?`,
      `Why does class-balanced focal loss handle <i>two</i> different imbalances? Name them.`,
      `On a long-tailed problem, which metric should you watch instead of overall accuracy, and why?`
    ],
    practice: [
      {
        q: `With $\\beta=0.99$, compute the effective number $E_n$ for a class with $n=100$ samples, and its ceiling.`,
        steps: [
          { do: `Ceiling is $1/(1-\\beta)=1/0.01=100$.`, why: `As $n\\to\\infty$, $\\beta^n\\to0$ so $E_n\\to 1/(1-\\beta)$.` },
          { do: `$E_{100}=(1-0.99^{100})/0.01$. Since $0.99^{100}\\approx0.366$, $E_{100}\\approx(1-0.366)/0.01=63.4$.`, why: `$0.99^{100}=e^{100\\ln 0.99}=e^{-1.005}\\approx0.366$.` }
        ],
        answer: `$E_{100}\\approx 63.4$ effective samples, ceiling $100$ — already most of the way to saturation, so a class with 100 samples is treated almost like a much larger one.`
      },
      {
        q: `Counts are $[5000,1000,200,50,10]$. Explain why, at $\\beta=0.99$, the two largest classes end up with the SAME weight, but under inverse-frequency they do not.`,
        steps: [
          { do: `At $\\beta=0.99$ the effective-number ceiling is 100; both $n=5000$ and $n=1000$ give $E_n\\approx100$ (both far past saturation).`, why: `$0.99^{1000}$ and $0.99^{5000}$ are both essentially 0, so $E_n\\approx1/(1-\\beta)=100$ for each.` },
          { do: `So $w=1/E$ is the same for both; inverse-frequency uses $1/n$, which is $1/5000$ vs $1/1000$ — a $5\\times$ difference.`, why: `Effective number saturates; raw count does not.` }
        ],
        answer: `CB saturates the head to a shared floor (here ~0.31 after normalizing), so 5000 and 1000 look equally "covered"; inverse-frequency keeps a $5\\times$ gap because it never saturates. That saturation is exactly the stability CB adds over $1/n$.`
      },
      {
        q: `ABLATION. You set $\\beta=0.9999$ on a set whose rarest class has 5 samples and the data is noisy. What failure do you expect, and why?`,
        steps: [
          { do: `At $\\beta=0.9999$, $E_5=(1-0.9999^5)/0.0001\\approx(1-0.9995)/0.0001\\approx5.0$, so $w\\approx1/5$ — essentially inverse-frequency.`, why: `Large $\\beta$ pushes $E_n\\to n$, recovering $1/n_y$.` },
          { do: `That rarest class now pulls ~$1000\\times$ harder than a 5000-sample head class.`, why: `$w_{\\text{tail}}/w_{\\text{head}} \\approx (1/5)/(1/5000)=1000$.` }
        ],
        answer: `Near-inverse-frequency over-weighting: a handful of noisy tail examples dominate the gradient, so head accuracy can collapse and training gets unstable — the exact regime CB is meant to avoid by choosing a smaller $\\beta$ so the head saturates instead.`
      }
    ]
  });

  window.CODE["paper-cb-loss"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the effective-number weights and class-balanced focal loss from scratch, verify the two limits ` +
      `(beta=0 -> no re-weighting; beta->1 -> inverse frequency) and that gamma=0 reduces CB-focal to CB ` +
      `cross entropy, show the weight schedule head->tail, then train a long-tailed classifier with plain CE ` +
      `vs CB-focal and compare tail-class recall + balanced accuracy. All printed numbers are our small run, ` +
      `not the paper's reported numbers.`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F

# ============================================================
# 1. Effective-number class weights (Eqn 2 + Sec 4 of arXiv:1901.05555).
#    E_n = (1 - beta^n)/(1 - beta);  w_y = 1/E_{n_y}, normalized to sum C.
# ============================================================
def cb_weights(counts, beta, num_classes=None, normalize=True):
    counts = torch.tensor(counts, dtype=torch.float64)
    eff_num = (1.0 - torch.pow(beta, counts)) / (1.0 - beta) if beta > 0 else torch.ones_like(counts)
    w = 1.0 / eff_num
    if normalize:
        C = num_classes or len(counts)
        w = w * C / w.sum()
    return w

counts = [5000, 1000, 200, 50, 10]
for b in [0.0, 0.9, 0.99, 0.999, 0.9999]:
    w = cb_weights(counts, b)
    print(f"beta={b:<7}: weights={[round(x,3) for x in w.tolist()]}")
# beta=0.0    : weights=[1.0, 1.0, 1.0, 1.0, 1.0]            <- no re-weighting
# beta=0.99   : weights=[0.31, 0.31, 0.358, 0.784, 3.239]   <- head SATURATES to a shared floor
# beta=0.9999 : weights=[0.01, 0.041, 0.2, 0.793, 3.956]    <- approaches inverse-frequency

# ---- Sanity: the two limits ----
inv_freq = cb_weights(counts, 1 - 1e-12)                     # beta -> 1
manual   = torch.tensor([1.0/n for n in counts], dtype=torch.float64)
manual   = manual * len(counts) / manual.sum()
print("beta->1 == inverse-frequency:", torch.allclose(inv_freq, manual, atol=1e-4))  # True
print("beta=0  all-equal           :", torch.allclose(cb_weights(counts, 0.0),
                                                       torch.ones(len(counts), dtype=torch.float64)))  # True

# ============================================================
# 2. Class-balanced focal loss (Eqn 6). gamma=0 -> class-balanced cross entropy.
# ============================================================
def cb_focal_loss(logits, targets, counts, beta=0.999, gamma=2.0):
    w = cb_weights(counts, beta, logits.shape[1]).to(logits.dtype)   # (C,)
    logp = F.log_softmax(logits, dim=1)                              # (B,C)
    pt   = logp.gather(1, targets[:, None]).squeeze(1).exp()         # prob of true class
    ce   = -logp.gather(1, targets[:, None]).squeeze(1)             # per-example CE
    focal = (1 - pt) ** gamma * ce                                   # focal (paper-retinanet)
    return (w[targets] * focal).mean()                              # class-balanced multiply

# ---- Sanity: gamma=0 CB-focal == weight-applied cross entropy ----
torch.manual_seed(0)
z = torch.randn(32, 5); y = torch.randint(0, 5, (32,))
a = cb_focal_loss(z, y, counts, beta=0.999, gamma=0.0)
w = cb_weights(counts, 0.999, 5).float()
b = (w[y] * F.cross_entropy(z, y, reduction="none")).mean()
print("CB-focal(gamma=0) == CB cross entropy:", torch.allclose(a, b, atol=1e-6))  # True

# ============================================================
# 3. Train a long-tailed 5-class classifier: plain CE vs CB-focal.
#    Counts [400,200,80,30,10]; balanced test set -> read TAIL recall.
# ============================================================
g = torch.Generator().manual_seed(1)
centers = torch.tensor([[2.,2.],[ -2.,2.],[2.,-2.],[-2.,-2.],[0.,0.]])
tr_counts = [400, 200, 80, 30, 10]
Xtr = torch.cat([centers[c] + 1.4*torch.randn(n,2,generator=g) for c,n in enumerate(tr_counts)])
ytr = torch.cat([torch.full((n,), c) for c,n in enumerate(tr_counts)])
Xte = torch.cat([centers[c] + 1.4*torch.randn(60,2,generator=g) for c in range(5)])   # balanced test
yte = torch.cat([torch.full((60,), c) for c in range(5)])

def train(kind, beta=0.999, gamma=2.0, steps=600):
    torch.manual_seed(0)
    net = nn.Sequential(nn.Linear(2,32), nn.ReLU(), nn.Linear(32,5))
    opt = torch.optim.Adam(net.parameters(), lr=0.03)
    for _ in range(steps):
        opt.zero_grad()
        logits = net(Xtr)
        loss = (F.cross_entropy(logits, ytr) if kind=="ce"
                else cb_focal_loss(logits, ytr, tr_counts, beta=beta, gamma=gamma))
        loss.backward(); opt.step()
    with torch.no_grad():
        pred = net(Xte).argmax(1)
        per_class = [ (pred[yte==c]==c).float().mean().item() for c in range(5) ]
    return per_class

ce  = train("ce")
cb  = train("cbf")
print("per-class recall  CE     :", [round(x,2) for x in ce])
print("per-class recall  CB-focal:", [round(x,2) for x in cb])
print("balanced acc  CE / CB-focal:", round(sum(ce)/5,3), "/", round(sum(cb)/5,3))
# CE      : tail (rarest) recall is low; head is high.
# CB-focal: tail recall rises, balanced accuracy improves.
# Our small run, not the paper's reported numbers.

# ============================================================
# 4. Ablation over beta (gamma fixed) -> balanced accuracy.
# ============================================================
for b in [0.0, 0.9, 0.99, 0.999, 0.9999]:
    pc = train("cbf", beta=b)
    print(f"beta={b:<7}: balanced_acc={round(sum(pc)/5,3)}  tail_recall={round(pc[-1],2)}")
# beta=0.0 behaves like CE; mid-beta lifts the tail; beta->1 can over-weight the tail.
# Our small-scale run, not the paper's reported numbers.`
  };

  window.CODEVIZ["paper-cb-loss"] = {
    question: "How does the 'effective number' of samples saturate as you add data, and how does the resulting class weight sit between 'treat all classes equally' and 'inverse frequency'?",
    charts: [
      {
        type: "line",
        title: "IDEAL — Effective number E_n = (1-beta^n)/(1-beta) vs raw count n (it saturates)",
        xlabel: "raw samples in the class, n",
        ylabel: "effective number E_n",
        series: [
          { name: "beta=0.99 (ceiling 100)", color: "#4ea1ff", points: [[1,1],[5,4.901],[10,9.562],[25,22.218],[50,39.499],[100,63.397],[250,91.894],[500,99.343],[1000,99.996],[2500,100],[5000,100]] },
          { name: "beta=0.999 (ceiling 1000)", color: "#7ee787", points: [[1,1],[5,4.99],[10,9.955],[25,24.702],[50,48.794],[100,95.208],[250,221.297],[500,393.621],[1000,632.305],[2500,918.018],[5000,993.279]] },
          { name: "beta=0.9999 (ceiling 10000)", color: "#c89bff", points: [[1,1],[5,4.999],[10,9.995],[25,24.97],[50,49.878],[100,99.507],[250,246.913],[500,487.73],[1000,951.671],[2500,2212.09],[5000,3934.845]] }
        ],
        interpret: "<b>Read the curve flattening as diminishing returns.</b> Each line is the effective number of samples for one value of beta. It rises roughly linearly at first (early samples are all new information) then bends over to a ceiling of 1/(1-beta) — past that, more raw samples add almost no new <i>effective</i> samples. Smaller beta (blue) saturates sooner and lower; beta closer to 1 (purple) stays near the raw count for longer. This saturation is the whole idea: a class with 5000 samples is not 5x more 'covered' than one with 1000."
      },
      {
        type: "bars",
        title: "IDEAL — per-class weight on a long tail [5000,1000,200,50,10]: CB sits between the two classics",
        labels: ["5000", "1000", "200", "50", "10"],
        series: [
          { name: "no re-weighting (beta=0)", color: "#9aa7b4", points: [["5000",1],["1000",1],["200",1],["50",1],["10",1]] },
          { name: "CB beta=0.99", color: "#7ee787", points: [["5000",0.31],["1000",0.31],["200",0.358],["50",0.784],["10",3.239]] },
          { name: "inverse-frequency (beta->1)", color: "#ff7b72", points: [["5000",0.008],["1000",0.04],["200",0.198],["50",0.792],["10",3.962]] }
        ],
        interpret: "<b>Each group is one class (x-axis = its sample count, head on the left).</b> Grey = treat all classes equally (weight 1). Red = inverse-frequency: it gives the head almost nothing (0.008) and piles weight on the tail. Green = class-balanced (beta=0.99): the two head classes <b>saturate to the same floor</b> (0.31) instead of being crushed to near-zero, while the rarest class still gets a big 3.24. CB is the middle path — it lifts the tail like inverse-frequency but caps the head, which is steadier. (Weights normalized to sum to the 5 classes.)"
      },
      {
        type: "line",
        title: "VARIANT — the beta dial: weight on the rarest class (n=10) as beta goes 0 -> 1",
        xlabel: "beta",
        ylabel: "raw weight 1/E for the n=10 class",
        series: [
          { name: "1/E_10 vs beta", color: "#ffb454", points: [[0,1],[0.5,0.5005],[0.9,0.1535],[0.99,0.1046],[0.999,0.1005],[0.9999,0.1],[0.99999,0.1]] }
        ],
        interpret: "<b>Beta is a single dial between the two classic schemes.</b> At beta=0 the rare class gets weight 1 — identical to every other class (no help for the tail). As beta increases, its weight falls toward 1/n = 1/10 = 0.1, i.e. pure inverse-frequency. Everything useful happens in the bend between ~0.9 and ~0.999. Reading this curve tells you what you are actually choosing when you set beta: too small = no re-weighting; pushed to the far right = the inverse-frequency extreme."
      },
      {
        type: "bars",
        title: "VARIANT (illustrative) — what you might see: per-class recall, plain CE vs CB-focal on a long tail",
        labels: ["head", "2", "3", "4", "tail"],
        series: [
          { name: "plain cross entropy", color: "#ff7b72", points: [["head",0.97],["2",0.9],["3",0.74],["4",0.4],["tail",0.05]] },
          { name: "CB-focal", color: "#7ee787", points: [["head",0.93],["2",0.88],["3",0.8],["4",0.7],["tail",0.6]] }
        ],
        interpret: "Illustrative shape (not the paper's numbers). <b>Read left-to-right as head -> tail.</b> Plain cross entropy (red) nails the head but the rarest class collapses toward 0 recall — it has effectively given up on the tail. CB-focal (green) gives up a little head accuracy and converts it into a large tail gain, so <b>balanced accuracy</b> (the average of these bars) goes up even if overall accuracy barely moves. If your CB-focal bars look identical to CE, the class weights are not actually being applied."
      }
    ],
    caption: "Effective number (chart 1) saturates with raw count; the resulting weight (chart 2) caps the head and lifts the tail, sitting between no-re-weighting and inverse-frequency; beta is the dial between those extremes (chart 3); and on a long-tailed problem CB-focal trades a little head accuracy for a large tail gain (chart 4). Numbers in charts 1-3 are computed exactly from the formulas; chart 4 is an illustrative shape.",
    code: `import torch
# Effective number and class weights, computed exactly from the paper's formulas.
def cb_weights(counts, beta):
    counts = torch.tensor(counts, dtype=torch.float64)
    eff = (1 - torch.pow(beta, counts)) / (1 - beta) if beta > 0 else torch.ones_like(counts)
    w = 1 / eff
    return (w * len(counts) / w.sum()).tolist()          # normalize to sum = C

counts = [5000, 1000, 200, 50, 10]
print("no re-weighting :", [1]*5)
print("CB beta=0.99    :", [round(x,3) for x in cb_weights(counts, 0.99)])
print("inverse-freq    :", [round(x,3) for x in cb_weights(counts, 1 - 1e-12)])
# no re-weighting : [1, 1, 1, 1, 1]
# CB beta=0.99    : [0.31, 0.31, 0.358, 0.784, 3.239]
# inverse-freq    : [0.008, 0.04, 0.198, 0.792, 3.962]
# Computed from (1-beta^n)/(1-beta); not the paper's reported numbers.`
  };
})();
