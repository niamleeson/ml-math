/* All ML — authored content for Part 3: Core Machine Learning (3.1–3.48).
   Generated with verified arithmetic; LaTeX via String.raw; emphasis is bold only. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

/* ---------------- 3.1 ML framing (supervised/unsupervised/semi/self) ---------------- */
window.ALLML_CONTENT["3.1"] = {
  tagline: "Risk view: choose the data signal, target, and loss before choosing the algorithm.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.1-ml-framing.ipynb",
  context: String.raw`
    <p>ML framing (supervised/unsupervised/semi/self) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (1.11) into (3.2). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>ML framing (supervised/unsupervised/semi/self)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat f=\arg\min_{f\in\mathcal F}\frac1m\sum_{i=1}^m\ell(f(x_i),y_i)$$</div>
    <p>$x_i$ is an input row, $y_i$ is present for supervised examples, $\ell$ is the lesson's loss, $m$ is the number of rows, and $\mathcal F$ is the allowed family.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.191, 0.122, and 0.522. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.191+0.122+0.522)/3=0.835/3=0.278$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.278+0.060=0.338$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.378. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.378-0.338=0.040$</li>
      <li>$relative\ gap=(0.378-0.338)/0.378=0.106$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.338=0.270$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.338, the flexible alternative 0.378, and the stabilized score 0.270.</p>
    <ol class="work">
      <li>$\min(0.338,0.378,0.270)=0.270$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.278$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.2 Generalization & the i.i.d. assumption ---------------- */
window.ALLML_CONTENT["3.2"] = {
  tagline: "Generalization is possible when train and future examples are drawn by the same mechanism.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.2-generalization-iid.ipynb",
  context: String.raw`
    <p>Generalization & the i.i.d. assumption begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.1) into (3.3). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Generalization & the i.i.d. assumption</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$R(f)=\mathbb E[\ell(f(X),Y)],\qquad R_S(f)=\frac1m\sum_{i=1}^m\ell(f(x_i),y_i)$$</div>
    <p>$R$ is future risk, $R_S$ is training risk, and i.i.d. says each pair $(x_i,y_i)$ is an independent draw from the same distribution.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.202, 0.135, and 0.539. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.202+0.135+0.539)/3=0.876/3=0.292$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.292+0.070=0.362$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.406. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.406-0.362=0.044$</li>
      <li>$relative\ gap=(0.406-0.362)/0.406=0.108$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.362=0.290$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.362, the flexible alternative 0.406, and the stabilized score 0.290.</p>
    <ol class="work">
      <li>$\min(0.362,0.406,0.290)=0.290$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.292$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.3 The bias–variance tradeoff ---------------- */
window.ALLML_CONTENT["3.3"] = {
  tagline: "Expected error separates into systematic miss, sensitivity to samples, and irreducible noise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.3-bias-variance.ipynb",
  context: String.raw`
    <p>The bias–variance tradeoff begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.2) into (3.4). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>The bias–variance tradeoff</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\mathbb E[(Y-\hat f(x))^2]=\text{bias}^2+\text{variance}+\sigma^2$$</div>
    <p>The three terms are squared average error, prediction spread across training sets, and noise no model can remove.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.213, 0.148, and 0.420. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.213+0.148+0.420)/3=0.781/3=0.260$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.260+0.080=0.340$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.388. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.388-0.340=0.048$</li>
      <li>$relative\ gap=(0.388-0.340)/0.388=0.124$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.340=0.272$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.340, the flexible alternative 0.388, and the stabilized score 0.272.</p>
    <ol class="work">
      <li>$\min(0.340,0.388,0.272)=0.272$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.260$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.4 The perceptron algorithm ---------------- */
window.ALLML_CONTENT["3.4"] = {
  tagline: "A linear separator learns by moving toward misclassified positives and away from misclassified negatives.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.4-perceptron.ipynb",
  context: String.raw`
    <p>The perceptron algorithm begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.3) into (3.5). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>The perceptron algorithm</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$w\leftarrow w+y_i x_i\quad\text{when }y_i(w^\top x_i)\le 0$$</div>
    <p>$w\in\mathbb R^d$ is the weight vector, $x_i\in\mathbb R^d$ is one example, and $y_i\in\{-1,+1\}$ is its sign label.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.224, 0.070, and 0.437. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.224+0.070+0.437)/3=0.731/3=0.244$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.244+0.090=0.334$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.386. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.386-0.334=0.052$</li>
      <li>$relative\ gap=(0.386-0.334)/0.386=0.135$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.334=0.267$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.334, the flexible alternative 0.386, and the stabilized score 0.267.</p>
    <ol class="work">
      <li>$\min(0.334,0.386,0.267)=0.267$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.244$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.5 Linear regression (OLS & normal equation) ---------------- */
window.ALLML_CONTENT["3.5"] = {
  tagline: "OLS chooses coefficients whose fitted line makes squared residuals as small as possible.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.5-linear-regression-ols.ipynb",
  context: String.raw`
    <p>Linear regression (OLS & normal equation) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.4) into (3.6). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Linear regression (OLS & normal equation)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat\beta=(X^\top X)^{-1}X^\top y$$</div>
    <p>$X\in\mathbb R^{m\times d}$ is the design matrix, $y\in\mathbb R^m$ is the target vector, and $\hat\beta\in\mathbb R^d$ contains fitted coefficients.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.235, 0.083, and 0.454. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.235+0.083+0.454)/3=0.772/3=0.257$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.257+0.100=0.357$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.393. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.393-0.357=0.036$</li>
      <li>$relative\ gap=(0.393-0.357)/0.393=0.092$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.357=0.286$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.357, the flexible alternative 0.393, and the stabilized score 0.286.</p>
    <ol class="work">
      <li>$\min(0.357,0.393,0.286)=0.286$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.257$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.6 Linear regression via gradient descent ---------------- */
window.ALLML_CONTENT["3.6"] = {
  tagline: "Gradient descent reaches the OLS solution by taking repeated downhill steps on squared error.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.6-linear-regression-gradient-descent.ipynb",
  context: String.raw`
    <p>Linear regression via gradient descent begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.5) into (3.7). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Linear regression via gradient descent</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\beta_{t+1}=\beta_t-\eta\frac{2}{m}X^\top(X\beta_t-y)$$</div>
    <p>$\eta$ is the learning rate, and the gradient has the same shape as $\beta$.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.246, 0.096, and 0.471. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.246+0.096+0.471)/3=0.813/3=0.271$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.271+0.050=0.321$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.361. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.361-0.321=0.040$</li>
      <li>$relative\ gap=(0.361-0.321)/0.361=0.111$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.321=0.257$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.321, the flexible alternative 0.361, and the stabilized score 0.257.</p>
    <ol class="work">
      <li>$\min(0.321,0.361,0.257)=0.257$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.271$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.7 Polynomial & basis-function regression ---------------- */
window.ALLML_CONTENT["3.7"] = {
  tagline: "Basis functions keep the model linear in coefficients while letting the curve bend in input space.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.7-polynomial-basis-regression.ipynb",
  context: String.raw`
    <p>Polynomial & basis-function regression begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.6) into (3.8). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Polynomial & basis-function regression</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat y=\sum_{j=0}^{p}\beta_j\phi_j(x)$$</div>
    <p>$\phi_j(x)$ is a chosen feature such as $x^2$ or a spline basis, and $p+1$ coefficients remain linear parameters.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.257, 0.109, and 0.488. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.257+0.109+0.488)/3=0.854/3=0.285$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.285+0.060=0.345$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.389. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.389-0.345=0.044$</li>
      <li>$relative\ gap=(0.389-0.345)/0.389=0.113$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.345=0.276$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.345, the flexible alternative 0.389, and the stabilized score 0.276.</p>
    <ol class="work">
      <li>$\min(0.345,0.389,0.276)=0.276$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.285$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.8 Ridge regression (L2) ---------------- */
window.ALLML_CONTENT["3.8"] = {
  tagline: "Ridge buys stability by charging squared coefficient length.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.8-ridge-regression.ipynb",
  context: String.raw`
    <p>Ridge regression (L2) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.7) into (3.9). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Ridge regression (L2)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat\beta=\arg\min_\beta \|y-X\beta\|_2^2+\lambda\|\beta\|_2^2$$</div>
    <p>$\lambda\ge 0$ controls how strongly large coefficients are discouraged.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.268, 0.122, and 0.505. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.268+0.122+0.505)/3=0.895/3=0.298$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.298+0.070=0.368$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.416. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.416-0.368=0.048$</li>
      <li>$relative\ gap=(0.416-0.368)/0.416=0.115$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.368=0.294$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.368, the flexible alternative 0.416, and the stabilized score 0.294.</p>
    <ol class="work">
      <li>$\min(0.368,0.416,0.294)=0.294$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.298$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.9 Lasso (L1) & sparsity ---------------- */
window.ALLML_CONTENT["3.9"] = {
  tagline: "Lasso can set coefficients exactly to zero because the L1 penalty has a corner at zero.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.9-lasso-sparsity.ipynb",
  context: String.raw`
    <p>Lasso (L1) & sparsity begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.8) into (3.10). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Lasso (L1) & sparsity</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat\beta=\arg\min_\beta \frac12\|y-X\beta\|_2^2+\lambda\|\beta\|_1$$</div>
    <p>$\|\beta\|_1=\sum_j |\beta_j|$ is the sparsity-producing penalty.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.180, 0.135, and 0.522. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.180+0.135+0.522)/3=0.837/3=0.279$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.279+0.080=0.359$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.411. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.411-0.359=0.052$</li>
      <li>$relative\ gap=(0.411-0.359)/0.411=0.127$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.359=0.287$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.359, the flexible alternative 0.411, and the stabilized score 0.287.</p>
    <ol class="work">
      <li>$\min(0.359,0.411,0.287)=0.287$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.279$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.10 Elastic Net ---------------- */
window.ALLML_CONTENT["3.10"] = {
  tagline: "Elastic Net blends L1 selection with L2 grouping so correlated features behave less erratically.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.10-elastic-net.ipynb",
  context: String.raw`
    <p>Elastic Net begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.9) into (3.11). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Elastic Net</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\frac12\|y-X\beta\|_2^2+\lambda\big(\alpha\|\beta\|_1+(1-\alpha)\tfrac12\|\beta\|_2^2\big)$$</div>
    <p>$\alpha=1$ is lasso, $\alpha=0$ is ridge, and intermediate values mix both mechanisms.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.191, 0.148, and 0.539. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.191+0.148+0.539)/3=0.878/3=0.293$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.293+0.090=0.383$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.419. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.419-0.383=0.036$</li>
      <li>$relative\ gap=(0.419-0.383)/0.419=0.086$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.383=0.306$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.383, the flexible alternative 0.419, and the stabilized score 0.306.</p>
    <ol class="work">
      <li>$\min(0.383,0.419,0.306)=0.306$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.293$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.11 Kernel ridge regression ---------------- */
window.ALLML_CONTENT["3.11"] = {
  tagline: "Kernel ridge solves a linear ridge problem in feature space without explicitly writing the features.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.11-kernel-ridge-regression.ipynb",
  context: String.raw`
    <p>Kernel ridge regression begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.10) into (3.12). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Kernel ridge regression</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\alpha=(K+\lambda I)^{-1}y,\qquad \hat y(x)=k(x,X)^\top\alpha$$</div>
    <p>$K\in\mathbb R^{m\times m}$ stores pairwise kernel similarities, and $\alpha\in\mathbb R^m$ weights training examples.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.202, 0.070, and 0.420. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.202+0.070+0.420)/3=0.692/3=0.231$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.231+0.100=0.331$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.371. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.371-0.331=0.040$</li>
      <li>$relative\ gap=(0.371-0.331)/0.371=0.108$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.331=0.265$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.331, the flexible alternative 0.371, and the stabilized score 0.265.</p>
    <ol class="work">
      <li>$\min(0.331,0.371,0.265)=0.265$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.231$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.12 Quantile & isotonic regression ---------------- */
window.ALLML_CONTENT["3.12"] = {
  tagline: "Quantile regression changes the target from the mean to a chosen conditional percentile.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.12-quantile-isotonic-regression.ipynb",
  context: String.raw`
    <p>Quantile & isotonic regression begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.11) into (3.13). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Quantile & isotonic regression</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\rho_\tau(r)=r(\tau-\mathbf 1[r\lt 0])$$</div>
    <p>$r=y-\hat y$ is the residual and $\tau\in(0,1)$ chooses the percentile.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.213, 0.083, and 0.437. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.213+0.083+0.437)/3=0.733/3=0.244$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.244+0.050=0.294$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.338. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.338-0.294=0.044$</li>
      <li>$relative\ gap=(0.338-0.294)/0.338=0.130$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.294=0.235$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.294, the flexible alternative 0.338, and the stabilized score 0.235.</p>
    <ol class="work">
      <li>$\min(0.294,0.338,0.235)=0.235$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.244$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.13 Robust regression (Huber, RANSAC) ---------------- */
window.ALLML_CONTENT["3.13"] = {
  tagline: "Robust regression limits the influence of points whose residuals are too large to trust blindly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.13-robust-regression.ipynb",
  context: String.raw`
    <p>Robust regression (Huber, RANSAC) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.12) into (3.14). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Robust regression (Huber, RANSAC)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$L_\delta(r)=\begin{cases}\tfrac12r^2,& |r|\le\delta\\ \delta(|r|-\tfrac12\delta),& |r|\gt\delta\end{cases}$$</div>
    <p>$r$ is a residual and $\delta$ is the point where Huber switches from quadratic to linear growth.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.224, 0.096, and 0.454. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.224+0.096+0.454)/3=0.774/3=0.258$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.258+0.060=0.318$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.366. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.366-0.318=0.048$</li>
      <li>$relative\ gap=(0.366-0.318)/0.366=0.131$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.318=0.254$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.318, the flexible alternative 0.366, and the stabilized score 0.254.</p>
    <ol class="work">
      <li>$\min(0.318,0.366,0.254)=0.254$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.258$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.14 Logistic regression ---------------- */
window.ALLML_CONTENT["3.14"] = {
  tagline: "Logistic regression turns a linear score into a calibrated probability through the sigmoid link.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.14-logistic-regression.ipynb",
  context: String.raw`
    <p>Logistic regression begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.13) into (3.15). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Logistic regression</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$p(y=1\mid x)=\sigma(w^\top x)=\frac{1}{1+e^{-w^\top x}}$$</div>
    <p>$w^\top x$ is the log-odds score and $p$ is the modeled class probability.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.235, 0.109, and 0.471. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.235+0.109+0.471)/3=0.815/3=0.272$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.272+0.070=0.342$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.394. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.394-0.342=0.052$</li>
      <li>$relative\ gap=(0.394-0.342)/0.394=0.132$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.342=0.274$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.342, the flexible alternative 0.394, and the stabilized score 0.274.</p>
    <ol class="work">
      <li>$\min(0.342,0.394,0.274)=0.274$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.272$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.15 Softmax / multinomial regression ---------------- */
window.ALLML_CONTENT["3.15"] = {
  tagline: "Softmax regression compares class scores by exponentiating and normalizing them into probabilities.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.15-softmax-multinomial-regression.ipynb",
  context: String.raw`
    <p>Softmax / multinomial regression begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.14) into (3.16). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Softmax / multinomial regression</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$p_k=\frac{e^{z_k}}{\sum_j e^{z_j}}$$</div>
    <p>$z_k$ is the score for class $k$, and the denominator forces all class probabilities to sum to one.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.246, 0.122, and 0.488. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.246+0.122+0.488)/3=0.856/3=0.285$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.285+0.080=0.365$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.401. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.401-0.365=0.036$</li>
      <li>$relative\ gap=(0.401-0.365)/0.401=0.090$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.365=0.292$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.365, the flexible alternative 0.401, and the stabilized score 0.292.</p>
    <ol class="work">
      <li>$\min(0.365,0.401,0.292)=0.292$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.285$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.16 Generalized Linear Models ---------------- */
window.ALLML_CONTENT["3.16"] = {
  tagline: "A GLM separates random noise, a linear predictor, and a link function.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.16-generalized-linear-models.ipynb",
  context: String.raw`
    <p>Generalized Linear Models begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.15) into (3.17). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Generalized Linear Models</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$g(\mathbb E[Y\mid X])=X\beta$$</div>
    <p>$g$ is the link, $X\beta$ is the linear predictor, and the response distribution matches the outcome type.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.257, 0.135, and 0.505. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.257+0.135+0.505)/3=0.897/3=0.299$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.299+0.090=0.389$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.429. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.429-0.389=0.040$</li>
      <li>$relative\ gap=(0.429-0.389)/0.429=0.093$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.389=0.311$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.389, the flexible alternative 0.429, and the stabilized score 0.311.</p>
    <ol class="work">
      <li>$\min(0.389,0.429,0.311)=0.311$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.299$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.17 Linear & Quadratic Discriminant Analysis ---------------- */
window.ALLML_CONTENT["3.17"] = {
  tagline: "LDA and QDA classify by modeling class-conditional Gaussians and comparing their log scores.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.17-lda-qda.ipynb",
  context: String.raw`
    <p>Linear & Quadratic Discriminant Analysis begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.16) into (3.18). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Linear & Quadratic Discriminant Analysis</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\delta_k(x)=x^\top\Sigma_k^{-1}\mu_k-\tfrac12\mu_k^\top\Sigma_k^{-1}\mu_k+\log\pi_k$$</div>
    <p>$\mu_k$ is a class mean, $\Sigma_k$ a covariance, and $\pi_k$ a prior class probability.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.268, 0.148, and 0.522. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.268+0.148+0.522)/3=0.938/3=0.313$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.313+0.100=0.413$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.457. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.457-0.413=0.044$</li>
      <li>$relative\ gap=(0.457-0.413)/0.457=0.096$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.413=0.330$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.413, the flexible alternative 0.457, and the stabilized score 0.330.</p>
    <ol class="work">
      <li>$\min(0.413,0.457,0.330)=0.330$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.313$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.18 Gaussian Discriminant Analysis ---------------- */
window.ALLML_CONTENT["3.18"] = {
  tagline: "GDA learns class priors and Gaussian feature distributions, then applies Bayes' rule.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.18-gaussian-discriminant-analysis.ipynb",
  context: String.raw`
    <p>Gaussian Discriminant Analysis begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.17) into (3.19). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Gaussian Discriminant Analysis</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$p(y=k\mid x)=\frac{p(x\mid y=k)\pi_k}{\sum_j p(x\mid y=j)\pi_j}$$</div>
    <p>The likelihood says how typical $x$ is for class $k$, and the prior says how common the class is before seeing $x$.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.180, 0.070, and 0.539. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.180+0.070+0.539)/3=0.789/3=0.263$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.263+0.050=0.313$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.361. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.361-0.313=0.048$</li>
      <li>$relative\ gap=(0.361-0.313)/0.361=0.133$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.313=0.250$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.313, the flexible alternative 0.361, and the stabilized score 0.250.</p>
    <ol class="work">
      <li>$\min(0.313,0.361,0.250)=0.250$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.263$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.19 Gradient descent variants (batch, mini-batch, SGD) ---------------- */
window.ALLML_CONTENT["3.19"] = {
  tagline: "Batch, mini-batch, and SGD trade gradient accuracy against update frequency.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.19-gradient-descent-variants.ipynb",
  context: String.raw`
    <p>Gradient descent variants (batch, mini-batch, SGD) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.18) into (3.20). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Gradient descent variants (batch, mini-batch, SGD)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$w_{t+1}=w_t-\eta\frac1{|B_t|}\sum_{i\in B_t}\nabla_w\ell_i(w_t)$$</div>
    <p>$B_t$ is the batch used at step $t$; its size controls noise and cost.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.191, 0.083, and 0.420. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.191+0.083+0.420)/3=0.694/3=0.231$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.231+0.060=0.291$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.343. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.343-0.291=0.052$</li>
      <li>$relative\ gap=(0.343-0.291)/0.343=0.152$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.291=0.233$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.291, the flexible alternative 0.343, and the stabilized score 0.233.</p>
    <ol class="work">
      <li>$\min(0.291,0.343,0.233)=0.233$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.231$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.20 k-Nearest Neighbors ---------------- */
window.ALLML_CONTENT["3.20"] = {
  tagline: "kNN predicts from nearby stored examples rather than fitting a parametric equation.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.20-k-nearest-neighbors.ipynb",
  context: String.raw`
    <p>k-Nearest Neighbors begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.19) into (3.21). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>k-Nearest Neighbors</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat y(x)=\operatorname{mode}\{y_i:i\in N_k(x)\}$$</div>
    <p>$N_k(x)$ is the set of the $k$ closest training points under the chosen distance.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.202, 0.096, and 0.437. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.202+0.096+0.437)/3=0.735/3=0.245$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.245+0.070=0.315$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.351. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.351-0.315=0.036$</li>
      <li>$relative\ gap=(0.351-0.315)/0.351=0.103$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.315=0.252$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.315, the flexible alternative 0.351, and the stabilized score 0.252.</p>
    <ol class="work">
      <li>$\min(0.315,0.351,0.252)=0.252$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.245$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.21 Naive Bayes ---------------- */
window.ALLML_CONTENT["3.21"] = {
  tagline: "Naive Bayes multiplies feature likelihoods as if features were conditionally independent within each class.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.21-naive-bayes.ipynb",
  context: String.raw`
    <p>Naive Bayes begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.20) into (3.22). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Naive Bayes</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$p(y=k\mid x)\propto p(y=k)\prod_{j=1}^d p(x_j\mid y=k)$$</div>
    <p>The proportional score is normalized across classes after multiplying the prior and feature likelihoods.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.213, 0.109, and 0.454. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.213+0.109+0.454)/3=0.776/3=0.259$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.259+0.080=0.339$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.379. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.379-0.339=0.040$</li>
      <li>$relative\ gap=(0.379-0.339)/0.379=0.106$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.339=0.271$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.339, the flexible alternative 0.379, and the stabilized score 0.271.</p>
    <ol class="work">
      <li>$\min(0.339,0.379,0.271)=0.271$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.259$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.22 Decision trees (CART, entropy/Gini, pruning) ---------------- */
window.ALLML_CONTENT["3.22"] = {
  tagline: "A tree chooses splits that make child nodes purer than the parent.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.22-decision-trees.ipynb",
  context: String.raw`
    <p>Decision trees (CART, entropy/Gini, pruning) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.21) into (3.23). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Decision trees (CART, entropy/Gini, pruning)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$G(t)=1-\sum_k p_{k,t}^2,\qquad \Delta=G(parent)-\sum_c\frac{n_c}{n}G(c)$$</div>
    <p>$p_{k,t}$ is the class fraction in node $t$, and $\Delta$ is impurity reduction.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.224, 0.122, and 0.471. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.224+0.122+0.471)/3=0.817/3=0.272$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.272+0.090=0.362$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.406. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.406-0.362=0.044$</li>
      <li>$relative\ gap=(0.406-0.362)/0.406=0.108$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.362=0.290$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.362, the flexible alternative 0.406, and the stabilized score 0.290.</p>
    <ol class="work">
      <li>$\min(0.362,0.406,0.290)=0.290$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.272$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.23 Bagging & Random Forests ---------------- */
window.ALLML_CONTENT["3.23"] = {
  tagline: "Bagging lowers variance by averaging many noisy trees trained on perturbed data.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.23-bagging-random-forests.ipynb",
  context: String.raw`
    <p>Bagging & Random Forests begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.22) into (3.24). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Bagging & Random Forests</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat f_{bag}(x)=\frac1B\sum_{b=1}^B \hat f_b(x)$$</div>
    <p>$B$ is the number of bootstrap models and each $\hat f_b$ is one tree prediction.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.235, 0.135, and 0.488. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.235+0.135+0.488)/3=0.858/3=0.286$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.286+0.100=0.386$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.434. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.434-0.386=0.048$</li>
      <li>$relative\ gap=(0.434-0.386)/0.434=0.111$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.386=0.309$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.386, the flexible alternative 0.434, and the stabilized score 0.309.</p>
    <ol class="work">
      <li>$\min(0.386,0.434,0.309)=0.309$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.286$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.24 Extremely Randomized Trees ---------------- */
window.ALLML_CONTENT["3.24"] = {
  tagline: "Extra Trees push randomness into split thresholds so trees become more decorrelated.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.24-extremely-randomized-trees.ipynb",
  context: String.raw`
    <p>Extremely Randomized Trees begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.23) into (3.25). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Extremely Randomized Trees</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\text{choose }(j,s)\text{ from random candidates that maximize }\Delta(j,s)$$</div>
    <p>$j$ is a feature, $s$ is a random threshold, and $\Delta$ is the impurity gain.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.246, 0.148, and 0.505. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.246+0.148+0.505)/3=0.899/3=0.300$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.300+0.050=0.350$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.402. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.402-0.350=0.052$</li>
      <li>$relative\ gap=(0.402-0.350)/0.402=0.129$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.350=0.280$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.350, the flexible alternative 0.402, and the stabilized score 0.280.</p>
    <ol class="work">
      <li>$\min(0.350,0.402,0.280)=0.280$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.300$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.25 AdaBoost ---------------- */
window.ALLML_CONTENT["3.25"] = {
  tagline: "AdaBoost turns weak rules into a strong classifier by raising weights on mistakes.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.25-adaboost.ipynb",
  context: String.raw`
    <p>AdaBoost begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.24) into (3.26). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>AdaBoost</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\alpha_t=\tfrac12\ln\frac{1-\varepsilon_t}{\varepsilon_t},\qquad w_i\leftarrow w_i e^{-\alpha_t y_i h_t(x_i)}$$</div>
    <p>$\varepsilon_t$ is weighted error and $\alpha_t$ is the vote given to weak learner $t$.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.257, 0.070, and 0.522. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.257+0.070+0.522)/3=0.849/3=0.283$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.283+0.060=0.343$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.379. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.379-0.343=0.036$</li>
      <li>$relative\ gap=(0.379-0.343)/0.379=0.095$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.343=0.274$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.343, the flexible alternative 0.379, and the stabilized score 0.274.</p>
    <ol class="work">
      <li>$\min(0.343,0.379,0.274)=0.274$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.283$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.26 Gradient Boosting Machines ---------------- */
window.ALLML_CONTENT["3.26"] = {
  tagline: "Gradient boosting fits each new learner to the loss gradient left by the current ensemble.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.26-gradient-boosting-machines.ipynb",
  context: String.raw`
    <p>Gradient Boosting Machines begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.25) into (3.27). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Gradient Boosting Machines</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$F_t(x)=F_{t-1}(x)+\eta h_t(x)$$</div>
    <p>$F_t$ is the additive model after step $t$, $h_t$ fits the residual signal, and $\eta$ is shrinkage.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.268, 0.083, and 0.539. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.268+0.083+0.539)/3=0.890/3=0.297$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.297+0.070=0.367$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.407. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.407-0.367=0.040$</li>
      <li>$relative\ gap=(0.407-0.367)/0.407=0.098$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.367=0.294$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.367, the flexible alternative 0.407, and the stabilized score 0.294.</p>
    <ol class="work">
      <li>$\min(0.367,0.407,0.294)=0.294$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.297$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.27 XGBoost / LightGBM / CatBoost ---------------- */
window.ALLML_CONTENT["3.27"] = {
  tagline: "Modern boosting libraries make gradient boosting fast, regularized, and production-friendly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.27-xgboost-lightgbm-catboost.ipynb",
  context: String.raw`
    <p>XGBoost / LightGBM / CatBoost begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.26) into (3.28). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>XGBoost / LightGBM / CatBoost</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\tilde L=\sum_i(g_i f_i+\tfrac12 h_i f_i^2)+\Omega(f)$$</div>
    <p>$g_i$ and $h_i$ are first and second derivatives of the loss for row $i$, and $\Omega$ penalizes tree complexity.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.180, 0.096, and 0.420. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.180+0.096+0.420)/3=0.696/3=0.232$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.232+0.080=0.312$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.356. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.356-0.312=0.044$</li>
      <li>$relative\ gap=(0.356-0.312)/0.356=0.124$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.312=0.250$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.312, the flexible alternative 0.356, and the stabilized score 0.250.</p>
    <ol class="work">
      <li>$\min(0.312,0.356,0.250)=0.250$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.232$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.28 Stacking & blending ---------------- */
window.ALLML_CONTENT["3.28"] = {
  tagline: "Stacking learns how to combine base models using out-of-fold predictions as honest features.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.28-stacking-blending.ipynb",
  context: String.raw`
    <p>Stacking & blending begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.27) into (3.29). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Stacking & blending</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat y=\sum_{m=1}^M a_m \hat y_m,\qquad \sum_m a_m=1$$</div>
    <p>$\hat y_m$ is a base-model prediction and $a_m$ is the meta-model's combining weight.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.191, 0.109, and 0.437. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.191+0.109+0.437)/3=0.737/3=0.246$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.246+0.090=0.336$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.384. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.384-0.336=0.048$</li>
      <li>$relative\ gap=(0.384-0.336)/0.384=0.125$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.336=0.269$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.336, the flexible alternative 0.384, and the stabilized score 0.269.</p>
    <ol class="work">
      <li>$\min(0.336,0.384,0.269)=0.269$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.246$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.29 Support Vector Machines & margins ---------------- */
window.ALLML_CONTENT["3.29"] = {
  tagline: "SVMs choose the separator with the widest margin around the hardest points.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.29-support-vector-machines-margins.ipynb",
  context: String.raw`
    <p>Support Vector Machines & margins begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.28) into (3.30). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Support Vector Machines & margins</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\min_w \tfrac12\|w\|^2+C\sum_i\xi_i\quad\text{s.t. }y_i(w^\top x_i+b)\ge 1-\xi_i$$</div>
    <p>$\xi_i$ are margin violations and $C$ trades margin width against mistakes.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.202, 0.122, and 0.454. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.202+0.122+0.454)/3=0.778/3=0.259$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.259+0.100=0.359$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.411. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.411-0.359=0.052$</li>
      <li>$relative\ gap=(0.411-0.359)/0.411=0.127$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.359=0.287$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.359, the flexible alternative 0.411, and the stabilized score 0.287.</p>
    <ol class="work">
      <li>$\min(0.359,0.411,0.287)=0.287$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.259$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.30 The kernel trick & kernel methods ---------------- */
window.ALLML_CONTENT["3.30"] = {
  tagline: "A kernel computes inner products in a feature space without ever building that space explicitly.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.30-kernel-trick-methods.ipynb",
  context: String.raw`
    <p>The kernel trick & kernel methods begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.29) into (3.31). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>The kernel trick & kernel methods</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$K(x,z)=\phi(x)^\top\phi(z)$$</div>
    <p>$K$ is a similarity function and $\phi$ is the possibly high-dimensional feature map it represents.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.213, 0.135, and 0.471. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.213+0.135+0.471)/3=0.819/3=0.273$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.273+0.050=0.323$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.359. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.359-0.323=0.036$</li>
      <li>$relative\ gap=(0.359-0.323)/0.359=0.100$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.323=0.258$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.323, the flexible alternative 0.359, and the stabilized score 0.258.</p>
    <ol class="work">
      <li>$\min(0.323,0.359,0.258)=0.258$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.273$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.31 Online & incremental learning ---------------- */
window.ALLML_CONTENT["3.31"] = {
  tagline: "Online learning updates the model one small batch at a time as data arrives.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.31-online-incremental-learning.ipynb",
  context: String.raw`
    <p>Online & incremental learning begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.30) into (3.32). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Online & incremental learning</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$w_{t+1}=w_t-\eta_t\nabla\ell_t(w_t)$$</div>
    <p>$\ell_t$ is the current example or mini-batch loss and $\eta_t$ may decay over time.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.224, 0.148, and 0.488. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.224+0.148+0.488)/3=0.860/3=0.287$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.287+0.060=0.347$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.387. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.387-0.347=0.040$</li>
      <li>$relative\ gap=(0.387-0.347)/0.387=0.103$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.347=0.278$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.347, the flexible alternative 0.387, and the stabilized score 0.278.</p>
    <ol class="work">
      <li>$\min(0.347,0.387,0.278)=0.278$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.287$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.32 Passive-aggressive algorithms ---------------- */
window.ALLML_CONTENT["3.32"] = {
  tagline: "Passive-aggressive learning changes weights only enough to fix the current margin violation.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.32-passive-aggressive-algorithms.ipynb",
  context: String.raw`
    <p>Passive-aggressive algorithms begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.31) into (3.33). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Passive-aggressive algorithms</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$w_{t+1}=w_t+\tau_t y_t x_t,\qquad \tau_t=\frac{\max(0,1-y_t w_t^\top x_t)}{\|x_t\|^2}$$</div>
    <p>$\tau_t$ is zero when the margin is already safe and positive when the example demands a correction.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.235, 0.070, and 0.505. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.235+0.070+0.505)/3=0.810/3=0.270$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.270+0.070=0.340$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.384. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.384-0.340=0.044$</li>
      <li>$relative\ gap=(0.384-0.340)/0.384=0.115$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.340=0.272$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.340, the flexible alternative 0.384, and the stabilized score 0.272.</p>
    <ol class="work">
      <li>$\min(0.340,0.384,0.272)=0.272$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.270$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.33 Ordinal & multi-output regression ---------------- */
window.ALLML_CONTENT["3.33"] = {
  tagline: "Ordinal and multi-output regression respect structure in targets instead of flattening everything into one scalar.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.33-ordinal-multi-output-regression.ipynb",
  context: String.raw`
    <p>Ordinal & multi-output regression begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.32) into (3.34). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Ordinal & multi-output regression</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\hat y=(\hat y_1,\ldots,\hat y_q),\qquad L=\frac1q\sum_{j=1}^q \ell(y_j,\hat y_j)$$</div>
    <p>$q$ is the number of related outputs or ordered target components.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.246, 0.083, and 0.522. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.246+0.083+0.522)/3=0.851/3=0.284$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.284+0.080=0.364$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.412. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.412-0.364=0.048$</li>
      <li>$relative\ gap=(0.412-0.364)/0.412=0.117$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.364=0.291$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.364, the flexible alternative 0.412, and the stabilized score 0.291.</p>
    <ol class="work">
      <li>$\min(0.364,0.412,0.291)=0.291$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.284$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.34 Survival analysis (Cox proportional hazards) ---------------- */
window.ALLML_CONTENT["3.34"] = {
  tagline: "Survival models learn time-to-event risk while respecting censoring.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.34-survival-analysis-cox.ipynb",
  context: String.raw`
    <p>Survival analysis (Cox proportional hazards) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.33) into (3.35). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Survival analysis (Cox proportional hazards)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$h(t\mid x)=h_0(t)e^{\beta^\top x}$$</div>
    <p>$h_0(t)$ is the baseline hazard and $e^{\beta^\top x}$ is the multiplicative risk ratio.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.257, 0.096, and 0.539. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.257+0.096+0.539)/3=0.892/3=0.297$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.297+0.090=0.387$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.439. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.439-0.387=0.052$</li>
      <li>$relative\ gap=(0.439-0.387)/0.439=0.118$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.387=0.310$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.387, the flexible alternative 0.439, and the stabilized score 0.310.</p>
    <ol class="work">
      <li>$\min(0.387,0.439,0.310)=0.310$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.297$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.35 Cost-sensitive learning ---------------- */
window.ALLML_CONTENT["3.35"] = {
  tagline: "Cost-sensitive learning optimizes the cost of errors, not merely their count.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.35-cost-sensitive-learning.ipynb",
  context: String.raw`
    <p>Cost-sensitive learning begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.34) into (3.36). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Cost-sensitive learning</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$R(f)=\mathbb E[C_{Y,f(X)}]$$</div>
    <p>$C_{a,b}$ is the cost of predicting class $b$ when the true class is $a$.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.268, 0.109, and 0.420. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.268+0.109+0.420)/3=0.797/3=0.266$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.266+0.100=0.366$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.402. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.402-0.366=0.036$</li>
      <li>$relative\ gap=(0.402-0.366)/0.402=0.090$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.366=0.293$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.366, the flexible alternative 0.402, and the stabilized score 0.293.</p>
    <ol class="work">
      <li>$\min(0.366,0.402,0.293)=0.293$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.266$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.36 Train/validation/test & cross-validation ---------------- */
window.ALLML_CONTENT["3.36"] = {
  tagline: "Validation chooses models; the untouched test set estimates the final future error.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.36-train-validation-test-cross-validation.ipynb",
  context: String.raw`
    <p>Train/validation/test & cross-validation begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.35) into (3.37). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Train/validation/test & cross-validation</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$CV_K=\frac1K\sum_{k=1}^{K}R_{V_k}(\hat f_{-k})$$</div>
    <p>$V_k$ is fold $k$ and $\hat f_{-k}$ is trained on all other folds.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.180, 0.122, and 0.437. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.180+0.122+0.437)/3=0.739/3=0.246$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.246+0.050=0.296$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.336. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.336-0.296=0.040$</li>
      <li>$relative\ gap=(0.336-0.296)/0.336=0.119$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.296=0.237$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.296, the flexible alternative 0.336, and the stabilized score 0.237.</p>
    <ol class="work">
      <li>$\min(0.296,0.336,0.237)=0.237$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.246$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.37 Nested cross-validation ---------------- */
window.ALLML_CONTENT["3.37"] = {
  tagline: "Nested CV keeps hyperparameter selection inside an inner loop so the outer score stays honest.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.37-nested-cross-validation.ipynb",
  context: String.raw`
    <p>Nested cross-validation begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.36) into (3.38). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Nested cross-validation</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\widehat R_{nested}=\frac1K\sum_{k=1}^{K} R_{outer,k}(\hat f^{inner}_k)$$</div>
    <p>The inner loop selects settings and the outer loop estimates performance of that whole selection procedure.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.191, 0.135, and 0.454. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.191+0.135+0.454)/3=0.780/3=0.260$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.260+0.060=0.320$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.364. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.364-0.320=0.044$</li>
      <li>$relative\ gap=(0.364-0.320)/0.364=0.121$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.320=0.256$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.320, the flexible alternative 0.364, and the stabilized score 0.256.</p>
    <ol class="work">
      <li>$\min(0.320,0.364,0.256)=0.256$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.260$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.38 Classification metrics (precision, recall, F1, ROC/AUC, PR) ---------------- */
window.ALLML_CONTENT["3.38"] = {
  tagline: "Classification metrics ask different operational questions about the same confusion counts.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.38-classification-metrics.ipynb",
  context: String.raw`
    <p>Classification metrics (precision, recall, F1, ROC/AUC, PR) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.37) into (3.39). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Classification metrics (precision, recall, F1, ROC/AUC, PR)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$precision=\frac{TP}{TP+FP},\quad recall=\frac{TP}{TP+FN},\quad F1=\frac{2PR}{P+R}$$</div>
    <p>$TP$, $FP$, and $FN$ are counts after choosing a threshold.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.202, 0.148, and 0.471. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.202+0.148+0.471)/3=0.821/3=0.274$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.274+0.070=0.344$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.392. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.392-0.344=0.048$</li>
      <li>$relative\ gap=(0.392-0.344)/0.392=0.122$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.344=0.275$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.344, the flexible alternative 0.392, and the stabilized score 0.275.</p>
    <ol class="work">
      <li>$\min(0.344,0.392,0.275)=0.275$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.274$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.39 Regression metrics (MSE, MAE, R²) ---------------- */
window.ALLML_CONTENT["3.39"] = {
  tagline: "Regression metrics choose which kind of error should be expensive.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.39-regression-metrics.ipynb",
  context: String.raw`
    <p>Regression metrics (MSE, MAE, R²) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.38) into (3.40). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Regression metrics (MSE, MAE, R²)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$MSE=\frac1m\sum_i e_i^2,\quad MAE=\frac1m\sum_i |e_i|,\quad R^2=1-\frac{SS_{res}}{SS_{tot}}$$</div>
    <p>$e_i=y_i-\hat y_i$, and $SS$ terms compare model residuals to predicting the mean.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.213, 0.070, and 0.488. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.213+0.070+0.488)/3=0.771/3=0.257$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.257+0.080=0.337$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.389. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.389-0.337=0.052$</li>
      <li>$relative\ gap=(0.389-0.337)/0.389=0.134$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.337=0.270$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.337, the flexible alternative 0.389, and the stabilized score 0.270.</p>
    <ol class="work">
      <li>$\min(0.337,0.389,0.270)=0.270$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.257$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.40 Probability calibration ---------------- */
window.ALLML_CONTENT["3.40"] = {
  tagline: "Calibration asks whether predicted probabilities match observed frequencies.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.40-probability-calibration.ipynb",
  context: String.raw`
    <p>Probability calibration begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.39) into (3.41). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Probability calibration</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$calibration\ gap=|\Pr(Y=1\mid \hat p\in bin)-\operatorname{avg}(\hat p\in bin)|$$</div>
    <p>Each bin compares empirical frequency to average predicted probability.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.224, 0.083, and 0.505. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.224+0.083+0.505)/3=0.812/3=0.271$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.271+0.090=0.361$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.397. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.397-0.361=0.036$</li>
      <li>$relative\ gap=(0.397-0.361)/0.397=0.091$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.361=0.289$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.361, the flexible alternative 0.397, and the stabilized score 0.289.</p>
    <ol class="work">
      <li>$\min(0.361,0.397,0.289)=0.289$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.271$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.41 Model selection (AIC, BIC, MDL) ---------------- */
window.ALLML_CONTENT["3.41"] = {
  tagline: "Information criteria reward likelihood but charge for model complexity.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.41-model-selection-aic-bic-mdl.ipynb",
  context: String.raw`
    <p>Model selection (AIC, BIC, MDL) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.40) into (3.42). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Model selection (AIC, BIC, MDL)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$AIC=2k-2\ln L,\qquad BIC=k\ln n-2\ln L$$</div>
    <p>$k$ is parameter count, $n$ sample size, and $L$ the maximized likelihood.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.235, 0.096, and 0.522. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.235+0.096+0.522)/3=0.853/3=0.284$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.284+0.100=0.384$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.424. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.424-0.384=0.040$</li>
      <li>$relative\ gap=(0.424-0.384)/0.424=0.094$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.384=0.307$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.384, the flexible alternative 0.424, and the stabilized score 0.307.</p>
    <ol class="work">
      <li>$\min(0.384,0.424,0.307)=0.307$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.284$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.42 Overfitting, underfitting & learning curves ---------------- */
window.ALLML_CONTENT["3.42"] = {
  tagline: "Learning curves diagnose whether error is dominated by bias, variance, or data scarcity.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.42-overfitting-underfitting-learning-curves.ipynb",
  context: String.raw`
    <p>Overfitting, underfitting & learning curves begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.41) into (3.43). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Overfitting, underfitting & learning curves</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$gap(m)=R_{val}(m)-R_{train}(m)$$</div>
    <p>A large gap signals variance; high train and validation error together signal bias.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.246, 0.109, and 0.539. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.246+0.109+0.539)/3=0.894/3=0.298$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.298+0.050=0.348$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.392. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.392-0.348=0.044$</li>
      <li>$relative\ gap=(0.392-0.348)/0.392=0.112$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.348=0.278$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.348, the flexible alternative 0.392, and the stabilized score 0.278.</p>
    <ol class="work">
      <li>$\min(0.348,0.392,0.278)=0.278$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.298$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.43 Data leakage ---------------- */
window.ALLML_CONTENT["3.43"] = {
  tagline: "Leakage lets future or target-derived information enter training, making validation look falsely good.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.43-data-leakage.ipynb",
  context: String.raw`
    <p>Data leakage begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.42) into (3.44). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Data leakage</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$R_{leaky}=\frac1m\sum_i \ell(f(x_i,\text{future}_i),y_i)$$</div>
    <p>The extra future-derived term is not available at serving time, so the risk estimate is contaminated.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.257, 0.122, and 0.420. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.257+0.122+0.420)/3=0.799/3=0.266$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.060. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.266+0.060=0.326$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.374. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.374-0.326=0.048$</li>
      <li>$relative\ gap=(0.374-0.326)/0.374=0.128$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.326=0.261$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.326, the flexible alternative 0.374, and the stabilized score 0.261.</p>
    <ol class="work">
      <li>$\min(0.326,0.374,0.261)=0.261$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.266$ is only one part of the selection score; dropping the 0.060 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.44 Hyperparameter search (grid, random, Bayesian, Hyperband) ---------------- */
window.ALLML_CONTENT["3.44"] = {
  tagline: "Hyperparameter search spends trials where good settings are likely, while guarding against lucky validation noise.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.44-hyperparameter-search.ipynb",
  context: String.raw`
    <p>Hyperparameter search (grid, random, Bayesian, Hyperband) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.43) into (3.45). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Hyperparameter search (grid, random, Bayesian, Hyperband)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$\lambda^*=\arg\min_{\lambda\in\Lambda} R_{val}(\hat f_\lambda)$$</div>
    <p>$\lambda$ is a hyperparameter setting and $\Lambda$ is the search space.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.268, 0.135, and 0.437. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.268+0.135+0.437)/3=0.840/3=0.280$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.070. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.280+0.070=0.350$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.402. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.402-0.350=0.052$</li>
      <li>$relative\ gap=(0.402-0.350)/0.402=0.129$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.350=0.280$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.350, the flexible alternative 0.402, and the stabilized score 0.280.</p>
    <ol class="work">
      <li>$\min(0.350,0.402,0.280)=0.280$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.280$ is only one part of the selection score; dropping the 0.070 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.052 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.45 Feature engineering ---------------- */
window.ALLML_CONTENT["3.45"] = {
  tagline: "Feature engineering changes representation so simple models can see the signal.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.45-feature-engineering.ipynb",
  context: String.raw`
    <p>Feature engineering begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.44) into (3.46). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Feature engineering</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$z=\phi(x),\qquad \hat y=f(z)$$</div>
    <p>$\phi$ maps raw input to features such as interactions, bins, counts, or normalized scales.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.180, 0.148, and 0.454. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.180+0.148+0.454)/3=0.782/3=0.261$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.080. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.261+0.080=0.341$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.377. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.377-0.341=0.036$</li>
      <li>$relative\ gap=(0.377-0.341)/0.377=0.095$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.341=0.273$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.341, the flexible alternative 0.377, and the stabilized score 0.273.</p>
    <ol class="work">
      <li>$\min(0.341,0.377,0.273)=0.273$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.261$ is only one part of the selection score; dropping the 0.080 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.036 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.46 Feature selection (filter, wrapper, embedded) ---------------- */
window.ALLML_CONTENT["3.46"] = {
  tagline: "Feature selection trades signal retained against noise and cost removed.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.46-feature-selection.ipynb",
  context: String.raw`
    <p>Feature selection (filter, wrapper, embedded) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.45) into (3.47). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Feature selection (filter, wrapper, embedded)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$S^*=\arg\min_{S\subseteq\{1,\ldots,d\}} R_{val}(f_S)+\lambda |S|$$</div>
    <p>$S$ is the chosen feature subset and $|S|$ is its size penalty.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.191, 0.070, and 0.471. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.191+0.070+0.471)/3=0.732/3=0.244$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.090. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.244+0.090=0.334$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.374. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.374-0.334=0.040$</li>
      <li>$relative\ gap=(0.374-0.334)/0.374=0.107$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.334=0.267$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.334, the flexible alternative 0.374, and the stabilized score 0.267.</p>
    <ol class="work">
      <li>$\min(0.334,0.374,0.267)=0.267$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.244$ is only one part of the selection score; dropping the 0.090 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.040 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.47 Imbalanced data (resampling, SMOTE, class weights) ---------------- */
window.ALLML_CONTENT["3.47"] = {
  tagline: "Imbalance work changes the training objective so rare classes receive enough force.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.47-imbalanced-data.ipynb",
  context: String.raw`
    <p>Imbalanced data (resampling, SMOTE, class weights) begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.46) into (3.48). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Imbalanced data (resampling, SMOTE, class weights)</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$L=\frac1m\sum_i w_{y_i}\ell(f(x_i),y_i)$$</div>
    <p>$w_{y_i}$ is a class-dependent weight that raises or lowers each example's contribution.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.202, 0.083, and 0.488. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.202+0.083+0.488)/3=0.773/3=0.258$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.100. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.258+0.100=0.358$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.402. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.402-0.358=0.044$</li>
      <li>$relative\ gap=(0.402-0.358)/0.402=0.109$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.358=0.286$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.358, the flexible alternative 0.402, and the stabilized score 0.286.</p>
    <ol class="work">
      <li>$\min(0.358,0.402,0.286)=0.286$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.258$ is only one part of the selection score; dropping the 0.100 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.044 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};

/* ---------------- 3.48 Multiclass & multilabel strategies ---------------- */
window.ALLML_CONTENT["3.48"] = {
  tagline: "Multiclass chooses one label; multilabel decides many independent yes/no labels.",
  colab: "https://colab.research.google.com/github/niamleeson/ml-math/blob/main/notebooks/3.48-multiclass-multilabel-strategies.ipynb",
  context: String.raw`
    <p>Multiclass & multilabel strategies begins the practical core from the learning-theory promises of Part 1. The prerequisite mechanism is empirical risk: the model is judged by a loss averaged over examples, and this lesson decides what that loss is asking the learner to respect.</p>
    <ul>
      <li><b>ERM (1.1)</b> supplies the minimization frame; here the hypothesis family, loss, and validation protocol become concrete.</li>
      <li><b>Generalization bounds (1.6)</b> explain why the training number is not enough; the validation examples in this lesson keep that warning visible.</li>
      <li><b>Regularization (1.8)</b> is the recurring lever whenever the method has more flexibility than the sample can safely support.</li>
    </ul>
    <p>Where it leads: this lesson feeds the model-building sequence from (3.47) into (4.1). Later evaluation lessons (3.36–3.43) use the same train-versus-future split to decide whether the apparent improvement is real.</p>`,
  intuition: String.raw`
    <p>The concrete problem is not merely to fit a small table; it is to choose a rule that will still behave on the next table. A naive approach chases the most flattering training score, but that confuses memorized convenience with reusable structure.</p>
    <p>The mental model for <b>Multiclass & multilabel strategies</b> is a contract: the formula says what the model is allowed to optimize, the validation score says whether that optimization survived contact with unseen data, and the penalty or constraint says how much trust we place in flexibility.</p>
    <p>The design decision people gloss over is the scale of the comparison. We do not ask whether one number is lower in isolation; we ask whether the gain remains after the relevant cost, uncertainty, or decision threshold is included. That is why the arithmetic below always computes a raw fit, a penalty or contrast, and then the final decision score.</p>`,
  mathematics: String.raw`
    <p>The core form for this lesson is:</p>
    <div class="formula-box">$$p_k=\frac{e^{z_k}}{\sum_j e^{z_j}},\qquad p_j=\sigma(z_j)\text{ for multilabel}$$</div>
    <p>Softmax probabilities compete and sum to one; multilabel sigmoid probabilities do not compete.</p>

    <p><b>A tiny training score.</b> Use three verified per-example losses for this lesson's toy instance: 0.213, 0.096, and 0.505. The average is the empirical quantity the method tries to improve.</p>
    <ol class="work">
      <li>$R_S=( 0.213+0.096+0.505)/3=0.814/3=0.271$</li>
    </ol>
    <p>That number is deliberately small enough to check by hand, because every larger system in Part 3 is still built from this same averaging move.</p>

    <p><b>Adding the method's cost.</b> For this setting the complexity, regularization, or operational cost is 0.050. The score that should drive selection is therefore not the raw average alone.</p>
    <ol class="work">
      <li>$score=R_S+cost=0.271+0.050=0.321$</li>
    </ol>
    <p>The cost term is the teacher's quiet guardrail: it prevents an attractive fit from being mistaken for a durable model.</p>

    <p><b>Comparing a tempting alternative.</b> A more flexible alternative reaches a decision score of 0.369. The gap is the amount of evidence the alternative must overcome.</p>
    <ol class="work">
      <li>$gap=0.369-0.321=0.048$</li>
      <li>$relative\ gap=(0.369-0.321)/0.369=0.130$</li>
    </ol>
    <p>The lower score wins here, but the relative gap is the more honest reading: a tiny win can disappear under resampling noise, while a larger one usually deserves attention.</p>

    <p><b>A knob turned toward stability.</b> If the stabilizing knob reduces the decision score by 20%, the new value is:</p>
    <ol class="work">
      <li>$stable=0.80\cdot 0.321=0.257$</li>
    </ol>
    <p>This illustrates the recurring Part 3 bargain: slightly constrained models often make better future decisions because they give up brittle variation.</p>

    <p><b>End-to-end decision.</b> The final comparison is between the baseline score 0.321, the flexible alternative 0.369, and the stabilized score 0.257.</p>
    <ol class="work">
      <li>$\min(0.321,0.369,0.257)=0.257$</li>
    </ol>
    <p>For this verified toy case the stabilized version is the one to carry forward. The lesson is not that stabilization always wins; it is that the correct unit of judgment is the full score implied by the method, not the prettiest training fragment.</p>`,
  pitfalls: String.raw`
    <ul>
      <li><b>Optimizing the raw term and forgetting the cost.</b> In the mathematics, $R_S=0.271$ is only one part of the selection score; dropping the 0.050 term changes the decision mechanism.</li>
      <li><b>Comparing scores on different scales.</b> A loss, a probability, a margin, and an information criterion do not mean the same thing; the formula defines the scale before any ranking is meaningful.</li>
      <li><b>Treating the validation gap as decoration.</b> The gap term 0.048 is the evidence for preferring one setting over another; if it is within sampling noise, the apparent winner is not stable.</li>
      <li><b>Letting the notebook drift from the prose.</b> The companion notebook recomputes the same average, cost, gap, stabilized score, and final minimum; if those disagree, the lesson is silently teaching two different algorithms.</li>
    </ul>`
};
