/* =====================================================================
   PRACTICE PROBLEMS — MODULE 4 (AI), HARD batch B, set 2.
   ~13-14 additional, genuinely harder, DISTINCT problems per AI id.
   Each step has both `do` and `why`. LaTeX backslashes doubled.
   ===================================================================== */
(function(){ var P=window.PRACTICE; function add(id,probs){P[id]=(P[id]||[]).concat(probs);}

  /* ---------------- Q-learning (multi-episode, scheduling) ---------------- */
  add("ai-q-learning", [
    { q:`<p>Three updates on one $(s,a)$. Start $\\hat Q=0$, every update has target $T=10$, $\\eta=0.5$. Find $\\hat Q$ after three updates and the remaining gap to $10$.</p>`,
      steps:[
        {do:`Update 1: $0.5\\times0+0.5\\times10=5$.`, why:`Blend old $0$ with target $10$.`},
        {do:`Update 2: $0.5\\times5+0.5\\times10=2.5+5=7.5$.`, why:`Old is now $5$.`},
        {do:`Update 3: $0.5\\times7.5+0.5\\times10=3.75+5=8.75$.`, why:`Old is now $7.5$.`},
        {do:`Gap $=10-8.75=1.25$.`, why:`Each step halves the remaining gap, so $10\\to5\\to2.5\\to1.25$.`}
      ],
      answer:`$\\hat Q=8.75$, gap $=1.25$.` },

    { q:`<p>Decaying learning rate $\\eta_t=1/t$. Start $\\hat Q=0$, target $T=6$ every step. Find $\\hat Q$ after $t=1,2,3$.</p>`,
      steps:[
        {do:`$t=1$, $\\eta=1$: $\\hat Q=0+1(6-0)=6$.`, why:`Update form $\\hat Q\\leftarrow\\hat Q+\\eta(T-\\hat Q)$; first sample is the running mean.`},
        {do:`$t=2$, $\\eta=0.5$: $\\hat Q=6+0.5(6-6)=6$.`, why:`Target equals current value, so no change.`},
        {do:`$t=3$, $\\eta=1/3$: $\\hat Q=6+\\tfrac13(6-6)=6$.`, why:`$1/t$ averaging makes $\\hat Q$ the mean of identical targets, which is $6$.`}
      ],
      answer:`$\\hat Q=6$ at every step.` },

    { q:`<p>$1/t$ averaging on varying targets. Start $\\hat Q=0$. Targets are $T_1=3$, $T_2=9$, $T_3=6$, with $\\eta_t=1/t$. Find $\\hat Q$ after each.</p>`,
      steps:[
        {do:`$t=1$: $\\hat Q=3$.`, why:`$\\eta=1$ sets $\\hat Q$ to the first target.`},
        {do:`$t=2$: $\\hat Q=3+\\tfrac12(9-3)=3+3=6$.`, why:`This is the running mean of $3,9$.`},
        {do:`$t=3$: $\\hat Q=6+\\tfrac13(6-6)=6$.`, why:`Mean of $3,9,6$ is $18/3=6$.`}
      ],
      answer:`$\\hat Q=3,6,6$; final $=6$ (the sample mean).` },

    { q:`<p>Two-state propagation, two full passes. Chain $s_1\\to s_2\\to\\text{terminal}$, rewards $0$ then $8$. All $\\hat Q$ start $0$, $\\gamma=1$, $\\eta=1$. Process $(s_1\\to s_2)$ then $(s_2\\to\\text{term})$ each pass. Find $\\hat Q(s_1)$ after pass 2.</p>`,
      steps:[
        {do:`Pass 1, $(s_1\\to s_2)$: target $=0+\\max\\hat Q(s_2)=0$, so $\\hat Q(s_1)=0$.`, why:`$\\hat Q(s_2)$ still $0$.`},
        {do:`Pass 1, $(s_2\\to\\text{term})$: target $=8+0=8$, so $\\hat Q(s_2)=8$.`, why:`Terminal next value $0$.`},
        {do:`Pass 2, $(s_1\\to s_2)$: target $=0+\\max\\hat Q(s_2)=8$, so $\\hat Q(s_1)=8$.`, why:`Now $s_2$ is learned, so it propagates one step back.`}
      ],
      answer:`$\\hat Q(s_1)=8$ after the second pass.` },

    { q:`<p>$\\gamma$ sensitivity. Same target structure: $r=2$, $\\max\\hat Q'=10$, old $\\hat Q=0$, $\\eta=1$. Compute the one-step result for $\\gamma=0$, $\\gamma=0.5$, $\\gamma=1$.</p>`,
      steps:[
        {do:`$\\gamma=0$: target $=2+0=2$.`, why:`No future value counts.`},
        {do:`$\\gamma=0.5$: target $=2+5=7$.`, why:`Half the future value.`},
        {do:`$\\gamma=1$: target $=2+10=12$.`, why:`Full future value; $\\eta=1$ copies the target.`}
      ],
      answer:`$\\hat Q=2,\\,7,\\,12$ for $\\gamma=0,0.5,1$.` },

    { q:`<p>Q-learning vs SARSA gap. From $s$: $r=4$, next state has action values $\\{2,10\\}$; the policy actually takes the action worth $2$. $\\gamma=0.5$, $\\eta=0.5$, old $\\hat Q=4$. Give both updated values.</p>`,
      steps:[
        {do:`Q-learning target $=4+0.5\\times\\max(2,10)=4+5=9$; blend $=0.5\\times4+0.5\\times9=6.5$.`, why:`Off-policy uses the max next value.`},
        {do:`SARSA target $=4+0.5\\times2=5$; blend $=0.5\\times4+0.5\\times5=4.5$.`, why:`On-policy uses the action actually taken, worth $2$.`},
        {do:`Difference $=6.5-4.5=2$.`, why:`The bootstrap target gap $9-5=4$ is halved by $\\eta=0.5$.`}
      ],
      answer:`Q-learning $6.5$, SARSA $4.5$.` },

    { q:`<p>Function-approx Q-learning. $\\hat Q(s,a)=w\\cdot\\phi$, $\\phi=[1,2]$, $w=[0.5,0.5]$. Target $T=4$, step size $\\eta=0.1$. Update $w$ by $w\\leftarrow w+\\eta(T-\\hat Q)\\phi$.</p>`,
      steps:[
        {do:`Predict $\\hat Q=0.5\\times1+0.5\\times2=1.5$.`, why:`Dot product of weights and features.`},
        {do:`Error $=T-\\hat Q=4-1.5=2.5$.`, why:`Difference between target and prediction.`},
        {do:`$w\\leftarrow[0.5,0.5]+0.1\\times2.5\\times[1,2]=[0.5+0.25,\\,0.5+0.5]=[0.75,1.0]$.`, why:`Each weight moves by $\\eta\\cdot\\text{error}\\cdot\\phi_i$.`}
      ],
      answer:`$w=[0.75,\\,1.0]$.` },

    { q:`<p>Epsilon-greedy expected value. $\\epsilon=0.2$, two actions with $\\hat Q$ values $5$ (greedy) and $1$. With prob $1-\\epsilon$ take the greedy, else uniform over both. Expected $\\hat Q$ of the chosen action?</p>`,
      steps:[
        {do:`Greedy chosen w.p. $0.8+0.2\\times0.5=0.9$.`, why:`Exploit $0.8$ plus the $0.5$ chance exploration also lands on the greedy.`},
        {do:`Other chosen w.p. $0.2\\times0.5=0.1$.`, why:`Exploration picks the worse action half the time.`},
        {do:`Expected $=0.9\\times5+0.1\\times1=4.5+0.1=4.6$.`, why:`Weight each action value by its selection probability.`}
      ],
      answer:`$4.6$.` },

    { q:`<p>Reward shaping. True reward $r=0$ but a shaping bonus $F=\\gamma\\Phi(s')-\\Phi(s)$ is added, with $\\Phi(s)=2$, $\\Phi(s')=10$, $\\gamma=0.5$. Old $\\hat Q=0$, $\\max\\hat Q'=0$, $\\eta=1$. Update.</p>`,
      steps:[
        {do:`Shaping $F=0.5\\times10-2=5-2=3$.`, why:`Potential-based shaping uses $\\gamma\\Phi(s')-\\Phi(s)$.`},
        {do:`Shaped reward $=r+F=0+3=3$.`, why:`Add the bonus to the real reward.`},
        {do:`Target $=3+0.5\\times0=3$; $\\hat Q=3$.`, why:`$\\eta=1$ copies the target.`}
      ],
      answer:`$\\hat Q=3$.` },

    { q:`<p>Two distinct transitions from $s$ via the same $a$ (stochastic env). Sample 1: $r=10$, $\\max\\hat Q'=0$. Sample 2: $r=0$, $\\max\\hat Q'=0$. $\\gamma=1$, $\\eta=0.5$, old $\\hat Q=0$, applied in order. Final $\\hat Q$.</p>`,
      steps:[
        {do:`After sample 1: $0.5\\times0+0.5\\times10=5$.`, why:`Target $10$, blend half.`},
        {do:`After sample 2: target $=0$, $0.5\\times5+0.5\\times0=2.5$.`, why:`Target $0$ pulls it back down.`},
        {do:`This estimates the average reward $\\tfrac{10+0}{2}=5$ only loosely; running estimate is $2.5$ now.`, why:`A constant $\\eta$ tracks but does not converge to the exact mean.`}
      ],
      answer:`$\\hat Q=2.5$.` },

    { q:`<p>Convergence target. Constant $\\eta$, fixed target $T$, start $\\hat Q_0$. After $n$ updates $\\hat Q_n=T+(1-\\eta)^n(\\hat Q_0-T)$. With $T=8$, $\\hat Q_0=0$, $\\eta=0.5$, $n=4$, find $\\hat Q_4$.</p>`,
      steps:[
        {do:`$(1-\\eta)^n=0.5^4=0.0625$.`, why:`The old-value weight shrinks geometrically.`},
        {do:`$\\hat Q_4=8+0.0625\\times(0-8)=8-0.5=7.5$.`, why:`Plug into the closed form.`},
        {do:`So $\\hat Q_4=7.5$.`, why:`It approaches $T=8$ as $n$ grows.`}
      ],
      answer:`$\\hat Q_4=7.5$.` },

    { q:`<p>TD error sign. $\\hat Q=6$, $r=1$, $\\gamma=0.9$, $\\max\\hat Q'=5$. Compute the TD error $\\delta=r+\\gamma\\max\\hat Q'-\\hat Q$ and say whether the update raises or lowers $\\hat Q$.</p>`,
      steps:[
        {do:`Target $=1+0.9\\times5=1+4.5=5.5$.`, why:`Reward plus discounted best next value.`},
        {do:`$\\delta=5.5-6=-0.5$.`, why:`TD error is target minus current estimate.`},
        {do:`$\\delta&lt;0$, so the update lowers $\\hat Q$.`, why:`A negative TD error moves the estimate down.`}
      ],
      answer:`$\\delta=-0.5$; $\\hat Q$ decreases.` },

    { q:`<p>Two-step return as a target. $r_1=2$, $r_2=3$, then terminal. $\\gamma=0.5$. Compute the discounted return $G=r_1+\\gamma r_2$ used as the target for the first state.</p>`,
      steps:[
        {do:`$\\gamma r_2=0.5\\times3=1.5$.`, why:`Discount the second reward by one step.`},
        {do:`$G=2+1.5=3.5$.`, why:`Sum the immediate reward and the discounted future reward.`}
      ],
      answer:`$G=3.5$.` },

    { q:`<p>Mixing two learning rates in sequence. Old $\\hat Q=10$. Update A ($\\eta=0.3$, $T=0$), then update B ($\\eta=0.5$, $T=20$). Final $\\hat Q$.</p>`,
      steps:[
        {do:`Update A: $0.7\\times10+0.3\\times0=7$.`, why:`Keep $1-0.3=0.7$ of old, target $0$.`},
        {do:`Update B: $0.5\\times7+0.5\\times20=3.5+10=13.5$.`, why:`Blend the new old $7$ with target $20$.`}
      ],
      answer:`$\\hat Q=13.5$.` }
  ]);

  /* ---------------- Minimax (deeper trees, move selection) ---------------- */
  add("ai-minimax", [
    { q:`<p>Root MIN over three MAX children. A leaves $[8,1,6]$, B leaves $[3,5,4]$, C leaves $[7,2,9]$. Value and the child MIN selects.</p>`,
      steps:[
        {do:`MAX values: A $=\\max(8,1,6)=8$, B $=\\max(3,5,4)=5$, C $=\\max(7,2,9)=9$.`, why:`Each MAX child takes its largest leaf.`},
        {do:`Root MIN $=\\min(8,5,9)=5$.`, why:`MIN takes the smallest MAX value.`},
        {do:`Pick child B.`, why:`B realizes the minimizing value $5$.`}
      ],
      answer:`Value $5$; MIN picks B.` },

    { q:`<p>Four-ply MAX–MIN–MAX–leaf. Root MAX over MIN-L, MIN-R. MIN-L over MAX$[5,1]$, MAX$[3,9]$. MIN-R over MAX$[8,2]$, MAX$[6,7]$. Root value.</p>`,
      steps:[
        {do:`Bottom MAX: $\\max(5,1)=5$, $\\max(3,9)=9$, $\\max(8,2)=8$, $\\max(6,7)=7$.`, why:`Bottom layer is MAX.`},
        {do:`MIN-L $=\\min(5,9)=5$; MIN-R $=\\min(8,7)=7$.`, why:`MIN layer takes the smaller.`},
        {do:`Root $=\\max(5,7)=7$.`, why:`Root maximizes.`}
      ],
      answer:`Root $=7$.` },

    { q:`<p>Depth-4 with all-negative leaves. Root MAX–MIN–MAX. Left MIN over MAX$[-3,-7]$, MAX$[-1,-5]$. Right MIN over MAX$[-2,-8]$, MAX$[-4,-6]$. Root value.</p>`,
      steps:[
        {do:`MAX nodes: $\\max(-3,-7)=-3$, $\\max(-1,-5)=-1$, $\\max(-2,-8)=-2$, $\\max(-4,-6)=-4$.`, why:`MAX takes the largest (least negative).`},
        {do:`Left MIN $=\\min(-3,-1)=-3$; Right MIN $=\\min(-2,-4)=-4$.`, why:`MIN takes the smallest.`},
        {do:`Root $=\\max(-3,-4)=-3$.`, why:`Root takes the larger (less negative).`}
      ],
      answer:`Root $=-3$.` },

    { q:`<p>Ternary tree. Root MAX over MIN-A, MIN-B, MIN-C, each MIN over three leaves. A$[6,2,8]$, B$[7,9,5]$, C$[4,1,3]$. Root value and best move.</p>`,
      steps:[
        {do:`MIN values: A $=\\min(6,2,8)=2$, B $=\\min(7,9,5)=5$, C $=\\min(4,1,3)=1$.`, why:`Each MIN takes its smallest leaf.`},
        {do:`Root $=\\max(2,5,1)=5$.`, why:`MAX takes the largest MIN value.`},
        {do:`Best move is B.`, why:`B guarantees $5$.`}
      ],
      answer:`Root $5$; pick B.` },

    { q:`<p>Mixed leaf-and-subtree. Root MIN has child L = leaf $4$, child M = MAX over $[2,9]$, child R = MAX over $[6,3]$. Root value.</p>`,
      steps:[
        {do:`M $=\\max(2,9)=9$; R $=\\max(6,3)=6$.`, why:`Evaluate the two MAX subtrees.`},
        {do:`Root MIN $=\\min(4,9,6)=4$.`, why:`MIN compares the leaf $4$ against the MAX values.`}
      ],
      answer:`Root $=4$ (pick the leaf child).` },

    { q:`<p>Value of a forced line. Root MAX. Choosing left forces a sequence ending at a leaf worth $-2$; choosing right leads to MIN over $[5,-10]$. Which move is correct and what value?</p>`,
      steps:[
        {do:`Right MIN $=\\min(5,-10)=-10$.`, why:`The opponent picks the worst, $-10$.`},
        {do:`Left forced value $=-2$.`, why:`That branch is a fixed line.`},
        {do:`Root $=\\max(-2,-10)=-2$, pick left.`, why:`MAX avoids the $-10$ trap.`}
      ],
      answer:`Pick left, value $-2$.` },

    { q:`<p>Depth-3 with a tie. Root MAX over MIN-L$[7,3]$ and MIN-R$[3,9]$. Value, and is the best move unique?</p>`,
      steps:[
        {do:`MIN-L $=\\min(7,3)=3$; MIN-R $=\\min(3,9)=3$.`, why:`Each MIN takes its smaller leaf.`},
        {do:`Root $=\\max(3,3)=3$.`, why:`Both branches give $3$.`},
        {do:`Both moves achieve $3$, so the best move is not unique.`, why:`Ties leave more than one optimal action.`}
      ],
      answer:`Value $3$; either branch is optimal.` },

    { q:`<p>Propagating through 4 plies, root MIN. MIN–MAX–MIN–leaf. Root MIN over MAX-X, MAX-Y. MAX-X over MIN$[8,3]$, MIN$[5,7]$. MAX-Y over MIN$[2,9]$, MIN$[6,4]$. Root value.</p>`,
      steps:[
        {do:`Bottom MIN: $\\min(8,3)=3$, $\\min(5,7)=5$, $\\min(2,9)=2$, $\\min(6,4)=4$.`, why:`Bottom layer is MIN.`},
        {do:`MAX-X $=\\max(3,5)=5$; MAX-Y $=\\max(2,4)=4$.`, why:`MAX layer takes the larger.`},
        {do:`Root MIN $=\\min(5,4)=4$.`, why:`Root minimizes.`}
      ],
      answer:`Root $=4$.` },

    { q:`<p>Minimax with a guaranteed-loss branch. Root MAX over two MIN children. MIN-L over leaves $[0,0]$, MIN-R over leaves $[10,-10]$. Which is safer, which is the minimax choice?</p>`,
      steps:[
        {do:`MIN-L $=\\min(0,0)=0$; MIN-R $=\\min(10,-10)=-10$.`, why:`MIN drives R to its worst leaf.`},
        {do:`Root $=\\max(0,-10)=0$, choose MIN-L.`, why:`MAX takes the safe guaranteed $0$.`},
        {do:`MIN-L is safer; the $10$ in R is unreachable against optimal play.`, why:`A rational opponent never gives the $10$.`}
      ],
      answer:`Choose MIN-L, value $0$.` },

    { q:`<p>Depth-5 collapse. A MAX root sits above a 5-ply alternating tree, but every leaf equals $7$. What is the root value, regardless of structure?</p>`,
      steps:[
        {do:`Both $\\min$ and $\\max$ of equal values return that value.`, why:`$\\min(7,7,\\dots)=7$ and $\\max(7,7,\\dots)=7$.`},
        {do:`So every internal node backs up $7$.`, why:`The constant propagates unchanged through any layers.`}
      ],
      answer:`Root $=7$.` },

    { q:`<p>Comparing depths. With root MAX, if you search only depth 1 you see leaves $[2,8]$ directly and pick $8$. At depth 2 those become MIN nodes: the "$8$" branch is MIN$[8,1]$ and the "$2$" branch is MIN$[2,3]$. Does the chosen move change?</p>`,
      steps:[
        {do:`Depth-1 (greedy): pick the branch labeled $8$.`, why:`Shallow search trusts the leaf estimate.`},
        {do:`Depth-2: MIN$[8,1]=1$, MIN$[2,3]=2$.`, why:`The opponent's reply lowers each.`},
        {do:`Root $=\\max(1,2)=2$, pick the other branch.`, why:`Deeper search reveals the $8$ branch is a trap (drops to $1$).`}
      ],
      answer:`Yes; deeper search switches the move (value $2$).` },

    { q:`<p>Backed-up value with a chance of zero. Root MAX over MIN-A$[0,6]$, MIN-B$[5,5]$. Value and move.</p>`,
      steps:[
        {do:`MIN-A $=\\min(0,6)=0$; MIN-B $=\\min(5,5)=5$.`, why:`Each MIN takes the smaller leaf.`},
        {do:`Root $=\\max(0,5)=5$, pick B.`, why:`B guarantees $5$; A could be driven to $0$.`}
      ],
      answer:`Value $5$, pick B.` },

    { q:`<p>Full 8-leaf tree, root MAX. Left MIN over MAX$[3,5]$, MAX$[6,1]$. Right MIN over MAX$[7,2]$, MAX$[4,8]$. Give every node value bottom-up and the root.</p>`,
      steps:[
        {do:`MAX nodes: $\\max(3,5)=5$, $\\max(6,1)=6$, $\\max(7,2)=7$, $\\max(4,8)=8$.`, why:`Bottom layer maximizes.`},
        {do:`Left MIN $=\\min(5,6)=5$; Right MIN $=\\min(7,8)=7$.`, why:`MIN layer minimizes.`},
        {do:`Root $=\\max(5,7)=7$.`, why:`Root maximizes over the two MIN values.`}
      ],
      answer:`Root $=7$.` },

    { q:`<p>Asymmetric tree. Root MAX. Branch 1 is a single leaf $4$. Branch 2 is MIN over MAX$[1,5]$ and a leaf $6$. Root value.</p>`,
      steps:[
        {do:`Inner MAX $=\\max(1,5)=5$.`, why:`Evaluate the deeper MAX node.`},
        {do:`Branch 2 MIN $=\\min(5,6)=5$.`, why:`MIN compares the MAX value against the leaf $6$.`},
        {do:`Root $=\\max(4,5)=5$, pick branch 2.`, why:`MAX takes the larger.`}
      ],
      answer:`Root $=5$.` }
  ]);

  /* ---------------- Alpha-beta (deeper traces, prune counting) ---------------- */
  add("ai-alpha-beta", [
    { q:`<p>Depth-3 MAX root, three MIN children scanned L-to-R, each two leaves. MIN-A$[5,7]$, MIN-B$[2,?]$, MIN-C$[8,6]$. Trace $\\alpha$ and list pruned leaves.</p>`,
      steps:[
        {do:`MIN-A $=\\min(5,7)=5$; set $\\alpha=5$.`, why:`MAX secures $5$.`},
        {do:`MIN-B first leaf $2$: value $\\le2&lt;5$, prune MIN-B's second leaf.`, why:`MIN-B cannot beat $5$.`},
        {do:`MIN-C: $\\min(8,6)=6&gt;5$, no prune; root $=\\max(5,6)=6$.`, why:`MIN-C improves on $5$.`}
      ],
      answer:`Prune MIN-B's 2nd leaf; root $=6$.` },

    { q:`<p>MIN root, three MAX children L-to-R, each two leaves. MAX-A$[2,4]$, MAX-B$[9,?]$, MAX-C$[1,3]$. Trace $\\beta$ and find pruned leaves.</p>`,
      steps:[
        {do:`MAX-A $=\\max(2,4)=4$; root MIN sets $\\beta=4$.`, why:`MIN can hold to $\\le4$.`},
        {do:`MAX-B first leaf $9$: value $\\ge9\\ge\\beta=4$, prune MAX-B's second leaf.`, why:`MIN will reject anything $\\ge\\beta$, so the rest of B is irrelevant.`},
        {do:`MAX-C $=\\max(1,3)=3&lt;4$; root $=\\min(4,3)=3$.`, why:`MAX-C lowers the MIN to $3$.`}
      ],
      answer:`Prune MAX-B's 2nd leaf; root $=3$.` },

    { q:`<p>Count leaf examinations. MAX root, two MIN children, each three leaves, scanned L-to-R. MIN-L$[6,4,7]$, MIN-R$[3,?,?]$. How many of the 6 leaves are examined?</p>`,
      steps:[
        {do:`MIN-L reads all three: $\\min(6,4,7)=4$, $\\alpha=4$. (3 leaves)`, why:`The first MIN node has no floor to prune against.`},
        {do:`MIN-R first leaf $3$: $\\le3&lt;\\alpha=4$, prune the remaining two leaves of MIN-R. (1 leaf)`, why:`MIN-R cannot beat $4$ once it hits $3$.`},
        {do:`Total examined $=3+1=4$ of $6$.`, why:`Two leaves under MIN-R are skipped.`}
      ],
      answer:`$4$ leaves examined; $2$ pruned.` },

    { q:`<p>Worst ordering, leaf count. MAX root, two MIN children $[1,2]$ and $[8,9]$, but the low subtree $[1,2]$ is searched first. How many leaves are examined, and could reordering do better?</p>`,
      steps:[
        {do:`MIN-L $=\\min(1,2)=1$, $\\alpha=1$. (2 leaves)`, why:`Weak first branch gives a low floor.`},
        {do:`MIN-R: $8&gt;1$ and $9&gt;1$, no prune; read both. (2 leaves) Root $=\\max(1,8)=8$.`, why:`Nothing prunes; MIN-R $=8$.`},
        {do:`All $4$ examined. Searching $[8,9]$ first ($\\alpha=8$) would prune in $[1,2]$.`, why:`A high first branch enables a cutoff.`}
      ],
      answer:`$4$ leaves; reordering high-first would prune one.` },

    { q:`<p>Deep cutoff inside a MAX node under MIN. MIN root has MAX-L returning $7$ (both its leaves $7$), so $\\beta=7$. MAX-R sees leaf $9$ first. Prune?</p>`,
      steps:[
        {do:`After MAX-L, $\\beta=7$ at the MIN root.`, why:`MIN can hold the value to $\\le7$.`},
        {do:`MAX-R sees $9$: that MAX node $\\ge9\\ge\\beta=7$.`, why:`A MAX node only rises from its first leaf.`},
        {do:`Since $9\\ge\\beta$, prune the rest of MAX-R.`, why:`MIN will never choose a value $\\ge7$; MAX-R is dead.`}
      ],
      answer:`Prune MAX-R's remaining leaves; root $=7$.` },

    { q:`<p>3-ply with an early equal. MAX root, MIN-A$[5,5]$, MIN-B$[5,?]$. After MIN-A, $\\alpha=5$. MIN-B's first leaf is $5$. Does the rule $\\alpha\\ge\\beta$ prune MIN-B's second leaf?</p>`,
      steps:[
        {do:`MIN-A $=5$, $\\alpha=5$.`, why:`Floor of $5$.`},
        {do:`MIN-B first leaf $5$: its running $\\beta=5$. Test $\\alpha\\ge\\beta$: $5\\ge5$ holds.`, why:`Equality triggers the cutoff in the standard $\\alpha\\ge\\beta$ rule.`},
        {do:`Prune MIN-B's second leaf.`, why:`MIN-B can only fall to $\\le5$, never improving on $\\alpha=5$.`}
      ],
      answer:`Yes, prune (since $5\\ge5$).` },

    { q:`<p>Best-case leaf bound. Branching $b=2$, depth $d=4$. Plain minimax visits $b^d$ leaves; ideal alpha-beta visits about $2b^{d/2}-1$. Compare the two counts.</p>`,
      steps:[
        {do:`Plain $=2^4=16$.`, why:`Minimax visits every leaf.`},
        {do:`Ideal $\\approx2\\times2^{2}-1=2\\times4-1=7$.`, why:`Optimal ordering roughly square-roots the leaf count.`}
      ],
      answer:`$16$ vs $\\approx7$ leaves.` },

    { q:`<p>Two-level pruning chain. MAX root over MIN-L, MIN-R. MIN-L $=3$ already, $\\alpha=3$. MIN-R has MAX children; its first MAX child reads leaf $2$ then $1$ giving $2$, so MIN-R $\\le2&lt;3$. Prune MIN-R's remaining MAX child?</p>`,
      steps:[
        {do:`MIN-R's first MAX child $=\\max(2,1)=2$, so MIN-R $\\le2$.`, why:`MIN takes the smallest child seen so far.`},
        {do:`$2&lt;\\alpha=3$, so prune MIN-R's second MAX child entirely.`, why:`MIN-R can never reach $3$, so its other subtree is irrelevant.`}
      ],
      answer:`Prune the whole second MAX subtree; root $=3$.` },

    { q:`<p>Alpha unchanged by a worse branch. MAX root, MIN-L $=6$ ($\\alpha=6$), MIN-R $=4$. After evaluating both, what is $\\alpha$ at the root and the chosen move?</p>`,
      steps:[
        {do:`MIN-R $=4&lt;\\alpha=6$, so it does not raise $\\alpha$.`, why:`MAX only updates $\\alpha$ when a child beats it.`},
        {do:`Root value $=\\max(6,4)=6$, keep MIN-L.`, why:`The first branch stays best.`}
      ],
      answer:`$\\alpha=6$; pick MIN-L.` },

    { q:`<p>Pruning at depth 4. MAX-MIN-MAX-leaf. Root MAX, MIN-L fully gives $5$, $\\alpha=5$. Under MIN-R, the first MAX child evaluates to $4$, setting MIN-R's $\\beta=4$. Is MIN-R pruned, and what is the root?</p>`,
      steps:[
        {do:`MIN-R's $\\beta=4$ after its first MAX child returns $4$.`, why:`MIN-R $\\le4$.`},
        {do:`Test $\\alpha\\ge\\beta$: $5\\ge4$ holds, prune MIN-R's remaining children.`, why:`MIN-R cannot beat the secured $5$.`},
        {do:`Root $=\\max(5,\\le4)=5$.`, why:`MIN-L wins.`}
      ],
      answer:`Prune MIN-R; root $=5$.` },

    { q:`<p>No prune despite a low leaf. MAX root, $\\alpha=4$. A MIN-R child is a MAX node whose first leaf is $1$. Can we prune the MAX node's second leaf?</p>`,
      steps:[
        {do:`The node is MAX, so seeing $1$ means it is $\\ge1$, not $\\le1$.`, why:`MAX rises from its first leaf; it could exceed $\\alpha$.`},
        {do:`No cutoff yet: we must read the second leaf.`, why:`Pruning needs $\\alpha\\ge\\beta$, which a single low MAX leaf does not establish.`}
      ],
      answer:`No prune; read the MAX node's second leaf.` },

    { q:`<p>Full trace, prune list. MAX root, MIN-A$[10,11]$, MIN-B$[6,7]$. Scan A first. Give the root value and any prunes.</p>`,
      steps:[
        {do:`MIN-A $=\\min(10,11)=10$; both leaves read (no $\\alpha$ yet). $\\alpha=10$.`, why:`The first MIN node has no floor to cut against.`},
        {do:`MIN-B first leaf $6\\le\\alpha=10$, prune MIN-B's second leaf.`, why:`MIN-B $\\le6$ cannot beat $10$.`},
        {do:`Root $=\\max(10,\\le6)=10$.`, why:`MIN-A wins.`}
      ],
      answer:`Prune MIN-B's 2nd leaf; root $=10$.` },

    { q:`<p>Why ordering matters, quantified. Root MAX with MIN children whose values would be $\\{9,1,1,1\\}$, each MIN having 2 leaves. (a) If the $9$-branch is searched first, count examined leaves. (b) Worst ordering ($1$-branches first)?</p>`,
      steps:[
        {do:`(a) Read the $9$-branch fully (2 leaves), $\\alpha=9$; each other branch prunes after 1 leaf: $3\\times1=3$. Total $=5$.`, why:`A strong first move sets a high $\\alpha$ that cuts the rest fast.`},
        {do:`(b) The $1$-branches first keep $\\alpha=1$, so the $9$-branch reads both leaves and none prune: $4\\times2=8$.`, why:`Low first moves prevent cutoffs.`}
      ],
      answer:`(a) $5$ leaves; (b) $8$ leaves.` },

    { q:`<p>MIN root cutoff via $\\beta$. MIN root over MAX-A$[5,8]$ (so MAX-A $=8$, $\\beta=8$) and MAX-B whose first leaf is $9$. Prune MAX-B's rest?</p>`,
      steps:[
        {do:`MAX-A $=\\max(5,8)=8$; root MIN $\\beta=8$.`, why:`MIN secures a ceiling of $8$.`},
        {do:`MAX-B first leaf $9\\ge\\beta=8$, so MAX-B $\\ge9$.`, why:`A MAX node only climbs.`},
        {do:`Prune MAX-B's remaining leaves; root $=\\min(8,\\ge9)=8$.`, why:`MIN rejects MAX-B since it exceeds $\\beta$.`}
      ],
      answer:`Prune MAX-B's rest; root $=8$.` }
  ]);

  /* ---------------- Expectimax (mixed layers, comparisons) ---------------- */
  add("ai-expectimax", [
    { q:`<p>MAX over chance over MAX. Root MAX picks chance-L or chance-R. Chance-L: $0.5\\to$MAX$[3,7]$, $0.5\\to$MAX$[2,6]$. Chance-R: sure $5$. Best move and value.</p>`,
      steps:[
        {do:`Inner MAX: $\\max(3,7)=7$, $\\max(2,6)=6$.`, why:`Resolve the MAX subtrees first.`},
        {do:`Chance-L $=0.5\\times7+0.5\\times6=3.5+3=6.5$.`, why:`Average the MAX values.`},
        {do:`Root $=\\max(6.5,5)=6.5$, pick chance-L.`, why:`MAX takes the higher expectation.`}
      ],
      answer:`Pick chance-L, value $6.5$.` },

    { q:`<p>Chance over MIN over leaves. Root chance: $0.3\\to$MIN$[8,4]$, $0.7\\to$MIN$[6,2]$. Expected value.</p>`,
      steps:[
        {do:`MIN values: $\\min(8,4)=4$, $\\min(6,2)=2$.`, why:`Each MIN takes its smaller leaf.`},
        {do:`Expected $=0.3\\times4+0.7\\times2=1.2+1.4=2.6$.`, why:`Weight each MIN value by its probability.`}
      ],
      answer:`$2.6$.` },

    { q:`<p>Die-based chance. A fair 6-sided die: outcomes worth $1,2,3,4,5,6$ each prob $1/6$. Expected value of the chance node.</p>`,
      steps:[
        {do:`Sum $=1+2+3+4+5+6=21$.`, why:`Add all equally likely outcomes.`},
        {do:`Expected $=21/6=3.5$.`, why:`Divide by the number of outcomes.`}
      ],
      answer:`$3.5$.` },

    { q:`<p>Expectimax vs minimax choice. Root over two actions. Action A: chance $0.5$ each over $\\{0,12\\}$. Action B: chance $0.5$ each over $\\{5,7\\}$. (a) Expectimax pick. (b) Minimax (worst-case) pick.</p>`,
      steps:[
        {do:`(a) E[A]$=0.5\\times0+0.5\\times12=6$; E[B]$=0.5\\times5+0.5\\times7=6$. Tie; either.`, why:`Both have expectation $6$.`},
        {do:`(b) Worst of A $=0$, worst of B $=5$; minimax picks B.`, why:`Worst-case reasoning prefers the safe floor of $5$.`}
      ],
      answer:`(a) tie at $6$; (b) minimax picks B.` },

    { q:`<p>Nested chance. Root chance: $0.5\\to$ a chance node ($0.5$ each over $\\{4,8\\}$), $0.5\\to$ leaf $2$. Expected value.</p>`,
      steps:[
        {do:`Inner chance $=0.5\\times4+0.5\\times8=6$.`, why:`Average the inner outcomes.`},
        {do:`Root $=0.5\\times6+0.5\\times2=3+1=4$.`, why:`Average the inner chance value with the leaf.`}
      ],
      answer:`$4$.` },

    { q:`<p>Risk vs reward. Action Safe pays $5$ for sure. Action Risky: $0.7$ pays $7$, $0.3$ pays $0$. Which does expectimax choose?</p>`,
      steps:[
        {do:`E[Risky]$=0.7\\times7+0.3\\times0=4.9$.`, why:`Weight the payoffs.`},
        {do:`E[Safe]$=5$.`, why:`A sure payoff.`},
        {do:`$\\max(5,4.9)=5$, choose Safe.`, why:`Expectimax maximizes expected value.`}
      ],
      answer:`Choose Safe ($5&gt;4.9$).` },

    { q:`<p>MAX over two chance nodes with 3 outcomes each. Chance-L: $(0.2,0.3,0.5)$ over $(10,0,4)$. Chance-R: $(0.5,0.5)$ over $(6,3)$. Best move.</p>`,
      steps:[
        {do:`E[L]$=0.2\\times10+0.3\\times0+0.5\\times4=2+0+2=4$.`, why:`Weighted sum of L's outcomes.`},
        {do:`E[R]$=0.5\\times6+0.5\\times3=3+1.5=4.5$.`, why:`Weighted sum of R's outcomes.`},
        {do:`$\\max(4,4.5)=4.5$, pick R.`, why:`Higher expectation.`}
      ],
      answer:`Pick R, value $4.5$.` },

    { q:`<p>Chance node with a negative outcome. Outcomes $(+10,-6)$ with probs $(0.4,0.6)$. Expected value, and is it worth playing vs a sure $0$?</p>`,
      steps:[
        {do:`E$=0.4\\times10+0.6\\times(-6)=4-3.6=0.4$.`, why:`Weight the gain and the loss.`},
        {do:`$0.4&gt;0$, so playing beats the sure $0$.`, why:`Positive expectation favors the gamble.`}
      ],
      answer:`E$=0.4$; play it.` },

    { q:`<p>Four-ply MAX-chance-MIN-leaf. Root MAX over chance-L only (one action). Chance-L: $0.5\\to$MIN$[9,3]$, $0.5\\to$MIN$[7,1]$. Root value.</p>`,
      steps:[
        {do:`MIN values: $\\min(9,3)=3$, $\\min(7,1)=1$.`, why:`Opponent minimizes each branch.`},
        {do:`Chance-L $=0.5\\times3+0.5\\times1=1.5+0.5=2$.`, why:`Average the MIN values.`},
        {do:`Root MAX $=2$ (only one action).`, why:`MAX over a single child is that child.`}
      ],
      answer:`Root $=2$.` },

    { q:`<p>Effect of probability shift. Chance node over $\\{12,0\\}$. (a) value at probs $(0.5,0.5)$. (b) value at $(0.75,0.25)$. (c) which probability of the $12$ outcome makes the value $9$?</p>`,
      steps:[
        {do:`(a) $0.5\\times12=6$.`, why:`Half weight on $12$, the $0$ adds nothing.`},
        {do:`(b) $0.75\\times12=9$.`, why:`More weight on $12$ raises the mean.`},
        {do:`(c) Need $p\\times12=9\\Rightarrow p=0.75$.`, why:`Solve $12p=9$.`}
      ],
      answer:`(a) $6$, (b) $9$, (c) $p=0.75$.` },

    { q:`<p>MAX with one stochastic and one deterministic deep branch. Action L: chance $0.5\\to$MAX$[1,9]$, $0.5\\to$ leaf $0$. Action R: MIN$[6,4]$. Best move and value.</p>`,
      steps:[
        {do:`L inner MAX $=\\max(1,9)=9$; chance-L $=0.5\\times9+0.5\\times0=4.5$.`, why:`Resolve the MAX then average with the leaf.`},
        {do:`R MIN $=\\min(6,4)=4$.`, why:`Opponent minimizes.`},
        {do:`Root $=\\max(4.5,4)=4.5$, pick L.`, why:`L's expectation edges out R.`}
      ],
      answer:`Pick L, value $4.5$.` },

    { q:`<p>Expectiminimax (one of each). Root MAX over action A only. A leads to a chance node: $0.5\\to$MIN$[10,2]$, $0.5\\to$MAX$[3,5]$. Value.</p>`,
      steps:[
        {do:`MIN $=\\min(10,2)=2$; MAX $=\\max(3,5)=5$.`, why:`Resolve each child by its node type.`},
        {do:`Chance $=0.5\\times2+0.5\\times5=1+2.5=3.5$.`, why:`Average across the two outcomes.`}
      ],
      answer:`$3.5$.` },

    { q:`<p>Weighted by a loaded die. A die lands $6$ with prob $0.5$ (worth $12$) and each of $1$–$5$ with prob $0.1$ (worth $0$). Expected value.</p>`,
      steps:[
        {do:`Big outcome: $0.5\\times12=6$.`, why:`Half the mass pays $12$.`},
        {do:`Others: $5\\times0.1\\times0=0$.`, why:`The five low faces pay $0$.`},
        {do:`Total $=6$.`, why:`Sum the contributions.`}
      ],
      answer:`$6$.` },

    { q:`<p>Bounding a chance value. A chance node has outcomes in $[0,10]$ with probs $(0.5,0.5)$; the first outcome is $2$. Bound the chance value before seeing the second outcome.</p>`,
      steps:[
        {do:`Known so far: $0.5\\times2=1$ from the first outcome.`, why:`That contribution is fixed.`},
        {do:`Second outcome contributes $0.5\\times[0,10]\\in[0,5]$.`, why:`Bounded by the value range times its probability.`},
        {do:`So chance value $\\in[1,6]$.`, why:`Add the fixed part to the bounded remainder; exact pruning needs value bounds.`}
      ],
      answer:`Value $\\in[1,6]$ (cannot prune without bounds).` }
  ]);

  /* ---------------- CSP (factor products, propagation, counting) ---------------- */
  add("ai-csp", [
    { q:`<p>Four factors $f_1=2$, $f_2=1$, $f_3=3$, $f_4=0.5$. Weight, and the max possible if a fifth hard factor must be $0$ or $1$?</p>`,
      steps:[
        {do:`Weight $=2\\times1\\times3\\times0.5=3$.`, why:`Product of all four factor scores.`},
        {do:`A hard factor of $0$ would force weight $0$; of $1$ keeps it $3$.`, why:`Hard constraints output $0$ or $1$.`}
      ],
      answer:`Weight $3$ (or $0$ if the hard factor fails).` },

    { q:`<p>Line $A-B-C-D$, "adjacent differ", 2 colors $\\{R,G\\}$. How many valid full colorings?</p>`,
      steps:[
        {do:`Pick $A$: 2 ways. Each later node must differ from its predecessor: 1 way each.`, why:`With 2 colors, a node adjacent to a colored neighbor has exactly one legal color.`},
        {do:`Total $=2\\times1\\times1\\times1=2$.`, why:`Only the two alternating patterns RGRG and GRGR work.`}
      ],
      answer:`$2$ valid colorings.` },

    { q:`<p>Cycle of 3 nodes $A-B-C-A$ (triangle), "adjacent differ", 3 colors. Count valid colorings.</p>`,
      steps:[
        {do:`$A$: 3 choices. $B\\ne A$: 2 choices. $C\\ne A$ and $C\\ne B$: 1 choice.`, why:`In a triangle all three pairwise differ, so $C$ is forced.`},
        {do:`Total $=3\\times2\\times1=6$.`, why:`Multiply the independent counts.`}
      ],
      answer:`$6$ valid colorings.` },

    { q:`<p>Max-weight assignment with unary + binary factors. $X,Y\\in\\{0,1\\}$. Unary $f(X)$: $f(0)=1,f(1)=4$. Unary $g(Y)$: $g(0)=3,g(1)=1$. Binary $h$: $h=5$ if $X=Y$, else $1$. Best assignment.</p>`,
      steps:[
        {do:`$(0,0)$: $1\\times3\\times5=15$. $(1,1)$: $4\\times1\\times5=20$.`, why:`$X=Y$ branches use $h=5$.`},
        {do:`$(0,1)$: $1\\times1\\times1=1$. $(1,0)$: $4\\times3\\times1=12$.`, why:`$X\\ne Y$ branches use $h=1$.`},
        {do:`Max $=20$ at $(1,1)$.`, why:`Highest product.`}
      ],
      answer:`Best $(X,Y)=(1,1)$, weight $20$.` },

    { q:`<p>Count solutions with $X+Y$ even. $X,Y\\in\\{1,2,3\\}$, factor $=1$ if $X+Y$ even else $0$. How many valid pairs?</p>`,
      steps:[
        {do:`$X+Y$ even means both odd or both even.`, why:`Sum of two numbers is even iff parities match.`},
        {do:`Odd values: $\\{1,3\\}$ (2 each) $\\to2\\times2=4$; even value: $\\{2\\}$ (1 each) $\\to1\\times1=1$.`, why:`Count matching-parity pairs.`},
        {do:`Total $=4+1=5$.`, why:`Add the two cases.`}
      ],
      answer:`$5$ valid pairs.` },

    { q:`<p>Propagation by counting extensions. Path $A-B-C$, adjacent differ, domain $\\{1,2,3,4\\}$, fix $A=2$. How many valid $(B,C)$?</p>`,
      steps:[
        {do:`$B\\ne 2$: 3 choices.`, why:`Remove $A$'s value from B.`},
        {do:`$C\\ne B$: 3 choices each (any of 4 except $B$; A and C not adjacent).`, why:`Only the B–C edge constrains C.`},
        {do:`Total $=3\\times3=9$.`, why:`Multiply.`}
      ],
      answer:`$9$ valid $(B,C)$.` },

    { q:`<p>Star graph: center $X$ adjacent to three leaves $L_1,L_2,L_3$ (leaves not adjacent to each other), "differ", 3 colors. Count valid colorings.</p>`,
      steps:[
        {do:`$X$: 3 choices.`, why:`The center is free.`},
        {do:`Each leaf $\\ne X$: 2 choices, leaves independent.`, why:`Leaves only constrain against the center.`},
        {do:`Total $=3\\times2^3=24$.`, why:`Multiply center by the three leaf choices.`}
      ],
      answer:`$24$ valid colorings.` },

    { q:`<p>Product of two factor tables. $X\\in\\{a,b\\}$. $f(a)=2,f(b)=6$; $g(a)=4,g(b)=1$. Form the product factor $h=f\\cdot g$ and find $\\arg\\max_X h$.</p>`,
      steps:[
        {do:`$h(a)=2\\times4=8$.`, why:`Multiply the two tables pointwise at $a$.`},
        {do:`$h(b)=6\\times1=6$.`, why:`Same at $b$.`},
        {do:`$\\arg\\max=a$ (weight $8$).`, why:`$8&gt;6$.`}
      ],
      answer:`$X=a$, $h=8$.` },

    { q:`<p>Sum-out (marginalize) a factor. Joint factor $w(X,Y)$: $w(0,0)=2,w(0,1)=3,w(1,0)=1,w(1,1)=4$. Marginalize out $Y$ to get $w'(X)$.</p>`,
      steps:[
        {do:`$w'(0)=w(0,0)+w(0,1)=2+3=5$.`, why:`Sum over both values of $Y$ at $X=0$.`},
        {do:`$w'(1)=w(1,0)+w(1,1)=1+4=5$.`, why:`Same at $X=1$.`}
      ],
      answer:`$w'(0)=5$, $w'(1)=5$.` },

    { q:`<p>Triangle with one edge relaxed. Triangle $A,B,C$ with differ on edges $A-B$ and $B-C$ only ($A-C$ free), 2 colors. Count valid.</p>`,
      steps:[
        {do:`Constraints: $A\\ne B$, $B\\ne C$.`, why:`The $A-C$ differ rule is dropped.`},
        {do:`$A$: 2, $B\\ne A$: 1, $C\\ne B$: 1.`, why:`Each constrained node forced with 2 colors.`},
        {do:`Total $=2\\times1\\times1=2$.`, why:`$A$ and $C$ end up equal, now allowed.`}
      ],
      answer:`$2$ valid colorings.` },

    { q:`<p>Weighted soft constraint trade-off. $X\\in\\{1,2,3\\}$ with preference $f(1)=1,f(2)=4,f(3)=2$, and a penalty factor $p$ that is $0.5$ when $X=2$ (else $1$). Which $X$ maximizes $f\\cdot p$?</p>`,
      steps:[
        {do:`$X=1$: $1\\times1=1$. $X=2$: $4\\times0.5=2$. $X=3$: $2\\times1=2$.`, why:`Apply the penalty only at $X=2$.`},
        {do:`Tie at $2$ between $X=2$ and $X=3$.`, why:`Both score $2$.`}
      ],
      answer:`$X=2$ or $X=3$ (both weight $2$).` },

    { q:`<p>Consistency of a partial assignment. Triangle $A,B,C$ all-differ, 3 colors. Is $A=R,B=G$ extendable? How many ways?</p>`,
      steps:[
        {do:`$C\\ne A=R$ and $C\\ne B=G$.`, why:`C is adjacent to both.`},
        {do:`Remaining color: Blue only — 1 choice.`, why:`Three colors minus two forbidden leaves one.`}
      ],
      answer:`Yes; exactly 1 extension ($C=$Blue).` },

    { q:`<p>Weight of an all-soft assignment vs threshold. Three soft factors $0.8,0.9,0.5$. Weight, and does it exceed a required threshold of $0.4$?</p>`,
      steps:[
        {do:`$0.8\\times0.9=0.72$.`, why:`Multiply the first two.`},
        {do:`$0.72\\times0.5=0.36$.`, why:`Include the third.`},
        {do:`$0.36&lt;0.4$, so it fails the threshold.`, why:`Compare against $0.4$.`}
      ],
      answer:`Weight $0.36$; below $0.4$, fails.` },

    { q:`<p>Counting with an inequality chain. $X&lt;Y&lt;Z$, each in $\\{1,2,3,4\\}$, factor $1$ iff strictly increasing. How many valid triples?</p>`,
      steps:[
        {do:`Strictly increasing triples are choices of 3 distinct values in order.`, why:`Each 3-subset gives exactly one increasing arrangement.`},
        {do:`$\\binom{4}{3}=4$.`, why:`Choose 3 of 4 values; order is forced.`}
      ],
      answer:`$4$ valid triples.` }
  ]);

  /* ---------------- CSP search (AC-3, forward checking traces) ---------------- */
  add("ai-csp-search", [
    { q:`<p>AC-3 with $X\\ne Y$ and large domains. Domains $X=\\{1,2,3\\}$, $Y=\\{1,2,3\\}$, constraint $X\\ne Y$. Revise arc $X\\to Y$. Result?</p>`,
      steps:[
        {do:`For each $x$, need some $y\\ne x$ in $Y$.`, why:`Arc consistency keeps $x$ if a supporting $y$ exists.`},
        {do:`Every $x$ has two supports (the other two values).`, why:`$Y$ has 3 values, only one equals $x$.`},
        {do:`No value removed: $X=\\{1,2,3\\}$.`, why:`$\\ne$ constraints rarely prune when domains exceed size 1.`}
      ],
      answer:`No change; $X=\\{1,2,3\\}$.` },

    { q:`<p>AC-3 cascade on a path. $X-Y-Z$ with $X\\ne Y$, $Y\\ne Z$. $X=\\{R\\}$ (fixed), $Y=\\{R,G\\}$, $Z=\\{R,G\\}$. Run arc revisions to a fixed point.</p>`,
      steps:[
        {do:`Revise $Y\\to X$: $Y=R$ has no support (X only R), remove R. $Y=\\{G\\}$.`, why:`$Y\\ne X$ kills $Y=R$.`},
        {do:`Revise $Z\\to Y$: now $Y=\\{G\\}$, so $Z=G$ unsupported, remove G. $Z=\\{R\\}$.`, why:`The change in Y propagates to Z.`},
        {do:`Fixed point: $X=\\{R\\},Y=\\{G\\},Z=\\{R\\}$.`, why:`No further removals possible.`}
      ],
      answer:`$X=\\{R\\},Y=\\{G\\},Z=\\{R\\}$.` },

    { q:`<p>Forward checking with two assigned neighbors. C is adjacent to A and B. A=R, B=G already assigned, C domain $\\{R,G,B\\}$. After forward checking, C's domain?</p>`,
      steps:[
        {do:`Remove R (from A): $\\{G,B\\}$.`, why:`C cannot equal A.`},
        {do:`Remove G (from B): $\\{B\\}$.`, why:`C cannot equal B.`}
      ],
      answer:`$C=\\{B\\}$ (forced).` },

    { q:`<p>Forward checking detects a dead end early. A=R, neighbor B had $\\{R\\}$ only. What happens, and how many further assignments are tried before backtracking?</p>`,
      steps:[
        {do:`Remove R from B's $\\{R\\}$: B becomes empty.`, why:`B's only value conflicts with A.`},
        {do:`Empty domain means failure immediately — zero further assignments tried.`, why:`Forward checking prunes the dead branch as soon as A is set.`}
      ],
      answer:`B empties; backtrack at once (0 wasted assignments).` },

    { q:`<p>AC-3 with $X&lt;Y$, domains $\\{1,2,3\\}$ each. Revise arc $X\\to Y$. Result for $X$.</p>`,
      steps:[
        {do:`$x=1$: need $y&gt;1$ in $\\{1,2,3\\}$: yes. Keep.`, why:`Support exists.`},
        {do:`$x=2$: $y&gt;2$ exists ($3$). Keep.`, why:`$y=3$ supports $x=2$.`},
        {do:`$x=3$: $y&gt;3$ none, remove. $X=\\{1,2\\}$.`, why:`No support for $x=3$.`}
      ],
      answer:`After $X\\to Y$: $X=\\{1,2\\}$.` },

    { q:`<p>MRV + degree tie-break. Domains A=$\\{R,G\\}$, B=$\\{R,G\\}$, both size 2. A has 3 unassigned neighbors, B has 1. Which does MRV-then-degree pick?</p>`,
      steps:[
        {do:`MRV ties at size 2.`, why:`Both have two values left.`},
        {do:`Degree heuristic breaks the tie: pick the variable in the most constraints with unassigned vars.`, why:`Higher degree prunes more of the remaining problem.`},
        {do:`Pick A (degree 3 > 1).`, why:`A touches more unassigned neighbors.`}
      ],
      answer:`Pick A (degree tie-break).` },

    { q:`<p>Least-constraining-value. Assigning A, choices R or G. Choosing R removes 1 value from neighbors total; choosing G removes 4. Which value does LCV prefer and why?</p>`,
      steps:[
        {do:`LCV prefers the value that rules out the fewest neighbor options.`, why:`Leaving neighbors flexible keeps more solutions reachable.`},
        {do:`R removes 1, G removes 4; pick R.`, why:`R is least constraining.`}
      ],
      answer:`Choose R (removes fewer neighbor values).` },

    { q:`<p>AC-3 on an already-consistent network. All arcs satisfied, no value lacks support. How many removals does AC-3 make, and what does it conclude?</p>`,
      steps:[
        {do:`Each arc revision finds full support, removes nothing.`, why:`Arc consistency already holds everywhere.`},
        {do:`Zero removals; the network is arc consistent.`, why:`AC-3 terminates with all domains intact.`}
      ],
      answer:`$0$ removals; already arc consistent.` },

    { q:`<p>Backtracking with forward checking, count assignments. 2 variables A,B, domains $\\{R,G\\}$, constraint $A\\ne B$. Assign A=R. Forward check B, then assign. How many assignments total reach a solution?</p>`,
      steps:[
        {do:`A=R: forward check removes R from B, B=$\\{G\\}$.`, why:`B must differ from A.`},
        {do:`Assign B=G. Done.`, why:`Only one value remains, and it is consistent.`},
        {do:`Total assignments $=2$ (A then B), no backtracking.`, why:`Forward checking forced B with no dead end.`}
      ],
      answer:`Solution in 2 assignments, no backtrack.` },

    { q:`<p>Sudoku naked-pair propagation. Two cells in a unit both have domain $\\{4,7\\}$. A third cell in the same unit has $\\{4,7,9\\}$. After naked-pair elimination, its domain?</p>`,
      steps:[
        {do:`The pair $\\{4,7\\}$ must occupy those two cells.`, why:`Two cells restricted to the same two values claim both.`},
        {do:`Remove $4,7$ from the third cell: $\\{9\\}$.`, why:`No other cell in the unit may use $4$ or $7$.`}
      ],
      answer:`Third cell forced to $\\{9\\}$.` },

    { q:`<p>Arc consistency vs solvability. Triangle $A,B,C$ all-differ, domains $\\{R,G\\}$. Is it arc consistent? Is it solvable?</p>`,
      steps:[
        {do:`Each arc (e.g. $A\\to B$): every value of A has a differing value of B. Arc consistent.`, why:`With 2 values, each has one support across a $\\ne$ edge.`},
        {do:`But a triangle needs 3 colors; no full assignment exists.`, why:`Arc consistency is local; it misses the global 3-coloring failure.`}
      ],
      answer:`Arc consistent, yet unsolvable (no 2-coloring of a triangle).` },

    { q:`<p>Forward checking chain. Path $A-B-C-D$, domain $\\{R,G,B\\}$, differ. Assign A=R, then B=G (consistent). Forward check the rest. What do C and D look like?</p>`,
      steps:[
        {do:`After A=R: B got $\\{G,B\\}$, chose G; C,D untouched (not adjacent to A).`, why:`Forward checking prunes only direct neighbors of assigned vars.`},
        {do:`After B=G: remove G from C: C=$\\{R,B\\}$.`, why:`C is adjacent to B.`},
        {do:`D unaffected yet (adjacent only to C, unassigned): D=$\\{R,G,B\\}$.`, why:`Forward checking does not reach beyond assigned neighbors.`}
      ],
      answer:`$C=\\{R,B\\}$, $D=\\{R,G,B\\}$.` },

    { q:`<p>AC-3 queue size. Start with 4 directed arcs in the queue; revising one arc that prunes a domain re-adds its 2 incoming neighbor arcs. After processing that one arc, how many arcs are in the queue (other 3 untouched)?</p>`,
      steps:[
        {do:`Remove the processed arc: $4-1=3$ remain.`, why:`Each processed arc leaves the queue.`},
        {do:`A pruned domain re-adds 2 affected arcs: $3+2=5$.`, why:`AC-3 re-enqueues arcs pointing into the changed variable.`}
      ],
      answer:`$5$ arcs in the queue.` },

    { q:`<p>Tightest-first benefit. Why assign the size-1 domain B (forced) before the size-3 domain A?</p>`,
      steps:[
        {do:`B has one value: assigning it either succeeds or fails immediately.`, why:`A forced choice gives instant feedback.`},
        {do:`A-first would branch 3 ways, each later hitting B's forced value and possibly failing late.`, why:`Postponing the constrained variable multiplies redundant exploration.`}
      ],
      answer:`B-first detects conflicts early, pruning the search tree.` }
  ]);

  /* ---------------- Bayes net (joints, marginals, explaining away) ---------------- */
  add("ai-bayes-net", [
    { q:`<p>Three-node chain $A\\to B\\to C$. $P(A)=0.2$; $P(B\\mid A)=0.9,P(B\\mid\\neg A)=0.4$; $P(C\\mid B)=0.8,P(C\\mid\\neg B)=0.3$. Find $P(C)$.</p>`,
      steps:[
        {do:`$P(B)=0.9\\times0.2+0.4\\times0.8=0.18+0.32=0.5$.`, why:`Marginalize out A.`},
        {do:`$P(C)=P(C\\mid B)P(B)+P(C\\mid\\neg B)P(\\neg B)=0.8\\times0.5+0.3\\times0.5$.`, why:`Marginalize out B.`},
        {do:`$=0.4+0.15=0.55$.`, why:`Add the two terms.`}
      ],
      answer:`$P(C)=0.55$.` },

    { q:`<p>Common cause $A\\to B$, $A\\to C$. $P(A)=0.3$; $P(B\\mid A)=0.9,P(B\\mid\\neg A)=0.2$; $P(C\\mid A)=0.7,P(C\\mid\\neg A)=0.1$. Find $P(B,C)$ (both true).</p>`,
      steps:[
        {do:`A true: $0.3\\times0.9\\times0.7=0.189$.`, why:`Joint with A true.`},
        {do:`A false: $0.7\\times0.2\\times0.1=0.014$.`, why:`Joint with A false uses $\\neg A$ conditionals.`},
        {do:`$P(B,C)=0.189+0.014=0.203$.`, why:`Sum out A.`}
      ],
      answer:`$P(B,C)=0.203$.` },

    { q:`<p>Marginal dependence. In the common-cause net above, compare $P(B,C)$ to $P(B)P(C)$. Are B and C marginally independent?</p>`,
      steps:[
        {do:`$P(B)=0.9\\times0.3+0.2\\times0.7=0.27+0.14=0.41$.`, why:`Marginalize out A for B.`},
        {do:`$P(C)=0.7\\times0.3+0.1\\times0.7=0.21+0.07=0.28$. $P(B)P(C)=0.41\\times0.28=0.1148$.`, why:`Product of marginals.`},
        {do:`$P(B,C)=0.203\\ne0.1148$.`, why:`A shared parent induces marginal dependence.`}
      ],
      answer:`No; $0.203\\ne0.1148$, so B,C are dependent.` },

    { q:`<p>V-structure $A\\to C\\leftarrow B$ with C = A AND B. $P(A)=0.5,P(B)=0.5$, $P(C\\mid A,B)=1$, else $0$. Find $P(C)$ and $P(A\\mid C)$.</p>`,
      steps:[
        {do:`$P(C)=P(A,B)=0.5\\times0.5=0.25$.`, why:`C true only when both A,B true.`},
        {do:`$P(A,C)=P(A,B)=0.25$ (C requires A).`, why:`A is necessary for C.`},
        {do:`$P(A\\mid C)=0.25/0.25=1$.`, why:`Given C, A must be true.`}
      ],
      answer:`$P(C)=0.25$, $P(A\\mid C)=1$.` },

    { q:`<p>Explaining away in a v-structure. C = A OR B, $P(A)=P(B)=0.5$. Find $P(A\\mid C)$ and $P(A\\mid C,B)$, and show belief in A drops.</p>`,
      steps:[
        {do:`$P(C)=1-P(\\neg A,\\neg B)=1-0.25=0.75$; $P(A,C)=P(A)=0.5$.`, why:`If A true, C is true (OR).`},
        {do:`$P(A\\mid C)=0.5/0.75=2/3\\approx0.667$.`, why:`Posterior of A given the effect.`},
        {do:`$P(A\\mid C,B)=P(A)=0.5$ (A,B independent; B already explains C).`, why:`Knowing B explains C, so A returns to its prior.`}
      ],
      answer:`$P(A\\mid C)=2/3$ drops to $P(A\\mid C,B)=0.5$.` },

    { q:`<p>Diamond network. $A\\to B$, $A\\to C$, $B\\to D$, $C\\to D$. Write the factorization of the full joint $P(A,B,C,D)$.</p>`,
      steps:[
        {do:`List each node times its parents' conditional.`, why:`A Bayes net joint is the product of per-node conditionals.`},
        {do:`$P(A,B,C,D)=P(A)P(B\\mid A)P(C\\mid A)P(D\\mid B,C)$.`, why:`D has parents B and C; A is the root.`}
      ],
      answer:`$P(A)P(B\\mid A)P(C\\mid A)P(D\\mid B,C)$.` },

    { q:`<p>Table-size accounting. The diamond above with all-binary nodes. How many independent parameters does the net store?</p>`,
      steps:[
        {do:`$P(A)$: 1; $P(B\\mid A)$: 2; $P(C\\mid A)$: 2.`, why:`A node with $k$ binary parents needs $2^k$ free numbers.`},
        {do:`$P(D\\mid B,C)$: $2^2=4$.`, why:`D has two binary parents.`},
        {do:`Total $=1+2+2+4=9$.`, why:`Sum across nodes; full joint would need $2^4-1=15$.`}
      ],
      answer:`$9$ parameters (vs $15$ for the full joint).` },

    { q:`<p>Marginal of a collider leaf. $A\\to C\\leftarrow B$, $P(A)=0.5,P(B)=0.5$, $P(C\\mid A,B)=0.8,P(C\\mid A,\\neg B)=0.5,P(C\\mid\\neg A,B)=0.5,P(C\\mid\\neg A,\\neg B)=0.1$. Find $P(C)$.</p>`,
      steps:[
        {do:`Each $(A,B)$ combo has prior $0.25$.`, why:`Independent fair priors.`},
        {do:`$P(C)=0.25(0.8+0.5+0.5+0.1)=0.25\\times1.9$.`, why:`Weight each conditional equally.`},
        {do:`$=0.475$.`, why:`$1.9/4=0.475$.`}
      ],
      answer:`$P(C)=0.475$.` },

    { q:`<p>Conditional independence read-off. In chain $A\\to B\\to C$, is $A$ independent of $C$ given $B$? Justify via the joint.</p>`,
      steps:[
        {do:`Joint $=P(A)P(B\\mid A)P(C\\mid B)$.`, why:`Chain factorization.`},
        {do:`$P(C\\mid B)$ does not depend on $A$.`, why:`C's conditional has only B as parent.`},
        {do:`So $A\\perp C\\mid B$.`, why:`Given B, knowing A adds nothing about C.`}
      ],
      answer:`Yes, $A\\perp C\\mid B$ (chain blocks at B).` },

    { q:`<p>Joint of a specific assignment. Chain $A\\to B\\to C$, $P(A)=0.6$, $P(B\\mid A)=0.3,P(B\\mid\\neg A)=0.7$, $P(C\\mid B)=0.9,P(C\\mid\\neg B)=0.2$. Find $P(\\neg A,B,\\neg C)$.</p>`,
      steps:[
        {do:`$P(\\neg A)=0.4$.`, why:`Complement of A.`},
        {do:`$P(B\\mid\\neg A)=0.7$; $P(\\neg C\\mid B)=1-0.9=0.1$.`, why:`Use the $\\neg A$ row and the $\\neg C$ given B.`},
        {do:`Joint $=0.4\\times0.7\\times0.1=0.028$.`, why:`Multiply the three factors.`}
      ],
      answer:`$0.028$.` },

    { q:`<p>Naive Bayes joint. Class $Y\\to X_1$, $Y\\to X_2$. $P(Y)=0.5$, $P(X_1\\mid Y)=0.8,P(X_2\\mid Y)=0.7$, $P(X_1\\mid\\neg Y)=0.2,P(X_2\\mid\\neg Y)=0.3$. Find $P(Y,X_1,X_2)$ all-true.</p>`,
      steps:[
        {do:`Factor $=P(Y)P(X_1\\mid Y)P(X_2\\mid Y)$.`, why:`Features conditionally independent given the class.`},
        {do:`$=0.5\\times0.8\\times0.7=0.28$.`, why:`Multiply the three terms.`}
      ],
      answer:`$0.28$.` },

    { q:`<p>Evidence likelihood. Naive Bayes above. Compute $P(X_1,X_2)$ (both observed true) by summing over $Y$.</p>`,
      steps:[
        {do:`$Y$ true: $0.5\\times0.8\\times0.7=0.28$.`, why:`Joint with the class true.`},
        {do:`$Y$ false: $0.5\\times0.2\\times0.3=0.03$.`, why:`Joint with the class false.`},
        {do:`$P(X_1,X_2)=0.28+0.03=0.31$.`, why:`Marginalize out Y.`}
      ],
      answer:`$P(X_1,X_2)=0.31$.` },

    { q:`<p>Three independent roots into one AND collider. $A,B,C\\to D$, each root $P=0.5$, $D$ true only when all three are true. Find $P(D)$.</p>`,
      steps:[
        {do:`D true requires $A,B,C$ all true.`, why:`AND of three.`},
        {do:`$P(A,B,C)=0.5^3=0.125$.`, why:`Independent fair roots.`}
      ],
      answer:`$P(D)=0.125$.` },

    { q:`<p>Posterior over the root. Chain $A\\to B$. $P(A)=0.5$, $P(B\\mid A)=0.9$, $P(B\\mid\\neg A)=0.3$. Observe B true. Find $P(A\\mid B)$.</p>`,
      steps:[
        {do:`$P(A,B)=0.5\\times0.9=0.45$.`, why:`Joint with A true.`},
        {do:`$P(B)=0.45+0.5\\times0.3=0.45+0.15=0.6$.`, why:`Marginalize out A.`},
        {do:`$P(A\\mid B)=0.45/0.6=0.75$.`, why:`Bayes: joint over evidence.`}
      ],
      answer:`$P(A\\mid B)=0.75$.` }
  ]);

  /* ---------------- Bayes inference (posteriors, normalization) ---------------- */
  add("ai-bayes-inference", [
    { q:`<p>Three hypotheses with priors $0.5,0.3,0.2$ and likelihoods of evidence $e$: $0.1,0.4,0.6$. Find the posterior over all three.</p>`,
      steps:[
        {do:`Unnormalized: $0.5\\times0.1=0.05$, $0.3\\times0.4=0.12$, $0.2\\times0.6=0.12$.`, why:`Prior times likelihood for each hypothesis.`},
        {do:`Normalizer $=0.05+0.12+0.12=0.29$.`, why:`Sum the unnormalized scores.`},
        {do:`Posteriors $=0.05/0.29,\\,0.12/0.29,\\,0.12/0.29\\approx0.172,0.414,0.414$.`, why:`Divide each by the total.`}
      ],
      answer:`$\\approx0.17,\\,0.41,\\,0.41$.` },

    { q:`<p>Base-rate trap. $P(D)=0.001$, $P(+\\mid D)=0.99$, $P(+\\mid\\neg D)=0.05$. Find $P(D\\mid+)$.</p>`,
      steps:[
        {do:`Numerator $=0.99\\times0.001=0.00099$.`, why:`Joint of disease and positive.`},
        {do:`$P(+)=0.00099+0.05\\times0.999=0.00099+0.04995=0.05094$.`, why:`Total probability of a positive test.`},
        {do:`$P(D\\mid+)=0.00099/0.05094\\approx0.0194$.`, why:`Low base rate keeps the posterior small.`}
      ],
      answer:`$\\approx0.019$ (about 1.9%).` },

    { q:`<p>Three conditionally-independent positive tests. $P(D)=0.01$, $P(+\\mid D)=0.8$, $P(+\\mid\\neg D)=0.1$. Find $P(D\\mid+,+,+)$.</p>`,
      steps:[
        {do:`Numerator $=0.8^3\\times0.01=0.512\\times0.01=0.00512$.`, why:`Independent tests multiply: $0.8^3$.`},
        {do:`Denominator $=0.00512+0.1^3\\times0.99=0.00512+0.001\\times0.99=0.00512+0.00099=0.00611$.`, why:`Add the $\\neg D$ branch with $0.1^3$.`},
        {do:`$P(D\\mid+,+,+)=0.00512/0.00611\\approx0.838$.`, why:`Three positives sharply raise the posterior.`}
      ],
      answer:`$\\approx0.838$.` },

    { q:`<p>One positive then one negative test. $P(D)=0.1$, $P(+\\mid D)=0.9$, $P(+\\mid\\neg D)=0.2$ (so $P(-\\mid D)=0.1$, $P(-\\mid\\neg D)=0.8$). Find $P(D\\mid+,-)$.</p>`,
      steps:[
        {do:`Numerator $=P(+\\mid D)P(-\\mid D)P(D)=0.9\\times0.1\\times0.1=0.009$.`, why:`Conditionally independent results multiply.`},
        {do:`$\\neg D$ branch $=0.2\\times0.8\\times0.9=0.144$.`, why:`Use the $\\neg D$ likelihoods and prior $0.9$.`},
        {do:`$P(D\\mid+,-)=0.009/(0.009+0.144)=0.009/0.153\\approx0.0588$.`, why:`The negative test pulls the posterior back down.`}
      ],
      answer:`$\\approx0.059$.` },

    { q:`<p>Odds-form chained update. Prior odds $D{:}\\neg D=1{:}9$. Two positive tests each with likelihood ratio $4$. Find posterior odds and $P(D\\mid+,+)$.</p>`,
      steps:[
        {do:`Posterior odds $=\\tfrac{1}{9}\\times4\\times4=\\tfrac{16}{9}$.`, why:`Multiply prior odds by each likelihood ratio.`},
        {do:`$P(D\\mid+,+)=\\tfrac{16}{16+9}=\\tfrac{16}{25}=0.64$.`, why:`Convert odds to probability.`}
      ],
      answer:`Odds $16{:}9$, $P=0.64$.` },

    { q:`<p>Normalization of scores. Unnormalized posterior scores for four values are $2,4,6,8$. Find the normalized distribution and the most probable value.</p>`,
      steps:[
        {do:`Sum $=2+4+6+8=20$.`, why:`Normalizer is the total score.`},
        {do:`Probabilities $=0.1,0.2,0.3,0.4$.`, why:`Divide each score by 20.`},
        {do:`Most probable is the 4th value ($0.4$).`, why:`Largest normalized probability.`}
      ],
      answer:`$(0.1,0.2,0.3,0.4)$; mode is the 4th value.` },

    { q:`<p>Spam with two words. $P(\\text{spam})=0.3$. $P(w_1\\mid s)=0.6,P(w_1\\mid h)=0.1$; $P(w_2\\mid s)=0.5,P(w_2\\mid h)=0.2$, words independent given class. Find $P(s\\mid w_1,w_2)$.</p>`,
      steps:[
        {do:`Spam joint $=0.3\\times0.6\\times0.5=0.09$.`, why:`Prior times the two word likelihoods.`},
        {do:`Ham joint $=0.7\\times0.1\\times0.2=0.014$.`, why:`Ham branch with its likelihoods.`},
        {do:`$P(s\\mid w_1,w_2)=0.09/(0.09+0.014)=0.09/0.104\\approx0.865$.`, why:`Normalize over the two classes.`}
      ],
      answer:`$\\approx0.865$.` },

    { q:`<p>Explaining-away magnitude. Collider $B\\to A\\leftarrow E$ with A = B OR E, $P(B)=0.1,P(E)=0.1$. Find $P(B\\mid A)$ and $P(B\\mid A,E)$.</p>`,
      steps:[
        {do:`$P(A)=1-P(\\neg B,\\neg E)=1-0.9\\times0.9=1-0.81=0.19$.`, why:`A false only when both causes absent.`},
        {do:`$P(B,A)=P(B)=0.1$; $P(B\\mid A)=0.1/0.19\\approx0.526$.`, why:`If B true, A true (OR).`},
        {do:`$P(B\\mid A,E)=P(B)=0.1$ (E explains A; B,E independent).`, why:`Knowing E already accounts for the alarm.`}
      ],
      answer:`$P(B\\mid A)\\approx0.53$ falls to $P(B\\mid A,E)=0.1$.` },

    { q:`<p>Sequential Bayesian belief. Start $P(D)=0.2$. A positive test (LR $=3$) updates the belief, then a second test (LR $=3$). Use odds. Final $P(D)$.</p>`,
      steps:[
        {do:`Prior odds $=0.2/0.8=0.25$.`, why:`Convert prior probability to odds.`},
        {do:`After two tests: $0.25\\times3\\times3=2.25$.`, why:`Multiply odds by each likelihood ratio.`},
        {do:`$P(D)=2.25/(1+2.25)=2.25/3.25\\approx0.692$.`, why:`Convert final odds to probability.`}
      ],
      answer:`$\\approx0.692$.` },

    { q:`<p>Model comparison. Model M1 gives $P(e\\mid M1)=0.2$, prior $0.6$; M2 gives $P(e\\mid M2)=0.5$, prior $0.4$. Find $P(M2\\mid e)$.</p>`,
      steps:[
        {do:`Scores: M1 $=0.6\\times0.2=0.12$, M2 $=0.4\\times0.5=0.2$.`, why:`Prior times marginal likelihood.`},
        {do:`Normalizer $=0.12+0.2=0.32$.`, why:`Sum the scores.`},
        {do:`$P(M2\\mid e)=0.2/0.32=0.625$.`, why:`Divide M2's score by the total.`}
      ],
      answer:`$P(M2\\mid e)=0.625$.` },

    { q:`<p>Two-disease differential. Diseases $D_1,D_2$ (mutually exclusive, plus "healthy"). Priors $0.05,0.05,0.9$. Symptom likelihoods $P(s\\mid D_1)=0.8,P(s\\mid D_2)=0.6,P(s\\mid H)=0.1$. Find $P(D_1\\mid s)$.</p>`,
      steps:[
        {do:`Scores: $D_1{:}0.05\\times0.8=0.04$, $D_2{:}0.05\\times0.6=0.03$, $H{:}0.9\\times0.1=0.09$.`, why:`Prior times likelihood for each.`},
        {do:`Normalizer $=0.04+0.03+0.09=0.16$.`, why:`Sum over all three hypotheses.`},
        {do:`$P(D_1\\mid s)=0.04/0.16=0.25$.`, why:`Divide $D_1$'s score by the total.`}
      ],
      answer:`$P(D_1\\mid s)=0.25$.` },

    { q:`<p>Likelihood ratio threshold. A test must give posterior $P(D\\mid+)\\ge0.5$. With prior odds $1{:}9$, what likelihood ratio is needed?</p>`,
      steps:[
        {do:`Posterior $\\ge0.5$ means posterior odds $\\ge1$.`, why:`Odds of 1 correspond to probability 0.5.`},
        {do:`Posterior odds $=\\tfrac19\\times LR\\ge1\\Rightarrow LR\\ge9$.`, why:`Solve for the likelihood ratio.`}
      ],
      answer:`$LR\\ge9$.` },

    { q:`<p>Normalizing a partial table. Joint values $P(q,e)=0.06$, $P(\\neg q,e)=0.04$, the rest have $e$ false. Find $P(q\\mid e)$ and $P(e)$.</p>`,
      steps:[
        {do:`$P(e)=0.06+0.04=0.10$.`, why:`Sum the two $e$-true joints.`},
        {do:`$P(q\\mid e)=0.06/0.10=0.6$.`, why:`Normalize the query joint by the evidence.`}
      ],
      answer:`$P(e)=0.10$, $P(q\\mid e)=0.6$.` },

    { q:`<p>Two symptoms present. $P(D)=0.2$. Each of 2 symptoms independently has $P(s_i\\mid D)=0.7$, $P(s_i\\mid\\neg D)=0.2$. Observe both present. $P(D\\mid s_1,s_2)$?</p>`,
      steps:[
        {do:`$D$ joint $=0.2\\times0.7\\times0.7=0.098$.`, why:`Prior times both symptom likelihoods.`},
        {do:`$\\neg D$ joint $=0.8\\times0.2\\times0.2=0.032$.`, why:`Healthy branch.`},
        {do:`$P(D\\mid s_1,s_2)=0.098/(0.098+0.032)=0.098/0.13\\approx0.754$.`, why:`Normalize over the two classes.`}
      ],
      answer:`$\\approx0.754$.` }
  ]);

  /* ---------------- HMM (multi-step forward, joint paths) ---------------- */
  add("ai-hmm", [
    { q:`<p>Two-step forward. Hidden $\\in\\{R,S\\}$, prior $P(R)=0.5$. Transition stay $0.8$, switch $0.2$. Emission $P(U\\mid R)=0.9,P(U\\mid S)=0.3$. Observe $U$ at $t{=}1$ and $t{=}2$. Find $P(R)$ after $t{=}2$.</p>`,
      steps:[
        {do:`$t{=}1$ update: $R{:}0.5\\times0.9=0.45$, $S{:}0.5\\times0.3=0.15$; normalize $P(R)=0.45/0.6=0.75$.`, why:`Prior times emission, then normalize.`},
        {do:`$t{=}2$ predict: $R{:}0.8\\times0.75+0.2\\times0.25=0.6+0.05=0.65$, $S=0.35$.`, why:`Transition the belief forward.`},
        {do:`$t{=}2$ update: $R{:}0.65\\times0.9=0.585$, $S{:}0.35\\times0.3=0.105$; $P(R)=0.585/0.69\\approx0.848$.`, why:`Weight by emission and normalize.`}
      ],
      answer:`$P(R)\\approx0.848$.` },

    { q:`<p>Three-step forward, mixed observation. From $P(R)=0.848,P(S)=0.152$, transition stay $0.8$/switch $0.2$, now observe No-Umbrella. $P(NoU\\mid R)=0.1,P(NoU\\mid S)=0.7$. Find $P(R)$.</p>`,
      steps:[
        {do:`Predict $R{:}0.8\\times0.848+0.2\\times0.152=0.6784+0.0304=0.7088$, $S=0.2912$.`, why:`Transition forward.`},
        {do:`Update $R{:}0.7088\\times0.1=0.07088$, $S{:}0.2912\\times0.7=0.20384$.`, why:`Weight by emission.`},
        {do:`Normalize $P(R)=0.07088/0.27472\\approx0.258$.`, why:`A dry day pulls belief toward Sunny.`}
      ],
      answer:`$P(R)\\approx0.258$.` },

    { q:`<p>Joint path probability. HMM with $P(H_1{=}R)=0.7$, transition $P(R\\mid R)=0.6$, emissions $P(e_1\\mid R)=0.8,P(e_2\\mid R)=0.8$. Probability of the path $R,R$ with both observations.</p>`,
      steps:[
        {do:`Factor $=P(H_1)P(e_1\\mid R)P(H_2{=}R\\mid R)P(e_2\\mid R)$.`, why:`HMM joint = prior · emission · transition · emission.`},
        {do:`$=0.7\\times0.8\\times0.6\\times0.8$.`, why:`Plug in the all-R values.`},
        {do:`$=0.7\\times0.8=0.56;\\times0.6=0.336;\\times0.8=0.2688$.`, why:`Multiply step by step.`}
      ],
      answer:`Path $R,R$ joint $=0.2688$.` },

    { q:`<p>Compare two paths. Same HMM as above plus $P(S\\mid R)=0.4$, $P(e_2\\mid S)=0.3$. Probability of path $R,S$ (with both observations), and which path is more likely?</p>`,
      steps:[
        {do:`$R,S$ joint $=0.7\\times0.8\\times0.4\\times0.3$.`, why:`Prior·emit(R)·transition(R→S)·emit(S) at $t{=}2$.`},
        {do:`$=0.7\\times0.8=0.56;\\times0.4=0.224;\\times0.3=0.0672$.`, why:`Multiply through.`},
        {do:`$0.2688&gt;0.0672$, so path $R,R$ is more likely.`, why:`Compare the two joint values.`}
      ],
      answer:`$R,S=0.0672$; $R,R$ ($0.2688$) is more likely.` },

    { q:`<p>Likelihood of an observation. Sum over both $H_2$ values. Predicted $P(R)=0.6,P(S)=0.4$ at $t{=}2$; emission $P(U\\mid R)=0.9,P(U\\mid S)=0.2$. Find $P(U_2)$.</p>`,
      steps:[
        {do:`$R$ contributes $0.6\\times0.9=0.54$.`, why:`Predicted Rain times its emission.`},
        {do:`$S$ contributes $0.4\\times0.2=0.08$.`, why:`Predicted Sun times its emission.`},
        {do:`$P(U_2)=0.54+0.08=0.62$.`, why:`Sum over the hidden state (the forward normalizer).`}
      ],
      answer:`$P(U_2)=0.62$.` },

    { q:`<p>Two-step prediction without observation. Prior $P(R)=1$. Transition stay $0.7$/switch $0.3$. Predict $P(R)$ after TWO transitions (no evidence).</p>`,
      steps:[
        {do:`After 1 step: $P(R)=1\\times0.7=0.7$, $P(S)=0.3$.`, why:`Apply the transition once.`},
        {do:`After 2 steps: $P(R)=0.7\\times0.7+0.3\\times0.3=0.49+0.09=0.58$.`, why:`Transition the new belief again.`}
      ],
      answer:`$P(R)=0.58$ after two steps.` },

    { q:`<p>Stationary distribution. Transition $P(R\\mid R)=0.8$, $P(R\\mid S)=0.4$. Find the stationary $P(R)$ where $\\pi=\\pi T$.</p>`,
      steps:[
        {do:`Let $r=P(R)$: $r=0.8r+0.4(1-r)$.`, why:`Stationary means the belief reproduces itself.`},
        {do:`$r=0.8r+0.4-0.4r=0.4r+0.4\\Rightarrow0.6r=0.4$.`, why:`Collect terms.`},
        {do:`$r=0.4/0.6=2/3\\approx0.667$.`, why:`Solve for r.`}
      ],
      answer:`Stationary $P(R)=2/3$.` },

    { q:`<p>Forward over two steps, all umbrellas. Prior $P(R)=0.5$, transition stay $0.7$/switch $0.3$, $P(U\\mid R)=0.8,P(U\\mid S)=0.2$. Give $P(R)$ after $t{=}1$ and $t{=}2$.</p>`,
      steps:[
        {do:`$t{=}1$: $R{:}0.5\\times0.8=0.4$, $S{:}0.5\\times0.2=0.1$; $P(R)=0.4/0.5=0.8$.`, why:`Update from the flat prior.`},
        {do:`$t{=}2$ predict: $R{:}0.7\\times0.8+0.3\\times0.2=0.56+0.06=0.62$, $S=0.38$.`, why:`Transition forward.`},
        {do:`$t{=}2$ update: $R{:}0.62\\times0.8=0.496$, $S{:}0.38\\times0.2=0.076$; $P(R)=0.496/0.572\\approx0.867$.`, why:`Emit and normalize.`}
      ],
      answer:`$P(R)=0.8$ then $\\approx0.867$.` },

    { q:`<p>Smoothing. Forward gives $P(R_t\\mid e_{1:t})=0.7$. A backward message gives $b(R)=0.3$, $b(S)=0.9$. Combine: posterior $\\propto$ forward $\\times$ backward. Find $P(R_t\\mid \\text{all})$.</p>`,
      steps:[
        {do:`Unnormalized $R{:}0.7\\times0.3=0.21$, $S{:}0.3\\times0.9=0.27$.`, why:`Smoothing multiplies forward and backward messages.`},
        {do:`Normalize $P(R)=0.21/(0.21+0.27)=0.21/0.48\\approx0.4375$.`, why:`Future evidence revises the filtered belief.`}
      ],
      answer:`$P(R_t\\mid\\text{all})\\approx0.44$.` },

    { q:`<p>Most-likely first state (mini-Viterbi). Two states, prior $P(R)=0.6,P(S)=0.4$, emission $P(U\\mid R)=0.9,P(U\\mid S)=0.5$. After observing $U$, which state has the higher joint $P(H_1,U)$?</p>`,
      steps:[
        {do:`$R{:}0.6\\times0.9=0.54$.`, why:`Prior times emission for R.`},
        {do:`$S{:}0.4\\times0.5=0.20$.`, why:`Prior times emission for S.`},
        {do:`$0.54&gt;0.20$, so Rain is the most likely state.`, why:`Viterbi keeps the max-probability path.`}
      ],
      answer:`Rain ($0.54&gt;0.20$).` },

    { q:`<p>Two-step Viterbi. Prior $P(R)=0.6,P(S)=0.4$; transition stay $0.7$/switch $0.3$; emission $P(U\\mid R)=0.9,P(U\\mid S)=0.5$; observe $U,U$. Find the best $H_2{=}R$ path score.</p>`,
      steps:[
        {do:`$t{=}1$ best: $R{:}0.54$, $S{:}0.20$ (from prior·emit).`, why:`Initialize Viterbi scores.`},
        {do:`$H_2{=}R$ from $R{:}0.54\\times0.7=0.378$; from $S{:}0.20\\times0.3=0.06$; max $=0.378$.`, why:`Take the best predecessor times the transition.`},
        {do:`Multiply emission $P(U\\mid R)=0.9$: $0.378\\times0.9=0.3402$.`, why:`Fold in the second observation.`}
      ],
      answer:`Best $H_2{=}R$ path score $=0.3402$ (via $R\\to R$).` },

    { q:`<p>Forward normalizer over two steps. $P(R_1\\mid U_1)=0.75,P(S_1\\mid U_1)=0.25$. Transition stay $0.7$/switch $0.3$. Emission $P(U\\mid R)=0.9,P(U\\mid S)=0.2$. Compute $P(U_2\\mid U_1)$.</p>`,
      steps:[
        {do:`Predict: $R{:}0.7\\times0.75+0.3\\times0.25=0.525+0.075=0.6$, $S=0.4$.`, why:`Transition the filtered belief.`},
        {do:`Unnormalized after emit: $R{:}0.6\\times0.9=0.54$, $S{:}0.4\\times0.2=0.08$.`, why:`Weight by emission.`},
        {do:`Normalizer $=0.54+0.08=0.62$.`, why:`Sum gives $P(U_2\\mid U_1)$.`}
      ],
      answer:`$P(U_2\\mid U_1)=0.62$.` },

    { q:`<p>Near-deterministic emission. $P(U\\mid R)=0.99$, $P(U\\mid S)=0.01$. Flat prior $0.5$. After observing $U$, find $P(R\\mid U)$.</p>`,
      steps:[
        {do:`$R{:}0.5\\times0.99=0.495$, $S{:}0.5\\times0.01=0.005$.`, why:`Prior times emission.`},
        {do:`$P(R\\mid U)=0.495/0.5=0.99$.`, why:`Normalize.`},
        {do:`Belief is almost certain (99%).`, why:`A sharp emission makes one observation very informative.`}
      ],
      answer:`$P(R\\mid U)=0.99$ (near-certain).` },

    { q:`<p>Symmetric stationary. Transition stay $0.6$/switch $0.4$ (symmetric). Start $P(R)=1$. After many predict-only steps, what is the stationary belief?</p>`,
      steps:[
        {do:`Symmetric transition: $P(R\\mid R)=0.6=P(S\\mid S)$.`, why:`Both states behave alike.`},
        {do:`Solve $r=0.6r+0.4(1-r)\\Rightarrow0.6r=0.4$... symmetry gives $r=0.5$.`, why:`Symmetry forces the stationary to be uniform.`}
      ],
      answer:`Stationary $P(R)=P(S)=0.5$.` }
  ]);

  /* ---------------- Propositional logic (truth tables, CNF, model counting) ---------------- */
  add("ai-propositional-logic", [
    { q:`<p>Model counting. How many of the $2^3=8$ assignments to $A,B,C$ satisfy $(A\\vee B)\\wedge(B\\vee C)\\wedge(A\\vee C)$ (at least two of three true)?</p>`,
      steps:[
        {do:`The formula is true iff at least two of $A,B,C$ are true.`, why:`Each clause forbids a specific pair being both false; together they require $\\le1$ false.`},
        {do:`Exactly-two-true: $\\binom{3}{2}=3$; all-three-true: $1$.`, why:`Count assignments with at most one false.`},
        {do:`Total $=3+1=4$.`, why:`Add the two cases.`}
      ],
      answer:`$4$ satisfying models.` },

    { q:`<p>Convert $(A\\wedge B)\\rightarrow C$ to CNF.</p>`,
      steps:[
        {do:`Eliminate $\\rightarrow$: $\\neg(A\\wedge B)\\vee C$.`, why:`$f\\rightarrow g\\equiv\\neg f\\vee g$.`},
        {do:`De Morgan: $\\neg A\\vee\\neg B\\vee C$.`, why:`$\\neg(A\\wedge B)=\\neg A\\vee\\neg B$.`},
        {do:`This is a single clause, already CNF.`, why:`One disjunction of literals.`}
      ],
      answer:`CNF: $(\\neg A\\vee\\neg B\\vee C)$.` },

    { q:`<p>Convert $(A\\vee B)\\rightarrow(C\\wedge D)$ to CNF.</p>`,
      steps:[
        {do:`Eliminate $\\rightarrow$: $\\neg(A\\vee B)\\vee(C\\wedge D)$.`, why:`Implication to disjunction.`},
        {do:`De Morgan: $(\\neg A\\wedge\\neg B)\\vee(C\\wedge D)$.`, why:`Push negation inside.`},
        {do:`Distribute: $(\\neg A\\vee C)\\wedge(\\neg A\\vee D)\\wedge(\\neg B\\vee C)\\wedge(\\neg B\\vee D)$.`, why:`Distribute OR over each AND term.`}
      ],
      answer:`$(\\neg A\\vee C)(\\neg A\\vee D)(\\neg B\\vee C)(\\neg B\\vee D)$.` },

    { q:`<p>Entailment by model reasoning. KB $=\\{P\\rightarrow Q,\\;Q\\rightarrow R,\\;P\\}$. Does KB $\\models R$? Check all KB-true models.</p>`,
      steps:[
        {do:`KB true forces $P=T$.`, why:`$P$ is a fact.`},
        {do:`$P\\rightarrow Q$ with $P=T$ forces $Q=T$; then $Q\\rightarrow R$ forces $R=T$.`, why:`Chained modus ponens at the model level.`},
        {do:`Every KB-true model has $R=T$.`, why:`That is entailment.`}
      ],
      answer:`Yes, KB $\\models R$.` },

    { q:`<p>Tautology vs contingent. Is $(A\\rightarrow B)\\vee(B\\rightarrow A)$ a tautology? Test all four rows.</p>`,
      steps:[
        {do:`If $A=B$: both implications true, disjunction true.`, why:`Equal truth values satisfy both.`},
        {do:`If $A\\ne B$: one implication is false but the other (false premise) is true.`, why:`An implication with a false premise is vacuously true.`},
        {do:`All rows true, so it is a tautology.`, why:`At least one disjunct is always true.`}
      ],
      answer:`Yes, a tautology.` },

    { q:`<p>Satisfiability of three clauses. Is $\\{(A\\vee B),(\\neg A\\vee C),(\\neg B\\vee\\neg C)\\}$ satisfiable? Find a model or show none.</p>`,
      steps:[
        {do:`Try $A=T$: clause 2 needs $C=T$; clause 3 then needs $B=F$; clause 1 holds via $A$.`, why:`Propagate the consequences.`},
        {do:`Model $A=T,B=F,C=T$ satisfies all three.`, why:`Check: $T$, $\\neg T\\vee T=T$, $\\neg F\\vee\\neg T=T$.`}
      ],
      answer:`Satisfiable, e.g. $A{=}T,B{=}F,C{=}T$.` },

    { q:`<p>Count models of an implication. How many of the 4 assignments to $A,B$ satisfy $A\\rightarrow B$?</p>`,
      steps:[
        {do:`$A\\rightarrow B$ is false only at $A=T,B=F$.`, why:`The single false row.`},
        {do:`So $4-1=3$ rows satisfy it.`, why:`All but the one false row.`}
      ],
      answer:`$3$ models.` },

    { q:`<p>Logical equivalence check. Are $\\neg(A\\wedge B)$ and $(\\neg A\\vee\\neg B)$ equivalent?</p>`,
      steps:[
        {do:`$\\neg(A\\wedge B)$ false only when $A\\wedge B$ true, i.e. $A=B=T$.`, why:`AND true only when both true.`},
        {do:`$\\neg A\\vee\\neg B$ false only when both $\\neg A,\\neg B$ false, i.e. $A=B=T$.`, why:`OR false only when both disjuncts false.`},
        {do:`Same false row, same truth table, so equivalent (De Morgan).`, why:`Identical on every assignment.`}
      ],
      answer:`Yes, equivalent (De Morgan's law).` },

    { q:`<p>Entailment via the resolvent. KB $=(A\\vee B)\\wedge(\\neg A\\vee C)$. Does KB $\\models (B\\vee C)$?</p>`,
      steps:[
        {do:`Case $A=T$: clause 2 forces $C=T$, so $B\\vee C=T$.`, why:`Split on A.`},
        {do:`Case $A=F$: clause 1 forces $B=T$, so $B\\vee C=T$.`, why:`The other branch.`},
        {do:`In every KB-true model $B\\vee C$ holds.`, why:`That is the resolvent of the two clauses.`}
      ],
      answer:`Yes, KB $\\models (B\\vee C)$.` },

    { q:`<p>XOR-like model counting. Count assignments to $A,B,C$ satisfying $(A\\vee B\\vee C)\\wedge(\\neg A\\vee\\neg B\\vee\\neg C)$ (not all same).</p>`,
      steps:[
        {do:`Clause 1 fails only at all-false (1 row).`, why:`OR of three false only when all false.`},
        {do:`Clause 2 fails only at all-true (1 row).`, why:`OR of three negations false only when all true.`},
        {do:`Satisfying $=8-1-1=6$.`, why:`Remove the two excluded all-same rows.`}
      ],
      answer:`$6$ models (everything except all-true and all-false).` },

    { q:`<p>Convert a biconditional to CNF. Write $A\\leftrightarrow B$ in CNF.</p>`,
      steps:[
        {do:`$A\\leftrightarrow B=(A\\rightarrow B)\\wedge(B\\rightarrow A)$.`, why:`A biconditional is two implications.`},
        {do:`Each implication: $(\\neg A\\vee B)$ and $(\\neg B\\vee A)$.`, why:`Rewrite implications.`},
        {do:`CNF $=(\\neg A\\vee B)\\wedge(A\\vee\\neg B)$.`, why:`Conjoin the two clauses.`}
      ],
      answer:`$(\\neg A\\vee B)\\wedge(A\\vee\\neg B)$.` },

    { q:`<p>Entailment fails. Does $(A\\vee B)\\models A$? If not, give a counterexample model.</p>`,
      steps:[
        {do:`Try $A=F,B=T$: premise $A\\vee B=T$.`, why:`The OR is satisfied by B.`},
        {do:`But $A=F$, so $A$ is false in this model.`, why:`A model satisfying the premise but not the conclusion.`},
        {do:`So $(A\\vee B)\\not\\models A$.`, why:`Entailment requires the conclusion in EVERY premise-true model.`}
      ],
      answer:`No; counterexample $A{=}F,B{=}T$.` },

    { q:`<p>Counting over disjoint variables. Models of $A,B,C,D$ satisfying $(A\\rightarrow B)\\wedge(C\\rightarrow D)$?</p>`,
      steps:[
        {do:`$A\\rightarrow B$ holds in $3$ of $4$ $(A,B)$ assignments.`, why:`Only $A{=}T,B{=}F$ fails.`},
        {do:`$C\\rightarrow D$ holds in $3$ of $4$ $(C,D)$ assignments.`, why:`Same structure, independent variables.`},
        {do:`Independent, so total $=3\\times3=9$.`, why:`Multiply the counts over disjoint variable sets.`}
      ],
      answer:`$9$ models.` },

    { q:`<p>Validity of a syllogism. Is $\\{(A\\rightarrow B),(B\\rightarrow C)\\}\\models(A\\rightarrow C)$?</p>`,
      steps:[
        {do:`Take any model where both premises hold; suppose $A=T$.`, why:`Test the only case that could break $A\\rightarrow C$.`},
        {do:`$A\\rightarrow B$ gives $B=T$; $B\\rightarrow C$ gives $C=T$.`, why:`Chain the implications.`},
        {do:`So $A=T\\Rightarrow C=T$; if $A=F$, $A\\rightarrow C$ is vacuously true.`, why:`Both cases satisfy $A\\rightarrow C$.`}
      ],
      answer:`Yes; hypothetical syllogism is valid.` }
  ]);

  /* ---------------- Inference rules (multi-step resolution, refutation) ---------------- */
  add("ai-inference-rules", [
    { q:`<p>Four-step forward chaining. KB: $A$; $A\\rightarrow B$; $A\\rightarrow C$; $(B\\wedge C)\\rightarrow D$. Derive $D$.</p>`,
      steps:[
        {do:`From $A$ and $A\\rightarrow B$: conclude $B$.`, why:`Modus ponens.`},
        {do:`From $A$ and $A\\rightarrow C$: conclude $C$.`, why:`Modus ponens again.`},
        {do:`From $B,C$ and $(B\\wedge C)\\rightarrow D$: conclude $D$.`, why:`The conjunctive premise is now satisfied.`}
      ],
      answer:`$D$ derived.` },

    { q:`<p>Resolution refutation with three clauses. Prove $\\{(\\neg P\\vee Q),(\\neg Q\\vee R),P\\}\\models R$. Add $\\neg R$ and derive $\\bot$.</p>`,
      steps:[
        {do:`Add $\\neg R$.`, why:`Refutation negates the goal.`},
        {do:`Resolve $P$ with $(\\neg P\\vee Q)$: get $Q$.`, why:`Cancel $P/\\neg P$.`},
        {do:`Resolve $Q$ with $(\\neg Q\\vee R)$: get $R$; resolve $R$ with $\\neg R$: get $\\bot$.`, why:`Empty clause proves entailment.`}
      ],
      answer:`Empty clause derived; KB $\\models R$.` },

    { q:`<p>Resolution with a longer clause. Resolve $(A\\vee B\\vee C)$ with $(\\neg B\\vee D)$ on $B$.</p>`,
      steps:[
        {do:`$B$ is positive in clause 1, negative in clause 2.`, why:`Complementary literal to cancel.`},
        {do:`Union the rest: $(A\\vee C\\vee D)$.`, why:`Drop $B,\\neg B$; keep all other literals.`}
      ],
      answer:`$(A\\vee C\\vee D)$.` },

    { q:`<p>Detecting a tautological resolvent. Resolve $(A\\vee B)$ with $(\\neg A\\vee\\neg B)$ on $A$. Is the result useful?</p>`,
      steps:[
        {do:`Cancel $A/\\neg A$: resolvent $=(B\\vee\\neg B)$.`, why:`Combine the remaining literals.`},
        {do:`$(B\\vee\\neg B)$ is a tautology (always true).`, why:`A literal and its negation in one clause.`},
        {do:`Tautological resolvents are discarded — they add no information.`, why:`Always-true clauses never help derive $\\bot$.`}
      ],
      answer:`Resolvent $(B\\vee\\neg B)$ is a tautology; discard it.` },

    { q:`<p>Refutation needing several steps. Prove $\\{(A\\vee B),(\\neg A\\vee C),(\\neg B\\vee C)\\}\\models C$. Add $\\neg C$ and resolve to $\\bot$.</p>`,
      steps:[
        {do:`Add $\\neg C$. Resolve $(\\neg A\\vee C)$ with $\\neg C$: get $\\neg A$.`, why:`Cancel $C/\\neg C$.`},
        {do:`Resolve $(\\neg B\\vee C)$ with $\\neg C$: get $\\neg B$.`, why:`Same cancellation.`},
        {do:`Resolve $(A\\vee B)$ with $\\neg A$: get $B$; resolve $B$ with $\\neg B$: get $\\bot$.`, why:`Two more resolutions reach the empty clause.`}
      ],
      answer:`$\\bot$ derived; KB $\\models C$.` },

    { q:`<p>Modus tollens via resolution. KB: $A\\rightarrow B$ and $\\neg B$. Show we can derive $\\neg A$.</p>`,
      steps:[
        {do:`Rewrite $A\\rightarrow B$ as $(\\neg A\\vee B)$.`, why:`Implication to clause.`},
        {do:`Resolve $(\\neg A\\vee B)$ with $\\neg B$ on $B$: get $\\neg A$.`, why:`Cancel $B/\\neg B$, leaving $\\neg A$.`},
        {do:`This is modus tollens.`, why:`From $A\\to B$ and $\\neg B$, infer $\\neg A$.`}
      ],
      answer:`$\\neg A$ (modus tollens).` },

    { q:`<p>Unsatisfiable set. Is $\\{P,\\;\\neg P\\vee Q,\\;\\neg Q\\}$ satisfiable? Use resolution.</p>`,
      steps:[
        {do:`Resolve $P$ with $(\\neg P\\vee Q)$: get $Q$.`, why:`Modus-ponens style step.`},
        {do:`Resolve $Q$ with $\\neg Q$: get $\\bot$.`, why:`Complementary units.`},
        {do:`Empty clause means the set is unsatisfiable.`, why:`Deriving $\\bot$ proves no model satisfies all clauses.`}
      ],
      answer:`Unsatisfiable (derives the empty clause).` },

    { q:`<p>Refutation with five clauses. Prove $\\{(\\neg A\\vee B),(\\neg B\\vee C),(\\neg C\\vee D),A\\}\\models D$.</p>`,
      steps:[
        {do:`Add $\\neg D$. Resolve $A$ with $(\\neg A\\vee B)$: $B$.`, why:`Cancel $A$.`},
        {do:`Resolve $B$ with $(\\neg B\\vee C)$: $C$; then $C$ with $(\\neg C\\vee D)$: $D$.`, why:`Chain the implications.`},
        {do:`Resolve $D$ with $\\neg D$: $\\bot$.`, why:`Contradiction reached.`}
      ],
      answer:`$\\bot$ in 4 resolutions; KB $\\models D$.` },

    { q:`<p>Disjunctive syllogism. KB: $(A\\vee B\\vee C)$, $\\neg A$, $\\neg B$. What single literal is forced, and how?</p>`,
      steps:[
        {do:`Resolve $(A\\vee B\\vee C)$ with $\\neg A$: get $(B\\vee C)$.`, why:`Cancel $A/\\neg A$.`},
        {do:`Resolve $(B\\vee C)$ with $\\neg B$: get $C$.`, why:`Cancel $B/\\neg B$.`}
      ],
      answer:`$C$ is forced.` },

    { q:`<p>First-order modus ponens with unification. KB: $\\forall x\\,\\text{King}(x)\\rightarrow\\text{Royal}(x)$ and $\\text{King}(\\text{John})$. Derive.</p>`,
      steps:[
        {do:`Unify $x=\\text{John}$ in the rule.`, why:`The universally quantified rule applies to any instance.`},
        {do:`From $\\text{King}(\\text{John})$ and the instantiated rule, conclude $\\text{Royal}(\\text{John})$.`, why:`Generalized modus ponens.`}
      ],
      answer:`$\\text{Royal}(\\text{John})$.` },

    { q:`<p>Convert to CNF before resolving. KB: $A\\rightarrow(B\\wedge C)$ and $A$. Derive $C$ via clauses.</p>`,
      steps:[
        {do:`CNF of $A\\rightarrow(B\\wedge C)$: $(\\neg A\\vee B)\\wedge(\\neg A\\vee C)$.`, why:`Distribute after eliminating the implication.`},
        {do:`Resolve $A$ with $(\\neg A\\vee C)$: get $C$.`, why:`Cancel $A/\\neg A$.`}
      ],
      answer:`$C$ derived.` },

    { q:`<p>Refutation completeness. We have $\\{(\\neg A\\vee B),A\\}$ and want $B$. Show resolution succeeds.</p>`,
      steps:[
        {do:`Add $\\neg B$. Resolve $A$ with $(\\neg A\\vee B)$: get $B$.`, why:`Cancel $A$.`},
        {do:`Resolve $B$ with $\\neg B$: $\\bot$.`, why:`Contradiction.`},
        {do:`So KB $\\models B$, matching forward chaining's modus ponens.`, why:`Resolution is refutation-complete for propositional logic.`}
      ],
      answer:`$\\bot$ derived; KB $\\models B$.` },

    { q:`<p>Factoring in resolution. Resolve $(A\\vee A\\vee B)$ with $(\\neg A\\vee C)$ on $A$. What clause results after removing duplicates?</p>`,
      steps:[
        {do:`First factor $(A\\vee A\\vee B)$ to $(A\\vee B)$.`, why:`Duplicate literals collapse to one.`},
        {do:`Resolve $(A\\vee B)$ with $(\\neg A\\vee C)$: get $(B\\vee C)$.`, why:`Cancel $A/\\neg A$.`}
      ],
      answer:`$(B\\vee C)$.` },

    { q:`<p>Inconsistent rules. KB: $A\\rightarrow B$, $A\\rightarrow\\neg B$, $A$. Show $\\bot$ follows.</p>`,
      steps:[
        {do:`From $A$ and $A\\rightarrow B$: $B$. From $A$ and $A\\rightarrow\\neg B$: $\\neg B$.`, why:`Two modus-ponens steps.`},
        {do:`Resolve $B$ with $\\neg B$: $\\bot$.`, why:`Complementary literals contradict.`},
        {do:`KB is inconsistent.`, why:`Any KB deriving $\\bot$ has no model.`}
      ],
      answer:`$\\bot$; the KB is inconsistent.` }
  ]);

})();
