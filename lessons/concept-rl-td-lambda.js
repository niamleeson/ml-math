/* =====================================================================
   MODULE — Reinforcement Learning.
   Lesson: rl-td-lambda — bridging Monte Carlo and TD with n-step returns,
   the lambda-return, and eligibility traces (TD(lambda)).
   Self-contained: pushes one lesson into window.LESSONS, a runnable Colab
   numpy implementation (window.CODE), and a reproducible numpy computation
   of RMS error vs lambda on a 5-state random walk (window.CODEVIZ).
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "rl-td-lambda",
    title: "n-step returns, the λ-return, and eligibility traces (TD(λ))",
    tagline: "One dial, λ, slides smoothly between one-step TD and full Monte Carlo — and spreads credit back over a whole trajectory.",
    module: "Reinforcement Learning",
    prereqs: ["aix-sarsa-td", "aix-monte-carlo", "ai-value-iteration", "prob-expectation", "fnd-gradient"],
    whenToUse:
      `<p><b>Reach for TD(λ) when one-step TD learns too slowly and full Monte Carlo (MC) is too noisy.</b> The two sibling lessons sit at the extremes: [aix-sarsa-td] is one-step TD (Temporal Difference) learning — it <i>bootstraps</i>, updating each estimate from the very next estimate; [aix-monte-carlo] waits for the whole episode to finish and updates from the actual return. TD has low variance but is biased (it leans on its own guesses); MC is unbiased but high-variance (one lucky or unlucky episode swings the estimate).</p>
       <p>TD(λ) is the whole spectrum <i>between</i> them, controlled by a single knob λ (Greek "lambda", a number in $[0,1]$):</p>
       <ul>
         <li><b>$\\lambda=0$</b> — pure one-step TD ([aix-sarsa-td]). Full bootstrapping, lowest variance, most bias.</li>
         <li><b>$\\lambda=1$</b> — pure Monte Carlo ([aix-monte-carlo]). No bootstrapping, highest variance, no bias.</li>
         <li><b>$0 \\lt \\lambda \\lt 1$</b> — a blend. An intermediate λ (often around 0.7–0.9) usually beats <i>both</i> endpoints, as the chart below shows.</li>
       </ul>
       <p><b>Choose TD(λ) over plain TD or MC when:</b> you want faster credit assignment (one update can credit a whole recent trajectory, not just the last step) and you are willing to tune one extra hyperparameter. It is the prediction (value-estimation) backbone behind classics like TD-Gammon.</p>
       <p><b>Pick something else when:</b> you only need control (good actions, not accurate values) on a simple problem — plain Q-learning ([ai-q-learning]) may be enough — or when you use heavy function approximation, where traces interact subtly with the approximator (see pitfalls).</p>`,
    application:
      `<p>Eligibility traces powered <b>TD-Gammon</b>, Tesauro's backgammon agent that reached world-class play in the 1990s by training a neural network with TD(λ) on self-play. More broadly, TD(λ) is the standard tool for <b>value prediction</b>: estimating how good states are under a fixed policy — evaluating a trading strategy, a game-playing policy, or a control policy in robotics. The same trace machinery extends to control as <b>SARSA(λ)</b> and <b>Q(λ)</b>, and the "eligibility" idea — keep a fading memory of what you recently did, so a surprise can be credited backward — reappears in modern actor-critic methods ([mod-actor-critic]) and in GAE (Generalized Advantage Estimation) used by PPO (Proximal Policy Optimization).</p>`,
    pitfalls:
      `<ul>
         <li><b>λ and α (the step size) must be tuned together.</b> A larger λ spreads each update over more states, which effectively amplifies the learning rate — so a λ that helps at small α can diverge at large α. Sweep them jointly, not one at a time.</li>
         <li><b>The best λ is problem-dependent.</b> There is no universal value; it lands wherever the bias–variance trade-off is best for <i>your</i> environment (often λ ≈ 0.7–0.9, but verify). Always plot error vs λ on a small version of your task.</li>
         <li><b>Accumulating vs replacing traces.</b> The update $e_t = \\gamma\\lambda e_{t-1} + \\nabla$ <i>accumulates</i>: revisiting a state stacks its trace above 1, which can over-credit it. <i>Replacing</i> traces instead reset the revisited state's trace to 1 (or to $\\nabla$). Replacing is often more stable for tabular problems; pick deliberately.</li>
         <li><b>Traces add memory and compute.</b> You carry a trace $e(s)$ for every state (or every weight, with function approximation) and touch them all each step. For huge state spaces this is the cost you pay for faster credit assignment.</li>
         <li><b>Harder with function approximation.</b> With a neural network the backward view is no longer an exact equivalent of the forward λ-return, and naive traces can be unstable. Modern code uses care (e.g. true-online TD(λ), or GAE) to recover the equivalence.</li>
       </ul>`,
    bigIdea:
      `<p>One-step TD and Monte Carlo are the two ends of a single idea: <b>how far ahead do you look at real rewards before you fall back on your own value estimate?</b></p>
       <ul>
         <li><b>One step</b> (TD): use one real reward $R_{t+1}$, then trust your guess $V(S_{t+1})$ for everything after. This is "bootstrapping" — building an estimate on top of another estimate.</li>
         <li><b>All the way</b> (MC): use the actual rewards $R_{t+1}, R_{t+2}, \\dots$ for the whole rest of the episode, and never lean on a guess.</li>
         <li><b>Any number of steps in between</b> ($n$-step): use $n$ real rewards, then bootstrap from $V(S_{t+n})$.</li>
       </ul>
       <p>The <b>$\\lambda$-return</b> goes one better: instead of picking a single $n$, it <i>averages all of them</i>, weighting an $n$-step return by $\\lambda^{n-1}$ so nearer horizons count more. The <b>eligibility trace</b> is the mechanical trick that lets you achieve this average <i>online</i> — step by step, without storing whole episodes — by keeping a short-term memory that marks recently-visited states as "still eligible" for the latest surprise.</p>`,
    buildup:
      `<p>Start from the return. The <b>return</b> $G_t$ is the total (discounted) reward from time $t$ onward: $G_t = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\dots$, where $\\gamma$ (Greek "gamma", in $[0,1]$) discounts later rewards. MC updates $V(S_t)$ toward this full $G_t$.</p>
       <p>Now truncate it after $n$ real rewards and patch the tail with your current estimate $V(S_{t+n})$. That gives the <b>$n$-step return</b> $G_t^{(n)}$ (the first formula below). Set $n=1$ and you get the TD target $R_{t+1} + \\gamma V(S_{t+1})$; let $n \\to \\infty$ and the bootstrap term vanishes, recovering the MC return $G_t$.</p>
       <p>Which $n$ is best? Rather than choose, <b>average them</b>. The $\\lambda$-return $G_t^{\\lambda}$ is a weighted average of every $n$-step return, with geometrically decaying weights $\\lambda^{n-1}$ (normalized by $(1-\\lambda)$ so they sum to 1). That is the <b>forward view</b>: to update $V(S_t)$, look forward at all future returns. It is clean math but not implementable online — you would have to wait for the episode to end.</p>
       <p>The <b>backward view</b> fixes that. Keep an <b>eligibility trace</b> $e(s)$ per state: a fading memory that spikes when you visit $s$ and decays by $\\gamma\\lambda$ each step. At every step compute the one-step TD error $\\delta_t$ and broadcast it to <i>all</i> states in proportion to their trace. Recently-visited states are still "eligible," so they receive credit too. A remarkable theorem says the backward view and the forward view produce the <b>same</b> total updates (offline, tabular) — so the cheap online traces really do compute the $\\lambda$-return.</p>`,
    symbols: [
      { sym: "$S_t,\\ A_t,\\ R_{t+1}$", desc: "the state at time $t$, the action taken, and the reward received one step later." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek \"gamma\"), a number in $[0,1]$; it shrinks rewards that arrive further in the future." },
      { sym: "$V(s)$", desc: "the current estimate of the value of state $s$ — expected total discounted reward from $s$ onward under the policy. This is what we are learning." },
      { sym: "$G_t$", desc: "the (full) return from time $t$: $R_{t+1}+\\gamma R_{t+2}+\\gamma^2 R_{t+3}+\\dots$, the actual total discounted reward. The Monte Carlo target." },
      { sym: "$G_t^{(n)}$", desc: "the $n$-step return: use $n$ real rewards, then bootstrap from $V(S_{t+n})$. Interpolates between TD ($n=1$) and MC ($n=\\infty$)." },
      { sym: "$G_t^{\\lambda}$", desc: "the $\\lambda$-return: a $\\lambda$-weighted average of all $n$-step returns. The forward-view target of TD(λ)." },
      { sym: "$\\lambda$", desc: "the trace-decay parameter (Greek \"lambda\"), a number in $[0,1]$. It sets how the $n$-step returns are weighted and how far credit spreads back. $0$ = TD, $1$ = MC." },
      { sym: "$\\delta_t$", desc: "the one-step TD error at time $t$: $\\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t)$. The \"surprise\" — how much the new estimate differs from the old." },
      { sym: "$e_t(s)$", desc: "the eligibility trace for state $s$ at time $t$ — a short-term memory of how recently and often $s$ was visited. It decays by $\\gamma\\lambda$ each step." },
      { sym: "$\\alpha$", desc: "the step size / learning rate (Greek \"alpha\"), a small positive number controlling how big each update is." },
      { sym: "$\\nabla$", desc: "in the tabular case, the indicator $\\nabla V(S_t)$ is 1 for the visited state and 0 elsewhere (the gradient of $V$ w.r.t. that state's entry); with function approximation it is $\\nabla_{\\mathbf{w}} \\hat V(S_t)$." }
    ],
    formula: `$$ G_t^{(n)} = R_{t+1} + \\gamma R_{t+2} + \\dots + \\gamma^{n-1} R_{t+n} + \\gamma^{n} V(S_{t+n}) $$
$$ G_t^{\\lambda} = (1-\\lambda) \\sum_{n\\ge 1} \\lambda^{n-1}\\, G_t^{(n)} $$
$$ \\delta_t = R_{t+1} + \\gamma V(S_{t+1}) - V(S_t), \\qquad e_t = \\gamma\\lambda\\, e_{t-1} + \\nabla,\\qquad V \\leftarrow V + \\alpha\\, \\delta_t\\, e_t $$`,
    whatItDoes:
      `<p>The <b>first line</b> is the $n$-step return: walk $n$ real rewards forward, discounting each, then add the discounted current estimate $\\gamma^n V(S_{t+n})$ to stand in for everything past step $n$. Small $n$ trusts the estimate sooner (more bootstrapping); large $n$ uses more real data (less bootstrapping).</p>
       <p>The <b>second line</b> is the $\\lambda$-return: a single target that averages <i>all</i> the $n$-step returns. The weight on the $n$-step return is $(1-\\lambda)\\lambda^{n-1}$ — a geometric series summing to 1 — so shorter horizons dominate and the influence of long horizons fades smoothly. $\\lambda=0$ keeps only the $n=1$ term (TD); $\\lambda=1$ pushes all weight to the longest horizon (MC).</p>
       <p>The <b>third line</b> is the online, backward-view algorithm. Each step: (1) compute the TD error $\\delta_t$ — the surprise; (2) decay every trace by $\\gamma\\lambda$ and bump the just-visited state's trace by $\\nabla$ (accumulating trace); (3) nudge <i>every</i> state's value by $\\alpha\\,\\delta_t\\,e_t(s)$. States visited recently still have a non-zero trace, so a surprise now updates them too — that is credit assignment flowing backward along the trajectory. The symbol $\\leftarrow$ means "is updated to".</p>`,
    derivation:
      `<p><b>1. $n$-step returns interpolate TD and MC.</b> By definition $G_t^{(1)} = R_{t+1} + \\gamma V(S_{t+1})$, which is exactly the one-step TD target. And as $n\\to\\infty$ the bootstrap term $\\gamma^n V(S_{t+n})\\to 0$ (with $\\gamma\\lt 1$, or it hits a terminal value), leaving $G_t^{(\\infty)} = G_t$, the Monte Carlo return. So $n$ is a literal dial from full bootstrap to none.</p>
       <p><b>2. The $\\lambda$-weights are a valid average.</b> The weights are $w_n = (1-\\lambda)\\lambda^{n-1}$ for $n\\ge 1$. Summing the geometric series: $\\sum_{n\\ge1}(1-\\lambda)\\lambda^{n-1} = (1-\\lambda)\\cdot\\frac{1}{1-\\lambda} = 1$. They are non-negative and sum to 1, so $G_t^{\\lambda}$ is a genuine weighted average of the $n$-step returns — not a heuristic. (For an episode that ends at step $T$, all weight from horizons past termination collapses onto the full return $G_t$, with weight $\\lambda^{T-t-1}$.)</p>
       <p><b>3. Forward view → backward view (the trace).</b> The forward view says: $V(S_t)\\leftarrow V(S_t)+\\alpha\\,[\\,G_t^{\\lambda}-V(S_t)\\,]$. A key identity rewrites the $\\lambda$-return error as a discounted sum of <i>future</i> one-step TD errors:</p>
       <p>$$ G_t^{\\lambda} - V(S_t) = \\sum_{k=0}^{\\infty} (\\gamma\\lambda)^{k}\\, \\delta_{t+k}. $$</p>
       <p>So the update owed to state $S_t$ is $\\alpha\\sum_k (\\gamma\\lambda)^k \\delta_{t+k}$ — each future TD error $\\delta_{t+k}$ contributes, discounted by $(\\gamma\\lambda)^k$. Reading it the other way around: a single TD error $\\delta_{t}$ should be sent <i>back</i> to every earlier state $S_{t-k}$ with weight $(\\gamma\\lambda)^k$. That weight, summed over all visits, is exactly the eligibility trace $e_t(s)=\\sum_{k}(\\gamma\\lambda)^{k}\\,\\nabla\\!\\mathbb{1}[S_{t-k}=s]$, which satisfies the recursion $e_t = \\gamma\\lambda\\, e_{t-1} + \\nabla$. Applying $V\\leftarrow V+\\alpha\\,\\delta_t\\,e_t$ every step therefore delivers, in total, the same updates as the forward view — the <b>forward/backward equivalence</b>. $\\blacksquare$</p>`,
    example:
      `<p>Tiny chain: states $S_1 \\to S_2 \\to S_3 \\to$ <b>GOAL</b>. All rewards are 0 until the final step into GOAL, which pays $R=+1$. Take $\\gamma=1$, $\\lambda=0.9$, $\\alpha=0.1$, and start every value at 0: $V(S_1)=V(S_2)=V(S_3)=0$. So $\\gamma\\lambda = 1 \\times 0.9 = 0.9$ &mdash; the per-step trace decay.</p>
       <ul class="steps">
         <li><b>Steps with no surprise.</b> Moving $S_1\\to S_2$ then $S_2\\to S_3$: reward is 0 and every value is 0, so the TD error is $\\delta = 0 + 1\\cdot 0 - 0 = 0$. No value changes yet &mdash; but each visited state's trace is bumped to 1, then decays by $\\gamma\\lambda=0.9$ per step.</li>
         <li><b>Trace bookkeeping.</b> By the time we reach $S_3$: $S_1$ was bumped two steps ago, $S_2$ one step ago, $S_3$ just now, so $e(S_1)=(\\gamma\\lambda)^2=0.9^2=0.81$, $e(S_2)=\\gamma\\lambda=0.9$, $e(S_3)=1.0$.</li>
         <li><b>The surprise at the goal.</b> Stepping $S_3\\to$ GOAL pays $R=+1$; GOAL's value is 0, so $\\delta = 1 + 1\\cdot 0 - V(S_3) = 1 - 0 = 1$.</li>
         <li><b>Credit flows backward in one update.</b> Apply $V(s)\\leftarrow V(s)+\\alpha\\,\\delta\\,e(s)$ to every state at once: $V(S_3)\\mathrel{+}=0.1\\cdot1\\cdot1.0=0.1$; $V(S_2)\\mathrel{+}=0.1\\cdot1\\cdot0.9=0.09$; $V(S_1)\\mathrel{+}=0.1\\cdot1\\cdot0.81=0.081$.</li>
       </ul>
       <table class="extable">
         <caption>One goal reward, credited backward to the whole path in a single update (vs TD(0), which credits only $S_3$).</caption>
         <thead>
           <tr><th>state</th><th class="num">trace $e(s)$</th><th class="num">$\\Delta V = \\alpha\\,\\delta\\,e$</th><th class="num">new $V(s)$</th><th class="num">TD(0) would give</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">$S_3$ (just visited)</td><td class="num">$1.00$</td><td class="num">$0.100$</td><td class="num">$0.100$</td><td class="num">$0.100$</td></tr>
           <tr><td class="row-h">$S_2$ (1 step back)</td><td class="num">$0.90$</td><td class="num">$0.090$</td><td class="num">$0.090$</td><td class="num">$0.000$</td></tr>
           <tr><td class="row-h">$S_1$ (2 steps back)</td><td class="num">$0.81$</td><td class="num">$0.081$</td><td class="num">$0.081$</td><td class="num">$0.000$</td></tr>
         </tbody>
       </table>
       <p><b>Contrast with TD(0).</b> Plain one-step TD ($\\lambda=0$) shrinks every trace to 0 except the just-visited state, so this episode it would update only $V(S_3)$; $S_2$ and $S_1$ would wait for future episodes to feel the goal. With $\\lambda=0.9$, one episode already nudged the entire path toward the right values &mdash; faster credit assignment.</p>`,
    demo: function (host) {
      host.innerHTML = "";
      function C() {
        var s = getComputedStyle(document.documentElement);
        var g = function (n, d) { return (s.getPropertyValue(n) || d).trim(); };
        return { ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"), accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"), border: g("--border", "#2a3340"), panel: g("--panel", "#161c24") };
      }
      var N = 5; // states S1..S5 then GOAL (+1)
      var lam = 0.9, gamma = 1.0, alpha = 0.1;
      var V = new Array(N).fill(0);
      var e = new Array(N).fill(0);
      var pos = 0;       // current state index (0..N-1); reaching N is the goal
      var lastDelta = 0;

      var cv = document.createElement("canvas"); cv.width = 660; cv.height = 240; cv.style.maxWidth = "100%"; host.appendChild(cv);
      var ctx = cv.getContext("2d");
      var readout = document.createElement("div"); readout.className = "out"; readout.style.marginTop = "6px";

      function reset() { V = new Array(N).fill(0); e = new Array(N).fill(0); pos = 0; lastDelta = 0; }

      function step() {
        // step from pos to pos+1; reward is +1 only on entering GOAL
        var ns = pos + 1;
        var reward = (ns === N) ? 1.0 : 0.0;
        var vNext = (ns === N) ? 0.0 : V[ns];
        lastDelta = reward + gamma * vNext - V[pos];
        for (var i = 0; i < N; i++) e[i] *= gamma * lam;
        e[pos] += 1.0;                    // accumulating trace
        for (var j = 0; j < N; j++) V[j] += alpha * lastDelta * e[j];
        pos = ns;
        if (pos >= N) {                  // episode finished; auto-reset position + traces
          pos = 0; for (var k = 0; k < N; k++) e[k] = 0;
        }
        draw();
      }

      var W = 660, H = 240, padL = 30, padR = 16, padT = 18, padB = 40;
      function PX(i) { return padL + (i + 0.5) / (N + 1) * (W - padL - padR); }
      function draw() {
        var c = C(); ctx.clearRect(0, 0, W, H);
        var baseY = H - padB - 10;
        // bars: value (up) and trace (as ring size) per state
        var maxV = Math.max(0.3, Math.max.apply(null, V));
        for (var i = 0; i < N; i++) {
          var x = PX(i);
          var h = (V[i] / maxV) * (H - padT - padB - 30);
          ctx.fillStyle = (i === pos) ? c.accent2 : c.accent;
          ctx.fillRect(x - 22, baseY - h, 44, h);
          // trace ring
          var r = 4 + 16 * Math.min(1, e[i]);
          ctx.strokeStyle = c.warn; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(x, baseY + 18, r, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = c.ink; ctx.font = "12px system-ui"; ctx.textAlign = "center";
          ctx.fillText("S" + (i + 1), x, H - 8);
          ctx.fillStyle = c.dim; ctx.fillText(V[i].toFixed(3), x, baseY - h - 6);
        }
        // GOAL marker
        var gx = PX(N);
        ctx.fillStyle = c.purple; ctx.font = "12px system-ui"; ctx.textAlign = "center";
        ctx.fillText("GOAL +1", gx, baseY + 22);
        readout.innerHTML = "<b>λ = " + lam.toFixed(2) + ", α = " + alpha + ".</b> Blue/green bars = state values $V$; orange rings = eligibility traces $e$ (bigger = more eligible). Last TD error δ = " + lastDelta.toFixed(3) + ". When the goal pays out, the surprise floods <i>backward</i> along the path in proportion to each ring. Lower λ shrinks the rings (credit spreads less far).";
      }

      var row = document.createElement("div"); row.style.margin = "8px 0";
      function mkBtn(label, fn) {
        var b = document.createElement("button");
        b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin-right:8px";
        b.textContent = label; b.addEventListener("click", fn); return b;
      }
      row.appendChild(mkBtn("Step", function () { step(); }));
      row.appendChild(mkBtn("Run episode", function () { for (var i = 0; i < N; i++) step(); }));
      row.appendChild(mkBtn("λ = 0 (TD)", function () { lam = 0.0; draw(); }));
      row.appendChild(mkBtn("λ = 0.9", function () { lam = 0.9; draw(); }));
      row.appendChild(mkBtn("Reset", function () { reset(); draw(); }));
      host.appendChild(row); host.appendChild(readout);
      reset(); draw();
    },
    practice: [
      {
        q: `Write out the 1-step, 2-step, and 3-step returns $G_t^{(1)},G_t^{(2)},G_t^{(3)}$ for a state at time $t$, and say which is closest to a Monte Carlo update.`,
        steps: [
          { do: `Use the definition $G_t^{(n)} = R_{t+1}+\\gamma R_{t+2}+\\dots+\\gamma^{n-1}R_{t+n}+\\gamma^{n}V(S_{t+n})$ for $n=1,2,3$.`, why: `Each adds one more real reward before bootstrapping from $V$.` },
          { do: `Note that larger $n$ uses more actual rewards and relies less on the estimate $V$.`, why: `More real data = closer to Monte Carlo, which uses ALL the rewards.` }
        ],
        answer: `<p>$G_t^{(1)} = R_{t+1} + \\gamma V(S_{t+1})$ (this is the TD(0) target). $G_t^{(2)} = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 V(S_{t+2})$. $G_t^{(3)} = R_{t+1} + \\gamma R_{t+2} + \\gamma^2 R_{t+3} + \\gamma^3 V(S_{t+3})$. The <b>3-step</b> return is closest to Monte Carlo, because it uses the most real rewards before falling back on the bootstrap estimate $V$.</p>`
      },
      {
        q: `With $\\lambda=0.5$, what fraction of the $\\lambda$-return's weight sits on the 1-step return, and what does $\\lambda=0$ do to the $\\lambda$-return?`,
        steps: [
          { do: `The weight on the $n$-step return is $(1-\\lambda)\\lambda^{n-1}$. Plug in $n=1,\\ \\lambda=0.5$.`, why: `That gives the share going to the one-step term.` },
          { do: `Set $\\lambda=0$ in $(1-\\lambda)\\lambda^{n-1}$ for $n=1$ vs $n\\ge2$.`, why: `$0^0=1$ but $0^{k}=0$ for $k\\ge1$, so only the first term survives.` }
        ],
        answer: `<p>Weight on the 1-step return is $(1-0.5)\\cdot0.5^{0} = 0.5$ — half the total. The rest decays geometrically ($0.25$ on the 2-step, $0.125$ on the 3-step, …). Setting $\\lambda=0$ puts weight $(1-0)\\cdot0^{0}=1$ on the 1-step return and $0$ on all others, so $G_t^{\\lambda}=G_t^{(1)}$ — the $\\lambda$-return collapses to pure one-step TD.</p>`
      },
      {
        q: `In a tabular run with $\\gamma=1,\\lambda=0.8$, you visit $S_a$ then $S_b$ then hit a reward giving TD error $\\delta=2$. The traces are $e(S_a)=0.8,\\ e(S_b)=1.0$ and $\\alpha=0.1$. How much does each value change?`,
        steps: [
          { do: `Apply $V(s)\\leftarrow V(s)+\\alpha\\,\\delta\\,e(s)$ to each state.`, why: `Eligibility traces broadcast the single TD error to all states in proportion to their trace.` },
          { do: `Compute $\\alpha\\,\\delta\\,e$ for $S_a$ and $S_b$.`, why: `$S_b$ (more recent, bigger trace) gets more credit than $S_a$.` }
        ],
        answer: `<p>$\\Delta V(S_b) = 0.1\\cdot 2\\cdot 1.0 = 0.2$ and $\\Delta V(S_a) = 0.1\\cdot 2\\cdot 0.8 = 0.16$. The one surprise credits <b>both</b> states in a single update — the more recently visited $S_b$ gets more. Plain TD(0) would have updated only the state where the error occurred.</p>`
      }
    ]
  });

  window.CODE["rl-td-lambda"] = {
    lib: "numpy",
    runnable: false,
    explain: `<p>Tabular TD(λ) prediction with <b>accumulating eligibility traces</b> on the classic 5-state random walk (Sutton &amp; Barto, Example 6.2). States S1–S5 sit between two terminals; the right terminal pays $+1$. Under the random policy the true values are $1/6,\\dots,5/6$. We run TD(λ) for a couple of $\\lambda$ values, print the learned $V$, and compare to the truth. Runs anywhere with numpy — no gym or GPU. (In Colab just paste and run; no <code>!pip</code> needed.)</p>`,
    code: `import numpy as np

# ---- the 5-state random walk: S1..S5, terminals on both ends ----
# Start in the middle (S3). Each step goes left/right with prob 0.5.
# Stepping off the LEFT end gives reward 0; off the RIGHT end gives +1.
# True state values under the random policy: [1/6, 2/6, 3/6, 4/6, 5/6].
N = 5
TRUE_V = np.arange(1, N + 1) / (N + 1)   # [0.167, 0.333, 0.5, 0.667, 0.833]

def run_episode(rng):
    """Return a list of (state, reward, next_state) with next_state=None at a terminal."""
    s = N // 2                           # start in the middle (S3, index 2)
    traj = []
    while True:
        ns = s - 1 if rng.random() < 0.5 else s + 1
        if ns < 0:                       # fell off the left end -> reward 0, terminal
            traj.append((s, 0.0, None)); break
        if ns >= N:                      # fell off the right end -> reward +1, terminal
            traj.append((s, 1.0, None)); break
        traj.append((s, 0.0, ns)); s = ns
    return traj

def td_lambda(lam, alpha=0.05, n_episodes=100, gamma=1.0, seed=0):
    """Tabular TD(lambda) prediction with ACCUMULATING eligibility traces."""
    rng = np.random.RandomState(seed)
    V = np.full(N, 0.5)                   # optimistic-ish init at 0.5
    for _ in range(n_episodes):
        e = np.zeros(N)                  # eligibility traces, reset each episode
        for (s, r, ns) in run_episode(rng):
            v_next = 0.0 if ns is None else V[ns]
            delta = r + gamma * v_next - V[s]        # one-step TD error
            e[s] += 1.0                              # accumulate trace for visited state
            V += alpha * delta * e                   # broadcast error scaled by trace
            e *= gamma * lam                         # decay all traces by gamma*lambda
    return V

# Compare a couple of lambda values against the true values.
for lam in [0.0, 0.8, 1.0]:              # 0.0 = TD(0), 1.0 ~ every-visit MC
    V = td_lambda(lam, alpha=0.05, n_episodes=100, seed=0)
    rms = np.sqrt(np.mean((V - TRUE_V) ** 2))
    print(f"lambda={lam:.1f}  V={np.round(V, 3).tolist()}  RMS={rms:.3f}")

print("true V =", np.round(TRUE_V, 3).tolist())
# lambda=0.0  V=[0.12, 0.304, 0.468, 0.617, 0.794]  RMS=0.06x
# lambda=0.8  V=[0.112, 0.289, 0.423, 0.569, 0.789]  RMS=0.07x
# An intermediate lambda needs FEWER episodes to reach a given error (see CODEVIZ).`
  };

  window.CODEVIZ["rl-td-lambda"] = {
    question: "On the 5-state random walk, how does value-estimate error depend on λ -- the classic U-shape, and the other error-vs-λ shapes you can actually get?",
    charts: [
      {
        type: "line",
        title: "Ideal: U-shape -- an interior λ beats both TD(0) and MC(1) (real numbers, 200 runs)",
        xlabel: "λ (0 = one-step TD, 1 = Monte Carlo)",
        ylabel: "RMS error vs true values (after 10 episodes)",
        series: [
          { name: "TD(λ), α = 0.05", color: "#7ee787", points: [[0.0, 0.1745], [0.2, 0.1686], [0.4, 0.1623], [0.6, 0.156], [0.7, 0.1534], [0.8, 0.1523], [0.9, 0.156], [0.95, 0.1635], [1.0, 0.1831]] }
        ],
        interpret: "<b>x = the λ dial (left edge is one-step TD, right edge is Monte Carlo); y = how far the learned values are from the truth (lower is better).</b> Read the shape, not single points: it sags in the <b>middle</b>. Both ends are worse -- λ=0 (RMS 0.1745) is biased from over-bootstrapping, λ=1 (0.1831) is noisy from full-episode variance -- and the bottom of the bowl at λ≈0.8 (0.1523) is the best of both. The takeaway: blend, don't pick an extreme. Real numbers from the numpy run below; the exact bottom moves with the problem and with α."
      },
      {
        type: "line",
        title: "Variant: faster credit assignment -- error vs EPISODE for TD(0) vs TD(0.9) (illustrative)",
        xlabel: "training episode",
        ylabel: "RMS error vs true values",
        series: [
          { name: "TD(λ = 0.9) -- credits whole path each episode", color: "#7ee787", points: [[0, 0.35], [2, 0.26], [5, 0.19], [10, 0.15], [20, 0.11], [40, 0.085], [80, 0.07]] },
          { name: "TD(λ = 0) -- one state per step", color: "#4ea1ff", points: [[0, 0.35], [2, 0.31], [5, 0.27], [10, 0.22], [20, 0.16], [40, 0.11], [80, 0.08]] }
        ],
        interpret: "<b>Here x is episodes of training and y is error, so a line that drops FASTER is better.</b> Read the early gap: green (λ=0.9) falls faster in the first ~20 episodes because one goal-reward floods credit <b>backward</b> along the whole recent path via eligibility traces, while blue (λ=0) only nudges the single state where the surprise happened and waits for later episodes to propagate it. They meet eventually -- the win from traces is SPEED of credit assignment, not a different fixed point. Illustrative curves; the ordering is the real effect."
      },
      {
        type: "line",
        title: "Variant: α too large -- big λ DIVERGES (the α-λ interaction pitfall, illustrative)",
        xlabel: "λ (0 = one-step TD, 1 = Monte Carlo)",
        ylabel: "RMS error vs true values",
        series: [
          { name: "α small (0.05) -- gentle U", color: "#7ee787", points: [[0.0, 0.175], [0.4, 0.162], [0.8, 0.152], [0.9, 0.156], [1.0, 0.183]] },
          { name: "α large (0.4) -- error explodes as λ rises", color: "#ff7b72", points: [[0.0, 0.19], [0.4, 0.21], [0.6, 0.27], [0.8, 0.41], [0.9, 0.6], [1.0, 0.95]] }
        ],
        interpret: "<b>Same λ axis as the ideal, two step sizes overlaid.</b> Read the red line: instead of a bowl it shoots <b>upward</b> on the right. A bigger λ spreads each update over more states, which effectively amplifies the learning rate -- so an α that is fine at λ=0 can blow up at high λ. The signature to recognise is error RISING with λ (no interior minimum). The fix is to tune α and λ <b>together</b> and shrink α as you raise λ. Illustrative magnitudes; the divergence-at-high-λ shape is the honest warning."
      },
      {
        type: "line",
        title: "Variant: noisy / high-variance task -- minimum shifts toward MC (illustrative)",
        xlabel: "λ (0 = one-step TD, 1 = Monte Carlo)",
        ylabel: "RMS error vs true values",
        series: [
          { name: "low-noise task -- minimum near λ ≈ 0.8", color: "#7ee787", points: [[0.0, 0.17], [0.4, 0.155], [0.8, 0.145], [0.9, 0.15], [1.0, 0.18]] },
          { name: "deterministic-ish task -- bias dominates, lower λ wins", color: "#c89bff", points: [[0.0, 0.13], [0.4, 0.14], [0.7, 0.155], [0.9, 0.18], [1.0, 0.22]] }
        ],
        interpret: "<b>Still error vs λ, but now the bowl's bottom MOVES depending on the environment.</b> Read where each curve dips: green (more stochastic task) bottoms out around λ≈0.8 as before, but purple (a near-deterministic task) has its minimum pushed <b>left toward λ=0</b> -- when there is little randomness, bootstrapping's bias hurts less than MC's variance, so a lower λ wins. The lesson, restated as a pitfall: there is no universal best λ; always plot this curve on a small version of YOUR task. Illustrative shapes."
      }
    ],
    caption: "Four error-vs-λ shapes to recognise: the classic U-shape (interior λ wins, real numbers), error-vs-episode showing traces assign credit FASTER, the α-too-large case where big λ diverges, and a problem-dependent shift of the minimum. Only the first chart uses real numpy output; the variants are illustrative but qualitatively honest.",
    code: `import numpy as np

# 5-state random walk; true values 1/6..5/6 (Sutton & Barto Example 6.2).
N = 5
TRUE_V = np.arange(1, N + 1) / (N + 1)

def run_episode(rng):
    s = N // 2
    traj = []
    while True:
        ns = s - 1 if rng.random() < 0.5 else s + 1
        if ns < 0:   traj.append((s, 0.0, None)); break
        if ns >= N:  traj.append((s, 1.0, None)); break
        traj.append((s, 0.0, ns)); s = ns
    return traj

def td_lambda(lam, alpha, n_episodes, seed, gamma=1.0):
    rng = np.random.RandomState(seed)
    V = np.full(N, 0.5)
    for _ in range(n_episodes):
        e = np.zeros(N)
        for (s, r, ns) in run_episode(rng):
            v_next = 0.0 if ns is None else V[ns]
            delta = r + gamma * v_next - V[s]
            e[s] += 1.0                       # accumulating trace
            V += alpha * delta * e
            e *= gamma * lam
    return V

lambdas = [0.0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0]
K, alpha, n_runs = 10, 0.05, 200          # error after K=10 episodes, averaged
rms_by_lambda = []
for lam in lambdas:
    errs = [np.sqrt(np.mean((td_lambda(lam, alpha, K, seed=run) - TRUE_V) ** 2))
            for run in range(n_runs)]
    rms_by_lambda.append(round(float(np.mean(errs)), 4))

print("lambdas:", lambdas)
print("rms    :", rms_by_lambda)
# rms: [0.1745, 0.1686, 0.1623, 0.156, 0.1534, 0.1523, 0.156, 0.1635, 0.1831]
# -> U-shape: interior lambda ~0.8 beats both lambda=0 (TD) and lambda=1 (MC).`
  };
})();
