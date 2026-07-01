/* All ML — authored content for Part 11: Reinforcement Learning (11.1–11.35).
   Generated from verified Python arithmetic; LaTeX via String.raw; no prose italics. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 11.1 RL framing (agent, environment, reward) ---------------- */
window.ALLML_CONTENT["11.1"] = {
  tagline: "The agent-environment loop turns delayed consequences into a discounted return.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.1-rl-framing.ipynb",
  context: String.raw`
    <p>RL framing (agent, environment, reward) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (10.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.2, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in RL framing (agent, environment, reward) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Agent, environment, action, reward, and return</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.2 Markov Decision Processes ---------------- */
window.ALLML_CONTENT["11.2"] = {
  tagline: "An MDP is the smallest bookkeeping system that makes sequential choice computable.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.2-mdp.ipynb",
  context: String.raw`
    <p>Markov Decision Processes belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.3, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Markov Decision Processes is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>States, actions, transition probabilities, rewards, and discount</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.3 Bellman equations ---------------- */
window.ALLML_CONTENT["11.3"] = {
  tagline: "Bellman equations make long horizons local by asking one step plus what remains.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.3-bellman-equations.ipynb",
  context: String.raw`
    <p>Bellman equations belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.4, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Bellman equations is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>One-step reward plus discounted future value</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.4 Dynamic programming (policy & value iteration) ---------------- */
window.ALLML_CONTENT["11.4"] = {
  tagline: "Dynamic programming plans by sweeping exact backups through a tiny known world.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.4-dynamic-programming.ipynb",
  context: String.raw`
    <p>Dynamic programming (policy & value iteration) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.5, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Dynamic programming (policy & value iteration) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Repeated Bellman backups with a known model</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.5 Monte Carlo methods ---------------- */
window.ALLML_CONTENT["11.5"] = {
  tagline: "Monte Carlo waits for an episode to finish, then lets the realized return teach.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.5-monte-carlo-methods.ipynb",
  context: String.raw`
    <p>Monte Carlo methods belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.6, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Monte Carlo methods is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Learning values from complete sampled returns</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.6 Temporal-Difference learning ---------------- */
window.ALLML_CONTENT["11.6"] = {
  tagline: "TD learning updates before the episode ends by trusting a one-step target.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.6-temporal-difference-learning.ipynb",
  context: String.raw`
    <p>Temporal-Difference learning belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.7, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Temporal-Difference learning is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Bootstrapping from reward plus the next estimate</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.7 Eligibility traces & TD(λ) ---------------- */
window.ALLML_CONTENT["11.7"] = {
  tagline: "Eligibility traces remember recent states so TD errors flow backward smoothly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.7-eligibility-traces-td-lambda.ipynb",
  context: String.raw`
    <p>Eligibility traces & TD(λ) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.8, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Eligibility traces & TD(λ) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Credit assignment with a decaying trace</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.8 SARSA (on-policy) ---------------- */
window.ALLML_CONTENT["11.8"] = {
  tagline: "SARSA learns the value of the exploratory behavior policy, not an imagined greedy one.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.8-sarsa-on-policy.ipynb",
  context: String.raw`
    <p>SARSA (on-policy) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.9, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in SARSA (on-policy) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Updating action values from the action actually taken next</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.9 Q-learning (off-policy) ---------------- */
window.ALLML_CONTENT["11.9"] = {
  tagline: "Q-learning separates how we explore from the greedy policy we want to learn.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.9-q-learning-off-policy.ipynb",
  context: String.raw`
    <p>Q-learning (off-policy) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.10, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Q-learning (off-policy) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Updating toward the best next action regardless of behavior</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.10 Function approximation in RL ---------------- */
window.ALLML_CONTENT["11.10"] = {
  tagline: "Function approximation shares evidence across states that have similar features.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.10-function-approximation.ipynb",
  context: String.raw`
    <p>Function approximation in RL belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.11, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Function approximation in RL is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Approximating values with features instead of tables</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.11 Deep Q-Networks ---------------- */
window.ALLML_CONTENT["11.11"] = {
  tagline: "DQN makes Q-learning scalable by combining targets, replay, and a network.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.11-deep-q-networks.ipynb",
  context: String.raw`
    <p>Deep Q-Networks belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.12, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Deep Q-Networks is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>A neural approximator trained on Bellman targets</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.12 DQN variants (Double, Dueling, PER, Rainbow) ---------------- */
window.ALLML_CONTENT["11.12"] = {
  tagline: "DQN variants each repair a different failure mode in bootstrapped value learning.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.12-dqn-variants.ipynb",
  context: String.raw`
    <p>DQN variants (Double, Dueling, PER, Rainbow) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.13, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in DQN variants (Double, Dueling, PER, Rainbow) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Stabilizing or enriching the DQN target</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.13 Distributional RL (C51, QR-DQN) ---------------- */
window.ALLML_CONTENT["11.13"] = {
  tagline: "Distributional RL keeps the spread of possible returns, not just their average.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.13-distributional-rl.ipynb",
  context: String.raw`
    <p>Distributional RL (C51, QR-DQN) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.14, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Distributional RL (C51, QR-DQN) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Learning a return distribution instead of only its mean</b> is summarized by:</p>
    <div class="formula-box">$$Z(s,a)\stackrel{D}{=}R(s,a)+\gamma Z(s',a')$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.14 Policy gradients (REINFORCE) ---------------- */
window.ALLML_CONTENT["11.14"] = {
  tagline: "Policy gradients optimize the policy parameters that choose actions.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.14-policy-gradients-reinforce.ipynb",
  context: String.raw`
    <p>Policy gradients (REINFORCE) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.15, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Policy gradients (REINFORCE) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Directly increasing log-probability of rewarded actions</b> is summarized by:</p>
    <div class="formula-box">$$\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,A_t]$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.15 Actor–Critic (A2C/A3C) ---------------- */
window.ALLML_CONTENT["11.15"] = {
  tagline: "Actor-critic lowers policy-gradient variance by learning a baseline beside the policy.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.15-actor-critic.ipynb",
  context: String.raw`
    <p>Actor–Critic (A2C/A3C) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.16, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Actor–Critic (A2C/A3C) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>A policy actor guided by a value critic</b> is summarized by:</p>
    <div class="formula-box">$$\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,A_t]$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.16 Generalized Advantage Estimation ---------------- */
window.ALLML_CONTENT["11.16"] = {
  tagline: "GAE tunes the bias-variance tradeoff in advantage estimates with lambda.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.16-generalized-advantage-estimation.ipynb",
  context: String.raw`
    <p>Generalized Advantage Estimation belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.17, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Generalized Advantage Estimation is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Exponentially weighted TD residuals</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.17 TRPO & PPO ---------------- */
window.ALLML_CONTENT["11.17"] = {
  tagline: "PPO and TRPO keep policy updates useful by refusing destructive probability jumps.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.17-trpo-ppo.ipynb",
  context: String.raw`
    <p>TRPO & PPO belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.18, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in TRPO & PPO is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Constrained or clipped policy updates</b> is summarized by:</p>
    <div class="formula-box">$$\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,A_t]$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.18 DDPG & TD3 ---------------- */
window.ALLML_CONTENT["11.18"] = {
  tagline: "DDPG and TD3 learn smooth actions by differentiating through a critic.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.18-ddpg-td3.ipynb",
  context: String.raw`
    <p>DDPG & TD3 belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.19, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in DDPG & TD3 is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Deterministic continuous-action control</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.19 Soft Actor-Critic ---------------- */
window.ALLML_CONTENT["11.19"] = {
  tagline: "SAC treats randomness as a feature of the objective, not merely training noise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.19-soft-actor-critic.ipynb",
  context: String.raw`
    <p>Soft Actor-Critic belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.20, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Soft Actor-Critic is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Reward plus entropy for robust exploration</b> is summarized by:</p>
    <div class="formula-box">$$\nabla_\theta J(\theta)=\mathbb{E}[\nabla_\theta\log\pi_\theta(a_t\mid s_t)\,A_t]$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.20 Model-based RL & world models ---------------- */
window.ALLML_CONTENT["11.20"] = {
  tagline: "Model-based RL buys sample efficiency by imagining consequences before acting.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.20-model-based-rl-world-models.ipynb",
  context: String.raw`
    <p>Model-based RL & world models belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.21, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Model-based RL & world models is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Learning or using a transition model to plan</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.21 Exploration (ε-greedy, UCB, intrinsic motivation) ---------------- */
window.ALLML_CONTENT["11.21"] = {
  tagline: "Exploration methods spend some reward to buy knowledge that can pay back later.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.21-exploration.ipynb",
  context: String.raw`
    <p>Exploration (ε-greedy, UCB, intrinsic motivation) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.22, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Exploration (ε-greedy, UCB, intrinsic motivation) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Balancing exploitation with information gathering</b> is summarized by:</p>
    <div class="formula-box">$$a_t=\arg\max_a\left(\hat\mu_a+c\sqrt{\frac{2\ln t}{N_a}}\right)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.22 Multi-armed & contextual bandits ---------------- */
window.ALLML_CONTENT["11.22"] = {
  tagline: "Bandits are RL without state transitions: learn which action pays now.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.22-bandits.ipynb",
  context: String.raw`
    <p>Multi-armed & contextual bandits belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.23, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Multi-armed & contextual bandits is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>One-step decisions with uncertain arms or contexts</b> is summarized by:</p>
    <div class="formula-box">$$a_t=\arg\max_a\left(\hat\mu_a+c\sqrt{\frac{2\ln t}{N_a}}\right)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.23 Hierarchical RL & options ---------------- */
window.ALLML_CONTENT["11.23"] = {
  tagline: "Options compress long action chains into reusable skills.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.23-hierarchical-rl-options.ipynb",
  context: String.raw`
    <p>Hierarchical RL & options belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.24, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Hierarchical RL & options is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Temporally extended actions with their own stopping rules</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.24 POMDPs ---------------- */
window.ALLML_CONTENT["11.24"] = {
  tagline: "A POMDP replaces hidden state with a belief distribution you can update.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.24-pomdps.ipynb",
  context: String.raw`
    <p>POMDPs belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.25, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in POMDPs is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Belief states under partial observability</b> is summarized by:</p>
    <div class="formula-box">$$b'(s')=\eta\,O(o\mid s',a)\sum_s P(s'\mid s,a)b(s)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.25 Reward shaping ---------------- */
window.ALLML_CONTENT["11.25"] = {
  tagline: "Reward shaping teaches faster by rewarding progress while preserving the best policy.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.25-reward-shaping.ipynb",
  context: String.raw`
    <p>Reward shaping belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.26, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Reward shaping is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Adding potential-based guidance without changing the optimum</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.26 Goal-conditioned RL & hindsight replay ---------------- */
window.ALLML_CONTENT["11.26"] = {
  tagline: "Goal-conditioned RL turns failed attempts into useful data for goals they did reach.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.26-goal-conditioned-rl-hindsight.ipynb",
  context: String.raw`
    <p>Goal-conditioned RL & hindsight replay belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.27, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Goal-conditioned RL & hindsight replay is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Policies and replay indexed by goals</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.27 Multi-agent RL ---------------- */
window.ALLML_CONTENT["11.27"] = {
  tagline: "Multi-agent RL studies policies whose payoffs depend on other adaptive policies.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.27-multi-agent-rl.ipynb",
  context: String.raw`
    <p>Multi-agent RL belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.28, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Multi-agent RL is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Learning when other learners change the environment</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.28 Imitation & inverse RL ---------------- */
window.ALLML_CONTENT["11.28"] = {
  tagline: "Imitation asks what expert actions reveal about behavior and intent.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.28-imitation-inverse-rl.ipynb",
  context: String.raw`
    <p>Imitation & inverse RL belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.29, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Imitation & inverse RL is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Learning from demonstrations or inferred rewards</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.29 Offline RL ---------------- */
window.ALLML_CONTENT["11.29"] = {
  tagline: "Offline RL must improve without querying actions the data barely covers.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.29-offline-rl.ipynb",
  context: String.raw`
    <p>Offline RL belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.30, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Offline RL is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Learning from a fixed dataset without new exploration</b> is summarized by:</p>
    <div class="formula-box">$$\max_\pi J(\pi)\quad \text{subject to}\quad C(\pi)\le d$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.30 Meta-RL ---------------- */
window.ALLML_CONTENT["11.30"] = {
  tagline: "Meta-RL trains an agent to adapt quickly when the task changes.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.30-meta-rl.ipynb",
  context: String.raw`
    <p>Meta-RL belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.31, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Meta-RL is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Learning an update strategy across related tasks</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.31 Safe & constrained RL ---------------- */
window.ALLML_CONTENT["11.31"] = {
  tagline: "Constrained RL makes safety a mathematical budget, not an afterthought.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.31-safe-constrained-rl.ipynb",
  context: String.raw`
    <p>Safe & constrained RL belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.32, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Safe & constrained RL is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Optimizing reward subject to cost limits</b> is summarized by:</p>
    <div class="formula-box">$$\max_\pi J(\pi)\quad \text{subject to}\quad C(\pi)\le d$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.32 Sim-to-real transfer ---------------- */
window.ALLML_CONTENT["11.32"] = {
  tagline: "Sim-to-real succeeds when the learned policy is robust to the simulator being wrong.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.32-sim-to-real-transfer.ipynb",
  context: String.raw`
    <p>Sim-to-real transfer belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.33, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Sim-to-real transfer is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Training in simulation while surviving real mismatch</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.33 Decision transformers (RL as sequence modeling) ---------------- */
window.ALLML_CONTENT["11.33"] = {
  tagline: "Decision transformers recast control as predicting the next action in a trajectory.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.33-decision-transformers.ipynb",
  context: String.raw`
    <p>Decision transformers (RL as sequence modeling) belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.34, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Decision transformers (RL as sequence modeling) is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Conditioning actions on desired return and history</b> is summarized by:</p>
    <div class="formula-box">$$p(a_t\mid R_t,s_1,a_1,\ldots,s_t)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.34 Self-play & population-based training ---------------- */
window.ALLML_CONTENT["11.34"] = {
  tagline: "Self-play creates its own curriculum by making yesterday’s policy today’s opponent.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.34-self-play-population.ipynb",
  context: String.raw`
    <p>Self-play & population-based training belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially 11.35, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in Self-play & population-based training is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Improving by training against evolving opponents</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};

/* ---------------- 11.35 AlphaGo / AlphaZero / MuZero ---------------- */
window.ALLML_CONTENT["11.35"] = {
  tagline: "Alpha-style systems combine learning with lookahead so policies and search improve together.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/11.35-alphago-alphazero-muzero.ipynb",
  context: String.raw`
    <p>AlphaGo / AlphaZero / MuZero belongs in Part 11 because reinforcement learning is the part of machine learning where a prediction changes what data arrives next.</p>
    <ul>
      <li><b>Probability</b> supplies transition probabilities and expectations; those mechanisms become the averages inside the return and the Bellman backup here.</li>
      <li><b>Optimization</b> supplies iterative improvement; the update rule in this lesson is a controlled way to move a value, policy, or model estimate.</li>
      <li><b>Earlier RL framing</b> (11.1) supplies the agent, state, action, reward, and discount vocabulary that this lesson refines.</li>
    </ul>
    <p>Where it leads: the mechanism here feeds later RL lessons, especially future capstone work, because every advanced method is still deciding how to estimate consequence, choose actions, and control bootstrapping error.</p>`,
  intuition: String.raw`
    <p>The concrete problem is that an agent must choose now while the useful evidence arrives later. A supervised learner sees the right answer beside each input; an RL learner sees a reward stream whose meaning depends on the future states its own actions created.</p>
    <p>The naive approach is to chase immediate reward. That fails whenever a small sacrifice now unlocks a larger payoff later, or whenever an exploratory action teaches something a greedy action would hide. The mental model is a ledger: each action writes a short-term entry and also changes which future pages can be written.</p>
    <p>The design decision people gloss over in AlphaGo / AlphaZero / MuZero is the choice of <b>target</b>. We must decide whether to wait for complete returns, bootstrap from current estimates, trust a model, or constrain a policy update. That choice controls bias, variance, and safety more than the algebraic surface of the algorithm.</p>`,
  mathematics: String.raw`
    <p>The core object for <b>Search guided by learned value, policy, and dynamics</b> is summarized by:</p>
    <div class="formula-box">$$V^\pi(s)=\sum_a\pi(a\mid s)\sum_{s'}P(s'\mid s,a)\bigl(R(s,a,s')+\gamma V^\pi(s')\bigr)$$</div>
    <p>Here $s$ is a state, $a$ is an action, $\pi(a\mid s)$ is the policy probability, $P(s'\mid s,a)$ is a transition probability, $R$ is reward, $\gamma$ is the discount with $0\le\gamma\lt 1$, $V$ is a state value, $Q$ is an action value, and $A$ is an advantage. In a table with $|S|$ states and $|A|$ actions, $V$ has shape $|S|$ and $Q$ has shape $|S|\times |A|$.</p>
    <p><b>Discounted consequence.</b> With rewards $[1,0,2]$ and $\gamma=0.9$, the three-step return is:</p>
    <ol class="work">
      <li>$G=1+0.9\cdot0+0.9^2\cdot2=1+0+1.620=2.620$</li>
    </ol>
    <p>The delayed reward still matters, but discounting makes the reward two steps away count as $1.620$ instead of $2.000$, which is why RL can prefer durable plans without pretending the future is free.</p>
    <p><b>One-step target.</b> If the observed reward is $1$, the next estimate is $0.8$, and $\gamma=0.9$, the bootstrap target is:</p>
    <ol class="work">
      <li>$y=r+\gamma V(s')=1+0.9\cdot0.8=1.720$</li>
      <li>with $Q_{old}=0.4$ and $\alpha=0.5$: $Q_{new}=0.4+0.5(1.720-0.4)=1.060$</li>
    </ol>
    <p>The update moves halfway toward the target, so the estimate improves without letting one noisy transition overwrite everything the table already knew.</p>
    <p><b>Policy weighting.</b> For logits $[1,0]$, softmax action probabilities are:</p>
    <ol class="work">
      <li>$e^1=2.718$, $e^0=1.000$, sum $=3.718$</li>
      <li>$\pi(a_0)=2.718/3.718=0.731$ and $\pi(a_1)=1.000/3.718=0.269$</li>
      <li>if rewards are $[2,0]$, expected reward $=0.731\cdot2+0.269\cdot0=1.462$</li>
    </ol>
    <p>This is the bridge from values to policies: changing a logit changes probability mass, and probability mass changes expected consequence.</p>
    <p><b>Exploration pressure.</b> A UCB-style bonus for mean $0.55$, time $t=20$, count $N=5$, and $c=1$ is:</p>
    <ol class="work">
      <li>$0.55+\sqrt{2\ln(20)/5}=0.55+1.095=1.645$</li>
    </ol>
    <p>The index is larger than the observed mean because uncertainty is valuable; the algorithm is paying a temporary bonus to learn whether the arm is better than it currently looks.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Confusing reward with return.</b> The term $G$ includes discounted future rewards; optimizing only immediate $r$ changes the objective.</li>
      <li><b>Bootstrapping from a moving target.</b> The target $r+\gamma V(s')$ uses the learner's own estimate, so large steps can amplify error instead of correcting it.</li>
      <li><b>Ignoring policy support.</b> Off-policy or offline estimates become unreliable when the action being evaluated was rarely or never sampled.</li>
      <li><b>Letting notation hide shapes.</b> A scalar value update and a $|S|\times |A|$ action-value update are different objects; mixing them silently corrupts the backup.</li>
    </ul>`
};
