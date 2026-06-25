/* Paper lesson — "The Lottery Ticket Hypothesis: Finding Sparse, Trainable Neural
   Networks" (Frankle & Carbin, 2018; ICLR 2019).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-lottery-ticket".
   GROUNDED from arXiv:1803.03635 (abstract) and the ar5iv HTML mirror (Section 1
   hypothesis + identification procedure; Section 2 iterative pruning + the random-reinit
   control). Track B (architecture): compose with torch.nn; implement Iterative Magnitude
   Pruning, RESET survivors to their original init (the key idea), and ablate against the
   SAME mask with a fresh random init. All CODEVIZ numbers are our own small run. */
(function () {
  window.LESSONS.push({
    id: "paper-lottery-ticket",
    title: "Lottery Ticket Hypothesis — Finding Sparse, Trainable Neural Networks (2018)",
    tagline: "A dense net hides a tiny subnetwork that, reset to its original starting weights, trains just as well alone.",
    module: "Papers · Efficiency & Compression",
    track: "architecture",
    paper: {
      authors: "Jonathan Frankle, Michael Carbin",
      org: "MIT CSAIL",
      year: 2018,
      venue: "arXiv:1803.03635 (Mar 2018); ICLR 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1803.03635",
      code: "https://github.com/google-research/lottery-ticket-hypothesis"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-init", "dl-backprop", "pt-nn-module", "paper-he-init"],

    // WHY READ IT
    problem:
      `<p>By 2018, <b>pruning</b> &mdash; deleting weights from a trained network &mdash; was a known trick.
       (To <b>prune</b> a weight means to permanently set it to zero and never train it again.) Pruning could
       throw away over 90&percnt; of a network's weights and barely lose accuracy. So a small, fast network was
       clearly <i>hiding inside</i> the big one. The puzzle:</p>
       <blockquote>"the architectures uncovered by pruning are harder to train from the start, reaching lower
       accuracy than the original networks." (&sect;1)</blockquote>
       <p>Read that carefully. You can <i>find</i> a sparse network by pruning a trained one. But if you take
       that same sparse <b>wiring</b> (which weights survive, which are deleted), give it <b>fresh random
       starting values</b>, and train from scratch, it trains <i>worse</i>. So why did the pruned net work?
       Was it the leftover <b>structure</b> (the pattern of surviving connections), or something about the
       specific <b>starting weights</b>? Nobody knew. That is the gap this paper closes.</p>`,
    contribution:
      `<ul>
        <li><b>The hypothesis.</b> A dense, randomly-initialized network contains a small subnetwork &mdash; a
        <b>winning ticket</b> &mdash; that, trained <i>alone</i> from the very same starting weights, matches
        the full network's accuracy in a similar number of training steps.</li>
        <li><b>How to find one: reset to the original init.</b> Train, prune the smallest-magnitude weights,
        then &mdash; the key move &mdash; <b>reset the surviving weights to the values they had at
        initialization</b>, not to their trained values. That reset subnetwork is the winning ticket.</li>
        <li><b>Iterative Magnitude Pruning (IMP).</b> Doing this prune-and-reset in many small rounds finds
        far sparser winning tickets than one big prune. The headline control: the <i>same</i> sparse wiring
        with a <i>random</i> re-initialization trains noticeably worse &mdash; so it is the <b>starting
        weights</b>, not the structure alone, that win.</li>
      </ul>`,
    whyItMattered:
      `<p>The paper reframed pruning. Before, pruning was a way to <i>shrink a finished model</i>. After, the
       sparse subnetwork was seen as something that <b>was always there at initialization</b>, waiting to be
       trained. That sparked a whole line of "find the ticket early / train sparse from the start" research and
       sharpened the question of <i>what makes an initialization good</i>. The reset-to-init step (later
       refined into "rewinding") became a standard probe for studying why over-parameterized networks train
       so well.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the hypothesis statement (informal and formal) and the
        four-step "identify a winning ticket" procedure. This is the whole paper in one page.</li>
        <li><b>&sect;2 (Winning Tickets in Fully-Connected Networks)</b> &mdash; the LeNet/MNIST experiments,
        iterative vs. one-shot pruning, and &mdash; most important &mdash; the <b>random-reinitialization
        control</b> (the dashed curves that train worse). Figures 3 and 4.</li>
        <li><b>Fig. 1 / Fig. 4</b> &mdash; accuracy and convergence speed vs. sparsity $P_m$. Watch the
        winning-ticket curve stay flat (or rise) while random-reinit drops.</li>
       </ul>
       <p><b>Skim:</b> the convolutional (CIFAR-10) sections and the dropout/optimizer robustness checks
       &mdash; same story, more architectures. The core idea is the four-step recipe in &sect;1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You train a network, prune it down to a tiny sparse subnetwork, and now you want to <b>retrain that
       subnetwork from scratch</b>. You keep its exact wiring (which weights exist). You try two ways to set
       its starting weights:</p>
       <ul>
        <li><b>(A)</b> reset each surviving weight to the value it had at the <i>original</i> initialization;</li>
        <li><b>(B)</b> draw fresh random starting values for the surviving weights.</li>
       </ul>
       <p>Same wiring, same data, same optimizer &mdash; only the starting weights differ. Which trains to
       higher accuracy: (A), (B), or are they about equal? Write your guess and one sentence of reasoning,
       then run the ablation below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the Iterative Magnitude Pruning loop you will build. Fill in the
       <code>TODO</code>s:</p>
       <ul>
        <li>Save the network's starting weights once: <code>theta0 = clone(net.parameters())</code>
        <i># the original init &mdash; you will reset to this</i>.</li>
        <li>Each round: re-load <code>theta0</code> into the surviving weights, train a while, then
        <b>TODO:</b> among weights still alive, set <code>mask = 0</code> for the smallest-magnitude fraction
        (this is magnitude pruning).</li>
        <li><b>TODO (the key idea):</b> to build the <b>winning ticket</b>, copy <code>theta0</code> back into
        the surviving weights (<i>not</i> the trained values) and train: <code>w = mask * theta0</code>.</li>
        <li><b>TODO (the ablation):</b> keep the <i>same</i> <code>mask</code>, but fill the survivors with a
        <i>fresh random</i> init, and train. Compare.</li>
       </ul>
       <p>Predict which of the two trained subnetworks &mdash; reset-to-init vs random-reinit &mdash; reaches
       higher accuracy at high sparsity.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Write a network as $f(x; \\theta)$: it maps an input $x$ to an output using a big vector of weights
       $\\theta$ (theta). At the start, before any training, the weights are set to random values
       $\\theta_0$ (theta-zero) &mdash; the <b>initialization</b>. Train for $j$ steps and the weights become
       $\\theta_j$ (theta-j).</p>
       <p>A <b>mask</b> $m$ is a vector of $0$s and $1$s, one per weight: $m_i = 1$ keeps weight $i$, $m_i = 0$
       deletes (prunes) it. Applying the mask is element-wise multiplication, written $m \\odot \\theta$
       ($\\odot$ means "multiply matching entries"): surviving weights pass through, pruned weights become
       $0$. So $f(x; m \\odot \\theta)$ is the <b>subnetwork</b> with only the kept connections.</p>
       <p>The paper's central procedure (&sect;1) finds a good mask and a good starting point in four steps:</p>
       <ol>
        <li><b>Initialize.</b> "Randomly initialize a neural network $f(x; \\theta_0)$." Save $\\theta_0$.</li>
        <li><b>Train.</b> "Train the network for $j$ iterations, arriving at parameters $\\theta_j$."</li>
        <li><b>Prune.</b> "Prune $p\\%$ of the parameters in $\\theta_j$, creating a mask $m$." Which $p\\%$?
        The smallest by absolute value &mdash; <b>magnitude pruning</b>: small trained weights are assumed
        least important.</li>
        <li><b>Reset (the key idea).</b> "Reset the remaining parameters to their values in $\\theta_0$,
        creating the winning ticket $f(x; m \\odot \\theta_0)$." The survivors do <b>not</b> keep their trained
        values $\\theta_j$ &mdash; they go back to where they <i>started</i>, $\\theta_0$.</li>
       </ol>
       <p>That reset is the surprise. The trained values told you <i>which</i> weights matter (their magnitudes
       picked the mask), but you throw those trained values away and rewind the survivors to their original
       random starting values, then retrain the small net alone.</p>
       <p>Doing all four steps once is <b>one-shot</b> pruning. The paper's stronger version,
       <b>Iterative Magnitude Pruning (IMP)</b> (&sect;1&ndash;2), repeats the loop over $n$ rounds, each round
       pruning $p^{1/n}\\%$ of the weights that survived so far &mdash; so the network is whittled down a
       little at a time, always resetting to $\\theta_0$ between rounds. IMP finds winning tickets at much
       higher sparsity than one big cut.</p>
       <p>The headline <b>control</b> (&sect;2): take the winning ticket's mask $m$, but instead of resetting to
       $\\theta_0$, fill the survivors with a <i>fresh random</i> init. Same wiring, new starting weights. The
       paper reports this trains worse &mdash; "when randomly reinitialized, winning tickets perform far worse,
       meaning structure alone cannot explain a winning ticket's success" (&sect;2). So the specific starting
       values $\\theta_0$, paired with that mask, are what win.</p>`,
    symbols: [
      { sym: "$f(x;\\theta)$", desc: "the <b>network</b> as a function: it maps input $x$ to an output using the weight vector $\\theta$." },
      { sym: "$\\theta$", desc: "<b>theta</b>, the full vector of the network's weights (all of them, stacked into one long list)." },
      { sym: "$\\theta_0$", desc: "<b>theta-zero</b>, the weights at the very start &mdash; the random <b>initialization</b>, before any training. The winning ticket resets to these." },
      { sym: "$\\theta_j$", desc: "<b>theta-j</b>, the weights after training for $j$ steps. Their magnitudes choose the mask; their values are then thrown away." },
      { sym: "$j$", desc: "the number of training <b>iterations</b> (gradient steps) run before pruning." },
      { sym: "$m$", desc: "the <b>mask</b>: a vector of $0$s and $1$s, one per weight. $1$ = keep this connection, $0$ = prune (delete) it." },
      { sym: "$m \\odot \\theta$", desc: "<b>element-wise product</b>: multiply each weight by its mask entry, so kept weights pass through and pruned ones become $0$. This is how the mask is applied." },
      { sym: "$f(x; m \\odot \\theta_0)$", desc: "the <b>winning ticket</b>: the masked subnetwork whose surviving weights are reset to their original init $\\theta_0$." },
      { sym: "$p\\%$", desc: "the <b>pruning rate</b>: the fraction of (still-surviving) weights removed, chosen as the smallest by absolute value." },
      { sym: "$n$", desc: "the number of <b>rounds</b> in Iterative Magnitude Pruning; each round prunes $p^{1/n}\\%$ of the survivors." },
      { sym: "$\\lVert m \\rVert_0$", desc: "the <b>count of $1$s</b> in the mask (the number of weights kept). The subscript $0$ means \"how many entries are non-zero.\"" },
      { sym: "$|\\theta|$", desc: "the total number of weights in the dense network (the length of $\\theta$)." },
      { sym: "$P_m$", desc: "<b>sparsity level</b>: the fraction of weights remaining, $P_m = \\lVert m \\rVert_0 / |\\theta|$. Small $P_m$ means very sparse (e.g. $P_m \\approx 0.05$ keeps 5&percnt;)." },
      { sym: "“winning ticket”", desc: "a plain term, not a symbol: the sparse subnetwork-plus-original-init that trains alone to full accuracy." }
    ],
    formula: `$$ \\exists\\; m \\in \\{0,1\\}^{|\\theta|} \\;\\;\\text{such that}\\;\\; \\text{training}\\; f(x;\\, m \\odot \\theta_0) \\;\\text{gives}\\quad j' \\le j,\\qquad a' \\ge a,\\qquad \\lVert m \\rVert_0 \\ll |\\theta|. $$`,
    whatItDoes:
      `<p>This is the <b>formal hypothesis</b> (&sect;1). Read it left to right. "There exists a mask $m$" of
       $0$s and $1$s such that, when you train the masked, reset-to-init subnetwork $f(x; m \\odot \\theta_0)$,
       three things hold:</p>
       <ul>
        <li>$j' \\le j$ &mdash; it reaches its best accuracy in <b>no more</b> training steps than the full
        network ($j'$ is the ticket's stopping time, $j$ the full net's). <b>Just as fast.</b></li>
        <li>$a' \\ge a$ &mdash; its test accuracy $a'$ is <b>at least</b> the full network's accuracy $a$.
        <b>Just as accurate.</b></li>
        <li>$\\lVert m \\rVert_0 \\ll |\\theta|$ &mdash; it keeps <b>far fewer</b> weights than the dense net
        ("$\\ll$" means "much less than"). <b>Much smaller.</b></li>
       </ul>
       <p>Informally (&sect;1): "dense, randomly-initialized, feed-forward networks contain subnetworks
       (winning tickets) that &mdash; when trained in isolation &mdash; reach test accuracy comparable to the
       original network in a similar number of iterations."</p>`,
    derivation:
      `<p>This is an <b>empirical hypothesis</b>, not a theorem &mdash; the paper supports it by experiment, so
       there is no algebra to prove. But the <b>mechanism</b> of the procedure is exact and worth pinning down.</p>
       <p><b>Why magnitude picks the mask.</b> After training, a weight with tiny absolute value $|\\theta_j|$
       contributes little to any output it feeds, so deleting it perturbs the function least. Magnitude pruning
       sorts the surviving weights by $|\\theta_j|$ and zeroes the smallest fraction. This uses the
       <i>trained</i> values only to <i>choose</i> the mask $m$.</p>
       <p><b>Why reset, and why it is not circular.</b> Once $m$ is chosen, the trained values are discarded.
       The survivors are set back to $\\theta_0$ (their original random init) and retrained alone. The claim
       being tested is that this specific pairing &mdash; <i>this</i> mask with <i>these</i> original starting
       values &mdash; is what trains well. The control isolates it: keep the mask, swap in a <b>fresh random</b>
       init. If only the wiring (structure) mattered, the random-reinit net would train just as well. It does
       not (&sect;2), so the original init is doing real work. That contrast <i>is</i> the evidence; the math
       is just the bookkeeping of $m$, $\\theta_0$, and $m \\odot \\theta_0$.</p>`,
    example:
      `<p>Work the prune-and-reset on one tiny 4-weight layer so the "reset to $\\theta_0$" step is concrete.
       Suppose this layer started at init</p>
       <p>$$ \\theta_0 = [\\,0.30,\\; -0.05,\\; 0.80,\\; -0.60\\,] $$</p>
       <p>and after $j$ training steps became</p>
       <p>$$ \\theta_j = [\\,0.20,\\; 0.04,\\; 0.90,\\; -0.50\\,]. $$</p>
       <ul class="steps">
        <li><b>Take magnitudes of the trained weights:</b>
        $|\\theta_j| = [\\,0.20,\\; 0.04,\\; 0.90,\\; 0.50\\,]$.</li>
        <li><b>Magnitude-prune 50&percnt;</b> (delete the two smallest). The two smallest magnitudes are
        $0.04$ and $0.20$ (weights 2 and 1). So the mask keeps weights 3 and 4:
        $m = [\\,0,\\; 0,\\; 1,\\; 1\\,]$.</li>
        <li><b>Reset survivors to $\\theta_0$ (the key step):</b> the winning ticket is
        $m \\odot \\theta_0 = [\\,0,\\; 0,\\; 0.80,\\; -0.60\\,]$. Notice the survivors take their
        <i>original</i> values $0.80$ and $-0.60$ &mdash; <b>not</b> their trained values $0.90$ and $-0.50$.</li>
        <li><b>Contrast &mdash; the random-reinit ablation:</b> keep the same mask $[\\,0,0,1,1\\,]$ but draw a
        <i>fresh</i> random pair for the two survivors (say $[\\,0,\\,0,\\,0.11,\\,-0.42\\,]$). Same wiring,
        different starting values. The paper shows this trains worse.</li>
       </ul>
       <p>These exact numbers are recomputed in the notebook's first cell so you can check the prune-and-reset
       by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Save the init.</b> Build the dense net, clone its starting weights $\\theta_0$, and set the mask
        to all-ones (nothing pruned yet).</li>
        <li><b>One IMP round:</b> load $\\theta_0$ into the surviving weights, apply the current mask, and train
        the (sparse) net for $j$ steps.</li>
        <li><b>Prune:</b> among weights still alive, zero the mask for the smallest-magnitude fraction
        $p^{1/n}\\%$. Re-apply the mask after every gradient step so pruned weights stay exactly $0$.</li>
        <li><b>Repeat</b> steps 2&ndash;3 for $n$ rounds, reaching high sparsity $P_m$.</li>
        <li><b>Build the winning ticket:</b> reset the survivors to $\\theta_0$, apply the final mask, train,
        record accuracy.</li>
        <li><b>Ablate:</b> keep the <i>same</i> final mask but fill the survivors with a <b>fresh random</b>
        init, train, record accuracy. The winning ticket should win &mdash; faster training and higher
        accuracy at the same sparsity.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "We consistently find winning tickets that are less than 10-20&percnt; of
       the size of several fully-connected and convolutional feed-forward architectures for MNIST and CIFAR10.
       Above this size, the winning tickets that we find learn faster than the original network and reach
       higher test accuracy." On the random-reinit control (&sect;2): "When randomly reinitialized, winning
       tickets perform far worse, meaning structure alone cannot explain a winning ticket's success." A
       specific reported point (&sect;2): at sparsity $P_m = 21\\%$ a winning ticket reaches minimum
       validation loss "2.51x faster than when reinitialized and is half a percentage point more accurate."</p>
       <p><i>These are the paper's reported figures, quoted. The numbers in the CODEVIZ panel below are from our
       own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the layers and optimizer already ship in PyTorch, so
       you <b>import</b> them and build only the novel <i>algorithm</i>. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code>, <code>nn.Sequential</code>, and an SGD optimizer. <b>Build by hand:</b> the
       Iterative Magnitude Pruning loop &mdash; magnitude-rank the surviving weights, update the binary mask,
       <b>reset survivors to the saved $\\theta_0$</b>, and re-apply the mask after each step so pruned weights
       stay $0$. Then build the <b>ablation</b>: the same mask with a fresh random init. There is no
       <code>torch.allclose</code> oracle here (the contribution is an algorithm, not a layer); the oracle is
       the <b>qualitative contrast</b> &mdash; reset-to-init must out-train random-reinit at high sparsity.</p>`,
    pitfalls:
      `<ul>
        <li><b>Resetting to the trained weights instead of $\\theta_0$.</b> The whole idea is to rewind the
        survivors to their <i>original init</i> $\\theta_0$. Keeping their trained values $\\theta_j$ is a
        different (also reasonable) method, but it is <b>not</b> the lottery-ticket test and muddies the
        ablation. <b>Fix:</b> clone $\\theta_0$ once at the very start and always copy from that clone.</li>
        <li><b>Forgetting to re-apply the mask after each gradient step.</b> The optimizer (especially with
        momentum or weight decay) will happily push a pruned weight back off zero. <b>Fix:</b> after every
        <code>opt.step()</code>, multiply each layer's weights by its mask again.</li>
        <li><b>Pruning across the whole network at one global threshold vs. per-layer.</b> Both appear in the
        literature; the simplest faithful version prunes the smallest survivors layer-by-layer. Pick one and
        keep it fixed across the ticket and the ablation, or the comparison is not honest.</li>
        <li><b>One-shot when you meant iterative.</b> A single big prune finds weaker tickets; the paper's
        strong result needs many small rounds (IMP). If your ticket barely beats random, prune more gently
        over more rounds.</li>
        <li><b>Too-easy data hides the effect.</b> On a trivially separable toy task <i>everything</i> hits
        100&percnt;, so the ticket and the random-reinit look identical. Use a task hard enough that the dense
        net is well below 100&percnt; (we use a random nonlinear teacher), then the gap appears.</li>
        <li><b>Expecting sparse to be <i>better</i> than dense.</b> Winning tickets match the dense net at high
        sparsity and may edge it out in a band; far past that they too decline. The claim is "comparable at
        much smaller size," not "free accuracy."</li>
        <li><b>Prereq note.</b> A general <code>concept-paper-pruning</code> lesson is referenced as a natural
        precursor but <b>does not yet exist</b> in this app, so it is intentionally omitted from
        <code>prereqs</code>; the magnitude-pruning idea is introduced inline here. Start with
        <code>dl-init</code> and <code>paper-he-init</code> for why the starting weights matter.</li>
      </ul>`,
    recall: [
      "State the lottery ticket hypothesis in one sentence.",
      "In the four-step procedure, what do you reset the surviving weights to &mdash; and why is that the surprising part?",
      "What does the random-reinitialization control hold fixed, and what does its worse result prove?",
      "Define $m$, $\\theta_0$, and $P_m$.",
      "Why does Iterative Magnitude Pruning find sparser tickets than one-shot pruning?"
    ],
    practice: [
      {
        q: `<b>The headline ablation.</b> You have a winning ticket at high sparsity (say 1&percnt; of weights
            remaining) that trains nearly as well as the dense net. You keep its exact mask but replace the
            surviving weights with a <i>fresh random</i> initialization, then retrain. What happens to the
            training curve and final accuracy, and what does the contrast prove?`,
        steps: [
          { do: `Hold everything fixed except the starting weights: same mask, same depth/width, same optimizer, same data. Only swap reset-to-$\\theta_0$ for a fresh random init.`, why: `An honest ablation changes exactly one thing &mdash; the starting values &mdash; so any difference is attributable to the initialization, not the structure.` },
          { do: `Retrain and watch: the winning ticket's loss falls steadily to a low value; the random-reinit net (same wiring) stalls near its starting loss far longer and ends higher.`, why: `If structure alone explained the ticket, the random-reinit net would train just as well. It does not, so the original init $\\theta_0$ is doing real work.` },
          { do: `Conclude that the specific starting weights $\\theta_0$, paired with that mask, are what win &mdash; not the sparse wiring by itself.`, why: `This is exactly the paper's claim (&sect;2): "structure alone cannot explain a winning ticket's success."` }
        ],
        answer: `<p>The random-reinit subnetwork (same mask, fresh init) trains <b>worse</b>: its loss stalls
                 longer and it reaches <b>lower</b> final accuracy than the winning ticket. Since the two nets
                 are identical except for the starting weights, this isolates the <b>initialization</b> &mdash;
                 not the structure &mdash; as the reason the ticket trains. The CODEVIZ panel shows exactly this
                 contrast at 99&percnt; sparsity.</p>`
      },
      {
        q: `Work the prune-and-reset by hand. A 4-weight layer starts at
            $\\theta_0 = [0.10,\\,-0.70,\\,0.05,\\,0.40]$ and after training is
            $\\theta_j = [0.30,\\,-0.65,\\,0.02,\\,0.55]$. Magnitude-prune 50&percnt;, then write the winning
            ticket. Which surviving values go in?`,
        steps: [
          { do: `Take magnitudes of the trained weights: $|\\theta_j| = [0.30,\\,0.65,\\,0.02,\\,0.55]$.`, why: `Magnitude pruning ranks by absolute trained value; small means least important.` },
          { do: `Delete the two smallest: $0.02$ (weight 3) and $0.30$ (weight 1). Mask $m = [0,\\,1,\\,0,\\,1]$.`, why: `50&percnt; of 4 weights is 2; the survivors are weights 2 and 4, the two largest by magnitude.` },
          { do: `Reset survivors to $\\theta_0$: ticket $= m \\odot \\theta_0 = [0,\\,-0.70,\\,0,\\,0.40]$.`, why: `The key step: survivors take their <i>original</i> init values $-0.70$ and $0.40$, NOT the trained $-0.65$ and $0.55$.` }
        ],
        answer: `<p>$m = [0,1,0,1]$ and the winning ticket is $m \\odot \\theta_0 = [0,\\,-0.70,\\,0,\\,0.40]$.
                 The two survivors are reset to their <b>original</b> init values $-0.70$ and $0.40$ &mdash;
                 the trained values $-0.65$ and $0.55$ were used only to <i>pick</i> the mask, then thrown
                 away.</p>`
      },
      {
        q: `Why does Iterative Magnitude Pruning (many small rounds, $p^{1/n}\\%$ each) find sparser winning
            tickets than one-shot pruning (one big $p\\%$ cut)? Give the intuition and a 3-round example
            reaching ~50&percnt; sparsity.`,
        steps: [
          { do: `Note that pruning the smallest weights of a <i>just-trained</i> net is a better estimate of "unimportant" than pruning a net that was never retrained after a huge cut.`, why: `Each IMP round retrains the survivors before the next cut, so each magnitude ranking reflects a network that has re-optimized around its remaining weights.` },
          { do: `Pick a per-round keep rate. To keep ~50&percnt; over 3 rounds, keep $0.5^{1/3} \\approx 0.794$ each round: $0.794^3 \\approx 0.50$.`, why: `Compounding small cuts reaches the target sparsity while letting the net recover between cuts.` },
          { do: `Contrast one-shot: a single 50&percnt; cut ranks weights once, on a net that never adapts to the loss of half its weights.`, why: `The one-shot ranking is noisier, so it deletes some weights the iterative process would have kept, giving a weaker ticket.` }
        ],
        answer: `<p>Iterative pruning retrains between cuts, so each magnitude ranking is taken on a network that
                 has re-optimized around the weights it still has &mdash; a cleaner signal of which weights are
                 truly unimportant. Compounding gentle cuts (e.g. keep $0.794$ per round for 3 rounds
                 $\\to 0.794^3 \\approx 0.50$) reaches the same sparsity as one big cut but yields a stronger
                 ticket, which is why IMP reaches the paper's $\\lt 10\\text{-}20\\%$ regime.</p>`
      }
    ]
  });

  window.CODE["paper-lottery-ticket"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the Iterative Magnitude Pruning (IMP) loop by hand on top of
       <code>nn.Linear</code> / <code>nn.ReLU</code>, then reproduce the headline contrast. The data is a
       <b>random nonlinear teacher</b> (labels come from a fixed random multilayer perceptron, or MLP) so the
       task is hard enough that the dense net lands well below 100&percnt; &mdash; otherwise the effect hides.
       The key lines are <code>w = mask * theta0</code> (reset survivors to the saved init &mdash; the winning
       ticket) and re-applying the mask after every <code>opt.step()</code> so pruned weights stay exactly $0$.
       We prune iteratively to ~1&percnt; remaining, then train two subnetworks with the <b>same mask</b>:
       (1) reset to $\\theta_0$ (the ticket), (2) a fresh random init (the ablation). The first cell recomputes
       the worked example $\\theta_j$-magnitudes $\\to$ mask $\\to$ $m \\odot \\theta_0$. Paste into Colab and
       run.</p>`,
    code: `import torch
import torch.nn as nn

torch.manual_seed(0)

# --- 0. Sanity-check the lesson's worked example: prune 50%, reset survivors to theta0. ---
theta0 = torch.tensor([0.30, -0.05, 0.80, -0.60])   # original init
thetaj = torch.tensor([0.20,  0.04, 0.90, -0.50])   # after j training steps
order  = torch.argsort(thetaj.abs())                # ascending by |trained value|
mask   = torch.zeros(4); mask[order[2:]] = 1.0       # keep the 2 largest -> [0,0,1,1]
ticket = mask * theta0                               # reset survivors to theta0
print("worked example: mask =", mask.tolist(), " winning ticket =", ticket.tolist())
# worked example: mask = [0.0, 0.0, 1.0, 1.0]  winning ticket = [0.0, -0.0, 0.8, -0.6]


# --- 1. A hard task: labels from a FIXED random nonlinear teacher MLP (D -> 64 -> K). ---
g = torch.Generator().manual_seed(2)
N, D, K = 2400, 40, 6
X = torch.randn(N, D, generator=g)
T1 = torch.randn(D, 64, generator=g) / (D ** 0.5)
T2 = torch.randn(64, K, generator=g) / (64 ** 0.5)
with torch.no_grad():
    y = (torch.relu(X @ T1) @ T2).argmax(1)          # the teacher's labels
Xtr, ytr, Xte, yte = X[:1600], y[:1600], X[1600:], y[1600:]


# --- 2. The student net + helpers. ---
H = 300
def make_net():
    return nn.Sequential(nn.Linear(D, H), nn.ReLU(),
                         nn.Linear(H, H), nn.ReLU(),
                         nn.Linear(H, K))
def linears(net):  return [m for m in net if isinstance(m, nn.Linear)]
def load_init(net, t0):
    with torch.no_grad():
        for p, p0 in zip(net.parameters(), t0): p.copy_(p0)

def train(net, masks, steps=300, lr=0.1):
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    lossf = nn.CrossEntropyLoss(); net.train()
    for t in range(steps):
        opt.zero_grad(); lossf(net(Xtr), ytr).backward(); opt.step()
        with torch.no_grad():                         # KEEP pruned weights at exactly 0
            for lyr, mk in zip(linears(net), masks): lyr.weight.mul_(mk)
    net.eval()
    with torch.no_grad():
        return (net(Xte).argmax(1) == yte).float().mean().item()


# --- 3. Save the ORIGINAL init theta0 (the value the ticket resets to). ---
torch.manual_seed(7); base = make_net()
theta0 = [p.detach().clone() for p in base.parameters()]
lins   = linears(base)

dense = make_net(); load_init(dense, theta0)
dense_acc = train(dense, [torch.ones_like(l.weight) for l in linears(dense)])


# --- 4. Iterative Magnitude Pruning: n rounds, keep 70% of survivors each round. ---
def imp(theta0, rounds=13, keep=0.7):
    masks = [torch.ones_like(l.weight) for l in lins]
    for r in range(rounds):
        net = make_net(); load_init(net, theta0)
        with torch.no_grad():
            for lyr, mk in zip(linears(net), masks): lyr.weight.mul_(mk)
        train(net, masks)                              # train, THEN prune by magnitude
        for lyr, mk in zip(linears(net), masks):
            w = lyr.weight.detach().abs(); alive = w[mk.bool()]
            k = int((1 - keep) * alive.numel())
            if k > 0:
                thr = torch.kthvalue(alive, k).values
                mk.copy_((w > thr).float() * mk)       # drop smallest survivors
    return masks

masks = imp(theta0, rounds=13, keep=0.7)               # 0.7^13 ~= 1% remaining
Pm = sum(m.sum().item() for m in masks) / sum(m.numel() for m in masks)


# --- 5. The headline contrast: SAME mask, two different starting weights. ---
def eval_ticket():                                      # reset survivors to theta0
    net = make_net(); load_init(net, theta0)
    with torch.no_grad():
        for lyr, mk in zip(linears(net), masks): lyr.weight.mul_(mk)
    return train(net, masks)

def eval_random(seed):                                  # SAME mask, FRESH random init
    torch.manual_seed(seed); net = make_net()
    with torch.no_grad():
        for lyr, mk in zip(linears(net), masks): lyr.weight.mul_(mk)
    return train(net, masks)

ticket_acc = eval_ticket()
random_accs = [eval_random(100 + i) for i in range(5)]

print(f"\\nDENSE test acc          : {dense_acc:.4f}")
print(f"Sparsity Pm (remaining) : {Pm*100:.2f}%   (pruned {(1-Pm)*100:.2f}%)")
print(f"WINNING TICKET (reset)  : {ticket_acc:.4f}")
print(f"RANDOM REINIT (same mask): {[round(a,4) for a in random_accs]}")
# At ~1% remaining, the reset-to-init ticket trains close to dense; the random-reinit
# (same wiring, fresh init) lags. Exact numbers vary by hardware/seed --
# this is our small run, not the paper's reported result.`
  };

  window.CODEVIZ["paper-lottery-ticket"] = {
    question: "At 99% sparsity, does the winning ticket (survivors reset to their ORIGINAL init) out-train the SAME sparse wiring given a fresh RANDOM init?",
    charts: [
      {
        type: "line",
        title: "Training loss vs step at 99% sparsity — winning ticket (reset-to-init) vs same mask, random re-init",
        xlabel: "training step",
        ylabel: "cross-entropy loss",
        series: [
          {
            name: "Random re-init (same mask)",
            color: "#ff7b72",
            points: [[0,1.7696],[10,1.0858],[20,1.1002],[30,1.0155],[40,1.02],[50,1.0093],[60,1.0089],[70,1.0071],[80,1.0065],[90,1.0059],[100,1.0055],[110,1.0052],[120,1.0048],[130,1.0045],[140,1.0041],[150,1.0036],[160,1.0029],[170,1.002],[180,1.0005],[190,0.998],[200,0.9937],[210,0.9858],[220,0.9719],[230,0.9532],[240,0.94],[250,0.9311],[260,0.9208],[270,0.9101],[280,0.9009],[290,0.8921]]
          },
          {
            name: "Winning ticket (reset to init)",
            color: "#7ee787",
            points: [[0,1.7863],[10,1.0767],[20,1.0887],[30,1.012],[40,1.0047],[50,0.9882],[60,0.9617],[70,0.9158],[80,0.8427],[90,0.7553],[100,0.6763],[110,0.6102],[120,0.5551],[130,0.5144],[140,0.4862],[150,0.4653],[160,0.4488],[170,0.4341],[180,0.4207],[190,0.4081],[200,0.3959],[210,0.3836],[220,0.3712],[230,0.36],[240,0.3496],[250,0.3402],[260,0.3317],[270,0.3238],[280,0.3167],[290,0.3105]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A 3-layer MLP (width 300) is pruned by Iterative Magnitude Pruning to ~0.97% of its weights remaining (99% pruned) on a hard random-teacher task. Then the SAME sparse mask is trained two ways. The WINNING TICKET resets each surviving weight to its ORIGINAL init &theta;&#8320; and its loss falls steadily (1.08 &rarr; 0.31), reaching 0.778 test accuracy &mdash; close to the dense net's 0.829. The RANDOM RE-INIT keeps the identical wiring but draws fresh starting weights; its loss stalls near 1.0 for ~180 steps and ends at 0.89, reaching only ~0.71 accuracy (mean over 5 seeds). Same mask, same optimizer, same data &mdash; the ONLY difference is the starting weights, isolating the initialization as the reason the ticket trains.",
    code: `import torch, torch.nn as nn, numpy as np

# Reproduce the headline contrast: at high sparsity, a winning ticket (survivors
# RESET to the original init) trains; the SAME mask with a fresh random init stalls.
g = torch.Generator().manual_seed(2)
N, D, K = 2400, 40, 6
X = torch.randn(N, D, generator=g)
T1 = torch.randn(D, 64, generator=g) / (D ** 0.5)      # fixed random nonlinear teacher
T2 = torch.randn(64, K, generator=g) / (64 ** 0.5)
with torch.no_grad():
    y = (torch.relu(X @ T1) @ T2).argmax(1)
Xtr, ytr, Xte, yte = X[:1600], y[:1600], X[1600:], y[1600:]

H = 300
def make_net():
    return nn.Sequential(nn.Linear(D,H), nn.ReLU(), nn.Linear(H,H), nn.ReLU(), nn.Linear(H,K))
def lins(net): return [m for m in net if isinstance(m, nn.Linear)]
def load(net, t0):
    with torch.no_grad():
        for p, p0 in zip(net.parameters(), t0): p.copy_(p0)

def train(net, masks, steps=300, lr=0.1, rec=False):
    opt = torch.optim.SGD(net.parameters(), lr=lr, momentum=0.9)
    lossf = nn.CrossEntropyLoss(); net.train(); curve = []
    for t in range(steps):
        opt.zero_grad(); loss = lossf(net(Xtr), ytr); loss.backward(); opt.step()
        with torch.no_grad():
            for l, m in zip(lins(net), masks): l.weight.mul_(m)   # keep pruned weights at 0
        if rec and t % 10 == 0: curve.append([t, round(loss.item(), 4)])
    net.eval()
    with torch.no_grad(): acc = (net(Xte).argmax(1) == yte).float().mean().item()
    return (acc, curve) if rec else acc

torch.manual_seed(7); base = make_net()
theta0 = [p.detach().clone() for p in base.parameters()]; L = lins(base)
dn = make_net(); load(dn, theta0)
dense = train(dn, [torch.ones_like(l.weight) for l in lins(dn)])

def imp(t0, rounds=13, keep=0.7):
    masks = [torch.ones_like(l.weight) for l in L]
    for r in range(rounds):
        net = make_net(); load(net, t0)
        with torch.no_grad():
            for l, m in zip(lins(net), masks): l.weight.mul_(m)
        train(net, masks)
        for l, m in zip(lins(net), masks):
            w = l.weight.detach().abs(); a = w[m.bool()]; k = int((1-keep)*a.numel())
            if k > 0: m.copy_((w > torch.kthvalue(a, k).values).float() * m)
    return masks

masks = imp(theta0)                                     # ~1% remaining
Pm = sum(m.sum().item() for m in masks) / sum(m.numel() for m in masks)

def ticket():
    net = make_net(); load(net, theta0)
    with torch.no_grad():
        for l, m in zip(lins(net), masks): l.weight.mul_(m)
    return train(net, masks, rec=True)
def randinit(seed, rec=False):
    torch.manual_seed(seed); net = make_net()
    with torch.no_grad():
        for l, m in zip(lins(net), masks): l.weight.mul_(m)
    return train(net, masks, rec=rec)

wt_acc, wt_curve = ticket()
rr_acc, rr_curve = randinit(100, rec=True)
rr_accs = [randinit(100 + i) for i in range(5)]
print("DENSE        :", round(dense, 4))
print("Pm remaining :", round(Pm*100, 2), "%")
print("TICKET acc   :", round(wt_acc, 4))
print("RANDOM accs  :", [round(a,4) for a in rr_accs], "mean", round(float(np.mean(rr_accs)),4))
print("ticket curve :", wt_curve)
print("random curve :", rr_curve)
# Ticket loss 1.08 -> 0.31 (acc ~0.78); random stalls near 1.0, ends ~0.89 (acc ~0.71).
# Our small run, not the paper's number.`
  };
})();
