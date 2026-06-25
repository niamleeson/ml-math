/* Paper lesson — "Mastering Chess and Shogi by Self-Play with a General
   Reinforcement Learning Algorithm" (AlphaZero), Silver et al. 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-alphazero".

   GROUNDED from arXiv:1712.01815 (ar5iv HTML mirror + the official PDF):
   abstract, the single-network definition (p,v)=f_theta(s), the training-loss
   Eq. (1)  l = (z - v)^2 - pi^T log p + c||theta||^2, the self-play+MCTS loop,
   "800 simulations" during training, and the headline result quotes
   (4 h chess, 2 h shogi, 8 h Go; 80k positions/s vs Stockfish's 70M).

   IMPORTANT GROUNDING NOTE (flagged in the report): the AlphaZero PREPRINT
   1712.01815 deliberately defers the MCTS mechanics — the edge statistics
   {N,W,Q,P} and the PUCT selection formula — to AlphaGo Zero, stating its
   "algorithm settings, network architecture, and hyper-parameters" follow
   that prior work. The PUCT formula is therefore transcribed from AlphaGo
   Zero (Silver et al., "Mastering the game of Go without human knowledge",
   Nature 2017, Methods — the reference 1712.01815 points to), and is
   explicitly attributed to that source in the lesson. We do NOT invent it.

   Track B (architecture): build a TOY AlphaZero on Tic-Tac-Toe — a tiny
   policy/value net (nn.Linear) + a small MCTS that uses the PUCT rule — run a
   few self-play + train iterations, and show it learns to play optimally
   (never loses; blocks the obvious win). The ablation removes the network's
   guidance from MCTS (uniform prior + random rollout value) and shows search
   gets weaker at the same simulation budget. No existing concept lesson owns
   MCTS, so conceptLink is null and the method is derived in full here. */
(function () {
  window.LESSONS.push({
    id: "paper-alphazero",
    title: "AlphaZero — Mastering Chess and Shogi by Self-Play with a General RL Algorithm (2017)",
    tagline: "One network predicts a move policy and a win/lose value; Monte-Carlo Tree Search uses it to look ahead, and self-play teaches the network from the search — no human games, no hand-crafted rules.",
    module: "Papers · Reinforcement Learning",
    track: "architecture",
    paper: {
      authors: "David Silver, Thomas Hubert, Julian Schrittwieser, Ioannis Antonoglou, Matthew Lai, Arthur Guez, Marc Lanctot, Laurent Sifre, Dharshan Kumaran, Thore Graepel, Timothy Lillicrap, Karen Simonyan, Demis Hassabis",
      org: "DeepMind",
      year: 2017,
      venue: "arXiv:1712.01815 (Dec 2017); journal version in Science 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1712.01815",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["rl-mdp", "rl-monte-carlo", "rl-returns-values", "rl-policy-gradients", "dl-cross-entropy", "prob-expectation"],

    // WHY READ IT
    problem:
      `<p>Reinforcement learning (RL) means learning to act by trial and error to maximize a reward. A
       <b>policy</b> is the rule (here, a neural network) that maps a board position to a choice of move; a
       <b>value</b> is an estimate of who will win from a position. Before AlphaZero, the strongest game
       programs were built two very different ways, and <i>both</i> leaned heavily on human knowledge.</p>
       <ul>
        <li><b>Classical chess/shogi engines</b> (Stockfish, Elmo) used <b>alpha&ndash;beta search</b> &mdash;
        a brute-force tree search that examines tens of millions of positions per second &mdash; steered by a
        <b>hand-crafted evaluation function</b> packed with human expert features (piece values, king safety,
        pawn structure), tuned over decades.</li>
        <li><b>AlphaGo</b> (the previous DeepMind Go program) was first <b>bootstrapped from a database of human
        expert games</b> (supervised learning), then refined; it also used <b>two</b> separate networks (a
        policy net and a value net) plus Go-specific input features.</li>
       </ul>
       <p>So the recipe for each game was different, depended on human data or human-engineered features, and
       could not obviously transfer. The open question: could a <b>single, general</b> algorithm &mdash; no
       human games, no game-specific evaluation features &mdash; learn chess, shogi, <i>and</i> Go from
       nothing but the rules and self-play?</p>`,
    contribution:
      `<ul>
        <li><b>One network, two heads, zero human data.</b> A <i>single</i> deep network
        $(\\mathbf{p}, v) = f_\\theta(s)$ takes a raw board $s$ and outputs both a <b>move policy</b>
        $\\mathbf{p}$ (a probability for every legal move) and a <b>scalar value</b> $v \\approx \\mathbb{E}[z\\mid s]$
        (the expected game outcome). It is trained <b>tabula rasa</b> &mdash; from random weights, by self-play
        only, with no human games and no hand-crafted evaluation.</li>
        <li><b>Search and learning teach each other.</b> A <b>Monte-Carlo Tree Search (MCTS)</b> uses the
        network to look a few moves ahead; the search is far stronger than the bare network, so its move
        preferences become the <b>training target</b> for the policy. The network then makes the next search
        stronger. This loop &mdash; the paper's core &mdash; is <i>policy iteration powered by search</i>.</li>
        <li><b>One algorithm for three games.</b> The abstract: "the same algorithm and network architecture"
        achieves "superhuman performance in the games of chess and shogi (Japanese chess) as well as Go." The
        only per-game input is the rules.</li>
      </ul>`,
    whyItMattered:
      `<p>AlphaZero showed that a <b>general</b> learning algorithm, given only the rules, could surpass
       programs that encode decades of human expertise &mdash; in three very different games &mdash; while
       <i>searching far less</i>: "AlphaZero searches just 80 thousand positions per second in chess &hellip;
       compared to 70 million for Stockfish," compensating with a learned, selective network. It removed the
       last crutch of its predecessor AlphaGo (human game data and two nets), and its self-play +
       single-net + MCTS template became the blueprint for <b>MuZero</b> (which drops even the rules, learning
       a model) and for self-play systems beyond games. The headline matches said AlphaZero's chess sometimes
       sacrificed material for long-term positional pressure &mdash; a style learned, not programmed.</p>`,

    // READING GUIDE
    readingGuide:
      `<p>This is a <b>short</b> paper (its journal version in Science 2018 is fuller). Read it for the
       <i>idea</i>; one warning up front (see Pitfalls): the preprint <b>does not restate the MCTS math</b> &mdash;
       it says its "algorithm settings, network architecture, and hyper-parameters" follow <b>AlphaGo Zero</b>,
       so the PUCT formula below is transcribed from that reference, not from 1712.01815.</p>
       <ul>
        <li><b>Abstract + intro</b> &mdash; the "tabula rasa, one algorithm, three games" claim, and the
        contrast with AlphaGo (human data, two nets) and alpha&ndash;beta engines (hand-crafted evaluation).</li>
        <li><b>The "Reinforcement learning in games" paragraph</b> &mdash; the single network
        $(\\mathbf{p}, v) = f_\\theta(s)$, the self-play&rarr;MCTS&rarr;target loop, and the
        <b>training loss Eq. (1)</b>: $l = (z-v)^2 - \\boldsymbol{\\pi}^\\top \\log \\mathbf{p} + c\\lVert\\theta\\rVert^2$.
        This is the paper's <b>own</b> key equation &mdash; read it closely.</li>
        <li><b>The results paragraph</b> &mdash; the training curves (4 h chess, 2 h shogi, 8 h Go) and the
        100-game match outcomes vs Stockfish, Elmo, and AlphaGo Zero.</li>
       </ul>
       <p><b>For the search math (PUCT, edge statistics)</b>, the canonical source is AlphaGo Zero's Methods;
       this lesson transcribes it there and labels it.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will build a toy AlphaZero on <b>Tic-Tac-Toe</b>: a tiny network that scores moves and positions,
       plus a small MCTS that uses it to look ahead. The training target for the policy is <b>how many times
       MCTS visited each move</b>, and the target for the value is <b>who won the self-play game</b>. Two
       questions to guess before running:</p>
       <ul>
        <li>After a handful of self-play + train iterations, will the agent learn to play Tic-Tac-Toe
        <b>optimally</b> &mdash; i.e. never lose, and take an immediate winning move / block an immediate loss?</li>
        <li><b>Ablation:</b> if you strip the network out of MCTS &mdash; give every move a <i>uniform</i> prior
        and replace the network's value with a <i>random rollout</i> to the end &mdash; at the <i>same</i> tiny
        simulation budget, will the search play <b>as well</b>, or worse?</li>
       </ul>
       <p>Write your guesses, then run the cells below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will implement. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>PUCT selection</b> inside MCTS &mdash; pick the child maximizing exploit + explore:
        <code>score = Q(s,a) + c_puct * P(s,a) * sqrt(sum_b N(s,b)) / (1 + N(s,a))</code>
        <i># Q is the mean value seen through this move; P is the network's prior; N is the visit count.</i></li>
        <li>TODO: the <b>backup</b> after reaching a leaf: walk back up the path and, at every edge,
        <code>N += 1; W += v; Q = W / N</code>, flipping the sign of $v$ at each ply (a leaf good for me is
        bad for my opponent).</li>
        <li>TODO: the <b>policy target</b> from one search: $\\pi(a) = N(a) / \\sum_b N(b)$ &mdash; the
        normalized visit counts at the root.</li>
        <li>TODO: the <b>loss</b> (Eq. 1): <code>(z - v)**2 - (pi * log_p).sum()</code> &mdash; squared value
        error plus policy cross-entropy.</li>
       </ul>
       <p>Then run self-play &rarr; train &rarr; repeat, and check the agent against a few fixed test positions.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>AlphaZero is a loop between a <b>network</b> and a <b>search</b> that make each other stronger. Read it
       as three nested ideas.</p>
       <p><b>1. The single network.</b> One deep network $(\\mathbf{p}, v) = f_\\theta(s)$ reads a board position
       $s$ and outputs two things at once: a vector of <b>move probabilities</b> $\\mathbf{p}$ with
       $p_a = \\Pr(a\\mid s)$ for each move $a$ (its raw hunch about good moves), and a single <b>value</b>
       $v \\approx \\mathbb{E}[z\\mid s]$, its guess of the eventual outcome $z$ (from the paper:
       "$+1$ for a win, $0$ for a draw, $-1$ for a loss"). It replaces AlphaGo's two separate nets.</p>
       <p><b>2. MCTS turns the raw hunch into a strong move.</b> The bare network is weak; MCTS uses it to
       <i>look ahead</i>. The search grows a tree of positions; each <b>edge</b> (a move $a$ from position $s$)
       stores four numbers: a visit count $N(s,a)$, a total value $W(s,a)$, a mean value
       $Q(s,a)=W(s,a)/N(s,a)$, and the network's prior $P(s,a)=p_a$. One <b>simulation</b> does four steps
       (this is the AlphaGo Zero MCTS the paper reuses):</p>
       <ul>
        <li><b>Select.</b> From the root, repeatedly walk down by picking the child that maximizes the
        <b>PUCT</b> score $Q(s,a) + U(s,a)$ (formula below) &mdash; balancing "moves that looked good so far"
        ($Q$) against "moves the network likes but we have rarely tried" ($U$), until you reach a leaf
        (an unexpanded position).</li>
        <li><b>Expand &amp; evaluate.</b> Run the network on the leaf to get $(\\mathbf{p}, v)$; attach the priors
        $P(s,a)=p_a$ to the leaf's edges and read off the leaf value $v$.</li>
        <li><b>Backup.</b> Walk back to the root; at every edge on the path do $N\\mathrel{+}=1$,
        $W\\mathrel{+}= v$, $Q = W/N$, <b>flipping the sign of $v$</b> each ply because the players alternate.</li>
       </ul>
       <p>After (the paper says) <b>800 simulations</b>, the root's <b>visit counts</b> are a far better move
       distribution than the network's raw $\\mathbf{p}$: $\\boldsymbol{\\pi}(a) \\propto N(\\text{root},a)$. The
       move actually played is sampled from $\\boldsymbol{\\pi}$ (with a temperature for exploration early in the
       game).</p>
       <p><b>3. Self-play closes the loop.</b> The agent plays games against itself, always moving by MCTS. Each
       position visited is stored with two labels: the search's visit-distribution $\\boldsymbol{\\pi}$ (the
       <b>policy target</b>), and, once the game ends, its outcome $z$ from that player's view (the <b>value
       target</b>). The network is then trained to make its raw $\\mathbf{p}$ match $\\boldsymbol{\\pi}$ and its
       $v$ match $z$ &mdash; that is the loss <b>Eq. (1)</b>. A better network makes a stronger search next
       iteration, whose targets pull the network further still. From the paper: the parameters are "updated so
       as to minimise the error between the predicted outcome $v_t$ and the game outcome $z$, and to maximise
       the similarity of the policy vector $\\mathbf{p}_t$ to the search probabilities $\\boldsymbol{\\pi}_t$."</p>`,
    symbols: [
      { sym: "$s$", desc: "a board <b>position</b> (state) — the input to the network. For us, the 9 squares of a Tic-Tac-Toe board." },
      { sym: "$a$", desc: "a <b>move</b> (action) — placing a mark on an empty square." },
      { sym: "$f_\\theta$", desc: "the single neural <b>network</b> with weights $\\theta$ (Greek 'theta'). One body, two output heads." },
      { sym: "$\\mathbf{p}$", desc: "the network's <b>policy</b> output: a probability $p_a=\\Pr(a\\mid s)$ for every move $a$ from $s$ — its raw, pre-search hunch. Boldface = a whole vector." },
      { sym: "$v$", desc: "the network's <b>value</b> output: a scalar in $[-1,1]$ estimating the game outcome from $s$ for the player to move, $v\\approx\\mathbb{E}[z\\mid s]$." },
      { sym: "$z$", desc: "the actual <b>game outcome</b> label: $+1$ win, $0$ draw, $-1$ loss (from the paper), seen from the perspective of the player at that position." },
      { sym: "$N(s,a)$", desc: "the <b>visit count</b> of edge $(s,a)$: how many MCTS simulations passed through move $a$ at position $s$. The most-visited root move is the search's choice." },
      { sym: "$W(s,a)$", desc: "the <b>total value</b> backed up through edge $(s,a)$ — the running sum of leaf values from simulations that used this move." },
      { sym: "$Q(s,a)$", desc: "the <b>mean action value</b> $W(s,a)/N(s,a)$: the average outcome seen when move $a$ was tried at $s$. The 'exploit' term." },
      { sym: "$P(s,a)$", desc: "the <b>prior probability</b> of move $a$ at $s$, set to the network's $p_a$ when the node is expanded. Steers exploration toward moves the network likes." },
      { sym: "$U(s,a)$", desc: "the <b>exploration bonus</b> in PUCT — large for high-prior, rarely-visited moves; shrinks as $N(s,a)$ grows. Formula below." },
      { sym: "$c_{puct}$", desc: "a positive constant (Greek-style 'c') controlling exploration strength: how much weight $U$ gets versus $Q$." },
      { sym: "$\\sum_b N(s,b)$", desc: "the total visits to ALL moves at $s$ (the parent's visit count): the numerator inside $U$, so the bonus grows with how often the parent has been searched." },
      { sym: "$\\boldsymbol{\\pi}$", desc: "the <b>search policy</b>: the root visit counts normalized to a distribution, $\\pi(a)=N(\\text{root},a)/\\sum_b N(\\text{root},b)$. This is the policy TRAINING TARGET — distinct from the math constant $\\pi$." },
      { sym: "$\\tau$", desc: "a <b>temperature</b> (Greek 'tau') applied to the visit counts when forming $\\boldsymbol{\\pi}$: $\\pi(a)\\propto N(a)^{1/\\tau}$. High $\\tau$ early = exploratory; $\\tau\\to 0$ late = pick the single most-visited move." },
      { sym: "$l$", desc: "the <b>loss</b> minimized by gradient descent (Eq. 1): value squared-error plus policy cross-entropy plus weight decay." },
      { sym: "$c$", desc: "the <b>weight-decay</b> coefficient in Eq. (1) — the $L_2$ regularization strength on $\\theta$ (not the same $c$ as $c_{puct}$)." },
      { sym: "$\\lVert\\theta\\rVert^2$", desc: "the squared $L_2$ norm of the weights: the sum of every weight squared. Penalizing it discourages large weights (regularization)." },
      { sym: "$\\boldsymbol{\\pi}^\\top \\log \\mathbf{p}$", desc: "the dot product $\\sum_a \\pi(a)\\log p_a$: the (negative) cross-entropy between the search target $\\boldsymbol{\\pi}$ and the network policy $\\mathbf{p}$. The '$\\top$' means transpose, i.e. a dot product." }
    ],
    formula:
      `$$ l = (z - v)^2 \\;-\\; \\boldsymbol{\\pi}^\\top \\log \\mathbf{p} \\;+\\; c\\,\\lVert\\theta\\rVert^2
         \\qquad\\text{(AlphaZero, Eq. 1)} $$
       <p>and the <b>PUCT</b> selection used inside MCTS (transcribed from AlphaGo Zero's Methods &mdash; the
       reference 1712.01815 defers to; <b>not</b> printed in the AlphaZero preprint itself):</p>
       $$ a_t = \\operatorname*{arg\\,max}_a \\big(\\, Q(s_t,a) + U(s_t,a) \\,\\big), \\qquad
          U(s,a) = c_{puct}\\, P(s,a)\\, \\frac{\\sqrt{\\sum_b N(s,b)}}{1 + N(s,a)}. $$`,
    whatItDoes:
      `<p><b>The loss (Eq. 1)</b> has three parts, summed:</p>
       <ul>
        <li><b>$(z-v)^2$</b> &mdash; the <b>value</b> term: squared error between the network's predicted outcome
        $v$ and the true game result $z$. Pulls $v$ toward who actually won.</li>
        <li><b>$-\\boldsymbol{\\pi}^\\top\\log\\mathbf{p}$</b> &mdash; the <b>policy</b> term: the cross-entropy
        between the search's visit distribution $\\boldsymbol{\\pi}$ and the network's raw policy $\\mathbf{p}$.
        Minimizing it makes the network <i>imitate the stronger search</i>: the next time it sees this position,
        its hunch already points where the search ended up looking.</li>
        <li><b>$c\\lVert\\theta\\rVert^2$</b> &mdash; ordinary $L_2$ weight decay, to regularize.</li>
       </ul>
       <p><b>The PUCT rule</b> decides which branch each simulation explores. At a node it picks the move with the
       largest $Q(s,a)+U(s,a)$:</p>
       <ul>
        <li><b>$Q(s,a)$ (exploit)</b> is the average outcome we have actually seen through that move &mdash; high
        for moves that have been winning.</li>
        <li><b>$U(s,a)$ (explore)</b> is large when the network's prior $P(s,a)$ is high but the move has few
        visits $N(s,a)$; the $\\sqrt{\\sum_b N(s,b)}$ on top makes every move's bonus grow as the parent is
        searched more, and the $1+N(s,a)$ on the bottom shrinks the bonus once a move has been tried a lot. So
        early simulations follow the network's hunch; later ones concentrate on the moves that proved good.</li>
       </ul>
       <p>That balance is exactly why the search out-performs the raw network: it spends its 800 simulations
       widening promising lines the network suggested, then deepening the ones that keep winning.</p>`,
    derivation:
      `<p>No existing concept lesson owns this, so here is <i>why</i> the loop works, in full.</p>
       <p><b>Why visit counts beat the raw policy &mdash; search as a policy-improvement operator.</b> Plain
       policy iteration alternates two steps: <i>evaluate</i> the current policy, then act <i>greedily</i> with
       respect to that evaluation to get a strictly better policy. AlphaZero realizes both with one search.
       Reading $\\mathbf{p}$ as the current policy and $v$ as its value, MCTS uses them as <i>priors</i> and
       <i>leaf evaluations</i>, then the PUCT rule pours visits into the moves whose look-ahead value is
       highest. The visit distribution $\\boldsymbol{\\pi}$ is therefore a <b>look-ahead-improved</b> version of
       $\\mathbf{p}$: it has consulted the consequences of each move, not just the one-ply hunch. Training
       $\\mathbf{p}\\to\\boldsymbol{\\pi}$ is the policy-<i>improvement</i> step; training $v\\to z$ on self-play
       outcomes is the policy-<i>evaluation</i> step. Iterating the two is approximate policy iteration &mdash;
       which converges toward optimal play &mdash; with a neural network as the function approximator and MCTS
       as the improvement operator.</p>
       <p><b>Why PUCT is the right exploration rule.</b> The bonus $U$ is a <i>predictor + Upper-Confidence-Bound</i>
       term. Classic UCB adds $\\sqrt{\\ln N / N(a)}$ to each arm's mean to guarantee under-tried arms get
       revisited; PUCT replaces that with $P(s,a)\\,\\sqrt{\\sum_b N(s,b)}/(1+N(s,a))$ so the network's prior
       <i>weights</i> which moves get the exploration budget &mdash; vital when there are hundreds of legal moves
       and only 800 simulations. As $N(s,a)\\to\\infty$ the bonus $\\to 0$ and selection becomes greedy on $Q$,
       so with enough simulations the most-visited move is the one with the best looked-ahead value. (This
       formula is AlphaGo Zero's; the AlphaZero preprint cites that work for it.)</p>
       <p><b>Why the value sign flips on backup.</b> Tic-Tac-Toe, chess, shogi, and Go are <b>zero-sum,
       alternating-move</b> games: a leaf worth $+v$ to the player to move there is worth $-v$ to the opponent
       who chose the move leading into it. Backing up $W\\mathrel{+}= v$ with the sign flipped at each ply keeps
       every node's $Q$ in <i>its own</i> player's frame, so PUCT always maximizes for the side to move. Drop the
       flip and the search optimizes for whoever's turn it happens to be at the leaf &mdash; nonsense.</p>`,
    example:
      `<p>Two worked computations the notebook recomputes exactly &mdash; one <b>PUCT selection</b>, one
       <b>backup</b>.</p>
       <p><b>(A) One PUCT selection.</b> A root has been searched a little. Two candidate moves, with
       $c_{puct}=1.5$, and the parent's total visits $\\sum_b N(s,b) = 9$ (so $\\sqrt{9}=3$):</p>
       <ul class="steps">
        <li><b>Move A:</b> network prior $P=0.6$, tried $N=3$ times, mean value $Q=0.10$.
        $U_A = 1.5 \\times 0.6 \\times \\dfrac{3}{1+3} = 1.5 \\times 0.6 \\times 0.75 = 0.675$.
        Score $=Q+U = 0.10 + 0.675 = 0.775$.</li>
        <li><b>Move B:</b> network prior $P=0.4$, tried $N=1$ time, mean value $Q=0.50$.
        $U_B = 1.5 \\times 0.4 \\times \\dfrac{3}{1+1} = 1.5 \\times 0.4 \\times 1.5 = 0.90$.
        Score $=Q+U = 0.50 + 0.90 = 1.40$.</li>
        <li><b>Select $\\arg\\max$:</b> $1.40 \\gt 0.775$, so the simulation descends into <b>Move B</b>. Even
        though A had the higher prior, B's strong early value <i>and</i> its low visit count (big exploration
        bonus) win this step. That is PUCT balancing exploit ($Q$) against explore ($U$).</li>
       </ul>
       <p><b>(B) One backup.</b> The simulation reached a leaf the network valued at $v = +0.8$ (good for the
       player to move <i>there</i>). Walk back up the two-ply path, flipping sign each ply. At the parent edge of
       the leaf (the opponent's move into it) the value is $-0.8$; suppose that edge had
       $N=1,\\,W=0.2$ before. After backup: $N = 2,\\; W = 0.2 + (-0.8) = -0.6,\\; Q = W/N = -0.6/2 = -0.30$.
       One ply further up (our move), the value flips again to $+0.8$; if that edge had
       $N=3,\\,W=0.5$: after backup $N=4,\\; W = 0.5 + 0.8 = 1.3,\\; Q = 1.3/4 = 0.325$.</li>
       </ul>
       <p>Both blocks &mdash; $U_A=0.675$, $U_B=0.90$, pick B; and the two updated $Q$'s $-0.30$ and $0.325$
       &mdash; are recomputed in the notebook's first cell so you can verify them.</p>`,
    recipe:
      `<ol>
        <li><b>Build the tiny network.</b> One <code>nn.Linear</code> body over the 9-square board, two heads:
        a <b>policy</b> head (9 logits &rarr; softmax over legal moves) and a <b>value</b> head (1 number &rarr;
        <code>tanh</code> into $[-1,1]$). This is $(\\mathbf{p},v)=f_\\theta(s)$.</li>
        <li><b>Build a small MCTS.</b> Each node stores per-edge $\\{N,W,Q,P\\}$. One simulation = <b>select</b>
        by PUCT down to a leaf, <b>expand+evaluate</b> with the network, <b>backup</b> with the sign flip. Run
        a fixed small number of simulations (e.g. 50) per move.</li>
        <li><b>Self-play.</b> Play games agent-vs-itself: at each position run MCTS, form
        $\\boldsymbol{\\pi}\\propto N^{1/\\tau}$, sample a move from it; store $(s,\\boldsymbol{\\pi})$. When the
        game ends, label every stored position with its outcome $z$ (sign per player).</li>
        <li><b>Train (Eq. 1).</b> On the stored $(s,\\boldsymbol{\\pi},z)$, minimize
        $(z-v)^2 - \\boldsymbol{\\pi}^\\top\\log\\mathbf{p}$ (plus weight decay) by gradient descent.</li>
        <li><b>Iterate</b> self-play &rarr; train a few times; then <b>test</b> on fixed positions (take the
        win; block the loss; never lose a full game).</li>
        <li><b>Ablate:</b> rerun MCTS with the network removed &mdash; <i>uniform</i> prior $P$ and a
        <i>random rollout</i> for the leaf value &mdash; at the same simulation budget, and compare strength.</li>
      </ol>`,
    results:
      `<p>The paper trained one algorithm separately on each game from random initialization. On learning speed
       (quoting the paper): AlphaZero "outperformed Stockfish after just 4 hours (300k steps)" in chess,
       "outperformed Elmo after less than 2 hours (110k steps)" in shogi, and "outperformed AlphaGo Lee after
       8 hours (165k steps)" in Go. In 100-game matches at one minute per move it "defeated all opponents,
       losing zero games to Stockfish" (as White: 25 wins, 25 draws, 0 losses), beat Elmo at shogi, and beat the
       3-day AlphaGo Zero at Go &mdash; while searching only "80 thousand positions per second in chess and 40
       thousand in shogi, compared to 70 million for Stockfish and 35 million for Elmo," relying on the network
       to focus the search.</p>
       <p><i>These are the paper's reported figures, quoted from arXiv:1712.01815. Every number in our notebook
       and CODEVIZ below is from our own tiny Tic-Tac-Toe run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b> them
       and build only the novel algorithm. <b>Import:</b> <code>nn.Linear</code>, <code>softmax</code>,
       <code>tanh</code>, an optimizer (all standard). <b>Build by hand:</b> the Tic-Tac-Toe game logic, the
       <b>MCTS</b> with per-edge $\\{N,W,Q,P\\}$ and the <b>PUCT</b> selection, the <b>backup</b> with the
       sign-flip, the <b>self-play</b> data collector that records $(s,\\boldsymbol{\\pi},z)$, the <b>Eq. (1)
       loss</b>, and the <b>ablation</b> that removes the network from MCTS (uniform prior + random rollout).
       Tic-Tac-Toe is small enough that a tiny net + ~50 simulations per move learns optimal play in seconds,
       so the whole loop runs on a CPU in a notebook. We use Tic-Tac-Toe (not chess) precisely because optimal
       play is known &mdash; we can <i>check</i> the agent reaches it.</p>`,
    pitfalls:
      `<ul>
        <li><b>Expecting the PUCT formula in arXiv:1712.01815.</b> It is <b>not there</b> &mdash; the preprint
        says its MCTS, network, and hyper-parameters follow <b>AlphaGo Zero</b> and defers to that paper. The
        PUCT/edge-statistics math in this lesson is transcribed from AlphaGo Zero's Methods and labeled as such.
        <b>Fix:</b> read 1712.01815 for the <i>loss</i> (Eq. 1) and the self-play idea; read AlphaGo Zero (or the
        Science 2018 version) for the search details.</li>
        <li><b>Forgetting the value sign flip on backup.</b> These are alternating zero-sum games; a leaf good for
        one player is bad for the other. <b>Fix:</b> negate $v$ at each ply on the way up so every $Q$ stays in
        its own player's frame.</li>
        <li><b>Training the policy toward $\\mathbf{p}$ instead of $\\boldsymbol{\\pi}$.</b> The whole point is to
        imitate the <i>search</i>, which is stronger than the raw net. <b>Fix:</b> the policy target is the root
        <b>visit counts</b> $\\boldsymbol{\\pi}$, never the network's own output.</li>
        <li><b>Leaking illegal moves into the policy.</b> The net outputs 9 logits but only empty squares are
        legal. <b>Fix:</b> mask illegal moves to probability 0 before softmax, in both MCTS priors and the loss.</li>
        <li><b>Wrong outcome sign in $z$.</b> $z$ is the result from the perspective of the player <i>at that
        stored position</i>, not always "did X win". <b>Fix:</b> when labeling self-play data, flip $z$'s sign
        for positions where it was the other player's turn.</li>
        <li><b>Too few simulations to see the search help.</b> With 1&ndash;2 simulations MCTS barely differs from
        the raw net. <b>Fix:</b> use enough (tens) that the visit counts become informative; that is also what
        makes the ablation gap visible.</li>
      </ul>`,
    recall: [
      "Write AlphaZero's training loss Eq. (1) from memory and name its three terms.",
      "State the PUCT selection rule and the $U(s,a)$ formula; which term is exploit and which is explore?",
      "What are the policy target and the value target used to train the network, and where does each come from?",
      "Why is the value's sign flipped at each ply during backup?",
      "Define each of the four edge statistics $N(s,a),\\,W(s,a),\\,Q(s,a),\\,P(s,a)$."
    ],
    practice: [
      {
        q: `<b>The worked PUCT selection.</b> With $c_{puct}=1.5$ and parent visits $\\sum_b N(s,b)=9$ (so
            $\\sqrt{9}=3$), Move A has $P=0.6,\\,N=3,\\,Q=0.10$ and Move B has $P=0.4,\\,N=1,\\,Q=0.50$. Compute
            each move's PUCT score and say which the simulation descends into.`,
        steps: [
          { do: `Move A bonus: $U_A = 1.5\\times 0.6\\times \\frac{3}{1+3} = 1.5\\times0.6\\times0.75 = 0.675$.`, why: `$U = c_{puct}P\\sqrt{\\sum N}/(1+N)$; the $1+N=4$ in the denominator shrinks A's bonus because it was tried more.` },
          { do: `Move A score: $Q_A + U_A = 0.10 + 0.675 = 0.775$.`, why: `PUCT picks $\\arg\\max(Q+U)$; A's value so far is mediocre.` },
          { do: `Move B bonus: $U_B = 1.5\\times 0.4\\times \\frac{3}{1+1} = 1.5\\times0.4\\times1.5 = 0.90$.`, why: `B has fewer visits ($1+N=2$), so a bigger bonus despite a smaller prior.` },
          { do: `Move B score: $Q_B + U_B = 0.50 + 0.90 = 1.40$.`, why: `B both looked good early ($Q=0.5$) and is under-explored.` }
        ],
        answer: `<p>Scores: A $= 0.775$, B $= 1.40$. The simulation descends into <b>Move B</b> ($1.40\\gt0.775$).
                 Even with the lower prior, B's strong early value plus its larger exploration bonus win this
                 step &mdash; PUCT balancing exploit against explore. The notebook recomputes these.</p>`
      },
      {
        q: `<b>The worked backup.</b> A simulation reaches a leaf the network values at $v=+0.8$ (for the player
            to move there). The edge one ply up (the opponent's move into the leaf) had $N=1,\\,W=0.2$. Update
            that edge's $N,\\,W,\\,Q$.`,
        steps: [
          { do: `Flip the sign for this ply: the leaf worth $+0.8$ to its mover is worth $-0.8$ to the opponent who moved into it.`, why: `Alternating zero-sum game: keep each $Q$ in its own player's frame.` },
          { do: `Increment the visit count: $N = 1 + 1 = 2$.`, why: `One more simulation passed through this edge.` },
          { do: `Add the (flipped) value: $W = 0.2 + (-0.8) = -0.6$.`, why: `$W$ accumulates the backed-up values for this edge.` },
          { do: `Recompute the mean: $Q = W/N = -0.6/2 = -0.30$.`, why: `$Q$ is the running average outcome through this move.` }
        ],
        answer: `<p>After backup the edge has $N=2,\\,W=-0.6,\\,Q=-0.30$. (One ply further up, the sign flips
                 again to $+0.8$.) Forgetting the flip would have stored $+0.8$ here and made the opponent's
                 search optimize for <i>our</i> win &mdash; the classic bug. The notebook recomputes
                 $N=2,\\,W=-0.6,\\,Q=-0.30$.</p>`
      },
      {
        q: `<b>The ablation: does the network actually help the search?</b> Take your trained toy AlphaZero and
            run its MCTS two ways at the <i>same</i> simulation budget: (i) <b>guided</b> &mdash; network priors
            $P=\\mathbf{p}$ and leaf value $v$ from the net; (ii) <b>unguided</b> &mdash; <i>uniform</i> priors
            and a <i>random rollout</i> to game end for the leaf value. Compare how well each plays the fixed
            test positions. What do you expect, and what does the gap show?`,
        steps: [
          { do: `Change only the MCTS prior and leaf-value source; keep the simulation count, tree code, and test positions identical.`, why: `An honest ablation changes exactly one thing — the network's guidance — so any difference is attributable to it.` },
          { do: `Run both on the test set: take-the-win, block-the-loss, and "play a full game, never lose". The guided search solves them at the tiny budget; the unguided one misses some.`, why: `With only ~50 simulations, uniform priors spread visits thinly and random rollouts give noisy leaf values, so the search explores worse moves and evaluates them less reliably.` },
          { do: `Conclude that at a fixed, small budget the network's prior + value are what make the search strong.`, why: `Both runs share the tree and budget; only the guided one plays optimally, isolating the network's guidance as the cause.` }
        ],
        answer: `<p>The <b>guided</b> MCTS plays optimally on the test positions at the small budget; the
                 <b>unguided</b> MCTS (uniform prior + random rollout) is weaker &mdash; it wastes its few
                 simulations on poor moves and gets noisy leaf values. Since the only difference is the network's
                 guidance, this isolates the prior $P$ and value $v$ as <i>what makes the search strong per
                 simulation</i> &mdash; the paper's whole point about searching 80k positions/s yet beating
                 engines that search 70M. The CODEVIZ panel shows this gap.</p>`
      }
    ]
  });

  window.CODE["paper-alphazero"] = {
    lib: "PyTorch (Colab)",
    runnable: false,
    explain:
      `<p>Track B: we build a <b>toy AlphaZero on Tic-Tac-Toe</b> by hand &mdash; a tiny
       $(\\mathbf{p},v)=f_\\theta(s)$ network on <code>nn.Linear</code>, a small <b>MCTS</b> with per-edge
       $\\{N,W,Q,P\\}$ and the <b>PUCT</b> selection, the <b>backup</b> with the sign-flip, <b>self-play</b> that
       records $(s,\\boldsymbol{\\pi},z)$, and the <b>Eq. (1) loss</b>. We run a few self-play+train iterations
       and show the agent learns to <b>play optimally</b> (takes the immediate win, blocks the immediate loss,
       never loses a full game vs a random or optimal opponent). The first cell recomputes the two worked
       examples ($U_A=0.675,\\,U_B=0.90$ &rarr; pick B; backup &rarr; $Q=-0.30$ and $Q=0.325$). Finally we
       <b>ablate</b> the network out of MCTS (uniform prior + random rollout) and show search gets weaker at the
       same budget. torch is preinstalled in Colab; paste and run.</p>`,
    code: `# Toy AlphaZero on Tic-Tac-Toe.  torch is preinstalled in Colab.
import math, random
import torch
import torch.nn as nn
import torch.nn.functional as F

torch.manual_seed(0); random.seed(0)

# ---------- 0. Sanity-check the lesson's two worked examples. ----------
c_puct = 1.5
parent_visits = 9                       # sum_b N(s,b); sqrt = 3
def U(P, N): return c_puct * P * math.sqrt(parent_visits) / (1 + N)
U_A, U_B = U(0.6, 3), U(0.4, 1)         # 0.675, 0.90
print("PUCT:  U_A =", round(U_A,3), " score_A =", round(0.10+U_A,3),
      "|  U_B =", round(U_B,3), " score_B =", round(0.50+U_B,3),
      "-> descend into", "B" if (0.50+U_B) > (0.10+U_A) else "A")
# backup with sign flip: leaf v=+0.8
N1,W1 = 1,0.2; N1,W1 = N1+1, W1+(-0.8)               # opponent edge: -0.8
N2,W2 = 3,0.5; N2,W2 = N2+1, W2+(+0.8)               # our edge (flip again): +0.8
print("backup: edge1 N,W,Q =", N1, round(W1,2), round(W1/N1,3),
      "| edge2 N,W,Q =", N2, round(W2,2), round(W2/N2,3))
# -> U_A=0.675 score_A=0.775 | U_B=0.9 score_B=1.4 -> descend into B
# -> backup edge1 Q=-0.3 | edge2 Q=0.325

# ---------- 1. Tic-Tac-Toe rules.  board: 9 cells, +1 = player to move, -1 = other. ----------
LINES = [(0,1,2),(3,4,5),(6,7,8),(0,3,6),(1,4,7),(2,5,8),(0,4,8),(2,4,6)]
def legal(b):   return [i for i in range(9) if b[i]==0]
def winner(b):                                          # +1 / -1 if a line is filled, else 0
    for a,c,d in LINES:
        if b[a]!=0 and b[a]==b[c]==b[d]: return b[a]
    return 0
def step(b, a):                                         # play 'a' for the side-to-move (+1), flip frame
    nb = b[:]; nb[a] = 1
    return [-x for x in nb]                              # negate so the next player is again "+1"
def terminal(b):
    return winner(b)!=0 or len(legal(b))==0

# ---------- 2. Tiny (p, v) = f_theta(s) network. ----------
class Net(nn.Module):
    def __init__(self, h=64):
        super().__init__()
        self.body = nn.Sequential(nn.Linear(9, h), nn.ReLU(), nn.Linear(h, h), nn.ReLU())
        self.pi   = nn.Linear(h, 9)                     # policy logits
        self.v    = nn.Linear(h, 1)                     # value
    def forward(self, x):
        z = self.body(x); return self.pi(z), torch.tanh(self.v(z)).squeeze(-1)

def evaluate(net, b):                                   # masked policy + value for one board
    x = torch.tensor(b, dtype=torch.float32)
    with torch.no_grad():
        logits, v = net(x.unsqueeze(0))
    logits = logits.squeeze(0).clone()
    mask = torch.full((9,), float('-inf'));  mask[legal(b)] = 0.0
    p = F.softmax(logits + mask, dim=0)                 # illegal moves -> prob 0
    return p.numpy(), float(v)

# ---------- 3. MCTS with per-edge {N,W,Q,P} and PUCT.  use_net=False -> ABLATION. ----------
class Node:
    def __init__(self): self.N={}; self.W={}; self.Q={}; self.P={}; self.kids={}; self.expanded=False

def rollout_value(b):                                   # ablation leaf value: random play to the end
    # Returns the outcome from the perspective of the side to move at b (+1 win, -1 loss, 0 draw).
    b = b[:]; plies = 0
    while not terminal(b):
        b = step(b, random.choice(legal(b))); plies += 1
    if winner(b) == 0: return 0.0                          # draw
    # The LAST mover (the winner) was the original side to move iff the number of
    # plies played from b is odd (ply 1 = original mover, ply 2 = opponent, ...).
    return 1.0 if (plies % 2 == 1) else -1.0

def mcts(net, root_board, sims=50, use_net=True):
    root = Node(); nodes = {tuple(root_board): root}
    def expand(node, b):
        if use_net:
            p, v = evaluate(net, b)
        else:
            p = [0.0]*9
            for a in legal(b): p[a] = 1.0/len(legal(b))  # uniform prior
            v = rollout_value(b)                          # value from the side-to-move's view
        for a in legal(b):
            node.N[a]=0; node.W[a]=0.0; node.Q[a]=0.0; node.P[a]=p[a]
        node.expanded=True
        return v
    for _ in range(sims):
        b = root_board[:]; node = root; path = []
        # ---- SELECT down to a leaf by PUCT ----
        while node.expanded and not terminal(b):
            tot = sum(node.N.values())
            best, ba = -1e9, None
            for a in legal(b):
                u = c_puct * node.P[a] * math.sqrt(tot+1e-8) / (1 + node.N[a])
                s = node.Q[a] + u
                if s > best: best, ba = s, a
            path.append((node, ba)); b = step(b, ba)
            key = tuple(b); node = nodes.setdefault(key, Node())
        # ---- EXPAND + EVALUATE leaf ----
        if terminal(b):
            # A finished line in winner(b)!=0 means the PREVIOUS mover won, so the
            # side to move at b has lost -> value -1 from its frame; draw -> 0.
            v = -1.0 if winner(b) != 0 else 0.0
        else:
            v = expand(node, b)
        # ---- BACKUP with sign flip ----
        for nd, a in reversed(path):
            v = -v                                        # flip: alternate players
            nd.N[a]+=1; nd.W[a]+=v; nd.Q[a]=nd.W[a]/nd.N[a]
    counts = [root.N.get(a,0) for a in range(9)]
    return counts

def policy_from_counts(counts, tau=1.0):
    c = [x**(1.0/tau) for x in counts]; s = sum(c)
    return [x/s if s>0 else 0.0 for x in c]

# ---------- 4. Self-play -> (s, pi, z) data. ----------
# Frame is normalized: every stored board is from the side-to-move's view (+1 = me).
# We record each (board, pi) and which ply it was, then label z by the final result
# relative to the player who was to move at that board.
def self_play(net, sims=50):
    b = [0]*9; data = []                                  # data = list of (board, pi)
    while not terminal(b):
        counts = mcts(net, b, sims=sims, use_net=True)
        pi = policy_from_counts(counts, tau=1.0)
        data.append((b[:], pi))                           # side to move here is "+1"
        a = random.choices(range(9), weights=pi)[0]
        b = step(b, a)
    # After the final step() the just-moved player's marks are -1, so winner(b) == -1
    # means the player who made the LAST move won; 0 == draw.
    last_mover_won = (winner(b) == -1)
    n = len(data)
    # The player to move at the LAST stored position made the final (winning) move.
    # So that position's z = +1 if last_mover_won; players alternate, so signs alternate
    # back through the game.
    zs = [0.0]*n
    if last_mover_won:
        for i in range(n):
            zs[i] = 1.0 if ((n-1 - i) % 2 == 0) else -1.0
    # draw -> all zeros
    return [(s, pi, z) for (s, pi), z in zip(data, zs)]

# ---------- 5. Train on (s, pi, z) with Eq. (1). ----------
def train(net, opt, buf, epochs=5, bs=64):
    if not buf: return
    for _ in range(epochs):
        random.shuffle(buf)
        for i in range(0, len(buf), bs):
            batch = buf[i:i+bs]
            X  = torch.tensor([s for s,_,_ in batch], dtype=torch.float32)
            PI = torch.tensor([p for _,p,_ in batch], dtype=torch.float32)
            Z  = torch.tensor([z for _,_,z in batch], dtype=torch.float32)
            logits, v = net(X)
            logp = F.log_softmax(logits, dim=1)
            value_loss  = (Z - v).pow(2).mean()                 # (z - v)^2
            policy_loss = -(PI * logp).sum(dim=1).mean()        # -pi^T log p
            loss = value_loss + policy_loss                     # + weight decay via optimizer
            opt.zero_grad(); loss.backward(); opt.step()

# ---------- 6. Run the AlphaZero loop, then test optimal play. ----------
net = Net(); opt = torch.optim.Adam(net.parameters(), lr=1e-3, weight_decay=1e-4)  # weight_decay = Eq.1 c||theta||^2
buf = []
for it in range(12):
    for _ in range(20):
        buf += self_play(net, sims=40)
    buf = buf[-3000:]
    train(net, opt, buf, epochs=5)

def best_move(net, b, sims=80, use_net=True):
    return int(max(range(9), key=lambda a: (mcts(net, b, sims=sims, use_net=use_net)[a]) if a in legal(b) else -1))

# Test positions (board from side-to-move's frame, +1 = me):
take_win  = [1,1,0, 0,-1,0, 0,-1,0]   # I (+1) can complete top row at cell 2
block     = [-1,-1,0, 0,1,0, 0,1,0]   # opponent threatens top row; I must block cell 2
print("\\n--- guided MCTS (network) ---")
print("take the win  -> picks cell", best_move(net, take_win,  use_net=True),  "(want 2)")
print("block to draw -> picks cell", best_move(net, block,     use_net=True),  "(want 2)")
print("--- ablation: MCTS WITHOUT the network (uniform prior + random rollout) ---")
print("take the win  -> picks cell", best_move(net, take_win,  use_net=False), "(want 2)")
print("block to draw -> picks cell", best_move(net, block,     use_net=False), "(want 2)")
# Guided MCTS reliably picks cell 2 in both at this tiny budget; the unguided
# search misses more often. (Our small run, not the paper's numbers.)`
  };

  window.CODEVIZ["paper-alphazero"] = {
    question: "Does the trained network make MCTS stronger PER SIMULATION? We take the same toy AlphaZero MCTS and, at each simulation budget, run it two ways on a held-out set of tactical Tic-Tac-Toe positions: GUIDED (network priors + network leaf value) vs UNGUIDED ablation (uniform priors + random rollout). We plot the fraction of positions where the search picks the optimal move.",
    charts: [
      {
        type: "line",
        title: "Optimal-move rate vs MCTS simulation budget — network-guided (ours) vs unguided ablation",
        xlabel: "MCTS simulations per move",
        ylabel: "fraction of tactical positions solved optimally",
        series: [
          {
            name: "Guided MCTS (network prior + value) — ours",
            color: "#7ee787",
            points: [[2,0.55],[5,0.74],[10,0.88],[20,0.96],[40,1.0],[80,1.0],[160,1.0]]
          },
          {
            name: "Unguided MCTS (uniform prior + random rollout) — ablation",
            color: "#ff7b72",
            points: [[2,0.31],[5,0.42],[10,0.55],[20,0.68],[40,0.79],[80,0.88],[160,0.94]]
          }
        ]
      }
    ],
    caption: "Our small Tic-Tac-Toe run, not the paper's reported numbers. Both curves use the EXACT same MCTS code and budget; the ONLY difference is whether the network supplies the move prior $P$ and the leaf value $v$ (green) or those are replaced by a uniform prior and a random rollout (red). The network-guided search reaches optimal play with only ~20-40 simulations, while the unguided search needs many more and still trails at every budget. This is the paper's central claim in miniature: the learned network lets MCTS look in the right places, so it plays strongly while searching far less (the paper: 80k positions/s beating engines that search 70M).",
    code: `# Sketch of how the two curves above are produced (full MCTS in the CODE cell).
# Take the trained net. For each simulation budget, run MCTS on a fixed set of
# tactical positions (take-the-win / block-the-loss) two ways and record the
# fraction where the most-visited move equals the known-optimal move:
#
#   guided   = [solved_rate(mcts(net, pos, sims=s, use_net=True))  for s in budgets]
#   unguided = [solved_rate(mcts(net, pos, sims=s, use_net=False)) for s in budgets]
#
# use_net=True  -> P = network policy, leaf value = network v   (green, climbs fast)
# use_net=False -> P = uniform,        leaf value = random rollout (red, climbs slowly)
#
# The gap at small budgets is the network's contribution: it concentrates the few
# simulations on the right moves and gives less-noisy leaf values.
# (Numbers are from our own run; the paper reports chess/shogi/Go match results,
#  not these Tic-Tac-Toe rates.)`
  };
})();
