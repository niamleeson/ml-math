/* =====================================================================
   Reinforcement Learning — concept lesson.
   id: rl-function-approximation
   Why tabular RL breaks, and how value function approximation fixes it:
   linear features, the semi-gradient TD update, and the deadly triad.
   Self-contained: lesson + CODE (Colab) + CODEVIZ (real numpy numbers).
   ===================================================================== */
(function () {
  window.LESSONS = window.LESSONS || [];
  window.CODE = window.CODE || {};
  window.CODEVIZ = window.CODEVIZ || {};

  window.LESSONS.push({
    id: "rl-function-approximation",
    title: "Value Function Approximation",
    tagline: "When there are too many states to list one-by-one, fit a function to the value instead of a table.",
    module: "Reinforcement Learning",
    prereqs: ["ai-value-iteration", "ai-q-learning", "aix-sarsa-td", "fnd-gradient", "ml-gradient-descent", "mod-dqn"],

    whenToUse:
      `<p><b>Reach for value function approximation the moment the state space is too big to tabulate.</b> Tabular methods such as
       <a href="#ai-value-iteration">value iteration</a>, <a href="#ai-q-learning">Q-learning</a>, and
       <a href="#aix-sarsa-td">SARSA / TD learning</a> store one number per state. That works for a $4\\times4$ gridworld. It
       collapses when the state is a camera image (millions of pixels) or a robot's joint angles (real-valued, so infinitely
       many states).</p>
       <p><b>Use it when:</b></p>
       <ul>
         <li>The state space is <b>continuous</b> — joint angles, velocities, positions — so there is no finite table to fill.</li>
         <li>The state space is <b>discrete but enormous</b> — board positions, raw pixels — so a table will not fit in memory and you would never visit each cell often enough to learn it.</li>
         <li>You want <b>generalization</b>: learning about one state should teach you about similar states you have not yet seen. A table generalizes to nothing; a function shares parameters across states.</li>
       </ul>
       <p><b>This is the bridge from tabular RL to deep RL.</b> Replace the table with a linear function of features, and you get the
       method below. Replace it with a neural network, and you get <a href="#mod-dqn">Deep Q-Networks (DQN)</a> and
       <a href="#mod-policy-gradient">policy-gradient</a> methods. The math of the update is the same; only the function class changes.</p>`,

    application:
      `<p>Value function approximation underpins essentially all of modern reinforcement learning. <b>Linear</b> approximators with
       hand-built features (tile coding) drove early successes such as TD-Gammon-style backgammon and the classic Mountain-Car and
       Acrobot control benchmarks. <b>Neural-network</b> approximators power Atari-from-pixels (<a href="#mod-dqn">DQN</a>), robotics
       and continuous control (joint torques), recommendation and resource scheduling, and the value critics inside
       <a href="#mod-actor-critic">actor-critic</a> and Reinforcement Learning from Human Feedback (RLHF) pipelines.</p>`,

    pitfalls:
      `<ul>
        <li><b>The DEADLY TRIAD can DIVERGE.</b> Combining all three of (1) function approximation, (2) bootstrapping (TD targets that
            use your own current estimate), and (3) off-policy training (learning about one policy from data gathered by another) can
            make the weights blow up to infinity — even on a tiny problem. <i>Fix:</i> drop any one leg. Use Monte-Carlo returns (no
            bootstrap), stay on-policy, or use gradient-TD methods (GTD2, TDC) and DQN's target network + replay, which tame the
            instability rather than removing a leg outright.</li>
        <li><b>The TD target is non-stationary (this is why it is "semi-gradient").</b> The target $r + \\gamma\\hat V(s';w)$ depends on
            the very weights $w$ you are updating, yet we treat it as a fixed label and do <b>not</b> differentiate through it. So the
            update is not the true gradient of any fixed loss; the goalposts move as you learn. <i>Fix:</i> small step sizes, and for
            neural nets a slow-moving <b>target network</b> (see <a href="#mod-dqn">DQN</a>) that holds the target steady for a while.</li>
        <li><b>Poor features limit a linear approximator.</b> $\\hat V(s;w)=w^\\top x(s)$ can only represent functions that are linear in
            the features $x(s)$. If the true value bends in a way your features cannot express, you cannot fit it no matter how long you
            train. <i>Fix:</i> richer features (tile coding, radial basis functions), or switch to a neural net that learns its own
            features.</li>
        <li><b>Over- or under-fitting.</b> Too many features (or too big a network) memorize noise; too few cannot capture the shape.
            <i>Fix:</i> regularization, validation on held-out states, and right-sizing the feature set.</li>
        <li><b>Sample hunger.</b> Approximators need many transitions to pin down their parameters. <i>Fix:</i> experience replay to reuse
            data, and shaping or good exploration so informative states are actually visited.</li>
      </ul>`,

    bigIdea:
      `<p>A <b>table</b> stores one value per state: $V(s_1), V(s_2), \\dots$ — one knob per cell. With a million states you need a
       million knobs, and you must visit each cell many times to learn its knob. For a <b>continuous</b> state (a real number) there
       is no finite list at all.</p>
       <p><b>Value function approximation</b> throws away the table and fits a <b>parameterized function</b>
       $\\hat V(s;w) \\approx V^\\pi(s)$ instead — a function of the state $s$ controlled by a small weight vector $w$. We tune $w$
       (a few numbers, not a million) by gradient descent so $\\hat V$ matches the true value. Because the same $w$ is used for every
       state, learning about one state automatically adjusts the prediction for similar states: the function <b>generalizes</b>.</p>
       <p>The simplest version is <b>linear</b>: build a feature vector $x(s)$ describing the state, and predict
       $\\hat V(s;w)=w^\\top x(s)$. Swap the linear function for a neural net and you have deep RL.</p>`,

    buildup:
      `<p>You already know the <b>TD (Temporal Difference) update</b> from <a href="#aix-sarsa-td">SARSA / TD learning</a>: nudge the
       value of a state toward $r + \\gamma V(s')$, the reward you just got plus the discounted value of where you landed. In a table
       that update touches a single cell $V(s)$.</p>
       <p>Here we want the same nudge, but applied to a <b>function</b> instead of a cell. So we ask: how should the weights $w$ change
       so that $\\hat V(s;w)$ moves toward the TD target? The answer is plain <a href="#ml-gradient-descent">gradient descent</a> on the
       squared error between the prediction and the target — using the <a href="#fnd-gradient">gradient</a> $\\nabla_w\\hat V(s;w)$ to
       know which direction moves the prediction up.</p>
       <p>The one subtlety: the target $r+\\gamma\\hat V(s';w)$ itself contains $w$. We pretend it does not — we treat it as a fixed
       label and only differentiate the prediction. That "half a gradient" is why the method is called <b>semi-gradient</b>.</p>`,

    symbols: [
      { sym: "$s$", desc: "the current state (e.g. a robot's joint angles, a screen image) — possibly a real-valued vector." },
      { sym: "$s'$", desc: "the next state, reached after one step ($s$-prime)." },
      { sym: "$V^\\pi(s)$", desc: "the TRUE value of state $s$ under policy $\\pi$: the expected total discounted reward from $s$. This is what we want to approximate." },
      { sym: "$\\hat V(s;w)$", desc: "our APPROXIMATE value of $s$, computed by a function with weights $w$. The 'hat' marks it as an estimate." },
      { sym: "$w$", desc: "the weight vector (a few learnable numbers) that parameterizes the approximator. We tune $w$ instead of a giant table." },
      { sym: "$x(s)$", desc: "the FEATURE vector of state $s$: numbers describing $s$ (tile-coding indicators, radial basis function activations, raw measurements)." },
      { sym: "$w^\\top x(s)$", desc: "the dot product (the symbol $\\top$ means 'transpose', turning $w$ into a row so it multiplies $x(s)$ element-by-element and sums) — the LINEAR prediction." },
      { sym: "$r$", desc: "the reward received on the step from $s$ to $s'$." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), between $0$ and $1$: future reward counts a little less than reward now." },
      { sym: "$\\delta_t$", desc: "the TD (Temporal Difference) error at step $t$: how wrong the current prediction was, $\\delta_t = r + \\gamma\\hat V(s';w) - \\hat V(s;w)$." },
      { sym: "$\\alpha$", desc: "the step size (learning rate), a small positive number controlling how big each weight update is." },
      { sym: "$\\nabla_w \\hat V(s;w)$", desc: "the gradient (the $\\nabla$ symbol, 'nabla') of the prediction with respect to the weights: the direction in weight space that raises $\\hat V(s;w)$ fastest. For the linear case this is just $x(s)$." },
      { sym: "$\\leftarrow$", desc: "'is updated to' — the left arrow means 'replace the left side with the right side'." },
      { sym: "$\\approx$", desc: "'approximately equals' — $\\hat V$ is a stand-in for the true $V^\\pi$, not an exact copy." }
    ],

    formula:
      `$$ \\hat V(s;w) = w^\\top x(s) \\qquad\\qquad \\delta_t = r + \\gamma\\,\\hat V(s';w) - \\hat V(s;w) \\qquad\\qquad w \\leftarrow w + \\alpha\\,\\delta_t\\,\\nabla_w \\hat V(s;w) $$`,

    whatItDoes:
      `<p>The first equation is the <b>linear approximator</b>: predict a state's value as a weighted sum of its features,
       $\\hat V(s;w)=w^\\top x(s)$. Good features make the value easy to express; bad features make it impossible.</p>
       <p>The second is the <b>TD error</b> $\\delta_t$: the gap between our current guess $\\hat V(s;w)$ and a slightly better guess
       $r + \\gamma\\hat V(s';w)$ (one real reward plus the discounted estimate of the next state). A positive $\\delta_t$ means we
       under-estimated; negative means we over-estimated.</p>
       <p>The third is the <b>semi-gradient TD update</b>: move the weights a small step $\\alpha$ in the direction that pushes
       $\\hat V(s;w)$ toward the target, scaled by how wrong we were ($\\delta_t$) and by which weights affect this state
       ($\\nabla_w\\hat V$). For the linear case $\\nabla_w\\hat V(s;w)=x(s)$, so the update is simply
       $w \\leftarrow w + \\alpha\\,\\delta_t\\,x(s)$ — increase the weight of every active feature in proportion to the error.</p>
       <p>It is "<b>semi</b>-gradient" because the target $r+\\gamma\\hat V(s';w)$ also depends on $w$, but we deliberately do not
       differentiate through it. We treat it as a fixed label, so $\\nabla_w$ acts only on the prediction $\\hat V(s;w)$.</p>`,

    derivation:
      `<p>Start from the goal: make the prediction match the true value, by minimizing the squared error on each visited state
       $$ J(w) = \\tfrac{1}{2}\\big(V^\\pi(s) - \\hat V(s;w)\\big)^2. $$</p>
       <ul class="steps">
         <li><b>Take the gradient.</b> Treating the target $V^\\pi(s)$ as fixed,
             $\\nabla_w J(w) = -\\big(V^\\pi(s) - \\hat V(s;w)\\big)\\,\\nabla_w\\hat V(s;w)$ by the chain rule.</li>
         <li><b>Descend.</b> Stochastic gradient descent steps opposite the gradient:
             $w \\leftarrow w + \\alpha\\big(V^\\pi(s) - \\hat V(s;w)\\big)\\nabla_w\\hat V(s;w)$. If we knew $V^\\pi(s)$ exactly, this is an
             honest gradient method.</li>
         <li><b>We do not know $V^\\pi(s)$.</b> So we BOOTSTRAP: replace the unknown target with the TD estimate
             $r + \\gamma\\hat V(s';w)$, which uses one real reward plus our own current guess of the next state.</li>
         <li><b>Substitute.</b> The error becomes $\\big(r + \\gamma\\hat V(s';w)\\big) - \\hat V(s;w) = \\delta_t$, giving
             $$ w \\leftarrow w + \\alpha\\,\\delta_t\\,\\nabla_w\\hat V(s;w). $$</li>
         <li><b>Why "semi"-gradient.</b> The bootstrapped target $r+\\gamma\\hat V(s';w)$ secretly depends on $w$ too. A TRUE gradient
             would also differentiate that term, adding a $-\\gamma\\,\\nabla_w\\hat V(s';w)$ piece. We OMIT it on purpose: we want
             $\\hat V(s;w)$ to chase the target, not the target to chase the prediction. So only half the dependence is differentiated
             — hence <b>semi-gradient</b>.</li>
         <li><b>Linear case.</b> With $\\hat V(s;w)=w^\\top x(s)$ the gradient is exactly $\\nabla_w\\hat V(s;w)=x(s)$, so the update
             collapses to $w \\leftarrow w + \\alpha\\,\\delta_t\\,x(s)$. ∎</li>
       </ul>
       <p><b>The deadly triad, stated precisely.</b> Convergence of this update is only guaranteed under all of: <i>linear</i>
       features, <i>on-policy</i> sampling, and bootstrapping. Combine bootstrapping with function approximation AND off-policy data
       and the iteration can have an expanding update operator — the weights $w$ can DIVERGE to infinity. The three legs are:
       <b>(1) function approximation</b>, <b>(2) bootstrapping</b>, <b>(3) off-policy training</b>. Any two are safe; all three
       together are the danger that DQN's target network and replay buffer (next lesson) exist to manage.</p>`,

    example:
      `<p>One state $s$, two features $x(s) = [1, 2]^\\top$, current weights $w = [0.5, -0.1]^\\top$, step size $\\alpha = 0.1$,
       discount $\\gamma = 0.9$. The agent acts, gets reward $r = 1$, and lands in $s'$ where $\\hat V(s';w) = 3$.</p>
       <ul class="steps">
         <li><b>Predict:</b> $\\hat V(s;w) = w^\\top x(s) = 0.5\\cdot 1 + (-0.1)\\cdot 2 = 0.5 - 0.2 = 0.3$.</li>
         <li><b>TD target:</b> $r + \\gamma\\hat V(s';w) = 1 + 0.9\\cdot 3 = 1 + 2.7 = 3.7$.</li>
         <li><b>TD error:</b> $\\delta_t = 3.7 - 0.3 = 3.4$. We badly under-estimated.</li>
         <li><b>Per-feature update</b> (linear, so $\\nabla_w\\hat V = x(s)$): each weight $w_i$ moves by
             $\\alpha\\,\\delta_t\\,x_i = 0.1\\cdot 3.4\\cdot x_i$, shown in the table below.</li>
       </ul>
       <table class="extable">
         <caption>Semi-gradient TD update $w_i \\leftarrow w_i + \\alpha\\,\\delta_t\\,x_i$, with $\\alpha\\,\\delta_t = 0.1\\cdot 3.4 = 0.34$.</caption>
         <thead>
           <tr><th>feature $i$</th><th class="num">$x_i$</th><th class="num">old $w_i$</th><th class="num">bump $0.34\\,x_i$</th><th class="num">new $w_i$</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">1</td><td class="num">1</td><td class="num">0.50</td><td class="num">$0.34$</td><td class="num">0.84</td></tr>
           <tr><td class="row-h">2</td><td class="num">2</td><td class="num">$-0.10$</td><td class="num">$0.68$</td><td class="num">0.58</td></tr>
         </tbody>
       </table>
       <ul class="steps">
         <li><b>Updated weights:</b> $w \\leftarrow [0.84,\\; 0.58]$. The SECOND feature (value $2$) got a bigger
             bump than the first (value $1$) &mdash; active, larger features are credited more.</li>
         <li><b>Check it moved the right way:</b> the new prediction is $0.84\\cdot 1 + 0.58\\cdot 2 = 0.84 + 1.16 = 2.0$,
             up from $0.3$ and closer to the target $3.7$.</li>
       </ul>`,

    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      // 1-D corridor, x in [0,1]. RBF features + bias. True V under "always step right by 0.1".
      var gamma = 0.9, step = 0.1, centers = [0.0, 0.33, 0.66, 1.0], sigma = 0.25;
      var w = [0, 0, 0, 0, 0], alpha = 0.05, episodes = 0, seed = 12345;
      function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
      function feats(x) {
        var f = [];
        for (var i = 0; i < centers.length; i++) { var d = x - centers[i]; f.push(Math.exp(-(d * d) / (2 * sigma * sigma))); }
        f.push(1.0); return f;
      }
      function Vhat(x) { var f = feats(x), s = 0; for (var i = 0; i < f.length; i++) s += w[i] * f[i]; return s; }
      function trueV(x) {
        if (x >= 1.0) return 0.0;
        var steps = Math.ceil((1.0 - x - 1e-9) / step);
        return Math.pow(gamma, steps - 1);
      }
      function runEpisode() {
        var x = rnd() * 0.9, done = false, guard = 0;
        while (!done && guard++ < 50) {
          var xp = x + step, r, vnext;
          if (xp >= 1.0) { r = 1.0; vnext = 0.0; done = true; } else { r = 0.0; vnext = Vhat(xp); }
          var delta = r + gamma * vnext - Vhat(x), f = feats(x);
          for (var i = 0; i < w.length; i++) w[i] += alpha * delta * f[i];
          x = xp;
        }
        episodes++;
      }
      var cv = document.createElement("canvas"); cv.width = 640; cv.height = 300; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      function draw() {
        var c = C(); ctx.clearRect(0, 0, 640, 300);
        var L = 60, R = 600, T = 30, B = 250, W = R - L, H = B - T;
        // axes
        ctx.strokeStyle = c.border; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(L, T); ctx.lineTo(L, B); ctx.lineTo(R, B); ctx.stroke();
        function px(x) { return L + x * W; }
        function py(v) { return B - v * H; } // v in [0,1]
        // true value curve
        ctx.strokeStyle = c.accent2; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var i = 0; i <= 90; i++) { var x = i / 100; (i === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, px(x), py(trueV(x))); }
        ctx.stroke();
        // learned approximation
        ctx.strokeStyle = c.accent; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]); ctx.beginPath();
        for (var j = 0; j <= 90; j++) { var xx = j / 100, vv = Math.max(-0.1, Math.min(1.1, Vhat(xx))); (j === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, px(xx), py(vv)); }
        ctx.stroke(); ctx.setLineDash([]);
        // legend + labels
        ctx.font = "13px sans-serif"; ctx.textAlign = "left";
        ctx.fillStyle = c.accent2; ctx.fillText("— true V(s)", L + 10, T + 14);
        ctx.fillStyle = c.accent; ctx.fillText("- - learned V̂(s;w) = wᵀx(s)", L + 130, T + 14);
        ctx.fillStyle = c.dim; ctx.fillText("state x", R - 60, B + 22);
        ctx.save(); ctx.translate(L - 40, (T + B) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = "center"; ctx.fillText("value", 0, 0); ctx.restore();
        // RMS error over grid 0..0.9
        var se = 0, n = 0; for (var k = 0; k <= 18; k++) { var g = k * 0.05; var e = Vhat(g) - trueV(g); se += e * e; n++; }
        var rms = Math.sqrt(se / n);
        ctx.fillStyle = c.ink; ctx.textAlign = "center"; ctx.font = "14px sans-serif";
        ctx.fillText("episodes: " + episodes + "    RMS value error: " + rms.toFixed(3), 320, B + 40);
      }
      function mkBtn(txt, fn) {
        var b = document.createElement("button"); b.textContent = txt;
        b.style.cssText = "margin:6px 8px 0 0;padding:6px 12px;cursor:pointer;";
        b.addEventListener("click", fn); host.appendChild(b); return b;
      }
      mkBtn("Run 1 episode (semi-gradient TD)", function () { runEpisode(); draw(); });
      mkBtn("Run 50 episodes", function () { for (var i = 0; i < 50; i++) runEpisode(); draw(); });
      mkBtn("Reset weights", function () { w = [0, 0, 0, 0, 0]; episodes = 0; seed = 12345; draw(); });
      draw();
    },

    practice: [
      {
        q: `A linear approximator has features $x(s) = [0, 1, 0]^\\top$ and weights $w = [2, 1, -3]^\\top$. The agent gets reward $r = 0$ and lands in $s'$ with $\\hat V(s';w) = 4$; use $\\gamma = 0.5$ and $\\alpha = 0.1$. Compute the prediction, the TD error $\\delta_t$, and the updated weights.`,
        steps: [
          { do: `Predict $\\hat V(s;w) = w^\\top x(s) = 2\\cdot0 + 1\\cdot1 + (-3)\\cdot0 = 1$.`, why: `Only the active feature (the middle one, value $1$) contributes; the rest are zeroed out.` },
          { do: `TD target $= r + \\gamma\\hat V(s';w) = 0 + 0.5\\cdot4 = 2$.`, why: `One real reward plus the discounted estimate of the next state.` },
          { do: `TD error $\\delta_t = 2 - 1 = 1$.`, why: `We under-estimated by $1$, so the weights should rise where the features are active.` },
          { do: `Update $w \\leftarrow w + \\alpha\\,\\delta_t\\,x(s) = [2,1,-3] + 0.1\\cdot1\\cdot[0,1,0] = [2, 1.1, -3]$.`, why: `For a linear approximator $\\nabla_w\\hat V = x(s)$, so only the active feature's weight changes.` }
        ],
        answer: `$\\hat V(s;w)=1$, $\\delta_t = 1$, and $w \\leftarrow [2,\\,1.1,\\,-3]$. Only the second weight moved because only the second feature was active.`
      },
      {
        q: `Name the three legs of the DEADLY TRIAD and explain why removing any one restores stability.`,
        steps: [
          { do: `List the legs: (1) function approximation, (2) bootstrapping, (3) off-policy training.`, why: `These are the exact three ingredients Sutton & Barto identify; all three together can make the weights diverge.` },
          { do: `Drop function approximation (use a table) → tabular TD converges.`, why: `A table has an independent value per state, so an update to one state cannot blow up another.` },
          { do: `Drop bootstrapping (use Monte-Carlo returns) → the target is a real sampled return, not your own estimate.`, why: `Without a self-referential target there is no feedback loop to amplify error.` },
          { do: `Drop off-policy training (stay on-policy) → on-policy semi-gradient TD with linear features is guaranteed to converge (to the TD fixed point).`, why: `On-policy sampling weights states by how often the policy actually visits them, which keeps the update operator a contraction.` }
        ],
        answer: `The triad is function approximation + bootstrapping + off-policy training. Any two are safe; all three together can diverge. Removing any single leg (use a table, use Monte-Carlo returns, or stay on-policy) restores a convergence guarantee.`
      },
      {
        q: `Why is the update called "semi-gradient" rather than "gradient"? What term is dropped?`,
        steps: [
          { do: `Write the bootstrapped objective error: $\\delta_t = \\big(r + \\gamma\\hat V(s';w)\\big) - \\hat V(s;w)$.`, why: `Both the target and the prediction contain the weights $w$.` },
          { do: `A TRUE gradient of the squared TD error would differentiate BOTH $\\hat V(s';w)$ and $\\hat V(s;w)$ with respect to $w$.`, why: `The chain rule applies to every appearance of $w$.` },
          { do: `The semi-gradient update differentiates ONLY the prediction $\\hat V(s;w)$ and treats the target as a fixed label, dropping the $-\\gamma\\,\\nabla_w\\hat V(s';w)$ term.`, why: `We want the prediction to chase the target, not the target to chase the prediction; keeping the dropped term often makes learning worse and slower.` }
        ],
        answer: `It is "semi" because we differentiate only $\\hat V(s;w)$ and not the bootstrapped target $r+\\gamma\\hat V(s';w)$, even though the target also depends on $w$. The dropped term is $-\\gamma\\,\\nabla_w\\hat V(s';w)$.`
      }
    ]
  });

  window.CODE["rl-function-approximation"] = {
    lib: "numpy (runs in Colab; no gym needed)",
    runnable: false,
    explain:
      `<p>This is <b>semi-gradient TD(0)</b> with a <b>linear</b> value approximator on a tiny continuous-ish environment: a 1-D
       corridor where the state is a real number $x \\in [0,1]$. We never build a table — instead we describe each state by
       four <b>radial basis function (RBF)</b> features plus a bias, and learn a 5-number weight vector $w$ so that
       $\\hat V(x;w)=w^\\top x(s)$ matches the true value. The update is exactly
       $w \\leftarrow w + \\alpha\\,\\delta_t\\,x(s)$. It runs in plain Colab (no <code>gymnasium</code> or <code>torch</code>
       needed); it prints the learned weights and the predicted values at a few states.</p>`,
    code: `import numpy as np

# ---- A small CONTINUOUS environment: a 1-D corridor --------------------
# State is a real number x in [0, 1]. Each step moves right by 0.1.
# Reward is +1 on the step that reaches the goal (x >= 1), else 0.  gamma = 0.9.
# There is NO table: x is real-valued, so we approximate the value instead.
gamma, step = 0.9, 0.1

# ---- Features x(s): 4 radial basis functions (RBFs) + a bias term ------
centers = np.array([0.0, 0.33, 0.66, 1.0]); sigma = 0.25
def x_features(x):
    rbf = np.exp(-((x - centers) ** 2) / (2 * sigma ** 2))
    return np.concatenate([rbf, [1.0]])            # length-5 feature vector

def V_hat(x, w):
    return float(w @ x_features(x))                # linear approximator  w^T x(s)

# ---- Semi-gradient TD(0) -----------------------------------------------
rng = np.random.default_rng(0)
w = np.zeros(5)                                     # the weight vector we learn
alpha = 0.05                                        # step size

for episode in range(600):
    x = rng.uniform(0.0, 0.9)                       # random start state
    done = False
    while not done:
        xp = x + step
        if xp >= 1.0:
            r, v_next, done = 1.0, 0.0, True         # terminal: bootstrap value is 0
        else:
            r, v_next = 0.0, V_hat(xp, w)            # bootstrap off our own estimate
        delta = r + gamma * v_next - V_hat(x, w)     # TD error  delta_t
        # semi-gradient TD update: grad of a LINEAR V_hat is just x_features(x).
        # We do NOT differentiate through the target v_next  ->  "semi"-gradient.
        w = w + alpha * delta * x_features(x)
        x = xp

print("learned weights w:", np.round(w, 3))
for x in [0.0, 0.3, 0.6, 0.9]:
    print(f"  V_hat({x:.1f}) = {V_hat(x, w):.3f}")
# Expected: weights settle and predicted values rise toward the goal, e.g.
#   V_hat(0.0) ~ 0.39, V_hat(0.3) ~ 0.51, V_hat(0.6) ~ 0.69, V_hat(0.9) ~ 0.96`
  };

  window.CODEVIZ["rl-function-approximation"] = {
    question: "Reading a value-approximation training curve: how do you tell healthy convergence apart from a deadly-triad divergence or a features-too-weak plateau?",
    charts: [
      {
        type: "line",
        title: "Healthy: on-policy semi-gradient TD(0) converges (RMS error falls and settles)",
        xlabel: "episode",
        ylabel: "RMS value error (over a grid of states)",
        series: [{
          name: "RMS error",
          color: "#7ee787",
          points: [[0, 0.599], [20, 0.0705], [41, 0.0332], [61, 0.0308], [82, 0.0328], [103, 0.0292], [123, 0.0295], [144, 0.0292], [165, 0.0328], [185, 0.0285], [206, 0.0277], [227, 0.0305], [247, 0.0272], [268, 0.0254], [289, 0.0303], [309, 0.0247], [330, 0.0261], [351, 0.0239], [371, 0.0235], [392, 0.0254], [413, 0.0266], [433, 0.0242], [454, 0.0213], [475, 0.0317], [495, 0.0225], [516, 0.0277], [537, 0.0295], [557, 0.0245], [578, 0.0223], [599, 0.0221]]
        }],
        interpret: "Real numpy output. <b>X</b> = training episodes, <b>Y</b> = root-mean-square gap between the learned value and the true value over a grid of states; lower is better. Read it left-to-right: error plunges from 0.60 to about 0.03 within ~40 episodes, then sits flat with small noise. A curve that <b>drops fast and then stays low and steady is the healthy signature</b> — five weights now predict the value at infinitely many states. This is what to expect with linear features and on-policy sampling."
      },
      {
        type: "line",
        title: "After training: linear-RBF approximation tracks the true 1-D value function",
        xlabel: "state x",
        ylabel: "value",
        series: [
          { name: "true V(x)", color: "#7ee787", points: [[0.0, 0.387], [0.1, 0.43], [0.2, 0.478], [0.3, 0.531], [0.4, 0.59], [0.5, 0.656], [0.6, 0.729], [0.7, 0.81], [0.8, 0.9], [0.9, 1.0]] },
          { name: "learned V̂(x;w)", color: "#4ea1ff", points: [[0.0, 0.391], [0.1, 0.419], [0.2, 0.461], [0.3, 0.511], [0.4, 0.562], [0.5, 0.619], [0.6, 0.691], [0.7, 0.783], [0.8, 0.881], [0.9, 0.956]] }
        ],
        interpret: "Real numpy output, same trained run. <b>X</b> = the state (a real number along the corridor), <b>Y</b> = its value. The green line is the true value, the blue line is the approximation. <b>When the two lines sit almost on top of each other</b>, the approximator has generalized correctly across the whole continuous range. Watch the gap: a small, even gap everywhere is healthy; a curve that matches in some regions but peels away in others points to features too weak to bend the way the true value bends."
      },
      {
        type: "line",
        title: "Divergence: the deadly triad (FA + bootstrap + off-policy) blows the error UP",
        xlabel: "episode",
        ylabel: "RMS value error (log-ish scale)",
        series: [{
          name: "RMS error (diverging)",
          color: "#ff7b72",
          points: [[0, 0.6], [20, 0.55], [41, 0.62], [61, 0.81], [82, 1.15], [103, 1.7], [123, 2.6], [144, 4.1], [165, 6.5], [185, 10.4], [206, 17.0], [227, 28.0], [247, 46.0], [268, 76.0], [289, 125.0], [309, 205.0]]
        }],
        interpret: "Illustrative shape (qualitatively honest). Same axes as the healthy curve, but the error <b>climbs instead of falling and accelerates upward</b> — the weights are blowing up toward infinity. This is the <b>deadly triad</b>: function approximation + bootstrapping + off-policy data combined. The tell-tale sign is an error that never settles and grows faster and faster. Fix by removing one leg (stay on-policy, use Monte-Carlo returns instead of bootstrapping) or by adding a target network and replay as DQN does."
      },
      {
        type: "line",
        title: "Plateau: features too weak — error falls then sticks well above zero",
        xlabel: "episode",
        ylabel: "RMS value error",
        series: [{
          name: "RMS error (underfit)",
          color: "#ffb454",
          points: [[0, 0.6], [20, 0.42], [41, 0.33], [61, 0.29], [82, 0.265], [103, 0.255], [123, 0.25], [144, 0.248], [165, 0.247], [185, 0.246], [206, 0.246], [227, 0.245], [247, 0.245], [268, 0.245], [289, 0.245], [309, 0.245], [330, 0.245], [351, 0.245], [371, 0.245], [392, 0.245], [413, 0.245], [454, 0.245], [495, 0.245], [537, 0.245], [578, 0.245], [599, 0.245]]
        }],
        interpret: "Illustrative shape. Same axes again. The error <b>drops a little, then flattens at a high floor</b> (here ~0.25, not ~0.03) and more training does not help. This is <b>underfitting</b>: a linear approximator can only express functions linear in its features, so if the features are too coarse (e.g. one RBF instead of four) it physically cannot match the true value's shape, no matter how long you train. The fix is richer features (more/finer RBFs, tile coding) or a neural net that learns its own — not a smaller step size or more episodes."
      }
    ],
    caption: "Four ways a value-approximation training curve can look. The first two panels are real numpy output from the healthy run; the last two are illustrative shapes for the divergence and underfitting failure modes. Each chart's own note explains how to read it and what to conclude.",
    code: `import numpy as np

# 1-D corridor: state x in [0,1]; step +0.1; reward +1 on reaching x>=1; gamma=0.9.
gamma, step = 0.9, 0.1

# True value of a state = gamma^(steps_to_goal - 1) under "always step right".
def true_V(x):
    if x >= 1.0: return 0.0
    steps = int(np.ceil((1.0 - x - 1e-9) / step))
    return gamma ** (steps - 1)

# Features x(s): 4 radial basis functions (RBFs) + bias.
centers = np.array([0.0, 0.33, 0.66, 1.0]); sigma = 0.25
def feats(x):
    return np.concatenate([np.exp(-((x - centers) ** 2) / (2 * sigma ** 2)), [1.0]])

grid = np.linspace(0, 0.95, 20)
Vtrue_grid = np.array([true_V(g) for g in grid])

rng = np.random.default_rng(0)
w = np.zeros(5); alpha = 0.05; errors = []
for ep in range(600):
    x = rng.uniform(0, 0.9); done = False
    while not done:
        xp = x + step
        if xp >= 1.0: r, vnext, done = 1.0, 0.0, True
        else:         r, vnext       = 0.0, w @ feats(xp)
        delta = r + gamma * vnext - w @ feats(x)     # TD error
        w = w + alpha * delta * feats(x)             # semi-gradient TD(0)
        x = xp
    Vhat = np.array([w @ feats(g) for g in grid])
    errors.append(np.sqrt(np.mean((Vhat - Vtrue_grid) ** 2)))   # RMS value error

idx = np.linspace(0, 599, 30).astype(int)            # subsample to 30 points
print("error points:", [[int(i), round(errors[i], 4)] for i in idx])
fx = np.linspace(0, 0.9, 10)
print("learned:", [round(float(w @ feats(x)), 3) for x in fx])
print("true:   ", [round(true_V(x), 3) for x in fx])`
  };
})();
