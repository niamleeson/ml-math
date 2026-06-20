(function(){ Object.assign(window.PRACTICE, {

  "ai-linear-predictors": [
    { q:`<p>Features $\\phi(x)=[1,2]$ and weights $w=[3,1]$. What is the score $s = w\\cdot\\phi(x)$?</p>`,
      steps:[
        {do:`Multiply matching entries: $3\\times1 = 3$ and $1\\times2 = 2$.`, why:`The dot product pairs each weight with its feature.`},
        {do:`Add them: $3 + 2 = 5$.`, why:`The score sums the weighted evidence.`}
      ],
      answer:`$s = 5$` },

    { q:`<p>A score is $s = 4$. What is the prediction $f_w(x) = \\text{sign}(s)$?</p>`,
      steps:[
        {do:`Check the sign of $4$. It is positive.`, why:`$\\text{sign}$ gives $+1$ when $s&gt;0$.`},
        {do:`So $f_w(x) = +1$.`, why:`A positive score means the "yes" class.`}
      ],
      answer:`$f_w(x) = +1$` },

    { q:`<p>Features $\\phi(x)=[2,1]$, weights $w=[1,-3]$. Compute the score and the prediction.</p>`,
      steps:[
        {do:`Score: $1\\times2 + (-3)\\times1 = 2 - 3 = -1$.`, why:`Dot product of weights and features.`},
        {do:`Sign of $-1$ is negative, so $f_w(x) = -1$.`, why:`A negative score means the "no" class.`}
      ],
      answer:`$s = -1,\\ f_w(x) = -1$` },

    { q:`<p>Score $s = 3$, true label $y = +1$. What is the margin $m = s\\cdot y$?</p>`,
      steps:[
        {do:`Multiply: $m = 3\\times(+1) = 3$.`, why:`The margin is score times true label.`},
        {do:`$m$ is positive, so the prediction is correct.`, why:`A positive margin means score and label agree in sign.`}
      ],
      answer:`$m = 3$` },

    { q:`<p>Score $s = 2$ but the true label is $y = -1$. What is the margin, and did we get it right?</p>`,
      steps:[
        {do:`Margin: $m = 2\\times(-1) = -2$.`, why:`Margin is score times true label.`},
        {do:`$m$ is negative, so the prediction is wrong.`, why:`A negative margin means score and label disagree.`}
      ],
      answer:`$m = -2$, wrong` },

    { q:`<p>Three features. $\\phi(x)=[1,0,2]$ and $w=[2,5,1]$. Compute the score.</p>`,
      steps:[
        {do:`Pair them up: $2\\times1 = 2$, $5\\times0 = 0$, $1\\times2 = 2$.`, why:`Each weight multiplies its matching feature.`},
        {do:`Sum: $2 + 0 + 2 = 4$.`, why:`The score adds all the weighted features.`}
      ],
      answer:`$s = 4$` },

    { q:`<p>Spam filter. $\\phi(x)=[3,1]$ (count of "free", count of links), $w=[1.5,0.5]$. Score, and is it spam ($+1$)?</p>`,
      steps:[
        {do:`Score: $1.5\\times3 + 0.5\\times1 = 4.5 + 0.5 = 5$.`, why:`Dot product of weights and features.`},
        {do:`Sign of $5$ is positive, so $f_w(x) = +1$: spam.`, why:`A positive score predicts the "yes" (spam) class.`}
      ],
      answer:`$s = 5$, spam` },

    { q:`<p>Features $\\phi(x)=[2,2]$, weights $w=[-1,0.5]$, true label $y = +1$. Find the score, prediction, and margin.</p>`,
      steps:[
        {do:`Score: $-1\\times2 + 0.5\\times2 = -2 + 1 = -1$.`, why:`Dot product gives the score.`},
        {do:`Sign of $-1$ is negative, so $f_w(x) = -1$.`, why:`A negative score predicts the "no" class.`},
        {do:`Margin: $m = -1\\times(+1) = -1$.`, why:`Score times true label; negative means a mistake.`}
      ],
      answer:`$s=-1,\\ f_w=-1,\\ m=-1$` },

    { q:`<p>With $\\phi(x)=[1,1]$, the weights are $w=[2,b]$. For what $b$ is the score exactly $0$?</p>`,
      steps:[
        {do:`Score: $2\\times1 + b\\times1 = 2 + b$.`, why:`Dot product of weights and features.`},
        {do:`Set $2 + b = 0$, so $b = -2$.`, why:`We want the score to equal zero.`}
      ],
      answer:`$b = -2$` },

    { q:`<p>Score $s=0.5$, label $y=+1$. The margin is small. Why is a bigger margin better even when the prediction is already correct?</p>`,
      steps:[
        {do:`Margin: $m = 0.5\\times(+1) = 0.5$. Correct, but small.`, why:`The sign is right, so the prediction matches the label.`},
        {do:`A bigger margin means a more confident, more robust answer.`, why:`A tiny margin can flip to wrong with a small change in the input.`}
      ],
      answer:`$m = 0.5$, correct but low confidence` }
  ],

  "ai-loss-minimization": [
    { q:`<p>A prediction is correct. What is its zero-one loss?</p>`,
      steps:[
        {do:`Zero-one loss is $0$ when right, $1$ when wrong.`, why:`It just counts mistakes.`},
        {do:`The prediction is right, so loss $= 0$.`, why:`No mistake means no penalty.`}
      ],
      answer:`$0$` },

    { q:`<p>True label $y=+1$, margin $m = 2$. Compute the hinge loss $\\max(1-m,0)$.</p>`,
      steps:[
        {do:`Compute $1 - m = 1 - 2 = -1$.`, why:`Hinge looks at how far the margin is past $1$.`},
        {do:`$\\max(-1, 0) = 0$.`, why:`The margin cleared $1$, so hinge gives zero loss.`}
      ],
      answer:`$0$` },

    { q:`<p>Margin $m = 0.3$. Compute the hinge loss $\\max(1-m,0)$.</p>`,
      steps:[
        {do:`$1 - m = 1 - 0.3 = 0.7$.`, why:`Hinge penalizes margins below $1$.`},
        {do:`$\\max(0.7, 0) = 0.7$.`, why:`Since $0.7 &gt; 0$, hinge charges this much.`}
      ],
      answer:`$0.7$` },

    { q:`<p>Margin $m = -1$ (a wrong prediction). Compute the hinge loss $\\max(1-m,0)$.</p>`,
      steps:[
        {do:`$1 - m = 1 - (-1) = 2$.`, why:`A negative margin makes $1-m$ large.`},
        {do:`$\\max(2, 0) = 2$.`, why:`Wrong predictions get a big hinge penalty.`}
      ],
      answer:`$2$` },

    { q:`<p>Squared loss is $(\\text{prediction}-y)^2$. Prediction $= 5$, target $y = 2$. Compute it.</p>`,
      steps:[
        {do:`Difference: $5 - 2 = 3$.`, why:`Squared loss measures the gap to the target.`},
        {do:`Square it: $3^2 = 9$.`, why:`Squaring punishes big errors harder.`}
      ],
      answer:`$9$` },

    { q:`<p>Two examples have hinge losses $0.4$ and $0.6$. What is the average train loss?</p>`,
      steps:[
        {do:`Sum the losses: $0.4 + 0.6 = 1.0$.`, why:`Train loss adds up the per-example losses.`},
        {do:`Divide by the count: $1.0 / 2 = 0.5$.`, why:`Train loss is the average, so divide by $|D|$.`}
      ],
      answer:`$0.5$` },

    { q:`<p>Three examples have zero-one losses $1, 0, 1$. What fraction are misclassified (the average zero-one loss)?</p>`,
      steps:[
        {do:`Sum: $1 + 0 + 1 = 2$.`, why:`Each $1$ is one mistake.`},
        {do:`Divide by $3$: $2/3 \\approx 0.67$.`, why:`Average zero-one loss is the misclassification rate.`}
      ],
      answer:`$2/3$` },

    { q:`<p>Two examples. Example 1: margin $0.5$. Example 2: margin $1.5$. Find the average hinge loss.</p>`,
      steps:[
        {do:`Example 1: $\\max(1-0.5,0) = 0.5$.`, why:`Margin below $1$, so hinge charges $0.5$.`},
        {do:`Example 2: $\\max(1-1.5,0) = \\max(-0.5,0) = 0$.`, why:`Margin past $1$, so no penalty.`},
        {do:`Average: $(0.5 + 0)/2 = 0.25$.`, why:`Train loss is the mean over examples.`}
      ],
      answer:`$0.25$` },

    { q:`<p>Why does the zero-one loss give no useful slope for learning, while hinge does?</p>`,
      steps:[
        {do:`Zero-one is flat at $0$ or $1$ with a sudden jump.`, why:`A flat function has zero gradient almost everywhere.`},
        {do:`Hinge slopes down as the margin grows toward $1$.`, why:`A slope tells gradient descent which way to move the weights.`}
      ],
      answer:`hinge has a usable gradient; zero-one does not` },

    { q:`<p>Example: $\\phi(x)=[2,1]$, $w=[1,1]$, true label $y=+1$. Compute the score, margin, and hinge loss.</p>`,
      steps:[
        {do:`Score: $1\\times2 + 1\\times1 = 3$.`, why:`Dot product of weights and features.`},
        {do:`Margin: $m = 3\\times(+1) = 3$.`, why:`Margin is score times true label.`},
        {do:`Hinge: $\\max(1-3, 0) = \\max(-2,0) = 0$.`, why:`Margin well past $1$, so zero loss.`}
      ],
      answer:`$s=3,\\ m=3,\\ \\text{hinge}=0$` }
  ],

  "ai-sgd": [
    { q:`<p>One weight $w=5$, loss gradient $\\nabla_w = 2$, learning rate $\\eta = 1$. Do one SGD update.</p>`,
      steps:[
        {do:`Update rule: $w \\leftarrow w - \\eta\\,\\nabla_w$.`, why:`SGD steps against the gradient (downhill).`},
        {do:`$w \\leftarrow 5 - 1\\times2 = 3$.`, why:`Plug in the numbers.`}
      ],
      answer:`$w = 3$` },

    { q:`<p>$w = 10$, gradient $\\nabla_w = 4$, learning rate $\\eta = 0.25$. New $w$?</p>`,
      steps:[
        {do:`$w \\leftarrow 10 - 0.25\\times4$.`, why:`Apply the SGD update.`},
        {do:`$= 10 - 1 = 9$.`, why:`The weight steps down by one.`}
      ],
      answer:`$w = 9$` },

    { q:`<p>$w = 4$, gradient $\\nabla_w = 2$, $\\eta = 0.5$. New $w$?</p>`,
      steps:[
        {do:`$w \\leftarrow 4 - 0.5\\times2$.`, why:`Apply the update rule.`},
        {do:`$= 4 - 1 = 3$.`, why:`Move downhill by one step.`}
      ],
      answer:`$w = 3$` },

    { q:`<p>The gradient is negative: $w = 2$, $\\nabla_w = -3$, $\\eta = 1$. New $w$? Which way did it move?</p>`,
      steps:[
        {do:`$w \\leftarrow 2 - 1\\times(-3) = 2 + 3 = 5$.`, why:`Subtracting a negative adds.`},
        {do:`The weight moved up, from $2$ to $5$.`, why:`A negative gradient means uphill is to the left, so we step right.`}
      ],
      answer:`$w = 5$` },

    { q:`<p>$w = 8$, gradient $\\nabla_w = 6$, $\\eta = 0.1$. New $w$?</p>`,
      steps:[
        {do:`$w \\leftarrow 8 - 0.1\\times6$.`, why:`Apply the SGD step.`},
        {do:`$= 8 - 0.6 = 7.4$.`, why:`A small $\\eta$ makes a small step.`}
      ],
      answer:`$w = 7.4$` },

    { q:`<p>A vector weight $w = [3, 1]$, gradient $\\nabla_w = [2, 4]$, $\\eta = 0.5$. New $w$?</p>`,
      steps:[
        {do:`Update each entry: $3 - 0.5\\times2 = 2$.`, why:`SGD updates every weight component.`},
        {do:`$1 - 0.5\\times4 = -1$.`, why:`Apply the same step to the second entry.`}
      ],
      answer:`$w = [2, -1]$` },

    { q:`<p>Squared loss gives gradient $\\nabla_w = 2(\\text{pred}-y)\\,\\phi$. With pred $=5$, $y=3$, $\\phi=1$, find the gradient.</p>`,
      steps:[
        {do:`Error: $\\text{pred} - y = 5 - 3 = 2$.`, why:`The gradient depends on how wrong we are.`},
        {do:`$\\nabla_w = 2\\times2\\times1 = 4$.`, why:`Plug into the squared-loss gradient formula.`}
      ],
      answer:`$\\nabla_w = 4$` },

    { q:`<p>From the last problem, the gradient is $4$. With $w = 10$ and $\\eta = 0.5$, do the SGD update.</p>`,
      steps:[
        {do:`$w \\leftarrow 10 - 0.5\\times4$.`, why:`Step against the gradient.`},
        {do:`$= 10 - 2 = 8$.`, why:`The weight moves toward lower loss.`}
      ],
      answer:`$w = 8$` },

    { q:`<p>$w = 6$, gradient $\\nabla_w = 2$. With $\\eta = 0.5$ the new $w$ is $5$; with $\\eta = 5$ it is $-4$. What does too large an $\\eta$ risk?</p>`,
      steps:[
        {do:`Small step: $6 - 0.5\\times2 = 5$. Big step: $6 - 5\\times2 = -4$.`, why:`The learning rate scales how far we move.`},
        {do:`A huge step can jump past the minimum.`, why:`Too large an $\\eta$ overshoots and can make the loss grow.`}
      ],
      answer:`too large $\\eta$ overshoots` },

    { q:`<p>Why does SGD step after one example instead of waiting for the whole dataset?</p>`,
      steps:[
        {do:`One example's gradient is a cheap, rough estimate of the full gradient.`, why:`Computing the full gradient over all data is slow.`},
        {do:`Many cheap noisy steps beat a few expensive exact ones.`, why:`More updates per second means faster learning on big data.`}
      ],
      answer:`cheaper, more frequent updates` }
  ],

  "ai-search-problem": [
    { q:`<p>Line of cells $A - B - C$. Each step costs $1$. What is the cost of the path from $A$ to $C$?</p>`,
      steps:[
        {do:`Path: $A \\to B \\to C$, two steps.`, why:`A path is a chain of actions from the start.`},
        {do:`Total cost: $1 + 1 = 2$.`, why:`Path cost is the sum of action costs.`}
      ],
      answer:`$2$` },

    { q:`<p>In the line $A - B - C$, suppose $\\text{Cost}(B,\\text{right}) = 5$ instead of $1$. New cost from $A$ to $C$?</p>`,
      steps:[
        {do:`$\\text{Cost}(A,\\text{right}) = 1$, $\\text{Cost}(B,\\text{right}) = 5$.`, why:`Read the two action costs along the path.`},
        {do:`Total: $1 + 5 = 6$.`, why:`Sum the action costs.`}
      ],
      answer:`$6$` },

    { q:`<p>A search problem has $\\text{Succ}(A,\\text{right}) = B$. What does $\\text{Succ}$ tell you?</p>`,
      steps:[
        {do:`$\\text{Succ}$ gives the next state after an action.`, why:`It is the successor function of the search problem.`},
        {do:`So doing "right" in $A$ lands you in $B$.`, why:`That is exactly what $\\text{Succ}(A,\\text{right})=B$ says.`}
      ],
      answer:`you land in state $B$` },

    { q:`<p>A goal test gives $\\text{IsEnd}(C) = \\text{true}$ and $\\text{IsEnd}(A) = \\text{false}$. At which state does search stop?</p>`,
      steps:[
        {do:`Search stops where $\\text{IsEnd}$ is true.`, why:`$\\text{IsEnd}$ marks goal states.`},
        {do:`That is state $C$.`, why:`Only $C$ returns true here.`}
      ],
      answer:`at $C$` },

    { q:`<p>Why must every action cost satisfy $\\text{Cost}(s,a) \\ge 0$ in these search problems?</p>`,
      steps:[
        {do:`All costs are non-negative.`, why:`Negative costs would let a path get cheaper by looping forever.`},
        {do:`So "cheapest path" stays well defined.`, why:`Non-negative costs guarantee a finite minimum cost exists.`}
      ],
      answer:`so cheapest path is well defined` },

    { q:`<p>A maze cell has $\\text{Actions}(s) = \\{\\text{up}, \\text{down}, \\text{left}, \\text{right}\\}$. How many successors can $s$ have at most?</p>`,
      steps:[
        {do:`Each action leads to one successor.`, why:`$\\text{Succ}(s,a)$ gives one next state per action.`},
        {do:`Four actions, so at most $4$ successors.`, why:`Count the allowed actions.`}
      ],
      answer:`$4$` },

    { q:`<p>Path $A \\to B \\to C \\to D$ with costs $2, 3, 1$. What is the total path cost?</p>`,
      steps:[
        {do:`Add the three action costs: $2 + 3 + 1$.`, why:`Path cost sums each action along the way.`},
        {do:`$= 6$.`, why:`That is the total.`}
      ],
      answer:`$6$` },

    { q:`<p>Two paths from $A$ to $D$: one costs $2+3 = 5$, another costs $1+1+1 = 3$. Which path does search prefer?</p>`,
      steps:[
        {do:`Compare totals: $5$ versus $3$.`, why:`Search wants the cheapest path.`},
        {do:`Pick the cheaper one, cost $3$.`, why:`Lower total cost wins.`}
      ],
      answer:`the cost-$3$ path` },

    { q:`<p>Describe routing a GPS as a search problem: what is the start, what are actions, and what is the goal test?</p>`,
      steps:[
        {do:`Start = your current location; actions = roads you can take; cost = travel time.`, why:`The five pieces define the search problem.`},
        {do:`$\\text{IsEnd}(s)$ is true when $s$ is the destination.`, why:`The goal test marks where you want to arrive.`}
      ],
      answer:`start=location, actions=roads, goal=destination` },

    { q:`<p>A tiny grid: $A \\to B$ costs $1$, $A \\to C$ costs $4$, $B \\to D$ costs $1$, $C \\to D$ costs $1$. Cheapest cost from $A$ to $D$?</p>`,
      steps:[
        {do:`Path via $B$: $1 + 1 = 2$.`, why:`Sum the costs along $A\\to B\\to D$.`},
        {do:`Path via $C$: $4 + 1 = 5$.`, why:`Sum the costs along $A\\to C\\to D$.`},
        {do:`Cheapest is $\\min(2,5) = 2$.`, why:`Search returns the minimum-cost path.`}
      ],
      answer:`$2$` }
  ],

  "ai-tree-search": [
    { q:`<p>A tree has branching factor $b = 2$ and goal depth $d = 3$. Roughly how many states are at the deepest level, $b^d$?</p>`,
      steps:[
        {do:`Compute $b^d = 2^3$.`, why:`The bottom level has about $b^d$ states.`},
        {do:`$2^3 = 8$.`, why:`$2\\times2\\times2 = 8$.`}
      ],
      answer:`$8$` },

    { q:`<p>Branching factor $b = 3$, depth $d = 2$. Roughly how many states at depth $2$?</p>`,
      steps:[
        {do:`$b^d = 3^2$.`, why:`States at the bottom level grow as $b^d$.`},
        {do:`$= 9$.`, why:`$3\\times3 = 9$.`}
      ],
      answer:`$9$` },

    { q:`<p>BFS explores a tree whose root has children $B, C$, and $B$ has children $D, E$. Goal is $E$. List the visit order.</p>`,
      steps:[
        {do:`BFS visits level by level: root, then $B, C$, then $D, E$.`, why:`BFS explores all shallow states before deeper ones.`},
        {do:`Order: root, $B$, $C$, $D$, $E$. It finds $E$ last.`, why:`$E$ sits at the deepest level reached.`}
      ],
      answer:`root, $B$, $C$, $D$, $E$` },

    { q:`<p>DFS explores the same tree (root; children $B,C$; $B$ has children $D,E$), going left-first. What order does it visit?</p>`,
      steps:[
        {do:`DFS dives down the first branch: root, then $B$, then $D$.`, why:`DFS goes deep before wide.`},
        {do:`Backtrack to $E$, then up to $C$. Order: root, $B$, $D$, $E$, $C$.`, why:`DFS finishes a branch, then backtracks.`}
      ],
      answer:`root, $B$, $D$, $E$, $C$` },

    { q:`<p>What is the time cost of tree search, in big-O, for branching factor $b$ and depth $d$?</p>`,
      steps:[
        {do:`Number of states grows like $b^d$.`, why:`Each level multiplies the count by $b$.`},
        {do:`So time is $\\mathcal{O}(b^d)$.`, why:`Big-O describes how cost grows with $d$.`}
      ],
      answer:`$\\mathcal{O}(b^d)$` },

    { q:`<p>Compare memory: what is BFS space versus DFS space in big-O?</p>`,
      steps:[
        {do:`BFS must hold a whole level, $\\mathcal{O}(b^d)$.`, why:`It remembers all states at the current frontier.`},
        {do:`DFS holds just the current path, $\\mathcal{O}(d)$.`, why:`It only needs the chain back to the root.`}
      ],
      answer:`BFS $\\mathcal{O}(b^d)$, DFS $\\mathcal{O}(d)$` },

    { q:`<p>Branching factor $b = 2$, depth $d = 4$. About how many states are in the bottom level alone?</p>`,
      steps:[
        {do:`The bottom level has $b^d = 2^4$ states.`, why:`Bottom level count is $b^d$.`},
        {do:`$2^4 = 16$.`, why:`$2\\times2\\times2\\times2 = 16$.`}
      ],
      answer:`$16$` },

    { q:`<p>Why might DFS go badly wrong on a tree where the goal is shallow but on the right branch?</p>`,
      steps:[
        {do:`DFS dives down the left branch first, possibly very deep.`, why:`DFS explores deep before checking other branches.`},
        {do:`It can waste time deep down before reaching the shallow goal.`, why:`DFS does not guarantee finding the shallowest goal first.`}
      ],
      answer:`DFS may explore a deep wrong branch first` },

    { q:`<p>Iterative deepening runs DFS with depth caps $1, 2, 3, \\dots$. Which two good properties does it combine?</p>`,
      steps:[
        {do:`It finds the shallowest goal first, like BFS.`, why:`The growing depth cap reaches shallow goals early.`},
        {do:`It uses only $\\mathcal{O}(d)$ memory, like DFS.`, why:`Each pass is a depth-limited DFS holding one path.`}
      ],
      answer:`BFS's shallow-goal find, DFS's small memory` },

    { q:`<p>A tree has $b = 10$ and the goal at $d = 6$. Why is plain tree search impractical here?</p>`,
      steps:[
        {do:`States blow up: $b^d = 10^6 = 1{,}000{,}000$.`, why:`The count grows exponentially with depth.`},
        {do:`A million states is too many to explore naively.`, why:`This $b^d$ blowup motivates smarter methods like graph search and A*.`}
      ],
      answer:`$10^6$ states, exponential blowup` }
  ],

  "ai-graph-search": [
    { q:`<p>Two ways to reach goal $G$: via $X$ costs $2+2$, via $Y$ costs $3+5$. What is the cheapest cost, and which route wins?</p>`,
      steps:[
        {do:`Via $X$: $2 + 2 = 4$. Via $Y$: $3 + 5 = 8$.`, why:`Add the costs along each route.`},
        {do:`$\\min(4, 8) = 4$, so $X$ wins.`, why:`FutureCost takes the cheapest option.`}
      ],
      answer:`$4$, via $X$` },

    { q:`<p>States $A\\to B\\to D$ and $A\\to C\\to D$. Costs: $A\\to B = 1$, $B\\to D = 4$, $A\\to C = 2$, $C\\to D = 1$. Find $\\text{FutureCost}(A)$.</p>`,
      steps:[
        {do:`Through $B$: $1 + 4 = 5$.`, why:`Sum the costs on the $B$ route.`},
        {do:`Through $C$: $2 + 1 = 3$.`, why:`Sum the costs on the $C$ route.`},
        {do:`$\\text{FutureCost}(A) = \\min(5, 3) = 3$.`, why:`FutureCost is the cheapest path to the goal.`}
      ],
      answer:`$3$` },

    { q:`<p>UCS keeps a frontier with PastCosts $\\{B:1,\\ C:2,\\ E:5\\}$. Which state does it expand next?</p>`,
      steps:[
        {do:`UCS picks the smallest PastCost.`, why:`Uniform cost search always expands the cheapest-so-far state.`},
        {do:`$\\min(1, 2, 5) = 1$, so expand $B$.`, why:`$B$ has the lowest cost reached so far.`}
      ],
      answer:`$B$` },

    { q:`<p>Why does graph search beat tree search when many paths reach the same state?</p>`,
      steps:[
        {do:`Graph search remembers states it already handled.`, why:`It never re-expands a state.`},
        {do:`Tree search would redo the same subproblem many times.`, why:`Memoizing solved states avoids wasted repeated work.`}
      ],
      answer:`it avoids re-exploring repeated states` },

    { q:`<p>$\\text{FutureCost}(s) = \\min_a [\\,\\text{Cost}(s,a) + \\text{FutureCost}(\\text{Succ}(s,a))\\,]$. In words, what does this say?</p>`,
      steps:[
        {do:`Take the cheapest action now plus the best future cost from where it leads.`, why:`That is the recursive structure of the formula.`},
        {do:`Minimize over all available actions.`, why:`We want the single best continuation.`}
      ],
      answer:`cheapest action now + best future after it` },

    { q:`<p>A node $s$ has two actions: cost $3$ to a state with FutureCost $2$, and cost $1$ to a state with FutureCost $6$. Find $\\text{FutureCost}(s)$.</p>`,
      steps:[
        {do:`First action: $3 + 2 = 5$.`, why:`Cost now plus future cost from that successor.`},
        {do:`Second action: $1 + 6 = 7$.`, why:`Same computation for the other action.`},
        {do:`$\\text{FutureCost}(s) = \\min(5, 7) = 5$.`, why:`Take the cheaper action overall.`}
      ],
      answer:`$5$` },

    { q:`<p>UCS frontier holds $\\{P:3,\\ Q:3,\\ R:7\\}$. It expands the cheapest, $P$. Which node is next?</p>`,
      steps:[
        {do:`After expanding $P$, the frontier is $\\{Q:3,\\ R:7\\}$.`, why:`UCS removed the expanded node.`},
        {do:`Next is $Q$ at cost $3$.`, why:`$Q$ now has the smallest PastCost.`}
      ],
      answer:`$Q$` },

    { q:`<p>Dynamic programming requires the graph to be acyclic. Why does a loop break it?</p>`,
      steps:[
        {do:`With a loop, a state's future cost can depend on itself.`, why:`FutureCost would be defined in terms of itself, circularly.`},
        {do:`So "solve each state once" no longer works.`, why:`DP needs a clear order with no circular dependencies.`}
      ],
      answer:`a cycle makes FutureCost circular` },

    { q:`<p>UCS is the same as which classic algorithm, and what does it need from the costs?</p>`,
      steps:[
        {do:`UCS is Dijkstra's algorithm.`, why:`Both expand the cheapest-so-far node each round.`},
        {do:`It needs all costs $\\ge 0$.`, why:`Non-negative costs guarantee a node is settled at its cheapest when expanded.`}
      ],
      answer:`Dijkstra; needs non-negative costs` },

    { q:`<p>Costs: $A\\to B = 1$, $A\\to C = 5$, $B\\to C = 1$. Trace UCS to find the cheapest cost from $A$ to $C$.</p>`,
      steps:[
        {do:`Expand $A$. Frontier: $B$ at $1$, $C$ at $5$.`, why:`These are the direct successors with their PastCosts.`},
        {do:`Cheapest is $B$ at $1$. From $B$, reach $C$ at $1+1 = 2$.`, why:`UCS expands $B$ first and updates $C$ to the cheaper cost.`},
        {do:`$C$ now costs $\\min(5, 2) = 2$.`, why:`The route through $B$ is cheaper than the direct edge.`}
      ],
      answer:`$2$` }
  ],

  "ai-astar": [
    { q:`<p>In A*, a node has past cost $g = 4$ and heuristic $h = 3$. What is its priority $f = g + h$?</p>`,
      steps:[
        {do:`$f = g + h = 4 + 3 = 7$.`, why:`A* ranks nodes by past cost plus estimated cost-to-go.`},
        {do:`A* expands the smallest $f$ first.`, why:`That node looks most promising overall.`}
      ],
      answer:`$f = 7$` },

    { q:`<p>A node has $g = 2$ and $h = 5$. Compute $f$.</p>`,
      steps:[
        {do:`$f = g + h = 2 + 5 = 7$.`, why:`$f$ adds past cost and heuristic.`},
        {do:`Use $f$ to order the search.`, why:`A* expands lowest $f$ first.`}
      ],
      answer:`$f = 7$` },

    { q:`<p>The true remaining cost from a state is $7$. Is the heuristic $h = 6$ admissible?</p>`,
      steps:[
        {do:`Admissible means $h \\le$ true remaining cost.`, why:`The heuristic must never overestimate.`},
        {do:`$6 \\le 7$, so yes, it is admissible.`, why:`It does not overshoot the true cost.`}
      ],
      answer:`yes, admissible` },

    { q:`<p>The true remaining cost is $7$. Is $h = 8$ admissible?</p>`,
      steps:[
        {do:`Check $h \\le 7$.`, why:`Admissibility forbids overestimating.`},
        {do:`$8 &gt; 7$, so it is NOT admissible.`, why:`It overestimates, which can break A*'s guarantee.`}
      ],
      answer:`no, not admissible` },

    { q:`<p>Two frontier nodes: node $P$ with $g=3, h=4$; node $Q$ with $g=1, h=5$. Which does A* expand first?</p>`,
      steps:[
        {do:`$f_P = 3 + 4 = 7$.`, why:`Compute priority for $P$.`},
        {do:`$f_Q = 1 + 5 = 6$.`, why:`Compute priority for $Q$.`},
        {do:`$\\min(7, 6) = 6$, so expand $Q$ first.`, why:`A* expands the lowest $f$.`}
      ],
      answer:`$Q$` },

    { q:`<p>A goal node always has $h = 0$. If a goal is reached with $g = 9$, what is its $f$?</p>`,
      steps:[
        {do:`$f = g + h = 9 + 0 = 9$.`, why:`At the goal there is no remaining cost to estimate.`},
        {do:`So $f$ equals the path cost $g$.`, why:`The heuristic contributes nothing at the goal.`}
      ],
      answer:`$f = 9$` },

    { q:`<p>The heuristic $h(s) = 0$ for every state. What does A* reduce to?</p>`,
      steps:[
        {do:`With $h = 0$, $f = g + 0 = g$.`, why:`Priority becomes just the past cost.`},
        {do:`Ranking by $g$ alone is uniform cost search.`, why:`A* with a zero heuristic is plain UCS.`}
      ],
      answer:`uniform cost search (UCS)` },

    { q:`<p>Why does an admissible heuristic guarantee A* finds the cheapest path?</p>`,
      steps:[
        {do:`Admissible $h$ never overestimates the cost-to-go.`, why:`So $f = g + h$ never overestimates the true total cost.`},
        {do:`A* will not settle a goal until no cheaper path can exist.`, why:`Optimistic $f$ values keep better paths on the frontier until checked.`}
      ],
      answer:`it never overshoots, so the optimum is not skipped` },

    { q:`<p>A cell near the goal has $h = 1$; a cell in the wrong direction has $h = 9$. Both have $g = 2$. Which does A* prefer?</p>`,
      steps:[
        {do:`Near goal: $f = 2 + 1 = 3$.`, why:`Low heuristic means it looks close to the goal.`},
        {do:`Wrong way: $f = 2 + 9 = 11$.`, why:`High heuristic means it looks far.`},
        {do:`A* prefers $f = 3$, the cell near the goal.`, why:`The heuristic steers search toward the goal.`}
      ],
      answer:`the cell near the goal` },

    { q:`<p>Straight-line distance is used as $h$ for grid routing. Why is it admissible?</p>`,
      steps:[
        {do:`Straight-line distance is the shortest possible distance.`, why:`No real path can be shorter than a straight line.`},
        {do:`So $h \\le$ true road distance, always.`, why:`That is exactly the admissibility condition.`}
      ],
      answer:`straight-line $\\le$ true distance, so admissible` }
  ],

  "ai-mdp": [
    { q:`<p>An action has $T(s,a,s_1) = 0.7$ and one other outcome $s_2$. What must $T(s,a,s_2)$ be?</p>`,
      steps:[
        {do:`Transition probabilities sum to $1$.`, why:`Something must happen after the action.`},
        {do:`$T(s,a,s_2) = 1 - 0.7 = 0.3$.`, why:`The remaining probability goes to the other outcome.`}
      ],
      answer:`$0.3$` },

    { q:`<p>A robot moves right: $80\\%$ it goes right, $20\\%$ it slips up. Do these probabilities sum to $1$?</p>`,
      steps:[
        {do:`Add them: $0.8 + 0.2 = 1.0$.`, why:`$\\sum_{s'} T(s,a,s') = 1$ must hold.`},
        {do:`Yes, they sum to $1$.`, why:`A valid transition distribution always totals one.`}
      ],
      answer:`yes, $0.8 + 0.2 = 1$` },

    { q:`<p>An action has three outcomes with $T = 0.5$, $0.2$, and one unknown. What is the third probability?</p>`,
      steps:[
        {do:`Known so far: $0.5 + 0.2 = 0.7$.`, why:`Sum the given probabilities.`},
        {do:`Third $= 1 - 0.7 = 0.3$.`, why:`All transition probabilities must total $1$.`}
      ],
      answer:`$0.3$` },

    { q:`<p>What does the discount factor $\\gamma = 0$ mean for how the agent values rewards?</p>`,
      steps:[
        {do:`$\\gamma = 0$ multiplies all later rewards by $0$.`, why:`Only step $1$ keeps full weight ($\\gamma^0 = 1$).`},
        {do:`So only the next reward matters.`, why:`A $\\gamma$ of $0$ makes the agent fully short-sighted.`}
      ],
      answer:`only the immediate reward counts` },

    { q:`<p>What does $\\gamma = 1$ mean compared to $\\gamma = 0$?</p>`,
      steps:[
        {do:`$\\gamma = 1$ keeps every future reward at full value.`, why:`No shrinking is applied to later rewards.`},
        {do:`So the agent is fully patient.`, why:`Higher $\\gamma$ means future rewards count more.`}
      ],
      answer:`fully patient; future rewards count fully` },

    { q:`<p>"Markov" means the next state depends only on what?</p>`,
      steps:[
        {do:`It depends only on the current state and action.`, why:`That is the Markov property.`},
        {do:`The full history before now does not matter.`, why:`Only the present situation drives the transition.`}
      ],
      answer:`the current state and action only` },

    { q:`<p>Move right: $80\\%$ to the right-cell with reward $+5$, $20\\%$ slip up with reward $0$. What is the expected immediate reward?</p>`,
      steps:[
        {do:`Weight each reward by its probability: $0.8\\times5 + 0.2\\times0$.`, why:`Expected reward averages outcomes by their chances.`},
        {do:`$= 4 + 0 = 4$.`, why:`Compute the weighted sum.`}
      ],
      answer:`$4$` },

    { q:`<p>An action has $T(s,a,s_1) = 0.6$ and $T(s,a,s_2) = 0.5$. Can this be a valid MDP transition? Why?</p>`,
      steps:[
        {do:`Sum: $0.6 + 0.5 = 1.1$.`, why:`Transition probabilities must total $1$.`},
        {do:`$1.1 \\ne 1$, so it is invalid.`, why:`Probabilities cannot sum to more than one.`}
      ],
      answer:`no, they sum to $1.1$` },

    { q:`<p>Why does a search problem fail to model a robot on slippery ice, while an MDP works?</p>`,
      steps:[
        {do:`In a search problem an action always lands you where expected.`, why:`Search uses a deterministic $\\text{Succ}(s,a)$.`},
        {do:`An MDP gives each action a probability of several next states.`, why:`$T(s,a,s')$ captures the chance of slipping.`}
      ],
      answer:`MDPs model randomness; search problems do not` },

    { q:`<p>An action leads to $s_1$ with prob $0.5$ (reward $10$) and $s_2$ with prob $0.5$ (reward $2$). What is the expected immediate reward?</p>`,
      steps:[
        {do:`$0.5\\times10 + 0.5\\times2$.`, why:`Average the rewards weighted by probability.`},
        {do:`$= 5 + 1 = 6$.`, why:`Sum the weighted terms.`}
      ],
      answer:`$6$` }
  ],

  "ai-policy-value": [
    { q:`<p>Rewards $r_1 = 4$, $r_2 = 4$ with $\\gamma = 0.5$. What is the discounted utility $u = \\sum_i r_i\\,\\gamma^{i-1}$?</p>`,
      steps:[
        {do:`Step 1: $4\\times\\gamma^0 = 4\\times1 = 4$.`, why:`The first reward counts fully ($\\gamma^0 = 1$).`},
        {do:`Step 2: $4\\times\\gamma^1 = 4\\times0.5 = 2$.`, why:`Later rewards are discounted by $\\gamma$.`},
        {do:`Utility: $4 + 2 = 6$.`, why:`Sum the discounted rewards.`}
      ],
      answer:`$u = 6$` },

    { q:`<p>Rewards $r_1 = 10, r_2 = 10, r_3 = 10$ with $\\gamma = 0.5$. Find the discounted utility.</p>`,
      steps:[
        {do:`Step 1: $10\\times1 = 10$. Step 2: $10\\times0.5 = 5$.`, why:`Apply $\\gamma^{i-1}$ to each reward.`},
        {do:`Step 3: $10\\times0.25 = 2.5$.`, why:`Step 3 uses $\\gamma^2 = 0.25$.`},
        {do:`Utility: $10 + 5 + 2.5 = 17.5$.`, why:`Sum all discounted rewards.`}
      ],
      answer:`$u = 17.5$` },

    { q:`<p>What is $\\gamma^{i-1}$ for step $i = 1$, and why does it matter?</p>`,
      steps:[
        {do:`$\\gamma^{1-1} = \\gamma^0 = 1$.`, why:`Any number to the power $0$ is $1$.`},
        {do:`So the first reward is never discounted.`, why:`Step $1$ always counts at full value.`}
      ],
      answer:`$\\gamma^0 = 1$; step 1 is undiscounted` },

    { q:`<p>A policy $\\pi$ maps state $s$ to action $a$, written $\\pi: s \\mapsto a$. In plain words, what is a policy?</p>`,
      steps:[
        {do:`A policy is a rule: state in, action out.`, why:`$\\pi$ tells the agent what to do in each state.`},
        {do:`Follow it everywhere to get a full game plan.`, why:`The value of $\\pi$ measures how good that plan is.`}
      ],
      answer:`a rule picking an action for each state` },

    { q:`<p>Rewards $r_1 = 8$, $r_2 = 8$ with $\\gamma = 0.25$. Discounted utility?</p>`,
      steps:[
        {do:`Step 1: $8\\times1 = 8$.`, why:`First reward at full weight.`},
        {do:`Step 2: $8\\times0.25 = 2$.`, why:`Second reward scaled by $\\gamma$.`},
        {do:`Utility: $8 + 2 = 10$.`, why:`Sum the discounted rewards.`}
      ],
      answer:`$u = 10$` },

    { q:`<p>Why is $V_\\pi(s)$ an average (an expectation) rather than a single fixed number?</p>`,
      steps:[
        {do:`Actions in an MDP have random outcomes.`, why:`The same policy can yield different reward streams.`},
        {do:`So $V_\\pi(s)$ averages over all possible runs.`, why:`Value is the expected discounted utility.`}
      ],
      answer:`outcomes are random, so we average` },

    { q:`<p>Rewards $r_1 = 6, r_2 = 4, r_3 = 8$ with $\\gamma = 0.5$. Find the discounted utility.</p>`,
      steps:[
        {do:`Step 1: $6\\times1 = 6$. Step 2: $4\\times0.5 = 2$.`, why:`Apply $\\gamma^{i-1}$ to each reward.`},
        {do:`Step 3: $8\\times0.25 = 2$.`, why:`Step 3 uses $\\gamma^2 = 0.25$.`},
        {do:`Utility: $6 + 2 + 2 = 10$.`, why:`Sum the discounted terms.`}
      ],
      answer:`$u = 10$` },

    { q:`<p>With $\\gamma = 1$, rewards $r_1 = 3, r_2 = 3, r_3 = 3$. What is the utility?</p>`,
      steps:[
        {do:`Every $\\gamma^{i-1} = 1$ when $\\gamma = 1$.`, why:`No discounting is applied.`},
        {do:`Utility: $3 + 3 + 3 = 9$.`, why:`Just add the undiscounted rewards.`}
      ],
      answer:`$u = 9$` },

    { q:`<p>A deterministic policy gives rewards $r_1 = 10, r_2 = 0, r_3 = 4$ with $\\gamma = 0.5$. Since there is no randomness, what is $V_\\pi$ at the start?</p>`,
      steps:[
        {do:`Utility: $10\\times1 + 0\\times0.5 + 4\\times0.25 = 10 + 0 + 1 = 11$.`, why:`Discount each reward and sum.`},
        {do:`With no randomness, $V_\\pi$ equals this utility, $11$.`, why:`The expected value of a single fixed outcome is that outcome.`}
      ],
      answer:`$V_\\pi = 11$` },

    { q:`<p>Why does discounting model that "a reward now is worth more than the same reward later"?</p>`,
      steps:[
        {do:`Later rewards get multiplied by $\\gamma^{i-1} &lt; 1$.`, why:`Each future step shrinks more.`},
        {do:`So an earlier reward contributes more to the utility.`, why:`Discounting makes the agent prefer sooner gains.`}
      ],
      answer:`later rewards are shrunk by $\\gamma$` }
  ],

  "ai-qvalue": [
    { q:`<p>One outcome only: probability $1$, reward $6$, next-state value $V = 4$, $\\gamma = 0.5$. What is $Q(s,a)$?</p>`,
      steps:[
        {do:`Inside the bracket: $6 + 0.5\\times4 = 6 + 2 = 8$.`, why:`Immediate reward plus discounted next value.`},
        {do:`Times probability $1$: $Q = 1\\times8 = 8$.`, why:`Weight by the transition probability.`}
      ],
      answer:`$Q = 8$` },

    { q:`<p>One outcome: probability $1$, reward $10$, next value $V = 0$, $\\gamma = 0.5$. Find $Q(s,a)$.</p>`,
      steps:[
        {do:`Bracket: $10 + 0.5\\times0 = 10$.`, why:`Reward plus discounted future value.`},
        {do:`$Q = 1\\times10 = 10$.`, why:`Probability $1$ keeps the full value.`}
      ],
      answer:`$Q = 10$` },

    { q:`<p>The Q-value formula is $Q_\\pi(s,a) = \\sum_{s'} T(s,a,s')[\\text{Reward} + \\gamma V_\\pi(s')]$. What does the sum over $s'$ do?</p>`,
      steps:[
        {do:`It averages over every possible next state.`, why:`Each $s'$ is weighted by its probability $T(s,a,s')$.`},
        {do:`That gives the expected worth of action $a$.`, why:`The action's outcome is uncertain, so we average.`}
      ],
      answer:`averages outcomes weighted by probability` },

    { q:`<p>Two outcomes. $0.5$: reward $4$, next value $0$. $0.5$: reward $0$, next value $0$. $\\gamma = 0.5$. Find $Q$.</p>`,
      steps:[
        {do:`First term: $0.5\\times[4 + 0.5\\times0] = 0.5\\times4 = 2$.`, why:`Probability times (reward + discounted value).`},
        {do:`Second term: $0.5\\times[0 + 0] = 0$.`, why:`This outcome contributes nothing.`},
        {do:`$Q = 2 + 0 = 2$.`, why:`Sum the two weighted terms.`}
      ],
      answer:`$Q = 2$` },

    { q:`<p>Action $a$: $80\\%$ gives reward $5$ and next value $V = 10$; $20\\%$ gives reward $0$ and next value $0$. $\\gamma = 0.5$. Find $Q$.</p>`,
      steps:[
        {do:`Good term: $0.8\\times[5 + 0.5\\times10] = 0.8\\times10 = 8$.`, why:`Reward plus discounted future, weighted by $0.8$.`},
        {do:`Bad term: $0.2\\times[0 + 0] = 0$.`, why:`This branch adds nothing.`},
        {do:`$Q = 8 + 0 = 8$.`, why:`Sum the weighted outcomes.`}
      ],
      answer:`$Q = 8$` },

    { q:`<p>Two outcomes, each probability $0.5$. Both give reward $6$, next value $V = 2$, $\\gamma = 0.5$. Find $Q$.</p>`,
      steps:[
        {do:`Each bracket: $6 + 0.5\\times2 = 7$.`, why:`Reward plus discounted next value.`},
        {do:`$Q = 0.5\\times7 + 0.5\\times7 = 7$.`, why:`Both outcomes are identical, so the average is $7$.`}
      ],
      answer:`$Q = 7$` },

    { q:`<p>One outcome: probability $1$, reward $0$, next value $V = 20$, $\\gamma = 0.5$. Find $Q$.</p>`,
      steps:[
        {do:`Bracket: $0 + 0.5\\times20 = 10$.`, why:`No immediate reward, but the future is valuable.`},
        {do:`$Q = 1\\times10 = 10$.`, why:`A zero reward can still give a good Q-value through future value.`}
      ],
      answer:`$Q = 10$` },

    { q:`<p>How does a Q-value $Q_\\pi(s,a)$ differ from a state value $V_\\pi(s)$?</p>`,
      steps:[
        {do:`$V_\\pi(s)$ rates a state under the policy.`, why:`It assumes you follow $\\pi$ from $s$.`},
        {do:`$Q_\\pi(s,a)$ rates a state AND a chosen action $a$.`, why:`It fixes the first action, then follows $\\pi$.`}
      ],
      answer:`Q fixes an action; V does not` },

    { q:`<p>An agent has $Q(s,\\text{left}) = 6$ and $Q(s,\\text{right}) = 9$. Which action should it take?</p>`,
      steps:[
        {do:`Compare: $9 &gt; 6$.`, why:`Higher Q-value means more expected reward.`},
        {do:`Pick "right".`, why:`A greedy agent chooses the highest-Q action.`}
      ],
      answer:`right` },

    { q:`<p>Two outcomes. $0.6$: reward $10$, next value $0$. $0.4$: reward $5$, next value $0$. $\\gamma = 0.5$. Find $Q$.</p>`,
      steps:[
        {do:`First term: $0.6\\times[10 + 0] = 6$.`, why:`Probability times reward (future value is $0$).`},
        {do:`Second term: $0.4\\times[5 + 0] = 2$.`, why:`Same for the other outcome.`},
        {do:`$Q = 6 + 2 = 8$.`, why:`Sum the weighted terms.`}
      ],
      answer:`$Q = 8$` }
  ],

  "ai-value-iteration": [
    { q:`<p>A state's actions have Q-values $Q(\\text{left}) = 3$ and $Q(\\text{right}) = 7$. What is the new value $V^{(t)}(s) = \\max_a Q(s,a)$?</p>`,
      steps:[
        {do:`Take the max: $\\max(3, 7) = 7$.`, why:`Value iteration keeps the best action's value.`},
        {do:`So $V^{(t)}(s) = 7$.`, why:`The state takes the value of its best action.`}
      ],
      answer:`$V^{(t)}(s) = 7$` },

    { q:`<p>Same state: $Q(\\text{left}) = 3$, $Q(\\text{right}) = 7$. What is the optimal action $\\pi^*(s) = \\arg\\max_a Q(s,a)$?</p>`,
      steps:[
        {do:`$\\arg\\max$ gives the action achieving the max.`, why:`It returns the best action, not its value.`},
        {do:`$7$ comes from "right", so $\\pi^*(s) = \\text{right}$.`, why:`Right is the best action here.`}
      ],
      answer:`right` },

    { q:`<p>Q-values $Q(\\text{up}) = 2$, $Q(\\text{down}) = 9$, $Q(\\text{stay}) = 5$. Find the new value and the optimal action.</p>`,
      steps:[
        {do:`$V = \\max(2, 9, 5) = 9$.`, why:`Value iteration takes the best Q-value.`},
        {do:`$\\arg\\max = \\text{down}$.`, why:`Down achieves the maximum.`}
      ],
      answer:`$V = 9$, action down` },

    { q:`<p>What is the difference between $\\max_a$ and $\\arg\\max_a$ in the Bellman update?</p>`,
      steps:[
        {do:`$\\max_a$ returns the best value (a number).`, why:`It is the size of the best option.`},
        {do:`$\\arg\\max_a$ returns the best action itself.`, why:`It names which action gives that value.`}
      ],
      answer:`max = best number; argmax = best action` },

    { q:`<p>Start with $V^{(0)} = 0$ everywhere. A state's only action has reward $4$ to a state with $V^{(0)} = 0$, $\\gamma = 0.5$. Find $V^{(1)}(s)$.</p>`,
      steps:[
        {do:`$Q^{(0)} = 4 + 0.5\\times0 = 4$.`, why:`Use last round's values ($V^{(0)} = 0$) in the Q-value.`},
        {do:`$V^{(1)}(s) = \\max(4) = 4$.`, why:`One action, so the max is just its Q-value.`}
      ],
      answer:`$V^{(1)}(s) = 4$` },

    { q:`<p>A state has two actions. Using last round's values, $Q(a_1) = 4 + 0.5\\times6 = 7$ and $Q(a_2) = 2 + 0.5\\times2 = 3$. Find $V^{(t)}(s)$.</p>`,
      steps:[
        {do:`The Q-values are $7$ and $3$.`, why:`These were computed from last round's values.`},
        {do:`$V^{(t)}(s) = \\max(7, 3) = 7$.`, why:`Take the best action's value.`}
      ],
      answer:`$V^{(t)}(s) = 7$` },

    { q:`<p>Round 1 gives $V^{(1)} = 5$, round 2 gives $V^{(2)} = 5$ for every state. What does this tell us?</p>`,
      steps:[
        {do:`The values did not change between rounds.`, why:`$V^{(2)} = V^{(1)}$ means they have settled.`},
        {do:`Value iteration has converged; stop.`, why:`When values stop moving, we have the optimal values.`}
      ],
      answer:`converged; stop iterating` },

    { q:`<p>Tiny MDP. State $s$, one action with reward $10$ to a terminal state ($V = 0$), $\\gamma = 0.9$. Do one Bellman update from $V^{(0)} = 0$.</p>`,
      steps:[
        {do:`$Q^{(0)} = 10 + 0.9\\times0 = 10$.`, why:`Reward plus discounted next value (still $0$).`},
        {do:`$V^{(1)}(s) = \\max(10) = 10$.`, why:`Only one action, so its Q-value is the new value.`}
      ],
      answer:`$V^{(1)}(s) = 10$` },

    { q:`<p>Two states. $V^{(0)}(A) = V^{(0)}(B) = 0$. From $A$, one action: reward $2$, leads to $B$, $\\gamma = 0.5$. Compute $V^{(1)}(A)$.</p>`,
      steps:[
        {do:`$Q^{(0)}(A) = 2 + 0.5\\times V^{(0)}(B) = 2 + 0.5\\times0 = 2$.`, why:`Use last round's value of $B$.`},
        {do:`$V^{(1)}(A) = \\max(2) = 2$.`, why:`One action, so the max is its Q-value.`}
      ],
      answer:`$V^{(1)}(A) = 2$` },

    { q:`<p>Continue: now $V^{(1)}(B) = 6$. From $A$, same action: reward $2$, leads to $B$, $\\gamma = 0.5$. Compute $V^{(2)}(A)$.</p>`,
      steps:[
        {do:`$Q^{(1)}(A) = 2 + 0.5\\times V^{(1)}(B) = 2 + 0.5\\times6 = 5$.`, why:`Now use the updated value of $B$.`},
        {do:`$V^{(2)}(A) = \\max(5) = 5$.`, why:`The value of $A$ rises as $B$'s value flows in.`}
      ],
      answer:`$V^{(2)}(A) = 5$` }
  ]

}); })();
