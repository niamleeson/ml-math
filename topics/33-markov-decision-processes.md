# Markov Decision Processes & Q-learning

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 33/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 2.2 Markov decision processes

In this section, we assume that performing action $a$ from state $s$ can lead to several states $s'_1,s'_2,...$ in a probabilistic manner. In order to find our way between an initial state and an end state, our objective will be to find the maximum value policy by using Markov decision processes that help us cope with randomness and uncertainty.

#### 2.2.1 Notations

- **Definition** — The objective of a Markov decision process is to maximize rewards. It is defined with:

  - a starting state $s_{\text{start}}$
  - possible actions $\operatorname{Actions}(s)$ from state $s$
  - transition probabilities $T(s,a,s')$ from $s$ to $s'$ with action $a$
  - rewards $\operatorname{Reward}(s,a,s')$ from $s$ to $s'$ with action $a$
  - whether an end state was reached $\operatorname{IsEnd}(s)$
  - a discount factor $0\leq \gamma\leq 1$

*[Figure: MDP transition diagram. State $s$ takes action $a$ to a red decision/chance node $(s,a)$, then transitions to $s_1$, $s_2$, or $s_3$ along edges labeled $T(s,a,s_i):\operatorname{Reward}(s,a,s_i)$. The figure illustrates stochastic outcomes after choosing an action.]*

- **Transition probabilities** — The transition probability $T(s,a,s')$ specifies the probability of going to state $s'$ after action $a$ is taken in state $s$. Each $s'\mapsto T(s,a,s')$ is a probability distribution, which means that:

$$
\forall s,a,\quad \sum_{s'\in\operatorname{States}}T(s,a,s')=1
$$

- **Policy** — A policy $\pi$ is a function that maps each state $s$ to an action $a$, i.e.:

$$
\pi:s\mapsto a
$$

- **Utility** — The utility of a path $(s_0,...,s_k)$ is the discounted sum of the rewards on that path. In other words,

$$
u(s_0,...,s_k)=\sum_{i=1}^{k}\gamma^{i-1}r_i
$$

*[Figure: Reward chain for utility. States $s_0,s_1,s_2,s_3,s_4$ are connected in sequence with rewards $r_1$, $r_2$, $r_3$, and $r_4$ on the first four transitions, with discounted terms indicated as $r_1$, $\gamma r_2$, $\gamma^2 r_3$, and $\gamma^3 r_4$. The figure illustrates the case $k=4$.]*

_Remark: the figure above is an illustration of the case $k=4$._

- **Q-value** — The Q-value of a policy $\pi$ by taking action $a$ from state $s$, also noted $Q_{\pi}(s,a)$, is the expected utility of taking action $a$ from state $s$ and then following policy $\pi$. It is defined as follows:

$$
Q_{\pi}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\pi}(s')\right]
$$

- **Value of a policy** — The value of a policy $\pi$ from state $s$, also noted $V_{\pi}(s)$, is the expected utility by following policy $\pi$ from state $s$ over random paths. It is defined as follows:

$$
V_{\pi}(s)=Q_{\pi}(s,\pi(s))
$$

_Remark: $V_{\pi}(s)$ is equal to $0$ if $s$ is an end state._

#### 2.2.2 Applications

- **Policy evaluation** — Given a policy $\pi$, policy evaluation is an iterative algorithm that computes $V_{\pi}$. It is done as follows:

  - Initialization: for all states $s$, we have

$$
V_{\pi}^{(0)}(s)\leftarrow 0
$$

  - Iteration: for $t$ from $1$ to $T_{\text{PE}}$, we have

$$
\forall s,\quad V_{\pi}^{(t)}(s)\leftarrow Q_{\pi}^{(t-1)}(s,\pi(s))
$$

with

$$
Q_{\pi}^{(t-1)}(s,\pi(s))=\sum_{s'\in\operatorname{States}}T(s,\pi(s),s')\left[\operatorname{Reward}(s,\pi(s),s')+\gamma V_{\pi}^{(t-1)}(s')\right]
$$

_Remark: by noting $S$ the number of states, $A$ the number of actions per state, $S'$ the number of successors and $T$ the number of iterations, then the time complexity is of $O(T_{\text{PE}}SS')$._

- **Optimal Q-value** — The optimal Q-value $Q_{\text{opt}}(s,a)$ of state $s$ with action $a$ is defined to be the maximum Q-value attained by any policy starting. It is computed as follows:

$$
Q_{\text{opt}}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}(s')\right]
$$

- **Optimal value** — The optimal value $V_{\text{opt}}(s)$ of state $s$ is defined as being the maximum value attained by any policy. It is computed as follows:

$$
V_{\text{opt}}(s)=\max_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a)
$$

- **Optimal policy** — The optimal policy $\pi_{\text{opt}}$ is defined as being the policy that leads to the optimal values. It is defined by:

$$
\forall s,\quad \pi_{\text{opt}}(s)=\operatorname*{argmax}_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}(s,a)
$$

- **Value iteration** — Value iteration is an algorithm that finds the optimal value $V_{\text{opt}}$ as well as the optimal policy $\pi_{\text{opt}}$. It is done as follows:

  - Initialization: for all states $s$, we have

$$
V_{\text{opt}}^{(0)}(s)\leftarrow 0
$$

  - Iteration: for $t$ from $1$ to $T_{\text{VI}}$, we have

$$
\forall s,\quad V_{\text{opt}}^{(t)}(s)\leftarrow \max_{a\in\operatorname{Actions}(s)}Q_{\text{opt}}^{(t-1)}(s,a)
$$

with

$$
Q_{\text{opt}}^{(t-1)}(s,a)=\sum_{s'\in\operatorname{States}}T(s,a,s')\left[\operatorname{Reward}(s,a,s')+\gamma V_{\text{opt}}^{(t-1)}(s')\right]
$$

_Remark: if we have either $\gamma<1$ or the MDP graph being acyclic, then the value iteration algorithm is guaranteed to converge to the correct answer._

#### 2.2.3 When unknown transitions and rewards

Now, let's assume that the transition probabilities and the rewards are unknown.

- **Model-based Monte Carlo** — The model-based Monte Carlo method aims at estimating $T(s,a,s')$ and $\operatorname{Reward}(s,a,s')$ using Monte Carlo simulation with:

$$
\widehat{T}(s,a,s')=\frac{\#\text{ times }(s,a,s')\text{ occurs}}{\#\text{ times }(s,a)\text{ occurs}}
$$

and

$$
\widehat{\operatorname{Reward}}(s,a,s')=r\text{ in }(s,a,r,s')
$$

These estimations will be then used to deduce Q-values, including $Q_{\pi}$ and $Q_{\text{opt}}$.

_Remark: model-based Monte Carlo is said to be off-policy, because the estimation does not depend on the exact policy._

- **Model-free Monte Carlo** — The model-free Monte Carlo method aims at directly estimating $Q_{\pi}$, as follows:

$$
\widehat{Q}_{\pi}(s,a)=\text{average of }u_t\text{ where }s_{t-1}=s,\ a_t=a
$$

where $u_t$ denotes the utility starting at step $t$ of a given episode.

_Remark: model-free Monte Carlo is said to be on-policy, because the estimated value is dependent on the policy $\pi$ used to generate the data._

- **Equivalent formulation** — By introducing the constant $\eta=\frac{1}{1+\#\{\text{updates to }(s,a)\}}$ and for each $(s,a,u)$ of the training set, the update rule of model-free Monte Carlo has a convex combination formulation:

$$
\widehat{Q}_{\pi}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\pi}(s,a)+\eta u
$$

as well as a stochastic gradient formulation:

$$
\widehat{Q}_{\pi}(s,a)\leftarrow\widehat{Q}_{\pi}(s,a)-\eta\left(\widehat{Q}_{\pi}(s,a)-u\right)
$$

- **SARSA** — State-action-reward-state-action (SARSA) is a bootstrapping method estimating $Q_{\pi}$ by using both raw data and estimates as part of the update rule. For each $(s,a,r,s',a')$, we have:

$$
\widehat{Q}_{\pi}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\pi}(s,a)+\eta\left[r+\gamma\widehat{Q}_{\pi}(s',a')\right]
$$

_Remark: the SARSA estimate is updated on the fly as opposed to the model-free Monte Carlo one where the estimate can only be updated at the end of the episode._

- **Q-learning** — Q-learning is an off-policy algorithm that produces an estimate for $Q_{\text{opt}}$. On each $(s,a,r,s',a')$, we have:

$$
\widehat{Q}_{\text{opt}}(s,a)\leftarrow(1-\eta)\widehat{Q}_{\text{opt}}(s,a)+\eta\left[r+\gamma\max_{a'\in\operatorname{Actions}(s')}\widehat{Q}_{\text{opt}}(s',a')\right]
$$

- **Epsilon-greedy** — The epsilon-greedy policy is an algorithm that balances exploration with probability $\epsilon$ and exploitation with probability $1-\epsilon$. For a given state $s$, the policy $\pi_{\text{act}}$ is computed as follows:

$$
\pi_{\text{act}}(s)=
\begin{cases}
\operatorname*{argmax}_{a\in\operatorname{Actions}}\widehat{Q}_{\text{opt}}(s,a) & \text{with proba }1-\epsilon\\
\text{random from }\operatorname{Actions}(s) & \text{with proba }\epsilon
\end{cases}
$$
