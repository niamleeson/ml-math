/* All ML — authored content for Part 27: Frontiers (27.1–27.5).
   Appends to window.ALLML_CONTENT (merged into lessons by id in all-ml-register.js).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 27.1 Quantum machine learning ---------------- */
window.ALLML_CONTENT["27.1"] = {
  tagline: "Quantum ML asks whether amplitudes, interference, and measurement can form useful learning features.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/27.1-quantum-machine-learning.ipynb",
  context: String.raw`
    <p>Quantum machine learning rests on familiar mechanisms wearing a new representation.</p>
    <ul>
      <li><b>Linear algebra</b> supplies the state vector: a qubit is a unit vector of amplitudes, and an allowed gate preserves that norm.</li>
      <li><b>Probability</b> enters only at measurement: amplitudes become probabilities by squared magnitude.</li>
      <li><b>Kernels and feature maps</b> explain the practical bridge: a circuit can map an input to a state, and a learner can compare states by inner product.</li>
      <li><b>Gradient learning</b> remains the training engine for variational circuits, which expose a scalar loss to an ordinary optimizer.</li>
    </ul>
    <p>Where it leads: foundation models (27.3) scale classical representation learning, while quantum ML asks whether a different physical representation can help. The wise stance is careful: the learning problem is still statistical even when the feature map is quantum.</p>`,
  intuition: String.raw`
    <p>The concrete problem is to learn from data when a quantum device might prepare or transform features that are expensive to imitate classically. The naive hope says: put data into qubits, let the state hold exponentially many amplitudes, and read out the answer. The pain is that measurement does not reveal the whole hidden vector; it gives samples from a probability distribution.</p>
    <p>The mental model is a wave. Amplitudes can reinforce or cancel before measurement. A circuit helps only if it makes useful outcomes more likely and unhelpful outcomes less likely.</p>
    <p>The design decision people gloss over is <b>what to measure</b>. You choose an observable such as $Z$, train the circuit so its expectation matches the target, and accept that all unmeasured information is invisible to the loss. The measurement is therefore part of the model, not a final detail.</p>`,
  mathematics: String.raw`
    <p>A one-qubit state is $|\psi\rangle=[\alpha,\beta]^T$ with $|\alpha|^2+|\beta|^2=1$. Measuring in the computational basis gives $P(0)=|\alpha|^2$ and $P(1)=|\beta|^2$. The Pauli-$Z$ expectation is $\langle Z\rangle=P(0)-P(1)$.</p>
    <p><b>Amplitudes become probabilities by squaring.</b> For $|\psi\rangle=[0.6,0.8]^T$:</p>
    <ol class="work">
      <li>normalization: $0.6^2+0.8^2=0.36+0.64=1.000$</li>
      <li>measurement probabilities: $P(0)=0.36$, $P(1)=0.64$</li>
      <li>$\langle Z\rangle=0.36-0.64=-0.280$</li>
    </ol>
    <p>The negative expectation says outcome 1 is more likely, but neither outcome is certain.</p>
    <p><b>A rotation is a learnable feature map.</b> Applying $R_y(\theta)$ to $|0\rangle$ gives $[\cos(\theta/2),\sin(\theta/2)]$. At $\theta=\pi/3$:</p>
    <ol class="work">
      <li>$\cos(\pi/6)=0.866$, $\sin(\pi/6)=0.500$</li>
      <li>$P(0)=0.866^2=0.750$, $P(1)=0.500^2=0.250$</li>
      <li>$\langle Z\rangle=0.750-0.250=0.500$</li>
    </ol>
    <p>One angle has turned an input into a measurable prediction, just as a classical feature transform does.</p>
    <p><b>Interference changes what can be read.</b> A Hadamard gate sends $|0\rangle$ to $[0.707,0.707]^T$:</p>
    <ol class="work">
      <li>$H|0\rangle=\frac{1}{\sqrt2}[1,1]^T=[0.707,0.707]^T$</li>
      <li>$P(0)=0.707^2=0.500$, $P(1)=0.707^2=0.500$</li>
      <li>$\langle Z\rangle=0.500-0.500=0.000$</li>
    </ol>
    <p>The equal probabilities are not mere ignorance; later gates can still make branches interfere before final measurement.</p>
    <p><b>A quantum kernel compares prepared states.</b> For feature states with angles $a$ and $b$, use $K(a,b)=|\langle\phi(a)|\phi(b)\rangle|^2=\cos^2((a-b)/2)$:</p>
    <ol class="work">
      <li>$a=0.2$, $b=0.7$: $\cos^2((0.2-0.7)/2)=0.939$</li>
      <li>$a=0.2$, $b=2.6$: $\cos^2((0.2-2.6)/2)=0.131$</li>
    </ol>
    <p>The circuit-induced similarity is high for nearby prepared states and low for separated ones.</p>
    <p><b>Training still minimizes an ordinary loss.</b> If $\hat y=\cos\theta$, target $y=1$, and $\theta=1.2$:</p>
    <ol class="work">
      <li>$\hat y=\cos(1.2)=0.362$</li>
      <li>$L=(0.362-1)^2=0.407$</li>
      <li>$dL/d\theta=2(\hat y-y)(-\sin\theta)=1.189$</li>
    </ol>
    <p>The optimizer sees a classical scalar gradient; the circuit defines the prediction map being tuned.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing amplitudes with accessible data.</b> Measurement returns samples from $|\alpha_i|^2$, so any advantage must survive the readout bottleneck.</li>
      <li><b>Forgetting normalization.</b> If $\sum_i |\alpha_i|^2 \neq 1$, the squared amplitudes are not probabilities and $\langle Z\rangle$ is meaningless.</li>
      <li><b>Calling any circuit a useful feature map.</b> The kernel $K(a,b)$ matters only if it separates labels better than a classical baseline.</li>
      <li><b>Measuring the wrong observable.</b> The loss can improve only the scalar you read out, so a poor observable hides useful state information.</li>
    </ul>`
};

/* ---------------- 27.2 Neuromorphic computing ---------------- */
window.ALLML_CONTENT["27.2"] = {
  tagline: "Neuromorphic learning treats time and sparse spikes as computation, not implementation detail.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/27.2-neuromorphic-computing.ipynb",
  context: String.raw`
    <p>Neuromorphic computing borrows biological timing, but the learning mechanisms are familiar.</p>
    <ul>
      <li><b>Recurrent dynamics</b> supply memory: membrane voltage carries evidence from one time step to the next.</li>
      <li><b>Nonlinear activations</b> become thresholds: a neuron emits an event when voltage crosses a boundary.</li>
      <li><b>Sparsity</b> becomes an energy mechanism: if few spikes occur, event-driven hardware can skip most work.</li>
      <li><b>Surrogate gradients</b> connect back to backpropagation because the hard spike function is discontinuous.</li>
    </ul>
    <p>Where it leads: embodied AI (27.4) needs fast sensorimotor loops, and neuromorphic systems are one possible substrate. The frontier is not replacing every neural net; it is matching event-driven computation to event-driven data.</p>`,
  intuition: String.raw`
    <p>The concrete problem is to process streams such as event cameras, audio clicks, or robot touch without recomputing a dense network at every clock tick. The naive approach samples everything at a fixed rate and runs the same work even when the world barely changed.</p>
    <p>The mental model is a leaky bucket. Input fills the bucket, leakage drains it, and a spike occurs when the level crosses threshold. After a spike, the bucket resets. Computation is sparse in space and time.</p>
    <p>The design decision people gloss over is <b>the leak</b>. With too little leak, stale evidence persists and causes late false spikes. With too much leak, weak but meaningful evidence disappears before it can accumulate. The leak constant is the neuron's memory timescale.</p>`,
  mathematics: String.raw`
    <p>A leaky integrate-and-fire neuron has voltage $v_t$, input $x_t$, leak $\lambda$, threshold $\theta$, and spike $s_t\in\{0,1\}$:</p>
    <div class="formula-box">$$\tilde v_t=\lambda v_{t-1}+x_t,\qquad s_t=\mathbf{1}[\tilde v_t\ge\theta],\qquad v_t=(1-s_t)\tilde v_t$$</div>
    <p><b>A strong event spikes immediately.</b> With $v_0=0$, $\lambda=0.8$, $\theta=1$, and inputs $[1.2,0,0,0,0]$:</p>
    <ol class="work">
      <li>$\tilde v_1=0.8\cdot0+1.2=1.200\ge1$, so $s_1=1$ and reset gives $v_1=0$</li>
      <li>$\tilde v_2=0.8\cdot0+0=0.000$, so $s_2=0$</li>
      <li>the spike train is $[1,0,0,0,0]$</li>
    </ol>
    <p>The neuron spends energy only when the input carries enough evidence.</p>
    <p><b>Weak evidence can accumulate.</b> With five inputs of $0.3$:</p>
    <ol class="work">
      <li>$v_1=0.8\cdot0+0.3=0.300$</li>
      <li>$v_2=0.8\cdot0.300+0.3=0.540$</li>
      <li>$v_3=0.8\cdot0.540+0.3=0.732$</li>
      <li>$v_4=0.8\cdot0.732+0.3=0.886$</li>
      <li>$v_5=0.8\cdot0.886+0.3=1.008\ge1$, so the spike train is $[0,0,0,0,1]$</li>
    </ol>
    <p>The spike time records persistence, not just instantaneous magnitude.</p>
    <p><b>The leak chooses the memory window.</b> For four inputs of $0.3$:</p>
    <ol class="work">
      <li>$\lambda=0.2$: $0.300\to0.360\to0.372\to0.374$</li>
      <li>$\lambda=0.8$: $0.300\to0.540\to0.732\to0.886$</li>
    </ol>
    <p>The high-retention neuron approaches threshold; the low-retention neuron treats old evidence as nearly gone.</p>
    <p><b>Weighted input is still a dot product.</b> With presynaptic spikes $x=[1,0,1]$ and weights $w=[0.6,0.2,0.5]$:</p>
    <ol class="work">
      <li>$x^T w=1\cdot0.6+0\cdot0.2+1\cdot0.5=1.100$</li>
      <li>with $\theta=1$, the neuron spikes and resets</li>
    </ol>
    <p>Spiking changes when evidence is transmitted, not the basic weighted-sum logic.</p>
    <p><b>Sparse spikes reduce work.</b> If a dense layer has 1000 inputs but only 12 spike:</p>
    <ol class="work">
      <li>active fraction $=12/1000=0.012$</li>
      <li>skipped fraction $=1-0.012=0.988$</li>
    </ol>
    <p>The 98.8% skipped fraction is the hardware promise of event-driven computation.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Choosing leakage by habit.</b> The term $\lambda v_{t-1}$ is the memory; wrong leakage preserves stale evidence or erases useful weak evidence.</li>
      <li><b>Ignoring reset.</b> Without $(1-s_t)$, one threshold crossing can fire repeatedly for the same stored voltage.</li>
      <li><b>Training through the hard threshold as if it were smooth.</b> The indicator $\mathbf{1}[\tilde v_t\ge\theta]$ has no useful ordinary derivative, so gradient training needs a surrogate.</li>
      <li><b>Assuming sparsity automatically appears.</b> Low thresholds or badly scaled inputs raise the active fraction and erase the energy advantage.</li>
    </ul>`
};

/* ---------------- 27.3 Foundation models & generalist agents ---------------- */
window.ALLML_CONTENT["27.3"] = {
  tagline: "Foundation models replace many narrow systems with one broad prior that can be prompted, adapted, and tooled.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/27.3-foundation-models-generalist-agents.ipynb",
  context: String.raw`
    <p>Foundation models are earlier mechanisms scaled and composed.</p>
    <ul>
      <li><b>Self-supervised learning</b> turns raw sequences into next-token prediction examples.</li>
      <li><b>Transformers and attention</b> let one context condition many predictions and tool choices.</li>
      <li><b>Representation learning</b> explains transfer: pretraining shapes features that downstream tasks reuse.</li>
      <li><b>Reinforcement learning</b> reappears when a model becomes an agent that acts, observes, and revises a plan.</li>
    </ul>
    <p>Where it leads: embodied AI (27.4) asks whether broad priors can control physical action, and AGI discussions (27.5) ask which missing abilities are not solved by scale alone.</p>`,
  intuition: String.raw`
    <p>The concrete problem is fragmentation. Separate models for summarization, coding, retrieval, dialogue, and tool use duplicate data and fail when the task shifts. The foundation-model bet is to train one broad prior first, then specialize it by prompting, fine-tuning, retrieval, or tools.</p>
    <p>The mental model is a compressed map of regularities. Pretraining learns reusable conditional patterns; an agent wraps the model in a loop that observes state, chooses an action or tool, reads the result, and continues.</p>
    <p>The design decision people gloss over is <b>where knowledge should live</b>. Parameters are fast but stale, retrieval is fresh but search-dependent, and tools are precise but require planning and verification. Generalist systems route among these stores rather than pretending one store is enough.</p>`,
  mathematics: String.raw`
    <p>A scaling-law sketch writes validation loss as $L(C)=A C^{-\alpha}$, where $C$ is compute, $A$ is a family constant, and $\alpha\gt0$ is the scaling exponent. Autoregressive pretraining minimizes $\mathcal{L}=-(1/T)\sum_{t=1}^T \log p_\theta(x_t|x_{\lt t})$.</p>
    <p><b>Scaling is smooth, not miraculous.</b> With $A=1.2$ and $\alpha=0.08$:</p>
    <ol class="work">
      <li>$C=10^{20}$: $L=1.2\cdot(10^{20})^{-0.08}=0.030143$</li>
      <li>$C=10^{22}$: $L=1.2\cdot(10^{22})^{-0.08}=0.020854$</li>
      <li>$C=10^{24}$: $L=1.2\cdot(10^{24})^{-0.08}=0.014427$</li>
    </ol>
    <p>Loss keeps falling, but the small exponent makes each improvement expensive.</p>
    <p><b>A hundredfold compute increase has a fixed factor.</b></p>
    <ol class="work">
      <li>$L(100C)/L(C)=100^{-0.08}=0.692$</li>
      <li>relative reduction $=1-0.692=0.308$</li>
    </ol>
    <p>The 30.8% reduction is valuable, but it is a price curve rather than a magic switch.</p>
    <p><b>Training compute is dominated by tokens and parameters.</b> A rough transformer rule is $C\approx6ND$. For $N=70$ billion and $D=300$ billion:</p>
    <ol class="work">
      <li>$C=6\cdot70{,}000{,}000{,}000\cdot300{,}000{,}000{,}000$</li>
      <li>$C=1.26\cdot10^{23}$ FLOPs</li>
    </ol>
    <p>This scale explains why data quality, reuse, and evaluation discipline matter as much as raw size.</p>
    <p><b>A generalist score is a mixture.</b> With task losses $0.20,0.40,0.60$ and weights $0.5,0.3,0.2$:</p>
    <ol class="work">
      <li>$0.5\cdot0.20+0.3\cdot0.40+0.2\cdot0.60=0.100+0.120+0.120=0.340$</li>
    </ol>
    <p>A low-frequency tool weakness can hide inside a respectable average.</p>
    <p><b>Routing among tools is a probability model.</b> With logits $[2.0,1.0,-0.5]$ for answer, retrieve, calculate:</p>
    <ol class="work">
      <li>exponentiate: $[e^2,e^1,e^{-0.5}]=[7.389,2.718,0.607]$</li>
      <li>sum $=10.714$ and divide to get $[0.690,0.254,0.057]$</li>
      <li>with costs $[0.2,0.5,0.8]$, expected cost $=0.690\cdot0.2+0.254\cdot0.5+0.057\cdot0.8=0.310$</li>
    </ol>
    <p>The agent is only as reliable as the route it chooses under uncertainty.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Reading scaling laws as guarantees of reasoning.</b> $C^{-\alpha}$ describes average loss, not rare planning failures.</li>
      <li><b>Averaging away weaknesses.</b> The mixture loss can hide a poor low-weight skill such as tool use.</li>
      <li><b>Putting all knowledge in parameters.</b> Retrieval and tools change the conditioning context and can fix stale parametric memory.</li>
      <li><b>Ignoring router calibration.</b> Softmax probabilities decide which external system runs, so confident wrong routes can be costly.</li>
    </ul>`
};

/* ---------------- 27.4 Embodied AI & robotics learning ---------------- */
window.ALLML_CONTENT["27.4"] = {
  tagline: "Embodied AI closes the loop: perception, action, reward, and physics all answer back.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/27.4-embodied-ai-robotics-learning.ipynb",
  context: String.raw`
    <p>Embodied AI is where learned predictions become actions with consequences.</p>
    <ul>
      <li><b>Reinforcement learning</b> supplies states, actions, rewards, value functions, and temporal-difference updates.</li>
      <li><b>Vision and representation learning</b> turn sensors into state estimates the policy can use.</li>
      <li><b>Control theory</b> contributes feedback and stability: the robot corrects while moving.</li>
      <li><b>Imitation learning</b> supplies demonstrations when reward is sparse or unsafe to discover by trial and error.</li>
    </ul>
    <p>Where it leads: neuromorphic computing (27.2) offers a low-latency substrate, foundation models (27.3) offer broad priors, and AGI debates (27.5) ask whether general intelligence needs embodied interaction.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that a robot's prediction changes the next data point. A classifier can be wrong and move on; a robot that grasps poorly changes the object pose, camera view, and future options.</p>
    <p>The naive approach trains in simulation and deploys as if the real world were another validation set. The pain is the sim-to-real gap: friction, latency, lighting, and contact differ enough to break brittle policies.</p>
    <p>The mental model is a feedback loop. The policy acts, the world transitions, sensors observe the result, and learning changes future actions. The design decision people gloss over is <b>what state to trust</b>: raw pixels are rich but hard, hand-coded state is clean but incomplete, and learned state can drift.</p>`,
  mathematics: String.raw`
    <p>An embodied learner is often modeled as an MDP with state $s_t$, action $a_t$, reward $r_t$, transition $p(s_{t+1}|s_t,a_t)$, discount $\gamma$, and value $V(s)$. A one-step update is $\delta_t=r_t+\gamma V(s_{t+1})-V(s_t)$ and $V(s_t)\leftarrow V(s_t)+\eta\delta_t$.</p>
    <p><b>Feedback turns future value into today's target.</b> With $r_t=0$, $\gamma=0.9$, $V(s_{t+1})=1.5$, $V(s_t)=1.0$, and $\eta=0.2$:</p>
    <ol class="work">
      <li>target $=0+0.9\cdot1.5=1.350$</li>
      <li>$\delta=1.350-1.000=0.350$</li>
      <li>updated value $=1.000+0.2\cdot0.350=1.070$</li>
    </ol>
    <p>The state becomes more valuable because its successor was better than expected.</p>
    <p><b>Action selection can stay exploratory.</b> With $Q=[1.2,0.7,0.4]$ and inverse temperature $\beta=2$:</p>
    <ol class="work">
      <li>exponentiate: $e^{2Q}=[11.023,4.055,2.226]$</li>
      <li>sum $=17.304$ and divide to get $\pi=[0.637,0.234,0.129]$</li>
    </ol>
    <p>The best action is favored but not forced, which keeps contact exploration alive.</p>
    <p><b>Imitation learning fits demonstrated actions.</b> If $a^\star=0.80$ and $\hat a=0.62$:</p>
    <ol class="work">
      <li>behavior-cloning loss $=(0.62-0.80)^2=(-0.18)^2=0.0324$</li>
    </ol>
    <p>The loss is easy to optimize, but it does not teach recovery from unseen states.</p>
    <p><b>Sim-to-real is a distribution shift.</b> If grasp success is $92/100$ in simulation and $73/100$ on hardware:</p>
    <ol class="work">
      <li>simulation success $=92/100=0.920$</li>
      <li>real success $=73/100=0.730$</li>
      <li>gap $=0.920-0.730=0.190$</li>
    </ol>
    <p>The 19-point gap is evidence that the transition or observation model changed.</p>
    <p><b>Closed-loop correction compounds.</b> If a controller removes 40% of the remaining error each step from 10 cm:</p>
    <ol class="work">
      <li>after one step: $10\cdot0.6=6.000$ cm</li>
      <li>after two steps: $6.000\cdot0.6=3.600$ cm</li>
      <li>after three steps: $3.600\cdot0.6=2.160$ cm</li>
    </ol>
    <p>Embodiment rewards sensing and correction rather than one open-loop guess.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Treating robot data as independent examples.</b> The transition $p(s_{t+1}|s_t,a_t)$ depends on the policy, so errors change future data.</li>
      <li><b>Optimizing imitation loss alone.</b> Small $(\hat a-a^\star)^2$ on demonstrations says little about recovery states outside them.</li>
      <li><b>Ignoring sim-to-real gaps.</b> A 0.190 success drop means the world model shifted; more simulator epochs may overfit the wrong dynamics.</li>
      <li><b>Going greedy too early.</b> A near-deterministic softmax can stop exploration before $Q$ has seen enough contacts.</li>
    </ul>`
};

/* ---------------- 27.5 Toward AGI: open problems ---------------- */
window.ALLML_CONTENT["27.5"] = {
  tagline: "AGI is not one score going up; it is many abilities holding together under shift.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/27.5-toward-agi-open-problems.ipynb",
  context: String.raw`
    <p>This final frontier lesson is a map of unresolved mechanisms, not a victory lap.</p>
    <ul>
      <li><b>Generalization theory</b> asks why performance should survive beyond the training sample.</li>
      <li><b>Representation learning</b> asks whether concepts transfer or merely correlate with a benchmark.</li>
      <li><b>Agent learning</b> asks how goals, memory, feedback, and action compose over long horizons.</li>
      <li><b>Foundation models</b> (27.3) and embodied AI (27.4) expose the central tension: broad priors are impressive, but reliability under interaction is still hard.</li>
    </ul>
    <p>Where it leads: future work splits into interpretability, scalable oversight, continual learning, world modeling, and robust evaluation. The wise stance is neither dismissal nor hype; it is naming missing mechanisms precisely.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that broad competence is not the same as general intelligence. A model can ace many benchmarks and still fail when goals are underspecified, observations shift, tools behave unexpectedly, or the task requires long-horizon recovery.</p>
    <p>The naive approach collapses AGI into one leaderboard. The pain is Goodhart's law: once a metric becomes the target, systems learn the metric's shortcuts. A single average hides whether the system can adapt, explain, recover, and remain aligned.</p>
    <p>The mental model is a chain with load-bearing links: capability, robustness, memory, agency, and alignment. The design decision people gloss over is <b>aggregation</b>. Arithmetic averages reward spiky systems; bottleneck-aware metrics punish missing links.</p>`,
  mathematics: String.raw`
    <p>Let $c\in[0,1]^k$ be a capability vector, $w_i\ge0$ with $\sum_i w_i=1$ be task weights, and let shifted performance be compared against in-distribution performance. Averages use $w^T c$; bottleneck views use $\min_i c_i$ or the geometric mean $\exp((1/k)\sum_i \log c_i)$.</p>
    <p><b>An average can hide a weak link.</b> With $c=[0.9,0.8,0.2,0.4]$ and equal weights:</p>
    <ol class="work">
      <li>arithmetic average $=(0.9+0.8+0.2+0.4)/4=0.575$</li>
      <li>geometric mean $=(0.9\cdot0.8\cdot0.2\cdot0.4)^{1/4}=0.490$</li>
      <li>bottleneck score $=\min(0.9,0.8,0.2,0.4)=0.200$</li>
    </ol>
    <p>The same system looks decent by average and fragile by bottleneck.</p>
    <p><b>Robustness is a measurable gap.</b> If in-distribution score is $0.82$ and shifted score is $0.49$:</p>
    <ol class="work">
      <li>gap $=0.82-0.49=0.330$</li>
      <li>retained fraction $=0.49/0.82=0.598$</li>
    </ol>
    <p>The model retained only 59.8% of its apparent competence under shift.</p>
    <p><b>Continual learning exposes forgetting.</b> Old-task scores $[0.85,0.80,0.78]$ become $[0.55,0.57,0.90]$ after a new task:</p>
    <ol class="work">
      <li>before mean $=(0.85+0.80+0.78)/3=0.810$</li>
      <li>after mean $=(0.55+0.57+0.90)/3=0.673$</li>
      <li>old-task average change $=((0.55-0.85)+(0.57-0.80))/2=-0.265$</li>
    </ol>
    <p>The new skill is real, but the 26.5-point old-task drop shows the representation did not preserve prior competence.</p>
    <p><b>Alignment changes the objective.</b> With helpfulness $0.92$, honesty $0.88$, and safety $0.40$:</p>
    <ol class="work">
      <li>average $=(0.92+0.88+0.40)/3=0.733$</li>
      <li>required-floor score $=\min(0.92,0.88,0.40)=0.400$</li>
    </ol>
    <p>High helpfulness cannot compensate for a low safety floor when actions matter.</p>
    <p><b>Compute alone does not certify generality.</b> With scaling factor $100^{-0.08}=0.692$ and starting loss $0.300$:</p>
    <ol class="work">
      <li>scaled loss $=0.300\cdot0.692=0.208$</li>
      <li>absolute improvement $=0.300-0.208=0.092$</li>
    </ol>
    <p>The gain is meaningful, but it says nothing by itself about bottlenecks, shift, forgetting, or alignment floors.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Using one benchmark average as a definition.</b> $w^T c$ hides weak coordinates; AGI claims need bottleneck and shift-sensitive measurements.</li>
      <li><b>Equating scale with solved reasoning.</b> Lower predictive loss is not proof that long-horizon planning or causal abstraction works.</li>
      <li><b>Ignoring catastrophic forgetting.</b> Continual learning must track old-task changes, not just the new-task score.</li>
      <li><b>Treating alignment as a postscript.</b> A safety floor cannot be averaged away by helpfulness or fluency.</li>
    </ul>`
};
