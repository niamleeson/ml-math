/* =====================================================================
   PRACTICE PROBLEMS — MODULE 3 (Deep Learning), HARD set 2.
   Owned ids: dl-neuron, dl-activations, dl-forward-prop, dl-cross-entropy,
              dl-backprop, dl-optimizers, dl-minibatch, dl-init, dl-dropout.
   These are EXTRA harder problems, distinct from set A and hard set 1.
   ===================================================================== */
(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

  /* ============================================================
     dl-neuron — generous set: 5-input dots, full layers, solving
     for inputs/weights, two-layer neuron counts, sign reasoning
     ============================================================ */
  add("dl-neuron", [
    {
      q: `<p>A neuron has weights $w = [3, -2, 1, -1, 0.5]$ and bias $b = 2$. Input $x = [1, 2, -3, 4, 6]$. Find $z = w^\\top x + b$.</p>`,
      steps: [
        { do: `Multiply matching entries: $3\\times1=3$, $-2\\times2=-4$, $1\\times(-3)=-3$, $-1\\times4=-4$, $0.5\\times6=3$.`,
          why: `The dot product pairs each of the five weights with its matching input.` },
        { do: `Sum the products: $3 - 4 - 3 - 4 + 3 = -5$.`,
          why: `Adding all five products gives $w^\\top x = -5$.` },
        { do: `Add the bias: $z = -5 + 2 = -3$.`,
          why: `The pre-activation is the dot product plus the bias.` }
      ],
      answer: `$z = -3$`
    },
    {
      q: `<p>A layer of 3 neurons has weight matrix $W = \\begin{bmatrix} 1 & 2 \\\\ 0 & -1 \\\\ 3 & 1 \\end{bmatrix}$, bias $b = [0, 1, -2]$, input $x = [2, 3]$. Compute the output vector $z = Wx + b$.</p>`,
      steps: [
        { do: `Neuron 1: $1\\times2 + 2\\times3 + 0 = 2 + 6 + 0 = 8$.`,
          why: `Row 1 of $W$ dotted with $x$, plus the first bias entry.` },
        { do: `Neuron 2: $0\\times2 + (-1)\\times3 + 1 = 0 - 3 + 1 = -2$.`,
          why: `Row 2 dotted with $x$, plus the second bias entry.` },
        { do: `Neuron 3: $3\\times2 + 1\\times3 + (-2) = 6 + 3 - 2 = 7$.`,
          why: `Row 3 dotted with $x$, plus the third bias entry.` }
      ],
      answer: `$z = [8, -2, 7]$`
    },
    {
      q: `<p>A neuron with weights $w = [2, -1, 3]$ and bias $b = 1$ outputs $z = 12$. The first two inputs are $x_1 = 2$ and $x_2 = 3$. Find the third input $x_3$.</p>`,
      steps: [
        { do: `Write $z$: $2\\times2 + (-1)\\times3 + 3 x_3 + 1 = 12$.`,
          why: `Substitute the known inputs and bias, leaving $x_3$ unknown.` },
        { do: `Simplify constants: $4 - 3 + 1 + 3 x_3 = 2 + 3 x_3 = 12$.`,
          why: `Combine the known numeric terms $4 - 3 + 1 = 2$.` },
        { do: `Solve: $3 x_3 = 10$, so $x_3 = \\tfrac{10}{3} \\approx 3.333$.`,
          why: `Isolate $x_3$ by subtracting 2 and dividing by 3.` }
      ],
      answer: `$x_3 = \\tfrac{10}{3} \\approx 3.333$`
    },
    {
      q: `<p>A neuron has weights $w = [w_1, w_2]$ and bias $b = 1$. For input $x = [1, 1]$ it gives $z = 4$, and for input $x = [2, 0]$ it gives $z = 5$. Find $w_1$ and $w_2$.</p>`,
      steps: [
        { do: `From $x=[2,0]$: $2 w_1 + 0 + 1 = 5$, so $2 w_1 = 4$, $w_1 = 2$.`,
          why: `The second input is 0, so this equation involves only $w_1$.` },
        { do: `From $x=[1,1]$: $w_1 + w_2 + 1 = 4$, so $2 + w_2 + 1 = 4$.`,
          why: `Substitute $w_1 = 2$ into the first equation.` },
        { do: `Solve: $w_2 = 4 - 3 = 1$.`,
          why: `Isolate $w_2$ to finish the system.` }
      ],
      answer: `$w_1 = 2,\\; w_2 = 1$`
    },
    {
      q: `<p>A fully-connected layer maps 4 inputs to 6 neurons. Each neuron has one weight per input plus one bias. How many learnable parameters does the layer have?</p>`,
      steps: [
        { do: `Weights: $4 \\text{ inputs} \\times 6 \\text{ neurons} = 24$ weights.`,
          why: `Every neuron connects to every input, so the weight matrix is $6 \\times 4$.` },
        { do: `Biases: one per neuron $= 6$.`,
          why: `Each neuron adds its own bias.` },
        { do: `Total: $24 + 6 = 30$ parameters.`,
          why: `Parameters are weights plus biases.` }
      ],
      answer: `$30$ parameters`
    },
    {
      q: `<p>A neuron has weights $w = [1, -1, 2]$, bias $b = 0$. For what value of the third input $x_3$ is the pre-activation exactly zero, given $x_1 = 3$ and $x_2 = 1$?</p>`,
      steps: [
        { do: `Pre-activation: $z = 1\\times3 + (-1)\\times1 + 2 x_3 + 0 = 2 + 2 x_3$.`,
          why: `Compute the known part of the dot product, keeping $x_3$ symbolic.` },
        { do: `Set $z = 0$: $2 + 2 x_3 = 0$.`,
          why: `We want the input that makes the neuron's pre-activation vanish.` },
        { do: `Solve: $x_3 = -1$.`,
          why: `Subtract 2 and divide by 2.` }
      ],
      answer: `$x_3 = -1$`
    },
    {
      q: `<p>Two neurons share input $x = [4, -2]$. Neuron A: $w_A = [1, 3]$, $b_A = 0$. Neuron B: $w_B = [2, 1]$, $b_B = c$. For what bias $c$ do both neurons have the same pre-activation?</p>`,
      steps: [
        { do: `Neuron A: $1\\times4 + 3\\times(-2) + 0 = 4 - 6 = -2$.`,
          why: `Compute A's pre-activation, which is fixed.` },
        { do: `Neuron B: $2\\times4 + 1\\times(-2) + c = 8 - 2 + c = 6 + c$.`,
          why: `Compute B's pre-activation in terms of $c$.` },
        { do: `Set equal: $6 + c = -2$, so $c = -8$.`,
          why: `Match the two pre-activations and solve for the bias.` }
      ],
      answer: `$c = -8$`
    },
    {
      q: `<p>A neuron's weights are $w = [0.2, 0.5, -0.3]$ and bias $b = 0.1$. The inputs are doubled from their original values $x' = [1, 2, 4]$ to $x = [2, 4, 8]$. Find the new pre-activation $z$.</p>`,
      steps: [
        { do: `Doubled inputs: $x = [2, 4, 8]$.`,
          why: `Each original input $x'$ is multiplied by 2.` },
        { do: `Dot product: $0.2\\times2 + 0.5\\times4 + (-0.3)\\times8 = 0.4 + 2.0 - 2.4 = 0$.`,
          why: `Multiply each weight by the doubled input and sum.` },
        { do: `Add bias: $z = 0 + 0.1 = 0.1$.`,
          why: `Add the bias to finish; note the bias is not affected by input scaling.` }
      ],
      answer: `$z = 0.1$`
    },
    {
      q: `<p>A neuron has weights $w = [3, 4]$ (and bias $b = 0$). For a unit input vector $x$ with $\\|x\\| = 1$, the dot product $w^\\top x$ is largest when $x$ points along $w$. What is this maximum value? (Hint: it is $\\|w\\|$.)</p>`,
      steps: [
        { do: `Compute $\\|w\\| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.`,
          why: `The dot product $w^\\top x = \\|w\\|\\,\\|x\\|\\cos\\theta$; with $\\|x\\|=1$ it maxes at $\\cos\\theta=1$.` },
        { do: `Maximum dot product $= \\|w\\| \\times 1 = 5$.`,
          why: `The neuron responds most strongly to an input aligned with its weight vector.` }
      ],
      answer: `maximum $= 5$`
    },
    {
      q: `<p>A 2-neuron layer feeds a single output neuron, all linear (no activation). Hidden layer $W^{[1]} = \\begin{bmatrix} 1 & 0 \\\\ 2 & -1 \\end{bmatrix}$, $b^{[1]} = [1, 0]$. Output neuron $W^{[2]} = [3, 2]$, $b^{[2]} = -1$. For input $x = [2, 1]$, find the final pre-activation.</p>`,
      steps: [
        { do: `Hidden 1: $1\\times2 + 0\\times1 + 1 = 3$. Hidden 2: $2\\times2 + (-1)\\times1 + 0 = 3$.`,
          why: `Each hidden neuron computes its dot product plus bias; linear means no squish.` },
        { do: `Output: $3\\times3 + 2\\times3 + (-1) = 9 + 6 - 1 = 14$.`,
          why: `The output neuron dot-products its weights with the hidden values, then adds its bias.` }
      ],
      answer: `output $= 14$`
    },
    {
      q: `<p>A neuron has weights $w = [a, a, a]$ (all equal) and bias $b = 0$. For input $x = [2, -1, 5]$ the output is $z = 18$. Find $a$.</p>`,
      steps: [
        { do: `Factor out $a$: $z = a(2 + (-1) + 5) = a \\times 6$.`,
          why: `Equal weights let us factor, leaving the sum of the inputs.` },
        { do: `Solve: $6a = 18$, so $a = 3$.`,
          why: `Divide both sides by 6.` }
      ],
      answer: `$a = 3$`
    },
    {
      q: `<p>A network has layers of sizes $5 \\to 4 \\to 3 \\to 1$ (input has 5 features). Counting weights only (ignore biases), how many weights are in the whole network?</p>`,
      steps: [
        { do: `Layer 1 ($5\\to4$): $5 \\times 4 = 20$ weights.`,
          why: `Each of 4 neurons connects to all 5 inputs.` },
        { do: `Layer 2 ($4\\to3$): $4 \\times 3 = 12$ weights.`,
          why: `Each of 3 neurons connects to all 4 previous activations.` },
        { do: `Layer 3 ($3\\to1$): $3 \\times 1 = 3$ weights. Total: $20 + 12 + 3 = 35$.`,
          why: `Sum the weights across all three weight matrices.` }
      ],
      answer: `$35$ weights`
    },
    {
      q: `<p>A neuron computes $z = w^\\top x + b$ with $w = [2, -1]$, $b = 3$. The input $x = [t, 2t]$ lies on a line through the origin (parameter $t$). For what $t$ is $z = 0$?</p>`,
      steps: [
        { do: `Substitute: $z = 2 t + (-1)(2t) + 3 = 2t - 2t + 3 = 3$.`,
          why: `Plug the parametrized input into the neuron equation and simplify.` },
        { do: `Observe $z = 3$ for every $t$, never 0.`,
          why: `The input terms cancel, so the pre-activation is constant at the bias value.` }
      ],
      answer: `no such $t$ ($z = 3$ always)`
    },
    {
      q: `<p>A layer has weight matrix $W = \\begin{bmatrix} 1 & -1 & 2 \\\\ 0 & 1 & -1 \\end{bmatrix}$ and bias $b = [1, -2]$. Find the output $z = Wx + b$ for input $x = [3, 1, 2]$.</p>`,
      steps: [
        { do: `Neuron 1: $1\\times3 + (-1)\\times1 + 2\\times2 + 1 = 3 - 1 + 4 + 1 = 7$.`,
          why: `Row 1 of $W$ dotted with the 3-vector $x$, plus the first bias.` },
        { do: `Neuron 2: $0\\times3 + 1\\times1 + (-1)\\times2 + (-2) = 0 + 1 - 2 - 2 = -3$.`,
          why: `Row 2 dotted with $x$, plus the second bias.` }
      ],
      answer: `$z = [7, -3]$`
    }
  ]);

  /* ============================================================
     dl-activations — derivative chains, softmax, numeric stability,
     activation comparisons, multi-stage squishes
     ============================================================ */
  add("dl-activations", [
    {
      q: `<p>Softmax over scores $[1, 2, 0]$. Use $e^{1}\\approx2.718$, $e^{2}\\approx7.389$, $e^{0}=1$. Find the probability of the first class (round to 3 decimals).</p>`,
      steps: [
        { do: `Exponentiate each score: $e^1 = 2.718$, $e^2 = 7.389$, $e^0 = 1$.`,
          why: `Softmax raises $e$ to each score so all values become positive.` },
        { do: `Sum: $2.718 + 7.389 + 1 = 11.107$.`,
          why: `The denominator of softmax normalizes the exponentials.` },
        { do: `First probability: $\\frac{2.718}{11.107} \\approx 0.245$.`,
          why: `Each softmax output is its exponential divided by the total.` }
      ],
      answer: `$\\approx 0.245$`
    },
    {
      q: `<p>Softmax is shift-invariant: subtracting the max score from all scores does not change the output. For scores $[10, 11, 9]$, subtract the max (11) to get stabilized scores. List them.</p>`,
      steps: [
        { do: `Find the max: $\\max(10, 11, 9) = 11$.`,
          why: `Subtracting the max keeps exponentials small and avoids overflow.` },
        { do: `Subtract from each: $[10-11,\\, 11-11,\\, 9-11] = [-1, 0, -2]$.`,
          why: `Shifting all scores by the same constant leaves softmax unchanged.` }
      ],
      answer: `$[-1, 0, -2]$`
    },
    {
      q: `<p>The sigmoid derivative $\\sigma'(z) = \\sigma(z)(1-\\sigma(z))$ is largest at $z=0$. Find that maximum value.</p>`,
      steps: [
        { do: `At $z=0$, $\\sigma(0) = 0.5$.`,
          why: `Sigmoid passes through $0.5$ at the origin.` },
        { do: `Derivative: $0.5\\times(1-0.5) = 0.5\\times0.5 = 0.25$.`,
          why: `The product $\\sigma(1-\\sigma)$ peaks when $\\sigma=0.5$, giving the steepest slope.` }
      ],
      answer: `$\\sigma'(0) = 0.25$`
    },
    {
      q: `<p>Chain a sigmoid into a ReLU. Start at $z = 2$ with $\\sigma(2)\\approx0.881$. Apply ReLU to the sigmoid output. What is the final value?</p>`,
      steps: [
        { do: `Sigmoid: $\\sigma(2) \\approx 0.881$.`,
          why: `First stage squishes 2 into the range $(0,1)$.` },
        { do: `ReLU: $\\max(0, 0.881) = 0.881$.`,
          why: `Sigmoid outputs are always positive, so ReLU passes them through unchanged.` }
      ],
      answer: `$\\approx 0.881$`
    },
    {
      q: `<p>A neuron uses tanh. It computes $z = 0.5$ with $\\tanh(0.5)\\approx0.462$. The tanh derivative is $1 - \\tanh^2(z)$. Backprop sends upstream gradient $\\frac{\\partial L}{\\partial a} = 3$. Find $\\frac{\\partial L}{\\partial z}$ (round to 3 decimals).</p>`,
      steps: [
        { do: `Local slope: $1 - (0.462)^2 = 1 - 0.2134 = 0.7866$.`,
          why: `The tanh derivative uses the squared activation value.` },
        { do: `Chain: $\\frac{\\partial L}{\\partial z} = 3 \\times 0.7866 \\approx 2.360$.`,
          why: `Multiply the upstream gradient by the local tanh slope.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial z} \\approx 2.360$`
    },
    {
      q: `<p>Two ReLU neurons feed a sum. Neuron A: $z_A = 4$. Neuron B: $z_B = -1$. The summed output is $\\text{ReLU}(z_A) + \\text{ReLU}(z_B)$. Find it, then the derivative of the sum w.r.t. $z_A$ and w.r.t. $z_B$.</p>`,
      steps: [
        { do: `Outputs: $\\text{ReLU}(4)=4$, $\\text{ReLU}(-1)=0$, sum $= 4$.`,
          why: `ReLU keeps the positive and zeros the negative.` },
        { do: `Slope w.r.t. $z_A$: $1$ (since $z_A>0$). Slope w.r.t. $z_B$: $0$ (since $z_B<0$).`,
          why: `ReLU's derivative is 1 on the positive side and 0 on the negative side.` }
      ],
      answer: `sum $= 4$; $\\partial/\\partial z_A = 1$, $\\partial/\\partial z_B = 0$`
    },
    {
      q: `<p>The "swish" activation is $z\\,\\sigma(z)$. Evaluate it at $z = 2$ using $\\sigma(2)\\approx0.881$ (round to 3 decimals).</p>`,
      steps: [
        { do: `Compute the sigmoid: $\\sigma(2)\\approx0.881$.`,
          why: `Swish multiplies the input by its own sigmoid.` },
        { do: `Multiply: $2 \\times 0.881 = 1.762$.`,
          why: `Swish $= z\\,\\sigma(z)$, a smooth ReLU-like curve.` }
      ],
      answer: `$\\approx 1.762$`
    },
    {
      q: `<p>For binary classification, a sigmoid output $a = 0.9$ is converted to a hard label by thresholding at $0.5$. What is the predicted class, and what is the sigmoid slope $a(1-a)$ there?</p>`,
      steps: [
        { do: `Threshold: $0.9 > 0.5$, so predicted class $= 1$.`,
          why: `Outputs above the threshold map to the positive class.` },
        { do: `Slope: $0.9\\times(1-0.9) = 0.9\\times0.1 = 0.09$.`,
          why: `Near the saturated end, the sigmoid slope is small, so gradients shrink.` }
      ],
      answer: `class $= 1$, slope $= 0.09$`
    },
    {
      q: `<p>Softmax over $[2, 2, 2]$ (all equal scores) for 3 classes. What is each probability, without any arithmetic on exponentials?</p>`,
      steps: [
        { do: `Equal scores give equal exponentials, so equal probabilities.`,
          why: `Softmax depends only on score differences; all-equal scores are symmetric.` },
        { do: `Each probability $= \\frac{1}{3} \\approx 0.333$.`,
          why: `Three equal probabilities must sum to 1, giving $1/3$ each.` }
      ],
      answer: `$\\tfrac{1}{3}$ each $\\approx 0.333$`
    },
    {
      q: `<p>ReLU vs Leaky ReLU on the same negative input. For $z = -5$, give the ReLU output and the Leaky ReLU (slope $0.01$) output, then state which neuron can still receive a gradient.</p>`,
      steps: [
        { do: `ReLU: $\\max(0, -5) = 0$, local slope $0$.`,
          why: `Plain ReLU is flat for negatives, blocking the gradient (dead neuron).` },
        { do: `Leaky ReLU: $0.01\\times(-5) = -0.05$, local slope $0.01$.`,
          why: `The small slope lets a tiny gradient flow, keeping the neuron alive.` },
        { do: `Only the Leaky-ReLU neuron still receives a gradient.`,
          why: `A nonzero local slope is required for the weight to update.` }
      ],
      answer: `ReLU $=0$ (dead); Leaky $=-0.05$ (alive)`
    },
    {
      q: `<p>A 2-stage tanh: apply $\\tanh$ twice starting from $z = 1$. Use $\\tanh(1)\\approx0.762$ and $\\tanh(0.762)\\approx0.642$. What is the final value?</p>`,
      steps: [
        { do: `First tanh: $\\tanh(1)\\approx0.762$.`,
          why: `Stage 1 squishes 1 into $(-1,1)$.` },
        { do: `Second tanh: $\\tanh(0.762)\\approx0.642$.`,
          why: `Stage 2 takes the first output as its input and squishes again.` }
      ],
      answer: `$\\approx 0.642$`
    },
    {
      q: `<p>The softmax cross-entropy gradient for the true class simplifies to $p_{\\text{true}} - 1$ on that class's logit. If the true-class probability is $p = 0.6$, find this gradient component.</p>`,
      steps: [
        { do: `Plug in: $p_{\\text{true}} - 1 = 0.6 - 1$.`,
          why: `For the correct class, softmax + cross-entropy gives gradient $p - 1$ on its logit.` },
        { do: `Compute: $0.6 - 1 = -0.4$.`,
          why: `A negative gradient pushes the correct-class logit up.` }
      ],
      answer: `$-0.4$`
    }
  ]);

  /* ============================================================
     dl-forward-prop — deeper passes, matrix layers, softmax heads,
     parameter counting through a pass, residual connections
     ============================================================ */
  add("dl-forward-prop", [
    {
      q: `<p>3-layer net, ReLU on hidden layers, linear output. Input $x = [1, 2]$. $W^{[1]} = \\begin{bmatrix} 1 & 1 \\\\ -1 & 2 \\end{bmatrix}$, $b^{[1]} = [0, -1]$. $W^{[2]} = \\begin{bmatrix} 2 & 0 \\\\ 1 & -1 \\end{bmatrix}$, $b^{[2]} = [1, 1]$. Output: $W^{[3]} = [1, 2]$, $b^{[3]} = 0$. Find the output.</p>`,
      steps: [
        { do: `Layer 1 pre: $z^{[1]}_1 = 1\\times1 + 1\\times2 + 0 = 3$; $z^{[1]}_2 = -1\\times1 + 2\\times2 - 1 = 2$. ReLU: $a^{[1]} = [3, 2]$.`,
          why: `Each hidden-1 neuron computes its dot product plus bias, then ReLU keeps both positives.` },
        { do: `Layer 2 pre: $z^{[2]}_1 = 2\\times3 + 0\\times2 + 1 = 7$; $z^{[2]}_2 = 1\\times3 + (-1)\\times2 + 1 = 2$. ReLU: $a^{[2]} = [7, 2]$.`,
          why: `Hidden-1 activations feed hidden-2; both pre-activations are positive.` },
        { do: `Output: $1\\times7 + 2\\times2 + 0 = 7 + 4 = 11$.`,
          why: `Linear output dot-products the final hidden activations with the output weights.` }
      ],
      answer: `output $= 11$`
    },
    {
      q: `<p>A net ends in a softmax over 3 classes. The final logits are $[1, 3, 1]$. Use $e^{1}\\approx2.718$ and $e^{3}\\approx20.086$. Find the predicted probability of class 2 (the largest logit), rounded to 3 decimals.</p>`,
      steps: [
        { do: `Exponentiate: $e^1=2.718$, $e^3=20.086$, $e^1=2.718$.`,
          why: `Softmax exponentiates each logit.` },
        { do: `Sum: $2.718 + 20.086 + 2.718 = 25.522$.`,
          why: `The denominator normalizes the exponentials into probabilities.` },
        { do: `Class 2 probability: $\\frac{20.086}{25.522} \\approx 0.787$.`,
          why: `The largest logit dominates the softmax output.` }
      ],
      answer: `$\\approx 0.787$`
    },
    {
      q: `<p>4-layer scalar net, all ReLU, all weights $w = 0.5$, all biases $b = 1$. Input $x = 4$. Find $a^{[4]}$.</p>`,
      steps: [
        { do: `Layer 1: $z = 0.5\\times4 + 1 = 3$, $a^{[1]} = 3$.`,
          why: `Apply weight, bias, then ReLU (positive passes through).` },
        { do: `Layer 2: $z = 0.5\\times3 + 1 = 2.5$, $a^{[2]} = 2.5$. Layer 3: $z = 0.5\\times2.5 + 1 = 2.25$, $a^{[3]} = 2.25$.`,
          why: `Each layer halves the prior activation and adds 1; all stay positive.` },
        { do: `Layer 4: $z = 0.5\\times2.25 + 1 = 2.125$, $a^{[4]} = 2.125$.`,
          why: `The values converge toward the fixed point $2$ but stop after 4 layers.` }
      ],
      answer: `$a^{[4]} = 2.125$`
    },
    {
      q: `<p>Batch forward pass with 2 examples and a 2-neuron ReLU layer. Inputs $x^{(1)} = [1, 1]$, $x^{(2)} = [2, -1]$. $W = \\begin{bmatrix} 1 & -1 \\\\ 0 & 2 \\end{bmatrix}$, $b = [0, 1]$. Find both output vectors.</p>`,
      steps: [
        { do: `Example 1: $z_1 = 1\\times1 + (-1)\\times1 + 0 = 0$; $z_2 = 0\\times1 + 2\\times1 + 1 = 3$. ReLU: $[0, 3]$.`,
          why: `Each example flows through the same weights; ReLU keeps the nonnegative values.` },
        { do: `Example 2: $z_1 = 1\\times2 + (-1)\\times(-1) + 0 = 3$; $z_2 = 0\\times2 + 2\\times(-1) + 1 = -1$. ReLU: $[3, 0]$.`,
          why: `Shared parameters, different input; the second neuron's pre-activation is negative here.` }
      ],
      answer: `$[0, 3]$ and $[3, 0]$`
    },
    {
      q: `<p>A net has architecture $3 \\to 4 \\to 2$ (input 3 features, hidden 4, output 2). Counting weights and biases, how many parameters does a full forward pass use?</p>`,
      steps: [
        { do: `Layer 1: $3\\times4 = 12$ weights $+ 4$ biases $= 16$.`,
          why: `The first weight matrix is $4\\times3$ with one bias per hidden neuron.` },
        { do: `Layer 2: $4\\times2 = 8$ weights $+ 2$ biases $= 10$.`,
          why: `The second weight matrix is $2\\times4$ with one bias per output neuron.` },
        { do: `Total: $16 + 10 = 26$ parameters.`,
          why: `Every parameter is touched during the forward pass.` }
      ],
      answer: `$26$ parameters`
    },
    {
      q: `<p>Residual (skip) connection. A block computes $a = \\text{ReLU}(Wx + b)$ then adds the input: output $= a + x$. For scalar $x = 3$, $W = -2$, $b = 4$, find the block output.</p>`,
      steps: [
        { do: `Inner pre-activation: $z = -2\\times3 + 4 = -2$, $a = \\text{ReLU}(-2) = 0$.`,
          why: `The transformed branch produces 0 here because the pre-activation is negative.` },
        { do: `Add the skip: output $= a + x = 0 + 3 = 3$.`,
          why: `The residual connection passes the input straight through, so the block can never lose the signal.` }
      ],
      answer: `output $= 3$`
    },
    {
      q: `<p>A 2-neuron hidden layer (ReLU) feeds a 2-neuron output layer (linear). Input $x = [2, 1]$. $W^{[1]} = \\begin{bmatrix} 1 & 1 \\\\ -2 & 1 \\end{bmatrix}$, $b^{[1]} = [-1, 2]$. $W^{[2]} = \\begin{bmatrix} 1 & -1 \\\\ 0 & 2 \\end{bmatrix}$, $b^{[2]} = [0, 1]$. Find the output vector.</p>`,
      steps: [
        { do: `Hidden pre: $z^{[1]}_1 = 1\\times2 + 1\\times1 - 1 = 2$; $z^{[1]}_2 = -2\\times2 + 1\\times1 + 2 = -1$. ReLU: $a^{[1]} = [2, 0]$.`,
          why: `Compute both hidden pre-activations; the second is negative so ReLU zeros it.` },
        { do: `Output 1: $1\\times2 + (-1)\\times0 + 0 = 2$. Output 2: $0\\times2 + 2\\times0 + 1 = 1$.`,
          why: `Each output neuron dot-products the hidden activations with its weights, plus bias.` }
      ],
      answer: `output $= [2, 1]$`
    },
    {
      q: `<p>Forward pass with sigmoid hidden + sigmoid output. Scalar input $x = 0$. Layer 1: $w=4$, $b=0$, sigmoid. Layer 2: $w=2$, $b=-1$, sigmoid. Use $\\sigma(0) = 0.5$. Find $a^{[2]}$.</p>`,
      steps: [
        { do: `Layer 1: $z = 4\\times0 + 0 = 0$, $a^{[1]} = \\sigma(0) = 0.5$.`,
          why: `Sigmoid of 0 is exactly one half.` },
        { do: `Layer 2: $z = 2\\times0.5 - 1 = 0$, $a^{[2]} = \\sigma(0) = 0.5$.`,
          why: `The pre-activation again lands at 0, so the output is $0.5$.` }
      ],
      answer: `$a^{[2]} = 0.5$`
    },
    {
      q: `<p>A 3-layer scalar net, all ReLU, weights $w = 3$ each, biases $b = -1$ each, input $x = 1$. Find $a^{[3]}$.</p>`,
      steps: [
        { do: `Layer 1: $z = 3\\times1 - 1 = 2$, $a^{[1]} = 2$.`,
          why: `Apply weight, bias, ReLU; result is positive.` },
        { do: `Layer 2: $z = 3\\times2 - 1 = 5$, $a^{[2]} = 5$. Layer 3: $z = 3\\times5 - 1 = 14$, $a^{[3]} = 14$.`,
          why: `Each layer triples and subtracts 1; signals grow quickly.` }
      ],
      answer: `$a^{[3]} = 14$`
    },
    {
      q: `<p>A net's output layer has 4 classes with logits $[0, 0, 0, \\ln 7]$ where $e^{\\ln 7} = 7$. Find the softmax probability of the 4th class (the one with logit $\\ln 7$).</p>`,
      steps: [
        { do: `Exponentiate: $e^0 = 1$ (three times), $e^{\\ln 7} = 7$.`,
          why: `Softmax exponentiates each logit; $e^{\\ln 7}$ is exactly 7.` },
        { do: `Sum: $1 + 1 + 1 + 7 = 10$.`,
          why: `Normalize over all four exponentials.` },
        { do: `4th probability: $\\frac{7}{10} = 0.7$.`,
          why: `The largest logit gets the largest share.` }
      ],
      answer: `$0.7$`
    },
    {
      q: `<p>A 2-neuron ReLU layer outputs $a^{[1]} = [3, 0]$. The next layer has $W^{[2]} = \\begin{bmatrix} 1 & 2 \\\\ -1 & 1 \\\\ 0 & 1 \\end{bmatrix}$ (3 neurons), $b^{[2]} = [0, 1, -2]$, linear. Find the 3-vector output.</p>`,
      steps: [
        { do: `Neuron 1: $1\\times3 + 2\\times0 + 0 = 3$. Neuron 2: $-1\\times3 + 1\\times0 + 1 = -2$.`,
          why: `Each output neuron dot-products with $a^{[1]} = [3,0]$ and adds its bias.` },
        { do: `Neuron 3: $0\\times3 + 1\\times0 - 2 = -2$.`,
          why: `The third neuron only receives the (zero) second activation plus its bias.` }
      ],
      answer: `output $= [3, -2, -2]$`
    }
  ]);

  /* ============================================================
     dl-cross-entropy — multi-class batches, gradients, comparisons,
     perplexity-style log reasoning, label smoothing
     ============================================================ */
  add("dl-cross-entropy", [
    {
      q: `<p>Multi-class cross-entropy over a batch of 2 examples, 3 classes each. True classes: example 1 is class 1, example 2 is class 3. Softmax outputs: example 1 $[0.5, 0.3, 0.2]$, example 2 $[0.1, 0.2, 0.7]$. Use $\\log(0.5)\\approx-0.693$, $\\log(0.7)\\approx-0.357$. Find the average loss.</p>`,
      steps: [
        { do: `Example 1 true-class prob $= 0.5$: $L_1 = -\\log(0.5) = 0.693$.`,
          why: `Multi-class CE is $-\\log$ of the predicted probability for the correct class only.` },
        { do: `Example 2 true-class prob $= 0.7$: $L_2 = -\\log(0.7) = 0.357$.`,
          why: `Class 3 is correct for example 2, with probability $0.7$.` },
        { do: `Average: $\\frac{0.693 + 0.357}{2} = \\frac{1.050}{2} = 0.525$.`,
          why: `Batch loss is the mean of per-example losses.` }
      ],
      answer: `average loss $\\approx 0.525$`
    },
    {
      q: `<p>The full softmax cross-entropy gradient on logit $j$ is $p_j - y_j$, where $y_j$ is 1 for the true class and 0 otherwise. Softmax outputs are $[0.2, 0.5, 0.3]$ and the true class is class 2. Find the gradient vector over all 3 logits.</p>`,
      steps: [
        { do: `True-class indicator: $y = [0, 1, 0]$.`,
          why: `Only the correct class (class 2) has $y = 1$.` },
        { do: `Subtract: $[0.2-0,\\, 0.5-1,\\, 0.3-0] = [0.2, -0.5, 0.3]$.`,
          why: `The gradient is "prediction minus truth" component-wise.` }
      ],
      answer: `gradient $= [0.2, -0.5, 0.3]$`
    },
    {
      q: `<p>Cross-entropy and bits. For a uniform guess over $K = 4$ classes, the loss is $-\\log(1/4) = \\log 4$. Use $\\log 4 \\approx 1.386$ and $\\log 2 \\approx 0.693$. What loss does a "no information" model achieve, in nats and in bits?</p>`,
      steps: [
        { do: `Natural-log loss: $-\\log(1/4) = \\log 4 \\approx 1.386$ nats.`,
          why: `A uniform model assigns $1/4$ to every class, so the loss is $-\\log(1/4)$.` },
        { do: `Convert to bits: $\\frac{1.386}{0.693} = 2$ bits.`,
          why: `Dividing nats by $\\log 2$ converts to bits; 4 equally likely classes need exactly 2 bits.` }
      ],
      answer: `loss $\\approx 1.386$ nats $= 2$ bits`
    },
    {
      q: `<p>Weighted (class-imbalanced) binary cross-entropy weights the positive class by 3. For one positive example ($y=1$) with prediction $z = 0.5$, find the weighted loss. Use $\\log(0.5)\\approx-0.693$.</p>`,
      steps: [
        { do: `Unweighted loss: $-\\log(0.5) = 0.693$.`,
          why: `Standard CE for the positive class is $-\\log z$.` },
        { do: `Apply the class weight 3: $3 \\times 0.693 = 2.079$.`,
          why: `Weighting the positive class makes its mistakes count more, helping with imbalance.` }
      ],
      answer: `weighted loss $\\approx 2.079$`
    },
    {
      q: `<p>A model improves over training. At epoch 1 a positive example ($y=1$) has $z = 0.4$; at epoch 10 it has $z = 0.9$. Use $\\log(0.4)\\approx-0.916$, $\\log(0.9)\\approx-0.105$. What fraction of the original loss remains at epoch 10?</p>`,
      steps: [
        { do: `Epoch 1 loss: $-\\log(0.4) = 0.916$. Epoch 10 loss: $-\\log(0.9) = 0.105$.`,
          why: `Both are $-\\log z$ since $y=1$.` },
        { do: `Fraction remaining: $\\frac{0.105}{0.916} \\approx 0.115$.`,
          why: `About 11.5% of the original loss is left; the rest was driven down.` }
      ],
      answer: `$\\approx 0.115$ (about 11.5%)`
    },
    {
      q: `<p>Label smoothing replaces the hard target $y=1$ with $0.9$ (the other class gets $0.1$). For predictions $[0.8, 0.2]$ and smoothed target $[0.9, 0.1]$, the loss is $-[0.9\\log(0.8) + 0.1\\log(0.2)]$. Use $\\log(0.8)\\approx-0.223$, $\\log(0.2)\\approx-1.609$. Find it.</p>`,
      steps: [
        { do: `First term: $0.9\\times(-0.223) = -0.2007$.`,
          why: `Each class contributes its smoothed target times the log of its predicted probability.` },
        { do: `Second term: $0.1\\times(-1.609) = -0.1609$.`,
          why: `The minority target weight on the other class.` },
        { do: `Loss: $-(-0.2007 - 0.1609) = 0.3616 \\approx 0.362$.`,
          why: `Negate the sum; label smoothing discourages overconfidence.` }
      ],
      answer: `loss $\\approx 0.362$`
    },
    {
      q: `<p>Cross-entropy on a batch where one prediction is exactly correct and confident. Three positive examples ($y=1$) with $z = [1.0, 0.5, 0.5]$. Use $\\log(1)=0$, $\\log(0.5)\\approx-0.693$. Find the total (summed) loss.</p>`,
      steps: [
        { do: `Example 1: $-\\log(1) = 0$.`,
          why: `A perfectly confident correct prediction has zero loss.` },
        { do: `Examples 2 and 3: $-\\log(0.5) = 0.693$ each.`,
          why: `Both are unsure 50-50 predictions on the positive class.` },
        { do: `Sum: $0 + 0.693 + 0.693 = 1.386$.`,
          why: `Total loss adds the per-example losses.` }
      ],
      answer: `total loss $\\approx 1.386$`
    },
    {
      q: `<p>Compare two confident-wrong cases ($y=1$). Model A predicts $z = 0.1$, Model B predicts $z = 0.01$. Use $\\log(0.1)\\approx-2.303$, $\\log(0.01)\\approx-4.605$. How many times larger is B's loss than A's?</p>`,
      steps: [
        { do: `A's loss: $-\\log(0.1) = 2.303$. B's loss: $-\\log(0.01) = 4.605$.`,
          why: `Both use $-\\log z$ for the positive class.` },
        { do: `Ratio: $\\frac{4.605}{2.303} \\approx 2.0$.`,
          why: `Pushing confidence ten times further into the wrong answer doubles the loss.` }
      ],
      answer: `about $2\\times$ larger`
    },
    {
      q: `<p>Cross-entropy bottoms out at the data's entropy, not zero. For a true distribution $[0.5, 0.5]$, its entropy is $-2\\times(0.5\\log 0.5) = \\log 2 \\approx 0.693$. If the model matches it perfectly (KL $= 0$), what cross-entropy does it achieve?</p>`,
      steps: [
        { do: `Perfect match means KL-divergence $= 0$.`,
          why: `KL is zero when the predicted distribution equals the true one.` },
        { do: `Cross-entropy $=$ entropy $+ 0 = 0.693$.`,
          why: `Cross-entropy cannot go below the true distribution's entropy.` }
      ],
      answer: `cross-entropy $\\approx 0.693$`
    },
    {
      q: `<p>A binary classifier's logit (pre-sigmoid) is $z = 0$, giving $\\sigma(0) = 0.5$. The true label is $y = 1$. Using the combined gradient $\\frac{\\partial L}{\\partial z} = a - y$, find the gradient, and state which direction $z$ should move.</p>`,
      steps: [
        { do: `Gradient: $a - y = 0.5 - 1 = -0.5$.`,
          why: `The clean sigmoid + CE gradient is prediction minus truth.` },
        { do: `Since the gradient is negative, gradient descent moves $z$ up (toward predicting 1).`,
          why: `Descent steps opposite the gradient, so a negative gradient increases $z$.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial z} = -0.5$; $z$ increases`
    },
    {
      q: `<p>Per-token language-model loss. A model assigns probability $0.25$ to the correct next word. The cross-entropy for this token is $-\\log(0.25)$. Use $\\log(0.25)\\approx-1.386$. Find the loss and the perplexity $e^{\\text{loss}}$.</p>`,
      steps: [
        { do: `Loss: $-\\log(0.25) = 1.386$.`,
          why: `Per-token CE is $-\\log$ of the probability given to the true word.` },
        { do: `Perplexity: $e^{1.386} = \\frac{1}{0.25} = 4$.`,
          why: `Perplexity is $e$ raised to the loss; here it equals the reciprocal probability, like choosing among 4 equally likely words.` }
      ],
      answer: `loss $\\approx 1.386$, perplexity $= 4$`
    }
  ]);

  /* ============================================================
     dl-backprop — 3-layer chains, fan-out sums, full numeric passes,
     gradient w.r.t. multiple weights / inputs, vanishing gradients
     ============================================================ */
  add("dl-backprop", [
    {
      q: `<p>Backprop through 3 layers (all linear, slope 1). $\\frac{\\partial L}{\\partial a^{[3]}} = 2$, $w^{[3]} = -1$, $w^{[2]} = 3$, and $\\frac{\\partial z^{[1]}}{\\partial w^{[1]}} = x = 2$. With all activation slopes equal to 1, find $\\frac{\\partial L}{\\partial w^{[1]}}$.</p>`,
      steps: [
        { do: `Pass to $a^{[2]}$: $2 \\times w^{[3]} = 2\\times(-1) = -2$.`,
          why: `The gradient flows back through layer 3's weight (activation slope is 1).` },
        { do: `Pass to $a^{[1]}$: $-2 \\times w^{[2]} = -2\\times3 = -6$.`,
          why: `Continue back through layer 2's weight.` },
        { do: `Multiply by input: $-6 \\times x = -6\\times2 = -12$.`,
          why: `The last local slope w.r.t. $w^{[1]}$ is the input $x$.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial w^{[1]}} = -12$`
    },
    {
      q: `<p>Full numeric backprop for one weight. Forward: $z = w x + b$ with $w=2$, $x=3$, $b=1$, giving $z=7$; then sigmoid $a = \\sigma(7) \\approx 0.999$; loss gradient $\\frac{\\partial L}{\\partial a} = 4$. Sigmoid slope is $a(1-a) \\approx 0.000999$. Find $\\frac{\\partial L}{\\partial w}$ (round to 4 decimals).</p>`,
      steps: [
        { do: `Sigmoid slope: $a(1-a) = 0.999\\times0.001 \\approx 0.000999$.`,
          why: `A saturated sigmoid (near 1) has a tiny slope, throttling the gradient.` },
        { do: `Chain with upstream and input: $4 \\times 0.000999 \\times 3 \\approx 0.0120$.`,
          why: `Multiply loss slope, activation slope, and the input $x = 3$.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial w} \\approx 0.0120$`
    },
    {
      q: `<p>A weight fans out to three downstream paths with contributions $\\frac{\\partial L}{\\partial w} = 1.5$, $-0.5$, and $2$. Sum them, then update with $\\eta = 0.4$ from $w = 2$.</p>`,
      steps: [
        { do: `Sum contributions: $1.5 + (-0.5) + 2 = 3$.`,
          why: `When a weight affects the loss through several paths, gradients add.` },
        { do: `Step: $0.4 \\times 3 = 1.2$, then $w = 2 - 1.2 = 0.8$.`,
          why: `Apply learning rate to the total gradient and step downhill.` }
      ],
      answer: `$w = 0.8$`
    },
    {
      q: `<p>Backprop to a bias. The output gradient is $\\frac{\\partial L}{\\partial z} = -0.6$. Since $\\frac{\\partial z}{\\partial b} = 1$, the bias gradient equals it. Update from $b = 0.5$ with $\\eta = 0.5$.</p>`,
      steps: [
        { do: `Bias gradient: $\\frac{\\partial L}{\\partial b} = \\frac{\\partial L}{\\partial z}\\times 1 = -0.6$.`,
          why: `The bias's local slope is always 1, so its gradient equals the pre-activation gradient.` },
        { do: `Update: $b = 0.5 - 0.5\\times(-0.6) = 0.5 + 0.3 = 0.8$.`,
          why: `A negative gradient raises the bias under gradient descent.` }
      ],
      answer: `$b = 0.8$`
    },
    {
      q: `<p>Two weights of one neuron. Pre-activation gradient $\\frac{\\partial L}{\\partial z} = 0.5$. Inputs $x_1 = 4$, $x_2 = -2$. Each weight's gradient is $\\frac{\\partial L}{\\partial z}\\times x_i$. Find both weight gradients.</p>`,
      steps: [
        { do: `Weight 1: $0.5\\times4 = 2$.`,
          why: `Each weight's gradient is the shared pre-activation gradient times that weight's input.` },
        { do: `Weight 2: $0.5\\times(-2) = -1$.`,
          why: `The negative input flips the sign of the second weight's gradient.` }
      ],
      answer: `$[2, -1]$`
    },
    {
      q: `<p>Gradient to the input (used by earlier layers). A neuron has $\\frac{\\partial L}{\\partial z} = 0.5$ and weights $w = [3, -1]$. The gradient w.r.t. each input is $\\frac{\\partial L}{\\partial z}\\times w_i$. Find $\\frac{\\partial L}{\\partial x}$.</p>`,
      steps: [
        { do: `Input 1: $0.5\\times3 = 1.5$. Input 2: $0.5\\times(-1) = -0.5$.`,
          why: `Backprop to the inputs multiplies the pre-activation gradient by the weights.` },
        { do: `So $\\frac{\\partial L}{\\partial x} = [1.5, -0.5]$.`,
          why: `This vector becomes the upstream gradient for the previous layer.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial x} = [1.5, -0.5]$`
    },
    {
      q: `<p>Three gradient-descent steps with changing gradients $g = [1, -2, 1]$, $\\eta = 0.5$, starting $w = 3$. Find $w$ after all three updates.</p>`,
      steps: [
        { do: `Step 1: $w = 3 - 0.5\\times1 = 2.5$.`,
          why: `Apply the first gradient.` },
        { do: `Step 2: $w = 2.5 - 0.5\\times(-2) = 2.5 + 1 = 3.5$.`,
          why: `A negative gradient moves the weight back up.` },
        { do: `Step 3: $w = 3.5 - 0.5\\times1 = 3.0$.`,
          why: `The final positive gradient nudges it down again.` }
      ],
      answer: `$w = 3.0$`
    },
    {
      q: `<p>2-layer backprop, both ReLU active. Layer 2: $\\frac{\\partial L}{\\partial a^{[2]}} = 2$, ReLU slope 1, $w^{[2]} = -2$. Layer 1: ReLU slope 1, input $x = 5$. Compute $\\frac{\\partial L}{\\partial w^{[1]}}$.</p>`,
      steps: [
        { do: `Through layer 2: $\\frac{\\partial L}{\\partial z^{[2]}} = 2\\times1 = 2$; then to $a^{[1]}$: $2\\times w^{[2]} = 2\\times(-2) = -4$.`,
          why: `ReLU passes the gradient (slope 1), then the layer-2 weight routes it back.` },
        { do: `Through layer 1: $-4 \\times 1 \\times x = -4\\times1\\times5 = -20$.`,
          why: `Layer-1 ReLU is active (slope 1) and the local weight slope is the input.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial w^{[1]}} = -20$`
    },
    {
      q: `<p>Vanishing gradient demo. Three stacked sigmoids each contribute a slope of $0.25$ (their max). The upstream gradient is $1$. What gradient reaches the first layer after passing all three sigmoid slopes?</p>`,
      steps: [
        { do: `Multiply the three slopes: $0.25 \\times 0.25 \\times 0.25 = 0.015625$.`,
          why: `Backprop multiplies local slopes; small slopes compound across layers.` },
        { do: `Times the upstream gradient: $1 \\times 0.015625 = 0.015625$.`,
          why: `The gradient shrinks roughly 64-fold over three sigmoids — the vanishing-gradient problem.` }
      ],
      answer: `$\\approx 0.0156$`
    },
    {
      q: `<p>Full one-step pass. Forward: $z = w x + b$ with $w = 1$, $x = 2$, $b = -1$, giving $z = 1$; ReLU active so $a = 1$; loss $L = \\tfrac12(a - t)^2$ with target $t = 0$, so $\\frac{\\partial L}{\\partial a} = a - t = 1$. With $\\eta = 0.1$, update $w$.</p>`,
      steps: [
        { do: `Loss gradient: $\\frac{\\partial L}{\\partial a} = a - t = 1 - 0 = 1$.`,
          why: `For squared error $\\tfrac12(a-t)^2$, the derivative w.r.t. $a$ is $a - t$.` },
        { do: `Chain to weight: $1 \\times 1 \\times x = 1\\times1\\times2 = 2$ (ReLU slope 1, input 2).`,
          why: `Multiply loss slope, ReLU slope, and the input.` },
        { do: `Update: $w = 1 - 0.1\\times2 = 0.8$.`,
          why: `Step downhill by learning rate times gradient.` }
      ],
      answer: `$w = 0.8$`
    },
    {
      q: `<p>Backprop with weight tying. A shared weight $w$ appears in two places, each producing a gradient: $\\frac{\\partial L}{\\partial w}\\big|_1 = 0.7$ and $\\frac{\\partial L}{\\partial w}\\big|_2 = 1.3$. What single gradient is used to update $w$?</p>`,
      steps: [
        { do: `Add the two gradients: $0.7 + 1.3 = 2.0$.`,
          why: `A tied (shared) weight accumulates the gradients from every place it is used.` },
        { do: `Use $\\frac{\\partial L}{\\partial w} = 2.0$ for the update.`,
          why: `Summing is the correct chain-rule treatment for shared parameters.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial w} = 2.0$`
    }
  ]);

  /* ============================================================
     dl-optimizers — multi-step Momentum/RMSprop/Adam, bias-correction
     across steps, learning-rate decay, comparisons
     ============================================================ */
  add("dl-optimizers", [
    {
      q: `<p>RMSprop over two steps. $s \\leftarrow 0.9 s + 0.1 g^2$, start $s = 0$. Gradients $g = 2$ then $g = 4$. Find $s$ after both steps.</p>`,
      steps: [
        { do: `Step 1: $s = 0.9\\times0 + 0.1\\times2^2 = 0.1\\times4 = 0.4$.`,
          why: `RMSprop tracks a decaying average of squared gradients.` },
        { do: `Step 2: $s = 0.9\\times0.4 + 0.1\\times4^2 = 0.36 + 1.6 = 1.96$.`,
          why: `The new squared gradient (16) blends with the carried-over cache.` }
      ],
      answer: `$s = 1.96$`
    },
    {
      q: `<p>Adam at step $t = 2$. First moment $m = 0.171$, $\\beta_1 = 0.9$. Bias-correct it: $\\hat m = \\frac{m}{1 - \\beta_1^t}$. Find $\\hat m$ (round to 3 decimals).</p>`,
      steps: [
        { do: `Correction denominator: $1 - 0.9^2 = 1 - 0.81 = 0.19$.`,
          why: `At step 2 the bias factor uses $\\beta_1$ squared.` },
        { do: `Divide: $\\hat m = \\frac{0.171}{0.19} = 0.9$.`,
          why: `Bias correction scales the still-small moment up to an unbiased estimate.` }
      ],
      answer: `$\\hat m = 0.9$`
    },
    {
      q: `<p>Full Adam step, $t = 1$, gradient $g = 0.5$. Rules: $m = 0.9 m + 0.1 g$, $v = 0.999 v + 0.001 g^2$, bias-correct, then $w \\leftarrow w - \\eta\\frac{\\hat m}{\\sqrt{\\hat v}+\\epsilon}$. Use $\\eta = 0.01$, $\\epsilon \\approx 0$, $m = v = 0$, $w = 1$. Find the new $w$.</p>`,
      steps: [
        { do: `Moments: $m = 0.1\\times0.5 = 0.05$; $v = 0.001\\times0.25 = 0.00025$.`,
          why: `Update the first and second moment estimates from zero.` },
        { do: `Bias-correct: $\\hat m = \\frac{0.05}{0.1} = 0.5$; $\\hat v = \\frac{0.00025}{0.001} = 0.25$.`,
          why: `At $t=1$, divide by $1-\\beta_1 = 0.1$ and $1-\\beta_2 = 0.001$.` },
        { do: `Step: $0.01\\times\\frac{0.5}{\\sqrt{0.25}} = 0.01\\times\\frac{0.5}{0.5} = 0.01$, so $w = 1 - 0.01 = 0.99$.`,
          why: `Adam's normalized step is roughly $\\eta$ when the gradient is steady.` }
      ],
      answer: `$w = 0.99$`
    },
    {
      q: `<p>Momentum (classic $v \\leftarrow \\beta v + g$, $w \\leftarrow w - \\eta v$) hits a gradient sign flip. $\\beta = 0.9$, $\\eta = 0.1$, $v = 5$. New gradient $g = -5$. Find the new velocity and whether $w$ moves down or up.</p>`,
      steps: [
        { do: `New velocity: $v = 0.9\\times5 + (-5) = 4.5 - 5 = -0.5$.`,
          why: `A reversed gradient is partly canceled by the carried-over velocity.` },
        { do: `Update: $w \\leftarrow w - 0.1\\times(-0.5)$, so $w$ increases by $0.05$.`,
          why: `The velocity went slightly negative, so momentum nudges $w$ up with damped magnitude.` }
      ],
      answer: `$v = -0.5$; $w$ moves up slightly`
    },
    {
      q: `<p>Learning-rate decay. The schedule is $\\eta_t = \\frac{\\eta_0}{1 + k t}$ with $\\eta_0 = 0.1$, $k = 0.5$. Find the learning rate at step $t = 3$.</p>`,
      steps: [
        { do: `Denominator: $1 + 0.5\\times3 = 1 + 1.5 = 2.5$.`,
          why: `Decay shrinks the step as training progresses.` },
        { do: `Rate: $\\eta_3 = \\frac{0.1}{2.5} = 0.04$.`,
          why: `Smaller late-stage steps help settle near the minimum.` }
      ],
      answer: `$\\eta_3 = 0.04$`
    },
    {
      q: `<p>Exponential decay $\\eta_t = \\eta_0\\,(0.9)^t$ with $\\eta_0 = 0.2$. Find the learning rate at $t = 2$.</p>`,
      steps: [
        { do: `Decay factor: $0.9^2 = 0.81$.`,
          why: `Exponential decay multiplies by the base each step.` },
        { do: `Rate: $0.2\\times0.81 = 0.162$.`,
          why: `The step size shrinks geometrically over time.` }
      ],
      answer: `$\\eta_2 = 0.162$`
    },
    {
      q: `<p>RMSprop tames a large gradient. $\\eta = 0.1$, cache $s = 100$, gradient $g = 50$, $\\epsilon \\approx 0$. Find the effective step $\\eta\\frac{g}{\\sqrt{s}}$ and compare to plain SGD's step $\\eta g$.</p>`,
      steps: [
        { do: `RMSprop step: $0.1\\times\\frac{50}{\\sqrt{100}} = 0.1\\times\\frac{50}{10} = 0.1\\times5 = 0.5$.`,
          why: `Dividing by $\\sqrt{s}$ normalizes the huge gradient.` },
        { do: `Plain SGD step: $0.1\\times50 = 5$.`,
          why: `SGD would take a 10× bigger, potentially unstable step.` }
      ],
      answer: `RMSprop $= 0.5$ vs SGD $= 5$`
    },
    {
      q: `<p>Adam's second moment with $\\beta_2 = 0.999$ over two steps, constant $g = 10$, start $v = 0$. Find $v$ after step 2.</p>`,
      steps: [
        { do: `Step 1: $v = 0.999\\times0 + 0.001\\times100 = 0.1$.`,
          why: `The squared gradient is $10^2 = 100$, weighted by $0.001$.` },
        { do: `Step 2: $v = 0.999\\times0.1 + 0.001\\times100 = 0.0999 + 0.1 = 0.1999$.`,
          why: `The slowly-decaying cache accumulates squared gradients.` }
      ],
      answer: `$v \\approx 0.1999$`
    },
    {
      q: `<p>Bias-corrected vs uncorrected Adam at step 1. First moment $m = 0.05$ (from $g = 0.5$), $\\beta_1 = 0.9$. Give the uncorrected $m$, the corrected $\\hat m$, and the ratio between them.</p>`,
      steps: [
        { do: `Uncorrected: $m = 0.05$.`,
          why: `The raw moment is heavily biased toward 0 at the start.` },
        { do: `Corrected: $\\hat m = \\frac{0.05}{1 - 0.9} = \\frac{0.05}{0.1} = 0.5$; ratio $= 10$.`,
          why: `At step 1 the correction multiplies by $1/(1-\\beta_1) = 10$, recovering the true gradient scale.` }
      ],
      answer: `$m = 0.05$, $\\hat m = 0.5$, ratio $= 10$`
    },
    {
      q: `<p>Nesterov look-ahead intuition. With velocity $v = 2$ and $\\beta = 0.9$, momentum first moves $\\beta v$ before adding the gradient. If the gradient at the look-ahead point is $g = 1$, the new velocity is $\\beta v + g$. Find it.</p>`,
      steps: [
        { do: `Look-ahead move: $\\beta v = 0.9\\times2 = 1.8$.`,
          why: `Nesterov peeks ahead by the momentum step before computing the gradient.` },
        { do: `New velocity: $1.8 + 1 = 2.8$.`,
          why: `Add the look-ahead gradient to the carried velocity.` }
      ],
      answer: `$v = 2.8$`
    },
    {
      q: `<p>Two optimizers, same first gradient $g = 4$, $\\eta = 0.1$, start $w = 0$. Plain SGD vs RMSprop ($s \\leftarrow 0.5 s + 0.5 g^2$, $s = 0$, $\\epsilon \\approx 0$). Use $\\sqrt{8}\\approx2.828$. Find each optimizer's $w$ after step 1.</p>`,
      steps: [
        { do: `SGD step 1: $w = 0 - 0.1\\times4 = -0.4$.`,
          why: `SGD steps by raw gradient times learning rate.` },
        { do: `RMSprop: $s = 0.5\\times0 + 0.5\\times16 = 8$, step $= 0.1\\times\\frac{4}{2.828} \\approx 0.141$, so $w \\approx -0.141$.`,
          why: `RMSprop normalizes the large gradient, taking a smaller, steadier step.` }
      ],
      answer: `SGD: $w = -0.4$; RMSprop: $w \\approx -0.141$`
    }
  ]);

  /* ============================================================
     dl-minibatch — partial batches, multi-epoch totals, time/cost,
     reverse-engineering settings, gradient accumulation, distributed
     ============================================================ */
  add("dl-minibatch", [
    {
      q: `<p>$N = 5000$ examples, batch size $m = 128$, with partial last batch. How many iterations per epoch, and how many examples are in the last batch?</p>`,
      steps: [
        { do: `Full batches: $\\lfloor 5000 / 128 \\rfloor = 39$ (covering $39\\times128 = 4992$).`,
          why: `Thirty-nine complete batches of 128 use 4992 examples.` },
        { do: `Remainder: $5000 - 4992 = 8$ examples form one more partial batch.`,
          why: `The leftover 8 examples still need their own update.` },
        { do: `Iterations: $39 + 1 = 40$.`,
          why: `Ceiling of $5000/128$ counts the partial batch.` }
      ],
      answer: `40 iterations; last batch has 8`
    },
    {
      q: `<p>Training runs for 12 epochs with $N = 60000$ and $m = 100$ (divides evenly). How many total weight updates?</p>`,
      steps: [
        { do: `Iterations per epoch: $60000 / 100 = 600$.`,
          why: `An even split gives exactly 600 batches per epoch.` },
        { do: `Total: $600 \\times 12 = 7200$ updates.`,
          why: `Multiply iterations per epoch by the number of epochs.` }
      ],
      answer: `7200 updates`
    },
    {
      q: `<p>A run logged 2400 total updates over 8 epochs with $N = 30000$. What batch size was used (even division)?</p>`,
      steps: [
        { do: `Iterations per epoch: $2400 / 8 = 300$.`,
          why: `Spread the total updates across the epochs.` },
        { do: `Batch size: $30000 / 300 = 100$.`,
          why: `Batch size is $N$ divided by iterations per epoch.` }
      ],
      answer: `batch size $= 100$`
    },
    {
      q: `<p>Wall-clock estimate. Each iteration takes 50 ms. With $N = 8000$, $m = 32$, how long is one epoch (in seconds)?</p>`,
      steps: [
        { do: `Iterations: $8000 / 32 = 250$.`,
          why: `Number of updates per epoch.` },
        { do: `Time: $250 \\times 50\\text{ ms} = 12500\\text{ ms} = 12.5$ s.`,
          why: `Multiply iterations by per-iteration time, then convert to seconds.` }
      ],
      answer: `12.5 seconds`
    },
    {
      q: `<p>Doubling the batch size. At $m = 64$ a run does 500 iterations per epoch. If you double to $m = 128$ (same $N$, even division), how many iterations per epoch now?</p>`,
      steps: [
        { do: `Original $N = 64 \\times 500 = 32000$.`,
          why: `Recover the dataset size from the original setting.` },
        { do: `New iterations: $32000 / 128 = 250$.`,
          why: `Doubling the batch size halves the iterations per epoch.` }
      ],
      answer: `250 iterations`
    },
    {
      q: `<p>Gradient accumulation. You use $m = 16$ but accumulate gradients over 4 micro-batches before each update. What is the effective batch size, and with $N = 6400$ how many updates per epoch?</p>`,
      steps: [
        { do: `Effective batch: $16 \\times 4 = 64$.`,
          why: `Accumulating gradients over 4 micro-batches simulates one larger batch.` },
        { do: `Updates per epoch: $6400 / 64 = 100$.`,
          why: `Use the effective batch size to count actual weight updates.` }
      ],
      answer: `effective 64; 100 updates`
    },
    {
      q: `<p>$N = 1000$, $m = 300$, with a partial last batch. List the size of each batch in one epoch.</p>`,
      steps: [
        { do: `Full batches: $\\lfloor 1000/300 \\rfloor = 3$ batches of 300 $= 900$ examples.`,
          why: `Three full batches of 300 cover 900 examples.` },
        { do: `Remainder: $1000 - 900 = 100$ in the last batch.`,
          why: `The leftover forms a smaller final batch.` }
      ],
      answer: `300, 300, 300, 100`
    },
    {
      q: `<p>Distributed training across 4 GPUs, each processing a local batch of 64. What is the global batch size, and with $N = 51200$ how many updates per epoch?</p>`,
      steps: [
        { do: `Global batch: $4 \\times 64 = 256$.`,
          why: `Data-parallel training sums each GPU's batch into one global batch per update.` },
        { do: `Updates per epoch: $51200 / 256 = 200$.`,
          why: `Divide the dataset by the global batch size.` }
      ],
      answer: `global 256; 200 updates`
    },
    {
      q: `<p>To finish in at most 50 updates per epoch with $N = 9000$, what is the smallest batch size $m$ such that $\\lceil 9000/m \\rceil \\le 50$?</p>`,
      steps: [
        { do: `Need $\\lceil 9000/m \\rceil \\le 50$, so $m \\ge 9000/50 = 180$.`,
          why: `Larger batches mean fewer updates; the threshold sets the minimum $m$.` },
        { do: `Smallest integer batch: $m = 180$ gives exactly $9000/180 = 50$ updates.`,
          why: `At $m=180$ the division is exact and meets the cap.` }
      ],
      answer: `$m = 180$`
    },
    {
      q: `<p>Total training cost. A model trains 20 epochs on $N = 50000$ with $m = 250$. How many total example-passes (epochs × $N$) and how many total weight updates occur?</p>`,
      steps: [
        { do: `Example-passes: $20 \\times 50000 = 1{,}000{,}000$.`,
          why: `Each epoch passes every example once; multiply by epochs.` },
        { do: `Updates: iterations per epoch $= 50000/250 = 200$, total $= 200\\times20 = 4000$.`,
          why: `Total weight updates equal iterations per epoch times epochs.` }
      ],
      answer: `1,000,000 passes; 4000 updates`
    },
    {
      q: `<p>$N = 12345$ examples, $m = 1000$. How many iterations per epoch (with partial batch), and how big is the last batch?</p>`,
      steps: [
        { do: `Full batches: $\\lfloor 12345/1000 \\rfloor = 12$, covering 12000.`,
          why: `Twelve full batches of 1000 use 12000 examples.` },
        { do: `Remainder: $12345 - 12000 = 345$, so $12 + 1 = 13$ iterations.`,
          why: `Ceiling counts the leftover 345 as one more batch.` }
      ],
      answer: `13 iterations; last batch 345`
    }
  ]);

  /* ============================================================
     dl-init — He/Xavier variance & std, fan-in/out, scaling laws,
     solving for n, signal-growth reasoning, uniform initializers
     ============================================================ */
  add("dl-init", [
    {
      q: `<p>He init for a ReLU layer with $n_{in} = 128$. $\\text{Var}(w) = \\frac{2}{n_{in}}$. Find the variance and standard deviation. Use $\\sqrt{0.015625} = 0.125$.</p>`,
      steps: [
        { do: `Variance: $\\frac{2}{128} = 0.015625$.`,
          why: `He doubles Xavier's variance to offset ReLU zeroing half the activations.` },
        { do: `Std: $\\sqrt{0.015625} = 0.125$.`,
          why: `Standard deviation is the square root of the variance.` }
      ],
      answer: `Var $= 0.015625$, std $= 0.125$`
    },
    {
      q: `<p>A uniform initializer draws weights from $[-a, a]$, whose variance is $\\frac{a^2}{3}$. To match a target variance of $0.03$, find $a$. Use $\\sqrt{0.09} = 0.3$.</p>`,
      steps: [
        { do: `Set $\\frac{a^2}{3} = 0.03$, so $a^2 = 0.09$.`,
          why: `A uniform distribution on $[-a,a]$ has variance $a^2/3$; match it to the target.` },
        { do: `Solve: $a = \\sqrt{0.09} = 0.3$.`,
          why: `Take the square root to get the half-width of the uniform range.` }
      ],
      answer: `$a = 0.3$`
    },
    {
      q: `<p>Two ReLU layers with He init. Layer A: $n_{in} = 50$. Layer B: $n_{in} = 800$. By what factor is A's standard deviation larger than B's? Use $\\sqrt{16} = 4$.</p>`,
      steps: [
        { do: `Variance ratio: $\\frac{2/50}{2/800} = \\frac{800}{50} = 16$.`,
          why: `The 2's cancel; the variance ratio is the inverse ratio of fan-ins.` },
        { do: `Std ratio: $\\sqrt{16} = 4$.`,
          why: `Standard deviation scales with the square root of variance.` }
      ],
      answer: `A's std is $4\\times$ larger`
    },
    {
      q: `<p>A deep ReLU net keeps activation variance stable with He init. If, without proper init, each layer instead multiplied the variance by 0.5, what fraction of the original variance survives after 8 layers?</p>`,
      steps: [
        { do: `Each layer halves: factor $0.5^8$.`,
          why: `Variance shrinkage compounds multiplicatively across layers.` },
        { do: `Compute: $0.5^8 = \\frac{1}{256} \\approx 0.0039$.`,
          why: `By layer 8 the signal has nearly vanished — exactly what good init prevents.` }
      ],
      answer: `$\\frac{1}{256} \\approx 0.0039$`
    },
    {
      q: `<p>Xavier-uniform draws from $[-L, L]$ with $L = \\sqrt{\\frac{6}{n_{in} + n_{out}}}$. For $n_{in} = 100$, $n_{out} = 44$, find $L$. Use $\\sqrt{0.04167} \\approx 0.204$.</p>`,
      steps: [
        { do: `Denominator: $100 + 44 = 144$, so $\\frac{6}{144} = 0.04167$.`,
          why: `This variant balances forward signal and backward gradient using both fan-in and fan-out.` },
        { do: `Take the root: $L = \\sqrt{0.04167} \\approx 0.204$.`,
          why: `The uniform range half-width is the square root of the computed value.` }
      ],
      answer: `$L \\approx 0.204$`
    },
    {
      q: `<p>A layer's weights should have target std $0.1$ with Xavier ($\\text{Var} = 1/n_{in}$). What $n_{in}$ achieves this?</p>`,
      steps: [
        { do: `Variance: $0.1^2 = 0.01$.`,
          why: `Square the target std to get the variance Xavier must hit.` },
        { do: `Solve $\\frac{1}{n_{in}} = 0.01$, so $n_{in} = 100$.`,
          why: `Invert the Xavier rule.` }
      ],
      answer: `$n_{in} = 100$`
    },
    {
      q: `<p>He vs Xavier variance for the same layer ($n_{in} = 256$). Give both variances and the ratio He : Xavier.</p>`,
      steps: [
        { do: `Xavier: $\\frac{1}{256} \\approx 0.003906$. He: $\\frac{2}{256} \\approx 0.007813$.`,
          why: `He uses 2 in the numerator, Xavier uses 1.` },
        { do: `Ratio He : Xavier $= 2 : 1$.`,
          why: `He's variance is always exactly twice Xavier's.` }
      ],
      answer: `Xavier $\\approx 0.0039$, He $\\approx 0.0078$, ratio $2{:}1$`
    },
    {
      q: `<p>Bias initialization. Biases are usually set to 0, while weights are randomly initialized. Can symmetry still break? Check two neurons with weights $[0.1, -0.2]$ and $[0.3, 0.05]$, input $x = [1, 1]$, zero biases.</p>`,
      steps: [
        { do: `Neuron 1: $0.1\\times1 + (-0.2)\\times1 + 0 = -0.1$. Neuron 2: $0.3\\times1 + 0.05\\times1 + 0 = 0.35$.`,
          why: `Different random weights give different pre-activations even with zero biases.` },
        { do: `Since the two outputs differ, symmetry is already broken.`,
          why: `Random weights — not biases — break neuron symmetry, so zero biases are fine.` }
      ],
      answer: `yes; outputs $-0.1$ vs $0.35$ differ`
    },
    {
      q: `<p>Output variance through a linear layer. With $n_{in} = 400$ inputs each of variance 1 and independent zero-mean weights of variance $1/n_{in}$, the output variance is $n_{in} \\times \\text{Var}(w) \\times 1$. Compute it.</p>`,
      steps: [
        { do: `Per-weight contribution: $\\text{Var}(w) = 1/400 = 0.0025$.`,
          why: `Xavier sets each weight's variance to $1/n_{in}$.` },
        { do: `Total output variance: $400 \\times 0.0025 \\times 1 = 1$.`,
          why: `Summing $n_{in}$ independent terms keeps the output variance at 1 — the whole point of Xavier.` }
      ],
      answer: `output variance $= 1$`
    },
    {
      q: `<p>If weights are initialized 3× too large (std multiplied by 3), the output std also scales by 3 per layer. After 4 layers, by what factor has the signal's std grown?</p>`,
      steps: [
        { do: `Per-layer factor 3, over 4 layers: $3^4$.`,
          why: `Over-scaled weights compound the signal growth multiplicatively.` },
        { do: `Compute: $3^4 = 81$.`,
          why: `An 81× blow-up causes exploding activations — why correct init matters.` }
      ],
      answer: `$81\\times$`
    },
    {
      q: `<p>A layer maps $n_{in} = 64$ to $n_{out} = 16$. Compare He ($2/n_{in}$) std with fan-avg Xavier ($2/(n_{in}+n_{out})$) std. Use $\\sqrt{0.03125}\\approx0.177$ and $\\sqrt{0.025}\\approx0.158$.</p>`,
      steps: [
        { do: `He: $\\frac{2}{64} = 0.03125$, std $\\approx 0.177$.`,
          why: `He uses fan-in only.` },
        { do: `Fan-avg Xavier: $\\frac{2}{64+16} = \\frac{2}{80} = 0.025$, std $\\approx 0.158$.`,
          why: `Including fan-out lowers the variance slightly, balancing the backward pass.` }
      ],
      answer: `He std $\\approx 0.177$, Xavier std $\\approx 0.158$`
    }
  ]);

  /* ============================================================
     dl-dropout — inverted-dropout scaling, expected values, test-time
     equivalence, stacked dropout, mask counting, variance
     ============================================================ */
  add("dl-dropout", [
    {
      q: `<p>Inverted dropout with keep probability $p = 0.6$. Three survivors have activations $[2, 5, 3]$. Find the scaled values passed forward. Use $1/0.6 \\approx 1.667$.</p>`,
      steps: [
        { do: `Scale factor: $1/p = 1/0.6 \\approx 1.667$.`,
          why: `Inverted dropout boosts survivors by $1/p$ so the expected total is unchanged.` },
        { do: `Scale each: $2\\times1.667 \\approx 3.33$, $5\\times1.667 \\approx 8.33$, $3\\times1.667 = 5.00$.`,
          why: `Every surviving activation is multiplied by the same factor.` }
      ],
      answer: `$[3.33, 8.33, 5.00]$`
    },
    {
      q: `<p>Expected output check with inverted dropout. A neuron outputs $20$, keep probability $p = 0.4$, survivors scaled by $1/p$. Show the expected contribution equals 20.</p>`,
      steps: [
        { do: `When kept (prob $0.4$): $20\\times\\frac{1}{0.4} = 20\\times2.5 = 50$.`,
          why: `Inverted dropout scales the kept value up by $1/p$.` },
        { do: `Expected: $0.4\\times50 + 0.6\\times0 = 20$.`,
          why: `Averaging over kept and dropped cases recovers the original value.` }
      ],
      answer: `expected $= 20$`
    },
    {
      q: `<p>Stacked dropout. Two consecutive layers each keep with $p = 0.8$ independently. What is the probability that a given path through both layers survives (both neurons kept)?</p>`,
      steps: [
        { do: `Independent survival: multiply probabilities $0.8 \\times 0.8$.`,
          why: `For both to be kept, multiply the independent keep probabilities.` },
        { do: `Compute: $0.64$.`,
          why: `Only 64% of two-step paths survive both dropout masks.` }
      ],
      answer: `$0.64$`
    },
    {
      q: `<p>A layer of 80 neurons uses dropout $p = 0.25$ (drop probability). On average, how many neurons are kept, and what is the inverted-dropout scale on survivors? Use $1/0.75 \\approx 1.333$.</p>`,
      steps: [
        { do: `Keep probability: $1 - 0.25 = 0.75$, expected kept $= 0.75\\times80 = 60$.`,
          why: `Here $p$ is the drop probability, so keep probability is $1-p$.` },
        { do: `Scale: $1/0.75 \\approx 1.333$.`,
          why: `Survivors are boosted by $1/(1-p)$ to preserve the expected sum.` }
      ],
      answer: `60 kept, scale $\\approx 1.333$`
    },
    {
      q: `<p>Classic (non-inverted) dropout scales weights at test time by the training keep probability $p = 0.7$. A trained weight is $w = 10$. What weight is used at test, and what is the equivalent inverted-dropout train-time scale on activations?</p>`,
      steps: [
        { do: `Test-time weight: $10 \\times 0.7 = 7$.`,
          why: `Classic dropout multiplies weights by $p$ at test to match training-time expected input.` },
        { do: `Equivalent train-time activation scale: $1/0.7 \\approx 1.429$.`,
          why: `Inverted dropout moves the same correction to training time so test-time needs no scaling.` }
      ],
      answer: `test weight $= 7$; inverted scale $\\approx 1.429$`
    },
    {
      q: `<p>Variance reasoning. A neuron's activation is $a = 6$. Under dropout with keep probability $p = 0.5$ and inverted scaling, list the two possible scaled outputs (kept vs dropped).</p>`,
      steps: [
        { do: `Kept: $6\\times\\frac{1}{0.5} = 6\\times2 = 12$.`,
          why: `Survivors are doubled when half the neurons drop.` },
        { do: `Dropped: $0$.`,
          why: `A dropped neuron contributes nothing this step.` }
      ],
      answer: `$12$ (kept) or $0$ (dropped)`
    },
    {
      q: `<p>How many distinct dropout masks are possible on a layer of 4 neurons (each either kept or dropped)?</p>`,
      steps: [
        { do: `Each neuron has 2 states (kept or dropped).`,
          why: `Dropout makes an independent binary choice per neuron.` },
        { do: `Total masks: $2^4 = 16$.`,
          why: `Dropout is like training an ensemble of up to $2^n$ sub-networks.` }
      ],
      answer: `$16$ masks`
    },
    {
      q: `<p>You want the inverted-dropout scale factor to be exactly $1.25$. What keep probability $p$ gives this? (Scale $= 1/p$.)</p>`,
      steps: [
        { do: `Set $1/p = 1.25$, so $p = 1/1.25$.`,
          why: `Invert the scale formula to recover the keep probability.` },
        { do: `Compute: $p = 0.8$.`,
          why: `A keep probability of 0.8 (drop 0.2) gives a 1.25× boost.` }
      ],
      answer: `$p = 0.8$`
    },
    {
      q: `<p>A 6-neuron layer with activations $[2, 4, 6, 8, 10, 12]$ (sum 42) uses inverted dropout at $p = 0.5$. Suppose neurons 2, 4, 6 (values $4, 8, 12$) survive. Find the scaled sum and compare to the full sum.</p>`,
      steps: [
        { do: `Survivor sum: $4 + 8 + 12 = 24$.`,
          why: `Only kept neurons contribute; dropped ones are 0.` },
        { do: `Scale by $1/0.5 = 2$: $24\\times2 = 48$.`,
          why: `Inverted dropout doubles survivors to restore the expected magnitude.` },
        { do: `Compare: $48$ vs full sum $42$.`,
          why: `Any single mask varies; scaling matches the original only in expectation.` }
      ],
      answer: `scaled sum $= 48$ (vs 42)`
    },
    {
      q: `<p>Dropout strength vs survivors. On a 100-neuron layer, rank settings $p_{keep} = 0.9, 0.6, 0.3$ by expected survivors, and give the scale factor for the strongest dropout (lowest keep). Use $1/0.3 \\approx 3.333$.</p>`,
      steps: [
        { do: `Survivors: $0.9\\to90$, $0.6\\to60$, $0.3\\to30$.`,
          why: `Expected survivors are $p_{keep}\\times100$.` },
        { do: `Strongest dropout is $p_{keep}=0.3$; scale $= 1/0.3 \\approx 3.333$.`,
          why: `The lowest keep probability drops the most neurons and needs the largest boost.` }
      ],
      answer: `$90 > 60 > 30$; strongest scale $\\approx 3.333$`
    },
    {
      q: `<p>Expected number of active neurons across two layers. Layer 1 has 50 neurons with $p_{keep} = 0.8$; layer 2 has 30 neurons with $p_{keep} = 0.5$. How many neurons are active on average in total?</p>`,
      steps: [
        { do: `Layer 1 active: $0.8\\times50 = 40$.`,
          why: `Expected active equals keep probability times layer size.` },
        { do: `Layer 2 active: $0.5\\times30 = 15$. Total: $40 + 15 = 55$.`,
          why: `Sum the expected actives across both layers.` }
      ],
      answer: `$55$ active on average`
    }
  ]);

})();
