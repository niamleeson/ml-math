/* =====================================================================
   AFP-AI Learning Guide — Domain 4 · GenAI  (modules M20–M22)
   ---------------------------------------------------------------------
   Authored source for the AFP-AI track. One object per module.
   Read by tools/gen-afp.js (-> lessons/afp-ai.js) and
   tools/gen-afp-notebooks.js (-> notebooks/afp-mNN.ipynb).
   ===================================================================== */
"use strict";

const M20 = {
  m: 20, domain: 4,
  title: "Fine-tuning / distillation (classify & generate)",
  tagline: "Adapt a strong model to your task, then compress what it knows into something you can serve.",
  skipIf: "choose fine-tune vs distill and run it for a classifier.",
  mapsTo: ["all"],
  connections: {
    buildsOn: ["supervised learning", "cross-entropy loss", "embeddings and classifiers", "train/validation/test discipline"],
    leadsTo: ["multilingual content classifiers", "efficient GenAI serving", "LLM prompt and model improvement loops"],
    usedWith: ["softmax", "KL divergence", "low-rank matrix factorization", "temperature scaling"]
  },
  motivation:
    "<p>You already know how to train a classifier from labeled examples. The harder production question is what to do when the best starting point is a large pretrained model: should you prompt it, fine-tune it, adapt only a few parameters, or train a smaller student to imitate it? In AFP-AI work, that choice shows up in Instream Ads content classification, multilingual policy labels, and GenAI prompt-improvement systems.</p>" +
    "<p>The single load-bearing idea is <b>reuse the teacher signal without paying the full teacher cost forever</b>. Full fine-tuning changes every weight, PEFT/LoRA changes a small low-rank adapter, and distillation trains a compact student on the teacher's softened probabilities. You keep the knowledge that matters for the product slice while controlling latency, memory, governance, and iteration speed.</p>",
  definition:
    "<p><b>Definition.</b> Fine-tuning starts from pretrained parameters $\\theta_0$ and optimizes a task loss on labeled examples, producing $\\theta=\\theta_0+\\Delta\\theta$. Full fine-tuning lets every parameter move. Parameter-efficient fine-tuning, such as LoRA, freezes the base weight $W\\in\\mathbb{R}^{d\\times k}$ and learns a low-rank update $\\Delta W=BA$, where $B\\in\\mathbb{R}^{d\\times r}$, $A\\in\\mathbb{R}^{r\\times k}$, and $r\\ll\\min(d,k)$.</p>" +
    "<p><b>Distillation</b> trains a student model $s_\\phi$ to match a teacher distribution $q_T$ computed with temperature $T$: $$q_T(c)=\\frac{\\exp(z_c/T)}{\\sum_j \\exp(z_j/T)},\\qquad L_{KD}=T^2\\sum_c q_T(c)\\log\\frac{q_T(c)}{p_T(c)}.$$ Classification usually optimizes cross-entropy over labels or soft labels; generation optimizes next-token likelihood, preference losses, or task-specific judge scores. Prompt first when the behavior is already present, fine-tune when the behavior is missing but data is available, and distill when a strong behavior must become cheaper or more stable to serve.</p>",
  symbols: [
    { sym: "$W\\in\\mathbb{R}^{d\\times k}$", desc: "a dense pretrained weight matrix inside the base model." },
    { sym: "$\\Delta W=BA$", desc: "LoRA's trainable low-rank update, added to the frozen base weight." },
    { sym: "$r$", desc: "the adapter rank; smaller $r$ means fewer trainable parameters." },
    { sym: "$T$", desc: "temperature used to soften the teacher's logits before distillation." },
    { sym: "$q_T, p_T$", desc: "teacher and student class distributions after applying the same temperature." },
    { sym: "$L_{KD}$", desc: "the KL-divergence distillation loss from teacher to student." }
  ],
  derivation: [
    { do: "Count full fine-tune parameters", result: "$dk$ trainable values for one dense matrix", why: "full fine-tuning lets every entry of $W$ change" },
    { do: "Write the LoRA update", result: "$\\Delta W=BA$", why: "a rank-$r$ product can represent targeted directions without storing a full matrix" },
    { do: "Count LoRA parameters", result: "$dr+rk=r(d+k)$", why: "only matrices $B$ and $A$ are learned" },
    { do: "Compare counts", result: "saving ratio $\\frac{r(d+k)}{dk}$", why: "this is the adapter cost as a fraction of full fine-tuning" },
    { do: "Soften logits for distillation", result: "$q_T(c)=\\operatorname{softmax}(z_c/T)$", why: "larger $T$ reveals dark knowledge about near-miss classes" }
  ],
  worked: {
    problem: "A content-classification layer has $d=768$ input features and $k=512$ output features. Compare full fine-tuning with LoRA rank $r=8$.",
    skills: ["parameter counting", "LoRA", "serving tradeoff"],
    strategy: "Count trainable values before discussing accuracy; cost is the constraint LoRA is designed to relax.",
    steps: [
      { do: "Compute full parameters", result: "$768\\times512=393{,}216$", why: "full fine-tuning updates every entry in the dense weight" },
      { do: "Compute $B$ parameters", result: "$768\\times8=6{,}144$", why: "$B$ maps the rank-$8$ adapter back into the output dimension" },
      { do: "Compute $A$ parameters", result: "$8\\times512=4{,}096$", why: "$A$ maps the original representation into the rank-$8$ bottleneck" },
      { do: "Add adapter parameters", result: "$6{,}144+4{,}096=10{,}240$", why: "LoRA trains only $A$ and $B$" },
      { do: "Compute the fraction", result: "$10{,}240/393{,}216\\approx0.0260$", why: "the ratio shows trainable memory relative to a full update" },
      { do: "Convert to reduction", result: "about $38.4\\times$ fewer trainable parameters", why: "$393{,}216/10{,}240=38.4$" }
    ],
    verify: "The adapter has $r(d+k)=8(768+512)=10{,}240$ parameters, matching the step-by-step count.",
    answer: "Rank-8 LoRA trains 10,240 parameters instead of 393,216, about 2.6% of the full layer.",
    connects: "LoRA is low-rank supervised adaptation: it changes the task behavior while keeping the large pretrained model mostly fixed."
  },
  practice: [
    {
      problem: "A layer has $d=1024$, $k=4096$, and LoRA rank $r=16$. What fraction of full fine-tuning parameters does LoRA train?",
      steps: [
        { do: "Count full parameters", result: "$1024\\times4096=4{,}194{,}304$", why: "full fine-tuning changes every dense weight" },
        { do: "Count LoRA parameters", result: "$16(1024+4096)=81{,}920$", why: "LoRA trains $A$ and $B$ only" },
        { do: "Divide", result: "$81{,}920/4{,}194{,}304\\approx0.0195$", why: "the fraction compares adapter cost to full cost" }
      ],
      answer: "About 1.95% of the full parameters, or roughly $51.2\\times$ fewer trainable values."
    },
    {
      problem: "Teacher probabilities are $q=[0.70,0.20,0.10]$ and student probabilities are $p=[0.60,0.25,0.15]$. Compute $KL(q\Vert p)$ approximately.",
      steps: [
        { do: "Write the KL sum", result: "$\\sum_i q_i\\log(q_i/p_i)$", why: "distillation penalizes the student distribution for moving away from the teacher" },
        { do: "Compute class 1", result: "$0.70\\log(0.70/0.60)\\approx0.1079$", why: "the student underweights the teacher's top class" },
        { do: "Compute class 2", result: "$0.20\\log(0.20/0.25)\\approx-0.0446$", why: "the student overweights this class" },
        { do: "Compute class 3", result: "$0.10\\log(0.10/0.15)\\approx-0.0405$", why: "the student also overweights this class" },
        { do: "Add terms", result: "$0.1079-0.0446-0.0405\\approx0.0228$", why: "KL stays nonnegative after all terms are combined" }
      ],
      answer: "$KL(q\Vert p)\\approx0.023$ nats."
    },
    {
      problem: "A teacher logits vector is $[4,2,0]$. Why does temperature $T=2$ give a softer target than $T=1$?",
      steps: [
        { do: "Scale logits at $T=1$", result: "$[4,2,0]$", why: "ordinary softmax uses the raw logits" },
        { do: "Scale logits at $T=2$", result: "$[2,1,0]$", why: "temperature divides the logits before softmax" },
        { do: "Compare gaps", result: "top-to-second gap falls from $2$ to $1$", why: "smaller gaps make non-top classes receive more probability" }
      ],
      answer: "$T=2$ flattens the distribution, exposing near-miss class information for the student."
    },
    {
      problem: "For a multilingual Instream Ads classifier with 2,000 English labels but only 150 Spanish labels, should you prompt, fine-tune, or distill first?",
      steps: [
        { do: "Check task evidence", result: "there are labeled examples", why: "labels make supervised adaptation possible" },
        { do: "Check language transfer need", result: "cross-lingual pretrained model or multilingual adapter", why: "XLM-R-style representations can share signal across languages" },
        { do: "Choose first move", result: "fine-tune or PEFT, then distill if serving is expensive", why: "prompting alone wastes available labels, while distillation needs a competent teacher first" }
      ],
      answer: "Start with multilingual PEFT/fine-tuning; distill after the teacher is accurate enough and latency matters."
    },
    {
      problem: "A prompt-only creative generator passes 62% of rubric checks. A fine-tuned model passes 74%, but a distilled student passes 72% at half the latency. Which model is reasonable for serving?",
      steps: [
        { do: "Compute fine-tune gain", result: "$74-62=12$ percentage points", why: "fine-tuning improves task behavior over prompting" },
        { do: "Compute student drop", result: "$74-72=2$ percentage points", why: "distillation costs a small quality loss" },
        { do: "Compare latency", result: "student latency is $0.5\\times$ teacher latency", why: "serving cost is often the binding production constraint" }
      ],
      answer: "The distilled student is reasonable if a 2-point quality drop is acceptable for a 2x latency improvement."
    }
  ],
  applications: [
    { title: "Instream Ads content classification fine-tune", background: "Organic videos need topic, safety, and monetization labels before they can be matched to ads. A multilingual encoder can be adapted with a small classification head and LoRA adapters rather than updating every pretrained weight.", numbers: "For a $768\\times128$ head, full update is 98,304 weights; rank-8 LoRA is $8(768+128)=7,168$ weights, only $7.3\%$ of that layer's full update." },
    { title: "Multilingual text classification with XLM-R-style transfer", background: "Policy or taxonomy labels often arrive first in English and later in other languages. A shared multilingual model lets Spanish, French, and German examples benefit from the English decision boundary.", numbers: "With 10,000 English, 900 Spanish, and 600 French examples, a 70/15/15 split gives 7,000/1,500/1,500 English and only 420/90/90 French, so shared representation is not optional." },
    { title: "GenAI prompt improvement distillation", background: "A large teacher can score or rewrite advertiser prompts, but daily guidance traffic may need a smaller model. Distillation preserves the teacher's ranking of acceptable, borderline, and weak prompts.", numbers: "If teacher latency is 900 ms and student latency is 180 ms, the student is $900/180=5\\times$ faster; at 2 million calls/day, saved latency budget is about 1.44 billion ms/day." },
    { title: "Creative Intelligence guidance model", background: "Guidance suggestions such as stronger calls-to-action can be learned from expert labels and teacher rationales, then served as a compact classifier or generator.", numbers: "A teacher that lifts validation pass rate from 0.68 to 0.78 and a student that reaches 0.76 retains $(0.76-0.68)/(0.78-0.68)=80\%$ of the teacher's improvement." },
    { title: "Macro Creative Ranker feature teacher", background: "A large model can produce semantic creative-quality features that a ranker consumes; a distilled feature model reduces batch cost for daily refreshes.", numbers: "Processing 12 million creatives at 40 ms each costs 480,000 seconds of model time; a 10 ms student cuts that to 120,000 seconds, saving 360,000 seconds per refresh." },
    { title: "Classifier versus generator objective choice", background: "Some AFP-AI tasks need labels, such as brand-safety category; others need text, such as creative rewrites. Fine-tuning objective follows the output type.", numbers: "A 20-class classifier predicts one softmax over 20 labels; a 30-token rewrite predicts 30 next-token distributions, so the generator has 30 supervised decisions per example." },
    { title: "LLM-as-judge teacher for creative quality", background: "Judge scores can create soft labels for borderline creative examples, letting a student learn uncertainty rather than hard yes/no thresholds.", numbers: "If the teacher assigns [0.55, 0.45] to two classes, hard labels lose the 0.10 margin; soft-label KL keeps that uncertainty visible to the student." }
  ],
  applicationsClose:
    "<p>Fine-tuning, LoRA, and distillation are three uniforms for the same practical move: adapt knowledge to the AFP-AI slice, then serve it at the cost and reliability the product can afford. The math is small enough to count by hand, but the decision shapes every classifier, guidance model, and GenAI improvement loop.</p>",
  takeaways: [
    "Full fine-tuning updates all weights; LoRA freezes the base and trains $r(d+k)$ adapter parameters for a $d\\times k$ layer.",
    "Distillation trains a student on teacher soft labels, usually with KL divergence and temperature-scaled probabilities.",
    "Prompt when the behavior already exists, fine-tune or PEFT when labeled data should change behavior, and distill when a strong teacher must become cheaper to serve.",
    "Classifiers optimize label distributions; generators optimize token distributions or preference-style objectives."
  ],
  resources: [
    { label: "HuggingFace — PEFT / LoRA", note: "parameter-efficient fine-tuning" },
    { label: "DeepLearning.AI — Finetuning LLMs", note: "when and how to fine-tune" }
  ],
  papers: [
    "LoRA: Low-Rank Adaptation (Hu et al., 2021)",
    "DistilBERT (Sanh et al., 2019)",
    "XLM-R (Conneau et al., 2020)"
  ],
  notebook: [
    { t: "md", src: "# M20 · Fine-tuning / distillation\n\n_Curriculum · Domain 4 · GenAI_\n\nWe train a small teacher classifier for ad-text intent, then train a compact student on the teacher's soft labels. The math idea is $KL(q_T \\Vert p_T)$: the student learns the full teacher distribution, not just the winning class." },
    { t: "code", src: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.datasets import make_classification\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import accuracy_score\nfrom sklearn.metrics import log_loss\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n\nrng = np.random.default_rng(20)" },
    { t: "md", src: "## Synthetic AFP-AI classification task\n\nThink of each row as a creative or video candidate with text, visual, and account features. The label is a small taxonomy class for routing or guidance." },
    { t: "code", src: "X, y = make_classification(\n    n_samples=2400,\n    n_features=12,\n    n_informative=7,\n    n_redundant=2,\n    n_classes=3,\n    class_sep=2.0,\n    random_state=20\n)\n\nX_train, X_val, y_train, y_val = train_test_split(\n    X,\n    y,\n    test_size=0.30,\n    random_state=20,\n    stratify=y\n)\n\nscaler = StandardScaler()\nX_train = scaler.fit_transform(X_train)\nX_val = scaler.transform(X_val)\n\nprint(X_train.shape)\nprint(np.bincount(y_train))" },
    { t: "md", src: "## Teacher model\n\nThe teacher is allowed to use all 12 features. In a production system this could be a large multilingual encoder or LLM-derived classifier." },
    { t: "code", src: "teacher = LogisticRegression(\n    max_iter=1000,\n    C=3.0\n)\n\nteacher.fit(X_train, y_train)\n\nteacher_val = teacher.predict_proba(X_val)\nteacher_pred = teacher_val.argmax(axis=1)\nteacher_acc = accuracy_score(y_val, teacher_pred)\n\nprint(round(teacher_acc, 3))\nassert teacher_acc > 0.75" },
    { t: "md", src: "## Student from hard labels\n\nThe student sees only the first four features, mimicking a cheaper serving model. First we train it in the ordinary supervised way." },
    { t: "code", src: "student_hard = LogisticRegression(\n    max_iter=1000,\n    C=1.0\n)\n\nstudent_hard.fit(X_train[:, :4], y_train)\n\nhard_val = student_hard.predict_proba(X_val[:, :4])\nhard_pred = hard_val.argmax(axis=1)\nhard_acc = accuracy_score(y_val, hard_pred)\n\nprint(round(hard_acc, 3))" },
    { t: "md", src: "## Soft labels for distillation\n\nTemperature makes the teacher less certain, so near-miss classes still teach the student. We use $q_T(c)=\\operatorname{softmax}(z_c/T)$ conceptually; here probabilities are softened by raising them to $1/T$ and renormalizing." },
    { t: "code", src: "def soften(probabilities, temperature):\n    adjusted = probabilities ** (1.0 / temperature)\n    adjusted = adjusted / adjusted.sum(axis=1, keepdims=True)\n    return adjusted\n\nT = 2.0\nteacher_train = teacher.predict_proba(X_train)\nsoft_targets = soften(teacher_train, T)\n\nrow_sum = soft_targets[0].sum()\nprint(np.round(soft_targets[0], 3))\nassert np.isclose(row_sum, 1.0)" },
    { t: "md", src: "## Distilled student via sample weights\n\nScikit-learn does not train directly on soft multiclass labels, so we expand each row once per class with a sample weight equal to the teacher probability. This optimizes the same cross-entropy target." },
    { t: "code", src: "classes = np.arange(3)\nX_small = X_train[:, :4]\nX_distill = np.repeat(X_small, repeats=3, axis=0)\ny_distill = np.tile(classes, X_small.shape[0])\nw_distill = soft_targets.reshape(-1)\n\nstudent_soft = LogisticRegression(\n    max_iter=1000,\n    C=1.0\n)\n\nstudent_soft.fit(X_distill, y_distill, sample_weight=w_distill)\n\nsoft_val = student_soft.predict_proba(X_val[:, :4])\nsoft_pred = soft_val.argmax(axis=1)\nsoft_acc = accuracy_score(y_val, soft_pred)\n\nprint(round(soft_acc, 3))" },
    { t: "md", src: "## Compare teacher, hard student, and distilled student\n\nThe distilled student may or may not beat hard-label training on this small synthetic task, but it should learn a valid probability distribution and often improves calibration-like behavior." },
    { t: "code", src: "rows = [\n    {\"model\": \"teacher\", \"accuracy\": teacher_acc, \"log_loss\": log_loss(y_val, teacher_val)},\n    {\"model\": \"hard_student\", \"accuracy\": hard_acc, \"log_loss\": log_loss(y_val, hard_val)},\n    {\"model\": \"distilled_student\", \"accuracy\": soft_acc, \"log_loss\": log_loss(y_val, soft_val)}\n]\n\nresults = pd.DataFrame(rows)\nprint(results.round(3))\nassert np.allclose(soft_val.sum(axis=1), 1.0)" },
    { t: "code", src: "fig, ax = plt.subplots(figsize=(5, 3))\nax.bar(results[\"model\"], results[\"accuracy\"], color=[\"#4c78a8\", \"#f58518\", \"#54a24b\"])\nax.set_ylim(0.0, 1.0)\nax.set_ylabel(\"validation accuracy\")\nax.set_title(\"teacher and students\")\nplt.xticks(rotation=20)\nplt.show()" },
    { t: "md", src: "## Takeaway\n\nFine-tuning adapts behavior. Distillation transfers that behavior into a smaller model. LoRA sits between them by learning only a low-rank update $\\Delta W=BA$ instead of every weight." }
  ]
};

const M21 = {
  m: 21, domain: 4,
  title: "Diffusion & visual generation (forward/reverse denoising, conditioning/guidance, text-to-image/video)",
  tagline: "Generate by learning how to remove noise, one controlled step at a time.",
  skipIf: "explain how a conditioned diffusion model generates an image or video.",
  mapsTo: ["Creative Intelligence"],
  connections: {
    buildsOn: ["Gaussian noise", "conditional probability", "neural networks as denoisers", "gradient-like iterative updates"],
    leadsTo: ["text-to-image creative generation", "video generation", "guided creative editing", "synthetic data evaluation"],
    usedWith: ["noise schedules", "score matching", "classifier-free guidance", "latent representations"]
  },
  motivation:
    "<p>You can recognize when an image is noisy: the signal is still there, but buried. Diffusion models turn that instinct into a generative recipe. During training, we gradually corrupt clean examples until they become almost pure noise, then train a model to reverse each corruption step.</p>" +
    "<p>The gentle surprise is that generation begins from randomness. If a denoiser has learned what a good creative, product image, or short video frame should look like under a prompt, then repeated denoising can sculpt noise into a sample. Conditioning and guidance steer that sculpting toward a text prompt, brand constraint, format, or creative objective.</p>",
  definition:
    "<p><b>Definition.</b> A diffusion model defines a forward noising process and learns an approximate reverse denoising process. With noise schedule $\\beta_t$, let $\\alpha_t=1-\\beta_t$ and $\\bar\\alpha_t=\\prod_{s=1}^{t}\\alpha_s$. The closed-form forward sample is $$q(x_t\\mid x_0)=\\mathcal{N}\\left(\\sqrt{\\bar\\alpha_t}x_0,(1-\\bar\\alpha_t)I\\right),\\qquad x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\epsilon.$$</p>" +
    "<p>The reverse model usually predicts the added noise $\\epsilon_\\theta(x_t,t,c)$ under condition $c$ such as text. Classifier-free guidance combines conditional and unconditional predictions: $$\\hat\\epsilon=\\epsilon_{uncond}+w(\\epsilon_{cond}-\\epsilon_{uncond}).$$ Larger $w$ follows the prompt more strongly but can reduce diversity or create artifacts. Latent diffusion runs the process in a compressed latent space; video diffusion extends the same idea across time.</p>",
  symbols: [
    { sym: "$x_0$", desc: "the clean data point: an image, latent, or toy numeric sample." },
    { sym: "$x_t$", desc: "the noised version after $t$ diffusion steps." },
    { sym: "$\\beta_t$", desc: "the amount of fresh noise injected at step $t$." },
    { sym: "$\\alpha_t=1-\\beta_t$", desc: "the signal retained at step $t$." },
    { sym: "$\\bar\\alpha_t$", desc: "the cumulative retained signal through step $t$." },
    { sym: "$\\epsilon$", desc: "standard Gaussian noise added by the forward process." },
    { sym: "$w$", desc: "classifier-free guidance strength." }
  ],
  derivation: [
    { do: "Start with one step", result: "$x_t=\\sqrt{\\alpha_t}x_{t-1}+\\sqrt{1-\\alpha_t}\\epsilon_t$", why: "each forward step keeps some signal and adds Gaussian noise" },
    { do: "Substitute the previous step", result: "signal multiplier becomes $\\sqrt{\\alpha_t\\alpha_{t-1}}$", why: "successive retained-signal factors multiply" },
    { do: "Repeat to step $0$", result: "signal multiplier becomes $\\sqrt{\\prod_{s=1}^t\\alpha_s}=\\sqrt{\\bar\\alpha_t}$", why: "$\\bar\\alpha_t$ stores the cumulative schedule" },
    { do: "Collect Gaussian noise terms", result: "noise variance becomes $1-\\bar\\alpha_t$", why: "the process is designed so total variance stays normalized" },
    { do: "Write the closed form", result: "$x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\epsilon$", why: "we can sample any timestep directly during training" }
  ],
  worked: {
    problem: "Let $x_0=2.0$, $\\bar\\alpha_t=0.64$, noise $\\epsilon=-0.50$, conditional noise prediction $\\epsilon_{cond}=-0.30$, unconditional prediction $\\epsilon_{uncond}=0.10$, and guidance $w=2$. Compute the noised sample and guided prediction.",
    skills: ["forward diffusion", "square roots", "classifier-free guidance"],
    strategy: "Use the forward formula first, then apply guidance as a separate one-line correction.",
    steps: [
      { do: "Compute retained-signal scale", result: "$\\sqrt{0.64}=0.80$", why: "the clean sample is multiplied by $\\sqrt{\\bar\\alpha_t}$" },
      { do: "Compute noise scale", result: "$\\sqrt{1-0.64}=0.60$", why: "the added noise gets the remaining variance" },
      { do: "Scale clean signal", result: "$0.80\\times2.0=1.60$", why: "this is the part of $x_t$ still explained by $x_0$" },
      { do: "Scale noise", result: "$0.60\\times(-0.50)=-0.30$", why: "negative noise pulls the sample downward" },
      { do: "Add signal and noise", result: "$x_t=1.60-0.30=1.30$", why: "the forward noised sample is their sum" },
      { do: "Compute guidance delta", result: "$-0.30-0.10=-0.40$", why: "the delta is what the condition changes" },
      { do: "Apply guidance", result: "$0.10+2(-0.40)=-0.70$", why: "guidance amplifies the condition-specific direction" }
    ],
    verify: "Because $\\bar\\alpha_t=0.64$ is still fairly high, $x_t=1.30$ remains closer to $2.0$ than to pure noise; guidance moved the prediction past the conditional value as expected.",
    answer: "$x_t=1.30$ and the guided noise prediction is $\\hat\\epsilon=-0.70$.",
    connects: "Diffusion generation alternates these ideas: controlled noise schedules and conditional denoising directions."
  },
  practice: [
    {
      problem: "If $\\beta=[0.10,0.20,0.30]$, compute $\\bar\\alpha_3$.",
      steps: [
        { do: "Convert to alphas", result: "$\\alpha=[0.90,0.80,0.70]$", why: "$\\alpha_t=1-\\beta_t$" },
        { do: "Multiply", result: "$\\bar\\alpha_3=0.90\\times0.80\\times0.70=0.504$", why: "cumulative retained signal is the product of alphas" }
      ],
      answer: "$\\bar\\alpha_3=0.504$."
    },
    {
      problem: "With $x_0=1.5$, $\\bar\\alpha_t=0.25$, and $\\epsilon=0.80$, compute $x_t$.",
      steps: [
        { do: "Compute signal scale", result: "$\\sqrt{0.25}=0.50$", why: "half the clean amplitude remains" },
        { do: "Compute noise scale", result: "$\\sqrt{0.75}\\approx0.866$", why: "the rest of the variance is noise" },
        { do: "Add terms", result: "$0.50(1.5)+0.866(0.80)\\approx1.443$", why: "the forward sample is signal plus noise" }
      ],
      answer: "$x_t\\approx1.44$."
    },
    {
      problem: "Guidance has $\\epsilon_{cond}=0.20$, $\\epsilon_{uncond}=0.50$, and $w=3$. Compute $\\hat\\epsilon$.",
      steps: [
        { do: "Compute condition delta", result: "$0.20-0.50=-0.30$", why: "the condition asks for less predicted noise" },
        { do: "Scale the delta", result: "$3(-0.30)=-0.90$", why: "guidance amplifies the conditional direction" },
        { do: "Add to unconditional", result: "$0.50-0.90=-0.40$", why: "classifier-free guidance starts from the unconditional prediction" }
      ],
      answer: "$\\hat\\epsilon=-0.40$."
    },
    {
      problem: "A latent diffusion model compresses a $512\\times512\\times3$ image to a $64\\times64\\times4$ latent. What is the element-count reduction?",
      steps: [
        { do: "Count image elements", result: "$512\\times512\\times3=786{,}432$", why: "RGB pixels have three channels" },
        { do: "Count latent elements", result: "$64\\times64\\times4=16{,}384$", why: "the latent has smaller spatial size but four channels" },
        { do: "Divide", result: "$786{,}432/16{,}384=48$", why: "this compares diffusion workspace sizes" }
      ],
      answer: "The latent has $48\\times$ fewer elements than the pixel image."
    },
    {
      problem: "A video diffusion toy model generates 16 frames with 32 denoising steps per frame. If a new sampler uses 20 steps per frame, what is the step reduction?",
      steps: [
        { do: "Count old steps", result: "$16\\times32=512$", why: "each frame uses 32 denoising evaluations" },
        { do: "Count new steps", result: "$16\\times20=320$", why: "the sampler reduces evaluations per frame" },
        { do: "Compute reduction", result: "$(512-320)/512=0.375$", why: "relative savings are measured against the old cost" }
      ],
      answer: "The sampler reduces denoising evaluations by 37.5%."
    }
  ],
  applications: [
    { title: "Creative Intelligence diffusion for creatives", background: "Text-to-image diffusion can propose background variants, layout ideas, or product-context imagery for creative exploration while humans and policy systems remain in the loop.", numbers: "With 30 denoising steps and 6 candidates per prompt, one prompt requires $30\\times6=180$ denoiser calls; cutting to 20 steps saves 60 calls per prompt." },
    { title: "Classifier-free guidance for brand constraints", background: "A prompt such as 'professional B2B software ad with clear product screenshot' becomes a conditioning signal. Guidance makes the condition stronger, but too much guidance can reduce visual diversity.", numbers: "If $\\epsilon_{uncond}=0.4$, $\\epsilon_{cond}=0.1$, and $w=4$, then $\\hat\\epsilon=0.4+4(0.1-0.4)=-0.8$, a much stronger prompt-following direction." },
    { title: "Latent diffusion for efficient iteration", background: "Stable-diffusion-style systems denoise compressed latents instead of full pixels, which is why creative teams can iterate quickly on ordinary hardware-backed services.", numbers: "A $1024\\times1024\\times3$ image has 3,145,728 pixel values; a $128\\times128\\times4$ latent has 65,536 values, a $48\\times$ reduction." },
    { title: "Diffusion priors for Macro Creative Ranker experiments", background: "Generated variants can stress-test rankers by changing one visual factor at a time, such as background contrast or object placement, while measuring predicted creative quality.", numbers: "If 40 base creatives each get 5 variants, the experiment yields $40\\times5=200$ candidates; a ranker can score all 200 before selecting 20 for human review." },
    { title: "Text-to-video for Instream Ads prototyping", background: "Video diffusion extends denoising across time, helping prototype short motion concepts before production. Temporal consistency is the added challenge beyond single images.", numbers: "A 4-second concept at 8 frames per second has $4\\times8=32$ frames; at 24 denoising steps each, that is 768 frame-step evaluations before batching." },
    { title: "Prompt improvement loops", background: "A prompt improver can rewrite advertiser instructions before generation, then a judge or ranker selects the best output. Diffusion is one part of a generate-score-improve loop.", numbers: "If 3 prompt rewrites each produce 4 images, the loop creates 12 images; selecting the top 2 means a $2/12=16.7\%$ review pass-through rate." },
    { title: "Synthetic negative examples for visual classifiers", background: "Controlled generation can create hard negatives, such as images that look close to a prohibited style but remain labeled safe or unsafe by policy reviewers.", numbers: "Adding 600 hard negatives to a validation set with 2,400 examples makes hard negatives $600/(2400+600)=20\%$ of the new set, enough to visibly affect precision estimates." }
  ],
  applicationsClose:
    "<p>Diffusion looks like visual magic, but the working parts are measurable: a schedule, a noised sample, a denoiser, and a guidance scale. Whether the output is a creative image, a video storyboard, or synthetic classifier data, the same denoise-from-noise thread carries through.</p>",
  takeaways: [
    "The forward process has a closed form: $x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\epsilon$.",
    "The reverse model learns to predict and remove noise, often conditioned on text or creative constraints.",
    "Classifier-free guidance amplifies the difference between conditional and unconditional denoising predictions.",
    "Latent and video diffusion keep the same math but change the representation and temporal structure."
  ],
  resources: [
    { label: "Lil'Log — What are Diffusion Models?", note: "forward/reverse process math" },
    { label: "HuggingFace — Diffusion Models course", note: "DDPM/DDIM in code" },
    { label: "fast.ai — Stable Diffusion", note: "latent diffusion, guidance" }
  ],
  papers: [
    "DDPM (Ho et al., 2020)",
    "Latent / Stable Diffusion (Rombach et al., 2022)",
    "Classifier-Free Guidance (Ho & Salimans, 2022)",
    "DiT (Peebles & Xie, 2023)",
    "Video Diffusion Models (Ho et al., 2022)",
    "Sora technical report (OpenAI, 2024)"
  ],
  notebook: [
    { t: "md", src: "# M21 · Diffusion & visual generation\n\n_Curriculum · Domain 4 · GenAI_\n\nWe build a tiny CPU-only diffusion demo. The forward formula is $x_t=\\sqrt{\\bar\\alpha_t}x_0+\\sqrt{1-\\bar\\alpha_t}\\epsilon$, and the reverse process will denoise a toy distribution." },
    { t: "code", src: "import numpy as np\nimport matplotlib.pyplot as plt\n\nrng = np.random.default_rng(21)" },
    { t: "md", src: "## A toy creative distribution\n\nInstead of images, we use 2-D points from two clusters. Think of the axes as two learned visual features, such as warmth and contrast." },
    { t: "code", src: "n = 600\nleft = rng.normal(loc=[-2.0, 0.0], scale=0.35, size=(n // 2, 2))\nright = rng.normal(loc=[2.0, 0.0], scale=0.35, size=(n // 2, 2))\nx0 = np.vstack([left, right])\nlabels = np.array([0] * (n // 2) + [1] * (n // 2))\n\nprint(x0.shape)\nassert x0.shape == (600, 2)" },
    { t: "md", src: "## Noise schedule\n\nA schedule chooses $\\beta_t$, then $\\alpha_t=1-\\beta_t$, then $\\bar\\alpha_t=\\prod_{s=1}^t\\alpha_s$. Smaller $\\bar\\alpha_t$ means less original signal remains." },
    { t: "code", src: "timesteps = 60\nbeta = np.linspace(0.0005, 0.05, timesteps)\nalpha = 1.0 - beta\nalpha_bar = np.cumprod(alpha)\n\nprint(alpha_bar[:5].round(4))\nprint(alpha_bar[-1].round(4))\nassert np.all(np.diff(alpha_bar) < 0)" },
    { t: "md", src: "## Forward diffusion\n\nWe can sample any timestep directly from the closed form. That is why diffusion training can pick random timesteps instead of simulating every earlier step." },
    { t: "code", src: "def q_sample(clean, step, noise):\n    signal = np.sqrt(alpha_bar[step]) * clean\n    scaled_noise = np.sqrt(1.0 - alpha_bar[step]) * noise\n    return signal + scaled_noise\n\nnoise = rng.normal(size=x0.shape)\nx_mid = q_sample(x0, 25, noise)\nx_late = q_sample(x0, 59, noise)\n\nprint(np.var(x0).round(3))\nprint(np.var(x_late).round(3))\nassert x_mid.shape == x0.shape" },
    { t: "code", src: "fig, axes = plt.subplots(1, 3, figsize=(11, 3))\nsets = [(x0, \"clean\"), (x_mid, \"mid noise\"), (x_late, \"late noise\")]\nfor ax, item in zip(axes, sets):\n    points = item[0]\n    title = item[1]\n    ax.scatter(points[:, 0], points[:, 1], s=8, alpha=0.55)\n    ax.set_title(title)\n    ax.set_xlim(-4, 4)\n    ax.set_ylim(-3, 3)\nplt.show()" },
    { t: "md", src: "## A tiny reverse denoiser\n\nFor the toy distribution, we know the two cluster centers. A simple denoiser can pull each point toward the nearest center, with stronger pulls as the sample gets cleaner." },
    { t: "code", src: "centers = np.array([[-2.0, 0.0], [2.0, 0.0]])\n\ndef nearest_center(points):\n    distances = ((points[:, None, :] - centers[None, :, :]) ** 2).sum(axis=2)\n    closest = distances.argmin(axis=1)\n    return centers[closest]\n\ndef reverse_step(points, step):\n    target = nearest_center(points)\n    strength = 0.08 + 0.20 * (1.0 - alpha_bar[step])\n    fresh_noise = rng.normal(scale=0.025, size=points.shape)\n    updated = points + strength * (target - points) + fresh_noise\n    return updated" },
    { t: "code", src: "sample = rng.normal(size=(600, 2))\ntrajectory = [sample.copy()]\nfor step in range(timesteps - 1, -1, -1):\n    sample = reverse_step(sample, step)\n    if step in [45, 30, 15, 0]:\n        trajectory.append(sample.copy())\n\nfinal_mean_abs_y = np.abs(sample[:, 1]).mean()\nprint(round(final_mean_abs_y, 3))\nassert final_mean_abs_y < 0.35" },
    { t: "code", src: "fig, axes = plt.subplots(1, len(trajectory), figsize=(14, 3))\ntitles = [\"noise\", \"t=45\", \"t=30\", \"t=15\", \"final\"]\nfor ax, points, title in zip(axes, trajectory, titles):\n    ax.scatter(points[:, 0], points[:, 1], s=8, alpha=0.55)\n    ax.set_xlim(-4, 4)\n    ax.set_ylim(-3, 3)\n    ax.set_title(title)\nplt.show()" },
    { t: "md", src: "## Guidance in one dimension\n\nClassifier-free guidance combines unconditional and conditional noise predictions: $\\hat\\epsilon=\\epsilon_{uncond}+w(\\epsilon_{cond}-\\epsilon_{uncond})$." },
    { t: "code", src: "eps_uncond = 0.25\neps_cond = -0.10\nw = 2.5\neps_guided = eps_uncond + w * (eps_cond - eps_uncond)\n\nprint(eps_guided)\nassert eps_guided < eps_cond" },
    { t: "md", src: "## Takeaway\n\nA production visual model replaces our nearest-center rule with a neural denoiser, and replaces the toy condition with text, image, or brand constraints. The schedule, forward noising, reverse denoising, and guidance idea stay the same." }
  ]
};

const M22 = {
  m: 22, domain: 4,
  title: "LLM-as-judge & validating the judge (rubric design, human-agreement, bias, calibration)",
  tagline: "Use a model to evaluate outputs only after you measure how well the evaluator behaves.",
  skipIf: "quantify a judge's agreement with humans and detect and correct its biases.",
  mapsTo: ["Creative Intelligence", "Instream Ads perf"],
  connections: {
    buildsOn: ["classification metrics", "correlation", "confusion matrices", "calibration"],
    leadsTo: ["rubric-based creative evaluation", "offline GenAI gates", "judge monitoring", "human-in-the-loop review"],
    usedWith: ["Cohen's kappa", "rank correlation", "A/B test guardrails", "bias audits"]
  },
  motivation:
    "<p>LLM-as-judge is tempting because GenAI systems produce open-ended text, images, and recommendations faster than humans can review them. A judge can score whether a creative rewrite is clear, whether a prompt follows policy, or whether a video classification rationale is grounded. But a judge is still a model, and models can be confidently wrong.</p>" +
    "<p>The core habit is <b>validate the evaluator before trusting the evaluation</b>. A good rubric makes the task legible; agreement statistics compare judge decisions to humans; bias probes reveal whether answer order, verbosity, or model identity changes the verdict. Once measured, those issues can be mitigated with swaps, calibration sets, length controls, and human escalation.</p>",
  definition:
    "<p><b>Definition.</b> An LLM judge maps an item $x$, candidate output $a$, and rubric $r$ to a score or label $J(x,a,r)$. Validation compares judge labels with human labels. For two raters and $K$ categories, Cohen's kappa is $$\\kappa=\\frac{p_o-p_e}{1-p_e},\\qquad p_e=\\sum_{k=1}^{K}p_{H,k}p_{J,k},$$ where $p_o$ is observed agreement and $p_e$ is agreement expected by chance from the raters' marginal label rates.</p>" +
    "<p>For numeric scores, also inspect correlation, calibration by score bucket, and disagreement examples. For pairwise judgments, test <b>position bias</b> by swapping candidate order: a reliable judge should not prefer the first answer merely because it appears first. Mitigations include order randomization, swapped duplicate evaluations, concise rubrics, length normalization, and human review for low-confidence or high-impact cases.</p>",
  symbols: [
    { sym: "$J(x,a,r)$", desc: "the judge score or label for item $x$, answer $a$, and rubric $r$." },
    { sym: "$p_o$", desc: "observed agreement between human and judge labels." },
    { sym: "$p_e$", desc: "chance agreement implied by each rater's marginal label frequencies." },
    { sym: "$\\kappa$", desc: "Cohen's kappa; 1 means perfect agreement, 0 means chance-level agreement." },
    { sym: "$\\rho$", desc: "a correlation coefficient for continuous or ordinal judge scores." },
    { sym: "$b$", desc: "a measured bias effect, such as extra win rate for the first position." }
  ],
  derivation: [
    { do: "Count exact matches", result: "$p_o=\\text{matches}/n$", why: "observed agreement is the raw rate of same labels" },
    { do: "Compute human marginals", result: "$p_{H,k}=\\text{human count for class }k/n$", why: "chance agreement depends on how often humans use each label" },
    { do: "Compute judge marginals", result: "$p_{J,k}=\\text{judge count for class }k/n$", why: "a judge that overuses one class can agree by chance" },
    { do: "Compute chance agreement", result: "$p_e=\\sum_k p_{H,k}p_{J,k}$", why: "independent raters would match at this rate from marginals alone" },
    { do: "Subtract and normalize", result: "$\\kappa=(p_o-p_e)/(1-p_e)$", why: "kappa measures agreement beyond chance on a 0-to-1-chance-adjusted scale" }
  ],
  worked: {
    problem: "Eight creative outputs receive human labels $[1,1,0,1,0,0,1,0]$ and judge labels $[1,0,0,1,0,1,1,0]$. Compute Cohen's kappa. Then a pairwise judge chooses A over B before swapping, but B over A after swapping; what bias signal appears?",
    skills: ["agreement", "marginals", "Cohen's kappa", "bias detection"],
    strategy: "Compute observed agreement first, then correct for chance using the two sets of label rates.",
    steps: [
      { do: "Count matches", result: "matches at positions 1,3,4,5,7,8 = 6", why: "these are the examples where human and judge labels are equal" },
      { do: "Compute observed agreement", result: "$p_o=6/8=0.75$", why: "six of eight labels match" },
      { do: "Compute human positive rate", result: "$p_{H,1}=4/8=0.50$", why: "humans used label 1 four times" },
      { do: "Compute judge positive rate", result: "$p_{J,1}=4/8=0.50$", why: "the judge used label 1 four times" },
      { do: "Compute chance agreement", result: "$p_e=0.5\\times0.5+0.5\\times0.5=0.50$", why: "both positive and negative chance matches count" },
      { do: "Compute kappa", result: "$\\kappa=(0.75-0.50)/(1-0.50)=0.50$", why: "half of the possible beyond-chance agreement has been achieved" },
      { do: "Read the swap", result: "winner follows position", why: "choosing A first and B after swap suggests first-position preference rather than stable quality judgment" }
    ],
    verify: "Raw agreement is 75%, but chance agreement is 50%, so kappa must be lower than 0.75; the computed 0.50 is plausible.",
    answer: "$\\kappa=0.50$; the swap indicates position bias and should trigger order randomization or paired swap evaluation.",
    connects: "A judge is useful only when agreement and bias checks make its scores trustworthy enough for the decision."
  },
  practice: [
    {
      problem: "A judge matches humans on 18 of 24 examples. Human positives are 12, judge positives are 14. Compute kappa.",
      steps: [
        { do: "Compute observed agreement", result: "$p_o=18/24=0.75$", why: "agreement is matches divided by examples" },
        { do: "Compute marginals", result: "$p_{H,1}=0.50$, $p_{J,1}=14/24\\approx0.583$", why: "positive rates define chance positive agreement" },
        { do: "Compute chance agreement", result: "$p_e=0.50(0.583)+0.50(0.417)=0.50$", why: "human positives and negatives are balanced" },
        { do: "Compute kappa", result: "$(0.75-0.50)/(1-0.50)=0.50$", why: "normalize beyond-chance agreement" }
      ],
      answer: "$\\kappa=0.50$."
    },
    {
      problem: "Human scores are $[1,2,3,4]$ and judge scores are $[1,2,4,5]$. Is correlation high or low? Compute the Pearson correlation approximately.",
      steps: [
        { do: "Notice the relationship", result: "judge = human except the last two are one point higher", why: "the ranking is identical" },
        { do: "Compute centered vectors", result: "human $[-1.5,-0.5,0.5,1.5]$, judge $[-2,-1,1,2]$", why: "correlation compares centered movement" },
        { do: "Compute correlation", result: "$7/(\\sqrt{5}\\sqrt{10})\\approx0.99$", why: "the vectors are almost perfectly aligned" }
      ],
      answer: "The correlation is very high, about 0.99, though the judge is miscalibrated upward at high scores."
    },
    {
      problem: "In 100 pairwise tests, candidate A is shown first 50 times and wins 34; candidate B is shown first 50 times and wins 33. Estimate first-position win rate.",
      steps: [
        { do: "Count first-position wins", result: "$34+33=67$", why: "both candidates benefit when placed first" },
        { do: "Divide by trials", result: "$67/100=0.67$", why: "position bias is measured over all paired tests" },
        { do: "Compare to neutral", result: "$0.67-0.50=0.17$", why: "a fair order should be near 50% first-position wins" }
      ],
      answer: "The first-position win rate is 67%, a 17-point bias over neutral."
    },
    {
      problem: "A rubric has four criteria, each scored 1 to 5. Why might you ask for criterion scores before the final score?",
      steps: [
        { do: "Separate evidence", result: "four explicit sub-scores", why: "the judge must attend to each rubric dimension" },
        { do: "Reduce halo effects", result: "final score follows the criteria", why: "a strong first impression is less able to dominate everything" },
        { do: "Audit disagreement", result: "humans can see which criterion diverged", why: "debugging a judge needs localized failure signals" }
      ],
      answer: "Criterion-first scoring makes the judgment more auditable and usually more stable."
    },
    {
      problem: "A judge gives long answers an average score of 4.2 and short answers an average score of 3.6, while humans score both groups 3.8. What mitigation should you try?",
      steps: [
        { do: "Compute judge length gap", result: "$4.2-3.6=0.6$", why: "the judge rewards verbosity" },
        { do: "Compute human length gap", result: "$3.8-3.8=0.0$", why: "humans do not show the same preference" },
        { do: "Choose mitigation", result: "control length or include concise-answer instruction", why: "the measured bias is tied to verbosity" }
      ],
      answer: "Use length controls, rubric language that penalizes verbosity without substance, and calibration by length bucket."
    }
  ],
  applications: [
    { title: "Creative Intelligence LLM-as-judge gate", background: "Generated creative suggestions need a scalable quality check before human review. A rubric judge can score clarity, policy fit, and actionability, but only after agreement with human reviewers is measured.", numbers: "On 200 calibration items, 158 exact matches gives $p_o=0.79$; if chance agreement from marginals is 0.52, then $\\kappa=(0.79-0.52)/(1-0.52)=0.5625$." },
    { title: "Macro Creative Ranker offline labels", background: "A judge can provide weak labels for creative quality features that later feed a ranker. Bias checks keep the judge from rewarding verbose or template-like outputs rather than true creative usefulness.", numbers: "If the top score bucket has 120 items and humans approve 96, calibration for that bucket is $96/120=0.80$; a judge confidence of 0.95 is overconfident by 0.15." },
    { title: "Guidance model response evaluation", background: "Guidance models suggest fixes for advertisers. Human agreement matters because bad guidance can waste advertiser time even if the text sounds polished.", numbers: "If a judge accepts 430 of 500 suggestions and humans accept 390, the judge acceptance rate is 86% versus human 78%, an 8-point leniency gap to investigate." },
    { title: "GenAI prompt improvement A/B triage", background: "Prompt rewrites can be compared pairwise by an LLM judge before online testing. Swapping order is a cheap test for position bias.", numbers: "Across 300 swapped pairs, first-position wins 189 times, so first-position rate is $189/300=0.63$; random order plus averaging swapped verdicts is needed." },
    { title: "Instream Ads content-classification rationales", background: "When classifiers produce rationales for why a video matches a category, an LLM judge can check whether the rationale is grounded in the transcript and visual labels.", numbers: "If groundedness labels have 45 disagreements out of 250 reviewed cases, raw agreement is $205/250=0.82$ before chance correction." },
    { title: "Multilingual judge validation", background: "A judge that works in English may not agree with reviewers in Spanish, German, or Japanese. Agreement should be sliced by language, not averaged away.", numbers: "If kappa is 0.64 in English and 0.31 in Spanish on equal 100-item samples, the macro average is $(0.64+0.31)/2=0.475$, hiding the Spanish failure if only total accuracy is reported." },
    { title: "Calibration for automated escalation", background: "A calibrated judge can route high-confidence passes automatically while sending uncertain or high-impact items to humans. Calibration turns scores into operational thresholds.", numbers: "With 10,000 daily outputs, auto-approving the top 30% sends 3,000 through the judge and leaves 7,000 for review or additional filters; a 2% false-pass rate means 60 bad auto-passes per day." }
  ],
  applicationsClose:
    "<p>LLM judges are most useful when treated like measurement instruments: define the rubric, calibrate against humans, probe bias, and monitor slices that matter. The same agreement math can protect creative generation, content classification, prompt improvement, and ranking labels.</p>",
  takeaways: [
    "A judge prompt is not an evaluation system by itself; validation against human labels is required.",
    "Cohen's kappa corrects raw agreement for chance agreement caused by label marginals.",
    "Position, verbosity, and self-preference biases should be measured with controlled probes and mitigated with swaps, length controls, and calibration.",
    "Report judge quality by slice, especially language, content type, and score bucket."
  ],
  resources: [
    { label: "MT-Bench (Zheng et al.)", note: "LLM-as-judge benchmark + agreement study" },
    { label: "G-Eval (Liu et al.)", note: "rubric-based LLM evaluation" },
    { label: "Eugene Yan — LLM-evaluators", note: "practical judge design + pitfalls" },
    { label: "Ragas docs", note: "RAG/LLM eval metrics" }
  ],
  papers: [
    "Judging LLM-as-a-Judge with MT-Bench (Zheng et al., 2023)",
    "G-Eval (Liu et al., 2023)",
    "LLMs are not Fair Evaluators — position bias (Wang et al., 2023)",
    "Constitutional AI (Bai et al., 2022)"
  ],
  notebook: [
    { t: "md", src: "# M22 · LLM-as-judge validation\n\n_Curriculum · Domain 4 · GenAI_\n\nWe simulate a judge and humans, then compute agreement, correlation, calibration, and position bias. The key statistic is Cohen's $\\kappa=(p_o-p_e)/(1-p_e)$." },
    { t: "code", src: "import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom sklearn.metrics import cohen_kappa_score\nfrom sklearn.metrics import confusion_matrix\n\nrng = np.random.default_rng(22)" },
    { t: "md", src: "## Simulate human labels and judge labels\n\nLabels are binary for simplicity: 1 means the creative response passes the rubric, 0 means it does not." },
    { t: "code", src: "n = 240\nhuman = rng.binomial(1, 0.58, size=n)\nflip = rng.binomial(1, 0.18, size=n)\njudge = np.where(flip == 1, 1 - human, human)\n\nprint(np.bincount(human))\nprint(np.bincount(judge))\nassert len(human) == len(judge)" },
    { t: "md", src: "## Cohen's kappa\n\nRaw agreement can look good when both raters overuse the same label. Kappa subtracts chance agreement implied by label frequencies." },
    { t: "code", src: "observed = np.mean(human == judge)\nhuman_pos = human.mean()\njudge_pos = judge.mean()\nexpected = human_pos * judge_pos + (1.0 - human_pos) * (1.0 - judge_pos)\nkappa_manual = (observed - expected) / (1.0 - expected)\nkappa_sklearn = cohen_kappa_score(human, judge)\n\nprint(round(observed, 3))\nprint(round(expected, 3))\nprint(round(kappa_manual, 3))\nassert np.isclose(kappa_manual, kappa_sklearn)" },
    { t: "code", src: "cm = confusion_matrix(human, judge)\ncm_df = pd.DataFrame(cm, index=[\"human_fail\", \"human_pass\"], columns=[\"judge_fail\", \"judge_pass\"])\nprint(cm_df)" },
    { t: "md", src: "## Numeric judge scores\n\nFor score rubrics, correlation asks whether the judge moves with humans. Calibration asks whether a score value means what it claims." },
    { t: "code", src: "human_score = rng.normal(loc=3.2 + 1.2 * human, scale=0.55, size=n)\njudge_score = 0.7 * human_score + rng.normal(loc=0.8, scale=0.45, size=n)\nhuman_score = np.clip(human_score, 1.0, 5.0)\njudge_score = np.clip(judge_score, 1.0, 5.0)\ncorrelation = np.corrcoef(human_score, judge_score)[0, 1]\n\nprint(round(correlation, 3))\nassert correlation > 0.5" },
    { t: "code", src: "bins = pd.cut(judge_score, bins=[1, 2, 3, 4, 5], include_lowest=True)\ncalibration = pd.DataFrame({\"human_pass\": human, \"judge_score\": judge_score, \"bin\": bins})\ncalibration_table = calibration.groupby(\"bin\", observed=False).agg(\n    items=(\"human_pass\", \"size\"),\n    human_pass_rate=(\"human_pass\", \"mean\"),\n    avg_judge_score=(\"judge_score\", \"mean\")\n)\n\nprint(calibration_table.round(3))" },
    { t: "md", src: "## Position-bias demo\n\nA fair pairwise judge should not prefer whichever answer is shown first. We simulate a judge with a first-position boost, then repeat with swapped order." },
    { t: "code", src: "pairs = 300\ntrue_quality_a = rng.normal(size=pairs)\ntrue_quality_b = rng.normal(size=pairs)\nposition_boost = 0.35\nnoise_ab = rng.normal(scale=0.25, size=pairs)\nnoise_ba = rng.normal(scale=0.25, size=pairs)\nscore_a_first = true_quality_a + position_boost + noise_ab\nscore_b_second = true_quality_b\nscore_b_first = true_quality_b + position_boost + noise_ba\nscore_a_second = true_quality_a\nchoose_a_when_first = score_a_first > score_b_second\nchoose_b_when_first = score_b_first > score_a_second\nfirst_position_wins = np.mean(np.r_[choose_a_when_first, choose_b_when_first])\n\nprint(round(first_position_wins, 3))\nassert first_position_wins > 0.55" },
    { t: "code", src: "stable_a_win = np.mean(choose_a_when_first & np.logical_not(choose_b_when_first))\nstable_b_win = np.mean(np.logical_not(choose_a_when_first) & choose_b_when_first)\nflip_rate = np.mean(choose_a_when_first == choose_b_when_first)\n\nprint(\"stable A win\", round(stable_a_win, 3))\nprint(\"stable B win\", round(stable_b_win, 3))\nprint(\"position-driven flip\", round(flip_rate, 3))" },
    { t: "md", src: "## Visual checks\n\nPlots make judge behavior easier to explain to stakeholders: confusion matrices for labels, scatterplots for score agreement, and bar charts for bias probes." },
    { t: "code", src: "fig, axes = plt.subplots(1, 2, figsize=(10, 3))\naxes[0].scatter(human_score, judge_score, alpha=0.5, s=15)\naxes[0].set_xlabel(\"human score\")\naxes[0].set_ylabel(\"judge score\")\naxes[0].set_title(\"score agreement\")\naxes[1].bar([\"first position\", \"neutral\"], [first_position_wins, 0.5], color=[\"#f58518\", \"#4c78a8\"])\naxes[1].set_ylim(0, 1)\naxes[1].set_title(\"position bias\")\nplt.show()" },
    { t: "md", src: "## Takeaway\n\nA judge can accelerate evaluation only after it is measured. Always report agreement, calibration, and bias probes by the slices that matter for the product." }
  ]
};

module.exports = [M20, M21, M22];
