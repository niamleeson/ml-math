# Game Playing: Minimax & Games

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 34/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

### 2.3 Game playing

In games (e.g. chess, backgammon, Go), other agents are present and need to be taken into account when constructing our policy.

- **Game tree** — A game tree is a tree that describes the possibilities of a game. In particular, each node is a decision point for a player and each root-to-leaf path is a possible outcome of the game.

- **Two-player zero-sum game** — It is a game where each state is fully observed and such that players take turns. It is defined with:

  - a starting state $s_{\text{start}}$
  - possible actions $\operatorname{Actions}(s)$ from state $s$
  - successors $\operatorname{Succ}(s,a)$ from states $s$ with actions $a$
  - whether an end state was reached $\operatorname{IsEnd}(s)$
  - the agent's utility $\operatorname{Utility}(s)$ at end state $s$
  - the player $\operatorname{Player}(s)$ who controls state $s$

_Remark: we will assume that the utility of the agent has the opposite sign of the one of the opponent._

- **Types of policies** — There are two types of policies:

  - Deterministic policies, noted $\pi_p(s)$, which are actions that player $p$ takes in state $s$.
  - Stochastic policies, noted $\pi_p(s,a)\in[0,1]$, which are probabilities that player $p$ takes action $a$ in state $s$.

- **Expectimax** — For a given state $s$, the expectimax value $V_{\text{expectimax}}(s)$ is the maximum expected utility of any agent policy when playing with respect to a fixed and known opponent policy $\pi_{\text{opp}}$. It is computed as follows:

$$
V_{\text{expectimax}}(s)=
\begin{cases}
\operatorname{Utility}(s) & \operatorname{IsEnd}(s)\\
\max_{a\in\operatorname{Actions}(s)}V_{\text{expectimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{agent}\\
\sum_{a\in\operatorname{Actions}(s)}\pi_{\text{opp}}(s,a)V_{\text{expectimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{opp}
\end{cases}
$$

_Remark: expectimax is the analog of value iteration for MDPs._

*[Figure: Expectimax game tree with alternating triangle and circle nodes. The red root triangle has value 5; blue chance/opponent circles have values 4 and 5; lower red agent triangles have values 3, 5, 1, and 9; leaves are utilities 1, 3, 5, -1, -2, 1, 3, and 9. Red highlighted branches indicate selected maximizing choices, while blue edges indicate expected/opponent branches. The purpose is to show expectimax propagation of utilities through a game tree.]*

- **Minimax** — The goal of minimax policies is to find an optimal policy against an adversary by assuming the worst case, i.e. that the opponent is doing everything to minimize the agent's utility. It is done as follows:

$$
V_{\text{minimax}}(s)=
\begin{cases}
\operatorname{Utility}(s) & \operatorname{IsEnd}(s)\\
\max_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{agent}\\
\min_{a\in\operatorname{Actions}(s)}V_{\text{minimax}}(\operatorname{Succ}(s,a)) & \operatorname{Player}(s)=\text{opp}
\end{cases}
$$

_Remark: we can extract $\pi_{\max}$ and $\pi_{\min}$ from the minimax value $V_{\text{minimax}}$._

*[Figure: Minimax game tree. The root red maximizing triangle has value 3 and selects the left child; blue minimizing triangles have values 3 and 1; red maximizing nodes below have values 3, 5, 1, and 9; leaves are utilities 1, 3, 5, -1, -2, 1, 3, and 9. Red edges show max choices and blue/black edges show min choices, illustrating bottom-up minimax value propagation.]*

- **Minimax properties** — By noting $V$ the value function, there are 3 properties around minimax to have in mind:

  - Property 1: if the agent were to change its policy to any $\pi_{\text{agent}}$, then the agent would be no better off.

$$
\forall \pi_{\text{agent}},\quad V(\pi_{\max},\pi_{\min})\geq V(\pi_{\text{agent}},\pi_{\min})
$$

  - Property 2: if the opponent changes its policy from $\pi_{\min}$ to $\pi_{\text{opp}}$, then he will be no better off.

$$
\forall \pi_{\text{opp}},\quad V(\pi_{\max},\pi_{\min})\leq V(\pi_{\max},\pi_{\text{opp}})
$$

  - Property 3: if the opponent is known to be not playing the adversarial policy, then the minimax policy might not be optimal for the agent.

$$
\forall \pi,\quad V(\pi_{\max},\pi)\leq V(\pi_{\text{expectimax}},\pi)
$$

In the end, we have the following relationship:

$$
V(\pi_{\text{expectimax}},\pi_{\min})\leq V(\pi_{\max},\pi_{\min})\leq V(\pi_{\max},\pi)\leq V(\pi_{\text{expectimax}},\pi)
$$

#### 2.3.1 Speeding up minimax

- **Evaluation function** — An evaluation function is a domain-specific and approximate estimate of the value $V_{\text{minimax}}(s)$. It is noted $\operatorname{Eval}(s)$.

_Remark: $\operatorname{FutureCost}(s)$ is an analogy for search problems._

- **Alpha-beta pruning** — Alpha-beta pruning is a domain-general exact method optimizing the minimax algorithm by avoiding the unnecessary exploration of parts of the game tree. To do so, each player keeps track of the best value they can hope for (stored in $\alpha$ for the maximizing player and in $\beta$ for the minimizing player). At a given step, the condition $\beta<\alpha$ means that the optimal path is not going to be in the current branch as the earlier player had a better option at their disposal.

*[Figure: Alpha-beta pruning example. A minimax tree has root value 3; the left subtree establishes a value of 3, and in the right subtree a branch is faded/pruned once the minimizing node value is $\leq 1$ and cannot improve the maximizing player's existing $\alpha=3$. Red highlighted edges show explored optimal choices; faded nodes show skipped exploration.]*

- **TD learning** — Temporal difference (TD) learning is used when we don't know the transitions/rewards. The value is based on exploration policy. To be able to use it, we need to know rules of the game $\operatorname{Succ}(s,a)$. For each $(s,a,r,s')$, the update is done as follows:

$$
w\leftarrow w-\eta\left[V(s,w)-\left(r+\gamma V(s',w)\right)\right]\nabla_wV(s,w)
$$

#### 2.3.2 Simultaneous games

This is the contrary of turn-based games, where there is no ordering on the player's moves.

- **Single-move simultaneous game** — Let there be two players $A$ and $B$, with given possible actions. We note $V(a,b)$ to be $A$'s utility if $A$ chooses action $a$, $B$ chooses action $b$. $V$ is called the payoff matrix.

- **Strategies** — There are two main types of strategies:

  - A pure strategy is a single action:

$$
a\in\operatorname{Actions}
$$

  - A mixed strategy is a probability distribution over actions:

$$
\forall a\in\operatorname{Actions},\quad 0\leq \pi(a)\leq 1
$$

- **Game evaluation** — The value of the game $V(\pi_A,\pi_B)$ when player $A$ follows $\pi_A$ and player $B$ follows $\pi_B$ is such that:

$$
V(\pi_A,\pi_B)=\sum_{a,b}\pi_A(a)\pi_B(b)V(a,b)
$$

- **Minimax theorem** — By noting $\pi_A,\pi_B$ ranging over mixed strategies, for every simultaneous two-player zero-sum game with a finite number of actions, we have:

$$
\max_{\pi_A}\min_{\pi_B}V(\pi_A,\pi_B)=\min_{\pi_B}\max_{\pi_A}V(\pi_A,\pi_B)
$$


#### 2.3.3 Non-zero-sum games

- **Payoff matrix** — We define $V_p(\pi_A,\pi_B)$ to be the utility for player $p$.

- **Nash equilibrium** — A Nash equilibrium is $(\pi_A^*,\pi_B^*)$ such that no player has an incentive to change its strategy. We have:

$$
\forall \pi_A,\ V_A(\pi_A^*,\pi_B^*) \geq V_A(\pi_A,\pi_B^*)
\quad \text{and} \quad
\forall \pi_B,\ V_B(\pi_A^*,\pi_B^*) \geq V_B(\pi_A^*,\pi_B)
$$

_Remark: in any finite-player game with finite number of actions, there exists at least one Nash equilibrium._
