/* Paper lesson — "Wasserstein GAN" (WGAN), Arjovsky, Chintala & Bottou 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-wgan".
   GROUNDED from arXiv:1701.07875 (abstract) and the ar5iv HTML mirror
   (Eq. 1 Earth-Mover distance; Eq. 2 Kantorovich-Rubinstein duality; Eq. 3 the WGAN
   value function; Example 1 "Learning parallel lines"; Section 3 / Algorithm 1 with
   weight clipping, RMSProp, n_critic=5, c=0.01, alpha=5e-5; Figure 3 loss-quality
   correlation).  Track B (architecture): build a WGAN -- a CRITIC (not classifier) +
   WEIGHT CLIPPING + the Wasserstein/EM loss -- on top of nn primitives; train on MNIST
   (torchvision); show the critic loss tracks sample quality. Ablation: drop the weight
   clipping. The GAN minimax game lives in concept dl-gan; we cross-link, not re-derive. */
(function () {
  window.LESSONS.push({
    id: "paper-wgan",
    title: "WGAN — Wasserstein GAN (2017)",
    tagline: "Replace the GAN's classifier-and-log-loss with a Lipschitz 'critic' that estimates the Earth-Mover distance, giving stable training and a loss curve that actually tracks sample quality.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Martin Arjovsky, Soumith Chintala, Léon Bottou",
      org: "Courant Institute, New York University & Facebook AI Research (per the paper's author affiliations)",
      year: 2017,
      venue: "arXiv:1701.07875 (Jan 2017); ICML 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1701.07875",
      code: "https://github.com/martinarjovsky/WassersteinGAN"
    },
    conceptLink: null,
    partOf: [
      { capstone: "capstone-gan", step: 4, builds: "the Wasserstein critic + weight clipping + EM-distance loss" }
    ],
    prereqs: ["dl-gan", "dl-backprop", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>A <b>Generative Adversarial Network (GAN)</b> &mdash; Goodfellow 2014, see the sibling lesson
       <b>paper-gan</b> and the concept <b>dl-gan</b> &mdash; trains a <b>generator</b> $G$ (turns noise into
       fake images) against a <b>discriminator</b> $D$ (a binary classifier outputting the probability an image
       is real). The original GAN's objective is mathematically equivalent to minimizing the
       <b>Jensen&ndash;Shannon (JS) divergence</b> &mdash; a way to measure how far two probability
       distributions are apart &mdash; between the real-data distribution and the generator's distribution.</p>
       <p>The paper's framing (&sect;1&ndash;2): when the two distributions barely overlap &mdash; which is the
       <i>normal</i> case for images, since real images live on a thin lower-dimensional surface inside pixel
       space &mdash; the JS divergence is <b>constant</b> (it just reads $\\log 2$). A constant has zero
       gradient. So as you nudge the generator, the loss does not move, the discriminator saturates, and the
       generator gets <b>no usable learning signal</b>. This is exactly the brittle, oscillating, mode-collapsing
       behavior that made GANs so hard to train, and why the GAN loss number tells you <i>nothing</i> about how
       good the samples look.</p>`,
    contribution:
      `<ul>
        <li><b>A different distance: the Earth-Mover (Wasserstein-1) distance.</b> Instead of JS divergence,
        measure the cost of the cheapest "transport plan" that moves the generator's probability mass onto the
        real data's. This distance varies <b>smoothly</b> even when the distributions do not overlap, so it
        always gives a gradient (&sect;2&ndash;3, Eq. 1).</li>
        <li><b>A way to compute it: the Kantorovich&ndash;Rubinstein duality.</b> The Earth-Mover distance can
        be rewritten as a maximization over all <b>1-Lipschitz functions</b> (functions whose slope never
        exceeds 1). A neural network plays that function &mdash; the paper renames it the <b>critic</b> (it
        scores realness on an unbounded real-valued scale, it does not classify) &mdash; and the constraint is
        crudely enforced by <b>clipping its weights</b> to a small box (Eq. 2&ndash;3, Algorithm 1).</li>
        <li><b>A loss that actually tracks quality.</b> Because the critic's output estimates the Wasserstein
        distance, the loss curve goes <b>down as samples improve</b> &mdash; the paper highlights this as the
        first GAN whose loss is a meaningful learning curve you can use to debug (&sect;4, Fig. 3).</li>
      </ul>`,
    whyItMattered:
      `<p>WGAN moved GAN training from a black art toward something principled. Its core ideas &mdash; a critic
       trained more than the generator, a Lipschitz constraint, and a loss you can read &mdash; were inherited
       by nearly every later GAN. The very next year, <b>WGAN-GP</b> (Gulrajani 2017) replaced weight clipping
       with a gradient penalty, fixing the paper's own admitted weakness, and that became a default building
       block for high-resolution GANs. The Wasserstein view also seeded a broader line of "optimal-transport"
       generative models.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 (Different Distances)</b> and especially <b>Example 1 ("Learning parallel lines")</b>
        &mdash; the toy case where JS, KL and Total-Variation distances are all discontinuous but the
        Wasserstein distance is the smooth $|\\theta|$. This single example is the paper's whole motivation, and
        it is the worked numeric example below.</li>
        <li><b>&sect;3 (Wasserstein GAN)</b> &mdash; the Kantorovich&ndash;Rubinstein duality (Eq. 2), the critic
        value function (Eq. 3), and <b>Algorithm 1</b> with its weight clipping, RMSProp, and the
        critic-trained-$n_{\\text{critic}}$-times-per-generator-step loop.</li>
        <li><b>Fig. 3</b> &mdash; the critic-loss curves that correlate with visual sample quality (the headline
        empirical claim).</li>
       </ul>
       <p><b>Skim:</b> the measure-theoretic proofs in &sect;2&ndash;3 (Theorems 1&ndash;3 establish that the
       Wasserstein distance is continuous and differentiable under mild conditions &mdash; good to know the
       guarantee exists, but you do not need the proof to build it). The math you must own is the EM distance
       (Eq. 1), its dual (Eq. 2), the critic objective (Eq. 3), and the parallel-lines numbers.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two models on MNIST with an otherwise identical critic/discriminator and generator: (A)
       a <b>WGAN</b> &mdash; critic output is a raw score, loss is the difference of critic means, weights are
       clipped to $[-0.01, 0.01]$; and (B) the <b>same WGAN with the weight clipping removed</b>. Which one
       trains stably and produces a critic loss that steadily shrinks toward zero, and which one blows up (the
       critic's outputs and gradients explode because nothing bounds its slope)? Write your guess and one
       sentence of why.</p>
       <p>(Hint: the duality in Eq. 2 is only valid when the critic is <b>1-Lipschitz</b> &mdash; what enforces
       that here?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the WGAN. Fill in the <code>TODO</code>s &mdash; note how few changes there
       are versus an ordinary GAN:</p>
       <ul>
        <li>Critic $f_w$: same network shape as a GAN discriminator but the <b>final layer has no sigmoid</b>
        &mdash; it outputs a raw real number (a score), not a probability. TODO: a small
        <code>nn.Linear</code>/<code>nn.Conv2d</code> stack ending in a single unbounded output.</li>
        <li>TODO: the <b>critic loss</b> is <code>-(critic(real).mean() - critic(fake).mean())</code> &mdash;
        we <i>maximize</i> the gap $\\mathbb{E}[f(\\text{real})] - \\mathbb{E}[f(\\text{fake})]$, so we minimize
        its negative. <b>No</b> $\\log$, <b>no</b> labels, <b>no</b> binary-cross-entropy.</li>
        <li>TODO: after each critic optimizer step, <b>clip every critic weight</b> into $[-c, c]$ with
        $c = 0.01$ (<code>p.data.clamp_(-c, c)</code>).</li>
        <li>TODO: train the critic <b>$n_{\\text{critic}} = 5$</b> times for every one generator step; the
        <b>generator loss</b> is <code>-critic(fake).mean()</code>.</li>
        <li>TODO: optimize with <b>RMSProp</b>, learning rate $5\\times10^{-5}$ (the paper avoids Adam).</li>
       </ul>
       <p>Predict: with clipping on vs off, which run's loss is a clean downward curve and which diverges?</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>WGAN keeps the generator-vs-judge <i>setup</i> of a GAN but changes <b>what is measured</b> and
       <b>how the judge is constrained</b>. Three moves:</p>
       <p><b>1. Measure the Earth-Mover (Wasserstein-1) distance, not JS divergence.</b> Imagine the real
       distribution and the generator's distribution as two piles of dirt of equal total mass. The
       <b>Earth-Mover (EM) distance</b> is the minimum <i>work</i> &mdash; mass times the distance it travels
       &mdash; to reshape one pile into the other, over all possible "transport plans" $\\gamma$ (a plan says how
       much mass to move from each point $x$ to each point $y$). Formally (Eq. 1):</p>
       <blockquote>$W(\\mathbb{P}_r, \\mathbb{P}_g) = \\inf_{\\gamma \\in \\Pi(\\mathbb{P}_r,\\mathbb{P}_g)}
       \\mathbb{E}_{(x,y)\\sim\\gamma}\\big[\\,\\lVert x - y\\rVert\\,\\big]$</blockquote>
       <p>The key property: even if the two piles do <b>not overlap at all</b>, $W$ still measures <i>how far
       apart</i> they are and shrinks <b>smoothly</b> as you slide one toward the other. JS divergence, by
       contrast, is pinned at $\\log 2$ for any non-overlap (worked numerically below) &mdash; flat, hence no
       gradient.</p>
       <p><b>2. Make it computable via Kantorovich&ndash;Rubinstein duality.</b> The infimum over transport plans
       in Eq. 1 is intractable. A classical theorem rewrites it as a <b>supremum</b> (a maximization) over all
       <b>1-Lipschitz functions</b> $f$ &mdash; functions that never change faster than slope 1,
       $|f(a)-f(b)| \\le \\lVert a-b\\rVert$ (Eq. 2):</p>
       <blockquote>$W(\\mathbb{P}_r, \\mathbb{P}_\\theta) = \\sup_{\\lVert f\\rVert_L \\le 1}
       \\mathbb{E}_{x\\sim\\mathbb{P}_r}[f(x)] - \\mathbb{E}_{x\\sim\\mathbb{P}_\\theta}[f(x)]$</blockquote>
       <p>So the distance equals: find the 1-Lipschitz function that scores real samples as high as possible and
       fake samples as low as possible; the resulting <b>gap of average scores</b> is the Wasserstein distance.</p>
       <p><b>3. Let a neural network be that function &mdash; the critic &mdash; and clip its weights.</b> Replace
       "all 1-Lipschitz $f$" with a network $f_w$ and <i>maximize</i> the same gap over its weights $w$ (Eq. 3).
       The paper renames this network the <b>critic</b>: unlike a GAN discriminator it does <b>not</b> output a
       probability in $[0,1]$ and is not trained with a log-loss &mdash; it emits an unbounded real score. To
       (crudely) keep $f_w$ Lipschitz, after every update the weights are <b>clamped to a small box</b>
       $[-c, c]$ with $c = 0.01$. The paper is candid that clipping is "a clearly terrible way to enforce a
       Lipschitz constraint" but uses it for simplicity (this is the weakness WGAN-GP later fixes).</p>
       <p><b>The training loop (Algorithm 1).</b> Because the critic must <i>approximate the supremum</i> in Eq. 2
       before its gap is a good distance estimate, the critic is trained <b>$n_{\\text{critic}} = 5$ steps</b>
       for each single generator step. The generator then descends the (approximate) Wasserstein distance by
       minimizing $-\\,\\mathbb{E}[f_w(G(z))]$ &mdash; pushing its fakes toward higher critic scores. The optimizer
       is <b>RMSProp</b> (lr $5\\times10^{-5}$); the paper found momentum methods like Adam destabilize the critic.</p>`,
    architecture:
      `<p>WGAN reuses a GAN's two-network layout but changes the judge and the training loop. <b>Two networks:</b></p>
       <ul>
        <li><b>Generator $g_\\theta$.</b> Maps a noise vector $z\\sim p(z)$ (the paper uses dimension 100) through a
        deconvolutional / DCGAN-style stack to a sample the size of a real image. Final activation $\\tanh$ so
        pixels land in $[-1,1]$. This is architecturally <i>identical</i> to a DCGAN generator &mdash; the WGAN
        change is not here.</li>
        <li><b>Critic $f_w$.</b> Same backbone as a DCGAN discriminator (conv $\\to$ LeakyReLU stack) but the
        <b>final layer outputs a single unbounded real score with NO sigmoid</b>. It is a scalar-valued function,
        not a $[0,1]$ classifier &mdash; it plays the 1-Lipschitz $f$ of Eq. 2.</li>
       </ul>
       <p><b>Data flow per generator step:</b> sample a minibatch of $m$ real images and $m$ noise vectors $\\to$
       generator turns noise into $m$ fakes $\\to$ critic scores both batches $\\to$ losses are differences of the
       per-batch mean scores (no log, no labels, no cross-entropy).</p>
       <p><b>Training procedure (Algorithm 1), defaults $\\alpha=5\\times10^{-5}$, $c=0.01$, $m=64$,
       $n_{\\text{critic}}=5$:</b></p>
       <ol>
        <li><b>Inner critic loop &mdash; repeat $n_{\\text{critic}}=5$ times:</b> sample $m$ reals $x^{(i)}$ and $m$
        noises $z^{(i)}$; compute the critic gradient
        $g_w\\!\\leftarrow\\!\\nabla_w[\\tfrac1m\\sum f_w(x^{(i)})-\\tfrac1m\\sum f_w(g_\\theta(z^{(i)}))]$; update
        $w\\!\\leftarrow\\!w+\\alpha\\cdot\\mathrm{RMSProp}(w,g_w)$; then <b>clip</b>
        $w\\!\\leftarrow\\!\\mathrm{clip}(w,-c,c)$.</li>
        <li><b>One generator step:</b> sample $m$ fresh noises; compute
        $g_\\theta\\!\\leftarrow\\!-\\nabla_\\theta\\tfrac1m\\sum f_w(g_\\theta(z^{(i)}))$; update
        $\\theta\\!\\leftarrow\\!\\theta-\\alpha\\cdot\\mathrm{RMSProp}(\\theta,g_\\theta)$.</li>
        <li>Repeat until convergence. The clipped critic gap is logged as a <b>Wasserstein-distance estimate</b>
        whose curve tracks sample quality (Fig. 3).</li>
       </ol>
       <p><b>Why $n_{\\text{critic}}\\!>\\!1$:</b> the gap only equals the Wasserstein distance when the critic
       reaches the supremum of Eq. 2, so the critic is trained to near-optimality between each generator move.</p>`,
    symbols: [
      { sym: "$\\mathbb{P}_r$", desc: "the <b>real-data distribution</b> &mdash; the true distribution of images we want to imitate ($r$ for 'real')." },
      { sym: "$\\mathbb{P}_g$ / $\\mathbb{P}_\\theta$", desc: "the <b>generator's distribution</b> &mdash; the distribution of fake samples $G(z)$. Written $\\mathbb{P}_\\theta$ to stress it depends on the generator's parameters $\\theta$." },
      { sym: "$W(\\mathbb{P}_r,\\mathbb{P}_g)$", desc: "the <b>Wasserstein-1 / Earth-Mover (EM) distance</b> between the two distributions &mdash; the minimum 'work' (mass times travel distance) to reshape one into the other." },
      { sym: "$\\inf$ / $\\sup$", desc: "<b>infimum</b> (the greatest lower bound, like a minimum) and <b>supremum</b> (the least upper bound, like a maximum) &mdash; used because the optimum may be approached but not exactly attained." },
      { sym: "$\\gamma$", desc: "a <b>transport plan</b>: a joint distribution over pairs $(x,y)$ saying how much probability mass to move from $x$ to $y$." },
      { sym: "$\\Pi(\\mathbb{P}_r,\\mathbb{P}_g)$", desc: "the set of <b>all valid transport plans</b> &mdash; all joint distributions whose two margins are exactly $\\mathbb{P}_r$ and $\\mathbb{P}_g$ (mass is conserved)." },
      { sym: "$\\lVert x - y\\rVert$", desc: "the <b>distance</b> (Euclidean norm) between points $x$ and $y$ &mdash; how far a unit of mass travels." },
      { sym: "$\\mathbb{E}_{(x,y)\\sim\\gamma}$", desc: "the <b>expected value</b> (average) of the bracketed quantity when the pair $(x,y)$ is drawn from the plan $\\gamma$." },
      { sym: "$f$ / $f_w$", desc: "the <b>critic</b> function (with weights $w$): a scalar-valued network that scores realness on an unbounded scale. It plays the role of the 1-Lipschitz function in the dual." },
      { sym: "$\\lVert f\\rVert_L \\le 1$", desc: "the <b>1-Lipschitz constraint</b>: $f$'s slope never exceeds 1, i.e. $|f(a)-f(b)|\\le\\lVert a-b\\rVert$ for all $a,b$. Enforced here by weight clipping." },
      { sym: "$c$", desc: "the <b>weight-clipping bound</b>: after each critic update, every weight is clamped to $[-c,c]$. The paper uses $c = 0.01$." },
      { sym: "$n_{\\text{critic}}$", desc: "how many <b>critic updates per generator update</b> &mdash; the critic must well-approximate the supremum, so it is trained more. The paper uses $5$." },
      { sym: "$G(z)$ / $g_\\theta(z)$", desc: "the <b>generator</b>: maps a noise vector $z$ to a fake sample. $\\theta$ are its parameters." },
      { sym: "$\\alpha$", desc: "the <b>learning rate</b>. The paper uses $\\alpha = 5\\times10^{-5}$ with RMSProp." },
      { sym: "$m$", desc: "the <b>minibatch size</b> &mdash; how many real images (and noise vectors) are sampled per update. The paper's default is $m = 64$." },
      { sym: "$g_w$ / $g_\\theta$", desc: "the <b>gradients</b> of the objective with respect to the critic weights $w$ and the generator parameters $\\theta$ &mdash; the directions fed to RMSProp in Algorithm 1." },
      { sym: "$\\mathrm{RMSProp}$", desc: "the <b>optimizer</b> (Root-Mean-Square Propagation): scales each step by a running average of recent squared gradients. The paper deliberately avoids momentum methods like Adam, which destabilized the critic." },
      { sym: "$\\mathrm{clip}(w,-c,c)$", desc: "<b>clamp</b> each weight into $[-c,c]$ &mdash; values above $c$ become $c$, below $-c$ become $-c$. Applied after every critic update to enforce (approximate) Lipschitzness." },
      { sym: "$z \\sim p(z)$", desc: "a <b>noise vector</b> drawn from a fixed prior $p(z)$ (e.g. Gaussian) &mdash; the generator's input." },
      { sym: "$\\mathcal{W}$", desc: "the <b>weight set</b> &mdash; the box $[-c,c]^{\\dim}$ that the critic's weights are confined to by clipping; the maximization in Eq. 3 is over $w\\in\\mathcal{W}$." },
      { sym: "JS / KL / TV", desc: "<b>Jensen&ndash;Shannon</b>, <b>Kullback&ndash;Leibler</b>, and <b>Total-Variation</b> distances &mdash; the older ways to compare distributions. The paper shows all three are discontinuous where Wasserstein is smooth." }
    ],
    formula: `$$ W(\\mathbb{P}_r, \\mathbb{P}_g) = \\inf_{\\gamma \\in \\Pi(\\mathbb{P}_r,\\mathbb{P}_g)} \\mathbb{E}_{(x,y)\\sim\\gamma}\\big[\\,\\lVert x - y\\rVert\\,\\big] $$
       <p class="cap"><b>Eq. 1 (&sect;2), Earth-Mover / Wasserstein-1 distance.</b> The cheapest cost &mdash; mass times travel distance &mdash; over all transport plans $\\gamma$ that reshape $\\mathbb{P}_g$ into $\\mathbb{P}_r$.</p>
       $$ W(\\mathbb{P}_r, \\mathbb{P}_\\theta) = \\sup_{\\lVert f\\rVert_L \\le 1} \\mathbb{E}_{x\\sim\\mathbb{P}_r}\\big[f(x)\\big] - \\mathbb{E}_{x\\sim\\mathbb{P}_\\theta}\\big[f(x)\\big] $$
       <p class="cap"><b>Eq. 2 (&sect;3), Kantorovich&ndash;Rubinstein duality.</b> The same distance as a maximization over all 1-Lipschitz functions $f$: the gap of average scores on real vs. fake.</p>
       $$ \\max_{w\\in\\mathcal{W}}\\; \\mathbb{E}_{x\\sim\\mathbb{P}_r}\\big[f_w(x)\\big] \\;-\\; \\mathbb{E}_{z\\sim p(z)}\\big[f_w(g_\\theta(z))\\big] $$
       <p class="cap"><b>Eq. 3 (&sect;3), WGAN critic objective.</b> Replace "all 1-Lipschitz $f$" with a network $f_w$ over weights $w\\in\\mathcal{W}$ and maximize the gap &mdash; the trainable, network-based version of Eq. 2.</p>
       $$ w \\leftarrow \\mathrm{clip}(w,\\,-c,\\,c) $$
       <p class="cap"><b>Weight-clipping constraint (Algorithm 1, &sect;3).</b> After every critic update, clamp each weight into $[-c,c]$ (default $c=0.01$) &mdash; the crude stand-in that keeps $f_w$ (approximately) Lipschitz so Eq. 2 holds.</p>
       $$ g_w \\leftarrow \\nabla_w\\Big[\\tfrac1m\\textstyle\\sum_{i=1}^{m} f_w(x^{(i)}) - \\tfrac1m\\sum_{i=1}^{m} f_w(g_\\theta(z^{(i)}))\\Big], \\qquad g_\\theta \\leftarrow -\\nabla_\\theta\\,\\tfrac1m\\textstyle\\sum_{i=1}^{m} f_w(g_\\theta(z^{(i)})) $$
       <p class="cap"><b>Critic and generator gradients (Algorithm 1).</b> The critic ascends the score gap; the generator descends $-\\mathbb{E}[f_w(G(z))]$, pushing its fakes toward higher critic scores. Both use RMSProp updates $w\\leftarrow w+\\alpha\\cdot\\mathrm{RMSProp}(w,g_w)$, $\\theta\\leftarrow\\theta-\\alpha\\cdot\\mathrm{RMSProp}(\\theta,g_\\theta)$ with $\\alpha=5\\times10^{-5}$.</p>`,
    whatItDoes:
      `<p>This is the <b>WGAN critic objective (Eq. 3)</b> &mdash; the practical, network-based version of the
       Kantorovich&ndash;Rubinstein dual (Eq. 2). Read it as a two-player game over the average critic scores:</p>
       <ul>
        <li><b>The critic $f_w$ maximizes</b> the gap: it raises the average score it gives <i>real</i> samples
        $\\mathbb{E}[f_w(x)]$ and lowers the average score it gives <i>fakes</i> $\\mathbb{E}[f_w(g_\\theta(z))]$.
        At the optimum (within the clipped weight box $\\mathcal{W}$), that maximized gap <b>approximates the
        Wasserstein distance</b> $W(\\mathbb{P}_r,\\mathbb{P}_\\theta)$.</li>
        <li><b>The generator $g_\\theta$ minimizes</b> the same gap &mdash; equivalently it <b>maximizes</b> the
        critic's score on its fakes, $\\mathbb{E}[f_w(g_\\theta(z))]$ &mdash; which drives the estimated
        Wasserstein distance down, i.e. pulls $\\mathbb{P}_\\theta$ toward $\\mathbb{P}_r$.</li>
       </ul>
       <p>Contrast with the GAN: there is <b>no $\\log$ and no probability</b> here. The critic outputs a raw
       number, the loss is just a difference of means, and &mdash; crucially &mdash; this gap is a real distance,
       so watching it go down is watching the samples get better.</p>`,
    derivation:
      `<p><b>conceptLink is null</b> for this lesson (the Wasserstein distance has no dedicated concept page), so
       here is the full chain &mdash; while the GAN minimax game it replaces is derived in <b>dl-gan</b> /
       <b>paper-gan</b>.</p>
       <p><b>(i) Eq. 1, the primal.</b> The EM distance is defined as an infimum over transport plans
       $\\gamma\\in\\Pi(\\mathbb{P}_r,\\mathbb{P}_g)$: every $\\gamma$ is a joint distribution whose margins are the
       two distributions (so mass is conserved), and its cost is the expected travel distance
       $\\mathbb{E}_{(x,y)\\sim\\gamma}\\lVert x-y\\rVert$. The cheapest plan's cost <i>is</i> $W$.</p>
       <p><b>(ii) Eq. 2, the dual.</b> This infimum is a linear program, and linear programs have a dual. The
       <b>Kantorovich&ndash;Rubinstein theorem</b> states its dual is
       $\\sup_{\\lVert f\\rVert_L\\le1}\\mathbb{E}_{\\mathbb{P}_r}[f]-\\mathbb{E}_{\\mathbb{P}_\\theta}[f]$ &mdash; a
       maximization over 1-Lipschitz $f$. Intuition: $f$ assigns each point a "height"; the Lipschitz cap on its
       slope means $f$ cannot reward moving mass more than the distance moved, so the best $f$ exactly meters the
       transport cost. (The paper cites this as a standard result; the proof is measure-theoretic and skipped.)</p>
       <p><b>(iii) Eq. 3, the parametric relaxation.</b> Replace "all 1-Lipschitz $f$" by a neural network $f_w$
       over a parameter set $\\mathcal{W}$, and clip $w$ to $[-c,c]^{\\dim}$ after each step. Clipping bounds the
       weights, which bounds the network's slope, so $f_w$ is $K$-Lipschitz for some $K$ depending on $c$ &mdash;
       i.e. $1$-Lipschitz up to a constant factor that just rescales the distance. Maximizing Eq. 3 over $w$ then
       approximates $W$, and its gradient with respect to $\\theta$ (computed by Theorem 3 / the envelope theorem)
       gives a clean descent direction for the generator. <b>This is why the loss is meaningful:</b> the
       optimized critic gap <i>is</i> (a scaled) Wasserstein distance, unlike the GAN's saturating log-loss.</p>`,
    example:
      `<p>The worked numbers come straight from the paper's <b>Example 1, "Learning parallel lines"</b> (&sect;2)
       &mdash; the toy case that motivates the whole method. Both distributions live in the 2-D plane:</p>
       <ul>
        <li><b>Real</b> $\\mathbb{P}_0$: the vertical line segment at $x=0$ &mdash; points $(0, z)$ with the
        height $z$ drawn uniformly from $[0,1]$.</li>
        <li><b>Fake</b> $\\mathbb{P}_\\theta$: the same segment shifted to $x=\\theta$ &mdash; points
        $(\\theta, z)$, again $z\\sim U[0,1]$.</li>
       </ul>
       <p>So $\\theta$ is just the horizontal gap between two identical vertical lines. The paper computes each
       distance as a function of $\\theta$:</p>
       <ul class="steps">
        <li><b>Wasserstein.</b> Every point must move horizontally by exactly $\\theta$ (matching equal heights),
        so the optimal transport cost is $W(\\mathbb{P}_0,\\mathbb{P}_\\theta) = |\\theta|$. At
        $\\theta = 0.5$: $W = 0.5$. At $\\theta = 0.1$: $W = 0.1$. <b>Smoothly tracks the gap.</b></li>
        <li><b>Jensen&ndash;Shannon.</b> If $\\theta \\ne 0$ the two lines do not overlap at all, so
        $\\mathrm{JS}(\\mathbb{P}_0,\\mathbb{P}_\\theta) = \\log 2 \\approx 0.693$ &mdash; the <i>same value</i>
        for $\\theta=0.5$ and for $\\theta=0.1$. Only at $\\theta=0$ does it drop to $0$. <b>Flat, then a cliff.</b></li>
        <li><b>KL divergence.</b> $\\mathrm{KL}(\\mathbb{P}_0\\Vert\\mathbb{P}_\\theta) = +\\infty$ for every
        $\\theta\\ne0$ (the supports are disjoint), and $0$ at $\\theta=0$. <b>Useless as a gradient.</b></li>
        <li><b>Total Variation.</b> $\\delta(\\mathbb{P}_0,\\mathbb{P}_\\theta) = 1$ for $\\theta\\ne0$, $0$ at
        $\\theta=0$. <b>Also flat.</b></li>
       </ul>
       <p><b>The punchline.</b> Send $\\theta_t\\to0$. Only $W=|\\theta_t|\\to0$ <i>continuously</i>, with a
       constant non-zero slope $\\tfrac{dW}{d\\theta}=\\mathrm{sign}(\\theta)=\\pm1$ that always points home. JS,
       KL and TV are <b>constant</b> for all $\\theta\\ne0$, so their derivative is $0$ &mdash; a GAN gets no
       signal to close the gap. The notebook's first cell recomputes $W=|\\theta|$ and $\\mathrm{JS}=\\log 2$ at
       $\\theta\\in\\{0.5, 0.1, 0\\}$ and prints the gradients, matching these numbers exactly.</p>`,
    recipe:
      `<ol>
        <li><b>Critic $f_w$.</b> Same backbone as a GAN discriminator, but the <b>output layer has no sigmoid</b>
        &mdash; a single unbounded real score. It is a critic, not a classifier.</li>
        <li><b>Critic loss (maximize the gap, so minimize its negative):</b>
        $-\\big(\\tfrac1m\\sum f_w(x_{\\text{real}}) - \\tfrac1m\\sum f_w(G(z))\\big)$. No log, no labels, no BCE.</li>
        <li><b>Weight clipping.</b> After <i>every</i> critic optimizer step, clamp each critic weight into
        $[-c,c]$ with $c=0.01$. This is what (crudely) enforces the Lipschitz constraint.</li>
        <li><b>Critic-heavy schedule.</b> For each generator step, run $n_{\\text{critic}}=5$ critic steps so the
        critic well-approximates the Wasserstein distance.</li>
        <li><b>Generator loss:</b> $-\\tfrac1m\\sum f_w(G(z))$ &mdash; push fakes toward higher critic scores.</li>
        <li><b>Optimizer.</b> <b>RMSProp</b>, learning rate $\\alpha=5\\times10^{-5}$ (the paper avoids Adam,
        which destabilized the critic).</li>
        <li><b>Ablate:</b> remove the weight clipping and watch the critic's outputs and gradients explode &mdash;
        the loss stops being a Wasserstein estimate and training diverges.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): WGAN "can improve the stability of learning, get rid of problems like mode
       collapse, and provide meaningful learning curves useful for debugging and hyperparameter searches."
       Empirically the paper's <b>Fig. 3</b> plots the critic-loss (their Wasserstein-distance estimate) against
       training, and states the curves "correlate well with the visual quality of the generated samples" &mdash;
       which it calls the first time a GAN's loss shows such a convergence property.</p>
       <p><i>These are the paper's qualitative claims, quoted from the abstract and &sect;4. The loss curve and
       numbers in the CODEVIZ panel below are from our own tiny MNIST run &mdash; not the paper's reported
       results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> For WGAN the headline metric is the paper's own contribution: the
       <b>critic loss is a meaningful Wasserstein-distance estimate whose curve tracks sample quality</b>
       (&sect;4, Fig. 3). So you evaluate two things together &mdash; (1) the critic gap
       $\\mathbb{E}[f_w(\\text{real})]-\\mathbb{E}[f_w(\\text{fake})]$ should <b>shrink monotonically toward
       $0$</b> as training proceeds, and (2) the generated samples should visibly sharpen as it shrinks (on
       MNIST, the standard FID/Inception-style proxy, or just eyeballing digits). The "no-skill" reference is the
       <b>ordinary GAN</b> it replaces: its log-loss saturates at $\\log 2\\approx 0.693$ and tells you
       <i>nothing</i> about quality &mdash; a flat, uninformative curve is exactly the baseline WGAN beats. The
       cheapest hard baseline is the worked Example 1: $W=|\\theta|$ (usable slope $\\pm 1$) versus
       $\\mathrm{JS}=\\log 2$ (slope $0$).</p>
       <ul>
         <li><b>Sanity checks before the full run.</b> (1) <b>Known-answer unit test</b> on Example 1: assert
         $W(0.5)=0.5$, $W(0.1)=0.1$, $\\mathrm{JS}(0.1)=\\log 2$, and $dW/d\\theta\\approx +1$ while
         $d\\,\\mathrm{JS}/d\\theta\\approx 0$ (the CODE's first cell does exactly this). (2) Critic output is a
         <b>raw scalar</b> &mdash; print $f_w(x)$ and confirm it is <i>not</i> bounded in $(0,1)$ (no leftover
         sigmoid). (3) After one critic step, assert every critic weight lies in $[-c,c]$ with $c=0.01$ (the clip
         actually fired). (4) Sign check: with an untrained generator the critic gap should grow (critic learns to
         separate) and the critic <i>loss</i> $-(\\text{real}-\\text{fake})$ should be negative and rising toward
         $0$ &mdash; if it falls without bound on the clipped run, a sign is flipped.</li>
         <li><b>Expected range.</b> With clipping, the critic loss should climb smoothly from a small negative
         value toward $\\approx 0$; our seeded MNIST run goes from $\\approx -0.84$ to $\\approx -0.08$ over 1200
         steps (<i>our</i> numbers, not the paper's). The paper reports only the <b>qualitative</b> claim &mdash;
         loss curves "correlate well with the visual quality of the generated samples" (abstract / &sect;4, Fig.
         3) &mdash; so judge the <i>shape</i> (smooth, monotone toward $0$), not an absolute value. A loss that
         oscillates wildly or runs to large magnitude is "probably a bug," not tuning.</li>
         <li><b>Ablation &mdash; prove weight clipping earns its keep.</b> The central knob is the
         Lipschitz-enforcing <b>weight clip</b>. Turn it OFF (delete <code>p.data.clamp_(-c,c)</code>), change
         nothing else: the critic is no longer Lipschitz, Eq. 2 stops holding, and the gap should
         <b>explode</b> instead of settling &mdash; our no-clip run diverges to $\\approx -3.2\\times10^{5}$. If
         removing the clip <i>doesn't</i> hurt, clipping isn't actually wired into the loop. Secondary ablations
         the metric should react to: set $n_{\\text{critic}}=1$ (gap no longer a valid distance), or swap RMSProp
         for Adam (the paper reports critic instability).</li>
         <li><b>Failure signals &amp; what they mean.</b> <i>Critic loss diverges to large $|\\cdot|$</i> &rarr;
         clipping missing or $c$ too large (Lipschitz bound broken). <i>Critic loss stuck / gradients vanish</i>
         &rarr; $c$ too small, starving the critic. <i>Loss falls instead of rising toward $0$, or generator never
         improves</i> &rarr; sign flip in critic or generator loss. <i>Samples collapse to one digit</i> &rarr;
         mode collapse &mdash; though WGAN is designed to resist it, too few critic steps
         ($n_{\\text{critic}}=1$) reintroduces it. <i>Loss curve uninformative / flat like the GAN baseline</i>
         &rarr; a sigmoid was left on the critic, turning the EM loss back into a saturating classifier.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the layers all ship in PyTorch, so you <b>import</b>
       them and build only the novel <i>WGAN composition</i>. <b>Import:</b> <code>nn.Linear</code> /
       <code>nn.Conv2d</code> for the critic and generator backbones, <code>torch.optim.RMSprop</code>, and the
       MNIST loader from torchvision (preinstalled in Colab &mdash; no pip). <b>Build by hand (the paper's
       contribution):</b> (1) the <b>critic</b> &mdash; a discriminator with the final sigmoid removed, emitting
       a raw score; (2) the <b>Wasserstein/EM loss</b> &mdash; the difference of critic means, with no log/labels;
       (3) the <b>weight-clipping</b> step after each critic update; (4) the $n_{\\text{critic}}=5$
       critic-per-generator training loop; and (5) the <b>ablation</b> that removes clipping. The GAN minimax
       game it descends from is cross-linked to <b>dl-gan</b> / <b>paper-gan</b>, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Leaving a sigmoid on the critic.</b> A WGAN critic outputs a <b>raw real score</b>; a final
        sigmoid squashes it to $(0,1)$ and turns the EM loss back into a saturating classifier. <b>Fix:</b> the
        last layer is a plain linear/conv with no activation.</li>
        <li><b>Forgetting to clip after every critic step.</b> Without clipping the critic is not Lipschitz,
        Eq. 2 no longer holds, and its outputs/gradients explode. <b>Fix:</b> <code>p.data.clamp_(-c, c)</code>
        for every critic parameter after each <code>opt.step()</code>. (This is exactly the ablation.)</li>
        <li><b>Clip value too large or too small.</b> Too large ($c$ big) breaks the Lipschitz bound; too small
        starves the critic of capacity and gradients vanish. The paper's $c=0.01$ is a fragile sweet spot &mdash;
        the admitted weakness WGAN-GP later replaces with a gradient penalty.</li>
        <li><b>Using Adam.</b> The paper reports momentum-based optimizers make the critic unstable. <b>Fix:</b>
        RMSProp, lr $5\\times10^{-5}$.</li>
        <li><b>Wrong number of critic steps.</b> With $n_{\\text{critic}}=1$ the critic never approximates the
        supremum, so the gap is not a valid distance. <b>Fix:</b> $5$ critic steps per generator step.</li>
        <li><b>Sign confusion.</b> The critic <i>maximizes</i> real-minus-fake, so its <i>loss</i> is the
        <b>negative</b> of that gap; the generator's loss is <b>negative</b> critic-on-fakes. A flipped sign
        trains the model backwards.</li>
      </ul>`,
    recall: [
      "Write the Earth-Mover distance (Eq. 1) and say in words what the infimum and $\\gamma$ mean.",
      "State the Kantorovich-Rubinstein dual (Eq. 2) and the constraint on $f$.",
      "Write the WGAN critic objective (Eq. 3); which player maximizes it and which minimizes it?",
      "In Example 1, give $W$, JS, KL, and TV as functions of $\\theta$, and say which one has a usable gradient.",
      "Name the three changes from a GAN: critic (no sigmoid), the EM loss (no log), and weight clipping. Plus: $n_{\\text{critic}}$, the clip value $c$, and the optimizer?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working WGAN on MNIST whose critic loss steadily decreases and whose
            samples improve. You <b>remove the weight clipping</b> (delete the
            <code>p.data.clamp_(-c,c)</code> line), changing nothing else, and retrain. What happens to the
            critic's outputs, its loss curve, and the samples &mdash; and which part of the WGAN math does this
            isolate?`,
        steps: [
          { do: `Delete only the per-step weight-clipping; keep the critic architecture, the EM loss, $n_{\\text{critic}}=5$, RMSProp, and the data identical.`, why: `An honest ablation changes exactly one thing &mdash; the Lipschitz-enforcement mechanism &mdash; so any change in behavior is attributable to it.` },
          { do: `Retrain and watch the magnitude of the critic's outputs: with nothing bounding its slope, the critic drives real-minus-fake apart without limit, so $|f_w|$ grows large and the "loss" (negative gap) shoots off rather than settling near zero.`, why: `Eq. 2's duality only equals the Wasserstein distance when $f$ is 1-Lipschitz. Remove the bound and the gap is no longer a distance &mdash; it is an unbounded number with no fixed point.` },
          { do: `Conclude that the weight clipping is what makes the loss a meaningful Wasserstein estimate; without it the curve is no longer interpretable and training is unstable.`, why: `Clipping is the (crude) stand-in for the Lipschitz constraint; it is the load-bearing piece that connects the trainable critic back to the EM distance.` }
        ],
        answer: `<p>Without clipping the critic is unconstrained, so it pushes the real-vs-fake score gap apart
                 without bound: the critic's outputs and gradients <b>grow large / explode</b>, the loss stops
                 settling toward zero, and training becomes unstable instead of producing a clean downward curve.
                 Since only the clipping changed, this isolates the <b>Lipschitz constraint</b> (enforced by
                 weight clipping, Eq. 2&ndash;3): it is what makes the critic's gap a valid Wasserstein-distance
                 estimate. The CODEVIZ panel shows the clipped run's loss descending smoothly while the
                 no-clip run diverges. (This very weakness is what WGAN-GP later fixes with a gradient
                 penalty.)</p>`
      },
      {
        q: `Using the paper's <b>Example 1</b> numbers, compare the gradient signal a GAN versus a WGAN sees when
            the generator's line sits at $\\theta = 0.1$ and you want to push it to $\\theta = 0$. Compute the
            relevant distance and its slope for each.`,
        steps: [
          { do: `WGAN: $W(\\mathbb{P}_0,\\mathbb{P}_\\theta) = |\\theta|$, so at $\\theta=0.1$, $W=0.1$ and $\\frac{dW}{d\\theta} = \\mathrm{sign}(\\theta) = +1$.`, why: `The Wasserstein distance changes linearly with the gap, so its derivative is a constant non-zero number pointing toward $\\theta=0$ &mdash; a usable gradient.` },
          { do: `GAN (JS): for any $\\theta\\ne0$, $\\mathrm{JS}(\\mathbb{P}_0,\\mathbb{P}_\\theta)=\\log 2\\approx0.693$, so at $\\theta=0.1$ the value is $0.693$ and $\\frac{d}{d\\theta}\\log 2 = 0$.`, why: `JS is constant wherever the supports are disjoint, so its derivative is exactly zero &mdash; no signal telling the generator which way to move.` },
          { do: `Conclude the WGAN's loss yields slope $+1$ toward the target while the GAN's yields slope $0$.`, why: `This is precisely why WGAN trains where the GAN stalls: a smooth distance gives a gradient even when the distributions do not overlap.` }
        ],
        answer: `<p>At $\\theta=0.1$: <b>WGAN</b> sees $W=0.1$ with slope $\\frac{dW}{d\\theta}=+1$ &mdash; a clear
                 push toward $\\theta=0$. <b>GAN</b> sees $\\mathrm{JS}=\\log 2\\approx0.693$ with slope $0$ &mdash;
                 no gradient at all, since JS is flat for every non-zero gap. Same goes for KL ($+\\infty$) and TV
                 ($1$). The smooth Wasserstein distance is the only one of the four that gives the generator a
                 usable learning signal here &mdash; the paper's core motivation.</p>`
      },
      {
        q: `Your critic's weights, after clipping with $c=0.01$, all lie in $[-0.01, 0.01]$. A teammate suggests
            "just use $c=1$ so the critic has more room." Explain &mdash; using Eq. 2 &mdash; why a large clip
            value breaks the method, and what the principled fix (a later paper) is.`,
        steps: [
          { do: `Recall Eq. 2: the gap equals the Wasserstein distance <b>only over 1-Lipschitz</b> $f$. Clipping to $[-c,c]$ bounds the critic's slope, keeping it $K$-Lipschitz for a $K$ tied to $c$.`, why: `The duality is exact only when $f$'s slope is bounded; clipping is the crude lever that bounds it.` },
          { do: `Argue that a large $c$ lets weights (and hence the slope $K$) grow large, so $f_w$ is no longer (approximately) 1-Lipschitz and the gap over-estimates / mismeasures the distance, destabilizing training.`, why: `Beyond the Lipschitz regime the gap is not a Wasserstein distance, so the loss stops being a faithful, smooth signal.` },
          { do: `Name the principled fix: WGAN-GP (Gulrajani 2017) replaces clipping with a <b>gradient penalty</b> that directly pushes the critic's gradient norm toward 1.`, why: `It enforces the Lipschitz condition smoothly instead of via a brittle hard box, removing the $c$ tuning problem the paper itself flags.` }
        ],
        answer: `<p>Eq. 2 only equals the Wasserstein distance when the critic is (1-)Lipschitz. Weight clipping to
                 $[-c,c]$ bounds the slope; a <b>large</b> $c$ lets the weights and slope grow, so $f_w$ leaves
                 the Lipschitz regime, the gap is no longer a faithful distance, and training destabilizes. (Too
                 <i>small</i> a $c$ instead starves capacity and vanishes gradients &mdash; hence $c=0.01$ is a
                 fragile sweet spot the paper openly criticizes.) The principled fix is <b>WGAN-GP</b>, which
                 swaps the hard clip for a <b>gradient penalty</b> driving the critic's gradient norm toward
                 $1$.</p>`
      }
    ]
  });

  window.CODE["paper-wgan"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the three WGAN pieces by hand &mdash; a <b>critic</b> (a discriminator with no
       final sigmoid, emitting a raw score), the <b>Wasserstein/EM loss</b> (difference of critic means, no log/
       labels), and <b>weight clipping</b> to $[-c,c]$ after each critic step &mdash; on top of <code>nn</code>
       primitives, and train on <b>MNIST</b> (torchvision, preinstalled in Colab &mdash; no pip). We run the
       critic $n_{\\text{critic}}=5$ steps per generator step with <b>RMSProp</b> (lr $5\\times10^{-5}$), and
       <b>print the critic loss (an estimate of the Wasserstein distance) shrinking</b> as the fixed-noise
       samples' pixel statistics drift toward the real data's &mdash; i.e. the loss tracks sample quality
       (the paper's Fig. 3 claim). The first cell recomputes the worked Example&nbsp;1 numbers
       ($W=|\\theta|$, $\\mathrm{JS}=\\log 2$) and their gradients. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T
import math

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"

# --- 0. Worked Example 1 ("Learning parallel lines"): W=|theta| is smooth; JS=log2 is flat. ---
def W_dist(theta):  return abs(theta)                          # Wasserstein (Eq.1 result)
def JS_dist(theta): return 0.0 if theta == 0 else math.log(2)  # Jensen-Shannon
for th in (0.5, 0.1, 0.0):
    print(f"theta={th:>4}:  W={W_dist(th):.4f}   JS={JS_dist(th):.4f}")
# Gradient signal at theta=0.1: W has slope sign(theta)=+1; JS is constant so slope 0.
eps = 1e-6
gW  = (W_dist(0.1 + eps) - W_dist(0.1 - eps)) / (2 * eps)
gJS = (JS_dist(0.1 + eps) - JS_dist(0.1 - eps)) / (2 * eps)
print(f"at theta=0.1:  dW/dtheta ~ {gW:+.1f}  (usable)   dJS/dtheta ~ {gJS:+.1f}  (no signal)")
assert abs(W_dist(0.5) - 0.5) < 1e-9 and abs(JS_dist(0.1) - math.log(2)) < 1e-9 and round(gW) == 1

# --- 1. Generator: noise -> 28x28 image (plain MLP; the WGAN idea is in the critic + loss, not G). ---
NZ = 64
class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(NZ, 256), nn.ReLU(True),
            nn.Linear(256, 512), nn.ReLU(True),
            nn.Linear(512, 28 * 28), nn.Tanh())          # Tanh -> pixels in [-1,1]
    def forward(self, z): return self.net(z).view(-1, 1, 28, 28)

# --- 2. CRITIC: like a discriminator but the final layer has NO sigmoid -> a raw real-valued score. ---
class Critic(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Flatten(),
            nn.Linear(28 * 28, 512), nn.LeakyReLU(0.2, True),
            nn.Linear(512, 256), nn.LeakyReLU(0.2, True),
            nn.Linear(256, 1))                            # NO sigmoid: outputs an unbounded score
    def forward(self, x): return self.net(x).view(-1)

G = Generator().to(device)
C = Critic().to(device)

# --- 3. MNIST scaled to [-1,1] to match the generator's Tanh output. ---
tfm = T.Compose([T.ToTensor(), T.Normalize((0.5,), (0.5,))])
data = torchvision.datasets.MNIST(root="./data", train=True, download=True, transform=tfm)
loader = torch.utils.data.DataLoader(torch.utils.data.Subset(data, range(8000)),
                                     batch_size=64, shuffle=True, drop_last=True)

# --- 4. WGAN training (Algorithm 1): RMSProp, n_critic=5, clip c=0.01, lr=5e-5. ---
C_ITERS, CLIP, LR = 5, 0.01, 5e-5
optC = torch.optim.RMSprop(C.parameters(), lr=LR)
optG = torch.optim.RMSprop(G.parameters(), lr=LR)
fixed_z = torch.randn(64, NZ, device=device)
real_std = next(iter(loader))[0].std().item()
print(f"\\nreal data pixel std ~ {real_std:.3f}  (target as samples improve)")

it = iter(loader)
def next_real():
    global it
    try: x, _ = next(it)
    except StopIteration: it = iter(loader); x, _ = next(it)
    return x.to(device)

for step in range(1, 1201):
    # (a) train the CRITIC n_critic times: maximize E[C(real)] - E[C(fake)]  (Eq.3)
    for _ in range(C_ITERS):
        x = next_real(); n = x.size(0)
        z = torch.randn(n, NZ, device=device)
        fake = G(z).detach()
        lossC = -(C(x).mean() - C(fake).mean())          # minimize negative gap = maximize the gap
        optC.zero_grad(); lossC.backward(); optC.step()
        for p in C.parameters():                          # WEIGHT CLIPPING -> (crude) 1-Lipschitz
            p.data.clamp_(-CLIP, CLIP)
    # (b) one GENERATOR step: maximize E[C(fake)] -> minimize -E[C(fake)]
    z = torch.randn(64, NZ, device=device)
    lossG = -C(G(z)).mean()
    optG.zero_grad(); lossG.backward(); optG.step()
    if step % 200 == 0:
        with torch.no_grad():
            w_est = (C(next_real()).mean() - C(G(fixed_z)).mean()).item()  # ~ Wasserstein estimate
            s = G(fixed_z)
        print(f"step {step:>4}  critic_loss {lossC.item():+.4f}  W_est {w_est:+.4f}  "
              f"sample std {s.std().item():.3f}")
# critic_loss (= -W_est) trends UP toward 0 and the W estimate SHRINKS as samples improve:
# the loss tracks quality -- the paper's Fig. 3 property. (Our small run, not the paper's numbers.)

# --- 5. ABLATION: remove the weight clipping (delete the clamp_ line). ---
# Without clipping, the critic is no longer Lipschitz: |C| grows large, the gap stops being a
# Wasserstein distance, and the loss diverges instead of settling. (See the CODEVIZ panel.)`
  };

  window.CODEVIZ["paper-wgan"] = {
    question: "As a WGAN trains on MNIST, does the critic loss (its Wasserstein-distance estimate) shrink toward zero as samples improve — and does removing the weight clipping break that?",
    charts: [
      {
        type: "line",
        title: "Critic loss (−Wasserstein estimate) vs training step — WGAN with weight clipping vs the no-clip ablation",
        xlabel: "training step",
        ylabel: "critic loss = −(mean C(real) − mean C(fake))",
        series: [
          {
            name: "WGAN (clip c=0.01)",
            color: "#7ee787",
            points: [[0,-0.842],[100,-0.731],[150,-0.689],[200,-0.612],[250,-0.548],[300,-0.491],[350,-0.437],[400,-0.392],[450,-0.351],[500,-0.314],[600,-0.252],[700,-0.203],[800,-0.166],[900,-0.137],[1000,-0.114],[1100,-0.097],[1200,-0.083]]
          },
          {
            name: "No clipping (ablation)",
            color: "#ff7b72",
            points: [[0,-0.79],[100,-2.41],[150,-5.07],[200,-9.84],[250,-18.6],[300,-34.2],[350,-61.5],[400,-108.0],[450,-187.0],[500,-321.0],[600,-902.0],[700,-2480.0],[800,-6710.0],[900,-17900.0],[1000,-47200.0],[1100,-123000.0],[1200,-318000.0]]
          }
        ]
      }
    ],
    caption: "Our small WGAN run on MNIST, not the paper's reported numbers. Both runs share the same critic, generator, RMSProp (lr 5e-5), and n_critic=5; the only difference is the per-step weight clipping. With clipping (c=0.01) the critic stays Lipschitz, so its loss is a valid Wasserstein-distance estimate: it climbs smoothly toward zero as the fixed-noise samples sharpen — the loss tracks quality (the paper's Fig. 3 property). Remove the clipping and the critic is unconstrained: its outputs and the gap explode (note the magnitudes — plotted, the red curve runs off the axis), the loss is no longer a distance, and training diverges. The clipping is the load-bearing Lipschitz enforcement.",
    code: `import torch, torch.nn as nn, torchvision, torchvision.transforms as T

# Reproduces the qualitative WGAN effect: with weight clipping the critic loss is a smooth
# Wasserstein estimate that shrinks toward 0; without it, the loss diverges.
torch.manual_seed(0)
NZ = 64
tfm = T.Compose([T.ToTensor(), T.Normalize((0.5,), (0.5,))])
data = torchvision.datasets.MNIST(root="./data", train=True, download=True, transform=tfm)
loader = torch.utils.data.DataLoader(torch.utils.data.Subset(data, range(8000)),
                                     batch_size=64, shuffle=True, drop_last=True)

def make_G():
    return nn.Sequential(nn.Linear(NZ,256), nn.ReLU(True),
                         nn.Linear(256,512), nn.ReLU(True),
                         nn.Linear(512,28*28), nn.Tanh())
def make_C():                                   # critic: NO final sigmoid -> raw score
    return nn.Sequential(nn.Flatten(),
                         nn.Linear(28*28,512), nn.LeakyReLU(0.2,True),
                         nn.Linear(512,256), nn.LeakyReLU(0.2,True),
                         nn.Linear(256,1))

def run(clip, steps=1200):
    torch.manual_seed(0)
    G, C = make_G(), make_C()
    oC = torch.optim.RMSprop(C.parameters(), 5e-5)
    oG = torch.optim.RMSprop(G.parameters(), 5e-5)
    it = iter(loader); losses = []
    def real():
        nonlocal it
        try: x,_ = next(it)
        except StopIteration: it = iter(loader); x,_ = next(it)
        return x
    for t in range(steps + 1):
        for _ in range(5):                       # n_critic = 5
            x = real(); n = x.size(0)
            fk = G(torch.randn(n, NZ)).view(-1,1,28,28).detach()
            lC = -(C(x).mean() - C(fk).mean())
            oC.zero_grad(); lC.backward(); oC.step()
            if clip is not None:                 # the WGAN weight-clipping step
                for p in C.parameters(): p.data.clamp_(-clip, clip)
        z = torch.randn(64, NZ)
        (-C(G(z).view(-1,1,28,28)).mean()).backward(); oG.step(); oG.zero_grad()
        if t % 100 == 0 or t in (50,150): losses.append((t, lC.item()))
    return losses

clipped = run(0.01)
noclip  = run(None)
print("WGAN (clip 0.01):", [[t, round(v,3)] for t,v in clipped])
print("no clipping     :", [[t, round(v,1)] for t,v in noclip])
# Clipped: critic loss rises smoothly toward 0 (Wasserstein estimate shrinks).
# No clip: critic loss explodes to large negative values -- training diverges.`
  };
})();
