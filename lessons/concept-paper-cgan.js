/* Paper lesson — "Conditional Generative Adversarial Nets" (cGAN), Mirza & Osindero 2014.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-cgan".
   GROUNDED from arXiv:1411.1784 (abstract page) and the official PDF (arxiv.org/pdf/1411.1784),
   read directly: Section 3.1 Eq. (1), Section 3.2 Eq. (2) + Fig. 1, Section 4.1 (Unimodal MNIST
   architecture, Table 1 Parzen log-likelihood 132 +/- 1.8, Fig. 2). The ar5iv HTML mirror confirmed
   the abstract and method text.
   Track B (architecture): build a generator + discriminator (MLP) from nn.Linear that BOTH take the
   class label y (one-hot, concatenated to their inputs); train the adversarial loop; GENERATE a CHOSEN
   class on demand; then ABLATE the label conditioning. The minimax/JSD math lives in concept dl-gan;
   here we recap and extend it to the conditional case. conceptLink is null per the manifest; we
   cross-link dl-gan, paper-gan. */
(function () {
  window.LESSONS.push({
    id: "paper-cgan",
    title: "cGAN — Conditional Generative Adversarial Nets (2014)",
    tagline: "Feed the class label into both the generator and the discriminator, and you can ask a GAN to generate a chosen digit on demand.",
    module: "Papers · Generative Models",
    track: "architecture",
    paper: {
      authors: "Mehdi Mirza, Simon Osindero",
      org: "Université de Montréal (DIRO); Flickr / Yahoo Inc.",
      year: 2014,
      venue: "arXiv:1411.1784 (Nov 2014)",
      citations: "exact citation count not fetched, so omitted to avoid an invented number.",
      arxiv: "https://arxiv.org/abs/1411.1784",
      code: ""
    },
    conceptLink: null,
    partOf: [
      { capstone: "capstone-gan", step: 5, builds: "label-conditioned generator/discriminator that generate a chosen class on demand" }
    ],
    prereqs: ["paper-gan", "dl-gan", "dl-backprop", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>A plain GAN (the previous paper in this module, <b>paper-gan</b>) learns to turn random noise into
       realistic samples &mdash; but you cannot <b>ask it for a specific kind</b> of sample. The paper states this
       directly (&sect;1):</p>
       <blockquote>"In an unconditioned generative model, there is no control on modes of the data being generated.
       However, by conditioning the model on additional information it is possible to direct the data generation
       process."</blockquote>
       <p>In plain words: a regular GAN's only input is a noise vector $z$, and which digit comes out is whatever
       that random $z$ happens to map to &mdash; you get a grab-bag of all ten digits, with no steering wheel. If
       you want "give me a 7", you are stuck generating many samples and hoping. The authors wanted a knob: a
       way to <b>tell</b> the generator which class to produce, and have the discriminator judge realism
       <i>for that class</i>.</p>`,
    contribution:
      `<ul>
        <li><b>Conditioning, by concatenation.</b> Feed an extra piece of information $y$ (here, the class
        label as a <b>one-hot vector</b> &mdash; a vector that is $1$ at the label's slot and $0$ elsewhere) into
        <i>both</i> the generator and the discriminator as an additional input (&sect;3.2). That is the whole
        idea: $G(z|y)$ and $D(x|y)$.</li>
        <li><b>The conditional value function (Eq. 2).</b> The same minimax game as a GAN, but every term is
        now conditioned on $y$. The generator must produce a realistic sample <i>of the requested class</i>; the
        discriminator must judge "is this a real $x$ <i>for this $y$</i>?"</li>
        <li><b>On-demand class generation.</b> They show it on MNIST: pick a label, generate that digit (&sect;4.1,
        Fig. 2 &mdash; each row is one requested label). They also sketch multi-modal use (image tagging,
        &sect;4.2).</li>
      </ul>`,
    whyItMattered:
      `<p>Conditioning is now everywhere in generative modeling. The "concatenate the condition into both nets"
       recipe generalizes far beyond class labels: condition on text (text-to-image), on another image
       (image-to-image translation, pix2pix), or on a noisy input (super-resolution). The same logic &mdash; tell
       the generator <i>what</i> to make and tell the judge <i>what to check against</i> &mdash; reappears as the
       conditioning mechanism in class-conditional diffusion models and, in spirit, in classifier-free guidance
       (<b>paper-cfg</b> in this module). cGAN is the small paper that introduced "controllable generation."</p>`,

    // READING GUIDE
    readingGuide:
      `<p>This is a short workshop paper &mdash; read almost all of it.</p>
       <ul>
        <li><b>&sect;3.1</b> &mdash; a one-paragraph recap of the plain GAN and its value function <b>Eq. (1)</b>.
        Skim if you just did paper-gan.</li>
        <li><b>&sect;3.2 (Conditional Adversarial Nets)</b> &mdash; the core. The one new sentence ("we perform the
        conditioning by feeding $y$ into both the discriminator and generator as additional input layer") and the
        conditional value function <b>Eq. (2)</b> you will transcribe. Read <b>Fig. 1</b>: it draws $z$ and $y$
        feeding $G$, and $x$ and $y$ feeding $D$.</li>
        <li><b>&sect;4.1 (Unimodal)</b> &mdash; the MNIST setup: noise dim, how $z$ and $y$ are each mapped to a
        hidden layer then merged, and <b>Fig. 2</b> (each row conditioned on one label). This is the experiment
        you reproduce.</li>
        <li><b>Table 1</b> &mdash; the Parzen-window log-likelihood number, read with the caveat the authors give.</li>
       </ul>
       <p><b>Skim:</b> &sect;2 (related work) and &sect;4.2 (the Flickr image-tagging demo) unless the multi-modal
       application interests you.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train two generators on data with several classes (think: "digits 0&ndash;9"). One generator
       <b>also receives the class label</b> $y$; the other does <b>not</b> (the ablation). After training, you
       <b>request a specific class</b> &mdash; say "class 2" &mdash; and look at the samples.</p>
       <p>Predict: which generator can give you class 2 on demand? And what does the <i>label-free</i> generator
       do when you "ask" for class 2 &mdash; does it ignore the request, and if so, what do its samples look like?
       Write your guess, then check the conditional-vs-ablation panel below.</p>`,
    attempt:
      `<p>Before the reveal, sketch the two conditioned nets and the loop. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>One-hot the label:</b> turn integer label $y$ into a length-$K$ vector <code>oh</code> ($K$ =
        number of classes), $1$ at slot $y$, else $0$.</li>
        <li><code>G</code> input is <code>cat([z, oh])</code> &rarr; sample; <code>D</code> input is
        <code>cat([x, oh])</code> &rarr; one real/fake logit. TODO: widen the first <code>nn.Linear</code> by $K$
        on both nets to make room for the one-hot.</li>
        <li><b>Discriminator step:</b> for real $(x,y)$ use the <i>true</i> label; for fakes, generate with some
        label and feed the <b>same</b> label to $D$. TODO:
        <code>bce(D(cat[x,oh]),1) + bce(D(cat[G(cat[z,oh]).detach(),oh]),0)</code>.</li>
        <li><b>Generator step</b> (non-saturating): pick labels, generate, ask $D$ to call them real <i>for that
        label</i>: <code>bce(D(cat[G(cat[z,oh]),oh]),1)</code>.</li>
        <li>After training, to get class $k$: build a one-hot for $k$, sample noise, run $G$.</li>
       </ul>
       <p>Predict the conditional generator's <b>purity</b> (fraction of its "class $k$" samples that really land
       in class $k$) vs the ablated one's.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>Start from the plain GAN (&sect;3.1). Two players: the <b>generator</b> $G$ maps a noise vector $z$ (drawn
       from a fixed prior $p_z$) to a fake sample, and the <b>discriminator</b> $D$ outputs the probability a
       sample is <b>real</b> (from $p_{\\text{data}}$) rather than from $G$. They play the minimax game of Eq. (1).</p>
       <p><b>The one change (&sect;3.2).</b> Suppose every sample also has a label $y$ &mdash; for MNIST, which digit
       it is, written as a <b>one-hot vector</b>. cGAN makes both nets <i>see</i> $y$:</p>
       <ul>
        <li>The generator becomes $G(z|y)$: it gets noise $z$ <b>and</b> the label $y$, and must produce a sample
        of <i>that</i> class. The paper maps $z$ and $y$ each through their own hidden layer, then merges them
        into a joint hidden representation (&sect;4.1) &mdash; in code, the simplest version is to just
        <b>concatenate</b> $z$ and the one-hot $y$ and feed the stack in.</li>
        <li>The discriminator becomes $D(x|y)$: it gets the sample $x$ <b>and</b> the label $y$, and must answer
        "is this a real example <i>of class $y$</i>?" So a perfectly realistic "7" presented with the label "3"
        should be judged <b>fake</b> &mdash; it does not match the condition.</li>
       </ul>
       <p>The notation $D(x|y)$ and $G(z|y)$ uses the vertical bar "$|$" to mean "<b>given</b> $y$" &mdash; the same
       "given" as in conditional probability $p(x|y)$. It is not division.</p>
       <p>Everything else &mdash; the alternating updates, the non-saturating generator trick (maximize
       $\\log D(G(z|y))$ rather than minimize $\\log(1-D(G(z|y)))$, exactly as in paper-gan), Adam, dropout
       &mdash; is unchanged. The <b>only</b> new ingredient is that $y$ rides along into both nets.</p>
       <p><b>Why this gives control.</b> Because $D$ checks realism <i>per class</i>, $G$ cannot get away with
       producing, say, only 7s for every label: a 7 handed in under the label "2" is caught. So $G$ is forced to
       map the label slot to the matching class. After training, you set $y$ to the class you want and $G$ obeys.</p>`,
    symbols: [
      { sym: "$G(z|y)$", desc: "the <b>conditional generator</b>: a neural net that takes a noise vector $z$ <b>and</b> a condition $y$ (here the class label) and outputs a fake sample meant to be of class $y$. The bar \"$|$\" reads \"given $y$\"." },
      { sym: "$D(x|y)$", desc: "the <b>conditional discriminator</b>: a neural net that takes a sample $x$ <b>and</b> the condition $y$ and outputs a number in $[0,1]$ &mdash; the probability $x$ is a <b>real</b> example <i>of class $y$</i>." },
      { sym: "$y$", desc: "the <b>condition / auxiliary information</b> (&sect;3.2). \"Any kind of auxiliary information, such as class labels or data from other modalities.\" In our build it is the digit class, encoded one-hot." },
      { sym: "one-hot vector", desc: "a plain term, not a symbol: a length-$K$ vector that is $1$ in the slot for the chosen class and $0$ everywhere else ($K$ = number of classes). It is how the integer label $y$ is fed to a network." },
      { sym: "$z$", desc: "the <b>noise / latent vector</b>: random input to $G$, the source of variety <i>within</i> a requested class (different 7s for the same label)." },
      { sym: "$p_z(z)$", desc: "the <b>prior</b> over the noise &mdash; a fixed simple distribution we sample $z$ from. The paper uses a uniform unit hypercube of dimension 100 (&sect;4.1); not learned." },
      { sym: "$p_{\\text{data}}(x)$", desc: "the <b>true data distribution</b> (real MNIST images, with their labels). Conditioning slices it into per-class distributions $p_{\\text{data}}(x|y)$." },
      { sym: "$V(D,G)$", desc: "the <b>value function</b> of the game: one scalar that $D$ maximizes and $G$ minimizes. In Eq. (2) it is the conditional version." },
      { sym: "$\\mathbb{E}_{x\\sim p_{\\text{data}}}[\\cdot]$", desc: "an <b>expectation</b> &mdash; the average of the bracketed quantity over many real samples $x$. In code it is the mean over a real-data minibatch." },
      { sym: "$\\min_G\\max_D$", desc: "the <b>minimax</b> structure (unchanged from the GAN): $D$ maximizes $V$ (best class-aware detector), $G$ minimizes it (best class-aware forger)." },
      { sym: "“conditioning”", desc: "a plain term: making a network's output depend on an extra given input. Here, both $G$ and $D$ are conditioned on $y$ by concatenating it to their inputs." }
    ],
    formula: `$$ \\min_G \\max_D V(D,G) = \\mathbb{E}_{x\\sim p_{\\text{data}}(x)}\\big[\\log D(x\\,|\\,y)\\big] + \\mathbb{E}_{z\\sim p_z(z)}\\big[\\log\\big(1 - D(G(z\\,|\\,y))\\big)\\big] \\qquad\\text{(Eq. 2, \\S3.2)} $$`,
    whatItDoes:
      `<p>Compare it to the plain GAN (Eq. 1): it is <b>letter-for-letter the same game</b>, except $D(x)$ became
       $D(x|y)$ and $G(z)$ became $G(z|y)$ &mdash; both players now also see the label $y$.</p>
       <p>The first term, $\\mathbb{E}_{x\\sim p_{\\text{data}}}[\\log D(x|y)]$, is large when $D$ confidently calls a
       <b>real</b> sample "real for its label" ($D(x|y)\\to 1$). The second term,
       $\\mathbb{E}_{z\\sim p_z}[\\log(1-D(G(z|y)))]$, is large when $D$ confidently calls a <b>fake</b> of the
       requested class "fake" ($D(G(z|y))\\to 0$). So $D$ <b>maximizing</b> $V$ becomes a sharp
       <i>"is this a genuine example of class $y$?"</i> classifier; $G$ <b>minimizing</b> $V$ wants
       $D(G(z|y))\\to 1$ &mdash; to produce class-$y$ fakes good enough to pass <i>under that label</i>. The label
       threading through both terms is the entire mechanism of control.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the core minimax math lives in the <i>dl-gan</i> concept lesson and is worked in
       full in <i>paper-gan</i>; we only extend it to the conditional case here.</b></p>
       <p>Fix $G$ and fix a condition $y$. <i>For that $y$</i>, Eq. (2) is exactly an ordinary GAN value function
       between the per-class real distribution $p_{\\text{data}}(x|y)$ and the per-class generator distribution
       $p_g(x|y)$. So Proposition 1 from the GAN paper applies verbatim, just with everything conditioned on $y$.
       The optimal conditional discriminator is</p>
       <p>$$ D^*(x|y) = \\frac{p_{\\text{data}}(x|y)}{p_{\\text{data}}(x|y) + p_g(x|y)}. $$</p>
       <p>Substituting back (Theorem 1, applied per condition) makes the generator's objective, for each $y$,</p>
       <p>$$ C(G) = -\\log 4 + 2\\cdot\\mathrm{JSD}\\big(p_{\\text{data}}(\\cdot|y)\\,\\|\\,p_g(\\cdot|y)\\big), $$</p>
       <p>where $\\mathrm{JSD}$ is the <b>Jensen-Shannon divergence</b> (a symmetric "distance" between two
       distributions, $\\ge 0$, zero only when they are identical). So the optimum is reached when
       $p_g(x|y) = p_{\\text{data}}(x|y)$ <b>for every class $y$</b> &mdash; i.e. the generator matches the real
       data <i>class by class</i>. That is the formal statement of "it generates the right class on demand."
       (The plain-GAN paper does <b>not</b> re-prove this for the conditional case; it follows immediately by
       holding $y$ fixed, which is why we recap rather than re-derive.)</p>`,
    example:
      `<p>Work the optimal <b>conditional</b> discriminator and the equilibrium value by hand (these are
       recomputed in the notebook's first cell).</p>
       <ul class="steps">
        <li><b>Optimal $D$ at one point, for a fixed label $y$.</b> Suppose for class $y$, at some image $x$, the
        real per-class density is $p_{\\text{data}}(x|y)=0.6$ and the generator's per-class density is
        $p_g(x|y)=0.2$. Then
        $D^*(x|y) = \\dfrac{0.6}{0.6+0.2} = \\dfrac{0.6}{0.8} = 0.75$. The best class-aware detector gives this
        point a $75\\%$ chance of being a real example <i>of class $y$</i>.</li>
        <li><b>Its real-side contribution to $V$:</b> $\\log D^*(x|y) = \\log 0.75 = -0.2877$.</li>
        <li><b>A fake-side term.</b> For a class-$y$ fake where the current $D$ outputs $D(G(z|y))=0.3$, the
        contribution is $\\log(1-0.3) = \\log 0.7 = -0.3567$.</li>
        <li><b>The converged value.</b> When $G$ matches the data for this class ($p_g(\\cdot|y)=p_{\\text{data}}
        (\\cdot|y)$), $D^* = \\tfrac12$ there and the game value hits $-\\log 4 = -1.3863$. Each <b>BCE</b> (binary
        cross-entropy) term settles at $-\\log\\tfrac12 = \\log 2 = 0.6931$, so $D$'s total loss settles near
        $2\\log 2 = 1.3863$ &mdash; the same plateau as a plain GAN, now reached <i>per class</i>. Watch for these
        numbers in the loss panel.</li>
       </ul>`,
    recipe:
      `<ol>
        <li><b>One-hot the label.</b> Turn integer label $y$ into a length-$K$ one-hot vector ($K$ = number of
        classes).</li>
        <li><b>Build the conditional generator</b> $G$: an MLP whose input is <code>cat([z, oh])</code>
        (<code>z_dim + K &rarr; hidden &rarr; out</code>); a <code>tanh</code> output for image pixels in $[-1,1]$.</li>
        <li><b>Build the conditional discriminator</b> $D$: an MLP whose input is <code>cat([x, oh])</code>
        (<code>x_dim + K &rarr; hidden &rarr; 1</code>), one real/fake logit (sigmoid inside the BCE loss).</li>
        <li><b>Discriminator step</b> ($k=1$): take real $(x,y)$ with its <i>true</i> one-hot; sample fake labels,
        generate, feed the <b>matching</b> label to $D$. Minimize
        <code>bce(D([x,oh]),1) + bce(D([G([z,oh]).detach(),oh]),0)</code>. The <code>.detach()</code> keeps this
        step from updating $G$.</li>
        <li><b>Generator step</b> (non-saturating): pick labels, generate, ask $D$ to call them real for that
        label: minimize <code>bce(D([G([z,oh]),oh]),1)</code>.</li>
        <li><b>Generate on demand:</b> to get class $k$, set the one-hot to $k$, sample $z$, run $G$. (Fig. 2 in
        the paper is exactly this &mdash; each row is one requested label.)</li>
        <li><b>Ablate</b> to prove the label matters: remove $y$ from both nets and retrain &mdash; now you cannot
        steer the class.</li>
      </ol>`,
    results:
      `<p>On MNIST (&sect;4.1), the conditional net is a one-hidden-layer MLP per the paper: the generator draws a
       <b>100-dim</b> noise prior from a uniform unit hypercube, maps $z$ and the one-hot $y$ to ReLU layers of
       size <b>200</b> and <b>1000</b>, merges them into a combined ReLU layer of dimensionality <b>1200</b>, and
       outputs <b>784</b> pixels via a sigmoid. The discriminator uses maxout layers (240/5 for $x$, 50/5 for $y$,
       joint 240/4) into a sigmoid. They report a Parzen-window log-likelihood estimate for the conditional
       model:</p>
       <blockquote>"Conditional adversarial nets &mdash; <b>$132 \\pm 1.8$</b>" (Table 1; for comparison, the
       unconditional adversarial net scores $225 \\pm 2$ &mdash; higher is better on this metric).</blockquote>
       <p>The authors are explicit that this is a <b>proof of concept</b>, not a state-of-the-art result:
       "The conditional adversarial net results that we present are comparable with some other network based,
       but are outperformed by several other approaches &hellip; We present these results more as a
       proof-of-concept than as demonstration of efficacy." The headline is the <b>control</b> (Fig. 2: each row
       is a requested digit), not the likelihood number.</p>
       <p><i>The numbers in the CODEVIZ panel below are from our own tiny run &mdash; not the paper's reported
       results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the building blocks ship in PyTorch, so you <b>import</b>
       them and build only the novel composition &mdash; here, the <b>label conditioning</b> on top of the GAN
       loop. <b>Import:</b> <code>nn.Linear</code>, <code>nn.ReLU</code>/<code>nn.LeakyReLU</code>,
       <code>nn.Tanh</code>, <code>nn.BCEWithLogitsLoss</code>, Adam, and the MNIST loader from torchvision
       (preinstalled in Colab &mdash; no pip). <b>Build by hand:</b> the one-hot encoding of $y$, its
       concatenation into <i>both</i> $G$ and $D$ inputs, the two alternating steps (with <code>.detach()</code>
       on the fakes in the $D$ step), the non-saturating $G$ objective, and the "generate a chosen class" call.
       The minimax / Proposition-1 / JSD math is recapped from <b>dl-gan</b> and <b>paper-gan</b>, not
       re-derived; the conditional extension just holds $y$ fixed.</p>`,
    pitfalls:
      `<ul>
        <li><b>Feeding $y$ to only one net.</b> If only $G$ sees the label, $D$ has no way to penalize "right
        digit, wrong label" &mdash; so $G$ has no pressure to obey the label and control collapses. <b>Fix:</b>
        concatenate $y$ into <i>both</i> $G$ and $D$ inputs (&sect;3.2: "feeding $y$ into the both the
        discriminator and generator").</li>
        <li><b>Label mismatch in the $D$ step.</b> When you judge a fake, you must hand $D$ the <b>same</b> label
        you generated it under. Pairing a fake with a different (or random) label corrupts the training signal.</li>
        <li><b>One-hot width / dimension errors.</b> Widen the first <code>nn.Linear</code> of both nets by $K$
        (the number of classes) to make room for the one-hot, or the <code>cat</code> will be a shape mismatch.</li>
        <li><b>Forgetting <code>.detach()</code> in the discriminator step</b> (inherited from plain GAN): without
        it, the $D$-step also nudges $G$ in the wrong direction. <b>Fix:</b> detach the fakes when training $D$.</li>
        <li><b>Reading the losses as "lower is better."</b> As with any GAN, a converged cGAN drives $D$'s loss
        toward $2\\log 2 \\approx 1.386$ (it can only guess <i>within</i> a class), not to $0$. The flat plateau is
        the goal.</li>
        <li><b>Mismatched output range.</b> If $G$ ends in <code>tanh</code> ($[-1,1]$) but images are $[0,1]$,
        $D$ separates on scale alone. <b>Fix:</b> normalize the data to $G$'s output range.</li>
      </ul>`,
    recall: [
      "Write the conditional GAN value function (Eq. 2) from memory, and say what changed vs Eq. 1.",
      "What does the bar in $D(x|y)$ and $G(z|y)$ mean?",
      "How is the label $y$ fed into the two nets, and into which one(s)?",
      "What is the optimal conditional discriminator $D^*(x|y)$ for a fixed $G$ and fixed $y$?",
      "Define a one-hot vector, and say why $K$ (the number of classes) appears in both nets' input widths."
    ],
    practice: [
      {
        q: `<b>The conditioning ablation.</b> Take your working cGAN and remove the label from BOTH nets (drop the
            one-hot from the inputs and shrink the first layers back by $K$). Keep everything else identical and
            retrain. Then "request" class 2. What can the ablated generator do, and what does that prove the label
            was buying you?`,
        steps: [
          { do: `Strip $y$: make $G$'s input just $z$ and $D$'s input just $x$ (the plain paper-gan).`, why: `An honest ablation changes exactly one thing &mdash; whether the nets see the label.` },
          { do: `Retrain, then try to generate class 2: there is no label slot to set, so $G$ just emits its usual mixture of all classes.`, why: `With no condition in $G$, the only input is noise; which class appears is whatever $z$ maps to &mdash; uncontrollable.` },
          { do: `Measure: generate a pool and compare its single mean to each class center; it sits in the middle, far from any one class.`, why: `An unconditional $G$ covers the whole data distribution at once; it cannot collapse onto a requested class.` },
          { do: `Conclude the label conditioning is exactly the steering wheel &mdash; remove it and you lose on-demand class generation.`, why: `This is the paper's whole contribution, demonstrated by its absence.` }
        ],
        answer: `<p>The ablated generator has <b>no way to receive the request</b>: its only input is noise, so it
                 produces an uncontrolled mixture of all classes and ignores "class 2" entirely. In our toy run the
                 conditional generator hits <b>purity 1.000</b> per requested class and a mean error of about
                 <b>0.38</b> to the right class center, while the ablated generator's single blob sits ~<b>1.98</b>
                 away from any requested class (it can only ever produce one overall average). This proves that
                 concatenating the label into <i>both</i> nets is precisely what buys controllable, on-demand class
                 generation &mdash; the entire point of the paper.</p>`
      },
      {
        q: `Your worked example had $p_{\\text{data}}(x|y)=0.6$ and $p_g(x|y)=0.2$, giving $D^*(x|y)=0.75$.
            Suppose for that class the generator has now matched the data at this point, so $p_g(x|y)=0.6$. What is
            $D^*(x|y)$, and what does it say about a converged cGAN <i>per class</i>?`,
        steps: [
          { do: `Plug into the conditional Prop. 1: $D^*(x|y) = \\dfrac{0.6}{0.6+0.6} = \\dfrac{0.6}{1.2} = 0.5$.`, why: `When real and fake per-class densities are equal at $x$, the class-aware detector cannot tell them apart.` },
          { do: `Note that if $p_g(\\cdot|y)=p_{\\text{data}}(\\cdot|y)$ for every class, then $D^*=0.5$ everywhere.`, why: `The discriminator is reduced to a coin flip within each class &mdash; the equilibrium of the conditional game.` },
          { do: `Map to the loss: each BCE term becomes $-\\log 0.5 = \\log 2 \\approx 0.693$, so $D$'s total settles near $2\\log 2 \\approx 1.386 = -\\log 4$.`, why: `Same plateau as a plain GAN, now reached class by class.` }
        ],
        answer: `<p>$D^*(x|y) = 0.6/(0.6+0.6) = 0.5$. Once the generator matches the data <i>for that class</i>, the
                 best class-aware discriminator outputs $0.5$ &mdash; it can only guess <i>within</i> the class. If
                 this holds for every class, $D^*=0.5$ everywhere and $D$'s loss settles near $2\\log 2\\approx 1.386$
                 ($-\\log 4$), not $0$. A converged cGAN reaches the GAN equilibrium <b>independently per class</b>.</p>`
      },
      {
        q: `In the discriminator step you generate a fake for class 3 but, by a bug, hand $D$ the label "7" when
            judging it. Why does this break conditioning, and what is the correct pairing?`,
        steps: [
          { do: `Recall $D(x|y)$ answers "is $x$ a real example <i>of class $y$</i>?"`, why: `The label is part of what $D$ checks; it is not a passive tag.` },
          { do: `See the bug: $D$ is now asked whether a class-3 fake is a real "7" &mdash; it learns the wrong association between samples and labels.`, why: `The training signal that ties "this image" to "this class" is corrupted.` },
          { do: `Fix it: judge each fake under the SAME label it was generated with (here, "3").`, why: `Only matched (sample, label) pairs teach $D$ the per-class real-vs-fake boundary, which is what forces $G$ to obey the label.` }
        ],
        answer: `<p>$D(x|y)$ scores realism <i>for the given label</i>. Generating a class-3 fake but judging it as
                 a "7" teaches $D$ a wrong sample-label association and removes the pressure on $G$ to match the
                 requested class, so control degrades. The correct pairing is to feed $D$ the <b>same</b> label the
                 sample was generated under &mdash; matched $(x, y)$ pairs on both the real and fake sides.</p>`
      }
    ]
  });

  window.CODE["paper-cgan"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we build a <b>conditional</b> generator and discriminator (MLPs from <code>nn.Linear</code>) in
       which <b>both</b> nets receive the class label as a one-hot vector concatenated to their inputs &mdash; that
       concatenation is the paper's whole idea (&sect;3.2). We train on <b>MNIST</b> (torchvision, preinstalled in
       Colab &mdash; no pip), then <b>generate a CHOSEN digit on demand</b> by setting the one-hot. The key lines
       are the two alternating steps with the label threaded through: $D$ minimizes
       <code>bce(D[x,y],1)+bce(D[G[z,y].detach(),y],0)</code> and the non-saturating $G$ minimizes
       <code>bce(D[G[z,y],y],1)</code> (Eq. 2). The first cell recomputes the worked example:
       $D^*(x|y)=0.6/0.8=0.75$, $\\log 0.75=-0.2877$, $\\log 0.7=-0.3567$, $-\\log 4=-1.3863$. We also include the
       <b>ablation</b> (drop the label) so you can see control disappear. Paste into Colab and run.</p>`,
    code: `import torch, torch.nn as nn, math
import torchvision, torchvision.transforms as T

torch.manual_seed(0)
device = "cuda" if torch.cuda.is_available() else "cpu"
K = 10                                          # MNIST has 10 classes
Z = 64

# --- 0. Sanity-check the worked example (conditional optimal D + the global optimum). ---
pdy, pgy = 0.6, 0.2
Dstar = pdy / (pdy + pgy)                        # D*(x|y) = p_data(x|y)/(p_data(x|y)+p_g(x|y))
print("worked example (per condition y):")
print("  D*(x|y) = %.2f/%.2f = %.4f" % (pdy, pdy+pgy, Dstar))       # 0.75
print("  log D*(x|y)          = %.4f" % math.log(Dstar))            # -0.2877
print("  fake term log(1-0.3) = %.4f" % math.log(1 - 0.3))          # -0.3567
print("  global optimum -log4 = %.4f" % (-math.log(4)))            # -1.3863
print("  D-loss at equilibrium 2*log2 = %.4f" % (2*math.log(2)))   # 1.3863


# --- 1. CONDITIONAL generator & discriminator: BOTH take the one-hot label, concatenated. ---
def onehot(y):                                  # integer labels -> one-hot rows
    return torch.eye(K, device=y.device)[y]

class G(nn.Module):                             # [noise z | label y] -> 784 pixels in [-1,1]
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(Z + K, 256), nn.LeakyReLU(0.2),   # +K: room for the one-hot
            nn.Linear(256, 512), nn.LeakyReLU(0.2),
            nn.Linear(512, 784), nn.Tanh())
    def forward(self, z, y): return self.net(torch.cat([z, onehot(y)], 1))

class D(nn.Module):                             # [image x | label y] -> 1 real/fake logit
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(784 + K, 512), nn.LeakyReLU(0.2),  # +K: same one-hot
            nn.Linear(512, 256), nn.LeakyReLU(0.2),
            nn.Linear(256, 1))                           # sigmoid lives inside the BCE loss
    def forward(self, x, y): return self.net(torch.cat([x, onehot(y)], 1))

gen, dis = G().to(device), D().to(device)
bce = nn.BCEWithLogitsLoss()
optG = torch.optim.Adam(gen.parameters(), lr=2e-4, betas=(0.5, 0.999))
optD = torch.optim.Adam(dis.parameters(), lr=2e-4, betas=(0.5, 0.999))


# --- 2. MNIST (torchvision preinstalled in Colab). Scale to [-1,1] to match tanh. ---
tfm = T.Compose([T.ToTensor(), T.Normalize((0.5,), (0.5,))])
data = torchvision.datasets.MNIST(root="./data", train=True, download=True, transform=tfm)
loader = torch.utils.data.DataLoader(data, batch_size=128, shuffle=True, drop_last=True)


# --- 3. Print a generated digit of a CHOSEN class so we SEE the conditioning work. ---
fixed_z = torch.randn(1, Z, device=device)
def preview(want):                              # want = the digit class we REQUEST
    gen.eval()
    with torch.no_grad():
        y = torch.tensor([want], device=device)
        img = gen(fixed_z, y).view(28, 28).cpu()
    gen.train()
    img = (img + 1) / 2
    print("--- requested digit:", want, "---")
    for r in range(0, 28, 2):
        print("".join(" .:-=+*#%@"[min(9, int(img[r, c].clamp(0,1) * 9))] for c in range(28)))


# --- 4. The adversarial loop, now with the label threaded through BOTH nets (Eq. 2). ---
def train(epochs=3):
    step = 0
    for ep in range(epochs):
        for x, y in loader:
            x = x.view(x.size(0), -1).to(device); y = y.to(device)
            m = x.size(0)
            real_t = torch.ones(m, 1, device=device); fake_t = torch.zeros(m, 1, device=device)

            # (a) DISCRIMINATOR step: judge reals under TRUE labels, fakes under the SAME label.
            z = torch.randn(m, Z, device=device)
            yf = torch.randint(0, K, (m,), device=device)   # labels we generate fakes for
            fake = gen(z, yf).detach()                       # detach: this step must NOT move G
            lossD = bce(dis(x, y), real_t) + bce(dis(fake, yf), fake_t)
            optD.zero_grad(); lossD.backward(); optD.step()

            # (b) GENERATOR step: non-saturating -- make D call class-yf fakes "real for yf".
            z = torch.randn(m, Z, device=device)
            yf = torch.randint(0, K, (m,), device=device)
            lossG = bce(dis(gen(z, yf), yf), real_t)
            optG.zero_grad(); lossG.backward(); optG.step()

            if step % 600 == 0:
                print("step %5d   D loss %.3f   G loss %.3f" % (step, lossD.item(), lossG.item()))
            step += 1
        preview(want=ep % K)                                 # ask for a different digit each epoch

print("\\nbefore training (requesting a 3):"); preview(3)
train(epochs=3)
print("\\nNow generate any digit on demand:")
for d in [0, 5, 9]:
    preview(d)
print("\\nD loss settles near 2*log2 = 1.386 PER CLASS; the requested digit should emerge.")
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)


# --- 5. ABLATION: drop the label from both nets -> you can no longer choose the class. ---
class Gu(nn.Module):                            # unconditional: noise only
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Linear(Z, 256), nn.LeakyReLU(0.2),
                                 nn.Linear(256, 512), nn.LeakyReLU(0.2),
                                 nn.Linear(512, 784), nn.Tanh())
    def forward(self, z): return self.net(z)
# Train Gu with the plain-GAN loop (no y anywhere); requesting a class is impossible --
# its only input is noise, so the digit is whatever z maps to. That is the point of the ablation.`
  };

  window.CODEVIZ["paper-cgan"] = {
    question: "Does conditioning on the label let us generate a CHOSEN class on demand — and what happens when we ablate the label?",
    charts: [
      {
        type: "bar",
        title: "Generate a requested class: distance from samples' mean to the TRUE class center (lower = on target)",
        xlabel: "requested class",
        ylabel: "mean distance to that class's center",
        series: [
          { name: "Conditional (label fed to G & D)", color: "#7ee787",
            points: [["class 0", 0.402], ["class 1", 0.209], ["class 2", 0.526]] },
          { name: "Ablated (no label)", color: "#ff7b72",
            points: [["class 0", 2.012], ["class 1", 1.963], ["class 2", 1.970]] }
        ]
      },
      {
        type: "line",
        title: "Conditional discriminator loss vs step — settles at the GAN equilibrium 2·log 2 ≈ 1.386, now per class",
        xlabel: "training step",
        ylabel: "discriminator BCE loss",
        series: [
          { name: "Conditional D loss", color: "#4ea1ff",
            points: [[0,1.4466],[50,1.2242],[100,0.9266],[150,1.3468],[200,1.3889],[250,1.3943],[300,1.3925],[350,1.3869],[400,1.3864],[450,1.3857],[500,1.3847],[550,1.3916],[600,1.3889],[650,1.3903],[700,1.3845],[750,1.3863],[800,1.386],[850,1.3815],[900,1.3897],[950,1.3908],[1000,1.3935],[1050,1.4009],[1100,1.392],[1150,1.4047],[1200,1.3953],[1250,1.3985],[1300,1.3926],[1350,1.3904],[1400,1.3962],[1450,1.39]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Two tiny GANs (G/D from nn.Linear, non-saturating G loss, Adam) trained on a 3-class toy dataset of Gaussian blobs at distinct centers &mdash; a stand-in for MNIST's digit classes. <b>Conditional</b> (label one-hot concatenated into BOTH G and D, the paper's Eq. 2 mechanism): when we REQUEST a class, the generated samples land on that class's center (mean distance ~0.21&ndash;0.53; <b>purity 1.000</b> &mdash; every \"class k\" sample is nearest the right center). <b>Ablated</b> (no label): the generator has no slot to receive a request, so it emits one undifferentiated blob whose mean sits ~<b>1.98</b> from any requested class &mdash; it cannot be steered. The conditional discriminator loss parks at <b>~1.386 = 2·log 2 = -log 4</b>, the GAN equilibrium, reached per class. Label conditioning IS the on-demand-class knob.",
    code: `import torch, torch.nn as nn, numpy as np
torch.manual_seed(0); np.random.seed(0)

# 3-class toy data: each class is a Gaussian blob at a distinct center (a stand-in for
# MNIST's digit classes). Same loop as the MNIST notebook, small enough to run in seconds.
K = 3
CENTERS = torch.tensor([[2.0, 0.0], [-1.0, 1.7], [-1.0, -1.7]])
def real_batch(m):
    y = torch.randint(0, K, (m,)); return torch.randn(m, 2)*0.30 + CENTERS[y], y
def onehot(y): return torch.eye(K)[y]
Z = 8

def make_nets(conditional):
    c = K if conditional else 0
    G = nn.Sequential(nn.Linear(Z+c, 64), nn.ReLU(), nn.Linear(64, 2))
    D = nn.Sequential(nn.Linear(2+c, 64), nn.ReLU(), nn.Linear(64, 1))
    return G, D

def train(conditional, steps=1500):
    torch.manual_seed(1)
    G, D = make_nets(conditional); bce = nn.BCEWithLogitsLoss()
    optD = torch.optim.Adam(D.parameters(), lr=2e-3, betas=(0.5,0.999))
    optG = torch.optim.Adam(G.parameters(), lr=2e-3, betas=(0.5,0.999))
    m, hist = 128, []
    for s in range(steps):
        x, y = real_batch(m); oh = onehot(y); z = torch.randn(m, Z)
        gin  = torch.cat([z, oh],1) if conditional else z
        dr   = torch.cat([x, oh],1) if conditional else x
        fake = G(gin).detach()
        df   = torch.cat([fake, oh],1) if conditional else fake
        lossD = bce(D(dr), torch.ones(m,1)) + bce(D(df), torch.zeros(m,1))
        optD.zero_grad(); lossD.backward(); optD.step()
        z = torch.randn(m, Z); gin = torch.cat([z, oh],1) if conditional else z
        g = G(gin); din = torch.cat([g, oh],1) if conditional else g
        lossG = bce(D(din), torch.ones(m,1))
        optG.zero_grad(); lossG.backward(); optG.step()
        if s % 50 == 0: hist.append((s, round(lossD.item(),4)))
    return G, hist

def gen_class(G, k, n, conditional):
    z = torch.randn(n, Z)
    if conditional:
        return G(torch.cat([z, onehot(torch.full((n,), k))],1)).detach()
    return G(z).detach()

Gc, dlc = train(True); Gu, _ = train(False)
print("CONDITIONAL -- request each class, mean & purity:")
for k in range(K):
    s = gen_class(Gc, k, 2000, True)
    err = (s.mean(0) - CENTERS[k]).norm().item()
    purity = (torch.cdist(s, CENTERS).argmin(1) == k).float().mean().item()
    print(" class %d: err %.3f  purity %.3f" % (k, err, purity))
pool = gen_class(Gu, 0, 6000, False); mu = pool.mean(0)
print("ABLATED -- single mean %s; dist to each requested class:" % [round(v,3) for v in mu.tolist()])
for k in range(K):
    print(" 'asking' class %d: err %.3f" % (k, (mu - CENTERS[k]).norm().item()))
print("Conditional D-loss history:", dlc[:10])
# Conditional steers to the chosen class (purity ~1.0); ablated cannot (one blob, err ~1.98).`
  };
})();
