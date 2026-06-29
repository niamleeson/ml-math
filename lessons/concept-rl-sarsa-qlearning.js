/* =====================================================================
   REINFORCEMENT LEARNING LESSON
   rl-sarsa-qlearning — TD control: learning the optimal policy
   model-free by updating Q. SARSA (on-policy) vs Q-learning (off-policy),
   contrasted on CliffWalking. Self-contained: registers the lesson, its
   CODE, and its CODEVIZ. Goes deeper than aix-sarsa-td and ai-q-learning.
   ===================================================================== */
(function () {
  window.LESSONS.push({
    id: "rl-sarsa-qlearning",
    title: "TD control: SARSA (on-policy) vs Q-learning (off-policy)",
    tagline: "One update rule learns the policy you follow; swap in a max and the same loop learns the optimal policy instead.",
    module: "Reinforcement Learning",
    prereqs: ["ai-q-learning", "aix-sarsa-td", "ai-mdp", "ai-value-iteration", "aix-monte-carlo", "prob-expectation"],

    whenToUse:
      `<p><b>Reach for tabular TD (Temporal-Difference) control when you must learn how to act in
       a Markov Decision Process you do not have a model of, and the states fit in a table.</b> You
       cannot solve the Bellman equations directly (no transition probabilities given), so you learn
       the action-value function $Q(s,a)$ from sampled experience, one step at a time.</p>
       <p>The two workhorses are <b>SARSA</b> and <b>Q-learning</b>. They share the same loop; they
       differ in one term. Choose between them by what you want to learn:</p>
       <ul>
         <li><b>Q-learning (off-policy)</b> &mdash; when you want the <i>optimal</i> policy's values
           no matter how you explore. It is the tabular ancestor of DQN (Deep Q-Network), so it is the
           default when the goal is the best possible policy.</li>
         <li><b>SARSA (on-policy)</b> &mdash; when <i>safety during learning</i> matters. SARSA learns
           the value of the policy it actually follows (exploration included), so it prefers paths that
           stay safe even when the occasional random move could be costly.</li>
       </ul>
       <p><b>Pick a different tool when:</b> you already have the model (use value iteration /
       <code>ai-value-iteration</code>); you need an unbiased estimate (use Monte Carlo,
       <code>aix-monte-carlo</code>); or the state space is huge or continuous (move to function
       approximation &mdash; <code>mod-dqn</code>).</p>`,

    application:
      `<p>Tabular TD control is the foundation under most of modern RL (Reinforcement Learning).
       Q-learning's off-policy max rule scales up directly into <b>DQN (Deep Q-Network)</b>, which
       mastered Atari from pixels. SARSA's on-policy caution shows up wherever an exploring agent can
       do real damage: robot control, autonomous-vehicle maneuvering, and process control, where you
       would rather learn a safe-while-exploring policy than a razor-thin optimal one. Both rules also
       power small game and routing agents, elevator and traffic-light control, and serve as the clean
       conceptual baseline every deep-RL paper compares against.</p>`,

    pitfalls:
      `<ul>
         <li><b>Confusing on-policy with off-policy.</b> The single difference is the bootstrap target.
           SARSA uses $Q(S',A')$ for the action the behavior policy <i>actually takes</i> next
           (on-policy). Q-learning uses $\\max_{a'} Q(S',a')$ &mdash; the best action, which it may not
           take (off-policy). Mislabel them and you will reason about safety backwards.</li>
         <li><b>The max causes maximization bias.</b> $\\max_{a'} Q(S',a')$ takes the max over noisy
           estimates, and the max of noisy numbers is biased upward, so Q-learning systematically
           over-estimates action values early on. The fix is <b>Double Q-learning</b>: keep two
           tables and use one to pick the action, the other to value it.</li>
         <li><b>$\\varepsilon$ and $\\alpha$ schedules.</b> Too much exploration ($\\varepsilon$ high)
           never lets the greedy policy show; too little gets stuck. The learning rate $\\alpha$ must
           shrink for convergence guarantees but too fast and it freezes. Decay both over training.</li>
         <li><b>Q-learning is risky <i>during</i> training.</b> It learns the cliff-edge optimal path,
           but while $\\varepsilon$-exploring it keeps stepping off the cliff, so its online return is
           worse than SARSA's even though its learned greedy path is shorter (the CODEVIZ below).</li>
         <li><b>Tables do not scale.</b> One row per state means it is hopeless for large or continuous
           spaces. That is the bridge to function approximation and <code>mod-dqn</code>.</li>
       </ul>`,

    bigIdea:
      `<p>You are dropped into a world with no map. You can only act, see the reward, and see where you
       land. <b>TD control</b> learns how to act anyway: it keeps a table $Q(s,a)$ of "how good is
       taking action $a$ in state $s$", and after every single step it nudges one entry toward what it
       just observed.</p>
       <p>The nudge is a <b>bootstrap</b>: the target uses $Q$'s own estimate of the next state. SARSA
       and Q-learning are the same loop with the same $\\varepsilon$-greedy exploration. The <i>only</i>
       difference is which next-state value goes into the target &mdash; and that one choice decides
       whether you learn the policy you follow or the optimal policy.</p>`,

    buildup:
      `<p>At each step the agent is in state $S$, takes action $A$, gets reward $R$, lands in $S'$.
       Both methods form a <b>TD target</b> &mdash; the reward now plus the discounted value of what
       comes next &mdash; and step $Q(S,A)$ a fraction $\\alpha$ toward it.</p>
       <p>The question is: <b>what value of the next state?</b></p>
       <ul>
         <li><b>SARSA</b> also picks the next action $A'$ with its $\\varepsilon$-greedy policy and uses
           $Q(S',A')$ &mdash; the value of the action it will <i>actually</i> take. The name is the
           quintuple it uses: $S, A, R, S', A'$.</li>
         <li><b>Q-learning</b> ignores what it will do next and uses $\\max_{a'} Q(S',a')$ &mdash; the
           value of the <i>best</i> action available in $S'$, whether or not it takes it.</li>
       </ul>
       <p><b>On-policy</b> means the policy being <i>learned</i> is the same policy being <i>followed</i>
       to generate data (SARSA). <b>Off-policy</b> means the policy being learned (the greedy /
       optimal one) differs from the <b>behavior policy</b> that generates data (the $\\varepsilon$-greedy
       explorer) &mdash; Q-learning learns about greedy while behaving exploratorily.</p>`,

    symbols: [
      { sym: "$S$", desc: "the current state the agent is in." },
      { sym: "$A$", desc: "the action taken in $S$ (chosen by the $\\varepsilon$-greedy behavior policy)." },
      { sym: "$R$", desc: "the reward received after taking $A$ in $S$." },
      { sym: "$S'$", desc: "the next state, after taking $A$ (read 'S prime')." },
      { sym: "$A'$", desc: "the next action the agent ACTUALLY takes in $S'$ (SARSA uses this)." },
      { sym: "$Q(S,A)$", desc: "the action-value: estimated return from taking action $A$ in state $S$, then following the policy." },
      { sym: "$\\alpha$", desc: "the learning rate (Greek 'alpha') in $[0,1]$: how far to step toward the target." },
      { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma') in $[0,1]$: future reward counts less." },
      { sym: "$\\max_{a'} Q(S',a')$", desc: "the value of the BEST action available in $S'$ (Q-learning's target uses this)." },
      { sym: "$\\varepsilon$", desc: "the exploration rate (Greek 'epsilon'): probability of a random action instead of the greedy one." },
      { sym: "behavior policy", desc: "the policy that actually picks actions to generate data (here, $\\varepsilon$-greedy)." },
      { sym: "target policy", desc: "the policy whose value we are learning (for Q-learning: the greedy / optimal one)." }
    ],

    formula:
      `$$ \\textbf{SARSA (on-policy):}\\quad Q(S,A) \\leftarrow Q(S,A) + \\alpha\\big[\\, R + \\gamma\\, Q(S',A') - Q(S,A) \\,\\big] $$
       $$ \\textbf{Q-learning (off-policy):}\\quad Q(S,A) \\leftarrow Q(S,A) + \\alpha\\big[\\, R + \\gamma \\max_{a'} Q(S',a') - Q(S,A) \\,\\big] $$`,

    whatItDoes:
      `<p>Both rules compute a <b>TD error</b> &mdash; the bracket &mdash; which is the target minus the
       old estimate, then move $Q(S,A)$ a fraction $\\alpha$ of the way along it. A positive error
       raises the value; a negative one lowers it.</p>
       <p>The targets differ in exactly one term: SARSA's $Q(S',A')$ versus Q-learning's
       $\\max_{a'} Q(S',a')$.</p>
       <ul>
         <li>SARSA bootstraps off the action it will <i>actually</i> take next, so it learns the value
           of its own $\\varepsilon$-greedy behavior &mdash; it "knows" it will sometimes explore and
           bakes that risk into the values. That is what makes it <b>on-policy</b>.</li>
         <li>Q-learning bootstraps off the <i>best</i> action, so it learns the value of the greedy
           (optimal) policy regardless of the exploratory moves it made to get the data. That is what
           makes it <b>off-policy</b>.</li>
       </ul>`,

    derivation:
      `<p>Both rules are sample-based stochastic approximations of a Bellman fixed point. The split is
       which Bellman equation they target.</p>
       <p><b>The two Bellman equations.</b> For a fixed policy $\\pi$, the action-value obeys the
       <i>Bellman expectation equation</i>
       $$ Q^{\\pi}(s,a) = \\mathbb{E}\\big[\\, R + \\gamma\\, Q^{\\pi}(S',A') \\,\\big],\\quad A' \\sim \\pi(\\cdot\\mid S'). $$
       The optimal value obeys the <i>Bellman optimality equation</i>
       $$ Q^{*}(s,a) = \\mathbb{E}\\big[\\, R + \\gamma \\max_{a'} Q^{*}(S',a') \\,\\big]. $$
       The only difference is $Q^{\\pi}(S',A')$ (value of the action $\\pi$ picks) versus
       $\\max_{a'} Q^{*}(S',a')$ (value of the best action).</p>
       <ul class="steps">
         <li><b>SARSA.</b> Define its TD error $\\delta = R + \\gamma Q(S',A') - Q(S,A)$ with $A'$ drawn
           from the same $\\varepsilon$-greedy policy used to act. This is one sampled instance of the
           Bellman <i>expectation</i> equation for the current policy. Stepping
           $Q(S,A) \\leftarrow Q(S,A) + \\alpha\\,\\delta$ drives $\\mathbb{E}[\\delta] \\to 0$, so $Q$
           converges to $Q^{\\pi}$ &mdash; the value of the policy being followed. <b>On-policy.</b></li>
         <li><b>Q-learning.</b> Define $\\delta = R + \\gamma \\max_{a'} Q(S',a') - Q(S,A)$. The max
           does not depend on which action the behavior policy took next, so it is a sampled instance
           of the Bellman <i>optimality</i> equation. The update drives $Q \\to Q^{*}$ regardless of the
           exploratory behavior policy that generated the data. <b>Off-policy.</b> ∎</li>
       </ul>
       <p><b>Why that makes one safe and one risky.</b> SARSA's target includes the occasional random
       $A'$, so a state next to a cliff inherits the cost of the random step that walks off it; SARSA
       therefore values cliff-adjacent states <i>lower</i> and steers away. Q-learning's max pretends
       it will always play optimally next, ignoring its own exploration, so it happily values the
       cliff-edge path as optimal &mdash; and keeps falling in while it explores.</p>`,

    example:
      `<p>One step in a gridworld, fed to BOTH rules so you can see the single-term gap. Current
       $Q(S,A) = 2.0$. The agent takes $A$, gets reward $R = -1$, lands in $S'$ where the
       action-values are $Q(S',\\,\\text{left}) = 3.0$ and $Q(S',\\,\\text{right}) = 5.0$. Its
       $\\varepsilon$-greedy roll this step happens to explore, so it will take $A' = \\text{left}$.
       Use $\\alpha = 0.5$, $\\gamma = 1.0$.</p>
       <ul class="steps">
         <li><b>SARSA &mdash; bootstrap value.</b> Use the action actually taken, $A' = \\text{left}$:
           $Q(S',A') = 3.0$.</li>
         <li><b>SARSA &mdash; target.</b> $R + \\gamma\\, Q(S',A') = -1 + 1.0 \\times 3.0 = 2.0$.</li>
         <li><b>SARSA &mdash; TD error.</b> $\\delta = 2.0 - Q(S,A) = 2.0 - 2.0 = 0.0$.</li>
         <li><b>SARSA &mdash; update.</b> $Q(S,A) \\leftarrow 2.0 + 0.5 \\times 0.0 = 2.0$ (unchanged).</li>
         <li><b>Q-learning &mdash; bootstrap value.</b> Use the best action:
           $\\max_{a'} Q(S',a') = \\max(3.0, 5.0) = 5.0$.</li>
         <li><b>Q-learning &mdash; target.</b> $R + \\gamma \\max_{a'} Q(S',a') = -1 + 1.0 \\times 5.0 = 4.0$.</li>
         <li><b>Q-learning &mdash; TD error.</b> $\\delta = 4.0 - Q(S,A) = 4.0 - 2.0 = 2.0$.</li>
         <li><b>Q-learning &mdash; update.</b> $Q(S,A) \\leftarrow 2.0 + 0.5 \\times 2.0 = 3.0$.</li>
       </ul>
       <table class="extable">
         <caption>Same step, same data &mdash; the two rules side by side.</caption>
         <thead>
           <tr><th>quantity</th><th class="num">SARSA (on-policy)</th><th class="num">Q-learning (off-policy)</th></tr>
         </thead>
         <tbody>
           <tr><td class="row-h">bootstrap value</td><td class="num">$Q(S',A')=3.0$</td><td class="num">$\\max_{a'}Q(S',a')=5.0$</td></tr>
           <tr><td class="row-h">target $R+\\gamma\\cdot(\\text{bootstrap})$</td><td class="num">$2.0$</td><td class="num">$4.0$</td></tr>
           <tr><td class="row-h">TD error $\\delta$</td><td class="num">$0.0$</td><td class="num">$2.0$</td></tr>
           <tr><td class="row-h">new $Q(S,A)$</td><td class="num">$2.0$</td><td class="num">$3.0$</td></tr>
         </tbody>
       </table>
       <p>Q-learning raises the value (it assumes it will play the good action next); SARSA does not
       (it accounts for the exploratory move it will really make). That single-term gap &mdash;
       $Q(S',A')$ vs $\\max_{a'}Q(S',a')$ &mdash; is the whole on- vs off-policy distinction.</p>`,

    demo: function (host) {
      // Side-by-side: same S' with two next-action values; show how SARSA's target
      // (action actually taken) and Q-learning's target (max) differ, and the
      // resulting Q(S,A) update. A slider sets which action epsilon-greedy takes.
      host.innerHTML = "";
      var alpha = 0.5, gamma = 1.0, R = -1;
      var Qsa = 2.0, qLeft = 3.0, qRight = 5.0;
      var takeRight = false; // does epsilon-greedy take the greedy (right) action?
      var c0 = mkCanvas(host, 640, 240), ctx = c0.ctx;
      var out = mkOut(host);
      function draw() {
        var t = C(); ctx.clearRect(0, 0, 640, 240);
        var qNext = takeRight ? qRight : qLeft;
        var sarsaTarget = R + gamma * qNext;
        var qTarget = R + gamma * Math.max(qLeft, qRight);
        var sarsaNew = Qsa + alpha * (sarsaTarget - Qsa);
        var qNew = Qsa + alpha * (qTarget - Qsa);
        ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
        ctx.fillStyle = t.ink; ctx.font = "bold 15px sans-serif";
        ctx.fillText("S'  action-values:   Q(S',left) = " + qLeft.toFixed(1) +
          "    Q(S',right) = " + qRight.toFixed(1), 20, 30);
        ctx.fillStyle = t.dim; ctx.font = "13px sans-serif";
        ctx.fillText("epsilon-greedy this step takes A' = " +
          (takeRight ? "right (greedy)" : "left (explore)"), 20, 54);
        ctx.fillStyle = t.accent; ctx.font = "bold 15px sans-serif";
        ctx.fillText("SARSA  (uses Q(S',A') = " + qNext.toFixed(1) + ")", 20, 110);
        ctx.fillStyle = t.ink; ctx.font = "13px sans-serif";
        ctx.fillText("target = R + gamma*Q(S',A') = " + sarsaTarget.toFixed(1) +
          "   ->   Q(S,A): " + Qsa.toFixed(2) + " -> " + sarsaNew.toFixed(2), 20, 132);
        ctx.fillStyle = t.warn; ctx.font = "bold 15px sans-serif";
        ctx.fillText("Q-learning  (uses max = " + Math.max(qLeft, qRight).toFixed(1) + ")", 20, 180);
        ctx.fillStyle = t.ink; ctx.font = "13px sans-serif";
        ctx.fillText("target = R + gamma*max Q(S',a') = " + qTarget.toFixed(1) +
          "   ->   Q(S,A): " + Qsa.toFixed(2) + " -> " + qNew.toFixed(2), 20, 202);
        out.innerHTML = "Same step, same reward R = " + R + ", alpha = " + alpha +
          ", gamma = " + gamma + ". Q-learning's <span style=\"color:" + t.warn +
          "\">max</span> ignores the action actually taken, so when exploration picks the worse " +
          "action the two updates diverge: SARSA learns the value of what it does, Q-learning the value of what's best.";
      }
      var row = mkRow(host);
      mkBtn(row, "Toggle A' (explore / greedy)", function () { takeRight = !takeRight; draw(); });
      host.insertBefore(c0.cv, host.children[0]);
      host.insertBefore(out, host.children[1]);
      draw();
    },

    practice: [
      {
        q: "In state $S'$ the action-values are $Q(S',\\text{up})=4$, $Q(S',\\text{down})=1$. The agent's $\\varepsilon$-greedy roll explores and takes $A'=\\text{down}$. With $R=0$, $\\gamma=0.9$, write the bootstrap term used by SARSA and by Q-learning.",
        steps: [
          { do: "SARSA uses the action actually taken: $A'=\\text{down}$, so $\\gamma Q(S',A') = 0.9\\times 1 = 0.9$.", why: "On-policy: the target reflects the policy being followed, exploration and all." },
          { do: "Q-learning uses the max: $\\gamma\\max_{a'}Q(S',a') = 0.9\\times 4 = 3.6$.", why: "Off-policy: the target reflects the greedy/optimal policy, ignoring the explored action." }
        ],
        answer: "SARSA bootstrap $=0.9$; Q-learning bootstrap $=3.6$. The gap is exactly $Q(S',A')$ vs $\\max_{a'}Q(S',a')$."
      },
      {
        q: "On CliffWalking, why does Q-learning's average return DURING training come out lower than SARSA's, even though Q-learning learns the shorter optimal path?",
        steps: [
          { do: "Q-learning learns the optimal greedy path: hug the cliff edge for the fewest steps.", why: "Its max target assumes optimal play next, so cliff-edge states look best." },
          { do: "But it still acts $\\varepsilon$-greedily, so it occasionally takes a random step right off the cliff (reward $-100$).", why: "The behavior policy explores; the cliff-edge path has no safety margin for those random steps." },
          { do: "SARSA's on-policy target bakes in those exploratory falls, so it values cliff-adjacent states lower and learns a safer detour.", why: "Accounting for its own exploration, it trades a few extra steps for not falling." }
        ],
        answer: "Q-learning's risky-during-training behavior (optimal path + exploration = frequent cliff falls) lowers its online return below SARSA's safer path, even though its learned greedy path is shorter."
      },
      {
        q: "Define on-policy and off-policy in one sentence each, and say which method is which.",
        steps: [
          { do: "On-policy: the policy being learned is the same policy used to generate the data.", why: "SARSA learns $Q^{\\pi}$ for its own $\\varepsilon$-greedy $\\pi$." },
          { do: "Off-policy: the policy being learned (target) differs from the behavior policy generating the data.", why: "Q-learning learns the greedy $Q^{*}$ while behaving $\\varepsilon$-greedily." }
        ],
        answer: "SARSA is on-policy (learns the followed policy via $Q(S',A')$); Q-learning is off-policy (learns the optimal policy via $\\max_{a'}Q(S',a')$ regardless of behavior)."
      }
    ]
  });

  window.CODE["rl-sarsa-qlearning"] = {
    lib: "Python + NumPy + Gymnasium",
    runnable: false,
    packages: ["numpy", "gymnasium"],
    explain:
      `<p>Tabular Q-learning AND SARSA on Gymnasium's <code>CliffWalking-v0</code>. The two share an
       identical $\\varepsilon$-greedy training loop; the ONLY difference is the bootstrap target
       (the <code>max</code> over next actions for Q-learning vs the value of the action actually taken
       for SARSA). After training we roll out each learned greedy policy and print its path.</p>
       <p>In-browser there is no Gymnasium, so this runs in <b>Colab</b>:
       <code>!pip install gymnasium numpy</code>. Watch the two greedy paths differ: Q-learning hugs
       the cliff edge (optimal), SARSA takes a safer row.</p>`,
    code: `import numpy as np
import gymnasium as gym

# CliffWalking-v0: 4x12 grid, start bottom-left, goal bottom-right, a cliff
# along the bottom row between them. Step reward -1; stepping into the cliff -100
# and reset to start. 48 states, 4 actions (up,right,down,left).
def train(method, episodes=500, alpha=0.5, gamma=1.0, eps=0.1, seed=0):
    env = gym.make("CliffWalking-v0")
    rng = np.random.default_rng(seed)
    nS, nA = env.observation_space.n, env.action_space.n
    Q = np.zeros((nS, nA))

    def egreedy(s):
        if rng.random() < eps:
            return rng.integers(nA)
        return int(np.argmax(Q[s]))

    for ep in range(episodes):
        s, _ = env.reset(seed=seed + ep)
        a = egreedy(s)
        done = False
        while not done:
            s2, r, term, trunc, _ = env.step(a)
            done = term or trunc
            a2 = egreedy(s2)                 # next action the policy WOULD take
            if method == "sarsa":            # ON-POLICY: value of the action actually taken
                target = r + (0 if done else gamma * Q[s2, a2])
            else:                            # Q-LEARNING, OFF-POLICY: value of the best action
                target = r + (0 if done else gamma * np.max(Q[s2]))
            Q[s, a] += alpha * (target - Q[s, a])
            s, a = s2, a2
    env.close()
    return Q

def greedy_path(Q, max_steps=50):
    env = gym.make("CliffWalking-v0")
    s, _ = env.reset(seed=0)
    path = [s]
    for _ in range(max_steps):
        s, r, term, trunc, _ = env.step(int(np.argmax(Q[s])))
        path.append(s)
        if term or trunc:
            break
    env.close()
    return path

Q_sarsa = train("sarsa")
Q_qlearn = train("qlearning")
print("SARSA greedy path length:    ", len(greedy_path(Q_sarsa)))
print("Q-learning greedy path length:", len(greedy_path(Q_qlearn)))
print("SARSA path (states):    ", greedy_path(Q_sarsa))
print("Q-learning path (states):", greedy_path(Q_qlearn))
# Q-learning's path is shorter (hugs the cliff edge, the optimal route);
# SARSA's is one row higher and longer -- the safe route that survives epsilon-exploration.`
  };

  window.CODEVIZ["rl-sarsa-qlearning"] = {
    question: "On a CliffWalking grid, how do SARSA's and Q-learning's average return per episode compare DURING training -- and how do you read the learning curve, the greedy paths, and the maximization bias?",
    charts: [
      {
        type: "line",
        title: "Ideal: online return DURING training -- SARSA (safe) stays above Q-learning (risky)",
        xlabel: "episode (20-episode moving average)",
        ylabel: "average return per episode",
        series: [
          { name: "SARSA (on-policy)", color: "#7ee787", points: [[20, -80.9], [60, -19.4], [100, -17.9], [140, -12.1], [180, -18.4], [220, -12.5], [260, -21.9], [300, -12.4], [340, -17.6], [380, -17.7], [420, -12.1], [460, -12.4], [500, -13.2]] },
          { name: "Q-learning (off-policy)", color: "#ff7b72", points: [[20, -80.6], [60, -23.7], [100, -12.6], [140, -19.8], [180, -18.3], [220, -29.4], [260, -12.8], [300, -28.4], [340, -38.7], [380, -12.9], [420, -18.2], [460, -24.0], [500, -33.1]] }
        ],
        interpret: "<b>x = training episode, y = average reward earned that episode (less negative is better, 0 is the cap).</b> Both curves climb from about -81 (random flailing into the cliff) up toward -15. The thing to read: the green SARSA line sits <b>above and steadier</b> than the red Q-learning line for the whole run. That gap is the headline -- SARSA earns more reward WHILE it is learning. Red's repeated dips toward -30/-40 are episodes where epsilon-exploration shoved it off the cliff edge it learned to hug (-100 each fall). Real numbers: mean of the last 300 episodes is SARSA -17.5 vs Q-learning -26.1."
      },
      {
        type: "scatter",
        title: "Variant: the two learned greedy paths on the grid (illustrative) -- why the curves differ",
        xlabel: "column (0 = start side, 5 = goal side)",
        ylabel: "row (3 = bottom, where the cliff is)",
        groups: [
          { name: "Q-learning path (hugs cliff edge)", color: "#ff7b72", points: [[0, 3], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [5, 3]] },
          { name: "SARSA path (safe detour, one row up)", color: "#7ee787", points: [[0, 3], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [5, 3]] },
          { name: "cliff cells (-100, reset to start)", color: "#9aa7b4", points: [[1, 3], [2, 3], [3, 3], [4, 3]] }
        ],
        interpret: "<b>This is the grid seen from above; each dot is a cell the greedy policy walks through.</b> Grey = the cliff along the bottom row. Read it as two routes from start (left) to goal (right): red runs <b>right along the cliff edge</b> -- the shortest, optimal path -- while green takes a <b>safer detour one row higher</b>, a few steps longer. Illustrative coordinates, but the shape is the real result: Q-learning's max target values the cliff-edge path as best (it assumes it plays optimally next), SARSA's on-policy target bakes in the occasional random step and steers away. Shorter is not the same as higher-earning while you still explore."
      },
      {
        type: "line",
        title: "Variant: maximization bias -- Q-learning over-estimates action values early (illustrative)",
        xlabel: "training episode",
        ylabel: "max learned Q-value at the start state",
        series: [
          { name: "true optimal value", color: "#9aa7b4", points: [[0, -13], [100, -13], [200, -13], [300, -13], [400, -13], [500, -13]] },
          { name: "Q-learning estimate (overshoots, then settles)", color: "#ff7b72", points: [[0, 0], [50, -2], [100, -5], [150, -7.5], [200, -9.5], [300, -11.5], [400, -12.5], [500, -13]] },
          { name: "SARSA / Double-Q (no upward bias)", color: "#7ee787", points: [[0, -2], [50, -9], [100, -12], [150, -13.2], [200, -13.5], [300, -13.2], [400, -13.1], [500, -13]] }
        ],
        interpret: "<b>x = episode, y = the value the agent THINKS the start state is worth; grey dashed is the truth (-13).</b> Read the red line: it sits <b>above</b> the true value for a long stretch -- Q-learning's max-over-noisy-estimates is biased upward, so it is over-optimistic early. Green dips at or below the truth and is not pulled up. The fix named in the pitfalls is Double Q-learning (two tables: one picks the action, the other values it), which removes the upward bow. Illustrative shapes, qualitatively honest: the signature you are looking for is a red curve that approaches the truth FROM ABOVE."
      },
      {
        type: "line",
        title: "Variant: tiny epsilon / no cliff -- the two methods converge together (illustrative)",
        xlabel: "episode (20-episode moving average)",
        ylabel: "average return per episode",
        series: [
          { name: "SARSA", color: "#7ee787", points: [[20, -70], [60, -25], [100, -14], [200, -12], [300, -11.5], [400, -11.2], [500, -11]] },
          { name: "Q-learning", color: "#4ea1ff", points: [[20, -72], [60, -26], [100, -14.5], [200, -12], [300, -11.4], [400, -11.2], [500, -11]] }
        ],
        interpret: "<b>Same axes as the ideal chart, but here the two curves sit on top of each other.</b> When there is no costly trap (no cliff) OR epsilon is tiny so the agent almost never explores, SARSA's safety advantage disappears: the random step it guards against rarely happens, so both learn -- and earn -- essentially the same thing. Read this as a reminder that the SARSA-vs-Q-learning gap is NOT universal -- it shows up only when exploration can be expensive. Illustrative; the lesson is the overlap, not the exact values."
      }
    ],
    caption: "Four ways to read this concept: the online learning curve (SARSA earns more during training), the two greedy paths on the grid (cliff-hug vs safe detour), the maximization-bias signature (Q-learning over-estimates from above), and the degenerate case where no cliff / tiny epsilon makes them identical. The first chart uses real numbers from the NumPy run below; the variants are illustrative but qualitatively honest.",
    code: `import numpy as np
np.random.seed(0)

# Tiny CliffWalking-like grid: 4 rows x 6 cols. Start = bottom-left (3,0),
# goal = bottom-right (3,5). Cliff = bottom row cells (3,1)..(3,4):
# stepping in gives reward -100 and resets to start. Every other step: -1.
ROWS, COLS = 4, 6
START, GOAL = (3, 0), (3, 5)
CLIFF = set((3, c) for c in range(1, 5))
ACTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]   # up, down, left, right
nS, nA = ROWS * COLS, 4
sid = lambda r, c: r * COLS + c

def step(r, c, a):
    dr, dc = ACTIONS[a]
    nr, nc = min(max(r + dr, 0), ROWS - 1), min(max(c + dc, 0), COLS - 1)
    if (nr, nc) in CLIFF:  return START[0], START[1], -100.0, False
    if (nr, nc) == GOAL:   return nr, nc, -1.0, True
    return nr, nc, -1.0, False

def egreedy(Q, s, eps):
    return np.random.randint(nA) if np.random.rand() < eps else int(np.argmax(Q[s]))

def run(method, episodes=500, alpha=0.5, gamma=1.0, eps=0.1):
    Q = np.zeros((nS, nA)); returns = []
    for ep in range(episodes):
        r, c = START; s = sid(r, c); a = egreedy(Q, s, eps)
        G = 0.0; done = False; steps = 0
        while not done and steps < 200:
            nr, nc, rew, done = step(r, c, a); ns = sid(nr, nc); G += rew
            na = egreedy(Q, ns, eps)
            if method == "sarsa":                    # on-policy target
                target = rew + (0 if done else gamma * Q[ns, na])
            else:                                    # off-policy target (the max)
                target = rew + (0 if done else gamma * np.max(Q[ns]))
            Q[s, a] += alpha * (target - Q[s, a])
            r, c = nr, nc; s = ns; a = na; steps += 1
        returns.append(G)
    return np.array(returns)

Rs, Rq = run("sarsa"), run("qlearning")
smooth = lambda x, w=20: np.convolve(x, np.ones(w) / w, mode="valid")
Ss, Sq = smooth(Rs), smooth(Rq)
xs = list(range(20, 501, 40))
print("episode:   ", xs)
print("SARSA:     ", [round(float(Ss[x - 20]), 1) for x in xs])
print("Q-learning:", [round(float(Sq[x - 20]), 1) for x in xs])
print("mean last 300 -> SARSA", round(float(Rs[200:].mean()), 1),
      "| Q-learning", round(float(Rq[200:].mean()), 1))`
  };
})();
