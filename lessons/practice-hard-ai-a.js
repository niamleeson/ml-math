(function(){ var P=window.PRACTICE; function add(id,probs){P[id]=(P[id]||[]).concat(probs);}

  /* ===================== LINEAR PREDICTORS (harder) ===================== */
  add("ai-linear-predictors", [
    { q:`<p>A bias term sits in the weights. $\\phi(x)=[1,3,2]$ where the first entry is always $1$ for the bias, and $w=[-4,2,1]$. Compute the score, then the prediction $f_w(x)=\\text{sign}(s)$.</p>`,
      steps:[
        {do:`Pair entries: $-4\\times1=-4$, $2\\times3=6$, $1\\times2=2$.`, why:`A constant feature of $1$ lets its weight act as a bias.`},
        {do:`Sum: $-4+6+2=4$.`, why:`The score is the full dot product including the bias.`},
        {do:`$\\text{sign}(4)=+1$, so $f_w(x)=+1$.`, why:`A positive score gives the "yes" class.`}
      ],
      answer:`$s=4,\\ f_w(x)=+1$` },

    { q:`<p>Four points with labels and scores: $(s,y)$ pairs $(2,+1)$, $(-3,-1)$, $(0.5,-1)$, $(-1,+1)$. How many are correctly classified, and what is the smallest margin?</p>`,
      steps:[
        {do:`Margin $m=s\\cdot y$: $2,\\ 3,\\ -0.5,\\ -1$.`, why:`A correct point has $m>0$; multiply each score by its label.`},
        {do:`Positive margins: $2$ and $3$ only, so $2$ correct.`, why:`The third and fourth have negative margins, so they are wrong.`},
        {do:`Smallest margin $=\\min(2,3,-0.5,-1)=-1$.`, why:`The most negative margin is the worst-classified point.`}
      ],
      answer:`$2$ correct, smallest margin $-1$` },

    { q:`<p>Decision boundary $w\\cdot\\phi(x)=0$ with $w=[2,-1]$ and a bias $b=-3$ (score $=2x_1-x_2-3$). Is the point $\\phi=[3,1]$ on the positive or negative side?</p>`,
      steps:[
        {do:`Score $=2\\times3-1\\times1-3=6-1-3=2$.`, why:`Evaluate the linear score at the point.`},
        {do:`$2>0$, so the point is on the positive side.`, why:`The sign of the score names the side of the boundary.`}
      ],
      answer:`positive side ($s=2$)` },

    { q:`<p>With $\\phi(x)=[x,1]$ (second entry is the bias feature) and $w=[w_1,b]=[3,-6]$, find the threshold value of $x$ where the prediction flips.</p>`,
      steps:[
        {do:`Score $=3x-6$.`, why:`Dot product of weights with the feature vector.`},
        {do:`Set $3x-6=0\\Rightarrow x=2$.`, why:`The prediction flips sign exactly where the score is zero.`},
        {do:`For $x>2$ score is positive; for $x<2$ negative.`, why:`The score grows with $x$ since $w_1=3>0$.`}
      ],
      answer:`$x=2$` },

    { q:`<p>Two candidate weight vectors classify the same point $\\phi=[1,2]$, $y=+1$. $w_A=[1,1]$, $w_B=[3,3]$. Both predict correctly; which gives the larger margin, and why is scale not the whole story?</p>`,
      steps:[
        {do:`Scores: $w_A\\cdot\\phi=1+2=3$, $w_B\\cdot\\phi=3+6=9$.`, why:`Compute each dot product.`},
        {do:`Margins $=s\\cdot y$: $3$ and $9$, so $w_B$ is larger.`, why:`Larger label-times-score means more confident here.`},
        {do:`But $w_B=3w_A$ just rescales; the boundary direction is identical.`, why:`Scaling weights inflates the raw margin without changing which side any point lands on.`}
      ],
      answer:`$w_B$ ($m=9$), but it is just $3\\times w_A$` },

    { q:`<p>Three features $\\phi=[2,-1,4]$, weights $w=[1,3,-0.5]$, true label $y=-1$. Find score, prediction, margin, and say if correct.</p>`,
      steps:[
        {do:`Score: $1\\times2+3\\times(-1)+(-0.5)\\times4=2-3-2=-3$.`, why:`Sum the three weighted features.`},
        {do:`$\\text{sign}(-3)=-1$, so $f_w(x)=-1$.`, why:`Negative score predicts the "no" class.`},
        {do:`Margin $=(-3)\\times(-1)=3>0$, so correct.`, why:`Score and label share the same sign, giving a positive margin.`}
      ],
      answer:`$s=-3,\\ f_w=-1,\\ m=3$, correct` }
  ]);

  /* ===================== LOSS MINIMIZATION (harder) ===================== */
  add("ai-loss-minimization", [
    { q:`<p>Four training examples have margins $m=2,\\ 0.5,\\ -1,\\ 1.5$. Compute the average hinge loss over the set.</p>`,
      steps:[
        {do:`Hinge $=\\max(1-m,0)$ per example: $\\max(-1,0)=0$, $\\max(0.5,0)=0.5$, $\\max(2,0)=2$, $\\max(-0.5,0)=0$.`, why:`Hinge only charges when the margin is below $1$.`},
        {do:`Sum: $0+0.5+2+0=2.5$.`, why:`Train loss sums the per-example losses first.`},
        {do:`Average: $2.5/4=0.625$.`, why:`Divide by $|D|=4$ to get the mean.`}
      ],
      answer:`$0.625$` },

    { q:`<p>Five examples; the model misclassifies $2$ of them. Compute the average zero-one loss, and explain what it represents.</p>`,
      steps:[
        {do:`Zero-one loss is $1$ per mistake, $0$ otherwise; sum $=2$.`, why:`Each misclassified example contributes exactly $1$.`},
        {do:`Average $=2/5=0.4$.`, why:`Divide the total mistakes by $|D|=5$.`},
        {do:`This is the misclassification rate: $40\\%$ wrong.`, why:`Average zero-one loss equals the fraction of errors.`}
      ],
      answer:`$0.4$ (40% misclassified)` },

    { q:`<p>Regression with squared loss $(\\hat y-y)^2$. Predictions/targets: $(5,2),\\ (1,1),\\ (4,6)$. Find the average squared loss.</p>`,
      steps:[
        {do:`Per-example: $(5-2)^2=9$, $(1-1)^2=0$, $(4-6)^2=4$.`, why:`Square each prediction error.`},
        {do:`Sum: $9+0+4=13$.`, why:`Total loss adds the squared errors.`},
        {do:`Average: $13/3\\approx4.33$.`, why:`Divide by $|D|=3$.`}
      ],
      answer:`$13/3\\approx4.33$` },

    { q:`<p>Example: $\\phi=[1,2]$, $w=[2,-1]$, $y=+1$. Compute the score, margin, and hinge loss in one chain.</p>`,
      steps:[
        {do:`Score $=2\\times1+(-1)\\times2=2-2=0$.`, why:`Dot product of weights and features.`},
        {do:`Margin $=0\\times(+1)=0$.`, why:`Score times true label.`},
        {do:`Hinge $=\\max(1-0,0)=1$.`, why:`A zero margin sits well inside the hinge's penalty region.`}
      ],
      answer:`$s=0,\\ m=0,\\ \\text{hinge}=1$` },

    { q:`<p>Compare two weight settings on the same two examples by average hinge loss. Setting A gives margins $\\{0.2,\\ 1.2\\}$; Setting B gives $\\{0.8,\\ 0.8\\}$. Which is better?</p>`,
      steps:[
        {do:`A: $\\max(0.8,0)+\\max(-0.2,0)=0.8+0$; average $=0.4$.`, why:`Only the first margin is below $1$.`},
        {do:`B: $\\max(0.2,0)+\\max(0.2,0)=0.2+0.2$; average $=0.2$.`, why:`Both margins are below $1$ but only slightly.`},
        {do:`B's average $0.2<0.4$, so Setting B is better.`, why:`Lower average training loss is preferred.`}
      ],
      answer:`Setting B ($0.2<0.4$)` },

    { q:`<p>Logistic loss is $\\log(1+e^{-m})$. For a hugely confident correct example $m=10$ versus a wrong one $m=-2$, which has larger loss, and roughly why?</p>`,
      steps:[
        {do:`At $m=10$: $e^{-10}\\approx0$, so loss $\\approx\\log(1)=0$.`, why:`A large positive margin drives the exponential to zero.`},
        {do:`At $m=-2$: $e^{2}\\approx7.39$, so loss $\\approx\\log(8.39)\\approx2.13$.`, why:`A negative margin makes the exponential large.`},
        {do:`The wrong example ($m=-2$) has the larger loss.`, why:`Logistic loss always punishes a smaller or negative margin more.`}
      ],
      answer:`$m=-2$ has larger loss ($\\approx2.13$ vs $\\approx0$)` }
  ]);

  /* ===================== SGD (harder) ===================== */
  add("ai-sgd", [
    { q:`<p>Run two SGD steps on scalar $w$. Start $w=6$, $\\eta=0.5$. Step 1 gradient $\\nabla=4$; step 2 gradient $\\nabla=2$. Find $w$ after both.</p>`,
      steps:[
        {do:`Step 1: $w\\leftarrow6-0.5\\times4=6-2=4$.`, why:`Each SGD step moves against that example's gradient.`},
        {do:`Step 2: $w\\leftarrow4-0.5\\times2=4-1=3$.`, why:`Use the updated $w$ and the next gradient.`}
      ],
      answer:`$w=3$` },

    { q:`<p>Vector SGD, two steps. $w=[4,2]$, $\\eta=0.5$. Gradients: step 1 $[2,4]$, step 2 $[2,0]$. Final $w$?</p>`,
      steps:[
        {do:`Step 1: $[4-0.5\\times2,\\ 2-0.5\\times4]=[3,0]$.`, why:`Update every component against the gradient.`},
        {do:`Step 2: $[3-0.5\\times2,\\ 0-0.5\\times0]=[2,0]$.`, why:`Apply the second gradient to the updated vector.`}
      ],
      answer:`$w=[2,0]$` },

    { q:`<p>Hinge-loss SGD. When the margin $m<1$ the gradient is $-y\\,\\phi$; when $m\\ge1$ it is $0$. Example $\\phi=[1,2]$, $y=+1$, current $w=[0,0]$, $\\eta=1$. Do one update.</p>`,
      steps:[
        {do:`Score $=0$, margin $m=0<1$, so the hinge is active.`, why:`A margin under $1$ means the loss has a nonzero gradient.`},
        {do:`Gradient $=-y\\,\\phi=-1\\times[1,2]=[-1,-2]$.`, why:`This is the hinge-loss gradient when active.`},
        {do:`$w\\leftarrow[0,0]-1\\times[-1,-2]=[1,2]$.`, why:`Subtracting the negative gradient pushes $w$ toward correctly classifying this point.`}
      ],
      answer:`$w=[1,2]$` },

    { q:`<p>From the previous problem, $w=[1,2]$ now sees the SAME example $\\phi=[1,2]$, $y=+1$ again, $\\eta=1$. Does $w$ change? Show the check.</p>`,
      steps:[
        {do:`Score $=1\\times1+2\\times2=5$, margin $m=5\\ge1$.`, why:`Recompute the margin with the updated weights.`},
        {do:`Since $m\\ge1$, the hinge gradient is $0$.`, why:`Once the margin clears $1$, hinge stops pushing.`},
        {do:`$w\\leftarrow[1,2]-1\\times[0,0]=[1,2]$: no change.`, why:`A zero gradient leaves the weights untouched.`}
      ],
      answer:`no change; $w=[1,2]$` },

    { q:`<p>Squared-loss SGD with gradient $\\nabla_w=2(\\hat y-y)\\,\\phi$. Here $\\hat y=w\\cdot\\phi$, $w=[1,0]$, $\\phi=[2,1]$, $y=1$, $\\eta=0.1$. Do one update.</p>`,
      steps:[
        {do:`Prediction $\\hat y=1\\times2+0\\times1=2$; error $\\hat y-y=2-1=1$.`, why:`The gradient scales with the prediction error.`},
        {do:`Gradient $=2\\times1\\times[2,1]=[4,2]$.`, why:`Plug into $2(\\hat y-y)\\phi$.`},
        {do:`$w\\leftarrow[1,0]-0.1\\times[4,2]=[0.6,-0.2]$.`, why:`Step each component downhill by $\\eta$ times the gradient.`}
      ],
      answer:`$w=[0.6,-0.2]$` },

    { q:`<p>Two examples are passed once each (one epoch) to scalar SGD. $w=10$, $\\eta=0.25$. Example 1 gradient $8$, example 2 gradient $-4$. Final $w$ after the epoch?</p>`,
      steps:[
        {do:`Example 1: $w\\leftarrow10-0.25\\times8=10-2=8$.`, why:`SGD updates immediately after each example.`},
        {do:`Example 2: $w\\leftarrow8-0.25\\times(-4)=8+1=9$.`, why:`A negative gradient adds to the weight.`}
      ],
      answer:`$w=9$` }
  ]);

  /* ===================== SEARCH PROBLEM (harder) ===================== */
  add("ai-search-problem", [
    { q:`<p>Graph edges with costs: $S\\to A=2$, $S\\to B=1$, $A\\to G=2$, $B\\to A=1$, $B\\to G=5$. List the cost of every simple $S\\to G$ path and give the cheapest.</p>`,
      steps:[
        {do:`$S\\to A\\to G=2+2=4$.`, why:`Sum the edge costs along the path.`},
        {do:`$S\\to B\\to G=1+5=6$; $S\\to B\\to A\\to G=1+1+2=4$.`, why:`Enumerate the other simple paths to $G$.`},
        {do:`Cheapest $=\\min(4,6,4)=4$.`, why:`Search returns the minimum-cost path.`}
      ],
      answer:`paths $4,6,4$; cheapest $4$` },

    { q:`<p>State space is the integers $0..9$. Action "add 3" costs $1$, action "double" costs $2$, both modulo $10$. From state $1$, give $\\text{Succ}$ and $\\text{Cost}$ of each action.</p>`,
      steps:[
        {do:`"add 3": $\\text{Succ}(1)=(1+3)\\bmod10=4$, cost $1$.`, why:`Apply the action's transition and read its cost.`},
        {do:`"double": $\\text{Succ}(1)=(1\\times2)\\bmod10=2$, cost $2$.`, why:`The double action maps $1\\to2$ at cost $2$.`}
      ],
      answer:`add3$\\to4$ (cost 1), double$\\to2$ (cost 2)` },

    { q:`<p>A robot on a $1$D line at position $p$. Actions "L" and "R" each cost $1$ and move one step; goal is $p=4$ from start $p=0$. What is the cheapest path cost, and why can it not be lower?</p>`,
      steps:[
        {do:`Each step changes $p$ by $1$ at cost $1$; need $+4$ net.`, why:`Reaching position $4$ requires a net of four rightward moves.`},
        {do:`Minimum is $4$ R-steps, total cost $4$.`, why:`Any extra L-step would have to be undone, adding cost.`},
        {do:`No path is cheaper since cost equals distance here.`, why:`With unit step costs, cost lower-bounds at the displacement.`}
      ],
      answer:`$4$` },

    { q:`<p>Costs along two routes to goal: route 1 has edges $3,1,2$; route 2 has edges $2,2,2$. Which route does the search prefer, and by how much?</p>`,
      steps:[
        {do:`Route 1 total: $3+1+2=6$.`, why:`Path cost sums its edges.`},
        {do:`Route 2 total: $2+2+2=6$.`, why:`Same computation for the second route.`},
        {do:`They tie at $6$; either is optimal, difference $0$.`, why:`Search may return either when costs are equal.`}
      ],
      answer:`tie at $6$ (difference $0$)` },

    { q:`<p>A grid has a wall: from cell $X$, action "right" would enter a wall, so $\\text{Succ}(X,\\text{right})=X$ (stay) at cost $1$. Why is allowing a self-loop with positive cost safe for finding shortest paths?</p>`,
      steps:[
        {do:`A self-loop adds cost $1$ but no progress.`, why:`Staying in place wastes cost without changing the state.`},
        {do:`Since costs are $\\ge0$, no optimal path repeats it.`, why:`Any shortest path would skip a move that only adds cost.`},
        {do:`So the optimum ignores the self-loop automatically.`, why:`Positive-cost loops are never part of a minimum-cost path.`}
      ],
      answer:`positive-cost loops never help, so they are ignored` }
  ]);

  /* ===================== TREE SEARCH (harder) ===================== */
  add("ai-tree-search", [
    { q:`<p>Full binary tree, root at level 0. Nodes per level are $1,2,4,8,\\dots$ Give the total nodes in a tree of depth $d=4$ (levels $0..4$).</p>`,
      steps:[
        {do:`Sum a geometric series: $1+2+4+8+16$.`, why:`Each level doubles the previous count for $b=2$.`},
        {do:`$=2^{5}-1=31$.`, why:`The sum $\\sum_{i=0}^{d}2^i=2^{d+1}-1$.`}
      ],
      answer:`$31$ nodes` },

    { q:`<p>Tree: root R has children A,B,C; A has children D,E; B has child F. Goal is F. Give the BFS visit order.</p>`,
      steps:[
        {do:`Level 0: R. Level 1: A,B,C (left to right).`, why:`BFS visits an entire level before going deeper.`},
        {do:`Level 2: D,E (under A), then F (under B).`, why:`Children are queued in discovery order.`},
        {do:`Order: R,A,B,C,D,E,F — F found last.`, why:`BFS reaches F only after the whole frontier above it.`}
      ],
      answer:`R,A,B,C,D,E,F` },

    { q:`<p>Same tree (R$\\to$A,B,C; A$\\to$D,E; B$\\to$F). DFS, left-first, goal F. Give the visit order.</p>`,
      steps:[
        {do:`Dive: R, then A, then D, then E (A's subtree exhausted).`, why:`DFS fully explores the leftmost branch first.`},
        {do:`Backtrack to B, go to F.`, why:`After A's subtree, DFS moves to the next sibling B.`},
        {do:`Order: R,A,D,E,B,F — C is never reached before F.`, why:`DFS finds F while C still sits unexplored.`}
      ],
      answer:`R,A,D,E,B,F` },

    { q:`<p>Iterative deepening on a tree with goal at depth $d=2$, branching $b=2$. The DFS at limit $L$ visits $2^{0}+\\dots+2^{L}$ nodes. List nodes visited at limits $0,1,2$ and the total work.</p>`,
      steps:[
        {do:`Limit 0: $2^0=1$. Limit 1: $1+2=3$. Limit 2: $1+2+4=7$.`, why:`Each pass re-explores from the root down to the new depth cap.`},
        {do:`Total work $=1+3+7=11$ node-visits.`, why:`IDDFS repeats shallow levels, summing across passes.`},
        {do:`Versus a single BFS to depth 2: $7$ nodes.`, why:`IDDFS does modest extra work but keeps $\\mathcal{O}(d)$ memory.`}
      ],
      answer:`$1,3,7$; total $11$ visits` },

    { q:`<p>Branching $b=4$, goal depth $d=5$. Compute $b^d$, and state BFS space and DFS space in big-O.</p>`,
      steps:[
        {do:`$b^d=4^5=1024$.`, why:`The deepest level holds about $b^d$ states.`},
        {do:`BFS space $=\\mathcal{O}(b^d)=\\mathcal{O}(4^5)$.`, why:`BFS stores a whole frontier level.`},
        {do:`DFS space $=\\mathcal{O}(d)=\\mathcal{O}(5)$.`, why:`DFS only stores the current root-to-node path.`}
      ],
      answer:`$b^d=1024$; BFS $\\mathcal{O}(b^d)$, DFS $\\mathcal{O}(d)$` },

    { q:`<p>Why is iterative deepening's repeated work only a constant-factor overhead over BFS for large $b$? Reason with the level sizes.</p>`,
      steps:[
        {do:`The deepest level $b^d$ dominates the whole tree's node count.`, why:`For $b>1$, $b^d$ exceeds the sum of all shallower levels.`},
        {do:`Re-visiting shallow levels adds only lower-order terms.`, why:`Those levels are geometrically smaller than $b^d$.`},
        {do:`So total IDDFS work stays $\\mathcal{O}(b^d)$, the same order as BFS.`, why:`The overhead is a bounded constant factor, not exponential.`}
      ],
      answer:`deepest level dominates, so overhead is a constant factor` }
  ]);

  /* ===================== GRAPH SEARCH / UCS (harder) ===================== */
  add("ai-graph-search", [
    { q:`<p>UCS on undirected edges: $S\\!-\\!A=1$, $S\\!-\\!B=4$, $A\\!-\\!B=2$, $A\\!-\\!C=5$, $B\\!-\\!C=1$, $C\\!-\\!G=3$. Trace the settle order and the final cost to $G$.</p>`,
      steps:[
        {do:`Settle $S(0)$; frontier $A=1,B=4$. Settle $A(1)$; relax $B=\\min(4,1+2)=3$, $C=1+5=6$.`, why:`UCS pops the cheapest node and relaxes its neighbours.`},
        {do:`Settle $B(3)$; relax $C=\\min(6,3+1)=4$. Settle $C(4)$; relax $G=4+3=7$.`, why:`The route $S\\to A\\to B\\to C$ undercuts the direct edges.`},
        {do:`Settle $G(7)$.`, why:`$G$ is popped at its final cheapest cost.`}
      ],
      answer:`order $S,A,B,C,G$; cost to $G=7$` },

    { q:`<p>Same graph as above. Verify the cheapest $S\\to C$ cost and which path achieves it.</p>`,
      steps:[
        {do:`Direct $S\\to A\\to C=1+5=6$.`, why:`One candidate route to $C$.`},
        {do:`Via $B$: $S\\to A\\to B\\to C=1+2+1=4$.`, why:`Going through $B$ is cheaper than the direct $A\\to C$ edge.`},
        {do:`$\\min(6,4)=4$, path $S,A,B,C$.`, why:`UCS settles $C$ at its minimum cost.`}
      ],
      answer:`$4$ via $S,A,B,C$` },

    { q:`<p>DP on an acyclic graph. $\\text{FutureCost}(G)=0$. Edges: $D\\to G=2$, $E\\to G=1$, $B\\to D=3$, $B\\to E=4$, $A\\to B=1$. Compute $\\text{FutureCost}$ for $D,E,B,A$.</p>`,
      steps:[
        {do:`$FC(D)=2+0=2$, $FC(E)=1+0=1$.`, why:`Cost of the edge plus the goal's future cost ($0$).`},
        {do:`$FC(B)=\\min(3+FC(D),\\ 4+FC(E))=\\min(5,5)=5$.`, why:`Take the cheaper of $B$'s two onward actions.`},
        {do:`$FC(A)=1+FC(B)=6$.`, why:`$A$'s only action leads to $B$.`}
      ],
      answer:`$FC: D=2,E=1,B=5,A=6$` },

    { q:`<p>Why must UCS keep relaxing a node even after first reaching it, until it is popped/settled? Use $S\\to B=4$ but $S\\to A\\to B=3$.</p>`,
      steps:[
        {do:`$B$ first appears on the frontier at cost $4$.`, why:`The direct edge $S\\to B$ is discovered immediately.`},
        {do:`Expanding $A$ later relaxes $B$ to $3$.`, why:`A cheaper path through $A$ is found before $B$ is popped.`},
        {do:`$B$ is settled at $3$, not $4$.`, why:`UCS only finalizes a node when it is popped as the cheapest, guaranteeing the minimum.`}
      ],
      answer:`a cheaper path can lower $B$ from $4$ to $3$ before settling` },

    { q:`<p>UCS frontier currently holds $\\{B:3,\\ C:3,\\ D:5\\}$, and $B$ connects to $D$ with edge cost $1$. Pop $B$, then give the updated frontier.</p>`,
      steps:[
        {do:`Pop the cheapest; $B$ and $C$ tie at $3$, pop $B$.`, why:`UCS expands a minimum-cost node, breaking ties arbitrarily.`},
        {do:`Relax $D$: $3+1=4<5$, so $D\\to4$.`, why:`The path through $B$ improves $D$.`},
        {do:`Frontier becomes $\\{C:3,\\ D:4\\}$.`, why:`$B$ is settled; $D$'s cost dropped.`}
      ],
      answer:`$\\{C:3,\\ D:4\\}$` },

    { q:`<p>A graph has a negative edge $A\\to B=-2$. Explain why UCS (Dijkstra) can give a wrong answer here.</p>`,
      steps:[
        {do:`UCS settles a node when popped, assuming no cheaper path remains.`, why:`Non-negative costs make a popped node final.`},
        {do:`A later negative edge could reduce an already-settled node's cost.`, why:`The $-2$ edge violates the assumption that costs only add.`},
        {do:`So UCS may finalize a node too early and miss the true minimum.`, why:`Dijkstra/UCS requires all costs $\\ge0$.`}
      ],
      answer:`negative edges break UCS's "settled is final" guarantee` }
  ]);

  /* ===================== A* (harder) ===================== */
  add("ai-astar", [
    { q:`<p>Grid A* with the Manhattan heuristic. Start $(0,0)$, goal $(3,2)$. For cell $(1,1)$ with $g=2$, compute $h$ and $f$.</p>`,
      steps:[
        {do:`Manhattan $h=|3-1|+|2-1|=2+1=3$.`, why:`Manhattan distance sums the row and column gaps to the goal.`},
        {do:`$f=g+h=2+3=5$.`, why:`A* orders cells by past cost plus heuristic.`}
      ],
      answer:`$h=3,\\ f=5$` },

    { q:`<p>Three frontier nodes: $P(g=4,h=2)$, $Q(g=1,h=6)$, $R(g=3,h=3)$. Which does A* expand first, and what is the tie situation?</p>`,
      steps:[
        {do:`$f_P=6$, $f_Q=7$, $f_R=6$.`, why:`Add $g$ and $h$ for each node.`},
        {do:`$\\min=6$, shared by $P$ and $R$.`, why:`Both have the lowest $f$-value.`},
        {do:`A* expands one of $P,R$ (tie broken arbitrarily, often by larger $g$).`, why:`Either is valid; a common rule prefers higher $g$ near the goal.`}
      ],
      answer:`$P$ or $R$ (both $f=6$)` },

    { q:`<p>Heuristic values: $h(A)=4$, $h(B)=2$, with an edge $A\\to B$ of cost $1$. Is the heuristic consistent across this edge? (Check $h(A)\\le c(A,B)+h(B)$.)</p>`,
      steps:[
        {do:`Check $h(A)\\le c(A,B)+h(B)$: is $4\\le1+2=3$?`, why:`Consistency requires the heuristic not to drop faster than real cost.`},
        {do:`$4\\le3$ is false, so it is NOT consistent.`, why:`The heuristic falls by $2$ across an edge that only costs $1$.`}
      ],
      answer:`not consistent ($4\\not\\le3$)` },

    { q:`<p>Different values: $h(A)=4$, $h(B)=3$, edge $A\\to B=2$, and the true goal cost from $B$ is $3$. Check both admissibility at $B$ and consistency on the edge.</p>`,
      steps:[
        {do:`Admissible at $B$: $h(B)=3\\le$ true $3$. OK.`, why:`The heuristic does not overestimate the remaining cost.`},
        {do:`Consistency: $h(A)\\le c+h(B)\\Rightarrow4\\le2+3=5$. OK.`, why:`Across the edge the heuristic drops by only $1\\le2$.`},
        {do:`Both conditions hold.`, why:`Consistency implies admissibility, and here both are satisfied.`}
      ],
      answer:`admissible and consistent` },

    { q:`<p>A* with modified cost $\\text{Cost}'(s,a)=\\text{Cost}(s,a)+h(\\text{Succ})-h(s)$. Edge $A\\to B$ has $\\text{Cost}=5$, $h(A)=6$, $h(B)=4$. Compute $\\text{Cost}'$ and confirm it is non-negative.</p>`,
      steps:[
        {do:`$\\text{Cost}'=5+4-6=3$.`, why:`Plug into the reduced-cost formula A* runs UCS on.`},
        {do:`$3\\ge0$, non-negative.`, why:`A consistent heuristic keeps every modified edge cost $\\ge0$.`},
        {do:`So UCS on these costs behaves correctly.`, why:`Non-negative reduced costs preserve Dijkstra's guarantee.`}
      ],
      answer:`$\\text{Cost}'=3\\ge0$` },

    { q:`<p>Two heuristics for the same problem give $h_1(s)=3$ and $h_2(s)=5$, both admissible (true cost $\\ge6$). Which leads A* to expand fewer nodes, and why?</p>`,
      steps:[
        {do:`Both satisfy $h\\le6$, so both are admissible.`, why:`Neither overestimates the true remaining cost.`},
        {do:`$h_2=5$ is larger and closer to the truth, dominating $h_1$.`, why:`A larger admissible heuristic gives sharper $f$ estimates.`},
        {do:`A* with $h_2$ expands fewer (or equal) nodes.`, why:`A more informed heuristic prunes more of the search.`}
      ],
      answer:`$h_2$ (more informed, dominates $h_1$)` }
  ]);

  /* ===================== MDP (harder) ===================== */
  add("ai-mdp", [
    { q:`<p>Action $a$ has three outcomes: $T=0.5$ (reward $4$), $T=0.3$ (reward $10$), $T=0.2$ (reward $0$). Verify the distribution and compute the expected immediate reward.</p>`,
      steps:[
        {do:`Sum probs: $0.5+0.3+0.2=1.0$. Valid.`, why:`$\\sum_{s'}T(s,a,s')=1$ must hold.`},
        {do:`Expected reward $=0.5\\times4+0.3\\times10+0.2\\times0$.`, why:`Weight each reward by its probability.`},
        {do:`$=2+3+0=5$.`, why:`Sum the weighted rewards.`}
      ],
      answer:`valid; expected reward $=5$` },

    { q:`<p>Discounted return of a fixed reward stream $r_1=2,\\ r_2=6,\\ r_3=4,\\ r_4=8$ with $\\gamma=0.5$. Compute $u=\\sum_i r_i\\gamma^{i-1}$.</p>`,
      steps:[
        {do:`Discounts $\\gamma^{0..3}=1,0.5,0.25,0.125$.`, why:`Each step shrinks by another factor of $\\gamma$.`},
        {do:`Terms: $2,\\ 3,\\ 1,\\ 1$ (from $6\\times0.5,\\ 4\\times0.25,\\ 8\\times0.125$).`, why:`Multiply each reward by its discount.`},
        {do:`$u=2+3+1+1=7$.`, why:`Sum the discounted rewards.`}
      ],
      answer:`$u=7$` },

    { q:`<p>An infinite stream pays a constant reward $r=3$ forever with $\\gamma=0.5$. Use $\\sum_{i=0}^{\\infty}\\gamma^i=\\frac{1}{1-\\gamma}$ to find the discounted return.</p>`,
      steps:[
        {do:`$u=r\\sum_{i=0}^{\\infty}\\gamma^i=3\\times\\frac{1}{1-0.5}$.`, why:`A constant reward factors out of the geometric sum.`},
        {do:`$=3\\times2=6$.`, why:`$\\frac{1}{1-0.5}=2$.`}
      ],
      answer:`$u=6$` },

    { q:`<p>Constant reward $r=1$ forever; compare returns at $\\gamma=0.9$ versus $\\gamma=0.99$. What does the gap show about patience?</p>`,
      steps:[
        {do:`$\\gamma=0.9$: $u=\\frac{1}{1-0.9}=10$.`, why:`Geometric-series return for a constant reward.`},
        {do:`$\\gamma=0.99$: $u=\\frac{1}{1-0.99}=100$.`, why:`Same formula with a larger discount.`},
        {do:`Higher $\\gamma$ weights far-future rewards much more, so the total is far larger.`, why:`A patient agent ($\\gamma\\to1$) values the long tail of rewards.`}
      ],
      answer:`$10$ vs $100$; higher $\\gamma$ is more patient` },

    { q:`<p>Two-step expected return. Action gives reward $4$ now, then $50\\%$ a state with future value $V=8$ and $50\\%$ one with $V=0$, $\\gamma=0.5$. Compute the expected discounted return.</p>`,
      steps:[
        {do:`Immediate reward contributes $4$.`, why:`Step-1 reward is undiscounted.`},
        {do:`Expected next value $=0.5\\times8+0.5\\times0=4$.`, why:`Average over the random next states.`},
        {do:`Total $=4+0.5\\times4=4+2=6$.`, why:`Add the immediate reward to the discounted expected continuation.`}
      ],
      answer:`$6$` },

    { q:`<p>An MDP has $T(s,a,s_1)=0.4$, $T(s,a,s_2)=p$, $T(s,a,s_3)=2p$. Find $p$ so the distribution is valid, then give all three probabilities.</p>`,
      steps:[
        {do:`Require $0.4+p+2p=1$.`, why:`Transition probabilities must total $1$.`},
        {do:`$3p=0.6\\Rightarrow p=0.2$.`, why:`Solve the linear equation.`},
        {do:`Probabilities: $0.4,\\ 0.2,\\ 0.4$.`, why:`Substitute $p=0.2$ back.`}
      ],
      answer:`$p=0.2$; $(0.4,0.2,0.4)$` }
  ]);

  /* ===================== POLICY & VALUE (harder) ===================== */
  add("ai-policy-value", [
    { q:`<p>Policy yields rewards $r_1=5,\\ r_2=4,\\ r_3=8,\\ r_4=2$ with $\\gamma=0.5$ (deterministic). Compute $V_\\pi$ at the start.</p>`,
      steps:[
        {do:`Discounts: $1,0.5,0.25,0.125$.`, why:`Apply $\\gamma^{i-1}$ to each step.`},
        {do:`Terms: $5,\\ 2,\\ 2,\\ 0.25$.`, why:`$4\\times0.5=2$, $8\\times0.25=2$, $2\\times0.125=0.25$.`},
        {do:`$V_\\pi=5+2+2+0.25=9.25$.`, why:`With no randomness, value equals the discounted utility.`}
      ],
      answer:`$V_\\pi=9.25$` },

    { q:`<p>Compare two policies from the same start, $\\gamma=0.5$. Policy A: rewards $10,0,0$. Policy B: rewards $4,4,4$. Which has higher value?</p>`,
      steps:[
        {do:`A: $10\\times1+0+0=10$.`, why:`Only the first reward survives.`},
        {do:`B: $4+4\\times0.5+4\\times0.25=4+2+1=7$.`, why:`Discount each of B's rewards.`},
        {do:`$10>7$, so Policy A is better.`, why:`Front-loaded reward wins under discounting.`}
      ],
      answer:`Policy A ($10>7$)` },

    { q:`<p>Stochastic policy value at $s$: with prob $0.5$ a run yields utility $12$, with prob $0.5$ it yields utility $4$. Find $V_\\pi(s)$.</p>`,
      steps:[
        {do:`$V_\\pi(s)=0.5\\times12+0.5\\times4$.`, why:`Value is the expectation over random runs.`},
        {do:`$=6+2=8$.`, why:`Average the two utilities.`}
      ],
      answer:`$V_\\pi(s)=8$` },

    { q:`<p>One-step recursion: $V_\\pi(s)=\\text{reward}+\\gamma V_\\pi(s')$. Here reward $=3$, $\\gamma=0.9$, and the policy loops so $s'=s$. Solve for $V_\\pi(s)$.</p>`,
      steps:[
        {do:`$V=3+0.9V$.`, why:`The self-loop makes the next state equal to $s$.`},
        {do:`$V-0.9V=3\\Rightarrow0.1V=3$.`, why:`Collect the $V$ terms.`},
        {do:`$V=30$.`, why:`Divide both sides by $0.1$.`}
      ],
      answer:`$V_\\pi(s)=30$` },

    { q:`<p>Two-state policy. From $A$: reward $2$, go to $B$. From $B$: reward $6$, terminal. $\\gamma=0.5$. Compute $V_\\pi(B)$ then $V_\\pi(A)$.</p>`,
      steps:[
        {do:`$V_\\pi(B)=6+\\gamma\\times0=6$.`, why:`$B$ is terminal, so there is no continuation.`},
        {do:`$V_\\pi(A)=2+0.5\\times V_\\pi(B)=2+0.5\\times6$.`, why:`$A$'s value is its reward plus the discounted value of $B$.`},
        {do:`$=2+3=5$.`, why:`Substitute $V_\\pi(B)=6$.`}
      ],
      answer:`$V_\\pi(B)=6,\\ V_\\pi(A)=5$` },

    { q:`<p>Discounted utility $u=10+10\\gamma+10\\gamma^2+\\dots$ (infinite, constant $10$). For $\\gamma=0.8$, what is $V_\\pi$, and how much does the first reward alone contribute?</p>`,
      steps:[
        {do:`$V_\\pi=10\\times\\frac{1}{1-0.8}=10\\times5=50$.`, why:`Geometric series of a constant reward.`},
        {do:`First reward contributes $10\\times\\gamma^0=10$.`, why:`Step 1 is undiscounted.`},
        {do:`So the first step is $10/50=20\\%$ of the total.`, why:`The remaining $40$ comes from the discounted tail.`}
      ],
      answer:`$V_\\pi=50$; first reward gives $10$` }
  ]);

  /* ===================== Q-VALUE (harder) ===================== */
  add("ai-qvalue", [
    { q:`<p>Three outcomes for action $a$: $0.5$ (reward $4$, $V=8$), $0.3$ (reward $0$, $V=10$), $0.2$ (reward $-2$, $V=0$). $\\gamma=0.5$. Compute $Q(s,a)$.</p>`,
      steps:[
        {do:`Term 1: $0.5\\times[4+0.5\\times8]=0.5\\times8=4$.`, why:`Reward plus discounted next value, weighted by probability.`},
        {do:`Term 2: $0.3\\times[0+0.5\\times10]=0.3\\times5=1.5$.`, why:`Even with zero reward, future value contributes.`},
        {do:`Term 3: $0.2\\times[-2+0]=-0.4$; $Q=4+1.5-0.4=5.1$.`, why:`Sum all weighted outcome values.`}
      ],
      answer:`$Q=5.1$` },

    { q:`<p>Compare two actions to pick the greedy one, $\\gamma=0.5$. Action L: outcomes $0.5(r=6,V=4)$, $0.5(r=2,V=0)$. Action R: $1.0(r=3,V=6)$.</p>`,
      steps:[
        {do:`$Q_L=0.5[6+0.5\\times4]+0.5[2+0]=0.5\\times8+0.5\\times2=4+1=5$.`, why:`Average L's two outcomes (brackets $8$ and $2$).`},
        {do:`$Q_R=1.0[3+0.5\\times6]=3+3=6$.`, why:`R is deterministic with a strong future value.`},
        {do:`$\\max(5,6)=6$, so choose R.`, why:`A greedy agent takes the larger Q-value.`}
      ],
      answer:`$Q_L=5,\\ Q_R=6$; choose R` },

    { q:`<p>Action lands in $s'$ with $V(s')=10$ either way: $0.7$ gives reward $2$, $0.3$ gives reward $-4$. $\\gamma=0.9$. Find $Q$.</p>`,
      steps:[
        {do:`Expected reward $=0.7\\times2+0.3\\times(-4)=1.4-1.2=0.2$.`, why:`Average the immediate rewards.`},
        {do:`Future term $=\\gamma\\times V(s')=0.9\\times10=9$ (same $s'$ both ways).`, why:`Discounted next value, identical across outcomes.`},
        {do:`$Q=0.2+9=9.2$.`, why:`Add expected reward to the discounted future value.`}
      ],
      answer:`$Q=9.2$` },

    { q:`<p>Stochastic action: $0.6$ to a state with $V=5$ (reward $1$), $0.4$ to a state with $V=-5$ (reward $1$). $\\gamma=1$. Compute $Q$ and note the role of $\\gamma=1$.</p>`,
      steps:[
        {do:`Term 1: $0.6\\times[1+1\\times5]=0.6\\times6=3.6$.`, why:`With $\\gamma=1$ future value is undiscounted.`},
        {do:`Term 2: $0.4\\times[1+1\\times(-5)]=0.4\\times(-4)=-1.6$.`, why:`The negative future value drags this branch down.`},
        {do:`$Q=3.6-1.6=2.0$.`, why:`Sum the weighted outcomes.`}
      ],
      answer:`$Q=2.0$` },

    { q:`<p>An action self-loops back to $s$ with probability $1$, reward $2$, and $V(s)=20$, $\\gamma=0.5$. Compute $Q(s,a)$ using the given $V(s)$.</p>`,
      steps:[
        {do:`$Q=1\\times[2+0.5\\times V(s)]=2+0.5\\times20$.`, why:`The successor is $s$ itself, so use $V(s)=20$.`},
        {do:`$=2+10=12$.`, why:`Reward plus discounted self-value.`}
      ],
      answer:`$Q=12$` },

    { q:`<p>Action has $0.5(r=8,V=2)$ and $0.5(r=0,V=2)$, $\\gamma=0.5$. Show $Q$, then explain why $V_\\pi(s)=Q_\\pi(s,a)$ if $\\pi$ always picks $a$.</p>`,
      steps:[
        {do:`Each bracket: $8+0.5\\times2=9$ and $0+0.5\\times2=1$.`, why:`Reward plus discounted next value per outcome.`},
        {do:`$Q=0.5\\times9+0.5\\times1=4.5+0.5=5$.`, why:`Average the weighted outcomes.`},
        {do:`If $\\pi(s)=a$, then $V_\\pi(s)=Q_\\pi(s,a)=5$.`, why:`The state's value under $\\pi$ is exactly the Q-value of the action $\\pi$ selects.`}
      ],
      answer:`$Q=5$; equals $V_\\pi(s)$ when $\\pi(s)=a$` }
  ]);

  /* ===================== VALUE ITERATION (harder) ===================== */
  add("ai-value-iteration", [
    { q:`<p>Chain $A\\to B\\to C$ (terminal). From $A$: reward $1$ to $B$. From $B$: reward $1$ to $C$. $V(C)=0$, $\\gamma=0.5$. Start $V^{(0)}=0$ everywhere. Compute $V^{(1)}$ and $V^{(2)}$ for $A$ and $B$.</p>`,
      steps:[
        {do:`Sweep 1: $V^{(1)}(B)=1+0.5\\times V^{(0)}(C)=1$. $V^{(1)}(A)=1+0.5\\times V^{(0)}(B)=1+0=1$.`, why:`Each state backs up using last sweep's values (all $0$).`},
        {do:`Sweep 2: $V^{(2)}(B)=1+0.5\\times V^{(1)}(C)=1$. $V^{(2)}(A)=1+0.5\\times V^{(1)}(B)=1+0.5=1.5$.`, why:`Now $B$'s updated value flows into $A$.`},
        {do:`So $A$ rises $1\\to1.5$ while $B$ holds at $1$.`, why:`Information propagates one hop per sweep.`}
      ],
      answer:`$V^{(1)}(A,B)=(1,1)$; $V^{(2)}(A,B)=(1.5,1)$` },

    { q:`<p>Continue the previous chain to convergence. $B$'s value is fixed at $1$. Find the converged $V^*(A)$.</p>`,
      steps:[
        {do:`At convergence $V^*(A)=1+0.5\\times V^*(B)=1+0.5\\times1$.`, why:`Once values stop changing, the Bellman equation holds with equality.`},
        {do:`$=1.5$.`, why:`Substitute the fixed $V^*(B)=1$.`},
        {do:`$V^{(2)}(A)=1.5$ already matched, confirming convergence.`, why:`No further sweep changes $A$.`}
      ],
      answer:`$V^*(A)=1.5$` },

    { q:`<p>Self-loop state $s$ with one action: reward $2$, returns to $s$, $\\gamma=0.5$. Do sweeps from $V^{(0)}=0$: give $V^{(1)},V^{(2)},V^{(3)}$ and the fixed point.</p>`,
      steps:[
        {do:`$V^{(1)}=2+0.5\\times0=2$; $V^{(2)}=2+0.5\\times2=3$; $V^{(3)}=2+0.5\\times3=3.5$.`, why:`Each sweep folds in the previous estimate of $s$.`},
        {do:`Fixed point: $V=2+0.5V\\Rightarrow0.5V=2\\Rightarrow V=4$.`, why:`At convergence the value equals its own backup.`},
        {do:`Sweeps $2,3,3.5,\\dots$ climb toward $4$.`, why:`Value iteration converges geometrically to the fixed point.`}
      ],
      answer:`$2,3,3.5\\to4$` },

    { q:`<p>One state, two actions, from $V^{(0)}=0$, $\\gamma=0.5$. Action L: reward $1$ to a state with $V^{(0)}=0$. Action R: reward $0$ to a state with $V^{(0)}=6$ (fixed). Compute $V^{(1)}(s)$ and $\\pi^*(s)$ after this sweep.</p>`,
      steps:[
        {do:`$Q(L)=1+0.5\\times0=1$.`, why:`L's successor still has value $0$.`},
        {do:`$Q(R)=0+0.5\\times6=3$.`, why:`R leads to a high-value state.`},
        {do:`$V^{(1)}=\\max(1,3)=3$, $\\pi^*=R$.`, why:`Value iteration takes the best action's Q-value.`}
      ],
      answer:`$V^{(1)}=3$, action R` },

    { q:`<p>Stochastic action in value iteration. Single action: $0.5$ (reward $4$ to state $X$), $0.5$ (reward $0$ to state $Y$). $V^{(0)}(X)=2$, $V^{(0)}(Y)=6$, $\\gamma=0.5$. Compute $V^{(1)}(s)$.</p>`,
      steps:[
        {do:`$Q=0.5[4+0.5\\times2]+0.5[0+0.5\\times6]$.`, why:`Bellman backup averages over the two outcomes.`},
        {do:`$=0.5\\times5+0.5\\times3=2.5+1.5=4$.`, why:`Brackets are $4+1=5$ and $0+3=3$.`},
        {do:`$V^{(1)}(s)=\\max(4)=4$.`, why:`Only one action, so the max is its Q-value.`}
      ],
      answer:`$V^{(1)}(s)=4$` },

    { q:`<p>Two states $A,B$, each terminal-bound. $A$: reward $3$ to $B$. $B$: reward $5$ to terminal ($V=0$). $\\gamma=0.9$. From $V^{(0)}=0$, run two full sweeps and give $V^{(2)}(A)$.</p>`,
      steps:[
        {do:`Sweep 1: $V^{(1)}(B)=5+0.9\\times0=5$; $V^{(1)}(A)=3+0.9\\times0=3$.`, why:`Both use last sweep's zeros.`},
        {do:`Sweep 2: $V^{(2)}(A)=3+0.9\\times V^{(1)}(B)=3+0.9\\times5$.`, why:`$B$'s updated value now reaches $A$.`},
        {do:`$=3+4.5=7.5$.`, why:`Compute the discounted backup.`}
      ],
      answer:`$V^{(2)}(A)=7.5$` },

    { q:`<p>When do we stop value iteration? A sweep gives $\\max_s|V^{(t)}(s)-V^{(t-1)}(s)|=0.003$ with threshold $\\epsilon=0.01$. Decide and justify.</p>`,
      steps:[
        {do:`Compare the largest change to $\\epsilon$: $0.003<0.01$.`, why:`Convergence is judged by the maximum value change across states.`},
        {do:`Since it is below threshold, stop.`, why:`Values have effectively settled; further sweeps barely move them.`},
        {do:`Read off $\\pi^*(s)=\\arg\\max_a Q(s,a)$ everywhere.`, why:`The greedy policy on converged values is optimal.`}
      ],
      answer:`stop ($0.003<0.01$); extract $\\pi^*$` }
  ]);

})();
