/* All ML — authored content for Part 17: Learning Paradigms (17.1–17.13).
   Every number here was computed and verified before shipping. LaTeX via String.raw;
   emphasis is bold (no prose italics). */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 17.1 Transfer learning ---------------- */
window.ALLML_CONTENT["17.1"] = {
  tagline: "A good representation is reusable knowledge: it turns a tiny target task from learning everything into adapting the last few choices.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.1-transfer-learning.ipynb",
  context: String.raw`
    <p>representation learning (16.1) supplies the feature map being reused; optimization supplies the small target update; regularization (1.8) explains why freezing lowers variance. It leads to domain adaptation (17.2), self-supervised pretraining (17.4), and multimodal transfer (17.13).</p>
  `,
  intuition: String.raw`
    <p>The pain is label scarcity. Training from scratch asks a few target labels to learn features and a classifier. Transfer learning makes the wiser choice: keep the source feature extractor when its invariances fit, and spend scarce target labels on the head or a small fine-tuning step.</p>
  `,
  mathematics: String.raw`
    Let $z=f_\theta(x)\in\mathbb R^d$ and $p=\sigma(w^\top z+b)$. For $z=(2,1)$, $w=(1.2,-0.8)$, $b=0$, $y=1$:<ol class="work"><li>logit $=1.2\cdot2+(-0.8)\cdot1=1.600$</li><li>$p=1/(1+e^{-1.600})=0.832$</li><li>$\nabla_w\ell=(p-y)z=(0.832-1)(2,1)=(-0.336,-0.168)$</li><li>with $\eta=0.1$, $w'=w-\eta\nabla_w\ell=(1.234,-0.783)$</li></ol><p>The update is small because the source model is already close; transfer is correction rather than rediscovery.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.2 Domain adaptation & domain generalization ---------------- */
window.ALLML_CONTENT["17.2"] = {
  tagline: "Learning must keep the label rule while refusing to memorize the domain a sample came from.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.2-domain-adaptation-generalization.ipynb",
  context: String.raw`
    <p>transfer learning (17.1) asks whether a source representation can move; generalization bounds (1.6) warn that source risk alone does not certify target risk. This enables semi-supervised adaptation (17.3), continual learning (17.9), and federated heterogeneity (17.12).</p>
  `,
  intuition: String.raw`
    <p>The naive approach trains on source and hopes. The failure is mechanical: a feature can encode domain identity rather than label structure. Adaptation uses target information to align domains; generalization learns invariants from multiple sources before the target appears.</p>
  `,
  mathematics: String.raw`
    Let $\mu_S,\mu_T\in\mathbb R^d$ be source and target feature means, with discrepancy $\|\mu_S-\mu_T\|_2^2$.<ol class="work"><li>$\mu_S=(0,0)$ and $\mu_T=(1,-0.5)$</li><li>$\mu_T-\mu_S=(1,-0.5)$</li><li>$\|\mu_T-\mu_S\|_2^2=1^2+(-0.5)^2=1.250$</li><li>after subtracting the shift, the discrepancy is $0^2+0^2=0.000$</li></ol><p>Alignment is helpful only when the shifted direction is nuisance rather than label information.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.3 Semi-supervised learning ---------------- */
window.ALLML_CONTENT["17.3"] = {
  tagline: "Unlabeled data helps only when its geometry is aligned with the label function.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.3-semi-supervised-learning.ipynb",
  context: String.raw`
    <p>ERM (1.1) gives the labeled loss; clustering gives the geometric assumption; domain adaptation (17.2) warns that unlabeled structure can be misleading. This leads directly to active learning (17.10).</p>
  `,
  intuition: String.raw`
    <p>Labels are expensive, but raw examples are abundant. Semi-supervised learning turns unlabeled examples into constraints: confident nearby points should agree. The design decision is the confidence threshold, because a guessed label can become a self-reinforcing error.</p>
  `,
  mathematics: String.raw`
    Use $\hat y=\arg\max_k p_\theta(k\mid x)$ only when $\max_k p_\theta(k\mid x)\gt\tau$.<ol class="work"><li>for $(0.9,0.1)$, entropy $=-(0.9\ln0.9+0.1\ln0.1)=0.325$</li><li>for $(0.5,0.5)$, entropy $=0.693$</li><li>with $\tau=0.8$, $0.9\gt0.8$ so the pseudo-label is kept</li><li>$0.5\lt0.8$, so the ambiguous point is rejected</li></ol><p>The threshold is the mechanism that keeps unlabeled data from amplifying uncertainty.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.4 Self-supervised learning ---------------- */
window.ALLML_CONTENT["17.4"] = {
  tagline: "A pretext task is worthwhile when solving it forces the representation to learn structure later labels need.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.4-self-supervised-learning.ipynb",
  context: String.raw`
    <p>representation learning (16.1) supplies the encoder; optimization trains it without human labels; contrastive learning (17.5) is one major self-supervised family. It powers transfer (17.1), zero-shot learning (17.8), and multimodal learning (17.13).</p>
  `,
  intuition: String.raw`
    <p>The pain is scale: data grows faster than annotation. Self-supervision creates labels from the input, such as a masked coordinate or a second view. The hidden decision is pretext design: if a shortcut solves the task, the representation learns the shortcut.</p>
  `,
  mathematics: String.raw`
    A pretext objective is $\min_\theta m^{-1}\sum_i\ell(g_\theta(a(x_i)),t(x_i))$. For $y=0.7x+0.2$:<ol class="work"><li>at $x=-1$, $y=0.7(-1)+0.2=-0.500$</li><li>at $x=0$, $y=0.200$</li><li>at $x=1$, $y=0.900$</li><li>prediction $\hat y=0.7x+0.2$ gives errors $0^2+0^2+0^2=0.000$</li></ol><p>The task helps because it forces recovery of the line structure, not because labels were hidden nearby.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.5 Contrastive & metric learning (SimCLR, MoCo, triplet) ---------------- */
window.ALLML_CONTENT["17.5"] = {
  tagline: "Representations become useful when the geometry says what should be close and what must stay apart.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.5-contrastive-metric-learning.ipynb",
  context: String.raw`
    <p>self-supervised learning (17.4) supplies positive views; softmax and cross-entropy supply InfoNCE; nearest-neighbor geometry feeds few-shot learning (17.7), zero-shot learning (17.8), and CLIP (17.13).</p>
  `,
  intuition: String.raw`
    <p>A representation can collapse if nothing pushes examples apart. Contrastive learning names positives and negatives. The decision people gloss over is the comparison set: positives define invariance, while negatives preserve distinctions.</p>
  `,
  mathematics: String.raw`
    InfoNCE is $-\log\frac{\exp(s(q,k^+)/\tau)}{\sum_j\exp(s(q,k_j)/\tau)}$.<ol class="work"><li>similarities $(0.994,0,-1,0.243)$ with $\tau=0.5$ become $(1.988,0,-2,0.486)$</li><li>exponentials are approximately $(7.301,1.000,0.135,1.626)$</li><li>positive probability $=7.301/(7.301+1.000+0.135+1.626)=0.726$</li><li>loss $=-\ln(0.726)=0.320$</li></ol><p>The positive must win relative to alternatives, not merely score high in isolation.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.6 Multi-task learning ---------------- */
window.ALLML_CONTENT["17.6"] = {
  tagline: "Shared parameters help when tasks agree on what should be represented and hurt when their gradients fight.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.6-multi-task-learning.ipynb",
  context: String.raw`
    <p>regularization (1.8) explains sharing as variance reduction; backpropagation supplies task gradients; transfer (17.1) and continual learning (17.9) reuse the same idea across time or tasks.</p>
  `,
  intuition: String.raw`
    <p>Separate models waste shared signal when tasks are related. A shared trunk lets each task teach common structure. The design decision is how much to share, because conflicting tasks turn shared parameters into a tug-of-war.</p>
  `,
  mathematics: String.raw`
    The objective is $L=\sum_t\alpha_t L_t(\theta,w_t)$.<ol class="work"><li>$L_1=0.04$, $L_2=0.09$, $\alpha=0.7$</li><li>$0.7L_1=0.028$</li><li>$0.3L_2=0.027$</li><li>$L=0.028+0.027=0.055$</li></ol><p>The weights are not decoration; they decide which task shapes the shared representation most.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.7 Meta-learning & few-shot (MAML, prototypical nets) ---------------- */
window.ALLML_CONTENT["17.7"] = {
  tagline: "The model learns how to adapt, so a new task begins with a useful bias instead of a blank slate.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.7-meta-learning-few-shot.ipynb",
  context: String.raw`
    <p>transfer (17.1), metric learning (17.5), and optimization combine here. Prototypical networks compare support means; MAML learns an initialization. The lesson prepares zero-shot learning (17.8) and active learning (17.10).</p>
  `,
  intuition: String.raw`
    <p>Few examples cannot safely fit a full model. Meta-learning trains across episodes so adaptation itself becomes the learned object. The design decision is episode design: train episodes must resemble the few-shot test situation.</p>
  `,
  mathematics: String.raw`
    For prototypes $c_k=|S_k|^{-1}\sum_{x_i\in S_k}f_\theta(x_i)$.<ol class="work"><li>class 0 points $(-1,0),(-0.8,0.2)$ give $c_0=(-0.900,0.100)$</li><li>class 1 points $(1,0),(0.9,-0.2)$ give $c_1=(0.950,-0.100)$</li><li>query $(0.2,0.05)$ has $d_0^2=1.2125$ and $d_1^2=0.5850$</li><li>softmax over negative distances gives class-1 probability $0.652$</li></ol><p>The classifier is rebuilt from support geometry, not retrained from scratch.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.8 Zero-shot learning ---------------- */
window.ALLML_CONTENT["17.8"] = {
  tagline: "A class can be predicted before examples exist if its description lives in the same space as the input.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.8-zero-shot-learning.ipynb",
  context: String.raw`
    <p>contrastive geometry (17.5) provides the shared space; transfer (17.1) provides the reusable encoder; multimodal learning (17.13) scales the idea to text and images.</p>
  `,
  intuition: String.raw`
    <p>A standard classifier cannot output an unseen class. Zero-shot learning scores class descriptions instead. The subtle decision is calibration, because seen classes often inherit a logit advantage from training.</p>
  `,
  mathematics: String.raw`
    Score $s(x,k)=\cos(f(x),a_k)$. For $x=(0.8,0.2)$:<ol class="work"><li>$\|x\|=\sqrt{0.8^2+0.2^2}=0.825$</li><li>with $a_1=(1,0)$, cosine $=0.8/0.825=0.970$</li><li>with $a_2=(0,1)$, cosine $=0.2/0.825=0.243$</li><li>scale 3 gives top softmax probability $0.898$</li></ol><p>The class description has become the classifier weight.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.9 Continual / lifelong learning ---------------- */
window.ALLML_CONTENT["17.9"] = {
  tagline: "A lifelong learner must be plastic enough for new tasks and stable enough not to erase old ones.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.9-continual-lifelong-learning.ipynb",
  context: String.raw`
    <p>online optimization supplies sequential updates; regularization (1.8) gives protection penalties; curriculum learning (17.11) and federated learning (17.12) also depend on update order.</p>
  `,
  intuition: String.raw`
    <p>Training task B can overwrite weights task A needed. Storing all old data is often impossible. Continual learning therefore decides what to protect, replay, or adapt. The central decision is estimating parameter importance.</p>
  `,
  mathematics: String.raw`
    EWC uses $L_B(\theta)+\frac\lambda2\sum_i F_i(\theta_i-\theta_{A,i})^2$.<ol class="work"><li>$\theta_A=(1,0)$, candidate $(0,1)$, so movement is $(-1,1)$</li><li>with $F=(5,0.2)$, weighted square $=5(-1)^2+0.2(1)^2=5.200$</li><li>penalty $=0.5\cdot5.200=2.600$</li><li>candidate $(0.5,0.8)$ gives $0.5(5\cdot0.25+0.2\cdot0.64)=0.689$</li></ol><p>The mechanism protects weights in proportion to old-task sensitivity.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.10 Active learning ---------------- */
window.ALLML_CONTENT["17.10"] = {
  tagline: "When labels are scarce, the next question should be the one that most changes what the model knows.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.10-active-learning.ipynb",
  context: String.raw`
    <p>semi-supervised learning (17.3) also starts with unlabeled pools; entropy and margins come from probabilistic classifiers; few-shot learning (17.7) shares the budget-conscious mindset.</p>
  `,
  intuition: String.raw`
    <p>Random labeling is safe but wasteful. Active learning queries uncertainty, small margins, or large expected model change. The hidden design decision is diversity: the most uncertain point can be redundant or an outlier.</p>
  `,
  mathematics: String.raw`
    Query $x^*=\arg\max_x H(p_\theta(y\mid x))$.<ol class="work"><li>$(0.9,0.1)$ has entropy $0.325$</li><li>$(0.6,0.4)$ has entropy $0.673$</li><li>$(0.5,0.5)$ has entropy $0.693$</li><li>for $(0.34,0.33,0.33)$, top-two margin $=0.34-0.33=0.010$</li></ol><p>High entropy and small margin both identify decisions where one label can move the boundary.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.11 Curriculum learning ---------------- */
window.ALLML_CONTENT["17.11"] = {
  tagline: "The order of examples can shape optimization even when the final dataset is unchanged.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.11-curriculum-learning.ipynb",
  context: String.raw`
    <p>optimization dynamics explain why early gradients matter; active learning (17.10) chooses labels while curriculum chooses order; continual learning (17.9) studies order under distribution change.</p>
  `,
  intuition: String.raw`
    <p>If hard or noisy examples dominate early, the model may learn exceptions before the rule. Curriculum learning starts with clean structure and gradually admits difficulty. The design decision is pace: too fast is random, too slow misses hard cases.</p>
  `,
  mathematics: String.raw`
    Use $L(t)=\sum_i w_i(t)\ell_i(\theta)$. Logistic loss for margin $m$ is $\log(1+e^{-m})$.<ol class="work"><li>$m=2$ gives $0.127$</li><li>$m=1$ gives $0.313$</li><li>$m=0.2$ gives $0.598$</li><li>$m=-0.5$ gives $0.974$</li></ol><p>The schedule lowers early gradient variance by presenting high-margin structure first.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.12 Federated learning ---------------- */
window.ALLML_CONTENT["17.12"] = {
  tagline: "Clients keep data local; the server learns by aggregating the updates those clients can safely share.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.12-federated-learning.ipynb",
  context: String.raw`
    <p>distributed optimization provides local updates; multi-task learning (17.6) explains client heterogeneity; continual learning (17.9) explains round-to-round drift.</p>
  `,
  intuition: String.raw`
    <p>Useful data may be impossible to centralize. Federated learning sends the model to clients, trains locally, and aggregates updates. The subtle decision is weighting clients by examples, fairness goals, or reliability.</p>
  `,
  mathematics: String.raw`
    FedAvg is $w^{r+1}=\sum_k\frac{n_k}{\sum_j n_j}w_k^{r+1}$.<ol class="work"><li>counts $10,30,60$ sum to $100$</li><li>x-coordinate $=(10\cdot1+30\cdot0+60\cdot2)/100=1.300$</li><li>y-coordinate $=(10\cdot0+30\cdot1+60\cdot2)/100=1.500$</li><li>unweighted average would be $(1.000,1.000)$</li></ol><p>The aggregation represents data volume unless the objective deliberately says otherwise.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};

/* ---------------- 17.13 Multimodal learning (CLIP, vision-language) ---------------- */
window.ALLML_CONTENT["17.13"] = {
  tagline: "Different modalities become one learning problem when matched pairs are close in a shared embedding space.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/17.13-multimodal-learning.ipynb",
  context: String.raw`
    <p>contrastive learning (17.5) supplies the loss; zero-shot learning (17.8) explains text-defined classes; transfer (17.1) explains why aligned encoders become reusable.</p>
  `,
  intuition: String.raw`
    <p>Separate image and text models can fuse predictions, but they cannot retrieve across modalities. Alignment uses paired data so either modality supervises the other. The key decision is alignment rather than late fusion.</p>
  `,
  mathematics: String.raw`
    Let $S_{ij}=u_i^\top v_j/(\|u_i\|\|v_j\|)$.<ol class="work"><li>for $u=(1,0)$ and $v_1=(0.9,0.1)$, cosine $=0.9/\sqrt{0.82}=0.994$</li><li>for $v_2=(0.1,0.9)$, cosine $=0.1/\sqrt{0.82}=0.110$</li><li>with scale 5, scores become $4.970$ and $0.550$</li><li>matched probability $=e^{4.970}/(e^{4.970}+e^{0.550})=0.988$</li></ol><p>The diagonal match teaches a shared geometry for retrieval and zero-shot transfer.</p>
  `,
  pitfalls: String.raw`
    <ul>
      <li><b>The</b> mechanism fails when the assumed shared structure is actually a nuisance, because the formula then optimizes the wrong term.</li>
      <li><b>The</b> numeric score can look healthy while the comparison set is biased, so validation must match the target setting.</li>
      <li><b>Over-strengthening</b> the regularizer, threshold, or alignment term can remove useful task information along with noise.</li>
    </ul>
  `
};
