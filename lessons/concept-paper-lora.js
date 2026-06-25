/* Paper lesson — "LoRA: Low-Rank Adaptation of Large Language Models"
   (LoRA), Hu, Shen, Wallis, Allen-Zhu, Li, Wang, Wang, Chen — Microsoft, 2021 (ICLR 2022).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-lora".
   GROUNDED from arXiv:2106.09685 (abstract) and the ar5iv HTML mirror
   (Section 4.1 "Low-Rank-Parametrized Update Matrices": Eqn. (3) h = W0 x + BA x;
   zero-init of B + Gaussian A; the alpha/r scaling; Section 4.2 practical benefits:
   "checkpoint size reduced by roughly 10,000x (from 350GB to 35MB)", VRAM 1.2TB to 350GB;
   abstract: "reduce the number of trainable parameters by 10,000 times").
   Track B (architecture): compose a small net with torch.nn, FREEZE its pretrained
   weights, then implement the NOVEL part by hand — a low-rank update W + (alpha/r)*B*A
   where only B and A are trainable. Reproduce the effect: adapt a frozen net to a NEW
   task, matching full fine-tuning while training a tiny fraction of the parameters. */
(function () {
  window.LESSONS.push({
    id: "paper-lora",
    title: "LoRA — Low-Rank Adaptation of Large Language Models (2021)",
    tagline: "Fine-tune a frozen model by learning a tiny low-rank weight update instead of all the weights.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Edward J. Hu, Yelong Shen, Phillip Wallis, Zeyuan Allen-Zhu, Yuanzhi Li, Shean Wang, Lu Wang, Weizhu Chen",
      org: "Microsoft",
      year: 2021,
      venue: "arXiv:2106.09685 (Jun 2021); ICLR 2022",
      citations: "",
      arxiv: "https://arxiv.org/abs/2106.09685",
      code: "https://github.com/microsoft/LoRA"
    },
    conceptLink: "fs-transfer-learning",
    partOf: [],
    prereqs: ["fs-transfer-learning", "pt-nn-module", "pt-autograd", "ml-gradient-descent", "dl-backprop"],

    // WHY READ IT
    problem:
      `<p>To specialize a big pretrained model on a new task, the standard recipe is <b>full fine-tuning</b>:
       unfreeze every weight and keep training. That works, but it is expensive. You produce a brand-new copy
       of <i>all</i> the weights for <i>each</i> task. From the abstract:</p>
       <blockquote>"As we pre-train larger models, full fine-tuning, which retrains all model parameters,
       becomes less feasible. Using GPT-3 175B (Generative Pre-trained Transformer 3, 175 billion parameters)
       as an example &mdash; deploying independent instances of fine-tuned models, each with 175B parameters,
       is prohibitively expensive." (Abstract)</blockquote>
       <p>So one task = one full-size checkpoint to store and serve. Swapping tasks means loading a different
       175-billion-parameter file. The cost is in storage, memory, and the sheer count of parameters you must
       train and save.</p>
       <p>The question the paper answers: can we adapt a frozen pretrained model to a new task by training only
       a <b>tiny</b> number of new parameters &mdash; small enough to store cheaply and swap instantly &mdash;
       without losing the accuracy of full fine-tuning?</p>`,
    contribution:
      `<ul>
        <li><b>Freeze the pretrained weights; learn a low-rank update.</b> LoRA (Low-Rank Adaptation) keeps the
        original weight matrix $W_0$ frozen and adds a small trainable update $\\Delta W = B A$, where $B$ and
        $A$ are skinny matrices. Only $B$ and $A$ are trained.</li>
        <li><b>A drastic cut in trainable parameters.</b> Because the rank $r$ is tiny, $B$ and $A$ together hold
        far fewer numbers than $W_0$. The abstract reports LoRA "can reduce the number of trainable parameters
        by 10,000 times and the GPU (graphics processing unit) memory requirement by 3 times" versus fine-tuning
        GPT-3 175B with Adam.</li>
        <li><b>No extra cost at inference.</b> After training you can fold $B A$ back into $W_0$ (the math is
        just addition), so the deployed model runs at exactly the original speed &mdash; unlike adapter layers
        that add depth.</li>
      </ul>`,
    whyItMattered:
      `<p>LoRA became the default way to fine-tune large language models on modest hardware. Because the update
       is tiny and detachable, you can keep one frozen base model and store a small LoRA "patch" per task &mdash;
       megabytes instead of gigabytes &mdash; and hot-swap them. It is the foundation of the parameter-efficient
       fine-tuning (PEFT) ecosystem and of quantized variants (such as QLoRA) that fine-tune huge models on a
       single GPU. The core idea &mdash; that the <i>change</i> a task needs is low-rank, even when the model is
       enormous &mdash; reshaped how practitioners adapt foundation models.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;4.1 (Low-Rank-Parametrized Update Matrices)</b> &mdash; the whole method in one page. The
        update $h = W_0 x + B A x$ (their <b>Equation 3</b>), the shapes of $B$ and $A$, the zero-initialization
        of $B$, and the $\\alpha/r$ scaling. This is the math you transcribe and implement.</li>
        <li><b>&sect;4.2 (Practical Benefits and Limitations)</b> &mdash; the storage and memory payoff: checkpoint
        size and video-RAM (VRAM) reductions, and the ability to swap tasks by swapping $B A$.</li>
        <li><b>&sect;1 (Introduction) and Figure 1</b> &mdash; the picture of the frozen $W$ with the small
        $A$/$B$ side-path. Anchor the idea before the equations.</li>
       </ul>
       <p><b>Skim:</b> &sect;5 (the GLUE / WikiSQL / GPT-3 experiments) unless you want the benchmark tables, and
       &sect;7 (the analysis of <i>which</i> weight matrices to adapt and what rank suffices). Read the one
       paragraph in &sect;7.2 arguing the adaptation update has <b>low intrinsic rank</b> &mdash; it is the
       motivation for the whole method.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will take a small net pretrained on one task, <b>freeze</b> all its weights, and adapt it to a
       <i>new</i> task two ways: (1) <b>full fine-tuning</b> &mdash; unfreeze everything and train, and
       (2) <b>LoRA</b> &mdash; keep the weights frozen and train only a low-rank update $B A$ on one layer,
       sweeping the rank $r \\in \\{1, 2, 4, 8\\}$. Then plot held-out task accuracy against the number of
       <i>trainable</i> parameters.</p>
       <p>Full fine-tuning trains every weight. LoRA trains a tiny fraction. <b>Predict:</b> how small can $r$
       get before LoRA's accuracy falls noticeably below full fine-tuning's? Will rank $r=1$ be enough, or will
       you need a handful of ranks? Write your guess and one sentence of reasoning.</p>`,
    attempt:
      `<p>Before the reveal, sketch the LoRA module you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Pick a frozen linear layer with weight $W_0$ of shape $d \\times k$ (it maps a $k$-vector to a
        $d$-vector). FREEZE it: <code>p.requires_grad_(False)</code> for every base weight.</li>
        <li>Create two trainable matrices: $A$ of shape $r \\times k$ and $B$ of shape $d \\times r$, with
        $r$ much smaller than $d$ and $k$ (written $r \\ll \\min(d, k)$).</li>
        <li><b>Initialization:</b> TODO &mdash; set $A$ to small random Gaussian values and set $B$ to
        <b>all zeros</b>. Why all zeros for $B$? (Hint: what is $B A$ when $B = 0$, and what does that mean for
        the model's output at step 0?)</li>
        <li><b>Forward:</b> the layer's output becomes $h = W_0 x + \\tfrac{\\alpha}{r}\\,(B A) x$. TODO &mdash;
        which tensors carry gradients here, and which do not?</li>
       </ul>
       <p>Then build the full-fine-tuning baseline: same net, unfreeze all weights, train. Predict the smallest
       $r$ that matches it.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>LoRA changes <b>one thing</b>: how a weight matrix gets updated during fine-tuning. Take any linear
       layer in the pretrained model with weight matrix $W_0$ of shape $d \\times k$ (it turns an input
       $x$ of length $k$ into an output of length $d$ via $W_0 x$).</p>
       <p><b>Freeze the original, add a side update.</b> Instead of editing $W_0$ directly, LoRA keeps $W_0$
       <b>frozen</b> and learns a separate update $\\Delta W$ that gets <i>added</i> to it. The fine-tuned layer
       computes $W_0 x + \\Delta W x$. So far this is just "old weights plus a correction."</p>
       <p><b>Make the update low-rank.</b> The key move (&sect;4.1): force $\\Delta W$ to be a product of two
       skinny matrices, $\\Delta W = B A$, where $B$ has shape $d \\times r$ and $A$ has shape $r \\times k$,
       and the <b>rank</b> $r$ is tiny &mdash; $r \\ll \\min(d, k)$. Multiplying a $d \\times r$ matrix by an
       $r \\times k$ matrix gives back a $d \\times k$ matrix, the right shape to add to $W_0$. But you only
       store and train $B$ and $A$, which together hold $r(d + k)$ numbers instead of $d \\times k$. When $r$ is
       small, that is a huge saving. The modified forward pass (their <b>Equation 3</b>) is:</p>
       <p>$$ h = W_0 x + \\Delta W x = W_0 x + B A x. $$</p>
       <p><b>Start the update at zero.</b> LoRA initializes $A$ with small random Gaussian values and $B$ with
       <b>all zeros</b>. Since $B = 0$, the product $B A = 0$, so at the very first step the update contributes
       nothing and the model behaves exactly like the frozen pretrained model. Training then grows $B$ away from
       zero. The paper states it plainly (&sect;4.1):</p>
       <blockquote>"We use a random Gaussian initialization for $A$ and zero for $B$, so $\\Delta W = B A$ is
       zero at the beginning of training." (&sect;4.1)</blockquote>
       <p><b>Scale the update.</b> LoRA multiplies the update by a constant factor $\\alpha / r$, where $\\alpha$
       is a fixed number (&sect;4.1): "We then scale $\\Delta W x$ by $\\alpha/r$, where $\\alpha$ is a constant
       in $r$." Dividing by $r$ keeps the update's size stable as you change the rank, so you do not have to
       re-tune the learning rate every time you pick a different $r$. The full update is
       $\\tfrac{\\alpha}{r}\\,B A\\, x$.</p>
       <p>That is the entire method: freeze $W_0$, learn a low-rank $B A$ that starts at zero and is scaled by
       $\\alpha/r$. The only trainable parameters are $B$ and $A$.</p>`,
    architecture:
      `<p>LoRA is not a new network &mdash; it is a small <b>side-path bolted onto chosen weight matrices</b> of an
       existing Transformer. Here is where the pieces attach and how data flows.</p>
       <p><b>Where it attaches (&sect;4.2, &sect;7.1).</b> A Transformer block has a self-attention sub-layer with four
       projection matrices &mdash; query $W_q$, key $W_k$, value $W_v$, and output $W_o$ &mdash; followed by a
       feed-forward (MLP) sub-layer. The paper treats each of $W_q, W_k, W_v, W_o$ as one matrix of size
       $d_{\\text{model}} \\times d_{\\text{model}}$ (the per-head slicing is ignored for adaptation). LoRA is added
       to a <i>subset</i> of these. The main experiments adapt <b>only $W_q$ and $W_v$</b> (the query and value
       projections) in every attention layer and leave $W_k$, $W_o$, and the entire MLP frozen.</p>
       <p><b>The per-matrix module.</b> For an adapted matrix $W_0$ of shape $d_{\\text{model}}\\times d_{\\text{model}}$,
       LoRA adds two factors: a <b>down-projection</b> $A$ of shape $r \\times d_{\\text{model}}$ (random Gaussian)
       and an <b>up-projection</b> $B$ of shape $d_{\\text{model}} \\times r$ (zeros). At inference time the input
       $x$ takes two parallel routes &mdash; the frozen $W_0 x$ and the side-path $\\tfrac{\\alpha}{r} B(A x)$
       &mdash; whose outputs are summed (Eq. 3). The side-path is the only place gradients flow.</p>
       <p><b>Rank choice (&sect;7.2).</b> $r$ is tiny &mdash; the paper finds $r \\in \\{1, 2, 4, 8\\}$ already
       competitive, with $r = 4$ used for the headline GPT-3 175B run, and even $r_q = r_v = 1$ matching full
       fine-tuning on several tasks. Larger $r$ rarely helps because the needed update has low intrinsic rank.
       The scaling constant $\\alpha$ is set once (to the first $r$ tried) and not tuned.</p>
       <p><b>Whole-model picture.</b> Stack this side-path on $W_q$ and $W_v$ across all $L$ attention layers.
       Total trainable parameters $= 2 \\times L_{\\text{LoRA}} \\times d_{\\text{model}} \\times r$ &mdash; for GPT-3
       ($d_{\\text{model}} = 12288$, 96 layers, $r = 4$) this is a few million numbers versus 175 billion. After
       training, every $B A$ is merged back into its $W_0$, so the deployed model is structurally identical to
       the original Transformer &mdash; same layers, same latency.</p>`,
    symbols: [
      { sym: "$W_0$", desc: "the <b>frozen pretrained weight matrix</b> of one layer, shape $d \\times k$. It maps a length-$k$ input to a length-$d$ output and is NOT trained during LoRA." },
      { sym: "$x$", desc: "the <b>input</b> to the layer (a length-$k$ vector, or a batch of them)." },
      { sym: "$h$", desc: "the layer's <b>output</b> after adaptation: the frozen part $W_0 x$ plus the low-rank update." },
      { sym: "$\\Delta W$", desc: "the <b>weight update</b> LoRA learns, shape $d \\times k$ &mdash; the change added to $W_0$. It is forced to be low-rank: $\\Delta W = B A$." },
      { sym: "$B$", desc: "the first <b>low-rank factor</b>, shape $d \\times r$. Trainable. Initialized to <b>all zeros</b> so the update starts at $0$." },
      { sym: "$A$", desc: "the second <b>low-rank factor</b>, shape $r \\times k$. Trainable. Initialized to small <b>random Gaussian</b> values." },
      { sym: "$r$", desc: "the <b>rank</b>: the shared inner dimension of $B$ and $A$. Chosen tiny, $r \\ll \\min(d, k)$. Larger $r$ means a more expressive update and more trainable parameters." },
      { sym: "$d, k$", desc: "the <b>output and input sizes</b> of the layer. $W_0$ and $\\Delta W$ are $d \\times k$; $B$ is $d \\times r$; $A$ is $r \\times k$." },
      { sym: "$\\alpha$", desc: "the <b>LoRA scaling constant</b> (a fixed number, not trained). The update is multiplied by $\\alpha / r$. The paper calls $\\alpha$ \"a constant in $r$.\"" },
      { sym: "$\\alpha / r$", desc: "the <b>scale factor</b> applied to the update. Dividing by $r$ keeps the update's magnitude steady as you change the rank, so the learning rate need not be re-tuned per $r$." },
      { sym: "$\\Phi$", desc: "the <b>entire set of model weights</b> being optimized. In full fine-tuning (Eq. 1) you search over all of $\\Phi$; $|\\Phi_0|$ is the pretrained model's parameter count (e.g. 175 billion)." },
      { sym: "$\\Phi_0$", desc: "the <b>pretrained weights</b>, kept frozen in LoRA. The adapted model uses $\\Phi_0 + \\Delta\\Phi(\\Theta)$ (Eq. 2)." },
      { sym: "$\\Theta$", desc: "the <b>small set of trainable LoRA parameters</b> (all the $B$'s and $A$'s). The update is a function $\\Delta\\Phi(\\Theta)$ of $\\Theta$, with $|\\Theta| \\ll |\\Phi_0|$." },
      { sym: "$\\Delta\\Phi(\\Theta)$", desc: "the <b>whole-model weight update</b> produced by $\\Theta$ &mdash; the collection of per-layer $\\Delta W = B A$ terms. Eq. 2's model-level view of Eq. 3." },
      { sym: "$\\mathcal{Z}$", desc: "the <b>training dataset</b> of context-target pairs $(x, y)$ the likelihood is summed over." },
      { sym: "$x, y$", desc: "a <b>training example</b>: input context $x$ and target sequence $y$; $y_t$ is its $t$-th token and $y_{&lt;t}$ the tokens before it." },
      { sym: "$P_{\\Phi}(y_t \\mid x, y_{&lt;t})$", desc: "the model's <b>probability of the next token</b> $y_t$ given the context and previous tokens; the objective maximizes its log over the data (Eqs. 1, 2)." },
      { sym: "$W_q, W_k, W_v, W_o$", desc: "the four <b>self-attention projection matrices</b> (query, key, value, output), each $d_{\\text{model}}\\times d_{\\text{model}}$. LoRA's main runs adapt only $W_q$ and $W_v$." },
      { sym: "$d_{\\text{model}}$", desc: "the <b>Transformer hidden size</b> &mdash; the width of each attention projection ($12288$ for GPT-3 175B)." },
      { sym: "$L_{\\text{LoRA}}$", desc: "the <b>number of Transformer layers</b> that receive a LoRA adapter; trainable params $= 2\\, L_{\\text{LoRA}}\\, d_{\\text{model}}\\, r$." },
      { sym: "$W, W'$", desc: "the <b>merged weight</b> $W = W_0 + B A$ shipped at inference, and $W'$ after swapping in a different task's adapter $B' A'$ (&sect;4.2)." },
      { sym: "“rank”", desc: "a plain term: the number of independent directions a matrix can span. A product $B A$ with inner dimension $r$ has rank at most $r$, so a small $r$ means a \"simple\" (low-rank) update." },
      { sym: "“frozen”", desc: "a plain term: a parameter whose gradient is turned off (<code>requires_grad=False</code>), so the optimizer never changes it." }
    ],
    formula:
      `$$ \\max_{\\Phi}\\; \\sum_{(x,y)\\in\\mathcal{Z}} \\sum_{t=1}^{|y|} \\log\\, P_{\\Phi}\\!\\left(y_t \\mid x,\\, y_{&lt;t}\\right). $$
       <p class="cap">Eq. 1 (&sect;2.1) &mdash; <b>full fine-tuning</b>: pick a whole new weight set $\\Phi$ (size $|\\Phi_0|$, e.g. 175B) to maximize the log-likelihood of each next token $y_t$. One full copy of $\\Phi$ per task.</p>

       $$ \\max_{\\Theta}\\; \\sum_{(x,y)\\in\\mathcal{Z}} \\sum_{t=1}^{|y|} \\log\\, P_{\\Phi_0 + \\Delta\\Phi(\\Theta)}\\!\\left(y_t \\mid x,\\, y_{&lt;t}\\right), \\qquad |\\Theta| \\ll |\\Phi_0|. $$
       <p class="cap">Eq. 2 (&sect;2.2) &mdash; <b>LoRA's objective</b>: freeze $\\Phi_0$ and optimize only a small set $\\Theta$ that produces the update $\\Delta\\Phi(\\Theta)$. The trainable count $|\\Theta|$ can be a tiny fraction of $|\\Phi_0|$ (the paper: as low as $0.01\\%$).</p>

       $$ h = W_0\\, x + \\Delta W\\, x = W_0\\, x + \\tfrac{\\alpha}{r}\\, B\\, A\\, x, \\qquad B \\in \\mathbb{R}^{d\\times r},\\; A \\in \\mathbb{R}^{r\\times k},\\; r \\ll \\min(d,k). $$
       <p class="cap">Eq. 3 (&sect;4.1) &mdash; the <b>per-layer low-rank update</b> (with the $\\alpha/r$ scaling of &sect;4.1): the frozen part $W_0 x$ plus a correction routed through a width-$r$ bottleneck $B A$. $A$ is random Gaussian, $B$ is zero, so $\\Delta W = B A = 0$ at the start of training.</p>

       $$ |\\Theta| \\;=\\; 2 \\times L_{\\text{LoRA}} \\times d_{\\text{model}} \\times r. $$
       <p class="cap">&sect;4.2 &mdash; <b>trainable-parameter count</b> when LoRA adapts the query and value projections ($W_q, W_v$) of $L_{\\text{LoRA}}$ Transformer layers. The factor $2$ is the two matrices per layer; each $d_{\\text{model}}\\times d_{\\text{model}}$ matrix contributes $2\\, d_{\\text{model}}\\, r$ via its $B$ and $A$.</p>

       $$ W \\;=\\; W_0 + B A \\qquad\\Longrightarrow\\qquad W' \\;=\\; W - B A + B' A'. $$
       <p class="cap">&sect;4.2 &mdash; <b>zero-latency merge and task switch</b>: after training, fold $B A$ into $W_0$ once to ship a single matrix $W$ (no extra layers, no inference slowdown). To switch tasks, subtract $B A$ and add another adapter $B' A'$ &mdash; a cheap, low-memory operation.</p>`,
    whatItDoes:
      `<p><b>Eqs. 1 and 2 (the objective).</b> Eq. 1 is ordinary fine-tuning: find weights $\\Phi$ that make the
       model assign high probability to each correct next token across the data &mdash; but $\\Phi$ is the whole
       175-billion-parameter set. Eq. 2 is the same likelihood objective with the weights rewritten as
       $\\Phi_0 + \\Delta\\Phi(\\Theta)$: the pretrained $\\Phi_0$ is held fixed and you optimize only the small
       $\\Theta$. The constraint $|\\Theta| \\ll |\\Phi_0|$ is the whole point &mdash; you get fine-tuning's goal
       while moving a tiny number of knobs.</p>
       <p><b>Eq. 3 (the per-layer update).</b> Pass the input $x$ through the <b>frozen</b> layer ($W_0 x$) and
       <b>add</b> a small learned correction ($\\tfrac{\\alpha}{r} B A x$). The correction is computed in two cheap
       steps: first $A x$ squeezes the length-$k$ input down to a tiny length-$r$ vector, then $B$ expands that
       back up to length $d$. So the update flows through a narrow bottleneck of width $r$ &mdash; that is what
       makes it low-rank and cheap. Because $B$ starts at zero, the correction starts at zero and the adapted
       model is identical to the frozen model at step 0; training then grows it. Only $B$ and $A$ carry gradients,
       so the optimizer touches just $r(d+k)$ numbers instead of $d \\times k$.</p>
       <p><b>The parameter-count formula.</b> $2 \\times L_{\\text{LoRA}} \\times d_{\\text{model}} \\times r$ just adds up
       those per-layer costs over every adapted layer: two matrices ($W_q, W_v$) per layer, each costing
       $2\\, d_{\\text{model}}\\, r$.</p>
       <p><b>The merge $W = W_0 + B A$.</b> Because the correction is plain addition, after training you fold
       $\\tfrac{\\alpha}{r}B A$ into $W_0$ once and ship a single matrix &mdash; no extra layers, no slowdown at
       inference. Swapping tasks means subtracting one adapter and adding another, $W' = W - B A + B' A'$
       (&sect;4.2).</p>`,
    derivation:
      `<p><b>Short recap &mdash; the transfer-learning framing (freeze a pretrained model, adapt it to a new task)
       lives in the fs-transfer-learning concept lesson.</b> Here we make precise <i>why a low-rank update is
       enough.</i></p>
       <p>Full fine-tuning learns an arbitrary change $\\Delta W = W_{\\text{ft}} - W_0$, a full $d \\times k$
       matrix with up to $d \\times k$ free numbers. LoRA's bet (&sect;7.2) is that the change a single
       downstream task actually needs has <b>low intrinsic rank</b>: it can be well-approximated by a matrix of
       rank $r$ for some small $r$. Any rank-$r$ matrix factors exactly as a product of a $d \\times r$ matrix
       and an $r \\times k$ matrix &mdash; that is the definition of rank. So writing $\\Delta W = B A$ with inner
       dimension $r$ does not "approximate" anything beyond that assumption; it simply <i>restricts</i> the update
       to the rank-$r$ family and parametrizes it with the minimum number of free values, $r(d + k)$.</p>
       <p><b>Why zero-init $B$ is safe.</b> At step 0, $B = 0 \\Rightarrow B A = 0 \\Rightarrow h = W_0 x$: the
       adapted model equals the pretrained model, so fine-tuning starts from a known-good point rather than a
       random perturbation. Gradients still flow: $\\partial h / \\partial B$ depends on $A x$, which is nonzero
       because $A$ is random, so $B$ can move on the first step. (If both $A$ and $B$ were zero, the update would
       be stuck at zero forever &mdash; hence one factor is random.)</p>
       <p><b>Why divide by $r$.</b> The scale $\\alpha/r$ normalizes the update's magnitude across ranks. Without
       it, doubling $r$ roughly doubles the typical size of $B A x$, forcing a learning-rate re-tune; with it,
       changing $r$ leaves the update's scale (and the good learning rate) roughly unchanged (&sect;4.1).</p>`,
    example:
      `<p>Work a tiny rank-$1$ case by hand so the shapes and the parameter count are concrete. Take a frozen
       layer with $d = 4$ (output size) and $k = 3$ (input size), so $W_0$ is $4 \\times 3$. Use rank $r = 1$,
       so $B$ is $4 \\times 1$ and $A$ is $1 \\times 3$. Let the trained factors be:</p>
       <p>$$ B = \\begin{bmatrix} 1 \\\\ 0 \\\\ 2 \\\\ -1 \\end{bmatrix}\\;(4\\times 1), \\qquad
            A = \\begin{bmatrix} 1 & 0 & -1 \\end{bmatrix}\\;(1\\times 3). $$</p>
       <ul class="steps">
        <li><b>Form the update $\\Delta W = B A$.</b> Multiplying the $4\\times 1$ column by the $1\\times 3$ row
        gives a $4\\times 3$ matrix &mdash; each row of $B$ times the whole row $A$:
        $$ B A = \\begin{bmatrix} 1\\!\\cdot\\![1,0,-1] \\\\ 0\\!\\cdot\\![1,0,-1] \\\\ 2\\!\\cdot\\![1,0,-1] \\\\ -1\\!\\cdot\\![1,0,-1] \\end{bmatrix}
        = \\begin{bmatrix} 1 & 0 & -1 \\\\ 0 & 0 & 0 \\\\ 2 & 0 & -2 \\\\ -1 & 0 & 1 \\end{bmatrix}. $$
        Notice every row is a multiple of $[1, 0, -1]$ &mdash; that is what "rank $1$" means: one independent
        direction.</li>
        <li><b>Apply the $\\alpha/r$ scale.</b> With $\\alpha = 2$ and $r = 1$ the factor is $\\alpha/r = 2$, so
        the actual weight update is $2\\,B A$. Its first row is $2\\cdot[1, 0, -1] = [2, 0, -2]$.</li>
        <li><b>Count trainable parameters.</b> LoRA trains only $B$ and $A$: $B$ has $4\\times 1 = 4$ numbers,
        $A$ has $1\\times 3 = 3$ numbers, total $4 + 3 = 7$. Full fine-tuning of this layer would train all of
        $W_0$: $4\\times 3 = 12$ numbers. So even on this toy $4\\times 3$ layer, rank-$1$ LoRA trains
        $7$ instead of $12$. On real layers where $d, k$ are in the thousands, $r(d+k)$ is a tiny sliver of
        $d\\,k$.</li>
       </ul>
       <p>These exact numbers &mdash; the $B A$ matrix, the scaled first row $[2, 0, -2]$, and the counts $7$ vs
       $12$ &mdash; are recomputed in the notebook's first cell so you can check them.</p>`,
    recipe:
      `<ol>
        <li><b>Build and pretrain a small net</b> with <code>torch.nn</code> on a base task. This stands in for
        the "large pretrained model."</li>
        <li><b>Freeze it:</b> set <code>requires_grad_(False)</code> on every base parameter. The base weights
        $W_0$ never change again.</li>
        <li><b>Add a LoRA module</b> to one linear layer: trainable $A$ of shape $r \\times k$ (random Gaussian)
        and $B$ of shape $d \\times r$ (<b>zeros</b>). The adapted output is
        $h = W_0 x + \\tfrac{\\alpha}{r}(B A)x$.</li>
        <li><b>Adapt to a NEW task</b> by training only $B$ and $A$ on a small new-task training set. Sweep the
        rank $r \\in \\{1, 2, 4, 8\\}$.</li>
        <li><b>Baseline:</b> full fine-tuning &mdash; unfreeze the whole net and train all weights on the same
        new-task data.</li>
        <li><b>Compare:</b> plot held-out new-task accuracy against the number of trainable parameters, full
        fine-tuning versus LoRA at each $r$. <b>Ablate</b> by checking the update is exactly zero at init
        (because $B = 0$).</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): "Compared to GPT-3 175B fine-tuned with Adam, LoRA can reduce the number of
       trainable parameters by 10,000 times and the GPU memory requirement by 3 times." (Abstract)</p>
       <p>On storage, the paper reports (&sect;4.2, quoted): "the checkpoint size is reduced by roughly
       10,000&times; (from 350GB to 35MB)," and "we reduce the VRAM consumption during training from 1.2TB to
       350GB" &mdash; for GPT-3 175B with LoRA rank $r = 4$ applied to the query and value projection matrices.
       The paper's experiments (&sect;5) report that LoRA matches or exceeds full fine-tuning quality on GLUE,
       WikiSQL, and GPT-3 tasks despite the far smaller trainable footprint.</p>
       <p><i>These are the paper's own statements, quoted from the abstract and &sect;4.2. The numbers in the
       CODEVIZ panel below are from our own tiny run on a toy task &mdash; not the paper's reported results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper. The layers and optimizers already ship in PyTorch, so
       you <b>import</b> them and build only the novel composition. <b>Import:</b> <code>nn.Linear</code>,
       <code>nn.ReLU</code> for the small net, <code>F.cross_entropy</code> for the loss, and
       <code>torch.optim.Adam</code>. <b>Build by hand:</b> the <b>LoRA update</b> &mdash; a module holding the
       trainable factors $A$ (random Gaussian) and $B$ (zeros), whose forward returns
       $\\tfrac{\\alpha}{r}(B A)x$, added to the frozen layer's output. The crucial steps PyTorch will not do for
       you: <b>freezing</b> the base weights (<code>requires_grad_(False)</code>), <b>zero-initializing</b> $B$
       so the update starts at $0$, and <b>scaling</b> by $\\alpha/r$. The general "freeze a pretrained model and
       adapt it" framing is recapped from the <b>fs-transfer-learning</b> concept lesson, not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting to freeze the base weights.</b> If you leave the pretrained layers trainable, you are
        doing full fine-tuning <i>plus</i> a LoRA path, not LoRA. The whole point is that $W_0$ stays fixed.
        <b>Fix:</b> call <code>requires_grad_(False)</code> on every base parameter before training, and pass
        <i>only</i> the LoRA parameters to the optimizer.</li>
        <li><b>Initializing $B$ to random instead of zero.</b> If $B$ is random, the update $B A$ is nonzero at
        step 0, so the model starts as a random perturbation of the pretrained model and can degrade before it
        recovers. <b>Fix:</b> $B = 0$ (and $A$ random) so $\\Delta W = 0$ at init &mdash; training starts from
        the known-good pretrained point.</li>
        <li><b>Initializing BOTH $A$ and $B$ to zero.</b> Then the update is zero and its gradient with respect
        to $B$ (which depends on $A x$) is also zero &mdash; the factors never move and LoRA learns nothing.
        <b>Fix:</b> exactly one factor random ($A$), the other zero ($B$).</li>
        <li><b>Dropping the $\\alpha/r$ scale.</b> Without it, changing $r$ changes the update's magnitude, so a
        learning rate tuned at one rank misbehaves at another. <b>Fix:</b> always multiply by $\\alpha/r$; treat
        $\\alpha$ as a fixed hyperparameter.</li>
        <li><b>Choosing $r$ too small for the task.</b> If the change the task needs is richer than rank $r$ can
        express, LoRA underfits. In our run rank $1$ lags; a small bump to rank $2$ already matches full
        fine-tuning. <b>Fix:</b> sweep $r$; pick the smallest rank that closes the gap.</li>
      </ul>`,
    recall: [
      "Write the LoRA forward pass $h = W_0 x + \\tfrac{\\alpha}{r} B A x$ from memory, with the shapes of $B$ and $A$.",
      "How are $A$ and $B$ initialized, and why does that make $\\Delta W$ zero at the start of training?",
      "Define $r$ and $\\alpha$, and say which of $W_0, A, B$ are trainable.",
      "Why divide the update by $r$? What would you have to re-tune without it?",
      "For a $d\\times k$ layer at rank $r$, how many parameters does LoRA train, versus full fine-tuning?"
    ],
    practice: [
      {
        q: `<b>The rank sweep (ablation).</b> You adapt a frozen net to a new task with LoRA at ranks
            $r \\in \\{1, 2, 4, 8\\}$ and also with full fine-tuning. As $r$ grows, what happens to the number of
            trainable parameters and to accuracy? At what point does LoRA match full fine-tuning?`,
        steps: [
          { do: `Count trainable params per rank: LoRA trains $r(d+k)$ for the adapted layer; full fine-tuning trains every weight in the net.`, why: `Each unit of rank adds one $d$-vector ($B$) and one $k$-vector ($A$), i.e. $d+k$ parameters, so the count grows linearly in $r$.` },
          { do: `Adapt at each $r$ and read held-out accuracy. Expect very low $r$ to underfit, then accuracy to plateau once $r$ is large enough to express the task's update.`, why: `If the needed change has low intrinsic rank, a small $r$ already captures it; adding more rank past that point buys little (&sect;7.2).` },
          { do: `Compare the plateau to full fine-tuning's accuracy at its (much larger) parameter count.`, why: `The headline of LoRA is matching full fine-tuning with a tiny fraction of trainable parameters.` }
        ],
        answer: `<p>Trainable parameters grow linearly with $r$ (each rank adds $d+k$). Accuracy rises with $r$
                 and then plateaus: in our run rank $1$ (64 trainable params) reaches only ~0.64 test accuracy,
                 but rank $2$ (128 params) already hits ~0.99 &mdash; matching full fine-tuning's ~1.0 while
                 training about <b>11&times;</b> fewer parameters than full fine-tuning's 1476. Past rank $2$,
                 more rank adds parameters without improving accuracy. The lesson: pick the smallest $r$ that
                 closes the gap; the task's needed update is low-rank.</p>`
      },
      {
        q: `Why does LoRA initialize $B$ to <b>zero</b> and $A$ to random, rather than both random or both zero?
            Reason through what the update and its gradient are at step 0 in each case.`,
        steps: [
          { do: `Both random: $B A \\neq 0$ at init, so the adapted model $W_0 x + \\tfrac{\\alpha}{r}BAx$ differs from the pretrained model from the start.`, why: `You begin from a random perturbation of the good pretrained weights, which can hurt before training recovers.` },
          { do: `Both zero: $B A = 0$ and the gradient of the loss w.r.t. $B$ is proportional to $A x = 0$, so $B$ cannot move; symmetrically $A$ cannot move. The update is frozen at zero.`, why: `Gradient through the bottleneck needs at least one factor nonzero to be nonzero.` },
          { do: `$B = 0$, $A$ random: $B A = 0$ at init (model = pretrained), but $\\partial \\text{loss}/\\partial B \\propto A x \\neq 0$, so $B$ moves on step 1 and the update grows from zero.`, why: `Best of both: start from the known-good point AND keep gradients flowing.` }
        ],
        answer: `<p>$B = 0$, $A$ random is the only choice that both (a) makes $\\Delta W = B A = 0$ at init &mdash;
                 so the adapted model equals the pretrained model and training starts from a good point &mdash;
                 and (b) keeps a nonzero gradient on $B$ (it depends on $A x$, and $A$ is random) so the factors
                 can actually learn. Both-random loses (a); both-zero loses (b) and the update is stuck at zero
                 forever. The paper (&sect;4.1) states it directly: random Gaussian $A$, zero $B$, so
                 $\\Delta W = B A$ is zero at the beginning of training.</p>`
      },
      {
        q: `In the worked example you had $d = 4$, $k = 3$, rank $r = 1$, with
            $B = [1, 0, 2, -1]^\\top$ and $A = [1, 0, -1]$, giving $B A$ rank-$1$ and $7$ trainable params versus
            $12$ for full fine-tuning. Now suppose the layer is realistic: $d = k = 1000$. Compute the trainable
            parameter counts for full fine-tuning and for LoRA at $r = 1$ and $r = 8$. What is the ratio?`,
        steps: [
          { do: `Full fine-tuning trains all of $W_0$: $d \\times k = 1000 \\times 1000 = 1{,}000{,}000$ parameters.`, why: `Every entry of the $d\\times k$ weight matrix is free.` },
          { do: `LoRA at $r$ trains $B$ ($d\\times r$) plus $A$ ($r\\times k$): $r(d+k) = r(1000+1000) = 2000\\,r$. So $r=1$ gives $2000$; $r=8$ gives $16{,}000$.`, why: `Each rank adds one column to $B$ and one row to $A$, i.e. $d+k = 2000$ parameters.` },
          { do: `Ratio to full: $r=1$ trains $2000/1{,}000{,}000 = 0.2\\%$; $r=8$ trains $16{,}000/1{,}000{,}000 = 1.6\\%$.`, why: `The saving grows with the layer size: $r(d+k)$ shrinks relative to $d\\,k$ as $d,k$ grow.` }
        ],
        answer: `<p>Full fine-tuning trains $1{,}000{,}000$ parameters. LoRA trains $r(d+k) = 2000\\,r$:
                 $2{,}000$ at $r=1$ ($0.2\\%$ of full) and $16{,}000$ at $r=8$ ($1.6\\%$ of full). The bigger the
                 layer, the more lopsided the saving &mdash; which is exactly why LoRA's reductions explode at
                 GPT-3 scale (the abstract quotes <b>10,000&times;</b> fewer trainable parameters). The toy
                 $4\\times 3$ example only saved $7$ vs $12$ because $d, k$ were tiny; the mechanism is the same,
                 the payoff scales with $d\\,k$.</p>`
      }
    ]
  });

  window.CODE["paper-lora"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>compose</b> a small net with <code>nn.Linear</code> / <code>nn.ReLU</code> and pretrain
       it on a base task, then build the <b>novel</b> part by hand &mdash; a LoRA update on one hidden layer.
       We <b>freeze</b> every base weight (<code>requires_grad_(False)</code>), add a module with trainable
       $A$ (random Gaussian, shape $r\\times k$) and $B$ (<b>zeros</b>, shape $d\\times r$), and make the layer
       output $h = W_0 x + \\tfrac{\\alpha}{r}(B A)x$ (Eqn. 3, &sect;4.1). Then we adapt the frozen net to a
       <b>new</b> task two ways &mdash; full fine-tuning (all weights) versus LoRA (only $B, A$) &mdash; sweeping
       the rank $r \\in \\{1,2,4,8\\}$, and compare held-out accuracy at each trainable-parameter count. The first
       cell recomputes the worked example: $B A$ for the $r=1$ case, the $\\alpha/r$-scaled first row
       $[2,0,-2]$, and the counts $7$ (LoRA) vs $12$ (full). CPU, a few hundred fast iterations. Paste into
       Colab and run.</p>`,
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np, copy
torch.manual_seed(0); np.random.seed(0)

# --- 0. Worked example: rank-1 LoRA update on a 4x3 layer; count trainable params. ---
B = torch.tensor([[1.],[0.],[2.],[-1.]])      # d x r  = 4 x 1
A = torch.tensor([[1., 0., -1.]])             # r x k  = 1 x 3
BA = B @ A                                    # 4 x 3, rank 1
print("worked: BA =\\n", BA)                   # rows are multiples of [1,0,-1]
print("worked: (alpha/r)*BA row0  (alpha=2,r=1) =", (2.0/1.0)*BA[0])   # [2,0,-2]
print("worked: LoRA trainable params (r=1) = B(4*1)+A(1*3) =", 4*1+1*3,
      " vs full W = 4*3 =", 4*3)
# worked: (alpha/r)*BA row0 (alpha=2,r=1) = tensor([ 2.,  0., -2.])
# worked: LoRA trainable params (r=1) = 7  vs full W = 12


# --- 1. A small net, composed with torch.nn. Stands in for a "pretrained model". ---
D_IN, H, N_CLS = 8, 32, 4
class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1  = nn.Linear(D_IN, H)
        self.fc2  = nn.Linear(H, H)            # the layer we will adapt with LoRA (d=k=H)
        self.head = nn.Linear(H, N_CLS)
    def forward(self, x, lora=None):
        x = torch.relu(self.fc1(x))
        h = self.fc2(x)                        # W0 x  (frozen base)
        if lora is not None: h = h + lora(x)   # + (alpha/r) B A x
        return self.head(torch.relu(h))

# --- 2. Two tasks: pretrain on task A, then adapt to a DIFFERENT new task B. ---
def make_blobs(centers, n, noise=0.6, seed=0):
    rng = np.random.RandomState(seed); X, y = [], []
    for c, mu in enumerate(centers):
        X.append(rng.randn(n, D_IN)*noise + mu); y += [c]*n
    X = np.concatenate(X); y = np.array(y); p = rng.permutation(len(y))
    return X[p], y[p]
rc = np.random.RandomState(1)
centersA = rc.randn(N_CLS, D_IN)*2.0; centersB = rc.randn(N_CLS, D_IN)*2.0
XA, yA       = make_blobs(centersA, 400, seed=10)
XBtr, yBtr   = make_blobs(centersB,  60, seed=20)   # SMALL new-task train set
XBte, yBte   = make_blobs(centersB, 400, seed=21)
T  = lambda a: torch.tensor(a, dtype=torch.float32)
Ti = lambda a: torch.tensor(a, dtype=torch.long)
def acc(m, X, y, lora=None):
    with torch.no_grad():
        return (m(T(X), lora).argmax(1) == Ti(y)).float().mean().item()

net = Net(); opt = torch.optim.Adam(net.parameters(), lr=1e-2)
for _ in range(300):
    opt.zero_grad(); F.cross_entropy(net(T(XA)), Ti(yA)).backward(); opt.step()
print("\\nfrozen net on base task A acc:", round(acc(net, XA, yA), 3))
print("frozen net (no adapt) on NEW task B acc:", round(acc(net, XBte, yBte), 3))

# --- 3. The NOVEL part, by hand: a LoRA module. B=0, A=Gaussian, scaled by alpha/r. ---
class LoRA(nn.Module):
    def __init__(self, d, k, r, alpha):
        super().__init__()
        self.A = nn.Parameter(torch.randn(r, k) * 0.01)   # random Gaussian
        self.B = nn.Parameter(torch.zeros(d, r))          # ZERO -> update is 0 at init
        self.scale = alpha / r                            # the alpha/r scaling (Sec 4.1)
    def forward(self, x):
        return (x @ self.A.t() @ self.B.t()) * self.scale # (alpha/r) * (B A) x

count = lambda ps: sum(p.numel() for p in ps if p.requires_grad)

# --- 4. Baseline: FULL fine-tuning (unfreeze everything) on the new task. ---
full = copy.deepcopy(net)
for p in full.parameters(): p.requires_grad_(True)
fopt = torch.optim.Adam(full.parameters(), lr=1e-2)
for _ in range(400):
    fopt.zero_grad(); F.cross_entropy(full(T(XBtr)), Ti(yBtr)).backward(); fopt.step()
full_n, full_a = count(list(full.parameters())), acc(full, XBte, yBte)
print("\\nFULL fine-tune : trainable params = %4d  test acc = %.3f" % (full_n, full_a))

# --- 5. LoRA: freeze the net, train only B,A on the new task. Sweep rank r. ---
for r in [1, 2, 4, 8]:
    for p in net.parameters(): p.requires_grad_(False)   # W0 stays frozen
    lora = LoRA(H, H, r, alpha=8)
    lopt = torch.optim.Adam(lora.parameters(), lr=1e-2)  # ONLY LoRA params
    for _ in range(400):
        lopt.zero_grad(); F.cross_entropy(net(T(XBtr), lora), Ti(yBtr)).backward(); lopt.step()
    print("LoRA r=%d       : trainable params = %4d  test acc = %.3f"
          % (r, count(list(lora.parameters())), acc(net, XBte, yBte, lora)))

# --- 6. Ablation / check: at init (B=0) the update is exactly zero. ---
lora0 = LoRA(H, H, 4, 8)
print("\\nLoRA update at init (B=0), max abs over a batch:",
      round(lora0(torch.randn(16, H)).abs().max().item(), 8), "(should be 0.0)")

# Our small run, not the paper's numbers. Typical output:
#   frozen net (no adapt) on NEW task B acc: 0.188
#   FULL fine-tune : trainable params = 1476  test acc = 1.000
#   LoRA r=1       : trainable params =   64  test acc = 0.640
#   LoRA r=2       : trainable params =  128  test acc = 0.992
#   LoRA r=4       : trainable params =  256  test acc = 0.999
#   LoRA r=8       : trainable params =  512  test acc = 0.998
#   LoRA update at init (B=0): 0.0`
  };

  window.CODEVIZ["paper-lora"] = {
    question: "Adapting a FROZEN net to a new task: how does held-out accuracy trade off against the number of trainable parameters, for full fine-tuning versus LoRA at ranks r = 1, 2, 4, 8?",
    charts: [
      {
        type: "line",
        title: "New-task test accuracy vs trainable-parameter count — full fine-tune vs LoRA (rank sweep)",
        xlabel: "number of trainable parameters (log scale would compress; shown linear)",
        ylabel: "held-out new-task accuracy (400 test points)",
        series: [
          {
            name: "LoRA (sweep r=1,2,4,8)",
            color: "#7ee787",
            points: [[64,0.640],[128,0.992],[256,0.999],[512,0.998]]
          },
          {
            name: "Full fine-tuning (all weights)",
            color: "#ff7b72",
            points: [[1476,1.000]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A small net (8&rarr;32&rarr;32&rarr;4, ReLU) is pretrained on a base task, then FROZEN and adapted to a different new task (60 train / 400 test points, 4 classes). Without adaptation the frozen net scores only ~0.19 on the new task. LoRA trains just B and A on the fc2 layer (alpha=8): rank 1 (64 trainable params) reaches 0.640, but rank 2 (128 params) already hits 0.992 — matching full fine-tuning's 1.000 while training ~11x fewer parameters than full fine-tuning's 1476. Each rank adds d+k=64 trainable params; accuracy plateaus once the rank is large enough to express the task's update. The takeaway: a tiny low-rank update recovers full-fine-tuning accuracy at a fraction of the trainable-parameter count.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, numpy as np, copy
torch.manual_seed(0); np.random.seed(0)

D_IN, H, N_CLS = 8, 32, 4
class Net(nn.Module):
    def __init__(s):
        super().__init__()
        s.fc1=nn.Linear(D_IN,H); s.fc2=nn.Linear(H,H); s.head=nn.Linear(H,N_CLS)
    def forward(s,x,lora=None):
        x=torch.relu(s.fc1(x)); h=s.fc2(x)
        if lora is not None: h=h+lora(x)
        return s.head(torch.relu(h))
class LoRA(nn.Module):
    def __init__(s,d,k,r,alpha):
        super().__init__()
        s.A=nn.Parameter(torch.randn(r,k)*0.01); s.B=nn.Parameter(torch.zeros(d,r)); s.scale=alpha/r
    def forward(s,x): return (x@s.A.t()@s.B.t())*s.scale

def blobs(centers,n,noise=0.6,seed=0):
    rng=np.random.RandomState(seed); X,y=[],[]
    for c,mu in enumerate(centers): X.append(rng.randn(n,D_IN)*noise+mu); y+=[c]*n
    X=np.concatenate(X); y=np.array(y); p=rng.permutation(len(y)); return X[p],y[p]
rc=np.random.RandomState(1); cA=rc.randn(N_CLS,D_IN)*2.0; cB=rc.randn(N_CLS,D_IN)*2.0
XA,yA=blobs(cA,400,seed=10); Xtr,ytr=blobs(cB,60,seed=20); Xte,yte=blobs(cB,400,seed=21)
T=lambda a: torch.tensor(a,dtype=torch.float32); Ti=lambda a: torch.tensor(a,dtype=torch.long)
def acc(m,X,y,lora=None):
    with torch.no_grad(): return (m(T(X),lora).argmax(1)==Ti(y)).float().mean().item()
cnt=lambda ps: sum(p.numel() for p in ps if p.requires_grad)

# pretrain base task, then freeze
net=Net(); o=torch.optim.Adam(net.parameters(),lr=1e-2)
for _ in range(300): o.zero_grad(); F.cross_entropy(net(T(XA)),Ti(yA)).backward(); o.step()
print("no-adapt new-task acc:", round(acc(net,Xte,yte),3))

# full fine-tuning baseline
full=copy.deepcopy(net)
for p in full.parameters(): p.requires_grad_(True)
fo=torch.optim.Adam(full.parameters(),lr=1e-2)
for _ in range(400): fo.zero_grad(); F.cross_entropy(full(T(Xtr)),Ti(ytr)).backward(); fo.step()
print("FULL:", cnt(list(full.parameters())), round(acc(full,Xte,yte),3))

# LoRA rank sweep
for r in [1,2,4,8]:
    for p in net.parameters(): p.requires_grad_(False)
    lora=LoRA(H,H,r,alpha=8); lo=torch.optim.Adam(lora.parameters(),lr=1e-2)
    for _ in range(400): lo.zero_grad(); F.cross_entropy(net(T(Xtr),lora),Ti(ytr)).backward(); lo.step()
    print("LoRA r=%d:"%r, cnt(list(lora.parameters())), round(acc(net,Xte,yte,lora),3))
# no-adapt new-task acc: 0.188
# FULL: 1476 1.0
# LoRA r=1: 64 0.64
# LoRA r=2: 128 0.992
# LoRA r=4: 256 0.999
# LoRA r=8: 512 0.998
# Our small run, not the paper's number.`
  };
})();
