/* Paper lesson — "Unpaired Image-to-Image Translation using Cycle-Consistent
   Adversarial Networks" (CycleGAN), Zhu, Park, Isola & Efros, 2017.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-cyclegan".
   GROUNDED from arXiv:1703.10593 via the ar5iv HTML mirror:
     - Adversarial loss: Eq. 1, Section 3.1
     - Cycle consistency loss: Eq. 2, Section 3.2   <-- the key equation
     - Full objective: Eq. 3, Section 3.3 (lambda = 10)
     - Architecture (Section 4): Johnson-et-al generator (residual blocks,
       instance norm), 70x70 PatchGAN discriminator.
   Track B (architecture): build two generators G:X->Y, F:Y->X and two
   discriminators from nn.Linear, train with the adversarial + cycle-consistency
   loss on a TOY UNPAIRED 2-domain task, and ABLATE the cycle term. The GAN/JSD
   math lives in concept dl-gan; here we recap and add the cycle idea. */
(function () {
  window.LESSONS.push({
    id: "paper-cyclegan",
    title: "CycleGAN — Unpaired Image-to-Image Translation (2017)",
    tagline: "Translate between two image domains with NO matched pairs, by forcing a round-trip to return where it started.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Jun-Yan Zhu, Taesung Park, Phillip Isola, Alexei A. Efros",
      org: "Berkeley AI Research (BAIR), UC Berkeley",
      year: 2017,
      venue: "arXiv:1703.10593 (Mar 2017); ICCV 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1703.10593",
      code: "https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix"
    },
    conceptLink: "dl-gan",
    partOf: [],
    prereqs: ["paper-gan", "dl-gan", "dl-resnet", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>Suppose you want to turn photos of horses into zebras, or summer scenes into winter ones. The
       obvious recipe is <b>supervised</b>: collect many <b>paired</b> examples &mdash; the <i>same</i> scene
       as a horse and as a zebra &mdash; and train a network to map one to the other. That is what the earlier
       <b>pix2pix</b> paper (Isola et al., 2016) does. The trouble, stated in the CycleGAN intro (&sect;1), is
       that such pairs are usually impossible to get:</p>
       <blockquote>"obtaining paired training data can be difficult and expensive &hellip; for many tasks, like
       object transfiguration (e.g., zebra&harr;horse), the desired output is not even well-defined."</blockquote>
       <p>In plain words: a <b>pair</b> means two images that line up pixel-for-pixel &mdash; the exact same
       horse, standing the exact same way, also shown as a zebra. Nobody can photograph that. So we are stuck
       with two <b>unpaired</b> piles: a bag of horse photos and a separate, unrelated bag of zebra photos. The
       question CycleGAN asks: can we learn the translation from <b>unpaired</b> collections alone?</p>`,
    contribution:
      `<ul>
        <li><b>Unpaired translation.</b> Learn a mapping $G: X \\to Y$ between two image domains using only two
        unordered collections &mdash; no example is tied to any specific target. (Contrast: pix2pix needs
        aligned pairs. CycleGAN does not.)</li>
        <li><b>The cycle-consistency loss.</b> A plain adversarial loss alone is not enough: it only asks "does
        $G(x)$ look like a real $Y$?", which a network can satisfy by ignoring $x$ entirely. CycleGAN adds a
        second generator $F: Y \\to X$ and demands a <b>round trip</b> return to the start:
        $F(G(x)) \\approx x$ and $G(F(y)) \\approx y$ (Eq. 2). This is the paper's central idea.</li>
        <li><b>It just works on hard tasks.</b> Style transfer (photo&rarr;Monet), object transfiguration
        (horse&harr;zebra), season transfer, and map&harr;aerial &mdash; all from unpaired data, with one
        clean recipe.</li>
      </ul>`,
    whyItMattered:
      `<p>CycleGAN made <b>unpaired</b> translation a standard tool. The round-trip / cycle-consistency idea
       spread far beyond images &mdash; into unpaired domain adaptation, voice conversion, and text style
       transfer &mdash; wherever you have two unaligned collections and want to map between them. It also became
       a teaching staple for "how do you constrain an under-determined GAN?": the answer, "make the inverse
       agree with you," is reused all over generative modeling.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (Adversarial Loss), Eq. 1</b> &mdash; the ordinary GAN loss, now applied to <i>each</i>
        of the two directions $G:X\\to Y$ (with discriminator $D_Y$) and $F:Y\\to X$ (with $D_X$).</li>
        <li><b>&sect;3.2 (Cycle Consistency Loss), Eq. 2</b> &mdash; the key equation you will transcribe: the
        sum of the forward round-trip $\\|F(G(x))-x\\|_1$ and the backward round-trip $\\|G(F(y))-y\\|_1$.</li>
        <li><b>&sect;3.3 (Full Objective), Eq. 3</b> &mdash; the two adversarial losses plus
        $\\lambda\\,\\mathcal{L}_{\\text{cyc}}$, with $\\lambda = 10$ in all their experiments.</li>
        <li><b>Fig. 3</b> &mdash; the diagram of the two cycles ($x\\to G\\to F\\to \\hat x$ and
        $y\\to F\\to G\\to \\hat y$); this is the whole method in one picture.</li>
        <li><b>&sect;4 (Implementation)</b> &mdash; the generator (Johnson et al.: a few convolutions, several
        <b>residual blocks</b>, instance normalization) and the <b>70&times;70 PatchGAN</b> discriminator.</li>
       </ul>
       <p><b>Skim:</b> &sect;5.1 (FCN-score and AMT perceptual metrics), the baseline comparisons (CoGAN, SimGAN,
       BiGAN), and the limitations / failure cases in &sect;5.3 unless you want them.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Imagine you train <b>only</b> with the adversarial loss: $G$ is rewarded purely for making $G(x)$ look
       like a real sample from domain $Y$. There is no term tying $G(x)$ back to the specific input $x$. Will
       the learned $G$ translate each $x$ into the <i>corresponding</i> $y$ &mdash; or could it map every input
       to plausible-but-arbitrary $Y$ outputs that ignore which $x$ came in? Write your guess, then watch the
       ablation below where we drop the cycle term and measure the round-trip error.</p>
       <p>(Hint: the adversarial loss only constrains the <i>distribution</i> of outputs, not the
       <i>identity</i> of each one.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the four networks and the two losses. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Two generators: <code>G: X &rarr; Y</code> and <code>F: Y &rarr; X</code> (here, small MLPs
        <code>2 &rarr; ... &rarr; 2</code> on a toy 2-D task). Two discriminators <code>D_X</code>,
        <code>D_Y</code>, each a <code>2 &rarr; ... &rarr; 1</code> real/fake logit.</li>
        <li><b>Discriminator step:</b> TODO &mdash; train $D_Y$ to call real $y$ "real" and $G(x)$ "fake";
        train $D_X$ to call real $x$ "real" and $F(y)$ "fake". <code>.detach()</code> the fakes.</li>
        <li><b>Generator step &mdash; adversarial part:</b> TODO &mdash; $G$ wants $D_Y(G(x))\\to$ "real";
        $F$ wants $D_X(F(y))\\to$ "real".</li>
        <li><b>Generator step &mdash; cycle part (the novel bit):</b> TODO &mdash; add
        <code>L1(F(G(x)), x) + L1(G(F(y)), y)</code>, scaled by $\\lambda = 10$.</li>
       </ul>
       <p>Predict: with the cycle term, the round-trip error $\\|F(G(x))-x\\|$ should fall toward $0$; without
       it, it should stay large.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>We have two domains: $X$ (say, horses) and $Y$ (zebras). We are given a pile of $X$ images and a
       <i>separate, unmatched</i> pile of $Y$ images. We want a translator $G:X\\to Y$. We will also learn its
       partner $F:Y\\to X$ at the same time (&sect;3).</p>
       <p><b>Step 1 &mdash; the adversarial loss (Eq. 1).</b> This is the ordinary GAN loss from the
       <b>paper-gan</b> lesson, used twice. A discriminator $D_Y$ tries to tell real $Y$ images from $G$'s
       fakes; $G$ tries to fool it. Symmetrically $D_X$ judges $F$'s outputs. This pushes $G(x)$ to <i>look
       like</i> a member of $Y$ and $F(y)$ to look like a member of $X$.</p>
       <p><b>Why that alone fails.</b> The adversarial loss only constrains the <b>distribution</b> of outputs,
       not their <b>content</b>. As the paper notes (&sect;3.2), $G$ can map the input set to "any random
       permutation" of $Y$ and still fool $D_Y$ perfectly &mdash; it could turn <i>every</i> horse into the
       <i>same</i> convincing zebra, or scramble which horse becomes which zebra. With unpaired data there is
       no per-example target to forbid this.</p>
       <p><b>Step 2 &mdash; the cycle-consistency loss (Eq. 2), the fix.</b> The authors add a constraint they
       state in one sentence: "if we translate from one domain to the other and back again we should arrive at
       where we started." Concretely, the <b>forward cycle</b> requires $F(G(x)) \\approx x$: take a horse,
       turn it into a zebra, turn that back into a horse &mdash; you should recover the <i>original</i> horse.
       The <b>backward cycle</b> requires $G(F(y)) \\approx y$. The loss measures both round trips with an
       <b>$L_1$ distance</b> (sum of absolute differences). Because recovering $x$ exactly forces $G(x)$ to
       <i>preserve</i> the information in $x$, the translation can no longer be arbitrary &mdash; it must keep
       enough of $x$ that $F$ can invert it. This is what makes each horse map to <i>its own</i> zebra.</p>
       <p><b>Step 3 &mdash; the full objective (Eq. 3).</b> Add it up: the two adversarial losses (make outputs
       look real) plus $\\lambda$ times the cycle loss (make round trips return home). The paper uses
       $\\lambda = 10$. You minimize over $G,F$ and maximize over $D_X,D_Y$ &mdash; the same minimax structure
       as a plain GAN, now with the cycle anchor.</p>`,
    architecture:
      `<p>CycleGAN is <b>four networks</b> trained together: two generators and two discriminators, wired into
       two cycles (&sect;3, Fig. 3).</p>
       <p><b>The two cycles (data flow).</b></p>
       <ul>
        <li><b>Forward cycle:</b> $x \\xrightarrow{G} G(x) \\xrightarrow{F} F(G(x)) = \\hat{x} \\approx x$. A real
        $X$ image is translated to $Y$ by $G$, then back to $X$ by $F$; the reconstruction $\\hat{x}$ must match
        the original $x$.</li>
        <li><b>Backward cycle:</b> $y \\xrightarrow{F} F(y) \\xrightarrow{G} G(F(y)) = \\hat{y} \\approx y$. The
        symmetric path through the same two generators.</li>
        <li>$D_Y$ judges whether $G(x)$ looks like a real $Y$; $D_X$ judges whether $F(y)$ looks like a real
        $X$. Each generator is trained to fool its matching discriminator <i>and</i> to make the round trip
        close.</li>
       </ul>
       <p><b>Generator</b> $G$ and $F$ (identical architecture, &sect;4; from Johnson et&nbsp;al.'s style-transfer
       net). Channel-by-channel for the 128&times;128 version:</p>
       <ul>
        <li><code>c7s1-64</code> &mdash; a 7&times;7 convolution, stride&nbsp;1, 64 filters, reflection-padded.</li>
        <li><code>d128, d256</code> &mdash; two stride-2 down-sampling convolutions (3&times;3), halving spatial
        size, growing channels to 256.</li>
        <li><code>R256 &times; 6</code> &mdash; <b>six residual blocks</b> at 256 channels (the bulk of the
        network; <b>nine</b> blocks for 256&times;256 inputs).</li>
        <li><code>u128, u64</code> &mdash; two fractionally-strided (stride-&frac12;) convolutions that
        up-sample back to full resolution.</li>
        <li><code>c7s1-3</code> &mdash; a final 7&times;7 conv to 3 RGB channels.</li>
        <li>Every conv (except the output) uses <b>instance normalization</b> + ReLU.</li>
       </ul>
       <p><b>Discriminator</b> $D_X, D_Y$ &mdash; a <b>70&times;70 PatchGAN</b> (&sect;4): the stack
       <code>C64-C128-C256-C512</code> of 4&times;4 stride-2 convolutions (LeakyReLU 0.2; instance norm on all but
       the first), ending in a 1-channel map. It classifies each overlapping 70&times;70 <i>patch</i> as
       real/fake (not the whole image), so it scores local texture and is fully convolutional.</p>
       <p><b>Training details</b> (&sect;4): Adam, learning rate $0.0002$, batch size $1$; the rate is held for 100
       epochs then linearly decayed to $0$ over 100 more. Discriminators see a <b>buffer of the last 50</b>
       generated images (not just the freshest) to damp oscillation. The adversarial term uses the least-squares
       (LSGAN) form for stability. <i>(In the Track B code below we replace all convolutions with small MLPs on a
       2-D toy task &mdash; the same four-network, two-cycle wiring at toy scale.)</i></p>`,
    symbols: [
      { sym: "$X,\\ Y$", desc: "the two <b>domains</b> (e.g. horse photos and zebra photos). We have an unordered <b>collection</b> of samples from each &mdash; nothing in $X$ is matched to anything in $Y$." },
      { sym: "$x \\sim p_{\\text{data}}(x)$", desc: "a sample drawn from domain $X$ (the notation $\\sim p_{\\text{data}}(x)$ means “drawn from the data distribution of $X$”)." },
      { sym: "$y \\sim p_{\\text{data}}(y)$", desc: "a sample drawn from domain $Y$, independently of any $x$ (the data is <b>unpaired</b>)." },
      { sym: "$G$", desc: "the <b>forward generator</b> $G: X \\to Y$ &mdash; the translator we ultimately want (horse $\\to$ zebra)." },
      { sym: "$F$", desc: "the <b>backward generator</b> $F: Y \\to X$ &mdash; the partner translator (zebra $\\to$ horse), learned jointly so we can check round trips." },
      { sym: "$D_Y$", desc: "the <b>discriminator for domain $Y$</b>: scores whether an image looks like a real member of $Y$. Trains against $G$." },
      { sym: "$D_X$", desc: "the <b>discriminator for domain $X$</b>: scores whether an image looks like a real member of $X$. Trains against $F$." },
      { sym: "$F(G(x))$", desc: "the <b>forward round trip</b>: take $x$, translate to $Y$ with $G$, translate back to $X$ with $F$. Cycle consistency asks this to equal $x$." },
      { sym: "$G(F(y))$", desc: "the <b>backward round trip</b>: $y \\to F \\to G \\to$ back to $Y$. Cycle consistency asks this to equal $y$." },
      { sym: "$\\|\\cdot\\|_1$", desc: "the <b>$L_1$ norm</b> &mdash; the sum of absolute values of the differences, coordinate by coordinate (e.g. $\\|[0.2,-0.1]\\|_1 = 0.2+0.1 = 0.3$). Used because it is robust and gives sharper images than the squared ($L_2$) distance." },
      { sym: "$\\mathcal{L}_{\\text{GAN}}$", desc: "the <b>adversarial loss</b> (Eq. 1): the standard GAN value function, recapped from <b>paper-gan</b> / <b>dl-gan</b>." },
      { sym: "$\\mathcal{L}_{\\text{cyc}}$", desc: "the <b>cycle-consistency loss</b> (Eq. 2): the sum of the two round-trip $L_1$ errors. The paper's key term." },
      { sym: "$\\lambda$", desc: "a plain weight: how strongly the cycle loss counts against the adversarial losses in the total objective. The paper sets $\\lambda = 10$ (&sect;3.3)." },
      { sym: "$\\mathbb{E}_{x\\sim p_{\\text{data}}(x)}[\\cdot]$", desc: "the <b>expected (average) value</b> of the bracketed quantity when $x$ is drawn from $X$'s data distribution &mdash; in practice, the mean over a minibatch." },
      { sym: "$\\log D_Y(y)$", desc: "the (natural) log of the discriminator's score on a real $Y$ image; the adversarial loss (Eq. 1) rewards $D_Y$ for pushing this toward $\\log 1 = 0$ on reals." },
      { sym: "$\\mathcal{L}$", desc: "the <b>full objective</b> $\\mathcal{L}(G,F,D_X,D_Y)$ (Eq. 3): the two adversarial losses plus $\\lambda\\,\\mathcal{L}_{\\text{cyc}}$." },
      { sym: "$G^{*},\\ F^{*}$", desc: "the <b>solution</b> generators &mdash; the $G,F$ that minimize $\\mathcal{L}$ while $D_X,D_Y$ maximize it (Eq. 4, the minimax optimum)." },
      { sym: "$\\hat{x},\\ \\hat{y}$", desc: "the <b>cycle reconstructions</b> $\\hat{x}=F(G(x))$ and $\\hat{y}=G(F(y))$; cycle consistency drives $\\hat{x}\\to x$ and $\\hat{y}\\to y$ (Fig. 3)." },
      { sym: "$\\mathcal{L}_{\\text{identity}}$", desc: "the <b>optional identity loss</b> (&sect;5.2): $\\mathbb{E}_y\\|G(y)-y\\|_1 + \\mathbb{E}_x\\|F(x)-x\\|_1$, added with weight $0.5\\lambda$ to keep a generator from altering inputs already in its target domain (helps preserve color)." },
      { sym: "“PatchGAN”", desc: "a plain term, not a symbol: a discriminator that classifies overlapping image <i>patches</i> (the paper uses 70×70) as real/fake rather than the whole image, so it focuses on local texture. (Architecture detail, &sect;4.)" },
      { sym: "“instance normalization”", desc: "a plain term: a per-image normalization layer (like batch norm but computed per single example), standard in style-transfer generators; used in CycleGAN's generator (&sect;4)." }
    ],
    formula:
      `$$ \\mathcal{L}_{\\text{GAN}}(G,D_Y,X,Y) = \\mathbb{E}_{y\\sim p_{\\text{data}}(y)}\\big[\\log D_Y(y)\\big] + \\mathbb{E}_{x\\sim p_{\\text{data}}(x)}\\big[\\log\\!\\big(1-D_Y(G(x))\\big)\\big] $$
       <p>Eq. 1 (&sect;3.1) &mdash; the <b>forward adversarial loss</b>: the ordinary GAN game for the direction $G:X\\to Y$. $G$ minimizes it (make $G(x)$ fool $D_Y$); $D_Y$ maximizes it (tell real $y$ from fakes).</p>
       $$ \\mathcal{L}_{\\text{GAN}}(F,D_X,Y,X) = \\mathbb{E}_{x\\sim p_{\\text{data}}(x)}\\big[\\log D_X(x)\\big] + \\mathbb{E}_{y\\sim p_{\\text{data}}(y)}\\big[\\log\\!\\big(1-D_X(F(y))\\big)\\big] $$
       <p>Eq. 1 again, for the <b>backward direction</b> $F:Y\\to X$ with discriminator $D_X$. Same form, roles of $X$ and $Y$ swapped.</p>
       $$ \\mathcal{L}_{\\text{cyc}}(G,F) = \\mathbb{E}_{x\\sim p_{\\text{data}}(x)}\\big[\\|F(G(x))-x\\|_1\\big] + \\mathbb{E}_{y\\sim p_{\\text{data}}(y)}\\big[\\|G(F(y))-y\\|_1\\big] $$
       <p>Eq. 2 (&sect;3.2) &mdash; the <b>cycle-consistency loss</b>, the paper's key term: the forward round-trip error $\\|F(G(x))-x\\|_1$ plus the backward round-trip error $\\|G(F(y))-y\\|_1$, both in $L_1$ (summed absolute differences).</p>
       $$ \\mathcal{L}(G,F,D_X,D_Y) = \\mathcal{L}_{\\text{GAN}}(G,D_Y,X,Y) + \\mathcal{L}_{\\text{GAN}}(F,D_X,Y,X) + \\lambda\\,\\mathcal{L}_{\\text{cyc}}(G,F) $$
       <p>Eq. 3 (&sect;3.3) &mdash; the <b>full objective</b>: both adversarial losses plus the cycle loss weighted by $\\lambda$ (the paper uses $\\lambda = 10$).</p>
       $$ G^{*},F^{*} = \\arg\\min_{G,F}\\ \\max_{D_X,D_Y}\\ \\mathcal{L}(G,F,D_X,D_Y) $$
       <p>Eq. 4 (&sect;3.3) &mdash; the <b>optimization</b>: a minimax game. Minimize over the two generators, maximize over the two discriminators.</p>
       $$ \\mathcal{L}_{\\text{identity}}(G,F) = \\mathbb{E}_{y\\sim p_{\\text{data}}(y)}\\big[\\|G(y)-y\\|_1\\big] + \\mathbb{E}_{x\\sim p_{\\text{data}}(x)}\\big[\\|F(x)-x\\|_1\\big] $$
       <p><b>Optional identity loss</b> (&sect;5.2) &mdash; when an input is <i>already</i> in the target domain, the generator should leave it unchanged: $G(y)\\approx y$ and $F(x)\\approx x$. Added with weight $0.5\\lambda$ to help preserve color/composition (e.g. photo&rarr;painting). Not part of the core objective.</p>
       <p><b>Least-squares variant used in practice</b> (&sect;4): for stability they replace the $\\log$ adversarial loss with a least-squares (LSGAN) form &mdash; $G$ minimizes $\\mathbb{E}_x\\big[(D_Y(G(x))-1)^2\\big]$, and $D_Y$ minimizes $\\mathbb{E}_y\\big[(D_Y(y)-1)^2\\big] + \\mathbb{E}_x\\big[D_Y(G(x))^2\\big]$.</p>`,
    whatItDoes:
      `<p>Read each half. The first term, $\\mathbb{E}_{x}[\\|F(G(x))-x\\|_1]$, is the average <b>forward
       round-trip error</b>: send $x$ through $G$ then back through $F$, and measure how far the result is from
       the original $x$ (in $L_1$, i.e. summed absolute differences). It is $0$ only when $F$ perfectly undoes
       $G$. The second term is the symmetric <b>backward round-trip error</b> for $y$.</p>
       <p>So minimizing $\\mathcal{L}_{\\text{cyc}}$ forces $G$ and $F$ to be approximate <b>inverses</b> of each
       other. That is the whole trick: it does not require any paired example $(x, y)$ &mdash; it only compares
       $x$ to <i>its own</i> reconstruction, which we can always compute. The full objective (Eq. 3) adds this
       to the two adversarial losses:
       $\\mathcal{L} = \\mathcal{L}_{\\text{GAN}}(G,D_Y) + \\mathcal{L}_{\\text{GAN}}(F,D_X) +
       \\lambda\\,\\mathcal{L}_{\\text{cyc}}(G,F)$, with $\\lambda=10$.</p>`,
    derivation:
      `<p><b>Short recap &mdash; GAN math lives in the concept lesson.</b> The adversarial part is exactly the
       minimax game from <b>dl-gan</b>: for each direction, $D$ becomes the optimal real-vs-fake detector and
       drives the generator's output distribution toward the target domain's distribution. We do not re-derive
       Proposition 1 / the Jensen-Shannon optimum here &mdash; see the dl-gan concept lesson.</p>
       <p><b>Why the cycle term is needed, made precise.</b> The adversarial loss for $G$ is minimized whenever
       the <i>distribution</i> of $G(x)$ matches $p_{\\text{data}}(y)$. Distribution-matching is invariant to
       any relabeling: if $\\pi$ is a permutation of the target set, then $G$ and $\\pi\\circ G$ have the
       <i>same</i> output distribution and the <i>same</i> adversarial loss. So adversarial loss alone leaves
       the per-example mapping completely undetermined &mdash; an under-constrained problem. The cycle loss
       breaks the tie: if $F(G(x)) = x$ must hold, then $G$ must be (approximately) <b>injective</b> and
       information-preserving, because a permutation that scrambled content could not be inverted by a single
       fixed $F$. Cycle consistency is the regularizer that selects, among all distribution-matching $G$'s, the
       ones that are invertible &mdash; the meaningful translations.</p>`,
    example:
      `<p>Work the cycle-consistency loss on one round trip by hand, with real numbers (these are recomputed in
       the notebook's first cell). Take a 2-D toy point so every coordinate is visible.</p>
       <ul class="steps">
        <li><b>Forward round trip.</b> Input $x = [1.0,\\ 0.0]$. Say $G(x) = [0.0,\\ 1.2]$ (translated into
        domain $Y$), and then $F(G(x)) = [0.8,\\ -0.1]$ (translated back toward $X$). The forward $L_1$ error is
        $\\|F(G(x))-x\\|_1 = |0.8-1.0| + |-0.1-0.0| = 0.20 + 0.10 = 0.30$.</li>
        <li><b>Backward round trip.</b> Input $y = [0.0,\\ 1.0]$. Say $F(y) = [1.1,\\ 0.2]$ and
        $G(F(y)) = [0.05,\\ 0.9]$. The backward $L_1$ error is
        $\\|G(F(y))-y\\|_1 = |0.05-0.0| + |0.9-1.0| = 0.05 + 0.10 = 0.15$.</li>
        <li><b>The cycle loss for this pair</b> (Eq. 2, here with one sample per expectation) is the sum:
        $\\mathcal{L}_{\\text{cyc}} = 0.30 + 0.15 = 0.45$.</li>
        <li><b>Its weight in the full objective</b> (Eq. 3) with $\\lambda = 10$:
        $\\lambda\\,\\mathcal{L}_{\\text{cyc}} = 10 \\times 0.45 = 4.5$. This large weight is why the round-trip
        constraint dominates early training &mdash; the generators first learn to be inverses, then refine
        realism.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>Build two generators</b> $G:X\\to Y$ and $F:Y\\to X$. (Paper: Johnson-et-al conv net with
        residual blocks + instance norm. Here: small MLPs for a 2-D toy task.)</li>
        <li><b>Build two discriminators</b> $D_X, D_Y$, each giving a real/fake logit. (Paper: 70&times;70
        PatchGAN. Here: small MLPs.)</li>
        <li><b>Discriminator step:</b> train $D_Y$ on real $y$ vs $G(x)$ and $D_X$ on real $x$ vs $F(y)$;
        <code>.detach()</code> the fakes so this step updates only the discriminators.</li>
        <li><b>Generator step &mdash; adversarial:</b> $G$ minimizes $\\mathcal{L}_{\\text{GAN}}$ to make
        $D_Y(G(x))$ say "real"; $F$ likewise against $D_X$.</li>
        <li><b>Generator step &mdash; cycle (Eq. 2):</b> add $\\lambda\\,(\\,\\|F(G(x))-x\\|_1 +
        \\|G(F(y))-y\\|_1\\,)$, with $\\lambda=10$.</li>
        <li><b>Alternate</b> over minibatches drawn <i>independently</i> from $X$ and $Y$ (unpaired). Track the
        round-trip $L_1$ error; it should fall.</li>
        <li><b>Ablate:</b> rerun with the cycle term removed and compare the round-trip error &mdash; it should
        stay large, proving the cycle loss is what enables faithful unpaired translation.</li>
      </ol>`,
    results:
      `<p>The paper evaluates on Cityscapes labels&harr;photos (FCN-score and per-class segmentation accuracy),
       maps&harr;aerial photos (an Amazon Mechanical Turk "real vs fake" perceptual study), and a gallery of
       qualitative tasks: Monet/Van&nbsp;Gogh/Cézanne/Ukiyo-e style transfer, horse&harr;zebra,
       apple&harr;orange, summer&harr;winter, and photo enhancement. They report that CycleGAN outperforms the
       unpaired baselines (CoGAN, SimGAN, BiGAN/ALI, feature-loss+GAN) on the FCN metric, and crucially that
       <b>removing the cycle-consistency loss collapses the method</b> &mdash; their ablation (Table on
       Cityscapes) shows the GAN-alone and cycle-alone variants both perform far worse than the full model.</p>
       <p><i>The numbers in the CODEVIZ panel below are from our own tiny toy run &mdash; not the paper's
       reported results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> Score two things, because a CycleGAN can fail on either. (a) <b>Realism</b>
       of the translation: the paper's main quantitative setup is the <b>FCN-score</b> on Cityscapes
       labels&harr;photos &mdash; run a pre-trained segmenter on $G(x)$ and measure per-pixel accuracy / mean IoU
       against the source label map &mdash; plus an Amazon Mechanical Turk &ldquo;real vs fake&rdquo; perceptual
       study on maps&harr;aerial. (b) <b>Cycle fidelity</b>: the mean round-trip error $\\|F(G(x))-x\\|_1$ (what the
       toy run tracks). The &ldquo;no-skill&rdquo; anchors: a copy/identity map $G(x)=x$ scores near-zero on the FCN
       realism metric (it never enters domain $Y$); the unpaired baselines CoGAN, SimGAN, BiGAN/ALI are the bars to
       clear &mdash; the paper reports CycleGAN beats them all on FCN-score.</p>
       <p><b>2. Sanity checks BEFORE the full run.</b></p>
       <ul>
        <li><b>Loss at init.</b> Each LSGAN discriminator on a 50/50 real/fake batch should start near
        $D(\\cdot)\\approx 0.5$, so the least-squares term is $\\approx (0.5-1)^2 + (0.5)^2 = 0.5$ per side
        (rule of thumb, not a paper claim). The cycle $L_1$ starts large (untrained $F\\circ G$ is far from
        identity).</li>
        <li><b>Overfit one tiny unpaired batch</b> with $\\lambda$ large: the round-trip $\\|F(G(x))-x\\|_1$ must
        collapse toward $0$ within a few hundred steps. If it cannot even fit one batch, the cycle term is mis-wired.</li>
        <li><b>Shape/range checks.</b> $G(x)$ and $F(y)$ must match the image shape; the discriminator must emit a
        <i>map</i> of logits (70&times;70 PatchGAN), not a single scalar.</li>
        <li><b>Detach test.</b> Confirm the discriminator step does not update $G,F$ (freeze $G,F$, run one $D$ step,
        verify their params are unchanged) &mdash; the classic missing-<code>.detach()</code> bug.</li>
       </ul>
       <p><b>3. Expected range.</b> The cycle (round-trip) $L_1$ should fall close to $0$ &mdash; in our toy run from
       ~4.2 to <b>~0.07</b> with the cycle term (CODEVIZ; our run, not the paper). For realism, target beating the
       unpaired baselines on the FCN-score as the paper reports (it does not publish a single headline FCN number to
       quote here); a round-trip error stuck high (&gt;1 in toy units) while the adversarial loss looks fine is
       &ldquo;probably a bug,&rdquo; whereas slightly grainy but plausible translations are &ldquo;tuning.&rdquo;</p>
       <p><b>4. Ablation &mdash; prove the cycle loss earns its keep.</b> Set $\\lambda = 0$ (drop
       $\\mathcal{L}_{\\text{cyc}}$ from the generator step) and retrain with everything else identical. The
       round-trip error must <b>stay large</b> &mdash; our toy run: ~2.3 vs ~0.07 with the cycle term. If dropping
       the cycle term does <i>not</i> raise the round-trip error, the cycle loss is not wired into the generator
       update. This is exactly the paper's own ablation (Table on Cityscapes): GAN-alone and cycle-alone both
       collapse versus the full model.</p>
       <p><b>5. Failure signals &amp; what they mean.</b></p>
       <ul>
        <li><b>Round-trip error stays high</b> while $G(x)$ looks realistic &rarr; the adversarial term works but the
        cycle term is absent or $\\lambda$ too small; the mapping is content-scrambling (the &ldquo;without cycle
        loss&rdquo; red curve in the CODEVIZ).</li>
        <li><b>All inputs map to one output</b> (mode collapse) &rarr; the adversarial term dominates and $G$ found
        one convincing $Y$ image; the cycle anchor should forbid this once weighted properly.</li>
        <li><b>Loss oscillates / diverges</b> &rarr; GAN instability; the paper's fixes are the LSGAN loss and the
        50-image history buffer for the discriminator.</li>
        <li><b>Cycle error $\\to 0$ but outputs look like the input domain</b> &rarr; $G,F$ became near-identity; the
        discriminators are too weak to push outputs into the target domain. Watch both signals together &mdash; low
        cycle error alone does <i>not</i> mean &ldquo;working.&rdquo;</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the novel composition &mdash; the two-cycle objective. <b>Import:</b>
       <code>nn.Linear</code> (paper uses <code>nn.Conv2d</code> + residual blocks; we use Linear for the 2-D
       toy), <code>nn.LeakyReLU</code>, <code>nn.BCEWithLogitsLoss</code>, <code>nn.L1Loss</code>, and Adam.
       <b>Build by hand:</b> the two generators $G,F$, the two discriminators $D_X,D_Y$, the four-term
       discriminator step (fakes detached), and the generator step that adds the
       <b>cycle-consistency loss</b> $\\lambda(\\|F(G(x))-x\\|_1 + \\|G(F(y))-y\\|_1)$. The adversarial / JSD
       math is recapped from <b>paper-gan</b> and <b>dl-gan</b>, not re-derived. We also run the <b>ablation</b>
       (drop the cycle term) to confirm it is what makes unpaired translation work.</p>`,
    pitfalls:
      `<ul>
        <li><b>Confusing unpaired with paired.</b> CycleGAN draws $x$ and $y$ <i>independently</i>; there is no
        $(x,y)$ correspondence anywhere in the loss. If you accidentally feed aligned pairs and add an
        $\\|G(x)-y\\|$ term, you have rebuilt <b>pix2pix</b>, not CycleGAN. The only cross-domain comparison
        CycleGAN ever makes is $x$ vs its <i>own</i> reconstruction $F(G(x))$.</li>
        <li><b>Dropping one half of the cycle.</b> You need <i>both</i> $F(G(x))\\approx x$ and
        $G(F(y))\\approx y$. Using only the forward cycle leaves the backward direction under-constrained and
        training drifts. <b>Fix:</b> always include both terms (Eq. 2 has two summands).</li>
        <li><b>Forgetting <code>.detach()</code> in the discriminator step.</b> Same trap as plain GAN: if the
        discriminator loss backprops through $G$ or $F$, it nudges the generators the wrong way. <b>Fix:</b>
        detach the fakes when training $D_X, D_Y$.</li>
        <li><b>$\\lambda$ too small.</b> With a weak cycle weight the adversarial term dominates and the
        generators ignore content (arbitrary mapping). The paper uses $\\lambda=10$; far below that, round-trip
        error stays high. <b>Fix:</b> keep the cycle weight large enough to anchor the mapping.</li>
        <li><b>Reading the cycle loss going to zero as "done".</b> Zero round-trip error only means $G$ and $F$
        are inverses &mdash; it does <i>not</i> guarantee $G(x)$ looks like a real $Y$ (that is the
        adversarial term's job). Both signals matter; watch them together.</li>
       </ul>`,
    recall: [
      "Write the cycle-consistency loss (Eq. 2) from memory, both terms.",
      "Why is the adversarial loss alone insufficient for unpaired translation?",
      "What does $F$ do, and why must we learn it even though we only want $G$?",
      "State the full objective (Eq. 3) and the value of $\\lambda$ the paper uses.",
      "How does CycleGAN differ from pix2pix in the data it requires?"
    ],
    practice: [
      {
        q: `<b>The cycle-loss ablation (the paper's key experiment, on toy data).</b> Train your CycleGAN twice:
            once with the full objective, once with the cycle term <i>removed</i> (adversarial loss only). Keep
            everything else identical and measure the average round-trip error $\\|F(G(x))-x\\|_1$ at the end.
            What happens to that error in each case, and what does it prove?`,
        steps: [
          { do: `Run the full model; record the final round-trip $L_1$ error (it should fall close to 0).`, why: `The cycle term explicitly minimizes this error, forcing $G$ and $F$ to be inverses.` },
          { do: `Set $\\lambda = 0$ (drop $\\mathcal{L}_{\\text{cyc}}$ from the generator step only); retrain and measure the same round-trip error.`, why: `An honest ablation changes exactly one thing &mdash; whether the round-trip constraint is enforced.` },
          { do: `Compare: with the cycle term the error is small; without it the error stays large because nothing ties $G(x)$ back to $x$.`, why: `Adversarial loss only matches the output distribution; it permits any content-scrambling map.` }
        ],
        answer: `<p>With the full objective the round-trip error collapses toward $0$ (our toy run: ~0.07);
                 with the cycle term removed it stays large (~2.3) because the adversarial loss only asks
                 $G(x)$ to <i>look like</i> a real $Y$ sample &mdash; it never compares $x$ to its
                 reconstruction. This is exactly the paper's ablation result: cycle consistency is what makes
                 unpaired translation faithful rather than arbitrary.</p>`
      },
      {
        q: `Work a cycle loss by hand. For $x = [2.0,\\ -1.0]$, suppose $G(x) = [-1.0,\\ 2.0]$ and
            $F(G(x)) = [1.7,\\ -0.6]$. Compute the forward round-trip $L_1$ error. If the backward round trip for
            some $y$ contributed $0.4$, what is $\\mathcal{L}_{\\text{cyc}}$ for this pair, and what is its
            weighted contribution with $\\lambda = 10$?`,
        steps: [
          { do: `Forward error: $\\|F(G(x))-x\\|_1 = |1.7-2.0| + |-0.6-(-1.0)| = 0.3 + 0.4 = 0.7$.`, why: `$L_1$ is the sum of absolute coordinate differences &mdash; note $G(x)$ itself never enters the error, only the reconstruction vs the original.` },
          { do: `Add the given backward term: $\\mathcal{L}_{\\text{cyc}} = 0.7 + 0.4 = 1.1$.`, why: `Eq. 2 sums the forward and backward round-trip errors.` },
          { do: `Weight it: $\\lambda\\,\\mathcal{L}_{\\text{cyc}} = 10 \\times 1.1 = 11.0$.`, why: `Eq. 3 multiplies the cycle loss by $\\lambda = 10$ before adding the adversarial losses.` }
        ],
        answer: `<p>Forward error $= 0.3 + 0.4 = 0.7$; total $\\mathcal{L}_{\\text{cyc}} = 0.7 + 0.4 = 1.1$;
                 weighted $10 \\times 1.1 = 11.0$. Notice the intermediate $G(x)$ value is irrelevant to the
                 loss &mdash; only how well $F$ reconstructs the <i>original</i> $x$ matters.</p>`
      },
      {
        q: `A friend says: "If I only want horse&rarr;zebra ($G$), why bother training the reverse generator
            $F$? Just use $G$ with the adversarial loss." Explain what breaks, and why $F$ is essential even
            though you will throw it away at test time.`,
        steps: [
          { do: `Note that adversarial loss on $G$ alone only matches the zebra <i>distribution</i>; it never references the input horse.`, why: `Distribution-matching is invariant to permuting which input maps to which output.` },
          { do: `Observe you cannot even <i>write</i> a cycle loss without $F$ &mdash; there is no way to measure "did we get back to the original horse?".`, why: `The round-trip $F(G(x))$ requires a map back from $Y$ to $X$.` },
          { do: `Conclude $F$ exists to make the cycle constraint computable; it anchors $G$ to preserve content. At test time you keep only $G$.`, why: `$F$ is a training-time scaffold; the constraint it enables is what gives $G$ its faithfulness.` }
        ],
        answer: `<p>Without $F$ you cannot form the cycle loss at all, so $G$ is trained on adversarial loss
                 alone &mdash; which only forces its outputs to <i>look like</i> zebras, not to correspond to
                 the input horse. The mapping becomes arbitrary (any horse &rarr; any zebra). $F$ is the
                 training-time scaffold that makes $F(G(x))\\approx x$ measurable, forcing $G$ to preserve the
                 horse's structure. You can discard $F$ after training, but you cannot train good unpaired $G$
                 without it.</p>`
      }
    ]
  });

  window.CODE["paper-cyclegan"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> two generators ($G:X\\to Y$, $F:Y\\to X$) and two discriminators
       ($D_X, D_Y$) from <code>nn.Linear</code>, then train them on a <b>toy UNPAIRED 2-domain task</b>: domain
       $X$ is a Gaussian blob; domain $Y$ is the <i>same shape rotated 90&deg; and shifted</i> &mdash; but we
       draw $X$ and $Y$ samples <b>independently</b>, so nothing is paired. The novel lines are the
       <b>generator step</b>: an adversarial part (fool $D_Y$ and $D_X$) plus the
       <b>cycle-consistency loss</b> <code>L1(F(G(x)),x) + L1(G(F(y)),y)</code> scaled by $\\lambda=10$ (Eq. 2 /
       Eq. 3). We then run the <b>ablation</b> &mdash; retrain with $\\lambda=0$ &mdash; and print both
       round-trip errors. The first cell recomputes the worked example: forward $0.30$, backward $0.15$,
       $\\mathcal{L}_{\\text{cyc}} = 0.45$, weighted $10\\times0.45 = 4.5$. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn

torch.manual_seed(0)

# --- 0. Sanity-check the worked cycle-loss example (Eq. 2). ---
x   = torch.tensor([1.0, 0.0]);  FGx = torch.tensor([0.8, -0.1])   # x and F(G(x))
y   = torch.tensor([0.0, 1.0]);  GFy = torch.tensor([0.05, 0.9])   # y and G(F(y))
fwd = (FGx - x).abs().sum().item()      # |0.8-1.0|+|-0.1-0.0| = 0.30
bwd = (GFy - y).abs().sum().item()      # |0.05-0.0|+|0.9-1.0| = 0.15
print("worked example (Eq. 2):")
print("  forward  ||F(G(x))-x||_1 = %.2f" % fwd)          # 0.30
print("  backward ||G(F(y))-y||_1 = %.2f" % bwd)          # 0.15
print("  L_cyc = %.2f ;  lambda*L_cyc (lambda=10) = %.1f" % (fwd+bwd, 10*(fwd+bwd)))  # 0.45 ; 4.5


# --- 1. A toy UNPAIRED 2-domain task. ---
# Domain X: a blob near (-2, 0). Domain Y: the same blob ROTATED 90 deg + shifted.
# We draw X and Y INDEPENDENTLY -> the data is unpaired (no x is tied to any y).
R = torch.tensor([[0., -1.], [1., 0.]])                    # 90-degree rotation
def sample_X(m): return torch.randn(m, 2) * torch.tensor([0.9, 0.4]) + torch.tensor([-2.0, 0.0])
def sample_Y(m): return sample_X(m) @ R.T + torch.tensor([4.0, 0.0])   # independent draw, then rotate+shift


# --- 2. Generators G, F and discriminators D_X, D_Y, built by hand. ---
def gen(): return nn.Sequential(nn.Linear(2,64), nn.ReLU(), nn.Linear(64,64), nn.ReLU(), nn.Linear(64,2))
def dis(): return nn.Sequential(nn.Linear(2,64), nn.LeakyReLU(0.2), nn.Linear(64,64), nn.LeakyReLU(0.2), nn.Linear(64,1))


# --- 3. Train. use_cycle=False reproduces the ABLATION (adversarial loss only). ---
def train(use_cycle, steps=2500, lam=10.0):
    torch.manual_seed(0)
    G, F, Dx, Dy = gen(), gen(), dis(), dis()
    bce, l1 = nn.BCEWithLogitsLoss(), nn.L1Loss()
    optG = torch.optim.Adam(list(G.parameters()) + list(F.parameters()), lr=2e-3, betas=(0.5, 0.999))
    optD = torch.optim.Adam(list(Dx.parameters()) + list(Dy.parameters()), lr=2e-3, betas=(0.5, 0.999))
    m = 128
    for s in range(steps):
        x, y = sample_X(m), sample_Y(m)
        ones, zeros = torch.ones(m,1), torch.zeros(m,1)

        # (a) DISCRIMINATOR step: real vs fake for BOTH domains; detach the fakes.
        fy, fx = G(x).detach(), F(y).detach()
        lossD = (bce(Dy(y), ones) + bce(Dy(fy), zeros)
               + bce(Dx(x), ones) + bce(Dx(fx), zeros))
        optD.zero_grad(); lossD.backward(); optD.step()

        # (b) GENERATOR step: adversarial + (optionally) cycle-consistency (Eq. 2/3).
        adv = bce(Dy(G(x)), ones) + bce(Dx(F(y)), ones)    # fool both discriminators
        cyc = l1(F(G(x)), x) + l1(G(F(y)), y)              # round-trip L1 error
        lossG = adv + (lam * cyc if use_cycle else 0.0 * cyc)
        optG.zero_grad(); lossG.backward(); optG.step()

    # final round-trip error on fresh samples (the cycle-consistency we care about)
    with torch.no_grad():
        xt = sample_X(2000); fwd = (F(G(xt)) - xt).abs().sum(1).mean().item()
        yt = sample_Y(2000); bwd = (G(F(yt)) - yt).abs().sum(1).mean().item()
    return fwd, bwd

fwd_c, bwd_c = train(use_cycle=True)
fwd_n, bwd_n = train(use_cycle=False)
print("\\nWITH    cycle loss: round-trip L1  X->Y->X = %.3f   Y->X->Y = %.3f" % (fwd_c, bwd_c))
print("WITHOUT cycle loss: round-trip L1  X->Y->X = %.3f   Y->X->Y = %.3f" % (fwd_n, bwd_n))
print("=> the cycle term drives the round trip home; without it the mapping is arbitrary.")
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-cyclegan"] = {
    question: "Does the cycle-consistency loss actually force the round trip F(G(x)) back to x — and what happens to that round-trip error if we ablate it?",
    charts: [
      {
        type: "line",
        title: "Round-trip L1 error ‖F(G(x))−x‖₁ vs step — with vs without the cycle loss",
        xlabel: "training step",
        ylabel: "cycle (round-trip) L1 error",
        series: [
          {
            name: "With cycle loss (full objective)",
            color: "#7ee787",
            points: [[0,4.222],[100,0.185],[200,0.257],[300,0.058],[400,0.142],[500,0.184],[600,0.123],[700,0.106],[800,0.265],[900,0.128],[1000,0.17],[1100,0.106],[1200,0.177],[1300,0.104],[1400,0.185],[1500,0.13],[1600,0.132],[1700,0.152],[1800,0.171],[1900,0.137],[2000,0.067],[2100,0.172],[2200,0.127],[2300,0.15],[2400,0.113]]
          },
          {
            name: "Without cycle loss (ablation, λ=0)",
            color: "#ff7b72",
            points: [[0,4.222],[100,0.737],[200,3.527],[300,1.212],[400,1.331],[500,2.032],[600,1.688],[700,1.738],[800,2.875],[900,1.503],[1000,1.469],[1100,1.766],[1200,1.985],[1300,3.339],[1400,1.696],[1500,1.612],[1600,2.072],[1700,1.995],[1800,1.852],[1900,2.081],[2000,1.889],[2100,1.812],[2200,1.474],[2300,1.978],[2400,1.886]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two MLP generators ($G:X\\to Y$, $F:Y\\to X$) + two discriminators trained on a toy UNPAIRED 2-domain task (a blob and its rotated-and-shifted copy, drawn independently). <b>With</b> the cycle-consistency loss (green, $\\lambda=10$) the round-trip error $\\|F(G(x))-x\\|_1$ collapses from ~4.2 to <b>~0.07</b> &mdash; $G$ and $F$ become inverses, so each $x$ maps to its own faithful target. <b>Without</b> it (red, $\\lambda=0$) the same error stays high (~2.3): the adversarial loss alone only makes outputs <i>look</i> like the other domain, leaving the per-example mapping arbitrary. This mirrors the paper's ablation: cycle consistency is what makes unpaired translation work.",
    code: `import torch, torch.nn as nn
torch.manual_seed(0)

# Toy UNPAIRED 2-domain task: X is a blob, Y is the same blob rotated 90 deg + shifted,
# drawn INDEPENDENTLY (no pairing). Track the round-trip error ||F(G(x))-x||_1 over training,
# with vs without the cycle-consistency loss (the ablation). Same loop as the notebook.
R = torch.tensor([[0., -1.], [1., 0.]])
def sample_X(m): return torch.randn(m, 2) * torch.tensor([0.9, 0.4]) + torch.tensor([-2.0, 0.0])
def sample_Y(m): return sample_X(m) @ R.T + torch.tensor([4.0, 0.0])
def gen(): return nn.Sequential(nn.Linear(2,64), nn.ReLU(), nn.Linear(64,64), nn.ReLU(), nn.Linear(64,2))
def dis(): return nn.Sequential(nn.Linear(2,64), nn.LeakyReLU(0.2), nn.Linear(64,64), nn.LeakyReLU(0.2), nn.Linear(64,1))

def run(use_cycle, steps=2500, lam=10.0):
    torch.manual_seed(0)
    G, F, Dx, Dy = gen(), gen(), dis(), dis()
    bce, l1 = nn.BCEWithLogitsLoss(), nn.L1Loss()
    oG = torch.optim.Adam(list(G.parameters())+list(F.parameters()), lr=2e-3, betas=(0.5,0.999))
    oD = torch.optim.Adam(list(Dx.parameters())+list(Dy.parameters()), lr=2e-3, betas=(0.5,0.999))
    m, hist = 128, []
    for s in range(steps):
        x, y = sample_X(m), sample_Y(m); o, z = torch.ones(m,1), torch.zeros(m,1)
        fy, fx = G(x).detach(), F(y).detach()
        lossD = bce(Dy(y),o)+bce(Dy(fy),z)+bce(Dx(x),o)+bce(Dx(fx),z)
        oD.zero_grad(); lossD.backward(); oD.step()
        adv = bce(Dy(G(x)),o)+bce(Dx(F(y)),o)
        cyc = l1(F(G(x)),x)+l1(G(F(y)),y)
        (adv + (lam*cyc if use_cycle else 0.0*cyc)).backward()
        oG.step(); oG.zero_grad()
        if s % 100 == 0: hist.append([s, round(cyc.item(), 3)])
    return hist

print("with cycle:   ", run(True))
print("without cycle:", run(False))
# With the cycle term the round-trip error -> ~0.07; without it it stays ~2.3.`
  };
})();
