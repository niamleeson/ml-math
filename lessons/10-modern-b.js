/* =====================================================================
   MODULE 10 (part B) — MODERN DEEP LEARNING & AI.
   Seven lessons: graph neural nets, deep Q-networks, policy gradients,
   actor-critic, contrastive/self-supervised learning, vision transformers,
   and time-series forecasting.
   Same beginner style as the earlier modules:
     - short sentences, one idea each
     - every symbol defined in plain English BEFORE it is used
     - a worked example with real numbers
     - a real derivation, ending in ∎
     - a real-world application
     - a bespoke interactive demo that renders on load
   Each lesson is an object pushed into window.LESSONS.
   ===================================================================== */
(function () {
const M = "Modern Deep Learning & AI";
const L = (o) => window.LESSONS.push(Object.assign({ module: M }, o));

/* ---- shared theme + canvas helpers for bespoke demos ---- */
function C() {
  var s = (typeof getComputedStyle === "function") ? getComputedStyle(document.documentElement) : null;
  var g = function (n, d) { try { return ((s && s.getPropertyValue(n)) || d).trim(); } catch (e) { return d; } };
  return {
    ink: g("--ink", "#e6edf3"), dim: g("--ink-dim", "#9aa7b4"), accent: g("--accent", "#4ea1ff"),
    accent2: g("--accent-2", "#7ee787"), warn: g("--warn", "#ffb454"), purple: g("--purple", "#c89bff"),
    border: g("--border", "#2a3340"), panel: g("--panel", "#161c24")
  };
}
function mkCanvas(host, w, h) {
  var cv = document.createElement("canvas"); cv.width = w; cv.height = h; host.appendChild(cv);
  return { cv: cv, ctx: cv.getContext("2d") };
}
function mkBtn(host, label, cb) {
  var b = document.createElement("button"); b.textContent = label;
  b.style.cssText = "background:var(--panel);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:7px 12px;cursor:pointer;font-size:13px;margin:0 8px 0 0";
  b.addEventListener("click", cb); host.appendChild(b); return b;
}
function mkRow(host) { var d = document.createElement("div"); d.style.margin = "8px 0"; host.appendChild(d); return d; }
function mkOut(host) { var d = document.createElement("div"); d.className = "out"; d.style.cssText = "margin-top:8px;font-size:14px;line-height:1.6"; host.appendChild(d); return d; }

/* ================================================================ */
/* 1. GRAPH NEURAL NETWORKS                                         */
/* ================================================================ */
L({
  id: "mod-gnn",
  title: "Graph Neural Networks (message passing)",
  tagline: "Each node updates itself by averaging its neighbours, then squishing. Do that a few times and the whole graph 'talks'.",
  prereqs: ["dl-backprop", "dl-forward-prop"],
  bigIdea:
    `<p>A <b>graph</b> is dots (nodes) joined by lines (edges). Think of friends and friendships, or atoms and bonds.</p>
     <p>A <b>Graph Neural Network</b> gives every node a small list of numbers (its features). Then it lets nodes share with their neighbours.</p>
     <p>The sharing rule is called <b>message passing</b>: each node collects its neighbours' features, averages them, and uses that to update itself.</p>`,
  buildup:
    `<p>You already know a neuron: multiply by a weight, add up, then squish. A GNN (Graph Neural Network) does the same, but the inputs are a node's neighbours.</p>
     <p>One round of message passing lets a node hear from its direct neighbours. A second round lets it hear from neighbours-of-neighbours. Information spreads.</p>`,
  symbols: [
    { sym: "$v$", desc: "one node (a dot) in the graph." },
    { sym: "$N(v)$", desc: "the neighbours of $v$: every node joined to $v$ by an edge." },
    { sym: "$h_v$", desc: "the feature vector of node $v$: the list of numbers describing it right now." },
    { sym: "$h_u$", desc: "the feature vector of a neighbour $u$ (one of the nodes in $N(v)$)." },
    { sym: "$\\text{agg}$", desc: "the aggregate step: combine the neighbours' features into one, usually by averaging them." },
    { sym: "$W$", desc: "a weight matrix, shared by all nodes. It reshapes the aggregated features (learned during training)." },
    { sym: "$\\sigma$", desc: "an activation function (Greek 'sigma'), like ReLU (Rectified Linear Unit). Adds a bend so the network can learn curves." },
    { sym: "$h_v'$", desc: "the updated feature vector of $v$ (the prime mark means 'after this round')." }
  ],
  formula: `$$ h_v' = \\sigma\\!\\big(\\, W \\cdot \\text{agg}\\big(\\{\\, h_u : u \\in N(v) \\,\\}\\big) \\big) $$`,
  whatItDoes:
    `<p>Read it as: "look at all of node $v$'s neighbours, average their feature lists, multiply by a weight matrix, then squish."</p>
     <p>The result $h_v'$ is the node's new feature list. Every node does this at the same time, using the <i>same</i> weights $W$.</p>
     <p>Stack a few rounds and each node's features summarize a growing neighbourhood around it.</p>`,
  derivation:
    `<p>Why does averaging neighbours make sense? We want a node's update to ignore the <i>order</i> the neighbours are listed in. A graph has no first or last neighbour.</p>
     <ul class="steps">
       <li>Start with a wish: the aggregate must give the same answer no matter how we shuffle $N(v)$. This property is called <b>permutation invariance</b>.</li>
       <li>The mean of a set has exactly this property: $\\text{mean}(\\{a,b\\}) = \\text{mean}(\\{b,a\\})$. Sum and max work too.</li>
       <li>So choose $\\text{agg} = \\frac{1}{|N(v)|}\\sum_{u\\in N(v)} h_u$, the average of the neighbour features.</li>
       <li>Now reshape it with a learned weight matrix and add a bend: $h_v' = \\sigma(W\\cdot\\text{agg})$. Because $W$ is shared by every node, the rule works on a graph of any size.</li>
     </ul>
     <p>That is the whole layer: a permutation-invariant average, a shared linear map, an activation. ∎</p>`,
  example:
    `<p>One node $v$ has two neighbours. To keep the numbers tiny, each feature is a single number.</p>
     <ul class="steps">
       <li>Neighbour features: $h_{u_1} = 4$ and $h_{u_2} = 2$.</li>
       <li>Aggregate by averaging: $\\text{agg} = \\frac{4 + 2}{2} = 3$.</li>
       <li>Apply the weight $W = 0.5$: $W\\cdot\\text{agg} = 0.5 \\times 3 = 1.5$.</li>
       <li>Squish with ReLU (keep positives): $h_v' = \\max(0, 1.5) = 1.5$.</li>
     </ul>
     <p>Node $v$'s new value $1.5$ was pulled from its neighbours' $4$ and $2$. That is one message-passing step.</p>`,
  application:
    `<p>GNNs predict whether a molecule is a useful drug (nodes are atoms), recommend friends or products (nodes are users and items), and route traffic on maps. Google Maps uses a GNN to estimate arrival times across the road graph.</p>`,
  demo: function (host) {
    host.innerHTML = "";
    // small graph; click a node to update it from the mean of its neighbours.
    var W = 640, H = 360;
    var nodes = {
      A: { x: 150, y: 90, v: 4 }, B: { x: 320, y: 60, v: 1 }, C: { x: 500, y: 110, v: 7 },
      D: { x: 120, y: 260, v: 2 }, E: { x: 320, y: 290, v: 5 }, F: { x: 510, y: 260, v: 3 }
    };
    var adj = { A: ["B", "D"], B: ["A", "C", "E"], C: ["B", "F"], D: ["A", "E"], E: ["B", "D", "F"], F: ["C", "E"] };
    var edges = [["A", "B"], ["B", "C"], ["A", "D"], ["B", "E"], ["D", "E"], ["E", "F"], ["C", "F"]];
    var Wmat = 0.9;
    var keys = Object.keys(nodes);
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var lastUpdated = null;
    function relu(z) { return Math.max(0, z); }
    function updateNode(k) {
      var nb = adj[k];
      var sum = 0; for (var i = 0; i < nb.length; i++) sum += nodes[nb[i]].v;
      var agg = sum / nb.length;
      var nv = relu(Wmat * agg);
      nodes[k].v = nv; lastUpdated = k;
      out.innerHTML = "Updated node <b>" + k + "</b>: neighbours " + nb.join(", ") +
        " have mean = <b>" + agg.toFixed(2) + "</b>. New value = ReLU(" + Wmat + " × " + agg.toFixed(2) +
        ") = <b>" + nv.toFixed(2) + "</b>.<br>Click any node to pull in its neighbours. Click many times to watch values spread across the graph.";
      draw();
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 2; ctx.strokeStyle = t.border;
      edges.forEach(function (e) {
        var a = nodes[e[0]], b = nodes[e[1]];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
      keys.forEach(function (k) {
        var n = nodes[k];
        var hot = Math.max(0, Math.min(1, n.v / 8));
        var fill = "rgba(78,161,255," + (0.18 + 0.5 * hot).toFixed(3) + ")";
        ctx.beginPath();
        ctx.fillStyle = fill; ctx.strokeStyle = (k === lastUpdated) ? t.accent2 : t.accent;
        ctx.lineWidth = (k === lastUpdated) ? 4 : 2.5;
        ctx.arc(n.x, n.y, 28, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = t.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.font = "bold 14px sans-serif"; ctx.fillText(k, n.x, n.y - 7);
        ctx.font = "12px sans-serif"; ctx.fillText(n.v.toFixed(2), n.x, n.y + 9);
      });
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
    }
    c.cv.style.cursor = "pointer";
    c.cv.addEventListener("click", function (ev) {
      var rect = c.cv.getBoundingClientRect();
      var mx = (ev.clientX - rect.left) * (W / rect.width);
      var my = (ev.clientY - rect.top) * (H / rect.height);
      for (var i = 0; i < keys.length; i++) {
        var n = nodes[keys[i]];
        if ((mx - n.x) * (mx - n.x) + (my - n.y) * (my - n.y) <= 28 * 28) { updateNode(keys[i]); return; }
      }
    });
    var row = mkRow(host);
    mkBtn(row, "Update a random node", function () { updateNode(keys[Math.floor(Math.random() * keys.length)]); });
    mkBtn(row, "Reset values", function () {
      nodes.A.v = 4; nodes.B.v = 1; nodes.C.v = 7; nodes.D.v = 2; nodes.E.v = 5; nodes.F.v = 3;
      lastUpdated = null;
      out.innerHTML = "Each node holds one number (its feature). Click a node: it becomes ReLU(W × mean of its neighbours).";
      draw();
    });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    out.innerHTML = "Each node holds one number (its feature). Click a node: it becomes ReLU(W × mean of its neighbours).";
    draw();
  },
  quiz: {
    q: `A node has neighbours with features $6$, $0$, and $3$. With $W = 1$ and ReLU, what is the node's new feature?`,
    a: `<p>Average the neighbours: $\\frac{6 + 0 + 3}{3} = 3$. Apply $W=1$: $1\\times3 = 3$. ReLU keeps it: $\\max(0,3) = 3$.</p>`
  }
});

/* ================================================================ */
/* 2. DEEP Q-NETWORKS                                               */
/* ================================================================ */
L({
  id: "mod-dqn",
  title: "Deep Q-Networks (DQN)",
  tagline: "Let a neural net guess the value of each move. Train it to match reward-now plus the best value next.",
  prereqs: ["ai-q-learning", "dl-backprop"],
  bigIdea:
    `<p>Q-learning keeps a value $Q(s,a)$ for every state-action pair. But real games have far too many states to list.</p>
     <p>A <b>Deep Q-Network</b> replaces that giant table with a neural network. The net reads a state and outputs a $Q$ value for each action.</p>
     <p>Two tricks keep it stable: <b>experience replay</b> (reuse past moves) and a <b>target network</b> (a slow copy used for the goal).</p>`,
  buildup:
    `<p>From Q-learning you know the idea: a move is good if its reward now, plus the discounted best value of where you land, is high.</p>
     <p>DQN trains the net so its output $Q(s,a)$ matches that goal, called the <b>TD target</b>. "TD" means temporal difference: compare your guess to a slightly better guess one step later.</p>`,
  symbols: [
    { sym: "$s$", desc: "the current state (what the agent sees right now)." },
    { sym: "$a$", desc: "an action the agent can take." },
    { sym: "$Q(s,a)$", desc: "the network's estimate of how good action $a$ is in state $s$." },
    { sym: "$r$", desc: "the reward received after taking action $a$." },
    { sym: "$s'$", desc: "the next state, landed in after the action ($s$-prime)." },
    { sym: "$a'$", desc: "a candidate next action, used to score the next state." },
    { sym: "$\\gamma$", desc: "the discount factor (Greek 'gamma'), between $0$ and $1$. Future reward counts a little less." },
    { sym: "$\\max_{a'}$", desc: "'the largest over all next actions'. Picks the best the agent could do next." },
    { sym: "$y$", desc: "the TD target: the goal value the network is trained to match." }
  ],
  formula: `$$ y = r + \\gamma \\max_{a'} Q(s', a') \\qquad\\quad \\text{loss} = \\big(\\, y - Q(s,a) \\,\\big)^2 $$`,
  whatItDoes:
    `<p>The target $y$ says: "the move's true value should be the reward I just got, plus the discounted value of the best move next."</p>
     <p>The loss measures how far the network's current guess $Q(s,a)$ is from that target. Backprop nudges the weights to shrink it.</p>
     <p><b>Replay</b> stores past $(s,a,r,s')$ moves and re-samples them, so training is not dominated by the latest, correlated moves. The <b>target network</b> holds $Q(s',a')$ fixed for a while, so the goal is not a moving blur.</p>`,
  derivation:
    `<p>Where does the squared loss come from? We want the network's guess to obey the Bellman equation $Q(s,a) = r + \\gamma\\max_{a'}Q(s',a')$.</p>
     <ul class="steps">
       <li>Define the <b>TD error</b> as the gap between the two sides: $\\delta = \\big(r + \\gamma\\max_{a'}Q(s',a')\\big) - Q(s,a) = y - Q(s,a)$.</li>
       <li>If $\\delta = 0$ everywhere, the network already satisfies Bellman, so we want to drive $\\delta$ to zero.</li>
       <li>Penalize being away from zero with the square: $\\text{loss} = \\delta^2 = (y - Q(s,a))^2$. Squaring makes both signs hurt and is smooth to differentiate.</li>
       <li>Its slope is $\\frac{\\partial\\,\\text{loss}}{\\partial Q} = -2(y - Q(s,a))$, which backprop pushes through the net to update the weights. We treat $y$ as fixed (held by the target network), so only $Q(s,a)$ moves toward $y$.</li>
     </ul>
     <p>Minimizing the squared TD error is exactly fitting the Bellman equation. ∎</p>`,
  example:
    `<p>The net currently guesses $Q(s,a) = 4$. The agent acts, gets reward $r = 1$, and lands in $s'$ where the best next value is $\\max_{a'}Q(s',a') = 6$. Use $\\gamma = 0.9$.</p>
     <ul class="steps">
       <li>TD target: $y = 1 + 0.9 \\times 6 = 1 + 5.4 = 6.4$.</li>
       <li>TD error: $\\delta = y - Q(s,a) = 6.4 - 4 = 2.4$.</li>
       <li>Loss: $\\delta^2 = 2.4^2 = 5.76$.</li>
       <li>Training nudges $Q(s,a)$ up from $4$ toward $6.4$, shrinking the error.</li>
     </ul>`,
  application:
    `<p>DQN famously learned to play dozens of Atari games straight from raw pixels, reaching human level on many. The same recipe drives game AI and control problems where the state space is far too big for a table.</p>`,
  demo: function (host) {
    host.innerHTML = "";
    // 1x5 corridor; goal at the right. A "net" holds Q per cell; Step does one TD sweep.
    var N = 5, gamma = 0.9, r_step = 0, r_goal = 1;
    var W = 600, H = 150, cz = 100, ox = 40, oy = 20;
    var Q;
    function reset() { Q = []; for (var i = 0; i < N; i++) Q[i] = 0; Q[N - 1] = r_goal; draw("Q starts flat at 0, goal cell pinned at +1. Press Step to run one TD update."); }
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    function step() {
      // for each non-goal cell, target = r + gamma * max(neighbour Q). Move right or stay.
      var nQ = Q.slice();
      for (var i = 0; i < N - 1; i++) {
        var right = Q[i + 1];               // best is to move toward the goal
        var stay = Q[i];
        var best = Math.max(right, stay);
        var target = r_step + gamma * best;
        nQ[i] = Q[i] + 0.5 * (target - Q[i]);   // half-step blend
      }
      Q = nQ;
      draw("One TD sweep done. Each cell moved halfway toward r + γ·max(next Q). Values sharpen toward the goal.");
    }
    function draw(msg) {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      for (var i = 0; i < N; i++) {
        var x = ox + i * cz, y = oy;
        var goal = (i === N - 1);
        var hot = Math.max(0, Math.min(1, Q[i]));
        ctx.fillStyle = goal ? "rgba(126,231,135,0.45)" : "rgba(78,161,255," + (0.12 + 0.5 * hot).toFixed(3) + ")";
        ctx.fillRect(x, y, cz - 6, cz - 6);
        ctx.strokeStyle = t.border; ctx.lineWidth = 1; ctx.strokeRect(x, y, cz - 6, cz - 6);
        ctx.fillStyle = t.ink; ctx.font = "bold 18px sans-serif";
        ctx.fillText(Q[i].toFixed(2), x + (cz - 6) / 2, y + 32);
        ctx.fillStyle = goal ? t.accent2 : t.dim; ctx.font = "12px sans-serif";
        ctx.fillText(goal ? "GOAL +1" : "Q(s" + i + ")", x + (cz - 6) / 2, y + 62);
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = (msg || "") + "<br>γ = " + gamma + ". After enough sweeps, Q(s0) → " +
        Math.pow(gamma, N - 1).toFixed(3) + " (the discounted value of reaching the goal).";
    }
    var row = mkRow(host);
    mkBtn(row, "Step (one TD update)", step);
    mkBtn(row, "Reset", reset);
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset();
  },
  quiz: {
    q: `The net guesses $Q(s,a) = 2$. After acting, $r = 0$ and the best next value is $5$, with $\\gamma = 0.8$. What is the TD target $y$?`,
    a: `<p>$y = r + \\gamma\\max_{a'}Q(s',a') = 0 + 0.8\\times5 = 4$. Training pushes $Q(s,a)$ from $2$ toward $4$.</p>`
  }
});

/* ================================================================ */
/* 3. POLICY GRADIENTS (REINFORCE)                                  */
/* ================================================================ */
L({
  id: "mod-policy-gradient",
  title: "Policy gradients (REINFORCE)",
  tagline: "Skip the value table. Directly raise the chance of actions that led to a big reward.",
  prereqs: ["ai-q-learning", "dl-cross-entropy", "ml-gradient-descent"],
  bigIdea:
    `<p>DQN learns values, then acts greedily. <b>Policy gradients</b> skip that. They learn the <b>policy</b> itself: the probability of each action.</p>
     <p>The rule is wonderfully direct: if an action led to a high reward, make it more likely next time. If it led to a low reward, make it less likely.</p>
     <p>The basic version is called <b>REINFORCE</b>.</p>`,
  buildup:
    `<p>The policy $\\pi(a\\mid s)$ is a probability: given state $s$, how likely is action $a$? A neural net outputs these probabilities.</p>
     <p>We run a full episode, add up the reward it earned (the <b>return</b> $G$), and use $G$ to decide which actions to encourage.</p>
     <p>The math uses $\\nabla\\log\\pi$: the direction in weight-space that makes the chosen action more probable.</p>`,
  symbols: [
    { sym: "$s$", desc: "a state the agent is in." },
    { sym: "$a$", desc: "the action the agent actually took." },
    { sym: "$\\pi(a\\mid s)$", desc: "the policy: the probability of taking action $a$ in state $s$ (Greek 'pi')." },
    { sym: "$\\theta$", desc: "the weights of the policy network (Greek 'theta'). Adjusting them changes the probabilities." },
    { sym: "$G$", desc: "the return: the total reward collected in the episode." },
    { sym: "$\\log\\pi(a\\mid s)$", desc: "the natural log of the action's probability. Bigger probability gives a larger (less negative) log." },
    { sym: "$\\nabla$", desc: "the gradient (an upside-down triangle): the direction that increases the thing it acts on." },
    { sym: "$E[\\,\\cdot\\,]$", desc: "the expected value: the long-run average over many episodes." },
    { sym: "$J$", desc: "the objective: the average return we want to make as large as possible." }
  ],
  formula: `$$ \\nabla_\\theta J = E\\big[\\, \\nabla_\\theta \\log \\pi(a \\mid s)\\; G \\,\\big] $$`,
  whatItDoes:
    `<p>Read it as: "to improve, step in the direction that raises $\\log\\pi(a\\mid s)$, scaled by the return $G$."</p>
     <p>If $G$ is large and positive, we push hard to make that action more likely. If $G$ is negative, the same term pushes the action's probability <i>down</i>.</p>
     <p>Because we only need to sample actions and rewards, this works even when we have no model of the world at all.</p>`,
  derivation:
    `<p>We want the gradient of the expected return $J(\\theta) = E_{a\\sim\\pi}[\\,G\\,]$. The trouble is the average is over the policy, which itself depends on $\\theta$.</p>
     <ul class="steps">
       <li>Write the average as a sum over actions weighted by probability: $J = \\sum_a \\pi(a\\mid s)\\,G(a)$.</li>
       <li>Differentiate: $\\nabla_\\theta J = \\sum_a \\nabla_\\theta \\pi(a\\mid s)\\,G(a)$. The return $G$ does not depend on $\\theta$ here.</li>
       <li>Use the <b>log trick</b>: $\\nabla_\\theta \\pi = \\pi \\cdot \\nabla_\\theta\\log\\pi$, since $\\nabla\\log\\pi = \\frac{\\nabla\\pi}{\\pi}$. Substitute it in.</li>
       <li>Now $\\nabla_\\theta J = \\sum_a \\pi(a\\mid s)\\,\\nabla_\\theta\\log\\pi(a\\mid s)\\,G(a)$. A probability-weighted sum is exactly an expectation, so $\\nabla_\\theta J = E\\big[\\nabla_\\theta\\log\\pi(a\\mid s)\\,G\\big]$.</li>
     </ul>
     <p>The log trick turns a hard-to-sample gradient into a simple average we can estimate by just running episodes. ∎</p>`,
  example:
    `<p>One state, two actions, with preferences (logits) $\\ell_{\\text{Left}} = 0$ and $\\ell_{\\text{Right}} = 0$. The softmax gives Left $0.5$ and Right $0.5$. The agent samples <b>Right</b> and the episode returns $G = +2$. Use learning rate $\\eta = 0.4$.</p>
     <ul class="steps">
       <li>The score for the chosen action is $\\nabla_\\ell \\log\\pi(\\text{Right}) = 1 - \\pi(\\text{Right}) = 1 - 0.5 = 0.5$. (For the other action it is $0 - 0.5 = -0.5$.)</li>
       <li>Update each logit by $\\eta\\,G\\times(\\text{score})$: Right gets $0.4\\times2\\times0.5 = +0.4$, Left gets $0.4\\times2\\times(-0.5) = -0.4$.</li>
       <li>New logits $\\ell_{\\text{Right}} = 0.4$, $\\ell_{\\text{Left}} = -0.4$. Re-softmax: $\\pi(\\text{Right}) = \\frac{e^{0.4}}{e^{0.4}+e^{-0.4}} = \\frac{1.49}{1.49+0.67} \\approx 0.69$, so Left $\\approx 0.31$.</li>
       <li>Right rose from $0.5$ to $0.69$ <i>because</i> $G = +2 &gt; 0$. Had $G = -2$, every sign flips: Right would fall to $\\approx 0.31$ and Left rise. The reward's sign sets the update's direction.</li>
     </ul>`,
  application:
    `<p>Policy gradients power robotics (smooth, continuous controls), game-playing agents, and the alignment step of chatbots: RLHF (Reinforcement Learning from Human Feedback) tunes a language model's policy to prefer responses humans rated highly.</p>`,
  demo: function (host) {
    host.innerHTML = "";
    // One state, 3 actions. Bars = probabilities. Each episode, sample an action,
    // give reward, nudge probabilities (softmax over preferences).
    var W = 600, H = 260;
    var acts = ["Left", "Stay", "Right"];
    var rewards = [0.2, 0.5, 1.0];      // Right is best
    var pref = [0, 0, 0];               // logits
    var lr = 0.6, ep = 0;
    function probs() {
      var m = Math.max(pref[0], pref[1], pref[2]);
      var e = pref.map(function (p) { return Math.exp(p - m); });
      var s = e[0] + e[1] + e[2];
      return e.map(function (x) { return x / s; });
    }
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var lastA = -1, lastG = 0;
    function episode() {
      var p = probs();
      // sample an action
      var u = Math.random(), cum = 0, a = 2;
      for (var i = 0; i < 3; i++) { cum += p[i]; if (u <= cum) { a = i; break; } }
      var G = rewards[a];
      // REINFORCE: pref[i] += lr * G * (1{i==a} - p[i])
      for (var j = 0; j < 3; j++) pref[j] += lr * G * ((j === a ? 1 : 0) - p[j]);
      lastA = a; lastG = G; ep++;
      draw();
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var p = probs();
      var baseY = 210, bw = 110, gap = 60, ox = 70;
      ctx.textAlign = "center";
      for (var i = 0; i < 3; i++) {
        var x = ox + i * (bw + gap), h = p[i] * 160;
        ctx.fillStyle = (i === lastA) ? t.accent2 : t.accent;
        ctx.fillRect(x, baseY - h, bw, h);
        ctx.strokeStyle = t.border; ctx.lineWidth = 1; ctx.strokeRect(x, baseY - h, bw, h);
        ctx.fillStyle = t.ink; ctx.font = "bold 14px sans-serif";
        ctx.fillText((p[i] * 100).toFixed(0) + "%", x + bw / 2, baseY - h - 10);
        ctx.fillStyle = t.dim; ctx.font = "13px sans-serif";
        ctx.fillText(acts[i], x + bw / 2, baseY + 20);
        ctx.fillStyle = t.purple; ctx.font = "11px sans-serif";
        ctx.fillText("reward " + rewards[i].toFixed(1), x + bw / 2, baseY + 38);
      }
      ctx.textAlign = "start";
      out.innerHTML = "Episode <b>" + ep + "</b>. " +
        (lastA >= 0 ? ("Sampled <b>" + acts[lastA] + "</b>, return G = <b>" + lastG.toFixed(1) +
          "</b>. Pushed its probability " + (lastG > 0 ? "up" : "down") + ".") : "Press Run episode to start.") +
        "<br>Right pays the most, so its bar should grow toward 100% over many episodes.";
    }
    var row = mkRow(host);
    mkBtn(row, "Run episode", episode);
    mkBtn(row, "Run 10", function () { for (var i = 0; i < 10; i++) episode(); });
    mkBtn(row, "Reset", function () { pref = [0, 0, 0]; ep = 0; lastA = -1; lastG = 0; draw(); });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  quiz: {
    q: `An action was sampled and the episode return was $G = -3$. Which way does $\\nabla\\log\\pi(a\\mid s)\\,G$ move that action's probability?`,
    a: `<p>Down. The $\\nabla\\log\\pi$ term alone would raise the action's probability, but multiplying by the negative return $G=-3$ flips it, so the action becomes <i>less</i> likely.</p>`
  }
});

/* ================================================================ */
/* 4. ACTOR-CRITIC / A2C / PPO                                      */
/* ================================================================ */
L({
  id: "mod-actor-critic",
  title: "Actor-Critic — A2C (Advantage Actor-Critic), PPO (Proximal Policy Optimization)",
  tagline: "One net picks actions, a second net judges the state. Update the actor by how much better an action did than expected.",
  prereqs: ["mod-policy-gradient", "ai-value-iteration"],
  bigIdea:
    `<p>Plain policy gradients use the full episode return $G$, which is noisy. <b>Actor-Critic</b> reduces that noise.</p>
     <p>It uses two networks. The <b>actor</b> is the policy: it picks actions. The <b>critic</b> estimates the value $V(s)$: how good a state is.</p>
     <p>The actor is updated by the <b>advantage</b> $A = Q - V$: how much better an action turned out than the state's average.</p>`,
  buildup:
    `<p>From policy gradients: we scale the update by how good the outcome was. Using the raw return $G$ is high-variance.</p>
     <p>Subtract a <b>baseline</b>, the state's value $V(s)$. Now we ask: did this action beat the state's average, or fall short?</p>
     <p>That difference is the advantage. A positive advantage means "better than expected", so push the action up.</p>`,
  symbols: [
    { sym: "$s$", desc: "the current state." },
    { sym: "$a$", desc: "the action taken by the actor." },
    { sym: "$V(s)$", desc: "the critic's value: the expected return from state $s$ (its average future reward)." },
    { sym: "$Q(s,a)$", desc: "the value of taking action $a$ in $s$, then continuing. Estimated as $r + \\gamma V(s')$." },
    { sym: "$r$", desc: "the reward received after the action." },
    { sym: "$s'$", desc: "the next state ($s$-prime)." },
    { sym: "$\\gamma$", desc: "the discount factor, between $0$ and $1$. Future reward counts a little less." },
    { sym: "$A(s,a)$", desc: "the advantage: how much better action $a$ did than the state's average, $Q - V$." },
    { sym: "$\\pi(a\\mid s)$", desc: "the actor's policy: probability of action $a$ in $s$." }
  ],
  formula: `$$ A(s,a) = Q(s,a) - V(s) = \\big(\\, r + \\gamma V(s') \\,\\big) - V(s) \\qquad \\nabla_\\theta J = E\\big[\\, \\nabla_\\theta \\log\\pi(a\\mid s)\\, A(s,a) \\,\\big] $$`,
  whatItDoes:
    `<p>The critic estimates $V(s)$. We turn one observed step into a value estimate for the action: $Q \\approx r + \\gamma V(s')$.</p>
     <p>The advantage $A = Q - V$ is positive when the action beat expectations, negative when it disappointed.</p>
     <p>The actor update is the policy gradient, but scaled by $A$ instead of $G$. Better-than-average actions get encouraged; worse-than-average ones get discouraged. <b>PPO</b> adds a clip so each update step stays small and stable.</p>`,
  derivation:
    `<p>Why is subtracting the baseline $V(s)$ allowed without biasing the gradient? Because the expected value of the score term is zero.</p>
     <ul class="steps">
       <li>Start from the policy gradient with a baseline $b(s)$ that does not depend on the action: $\\nabla J = E[\\nabla\\log\\pi(a\\mid s)\\,(G - b(s))]$.</li>
       <li>Split it: $E[\\nabla\\log\\pi\\,G] - E[\\nabla\\log\\pi\\,b(s)]$. We must show the second term is zero.</li>
       <li>Since $b(s)$ is constant over actions, $E_a[\\nabla\\log\\pi(a\\mid s)] = \\sum_a \\pi\\,\\nabla\\log\\pi = \\sum_a \\nabla\\pi = \\nabla\\sum_a \\pi = \\nabla 1 = 0$ (probabilities always sum to one).</li>
       <li>So the baseline drops out of the expectation: it changes nothing on average, but it shrinks the variance. Choosing $b(s) = V(s)$ replaces $G$ with the advantage $A = Q - V$.</li>
     </ul>
     <p>Same direction, far less noise. That is why Actor-Critic learns faster and steadier. ∎</p>`,
  example:
    `<p>The critic says the state is worth $V(s) = 5$. The agent takes an action, gets reward $r = 1$, and lands in $s'$ with $V(s') = 6$. Use $\\gamma = 0.9$.</p>
     <ul class="steps">
       <li>One-step action value: $Q = r + \\gamma V(s') = 1 + 0.9\\times6 = 1 + 5.4 = 6.4$.</li>
       <li>Advantage: $A = Q - V(s) = 6.4 - 5 = 1.4$.</li>
       <li>$A &gt; 0$, so the action did better than the state's average. The actor pushes its probability up.</li>
       <li>The critic also nudges $V(s)$ up toward $6.4$, since it under-valued the state.</li>
     </ul>`,
  application:
    `<p>Actor-Critic methods (A2C, A3C (Asynchronous Advantage Actor-Critic), PPO) are the modern default for reinforcement learning: they trained the OpenAI Five Dota 2 team, control simulated and real robots, and run the reinforcement step (PPO) in many chatbot alignment pipelines.</p>`,
  demo: function (host) {
    host.innerHTML = "";
    // Left: actor (3 action probs). Right: critic value bar. Step shows advantage.
    var W = 620, H = 280;
    var acts = ["Left", "Stay", "Right"];
    var rewards = [0.0, 0.3, 1.0];
    var pref = [0, 0, 0];
    var V = 0.3;                 // critic value estimate
    var gamma = 0.9, lrA = 0.7, lrC = 0.3, ep = 0;
    var lastA = -1, lastAdv = 0;
    function probs() {
      var m = Math.max(pref[0], pref[1], pref[2]);
      var e = pref.map(function (p) { return Math.exp(p - m); });
      var s = e[0] + e[1] + e[2];
      return e.map(function (x) { return x / s; });
    }
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    function step() {
      var p = probs();
      var u = Math.random(), cum = 0, a = 2;
      for (var i = 0; i < 3; i++) { cum += p[i]; if (u <= cum) { a = i; break; } }
      var r = rewards[a];
      var Vnext = 0;                       // single-step episode; terminal next state
      var Q = r + gamma * Vnext;
      var adv = Q - V;                     // advantage
      for (var j = 0; j < 3; j++) pref[j] += lrA * adv * ((j === a ? 1 : 0) - p[j]);  // actor
      V = V + lrC * adv;                   // critic moves toward Q
      lastA = a; lastAdv = adv; ep++;
      draw();
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var p = probs();
      ctx.textAlign = "center";
      // actor panel (left half)
      ctx.fillStyle = t.dim; ctx.font = "13px sans-serif";
      ctx.fillText("ACTOR  π(a|s)", 160, 24);
      var baseY = 220, bw = 70, gap = 28, ox = 50;
      for (var i = 0; i < 3; i++) {
        var x = ox + i * (bw + gap), h = p[i] * 150;
        ctx.fillStyle = (i === lastA) ? t.accent2 : t.accent;
        ctx.fillRect(x, baseY - h, bw, h);
        ctx.fillStyle = t.ink; ctx.font = "bold 12px sans-serif";
        ctx.fillText((p[i] * 100).toFixed(0) + "%", x + bw / 2, baseY - h - 9);
        ctx.fillStyle = t.dim; ctx.font = "12px sans-serif";
        ctx.fillText(acts[i], x + bw / 2, baseY + 18);
      }
      // critic panel (right)
      ctx.fillStyle = t.dim; ctx.font = "13px sans-serif";
      ctx.fillText("CRITIC  V(s)", 500, 24);
      var cx = 480, ch = Math.max(0, Math.min(1, V)) * 150;
      ctx.fillStyle = t.purple; ctx.fillRect(cx, baseY - ch, 80, ch);
      ctx.strokeStyle = t.border; ctx.strokeRect(cx, baseY - 150, 80, 150);
      ctx.fillStyle = t.ink; ctx.font = "bold 13px sans-serif";
      ctx.fillText("V = " + V.toFixed(2), cx + 40, baseY - ch - 10);
      ctx.textAlign = "start";
      out.innerHTML = "Episode <b>" + ep + "</b>. " +
        (lastA >= 0 ? ("Actor chose <b>" + acts[lastA] + "</b>. Advantage A = Q − V = <b>" + lastAdv.toFixed(2) +
          "</b> (" + (lastAdv >= 0 ? "better" : "worse") + " than the critic expected), so the action was " +
          (lastAdv >= 0 ? "encouraged" : "discouraged") + ".") : "Press Step to run one episode.") +
        "<br>The critic V(s) drifts toward the average reward; the actor leans toward Right (reward 1.0).";
    }
    var row = mkRow(host);
    mkBtn(row, "Step", step);
    mkBtn(row, "Run 10", function () { for (var i = 0; i < 10; i++) step(); });
    mkBtn(row, "Reset", function () { pref = [0, 0, 0]; V = 0.3; ep = 0; lastA = -1; lastAdv = 0; draw(); });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  quiz: {
    q: `The critic says $V(s) = 4$. The agent gets reward $r = 2$ and lands in $s'$ with $V(s') = 5$, with $\\gamma = 1$. What is the advantage $A$?`,
    a: `<p>$Q = r + \\gamma V(s') = 2 + 1\\times5 = 7$. Then $A = Q - V(s) = 7 - 4 = 3$. Positive, so this action beat the state's average and gets encouraged.</p>`
  }
});

/* ================================================================ */
/* 5. CONTRASTIVE / SELF-SUPERVISED LEARNING                        */
/* ================================================================ */
L({
  id: "mod-contrastive",
  title: "Contrastive learning (SimCLR, CLIP)",
  tagline: "Pull two views of the same thing together, push everything else apart. No labels needed.",
  prereqs: ["dl-cross-entropy", "dl-forward-prop"],
  bigIdea:
    `<p>Labels are expensive. <b>Self-supervised learning</b> learns useful features from raw data with no human labels.</p>
     <p><b>Contrastive learning</b> is one way. Take an image, make two altered copies (crop, recolour). These are a <b>positive pair</b>: they should land close together in feature space.</p>
     <p>Every other image is a <b>negative</b>: it should be pushed away. Pull positives together, push negatives apart.</p>`,
  buildup:
    `<p>An <b>embedding</b> is the network's output vector for an input: a point in a feature space.</p>
     <p>We measure closeness with <b>similarity</b>, usually the cosine of the angle between two embeddings: $+1$ means same direction, $0$ means unrelated.</p>
     <p>The loss rewards high similarity for the positive pair and low similarity for the anchor against every negative.</p>`,
  symbols: [
    { sym: "$z_i$", desc: "the embedding of the anchor: the network's output vector for one view." },
    { sym: "$z_j$", desc: "the embedding of its positive: a different augmented view of the same input." },
    { sym: "$z_k$", desc: "the embedding of a negative: a different input entirely." },
    { sym: "$\\text{sim}(a,b)$", desc: "cosine similarity: $+1$ if $a$ and $b$ point the same way, $0$ if unrelated, $-1$ if opposite." },
    { sym: "$\\tau$", desc: "the temperature (Greek 'tau'), a small positive number that sharpens the comparison." },
    { sym: "$\\exp$", desc: "the exponential function $e^{(\\cdot)}$; turns a similarity into a positive weight." },
    { sym: "$\\sum_k$", desc: "a sum over all the negatives $k$ (plus the positive in the denominator)." },
    { sym: "$\\ell_i$", desc: "the loss for one anchor (lowercase Greek 'ell'). Small when the positive stands out." }
  ],
  formula: `$$ \\ell_i = -\\log \\frac{\\exp\\!\\big(\\text{sim}(z_i, z_j)/\\tau\\big)}{\\displaystyle\\sum_{k} \\exp\\!\\big(\\text{sim}(z_i, z_k)/\\tau\\big)} $$`,
  whatItDoes:
    `<p>This is just cross-entropy in disguise. Think of it as a classification: "which of all these embeddings is my true positive?"</p>
     <p>The numerator is the positive pair's similarity (made into a weight). The denominator sums the positive plus all the negatives.</p>
     <p>The loss is small when the positive's similarity dominates the sum, i.e. the anchor and its positive are close and the negatives are far. Minimizing it pulls positives together and pushes negatives apart.</p>`,
  derivation:
    `<p>Why does minimizing $\\ell_i$ pull the positive close? Look at the fraction inside the log.</p>
     <ul class="steps">
       <li>Let $p = \\frac{\\exp(s_{ij}/\\tau)}{\\sum_k \\exp(s_{ik}/\\tau)}$, where $s_{ij} = \\text{sim}(z_i,z_j)$. This $p$ is a softmax probability, always in $(0,1)$.</li>
       <li>The loss is $\\ell_i = -\\log p$. Since $\\log$ increases, minimizing $-\\log p$ is the same as maximizing $p$.</li>
       <li>To make $p$ near $1$, the positive term $\\exp(s_{ij}/\\tau)$ must dominate the denominator. That happens when $s_{ij}$ is large (positive close) and every negative $s_{ik}$ is small (negatives far).</li>
       <li>The temperature $\\tau$ controls sharpness: dividing by a small $\\tau$ exaggerates differences, so the hardest negatives (the close, confusing ones) get the strongest push.</li>
     </ul>
     <p>So the single loss simultaneously attracts the positive and repels the negatives. ∎</p>`,
  example:
    `<p>Tiny 2D embeddings. Anchor $z_i = (1, 0)$. Its positive $z_j = (0.8, 0.6)$ points almost the same way; a negative $z_k = (-0.6, 0.8)$ points off sideways. Use $\\tau = 1$.</p>
     <ul class="steps">
       <li>Cosine similarity is the dot product over the lengths. Each vector here has length $1$, so $\\text{sim} = z_i\\cdot z$. Positive: $\\text{sim}(z_i,z_j) = 1{\\times}0.8 + 0{\\times}0.6 = 0.8$ (close). Negative: $\\text{sim}(z_i,z_k) = 1{\\times}(-0.6) + 0{\\times}0.8 = -0.6$ (far apart).</li>
       <li>Turn each into a weight: positive $\\exp(0.8) \\approx 2.23$, negative $\\exp(-0.6) \\approx 0.55$.</li>
       <li>Probability of the positive: $\\frac{2.23}{2.23 + 0.55} = \\frac{2.23}{2.78} \\approx 0.80$.</li>
       <li>Loss: $\\ell = -\\log(0.80) \\approx 0.22$. The gap $0.8$ vs $-0.6$ already makes the positive dominate; pulling it closer (toward sim $+1$) or pushing the negative further (toward sim $-1$) shrinks the loss further.</li>
     </ul>`,
  application:
    `<p>SimCLR learns image features with no labels, then a tiny labelled set fine-tunes a strong classifier. CLIP uses the same idea across types: it pulls an image and its caption together, which is how text-to-image search and many generative models connect words to pictures.</p>`,
  demo: function (host) {
    host.innerHTML = "";
    // Embedding plane. Anchor + positive (pull close, green); negatives (push away, red).
    var W = 560, H = 360, cx = W / 2, cy = H / 2;
    var anchor, pos, negs;
    function reset() {
      anchor = { x: 0.2, y: 0.1 };
      pos = { x: -1.4, y: 1.3 };
      negs = [{ x: 1.6, y: 1.2 }, { x: 1.4, y: -1.3 }, { x: -1.5, y: -1.1 }];
      step = 0;
    }
    var lr = 0.18, step = 0;
    var scale = 90;
    function toPx(p) { return { x: cx + p.x * scale, y: cy - p.y * scale }; }
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    function dist(a, b) { return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y)); }
    function doStep() {
      // pull positive toward anchor
      pos.x += lr * (anchor.x - pos.x); pos.y += lr * (anchor.y - pos.y);
      // push each negative away from anchor (small repulsion)
      negs.forEach(function (n) {
        var dx = n.x - anchor.x, dy = n.y - anchor.y;
        var d = Math.sqrt(dx * dx + dy * dy) + 0.001;
        var push = lr * 0.9 / d;
        var nx = n.x + push * dx, ny = n.y + push * dy;
        n.x = Math.max(-2.6, Math.min(2.6, nx));
        n.y = Math.max(-1.8, Math.min(1.8, ny));
      });
      step++; draw();
    }
    function dot(p, col, lab) {
      var q = toPx(p);
      ctx.beginPath(); ctx.fillStyle = col; ctx.arc(q.x, q.y, 9, 0, 7); ctx.fill();
      ctx.fillStyle = col; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText(lab, q.x, q.y - 14);
    }
    function link(a, b, col) {
      var p = toPx(a), q = toPx(b);
      ctx.beginPath(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); ctx.setLineDash([]);
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = t.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
      link(anchor, pos, t.accent2);
      negs.forEach(function (n) { link(anchor, n, "#ff7b72"); });
      negs.forEach(function (n) { dot(n, "#ff7b72", "neg"); });
      dot(pos, t.accent2, "positive");
      dot(anchor, t.accent, "anchor");
      ctx.textAlign = "start";
      var dp = dist(anchor, pos);
      out.innerHTML = "Step <b>" + step + "</b>. <span style=\"color:" + t.accent2 + "\">Green</span> = anchor + its positive (pulled together). " +
        "<span style=\"color:#ff7b72\">Red</span> = negatives (pushed away).<br>anchor-to-positive distance = <b>" + dp.toFixed(2) +
        "</b>. Press Step to move them; the positive should close in while negatives drift out.";
    }
    var row = mkRow(host);
    mkBtn(row, "Step", doStep);
    mkBtn(row, "Run 8", function () { for (var i = 0; i < 8; i++) doStep(); });
    mkBtn(row, "Reset", function () { reset(); draw(); });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    reset(); draw();
  },
  quiz: {
    q: `With $\\tau = 1$, the positive similarity is $\\text{sim} = 1.0$ and a single negative has $\\text{sim} = 0$. What probability does the positive get? (Use $e^{1}\\approx 2.72$, $e^{0}=1$.)`,
    a: `<p>$\\frac{e^{1}}{e^{1} + e^{0}} = \\frac{2.72}{2.72 + 1} = \\frac{2.72}{3.72} \\approx 0.73$. The loss is $-\\log(0.73) \\approx 0.31$.</p>`
  }
});

/* ================================================================ */
/* 6. VISION TRANSFORMERS                                           */
/* ================================================================ */
L({
  id: "mod-vit",
  title: "Vision Transformers (ViT)",
  tagline: "Chop an image into patches, treat each patch as a word, and let attention mix them.",
  prereqs: ["dl-forward-prop", "dl-cross-entropy"],
  bigIdea:
    `<p>Transformers conquered language by treating a sentence as a sequence of word tokens. A <b>Vision Transformer</b> does the same to images.</p>
     <p>It slices the image into a grid of small square <b>patches</b>. Each patch becomes one token, like a word.</p>
     <p>Then the standard transformer runs <b>attention</b> over the patches, so any patch can look at any other, no matter how far apart.</p>`,
  buildup:
    `<p>A patch is just a block of pixels. Flatten its pixels into a vector and multiply by a weight matrix to get a fixed-size <b>patch embedding</b>: the token.</p>
     <p>Because a grid has no built-in order, we add a <b>position embedding</b> so the model knows where each patch sat.</p>
     <p>Attention then scores how much each patch should attend to every other patch.</p>`,
  symbols: [
    { sym: "$H \\times W$", desc: "the image height and width in pixels." },
    { sym: "$P$", desc: "the patch size: each patch is a $P \\times P$ square of pixels." },
    { sym: "$N$", desc: "the number of patches (tokens) the image is cut into." },
    { sym: "$x_p$", desc: "the flattened pixels of one patch $p$ (its pixels laid out in a row)." },
    { sym: "$E$", desc: "the embedding matrix that turns a flattened patch into a token vector." },
    { sym: "$E_{pos}$", desc: "the position embedding added so each token knows its grid location." },
    { sym: "$\\text{token}_p$", desc: "the final token for patch $p$: its embedded pixels plus its position." }
  ],
  formula: `$$ N = \\frac{H \\times W}{P^2} \\qquad\\quad \\text{token}_p = x_p E + E_{pos}(p) $$`,
  whatItDoes:
    `<p>The first formula counts patches: divide the image area by the patch area. A $48\\times48$ image with $P=16$ gives $\\frac{48\\times48}{16^2} = 9$ patches.</p>
     <p>The second builds each token: flatten the patch's pixels, multiply by $E$ to get an embedding, then add the position vector for that patch.</p>
     <p>These $N$ tokens feed into the transformer. Attention lets a patch showing an ear attend to a patch showing the other ear, helping the model recognize the whole cat.</p>`,
  derivation:
    `<p>Why is the patch count $N = HW/P^2$, and why patches at all instead of single pixels?</p>
     <ul class="steps">
       <li>A grid of $P\\times P$ patches tiles the image with no overlap. Along the height it fits $H/P$ patches; along the width, $W/P$.</li>
       <li>Total patches: $\\frac{H}{P}\\times\\frac{W}{P} = \\frac{HW}{P^2}$. That is the formula.</li>
       <li>Why not feed one token per pixel? Attention cost grows like $N^2$ (every token attends to every token). For a $224\\times224$ image that is $\\approx 50{,}000$ pixels, so $N^2 \\approx 2.5$ billion comparisons. Far too many.</li>
       <li>Patching with $P=16$ shrinks $N$ to $\\frac{224\\times224}{256} = 196$ tokens, so $N^2 \\approx 38{,}000$: easily affordable. The patch embedding $x_pE$ packs each block's pixels into one vector with no loss of the transformer's reach.</li>
     </ul>
     <p>Patches make attention over images tractable while keeping the global-mixing power. ∎</p>`,
  example:
    `<p>An image is $H = 48$ by $W = 48$ pixels. Use patch size $P = 16$.</p>
     <ul class="steps">
       <li>Patches along each side: $48 \\div 16 = 3$. So the grid is $3 \\times 3$.</li>
       <li>Total tokens: $N = \\frac{48 \\times 48}{16^2} = \\frac{2304}{256} = 9$.</li>
       <li>Each patch holds $16\\times16 = 256$ pixels (per colour channel). Flatten and embed them into one token vector.</li>
       <li>Add each token's position (which of the 9 cells it came from). Now attention can relate any token to any other.</li>
       <li>Why patches pay off: attention costs $N^2$ comparisons. With $9$ patch tokens that is $9^2 = 81$. One token <i>per pixel</i> instead would be $N = 2304$ tokens, costing $2304^2 \\approx 5.3$ million — about $65{,}000\\times$ more. Patching is what makes attention over an image affordable.</li>
     </ul>`,
  application:
    `<p>Vision Transformers match or beat convolutional networks on image classification when trained on enough data. They are the image backbone of multimodal models (the vision side of systems that take both pictures and text), and power modern image search and captioning.</p>`,
  demo: function (host) {
    host.innerHTML = "";
    // 4x4 patch grid; numbered tokens. Click a patch -> attention links to all others.
    var GRID = 4, cell = 70, ox = 40, oy = 30;
    var W = 620, H = 360;
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var sel = 5;   // selected token index (0..15)
    function center(i) {
      var r = Math.floor(i / GRID), col = i % GRID;
      return { x: ox + col * cell + cell / 2, y: oy + r * cell + cell / 2 };
    }
    function attnWeight(from, to) {
      if (from === to) return 1;
      var a = center(from), b = center(to);
      var d = Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
      return Math.exp(-d / 90);     // nearer patches get more attention
    }
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      var wsum = 0; for (var k = 0; k < GRID * GRID; k++) wsum += attnWeight(sel, k);
      var sc = center(sel);
      for (var j = 0; j < GRID * GRID; j++) {
        if (j === sel) continue;
        var w = attnWeight(sel, j) / wsum;
        var tc = center(j);
        ctx.beginPath();
        ctx.strokeStyle = "rgba(200,155,255," + (0.15 + 2.5 * w).toFixed(3) + ")";
        ctx.lineWidth = 1 + 8 * w;
        ctx.moveTo(sc.x, sc.y); ctx.lineTo(tc.x, tc.y); ctx.stroke();
      }
      for (var i = 0; i < GRID * GRID; i++) {
        var r = Math.floor(i / GRID), col = i % GRID;
        var x = ox + col * cell, y = oy + r * cell;
        var isSel = (i === sel);
        var shade = 22 + ((r + col) % 2) * 14 + (i % 3) * 5;
        ctx.fillStyle = isSel ? "rgba(78,161,255,0.35)" : "hsl(205,25%," + shade + "%)";
        ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
        ctx.strokeStyle = isSel ? t.accent : t.border; ctx.lineWidth = isSel ? 3 : 1;
        ctx.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
        ctx.fillStyle = t.ink; ctx.font = "bold 13px sans-serif";
        ctx.fillText("t" + i, x + cell / 2, y + cell / 2);
      }
      ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
      out.innerHTML = "A 4×4 grid = <b>16 patch tokens</b> (t0…t15). Selected token <b>t" + sel +
        "</b> sends <span style=\"color:" + t.purple + "\">attention links</span> to every other patch; " +
        "thicker, brighter = more attention.<br>Click any patch to see what it attends to.";
    }
    c.cv.style.cursor = "pointer";
    c.cv.addEventListener("click", function (ev) {
      var rect = c.cv.getBoundingClientRect();
      var mx = (ev.clientX - rect.left) * (W / rect.width);
      var my = (ev.clientY - rect.top) * (H / rect.height);
      var col = Math.floor((mx - ox) / cell), r = Math.floor((my - oy) / cell);
      if (col >= 0 && col < GRID && r >= 0 && r < GRID) { sel = r * GRID + col; draw(); }
    });
    var row = mkRow(host);
    mkBtn(row, "Pick a random token", function () { sel = Math.floor(Math.random() * GRID * GRID); draw(); });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  quiz: {
    q: `An image is $32 \\times 32$ pixels and the patch size is $P = 8$. How many patch tokens are there?`,
    a: `<p>$N = \\frac{H\\times W}{P^2} = \\frac{32\\times32}{8^2} = \\frac{1024}{64} = 16$ tokens (a $4\\times4$ grid).</p>`
  }
});

/* ================================================================ */
/* 7. TIME-SERIES FORECASTING (ARIMA / STATE-SPACE)                 */
/* ================================================================ */
L({
  id: "mod-timeseries",
  title: "Time-series forecasting — ARIMA (AutoRegressive Integrated Moving Average)",
  tagline: "Predict the next value from recent values and recent surprises, then give a range, not just a point.",
  prereqs: ["ml-gradient-descent"],
  bigIdea:
    `<p>A <b>time series</b> is numbers in order over time: daily sales, hourly temperature, a stock price.</p>
     <p><b>ARIMA</b> forecasts the next value from the recent past. Its name is three ideas: <b>AR</b> (autoregression), <b>I</b> (integration / differencing), <b>MA</b> (moving average).</p>
     <p>It also gives a <b>prediction interval</b>: a shaded band saying "the true value will probably land in here", which widens as we look further ahead.</p>`,
  buildup:
    `<p><b>AR</b> says today depends on recent days: a weighted sum of past values.</p>
     <p><b>MA</b> says today also depends on recent <b>errors</b> (surprises): a weighted sum of past prediction misses.</p>
     <p><b>Differencing (I)</b> subtracts each value from the one before it. A series that keeps trending up becomes a flat, steady series, which AR and MA handle better.</p>`,
  symbols: [
    { sym: "$y_t$", desc: "the series value at time $t$ (today's number)." },
    { sym: "$y_{t-1}$", desc: "the value one step earlier (yesterday)." },
    { sym: "$\\phi$", desc: "an AR coefficient (Greek 'phi'): how much a past value influences today." },
    { sym: "$\\varepsilon_t$", desc: "the error (Greek 'epsilon') at time $t$: today's surprise, the part the model did not predict." },
    { sym: "$\\theta$", desc: "an MA coefficient (Greek 'theta'): how much a past surprise influences today." },
    { sym: "$c$", desc: "a constant offset (a baseline level)." },
    { sym: "$\\hat y_{t+h}$", desc: "the forecast $h$ steps ahead (the hat means 'predicted')." }
  ],
  formula: `$$ y_t = c + \\phi_1 y_{t-1} + \\dots + \\phi_p y_{t-p} \\;+\\; \\varepsilon_t + \\theta_1 \\varepsilon_{t-1} + \\dots + \\theta_q \\varepsilon_{t-q} $$`,
  whatItDoes:
    `<p>The $\\phi$ terms are the <b>AR</b> part: today is a weighted echo of recent values. The $\\theta$ terms are the <b>MA</b> part: recent surprises also leave a mark.</p>
     <p>The numbers $p$ and $q$ say how many past values and past errors to use. The <b>I</b> part (differencing) is applied first to remove trends, then undone after forecasting.</p>
     <p>The prediction interval comes from the error term $\\varepsilon$: forecasts further ahead accumulate more uncertainty, so the band widens.</p>`,
  derivation:
    `<p>Why does the prediction interval widen the further ahead we forecast? Follow the errors forward in a simple AR(1) model $y_t = \\phi y_{t-1} + \\varepsilon_t$, with each $\\varepsilon$ having variance $\\sigma^2$.</p>
     <ul class="steps">
       <li>One step ahead: $y_{t+1} = \\phi y_t + \\varepsilon_{t+1}$. Knowing $y_t$, the only unknown is $\\varepsilon_{t+1}$, so the forecast variance is $\\sigma^2$.</li>
       <li>Two steps: substitute, $y_{t+2} = \\phi y_{t+1} + \\varepsilon_{t+2} = \\phi^2 y_t + \\phi\\varepsilon_{t+1} + \\varepsilon_{t+2}$. Two independent errors now, with variance $\\phi^2\\sigma^2 + \\sigma^2$.</li>
       <li>By $h$ steps the variance is $\\sigma^2(1 + \\phi^2 + \\phi^4 + \\dots + \\phi^{2(h-1)})$, a sum that grows with $h$.</li>
       <li>More terms means larger variance, so the interval width $\\propto \\sqrt{\\text{variance}}$ grows with the horizon. That is the widening fan.</li>
     </ul>
     <p>Uncertainty compounds because each future step adds its own fresh surprise. ∎</p>`,
  example:
    `<p>Use a simple AR(1): $y_t = c + \\phi\\, y_{t-1}$ with $c = 2$ and $\\phi = 0.5$. The latest value is $y_{t-1} = 10$.</p>
     <ul class="steps">
       <li>One step ahead: $\\hat y_t = 2 + 0.5\\times10 = 2 + 5 = 7$.</li>
       <li>Next step uses that forecast: $\\hat y_{t+1} = 2 + 0.5\\times7 = 2 + 3.5 = 5.5$.</li>
       <li>And again: $\\hat y_{t+2} = 2 + 0.5\\times5.5 = 2 + 2.75 = 4.75$.</li>
       <li>The forecasts settle toward $\\frac{c}{1-\\phi} = \\frac{2}{0.5} = 4$, the series' long-run level.</li>
     </ul>
     <p>Now watch the uncertainty grow. Say each surprise has variance $\\sigma^2 = 1$. The $h$-step forecast variance is $\\sigma^2(1 + \\phi^2 + \\dots + \\phi^{2(h-1)})$.</p>
     <ul class="steps">
       <li>$1$ step: variance $= 1$, so the band half-width $\\propto \\sqrt{1} = 1.00$.</li>
       <li>$2$ steps: variance $= 1 + 0.5^2 = 1.25$, half-width $\\propto \\sqrt{1.25} \\approx 1.12$.</li>
       <li>$3$ steps: variance $= 1 + 0.25 + 0.0625 = 1.3125$, half-width $\\propto \\sqrt{1.3125} \\approx 1.15$.</li>
       <li>The half-width climbs $1.00 \\to 1.12 \\to 1.15$: the interval <i>widens</i> with the horizon. (It tops out near $\\sqrt{1/(1-\\phi^2)} = \\sqrt{1.33} \\approx 1.15$ here, because $\\phi = 0.5 &lt; 1$.)</li>
     </ul>`,
  application:
    `<p>ARIMA and its state-space cousins forecast electricity demand, retail inventory, website traffic, and economic indicators. Anywhere a business asks "what comes next, and how sure are we?", these models give a forecast plus an honest uncertainty band.</p>`,
  demo: function (host) {
    host.innerHTML = "";
    // A noisy series + AR(1) forecast continuation with a widening interval.
    var W = 640, H = 320, ox = 50, oy = 20, pw = W - 80, ph = H - 70;
    var c = mkCanvas(host, W, H), ctx = c.ctx;
    var out = mkOut(host);
    var phi = 0.6, cst = 4, sigma = 0.8, horizon = 12;
    // build a fixed historical series (deterministic, no NaN)
    var hist = [];
    var seed = 7;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed / 0x7fffffff) * 2 - 1; }
    (function build() {
      var y = 6;
      for (var i = 0; i < 24; i++) { y = cst + 0.6 * y + sigma * rnd() * 1.2; hist.push(y); }
    })();
    function draw() {
      var t = C(); ctx.clearRect(0, 0, W, H);
      var fc = [], last = hist[hist.length - 1];
      var y = last;
      for (var h = 1; h <= horizon; h++) { y = cst + phi * y; fc.push(y); }
      var allMin = Infinity, allMax = -Infinity;
      var band = [];
      var varAcc = 0;
      for (var k = 0; k < horizon; k++) {
        varAcc += Math.pow(phi, 2 * k);
        var sd = sigma * Math.sqrt(varAcc) * 1.96;   // ~95%
        band.push(sd);
        allMin = Math.min(allMin, fc[k] - sd);
        allMax = Math.max(allMax, fc[k] + sd);
      }
      for (var m = 0; m < hist.length; m++) { allMin = Math.min(allMin, hist[m]); allMax = Math.max(allMax, hist[m]); }
      var pad = (allMax - allMin) * 0.1 + 0.5;
      var ymin = allMin - pad, ymax = allMax + pad;
      var total = hist.length + horizon;
      function px(i) { return ox + (i / (total - 1)) * pw; }
      function py(v) { return oy + ph - ((v - ymin) / (ymax - ymin)) * ph; }
      ctx.strokeStyle = t.border; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.lineTo(ox + pw, oy + ph); ctx.stroke();
      // shaded prediction interval (widening)
      ctx.beginPath();
      ctx.moveTo(px(hist.length - 1), py(last));
      for (var a = 0; a < horizon; a++) ctx.lineTo(px(hist.length + a), py(fc[a] + band[a]));
      for (var b = horizon - 1; b >= 0; b--) ctx.lineTo(px(hist.length + b), py(fc[b] - band[b]));
      ctx.closePath();
      ctx.fillStyle = "rgba(200,155,255,0.18)"; ctx.fill();
      // history line
      ctx.beginPath(); ctx.strokeStyle = t.accent; ctx.lineWidth = 2;
      for (var i = 0; i < hist.length; i++) { var X = px(i), Y = py(hist[i]); if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
      ctx.stroke();
      // forecast line
      ctx.beginPath(); ctx.strokeStyle = t.warn; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
      ctx.moveTo(px(hist.length - 1), py(last));
      for (var f = 0; f < horizon; f++) ctx.lineTo(px(hist.length + f), py(fc[f]));
      ctx.stroke(); ctx.setLineDash([]);
      // marker where forecast begins
      ctx.beginPath(); ctx.strokeStyle = t.dim; ctx.setLineDash([2, 3]);
      ctx.moveTo(px(hist.length - 1), oy); ctx.lineTo(px(hist.length - 1), oy + ph); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = t.dim; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("history", px(hist.length / 2), oy + ph + 22);
      ctx.fillText("forecast →", px(hist.length + horizon / 2), oy + ph + 22);
      ctx.textAlign = "start";
      out.innerHTML = "<span style=\"color:" + t.accent + "\">Blue</span> = observed history. " +
        "<span style=\"color:" + t.warn + "\">Orange dashed</span> = AR(1) forecast ŷ = " + cst + " + " + phi + "·y. " +
        "<span style=\"color:" + t.purple + "\">Purple band</span> = 95% prediction interval.<br>" +
        "The band <b>widens</b> with the horizon because each future step adds a fresh surprise. φ = " + phi + ".";
    }
    var row = mkRow(host);
    mkBtn(row, "φ = 0.3 (fast settle)", function () { phi = 0.3; draw(); });
    mkBtn(row, "φ = 0.6", function () { phi = 0.6; draw(); });
    mkBtn(row, "φ = 0.9 (slow, wide)", function () { phi = 0.9; draw(); });
    host.insertBefore(c.cv, host.children[0]);
    host.insertBefore(out, host.children[1]);
    draw();
  },
  quiz: {
    q: `An AR(1) model is $\\hat y_t = c + \\phi\\, y_{t-1}$ with $c = 1$ and $\\phi = 0.4$. If $y_{t-1} = 5$, what is the one-step forecast $\\hat y_t$?`,
    a: `<p>$\\hat y_t = 1 + 0.4\\times5 = 1 + 2 = 3$. The next forecast would use $3$ in place of $y_{t-1}$.</p>`
  }
});

})();
