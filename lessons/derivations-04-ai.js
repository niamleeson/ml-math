/* =====================================================================
   DERIVATIONS / PROOFS / INTUITION for the Artificial Intelligence module.
   Same job as the foundations file: WHERE does the formula come from?
   WHY is it true? What is the INTUITION? Short sentences. Prove with ∎.
   ===================================================================== */
(function () {
Object.assign(window.DERIVATIONS, {

/* ---------------------------------------------------------------- */
"ai-linear-predictors":
  `<p>Why is the score a <b>dot product</b>, and why does its sign decide the answer? None of this is arbitrary. It all follows from one wish: weigh up the evidence with a single number.</p>
   <p><b>Where the score comes from.</b> Each feature $\\phi(x)_i$ is one piece of evidence. Each weight $w_i$ says how much that piece matters, and in which direction (a negative weight votes "no").</p>
   <ul class="steps">
     <li>Vote for feature $i$: multiply the evidence by its weight, $w_i\\,\\phi(x)_i$.</li>
     <li>Tally all the votes: add them up, $\\sum_i w_i\\,\\phi(x)_i$.</li>
     <li>That sum <i>is</i> the dot product $w\\cdot\\phi(x)$. So "weigh and total the evidence" forces the dot-product form. ∎</li>
   </ul>
   <p><b>Why the boundary is a hyperplane.</b> The decision flips exactly where the score is zero: $w\\cdot\\phi(x)=0$. That equation is the definition of a flat sheet (a hyperplane) through the origin, with $w$ as its perpendicular. On one side the score is positive ("yes"), on the other negative ("no"). A straight, flat cut: that is what "linear" means.</p>
   <p><b>Why the margin measures confidence.</b> The margin is $m = (w\\cdot\\phi(x))\\cdot y$, where $y$ is the true label ($+1$ or $-1$).</p>
   <ul class="steps">
     <li>If the score and the label have the <i>same</i> sign, their product is positive. We were right.</li>
     <li>If they have <i>opposite</i> signs, the product is negative. We were wrong.</li>
     <li>The <i>size</i> of $m$ is how far the score sat from the zero-boundary: far away means very confident.</li>
   </ul>
   <p><b>Intuition.</b> Picture points in space, split by a flat wall. The score is the signed distance to the wall (scaled by $\\lVert w\\rVert$). Sign tells you which side; distance tells you how sure. The margin folds both into one honest number: big and positive is "correct and confident".</p>`,

/* ---------------------------------------------------------------- */
"ai-loss-minimization":
  `<p>Two questions hide in this formula. Why <b>average</b> the per-example losses? And why bother with hinge or logistic loss when "count the mistakes" sounds simpler?</p>
   <p><b>Why average.</b> We want weights that do well on a typical example, not one lucky one.</p>
   <ul class="steps">
     <li>Add up the loss over all $|D|$ examples: $\\sum_{(x,y)} \\text{Loss}(x,y,w)$. This is the total pain.</li>
     <li>Divide by the count $|D|$. Now it is the <i>average</i> pain per example.</li>
     <li>Dividing by $|D|$ makes the number independent of dataset size, so $10$ examples and $10{,}000$ are on the same scale. That is why we average instead of just summing. ∎</li>
   </ul>
   <p><b>Why zero-one loss is hard to use.</b> Zero-one loss is $1$ for a wrong answer, $0$ for a right one. As you nudge a weight a tiny bit, the score moves a tiny bit, but the count of mistakes does not budge, until it suddenly jumps by a whole $1$. So its slope is $0$ almost everywhere, and undefined at the jump. Gradient descent reads the slope to know which way to step. A flat, jumpy loss gives no direction. It is non-differentiable, so we cannot follow it downhill.</p>
   <p><b>Why a surrogate, and why the hinge has a kink.</b> We swap in a smooth-ish stand-in (a <b>surrogate</b>) that <i>does</i> have a useful slope. Hinge loss is $\\max(1-m,\\,0)$, where $m$ is the margin.</p>
   <ul class="steps">
     <li>When the margin $m \\ge 1$ (correct and confident), $1-m \\le 0$, so the $\\max$ picks $0$. No penalty.</li>
     <li>When $m < 1$, the penalty is $1-m$, a sloped line that grows as the answer gets worse.</li>
     <li>The two pieces meet at $m=1$. That meeting point is the <b>kink</b>: the loss is flat to the right of it and sloped to the left. The kink is exactly the demand "do not just be right, be right by a margin of $1$".</li>
   </ul>
   <p><b>Intuition.</b> Zero-one loss is what we truly care about, but it is blind to direction. The surrogate is a guide that <i>can</i> point downhill, hugs the zero-one shape, and pushes for a safety margin.</p>`,

/* ---------------------------------------------------------------- */
"ai-sgd":
  `<p>Why is it fine to step downhill using just <b>one</b> example? The honest answer: that single-example gradient points the right way <i>on average</i>.</p>
   <p><b>Where the cheapness comes from.</b> The true gradient is itself an average:</p>
   <div class="formula-box">$$ \\nabla_w \\text{TrainLoss}(w) = \\frac{1}{|D|}\\sum_{(x,y)\\in D} \\nabla_w \\text{Loss}(x,y,w) $$</div>
   <ul class="steps">
     <li>Computing this full average means touching <i>every</i> example. For a million examples, that is a million gradients per single step. Slow.</li>
     <li>Pick one example at random. Its gradient $\\nabla_w \\text{Loss}(x,y,w)$ is a sample drawn from that average.</li>
     <li>The average of a randomly chosen term equals the average of all terms. So the one-example gradient is <b>unbiased</b>: its expected value is exactly the true gradient. It points downhill correctly, on average. ∎</li>
   </ul>
   <p><b>Why noisy is okay.</b> Any single example is a rough guess: it points roughly downhill, with some wobble. But you take thousands of cheap steps instead of one expensive one. The wobbles partly cancel, and the net motion is downhill. You trade a little accuracy per step for vastly more steps.</p>
   <p><b>Intuition.</b> Picture descending a foggy hill. The full-batch method surveys the whole hillside before each careful step. SGD glances at the ground under one foot and steps. Each glance is unreliable, but a thousand quick steps beat one slow survey. The minus sign in $w \\leftarrow w - \\eta\\nabla$ just means "go opposite the uphill arrow".</p>`,

/* ---------------------------------------------------------------- */
"ai-search-problem":
  `<p>Why do these <b>five pieces</b> capture any planning task? Because planning, stripped bare, is only ever three things: where you are, what you can do, and what it costs.</p>
   <p><b>Where the pieces come from.</b> Ask what you must know to plan.</p>
   <ul class="steps">
     <li>"Where am I now?" needs a <b>state</b> $s$, and a <b>Start</b> to begin from.</li>
     <li>"What can I do here?" needs $\\text{Actions}(s)$, the moves allowed in this state.</li>
     <li>"What happens if I do it?" needs $\\text{Succ}(s,a)$, the state you land in.</li>
     <li>"What did it cost?" needs $\\text{Cost}(s,a) \\ge 0$.</li>
     <li>"Am I done?" needs $\\text{IsEnd}(s)$, a goal test.</li>
   </ul>
   <p>Nothing else is needed to describe a plan, so these five suffice. ∎</p>
   <p><b>Why the path cost is a sum.</b> A path is a chain of actions. The first costs $\\text{Cost}(s_0,a_0)$, the next $\\text{Cost}(s_1,a_1)$, and so on. Total cost is paid step by step, so it is the <i>sum</i> of the edge costs along the path. There is no interaction between steps, so they simply add.</p>
   <p><b>Intuition.</b> Think of a road trip. The cities are states, the roads are actions, the gas burned on each road is its cost. Any journey is a string of roads, and the fuel used is the costs added up. We want the cheapest string of roads from home to the goal. "States + actions + costs" is just the bare skeleton of every such journey.</p>`,

/* ---------------------------------------------------------------- */
"ai-tree-search":
  `<p>Where does the dreaded $\\mathcal{O}(b^d)$ come from? Let us <b>count the tree</b>, then see why BFS and DFS make different trades.</p>
   <p><b>Deriving the node count.</b> Let $b$ = branching factor (children per node) and $d$ = depth of the goal.</p>
   <ul class="steps">
     <li>Level $0$: the start. That is $1$ node ($b^0$).</li>
     <li>Level $1$: the start has $b$ children. That is $b$ nodes.</li>
     <li>Level $2$: each of those $b$ has $b$ children. That is $b\\times b = b^2$.</li>
     <li>Level $k$: every node from the level above branches $b$ ways, so the count multiplies by $b$ each level. Level $k$ has $b^k$ nodes.</li>
     <li>The bottom level $d$ therefore has about $b^d$ leaves, and that term dominates the total. So the work is $\\mathcal{O}(b^d)$. ∎</li>
   </ul>
   <p><b>Why BFS finds the shortest path (in number of edges).</b> BFS expands every node at depth $1$, then every node at depth $2$, and so on, never skipping a level. So the <i>first</i> goal it reaches sits at the smallest possible depth. When all edges cost the same, fewest edges means cheapest, so BFS returns the shortest path. The price: it must hold an entire level in memory at once, $\\mathcal{O}(b^d)$ nodes.</p>
   <p><b>Why DFS uses little memory but can go wrong.</b> DFS dives down one branch, remembering only the single path it is on, which is at most $d$ nodes deep: $\\mathcal{O}(d)$ memory, tiny. But it commits to one branch fully before trying another. If a branch is infinitely long (a loop, or an unbounded path), DFS walks down it forever and never reaches a goal on another branch.</p>
   <p><b>Intuition.</b> BFS is a ripple spreading evenly outward: it finds the nearest goal first but must remember the whole ripple's edge. DFS is one explorer charging down a tunnel: light to track, but it can vanish down the wrong tunnel. Iterative deepening reruns DFS with a growing depth cap, getting BFS's shallow-goal guarantee with DFS's small footprint.</p>`,

/* ---------------------------------------------------------------- */
"ai-graph-search":
  `<p>Two ideas here both need a proof. Why does dynamic programming demand an <b>acyclic</b> graph? And why is uniform cost search (UCS) <b>correct</b>?</p>
   <p><b>Why DP needs no cycles.</b> The recurrence is $\\text{FutureCost}(s) = \\min_a [\\text{Cost}(s,a) + \\text{FutureCost}(\\text{Succ}(s,a))]$. To compute $\\text{FutureCost}(s)$ you must already know the future cost of its successors. If a cycle existed, say $s$ leads to $t$ and $t$ leads back to $s$, then $s$ needs $t$'s answer and $t$ needs $s$'s answer: each waits on the other, forever. The definition is circular. With <b>no cycles</b> (an acyclic graph), you can always order states so every successor is solved before the state that needs it. ∎</p>
   <p><b>Why UCS is correct (the exchange argument).</b> UCS always pops the frontier node with the smallest $\\text{PastCost}$ (cheapest path found so far). Claim: the first time UCS pops a node, that PastCost is its true cheapest cost. All edge costs are $\\ge 0$.</p>
   <ul class="steps">
     <li>Suppose not. Suppose UCS pops node $u$ at cost $c$, but a truly cheaper path to $u$ exists, with cost $c' < c$.</li>
     <li>That cheaper path starts at the (already-popped) start and must cross from the explored region to the frontier at some node $v$, still unpopped.</li>
     <li>$v$ sits on the cheaper path before $u$, and edge costs are $\\ge 0$, so $\\text{PastCost}(v) \\le c' < c$.</li>
     <li>But then UCS would have popped the cheaper $v$ <i>before</i> the costlier $u$. Contradiction. ∎</li>
   </ul>
   <p>So the moment a node is popped, its shortest path is settled, and we never revisit it.</p>
   <p><b>Why costs must be $\\ge 0$.</b> The argument leaned on "later edges only add cost". A negative edge could make a longer path secretly cheaper, breaking the "pop = settled" guarantee.</p>
   <p><b>Intuition.</b> UCS grows a cheapest-first bubble outward from the start. The closest-by-cost node is always finalized first, because nothing cheaper can sneak in later when every step costs something. This is exactly <b>Dijkstra's algorithm</b>.</p>`,

/* ---------------------------------------------------------------- */
"ai-astar":
  `<p>The big promise: add a guess $h$ and still find the <b>optimal</b> path, as long as $h$ never overestimates. Let us prove it, using the reweighting trick.</p>
   <p><b>The modified cost telescopes.</b> A* runs plain UCS on $\\text{Cost}'(s,a) = \\text{Cost}(s,a) + h(s') - h(s)$, where $s' = \\text{Succ}(s,a)$.</p>
   <ul class="steps">
     <li>Take any path $s_0 \\to s_1 \\to \\dots \\to s_n$. Add up its modified costs.</li>
     <li>The heuristic terms form a chain: $[h(s_1)-h(s_0)] + [h(s_2)-h(s_1)] + \\dots + [h(s_n)-h(s_{n-1})]$.</li>
     <li>Each $h(s_k)$ appears once with a $+$ and once with a $-$, so the middle terms cancel. Only the ends survive: $h(s_n) - h(s_0)$. This collapsing is called <b>telescoping</b>.</li>
     <li>So $\\text{Cost}'(\\text{path}) = \\text{Cost}(\\text{path}) + h(s_n) - h(s_0)$.</li>
   </ul>
   <p>For every path from the same start $s_0$ to the same goal $s_n$, the extra $h(s_n)-h(s_0)$ is the <i>same constant</i> ($h$ at a goal is $0$, and $h(s_0)$ is fixed). Adding the same constant to every path does not change <i>which</i> path is cheapest. So minimizing modified cost = minimizing true cost: A* finds the optimal path. ∎</p>
   <p><b>Why admissibility ($h \\le$ true cost) matters, and why consistency.</b> UCS's correctness needed every edge $\\ge 0$. The modified edges must stay $\\ge 0$, i.e. $\\text{Cost}(s,a) + h(s') - h(s) \\ge 0$, which rearranges to $h(s) \\le \\text{Cost}(s,a) + h(s')$. That is exactly the <b>consistency</b> condition: the guess drops by at most one real step. Consistency keeps the reweighted edges non-negative, so UCS (hence A*) stays correct. Admissibility ($h$ never exceeds the true remaining cost) is the weaker cousin that still guarantees an optimal goal.</p>
   <p><b>Intuition.</b> The heuristic re-tilts the landscape so it slopes toward the goal. Edges pointing goalward get cheaper, edges pointing away get pricier, but every full route to the goal shifts by the <i>same</i> amount. So the best route is unchanged, yet the search now rushes toward the goal instead of spreading out blindly. A* = UCS on a cleverly tilted map.</p>`,

/* ---------------------------------------------------------------- */
"ai-mdp":
  `<p>Two design choices need justifying. Why <b>probabilities</b> on actions? And why the <b>discount</b> $\\gamma$, which turns out to be the trick that keeps an endless sum of rewards finite?</p>
   <p><b>Why probabilities.</b> In the real world one action can have several outcomes: the robot tries to step right, but the floor is slippery, so sometimes it slides up instead. To model this honestly, one action $a$ in state $s$ leads to next state $s'$ only with some chance $T(s,a,s')$. Since <i>something</i> must happen, those chances over all $s'$ add to $1$: $\\sum_{s'} T(s,a,s') = 1$. That is just "the probabilities of all outcomes total $100\\%$".</p>
   <p><b>Why the discount, and the proof it converges.</b> Without an end, total reward could be an infinite sum, possibly infinite in value, and then no plan looks better than another. The discount $\\gamma \\in [0,1)$ shrinks each later reward and tames the sum. Take the worst case: a reward of $1$ every step forever.</p>
   <ul class="steps">
     <li>Total $= 1 + \\gamma + \\gamma^2 + \\gamma^3 + \\dots$. Call this sum $S$.</li>
     <li>Multiply by $\\gamma$: $\\gamma S = \\gamma + \\gamma^2 + \\gamma^3 + \\dots$.</li>
     <li>Subtract: $S - \\gamma S = 1$ (every term past the first cancels).</li>
     <li>Factor: $S(1-\\gamma) = 1$, so $S = \\dfrac{1}{1-\\gamma}$. A finite number whenever $\\gamma < 1$. ∎</li>
   </ul>
   <p>So even an infinite stream of rewards adds up to something finite. With $\\gamma = 0.9$, the cap is $\\tfrac{1}{0.1} = 10$.</p>
   <p><b>Intuition.</b> $\\gamma$ does double duty. It makes the math finite, and it captures impatience: a reward today is worth more than the same reward far in the future, because each step ahead it is multiplied by another $\\gamma < 1$ and fades.</p>`,

/* ---------------------------------------------------------------- */
"ai-policy-value":
  `<p>The value of a plan is its <b>expected discounted reward</b>. Let us see where the discounted utility $u = \\sum_i r_i\\,\\gamma^{i-1}$ comes from, then why value is an average of it.</p>
   <p><b>Deriving the utility.</b> Follow a policy and collect a stream of rewards $r_1, r_2, r_3, \\dots$ ($r_i$ is the reward at step $i$).</p>
   <ul class="steps">
     <li>Step $1$ happens now, so it counts in full: weight $\\gamma^0 = 1$, giving $r_1$.</li>
     <li>Step $2$ is one step later, so discount it once: weight $\\gamma^1$, giving $r_2\\gamma$.</li>
     <li>Step $3$ is two steps later: weight $\\gamma^2$, giving $r_3\\gamma^2$.</li>
     <li>In general step $i$ is $i-1$ steps in the future, so its weight is $\\gamma^{i-1}$.</li>
     <li>Add them: $u = r_1 + r_2\\gamma + r_3\\gamma^2 + \\dots = \\sum_i r_i\\,\\gamma^{i-1}$. ∎</li>
   </ul>
   <p>The exponent is $i-1$, not $i$, precisely so the first reward is undiscounted.</p>
   <p><b>Why value is an average.</b> Because actions are random (from the MDP), following the same policy twice can give different reward streams, hence different utilities $u$. A single run tells you little. The <b>value</b> $V_\\pi(s)$ is the <i>expected</i> (average) utility over all the ways the randomness can unfold, starting from $s$. It is the long-run worth of the plan, not one lucky or unlucky run.</p>
   <p><b>Intuition.</b> Utility is the score of one playthrough, with sooner points worth more. Value is your average score if you played from this spot forever under this strategy. A good policy scores high on average from every state.</p>`,

/* ---------------------------------------------------------------- */
"ai-qvalue":
  `<p>The Bellman relation $Q_\\pi(s,a) = \\sum_{s'} T(s,a,s')[\\text{Reward} + \\gamma V_\\pi(s')]$ looks busy, but it is just <b>one step of bookkeeping</b>: take the action, see where you land, and add up reward now plus discounted future.</p>
   <p><b>Deriving it by conditioning on where you land.</b></p>
   <ul class="steps">
     <li>Do action $a$ in state $s$. You land in some next state $s'$, but which one is random.</li>
     <li>Suppose, for now, you knew you landed in a particular $s'$. Then your worth is: the immediate reward $\\text{Reward}(s,a,s')$, plus everything that follows from $s'$.</li>
     <li>"Everything that follows from $s'$" is just the value of being there, $V_\\pi(s')$, but it happens one step later, so discount it: $\\gamma V_\\pi(s')$.</li>
     <li>So <i>given</i> you land in $s'$, the worth is the bracket $[\\text{Reward}(s,a,s') + \\gamma V_\\pi(s')]$.</li>
     <li>You do not know $s'$ in advance; it occurs with probability $T(s,a,s')$. Average over the possibilities: multiply each bracket by its chance and sum. That is $\\sum_{s'} T(s,a,s')[\\text{Reward} + \\gamma V_\\pi(s')]$. ∎</li>
   </ul>
   <p><b>Why this is exactly an expectation.</b> "Multiply each outcome by its probability and add" is the definition of an average (an expected value). So the Q-value is the expected "reward now + discounted future value", taken over the random landing spot.</p>
   <p><b>Intuition.</b> A Q-value answers "how good is doing $a$ here?" by splitting the future at the very first step: cash in this step's reward, then hand off to the value of wherever you end up. Because the landing is uncertain, you weight each possibility by how likely it is. One step explicit, all the rest folded into $V$.</p>`,

/* ---------------------------------------------------------------- */
"ai-value-iteration":
  `<p>Why does blindly repeating the update $V^{(t)}(s) \\leftarrow \\max_a Q^{(t-1)}(s,a)$ <b>settle</b> on the true optimal values? Because each pass shrinks the error toward zero.</p>
   <p><b>The update is a contraction.</b> A <b>contraction</b> is a step that always pulls things closer together by a fixed factor. Let $V^*$ be the true optimal values, and measure error by the largest gap between our estimate $V^{(t)}$ and $V^*$ across all states.</p>
   <ul class="steps">
     <li>The Bellman update combines a reward, a discount $\\gamma$, and a $\\max$ over actions.</li>
     <li>Reward and the $\\max$ do not magnify a gap. But the future term is multiplied by $\\gamma < 1$.</li>
     <li>So if our values were off by at most $\\epsilon$ before the update, they are off by at most $\\gamma\\,\\epsilon$ after it. (Here $\\epsilon$ just names "the current worst error".)</li>
     <li>Each pass multiplies the worst error by $\\gamma$: after $t$ passes the error is at most $\\gamma^t\\,\\epsilon$. Since $\\gamma < 1$, $\\gamma^t \\to 0$. The estimates close in on $V^*$. ∎</li>
   </ul>
   <p><b>Why it is a fixed point.</b> The true values $V^*$ satisfy the Bellman equation exactly, so applying the update to $V^*$ returns $V^*$ unchanged. Value iteration is walking toward that unmoving target, the gap to it shrinking by $\\gamma$ each step.</p>
   <p><b>Why read off $\\arg\\max$ at the end.</b> $\\max_a$ keeps the best action's <i>value</i>; $\\arg\\max_a$ names the best <i>action</i> itself. Once the values stop moving, the action that looks best in each state is genuinely best, giving the optimal policy $\\pi^*$.</p>
   <p><b>Intuition.</b> Each round, every state copies the value of its best move, computed from last round's numbers. Early numbers are rough, but the discount keeps damping the leftover error, like an echo fading. When the echoes die, the values have converged.</p>`,

/* ---------------------------------------------------------------- */
"ai-q-learning":
  `<p>The update $\\hat Q(s,a) \\leftarrow (1-\\eta)\\hat Q(s,a) + \\eta[r + \\gamma\\max_{a'}\\hat Q(s',a')]$ is just "<b>nudge the old guess toward what you just saw</b>". And remarkably, it works without ever knowing the transition probabilities $T$.</p>
   <p><b>Deriving the nudge form.</b> Let the <b>target</b> be what this one experience suggests $\\hat Q$ should be: $\\text{target} = r + \\gamma\\max_{a'}\\hat Q(s',a')$ (reward seen, plus discounted best future from the new state $s'$).</p>
   <ul class="steps">
     <li>We want to move the old estimate a fraction $\\eta$ of the way toward the target: $\\hat Q \\leftarrow \\hat Q + \\eta(\\text{target} - \\hat Q)$.</li>
     <li>The piece $(\\text{target} - \\hat Q)$ is the surprise: how far off the old guess was.</li>
     <li>Expand: $\\hat Q + \\eta\\,\\text{target} - \\eta\\,\\hat Q = (1-\\eta)\\hat Q + \\eta\\,\\text{target}$.</li>
     <li>That is exactly the blend in the formula. ∎</li>
   </ul>
   <p>So the two faces, "old plus a fraction of the surprise" and "a weighted average of old and target", are the same equation.</p>
   <p><b>Why it works without knowing $T$.</b> The true Bellman update averages over next states using $T$: $\\sum_{s'} T(s,a,s')[\\dots]$. Q-learning never has $T$. Instead, it just <i>acts</i>, and the world hands it a next state $s'$ drawn with probability $T(s,a,s')$ for free. Over many visits, the actual landings occur in proportion to their probabilities, so averaging the sampled targets reproduces that $\\sum T[\\dots]$ expectation. Sampling silently replaces the unknown sum. ∎</p>
   <p><b>Why epsilon-greedy.</b> To learn an action's value you must try it; to score well you should use your best-known action. <b>Exploit</b> the current best most of the time, but <b>explore</b> a random action with small probability $\\epsilon$. Without exploring, you might never discover a better move; without exploiting, you never cash in. Epsilon-greedy holds both.</p>
   <p><b>Intuition.</b> $\\hat Q$ inches toward each fresh observation. One sample is noisy, but the noise averages out across visits, and the noise itself stands in for the probabilities we never measured.</p>`,

/* ---------------------------------------------------------------- */
"ai-minimax":
  `<p>Why is "I take the <b>max</b>, my opponent takes the <b>min</b>" the right plan against a perfect rival? Because it is the safe value, the score you can <b>guarantee</b> no matter how well they play.</p>
   <p><b>Where the rule comes from.</b> Work from the leaves up. Leaves are finished games with known scores (higher = better for you).</p>
   <ul class="steps">
     <li>At a node where it is <i>your</i> move, you get to choose. You will pick the child with the highest value. So that node is worth $\\max_a V(\\text{Succ}(s,a))$.</li>
     <li>At a node where it is the <i>opponent's</i> move, they choose, and a perfect opponent picks the child worst for you, the lowest value. So that node is worth $\\min_a V(\\text{Succ}(s,a))$.</li>
     <li>Apply this at every node, leaves upward, and each node's value is the best outcome the side to move can force from there. ∎</li>
   </ul>
   <p><b>Why this is optimal against a perfect adversary.</b> The min nodes assume the opponent always finds your worst case. So the root value is a <i>guarantee</i>: you can secure at least this score even against flawless play. No strategy can promise more against a perfect opponent, because they would punish any weaker assumption. If the real opponent ever plays imperfectly, you only do better, never worse.</p>
   <p><b>Intuition.</b> Plan for the toughest possible reply to each of your moves, then choose the move whose toughest reply is least bad. Values bubble up from the end of the game: you maximize on your turns, brace for the minimum on theirs.</p>`,

/* ---------------------------------------------------------------- */
"ai-alpha-beta":
  `<p>Alpha-beta skips whole branches yet returns the <b>exact same value</b> as full minimax. The key: it only ever prunes a branch that cannot change the parent's already-secured choice.</p>
   <p><b>The two bookkeeping values.</b> As the search runs it tracks $\\alpha$ = the best (highest) score the maximizer has already guaranteed somewhere, and $\\beta$ = the best (lowest) score the minimizer has already guaranteed somewhere.</p>
   <p><b>Why the $\\alpha \\ge \\beta$ cutoff is safe (proof).</b> Suppose we are exploring inside a min node, and so far its best (lowest) child gives value $v$. As a min node, its final value can only stay at $v$ or drop lower; it can never rise above $v$.</p>
   <ul class="steps">
     <li>The maximizer above already has a guaranteed alternative worth $\\alpha$ elsewhere.</li>
     <li>If this min node has fallen to $v \\le \\alpha$, then its value is $\\le \\alpha$ no matter what the remaining children turn out to be (a min node never climbs back up).</li>
     <li>So the maximizer will never prefer this branch over its $\\alpha$ alternative: this branch cannot change the maximizer's decision.</li>
     <li>Therefore the unexplored children here are irrelevant. Prune them. The reported value is unchanged. ∎</li>
   </ul>
   <p>The symmetric cutoff happens at max nodes when a child rises to $\\ge \\beta$. Either way the condition is $\\alpha \\ge \\beta$: the window of scores that could still matter has closed.</p>
   <p><b>Why the answer is identical to minimax.</b> We only ever discard moves that are provably unable to beat an option already secured. The chosen move, and its backed-up value, are exactly what plain minimax would report. Pruning removes wasted work, never a relevant possibility.</p>
   <p><b>Intuition.</b> Once you have a guaranteed offer in hand, you stop listening to a deal that has already proven it cannot top it. That is the whole trick: abandon doomed branches early, keep the same final decision.</p>`,

/* ---------------------------------------------------------------- */
"ai-expectimax":
  `<p>Why swap the opponent's <b>min</b> for an <b>average</b> $V(s) = \\sum_a \\pi_{opp}(s,a)\\,V(\\text{Succ}(s,a))$? Because if the other side is random, not hostile, the worst case is the wrong thing to plan for.</p>
   <p><b>Where the average comes from.</b> At a chance node the next move is not chosen to hurt you; it is drawn at random, with $\\pi_{opp}(s,a)$ the probability of action $a$.</p>
   <ul class="steps">
     <li>If action $a$ happens, the position is worth $V(\\text{Succ}(s,a))$.</li>
     <li>Action $a$ happens with probability $\\pi_{opp}(s,a)$.</li>
     <li>"Multiply each outcome's value by its probability and add" is the definition of an expected value. So the node is worth $\\sum_a \\pi_{opp}(s,a)\\,V(\\text{Succ}(s,a))$. ∎</li>
   </ul>
   <p><b>Why min would be wrong here.</b> Minimax's $\\min$ assumes the other player always picks your worst outcome. A random player does not: sometimes it stumbles into a move good for you. Taking the min would throw away those lucky chances and make you play too cautiously. The average counts the good outcomes at their real odds.</p>
   <p><b>Why this is value iteration's twin.</b> A fixed random opponent is just part of the environment's randomness, exactly like an MDP's transition probabilities. Expectimax over your moves (still a $\\max$) and the opponent's moves (now a probability-weighted sum) is the same shape as one Bellman backup: maximize on your turn, take an expectation on the random turn.</p>
   <p><b>Intuition.</b> Against a perfect foe, brace for the worst. Against dice or a beginner, plan for the <i>typical</i> result. Replacing min with a weighted average is exactly that change of assumption.</p>`,

/* ---------------------------------------------------------------- */
"ai-csp":
  `<p>Why is an assignment's score the <b>product</b> of its factors, $\\text{Weight}(x) = \\prod_j f_j(x)$? And why does a hard constraint as a $0/1$ factor make weight $1$ mean "all rules satisfied"?</p>
   <p><b>Why multiply, not add.</b> We want a single score that is high only when <i>every</i> rule is happy. Multiplication has the property we need.</p>
   <ul class="steps">
     <li>A hard constraint is a $0/1$ factor: it returns $1$ when its rule holds, $0$ when broken.</li>
     <li>Multiply all factors. If even one returns $0$, the whole product is $0$: $(\\dots)\\times 0 \\times(\\dots) = 0$.</li>
     <li>So a single broken rule kills the score. The product is positive only if <i>no</i> factor is $0$, i.e. every rule holds.</li>
     <li>With addition this would fail: a broken rule (adding $0$) could be masked by other rules' high scores. Multiplication makes a single zero veto everything. ∎</li>
   </ul>
   <p><b>Why weight $1$ means fully satisfied.</b> If all factors are pure $0/1$ hard constraints, the product is $1$ exactly when every factor is $1$, i.e. every constraint is satisfied; and $0$ if any is broken. So "weight $= 1$" is the same statement as "all constraints satisfied". (Soft preferences can use factors above $1$ to reward, but the $0$ still vetoes.)</p>
   <p><b>Intuition.</b> Think of each factor as a gate that is either open ($1$) or shut ($0$). The weight flows through only if <i>every</i> gate is open. One shut gate blocks everything, which is exactly what "this rule must not be broken" should mean.</p>`,

/* ---------------------------------------------------------------- */
"ai-csp-search":
  `<p>Backtracking with forward checking and arc consistency does not magically know the answer. It just <b>prunes dead ends before walking into them</b>. Here is why each trick is valid.</p>
   <p><b>Why backtracking is correct.</b> Assign variables one at a time. After each choice, check the rules among the variables assigned so far. If a constraint is already violated, then <i>no</i> way of filling the remaining variables can fix it, a broken rule stays broken. So that whole subtree is hopeless, and we can safely undo (backtrack) without missing any solution. ∎</p>
   <p><b>Why forward checking helps.</b> The moment you assign a variable, you can delete from each neighbor's domain the values that now conflict. This does not change which solutions exist; it only removes choices that would be rejected later anyway. The payoff: if a neighbor's domain becomes <i>empty</i>, you have proven this branch is doomed right now, instead of discovering it many levels deeper.</p>
   <p><b>Why arc consistency prunes further.</b> A pair of variables is "arc consistent" if every remaining value of one still has some compatible value in the other. If a value has no partner, it can never appear in a solution, so AC-3 deletes it. Deleting one value can leave another value partnerless, so the pruning ripples outward until everything is consistent, again without removing any real solution.</p>
   <p><b>Why most-constrained-variable fails fast (and that is good).</b> Pick the variable with the fewest values left.</p>
   <ul class="steps">
     <li>A variable with $1$ value left is nearly forced. Either it works, or this branch dies, immediately.</li>
     <li>Tackling it first either resolves it or exposes the dead end now, near the top of the tree, where one cut prunes a huge subtree.</li>
     <li>Delaying it would mean discovering the same dead end after wasted work deep down.</li>
   </ul>
   <p>So "hardest first" finds failure early and cheaply. ∎</p>
   <p><b>Intuition.</b> It is like Sudoku: pencil in a number, immediately cross it out of its row, column, and box (forward checking), chase the ripples (arc consistency), and always fill the cell with the fewest candidates first (most constrained). You spot contradictions early and never explore the obviously impossible.</p>`,

/* ---------------------------------------------------------------- */
"ai-bayes-net":
  `<p>The whole point of a Bayes net is the factoring $P(X_1,\\dots,X_n) = \\prod_i P(X_i \\mid \\text{Parents}(i))$. Let us <b>derive</b> it from the chain rule plus conditional independence, then see why it is exponentially smaller.</p>
   <p><b>Step 1: the chain rule (always true).</b> Any joint probability splits into a chain of conditionals:</p>
   <div class="formula-box">$$ P(X_1,\\dots,X_n) = P(X_1)\\,P(X_2\\mid X_1)\\,P(X_3\\mid X_1,X_2)\\cdots P(X_n\\mid X_1,\\dots,X_{n-1}) $$</div>
   <p>This holds for <i>any</i> variables, no assumptions yet. It just peels off one variable at a time.</p>
   <p><b>Step 2: use conditional independence.</b> Order the variables so each comes after its parents. The Bayes net asserts that, given its parents, a node is independent of all its other predecessors. So in the long condition $P(X_i \\mid X_1,\\dots,X_{i-1})$, only the parents matter:</p>
   <div class="formula-box">$$ P(X_i \\mid X_1,\\dots,X_{i-1}) = P(X_i \\mid \\text{Parents}(i)) $$</div>
   <p>Substitute that into the chain rule and the product becomes $\\prod_i P(X_i \\mid \\text{Parents}(i))$. ∎</p>
   <p><b>Why this is exponentially smaller.</b> A full joint table over $n$ true/false variables has $2^n$ rows, one per combination, which explodes ($n=30$ is over a billion). But if each node has at most $k$ parents, each factor $P(X_i\\mid\\text{Parents}(i))$ is a tiny table of about $2^{k+1}$ numbers, and there are only $n$ of them: about $n\\,2^{k+1}$ numbers total. That grows <i>linearly</i> in $n$, not exponentially. For small $k$ the saving is gigantic.</p>
   <p><b>Intuition.</b> The full joint pretends everything depends on everything. The graph says "each thing depends only on its direct causes". Throwing away the irrelevant conditions is what shrinks a galactic table into a handful of small ones.</p>`,

/* ---------------------------------------------------------------- */
"ai-bayes-inference":
  `<p>Inference is just the conditional-probability formula $P(\\text{query}\\mid\\text{evidence}) = \\frac{P(\\text{query},\\text{evidence})}{P(\\text{evidence})}$, computed <b>cleverly</b> so we never build the giant joint table.</p>
   <p><b>Why we can sum out the rest.</b> The numerator needs $P(\\text{query},\\text{evidence})$, which ignores all the other (hidden) variables. To remove a hidden variable, add up the joint over all its possible values, this is <b>marginalizing</b>:</p>
   <div class="formula-box">$$ P(\\text{query},\\text{evidence}) = \\sum_{\\text{hidden}} P(\\text{query},\\text{evidence},\\text{hidden}) $$</div>
   <p>Summing over every value of a variable erases it while keeping the probabilities of what remains correct. That step is always valid.</p>
   <p><b>Variable elimination: why the order matters.</b> Done naively, that sum ranges over every combination of hidden variables, exponential. The smart move: push each sum as far inside the product of factors as it will go, so it only touches the few factors that mention that variable. Sum out one variable, fold the result into a smaller factor, repeat. A good elimination order keeps the intermediate factors small, turning an impossible sum into a sequence of cheap ones.</p>
   <p><b>Gibbs sampling: why resampling one variable works.</b> When even that is too slow, approximate. Fix the evidence. Then repeatedly pick one non-evidence variable and resample it from its probability given its current neighbors, leaving the rest fixed. Over many sweeps these samples visit states in proportion to their true probability, so the fraction of samples where the query is true estimates $P(\\text{query}\\mid\\text{evidence})$. Accuracy for speed.</p>
   <p><b>Explaining away.</b> Two causes feed one effect. Seeing the effect raises both. But confirm <i>one</i> cause, and it alone accounts for the effect, so the rival cause drops back down. Inference computes this automatically: alarm plus a reported earthquake makes burglary <i>less</i> likely again.</p>
   <p><b>Intuition.</b> Exact inference rearranges the arithmetic to sum out clutter in a thrifty order. Sampling skips the arithmetic and lets a random walk vote. Both answer the same question: given what I saw, how likely is what I care about?</p>`,

/* ---------------------------------------------------------------- */
"ai-hmm":
  `<p>An HMM hides the truth $H_t$ and shows only clues $E_t$. The <b>forward-backward</b> algorithm recovers each hidden state by fusing evidence from the past <i>and</i> the future. Here is why that fusion is both possible and tractable.</p>
   <p><b>Why the Markov assumption makes it tractable.</b> The model assumes $H_t$ depends only on $H_{t-1}$ (not the whole history), and $E_t$ depends only on $H_t$. So the joint factors into a clean chain:</p>
   <div class="formula-box">$$ P(H_{1:t},E_{1:t}) = P(H_1)P(E_1\\mid H_1)\\prod_{k=2}^{t} P(H_k\\mid H_{k-1})\\,P(E_k\\mid H_k) $$</div>
   <p>Each factor links only neighbors. Without the Markov assumption, every state would depend on all the others and the sums would explode. The chain structure is exactly what lets us sweep through time once.</p>
   <p><b>Why combine forward and backward.</b> To judge the hidden state at time $t$, all the clues are relevant, both the ones before $t$ and the ones after.</p>
   <ul class="steps">
     <li>The <b>forward</b> pass carries the evidence $E_1,\\dots,E_t$ from the past up to time $t$. It computes the probability of each hidden state given everything seen so far.</li>
     <li>The <b>backward</b> pass carries the evidence $E_{t+1},\\dots$ from the future back to time $t$. It captures how well each hidden state explains what comes next.</li>
     <li>Multiply the two at time $t$ and normalize. Now the estimate uses <i>all</i> the evidence, before and after. That is <b>smoothing</b>. ∎</li>
   </ul>
   <p>Each pass reuses the previous step's answer (thanks to the chain), so the whole thing is two linear sweeps, not an exponential search.</p>
   <p><b>Intuition.</b> Guessing today's weather from an umbrella sighting is sharper if you also know yesterday was wet (forward) and tomorrow stayed wet (backward). A lone dry day surrounded by wet days still reads as "probably rainy", because the future clues vote too. Forward-backward simply lets later evidence reach back and inform earlier states.</p>`,

/* ---------------------------------------------------------------- */
"ai-propositional-logic":
  `<p>What does entailment $\\text{KB} \\models f$ actually <b>mean</b>, and why can a machine check it by pure mechanics? It comes down to one definition and one exhaustive table.</p>
   <p><b>What a model is.</b> A <b>model</b> is one complete assignment of true/false to every symbol. With $n$ symbols there are $2^n$ models, every way the world could be.</p>
   <p><b>What entailment means.</b> $\\text{KB} \\models f$ says: in <i>every</i> model where the knowledge base KB comes out true, the sentence $f$ is also true. No exceptions. If even one model makes KB true but $f$ false, entailment fails.</p>
   <p><b>Why it is mechanical (truth tables).</b> Truth is checkable by rote.</p>
   <ul class="steps">
     <li>List all $2^n$ models in a table, one row each.</li>
     <li>For each row, evaluate KB using the fixed rules of the connectives: $\\neg$ flips, $\\wedge$ is true only if both sides are, $\\vee$ if either is, and $f\\rightarrow g$ is false only when $f$ is true and $g$ false.</li>
     <li>Keep just the rows where KB is true. Check $f$ in those rows.</li>
     <li>If $f$ is true in <i>all</i> of them, then $\\text{KB}\\models f$. Otherwise not. ∎</li>
   </ul>
   <p>No insight is needed, only the rules and patience. That is why a computer can do it.</p>
   <p><b>Why $R, R\\rightarrow W$ entail $W$.</b> Keep only models where both $R$ and $R\\rightarrow W$ are true. For $R\\rightarrow W$ to be true while $R$ is true, $W$ must be true (the implication is false only when the "if" holds but the "then" fails). So every surviving model has $W$ true. Hence $W$ is entailed.</p>
   <p><b>Intuition.</b> Entailment is "$f$ has no way to be false while the KB holds". The truth table is brute force: try every possible world, and if $f$ survives in all the worlds consistent with what you know, then $f$ must follow.</p>`,

/* ---------------------------------------------------------------- */
"ai-inference-rules":
  `<p>Inference rules grind out new truths without a truth table. But a rule is only trustworthy if it is <b>sound</b>. Let us verify modus ponens, then see resolution as proof by contradiction.</p>
   <p><b>Why modus ponens is sound (truth-table check).</b> The claim: from $f$ and $f\\rightarrow g$, we may conclude $g$. Soundness means: in every model where the premises are true, the conclusion is true too.</p>
   <ul class="steps">
     <li>Assume $f$ is true and $f\\rightarrow g$ is true.</li>
     <li>The implication $f\\rightarrow g$ is false in exactly one case: $f$ true and $g$ false. Since here the implication is true and $f$ is true, that forbidden case cannot hold.</li>
     <li>The only remaining option with $f$ true is $g$ true. So $g$ must be true. ∎</li>
   </ul>
   <p>The conclusion never outruns the premises, so the rule introduces no falsehoods.</p>
   <p><b>Resolution as proof by contradiction.</b> To prove $\\text{KB}\\models f$, assume the opposite: add $\\neg f$ to the KB. Resolution repeatedly combines two clauses, cancelling a symbol that appears positive in one and negative in the other, producing a new clause. If this eventually derives the empty clause (a flat contradiction), then KB together with $\\neg f$ is impossible, which means $f$ had to be true all along. Proving "the negation leads to absurdity" is exactly proof by contradiction.</p>
   <p><b>Soundness vs completeness.</b> <b>Sound</b> = "only truths": every derived fact really follows (no lies). <b>Complete</b> = "all truths": every fact that follows can be derived (nothing missed). Resolution is both for propositional logic: it lies about nothing and misses nothing.</p>
   <p><b>A word on first-order logic.</b> Propositional logic only has fixed facts. First-order logic adds <b>quantifiers</b>: "for all $x$" and "there exists $x$", plus variables. So one rule like $\\text{Human}(x)\\rightarrow\\text{Mortal}(x)$ speaks about <i>every</i> object at once. Matching $x = \\text{Socrates}$ lets modus ponens fire on the specific case. This is how logic scales from single facts to whole classes of things.</p>
   <p><b>Intuition.</b> Modus ponens is the one step everyone trusts: given "if rain then wet" and "it is raining", conclude "it is wet". Resolution chains such steps mechanically, and by trying to break the negation, it pins down what must be true.</p>`

});
})();
