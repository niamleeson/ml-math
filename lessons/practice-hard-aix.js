(function(){ var P=window.PRACTICE; function add(id,probs){P[id]=(P[id]||[]).concat(probs);}

/* ===================================================================
   aix-relaxation — relaxed heuristics, Manhattan distance, admissibility
   =================================================================== */
add("aix-relaxation", [
  { q:`<p>Start at grid cell $(0,0)$, goal at $(3,0)$. Compute the Manhattan-distance heuristic $h = |\\Delta r| + |\\Delta c|$.</p>`,
    steps:[
      {do:`Row change: $|\\Delta r| = |3-0| = 3$.`, why:`Manhattan counts vertical grid steps as the absolute row difference.`},
      {do:`Column change: $|\\Delta c| = |0-0| = 0$.`, why:`No horizontal movement is needed; columns match.`},
      {do:`Add: $h = 3 + 0 = 3$.`, why:`Manhattan distance is the sum of the row and column gaps.`}],
    answer:`$h = 3$` },

  { q:`<p>Start $(1,2)$, goal $(4,6)$. Find the Manhattan heuristic $h$.</p>`,
    steps:[
      {do:`$|\\Delta r| = |4-1| = 3$.`, why:`Absolute difference of the row coordinates.`},
      {do:`$|\\Delta c| = |6-2| = 4$.`, why:`Absolute difference of the column coordinates.`},
      {do:`$h = 3 + 4 = 7$.`, why:`Sum the two gaps to get Manhattan distance.`}],
    answer:`$h = 7$` },

  { q:`<p>A heuristic gives $h = 5$ and the true cheapest cost to the goal is $\\text{Cost} = 8$. Is $h$ admissible?</p>`,
    steps:[
      {do:`Admissible means $h \\le \\text{Cost}$: the guess never overestimates.`, why:`That is the definition A* requires for optimality.`},
      {do:`Check $5 \\le 8$. True.`, why:`The heuristic is below the true cost.`}],
    answer:`$Yes,\\ h=5 \\le 8\\ so\\ admissible.$` },

  { q:`<p>A heuristic reports $h = 10$ but the true cost is $\\text{Cost} = 7$. Is $h$ admissible?</p>`,
    steps:[
      {do:`Test $h \\le \\text{Cost}$: is $10 \\le 7$?`, why:`Admissibility forbids overestimating the true remaining cost.`},
      {do:`$10 &gt; 7$, so the test fails.`, why:`The heuristic claims a larger cost than truly exists.`}],
    answer:`$No.\\ 10 &gt; 7,\\ so\\ h\\ overestimates\\ and\\ is\\ inadmissible.$` },

  { q:`<p>In a maze, removing the walls (relaxation) gives straight cost $h = 8$, and the true winding path is $12$ steps. State $h$ and confirm admissibility.</p>`,
    steps:[
      {do:`The relaxed cost is the heuristic: $h = \\text{Cost}_{rel} = 8$.`, why:`Dropping a constraint produces an easier problem whose cost is the heuristic.`},
      {do:`Compare to true cost: $8 \\le 12$.`, why:`Removing rules can only lower cost, so the relaxed cost is a lower bound.`},
      {do:`Therefore $h = 8$ is admissible.`, why:`It never exceeds the true cost.`}],
    answer:`$h = 8 \\le 12,\\ admissible.$` },

  { q:`<p>For the 8-puzzle, the relaxation "tiles can teleport, ignore that they block each other" gives the heuristic = sum of each tile's Manhattan distance to its goal. Two tiles are $2$ and $3$ moves away. What is $h$?</p>`,
    steps:[
      {do:`Sum the per-tile Manhattan distances: $h = 2 + 3$.`, why:`The relaxed problem lets each tile move independently, so costs add.`},
      {do:`$h = 5$.`, why:`Total relaxed cost across the two tiles.`}],
    answer:`$h = 5$` },

  { q:`<p>Two admissible heuristics give $h_1 = 4$ and $h_2 = 6$ at the same state. Which should A* use, and why is $\\max(h_1,h_2)$ still admissible?</p>`,
    steps:[
      {do:`Take $h = \\max(4,6) = 6$.`, why:`A larger admissible heuristic is more informed and expands fewer nodes.`},
      {do:`Each is $\\le \\text{Cost}$, so their max is also $\\le \\text{Cost}$.`, why:`If both stay below the true cost, the larger of them does too.`}],
    answer:`$Use\\ h = 6;\\ max\\ of\\ admissible\\ stays\\ admissible.$` },

  { q:`<p>Start $(2,5)$, goal $(2,1)$. Walls force a true path of $6$ steps. Compute Manhattan $h$ and the heuristic's error (true cost minus $h$).</p>`,
    steps:[
      {do:`$|\\Delta r| = |2-2| = 0$, $|\\Delta c| = |1-5| = 4$.`, why:`Row coordinates match; only the column changes.`},
      {do:`$h = 0 + 4 = 4$.`, why:`Manhattan distance ignores the walls.`},
      {do:`Error $= \\text{Cost} - h = 6 - 4 = 2$.`, why:`The detour around walls adds 2 steps beyond the straight-line estimate.`}],
    answer:`$h = 4,\\ error = 2.$` },

  { q:`<p>For map routing, the relaxation "ignore roads, fly straight" gives Euclidean distance. From $(0,0)$ to $(3,4)$, compute this straight-line heuristic.</p>`,
    steps:[
      {do:`Euclidean distance $= \\sqrt{(\\Delta x)^2 + (\\Delta y)^2} = \\sqrt{3^2 + 4^2}$.`, why:`Flying straight ignores roads, so the relaxed cost is the geometric distance.`},
      {do:`$= \\sqrt{9 + 16} = \\sqrt{25} = 5$.`, why:`A 3-4-5 right triangle.`}],
    answer:`$h = 5$` },

  { q:`<p>Explain in one inequality why any relaxed-problem cost is admissible, given allowed-move sets $A \\subseteq A_{rel}$.</p>`,
    steps:[
      {do:`The true optimal path $P^\\star$ uses only moves in $A$, and $A \\subseteq A_{rel}$.`, why:`Relaxing only adds moves, never removes them.`},
      {do:`So $P^\\star$ is legal in the relaxed problem: $\\text{Cost}_{rel} \\le \\text{cost}(P^\\star) = \\text{Cost}$.`, why:`The relaxed problem can at worst copy the true optimal path.`},
      {do:`Thus $h = \\text{Cost}_{rel} \\le \\text{Cost}$.`, why:`The relaxed cost is a lower bound on the true cost.`}],
    answer:`$h = \\text{Cost}_{rel} \\le \\text{Cost},\\ so\\ admissible.$` },

  { q:`<p>A heuristic is <i>consistent</i> if $h(s) \\le c(s,s') + h(s')$ for every edge. Given $h(s)=7$, edge cost $c=2$, and $h(s')=4$, check consistency.</p>`,
    steps:[
      {do:`Right side: $c + h(s') = 2 + 4 = 6$.`, why:`The triangle-inequality bound for a consistent heuristic.`},
      {do:`Check $h(s) \\le 6$, i.e. $7 \\le 6$. False.`, why:`The heuristic drops by more than the edge cost allows.`}],
    answer:`$Not\\ consistent:\\ 7 &gt; 2 + 4.$` },

  { q:`<p>Same consistency test with $h(s)=5$, $c(s,s')=3$, $h(s')=4$. Is it consistent across this edge?</p>`,
    steps:[
      {do:`Right side: $c + h(s') = 3 + 4 = 7$.`, why:`Consistency requires $h(s) \\le c + h(s')$.`},
      {do:`Check $5 \\le 7$. True.`, why:`The heuristic decreases by at most the edge cost.`}],
    answer:`$Consistent:\\ 5 \\le 3 + 4.$` },

  { q:`<p>The zero heuristic $h(s) = 0$ for all states is always admissible. What search does A* reduce to when $h \\equiv 0$?</p>`,
    steps:[
      {do:`$h = 0 \\le \\text{Cost}$ for every state, so it is admissible.`, why:`Zero can never exceed a non-negative true cost.`},
      {do:`A* ranks nodes by $f = g + h = g + 0 = g$.`, why:`With no heuristic guidance, only path cost so far matters.`},
      {do:`That is uniform-cost search (Dijkstra).`, why:`Expanding by lowest $g$ is exactly uniform-cost search.`}],
    answer:`$Uniform\\text{-}cost\\ search\\ (Dijkstra).$` },

  { q:`<p>An inadmissible heuristic gives $h = \\text{Cost} + 3$ everywhere (overestimates by 3). Can A* still guarantee the optimal path?</p>`,
    steps:[
      {do:`Overestimating breaks the admissibility guarantee.`, why:`A* only provably returns the optimum when $h \\le \\text{Cost}$.`},
      {do:`A node on the optimal path may get an inflated $f$ and be skipped for a cheaper-looking suboptimal one.`, why:`Overestimation can hide the true best path.`}],
    answer:`$No\\ guarantee;\\ overestimation\\ can\\ yield\\ a\\ suboptimal\\ path.$` },

  { q:`<p>A* uses $f(s) = g(s) + h(s)$. With $g = 4$ (cost so far) and Manhattan $h = 6$, compute the priority $f$ used to order the frontier.</p>`,
    steps:[
      {do:`$f = g + h = 4 + 6$.`, why:`A* orders nodes by estimated total path cost = cost so far plus heuristic to go.`},
      {do:`$f = 10$.`, why:`Sum of the two terms.`}],
    answer:`$f = 10$` },

  { q:`<p>Two admissible 8-puzzle relaxations: (i) Manhattan, $h_M = 14$; (ii) misplaced-tile count, $h_T = 6$. Which dominates, and what is the best admissible heuristic to use?</p>`,
    steps:[
      {do:`Heuristic $h_M$ dominates $h_T$ if $h_M \\ge h_T$ at every state.`, why:`A larger admissible heuristic is closer to the true cost and expands fewer nodes.`},
      {do:`Here $14 \\ge 6$, so use $h_M = 14$.`, why:`Manhattan is more informed than counting misplaced tiles.`},
      {do:`Both stay $\\le \\text{Cost}$, so $h_M$ is still admissible.`, why:`Manhattan never overestimates because tiles must move at least their Manhattan distance.`}],
    answer:`$h_M = 14\\ dominates;\\ use\\ it.$` },

  { q:`<p>Relaxed cost = $9$, but a buggy implementation returns $h = 9 + 5 = 14$ while the true cost is $11$. Does the bug preserve admissibility, and what can go wrong?</p>`,
    steps:[
      {do:`Compare buggy $h = 14$ to true cost $11$: $14 &gt; 11$.`, why:`Admissibility needs $h \\le \\text{Cost}$.`},
      {do:`The bug overestimates, so admissibility is lost.`, why:`Adding 5 pushed the heuristic above the true cost.`},
      {do:`A* may now miss the optimal path.`, why:`Overestimating heuristics void the optimality guarantee.`}],
    answer:`$No;\\ h=14&gt;11,\\ admissibility\\ broken.$` }
]);

/* ===================================================================
   aix-structured-perceptron — w <- w + phi(y) - phi(yhat)
   =================================================================== */
add("aix-structured-perceptron", [
  { q:`<p>True features $\\phi(y) = [1,0]$, predicted $\\phi(\\hat y) = [0,1]$, weights $w = [0,0]$. After one update $w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$, find $w$.</p>`,
    steps:[
      {do:`Compute $\\phi(y) - \\phi(\\hat y) = [1,0] - [0,1] = [1,-1]$.`, why:`Reward true features, penalize predicted features.`},
      {do:`$w = [0,0] + [1,-1] = [1,-1]$.`, why:`Add the difference to the current weights.`}],
    answer:`$w = [1,-1]$` },

  { q:`<p>A path's score is the sum of its edge weights. The true path uses edges with weights $\\{2, 3\\}$. What is its score?</p>`,
    steps:[
      {do:`Score $= w \\cdot \\phi(y) = 2 + 3$.`, why:`The score of a structure is the sum of the weights of the features (edges) it uses.`},
      {do:`$= 5$.`, why:`Add the two edge weights.`}],
    answer:`$5$` },

  { q:`<p>True path score $= 4$, predicted path score $= 7$. Did the model make a mistake (predict wrongly)?</p>`,
    steps:[
      {do:`The model predicts the highest-scoring path; here predicted $= 7 \\ge 4 =$ true.`, why:`Argmax picks the wrong path because it scores higher.`},
      {do:`So the prediction differs from the truth: a mistake.`, why:`A mistake triggers a perceptron update.`}],
    answer:`$Yes,\\ a\\ mistake\\ (7 \\ge 4).$` },

  { q:`<p>All weights start at $0$. True path uses edges $\\{e_1, e_2\\}$, predicted path uses $\\{e_3, e_4\\}$ (disjoint). After one update, give the four weights.</p>`,
    steps:[
      {do:`True edges get $+1$: $w_{e_1} = 1$, $w_{e_2} = 1$.`, why:`The update adds $\\phi(y)$, incrementing each true edge.`},
      {do:`Predicted edges get $-1$: $w_{e_3} = -1$, $w_{e_4} = -1$.`, why:`The update subtracts $\\phi(\\hat y)$, decrementing each predicted edge.`}],
    answer:`$w_{e_1}=1,\\ w_{e_2}=1,\\ w_{e_3}=-1,\\ w_{e_4}=-1$` },

  { q:`<p>Continuing: after that single update, recompute the true path score and the predicted path score (each = sum of its two edge weights).</p>`,
    steps:[
      {do:`True score $= w_{e_1} + w_{e_2} = 1 + 1 = 2$.`, why:`Sum of the true path's edge weights.`},
      {do:`Predicted score $= w_{e_3} + w_{e_4} = -1 + -1 = -2$.`, why:`Sum of the predicted path's edge weights.`},
      {do:`True now leads by $2 - (-2) = 4$.`, why:`One correction flipped the decision toward the true path.`}],
    answer:`$true = 2,\\ predicted = -2,\\ gap = 4.$` },

  { q:`<p>$\\phi(y) = [2,1,0]$, $\\phi(\\hat y) = [1,1,1]$, $w = [0,0,0]$. Apply one update.</p>`,
    steps:[
      {do:`$\\phi(y) - \\phi(\\hat y) = [2-1,\\ 1-1,\\ 0-1] = [1,0,-1]$.`, why:`Component-wise: raise true features, lower predicted ones; shared feature 2 cancels.`},
      {do:`$w = [0,0,0] + [1,0,-1] = [1,0,-1]$.`, why:`Add the difference to the zero starting weights.`}],
    answer:`$w = [1,0,-1]$` },

  { q:`<p>If $\\hat y = y$ (prediction is correct), what does the update $w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$ do to $w$?</p>`,
    steps:[
      {do:`$\\phi(y) - \\phi(\\hat y) = \\phi(y) - \\phi(y) = 0$.`, why:`Identical structures have identical feature vectors.`},
      {do:`$w \\leftarrow w + 0 = w$: no change.`, why:`A correct prediction leaves the weights untouched.`}],
    answer:`$w\\ is\\ unchanged.$` },

  { q:`<p>The gap (true minus predicted score) grows by $\\lVert \\phi(y) - \\phi(\\hat y) \\rVert^2$ per update. With $\\phi(y) - \\phi(\\hat y) = [1,-1]$, by how much does the gap grow?</p>`,
    steps:[
      {do:`$\\lVert [1,-1] \\rVert^2 = 1^2 + (-1)^2$.`, why:`Squared length is the sum of squared components.`},
      {do:`$= 1 + 1 = 2$.`, why:`The true output's lead increases by 2 after this update.`}],
    answer:`$Gap\\ grows\\ by\\ 2.$` },

  { q:`<p>Weights $w = [1,-1]$, output A has $\\phi_A = [1,0]$ and output B has $\\phi_B = [0,1]$. Which does the model predict (highest score)?</p>`,
    steps:[
      {do:`Score A $= w \\cdot \\phi_A = 1(1) + (-1)(0) = 1$.`, why:`Dot product of weights with A's features.`},
      {do:`Score B $= w \\cdot \\phi_B = 1(0) + (-1)(1) = -1$.`, why:`Dot product of weights with B's features.`},
      {do:`$1 &gt; -1$, so predict A.`, why:`The model outputs the argmax-scoring structure.`}],
    answer:`$Predict\\ A\\ (score\\ 1 &gt; -1).$` },

  { q:`<p>A shared edge appears in <i>both</i> the true and predicted paths. What happens to its weight under one update, and why?</p>`,
    steps:[
      {do:`Its feature count is the same in $\\phi(y)$ and $\\phi(\\hat y)$.`, why:`Shared edges are used by both structures equally.`},
      {do:`In $\\phi(y) - \\phi(\\hat y)$ that component is $0$.`, why:`Equal counts subtract to zero.`},
      {do:`So the shared edge's weight does not change.`, why:`Only edges that distinguish the two paths get updated.`}],
    answer:`$Unchanged\\ (it\\ cancels).$` },

  { q:`<p>$w = [0,0]$, $\\phi(y) = [3,1]$, $\\phi(\\hat y) = [1,2]$. After the update, compute the new score $w' \\cdot \\phi(y)$ of the true output.</p>`,
    steps:[
      {do:`Update: $w' = [0,0] + [3-1,\\ 1-2] = [2,-1]$.`, why:`$w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$.`},
      {do:`$w' \\cdot \\phi(y) = 2(3) + (-1)(1) = 6 - 1 = 5$.`, why:`Dot the updated weights with the true features.`}],
    answer:`$5$` },

  { q:`<p>From the previous problem, also compute the new predicted score $w' \\cdot \\phi(\\hat y)$ with $w' = [2,-1]$ and $\\phi(\\hat y) = [1,2]$. Does the true output now win?</p>`,
    steps:[
      {do:`$w' \\cdot \\phi(\\hat y) = 2(1) + (-1)(2) = 2 - 2 = 0$.`, why:`Dot the updated weights with the predicted features.`},
      {do:`True score $5 &gt;$ predicted score $0$.`, why:`Compare to decide the new argmax.`}],
    answer:`$Predicted = 0;\\ true\\ (5)\\ now\\ wins.$` },

  { q:`<p>Averaged perceptron returns the mean of the weight vectors over all updates. Over 3 steps the weights were $[1,0]$, $[1,-1]$, $[2,-1]$. Compute the averaged weight.</p>`,
    steps:[
      {do:`Sum component-wise: $[1+1+2,\\ 0+(-1)+(-1)] = [4,-2]$.`, why:`Average each coordinate across the recorded weight vectors.`},
      {do:`Divide by $3$: $[4/3,\\ -2/3]$.`, why:`Averaging reduces overfitting to the last few examples.`}],
    answer:`$\\bar w = [4/3,\\ -2/3]$` },

  { q:`<p>The perceptron update is a gradient step on $\\ell = \\max_{y'}[w\\cdot\\phi(y') - w\\cdot\\phi(y)]$. What is the (sub)gradient of $\\ell$ with respect to $w$ at the predicted $\\hat y$?</p>`,
    steps:[
      {do:`The maximizing $y'$ is $\\hat y$, so $\\ell = w\\cdot\\phi(\\hat y) - w\\cdot\\phi(y)$.`, why:`The argmax inside the loss is exactly the predicted output.`},
      {do:`Differentiate w.r.t. $w$: $\\nabla_w \\ell = \\phi(\\hat y) - \\phi(y)$.`, why:`Linear in $w$, so the gradient is the feature difference.`},
      {do:`Stepping against it gives $w \\leftarrow w + \\phi(y) - \\phi(\\hat y)$.`, why:`This is exactly the perceptron update (with step size 1).`}],
    answer:`$\\nabla_w \\ell = \\phi(\\hat y) - \\phi(y).$` },

  { q:`<p>Two updates are applied. First $\\phi(y_1)-\\phi(\\hat y_1) = [1,0,-1]$, then $\\phi(y_2)-\\phi(\\hat y_2) = [0,1,-1]$. Starting from $w=[0,0,0]$, give the final $w$.</p>`,
    steps:[
      {do:`After update 1: $w = [0,0,0] + [1,0,-1] = [1,0,-1]$.`, why:`Add the first difference.`},
      {do:`After update 2: $w = [1,0,-1] + [0,1,-1] = [1,1,-2]$.`, why:`Add the second difference to the running weights.`}],
    answer:`$w = [1,1,-2]$` },

  { q:`<p>For POS tagging, the gold tag sequence uses feature $f_{N\\to V}$ once; the predicted sequence uses $f_{N\\to N}$ once instead. After one update from $w=0$, give those two feature weights.</p>`,
    steps:[
      {do:`Gold feature $f_{N\\to V}$ gets $+1$.`, why:`It appears in $\\phi(y)$ but not $\\phi(\\hat y)$.`},
      {do:`Predicted feature $f_{N\\to N}$ gets $-1$.`, why:`It appears in $\\phi(\\hat y)$ but not $\\phi(y)$.`}],
    answer:`$w_{N\\to V}=1,\\ w_{N\\to N}=-1.$` },

  { q:`<p>The model keeps predicting wrong because ties break toward the wrong path. With $w=[0,0]$, $\\phi(y)=[1,1]$, $\\phi(\\hat y)=[1,1]$ — identical features. Can the perceptron ever fix this case?</p>`,
    steps:[
      {do:`$\\phi(y) - \\phi(\\hat y) = [0,0]$.`, why:`Identical feature vectors give a zero difference.`},
      {do:`The update leaves $w$ unchanged forever.`, why:`No features distinguish the two structures.`},
      {do:`So the perceptron cannot separate them: the features are insufficient.`, why:`Learning requires features that differ between gold and prediction.`}],
    answer:`$No;\\ identical\\ features\\ make\\ it\\ unseparable.$` }
]);

/* ===================================================================
   aix-monte-carlo — return averaging, u_t = sum gamma^(k-t) r_k
   =================================================================== */
add("aix-monte-carlo", [
  { q:`<p>From $(s,a)$, three episodes give returns $u = 4,\\ 10,\\ 7$. Compute the Monte Carlo estimate $\\hat Q(s,a)$.</p>`,
    steps:[
      {do:`Sum the returns: $4 + 10 + 7 = 21$.`, why:`The MC estimate averages all observed returns.`},
      {do:`Divide by count: $21 / 3 = 7$.`, why:`$\\hat Q = \\frac{1}{N}\\sum u_t$.`}],
    answer:`$\\hat Q = 7$` },

  { q:`<p>Two returns so far: $u = 7$ then $u = 9$. Give $\\hat Q$ after the first episode and after the second.</p>`,
    steps:[
      {do:`After one: $\\hat Q = 7$.`, why:`A single return is its own average.`},
      {do:`After two: $\\hat Q = (7+9)/2 = 8$.`, why:`Average of the two returns.`}],
    answer:`$7,\\ then\\ 8.$` },

  { q:`<p>An episode gives rewards $r_0 = -1,\\ r_1 = -1,\\ r_2 = 10$ with discount $\\gamma = 1$. Compute the return $u_0 = \\sum_{k\\ge 0} \\gamma^{k} r_k$.</p>`,
    steps:[
      {do:`With $\\gamma = 1$, $u_0 = r_0 + r_1 + r_2$.`, why:`No discounting: every reward counts fully.`},
      {do:`$= -1 + (-1) + 10 = 8$.`, why:`Undiscounted sum of rewards.`}],
    answer:`$u_0 = 8$` },

  { q:`<p>Same rewards $r_0=-1,\\ r_1=-1,\\ r_2=10$ but $\\gamma = 0.9$. Compute $u_0 = \\sum_k \\gamma^k r_k$.</p>`,
    steps:[
      {do:`$u_0 = \\gamma^0(-1) + \\gamma^1(-1) + \\gamma^2(10)$.`, why:`Discount each reward by $\\gamma$ raised to its step index.`},
      {do:`$= -1 + 0.9(-1) + 0.81(10) = -1 - 0.9 + 8.1$.`, why:`Compute each term: $0.9^0=1,\\ 0.9^1=0.9,\\ 0.9^2=0.81$.`},
      {do:`$= 6.2$.`, why:`Add the three discounted terms.`}],
    answer:`$u_0 = 6.2$` },

  { q:`<p>The return from step $t$ is $u_t = \\sum_{k \\ge t} \\gamma^{k-t} r_k$. For $r_0=2,\\ r_1=4,\\ r_2=6$ with $\\gamma=0.5$, compute $u_1$ (return from step 1).</p>`,
    steps:[
      {do:`Start at $t=1$: $u_1 = \\gamma^0 r_1 + \\gamma^1 r_2$.`, why:`The exponent is $k-t$, so it resets to 0 at the start step.`},
      {do:`$= 1(4) + 0.5(6) = 4 + 3 = 7$.`, why:`Discount $r_2$ by one factor of $\\gamma = 0.5$.`}],
    answer:`$u_1 = 7$` },

  { q:`<p>Four episodes through $(s,a)$ return $u = 5, 5, 8, 6$. Compute $\\hat Q(s,a)$.</p>`,
    steps:[
      {do:`Sum: $5+5+8+6 = 24$.`, why:`Total of the observed returns.`},
      {do:`Divide by $N = 4$: $24/4 = 6$.`, why:`Sample mean estimates the expected return $Q(s,a)$.`}],
    answer:`$\\hat Q = 6$` },

  { q:`<p>The running mean updates as $\\hat Q \\leftarrow \\hat Q + \\frac{1}{N}(u - \\hat Q)$. With $\\hat Q = 8$ after $4$ episodes and a new fifth return $u = 18$, compute the new $\\hat Q$ (now $N=5$).</p>`,
    steps:[
      {do:`Increment: $\\frac{1}{N}(u - \\hat Q) = \\frac{1}{5}(18 - 8) = \\frac{10}{5} = 2$.`, why:`The incremental mean nudges toward the new sample by $1/N$ of the error.`},
      {do:`$\\hat Q = 8 + 2 = 10$.`, why:`Add the increment to the old estimate.`}],
    answer:`$\\hat Q = 10$` },

  { q:`<p>Why is the Monte Carlo estimate unbiased? Fill the reasoning given $Q(s,a) = \\mathbb{E}[u \\mid s,a]$.</p>`,
    steps:[
      {do:`Each return $u_t$ is one real draw from the return distribution.`, why:`No estimate feeds into a full-episode return; it is actual experience.`},
      {do:`$\\mathbb{E}[\\hat Q] = \\mathbb{E}[u] = Q(s,a)$.`, why:`The expectation of a sample mean equals the true expectation.`},
      {do:`So $\\hat Q$ is unbiased.`, why:`Its expected value equals the target even for small $N$.`}],
    answer:`$\\mathbb{E}[\\hat Q] = Q(s,a),\\ so\\ unbiased.$` },

  { q:`<p>Two episodes have rewards $[+1, +3]$ and $[0, +5]$, both with $\\gamma=1$. Compute each return, then $\\hat Q$.</p>`,
    steps:[
      {do:`Episode 1 return: $1 + 3 = 4$.`, why:`Undiscounted sum of its rewards.`},
      {do:`Episode 2 return: $0 + 5 = 5$.`, why:`Undiscounted sum of its rewards.`},
      {do:`$\\hat Q = (4 + 5)/2 = 4.5$.`, why:`Average the two returns.`}],
    answer:`$returns\\ 4,5;\\ \\hat Q = 4.5$` },

  { q:`<p>MC estimates wobble (high variance). One extra episode returns the outlier $u = 30$ on top of returns averaging $6$ over $4$ episodes. What is the new average over $5$ episodes?</p>`,
    steps:[
      {do:`Old sum: $6 \\times 4 = 24$.`, why:`Recover the total from the mean and count.`},
      {do:`New sum: $24 + 30 = 54$.`, why:`Add the outlier return.`},
      {do:`New mean: $54 / 5 = 10.8$.`, why:`A single outlier shifts the MC estimate noticeably — high variance.`}],
    answer:`$\\hat Q = 10.8$` },

  { q:`<p>First-visit MC: in one episode the pair $(s,a)$ is visited at steps $t=1$ (return $9$) and again at $t=4$ (return $3$). What single return does first-visit MC record?</p>`,
    steps:[
      {do:`First-visit records only the return from the first occurrence.`, why:`That is the defining rule of first-visit Monte Carlo.`},
      {do:`Use the $t=1$ return $= 9$.`, why:`The later visit at $t=4$ is ignored this episode.`}],
    answer:`$Record\\ u = 9.$` },

  { q:`<p>Compute the geometric-sum return for an infinite stream of reward $r = 1$ every step with $\\gamma = 0.9$: $u = \\sum_{k\\ge 0} \\gamma^k r$.</p>`,
    steps:[
      {do:`$u = \\sum_{k\\ge 0} 0.9^k \\cdot 1 = \\frac{1}{1-\\gamma}$.`, why:`A geometric series with ratio $\\gamma &lt; 1$ sums to $1/(1-\\gamma)$.`},
      {do:`$= \\frac{1}{1 - 0.9} = \\frac{1}{0.1} = 10$.`, why:`Plug in $\\gamma = 0.9$.`}],
    answer:`$u = 10$` },

  { q:`<p>Episode rewards: $r_0 = 0,\\ r_1 = 0,\\ r_2 = 100$, $\\gamma = 0.8$. Compute $u_0$ and $u_2$ (return from the last step).</p>`,
    steps:[
      {do:`$u_2 = \\gamma^0 \\cdot 100 = 100$.`, why:`From the final step there is only the terminal reward.`},
      {do:`$u_0 = \\gamma^2 \\cdot 100 = 0.64 \\cdot 100 = 64$.`, why:`From step 0 the reward is two steps away, discounted by $0.8^2 = 0.64$.`}],
    answer:`$u_0 = 64,\\ u_2 = 100.$` },

  { q:`<p>MC vs TD: name two reasons Monte Carlo has higher variance but lower bias than TD's one-step target $r + \\gamma V(s')$.</p>`,
    steps:[
      {do:`MC uses the full sampled return $u_t$, which accumulates randomness over the whole episode.`, why:`Many random steps compound into a noisy total — high variance.`},
      {do:`But $u_t$ uses no estimated value, only real rewards.`, why:`Nothing biased feeds in, so MC is unbiased (low bias).`}],
    answer:`$High\\ variance,\\ low\\ bias\\ (no\\ bootstrapping).$` },

  { q:`<p>Five episodes return $u = 2, 8, 5, 11, 4$. Compute $\\hat Q(s,a)$.</p>`,
    steps:[
      {do:`Sum: $2 + 8 + 5 + 11 + 4 = 30$.`, why:`Total of all returns.`},
      {do:`Divide by $5$: $30/5 = 6$.`, why:`Sample mean of the returns.`}],
    answer:`$\\hat Q = 6$` },

  { q:`<p>A move in Monte Carlo Tree Search has three rollouts ending in win ($+1$), loss ($-1$), win ($+1$). What value does MCTS assign by averaging rollouts?</p>`,
    steps:[
      {do:`Average the three terminal outcomes: $(+1) + (-1) + (+1) = 1$.`, why:`MCTS scores a move by the mean of its random rollout outcomes.`},
      {do:`Divide by $3$: $1/3 \\approx 0.33$.`, why:`Two wins and one loss give a positive average value.`}],
    answer:`$\\approx 0.33$` }
]);

/* ===================================================================
   aix-sarsa-td — V <- V + alpha[r + gamma V' - V]
   =================================================================== */
add("aix-sarsa-td", [
  { q:`<p>$V(s) = 0$, reward $r = 0$, next value $V(s') = 1$, $\\alpha = 0.5$, $\\gamma = 0.9$. Compute the TD target $r + \\gamma V(s')$.</p>`,
    steps:[
      {do:`Target $= r + \\gamma V(s') = 0 + 0.9 \\times 1$.`, why:`The TD target is the reward now plus the discounted next-state value.`},
      {do:`$= 0.9$.`, why:`Multiply and add.`}],
    answer:`$target = 0.9$` },

  { q:`<p>Same setup: $V(s)=0$, target $= 0.9$. Compute the TD error $\\delta = r + \\gamma V(s') - V(s)$.</p>`,
    steps:[
      {do:`$\\delta = 0.9 - V(s) = 0.9 - 0$.`, why:`TD error is target minus current value.`},
      {do:`$= 0.9$.`, why:`The positive error means the value should rise.`}],
    answer:`$\\delta = 0.9$` },

  { q:`<p>With error $\\delta = 0.9$, $V(s)=0$, $\\alpha=0.5$, apply the update $V(s) \\leftarrow V(s) + \\alpha\\,\\delta$.</p>`,
    steps:[
      {do:`$V(s) \\leftarrow 0 + 0.5 \\times 0.9$.`, why:`Step a fraction $\\alpha$ of the way toward the target.`},
      {do:`$= 0.45$.`, why:`The value moves halfway to the target $0.9$.`}],
    answer:`$V(s) = 0.45$` },

  { q:`<p>$V(s) = 2$, $r = 1$, $V(s') = 4$, $\\alpha = 0.5$, $\\gamma = 0.5$. Compute the target, the error, and the new $V(s)$.</p>`,
    steps:[
      {do:`Target $= 1 + 0.5 \\times 4 = 1 + 2 = 3$.`, why:`Reward plus discounted next value.`},
      {do:`Error $= 3 - 2 = 1$.`, why:`Target minus current value.`},
      {do:`New $V(s) = 2 + 0.5 \\times 1 = 2.5$.`, why:`Step half the error toward the target.`}],
    answer:`$target=3,\\ \\delta=1,\\ V(s)=2.5$` },

  { q:`<p>SARSA Q-update: $Q(s,a) \\leftarrow Q(s,a) + \\alpha[r + \\gamma Q(s',a') - Q(s,a)]$. Given $Q(s,a)=5$, $r=2$, $Q(s',a')=10$, $\\alpha=0.1$, $\\gamma=1$. Compute the new $Q(s,a)$.</p>`,
    steps:[
      {do:`Target $= r + \\gamma Q(s',a') = 2 + 1 \\times 10 = 12$.`, why:`SARSA uses the Q-value of the action actually taken next, $a'$.`},
      {do:`Error $= 12 - 5 = 7$.`, why:`Target minus current Q.`},
      {do:`New $Q = 5 + 0.1 \\times 7 = 5.7$.`, why:`Step $\\alpha = 0.1$ of the error.`}],
    answer:`$Q(s,a) = 5.7$` },

  { q:`<p>In a corridor, $V(s')$ at the goal is $1$ (terminal). With $r = 0$, $\\gamma = 0.9$, $\\alpha = 1$, update $V(s)$ from $0$ one step left of the goal.</p>`,
    steps:[
      {do:`Target $= 0 + 0.9 \\times 1 = 0.9$.`, why:`Goal value flows back discounted.`},
      {do:`Error $= 0.9 - 0 = 0.9$.`, why:`The cell starts at zero.`},
      {do:`New $V(s) = 0 + 1 \\times 0.9 = 0.9$.`, why:`With $\\alpha = 1$ the value jumps fully to the target.`}],
    answer:`$V(s) = 0.9$` },

  { q:`<p>Continuing the corridor: the next cell left has $V = 0$, its successor now $V(s') = 0.9$, $r=0$, $\\gamma=0.9$, $\\alpha=1$. Update it.</p>`,
    steps:[
      {do:`Target $= 0 + 0.9 \\times 0.9 = 0.81$.`, why:`Value propagates one more step back, discounted again.`},
      {do:`New $V = 0 + 1 \\times (0.81 - 0) = 0.81$.`, why:`With $\\alpha = 1$, value equals the target.`}],
    answer:`$V(s) = 0.81$` },

  { q:`<p>A negative TD error: $V(s) = 5$, $r = 0$, $V(s') = 2$, $\\alpha = 0.5$, $\\gamma = 1$. Compute $\\delta$ and the new $V(s)$.</p>`,
    steps:[
      {do:`Target $= 0 + 1 \\times 2 = 2$.`, why:`Reward plus discounted next value.`},
      {do:`$\\delta = 2 - 5 = -3$.`, why:`Negative error: the value was too high.`},
      {do:`New $V = 5 + 0.5 \\times (-3) = 5 - 1.5 = 3.5$.`, why:`A negative error lowers the value.`}],
    answer:`$\\delta = -3,\\ V(s) = 3.5$` },

  { q:`<p>The true value satisfies the Bellman fixed point $V(s) = \\mathbb{E}[r + \\gamma V(s')]$. If estimates are already correct, what is $\\mathbb{E}[\\delta]$?</p>`,
    steps:[
      {do:`$\\delta = r + \\gamma V(s') - V(s)$ and $V(s) = \\mathbb{E}[r + \\gamma V(s')]$.`, why:`The TD error measures the gap between the two sides of Bellman.`},
      {do:`So $\\mathbb{E}[\\delta] = \\mathbb{E}[r + \\gamma V(s')] - V(s) = 0$.`, why:`At the fixed point the expected gap vanishes.`}],
    answer:`$\\mathbb{E}[\\delta] = 0.$` },

  { q:`<p>$V(s) = 1$, $r = 2$, $V(s') = 3$, $\\alpha = 0.25$, $\\gamma = 0.8$. Compute target, error, and new $V(s)$.</p>`,
    steps:[
      {do:`Target $= 2 + 0.8 \\times 3 = 2 + 2.4 = 4.4$.`, why:`Reward plus discounted next value.`},
      {do:`Error $= 4.4 - 1 = 3.4$.`, why:`Target minus current value.`},
      {do:`New $V = 1 + 0.25 \\times 3.4 = 1 + 0.85 = 1.85$.`, why:`Step a quarter of the error.`}],
    answer:`$target=4.4,\\ \\delta=3.4,\\ V(s)=1.85$` },

  { q:`<p>SARSA is on-policy. Given $(s, a, r, s', a') = (s, \\text{Up}, 1, s', \\text{Down})$, which Q-value enters the target — $Q(s', \\text{Down})$ or $\\max_{a'} Q(s', a')$?</p>`,
    steps:[
      {do:`SARSA uses the action $a'$ the policy actually took: $\\text{Down}$.`, why:`On-policy means the update follows the behavior policy's next action.`},
      {do:`Target $= r + \\gamma Q(s', \\text{Down})$.`, why:`Not the max — that would be Q-learning (off-policy).`}],
    answer:`$Use\\ Q(s',\\text{Down}).$` },

  { q:`<p>Compare to Q-learning. With $Q(s', a_1) = 4$, $Q(s', a_2) = 7$, $r = 0$, $\\gamma = 1$, and the policy picking $a_1$ next, give the SARSA target and the Q-learning target.</p>`,
    steps:[
      {do:`SARSA target $= r + \\gamma Q(s', a_1) = 0 + 1 \\times 4 = 4$.`, why:`SARSA uses the actually chosen $a_1$.`},
      {do:`Q-learning target $= r + \\gamma \\max_{a'} Q(s', a') = 0 + 1 \\times 7 = 7$.`, why:`Q-learning uses the greedy max next value.`}],
    answer:`$SARSA = 4,\\ Q\\text{-}learning = 7.$` },

  { q:`<p>$V(s) = 0$, $\\alpha = 0.5$, $\\gamma = 1$, terminal reward $r = 10$ (and $V(s')=0$). Apply two successive TD updates (same transition twice).</p>`,
    steps:[
      {do:`Update 1: target $= 10 + 1\\times 0 = 10$, $V = 0 + 0.5(10 - 0) = 5$.`, why:`First exposure moves halfway to the reward.`},
      {do:`Update 2: target $= 10$, $V = 5 + 0.5(10 - 5) = 5 + 2.5 = 7.5$.`, why:`Repeated updates close half the remaining gap each time.`}],
    answer:`$V(s) = 7.5\\ after\\ two\\ updates.$` },

  { q:`<p>The TD error magnitude shows "surprise". Transition A: target $6$, current $V=2$. Transition B: target $3$, current $V=2.5$. Which update changes the value more (same $\\alpha$)?</p>`,
    steps:[
      {do:`$\\delta_A = 6 - 2 = 4$; $\\delta_B = 3 - 2.5 = 0.5$.`, why:`Error is target minus current value.`},
      {do:`$|\\delta_A| = 4 &gt; 0.5 = |\\delta_B|$.`, why:`Update size is $\\alpha\\,\\delta$, so larger error means larger change.`}],
    answer:`$Transition\\ A\\ (\\delta = 4).$` },

  { q:`<p>With a decaying learning rate $\\alpha = 1/N$, update $V(s)$ from current $V = 4$, target $= 7$, on visit $N = 3$. Compute the new $V(s)$.</p>`,
    steps:[
      {do:`$\\alpha = 1/3$.`, why:`Decaying rate ensures convergence to the Bellman fixed point.`},
      {do:`$V = 4 + \\frac{1}{3}(7 - 4) = 4 + 1 = 5$.`, why:`Step $1/3$ of the error of $3$.`}],
    answer:`$V(s) = 5$` },

  { q:`<p>The $n$-step return blends MC and TD. The 2-step target is $r_1 + \\gamma r_2 + \\gamma^2 V(s_2)$. With $r_1 = 1$, $r_2 = 2$, $V(s_2) = 5$, $\\gamma = 0.5$, compute it.</p>`,
    steps:[
      {do:`$= 1 + 0.5(2) + 0.5^2(5)$.`, why:`Accumulate two real rewards, then bootstrap from $V$ at step 2.`},
      {do:`$= 1 + 1 + 0.25 \\times 5 = 1 + 1 + 1.25 = 3.25$.`, why:`Sum the discounted terms.`}],
    answer:`$2\\text{-}step\\ target = 3.25$` }
]);

/* ===================================================================
   aix-game-theory — best responses, Nash, mixed strategies, game value
   =================================================================== */
add("aix-game-theory", [
  { q:`<p>Given B plays "Left", A's payoffs are $5$ (Up) and $3$ (Down). What is A's best response to "Left"?</p>`,
    steps:[
      {do:`A best-responds by maximizing its own payoff: $\\max(5,3)$.`, why:`A best response is the move giving the highest payoff against the opponent's fixed choice.`},
      {do:`$5 &gt; 3$, so play Up.`, why:`Up yields the higher payoff against Left.`}],
    answer:`$Up\\ (payoff\\ 5).$` },

  { q:`<p>Continuing: given B plays "Right", A gets $2$ (Up) and $4$ (Down). A's best response to "Right"?</p>`,
    steps:[
      {do:`$\\max(2,4) = 4$.`, why:`Pick the higher-payoff row against Right.`},
      {do:`Play Down.`, why:`Down beats Up against Right.`}],
    answer:`$Down\\ (payoff\\ 4).$` },

  { q:`<p>Prisoner's dilemma payoffs (higher = better), entries $(A,B)$: both Cooperate $(-1,-1)$; both Defect $(-2,-2)$; A Defects/B Cooperates $(0,-3)$; A Cooperates/B Defects $(-3,0)$. Is Defect a dominant strategy for A?</p>`,
    steps:[
      {do:`If B Cooperates: A gets $-1$ (Coop) vs $0$ (Defect) → Defect.`, why:`Compare A's two rows when B cooperates.`},
      {do:`If B Defects: A gets $-3$ (Coop) vs $-2$ (Defect) → Defect.`, why:`Compare A's two rows when B defects.`},
      {do:`Defect beats Cooperate in both cases.`, why:`A strategy best in every column is dominant.`}],
    answer:`$Yes,\\ Defect\\ dominates\\ for\\ A.$` },

  { q:`<p>By symmetry Defect also dominates for B. What is the Nash equilibrium of the prisoner's dilemma, and its payoff?</p>`,
    steps:[
      {do:`Both players play their dominant strategy Defect.`, why:`At a Nash equilibrium each best-responds; dominant strategies always are best responses.`},
      {do:`The outcome is (Defect, Defect) with payoff $(-2,-2)$.`, why:`Reading that cell from the matrix.`}],
    answer:`$(Defect,\\ Defect)\\ at\\ (-2,-2).$` },

  { q:`<p>In the prisoner's dilemma, (Cooperate, Cooperate) pays $(-1,-1)$, better than the Nash $(-2,-2)$. Why isn't (C,C) a Nash equilibrium?</p>`,
    steps:[
      {do:`From (C,C), A can switch to Defect and get $0 &gt; -1$.`, why:`A profitable unilateral deviation exists.`},
      {do:`So a player gains by deviating alone.`, why:`Nash requires no player can improve by switching unilaterally.`}],
    answer:`$Not\\ Nash:\\ each\\ can\\ deviate\\ to\\ gain.$` },

  { q:`<p>Find all pure-strategy Nash equilibria. A's payoffs by cell (rows Up/Down, cols Left/Right): UL$=3$, UR$=0$, DL$=0$, DR$=2$; B's: UL$=2$, UR$=0$, DL$=0$, DR$=3$ (a coordination game).</p>`,
    steps:[
      {do:`A's best response: to Left, $3&gt;0$→Up; to Right, $2&gt;0$→Down.`, why:`Pick A's higher payoff in each column.`},
      {do:`B's best response: to Up, $2&gt;0$→Left; to Down, $3&gt;0$→Right.`, why:`Pick B's higher payoff in each row.`},
      {do:`(Up,Left) and (Down,Right) are mutual best responses.`, why:`Both players best-respond, so neither deviates.`}],
    answer:`$Two\\ pure\\ Nash:\\ (Up,Left),\\ (Down,Right).$` },

  { q:`<p>Matching pennies (zero-sum): A wins $+1$ if pennies match, loses $-1$ if not. By symmetry the mixed Nash has each play Heads with probability $p$. Find $p$.</p>`,
    steps:[
      {do:`At equilibrium A is indifferent between Heads and Tails given B's mix $p$.`, why:`A mixed strategy is optimal only when the played pure strategies tie.`},
      {do:`A's Heads payoff $= p(+1) + (1-p)(-1) = 2p - 1$; Tails $= p(-1)+(1-p)(+1) = 1 - 2p$.`, why:`Compute each pure payoff against B's mix.`},
      {do:`Set equal: $2p - 1 = 1 - 2p \\Rightarrow 4p = 2 \\Rightarrow p = 1/2$.`, why:`Indifference pins the equilibrium mix.`}],
    answer:`$p = 1/2.$` },

  { q:`<p>What is the value of the matching-pennies game (A's expected payoff) at the mixed equilibrium $p = 1/2$?</p>`,
    steps:[
      {do:`Plug $p = 1/2$ into A's Heads payoff $2p - 1$.`, why:`At equilibrium both pure payoffs equal the game value.`},
      {do:`$= 2(0.5) - 1 = 0$.`, why:`A symmetric zero-sum game has value 0.`}],
    answer:`$Value = 0.$` },

  { q:`<p>A plays Up with probability $q$ and Down with $1-q$. Against B's pure "Left", A's row payoffs are Up $=4$, Down $=1$. Express A's expected payoff in $q$, then its value at $q = 0.25$.</p>`,
    steps:[
      {do:`Expected payoff $= q(4) + (1-q)(1) = 4q + 1 - q = 3q + 1$.`, why:`Weight each pure payoff by its probability.`},
      {do:`At $q = 0.25$: $3(0.25) + 1 = 0.75 + 1 = 1.75$.`, why:`Substitute the probability.`}],
    answer:`$3q+1;\\ at\\ q=0.25\\ it\\ is\\ 1.75.$` },

  { q:`<p>The minimax theorem says $\\max_{\\pi_A}\\min_{\\pi_B} V = \\min_{\\pi_B}\\max_{\\pi_A} V$ for zero-sum games. Which inequality holds for <i>any</i> game (weak duality)?</p>`,
    steps:[
      {do:`The first mover reveals its plan and can be exploited.`, why:`More information for the second mover can only help.`},
      {do:`So $\\max_{\\pi_A}\\min_{\\pi_B} V \\le \\min_{\\pi_B}\\max_{\\pi_A} V$.`, why:`The player who moves second does at least as well.`}],
    answer:`$\\max_{\\pi_A}\\min_{\\pi_B} V \\le \\min_{\\pi_B}\\max_{\\pi_A} V.$` },

  { q:`<p>B mixes Left with probability $r$, Right with $1-r$. A's payoff to Up is $r(2) + (1-r)(6)$ and to Down is $r(5)+(1-r)(3)$. Find $r$ making A indifferent.</p>`,
    steps:[
      {do:`Up payoff $= 2r + 6 - 6r = 6 - 4r$; Down payoff $= 5r + 3 - 3r = 3 + 2r$.`, why:`Simplify each linear expression.`},
      {do:`Set equal: $6 - 4r = 3 + 2r \\Rightarrow 3 = 6r \\Rightarrow r = 0.5$.`, why:`Indifference fixes B's equilibrium mix.`}],
    answer:`$r = 0.5.$` },

  { q:`<p>Using $r = 0.5$ from the previous problem, compute A's equilibrium expected payoff (the game value via A's Up payoff $6 - 4r$).</p>`,
    steps:[
      {do:`Up payoff $= 6 - 4(0.5) = 6 - 2 = 4$.`, why:`At the indifference point both pure payoffs equal the value.`},
      {do:`So the game value to A is $4$.`, why:`Either expression gives the same number at equilibrium.`}],
    answer:`$Value = 4.$` },

  { q:`<p>A strategy is strictly dominated if another always does better. A's payoffs against B's only column: Up $4$, Middle $1$, Down $3$. Which row is strictly dominated by Up?</p>`,
    steps:[
      {do:`Compare Middle to Up: $1 &lt; 4$ in this column.`, why:`Up gives a strictly higher payoff than Middle.`},
      {do:`So Middle is strictly dominated by Up and can be removed.`, why:`A rational A never plays a strictly dominated strategy.`}],
    answer:`$Middle\\ is\\ strictly\\ dominated.$` },

  { q:`<p>Stag hunt: both Hunt Stag $(3,3)$; both Hunt Hare $(1,1)$; mismatched Stag/Hare $(0,1)$. Find the pure Nash equilibria.</p>`,
    steps:[
      {do:`From (Stag,Stag): switching to Hare gives $1 &lt; 3$ — no gain.`, why:`Neither wants to deviate, so it is Nash.`},
      {do:`From (Hare,Hare): switching to Stag gives $0 &lt; 1$ — no gain.`, why:`Neither wants to deviate, so it is also Nash.`},
      {do:`Both (Stag,Stag) and (Hare,Hare) are pure Nash.`, why:`Coordination games can have multiple equilibria.`}],
    answer:`$(Stag,Stag)\\ and\\ (Hare,Hare).$` },

  { q:`<p>Zero-sum saddle point: A's row minima are Up $=2$, Down $=-1$; column maxima are Left $=5$, Right $=2$. Entry at (Up,Right) is $2$. Is it a saddle (pure Nash)?</p>`,
    steps:[
      {do:`Maximin (best row min) $= \\max(2,-1) = 2$ at Up.`, why:`A guarantees at least its largest row minimum.`},
      {do:`Minimax (best column max) $= \\min(5,2) = 2$ at Right.`, why:`B holds A to its smallest column maximum.`},
      {do:`Maximin $=$ minimax $= 2$ at (Up,Right).`, why:`Equal values at the same cell make it a saddle point / pure Nash.`}],
    answer:`$Yes,\\ saddle\\ point\\ with\\ value\\ 2.$` },

  { q:`<p>A mixes (Up, Down) with $(0.5, 0.5)$; B mixes (Left, Right) with $(0.5, 0.5)$. A's payoff entries: UL$=1$, UR$=3$, DL$=5$, DR$=-1$. Compute A's expected payoff.</p>`,
    steps:[
      {do:`Each cell has probability $0.5 \\times 0.5 = 0.25$.`, why:`Independent mixing multiplies the marginal probabilities.`},
      {do:`Expected payoff $= 0.25(1 + 3 + 5 - 1)$.`, why:`Average the four equally weighted cell payoffs.`},
      {do:`$= 0.25 \\times 8 = 2$.`, why:`Sum is 8; one quarter is 2.`}],
    answer:`$Expected\\ payoff = 2.$` },

  { q:`<p>Bertrand competition: two firms set price; each best-responds by undercutting until price hits marginal cost $c = 10$. What is the Nash-equilibrium price and the profit margin?</p>`,
    steps:[
      {do:`Each firm undercuts as long as price exceeds cost to capture the market.`, why:`Best response to any price above $c$ is to set just below it.`},
      {do:`Undercutting stops only at price $= c = 10$.`, why:`Below cost a firm loses money, so it will not go lower.`},
      {do:`Margin $= \\text{price} - c = 10 - 10 = 0$.`, why:`Competition drives margins to zero — the Bertrand paradox.`}],
    answer:`$Price = 10,\\ margin = 0.$` }
]);

/* ===================================================================
   aix-variable-elimination — g(A,C) = sum_B f1(A,B) f2(B,C)
   =================================================================== */
add("aix-variable-elimination", [
  { q:`<p>A factor $f(B)$ has $f(0) = 3$, $f(1) = 5$. Marginalize (sum out) $B$ to get $\\sum_B f(B)$.</p>`,
    steps:[
      {do:`$\\sum_B f(B) = f(0) + f(1) = 3 + 5$.`, why:`Summing out a variable adds over all its values.`},
      {do:`$= 8$.`, why:`The result is a constant factor with no variables.`}],
    answer:`$8$` },

  { q:`<p>Multiply two single-variable factors: $f_1(B{=}0)=2$, $f_1(B{=}1)=3$ and $f_2(B{=}0)=4$, $f_2(B{=}1)=1$. Give the product factor $h(B) = f_1(B)f_2(B)$.</p>`,
    steps:[
      {do:`$h(0) = f_1(0) f_2(0) = 2 \\times 4 = 8$.`, why:`Factor product multiplies matching entries.`},
      {do:`$h(1) = f_1(1) f_2(1) = 3 \\times 1 = 3$.`, why:`Same rule for $B=1$.`}],
    answer:`$h(0)=8,\\ h(1)=3.$` },

  { q:`<p>Chain $A - f_1 - B - f_2 - C$. Given $f_1(0,0)=2$, $f_1(0,1)=1$, $f_2(0,0)=1$, $f_2(1,0)=3$. Compute $g(0,0) = \\sum_B f_1(0,B)\\,f_2(B,0)$.</p>`,
    steps:[
      {do:`$g(0,0) = f_1(0,0)f_2(0,0) + f_1(0,1)f_2(1,0)$.`, why:`Sum the product over both values of $B$.`},
      {do:`$= 2\\times1 + 1\\times3 = 2 + 3$.`, why:`Multiply matching $B$ entries, then add.`},
      {do:`$= 5$.`, why:`The eliminated factor's $(A{=}0,C{=}0)$ entry.`}],
    answer:`$g(0,0) = 5$` },

  { q:`<p>With $f_1(1,0)=1$, $f_1(1,1)=3$, $f_2(0,1)=2$, $f_2(1,1)=1$, compute $g(1,1) = \\sum_B f_1(1,B)\\,f_2(B,1)$.</p>`,
    steps:[
      {do:`$g(1,1) = f_1(1,0)f_2(0,1) + f_1(1,1)f_2(1,1)$.`, why:`Sum over $B \\in \\{0,1\\}$.`},
      {do:`$= 1\\times2 + 3\\times1 = 2 + 3 = 5$.`, why:`Multiply matched entries and add.`}],
    answer:`$g(1,1) = 5$` },

  { q:`<p>Full tables: $f_1$: $f_1(0,0)=2, f_1(0,1)=1, f_1(1,0)=1, f_1(1,1)=3$. $f_2$: $f_2(0,0)=1, f_2(0,1)=2, f_2(1,0)=3, f_2(1,1)=1$. Compute $g(0,1) = \\sum_B f_1(0,B)f_2(B,1)$.</p>`,
    steps:[
      {do:`$g(0,1) = f_1(0,0)f_2(0,1) + f_1(0,1)f_2(1,1)$.`, why:`Fix $A=0,C=1$ and sum over $B$.`},
      {do:`$= 2\\times2 + 1\\times1 = 4 + 1$.`, why:`Multiply matched entries.`},
      {do:`$= 5$.`, why:`The $(0,1)$ entry of $g$.`}],
    answer:`$g(0,1) = 5$` },

  { q:`<p>Same tables: compute $g(1,0) = \\sum_B f_1(1,B)f_2(B,0)$ with $f_1(1,0)=1, f_1(1,1)=3$, $f_2(0,0)=1, f_2(1,0)=3$.</p>`,
    steps:[
      {do:`$g(1,0) = f_1(1,0)f_2(0,0) + f_1(1,1)f_2(1,0)$.`, why:`Sum over $B$ with $A=1,C=0$ fixed.`},
      {do:`$= 1\\times1 + 3\\times3 = 1 + 9 = 10$.`, why:`Multiply and add.`}],
    answer:`$g(1,0) = 10$` },

  { q:`<p>Why may a sum be pushed past a factor? Given $\\sum_B f_1(A,B)f_2(B,C)h(A)$, where does $h(A)$ go?</p>`,
    steps:[
      {do:`$h(A)$ does not contain $B$, so it is constant w.r.t. the sum over $B$.`, why:`The distributive law lets constants factor out of a sum.`},
      {do:`$\\sum_B f_1 f_2 h(A) = h(A)\\sum_B f_1(A,B)f_2(B,C)$.`, why:`Only factors mentioning $B$ stay inside the sum.`}],
    answer:`$h(A)\\sum_B f_1(A,B)f_2(B,C).$` },

  { q:`<p>A normalized query needs $P(A) = g(A) / \\sum_{A'} g(A')$. Given $g(0) = 6$, $g(1) = 2$, compute $P(A=0)$.</p>`,
    steps:[
      {do:`Normalizer $Z = g(0) + g(1) = 6 + 2 = 8$.`, why:`Sum the unnormalized factor over all values.`},
      {do:`$P(A=0) = 6/8 = 0.75$.`, why:`Divide by $Z$ to make the factor a distribution.`}],
    answer:`$P(A=0) = 0.75$` },

  { q:`<p>Cost comparison. A chain of $n = 10$ binary variables: brute force sums the full joint ($2^{10}$ terms); chain elimination costs about $n \\cdot 2^2$. Give both counts.</p>`,
    steps:[
      {do:`Brute force: $2^{10} = 1024$ terms.`, why:`Summing the full joint over all variables at once.`},
      {do:`Elimination on a chain: $\\approx 10 \\times 4 = 40$ operations.`, why:`Each step sums out one variable touching a small intermediate factor of size $2^2$.`}],
    answer:`$1024\\ vs\\ \\approx 40.$` },

  { q:`<p>Eliminate $B$ from a product factor $f(A,B,C)$ to get $g(A,C) = \\sum_B f(A,B,C)$. If $f(0,0,1)=4$ and $f(0,1,1)=6$, compute $g(0,1)$.</p>`,
    steps:[
      {do:`$g(0,1) = \\sum_B f(0,B,1) = f(0,0,1) + f(0,1,1)$.`, why:`Sum over $B$ holding $A=0,C=1$ fixed.`},
      {do:`$= 4 + 6 = 10$.`, why:`Add the two $B$-entries.`}],
    answer:`$g(0,1) = 10$` },

  { q:`<p>Pointwise product over a shared variable. $f_1(A) = [2, 3]$ (for $A=0,1$) and $f_2(A) = [5, 1]$. Compute the product factor and then $\\sum_A$ of it.</p>`,
    steps:[
      {do:`Product: $h(0) = 2\\times5 = 10$, $h(1) = 3\\times1 = 3$.`, why:`Multiply matching entries of the two factors.`},
      {do:`$\\sum_A h(A) = 10 + 3 = 13$.`, why:`Sum out $A$ to get a scalar.`}],
    answer:`$h=[10,3],\\ \\sum_A h = 13.$` },

  { q:`<p>Eliminating a variable with $3$ binary neighbours creates a factor over those $3$ variables. What is that intermediate factor's number of entries?</p>`,
    steps:[
      {do:`The new factor covers the eliminated variable's neighbours.`, why:`Summing out a variable produces a factor over its remaining neighbours.`},
      {do:`$3$ binary neighbours → $2^3 = 8$ entries.`, why:`A factor over $k$ binary variables has $2^k$ entries.`}],
    answer:`$2^3 = 8\\ entries.$` },

  { q:`<p>Marginalize a joint $P(A,B)$ to $P(A)$. Given $P(0,0)=0.1, P(0,1)=0.3, P(1,0)=0.4, P(1,1)=0.2$, compute $P(A=0)$ and $P(A=1)$.</p>`,
    steps:[
      {do:`$P(A=0) = \\sum_B P(0,B) = 0.1 + 0.3 = 0.4$.`, why:`Marginalize by summing out $B$.`},
      {do:`$P(A=1) = 0.4 + 0.2 = 0.6$.`, why:`Same for $A=1$.`}],
    answer:`$P(A=0)=0.4,\\ P(A=1)=0.6.$` },

  { q:`<p>Eliminate $C$ from $g(A,C)$ with $g(1,0)=10$ and $g(1,1)=2$ to compute $g'(A=1) = \\sum_C g(1,C)$.</p>`,
    steps:[
      {do:`$g'(1) = g(1,0) + g(1,1) = 10 + 2$.`, why:`Sum out $C$ from the factor over $(A,C)$.`},
      {do:`$= 12$.`, why:`Add the two $C$-entries for $A=1$.`}],
    answer:`$g'(A=1) = 12$` },

  { q:`<p>Treewidth bounds elimination cost: it is the largest intermediate factor's scope minus one. If the largest factor covers $4$ variables, what is the treewidth?</p>`,
    steps:[
      {do:`Largest factor scope $= 4$ variables.`, why:`Cost is dominated by the biggest table created.`},
      {do:`Treewidth $= 4 - 1 = 3$.`, why:`Treewidth is the max clique size minus one.`}],
    answer:`$Treewidth = 3.$` },

  { q:`<p>Compute a 3-way factor product entry. $f_1(A,B)$ has $f_1(1,1)=2$; $f_2(B,C)$ has $f_2(1,0)=3$; both share $B=1$. What is their product's $(A{=}1,B{=}1,C{=}0)$ entry?</p>`,
    steps:[
      {do:`Product entry $= f_1(1,1) \\times f_2(1,0)$.`, why:`Factor product multiplies entries that agree on shared variables ($B=1$).`},
      {do:`$= 2 \\times 3 = 6$.`, why:`Multiply the two matching values.`}],
    answer:`$6$` },

  { q:`<p>After eliminating all hidden variables, the query factor over $A$ is $g(0)=12$, $g(1)=8$. Report the posterior $P(A=1 \\mid \\text{evidence})$.</p>`,
    steps:[
      {do:`Normalizer $Z = 12 + 8 = 20$.`, why:`Sum the unnormalized query factor.`},
      {do:`$P(A=1) = 8/20 = 0.4$.`, why:`Normalize to a probability.`}],
    answer:`$P(A=1) = 0.4$` }
]);

/* ===================================================================
   aix-gibbs-particle — sampling, count/N, conditionals, particle weights
   =================================================================== */
add("aix-gibbs-particle", [
  { q:`<p>Out of $200$ samples, $50$ have $X = \\text{true}$. Estimate $P(X = \\text{true} \\mid \\text{evidence})$.</p>`,
    steps:[
      {do:`$\\hat P = \\frac{\\#\\{X=\\text{true}\\}}{N} = \\frac{50}{200}$.`, why:`A probability is estimated by the fraction of samples with that value.`},
      {do:`$= 0.25$.`, why:`Divide count by total.`}],
    answer:`$\\hat P = 0.25$` },

  { q:`<p>Ten samples of a 3-state variable give states $2,2,2,1,2,3,3,2,2,3$. Estimate $\\hat P(\\text{state}=2)$.</p>`,
    steps:[
      {do:`Count state 2: it appears $6$ times.`, why:`Tally how many samples equal 2.`},
      {do:`$\\hat P(2) = 6/10 = 0.6$.`, why:`Fraction of samples in state 2.`}],
    answer:`$\\hat P(2) = 0.6$` },

  { q:`<p>From the same samples $2,2,2,1,2,3,3,2,2,3$, estimate $\\hat P(\\text{state}=1)$ and $\\hat P(\\text{state}=3)$.</p>`,
    steps:[
      {do:`State 1 appears once: $\\hat P(1) = 1/10 = 0.1$.`, why:`Count over total.`},
      {do:`State 3 appears three times: $\\hat P(3) = 3/10 = 0.3$.`, why:`Count over total.`}],
    answer:`$\\hat P(1)=0.1,\\ \\hat P(3)=0.3.$` },

  { q:`<p>To draw from the categorical $[0.2, 0.5, 0.3]$ with a uniform $u = 0.6$ via cumulative thresholds, which state is selected?</p>`,
    steps:[
      {do:`Cumulative sums: state 1 up to $0.2$, state 2 up to $0.7$, state 3 up to $1.0$.`, why:`Inverse-CDF sampling compares $u$ to running totals.`},
      {do:`$0.2 &lt; u = 0.6 \\le 0.7$, so pick state 2.`, why:`$u$ falls in state 2's cumulative interval.`}],
    answer:`$State\\ 2.$` },

  { q:`<p>Gibbs resamples one variable from $P(X_i \\mid X_{-i})$. Given the unnormalized conditional scores $[\\text{false}: 2,\\ \\text{true}: 6]$, what is the normalized $P(X_i = \\text{true} \\mid X_{-i})$?</p>`,
    steps:[
      {do:`Normalizer $= 2 + 6 = 8$.`, why:`Sum the unnormalized scores.`},
      {do:`$P(\\text{true}) = 6/8 = 0.75$.`, why:`Divide the true score by the total.`}],
    answer:`$0.75$` },

  { q:`<p>A particle filter weights each particle by the observation likelihood. Three particles have likelihoods $0.1, 0.3, 0.6$. Compute their normalized weights.</p>`,
    steps:[
      {do:`Sum: $0.1 + 0.3 + 0.6 = 1.0$.`, why:`Normalize weights so they sum to 1.`},
      {do:`Weights: $0.1, 0.3, 0.6$.`, why:`Each is its likelihood divided by the sum (here the sum is already 1).`}],
    answer:`$w = [0.1,\\ 0.3,\\ 0.6].$` },

  { q:`<p>Particle weights before normalization are $4, 2, 2$. Normalize them.</p>`,
    steps:[
      {do:`Sum $= 4 + 2 + 2 = 8$.`, why:`Total weight for normalization.`},
      {do:`Normalized: $4/8, 2/8, 2/8 = 0.5, 0.25, 0.25$.`, why:`Divide each weight by the sum.`}],
    answer:`$[0.5,\\ 0.25,\\ 0.25].$` },

  { q:`<p>Why does the empirical histogram of samples converge to the true posterior $[0.2, 0.5, 0.3]$? Justify in two steps.</p>`,
    steps:[
      {do:`$P(X=x) = \\mathbb{E}[\\mathbf{1}\\{X=x\\}]$.`, why:`Any probability is the expectation of its indicator.`},
      {do:`The sample fraction is the mean of the indicator, which converges to its expectation by the law of large numbers.`, why:`Sample means approach the true expectation as $N$ grows.`}],
    answer:`$Fraction \\to \\mathbb{E}[\\mathbf{1}] = P(X=x).$` },

  { q:`<p>Gibbs is cheap because $P(X_i \\mid X_{-i})$ depends only on $X_i$'s Markov blanket. If $X_i$ has $5$ blanket neighbours out of $1000$ variables, how many variables must you inspect to resample $X_i$?</p>`,
    steps:[
      {do:`The conditional factorizes over the Markov blanket only.`, why:`Everything outside the blanket cancels in the conditional.`},
      {do:`So you inspect just $5$ variables, not all $1000$.`, why:`Locality makes each Gibbs step cheap.`}],
    answer:`$5\\ variables.$` },

  { q:`<p>Effective sample size after weighting is $\\text{ESS} = 1 / \\sum w_i^2$. With normalized weights $[0.9, 0.05, 0.05]$, compute it.</p>`,
    steps:[
      {do:`$\\sum w_i^2 = 0.9^2 + 0.05^2 + 0.05^2 = 0.81 + 0.0025 + 0.0025 = 0.815$.`, why:`Sum of squared normalized weights.`},
      {do:`$\\text{ESS} = 1 / 0.815 \\approx 1.23$.`, why:`Near 1 means one particle dominates — degeneracy.`}],
    answer:`$ESS \\approx 1.23.$` },

  { q:`<p>Resampling picks particles in proportion to weight. With normalized weights $[0.5, 0.25, 0.25]$ and $4$ resampled slots, roughly how many copies of particle 1 do we expect?</p>`,
    steps:[
      {do:`Expected copies $= w_1 \\times N = 0.5 \\times 4$.`, why:`Resampling draws each particle proportional to its weight.`},
      {do:`$= 2$.`, why:`Particle 1 carries half the weight, so about 2 of 4 slots.`}],
    answer:`$\\approx 2\\ copies.$` },

  { q:`<p>Importance sampling: a particle's weight multiplies by $P(\\text{obs} \\mid \\text{particle})$. A particle has weight $0.2$ and observation likelihood $0.4$ under it. Its new (unnormalized) weight?</p>`,
    steps:[
      {do:`New weight $= 0.2 \\times 0.4$.`, why:`Multiply the prior weight by the observation likelihood.`},
      {do:`$= 0.08$.`, why:`Particles explaining the data poorly lose weight.`}],
    answer:`$0.08$` },

  { q:`<p>With $1000$ samples, state $A$ appears $230$ times. Estimate $P(A)$ and state how the Monte Carlo error scales with $N$.</p>`,
    steps:[
      {do:`$\\hat P(A) = 230/1000 = 0.23$.`, why:`Empirical fraction.`},
      {do:`Standard error scales as $1/\\sqrt{N}$.`, why:`Sampling error shrinks like the inverse square root of sample count.`}],
    answer:`$\\hat P(A)=0.23;\\ error \\sim 1/\\sqrt{N}.$` },

  { q:`<p>A Gibbs chain needs burn-in. If you run $1000$ iterations and discard the first $200$ as burn-in, how many samples remain for estimation?</p>`,
    steps:[
      {do:`Discard burn-in: $1000 - 200 = 800$.`, why:`Early samples are not yet from the stationary distribution.`},
      {do:`$800$ post-burn-in samples are used.`, why:`Only stationary-phase samples estimate the posterior correctly.`}],
    answer:`$800\\ samples.$` },

  { q:`<p>Two-variable Gibbs: $P(X \\mid Y=0)$ is proportional to $[X{=}0:1,\\ X{=}1:3]$. With $u = 0.5$ drawn uniformly, which $X$ is sampled (state 0 covers $[0,0.25)$, state 1 covers $[0.25,1)$)?</p>`,
    steps:[
      {do:`Normalize: $P(X{=}0) = 1/4 = 0.25$, $P(X{=}1) = 3/4 = 0.75$.`, why:`Divide each score by the total 4.`},
      {do:`$u = 0.5 \\ge 0.25$, so $X = 1$.`, why:`$u$ falls past the state-0 interval into state 1.`}],
    answer:`$X = 1.$` },

  { q:`<p>Estimate a marginal by summing sampled joint counts. Of $400$ samples, $(X{=}1, Y{=}1)$ occurs $80$ times and $(X{=}1, Y{=}0)$ occurs $120$ times. Estimate $\\hat P(X=1)$.</p>`,
    steps:[
      {do:`Count all samples with $X=1$: $80 + 120 = 200$.`, why:`Marginalize $Y$ by summing over its values.`},
      {do:`$\\hat P(X=1) = 200/400 = 0.5$.`, why:`Fraction of samples with $X=1$.`}],
    answer:`$\\hat P(X=1) = 0.5$` }
]);

/* ===================================================================
   aix-markov-blanket — parents + children + co-parents; independence
   =================================================================== */
add("aix-markov-blanket", [
  { q:`<p>Node $X$ has parents $\\{P_1, P_2\\}$, children $\\{C_1, C_2\\}$, and $C_2$'s other parent is $\\text{CP}$. List the Markov blanket $\\text{MB}(X)$.</p>`,
    steps:[
      {do:`Parents: $P_1, P_2$.`, why:`Parents directly influence $X$, so they belong to the blanket.`},
      {do:`Children: $C_1, C_2$.`, why:`Children are influenced by $X$; knowing them tells you about $X$.`},
      {do:`Co-parent: $\\text{CP}$.`, why:`A child's other parent couples to $X$ via explaining away.`}],
    answer:`$\\text{MB}(X) = \\{P_1, P_2, C_1, C_2, \\text{CP}\\}.$` },

  { q:`<p>Node $Y$ has parent $\\{A\\}$, one child $Z$, and $Z$'s other parent is $W$. List $\\text{MB}(Y)$.</p>`,
    steps:[
      {do:`Parent $A$, child $Z$.`, why:`Parents and children are always in the blanket.`},
      {do:`Co-parent $W$ (other parent of $Z$).`, why:`Conditioning on child $Z$ opens the path to $W$.`}],
    answer:`$\\text{MB}(Y) = \\{A, Z, W\\}.$` },

  { q:`<p>A node $N$ has no children and parents $\\{P\\}$ only. What is its Markov blanket?</p>`,
    steps:[
      {do:`No children means no co-parents either.`, why:`Co-parents only arise through shared children.`},
      {do:`So $\\text{MB}(N) = \\{P\\}$.`, why:`Only the parent remains.`}],
    answer:`$\\text{MB}(N) = \\{P\\}.$` },

  { q:`<p>Given the Markov blanket, $X$ is independent of all other variables. Write this as a conditional-independence statement.</p>`,
    steps:[
      {do:`Let Rest be all variables outside $X$ and its blanket.`, why:`These are the nodes the blanket shields $X$ from.`},
      {do:`$X \\perp \\text{Rest} \\mid \\text{MB}(X)$.`, why:`Conditioning on the blanket makes $X$ independent of the rest.`}],
    answer:`$X \\perp \\text{Rest} \\mid \\text{MB}(X).$` },

  { q:`<p>Why must children be in the blanket even though $X$ does not point to <i>their</i> parents? Explain via information flow.</p>`,
    steps:[
      {do:`Knowing a child's value gives evidence about its cause $X$.`, why:`Information flows backward up an arrow from effect to cause.`},
      {do:`So children carry information about $X$ and must be in the blanket.`, why:`Leaving them out would let outside evidence (through them) reach $X$.`}],
    answer:`$Children\\ leak\\ info\\ about\\ X,\\ so\\ they\\ are\\ in\\ MB.$` },

  { q:`<p>Why can't co-parents be dropped? A child is a collider $X \\to C \\leftarrow \\text{CP}$. What happens when $C$ is observed?</p>`,
    steps:[
      {do:`Observing the collider $C$ opens the path between $X$ and $\\text{CP}$.`, why:`Conditioning on a collider creates a dependence (explaining away).`},
      {do:`So $X$ and $\\text{CP}$ become dependent given $C$, and $\\text{CP}$ must join the blanket.`, why:`Otherwise the blanket would not seal $X$ from outside influence.`}],
    answer:`$Observing\\ C\\ couples\\ X\\ and\\ CP,\\ so\\ CP \\in MB.$` },

  { q:`<p>From the factored joint $P(\\text{all}) = \\prod_i P(X_i \\mid \\text{Parents}(i))$, which two kinds of factors contain $X$?</p>`,
    steps:[
      {do:`(1) $X$'s own term $P(X \\mid \\text{Parents}(X))$.`, why:`Brings in $X$ and its parents.`},
      {do:`(2) Each child's term $P(C \\mid \\text{Parents}(C))$ where $X$ is a parent.`, why:`Brings in the child and the child's co-parents.`}],
    answer:`$X\\text{'s own factor and each child's factor.}$` },

  { q:`<p>In a chain $A \\to B \\to C \\to D$, what is the Markov blanket of $C$?</p>`,
    steps:[
      {do:`Parent of $C$: $B$.`, why:`$B$ points into $C$.`},
      {do:`Child of $C$: $D$.`, why:`$C$ points into $D$.`},
      {do:`$D$ has no other parent, so no co-parents.`, why:`In a simple chain each node has a single parent.`}],
    answer:`$\\text{MB}(C) = \\{B, D\\}.$` },

  { q:`<p>In the chain $A \\to B \\to C \\to D$, with $\\text{MB}(C) = \\{B, D\\}$, what is the relationship between $C$ and the outside node $A$ given the blanket?</p>`,
    steps:[
      {do:`Given $B$ and $D$, the blanket shields $C$ from everything else.`, why:`That is the defining property of the Markov blanket.`},
      {do:`$A$ is outside the blanket, so $C \\perp A \\mid \\{B, D\\}$.`, why:`Outside nodes are independent of $C$ given its blanket.`}],
    answer:`$C \\perp A \\mid \\{B, D\\}.$` },

  { q:`<p>Feature selection: the Markov blanket of a target $T$ is the minimal optimal feature set. If $\\text{MB}(T) = \\{F_1, F_3, F_7\\}$ out of 100 features, how many features are needed for optimal prediction?</p>`,
    steps:[
      {do:`Given the blanket, $T$ is independent of all other features.`, why:`Features outside the blanket add no predictive information about $T$.`},
      {do:`So only the $3$ blanket features are needed.`, why:`The blanket is the minimal sufficient feature set.`}],
    answer:`$3\\ features.$` },

  { q:`<p>$X$ has two children $C_1, C_2$; $C_1$ has co-parent $W_1$ and $C_2$ has co-parents $W_2, W_3$. With parents $\\{P\\}$, give $|\\text{MB}(X)|$.</p>`,
    steps:[
      {do:`Parents: $\\{P\\}$ — 1.`, why:`Count the parents.`},
      {do:`Children: $\\{C_1, C_2\\}$ — 2.`, why:`Count the children.`},
      {do:`Co-parents: $\\{W_1, W_2, W_3\\}$ — 3.`, why:`All other parents of $X$'s children.`}],
    answer:`$|\\text{MB}(X)| = 1 + 2 + 3 = 6.$` },

  { q:`<p>Two nodes $X$ and $Z$ share a child $C$ (each is the other's co-parent). Is $X \\in \\text{MB}(Z)$?</p>`,
    steps:[
      {do:`$X$ is a parent of $C$, and $C$ is a child of $Z$, so $X$ is $Z$'s co-parent.`, why:`Co-parents are other parents of one's children.`},
      {do:`Therefore $X \\in \\text{MB}(Z)$.`, why:`Co-parents belong to the Markov blanket.`}],
    answer:`$Yes,\\ X \\in \\text{MB}(Z).$` },

  { q:`<p>Naive Bayes structure: class $Y$ is the single parent of features $F_1, F_2, F_3$. What is $\\text{MB}(F_1)$?</p>`,
    steps:[
      {do:`$F_1$'s only parent is $Y$.`, why:`The class is the sole parent of each feature.`},
      {do:`$F_1$ has no children, hence no co-parents.`, why:`Features are leaf nodes.`}],
    answer:`$\\text{MB}(F_1) = \\{Y\\}.$` },

  { q:`<p>In that naive-Bayes net, what is the Markov blanket of the class $Y$?</p>`,
    steps:[
      {do:`$Y$ has no parents.`, why:`The class is the root.`},
      {do:`Its children are the features $F_1, F_2, F_3$; they share no co-parents (only $Y$ is parent).`, why:`Each feature's sole parent is $Y$ itself.`}],
    answer:`$\\text{MB}(Y) = \\{F_1, F_2, F_3\\}.$` },

  { q:`<p>Gibbs resamples $X$ using only $P(X \\mid \\text{MB}(X))$. If a network has $10{,}000$ nodes but $\\text{MB}(X)$ has $4$ nodes, what fraction of the network is touched per resample of $X$?</p>`,
    steps:[
      {do:`Only the $4$ blanket nodes enter the conditional.`, why:`Everything outside cancels.`},
      {do:`Fraction $= 4 / 10000 = 0.0004$.`, why:`Locality makes inference scalable on huge graphs.`}],
    answer:`$0.0004\\ (4\\ of\\ 10{,}000).$` },

  { q:`<p>Node $X$ has parents $\\{A, B\\}$, child $\\{C\\}$, and $C$'s other parents are $\\{A, D\\}$ (so $A$ is both a parent and a co-parent). List $\\text{MB}(X)$ without duplicates.</p>`,
    steps:[
      {do:`Parents: $A, B$. Child: $C$. Co-parents of $C$: $A, D$.`, why:`Collect all three groups.`},
      {do:`Union, removing the duplicate $A$: $\\{A, B, C, D\\}$.`, why:`The blanket is a set, so $A$ counts once.`}],
    answer:`$\\text{MB}(X) = \\{A, B, C, D\\}.$` }
]);

/* ===================================================================
   aix-forward-backward — alpha, beta, smoothed posterior alpha*beta
   =================================================================== */
add("aix-forward-backward", [
  { q:`<p>At step $i$, forward $\\alpha_i = [0.6, 0.2]$ and backward $\\beta_i = [0.5, 1.0]$ over hidden states $\\{1,2\\}$. Compute the unnormalized products $\\alpha_i \\cdot \\beta_i$ elementwise.</p>`,
    steps:[
      {do:`State 1: $0.6 \\times 0.5 = 0.30$.`, why:`Smoothed posterior is proportional to $\\alpha \\cdot \\beta$ elementwise.`},
      {do:`State 2: $0.2 \\times 1.0 = 0.20$.`, why:`Multiply forward and backward messages per state.`}],
    answer:`$[0.30,\\ 0.20].$` },

  { q:`<p>Normalize $[0.30, 0.20]$ to get the smoothed posterior $P(H_i \\mid E)$.</p>`,
    steps:[
      {do:`Normalizer $= 0.30 + 0.20 = 0.50$.`, why:`The posterior must sum to 1.`},
      {do:`$P(H_i{=}1) = 0.30/0.50 = 0.6$, $P(H_i{=}2) = 0.20/0.50 = 0.4$.`, why:`Divide each product by the total.`}],
    answer:`$P(H_i \\mid E) = [0.6,\\ 0.4].$` },

  { q:`<p>Forward $\\alpha_i = [0.4, 0.4]$, backward $\\beta_i = [1.0, 0.0]$ over states $\\{1,2\\}$. Compute the smoothed posterior.</p>`,
    steps:[
      {do:`Products: $[0.4 \\times 1.0,\\ 0.4 \\times 0.0] = [0.4, 0.0]$.`, why:`Elementwise multiply.`},
      {do:`Normalize by $0.4$: $[1.0, 0.0]$.`, why:`The backward evidence ruled out state 2.`}],
    answer:`$P(H_i \\mid E) = [1.0,\\ 0.0].$` },

  { q:`<p>Forward init: $\\alpha_1(h) = P(H_1{=}h)\\,P(E_1 \\mid h)$. With prior $[0.5, 0.5]$ and emissions $P(E_1 \\mid 1) = 0.9$, $P(E_1 \\mid 2) = 0.2$, compute $\\alpha_1$.</p>`,
    steps:[
      {do:`$\\alpha_1(1) = 0.5 \\times 0.9 = 0.45$.`, why:`Prior times emission likelihood for state 1.`},
      {do:`$\\alpha_1(2) = 0.5 \\times 0.2 = 0.10$.`, why:`Same for state 2.`}],
    answer:`$\\alpha_1 = [0.45,\\ 0.10].$` },

  { q:`<p>Forward recursion: $\\alpha_{i+1}(h') = \\big[\\sum_h \\alpha_i(h)\\,P(h' \\mid h)\\big] P(E_{i+1} \\mid h')$. Given $\\alpha_i = [0.45, 0.10]$, $P(\\text{stay})=0.7$, $P(\\text{switch})=0.3$, target $h'=1$ with emission $0.9$, compute $\\alpha_{i+1}(1)$.</p>`,
    steps:[
      {do:`Predict: $\\sum_h \\alpha_i(h) P(1 \\mid h) = 0.45(0.7) + 0.10(0.3)$.`, why:`Sum over previous states weighted by transition into state 1.`},
      {do:`$= 0.315 + 0.030 = 0.345$.`, why:`Add the two transition contributions.`},
      {do:`Reweight by emission: $0.345 \\times 0.9 = 0.3105$.`, why:`Multiply by the likelihood of the new observation.`}],
    answer:`$\\alpha_{i+1}(1) = 0.3105.$` },

  { q:`<p>Backward init at the final step: $\\beta_T(h) = 1$ for all $h$. State the backward message at the last time step for a 2-state HMM.</p>`,
    steps:[
      {do:`There are no observations after step $T$.`, why:`The future-evidence term is empty.`},
      {do:`So $\\beta_T = [1, 1]$.`, why:`An empty product equals 1 for every state.`}],
    answer:`$\\beta_T = [1,\\ 1].$` },

  { q:`<p>Backward recursion: $\\beta_i(h) = \\sum_{h'} P(h' \\mid h)\\,P(E_{i+1} \\mid h')\\,\\beta_{i+1}(h')$. Given $\\beta_{i+1} = [1,1]$, from $h=1$: $P(1\\mid1)=0.7, P(2\\mid1)=0.3$, emissions $P(E_{i+1}\\mid1)=0.9$, $P(E_{i+1}\\mid2)=0.2$. Compute $\\beta_i(1)$.</p>`,
    steps:[
      {do:`$\\beta_i(1) = P(1\\mid1)P(E\\mid1)\\beta(1) + P(2\\mid1)P(E\\mid2)\\beta(2)$.`, why:`Sum over next states of transition × emission × future message.`},
      {do:`$= 0.7(0.9)(1) + 0.3(0.2)(1) = 0.63 + 0.06$.`, why:`Plug in values.`},
      {do:`$= 0.69$.`, why:`Add the two terms.`}],
    answer:`$\\beta_i(1) = 0.69.$` },

  { q:`<p>Why does $P(H_i, E) = \\alpha_i(H_i)\\,\\beta_i(H_i)$? Split the evidence at step $i$ and use the Markov property.</p>`,
    steps:[
      {do:`$P(H_i, E) = P(E_{1:i}, H_i)\\,P(E_{i+1:T} \\mid H_i, E_{1:i})$.`, why:`Chain rule splitting past and future evidence.`},
      {do:`First factor $= \\alpha_i(H_i)$; by Markov, $P(E_{i+1:T} \\mid H_i, E_{1:i}) = P(E_{i+1:T}\\mid H_i) = \\beta_i(H_i)$.`, why:`The future depends on the past only through the current state.`}],
    answer:`$P(H_i,E) = \\alpha_i \\beta_i.$` },

  { q:`<p>Filtering uses only $\\alpha_i$. With $\\alpha_i = [0.7, 0.3]$ (already summing to 1), give the filtered estimate $P(H_i \\mid E_{1:i})$.</p>`,
    steps:[
      {do:`Normalize $\\alpha_i$: total $= 0.7 + 0.3 = 1.0$.`, why:`Filtering normalizes the forward message alone (past evidence only).`},
      {do:`$P(H_i \\mid E_{1:i}) = [0.7, 0.3]$.`, why:`Already sums to 1.`}],
    answer:`$[0.7,\\ 0.3].$` },

  { q:`<p>Now add backward evidence $\\beta_i = [0.2, 0.8]$ to $\\alpha_i = [0.7, 0.3]$. Compute the smoothed posterior and note how it differs from filtering.</p>`,
    steps:[
      {do:`Products: $[0.7 \\times 0.2,\\ 0.3 \\times 0.8] = [0.14, 0.24]$.`, why:`Elementwise multiply forward and backward.`},
      {do:`Normalize by $0.38$: $[0.14/0.38,\\ 0.24/0.38] \\approx [0.37, 0.63]$.`, why:`Future evidence flipped the belief toward state 2.`}],
    answer:`$\\approx [0.37,\\ 0.63];\\ future\\ evidence\\ reversed\\ it.$` },

  { q:`<p>The sequence likelihood is $P(E) = \\sum_h \\alpha_T(h)$. With $\\alpha_T = [0.12, 0.08]$, compute $P(E)$.</p>`,
    steps:[
      {do:`$P(E) = \\sum_h \\alpha_T(h) = 0.12 + 0.08$.`, why:`Summing the final forward message marginalizes the last hidden state.`},
      {do:`$= 0.20$.`, why:`Total probability of the observed sequence.`}],
    answer:`$P(E) = 0.20.$` },

  { q:`<p>Forward-backward is variable elimination along the chain. How many sum-out operations does a forward pass over $T = 5$ steps perform?</p>`,
    steps:[
      {do:`Each forward step sums out one previous hidden state.`, why:`The recursion eliminates $H_i$ to produce $\\alpha_{i+1}$.`},
      {do:`Over $T = 5$ steps there are $T - 1 = 4$ such transitions.`, why:`No sum-out is needed at the initial step.`}],
    answer:`$4\\ sum\\text{-}out\\ operations.$` },

  { q:`<p>$\\alpha_i = [2, 6]$ (unnormalized) and $\\beta_i = [3, 1]$. Compute the smoothed posterior $P(H_i \\mid E)$.</p>`,
    steps:[
      {do:`Products: $[2 \\times 3,\\ 6 \\times 1] = [6, 6]$.`, why:`Elementwise multiply; scale does not matter before normalizing.`},
      {do:`Normalize by $12$: $[0.5, 0.5]$.`, why:`Evidence is balanced between the two states.`}],
    answer:`$[0.5,\\ 0.5].$` },

  { q:`<p>Forward-backward is the E-step of Baum-Welch (EM). After the E-step computes smoothed posteriors, what does the M-step do with them?</p>`,
    steps:[
      {do:`The M-step re-estimates transition and emission probabilities.`, why:`It treats the smoothed posteriors as soft counts of state visits and transitions.`},
      {do:`Normalize those expected counts to get new parameters.`, why:`This maximizes the expected complete-data log-likelihood.`}],
    answer:`$Re\\text{-}estimate\\ transitions\\ and\\ emissions\\ from\\ expected\\ counts.$` },

  { q:`<p>The smoothed posterior at step $i$ is $[0.9, 0.1]$. The MAP state at $i$ is the argmax. Which hidden state is most likely?</p>`,
    steps:[
      {do:`Compare the two posteriors: $0.9 &gt; 0.1$.`, why:`The most likely state maximizes the posterior.`},
      {do:`So the MAP state is state 1.`, why:`Argmax of $[0.9,0.1]$ is index 1.`}],
    answer:`$State\\ 1.$` },

  { q:`<p>$\\alpha_i = [0.3, 0.3]$ with $\\beta_i = [0.0, 1.0]$. Compute the smoothed posterior and explain what the backward message did.</p>`,
    steps:[
      {do:`Products: $[0.3 \\times 0.0,\\ 0.3 \\times 1.0] = [0.0, 0.3]$.`, why:`Elementwise multiply.`},
      {do:`Normalize by $0.3$: $[0.0, 1.0]$.`, why:`Forward alone was tied; the future evidence forced state 2.`}],
    answer:`$[0.0,\\ 1.0];\\ backward\\ ruled\\ out\\ state\\ 1.$` }
]);

/* ===================================================================
   aix-lda-topic — topic proportions theta, P(word) = sum theta_k phi_kw
   =================================================================== */
add("aix-lda-topic", [
  { q:`<p>A document has topic mix $\\theta = [0.6, 0.4]$ over (Sports, Finance). Topic Finance gives word "bank" probability $0.5$. Compute $P(\\text{word} = \\text{"bank"} \\text{ from Finance})$.</p>`,
    steps:[
      {do:`$P = \\theta_{\\text{Fin}} \\times \\phi_{\\text{Fin,bank}} = 0.4 \\times 0.5$.`, why:`Pick the Finance topic, then emit "bank" from it.`},
      {do:`$= 0.2$.`, why:`Multiply topic probability by word-given-topic probability.`}],
    answer:`$0.2$` },

  { q:`<p>$\\theta = [0.8, 0.2]$ (Sports, Finance). For a single word slot, what is $P(Z = \\text{Sports})$?</p>`,
    steps:[
      {do:`$Z \\sim \\text{Categorical}(\\theta)$, so $P(Z=\\text{Sports}) = \\theta_{\\text{Sports}}$.`, why:`The topic is drawn from the document's topic proportions.`},
      {do:`$= 0.8$.`, why:`Read the first component of $\\theta$.`}],
    answer:`$0.8$` },

  { q:`<p>The total probability of word $w$ is $P(w) = \\sum_k \\theta_k\\,\\phi_{k,w}$. With $\\theta = [0.6, 0.4]$, $\\phi_{\\text{Sports},\\text{game}} = 0.3$, $\\phi_{\\text{Fin},\\text{game}} = 0.05$, compute $P(\\text{"game"})$.</p>`,
    steps:[
      {do:`$P = \\theta_S \\phi_{S,\\text{game}} + \\theta_F \\phi_{F,\\text{game}} = 0.6(0.3) + 0.4(0.05)$.`, why:`Sum over the two topics that could emit the word.`},
      {do:`$= 0.18 + 0.02 = 0.20$.`, why:`Add the two topic contributions.`}],
    answer:`$P(\\text{"game"}) = 0.20$` },

  { q:`<p>$\\theta$ must sum to 1. If a document is $0.7$ Sports, what is its Finance proportion in a two-topic model?</p>`,
    steps:[
      {do:`$\\theta_{\\text{Sports}} + \\theta_{\\text{Fin}} = 1$.`, why:`Topic proportions form a probability distribution.`},
      {do:`$\\theta_{\\text{Fin}} = 1 - 0.7 = 0.3$.`, why:`Complement to 1.`}],
    answer:`$\\theta_{\\text{Fin}} = 0.3$` },

  { q:`<p>Three topics with $\\theta = [0.5, 0.3, 0.2]$. The word "data" has $\\phi$ values $[0.1, 0.4, 0.2]$ across the three topics. Compute $P(\\text{"data"})$.</p>`,
    steps:[
      {do:`$P = \\sum_k \\theta_k \\phi_{k,\\text{data}} = 0.5(0.1) + 0.3(0.4) + 0.2(0.2)$.`, why:`Mixture over all three topics.`},
      {do:`$= 0.05 + 0.12 + 0.04 = 0.21$.`, why:`Add the three contributions.`}],
    answer:`$P(\\text{"data"}) = 0.21$` },

  { q:`<p>Each topic's word distribution $\\phi_k$ sums to 1. Topic Sports has $\\phi_{\\text{game}}=0.4$, $\\phi_{\\text{team}}=0.35$, and one more word "score". What is $\\phi_{\\text{score}}$?</p>`,
    steps:[
      {do:`$\\phi_{\\text{game}} + \\phi_{\\text{team}} + \\phi_{\\text{score}} = 1$.`, why:`A topic is a probability distribution over its vocabulary.`},
      {do:`$\\phi_{\\text{score}} = 1 - 0.4 - 0.35 = 0.25$.`, why:`Complement to 1.`}],
    answer:`$\\phi_{\\text{score}} = 0.25$` },

  { q:`<p>The joint probability of picking topic $Z=k$ and word $w$ is $\\theta_k \\phi_{k,w}$. With $\\theta_{\\text{Sports}}=0.8$ and $\\phi_{\\text{Sports},\\text{win}}=0.25$, compute $P(Z=\\text{Sports}, W=\\text{"win"})$.</p>`,
    steps:[
      {do:`$P = \\theta_{\\text{Sports}} \\times \\phi_{\\text{Sports,win}} = 0.8 \\times 0.25$.`, why:`Generative two-step: draw topic, then word.`},
      {do:`$= 0.2$.`, why:`Multiply the two probabilities.`}],
    answer:`$0.2$` },

  { q:`<p>Posterior topic for an observed word: $P(Z=k \\mid w) \\propto \\theta_k \\phi_{k,w}$. With contributions Sports $= 0.18$ and Finance $= 0.02$ for word "game", compute $P(Z=\\text{Sports} \\mid \\text{"game"})$.</p>`,
    steps:[
      {do:`Normalizer $= 0.18 + 0.02 = 0.20$.`, why:`Sum the unnormalized topic contributions.`},
      {do:`$P(\\text{Sports} \\mid \\text{"game"}) = 0.18/0.20 = 0.9$.`, why:`Divide by the total to normalize.`}],
    answer:`$0.9$` },

  { q:`<p>A document of $10$ words is generated with $\\theta = [0.8, 0.2]$. About how many words are expected from the Sports topic?</p>`,
    steps:[
      {do:`Each word independently draws Sports with probability $\\theta_{\\text{Sports}} = 0.8$.`, why:`Topic draws are i.i.d. from $\\theta$.`},
      {do:`Expected count $= 10 \\times 0.8 = 8$.`, why:`Expectation of a binomial is $n p$.`}],
    answer:`$8\\ words.$` },

  { q:`<p>Why do co-occurring words get grouped into one topic? Explain in two steps using the likelihood.</p>`,
    steps:[
      {do:`Words that appear together in many documents raise the joint likelihood if assigned to a shared topic.`, why:`A single topic emitting all of them explains the data with fewer parameters.`},
      {do:`Inference maximizes likelihood, so it carves the corpus by co-occurrence.`, why:`Co-occurrence is the only signal LDA uses to form topics.`}],
    answer:`$Shared\\ topic\\ raises\\ likelihood\\ of\\ co\\text{-}occurring\\ words.$` },

  { q:`<p>The Dirichlet prior pushes $\\theta$ toward sparsity. Which $\\theta$ does a sparse-favoring prior prefer: $[0.5, 0.5]$ or $[0.9, 0.1]$?</p>`,
    steps:[
      {do:`Sparse means mass concentrated on few topics.`, why:`A sparse-favoring Dirichlet ($\\alpha &lt; 1$) peaks near the simplex corners.`},
      {do:`$[0.9, 0.1]$ is more concentrated than the uniform $[0.5, 0.5]$.`, why:`Most mass sits on one topic.`}],
    answer:`$[0.9,\\ 0.1]\\ (more\\ sparse).$` },

  { q:`<p>Word "stock" has $P(\\text{stock} \\mid \\text{Finance}) = 0.3$ and the document is mostly Sports with $\\theta = [0.8, 0.2]$. Compute the chance a slot is Finance emitting "stock".</p>`,
    steps:[
      {do:`$P = \\theta_{\\text{Fin}} \\times \\phi_{\\text{Fin,stock}} = 0.2 \\times 0.3$.`, why:`Finance topic probability times word likelihood.`},
      {do:`$= 0.06$.`, why:`Rare, because the document is mostly Sports.`}],
    answer:`$0.06$` },

  { q:`<p>LDA Gibbs samples $P(Z_i = k \\mid \\text{rest})$. Given unnormalized scores $[\\text{Sports}: 3,\\ \\text{Finance}: 1]$, what is $P(Z_i = \\text{Sports})$?</p>`,
    steps:[
      {do:`Normalizer $= 3 + 1 = 4$.`, why:`Sum the unnormalized per-topic scores.`},
      {do:`$P(\\text{Sports}) = 3/4 = 0.75$.`, why:`Divide the Sports score by the total.`}],
    answer:`$0.75$` },

  { q:`<p>A two-topic document emits a word only Finance can produce ($\\phi_{\\text{Sports},w} = 0$). With $\\theta = [0.7, 0.3]$ and $\\phi_{\\text{Fin},w} = 0.5$, compute $P(w)$.</p>`,
    steps:[
      {do:`$P(w) = \\theta_S(0) + \\theta_F \\phi_{F,w} = 0.7(0) + 0.3(0.5)$.`, why:`Sports contributes nothing since it cannot emit $w$.`},
      {do:`$= 0.15$.`, why:`Only the Finance term survives.`}],
    answer:`$P(w) = 0.15$` },

  { q:`<p>Given word $w$ that only Finance can emit, what is the posterior $P(Z = \\text{Finance} \\mid w)$?</p>`,
    steps:[
      {do:`Sports contributes $0$ to the word, Finance contributes all of it.`, why:`$P(Z=k\\mid w) \\propto \\theta_k \\phi_{k,w}$, and Sports' term is 0.`},
      {do:`So $P(\\text{Finance} \\mid w) = 1$.`, why:`The word is a sure signal of the Finance topic.`}],
    answer:`$P(\\text{Finance} \\mid w) = 1.$` },

  { q:`<p>Perplexity measures fit; lower is better. Model A assigns held-out words average probability $0.1$, model B assigns $0.2$. Per-word perplexity is $1/P$. Which fits better?</p>`,
    steps:[
      {do:`Perplexity$_A = 1/0.1 = 10$; perplexity$_B = 1/0.2 = 5$.`, why:`Lower perplexity = higher assigned probability.`},
      {do:`$5 &lt; 10$, so model B fits better.`, why:`B gives held-out words higher probability.`}],
    answer:`$Model\\ B\\ (perplexity\\ 5 &lt; 10).$` },

  { q:`<p>A new document's inferred $\\theta = [0.1, 0.1, 0.8]$ over 3 topics. Which topic dominates, and what does this say about the document?</p>`,
    steps:[
      {do:`Largest proportion: $0.8$ on topic 3.`, why:`Argmax of $\\theta$ gives the dominant topic.`},
      {do:`The document is mostly about topic 3.`, why:`$80\\%$ of its words are expected from topic 3.`}],
    answer:`$Topic\\ 3\\ dominates\\ (80\\%).$` }
]);

/* ===================================================================
   aix-fol — unification (mgu) and resolution refutation
   =================================================================== */
add("aix-fol", [
  { q:`<p>Unify the atoms $P(x, b)$ and $P(a, y)$. Give the substitution $\\theta$.</p>`,
    steps:[
      {do:`Position 1: $x$ vs $a$ → $\\{x/a\\}$.`, why:`Bind the variable $x$ to the constant $a$ to match.`},
      {do:`Position 2: $b$ vs $y$ → $\\{y/b\\}$.`, why:`Bind the variable $y$ to the constant $b$.`}],
    answer:`$\\theta = \\{x/a,\\ y/b\\}.$` },

  { q:`<p>Apply $\\theta = \\{x/a, y/b\\}$ to $P(x,b)$ and $P(a,y)$. Show they become identical.</p>`,
    steps:[
      {do:`$P(x,b)$ with $x/a$ becomes $P(a,b)$.`, why:`Substitute $a$ for $x$.`},
      {do:`$P(a,y)$ with $y/b$ becomes $P(a,b)$.`, why:`Substitute $b$ for $y$.`}],
    answer:`$Both\\ become\\ P(a,b).$` },

  { q:`<p>Resolution: from $\\neg P \\vee Q$ and $P$, what is derived?</p>`,
    steps:[
      {do:`$P$ is true, so the $\\neg P$ literal in the first clause is false.`, why:`A clause is a disjunction; the false literal drops out.`},
      {do:`The remaining literal $Q$ must hold.`, why:`For the disjunction to stay true, $Q$ carries the truth.`}],
    answer:`$Q.$` },

  { q:`<p>Unify $\\text{Loves}(x, \\text{mary})$ and $\\text{Loves}(\\text{john}, y)$.</p>`,
    steps:[
      {do:`Arg 1: $x$ vs $\\text{john}$ → $\\{x/\\text{john}\\}$.`, why:`Bind variable $x$ to constant john.`},
      {do:`Arg 2: $\\text{mary}$ vs $y$ → $\\{y/\\text{mary}\\}$.`, why:`Bind variable $y$ to constant mary.`}],
    answer:`$\\theta = \\{x/\\text{john},\\ y/\\text{mary}\\}.$` },

  { q:`<p>Given the rule $\\neg\\text{Loves}(\\text{john},\\text{mary}) \\vee \\text{Happy}(\\text{john})$ and the fact $\\text{Loves}(\\text{john},\\text{mary})$, what does resolution derive?</p>`,
    steps:[
      {do:`The fact matches the complementary literal $\\neg\\text{Loves}(\\text{john},\\text{mary})$.`, why:`Resolution cancels a literal and its negation.`},
      {do:`Cancel it; the leftover is $\\text{Happy}(\\text{john})$.`, why:`This is modus ponens in clause form.`}],
    answer:`$\\text{Happy}(\\text{john}).$` },

  { q:`<p>Can $P(a, b)$ and $P(b, a)$ be unified (both constants)?</p>`,
    steps:[
      {do:`Position 1: $a$ vs $b$ — two different constants.`, why:`Constants only unify with themselves.`},
      {do:`No substitution can make $a = b$.`, why:`Variables can be bound, but distinct constants cannot.`}],
    answer:`$No,\\ they\\ do\\ not\\ unify.$` },

  { q:`<p>Unify $Q(x, x)$ with $Q(a, b)$ where $a \\ne b$. Does a unifier exist?</p>`,
    steps:[
      {do:`First arg: $x/a$. Second arg: $x$ must also be $b$.`, why:`The same variable $x$ appears in both positions.`},
      {do:`But $x$ cannot equal both $a$ and $b$ when $a \\ne b$.`, why:`A variable binds to one term only.`}],
    answer:`$No\\ unifier\\ (conflicting\\ bindings\\ for\\ x).$` },

  { q:`<p>Most general unifier: unify $R(x, y)$ with $R(z, b)$. Give the mgu.</p>`,
    steps:[
      {do:`Arg 1: $x$ vs $z$ → $\\{x/z\\}$ (bind one variable to the other).`, why:`Two variables unify by binding one to the other.`},
      {do:`Arg 2: $y$ vs $b$ → $\\{y/b\\}$.`, why:`Bind variable $y$ to constant $b$.`}],
    answer:`$\\theta = \\{x/z,\\ y/b\\}.$` },

  { q:`<p>Occurs check: can $x$ unify with $f(x)$?</p>`,
    steps:[
      {do:`Binding $x/f(x)$ makes $x$ contain itself.`, why:`The variable occurs inside the term it would be bound to.`},
      {do:`The occurs check forbids this; unification fails.`, why:`An infinite term would result without the occurs check.`}],
    answer:`$No;\\ occurs\\ check\\ fails.$` },

  { q:`<p>Resolution refutation: to prove $\\text{Happy}(\\text{john})$ from a KB, what clause do you add, and what is the goal of resolution?</p>`,
    steps:[
      {do:`Add the negated goal $\\neg\\text{Happy}(\\text{john})$ to the KB.`, why:`Refutation assumes the goal false and seeks a contradiction.`},
      {do:`Resolve until the empty clause $\\bot$ is derived.`, why:`An empty clause means the assumption was unsatisfiable, proving the goal.`}],
    answer:`$Add\\ \\neg\\text{Happy}(\\text{john});\\ derive\\ the\\ empty\\ clause.$` },

  { q:`<p>From $\\neg\\text{Happy}(\\text{john})$ (negated goal) and the derived fact $\\text{Happy}(\\text{john})$, what does resolution produce?</p>`,
    steps:[
      {do:`The two clauses are complementary single literals.`, why:`One is $\\text{Happy}(\\text{john})$, the other its negation.`},
      {do:`Resolving them cancels both, leaving the empty clause $\\bot$.`, why:`No literals remain, signaling a contradiction.`}],
    answer:`$The\\ empty\\ clause\\ \\bot\\ (contradiction).$` },

  { q:`<p>Translate "$\\forall x\\, [\\text{Dog}(x) \\rightarrow \\text{Animal}(x)]$" into clause (CNF) form.</p>`,
    steps:[
      {do:`$A \\rightarrow B$ is equivalent to $\\neg A \\vee B$.`, why:`Implication rewrites as a disjunction.`},
      {do:`So the clause is $\\neg\\text{Dog}(x) \\vee \\text{Animal}(x)$.`, why:`Universally quantified variables become free variables in the clause.`}],
    answer:`$\\neg\\text{Dog}(x) \\vee \\text{Animal}(x).$` },

  { q:`<p>Using $\\neg\\text{Dog}(x) \\vee \\text{Animal}(x)$ and the fact $\\text{Dog}(\\text{rex})$, derive a new fact by resolution.</p>`,
    steps:[
      {do:`Unify $\\text{Dog}(x)$ with $\\text{Dog}(\\text{rex})$: $\\theta = \\{x/\\text{rex}\\}$.`, why:`Bind $x$ to the constant rex.`},
      {do:`Resolve on $\\text{Dog}(\\text{rex})$: cancel $\\neg\\text{Dog}(\\text{rex})$ and $\\text{Dog}(\\text{rex})$.`, why:`Complementary literals cancel under the unifier.`},
      {do:`Leftover: $\\text{Animal}(\\text{rex})$.`, why:`Apply $\\theta$ to the remaining literal.`}],
    answer:`$\\text{Animal}(\\text{rex}).$` },

  { q:`<p>$\\exists x\\, P(x)$ is Skolemized to $P(c)$ for a fresh constant $c$. Why use a new constant rather than reusing an existing one?</p>`,
    steps:[
      {do:`$\\exists x$ asserts some object exists but does not name it.`, why:`We only know an object satisfies $P$, not which one.`},
      {do:`A fresh Skolem constant $c$ names that unknown object without clashing.`, why:`Reusing a known constant would wrongly assert which object it is.`}],
    answer:`$A\\ fresh\\ constant\\ names\\ the\\ unknown\\ witness.$` },

  { q:`<p>Unify $\\text{Parent}(x, \\text{tom})$ with $\\text{Parent}(\\text{ann}, z)$, then state the resulting atom.</p>`,
    steps:[
      {do:`Arg 1: $x/\\text{ann}$. Arg 2: $z/\\text{tom}$.`, why:`Bind each variable to the matching constant.`},
      {do:`Both atoms become $\\text{Parent}(\\text{ann}, \\text{tom})$.`, why:`Apply the unifier to either atom.`}],
    answer:`$\\theta=\\{x/\\text{ann},z/\\text{tom}\\};\\ \\text{Parent}(\\text{ann},\\text{tom}).$` },

  { q:`<p>Multi-step refutation. KB: (1) $\\neg\\text{Bird}(x) \\vee \\text{Flies}(x)$; (2) $\\text{Bird}(\\text{tweety})$. Goal: prove $\\text{Flies}(\\text{tweety})$. Show the derivation.</p>`,
    steps:[
      {do:`Add negated goal (3): $\\neg\\text{Flies}(\\text{tweety})$.`, why:`Refutation negates the goal.`},
      {do:`Resolve (1) and (2) with $\\{x/\\text{tweety}\\}$: derive $\\text{Flies}(\\text{tweety})$.`, why:`Cancel $\\text{Bird}(\\text{tweety})$.`},
      {do:`Resolve that with (3): derive the empty clause $\\bot$.`, why:`A contradiction proves the goal.`}],
    answer:`$\\bot\\ derived;\\ \\text{Flies}(\\text{tweety})\\ proved.$` },

  { q:`<p>Resolve two clauses with a variable: $\\neg P(x) \\vee Q(x)$ and $P(a) \\vee R(b)$. What is the resolvent?</p>`,
    steps:[
      {do:`Unify $P(x)$ with $P(a)$: $\\theta = \\{x/a\\}$.`, why:`Bind $x$ to $a$ to make the literals complementary.`},
      {do:`Cancel $\\neg P(a)$ and $P(a)$; join the remaining literals under $\\theta$.`, why:`Resolution keeps the leftovers of both clauses.`},
      {do:`Resolvent: $Q(a) \\vee R(b)$.`, why:`Apply $\\theta$ to $Q(x)$ giving $Q(a)$, and carry $R(b)$.`}],
    answer:`$Q(a) \\vee R(b).$` }
]);

})();
