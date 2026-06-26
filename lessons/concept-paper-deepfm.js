/* Paper lesson — "DeepFM: A Factorization-Machine based Neural Network for CTR Prediction"
   (Guo, Tang, Ye, Li, He, 2017). Self-contained: lesson + CODE + CODEVIZ merged by id "paper-deepfm".
   GROUNDED from arXiv:1703.04247 (abstract) and the ar5iv HTML mirror
   (Section 2.1 architecture, Eqn 1 the y-hat sum, Eqn 2 the FM component, Eqn 3 the embedding
   layer a^(0), Eqn 4 the DNN hidden layer, and the DNN output y_DNN).
   Track B (architecture): build the FM component, the deep MLP component, and the SHARED feature
   embeddings (one embedding table feeds both), summed before the sigmoid: y-hat = sigma(y_FM + y_DNN).
   The second-order FM math is owned by the FM concept/paper; here we recap and reuse it. */
(function () {
  window.LESSONS.push({
    id: "paper-deepfm",
    title: "DeepFM — A Factorization-Machine based Neural Network for CTR Prediction (2017)",
    tagline: "One shared embedding table feeds a Factorization Machine (low-order) and a deep network (high-order); add their scores, then sigmoid.",
    module: "Papers · Recommender Systems",
    track: "architecture",
    paper: {
      authors: "Huifeng Guo, Ruiming Tang, Yunming Ye, Zhenguo Li, Xiuqiang He",
      org: "Harbin Institute of Technology & Noah's Ark Research Lab, Huawei",
      year: 2017,
      venue: "arXiv:1703.04247 (Mar 2017); IJCAI 2017",
      citations: "",
      arxiv: "https://arxiv.org/abs/1703.04247",
      code: ""
    },
    conceptLink: null,
    partOf: [],
    // VERIFIED present in window.LESSONS by grepping lessons/*.js (paper-fm is not on disk yet,
    // so it is cross-linked in prose below but NOT listed as a hard prereq).
    prereqs: ["ml-logistic-regression", "pt-nn-module", "pt-loss-optim", "pt-training-loop", "dl-word-embeddings"],

    // WHY READ IT
    problem:
      `<p><b>CTR</b> means <b>click-through rate</b>: the chance a user clicks a shown item (an ad, a product,
       a feed post). Predicting it well is how recommender systems rank what to show. The signal lives in
       <b>feature interactions</b>: maybe "app-category = food" alone says little, but "app-category = food
       <i>AND</i> time = meal-time" is a strong click signal. That is a <b>2-way</b> (order-2, pairwise)
       interaction. Some signals are even higher order &mdash; a combination of three or more features.</p>
       <p>Before this paper, models leaned one way or the other (&sect;1):</p>
       <ul>
        <li><b>Factorization Machines (FM)</b> model order-1 and order-2 interactions cheaply by giving every
        feature a small learned vector. They are great at pairwise signals but, in practice, stop at order-2.</li>
        <li><b>Deep neural networks</b> can model <b>high-order</b> interactions, but a raw deep net needs heavy
        manual <b>feature engineering</b> to expose the useful low-order combinations.</li>
        <li>Google's <b>Wide &amp; Deep</b> combined both, but its "wide" part still needed hand-crafted
        cross-features, and its wide and deep parts took <b>different inputs</b>.</li>
       </ul>
       <p>The paper's framing (abstract): existing methods "seem to have a strong bias towards low- or
       high-order interactions, or require expertise feature engineering." The goal: one end-to-end model
       that "emphasizes both low- and high-order feature interactions" with <b>no manual feature
       engineering</b>.</p>`,
    contribution:
      `<ul>
        <li><b>DeepFM = FM + Deep, in parallel.</b> An FM component learns order-1 and order-2 interactions; a
        deep MLP (multi-layer perceptron, a plain feed-forward network) learns high-order interactions. Their
        two scalar outputs are <b>added</b>, then passed through a sigmoid (&sect;2.1, Eqn. 1).</li>
        <li><b>One shared embedding.</b> Both components read the <b>same</b> dense feature embeddings. The FM
        latent vectors <i>are</i> the embedding table; the deep part flattens those same vectors as its input.
        So there is no separate feature engineering and no separate input (&sect;2.1).</li>
        <li><b>End-to-end, raw features in.</b> Unlike Wide &amp; Deep, the "wide" (FM) and "deep" parts share
        one input of raw features &mdash; train everything jointly, no hand-built cross-features.</li>
      </ul>`,
    whyItMattered:
      `<p>DeepFM became a standard baseline and a template for industrial CTR models: the "shared-embedding,
       two-tower-summed-before-sigmoid" pattern reappears across recommender architectures (xDeepFM, DCN, and
       many production rankers). The key lesson &mdash; let a factorization component and a deep component
       <b>share one embedding table</b> instead of duplicating inputs &mdash; is now a default design choice
       for click and conversion models.</p>`,

    // READING GUIDE
    readingGuide:
      `<p><b>Read closely:</b></p>
       <ul>
        <li><b>&sect;2.1 (DeepFM)</b> &mdash; the overall architecture and Eqn. 1, the headline
        $\\hat{y} = \\sigma(y_{FM} + y_{DNN})$. Note the two parts share the embedding input (Fig. 1).</li>
        <li><b>&sect;2.1.1 (FM Component)</b> &mdash; Eqn. 2, the FM with its order-1 term $\\langle w,x\\rangle$
        and order-2 term (inner products of latent vectors).</li>
        <li><b>&sect;2.1.2 (Deep Component)</b> &mdash; Eqn. 3, the embedding layer $a^{(0)}=[e_1,\\dots,e_m]$;
        Eqn. 4, the hidden layer recurrence; and the output $y_{DNN}$. The two "interesting features" sentence
        about shared embeddings is the crux.</li>
        <li><b>Fig. 1 and Fig. 2-4</b> &mdash; the diagrams showing the shared embedding layer feeding both the
        FM "addition + inner-product" units and the deep MLP.</li>
       </ul>
       <p><b>Skim:</b> &sect;3 (the full experiment tables and efficiency study) unless you want the exact
       benchmark numbers, and the related-work survey in &sect;1.</p>`,

    // PREDICT + ATTEMPT
    predict:
      `<p>You will train three models on the same synthetic CTR data, whose clicks depend on <b>both</b> a
       pairwise (order-2) signal <i>and</i> a three-way (order-3) signal: (1) <b>FM only</b>, (2) <b>deep MLP
       only</b>, (3) <b>DeepFM</b> (both, sharing one embedding table). Before running, predict the ranking by
       test <b>AUC</b> (area under the ROC curve; higher is better, $0.5$ is random). Will DeepFM beat
       <i>both</i> single-component models, or just tie the better one?</p>
       <p>(Hint: FM is built for order-2 but cannot reach order-3; a plain MLP can reach order-3 but may
       fumble the clean pairwise part. What does adding their scores buy you?)</p>`,
    attempt:
      `<p>Before the reveal, sketch the forward pass. Fill in the <code>TODO</code>s:</p>
       <ul>
        <li>One <code>nn.Embedding(total_features, k)</code> table <code>V</code> &mdash; the <b>shared</b>
        embeddings. Look up one $k$-vector per field: <code>emb = V(feat_idx)</code>, shape
        <code>(batch, n_fields, k)</code>.</li>
        <li>TODO &mdash; <b>FM order-2</b> with the cheap identity:
        <code>fm2 = 0.5 * ((emb.sum(1))**2 - (emb**2).sum(1)).sum(1)</code>. Add the order-1 term
        <code>w1(feat_idx).sum(1)</code> and a bias to get <code>y_fm</code>.</li>
        <li>TODO &mdash; <b>deep part</b>: flatten the <i>same</i> <code>emb</code> to
        <code>a0 = emb.reshape(batch, -1)</code> and push it through an MLP to a single scalar
        <code>y_dnn</code>.</li>
        <li>TODO &mdash; <b>combine</b>: <code>logit = y_fm + y_dnn</code>; the sigmoid lives in
        <code>BCEWithLogitsLoss</code>. (Eqn. 1: $\\hat{y} = \\sigma(y_{FM}+y_{DNN})$.)</li>
       </ul>
       <p>Then add a <code>mode</code> switch (<code>"fm"</code> / <code>"dnn"</code> / <code>"deepfm"</code>)
       so you can ablate each component. Predict the AUC ranking.</p>`,

    // ★ HOW IT WORKS ★
    walkthrough:
      `<p>The input is a list of categorical <b>fields</b> (e.g. user-id, app-category, hour-of-day). Each
       field is one-hot, but the model never stores the one-hot; it stores a small dense <b>embedding</b>
       vector per feature value. Write $e_i$ for the embedding of field $i$, each of the same length $k$
       (&sect;2.1.2). Stacking them gives the embedding layer (Eqn. 3):</p>
       <p>$$ a^{(0)} = [\\,e_1,\\,e_2,\\,\\dots,\\,e_m\\,], $$</p>
       <p>where $m$ is the number of fields. This single $a^{(0)}$ is the <b>shared input</b> to both halves.</p>
       <p><b>FM component (low order, &sect;2.1.1).</b> A Factorization Machine scores order-1 and order-2
       interactions. Order-1 is a plain weighted sum $\\langle w,x\\rangle$. Order-2 is the sum over all
       feature <i>pairs</i> of the inner product of their latent vectors, $\\langle V_i,V_j\\rangle$, times the
       two feature values. Crucially, those latent vectors $V_i$ <b>are the embeddings</b> $e_i$ &mdash; the
       same table. This yields a scalar $y_{FM}$.</p>
       <p><b>Deep component (high order, &sect;2.1.2).</b> Take the same $a^{(0)}$ and run it through a stack of
       fully-connected layers (Eqn. 4): $a^{(l+1)} = \\sigma(W^{(l)} a^{(l)} + b^{(l)})$, where $\\sigma$ is a
       nonlinearity (ReLU, the Rectified Linear Unit: keep positives, zero negatives). The final layer projects
       to a single scalar $y_{DNN}$. Depth lets it model interactions of order higher than two.</p>
       <p><b>Combine (Eqn. 1).</b> Add the two scalars and squash with the sigmoid $\\sigma$ to a probability:</p>
       <p>$$ \\hat{y} = \\sigma(y_{FM} + y_{DNN}). $$</p>
       <p>The two "interesting features" the paper highlights (&sect;2.1.2): the field embeddings are all the
       same size $k$ even though raw fields differ in cardinality; and "the latent feature vectors ($V$) in FM
       now serve as network weights which are learned and used to compress the input field vectors to the
       embedding vectors." One table, two consumers, trained jointly.</p>`,
    architecture:
      `<p>DeepFM is one network with a <b>shared bottom</b> and two parallel heads, summed before the
       sigmoid (Fig. 1, &sect;2.1). Data flows bottom to top:</p>
       <ul>
        <li><b>1. Sparse input.</b> The raw record is $m$ categorical <b>fields</b> (user-id, app-category,
        hour, ...), each one-hot. Field $i$ contributes a one-hot block whose width is that field's
        cardinality; widths differ across fields.</li>
        <li><b>2. Embedding layer (Eqn. 3).</b> Each field is mapped to a dense length-$k$ vector $e_i$ by a
        lookup in the latent table $V$ &mdash; the FM latent vectors $V_i$ <i>are</i> these embedding weights.
        Two design choices the paper calls out (&sect;2.1.2): (i) every $e_i$ has the <b>same</b> size $k$ even
        though the input fields differ in width; (ii) "the latent feature vectors ($V$) in FM now serve as
        network weights." The stacked vectors form $a^{(0)} = [e_1,\\dots,e_m]$, length $m\\,k$. <b>This single
        $a^{(0)}$ is the only input to both heads</b> &mdash; the shared-embedding design.</li>
        <li><b>3a. FM head (&sect;2.1.1, Eqn. 2).</b> An <b>Addition unit</b> computes the order-1 term
        $\\langle w,x\\rangle$; <b>Inner-Product units</b> compute the order-2 term, summing $\\langle
        V_{j_1},V_{j_2}\\rangle x_{j_1}x_{j_2}$ over all feature pairs. Output: the scalar $y_{FM}$. (The code
        evaluates the order-2 sum with the $O(kd)$ square-of-sum identity rather than enumerating pairs.)</li>
        <li><b>3b. Deep head (&sect;2.1.2, Eqns. 4 and $y_{DNN}$).</b> The same $a^{(0)}$ feeds a stack of
        $|H|$ fully-connected layers, each $a^{(l+1)}=\\sigma(W^{(l)}a^{(l)}+b^{(l)})$ with a nonlinearity
        $\\sigma$ (ReLU). A final affine layer projects $a^{(H)}$ to the scalar $y_{DNN}$. Depth is what
        captures interactions of order higher than two.</li>
        <li><b>4. Output (Eqn. 1).</b> The two scalars are <b>added</b> (not concatenated),
        $y_{FM}+y_{DNN}$, and the sigmoid maps the sum to the predicted CTR $\\hat{y}\\in(0,1)$. The whole
        network &mdash; embedding table, FM head, deep head &mdash; is trained jointly by backprop, so the
        shared embeddings receive gradients from both the low-order and the high-order signals.</li>
       </ul>
       <p>Reference shape (the lesson's small build): $m=5$ fields, $k=8$, so $a^{(0)}$ has length $40$; the
       deep head is $40 \\to 64 \\to 32 \\to 1$ with ReLU and dropout. The FM head reuses the same length-$8$
       embeddings, no extra parameters beyond the order-1 weights $w$ and bias.</p>`,
    symbols: [
      { sym: "$\\hat{y}$", desc: "the <b>predicted click probability</b> (CTR), a number between $0$ and $1$." },
      { sym: "$\\sigma$", desc: "the <b>sigmoid</b> function $\\sigma(z)=1/(1+e^{-z})$: squashes any real score into a $(0,1)$ probability. (In the deep layers, $\\sigma$ also denotes the ReLU nonlinearity, per the paper's notation.)" },
      { sym: "$y_{FM}$", desc: "the scalar score from the <b>Factorization Machine component</b> &mdash; order-1 plus order-2 (pairwise) interactions." },
      { sym: "$y_{DNN}$", desc: "the scalar score from the <b>deep neural network component</b> &mdash; high-order interactions learned by the MLP." },
      { sym: "$x$", desc: "the input record: the (mostly one-hot) feature vector built from all fields." },
      { sym: "$m$", desc: "the number of <b>fields</b> (categorical feature groups), e.g. user-id, app-category, hour." },
      { sym: "$k$", desc: "the <b>embedding size</b>: every field's dense vector has length $k$, regardless of how many values that field can take." },
      { sym: "$e_i$", desc: "the <b>dense embedding</b> of field $i$, a length-$k$ vector. This is also the FM latent vector for that field &mdash; the shared piece." },
      { sym: "$V_i$", desc: "the FM <b>latent vector</b> for feature $i$. In DeepFM, $V_i$ <i>is</i> the embedding $e_i$: the FM table and the embedding table are one and the same." },
      { sym: "$w$", desc: "the order-1 <b>weights</b>: one scalar importance per feature, giving the linear term $\\langle w,x\\rangle$." },
      { sym: "$a^{(0)}$", desc: "the <b>embedding layer output</b> (Eqn. 3): all field embeddings concatenated, $[e_1,\\dots,e_m]$. The shared input to FM and to the deep part." },
      { sym: "$a^{(l)}$", desc: "the activation (output) of the $l$-th hidden layer of the deep component; $a^{(l+1)}=\\sigma(W^{(l)}a^{(l)}+b^{(l)})$." },
      { sym: "$W^{(l)}, b^{(l)}$", desc: "the weight matrix and bias of the $l$-th deep layer." },
      { sym: "$|H|$", desc: "the <b>number of hidden layers</b> in the deep component; the output layer is the $(|H|{+}1)$-th, giving $y_{DNN}$." },
      { sym: "$d$", desc: "the total number of <b>features</b> (the dimension of the sparse input $x$); the FM order-2 sum runs over feature pairs $1 \\le j_1 \\lt j_2 \\le d$." },
      { sym: "“order-2 / order-3 interaction”", desc: "plain terms: an order-2 (pairwise) interaction is a signal from <b>two</b> features together; order-3 from <b>three</b> together. FM reaches order-2; depth reaches higher." }
    ],
    formula: `$$ \\hat{y} = \\sigma\\big(y_{FM} + y_{DNN}\\big) \\qquad\\text{(Eqn. 1)} $$
<p>The combined prediction (&sect;2.1): low-order score plus high-order score, squashed by the sigmoid into a click probability.</p>
$$ y_{FM} = \\langle w, x\\rangle + \\sum_{j_1=1}^{d}\\sum_{j_2=j_1+1}^{d} \\langle V_{j_1}, V_{j_2}\\rangle\\, x_{j_1}\\, x_{j_2} \\qquad\\text{(Eqn. 2)} $$
<p>The FM component (&sect;2.1.1): the order-1 linear term $\\langle w,x\\rangle$ plus the order-2 sum over all feature pairs $(j_1,j_2)$ of latent-vector inner products weighted by the two feature values.</p>
$$ a^{(0)} = [\\,e_1,\\,e_2,\\,\\dots,\\,e_m\\,] \\qquad\\text{(Eqn. 3)} $$
<p>The embedding layer (&sect;2.1.2): the $m$ field embeddings $e_i$ (each length $k$) concatenated into the deep network's input $a^{(0)}$ &mdash; the same vectors the FM component uses.</p>
$$ a^{(l+1)} = \\sigma\\big(W^{(l)} a^{(l)} + b^{(l)}\\big) \\qquad\\text{(Eqn. 4)} $$
<p>The hidden-layer recurrence (&sect;2.1.2): each deep layer applies an affine map then a nonlinearity $\\sigma$; $l$ indexes layer depth.</p>
$$ y_{DNN} = \\sigma\\big(W^{(|H|+1)} a^{(H)} + b^{(|H|+1)}\\big) $$
<p>The deep output (&sect;2.1.2): after $|H|$ hidden layers, a final affine map produces the scalar deep score $y_{DNN}$.</p>`,
    whatItDoes:
      `<p><b>Equation 1</b> is the whole model in one line: compute a low-order score $y_{FM}$ and a high-order
       score $y_{DNN}$ from the <i>same</i> embeddings, <b>add</b> them, and apply the sigmoid to get a click
       probability. The addition (not concatenation) is what lets the two components specialize: each pushes
       the shared logit up or down by what it sees.</p>
       <p><b>Equation 2</b> is the FM component (&sect;2.1.1). The first term $\\langle w,x\\rangle$ is the
       order-1 (linear) part. The double sum is the order-2 part: for every pair of features $(i,j)$, take the
       inner product of their latent vectors $\\langle V_i,V_j\\rangle$ and weight it by both feature values
       $x_i x_j$. Because $V_i$ are the shared embeddings, FM and the deep net read the same vectors.</p>
       <p>The naive double sum is $O(k\\,d^2)$, but it has a famous $O(k\\,d)$ rewrite used in the code:
       $\\tfrac12\\sum_f\\big[(\\sum_i v_{i,f})^2 - \\sum_i v_{i,f}^2\\big]$ &mdash; "square of the sum minus sum
       of the squares," halved, per embedding dimension $f$.</p>`,
    derivation:
      `<p><b>This lesson reuses the FM second-order term</b> &mdash; the math owner is the Factorization Machine
       lesson (cross-link: <code>paper-fm</code>), which derives Eqn. 2 in full. Here we recap only the one
       identity the code relies on, because it is what makes the FM component cheap enough to bolt onto a deep
       net.</p>
       <p>The order-2 term sums an inner product over all unordered pairs. Fix one embedding dimension $f$ and
       let $v_i = V_{i,f}$ (with the feature value folded in). We want $\\sum_{i\\lt j} v_i v_j$. Start from the
       square of the sum:</p>
       <p>$$ \\Big(\\sum_i v_i\\Big)^2 = \\sum_i v_i^2 + 2\\sum_{i\\lt j} v_i v_j. $$</p>
       <p>Solve for the cross terms:</p>
       <p>$$ \\sum_{i\\lt j} v_i v_j = \\tfrac12\\Big[\\,\\big(\\sum_i v_i\\big)^2 - \\sum_i v_i^2\\,\\Big]. $$</p>
       <p>Sum that over all embedding dimensions $f$ and you get the full order-2 score in <b>one pass</b> over
       the embeddings &mdash; $O(k\\,d)$ instead of $O(k\\,d^2)$. That is the exact line
       <code>0.5*((emb.sum(1))**2 - (emb**2).sum(1)).sum(1)</code> in the notebook. The deep part needs no
       special derivation: it is a standard MLP on the same $a^{(0)}$.</p>`,
    example:
      `<p>Work the FM order-2 trick on two tiny embeddings so the identity is concrete. Suppose only two
       features are active, with shared embeddings (here $k=3$):</p>
       <p>$$ e_1 = [\\,0.2,\\,-0.1,\\,0.4\\,], \\qquad e_2 = [\\,0.5,\\,0.3,\\,-0.2\\,]. $$</p>
       <p>The order-2 term should equal the single pair's inner product $\\langle e_1,e_2\\rangle$. Check both ways.</p>
       <ul class="steps">
        <li><b>Direct inner product:</b> $\\langle e_1,e_2\\rangle = (0.2)(0.5) + (-0.1)(0.3) + (0.4)(-0.2)
        = 0.10 - 0.03 - 0.08 = -0.01.$</li>
        <li><b>Sum of the embeddings:</b> $e_1 + e_2 = [\\,0.7,\\,0.2,\\,0.2\\,]$.</li>
        <li><b>Square-of-the-sum (per dimension, then add):</b>
        $0.7^2 + 0.2^2 + 0.2^2 = 0.49 + 0.04 + 0.04 = 0.57.$</li>
        <li><b>Sum-of-the-squares:</b>
        $\\;\\sum e_1^2 = 0.04+0.01+0.16 = 0.21$ and $\\;\\sum e_2^2 = 0.25+0.09+0.04 = 0.38$,
        together $0.21 + 0.38 = 0.59.$</li>
        <li><b>Apply the identity:</b> $\\tfrac12(0.57 - 0.59) = \\tfrac12(-0.02) = -0.01.$ It matches the direct
        inner product exactly.</li>
       </ul>
       <p>So the cheap "square-of-sum minus sum-of-squares, halved" gives the same FM order-2 score $-0.01$ as
       summing pair inner products &mdash; with one active pair, that is just $\\langle e_1,e_2\\rangle$. These
       numbers are recomputed in the notebook's first cell.</p>`,
    recipe:
      `<ol>
        <li><b>Build one shared embedding table</b> <code>V = nn.Embedding(total_features, k)</code>, plus an
        order-1 table <code>w1 = nn.Embedding(total_features, 1)</code> and a bias. Look up per-field vectors:
        <code>emb = V(feat_idx)</code>, shape <code>(batch, n_fields, k)</code>.</li>
        <li><b>FM component</b> (Eqn. 2): order-1 $= $ <code>w1(feat_idx).sum(1)</code> $+$ bias; order-2 $=$
        <code>0.5*((emb.sum(1))**2 - (emb**2).sum(1)).sum(1)</code>. Sum to <code>y_fm</code>.</li>
        <li><b>Deep component</b> (Eqn. 3-4): flatten the <i>same</i> <code>emb</code> to
        <code>a0 = emb.reshape(batch, -1)</code>; push through an MLP (Linear &rarr; ReLU &rarr; ... &rarr;
        Linear&rarr;1) to <code>y_dnn</code>.</li>
        <li><b>Combine</b> (Eqn. 1): <code>logit = y_fm + y_dnn</code>; train with
        <code>BCEWithLogitsLoss</code> (sigmoid is inside the loss).</li>
        <li><b>Make a tiny synthetic CTR set</b> whose label depends on a high-cardinality pairwise signal
        (FM's strength) <i>and</i> a three-way parity signal (needs depth).</li>
        <li><b>Ablate:</b> a <code>mode</code> flag runs FM-only, DNN-only, or DeepFM. Compare test AUC and
        LogLoss &mdash; DeepFM should beat both single components.</li>
      </ol>`,
    results:
      `<p>The paper evaluates on a Criteo CTR benchmark and a "Company" (Huawei App Store) dataset (&sect;3),
       reporting AUC (higher better) and LogLoss (lower better). Transcribed from the ar5iv mirror's
       comparison table &mdash; on <b>Criteo</b>: FM (AUC 0.7892, LogLoss 0.46077), FNN (0.7963, 0.45738),
       <b>DeepFM (0.8007, 0.45083)</b>; on the <b>Company</b> set: FM (0.8678, 0.02633), FNN (0.8683, 0.02629),
       <b>DeepFM (0.8715, 0.02618)</b>. The paper's summary: "DeepFM outperforms the models that learn only
       low-order or only high-order feature interactions."</p>
       <p><i>Those are the paper's reported figures, quoted from the fetched source. The numbers in the CODE and
       CODEVIZ panels below are from our own tiny synthetic run &mdash; not the paper's results.</i></p>`,
    evaluation:
      `<p><b>1. Metric &amp; benchmark.</b> DeepFM is a CTR ranker, so score it with <b>AUC</b> (area under the
       ROC curve; higher is better) and <b>LogLoss</b> (binary cross-entropy; lower is better) on a held-out
       split &mdash; the paper uses the <b>Criteo</b> CTR benchmark and a Huawei <b>Company</b> set (&sect;3).
       The no-skill floor is <b>AUC $= 0.5$</b> (random ranking) and LogLoss $= -[p\\ln p + (1{-}p)\\ln(1{-}p)]$
       at the base click rate (predict the constant prior). A real model must clear both; the bar that proves
       the architecture earns its keep is beating the <b>FM-only</b> and <b>DNN-only</b> ablations.</p>
       <ul>
        <li><b>2. Sanity checks before the full run.</b> Verify the FM order-2 identity on two tiny embeddings &mdash;
        $\\langle e_1,e_2\\rangle$ computed directly must equal $0.5[(\\sum e)^2 - \\sum e^2]$ (the lesson's worked
        example: both $-0.01$); a mismatch means the identity is mis-wired. Check shapes: each branch returns
        <code>(batch,)</code> and they <b>add</b> to one logit. At init with zero/near-zero weights the predicted
        probability sits near the data's base click rate, so LogLoss starts near the prior entropy &mdash; not
        NaN, not $0$. Overfit a single batch with dropout off: train LogLoss should fall toward $\\sim 0$ and
        train AUC toward $\\sim 1.0$; if it can't, the forward pass or the gradient path is broken.</li>
        <li><b>3. Expected range.</b> On Criteo the paper reports <b>DeepFM AUC $0.8007$, LogLoss $0.45083$</b>,
        above FM ($0.7892$) and FNN ($0.7963$); on the Company set <b>AUC $0.8715$, LogLoss $0.02618$</b>
        (&sect;3, ar5iv mirror &mdash; reuse, do not re-target). These are the paper's figures, approximate and
        hardware/seed-dependent. Note CTR AUC gains are <i>small in absolute terms</i>: a $+0.001$ AUC lift is
        considered significant here, so do not expect dramatic jumps. On the lesson's toy data DeepFM beat both
        single components (FM $0.6545$, DNN $0.8418$, DeepFM $0.8585$ &mdash; our run, not the paper's). An AUC
        stuck near $0.5$ is a bug; an AUC a few points under the ablation you expected to beat is tuning.</li>
        <li><b>4. Ablation &mdash; prove the shared two-component design earns its keep.</b> The central idea is
        the FM head and the deep head <b>sharing one embedding table</b>, summed before the sigmoid. Flip the
        <code>mode</code> knob to <b>FM-only</b> and <b>DNN-only</b> and confirm full DeepFM beats <i>both</i> in
        AUC/LogLoss. A second, sharper ablation: give each head its <b>own</b> embedding table &mdash; if metrics
        don't drop versus the shared-table model, the sharing isn't wired in and you've built an ensemble, not
        DeepFM. If DeepFM only ties the better single component, the weaker head is contributing nothing.</li>
        <li><b>5. Failure signals &amp; what they mean.</b> <b>AUC stuck at $\\sim 0.5$:</b> labels shuffled,
        features not indexed into the embedding (wrong field offsets), or the logit not reaching the loss.
        <b>LogLoss NaN / exploding:</b> learning rate too high, or sigmoid applied twice (inside a branch AND in
        <code>BCEWithLogitsLoss</code>) so gradients blow up or vanish &mdash; branches must return raw logits.
        <b>Sign-flipped or stalled FM term:</b> the order-2 identity computed as "sum of squares minus square of
        sum" (reversed) &mdash; it must be $0.5[(\\sum e)^2 - \\sum e^2]$, summing over fields before squaring.
        <b>DeepFM no better than FM-only:</b> the deep head's gradients aren't flowing (two tables, or the DNN
        output isn't added), so the high-order signal is lost. <b>Train-good val-bad:</b> overfit &mdash; raise
        dropout / weight decay.</li>
       </ul>`,

    // IMPLEMENT + REFLECT
    implementBoundary:
      `<p>This is a <b>Track B (architecture)</b> paper: the primitives ship in PyTorch, so you <b>import</b>
       them and build only the novel composition. <b>Import:</b> <code>nn.Embedding</code>,
       <code>nn.Linear</code>, <code>nn.ReLU</code>, <code>nn.BCEWithLogitsLoss</code>, and the Adam optimizer.
       <b>Build by hand:</b> the <b>shared embedding</b> wiring (one table feeding both halves), the FM
       component using the $O(kd)$ square-of-sum identity, the deep MLP on the same embeddings, the
       sum-before-sigmoid $\\hat{y}=\\sigma(y_{FM}+y_{DNN})$, and the <b>ablation</b> switch (FM-only /
       DNN-only / DeepFM). The order-2 derivation is recapped here and owned by the FM lesson
       (<code>paper-fm</code>), not re-derived.</p>`,
    pitfalls:
      `<ul>
        <li><b>Two embedding tables instead of one.</b> The whole point is that FM and the deep part
        <b>share</b> the embeddings. If you give each its own table you have lost the contribution &mdash; it
        is then just two independent models. <b>Fix:</b> one <code>nn.Embedding</code>; feed the same
        <code>emb</code> tensor to both branches.</li>
        <li><b>Concatenating the scores instead of adding.</b> Eqn. 1 is $y_{FM} + y_{DNN}$, a scalar
        <b>sum</b>. Both branches must output a single number that lands on the <i>same</i> logit. <b>Fix:</b>
        each branch returns shape <code>(batch,)</code>; add them.</li>
        <li><b>Applying sigmoid twice.</b> Eqn. 1's $\\sigma$ is the final squashing. If you sigmoid inside a
        branch and again in the loss, gradients vanish. <b>Fix:</b> branches return raw logits; let
        <code>BCEWithLogitsLoss</code> do the one sigmoid.</li>
        <li><b>Wrong FM identity.</b> Order-2 is "square of the <i>sum</i> minus sum of the <i>squares</i>,"
        halved &mdash; not the reverse. Subtracting the wrong way flips the sign and breaks training.
        <b>Fix:</b> <code>0.5*((emb.sum(1))**2 - (emb**2).sum(1)).sum(1)</code>; sum over fields (dim 1)
        <i>before</i> squaring for the first term.</li>
        <li><b>Reading "wide" as needing cross-features.</b> Unlike Wide &amp; Deep, DeepFM's wide part (the FM)
        takes the raw shared embeddings &mdash; no hand-built cross-feature columns. <b>Fix:</b> feed raw fields
        only.</li>
      </ul>`,
    recall: [
      "Write Eqn. 1, the DeepFM prediction, from memory.",
      "What does it mean that FM and the deep component share one embedding table?",
      "State the $O(kd)$ identity for the FM order-2 term.",
      "Why add $y_{FM}$ and $y_{DNN}$ before the sigmoid instead of concatenating features?",
      "Define $e_i$, $V_i$, and how they relate in DeepFM."
    ],
    practice: [
      {
        q: `<b>The ablation.</b> You have a working DeepFM whose test AUC beats both single components. Flip the
            <code>mode</code> flag to run <b>FM only</b> and <b>DNN only</b> on the same data, then DeepFM.
            What ranking do you expect by AUC, and what does each gap tell you about the data's interaction
            orders?`,
        steps: [
          { do: `Run <code>mode="fm"</code>: the model keeps only $y_{FM}$ (order-1 + order-2).`, why: `FM captures the pairwise signal but has no mechanism for the three-way (order-3) parity, so its AUC caps low.` },
          { do: `Run <code>mode="dnn"</code>: keep only $y_{DNN}$ (the deep MLP on the shared embeddings).`, why: `Depth reaches the order-3 signal, lifting AUC well above FM &mdash; but the deep net handles the clean pairwise part less crisply.` },
          { do: `Run <code>mode="deepfm"</code>: add both scores before the sigmoid.`, why: `The FM component sharpens the low-order pairwise score while the deep part supplies the high-order signal &mdash; together they top both.` }
        ],
        answer: `<p>Expected ranking by AUC: <b>DeepFM &gt; DNN-only &gt; FM-only</b>. Our small run gave FM
                 0.6545, DNN 0.8418, DeepFM 0.8585 (LogLoss 0.6761 / 0.4946 / 0.4765 &mdash; DeepFM lowest too).
                 FM alone cannot reach the three-way parity, so it stalls; the deep net reaches it; DeepFM keeps
                 the deep net's high-order win <i>and</i> the FM's clean low-order score, so it edges out both.
                 This is the paper's qualitative claim reproduced on toy data &mdash; our small run, not the
                 paper's number.</p>`
      },
      {
        q: `A teammate builds DeepFM with <b>two separate</b> embedding tables &mdash; one for the FM branch,
            one for the deep branch &mdash; and reports it "works the same." What did they lose, and how would
            you spot it?`,
        steps: [
          { do: `Identify the design break: the paper's contribution is one <b>shared</b> embedding feeding both halves (&sect;2.1.2).`, why: `Shared embeddings mean the FM's low-order gradients and the deep part's high-order gradients jointly shape the same vectors &mdash; that coupling is the model.` },
          { do: `Note the cost: separate tables double the embedding parameters and decouple the two views of each feature.`, why: `It degenerates into an ensemble of an independent FM and an independent DNN, summed &mdash; not DeepFM.` },
          { do: `Spot it: print the parameter that holds the embeddings; there should be exactly one <code>nn.Embedding</code> of shape <code>(total_features, k)</code> consumed by both branches.`, why: `One table, two consumers, is the structural signature of DeepFM.` }
        ],
        answer: `<p>They lost the <b>shared embedding</b> &mdash; the paper's core idea. With two tables the model
                 is just an FM and a DNN trained side by side and summed; the embeddings no longer carry signal
                 jointly useful to low- and high-order terms, and parameter count doubles. Spot it by checking
                 that a single <code>nn.Embedding</code> tensor feeds both the FM identity and the MLP input.</p>`
      },
      {
        q: `In the worked example, $e_1=[0.2,-0.1,0.4]$ and $e_2=[0.5,0.3,-0.2]$ gave FM order-2 $=-0.01$.
            Suppose a third feature with embedding $e_3=[0,0,0]$ becomes active. How does the order-2 term
            change, and why is that the "safe" behavior?`,
        steps: [
          { do: `Recall the order-2 sums over all active pairs: now $(e_1,e_2),(e_1,e_3),(e_2,e_3)$.`, why: `Adding a feature adds its pairings with every existing one.` },
          { do: `Compute the new pairs: $\\langle e_1,e_3\\rangle = 0$ and $\\langle e_2,e_3\\rangle = 0$ because $e_3$ is the zero vector.`, why: `Any inner product with the zero vector is zero.` },
          { do: `Sum: $-0.01 + 0 + 0 = -0.01$ &mdash; unchanged.`, why: `A zero embedding contributes nothing to the order-2 score.` }
        ],
        answer: `<p>The order-2 term stays $-0.01$: $e_3$'s two new inner products are both zero, so it adds
                 nothing. A zero (or untrained-to-zero) embedding is a clean "opt out" &mdash; the feature
                 simply does not interact &mdash; which is why FM degrades gracefully as features are added or
                 removed. You can confirm with the square-of-sum identity: the new sum is still
                 $[0.7,0.2,0.2]$, and $\\sum e_3^2 = 0$, so the halved difference is unchanged.</p>`
      }
    ]
  });

  window.CODE["paper-deepfm"] = {
    lib: "PyTorch",
    runnable: false,
    explain:
      `<p>Track B: we <b>build</b> DeepFM by hand on top of <code>nn.Embedding</code> / <code>nn.Linear</code>.
       One <b>shared</b> embedding table <code>V</code> feeds <i>both</i> the FM component (order-1 + the
       $O(kd)$ order-2 identity) and the deep MLP. Their two scalars are <b>added</b> before the sigmoid &mdash;
       Eqn. 1, $\\hat{y}=\\sigma(y_{FM}+y_{DNN})$ &mdash; with the sigmoid living inside
       <code>BCEWithLogitsLoss</code>. We make a tiny synthetic CTR set whose clicks depend on a
       high-cardinality <b>pairwise</b> signal (FM's strength) <i>and</i> a three-way <b>parity</b> signal
       (needs depth), then ablate with a <code>mode</code> flag: <b>FM-only</b>, <b>DNN-only</b>, <b>DeepFM</b>.
       The first cell recomputes the worked example ($\\langle e_1,e_2\\rangle = -0.01$ two ways). CPU, a few
       seconds. Paste into Colab and run.</p>
       <p><i>Our small run gave test AUC: FM 0.6545, DNN 0.8418, DeepFM 0.8585 (LogLoss 0.6761 / 0.4946 /
       0.4765) &mdash; DeepFM best on both. These are our numbers, not the paper's.</i></p>`,
    code: `import torch
import torch.nn as nn
import numpy as np
from sklearn.metrics import roc_auc_score

torch.manual_seed(0); np.random.seed(0)

# --- 0. Sanity-check the worked example: FM order-2 == <e1,e2>, two ways. ---
e1 = torch.tensor([0.2, -0.1, 0.4]); e2 = torch.tensor([0.5, 0.3, -0.2])
direct = (e1 * e2).sum()                                  # inner product
s = e1 + e2
identity = 0.5 * ((s * s).sum() - (e1 * e1).sum() - (e2 * e2).sum())
print("worked example:  <e1,e2> =", round(direct.item(), 4),
      " square-of-sum identity =", round(identity.item(), 4))   # both -0.01


# --- 1. Tiny synthetic CTR data with MIXED interaction orders. ---
# CTR = click-through rate. Each field is a categorical feature (one value per row).
N = 10000
field_cards = [40, 40, 4, 4, 4]            # 2 high-card "pair" fields + 3 low-card "parity" fields
n_fields = len(field_cards)
g = torch.Generator().manual_seed(3)
idx = torch.stack([torch.randint(0, c, (N,), generator=g) for c in field_cards], dim=1)  # (N, 5)

# Low-order (order-2): a low-rank id-id interaction <U[a], V[b]> -> exactly FM's model.
r = 4
U = torch.randn(40, r, generator=g); Vp = torch.randn(40, r, generator=g)
pair = (U[idx[:, 0]] * Vp[idx[:, 1]]).sum(1) * 0.8
# High-order (order-3): a three-way parity -> needs DNN depth, FM order-2 cannot reach it.
b2 = (idx[:, 2] < 2).long(); b3 = (idx[:, 3] < 2).long(); b4 = (idx[:, 4] < 2).long()
triple = 1.6 * ((b2 ^ b3 ^ b4).float() * 2 - 1)
logit = pair + triple + 0.1 * torch.randn(N, generator=g)
y = torch.bernoulli(torch.sigmoid(logit), generator=g)     # click / no-click labels

offsets = torch.tensor(np.cumsum([0] + field_cards[:-1]), dtype=torch.long)
feat_idx = idx + offsets                                    # global feature index per field
total_feats = sum(field_cards)
ntr = 8000; tr = slice(0, ntr); te = slice(ntr, N)
k = 8                                                       # embedding size (FM latent size)


# --- 2. DeepFM (built by hand). mode in {"fm","dnn","deepfm"} is the ablation switch. ---
class DeepFM(nn.Module):
    def __init__(self, mode="deepfm"):
        super().__init__()
        self.mode = mode
        self.w0 = nn.Parameter(torch.zeros(1))             # global bias
        self.w1 = nn.Embedding(total_feats, 1)             # order-1 weights <w,x>
        self.V  = nn.Embedding(total_feats, k)             # SHARED embeddings (V_i == e_i)
        nn.init.normal_(self.w1.weight, std=0.01)
        nn.init.normal_(self.V.weight,  std=0.05)
        H = n_fields * k
        self.mlp = nn.Sequential(nn.Linear(H, 64), nn.ReLU(), nn.Dropout(0.3),
                                 nn.Linear(64, 32), nn.ReLU(), nn.Dropout(0.3),
                                 nn.Linear(32, 1))

    def forward(self, fi):
        emb = self.V(fi)                                   # (B, n_fields, k)  -- shared e_i
        # FM order-2 via the O(kd) identity: 0.5[(sum e)^2 - sum(e^2)], summed over k.
        s   = emb.sum(1)                                    # (B, k)
        fm2 = 0.5 * ((s * s) - (emb * emb).sum(1)).sum(1)  # (B,)
        fm1 = self.w1(fi).sum(1).squeeze(-1)               # order-1 <w,x>
        y_fm  = self.w0 + fm1 + fm2                         # FM scalar (Eqn. 2)
        a0    = emb.reshape(emb.size(0), -1)               # a^(0) = [e1..em]  -- SAME embeddings
        y_dnn = self.mlp(a0).squeeze(-1)                   # DNN scalar
        if self.mode == "fm":  return y_fm                 # ablation: FM only
        if self.mode == "dnn": return y_dnn                # ablation: DNN only
        return y_fm + y_dnn                                # Eqn. 1: sigmoid is in the loss


# --- 3. Train + evaluate (Adam, BCEWithLogitsLoss = one sigmoid inside the loss). ---
def run(mode, epochs=40, bs=256):
    torch.manual_seed(0)
    net = DeepFM(mode)
    opt = torch.optim.Adam(net.parameters(), lr=0.004, weight_decay=1e-5)
    lf  = nn.BCEWithLogitsLoss()
    Xtr, ytr = feat_idx[tr], y[tr]
    for ep in range(epochs):
        net.train(); perm = torch.randperm(ntr)
        for i in range(0, ntr, bs):
            b = perm[i:i + bs]
            opt.zero_grad(); loss = lf(net(Xtr[b]), ytr[b]); loss.backward(); opt.step()
    net.eval()
    with torch.no_grad():
        pte = torch.sigmoid(net(feat_idx[te]))             # apply sigmoid for scoring
        ll  = nn.functional.binary_cross_entropy(pte, y[te]).item()
        auc = roc_auc_score(y[te].numpy(), pte.numpy())
    return auc, ll

print("\\nablation -- same data, same shared embeddings:")
for m in ["fm", "dnn", "deepfm"]:
    auc, ll = run(m)
    print(f"  {m:8s}  test AUC = {auc:.4f}   test LogLoss = {ll:.4f}")
# Our small run:  fm  AUC 0.6545 / LL 0.6761 ; dnn 0.8418 / 0.4946 ; deepfm 0.8585 / 0.4765.
# DeepFM beats FM-only AND DNN-only on both metrics -- the paper's effect on toy data.
# (Exact numbers vary by hardware/seed; this is our small run, not the paper's reported result.)`
  };

  window.CODEVIZ["paper-deepfm"] = {
    question: "On a CTR task with both a pairwise and a three-way signal, does DeepFM (shared embeddings, FM + DNN) beat FM-only and DNN-only?",
    charts: [
      {
        type: "line",
        title: "Test AUC vs epoch — FM-only vs DNN-only vs DeepFM (shared embeddings)",
        xlabel: "epoch",
        ylabel: "test AUC (higher is better)",
        series: [
          {
            name: "FM only",
            color: "#ff7b72",
            points: [[0,0.5438],[3,0.5595],[6,0.5768],[9,0.5995],[12,0.6181],[15,0.6313],[18,0.6405],[21,0.6455],[24,0.6506],[27,0.6529],[30,0.6543],[33,0.6541],[36,0.6543],[39,0.6545]]
          },
          {
            name: "DNN only",
            color: "#d29922",
            points: [[0,0.5334],[3,0.6683],[6,0.8249],[9,0.8346],[12,0.8407],[15,0.8441],[18,0.8451],[21,0.8453],[24,0.8476],[27,0.8464],[30,0.8422],[33,0.844],[36,0.842],[39,0.8418]]
          },
          {
            name: "DeepFM (FM + DNN)",
            color: "#7ee787",
            points: [[0,0.5443],[3,0.5658],[6,0.8273],[9,0.8426],[12,0.8512],[15,0.8551],[18,0.8551],[21,0.8591],[24,0.8627],[27,0.8591],[30,0.8604],[33,0.8614],[36,0.8629],[39,0.8585]]
          }
        ]
      }
    ],
    caption: "Our small run, not the paper's reported numbers. Tiny synthetic CTR data (10k rows, 5 fields) whose click label depends on BOTH a high-cardinality pairwise signal (an id-id low-rank interaction, FM's strength) AND a three-way parity signal (needs depth). All three models share the identical training setup; the only difference is which component(s) are active. FM-only plateaus near AUC 0.65 -- it captures the pairwise part but cannot reach the order-3 parity. DNN-only climbs to ~0.84. DeepFM (the SAME shared embeddings feeding both, scores added before the sigmoid) tops out highest (~0.86 final, peaking ~0.863), beating both single components -- the paper's qualitative effect reproduced on toy data.",
    code: `import torch, torch.nn as nn, numpy as np
from sklearn.metrics import roc_auc_score

# Reproduces the qualitative effect: DeepFM (shared FM + DNN) beats FM-only and DNN-only
# on a CTR task whose label mixes a pairwise signal and a three-way parity signal.
torch.manual_seed(0); np.random.seed(0)
N = 10000; field_cards = [40, 40, 4, 4, 4]; n_fields = len(field_cards); k = 8
g = torch.Generator().manual_seed(3)
idx = torch.stack([torch.randint(0, c, (N,), generator=g) for c in field_cards], dim=1)
r = 4
U = torch.randn(40, r, generator=g); Vp = torch.randn(40, r, generator=g)
pair = (U[idx[:, 0]] * Vp[idx[:, 1]]).sum(1) * 0.8                  # order-2 (FM)
b2 = (idx[:, 2] < 2).long(); b3 = (idx[:, 3] < 2).long(); b4 = (idx[:, 4] < 2).long()
triple = 1.6 * ((b2 ^ b3 ^ b4).float() * 2 - 1)                    # order-3 (needs depth)
y = torch.bernoulli(torch.sigmoid(pair + triple + 0.1 * torch.randn(N, generator=g)), generator=g)
offsets = torch.tensor(np.cumsum([0] + field_cards[:-1]), dtype=torch.long)
feat_idx = idx + offsets; total_feats = sum(field_cards); ntr = 8000

class DeepFM(nn.Module):
    def __init__(self, mode):
        super().__init__(); self.mode = mode
        self.w0 = nn.Parameter(torch.zeros(1)); self.w1 = nn.Embedding(total_feats, 1)
        self.V = nn.Embedding(total_feats, k)                       # SHARED embeddings
        nn.init.normal_(self.w1.weight, std=0.01); nn.init.normal_(self.V.weight, std=0.05)
        self.mlp = nn.Sequential(nn.Linear(n_fields * k, 64), nn.ReLU(), nn.Dropout(0.3),
                                 nn.Linear(64, 32), nn.ReLU(), nn.Dropout(0.3), nn.Linear(32, 1))
    def forward(self, fi):
        emb = self.V(fi); s = emb.sum(1)
        fm2 = 0.5 * ((s * s) - (emb * emb).sum(1)).sum(1)
        y_fm = self.w0 + self.w1(fi).sum(1).squeeze(-1) + fm2
        y_dnn = self.mlp(emb.reshape(emb.size(0), -1)).squeeze(-1)
        if self.mode == "fm":  return y_fm
        if self.mode == "dnn": return y_dnn
        return y_fm + y_dnn

def curve(mode, epochs=40, bs=256):
    torch.manual_seed(0)
    net = DeepFM(mode); opt = torch.optim.Adam(net.parameters(), lr=0.004, weight_decay=1e-5)
    lf = nn.BCEWithLogitsLoss(); out = []
    for ep in range(epochs):
        net.train(); perm = torch.randperm(ntr)
        for i in range(0, ntr, bs):
            b = perm[i:i + bs]; opt.zero_grad()
            loss = lf(net(feat_idx[b]), y[b]); loss.backward(); opt.step()
        net.eval()
        with torch.no_grad():
            p = torch.sigmoid(net(feat_idx[ntr:]))
            out.append(round(roc_auc_score(y[ntr:].numpy(), p.numpy()), 4))
    return out

for m in ["fm", "dnn", "deepfm"]:
    c = curve(m)
    print(m, [[ep, c[ep]] for ep in range(0, 40, 3)])
# DeepFM's AUC curve sits above both FM-only and DNN-only -- our small run, not the paper's number.`
  };
})();
