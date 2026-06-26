/* Per-lesson CODE VISUALIZATIONS — 10-modern-b.
   One diagram per case: the ideal plus the variants you might see, each interpreted.
   chartSpec types: bars | line | scatter | heatmap | roc | confusion. */
window.CODEVIZ = window.CODEVIZ || {};

window.CODEVIZ["mod-gnn"] = {
  question: "After message passing, are nodes still distinguishable — or has depth blurred them into one?",
  caption: "",
  charts: [
    {
      type: "line",
      title: "Healthy: one message-passing step spreads neighbour values",
      xlabel: "round of message passing",
      ylabel: "node feature value",
      series: [
        { name: "node A (starts 4)", color: "#4ea1ff", points: [[0, 4.0], [1, 1.5], [2, 2.2], [3, 2.4]] },
        { name: "node C (starts 7)", color: "#7ee787", points: [[0, 7.0], [1, 4.5], [2, 3.3], [3, 2.9]] },
        { name: "node D (starts 2)", color: "#ffb454", points: [[0, 2.0], [1, 3.0], [2, 2.6], [3, 2.5]] }
      ],
      interpret: "<b>X is the round number; Y is each node's single feature value.</b> Round 0 is the raw input. Each line is one node being replaced by ReLU(W x mean-of-neighbours), so high and low nodes pull toward each other. After 2-3 rounds the values stop swinging wildly but the lines stay <b>separated</b> — that is the goal: nodes have absorbed their neighbourhood yet remain distinguishable. Numbers follow the lesson's W=0.9 averaging rule."
    },
    {
      type: "line",
      title: "Over-smoothing: too many layers collapse every node to one value",
      xlabel: "round of message passing",
      ylabel: "node feature value",
      series: [
        { name: "node A", color: "#4ea1ff", points: [[0, 4.0], [2, 2.8], [4, 2.55], [6, 2.51], [8, 2.50]] },
        { name: "node C", color: "#ff7b72", points: [[0, 7.0], [2, 3.2], [4, 2.62], [6, 2.53], [8, 2.50]] },
        { name: "node D", color: "#ffb454", points: [[0, 2.0], [2, 2.3], [4, 2.46], [6, 2.49], [8, 2.50]] }
      ],
      interpret: "<b>Illustrative.</b> Same axes, but now we stack 8 rounds. Watch the lines <b>converge to a single value</b> (~2.5) and stay glued together. When every node looks identical, the network can no longer tell them apart and accuracy stalls. This failure is called <b>over-smoothing</b>: the cure is to keep it shallow (2-4 layers) or add residual / jumping-knowledge connections."
    },
    {
      type: "confusion",
      title: "Class imbalance: rare node class is missed despite high accuracy",
      labels: ["common", "rare"],
      matrix: [[940, 10], [42, 8]],
      interpret: "<b>Illustrative.</b> Rows are the true node label, columns are what the GNN predicted. The top-left 940 are common nodes called common. Overall accuracy is (940+8)/1000 = 95%, which looks great. But the rare class (bottom row) is mostly wrong: only 8 of 50 caught, 42 missed. <b>High accuracy hides a collapsed minority class</b> on imbalanced graphs; judge with per-class recall or AUC and weight the loss instead."
    }
  ],
  code: `const adj = { A:['B','D'], B:['A','C','E'], C:['B','F'], D:['A','E'], E:['B','D','F'], F:['C','E'] };
let h = { A:4, B:1, C:7, D:2, E:5, F:3 };
const W = 0.9, relu = z => Math.max(0, z);
function round(h) {
  const nh = {};
  for (const v in adj) {
    const nb = adj[v];
    const mean = nb.reduce((s,u) => s + h[u], 0) / nb.length;
    nh[v] = relu(W * mean);
  }
  return nh;
}
let cur = h;
for (let r = 1; r <= 3; r++) { cur = round(cur); console.log('round', r, cur); }
// Healthy: values mix but stay distinct. Stack ~8 rounds and they collapse (over-smoothing).`
};

window.CODEVIZ["mod-dqn"] = {
  question: "Does the TD update pull Q toward its true value — or does it over-estimate and drift?",
  caption: "",
  charts: [
    {
      type: "line",
      title: "Healthy: Q(s0) climbs to the discounted goal value and settles",
      xlabel: "TD sweep number",
      ylabel: "Q(s0) estimate",
      series: [
        { name: "Q(s0) estimate", color: "#7ee787", points: [[0, 0.0], [1, 0.20], [2, 0.34], [4, 0.50], [7, 0.62], [12, 0.655], [20, 0.656]] },
        { name: "true value 0.9^4", color: "#9aa7b4", points: [[0, 0.656], [20, 0.656]] }
      ],
      interpret: "<b>X is how many TD update sweeps we have run; Y is the network's value for the start cell Q(s0).</b> The green line starts at 0 and each sweep moves it halfway toward reward + gamma x best-next-Q. It rises and then <b>flattens onto the grey target line</b> at 0.9^4 = 0.656, the discounted value of reaching the goal 4 steps away. Flattening onto the correct level is exactly what a stable DQN should do. Numbers come from the lesson's 5-cell corridor with gamma = 0.9."
    },
    {
      type: "line",
      title: "Over-estimation: the max operator inflates Q above the truth",
      xlabel: "TD sweep number",
      ylabel: "Q(s0) estimate",
      series: [
        { name: "Q(s0) (with noise + max)", color: "#ffb454", points: [[0, 0.0], [2, 0.42], [5, 0.74], [10, 0.92], [16, 1.05], [22, 1.12]] },
        { name: "true value 0.9^4", color: "#9aa7b4", points: [[0, 0.656], [22, 0.656]] }
      ],
      interpret: "<b>Illustrative.</b> Same axes. Because the target uses max over next actions, any random over-shoot in one action's estimate gets picked and baked in. So the orange line <b>sails past the grey true value and keeps creeping up</b> instead of settling. This is the classic DQN <b>over-estimation</b> bias; Double DQN fixes it by using one network to pick the action and another to score it."
    },
    {
      type: "line",
      title: "Unstable without the tricks: bootstrapping makes Q oscillate / blow up",
      xlabel: "TD sweep number",
      ylabel: "Q(s0) estimate",
      series: [
        { name: "Q(s0) (no target net / replay)", color: "#ff7b72", points: [[0, 0.0], [2, 0.6], [4, 1.4], [6, 0.5], [8, 2.1], [10, 0.3], [12, 3.0], [14, -0.4]] },
        { name: "true value 0.9^4", color: "#9aa7b4", points: [[0, 0.656], [14, 0.656]] }
      ],
      interpret: "<b>Illustrative.</b> Same axes again. With no target network and no replay buffer, the network chases its own constantly-moving estimate from correlated samples. The red line <b>swings wildly and never settles</b> near the grey truth, sometimes diverging. Recognising this saw-tooth means: add a slow <b>target network</b> for the bootstrap and an <b>experience replay</b> buffer to break sample correlation."
    }
  ],
  code: `const N = 5, gamma = 0.9, r_goal = 1;
let Q = new Array(N).fill(0); Q[N - 1] = r_goal;   // goal cell pinned
function sweep() {
  const nQ = Q.slice();
  for (let i = 0; i < N - 1; i++) {
    const best = Math.max(Q[i + 1], Q[i]);          // move right or stay
    const target = 0 + gamma * best;                // r_step = 0
    nQ[i] = Q[i] + 0.5 * (target - Q[i]);           // half-step TD blend
  }
  Q = nQ;
}
for (let s = 1; s <= 20; s++) { sweep(); }
console.log('Q(s0) =', Q[0].toFixed(3), 'target 0.9^4 =', Math.pow(gamma, N - 1).toFixed(3));
// Healthy: Q(s0) settles on 0.656. Without target-net/replay it would oscillate instead.`
};

window.CODEVIZ["mod-policy-gradient"] = {
  question: "Watch the probability of the best action climb as REINFORCE rewards what paid off — and the failure modes you'll hit.",
  code: `// REINFORCE on one state, 3 actions. Track P(Right) over episodes.
// rewards: Left 0.2, Stay 0.5, Right 1.0  -> Right should win.
const rewards = [0.2, 0.5, 1.0];
let pref = [0, 0, 0];          // logits (theta)
const lr = 0.6;
function probs(p){
  const m = Math.max.apply(null, p);
  const e = p.map(v => Math.exp(v - m));
  const s = e[0] + e[1] + e[2];
  return e.map(v => v / s);
}
const curve = [];
for (let ep = 0; ep < 60; ep++){
  const p = probs(pref);
  // sample an action
  let u = Math.random(), cum = 0, a = 2;
  for (let i = 0; i < 3; i++){ cum += p[i]; if (u <= cum){ a = i; break; } }
  const G = rewards[a];        // return of this 1-step episode
  // grad-log-pi * G : pref[i] += lr * G * (1{i==a} - p[i])
  for (let j = 0; j < 3; j++) pref[j] += lr * G * ((j === a ? 1 : 0) - p[j]);
  curve.push([ep, probs(pref)[2]]);   // record P(Right)
}
console.log("final P(Right) =", probs(pref)[2].toFixed(2));`,
  charts: [
    {
      type: "line",
      title: "Healthy learning: P(Right) climbs toward 1.0",
      xlabel: "Episode",
      ylabel: "Probability of an action",
      series: [
        { name: "Right (reward 1.0)", color: "#7ee787", points: [[0,0.33],[10,0.55],[20,0.74],[30,0.86],[40,0.93],[50,0.96],[60,0.98]] },
        { name: "Stay (reward 0.5)", color: "#9aa7b4", points: [[0,0.33],[10,0.28],[20,0.19],[30,0.11],[40,0.06],[50,0.03],[60,0.02]] },
        { name: "Left (reward 0.2)", color: "#ff7b72", points: [[0,0.34],[10,0.17],[20,0.07],[30,0.03],[40,0.01],[50,0.01],[60,0.0]] }
      ],
      interpret: "<b>X = episode, Y = the chance the policy picks each action.</b> The three lines start tied at 1/3 each (the policy knows nothing). Because the agent raises the probability of whatever earned reward, the green line (Right, the biggest payoff) climbs toward 1 while the others fade. <b>A clean upward sweep of the best action is what success looks like</b> — the policy has discovered the good move."
    },
    {
      type: "line",
      title: "High variance: noisy returns make a jittery, slow climb (illustrative)",
      xlabel: "Episode",
      ylabel: "Probability of best action",
      series: [
        { name: "Right (true best)", color: "#ffb454", points: [[0,0.33],[10,0.41],[20,0.32],[30,0.55],[40,0.44],[50,0.68],[60,0.61],[70,0.78],[80,0.72]] }
      ],
      interpret: "<b>Same axes, but the line zig-zags instead of rising smoothly.</b> Plain REINFORCE scales updates by the full episode return, which swings a lot run-to-run, so the gradient is noisy and the climb is shaky and slow (illustrative shape). <b>If your learning curve looks this jittery, subtract a baseline</b> (a value estimate) to cut the variance — that is exactly what actor-critic does."
    },
    {
      type: "line",
      title: "Entropy collapse: policy locks onto the WRONG action early (illustrative)",
      xlabel: "Episode",
      ylabel: "Probability",
      series: [
        { name: "Stay (mediocre, got locked in)", color: "#ff7b72", points: [[0,0.33],[5,0.6],[10,0.85],[20,0.97],[40,0.99],[60,1.0]] },
        { name: "Right (true best, starved)", color: "#7ee787", points: [[0,0.33],[5,0.25],[10,0.12],[20,0.03],[40,0.01],[60,0.0]] }
      ],
      interpret: "<b>One action shoots to ~100% within a few episodes and the rest die out (illustrative).</b> An early lucky reward made the policy near-deterministic before it ever tried the truly best move, so it stopped exploring and froze on a mediocre choice. <b>A probability that saturates this fast is a warning sign</b> — add an entropy bonus to keep the policy stochastic long enough to find the real winner."
    }
  ]
};

window.CODEVIZ["mod-actor-critic"] = {
  question: "See the advantage A = Q − V steer the actor — and what a lagging or wrong critic does to learning.",
  code: `// One-step actor-critic. Critic V(s) chases the average reward;
// actor is nudged by advantage A = Q - V.
const rewards = [0.0, 0.3, 1.0];   // Left, Stay, Right
let pref = [0, 0, 0];              // actor logits
let V = 0.3;                       // critic estimate
const gamma = 0.9, lrA = 0.7, lrC = 0.3;
function probs(p){
  const m = Math.max.apply(null, p);
  const e = p.map(v => Math.exp(v - m));
  const s = e[0] + e[1] + e[2];
  return e.map(v => v / s);
}
const Vcurve = [];
for (let ep = 0; ep < 40; ep++){
  const p = probs(pref);
  let u = Math.random(), cum = 0, a = 2;
  for (let i = 0; i < 3; i++){ cum += p[i]; if (u <= cum){ a = i; break; } }
  const r = rewards[a];
  const Q = r + gamma * 0;          // terminal next state
  const adv = Q - V;                // advantage
  for (let j = 0; j < 3; j++) pref[j] += lrA * adv * ((j === a ? 1 : 0) - p[j]);
  V = V + lrC * adv;                // critic moves toward Q
  Vcurve.push([ep, V]);
}
console.log("final V(s) =", V.toFixed(2), " P(Right) =", probs(pref)[2].toFixed(2));`,
  charts: [
    {
      type: "bars",
      title: "The advantage signal: A = Q − V for each action (V = 0.30)",
      labels: ["Left (Q=0.00)", "Stay (Q=0.30)", "Right (Q=1.00)"],
      values: [-0.30, 0.00, 0.70],
      valueLabels: ["A = -0.30", "A = 0.00", "A = +0.70"],
      colors: ["#ff7b72", "#9aa7b4", "#7ee787"],
      interpret: "<b>Each bar is one action; its height is the advantage A = Q − V — how much better that action did than the critic's expectation V = 0.30.</b> Right sits at +0.70 (well above average, green) so the actor pushes its probability up; Left is −0.30 (below average, red) so it gets pushed down; Stay is right at the baseline (zero, no change). <b>The sign of the bar tells you which way each action's probability moves.</b>"
    },
    {
      type: "line",
      title: "Healthy critic: V(s) climbs to the true average, advantage shrinks to ~0",
      xlabel: "Episode",
      ylabel: "Critic value V(s)",
      series: [
        { name: "Critic V(s)", color: "#c89bff", points: [[0,0.30],[5,0.55],[10,0.72],[15,0.83],[20,0.90],[30,0.95],[40,0.97]] },
        { name: "True expected return", color: "#7ee787", points: [[0,0.98],[40,0.98]] }
      ],
      interpret: "<b>X = episode, Y = the critic's value estimate V(s); the flat green line is the true long-run average reward.</b> As the actor leans toward Right, the state really is worth almost 1.0, so V (purple) rises to meet the green line. <b>When V settles onto the true value, advantages shrink toward zero</b> — learning has converged and updates naturally taper off. That is the steady, low-variance behaviour actor-critic buys you over plain REINFORCE."
    },
    {
      type: "line",
      title: "Lagging / wrong critic: bad V misleads the actor (illustrative)",
      xlabel: "Episode",
      ylabel: "Value",
      series: [
        { name: "Critic V(s) (stuck too high)", color: "#ff7b72", points: [[0,1.4],[10,1.35],[20,1.3],[30,1.32],[40,1.28]] },
        { name: "True expected return", color: "#7ee787", points: [[0,0.98],[40,0.98]] }
      ],
      interpret: "<b>The critic line (red) sits stubbornly above the true value (green) and never comes down (illustrative).</b> An over-high V makes Q − V negative for almost every action, so even good moves like Right look 'worse than expected' and get discouraged — the actor follows a corrupted signal. <b>If the critic loss stays high or V refuses to track reality, fix the critic first</b> (faster critic learning, better advantage estimation like GAE) before trusting the actor's updates."
    }
  ]
};

window.CODEVIZ["mod-contrastive"] = {
  question: "In embedding space, how do you tell healthy contrastive learning apart from representation collapse or false negatives?",
  charts: [
    {
      type: "scatter",
      title: "Ideal: anchor + positive cluster, negatives pushed to the edges",
      xlabel: "embedding dimension 1",
      ylabel: "embedding dimension 2",
      groups: [
        { name: "anchor", color: "#4ea1ff", points: [[0.95, 0.31]] },
        { name: "positive (same image, augmented)", color: "#7ee787", points: [[0.80, 0.60]] },
        { name: "negatives (other images)", color: "#ff7b72", points: [[-0.60, 0.80], [-0.95, -0.31], [0.10, -0.99], [-0.30, -0.95], [0.45, -0.89]] }
      ],
      interpret: "Each dot is one embedding on the unit circle (length 1), so position = direction. The <b>anchor</b> (blue) and its <b>positive</b> (green) sit almost on top of each other: their cosine similarity is high, near +0.8. Every <b>negative</b> (red) sits far around the circle, similarity near 0 or below. This is exactly what the InfoNCE loss wants — minimizing it pulls the green dot toward the blue one and shoves the red dots away. When you plot embeddings and see one tight positive pair surrounded by well-spread negatives, the model has learned a useful, discriminative space."
    },
    {
      type: "bars",
      title: "Ideal: similarity to anchor — positive dominates",
      labels: ["positive", "neg 1", "neg 2", "neg 3", "neg 4", "neg 5"],
      values: [0.80, -0.60, -0.60, 0.05, -0.13, -0.05],
      valueLabels: ["+0.80", "-0.60", "-0.60", "+0.05", "-0.13", "-0.05"],
      colors: ["#7ee787", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "Same scene, read as cosine similarities to the anchor (computed from the dots above). The green bar (the positive) towers over every red bar (the negatives). The loss is a softmax over these numbers: it is small precisely when one bar — the positive — sticks out. The positive's probability here is exp(0.8) divided by the sum of all the exponentials, so it dominates and the loss is low. A tall lone green bar over short, scattered red bars is the signature of a healthy contrastive batch."
    },
    {
      type: "scatter",
      title: "Failure: representation collapse — every embedding lands on one point (illustrative)",
      xlabel: "embedding dimension 1",
      ylabel: "embedding dimension 2",
      groups: [
        { name: "anchor", color: "#4ea1ff", points: [[0.40, 0.40]] },
        { name: "positive", color: "#7ee787", points: [[0.42, 0.41]] },
        { name: "negatives", color: "#ff7b72", points: [[0.41, 0.42], [0.39, 0.40], [0.40, 0.41], [0.42, 0.39], [0.41, 0.40]] }
      ],
      interpret: "Illustrative collapse. Anchor, positive, AND every negative pile into the same tiny blob — the network found the lazy shortcut of mapping every input to one constant vector. The positive's similarity is high, but so is every negative's, so the loss looks deceptively okay while the embeddings carry zero information. You catch this by watching embedding variance crash toward zero, or by a downstream probe scoring near chance. Fixes: more (and harder) negatives, a projection head, and methods like SimCLR's large batches or BYOL/VICReg-style anti-collapse terms."
    },
    {
      type: "bars",
      title: "Failure: a false negative — a true match mislabeled as negative (illustrative)",
      labels: ["positive", "neg 1", "FALSE neg", "neg 3", "neg 4", "neg 5"],
      values: [0.80, -0.55, 0.78, -0.40, 0.02, -0.30],
      valueLabels: ["+0.80", "-0.55", "+0.78", "-0.40", "+0.02", "-0.30"],
      colors: ["#7ee787", "#ff7b72", "#ffb454", "#ff7b72", "#ff7b72", "#ff7b72"],
      interpret: "Illustrative false-negative poisoning. The orange bar is labeled a negative but is actually similar to the anchor (similarity +0.78, nearly as high as the real positive). Because the loss treats it as something to push away, it fights the green positive and shoves apart two things that belong together — say two photos of the same breed of dog drawn into the same batch. The tell is a 'negative' whose similarity rivals the positive's. Mitigations: dedup or cluster-aware sampling, supervised contrastive labels, or simply enough data that such collisions are rare."
    }
  ],
  caption: "Plot embeddings on the unit circle: healthy contrastive learning shows the positive hugging the anchor while negatives spread out. Watch for collapse (everything in one blob) and false negatives (a 'negative' that is really a match).",
  code: `import numpy as np

# unit-length 2D embeddings (direction = meaning)
anchor = np.array([0.95, 0.31])
positive = np.array([0.80, 0.60])
negatives = np.array([[-0.60, 0.80], [-0.95, -0.31],
                      [0.10, -0.99], [-0.30, -0.95], [0.45, -0.89]])

def cos(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

tau = 1.0
sim_pos = cos(anchor, positive)
sim_neg = np.array([cos(anchor, n) for n in negatives])

# InfoNCE: softmax over [positive, negatives...], loss = -log p(positive)
logits = np.concatenate(([sim_pos], sim_neg)) / tau
p = np.exp(logits - logits.max())
p = p / p.sum()
loss = -np.log(p[0])
print("sim positive:", round(sim_pos, 2))
print("p(positive):", round(p[0], 3), " loss:", round(loss, 3))`
};

window.CODEVIZ["mod-vit"] = {
  question: "How does patch size set the number of tokens and the cost of attention — and what do focused vs diffuse attention maps look like?",
  charts: [
    {
      type: "line",
      title: "Ideal read: patch size vs attention cost (224x224 image)",
      xlabel: "patch size P (pixels per side)",
      ylabel: "attention comparisons (N squared, log feel)",
      series: [
        { name: "tokens N = HW / P^2", color: "#4ea1ff", points: [[4, 3136], [8, 784], [16, 196], [32, 49], [56, 16]] },
        { name: "attention cost ~ N^2", color: "#ff7b72", points: [[4, 9834496], [8, 614656], [16, 38416], [32, 2401], [56, 256]] }
      ],
      interpret: "Both curves are for a real 224x224 image. The blue line is the token count N = (224*224)/P-squared; the red line is the attention cost, which grows like N-squared because every token attends to every token. Read it right to left: shrinking the patch from 32 to 16 to 8 pixels multiplies tokens (49 to 196 to 784) and explodes cost (2.4k to 38k to 615k comparisons). The standard ViT choice P=16 sits in the sweet spot — 196 tokens, ~38k comparisons, affordable while still global. The lesson: small patches buy detail but the red curve punishes you fast."
    },
    {
      type: "bars",
      title: "Ideal: how patch size sets the token count",
      labels: ["P=8", "P=16", "P=32", "P=56"],
      values: [784, 196, 49, 16],
      valueLabels: ["784", "196", "49", "16"],
      colors: ["#ff7b72", "#7ee787", "#4ea1ff", "#9aa7b4"],
      interpret: "The same 224x224 image cut at four patch sizes, counting tokens N = HW/P-squared. Halving the patch side quadruples the tokens (P=16 gives 196, P=8 gives 784) because area scales with the square. Green marks the common P=16: enough tokens for fine structure without overwhelming attention. The tiny P=56 case (16 tokens) is cheap but coarse — each token swallows a 56x56 block, blurring detail. Use this chart to pick a patch size: more bars (smaller P) means more detail and more cost."
    },
    {
      type: "heatmap",
      title: "Ideal: one patch attends mostly to its neighbours (focused)",
      rows: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      cols: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      matrix: [
        [0.42, 0.22, 0.10, 0.06, 0.08, 0.05, 0.04, 0.03],
        [0.20, 0.40, 0.20, 0.08, 0.05, 0.03, 0.02, 0.02],
        [0.09, 0.21, 0.38, 0.19, 0.07, 0.03, 0.02, 0.01],
        [0.05, 0.09, 0.20, 0.39, 0.18, 0.06, 0.02, 0.01],
        [0.04, 0.05, 0.08, 0.19, 0.40, 0.16, 0.06, 0.02],
        [0.03, 0.03, 0.05, 0.07, 0.18, 0.42, 0.17, 0.05],
        [0.02, 0.02, 0.03, 0.04, 0.07, 0.19, 0.43, 0.20],
        [0.02, 0.02, 0.02, 0.03, 0.04, 0.07, 0.22, 0.58]
      ],
      showVals: true,
      interpret: "Each row is one patch token asking 'who do I look at?'; the columns are the patches it can attend to, and each row sums to 1. The bright band runs down the diagonal: every patch attends most to itself and its immediate neighbours, with weight tapering off for distant patches. This is the healthy pattern for a trained ViT on natural images — local structure dominates but the off-diagonal weight shows it can still reach across the image when it needs to. Peaky, structured rows like these mean attention has learned something."
    },
    {
      type: "heatmap",
      title: "Failure: diffuse attention — every patch weighted equally (illustrative)",
      rows: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      cols: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      matrix: [
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125],
        [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]
      ],
      showVals: true,
      interpret: "Illustrative failure. Every cell is 1/8 = 0.125, so the grid is one flat colour with no diagonal and no bright spots. Each row still sums to 1, but it spreads that weight evenly across all patches — the model is averaging the whole image and focusing on nothing. You see this early in training, or when a ViT is starved of data and never learns where to look (a known risk: ViTs lack a CNN's built-in locality bias and overfit or under-focus on small datasets). A washed-out, uniform map means the attention layer is carrying no spatial signal yet — pretrain on more data or add stronger augmentation."
    }
  ],
  caption: "Patch size P sets tokens N = HW/P^2, and attention cost scales like N^2 — small patches mean detail but blow up cost. In the attention map, read each row (sums to 1): a structured diagonal band is healthy; a flat uniform grid means the model is not focusing.",
  code: `H, W, P = 224, 224, 16          # image size and patch size
N = (H * W) // (P * P)           # number of patch tokens
cost = N * N                     # attention compares every token to every token
print("tokens N:", N)            # 196
print("attention cost ~ N^2:", cost)   # 38416

# why not one token per pixel?
N_pixels = H * W                 # 50176 tokens
print("per-pixel cost ~ N^2:", N_pixels * N_pixels)  # ~2.5 billion
print("speedup from patching:", (N_pixels * N_pixels) // cost, "x")`
};

window.CODEVIZ["mod-timeseries"] = {
  question: "How do you read a forecast chart — the line is the guess, but what is the shaded band telling you?",
  charts: [
    {
      type: "line",
      title: "Healthy AR(1) forecast: point line settles, band fans out",
      xlabel: "steps ahead (h)",
      ylabel: "value y",
      series: [
        { name: "forecast", color: "#ffb454", points: [[0,10],[1,7],[2,5.5],[3,4.75],[4,4.375],[5,4.188],[6,4.094],[7,4.047],[8,4.023]] },
        { name: "upper 95%", color: "#c89bff", points: [[1,8.96],[2,7.691],[3,6.995],[4,6.634],[5,6.45],[6,6.357],[7,6.31],[8,6.286]] },
        { name: "lower 95%", color: "#c89bff", points: [[1,5.04],[2,3.309],[3,2.505],[4,2.116],[5,1.926],[6,1.831],[7,1.784],[8,1.76]] }
      ],
      interpret: "<b>Real numbers</b> from the lesson's AR(1): start y=10, then y becomes 2 + 0.5*y each step, so the orange point forecast goes 7, 5.5, 4.75 ... and <b>settles toward 4</b> (the long-run level c/(1-phi)). The two purple lines are the 95% band edges (forecast plus/minus 1.96 times the growing spread). Notice the band <b>fans wider</b> early (half-width 1.96 then 2.19, 2.25 ...) then stops growing because phi=0.5 is well below 1 so old surprises fade. Read it as: the line is the best single guess, the band is how sure we are — and we get less sure further out."
    },
    {
      type: "line",
      title: "Trend the band misses: point forecast goes flat, reality keeps climbing",
      xlabel: "steps ahead (h)",
      ylabel: "value y",
      series: [
        { name: "forecast", color: "#ffb454", points: [[0,10],[1,10.2],[2,10.3],[3,10.35],[4,10.38],[5,10.39],[6,10.4],[7,10.4],[8,10.4]] },
        { name: "what actually happens", color: "#ff7b72", points: [[0,10],[1,11],[2,12],[3,13],[4,14],[5,15],[6,16],[7,17],[8,18]] },
        { name: "upper 95%", color: "#c89bff", points: [[1,11.0],[2,11.3],[3,11.5],[4,11.6],[5,11.7],[6,11.75],[7,11.8],[8,11.85]] },
        { name: "lower 95%", color: "#c89bff", points: [[1,9.4],[2,9.3],[3,9.2],[4,9.16],[5,9.13],[6,9.05],[7,9.0],[8,8.95]] }
      ],
      interpret: "<b>Illustrative.</b> This is the classic failure: the series has an <b>upward trend</b> the model never removed by differencing, so the orange forecast goes nearly <b>flat</b> while the red truth keeps rising. The red line walks straight out of the purple band — the actual value lands outside the 95% interval almost immediately. Recognise it when the forecast looks suspiciously level next to clearly-trending history: difference the series first (the I in ARIMA), or the forecasts drift off the real pattern."
    },
    {
      type: "line",
      title: "Seasonality ignored: smooth forecast erases the repeating wave",
      xlabel: "steps ahead (h)",
      ylabel: "value y",
      series: [
        { name: "forecast", color: "#ffb454", points: [[0,10],[1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10]] },
        { name: "what actually happens", color: "#ff7b72", points: [[0,10],[1,13],[2,10],[3,7],[4,10],[5,13],[6,10],[7,7],[8,10]] }
      ],
      interpret: "<b>Illustrative.</b> The truth (red) <b>repeats a wave</b> every few steps — a weekly or daily cycle. Plain ARIMA has no seasonal term, so its forecast (orange) collapses to a flat average line straight through the middle and <b>misses every peak and trough</b>. Recognise it when the history visibly cycles but the forecast is a smooth line: the residuals will themselves cycle. Fix by modelling the season explicitly (SARIMA or seasonal terms)."
    },
    {
      type: "line",
      title: "Overconfident band: real value keeps escaping a too-narrow interval",
      xlabel: "steps ahead (h)",
      ylabel: "value y",
      series: [
        { name: "forecast", color: "#ffb454", points: [[0,10],[1,7],[2,5.5],[3,4.75],[4,4.375],[5,4.188],[6,4.094],[7,4.047]] },
        { name: "what actually happens", color: "#ff7b72", points: [[0,10],[1,8.5],[2,3.0],[3,6.8],[4,2.0],[5,6.5],[6,1.8],[7,6.2]] },
        { name: "upper 95%", color: "#c89bff", points: [[1,7.6],[2,6.0],[3,5.2],[4,4.8],[5,4.6],[6,4.5],[7,4.45]] },
        { name: "lower 95%", color: "#c89bff", points: [[1,6.4],[2,5.0],[3,4.3],[4,3.95],[5,3.78],[6,3.69],[7,3.64]] }
      ],
      interpret: "<b>Illustrative.</b> Same settling point forecast as the healthy case, but here the purple band is drawn <b>too tight</b> (the model trusted itself too much). The red truth jumps in and out of the band far more than 5% of the time — the interval is <b>not calibrated</b>. Recognise it by counting: if many more than 1-in-20 actual points fall outside a 95% band on held-out data, the band is overconfident. Widen it, or the model is hiding real risk."
    }
  ],
  caption: "",
  code: "// AR(1) forecast with a widening 95% prediction interval (the lesson's numbers).\n" +
    "const c = 2, phi = 0.5, sigma = 1;   // baseline, AR weight, surprise std-dev\n" +
    "let y = 10;                          // latest observed value\n" +
    "let varAcc = 0;\n" +
    "for (let h = 1; h <= 8; h++) {\n" +
    "  y = c + phi * y;                   // point forecast: 7, 5.5, 4.75 ... -> 4\n" +
    "  varAcc += Math.pow(phi, 2 * (h - 1));   // variance compounds each step\n" +
    "  const half = 1.96 * sigma * Math.sqrt(varAcc);  // 95% band half-width\n" +
    "  console.log('h=' + h, 'yhat=' + y.toFixed(3),\n" +
    "    'band=[' + (y - half).toFixed(2) + ', ' + (y + half).toFixed(2) + ']');\n" +
    "}\n" +
    "// The point line settles toward c/(1-phi)=4; the band fans out then stops\n" +
    "// growing because phi=0.5 < 1, so each old surprise fades over time."
};
