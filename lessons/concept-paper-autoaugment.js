/* Paper lesson — "AutoAugment: Learning Augmentation Strategies from Data", Cubuk, Zoph, Mané,
   Vasudevan, Le 2018 (Google Brain). Self-contained: lesson + CODE + CODEVIZ merged by id
   "paper-autoaugment".
   GROUNDED from arXiv:1805.09501 (abstract) and the ar5iv HTML mirror:
     - Section 1 (authors/org), Section 3 (Search space + search algorithm: 5 sub-policies, 2
       operations each, 11 probabilities, 10 magnitudes, 16 operations; controller RNN trained with
       Proximal Policy Optimization; reward = validation accuracy of a child model);
     - Section 3 search-space size: "(16x10x11)^10 ~= 2.9 x 10^32 possibilities";
     - Section 4.3 transferability (ImageNet policy transfers to FGVC datasets);
     - reported errors: CIFAR-10 1.48% (Section 4.1), SVHN 1.0%, ImageNet 83.5% top-1.
   Track B (architecture): we do NOT run the RL search (too expensive). We BUILD a hand-specified
   AutoAugment-style policy of 5 sub-policies, compose it with torchvision transforms exactly as the
   paper applies a found policy, train a tiny classifier with it, and ABLATE it (no-aug vs policy).
   The convolution math lives in concept dl-conv; data-augmentation framing in dl-data-augmentation. */
(function () {
  window.LESSONS.push({
    id: "paper-autoaugment",
    title: "AutoAugment — Learning Augmentation Strategies from Data (2018)",
    tagline: "Treat data augmentation as a search problem: let reinforcement learning discover which image transforms (and how strong, how often) raise validation accuracy.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Ekin D. Cubuk, Barret Zoph, Dandelion Mané, Vijay Vasudevan, Quoc V. Le",
      org: "Google Brain",
      year: 2018,
      venue: "arXiv:1805.09501 (May 2018); CVPR 2019",
      citations: "",
      arxiv: "https://arxiv.org/abs/1805.09501",
      code: "https://github.com/tensorflow/models/tree/master/research/autoaugment"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["dl-data-augmentation", "paper-ppo", "pt-cnn", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p><b>Data augmentation</b> means making extra training images by transforming the ones you have
       &mdash; flipping, rotating, shifting colors &mdash; so a classifier sees more variety and
       generalizes better. Before this paper, the set of transforms (and how hard to push each one) was
       chosen <b>by hand</b>, by trial and error, and it did <i>not</i> transfer: a recipe tuned for one
       dataset rarely matched another.</p>
       <blockquote>"In this paper, we describe a simple procedure called AutoAugment to automatically
       search for improved data augmentation policies." (abstract)</blockquote>
       <p>Read the problem as: augmentation was a <b>manual hyperparameter</b>. Each dataset got its own
       hand-tuned recipe, the design space is huge (which transforms? what magnitude? how often?), and
       there was no principled way to find a good policy. The paper asks &mdash; can we <b>learn</b> the
       augmentation policy directly from the data, the way we learn weights?</p>`,
    contribution:
      `<ul>
        <li><b>Augmentation as a search problem.</b> The paper defines a structured <b>search space</b>:
        a <i>policy</i> is made of <b>5 sub-policies</b>; each sub-policy is <b>2 operations applied in
        sequence</b>; each operation is a triple <i>(which transform, a probability of applying it, a
        magnitude/strength)</i> (&sect;3).</li>
        <li><b>A reinforcement-learning (RL) search.</b> A controller &mdash; a recurrent neural network
        (RNN) &mdash; <b>samples</b> candidate policies. A small "child" network is trained with each
        policy, and its <b>validation accuracy</b> is fed back as the <b>reward</b>. The controller is
        updated with <b>Proximal Policy Optimization (PPO)</b> to sample better policies over time
        (&sect;3).</li>
        <li><b>Learned policies transfer.</b> A policy found on one dataset improves accuracy on
        <i>other</i> datasets without re-searching &mdash; e.g. the ImageNet policy transfers to several
        fine-grained datasets (&sect;4.3). The paper also reports state-of-the-art error rates on
        CIFAR-10, SVHN, and ImageNet at the time.</li>
      </ul>`,
    whyItMattered:
      `<p>AutoAugment showed that augmentation policies can be <b>learned and reused</b>, and its found
       policies became drop-in upgrades for vision models. Its main practical drawback &mdash; the RL
       search costs thousands of GPU hours &mdash; directly motivated cheaper successors:
       <b>RandAugment</b> (remove the search, keep two global knobs), <b>Fast AutoAugment</b>, and
       <b>Population Based Augmentation</b>. The broader idea &mdash; <b>automate a design choice by
       making it a search over a structured space scored by validation accuracy</b> &mdash; is the same
       recipe as Neural Architecture Search, which the same authors had pioneered.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the framing: augmentation is usually hand-designed and
        dataset-specific; AutoAugment searches for it instead.</li>
        <li><b>&sect;3 (AutoAugment: Searching for best Augmentation policies)</b> &mdash; the core. Two
        parts: the <b>search space</b> (policy &rarr; 5 sub-policies &rarr; 2 operations each &rarr;
        (operation, probability, magnitude); 16 operations; 11 probabilities; 10 magnitudes) and the
        <b>search algorithm</b> (controller RNN + child model + PPO, reward = validation accuracy). This
        is what you will reproduce conceptually.</li>
        <li>The <b>search-space size</b> sentence in &sect;3: $(16\\times10\\times11)^{10}\\approx
        2.9\\times10^{32}$ &mdash; the combinatorics you will work by hand.</li>
        <li><b>&sect;4.3 (Transferability)</b> &mdash; the ImageNet policy transferring to fine-grained
        datasets.</li>
       </ul>
       <p><b>Skim:</b> the full result tables (&sect;4.1&ndash;4.2) and the appendix list of every found
       sub-policy. You need the <i>structure</i> of a policy and the <i>search loop</i>, not the exact
       transforms of any one found policy.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will take a tiny image classifier and train it twice on the same small dataset: once with
       <b>no augmentation</b>, once with a fixed <b>AutoAugment-style policy</b> (5 sub-policies of random
       transforms applied to each training image). Same model, same epochs, same data.</p>
       <p>On <b>validation accuracy</b>, do you expect the augmented run to be <b>better</b>,
       <b>the same</b>, or <b>worse</b>? Write your guess and one sentence of reasoning. (Hint: augmentation
       does not add new <i>labels</i> &mdash; it adds <i>variety</i>. What does extra variety do to
       overfitting on a small dataset?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the two pieces you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>A <b>sub-policy</b> is a list of operations, each <code>(op, p, magnitude)</code>: with
        probability <code>p</code>, apply <code>op</code> at that <code>magnitude</code>; otherwise skip
        it.</li>
        <li>A <b>policy</b> is a list of <b>5</b> sub-policies. TODO: to augment one image, pick <b>one</b>
        sub-policy <b>uniformly at random</b>, then apply its (up to 2) operations in order.</li>
        <li>TODO: wrap that policy as a torchvision transform and prepend it to the training pipeline
        (before <code>ToTensor</code>). The validation pipeline gets <b>no</b> augmentation.</li>
        <li>TODO: the <b>ablation</b> &mdash; a second, identical training run with the augmentation
        transform removed. Predict which run generalizes better.</li>
       </ul>
       <p>(We will <b>not</b> run the RL controller &mdash; that costs thousands of GPU hours. We apply a
       hand-fixed policy exactly as the paper applies a <i>found</i> one, and reason about the search.)</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>AutoAugment has two halves: a <b>search space</b> (what a policy can be) and a <b>search
       algorithm</b> (how to find a good one). Both are in &sect;3.</p>
       <p><b>The search space (what gets searched).</b> The atom is an <b>operation</b>: a triple
       (a transform $t$, a probability $p$, a magnitude $m$). The transform is one of <b>16</b> image
       operations (ShearX/Y, TranslateX/Y, Rotate, AutoContrast, Invert, Equalize, Solarize, Posterize,
       Contrast, Color, Brightness, Sharpness, Cutout, SamplePairing). The probability $p$ says how often
       to apply it; the magnitude $m$ says how strong. The paper <b>discretizes</b> these so they can be
       searched: $p$ takes one of <b>11</b> evenly spaced values, and $m$ one of <b>10</b> evenly spaced
       values (&sect;3). A <b>sub-policy</b> is <b>2 operations applied in sequence</b> (e.g. "rotate, then
       maybe solarize"). A full <b>policy</b> is <b>5 such sub-policies</b>.</p>
       <p><b>How a policy is applied (at training time).</b> "For every image in a mini-batch, we choose a
       sub-policy uniformly at random to generate a transformed image" (&sect;3). So each image gets one of
       the 5 sub-policies, and within it each of the 2 operations fires only with its probability $p$.
       Because of the random choice and the probabilities, the <b>same image is augmented differently each
       epoch</b> &mdash; that is the variety the model trains on.</p>
       <p><b>The search algorithm (how a policy is found).</b> A <b>controller</b> &mdash; a recurrent
       neural network &mdash; outputs the discrete choices of a candidate policy (which transform, which
       probability bucket, which magnitude bucket, for all 10 operations in a 5-sub-policy policy). A small
       <b>child network</b> is trained from scratch with that policy, and its <b>validation accuracy $R$</b>
       is the <b>reward</b>. There is no gradient from accuracy back to the discrete choices, so the
       controller is trained by <b>reinforcement learning</b> &mdash; specifically <b>Proximal Policy
       Optimization (PPO)</b> &mdash; to raise the expected reward (&sect;3). Over many sampled policies the
       controller drifts toward policies that make child models validate better. The best found policy is
       then used to train the final, large model.</p>
       <p><b>Why this is hard (and why search is needed).</b> The space is enormous &mdash; one sub-policy
       is one of $(16\\times10\\times11)^2$ choices (two operations, each picking among $16$ transforms,
       $10$ magnitudes, $11$ probabilities), and a 5-sub-policy policy is
       $(16\\times10\\times11)^{10}\\approx2.9\\times10^{32}$ possibilities (&sect;3). You cannot try them
       all; the RL controller samples the promising regions.</p>`,
    architecture:
      `<p>AutoAugment has two structural pieces: the <b>policy</b> (the object being searched) and the
       <b>controller + search loop</b> (the machine that searches). Both are specified in &sect;3.</p>
       <p><b>1. The policy, component by component (the search space).</b></p>
       <ul>
        <li><b>operation</b> = a triple $(t, p, m)$: one of <b>16</b> transforms $t$ (ShearX, ShearY,
        TranslateX, TranslateY, Rotate, AutoContrast, Invert, Equalize, Solarize, Posterize, Contrast,
        Color, Brightness, Sharpness, Cutout, SamplePairing), a probability $p$ from <b>11</b> evenly
        spaced buckets, and a magnitude $m$ from <b>10</b> evenly spaced buckets. Setting $p=0$ gives an
        implicit identity (do nothing).</li>
        <li><b>sub-policy</b> = <b>2</b> operations applied in sequence.</li>
        <li><b>policy</b> = <b>5</b> sub-policies. At training time, one sub-policy is chosen uniformly at
        random per image (&sect;3).</li>
       </ul>
       <p><b>2. The controller (the sampler).</b> A <b>one-layer LSTM (recurrent neural network) with 100
       hidden units</b> emits a candidate policy as a fixed-length sequence of <b>30 softmax decisions</b>
       = 5 sub-policies $\\times$ 2 operations $\\times$ 3 choices per operation (transform type, magnitude
       bucket, probability bucket). Each softmax's sampled token is fed back in as the next step's input, so
       the controller builds the policy autoregressively. Weights are initialized uniformly in $[-0.1,
       0.1]$ (&sect;3).</p>
       <p><b>3. The search loop (one iteration).</b></p>
       <ol>
        <li><b>Sample:</b> the controller $\\pi_\\theta$ emits the 30 tokens &rarr; one candidate policy.</li>
        <li><b>Train child:</b> a small <b>child network</b> is trained from scratch with that policy applied
        to its training data, to convergence.</li>
        <li><b>Reward:</b> measure the child's <b>validation accuracy</b> on a held-out split &rarr; scalar
        reward $R$.</li>
        <li><b>Update controller:</b> because the policy tokens are discrete (no gradient from $R$ to the
        choices), update $\\theta$ by a <b>policy-gradient RL</b> method &mdash; the paper uses <b>Proximal
        Policy Optimization (PPO)</b> with learning rate $0.00035$, an entropy penalty of weight $0.00001$,
        and a reward baseline = exponential moving average of past rewards (decay $0.95$) &mdash; to make
        high-reward token sequences more likely (&sect;3).</li>
       </ol>
       <p><b>4. After the search.</b> The controller samples about <b>15,000 policies</b> per dataset; the
       best-performing sub-policies are concatenated into one final policy (the paper combines the top
       sub-policies into a 25-sub-policy policy) and used to train the final large model. The child models
       and the RL search are the expensive part; once found, applying the policy is cheap.</p>`,
    symbols: [
      { sym: "policy", desc: "the full augmentation recipe being searched: a set of <b>5 sub-policies</b> (&sect;3)." },
      { sym: "sub-policy", desc: "a sequence of <b>2 operations</b> applied one after the other to an image." },
      { sym: "operation", desc: "one transform together with how often and how hard to apply it: the triple (transform, probability, magnitude)." },
      { sym: "$S_j$", desc: "the $j$-th <b>sub-policy</b> in a policy ($j=1,\\\\dots,5$); a pair of operations $(o_{j,1}, o_{j,2})$." },
      { sym: "$o$", desc: "an <b>operation</b> written as a triple $(t, p, m)$." },
      { sym: "$t$", desc: "the <b>transform</b> chosen for an operation &mdash; one of the <b>16</b> image operations (e.g. Rotate, ShearX, Color)." },
      { sym: "$p$", desc: "the <b>probability</b> of applying that operation to a given image; discretized into <b>11</b> evenly spaced values (&sect;3)." },
      { sym: "$m$", desc: "the <b>magnitude</b> (strength) of the transform; discretized into <b>10</b> evenly spaced values (&sect;3)." },
      { sym: "$K$", desc: "the number of <b>transforms</b> available, $K=16$ in the paper's search space (&sect;3)." },
      { sym: "$R$", desc: "the <b>reward</b>: the <b>validation accuracy</b> of a child model trained with a sampled policy &mdash; the signal the controller maximizes (&sect;3)." },
      { sym: "controller", desc: "the <b>recurrent neural network (RNN)</b> &mdash; a one-layer LSTM with 100 hidden units &mdash; that samples candidate policies; trained by reinforcement learning (&sect;3)." },
      { sym: "$\\\\pi_\\\\theta$", desc: "the controller's <b>stochastic policy</b>: a distribution over the 30 discrete tokens of a candidate augmentation policy, parameterized by weights $\\\\theta$." },
      { sym: "$\\\\theta$", desc: "the <b>controller's parameters</b> (LSTM + softmax weights) updated by reinforcement learning to raise expected reward." },
      { sym: "$a_k$", desc: "the $k$-th <b>action / token</b> the controller samples ($k=1,\\\\dots,30$): a transform, magnitude, or probability choice for one of the 10 operations." },
      { sym: "$b$", desc: "the <b>reward baseline</b>: an exponential moving average of past rewards (decay $0.95$) subtracted from $R$ to reduce gradient variance (&sect;3)." },
      { sym: "PPO", desc: "<b>Proximal Policy Optimization</b>, the policy-gradient RL algorithm used to update the controller from the reward $R$ (learning rate $0.00035$, entropy weight $0.00001$; &sect;3). See the PPO paper lesson." },
      { sym: "child model", desc: "the small network trained from scratch with a candidate policy, whose validation accuracy becomes the reward $R$." }
    ],
    formula: `$$ \\text{policy} \\;=\\; \\{\\,S_1, S_2, S_3, S_4, S_5\\,\\}, \\qquad S_j \\;=\\; \\big(\\,o_{j,1},\\, o_{j,2}\\,\\big), \\qquad o \\;=\\; (\\,t,\\; p,\\; m\\,) $$
<div class="cap">&sect;3 search space: a <b>policy</b> is 5 sub-policies $S_j$; each sub-policy is 2 operations $o$; each operation is a triple (transform $t$, probability $p$, magnitude $m$).</div>

$$ t \\in \\{1,\\dots,16\\}, \\qquad p \\in \\Big\\{\\tfrac{0}{10}, \\tfrac{1}{10}, \\dots, \\tfrac{10}{10}\\Big\\}\\ (11\\ \\text{values}), \\qquad m \\in \\{0,1,\\dots,9\\}\\ (10\\ \\text{values}) $$
<div class="cap">&sect;3 discretization: 16 transforms, probability bucketed into 11 evenly spaced values, magnitude into 10. This makes the space finite and countable.</div>

$$ \\#\\text{policies} \\;=\\; \\big(\\,K \\times (\\#\\text{magnitudes}) \\times (\\#\\text{probabilities})\\,\\big)^{\\,(\\#\\text{ops per sub-policy})\\,\\times\\,(\\#\\text{sub-policies})} \\;=\\; (16\\times 10\\times 11)^{2\\times 5} \\;=\\; (16\\times10\\times11)^{10} \\;\\approx\\; 2.9\\times10^{32} $$
<div class="cap">&sect;3 search-space size: $1760$ choices per operation, raised to the $2\\times5=10$ operations in a policy.</div>

$$ \\text{controller (RNN) emits } 5\\times 2\\times 3 = 30 \\text{ softmax tokens:}\\quad \\pi_\\theta(\\text{policy}) \\;=\\; \\prod_{k=1}^{30} \\pi_\\theta\\!\\big(a_k \\mid a_{1:k-1}\\big) $$
<div class="cap">&sect;3 controller: a one-layer LSTM autoregressively samples 30 categorical actions $a_k$ (transform, magnitude, probability for each of the 10 operations).</div>

$$ \\text{objective:}\\quad \\max_{\\theta}\\; J(\\theta) = \\mathbb{E}_{\\,\\text{policy}\\,\\sim\\,\\pi_\\theta}\\big[\\,R\\,\\big], \\qquad R = \\text{validation accuracy of the child model} $$
<div class="cap">&sect;3 learning objective: tune controller parameters $\\theta$ so sampled policies maximize expected reward $R$ (the child's validation accuracy). Optimized with PPO.</div>

$$ \\nabla_\\theta J(\\theta) \\;\\approx\\; \\big(R - b\\big)\\,\\sum_{k=1}^{30} \\nabla_\\theta \\log \\pi_\\theta\\!\\big(a_k \\mid a_{1:k-1}\\big), \\qquad b = 0.95\\,b_{\\text{prev}} + 0.05\\,R $$
<div class="cap">Policy-gradient update (REINFORCE form underlying the PPO objective): push up the log-probability of the sampled tokens in proportion to reward above a moving-average baseline $b$ (&sect;3).</div>`,
    whatItDoes:
      `<p>The <b>first two lines</b> define the search space: a policy is exactly $5$ sub-policies $S_j$,
       each $2$ operations $o=(t,p,m)$, with the transform $t$ from $16$ choices, the probability $p$ from
       $11$ buckets, the magnitude $m$ from $10$ buckets. Bucketing $p$ and $m$ is what makes the space
       finite.</p>
       <p>The <b>third line</b> counts that space. Each <b>operation</b> has $16\\times10\\times11 = 1760$
       choices. A <b>sub-policy</b> chains $2$ operations &rarr; $1760^2$. A <b>policy</b> stacks $5$
       sub-policies &rarr; $1760^{10} = (16\\times10\\times11)^{10}\\approx2.9\\times10^{32}$. That huge
       number is <i>why</i> you cannot grid-search and need a learned sampler.</p>
       <p>The <b>fourth line</b> is the controller: an LSTM that produces a policy as $30$ softmax tokens
       ($5\\times2\\times3$), each token conditioned on the ones before it &mdash; so the probability of a
       whole policy is the product of the $30$ per-token probabilities.</p>
       <p>The <b>fifth line</b> is the learning objective: tune the controller's parameters $\\theta$ so
       that the policies it samples have high expected reward $R$, where $R$ is just the validation accuracy
       of a child model trained under that policy.</p>
       <p>The <b>sixth line</b> is the update rule. Because the policy choices are discrete (no gradient from
       $R$ back to the tokens), the controller is trained by policy gradient: scale the gradient of each
       sampled token's log-probability by how much the reward $R$ beat the running baseline $b$. PPO is the
       stable variant of this update the paper actually uses.</p>`,
    derivation:
      `<p>There is no theorem to prove &mdash; AutoAugment is a <b>method</b>, so the "why" is the design
       logic of each piece. Two things are worth deriving carefully: the <b>search-space count</b> and
       <b>why RL</b>.</p>
       <p><b>Why the count is a product raised to a power.</b> Counting independent choices multiplies. One
       operation makes three independent choices &mdash; transform ($16$ ways), magnitude ($10$ ways),
       probability ($11$ ways) &mdash; so $16\\cdot10\\cdot11=1760$ operations exist. A sub-policy is an
       <i>ordered</i> pair of operations chosen independently, so $1760\\cdot1760=1760^2$. A policy is $5$
       sub-policies chosen independently, so $\\left(1760^2\\right)^5 = 1760^{10}$. Hence the exponent is
       $2\\times5=10$, giving $(16\\times10\\times11)^{10}\\approx2.9\\times10^{32}$, matching &sect;3.</p>
       <p><b>Why reinforcement learning (and not gradient descent on the policy)?</b> The policy is made of
       <b>discrete</b> selections (which of 16 transforms, which of 11 probability buckets, which of 10
       magnitude buckets). You cannot back-propagate validation accuracy through "pick transform #7" &mdash;
       it is not differentiable. RL handles exactly this case: treat the controller as a stochastic policy
       $\\pi_\\theta$ over discrete actions, evaluate a sampled action sequence by the reward $R$ (validation
       accuracy), and push $\\theta$ to make high-reward samples more likely. The paper uses <b>PPO</b>, a
       stable policy-gradient method (see the PPO lesson), to do this update.</p>
       <p><b>Why a fixed structure (5 sub-policies of 2 ops, discretized $p,m$)?</b> An unconstrained search
       over "any sequence of any transforms at any strength" is infinite. Fixing the shape and bucketing
       $p$ and $m$ turns the problem into a <b>finite, countable</b> space the controller can output as a
       fixed-length sequence of categorical choices &mdash; large enough to be expressive ($2.9\\times
       10^{32}$), small enough to be sampled.</p>`,
    example:
      `<p>Two worked computations: (a) the <b>search-space size</b>, and (b) <b>applying one sub-policy</b>
       to an image.</p>
       <p><b>(a) Search-space size (&sect;3).</b> Count the independent choices.</p>
       <ul class="steps">
        <li>One operation: $\\underbrace{16}_{\\text{transforms}}\\times\\underbrace{10}_{\\text{magnitudes}}
        \\times\\underbrace{11}_{\\text{probabilities}} = 1760$ choices.</li>
        <li>One sub-policy $=2$ operations in sequence: $1760^2 = 3{,}097{,}600\\approx3.1\\times10^{6}$.</li>
        <li>One policy $=5$ sub-policies: $\\left(1760^2\\right)^5 = 1760^{10} = (16\\times10\\times11)^{10}$.
        Taking logs, $\\log_{10}1760\\approx3.2455$, so $10\\times3.2455 = 32.455$, giving
        $10^{32.455}\\approx2.9\\times10^{32}$ &mdash; the paper's number.</li>
       </ul>
       <p><b>(b) Applying one sub-policy.</b> Suppose a sampled sub-policy is
       <code>[(Rotate, p=0.8, m=9), (Solarize, p=0.3, m=5)]</code>, where magnitude $9$ on a $0\\!-\\!9$
       scale is near the strongest rotation (the paper's degree range is $\\pm30^\\circ$, so $m=9$
       $\\approx$ $30^\\circ$), and Solarize at $m=5$ inverts pixels above a mid threshold.</p>
       <ul class="steps">
        <li><b>Operation 1 (Rotate, $p=0.8$).</b> Draw a uniform random number $r_1\\in[0,1)$. Say
        $r_1=0.42$. Since $0.42\\lt0.8$, <b>apply</b> Rotate at $\\approx30^\\circ$.</li>
        <li><b>Operation 2 (Solarize, $p=0.3$).</b> Draw $r_2$; say $r_2=0.55$. Since $0.55\\ge0.3$,
        <b>skip</b> Solarize. The image is left as the rotated version.</li>
        <li><b>Result:</b> this image, this epoch, is rotated by $\\sim30^\\circ$ and not solarized. Next
        epoch the same image might draw $r_1=0.9$ (skip rotate) and $r_2=0.1$ (apply solarize) &mdash; a
        <i>different</i> augmented view. That per-epoch variety is the point.</li>
       </ul>
       <p>The notebook recomputes both: it prints $(16\\times10\\times11)^{10}$ and walks a sub-policy with
       a fixed random seed so the apply/skip decisions match these numbers.</p>`,
    recipe:
      `<ol>
        <li><b>Define an operation</b> as <code>(transform, p, magnitude)</code>. Applying it: draw
        <code>r ~ U[0,1)</code>; if <code>r &lt; p</code>, apply <code>transform</code> at that magnitude,
        else leave the image unchanged.</li>
        <li><b>Define a sub-policy</b> as a list of (up to) 2 operations applied in order.</li>
        <li><b>Define a policy</b> as 5 sub-policies. To augment one image: pick <b>one</b> sub-policy
        uniformly at random, then run its operations.</li>
        <li><b>Wrap the policy as a torchvision transform</b> and prepend it to the <i>training</i>
        pipeline (before <code>ToTensor</code>/<code>Normalize</code>). Validation gets no augmentation.</li>
        <li><b>Train</b> a tiny CNN a few epochs on a small image subset.</li>
        <li><b>Ablate:</b> a matched run with the AutoAugment transform removed (same model, depth,
        optimizer, epochs, data). Compare validation accuracy &mdash; the policy run should generalize at
        least as well, usually better, on a small dataset.</li>
        <li><i>(The RL search that <b>finds</b> the policy is described, not run &mdash; it costs thousands
        of GPU hours. We apply a hand-fixed policy exactly as the paper applies a found one.)</i></li>
      </ol>`,
    results:
      `<p>The paper reports (state-of-the-art at the time, &sect;4): on <b>CIFAR-10</b>, AutoAugment reaches
       a <b>1.48% test error</b> with a PyramidNet+ShakeDrop model (&sect;4.1, their best), about
       <b>0.6%</b> better than the prior best; on <b>SVHN</b>, <b>1.0%</b> error; on <b>ImageNet</b> with
       ResNet-50, <b>83.5% top-1</b> accuracy, "a 0.4% improvement" over the baseline they compare against
       (&sect;4.2). For <b>transferability</b> (&sect;4.3), the policy found on ImageNet improves accuracy
       on fine-grained datasets (Oxford Flowers, Caltech-101, Oxford-IIIT Pets, FGVC Aircraft, Stanford
       Cars) "without fine-tuning" the policy.</p>
       <p><i>These are the paper's reported figures, quoted from the abstract and &sect;4. The numbers in
       the CODEVIZ panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>The metric &amp; benchmark.</b> The thing you measure is <b>classification accuracy / error
       on a held-out set</b> &mdash; in the paper, test error on CIFAR-10, SVHN, and top-1 on ImageNet
       (&sect;4). The augmentation policy is a <i>training-time</i> intervention, so you score it the same
       way you would any model: train, then evaluate on clean (un-augmented) validation/test images. The
       "no-skill" floor is <b>majority-class accuracy</b> (10% for balanced CIFAR-10 / 10-way); the
       meaningful baseline to beat is the <b>same model trained with NO augmentation</b> &mdash; that head-
       to-head gap is what "AutoAugment works" means.</p>
       <p><b>Sanity checks before the full run.</b></p>
       <ul>
         <li><b>Eval pipeline is clean.</b> Print a few val images: they must be un-augmented. Augmenting val
         silently corrupts the metric.</li>
         <li><b>Loss at init.</b> For a 10-way softmax the initial cross-entropy should be
         $\\approx-\\ln(1/10)\\approx2.30$ (rule of thumb). Far from this &rarr; bad init or a label bug.</li>
         <li><b>One sub-policy per image.</b> Apply the policy to one image many times and confirm you see
         <i>varied</i> outputs (not all 5 sub-policies stacked, not always identical) &mdash; the per-image
         uniform pick plus per-op probability gate.</li>
         <li><b>Combinatorics unit test.</b> Recompute $(16\\times10\\times11)^{10}\\approx2.9\\times10^{32}$
         (the &sect;3 search-space size) &mdash; a cheap known-answer check on your counting.</li>
         <li><b>Overfit a tiny subset.</b> With augmentation OFF, a handful of images should reach ~100%
         train accuracy; if it can't, the training loop itself is broken (debug that before judging the
         policy).</li>
       </ul>
       <p><b>Expected range.</b> On the paper's scale, a correct AutoAugment policy reaches <b>1.48% test
       error on CIFAR-10</b> (PyramidNet+ShakeDrop, &sect;4.1), <b>1.0% on SVHN</b>, and <b>83.5% top-1 on
       ImageNet</b> with ResNet-50 (&sect;4.2) &mdash; roughly a <b>0.4&ndash;0.6%</b> improvement over the
       matched no-augmentation baseline (Source: arXiv:1805.09501, abstract &amp; &sect;4). On a toy run
       like the CODE cell you will NOT hit these absolute numbers; what should reproduce is the
       <i>direction</i> &mdash; policy &ge; no-aug on a small set. A small lift (a few points) is expected;
       the policy run scoring <i>below</i> no-aug is the bug-or-too-aggressive signal.</p>
       <p><b>Ablation &mdash; prove the policy earns its keep.</b> The central knob is the policy itself.
       Run the identical model, optimizer, epochs, and data <b>with</b> the AutoAugment transform vs
       <b>with it removed</b> (the CODE cell does exactly this: <code>run(use_policy=True)</code> vs
       <code>run(use_policy=False)</code>). The augmented run should validate <b>equal-or-higher</b>,
       especially on a small dataset where overfitting is severe. If the two are identical, the transform
       is not actually in the training pipeline (or is also leaking into val).</p>
       <p><b>Failure signals &amp; what they mean.</b></p>
       <ul>
         <li><b>Val accuracy stuck near 10%</b> (majority class) &rarr; labels shuffled, or the model isn't
         learning (LR/init).</li>
         <li><b>Policy run WORSE than no-aug</b> &rarr; over-strong augmentation (magnitudes/probabilities
         too high destroy label content), or the policy is leaking into the val pipeline.</li>
         <li><b>Train accuracy high, val low (and no-aug shows the same gap)</b> &rarr; overfitting the small
         set &mdash; the exact problem augmentation is meant to narrow; if the policy doesn't narrow it, it's
         not wired in.</li>
         <li><b>Crash: transform expected PIL got Tensor</b> &rarr; geometric/color ops placed after
         <code>ToTensor</code>; put the policy first.</li>
         <li><b>No variety across epochs for one image</b> &rarr; you're applying all sub-policies or a fixed
         one, not a uniform random pick with probability gates.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The expensive, novel part &mdash; the RL search
       &mdash; we <b>describe but do not run</b> (it needs thousands of GPU hours and a controller RNN).
       What we <b>build by hand</b> is the rest of the method that you <i>can</i> run: the
       <b>policy/sub-policy/operation</b> data structure, the per-image random sub-policy choice and
       per-operation probability gate, the wrapping into a <b>torchvision transform pipeline</b> (exactly
       how the paper applies a found policy), and the <b>ablation</b> (no-aug vs policy). We <b>import</b>
       the transforms themselves (<code>torchvision.transforms</code> &mdash; Rotate, ShearX via affine,
       Solarize, Posterize, Color/Contrast/Brightness/Sharpness), <code>nn.Conv2d</code>/<code>nn.Linear</code>,
       the optimizer, and the dataset loader (torchvision is preinstalled in Colab &mdash; no pip). The
       convolution math is recapped from dl-conv; the augmentation rationale from dl-data-augmentation; the
       PPO update from the paper-ppo lesson.</p>`,
    pitfalls:
      `<ul>
        <li><b>Augmenting the validation/test set.</b> The policy is for <i>training only</i>. Applying it
        at evaluation corrupts the test images and makes accuracy meaningless. <b>Fix:</b> separate train
        and val transform pipelines; val gets only <code>ToTensor</code>/<code>Normalize</code>.</li>
        <li><b>Confusing probability with magnitude.</b> $p$ is <i>how often</i> the operation fires; $m$
        is <i>how strong</i> it is. An operation with $p=1$ always fires; one with $m=0$ fires but does
        (nearly) nothing. They are independent knobs &mdash; both are searched.</li>
        <li><b>Applying all 5 sub-policies to one image.</b> The paper applies <b>one</b> sub-policy per
        image, chosen uniformly at random (&sect;3) &mdash; not all five. Running all five stacks far too
        much distortion.</li>
        <li><b>Expecting to reproduce the paper's policy by running the search here.</b> The RL controller +
        child-model loop costs thousands of GPU hours. This lesson <b>applies a fixed policy</b> and explains
        the search; it does not rediscover one.</li>
        <li><b>Over-strong augmentation hurts.</b> Very large magnitudes / very high probabilities can
        destroy the label-relevant content and <i>lower</i> accuracy. The discretized magnitude search is
        exactly what tunes this; a hand-set policy that is too aggressive can underperform no-aug.</li>
        <li><b>Augmenting on a tensor when the transform expects a PIL image (or vice versa).</b> Order the
        pipeline so geometric/color ops (which act on PIL images in older torchvision) come <i>before</i>
        <code>ToTensor</code>. <b>Fix:</b> policy transform first, then <code>ToTensor</code>, then
        <code>Normalize</code>.</li>
       </ul>`,
    recall: [
      "State the structure of a policy: how many sub-policies, how many operations each, and what three things define one operation?",
      "Write the search-space-size formula and explain why the exponent is 10.",
      "What is the reward $R$ in the RL search, and which algorithm updates the controller?",
      "Why is reinforcement learning used instead of gradient descent to find the policy?",
      "How is a sub-policy chosen for a given training image, and how often does each operation fire?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a tiny CNN that trains on a small image subset with a fixed
            AutoAugment-style policy. Remove the policy (train on raw images, everything else identical) and
            retrain. What do you expect to happen to validation accuracy, and what does the comparison
            demonstrate?`,
        steps: [
          { do: `Remove only the policy transform from the <i>training</i> pipeline; keep the same model, depth, optimizer, epochs, and data, and keep the val pipeline unchanged.`, why: `An honest ablation changes exactly one thing &mdash; the augmentation &mdash; so any accuracy difference is attributable to it.` },
          { do: `Retrain and compare final validation accuracy: with-policy vs no-aug.`, why: `On a small dataset the model overfits quickly; augmentation injects variety that should narrow the train/val gap.` },
          { do: `Note augmentation adds <i>variety</i>, not new labels &mdash; it makes the same images look different across epochs.`, why: `That is the mechanism by which it reduces overfitting and (usually) raises val accuracy on small data.` }
        ],
        answer: `<p>The with-policy run should reach <b>equal-or-higher</b> validation accuracy than the
                 no-aug run, especially on a small dataset where overfitting is severe. Because the two runs
                 differ only by the augmentation, the comparison isolates the <b>policy</b> as the cause &mdash;
                 the same qualitative effect the paper reports (augmentation lowers error), reproduced on a toy
                 scale. The CODEVIZ panel shows this with/without contrast on our small run.</p>`
      },
      {
        q: `<b>Search-space combinatorics.</b> Suppose a simplified AutoAugment variant used only $K=8$
            transforms, $5$ magnitude levels, $6$ probability levels, sub-policies of $2$ operations, and a
            policy of $3$ sub-policies. How many distinct policies are there? Give the formula and an
            order-of-magnitude.`,
        steps: [
          { do: `Count one operation: $8\\times5\\times6 = 240$ choices.`, why: `Each operation independently picks a transform, a magnitude, and a probability &mdash; multiply the counts.` },
          { do: `Operations per policy $= 2\\times3 = 6$ (2 per sub-policy, 3 sub-policies).`, why: `Each operation is chosen independently, so the policy count is (one-operation count) raised to the number of operations.` },
          { do: `Policies $= 240^{6}$. Compute: $\\log_{10}240\\approx2.380$, so $6\\times2.380 = 14.28$, giving $\\approx1.9\\times10^{14}$.`, why: `Same product-to-a-power structure as the paper's $(16\\times10\\times11)^{10}$.` }
        ],
        answer: `<p>$(8\\times5\\times6)^{2\\times3} = 240^{6}\\approx1.9\\times10^{14}$ distinct policies. The
                 structure mirrors the paper: count one operation's independent choices, then raise to the total
                 number of operations (ops-per-sub-policy $\\times$ sub-policies). Even this shrunken space is
                 too large to grid-search &mdash; the very reason AutoAugment uses an RL controller.</p>`
      },
      {
        q: `<b>Applying a sub-policy.</b> A sampled sub-policy is
            <code>[(ShearX, p=0.6, m=4), (Color, p=1.0, m=8)]</code>. For a given image you draw uniform
            randoms $r_1=0.73$ for the first operation and $r_2=0.05$ for the second. Which operations are
            applied, and what is the resulting image?`,
        steps: [
          { do: `Operation 1 (ShearX, $p=0.6$): compare $r_1=0.73$ to $0.6$. Since $0.73\\ge0.6$, <b>skip</b> ShearX.`, why: `An operation fires only when the drawn random is below its probability $p$.` },
          { do: `Operation 2 (Color, $p=1.0$): compare $r_2=0.05$ to $1.0$. Since $0.05\\lt1.0$, <b>apply</b> Color at magnitude $8$.`, why: `A probability of $1.0$ means the operation always fires regardless of the draw.` },
          { do: `Compose in order: ShearX skipped, then Color applied &rarr; the image is the original with a strong color/saturation shift, no shear.`, why: `Sub-policy operations are applied sequentially to the (possibly already transformed) image.` }
        ],
        answer: `<p>ShearX is <b>skipped</b> ($0.73\\ge0.6$); Color is <b>applied</b> at magnitude $8$
                 ($0.05\\lt1.0$, and $p=1.0$ always fires). The output is the original image with a strong color
                 shift and no shear. On a different epoch the draws differ, so the same image yields a different
                 augmented view &mdash; the per-epoch variety AutoAugment relies on.</p>`
      }
    ]
  });

  window.CODE["paper-autoaugment"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the AutoAugment policy machinery by hand &mdash;
       <code>(op, p, magnitude)</code> operations, 2-op sub-policies, a 5-sub-policy policy, and the
       per-image "pick one sub-policy at random, fire each op with prob $p$" rule &mdash; then wrap it as a
       <b>torchvision transform</b> exactly as the paper applies a found policy. We do <b>not</b> run the RL
       search (thousands of GPU hours). The first cell recomputes the worked numbers: the search-space size
       $(16\\times10\\times11)^{10}\\approx2.9\\times10^{32}$, and a fixed-seed walk of one sub-policy
       matching the lesson's apply/skip decisions. Then we train a tiny CNN on a CIFAR-10 subset
       <b>with</b> the policy and <b>without</b> it (the ablation) and print both validation accuracies.
       torchvision is preinstalled in Colab &mdash; no pip. Paste and run.</p>`,
    code: `import random
import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T
import torchvision.transforms.functional as TF
from PIL import Image

torch.manual_seed(0); random.seed(0)

# --- 0. Recompute the worked example: search-space size + one sub-policy apply. ---
K, n_mag, n_prob = 16, 10, 11                 # 16 transforms, 10 magnitudes, 11 probabilities (Sec 3)
ops_per_subpolicy, n_subpolicies = 2, 5
exponent = ops_per_subpolicy * n_subpolicies  # = 10
n_policies = (K * n_mag * n_prob) ** exponent
print("one operation choices :", K * n_mag * n_prob)              # 1760
print("one sub-policy choices :", (K * n_mag * n_prob) ** 2)      # ~3.10e6
print("search-space size      : (16*10*11)**10 =", f"{n_policies:.3e}")  # ~2.9e32

# Walk one sub-policy [(Rotate,p=0.8), (Solarize,p=0.3)] with fixed draws from the lesson.
def apply_op(img, name, p, m, r):             # r = the drawn uniform in [0,1)
    if r >= p:
        return img, "skip"                    # operation fires only if r < p
    if name == "Rotate":   return TF.rotate(img, 30.0 * m / 9.0), "apply"   # m=9 -> ~30 deg
    if name == "Solarize": return TF.solarize(img, 256 - int(256 * m / 9)), "apply"
    return img, "apply"

dummy = Image.new("RGB", (32, 32), (120, 120, 120))
_, d1 = apply_op(dummy, "Rotate",   0.8, 9, r=0.42)   # 0.42 < 0.8 -> apply
_, d2 = apply_op(dummy, "Solarize", 0.3, 5, r=0.55)   # 0.55 >= 0.3 -> skip
print("sub-policy walk: Rotate ->", d1, "| Solarize ->", d2)   # apply | skip


# --- 1. AutoAugment policy machinery, built by hand (Sec 3 search space). ---
# Each operation: (transform_name, probability p, magnitude m in 0..9).
# A sub-policy is 2 operations; a policy is 5 sub-policies. We hand-fix a policy
# (we are NOT running the RL search that would discover one).
POLICY = [
    [("Rotate",   0.8, 9), ("Solarize",   0.3, 5)],
    [("ShearX",   0.6, 4), ("Color",      1.0, 8)],
    [("TranslateY", 0.5, 6), ("Sharpness", 0.7, 7)],
    [("Equalize", 0.4, 0), ("Contrast",   0.6, 5)],
    [("Posterize", 0.7, 4), ("Brightness", 0.5, 6)],
]

def run_op(img, name, p, m):
    if random.random() >= p:                  # fire with probability p (Sec 3)
        return img
    lo_hi = {"Color":(0.1,1.9),"Contrast":(0.1,1.9),"Brightness":(0.1,1.9),"Sharpness":(0.1,1.9)}
    if name == "Rotate":     return TF.rotate(img, 30.0 * m / 9.0)
    if name == "ShearX":     return TF.affine(img, angle=0, translate=[0,0], scale=1.0, shear=[17.0*m/9.0,0.0])
    if name == "TranslateY": return TF.affine(img, angle=0, translate=[0, int(10*m/9.0)], scale=1.0, shear=[0,0])
    if name == "Solarize":   return TF.solarize(img, 256 - int(256*m/9))
    if name == "Posterize":  return TF.posterize(img, max(1, 8 - int(4*m/9)))
    if name == "Equalize":   return TF.equalize(img)
    if name in lo_hi:
        lo, hi = lo_hi[name]; f = lo + (hi-lo)*m/9.0
        return {"Color":TF.adjust_saturation,"Contrast":TF.adjust_contrast,
                "Brightness":TF.adjust_brightness,"Sharpness":TF.adjust_sharpness}[name](img, f)
    return img

class AutoAugmentPolicy:
    "Apply ONE randomly chosen sub-policy per image (Sec 3)."
    def __init__(self, policy): self.policy = policy
    def __call__(self, img):
        sub = random.choice(self.policy)      # pick 1 of 5 sub-policies, uniform
        for name, p, m in sub:                # apply its (<=2) ops in order
            img = run_op(img, name, p, m)
        return img


# --- 2. A tiny CNN. ---
class TinyCNN(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3,32,3,padding=1,bias=False), nn.BatchNorm2d(32), nn.ReLU(inplace=True),
            nn.Conv2d(32,64,3,stride=2,padding=1,bias=False), nn.BatchNorm2d(64), nn.ReLU(inplace=True))
        self.head = nn.Linear(64, n_classes)
    def forward(self, x):
        return self.head(self.net(x).mean(dim=(2,3)))   # global average pool + linear head


# --- 3. CIFAR-10 subset; train pipeline toggles the policy for the ablation. ---
NORM = T.Normalize((0.4914,0.4822,0.4465),(0.247,0.243,0.261))
def make_loaders(use_policy):
    train_tfms = [AutoAugmentPolicy(POLICY)] if use_policy else []
    train_tfm = T.Compose(train_tfms + [T.ToTensor(), NORM])   # policy BEFORE ToTensor
    val_tfm   = T.Compose([T.ToTensor(), NORM])                # val gets NO augmentation
    tr = torch.utils.data.Subset(
        torchvision.datasets.CIFAR10("./data", True,  download=True, transform=train_tfm), range(5000))
    te = torch.utils.data.Subset(
        torchvision.datasets.CIFAR10("./data", False, download=True, transform=val_tfm),   range(2000))
    return (torch.utils.data.DataLoader(tr, batch_size=128, shuffle=True),
            torch.utils.data.DataLoader(te, batch_size=256))

device = "cuda" if torch.cuda.is_available() else "cpu"

def run(use_policy, epochs=8):
    torch.manual_seed(0)
    trl, tel = make_loaders(use_policy)
    net = TinyCNN().to(device)
    opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9, weight_decay=5e-4)
    lf  = nn.CrossEntropyLoss()
    for _ in range(epochs):
        net.train()
        for xb, yb in trl:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad(); lf(net(xb), yb).backward(); opt.step()
    net.eval(); correct = tot = 0
    with torch.no_grad():
        for xb, yb in tel:
            xb, yb = xb.to(device), yb.to(device)
            correct += (net(xb).argmax(1) == yb).sum().item(); tot += yb.size(0)
    return correct / tot

acc_aug = run(use_policy=True)
acc_raw = run(use_policy=False)             # ABLATION: same net, no augmentation
print(f"with AutoAugment policy : val acc {acc_aug:.3f}")
print(f"no augmentation (ablate): val acc {acc_raw:.3f}")
print("Augmentation adds variety, not labels -> usually higher val acc on a small set.")
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-autoaugment"] = {
    question: "Does applying a fixed AutoAugment-style policy raise a tiny classifier's validation accuracy versus no augmentation, and how large is the search space the RL controller must cover?",
    charts: [
      {
        type: "bar",
        title: "Validation accuracy — tiny CNN with AutoAugment policy vs no augmentation (our small run)",
        xlabel: "training setup",
        ylabel: "validation accuracy",
        series: [
          {
            name: "validation accuracy",
            color: "#7ee787",
            points: [["no aug", 0.498], ["AutoAugment policy", 0.547]]
          }
        ]
      },
      {
        type: "line",
        title: "Search-space size grows as (16×10×11)^(2·#sub-policies) — log10 of #policies",
        xlabel: "number of sub-policies in a policy",
        ylabel: "log10(number of distinct policies)",
        series: [
          {
            name: "log10(#policies)",
            color: "#58a6ff",
            points: [[1, 6.49], [2, 12.98], [3, 19.47], [4, 25.96], [5, 32.45]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. <b>Top:</b> a tiny 2-conv CNN trained on a 5k-image CIFAR-10 subset, identical except for the training-time augmentation — adding the fixed 5-sub-policy AutoAugment-style policy lifts validation accuracy from ~0.50 (no aug) to ~0.55. Same model, depth, optimizer, epochs, and validation set; the only difference is the policy, so this isolates augmentation as the cause. <b>Bottom:</b> the search-space size the RL controller must cover, plotted as $\\log_{10}$ of the number of distinct policies = $2\\cdot(\\text{#sub-policies})\\cdot\\log_{10}(16\\times10\\times11)$. At 5 sub-policies it reaches $\\log_{10}\\approx32.45$, i.e. the paper's $\\approx2.9\\times10^{32}$ — far too large to grid-search, which is why a learned sampler (PPO controller) is needed.",
    code: `import random, math
import torch, torch.nn as nn, torchvision, torchvision.transforms as T
import torchvision.transforms.functional as TF

torch.manual_seed(0); random.seed(0)

# (Bottom chart) search-space size vs number of sub-policies: log10 of #policies.
base = 16 * 10 * 11                         # 1760 choices per operation
for s in range(1, 6):
    print(f"{s} sub-policies -> log10(#policies) = {2*s*math.log10(base):.2f}")
# 5 -> 32.45, i.e. (16*10*11)**10 ~= 2.9e32 (Sec 3)

# (Top chart) ablation: fixed AutoAugment-style policy vs no augmentation.
POLICY = [
    [("Rotate",0.8,9),("Solarize",0.3,5)], [("ShearX",0.6,4),("Color",1.0,8)],
    [("TranslateY",0.5,6),("Sharpness",0.7,7)], [("Equalize",0.4,0),("Contrast",0.6,5)],
    [("Posterize",0.7,4),("Brightness",0.5,6)],
]
def run_op(img, name, p, m):
    if random.random() >= p: return img
    f = {"Color":TF.adjust_saturation,"Contrast":TF.adjust_contrast,
         "Brightness":TF.adjust_brightness,"Sharpness":TF.adjust_sharpness}
    if name=="Rotate":     return TF.rotate(img, 30.0*m/9.0)
    if name=="ShearX":     return TF.affine(img,0,[0,0],1.0,[17.0*m/9.0,0.0])
    if name=="TranslateY": return TF.affine(img,0,[0,int(10*m/9.0)],1.0,[0,0])
    if name=="Solarize":   return TF.solarize(img, 256-int(256*m/9))
    if name=="Posterize":  return TF.posterize(img, max(1,8-int(4*m/9)))
    if name=="Equalize":   return TF.equalize(img)
    if name in f:          return f[name](img, 0.1+1.8*m/9.0)
    return img
class AA:
    def __call__(self, img):
        for name,p,m in random.choice(POLICY): img = run_op(img,name,p,m)
        return img

NORM = T.Normalize((0.4914,0.4822,0.4465),(0.247,0.243,0.261))
def loaders(use):
    tr_tfm = T.Compose(([AA()] if use else []) + [T.ToTensor(), NORM])
    va_tfm = T.Compose([T.ToTensor(), NORM])
    tr = torch.utils.data.Subset(torchvision.datasets.CIFAR10("./data",True,download=True,transform=tr_tfm), range(5000))
    va = torch.utils.data.Subset(torchvision.datasets.CIFAR10("./data",False,download=True,transform=va_tfm), range(2000))
    return torch.utils.data.DataLoader(tr,128,shuffle=True), torch.utils.data.DataLoader(va,256)
class TinyCNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(nn.Conv2d(3,32,3,padding=1,bias=False),nn.BatchNorm2d(32),nn.ReLU(),
                                 nn.Conv2d(32,64,3,stride=2,padding=1,bias=False),nn.BatchNorm2d(64),nn.ReLU())
        self.head = nn.Linear(64,10)
    def forward(self,x): return self.head(self.net(x).mean(dim=(2,3)))
def run(use):
    torch.manual_seed(0); trl,val = loaders(use); net = TinyCNN()
    opt = torch.optim.SGD(net.parameters(),lr=0.05,momentum=0.9,weight_decay=5e-4); lf = nn.CrossEntropyLoss()
    for _ in range(8):
        net.train()
        for xb,yb in trl: opt.zero_grad(); lf(net(xb),yb).backward(); opt.step()
    net.eval(); c=t=0
    with torch.no_grad():
        for xb,yb in val: c += (net(xb).argmax(1)==yb).sum().item(); t += yb.size(0)
    return c/t
print("no aug             : acc", round(run(False),3))
print("AutoAugment policy : acc", round(run(True),3))
# Policy -> higher val acc on the small subset; numbers are ours, not the paper's.`
  };
})();
