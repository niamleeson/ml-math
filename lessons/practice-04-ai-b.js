/* =====================================================================
   PRACTICE PROBLEMS — MODULE 4 (AI), batch B.
   11 lesson ids, exactly 10 problems each, easy -> hard.
   Style matches the gold standard: short sentences, every step has
   a `do` and a `why`, LaTeX backslashes doubled.
   ===================================================================== */
(function(){ Object.assign(window.PRACTICE, {

  /* ---------------- Q-learning ---------------- */
  "ai-q-learning": [
    { q:`<p>The blend $\\hat Q\\leftarrow(1-\\eta)\\hat Q+\\eta[r+\\gamma\\max_{a'}\\hat Q']$ uses $\\eta=0.5$. What share of the old estimate is kept?</p>`,
      steps:[
        {do:`Old share $=1-\\eta=1-0.5=0.5$.`, why:`The factor in front of the old $\\hat Q$ is $1-\\eta$.`},
        {do:`New share $=\\eta=0.5$.`, why:`The two shares always add to $1$.`}
      ],
      answer:`Keep $0.5$ of the old, mix in $0.5$ new.` },

    { q:`<p>$\\hat Q=0$, reward $r=10$, best next value $\\max\\hat Q'=0$, $\\gamma=1$, $\\eta=1$. Update $\\hat Q$.</p>`,
      steps:[
        {do:`Target $=r+\\gamma\\max\\hat Q'=10+1\\times0=10$.`, why:`The target is reward plus discounted best next value.`},
        {do:`Blend $=(1-1)\\times0+1\\times10=10$.`, why:`With $\\eta=1$ the old value is thrown away.`}
      ],
      answer:`$\\hat Q=10$.` },

    { q:`<p>$\\hat Q=4$, $r=10$, $\\max\\hat Q'=0$, $\\gamma=0.5$, $\\eta=0.5$. Update $\\hat Q$.</p>`,
      steps:[
        {do:`Target $=10+0.5\\times0=10$.`, why:`Reward plus discounted best next value.`},
        {do:`Blend $=0.5\\times4+0.5\\times10=2+5=7$.`, why:`Keep half the old, add half the target.`}
      ],
      answer:`$\\hat Q=7$.` },

    { q:`<p>$\\hat Q=2$, $r=8$, $\\max\\hat Q'=0$, $\\gamma=0.5$, $\\eta=0.5$. Update $\\hat Q$.</p>`,
      steps:[
        {do:`Target $=8+0.5\\times0=8$.`, why:`Reward plus discounted next value.`},
        {do:`Blend $=0.5\\times2+0.5\\times8=1+4=5$.`, why:`Half old, half target.`}
      ],
      answer:`$\\hat Q=5$.` },

    { q:`<p>$\\hat Q=6$, $r=2$, best next value $\\max\\hat Q'=10$, $\\gamma=0.5$, $\\eta=0.2$. Update $\\hat Q$.</p>`,
      steps:[
        {do:`Target $=2+0.5\\times10=2+5=7$.`, why:`Add the discounted best next value to the reward.`},
        {do:`Blend $=0.8\\times6+0.2\\times7=4.8+1.4=6.2$.`, why:`Keep $1-\\eta=0.8$ of old, add $0.2$ of target.`}
      ],
      answer:`$\\hat Q=6.2$.` },

    { q:`<p>$\\hat Q=10$, $r=0$, $\\max\\hat Q'=4$, $\\gamma=1$, $\\eta=0.5$. Update $\\hat Q$.</p>`,
      steps:[
        {do:`Target $=0+1\\times4=4$.`, why:`No discount, so the full next value adds in.`},
        {do:`Blend $=0.5\\times10+0.5\\times4=5+2=7$.`, why:`Half old, half target.`}
      ],
      answer:`$\\hat Q=7$.` },

    { q:`<p>The new state $s'$ has $\\hat Q(s',\\text{left})=3$ and $\\hat Q(s',\\text{right})=9$. What is $\\max_{a'}\\hat Q(s',a')$?</p>`,
      steps:[
        {do:`Take the larger: $\\max(3,9)=9$.`, why:`The target uses the best action value at $s'$.`},
        {do:`Use $9$ as $\\max\\hat Q'$ in the update.`, why:`Q-learning is greedy in the bootstrap target.`}
      ],
      answer:`$\\max_{a'}\\hat Q(s',a')=9$.` },

    { q:`<p>$\\hat Q=5$, $r=1$, two next actions with values $2$ and $8$, $\\gamma=0.5$, $\\eta=0.5$. Update $\\hat Q$.</p>`,
      steps:[
        {do:`Best next $=\\max(2,8)=8$.`, why:`Use the largest next-action value.`},
        {do:`Target $=1+0.5\\times8=1+4=5$.`, why:`Reward plus discounted best next value.`},
        {do:`Blend $=0.5\\times5+0.5\\times5=5$.`, why:`Target equals old, so nothing moves.`}
      ],
      answer:`$\\hat Q=5$.` },

    { q:`<p>$s'$ is terminal, so its best value is $0$. $\\hat Q=4$, $r=10$, $\\gamma=0.9$, $\\eta=0.5$. Update $\\hat Q$.</p>`,
      steps:[
        {do:`Target $=10+0.9\\times0=10$.`, why:`A terminal state contributes no future value.`},
        {do:`Blend $=0.5\\times4+0.5\\times10=2+5=7$.`, why:`Half old, half target.`}
      ],
      answer:`$\\hat Q=7$.` },

    { q:`<p>Two updates. Start $\\hat Q=0$. Each time $r=10$, $\\max\\hat Q'=0$, $\\gamma=0.5$, $\\eta=0.5$. Value after two updates?</p>`,
      steps:[
        {do:`Target each time $=10+0.5\\times0=10$.`, why:`Same reward and next value both times.`},
        {do:`Update 1: $0.5\\times0+0.5\\times10=5$.`, why:`Blend old $0$ with target $10$.`},
        {do:`Update 2: $0.5\\times5+0.5\\times10=2.5+5=7.5$.`, why:`Now the old value is $5$.`}
      ],
      answer:`$\\hat Q=7.5$.` }
  ],

  /* ---------------- Minimax ---------------- */
  "ai-minimax": [
    { q:`<p>A MAX node has children worth $3$ and $7$. What value backs up?</p>`,
      steps:[
        {do:`It is your move, so use $\\max$.`, why:`MAX takes the best (largest) child.`},
        {do:`$\\max(3,7)=7$.`, why:`$7$ is larger than $3$.`}
      ],
      answer:`$7$.` },

    { q:`<p>A MIN node has children worth $4$ and $1$. What value backs up?</p>`,
      steps:[
        {do:`It is the opponent's move, so use $\\min$.`, why:`MIN takes the worst-for-you (smallest) child.`},
        {do:`$\\min(4,1)=1$.`, why:`$1$ is smaller than $4$.`}
      ],
      answer:`$1$.` },

    { q:`<p>Your move (MAX). Branch $A$'s MIN reply is $\\min(3,8)$; branch $B$'s is $\\min(5,2)$. Which branch, and what value?</p>`,
      steps:[
        {do:`Branch $A=\\min(3,8)=3$.`, why:`The opponent minimizes inside $A$.`},
        {do:`Branch $B=\\min(5,2)=2$.`, why:`The opponent minimizes inside $B$.`},
        {do:`MAX $=\\max(3,2)=3$, pick $A$.`, why:`You take the best of the two branch values.`}
      ],
      answer:`Pick $A$, value $3$.` },

    { q:`<p>MAX at the root. Branch $A$ MIN reply $=\\min(6,1)$, branch $B$ MIN reply $=\\min(4,4)$. Value?</p>`,
      steps:[
        {do:`$A=\\min(6,1)=1$.`, why:`MIN takes the worst-for-you child.`},
        {do:`$B=\\min(4,4)=4$.`, why:`Both children equal $4$.`},
        {do:`Root $=\\max(1,4)=4$.`, why:`MAX picks the better branch, $B$.`}
      ],
      answer:`$4$ (pick $B$).` },

    { q:`<p>A MIN node sits above two MAX nodes. Left MAX $=\\max(2,5)$, right MAX $=\\max(1,9)$. What backs up to the MIN node?</p>`,
      steps:[
        {do:`Left MAX $=\\max(2,5)=5$.`, why:`MAX takes the larger child.`},
        {do:`Right MAX $=\\max(1,9)=9$.`, why:`Same rule on the right.`},
        {do:`MIN $=\\min(5,9)=5$.`, why:`The MIN node picks the smaller of the two.`}
      ],
      answer:`$5$.` },

    { q:`<p>Three leaves under a MAX node: $-2$, $0$, $4$. What backs up?</p>`,
      steps:[
        {do:`MAX scans all three values.`, why:`A MAX node compares every child.`},
        {do:`$\\max(-2,0,4)=4$.`, why:`MAX takes the largest, even past zero.`}
      ],
      answer:`$4$.` },

    { q:`<p>Root is MAX. Child $X$ is a MIN over leaves $7,3$. Child $Y$ is a MIN over leaves $5,6$. Root value?</p>`,
      steps:[
        {do:`$X=\\min(7,3)=3$.`, why:`MIN node $X$ takes the smaller leaf.`},
        {do:`$Y=\\min(5,6)=5$.`, why:`MIN node $Y$ takes the smaller leaf.`},
        {do:`Root $=\\max(3,5)=5$.`, why:`MAX takes the bigger child.`}
      ],
      answer:`$5$.` },

    { q:`<p>Three-level tree. Root MAX over two MIN nodes. MIN-1 over $(8,2)$, MIN-2 over $(6,9)$. What does MAX choose?</p>`,
      steps:[
        {do:`MIN-1 $=\\min(8,2)=2$.`, why:`Opponent minimizes the first branch.`},
        {do:`MIN-2 $=\\min(6,9)=6$.`, why:`Opponent minimizes the second branch.`},
        {do:`MAX $=\\max(2,6)=6$.`, why:`You take the higher branch, MIN-2.`}
      ],
      answer:`MAX chooses MIN-2, value $6$.` },

    { q:`<p>A MAX node has one child that is a leaf worth $5$ and one child that is a MIN over $(10,1)$. Value?</p>`,
      steps:[
        {do:`MIN child $=\\min(10,1)=1$.`, why:`The opponent picks the worst, $1$.`},
        {do:`MAX $=\\max(5,1)=5$.`, why:`MAX prefers the leaf worth $5$.`}
      ],
      answer:`$5$.` },

    { q:`<p>Full tiny tree. Root MAX. Left MIN over MAX nodes $\\max(1,4)$ and $\\max(2,2)$. Right MIN over MAX nodes $\\max(3,3)$ and $\\max(0,7)$. Root value?</p>`,
      steps:[
        {do:`Left children: $\\max(1,4)=4$, $\\max(2,2)=2$.`, why:`Evaluate the two MAX nodes under the left MIN.`},
        {do:`Left MIN $=\\min(4,2)=2$.`, why:`MIN takes the smaller.`},
        {do:`Right children: $\\max(3,3)=3$, $\\max(0,7)=7$. Right MIN $=\\min(3,7)=3$.`, why:`Same for the right side.`},
        {do:`Root $=\\max(2,3)=3$.`, why:`MAX takes the larger of the two MIN values.`}
      ],
      answer:`$3$.` }
  ],

  /* ---------------- Alpha-beta ---------------- */
  "ai-alpha-beta": [
    { q:`<p>The cutoff rule for alpha-beta is "prune when ___". Fill in the blank with the condition on $\\alpha,\\beta$.</p>`,
      steps:[
        {do:`$\\alpha$ is max's floor, $\\beta$ is min's ceiling.`, why:`These track the best each side already secured.`},
        {do:`Prune when $\\alpha\\ge\\beta$.`, why:`Once the floor meets the ceiling, the branch cannot matter.`}
      ],
      answer:`Prune when $\\alpha\\ge\\beta$.` },

    { q:`<p>MAX already secured $\\alpha=5$. A new MIN branch's first child returns $2$. Can the rest of that branch change the choice?</p>`,
      steps:[
        {do:`The MIN branch value is at most $2$.`, why:`A MIN node only goes lower as more children appear.`},
        {do:`Since $2&lt;5$, it cannot beat $\\alpha=5$. Prune.`, why:`No remaining child can raise it above $5$.`}
      ],
      answer:`No. Prune the branch.` },

    { q:`<p>MAX has $\\alpha=7$. A MIN node's first child returns $4$. Prune or continue?</p>`,
      steps:[
        {do:`MIN value $\\le 4$.`, why:`Min can only fall further.`},
        {do:`$4&lt;7$, so $\\alpha\\ge$ this branch's ceiling. Prune.`, why:`It cannot exceed the secured $7$.`}
      ],
      answer:`Prune.` },

    { q:`<p>MAX has $\\alpha=3$. A MIN node's first child returns $9$. Prune or continue?</p>`,
      steps:[
        {do:`MIN value so far $\\le 9$, but still above $3$.`, why:`The branch could still end up better than $3$.`},
        {do:`Since $9\\ge3$ does not force $\\alpha\\ge\\beta$ yet, continue.`, why:`More children might keep it above $\\alpha$.`}
      ],
      answer:`Continue (no prune yet).` },

    { q:`<p>Inside a MIN node, $\\alpha=5$. After the first child, $\\beta=4$. Check $\\alpha\\ge\\beta$.</p>`,
      steps:[
        {do:`Compare: $\\alpha=5$, $\\beta=4$, so $5\\ge4$.`, why:`The prune test is $\\alpha\\ge\\beta$.`},
        {do:`Condition holds, so prune the remaining children.`, why:`Max already has a better option elsewhere.`}
      ],
      answer:`Prune ($5\\ge4$).` },

    { q:`<p>Inside a MIN node, $\\alpha=2$, and after a child $\\beta=6$. Prune?</p>`,
      steps:[
        {do:`Check $\\alpha\\ge\\beta$: is $2\\ge6$? No.`, why:`The cutoff needs $\\alpha\\ge\\beta$.`},
        {do:`Keep exploring this node.`, why:`The branch may still matter.`}
      ],
      answer:`No prune ($2&lt;6$).` },

    { q:`<p>MAX root. Left branch fully evaluated to $5$, so $\\alpha=5$. Right is a MIN node; its first leaf is $3$. Do we read its other leaves?</p>`,
      steps:[
        {do:`Right MIN $\\le 3$.`, why:`Min cannot rise above its smallest seen child.`},
        {do:`$3&lt;\\alpha=5$, so prune.`, why:`Right can never beat the left's $5$.`}
      ],
      answer:`No, prune the right branch.` },

    { q:`<p>MAX root. Left branch gave $\\alpha=4$. Right MIN node leaves are $6$ then $1$. After which leaf can we prune?</p>`,
      steps:[
        {do:`After leaf $6$: MIN $\\le6$, still $&gt;4$, no prune.`, why:`$6\\ge\\alpha$, branch may still win.`},
        {do:`After leaf $1$: MIN $\\le1&lt;4$. Prune.`, why:`Now the branch ceiling fell below $\\alpha$.`}
      ],
      answer:`Prune after the leaf worth $1$.` },

    { q:`<p>Best-case ordering lets alpha-beta visit only about $b^{d/2}$ leaves instead of $b^d$. For $b=4$, $d=2$, compare the leaf counts.</p>`,
      steps:[
        {do:`Full: $b^d=4^2=16$.`, why:`Plain minimax visits every leaf.`},
        {do:`Best case: $b^{d/2}=4^{1}=4$.`, why:`Good ordering roughly halves the exponent.`}
      ],
      answer:`$16$ vs $4$ leaves.` },

    { q:`<p>MAX root with two MIN children. Left MIN leaves $(2,9)$ are read first, giving the left value. At the right MIN, first leaf is $1$. Does alpha-beta prune the right, and what is the root value?</p>`,
      steps:[
        {do:`Left MIN $=\\min(2,9)=2$, so $\\alpha=2$.`, why:`MAX now has a floor of $2$.`},
        {do:`Right MIN first leaf $1$: value $\\le1&lt;2$. Prune rest.`, why:`The right branch cannot beat $2$.`},
        {do:`Root $=\\max(2,\\le1)=2$.`, why:`Left branch wins.`}
      ],
      answer:`Prune right; root $=2$.` }
  ],

  /* ---------------- Expectimax ---------------- */
  "ai-expectimax": [
    { q:`<p>A chance node has two outcomes, each probability $0.5$, worth $8$ and $2$. Expectimax value?</p>`,
      steps:[
        {do:`Weight each outcome: $0.5\\times8=4$ and $0.5\\times2=1$.`, why:`A chance node weights each outcome by its probability.`},
        {do:`Add them: $4+1=5$.`, why:`The chance value is the sum of weighted outcomes.`}
      ],
      answer:`$5$.` },

    { q:`<p>Same node, $8$ and $2$. What would minimax (worst case) give, and how does expectimax differ?</p>`,
      steps:[
        {do:`Minimax $=\\min(8,2)=2$.`, why:`Minimax assumes the worst outcome.`},
        {do:`Expectimax $=0.5\\times8+0.5\\times2=5$.`, why:`Expectimax averages instead.`}
      ],
      answer:`Minimax $2$, expectimax $5$.` },

    { q:`<p>Chance node: outcomes $10$ and $0$, each probability $0.5$. Expectimax value?</p>`,
      steps:[
        {do:`Weight each: $0.5\\times10=5$ and $0.5\\times0=0$.`, why:`Multiply each outcome by its probability.`},
        {do:`Add: $5+0=5$.`, why:`Sum the weighted outcomes.`}
      ],
      answer:`$5$.` },

    { q:`<p>Chance node: outcome $12$ with probability $0.25$, outcome $4$ with probability $0.75$. Expectimax value?</p>`,
      steps:[
        {do:`$0.25\\times12=3$.`, why:`Weight the first outcome.`},
        {do:`$0.75\\times4=3$. Sum $=3+3=6$.`, why:`Weight the second and add.`}
      ],
      answer:`$6$.` },

    { q:`<p>Three equally likely outcomes (each $1/3$) worth $3$, $6$, $9$. Expectimax value?</p>`,
      steps:[
        {do:`Sum $=3+6+9=18$.`, why:`Equal weights mean a plain average.`},
        {do:`Average $=18/3=6$.`, why:`Divide by the number of outcomes.`}
      ],
      answer:`$6$.` },

    { q:`<p>A MAX node has two child chance nodes. Chance $A=0.5\\times8+0.5\\times2$, chance $B=0.5\\times4+0.5\\times4$. What does MAX pick?</p>`,
      steps:[
        {do:`Chance $A=4+1=5$.`, why:`Average outcomes of $A$.`},
        {do:`Chance $B=2+2=4$.`, why:`Average outcomes of $B$.`},
        {do:`MAX $=\\max(5,4)=5$, pick $A$.`, why:`MAX takes the higher expected value.`}
      ],
      answer:`Pick $A$, value $5$.` },

    { q:`<p>Chance node: outcome $20$ with probability $0.1$, outcome $0$ with probability $0.9$. Expectimax value?</p>`,
      steps:[
        {do:`$0.1\\times20=2$.`, why:`Weight the rare big payoff.`},
        {do:`$0.9\\times0=0$. Sum $=2$.`, why:`Add the zero-value outcome.`}
      ],
      answer:`$2$.` },

    { q:`<p>A chance node leads to two child MAX nodes, each probability $0.5$. Left MAX $=\\max(1,7)$, right MAX $=\\max(3,5)$. Chance value?</p>`,
      steps:[
        {do:`Left MAX $=\\max(1,7)=7$.`, why:`Evaluate the left MAX child first.`},
        {do:`Right MAX $=\\max(3,5)=5$.`, why:`Evaluate the right MAX child.`},
        {do:`Chance $=0.5\\times7+0.5\\times5=3.5+2.5=6$.`, why:`Average the two MAX values.`}
      ],
      answer:`$6$.` },

    { q:`<p>Outcomes with probabilities $0.2,0.3,0.5$ worth $10,0,4$. Expectimax value?</p>`,
      steps:[
        {do:`$0.2\\times10=2$.`, why:`Weight the first outcome.`},
        {do:`$0.3\\times0=0$, $0.5\\times4=2$.`, why:`Weight the rest.`},
        {do:`Sum $=2+0+2=4$.`, why:`Add the weighted outcomes.`}
      ],
      answer:`$4$.` },

    { q:`<p>MAX node over two moves. Move $L$ goes to a chance node ($0.5$ each over $0$ and $10$). Move $R$ is a sure $4$. Which move, and what value?</p>`,
      steps:[
        {do:`Chance under $L=0.5\\times0+0.5\\times10=5$.`, why:`Average the random outcomes.`},
        {do:`Move $R=4$ for sure.`, why:`No randomness on the right.`},
        {do:`MAX $=\\max(5,4)=5$, pick $L$.`, why:`Take the higher expected value.`}
      ],
      answer:`Pick $L$, value $5$.` }
  ],

  /* ---------------- CSP (factors / weights) ---------------- */
  "ai-csp": [
    { q:`<p>Three factors score $1$, $1$, $0$ for an assignment. Weight, and is it valid?</p>`,
      steps:[
        {do:`Weight $=1\\times1\\times0=0$.`, why:`Weight is the product of all factors.`},
        {do:`A zero means a broken hard constraint.`, why:`Valid solutions need weight $&gt;0$.`}
      ],
      answer:`Weight $0$; invalid.` },

    { q:`<p>Color neighbors R1, R2 with the rule "must differ". Try R1=Red, R2=Red. Weight?</p>`,
      steps:[
        {do:`Same color, so the differ factor $=0$.`, why:`A hard constraint outputs $0$ when broken.`},
        {do:`Weight $=0$.`, why:`Any zero factor kills the product.`}
      ],
      answer:`Weight $0$ (invalid).` },

    { q:`<p>Same R1, R2 with "must differ". Try R1=Red, R2=Blue. Weight?</p>`,
      steps:[
        {do:`Different colors, so the differ factor $=1$.`, why:`The constraint is satisfied.`},
        {do:`Weight $=1$.`, why:`Product of all-ones is $1$.`}
      ],
      answer:`Weight $1$ (valid).` },

    { q:`<p>Two soft factors score $2$ and $3$. What is the assignment weight?</p>`,
      steps:[
        {do:`Weight is the product of all factors.`, why:`$\\text{Weight}(x)=\\prod_j f_j(x)$.`},
        {do:`$2\\times3=6$.`, why:`Multiply the two factor scores.`}
      ],
      answer:`$6$.` },

    { q:`<p>Factors score $1$, $0.5$, $4$. Weight?</p>`,
      steps:[
        {do:`$1\\times0.5=0.5$.`, why:`Multiply the first two.`},
        {do:`$0.5\\times4=2$.`, why:`Multiply in the last factor.`}
      ],
      answer:`$2$.` },

    { q:`<p>Variables $X,Y\\in\\{1,2\\}$. Constraint $X\\neq Y$. How many of the four assignments are valid?</p>`,
      steps:[
        {do:`List pairs: $(1,1),(1,2),(2,1),(2,2)$.`, why:`Enumerate all combinations.`},
        {do:`$X\\neq Y$ holds for $(1,2)$ and $(2,1)$.`, why:`Only unequal pairs satisfy the rule.`}
      ],
      answer:`$2$ valid assignments.` },

    { q:`<p>A chain $A-B-C$ with "neighbors differ", two colors Red/Blue. Is $A=$Red, $B=$Blue, $C=$Red valid?</p>`,
      steps:[
        {do:`$A,B$ differ (Red vs Blue): factor $1$.`, why:`First edge satisfied.`},
        {do:`$B,C$ differ (Blue vs Red): factor $1$.`, why:`Second edge satisfied.`},
        {do:`Weight $=1\\times1=1&gt;0$.`, why:`All edges hold.`}
      ],
      answer:`Valid (weight $1$).` },

    { q:`<p>Same chain $A-B-C$, two colors. Is $A=$Red, $B=$Red, $C=$Blue valid?</p>`,
      steps:[
        {do:`$A,B$ both Red: factor $0$.`, why:`First edge is broken.`},
        {do:`Weight $=0\\times(\\dots)=0$.`, why:`One zero factor makes the whole product zero.`}
      ],
      answer:`Invalid (weight $0$).` },

    { q:`<p>A factor over $X\\in\\{1,2\\}$ gives $f(1)=3$, $f(2)=5$. A second factor over $X$ gives $g(1)=2$, $g(2)=0$. Which value of $X$ has higher weight $f\\cdot g$?</p>`,
      steps:[
        {do:`$X=1$: $3\\times2=6$.`, why:`Product of the two factor values at $X=1$.`},
        {do:`$X=2$: $5\\times0=0$.`, why:`The second factor zeroes it out.`}
      ],
      answer:`$X=1$ (weight $6$).` },

    { q:`<p>Three regions in a triangle, all pairs must differ, only two colors available. Can any assignment have weight $&gt;0$?</p>`,
      steps:[
        {do:`Three mutually adjacent regions need three different colors.`, why:`Every pair must differ.`},
        {do:`With only two colors, two regions must share a color, giving a $0$ factor.`, why:`Pigeonhole: three into two forces a repeat.`}
      ],
      answer:`No; every weight is $0$.` }
  ],

  /* ---------------- CSP search ---------------- */
  "ai-csp-search": [
    { q:`<p>Variable A's domain is $\\{$Red,Blue$\\}$, B's is $\\{$Red$\\}$. Most-constrained-variable: which first?</p>`,
      steps:[
        {do:`Count choices: A has $2$, B has $1$.`, why:`Most-constrained means the smallest domain.`},
        {do:`Assign B first.`, why:`B has the fewest remaining values.`}
      ],
      answer:`Assign B first.` },

    { q:`<p>Map coloring with Red,Green,Blue. A=Red, and B neighbors A. Forward checking: B's new domain?</p>`,
      steps:[
        {do:`Remove Red from B's domain.`, why:`B cannot match its neighbor A.`},
        {do:`B becomes $\\{$Green,Blue$\\}$.`, why:`Only the conflicting value is deleted.`}
      ],
      answer:`$\\{$Green,Blue$\\}$.` },

    { q:`<p>After A=Red, B is reduced to $\\{$Green,Blue$\\}$; another neighbor forces B to drop Green. B's domain now?</p>`,
      steps:[
        {do:`Remove Green too.`, why:`The other neighbor conflicts with Green.`},
        {do:`B becomes $\\{$Blue$\\}$.`, why:`One value remains.`}
      ],
      answer:`$\\{$Blue$\\}$.` },

    { q:`<p>Forward checking leaves a variable's domain empty. What does the search do?</p>`,
      steps:[
        {do:`An empty domain means no value can work.`, why:`The current partial assignment cannot be completed.`},
        {do:`Backtrack: undo the last choice and try another.`, why:`That is how backtracking search recovers.`}
      ],
      answer:`Backtrack.` },

    { q:`<p>Variables and remaining domains: $X=\\{1,2,3\\}$, $Y=\\{2\\}$, $Z=\\{1,3\\}$. Which to assign first by most-constrained?</p>`,
      steps:[
        {do:`Sizes: $X=3$, $Y=1$, $Z=2$.`, why:`Compare domain sizes.`},
        {do:`Pick $Y$ (size $1$).`, why:`Smallest domain is most constrained.`}
      ],
      answer:`Assign $Y$ first.` },

    { q:`<p>A=Red is set. Neighbors B and C both had $\\{$Red,Green,Blue$\\}$. After forward checking from A, how many values remain in B and in C?</p>`,
      steps:[
        {do:`Remove Red from each neighbor.`, why:`Neither may equal A.`},
        {do:`B and C each become $\\{$Green,Blue$\\}$, size $2$.`, why:`One value deleted from each.`}
      ],
      answer:`$2$ each.` },

    { q:`<p>Domains $A=\\{$Red$\\}$, $B=\\{$Red,Blue$\\}$, edge $A\\neq B$. Make $B$ arc consistent with $A$.</p>`,
      steps:[
        {do:`For each B value, need some legal A value.`, why:`Arc consistency checks support.`},
        {do:`B=Red has no support (A only Red, $A\\neq B$ fails). Remove Red from B.`, why:`No allowed A pairs with B=Red.`},
        {do:`B becomes $\\{$Blue$\\}$, now consistent.`, why:`B=Blue is supported by A=Red.`}
      ],
      answer:`Prune to $B=\\{$Blue$\\}$.` },

    { q:`<p>Backtracking tries A=Red, then B, then C; B's domain empties. Which choice is undone first?</p>`,
      steps:[
        {do:`Backtrack to the most recent decision.`, why:`Chronological backtracking undoes the latest choice.`},
        {do:`Re-try B's other value (or, if none, undo A).`, why:`Step back one level and pick again.`}
      ],
      answer:`Undo B's value first.` },

    { q:`<p>Three nodes A-B-C in a line, two colors. A=Red. After forward checking, list B's and C's domains.</p>`,
      steps:[
        {do:`B neighbors A=Red, so B drops Red: $\\{$Blue$\\}$.`, why:`Forward check from the assigned A.`},
        {do:`C only neighbors B (not yet assigned), so C stays $\\{$Red,Blue$\\}$.`, why:`Forward checking only prunes from assigned variables.`}
      ],
      answer:`$B=\\{$Blue$\\}$, $C=\\{$Red,Blue$\\}$.` },

    { q:`<p>Sudoku-style: a cell's row already shows $\\{1,2,3,4,5,6,7,8\\}$. Its domain was $\\{1..9\\}$. After forward checking, what value is forced?</p>`,
      steps:[
        {do:`Remove $1$ through $8$ from the cell's domain.`, why:`Each appears in the row, so cannot repeat.`},
        {do:`Only $9$ remains.`, why:`A single-value domain forces that value.`}
      ],
      answer:`The cell must be $9$.` }
  ],

  /* ---------------- Bayes net (joint via factorization) ---------------- */
  "ai-bayes-net": [
    { q:`<p>Rain $\\rightarrow$ Wet. $P(\\text{Rain})=0.3$, $P(\\text{Wet}\\mid\\text{Rain})=0.9$. Find $P(\\text{Rain},\\text{Wet})$.</p>`,
      steps:[
        {do:`Joint $=P(\\text{Rain})\\times P(\\text{Wet}\\mid\\text{Rain})$.`, why:`The net factors the joint over parents.`},
        {do:`$=0.3\\times0.9=0.27$.`, why:`Multiply the two terms.`}
      ],
      answer:`$0.27$.` },

    { q:`<p>Rain $\\rightarrow$ Wet. $P(\\text{Rain})=0.4$, $P(\\text{Wet}\\mid\\text{Rain})=0.5$. Find $P(\\text{Rain},\\text{Wet})$.</p>`,
      steps:[
        {do:`$P(\\text{Rain})\\times P(\\text{Wet}\\mid\\text{Rain})=0.4\\times0.5$.`, why:`Product of node terms.`},
        {do:`$=0.2$.`, why:`Carry out the multiplication.`}
      ],
      answer:`$0.2$.` },

    { q:`<p>$P(\\text{Rain})=0.3$. Find $P(\\neg\\text{Rain})$.</p>`,
      steps:[
        {do:`$P(\\neg\\text{Rain})=1-P(\\text{Rain})=1-0.3$.`, why:`Probabilities of a variable sum to $1$.`},
        {do:`$=0.7$.`, why:`Subtract.`}
      ],
      answer:`$0.7$.` },

    { q:`<p>Chain $A\\rightarrow B\\rightarrow C$. $P(A)=0.5$, $P(B\\mid A)=0.4$, $P(C\\mid B)=0.6$. Find $P(A,B,C)$.</p>`,
      steps:[
        {do:`Joint $=P(A)P(B\\mid A)P(C\\mid B)$.`, why:`Each node times its parent term.`},
        {do:`$=0.5\\times0.4\\times0.6=0.12$.`, why:`Multiply all three.`}
      ],
      answer:`$0.12$.` },

    { q:`<p>Two roots into one child: $A\\rightarrow C\\leftarrow B$. $P(A)=0.5$, $P(B)=0.2$, $P(C\\mid A,B)=0.9$. Find $P(A,B,C)$.</p>`,
      steps:[
        {do:`Joint $=P(A)P(B)P(C\\mid A,B)$.`, why:`$A$ and $B$ are roots; $C$ has both as parents.`},
        {do:`$=0.5\\times0.2\\times0.9=0.09$.`, why:`Multiply the three terms.`}
      ],
      answer:`$0.09$.` },

    { q:`<p>Rain $\\rightarrow$ Wet. $P(\\text{Rain})=0.3$, $P(\\text{Wet}\\mid\\neg\\text{Rain})=0.1$. Find $P(\\neg\\text{Rain},\\text{Wet})$.</p>`,
      steps:[
        {do:`$P(\\neg\\text{Rain})=1-0.3=0.7$.`, why:`Complement of Rain.`},
        {do:`Joint $=0.7\\times0.1=0.07$.`, why:`Use the correct conditional for $\\neg\\text{Rain}$.`}
      ],
      answer:`$0.07$.` },

    { q:`<p>Rain $\\rightarrow$ Wet. $P(\\text{Rain})=0.3$. $P(\\text{Wet}\\mid\\text{Rain})=0.9$, $P(\\text{Wet}\\mid\\neg\\text{Rain})=0.2$. Find the marginal $P(\\text{Wet})$.</p>`,
      steps:[
        {do:`Sum over Rain: $P(\\text{Wet})=P(R)P(W\\mid R)+P(\\neg R)P(W\\mid\\neg R)$.`, why:`Marginalize out the parent.`},
        {do:`$=0.3\\times0.9+0.7\\times0.2=0.27+0.14=0.41$.`, why:`Add both weighted terms.`}
      ],
      answer:`$P(\\text{Wet})=0.41$.` },

    { q:`<p>$A\\rightarrow B$. $P(A)=0.5$, $P(B\\mid A)=0.8$, $P(B\\mid\\neg A)=0.3$. Find $P(B)$.</p>`,
      steps:[
        {do:`$P(B)=P(A)P(B\\mid A)+P(\\neg A)P(B\\mid\\neg A)$.`, why:`Sum over the parent $A$.`},
        {do:`$=0.5\\times0.8+0.5\\times0.3=0.4+0.15=0.55$.`, why:`Add the two contributions.`}
      ],
      answer:`$P(B)=0.55$.` },

    { q:`<p>Chain $A\\rightarrow B\\rightarrow C$, all binary. How many entries does the full joint table need, versus the net's conditional tables?</p>`,
      steps:[
        {do:`Full joint: $2^3=8$ entries.`, why:`Three binary variables give $8$ combinations.`},
        {do:`Net: $P(A)$ has $1$, $P(B\\mid A)$ has $2$, $P(C\\mid B)$ has $2$ free numbers, total $5$.`, why:`Each node stores only its conditional on parents.`}
      ],
      answer:`$8$ vs about $5$; the net is smaller.` },

    { q:`<p>$A\\rightarrow B$, $A\\rightarrow C$ (B and C share parent A). $P(A)=0.5$, $P(B\\mid A)=0.6$, $P(C\\mid A)=0.4$. Find $P(A,B,C)$.</p>`,
      steps:[
        {do:`Joint $=P(A)P(B\\mid A)P(C\\mid A)$.`, why:`B and C each depend only on A.`},
        {do:`$=0.5\\times0.6\\times0.4=0.12$.`, why:`Multiply the three terms.`}
      ],
      answer:`$0.12$.` }
  ],

  /* ---------------- Bayes inference (posteriors / explaining away) ---------------- */
  "ai-bayes-inference": [
    { q:`<p>Inference computes $P(\\text{query}\\mid\\text{evidence})$. Write it as a ratio of joint to evidence.</p>`,
      steps:[
        {do:`Put the joint on top, the evidence on the bottom.`, why:`Conditional probability divides by the evidence.`},
        {do:`$P(q\\mid e)=\\dfrac{P(q,e)}{P(e)}$.`, why:`This is the definition of conditional probability.`}
      ],
      answer:`$P(q\\mid e)=P(q,e)/P(e)$.` },

    { q:`<p>$P(q,e)=0.2$ and $P(e)=0.5$. Find $P(q\\mid e)$.</p>`,
      steps:[
        {do:`$P(q\\mid e)=0.2/0.5$.`, why:`Divide joint by evidence.`},
        {do:`$=0.4$.`, why:`Compute the quotient.`}
      ],
      answer:`$0.4$.` },

    { q:`<p>Disease test. $P(D)=0.01$, $P(+\\mid D)=0.9$, $P(+\\mid\\neg D)=0.05$. Find $P(D\\mid +)$.</p>`,
      steps:[
        {do:`$P(D,+)=0.01\\times0.9=0.009$.`, why:`Joint of disease and a positive test.`},
        {do:`$P(+)=0.009+0.99\\times0.05=0.009+0.0495=0.0585$.`, why:`Total probability of a positive test.`},
        {do:`$P(D\\mid +)=0.009/0.0585\\approx0.154$.`, why:`Bayes rule: joint over evidence.`}
      ],
      answer:`$\\approx0.15$.` },

    { q:`<p>Coin from a bag: fair ($P(H)=0.5$) or biased ($P(H)=0.9$), each picked with probability $0.5$. You see Heads. Find $P(\\text{biased}\\mid H)$.</p>`,
      steps:[
        {do:`$P(\\text{biased},H)=0.5\\times0.9=0.45$.`, why:`Prior times likelihood for biased.`},
        {do:`$P(\\text{fair},H)=0.5\\times0.5=0.25$. So $P(H)=0.45+0.25=0.70$.`, why:`Sum over both coins.`},
        {do:`$P(\\text{biased}\\mid H)=0.45/0.70\\approx0.643$.`, why:`Posterior is joint over evidence.`}
      ],
      answer:`$\\approx0.64$.` },

    { q:`<p>Alarm has causes Burglary or Earthquake. You hear the alarm. Then the radio confirms an Earthquake. Does $P(\\text{Burglary})$ go up or down?</p>`,
      steps:[
        {do:`The earthquake already explains the alarm.`, why:`A confirmed cause accounts for the effect.`},
        {do:`So burglary is less needed: its probability drops.`, why:`This is explaining away.`}
      ],
      answer:`Down (explaining away).` },

    { q:`<p>$P(q\\mid e)$ where $P(q,e)=0.12$ and the only other case is $P(\\neg q,e)=0.28$. Find $P(q\\mid e)$.</p>`,
      steps:[
        {do:`$P(e)=0.12+0.28=0.40$.`, why:`Evidence sums over the query being true or false.`},
        {do:`$P(q\\mid e)=0.12/0.40=0.3$.`, why:`Normalize the joint by the evidence.`}
      ],
      answer:`$0.3$.` },

    { q:`<p>Two hypotheses give unnormalized scores $P(H_1,e)=6$ and $P(H_2,e)=2$. Find $P(H_1\\mid e)$.</p>`,
      steps:[
        {do:`Normalizer $=6+2=8$.`, why:`Sum the unnormalized joints.`},
        {do:`$P(H_1\\mid e)=6/8=0.75$.`, why:`Divide each score by the total.`}
      ],
      answer:`$0.75$.` },

    { q:`<p>Spam filter. $P(\\text{spam})=0.4$, $P(\\text{word}\\mid\\text{spam})=0.8$, $P(\\text{word}\\mid\\text{ham})=0.1$. Find $P(\\text{spam}\\mid\\text{word})$.</p>`,
      steps:[
        {do:`$P(\\text{spam},\\text{word})=0.4\\times0.8=0.32$.`, why:`Prior times likelihood for spam.`},
        {do:`$P(\\text{ham},\\text{word})=0.6\\times0.1=0.06$. Evidence $=0.32+0.06=0.38$.`, why:`Add the ham case.`},
        {do:`$P(\\text{spam}\\mid\\text{word})=0.32/0.38\\approx0.842$.`, why:`Posterior is joint over evidence.`}
      ],
      answer:`$\\approx0.84$.` },

    { q:`<p>Prior odds of disease are $1:99$. The test's likelihood ratio for a positive is $\\frac{0.9}{0.05}=18$. Find the posterior odds after a positive test.</p>`,
      steps:[
        {do:`Posterior odds $=$ prior odds $\\times$ likelihood ratio.`, why:`Odds form of Bayes rule.`},
        {do:`$=\\frac{1}{99}\\times18=\\frac{18}{99}\\approx0.182$.`, why:`Multiply odds by the ratio.`}
      ],
      answer:`Odds $18:99\\approx0.18$.` },

    { q:`<p>Two independent causes $A,B$ of effect $E$, each $P=0.5$, with $E$ true if either is true (OR). You observe $E$. Now $A$ is confirmed true. Is $B$ still needed to explain $E$?</p>`,
      steps:[
        {do:`$E$ is now fully explained by $A$ alone.`, why:`An OR-effect needs only one active cause.`},
        {do:`So $B$ falls back toward its prior $0.5$ (no longer pushed up).`, why:`Explaining away removes the boost from observing $E$.`}
      ],
      answer:`No; $B$ drops back toward $0.5$.` }
  ],

  /* ---------------- HMM (one forward step) ---------------- */
  "ai-hmm": [
    { q:`<p>In the umbrella HMM, which probability links the clue to the hidden state: emission $P(E_t\\mid H_t)$ or transition $P(H_t\\mid H_{t-1})$?</p>`,
      steps:[
        {do:`The clue depends on the current hidden state.`, why:`Emission connects observation to hidden state.`},
        {do:`So $P(E_t\\mid H_t)$ links them.`, why:`Transition instead links state to state over time.`}
      ],
      answer:`Emission $P(E_t\\mid H_t)$.` },

    { q:`<p>Hidden weather. Prior $P(\\text{Rain})=0.5$, $P(\\text{Sun})=0.5$. Transition $P(\\text{Rain}_t\\mid\\text{Rain}_{t-1})=0.7$, $P(\\text{Rain}_t\\mid\\text{Sun}_{t-1})=0.3$. Predict $P(\\text{Rain}_t)$ before any clue.</p>`,
      steps:[
        {do:`$P(\\text{Rain}_t)=0.5\\times0.7+0.5\\times0.3$.`, why:`Sum over the previous state.`},
        {do:`$=0.35+0.15=0.5$.`, why:`Add the weighted transitions.`}
      ],
      answer:`$P(\\text{Rain}_t)=0.5$.` },

    { q:`<p>After prediction, $P(\\text{Rain})=0.5$, $P(\\text{Sun})=0.5$. You see an umbrella. $P(U\\mid\\text{Rain})=0.9$, $P(U\\mid\\text{Sun})=0.2$. Find the unnormalized weights.</p>`,
      steps:[
        {do:`Rain weight $=0.5\\times0.9=0.45$.`, why:`Predict times emission for Rain.`},
        {do:`Sun weight $=0.5\\times0.2=0.10$.`, why:`Predict times emission for Sun.`}
      ],
      answer:`Rain $0.45$, Sun $0.10$.` },

    { q:`<p>Continue: weights Rain $0.45$, Sun $0.10$. Normalize to get $P(\\text{Rain}\\mid U)$.</p>`,
      steps:[
        {do:`Total $=0.45+0.10=0.55$.`, why:`Sum the weights to normalize.`},
        {do:`$P(\\text{Rain}\\mid U)=0.45/0.55\\approx0.818$.`, why:`Divide Rain's weight by the total.`}
      ],
      answer:`$\\approx0.82$.` },

    { q:`<p>One full forward step. Prior $P(\\text{Rain})=0.5,P(\\text{Sun})=0.5$. Transition keeps the state ($P(\\text{same})=1$). Emission $P(U\\mid\\text{Rain})=0.8$, $P(U\\mid\\text{Sun})=0.1$. After seeing $U$, find $P(\\text{Rain}\\mid U)$.</p>`,
      steps:[
        {do:`Predict (no change): Rain $0.5$, Sun $0.5$.`, why:`Transition keeps the state.`},
        {do:`Weight by emission: Rain $0.5\\times0.8=0.4$, Sun $0.5\\times0.1=0.05$.`, why:`Multiply by the umbrella likelihood.`},
        {do:`Normalize: $0.4/(0.4+0.05)=0.4/0.45\\approx0.889$.`, why:`Divide by the total weight.`}
      ],
      answer:`$\\approx0.89$.` },

    { q:`<p>Transition $P(\\text{Rain}_t\\mid\\text{Rain}_{t-1})=0.8$ and $P(\\text{Rain}_t\\mid\\text{Sun}_{t-1})=0.4$. If yesterday $P(\\text{Rain})=1$ (certain), predict today's $P(\\text{Rain})$.</p>`,
      steps:[
        {do:`Only the Rain row matters since Rain was certain.`, why:`Yesterday's Sun probability is $0$.`},
        {do:`$P(\\text{Rain}_t)=1\\times0.8=0.8$.`, why:`Apply the transition from Rain.`}
      ],
      answer:`$0.8$.` },

    { q:`<p>Predicted $P(\\text{Rain})=0.8$, $P(\\text{Sun})=0.2$. You see No-umbrella. $P(\\text{No}\\mid\\text{Rain})=0.1$, $P(\\text{No}\\mid\\text{Sun})=0.8$. Find $P(\\text{Rain}\\mid\\text{No})$.</p>`,
      steps:[
        {do:`Rain weight $=0.8\\times0.1=0.08$.`, why:`Predict times emission for Rain.`},
        {do:`Sun weight $=0.2\\times0.8=0.16$. Total $=0.24$.`, why:`Add both weights.`},
        {do:`$P(\\text{Rain}\\mid\\text{No})=0.08/0.24\\approx0.333$.`, why:`Normalize Rain's weight.`}
      ],
      answer:`$\\approx0.33$.` },

    { q:`<p>The forward step has two stages. Name them in order.</p>`,
      steps:[
        {do:`First predict using the transition $P(H_t\\mid H_{t-1})$.`, why:`Move the belief forward one time step.`},
        {do:`Then update using the emission $P(E_t\\mid H_t)$ and normalize.`, why:`Fold in the new clue.`}
      ],
      answer:`Predict (transition), then update (emission).` },

    { q:`<p>Yesterday $P(\\text{Rain})=0.6,P(\\text{Sun})=0.4$. Transition $P(\\text{Rain}_t\\mid\\text{Rain}_{t-1})=0.7$, $P(\\text{Rain}_t\\mid\\text{Sun}_{t-1})=0.5$. Predict today's $P(\\text{Rain})$.</p>`,
      steps:[
        {do:`$P(\\text{Rain}_t)=0.6\\times0.7+0.4\\times0.5$.`, why:`Sum over yesterday's two states.`},
        {do:`$=0.42+0.20=0.62$.`, why:`Add the weighted transitions.`}
      ],
      answer:`$P(\\text{Rain}_t)=0.62$.` },

    { q:`<p>Full step from scratch. Yesterday $P(\\text{Rain})=0.5,P(\\text{Sun})=0.5$. Transition $P(\\text{Rain}_t\\mid\\text{Rain}_{t-1})=0.7,P(\\text{Rain}_t\\mid\\text{Sun}_{t-1})=0.3$. See umbrella, $P(U\\mid\\text{Rain})=0.9,P(U\\mid\\text{Sun})=0.2$. Find $P(\\text{Rain}\\mid U)$.</p>`,
      steps:[
        {do:`Predict: $P(\\text{Rain}_t)=0.5\\times0.7+0.5\\times0.3=0.5$, so Sun $=0.5$.`, why:`Transition step over both prior states.`},
        {do:`Weight by emission: Rain $0.5\\times0.9=0.45$, Sun $0.5\\times0.2=0.10$.`, why:`Fold in the umbrella clue.`},
        {do:`Normalize: $0.45/(0.45+0.10)=0.45/0.55\\approx0.818$.`, why:`Divide by the total.`}
      ],
      answer:`$\\approx0.82$.` }
  ],

  /* ---------------- Propositional logic ---------------- */
  "ai-propositional-logic": [
    { q:`<p>$R$ is true. What is $\\neg R$?</p>`,
      steps:[
        {do:`$\\neg$ flips the value.`, why:`NOT turns true into false.`},
        {do:`$\\neg R$ is false.`, why:`$R$ was true.`}
      ],
      answer:`False.` },

    { q:`<p>Evaluate $T\\wedge F$ (true AND false).</p>`,
      steps:[
        {do:`AND is true only if both are true.`, why:`Definition of $\\wedge$.`},
        {do:`One side is false, so $T\\wedge F=F$.`, why:`Both must hold.`}
      ],
      answer:`False.` },

    { q:`<p>Evaluate $F\\vee T$ (false OR true).</p>`,
      steps:[
        {do:`OR is true if at least one side is true.`, why:`Definition of $\\vee$.`},
        {do:`One side is true, so $F\\vee T=T$.`, why:`At least one holds.`}
      ],
      answer:`True.` },

    { q:`<p>The implication $P\\rightarrow Q$ with $P$ true and $Q$ false. Value?</p>`,
      steps:[
        {do:`$P\\rightarrow Q$ is false only when $P$ true and $Q$ false.`, why:`A true premise with a false conclusion breaks the rule.`},
        {do:`Here that is the case, so it is false.`, why:`Matches the one false row.`}
      ],
      answer:`False.` },

    { q:`<p>The implication $P\\rightarrow Q$ with $P$ false. Value?</p>`,
      steps:[
        {do:`$P\\rightarrow Q$ is false only when $P$ is true and $Q$ false.`, why:`That is the single false row.`},
        {do:`Here $P$ is false, so the implication is true.`, why:`A false premise makes it vacuously true.`}
      ],
      answer:`True.` },

    { q:`<p>How many rows does a truth table over symbols $P,Q,R$ have?</p>`,
      steps:[
        {do:`Each symbol is true or false: $2$ choices.`, why:`Every symbol doubles the rows.`},
        {do:`$2^3=8$ rows.`, why:`Three symbols give $2^3$.`}
      ],
      answer:`$8$ rows.` },

    { q:`<p>KB: $R$ is true, and $R\\rightarrow W$. Does KB entail $W$?</p>`,
      steps:[
        {do:`For KB true, $R$ is true and $R\\rightarrow W$ holds.`, why:`Both KB sentences must be satisfied.`},
        {do:`$R$ true plus the rule forces $W$ true.`, why:`Modus ponens at the model level.`}
      ],
      answer:`Yes, KB $\\models W$.` },

    { q:`<p>Evaluate $(P\\vee Q)\\wedge\\neg P$ when $P$ false, $Q$ true.</p>`,
      steps:[
        {do:`$P\\vee Q=F\\vee T=T$.`, why:`OR is true since $Q$ is true.`},
        {do:`$\\neg P=\\neg F=T$.`, why:`NOT of false is true.`},
        {do:`$T\\wedge T=T$.`, why:`Both sides hold.`}
      ],
      answer:`True.` },

    { q:`<p>Is $P\\vee\\neg P$ true in every model (a tautology)?</p>`,
      steps:[
        {do:`If $P$ true: $T\\vee F=T$.`, why:`One disjunct holds.`},
        {do:`If $P$ false: $F\\vee T=T$.`, why:`The other disjunct holds.`}
      ],
      answer:`Yes, always true.` },

    { q:`<p>KB: $A\\vee B$, and $\\neg A$. Does KB entail $B$?</p>`,
      steps:[
        {do:`$\\neg A$ true means $A$ is false.`, why:`The second fact pins $A$.`},
        {do:`$A\\vee B$ true with $A$ false forces $B$ true.`, why:`The OR still needs one true disjunct.`},
        {do:`So $B$ holds in every model of KB.`, why:`That is entailment.`}
      ],
      answer:`Yes, KB $\\models B$.` }
  ],

  /* ---------------- Inference rules / resolution ---------------- */
  "ai-inference-rules": [
    { q:`<p>You know $f$ and $f\\rightarrow g$. What does modus ponens conclude?</p>`,
      steps:[
        {do:`Match the pattern: a fact $f$ plus a rule $f\\rightarrow g$.`, why:`Modus ponens needs both pieces.`},
        {do:`Conclude $g$.`, why:`The rule fires once its premise $f$ is known.`}
      ],
      answer:`$g$.` },

    { q:`<p>KB: Bird(Tweety), and Bird$(x)\\rightarrow$CanFly$(x)$. Apply modus ponens.</p>`,
      steps:[
        {do:`Match $x=$ Tweety in the rule.`, why:`The rule applies to any bird.`},
        {do:`From Bird(Tweety) and the rule, conclude CanFly(Tweety).`, why:`Modus ponens fires.`}
      ],
      answer:`CanFly(Tweety).` },

    { q:`<p>KB: Human(Socrates), and Human$(x)\\rightarrow$Mortal$(x)$. Conclusion?</p>`,
      steps:[
        {do:`Match $x=$ Socrates.`, why:`The rule covers every human.`},
        {do:`Conclude Mortal(Socrates).`, why:`Modus ponens from the fact and rule.`}
      ],
      answer:`Mortal(Socrates).` },

    { q:`<p>Chain: $P$, $P\\rightarrow Q$, $Q\\rightarrow R$. What can you derive?</p>`,
      steps:[
        {do:`From $P$ and $P\\rightarrow Q$, get $Q$.`, why:`First modus ponens step.`},
        {do:`From $Q$ and $Q\\rightarrow R$, get $R$.`, why:`Second modus ponens step.`}
      ],
      answer:`$R$.` },

    { q:`<p>Resolution cancels a symbol that is positive in one clause and negative in another. Resolve $(A\\vee B)$ with $(\\neg B\\vee C)$.</p>`,
      steps:[
        {do:`$B$ is positive in the first, negative in the second.`, why:`That complementary pair gets cancelled.`},
        {do:`Combine the rest: $(A\\vee C)$.`, why:`Drop $B$ and $\\neg B$, keep the others.`}
      ],
      answer:`$A\\vee C$.` },

    { q:`<p>Resolve the clauses $(\\neg P\\vee Q)$ and $(P)$.</p>`,
      steps:[
        {do:`$P$ is negative in the first, positive (alone) in the second.`, why:`Complementary literals.`},
        {do:`Cancel $P$, leaving $(Q)$.`, why:`Resolution keeps the leftover literals.`}
      ],
      answer:`$Q$.` },

    { q:`<p>Note $P\\rightarrow Q$ is the clause $(\\neg P\\vee Q)$. Resolve it with $(P)$ to mimic modus ponens.</p>`,
      steps:[
        {do:`Rewrite $P\\rightarrow Q$ as $\\neg P\\vee Q$.`, why:`Implication equals this disjunction.`},
        {do:`Resolve $(\\neg P\\vee Q)$ with $(P)$: cancel $P$, get $Q$.`, why:`Same result as modus ponens.`}
      ],
      answer:`$Q$.` },

    { q:`<p>Resolving $(P)$ with $(\\neg P)$ gives what special clause?</p>`,
      steps:[
        {do:`$P$ and $\\neg P$ cancel, leaving nothing.`, why:`No other literals remain.`},
        {do:`The empty clause means a contradiction (false).`, why:`Deriving it proves the set is unsatisfiable.`}
      ],
      answer:`The empty clause (contradiction).` },

    { q:`<p>An inference system is "sound". In one line, what does that mean?</p>`,
      steps:[
        {do:`Sound means every derived fact is actually true.`, why:`Soundness is about correctness of conclusions.`},
        {do:`So it never produces a falsehood.`, why:`Contrast with completeness, which is about missing no truth.`}
      ],
      answer:`It never derives a false statement.` },

    { q:`<p>To prove KB $\\models Q$ by resolution refutation, what do you add to the KB and aim to derive?</p>`,
      steps:[
        {do:`Add the negation $\\neg Q$ to the KB.`, why:`Refutation assumes the query is false.`},
        {do:`Resolve until you reach the empty clause.`, why:`A contradiction shows $\\neg Q$ is impossible, so $Q$ follows.`}
      ],
      answer:`Add $\\neg Q$; derive the empty clause.` }
  ]

}); })();
