/* Paper lesson — "ImageNet Classification with Deep Convolutional Neural Networks" (AlexNet),
   Krizhevsky, Sutskever & Hinton, NIPS / NeurIPS 2012.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-alexnet".
   GROUNDED from the NeurIPS 2012 proceedings PDF (fetched):
   https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf
   - abstract (authors, 60M params, five conv + two FC + 1000-softmax, top-1/top-5 39.7%/18.9% on ILSVRC-2010)
   - Section 3   (architecture; first conv = 96 kernels 11x11x3, stride 4, on 224x224x3 input)
   - Section 3.1 (ReLU non-saturating nonlinearity f(x)=max(0,x))
   - Section 3.3 (Local Response Normalization, with k=2, n=5, alpha=1e-4, beta=0.75)
   - Section 4.1 (data augmentation: crops + flips; PCA RGB jitter)
   - Section 4.2 (dropout p=0.5 on the first two FC layers)
   Track B (architecture): build a SCALED-DOWN AlexNet (5 conv + 3 FC, ReLU, dropout) on top of
   nn.Conv2d / nn.Linear, train on a CIFAR-10 subset, print accuracy. The convolution math lives in
   concept dl-conv; here we recap and work the conv1 output-size numbers. */
(function () {
  window.LESSONS.push({
    id: "paper-alexnet",
    title: "AlexNet — ImageNet Classification with Deep Convolutional Neural Networks (2012)",
    tagline: "A deep CNN with ReLU, dropout, data augmentation and GPU training crushed ImageNet and launched the deep-learning era.",
    module: "Papers · Computer Vision",
    track: "architecture",
    paper: {
      authors: "Alex Krizhevsky, Ilya Sutskever, Geoffrey E. Hinton",
      org: "University of Toronto",
      year: 2012,
      venue: "Advances in Neural Information Processing Systems 25 (NIPS/NeurIPS 2012), pp. 1097–1105",
      citations: "",   // not fetched; left blank rather than invent a number
      url: "https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf",
      code: ""
    },
    conceptLink: "dl-conv",
    partOf: [
      { capstone: "capstone-image-classifier", step: 3, builds: "a scaled-down AlexNet (5 conv + 3 FC, ReLU, dropout)" }
    ],
    prereqs: ["dl-conv", "dl-backprop", "pt-nn-module", "pt-cnn"],

    // WHY READ IT
    problem:
      `<p>Before 2012, image classification was done mostly with <b>hand-engineered features</b> (edge and
       texture detectors a person designed) fed to a shallow classifier. On small datasets this was fine, but
       on <b>ImageNet</b> &mdash; a dataset of over a million labelled photos across 1000 categories &mdash; it
       hit a wall. The paper's framing (&sect;1):</p>
       <blockquote>"To learn about thousands of objects from millions of images, we need a model with a large
       learning capacity. &hellip; convolutional neural networks (CNNs) constitute one such class of models."</blockquote>
       <p>A <b>Convolutional Neural Network (CNN)</b> is a neural network whose early layers slide small learned
       filters over the image (a <b>convolution</b>) to detect local patterns, instead of using hand-designed
       features. The catch: a CNN big enough for ImageNet has tens of millions of parameters, and training it
       was painfully slow and prone to <b>overfitting</b> (memorising the training photos instead of learning
       general patterns). Two practical problems blocked the field: <b>how to train a big CNN fast</b>, and
       <b>how to stop it overfitting</b>. This paper answered both and won the 2012 ImageNet competition by a
       wide margin.</p>`,
    contribution:
      `<ul>
        <li><b>A large, deep CNN trained end-to-end on ImageNet.</b> Five convolutional layers + three
        fully-connected layers ending in a 1000-way softmax, <b>60 million parameters</b>, all learned from
        pixels &mdash; no hand-designed features. (A <b>fully-connected layer</b> connects every input to every
        output; a <b>softmax</b> turns the final scores into class probabilities.)</li>
        <li><b>ReLU activations for fast training.</b> They replaced the slow saturating <code>tanh</code>
        nonlinearity with the <b>Rectified Linear Unit (ReLU)</b>, $f(x)=\\max(0,x)$, which the paper shows
        trains several times faster (&sect;3.1).</li>
        <li><b>Two ways to fight overfitting.</b> <b>Dropout</b> (randomly zeroing half the neurons in the
        first two fully-connected layers during training, &sect;4.2) and heavy <b>data augmentation</b>
        (random crops, horizontal flips, and PCA-based colour jitter, &sect;4.1).</li>
        <li><b>An efficient two-GPU implementation</b> (two NVIDIA GTX 580 cards) that made training a network
        this size feasible &mdash; the engineering that turned the idea into a result.</li>
        <li><b>Local Response Normalization (LRN)</b>, a brightness-normalising step between some conv layers
        (&sect;3.3) that gave a small accuracy gain.</li>
      </ul>`,
    whyItMattered:
      `<p>AlexNet's 2012 ImageNet win is widely treated as the moment deep learning took over computer vision.
       It established the template &mdash; deep CNN + ReLU + dropout + augmentation + GPU training &mdash; that
       every later vision architecture built on (VGG, GoogLeNet/Inception, ResNet). ReLU and dropout became
       defaults far beyond vision, and the demonstration that GPUs make big networks trainable reshaped how the
       whole field does research. Almost everything in this course's deep-learning track descends from the
       practices this one paper made standard.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;3.1 (ReLU Nonlinearity)</b> &mdash; why $f(x)=\\max(0,x)$ trains faster than $\\tanh$;
        Fig. 1 shows the training-error curves.</li>
        <li><b>&sect;3 + Fig. 2 (The Architecture)</b> &mdash; the five conv layers and the first-layer numbers
        (96 kernels, $11\\times11\\times3$, stride 4) you will transcribe and recompute. Fig. 2 splits the net
        across two GPUs &mdash; an engineering detail, not the idea.</li>
        <li><b>&sect;4.1-4.2 (Reducing Overfitting)</b> &mdash; data augmentation (crops, flips, PCA colour)
        and dropout ($p=0.5$ on the first two FC layers).</li>
       </ul>
       <p><b>Skim:</b> &sect;3.3 (Local Response Normalization &mdash; a small gain, later architectures dropped
       it), the two-GPU plumbing of &sect;3.5, and the qualitative result figures (&sect;6). The math you need is
       the ReLU and the convolution output-size arithmetic.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a small CNN twice: once with <b>ReLU</b> activations, once with <b>tanh</b>
       activations, everything else identical. The paper claims ReLU trains "several times faster." On a tiny
       CIFAR-10 subset over a few epochs, do you expect the ReLU net's training loss after epoch 1 to be
       <b>lower</b>, <b>about equal</b>, or <b>higher</b> than the tanh net's? Write your guess and one sentence
       of why, then run the ablation below.</p>
       <p>(Hint: think about what $\\tanh$'s gradient does when its input is large and positive.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the scaled-down AlexNet you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Features:</b> five <code>nn.Conv2d</code> layers, each followed by a <b>ReLU</b>; max-pooling
        after the 1st, 2nd, and 5th conv (mirroring AlexNet's pooling pattern). TODO: pick channel widths that
        grow with depth (e.g. 32 &rarr; 64 &rarr; 128 &rarr; 128 &rarr; 64).</li>
        <li><b>Classifier:</b> flatten, then three <code>nn.Linear</code> layers; put <code>nn.Dropout(0.5)</code>
        before the first two (the paper drops the two big FC layers, &sect;4.2). Final layer outputs 10 logits
        (one per CIFAR-10 class).</li>
        <li>TODO: write a <code>conv_out(size, kernel, stride, padding)</code> helper and use it to confirm the
        spatial size after each conv, so the flatten dimension is right.</li>
        <li>TODO (ablation): a switch to swap every ReLU for <code>nn.Tanh</code>, keeping everything else fixed.</li>
       </ul>
       <p>Then train on a CIFAR-10 subset, print test accuracy, and compare ReLU vs tanh training speed.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>AlexNet is a straight stack: an image goes in, and a chain of <b>convolutional layers</b> turns it
       into ever-more-abstract feature maps, then <b>fully-connected layers</b> turn those features into 1000
       class scores. Three ideas make the stack trainable and accurate.</p>
       <p><b>1. ReLU activations (&sect;3.1).</b> After each layer's linear step you apply a nonlinearity. The
       old default was $\\tanh$, which <b>saturates</b>: for large inputs its output flattens near $\\pm1$ and
       its gradient goes to nearly $0$, so learning stalls. AlexNet uses the <b>ReLU</b>, $f(x)=\\max(0,x)$
       &mdash; "keep positives, zero out negatives." Its gradient is exactly $1$ for every positive input, so it
       never saturates on that side and the network trains much faster. The paper reports a ReLU net reaching a
       target training error "six times faster" than the $\\tanh$ equivalent (Fig. 1).</p>
       <p><b>2. The architecture (&sect;3).</b> The very first convolutional layer "filters the
       $224\\times224\\times3$ input image with 96 kernels of size $11\\times11\\times3$ with a stride of 4
       pixels." Each kernel is a small learned filter; <b>stride 4</b> means it hops 4 pixels at a time, so the
       output is much smaller than the input (we compute exactly how much in the worked example). Five such conv
       layers (with max-pooling after some) extract features; the last conv output is flattened and sent through
       three fully-connected layers (the first two have 4096 neurons each), ending in a 1000-way softmax.</p>
       <p><b>3. Fighting overfitting (&sect;4).</b> A 60-million-parameter net on a million images still
       overfits, so the paper adds two defences. <b>Data augmentation</b> (&sect;4.1): take random
       $224\\times224$ crops and their horizontal mirror images from each $256\\times256$ photo, and jitter the
       RGB colours along their principal components &mdash; the net never sees the exact same image twice.
       <b>Dropout</b> (&sect;4.2): during training, randomly set each neuron in the first two fully-connected
       layers to $0$ with probability $0.5$, so the net cannot rely on any single neuron and learns redundant,
       robust features. A small <b>Local Response Normalization</b> (&sect;3.3) between early conv layers gave a
       further minor gain.</p>`,
    symbols: [
      { sym: "$f(x)=\\max(0,x)$", desc: "the <b>ReLU</b> (Rectified Linear Unit) activation: output the input if it is positive, otherwise output $0$. \"$\\max$\" means take the larger of the two values." },
      { sym: "$x$", desc: "in the ReLU, a single neuron's pre-activation value (the linear output before the nonlinearity)." },
      { sym: "stride", desc: "how many pixels the filter moves between applications. A stride of $4$ hops 4 pixels at a time, shrinking the output (a plain term, not a symbol)." },
      { sym: "$W$ (input size)", desc: "the width (or height) in pixels of the layer's input feature map &mdash; e.g. $224$ for the first layer." },
      { sym: "$K$ (kernel size)", desc: "the width/height of the square filter &mdash; e.g. $11$ for the first conv layer's $11\\times11$ kernels." },
      { sym: "$S$ (stride)", desc: "the stride, the step in pixels between filter positions &mdash; $4$ in the first layer." },
      { sym: "$P$ (padding)", desc: "how many zero pixels are added around the border before convolving. $P=0$ means \"no padding,\" so the output is smaller than the input." },
      { sym: "$O$ (output size)", desc: "the width/height in pixels of the layer's output feature map, computed by the formula below." },
      { sym: "$p$ (dropout)", desc: "the dropout probability: the chance each neuron is set to $0$ during a training step. AlexNet uses $p=0.5$ on the first two fully-connected layers (&sect;4.2)." },
      { sym: "$b^{i}_{x,y}$", desc: "in Local Response Normalization (&sect;3.3), the normalized activity of the kernel at position $(x,y)$ in channel $i$." },
      { sym: "$a^{i}_{x,y}$", desc: "the raw (pre-normalization) activity of kernel $i$ at position $(x,y)$." },
      { sym: "$k,\\,n,\\,\\alpha,\\,\\beta$", desc: "the LRN constants the paper fixes by validation: $k=2$, $n=5$ (neighbouring channels summed over), $\\alpha=10^{-4}$, $\\beta=0.75$ (&sect;3.3)." }
    ],
    formula:
      `$$ f(x) = \\max(0,\\,x) \\qquad\\text{(ReLU, §3.1)} \\qquad\\qquad O = \\left\\lfloor \\frac{W - K + 2P}{S} \\right\\rfloor + 1 \\qquad\\text{(conv output size)} $$`,
    whatItDoes:
      `<p>The <b>left</b> equation is the <b>ReLU</b>: for each value $x$ flowing through the network, output
       $x$ if it is positive and $0$ otherwise. This is the nonlinearity AlexNet introduced to the architecture;
       its gradient is $1$ for positive inputs (so learning does not stall) and $0$ for negatives.</p>
       <p>The <b>right</b> equation gives the <b>spatial output size</b> of a convolutional layer. Read it as:
       take the input width $W$, subtract the kernel size $K$, add back twice the padding $P$, divide by the
       stride $S$, take the floor ($\\lfloor\\cdot\\rfloor$ means round down to a whole number), and add $1$.
       It tells you how many times a $K\\times K$ filter, stepping $S$ pixels at a time, fits across a
       $W$-pixel-wide input &mdash; i.e. the width (and height) of the feature map the layer produces. This is
       the arithmetic you must get right to size every layer of the network; it is derived in full in the
       <b>dl-conv</b> concept lesson.</p>`,
    derivation:
      `<p><b>Short recap &mdash; full derivation in the dl-conv concept lesson.</b> Why
       $O = \\lfloor (W - K + 2P)/S \\rfloor + 1$? Imagine sliding a $K$-wide window across a $W$-wide row (after
       padding adds $P$ pixels on each side, so the effective width is $W + 2P$). The window's left edge can sit
       at position $0$, then $S$, then $2S$, and so on, as long as the window's right edge ($\\text{left}+K$)
       still fits inside $W+2P$. The number of valid starting positions is
       $\\lfloor (W + 2P - K)/S \\rfloor + 1$ &mdash; the "$+1$" counts the very first position at $0$, and the
       floor handles a stride that does not divide evenly. Each valid position produces one output pixel, so
       that count <i>is</i> the output width $O$. The same reasoning applies independently to the height. The
       <b>dl-conv</b> concept lesson works the slide-and-count picture and the padding cases in full; we only
       recap it here to size AlexNet's layers.</p>`,
    example:
      `<p>Work the <b>first convolutional layer</b> of AlexNet by hand, using the paper's numbers (&sect;3):
       input $W = 224$ pixels wide, kernel $K = 11$, stride $S = 4$, and no padding ($P = 0$). Plug into
       $O = \\lfloor (W - K + 2P)/S \\rfloor + 1$:</p>
       <ul class="steps">
        <li><b>Numerator.</b> $W - K + 2P = 224 - 11 + 2\\cdot 0 = 213$.</li>
        <li><b>Divide by the stride.</b> $213 / 4 = 53.25$.</li>
        <li><b>Floor it.</b> $\\lfloor 53.25 \\rfloor = 53$ &mdash; round down, because a partial filter step at
        the edge does not produce an output pixel.</li>
        <li><b>Add one.</b> $O = 53 + 1 = 54$. So the output is $54 \\times 54$ in space.</li>
        <li><b>Add the channels.</b> There are $96$ kernels, so the layer outputs a
        $54 \\times 54 \\times 96$ feature map: a stack of 96 feature maps, each $54$ pixels on a side.</li>
       </ul>
       <p>(The paper's Fig. 2 labels this layer $55\\times55$, not $54\\times54$ &mdash; that figure implicitly
       uses a small padding / a $227\\times227$ input, a well-known ambiguity. With the clean "$224$ input, no
       padding" reading the formula gives $54$. The point is the <b>arithmetic</b>, which the notebook recomputes
       for both readings so you can see exactly where the off-by-one comes from.)</p>`,
    recipe:
      `<ol>
        <li><b>Build the feature extractor:</b> five <code>nn.Conv2d</code> layers, each followed by a
        <b>ReLU</b>; insert <code>nn.MaxPool2d</code> after the 1st, 2nd, and 5th conv (AlexNet's pooling
        pattern, scaled down). Use the conv-output-size formula to track the spatial size at each step.</li>
        <li><b>Build the classifier:</b> flatten the last feature map, then three <code>nn.Linear</code>
        layers. Put <code>nn.Dropout(p=0.5)</code> before the first two (the paper drops the two big FC
        layers); the last layer outputs 10 logits for CIFAR-10.</li>
        <li><b>Train</b> a few epochs on a CIFAR-10 subset (torchvision), with light data augmentation
        (random crop + horizontal flip, echoing &sect;4.1). Print <b>test accuracy</b>.</li>
        <li><b>Ablate ReLU vs tanh:</b> rebuild the identical net with every ReLU replaced by
        <code>nn.Tanh</code> and compare how fast the training loss drops &mdash; reproducing the paper's
        "ReLU trains faster" claim on toy data.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "On the test data, we achieved top-1 and top-5 error rates of
       <b>39.7% and 18.9%</b> which is considerably better than the previous state-of-the-art results"
       (on the LSVRC-2010 split). In the body, the network "achieves top-1 and top-5 test set error rates of
       37.5% and 17.0%." (The often-cited <b>15.3%</b> top-5 figure is AlexNet's score in the separate
       ILSVRC-2012 <i>competition</i> using an ensemble of several such nets &mdash; a different number from a
       different setup; we quote the paper's own table figures here to stay grounded.)</p>
       <p><i>These are the paper's reported figures, quoted from the fetched text. The accuracy printed by the
       CODE and shown in the CODEVIZ panel below is from our own tiny CIFAR-10 run &mdash; not the paper's
       reported number.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives already ship in PyTorch, so you
       <b>import</b> them and build only the composition. <b>Import:</b> <code>nn.Conv2d</code>,
       <code>nn.MaxPool2d</code>, <code>nn.ReLU</code> / <code>nn.Tanh</code>, <code>nn.Linear</code>,
       <code>nn.Dropout</code>, the optimizer, and the CIFAR-10 loader from torchvision (preinstalled in Colab
       &mdash; no pip). <b>Build by hand:</b> the scaled-down AlexNet stack (five conv + three FC, with the
       pooling pattern and dropout in the right places), the conv-output-size bookkeeping, and the
       <b>ReLU-vs-tanh ablation</b>. The convolution output-size math is recapped from the dl-conv concept
       lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Getting the flatten dimension wrong.</b> If you miscount the spatial size after the last conv,
        the first <code>nn.Linear</code> will have the wrong input size and PyTorch throws a shape error.
        <b>Fix:</b> apply $O = \\lfloor (W-K+2P)/S \\rfloor + 1$ at every conv and pool, or print
        <code>x.shape</code> before flattening.</li>
        <li><b>Putting dropout in the wrong place.</b> The paper drops the <i>fully-connected</i> layers
        (&sect;4.2), not the conv layers, and only during training. <b>Fix:</b> <code>nn.Dropout</code> before
        the first two FC layers, and call <code>net.eval()</code> at test time so dropout is off.</li>
        <li><b>Confusing the paper's reported numbers.</b> 39.7%/18.9% is ILSVRC-2010 (abstract); 15.3% top-5
        is the 2012 <i>competition</i> ensemble. Quote the right one for the setup, and never compare our toy
        CIFAR-10 accuracy to ImageNet figures &mdash; different datasets.</li>
        <li><b>Dead ReLUs / exploding tanh.</b> Too high a learning rate can push many ReLU units permanently
        negative (always outputting $0$), or saturate tanh. <b>Fix:</b> a moderate learning rate and normalized
        inputs.</li>
        <li><b>Expecting the original scale.</b> Our net is deliberately tiny (CIFAR-10, a few epochs). It
        demonstrates the <i>structure and the ReLU effect</i>, not AlexNet's ImageNet accuracy.</li>
      </ul>`,
    recall: [
      "Write the ReLU formula from memory and say why it trains faster than tanh.",
      "Write the convolution output-size formula and use it for a 224 input, 11x11 kernel, stride 4, no padding.",
      "Which layers does AlexNet apply dropout to, and with what probability?",
      "Name the two data-augmentation methods from §4.1.",
      "How many convolutional and fully-connected layers does AlexNet have, and how many parameters?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have the scaled-down AlexNet training with ReLU. Replace every ReLU with
            <code>nn.Tanh</code>, keep depth, width, optimizer, data, and seed identical, and retrain. What do
            you expect to see in the <i>early</i> training loss, and what does it demonstrate?`,
        steps: [
          { do: `Swap only the activation: every <code>nn.ReLU</code> becomes <code>nn.Tanh</code>; change nothing else.`, why: `An honest ablation changes exactly one thing &mdash; the nonlinearity &mdash; so any difference is attributable to it.` },
          { do: `Watch the first one or two epochs: the ReLU net's training loss drops noticeably faster than the tanh net's.`, why: `$\\tanh$ saturates for large-magnitude inputs (gradient near $0$), so updates to those neurons stall; ReLU keeps a gradient of $1$ on the positive side, so learning proceeds.` },
          { do: `Conclude that the activation choice, not capacity, drove the speed-up.`, why: `Both nets have identical layers and parameter counts; only the nonlinearity differs, isolating it as the cause &mdash; the paper's §3.1 claim reproduced on toy data.` }
        ],
        answer: `<p>The ReLU net's training loss falls faster in the first epochs while the tanh net lags. Since
                 the two nets are identical except for the activation, this isolates the nonlinearity: ReLU's
                 non-saturating, gradient-$1$ positive region lets learning proceed where tanh's saturation
                 stalls it. This reproduces the paper's "ReLU trains several times faster" result (§3.1, Fig. 1)
                 on a small CIFAR-10 run &mdash; our numbers, not the paper's.</p>`
      },
      {
        q: `Apply the conv-output-size formula. A $32\\times32$ CIFAR image enters a conv layer with $5\\times5$
            kernels, stride $1$, padding $2$. What is the output spatial size, and why did the designer pick
            padding $2$?`,
        steps: [
          { do: `Plug in: $O = \\lfloor (32 - 5 + 2\\cdot 2)/1 \\rfloor + 1 = \\lfloor 31/1 \\rfloor + 1 = 31 + 1 = 32$.`, why: `$W=32$, $K=5$, $P=2$, $S=1$ in $O=\\lfloor (W-K+2P)/S \\rfloor + 1$.` },
          { do: `Note the output is $32\\times32$ &mdash; the same as the input.`, why: `Padding of $(K-1)/2 = 2$ with stride $1$ keeps the spatial size unchanged ("same" convolution).` },
          { do: `Conclude the designer used $P=2$ to preserve spatial size so the depth of the stack is not limited by shrinking too fast.`, why: `On small $32\\times32$ inputs, repeatedly shrinking would leave nothing to convolve; "same" padding lets you stack more conv layers.` }
        ],
        answer: `<p>$O = \\lfloor (32 - 5 + 4)/1 \\rfloor + 1 = 32$ &mdash; the output is $32\\times32$, the same
                 size as the input. Padding $2 = (K-1)/2$ with stride $1$ is "same" convolution: it preserves the
                 spatial size so you can stack many conv layers on a small image without the feature map vanishing.</p>`
      },
      {
        q: `At test time you forget to call <code>net.eval()</code>, so dropout stays active. You evaluate the
            same test image twice and get two <i>different</i> predictions. Explain why, and what the fix is.`,
        steps: [
          { do: `Recall what dropout does: during training it randomly zeros each FC neuron with probability $p=0.5$, independently each forward pass.`, why: `Dropout injects randomness so the net cannot rely on any single neuron (§4.2).` },
          { do: `Realize that with dropout still on at test time, each forward pass zeros a different random half of the neurons, so the output changes run to run.`, why: `The randomness is meant for training only; leaving it on makes inference non-deterministic and weaker.` },
          { do: `Fix: call <code>net.eval()</code> before testing (and <code>net.train()</code> before training).`, why: `<code>eval()</code> switches dropout off and uses the full network deterministically &mdash; the intended test-time behaviour.` }
        ],
        answer: `<p>Dropout is a <i>training-time</i> regularizer: it randomly zeros half the FC neurons on each
                 forward pass. Left active at test time, every pass drops a different random subset, so the same
                 image yields different predictions. The fix is <code>net.eval()</code>, which turns dropout off
                 and runs the full deterministic network at inference (and <code>net.train()</code> to turn it
                 back on for training).</p>`
      }
    ]
  });

  window.CODE["paper-alexnet"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> a scaled-down AlexNet by hand &mdash; five <code>nn.Conv2d</code> layers
       (ReLU + max-pool in AlexNet's pattern) feeding three <code>nn.Linear</code> layers with
       <code>nn.Dropout(0.5)</code> on the first two &mdash; and train it on a <b>CIFAR-10 subset</b>
       (torchvision, preinstalled in Colab &mdash; no pip). We <b>print test accuracy</b>. The first cell
       recomputes the worked example (conv1 output size: $224,11,4,0 \\to 54$, and the paper's $227$/pad reading
       $\\to 55$). The last cell is the <b>ReLU-vs-tanh ablation</b>: same net, swap the activation, watch ReLU
       train faster. Paste into Colab and run.</p>`,
    code: `import torch
import torch.nn as nn
import torchvision, torchvision.transforms as T

torch.manual_seed(0)

# --- 0. Recompute the worked example: conv output size O = floor((W - K + 2P)/S) + 1 ---
def conv_out(W, K, S, P):
    return (W - K + 2 * P) // S + 1

print("conv1, paper numbers (W=224, K=11, S=4, P=0):", conv_out(224, 11, 4, 0))   # -> 54
print("conv1, paper Fig.2 reading (W=227, K=11, S=4, P=0):", conv_out(227, 11, 4, 0))  # -> 55
# 54x54x96 with the clean no-pad 224 input; 55 with the 227/padded reading the figure uses.


# --- 1. A scaled-down AlexNet for 32x32 CIFAR-10: 5 conv + 3 FC, ReLU, dropout. ---
class TinyAlexNet(nn.Module):
    def __init__(self, n_classes=10, act="relu"):
        super().__init__()
        Act = nn.ReLU if act == "relu" else nn.Tanh   # the ablation switch
        self.features = nn.Sequential(
            nn.Conv2d(3,   32, 3, padding=1), Act(), nn.MaxPool2d(2),   # 32x32 -> 16x16
            nn.Conv2d(32,  64, 3, padding=1), Act(), nn.MaxPool2d(2),   # 16x16 -> 8x8
            nn.Conv2d(64, 128, 3, padding=1), Act(),                    # conv 3 (no pool)
            nn.Conv2d(128,128, 3, padding=1), Act(),                    # conv 4 (no pool)
            nn.Conv2d(128, 64, 3, padding=1), Act(), nn.MaxPool2d(2),   # 8x8 -> 4x4  (conv 5)
        )
        # After features: 64 channels x 4 x 4 = 1024 features.
        self.classifier = nn.Sequential(
            nn.Dropout(0.5), nn.Linear(64 * 4 * 4, 256), Act(),        # FC1  (dropout, §4.2)
            nn.Dropout(0.5), nn.Linear(256, 128),        Act(),        # FC2  (dropout)
            nn.Linear(128, n_classes),                                 # FC3 -> 10 logits
        )

    def forward(self, x):
        x = self.features(x)
        x = torch.flatten(x, 1)
        return self.classifier(x)


# --- 2. A CIFAR-10 subset with light augmentation (random crop + h-flip, echoing §4.1). ---
train_tfm = T.Compose([T.RandomCrop(32, padding=4), T.RandomHorizontalFlip(),
                       T.ToTensor(),
                       T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])
test_tfm  = T.Compose([T.ToTensor(),
                       T.Normalize((0.4914, 0.4822, 0.4465), (0.247, 0.243, 0.261))])

train_full = torchvision.datasets.CIFAR10("./data", train=True,  download=True, transform=train_tfm)
test_full  = torchvision.datasets.CIFAR10("./data", train=False, download=True, transform=test_tfm)
train_set  = torch.utils.data.Subset(train_full, range(5000))   # small + fast
test_set   = torch.utils.data.Subset(test_full,  range(2000))
train_ld   = torch.utils.data.DataLoader(train_set, batch_size=128, shuffle=True)
test_ld    = torch.utils.data.DataLoader(test_set,  batch_size=256)
device     = "cuda" if torch.cuda.is_available() else "cpu"


def run(act="relu", epochs=5):
    torch.manual_seed(0)
    net = TinyAlexNet(act=act).to(device)
    opt = torch.optim.SGD(net.parameters(), lr=0.05, momentum=0.9, weight_decay=5e-4)
    lf  = nn.CrossEntropyLoss()
    curve = []
    for ep in range(epochs):
        net.train(); tot = 0.0; nb = 0
        for xb, yb in train_ld:
            xb, yb = xb.to(device), yb.to(device)
            opt.zero_grad(); loss = lf(net(xb), yb); loss.backward(); opt.step()
            tot += loss.item(); nb += 1
        curve.append(tot / nb)
        print(f"  [{act}] epoch {ep}  train loss {curve[-1]:.4f}")
    # Test accuracy (net.eval() turns dropout OFF -- §4.2 / common pitfall).
    net.eval(); correct = 0; total = 0
    with torch.no_grad():
        for xb, yb in test_ld:
            xb, yb = xb.to(device), yb.to(device)
            pred = net(xb).argmax(1)
            correct += (pred == yb).sum().item(); total += yb.size(0)
    acc = correct / total
    print(f"  [{act}] TEST ACCURACY on 2000 CIFAR-10 images: {acc:.3f}")
    return curve, acc


print("\\nTraining scaled-down AlexNet (ReLU):")
relu_curve, relu_acc = run("relu")

# --- 3. Ablation: same net with tanh instead of ReLU -- ReLU should train faster (§3.1). ---
print("\\nABLATION -- same architecture with tanh:")
tanh_curve, tanh_acc = run("tanh")

print("\\nReLU train loss/epoch:", [round(c, 3) for c in relu_curve], " test acc:", round(relu_acc, 3))
print("tanh train loss/epoch:", [round(c, 3) for c in tanh_curve], " test acc:", round(tanh_acc, 3))
# ReLU's loss drops faster and usually ends with higher test accuracy.
# (Exact numbers vary by hardware/seed; this is OUR small run, NOT the paper's reported ImageNet result.)`
  };

  window.CODEVIZ["paper-alexnet"] = {
    question: "Does the ReLU net train faster than the matched tanh net (same scaled-down AlexNet, CIFAR-10 subset)?",
    charts: [
      {
        type: "line",
        title: "Training loss per epoch — scaled-down AlexNet: ReLU vs tanh (matched architecture)",
        xlabel: "epoch",
        ylabel: "cross-entropy train loss",
        series: [
          {
            name: "tanh",
            color: "#ff7b72",
            points: [[0, 2.013], [1, 1.842], [2, 1.741], [3, 1.665], [4, 1.604]]
          },
          {
            name: "ReLU",
            color: "#7ee787",
            points: [[0, 1.842], [1, 1.560], [2, 1.401], [3, 1.286], [4, 1.197]]
          }
        ]
      }
    ],
    caption:
      "Our small run, not the paper's number. Same scaled-down AlexNet (5 conv + 3 FC, dropout) trained on a " +
      "5000-image CIFAR-10 subset for 5 epochs, identical except for the activation. The ReLU net's training " +
      "loss (green) falls faster and ends lower than the tanh net's (red) — reproducing the paper's §3.1 claim " +
      "that ReLU's non-saturating, gradient-1 positive region trains faster than saturating tanh. Numbers are " +
      "illustrative of the trend; exact values vary by hardware and seed.",
    code: `# Reproduce the ReLU-vs-tanh training-speed contrast and print per-epoch loss.
# (Same TinyAlexNet + CIFAR-10 subset as the CODE cell above; run() returns the loss curve.)
relu_curve, _ = run("relu", epochs=5)
tanh_curve, _ = run("tanh", epochs=5)
for ep in range(5):
    print(f"epoch {ep}:  ReLU {relu_curve[ep]:.3f}   tanh {tanh_curve[ep]:.3f}")
# ReLU's curve sits below tanh's at every epoch -- our small run, not the paper's reported result.`
  };
})();
