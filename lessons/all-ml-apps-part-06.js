/* All ML — Part 06 applications (5 each). Loaded after content-part-06.js, before all-ml-register.js. */

/* ---- _apps-part06-A.js ---- */
window.ALLML_CONTENT["6.1"].applications = [
  { title: "Credit-risk triage", background: "<p>A first-pass credit screen often begins as a small affine gate before richer models are added.</p>", numbers: "<p>With the lesson values $x=[1.5,-0.5]$, $w=[1.2,-0.4]$, and $b=0.4$, the score is $1.2\cdot1.5+(-0.4)\cdot(-0.5)+0.4=2.4$ and ReLU keeps $h=2.4$.</p>" },
  { title: "Ad click prediction", background: "<p>Click models need feature interactions, so XOR is the smallest warning that one linear separator is not enough.</p>", numbers: "<p>D1 has 4 points: $(0,0)$ and $(1,1)$ share class 0, while $(0,1)$ and $(1,0)$ share class 1, which requires a hidden nonlinear composition.</p>" },
  { title: "Medical tabular screening", background: "<p>Clinical tabular nets can be small, but their hidden activations still determine memory and latency.</p>", numbers: "<p>A hidden width of 128 stores $d\cdot128\cdot4$ bytes per activation block; for the lesson block count 3 this is $3\cdot128\cdot4/1024=1.5$ KB.</p>" },
  { title: "Quality inspection", background: "<p>Factory inspection often compares several defect classes rather than accepting an absolute score.</p>", numbers: "<p>Comparing the lesson score 2.4 with baseline 0.4 gives $e^{2.4}/(e^{2.4}+e^{0.4})=11.023/(11.023+1.492)=0.881$.</p>" },
  { title: "Retail image classification", background: "<p>Image classifiers use the same affine, activation, and softmax pattern at a larger feature scale.</p>", numbers: "<p>The D5 ladder uses 10 digit labels with feature and label noise; a prediction vector therefore has 10 probabilities that should sum to 1.</p>" }
];

window.ALLML_CONTENT["6.2"].applications = [
  { title: "Sensor calibration", background: "<p>Calibration curves are often smooth one-dimensional nonlinear responses.</p>", numbers: "<p>The lesson basis unit gives $1.4\cdot1.5+(-0.1)\cdot(-0.5)+0.5=2.65$, so one ReLU bump contributes 2.65 before output weighting.</p>" },
  { title: "Speech command boundary", background: "<p>Wider hidden layers can draw more flexible command boundaries, though the theorem does not promise easy training.</p>", numbers: "<p>Illustratively, increasing width from 4 to 32 adds $28$ hidden units, each with its own $a_j\phi(w_jx+b_j)$ contribution.</p>" },
  { title: "Fraud rules", background: "<p>Fraud rules often combine signals nonlinearly, just like the XOR rung.</p>", numbers: "<p>D1's 4 XOR points are exactly the case where two positive-looking marginals do not define one separable class rule.</p>" },
  { title: "Robot control lookup", background: "<p>Continuous control policies can be approximated as sums of adjustable nonlinear features.</p>", numbers: "<p>With $m=4$ hidden units, the approximator has four terms in $\sum_{j=1}^{m}a_j\phi(w_jx+b_j)$; doubling to $m=8$ doubles those basis terms.</p>" },
  { title: "Demand curve fitting", background: "<p>Demand curves are smooth but noisy, so validation checks matter more than theorem-level existence.</p>", numbers: "<p>The lesson update is $2.0-0.07\cdot1.5=1.895$, showing that approximation quality changes through repeated small trained moves.</p>" }
];

window.ALLML_CONTENT["6.3"].applications = [
  { title: "Recommendation scoring", background: "<p>Recommendation systems turn logits into a distribution over candidate classes or actions.</p>", numbers: "<p>For D3, $K=3$ classes, so softmax forms three probabilities whose denominator is $\sum_{j=1}^{3}e^{z_j}$.</p>" },
  { title: "Vision ReLU stacks", background: "<p>Vision MLP and CNN blocks commonly use ReLU-like gates to keep positive evidence moving.</p>", numbers: "<p>At the lesson score $z=2.9$, ReLU returns 2.9 while sigmoid is already near $1/(1+e^{-2.9})=0.948$.</p>" },
  { title: "Medical risk logits", background: "<p>Risk models need calibrated probabilities, but saturated activations can hide gradient signal.</p>", numbers: "<p>The lesson comparison gives $e^{2.9}/(e^{2.9}+e^{0.4})=18.174/(18.174+1.492)=0.924$.</p>" },
  { title: "Language token choice", background: "<p>Token selection is a softmax over many logits, making normalization nonnegotiable.</p>", numbers: "<p>For any logits, stable softmax subtracts the maximum but still preserves $\sum_i p_i=1$.</p>" },
  { title: "Fraud detection", background: "<p>Fraud models compare activation choices on the same features to avoid changing two causes at once.</p>", numbers: "<p>The notebook sweeps five named activations or choices: sigmoid, tanh, ReLU, GELU, and softmax probability output.</p>" }
];

window.ALLML_CONTENT["6.4"].applications = [
  { title: "Ad ranking", background: "<p>Ranking systems assign credit to features by sending the loss gradient backward through each layer.</p>", numbers: "<p>With $\partial L/\partial h=0.5$, positive ReLU derivative 1, and $x=[1.5,-0.5]$, the local weight gradient is $[0.75,-0.25]$.</p>" },
  { title: "Robotics control", background: "<p>Control policies are sensitive to derivative mistakes because each local derivative changes the final update.</p>", numbers: "<p>The lesson chain has three factors: $\partial L/\partial h$, $\partial h/\partial z_1$, and $\partial z_1/\partial W_1$.</p>" },
  { title: "Medical imaging", background: "<p>Digit-like imaging classifiers propagate gradients through every output logit.</p>", numbers: "<p>D4 digits has 10 classes, so each example produces 10 logits before cross-entropy forms one scalar loss.</p>" },
  { title: "Manufacturing QA", background: "<p>A hand pass on XOR is a cheap way to catch a wrong sign before training on larger data.</p>", numbers: "<p>D1 has 4 XOR points, and the lesson affine score checks to $1.8\cdot1.5+(-0.7)\cdot(-0.5)+0.7=3.75$.</p>" },
  { title: "Forecasting classifiers", background: "<p>Forecasting models can improve one step locally while getting worse on validation data.</p>", numbers: "<p>The lesson scalar update is $2.0-0.09\cdot1.8=1.838$, only one move in a longer validation-tracked sequence.</p>" }
];

window.ALLML_CONTENT["6.5"].applications = [
  { title: "Compiler/autograd systems", background: "<p>Autograd engines record operations and run reverse accumulation over graph nodes.</p>", numbers: "<p>The lesson rule $\bar v=\sum_u\bar u\,\partial u/\partial v$ means two child contributions 0.3 and 0.4 would sum to an adjoint of 0.7.</p>" },
  { title: "Finance models", background: "<p>Finance risk graphs benefit from exposing every operation before trusting the final sensitivity.</p>", numbers: "<p>On the lesson graph, $1.0\cdot1.5+(-0.4)\cdot(-0.5)+0.8=2.5$, and reverse mode gives $\partial h/\partial w_0=1.5$.</p>" },
  { title: "Medical pipelines", background: "<p>Finite-difference checks catch silent graph disconnects in high-stakes pipelines.</p>", numbers: "<p>A centered check uses $(L(w+\epsilon)-L(w-\epsilon))/(2\epsilon)$; with $\epsilon=10^{-4}$ it should match the printed gradient scale.</p>" },
  { title: "Vision training", background: "<p>Graph inspection on the noisy digits rung keeps a real image-like example CPU-sized.</p>", numbers: "<p>D5 keeps 64 input features and 10 labels, so a hidden width of 20 creates a $64\times20$ first-layer weight tensor.</p>" },
  { title: "Scientific ML", background: "<p>Scientific models map equations to reusable graph nodes so sensitivities can be recomputed reliably.</p>", numbers: "<p>The lesson update uses the graph gradient as $2.0-0.05\cdot1.95=1.9025$, rounded to 1.903.</p>" }
];

window.ALLML_CONTENT["6.6"].applications = [
  { title: "Spam filtering", background: "<p>Spam classifiers usually optimize cross-entropy because the target is a class probability.</p>", numbers: "<p>For the lesson probability 0.852, cross-entropy for the true class is $-\log(0.852)\approx0.160$.</p>" },
  { title: "Regression sensors", background: "<p>Sensor calibration often uses MSE because squared error measures numeric distance.</p>", numbers: "<p>If two residuals are 0.1 and -0.2, then $L_{MSE}=((0.1)^2+(-0.2)^2)/2=0.025$.</p>" },
  { title: "Margin ranking", background: "<p>Hinge losses train models to separate the correct score by a margin.</p>", numbers: "<p>With correct score 0.7, rival score 0.6, and margin 0.2, hinge loss is $\max(0,0.6-0.7+0.2)=0.1$.</p>" },
  { title: "Face or asset matching", background: "<p>Contrastive and triplet losses compare pairs and triples rather than single labels.</p>", numbers: "<p>A triplet with positive distance 0.4, negative distance 0.9, and margin 0.2 has $\max(0,0.4-0.9+0.2)=0$.</p>" },
  { title: "Digit classification", background: "<p>The same noisy D5 labels can be trained with one chosen loss while monitoring validation loss.</p>", numbers: "<p>D5 has 10 labels, so one-hot CE uses a 10-entry target and one scalar $-\sum_i y_i\log p_i$ per example.</p>" }
];

/* ---- _apps-part06-B.js ---- */
window.ALLML_CONTENT["6.7"].applications = [
  { title: "Ad model training", background: "<p>Sponsored-content rankers often train from noisy minibatches, so momentum exists to keep a useful velocity across gradient estimates instead of reacting to each batch alone.</p>", numbers: "<p>Using the lesson values $\eta=0.070$ and $g=1.200$, a no-momentum scalar update moves $2.000-0.070\cdot1.200=1.916$. With illustrative $\mu=0.9$ and prior velocity $v=-0.084$, the next velocity is $0.9(-0.084)-0.070(1.200)=-0.1596$.</p>" },
  { title: "Robotics policy updates", background: "<p>Policy-gradient systems can overshoot because each rollout is a noisy view of the objective; Nesterov-style lookahead checks the slope at the point momentum is about to visit.</p>", numbers: "<p>With $\theta=2.000$, $v=-0.084$, and illustrative $\mu=0.9$, the lookahead point is $2.000+0.9(-0.084)=1.9244$ before the new gradient is applied.</p>" },
  { title: "Tiny education demo", background: "<p>The D1 XOR rung has exactly four points, making the optimizer update traceable without hiding the mechanism behind a large dataset.</p>", numbers: "<p>One scalar step uses the same lesson arithmetic: $\Delta\theta=-\eta g=-0.070\cdot1.200=-0.084$, so the updated parameter is $1.916$.</p>" },
  { title: "Vision classifier comparison", background: "<p>Keeping the same small network across D1-D5 isolates the optimizer component, which is the right experiment for momentum rather than a model-size contest.</p>", numbers: "<p>The ladder has five rungs, so comparing SGD, momentum, and Nesterov-like momentum gives $5\cdot3=15$ held-out accuracy measurements from the same split rule.</p>" },
  { title: "Large-batch service training", background: "<p>Production training jobs often tune learning rate and momentum together because the velocity term can either smooth or amplify a large-batch update.</p>", numbers: "<p>If an illustrative run changes $\eta$ from $0.070$ to $0.035$ with the same $g=1.200$, the immediate step halves from $0.084$ to $0.042$ while retaining velocity memory.</p>" },
];

window.ALLML_CONTENT["6.8"].applications = [
  { title: "Sparse ads features", background: "<p>AdaGrad was designed for sparse, high-dimensional features where some coordinates appear often and others only occasionally.</p>", numbers: "<p>For the lesson gradient $g=1.350$, first-step AdaGrad has accumulator $g^2=1.8225$ and normalized step $0.080\cdot1.350/\sqrt{1.8225}=0.080$ before $\epsilon$.</p>" },
  { title: "Noisy sensor models", background: "<p>RMSProp smooths squared gradients so a single noisy coordinate does not permanently dominate the denominator.</p>", numbers: "<p>With illustrative $\beta_2=0.9$ and $g=1.350$, the first squared-gradient history is $0.9\cdot0+0.1\cdot1.8225=0.18225$.</p>" },
  { title: "Vision classifiers", background: "<p>Adam and AdamW are common defaults for image classifiers because they combine momentum-like first moments with per-coordinate second moments.</p>", numbers: "<p>Using the lesson $\beta_1=0.9$ example, $m_1=(1-0.9)1.350=0.135$ and bias correction recovers $\hat m_1=1.350$.</p>" },
  { title: "Text classifiers", background: "<p>AdamW separates weight decay from the adaptive gradient, which matters in embeddings and text models where decay should not be hidden inside moment scaling.</p>", numbers: "<p>For illustrative $\lambda=0.01$, $\eta=0.080$, and $\theta=2.000$, the decoupled shrink term is $0.080\cdot0.01\cdot2.000=0.0016$.</p>" },
  { title: "Toy debugging", background: "<p>A D1 scalar calculation catches implementation errors in moment updates before the optimizer is trusted on the full ladder.</p>", numbers: "<p>The plain lesson step is $2.000-0.080\cdot1.350=1.892$, while Adam's first bias-corrected sign-sized step is about $2.000-0.080=1.920$.</p>" },
];

window.ALLML_CONTENT["6.9"].applications = [
  { title: "Foundation-model pretraining", background: "<p>LAMB was introduced for very large batches, where layerwise trust ratios keep an adaptive update from being too large or too small relative to the parameters.</p>", numbers: "<p>If $\|\theta\|=5$ and $\|u\|=1$ illustratively, the trust ratio is $r=\frac{\|\theta\|}{\|u\|}=5$, so a raw update norm of $0.09$ becomes $0.45$.</p>" },
  { title: "Large-batch vision", background: "<p>Vision training often compares smaller noisy batches with larger smoother batches while keeping the architecture fixed.</p>", numbers: "<p>In the notebook's illustrative sweep, batch sizes $32$ and $256$ differ by a factor of $256/32=8$, so any accuracy difference is attributable to batch and optimizer behavior, not the ladder.</p>" },
  { title: "Edge recommender retraining", background: "<p>Lion stores a momentum-like vector and uses its sign, reducing update-state complexity compared with methods that need both first and second moments.</p>", numbers: "<p>With lesson values $\eta=0.090$ and positive $m_t$, Lion's scalar sign step is $2.000-0.090\cdot1=1.910$.</p>" },
  { title: "D1 teaching demo", background: "<p>The four-point XOR rung lets students verify that a sign update and a magnitude-sensitive SGD update are not the same operation.</p>", numbers: "<p>The lesson's magnitude-sensitive step is $2.000-0.090\cdot1.500=1.865$, which is $0.045$ farther than the sign step to $1.910$.</p>" },
  { title: "D5 CPU simulation", background: "<p>The D5 noisy digits rung simulates a harder image task without downloads, making large-batch behavior visible in a CPU-safe notebook.</p>", numbers: "<p>The same three optimizer variants across five rungs produce $3\cdot5=15$ accuracy values while using only sklearn-bundled digits data.</p>" },
];

window.ALLML_CONTENT["6.10"].applications = [
  { title: "Vision fine-tuning", background: "<p>K-FAC preconditions layer gradients with activation and gradient covariance factors, approximating a second-order step without forming full curvature.</p>", numbers: "<p>For a $64\times16$ layer, full curvature has $(64\cdot16)^2=1,048,576$ entries, while K-FAC factors use $64^2+16^2=4,352$ entries.</p>" },
  { title: "Robotics dynamics", background: "<p>Small dynamics models make the preconditioned matrix step interpretable because a $2\times2$ curvature block can be inverted directly.</p>", numbers: "<p>With illustrative $A=\begin{bmatrix}2&0.5\\0.5&1\end{bmatrix}$, the determinant is $2\cdot1-0.5^2=1.75$, so the inverse exists.</p>" },
  { title: "Medical classifier memory tradeoff", background: "<p>Medical imaging models can be memory-constrained, so block curvature approximations trade exactness for feasible training.</p>", numbers: "<p>At 8 bytes per float, the illustrative $64\times16$ full curvature costs $1,048,576\cdot8=8,388,608$ bytes, versus $4,352\cdot8=34,816$ bytes for factors.</p>" },
  { title: "Ad ranking loss curves", background: "<p>Ranking models care about wall-clock and validation loss, so comparing first-order and preconditioned curves on the same ladder is the right component experiment.</p>", numbers: "<p>Three variants over five rungs create $15$ loss curves; the metric stays validation loss rather than switching objectives mid-ladder.</p>" },
  { title: "D5 fashion-style image tabularization", background: "<p>The notebook uses the no-download noisy digits D5 rung as a CPU-safe image-as-tabular proxy for the planned harder fashion-style setting.</p>", numbers: "<p>For D5 with $d=64$ and hidden width $16$, a diagonal approximation needs only $64\cdot16=1,024$ entries for the first weight block.</p>" },
];

window.ALLML_CONTENT["6.11"].applications = [
  { title: "Computer vision", background: "<p>He initialization matches ReLU networks because roughly half the activations are gated off, so the incoming variance needs a larger scale.</p>", numbers: "<p>For D1's first layer with $fan_{in}=2$, He variance is $\frac{2}{fan_{in}}=\frac{2}{2}=1.0$.</p>" },
  { title: "Tabular MLPs", background: "<p>Xavier initialization balances incoming and outgoing fan counts, which is useful when activations are closer to symmetric than ReLU-gated.</p>", numbers: "<p>For D1 with $fan_{in}=2$ and illustrative hidden width $fan_{out}=16$, Xavier variance is $\frac{2}{2+16}=0.1111$.</p>" },
  { title: "Speech models", background: "<p>Orthogonal initialization helps preserve signal norms through linear transformations, a useful property in deep sequence and speech networks.</p>", numbers: "<p>An orthogonal matrix has $Q^TQ=I$, so an illustrative vector with norm $3$ keeps norm $\|Qx\|=3$ before nonlinearities intervene.</p>" },
  { title: "Manufacturing QA", background: "<p>LSUV rescales layer outputs on an initial batch, reducing the chance that early activations are nearly zero or enormous.</p>", numbers: "<p>If a layer's initial output variance is $0.04$, LSUV divides weights by $\sqrt{0.04}=0.2$, multiplying them by $5$ to target variance near $1$.</p>" },
  { title: "D1 XOR", background: "<p>The XOR rung exposes the fan-in calculation directly because each sample has two input features.</p>", numbers: "<p>With the lesson update values, the local optimizer move is $2.000-0.060\cdot1.800=1.892$, but initialization decides the starting scale before that update occurs.</p>" },
];

window.ALLML_CONTENT["6.12"].applications = [
  { title: "Image classification", background: "<p>Dropout masks hidden activations so image classifiers do not depend too heavily on one fragile feature detector.</p>", numbers: "<p>With keep probability $q=0.75$, activation $h=6$, and mask $m=1$, inverted dropout returns $\tilde h=1\cdot6/0.75=8$.</p>" },
  { title: "Ad prediction", background: "<p>Inverted dropout is used because it keeps the expected activation unchanged between training and evaluation.</p>", numbers: "<p>If $h=4$ and $m\sim\mathrm{Bernoulli}(0.75)$, then $E[mh/q]=0.75\cdot4/0.75=4$.</p>" },
  { title: "Small-data medical models", background: "<p>Regularization noise can help when the training set is small enough for co-adaptation to dominate validation behavior.</p>", numbers: "<p>Sweeping three keep settings over five rungs would produce $3\cdot5=15$ validation accuracies from the same small MLP.</p>" },
  { title: "Network pruning proxy", background: "<p>DropConnect masks weights rather than activations, making the trained network robust to missing connections.</p>", numbers: "<p>With weight $4$, mask $1$, and $q=0.75$, DropConnect uses $4/0.75=5.3333$ during the training pass.</p>" },
  { title: "D5 noisy image proxy", background: "<p>The noisy digits D5 rung makes train-validation gaps visible without downloading fashion data, which keeps the lesson CPU-safe.</p>", numbers: "<p>The lesson local update is $2.000-0.070\cdot1.950=1.8635$; dropout changes the stochastic forward pass that produces such gradients.</p>" },
];

window.ALLML_CONTENT["6.13"].applications = [
  { title: "Fraud models", background: "<p>Weight decay keeps fraud classifiers from relying on overly large coefficients that fit transient patterns.</p>", numbers: "<p>With $\eta=0.080$, illustrative $\lambda=0.1$, $\theta=2.000$, and $g=2.100$, shrinkage gives $(1-0.080\cdot0.1)2.000-0.080\cdot2.100=1.816$.</p>" },
  { title: "Medical imaging", background: "<p>Early stopping chooses the model from the validation epoch that best generalizes, not the final epoch that best fits training data.</p>", numbers: "<p>For illustrative validation losses $0.90,0.70,0.62,0.64,0.67$, the best epoch is $3$; with patience $2$, stopping occurs at epoch $5$.</p>" },
  { title: "Ad CTR models", background: "<p>CTR systems often sweep decay and patience together because both control capacity while leaving the scoring architecture unchanged.</p>", numbers: "<p>Three regularization variants across five ladder rungs produce $3\cdot5=15$ held-out accuracy values under the same split.</p>" },
  { title: "D1 XOR shrinkage", background: "<p>The four-point XOR rung makes a single weight-decay step easy to recompute by hand before trusting the full training loop.</p>", numbers: "<p>With no decay, the lesson update is $2.000-0.080\cdot2.100=1.832$; adding illustrative $\lambda=0.1$ subtracts another $0.016$.</p>" },
  { title: "D5 noisy image proxy", background: "<p>On noisy D5, training loss may continue falling after validation loss turns upward, showing why early stopping is a real regularizer.</p>", numbers: "<p>If the best validation epoch is $e$ and patience is $4$, the earliest stop after the best point is $e+4$, while the stored weights remain from epoch $e$.</p>" },
];

/* ---- _apps-part06-C.js ---- */
window.ALLML_CONTENT["6.14"].applications = [
  {
    title: "Image classification",
    background: "<p>Label smoothing is common in image classifiers because hard one-hot labels make the model act as if every annotation is perfectly certain.</p>",
    numbers: "<p>With the lesson formula $y'_k=(1-\\varepsilon)y_k+\\frac{\\varepsilon}{K}$, an illustrative $K=10$ digit task and $\\varepsilon=0.10$ gives the true class $0.9+0.01=0.91$ and each other class $0.01$.</p>"
  },
  {
    title: "Speech recognition",
    background: "<p>Acoustic labels can be ambiguous near phoneme boundaries, so smoothing reduces overconfident posteriors while preserving the same sequence model.</p>",
    numbers: "<p>For an illustrative $K=40$ phone inventory and $\\varepsilon=0.08$, the target phone receives $0.92+0.002=0.922$ and every alternative receives $0.002$.</p>"
  },
  {
    title: "Medical triage",
    background: "<p>Three-way triage models often distinguish low, medium, and high urgency; smoothed targets keep one noisy label from dominating the loss.</p>",
    numbers: "<p>On the D3 three-class blobs, $K=3$ and $\\varepsilon=0.09$ gives the labeled class $0.91+0.03=0.94$ and the two other classes $0.03$ each.</p>"
  },
  {
    title: "Digit recognition",
    background: "<p>The D4 and D5 ladder rungs use real digit images, where writer style and noise make absolute certainty a poor training target.</p>",
    numbers: "<p>For $K=10$ and $\\varepsilon=0.20$, the true digit target is $0.80+0.02=0.82$ and all nine non-target digits receive $0.02$.</p>"
  },
  {
    title: "Ad category models",
    background: "<p>Ads category classifiers can have overlapping categories, so smoothing is useful only when accuracy is reported with calibration diagnostics.</p>",
    numbers: "<p>For an illustrative $K=5$ taxonomy and $\\varepsilon=0.10$, the selected class receives $0.90+0.02=0.92$ and each alternative receives $0.02$; accuracy alone cannot show whether confidence improved.</p>"
  }
];

window.ALLML_CONTENT["6.15"].applications = [
  {
    title: "Vision MLPs",
    background: "<p>Batch normalization stabilizes hidden activations in vision networks before the next affine or nonlinear layer uses them.</p>",
    numbers: "<p>For D1 activations $[0,1,0,1]$, $\\mu_B=0.5$ and $\\sigma_B^2=0.25$, so $0$ normalizes to $\\frac{0-0.5}{\\sqrt{0.25+10^{-5}}}\\approx-0.99998$.</p>"
  },
  {
    title: "Ads tabular training",
    background: "<p>BatchNorm train and evaluation modes matter for tabular ads features because production inference must not depend on the current request batch.</p>",
    numbers: "<p>If a training batch has $\\mu_B=2$ and $\\sigma_B^2=9$, an activation $5$ normalizes to $1$; recomputing a serving batch with $\\mu=4$ would change the same value to $\\frac{1}{\\sqrt{9}}=0.333$.</p>"
  },
  {
    title: "Medical classifiers",
    background: "<p>Small medical minibatches can make BatchNorm statistics noisy, so batch size is a modeling choice rather than a harmless implementation detail.</p>",
    numbers: "<p>Illustratively, a batch of $4$ values $[1,1,3,3]$ has mean $2$ and variance $1$, while a batch of $2$ values $[1,3]$ has the same mean but half as many samples supporting it.</p>"
  },
  {
    title: "D1 XOR diagnostics",
    background: "<p>The D1 rung is small enough to print every activation and verify the normalization arithmetic by hand.</p>",
    numbers: "<p>Using $\\gamma=1.5$ and $\\beta=0.1$, the normalized value $-0.99998$ becomes $1.5(-0.99998)+0.1\\approx-1.39997$.</p>"
  },
  {
    title: "Noisy digit models",
    background: "<p>On the D5 noisy digits rung, BatchNorm can be compared on and off while the same random-feature classifier and data split stay fixed.</p>",
    numbers: "<p>If hidden feature variance is illustratively $4$, normalization divides centered activations by $\\sqrt{4+10^{-5}}\\approx2$, cutting a centered value $6$ to about $3$ before the learned scale restores capacity.</p>"
  }
];

window.ALLML_CONTENT["6.16"].applications = [
  {
    title: "Style and vision models",
    background: "<p>Instance normalization is used in vision settings where each example's channel statistics should be standardized independently.</p>",
    numbers: "<p>For one illustrative channel values $[2,4]$, the instance mean is $3$ and variance is $1$, so the normalized values are $[-1,1]$ up to the small $\\epsilon$ term.</p>"
  },
  {
    title: "Language models",
    background: "<p>Layer normalization avoids dependence on other examples in the batch, which is useful for sequence models and variable batch sizes.</p>",
    numbers: "<p>For one token vector $[1,2,3,4]$, $\\mu=2.5$ and $\\sigma^2=1.25$, so the first component is $\\frac{1-2.5}{\\sqrt{1.25+10^{-5}}}\\approx-1.34164$.</p>"
  },
  {
    title: "Group convolutional nets",
    background: "<p>Group normalization splits channels into groups so the statistic sits between per-layer and per-instance extremes.</p>",
    numbers: "<p>With $8$ hidden channels and $4$ groups, each group has $2$ channels; values $[1,3]$ in one group have mean $2$ and variance $1$, producing $[-1,1]$ approximately.</p>"
  },
  {
    title: "D1 MLP axis checks",
    background: "<p>The D1 notebook prints axis-wise means and variances so the normalization choice is visible rather than hidden inside a layer call.</p>",
    numbers: "<p>Normalizing $[1,2,3,4]$ over features gives one mean $2.5$; normalizing two groups $[1,2]$ and $[3,4]$ gives means $1.5$ and $3.5$ instead.</p>"
  },
  {
    title: "Noisy digit tensor shapes",
    background: "<p>On D5, choosing the wrong axis changes the statistic and can silently change model behavior even when tensor shapes still run.</p>",
    numbers: "<p>A hidden width of $112$ reshaped into $8$ instance channels has $14$ values per channel, while $4$ groups have $28$ values per group; those counts define different means and variances.</p>"
  }
];

window.ALLML_CONTENT["6.17"].applications = [
  {
    title: "Deep vision",
    background: "<p>Residual blocks let deep vision networks learn corrections while preserving a direct activation path.</p>",
    numbers: "<p>With $x=[1,-2]$ and $F(x)=[0.2,0.5]$, the residual output is $y=x+F(x)=[1.2,-1.5]$.</p>"
  },
  {
    title: "Speech encoders",
    background: "<p>Speech encoders stack many temporal blocks, and residual paths help gradients reach early acoustic layers.</p>",
    numbers: "<p>If a residual branch derivative is $0.1$, the skip derivative is $1+0.1=1.1$; without the skip the local gradient factor would be only $0.1$.</p>"
  },
  {
    title: "Recommenders",
    background: "<p>Recommender models often combine memorized input features with learned transformations, which is the same skip-connection idea in tabular form.</p>",
    numbers: "<p>If an input feature contributes $0.7$ directly and the learned branch adds $0.2$, the combined residual feature is $0.9$ rather than replacing the original signal.</p>"
  },
  {
    title: "D1 XOR comparison",
    background: "<p>The D1 XOR rung is small enough to compare a plain two-layer transform against a residual transform on all four points.</p>",
    numbers: "<p>For a scalar example with $x=1$ and $F(x)=-0.25$, the residual output is $0.75$ and the identity path still carries derivative $1$ plus the branch derivative.</p>"
  },
  {
    title: "Noisy digit depth",
    background: "<p>On D5 noisy digits, a deeper plain random-feature stack can stall while a dimension-matched residual stack preserves signal.</p>",
    numbers: "<p>Eight plain layers with illustrative gain $0.65$ have product $0.65^8\\approx0.0319$, while a skip path adds an identity route at each block.</p>"
  }
];

window.ALLML_CONTENT["6.18"].applications = [
  {
    title: "RNN-like depth",
    background: "<p>Repeated sequence steps multiply local gradient factors, making vanishing and exploding gradients a central recurrent-network issue.</p>",
    numbers: "<p>With scales $[0.5,0.8,1.2]$, the product is $0.48$; a final gradient norm $2.0$ becomes $0.96$ at the start.</p>"
  },
  {
    title: "Vision stacks",
    background: "<p>Deep vision stacks diagnose gradient flow by plotting layerwise gradient norms or histograms.</p>",
    numbers: "<p>An illustrative gain $0.45$ over $8$ layers gives $0.45^8\\approx0.00168$, while gain $1.45$ gives $1.45^8\\approx19.49$.</p>"
  },
  {
    title: "Medical classifiers",
    background: "<p>Normalized inputs reduce scale failures in medical classifiers where raw measurements may have incompatible units.</p>",
    numbers: "<p>If one feature scale is $100$ times another, a weight gradient proportional to that feature is also $100$ times larger before normalization.</p>"
  },
  {
    title: "D1 XOR gradient product",
    background: "<p>The D1 rung can demonstrate the entire gradient-flow mechanism with only a few scalar scale factors.</p>",
    numbers: "<p>Two layers with gains $0.5$ and $0.8$ multiply to $0.4$, so a downstream gradient $3$ arrives as $1.2$.</p>"
  },
  {
    title: "Noisy digit ablations",
    background: "<p>On D5, initialization scale, residuals, normalization, and clipping can be ablated while the ladder and classifier stay fixed.</p>",
    numbers: "<p>Changing illustrative depth-8 gain from $0.45$ to $0.85$ changes the product from about $0.00168$ to $0.27249$, a roughly $162$-fold increase.</p>"
  }
];

window.ALLML_CONTENT["6.19"].applications = [
  {
    title: "Speech training",
    background: "<p>Speech models use gradient clipping because rare utterances can create large sequence losses and unstable updates.</p>",
    numbers: "<p>For $g=[3,4]$ and $c=2$, $\\|g\\|=5$, the factor is $0.4$, and $g_{clip}=[1.2,1.6]$.</p>"
  },
  {
    title: "Robotics control",
    background: "<p>Robotics policies can see rare transitions with large gradients; clipping prevents one transition from dominating the update.</p>",
    numbers: "<p>If a raw update has norm $12$ and $c=3$, the multiplier is $\\min(1,3/12)=0.25$, so a component $8$ becomes $2$.</p>"
  },
  {
    title: "Ad models",
    background: "<p>Ads models can compare unclipped and clipped learning curves across the same five rungs to separate stability from accuracy.</p>",
    numbers: "<p>With learning rate $0.6$, a clipped norm $1.0$ caps the parameter-step norm at $0.6$, while an unclipped norm $5$ would step by $3.0$.</p>"
  },
  {
    title: "D1 XOR gradient vector",
    background: "<p>The D1 notebook uses a two-dimensional gradient so every clipping number can be re-derived by hand.</p>",
    numbers: "<p>For $g=[0.6,0.8]$ and $c=2$, the norm is $1$, so the multiplier is $1$ and the vector is unchanged.</p>"
  },
  {
    title: "Noisy digit thresholding",
    background: "<p>On D5 noisy digits, clipping thresholds are reported as illustrative hyperparameters and paired with learning-rate tuning.</p>",
    numbers: "<p>If $c=1$ and the raw gradient norm is $2.5$, the factor is $0.4$; if the learning rate is $0.25$, the clipped step norm is at most $0.25$.</p>"
  }
];

window.ALLML_CONTENT["6.20"].applications = [
  {
    title: "Vision training",
    background: "<p>Cosine learning-rate schedules are common in vision training because they move quickly early and settle smoothly late.</p>",
    numbers: "<p>With $\\eta_{min}=0.01$, $\\eta_{max}=0.10$, $T=4$, the lesson formula gives $\\eta_2=0.01+0.5(0.09)(1+\\cos(\\pi/2))=0.055$.</p>"
  },
  {
    title: "Large-batch ads",
    background: "<p>Warmup avoids early divergence when large ads batches make each optimizer step highly coordinated.</p>",
    numbers: "<p>An illustrative five-step warmup to $0.10$ uses rates $0.02,0.04,0.06,0.08,0.10$ before the decay phase begins.</p>"
  },
  {
    title: "Mobile models",
    background: "<p>One-cycle schedules trade speed and stability by increasing the rate and then lowering it for convergence.</p>",
    numbers: "<p>If the base rate is $0.05$ and the one-cycle peak multiplier is $2$, the peak rate is $0.10$ before the schedule decays toward a smaller final rate.</p>"
  },
  {
    title: "D1 XOR schedule table",
    background: "<p>The D1 notebook prints a short schedule table so the optimizer's time-varying step size is not a hidden setting.</p>",
    numbers: "<p>The cosine trace for $t=0..4$ is approximately $[0.10000,0.08682,0.05500,0.02318,0.01000]$ with the lesson constants.</p>"
  },
  {
    title: "Noisy digit schedule comparison",
    background: "<p>On D5 noisy digits, step, cosine, warmup-cosine, and one-cycle schedules are compared while the model and data split stay fixed.</p>",
    numbers: "<p>If warmup-cosine uses base $0.35$ and a final floor of $2\%$, the floor is $0.007$, which bounds the late training step size.</p>"
  }
];

/* ---- _apps-part06-D.js ---- */
window.ALLML_CONTENT["6.21"].applications = [
  { title: "Autograd library tests", background: "<p>Gradient checking exists because backprop code can be shape-correct but numerically wrong.</p>", numbers: "<p>The centered check uses two loss calls per parameter: $[L(\theta+h)-L(\theta-h)]/(2h)$. For the lesson pass, $1.2\cdot1.5+(-0.4)\cdot(-0.5)+0.6=2.6$ and the checked update is $2.0-0.06\cdot1.2=1.928$.</p>" },
  { title: "Finance risk models", background: "<p>Before deployment, custom differentiable losses can be checked on small portfolios.</p>", numbers: "<p>Illustratively, a 1,000-parameter model needs 2,000 scalar loss evaluations for one centered sweep, because each coordinate uses $+h$ and $-h$.</p>" },
  { title: "Vision classifier bring-up", background: "<p>A tiny D1 check should pass before expensive D5 image training begins.</p>", numbers: "<p>D1 has 4 XOR examples, so a first check can use all labels; D5 then reports the relative error before training on noisy 64-dimensional digit images.</p>" },
  { title: "Research notebooks", background: "<p>Printed relative error turns a visual notebook claim into a reproducible numerical test.</p>", numbers: "<p>An illustrative pass threshold is $10^{-6}$; the rebuilt notebook asserts a much tighter numeric-versus-analytic match on D1.</p>" },
  { title: "Custom CE or MSE losses", background: "<p>Hand-written objectives often mix reductions and class axes.</p>", numbers: "<p>For K=3 logits in D3, checking one parameter still costs two loss calls, while checking 30 parameters costs 60 calls.</p>" }
];

window.ALLML_CONTENT["6.22"].applications = [
  { title: "Limited-memory vision training", background: "<p>Gradient accumulation lets a CPU or small device emulate a larger batch.</p>", numbers: "<p>With $K=2$ micro-batches on D1, $g=(g_1+g_2)/2$ matches the full-batch mean gradient, and the lesson update is $2.0-0.07\cdot1.35=1.9055$.</p>" },
  { title: "Long residual networks", background: "<p>Activation checkpointing stores fewer intermediate tensors and recomputes them during backward.</p>", numbers: "<p>Illustratively, batch 64, width 128, and 8 stored layers use $64\cdot128\cdot8\cdot4=262144$ bytes; checkpoint boundaries can store fewer layers.</p>" },
  { title: "Ads ranking batches", background: "<p>Effective batch size can stay fixed while hardware batch size changes.</p>", numbers: "<p>If each micro-batch has 32 examples and $K=4$, the effective batch is $32\cdot4=128$ examples before one optimizer update.</p>" },
  { title: "D1 XOR debugging", background: "<p>The four-point rung makes the averaging convention visible.</p>", numbers: "<p>Splitting 4 points into two micro-batches gives 2 examples per micro-batch; weighting by $2/4$ recovers the full mean gradient.</p>" },
  { title: "D5 memory budgeting", background: "<p>The notebook reports CPU activation bytes rather than assuming GPU memory.</p>", numbers: "<p>For 1,797 digit examples, width 128, and 10 layers, the full activation estimate is $1797\cdot128\cdot10\cdot4=9200640$ bytes, motivating micro-batches.</p>" }
];

window.ALLML_CONTENT["6.23"].applications = [
  { title: "Deep vision residual paths", background: "<p>Stochastic depth regularizes very deep residual networks by randomly skipping blocks.</p>", numbers: "<p>The D1 residual formula is $y=x+bF(x)$; with $x=[1,-1]$, $F(x)=[0.25,0.5]$, $b=1$ gives $[1.25,-0.5]$, while $b=0$ gives $[1,-1]$.</p>" },
  { title: "Robust classifiers", background: "<p>Spectral normalization limits a layer's largest linear gain.</p>", numbers: "<p>For $W=\mathrm{diag}(3,4)$, $\sigma_{max}(W)=4$, so $W/4$ has largest singular value 1.</p>" },
  { title: "GAN-style discriminators", background: "<p>Lipschitz control is often used to stabilize adversarial training.</p>", numbers: "<p>Illustratively, a layer with top singular value 4 can quadruple an input perturbation; after normalization the bound is 1.</p>" },
  { title: "D1 hand check", background: "<p>The survival draw and rescale are both directly re-derivable.</p>", numbers: "<p>The lesson scalar pass is $1.6\cdot1.5+0.2\cdot(-0.5)+0.8=3.1$, and the update is $2.0-0.08\cdot1.5=1.88$.</p>" },
  { title: "D5 stability plots", background: "<p>Noisy images expose scale sensitivity that small rungs may hide.</p>", numbers: "<p>The notebook compares D5 accuracy with and without the stochastic-depth and spectral-normalization knobs held as the only changed component.</p>" }
];

window.ALLML_CONTENT["6.24"].applications = [
  { title: "Medical imaging fine-tuning", background: "<p>A pretrained image base is often frozen while a new diagnostic head learns first.</p>", numbers: "<p>The lesson uses separate rates: if $g=1.65$, a head rate 0.09 moves $2.0$ to $1.8515$, while a base rate 0.009 moves only to $1.98515$.</p>" },
  { title: "Retail vision transfer", background: "<p>Features learned on one image domain can initialize another smaller task.</p>", numbers: "<p>The notebook pretrains a base on D3, then transfers it to D4 and D5 after padding every rung to a common 64-dimensional input.</p>" },
  { title: "Ad creative models", background: "<p>Creative classifiers often reuse a base representation and train a campaign-specific head.</p>", numbers: "<p>With $\eta_{head}=10\eta_{base}$, the head spends ten times more gradient budget per step than the base.</p>" },
  { title: "Small-data classifiers", background: "<p>Freezing protects pretrained features when few labels are available.</p>", numbers: "<p>D5 uses a few-hundred held-out split from 1,797 digit images with 10 percent label flips, so slow unfreezing is compared against full fast tuning.</p>" },
  { title: "D1 toy feature maps", background: "<p>A two-parameter example shows the mechanics without hiding behind a framework.</p>", numbers: "<p>The lesson scalar score is $1.8\cdot1.5+(-0.7)\cdot(-0.5)+0.3=3.35$ before the separate base and head updates.</p>" }
];

window.ALLML_CONTENT["6.25"].applications = [
  { title: "Vision classification", background: "<p>Augmentation minimizes risk over label-preserving views, not just original examples.</p>", numbers: "<p>The objective is $R_{aug}(h)=\mathbb{E}_{(x,y)}\mathbb{E}_{t\sim T}\ell(h(t(x)),y)$; the notebook doubles a training split by adding one transformed view per example.</p>" },
  { title: "Document images", background: "<p>Small rotations and shifts model scanner and camera variation.</p>", numbers: "<p>For each 8 by 8 digit image, the rebuilt D4/D5 pipeline applies an illustrative rotation chosen from $\{-12,-6,6,12\}$ degrees plus a shift in $\{-1,0,1\}$ pixels.</p>" },
  { title: "Audio-like noise injection", background: "<p>Additive noise is a controlled proxy for nuisance variation when it preserves the label.</p>", numbers: "<p>The digit pipeline clips pixel values after adding Gaussian noise with standard deviation 0.04, keeping values in $[0,1]$.</p>" },
  { title: "D1 XOR jitter", background: "<p>Low-dimensional rungs use symmetric jitter instead of image transforms.</p>", numbers: "<p>D1 keeps exactly the labels $[0,0,1,1]$ while perturbing coordinates with noise, and the lesson update is $2.0-0.05\cdot1.8=1.91$.</p>" },
  { title: "D5 overfit check", background: "<p>The known-bad no-augmentation path is replaced by a measured augmentation comparison.</p>", numbers: "<p>D5 compares held-out accuracy with no augmentation against rotate/shift/noise augmentation on noisy digit images.</p>" }
];

window.ALLML_CONTENT["6.26"].applications = [
  { title: "LLM serving", background: "<p>A sparse MoE layer increases capacity while evaluating only a few experts per token.</p>", numbers: "<p>With TopK=2 and 4 experts, each example uses $2/4=50\%$ of the expert classifiers instead of all experts.</p>" },
  { title: "Ad ranking segments", background: "<p>Experts can specialize by traffic segment while the router reports load counts.</p>", numbers: "<p>The notebook prints per-expert D5 counts; a healthy run has nonzero utilization rather than all examples assigned to one expert.</p>" },
  { title: "Vision mixtures", background: "<p>Each image can be routed to a sparse subset of visual experts.</p>", numbers: "<p>The mixture formula is $y=\sum_{e\in TopK}p_eE_e(x)$, so two kept probabilities are renormalized to sum to 1 before combining expert outputs.</p>" },
  { title: "D1 hand computation", background: "<p>A two-expert toy pass exposes the router probabilities and expert outputs.</p>", numbers: "<p>The lesson scalar pass is $1.2\cdot1.5+(-0.1)\cdot(-0.5)+0.5=2.35$, and the update is $2.0-0.06\cdot1.95=1.883$.</p>" },
  { title: "D5 router collapse", background: "<p>Load-balance penalties are motivated by collapse, where one expert receives almost all examples.</p>", numbers: "<p>The D5 pitfall compares a biased router to a balanced distance router and asserts every expert receives at least one routed example.</p>" }
];

window.ALLML_CONTENT["6.27"].applications = [
  { title: "Continuous-time control", background: "<p>Neural ODEs model hidden states as trajectories driven by a learned vector field.</p>", numbers: "<p>The lesson equation is $dh(t)/dt=f_\theta(h(t),t)$; two Euler steps over $[0,1]$ use step size $0.5$.</p>" },
  { title: "Medical trajectories", background: "<p>Solver steps can represent irregular dynamics without tying the model to a fixed layer count.</p>", numbers: "<p>Illustratively, increasing from 1 to 8 fixed Euler steps multiplies vector-field evaluations by 8.</p>" },
  { title: "Vision depth models", background: "<p>Residual layers are Euler-like updates, connecting ResNets to continuous-depth models.</p>", numbers: "<p>One Euler update has the residual form $h_{next}=h+\Delta t f_\theta(h,t)$, matching a skip connection plus a learned increment.</p>" },
  { title: "D1 Euler trace", background: "<p>A tiny state can be stepped by hand before applying the block to image features.</p>", numbers: "<p>The lesson scalar pass is $1.4\cdot1.5+0.2\cdot(-0.5)+0.6=2.6$, and the update is $2.0-0.07\cdot2.1=1.853$.</p>" },
  { title: "D5 solver budget", background: "<p>The hardest rung shows that solver steps affect both loss and runtime.</p>", numbers: "<p>The notebook reports D5 loss and accuracy for fixed 1-step and 8-step Euler budgets, then checks that both losses are finite.</p>" }
];

/* ---- _apps-part06-E.js ---- */
/* All ML — Part 6 (Deep Learning Foundations) batch E applications. */
window.ALLML_CONTENT = window.ALLML_CONTENT || {};

window.ALLML_CONTENT["6.28"].applications = [
  { title: "Personalized model heads", background: "<p>A hypernetwork can convert a user or task context into the weights of a smaller prediction head, so one generator supports many personalized models.</p>", numbers: "<p>Using the lesson values, context emits $W=[1.6,-0.7]$ and $b=0.7$, so $1.6\\times1.5+(-0.7)\\times(-0.5)+0.7=3.45$ before the gate.</p>" },
  { title: "Multi-task learning", background: "<p>A shared generator can emit separate task heads while preserving a common representation, which is useful when related tasks have limited examples.</p>", numbers: "<p>For illustrative two-task heads with 64 inputs and 10 outputs each, direct storage is $2\\times64\\times10=1280$ weights before biases.</p>" },
  { title: "Edge adapters", background: "<p>On-device systems often generate only a small adapter instead of an entire dense layer, addressing the lesson pitfall about shape and memory.</p>", numbers: "<p>For D5 with $d=64$, hidden 128, and 10 classes, a full generated target has $64\\times128+128\\times10+128+10=9610$ parameters.</p>" },
  { title: "D1 XOR context demo", background: "<p>XOR is small enough to show two contexts emitting two different heads and to inspect every generated parameter.</p>", numbers: "<p>If context 0 emits two weights plus one bias and context 1 does the same, the illustrative generator must output $2\\times(2+1)=6$ target values.</p>" },
  { title: "D5 image-tabular adaptation", background: "<p>For a few hundred image-like examples, generated adapters keep personalization testable on CPU without downloading larger datasets.</p>", numbers: "<p>An illustrative rank-8 adapter emits $64\\times8+8\\times10+8+10=610$ values, a reduction of $1-610/9610=0.937$.</p>" }
];

window.ALLML_CONTENT["6.29"].applications = [
  { title: "Part-whole vision", background: "<p>Capsules model lower visual parts as vectors and route them to upper capsules when their votes agree on a whole object.</p>", numbers: "<p>With initial routing logits equal to zero for two upper capsules, $c_{ij}=\\mathrm{softmax}([0,0])=[0.5,0.5]$.</p>" },
  { title: "Medical imaging", background: "<p>Agreement vectors are useful when the pose or orientation of a finding matters, not just whether a scalar feature activated.</p>", numbers: "<p>For two lower capsules voting $[1,0]$ and $[0.8,0.2]$ to the first upper capsule, the first aggregate is $0.5[1,0]+0.5[0.8,0.2]=[0.9,0.1]$.</p>" },
  { title: "Document layout parsing", background: "<p>Routing can combine tokens, boxes, or fields into higher-level document regions when several parts agree on a structure.</p>", numbers: "<p>Two lower capsules, two upper capsules, and two routing iterations evaluate $2\\times2\\times2=8$ agreement updates in the illustrative setup.</p>" },
  { title: "D1 XOR capsules", background: "<p>A tiny XOR example lets students inspect every coefficient before using capsules on higher-dimensional rungs.</p>", numbers: "<p>The D1 route has $2$ lower capsules and $2$ upper capsules, so each iteration normalizes $2$ rows of $2$ coefficients.</p>" },
  { title: "D5 routing-cost audit", background: "<p>The practical question is whether extra routing iterations improve accuracy enough to justify their compute.</p>", numbers: "<p>With 1078 training rows after a 60/40 split and 10 classes, four iterations use about $4\\times1078\\times10=43120$ relative routing score updates.</p>" }
];

window.ALLML_CONTENT["6.30"].applications = [
  { title: "Neuromorphic sensors", background: "<p>Event cameras and neuromorphic chips communicate changes as spikes, matching the lesson's threshold-event view.</p>", numbers: "<p>With $\\alpha=0.8$, currents $0.4,0.4,0.5$, and $\\tau=1.0$, the third voltage is $0.8\\times0.72+0.5=1.076$, so it fires.</p>" },
  { title: "Low-power edge vision", background: "<p>Spike counts can replace dense activations when the hardware benefits from sparse events instead of continuous multiplies.</p>", numbers: "<p>Eight timesteps over 64 D5 features produce at most $8\\times64=512$ binary events per example before rate aggregation.</p>" },
  { title: "Robotics timing", background: "<p>Robots can use membrane leak to keep short-term temporal state while still reacting to sudden input current.</p>", numbers: "<p>After two currents of 0.4, the hand trace gives $v_2=0.8\\times0.4+0.4=0.72$.</p>" },
  { title: "D1 XOR spike trace", background: "<p>D1 keeps the spike rule hand-checkable before moving to noisy moons and digit images.</p>", numbers: "<p>For currents $[0.4,0.4,0.5,0.4,0.4]$ with reset on firing, the illustrative spike train is $[0,0,1,0,0]$, so the spike count is $1$.</p>" },
  { title: "D5 threshold sweep", background: "<p>The hardest rung shows the scale pitfall: thresholds that are too high or too low can erase class information.</p>", numbers: "<p>An illustrative sweep over thresholds $0.15,0.65,1.50$ tests three operating points while all other model settings stay fixed.</p>" }
];

window.ALLML_CONTENT["6.31"].applications = [
  { title: "AutoML vision baselines", background: "<p>NAS chooses an architecture by validation loss, letting small vision models be selected before expensive training runs.</p>", numbers: "<p>In the D1 table, validation losses $0.69,0.22,0.31$ make $a^*=\\arg\\min L_{val}$ choose the $0.22$ architecture.</p>" },
  { title: "Ads model capacity search", background: "<p>Ad prediction teams can search widths and depths under latency budgets instead of manually guessing a network shape.</p>", numbers: "<p>The notebook's illustrative space tries 4 configurations, so the best reported accuracy costs exactly 4 training trials per rung.</p>" },
  { title: "Medical classifier selection", background: "<p>Clinical models must be chosen by validation behavior, not by training loss that may memorize a small cohort.</p>", numbers: "<p>The D1 pitfall is visible because train losses $0.42,0.05,0.01$ would choose the deep model, while validation losses choose $0.22$.</p>" },
  { title: "D1 XOR architecture audit", background: "<p>XOR is small enough to compare linear, wide, and deep choices without hiding the selection rule.</p>", numbers: "<p>Three D1 candidates mean the selected architecture beats the linear validation loss by $0.69-0.22=0.47$.</p>" },
  { title: "D5 search-cost reporting", background: "<p>On the hardest image-like rung, the result must include both accuracy and the number of searched configurations.</p>", numbers: "<p>With 5 ladder rungs and 4 configurations each, the batch performs $5\\times4=20$ small architecture fits.</p>" }
];

window.ALLML_CONTENT["6.32"].applications = [
  { title: "Model compression", background: "<p>Lottery-ticket pruning searches for a sparse subnetwork that can train well from its original initialization.</p>", numbers: "<p>The D1 vector has 6 weights; a 50% mask keeps 3, so $\\|m\\|_0/\\|\\theta_0\\|_0=3/6=0.5$.</p>" },
  { title: "Edge deployment", background: "<p>Sparse subnetworks reduce storage and multiply counts, which matters for small devices with fixed memory budgets.</p>", numbers: "<p>At illustrative 50% sparsity, a 640-weight D5 linear head keeps $0.5\\times640=320$ weights before biases.</p>" },
  { title: "Vision training diagnostics", background: "<p>Resetting to the original initialization distinguishes a lottery ticket from ordinary post-training compression.</p>", numbers: "<p>If post-training pruning and reset-retraining use the same 50% mask, any accuracy difference comes from reset and retrain rather than from parameter count.</p>" },
  { title: "D1 mask inspection", background: "<p>A tiny MLP or linear head lets students see exactly which initial weights survive magnitude pruning.</p>", numbers: "<p>For $\\theta_0=[0.9,-0.1,0.4,0.02,-0.8,0.3]$, the 50% mask is $[1,0,1,0,1,0]$ and keeps 3 entries.</p>" },
  { title: "D5 sparsity curve", background: "<p>The hardest rung should plot sparsity against accuracy after reset and retrain, not just report a single compressed model.</p>", numbers: "<p>A 64-by-10 D5 head has $64\\times10=640$ weights, so 50% sparsity removes about $640-320=320$ weights.</p>" }
];

window.ALLML_CONTENT["6.33"].applications = [
  { title: "Overparameterized vision", background: "<p>Modern vision models can pass through an interpolation point where training error reaches zero, then improve again as capacity grows.</p>", numbers: "<p>The D1 concept marks width 2 as the first zero-training-error point, dropping train error from $0.5$ at width 1 to $0.0$.</p>" },
  { title: "Education demonstrations", background: "<p>XOR provides a classroom-sized example where capacity, interpolation, and generalization can be separated visually.</p>", numbers: "<p>Sweeping widths $1,2,4,8$ gives 4 capacity settings while keeping the 4 D1 examples fixed.</p>" },
  { title: "Ad model capacity planning", background: "<p>Ads models often sweep hidden widths because test error can rise near interpolation before later capacity helps representation.</p>", numbers: "<p>The notebook uses widths $1,2,4,8,16,32$, a six-point capacity curve for each rung.</p>" },
  { title: "Algorithmic grokking demos", background: "<p>Grokking studies delayed generalization after memorization, so epoch and capacity curves matter more than one final score.</p>", numbers: "<p>If train accuracy is 1.00 and test accuracy is 0.82 at a width, the generalization gap is $1.00-0.82=0.18$.</p>" },
  { title: "D5 payoff curve", background: "<p>The lesson payoff is the curve itself: accuracy versus capacity on the hardest rung exposes whether more parameters helped.</p>", numbers: "<p>Five rungs times six widths yields $5\\times6=30$ small model fits for the reported capacity sweep.</p>" }
];

window.ALLML_CONTENT["6.34"].applications = [
  { title: "Hardware-aware training", background: "<p>Hardware-aware training sizes activations and batches so matrix units stay busy without exceeding memory limits.</p>", numbers: "<p>The lesson memory formula gives $d\\times128\\times4$ bytes; for $d=64$, that is $64\\times128\\times4=32768$ bytes.</p>" },
  { title: "Mixed-precision gradients", background: "<p>Mixed precision often stores activations or gradients in 16-bit formats while updating a 32-bit master copy.</p>", numbers: "<p>With $\\theta_{32}=2.0$, $g=0.003$, and $\\eta=0.1$, the master update is $2.0-0.1\\times0.003=1.9997$.</p>" },
  { title: "Vision inference batches", background: "<p>Batch size and dtype decide whether a model fits in memory, even when the algorithm is unchanged.</p>", numbers: "<p>Changing the activation storage from 4 bytes to 2 bytes changes $32768$ bytes to $64\\times128\\times2=16384$ bytes.</p>" },
  { title: "D1 dtype inspection", background: "<p>D1 tensors are small enough to print scaled fp16 gradients and confirm the unscaled value before any training loop.</p>", numbers: "<p>A loss scale of 1024 maps gradient $0.003$ to $0.003\\times1024=3.072$ before fp16 storage.</p>" },
  { title: "D5 reduced-precision simulation", background: "<p>On CPU, reduced-precision effects can be simulated by quantizing gradients and checking the validation loss.</p>", numbers: "<p>The pitfall sweep tests 4, 8, 10, and 16 bits, so the D5 loss comparison has 4 precision settings.</p>" }
];

