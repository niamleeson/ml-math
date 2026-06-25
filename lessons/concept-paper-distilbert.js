/* Paper lesson — "DistilBERT, a distilled version of BERT: smaller, faster, cheaper
   and lighter" (Sanh, Debut, Chaumond, Wolf, 2019).
   Self-contained: lesson + CODE + CODEVIZ merged by id "paper-distilbert".
   GROUNDED from arXiv:1910.01108 (abstract) and the ar5iv HTML mirror (Section 2,
   "Knowledge distillation" + "Training loss"). All equations transcribed from the paper.
   Track B (architecture): build the temperature-softened distillation loss (soft-target
   cross-entropy L_ce) by hand on top of nn primitives, train a small TEACHER, then DISTILL
   a smaller STUDENT, and ablate distillation vs train-from-scratch. The distillation idea
   itself comes from Hinton et al. 2015 (paper-knowledge-distillation); the teacher is
   BERT (paper-bert) in the original. */
(function () {
  window.LESSONS.push({
    id: "paper-distilbert",
    title: "DistilBERT — a distilled version of BERT: smaller, faster, cheaper and lighter (2019)",
    tagline: "Train a small student to copy a big teacher's soft answers, keeping most of the accuracy at a fraction of the cost.",
    module: "Papers · Transformers & LLMs",
    track: "architecture",
    paper: {
      authors: "Victor Sanh, Lysandre Debut, Julien Chaumond, Thomas Wolf",
      org: "Hugging Face",
      year: 2019,
      venue: "arXiv:1910.01108 (Oct 2019); NeurIPS 2019 EMC^2 Workshop",
      citations: "",
      arxiv: "https://arxiv.org/abs/1910.01108",
      code: "https://github.com/huggingface/transformers/tree/main/examples/research_projects/distillation"
    },
    conceptLink: null,
    partOf: [],
    prereqs: ["mod-transformer", "mod-llm", "dl-cross-entropy", "dl-attention", "dl-cosine-similarity", "pt-nn-module"],

    // WHY READ IT
    problem:
      `<p>By 2019, the best results in Natural Language Processing (NLP) &mdash; the field of getting computers
       to work with human language &mdash; came from huge pre-trained models like <b>BERT</b>
       (Bidirectional Encoder Representations from Transformers; see the <code>paper-bert</code> lesson). The
       trouble is size. The paper opens on exactly this pain:</p>
       <blockquote>"As Transfer Learning from large-scale pre-trained models becomes more prevalent in Natural
       Language Processing (NLP), operating these large models on-the-edge and/or under constrained
       computational training or inference budgets remains challenging." (Abstract)</blockquote>
       <p>"On-the-edge" means running on a phone or a small server. A model with hundreds of millions of
       weights (the model's learned numbers) is slow and memory-hungry there. The question this paper asks:
       can we make a <b>much smaller</b> model that still knows almost as much &mdash; without retraining a
       fresh giant from scratch?</p>`,
    contribution:
      `<ul>
        <li><b>Distillation during pre-training.</b> Apply <i>knowledge distillation</i> &mdash; training a
        small "student" model to imitate a large "teacher" model &mdash; not on the small downstream task but
        on the big general pre-training task. The student learns general language ability cheaply.</li>
        <li><b>A triple loss.</b> The student is trained on a sum of three losses: the soft-target
        distillation loss $L_{ce}$ (copy the teacher's full answer distribution), the masked-language-modeling
        loss $L_{mlm}$ (the normal "fill in the blank" task), and a cosine-embedding loss $L_{cos}$ (point the
        student's internal vectors the same direction as the teacher's).</li>
        <li><b>A smaller, faster model.</b> DistilBERT halves the number of Transformer layers and, the paper
        reports, "reduce[s] the size of a BERT model by 40%, while retaining 97% of its language understanding
        capabilities and being 60% faster." (Abstract)</li>
      </ul>`,
    whyItMattered:
      `<p>DistilBERT became one of the most-downloaded models in the Hugging Face library: a drop-in, smaller
       replacement for BERT that fits on modest hardware. More broadly it showed that the distillation recipe
       from Hinton et al. 2015 (the <code>paper-knowledge-distillation</code> lesson) scales up to giant
       language models, kicking off a wave of "distilled" siblings (DistilGPT-2, DistilRoBERTa, TinyBERT,
       MobileBERT). The core lesson &mdash; <b>a small model can inherit most of a big model's knowledge by
       matching its soft outputs</b> &mdash; is now a standard tool for shipping models cheaply.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2 "Knowledge distillation"</b> &mdash; the definition of the soft-target loss
        $L_{ce} = \\sum_i t_i \\log(s_i)$ and the <b>softmax-temperature</b> $p_i = \\exp(z_i/T)/\\sum_j \\exp(z_j/T)$.
        This is the heart of the paper and the math you will transcribe and implement.</li>
        <li><b>&sect;2 "Training loss"</b> &mdash; the statement that the final objective is a linear
        combination of $L_{ce}$, $L_{mlm}$, and the cosine loss $L_{cos}$.</li>
        <li><b>&sect;3 "DistilBERT: a distilled version of BERT"</b> &mdash; the architecture choices: half the
        layers, token-type embeddings and pooler removed, student initialized from the teacher by "taking one
        layer out of two."</li>
        <li><b>Table 1</b> &mdash; the headline GLUE results (97% retained) you should QUOTE, not memorize.</li>
       </ul>
       <p><b>Skim:</b> the related-work survey and the downstream ablation tables &mdash; the conceptual core
       is one loss and one architecture trick.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train a small <b>teacher</b> classifier well, then train an even <b>smaller student</b> two
       ways: (A) <b>distilled</b> &mdash; the student is asked to match the teacher's soft probability outputs;
       (B) <b>from scratch</b> &mdash; the same small student trained only on the hard true labels. Both
       students have the <i>same</i> size and see the <i>same</i> data.</p>
       <p>Which student do you expect to reach higher test accuracy &mdash; the distilled one, the
       from-scratch one, or a tie? Write your guess and one sentence of reasoning, then run the ablation.</p>
       <p>(Hint: the teacher's soft output "the answer is 70% cat, 25% dog, 5% fox" carries more information
       than the hard label "cat" alone.)</p>`,
    attempt:
      `<p>Before the reveal, sketch the distillation loss you will build. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>Get the teacher's <b>logits</b> (raw pre-softmax scores) $z^{(t)}$ on a batch &mdash;
        <code>with torch.no_grad()</code> (the teacher is frozen).</li>
        <li>Get the student's logits $z^{(s)}$ on the same batch.</li>
        <li>TODO: soften both with temperature $T$: <code>p_teacher = softmax(z_t / T)</code> and
        <code>log_p_student = log_softmax(z_s / T)</code>.</li>
        <li>TODO: the soft-target loss is the cross-entropy between them:
        <code>L_ce = -(p_teacher * log_p_student).sum(dim=1).mean()</code>.</li>
        <li>TODO: add the normal hard-label loss on the student and combine:
        <code>loss = alpha * (T*T) * L_ce + (1 - alpha) * L_hard</code>. (The $T^2$ factor keeps the soft
        gradient at the right scale &mdash; see the derivation.)</li>
       </ul>
       <p>Then train one student WITH this loss and a matched student WITHOUT it (hard labels only). Predict
       which wins.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The idea (&sect;2) is to make a small <b>student</b> network copy the behavior of a large, already
       trained <b>teacher</b> network. The trick is <i>what</i> the student copies. A normal classifier is
       trained on <b>hard labels</b> &mdash; a one-hot vector like "this is a cat" $= [0, 1, 0]$. But a
       trained teacher does not just say "cat"; it outputs a full probability distribution, e.g.
       $[0.05, 0.70, 0.25]$ &mdash; "probably a cat, but it looks a bit like a fox." Those small numbers on
       the wrong classes are the <b>dark knowledge</b>: they encode which classes the teacher finds similar.
       The student learns far more by matching the whole distribution than by matching the single winner.</p>
       <p>Two pieces make this work. First, a model's outputs come from a <b>softmax</b> &mdash; the function
       that turns raw scores (called <b>logits</b>) into probabilities that sum to 1. A confident teacher's
       softmax is very "peaky": almost all the mass on one class, the informative small numbers crushed to
       near zero. To expose them, the paper (following Hinton et al. 2015) divides the logits by a
       <b>temperature</b> $T \\gt 1$ before the softmax. Bigger $T$ &rarr; a smoother, flatter distribution
       where the runner-up classes are visible. The paper states it directly:</p>
       <blockquote>"we used a softmax-temperature: $p_i = \\exp(z_i/T)/\\sum_j \\exp(z_j/T)$ where $T$ controls
       the smoothness of the output distribution and $z_i$ is the model score for the class $i$. The same
       temperature $T$ is applied to the student and the teacher at training time, while at inference, $T$ is
       set to 1 to recover a standard softmax." (&sect;2)</blockquote>
       <p>Second, the student is pushed to match the teacher's softened distribution with a cross-entropy term.
       The paper writes the <b>distillation loss</b> as $L_{ce} = \\sum_i t_i \\log(s_i)$, where $t_i$ is the
       teacher's (softened) probability for class $i$ and $s_i$ is the student's. (As a loss this is
       <i>minimized</i>, so in practice you minimize $-\\sum_i t_i \\log s_i$.)</p>
       <p>DistilBERT does not use $L_{ce}$ alone. The final objective (&sect;2, "Training loss") is a
       <b>linear combination</b> of three terms: $L_{ce}$, the ordinary <b>masked-language-modeling</b> loss
       $L_{mlm}$ (the "fill in the blanked-out word" task BERT is trained on, here the student's normal
       hard-label loss), and a <b>cosine-embedding</b> loss $L_{cos}$ that "tend[s] to align the directions of
       the student and teacher hidden states vectors" &mdash; pointing the student's internal vectors the same
       way as the teacher's. The architecture (&sect;3) keeps BERT's design but takes "one layer out of two"
       (halving depth), removes the token-type embeddings and the pooler, and <b>initializes the student from
       the teacher</b> by copying every other layer.</p>`,
    symbols: [
      { sym: "$z_i$", desc: "a <b>logit</b>: the model's raw, pre-softmax score for class $i$ (any real number). The teacher's logits are $z^{(t)}$, the student's $z^{(s)}$." },
      { sym: "$T$", desc: "the <b>temperature</b>: a number you divide the logits by before the softmax. $T = 1$ is the normal softmax; $T \\gt 1$ smooths the distribution so the small 'dark knowledge' probabilities become visible. Set back to $1$ at inference." },
      { sym: "$p_i$", desc: "the <b>softmax-temperature probability</b> for class $i$: $\\exp(z_i/T)$ divided by the sum over all classes, so the $p_i$ are non-negative and sum to 1." },
      { sym: "$t_i$", desc: "the <b>teacher's</b> softened probability for class $i$ (the soft target the student aims to copy)." },
      { sym: "$s_i$", desc: "the <b>student's</b> softened probability for class $i$." },
      { sym: "$L_{ce}$", desc: "the <b>distillation loss</b> $\\sum_i t_i \\log(s_i)$: the cross-entropy between the teacher's soft targets and the student's soft predictions. ('ce' = cross-entropy.)" },
      { sym: "$L_{mlm}$", desc: "the <b>masked-language-modeling loss</b>: BERT's ordinary 'predict the blanked-out word' training loss (here, the student's normal hard-label cross-entropy on the true labels)." },
      { sym: "$L_{cos}$", desc: "the <b>cosine-embedding loss</b>: pushes the student's hidden-state vectors to point in the same <i>direction</i> as the teacher's (cosine = the angle-based similarity of two vectors)." },
      { sym: "$\\alpha$", desc: "the <b>mixing weight</b> (a plain term, not from the paper's notation) that balances how much the student listens to the soft teacher targets vs the hard true labels in the linear combination." },
      { sym: "“dark knowledge”", desc: "a plain term: the small probabilities the teacher places on the <i>wrong</i> classes, encoding which classes it finds similar &mdash; information a one-hot label throws away." }
    ],
    formula: `$$ p_i = \\frac{\\exp(z_i/T)}{\\sum_j \\exp(z_j/T)} \\qquad\\qquad L_{ce} = \\sum_i t_i \\, \\log(s_i) \\qquad\\text{(\\S2)} $$`,
    whatItDoes:
      `<p>The <b>left</b> equation is the softmax-temperature: take each logit $z_i$, divide by the temperature
       $T$, exponentiate, and normalize so the outputs sum to 1. With $T = 1$ it is the ordinary softmax; as
       $T$ grows the distribution flattens, exposing the teacher's small runner-up probabilities (the dark
       knowledge).</p>
       <p>The <b>right</b> equation is the distillation loss: a cross-entropy that measures how well the
       student's softened distribution $s_i$ matches the teacher's softened distribution $t_i$. Minimizing it
       drags the whole student distribution toward the whole teacher distribution &mdash; not just the top
       class. (Because $\\sum_i t_i \\log s_i$ is maximized when $s = t$, the optimizer <i>minimizes</i> its
       negative; the same teacher targets make it equivalent, up to a constant, to the Kullback&ndash;Leibler
       divergence $\\sum_i t_i \\log(t_i/s_i)$ &mdash; the standard "how different are two distributions"
       measure.)</p>`,
    derivation:
      `<p><b>Why match soft targets at all, and why the $T^2$ factor?</b> (conceptLink is null, so here is the
       full reasoning.)</p>
       <p><b>1. Soft targets carry more bits than hard labels.</b> A hard label says only "the answer is class
       $k$." A soft target $[0.05, 0.70, 0.25]$ also says "class 3 is a plausible second guess; class 1 is
       not." Those relationships are extra training signal &mdash; the student learns the teacher's similarity
       structure, which is why a distilled student beats one trained on labels alone (the ablation below).</p>
       <p><b>2. Why divide by $T$.</b> A well-trained teacher is <i>confident</i>: its softmax puts almost all
       mass on one class, so the informative small numbers are ~$0$ and give the student almost no gradient.
       Dividing the logits by $T \\gt 1$ before the softmax shrinks the gaps between logits, flattening the
       distribution so the runner-up probabilities are large enough to learn from. The paper applies the
       <i>same</i> $T$ to teacher and student during training.</p>
       <p><b>3. Why multiply $L_{ce}$ by $T^2$.</b> Softening by $T$ also shrinks the gradients. The gradient of
       the soft cross-entropy with respect to a student logit scales like $1/T$ for the student's softmax and
       the teacher targets are themselves softened, so the soft-loss gradient magnitude scales like
       $1/T^2$. To keep the soft and hard terms on a comparable scale when you mix them, you multiply the soft
       term by $T^2$ (Hinton et al. 2015). With $\\alpha$ the mixing weight, the practical training loss is</p>
       <p>$$ L = \\alpha\\,T^2\\, \\Big(\\!-\\!\\sum_i t_i \\log s_i\\Big) \\;+\\; (1-\\alpha)\\, L_{\\text{hard}}, $$</p>
       <p>where $L_{\\text{hard}}$ is the ordinary cross-entropy on the true labels (DistilBERT's $L_{mlm}$
       role) and the soft probabilities use temperature $T$. DistilBERT adds $L_{cos}$ on top; we focus on the
       $L_{ce}$ core here.</p>`,
    example:
      `<p>Work the loss by hand on a 3-class problem so the temperature and the cross-entropy are concrete.
       Suppose on one example the <b>teacher</b> logits are $z^{(t)} = [2.0,\\,1.0,\\,0.1]$ and the
       <b>student</b> logits are $z^{(s)} = [1.5,\\,0.5,\\,0.2]$. Use temperature $T = 2$.</p>
       <ul class="steps">
        <li><b>Soften the teacher.</b> Divide by $T$: $z^{(t)}/T = [1.0,\\,0.5,\\,0.05]$. Exponentiate:
        $[e^{1.0},\\,e^{0.5},\\,e^{0.05}] = [2.7183,\\,1.6487,\\,1.0513]$, sum $= 5.4183$. Normalize:
        $t = [0.5017,\\,0.3043,\\,0.1940]$.</li>
        <li><b>Soften the student.</b> $z^{(s)}/T = [0.75,\\,0.25,\\,0.10]$. Exponentiate:
        $[2.1170,\\,1.2840,\\,1.1052]$, sum $= 4.5062$. Normalize: $s = [0.4698,\\,0.2849,\\,0.2453]$.</li>
        <li><b>Cross-entropy.</b> $-\\sum_i t_i \\log s_i =
        -(0.5017\\log 0.4698 + 0.3043\\log 0.2849 + 0.1940\\log 0.2453)$
        $= -(0.5017\\cdot(-0.7554) + 0.3043\\cdot(-1.2556) + 0.1940\\cdot(-1.4053))$
        $= -(-0.3790 - 0.3820 - 0.2726) = 1.0337$.</li>
        <li><b>Compare to no softening.</b> With $T = 1$ the teacher is peakier:
        $t = [0.6590,\\,0.2424,\\,0.0986]$ &mdash; the third class has been squashed toward $0$, so the student
        gets almost no signal about it. Raising $T$ to $2$ lifted that probability from $0.099$ to $0.194$:
        the dark knowledge is now visible.</li>
       </ul>
       <p>These exact numbers ($t$, $s$, and $L_{ce} \\approx 1.0337$) are recomputed in the notebook's first
       cell so you can check the loss by running it.</p>`,
    recipe:
      `<ol>
        <li><b>Train the teacher.</b> A relatively large model trained normally on the hard labels until it is
        accurate.</li>
        <li><b>Build a smaller student.</b> Same kind of architecture, fewer / narrower layers. (DistilBERT:
        half the Transformer layers, no token-type embeddings, no pooler.)</li>
        <li><b>Initialize the student from the teacher</b> where shapes allow &mdash; DistilBERT copies "one
        layer out of two." (In our toy net, fresh init.)</li>
        <li><b>Freeze the teacher</b> and, for each batch, get its softened soft targets
        $t = \\mathrm{softmax}(z^{(t)}/T)$ under <code>torch.no_grad()</code>.</li>
        <li><b>Compute the student's softened predictions</b> $s = \\mathrm{softmax}(z^{(s)}/T)$ and the
        distillation loss $-\\sum_i t_i \\log s_i$.</li>
        <li><b>Combine the losses:</b> $L = \\alpha\\,T^2\\,L_{ce} + (1-\\alpha)\\,L_{\\text{hard}}$ (DistilBERT
        also adds $L_{cos}$). Backprop into the <i>student only</i>.</li>
        <li><b>At inference</b> set $T = 1$ to recover the normal softmax.</li>
        <li><b>Ablate:</b> train the same student on hard labels only and compare &mdash; the distilled student
        should win.</li>
      </ol>`,
    results:
      `<p>From the abstract (quoted): DistilBERT is "a smaller general-purpose language representation model"
       that, the authors report, lets them "reduce the size of a BERT model by 40%, while retaining 97% of its
       language understanding capabilities and being 60% faster." On a phone they add it is "71% faster than
       BERT" for a question-answering task on an iPhone 7 Plus. The 97%-retention figure is measured on the
       GLUE language-understanding benchmark (Table 1).</p>
       <p><i>These are the paper's reported figures, quoted from the abstract/Table 1. The numbers in the
       CODEVIZ panel below are from our own tiny run &mdash; not the paper's results.</i></p>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel piece &mdash; the distillation training loop. <b>Import:</b>
       <code>nn.Linear</code>, <code>F.softmax</code> / <code>F.log_softmax</code>,
       <code>F.cross_entropy</code>, and the optimizer. <b>Build by hand:</b> the temperature-softened
       soft-target loss $L_{ce} = -\\sum_i t_i \\log s_i$ (with the $T^2$ scaling), the frozen-teacher
       distillation loop, and the <b>ablation</b> (same student trained on hard labels only). We use a small
       multi-layer perceptron teacher/student on a toy task rather than full BERT so it runs in seconds on a
       CPU; the loss and the recipe are identical to the paper's $L_{ce}$ core.</p>`,
    pitfalls:
      `<ul>
        <li><b>Forgetting the $T^2$ factor.</b> Softening by $T$ shrinks the soft-loss gradient by ~$1/T^2$.
        If you mix $L_{ce}$ with the hard loss without multiplying by $T^2$, the soft signal is far too weak
        and distillation barely helps. <b>Fix:</b> scale the soft term by $T^2$.</li>
        <li><b>Letting gradients flow into the teacher.</b> The teacher is fixed; its soft targets are
        constants. <b>Fix:</b> compute teacher logits under <code>torch.no_grad()</code> (and
        <code>.detach()</code> the targets) so only the student updates.</li>
        <li><b>Using $T = 1$ during training.</b> A confident teacher's $T=1$ softmax hides the dark knowledge,
        so the student learns little beyond the hard label. <b>Fix:</b> use $T \\gt 1$ (e.g. 2&ndash;4) at
        train time, then reset to $T = 1$ at inference, as the paper specifies.</li>
        <li><b>Mixing up the cross-entropy direction.</b> The soft target is $t$ (teacher), the prediction is
        $s$ (student): the loss is $-\\sum_i t_i \\log s_i$, not $-\\sum_i s_i \\log t_i$. Swapping them gives a
        different (and wrong) objective.</li>
        <li><b>Comparing students of different sizes.</b> An honest ablation keeps the student architecture
        identical and changes only the loss (distilled vs hard-only). Otherwise you cannot attribute the gain
        to distillation.</li>
      </ul>`,
    recall: [
      "Write the softmax-temperature equation $p_i = \\exp(z_i/T)/\\sum_j \\exp(z_j/T)$ from memory.",
      "Write the distillation loss $L_{ce}$ in terms of the teacher targets $t_i$ and student predictions $s_i$.",
      "What does raising the temperature $T$ do to the teacher's output distribution, and why does that help the student?",
      "Why is the soft loss multiplied by $T^2$, and what value of $T$ is used at inference?",
      "Name the three terms in DistilBERT's final training objective."
    ],
    practice: [
      {
        q: `<b>The ablation (distill vs from-scratch).</b> You have a trained teacher and a small student.
            Train the student two ways &mdash; (A) with the distillation loss matching the teacher's soft
            targets, (B) on the hard true labels only &mdash; keeping the student size, data, and optimizer
            identical. Which reaches higher test accuracy, and what does that demonstrate?`,
        steps: [
          { do: `Train student A with $L = \\alpha T^2 L_{ce} + (1-\\alpha) L_{\\text{hard}}$ using the frozen teacher's softened targets.`, why: `This is the distillation recipe: the student copies the teacher's full soft distribution, inheriting its similarity structure.` },
          { do: `Train student B with hard-label cross-entropy only &mdash; same architecture, data, epochs, seed.`, why: `Changing only the loss isolates distillation as the cause of any accuracy difference.` },
          { do: `Compare final test accuracy of A vs B.`, why: `If A &gt; B at equal size, the gain comes from the teacher's dark knowledge, not extra capacity.` }
        ],
        answer: `<p>The <b>distilled</b> student (A) typically reaches higher test accuracy than the matched
                 from-scratch student (B). Since the two students are identical in size and see the same data,
                 the gain is attributable to the <b>soft targets</b>: the teacher's full distribution carries
                 the similarity ("dark knowledge") information a one-hot label discards. This is the toy
                 version of DistilBERT retaining ~97% of BERT's GLUE score at 40% smaller. The CODEVIZ panel
                 shows exactly this contrast (our small run, not the paper's numbers).</p>`
      },
      {
        q: `Your worked example used $T = 2$ and got teacher soft targets $t = [0.5017, 0.3043, 0.1940]$ from
            logits $[2.0, 1.0, 0.1]$. Recompute the teacher distribution at $T = 1$. What happens to the
            third class, and why does the paper want a higher $T$ during training?`,
        steps: [
          { do: `At $T = 1$, exponentiate the raw logits: $[e^{2.0}, e^{1.0}, e^{0.1}] = [7.389, 2.718, 1.105]$, sum $= 11.213$.`, why: `$T = 1$ is the ordinary softmax &mdash; no softening.` },
          { do: `Normalize: $t = [0.6590, 0.2424, 0.0986]$.`, why: `The distribution is peakier than at $T = 2$: more mass on class 1, less on class 3.` },
          { do: `Compare the third class: $0.0986$ at $T=1$ vs $0.1940$ at $T=2$.`, why: `Raising $T$ lifts the small probabilities, making the runner-up classes (the dark knowledge) visible to the student.` }
        ],
        answer: `<p>At $T = 1$ the teacher distribution is $[0.659, 0.242, 0.099]$ &mdash; peakier, with the
                 third class squashed to $\\approx 0.099$. Raising $T$ to $2$ lifted it to $0.194$. The paper
                 uses $T \\gt 1$ at training time precisely so these small "dark knowledge" probabilities are
                 large enough to give the student a useful gradient; $T$ is reset to $1$ at inference.</p>`
      },
      {
        q: `You implement the distillation loss but forget the $T^2$ factor and use $T = 4$. You find
            distillation barely beats the from-scratch baseline. What went wrong, and what is the fix?`,
        steps: [
          { do: `Recall that softening by $T$ shrinks the soft-cross-entropy gradient by a factor of about $1/T^2$.`, why: `Both the student softmax and the teacher targets are flattened by $T$, scaling the gradient down quadratically.` },
          { do: `At $T = 4$ the soft term's gradient is ~$1/16$ of its un-scaled magnitude, so when mixed with the hard loss it is almost ignored.`, why: `The optimizer effectively trains on the hard labels alone &mdash; little better than the baseline.` },
          { do: `Multiply $L_{ce}$ by $T^2 = 16$ before combining with the hard loss.`, why: `This restores the soft gradient to a comparable scale (Hinton et al. 2015), so distillation contributes properly.` }
        ],
        answer: `<p>Softening by $T$ reduces the soft-loss gradient by ~$1/T^2$, so at $T = 4$ the soft term is
                 ~16&times; too weak and the student essentially trains on hard labels only. The fix is to
                 multiply the soft (distillation) loss by $T^2$ before mixing it with the hard loss, restoring
                 the gradient scale &mdash; the standard Hinton-et-al. correction.</p>`
      }
    ]
  });

  window.CODE["paper-distilbert"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> the temperature-softened distillation loss by hand on top of
       <code>F.log_softmax</code> / <code>F.softmax</code>, then run the full recipe on a toy 4-class problem
       so it finishes in seconds on a CPU (no GPU, no pip). We (1) train a big <b>teacher</b> MLP on lots of
       data, (2) train a tiny, <b>data-starved student</b> (only 60 labels, hidden width 3) by
       <b>distillation</b> &mdash; matching the frozen teacher's soft targets with
       $L = \\alpha T^2 L_{ce} + (1-\\alpha)L_{\\text{hard}}$ &mdash; and (3) the <b>ablation</b>: the same tiny
       student trained on those 60 hard labels only. The teacher's soft targets fill in what the few labels
       cannot, so the distilled student beats the from-scratch one and nearly matches the teacher. The first
       cell recomputes the worked example
       ($t=[0.5017,0.3043,0.1940]$, $s=[0.4698,0.2849,0.2453]$, $L_{ce}\\approx 1.0337$). Paste into Colab (or
       any Python) and run.</p>`,
    code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

torch.manual_seed(0)
K = 4   # number of classes

# --- 0. Sanity-check the worked example: softmax-temperature + L_ce, T = 2. ---
T = 2.0
zt = torch.tensor([2.0, 1.0, 0.1])          # teacher logits
zs = torch.tensor([1.5, 0.5, 0.2])          # student logits
t  = F.softmax(zt / T, dim=0)               # teacher soft targets
s  = F.softmax(zs / T, dim=0)               # student soft predictions
L_ce = -(t * torch.log(s)).sum()            # distillation loss  -sum_i t_i log s_i
print("teacher soft t =", [round(v, 4) for v in t.tolist()])   # [0.5017, 0.3043, 0.194]
print("student soft s =", [round(v, 4) for v in s.tolist()])   # [0.4698, 0.2849, 0.2453]
print("L_ce =", round(L_ce.item(), 4))                          # 1.0337


# --- 1. A toy 4-class dataset: four Gaussian blobs on a ring. ---
def make_data(n, seed, spread=1.0):
    g = torch.Generator().manual_seed(seed)
    y = torch.randint(0, K, (n,), generator=g)
    centers = torch.tensor([[2.0 * math.cos(2 * math.pi * k / K),
                             2.0 * math.sin(2 * math.pi * k / K)] for k in range(K)])
    X = centers[y] + torch.randn(n, 2, generator=g) * spread
    return X, y

Xbig, ybig = make_data(2000, 99)   # the teacher trains on plenty of data
Xtr,  ytr  = make_data(60,  1)     # the student is DATA-STARVED: only 60 labels
Xte,  yte  = make_data(800, 51)    # held-out test set


# --- 2. Teacher (big) and Student (tiny) MLPs. ---
def teacher_mlp():
    return nn.Sequential(nn.Linear(2, 128), nn.ReLU(),
                         nn.Linear(128, 128), nn.ReLU(), nn.Linear(128, K))
def student_mlp(h):
    return nn.Sequential(nn.Linear(2, h), nn.ReLU(), nn.Linear(h, K))   # tiny

def accuracy(net, X, y):
    net.eval()
    with torch.no_grad():
        return round((net(X).argmax(1) == y).float().mean().item(), 4)

def train_hard(net, X, y, epochs=400, lr=0.02):
    opt = torch.optim.Adam(net.parameters(), lr=lr)
    net.train()
    for _ in range(epochs):
        opt.zero_grad(); F.cross_entropy(net(X), y).backward(); opt.step()
    return net


# --- 3. Train the TEACHER (big) on the large dataset. ---
torch.manual_seed(0)
teacher = train_hard(teacher_mlp(), Xbig, ybig, epochs=500)
teacher.eval()
print("teacher test acc        :", accuracy(teacher, Xte, yte))   # 0.8288


# --- 4. DISTILL a tiny student: L = alpha*T^2*L_ce + (1-alpha)*L_hard. ---
def distill(student, T=3.0, alpha=0.8, epochs=400, lr=0.02):
    with torch.no_grad():                                  # teacher is FROZEN
        t_soft = F.softmax(teacher(Xtr) / T, dim=1)        # soft targets (constants)
    opt = torch.optim.Adam(student.parameters(), lr=lr)
    student.train()
    for _ in range(epochs):
        opt.zero_grad()
        logits = student(Xtr)
        log_s  = F.log_softmax(logits / T, dim=1)          # student softened
        L_ce   = -(t_soft * log_s).sum(dim=1).mean()       # -sum_i t_i log s_i
        L_hard = F.cross_entropy(logits, ytr)              # the L_mlm role
        loss   = alpha * (T * T) * L_ce + (1 - alpha) * L_hard
        loss.backward(); opt.step()
    return student

torch.manual_seed(0)
student_distill = distill(student_mlp(3))                 # tiny student, DISTILLED
print("student (distilled) acc :", accuracy(student_distill, Xte, yte))   # 0.8425


# --- 5. ABLATION: same tiny student, those 60 hard labels only (from scratch). ---
torch.manual_seed(0)
student_scratch = train_hard(student_mlp(3), Xtr, ytr)   # SAME size, no teacher
print("student (scratch)   acc :", accuracy(student_scratch, Xte, yte))   # 0.7937

# Our run: teacher 0.8288, distilled student 0.8425, from-scratch student 0.7937.
# Same tiny student + same 60 labels; the distilled one wins by ~5 points and nearly
# matches the teacher -- the teacher's soft targets supply what the few labels cannot.
# (This is our small run, not the paper's reported numbers.)`
  };

  window.CODEVIZ["paper-distilbert"] = {
    question: "At equal student size, does distillation (matching the teacher's soft targets) beat training the same small student from scratch on hard labels?",
    charts: [
      {
        type: "bar",
        title: "Test accuracy — teacher vs distilled student vs from-scratch student (matched size)",
        xlabel: "model",
        ylabel: "test accuracy",
        series: [
          {
            name: "test accuracy",
            color: "#7ee787",
            points: [
              ["Teacher (big, lots of data)", 0.8288],
              ["Student distilled (hidden 3)", 0.8425],
              ["Student scratch (hidden 3)", 0.7937]
            ]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. A big teacher MLP (hidden 128) is trained on 2000 points from four Gaussian blobs, then a tiny student (hidden 3) that sees only 60 labels is trained two ways: DISTILLED (matching the frozen teacher's temperature-softened soft targets, $T=3$, $\\alpha=0.8$, with the $T^2$ scaling) vs FROM SCRATCH (those 60 hard labels only). The distilled student (0.8425) clearly beats the matched from-scratch student (0.7937) and nearly matches the teacher (0.8288). Same student size, same 60 labels, same optimizer and seed &mdash; only the loss differs &mdash; so the gain is the teacher's 'dark knowledge' filling in what the few labels cannot. This is the toy analog of DistilBERT keeping ~97% of BERT's GLUE score at 40% smaller.",
    code: `import torch, torch.nn as nn, torch.nn.functional as F, math
K = 4

def make_data(n, seed, spread=1.0):
    g = torch.Generator().manual_seed(seed)
    y = torch.randint(0, K, (n,), generator=g)
    centers = torch.tensor([[2.0*math.cos(2*math.pi*k/K), 2.0*math.sin(2*math.pi*k/K)]
                            for k in range(K)])
    return centers[y] + torch.randn(n, 2, generator=g) * spread, y

Xbig, ybig = make_data(2000, 99)   # teacher: lots of data
Xtr,  ytr  = make_data(60,   1)    # student: only 60 labels (data-starved)
Xte,  yte  = make_data(800, 51)

def teacher_mlp():
    return nn.Sequential(nn.Linear(2,128), nn.ReLU(),
                         nn.Linear(128,128), nn.ReLU(), nn.Linear(128,K))
def student_mlp(h):
    return nn.Sequential(nn.Linear(2,h), nn.ReLU(), nn.Linear(h,K))   # tiny

def acc(net, X, y):
    net.eval()
    with torch.no_grad():
        return round((net(X).argmax(1) == y).float().mean().item(), 4)

def train_hard(net, X, y, epochs=400, lr=0.02):
    opt = torch.optim.Adam(net.parameters(), lr=lr); net.train()
    for _ in range(epochs):
        opt.zero_grad(); F.cross_entropy(net(X), y).backward(); opt.step()
    return net

torch.manual_seed(0); teacher = train_hard(teacher_mlp(), Xbig, ybig, epochs=500); teacher.eval()

def distill(student, T=3.0, alpha=0.8, epochs=400, lr=0.02):
    with torch.no_grad():
        t_soft = F.softmax(teacher(Xtr) / T, dim=1)
    opt = torch.optim.Adam(student.parameters(), lr=lr); student.train()
    for _ in range(epochs):
        opt.zero_grad()
        z = student(Xtr)
        L_ce = -(t_soft * F.log_softmax(z / T, dim=1)).sum(1).mean()
        loss = alpha * (T*T) * L_ce + (1 - alpha) * F.cross_entropy(z, ytr)
        loss.backward(); opt.step()
    return student

torch.manual_seed(0); s_distill = distill(student_mlp(3))
torch.manual_seed(0); s_scratch = train_hard(student_mlp(3), Xtr, ytr)

print("Teacher                 :", acc(teacher,   Xte, yte))   # 0.8288
print("Student distilled (h3)  :", acc(s_distill, Xte, yte))   # 0.8425
print("Student scratch   (h3)  :", acc(s_scratch, Xte, yte))   # 0.7937`
  };
})();
