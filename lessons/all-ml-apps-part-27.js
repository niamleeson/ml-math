/* All ML — Part 27 applications (5 each). Loaded after content-part-27.js, before all-ml-register.js. */

/* ---- _apps-part27-A.js ---- */
(window.ALLML_CONTENT["27.1"] = window.ALLML_CONTENT["27.1"] || {}).applications = [
  {
    title: "Quantum readout for binary decisions",
    background: "<p>Quantum readout turns a prepared state into observed class probabilities, so the final measurement is the bridge from amplitudes to a usable decision.</p>",
    numbers: "<p>Using the lesson state $[0.6,0.8]^T$, the probabilities are $P(0)=0.6^2=0.36$ and $P(1)=0.8^2=0.64$, so $\langle Z\rangle=0.36-0.64=-0.280$ and outcome 1 is favored.</p>"
  },
  {
    title: "Variational circuit feature maps",
    background: "<p>A variational circuit uses tunable gates as a feature transform before a classical optimizer reads a scalar loss.</p>",
    numbers: "<p>For the lesson rotation $R_y(\pi/3)|0\rangle$, $\cos(\pi/6)=0.866$ and $\sin(\pi/6)=0.500$, giving $P(0)=0.750$, $P(1)=0.250$, and $\langle Z\rangle=0.500$.</p>"
  },
  {
    title: "Interference demos in sensors and experiments",
    background: "<p>Interference demonstrations show why balanced measurement probabilities are not just classical ignorance: later gates can recombine branches.</p>",
    numbers: "<p>The lesson Hadamard state $H|0\rangle=\frac{1}{\sqrt2}[1,1]^T$ has amplitudes $0.707$ and $0.707$, so $P(0)=P(1)=0.500$ and $\langle Z\rangle=0.000$ before later interference.</p>"
  },
  {
    title: "Quantum-kernel classification",
    background: "<p>Quantum kernels compare prepared states and can be tested like any other similarity function before claiming a learning advantage.</p>",
    numbers: "<p>With $K(a,b)=\cos^2((a-b)/2)$, the lesson nearby pair gives $K(0.2,0.7)=0.939$, while the far pair gives $K(0.2,2.6)=0.131$.</p>"
  },
  {
    title: "Hybrid optimizer debugging",
    background: "<p>Hybrid quantum-classical training still exposes ordinary scalar predictions, losses, and gradients to an optimizer.</p>",
    numbers: "<p>For the lesson prediction $\hat y=\cos(1.2)=0.362$ with target $1$, $L=(0.362-1)^2=0.407$ and $dL/d\theta=2(\hat y-y)(-\sin\theta)=1.189$.</p>"
  }
];

(window.ALLML_CONTENT["27.2"] = window.ALLML_CONTENT["27.2"] || {}).applications = [
  {
    title: "Event-camera processing",
    background: "<p>Event cameras produce sparse time-stamped changes, matching the leaky integrate-and-fire idea of computing only when evidence arrives.</p>",
    numbers: "<p>With $x_1=1.2$, $\lambda=0.8$, and $\theta=1$, the lesson neuron has $\tilde v_1=1.200\ge1$, spikes, resets, and yields $[1,0,0,0,0]$.</p>"
  },
  {
    title: "Audio-click or robot-touch accumulation",
    background: "<p>Weak repeated contacts or clicks may be individually subthreshold but meaningful when accumulated over time.</p>",
    numbers: "<p>Five inputs of $0.3$ with $\lambda=0.8$ evolve as $0.300\to0.540\to0.732\to0.886\to1.008$, so the lesson spike occurs on the fifth tick.</p>"
  },
  {
    title: "Memory-timescale tuning",
    background: "<p>The leak parameter is a memory window: low leak forgets old evidence and high leak preserves it.</p>",
    numbers: "<p>For four inputs of $0.3$, the lesson low-leak case ends at $0.374$ for $\lambda=0.2$, while $\lambda=0.8$ ends at $0.886$, much closer to threshold.</p>"
  },
  {
    title: "Sparse neuromorphic hardware scheduling",
    background: "<p>Event-driven hardware is attractive when most inputs are inactive and dense multiply-add work can be skipped.</p>",
    numbers: "<p>If 12 of 1000 inputs spike, the active fraction is $12/1000=0.012$ and the skipped fraction is $1-0.012=0.988$, or 98.8% of dense input work.</p>"
  },
  {
    title: "Spiking dense-layer replacement",
    background: "<p>A spiking layer still uses a weighted sum, but transmits the result as thresholded events over time.</p>",
    numbers: "<p>For lesson presynaptic spikes $x=[1,0,1]$ and weights $w=[0.6,0.2,0.5]$, $x^T w=1\cdot0.6+0\cdot0.2+1\cdot0.5=1.100$, so a threshold-1 neuron spikes.</p>"
  }
];

(window.ALLML_CONTENT["27.3"] = window.ALLML_CONTENT["27.3"] || {}).applications = [
  {
    title: "Pretraining budget planning",
    background: "<p>Scaling laws help teams communicate how much validation loss may fall when compute rises, without treating scale as magic.</p>",
    numbers: "<p>Using the lesson $L(C)=1.2C^{-0.08}$, $L(10^{20})=0.030143$, $L(10^{22})=0.020854$, and $L(10^{24})=0.014427$.</p>"
  },
  {
    title: "Compute ROI communication",
    background: "<p>A fixed multiplicative compute increase has a predictable loss factor under the same scaling exponent.</p>",
    numbers: "<p>The lesson hundredfold increase gives $L(100C)/L(C)=100^{-0.08}=0.692$, so the relative loss reduction is $1-0.692=0.308$, or 30.8%.</p>"
  },
  {
    title: "Model and data sizing",
    background: "<p>Rough transformer compute estimates connect parameter count, token count, and training budget.</p>",
    numbers: "<p>For illustrative lesson values $N=70$B and $D=300$B, $C\approx6ND=6\cdot70{,}000{,}000{,}000\cdot300{,}000{,}000{,}000=1.26\cdot10^{23}$ FLOPs.</p>"
  },
  {
    title: "Multi-skill evaluation dashboards",
    background: "<p>Generalist evaluations must expose task mixtures because one strong average can hide a weak low-frequency skill.</p>",
    numbers: "<p>With lesson losses $0.20,0.40,0.60$ and weights $0.5,0.3,0.2$, the mixture loss is $0.5\cdot0.20+0.3\cdot0.40+0.2\cdot0.60=0.340$.</p>"
  },
  {
    title: "Tool-routing agents",
    background: "<p>Agents choose between direct answers, retrieval, and calculators using probabilities that also imply cost.</p>",
    numbers: "<p>Lesson logits $[2.0,1.0,-0.5]$ produce route probabilities $[0.690,0.254,0.057]$; with costs $[0.2,0.5,0.8]$, expected cost is $0.310$.</p>"
  }
];

(window.ALLML_CONTENT["27.4"] = window.ALLML_CONTENT["27.4"] || {}).applications = [
  {
    title: "Robot value learning",
    background: "<p>Temporal-difference learning updates a robot state's value from reward plus successor value, closing the prediction-action loop.</p>",
    numbers: "<p>With lesson $r=0$, $\gamma=0.9$, $V(s')=1.5$, $V(s)=1.0$, and $\eta=0.2$, the target is $1.350$, the error is $0.350$, and the updated value is $1.070$.</p>"
  },
  {
    title: "Contact exploration policies",
    background: "<p>Softmax action selection keeps tactile or contact exploration alive instead of forcing the current best action too early.</p>",
    numbers: "<p>For lesson $Q=[1.2,0.7,0.4]$ and $\beta=2$, exponentiating and normalizing gives action probabilities $[0.637,0.234,0.129]$.</p>"
  },
  {
    title: "Demonstration learning for manipulation",
    background: "<p>Behavior cloning is a common starting point for manipulation when trial-and-error reward discovery is unsafe or sparse.</p>",
    numbers: "<p>With lesson demonstrated action $a^\star=0.80$ and prediction $\hat a=0.62$, the cloning loss is $(0.62-0.80)^2=0.0324$.</p>"
  },
  {
    title: "Sim-to-real validation",
    background: "<p>Robotics models must be checked under hardware dynamics because simulator success can overstate deployment success.</p>",
    numbers: "<p>The lesson simulation result $92/100=0.920$ and hardware result $73/100=0.730$ imply a success drop of $0.920-0.730=0.190$.</p>"
  },
  {
    title: "Closed-loop correction in control",
    background: "<p>Feedback control compounds small corrections, reducing the remaining error after each sensed action.</p>",
    numbers: "<p>If each step removes 40% of a 10 cm error, the remaining error is $10\cdot0.6^3=2.160$ cm after three steps.</p>"
  }
];

(window.ALLML_CONTENT["27.5"] = window.ALLML_CONTENT["27.5"] || {}).applications = [
  {
    title: "Capability scorecards",
    background: "<p>AGI discussions need multi-coordinate scorecards because a single average can hide brittle weak links.</p>",
    numbers: "<p>For lesson $c=[0.9,0.8,0.2,0.4]$, the arithmetic average is $0.575$, the geometric mean is $0.490$, and the bottleneck score is $0.200$.</p>"
  },
  {
    title: "Robustness under deployment shift",
    background: "<p>Shifted evaluations ask how much apparent competence survives outside the original benchmark distribution.</p>",
    numbers: "<p>The lesson in-distribution score $0.82$ and shifted score $0.49$ give a gap of $0.82-0.49=0.330$ and retained fraction $0.49/0.82=0.598$.</p>"
  },
  {
    title: "Continual-learning regression reviews",
    background: "<p>Adding a new skill is not enough if older skills regress, so old-task deltas must be measured explicitly.</p>",
    numbers: "<p>Lesson old-task scores $[0.85,0.80]$ become $[0.55,0.57]$, so the old-task average change is $((-0.30)+(-0.23))/2=-0.265$.</p>"
  },
  {
    title: "Alignment gatekeeping",
    background: "<p>Safety, honesty, and helpfulness are not interchangeable when a deployment requires minimum floors.</p>",
    numbers: "<p>With lesson helpfulness $0.92$, honesty $0.88$, and safety $0.40$, the average is $0.733$ but the required-floor score is $\min(0.92,0.88,0.40)=0.400$.</p>"
  },
  {
    title: "Scale-versus-generality audits",
    background: "<p>Scaling a predictive loss is useful, but it does not certify shift robustness, continual learning, or alignment floors.</p>",
    numbers: "<p>The lesson factor $100^{-0.08}=0.692$ maps starting loss $0.300$ to $0.300\cdot0.692=0.208$, an absolute improvement of $0.092$.</p>"
  }
];

