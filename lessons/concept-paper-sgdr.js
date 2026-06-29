/* Paper lesson — SGDR: Stochastic Gradient Descent with Warm Restarts (Loshchilov & Hutter, 2016/2017).
   Grounded from arXiv:1608.03983 (abstract page + ar5iv HTML; Eq. (5) Section 3, defaults Figure 1,
   snapshot-ensemble note Section 4.3, "anytime performance" claim Section 5).
   Track A (primitive): build the cosine-annealing-with-warm-restarts LR schedule from scratch with raw
   Python/torch, verify with torch.allclose vs torch.optim.lr_scheduler.CosineAnnealingWarmRestarts on a
   toy optimizer across a restart. Self-contained: lesson + CODE + CODEVIZ merged by id "paper-sgdr". */
(function () {
  window.LESSONS.push({
    id: "paper-sgdr",
    title: "SGDR — Stochastic Gradient Descent with Warm Restarts (2016)",
    tagline: "Decay the learning rate along a cosine curve, then jump it back up and restart — repeatedly — to train faster and collect a free ensemble of snapshots.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Ilya Loshchilov, Frank Hutter",
      org: "University of Freiburg",
      year: 2016,
      venue: "ICLR 2017 (arXiv:1608.03983, submitted Aug 2016)",
      citations: "",
      arxiv: "https://arxiv.org/abs/1608.03983",
      code: "https://github.com/loshchil/SGDR"
    },

    conceptLink: "dl-optimizers",
    partOf: [],
    prereqs: ["dl-optimizers", "dl-backprop", "pt-autograd"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> When you train a neural network with stochastic gradient descent (SGD) &mdash;
       repeatedly nudging the weights downhill on mini-batches of data &mdash; the single most important knob
       is the <b>learning rate</b> (how big each downhill step is). Too large and training bounces around and
       never settles; too small and it crawls. The standard fix is a <b>schedule</b>: start the learning rate
       high and shrink it over time, so you take bold steps early and careful steps late.</p>
       <p>But common schedules (step decay, a fixed exponential decay) have two problems. First, they are
       <b>monotone</b> &mdash; the learning rate only ever goes down, so once it is tiny the optimizer is stuck
       crawling inside whatever valley it happens to be in. Second, you have to <b>guess the total budget</b> up
       front: a step-decay schedule tuned for 200 epochs is wrong if you stop at 100. An "epoch" is one full pass
       over the training set.</p>
       <p>The paper asks: what if, instead of decaying once, we decay the learning rate smoothly, then
       <b>suddenly jump it back up to its starting value and decay again</b> &mdash; over and over? Each
       sudden jump is a <b>warm restart</b>: "warm" because we keep the current weights (and momentum), we only
       reset the learning rate.</p>`,

    contribution:
      `<p>The paper takes warm restarts &mdash; a classic trick from gradient-free and convex optimization &mdash;
       and adapts them to deep-network SGD. Its contributions:</p>
       <ul>
         <li><b>A cosine-annealing-with-warm-restarts learning-rate schedule (Eq. 5).</b> Within each run the
         learning rate follows a half-cosine curve from a high value $\\eta_{max}$ down to a low value
         $\\eta_{min}$; at the end of the run the learning rate <b>jumps back up</b> to $\\eta_{max}$ and a new
         run begins. This is the whole method &mdash; one closed-form formula, no extra training cost.</li>
         <li><b>Lengthening runs via $T_{mult}$.</b> The length of each run, $T_i$, can be multiplied by a factor
         $T_{mult}$ after every restart, so early runs are short (frequent restarts) and later runs are long
         (fine convergence).</li>
         <li><b>Strong "anytime" performance and free snapshot ensembles.</b> The schedule reaches good accuracy
         in far fewer epochs, and the model captured at the bottom of each cosine cycle is a good standalone model
         &mdash; collect them and you get an ensemble for the price of a single training run.</li>
       </ul>`,

    whyItMattered:
      `<p>The cosine schedule from this paper is now <b>everywhere</b>. PyTorch ships it as
       <code>torch.optim.lr_scheduler.CosineAnnealingWarmRestarts</code> (and the restart-free
       <code>CosineAnnealingLR</code>); the cosine decay it popularized is the default learning-rate schedule
       used to train most modern vision and language models. The paper reports state-of-the-art CIFAR error at the
       time, and its snapshot-ensemble idea (Section 4.3) became a standard cheap-ensemble recipe. Whenever you
       see a "cosine learning-rate schedule" in a training script, this is the paper.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 3 (Warm restarts in SGD) and Eq. (5)</b> &mdash; the one formula that is the entire method.
         Read the definitions of $T_{cur}$ and $T_i$ around it carefully; the subtlety is that $T_{cur}$ counts
         epochs <i>since the last restart</i>, not since the start of training.</li>
         <li><b>Figure 1</b> &mdash; pictures of the schedule for different $T_0$ and $T_{mult}$. Seeing the
         saw-tooth-of-cosines makes the formula obvious.</li>
         <li><b>Section 4.3</b> &mdash; the snapshot-ensemble observation: the network at the bottom of each cycle
         is a usable model.</li>
       </ul>
       <p><b>Skim:</b> the CIFAR / EEG / downsampled-ImageNet experiment tables (Section 4) for the qualitative
       result &mdash; warm restarts match or beat the baseline in 2&times;&ndash;4&times; fewer epochs. You do not
       need every number.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> We train the same tiny model two ways for the same number of steps: (a) a
       <b>constant</b> learning rate, and (b) the <b>SGDR cosine-with-restarts</b> schedule that decays then jumps
       back up several times. Which one ends at a lower loss? And what do you expect to see in the loss curve of
       the SGDR run right after each restart &mdash; will the loss go <i>down</i> smoothly, or <b>briefly jump up</b>
       when the learning rate leaps back to its maximum? Write your guess, then look at the CODEVIZ charts.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write the SGDR learning rate as a pure function of the step, using
       only <code>math.cos</code> and <code>math.pi</code> &mdash; no scheduler object:</p>
       <ul>
         <li>Track two quantities: <code>T_cur</code> (steps since the last restart, starts at 0) and
         <code>T_i</code> (length of the current run, starts at <code>T_0</code>).</li>
         <li>Each step, return the learning rate:
         <code># TODO: lr = eta_min + 0.5*(eta_max - eta_min)*(1 + cos(pi * T_cur / T_i))</code>.</li>
         <li>Advance: <code># TODO: T_cur += 1</code>. If <code>T_cur == T_i</code>: a restart &mdash;
         <code># TODO: T_cur = 0; T_i *= T_mult</code>.</li>
       </ul>
       <p>The CODE cell is the full reference, including the <code>torch.allclose</code> check that your
       hand-written schedule matches <code>torch.optim.lr_scheduler.CosineAnnealingWarmRestarts</code> on a toy
       optimizer across a restart &mdash; that passing check is the proof your schedule IS PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>SGDR replaces the learning-rate <i>schedule</i> only &mdash; the weight update is ordinary SGD (with
       momentum). The schedule runs in <b>cycles</b>. Think of one cycle:</p>
       <ol>
         <li><b>Start hot.</b> At the top of a cycle the learning rate equals $\\eta_{max}$ (the optimizer's base
         learning rate). Big steps let the weights move boldly.</li>
         <li><b>Cosine decay.</b> Over the next $T_i$ epochs the learning rate follows the <i>first half</i> of a
         cosine curve, sliding smoothly from $\\eta_{max}$ down to $\\eta_{min}$. The cosine shape spends a lot of
         time near the top (explore) and a lot near the bottom (refine), with a fast transition in between.</li>
         <li><b>Restart.</b> The moment the learning rate reaches $\\eta_{min}$ (i.e. $T_{cur}=T_i$), it
         <b>jumps straight back up</b> to $\\eta_{max}$. The weights are <i>not</i> reset &mdash; only the learning
         rate is. This is the "warm" restart.</li>
         <li><b>Lengthen.</b> Optionally multiply the run length: $T_{i+1}=T_{mult}\\cdot T_i$. With
         $T_{mult}=2$ each cycle is twice as long as the last; with $T_{mult}=1$ all cycles are the same length.</li>
       </ol>
       <p><b>Why the jump helps (the intuition).</b> After a cosine decay the weights sit at the bottom of some
       valley in the loss landscape. The sudden jump back to a large learning rate gives the optimizer the energy
       to <b>climb out and explore a different region</b> before settling again. Each restart can land the weights
       in a different good valley. The model snapshot taken at the <i>bottom</i> of each cycle is a fully usable
       network &mdash; and because successive snapshots sit in different valleys, <b>averaging their predictions
       gives a free ensemble</b> (Section 4.3). One training run, several models.</p>`,

    architecture:
      `<p>SGDR is not a network architecture &mdash; it is a <b>per-iteration learning-rate procedure</b> that wraps
       any SGD optimizer. There is no new layer, weight, or forward pass; the entire method is the schedule that
       sets $\\eta_t$ each step. Its state and per-step procedure:</p>
       <ul>
         <li><b>Fixed inputs:</b> $\\eta_{max}$ (the optimizer's base learning rate), $\\eta_{min}$ (default $0$),
         the first-run length $T_0$, and the multiplier $T_{mult}$ (default $1$).</li>
         <li><b>Mutable state (two counters):</b> $T_{cur}$ &mdash; epochs since the last restart, init $0$; and
         $T_i$ &mdash; the current run's length, init $T_0$. These are the ONLY things the schedule remembers.</li>
       </ul>
       <p><b>Data flow each training step:</b></p>
       <ol>
         <li>Read the two counters &rarr; compute $\\eta_t$ from Eq. (5).</li>
         <li>Hand $\\eta_t$ to the optimizer; it runs the ordinary momentum-SGD update (Eqs. 3&ndash;4) on the model
         weights. The weights and the schedule counters are the two separate pieces of state.</li>
         <li>Advance the clock: $T_{cur}\\mathrel{+}= \\Delta$ (one batch's fraction of an epoch).</li>
         <li>If $T_{cur}\\ge T_i$ &rarr; <b>restart</b>: set $T_{cur}=0$ and $T_i=T_{mult}\\,T_i$; weights pass
         through untouched. Optionally checkpoint the weights here &mdash; that snapshot is a usable model.</li>
       </ol>
       <p>So the "architecture" is a tiny stateful wrapper (two integers) feeding a scalar into an unchanged
       optimizer; <code>torch.optim.lr_scheduler.CosineAnnealingWarmRestarts</code> is exactly this object.</p>`,

    symbols: [
      { sym: "learning rate", desc: "the step size in gradient descent: how far the weights move along the (negative) gradient each update. SGDR schedules this value over time." },
      { sym: "warm restart", desc: "resetting the learning rate back up to its maximum while KEEPING the current weights and momentum (only the learning rate restarts, not the model). 'Warm' because we don't start from scratch." },
      { sym: "epoch", desc: "one full pass over the training set. The paper measures schedule length in epochs, but $T_{cur}$ is updated every mini-batch, so it can be fractional." },
      { sym: "$x_t$", desc: "the model's weight vector (all trainable parameters) at iteration $t$. SGDR updates this only through the ordinary SGD step; the schedule never touches the weights." },
      { sym: "$\\nabla f_t(x_t)$", desc: "the gradient of the loss $f_t$ on the current mini-batch with respect to the weights $x_t$ &mdash; the downhill direction the SGD update follows. The subscript $t$ marks that each step sees a different mini-batch." },
      { sym: "$H_t^{-1}$", desc: "the inverse Hessian (inverse matrix of second derivatives of the loss) at step $t$. Appears only in Eq. (2), the second-order method the paper contrasts against; SGDR does NOT compute it." },
      { sym: "$v_t$", desc: "the momentum velocity at step $t$: a running blend of past gradient directions (Eq. 3). The momentum-SGD update steps the weights by $v_{t+1}$ instead of the raw gradient." },
      { sym: "$\\mu_t$", desc: "mu-t: the momentum coefficient (typically $\\approx 0.9$) weighting how much of the previous velocity carries forward in Eq. (3)." },
      { sym: "$\\eta_t$", desc: "eta-t: the learning rate at time $t$ &mdash; the quantity the schedule outputs and the only thing SGDR sets. (The paper writes $\\eta_t$; PyTorch calls it the optimizer's lr.)" },
      { sym: "$\\eta_{min}^{i}$", desc: "the MINIMUM learning rate within run $i$ (the bottom of the cosine curve). Default $0$ in the paper. Often written just $\\eta_{min}$." },
      { sym: "$\\eta_{max}^{i}$", desc: "the MAXIMUM learning rate within run $i$ (the top of the cosine, the value the learning rate jumps back to at a restart). Equals the optimizer's base learning rate; kept constant across runs in the paper." },
      { sym: "$T_{cur}$", desc: "T-current: how many epochs have elapsed SINCE THE LAST RESTART (updated every batch, so it can be fractional, e.g. 0.1). Resets to $0$ at each restart." },
      { sym: "$T_i$", desc: "the length (in epochs) of the $i$-th run &mdash; how long the current cosine decay lasts before the next restart." },
      { sym: "$T_0$", desc: "the length of the FIRST run (the initial $T_i$). PyTorch calls this the constructor argument T_0." },
      { sym: "$T_{mult}$", desc: "T-mult: the factor by which the run length grows after each restart, $T_{i+1}=T_{mult}\\,T_i$. $T_{mult}=1$ keeps every run the same length; $T_{mult}=2$ doubles it each time." }
    ],

    formula:
      `$$x_{t+1} = x_t - \\eta_t\\,\\nabla f_t(x_t)$$
       <p>Eq. (1), §1 &mdash; plain stochastic gradient descent: step the weights $x$ downhill along the
       mini-batch gradient $\\nabla f_t$, scaled by the learning rate $\\eta_t$. SGDR changes only how $\\eta_t$ is
       set over time; this update is untouched.</p>

       $$x_{t+1} = x_t - \\eta_t\\,H_t^{-1}\\,\\nabla f_t(x_t)$$
       <p>Eq. (2), §1 &mdash; the second-order ideal (precondition the gradient by the inverse Hessian $H_t^{-1}$),
       quoted by the paper only to contrast: warm restarts are a cheap first-order alternative to such curvature
       methods.</p>

       $$v_{t+1} = \\mu_t\\,v_t - \\eta_t\\,\\nabla f_t(x_t) \\qquad x_{t+1} = x_t + v_{t+1}$$
       <p>Eqs. (3)&ndash;(4), §1 &mdash; SGD with Nesterov momentum: keep a velocity $v$ that blends the past
       direction (weight $\\mu_t$) with the new gradient, then step by it. This is the actual optimizer SGDR wraps;
       $\\eta_t$ still comes from the schedule below.</p>

       $$\\eta_t = \\eta_{min}^{i} + \\tfrac{1}{2}\\left(\\eta_{max}^{i}-\\eta_{min}^{i}\\right)
        \\left(1 + \\cos\\!\\left(\\frac{T_{cur}}{T_i}\\,\\pi\\right)\\right)$$
       <p>Eq. (5), §3 &mdash; THE method: cosine annealing with warm restarts. Within run $i$ the learning rate
       slides from $\\eta_{max}^{i}$ (at $T_{cur}=0$, since $\\cos 0=1$) down to $\\eta_{min}^{i}$ (at
       $T_{cur}=T_i$, since $\\cos\\pi=-1$) along half a cosine. At a restart $T_{cur}$ snaps to $0$, jumping
       $\\eta_t$ back to $\\eta_{max}$.</p>

       $$T_{cur} \\to 0,\\qquad T_i \\to T_{mult}\\,T_i \\quad\\text{when } T_{cur}=T_i$$
       <p>The restart rule, §3 &mdash; when the run finishes, reset the within-run clock $T_{cur}$ to $0$ and grow
       the next run's length by the factor $T_{mult}$. Unrolled, the $i$-th run has length
       $T_i = T_0\\,(T_{mult})^{i}$, so with $T_{mult}=1$ all runs are equal length and with $T_{mult}=2$ they
       double each time.</p>`,

    whatItDoes:
      `<p><b>Eqs. (1)&ndash;(4)</b> are the optimizer SGDR rides on top of: Eq. (1) is one plain SGD step, Eqs.
       (3)&ndash;(4) are the same step with Nesterov momentum (a velocity that smooths the direction), and Eq. (2)
       is the second-order ideal SGDR cheaply approximates. None of these change &mdash; SGDR only feeds them a
       time-varying $\\eta_t$.</p>
       <p><b>Eq. (5)</b> of the paper (Section 3) is that $\\eta_t$: the learning rate at any moment within a run. Read the
       cosine factor $\\cos(\\pi\\,T_{cur}/T_i)$: at the start of a run $T_{cur}=0$, so $\\cos(0)=1$ and the bracket
       $(1+\\cos)=2$, giving $\\eta_t=\\eta_{max}$ (top of the curve). At the end $T_{cur}=T_i$, so
       $\\cos(\\pi)=-1$, the bracket is $0$, and $\\eta_t=\\eta_{min}$ (bottom). In between, the cosine slides
       smoothly between those, spending extra time near both ends. The $\\tfrac12(\\eta_{max}-\\eta_{min})$ scales
       the swing and $\\eta_{min}$ shifts the floor. At a restart $T_{cur}$ snaps back to $0$, so $\\eta_t$ snaps
       back to $\\eta_{max}$ &mdash; that vertical jump is the warm restart. This is exactly the schedule
       <code>torch.optim.lr_scheduler.CosineAnnealingWarmRestarts</code> implements.</p>`,

    derivation:
      `<p>The <i>why</i> behind SGD itself &mdash; following the negative gradient, momentum, and why the learning
       rate is the crucial knob &mdash; is covered in the <code>dl-optimizers</code> concept lesson; this lesson
       builds on it, so we recap rather than re-derive. <b>Recap:</b> SGD updates
       $\\theta\\leftarrow\\theta-\\eta\\,g$ with gradient $g$; a large $\\eta$ explores, a small $\\eta$ refines.
       <b>The one new idea here</b> is purely the <i>shape of $\\eta$ over time</i>. Eq. (5) is just a re-scaled,
       re-centered cosine: $\\tfrac12(1+\\cos x)$ is a standard "smooth ramp from 1 to 0 as $x$ goes from $0$ to
       $\\pi$" &mdash; plug $x=\\pi T_{cur}/T_i$ and you get a smooth ramp from $\\eta_{max}$ to $\\eta_{min}$ over
       one run. Resetting $T_{cur}\\to 0$ makes it periodic. No deeper derivation is needed: the math is a chosen
       schedule, and its justification is empirical (it trains faster &mdash; see results). See
       <code>dl-optimizers</code> for the SGD update itself.</p>`,

    example:
      `<p><b>Worked numbers: the learning rate across one restart.</b> Take $\\eta_{max}=0.1$, $\\eta_{min}=0$,
       first run length $T_0=4$ epochs, $T_{mult}=1$ (so every run is 4 epochs). We read $\\eta_t$ at integer
       epochs. With $\\eta_{min}=0$ Eq. (5) simplifies to
       $\\eta_t=0.05\\,(1+\\cos(\\pi\\,T_{cur}/4))$. Step through one full run, then the restart:</p>
       <ul class="steps">
         <li>$T_{cur}=0$: $\\cos(0)=1\\Rightarrow\\eta=0.05(1+1)=0.1$ &nbsp;(top of run 1).</li>
         <li>$T_{cur}=1$: $\\cos(\\pi/4)=0.70711\\Rightarrow\\eta=0.05(1.70711)=0.08536$.</li>
         <li>$T_{cur}=2$: $\\cos(\\pi/2)=0\\Rightarrow\\eta=0.05(1)=0.05$ &nbsp;(halfway).</li>
         <li>$T_{cur}=3$: $\\cos(3\\pi/4)=-0.70711\\Rightarrow\\eta=0.05(0.29289)=0.01464$.</li>
         <li>$T_{cur}=4$: <b>restart</b> &mdash; $T_{cur}$ snaps to $0$, $T_i$ stays $4$, so
         $\\eta=0.05(1+\\cos 0)=0.1$ again. The rate <b>jumps</b> from $0.01464$ straight back up to $0.1$.</li>
       </ul>
       <table class="extable">
         <caption>$\\eta_t$ at each epoch of a 4-epoch run ($\\eta_{max}=0.1,\\ \\eta_{min}=0,\\ T_0=4,\\ T_{mult}=1$), then the jump.</caption>
         <thead><tr><th>$T_{cur}$</th><th class="num">$\\cos(\\pi T_{cur}/4)$</th><th class="num">$1+\\cos$</th><th class="num">$\\eta_t$</th></tr></thead>
         <tbody>
           <tr><td class="row-h">0</td><td class="num">1.00000</td><td class="num">2.00000</td><td class="num">0.10000</td></tr>
           <tr><td class="row-h">1</td><td class="num">0.70711</td><td class="num">1.70711</td><td class="num">0.08536</td></tr>
           <tr><td class="row-h">2</td><td class="num">0.00000</td><td class="num">1.00000</td><td class="num">0.05000</td></tr>
           <tr><td class="row-h">3</td><td class="num">&minus;0.70711</td><td class="num">0.29289</td><td class="num">0.01464</td></tr>
           <tr><td class="row-h">4 &rarr; restart</td><td class="num">1.00000</td><td class="num">2.00000</td><td class="num">0.10000</td></tr>
         </tbody>
       </table>
       <p>So the sequence is $0.1,\\,0.08536,\\,0.05,\\,0.01464,\\,[\\text{jump}]\\,0.1,\\dots$ The CODE cell
       recomputes these exact numbers and checks them against
       <code>CosineAnnealingWarmRestarts</code>.</p>`,

    recipe:
      `<p><b>The SGDR schedule as numbered steps</b> (wraps an ordinary SGD optimizer):</p>
       <ol>
         <li>Pick $\\eta_{max}$ (the optimizer's base learning rate), $\\eta_{min}$ (default $0$), the first run
         length $T_0$, and $T_{mult}$ (default $1$). Initialize $T_{cur}=0$, $T_i=T_0$.</li>
         <li>At each step, set the optimizer's learning rate from Eq. (5):
         $\\eta_t=\\eta_{min}+\\tfrac12(\\eta_{max}-\\eta_{min})(1+\\cos(\\pi T_{cur}/T_i))$.</li>
         <li>Take the normal SGD update with that learning rate.</li>
         <li>Advance the clock: $T_{cur}\\leftarrow T_{cur}+1$ (in practice, $+\\,$one batch's fraction of an epoch).</li>
         <li>If $T_{cur}\\ge T_i$: <b>restart</b> &mdash; set $T_{cur}\\leftarrow 0$ and $T_i\\leftarrow T_{mult}\\,T_i$.
         Keep all weights and momentum. Optionally save a snapshot (it is a usable model; collect snapshots for a
         free ensemble).</li>
       </ol>`,

    results:
      `<p>Quoted from the paper (Abstract): warm-restart SGD reaches state-of-the-art results of
       <b>3.14% test error on CIFAR-10 and 16.21% on CIFAR-100</b>, with further gains on an EEG dataset and on a
       downsampled version of ImageNet. The authors state (Section 5) that "the main purpose of our proposed warm
       restart scheme for SGD is to improve its <b>anytime performance</b>," obtaining comparable or better results
       in roughly <b>2&times; to 4&times; fewer epochs</b>. (Source: arXiv:1608.03983, Abstract and Section 5.)
       Every number in this lesson's CODEVIZ is instead OUR OWN small run, labeled as such &mdash; not the paper's
       reported number.</p>`,

    evaluation:
      `<p><b>What "working" means here.</b> SGDR is a learning-rate <i>schedule</i>, not a model, so it gets
       checked at two levels: (1) the schedule is the curve it should be, and (2) using it actually trains
       faster / lower than a flat baseline.</p>
       <ul>
         <li><b>The metric &amp; baseline.</b> Two things to measure. For the schedule itself: max absolute LR
         error vs <code>torch.optim.lr_scheduler.CosineAnnealingWarmRestarts</code> across at least two restarts
         &mdash; this should be $\\approx 0$ (the no-skill bar is "matches PyTorch to floating point"). For the
         payoff: final training loss (or validation error) versus a <b>constant-LR run</b> of the same step
         budget and seed &mdash; that constant-LR curve is your trivial baseline; SGDR should end at or below it.
         At scale the paper's own yardstick is test error vs the baseline schedule it beats (see Expected range).</li>
         <li><b>Sanity checks BEFORE any training.</b> (a) At every restart, $T_{cur}=0$, so plug it in:
         $\\eta=\\eta_{max}$ exactly &mdash; assert the first LR of each cycle equals the base LR. (b) At the
         bottom $T_{cur}=T_i$: $\\cos\\pi=-1$, so $\\eta=\\eta_{min}$ (default $0$) &mdash; assert the curve
         reaches its floor. (c) Replay the lesson's worked sequence $0.1,\\,0.08536,\\,0.05,\\,0.01464,\\,
         [\\text{jump}]\\,0.1$ as a known-answer unit test. (d) Run the
         <code>torch.allclose(my_lrs, pytorch_lrs)</code> check from the CODE cell across a restart with
         $T_{mult}\\ne 1$ &mdash; if it passes, your schedule provably IS PyTorch's.</li>
         <li><b>Expected range.</b> The schedule-vs-PyTorch error should be machine-epsilon small (rule of thumb:
         $\\lt 10^{-6}$); anything larger is an off-by-one at the restart, not tuning. For the training payoff,
         the paper reports (Abstract) state-of-the-art <b>3.14% test error on CIFAR-10 and 16.21% on CIFAR-100</b>,
         reaching comparable-or-better accuracy in roughly <b>2&times;&ndash;4&times; fewer epochs</b>
         (arXiv:1608.03983, Abstract &amp; &sect;5) &mdash; that "anytime" speedup, not a single accuracy point, is
         the claim to reproduce in spirit. On the lesson's toy run, expect SGDR to end below the constant-LR
         baseline; if it's no better, the restarts aren't doing anything (rule of thumb, not a paper number).</li>
         <li><b>Ablation &mdash; prove the restart earns its keep.</b> The central knob is the warm restart itself.
         Turn it OFF by never resetting $T_{cur}$ (one long cosine decay, no jumps) or by switching to a constant
         LR, holding seed/init/step-budget fixed. The restart's signature should vanish: no LR jumps back to
         $\\eta_{max}$, and on a non-convex problem the "escape a shallow minimum" behavior disappears (the
         lesson's CODEVIZ: 8/12 runs escape WITH restarts, the constant-LR run stays trapped). If turning restarts
         off changes nothing, your $T_{cur}$ reset is dead code &mdash; you built a plain cosine decay.</li>
         <li><b>Failure signals &amp; what they mean.</b> (i) The allclose drifts only AFTER the first cycle &rarr;
         off-by-one at the restart or you forgot to grow $T_i$ when $T_{mult}\\ne 1$ (the classic pitfall). (ii)
         One smooth monotone decay with no jumps &rarr; you fed the global step into the cosine instead of resetting
         $T_{cur}$ &mdash; that's not warm restarts. (iii) Loss goes NaN right after a restart &rarr; $\\eta_{max}$
         is too high for this model (the jump is real, the value is wrong). (iv) Loss collapses to the constant-LR
         curve with no bump at restarts &rarr; the LR jump isn't reaching the optimizer (schedule not wired to the
         param group). (v) Training is worse than constant LR &rarr; restarts too frequent / $\\eta_{max}$ too
         large, kicking the weights out faster than they settle. The visible <b>bump-up in loss at each restart</b>
         (CODEVIZ, step 9&rarr;10) is the healthy signal that the kick is landing.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this schedule as
       <code>torch.optim.lr_scheduler.CosineAnnealingWarmRestarts</code> in one line. Here you <b>build the
       schedule from scratch</b>: the cosine formula (Eq. 5), the $T_{cur}$ clock, the restart reset, and the
       $T_{mult}$ lengthening. The payoff is
       <code>torch.allclose(my_lrs, pytorch_lrs)</code> over a sequence of steps that crosses a restart &mdash; if
       it passes, your schedule is provably identical to PyTorch's. The optimizer step is ordinary SGD; you only
       own the learning-rate-vs-time curve.</p>`,

    pitfalls:
      `<ul>
         <li><b>$T_{cur}$ counts since the last restart, not since the start.</b> The most common bug: feeding the
         global step number into the cosine instead of resetting it at each restart. Then you get one long decay,
         not warm restarts.</li>
         <li><b>Off-by-one at the restart.</b> The restart happens when $T_{cur}$ reaches $T_i$: at that instant
         $T_{cur}$ resets to $0$ (giving $\\eta_{max}$ again), it does not pass through $T_{cur}=T_i$ with a tiny
         learning rate and then jump. PyTorch's <code>CosineAnnealingWarmRestarts</code> does the reset the moment
         $T_{cur}\\ge T_i$; match its convention or the allclose drifts after the first cycle.</li>
         <li><b>Forgetting to grow $T_i$ when $T_{mult}\\ne 1$.</b> With $T_{mult}=2$ each run must double; if you
         keep $T_i=T_0$ you get fixed-length cycles (which is the $T_{mult}=1$ schedule, a different curve).</li>
         <li><b>Resetting the weights at a restart.</b> A warm restart resets only the learning rate. If you also
         reinitialize the model you have thrown away all training &mdash; that is a cold restart, not this paper.</li>
         <li><b>$\\eta_{min}$ vs $\\eta_{max}$ swapped.</b> The curve starts at $\\eta_{max}$ ($T_{cur}=0$) and ends
         at $\\eta_{min}$ ($T_{cur}=T_i$). Swapping them inverts the schedule (decays up instead of down).</li>
       </ul>`,

    recall: [
      "Write the SGDR schedule (Eq. 5) from memory: $\\eta_t=\\eta_{min}+\\tfrac12(\\eta_{max}-\\eta_{min})(1+\\cos(\\pi T_{cur}/T_i))$.",
      "What does $T_{cur}$ count, and what happens to it at a restart?",
      "Define $\\eta_{max}$, $\\eta_{min}$, $T_i$, $T_0$, and $T_{mult}$.",
      "What does a warm restart reset, and what does it keep? Why does keeping the weights matter?",
      "Why does collecting the snapshot at the bottom of each cosine cycle give a free ensemble?"
    ],

    practice: [
      {
        q: `Using Eq. (5) with $\\eta_{max}=0.2$, $\\eta_{min}=0$, $T_0=2$, $T_{mult}=1$, what is the learning rate at $T_{cur}=0,\\ 1,\\ 2$? (Note $T_{cur}=2$ triggers a restart.)`,
        steps: [
          { do: `$T_{cur}=0$: $\\cos(0)=1$, so $\\eta=0.1(1+1)=0.2$.`, why: `Start of a run is always $\\eta_{max}$.` },
          { do: `$T_{cur}=1$: $\\cos(\\pi\\cdot 1/2)=\\cos(\\pi/2)=0$, so $\\eta=0.1(1+0)=0.1$.`, why: `Halfway through a 2-epoch run the learning rate is the midpoint.` },
          { do: `$T_{cur}=2$ would give $\\cos(\\pi)=-1\\Rightarrow\\eta=0$, but this is a restart: $T_{cur}$ resets to $0$, so $\\eta$ jumps back to $0.2$.`, why: `The warm restart snaps the learning rate back to $\\eta_{max}$.` }
        ],
        answer: `$0.2,\\ 0.1$, then a jump back to $0.2$. The schedule never lingers at $0$ &mdash; it bottoms out and immediately restarts.`
      },
      {
        q: `ABLATION: train a tiny model with a CONSTANT learning rate vs the SGDR cosine-with-restarts schedule for the same number of steps. What do you expect for (a) the final loss and (b) the shape of the SGDR loss curve at each restart?`,
        steps: [
          { do: `Run both schedules from the same initialization and seed (see CODE / CODEVIZ).`, why: `Only the learning-rate-vs-time curve differs, so any gap is due to the schedule.` },
          { do: `Compare final losses.`, why: `SGDR's low-learning-rate phase at the bottom of each cycle lets it settle tightly into a minimum, which constant lr cannot do.` },
          { do: `Look at the SGDR loss right after each restart.`, why: `The learning rate jumps to $\\eta_{max}$, so the weights are kicked and the loss briefly RISES, then re-descends.` }
        ],
        answer: `SGDR ends at a <b>lower</b> loss than a constant learning rate (the cosine floor lets it converge tightly), and its loss curve shows a small <b>bump up at every restart</b> followed by a re-descent &mdash; the visible signature of escaping the current minimum. These are OUR small-run numbers (CODEVIZ), not the paper's reported metrics.`
      },
      {
        q: `You set $T_0=10$, $T_{mult}=2$. How long are the first three runs, and at which global epochs do the restarts occur?`,
        steps: [
          { do: `Run 1 length $=T_0=10$ (epochs 0&ndash;9), restart at epoch 10.`, why: `The first run uses $T_0$.` },
          { do: `Run 2 length $=T_{mult}\\cdot 10=20$ (epochs 10&ndash;29), restart at epoch 30.`, why: `Each run length is multiplied by $T_{mult}=2$.` },
          { do: `Run 3 length $=2\\cdot 20=40$ (epochs 30&ndash;69), restart at epoch 70.`, why: `Lengths grow geometrically: $10,20,40,\\dots$.` }
        ],
        answer: `Run lengths $10,\\ 20,\\ 40$; restarts at global epochs $10,\\ 30,\\ 70$. Doubling makes early restarts frequent (explore) and later runs long (fine convergence).`
      }
    ]
  });

  window.CODE["paper-sgdr"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the SGDR cosine-annealing-with-warm-restarts LR schedule FROM SCRATCH (Eq. 5, Loshchilov & ` +
      `Hutter 2016): the cosine formula, the T_cur clock, the restart reset, and T_mult lengthening. Then ` +
      `PROVE it is identical to torch.optim.lr_scheduler.CosineAnnealingWarmRestarts on a toy SGD optimizer ` +
      `across a restart with torch.allclose, and recompute the worked example (0.1, 0.08536, 0.05, 0.01464, ` +
      `jump to 0.1). Runs in Colab (torch is preinstalled).`,
    code: `import math, torch

# ---- SGDR LR SCHEDULE FROM SCRATCH (Eq. 5, Loshchilov & Hutter 2016) ----
class SGDR:
    """Cosine annealing with warm restarts. Returns the LR for each call to .get();
    advance the T_cur clock with .step(). eta_max is the optimizer's base lr."""
    def __init__(self, eta_max, eta_min=0.0, T_0=4, T_mult=1):
        self.eta_max, self.eta_min = eta_max, eta_min
        self.T_mult = T_mult
        self.T_cur, self.T_i = 0, T_0
    def get(self):
        # Eq. (5): eta = eta_min + 0.5*(eta_max-eta_min)*(1 + cos(pi * T_cur / T_i))
        return self.eta_min + 0.5*(self.eta_max-self.eta_min)*(1 + math.cos(math.pi*self.T_cur/self.T_i))
    def step(self):
        self.T_cur += 1
        if self.T_cur >= self.T_i:        # restart: snap T_cur back to 0, grow the run
            self.T_cur = 0
            self.T_i *= self.T_mult

# ---- recompute the WORKED EXAMPLE: eta_max=0.1, eta_min=0, T_0=4, T_mult=1 ----
s = SGDR(eta_max=0.1, eta_min=0.0, T_0=4, T_mult=1)
seq = []
for _ in range(5):            # 4 steps of run 1, then the restart back to 0.1
    seq.append(round(s.get(), 5)); s.step()
print("worked example LRs:", seq)   # [0.1, 0.08536, 0.05, 0.01464, 0.1]
assert seq == [0.1, 0.08536, 0.05, 0.01464, 0.1]

# ---- THE ORACLE: my schedule must equal torch's CosineAnnealingWarmRestarts ----
# A toy 1-param SGD optimizer; we only read its learning rate each step.
ETA_MAX, ETA_MIN, T0, TMULT, STEPS = 0.1, 0.0, 3, 2, 12   # crosses 2 restarts
p = torch.zeros(1, requires_grad=True)
opt = torch.optim.SGD([p], lr=ETA_MAX)
sched = torch.optim.lr_scheduler.CosineAnnealingWarmRestarts(
    opt, T_0=T0, T_mult=TMULT, eta_min=ETA_MIN)

mine = SGDR(eta_max=ETA_MAX, eta_min=ETA_MIN, T_0=T0, T_mult=TMULT)
torch_lrs, my_lrs = [], []
for _ in range(STEPS):
    torch_lrs.append(opt.param_groups[0]["lr"])  # torch's current lr
    my_lrs.append(mine.get())                    # my current lr
    sched.step(); mine.step()                    # advance both clocks together

t = torch.tensor(torch_lrs); m = torch.tensor(my_lrs)
print("torch lrs:", [round(x,5) for x in torch_lrs])
print("my lrs   :", [round(x,5) for x in my_lrs])
print("allclose (atol=1e-6):", torch.allclose(m, t, atol=1e-6))   # expect True

# ---- use it: one SGD epoch where the lr follows the schedule ----
w = torch.tensor([5.0])                  # minimize (w-1)^2, gradient = 2(w-1)
sgdr = SGDR(eta_max=0.3, eta_min=0.0, T_0=5, T_mult=1)
for _ in range(20):
    g = 2*(w - 1.0)
    w = w - sgdr.get()*g                 # SGD step at the scheduled lr
    sgdr.step()
print("converged w (target 1.0):", round(w.item(), 4))`
  };

  window.CODEVIZ["paper-sgdr"] = {
    question: "What does the SGDR cosine-with-warm-restarts learning rate look like over time, and does it actually help on a non-convex toy problem — can the restart kick the optimizer OUT of a shallow local minimum and into the deeper global one, the way the paper's intuition suggests?",
    charts: [
      {
        type: "line",
        title: "The SGDR learning-rate schedule we built (eta_max=0.5, eta_min=0, T_0=10, T_mult=2)",
        xlabel: "step",
        ylabel: "learning rate eta_t",
        series: [
          {
            name: "SGDR cosine + warm restarts",
            color: "#7ee787",
            points: [[0,0.5],[2,0.4523],[4,0.3273],[6,0.1727],[8,0.0477],[9,0.0122],[10,0.5],[13,0.4728],[16,0.3969],[19,0.2891],[22,0.1727],[25,0.0732],[28,0.0122],[30,0.5],[36,0.4728],[42,0.3969],[48,0.2891],[54,0.1727],[60,0.0732],[66,0.0122],[69,0.0008],[70,0.5]]
          }
        ]
      },
      {
        type: "line",
        title: "Non-convex toy loss, averaged over 12 noisy runs: constant lr vs SGDR (our small run)",
        xlabel: "step",
        ylabel: "average loss (global min -0.64, shallow local min +0.54)",
        series: [
          {
            name: "constant lr = 0.05",
            color: "#ff7b72",
            points: [[0,0.5614],[5,0.5555],[10,0.5531],[15,0.5498],[20,0.5469],[25,0.5487],[30,0.5471],[40,0.5475],[50,0.5479],[60,0.5479],[70,0.5476],[79,0.5471]]
          },
          {
            name: "SGDR (cosine + restarts)",
            color: "#7ee787",
            points: [[0,0.5731],[5,0.5634],[9,0.5591],[10,0.6007],[15,0.3022],[20,0.1844],[30,0.2483],[31,0.2908],[40,-0.0029],[50,-0.2143],[60,-0.2357],[70,-0.0816],[79,0.0228]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (seeded RNG, 12 noisy runs averaged), not the paper's reported numbers. LEFT: the schedule we built from Eq. (5). With T_mult=2 the runs lengthen (10, 20, 40 steps) and the learning rate jumps from ~0 straight back to eta_max=0.5 at each restart (steps 10, 30, 70). RIGHT: a non-convex double-well loss f(x)=0.5(x^2-1)^2+0.6x with a shallow local minimum at x=+0.79 (loss +0.54) and a deeper global minimum at x=-1.13 (loss -0.64); every run starts at x=0.6 inside the shallow basin and uses noisy (stochastic) gradients. Constant lr=0.05 stays trapped in the shallow min for all 12 runs (loss plateaus at ~0.547). SGDR ESCAPES: each warm restart leaps the learning rate to eta_max and, combined with the gradient noise, kicks the iterate over the barrier — 8 of 12 runs end in the deeper global basin, so the average loss falls to ~-0.24. Note the visible BUMP UP at the first restart (step 9->10, loss 0.559->0.601) when the learning rate jumps: that kick is exactly the escape mechanism the paper's intuition describes. The snapshot at the bottom of each cosine cycle is also a usable model — collect them for the 'free ensemble' of Section 4.3.",
    code: `import math

def sgdr_lr(step, eta_max=0.5, eta_min=0.0, T_0=10, T_mult=2):
    T_cur, T_i = step, T_0
    while T_cur >= T_i:                 # unwind to the current run
        T_cur -= T_i; T_i *= T_mult
    return eta_min + 0.5*(eta_max-eta_min)*(1 + math.cos(math.pi*T_cur/T_i))

# LEFT chart: the schedule itself
print("schedule:", [round(sgdr_lr(s),4) for s in range(0,71)])

# RIGHT chart: escape a shallow local minimum on a NON-CONVEX double well.
# f(x)=0.5*(x^2-1)^2 + 0.6x : shallow local min x=+0.79 (f=+0.54), deep global min x=-1.13 (f=-0.64).
import random
def f(x):  return 0.5*(x*x-1)**2 + 0.6*x
def gp(x): return 2*x*(x*x-1) + 0.6           # df/dx

def run(get_lr, seed, steps=80, noise=0.9):
    rng = random.Random(seed); x = 0.6        # start INSIDE the shallow basin
    losses = []
    for s in range(steps):
        n = rng.uniform(-noise, noise)         # stochastic (mini-batch) gradient noise
        x = x - get_lr(s)*(gp(x) + n)          # noisy SGD step at the scheduled lr
        losses.append(f(x))
    return losses, x

seeds = range(1, 13)
def avg(get_lr):
    runs = [run(get_lr, s)[0] for s in seeds]
    return [round(sum(r[i] for r in runs)/len(runs), 4) for i in range(80)]

const = avg(lambda s: 0.05)
sgdr  = avg(lambda s: sgdr_lr(s, eta_max=0.45))
esc_const = sum(run(lambda s: 0.05, s)[1] < 0 for s in seeds)
esc_sgdr  = sum(run(lambda s: sgdr_lr(s, eta_max=0.45), s)[1] < 0 for s in seeds)
print("constant final avg loss:", const[-1], " runs that escaped to global min:", esc_const, "/12")
print("SGDR     final avg loss:", sgdr[-1],  " runs that escaped to global min:", esc_sgdr,  "/12")
print("Bump at first restart (step 9 -> 10):", sgdr[9], "->", sgdr[10])`
  };
})();
