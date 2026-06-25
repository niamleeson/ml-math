/* Paper lesson — "Mastering the Game of Go with Deep Neural Networks and Tree
   Search" (AlphaGo), Silver, Huang, Maddison, Guez, Sifre, van den Driessche,
   Schrittwieser, Antonoglou, Panneershelvam, Lanctot, Dieleman, Grewe, Nham,
   Kalchbrenner, Sutskever, Lillicrap, Leach, Kavukcuoglu, Graepel, Hassabis
   (Google DeepMind / Google, Nature 2016).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-alphago".
   GROUNDED from the author-hosted PDF (David Silver's site) of the Nature paper:
   Abstract (99.8% win rate; defeated European champion 5-0); Section 1 (SL policy
   network p_sigma, Eq 1, 30M KGS positions, 57.0%/55.7% accuracy, fast rollout
   p_pi 24.2%); Section 2 (RL policy network p_rho, Eq 2 self-play policy gradient,
   >80% vs SL, 85% vs Pachi); Section 3 (value network v_theta, Eqs 3-4, self-play
   30M distinct positions, MSE 0.226/0.234); Section 4 + Figure 3 (MCTS: Eq 5
   selection a=argmax(Q+u) with u ~ P/(1+N), Eq 6 leaf eval, Eqs 7-8 N and Q;
   lambda=0.5); Section 5 (494/495 = 99.8% vs other programs; Fan Hui 5-0, Oct 2015).
   Track: read-only (landmark RL + search result). No from-scratch full system.
   The CODEVIZ runs a TINY toy MCTS on a one-move game and shows visit counts
   concentrating on the best move — OUR illustration, not the paper's numbers. */
(function () {
  window.LESSONS.push({
    id: "paper-alphago",
    title: "AlphaGo — Mastering the Game of Go with Deep Neural Networks and Tree Search (2016)",
    tagline: "Two neural networks (one picks moves, one scores positions) guide a tree search that beat a human Go professional.",
    module: "Papers · Reinforcement Learning",
    track: "read-only",
    paper: {
      authors: "David Silver, Aja Huang (equal contribution), Chris J. Maddison, Arthur Guez, Laurent Sifre, George van den Driessche, Julian Schrittwieser, Ioannis Antonoglou, Veda Panneershelvam, Marc Lanctot, Sander Dieleman, Dominik Grewe, John Nham, Nal Kalchbrenner, Ilya Sutskever, Timothy Lillicrap, Madeleine Leach, Koray Kavukcuoglu, Thore Graepel, Demis Hassabis",
      org: "Google DeepMind / Google",
      year: 2016,
      venue: "Nature 529, 484-489 (2016)",
      citations: "",
      arxiv: "",
      url: "https://davidstarsilver.wordpress.com/wp-content/uploads/2025/04/mastering-the-game-of-go-with-deep-neural-networks-and-tree-search.pdf",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["ai-tree-search", "aix-monte-carlo", "rl-monte-carlo", "rl-policy-gradients", "dl-conv", "ml-softmax", "dl-cross-entropy"],

    // WHY READ IT
    problem:
      `<p>The game of <b>Go</b> is played on a 19&times;19 board. Two players place stones; the goal is to
       surround territory. The rules are simple, but the game is huge. To plan ahead, a program builds a
       <b>search tree</b>: from the current board, try each legal move, then each reply, then each reply to
       that, and so on. The number of leaves grows like $b^d$, where $b$ is the <b>breadth</b> (legal moves
       per position) and $d$ is the <b>depth</b> (how many moves ahead you look. The paper writes
       $b \\approx 250$, $d \\approx 150$ for Go (&sect;intro). That is far too many to enumerate.</p>
       <p>Two tricks shrink the tree. <b>(1) Cut the depth</b> with a <b>value function</b> $v(s)$: a function
       that looks at a board $s$ and estimates who will win, so you can stop searching and trust the estimate.
       <b>(2) Cut the breadth</b> with a <b>policy</b> $p(a \\,|\\, s)$: a probability over moves $a$ that tells
       you which moves are worth trying, so you ignore the rest. Before this paper, both were weak in Go.
       Position evaluation "was believed to be intractable in Go due to the complexity of the game"
       (&sect;intro), and the best programs used shallow, hand-built policies and value functions.</p>
       <p>The question this paper answers: <b>can deep neural networks supply a strong policy and a strong
       value function for Go, and can a search algorithm combine them to play at a professional level?</b></p>`,
    contribution:
      `<ul>
        <li><b>A policy network that picks good moves.</b> A deep convolutional network is first trained by
        <b>supervised learning</b> (copying human expert moves), then improved by <b>reinforcement learning</b>
        through self-play. It outputs a probability for each move &mdash; a learned way to narrow the search.
        (&sect;1&ndash;2.)</li>
        <li><b>A value network that scores positions.</b> A second deep network predicts the winner from a
        board position, trained by regression on self-play games. It replaces slow simulations with one fast
        forward pass &mdash; a learned way to cut the search depth. (&sect;3.)</li>
        <li><b>A search that uses both.</b> A new <b>Monte Carlo Tree Search (MCTS)</b> algorithm uses the policy
        network to focus its simulations and the value network (mixed with fast rollouts) to evaluate leaves.
        (&sect;4, Figure 3.) The result, <i>AlphaGo</i>, "achieved a 99.8% winning rate against other Go
        programs, and defeated the European Go champion by 5 games to 0." (Abstract.)</li>
      </ul>`,
    whyItMattered:
      `<p>Go was the standout unsolved board game for artificial intelligence &mdash; too big for brute-force
       search and resistant to hand-built evaluation. AlphaGo was "the first time that a computer Go program
       has defeated a human professional player, without handicap, in the full game of Go; a feat that was
       previously believed to be at least a decade away." (&sect;5.) Its recipe &mdash; <b>learn a policy and a
       value function with deep networks, then let a search lean on both</b> &mdash; became a template. It led
       directly to AlphaGo Zero and AlphaZero (which dropped the human data and the rollouts) and to MuZero, and
       it remains the canonical example of combining learned function approximation with planning. The lasting
       idea: <b>a search does not need to evaluate everything if a learned policy tells it where to look and a
       learned value tells it how good a position is.</b></p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>Abstract</b> &mdash; the whole story in one paragraph: value networks evaluate positions, policy
        networks select moves, trained by supervised then reinforcement learning, combined in a new search.</li>
        <li><b>Figure 1</b> &mdash; the training pipeline: fast rollout policy $p_\\pi$ and supervised-learning
        policy $p_\\sigma$, then the reinforcement-learning policy $p_\\rho$, then the value network $v_\\theta$.
        Internalise these four networks; the rest of the paper refers to them constantly.</li>
        <li><b>&sect;1&ndash;3</b> &mdash; how each network is trained. The key equations are the four update
        rules, Eqs (1)&ndash;(4).</li>
        <li><b>&sect;4 and Figure 3</b> &mdash; the heart of the paper: the MCTS loop (select, expand, evaluate,
        back up) and its four equations, Eqs (5)&ndash;(8). This is what this lesson explains in depth.</li>
        <li><b>&sect;5</b> &mdash; the results: the tournament win rate and the Fan Hui match.</li>
       </ul>
       <p><b>Skim:</b> the Methods section and Extended Data tables (network architectures, feature planes,
       distributed-search engineering) &mdash; needed to reproduce, not to grasp the idea. You do <b>not</b>
       implement AlphaGo; it is a large engineered system. Read it for how the three pieces fit together.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>AlphaGo's search picks moves with the rule (Eq 5): at each step choose
       $a_t = \\arg\\max_a \\big( Q(s_t,a) + u(s_t,a) \\big)$, where $Q$ is the move's current estimated value
       and the bonus $u(s,a) \\propto P(s,a) / (1 + N(s,a))$ rewards moves with a high policy-network prior
       $P$ and few visits $N$.</p>
       <p>Here is the question to guess before reading on: <b>as the search runs more and more simulations down
       a promising branch, what happens to that move's bonus $u$, and therefore to which term &mdash; $Q$ or
       $u$ &mdash; decides the choice?</b> Think about the $1 + N$ in the denominator. Write one sentence on
       what the search does early (few visits) versus late (many visits).</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build from scratch. Instead, before the reveal, work
       the selection rule by hand on a single node.</p>
       <p>A node has three child moves. Each stores: a current value estimate $Q$, a policy prior $P$ (from the
       policy network, summing to 1 across the children), and a visit count $N$. Use the bonus
       $u = c \\cdot P / (1 + N)$ with exploration constant $c = 1.5$.</p>
       <ul>
        <li><b>Move A:</b> $Q = 0.60$, $P = 0.20$, $N = 8$.</li>
        <li><b>Move B:</b> $Q = 0.10$, $P = 0.50$, $N = 1$.</li>
        <li><b>Move C:</b> $Q = 0.20$, $P = 0.30$, $N = 3$.</li>
       </ul>
       <ul>
        <li>TODO: compute $u$ for each move, then $Q + u$, then pick the $\\arg\\max$. Which move does Eq (5)
        select?</li>
        <li>TODO: notice B has the highest prior $P$ but the lowest score. Why? What would happen to B's bonus
        if it had been visited 8 times like A?</li>
       </ul>
       <p>The worked example below recomputes these exact numbers, and the CODEVIZ runs a tiny MCTS that repeats
       this selection many times so you can watch visit counts pile onto the best move.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>AlphaGo has <b>four</b> networks (Figure 1) and <b>one</b> search that ties two of them together. Take
       them in order.</p>
       <p><b>1. The supervised-learning (SL) policy network $p_\\sigma$ (&sect;1).</b> A <b>policy network</b> is a
       network that, given a board $s$, outputs a probability $p(a \\,|\\, s)$ for every legal move $a$ &mdash;
       its guess at which move a strong player would make. AlphaGo's is a 13-layer convolutional network (a
       network that slides small filters over the 19&times;19 board, like an image) ending in a softmax over
       moves. It is trained by <b>supervised learning</b>: show it real positions from human games and nudge it
       to raise the probability of the move the human actually played. The update is Eq (1):
       $\\Delta\\sigma \\propto \\partial \\log p_\\sigma(a \\,|\\, s) / \\partial \\sigma$ &mdash; plain
       maximum-likelihood, the gradient that increases the log-probability of the expert move. Trained on 30
       million positions from the KGS Go Server, it predicted expert moves with 57.0% accuracy (55.7% from raw
       board alone), versus 44.4% for prior work (&sect;1).</p>
       <p><b>2. The fast rollout policy $p_\\pi$ (&sect;1).</b> A much smaller, weaker, but very fast policy
       (a linear model over simple patterns). It is only 24.2% accurate but picks a move in 2 microseconds
       instead of 3 milliseconds &mdash; about 1500&times; faster. It is used to play games out quickly inside
       the search (a <b>rollout</b>; see below).</p>
       <p><b>3. The reinforcement-learning (RL) policy network $p_\\rho$ (&sect;2).</b> Same architecture as
       $p_\\sigma$, initialised to its weights ($\\rho = \\sigma$), then improved by <b>self-play</b>: it plays
       full games against earlier copies of itself and is rewarded only by the final result &mdash;
       $z_t = +1$ for a win, $-1$ for a loss. The update is the <b>policy-gradient</b> rule, Eq (2):
       $\\Delta\\rho \\propto (\\partial \\log p_\\rho(a_t \\,|\\, s_t) / \\partial \\rho)\\, z_t$. In words: after a
       win, push up the probability of the moves you played; after a loss, push them down. This optimises for
       <i>winning</i> rather than for imitating humans. It won more than 80% of games against $p_\\sigma$, and
       85% against the strong open-source program <i>Pachi</i> using no search at all (&sect;2).</p>
       <p><b>4. The value network $v_\\theta$ (&sect;3).</b> A <b>value network</b> takes a board $s$ and outputs a
       single number $v_\\theta(s)$: an estimate of the expected game outcome from $s$ &mdash; roughly, the
       probability the current player wins. It has the same convolutional body as the policy network but ends in
       one scalar instead of a probability map. It is trained by <b>regression</b> (Eq 4) to match the actual
       outcome $z$ of self-play games &mdash; minimising squared error. Training on full games caused
       overfitting (positions in one game share the same outcome and are nearly identical), so the authors built
       a dataset of 30 million <i>distinct</i> positions, each from a separate self-play game; this cut the
       test-set mean squared error from 0.37 to 0.234 (&sect;3). One forward pass of $v_\\theta$ approached the
       accuracy of a full rollout "but using 15,000 times less computation" (&sect;3).</p>
       <p><b>5. The search: Monte Carlo Tree Search (&sect;4, Figure 3).</b> <b>Monte Carlo Tree Search (MCTS)</b>
       is a planning method that grows a search tree by running many <b>simulations</b>, each a path from the
       current board down to a leaf. Each tree edge $(s,a)$ &mdash; a move $a$ from a board $s$ &mdash; stores
       three numbers: an action value $Q(s,a)$ (how good the move looks so far), a visit count $N(s,a)$ (how many
       simulations used it), and a prior $P(s,a)$ (the policy network's probability for it). One simulation has
       four steps:</p>
       <ul>
        <li><b>Select</b> &mdash; descend the tree, at each node picking the move that maximises $Q + u$
        (Eq 5, below).</li>
        <li><b>Expand</b> &mdash; on reaching a new leaf $s_L$, run the SL policy network once and store its
        output as the priors $P(s_L, a) = p_\\sigma(a \\,|\\, s_L)$ for the leaf's moves.</li>
        <li><b>Evaluate</b> &mdash; score the leaf two ways and blend them (Eq 6): the value network
        $v_\\theta(s_L)$, and the outcome $z_L$ of a fast <b>rollout</b> (playing the game to the end with the
        quick policy $p_\\pi$).</li>
        <li><b>Back up</b> &mdash; add this leaf evaluation to every edge on the path, updating their $N$ (Eq 7)
        and $Q$ (Eq 8).</li>
       </ul>
       <p>After all simulations, AlphaGo "chooses the most visited move from the root" (&sect;4) &mdash; not the
       highest-valued one. The most-visited move is the one the search kept returning to, which is the robust
       choice. Interestingly, the paper found the <i>SL</i> policy $p_\\sigma$ gave better search priors than the
       stronger RL policy $p_\\rho$, "presumably because humans select a diverse beam of promising moves" (&sect;4),
       while the value network derived from the RL policy was the better evaluator.</p>`,
    symbols: [
      { sym: "$s$", desc: "a <b>state</b> &mdash; a board position. $s_t$ is the position at step $t$ of a simulation; $s_L$ is the <b>leaf</b> position where a simulation stops growing the tree." },
      { sym: "$a$", desc: "an <b>action</b> &mdash; a legal move (where to place a stone). An <b>edge</b> $(s,a)$ in the tree is the move $a$ taken from board $s$." },
      { sym: "$p_\\sigma(a \\,|\\, s)$", desc: "the <b>supervised-learning (SL) policy network</b>: a deep convolutional network giving a probability for each move $a$ in board $s$, trained to copy human expert moves. $\\sigma$ are its weights." },
      { sym: "$p_\\pi(a \\,|\\, s)$", desc: "the <b>fast rollout policy</b>: a small, fast, weaker policy used to play games to the end quickly inside the search. $\\pi$ are its weights." },
      { sym: "$p_\\rho(a \\,|\\, s)$", desc: "the <b>reinforcement-learning (RL) policy network</b>: same shape as $p_\\sigma$ but improved by self-play to win games. $\\rho$ are its weights, started at $\\rho = \\sigma$." },
      { sym: "$v_\\theta(s)$", desc: "the <b>value network</b>: a deep network that outputs one number estimating the game outcome (who wins) from board $s$. $\\theta$ are its weights." },
      { sym: "$z,\\ z_t,\\ z_L$", desc: "a game <b>outcome</b> from the current player's view: $+1$ for a win, $-1$ for a loss. $z_t$ is the terminal reward seen at step $t$; $z_L$ is the result of the rollout from leaf $s_L$." },
      { sym: "$Q(s,a)$", desc: "the <b>action value</b> of edge $(s,a)$ &mdash; the mean leaf evaluation over all simulations that passed through it (Eq 8). The search's current estimate of how good move $a$ is from $s$." },
      { sym: "$N(s,a)$", desc: "the <b>visit count</b> of edge $(s,a)$ &mdash; how many simulations have used that move (Eq 7). The final move is the one with the largest $N$ at the root." },
      { sym: "$P(s,a)$", desc: "the <b>prior probability</b> of edge $(s,a)$ &mdash; the SL policy network's probability for that move, $P(s,a) = p_\\sigma(a \\,|\\, s)$, stored when the leaf is first expanded." },
      { sym: "$u(s,a)$", desc: "the <b>exploration bonus</b>: $u(s,a) \\propto P(s,a) / (1 + N(s,a))$. It is large for high-prior, rarely-visited moves and shrinks as $N$ grows &mdash; this is the <b>PUCT</b> rule (Predictor + Upper Confidence bound applied to Trees)." },
      { sym: "$V(s_L)$", desc: "the <b>leaf evaluation</b>: a blend of the value network and a rollout, $V(s_L) = (1-\\lambda)\\,v_\\theta(s_L) + \\lambda\\, z_L$ (Eq 6)." },
      { sym: "$\\lambda$", desc: "the <b>mixing parameter</b> in $[0,1]$ that blends value network ($\\lambda = 0$) and rollout ($\\lambda = 1$). The best results used $\\lambda = 0.5$ (&sect;5)." },
      { sym: "“rollout”", desc: "a plain term: playing a game from a position to the end quickly (here with $p_\\pi$) and using who won as a rough score for that position." },
      { sym: "“MCTS”", desc: "<b>Monte Carlo Tree Search</b> &mdash; a planning method that grows a tree by running many simulated games, concentrating its effort on promising moves." }
    ],
    formula: `$$ a_t = \\arg\\max_a \\big( Q(s_t,a) + u(s_t,a) \\big), \\qquad u(s,a) \\propto \\frac{P(s,a)}{1 + N(s,a)} \\;\\text{(Eq 5)} $$ $$ V(s_L) = (1-\\lambda)\\, v_\\theta(s_L) + \\lambda\\, z_L \\;\\text{(Eq 6)} $$ $$ N(s,a) = \\sum_{i=1}^{n} \\mathbf{1}(s,a,i), \\qquad Q(s,a) = \\frac{1}{N(s,a)} \\sum_{i=1}^{n} \\mathbf{1}(s,a,i)\\, V(s_L^i) \\;\\text{(Eqs 7, 8)} $$`,
    whatItDoes:
      `<p><b>Eq (5) is the selection rule</b> &mdash; how each simulation decides which move to follow. It picks
       the move with the largest $Q + u$. The first term $Q$ is exploitation: favour moves that have looked good.
       The second term $u \\propto P / (1 + N)$ is exploration: favour moves the policy network likes ($P$ high)
       and that have been tried little ($N$ small). The $1 + N$ in the denominator is the key: each time you
       visit a move, its bonus shrinks, so the search is pushed to try alternatives. Early on, when all $N$ are
       small, the policy prior $P$ steers the choice; later, as $N$ grows, the bonus fades and the measured value
       $Q$ takes over. That is the exploration-then-exploitation behaviour you predicted.</p>
       <p><b>Eq (6) is the leaf evaluation.</b> When a simulation reaches a fresh leaf, it scores it by blending
       two independent estimates of who will win: the value network's instant guess $v_\\theta(s_L)$ and a fast
       played-out rollout's result $z_L$. The blend ($\\lambda = 0.5$) was better than either alone (&sect;5),
       because the two err differently &mdash; the value network is fast but approximate, the rollout is slower
       but grounded in an actual finished game.</p>
       <p><b>Eqs (7) and (8) are the back-up.</b> After scoring the leaf, every edge on the path records one more
       visit ($N$, Eq 7) and folds the new leaf value into its running mean ($Q$, Eq 8). So $Q(s,a)$ is just the
       average of all leaf evaluations seen below that move. Over many simulations, good moves accumulate visits
       and a reliable $Q$; the most-visited root move is the final choice.</p>`,
    derivation:
      `<p>This paper does not derive a new theorem; it engineers a system. So "why it is true" means "why each
       equation has the form it does" &mdash; the reasoning you can check.</p>
       <p><b>Why Eq (1) is maximum likelihood.</b> Supervised learning wants the network to assign high
       probability to the move a human actually made. The natural objective is to maximise the log-probability
       $\\log p_\\sigma(a \\,|\\, s)$ of that move, summed over the data. Gradient ascent on it gives exactly
       $\\Delta\\sigma \\propto \\partial \\log p_\\sigma(a \\,|\\, s) / \\partial \\sigma$ &mdash; Eq (1). This is the
       same cross-entropy gradient used to train any classifier, with the &ldquo;class&rdquo; being the expert's
       move.</p>
       <p><b>Why Eq (2) is the policy gradient.</b> In self-play there is no expert move to copy &mdash; only the
       final result $z_t$. The policy-gradient theorem says: to increase expected reward, nudge each action's
       log-probability in proportion to the reward that followed it,
       $\\Delta\\rho \\propto (\\partial \\log p_\\rho(a_t \\,|\\, s_t) / \\partial \\rho)\\, z_t$ &mdash; Eq (2). With
       $z_t = +1$ for a win, winning moves get pushed up; with $z_t = -1$ for a loss, losing moves get pushed
       down. (The prerequisite lesson on policy gradients derives this; here we just apply it.)</p>
       <p><b>Why Eq (5) balances exploration and exploitation.</b> A pure greedy search (pick highest $Q$) would
       never re-examine a move it once judged poorly &mdash; an early unlucky rollout could bury a good move
       forever. The bonus $u \\propto P / (1 + N)$ fixes this: it is large when $N$ is small, guaranteeing
       under-tried moves get attention, and it is weighted by the policy prior $P$ so the search starts from the
       network's hunch about which moves matter. As $N(s,a) \\to$ large, $u \\to 0$ and the choice is governed by
       $Q$ alone &mdash; the estimate the search now trusts. This is the &ldquo;PUCT&rdquo; rule, a policy-guided
       variant of the classic upper-confidence-bound idea for trees.</p>
       <p><b>Why Eq (8) is a running mean.</b> $Q(s,a)$ should estimate the expected outcome below move $a$. The
       unbiased estimate from $N$ samples is their average, $\\frac{1}{N}\\sum V(s_L^i)$ over the simulations that
       passed through that edge &mdash; exactly Eq (8). More simulations through an edge means a tighter estimate,
       which is why visit count and value-reliability rise together.</p>`,
    example:
      `<p>Work the selection rule (Eq 5) on a single node with three child moves. The bonus is
       $u = c \\cdot P / (1 + N)$ with exploration constant $c = 1.5$. Each move stores its current value $Q$, its
       policy prior $P$, and its visit count $N$.</p>
       <ul class="steps">
        <li><b>Move A &mdash; $Q = 0.60$, $P = 0.20$, $N = 8$.</b> Bonus
        $u_A = 1.5 \\times 0.20 / (1 + 8) = 0.30 / 9 = 0.0333$. Score $Q + u = 0.60 + 0.0333 = 0.6333$. A has been
        visited a lot, so its bonus is small &mdash; but its proven value is high.</li>
        <li><b>Move B &mdash; $Q = 0.10$, $P = 0.50$, $N = 1$.</b> Bonus
        $u_B = 1.5 \\times 0.50 / (1 + 1) = 0.75 / 2 = 0.3750$. Score $Q + u = 0.10 + 0.3750 = 0.4750$. B has the
        biggest prior and a big bonus (few visits), but its measured value is low so far.</li>
        <li><b>Move C &mdash; $Q = 0.20$, $P = 0.30$, $N = 3$.</b> Bonus
        $u_C = 1.5 \\times 0.30 / (1 + 3) = 0.45 / 4 = 0.1125$. Score $Q + u = 0.20 + 0.1125 = 0.3125$.</li>
        <li><b>Select the $\\arg\\max$.</b> Scores are $A = 0.6333$, $B = 0.4750$, $C = 0.3125$. The search picks
        <b>move A</b>. Even though B has the highest policy prior, A's strong proven value $Q$ wins. Had B been
        visited 8 times like A, its bonus would shrink to $1.5 \\times 0.50 / 9 = 0.0833$ and its score to
        $0.183$ &mdash; the bonus only buys the high-prior move early attention, not permanent priority.</li>
       </ul>
       <p>The CODEVIZ recomputes these exact numbers in code, then runs a tiny MCTS that repeats this selection
       many times so you can watch the visit counts pile onto the best move &mdash; our own small illustration,
       not the paper's results.</p>`,
    recipe:
      `<p>This is a read-only paper, so there is no single model to assemble. Here is the AlphaGo pipeline as
       numbered steps &mdash; the recipe the paper follows (&sect;1&ndash;4, Figure 1 and Figure 3):</p>
       <ol>
        <li><b>Train the SL policy $p_\\sigma$</b> by supervised learning on 30M human expert positions
        (Eq 1) &mdash; a network that imitates good moves.</li>
        <li><b>Train the fast rollout policy $p_\\pi$</b> &mdash; a small, fast, weaker move predictor for
        playing games out quickly.</li>
        <li><b>Train the RL policy $p_\\rho$</b> from $p_\\sigma$'s weights by self-play policy gradient (Eq 2)
        &mdash; optimise for winning, not imitating.</li>
        <li><b>Generate self-play data</b> with $p_\\rho$ (30M distinct positions, one per game) and <b>train the
        value network $v_\\theta$</b> by regression on game outcomes (Eq 4).</li>
        <li><b>Run MCTS</b> at play time. Each simulation: <b>select</b> moves by $\\arg\\max(Q+u)$ (Eq 5);
        <b>expand</b> a new leaf and store priors from $p_\\sigma$; <b>evaluate</b> the leaf by blending
        $v_\\theta$ and a $p_\\pi$ rollout (Eq 6, $\\lambda = 0.5$); <b>back up</b> the result to update $N$ and
        $Q$ (Eqs 7&ndash;8).</li>
        <li><b>Play the most-visited root move</b> (largest $N(s,a)$) after the simulation budget is spent.</li>
       </ol>`,
    results:
      `<p><b>From the abstract (quoted):</b> "Using this search algorithm, our program <i>AlphaGo</i> achieved a
       99.8% winning rate against other Go programs, and defeated the European Go champion by 5 games to 0. This
       is the first time that a computer program has defeated a human professional player in the full-sized game
       of Go, a feat previously thought to be at least a decade away."</p>
       <p><b>Tournament (quoted, &sect;5):</b> single-machine AlphaGo was "winning 494 out of 495 games (99.8%)
       against other Go programs" (against <i>Crazy Stone</i>, <i>Zen</i>, <i>Pachi</i>, <i>Fuego</i>,
       <i>GnuGo</i>; 5 seconds per move). The distributed version won 77% of games against the single-machine
       version and 100% against other programs.</p>
       <p><b>The mixing parameter (quoted, &sect;5):</b> evaluating with value network only ($\\lambda = 0$) or
       rollouts only ($\\lambda = 1$) each beat all other programs, but "the mixed evaluation ($\\lambda = 0.5$)
       performed best, winning $\\geq 95\\%$ against other variants."</p>
       <p><b>The Fan Hui match (quoted, &sect;5):</b> against Fan Hui, "a professional 2 dan, and the winner of the
       2013, 2014 and 2015 European Go championships&hellip; AlphaGo won the match 5 games to 0." Played 5&ndash;9
       October 2015.</p>
       <p><b>Network strength (quoted, &sect;1&ndash;3):</b> the SL policy network reached 57.0% move-prediction
       accuracy (55.7% from raw board), versus 44.4% prior state of the art; the RL policy "won 85% of games
       against <i>Pachi</i>" using no search; the value network reached test MSE 0.234 on self-play data.</p>
       <p><i>All numbers above are the paper's own, transcribed from the abstract and &sect;1&ndash;5. Every number
       in the CODEVIZ panel below comes from a tiny toy MCTS we ran ourselves &mdash; it is an illustration of how
       visit counts concentrate, not any AlphaGo result.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only</b> paper: AlphaGo is a large engineered system &mdash; four trained networks, a
       19&times;19 Go engine, and an asynchronous multi-machine search (the final version used 40 search threads,
       48 CPUs, 8 GPUs; the distributed version 1202 CPUs and 176 GPUs, &sect;4). There is no small primitive to
       rebuild and no single training run to reproduce on a laptop. What you <i>do</i> instead is <b>understand
       and trace</b> the algorithm: how the four networks are trained, and how one MCTS simulation flows through
       select &rarr; expand &rarr; evaluate &rarr; back up using Eqs (5)&ndash;(8).</p>
       <p>The code below is a tiny <b>conceptual illustration</b>, clearly labelled as ours. It (1) recomputes the
       worked PUCT example exactly, and (2) runs a toy MCTS on a one-move &ldquo;game&rdquo; with three candidate
       moves of differing hidden quality, and shows the visit count concentrating on the best move &mdash; the
       same select/evaluate/back-up loop AlphaGo uses, on a problem small enough to run in well under a second.
       It uses made-up numbers; it is <b>not</b> Go, and not any AlphaGo measurement.</p>`,
    pitfalls:
      `<ul>
        <li><b>Confusing the two policy networks' roles.</b> $p_\\sigma$ (supervised) supplies the search
        <i>priors</i> $P$ and is more accurate at predicting human moves; $p_\\rho$ (reinforcement) is the
        stronger <i>player</i> and is used to generate the value network's training data. The paper found
        $p_\\sigma$ gave better search priors than the stronger $p_\\rho$ (&sect;4). <b>Fix:</b> remember the SL
        net seeds the search, the RL net feeds the value net.</li>
        <li><b>Thinking AlphaGo plays the highest-value move.</b> It plays the <b>most-visited</b> root move
        (largest $N$), not the largest $Q$ (&sect;4). The visit count is the robust signal &mdash; a high $Q$ from
        one lucky rollout is not trusted until many simulations confirm it.</li>
        <li><b>Reading $u$ as a fixed exploration term.</b> The bonus $u \\propto P/(1+N)$ <i>decays</i> with
        visits. It dominates early (small $N$) and vanishes late, so the same edge is governed by $P$ first and
        $Q$ later. <b>Fix:</b> always read the $1 + N$ denominator as a built-in exploration schedule.</li>
        <li><b>Assuming the value network alone, or rollouts alone, is enough.</b> The best results used the
        <i>blend</i> $\\lambda = 0.5$ (&sect;5). Treating evaluation as value-network-only ($\\lambda = 0$) or
        rollout-only ($\\lambda = 1$) is weaker. <b>Fix:</b> evaluate leaves by the mix in Eq (6).</li>
        <li><b>Overfitting the value network on full games.</b> Training $v_\\theta$ on positions from complete
        games made it memorise outcomes (test MSE 0.37) because nearby positions share one label. <b>Fix:</b> as
        the paper did, use one position per game (30M distinct), dropping test MSE to 0.234 (&sect;3).</li>
      </ul>`,
    recall: [
      "Name AlphaGo's four networks and say, in one phrase each, what each does.",
      "Write the MCTS selection rule (Eq 5) and the bonus $u(s,a)$ from memory. What does the $1 + N$ do?",
      "What two estimates does Eq (6) blend to evaluate a leaf, and what is $\\lambda$ at its best setting?",
      "Which move does AlphaGo finally play from the root &mdash; highest $Q$ or highest $N$? Why?",
      "How is the SL policy network trained (Eq 1) versus the RL policy network (Eq 2)?"
    ],
    practice: [
      {
        q: `<b>One PUCT selection step.</b> A node has two moves. Move X: $Q = 0.55$, $P = 0.30$, $N = 9$.
            Move Y: $Q = 0.40$, $P = 0.60$, $N = 1$. Use $u = c\\,P/(1+N)$ with $c = 1.0$. (a) Which move does
            Eq (5) select? (b) After the search visits the chosen move once more, recompute its bonus and say
            whether the selection could flip.`,
        steps: [
          { do: `Compute $u_X = 1.0 \\times 0.30 / (1+9) = 0.030$, so $Q+u = 0.55 + 0.030 = 0.580$.`, why: `Eq (5) scores each move by its action value plus the decaying prior bonus.` },
          { do: `Compute $u_Y = 1.0 \\times 0.60 / (1+1) = 0.300$, so $Q+u = 0.40 + 0.300 = 0.700$.`, why: `Y has a high prior $P$ and only one visit, so its bonus is large.` },
          { do: `Select the larger: $0.700 > 0.580$, so the search picks <b>Y</b>. After visiting Y once more, $N_Y = 2$, so $u_Y = 0.60/3 = 0.200$ and its score drops to $0.600$ &mdash; still above X's $0.580$, but closer.`, why: `Each visit shrinks the bonus, so a high-prior move loses its edge as it is explored; eventually $Q$ decides.` }
        ],
        answer: `<p>(a) Move <b>Y</b> wins this step: $Q+u = 0.700$ versus X's $0.580$, because Y's large prior and
                 single visit give it a big exploration bonus. (b) After one more visit to Y, $N_Y = 2$ and its
                 score falls to $0.40 + 0.60/3 = 0.600$ &mdash; still ahead of X ($0.580$), but the gap has
                 nearly closed. A few more visits to Y (or a low value found below it) would let X overtake. This
                 is the bonus decaying as $1/(1+N)$: exploration first, exploitation later.</p>`
      },
      {
        q: `<b>Blending the leaf evaluation.</b> A leaf has value-network estimate $v_\\theta(s_L) = 0.8$ (a win
            looks likely) and a rollout result $z_L = -1$ (the quick played-out game was lost). Using Eq (6),
            compute the leaf evaluation $V(s_L)$ for $\\lambda = 0$, $\\lambda = 0.5$, and $\\lambda = 1$. Which
            does AlphaGo use, and what does the disagreement tell you?`,
        steps: [
          { do: `$\\lambda = 0$: $V = (1-0)(0.8) + 0(-1) = 0.8$ &mdash; trust the value network only.`, why: `At $\\lambda = 0$ the rollout is ignored; Eq (6) reduces to $v_\\theta$.` },
          { do: `$\\lambda = 1$: $V = (1-1)(0.8) + 1(-1) = -1$ &mdash; trust the rollout only.`, why: `At $\\lambda = 1$ the value network is ignored; Eq (6) reduces to $z_L$.` },
          { do: `$\\lambda = 0.5$: $V = 0.5(0.8) + 0.5(-1) = 0.4 - 0.5 = -0.1$ &mdash; the blend AlphaGo uses.`, why: `The mixed evaluation ($\\lambda = 0.5$) performed best (&sect;5); it averages two error-prone signals.` }
        ],
        answer: `<p>$V = 0.8$ ($\\lambda=0$), $V = -0.1$ ($\\lambda=0.5$), $V = -1$ ($\\lambda=1$). AlphaGo uses
                 the blend $\\lambda = 0.5$, giving $-0.1$ &mdash; a cautious near-even score. The disagreement
                 (the value net likes the position, the rollout lost) is exactly why the blend helps: the two
                 estimators err in different ways, and averaging them is more reliable than either alone. The
                 paper reports $\\lambda = 0.5$ winning $\\geq 95\\%$ against the value-only and rollout-only
                 variants (&sect;5).</p>`
      },
      {
        q: `<b>Ablation &mdash; remove the policy prior.</b> Suppose you set every prior $P(s,a)$ equal (a uniform
            policy), so the policy network no longer guides the search, while keeping everything else (value net,
            rollouts, back-up). Predict what happens to the search's efficiency and to AlphaGo's strength, and
            tie it to a number in the paper.`,
        steps: [
          { do: `In Eq (5), the bonus $u \\propto P/(1+N)$ now has the same $P$ for every move, so early
                 selection is driven only by visit counts &mdash; the search no longer focuses on the moves a
                 strong player would consider.`, why: `The policy prior is what narrows the breadth of the search to promising moves; removing it makes the search spread effort over all legal moves.` },
          { do: `With ~250 legal moves in Go and a fixed simulation budget, each move gets far fewer simulations,
                 so $Q$ estimates are noisier and the most-visited move is less reliable.`, why: `Breadth reduction is half of AlphaGo's design (&sect;intro); without it the tree is too wide to evaluate well in the time given.` },
          { do: `The paper's own evidence: the policy-network strength tracks playing strength tightly &mdash;
                 "small improvements in accuracy led to large improvements in playing strength" (&sect;1,
                 Figure 2a). A uniform (useless) policy is the extreme of low accuracy, so strength should fall
                 sharply.`, why: `Figure 2a shows AlphaGo's win rate rising with the policy network's prediction accuracy, so degrading the policy to uniform predicts a large strength drop.` }
        ],
        answer: `<p>The search loses its move-selection guidance: every move starts with the same bonus, so
                 simulations spread thinly across all ~250 legal moves instead of concentrating on the handful a
                 strong player would weigh. Visit counts and $Q$ estimates become noisy under a fixed budget, and
                 the most-visited move is less trustworthy &mdash; so AlphaGo gets substantially weaker. This
                 matches Figure 2a, where "small improvements in [policy] accuracy led to large improvements in
                 playing strength" (&sect;1): driving the policy to uniform is the worst case of low accuracy. The
                 policy network's job is breadth reduction; without it, the search cannot cover the tree well.</p>`
      }
    ]
  });

  window.CODE["paper-alphago"] = {
    lib: "NumPy",
    runnable: false,
    explain:
      `<p>This is a <b>read-only</b> paper, so there is no AlphaGo to train or verify. The snippet below is a tiny
       <b>conceptual illustration</b>, ours, of two things. (1) It recomputes the worked PUCT example exactly
       &mdash; the three-move node where Eq (5) selects move A. (2) It runs a toy MCTS on a one-move
       &ldquo;game&rdquo;: three candidate moves with different hidden win-probabilities, evaluated by noisy
       sampled rollouts and selected by AlphaGo's rule $a = \\arg\\max(Q + c\\,P/(1+N))$. We print how the visit
       counts concentrate on the best move &mdash; the same select &rarr; evaluate &rarr; back-up loop AlphaGo
       uses, on a trivially small problem. The numbers are made up; this is <b>not</b> Go and <b>not</b> any
       AlphaGo measurement. Pure NumPy, CPU, runs in well under a second.</p>`,
    code: `import numpy as np

# ---------------------------------------------------------------------------
# (1) WORKED EXAMPLE: one PUCT selection step (Eq 5). a = argmax(Q + u),
#     u = c * P / (1 + N).  Three child moves of one node.  c = 1.5.
# ---------------------------------------------------------------------------
c = 1.5
moves = ["A", "B", "C"]
Q = np.array([0.60, 0.10, 0.20])      # action values so far
P = np.array([0.20, 0.50, 0.30])      # policy-network priors (sum to 1)
N = np.array([8,    1,    3   ])      # visit counts

u = c * P / (1 + N)                   # exploration bonus (Eq 5)
score = Q + u
for m, q, p, n, ui, si in zip(moves, Q, P, N, u, score):
    print("%s: Q=%.2f P=%.2f N=%d  u=%.4f  Q+u=%.4f" % (m, q, p, n, ui, si))
print("argmax (Eq 5 selects) ->", moves[int(np.argmax(score))])
# A: Q=0.60 P=0.20 N=8  u=0.0333  Q+u=0.6333
# B: Q=0.10 P=0.50 N=1  u=0.3750  Q+u=0.4750
# C: Q=0.20 P=0.30 N=3  u=0.1125  Q+u=0.3125
# argmax (Eq 5 selects) -> A      (A's proven value beats B's high prior)

# ---------------------------------------------------------------------------
# (2) TOY MCTS: a one-move "game" with three moves of differing hidden quality.
#     We "expand" all children once (a few warm-start visits so Q is defined),
#     then repeatedly: select by argmax(Q + c*P/(1+N)); EVALUATE the leaf by a
#     noisy rollout ~ Bernoulli(true win-prob); BACK UP (update N and Q).
#     Watch the visit count concentrate on the best move. OUR illustration --
#     made-up numbers, NOT Go and NOT any AlphaGo result.
# ---------------------------------------------------------------------------
rng = np.random.default_rng(0)
prior   = np.array([0.40, 0.35, 0.25])      # policy prior P
truewin = np.array([0.62, 0.52, 0.45])      # hidden true win-prob (A best, B close)
c2 = 1.2
N2 = np.zeros(3); W2 = np.zeros(3)          # visits and total wins per move

for a in range(3):                          # warm start: expand each child 5x
    for _ in range(5):
        W2[a] += rng.binomial(1, truewin[a]); N2[a] += 1

for i in range(1, 121):                     # 120 guided simulations
    Qhat = W2 / N2                          # mean leaf value so far (Eq 8)
    u2 = c2 * prior / (1 + N2)              # bonus (Eq 5)
    a = int(np.argmax(Qhat + u2))           # SELECT
    W2[a] += rng.binomial(1, truewin[a])    # EVALUATE leaf (noisy rollout)
    N2[a] += 1                              # BACK UP visit count (Eq 7)
    if i in (10, 40, 80, 120):
        print("after %3d sims  visits =" % i, N2.astype(int).tolist())

print("final Q =", [round(W2[k] / N2[k], 3) for k in range(3)])
print("chosen (most visited) move:", moves[int(np.argmax(N2))])
# after  10 sims  visits = [10, 5, 10]
# after  40 sims  visits = [38, 5, 12]
# after  80 sims  visits = [78, 5, 12]
# after 120 sims  visits = [118, 5, 12]
# final Q = [0.669, 0.4, 0.5]
# chosen (most visited) move: A
# Visit counts pile onto move A (the best), as AlphaGo plays the most-visited
# root move. Toy numbers, OUR illustration -- NOT Go, NOT an AlphaGo result.`
  };

  window.CODEVIZ["paper-alphago"] = {
    question: "AlphaGo's MCTS selects moves by argmax(Q + u), u ~ P/(1+N), and finally plays the MOST-VISITED move. If we run a tiny MCTS on a toy one-move game where move A is best, do the visit counts concentrate on A as simulations accumulate?",
    charts: [
      {
        type: "line",
        title: "Toy MCTS visit counts concentrating on the best move (OUR illustration, not an AlphaGo result)",
        xlabel: "number of guided simulations",
        ylabel: "visit count N(move)",
        series: [
          {
            name: "move A (best, true win-prob 0.62)",
            color: "#7ee787",
            points: [[10,10],[40,38],[80,78],[120,118]]
          },
          {
            name: "move B (true win-prob 0.52)",
            color: "#ff7b72",
            points: [[10,5],[40,5],[80,5],[120,5]]
          },
          {
            name: "move C (true win-prob 0.45)",
            color: "#79c0ff",
            points: [[10,10],[40,12],[80,12],[120,12]]
          }
        ]
      }
    ],
    caption: "OUR illustration of MCTS visit concentration, NOT an AlphaGo measurement and NOT the game of Go. A toy one-move game has three moves with hidden true win-probabilities A=0.62 (best), B=0.52, C=0.45. After expanding each child 5 times, we run 120 simulations of AlphaGo's loop: SELECT by argmax(Q + 1.2*P/(1+N)), EVALUATE the leaf by a noisy Bernoulli rollout, BACK UP the visit count and mean value (Eqs 5, 7, 8). The visit count piles onto the best move A (118 of 135 total visits, ~87%) while B and C keep only a few exploratory visits -- so the most-visited move (which AlphaGo plays) is the best one. The recovered mean values were Q = [0.669, 0.4, 0.5], close to the hidden truths. Made-up numbers, fixed seed (0); the real AlphaGo searched a 19x19 Go tree with the SL policy net supplying priors and the value net plus fast rollouts evaluating leaves.",
    code: `import numpy as np
rng = np.random.default_rng(0)

# Toy one-move game: three moves, hidden true win-probs (A best). OUR illustration.
prior   = np.array([0.40, 0.35, 0.25])    # policy prior P (the "policy network")
truewin = np.array([0.62, 0.52, 0.45])    # hidden true win-prob revealed by rollouts
c = 1.2
N = np.zeros(3); W = np.zeros(3)          # visits, total wins

for a in range(3):                        # warm start: expand each child 5x
    for _ in range(5):
        W[a] += rng.binomial(1, truewin[a]); N[a] += 1

snaps = {}
for i in range(1, 121):                   # 120 guided MCTS simulations
    Qhat = W / N                          # mean leaf value (Eq 8)
    u = c * prior / (1 + N)               # exploration bonus (Eq 5)
    a = int(np.argmax(Qhat + u))          # SELECT argmax(Q + u)
    W[a] += rng.binomial(1, truewin[a])   # EVALUATE leaf (noisy rollout)
    N[a] += 1                             # BACK UP (Eq 7)
    if i in (10, 40, 80, 120):
        snaps[i] = N.astype(int).tolist()

for i in (10, 40, 80, 120):
    print("after %3d sims  visits =" % i, snaps[i])
print("final Q =", [round(W[k] / N[k], 3) for k in range(3)])
print("total visits =", int(N.sum()), " most-visited move index:", int(np.argmax(N)))
# after  10 sims  visits = [10, 5, 10]
# after  40 sims  visits = [38, 5, 12]
# after  80 sims  visits = [78, 5, 12]
# after 120 sims  visits = [118, 5, 12]
# final Q = [0.669, 0.4, 0.5]
# total visits = 135  most-visited move index: 0   (move A, the best)
# Visit counts concentrate on the best move. OUR toy run, NOT Go, NOT AlphaGo's numbers.`
  };
})();
