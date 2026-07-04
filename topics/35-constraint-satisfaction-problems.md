# Constraint Satisfaction Problems & Factor Graphs

> **Source:** Artificial Intelligence — Stanford CS 221 &middot; Topic 35/38 &middot; [↑ Full reference](../ai-ml-cheatsheets.md)

## 3 Variables-based models

### 3.1 Constraint satisfaction problems

In this section, our objective is to find maximum weight assignments of variables-based models. One advantage compared to states-based models is that these algorithms are more convenient to encode problem-specific constraints.

#### 3.1.1 Factor graphs

- **Definition** — A factor graph, also referred to as a Markov random field, is a set of variables $X=(X_1,...,X_n)$ where $X_i \in \operatorname{Domain}_i$ and $m$ factors $f_1,...,f_m$ with each $f_j(X) \geq 0$.

*[Figure: Factor graph with three variable nodes $X_1$, $X_2$, and $X_3$, each labeled with its domain. Unary factor $f_1$ is attached to $X_1$, binary factor $f_2$ connects $X_1$ and $X_2$, binary factor $f_3$ connects $X_2$ and $X_3$, and unary factor $f_4$ is attached to $X_3$, illustrating how factors constrain subsets of variables.]*

- **Scope and arity** — The scope of a factor $f_j$ is the set of variables it depends on. The size of this set is called the arity.

_Remark: factors of arity 1 and 2 are called unary and binary respectively._

- **Assignment weight** — Each assignment $x=(x_1,...,x_n)$ yields a weight $\operatorname{Weight}(x)$ defined as being the product of all factors $f_j$ applied to that assignment. Its expression is given by:

$$
\operatorname{Weight}(x)=\prod_{j=1}^{m} f_j(x)
$$

- **Constraint satisfaction problem** — A constraint satisfaction problem (CSP) is a factor graph where all factors are binary; we call them to be constraints:

$$
\forall j \in [1,m],\quad f_j(x) \in \{0,1\}
$$

Here, the constraint $j$ with assignment $x$ is said to be satisfied if and only if $f_j(x)=1$.

- **Consistent assignment** — An assignment $x$ of a CSP is said to be consistent if and only if $\operatorname{Weight}(x)=1$, i.e. all constraints are satisfied.

*[Figure: CSP factor graph with Boolean domains $\{0,1\}$ for $X_1$, $X_2$, and $X_3$. Unary constraints $[x_1=1]$ and $[x_3>0]$ attach to $X_1$ and $X_3$, while binary constraints $x_1 \vee x_2$ and $x_2 \wedge x_3$ connect adjacent variables, showing how a CSP uses 0/1-valued factors.]*

#### 3.1.2 Dynamic ordering

- **Dependent factors** — The set of dependent factors of variable $X_i$ with partial assignment $x$ is called $D(x,X_i)$, and denotes the set of factors that link $X_i$ to already assigned variables.

- **Backtracking search** — Backtracking search is an algorithm used to find maximum weight assignments of a factor graph. At each step, it chooses an unassigned variable and explores its values by recursion. Dynamic ordering (i.e. choice of variables and values) and lookahead (i.e. early elimination of inconsistent options) can be used to explore the graph more efficiently, although the worst-case runtime stays exponential: $O(|\operatorname{Domain}|^n)$.

- **Forward checking** — It is a one-step lookahead heuristic that preemptively removes inconsistent values from the domains of neighboring variables. It has the following characteristics:

  - After assigning a variable $X_i$, it eliminates inconsistent values from the domains of all its neighbors.
  - If any of these domains becomes empty, we stop the local backtracking search.
  - If we un-assign a variable $X_i$, we have to restore the domain of its neighbors.

- **Most constrained variable** — It is a variable-level ordering heuristic that selects the next unassigned variable that has the fewest consistent values. This has the effect of making inconsistent assignments to fail earlier in the search, which enables more efficient pruning.

- **Least constrained value** — It is a value-level ordering heuristic that assigns the next value that yields the highest number of consistent values of neighboring variables. Intuitively, this procedure chooses first the values that are most likely to work.

_Remark: in practice, this heuristic is useful when all factors are constraints._

*[Figure: Map-coloring example on a map of France with neighboring regions colored in three possible colors and small color-domain boxes inside several regions. It illustrates the 3-color problem solved with backtracking search, most constrained variable exploration, least constrained value ordering, and forward checking at each step.]*

The example above is an illustration of the 3-color problem with backtracking search coupled with most constrained variable exploration and least constrained value heuristic, as well as forward checking at each step.

- **Arc consistency** — We say that arc consistency of variable $X_i$ with respect to $X_k$ is enforced when for each $x_i \in \operatorname{Domain}_i$:

  - unary factors of $X_i$ are non-zero,
  - there exists at least one $x_k \in \operatorname{Domain}_k$ such that any factor between $X_i$ and $X_k$ is non-zero.

- **AC-3** — The AC-3 algorithm is a multi-step lookahead heuristic that applies forward checking to all relevant variables. After a given assignment, it performs forward checking and then successively enforces arc consistency with respect to the neighbors of variables for which the domain change during the process.

_Remark: AC-3 can be implemented both iteratively and recursively._

#### 3.1.3 Approximate methods

- **Beam search** — Beam search is an approximate algorithm that extends partial assignments on $n$ variables of branching factor $b=|\operatorname{Domain}|$ by exploring the $K$ top paths at each step. The beam size $K \in \{1,...,b^n\}$ controls the tradeoff between efficiency and accuracy. This algorithm has a time complexity of $O(n \cdot Kb\log(Kb))$.

The example below illustrates a possible beam search of parameters $K=2$, $b=3$ and $n=5$.

*[Figure: Beam-search tree for variables $X_1$ through $X_5$ with branching factor 3. At each depth only the top $K=2$ partial assignments are highlighted in green while other candidate branches fade out, demonstrating pruning by beam size and the selected path values along edges labeled $x_1$ through $x_5$.]*

_Remark: $K=1$ corresponds to greedy search whereas $K \to +\infty$ is equivalent to BFS tree search._

- **Iterated conditional modes** — Iterated conditional modes (ICM) is an iterative approximate algorithm that modifies the assignment of a factor graph one variable at a time until convergence. At step $i$, we assign to $X_i$ the value $v$ that maximizes the product of all factors connected to that variable.

_Remark: ICM may get stuck in local minima._

- **Gibbs sampling** — Gibbs sampling is an iterative approximate method that modifies the assignment of a factor graph one variable at a time until convergence. At step $i$:

  - we assign to each element $u \in \operatorname{Domain}_i$ a weight $w(u)$ that is the product of all factors connected to that variable,
  - we sample $v$ from the probability distribution induced by $w$ and assign it to $X_i$.

_Remark: Gibbs sampling can be seen as the probabilistic counterpart of ICM. It has the advantage to be able to escape local minima in most cases._

#### 3.1.4 Factor graph transformations

- **Independence** — Let $A,B$ be a partitioning of the variables $X$. We say that $A$ and $B$ are independent if there are no edges between $A$ and $B$ and we write:

$$
A,B \text{ independent} \Longleftrightarrow A \perp B
$$

_Remark: independence is the key property that allows us to solve subproblems in parallel._

- **Conditional independence** — We say that $A$ and $B$ are conditionally independent given $C$ if conditioning on $C$ produces a graph in which $A$ and $B$ are independent. In this case, it is written:

$$
A \text{ and } B \text{ cond. indep. given } C \Longleftrightarrow A \perp B \mid C
$$

- **Conditioning** — Conditioning is a transformation aiming at making variables independent that breaks up a factor graph into smaller pieces that can be solved in parallel and can use backtracking. In order to condition on a variable $X_i=v$, we do as follows:

  - Consider all factors $f_1,...,f_k$ that depend on $X_i$
  - Remove $X_i$ and $f_1,...,f_k$
  - Add $g_j(x)$ for $j \in \{1,...,k\}$ defined as:

$$
g_j(x)=f_j(x \cup \{X_i:v\})
$$

- **Markov blanket** — Let $A \subseteq X$ be a subset of variables. We define $\operatorname{MarkovBlanket}(A)$ to be the neighbors of $A$ that are not in $A$.

- **Proposition** — Let $C=\operatorname{MarkovBlanket}(A)$ and $B=X\backslash(A\cup C)$. Then we have:

$$
A \perp B \mid C
$$

*[Figure: Factor graph with red nodes forming set $A$, gray nodes forming its Markov blanket $C$ around it, and blue nodes forming the remaining set $B$. A boxed statement $A \perp B \mid C$ shows that conditioning on the blanket separates $A$ from all non-neighboring variables.]*

- **Elimination** — Elimination is a factor graph transformation that removes $X_i$ from the graph and solves a small subproblem conditioned on its Markov blanket as follows:

  - Consider all factors $f_{i,1},...,f_{i,k}$ that depend on $X_i$
  - Remove $X_i$ and $f_{i,1},...,f_{i,k}$
  - Add $f_{\textrm{new},i}(x)$ defined as:

$$
f_{\textrm{new},i}(x)=\max_{x_i}\prod_{\ell=1}^{k} f_{i,\ell}(x)
$$

- **Treewidth** — The treewidth of a factor graph is the maximum arity of any factor created by variable elimination with the best variable ordering. In the maximum arity, variable eliminated with the best variable ordering:

$$
\operatorname{Treewidth}=\min_{\text{orderings } i\in\{1,...,n\}}\max_j \operatorname{arity}(f_{\textrm{new},j})
$$

The example below illustrates the case of a factor graph of treewidth 3.

*[Figure: Grid-shaped factor graph with variables $X_1$ through $X_{12}$ arranged in three rows and four columns. Square factors connect horizontally and vertically adjacent variables, illustrating a graph whose optimal elimination ordering has treewidth 3.]*

_Remark: finding the best variable ordering is a NP-hard problem._
