/* Paper lesson — Nesterov's Accelerated Gradient: "A method for solving the convex programming
   problem with convergence rate O(1/k^2)" (Nesterov, 1983). No arXiv (Russian Doklady original).
   GROUNDED method/equations from the readable restatement in Sutskever, Martens, Dahl & Hinton,
   "On the importance of initialization and momentum in deep learning" (PMLR v28, 2013), Section 2 &
   2.1 — eqs (1)-(4) and Figure 1, which give NAG in the look-ahead momentum form that maps directly
   to torch.optim.SGD(nesterov=True). The O(1/k^2) vs O(1/k) rate is grounded from that paper (Sec 2)
   and cross-checked against the Nesterov-acceleration statement on the Wikipedia "Gradient descent"
   article (O(k^-1) for GD vs O(k^-2) with Nesterov acceleration).
   Track A (primitive): build NAG from scratch with raw torch, verify torch.allclose vs
   torch.optim.SGD(momentum, nesterov=True) over several steps. Cross-links paper-momentum (heavy ball).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-nesterov". */
(function () {
  window.LESSONS.push({
    id: "paper-nesterov",
    title: "Nesterov Accelerated Gradient — A method for convex minimization with rate O(1/k²) (1983)",
    tagline: "Look one momentum step ahead before measuring the slope — and a smooth convex problem's error falls like 1/k² instead of gradient descent's 1/k.",
    module: "Papers · Foundations & Optimization",
    track: "primitive",

    paper: {
      authors: "Yurii E. Nesterov",
      org: "Central Economic Mathematical Institute, USSR Academy of Sciences",
      year: 1983,
      venue: "Doklady Akademii Nauk SSSR (Soviet Mathematics Doklady), 1983 — Russian original, no arXiv",
      citations: "",
      // No arXiv. paper.url is the readable source these notes are grounded from:
      // the look-ahead-momentum restatement of NAG in Sutskever et al. 2013, Section 2.
      url: "https://proceedings.mlr.press/v28/sutskever13.pdf",
      code: ""
    },

    conceptLink: "dl-optimizers",
    partOf: [],
    prereqs: ["dl-optimizers", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p><b>The setup.</b> To minimize a loss you repeatedly step downhill: each step moves the
       parameters a little way along the negative <b>gradient</b> (the slope of the loss — the direction
       and steepness of steepest increase, so its negative points downhill). For a <b>smooth convex</b>
       problem — "convex" = bowl-shaped with a single global minimum, "smooth" = the gradient itself
       cannot change arbitrarily fast (it is <b>$L$-Lipschitz</b>, meaning the slope changes by at most
       $L$ times how far you moved) — plain <b>gradient descent (GD)</b> drives the gap to the minimum
       value down at a rate of about $1/k$ after $k$ steps.</p>
       <p><b>What was broken.</b> That $1/k$ rate is slow: to cut the error in half you need to roughly
       double the number of steps. The question Nesterov answered in 1983 was whether a method that uses
       <i>only</i> the gradient (a "first-order" method, no expensive second derivatives) can do
       fundamentally better than $1/k$. The surprising answer: yes — with the right way of carrying
       <b>momentum</b> (reusing the direction of recent steps), the error falls like $1/k^2$, which is
       provably the best any first-order method can achieve on this problem class.</p>`,

    contribution:
      `<p>Nesterov introduced an <b>accelerated</b> first-order method. Its contributions:</p>
       <ul>
         <li><b>A momentum-with-look-ahead update.</b> Instead of measuring the gradient at the current
         point, it first takes the momentum step to a <i>look-ahead</i> point and measures the gradient
         <i>there</i>. This small change is what makes the difference (grounded in Sutskever et al. 2013,
         Section 2.1, eqs. (3)–(4)).</li>
         <li><b>An $O(1/k^2)$ convergence guarantee.</b> For general smooth (non-strongly) convex
         functions with a deterministic gradient, the method reaches a global rate of $O(1/k^2)$ — a
         quadratic improvement over gradient descent's $O(1/k)$ (Sutskever et al. 2013, Section 2,
         attributing the rate to Nesterov 1983).</li>
         <li><b>Optimality.</b> $O(1/k^2)$ matches the known lower bound for first-order methods on
         smooth convex problems, so no gradient-only method can be asymptotically faster.</li>
       </ul>`,

    whyItMattered:
      `<p>Nesterov's method is the theoretical backbone of "acceleration" in optimization, and its
       practical form — <b>Nesterov Accelerated Gradient (NAG)</b> — is shipped today as
       <code>torch.optim.SGD(momentum=μ, nesterov=True)</code> and is a sibling of the momentum inside
       Adam. The deep-learning community rediscovered it: Sutskever, Martens, Dahl &amp; Hinton (2013)
       showed that NAG-style momentum, with a good schedule, trains deep networks far better than plain
       SGD — see the cross-linked <code>paper-momentum</code> lesson (Sutskever et al. 2013), which is
       where the look-ahead restatement used here comes from.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>The 1983 original is a terse two-page Russian Doklady note with no online full text, so these
       notes are grounded from a modern readable restatement: <b>Sutskever, Martens, Dahl &amp; Hinton,
       "On the importance of initialization and momentum in deep learning" (PMLR 2013)</b>, which gives
       NAG in look-ahead-momentum form. Read closely:</p>
       <ul>
         <li><b>Section 2 ("Momentum and Nesterov's Accelerated Gradient")</b> — classical momentum
         eqs. (1)–(2), the NAG look-ahead eqs. (3)–(4), and the sentence stating NAG's $O(1/T^2)$ rate
         "versus the $O(1/T)$ of gradient descent."</li>
         <li><b>Figure 1</b> — the two vector diagrams contrasting classical momentum (gradient at the
         current point) with NAG (gradient at the look-ahead point $\\theta_t+\\mu v_t$).</li>
         <li><b>Section 2.1 ("The Relationship between CM and NAG")</b> — why look-ahead lets NAG correct
         a bad velocity "in a quicker and more responsive" way than classical momentum.</li>
       </ul>
       <p><b>Skim:</b> the deep-autoencoder experiments (Section 3) — the qualitative point is that
       NAG tolerates a larger momentum $\\mu$ without oscillating.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p><b>Guess before you run.</b> You will minimize the same smooth convex quadratic (a bowl
       $f(x)=\\tfrac12 x^\\top A x$) from the same start, once with plain <b>gradient descent</b> and once
       with <b>Nesterov accelerated gradient</b>. After many steps, will the gap between their errors
       <i>grow</i> with $k$ (because $1/k^2$ pulls away from $1/k$), or stay a constant factor? And in the
       ablation: heavy-ball momentum measures the gradient at the current point; NAG measures it at the
       look-ahead point — with the <i>same</i> momentum and learning rate, which one settles faster?
       Write your guesses, then check the CODEVIZ chart.</p>`,

    attempt:
      `<p><b>Implement before the reveal.</b> Write a <code>MyNesterovSGD</code> optimizer over a list of
       parameter tensors using only raw torch (no <code>torch.optim</code>). Keep a velocity buffer
       <code>buf</code> per parameter. To match PyTorch exactly, use its algebraic form of the look-ahead.
       In <code>step()</code>, for each parameter <code>p</code> with gradient <code>g = p.grad</code> and
       momentum <code>mu</code>:</p>
       <ul>
         <li><code># TODO: buf = mu*buf + g</code> &mdash; accumulate the velocity buffer (first step: <code>buf = g</code>).</li>
         <li><code># TODO: d = g + mu*buf</code> &mdash; the Nesterov look-ahead gradient direction.</li>
         <li><code># TODO: p -= lr * d</code> &mdash; the parameter update, under <code>torch.no_grad()</code>.</li>
       </ul>
       <p>The CODE cell is the full reference, including the
       <code>torch.allclose(mine, SGD(nesterov=True))</code> check — that passing check is the proof your
       update is exactly PyTorch's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from <b>classical momentum (CM)</b>, also called heavy-ball (Polyak 1964), which the
       <code>paper-momentum</code> lesson covers. It keeps a velocity vector $v$ (a running, decayed sum
       of past gradient steps) and, at point $\\theta_t$ (eqs. (1)–(2) of Sutskever et al. 2013):</p>
       <ol>
         <li><b>Update velocity from the gradient at the current point.</b>
         $v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t)$. Here $\\mu\\in[0,1)$ is the momentum
         coefficient (how much past velocity to keep) and $\\varepsilon$ is the learning rate.</li>
         <li><b>Step by the new velocity.</b> $\\theta_{t+1}=\\theta_t+v_{t+1}$.</li>
       </ol>
       <p><b>Nesterov's twist (the look-ahead).</b> NAG changes <i>only one thing</i>: it evaluates the
       gradient not at $\\theta_t$ but at the point you would reach by first applying the momentum,
       $\\theta_t+\\mu v_t$ (eqs. (3)–(4)):</p>
       <ol>
         <li><b>Look ahead, then measure the slope there.</b>
         $v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t+\\mu v_t)$.</li>
         <li><b>Step by the new velocity.</b> $\\theta_{t+1}=\\theta_t+v_{t+1}$.</li>
       </ol>
       <p><b>Why it helps (Section 2.1).</b> If the momentum step $\\mu v_t$ is about to overshoot — to
       carry you to a place where $f$ <i>increases</i> — then $\\nabla f(\\theta_t+\\mu v_t)$ already
       points back, so it corrects the velocity <i>before</i> the bad step is committed. Classical
       momentum only sees the slope at the old point $\\theta_t$ and reacts a step too late. That earlier,
       more responsive correction is what lets NAG use a larger $\\mu$ without oscillating — and, on
       smooth convex problems, accelerates the error from $1/k$ to $1/k^2$.</p>`,

    architecture:
      `<p>NAG is an <b>optimizer</b>, so its "architecture" is a per-iteration procedure, not a network. State
       carried between steps: the parameter vector $\\theta$ and one <b>velocity buffer</b> $v$ (same shape as
       $\\theta$), initialized $v_0=0$. Two fixed scalars: learning rate $\\varepsilon$ and momentum $\\mu$.</p>
       <p><b>Look-ahead form (the conceptual procedure, eqs. (3)-(4)) — each step $t$:</b></p>
       <ol>
         <li><b>Look ahead:</b> $\\tilde\\theta = \\theta_t + \\mu v_t$ — advance by the decayed velocity only.</li>
         <li><b>Measure the slope there:</b> $g = \\nabla f(\\tilde\\theta)$ — a fresh gradient at the look-ahead point.</li>
         <li><b>Update velocity:</b> $v_{t+1} = \\mu v_t - \\varepsilon g$ — decay old velocity, subtract the scaled gradient.</li>
         <li><b>Step parameters:</b> $\\theta_{t+1} = \\theta_t + v_{t+1}$.</li>
       </ol>
       <p><b>PyTorch buffer form (the data flow actually shipped) — each step $t$:</b> the gradient is taken at the
       <i>current</i> $\\theta_t$ (so the model is evaluated only once per step), and the look-ahead is folded into the
       buffer arithmetic:</p>
       <ol>
         <li>$g = \\nabla f(\\theta_t)$ — one backward pass at the current parameters.</li>
         <li>$b \\leftarrow \\mu b + g$ — update the velocity buffer (on step 1, $b \\leftarrow g$).</li>
         <li>$d = g + \\mu b$ — combine current gradient with the decayed buffer (this is the look-ahead, algebraically).</li>
         <li>$\\theta \\leftarrow \\theta - \\varepsilon d$ — single in-place parameter step under <code>no_grad()</code>.</li>
       </ol>
       <p>The two forms produce identical $\\theta$ trajectories; the buffer form is preferred because it needs only one
       gradient evaluation per step. Per parameter tensor the optimizer stores exactly one buffer, so memory overhead is
       1× the parameter count — the same as classical momentum.</p>`,

    symbols: [
      { sym: "$\\theta_t$", desc: "theta: the parameter (weight) vector at step $t$. $\\theta_{t+1}$ is its value after the update." },
      { sym: "$v_t$", desc: "the velocity vector at step $t$: a decayed running sum of past update directions, i.e. accumulated momentum." },
      { sym: "$\\mu$", desc: "mu: the momentum coefficient in $[0,1)$ (e.g. 0.9). How much of the previous velocity to keep; larger = longer memory / more inertia." },
      { sym: "$\\varepsilon$", desc: "epsilon: the learning rate (step size). In the convergence analysis a safe choice is $1/L$." },
      { sym: "$\\nabla f(\\cdot)$", desc: "the gradient of the loss $f$ at a point: the direction of steepest increase. Its negative is downhill. The argument says WHERE it is measured." },
      { sym: "$\\theta_t+\\mu v_t$", desc: "the LOOK-AHEAD point: where the pure momentum step would land. NAG measures the gradient here, not at $\\theta_t$." },
      { sym: "$L$", desc: "the Lipschitz constant of the gradient ('smoothness'): the gradient changes by at most $L$ times how far you move. Bigger $L$ = more curved bowl." },
      { sym: "$k$", desc: "the iteration / step number. Convergence rates are stated as a function of $k$ (or $T$): how the error shrinks as $k$ grows." },
      { sym: "convex", desc: "bowl-shaped: any chord lies above the surface, so there is a single global minimum and no false local minima." },
      { sym: "$O(1/k^2)$", desc: "'order 1 over k squared': after $k$ steps the gap to the minimum value is at most a constant times $1/k^2$. Compare GD's $O(1/k)$." },
      { sym: "$f^\\star$", desc: "the minimum value of the loss $f$ (its value at the optimum). The 'error' being bounded is $f(\\theta_k)-f^\\star$, how far above the best value you still are." },
      { sym: "$\\theta^\\star$", desc: "a minimizer: a parameter vector achieving $f(\\theta^\\star)=f^\\star$. $\\lVert\\theta_0-\\theta^\\star\\rVert$ is the start-to-solution distance in the rate constant." },
      { sym: "$b_t$", desc: "PyTorch's velocity buffer at step $t$ (written $b$ to distinguish from $v$): related to $v$ but stored in the algebraically-equivalent buffer form $b\\leftarrow\\mu b+g$." },
      { sym: "$d_t$", desc: "the combined update direction in the buffer form, $d=\\nabla f(\\theta_t)+\\mu b_{t+1}$; the parameters move by $-\\varepsilon d_t$." },
      { sym: "$T$", desc: "the total number of iterations (used interchangeably with $k$ in the paper's rate statements $O(1/T)$, $O(1/T^2)$)." },
      { sym: "$\\sigma$", desc: "sigma: the variance (noise level) of the stochastic gradient estimate. It drives the $\\sigma/\\sqrt T$ term that acceleration cannot improve." }
    ],

    formula:
      `$$\\textbf{Classical momentum (CM), eqs. (1)-(2):}\\qquad
        v_{t+1}=\\mu v_t-\\varepsilon\\,\\nabla f(\\theta_t),\\qquad
        \\theta_{t+1}=\\theta_t+v_{t+1}$$
       <p>Heavy-ball (Polyak 1964): build a velocity from the gradient <i>at the current point</i> $\\theta_t$, then step.</p>
       $$\\textbf{Nesterov accelerated gradient (NAG), eqs. (3)-(4):}\\qquad
        v_{t+1}=\\mu v_t-\\varepsilon\\,\\nabla f(\\theta_t+\\mu v_t),\\qquad
        \\theta_{t+1}=\\theta_t+v_{t+1}$$
       <p>The <b>only</b> change vs CM: the gradient is measured at the <b>look-ahead point</b> $\\theta_t+\\mu v_t$ — where the pure momentum step would land — not at $\\theta_t$.</p>
       $$\\textbf{PyTorch buffer form (algebraically equal to (3)-(4)):}\\qquad
        b_{t+1}=\\mu b_t+\\nabla f(\\theta_t),\\qquad
        d_t=\\nabla f(\\theta_t)+\\mu b_{t+1},\\qquad
        \\theta_{t+1}=\\theta_t-\\varepsilon\\,d_t$$
       <p>How <code>torch.optim.SGD(nesterov=True)</code> implements the same update with one velocity buffer $b$, without a second model evaluation at the look-ahead point.</p>
       $$\\textbf{Convergence (smooth convex), Nesterov 1983:}\\qquad
        f(\\theta_k)-f^\\star \\;\\le\\; \\frac{2L\\,\\lVert\\theta_0-\\theta^\\star\\rVert^2}{(k+1)^2}
        \\;=\\; O\\!\\left(\\tfrac{1}{k^2}\\right)
        \\qquad\\text{vs. GD: } O\\!\\left(\\tfrac{1}{k}\\right)$$
       <p>NAG's error falls like $1/k^2$ — a quadratic speedup over gradient descent's $1/k$ — with constant set by the smoothness $L$ and the squared distance from start to solution (Sutskever et al. 2013, §2, attributing the rate to Nesterov 1983).</p>
       $$\\textbf{Stochastic rates (Sutskever et al. 2013, §2):}\\qquad
        \\text{SGD: } O\\!\\left(\\tfrac{L}{T}+\\tfrac{\\sigma}{\\sqrt T}\\right),\\qquad
        \\text{accelerated (Lan 2010): } O\\!\\left(\\tfrac{L}{T^2}+\\tfrac{\\sigma}{\\sqrt T}\\right)$$
       <p>With gradient noise of variance $\\sigma$ the acceleration only helps the early $L/T$ term; the $\\sigma/\\sqrt T$ noise term is identical, so the asymptotic advantage is lost.</p>`,

    whatItDoes:
      `<p>Both methods build a velocity by blending old velocity (scaled by $\\mu$) with a downhill push
       (scaled by $\\varepsilon$), then move by that velocity. The <b>only</b> difference is the argument
       of the gradient: CM measures it at the current point $\\theta_t$; NAG measures it at the look-ahead
       point $\\theta_t+\\mu v_t$ — after the momentum part of the step. These are eqs. (1)–(2) and
       (3)–(4) of Sutskever et al. 2013, who attribute the accelerated method to Nesterov (1983). On a
       smooth convex objective, that look-ahead is exactly what upgrades the error rate from $O(1/k)$ to
       $O(1/k^2)$.</p>`,

    derivation:
      `<p>The general "what is an optimizer / what is momentum / what is a learning rate" picture is owned
       by the <code>dl-optimizers</code> concept lesson — see it for SGD and the heavy-ball intuition.
       Here is the one piece specific to Nesterov: <b>why look-ahead beats current-point momentum</b>
       (Sutskever et al. 2013, Section 2.1), and what the $O(1/k^2)$ claim means.</p>
       <p><b>The look-ahead is a more timely correction.</b> Suppose adding $\\mu v_t$ would carry you to a
       place where $f$ is rising — a bad velocity. CM computes its gradient correction at $\\theta_t$,
       which knows nothing about that overshoot, so it only fixes the velocity on the <i>next</i>
       iteration. NAG computes $\\nabla f(\\theta_t+\\mu v_t)$ — the slope <i>at the place the overshoot
       lands</i> — so the correction $-\\varepsilon\\nabla f(\\theta_t+\\mu v_t)$ already points back
       toward $\\theta_t$ and is applied <i>this</i> iteration. The paper's words: NAG "performs a partial
       update to $\\theta_t$ ... missing the as yet unknown correction," which "allows NAG to change $v$
       in a quicker and more responsive way." Geometrically this is Figure 1: the NAG correction vector is
       longer and better aimed when the velocity is bad.</p>
       <p><b>What $O(1/k^2)$ buys you.</b> For a smooth convex $f$ with minimum value $f^\\star$, gradient
       descent guarantees $f(\\theta_k)-f^\\star \\le c\\,/\\,k$, while NAG guarantees
       $f(\\theta_k)-f^\\star \\le c'\\,/\\,k^2$. So to reach error $\\delta$, GD needs about $1/\\delta$
       steps but NAG needs only about $1/\\sqrt{\\delta}$ — a square-root fewer. The constants $c,c'$ are
       proportional to $L$ (the smoothness) and to the squared distance from the start to the solution
       (Sutskever et al. 2013, Section 2). The full $1983$ proof builds a clever auxiliary sequence; the
       CODEVIZ below verifies the rate empirically instead.</p>`,

    example:
      `<p><b>Worked numbers</b> — two NAG steps in 1-D on the smooth convex bowl $f(x)=x^2$
       (so $\\nabla f(x)=2x$), with learning rate $\\varepsilon=0.1$, momentum $\\mu=0.9$, starting at
       $\\theta_0=2.0$ and velocity $v_0=0$. We plug into $v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t+\\mu v_t)$.</p>
       <ul class="steps">
         <li><b>Step 1 — look-ahead.</b> $\\theta_0+\\mu v_0 = 2.0+0.9{\\cdot}0 = 2.0$ (with $v_0=0$ it equals the current point).</li>
         <li><b>Step 1 — gradient there.</b> $\\nabla f(2.0)=2{\\cdot}2.0 = 4.0$.</li>
         <li><b>Step 1 — velocity & update.</b> $v_1 = 0.9{\\cdot}0 - 0.1{\\cdot}4.0 = -0.4$; $\\theta_1 = 2.0 + (-0.4) = 1.6$.</li>
         <li><b>Step 2 — look-ahead.</b> Now $v_1\\ne 0$, so it <i>differs</i> from the current point: $\\theta_1+\\mu v_1 = 1.6 + 0.9{\\cdot}(-0.4) = 1.24$.</li>
         <li><b>Step 2 — gradient there.</b> $\\nabla f(1.24)=2{\\cdot}1.24 = 2.48$ — measured ahead, not at $1.6$.</li>
         <li><b>Step 2 — velocity & update.</b> $v_2 = 0.9{\\cdot}(-0.4) - 0.1{\\cdot}2.48 = -0.36 - 0.248 = -0.608$; $\\theta_2 = 1.6 + (-0.608) = 0.992$.</li>
       </ul>
       <p>The step ledger, and the column that shows the look-ahead's effect (NAG measures the gradient at the look-ahead point, heavy-ball would measure it at $\\theta_t$):</p>
       <table class="extable">
        <caption>Two NAG steps on $f(x)=x^2$; the last column is the gradient classical momentum would have used instead.</caption>
        <thead><tr><th>step $t$</th><th class="num">$\\theta_t$</th><th class="num">look-ahead $\\theta_t{+}\\mu v_t$</th><th class="num">$\\nabla f$ there</th><th class="num">$v_{t+1}$</th><th class="num">$\\theta_{t+1}$</th><th class="num">heavy-ball $\\nabla f(\\theta_t)$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">1</td><td class="num">2.00</td><td class="num">2.00</td><td class="num">4.00</td><td class="num">&minus;0.400</td><td class="num">1.600</td><td class="num">4.00</td></tr>
         <tr><td class="row-h">2</td><td class="num">1.60</td><td class="num">1.24</td><td class="num">2.48</td><td class="num">&minus;0.608</td><td class="num">0.992</td><td class="num">3.20</td></tr>
        </tbody>
       </table>
       <p>The look-ahead is the whole story of step 2: classical momentum would have used the gradient at
       $1.6$ ($=3.2$) instead of at the look-ahead point $1.24$ ($=2.48$), taking a slightly more
       aggressive, less-corrected step. The CODE cell recomputes $\\theta_1=1.6$ and $\\theta_2=0.992$ and
       prints them.</p>`,

    recipe:
      `<p><b>NAG as numbered steps</b> — initialize $v_0=0$ and a start $\\theta_0$, then each step
       $t=0,1,2,\\dots$:</p>
       <ol>
         <li>Form the look-ahead point $\\tilde\\theta = \\theta_t + \\mu v_t$.</li>
         <li>Compute the gradient there: $g = \\nabla f(\\tilde\\theta)$.</li>
         <li>Update the velocity: $v_{t+1} = \\mu v_t - \\varepsilon g$.</li>
         <li>Step the parameters: $\\theta_{t+1} = \\theta_t + v_{t+1}$.</li>
       </ol>
       <p>(PyTorch implements an algebraically equivalent buffer form — see the CODE — so the same update
       can be written without re-evaluating the model at a separate look-ahead point.)</p>`,

    results:
      `<p>Grounded statement (Sutskever et al. 2013, Section 2): "for general smooth (non-strongly) convex
       functions and a deterministic gradient, NAG achieves a global convergence rate of $O(1/T^2)$
       (versus the $O(1/T)$ of gradient descent), with constant proportional to the Lipschitz coefficient
       of the derivative and the squared Euclidean distance to the solution." The Wikipedia "Gradient
       descent" article independently states gradient descent achieves $O(k^{-1})$ on convex problems
       while "using the Nesterov acceleration technique, the error decreases at $O(k^{-2})$." (Original:
       Nesterov, Doklady Akademii Nauk SSSR, 1983.) The CODEVIZ numbers below are our own small run, not
       the paper's reported results.</p>`,
    evaluation:
      `<p><b>The metric &amp; benchmark.</b> NAG is an optimizer, so "working" is measured two ways. (1)
       <b>Correctness</b>: <code>torch.allclose(my_weights, torch.optim.SGD(..., nesterov=True))</code> after
       several steps from an identical start &mdash; a hard pass/fail; the trivial wrong baseline is plain
       heavy-ball momentum (<code>nesterov=False</code>), which must <b>not</b> match. (2) <b>Convergence
       rate</b>: minimize a smooth convex quadratic $f(x)=\\tfrac12 x^\\top A x$ and track the error
       $f(x_k)-f^\\star$; the no-skill reference is gradient descent's $O(1/k)$ &mdash; NAG must pull
       <i>away</i> from it as $k$ grows (the signature of $O(1/k^2)$).</p>
       <ul>
        <li><b>Sanity checks before the full run.</b> (1) Reproduce the worked example on $f(x)=x^2$
        ($\\varepsilon=0.1,\\mu=0.9,\\theta_0=2$): step 1 $\\rightarrow\\theta_1=1.6$, step 2
        $\\rightarrow\\theta_2=0.992$. (2) <b>Step-1 equivalence</b>: with $v_0=0$ the look-ahead point
        equals the current point, so NAG's first step must equal heavy-ball's and plain GD's &mdash; if
        step 1 already diverges, your buffer initialization is wrong (PyTorch seeds
        <code>buf = g</code>, the single most common <code>allclose</code> mismatch). (3) With $\\mu=0$ NAG
        must collapse to vanilla SGD: $\\theta\\leftarrow\\theta-\\varepsilon g$. (4) On the convex bowl the
        error must <b>decrease monotonically-ish</b> toward $0$; a flat or rising curve means a sign error
        in the velocity convention.</li>
        <li><b>Expected range.</b> Anchored to the grounded claim (Sutskever et al. 2013, &sect;2,
        attributing the rate to Nesterov 1983): NAG reaches $O(1/T^2)$ "versus the $O(1/T)$ of gradient
        descent." Concretely the gap should <b>widen</b> with $k$ &mdash; in our run GD/NAG error ratio is
        $\\approx 5\\times$ at $k=10$, $\\approx 240\\times$ at $k=100$, $\\approx 350\\times$ at $k=300$ (our
        numbers, not the paper's). The <code>allclose</code> max-abs-diff vs PyTorch should be
        $\\approx 3\\times 10^{-8}$ (float round-off). <i>Rule of thumb (not a paper claim):</i> a diff
        above $\\sim 10^{-5}$ signals a real formula error, not numerical noise.</li>
        <li><b>Ablation &mdash; prove the look-ahead earns its keep.</b> The paper's one idea is measuring
        the gradient at the look-ahead point $\\theta_t+\\mu v_t$ instead of at $\\theta_t$. Toggle exactly
        that &mdash; <code>grad(x + mu*v)</code> (NAG) vs <code>grad(x)</code> (heavy-ball) &mdash; with the
        <b>same</b> $\\mu$ and learning rate. NAG should reach a markedly lower loss and oscillate less (our
        run: $\\approx 1.7\\times 10^{-4}$ vs $\\approx 8.3\\times 10^{-2}$ at $k=50$). If the two curves are
        identical, you are taking the gradient at the same point in both &mdash; the look-ahead is not wired
        in.</li>
        <li><b>Failure signals &amp; what they mean.</b> <code>allclose</code> <b>fails on step 1 only</b>
        &rarr; buffer seeded as $\\mu\\cdot 0 + g$ in a way that differs from PyTorch's
        <code>buf = g</code>. <b>Trajectory drifts</b> the wrong direction &rarr; sign/step-convention
        mismatch ($\\theta_{t+1}=\\theta_t+v$ with $v$ already carrying $-\\varepsilon g$, vs subtracting).
        <b>Error stalls or rises / oscillates and blows up</b> &rarr; $\\mu$ near $1$ with too-large
        $\\varepsilon$ (NAG tolerates a larger $\\mu$ than heavy-ball, but not arbitrary). <b>NAG no faster
        than GD</b> &rarr; the look-ahead is not applied, or you are testing on a non-convex / noisy
        stochastic problem where the $O(1/k^2)$ asymptotic advantage is lost (Sutskever et al. 2013, &sect;2)
        &mdash; verify on the deterministic smooth convex quadratic first.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p><b>Track A (primitive).</b> PyTorch ships this as
       <code>torch.optim.SGD(momentum=μ, nesterov=True)</code> in one line. Here you <b>build it from
       scratch</b> with raw tensors: the velocity buffer and the look-ahead update — all under
       <code>torch.no_grad()</code> so the optimizer's own arithmetic is not tracked by autograd. The
       payoff is the <code>torch.allclose(my_weights, sgd_weights)</code> check after several steps — if
       it passes, your update <i>is</i> PyTorch's Nesterov SGD. You still let autograd compute the
       gradients (<code>.backward()</code>); only the optimizer is hand-built. (PyTorch's buffer form
       <code>buf = μ·buf + g; d = g + μ·buf; θ -= lr·d</code> is algebraically the same look-ahead as
       eqs. (3)–(4) — match it exactly or the allclose fails.)</p>`,

    pitfalls:
      `<ul>
         <li><b>Look-ahead vs current point.</b> NAG's defining feature is evaluating the gradient at
         $\\theta_t+\\mu v_t$, not $\\theta_t$. Use the current point and you have plain heavy-ball
         momentum — a different (and on smooth convex problems, slower) method.</li>
         <li><b>Buffer initialization.</b> PyTorch sets the velocity buffer to the first gradient
         (<code>buf = g</code>) on the very first step, not to <code>μ·0 + g</code> applied to a zero
         buffer in a way that differs. Mishandling step 1 is the most common cause of an allclose
         mismatch.</li>
         <li><b>Sign / step convention.</b> Some texts write $\\theta_{t+1}=\\theta_t-\\eta v_t$ with a
         positive velocity; Sutskever et al. fold the learning rate into $v$ and <i>add</i> it. Pick one
         convention and keep it consistent, or the trajectory drifts.</li>
         <li><b>Acceleration needs convexity + smoothness.</b> The $O(1/k^2)$ guarantee is for smooth
         convex (deterministic-gradient) problems. On noisy stochastic gradients the asymptotic advantage
         is lost (Sutskever et al. 2013, Section 2) — though NAG still helps in the early "transient"
         phase of deep-net training.</li>
         <li><b>Momentum too large diverges.</b> $\\mu$ near 1 with a too-large $\\varepsilon$ oscillates
         or blows up. NAG tolerates a larger $\\mu$ than heavy-ball, but not an arbitrary one.</li>
       </ul>`,

    recall: [
      "State the NAG update from memory: $v_{t+1}=\\mu v_t-\\varepsilon\\nabla f(\\theta_t+\\mu v_t)$, $\\theta_{t+1}=\\theta_t+v_{t+1}$.",
      "What is the ONE difference between classical (heavy-ball) momentum and NAG?",
      "State NAG's convergence rate on a smooth convex problem and gradient descent's, and which is faster.",
      "Define the look-ahead point $\\theta_t+\\mu v_t$ in words, and say why measuring the gradient there gives a more timely correction."
    ],

    practice: [
      {
        q: `Do one heavy-ball (classical momentum) step on $f(x)=x^2$ from $\\theta_0=2,\\,v_0=0$ with $\\varepsilon=0.1,\\ \\mu=0.9$, and confirm it equals the NAG step 1 above. Then explain why step 2 will differ.`,
        steps: [
          { do: `CM gradient at the current point: $\\nabla f(2.0)=2\\cdot2=4.0$.`, why: `Heavy-ball measures at $\\theta_t$, not the look-ahead.` },
          { do: `$v_1=0.9\\cdot0-0.1\\cdot4.0=-0.4$; $\\theta_1=2.0-0.4=1.6$.`, why: `Same as NAG because $v_0=0$ makes the look-ahead point equal the current point.` },
          { do: `At step 2, $v_1=-0.4\\ne0$, so NAG looks ahead to $1.24$ while CM stays at $1.6$.`, why: `Once velocity is nonzero the two methods see different gradients.` }
        ],
        answer: `Step 1 is identical ($\\theta_1=1.6$) because with $v_0=0$ the look-ahead point $\\theta_0+\\mu v_0$ equals $\\theta_0$. From step 2 on they diverge: NAG measures the slope at $\\theta_1+\\mu v_1=1.24$ (gradient $2.48$), CM at $\\theta_1=1.6$ (gradient $3.2$). NAG's look-ahead already feels that it is approaching the minimum and eases off, which is the source of its better conditioning and faster convergence.`
      },
      {
        q: `Acceleration arithmetic: if gradient descent needs about $1/\\delta$ steps to reach error $\\delta$ on a smooth convex problem, roughly how many does NAG need, and by what factor is that fewer at $\\delta=10^{-4}$?`,
        steps: [
          { do: `GD: $f-f^\\star\\le c/k\\Rightarrow k\\approx c/\\delta$.`, why: `$O(1/k)$ rate inverted.` },
          { do: `NAG: $f-f^\\star\\le c'/k^2\\Rightarrow k\\approx \\sqrt{c'/\\delta}=O(1/\\sqrt{\\delta})$.`, why: `$O(1/k^2)$ rate inverted.` },
          { do: `Ratio $\\approx (1/\\delta)/(1/\\sqrt{\\delta})=1/\\sqrt{\\delta}$. At $\\delta=10^{-4}$, $1/\\sqrt{\\delta}=100$.`, why: `Square-root fewer steps.` }
        ],
        answer: `NAG needs about $1/\\sqrt{\\delta}$ steps versus GD's $1/\\delta$ — a factor of $1/\\sqrt{\\delta}$ fewer. At $\\delta=10^{-4}$ that is roughly $100\\times$ fewer iterations (ignoring constants). This square-root speedup is exactly the practical meaning of going from $O(1/k)$ to $O(1/k^2)$.`
      },
      {
        q: `Ablation: in the CODEVIZ, run heavy-ball momentum and NAG with the SAME $\\mu$ and learning rate on the smooth convex quadratic. What do you expect, and what does our run show?`,
        steps: [
          { do: `Heavy-ball measures $\\nabla f(\\theta_t)$; NAG measures $\\nabla f(\\theta_t+\\mu v_t)$.`, why: `Only the gradient's evaluation point changes.` },
          { do: `NAG's earlier correction damps the oscillation heavy-ball shows along high-curvature directions.`, why: `Sutskever et al. 2013, Section 2.1 / Figure 1.` },
          { do: `Compare the loss at matched steps.`, why: `Same $\\mu$, lr isolates the look-ahead's effect.` }
        ],
        answer: `With everything else held fixed, the only change is where the gradient is measured, so any difference is the look-ahead's doing. In our small run NAG reaches a markedly lower loss than heavy-ball at the same step (e.g. ~1.7e-4 vs ~8.3e-2 by step 50) and oscillates less — the look-ahead corrects the velocity before it overshoots. This is the qualitative effect the paper describes, reproduced on toy data (our numbers, not the paper's).`
      }
    ]
  });

  window.CODE["paper-nesterov"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `Build Nesterov Accelerated Gradient from scratch with raw torch: a per-parameter velocity buffer ` +
      `and the look-ahead update, all under torch.no_grad(). Then PROVE it is identical to PyTorch by ` +
      `running 8 optimization steps with both MyNesterovSGD and torch.optim.SGD(momentum, nesterov=True) ` +
      `from the SAME start and checking torch.allclose. Finally recompute the two-step worked example on ` +
      `f(x)=x^2. Runs in Colab (torch is preinstalled).`,
    code: `import torch

torch.manual_seed(0)

class MyNesterovSGD:
    """Nesterov Accelerated Gradient from scratch.
       Look-ahead form (Nesterov 1983; Sutskever et al. 2013, eqs. 3-4):
           v <- mu*v - lr*grad(theta + mu*v);  theta <- theta + v
       Implemented in PyTorch's algebraically-equivalent buffer form so torch.allclose holds:
           buf <- mu*buf + g ;  d <- g + mu*buf ;  theta <- theta - lr*d ."""
    def __init__(self, params, lr, momentum):
        self.params = list(params)
        self.lr, self.mu = lr, momentum
        self.buf = [None] * len(self.params)          # velocity buffer per parameter

    @torch.no_grad()
    def step(self):
        for i, p in enumerate(self.params):
            g = p.grad
            if self.buf[i] is None:
                self.buf[i] = g.clone()               # PyTorch seeds the buffer with the first gradient
            else:
                self.buf[i].mul_(self.mu).add_(g)     # buf = mu*buf + g
            d = g + self.mu * self.buf[i]             # Nesterov look-ahead gradient direction
            p.add_(d, alpha=-self.lr)                 # theta -= lr * d

    def zero_grad(self):
        for p in self.params:
            if p.grad is not None:
                p.grad.zero_()

# ---- THE ORACLE: MyNesterovSGD must equal torch.optim.SGD(nesterov=True) over several steps ----
w_mine = torch.randn(5, 3, requires_grad=True)
w_ref  = w_mine.detach().clone().requires_grad_(True)         # identical start
opt_mine = MyNesterovSGD([w_mine], lr=0.05, momentum=0.9)
opt_ref  = torch.optim.SGD([w_ref], lr=0.05, momentum=0.9, nesterov=True)

X = torch.randn(20, 5); target = torch.randn(20, 3)
for _ in range(8):
    opt_mine.zero_grad()
    (((X @ w_mine) - target)**2).mean().backward(); opt_mine.step()
    opt_ref.zero_grad()
    (((X @ w_ref) - target)**2).mean().backward(); opt_ref.step()

print("allclose vs torch SGD(nesterov=True) after 8 steps:",
      torch.allclose(w_mine, w_ref, atol=1e-6))             # expect True
print("max abs diff:", (w_mine - w_ref).abs().max().item())  # ~3e-8

# ---- recompute the two-step worked example on f(x)=x^2, lr=0.1, mu=0.9, theta0=2, v0=0 ----
theta, v, lr, mu = 2.0, 0.0, 0.1, 0.9
for t in (1, 2):
    look   = theta + mu * v          # look-ahead point
    g_look = 2 * look                # grad of x^2 at the look-ahead point
    v      = mu * v - lr * g_look    # velocity update
    theta  = theta + v               # parameter update
    print(f"step {t}: look={look:.4f} grad={g_look:.4f} v={v:.4f} theta={theta:.4f}")
# expect: step 1 -> theta=1.6000 ; step 2 -> theta=0.9920`
  };

  window.CODEVIZ["paper-nesterov"] = {
    question: "On the same smooth convex quadratic from the same start, does Nesterov's accelerated gradient pull AWAY from plain gradient descent as steps grow (the signature of O(1/k^2) beating O(1/k)), and does the look-ahead beat heavy-ball momentum at matched mu and learning rate?",
    charts: [
      {
        type: "line",
        title: "Error f(x_k) − f* on a smooth convex quadratic (log scale): GD vs Nesterov",
        xlabel: "iteration k",
        ylabel: "f(x_k) − f*  (lower is better)",
        logy: true,
        series: [
          {
            name: "Gradient descent  O(1/k)",
            color: "#ff7b72",
            points: [[0,25.67],[5,0.2985],[10,0.08295],[20,0.01421],[40,0.00164],[70,0.0002913],[110,0.00005688],[160,0.000009481],[220,0.000001534],[299,0.0000002242]]
          },
          {
            name: "Nesterov accelerated  O(1/k^2)",
            color: "#7ee787",
            points: [[0,25.67],[5,0.289],[10,0.01525],[20,0.0009083],[40,0.00003945],[70,0.0000006817],[110,0.0000002047],[160,0.000000001903],[220,0.000000002883],[299,0.0000000006374]]
          }
        ]
      }
    ],
    caption: "Our small-scale run (numpy, seed 0), not the paper's reported numbers. Minimizing f(x)=½ xᵀA x with A diagonal, 100 eigenvalues evenly spaced in [0, 1] (so it is smooth convex but NOT strongly convex — the rate is polynomial in k, which is where O(1/k) vs O(1/k²) separate). Both start at the same random x₀ and use step 1/L. Gradient descent's error falls like 1/k; Nesterov's falls like 1/k², so the gap WIDENS with k: at k=10 Nesterov is ~5× lower, at k=100 ~240× lower, at k=300 ~350× lower. Ablation (same μ=0.9, lr=0.5/L): heavy-ball momentum reaches ~8.3e-2 at k=50 while Nesterov's look-ahead reaches ~1.7e-4 — same method except WHERE the gradient is measured.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# smooth convex (NOT strongly convex) quadratic: min eigenvalue 0 exposes the polynomial rates
D = 100
eig = np.linspace(0.0, 1.0, D); eig[0] = 0.0
A = np.diag(eig); L = 1.0
def f(x):    return 0.5 * x @ (A @ x)
def grad(x): return A @ x
x0 = rng.normal(0, 1, D)

def gd(steps):
    x = x0.copy(); out = []
    for k in range(steps):
        out.append(f(x)); x = x - (1.0/L)*grad(x)
    return out

def nag(steps):                       # Nesterov constant-step scheme, smooth convex
    x = x0.copy(); y = x0.copy(); lam = 0.0; out = []
    for k in range(steps):
        out.append(f(x))
        xn = y - (1.0/L)*grad(y)
        lam_n = (1 + np.sqrt(1 + 4*lam**2)) / 2
        gamma = (1 - lam) / lam_n
        y = (1 - gamma)*xn + gamma*x
        x, lam = xn, lam_n
    return out

def momentum(steps, nesterov):        # ablation: same mu, lr; only the look-ahead changes
    x = x0.copy(); v = np.zeros(D); mu = 0.9; lr = 0.5/L; out = []
    for k in range(steps):
        out.append(f(x))
        g = grad(x + mu*v) if nesterov else grad(x)   # <-- the one difference
        v = mu*v - lr*g; x = x + v
    return out

g = gd(300); n = nag(300)
print("GD  f-f* at k=10,100,300:", [round(g[i], 10) for i in (9, 99, 299)])
print("NAG f-f* at k=10,100,300:", [round(n[i], 12) for i in (9, 99, 299)])
print("ratio GD/NAG at k=300:", round(g[299]/n[299], 1))          # ~350x

hb = momentum(300, nesterov=False); na = momentum(300, nesterov=True)
print("ablation at k=50  heavy-ball:", round(hb[49], 6), " nesterov:", round(na[49], 6))`
  };
})();
