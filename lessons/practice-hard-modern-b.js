/* =====================================================================
   PRACTICE — MODULE 10 (part B): MODERN DEEP LEARNING & AI
   Seven lessons: GNN, DQN, policy gradients, actor-critic, contrastive,
   vision transformers, time-series forecasting.
   ~16-20 problems per id, easy -> hard. Each problem:
     { q, steps:[{do,why},...], answer }
   ===================================================================== */
(function () {
  var P = window.PRACTICE;
  function add(id, probs) { P[id] = (P[id] || []).concat(probs); }

  /* ================================================================ */
  /* 1. GRAPH NEURAL NETWORKS                                         */
  /* ================================================================ */
  add("mod-gnn", [
    {
      q: `<p>A node has two neighbours with features $h_{u_1}=8$ and $h_{u_2}=4$. What is the mean aggregate $\\text{agg}=\\text{mean}(h_u)$?</p>`,
      steps: [
        { do: `Add the neighbour features: $8+4=12$.`, why: `Mean aggregation first sums all neighbour features.` },
        { do: `Divide by the count of neighbours: $12/2=6$.`, why: `The mean divides the sum by how many neighbours there are.` }
      ],
      answer: `$\\text{agg}=6$`
    },
    {
      q: `<p>A node has neighbours with features $3$, $6$, and $9$. Compute the mean aggregate.</p>`,
      steps: [
        { do: `Sum: $3+6+9=18$.`, why: `Mean aggregation sums the neighbour features.` },
        { do: `Divide by $3$: $18/3=6$.`, why: `Three neighbours, so divide by three.` }
      ],
      answer: `$\\text{agg}=6$`
    },
    {
      q: `<p>The aggregate is $\\text{agg}=4$ and the shared weight is $W=0.5$. What is $W\\cdot\\text{agg}$ (before activation)?</p>`,
      steps: [
        { do: `Identify the operation: multiply the aggregate by the weight.`, why: `Before the activation, a GNN layer applies the shared linear map $W$.` },
        { do: `Multiply: $0.5\\times 4=2$.`, why: `The weight $W$ rescales the aggregated features.` }
      ],
      answer: `$W\\cdot\\text{agg}=2$`
    },
    {
      q: `<p>A pre-activation value is $z=-1.5$. Apply the ReLU activation $\\sigma(z)=\\max(0,z)$.</p>`,
      steps: [
        { do: `Compare $z$ to $0$: $-1.5&lt;0$.`, why: `ReLU keeps positive values and zeroes out negatives.` },
        { do: `Output $\\max(0,-1.5)=0$.`, why: `Negative inputs become zero under ReLU.` }
      ],
      answer: `$\\sigma(z)=0$`
    },
    {
      q: `<p>Full step: a node has neighbours $6$ and $2$, with $W=1$ and ReLU. Compute $h_v'=\\sigma(W\\cdot\\text{mean}(h_u))$.</p>`,
      steps: [
        { do: `Mean: $(6+2)/2=4$.`, why: `Aggregate the neighbours by averaging.` },
        { do: `Weight: $1\\times 4=4$.`, why: `Multiply the aggregate by the shared weight $W$.` },
        { do: `ReLU: $\\max(0,4)=4$.`, why: `ReLU keeps the positive value unchanged.` }
      ],
      answer: `$h_v'=4$`
    },
    {
      q: `<p>A node has neighbours $10$ and $-4$, with $W=0.5$ and ReLU. Compute $h_v'$.</p>`,
      steps: [
        { do: `Mean: $(10+(-4))/2=6/2=3$.`, why: `Average the neighbour features, keeping the signs.` },
        { do: `Weight: $0.5\\times 3=1.5$.`, why: `Apply the shared weight matrix.` },
        { do: `ReLU: $\\max(0,1.5)=1.5$.`, why: `The value is positive, so ReLU leaves it.` }
      ],
      answer: `$h_v'=1.5$`
    },
    {
      q: `<p>A node has neighbours $1$ and $3$, with $W=-2$ and ReLU. Compute $h_v'$.</p>`,
      steps: [
        { do: `Mean: $(1+3)/2=2$.`, why: `Aggregate by averaging the neighbours.` },
        { do: `Weight: $-2\\times 2=-4$.`, why: `A negative weight flips the sign of the aggregate.` },
        { do: `ReLU: $\\max(0,-4)=0$.`, why: `ReLU zeroes negative pre-activations.` }
      ],
      answer: `$h_v'=0$`
    },
    {
      q: `<p>Why is the mean a valid aggregate but "the first neighbour's feature" is not? Answer in terms of permutation invariance.</p>`,
      steps: [
        { do: `Note a graph lists neighbours in no fixed order.`, why: `Edges have no first or last; any ordering is arbitrary.` },
        { do: `The mean gives the same result for any ordering, e.g. $\\text{mean}(\\{a,b\\})=\\text{mean}(\\{b,a\\})$.`, why: `Mean is permutation invariant, the property we require.` },
        { do: `"First neighbour" depends on ordering, so it changes if we shuffle.`, why: `It is not permutation invariant, so it is invalid.` }
      ],
      answer: `The mean is permutation invariant; "first neighbour" depends on arbitrary ordering, so only the mean is valid.`
    },
    {
      q: `<p>Two-dimensional features. A node's neighbours are $h_{u_1}=(2,4)$ and $h_{u_2}=(6,0)$. Compute the mean aggregate vector.</p>`,
      steps: [
        { do: `Average each coordinate separately: first $=(2+6)/2=4$.`, why: `Mean aggregation acts component-wise on the vectors.` },
        { do: `Second coordinate $=(4+0)/2=2$.`, why: `Each dimension is averaged independently.` }
      ],
      answer: `$\\text{agg}=(4,2)$`
    },
    {
      q: `<p>A self-loop is added so a node aggregates over itself plus its neighbours. The node is $h_v=9$ and its one neighbour is $h_u=3$. Compute the mean aggregate including the self-loop.</p>`,
      steps: [
        { do: `Include the node itself in the set: $\\{9,3\\}$.`, why: `A self-loop adds the node's own feature to the aggregate.` },
        { do: `Mean: $(9+3)/2=6$.`, why: `Average over the two members of the augmented neighbour set.` }
      ],
      answer: `$\\text{agg}=6$`
    },
    {
      q: `<p>Sum aggregation instead of mean. A node has neighbours $2$, $2$, and $2$. Compare the sum aggregate against the mean aggregate.</p>`,
      steps: [
        { do: `Sum aggregate: $2+2+2=6$.`, why: `Sum aggregation adds without dividing.` },
        { do: `Mean aggregate: $6/3=2$.`, why: `Mean divides the sum by the count.` },
        { do: `Note sum grows with degree; mean does not.`, why: `Sum encodes how many neighbours; mean normalizes that away.` }
      ],
      answer: `Sum $=6$, mean $=2$; sum is degree-sensitive, mean is not.`
    },
    {
      q: `<p>Layer 1 of message passing reaches direct neighbours. After how many layers does a node's features include information from nodes exactly 3 hops away?</p>`,
      steps: [
        { do: `Each layer extends reach by one hop.`, why: `One round of message passing pulls in immediate neighbours only.` },
        { do: `So 3 hops needs 3 layers.`, why: `Reach equals the number of stacked message-passing layers.` }
      ],
      answer: `$3$ layers`
    },
    {
      q: `<p>One round of message passing. Graph: A–B and B–C (a path). Initial features $h_A=4$, $h_B=2$, $h_C=8$. Use $W=1$, ReLU, mean aggregation. Compute the new value $h_B'$.</p>`,
      steps: [
        { do: `B's neighbours are A and C: features $4$ and $8$.`, why: `B is joined to both A and C by edges.` },
        { do: `Mean: $(4+8)/2=6$.`, why: `Average B's neighbour features.` },
        { do: `Weight and ReLU: $\\max(0,1\\times 6)=6$.`, why: `Apply the shared weight then the activation.` }
      ],
      answer: `$h_B'=6$`
    },
    {
      q: `<p>Same path A–B–C with $h_A=4$, $h_B=2$, $h_C=8$, $W=1$, ReLU, mean aggregation. Compute the new value $h_A'$ (A has only B as a neighbour).</p>`,
      steps: [
        { do: `A's only neighbour is B: feature $2$.`, why: `A is joined only to B in a path graph.` },
        { do: `Mean of one neighbour: $2/1=2$.`, why: `With a single neighbour the mean is that feature.` },
        { do: `Weight and ReLU: $\\max(0,1\\times 2)=2$.`, why: `Apply weight then activation.` }
      ],
      answer: `$h_A'=2$`
    },
    {
      q: `<p>A weighted aggregation gives neighbour $u_1$ weight $0.75$ and $u_2$ weight $0.25$ (an attention-style GNN). With $h_{u_1}=8$ and $h_{u_2}=0$, compute the weighted aggregate $\\sum_u \\alpha_u h_u$.</p>`,
      steps: [
        { do: `Weight each neighbour: $0.75\\times 8=6$ and $0.25\\times 0=0$.`, why: `Attention scales each neighbour by its own coefficient $\\alpha_u$.` },
        { do: `Sum: $6+0=6$.`, why: `The aggregate is the weighted sum of neighbour features.` }
      ],
      answer: `$\\text{agg}=6$`
    },
    {
      q: `<p>Two-layer GNN on the path A–B–C. Layer 1 uses mean, $W=1$, ReLU. After layer 1 (computed simultaneously from the originals $h_A=4,h_B=2,h_C=8$), the values are $h_A'=2$, $h_B'=6$, $h_C'=2$. Now compute layer-2 value $h_A''$.</p>`,
      steps: [
        { do: `A's only neighbour is B, whose layer-1 value is $6$.`, why: `Layer 2 aggregates the layer-1 features of neighbours.` },
        { do: `Mean: $6/1=6$; weight and ReLU: $\\max(0,1\\times 6)=6$.`, why: `Single neighbour, so the mean is its value, then activate.` },
        { do: `Note A's value now reflects C (2 hops away).`, why: `Two layers let information travel two hops.` }
      ],
      answer: `$h_A''=6$`
    },
    {
      q: `<p>Mean aggregation with a self-loop, two coordinates. Node $h_v=(4,8)$, one neighbour $h_u=(0,4)$. With $W$ acting as multiply-by-$0.5$ on each coordinate and ReLU, compute $h_v'$.</p>`,
      steps: [
        { do: `Aggregate (self + neighbour) per coordinate: $((4+0)/2,(8+4)/2)=(2,6)$.`, why: `Self-loop includes the node; mean is component-wise.` },
        { do: `Apply $W=0.5$: $(0.5\\times 2,0.5\\times 6)=(1,3)$.`, why: `The weight scales each component.` },
        { do: `ReLU: both positive, so $(1,3)$.`, why: `ReLU leaves positive components unchanged.` }
      ],
      answer: `$h_v'=(1,3)$`
    },
    {
      q: `<p>Over-smoothing: after many GNN layers, all node features converge to the same value. On a connected graph with mean aggregation and $W=1$, no activation, what single value do all nodes approach if the initial features average to $5$?</p>`,
      steps: [
        { do: `Repeated mean aggregation averages neighbourhoods over and over.`, why: `Each layer pulls every node toward its neighbours' average.` },
        { do: `The fixed point is the global average of features.`, why: `On a connected graph this averaging converges to one common value, the overall mean.` },
        { do: `That global average is $5$.`, why: `The mean is preserved, so all nodes approach $5$.` }
      ],
      answer: `All nodes approach $5$ (over-smoothing to the global mean).`
    }
  ]);

  /* ================================================================ */
  /* 2. DEEP Q-NETWORKS                                               */
  /* ================================================================ */
  add("mod-dqn", [
    {
      q: `<p>The discounted future term is $\\gamma\\max_{a'}Q(s',a')$ with $\\gamma=0.9$ and best next value $\\max_{a'}Q(s',a')=10$. Compute it.</p>`,
      steps: [
        { do: `Take the best next value $10$ to be discounted.`, why: `The TD target discounts the value of the next state.` },
        { do: `Multiply by $\\gamma$: $0.9\\times 10=9$.`, why: `The discount $\\gamma$ shrinks the best next value.` }
      ],
      answer: `$9$`
    },
    {
      q: `<p>Compute the TD target $y=r+\\gamma\\max_{a'}Q(s',a')$ with $r=2$, $\\gamma=0.9$, and $\\max_{a'}Q(s',a')=10$.</p>`,
      steps: [
        { do: `Discounted next value: $0.9\\times 10=9$.`, why: `Discount the best achievable next value.` },
        { do: `Add the immediate reward: $2+9=11$.`, why: `The TD target is reward now plus discounted best future.` }
      ],
      answer: `$y=11$`
    },
    {
      q: `<p>From a set of next-state values $Q(s',a')\\in\\{3,7,5\\}$, find $\\max_{a'}Q(s',a')$.</p>`,
      steps: [
        { do: `Compare the three values: $3$, $7$, $5$.`, why: `The max takes the largest over all next actions.` },
        { do: `The largest is $7$.`, why: `DQN assumes the agent acts greedily next, taking the best.` }
      ],
      answer: `$\\max_{a'}Q(s',a')=7$`
    },
    {
      q: `<p>The TD target is $y=8$ and the current estimate is $Q(s,a)=5$. Compute the TD error $\\delta=y-Q(s,a)$.</p>`,
      steps: [
        { do: `Set up the subtraction $y-Q(s,a)=8-5$.`, why: `The TD error is target minus current estimate.` },
        { do: `Compute: $8-5=3$.`, why: `The positive gap means the estimate is too low.` }
      ],
      answer: `$\\delta=3$`
    },
    {
      q: `<p>The TD error is $\\delta=3$. Compute the squared loss $\\text{loss}=\\delta^2$.</p>`,
      steps: [
        { do: `Square the error: $3^2$.`, why: `Squaring makes both signs of error hurt and is smooth to differentiate.` },
        { do: `Compute: $3^2=9$.`, why: `DQN minimizes this squared TD error.` }
      ],
      answer: `$\\text{loss}=9$`
    },
    {
      q: `<p>Full example: $Q(s,a)=4$, reward $r=1$, best next value $6$, $\\gamma=0.9$. Compute the loss $\\big(y-Q(s,a)\\big)^2$.</p>`,
      steps: [
        { do: `Target: $y=1+0.9\\times 6=1+5.4=6.4$.`, why: `Reward plus discounted best next value.` },
        { do: `Error: $\\delta=6.4-4=2.4$.`, why: `Target minus current estimate.` },
        { do: `Loss: $2.4^2=5.76$.`, why: `Squared TD error is the training loss.` }
      ],
      answer: `$\\text{loss}=5.76$`
    },
    {
      q: `<p>Terminal state. After acting the episode ends, so there is no next state. With $r=5$, what is the TD target $y$?</p>`,
      steps: [
        { do: `At a terminal state the future value is $0$.`, why: `There is no $s'$, so $\\max_{a'}Q(s',a')$ is treated as $0$.` },
        { do: `Target: $y=5+\\gamma\\times 0=5$.`, why: `Only the immediate reward remains.` }
      ],
      answer: `$y=5$`
    },
    {
      q: `<p>The target network output is held fixed at $\\max_{a'}Q(s',a')=10$. The online net guesses $Q(s,a)=6$. With $r=0$ and $\\gamma=0.5$, compute the TD error.</p>`,
      steps: [
        { do: `Target: $y=0+0.5\\times 10=5$.`, why: `Use the frozen target-network value to form $y$.` },
        { do: `Error: $\\delta=5-6=-1$.`, why: `The estimate exceeds the target, so the error is negative.` }
      ],
      answer: `$\\delta=-1$`
    },
    {
      q: `<p>Why does DQN use a separate, slowly-updated target network instead of the online net to compute $y$? Answer in one idea.</p>`,
      steps: [
        { do: `If $y$ used the same net being trained, $y$ would shift every update.`, why: `The target would chase a moving goal, causing instability.` },
        { do: `A frozen target net holds $\\max_{a'}Q(s',a')$ steady for many steps.`, why: `A stable target lets the loss converge instead of oscillating.` }
      ],
      answer: `A frozen target network keeps the goal $y$ stable, preventing the chase-a-moving-target instability.`
    },
    {
      q: `<p>The loss gradient with respect to $Q$ is $\\frac{\\partial\\,\\text{loss}}{\\partial Q}=-2(y-Q(s,a))$. With $y=6.4$ and $Q(s,a)=4$, compute this gradient.</p>`,
      steps: [
        { do: `Inner gap: $y-Q=6.4-4=2.4$.`, why: `This is the TD error inside the gradient.` },
        { do: `Multiply by $-2$: $-2\\times 2.4=-4.8$.`, why: `The squared loss has slope $-2$ times the error.` },
        { do: `Negative gradient means gradient descent raises $Q$.`, why: `Stepping opposite the gradient pushes $Q$ toward the larger $y$.` }
      ],
      answer: `$\\frac{\\partial\\,\\text{loss}}{\\partial Q}=-4.8$`
    },
    {
      q: `<p>Two transitions in a replay batch. Transition 1: $\\delta_1=2$. Transition 2: $\\delta_2=-4$. Compute the mean squared TD loss over the batch.</p>`,
      steps: [
        { do: `Square each: $2^2=4$ and $(-4)^2=16$.`, why: `Loss per transition is the squared TD error.` },
        { do: `Average: $(4+16)/2=10$.`, why: `Batch loss averages the per-sample squared errors.` }
      ],
      answer: `$\\text{loss}=10$`
    },
    {
      q: `<p>A reward of $r=1$ is earned every step forever, with $\\gamma=0.9$. What is the value of a state at the start of this infinite stream, $\\sum_{t=0}^{\\infty}\\gamma^t r$?</p>`,
      steps: [
        { do: `Recognize a geometric series: $r(1+\\gamma+\\gamma^2+\\dots)$.`, why: `Discounted rewards form a geometric sum.` },
        { do: `Sum: $\\frac{r}{1-\\gamma}=\\frac{1}{1-0.9}=\\frac{1}{0.1}=10$.`, why: `The geometric series sums to $\\frac{1}{1-\\gamma}$ for $|\\gamma|&lt;1$.` }
      ],
      answer: `Value $=10$`
    },
    {
      q: `<p>Effect of $\\gamma$. Same setup as the worked example ($r=1$, best next $=6$, $Q(s,a)=4$) but now $\\gamma=0.5$. Compute the new loss.</p>`,
      steps: [
        { do: `Target: $y=1+0.5\\times 6=1+3=4$.`, why: `A smaller discount shrinks the future contribution.` },
        { do: `Error: $\\delta=4-4=0$.`, why: `Target now equals the current estimate.` },
        { do: `Loss: $0^2=0$.`, why: `No error means no loss; the net already matches.` }
      ],
      answer: `$\\text{loss}=0$`
    },
    {
      q: `<p>Double DQN selects the next action with the online net but evaluates it with the target net. The online net picks action $a^*$ as the argmax; the target net gives $Q_{\\text{target}}(s',a^*)=8$. With $r=2$, $\\gamma=1$, compute $y$.</p>`,
      steps: [
        { do: `Use the target net's value at the online-selected action: $8$.`, why: `Double DQN decouples selection (online) from evaluation (target) to cut overestimation.` },
        { do: `Target: $y=2+1\\times 8=10$.`, why: `Reward plus the evaluated next value.` }
      ],
      answer: `$y=10$`
    },
    {
      q: `<p>Overestimation bias. Suppose all true next-action values are $0$ but noisy estimates are $\\{+1,-1,+2,-2\\}$. What value does $\\max_{a'}Q(s',a')$ report, and is it biased?</p>`,
      steps: [
        { do: `The max of the noisy estimates is $+2$.`, why: `The max over actions always picks the largest noisy value.` },
        { do: `True max value is $0$, but the estimate is $+2&gt;0$.`, why: `Taking a max over noise systematically picks lucky positive errors.` }
      ],
      answer: `It reports $+2$; this is upward (overestimation) bias because the max favours positive noise.`
    },
    {
      q: `<p>One gradient step. $Q(s,a)=4$, target $y=6.4$, learning rate $\\alpha=0.5$. Using the update $Q\\leftarrow Q+\\alpha(y-Q)$, compute the new $Q$.</p>`,
      steps: [
        { do: `Error: $y-Q=6.4-4=2.4$.`, why: `The TD error drives the update.` },
        { do: `Scaled step: $0.5\\times 2.4=1.2$.`, why: `The learning rate controls how far $Q$ moves toward $y$.` },
        { do: `New value: $4+1.2=5.2$.`, why: `$Q$ moves partway from $4$ toward the target $6.4$.` }
      ],
      answer: `$Q\\leftarrow 5.2$`
    },
    {
      q: `<p>A 3-cell corridor with goal value $+1$ at the rightmost cell and $\\gamma=0.9$. The best the agent can do from cell 0 is reach the goal in $2$ steps. What is the converged value $Q(s_0)$, computed as $\\gamma^{2}\\times 1$?</p>`,
      steps: [
        { do: `Two steps from goal means two discounts: $\\gamma^2$.`, why: `Each step away discounts the reward by another factor of $\\gamma$.` },
        { do: `Compute: $0.9^2\\times 1=0.81$.`, why: `The discounted value of reaching the $+1$ goal in two steps.` }
      ],
      answer: `$Q(s_0)=0.81$`
    },
    {
      q: `<p>Bellman consistency check. We want $Q(s,a)=r+\\gamma\\max_{a'}Q(s',a')$. With $Q(s,a)=10$, $r=1$, $\\gamma=0.9$, what must $\\max_{a'}Q(s',a')$ equal for zero TD error?</p>`,
      steps: [
        { do: `Set $10=1+0.9\\,m$ where $m=\\max_{a'}Q(s',a')$.`, why: `Zero TD error means both sides of Bellman match.` },
        { do: `Solve: $0.9m=9$, so $m=10$.`, why: `Rearrange to isolate the unknown next-state value.` }
      ],
      answer: `$\\max_{a'}Q(s',a')=10$`
    }
  ]);

  /* ================================================================ */
  /* 3. POLICY GRADIENTS (REINFORCE)                                  */
  /* ================================================================ */
  add("mod-policy-gradient", [
    {
      q: `<p>A policy gives Left probability $0.3$ and Right probability $0.7$. The agent samples Right; the episode return is $G=+5$. Will Right's probability go up or down?</p>`,
      steps: [
        { do: `Look at the sign of $G$: it is positive.`, why: `The update scales $\\nabla\\log\\pi$ by the return $G$.` },
        { do: `Positive $G$ raises the sampled action's probability.`, why: `Good outcomes make the taken action more likely.` }
      ],
      answer: `Up`
    },
    {
      q: `<p>An action was sampled with return $G=-3$. Which way does $\\nabla\\log\\pi(a\\mid s)\\,G$ move that action's probability?</p>`,
      steps: [
        { do: `The $\\nabla\\log\\pi$ term alone raises the action's probability.`, why: `Increasing $\\log\\pi$ increases the action's probability.` },
        { do: `Multiplying by $G=-3&lt;0$ flips the direction.`, why: `A negative return reverses the push.` }
      ],
      answer: `Down (the action becomes less likely).`
    },
    {
      q: `<p>An episode collects rewards $1$, $0$, and $2$ (undiscounted). Compute the return $G$.</p>`,
      steps: [
        { do: `List the rewards to add: $1$, $0$, $2$.`, why: `The return collects every reward earned in the episode.` },
        { do: `Sum them: $1+0+2=3$.`, why: `The undiscounted return is the total reward of the episode.` }
      ],
      answer: `$G=3$`
    },
    {
      q: `<p>An episode collects rewards $r_0=2$, $r_1=4$ with discount $\\gamma=0.5$. Compute the discounted return $G=\\sum_t \\gamma^t r_t$ from the start.</p>`,
      steps: [
        { do: `First term: $\\gamma^0 r_0=1\\times 2=2$.`, why: `The immediate reward is undiscounted.` },
        { do: `Second term: $\\gamma^1 r_1=0.5\\times 4=2$.`, why: `Later rewards are discounted by $\\gamma$ per step.` },
        { do: `Sum: $2+2=4$.`, why: `The return adds the discounted rewards.` }
      ],
      answer: `$G=4$`
    },
    {
      q: `<p>A softmax policy over two actions has preferences (logits) $z_{\\text{Left}}=0$ and $z_{\\text{Right}}=\\ln 3$. Compute $\\pi(\\text{Right})=\\frac{e^{z_R}}{e^{z_L}+e^{z_R}}$.</p>`,
      steps: [
        { do: `Exponentiate: $e^{0}=1$ and $e^{\\ln 3}=3$.`, why: `Softmax exponentiates the logits.` },
        { do: `Normalize: $\\frac{3}{1+3}=\\frac{3}{4}=0.75$.`, why: `Each probability is its exponential over the total.` }
      ],
      answer: `$\\pi(\\text{Right})=0.75$`
    },
    {
      q: `<p>A softmax policy has three equal logits $z=(0,0,0)$. What probability does each action get?</p>`,
      steps: [
        { do: `Exponentiate: $e^0=1$ for each.`, why: `Equal logits give equal exponentials.` },
        { do: `Normalize: $\\frac{1}{1+1+1}=\\frac{1}{3}$.`, why: `Three equal weights split the probability evenly.` }
      ],
      answer: `Each action gets $\\tfrac{1}{3}\\approx 0.33$.`
    },
    {
      q: `<p>The chosen action has probability $\\pi=0.5$. Compute $\\log\\pi$ (natural log). Use $\\ln 0.5\\approx -0.693$.</p>`,
      steps: [
        { do: `Take the natural log of $0.5$: $\\ln 0.5\\approx -0.693$.`, why: `The objective uses $\\log\\pi$ of the taken action.` },
        { do: `It is negative because probabilities are below $1$.`, why: `$\\log$ of a number under $1$ is negative.` }
      ],
      answer: `$\\log\\pi\\approx -0.693$`
    },
    {
      q: `<p>The log trick rewrites $\\nabla\\pi$ as $\\pi\\,\\nabla\\log\\pi$. If $\\pi=0.4$ and $\\nabla\\log\\pi=2$, compute $\\nabla\\pi$.</p>`,
      steps: [
        { do: `Apply the identity: $\\nabla\\pi=\\pi\\,\\nabla\\log\\pi$.`, why: `Because $\\nabla\\log\\pi=\\frac{\\nabla\\pi}{\\pi}$, multiplying back recovers $\\nabla\\pi$.` },
        { do: `Compute: $0.4\\times 2=0.8$.`, why: `Substitute the given values.` }
      ],
      answer: `$\\nabla\\pi=0.8$`
    },
    {
      q: `<p>The REINFORCE update term is $\\nabla\\log\\pi(a\\mid s)\\,G$. With $\\nabla\\log\\pi=0.5$ (a scalar) and $G=4$, compute the update term magnitude.</p>`,
      steps: [
        { do: `Identify the product: score $0.5$ times return $4$.`, why: `REINFORCE scales the score $\\nabla\\log\\pi$ by the return $G$.` },
        { do: `Multiply: $0.5\\times 4=2$.`, why: `A larger return pushes the action's probability harder.` }
      ],
      answer: `$2$`
    },
    {
      q: `<p>Why can the policy gradient be estimated by simply running episodes and averaging? Answer in terms of the expectation $E[\\cdot]$.</p>`,
      steps: [
        { do: `The gradient is written as an expectation $\\nabla J=E[\\nabla\\log\\pi\\,G]$.`, why: `The log trick turns the sum into a probability-weighted average.` },
        { do: `An expectation is estimated by sampling and averaging.`, why: `Running episodes draws samples; their mean approximates $E[\\cdot]$.` }
      ],
      answer: `Because $\\nabla J$ is an expectation, sampling episodes and averaging $\\nabla\\log\\pi\\,G$ is an unbiased estimate.`
    },
    {
      q: `<p>For a softmax policy, $\\frac{\\partial\\log\\pi(a)}{\\partial z_a}=1-\\pi(a)$ for the taken action. If $\\pi(a)=0.7$, compute this derivative.</p>`,
      steps: [
        { do: `Substitute: $1-0.7=0.3$.`, why: `The softmax score for the taken action is $1-\\pi(a)$.` },
        { do: `It is positive, so raising $z_a$ raises $\\log\\pi(a)$.`, why: `Increasing the taken action's logit makes it more probable.` }
      ],
      answer: `$0.3$`
    },
    {
      q: `<p>For a softmax policy, $\\frac{\\partial\\log\\pi(a)}{\\partial z_b}=-\\pi(b)$ for a non-taken action $b$. If $\\pi(b)=0.2$, compute this derivative.</p>`,
      steps: [
        { do: `Substitute: $-\\pi(b)=-0.2$.`, why: `Other actions' logits get a negative score component.` },
        { do: `Negative, so raising $z_b$ lowers $\\log\\pi(a)$.`, why: `Boosting a competitor pulls probability away from the taken action.` }
      ],
      answer: `$-0.2$`
    },
    {
      q: `<p>REINFORCE preference update: $z_a\\leftarrow z_a+\\alpha\\,G\\,(1-\\pi(a))$ for the taken action. With $\\alpha=0.6$, $G=1$, $\\pi(a)=0.5$, compute the change in $z_a$.</p>`,
      steps: [
        { do: `Score: $1-\\pi(a)=1-0.5=0.5$.`, why: `Gradient of $\\log\\pi$ for the taken action.` },
        { do: `Scale by $\\alpha G$: $0.6\\times 1\\times 0.5=0.3$.`, why: `Multiply by the learning rate and the return.` }
      ],
      answer: `$\\Delta z_a=+0.3$`
    },
    {
      q: `<p>High variance. Two episodes take the same action with returns $G_1=10$ and $G_2=-10$. What is the average update direction, and what does this illustrate?</p>`,
      steps: [
        { do: `Average return: $(10+(-10))/2=0$.`, why: `The update scales with the mean return.` },
        { do: `Zero average means almost no net learning signal despite large individual updates.`, why: `Large, opposite-sign returns cancel, illustrating REINFORCE's high variance.` }
      ],
      answer: `Average $0$; large opposing returns cancel — REINFORCE is high-variance.`
    },
    {
      q: `<p>Baseline subtraction. The raw return is $G=5$ and a baseline $b=4$ is subtracted. What scalar now multiplies $\\nabla\\log\\pi$, and why does this not bias the gradient?</p>`,
      steps: [
        { do: `New scalar: $G-b=5-4=1$.`, why: `Subtracting a state-only baseline reduces variance.` },
        { do: `The bias term $E[\\nabla\\log\\pi\\,b]=0$.`, why: `Since $b$ is constant over actions and $\\sum_a\\nabla\\pi=\\nabla 1=0$, the baseline averages out.` }
      ],
      answer: `Scalar $=1$; unbiased because $E[\\nabla\\log\\pi]\\,b=0$.`
    },
    {
      q: `<p>Two-step credit assignment. An episode visits state $s_0$ (action A, reward $0$) then $s_1$ (action B, reward $4$), undiscounted. The return-to-go for the action at $s_0$ is the sum of rewards from $s_0$ onward. Compute it.</p>`,
      steps: [
        { do: `Sum rewards from $s_0$ onward: $0+4=4$.`, why: `Return-to-go credits an action with all reward that follows it.` },
        { do: `So action A is scaled by $G_{s_0}=4$.`, why: `Each action's update uses the reward earned after it.` }
      ],
      answer: `$G_{s_0}=4$`
    },
    {
      q: `<p>Discounted return-to-go. Same episode, rewards $r_0=0$ at $s_0$ then $r_1=4$ at $s_1$, with $\\gamma=0.9$. Compute the discounted return-to-go for the action at $s_0$.</p>`,
      steps: [
        { do: `From $s_0$: $r_0+\\gamma r_1=0+0.9\\times 4$.`, why: `Future rewards are discounted relative to $s_0$.` },
        { do: `Compute: $0+3.6=3.6$.`, why: `Add the discounted future reward.` }
      ],
      answer: `$G_{s_0}=3.6$`
    },
    {
      q: `<p>A two-action softmax starts at $50\\%/50\\%$. After one REINFORCE step the Right logit rose so that $\\pi(\\text{Right})=0.62$. By how much did $\\pi(\\text{Left})$ change, and why?</p>`,
      steps: [
        { do: `Probabilities sum to $1$: $\\pi(\\text{Left})=1-0.62=0.38$.`, why: `A softmax always normalizes to total probability $1$.` },
        { do: `Change: $0.38-0.50=-0.12$.`, why: `Raising one action's probability must lower the other.` }
      ],
      answer: `$\\pi(\\text{Left})$ fell by $0.12$ (to $0.38$), because softmax probabilities must sum to $1$.`
    }
  ]);

  /* ================================================================ */
  /* 4. ACTOR-CRITIC (A2C, PPO)                                       */
  /* ================================================================ */
  add("mod-actor-critic", [
    {
      q: `<p>The critic estimates $V(s)=5$. The one-step action value is $Q(s,a)=7$. Compute the advantage $A=Q-V$.</p>`,
      steps: [
        { do: `Set up $A=Q-V=7-5$.`, why: `The advantage is the action value minus the baseline $V(s)$.` },
        { do: `Compute: $7-5=2$.`, why: `A positive advantage means the action beat the state's average.` }
      ],
      answer: `$A=2$`
    },
    {
      q: `<p>Estimate $Q(s,a)=r+\\gamma V(s')$ with $r=1$, $\\gamma=0.9$, $V(s')=6$.</p>`,
      steps: [
        { do: `Discounted next value: $0.9\\times 6=5.4$.`, why: `The critic's next-state value is discounted.` },
        { do: `Add reward: $1+5.4=6.4$.`, why: `One-step $Q$ is reward plus discounted next value.` }
      ],
      answer: `$Q(s,a)=6.4$`
    },
    {
      q: `<p>Full advantage. $V(s)=5$, $r=1$, $\\gamma=0.9$, $V(s')=6$. Compute $A=(r+\\gamma V(s'))-V(s)$.</p>`,
      steps: [
        { do: `One-step $Q$: $1+0.9\\times 6=6.4$.`, why: `Form the action value from the observed step.` },
        { do: `Advantage: $6.4-5=1.4$.`, why: `Subtract the baseline $V(s)$.` }
      ],
      answer: `$A=1.4$`
    },
    {
      q: `<p>The advantage came out $A=1.4&gt;0$. Does the actor push this action's probability up or down?</p>`,
      steps: [
        { do: `Positive advantage means the action beat expectations.`, why: `$A&gt;0$ says the outcome was better than the state's average.` },
        { do: `So the actor raises its probability.`, why: `The update $\\nabla\\log\\pi\\,A$ encourages above-average actions.` }
      ],
      answer: `Up`
    },
    {
      q: `<p>$V(s)=4$, $r=2$, $V(s')=5$, $\\gamma=1$. Compute the advantage $A$.</p>`,
      steps: [
        { do: `$Q=r+\\gamma V(s')=2+1\\times 5=7$.`, why: `With $\\gamma=1$ the next value is undiscounted.` },
        { do: `$A=Q-V(s)=7-4=3$.`, why: `Advantage is action value minus baseline.` }
      ],
      answer: `$A=3$`
    },
    {
      q: `<p>$V(s)=10$, $r=0$, $V(s')=8$, $\\gamma=0.9$. Compute the advantage and say what the actor does.</p>`,
      steps: [
        { do: `$Q=0+0.9\\times 8=7.2$.`, why: `Form the one-step action value.` },
        { do: `$A=7.2-10=-2.8$.`, why: `The action value falls short of the baseline.` },
        { do: `Negative advantage, so the actor lowers the probability.`, why: `Worse-than-average actions are discouraged.` }
      ],
      answer: `$A=-2.8$; the actor pushes the action's probability down.`
    },
    {
      q: `<p>The critic under-valued the state: $V(s)=5$ but $Q=6.4$. Using $V\\leftarrow V+\\alpha_C\\,A$ with $\\alpha_C=0.5$ and $A=1.4$, compute the updated $V(s)$.</p>`,
      steps: [
        { do: `Scaled advantage: $0.5\\times 1.4=0.7$.`, why: `The critic moves toward $Q$ by a fraction of the TD error.` },
        { do: `New value: $5+0.7=5.7$.`, why: `$V$ rises toward the observed action value $6.4$.` }
      ],
      answer: `$V(s)\\leftarrow 5.7$`
    },
    {
      q: `<p>Why does subtracting the baseline $V(s)$ not bias the policy gradient? Answer in one idea.</p>`,
      steps: [
        { do: `The baseline term is $E[\\nabla\\log\\pi\\,V(s)]$.`, why: `Subtracting $V(s)$ adds this term to the gradient.` },
        { do: `Since $V(s)$ is constant over actions, $\\sum_a\\nabla\\pi=\\nabla\\sum_a\\pi=\\nabla 1=0$.`, why: `Probabilities always sum to one, so its gradient vanishes.` }
      ],
      answer: `The baseline term has expectation zero because $\\sum_a\\nabla\\pi=\\nabla 1=0$; it cuts variance without bias.`
    },
    {
      q: `<p>Compare variance. Plain REINFORCE scales by raw return $G=8$; actor-critic scales by advantage $A=8-V$ with $V=7$. What does the actor-critic scalar become, and why is this better?</p>`,
      steps: [
        { do: `Advantage scalar: $8-7=1$.`, why: `Subtracting the baseline centers the signal.` },
        { do: `A smaller-magnitude, centered signal has lower variance.`, why: `Centered updates fluctuate less, so learning is steadier.` }
      ],
      answer: `Scalar $=1$ vs $8$; the centered advantage has much lower variance.`
    },
    {
      q: `<p>The actor update is $\\nabla_\\theta J=E[\\nabla_\\theta\\log\\pi(a\\mid s)\\,A]$. With $\\nabla\\log\\pi=0.4$ and $A=2.5$, compute the update term.</p>`,
      steps: [
        { do: `Identify the product: score $0.4$ times advantage $2.5$.`, why: `Actor-critic scales the score by the advantage instead of the raw return.` },
        { do: `Multiply: $0.4\\times 2.5=1.0$.`, why: `The advantage replaces $G$, giving a lower-variance update.` }
      ],
      answer: `$1.0$`
    },
    {
      q: `<p>TD error as advantage. The one-step TD error is $\\delta=r+\\gamma V(s')-V(s)$. With $r=3$, $\\gamma=0.5$, $V(s')=4$, $V(s)=4$, compute $\\delta$ (which equals the one-step advantage).</p>`,
      steps: [
        { do: `$r+\\gamma V(s')=3+0.5\\times 4=5$.`, why: `Bootstrap the next-state value.` },
        { do: `$\\delta=5-4=1$.`, why: `Subtract the current state value; this $\\delta$ estimates $A$.` }
      ],
      answer: `$\\delta=A=1$`
    },
    {
      q: `<p>PPO clipping. The probability ratio is $\\rho=\\frac{\\pi_{\\text{new}}}{\\pi_{\\text{old}}}=1.5$, clip range $[0.8,1.2]$. What does PPO clip the ratio to?</p>`,
      steps: [
        { do: `Compare $1.5$ to the upper bound $1.2$.`, why: `PPO clips ratios outside the trust region.` },
        { do: `Since $1.5&gt;1.2$, clip to $1.2$.`, why: `Clipping caps the update so a single step cannot change the policy too much.` }
      ],
      answer: `Clipped to $1.2$`
    },
    {
      q: `<p>PPO objective with a positive advantage. $A=+2$, ratio $\\rho=1.5$, clipped ratio $1.2$. PPO uses $\\min(\\rho A,\\;\\text{clip}(\\rho)A)$. Compute it.</p>`,
      steps: [
        { do: `Unclipped: $\\rho A=1.5\\times 2=3$.`, why: `The raw surrogate objective.` },
        { do: `Clipped: $1.2\\times 2=2.4$.`, why: `The clipped surrogate caps the gain.` },
        { do: `Take the min: $\\min(3,2.4)=2.4$.`, why: `PPO takes the pessimistic (smaller) of the two for positive $A$.` }
      ],
      answer: `$2.4$`
    },
    {
      q: `<p>Multi-step (2-step) advantage. Rewards $r_0=1$ then $r_1=2$, $\\gamma=0.5$, with bootstrap $V(s_2)=4$ and baseline $V(s_0)=3$. Compute $A=r_0+\\gamma r_1+\\gamma^2 V(s_2)-V(s_0)$.</p>`,
      steps: [
        { do: `Discounted reward sum: $1+0.5\\times 2=1+1=2$.`, why: `Accumulate the actual rewards with discounting.` },
        { do: `Add bootstrap: $0.5^2\\times 4=0.25\\times 4=1$, giving $2+1=3$.`, why: `The tail value beyond the rollout is discounted by $\\gamma^2$.` },
        { do: `Subtract baseline: $3-3=0$.`, why: `The advantage compares the n-step return to $V(s_0)$.` }
      ],
      answer: `$A=0$`
    },
    {
      q: `<p>Combined actor-critic loss. The actor loss is $L_A=-1.0$ (negative surrogate, to maximize) and the critic loss is $L_C=0.4$, weighted by $c=0.5$. Compute the total loss $L=L_A+c\\,L_C$.</p>`,
      steps: [
        { do: `Weight the critic loss: $0.5\\times 0.4=0.2$.`, why: `The value-function loss is scaled by a coefficient $c$.` },
        { do: `Add: $-1.0+0.2=-0.8$.`, why: `Actor-critic optimizes a combined objective.` }
      ],
      answer: `$L=-0.8$`
    },
    {
      q: `<p>GAE intuition with $\\lambda$. The 1-step advantage is $\\delta_0=2$ and the next TD error is $\\delta_1=1$, with $\\gamma=1$ and $\\lambda=0.5$. The GAE estimate is $\\hat A=\\delta_0+\\gamma\\lambda\\,\\delta_1$. Compute it.</p>`,
      steps: [
        { do: `Decay factor: $\\gamma\\lambda=1\\times 0.5=0.5$.`, why: `GAE exponentially weights later TD errors by $\\gamma\\lambda$.` },
        { do: `Combine: $2+0.5\\times 1=2.5$.`, why: `Add the discounted next TD error to the first.` }
      ],
      answer: `$\\hat A=2.5$`
    },
    {
      q: `<p>Entropy bonus. The actor's policy is $\\pi=(0.5,0.5)$ over two actions. Compute the entropy $H=-\\sum_a \\pi(a)\\log_2\\pi(a)$ in bits.</p>`,
      steps: [
        { do: `Each term: $-0.5\\log_2 0.5=-0.5\\times(-1)=0.5$.`, why: `$\\log_2 0.5=-1$, so each action contributes $0.5$ bits.` },
        { do: `Sum: $0.5+0.5=1$.`, why: `Entropy adds the per-action contributions; this is maximal for two actions.` }
      ],
      answer: `$H=1$ bit (maximal, encouraging exploration).`
    },
    {
      q: `<p>Advantage sign drives the actor; the critic chases the return. After an episode the agent finds $A=0$ for every action it took. What happens to the actor this update, and why?</p>`,
      steps: [
        { do: `The actor update is $\\nabla\\log\\pi\\,A$ with $A=0$.`, why: `A zero advantage gives a zero gradient term.` },
        { do: `So the policy does not change this step.`, why: `If every action exactly met expectations, there is nothing to encourage or discourage.` }
      ],
      answer: `The actor does not change, because the update scales by $A=0$.`
    }
  ]);

  /* ================================================================ */
  /* 5. CONTRASTIVE / SELF-SUPERVISED LEARNING                        */
  /* ================================================================ */
  add("mod-contrastive", [
    {
      q: `<p>Two unit-length embeddings point in exactly the same direction. What is their cosine similarity?</p>`,
      steps: [
        { do: `Cosine of the angle between them: angle $=0^\\circ$.`, why: `Same direction means zero angle.` },
        { do: `$\\cos 0^\\circ=1$.`, why: `Cosine similarity is $+1$ for identical directions.` }
      ],
      answer: `$\\text{sim}=1$`
    },
    {
      q: `<p>Two embeddings are perpendicular (at $90^\\circ$). What is their cosine similarity?</p>`,
      steps: [
        { do: `The angle between them is $90^\\circ$.`, why: `Cosine similarity is the cosine of the angle between the vectors.` },
        { do: `Evaluate: $\\cos 90^\\circ=0$.`, why: `Perpendicular (unrelated) vectors have zero cosine similarity.` }
      ],
      answer: `$\\text{sim}=0$`
    },
    {
      q: `<p>In contrastive learning, two augmented views of the same image form a pair that should be pulled together. What is this pair called?</p>`,
      steps: [
        { do: `Identify the relationship: same source, different view.`, why: `Augmentations of one image share identity.` },
        { do: `Such a pair is the positive pair.`, why: `Positives should land close in embedding space.` }
      ],
      answer: `A positive pair.`
    },
    {
      q: `<p>Cosine similarity is $\\text{sim}(a,b)=\\frac{a\\cdot b}{\\lVert a\\rVert\\,\\lVert b\\rVert}$. With $a\\cdot b=6$, $\\lVert a\\rVert=2$, $\\lVert b\\rVert=5$, compute $\\text{sim}$.</p>`,
      steps: [
        { do: `Denominator: $2\\times 5=10$.`, why: `Cosine divides by the product of the norms.` },
        { do: `Divide: $6/10=0.6$.`, why: `The dot product over the norms gives cosine similarity.` }
      ],
      answer: `$\\text{sim}=0.6$`
    },
    {
      q: `<p>Two vectors $a=(1,0)$ and $b=(0,1)$. Compute their dot product $a\\cdot b$.</p>`,
      steps: [
        { do: `Multiply matching coordinates: $1\\times 0=0$ and $0\\times 1=0$.`, why: `The dot product pairs up coordinates and multiplies them.` },
        { do: `Add the products: $0+0=0$.`, why: `Summing the coordinate products gives the dot product.` }
      ],
      answer: `$a\\cdot b=0$ (they are orthogonal).`
    },
    {
      q: `<p>With temperature $\\tau=1$, positive similarity $0.9$ and one negative with similarity $0.1$. The positive weight is $\\exp(0.9/\\tau)$. Compute it using $\\exp(0.9)\\approx 2.46$.</p>`,
      steps: [
        { do: `Divide by temperature: $0.9/1=0.9$.`, why: `The exponent is similarity over temperature.` },
        { do: `Exponentiate: $\\exp(0.9)\\approx 2.46$.`, why: `Turns the similarity into a positive weight.` }
      ],
      answer: `Positive weight $\\approx 2.46$`
    },
    {
      q: `<p>Continuing: positive weight $\\approx 2.46$, negative weight $\\exp(0.1)\\approx 1.11$. Compute the probability the model assigns to the positive, $\\frac{2.46}{2.46+1.11}$.</p>`,
      steps: [
        { do: `Denominator: $2.46+1.11=3.57$.`, why: `Softmax sums the positive and all negative weights.` },
        { do: `Divide: $2.46/3.57\\approx 0.69$.`, why: `The positive's share of the total weight.` }
      ],
      answer: `$p\\approx 0.69$`
    },
    {
      q: `<p>The positive probability is $p\\approx 0.69$. Compute the InfoNCE loss $\\ell=-\\log p$. Use $\\log 0.69\\approx -0.37$.</p>`,
      steps: [
        { do: `Take the log: $\\log 0.69\\approx -0.37$.`, why: `The loss is the negative log of the positive's probability.` },
        { do: `Negate: $-(-0.37)=0.37$.`, why: `Negative log of a sub-1 probability is positive.` }
      ],
      answer: `$\\ell\\approx 0.37$`
    },
    {
      q: `<p>With $\\tau=1$, positive similarity $1.0$ and one negative with similarity $0$. Using $e^{1}\\approx 2.72$, $e^{0}=1$, compute the positive's probability.</p>`,
      steps: [
        { do: `Weights: positive $e^{1}\\approx 2.72$, negative $e^{0}=1$.`, why: `Exponentiate each similarity (temperature $1$).` },
        { do: `Probability: $\\frac{2.72}{2.72+1}=\\frac{2.72}{3.72}\\approx 0.73$.`, why: `Softmax over the two candidates.` }
      ],
      answer: `$p\\approx 0.73$`
    },
    {
      q: `<p>Why does minimizing $\\ell=-\\log p$ pull the positive close and push negatives away? Answer in terms of maximizing $p$.</p>`,
      steps: [
        { do: `Minimizing $-\\log p$ is the same as maximizing $p$.`, why: `$\\log$ is increasing, so the two are equivalent.` },
        { do: `$p$ is near $1$ only when the positive weight dominates the denominator.`, why: `The positive must be the largest term in the softmax.` },
        { do: `That requires high positive similarity and low negative similarities.`, why: `Pulling positives close and pushing negatives apart maximizes $p$.` }
      ],
      answer: `Maximizing $p$ forces high positive similarity and low negative similarities — pull positives together, push negatives apart.`
    },
    {
      q: `<p>Temperature effect. The same similarities $0.9$ (positive) and $0.1$ (negative) are divided by $\\tau=0.5$. Compute the two exponents (similarity$/\\tau$).</p>`,
      steps: [
        { do: `Positive exponent: $0.9/0.5=1.8$.`, why: `A smaller $\\tau$ enlarges the exponents.` },
        { do: `Negative exponent: $0.1/0.5=0.2$.`, why: `Both are scaled up, widening their gap.` }
      ],
      answer: `Exponents $1.8$ and $0.2$ (a sharper contrast than at $\\tau=1$).`
    },
    {
      q: `<p>Does a smaller temperature $\\tau$ make the loss focus more on hard (close) negatives or less? Answer with reasoning.</p>`,
      steps: [
        { do: `Smaller $\\tau$ divides similarities by less, exaggerating differences.`, why: `Dividing by a small number sharpens the softmax.` },
        { do: `The sharpened softmax weights the closest negatives more heavily.`, why: `Hard negatives dominate the gradient, so the loss focuses on them.` }
      ],
      answer: `More — small $\\tau$ sharpens the contrast and emphasizes hard negatives.`
    },
    {
      q: `<p>SimCLR with a batch of $N$ images creates $2N$ views. For one anchor, how many negatives are there (all other views)?</p>`,
      steps: [
        { do: `Total views: $2N$.`, why: `Each image yields two augmented views.` },
        { do: `Exclude the anchor and its positive: $2N-2$.`, why: `Every other view is a negative for this anchor.` }
      ],
      answer: `$2N-2$ negatives`
    },
    {
      q: `<p>Many negatives. With $\\tau=1$, positive similarity $2$ and three negatives each with similarity $0$. Using $e^{2}\\approx 7.39$, $e^{0}=1$, compute the positive's probability.</p>`,
      steps: [
        { do: `Weights: positive $e^{2}\\approx 7.39$; three negatives each $1$.`, why: `Exponentiate each similarity.` },
        { do: `Denominator: $7.39+1+1+1=10.39$.`, why: `Softmax sums the positive plus all negatives.` },
        { do: `Probability: $7.39/10.39\\approx 0.71$.`, why: `More negatives lower the positive's share.` }
      ],
      answer: `$p\\approx 0.71$`
    },
    {
      q: `<p>CLIP cross-modal. An image embedding and its caption embedding form the positive pair. With $\\tau=1$, image-caption similarity $1.5$ and one wrong caption with similarity $0.5$. Using $e^{1.5}\\approx 4.48$, $e^{0.5}\\approx 1.65$, compute the loss $-\\log p$.</p>`,
      steps: [
        { do: `Probability: $\\frac{4.48}{4.48+1.65}=\\frac{4.48}{6.13}\\approx 0.73$.`, why: `Softmax over the correct vs wrong caption.` },
        { do: `Loss: $-\\log 0.73\\approx 0.31$.`, why: `Negative log of the matched pair's probability.` }
      ],
      answer: `$\\ell\\approx 0.31$`
    },
    {
      q: `<p>Perfect separation limit. If the positive similarity $\\to+\\infty$ while negatives stay finite, what does $p$ approach and what does the loss approach?</p>`,
      steps: [
        { do: `The positive weight $\\exp(s_{ij}/\\tau)\\to\\infty$, dominating the denominator.`, why: `An unbounded positive weight overwhelms the finite negatives.` },
        { do: `So $p\\to 1$ and $\\ell=-\\log p\\to 0$.`, why: `A perfectly identified positive incurs zero loss.` }
      ],
      answer: `$p\\to 1$, $\\ell\\to 0$.`
    },
    {
      q: `<p>Normalization matters. An unnormalized vector $v=(3,4)$ is projected to the unit sphere before similarity. Compute its norm $\\lVert v\\rVert$ and the unit vector $v/\\lVert v\\rVert$.</p>`,
      steps: [
        { do: `Norm: $\\sqrt{3^2+4^2}=\\sqrt{9+16}=\\sqrt{25}=5$.`, why: `The Euclidean norm is the root of the sum of squares.` },
        { do: `Unit vector: $(3/5,4/5)=(0.6,0.8)$.`, why: `Dividing by the norm puts the embedding on the unit sphere, where cosine similarity is just the dot product.` }
      ],
      answer: `$\\lVert v\\rVert=5$, unit vector $=(0.6,0.8)$`
    },
    {
      q: `<p>Alignment vs uniformity. Two normalized embeddings have cosine similarity $\\text{sim}=0.6$. Their squared Euclidean distance is $\\lVert a-b\\rVert^2=2-2\\,\\text{sim}$. Compute it.</p>`,
      steps: [
        { do: `Apply the identity for unit vectors: $2-2\\,\\text{sim}$.`, why: `For unit vectors, $\\lVert a-b\\rVert^2=\\lVert a\\rVert^2+\\lVert b\\rVert^2-2a\\cdot b=2-2\\,\\text{sim}$.` },
        { do: `Compute: $2-2\\times 0.6=2-1.2=0.8$.`, why: `Higher similarity means smaller distance, confirming pull-together.` }
      ],
      answer: `$\\lVert a-b\\rVert^2=0.8$`
    }
  ]);

  /* ================================================================ */
  /* 6. VISION TRANSFORMERS                                           */
  /* ================================================================ */
  add("mod-vit", [
    {
      q: `<p>An image is $32\\times 32$ pixels with patch size $P=8$. How many patches fit along one side?</p>`,
      steps: [
        { do: `Take one side length $32$ and the patch size $8$.`, why: `Patches tile each side without overlap.` },
        { do: `Divide: $32/8=4$.`, why: `The side length over the patch size gives patches per side.` }
      ],
      answer: `$4$ patches per side`
    },
    {
      q: `<p>An image is $32\\times 32$ with $P=8$. Compute the total number of patch tokens $N=\\frac{H\\times W}{P^2}$.</p>`,
      steps: [
        { do: `Image area: $32\\times 32=1024$.`, why: `$H\\times W$ is the total pixel count.` },
        { do: `Patch area: $8^2=64$.`, why: `$P^2$ is the pixels per patch.` },
        { do: `Divide: $1024/64=16$.`, why: `Total patches is area over patch area.` }
      ],
      answer: `$N=16$ tokens (a $4\\times4$ grid).`
    },
    {
      q: `<p>An image is $48\\times 48$ with $P=16$. Compute $N$.</p>`,
      steps: [
        { do: `Area: $48\\times 48=2304$.`, why: `Total pixels.` },
        { do: `Patch area: $16^2=256$.`, why: `Pixels per patch.` },
        { do: `Divide: $2304/256=9$.`, why: `A $3\\times 3$ grid of patches.` }
      ],
      answer: `$N=9$ tokens`
    },
    {
      q: `<p>How many pixels are in one $16\\times 16$ patch (single channel)?</p>`,
      steps: [
        { do: `A patch is a $P\\times P$ square, here $16\\times 16$.`, why: `Patch area is the side squared.` },
        { do: `Multiply: $16\\times 16=256$.`, why: `That product is the pixel count of one patch.` }
      ],
      answer: `$256$ pixels`
    },
    {
      q: `<p>The token build rule is $\\text{token}_p=x_p E+E_{pos}(p)$. Name the two ingredients combined for each token.</p>`,
      steps: [
        { do: `First, $x_p E$: the flattened patch pixels times the embedding matrix.`, why: `This produces the patch's content embedding.` },
        { do: `Second, $E_{pos}(p)$: the position embedding for that patch.`, why: `It tells the model where the patch sat in the grid.` }
      ],
      answer: `A content (patch) embedding plus a position embedding.`
    },
    {
      q: `<p>Why add a position embedding $E_{pos}$ to each token? Answer in one idea.</p>`,
      steps: [
        { do: `Attention treats its inputs as an unordered set.`, why: `Self-attention has no built-in notion of order or location.` },
        { do: `Adding $E_{pos}$ injects each patch's grid location.`, why: `Without it the model could not tell where a patch came from.` }
      ],
      answer: `Attention is order-agnostic, so $E_{pos}$ supplies each patch's spatial location.`
    },
    {
      q: `<p>A $16\\times 16$ RGB patch (3 colour channels) is flattened into a vector $x_p$. How long is $x_p$?</p>`,
      steps: [
        { do: `Pixels per channel: $16\\times 16=256$.`, why: `Each channel is a $P\\times P$ block.` },
        { do: `Times 3 channels: $256\\times 3=768$.`, why: `Flattening concatenates all colour channels.` }
      ],
      answer: `$x_p$ has length $768$`
    },
    {
      q: `<p>The flattened patch $x_p$ has length $768$ and the embedding matrix $E$ maps it to a token of dimension $128$. What are the dimensions of $E$?</p>`,
      steps: [
        { do: `$x_p E$ must output length $128$ from input length $768$.`, why: `Matrix multiply maps input dim to output dim.` },
        { do: `So $E$ is $768\\times 128$.`, why: `A $(1\\times 768)$ row times a $(768\\times 128)$ matrix gives $(1\\times 128)$.` }
      ],
      answer: `$E$ is $768\\times 128$`
    },
    {
      q: `<p>Plus a class token. A $4\\times 4$ patch grid ($16$ tokens) prepends one extra $[\\text{CLS}]$ token. What is the total sequence length fed to the transformer?</p>`,
      steps: [
        { do: `Patch tokens: $16$.`, why: `The grid yields $N=16$ patch tokens.` },
        { do: `Add the class token: $16+1=17$.`, why: `ViT prepends a learnable $[\\text{CLS}]$ token used for classification.` }
      ],
      answer: `$17$ tokens`
    },
    {
      q: `<p>Attention cost grows like $N^2$. For $N=196$ tokens, how many pairwise attention comparisons are there (compute $N^2$)?</p>`,
      steps: [
        { do: `Square the token count: $196^2$.`, why: `Each token attends to every token, giving $N\\times N$ pairs.` },
        { do: `Compute: $196^2=38{,}416$.`, why: `This is the affordable scale for patched images.` }
      ],
      answer: `$38{,}416$ comparisons`
    },
    {
      q: `<p>Why patches instead of one token per pixel? For a $224\\times 224$ image, compare the pixel-token count's square against the $P=16$ patch-token count's square.</p>`,
      steps: [
        { do: `Pixels: $224\\times 224\\approx 50{,}000$, so $N^2\\approx 2.5$ billion.`, why: `Per-pixel tokens make attention explode quadratically.` },
        { do: `Patches: $N=\\frac{224\\times 224}{256}=196$, so $N^2\\approx 38{,}000$.`, why: `Patching shrinks $N$ dramatically while keeping global reach.` }
      ],
      answer: `Pixels give $\\approx 2.5\\times 10^9$ pairs vs $\\approx 3.8\\times 10^4$ for $P=16$ patches — patching makes attention tractable.`
    },
    {
      q: `<p>Halving the patch size from $P=16$ to $P=8$ on the same image: by what factor does the number of tokens $N$ change?</p>`,
      steps: [
        { do: `$N=HW/P^2$, so $N\\propto 1/P^2$.`, why: `Token count scales inversely with patch area.` },
        { do: `Halving $P$ quarters $P^2$, so $N$ grows by $4\\times$.`, why: `$(1/2)^2=1/4$ in the denominator means a $4\\times$ increase.` }
      ],
      answer: `$N$ increases by a factor of $4$.`
    },
    {
      q: `<p>If $N$ grows by $4\\times$ (from halving $P$), by what factor does the $N^2$ attention cost grow?</p>`,
      steps: [
        { do: `Attention cost $\\propto N^2$.`, why: `Pairwise comparisons scale with the square of tokens.` },
        { do: `$N\\to 4N$ gives $(4N)^2=16N^2$.`, why: `Squaring the $4\\times$ token growth gives $16\\times$.` }
      ],
      answer: `Attention cost grows by $16\\times$.`
    },
    {
      q: `<p>Non-square image. $H=64$, $W=32$, $P=16$. Compute $N$.</p>`,
      steps: [
        { do: `Patches per side: $64/16=4$ tall, $32/16=2$ wide.`, why: `Divide each dimension by the patch size.` },
        { do: `Total: $4\\times 2=8$.`, why: `Token count is the product of patches per side; equivalently $\\frac{64\\times 32}{16^2}=\\frac{2048}{256}=8$.` }
      ],
      answer: `$N=8$ tokens`
    },
    {
      q: `<p>Parameters in the patch-embedding matrix. $E$ is $768\\times 128$. How many weights does it hold (ignoring bias)?</p>`,
      steps: [
        { do: `Multiply the dimensions: $768\\times 128$.`, why: `A dense matrix has rows times columns entries.` },
        { do: `Compute: $768\\times 128=98{,}304$.`, why: `This is the parameter count of the linear projection.` }
      ],
      answer: `$98{,}304$ weights`
    },
    {
      q: `<p>Softmax attention weights. A query attends to two keys with raw scores $2$ and $0$. Using $e^{2}\\approx 7.39$, $e^{0}=1$, what attention weight does the first key get?</p>`,
      steps: [
        { do: `Exponentiate scores: $e^{2}\\approx 7.39$ and $e^{0}=1$.`, why: `Attention applies a softmax over the scores.` },
        { do: `Normalize the first: $\\frac{7.39}{7.39+1}=\\frac{7.39}{8.39}\\approx 0.88$.`, why: `Each weight is its exponential over the total.` }
      ],
      answer: `$\\approx 0.88$`
    },
    {
      q: `<p>Scaled dot-product attention divides scores by $\\sqrt{d_k}$. With key dimension $d_k=64$ and a raw dot product of $32$, compute the scaled score.</p>`,
      steps: [
        { do: `Scale factor: $\\sqrt{64}=8$.`, why: `Scaling by $\\sqrt{d_k}$ keeps the softmax from saturating at large $d_k$.` },
        { do: `Divide: $32/8=4$.`, why: `The scaled score feeds the softmax.` }
      ],
      answer: `Scaled score $=4$`
    },
    {
      q: `<p>Compute throughput. A ViT processes a $96\\times 96$ image with $P=16$. How many patch tokens, and how many pairwise attention entries $N^2$?</p>`,
      steps: [
        { do: `Tokens: $N=\\frac{96\\times 96}{16^2}=\\frac{9216}{256}=36$.`, why: `Area over patch area gives the token count.` },
        { do: `Pairs: $N^2=36^2=1296$.`, why: `Each of the $36$ tokens attends to all $36$.` }
      ],
      answer: `$N=36$ tokens, $N^2=1296$ attention entries.`
    }
  ]);

  /* ================================================================ */
  /* 7. TIME-SERIES FORECASTING (ARIMA)                               */
  /* ================================================================ */
  add("mod-timeseries", [
    {
      q: `<p>An AR(1) model is $\\hat y_t=c+\\phi\\,y_{t-1}$ with $c=1$ and $\\phi=0.4$. If $y_{t-1}=5$, compute the one-step forecast.</p>`,
      steps: [
        { do: `AR term: $0.4\\times 5=2$.`, why: `The coefficient $\\phi$ weights the previous value.` },
        { do: `Add the constant: $1+2=3$.`, why: `The AR(1) forecast is the offset plus the weighted past value.` }
      ],
      answer: `$\\hat y_t=3$`
    },
    {
      q: `<p>AR(1) with $c=2$, $\\phi=0.5$, latest value $y_{t-1}=10$. Compute the one-step forecast $\\hat y_t$.</p>`,
      steps: [
        { do: `AR term: $0.5\\times 10=5$.`, why: `Weight the latest value by $\\phi$.` },
        { do: `Add constant: $2+5=7$.`, why: `Forecast is constant plus AR term.` }
      ],
      answer: `$\\hat y_t=7$`
    },
    {
      q: `<p>Continue the forecast: with $c=2$, $\\phi=0.5$ and the just-computed $\\hat y_t=7$, compute the two-step forecast $\\hat y_{t+1}$.</p>`,
      steps: [
        { do: `Feed the forecast back in: $0.5\\times 7=3.5$.`, why: `Multi-step forecasts reuse earlier forecasts as inputs.` },
        { do: `Add constant: $2+3.5=5.5$.`, why: `Apply the AR(1) rule again.` }
      ],
      answer: `$\\hat y_{t+1}=5.5$`
    },
    {
      q: `<p>The AR(1) long-run level is $\\frac{c}{1-\\phi}$. With $c=2$ and $\\phi=0.5$, compute it.</p>`,
      steps: [
        { do: `Denominator: $1-0.5=0.5$.`, why: `The steady state subtracts $\\phi$ from one.` },
        { do: `Divide: $2/0.5=4$.`, why: `Forecasts converge to this long-run mean.` }
      ],
      answer: `Long-run level $=4$`
    },
    {
      q: `<p>Differencing (the "I" in ARIMA). The series is $10, 13, 17$. Compute the first differences $y_t-y_{t-1}$.</p>`,
      steps: [
        { do: `$13-10=3$.`, why: `Differencing subtracts each value from the next.` },
        { do: `$17-13=4$.`, why: `Continue for the second difference.` }
      ],
      answer: `Differences: $3, 4$`
    },
    {
      q: `<p>Why does differencing help AR/MA models? Answer in one idea about trends.</p>`,
      steps: [
        { do: `A trending series keeps drifting up or down.`, why: `AR and MA assume a stable (stationary) level.` },
        { do: `Differencing turns a trend into a flat, steady series.`, why: `Subtracting consecutive values removes the trend, making the series stationary.` }
      ],
      answer: `Differencing removes the trend, making the series stationary so AR/MA can model it.`
    },
    {
      q: `<p>A pure MA(1) model is $y_t=c+\\varepsilon_t+\\theta\\,\\varepsilon_{t-1}$ with $c=5$, $\\theta=0.8$. Last period's error was $\\varepsilon_{t-1}=2$, and we forecast with the expected current error $\\varepsilon_t=0$. Compute the forecast.</p>`,
      steps: [
        { do: `MA term: $0.8\\times 2=1.6$.`, why: `The past surprise is weighted by $\\theta$.` },
        { do: `Add constant and expected error: $5+0+1.6=6.6$.`, why: `The future error is unknown, so its expectation is $0$.` }
      ],
      answer: `$\\hat y_t=6.6$`
    },
    {
      q: `<p>Computing a residual (error). The model predicted $\\hat y_t=8$ but the actual value was $y_t=11$. Compute the error $\\varepsilon_t=y_t-\\hat y_t$.</p>`,
      steps: [
        { do: `Set up $\\varepsilon_t=y_t-\\hat y_t=11-8$.`, why: `The error is the actual value minus the prediction.` },
        { do: `Compute: $11-8=3$.`, why: `This residual (surprise) feeds the MA part of future forecasts.` }
      ],
      answer: `$\\varepsilon_t=3$`
    },
    {
      q: `<p>An ARMA(1,1) model is $y_t=c+\\phi y_{t-1}+\\varepsilon_t+\\theta\\varepsilon_{t-1}$. With $c=1$, $\\phi=0.5$, $\\theta=0.4$, $y_{t-1}=6$, $\\varepsilon_{t-1}=2$, and expected $\\varepsilon_t=0$, compute the forecast.</p>`,
      steps: [
        { do: `AR term: $0.5\\times 6=3$.`, why: `Weight the past value by $\\phi$.` },
        { do: `MA term: $0.4\\times 2=0.8$.`, why: `Weight the past error by $\\theta$.` },
        { do: `Sum with constant: $1+3+0+0.8=4.8$.`, why: `Combine constant, AR, expected error, and MA terms.` }
      ],
      answer: `$\\hat y_t=4.8$`
    },
    {
      q: `<p>Forecast variance grows with horizon. For AR(1) with error variance $\\sigma^2=4$, the one-step forecast variance equals $\\sigma^2$. What is it?</p>`,
      steps: [
        { do: `One step ahead, the only unknown is $\\varepsilon_{t+1}$.`, why: `Knowing $y_t$, the next value's uncertainty is one fresh error.` },
        { do: `So the variance is $\\sigma^2=4$.`, why: `A single error contributes variance $\\sigma^2$.` }
      ],
      answer: `Variance $=4$`
    },
    {
      q: `<p>AR(1) two-step forecast variance is $\\sigma^2(1+\\phi^2)$. With $\\sigma^2=4$ and $\\phi=0.5$, compute it.</p>`,
      steps: [
        { do: `$\\phi^2=0.5^2=0.25$.`, why: `The earlier error propagates scaled by $\\phi$.` },
        { do: `$1+0.25=1.25$, times $\\sigma^2$: $4\\times 1.25=5$.`, why: `Two independent errors accumulate, so variance grows.` }
      ],
      answer: `Variance $=5$`
    },
    {
      q: `<p>A 95% prediction interval is $\\hat y\\pm 1.96\\,\\sigma_{\\text{forecast}}$. With forecast $\\hat y=20$ and one-step standard deviation $\\sigma_{\\text{forecast}}=2$, compute the interval.</p>`,
      steps: [
        { do: `Half-width: $1.96\\times 2=3.92$.`, why: `The 95% band spans $1.96$ standard deviations each side.` },
        { do: `Interval: $20\\pm 3.92=[16.08,\\,23.92]$.`, why: `Center the band on the point forecast.` }
      ],
      answer: `$[16.08,\\;23.92]$`
    },
    {
      q: `<p>The two-step forecast variance is $5$ (from above). Compute the two-step standard deviation $\\sigma_{\\text{forecast}}=\\sqrt{\\text{variance}}$.</p>`,
      steps: [
        { do: `Take the square root of the variance: $\\sqrt{5}$.`, why: `Standard deviation is the root of variance.` },
        { do: `Evaluate: $\\sqrt{5}\\approx 2.24$.`, why: `Interval width scales with the standard deviation.` }
      ],
      answer: `$\\sigma_{\\text{forecast}}\\approx 2.24$`
    },
    {
      q: `<p>Why does the prediction interval fan out (widen) the further ahead we forecast? Answer in one idea.</p>`,
      steps: [
        { do: `Each future step adds its own fresh, unknown error $\\varepsilon$.`, why: `Errors are independent and accumulate over the horizon.` },
        { do: `Accumulated variance grows, and width $\\propto\\sqrt{\\text{variance}}$ grows with it.`, why: `More uncertainty further out widens the band.` }
      ],
      answer: `Each step adds a fresh independent error, so variance accumulates and the band widens with the horizon.`
    },
    {
      q: `<p>Effect of $\\phi$ on settling speed. Two AR(1) models start at $y=10$ with $c=0$. Model A has $\\phi=0.3$, model B has $\\phi=0.9$. After one step, which is closer to the long-run level $0$?</p>`,
      steps: [
        { do: `Model A: $0.3\\times 10=3$.`, why: `A smaller $\\phi$ decays the value faster toward the mean.` },
        { do: `Model B: $0.9\\times 10=9$.`, why: `A larger $\\phi$ keeps memory of the past, settling slowly.` }
      ],
      answer: `Model A ($\\phi=0.3$) is closer to $0$ (value $3$ vs $9$); smaller $\\phi$ settles faster.`
    },
    {
      q: `<p>Geometric series for the limit. AR(1) with $c=3$, $\\phi=0.5$ converges to $\\frac{c}{1-\\phi}$. Compute the long-run forecast.</p>`,
      steps: [
        { do: `Denominator: $1-0.5=0.5$.`, why: `Stationary AR(1) settles to $c/(1-\\phi)$.` },
        { do: `Divide: $3/0.5=6$.`, why: `Forecasts iterate toward this fixed point.` }
      ],
      answer: `Long-run level $=6$`
    },
    {
      q: `<p>Seasonal differencing. A monthly series with a 12-month season uses lag-12 differences $y_t-y_{t-12}$. If this January is $50$ and last January was $44$, compute the seasonal difference.</p>`,
      steps: [
        { do: `Subtract the value 12 months back: $50-44=6$.`, why: `Seasonal differencing removes a repeating yearly pattern.` },
        { do: `The result captures the year-over-year change.`, why: `What remains is the trend net of seasonality.` }
      ],
      answer: `Seasonal difference $=6$`
    },
    {
      q: `<p>Three-step variance. AR(1) with $\\sigma^2=1$, $\\phi=0.5$. The $h$-step variance is $\\sigma^2(1+\\phi^2+\\phi^4)$ for $h=3$. Compute it.</p>`,
      steps: [
        { do: `Powers: $\\phi^2=0.25$, $\\phi^4=0.0625$.`, why: `Each earlier error propagates with successive powers of $\\phi$.` },
        { do: `Sum: $1+0.25+0.0625=1.3125$, times $\\sigma^2=1$.`, why: `Three independent errors accumulate variance.` }
      ],
      answer: `Variance $=1.3125$`
    },
    {
      q: `<p>Random walk (a special AR(1) with $\\phi=1$). The $h$-step variance is $h\\,\\sigma^2$. With $\\sigma^2=2$, compute the variance $4$ steps ahead and note how the interval grows.</p>`,
      steps: [
        { do: `Multiply: $4\\times 2=8$.`, why: `With $\\phi=1$ no error decays, so variance grows linearly as $h\\sigma^2$.` },
        { do: `Standard deviation $=\\sqrt{8}\\approx 2.83$, so the band grows like $\\sqrt{h}$.`, why: `Interval width follows the standard deviation, which grows as $\\sqrt{h}$.` }
      ],
      answer: `Variance $=8$; the interval width grows like $\\sqrt{h}$ (a random walk never settles).`
    }
  ]);

})();
