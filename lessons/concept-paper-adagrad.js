/* Paper lesson — Adagrad: Adaptive Subgradient Methods for Online Learning and Stochastic
   Optimization (Duchi, Hazan & Singer, JMLR 2011).
   Grounded from the official JMLR PDF (jmlr.org/papers/v12/duchi11a): Section 1.1 "The Adaptive
   Gradient Algorithm" (the diagonal update, eq. (1)), eq. (5) (H_t = delta*I + diag(G_t)^{1/2}),
   and Section 1.3 / 1.3.1 ("Diagonal Adaptation") on rare-feature learning rates.
   Track A (primitive): build diagonal Adagrad from scratch with raw torch, verify with
   torch.allclose vs torch.optim.Adagrad over several steps. Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-adagrad". */
(function () {
  window.LESSONS.push({
    id: "paper-adagrad",
    title: "Adagrad — Adaptive Subgradient Methods for Online Learning and Stochastic Optimization (2011)",
    tagline: "Give every parameter its own learning rate that shrinks as its gradients accumulate — so rarely-seen, informative features still get big steps.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "John Duchi, Elad Hazan, Yoram Singer",
      org: "UC Berkeley / Technion / Google",
      year: 2011,
      venue: "Journal of Machine Learning Research, vol. 12, pp. 2121–2159 (preliminary version COLT 2010)",
      citations: "",
      url: "https://jmlr.org/papers/v12/duchi11a",
      code: ""
    },

    conceptLink: "dl-optimizers",
    partOf: [],
    prereqs: ["dl-optimizers", "dl-backprop", "pt-autograd", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Training a model means repeatedly nudging its parameters downhill on a loss
       function. Plain <b>stochastic gradient descent (SGD)</b> &mdash; "stochastic" because the gradient
       is estimated from a small random batch of data, not the whole dataset &mdash; uses one global
       learning rate for every parameter: <code>param = param - eta * gradient</code>. ("Gradient" = the
       slope of the loss with respect to a parameter; "$\\eta$", eta, is the step size, also called the
       learning rate. A "parameter" or "coordinate" is one weight in the model.)</p>
       <p><b>What was broken.</b> One global learning rate fits every parameter badly. The paper's intro
       (Section 1) points out that in high-dimensional problems, "the input instances are of very high
       dimension, yet within any particular instance only a few features are non-zero" &mdash; the data is
       <b>sparse</b> ("sparse" = mostly zeros). And "it is often the case&hellip; that infrequently
       occurring features are highly informative and discriminative." With a single learning rate, a
       feature seen hundreds of times and a feature seen once or twice get the exact same step size, which
       the paper (Section 1.4) calls "rather deficient." Tuning that one rate plus a decay schedule by hand
       was a major chore.</p>`,

    contribution:
      `<p>Adagrad ("<b>ada</b>ptive <b>grad</b>ient") gives every parameter its own learning rate, derived
       automatically from that parameter's own gradient history. Its contributions (abstract; Section 1.1):</p>
       <ul>
         <li><b>Per-coordinate adaptive learning rates.</b> Each parameter divides its step by the square
         root of the sum of all its past squared gradients. The paper states the intuition (Section 1):
         "frequently occurring features [get] very low learning rates and infrequent features high learning
         rates, where the intuition is that each time an infrequent feature is seen, the learner should
         'take notice.'"</li>
         <li><b>It needs almost no learning-rate tuning.</b> The abstract says the method "significantly
         simplifies setting a learning rate" by adapting the proximal function to the data, instead of
         choosing a single rate and decay schedule by hand.</li>
         <li><b>Provable regret guarantees.</b> The abstract proves "regret guarantees that are provably as
         good as the best proximal function that can be chosen in hindsight" &mdash; informally, the method
         does as well as if you had picked the perfect per-coordinate scaling in advance.</li>
       </ul>`,

    whyItMattered:
      `<p>Adagrad was the first widely-used <b>adaptive learning-rate</b> optimizer, and it set the template
       for everything after it. <b>RMSProp</b> replaced Adagrad's ever-growing sum of squared gradients with
       a moving average (so the learning rate stops decaying to zero), and <b>Adam</b> combined that moving
       average with momentum and a bias correction. The per-coordinate "divide the step by the recent
       gradient size" idea you see in every modern optimizer starts here. Adagrad itself is still a strong
       default for sparse problems like large linear text classifiers and embedding layers, where most
       features are rarely active.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Abstract</b> &mdash; the one-paragraph pitch: adapt the geometry to the data, find "very
         predictive but rarely seen features," simplify the learning rate.</li>
         <li><b>Section 1 (Introduction)</b> &mdash; the sparse / rare-feature motivation, and the key
         sentence about giving frequent features low rates and infrequent features high rates.</li>
         <li><b>Section 1.1 ("The Adaptive Gradient Algorithm")</b> &mdash; the notation and the update.
         The full-matrix update is given first; <b>eq. (1)</b> specializes it to the diagonal version that
         everyone actually uses, and <b>eq. (5)</b> defines the matrix
         $H_t=\\delta I+\\operatorname{diag}(G_t)^{1/2}$ with a small constant $\\delta$.</li>
         <li><b>Section 1.3.1 ("Diagonal Adaptation")</b> &mdash; the toy sparse example where Adagrad gets
         constant regret per coordinate while plain gradient descent can suffer arbitrarily large loss.</li>
       </ul>
       <p><b>Skim:</b> the regret theorems (Sections 5&ndash;7 and their corollaries) for the headline that
       the bound matches the best proximal function chosen in hindsight &mdash; you do not need the proofs.
       Section 6 (experiments) for the qualitative result that Adagrad beats non-adaptive baselines on
       sparse text/image tasks.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will minimize the same small, badly-conditioned least-squares
       loss (some input features scaled much larger than others) twice from the same start: once with plain
       <b>SGD</b>, once with <b>Adagrad</b>, each at a sensible learning rate. Will Adagrad reach a clearly
       lower loss in the same number of steps because it gives each parameter its own rate? And as training
       goes on, does each parameter's effective step <i>shrink</i> (because the accumulated squared gradient
       only grows)? Write down your guesses, then check the worked example and the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write a <code>MyAdagrad</code> optimizer over a list of
       parameter tensors, using only raw torch (no <code>torch.optim</code>). Keep one piece of
       per-parameter state: <code>G</code>, the running sum of squared gradients, starting at zeros. In
       <code>step()</code>, for each parameter <code>p</code> with gradient <code>g = p.grad</code>:</p>
       <ul>
         <li><code># TODO: G += g*g</code> &mdash; accumulate the squared gradient, element-wise (per coordinate).</li>
         <li><code># TODO: p -= lr * g / (sqrt(G) + eps)</code> &mdash; the per-parameter update. Do it under <code>torch.no_grad()</code>.</li>
       </ul>
       <p>Note the small constant <code>eps</code> goes <i>outside</i> the square root (that is what PyTorch
       does, and it plays the role of the paper's $\\delta$). The CODE cell below is the full reference,
       including the <code>torch.allclose</code> check against <code>torch.optim.Adagrad</code> &mdash; that
       passing check is the proof your formula is exactly PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Adagrad processes each parameter (coordinate) independently. For one coordinate $i$, at step $t$,
       with current gradient $g_{t,i}$:</p>
       <ol>
         <li><b>Accumulate squared gradients.</b> Keep a running sum of every squared gradient this
         coordinate has ever seen: $\\sum_{s=1}^{t} g_{s,i}^2$. This is the diagonal of the paper's outer-product
         matrix $G_t=\\sum_{\\tau=1}^{t} g_\\tau g_\\tau^{\\top}$; we only ever need its diagonal, so we store
         one number per coordinate. It only grows, never shrinks.</li>
         <li><b>Per-coordinate learning rate.</b> Divide the global rate $\\eta$ by the square root of that
         sum: the effective rate for coordinate $i$ is $\\eta/\\sqrt{\\sum_{s\\le t} g_{s,i}^2}$. A coordinate
         whose gradients have been large (a frequent, steep feature) has a big accumulated sum, so a small
         effective rate. A coordinate whose gradients have been small or rare (an infrequent feature) has a
         small sum, so a large effective rate &mdash; it "takes notice" each of the few times it is active.</li>
         <li><b>Step.</b> Move against the gradient with that per-coordinate rate:
         $x_{t+1,i}=x_{t,i}-\\eta\\,g_{t,i}/\\sqrt{\\sum_{s\\le t} g_{s,i}^2}$. A tiny constant $\\delta$
         (PyTorch's <code>eps</code>) is added to the denominator so we never divide by zero before a
         coordinate has any gradient history.</li>
       </ol>
       <p><b>Why divide by the accumulated size.</b> Early on, when a coordinate's accumulated sum is small,
       its steps are large; as it keeps seeing gradients, the sum grows and its steps automatically shrink &mdash;
       a built-in, per-coordinate learning-rate decay that you never have to schedule by hand. The flip side
       (which RMSProp and Adam later fix) is that because the sum <i>only grows</i>, every coordinate's rate
       eventually decays toward zero, so plain Adagrad can stall on very long runs.</p>`,

    symbols: [
      { sym: "$t$", desc: "the timestep / update counter, $t=1,2,3,\\dots$. It indexes the rounds of online or stochastic optimization." },
      { sym: "$i$", desc: "the coordinate (parameter) index: which single weight we are talking about. Adagrad treats each coordinate separately." },
      { sym: "$x_{t,i}$", desc: "the value of parameter (coordinate) $i$ at step $t$. $x_{t+1,i}$ is its value after the update. (The paper writes the parameter vector as $x$, not $\\theta$.)" },
      { sym: "$g_{t,i}$", desc: "the $i$-th entry of the (sub)gradient at step $t$: the slope of the step-$t$ loss with respect to coordinate $i$. $g_{t,i}^2$ is that entry squared (always non-negative)." },
      { sym: "$g_t$", desc: "the full gradient vector at step $t$; $g_{t,i}$ is its $i$-th entry. The paper allows a subgradient, written $g_t\\in\\partial f_t(x_t)$, for non-differentiable losses." },
      { sym: "$\\eta$", desc: "eta: the single global step size (learning rate). Unlike SGD it is not the actual per-coordinate rate — each coordinate divides it by its own accumulated gradient size." },
      { sym: "$G_t$", desc: "the outer-product matrix $G_t=\\sum_{\\tau=1}^{t} g_\\tau g_\\tau^{\\top}$ that accumulates gradient information. Diagonal Adagrad uses only its diagonal, $\\operatorname{diag}(G_t)_{ii}=\\sum_{s=1}^t g_{s,i}^2$." },
      { sym: "$\\operatorname{diag}(G_t)$", desc: "the diagonal of $G_t$ as a matrix (zeros off the diagonal). Its $i$-th diagonal entry is the running sum of squared gradients for coordinate $i$." },
      { sym: "$\\delta$", desc: "delta: a small fixed constant $\\ge 0$ added to the denominator (eq. (5)) so we never divide by zero. The paper notes it can be set to 0; in PyTorch this is the eps argument." },
      { sym: "$\\Pi_{\\mathcal{X}}$", desc: "projection onto the feasible set $\\mathcal{X}$ (it snaps a point back into the allowed region). For ordinary unconstrained training $\\mathcal{X}=\\mathbb{R}^d$, so this does nothing and we drop it." },
      { sym: "sparse", desc: "mostly zeros: a feature vector where only a few entries are non-zero on any given example (e.g. bag-of-words text)." },
      { sym: "regret", desc: "an online-learning score: how much worse your running total loss is than the single best fixed predictor chosen in hindsight. Lower is better; the paper proves Adagrad's grows slowly." }
    ],

    formula:
      `$$x_{t+1}=\\Pi_{\\mathcal{X}}^{\\operatorname{diag}(G_t)^{1/2}}\\Big(x_t-\\eta\\,\\operatorname{diag}(G_t)^{-1/2}\\,g_t\\Big)
        \\qquad\\text{(eq. (1), Section 1.1)}$$
       <p>Coordinate-by-coordinate, dropping the projection (unconstrained training) and adding the small
       constant $\\delta$ from eq. (5), this is:</p>
       $$x_{t+1,i}=x_{t,i}-\\frac{\\eta}{\\sqrt{\\sum_{s=1}^{t} g_{s,i}^2}\\;+\\;\\delta}\\;g_{t,i}.$$`,

    whatItDoes:
      `<p>The first line is the paper's eq. (1): it is ordinary gradient descent, except the step is
       pre-multiplied by $\\operatorname{diag}(G_t)^{-1/2}$ &mdash; that is, each coordinate's step is divided
       by the square root of its accumulated squared gradients. The second line writes the same thing one
       coordinate at a time, the way you actually code it. Reading it: take the usual step $-\\eta\\,g_{t,i}$,
       but shrink it by how much this coordinate's gradients have piled up so far. Big pile (steep / frequent
       coordinate) $\\Rightarrow$ small step; small pile (flat / rare coordinate) $\\Rightarrow$ large step.</p>`,

    derivation:
      `<p>The general "what is an optimizer / why per-coordinate learning rates" picture is owned by the
       <code>dl-optimizers</code> concept lesson &mdash; see it for SGD, momentum, and adaptive methods. Here
       is the one piece specific to Adagrad: <b>why the denominator is $\\sqrt{\\sum_s g_{s,i}^2}$</b> and not
       something else.</p>
       <p>The paper starts (Section 1.1) from a Mahalanobis-norm generalization of gradient descent: instead
       of measuring distance with the plain norm $\\lVert\\cdot\\rVert_2$, use a matrix $A$, giving the update
       $x_{t+1}=\\Pi_{\\mathcal{X}}^{A}(x_t-\\eta A^{-1}g_t)$. The question becomes: which matrix $A$? The
       regret analysis (Theorem 5 and Corollary 1) shows that the choice minimizing the bound is the one that
       makes $A\\propto G_t^{1/2}$, where $G_t=\\sum_{\\tau\\le t}g_\\tau g_\\tau^{\\top}$ accumulates the
       observed gradients. Because the full matrix root is too expensive in high dimensions (the paper's words
       just above eq. (1): "computationally impractical in high dimensions"), they specialize to the diagonal,
       $A=\\operatorname{diag}(G_t)^{1/2}$, which can be inverted and rooted in linear time.</p>
       <p>Taking the diagonal turns the matrix into one number per coordinate:
       $\\operatorname{diag}(G_t)_{ii}=\\sum_{s=1}^{t} g_{s,i}^2$. Its square root is $\\sqrt{\\sum_s g_{s,i}^2}$,
       and dividing the step by it is exactly the per-coordinate rule above. So the square-root-of-accumulated-
       squares denominator is not a heuristic &mdash; it is the diagonal of the proximal matrix that the regret
       bound says is optimal in hindsight. Eq. (5), $H_t=\\delta I+\\operatorname{diag}(G_t)^{1/2}$, just adds
       the small $\\delta$ so the matrix is invertible from step one.</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; one coordinate, two Adagrad steps, with $\\eta=0.1$, $\\delta\\approx0$,
       starting at $x_0=0$, and a constant gradient $g=2$ each step (so we can watch the step shrink):</p>
       <ul>
         <li><b>Step 1 ($t=1$).</b> Accumulate: $G_1=g^2=2^2=4$. Denominator: $\\sqrt{4}=2$.
         Step: $\\eta\\,g/\\sqrt{G_1}=0.1\\cdot 2/2=0.1$. Update: $x_1=0-0.1=-0.1$.</li>
         <li><b>Step 2 ($t=2$).</b> Accumulate: $G_2=4+2^2=8$. Denominator: $\\sqrt{8}\\approx2.8284$.
         Step: $0.1\\cdot 2/2.8284\\approx0.0707$. Update: $x_2=-0.1-0.0707=-0.1707$.</li>
       </ul>
       <p>The gradient never changed, but the step fell from $0.1$ to $0.0707$ &mdash; the accumulated sum grew
       from $4$ to $8$, so $\\sqrt{G}$ grew by $\\sqrt2$ and the step shrank by the same factor. That automatic,
       per-coordinate decay is Adagrad's signature. The CODE cell recomputes these exact numbers and prints
       them.</p>`,

    recipe:
      `<p><b>Diagonal Adagrad, as numbered steps</b> &mdash; initialize the accumulator $G_0=0$ (one entry per
       coordinate), then each update:</p>
       <ol>
         <li>$t \\leftarrow t+1$; get the gradient $g_t$ at the current parameters.</li>
         <li>Accumulate squared gradients, element-wise: $G_t = G_{t-1} + g_t\\odot g_t$ (here $\\odot$ means
         multiply entry-by-entry).</li>
         <li>Form the per-coordinate denominator: $\\sqrt{G_t}+\\delta$ (square root taken entry-by-entry).</li>
         <li>Update parameters: $x_{t,i}=x_{t-1,i}-\\eta\\,g_{t,i}/(\\sqrt{G_{t,i}}+\\delta)$ for every
         coordinate $i$.</li>
       </ol>`,

    results:
      `<p>Quoted from the abstract: Adagrad is "a new family of subgradient methods that dynamically incorporate
       knowledge of the geometry of the data observed in earlier iterations to perform more informative
       gradient-based learning," whose "adaptation allows us to find needles in haystacks in the form of very
       predictive but rarely seen features." The paper proves "regret guarantees that are provably as good as
       the best proximal function that can be chosen in hindsight," and the experiments "show that adaptive
       subgradient methods outperform state-of-the-art, yet non-adaptive, subgradient algorithms." (Source:
       Duchi, Hazan & Singer, JMLR 12 (2011) 2121&ndash;2159.) The CODEVIZ numbers below are our own small run,
       not the paper's reported results.</p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as <code>torch.optim.Adagrad</code> in one line. Here
       you <b>build it from scratch</b> with raw tensors: the per-coordinate accumulator $G$ and the
       $\\eta\\,g/(\\sqrt{G}+\\delta)$ update &mdash; all under <code>torch.no_grad()</code> so the optimizer's
       own arithmetic is not tracked by autograd. The payoff is the
       <code>torch.allclose(my_weights, adagrad_weights)</code> check after several steps &mdash; if it passes,
       your update is provably identical to PyTorch's. You still let autograd compute the gradients
       (<code>.backward()</code>); only the optimizer is hand-built.</p>`,

    pitfalls:
      `<ul>
         <li><b>$\\delta$/eps inside vs outside the square root.</b> PyTorch (and the paper's eq. (5)) add the
         constant to $\\sqrt{G_t}$: $g/(\\sqrt{G_t}+\\delta)$. Writing $g/\\sqrt{G_t+\\delta}$ instead changes
         the numbers and will break the allclose. Match PyTorch's placement.</li>
         <li><b>Wrong eps value.</b> <code>torch.optim.Adagrad</code>'s default eps is $10^{-10}$, not the
         $10^{-8}$ that Adam uses. If you copy Adam's eps, the allclose drifts. (Also note PyTorch's default
         <code>initial_accumulator_value</code> is 0; start $G$ at zeros.)</li>
         <li><b>Accumulating instead of averaging.</b> Adagrad <i>sums</i> squared gradients forever
         ($G_t=G_{t-1}+g_t^2$); it does not average them. If you accidentally use a moving average you have
         built RMSProp, not Adagrad, and the steps will not match.</li>
         <li><b>Not stepping under <code>torch.no_grad()</code>.</b> If the parameter update is recorded by
         autograd you corrupt the graph and leak memory. Wrap <code>step()</code> in <code>no_grad</code> and
         use in-place updates.</li>
         <li><b>Forgetting <code>zero_grad()</code>.</b> PyTorch <i>accumulates</i> gradients across
         <code>.backward()</code> calls; if you do not zero them each step, $g_t$ is wrong and so is $G_t$.</li>
         <li><b>Expecting it never to stall.</b> Because $G_t$ only grows, every coordinate's effective rate
         decays toward zero. On very long runs Adagrad slows to a crawl &mdash; the exact problem RMSProp and
         Adam fix with a moving average.</li>
       </ul>`,

    recall: [
      "State Adagrad's per-coordinate update from memory: $x_{t+1,i}=x_{t,i}-\\eta\\,g_{t,i}/(\\sqrt{\\sum_{s\\le t} g_{s,i}^2}+\\delta)$.",
      "What does the accumulator $G_t$ store, and what is its diagonal entry for coordinate $i$?",
      "Why does a rare (infrequently active) feature end up with a larger effective learning rate than a frequent one?",
      "Why does plain Adagrad eventually stall on long runs, and which two later optimizers fix it and how?"
    ],

    practice: [
      {
        q: `Take two coordinates over 30 steps. Coordinate A (frequent) has gradient 1 on every step; coordinate B (rare) has gradient 1 only on every 10th step (0 otherwise). With $\\eta=0.1$, what is each one's effective learning rate after 30 steps, and what does that show?`,
        steps: [
          { do: `Accumulate A: $G_A=\\sum 1^2$ over all 30 steps $=30$.`, why: `A is active every step.` },
          { do: `Accumulate B: $G_B=1^2\\cdot 3=3$ (active on steps 10, 20, 30).`, why: `B is active only 3 times.` },
          { do: `Effective rate A: $0.1/\\sqrt{30}\\approx0.0183$.`, why: `Big pile $\\Rightarrow$ small rate.` },
          { do: `Effective rate B: $0.1/\\sqrt{3}\\approx0.0577$.`, why: `Small pile $\\Rightarrow$ big rate.` }
        ],
        answer: `The rare coordinate B keeps an effective rate about $3\\times$ larger (0.0577 vs 0.0183). This is exactly the paper's claim: "frequently occurring features [get] very low learning rates and infrequent features high learning rates." Each of B's few updates "takes notice." The CODE cell prints these same two numbers.`
      },
      {
        q: `Why does Adagrad typically beat plain SGD on a badly-conditioned problem (some directions much steeper than others)?`,
        steps: [
          { do: `On steep directions, gradients are large, so $\\sqrt{G}$ is large and the step there shrinks.`, why: `Prevents overshoot/oscillation in steep directions.` },
          { do: `On flat directions, gradients are small, so $\\sqrt{G}$ is small and the step there stays large.`, why: `Keeps making progress where SGD would crawl.` },
          { do: `SGD must use one global rate that is safe for the steepest direction, so it crawls in the flat ones.`, why: `A single rate is a compromise.` }
        ],
        answer: `Adagrad normalizes each coordinate's step by that coordinate's accumulated gradient size, so it can take large steps in flat directions and small steps in steep ones at the same time. Plain SGD, with one rate, must keep that rate small enough for the steepest direction and therefore crawls in the flat ones. In our CODEVIZ run Adagrad reaches loss ~0.0001 vs SGD's ~0.11 in 60 steps.`
      },
      {
        q: `Ablation: in the CODE, replace the lifetime sum $G_t=G_{t-1}+g_t^2$ with a moving average $G_t=0.9\\,G_{t-1}+0.1\\,g_t^2$, then rerun the allclose against torch.optim.Adagrad. What happens, and what have you built?`,
        steps: [
          { do: `Swap the accumulate line from a sum to a decayed moving average.`, why: `That is no longer Adagrad's rule.` },
          { do: `Run the same 6 steps and call $\\texttt{torch.allclose}$.`, why: `PyTorch's Adagrad keeps the full sum.` },
          { do: `Note that the denominator $\\sqrt{G_t}$ no longer grows without bound.`, why: `The moving average forgets old gradients.` }
        ],
        answer: `The allclose returns False: a moving average gives a different denominator than the lifetime sum, so the steps diverge from $\\texttt{torch.optim.Adagrad}$. What you have built is essentially RMSProp &mdash; the moving-average fix that stops the learning rate from decaying to zero. This confirms two things: (1) Adagrad is specifically the <i>cumulative</i> sum, and (2) the cumulative sum is exactly why plain Adagrad stalls on long runs, which RMSProp was invented to fix.`
      }
    ]
  });

  window.CODE["paper-adagrad"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build diagonal Adagrad from scratch with raw torch: one per-parameter accumulator G (sum of squared ` +
      `gradients) and the update p -= lr*g/(sqrt(G)+eps), all under torch.no_grad(). Then prove it is ` +
      `identical to PyTorch by running 6 optimization steps with both MyAdagrad and torch.optim.Adagrad from ` +
      `the SAME start and checking torch.allclose. Then show per-coordinate adaptation (a rare feature keeps a ` +
      `bigger effective rate), and recompute the two-step worked example. Runs in Colab (torch is preinstalled).`,
    code: `import torch

torch.manual_seed(0)

class MyAdagrad:
    """Diagonal Adagrad from scratch — eq. (1)/(5) of Duchi, Hazan & Singer (2011).
       Update: x -= lr * g / (sqrt(sum of past g^2) + eps)."""
    def __init__(self, params, lr=1e-2, eps=1e-10):
        self.params = list(params)
        self.lr, self.eps = lr, eps
        self.G = [torch.zeros_like(p) for p in self.params]   # accumulator (init 0)

    @torch.no_grad()
    def step(self):
        for i, p in enumerate(self.params):
            g = p.grad
            self.G[i] = self.G[i] + g*g                       # G_t = G_{t-1} + g^2 (LIFETIME sum)
            p -= self.lr * g / (self.G[i].sqrt() + self.eps)  # eps OUTSIDE the sqrt (= paper's delta)

    def zero_grad(self):
        for p in self.params:
            if p.grad is not None:
                p.grad.zero_()

# ---- THE ORACLE: MyAdagrad must equal torch.optim.Adagrad over several steps ----
w_mine = torch.randn(5, 3, requires_grad=True)
w_ref  = w_mine.detach().clone().requires_grad_(True)        # identical start
opt_mine = MyAdagrad([w_mine], lr=1e-2)                       # lr=1e-2, eps=1e-10
opt_ref  = torch.optim.Adagrad([w_ref], lr=1e-2)             # same defaults: eps=1e-10, init_acc=0

X = torch.randn(20, 5); target = torch.randn(20, 3)
for _ in range(6):
    opt_mine.zero_grad()
    (((X @ w_mine) - target)**2).mean().backward(); opt_mine.step()
    opt_ref.zero_grad()
    (((X @ w_ref) - target)**2).mean().backward(); opt_ref.step()

print("allclose vs torch.optim.Adagrad after 6 steps:",
      torch.allclose(w_mine, w_ref, atol=1e-7))             # expect True
print("max abs diff:", (w_mine - w_ref).abs().max().item())  # ~0

# ---- per-coordinate adaptation: rare feature keeps a BIGGER effective rate ----
# coord A active every step (g=1); coord B active only every 10th step
eta, eps = 0.1, 1e-10
G = torch.zeros(2)
for t in range(1, 31):
    g = torch.tensor([1.0, 1.0 if t % 10 == 0 else 0.0])
    G += g*g
eff = eta / (G.sqrt() + eps)
print("accum G  (frequent, rare):", G.tolist())             # [30.0, 3.0]
print("eff lr   (frequent, rare):", [round(x,4) for x in eff.tolist()])  # [0.0183, 0.0577]

# ---- recompute the two-step worked example: x0=0, g=2, eta=0.1 ----
x = torch.zeros(1)
o = MyAdagrad([x], lr=0.1, eps=0.0)
for t in (1, 2):
    x.grad = torch.tensor([2.0])
    o.step()
    print(f"t={t}: G={o.G[0].item():.4f}  x={x.item():.6f}")  # t1: G=4, x=-0.1 ; t2: G=8, x=-0.170711`
  };

  window.CODEVIZ["paper-adagrad"] = {
    question: "Minimize the same small, badly-conditioned least-squares loss from the same start with plain SGD vs Adagrad (each at a sensible learning rate) — does Adagrad's per-coordinate step reach a much lower loss in the same number of steps?",
    charts: [
      {
        type: "line",
        title: "Training loss over steps: Adagrad vs plain SGD (same ill-conditioned problem, same start)",
        xlabel: "optimization step",
        ylabel: "loss (½ mean squared error)",
        series: [
          {
            name: "Adagrad (lr 0.5)",
            color: "#7ee787",
            points: [[0,16.5076],[3,1.4514],[6,0.1885],[9,0.0257],[12,0.0036],[15,0.0006],[18,0.0001],[21,0.0001],[24,0.0001],[27,0.0001],[30,0.0001],[33,0.0001],[36,0.0001],[39,0.0001],[42,0.0001],[45,0.0001],[48,0.0001],[51,0.0001],[54,0.0001],[57,0.0001],[59,0.0001]]
          },
          {
            name: "SGD (lr 0.04)",
            color: "#ff7b72",
            points: [[0,16.5076],[3,1.7342],[6,0.7277],[9,0.4069],[12,0.2889],[15,0.2401],[18,0.2158],[21,0.2006],[24,0.1891],[27,0.1794],[30,0.1707],[33,0.1628],[36,0.1555],[39,0.1488],[42,0.1424],[45,0.1365],[48,0.1309],[51,0.1257],[54,0.1207],[57,0.1161],[59,0.1131]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not the paper's reported numbers. Same toy least-squares problem with six input features scaled unevenly (×4 down to ×0.25) so it is badly conditioned (condition number ~277). SGD must keep its single learning rate small enough for the steepest direction, so it crawls in the flat ones and stalls near loss ~0.11. Adagrad gives each coordinate its own rate (η divided by the square root of that coordinate's accumulated squared gradients), so it drives the loss far lower — final ~0.0001, hundreds of times lower in the same 60 steps. Note Adagrad's own per-coordinate rates keep shrinking (G only grows), which is why on much longer runs it eventually slows — the issue RMSProp and Adam later fix.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# tiny ill-conditioned least-squares: features scaled unevenly -> one SGD lr struggles
N, D = 200, 6
scales = np.array([4.0, 3.0, 2.0, 1.0, 0.5, 0.25])
X = rng.normal(0, 1, (N, D)) * scales
w_true = rng.normal(0, 1, D)
y = X @ w_true + rng.normal(0, 0.01, N)

def loss_grad(w):
    r = X @ w - y
    return 0.5*np.mean(r**2), (X.T @ r)/N

def run_sgd(lr, steps=60):
    w = np.zeros(D); out = []
    for _ in range(steps):
        L, g = loss_grad(w); out.append(L); w -= lr*g
    return out

def run_adagrad(lr, steps=60, eps=1e-10):
    w = np.zeros(D); G = np.zeros(D); out = []
    for _ in range(steps):
        L, g = loss_grad(w); out.append(L)
        G += g*g                            # LIFETIME sum of squared gradients
        w -= lr*g/(np.sqrt(G)+eps)          # per-coordinate update
    return out

sgd  = run_sgd(lr=0.04)
ada  = run_adagrad(lr=0.5)
print("SGD     final loss:", round(sgd[-1], 4))    # ~0.1131
print("Adagrad final loss:", round(ada[-1], 4))    # ~0.0001`
  };
})();
