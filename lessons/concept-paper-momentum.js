/* Paper lesson — On the importance of initialization and momentum in deep learning
   (Sutskever, Martens, Dahl, Hinton, 2013).
   Grounded from the PMLR proceedings: metadata from proceedings.mlr.press/v28/sutskever13.html,
   method + equations from the official PDF (proceedings.mlr.press/v28/sutskever13.pdf), Section 2
   ("Momentum and Nesterov's Accelerated Gradient"), eqs. (1)-(2) classical momentum and (3)-(4) NAG,
   and Section 2.1 ("The Relationship between CM and NAG").
   Track A (primitive): build classical momentum (CM) and Nesterov accelerated gradient (NAG) from
   scratch with raw torch; VERIFY CM matches torch.optim.SGD(momentum=mu) with torch.allclose.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-momentum". */
(function () {
  window.LESSONS.push({
    id: "paper-momentum",
    title: "Momentum & Nesterov — On the importance of initialization and momentum in deep learning (2013)",
    tagline: "A velocity that accumulates across steps lets gradient descent rush down long shallow valleys and damp the side-to-side bouncing — and Nesterov's lookahead makes it more stable still.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Ilya Sutskever, James Martens, George Dahl, Geoffrey Hinton",
      org: "University of Toronto",
      year: 2013,
      venue: "ICML 2013 (PMLR v28, pp. 1139-1147)",
      citations: "",
      arxiv: "",
      url: "https://proceedings.mlr.press/v28/sutskever13",
      code: ""
    },

    conceptLink: "dl-optimizers",
    partOf: [],
    prereqs: ["dl-optimizers", "ml-gradient-descent", "pt-autograd", "pt-training-loop"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> Training a network means repeatedly nudging its weights downhill on a loss
       function. Plain <b>stochastic gradient descent (SGD)</b> &mdash; "stochastic" because the gradient
       (the slope of the loss with respect to each weight) is estimated from a small random
       <b>mini-batch</b> of data, not the whole dataset &mdash; just steps a fixed fraction of the gradient:
       <code>weight = weight - learning_rate * gradient</code>.</p>
       <p><b>What was broken.</b> On a badly <b>conditioned</b> loss surface &mdash; one that is much steeper
       in some directions than others, a long narrow "ravine" &mdash; plain SGD behaves badly. To avoid
       overshooting the steep <b>walls</b> it must use a tiny learning rate, but that same tiny rate makes it
       <i>crawl</i> along the shallow <b>floor</b> where it actually needs to travel far. The result is the
       classic zig-zag: lots of bouncing across the ravine, very little progress down it. At the time of this
       paper many people believed deep and recurrent networks simply could not be trained well by such
       first-order methods, and that you needed expensive second-order methods like Hessian-Free (HF)
       optimization. (Source: Introduction.)</p>`,

    contribution:
      `<p>The paper's headline claim is that <b>well-chosen initialization plus momentum</b> closes most of
       the gap to the heavy second-order methods on deep and recurrent nets. Its contributions (Introduction;
       Section 2):</p>
       <ul>
         <li><b>Momentum matters far more than people thought.</b> A careful <b>random initialization</b> plus
         <b>classical momentum (CM)</b> with a slowly increasing momentum schedule trains deep autoencoders
         and recurrent networks nearly as well as Hessian-Free optimization &mdash; first-order methods are
         not the bottleneck; bad initialization was.</li>
         <li><b>A clean account of momentum as accumulated velocity.</b> Momentum keeps a running
         <b>velocity</b> vector that builds up in directions of <i>persistent</i> descent and cancels out in
         directions that keep flipping sign &mdash; so it speeds up along the ravine floor and damps the
         wall-to-wall bouncing.</li>
         <li><b>Nesterov's Accelerated Gradient (NAG) as a small, more stable tweak of momentum.</b> NAG
         evaluates the gradient at a <b>lookahead</b> point (after the velocity carries you forward) instead of
         at the current point. The paper shows this lets NAG correct a bad velocity sooner, so it tolerates
         larger momentum and oscillates less (Section 2.1, Figure 1).</li>
       </ul>`,

    whyItMattered:
      `<p>This paper rehabilitated momentum for deep learning. Its "velocity" framing &mdash; especially the
       NAG lookahead &mdash; is the mental model behind the momentum term in nearly every modern optimizer,
       and <code>torch.optim.SGD(momentum=..., nesterov=...)</code> implements exactly these updates. The
       same accumulated-gradient idea is the <b>first moment</b> inside Adam and AdamW. The companion lesson
       <code>paper-nesterov</code> covers the original 1983 convex-optimization result that NAG comes from;
       this paper is what brought it into deep-net training.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
         <li><b>Section 2 ("Momentum and Nesterov's Accelerated Gradient")</b> &mdash; eqs. (1)&ndash;(2) define
         classical momentum, eqs. (3)&ndash;(4) define NAG. This is the whole mechanism in four short lines.</li>
         <li><b>Section 2.1 ("The Relationship between CM and NAG")</b> and <b>Figure 1</b> &mdash; the
         geometric picture of why NAG's lookahead gradient gives "a larger and more timely correction" to the
         velocity than CM, and is therefore "more tolerant of large values of $\\mu$".</li>
       </ul>
       <p><b>Skim:</b> the discussion of asymptotic convergence rates ($O(1/T)$ vs $O(1/T^2)$) &mdash; the
       practical point the paper makes is that the early "<b>transient phase</b>" of training, not the
       asymptotic rate, is what matters for deep nets. Skim the experiments (Sections 3&ndash;5) for the
       qualitative result that momentum + good init rivals Hessian-Free; do not memorize the exact numbers.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will minimize the same long, narrow "ravine" loss (a quadratic that
       is much steeper across than along) three times from the same start: <b>plain SGD</b> (momentum 0),
       <b>classical momentum</b> ($\\mu=0.9$), and <b>NAG</b> ($\\mu=0.9$), all at the same learning rate. Two
       questions: (1) Will momentum reach a much lower loss than plain SGD in the same number of steps, because
       its velocity accumulates along the shallow floor? (2) Compared with classical momentum, will NAG's
       lookahead gradient produce <i>less</i> side-to-side bouncing across the steep walls? Write your guesses,
       then check the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write a tiny optimizer that keeps a <b>velocity</b> tensor
       <code>v</code> (initialized to zeros) per parameter and supports both modes. For each parameter
       <code>p</code> with gradient <code>g</code>:</p>
       <ul>
         <li><b>Classical momentum (CM):</b> <code># TODO: v = mu*v - lr*g</code> then <code># TODO: p += v</code>
         &mdash; gradient measured at the current <code>p</code>.</li>
         <li><b>Nesterov (NAG):</b> measure the gradient at the <b>lookahead</b> point <code>p + mu*v</code>
         instead: <code># TODO: g_ahead = grad(p + mu*v)</code>, then <code># TODO: v = mu*v - lr*g_ahead</code>,
         then <code># TODO: p += v</code>.</li>
       </ul>
       <p>Do the updates under <code>torch.no_grad()</code>. The CODE cell below is the full reference,
       including the <code>torch.allclose</code> check that your classical-momentum update equals
       <code>torch.optim.SGD(momentum=mu)</code> step for step &mdash; that passing check is the proof your
       formula is exactly PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Both methods replace "step a bit of the gradient" with "keep a <b>velocity</b> and let it build up".
       Write $\\theta_t$ for the weights, $v_t$ for the velocity, $\\varepsilon$ for the learning rate, and
       $\\mu\\in[0,1]$ for the <b>momentum coefficient</b> (how much of last step's velocity you keep).</p>
       <ol>
         <li><b>Classical momentum (CM).</b> Each step, decay the old velocity by $\\mu$ and add a fresh step
         of size $\\varepsilon$ down the gradient: $v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t)$. Then move
         by the velocity: $\\theta_{t+1}=\\theta_t+v_{t+1}$ (eqs. 1&ndash;2). The gradient is taken at the
         current point $\\theta_t$.</li>
         <li><b>Why it speeds up along the floor.</b> Along a direction of <i>persistent</i> descent, every
         step adds the same-signed gradient, so the velocity <i>accumulates</i> &mdash; like a ball rolling
         downhill picking up speed. The paper notes a low-curvature direction's gradient changes slowly, so it
         "persists across iterations and [is] amplified" by momentum.</li>
         <li><b>Why it damps the bouncing.</b> Across a steep wall the gradient keeps flipping sign every step;
         the alternating contributions partly cancel inside the velocity, so the side-to-side motion is held
         in check instead of overshooting.</li>
         <li><b>Nesterov (NAG): look before you leap.</b> NAG keeps the same shape but evaluates the gradient
         <i>after</i> the velocity has carried you forward, at the lookahead point $\\theta_t+\\mu v_t$:
         $v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t+\\mu v_t)$, then $\\theta_{t+1}=\\theta_t+v_{t+1}$
         (eqs. 3&ndash;4). If $\\mu v_t$ is about to push you into a bad spot, the gradient there
         "will point back towards $\\theta_t$ more strongly," giving "a larger and more timely correction" to
         the velocity than CM (Section 2.1).</li>
       </ol>
       <p>That single difference &mdash; <b>where you measure the gradient</b>, at $\\theta_t$ (CM) versus at the
       lookahead $\\theta_t+\\mu v_t$ (NAG) &mdash; is the whole distinction. Both then add the new velocity to
       $\\theta_t$.</p>`,

    // ★ THE PROCEDURE, COMPONENT BY COMPONENT ★
    architecture:
      `<p>Momentum is not a new model &mdash; it is a small piece of <b>optimizer state</b> bolted onto plain
       gradient descent and a fixed five-step procedure run once per iteration. Here is the whole machine,
       component by component (Section 2, eqs. 1&ndash;4).</p>
       <ol>
         <li><b>The velocity vector $v_t$ (the one piece of state).</b> Alongside the parameters $\\theta_t$ the
         optimizer carries a second tensor $v_t$ of <i>exactly the same shape</i> &mdash; one velocity number
         per weight. It is initialized to all zeros ($v_0=0$) and, crucially, <b>persists across iterations</b>:
         it is never re-zeroed. It holds the optimizer's running "speed and direction", a decayed accumulation
         of every past gradient step, not the instantaneous gradient. The paper describes CM as a method that
         "accumulates a velocity vector in directions of persistent reduction in the objective across iterations."</li>
         <li><b>The momentum coefficient $\\mu$ (the decay knob).</b> A scalar in $[0,1]$ that says what
         fraction of the previous velocity survives into this step. Each iteration the old velocity is first
         scaled to $\\mu v_t$ before anything is added &mdash; so a single gradient's influence fades
         geometrically as $\\mu,\\mu^2,\\mu^3,\\dots$. At $\\mu=0$ no velocity survives and the whole procedure
         collapses to plain SGD; at $\\mu=0.9$ ninety percent carries over, giving an effective step of about
         $\\tfrac{1}{1-\\mu}=10\\times$ along a persistent direction.</li>
         <li><b>The learning rate $\\varepsilon$ (the gradient gain).</b> A scalar $\\varepsilon\\gt 0$ that scales
         how much of <i>this</i> step's gradient is injected into the velocity. In this paper $\\varepsilon$
         lives <i>inside</i> the velocity update ($-\\varepsilon\\nabla f$), so it never multiplies the parameter
         step directly; the parameter step is just "add the velocity".</li>
         <li><b>The gradient evaluation point (the ONE place CM and NAG differ).</b> Each step needs one
         gradient $\\nabla f$. <b>CM</b> evaluates it at the <i>current</i> parameters: $g=\\nabla f(\\theta_t)$
         &mdash; "where am I now". <b>NAG</b> first applies the decayed velocity to form the <b>lookahead</b>
         point $\\theta_t+\\mu v_t$ (a partial update toward where the velocity is about to carry you, in the
         paper's words "similar to $\\theta_{t+1}$ but missing the as yet unknown correction") and evaluates
         there: $g=\\nabla f(\\theta_t+\\mu v_t)$. The paper's reason (Section 2.1): if $\\mu v_t$ is about to
         overshoot, the gradient at the lookahead "will point back towards $\\theta_t$ more strongly than
         $\\nabla f(\\theta_t)$ does, thus providing a larger and more timely correction to $v_t$ than CM,"
         which is why NAG is "more tolerant of large values of $\\mu$." Everything else in the procedure is
         identical.</li>
         <li><b>The velocity update (decay then accumulate).</b> Combine the two scalars and the gradient into a
         new velocity: $v_{t+1}=\\mu v_t-\\varepsilon g$ (eq. 1 / eq. 3). Read it as "keep $\\mu$ of the old
         velocity, then push it $\\varepsilon$ further downhill". Along a direction of persistent descent the
         fresh $-\\varepsilon g$ keeps the same sign as the carried velocity, so they reinforce and $v$ grows;
         across an oscillating direction the sign flips and the terms partly cancel, so $v$ stays small.</li>
         <li><b>The parameter update (move by the velocity).</b> Finally step the weights by the brand-new
         velocity: $\\theta_{t+1}=\\theta_t+v_{t+1}$ (eq. 2 / eq. 4). Note it adds $v_{t+1}$, the velocity you
         just computed, not the old $v_t$ &mdash; the decay-and-accumulate happens <i>before</i> the move.</li>
       </ol>
       <p><b>Data flow per step.</b> The state $(\\theta_t, v_t)$ enters; you pick the evaluation point
       ($\\theta_t$ for CM, the lookahead $\\theta_t+\\mu v_t$ for NAG); compute one gradient $g$ there; fold it
       into the velocity $v_{t+1}=\\mu v_t-\\varepsilon g$; then move $\\theta_{t+1}=\\theta_t+v_{t+1}$; and hand
       the updated state $(\\theta_{t+1}, v_{t+1})$ to the next iteration. Exactly one gradient evaluation and
       two cheap vector operations per step, and exactly one extra tensor ($v$) of memory &mdash; the cost over
       plain SGD is tiny, which is the practical reason momentum is nearly free to add. In code this is a single
       loop body under <code>torch.no_grad()</code>: read <code>p</code> and the velocity buffer <code>v</code>,
       compute <code>g</code> (at <code>p</code>, or at <code>p + mu*v</code> for NAG), set
       <code>v = mu*v - lr*g</code>, then <code>p += v</code> &mdash; with the buffer surviving to the next
       iteration so the accumulation is never lost.</p>`,

    symbols: [
      { sym: "$\\theta_t$", desc: "theta: the parameter (weight) vector after step $t$; $\\theta_{t+1}$ is its value after the next update. In code this is the tensor you are optimizing." },
      { sym: "$v_t$", desc: "the velocity vector at step $t$: a running, decayed accumulation of past (negative) gradient steps. It is what carries the optimizer forward; it starts at zero." },
      { sym: "$\\mu$", desc: "mu: the momentum coefficient in $[0,1]$. It is the fraction of the previous velocity you keep each step. $\\mu=0$ recovers plain SGD; $\\mu=0.9$ keeps 90% of last step's velocity." },
      { sym: "$\\varepsilon$", desc: "epsilon: the learning rate (step size), $\\varepsilon\\gt 0$. It scales how much of the fresh gradient is added into the velocity each step." },
      { sym: "$\\nabla f(\\theta_t)$", desc: "the gradient of the objective $f$ at the point $\\theta_t$: the direction of steepest increase. We subtract it, so $-\\varepsilon\\nabla f$ is a downhill step." },
      { sym: "$\\nabla f(\\theta_t+\\mu v_t)$", desc: "the NAG lookahead gradient: the same gradient but measured at $\\theta_t+\\mu v_t$, the point you reach after applying the decayed velocity. This is the ONLY change from CM." },
      { sym: "$f(\\theta)$", desc: "the objective (loss) being minimized as a function of the weights $\\theta$. Lower is better." },
      { sym: "ravine / ill-conditioned", desc: "a loss surface much steeper in some directions (the walls) than others (the floor). Plain SGD bounces across the steep walls while crawling along the shallow floor." },
      { sym: "velocity", desc: "the accumulated, decayed sum of past downhill steps that momentum carries between iterations — the optimizer's 'speed and direction', not the instantaneous gradient." },
      { sym: "lookahead", desc: "in NAG, the point $\\theta_t+\\mu v_t$ you would reach by applying the decayed velocity before computing the gradient — 'look before you leap'." },
      { sym: "$\\lambda$", desc: "lambda: an eigenvalue of the loss's curvature (Hessian) along one eigen-direction — how steep the bowl is in that direction. Large $\\lambda$ = a steep wall, small $\\lambda$ = the shallow floor. Used in Theorem 2.1." },
      { sym: "$\\mu_{\\text{eff}}$", desc: "the effective momentum NAG uses along an eigen-direction, $\\mu(1-\\lambda\\varepsilon)$: smaller than $\\mu$ where curvature $\\lambda$ is high, which is how NAG self-damps the steep directions (Theorem 2.1)." },
      { sym: "$R$", desc: "the condition number of the curvature at the minimum: the ratio of the largest to the smallest eigenvalue. Large $R$ = a long narrow ravine; it is what makes plain SGD slow." },
      { sym: "$\\mu_{\\max}$", desc: "the cap on the momentum schedule in eq. (5); the experiments swept it over $\\{0.999,0.995,0.99,0.9,0\\}$ (with $0$ being plain SGD)." },
      { sym: "$t$", desc: "the iteration (step) index. In eq. (5) it indexes the parameter update; $\\lfloor t/250\\rfloor$ bumps the momentum every 250 updates." },
      { sym: "$T$", desc: "the total number of iterations, used in the convergence-rate bounds ($O(1/T)$, $O(1/T^2)$): how fast the loss falls as you run longer." },
      { sym: "$L$", desc: "the Lipschitz constant of the gradient $\\nabla f$ — a smoothness bound (roughly the largest curvature). It scales the deterministic part of the stochastic convergence rate." },
      { sym: "$\\sigma$", desc: "sigma: the standard deviation (noise) of the stochastic gradient estimate. The $\\sigma/\\sqrt{T}$ term dominates late in training and is the same for SGD and accelerated methods, erasing the asymptotic advantage." }
    ],

    formula:
      `$$\\textbf{Classical momentum (CM), eqs. (1)-(2):}\\quad
        v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t),\\qquad
        \\theta_{t+1}=\\theta_t+v_{t+1}$$
       <p>Eqs. (1)-(2), Section 2: keep a velocity, decay it by $\\mu$, subtract a learning-rate-sized gradient step taken AT the current point $\\theta_t$, then move by the velocity.</p>
       $$\\textbf{Nesterov accelerated gradient (NAG), eqs. (3)-(4):}\\quad
        v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t+\\mu v_t),\\qquad
        \\theta_{t+1}=\\theta_t+v_{t+1}$$
       <p>Eqs. (3)-(4), Section 2: identical to CM except the gradient is evaluated at the <b>lookahead</b> point $\\theta_t+\\mu v_t$ (after the decayed velocity is applied). The paper notes this is NAG "rewritten" into momentum form; it differs from CM "only in the precise update of the velocity vector $v$".</p>
       $$\\textbf{Velocity as a decayed sum of past gradients:}\\quad
        v_{t+1}=-\\varepsilon\\sum_{i=0}^{t}\\mu^{\\,t-i}\\,\\nabla f(\\theta_i)\\quad(\\text{from }v_0=0)$$
       <p>Unrolling eq. (1): the velocity is a geometrically weighted sum of all past gradients, amplified by about $\\tfrac{1}{1-\\mu}$ along directions of persistent descent.</p>
       $$\\textbf{Theorem 2.1 — NAG = CM with rescaled momentum:}\\quad
        \\mu_{\\text{eff}}=\\mu\\,(1-\\lambda\\varepsilon)$$
       <p>Theorem 2.1 (Section 2.1): on a positive-definite quadratic, along each eigen-direction NAG behaves exactly like CM but with an effective momentum $\\mu(1-\\lambda\\varepsilon)$, where $\\lambda$ is that direction's eigenvalue (curvature). So NAG automatically uses <i>smaller</i> momentum in high-curvature directions ($\\lambda$ large), which is what damps the oscillation; when $\\varepsilon\\lambda\\ll 1$ the two methods coincide.</p>
       $$\\textbf{Polyak acceleration:}\\quad
        \\mu=\\frac{\\sqrt{R}-1}{\\sqrt{R}+1}\\;\\Rightarrow\\;\\text{convergence in } \\sqrt{R}\\text{ times fewer iterations}$$
       <p>Section 2: Polyak (1964) showed CM with this $\\mu$ reaches a given accuracy in $\\sqrt{R}$ times fewer steps than steepest descent, where $R$ is the condition number at the minimum.</p>
       $$\\textbf{Momentum schedule, eq. (5):}\\quad
        \\mu_t=\\min\\!\\Big(1-2^{-1-\\log_2(\\lfloor t/250\\rfloor+1)},\\ \\mu_{\\max}\\Big),\\qquad
        \\mu_{\\max}\\in\\{0.999,0.995,0.99,0.9,0\\}$$
       <p>Eq. (5), Section 3: the "slowly increasing" momentum schedule used in the experiments — $\\mu$ rises toward $\\mu_{\\max}$ as training proceeds (it amounts to $\\mu_t\\approx 1-3/(t+5)$, following Nesterov 1983).</p>
       $$\\textbf{Convergence rates (smooth convex):}\\quad
        \\text{GD: }O(1/T),\\qquad \\text{NAG: }O(1/T^2)$$
       <p>Section 2: for general smooth (non-strongly) convex $f$ with deterministic gradients, NAG attains $O(1/T^2)$ versus gradient descent's $O(1/T)$. In the <b>stochastic</b> setting these rates become $O(L/T+\\sigma/\\sqrt{T})$ for SGD and $O(L/T^2+\\sigma/\\sqrt{T})$ for an accelerated method — equal once the noise term $\\sigma/\\sqrt{T}$ dominates, so the acceleration only helps in the early "transient phase".</p>`,

    whatItDoes:
      `<p>The first line (CM) says: shrink the old velocity to $\\mu v_t$, subtract a fresh learning-rate-sized
       step of the gradient <i>at the current point</i>, and move by the result. The second line (NAG) is
       identical except the gradient is measured at the <b>lookahead</b> point $\\theta_t+\\mu v_t$. Both
       accumulate a velocity that grows in directions of persistent descent and cancels in directions that
       keep reversing &mdash; so both rush down the shallow ravine floor while damping the wall-to-wall
       bouncing, and NAG's lookahead makes that damping quicker. These are transcribed from Section 2 of the
       paper; setting $\\mu=0$ in either reduces to plain SGD, $\\theta_{t+1}=\\theta_t-\\varepsilon\\nabla f(\\theta_t)$.</p>`,

    derivation:
      `<p>The general "what is an optimizer / what is gradient descent and momentum" picture is owned by the
       <code>dl-optimizers</code> concept lesson &mdash; see it for SGD, momentum, AdaGrad, RMSProp and Adam.
       Here is the one piece specific to this paper: <b>why a velocity accumulates in low-curvature directions
       and cancels in high-curvature ones</b>.</p>
       <p>Unroll the classical-momentum velocity from $v_0=0$. Substituting $v_{t}=\\mu v_{t-1}-\\varepsilon
       \\nabla f(\\theta_{t-1})$ repeatedly gives a decayed sum of all past gradients:</p>
       $$v_{t+1}=-\\varepsilon\\sum_{i=0}^{t}\\mu^{\\,t-i}\\,\\nabla f(\\theta_i).$$
       <p>Now read off the two regimes. Along a <b>low-curvature</b> direction (the ravine floor) the gradient
       barely changes from step to step, so all the terms $\\nabla f(\\theta_i)$ point the same way and the
       geometric sum amplifies them by roughly $\\frac{1}{1-\\mu}$ (with $\\mu=0.9$ that is a $10\\times$
       effective step). Along a <b>high-curvature</b> direction (a steep wall) the gradient flips sign almost
       every step, so consecutive terms have opposite signs and largely cancel in the sum &mdash; the
       oscillation is damped instead of amplified. That is exactly the paper's claim (Section 2) that
       low-curvature directions "persist across iterations and [are] amplified by CM," which is why momentum
       buys speed where plain SGD crawls without re-introducing the bouncing.</p>
       <p>NAG keeps this sum but, by evaluating each gradient at the lookahead $\\theta_t+\\mu v_t$ rather than
       at $\\theta_t$, makes the correction respond to where the velocity is <i>about</i> to take you &mdash;
       the full algebraic rewrite is in the paper's appendix (Section 2.1 states the result).</p>`,

    example:
      `<p><b>Worked numbers</b> &mdash; four classical-momentum steps on the simplest ravine-free objective so
       you can see the velocity build: $f(x)=\\tfrac12 x^2$, so $\\nabla f(x)=x$. Use $\\varepsilon=0.1$,
       $\\mu=0.9$, start at $x_0=1$, $v_0=0$. Each step is $v\\leftarrow\\mu v-\\varepsilon\\,g$ then
       $x\\leftarrow x+v$:</p>
       <ul>
         <li><b>Step 1:</b> $g=x_0=1$. $v_1=0.9\\cdot 0-0.1\\cdot 1=-0.1$. $x_1=1+(-0.1)=0.9$.</li>
         <li><b>Step 2:</b> $g=0.9$. $v_2=0.9\\cdot(-0.1)-0.1\\cdot 0.9=-0.09-0.09=-0.18$. $x_2=0.9-0.18=0.72$.</li>
         <li><b>Step 3:</b> $g=0.72$. $v_3=0.9\\cdot(-0.18)-0.1\\cdot 0.72=-0.162-0.072=-0.234$. $x_3=0.72-0.234=0.486$.</li>
         <li><b>Step 4:</b> $g=0.486$. $v_4=0.9\\cdot(-0.234)-0.1\\cdot 0.486=-0.2106-0.0486=-0.2592$. $x_4=0.486-0.2592=0.2268$.</li>
       </ul>
       <p>Watch the velocity grow in magnitude ($-0.1\\to-0.18\\to-0.234\\to-0.2592$) even as the gradient
       shrinks: that is the accumulation. Plain SGD ($\\mu=0$) would have moved only $-0.1\\cdot g$ each step,
       reaching $x_4\\approx 0.656$ &mdash; momentum is already at $0.2268$, much closer to the minimum at $0$.
       The CODE cell recomputes these exact numbers and prints them.</p>`,

    recipe:
      `<p><b>The two updates, as numbered steps</b> &mdash; initialize $v_0=0$, then each iteration:</p>
       <ol>
         <li><b>Classical momentum (CM):</b> compute the gradient $g=\\nabla f(\\theta_t)$ at the current point;
         set $v_{t+1}=\\mu v_t-\\varepsilon g$; set $\\theta_{t+1}=\\theta_t+v_{t+1}$.</li>
         <li><b>Nesterov (NAG):</b> compute the gradient at the lookahead point,
         $g=\\nabla f(\\theta_t+\\mu v_t)$; set $v_{t+1}=\\mu v_t-\\varepsilon g$; set
         $\\theta_{t+1}=\\theta_t+v_{t+1}$.</li>
         <li>Schedule (optional, from the paper): start $\\mu$ small and increase it toward a high value
         (e.g. up to $0.99$) over training &mdash; the "slowly increasing momentum schedule".</li>
       </ol>`,

    results:
      `<p>The paper reports (Introduction) that with a well-chosen random initialization and a momentum
       schedule, SGD with momentum &mdash; especially NAG &mdash; matches or nearly matches Hessian-Free
       optimization on deep autoencoder and recurrent-network tasks that were previously thought to require
       second-order methods. It argues that "previous attempts to train deep and recurrent neural networks
       from random initializations have likely failed due to poor initialization schemes" rather than a
       limitation of first-order methods (abstract/Introduction). (Source:
       proceedings.mlr.press/v28/sutskever13, ICML 2013.) The CODEVIZ numbers below are
       <b>our own small run, not the paper's reported results.</b></p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> Two things to measure on the ravine objective: the <b>loss after a
        fixed number of steps</b> (lower = faster descent down the shallow floor) and the <b>wall-direction
        swing</b> $\\max|x|$ after warm-up (smaller = less side-to-side bouncing across the steep walls). The
        "no-skill" baseline is <b>plain SGD ($\\mu=0$)</b>: momentum must reach a clearly lower loss in the same
        steps, or the velocity isn't accumulating. The paper's qualitative anchor (Introduction): momentum +
        good init <i>matches Hessian-Free</i> on deep autoencoder / recurrent tasks &mdash; the bar is "rivals
        second-order methods," not a single accuracy number.</p>
       <p><b>2. Sanity checks before the full run.</b></p>
       <ul>
        <li><b>The allclose oracle (the key check).</b> Run your from-scratch classical momentum next to
        <code>torch.optim.SGD(momentum=mu)</code> from the same start with the same gradients, and assert
        <code>torch.allclose</code> on $\\theta$ after several steps. If it passes, your CM update <i>is</i>
        PyTorch's &mdash; this is the unit test that proves eqs.&nbsp;(1)&ndash;(2) are correct.</li>
        <li><b>Known-answer worked example.</b> On $f(x)=\\tfrac12 x^2$ ($\\nabla f=x$), $\\varepsilon=0.1$,
        $\\mu=0.9$, $x_0=1$, $v_0=0$, assert the trajectory $x = 0.9000,\\,0.7200,\\,0.4860,\\,0.2268$ and watch
        the velocity grow in magnitude ($-0.1\\to-0.18\\to-0.234\\to-0.2592$) even as the gradient shrinks.</li>
        <li><b>$\\mu=0$ collapses to SGD.</b> Setting $\\mu=0$ in either CM or NAG must give exactly
        $\\theta_{t+1}=\\theta_t-\\varepsilon\\nabla f(\\theta_t)$ &mdash; a quick check the velocity term is
        wired in correctly.</li>
        <li><b>NAG caveat (don't expect a match).</b> The paper's lookahead form and PyTorch's
        <code>nesterov=True</code> buffer form are equivalent reparameterizations, <i>not</i> iterate-equal &mdash;
        compare final loss / trajectory shape, not a step-for-step allclose. Compare $\\theta$, never the raw
        velocity (the stored buffers differ by a factor $-\\varepsilon$).</li>
       </ul>
       <p><b>3. Expected range.</b> No single paper number to hit (the paper reports "rivals Hessian-Free"
        qualitatively). Judge by the <i>ordering</i>: classical momentum and NAG should both reach a far lower
        loss than plain SGD in the same steps, and NAG should bounce least. In our small ravine run, after 60
        steps: plain SGD ~0.637, CM ~0.0019 (over $300\\times$ lower), NAG ~0.0004, with the wall swing dropping
        from ~0.81 (CM) to ~0.26 (NAG), near plain SGD's ~0.22 (our numbers, not the paper's). Rule of thumb
        (not a paper claim): if momentum isn't beating SGD, your velocity is being re-zeroed each step.</p>
       <p><b>4. Ablation &mdash; prove momentum earns its keep.</b> The central idea is the <b>accumulated
        velocity</b>. Turn it OFF by setting $\\mu=0$ (no velocity survives) on the same ravine, same
        $\\varepsilon$, same start: the loss-after-$N$-steps must rise sharply &mdash; that gap <i>is</i> the
        velocity at work. A second knob: the <b>NAG lookahead</b> &mdash; switch the gradient evaluation from
        $\\theta_t$ to $\\theta_t+\\mu v_t$ and confirm the wall swing shrinks. If $\\mu=0$ and $\\mu=0.9$ give
        the same trajectory, the velocity buffer isn't persisting across steps.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Momentum no faster than SGD.</b> The velocity $v$ is being re-zeroed every step / mini-batch
        instead of carried as optimizer state &mdash; the accumulation is thrown away.</li>
        <li><b>allclose against SGD fails.</b> Either you compared the raw velocity (buffers differ by
        $-\\varepsilon$; compare $\\theta$) or the learning rate is in the wrong place &mdash; this paper puts it
        <i>inside</i> the velocity ($v=\\mu v-\\varepsilon g$), PyTorch scales at the parameter step.</li>
        <li><b>Loss diverges / oscillates and blows up.</b> Learning rate too high for the momentum &mdash;
        $\\mu=0.9$ multiplies the effective step by ~$\\tfrac{1}{1-\\mu}=10\\times$, so a rate fine for plain SGD
        now overshoots the steep walls. Lower $\\varepsilon$ or schedule $\\mu$ up slowly.</li>
        <li><b>NAG iterates don't match PyTorch.</b> Expected &mdash; equivalent reparameterizations, not the
        same recurrence. Only the <i>classical-momentum</i> allclose is the clean oracle.</li>
        <li><b>Raising $\\mu$ always seems to help, then suddenly diverges.</b> "More momentum is better" is
        false &mdash; too-large $\\mu$ overshoots; the paper schedules $\\mu$ and pairs it with good init.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships both updates as <code>torch.optim.SGD(momentum=mu)</code>
       and <code>torch.optim.SGD(momentum=mu, nesterov=True)</code>. Here you <b>build the velocity update
       from scratch</b> with a raw tensor &mdash; the decayed velocity and the parameter step &mdash; under
       <code>torch.no_grad()</code>. The payoff is the
       <code>torch.allclose(my_theta, sgd_theta)</code> check after several steps for classical momentum: if it
       passes, your update <i>is</i> PyTorch's. <b>One honest caveat on NAG:</b> the paper's eqs. (3)&ndash;(4)
       and PyTorch's <code>nesterov=True</code> are the same algorithm written in two different but equivalent
       parameterizations &mdash; PyTorch folds the lookahead into its momentum buffer rather than evaluating
       the gradient at $\\theta_t+\\mu v_t$. So the NAG iterates do <i>not</i> match step-for-step under a
       naive allclose, and the CODE flags this rather than faking a pass. The classical-momentum allclose is
       the clean oracle.</p>`,

    pitfalls:
      `<ul>
         <li><b>Where the learning rate goes.</b> This paper writes $v=\\mu v-\\varepsilon g$ (learning rate
         <i>inside</i> the velocity, then $\\theta+=v$). PyTorch writes its buffer as $b=\\mu b+g$ then
         $\\theta-=\\varepsilon b$. They give the <i>same</i> $\\theta$ trajectory, but the stored buffers
         differ by a factor of $-\\varepsilon$. Compare $\\theta$, not the raw velocity, or the allclose will
         confuse you.</li>
         <li><b>NAG parameterization mismatch.</b> Don't expect the paper's lookahead form to match PyTorch's
         <code>nesterov=True</code> iterate-for-iterate &mdash; they are equivalent reformulations, not the
         same recurrence. (See implementBoundary above.)</li>
         <li><b>Learning rate too high with high $\\mu$.</b> Momentum multiplies the effective step by roughly
         $\\frac{1}{1-\\mu}$ ($10\\times$ at $\\mu=0.9$). A learning rate that was fine for plain SGD can now
         overshoot and oscillate on the steep walls. The paper's fix is the slowly increasing $\\mu$ schedule;
         a quick fix is to lower $\\varepsilon$ when you raise $\\mu$.</li>
         <li><b>Velocity must persist across steps.</b> Re-zeroing $v$ every step (or every mini-batch) throws
         away the accumulation and reduces you to plain SGD. Keep $v$ as optimizer state.</li>
         <li><b>"More momentum is always better" is false.</b> Too-large $\\mu$ overshoots and can diverge; the
         paper's whole point is that $\\mu$ must be <i>scheduled</i> and paired with a good initialization.</li>
       </ul>`,

    recall: [
      "State classical momentum from memory: $v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t)$, $\\theta_{t+1}=\\theta_t+v_{t+1}$.",
      "State the NAG update and name the ONE place it differs from classical momentum.",
      "Define $\\mu$ and $\\varepsilon$, and say what $\\mu=0$ reduces the update to.",
      "Explain in words why momentum speeds up along a ravine floor but damps bouncing across the walls.",
      "What is the 'lookahead' point in NAG, and why does evaluating the gradient there give a more timely correction?"
    ],

    practice: [
      {
        q: `Do one classical-momentum step on $f(x)=\\tfrac12 x^2$ ($\\nabla f=x$) from $x_0=2$ with a velocity already at $v_0=-0.5$, using $\\varepsilon=0.1$, $\\mu=0.9$. Then say what plain SGD would have done from the same point.`,
        steps: [
          { do: `Gradient at the current point: $g=\\nabla f(2)=2$.`, why: `CM uses the gradient at $\\theta_t$.` },
          { do: `Velocity: $v_1=0.9\\cdot(-0.5)-0.1\\cdot 2=-0.45-0.2=-0.65$.`, why: `Decay old velocity, add the fresh step.` },
          { do: `Update: $x_1=2+(-0.65)=1.35$.`, why: `Move by the new velocity.` },
          { do: `Plain SGD ($\\mu=0$, no stored velocity) would move $x=2-0.1\\cdot 2=1.8$.`, why: `No accumulation.` }
        ],
        answer: `CM moves to $x_1=1.35$; plain SGD only reaches $1.8$. The carried-over velocity ($-0.5$) plus the fresh gradient step makes CM travel $0.65$ this step versus SGD's $0.2$. That extra distance is the accumulated velocity at work — exactly why momentum is faster along a consistent descent direction.`
      },
      {
        q: `Ablation: $\\mu=0$ vs $\\mu=0.9$. On the same ravine loss, why does $\\mu=0.9$ reach a far lower loss than $\\mu=0$ in the same number of steps — and what is the risk of pushing $\\mu$ even higher with the same learning rate?`,
        steps: [
          { do: `Set $\\mu=0$: the velocity is just $-\\varepsilon g$, i.e. plain SGD. It must keep $\\varepsilon$ tiny to not overshoot the steep walls, so it crawls along the shallow floor.`, why: `One small step size has to serve both directions.` },
          { do: `Set $\\mu=0.9$: along the floor the same-signed gradients accumulate, amplifying the effective step by about $\\frac{1}{1-0.9}=10\\times$; across the walls the sign-flipping gradients cancel.`, why: `Velocity amplifies persistent descent, damps oscillation.` },
          { do: `Push $\\mu\\to0.99$ at the same $\\varepsilon$: the effective step balloons (~$100\\times$) and can overshoot the walls.`, why: `Momentum and learning rate interact.` }
        ],
        answer: `With $\\mu=0.9$ the velocity accumulates down the long shallow floor where plain SGD ($\\mu=0$) crawls, so momentum reaches a much lower loss in the same steps. In our CODEVIZ run, after 60 steps classical momentum reaches loss ~0.0019 versus plain SGD's ~0.637 — over 300× lower. But too-large $\\mu$ at the same learning rate overshoots the steep walls and can diverge, which is why the paper schedules $\\mu$ up slowly rather than just maxing it out.`
      },
      {
        q: `Why does NAG bounce across the ravine walls less than classical momentum at the same $\\mu$ and $\\varepsilon$?`,
        steps: [
          { do: `CM computes the gradient at the current point $\\theta_t$, before the velocity has moved it.`, why: `It reacts to where you are.` },
          { do: `NAG first applies the decayed velocity to reach the lookahead $\\theta_t+\\mu v_t$, then takes the gradient there.`, why: `It reacts to where you are about to be.` },
          { do: `If $\\mu v_t$ is about to overshoot a wall, the gradient at the lookahead points back toward $\\theta_t$ more strongly, correcting $v$ sooner.`, why: `A larger and more timely correction (Section 2.1).` }
        ],
        answer: `NAG's lookahead lets it see the bad overshoot one step early and pull the velocity back before it happens, while CM only notices after stepping. The paper (Section 2.1, Figure 1) shows this makes NAG "more tolerant of large values of $\\mu$" with smaller oscillations. In our CODEVIZ run the wall-direction swing shrinks from ~0.81 (CM) to ~0.26 (NAG), close to plain SGD's ~0.22, while NAG still reaches the lowest loss of the three.`
      }
    ]
  });

  window.CODE["paper-momentum"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build the momentum velocity update from scratch with raw torch: classical momentum (CM) ` +
      `v = mu*v - lr*g; theta += v, and Nesterov (NAG) with the gradient at the lookahead theta + mu*v. ` +
      `THE ORACLE: run CM for several steps next to torch.optim.SGD(momentum=mu) from the SAME start and ` +
      `check torch.allclose on theta (expect True). For NAG we print the iterates and explain why the ` +
      `paper's lookahead form and PyTorch's nesterov=True buffer form are equivalent but not iterate-equal. ` +
      `Finally recompute the four-step worked example. Runs in Colab (torch is preinstalled).`,
    code: `import torch

torch.manual_seed(0)

# A simple quadratic objective f(theta) = 0.5 * theta^T A theta  ->  grad = A @ theta
A = torch.tensor([[3.0, 0.2],
                  [0.2, 1.0]])
theta0 = torch.tensor([1.5, -2.0])
mu, lr, steps = 0.9, 0.1, 6
def grad(theta): return A @ theta

# ---- Classical momentum from scratch: v = mu*v - lr*g ; theta += v  (paper eqs. 1-2) ----
@torch.no_grad()
def my_cm():
    theta = theta0.clone(); v = torch.zeros_like(theta)
    for _ in range(steps):
        g = grad(theta)
        v = mu*v - lr*g            # eq. (1): decay velocity, subtract lr*gradient AT theta
        theta = theta + v          # eq. (2): move by velocity
    return theta

# ---- Nesterov from scratch: gradient at the LOOKAHEAD theta + mu*v  (paper eqs. 3-4) ----
@torch.no_grad()
def my_nag():
    theta = theta0.clone(); v = torch.zeros_like(theta)
    for _ in range(steps):
        g = grad(theta + mu*v)     # eq. (3): gradient at the lookahead point
        v = mu*v - lr*g
        theta = theta + v          # eq. (4)
    return theta

# ---- THE ORACLE: classical momentum must equal torch.optim.SGD(momentum=mu) ----
p = torch.nn.Parameter(theta0.clone())
opt = torch.optim.SGD([p], lr=lr, momentum=mu)
for _ in range(steps):
    opt.zero_grad()
    p.grad = (A @ p.detach()).clone()   # same gradient A@theta
    opt.step()

mine = my_cm()
print("classical momentum, my theta:  ", mine.tolist())
print("torch.optim.SGD(momentum) theta:", p.detach().tolist())
print("allclose(CM, SGD) after", steps, "steps:",
      torch.allclose(mine, p.detach(), atol=1e-6))          # expect True
print("max abs diff:", (mine - p.detach()).abs().max().item())

# ---- NAG: paper's lookahead form vs PyTorch's nesterov buffer form (equivalent reparam.) ----
pn = torch.nn.Parameter(theta0.clone())
optn = torch.optim.SGD([pn], lr=lr, momentum=mu, nesterov=True)
for _ in range(steps):
    optn.zero_grad(); pn.grad = (A @ pn.detach()).clone(); optn.step()
print("\\nNAG my (lookahead) theta:", my_nag().tolist())
print("NAG torch nesterov theta:", pn.detach().tolist())
print("NOTE: these differ — PyTorch folds the lookahead into its momentum buffer (a different but",
      "equivalent parameterization), so the iterates are not step-for-step equal. CM is the clean oracle.")

# ---- recompute the worked example: f(x)=0.5 x^2, grad=x, lr=0.1, mu=0.9, x0=1, v0=0 ----
x, v = 1.0, 0.0
for t in range(1, 5):
    g = x; v = 0.9*v - 0.1*g; x = x + v
    print(f"worked step {t}: g={g:.4f}  v={v:.4f}  x={x:.4f}")
# expect x: 0.9000, 0.7200, 0.4860, 0.2268`
  };

  window.CODEVIZ["paper-momentum"] = {
    question: "Minimize the same long, narrow ravine loss from the same start with plain SGD (mu=0), classical momentum (mu=0.9), and NAG (mu=0.9) at the same learning rate — does momentum accelerate down the shallow floor, and does NAG damp the side-to-side bouncing across the steep walls?",
    charts: [
      {
        type: "line",
        title: "Loss down a ravine: plain SGD vs classical momentum vs NAG (same start, same lr)",
        xlabel: "optimization step",
        ylabel: "loss  f = ½(8·x² + 0.4·y²)",
        series: [
          {
            name: "plain SGD (mu 0)",
            color: "#ff7b72",
            points: [[0,11.2],[5,5.9071],[10,4.8069],[15,3.9275],[20,3.209],[25,2.622],[30,2.1424],[35,1.7505],[40,1.4303],[45,1.1686],[50,0.9549],[55,0.7802],[60,0.6375]]
          },
          {
            name: "classical momentum (mu 0.9)",
            color: "#79c0ff",
            points: [[0,11.2],[5,6.1684],[10,1.747],[15,0.542],[20,0.7445],[25,0.6489],[30,0.2495],[35,0.0208],[40,0.0183],[45,0.0537],[50,0.0404],[55,0.0119],[60,0.0019]]
          },
          {
            name: "NAG (mu 0.9)",
            color: "#7ee787",
            points: [[0,11.2],[5,4.2823],[10,0.8317],[15,0.0013],[20,0.2727],[25,0.3433],[30,0.1584],[35,0.0216],[40,0.0018],[45,0.0163],[50,0.0156],[55,0.0058],[60,0.0004]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, deterministic), not the paper's reported numbers. Ravine loss f = ½(8·x² + 0.4·y²): steep across x (the walls), shallow along y (the floor), started far out along the floor at (1, 6) with learning rate 0.05. Plain SGD must keep its step small for the steep x-wall, so it crawls down the long y-floor and is still at loss ~0.637 after 60 steps. Classical momentum accumulates velocity down the floor and reaches ~0.0019 — over 300× lower. NAG reaches ~0.0004 AND oscillates less across the walls: peak |x| after warm-up is ~0.26 for NAG vs ~0.81 for classical momentum (plain SGD ~0.22), matching the paper's claim (Section 2.1, Fig. 1) that NAG's lookahead damps the bouncing.",
    code: `import numpy as np

# ravine: steep across x (walls), shallow along y (floor)
a, b = 8.0, 0.4
def f(p):    return 0.5*(a*p[0]**2 + b*p[1]**2)
def grad(p): return np.array([a*p[0], b*p[1]])

lr, mu, steps = 0.05, 0.9, 60
start = np.array([1.0, 6.0])          # near the wall on x, far out on the shallow floor y

def run(mu, nesterov=False):
    p = start.copy(); v = np.zeros(2)
    loss = [f(p)]; xs = [p[0]]
    for _ in range(steps):
        g = grad(p + mu*v) if nesterov else grad(p)   # NAG: gradient at the lookahead
        v = mu*v - lr*g                                # v = mu*v - lr*g
        p = p + v                                      # theta += v
        loss.append(f(p)); xs.append(p[0])
    return np.array(loss), np.array(xs)

l_sgd, _      = run(0.0)              # plain SGD (mu = 0)
l_cm,  x_cm   = run(mu)               # classical momentum
l_nag, x_nag  = run(mu, nesterov=True)

print("final loss  -> SGD: %.4f  CM: %.4f  NAG: %.4f" % (l_sgd[-1], l_cm[-1], l_nag[-1]))
print("wall swing (max|x| after warm-up) -> CM: %.3f  NAG: %.3f" %
      (np.max(np.abs(x_cm[3:])), np.max(np.abs(x_nag[3:]))))
# final loss -> SGD: 0.6375  CM: 0.0019  NAG: 0.0004
# wall swing -> CM: 0.810  NAG: 0.260`
  };
})();
