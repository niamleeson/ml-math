/* =====================================================================
   PRACTICE PROBLEMS — MODULE 4 (AI), HARD batch B.
   Harder, multi-step problems for the 11 AI lesson ids.
   Each step has both `do` and `why`. LaTeX backslashes doubled.
   ===================================================================== */
(function(){ var P=window.PRACTICE; function add(id,probs){P[id]=(P[id]||[]).concat(probs);}

  /* ---------------- Q-learning (multi-step episodes) ---------------- */
  add("ai-q-learning", [
    { q:`<p>Two Q-learning updates in a row. Start $\\hat Q(s,a)=0$. Episode: from $s$ take $a$, get $r=4$, land in $s'$ with $\\max_{a'}\\hat Q(s',a')=2$; then from $s$ take $a$ again, get $r=4$, with $\\max\\hat Q'=2$. Use $\\gamma=0.5$, $\\eta=0.5$. Find $\\hat Q(s,a)$ after both updates.</p>`,
      steps:[
        {do:`Target each time $=r+\\gamma\\max\\hat Q'=4+0.5\\times2=5$.`, why:`The target is reward plus discounted best next value; both transitions share it.`},
        {do:`Update 1: $\\hat Q\\leftarrow(1-0.5)\\times0+0.5\\times5=0+2.5=2.5$.`, why:`Blend keeps half the old $0$ and half the target.`},
        {do:`Update 2: $\\hat Q\\leftarrow0.5\\times2.5+0.5\\times5=1.25+2.5=3.75$.`, why:`Now the old value is $2.5$, blended with the same target.`}
      ],
      answer:`$\\hat Q(s,a)=3.75$.` },

    { q:`<p>A 3-step chain $s_1\\to s_2\\to s_3(\\text{terminal})$. All $\\hat Q$ start at $0$. Rewards: $s_1\\to s_2$ gives $0$, $s_2\\to s_3$ gives $10$. $\\gamma=1$, $\\eta=1$. Process the transitions in the order $(s_2\\to s_3)$ then $(s_1\\to s_2)$. Find $\\hat Q(s_1)$ and $\\hat Q(s_2)$.</p>`,
      steps:[
        {do:`Update $(s_2\\to s_3)$: target $=10+1\\times0=10$, so $\\hat Q(s_2)=10$.`, why:`Terminal $s_3$ has best next value $0$; $\\eta=1$ takes the target fully.`},
        {do:`Update $(s_1\\to s_2)$: target $=0+1\\times\\max\\hat Q(s_2)=0+10=10$.`, why:`Now $\\hat Q(s_2)=10$, so the reward propagates back.`},
        {do:`So $\\hat Q(s_1)=10$.`, why:`Again $\\eta=1$ sets it to the target.`}
      ],
      answer:`$\\hat Q(s_1)=10$, $\\hat Q(s_2)=10$.` },

    { q:`<p>Same chain as before but processed in the "wrong" order: first $(s_1\\to s_2)$, then $(s_2\\to s_3)$. All $\\hat Q$ start at $0$, $\\gamma=1$, $\\eta=1$. Find $\\hat Q(s_1)$ and $\\hat Q(s_2)$ after one pass.</p>`,
      steps:[
        {do:`Update $(s_1\\to s_2)$: target $=0+1\\times\\max\\hat Q(s_2)=0+0=0$, so $\\hat Q(s_1)=0$.`, why:`$\\hat Q(s_2)$ is still $0$, so nothing propagates yet.`},
        {do:`Update $(s_2\\to s_3)$: target $=10+0=10$, so $\\hat Q(s_2)=10$.`, why:`The reward only updates $s_2$ here.`},
        {do:`$\\hat Q(s_1)$ stays $0$ this pass.`, why:`It was updated before $s_2$ learned its value; reward propagates one step per pass.`}
      ],
      answer:`$\\hat Q(s_1)=0$, $\\hat Q(s_2)=10$. Order matters: it takes more passes to propagate backward.` },

    { q:`<p>$\\hat Q=6$, but two updates use different learning rates. First: $r=2$, $\\max\\hat Q'=10$, $\\gamma=0.5$, $\\eta=0.5$. Second (on the result): $r=0$, $\\max\\hat Q'=8$, $\\gamma=0.5$, $\\eta=0.25$. Find the final $\\hat Q$.</p>`,
      steps:[
        {do:`Update 1 target $=2+0.5\\times10=7$; blend $=0.5\\times6+0.5\\times7=3+3.5=6.5$.`, why:`Standard blend with $\\eta=0.5$.`},
        {do:`Update 2 target $=0+0.5\\times8=4$.`, why:`Reward $0$ plus discounted best next value.`},
        {do:`Blend $=0.75\\times6.5+0.25\\times4=4.875+1=5.875$.`, why:`Now keep $1-0.25=0.75$ of the old $6.5$.`}
      ],
      answer:`$\\hat Q=5.875$.` },

    { q:`<p>SARSA-style on-policy target. From $s$ take $a$, get $r=3$, land in $s'$ where the policy actually chooses $a'$ with $\\hat Q(s',a')=4$ (not the max, which is $9$). Use the on-policy target $r+\\gamma\\hat Q(s',a')$ with $\\gamma=0.5$, $\\eta=0.5$, old $\\hat Q(s,a)=2$. Update.</p>`,
      steps:[
        {do:`On-policy target $=3+0.5\\times4=5$.`, why:`SARSA uses the value of the action actually taken, $4$, not the max $9$.`},
        {do:`Blend $=0.5\\times2+0.5\\times5=1+2.5=3.5$.`, why:`Half old, half target.`},
        {do:`Note Q-learning would use $3+0.5\\times9=7.5$ instead.`, why:`Off-policy Q-learning bootstraps on the max; that is the key difference.`}
      ],
      answer:`$\\hat Q(s,a)=3.5$ (SARSA); Q-learning would give $4.75$.` }
  ]);

  /* ---------------- Minimax (deeper trees) ---------------- */
  add("ai-minimax", [
    { q:`<p>Depth-3 tree. Root is MAX. Its two children are MIN nodes. Each MIN node has two MAX children, each with two leaves. Leaves (left to right): $[3,12],[8,2]$ under MIN-L; $[14,5],[2,11]$ under MIN-R. Find the root value.</p>`,
      steps:[
        {do:`Bottom MAX nodes: $\\max(3,12)=12$, $\\max(8,2)=8$, $\\max(14,5)=14$, $\\max(2,11)=11$.`, why:`At MAX nodes pick the largest child.`},
        {do:`MIN-L $=\\min(12,8)=8$; MIN-R $=\\min(14,11)=11$.`, why:`At MIN nodes pick the smallest child.`},
        {do:`Root MAX $=\\max(8,11)=11$.`, why:`The root maximizes over the two MIN values.`}
      ],
      answer:`Root value $=11$.` },

    { q:`<p>Root MIN with three MAX children. Child A leaves $[1,4,2]$, child B leaves $[6,3,5]$, child C leaves $[2,2,9]$. Find the value and the move MIN should pick.</p>`,
      steps:[
        {do:`MAX values: A $=\\max(1,4,2)=4$, B $=\\max(6,3,5)=6$, C $=\\max(2,2,9)=9$.`, why:`Each MAX child takes its largest leaf.`},
        {do:`Root MIN $=\\min(4,6,9)=4$.`, why:`MIN picks the smallest of the MAX values.`},
        {do:`The move is child A.`, why:`A achieves the minimizing value $4$.`}
      ],
      answer:`Value $=4$, MIN picks child A.` },

    { q:`<p>A 3-ply tree: MAX over two MIN nodes, each MIN over three leaves. MIN-L leaves $[7,5,6]$, MIN-R leaves $[9,8,4]$. What value can the MAX player guarantee, and which subtree does it choose?</p>`,
      steps:[
        {do:`MIN-L $=\\min(7,5,6)=5$.`, why:`The opponent drives this subtree to its smallest leaf.`},
        {do:`MIN-R $=\\min(9,8,4)=4$.`, why:`Same minimizing logic.`},
        {do:`Root $=\\max(5,4)=5$, choose MIN-L.`, why:`MAX guarantees the larger of the two opponent-forced values.`}
      ],
      answer:`Guaranteed value $=5$; choose the left subtree.` },

    { q:`<p>Mixed-depth tree. Root MAX has child L = a leaf with value $6$, and child R = a MIN node over leaves $[8,7,9]$. Find the root value.</p>`,
      steps:[
        {do:`Child R (MIN) $=\\min(8,7,9)=7$.`, why:`The MIN node takes its smallest leaf.`},
        {do:`Child L is a leaf $=6$.`, why:`Leaves pass their value straight up.`},
        {do:`Root MAX $=\\max(6,7)=7$, pick R.`, why:`MAX compares the leaf against the MIN subtree value.`}
      ],
      answer:`Root value $=7$.` },

    { q:`<p>Four-ply tree: MAX–MIN–MAX–leaf. Root MAX over two MIN nodes. Each MIN has two MAX nodes, each MAX has two leaves. Left MIN: MAX over $[2,7]$ and MAX over $[1,8]$. Right MIN: MAX over $[6,4]$ and MAX over $[9,3]$. Find the root.</p>`,
      steps:[
        {do:`Lowest MAX nodes: $\\max(2,7)=7$, $\\max(1,8)=8$, $\\max(6,4)=6$, $\\max(9,3)=9$.`, why:`Bottom layer is MAX; take the larger leaf.`},
        {do:`Left MIN $=\\min(7,8)=7$; Right MIN $=\\min(6,9)=6$.`, why:`MIN layer takes the smaller MAX value.`},
        {do:`Root MAX $=\\max(7,6)=7$.`, why:`Root maximizes over the two MIN values.`}
      ],
      answer:`Root value $=7$.` }
  ]);

  /* ---------------- Alpha-beta pruning (full-tree traces) ---------------- */
  add("ai-alpha-beta", [
    { q:`<p>MAX root, two MIN children, each with two leaves, scanned left to right. Leaves: MIN-L $[3,5]$, MIN-R $[2,9]$. Using alpha-beta, which leaves get pruned? Give the root value.</p>`,
      steps:[
        {do:`MIN-L: see $3$ then $5$; value $=\\min(3,5)=3$. Set $\\alpha=3$ at root.`, why:`No prune yet; MAX now has $3$ secured.`},
        {do:`MIN-R: see first leaf $2$. Now MIN-R $\\le 2$.`, why:`A MIN node can only go down; its value is at most $2$.`},
        {do:`Since $2\\le\\alpha=3$, prune the second leaf ($9$).`, why:`MIN-R can never beat the secured $3$, so $9$ is irrelevant.`}
      ],
      answer:`Leaf $9$ is pruned; root value $=3$.` },

    { q:`<p>MIN root, two MAX children, each two leaves, left to right. MAX-L $[5,8]$, MAX-R $[7,2]$. Trace alpha-beta: what gets pruned, and the root value?</p>`,
      steps:[
        {do:`MAX-L: $\\max(5,8)=8$. Root MIN sets $\\beta=8$.`, why:`MIN now knows it can hold the value to $\\le 8$.`},
        {do:`MAX-R: see first leaf $7$. MAX-R $\\ge 7$.`, why:`A MAX node can only go up; its value is at least $7$.`},
        {do:`$7<\\beta=8$, so no prune yet; see second leaf $2$, MAX-R $=\\max(7,2)=7$.`, why:`$7<8$ means MAX-R could still lower the MIN, so we must check it.`},
        {do:`Root MIN $=\\min(8,7)=7$.`, why:`No prune occurred here; both leaves of MAX-R mattered.`}
      ],
      answer:`Nothing is pruned; root value $=7$.` },

    { q:`<p>Depth-3: MAX root over three MIN children, each with two leaves, scanned left to right. MIN-A $[5,6]$, MIN-B $[4,?]$, MIN-C $[7,8]$. After MIN-A, alpha $=5$. MIN-B's first leaf is $4$. Do we prune MIN-B's second leaf? Then evaluate MIN-C.</p>`,
      steps:[
        {do:`MIN-A $=\\min(5,6)=5$; root $\\alpha=5$.`, why:`MAX secures $5$ so far.`},
        {do:`MIN-B first leaf $4$: MIN-B $\\le 4\\le 5=\\alpha$, prune its second leaf.`, why:`MIN-B cannot exceed $4$, which is below the secured $5$.`},
        {do:`MIN-C: $\\min(7,8)=7$; root $=\\max(5,7)=7$.`, why:`MIN-C beats $5$, so the root improves to $7$.`}
      ],
      answer:`MIN-B's second leaf is pruned; root value $=7$.` },

    { q:`<p>Full trace. MAX root, two MIN children. MIN-L over MAX nodes with leaves $[2,3]$ and $[10,?]$. Inside MIN-L (a MIN node), the first MAX child returns $\\max(2,3)=3$, setting $\\beta=3$ at MIN-L. The second MAX child sees leaf $10$ first. Prune?</p>`,
      steps:[
        {do:`MIN-L's $\\beta=3$ after its first MAX child returns $3$.`, why:`MIN-L can hold the value to $\\le 3$.`},
        {do:`Second MAX child sees $10$: that MAX node $\\ge 10$.`, why:`A MAX node only goes up from its first leaf.`},
        {do:`Since $10\\ge\\beta=3$, prune the rest of that MAX node.`, why:`The MAX child already exceeds $\\beta$, so MIN-L will reject it; the remaining leaf is irrelevant.`}
      ],
      answer:`The remaining leaf under the second MAX child is pruned (alpha-beta cutoff at $\\alpha\\ge\\beta$).` },

    { q:`<p>Best-case vs worst-case ordering. A MAX root has two MIN children, each with two leaves. Values are $\\{1,2\\}$ and $\\{8,9\\}$. (a) If the high subtree is searched first, how many of the 4 leaves are examined? (b) If the low subtree is first?</p>`,
      steps:[
        {do:`(a) Search $\\{8,9\\}$ first: MIN $=8$, $\\alpha=8$. Then $\\{1,2\\}$: first leaf $1\\le 8$, prune the second. Leaves seen: $8,9,1=3$.`, why:`A strong first move raises $\\alpha$, enabling an early cutoff.`},
        {do:`(b) Search $\\{1,2\\}$ first: MIN $=1$, $\\alpha=1$. Then $\\{8,9\\}$: $8>1$ and $9>1$, no prune. Leaves seen: all $4$.`, why:`A weak first move keeps $\\alpha$ low, so nothing is pruned.`},
        {do:`So ordering matters: $3$ vs $4$ leaves here.`, why:`Good move ordering is what makes alpha-beta search deeper.`}
      ],
      answer:`(a) $3$ leaves; (b) $4$ leaves. Best-first ordering prunes more.` }
  ]);

  /* ---------------- Expectimax (chance + min/max layers) ---------------- */
  add("ai-expectimax", [
    { q:`<p>MAX root over two chance nodes. Chance-L: outcomes $8$ (prob $0.5$) and $2$ (prob $0.5$). Chance-R: outcomes $6$ (prob $0.25$) and $5$ (prob $0.75$). Find the expectimax value and the best move.</p>`,
      steps:[
        {do:`Chance-L $=0.5\\times8+0.5\\times2=4+1=5$.`, why:`Average each outcome weighted by its probability.`},
        {do:`Chance-R $=0.25\\times6+0.75\\times5=1.5+3.75=5.25$.`, why:`Same expectation, with the given weights.`},
        {do:`Root MAX $=\\max(5,5.25)=5.25$, pick Chance-R.`, why:`MAX chooses the higher expected value.`}
      ],
      answer:`Value $=5.25$; pick the right chance node.` },

    { q:`<p>Three layers: MAX over chance over MIN. Root MAX picks one of two chance nodes. Chance-L: $0.5$ leads to a MIN node $\\min(4,10)$, $0.5$ leads to a MIN node $\\min(6,2)$. Find Chance-L's value.</p>`,
      steps:[
        {do:`First MIN $=\\min(4,10)=4$; second MIN $=\\min(6,2)=2$.`, why:`Each MIN child resolves to its smallest leaf.`},
        {do:`Chance-L $=0.5\\times4+0.5\\times2=2+1=3$.`, why:`Average the two MIN values by their probabilities.`}
      ],
      answer:`Chance-L value $=3$.` },

    { q:`<p>A backgammon-style node. MAX rolls a die: with prob $\\tfrac{1}{3}$ it reaches a state worth $9$, with prob $\\tfrac{1}{3}$ a state worth $3$, with prob $\\tfrac{1}{3}$ a state worth $0$. What is the expected value of this chance node?</p>`,
      steps:[
        {do:`Value $=\\tfrac{1}{3}(9)+\\tfrac{1}{3}(3)+\\tfrac{1}{3}(0)$.`, why:`Each outcome is equally likely, so weight by $\\tfrac{1}{3}$.`},
        {do:`$=\\tfrac{1}{3}(9+3+0)=\\tfrac{12}{3}=4$.`, why:`Sum the outcomes then divide by $3$.`}
      ],
      answer:`Expected value $=4$.` },

    { q:`<p>Compare expectimax and minimax on the same tree. MAX root over two chance nodes. Chance-L: $\\{10,0\\}$ each prob $0.5$. Chance-R: $\\{6,4\\}$ each prob $0.5$. (a) Expectimax value and choice. (b) If we wrongly treated these as MIN nodes, what would minimax pick?</p>`,
      steps:[
        {do:`(a) Chance-L $=0.5(10)+0.5(0)=5$; Chance-R $=0.5(6)+0.5(4)=5$.`, why:`Average each chance node.`},
        {do:`Expectimax root $=\\max(5,5)=5$; tie, either move.`, why:`Both branches have equal expected value.`},
        {do:`(b) As MIN: left $=\\min(10,0)=0$, right $=\\min(6,4)=4$; minimax picks right ($4$).`, why:`Worst-case thinking favors the safer right branch.`}
      ],
      answer:`(a) Value $5$, tie. (b) Minimax would pick the right branch ($4$). Expectimax is less pessimistic.` },

    { q:`<p>Deep chance tree. Root chance node: prob $0.6$ to subtree X, prob $0.4$ to subtree Y. X is a MAX node over leaves $[3,7]$. Y is a MIN node over leaves $[5,1]$. Find the root expected value.</p>`,
      steps:[
        {do:`X (MAX) $=\\max(3,7)=7$.`, why:`MAX takes the larger leaf.`},
        {do:`Y (MIN) $=\\min(5,1)=1$.`, why:`MIN takes the smaller leaf.`},
        {do:`Root $=0.6\\times7+0.4\\times1=4.2+0.4=4.6$.`, why:`Average the two subtree values by their probabilities.`}
      ],
      answer:`Root value $=4.6$.` }
  ]);

  /* ---------------- CSP (factor products / constraint propagation) ---------------- */
  add("ai-csp", [
    { q:`<p>Three binary factors over an assignment: $f_1=1$, $f_2=0.5$, $f_3=2$ (a soft preference factor). Compute $\\text{Weight}(x)=\\prod_j f_j(x)$. Is it a valid (nonzero) assignment?</p>`,
      steps:[
        {do:`Weight $=1\\times0.5\\times2=1$.`, why:`The weight is the product of all factor scores.`},
        {do:`Since $1>0$, no hard constraint is broken.`, why:`A zero factor would force the product to $0$; here none is zero.`}
      ],
      answer:`Weight $=1$; valid.` },

    { q:`<p>Map with regions A,B,C in a triangle (all pairs adjacent), domain $\\{R,G\\}$ (2 colors). Each "differ" constraint is a $0/1$ factor. Try A=R, B=G, C=R. Compute the product over the 3 edge factors.</p>`,
      steps:[
        {do:`Edge A–B: R vs G differ $\\to 1$.`, why:`The factor is $1$ when neighbors differ.`},
        {do:`Edge B–C: G vs R differ $\\to 1$.`, why:`Different colors satisfy the constraint.`},
        {do:`Edge A–C: R vs R same $\\to 0$.`, why:`Equal colors break the "differ" rule.`},
        {do:`Weight $=1\\times1\\times0=0$.`, why:`One broken hard constraint zeroes the product.`}
      ],
      answer:`Weight $=0$; invalid. A triangle needs 3 colors, not 2.` },

    { q:`<p>Count solutions. Two variables $X,Y\\in\\{1,2,3\\}$ with the single constraint $X<Y$ (a $0/1$ factor). How many assignments have weight $1$?</p>`,
      steps:[
        {do:`List pairs with $X<Y$: $(1,2),(1,3),(2,3)$.`, why:`Only strictly increasing pairs satisfy the factor.`},
        {do:`Each such pair has factor $1$, weight $=1$.`, why:`The single factor is $1$ exactly when $X<Y$.`},
        {do:`Count $=3$.`, why:`Three valid pairs out of $9$ total.`}
      ],
      answer:`$3$ assignments have weight $1$.` },

    { q:`<p>Weighted CSP. Variable $X\\in\\{a,b\\}$ has a unary preference factor $f(a)=3, f(b)=1$. Variable $Y\\in\\{a,b\\}$ has $g(a)=1,g(b)=4$. A binary factor $h$ is $2$ if $X\\ne Y$ and $1$ if $X=Y$. Find the max-weight assignment.</p>`,
      steps:[
        {do:`$X=a,Y=a$: $3\\times1\\times1=3$. $X=a,Y=b$: $3\\times4\\times2=24$.`, why:`Multiply the two unary factors and the binary factor.`},
        {do:`$X=b,Y=a$: $1\\times1\\times2=2$. $X=b,Y=b$: $1\\times4\\times1=4$.`, why:`Same product over the three factors.`},
        {do:`Max $=24$ at $X=a,Y=b$.`, why:`That assignment scores highest.`}
      ],
      answer:`Best: $X=a,Y=b$ with weight $24$.` },

    { q:`<p>Constraint propagation by counting consistent extensions. $A,B,C$ in a line $A-B-C$, all differ on adjacent edges, domain $\\{1,2,3\\}$. Fix $A=1$. How many full assignments to $(B,C)$ are valid?</p>`,
      steps:[
        {do:`$B\\ne A=1$, so $B\\in\\{2,3\\}$: 2 choices.`, why:`The A–B edge removes $1$ from B.`},
        {do:`For each $B$, $C\\ne B$, so $C$ has $2$ choices (any of $\\{1,2,3\\}$ except $B$).`, why:`The B–C edge removes only $B$ from C; A and C are not adjacent.`},
        {do:`Total $=2\\times2=4$.`, why:`Multiply independent choice counts.`}
      ],
      answer:`$4$ valid $(B,C)$ assignments with $A=1$.` }
  ]);

  /* ---------------- CSP search (AC-3 / forward checking traces) ---------------- */
  add("ai-csp-search", [
    { q:`<p>Forward checking. Map coloring with domain $\\{R,G,B\\}$. A is adjacent to B and C. We assign A=R. Show the domains of B and C after forward checking, then their sizes.</p>`,
      steps:[
        {do:`Remove R from B: $B=\\{G,B\\}$.`, why:`Forward checking deletes the assigned color from each neighbor.`},
        {do:`Remove R from C: $C=\\{G,B\\}$.`, why:`C is also adjacent to A.`},
        {do:`Sizes: $|B|=2$, $|C|=2$.`, why:`Each lost one value; none became empty, so no backtrack.`}
      ],
      answer:`$B=\\{G,B\\}$, $C=\\{G,B\\}$, both size $2$.` },

    { q:`<p>Forward checking to a dead end. Domains: A=$\\{R\\}$ (already fixed), B=$\\{R\\}$, A adjacent B. After we commit A=R, what happens to B, and what must the search do?</p>`,
      steps:[
        {do:`Remove R from B's domain $\\{R\\}$.`, why:`B is adjacent to A=R, so R is forbidden.`},
        {do:`B becomes $\\{\\}$ (empty).`, why:`B had only R, which was just removed.`},
        {do:`Backtrack: undo A=R and try another value.`, why:`An empty domain means this branch cannot be completed.`}
      ],
      answer:`B's domain becomes empty; the search must backtrack.` },

    { q:`<p>AC-3 arc revision. Variables X,Y with constraint $X<Y$. Domains $X=\\{1,2,3\\}$, $Y=\\{1,2\\}$. Revise arc $X\\to Y$: remove any $x$ with no consistent $y$. Show the new domain of X.</p>`,
      steps:[
        {do:`$x=1$: need $y>1$ in $\\{1,2\\}$; $y=2$ works. Keep.`, why:`Arc-consistency keeps $x$ if some $y$ satisfies the constraint.`},
        {do:`$x=2$: need $y>2$ in $\\{1,2\\}$; none. Remove $2$.`, why:`No supporting value for $x=2$.`},
        {do:`$x=3$: need $y>3$; none. Remove $3$.`, why:`No supporting value for $x=3$.`},
        {do:`New $X=\\{1\\}$.`, why:`Only $x=1$ has a consistent partner.`}
      ],
      answer:`After revising $X\\to Y$: $X=\\{1\\}$.` },

    { q:`<p>Full AC-3 pass on a chain $X<Y<Z$ with domains $X=Y=Z=\\{1,2,3\\}$. Revise arcs $Y\\to Z$, then $X\\to Y$. Give the resulting domains.</p>`,
      steps:[
        {do:`Revise $Y\\to Z$ ($Y<Z$): $y=3$ has no $z>3$, remove $3$. $Y=\\{1,2\\}$.`, why:`No support for $y=3$ in $Z=\\{1,2,3\\}$.`},
        {do:`Revise $X\\to Y$ ($X<Y$) with $Y=\\{1,2\\}$: $x=2$ needs $y>2$ — gone; $x=3$ too. Remove $2,3$. $X=\\{1\\}$.`, why:`After Y shrank, X loses its larger values.`},
        {do:`Symmetric revision of $Z$ ($Z>Y$) drops $z=1$, leaving $Z=\\{3\\}$ once $Y$ is pinned to $2$.`, why:`Arc-consistency cascades, forcing $X=1,Y=2,Z=3$.`}
      ],
      answer:`AC-3 narrows to $X=\\{1\\}$, $Y=\\{2\\}$, $Z=\\{3\\}$ — the unique solution.` },

    { q:`<p>Most-constrained-variable (MRV) heuristic. After some assignments, domains are A=$\\{R,G,B\\}$, B=$\\{G\\}$, C=$\\{R,B\\}$, D=$\\{G,B\\}$. Which variable does MRV pick, and why does it help?</p>`,
      steps:[
        {do:`Domain sizes: A=3, B=1, C=2, D=2.`, why:`MRV looks at how many values remain.`},
        {do:`Pick B (size $1$).`, why:`The fewest remaining values means the most constrained variable.`},
        {do:`Assigning B first detects failures early and prunes the tree.`, why:`A forced single value either works or fails immediately, avoiding wasted search.`}
      ],
      answer:`MRV picks B; tackling the tightest variable first prunes dead ends sooner.` }
  ]);

  /* ---------------- Bayes net (joints & marginalization) ---------------- */
  add("ai-bayes-net", [
    { q:`<p>Chain $A\\to B\\to C$. $P(A)=0.4$; $P(B\\mid A)=0.9$, $P(B\\mid\\neg A)=0.2$; $P(C\\mid B)=0.7$, $P(C\\mid\\neg B)=0.1$. Compute the joint $P(A,B,C)$ for all-true.</p>`,
      steps:[
        {do:`Factor: $P(A,B,C)=P(A)P(B\\mid A)P(C\\mid B)$.`, why:`Each node depends only on its parent in the chain.`},
        {do:`$=0.4\\times0.9\\times0.7$.`, why:`Plug in the all-true conditional values.`},
        {do:`$=0.252$.`, why:`$0.4\\times0.9=0.36$, then $\\times0.7=0.252$.`}
      ],
      answer:`$P(A,B,C)=0.252$.` },

    { q:`<p>Same chain $A\\to B\\to C$ with $P(A)=0.4$, $P(B\\mid A)=0.9$, $P(B\\mid\\neg A)=0.2$. Marginalize to get $P(B)$ (probability B is true).</p>`,
      steps:[
        {do:`$P(B)=P(B\\mid A)P(A)+P(B\\mid\\neg A)P(\\neg A)$.`, why:`Sum over the two values of the parent A.`},
        {do:`$=0.9\\times0.4+0.2\\times0.6$.`, why:`$P(\\neg A)=1-0.4=0.6$.`},
        {do:`$=0.36+0.12=0.48$.`, why:`Add the two weighted terms.`}
      ],
      answer:`$P(B)=0.48$.` },

    { q:`<p>Common-cause: $A$ has two children $B$ and $C$. $P(A)=0.5$; $P(B\\mid A)=0.8,P(B\\mid\\neg A)=0.3$; $P(C\\mid A)=0.6,P(C\\mid\\neg A)=0.1$. Find the joint $P(A,B,C)$ for all-true.</p>`,
      steps:[
        {do:`Factor: $P(A)P(B\\mid A)P(C\\mid A)$.`, why:`B and C are conditionally independent given their shared parent A.`},
        {do:`$=0.5\\times0.8\\times0.6$.`, why:`Use the all-true, A-true values.`},
        {do:`$=0.24$.`, why:`$0.5\\times0.8=0.4$, $\\times0.6=0.24$.`}
      ],
      answer:`$P(A,B,C)=0.24$.` },

    { q:`<p>Marginalize over a hidden variable. Common cause $A\\to B$, $A\\to C$ with $P(A)=0.5$, $P(B\\mid A)=0.8,P(B\\mid\\neg A)=0.3$, $P(C\\mid A)=0.6,P(C\\mid\\neg A)=0.1$. Compute $P(B,C)$ (both true) by summing out A.</p>`,
      steps:[
        {do:`A true: $0.5\\times0.8\\times0.6=0.24$.`, why:`Joint $P(A,B,C)$ with A true.`},
        {do:`A false: $0.5\\times0.3\\times0.1=0.015$.`, why:`Joint with A false uses the $\\neg A$ conditionals.`},
        {do:`$P(B,C)=0.24+0.015=0.255$.`, why:`Marginalize: sum over both values of A.`}
      ],
      answer:`$P(B,C)=0.255$.` },

    { q:`<p>V-structure (collider) $A\\to C\\leftarrow B$. $P(A)=0.5$, $P(B)=0.5$, and $P(C\\mid A,B)=0.9$, $P(C\\mid A,\\neg B)=0.6$, $P(C\\mid\\neg A,B)=0.6$, $P(C\\mid\\neg A,\\neg B)=0.1$. Compute $P(C)$ (C true) by marginalizing over A,B.</p>`,
      steps:[
        {do:`Each $(A,B)$ combo has prior $0.5\\times0.5=0.25$.`, why:`A and B are independent with $P=0.5$ each.`},
        {do:`Sum: $0.25(0.9+0.6+0.6+0.1)$.`, why:`Weight each $P(C\\mid A,B)$ by $0.25$ and add.`},
        {do:`$=0.25\\times2.2=0.55$.`, why:`$0.9+0.6+0.6+0.1=2.2$.`}
      ],
      answer:`$P(C)=0.55$.` }
  ]);

  /* ---------------- Bayes inference (posteriors, explaining away) ---------------- */
  add("ai-bayes-inference", [
    { q:`<p>Posterior via Bayes. $P(D)=0.01$ (disease), test $P(+\\mid D)=0.9$, $P(+\\mid\\neg D)=0.05$. Find $P(D\\mid +)$.</p>`,
      steps:[
        {do:`Numerator $=P(+\\mid D)P(D)=0.9\\times0.01=0.009$.`, why:`Joint probability of disease and a positive test.`},
        {do:`$P(+)=0.009+P(+\\mid\\neg D)P(\\neg D)=0.009+0.05\\times0.99=0.009+0.0495=0.0585$.`, why:`Total probability of a positive test, over both disease states.`},
        {do:`$P(D\\mid+)=0.009/0.0585\\approx0.1538$.`, why:`Bayes' rule: posterior = numerator / evidence.`}
      ],
      answer:`$P(D\\mid+)\\approx0.154$.` },

    { q:`<p>Two positive tests (conditionally independent given D). $P(D)=0.01$, $P(+\\mid D)=0.9$, $P(+\\mid\\neg D)=0.05$. Find $P(D\\mid +,+)$.</p>`,
      steps:[
        {do:`Numerator $=0.9^2\\times0.01=0.81\\times0.01=0.0081$.`, why:`Independent tests multiply: $P(+,+\\mid D)=0.9^2$.`},
        {do:`Denominator $=0.0081+0.05^2\\times0.99=0.0081+0.0025\\times0.99=0.0081+0.002475=0.010575$.`, why:`Add the $\\neg D$ branch with $P(+,+\\mid\\neg D)=0.05^2$.`},
        {do:`$P(D\\mid+,+)=0.0081/0.010575\\approx0.766$.`, why:`A second positive test sharply raises the posterior.`}
      ],
      answer:`$P(D\\mid+,+)\\approx0.766$.` },

    { q:`<p>Explaining away. Collider Burglary $\\to$ Alarm $\\leftarrow$ Earthquake. $P(B)=0.01$, $P(E)=0.02$. $P(A\\mid B,E)=0.95, P(A\\mid B,\\neg E)=0.94, P(A\\mid\\neg B,E)=0.29, P(A\\mid\\neg B,\\neg E)=0.001$. Compute $P(A)$ (alarm true).</p>`,
      steps:[
        {do:`Weights: $P(B,E)=0.0002$, $P(B,\\neg E)=0.0098$, $P(\\neg B,E)=0.0198$, $P(\\neg B,\\neg E)=0.9702$.`, why:`Multiply the independent priors for each $(B,E)$ combo.`},
        {do:`$P(A)=0.0002(0.95)+0.0098(0.94)+0.0198(0.29)+0.9702(0.001)$.`, why:`Marginalize: weight each conditional by its combo probability.`},
        {do:`$=0.00019+0.009212+0.005742+0.0009702\\approx0.01611$.`, why:`Sum the four terms.`}
      ],
      answer:`$P(A)\\approx0.0161$.` },

    { q:`<p>Odds-form update. Prior odds of disease $D$ vs $\\neg D$ are $1:99$. A test has likelihood ratio $P(+\\mid D)/P(+\\mid\\neg D)=0.9/0.05=18$. Find the posterior odds and probability $P(D\\mid+)$.</p>`,
      steps:[
        {do:`Posterior odds $=$ prior odds $\\times$ likelihood ratio $=\\tfrac{1}{99}\\times18=\\tfrac{18}{99}$.`, why:`Bayes in odds form multiplies prior odds by the likelihood ratio.`},
        {do:`$\\tfrac{18}{99}=\\tfrac{2}{11}$, i.e. odds $2:11$.`, why:`Simplify the fraction.`},
        {do:`$P(D\\mid+)=\\tfrac{2}{2+11}=\\tfrac{2}{13}\\approx0.154$.`, why:`Convert odds $2:11$ back to a probability.`}
      ],
      answer:`Posterior odds $2:11$, $P(D\\mid+)\\approx0.154$ (matches the direct Bayes computation).` },

    { q:`<p>Explaining away, numeric comparison. Suppose $P(B\\mid A)\\approx0.50$ when only the alarm is known. After learning the earthquake also happened, $P(B\\mid A,E)$ drops because E already explains A. Given $P(B\\mid A,E)=0.10$, by how much did belief in burglary fall?</p>`,
      steps:[
        {do:`Before: $P(B\\mid A)=0.50$.`, why:`With only the alarm, burglary is a strong candidate cause.`},
        {do:`After: $P(B\\mid A,E)=0.10$.`, why:`The earthquake is a confirmed rival cause that explains the alarm.`},
        {do:`Drop $=0.50-0.10=0.40$.`, why:`Explaining away lowers the probability of the alternative cause.`}
      ],
      answer:`Belief in burglary falls by $0.40$ (from $0.50$ to $0.10$) — classic explaining away.` }
  ]);

  /* ---------------- HMM (multi-step forward) ---------------- */
  add("ai-hmm", [
    { q:`<p>HMM forward, one step. Hidden $\\in\\{R,S\\}$. Prior $P(R)=0.5,P(S)=0.5$. Transition: stay $0.7$, switch $0.3$. Emission $P(\\text{Umb}\\mid R)=0.9$, $P(\\text{Umb}\\mid S)=0.2$. We see Umbrella at $t{=}1$. Find the normalized belief $P(R\\mid\\text{Umb})$.</p>`,
      steps:[
        {do:`Predict: $P(R)=0.5$, $P(S)=0.5$ (prior, no prior transition).`, why:`At step 1 the belief is just the prior.`},
        {do:`Weight by emission: $R:0.5\\times0.9=0.45$, $S:0.5\\times0.2=0.10$.`, why:`Multiply each state's probability by the chance it would produce the umbrella.`},
        {do:`Normalize: $P(R\\mid\\text{Umb})=0.45/(0.45+0.10)=0.45/0.55\\approx0.818$.`, why:`Divide by the total so beliefs sum to $1$.`}
      ],
      answer:`$P(R\\mid\\text{Umb})\\approx0.818$.` },

    { q:`<p>Continue the previous HMM to $t{=}2$. Start from belief $P(R)=0.818,P(S)=0.182$. Transition stay $0.7$, switch $0.3$. We see Umbrella again. Find $P(R)$ after $t{=}2$.</p>`,
      steps:[
        {do:`Predict $R$: $0.7\\times0.818+0.3\\times0.182=0.5726+0.0546=0.6272$.`, why:`R can come from staying R or switching from S.`},
        {do:`Predict $S$: $0.3\\times0.818+0.7\\times0.182=0.2454+0.1274=0.3728$.`, why:`S from R switching or S staying; predictions sum to $1$.`},
        {do:`Emit + normalize: $R:0.6272\\times0.9=0.5645$, $S:0.3728\\times0.2=0.0746$; $P(R)=0.5645/0.6391\\approx0.883$.`, why:`Weight by emission then renormalize.`}
      ],
      answer:`$P(R)\\approx0.883$ after the second umbrella.` },

    { q:`<p>HMM with a contrary observation. From belief $P(R)=0.883,P(S)=0.117$, transition stay $0.7$, switch $0.3$, now observe No-Umbrella. Emissions: $P(\\text{Umb}\\mid R)=0.9$ so $P(\\text{NoUmb}\\mid R)=0.1$; $P(\\text{NoUmb}\\mid S)=0.8$. Find $P(R)$.</p>`,
      steps:[
        {do:`Predict $R$: $0.7\\times0.883+0.3\\times0.117=0.6181+0.0351=0.6532$.`, why:`Transition the current belief forward.`},
        {do:`Predict $S$: $0.3\\times0.883+0.7\\times0.117=0.2649+0.0819=0.3468$.`, why:`Complementary prediction for S.`},
        {do:`Emit + normalize: $R:0.6532\\times0.1=0.06532$, $S:0.3468\\times0.8=0.27744$; $P(R)=0.06532/0.34276\\approx0.191$.`, why:`No-umbrella strongly favors Sunny, so belief in Rain collapses.`}
      ],
      answer:`$P(R)\\approx0.191$ — one dry day flips the belief toward Sunny.` },

    { q:`<p>Symmetric-prior shortcut. HMM, prior $P(R)=P(S)=0.5$, observe Umbrella with $P(\\text{Umb}\\mid R)=0.8$, $P(\\text{Umb}\\mid S)=0.4$. Show the posterior equals the normalized emission ratio.</p>`,
      steps:[
        {do:`Weights: $R:0.5\\times0.8=0.4$, $S:0.5\\times0.4=0.2$.`, why:`Equal prior multiplies both emissions by the same $0.5$.`},
        {do:`Normalize: $P(R)=0.4/0.6=2/3\\approx0.667$.`, why:`The $0.5$ cancels, leaving the emission ratio $0.8:0.4=2:1$.`},
        {do:`So $P(R)=\\tfrac{0.8}{0.8+0.4}=\\tfrac{2}{3}$.`, why:`With a flat prior the posterior is just the normalized likelihoods.`}
      ],
      answer:`$P(R)=2/3\\approx0.667$.` },

    { q:`<p>Two-step joint likelihood (not normalized). HMM with $P(H_1{=}R)=0.6$, transition $P(R\\mid R)=0.7$, emission $P(e_1\\mid R)=0.9$, $P(e_2\\mid R)=0.9$. Compute the joint $P(H_1{=}R,H_2{=}R,e_1,e_2)$ along the all-Rainy path.</p>`,
      steps:[
        {do:`Use $P(H_1)P(e_1\\mid H_1)P(H_2\\mid H_1)P(e_2\\mid H_2)$.`, why:`The HMM joint factors into prior, emission, transition, emission.`},
        {do:`$=0.6\\times0.9\\times0.7\\times0.9$.`, why:`Plug the all-Rainy values into each factor.`},
        {do:`$=0.6\\times0.9=0.54$; $\\times0.7=0.378$; $\\times0.9=0.3402$.`, why:`Multiply step by step.`}
      ],
      answer:`Joint along the all-Rainy path $=0.3402$.` }
  ]);

  /* ---------------- Propositional logic (truth tables / CNF / entailment) ---------------- */
  add("ai-propositional-logic", [
    { q:`<p>Build the truth table for $(A\\rightarrow B)\\wedge(B\\rightarrow A)$ (i.e. $A\\leftrightarrow B$). For which of the 4 rows is it true?</p>`,
      steps:[
        {do:`$A{=}T,B{=}T$: $(T)\\wedge(T)=T$. $A{=}T,B{=}F$: $(F)\\wedge\\dots=F$.`, why:`$A\\to B$ is false when A true, B false.`},
        {do:`$A{=}F,B{=}T$: $(T)\\wedge(F)=F$. $A{=}F,B{=}F$: $(T)\\wedge(T)=T$.`, why:`$B\\to A$ is false when B true, A false.`},
        {do:`True rows: TT and FF.`, why:`The biconditional holds exactly when A and B match.`}
      ],
      answer:`True only when $A$ and $B$ have the same value (rows TT and FF).` },

    { q:`<p>Is $(A\\vee B)\\wedge(\\neg A)$ satisfiable? If so, give a model; then say what it entails about $B$.</p>`,
      steps:[
        {do:`$\\neg A$ forces $A=F$.`, why:`The second conjunct requires A false.`},
        {do:`With $A=F$, $(A\\vee B)$ needs $B=T$.`, why:`OR is true only if at least one side is true; A is false.`},
        {do:`Model $A=F,B=T$ satisfies it; and the formula entails $B$.`, why:`Every satisfying model has $B=T$, so the formula $\\models B$.`}
      ],
      answer:`Satisfiable by $A{=}F,B{=}T$; it entails $B$.` },

    { q:`<p>Convert $A\\rightarrow(B\\wedge C)$ to CNF.</p>`,
      steps:[
        {do:`Eliminate $\\rightarrow$: $\\neg A\\vee(B\\wedge C)$.`, why:`$f\\rightarrow g\\equiv\\neg f\\vee g$.`},
        {do:`Distribute OR over AND: $(\\neg A\\vee B)\\wedge(\\neg A\\vee C)$.`, why:`$x\\vee(y\\wedge z)\\equiv(x\\vee y)\\wedge(x\\vee z)$.`},
        {do:`Result is a conjunction of two clauses.`, why:`CNF = AND of OR-clauses.`}
      ],
      answer:`CNF: $(\\neg A\\vee B)\\wedge(\\neg A\\vee C)$.` },

    { q:`<p>Entailment check by truth table. KB $=(A\\vee B)\\wedge(\\neg B\\vee C)$. Does KB $\\models (A\\vee C)$? Test the models where KB is true.</p>`,
      steps:[
        {do:`KB true requires $A\\vee B$ and $\\neg B\\vee C$ both hold.`, why:`Both conjuncts must be satisfied.`},
        {do:`Case $B=T$: then $\\neg B\\vee C$ needs $C=T$, so $A\\vee C=T$. Case $B=F$: then $A\\vee B$ needs $A=T$, so $A\\vee C=T$.`, why:`Split on B; each case forces $A\\vee C$ true.`},
        {do:`In every KB-true model, $A\\vee C$ is true.`, why:`That is exactly the definition of entailment.`}
      ],
      answer:`Yes, KB $\\models (A\\vee C)$ (this is the resolvent of the two clauses).` },

    { q:`<p>Count satisfying models. How many of the $2^3=8$ assignments to $A,B,C$ satisfy $(A\\vee B\\vee C)\\wedge(\\neg A\\vee\\neg B)$?</p>`,
      steps:[
        {do:`Clause 2 $(\\neg A\\vee\\neg B)$ forbids $A=B=T$: removes the 2 rows with $A,B$ both true.`, why:`That clause is false only when both A and B are true.`},
        {do:`Of the remaining $6$ rows, clause 1 $(A\\vee B\\vee C)$ fails only at $A{=}B{=}C{=}F$.`, why:`OR of all three is false only when all are false.`},
        {do:`Satisfying $=6-1=5$.`, why:`Remove the all-false row from the $6$ allowed by clause 2.`}
      ],
      answer:`$5$ models satisfy the formula.` }
  ]);

  /* ---------------- Inference rules (modus ponens, resolution) ---------------- */
  add("ai-inference-rules", [
    { q:`<p>Forward chaining with modus ponens. KB: $P$; $P\\rightarrow Q$; $Q\\rightarrow R$; $R\\rightarrow S$. Derive $S$.</p>`,
      steps:[
        {do:`From $P$ and $P\\rightarrow Q$, conclude $Q$.`, why:`Modus ponens: from $f$ and $f\\rightarrow g$, conclude $g$.`},
        {do:`From $Q$ and $Q\\rightarrow R$, conclude $R$.`, why:`Apply modus ponens again with the new fact.`},
        {do:`From $R$ and $R\\rightarrow S$, conclude $S$.`, why:`Chain one more step.`}
      ],
      answer:`$S$ is derived in 3 modus-ponens steps.` },

    { q:`<p>Modus ponens needs both premises. KB: $A\\rightarrow B$ and $B$ (but not $A$). Can we conclude $A$? Can we conclude $B$?</p>`,
      steps:[
        {do:`$B$ is already a fact, so $B$ holds.`, why:`It is directly in the KB.`},
        {do:`To get $A$ we would need $B\\rightarrow A$ or $A$ itself — neither is present.`, why:`Affirming the consequent ($B$, $A\\rightarrow B$, so $A$) is invalid.`},
        {do:`So $A$ is not entailed.`, why:`Modus ponens fires only from $A$ and $A\\rightarrow B$, not the reverse.`}
      ],
      answer:`$B$ holds; $A$ does not follow (that would be the fallacy of affirming the consequent).` },

    { q:`<p>Single resolution step. Clauses $(A\\vee B)$ and $(\\neg B\\vee C)$. Resolve on $B$.</p>`,
      steps:[
        {do:`$B$ appears positive in clause 1 and negative in clause 2.`, why:`Resolution cancels a literal that is positive in one clause and negative in the other.`},
        {do:`Drop $B$ and $\\neg B$, union the rest: $(A\\vee C)$.`, why:`The resolvent is the OR of the remaining literals.`}
      ],
      answer:`Resolvent: $(A\\vee C)$.` },

    { q:`<p>Resolution refutation. Prove KB $\\models Q$ where KB $=\\{P,\\;\\neg P\\vee Q\\}$. Add $\\neg Q$ and derive the empty clause.</p>`,
      steps:[
        {do:`Negate the goal: add $\\neg Q$ to the clause set.`, why:`Refutation proves entailment by showing KB $\\wedge\\neg Q$ is unsatisfiable.`},
        {do:`Resolve $P$ with $(\\neg P\\vee Q)$ on $P$: get $Q$.`, why:`Cancel $P$/$\\neg P$, leaving $Q$.`},
        {do:`Resolve $Q$ with $\\neg Q$: get the empty clause $\\bot$.`, why:`Two complementary unit clauses resolve to a contradiction.`}
      ],
      answer:`Empty clause derived, so KB $\\models Q$.` },

    { q:`<p>Multi-step resolution refutation. Clauses: $(\\neg A\\vee B)$, $(\\neg B\\vee C)$, $A$, and the negated goal $\\neg C$. Derive the empty clause.</p>`,
      steps:[
        {do:`Resolve $A$ with $(\\neg A\\vee B)$ on $A$: get $B$.`, why:`Cancel $A$/$\\neg A$.`},
        {do:`Resolve $B$ with $(\\neg B\\vee C)$ on $B$: get $C$.`, why:`Cancel $B$/$\\neg B$.`},
        {do:`Resolve $C$ with $\\neg C$: get $\\bot$ (empty clause).`, why:`Complementary units contradict, proving KB $\\models C$.`}
      ],
      answer:`Empty clause reached in 3 resolutions, so KB $\\models C$.` }
  ]);

})();
