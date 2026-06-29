/* Paper lesson — "Deep learning", Yann LeCun, Yoshua Bengio & Geoffrey Hinton,
   Nature, Vol 521, pp 436-444, 28 May 2015 (DOI 10.1038/nature14539). The
   landmark review that mapped the field. Self-contained: lesson + CODE + CODEVIZ
   merged by id "paper-deep-learning-survey".
   GROUNDED from the freely available author-hosted PDF mirror
   (https://www.cs.toronto.edu/~hinton/absps/NatureDeepReview.pdf) — read directly.
   Sections transcribed: Abstract; "Supervised learning"; "Backpropagation to
   train multilayer architectures"; "Convolutional neural networks"; "Image
   understanding with deep convolutional networks"; "Distributed representations
   and language processing"; "Recurrent neural networks"; "The future of deep
   learning". All quoted sentences and numbers are copied verbatim from that text.
   Track: read-only (a SURVEY/review). No from-scratch implementation. This lesson
   is a READING GUIDE that ties the review's topics to the learner's existing
   concept lessons. CODEVIZ is intentionally minimal: an empty charts array plus a
   caption — the page renderer (codeVizBlock) shows nothing when charts is empty,
   which is the correct choice for a survey with no measured run of our own. */
(function () {
  window.LESSONS.push({
    id: "paper-deep-learning-survey",
    title: "Deep Learning (survey) — Deep learning (LeCun, Bengio, Hinton, 2015)",
    tagline: "The Nature review that mapped the whole field: representation learning, backprop, ConvNets, recurrent nets, and what comes next.",
    module: "Papers · Datasets, Benchmarks & Surveys",
    track: "read-only",
    paper: {
      authors: "Yann LeCun, Yoshua Bengio, Geoffrey Hinton",
      org: "Facebook AI Research / New York University · Université de Montréal · Google / University of Toronto",
      year: 2015,
      venue: "Nature, Vol 521, pp 436-444 (28 May 2015)",
      citations: "",
      url: "https://www.cs.toronto.edu/~hinton/absps/NatureDeepReview.pdf",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["fe-what-is-a-feature", "dl-neuron", "dl-forward-prop", "ml-supervised", "ml-gradient-descent", "dl-backprop", "dl-conv", "dl-rnn", "dl-lstm-gru", "dl-word-embeddings", "unl-overview"],

    // WHY READ IT
    problem:
      `<p>This is a <b>review</b>, not a method paper. So the "problem" it addresses is one of <i>understanding</i>:
       by 2015 deep learning had suddenly started winning, and the field needed a single clear map of what these
       systems are, why they work, and where they are going. Three of the people most responsible for the field —
       Yann LeCun, Yoshua Bengio and Geoffrey Hinton — wrote that map for the journal <i>Nature</i>.</p>
       <p>The deeper problem the review describes is older. For decades, building a recognition system meant
       hand-crafting a <b>feature extractor</b> — a piece of code, written by a human expert, that turns raw data
       (say, the pixels of an image) into a tidy list of numbers a simple classifier can use. A
       <b>classifier</b> is the part that maps those numbers to a label (cat, dog, stop sign). The review states
       the limitation plainly: "Conventional machine-learning techniques were limited in their ability to process
       natural data in their raw form." (Intro.) Designing the feature extractor "required careful engineering and
       considerable domain expertise." (Intro.) Each new task meant a new round of human engineering.</p>
       <p>The question the field had been circling for fifty years: <b>can a machine learn the features itself,
       straight from raw data, instead of being handed features a person designed?</b> The review's answer, and its
       organizing idea, is <b>representation learning</b>.</p>`,
    contribution:
      `<p>A review does not <i>introduce</i> a method; it <b>synthesizes</b> a field. This one contributes a single
       coherent story and a vocabulary. Its three load-bearing ideas:</p>
      <ul>
        <li><b>Representation learning is the point.</b> The review defines it: "Representation learning is a set of
        methods that allows a machine to be fed with raw data and to automatically discover the representations
        needed for detection or classification." (Intro.) Deep learning is representation learning with
        <i>many layers</i>, "obtained by composing simple but non-linear modules" so that "very complex functions
        can be learned." (Intro.) Crucially: "these layers of features are not designed by human engineers: they
        are learned from data using a general-purpose learning procedure." (Intro.)</li>
        <li><b>Backpropagation is the engine.</b> One algorithm trains all of it. The review summarizes deep
        learning as discovering "intricate structure in large data sets by using the backpropagation algorithm to
        indicate how a machine should change its internal parameters that are used to compute the representation in
        each layer from the representation in the previous layer." (Abstract.)</li>
        <li><b>Two architecture families do the heavy lifting.</b> "Deep convolutional nets have brought about
        breakthroughs in processing images, video, speech and audio, whereas recurrent nets have shone light on
        sequential data such as text and speech." (Abstract.) The review devotes a section to each, plus a closing
        section on where the field should go — toward <b>unsupervised learning</b>.</li>
      </ul>`,
    whyItMattered:
      `<p>The review itself <i>is</i> the "why it mattered": it is the canonical, citable, accessible statement of
       deep learning from the three researchers later jointly awarded the 2018 A.M. Turing Award for this work. It
       is the document a newcomer is pointed to first. It set the shared vocabulary — "representation learning",
       "distributed representations", "end-to-end" — that the next decade used.</p>
       <p>It also reads as a forecast, and the forecast was right. It opens by listing where deep learning had
       already won: it "has beaten other machine-learning techniques at predicting the activity of potential drug
       molecules, analysing particle accelerator data, reconstructing brain circuits, and predicting the effects of
       mutations in non-coding DNA on gene expression and disease," with "extremely promising results for various
       tasks in natural language understanding." (Intro.) It then predicts "deep learning will have many more
       successes in the near future because it requires very little engineering by hand, so it can easily take
       advantage of increases in the amount of available computation and data." (Intro.) That sentence — scale
       plus less hand-engineering — is the thesis the whole subsequent era ran on. <b>Read this paper to get the
       field's own map of itself, in the field's own words, at the moment it took off.</b></p>`,

    // READING GUIDE
    readingGuide:
      `<p>This lesson is a <b>reading guide</b>. The review is short (nine pages) and built for a general-science
       audience, so read the whole thing — but read it actively, mapping each section to a concept you may already
       have a lesson for. Here is the route.</p>
       <ul>
        <li><b>Abstract + intro</b> — the thesis in two paragraphs: representation learning, layers of abstraction,
        backpropagation, ConvNets for images, recurrent nets for sequences. If you internalize only this, you have
        the paper's skeleton. Tie it to your lesson on <b>what a feature is</b> (the thing you no longer hand-design)
        and on <b>a single neuron</b> (the simple non-linear module that gets composed).</li>
        <li><b>"Supervised learning"</b> — a clean, plain recap of how a labelled-data system is trained: scores,
        an objective (error) function, weights, and <b>stochastic gradient descent</b> (SGD). Pair with your
        lessons on <b>supervised learning</b> and <b>gradient descent</b>. Note the honest detail: a deep system
        "may [have] hundreds of millions of these adjustable weights." (&sect;Supervised learning.)</li>
        <li><b>"Backpropagation to train multilayer architectures"</b> — the heart. Backprop "is nothing more than a
        practical application of the chain rule for derivatives." (&sect;Backprop.) Read Figure 1 alongside your
        <b>backpropagation</b> lesson; this section is the why-it-works, your lesson is the line-by-line how.</li>
        <li><b>"Convolutional neural networks"</b> + <b>"Image understanding..."</b> — the four ideas behind
        ConvNets and the ImageNet moment. Pair with your <b>convolution</b> lesson. Read Figure 2 (a ConvNet
        applied to an image).</li>
        <li><b>"Distributed representations and language processing"</b> — why learned vectors beat counting, and
        word vectors. Pair with your <b>word embeddings</b> lesson. Read Figure 4 (the learned word-vector map).</li>
        <li><b>"Recurrent neural networks"</b> — sequences, the exploding/vanishing-gradient problem, and the LSTM
        fix. Pair with your <b>recurrent networks</b> and <b>LSTM / GRU</b> lessons. Read Figure 5 (an RNN unrolled
        in time).</li>
        <li><b>"The future of deep learning"</b> — the authors' outlook: unsupervised learning, attention, combining
        ConvNets and RNNs with reinforcement learning, and reasoning. Pair with your <b>unsupervised-learning
        overview</b>. This is opinion, not result — read it as the authors' bets.</li>
       </ul>
       <p><b>You do not implement this paper.</b> It is a survey. Read it for the map and the connections; build the
       individual pieces in their own concept lessons.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>Before reading, make one prediction. The review's central claim is that a deep network <i>learns its own
       features</i> in a hierarchy — low layers find simple things, higher layers compose them into complex things.
       For an <b>image</b> classifier, guess the order of what each layer detects, from the first hidden layer up:</p>
       <ul>
        <li>parts of familiar objects (an eye, a wheel)</li>
        <li>edges at particular orientations and locations</li>
        <li>whole objects as combinations of parts</li>
        <li>motifs — particular arrangements of edges</li>
       </ul>
       <p>Write the four in the order you think the network builds them, lowest layer first. Then check yourself
       against the review's own description of an image hierarchy (it is explicit about all four). One sentence:
       why would <i>edges</i> have to come before <i>parts of objects</i>?</p>`,
    attempt:
      `<p>This is a read-only paper, so there is nothing to build. Instead, do a <b>structured reading attempt</b> —
       fill in this map as you read, from the review's own text:</p>
       <ul>
        <li><b>The one-line thesis.</b> Copy the abstract's definition of what deep learning <i>does</i> with the
        backpropagation algorithm. (Hint: it "indicate[s] how a machine should change its internal parameters...")</li>
        <li><b>Hand-engineered vs learned.</b> In one sentence each, write what the <i>old</i> pipeline required of a
        human and what the <i>new</i> one learns automatically. The review calls the latter "the key advantage of
        deep learning." (&sect;Backprop.)</li>
        <li><b>One algorithm, two architectures.</b> Name the single training algorithm and the two architecture
        families, and one data type each is for. (Backprop; ConvNets for images/audio; recurrent nets for sequences.)</li>
        <li><b>TODO — the outlook.</b> List the four directions the closing section bets on for the future, and mark
        which one the authors most expect to grow ("we expect unsupervised learning to become far more important in
        the longer term", &sect;Future).</li>
       </ul>
       <p>There is no CODEVIZ panel of measured numbers here, because a survey has no run of our own to plot. The
       numbers in this lesson are all <b>quoted from the review with attribution</b>.</p>`,

    // ★ HOW IT WORKS — the map of the field ★
    walkthrough:
      `<p>The review tells one connected story. Walk it section by section; each links to a concept you can study in
       depth on its own.</p>

       <p><b>1. The core idea: representation learning (Intro).</b> A <b>representation</b> is just the set of
       numbers a system uses to stand for an input — for an image, the raw pixels are one representation, and a list
       of "is there an eye here?" features is a better one. The old way was to hand-design that better
       representation; the review's thesis is to <i>learn</i> it. Deep learning stacks many simple non-linear
       transforms so that "the representation at one level (starting with the raw input) [is transformed] into a
       representation at a higher, slightly more abstract level." (Intro.) For images the review spells out the
       learned hierarchy: the first layer detects "the presence or absence of edges at particular orientations and
       locations"; the second "detects motifs by spotting particular arrangements of edges"; the third "may assemble
       motifs into larger combinations that correspond to parts of familiar objects"; and later layers "detect
       objects as combinations of these parts." (Intro.) Each simple module is a <b>neuron</b> — a weighted sum
       followed by a non-linearity.</p>

       <p><b>2. Supervised learning (&sect;Supervised learning).</b> The most common setting. Show the machine a
       labelled example (an image and its category), let it "produce an output in the form of a vector of scores,
       one for each category", and "compute an objective function that measures the error (or distance) between the
       output scores and the desired pattern of scores." (&sect;Supervised learning.) Then adjust the
       <b>weights</b> — "real numbers that can be seen as 'knobs' that define the input-output function" — to lower
       that error. The adjustment uses <b>stochastic gradient descent</b>: show a few examples, compute the average
       gradient (the direction of steepest error increase), step the weights the opposite way, repeat. "This simple
       procedure usually finds a good set of weights surprisingly quickly." (&sect;Supervised learning.) Why deep,
       not a shallow linear classifier? Because "linear classifiers can only carve their input space into very
       simple regions" (&sect;Supervised learning), and real problems need the input-output function to be
       insensitive to irrelevant changes (pose, lighting) yet sensitive to tiny important ones — the
       <i>selectivity-invariance dilemma</i>.</p>

       <p><b>3. Backpropagation (&sect;Backprop).</b> How do you get the gradient for a weight buried deep in a
       stack? Backpropagation. The review's framing: "The backpropagation procedure to compute the gradient of an
       objective function with respect to the weights of a multilayer stack of modules is nothing more than a
       practical application of the chain rule for derivatives." (&sect;Backprop.) The key insight: "the derivative
       (or gradient) of the objective with respect to the input of a module can be computed by working backwards
       from the gradient with respect to the output of that module." (&sect;Backprop.) Apply that repeatedly from
       the top (the prediction) down to the bottom (the input) and every weight's gradient falls out. The section
       also recounts the history: backprop was largely "forsaken" in the late 1990s, and the modern revival uses
       the <b>rectified linear unit</b> (ReLU), "$f(z) = \\max(z, 0)$", which "typically learns much faster in
       networks with many layers." (&sect;Backprop.) It also reassures: with large networks, poor local minima are
       "rarely a problem"; the landscape is "packed with a combinatorially large number of saddle points." (&sect;Backprop.)</p>

       <p><b>4. Convolutional networks (&sect;ConvNets, &sect;Image understanding).</b> For data laid out as arrays
       — images especially — the review names "four key ideas behind ConvNets that take advantage of the properties
       of natural signals: local connections, shared weights, pooling and the use of many layers." (&sect;ConvNets.)
       <b>Local connections + shared weights</b>: each unit looks at a small patch, and the same small set of
       weights (a <i>filter bank</i>) slides across the whole image — "the filtering operation performed by a
       feature map is a discrete convolution, hence the name." (&sect;ConvNets.) <b>Pooling</b> merges nearby
       responses, "creating an invariance to small shifts and distortions." (&sect;ConvNets.) The justification is
       structural: "many natural signals are compositional hierarchies, in which higher-level features are obtained
       by composing lower-level ones." (&sect;ConvNets.) The breakthrough moment: on ImageNet, "a data set of about
       a million images that contained 1,000 different classes," deep ConvNets "achieved spectacular results, almost
       halving the error rates of the best competing approaches." (&sect;Image understanding.)</p>

       <p><b>5. Distributed representations and word vectors (&sect;Distributed representations).</b> A
       <b>distributed representation</b> means meaning is spread across many active features, not a single symbol.
       The review's argument: "deep nets have two different exponential advantages over classic learning algorithms
       that do not use distributed representations." (&sect;Distributed representations.) For language, instead of
       treating each word as an atomic symbol (the old <b>N-gram</b> approach, which "cannot generalize across
       semantically related sequences of words"), a network learns a <b>word vector</b> for each word, so that
       "semantically related words end up close to each other in that vector space." (&sect;Distributed
       representations.) These features "were not determined ahead of time by experts, but automatically discovered
       by the neural network." (&sect;Distributed representations.)</p>

       <p><b>6. Recurrent networks for sequences (&sect;RNNs).</b> For text and speech you process one element at a
       time. A <b>recurrent neural network</b> (RNN) does this "maintaining in their hidden units a 'state vector'
       that implicitly contains information about the history of all the past elements of the sequence."
       (&sect;RNNs.) Unrolled in time (Figure 5), an RNN is "a very deep feedforward network in which all the layers
       share the same weights" (&sect;RNNs), so backprop trains it. The catch: "training them has proved to be
       problematic because the backpropagated gradients either grow or shrink at each time step, so over many time
       steps they typically explode or vanish." (&sect;RNNs.) The fix the review highlights is the <b>long
       short-term memory</b> (LSTM): special units "to remember inputs for a long time," with a memory cell that
       "acts like an accumulator or a gated leaky neuron." (&sect;RNNs.) LSTMs power the encoder-decoder networks
       used for machine translation, and (with a ConvNet front-end) for generating image captions (Figure 3).</p>

       <p><b>7. The future (&sect;Future).</b> The authors' bets, stated as opinion: "we expect unsupervised
       learning to become far more important in the longer term," because "human and animal learning is largely
       unsupervised." (&sect;Future.) They expect progress from systems "trained end-to-end" that "combine ConvNets
       with RNNs that use reinforcement learning to decide where to look," from RNNs that learn "strategies for
       selectively attending to one part at a time" (an early statement of <b>attention</b>), and ultimately from
       "systems that combine representation learning with complex reasoning." (&sect;Future.)</p>`,

    // ★ ARCHITECTURE — a structured MAP of the review (a survey has no single model; this is the map) ★
    architecture:
      `<p>A survey has no single network to diagram. Its "architecture" is the <b>structure of the review itself</b> —
       how its sections fit together into one argument, and which concept lesson owns the math of each. Read this as
       the floor-plan of the paper.</p>

       <p><b>The spine: one idea, one engine, two families.</b></p>
       <ul>
        <li><b>The idea — representation learning</b> (Intro). The whole review hangs off this: replace the
        hand-built <b>feature extractor</b> with learned layers. Old pipeline: raw data &rarr; <i>human-designed</i>
        feature extractor &rarr; shallow classifier. New pipeline: raw data &rarr; <i>learned</i> layer 1 &rarr;
        layer 2 &rarr; &hellip; &rarr; layer L &rarr; classifier, every arrow trained. The contrast with hand
        features is the lesson <code>fe-what-is-a-feature</code>; the simple module each arrow is built from is the
        neuron, <code>dl-neuron</code>, and a full forward sweep is <code>dl-forward-prop</code>.</li>
        <li><b>The engine — backpropagation</b> (&sect;Backprop). One algorithm trains every arrow, by the chain rule
        run backward (the equations now in <i>formula</i>: forward $z_l=\\sum w\\,y$, $y_l=f(z_l)$; backward
        $\\partial E/\\partial y_k=\\sum w\\,\\partial E/\\partial z_l$ and weight gradient $y_k\\,\\partial E/\\partial z_l$).
        The full derivation is the lesson <code>dl-backprop</code>; the optimiser that consumes the gradient is
        <code>ml-gradient-descent</code> (stochastic gradient descent), and the labelled-data setting it sits in is
        <code>ml-supervised</code>. The modern non-linearity that made deep stacks trainable is the ReLU,
        $f(z)=\\max(z,0)$.</li>
       </ul>

       <p><b>Family 1 — convolutional nets, for array data</b> (&sect;ConvNets, &sect;Image understanding). Built on
       "four key ideas ... local connections, shared weights, pooling and the use of many layers." A unit looks at a
       small patch; the same filter bank slides everywhere (that sliding "is a discrete convolution"); pooling merges
       nearby responses for "invariance to small shifts." Data flow: image &rarr; [conv + ReLU &rarr; pool] stacked
       many times &rarr; classifier. The convolution operation itself is the lesson <code>dl-conv</code>. Headline
       quoted result: on ImageNet ("about a million images ... 1,000 classes"), deep ConvNets were "almost halving
       the error rates."</p>

       <p><b>Family 2 — recurrent nets, for sequences</b> (&sect;RNNs). Process one element at a time, carrying a
       hidden "state vector" $s_t$ that summarises the past; reuse the same parameters $(U,V,W)$ at every step.
       Unrolled in time it is "a very deep feedforward network in which all the layers share the same weights," so the
       same backprop trains it — but the shared-weight depth makes gradients "explode or vanish." The base recurrent
       net is the lesson <code>dl-rnn</code>; the headline fix — the LSTM memory cell that "acts like an accumulator
       or a gated leaky neuron" — is <code>dl-lstm-gru</code>. Word inputs to these nets are learned vectors
       (distributed representations), the lesson <code>dl-word-embeddings</code>.</p>

       <p><b>The closing outlook — where the map points next</b> (&sect;Future). Stated as the authors' bets, not
       results: unsupervised learning ("we expect [it] to become far more important in the longer term"), selective
       <i>attention</i>, ConvNet+RNN systems trained end-to-end with reinforcement learning, and combining
       representation learning with reasoning. The unsupervised-learning thread is the lesson
       <code>unl-overview</code>.</p>

       <p><b>One-line floor-plan:</b> Intro (representation learning) &rarr; &sect;Supervised + &sect;Backprop (the
       shared training engine) &rarr; &sect;ConvNets / &sect;Image (family 1, arrays) &rarr; &sect;Distributed +
       &sect;RNNs (family 2, sequences) &rarr; &sect;Future (the bets). Read each box for the <i>why</i>; open its
       linked lesson for the <i>how</i>.</p>`,
    symbols: [
      { sym: "“representation”", desc: "a plain term: the set of numbers a system uses to stand for an input. Raw pixels are one representation of an image; a list of learned features (\"is there an edge here?\") is a higher-level one. Deep learning learns a stack of ever-more-abstract representations." },
      { sym: "“representation learning”", desc: "the review's central idea (Intro): \"a set of methods that allows a machine to be fed with raw data and to automatically discover the representations needed for detection or classification.\" The opposite of hand-designing features." },
      { sym: "“feature extractor”", desc: "a plain term: in the OLD pipeline, the hand-written code that turns raw data into a feature vector. The review's thesis is that deep nets replace it with learned layers." },
      { sym: "“classifier”", desc: "a plain term: the component that maps a feature vector to a category label (cat, dog, stop sign). A \"shallow\" classifier sits on top of features; a deep net learns the features and the classification together." },
      { sym: "“weights”", desc: "the review's word for the trainable parameters: \"real numbers that can be seen as 'knobs' that define the input-output function of the machine.\" (&sect;Supervised learning.) A deep system may have hundreds of millions of them." },
      { sym: "“objective function”", desc: "a plain term: the measure of error the training tries to minimize — \"the error (or distance) between the output scores and the desired pattern of scores.\" (&sect;Supervised learning.) Also called the loss." },
      { sym: "“stochastic gradient descent (SGD)”", desc: "the training procedure (&sect;Supervised learning): show a few examples, compute the average gradient (direction of steepest error increase), step the weights the opposite way, repeat. \"Stochastic\" because each small set gives a noisy estimate of the true average gradient." },
      { sym: "“backpropagation”", desc: "the algorithm that computes the gradient of the objective for every weight in a deep stack — \"nothing more than a practical application of the chain rule for derivatives.\" (&sect;Backprop.) Works backwards from the output to the input." },
      { sym: "“ReLU”", desc: "rectified linear unit, the modern non-linearity: $f(z) = \\max(z, 0)$ — pass positive inputs through, zero out negatives. The review notes it \"typically learns much faster in networks with many layers.\" (&sect;Backprop.)" },
      { sym: "“ConvNet (CNN)”", desc: "convolutional neural network: an architecture for array data (images) built on four ideas — local connections, shared weights, pooling, and many layers. (&sect;ConvNets.) The shared-weight sliding operation IS a convolution." },
      { sym: "“pooling”", desc: "a ConvNet operation that merges nearby feature responses (e.g. takes a maximum over a small region), \"creating an invariance to small shifts and distortions.\" (&sect;ConvNets.)" },
      { sym: "“distributed representation”", desc: "meaning spread across many active features at once, rather than one symbol per concept. The review argues this gives deep nets \"two different exponential advantages\" in generalization. (&sect;Distributed representations.)" },
      { sym: "“word vector”", desc: "a learned real-valued vector for each word, placed so that \"semantically related words end up close to each other in that vector space.\" (&sect;Distributed representations.) The features are discovered by the network, not designed." },
      { sym: "“N-gram”", desc: "the OLD language-model approach the review contrasts against: counting how often short symbol sequences (length up to N) occur. It \"treat[s] each word as an atomic unit\" and so \"cannot generalize across semantically related sequences of words.\" (&sect;Distributed representations.)" },
      { sym: "“RNN”", desc: "recurrent neural network: processes a sequence \"one element at a time, maintaining in their hidden units a 'state vector' that implicitly contains information about the history of all the past elements of the sequence.\" (&sect;RNNs.)" },
      { sym: "“exploding / vanishing gradients”", desc: "the RNN training problem (&sect;RNNs): \"the backpropagated gradients either grow or shrink at each time step, so over many time steps they typically explode or vanish.\" The LSTM was designed to fix it." },
      { sym: "“LSTM”", desc: "long short-term memory: an RNN unit with a gated memory cell that \"acts like an accumulator or a gated leaky neuron\" (&sect;RNNs) to remember inputs for a long time — the review's headline fix for vanishing gradients." },
      { sym: "“unsupervised learning”", desc: "learning structure from data without labels. The review's main bet for the future: \"we expect unsupervised learning to become far more important in the longer term.\" (&sect;Future.)" },
      { sym: "“end-to-end”", desc: "a plain term: training a whole pipeline (e.g. ConvNet + RNN) jointly from raw input to final output, with no hand-engineered stages in between. The review expects future progress from end-to-end systems. (&sect;Future.)" }
    ],
    formula: `<p><b>This is a review, not a method paper</b> — it introduces no new math. What follows is the handful of
       equations and quantities the review actually writes down (mostly in the Figure 1 caption and the Backprop
       section), transcribed faithfully. The deep math behind each lives in the linked concept lessons.</p>
       $$ \\text{raw input} \\;\\xrightarrow{\\;\\text{layer 1}\\;}\\; \\text{features}_1 \\;\\xrightarrow{\\;\\text{layer 2}\\;}\\; \\text{features}_2 \\;\\xrightarrow{\\;\\cdots\\;}\\; \\text{features}_L \\;\\xrightarrow{\\;\\text{classifier}\\;}\\; \\text{output} $$
       <p>The review's thesis as a picture (Intro): a deep net is a chain of learned representations, each arrow one trained layer.</p>
       $$ f(z) = \\max(z, 0) $$
       <p>The rectified linear unit (ReLU), "the half-wave rectifier", the one concrete non-linearity the review puts in its body text (&sect;Backprop; Fig. 1 caption writes it $f(z)=\\max(0,z)$, same function). It "typically learns much faster in networks with many layers."</p>
       $$ z_l \\;=\\; \\sum_{k} w_{kl}\\, y_k, \\qquad y_l \\;=\\; f(z_l) $$
       <p>The forward pass of one unit (Fig. 1c): total input $z_l$ is a weighted sum of the outputs $y_k$ of the units in the layer below; the output $y_l$ applies the non-linearity $f$. ("For simplicity, we have omitted bias terms.")</p>
       $$ \\frac{\\partial E}{\\partial y_l} \\;=\\; y_l - t_l \\qquad\\text{for the cost } \\; E \\;=\\; \\tfrac{1}{2}\\,(y_l - t_l)^2 $$
       <p>The output-layer error derivative (Fig. 1d): differentiating the squared-error cost gives $y_l - t_l$, where $t_l$ is the target value.</p>
       $$ \\frac{\\partial E}{\\partial z_l} \\;=\\; \\frac{\\partial E}{\\partial y_l}\\, f'(z_l), \\qquad \\frac{\\partial E}{\\partial y_k} \\;=\\; \\sum_{l} w_{kl}\\,\\frac{\\partial E}{\\partial z_l} $$
       <p>The backward pass (Fig. 1d): convert the error derivative w.r.t. a unit's output into one w.r.t. its input by multiplying by the gradient of $f$; the error derivative w.r.t. a unit in the layer below is the weighted sum of the error derivatives w.r.t. the inputs above. This is "nothing more than a practical application of the chain rule." (&sect;Backprop.)</p>
       $$ \\frac{\\partial E}{\\partial w_{kl}} \\;=\\; y_k\\,\\frac{\\partial E}{\\partial z_l} $$
       <p>The weight gradient (Fig. 1d): "once the $\\partial E/\\partial z_l$ is known, the error-derivative for the weight $w_{kl}$ on the connection from unit $k$ in the layer below is just $y_k\\,\\partial E/\\partial z_l$."</p>
       $$ o_t \\;=\\; g(s_t), \\qquad s_t \\;=\\; F(s_{t-1},\\, x_t),\\quad \\text{same parameters } (U, V, W) \\text{ at every step} $$
       <p>The recurrent net (Fig. 5): output $o_t$ depends on all previous inputs $x_{t'}$ ($t' \\le t$) through a state $s_t$; "the same parameters (matrices $U, V, W$) are used at each time step," so unrolling it gives "a very deep feedforward network in which all the layers share the same weights." (&sect;RNNs.)</p>
       <p><b>Stated quantities (all quoted, none ours):</b> object nets have "a depth of 5 to 20" non-linear layers (&sect;Backprop); recent ConvNets have "10 to 20 layers of ReLUs, hundreds of millions of weights, and billions of connections" (&sect;Image understanding); ImageNet is "about a million images ... 1,000 different classes," where deep ConvNets were "almost halving the error rates of the best competing approaches" (&sect;Image understanding).</p>`,
    whatItDoes:
      `<p>The first line is the review's whole thesis as a picture, not an equation: a deep net is a <b>chain of
       representations</b>. Each arrow is one learned layer that transforms the representation below it into a
       slightly more abstract one — pixels to edges to motifs to parts to objects, for an image. The final stage
       reads off a label. Nothing in the chain is hand-designed; every arrow's weights are learned by
       backpropagation and stochastic gradient descent. That single picture organizes the entire review.</p>
       <p>The second line is the one concrete formula the review puts in the text: the <b>rectified linear unit</b>,
       $f(z) = \\max(z, 0)$. It is the non-linearity inside each module — the thing that makes the chain more than
       just one big linear map (a stack of purely linear layers collapses to a single linear layer and could only
       "carve their input space into very simple regions", &sect;Supervised learning). The review highlights ReLU
       because it "typically learns much faster in networks with many layers" (&sect;Backprop), which is part of why
       deep nets became trainable. This is a survey, so the math owner for each piece — the chain rule behind
       backprop, the convolution behind ConvNets, the gating behind LSTMs — is the corresponding concept lesson,
       not this page.</p>`,
    derivation:
      `<p>This is a <b>review</b>, so there is no theorem to derive. What the review offers instead is a
       <i>justification</i> for each design choice — the "why this works" in plain words. Three worth holding onto.</p>
       <p><b>Why depth / why non-linearity.</b> A single linear classifier "can only carve [its] input space into
       very simple regions, namely half-spaces separated by a hyperplane." (&sect;Supervised learning.) Real tasks
       need the answer to be invariant to big irrelevant changes (pose, lighting) yet sensitive to tiny important
       ones — the selectivity-invariance dilemma. Stacking non-linear modules (each a neuron with a ReLU) lets the
       network "implement extremely intricate functions of its inputs that are simultaneously sensitive to minute
       details ... and insensitive to large irrelevant variations." (&sect;Backprop.) Depth is what buys that.</p>
       <p><b>Why backprop is just the chain rule.</b> The objective depends on a deep weight only through a long
       chain of intermediate quantities. The chain rule says the gradient through a chain is the product of the
       local gradients. The review's insight is that you can compute this efficiently by "working backwards from the
       gradient with respect to the output of [a] module" to the gradient with respect to its input (&sect;Backprop)
       — one backward sweep gives every weight its gradient. The full line-by-line derivation lives in your
       backpropagation lesson; the review gives the one-sentence reason it is correct.</p>
       <p><b>Why ConvNets match images.</b> Two structural facts about natural signals (&sect;ConvNets): local
       groups of pixels "are often highly correlated, forming distinctive local motifs that are easily detected,"
       and "the local statistics of images and other signals are invariant to location" — a motif can appear
       anywhere. Local connections exploit the first; shared weights (the same filter everywhere) exploit the
       second; and "many natural signals are compositional hierarchies," which is why stacking layers helps. The
       architecture is not arbitrary — it is fitted to the structure of the data.</p>`,
    example:
      `<p>Because this is a survey, the "worked example" is a <b>worked reading</b>: trace one concrete claim from
       the review through the hierarchy it describes, using only the review's own words and numbers.</p>
       <p><b>The image-feature hierarchy (Intro).</b> The review says an image classifier's learned layers build up
       from the bottom; here is its explicit four-level list, lowest layer first, with what each level detects:</p>
       <table class="extable">
        <caption>The review's stated learned hierarchy for an image classifier (Intro) — all four levels named verbatim.</caption>
        <thead><tr><th class="num">level</th><th>learned feature</th><th>built from</th></tr></thead>
        <tbody>
         <tr><td class="num">1 (lowest)</td><td>edges at particular orientations and locations</td><td class="row-h">raw pixels</td></tr>
         <tr><td class="num">2</td><td>motifs — particular arrangements of edges</td><td class="row-h">edges (level 1)</td></tr>
         <tr><td class="num">3</td><td>parts of familiar objects</td><td class="row-h">motifs (level 2)</td></tr>
         <tr><td class="num">4 (highest)</td><td>objects as combinations of parts</td><td class="row-h">parts (level 3)</td></tr>
        </tbody>
       </table>
       <ul class="steps">
        <li><b>Read the order off the table.</b> Each level is built from the one below it, so the network must
        discover <i>edges</i> before <i>motifs</i>, motifs before <i>parts</i>, parts before <i>objects</i> —
        this is the predict-question answer, stated explicitly in the Intro, not inferred.</li>
        <li><b>Connect it to depth.</b> The review notes such systems have "a depth of 5 to 20" non-linear layers
        (&sect;Backprop), and recent ConvNets have "10 to 20 layers of ReLUs, hundreds of millions of weights, and
        billions of connections between units." (&sect;Image understanding.) So the four conceptual steps are spread
        across many layers — each step is several layers of refinement.</li>
        <li><b>Tie it to the headline result.</b> Run that learned hierarchy on ImageNet — "about a million images
        that contained 1,000 different classes" — and deep ConvNets "achieved spectacular results, almost halving
        the error rates of the best competing approaches." (&sect;Image understanding.) The <i>learned</i>
        edge-to-object hierarchy is exactly what beat the hand-engineered feature pipelines.</li>
        <li><b>The one-line takeaway.</b> Every number here — "5 to 20", "10 to 20 layers", "hundreds of millions of
        weights", "about a million images", "1,000 different classes", "almost halving the error rates" — is
        <b>quoted from the review</b>. Nothing is invented or from our own run; a survey has no run of ours.</li>
       </ul>`,
    recipe:
      `<p>A survey has no architecture to assemble. Instead, here is the <b>recipe for reading this review well</b> —
       the sequence that turns nine pages into a durable map:</p>
       <ol>
        <li><b>Read the abstract twice</b> and write its one-sentence definition of what backprop does. Everything
        else hangs off it.</li>
        <li><b>For each main section, name the data type and the architecture.</b> Supervised learning &rarr; the
        general training loop; ConvNets &rarr; images/audio (array data); RNNs &rarr; sequences (text/speech).</li>
        <li><b>Map each section to a concept lesson you can study in depth</b> (the links above): neuron, forward
        prop, gradient descent, backprop, convolution, word embeddings, recurrent nets, LSTM/GRU, unsupervised
        overview. Read the review for the <i>why</i>; read the lesson for the <i>how</i>.</li>
        <li><b>Read the five figures.</b> Figure 1 (backprop), Figure 2 (inside a ConvNet), Figure 3 (image &rarr;
        caption), Figure 4 (the word-vector map), Figure 5 (an RNN unrolled). Each figure is one section in a
        picture.</li>
        <li><b>Treat the final section as opinion.</b> The "future of deep learning" is the authors' bets
        (unsupervised learning, attention, reasoning), not established results — note which ones came true.</li>
        <li><b>Write four sentences from memory afterwards</b>: the thesis, the training algorithm, the two
        architectures, and the main future bet. If you can, you have the paper.</li>
       </ol>`,
    results:
      `<p>A review reports the field's results, not new ones. The quotable headline statements, verbatim with their
       section:</p>
       <p><b>The thesis (Abstract):</b> "Deep learning allows computational models that are composed of multiple
       processing layers to learn representations of data with multiple levels of abstraction. These methods have
       dramatically improved the state-of-the-art in speech recognition, visual object recognition, object detection
       and many other domains such as drug discovery and genomics."</p>
       <p><b>On hand-engineering vs learning (&sect;Backprop):</b> good features "can be learned automatically using a
       general-purpose learning procedure. This is the key advantage of deep learning."</p>
       <p><b>On ConvNets / ImageNet (&sect;Image understanding):</b> applied to "a data set of about a million images
       that contained 1,000 different classes," deep convolutional networks "achieved spectacular results, almost
       halving the error rates of the best competing approaches." Recent ConvNets "have 10 to 20 layers of ReLUs,
       hundreds of millions of weights, and billions of connections between units."</p>
       <p><b>On recurrent nets (&sect;RNNs):</b> training "has proved to be problematic because the backpropagated
       gradients ... typically explode or vanish"; LSTM units were designed "to remember inputs for a long time."</p>
       <p><b>On the future (&sect;Future):</b> "we expect unsupervised learning to become far more important in the
       longer term"; ultimately "major progress in artificial intelligence will come about through systems that
       combine representation learning with complex reasoning."</p>
       <p><i>All statements and numbers above are transcribed verbatim from the review (LeCun, Bengio & Hinton,
       Nature 521, 2015). There is no CODEVIZ panel of our own numbers, because a survey gives us nothing of our own
       to measure.</i></p>`,

    evaluation:
      `<p>This is a <b>read-only survey</b>: there is no system of your own to train, so there is no loss curve or
       held-out metric to compute here. "Working" means two different things — your <b>understanding</b> of the map is
       correct, and the <b>concept-lesson builds</b> the review points to actually run. Evaluate both.</p>
       <ul>
        <li><b>The metric &amp; benchmark.</b> For the <i>reading</i>, the check is a closed-book recall test: can you
        reproduce the review's spine — one idea (representation learning), one engine (backprop), two families
        (ConvNets for arrays, recurrent nets for sequences) — and its quoted numbers <b>with attribution</b>? The
        "no-skill baseline" is paraphrase without sourcing: if you state "almost halving the error rates" as a fact
        rather than as the review's ImageNet figure, you have failed the attribution bar. For the <i>methods</i> the
        review maps, the real metrics live in their own lessons (e.g. top-1/top-5 error on ImageNet for ConvNets,
        word error rate for speech, perplexity for language models) — not here.</li>
        <li><b>Sanity checks BEFORE a deep read.</b> (1) <b>Order the image hierarchy</b> from the predict question —
        edges &rarr; motifs &rarr; parts &rarr; objects — and confirm it against the review's explicit Intro list; if
        you put parts before edges, you have inverted the compositional argument. (2) <b>Match each section to its
        data type and architecture</b> in one pass (ConvNets &rarr; images/audio; RNNs &rarr; text/speech) — a cheap
        test that catches "deep learning = ConvNets." (3) <b>Re-derive the one equation the review writes</b>: the
        ReLU $f(z)=\\max(z,0)$ and the Fig. 1 backward pass $\\partial E/\\partial z_l = \\partial E/\\partial y_l\\,
        f'(z_l)$ — if these don't read as "just the chain rule," re-read &sect;Backprop.</li>
        <li><b>Expected range.</b> The only numbers to anchor to are the review's own quoted figures (reuse
        <i>results</i>): object nets of "a depth of 5 to 20" non-linear layers; recent ConvNets with "10 to 20 layers
        of ReLUs, hundreds of millions of weights"; ImageNet as "about a million images ... 1,000 different classes"
        where deep ConvNets were "almost halving the error rates of the best competing approaches." These are the
        review's reported figures, not measurements of ours — never present them as freshly produced here. There is no
        approximate target of our own because there is no run of our own.</li>
        <li><b>Ablation — the survey's version.</b> A review has no component to switch off; the analogue is to read
        the closing &sect;Future <b>critically</b>, treating each forecast as a bet and asking which the next decade
        confirmed. The strongest bet — "we expect unsupervised learning to become far more important in the longer
        term" — and the <b>attention</b> bet ("strategies for selectively attending to one part at a time") both pay
        off; flagging which bets came true is the test that you read the section as forecast, not as established
        result.</li>
        <li><b>Failure signals &amp; what they mean.</b> If you find yourself looking for "the equation to reproduce"
        or an <code>allclose</code> to pass, you are treating a survey like a method paper — the deliverable is the
        map, not an implementation. If you quote "1,000 classes" or "almost halving the error rates" without saying
        "the review reports," you have dropped attribution (invent nothing). If you cite the &sect;Future bets as facts,
        you have mistaken 2015 opinion for result. And if you cannot, from memory, name the single training algorithm
        and the two architecture families, you have not yet absorbed the spine — re-read the abstract.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>read-only survey</b>: there is nothing to implement. There is no PyTorch primitive to
       rebuild and no novel module to compose — the review's job is to <i>map</i> a field, and your job is to
       <i>read</i> it and place each piece. What you "build" is the map itself: connect every section to the concept
       lesson that teaches its math (backprop, convolution, recurrent nets, LSTM, word embeddings, unsupervised
       learning). The individual methods are built from scratch or composed in <b>their own</b> lessons; here you
       only need to understand how they fit together and why each one earns its place in the story. There is
       therefore no code cell and no plot of our own data below.</p>`,
    pitfalls:
      `<ul>
        <li><b>Treating a survey like a method paper.</b> There is no single equation to reproduce and no
        allclose to pass. The deliverable is the <i>map</i>, not an implementation. <b>Fix:</b> read for the
        connections and the vocabulary; build the pieces in their own lessons.</li>
        <li><b>Quoting the review's numbers as if they were freshly measured here.</b> Every number ("about a
        million images", "1,000 different classes", "almost halving the error rates", "5 to 20" layers) is the
        review's own reported figure. <b>Fix:</b> always attribute — "the review states ...". Invent nothing.</li>
        <li><b>Mistaking the final section for fact.</b> "The future of deep learning" is the authors' opinion as of
        2015 — bets on unsupervised learning, attention, and reasoning. Some panned out; it is not a result.
        <b>Fix:</b> read it as forecast, and note which bets the next decade confirmed.</li>
        <li><b>Reading "deep learning = ConvNets".</b> The review is explicit that ConvNets are for array data
        (images, audio) and recurrent nets for sequences (text, speech). They are two families with one shared
        training algorithm. <b>Fix:</b> keep the data-type &rarr; architecture mapping straight.</li>
        <li><b>Skipping the figures.</b> Figures 1-5 each compress a whole section into one picture (backprop,
        inside a ConvNet, image-to-caption, the word-vector map, an unrolled RNN). <b>Fix:</b> read each figure with
        its section.</li>
      </ul>`,
    recall: [
      "State the review's one-sentence thesis: what does deep learning use the backpropagation algorithm to do? (Abstract.)",
      "Contrast the OLD pipeline (hand-engineered feature extractor) with representation learning. What does the review call learning features automatically?",
      "Name the single training algorithm and the two architecture families, and one data type each is for.",
      "What is the recurrent-network training problem the review names, and what fix does it highlight?",
      "What does the closing section bet will become \"far more important in the longer term\", and why?"
    ],
    practice: [
      {
        q: `<b>The image hierarchy.</b> The review says an image classifier learns a hierarchy of features across its
            layers. List the four levels in the order the network builds them, lowest layer first, and explain in one
            sentence why this order (not the reverse) is the one the network discovers.`,
        steps: [
          { do: `Recall the review's explicit list (Intro): edges &rarr; motifs (arrangements of edges) &rarr; parts of familiar objects &rarr; objects (combinations of parts).`, why: `The review states all four levels by name; this is transcription, not inference.` },
          { do: `Tie the order to composition: each level is built by combining the level below it.`, why: `A "part" is a particular arrangement of motifs, and a motif is a particular arrangement of edges — you cannot detect a part before you can detect the edges it is made of.` },
          { do: `Connect to the thesis: this is "representation learning" — the levels "are not designed by human engineers: they are learned from data."`, why: `The whole point of the review is that this hierarchy is discovered automatically, not hand-coded.` }
        ],
        answer: `<p>Lowest to highest: <b>edges</b> at particular orientations/locations &rarr; <b>motifs</b>
                 (arrangements of edges) &rarr; <b>parts</b> of familiar objects &rarr; whole <b>objects</b>
                 (combinations of parts). (Intro.) The order is forced by composition: each level is built out of the
                 one below, so edges must be available before motifs, motifs before parts, parts before objects. And
                 the review's headline point is that the network <i>learns</i> this hierarchy itself — these layers
                 "are not designed by human engineers: they are learned from data using a general-purpose learning
                 procedure." (Intro.)</p>`
      },
      {
        q: `<b>One algorithm, two architectures.</b> The abstract claims a single training algorithm and two
            architecture families. Name them, give one data type each architecture targets, and state why the same
            training algorithm can train both — including the recurrent case.`,
        steps: [
          { do: `Name the algorithm: backpropagation (with stochastic gradient descent). Name the two families: convolutional nets and recurrent nets.`, why: `The abstract is explicit: backprop trains everything; "deep convolutional nets ... for ... images, video, speech and audio, whereas recurrent nets ... [for] sequential data such as text and speech."` },
          { do: `Map data types: ConvNets &rarr; array data (images, audio spectrograms); RNNs &rarr; sequences (text, speech).`, why: `ConvNets exploit local correlation and location-invariance of array data; RNNs carry a state vector across sequence steps.` },
          { do: `Explain the recurrent case: an RNN unrolled in time "can be seen as a very deep feedforward network in which all the layers share the same weights", so backprop applies directly.`, why: `Unrolling turns a recurrent net into a (weight-shared) feedforward net, which is exactly what backprop trains.` }
        ],
        answer: `<p>The algorithm is <b>backpropagation</b> (trained with stochastic gradient descent). The two
                 families are <b>convolutional networks</b> — for array data such as images and audio — and
                 <b>recurrent networks</b> — for sequences such as text and speech. (Abstract.) The same algorithm
                 trains both because every model is a stack of differentiable modules, so the chain rule gives every
                 weight a gradient; for a recurrent net you first unroll it in time, which "can be seen as a very
                 deep feedforward network in which all the layers share the same weights" (&sect;RNNs), and then run
                 ordinary backprop on that unrolled net.</p>`
      },
      {
        q: `<b>Reading the outlook critically (the survey's ablation).</b> The closing section lists the authors'
            bets for the future. State the main bet and its stated reason, then — as the "ablation" — assess it with
            hindsight: name one bet that clearly came true and explain why the survey was right to flag it.`,
        steps: [
          { do: `Quote the main bet: "we expect unsupervised learning to become far more important in the longer term," because "human and animal learning is largely unsupervised."`, why: `This is the review's single strongest forecast, stated as opinion in the future section.` },
          { do: `Identify a clearly-confirmed bet: attention — the review expects RNNs that learn "strategies for selectively attending to one part at a time."`, why: `Selective attention is named explicitly as a future direction, and attention-based models did become central shortly after.` },
          { do: `Assess: the review flagged attention because RNNs struggled to carry information over long sequences (exploding/vanishing gradients), so a mechanism to focus on the relevant part directly addresses a problem the survey itself diagnosed.`, why: `A good forecast points at a known bottleneck; attention targets exactly the long-range-dependency problem the RNN section describes.` }
        ],
        answer: `<p>The main bet: <b>unsupervised learning</b> will "become far more important in the longer term,"
                 with the reason that "human and animal learning is largely unsupervised." (&sect;Future.) A bet that
                 clearly came true is <b>attention</b> — the review expects RNNs that learn "strategies for
                 selectively attending to one part at a time." (&sect;Future.) The survey was right to flag it
                 because it had just diagnosed the matching bottleneck: recurrent nets' backpropagated gradients
                 "explode or vanish" over long sequences (&sect;RNNs), so a mechanism that lets a model focus
                 directly on the relevant part attacks exactly that long-range-dependency problem. (As always, treat
                 this section as forecast, not result — these are the authors' 2015 bets.)</p>`
      }
    ]
  });

  window.CODE["paper-deep-learning-survey"] = {
    lib: "—",
    runnable: false,
    explain:
      `<p>This is a <b>read-only survey</b>, so there is <b>no code</b> to run, train, or verify — and nothing to
       reproduce, because the review reports the field's results rather than a single experiment of its own. The one
       concrete formula the review puts in its text is the rectified linear unit (ReLU), $f(z) = \\max(z, 0)$, the
       non-linearity inside each module; you build and verify activations like it in the activations / forward-prop
       concept lessons, not here. To actually implement the methods this review maps, follow the linked concept
       lessons — backprop, convolution, recurrent nets, LSTM/GRU, word embeddings — each of which has its own
       runnable code. There is deliberately no snippet and no plot below.</p>`,
    code: ""
  };

  // CODEVIZ intentionally minimal: a survey has no run of our own to plot, and every
  // number in this lesson is QUOTED from the review with attribution. The page
  // renderer (codeVizBlock in index.html) returns "" when charts is empty, so this
  // object renders nothing — the correct, honest choice for a read-only review.
  window.CODEVIZ["paper-deep-learning-survey"] = {
    question: "",
    charts: [],
    caption: "No chart: this is a survey, so there is no run of our own to plot. Every figure in the lesson (\"about a million images\", \"1,000 different classes\", \"almost halving the error rates\", \"5 to 20\" / \"10 to 20\" layers) is quoted directly from LeCun, Bengio & Hinton, Nature 521 (2015). To see the methods the review maps in action, run the linked concept lessons (backprop, convolution, recurrent nets, LSTM).",
    code: ""
  };
})();
