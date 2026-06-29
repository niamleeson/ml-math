/* Paper lesson — "Universal Language Model Fine-tuning for Text Classification" (ULMFiT),
   Howard & Ruder, 2018.
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-ulmfit".
   GROUNDED from arXiv:1801.06146 (abstract) and the ar5iv HTML mirror
   (§3.1 discriminative fine-tuning Eqns 1-2, §3.1 STLR Eqn 3, §3.1 gradual unfreezing,
   §3.3 concat pooling, §4 results Tables 2-3 & Fig 3).
   Track B (architecture): pretrain a tiny LSTM language model, transfer its encoder, then
   fine-tune a classifier with the THREE tricks (discriminative lr, slanted triangular LR,
   gradual unfreezing) by hand on top of nn.LSTM / nn.Embedding. Transfer-learning math lives
   in concept fs-transfer-learning; here we recap. */
(function () {
  window.LESSONS.push({
    id: "paper-ulmfit",
    title: "ULMFiT — Universal Language Model Fine-tuning for Text Classification (2018)",
    tagline: "Pretrain a language model on raw text, then fine-tune it for classification with three tricks — ImageNet-style transfer learning, finally working for NLP.",
    module: "Papers · Sequence & NLP",
    track: "architecture",
    paper: {
      authors: "Jeremy Howard, Sebastian Ruder",
      org: "fast.ai / University of San Francisco; Insight Centre, NUI Galway / Aylien",
      year: 2018,
      venue: "arXiv:1801.06146 (Jan 2018); ACL 2018",
      citations: "",
      arxiv: "https://arxiv.org/abs/1801.06146",
      code: "http://nlp.fast.ai/ulmfit"
    },
    conceptLink: "fs-transfer-learning",
    partOf: [],
    prereqs: ["fs-transfer-learning", "dl-lstm-gru"],

    // WHY READ IT
    problem:
      `<p>By 2018, <b>transfer learning</b> &mdash; train a big model once on a giant generic dataset, then
       reuse it for many specific tasks &mdash; had transformed computer vision: nearly everyone started from
       an ImageNet-pretrained network and fine-tuned. Natural Language Processing (NLP) had not caught up. The
       paper opens (&sect;1):</p>
       <blockquote>"Inductive transfer learning has greatly impacted computer vision &hellip; existing
       approaches in NLP still require task-specific modifications and training from scratch."</blockquote>
       <p>The pieces existed &mdash; a <b>language model</b> (LM), a network trained to predict the next word,
       captures a lot about a language &mdash; but naive fine-tuning of an LM on a small labeled task failed:
       it would <b>catastrophically forget</b> what pretraining taught (overwrite the useful general
       knowledge) or <b>overfit</b> the few labels. People believed LM fine-tuning "required millions of
       in-domain documents" to work. The question this paper answers: what is the right <i>recipe</i> to
       fine-tune a pretrained language model so the general knowledge survives?</p>`,
    contribution:
      `<ul>
        <li><b>ULMFiT, a universal recipe.</b> One transfer method &mdash; pretrain an LM, fine-tune the LM
        on the target text, then fine-tune a classifier &mdash; that works "for any task in NLP" with no
        task-specific architecture changes (&sect;1).</li>
        <li><b>Three fine-tuning tricks</b> that keep the pretrained knowledge from being destroyed (&sect;3):
        <b>discriminative fine-tuning</b> (a different learning rate per layer), <b>slanted triangular
        learning rates</b> (warm up fast, then decay slowly), and <b>gradual unfreezing</b> (thaw layers from
        the top down, one at a time).</li>
        <li><b>State-of-the-art results with few labels.</b> It "significantly outperforms the
        state-of-the-art on six text classification tasks, reducing the error by 18-24% on the majority of
        datasets," and "with only 100 labeled examples, it matches the performance of training from scratch on
        100x more data" (abstract).</li>
      </ul>`,
    whyItMattered:
      `<p>ULMFiT was the proof, just before BERT and GPT, that the <b>pretrain-then-fine-tune</b> paradigm
       works for language: a model trained once on raw unlabeled text transfers to downstream tasks. The very
       next year that idea, scaled up with Transformers instead of LSTMs, became BERT and GPT and the entire
       large-language-model era. The specific tricks live on too: <b>discriminative / layer-wise learning
       rates</b> and <b>warmup-then-decay learning-rate schedules</b> are standard fine-tuning practice today,
       and <b>gradual unfreezing</b> reappears whenever you adapt a big pretrained model on little data.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;1 (Introduction)</b> &mdash; the CV-analogy framing and the three-stage pipeline.</li>
        <li><b>&sect;3 (Universal Language Model Fine-tuning)</b> &mdash; the heart. &sect;3.1 holds all three
        tricks and their equations: <b>discriminative fine-tuning</b> (Eqns 1-2), <b>slanted triangular
        learning rates</b> (Eqn 3, and Fig. 2), and <b>gradual unfreezing</b>.</li>
        <li><b>&sect;3.3</b> &mdash; <b>concat pooling</b> for the classifier head, and how the two extra
        linear blocks are added on top of the pretrained encoder.</li>
        <li><b>Fig. 2</b> &mdash; the slanted-triangular learning-rate curve (sharp rise, long linear decay).
        <b>Fig. 3</b> &mdash; ULMFiT vs from-scratch as you vary the number of labeled examples.</li>
       </ul>
       <p><b>Skim:</b> the AWD-LSTM details (it is a pretrained black box you reuse), &sect;4's per-dataset
       tables beyond the headline numbers, and the analysis ablations once you have the three tricks.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You have a tiny labeled text-classification set &mdash; only ~20 examples. You will train two
       classifiers on it: <b>(A)</b> one whose encoder was <b>pretrained as a language model</b> on lots of
       unlabeled text from the same domain, then fine-tuned with the three tricks; <b>(B)</b> one trained
       <b>from scratch</b> (random encoder, plain fine-tuning). On held-out test accuracy, do you expect A to
       beat B by a <b>little</b>, beat it by a <b>lot</b>, or roughly <b>tie</b>? Write your guess.</p>
       <p>Then a sharper question for the <b>ablation</b>: take the pretrained encoder but fine-tune it
       <i>without</i> the three tricks (one global learning rate, no unfreezing). Where does that land &mdash;
       up with A, down with B, or in between?</p>`,
    attempt:
      `<p>Before the reveal, sketch the three tricks you will implement. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li><b>Discriminative fine-tuning.</b> Two parameter groups: the <code>head</code> (last layer) and
        the <code>encoder</code> (lower layers). TODO: give the head learning rate <code>base</code> and the
        encoder <code>base / 2.6</code> &mdash; lower layers learn <i>slower</i>.</li>
        <li><b>Slanted triangular learning rates (STLR).</b> TODO: write <code>stlr(t, T)</code> that returns
        a small rate, rises linearly to <code>eta_max</code> at <code>t = cut</code>, then decays linearly
        (Eqn 3). Multiply every group's rate by this schedule each step.</li>
        <li><b>Gradual unfreezing.</b> TODO: freeze the encoder for the first phase (train only the head),
        then <code>encoder.requires_grad_(True)</code> to thaw it for the rest.</li>
       </ul>
       <p>Then build the matched <b>from-scratch</b> baseline (random encoder, single learning rate, no
       unfreeze) and the <b>ablation</b> (pretrained encoder, but tricks off). Predict the ordering.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>ULMFiT is a <b>three-stage pipeline</b> (&sect;3). <b>Stage 1 &mdash; general-domain LM
       pretraining:</b> train a language model (the paper uses the <b>AWD-LSTM</b> &mdash; an LSTM language
       model with heavy dropout regularization &mdash; with an embedding size of 400, <b>3 LSTM layers</b>,
       and 1150 hidden units per layer) on a large generic corpus (Wikitext-103) to predict the next word.
       This is done <i>once</i> and reused. <b>Stage 2 &mdash; target-task LM fine-tuning:</b> keep training
       that same LM on the <i>target task's</i> raw text (no labels needed) so it adapts to the target
       vocabulary and style. <b>Stage 3 &mdash; classifier fine-tuning:</b> attach a small classifier head and
       train on the labeled examples.</p>
       <p>The danger throughout Stages 2-3 is destroying the pretrained knowledge. The paper's three tricks
       (&sect;3.1) all manage that risk:</p>
       <p><b>1. Discriminative fine-tuning.</b> Different layers capture different kinds of information:
       lower layers hold general features that should barely move, upper layers hold task-specific features
       that should adapt more. So instead of one global learning rate, give <b>each layer its own</b>: a
       larger rate for the top layer, a smaller one for each layer below. The paper sets the last layer's rate
       $\\eta^L$ by hand, then uses $\\eta^{l-1} = \\eta^l / 2.6$ for every lower layer &mdash; each layer down
       moves at $1/2.6 \\approx 0.385$ the rate of the one above it.</p>
       <p><b>2. Slanted triangular learning rates (STLR).</b> The schedule (Eqn 3) <b>increases the learning
       rate linearly</b> for a short initial fraction of training, then <b>decays it linearly</b> over the
       long remainder (Fig. 2). The quick rise lets the model first find a good region of parameter space; the
       long slow decay then refines within it without bouncing out.</p>
       <p><b>3. Gradual unfreezing.</b> Do not unfreeze every layer at once &mdash; that risks catastrophic
       forgetting. "We first unfreeze the last layer and fine-tune all unfrozen layers for one epoch. We then
       unfreeze the next lower frozen layer and repeat &hellip; until we fine-tune all layers until
       convergence." Top-down thawing, one layer per epoch.</p>
       <p>For the classifier head (&sect;3.3) the paper adds two extra linear blocks on top of the encoder and
       feeds them <b>concat pooling</b>: it concatenates the hidden state at the <i>last</i> time step with
       both the <b>max-pooled</b> and the <b>mean-pooled</b> hidden states over the sequence &mdash; so no
       signal from any position is lost when a document is squeezed into one vector.</p>`,
    architecture:
      `<p><b>The reused backbone: AWD-LSTM language model (&sect;3, Merity et al. 2017).</b> ULMFiT's encoder
       is a 3-layer <b>LSTM</b> (a recurrent net that carries a memory cell across time steps) wrapped in heavy
       dropout regularization &mdash; the "AWD" = ASGD Weight-Dropped. Concrete dimensions the paper uses:</p>
       <ul>
        <li><b>Embedding layer:</b> <code>nn.Embedding(V, 400)</code> &mdash; each token id maps to a
        <b>400-dimensional</b> vector ($V$ = vocabulary size).</li>
        <li><b>3 stacked LSTM layers</b>, <b>1150 hidden units</b> each (the middle layer outputs 1150, the top
        layer projects back to 400 to tie with the embedding). Data flows
        embedding (400) &rarr; LSTM&#8321; (1150) &rarr; LSTM&#8322; (1150) &rarr; LSTM&#8323; (400), producing one hidden
        state $\\mathbf{h}_t$ per time step.</li>
        <li><b>Five dropout knobs</b> (the AWD regularization): embedding dropout 0.05, input dropout 0.4,
        weight-drop on the recurrent weights 0.5, hidden/between-layer dropout 0.3, and output dropout 0.4.
        Trained with <b>BPTT</b> (backprop through time) over windows of length 70.</li>
       </ul>
       <p><b>Stage-1/2 LM head:</b> a single <b>tied</b> linear decoder $\\mathbf{W}$ of shape
       $(400 \\to V)$ that turns each hidden state into a next-token distribution via softmax (weight-tied to the
       embedding matrix). This head is used for next-word prediction during pretraining (Stage 1) and
       target-text LM fine-tuning (Stage 2), then <b>discarded</b>.</p>
       <p><b>Stage-3 classifier head (&sect;3.3):</b> the LM decoder is replaced by two extra linear blocks on
       top of the encoder, fed by <b>concat pooling</b>:</p>
       <ul>
        <li><b>Concat pooling</b> &mdash; collapse the sequence of hidden states $H$ into one vector
        $\\mathbf{h}_c = [\\mathbf{h}_T,\\ \\operatorname{maxpool}(H),\\ \\operatorname{meanpool}(H)]$, of width
        $3\\times$ the hidden size.</li>
        <li><b>Block 1:</b> Linear &rarr; <b>BatchNorm</b> &rarr; <b>Dropout</b> &rarr; <b>ReLU</b> (intermediate
        nonlinear layer).</li>
        <li><b>Block 2:</b> Linear &rarr; BatchNorm &rarr; Dropout &rarr; <b>Softmax</b> over the class labels.</li>
       </ul>
       <p>So the full Stage-3 graph is: tokens &rarr; Embedding(400) &rarr; 3&times;LSTM &rarr; concat pooling
       (3&times;hidden) &rarr; linear+BN+ReLU block &rarr; linear+BN+softmax &rarr; class probabilities. Only this
       head is randomly initialized; everything below it is transferred from the LM. (Our notebook uses a plain
       <code>nn.LSTM</code> with smaller dimensions and a 2-linear ReLU head &mdash; same wiring, no AWD dropout
       machinery.)</p>`,
    symbols: [
      { sym: "$\\theta$", desc: "the model's <b>parameters</b> (all its weights) &mdash; the numbers gradient descent updates." },
      { sym: "$\\theta_t$", desc: "the parameters <b>at training iteration $t$</b>; $\\theta_{t-1}$ are the previous step's." },
      { sym: "$\\eta$", desc: "the <b>learning rate</b>: how big a step each update takes along the gradient." },
      { sym: "$\\nabla_\\theta J(\\theta)$", desc: "the <b>gradient</b> of the loss $J$ with respect to the parameters &mdash; the direction (and steepness) of steepest increase of the loss." },
      { sym: "$\\theta^l$", desc: "the parameters of <b>layer $l$</b> only. ULMFiT splits $\\theta$ into per-layer chunks $\\theta^1, \\dots, \\theta^L$ so each can have its own rate." },
      { sym: "$\\eta^l$", desc: "the <b>per-layer learning rate</b> for layer $l$ (discriminative fine-tuning). The paper picks $\\eta^L$ for the top layer, then sets $\\eta^{l-1} = \\eta^l/2.6$ going down." },
      { sym: "$L$", desc: "the <b>number of layers</b>; layer $L$ is the topmost (closest to the output), layer $1$ the lowest (closest to the input)." },
      { sym: "$2.6$", desc: "the empirically chosen <b>decay factor</b> between consecutive layers' rates: each lower layer learns at $1/2.6 \\approx 0.385\\times$ the rate above it." },
      { sym: "$T$", desc: "the total <b>number of training iterations</b> (update steps) over which the STLR schedule runs." },
      { sym: "$\\mathit{cut\\_frac}$", desc: "the <b>fraction of iterations</b> spent ramping the learning rate UP before it starts decaying. Default $0.1$ (the first 10%)." },
      { sym: "$\\mathit{cut}$", desc: "the iteration at which the rate stops rising and starts falling: $\\mathit{cut} = \\lfloor T \\cdot \\mathit{cut\\_frac} \\rfloor$ (the floor, i.e. round down to a whole step)." },
      { sym: "$p$", desc: "the <b>progress fraction</b> $\\in [0,1]$ along the current phase: rising toward 1 before $\\mathit{cut}$, falling back toward 0 after it." },
      { sym: "$\\mathit{ratio}$", desc: "how many times <b>smaller the lowest rate is than the peak</b>: the schedule's minimum is $\\eta_{max}/\\mathit{ratio}$. Default $32$." },
      { sym: "$\\eta_{max}$", desc: "the <b>peak learning rate</b>, reached exactly at iteration $\\mathit{cut}$. Default $0.01$." },
      { sym: "$\\eta_t$", desc: "the <b>learning rate at iteration $t$</b> produced by the STLR schedule." },
      { sym: "$\\mathbf{h}_t$", desc: "the LSTM's <b>hidden state at time step $t$</b> &mdash; the encoder's vector summary of the sequence up to position $t$." },
      { sym: "$\\mathbf{h}_T$", desc: "the hidden state at the <b>last</b> time step $T$ (the end of the document); one of the three pieces concat pooling keeps." },
      { sym: "$H$", desc: "the full <b>set of hidden states</b> $\\{\\mathbf{h}_1,\\dots,\\mathbf{h}_T\\}$ over the whole sequence, the input to max- and mean-pooling." },
      { sym: "$\\mathbf{h}_c$", desc: "the <b>concat-pooled document vector</b> (&sect;3.3): $[\\mathbf{h}_T,\\ \\operatorname{maxpool}(H),\\ \\operatorname{meanpool}(H)]$, fed to the classifier head; width $3\\times$ the hidden size." },
      { sym: "$\\operatorname{maxpool}/\\operatorname{meanpool}$", desc: "element-wise <b>max</b> / <b>mean</b> of the hidden states across all time steps &mdash; capture the strongest and the average signal in the sequence." },
      { sym: "$V$", desc: "the <b>vocabulary size</b>: number of distinct tokens; the LM decoder outputs a distribution over these $V$ tokens." },
      { sym: "“catastrophic forgetting”", desc: "a plain term, not a symbol: when fine-tuning overwrites the useful general knowledge the model gained in pretraining. The three tricks exist to prevent it." },
      { sym: "“concat pooling”", desc: "a plain term (&sect;3.3): forming the document vector by concatenating the last hidden state with the max-pooled and mean-pooled hidden states over the sequence." }
    ],
    formula: `$$ \\theta_{t} = \\theta_{t-1} - \\eta\\,\\nabla_{\\theta} J(\\theta) $$
              <p class="cap">Eqn. 1 (&sect;3.1) — ordinary SGD: one global learning rate $\\eta$ for every parameter.</p>
              $$ \\theta^{l}_{t} = \\theta^{l}_{t-1} - \\eta^{l}\\,\\nabla_{\\theta^{l}} J(\\theta), \\qquad \\eta^{l-1} = \\eta^{l}/2.6 $$
              <p class="cap">Eqn. 2 (&sect;3.1) — discriminative fine-tuning: split $\\theta$ per layer $l$; each layer gets its own rate $\\eta^l$, with the heuristic that each lower layer learns $2.6\\times$ slower.</p>
              $$ \\mathit{cut} = \\left\\lfloor T\\cdot \\mathit{cut\\_frac}\\right\\rfloor,\\quad
                 p = \\begin{cases} t/\\mathit{cut}, & t \\lt \\mathit{cut}\\\\[4pt]
                 1 - \\dfrac{t-\\mathit{cut}}{\\mathit{cut}\\,(1/\\mathit{cut\\_frac}-1)}, & \\text{otherwise}\\end{cases},\\quad
                 \\eta_t = \\eta_{max}\\cdot\\dfrac{1 + p\\,(\\mathit{ratio}-1)}{\\mathit{ratio}} $$
              <p class="cap">Eqn. 3 (&sect;3.1) — slanted triangular learning rates: $\\eta_t$ rises linearly to $\\eta_{max}$ at iteration $\\mathit{cut}$, then decays linearly. Defaults $\\mathit{cut\\_frac}=0.1$, $\\mathit{ratio}=32$, $\\eta_{max}=0.01$.</p>
              $$ \\mathbf{h}_c = \\left[\\,\\mathbf{h}_T,\\ \\operatorname{maxpool}(H),\\ \\operatorname{meanpool}(H)\\,\\right] $$
              <p class="cap">Concat pooling (&sect;3.3) — the document vector $\\mathbf{h}_c$ concatenates the last hidden state $\\mathbf{h}_T$ with the max- and mean-pooled hidden states over the sequence $H=\\{\\mathbf{h}_1,\\dots,\\mathbf{h}_T\\}$, so no positional signal is lost.</p>`,
    whatItDoes:
      `<p><b>Equation 2 (discriminative fine-tuning)</b> is just ordinary gradient descent
       $\\theta_t = \\theta_{t-1} - \\eta\\,\\nabla_\\theta J(\\theta)$ (Eqn 1) <i>split per layer</i>: each layer
       $l$ uses its own learning rate $\\eta^l$. Set the top layer's $\\eta^L$, then $\\eta^{l-1}=\\eta^l/2.6$
       so each lower layer takes a step $2.6\\times$ smaller &mdash; general features barely move, task features
       adapt.</p>
       <p><b>Equation 3 (STLR)</b> builds the learning rate as a function of the step $t$. $\\mathit{cut}$ is
       where the ramp ends. Before it, $p = t/\\mathit{cut}$ rises from 0 to 1; after it, $p$ falls linearly
       back toward 0 over the remaining $(T-\\mathit{cut})$ steps. The final line maps $p$ to a rate: at $p=1$
       (the peak, $t=\\mathit{cut}$) you get $\\eta_t = \\eta_{max}$; at $p=0$ (start and end) you get
       $\\eta_{max}/\\mathit{ratio}$. So the curve climbs sharply to $\\eta_{max}$, then glides down to
       $\\eta_{max}/\\mathit{ratio}$ &mdash; the "slanted triangle" of Fig. 2.</p>`,
    derivation:
      `<p><b>Short recap &mdash; the transfer-learning principle lives in the concept lesson.</b> Why does a
       per-layer schedule beat a single global rate? Because the layers of a pretrained network are <i>not</i>
       equally trustworthy for a new task. Lower layers learned broadly useful structure (in vision: edges and
       textures; in language: syntax and common word patterns) that should be <b>preserved</b>; upper layers
       learned features tied to the pretraining objective that must be <b>re-purposed</b>. A single learning
       rate forces one compromise on all of them &mdash; large enough to adapt the top, and it shreds the
       bottom (catastrophic forgetting); small enough to protect the bottom, and the top never adapts.
       Discriminative rates resolve the tension: big at the top, geometrically smaller going down
       ($\\eta^{l-1}=\\eta^l/2.6$).</p>
       <p>STLR adds the time dimension. The brief linear <b>ramp-up</b> lets the freshly-attached, randomly
       initialized head produce sensible gradients before the rate gets large, avoiding a destructive early
       jolt to the pretrained weights; the long linear <b>decay</b> then settles into a good minimum. Gradual
       unfreezing applies the same conservatism layer by layer: train the safe new head first, thaw the rest
       only once the top is reasonable. The general "reuse lower layers, adapt upper layers, protect what
       pretraining gave you" argument is developed in full in the <b>fs-transfer-learning</b> concept lesson
       &mdash; we only recap it here.</p>`,
    example:
      `<p><b>(a) STLR (Eqn 3).</b> Take $T = 1000$ iterations and the paper's defaults
       $\\mathit{cut\\_frac}=0.1$, $\\mathit{ratio}=32$, $\\eta_{max}=0.01$. First the cut point:
       $\\mathit{cut} = \\lfloor 1000 \\cdot 0.1 \\rfloor = \\lfloor 100 \\rfloor = 100$.</p>
       <ul class="steps">
        <li><b>At the very start, $t=0$:</b> $p = t/\\mathit{cut} = 0/100 = 0$, so
        $\\eta_0 = 0.01\\cdot\\dfrac{1 + 0\\cdot(32-1)}{32} = 0.01\\cdot\\dfrac{1}{32} \\approx \\mathbf{0.000313}$
        &mdash; the floor $\\eta_{max}/\\mathit{ratio}$.</li>
        <li><b>Halfway up, $t=50$:</b> $p = 50/100 = 0.5$, so
        $\\eta_{50} = 0.01\\cdot\\dfrac{1 + 0.5\\cdot 31}{32} = 0.01\\cdot\\dfrac{16.5}{32} \\approx \\mathbf{0.005156}$.</li>
        <li><b>At the peak, $t=100$:</b> $p = 100/100 = 1$, so
        $\\eta_{100} = 0.01\\cdot\\dfrac{1 + 1\\cdot 31}{32} = 0.01\\cdot\\dfrac{32}{32} = \\mathbf{0.01}$ &mdash;
        exactly $\\eta_{max}$, as designed.</li>
        <li><b>In the decay, $t=200$:</b> $p = 1 - \\dfrac{200-100}{100\\,(1/0.1 - 1)} = 1 - \\dfrac{100}{900}
        \\approx 0.8889$, so $\\eta_{200} = 0.01\\cdot\\dfrac{1 + 0.8889\\cdot 31}{32} \\approx \\mathbf{0.008924}$
        &mdash; already gently coming down from the peak.</li>
       </ul>
       <table class="extable">
        <caption>STLR schedule, $T=1000$ ($\\mathit{cut}=100$), $\\mathit{cut\\_frac}=0.1$, $\\mathit{ratio}=32$, $\\eta_{max}=0.01$.</caption>
        <thead><tr><th>step $t$</th><th class="num">$p$</th><th class="num">$\\eta_t$</th><th>phase</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$0$</td><td class="num">$0$</td><td class="num">$0.000313$</td><td>floor (ramp start)</td></tr>
         <tr><td class="row-h">$50$</td><td class="num">$0.5$</td><td class="num">$0.005156$</td><td>ramping up</td></tr>
         <tr><td class="row-h">$100$</td><td class="num">$1$</td><td class="num">$0.010000$</td><td>peak $=\\eta_{max}$</td></tr>
         <tr><td class="row-h">$200$</td><td class="num">$0.8889$</td><td class="num">$0.008924$</td><td>decaying</td></tr>
        </tbody>
       </table>
       <p><b>(b) Discriminative learning rates (Eqn 2).</b> Suppose the top layer's rate is $\\eta^L = 0.01$
       and there are 4 layers, using $\\eta^{l-1} = \\eta^l/2.6$ &mdash; divide by $2.6$ each step down:</p>
       <ul class="steps">
        <li>Layer $L$ (top): $\\eta^L = 0.01$.</li>
        <li>Layer $L\\!-\\!1$: $0.01/2.6 \\approx \\mathbf{0.003846}$.</li>
        <li>Layer $L\\!-\\!2$: $0.003846/2.6 \\approx \\mathbf{0.001479}$.</li>
        <li>Layer $L\\!-\\!3$ (bottom): $0.001479/2.6 \\approx \\mathbf{0.000569}$ &mdash; that is
        $0.01/2.6^3 \\approx 0.01/17.58$, about $17\\times$ smaller than the top.</li>
       </ul>
       <table class="extable">
        <caption>Per-layer discriminative rates from $\\eta^L=0.01$, $\\eta^{l-1}=\\eta^l/2.6$.</caption>
        <thead><tr><th>layer</th><th class="num">divide by</th><th class="num">rate $\\eta^l$</th></tr></thead>
        <tbody>
         <tr><td class="row-h">$L$ (top)</td><td class="num">$1$</td><td class="num">$0.010000$</td></tr>
         <tr><td class="row-h">$L\\!-\\!1$</td><td class="num">$2.6$</td><td class="num">$0.003846$</td></tr>
         <tr><td class="row-h">$L\\!-\\!2$</td><td class="num">$2.6^2$</td><td class="num">$0.001479$</td></tr>
         <tr><td class="row-h">$L\\!-\\!3$ (bottom)</td><td class="num">$2.6^3$</td><td class="num">$0.000569$</td></tr>
        </tbody>
       </table>
       <p>Every one of these numbers is recomputed in the notebook so you can check the schedule and the
       per-layer rates by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Stage 1 &mdash; pretrain the LM.</b> Train an LSTM language model on a large unlabeled corpus
        to predict the next token. (We do a tiny version; the paper reuses an AWD-LSTM pretrained on
        Wikitext-103.)</li>
        <li><b>Stage 2 &mdash; fine-tune the LM on target text.</b> Keep training the LM on the target task's
        raw text (no labels) with discriminative rates + STLR, so it adapts to the domain.</li>
        <li><b>Stage 3 &mdash; build the classifier.</b> Reuse the LM's encoder; add the classifier head fed by
        <b>concat pooling</b> (last hidden state &oplus; max-pool &oplus; mean-pool over the sequence).</li>
        <li><b>Fine-tune the classifier with the three tricks:</b> (i) <b>discriminative</b> per-layer rates
        ($\\eta^{l-1}=\\eta^l/2.6$); (ii) <b>STLR</b> on top of those rates (Eqn 3); (iii) <b>gradual
        unfreezing</b> &mdash; train only the head first, then thaw lower layers top-down.</li>
        <li><b>Compare</b> against a from-scratch baseline (random encoder, single rate) and <b>ablate</b> the
        tricks (pretrained encoder, tricks off) to isolate what each part buys.</li>
      </ol>`,
    results:
      `<p>From the abstract and &sect;4 (quoted): ULMFiT "significantly outperforms the state-of-the-art on six
       text classification tasks, reducing the error by <b>18-24% on the majority of datasets</b>." On IMDb
       sentiment (Table 2) it reports <b>4.6% error</b> versus the prior CoVe baseline's 8.2%; on AG News
       (Table 3) <b>5.01% error</b> versus 6.87%. And the headline data-efficiency claim (Fig. 3): "with only
       <b>100 labeled examples</b>, it matches the performance of training from scratch on <b>100x more
       data</b>."</p>
       <p><i>These are the paper's reported figures, quoted. The numbers in the CODEVIZ panel below are from
       our own tiny run &mdash; not the paper's results.</i></p>`,

    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> ULMFiT is a text-<b>classifier</b>, so the metric is <b>test-set
       classification accuracy</b> (the paper reports its complement, <b>error rate</b>) on a held-out split. The
       paper's benchmarks are six text-classification datasets &mdash; e.g. <b>IMDb</b> sentiment and <b>AG News</b>
       topic. Define "better than trivial" with the <b>majority-class</b> baseline: on a balanced 2-class set that
       is 50% accuracy (so init cross-entropy loss should sit near $-\\ln(1/2)\\approx0.693$); a model stuck there is
       not learning. The real bar is the <b>from-scratch baseline</b> (random encoder, plain fine-tuning) &mdash;
       the whole claim is that pretrain-then-fine-tune beats it, especially with few labels.</p>
       <ul>
         <li><b>2. Sanity checks before the full run.</b> <b>Overfit a tiny batch:</b> train on ~20 labeled
         examples with no regularization and confirm <b>train accuracy reaches ~100%</b> and loss &rarr; ~0 &mdash;
         if it cannot even memorize, the wiring is broken. Check the loss <b>at init</b> matches $-\\ln(1/K)$ for
         $K$ classes ($\\approx0.693$ for 2). <b>Unit-test the STLR schedule</b> against the lesson's worked values:
         for $T=1000$, $\\eta(t{=}0)\\approx0.000313$ (the floor $\\eta_{max}/\\mathit{ratio}$), $\\eta$ at the peak
         $t{=}\\mathit{cut}{=}100$ equals $\\eta_{max}=0.01$, and $\\eta(t{=}50)\\approx0.005156$. Check the
         <b>discriminative rates</b>: $0.01, 0.003846, 0.001479, 0.000569$ &mdash; each $1/2.6$ of the one above.
         Confirm <b>concat pooling</b> produces a vector of width $3\\times$ hidden, and that frozen-layer
         parameters have <b>zero gradient</b> while gradual unfreezing keeps them frozen.</li>
         <li><b>3. Expected range.</b> ULMFiT should clearly beat from-scratch with few labels. The paper reports
         (quoted): <b>4.6% error on IMDb</b> vs the CoVe baseline's 8.2%, <b>5.01% on AG News</b> vs 6.87%, and an
         18-24% error reduction on most datasets; and "with only 100 labeled examples, it matches &hellip; training
         from scratch on 100x more data" (Howard &amp; Ruder 2018, abstract / Tables 2-3, Fig. 3). On the lesson's
         toy task with 20 labels, full ULMFiT lands ~0.94, the ablation ~0.86, from-scratch ~0.80 (approximate, our
         small run, not paper numbers). If ULMFiT does not clear from-scratch by a margin, suspect a bug; a few
         points of wobble is tuning.</li>
         <li><b>4. Ablation &mdash; prove the recipe earns its keep.</b> The paper's contribution is the
         <b>fine-tuning recipe</b> (discriminative rates + STLR + gradual unfreezing) on top of pretraining. Turn
         the tricks <b>OFF</b> &mdash; one global learning rate, all layers trainable from step 0 &mdash; while
         keeping the <i>same pretrained encoder</i>. The accuracy should <b>drop</b> and land <b>between</b>
         from-scratch and full ULMFiT (in the lesson, ~0.86): the gap below ULMFiT is what the tricks buy, the gap
         above from-scratch is what pretraining buys. If turning the tricks off changes <i>nothing</i>, they are not
         actually engaged (check that gradual unfreezing really freezes, and that the per-group rates differ).</li>
         <li><b>5. Failure signals.</b> <b>Accuracy stuck at majority class (~50%)</b> &rarr; labels shuffled, head
         not connected, or learning rate ~0. <b>Loss NaN</b> &rarr; $\\eta_{max}$ too high or the STLR ramp jolting a
         random head into the pretrained weights &mdash; that warm-up "slant" exists to prevent it. <b>Train-good,
         val-bad</b> &rarr; overfitting the few labels (expected for from-scratch; ULMFiT's tricks are what hold it
         off). <b>Ablation matches full ULMFiT</b> &rarr; tricks not wired in (param groups identical, or unfreezing
         a no-op). <b>Pretrained no better than scratch</b> &rarr; encoder weights not actually transferred, or the
         LM never learned (Stage-1 next-token loss never fell).</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the neural primitives ship in PyTorch, so you
       <b>import</b> them and build only the novel recipe. <b>Import:</b> <code>nn.Embedding</code>,
       <code>nn.LSTM</code>, <code>nn.Linear</code>, the optimizer, and a tiny synthetic text corpus.
       <b>Build by hand:</b> the three-stage pipeline (LM pretrain &rarr; transfer encoder &rarr; classifier),
       and the three tricks &mdash; <b>discriminative</b> per-layer rates via optimizer parameter groups,
       the <b>STLR</b> schedule function (Eqn 3), and <b>gradual unfreezing</b> via
       <code>requires_grad_</code>. Then the <b>ablation</b> that turns the tricks off and the from-scratch
       baseline. The transfer-learning rationale is recapped from <b>fs-transfer-learning</b>, not
       re-derived. We use an LSTM (as the paper did) rather than the full AWD-LSTM's dropout machinery; the
       recipe is identical.</p>`,
    pitfalls:
      `<ul>
        <li><b>Unfreezing everything at once.</b> Thawing all layers from step 0 lets a large early gradient
        overwrite the pretrained weights &mdash; catastrophic forgetting, the exact failure the paper warns
        about. <b>Fix:</b> gradual unfreezing &mdash; train the new head first, then thaw lower layers
        top-down.</li>
        <li><b>One global learning rate.</b> A single rate either shreds the lower layers (too big) or freezes
        the top (too small). <b>Fix:</b> discriminative rates, $\\eta^{l-1}=\\eta^l/2.6$ &mdash; in PyTorch,
        separate optimizer <code>param_groups</code> per layer.</li>
        <li><b>Skipping the warm-up (the "slant").</b> A freshly attached, random head produces wild early
        gradients; a constant or immediately-decaying rate jolts the pretrained encoder. <b>Fix:</b> STLR
        ramps up over the first $\\mathit{cut\\_frac}$ of training before peaking.</li>
        <li><b>Confusing $\\mathit{ratio}$ with a fraction.</b> $\\mathit{ratio}=32$ means the minimum rate is
        $\\eta_{max}/32$, i.e. the lowest rate is $32\\times$ <i>smaller</i> than the peak &mdash; not 32&times;
        larger and not 1/32 of the way up the ramp.</li>
        <li><b>Mean-pool only for the document vector.</b> Averaging hidden states blurs away strong local
        signals (a single very negative word). <b>Fix:</b> concat pooling &mdash; concatenate last hidden
        state, max-pool, and mean-pool (&sect;3.3) so peak and average signals both survive.</li>
        <li><b>Expecting the tricks to matter without pretraining.</b> The schedule and unfreezing protect
        <i>pretrained</i> knowledge. On a random encoder there is nothing to forget, so they help little
        &mdash; the win comes from pretraining <i>plus</i> the tricks together.</li>
      </ul>`,
    recall: [
      "State the discriminative fine-tuning update (Eqn 2) and the rule relating $\\eta^{l-1}$ to $\\eta^l$.",
      "What are the three values of the STLR schedule at $t=0$, $t=\\mathit{cut}$, and the very end?",
      "Define $\\mathit{cut}$, $\\mathit{cut\\_frac}$, and $\\mathit{ratio}$.",
      "Describe gradual unfreezing in two sentences.",
      "What three things does concat pooling concatenate, and why?"
    ],
    practice: [
      {
        q: `<b>The ablation.</b> ULMFiT (pretrained encoder + the three tricks) beat the from-scratch baseline
            on the tiny labeled set. Now run the middle case: take the <i>pretrained</i> encoder but fine-tune
            it with the tricks OFF (one global learning rate, no gradual unfreezing). Where does its accuracy
            land relative to full ULMFiT and to from-scratch, and what does each gap tell you?`,
        steps: [
          { do: `Keep the pretrained encoder; replace the per-layer/STLR/unfreeze schedule with a single constant learning rate and all layers trainable from step 0. Hold the labeled set, head, and seed fixed.`, why: `Changing only the fine-tuning recipe (not the pretraining) isolates what the three tricks contribute on top of pretraining.` },
          { do: `Compare the three test accuracies: full ULMFiT, this pretrain-no-tricks ablation, and from-scratch.`, why: `The gap (from-scratch &rarr; ablation) measures pretraining alone; the gap (ablation &rarr; full ULMFiT) measures the tricks on top.` },
          { do: `Note that the ablation lands BETWEEN the two: above from-scratch, below full ULMFiT.`, why: `Pretraining already helps a lot; the tricks add a further margin by stopping the fine-tune from partly forgetting it.` }
        ],
        answer: `<p>The ablation sits <b>in between</b> &mdash; in our run, full ULMFiT &asymp; 0.94, the
                 pretrain-no-tricks ablation &asymp; 0.86, and from-scratch &asymp; 0.80 (our small run, not the
                 paper's numbers). The jump from 0.80 to 0.86 is what <b>pretraining</b> buys; the further jump
                 from 0.86 to 0.94 is what the <b>three tricks</b> buy by protecting that pretrained knowledge
                 during fine-tuning. Both ingredients contribute, which is exactly the paper's claim.</p>`
      },
      {
        q: `For an STLR run with $T = 2000$, $\\mathit{cut\\_frac}=0.1$, $\\mathit{ratio}=32$,
            $\\eta_{max}=0.01$, compute (a) the cut iteration, (b) the learning rate at $t=0$, and (c) the
            learning rate at the peak.`,
        steps: [
          { do: `Cut: $\\mathit{cut} = \\lfloor 2000\\cdot 0.1\\rfloor = 200$.`, why: `$\\mathit{cut}$ is the floor of $T\\cdot\\mathit{cut\\_frac}$ &mdash; the step where the ramp turns into decay.` },
          { do: `At $t=0$: $p=0$, so $\\eta_0 = 0.01\\cdot(1+0)/32 = 0.01/32 \\approx 0.000313$.`, why: `At $p=0$ the schedule sits at its floor $\\eta_{max}/\\mathit{ratio}$.` },
          { do: `At $t=\\mathit{cut}=200$: $p=1$, so $\\eta = 0.01\\cdot(1+31)/32 = 0.01$.`, why: `At $p=1$ the numerator is $1+(\\mathit{ratio}-1)=\\mathit{ratio}$, cancelling the denominator &mdash; the rate equals $\\eta_{max}$.` }
        ],
        answer: `<p>(a) $\\mathit{cut} = 200$. (b) $\\eta_0 = 0.01/32 \\approx \\mathbf{0.000313}$, the floor. (c) at
                 the peak $t=200$, $\\eta = \\mathbf{0.01} = \\eta_{max}$. The shape is identical to the
                 $T=1000$ worked example &mdash; only the cut point scales with $T$.</p>`
      },
      {
        q: `You are fine-tuning a 5-layer pretrained encoder with discriminative rates. You set the top
            layer's rate to $\\eta^L = 0.01$ and use $\\eta^{l-1}=\\eta^l/2.6$. What rate does the
            <b>bottom</b> (5th-from-top) layer get, and why does the paper want it so small?`,
        steps: [
          { do: `Apply the factor four times (top to bottom is four steps down): $0.01 / 2.6^4$.`, why: `Each layer down divides by 2.6; the bottom layer is 4 layers below the top.` },
          { do: `Compute $2.6^4 \\approx 45.7$, so the bottom rate $\\approx 0.01/45.7 \\approx 0.000219$.`, why: `The geometric decay makes the lowest layer move far slower than the top.` },
          { do: `Recall what the bottom layers hold: general, broadly-useful features from pretraining.`, why: `Those should be preserved, not overwritten, so the tiny rate keeps them nearly fixed while the top adapts.` }
        ],
        answer: `<p>The bottom layer's rate is $0.01/2.6^4 \\approx \\mathbf{0.000219}$ &mdash; roughly
                 $46\\times$ smaller than the top. The paper wants it tiny because the lowest layers carry the
                 most general, transferable knowledge from pretraining; moving them fast would cause
                 catastrophic forgetting, so they are nearly frozen while the task-specific top layers do the
                 adapting.</p>`
      }
    ]
  });

  window.CODE["paper-ulmfit"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we run the full <b>three-stage ULMFiT pipeline</b> on a tiny synthetic "language" (a toy
       vocabulary with two latent topics). <b>Stage 1:</b> pretrain an <code>nn.LSTM</code> language model on
       ~2000 unlabeled sequences (next-token prediction). <b>Stage 2/3:</b> transfer the encoder into a
       classifier with <b>concat pooling</b> (last &oplus; max &oplus; mean), and fine-tune on just
       <b>20 labeled</b> examples using the three tricks &mdash; <b>discriminative</b> rates via two optimizer
       <code>param_groups</code> ($\\eta^{l-1}=\\eta^l/2.6$), the <b>STLR</b> schedule (Eqn 3), and
       <b>gradual unfreezing</b> (encoder frozen for the first third, then thawed). We compare against a
       <b>from-scratch</b> baseline and an <b>ablation</b> (pretrained, tricks off). The first cells recompute
       the worked examples &mdash; the STLR values ($0.000313$ at $t=0$, $0.01$ at the peak) and the per-layer
       rates ($0.01, 0.003846, \\dots$). Paste into Colab and run (torch is preinstalled &mdash; no pip).</p>`,
    code: `import torch, torch.nn as nn, numpy as np, math
torch.manual_seed(0); np.random.seed(0)

# --- 0a. Worked example: STLR schedule (Eqn 3). T=1000, cut_frac=.1, ratio=32, eta_max=.01 ---
def stlr(t, T=1000, cut_frac=0.1, ratio=32.0, eta_max=0.01):
    cut = math.floor(T * cut_frac)                       # = 100
    p = t / cut if t < cut else 1 - (t - cut) / (cut * (1 / cut_frac - 1))
    return eta_max * (1 + p * (ratio - 1)) / ratio
print("STLR  t=0   ->", round(stlr(0),   6))   # 0.000313  (the floor eta_max/ratio)
print("STLR  t=50  ->", round(stlr(50),  6))   # 0.005156
print("STLR  t=100 ->", round(stlr(100), 6))   # 0.010000  (the peak = eta_max)
print("STLR  t=200 ->", round(stlr(200), 6))   # 0.008924

# --- 0b. Worked example: discriminative per-layer rates, eta^{l-1} = eta^l / 2.6 ---
base = 0.01
print("disc lr per layer:", [round(base / 2.6**k, 6) for k in range(4)])
# [0.01, 0.003846, 0.001479, 0.000569]

# --- 1. A tiny synthetic "language": vocab V, two latent topics give text structure. ---
V, SEQ, NTOPIC = 20, 12, 2
g = torch.Generator().manual_seed(1)
topic_dist = torch.softmax(torch.randn(NTOPIC, V, generator=g) * 1.5, dim=1)
def gen_seq(topic):
    toks = [int(torch.randint(0, V, (1,), generator=g))]
    for _ in range(SEQ - 1):
        p = 0.5 * topic_dist[topic] + 0.5 * torch.softmax(torch.randn(V, generator=g), 0)
        toks.append(int(torch.multinomial(p, 1, generator=g)))
    return toks
def make(n):
    X, Y = [], []
    for _ in range(n):
        t = int(torch.randint(0, NTOPIC, (1,), generator=g)); Y.append(t); X.append(gen_seq(t))
    return torch.tensor(X), torch.tensor(Y)
Xun, _   = make(2000)   # unlabeled corpus for LM pretraining (lots)
Xtr, Ytr = make(20)     # FEW labeled examples
Xte, Yte = make(400)    # held-out test

# --- 2. Encoder (shared), LM head (pretraining), classifier head (concat pooling). ---
EMB, HID = 16, 24
class Encoder(nn.Module):
    def __init__(self):
        super().__init__(); self.emb = nn.Embedding(V, EMB); self.lstm = nn.LSTM(EMB, HID, batch_first=True)
    def forward(self, x):
        h, _ = self.lstm(self.emb(x)); return h          # (B, SEQ, HID)
class LM(nn.Module):
    def __init__(self, enc): super().__init__(); self.enc = enc; self.dec = nn.Linear(HID, V)
    def forward(self, x): return self.dec(self.enc(x))
class Clf(nn.Module):
    def __init__(self, enc):
        super().__init__(); self.enc = enc
        self.head = nn.Sequential(nn.Linear(HID * 3, HID), nn.ReLU(), nn.Linear(HID, NTOPIC))
    def forward(self, x):
        h = self.enc(x)
        last, mx, mn = h[:, -1], h.max(1).values, h.mean(1)   # concat pooling (last + max + mean)
        return self.head(torch.cat([last, mx, mn], 1))

# --- 3. Stage 1: pretrain the LM (next-token prediction) on the unlabeled corpus. ---
def pretrain_lm(enc, epochs=8):
    lm = LM(enc); opt = torch.optim.Adam(lm.parameters(), lr=3e-3); lf = nn.CrossEntropyLoss()
    for _ in range(epochs):
        perm = torch.randperm(len(Xun))
        for i in range(0, len(Xun), 128):
            b = Xun[perm[i:i + 128]]
            opt.zero_grad(); loss = lf(lm(b[:, :-1]).reshape(-1, V), b[:, 1:].reshape(-1))
            loss.backward(); opt.step()

def accuracy(clf):
    clf.eval()
    with torch.no_grad(): return (clf(Xte).argmax(1) == Yte).float().mean().item()

# --- 4. Stage 3: fine-tune the classifier. tricks=True -> the three ULMFiT tricks. ---
def finetune(clf, tricks, epochs=40):
    enc_p, head_p = list(clf.enc.parameters()), list(clf.head.parameters())
    base = 0.01
    if tricks:   # discriminative: head at base, encoder (lower) at base/2.6
        opt = torch.optim.Adam([{'params': head_p, 'lr': base}, {'params': enc_p, 'lr': base / 2.6}])
    else:        # baseline: one global rate, no unfreezing
        opt = torch.optim.Adam([{'params': head_p + enc_p, 'lr': base}])
    lf = nn.CrossEntropyLoss(); accs = []
    for ep in range(epochs):
        if tricks:
            for pr in enc_p: pr.requires_grad_(ep >= epochs // 3)     # gradual unfreezing
            lr = stlr(ep, T=epochs)                                   # STLR schedule (Eqn 3)
            opt.param_groups[0]['lr'] = lr; opt.param_groups[1]['lr'] = lr / 2.6
        clf.train(); opt.zero_grad(); loss = lf(clf(Xtr), Ytr); loss.backward(); opt.step()
        for pr in clf.parameters(): pr.requires_grad_(True)
        accs.append(accuracy(clf))
    return accs

# (A) ULMFiT: pretrain -> transfer -> fine-tune with the three tricks
enc1 = Encoder(); pretrain_lm(enc1); acc_ulmfit = finetune(Clf(enc1), tricks=True)
# (B) From scratch: random encoder, plain fine-tune
torch.manual_seed(0); acc_scratch = finetune(Clf(Encoder()), tricks=False)
# (C) Ablation: pretrained encoder, tricks OFF
enc3 = Encoder(); pretrain_lm(enc3); acc_noTricks = finetune(Clf(enc3), tricks=False)

print("\\nfinal test acc  (20 labels):")
print("  ULMFiT (pretrain + 3 tricks):", round(acc_ulmfit[-1], 3))
print("  from scratch                :", round(acc_scratch[-1], 3))
print("  ablation (pretrain, no tricks):", round(acc_noTricks[-1], 3))
# Our small run, not the paper's numbers. Typically: ULMFiT > ablation > from-scratch,
# i.e. pretraining helps AND the three tricks add a further margin.`
  };

  window.CODEVIZ["paper-ulmfit"] = {
    question: "With only 20 labeled examples, does ULMFiT (pretrain + 3 tricks) beat from-scratch, and does the ablation (pretrain, no tricks) land in between?",
    charts: [
      {
        type: "line",
        title: "Test accuracy vs fine-tuning epoch — 20 labeled examples",
        xlabel: "fine-tuning epoch",
        ylabel: "held-out test accuracy",
        series: [
          {
            name: "ULMFiT (pretrain + 3 tricks)",
            color: "#7ee787",
            points: [[0,0.505],[2,0.875],[4,0.947],[6,0.947],[8,0.947],[10,0.942],[12,0.942],[14,0.938],[16,0.938],[18,0.942],[20,0.945],[22,0.945],[24,0.942],[26,0.94],[28,0.938],[30,0.935],[32,0.935],[34,0.935],[36,0.935],[39,0.935]]
          },
          {
            name: "Ablation (pretrain, no tricks)",
            color: "#d2a8ff",
            points: [[0,0.505],[2,0.915],[4,0.94],[6,0.935],[8,0.92],[10,0.918],[12,0.91],[14,0.902],[16,0.9],[18,0.887],[20,0.882],[22,0.88],[24,0.873],[26,0.873],[28,0.87],[30,0.87],[32,0.865],[34,0.86],[36,0.86],[39,0.86]]
          },
          {
            name: "From scratch",
            color: "#ff7b72",
            points: [[0,0.79],[2,0.815],[4,0.842],[6,0.91],[8,0.905],[10,0.887],[12,0.865],[14,0.835],[16,0.837],[18,0.822],[20,0.822],[22,0.812],[24,0.808],[26,0.81],[28,0.81],[30,0.81],[32,0.808],[34,0.805],[36,0.803],[39,0.803]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A tiny LSTM language model pretrained on ~2000 unlabeled toy sequences, then a classifier fine-tuned on only 20 labeled examples. ULMFiT (pretrain + discriminative lr + STLR + gradual unfreezing) settles around 0.94 test accuracy. From-scratch (random encoder, single learning rate) climbs briefly then overfits the 20 labels and decays to ~0.80. The ablation (pretrained encoder but tricks OFF) lands in between (~0.86): pretraining alone lifts it above from-scratch, and the three tricks add the rest — reproducing the paper's qualitative claim that transfer beats from-scratch with few labels, and that the fine-tuning tricks matter on top of pretraining.",
    code: `import torch, torch.nn as nn, numpy as np, math
torch.manual_seed(0); np.random.seed(0)

V, SEQ, NTOPIC, EMB, HID = 20, 12, 2, 16, 24
g = torch.Generator().manual_seed(1)
topic_dist = torch.softmax(torch.randn(NTOPIC, V, generator=g) * 1.5, dim=1)
def gen_seq(t):
    s = [int(torch.randint(0, V, (1,), generator=g))]
    for _ in range(SEQ - 1):
        p = 0.5 * topic_dist[t] + 0.5 * torch.softmax(torch.randn(V, generator=g), 0)
        s.append(int(torch.multinomial(p, 1, generator=g)))
    return s
def make(n):
    X, Y = [], []
    for _ in range(n):
        t = int(torch.randint(0, NTOPIC, (1,), generator=g)); Y.append(t); X.append(gen_seq(t))
    return torch.tensor(X), torch.tensor(Y)
Xun, _ = make(2000); Xtr, Ytr = make(20); Xte, Yte = make(400)

class Encoder(nn.Module):
    def __init__(self):
        super().__init__(); self.emb = nn.Embedding(V, EMB); self.lstm = nn.LSTM(EMB, HID, batch_first=True)
    def forward(self, x): h, _ = self.lstm(self.emb(x)); return h
class LM(nn.Module):
    def __init__(self, e): super().__init__(); self.enc = e; self.dec = nn.Linear(HID, V)
    def forward(self, x): return self.dec(self.enc(x))
class Clf(nn.Module):
    def __init__(self, e):
        super().__init__(); self.enc = e
        self.head = nn.Sequential(nn.Linear(HID * 3, HID), nn.ReLU(), nn.Linear(HID, NTOPIC))
    def forward(self, x):
        h = self.enc(x)
        return self.head(torch.cat([h[:, -1], h.max(1).values, h.mean(1)], 1))   # concat pooling

def pretrain(e, ep=8):
    lm = LM(e); opt = torch.optim.Adam(lm.parameters(), lr=3e-3); lf = nn.CrossEntropyLoss()
    for _ in range(ep):
        perm = torch.randperm(len(Xun))
        for i in range(0, len(Xun), 128):
            b = Xun[perm[i:i + 128]]
            opt.zero_grad(); lf(lm(b[:, :-1]).reshape(-1, V), b[:, 1:].reshape(-1)).backward(); opt.step()
def stlr(t, T, cf=0.1, r=32.0, em=0.01):
    cut = math.floor(T * cf)
    p = t / cut if t < cut else 1 - (t - cut) / (cut * (1 / cf - 1))
    return em * (1 + p * (r - 1)) / r
def acc(c):
    c.eval()
    with torch.no_grad(): return (c(Xte).argmax(1) == Yte).float().mean().item()
def finetune(c, tricks, ep=40):
    encp, hp, base = list(c.enc.parameters()), list(c.head.parameters()), 0.01
    opt = (torch.optim.Adam([{'params': hp, 'lr': base}, {'params': encp, 'lr': base / 2.6}])
           if tricks else torch.optim.Adam([{'params': hp + encp, 'lr': base}]))
    lf = nn.CrossEntropyLoss(); out = []
    for e in range(ep):
        if tricks:
            for pr in encp: pr.requires_grad_(e >= ep // 3)        # gradual unfreezing
            lr = stlr(e, ep); opt.param_groups[0]['lr'] = lr; opt.param_groups[1]['lr'] = lr / 2.6
        c.train(); opt.zero_grad(); lf(c(Xtr), Ytr).backward(); opt.step()
        for pr in c.parameters(): pr.requires_grad_(True)
        out.append(acc(c))
    return out

e1 = Encoder(); pretrain(e1); ulmfit = finetune(Clf(e1), True)
torch.manual_seed(0); scratch = finetune(Clf(Encoder()), False)
e3 = Encoder(); pretrain(e3); ablate = finetune(Clf(e3), False)
idx = np.linspace(0, 39, 20).astype(int)
print("ULMFiT :", [[int(i), round(ulmfit[i], 3)] for i in idx])
print("Ablation:", [[int(i), round(ablate[i], 3)] for i in idx])
print("Scratch:", [[int(i), round(scratch[i], 3)] for i in idx])
# ULMFiT ~0.94, ablation ~0.86, from-scratch ~0.80 (our small run, not the paper's numbers).`
  };
})();
