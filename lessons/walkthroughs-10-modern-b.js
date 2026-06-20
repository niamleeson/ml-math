/* =====================================================================
   REAL-WORLD WALKTHROUGHS for MODULE 10 (part B) — Modern Deep Learning & AI.
   Three walkthroughs per lesson, each a different real-world domain.
   Every "Run it" step has a self-contained numpy/scipy/sklearn snippet
   that was actually executed; the `output` field is the exact stdout.
   torch is NOT used. All math is wrapped in $...$ with doubled backslashes.
   ===================================================================== */
window.WALKTHROUGHS = Object.assign(window.WALKTHROUGHS || {}, {

  /* ============================================================ */
  /* 1. GRAPH NEURAL NETWORKS                                     */
  /* ============================================================ */
  "mod-gnn": [
    {
      title: `Classifying research papers from who cites whom`,
      domain: `Citation networks`,
      question: `A small citation graph has six papers. Each paper starts with two features (does it mention "neural", does it mention "graph"). Can one round of GNN message passing blend each paper with the papers it cites?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Nodes are papers, edges are citations. We store the graph as an <b>adjacency matrix</b> $A$, where $A_{ij}=1$ means paper $i$ and paper $j$ are linked.</p>
                 <p>Each paper has a feature row $h_v$ of two numbers. Paper 0 reads $[1,0]$ ("neural", not "graph"), paper 3 reads $[0,1]$ ("graph", not "neural").</p>`
        },
        {
          title: `The math`,
          body: `<p>One message-passing layer is $h_v' = \\sigma\\!\\big(W\\cdot\\text{agg}(\\{h_u : u \\in N(v)\\})\\big)$.</p>
                 <p>The aggregate is the neighbour mean. In matrix form that is $D^{-1}A\\,H$, where $D$ is the diagonal matrix of node degrees (how many neighbours each node has). Then multiply by $W$ and apply ReLU.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Build $A$ and $H$ in numpy, mean-aggregate by dividing the neighbour sums by the degree, then apply $W=0.5\\,I$ and ReLU.</p>`,
          code: `import numpy as np
# Citation-graph node classification via mean-aggregation (GNN message passing)
# 6 papers; edges = citations. Features = [has_word_neural, has_word_graph]
A = np.array([
 [0,1,1,0,0,0],
 [1,0,1,0,0,0],
 [1,1,0,1,0,0],
 [0,0,1,0,1,1],
 [0,0,0,1,0,1],
 [0,0,0,1,1,0]], dtype=float)
H = np.array([[1.,0.],[1.,0.],[1.,1.],[0.,1.],[0.,1.],[0.,1.]])
deg = A.sum(1, keepdims=True)
agg = (A @ H) / deg          # mean of neighbours
W = np.array([[0.5,0.0],[0.0,0.5]])
Hp = np.maximum(0, agg @ W)  # ReLU
print("aggregated neighbour means:")
print(np.round(agg,3))
print("updated node features h':")
print(np.round(Hp,3))`,
          output: `aggregated neighbour means:
[[1.    0.5  ]
 [1.    0.5  ]
 [0.667 0.333]
 [0.333 1.   ]
 [0.    1.   ]
 [0.    1.   ]]
updated node features h':
[[0.5   0.25 ]
 [0.5   0.25 ]
 [0.333 0.167]
 [0.167 0.5  ]
 [0.    0.5  ]
 [0.    0.5  ]]`
        }
      ],
      conclusion: `Yes. Paper 2 sits on the boundary between the "neural" cluster and the "graph" cluster, so after one round its features become $[0.333, 0.167]$ — a genuine blend pulled from both sides. Every node now carries a smoothed summary of its neighbourhood, which is exactly the signal a classifier uses to label papers by topic.`
    },
    {
      title: `Tracing fraud through a payment network`,
      domain: `Fraud detection`,
      question: `One account is flagged as risky. Money flows along transaction edges. If we let the risk score spread by neighbour-averaging, which accounts light up after two hops?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Five accounts, edges where money moved between them. Account 0 is the known-bad account with risk feature $1.0$; everyone else starts at $0$.</p>
                 <p>Risk should diffuse: an account that transacts with risky accounts is itself more suspicious.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each round replaces a node's score with the mean of its neighbours' scores: $h_v' = \\frac{1}{|N(v)|}\\sum_{u\\in N(v)} h_u$.</p>
                 <p>Run it twice. Round 1 carries the signal to direct partners of the bad account; round 2 carries it to partners-of-partners.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Mean-aggregate the risk vector twice.</p>`,
          code: `import numpy as np
# Fraud detection: account graph. Node feature = risk score (0..1).
# Two rounds of mean-aggregation spread risk from a known-bad account.
A = np.array([
 [0,1,1,0,0],
 [1,0,0,1,0],
 [1,0,0,1,1],
 [0,1,1,0,0],
 [0,0,1,0,0]], dtype=float)
deg = A.sum(1)
def step(h):
    return (A @ h) / deg
h = np.array([1.0, 0.0, 0.0, 0.0, 0.0])  # account 0 flagged risky
print("round 0:", np.round(h,3))
for r in range(1,3):
    h = step(h)
    print(f"round {r}:", np.round(h,3))
print("most-implicated account:", int(np.argmax(h)))`,
          output: `round 0: [1. 0. 0. 0. 0.]
round 1: [0.    0.5   0.333 0.    0.   ]
round 2: [0.417 0.    0.    0.417 0.333]
most-implicated account: 0`
        }
      ],
      conclusion: `After round 1 the direct partners (accounts 1 and 2) absorb the risk: $0.5$ and $0.333$. After round 2 that risk bounces onward to accounts 3 and 4 ($0.417$ and $0.333$). The diffusion is exactly permutation-invariant neighbour averaging — the heart of message passing — and it is how GNNs surface accounts that never touched the bad node directly.`
    },
    {
      title: `Recommending products from co-purchase links`,
      domain: `Recommendations`,
      question: `A shopper clicks item 0. Items that are frequently bought together are joined by edges. Can two rounds of message passing rank which items to recommend next?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Five products. An edge between two items means they were often bought in the same basket. The shopper's interest starts as a "hot" signal of $1.0$ on item 0.</p>`
        },
        {
          title: `The math`,
          body: `<p>Use the full GNN layer with a weight and a non-linearity: $h_v' = \\text{ReLU}\\big(W\\cdot \\text{mean}(N(v))\\big)$ with scalar $W=0.8$.</p>
                 <p>The interest spreads to co-purchased items, then to their co-purchased items, with each hop slightly damped by $W&lt;1$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Propagate the click signal two rounds and rank the remaining items by their final score.</p>`,
          code: `import numpy as np
# Product recommendation: user-item bipartite graph.
# Propagate a user's liked-item signal to co-purchased items via mean-aggregation.
# Items 0..4. Edge if two items were bought together.
A = np.array([
 [0,1,1,0,0],
 [1,0,1,1,0],
 [1,1,0,0,1],
 [0,1,0,0,1],
 [0,0,1,1,0]], dtype=float)
deg = A.sum(1)
W = 0.8
def relu(z): return np.maximum(0,z)
h = np.array([1.0,0,0,0,0])  # user clicked item 0
for r in range(1,3):
    h = relu(W * (A @ h) / deg)
    print(f"after round {r}:", np.round(h,3))
order = np.argsort(-h)
print("recommend order (excluding item0):",
      [int(i) for i in order if i!=0])`,
          output: `after round 1: [0.    0.267 0.267 0.    0.   ]
after round 2: [0.213 0.071 0.071 0.107 0.107]
recommend order (excluding item0): [3, 4, 1, 2]`
        }
      ],
      conclusion: `After two hops the strongest non-clicked scores land on items 3 and 4 — products that are only reachable from item 0 through an intermediary, yet rank highly because the signal flowed through two co-purchase edges. That two-hop reach, $h_v' = \\text{ReLU}(W\\cdot\\text{mean}(N(v)))$ applied twice, is precisely why graph recommenders beat one-hop "people also bought" lists.`
    }
  ],

  /* ============================================================ */
  /* 2. DEEP Q-NETWORKS                                           */
  /* ============================================================ */
  "mod-dqn": [
    {
      title: `Teaching a warehouse robot to reach the dock`,
      domain: `Robotics`,
      question: `A robot sits in a 6-cell corridor with the loading dock at the far right (reward $+1$). Using the DQN target $y = r + \\gamma\\max_{a'}Q(s',a')$ — but with a small table instead of a net — can it learn to always head right?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Six cells in a line. Two actions: go left, go right. Reaching the rightmost cell pays reward $1$ and ends the episode; every other step pays $0$.</p>
                 <p>$Q(s,a)$ is the value of taking action $a$ from cell $s$. It starts at $0$ everywhere.</p>`
        },
        {
          title: `The math`,
          body: `<p>DQN's whole engine is one update. For each move we form the TD target $y = r + \\gamma\\max_{a'}Q(s',a')$ and pull $Q(s,a)$ toward it: $Q(s,a)\\leftarrow Q(s,a) + \\alpha\\,(y - Q(s,a))$.</p>
                 <p>With $\\gamma=0.9$, the discounted value of a goal that is $k$ steps away is $\\gamma^{k}$. So cell 0, five steps from the dock, should settle near $0.9^5 \\approx 0.59$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Run tabular Q-learning (the DQN target, no neural net) with epsilon-greedy exploration and random start cells so every state gets visited.</p>`,
          code: `import numpy as np
# Warehouse robot: 1x6 corridor, goal at the right end. Tabular Q-learning
# (the idea behind DQN's TD target, without a neural net).
N=6; gamma=0.9; alpha=0.5
Q=np.zeros((N,2))  # actions: 0=left,1=right
def nxt(s,a): return max(0,min(N-1, s + (1 if a==1 else -1)))
np.random.seed(0)
for ep in range(400):
    s=np.random.randint(N-1)   # random start cell
    for _ in range(50):
        a = np.random.randint(2) if np.random.rand()<0.3 else int(np.argmax(Q[s]))
        s2=nxt(s,a)
        r = 1.0 if s2==N-1 else 0.0
        target = r + (0 if s2==N-1 else gamma*np.max(Q[s2]))
        Q[s,a]+= alpha*(target-Q[s,a])
        s=s2
        if s==N-1: break
print("Q table (rows=cell, cols=[left,right]):")
print(np.round(Q,3))
print("greedy policy:", ["R" if np.argmax(Q[s])==1 else "L" for s in range(N-1)])
print("Q(cell0,right) ->", round(Q[0,1],3), " gamma^5 =", round(gamma**5,3))`,
          output: `Q table (rows=cell, cols=[left,right]):
[[0.59  0.656]
 [0.59  0.729]
 [0.656 0.81 ]
 [0.729 0.9  ]
 [0.81  1.   ]
 [0.    0.   ]]
greedy policy: ['R', 'R', 'R', 'R', 'R']
Q(cell0,right) -> 0.656  gamma^5 = 0.59`
        }
      ],
      conclusion: `The greedy policy is "right" from every cell, and the right-action values climb $0.656, 0.729, 0.81, 0.9, 1.0$ toward the dock — exactly the discounted-distance ladder $\\gamma^{k}$ that the Bellman fixed point predicts. Minimizing the squared TD error fit the corridor's value function with nothing but the update $Q\\leftarrow Q + \\alpha(y-Q)$.`
    },
    {
      title: `Playing a bridge-crossing game with a trap`,
      domain: `Games`,
      question: `A game piece is on a 4-tile bridge. The right end wins ($+1$), the left end is a trap ($-1$). Can the TD target learn that pushing right is always the safer move?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Four tiles. Tile 3 is the win ($+1$, terminal), tile 0 is the trap ($-1$, terminal). Tiles 1 and 2 are the playable middle.</p>
                 <p>Actions are left or right. The piece must learn to avoid the trap even though it has no idea where it is at the start.</p>`
        },
        {
          title: `The math`,
          body: `<p>Same DQN target, now with two terminal rewards: $y = r$ if the next tile is terminal, else $y = r + \\gamma\\max_{a'}Q(s',a')$.</p>
                 <p>Because the win is closer to the right and the trap to the left, the values of "right" should beat "left" in both middle tiles.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Train the table with $\\gamma=0.95$ and read off the best move in each playable tile.</p>`,
          code: `import numpy as np
# Tic-tac-toe-style toy game replaced with a 2x2 grid game ("Cliff walk"):
# Agent on a 4-cell line: cell3=win(+1), cell0=trap(-1). Tabular Q-learning.
states=4; gamma=0.95; alpha=0.5
# actions 0=left,1=right; terminal at 0 (trap) and 3 (win)
Q=np.zeros((states,2))
def nxt(s,a): return max(0,min(3, s + (1 if a==1 else -1)))
np.random.seed(1)
for ep in range(500):
    s=np.random.choice([1,2])
    for _ in range(20):
        a = np.random.randint(2) if np.random.rand()<0.25 else int(np.argmax(Q[s]))
        s2=nxt(s,a)
        if s2==3: r=1.0
        elif s2==0: r=-1.0
        else: r=0.0
        terminal = s2 in (0,3)
        target = r + (0 if terminal else gamma*np.max(Q[s2]))
        Q[s,a]+=alpha*(target-Q[s,a])
        s=s2
        if terminal: break
print("Q (rows=cell1,cell2 are playable):")
print(np.round(Q[1:3],3))
print("best move cell1:", "right" if np.argmax(Q[1])==1 else "left")
print("best move cell2:", "right" if np.argmax(Q[2])==1 else "left")`,
          output: `Q (rows=cell1,cell2 are playable):
[[-1.     0.95 ]
 [ 0.902  1.   ]]
best move cell1: right
best move cell2: right`
        }
      ],
      conclusion: `Both middle tiles learn "right". The left action from tile 1 carries the trap's value $-1$, while right carries $0.95$; on tile 2, right wins outright with $1.0$. The TD target propagated both the $+1$ reward and the $-1$ penalty backward through the bridge, exactly as DQN learned to dodge danger in Atari games.`
    },
    {
      title: `One elevator-dispatch update, by the numbers`,
      domain: `Control systems`,
      question: `An elevator controller's network guesses $Q(s,a)=4$ for sending the car up. It acts, earns reward $1$, and the next floor offers next-action values $[6.0, 2.0, 5.5]$. What target should we train toward, and how far is the current guess off?`,
      steps: [
        {
          title: `The data`,
          body: `<p>The state is the building's call pattern; the action is "go up". The network's current estimate is $Q(s,a)=4$.</p>
                 <p>After acting we receive reward $r=1$ and land in a state whose three candidate next actions are valued $6.0$, $2.0$, $5.5$.</p>`
        },
        {
          title: `The math`,
          body: `<p>The TD target is $y = r + \\gamma\\max_{a'}Q(s',a')$. With $\\gamma=0.9$ the best next value is $6.0$, so $y = 1 + 0.9\\times 6 = 6.4$.</p>
                 <p>The loss is the squared TD error $(y-Q(s,a))^2$, and a gradient step nudges $Q(s,a)$ toward $y$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute the target, the error, the squared loss, and one half-step update.</p>`,
          code: `import numpy as np
# Elevator dispatch toy: floor 0..4, goal=floor4 (passenger waiting).
# Demonstrate a single TD target update (the core of DQN's loss) with numbers.
gamma=0.9
Q_sa = 4.0                 # net's current guess for (state,action)
r = 1.0                    # reward after acting
Q_next = np.array([6.0, 2.0, 5.5])   # next-state action values
y = r + gamma*np.max(Q_next)         # TD target
td_error = y - Q_sa
loss = td_error**2
print("max next Q     =", np.max(Q_next))
print("TD target y    =", round(y,3))
print("TD error delta =", round(td_error,3))
print("squared loss   =", round(loss,4))
# one gradient step on Q toward y (lr=0.5)
Q_new = Q_sa + 0.5*td_error
print("Q after update =", round(Q_new,3))`,
          output: `max next Q     = 6.0
TD target y    = 6.4
TD error delta = 2.4
squared loss   = 5.76
Q after update = 5.2`
        }
      ],
      conclusion: `The target is $y = 6.4$, the network is off by $\\delta = 2.4$, and the squared loss is $5.76$. One step moves $Q(s,a)$ from $4$ to $5.2$, halving the gap. Repeating this across millions of stored experiences (replay) with a frozen target network is the whole DQN training loop — here laid bare on a single move.`
    }
  ],

  /* ============================================================ */
  /* 3. POLICY GRADIENTS (REINFORCE)                             */
  /* ============================================================ */
  "mod-policy-gradient": [
    {
      title: `Choosing which ad to show with REINFORCE`,
      domain: `Online advertising`,
      question: `Three ads have hidden click-through rates of $0.1$, $0.3$, $0.8$. With no model of users, can a softmax policy trained by REINFORCE learn to almost always show the best ad?`,
      steps: [
        {
          title: `The data`,
          body: `<p>This is a three-arm bandit. Each "arm" is an ad. Showing ad $a$ returns reward $1$ (a click) with that ad's true click-through rate, else $0$.</p>
                 <p>The policy $\\pi(a\\mid s)$ is a softmax over three preference numbers (logits), all starting at $0$ — so we begin completely uniform.</p>`
        },
        {
          title: `The math`,
          body: `<p>REINFORCE steps in the direction $\\nabla_\\theta\\log\\pi(a\\mid s)\\,G$. For a softmax the score is $\\nabla\\log\\pi(a) = \\mathbf{1}\\{i=a\\} - \\pi(i)$, so the update is $\\theta_i \\mathrel{+}= \\eta\\,G\\,(\\mathbf{1}\\{i=a\\} - \\pi_i)$.</p>
                 <p>A click ($G=1$) pushes the chosen arm's probability up; a miss ($G=0$) does nothing. Over many rounds the best ad wins.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Sample an ad from the policy, observe a click or not, apply the REINFORCE update, repeat 2000 times.</p>`,
          code: `import numpy as np
# Ad-slot selection as a 3-arm bandit. REINFORCE on a softmax policy.
# Arms = which ad to show; reward = click (higher for the good ad).
np.random.seed(0)
true_ctr = np.array([0.1, 0.3, 0.8])   # arm 2 is best
pref = np.zeros(3)                       # policy logits
lr = 0.1
def softmax(p):
    e=np.exp(p-p.max()); return e/e.sum()
for step in range(2000):
    p = softmax(pref)
    a = np.random.choice(3, p=p)
    G = 1.0 if np.random.rand() < true_ctr[a] else 0.0   # reward
    grad = -p.copy(); grad[a]+=1.0       # d log pi / d pref
    pref += lr * G * grad                 # REINFORCE step
final=softmax(pref)
print("final policy probabilities:", np.round(final,3))
print("chosen ad (argmax):", int(np.argmax(final)))`,
          output: `final policy probabilities: [0.003 0.005 0.992]
chosen ad (argmax): 2`
        }
      ],
      conclusion: `The policy converges to showing the best ad $99.2\\%$ of the time, having never been told which ad was best — it only ever saw sampled clicks. That is the appeal of $\\nabla_\\theta J = E[\\nabla_\\theta\\log\\pi(a\\mid s)\\,G]$: raise the probability of whatever earned reward, using nothing but samples.`
    },
    {
      title: `Picking a robot grasp angle`,
      domain: `Robotics`,
      question: `A gripper can attempt four grasp angles with success rates $0.2, 0.5, 0.9, 0.4$. Can REINFORCE with a baseline (to cut variance) home in on the best angle faster?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Four discrete grasp angles. Trying angle $a$ succeeds (reward $1$) at its hidden rate, else fails (reward $0$). Angle 2 is best.</p>
                 <p>To reduce noise we subtract a <b>baseline</b> — a running average of recent reward — so the update uses the advantage $G - b$ instead of raw $G$.</p>`
        },
        {
          title: `The math`,
          body: `<p>The baseline does not bias the gradient: $E[\\nabla\\log\\pi\\cdot b] = 0$ because the scores sum to zero. So $\\nabla_\\theta J = E[\\nabla_\\theta\\log\\pi(a\\mid s)\\,(G - b)]$ points the same way with less variance.</p>
                 <p>When an angle beats the average success rate, $G-b&gt;0$ and we push it up; when it underperforms, we push it down.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Run REINFORCE with a slowly-updated baseline for 1500 grasps.</p>`,
          code: `import numpy as np
# Robot grasp-angle choice: 4 discrete angles, reward = grasp success rate.
# REINFORCE with a reward baseline to cut variance.
np.random.seed(2)
success = np.array([0.2,0.5,0.9,0.4])  # angle 2 best
pref=np.zeros(4); lr=0.2; baseline=0.0
def softmax(p):
    e=np.exp(p-p.max()); return e/e.sum()
for step in range(1500):
    p=softmax(pref)
    a=np.random.choice(4,p=p)
    R=1.0 if np.random.rand()<success[a] else 0.0
    baseline += 0.01*(R-baseline)        # running average baseline
    adv = R - baseline
    grad=-p.copy(); grad[a]+=1.0
    pref += lr*adv*grad
print("final policy:", np.round(softmax(pref),3))
print("best grasp angle index:", int(np.argmax(softmax(pref))))
print("learned baseline ~ avg reward:", round(baseline,3))`,
          output: `final policy: [0.001 0.002 0.996 0.001]
best grasp angle index: 2
learned baseline ~ avg reward: 0.911`
        }
      ],
      conclusion: `The policy locks onto angle 2 with probability $0.996$, and the learned baseline settles near $0.91$ — the success rate the policy now achieves. Subtracting that baseline is the variance-reduction trick that makes REINFORCE practical, and it is the bridge straight into Actor-Critic, where a critic network supplies the baseline.`
    },
    {
      title: `One REINFORCE step, written out`,
      domain: `Worked mechanics`,
      question: `A two-action policy starts $50/50$. We sample "Right" and the episode returns $G=+2$. What is the score $\\nabla\\log\\pi$, and which way does the probability move?`,
      steps: [
        {
          title: `The data`,
          body: `<p>One state, two actions: Left and Right. Preferences both start at $0$, so $\\pi(\\text{Left})=\\pi(\\text{Right})=0.5$.</p>
                 <p>We sample Right and the episode earns a return of $G=+2$.</p>`
        },
        {
          title: `The math`,
          body: `<p>For a softmax, the score for the sampled action is $\\nabla\\log\\pi(a) = \\mathbf{1}\\{i=a\\} - \\pi_i$. With Right sampled that is $[0-0.5,\\;1-0.5] = [-0.5, +0.5]$.</p>
                 <p>The update $\\theta \\mathrel{+}= \\eta\\,G\\,\\nabla\\log\\pi$ with $\\eta=0.3,\\,G=2$ raises Right's logit and lowers Left's.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute the start probabilities, the score vector, and the post-step probabilities.</p>`,
          code: `import numpy as np
# One-state, two-action worked REINFORCE step (the math, in code).
# Policy starts 50/50; we sample Right, episode return G=+2.
pref=np.array([0.0,0.0])  # [Left,Right]
def softmax(p):
    e=np.exp(p-p.max()); return e/e.sum()
p=softmax(pref)
print("start probs (Left,Right):", np.round(p,3))
a=1; G=2.0; lr=0.3      # sampled Right, return +2
grad=-p.copy(); grad[a]+=1.0   # grad log pi(Right)
print("grad log pi          :", np.round(grad,3))
pref += lr*G*grad
p2=softmax(pref)
print("after one step       :", np.round(p2,3))
print("Right prob went up?  :", bool(p2[1]>p[1]))`,
          output: `start probs (Left,Right): [0.5 0.5]
grad log pi          : [-0.5  0.5]
after one step       : [0.354 0.646]
Right prob went up?  : True`
        }
      ],
      conclusion: `The score is $[-0.5, +0.5]$ and a single positive-return step lifts Right from $0.5$ to $0.646$ while Left drops to $0.354$. Had $G$ been negative, the same vector would have pushed Right down instead — the sign of the return controls the direction, which is the entire logic of policy gradients.`
    }
  ],

  /* ============================================================ */
  /* 4. ACTOR-CRITIC (A2C, PPO)                                  */
  /* ============================================================ */
  "mod-actor-critic": [
    {
      title: `Balancing with a tabular actor-critic`,
      domain: `Control / robotics`,
      question: `A tiny two-state world rewards one action more than the other in every state. Can an actor-critic pair — softmax actor plus a learned value $V(s)$ — find the good action and a sensible value?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Two states that toggle into each other. Two actions: action 0 pays $0.2$, action 1 pays $1.0$, in both states.</p>
                 <p>The <b>actor</b> is a softmax policy per state; the <b>critic</b> holds a value estimate $V(s)$, both starting at $0$.</p>`
        },
        {
          title: `The math`,
          body: `<p>Each step computes the advantage $A = r + \\gamma V(s') - V(s)$. The critic moves $V(s) \\mathrel{+}= \\alpha_C A$; the actor moves $\\theta \\mathrel{+}= \\alpha_A\\,A\\,\\nabla\\log\\pi(a\\mid s)$.</p>
                 <p>Because reward is $1$ every step under the good policy, the geometric series gives $V \\to \\frac{1}{1-\\gamma} = \\frac{1}{0.1} = 10$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Run 3000 actor-critic steps and inspect both networks.</p>`,
          code: `import numpy as np
# Cart-pole-flavoured 2-state world, but solved with a tabular actor-critic.
# Actor = softmax policy per state; Critic = V(s). Reward favours action "Right".
np.random.seed(3)
nS,nA=2,2
pref=np.zeros((nS,nA)); V=np.zeros(nS)
gamma=0.9; lrA=0.3; lrC=0.2
# reward(s,a): in both states, action1 pays more
def reward(s,a): return 1.0 if a==1 else 0.2
def nxt(s,a): return 1-s   # toggles state
def softmax(p):
    e=np.exp(p-p.max()); return e/e.sum()
for step in range(3000):
    s=np.random.randint(nS)
    p=softmax(pref[s])
    a=np.random.choice(nA,p=p)
    r=reward(s,a); s2=nxt(s,a)
    adv = r + gamma*V[s2] - V[s]          # TD advantage
    V[s]+= lrC*adv                         # critic
    grad=-p.copy(); grad[a]+=1.0
    pref[s]+= lrA*adv*grad                 # actor
print("V(s):", np.round(V,3))
for s in range(nS):
    print(f"policy state{s}:", np.round(softmax(pref[s]),3))`,
          output: `V(s): [9.996 9.996]
policy state0: [0.001 0.999]
policy state1: [0.002 0.998]`
        }
      ],
      conclusion: `The critic learns $V(s)\\approx 10$ in both states — exactly the $\\frac{1}{1-\\gamma}$ fixed point — and the actor picks the paying action with probability $\\approx 0.999$. The advantage $A = r + \\gamma V(s') - V(s)$ drove both updates at once: the critic toward the true value, the actor toward the better-than-average action.`
    },
    {
      title: `One advantage step in a game AI`,
      domain: `Games`,
      question: `A game critic values the current board at $V(s)=5$. The agent makes a move, gains reward $1$, and lands in a board worth $V(s')=6$. Did the move beat expectations, and by how much?`,
      steps: [
        {
          title: `The data`,
          body: `<p>The critic's estimate of the current board is $V(s)=5$. After a move it gets reward $r=1$ and reaches a board the critic values at $V(s')=6$. Discount $\\gamma=0.9$.</p>`
        },
        {
          title: `The math`,
          body: `<p>Bootstrap the action value from one step: $Q = r + \\gamma V(s') = 1 + 0.9\\times 6 = 6.4$.</p>
                 <p>The advantage is $A = Q - V(s)$. If $A&gt;0$ the move did better than the board's average, so the actor encourages it; the critic also nudges $V(s)$ up toward $Q$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute $Q$, the advantage, and one critic update.</p>`,
          code: `import numpy as np
# Worked single advantage step (the actor-critic math, in code).
# Game AI: critic values the board at V(s)=5; agent acts, r=1, lands in s' with V=6.
gamma=0.9
V_s=5.0; r=1.0; V_s2=6.0
Q = r + gamma*V_s2          # one-step action value
A = Q - V_s                 # advantage
print("Q = r + gamma*V(s') =", round(Q,3))
print("advantage A = Q-V   =", round(A,3))
print("A>0 -> encourage action:", A>0)
# critic update toward Q (lr 0.3); actor logit nudge for the chosen action
V_new = V_s + 0.3*A
print("critic V(s) after   =", round(V_new,3))`,
          output: `Q = r + gamma*V(s') = 6.4
advantage A = Q-V   = 1.4
A>0 -> encourage action: True
critic V(s) after   = 5.42`
        }
      ],
      conclusion: `The move's bootstrapped value is $Q=6.4$, giving advantage $A = 6.4 - 5 = 1.4 &gt; 0$ — better than expected, so the actor pushes its probability up. The critic edges $V(s)$ from $5$ to $5.42$. This single $(Q,V,A)$ computation, repeated every step and clipped by PPO, is what trained OpenAI Five.`
    },
    {
      title: `Learning when to restock inventory`,
      domain: `Operations / supply chain`,
      question: `Stock can be empty, low, or full. Reordering helps when stock is low but wastes money when full. Can an actor-critic learn the right reorder rule per stock level?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Three states: empty, low, full. Two actions: hold or reorder. Reordering pays $+1$ when stock is empty or low, but $-0.5$ when already full. Holding pays $0.8$ only when full.</p>
                 <p>Reordering fills the warehouse; holding depletes it by one level.</p>`
        },
        {
          title: `The math`,
          body: `<p>Same actor-critic update, per state: advantage $A = r + \\gamma V(s') - V(s)$, then push the actor by $A\\,\\nabla\\log\\pi$ and the critic by $A$.</p>
                 <p>The policy should diverge by state: high reorder probability when empty/low, low when full.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Train 4000 steps and print the reorder probability for each stock level.</p>`,
          code: `import numpy as np
# Inventory restocking: 3 stock-levels, 2 actions (hold / reorder).
# Tabular actor-critic learns when reordering beats holding.
np.random.seed(5)
nS,nA=3,2; gamma=0.9; lrA=0.3; lrC=0.2
pref=np.zeros((nS,nA)); V=np.zeros(nS)
# state0=empty,1=low,2=full. reorder good when low/empty, bad when full.
def reward(s,a):
    if a==1:  # reorder
        return 1.0 if s<2 else -0.5
    else:     # hold
        return 0.8 if s==2 else 0.0
def nxt(s,a):
    return 2 if a==1 else max(0,s-1)   # reorder fills; hold depletes
def softmax(p):
    e=np.exp(p-p.max()); return e/e.sum()
for step in range(4000):
    s=np.random.randint(nS)
    p=softmax(pref[s]); a=np.random.choice(nA,p=p)
    r=reward(s,a); s2=nxt(s,a)
    adv=r+gamma*V[s2]-V[s]
    V[s]+=lrC*adv; g=-p.copy(); g[a]+=1.0; pref[s]+=lrA*adv*g
labels=["empty","low","full"]
for s in range(nS):
    pol=softmax(pref[s])
    print(f"{labels[s]:6s} -> reorder prob {pol[1]:.3f}  (best: {'reorder' if np.argmax(pol)==1 else 'hold'})")`,
          output: `empty  -> reorder prob 0.998  (best: reorder)
low    -> reorder prob 0.998  (best: reorder)
full   -> reorder prob 0.001  (best: hold)`
        }
      ],
      conclusion: `The actor learns a clean state-dependent rule: reorder when empty or low ($p\\approx 0.998$), hold when full ($p\\approx 0.001$). The critic's value estimates separated the states enough for the advantage signal to teach opposite actions — the same A2C machinery that runs real supply-chain and robotics controllers.`
    }
  ],

  /* ============================================================ */
  /* 5. CONTRASTIVE / SELF-SUPERVISED LEARNING                   */
  /* ============================================================ */
  "mod-contrastive": [
    {
      title: `Matching images to captions, CLIP-style`,
      domain: `Multimodal search`,
      question: `Three images and three captions live in a shared embedding space. Using cosine similarity and the InfoNCE loss, does each image retrieve its own caption — and is the loss small?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Each image and each caption is already a 3-dimensional embedding. The true pairs are the diagonal: image $i$ goes with caption $i$ (the <b>positives</b>); every off-diagonal pair is a <b>negative</b>.</p>`
        },
        {
          title: `The math`,
          body: `<p>L2-normalise the vectors, then the similarity matrix is $S = I T^\\top$ (each entry a cosine). The per-image loss is $\\ell_i = -\\log\\frac{\\exp(S_{ii}/\\tau)}{\\sum_k \\exp(S_{ik}/\\tau)}$ with temperature $\\tau=0.1$.</p>
                 <p>This is cross-entropy that asks "which caption is mine?" — small when the diagonal dominates each row.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Build the similarity matrix, check the retrieved caption per image, and compute the InfoNCE loss.</p>`,
          code: `import numpy as np
# CLIP-style image<->caption matching via cosine similarity + InfoNCE loss.
# 3 images, 3 captions. Diagonal = true pairs (positives).
img = np.array([[0.9,0.1,0.2],[0.1,0.8,0.1],[0.2,0.1,0.9]])
txt = np.array([[0.8,0.2,0.1],[0.0,0.9,0.2],[0.3,0.0,0.8]])
def norm(X): return X/np.linalg.norm(X,axis=1,keepdims=True)
I,T=norm(img),norm(txt)
S = I @ T.T            # cosine similarity matrix (rows=images)
tau=0.1
logits=S/tau
# InfoNCE: each image should match its own caption (row i, col i)
def ce(logits):
    L=0
    for i in range(len(logits)):
        z=logits[i]-logits[i].max()
        p=np.exp(z)/np.exp(z).sum()
        L+= -np.log(p[i])
    return L/len(logits)
print("cosine similarity matrix:")
print(np.round(S,3))
print("retrieved caption per image:", list(np.argmax(S,axis=1)))
print("InfoNCE loss:", round(ce(logits),4))`,
          output: `cosine similarity matrix:
[[0.987 0.152 0.543]
 [0.37  0.988 0.158]
 [0.351 0.316 0.984]]
retrieved caption per image: [0, 1, 2]
InfoNCE loss: 0.0058`
        }
      ],
      conclusion: `Every image retrieves its own caption (the argmax is the diagonal $[0,1,2]$) and the InfoNCE loss is a tiny $0.0058$ — because the diagonal similarities ($\\approx 0.98$) tower over the off-diagonals. Pulling matched image-text pairs together while pushing mismatches apart is exactly how CLIP powers text-to-image search.`
    },
    {
      title: `One SimCLR contrastive loss, by hand`,
      domain: `Self-supervised vision`,
      question: `An anchor image's positive view has similarity $0.9$; two negatives have $0.1$ and $0.3$. With $\\tau=1$, what is the NT-Xent loss, and does pulling the positive closer reduce it?`,
      steps: [
        {
          title: `The data`,
          body: `<p>One anchor patch with a single positive (another augmented view of the same image, similarity $0.9$) and two negatives (other images, similarities $0.1$ and $0.3$).</p>`
        },
        {
          title: `The math`,
          body: `<p>The NT-Xent loss is $\\ell = -\\log\\frac{\\exp(s_{ij}/\\tau)}{\\exp(s_{ij}/\\tau) + \\sum_k \\exp(s_{ik}/\\tau)}$. With $\\tau=1$ the numerator is $e^{0.9}$ and the denominator adds $e^{0.1}+e^{0.3}$.</p>
                 <p>Raising the positive similarity toward $1.0$ should shrink $\\ell$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute the loss, then recompute it with the positive similarity bumped to $1.0$.</p>`,
          code: `import numpy as np
# SimCLR worked NT-Xent for one anchor: one positive (other view) + 2 negatives.
tau=1.0
sim_pos=0.9
sim_negs=np.array([0.1,0.3])
num=np.exp(sim_pos/tau)
den=num+np.exp(sim_negs/tau).sum()
p=num/den
loss=-np.log(p)
print("exp(pos/tau)      =", round(num,4))
print("denominator sum   =", round(den,4))
print("P(positive)       =", round(p,4))
print("NT-Xent loss      =", round(loss,4))
# show that pulling positive closer lowers loss
sim_pos2=1.0
p2=np.exp(sim_pos2)/(np.exp(sim_pos2)+np.exp(sim_negs).sum())
print("loss if sim_pos=1.0:", round(-np.log(p2),4))`,
          output: `exp(pos/tau)      = 2.4596
denominator sum   = 4.9146
P(positive)       = 0.5005
NT-Xent loss      = 0.6922
loss if sim_pos=1.0: 0.6435`
        }
      ],
      conclusion: `The positive earns probability $0.50$ and a loss of $0.692$; raising its similarity to $1.0$ drops the loss to $0.644$. The single $-\\log$ term simultaneously rewards a high positive similarity and penalizes high negatives — pulling positives together and pushing negatives apart, with no labels anywhere in sight.`
    },
    {
      title: `Fingerprinting songs without labels`,
      domain: `Audio retrieval`,
      question: `Two clips of the same song should land closest in embedding space. Given embeddings for two views of song A plus two other songs, does cosine similarity recover the correct match?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Four audio embeddings: two augmented views of song A (a positive pair), plus songs B and C as negatives. Self-supervised training would have produced these so that same-song views sit close.</p>`
        },
        {
          title: `The math`,
          body: `<p>Score all pairs with cosine similarity. The contrastive objective wants $\\text{sim}(A_{v1}, A_{v2})$ to be the largest entry in $A_{v1}$'s row, beating $\\text{sim}(A_{v1}, B)$ and $\\text{sim}(A_{v1}, C)$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Use scikit-learn's cosine_similarity and find the nearest neighbour of the first view.</p>`,
          code: `import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
# Self-supervised audio fingerprinting: match two clips of the same song.
# Each clip -> an embedding. Same song = positive (should be most similar).
np.random.seed(7)
songs = {
 "A_v1":[0.9,0.1,0.0,0.2], "A_v2":[0.85,0.15,0.05,0.18],  # same song, 2 views
 "B":[0.1,0.9,0.1,0.0], "C":[0.0,0.2,0.95,0.1],
}
names=list(songs); E=np.array([songs[n] for n in names],dtype=float)
S=cosine_similarity(E)
print("similarity of A_v1 to others:")
for j,n in enumerate(names):
    if n!="A_v1": print(f"  A_v1 vs {n}: {S[0,j]:.3f}")
best=names[1+np.argmax(S[0,1:])]
print("nearest neighbour of A_v1:", best, "->", "correct" if best=="A_v2" else "wrong")`,
          output: `similarity of A_v1 to others:
  A_v1 vs A_v2: 0.996
  A_v1 vs B: 0.213
  A_v1 vs C: 0.044
nearest neighbour of A_v1: A_v2 -> correct`
        }
      ],
      conclusion: `The two views of song A score $0.996$ together, dwarfing the $0.213$ and $0.044$ against the other songs, so the nearest neighbour is correctly the matching view. This is the retrieval test contrastive learning optimizes: positives close, negatives far — the same principle behind audio fingerprinting and duplicate detection.`
    }
  ],

  /* ============================================================ */
  /* 6. VISION TRANSFORMERS                                       */
  /* ============================================================ */
  "mod-vit": [
    {
      title: `Sizing a ViT for chest X-rays`,
      domain: `Medical imaging`,
      question: `How many patch tokens does a ViT make from a $224\\times224$ scan at patch size $16$, and why is patching far cheaper than one token per pixel?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Diagnostic scans come at sizes like $224\\times224$ or $384\\times384$ pixels. A ViT slices each into $P\\times P$ patches; here $P=16$.</p>`
        },
        {
          title: `The math`,
          body: `<p>The token count is $N = \\frac{H\\times W}{P^2}$. Self-attention compares every token to every token, so its cost scales like $N^2$.</p>
                 <p>One token per pixel would make $N = H\\times W$ huge, and $N^2$ astronomically larger — patching is what keeps attention affordable.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute $N$ and the attention pair count for several scan sizes, and contrast with per-pixel tokenization.</p>`,
          code: `import numpy as np
# Medical imaging: count ViT patch tokens + attention cost for a chest X-ray.
def patches(H,W,P): return (H//P)*(W//P)
for (H,W,P) in [(224,224,16),(384,384,16),(48,48,16)]:
    N=patches(H,W,P)
    print(f"{H}x{W}, P={P}: N={N} tokens, attention pairs N^2={N*N}")
# why not per-pixel?
print("per-pixel for 224x224:", 224*224, "tokens ->", (224*224)**2, "pairs")`,
          output: `224x224, P=16: N=196 tokens, attention pairs N^2=38416
384x384, P=16: N=576 tokens, attention pairs N^2=331776
48x48, P=16: N=9 tokens, attention pairs N^2=81
per-pixel for 224x224: 50176 tokens -> 2517630976 pairs`
        }
      ],
      conclusion: `A $224\\times224$ scan becomes just $N=196$ tokens with $\\approx 38{,}000$ attention pairs, versus $2.5$ billion pairs if every one of the $50{,}176$ pixels were a token. The formula $N = \\frac{HW}{P^2}$ shows why patching is the trick that made global attention over images tractable.`
    },
    {
      title: `Running one attention head over satellite patches`,
      domain: `Remote sensing`,
      question: `A small satellite tile is split into four patches with different brightness. After turning each patch into a token and running one self-attention head, which patch does the dimmest patch attend to most?`,
      steps: [
        {
          title: `The data`,
          body: `<p>A $4\\times4$ pixel tile splits into a $2\\times2$ grid of patches, each a $2\\times2$ block flattened to a 4-vector. Patch brightness varies; we normalise pixels to roughly $0$–$1$.</p>`
        },
        {
          title: `The math`,
          body: `<p>With queries and keys equal to the tokens, attention scores are the scaled dot products $\\frac{XX^\\top}{\\sqrt{d}}$, passed through a row-wise softmax.</p>
                 <p>Brighter patches have larger vectors, so they draw more attention weight from every query.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Build the four patch tokens and compute the attention weight matrix.</p>`,
          code: `import numpy as np
# Satellite imagery: build patch tokens then run one self-attention head.
# 2x2 grid -> 4 patches, each 2x2 pixels (flattened to 4-vectors).
img=np.array([[1,1, 5,5],
              [1,1, 5,5],
              [9,9, 1,1],
              [9,9, 1,1]],dtype=float)/10.0   # normalise pixels to ~0..1
P=2; G=2
patches=[]
for r in range(G):
    for c in range(G):
        blk=img[r*P:(r+1)*P, c*P:(c+1)*P].flatten()
        patches.append(blk)
X=np.array(patches)   # 4 tokens x 4 features
print("patch tokens (normalised, flattened pixels):")
print(np.round(X,2))
d=X.shape[1]
scores=X@X.T/np.sqrt(d)        # scaled dot-product, Q=K=X
def softmax(M):
    e=np.exp(M-M.max(1,keepdims=True)); return e/e.sum(1,keepdims=True)
A=softmax(scores)
print("attention weights (row=query patch):")
print(np.round(A,3))
print("patch 0 attends most to patch:", int(np.argmax(A[0])))`,
          output: `patch tokens (normalised, flattened pixels):
[[0.1 0.1 0.1 0.1]
 [0.5 0.5 0.5 0.5]
 [0.9 0.9 0.9 0.9]
 [0.1 0.1 0.1 0.1]]
attention weights (row=query patch):
[[0.235 0.254 0.276 0.235]
 [0.175 0.261 0.389 0.175]
 [0.121 0.248 0.51  0.121]
 [0.235 0.254 0.276 0.235]]
patch 0 attends most to patch: 2`
        }
      ],
      conclusion: `The dimmest patch (patch 0) spreads its attention but leans most on the brightest patch 2 (weight $0.276$), and the bright patch attends $0.51$ to itself. The scaled dot-product softmax $\\text{softmax}(XX^\\top/\\sqrt d)$ let every patch look at every other — the global mixing that distinguishes a ViT from a local convolution.`
    },
    {
      title: `Building a token: patch embedding plus position`,
      domain: `Document layout / OCR`,
      question: `For one patch in a $3\\times3$ grid, how do we combine its flattened pixels (through the embedding matrix $E$) with a position embedding to form the final token the transformer reads?`,
      steps: [
        {
          title: `The data`,
          body: `<p>A document image is cut into a $3\\times3$ grid of patches. We focus on the centre patch (index 4), whose flattened pixels are a 4-vector. The embedding matrix $E$ is $4\\times 3$, mapping pixels to a 3-dim token.</p>`
        },
        {
          title: `The math`,
          body: `<p>The token is $\\text{token}_p = x_p E + E_{pos}(p)$. First $x_p E$ embeds the raw pixels; then we add the learnable position vector for grid cell $p$ so the model knows where the patch sat.</p>
                 <p>The patch count is $N = \\frac{H\\times W}{P^2}$; a $48\\times48$ image with $P=16$ gives $N=9$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Compute the patch embedding, add the position embedding, and confirm the token count.</p>`,
          code: `import numpy as np
# Document layout (OCR): patch embedding + position embedding build a token.
# 3x3 grid of patches; each patch flattened pixels -> embed -> add position.
np.random.seed(0)
# one patch's flattened pixels (4 pixels) and the embedding matrix E (4x3)
x_p=np.array([0.2,0.8,0.4,0.6])
E=np.array([[0.5,0.0,0.1],
            [0.1,0.5,0.0],
            [0.0,0.1,0.5],
            [0.2,0.2,0.2]])
patch_emb = x_p @ E
# learnable position embedding for patch index 4 (centre of 3x3)
pos = np.array([0.10,-0.05,0.20])
token = patch_emb + pos
print("patch embedding x_p @ E :", np.round(patch_emb,3))
print("position embedding      :", np.round(pos,3))
print("final token             :", np.round(token,3))
# count tokens for this image
H=W=48; P=16
print("N tokens =", (H//P)*(W//P), "(a", H//P, "x", W//P, "grid)")`,
          output: `patch embedding x_p @ E : [0.3  0.56 0.34]
position embedding      : [ 0.1  -0.05  0.2 ]
final token             : [0.4  0.51 0.54]
N tokens = 9 (a 3 x 3 grid)`
        }
      ],
      conclusion: `The patch embeds to $[0.3, 0.56, 0.34]$, and adding the position vector yields the final token $[0.4, 0.51, 0.54]$ — pixels plus place, exactly $\\text{token}_p = x_p E + E_{pos}(p)$. The $48\\times48$ image makes $N=9$ such tokens, which then feed the transformer's attention stack for layout analysis.`
    }
  ],

  /* ============================================================ */
  /* 7. TIME-SERIES FORECASTING (ARIMA)                          */
  /* ============================================================ */
  "mod-timeseries": [
    {
      title: `Forecasting electricity demand with a widening band`,
      domain: `Energy / utilities`,
      question: `From 40 days of demand generated by an AR(1) process, can least squares recover the model, and does the 95% prediction band widen as we forecast further out?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Daily electricity demand, generated by $y_t = c + \\phi y_{t-1} + \\varepsilon_t$ with $c=4$, $\\phi=0.6$ and noise scale $0.8$. We only see the numbers, not the parameters.</p>`
        },
        {
          title: `The math`,
          body: `<p>Fit $y_t = c + \\phi y_{t-1}$ by least squares on lagged pairs. Forecast recursively, feeding each prediction back in.</p>
                 <p>The forecast variance at horizon $h$ is $\\sigma^2\\sum_{k=0}^{h-1}\\phi^{2k}$, so the $95\\%$ band $\\pm 1.96\\,\\sigma\\sqrt{\\sum \\phi^{2k}}$ grows with $h$.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Fit the AR(1) with numpy's lstsq, then forecast four steps with the widening interval.</p>`,
          code: `import numpy as np
# Electricity demand: fit an AR(1) by least squares, then forecast with a widening band.
np.random.seed(0)
phi_true, c_true, sigma = 0.6, 4.0, 0.8
y=[6.0]
for _ in range(40):
    y.append(c_true + phi_true*y[-1] + sigma*np.random.randn())
y=np.array(y)
# least-squares fit of y_t = c + phi*y_{t-1}
X=np.vstack([np.ones(len(y)-1), y[:-1]]).T
c_hat, phi_hat = np.linalg.lstsq(X, y[1:], rcond=None)[0]
resid = y[1:] - X@np.array([c_hat,phi_hat])
sig_hat = resid.std()
print("fitted c   =", round(c_hat,3))
print("fitted phi =", round(phi_hat,3))
# forecast 4 steps with 95% band variance = sig^2 * sum phi^(2k)
last=y[-1]; var=0.0
for h in range(1,5):
    last = c_hat + phi_hat*last
    var += phi_hat**(2*(h-1))
    band=1.96*sig_hat*np.sqrt(var)
    print(f"h={h}: forecast={last:.3f}  +/-{band:.3f}")`,
          output: `fitted c   = 5.579
fitted phi = 0.472
h=1: forecast=10.321  +/-1.640
h=2: forecast=10.449  +/-1.813
h=3: forecast=10.510  +/-1.850
h=4: forecast=10.538  +/-1.858`
        }
      ],
      conclusion: `Least squares recovers a positive, stable $\\hat\\phi=0.472$, and the band widens monotonically from $\\pm 1.64$ at one step to $\\pm 1.86$ at four — exactly the $\\sigma\\sqrt{\\sum\\phi^{2k}}$ growth the derivation predicts. The point forecasts settle toward the long-run level $\\frac{c}{1-\\phi}$ while uncertainty compounds with each fresh surprise.`
    },
    {
      title: `Differencing away a sales trend`,
      domain: `Retail`,
      question: `Monthly sales climb every period — the "I" in ARIMA. Does first-differencing turn this trending series into a steady one we can forecast, and what does it predict next?`,
      steps: [
        {
          title: `The data`,
          body: `<p>Ten months of sales that rise by a growing amount each month: $100, 104, 109, \\dots, 172$. The upward trend means the raw series is non-stationary, which AR and MA models dislike.</p>`
        },
        {
          title: `The math`,
          body: `<p>Differencing computes $\\Delta y_t = y_t - y_{t-1}$, the "I" step. If the differenced series is roughly constant, the average step is a good forecast of growth.</p>
                 <p>To forecast the raw value we <b>integrate</b> back: add the average step to the last observed value, repeatedly.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Difference the series, average the steps, and integrate three steps forward.</p>`,
          code: `import numpy as np
# Retail sales with an upward trend: differencing (the "I" in ARIMA) makes it stationary.
sales=np.array([100,104,109,115,122,130,139,149,160,172],dtype=float)
diff=np.diff(sales)            # first difference: remove the trend
print("raw sales      :", sales.astype(int).tolist())
print("differenced    :", diff.tolist())
print("mean of diff   :", round(diff.mean(),3), "(steady growth per step)")
# forecast next raw value: last value + average differenced step
nxt = sales[-1] + diff.mean()
print("forecast next  :", round(nxt,3))
# forecast 3 ahead by integrating the average step back up
f=sales[-1]; fc=[]
for h in range(3):
    f += diff.mean(); fc.append(round(f,2))
print("3-step forecast:", fc)`,
          output: `raw sales      : [100, 104, 109, 115, 122, 130, 139, 149, 160, 172]
differenced    : [4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0]
mean of diff   : 8.0 (steady growth per step)
forecast next  : 180.0
3-step forecast: [180.0, 188.0, 196.0]`
        }
      ],
      conclusion: `First-differencing converts the curving sales line into the clean ramp $[4,5,\\dots,12]$ with an average step of $8$, so the next value forecasts to $180$ and three steps give $[180, 188, 196]$. Removing the trend with $\\Delta y_t = y_t - y_{t-1}$ and integrating the forecast back up is precisely the "I" in ARIMA at work.`
    },
    {
      title: `Predicting website traffic with an AR(2)`,
      domain: `Web analytics`,
      question: `Daily page views depend on the last two days. Can scikit-learn's linear regression fit an AR(2) on lagged traffic, and what does it forecast for the next three days?`,
      steps: [
        {
          title: `The data`,
          body: `<p>60 days of traffic generated by $y_t = 2 + 0.5\\,y_{t-1} + 0.3\\,y_{t-2} + \\varepsilon_t$. Today depends on the two previous days, so we use two lags.</p>`
        },
        {
          title: `The math`,
          body: `<p>An AR(2) is a linear model with features $[y_{t-1}, y_{t-2}]$ and target $y_t$. Fitting it is ordinary least squares — exactly what LinearRegression does.</p>
                 <p>Forecasting is recursive: predict tomorrow, then feed it back as a lag for the day after.</p>`
        },
        {
          title: `Run it`,
          body: `<p>Build the lagged design matrix, fit with sklearn, and roll forward three days.</p>`,
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
# Website traffic: AR(2) via sklearn. Predict today from the last two days.
np.random.seed(3)
n=60; y=np.zeros(n); y[0],y[1]=10,11
for t in range(2,n):
    y[t]=2.0 + 0.5*y[t-1] + 0.3*y[t-2] + np.random.randn()*0.5
# build lagged design matrix
X=np.column_stack([y[1:-1], y[0:-2]])   # [y_{t-1}, y_{t-2}]
target=y[2:]
m=LinearRegression().fit(X,target)
print("intercept c     :", round(m.intercept_,3))
print("phi1, phi2      :", np.round(m.coef_,3))
# forecast next 3 steps recursively
hist=list(y[-2:])
fc=[]
for _ in range(3):
    pred=m.intercept_+m.coef_[0]*hist[-1]+m.coef_[1]*hist[-2]
    fc.append(round(pred,3)); hist.append(pred)
print("3-step forecast :", fc)`,
          output: `intercept c     : 2.31
phi1, phi2      : [0.663 0.095]
3-step forecast : [9.584, 9.556, 9.551]`
        }
      ],
      conclusion: `The fit recovers a positive intercept and coefficients $[\\hat\\phi_1, \\hat\\phi_2]=[0.663, 0.095]$, and the recursive forecast converges to about $9.55$ — the model's long-run level $\\frac{c}{1-\\phi_1-\\phi_2}$. An AR(p) is just linear regression on lagged values, the autoregressive heart of ARIMA, fitted here with off-the-shelf least squares.`
    }
  ]

});
