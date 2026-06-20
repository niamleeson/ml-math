(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

  /* ============================================================
     dl-neuron — multi-input dot products, vector/matrix neuron layers
     ============================================================ */
  add("dl-neuron", [
    {
      q: `<p>A neuron has weights $w = [0.5, -1, 2, 0.25]$ and bias $b = -1$. The input is $x = [4, 2, -1, 8]$. Find the pre-activation $z = w^\\top x + b$.</p>`,
      steps: [
        { do: `Multiply matching entries: $0.5\\times4=2$, $-1\\times2=-2$, $2\\times(-1)=-2$, $0.25\\times8=2$.`,
          why: `The dot product $w^\\top x$ multiplies each weight by its matching input.` },
        { do: `Add the four products: $2 + (-2) + (-2) + 2 = 0$.`,
          why: `Summing the products completes the dot product $w^\\top x = 0$.` },
        { do: `Add the bias: $z = 0 + (-1) = -1$.`,
          why: `The neuron's pre-activation is the dot product plus the bias $b$.` }
      ],
      answer: `$z = -1$`
    },
    {
      q: `<p>A layer has two neurons. Weight matrix $W = \\begin{bmatrix} 1 & -2 \\\\ 3 & 0 \\end{bmatrix}$, bias $b = [1, -1]$, input $x = [2, 1]$. Compute $z = Wx + b$ for both neurons.</p>`,
      steps: [
        { do: `Neuron 1 dot product: row $[1, -2]$ with $x=[2,1]$ gives $1\\times2 + (-2)\\times1 = 2 - 2 = 0$.`,
          why: `Each row of $W$ holds the weights of one neuron; matrix-vector product is row-by-row dot products.` },
        { do: `Add neuron 1 bias: $z_1 = 0 + 1 = 1$.`,
          why: `The first entry of $b$ shifts the first neuron's pre-activation.` },
        { do: `Neuron 2 dot product: row $[3, 0]$ with $x=[2,1]$ gives $3\\times2 + 0\\times1 = 6$.`,
          why: `The second row gives the second neuron's weighted sum.` },
        { do: `Add neuron 2 bias: $z_2 = 6 + (-1) = 5$.`,
          why: `The second entry of $b$ shifts the second neuron's pre-activation.` }
      ],
      answer: `$z = [1, 5]$`
    },
    {
      q: `<p>A neuron outputs $z = 7$. Its bias is $b = 3$ and inputs are $x = [2, -1]$. The first weight is $w_1 = 1$. What is the second weight $w_2$?</p>`,
      steps: [
        { do: `Write the equation: $z = w_1 x_1 + w_2 x_2 + b$, so $7 = 1\\times2 + w_2\\times(-1) + 3$.`,
          why: `We know everything except $w_2$, so solve the neuron equation for it.` },
        { do: `Simplify the known terms: $7 = 2 - w_2 + 3 = 5 - w_2$.`,
          why: `Combine the constants $2 + 3 = 5$; the unknown stays as $-w_2$.` },
        { do: `Solve: $w_2 = 5 - 7 = -2$.`,
          why: `Rearranging $7 = 5 - w_2$ gives $w_2 = -2$.` }
      ],
      answer: `$w_2 = -2$`
    },
    {
      q: `<p>Two neurons share the same input $x = [1, 2, 3]$. Neuron A has $w_A = [1, 0, -1]$, $b_A = 2$. Neuron B has $w_B = [0, 1, 1]$, $b_B = -4$. Which neuron has the larger pre-activation $z$?</p>`,
      steps: [
        { do: `Neuron A: $1\\times1 + 0\\times2 + (-1)\\times3 + 2 = 1 + 0 - 3 + 2 = 0$.`,
          why: `Compute A's dot product then add its bias.` },
        { do: `Neuron B: $0\\times1 + 1\\times2 + 1\\times3 + (-4) = 0 + 2 + 3 - 4 = 1$.`,
          why: `Compute B's dot product then add its bias.` },
        { do: `Compare: $z_B = 1 > z_A = 0$.`,
          why: `Neuron B has the larger pre-activation.` }
      ],
      answer: `Neuron B ($z_B = 1$ vs $z_A = 0$)`
    }
  ]);

  /* ============================================================
     dl-activations — derivatives, chained activations, comparisons
     ============================================================ */
  add("dl-activations", [
    {
      q: `<p>Compute the sigmoid $\\sigma(z) = \\frac{1}{1+e^{-z}}$ at $z = -1$. Use $e^{1} \\approx 2.718$. Round to 3 decimals.</p>`,
      steps: [
        { do: `Compute $e^{-z} = e^{-(-1)} = e^{1} \\approx 2.718$.`,
          why: `The exponent in sigmoid is $-z$; with $z=-1$ that is $+1$.` },
        { do: `Add 1: $1 + 2.718 = 3.718$.`,
          why: `The denominator of sigmoid is $1 + e^{-z}$.` },
        { do: `Divide: $\\sigma(-1) = \\frac{1}{3.718} \\approx 0.269$.`,
          why: `Sigmoid takes the reciprocal of the denominator (rounded to 3 decimals).` }
      ],
      answer: `$\\sigma(-1) \\approx 0.269$`
    },
    {
      q: `<p>The derivative of sigmoid is $\\sigma'(z) = \\sigma(z)\\,(1 - \\sigma(z))$. Given $\\sigma(z) = 0.8$, find $\\sigma'(z)$.</p>`,
      steps: [
        { do: `Compute $1 - \\sigma(z) = 1 - 0.8 = 0.2$.`,
          why: `The derivative formula needs the gap between $\\sigma(z)$ and 1.` },
        { do: `Multiply: $\\sigma'(z) = 0.8 \\times 0.2 = 0.16$.`,
          why: `The sigmoid derivative is the product $\\sigma(z)(1-\\sigma(z))$, computed directly from the activation value.` }
      ],
      answer: `$\\sigma'(z) = 0.16$`
    },
    {
      q: `<p>The derivative of $\\tanh$ is $\\tanh'(z) = 1 - \\tanh^2(z)$. If $\\tanh(z) = -0.5$, find the derivative.</p>`,
      steps: [
        { do: `Square the activation: $\\tanh^2(z) = (-0.5)^2 = 0.25$.`,
          why: `The formula needs $\\tanh(z)$ squared; squaring removes the sign.` },
        { do: `Subtract from 1: $1 - 0.25 = 0.75$.`,
          why: `The tanh derivative is $1$ minus that square.` }
      ],
      answer: `$\\tanh'(z) = 0.75$`
    },
    {
      q: `<p>ReLU's derivative is $1$ for $z > 0$ and $0$ for $z < 0$. A neuron computes $z = -2$, then its ReLU output feeds a downstream gradient $\\frac{\\partial L}{\\partial a} = 5$. What is $\\frac{\\partial L}{\\partial z}$?</p>`,
      steps: [
        { do: `Find ReLU's local derivative at $z=-2$: since $z<0$, $\\frac{\\partial a}{\\partial z} = 0$.`,
          why: `ReLU is flat for negative inputs, so its slope there is 0.` },
        { do: `Chain it: $\\frac{\\partial L}{\\partial z} = \\frac{\\partial L}{\\partial a}\\cdot\\frac{\\partial a}{\\partial z} = 5 \\times 0 = 0$.`,
          why: `A zero local slope blocks the upstream gradient — this is the "dying ReLU" effect.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial z} = 0$`
    },
    {
      q: `<p>Leaky ReLU is $\\max(0.01z,\\, z)$, with derivative $1$ for $z>0$ and $0.01$ for $z<0$. A neuron has $z = -10$ and an upstream gradient $\\frac{\\partial L}{\\partial a} = 4$. Find the Leaky-ReLU output and $\\frac{\\partial L}{\\partial z}$.</p>`,
      steps: [
        { do: `Output: $z<0$, so $\\max(0.01\\times(-10), -10) = \\max(-0.1, -10) = -0.1$.`,
          why: `For negatives, Leaky ReLU passes the small-slope branch $0.01z$, which is larger than $z$.` },
        { do: `Local derivative at $z=-10$: $0.01$ (negative side).`,
          why: `Leaky ReLU has slope $0.01$ for negative inputs, unlike plain ReLU's 0.` },
        { do: `Chain: $\\frac{\\partial L}{\\partial z} = 4 \\times 0.01 = 0.04$.`,
          why: `Multiply upstream gradient by the local slope; a tiny gradient still flows, avoiding dead neurons.` }
      ],
      answer: `output $= -0.1$, $\\frac{\\partial L}{\\partial z} = 0.04$`
    },
    {
      q: `<p>Apply sigmoid then use it as input to another sigmoid (a 2-stage squish). Start at $z = 0$. Recall $\\sigma(0) = 0.5$ and use $e^{-0.5} \\approx 0.607$. Round to 3 decimals.</p>`,
      steps: [
        { do: `First sigmoid: $\\sigma(0) = \\frac{1}{1+e^{0}} = \\frac{1}{2} = 0.5$.`,
          why: `At $z=0$, $e^{-0}=1$, giving exactly $0.5$.` },
        { do: `Feed $0.5$ into the second sigmoid: $e^{-0.5} \\approx 0.607$.`,
          why: `The second stage takes the first output as its input $z=0.5$.` },
        { do: `Compute denominator $1 + 0.607 = 1.607$, then $\\frac{1}{1.607} \\approx 0.622$.`,
          why: `Apply the sigmoid formula to $0.5$ (rounded to 3 decimals).` }
      ],
      answer: `$\\approx 0.622$`
    }
  ]);

  /* ============================================================
     dl-forward-prop — multi-layer passes, matrix layers, mixed activations
     ============================================================ */
  add("dl-forward-prop", [
    {
      q: `<p>2-layer net, ReLU hidden + linear output. Input $x = [1, 2]$. Layer 1: $W^{[1]} = \\begin{bmatrix} 1 & -1 \\\\ 0 & 2 \\end{bmatrix}$, $b^{[1]} = [0, -1]$. Layer 2: $W^{[2]} = [2, -1]$, $b^{[2]} = 1$. Find the output $a^{[2]}$.</p>`,
      steps: [
        { do: `Layer-1 pre-activations: $z^{[1]}_1 = 1\\times1 + (-1)\\times2 + 0 = -1$; $z^{[1]}_2 = 0\\times1 + 2\\times2 - 1 = 3$.`,
          why: `Each hidden neuron computes its own dot product plus bias.` },
        { do: `Apply ReLU: $a^{[1]}_1 = \\max(0,-1) = 0$; $a^{[1]}_2 = \\max(0,3) = 3$.`,
          why: `ReLU zeros negatives and keeps positives.` },
        { do: `Layer-2 pre-activation: $z^{[2]} = 2\\times0 + (-1)\\times3 + 1 = -2$.`,
          why: `The output neuron's weights act on the hidden activations $a^{[1]}$.` },
        { do: `Linear output (no squish): $a^{[2]} = -2$.`,
          why: `A linear output layer passes its pre-activation through unchanged.` }
      ],
      answer: `$a^{[2]} = -2$`
    },
    {
      q: `<p>2-layer net with sigmoid output. Input $x = [2, -1]$. Hidden (ReLU): $W^{[1]} = \\begin{bmatrix} 1 & 1 \\\\ -1 & 0 \\end{bmatrix}$, $b^{[1]} = [-2, 1]$. Output: $W^{[2]} = [1, 2]$, $b^{[2]} = 0$, sigmoid. Use $\\sigma(0)=0.5$. Find $a^{[2]}$.</p>`,
      steps: [
        { do: `Hidden pre-activations: $z^{[1]}_1 = 1\\times2 + 1\\times(-1) - 2 = -1$; $z^{[1]}_2 = -1\\times2 + 0\\times(-1) + 1 = -1$.`,
          why: `Compute each hidden neuron's weighted sum plus bias.` },
        { do: `ReLU: $a^{[1]}_1 = \\max(0,-1)=0$; $a^{[1]}_2 = \\max(0,-1)=0$.`,
          why: `Both pre-activations are negative, so both hidden units output 0.` },
        { do: `Output pre-activation: $z^{[2]} = 1\\times0 + 2\\times0 + 0 = 0$.`,
          why: `With both hidden activations zero, the weighted sum is 0.` },
        { do: `Sigmoid: $a^{[2]} = \\sigma(0) = 0.5$.`,
          why: `The sigmoid of 0 is exactly $0.5$.` }
      ],
      answer: `$a^{[2]} = 0.5$`
    },
    {
      q: `<p>3-layer net, all ReLU. Input $x = 2$ (scalar). Layer 1: $w=3, b=-1$. Layer 2: $w=-2, b=4$. Layer 3: $w=1, b=10$. Find the final output.</p>`,
      steps: [
        { do: `Layer 1: $z = 3\\times2 - 1 = 5$, $a^{[1]} = \\max(0,5) = 5$.`,
          why: `First layer transforms the input then ReLU keeps the positive result.` },
        { do: `Layer 2: $z = -2\\times5 + 4 = -6$, $a^{[2]} = \\max(0,-6) = 0$.`,
          why: `The second layer's pre-activation is negative, so ReLU outputs 0.` },
        { do: `Layer 3: $z = 1\\times0 + 10 = 10$, $a^{[3]} = \\max(0,10) = 10$.`,
          why: `With $a^{[2]}=0$, only the bias survives, and ReLU keeps it.` }
      ],
      answer: `$a^{[3]} = 10$`
    },
    {
      q: `<p>A hidden layer has 3 neurons feeding a single output. Hidden activations after ReLU are $a^{[1]} = [2, 0, 5]$. Output weights $W^{[2]} = [1, 3, -1]$, bias $b^{[2]} = 4$, linear. What is the output?</p>`,
      steps: [
        { do: `Weighted sum: $1\\times2 + 3\\times0 + (-1)\\times5 = 2 + 0 - 5 = -3$.`,
          why: `The output neuron dot-products its weights with the hidden activations.` },
        { do: `Add bias: $z^{[2]} = -3 + 4 = 1$.`,
          why: `Adding the output bias gives the pre-activation.` },
        { do: `Linear output: $a^{[2]} = 1$.`,
          why: `No activation on a linear output, so the value passes through.` }
      ],
      answer: `output $= 1$`
    },
    {
      q: `<p>Batch forward pass. Two examples in a batch: $x^{(1)} = [1, 0]$ and $x^{(2)} = [0, 2]$. One ReLU neuron: $w = [2, -1]$, $b = 1$. Find the output for each example.</p>`,
      steps: [
        { do: `Example 1: $z = 2\\times1 + (-1)\\times0 + 1 = 3$, $a = \\max(0,3) = 3$.`,
          why: `Each example flows through the same neuron independently.` },
        { do: `Example 2: $z = 2\\times0 + (-1)\\times2 + 1 = -1$, $a = \\max(0,-1) = 0$.`,
          why: `The same weights and bias are reused; only the input changes.` },
        { do: `Collect batch outputs: $[3, 0]$.`,
          why: `A batch produces one output per example with shared parameters.` }
      ],
      answer: `outputs $= [3, 0]$`
    }
  ]);

  /* ============================================================
     dl-cross-entropy — batch averages, softmax CE, gradients
     ============================================================ */
  add("dl-cross-entropy", [
    {
      q: `<p>Binary cross-entropy over a mini-batch of 3 examples. True labels $y = [1, 0, 1]$, predictions $z = [0.9, 0.2, 0.4]$. Use $\\log(0.9)\\approx-0.105$, $\\log(0.8)\\approx-0.223$, $\\log(0.4)\\approx-0.916$. Find the average loss (round to 3 decimals).</p>`,
      steps: [
        { do: `Example 1 ($y=1$): $L_1 = -\\log(0.9) = 0.105$.`,
          why: `For $y=1$ only $-\\log z$ survives in the cross-entropy formula.` },
        { do: `Example 2 ($y=0$): $L_2 = -\\log(1-0.2) = -\\log(0.8) = 0.223$.`,
          why: `For $y=0$ only $-\\log(1-z)$ survives.` },
        { do: `Example 3 ($y=1$): $L_3 = -\\log(0.4) = 0.916$.`,
          why: `Again $y=1$ keeps the $-\\log z$ term; this confident-wrong-ish case costs more.` },
        { do: `Average: $\\frac{0.105 + 0.223 + 0.916}{3} = \\frac{1.244}{3} \\approx 0.415$.`,
          why: `Batch loss is the mean of the per-example losses (rounded to 3 decimals).` }
      ],
      answer: `average loss $\\approx 0.415$`
    },
    {
      q: `<p>Softmax cross-entropy for one example over 3 classes. The true class is class 2. The softmax probabilities are $[0.1, 0.7, 0.2]$. Use $\\log(0.7)\\approx-0.357$. Find the loss.</p>`,
      steps: [
        { do: `Identify the probability of the true class (class 2): $0.7$.`,
          why: `Multi-class cross-entropy is $-\\log$ of the predicted probability for the correct class only.` },
        { do: `Compute $L = -\\log(0.7) = -(-0.357) = 0.357$.`,
          why: `The loss is the negative log of the true-class probability.` }
      ],
      answer: `$L \\approx 0.357$`
    },
    {
      q: `<p>The gradient of binary cross-entropy (with sigmoid output) w.r.t. the pre-activation is $\\frac{\\partial L}{\\partial z} = a - y$, where $a$ is the predicted probability. If $a = 0.7$ and the true label $y = 1$, find this gradient.</p>`,
      steps: [
        { do: `Plug in: $\\frac{\\partial L}{\\partial z} = a - y = 0.7 - 1$.`,
          why: `The combined sigmoid + cross-entropy gradient simplifies to "prediction minus truth".` },
        { do: `Compute: $0.7 - 1 = -0.3$.`,
          why: `A negative gradient pushes $z$ up (toward predicting 1), which is correct since the truth is 1.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial z} = -0.3$`
    },
    {
      q: `<p>Two models predict on the same example with true label $y = 1$. Model A says $z = 0.99$, Model B says $z = 0.5$. Use $\\log(0.99)\\approx-0.010$ and $\\log(0.5)\\approx-0.693$. How much lower is Model A's loss?</p>`,
      steps: [
        { do: `Model A loss: $-\\log(0.99) = 0.010$.`,
          why: `Confident-and-correct gives a tiny loss.` },
        { do: `Model B loss: $-\\log(0.5) = 0.693$.`,
          why: `An unsure 50-50 prediction costs noticeably more.` },
        { do: `Difference: $0.693 - 0.010 = 0.683$.`,
          why: `Model A's loss is lower by this amount, rewarding confident correctness.` }
      ],
      answer: `lower by $\\approx 0.683$`
    },
    {
      q: `<p>True label $y = 0$ but the model is confidently wrong with $z = 0.999$. Use $\\log(0.001)\\approx-6.908$. Find the loss and comment on its size.</p>`,
      steps: [
        { do: `Since $y=0$: $L = -\\log(1 - z) = -\\log(1 - 0.999) = -\\log(0.001)$.`,
          why: `For $y=0$ the surviving term is $-\\log(1-z)$, and $1-0.999 = 0.001$.` },
        { do: `Compute: $-(-6.908) = 6.908$.`,
          why: `The negative log of a tiny number is large — a huge penalty for confident wrongness.` }
      ],
      answer: `$L \\approx 6.908$ (very large)`
    }
  ]);

  /* ============================================================
     dl-backprop — multi-layer chains + weight updates
     ============================================================ */
  add("dl-backprop", [
    {
      q: `<p>Backprop one weight through a 2-step chain. $\\frac{\\partial L}{\\partial a^{[2]}} = -0.5$, $\\frac{\\partial a^{[2]}}{\\partial z^{[2]}} = 1$ (linear), $\\frac{\\partial z^{[2]}}{\\partial a^{[1]}} = w^{[2]} = 2$, $\\frac{\\partial a^{[1]}}{\\partial z^{[1]}} = 1$ (ReLU, active), $\\frac{\\partial z^{[1]}}{\\partial w^{[1]}} = x = 4$. Find $\\frac{\\partial L}{\\partial w^{[1]}}$.</p>`,
      steps: [
        { do: `Multiply the upstream-to-hidden part: $-0.5 \\times 1 \\times 2 = -1$ (this is $\\frac{\\partial L}{\\partial a^{[1]}}$).`,
          why: `The chain rule passes the gradient back through the output layer to the hidden activation.` },
        { do: `Multiply by the hidden ReLU slope: $-1 \\times 1 = -1$ (this is $\\frac{\\partial L}{\\partial z^{[1]}}$).`,
          why: `ReLU is active so its slope is 1; the gradient passes through unchanged.` },
        { do: `Multiply by $\\frac{\\partial z^{[1]}}{\\partial w^{[1]}} = x = 4$: $-1 \\times 4 = -4$.`,
          why: `The final local slope w.r.t. the weight is the input $x$, completing the chain.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial w^{[1]}} = -4$`
    },
    {
      q: `<p>Continue the previous problem: with $\\frac{\\partial L}{\\partial w^{[1]}} = -4$, learning rate $\\eta = 0.1$, and current $w^{[1]} = 0.5$, perform one gradient-descent update.</p>`,
      steps: [
        { do: `Compute the step: $\\eta \\times \\frac{\\partial L}{\\partial w^{[1]}} = 0.1 \\times (-4) = -0.4$.`,
          why: `The update moves the weight by learning rate times the gradient.` },
        { do: `Subtract from current weight: $w \\leftarrow 0.5 - (-0.4) = 0.5 + 0.4 = 0.9$.`,
          why: `Gradient descent steps opposite the gradient; a negative gradient increases the weight.` }
      ],
      answer: `$w^{[1]} = 0.9$`
    },
    {
      q: `<p>Sigmoid output + cross-entropy. Forward pass gives $a = 0.6$, true label $y = 1$, and the weight's input is $x = 2$. The output gradient simplifies to $\\frac{\\partial L}{\\partial z} = a - y$. Find $\\frac{\\partial L}{\\partial w}$.</p>`,
      steps: [
        { do: `Output-layer gradient: $\\frac{\\partial L}{\\partial z} = a - y = 0.6 - 1 = -0.4$.`,
          why: `The sigmoid + cross-entropy combination gives the clean "prediction minus truth" gradient.` },
        { do: `Multiply by $\\frac{\\partial z}{\\partial w} = x = 2$: $\\frac{\\partial L}{\\partial w} = -0.4 \\times 2 = -0.8$.`,
          why: `The local slope of $z$ w.r.t. the weight is the input feeding that weight.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial w} = -0.8$`
    },
    {
      q: `<p>A weight feeds two downstream paths. Path A contributes $\\frac{\\partial L}{\\partial w} = 3$ and path B contributes $\\frac{\\partial L}{\\partial w} = -1$ (gradients add when a node fans out). With $\\eta = 0.2$ and $w = 1$, do one update.</p>`,
      steps: [
        { do: `Sum the path gradients: $3 + (-1) = 2$.`,
          why: `When a weight influences the loss through multiple paths, the chain rule sums the contributions.` },
        { do: `Step: $\\eta \\times 2 = 0.2 \\times 2 = 0.4$.`,
          why: `Apply learning rate to the total gradient.` },
        { do: `Update: $w \\leftarrow 1 - 0.4 = 0.6$.`,
          why: `Move the weight downhill by the step.` }
      ],
      answer: `$w = 0.6$`
    },
    {
      q: `<p>2-layer backprop with a dead ReLU. Hidden neuron has $z^{[1]} = -3$ (ReLU). Upstream gives $\\frac{\\partial L}{\\partial a^{[1]}} = 5$, and $\\frac{\\partial z^{[1]}}{\\partial w^{[1]}} = x = 7$. Find $\\frac{\\partial L}{\\partial w^{[1]}}$.</p>`,
      steps: [
        { do: `ReLU slope at $z^{[1]}=-3$: since $z<0$, $\\frac{\\partial a^{[1]}}{\\partial z^{[1]}} = 0$.`,
          why: `ReLU is flat for negative pre-activations, so its local derivative is 0.` },
        { do: `Chain: $\\frac{\\partial L}{\\partial w^{[1]}} = 5 \\times 0 \\times 7 = 0$.`,
          why: `A zero in the chain blocks all gradient — the dead neuron gets no update.` }
      ],
      answer: `$\\frac{\\partial L}{\\partial w^{[1]}} = 0$`
    },
    {
      q: `<p>Two-step update. A weight has gradient $\\frac{\\partial L}{\\partial w} = 2$ on step 1 and $\\frac{\\partial L}{\\partial w} = -3$ on step 2. Learning rate $\\eta = 0.5$, starting $w = 4$. Find $w$ after both updates.</p>`,
      steps: [
        { do: `Step 1: $w \\leftarrow 4 - 0.5\\times2 = 4 - 1 = 3$.`,
          why: `Apply the first gradient with the learning rate.` },
        { do: `Step 2: $w \\leftarrow 3 - 0.5\\times(-3) = 3 + 1.5 = 4.5$.`,
          why: `The second gradient is negative, so the weight moves back up.` }
      ],
      answer: `$w = 4.5$`
    }
  ]);

  /* ============================================================
     dl-optimizers — Momentum, RMSprop, Adam multi-step + bias correction
     ============================================================ */
  add("dl-optimizers", [
    {
      q: `<p>Momentum update. Velocity rule $v \\leftarrow \\beta v + (1-\\beta)g$ then $w \\leftarrow w - \\eta v$. Use $\\beta = 0.9$, $\\eta = 1$, starting $v = 0$, $w = 10$. The gradient is $g = 2$ on every step. Find $v$ and $w$ after step 1 and step 2.</p>`,
      steps: [
        { do: `Step 1 velocity: $v = 0.9\\times0 + 0.1\\times2 = 0.2$.`,
          why: `Momentum blends old velocity (0) with the new gradient.` },
        { do: `Step 1 weight: $w = 10 - 1\\times0.2 = 9.8$.`,
          why: `Move the weight by the learning rate times velocity.` },
        { do: `Step 2 velocity: $v = 0.9\\times0.2 + 0.1\\times2 = 0.18 + 0.2 = 0.38$.`,
          why: `Velocity builds up because the gradient keeps pointing the same way.` },
        { do: `Step 2 weight: $w = 9.8 - 1\\times0.38 = 9.42$.`,
          why: `The accelerating velocity makes a bigger step than step 1.` }
      ],
      answer: `after step 1: $v=0.2, w=9.8$; after step 2: $v=0.38, w=9.42$`
    },
    {
      q: `<p>RMSprop. Cache rule $s \\leftarrow \\beta s + (1-\\beta)g^2$, update $w \\leftarrow w - \\eta\\,\\frac{g}{\\sqrt{s}+\\epsilon}$. Use $\\beta = 0.9$, $\\eta = 0.1$, $\\epsilon \\approx 0$, $s = 0$, $w = 5$, gradient $g = 4$. Do one step. Use $\\sqrt{1.6}\\approx1.265$.</p>`,
      steps: [
        { do: `Update cache: $s = 0.9\\times0 + 0.1\\times4^2 = 0.1\\times16 = 1.6$.`,
          why: `RMSprop tracks a running average of squared gradients.` },
        { do: `Compute $\\sqrt{s} = \\sqrt{1.6} \\approx 1.265$.`,
          why: `The denominator scales the step by the typical gradient magnitude.` },
        { do: `Scaled gradient: $\\frac{4}{1.265} \\approx 3.162$.`,
          why: `Dividing by $\\sqrt{s}$ normalizes the step regardless of raw gradient size.` },
        { do: `Update: $w = 5 - 0.1\\times3.162 \\approx 5 - 0.316 = 4.684$.`,
          why: `Apply the learning rate to the normalized gradient (rounded to 3 decimals).` }
      ],
      answer: `$w \\approx 4.684$`
    },
    {
      q: `<p>Adam with bias correction, step $t = 1$. Rules: $m = \\beta_1 m + (1-\\beta_1)g$, $v = \\beta_2 v + (1-\\beta_2)g^2$, $\\hat{m} = \\frac{m}{1-\\beta_1^t}$, $\\hat{v} = \\frac{v}{1-\\beta_2^t}$. Use $\\beta_1=0.9$, $\\beta_2=0.999$, $m=v=0$, $g = 1$. Find $\\hat{m}$ and $\\hat{v}$.</p>`,
      steps: [
        { do: `First moment: $m = 0.9\\times0 + 0.1\\times1 = 0.1$.`,
          why: `$m$ is the momentum-like running mean of the gradient.` },
        { do: `Second moment: $v = 0.999\\times0 + 0.001\\times1^2 = 0.001$.`,
          why: `$v$ is the RMSprop-like running mean of squared gradients.` },
        { do: `Bias-correct $m$: $\\hat{m} = \\frac{0.1}{1 - 0.9^1} = \\frac{0.1}{0.1} = 1$.`,
          why: `Early on, $m$ is biased toward 0; dividing by $1-\\beta_1^t$ undoes that.` },
        { do: `Bias-correct $v$: $\\hat{v} = \\frac{0.001}{1 - 0.999^1} = \\frac{0.001}{0.001} = 1$.`,
          why: `Same correction for the second moment removes its startup bias.` }
      ],
      answer: `$\\hat{m} = 1$, $\\hat{v} = 1$`
    },
    {
      q: `<p>Finish the Adam step from the previous problem. Update $w \\leftarrow w - \\eta\\,\\frac{\\hat{m}}{\\sqrt{\\hat{v}}+\\epsilon}$ with $\\hat{m}=1$, $\\hat{v}=1$, $\\eta = 0.01$, $\\epsilon \\approx 0$, $w = 2$.</p>`,
      steps: [
        { do: `Compute $\\sqrt{\\hat{v}} = \\sqrt{1} = 1$.`,
          why: `The denominator uses the square root of the bias-corrected second moment.` },
        { do: `Step size: $\\eta\\,\\frac{\\hat{m}}{\\sqrt{\\hat{v}}} = 0.01\\times\\frac{1}{1} = 0.01$.`,
          why: `Adam's effective step is the learning rate scaled by the normalized moment ratio.` },
        { do: `Update: $w = 2 - 0.01 = 1.99$.`,
          why: `Move the weight downhill by the computed step.` }
      ],
      answer: `$w = 1.99$`
    },
    {
      q: `<p>Why does Adam's bias correction matter at step $t=2$? Compute the correction factor $\\frac{1}{1-\\beta_1^t}$ for $\\beta_1 = 0.9$ at $t=2$.</p>`,
      steps: [
        { do: `Compute $\\beta_1^t = 0.9^2 = 0.81$.`,
          why: `The bias depends on $\\beta_1$ raised to the step number.` },
        { do: `Compute $1 - 0.81 = 0.19$.`,
          why: `This is the denominator of the correction factor.` },
        { do: `Correction factor: $\\frac{1}{0.19} \\approx 5.263$.`,
          why: `Early steps multiply the moment by a factor well above 1 to offset the start-at-zero bias (rounded to 3 decimals).` }
      ],
      answer: `$\\approx 5.263$`
    },
    {
      q: `<p>Momentum vs plain SGD over 3 steps with constant gradient $g = 1$, $\\eta = 1$. Plain SGD moves by $\\eta g = 1$ each step. Momentum uses $v \\leftarrow 0.9v + g$ (classic form), then $w \\leftarrow w - \\eta v$, starting $v=0$. How far does Momentum travel total after 3 steps?</p>`,
      steps: [
        { do: `Step 1: $v = 0.9\\times0 + 1 = 1$. Travel $= 1$.`,
          why: `First step matches plain SGD since there is no accumulated velocity yet.` },
        { do: `Step 2: $v = 0.9\\times1 + 1 = 1.9$. Travel $= 1.9$.`,
          why: `Velocity grows by keeping 90% of the previous velocity plus the new gradient.` },
        { do: `Step 3: $v = 0.9\\times1.9 + 1 = 2.71$. Travel $= 2.71$.`,
          why: `Velocity keeps accumulating in the consistent direction.` },
        { do: `Total: $1 + 1.9 + 2.71 = 5.61$ (vs $3$ for plain SGD).`,
          why: `Momentum accelerates, covering more ground than plain SGD's steady 3.` }
      ],
      answer: `total $= 5.61$`
    }
  ]);

  /* ============================================================
     dl-minibatch — partial batches, epochs, total updates
     ============================================================ */
  add("dl-minibatch", [
    {
      q: `<p>You have $N = 1050$ examples and batch size $m = 100$. Batches that don't fill completely still count (a partial last batch). How many iterations are in one epoch?</p>`,
      steps: [
        { do: `Divide: $1050 \\div 100 = 10.5$.`,
          why: `Each full batch is one iteration; the leftover makes a partial batch.` },
        { do: `Round up: $\\lceil 10.5 \\rceil = 11$.`,
          why: `Ten full batches of 100 use 1000 examples; the last 50 still need their own iteration, so we ceil.` }
      ],
      answer: `11 iterations per epoch`
    },
    {
      q: `<p>$N = 6000$ examples, batch size $m = 256$, trained for 4 epochs. How many total weight updates? (Use ceiling for partial batches.)</p>`,
      steps: [
        { do: `Iterations per epoch: $\\lceil 6000 / 256 \\rceil = \\lceil 23.44 \\rceil = 24$.`,
          why: `$23$ full batches cover $5888$ examples; the remaining $112$ form a 24th partial batch.` },
        { do: `Multiply by epochs: $24 \\times 4 = 96$.`,
          why: `Total updates equal iterations per epoch times the number of epochs.` }
      ],
      answer: `96 updates`
    },
    {
      q: `<p>How many examples are in the final partial batch when $N = 1050$ and $m = 100$?</p>`,
      steps: [
        { do: `Full batches use $10 \\times 100 = 1000$ examples.`,
          why: `Ten complete batches of 100 account for the first 1000 examples.` },
        { do: `Remainder: $1050 - 1000 = 50$.`,
          why: `The leftover examples form the partial last batch.` }
      ],
      answer: `50 examples`
    },
    {
      q: `<p>A team wants exactly 50 iterations per epoch with $N = 10000$ examples and no partial batch. What batch size $m$ achieves this?</p>`,
      steps: [
        { do: `Set up: iterations $= N / m$, so $50 = 10000 / m$.`,
          why: `With no partial batch, iterations equal $N$ divided by batch size exactly.` },
        { do: `Solve: $m = 10000 / 50 = 200$.`,
          why: `Rearranging gives the batch size that divides $N$ into exactly 50 parts.` }
      ],
      answer: `$m = 200$`
    },
    {
      q: `<p>Batch gradient descent (whole dataset) vs mini-batch. With $N = 4096$ and you train 10 epochs: how many updates with full-batch GD, and how many with batch size $m = 64$?</p>`,
      steps: [
        { do: `Full-batch: 1 update per epoch, so $1 \\times 10 = 10$ updates.`,
          why: `Full-batch GD uses the entire dataset for a single update each epoch.` },
        { do: `Mini-batch iterations per epoch: $4096 / 64 = 64$.`,
          why: `$4096$ divides evenly by 64, giving 64 updates per epoch.` },
        { do: `Mini-batch total: $64 \\times 10 = 640$ updates.`,
          why: `Mini-batches give far more updates per epoch, hence faster early progress.` }
      ],
      answer: `full-batch: 10; mini-batch: 640`
    }
  ]);

  /* ============================================================
     dl-init — Xavier/He variance & std, comparisons
     ============================================================ */
  add("dl-init", [
    {
      q: `<p>A ReLU layer has $n_{in} = 512$ inputs. He initialization sets $\\text{Var}(w) = \\frac{2}{n_{in}}$. Find the variance and the standard deviation. Use $\\sqrt{0.00390625}\\approx0.0625$.</p>`,
      steps: [
        { do: `Variance: $\\frac{2}{512} = 0.00390625$.`,
          why: `He init uses $2/n_{in}$ because ReLU zeros half the inputs, so the surviving signal needs more variance.` },
        { do: `Std: $\\sqrt{0.00390625} \\approx 0.0625$.`,
          why: `Standard deviation is the square root of the variance; weights start near $\\pm0.0625$.` }
      ],
      answer: `Var $= 0.00390625$, std $\\approx 0.0625$`
    },
    {
      q: `<p>Compare Xavier ($\\text{Var} = \\frac{1}{n_{in}}$) and He ($\\text{Var} = \\frac{2}{n_{in}}$) standard deviations for a layer with $n_{in} = 200$. Use $\\sqrt{0.005}\\approx0.0707$ and $\\sqrt{0.01}\\approx0.1$.</p>`,
      steps: [
        { do: `Xavier variance: $\\frac{1}{200} = 0.005$, std $\\approx 0.0707$.`,
          why: `Xavier suits tanh/sigmoid layers where signal isn't halved.` },
        { do: `He variance: $\\frac{2}{200} = 0.01$, std $\\approx 0.1$.`,
          why: `He doubles the variance to compensate for ReLU dropping negatives.` },
        { do: `Ratio of stds: $\\frac{0.1}{0.0707} \\approx 1.414 = \\sqrt{2}$.`,
          why: `He's std is always $\\sqrt{2}$ times Xavier's because variance is doubled.` }
      ],
      answer: `Xavier std $\\approx 0.0707$, He std $\\approx 0.1$ (ratio $\\sqrt{2}$)`
    },
    {
      q: `<p>The Xavier rule (one common variant) using both fan-in and fan-out is $\\text{Var}(w) = \\frac{2}{n_{in} + n_{out}}$. A layer maps $n_{in} = 300$ inputs to $n_{out} = 100$ outputs. Find the variance.</p>`,
      steps: [
        { do: `Add fan-in and fan-out: $300 + 100 = 400$.`,
          why: `This Xavier variant balances signal flowing forward and gradients flowing backward.` },
        { do: `Variance: $\\frac{2}{400} = 0.005$.`,
          why: `Divide 2 by the combined fan to get the target weight variance.` }
      ],
      answer: `Var $= 0.005$`
    },
    {
      q: `<p>A layer's weights should have standard deviation $0.05$ using He init ($\\text{Var} = \\frac{2}{n_{in}}$). What is $n_{in}$? (Var $= 0.05^2 = 0.0025$.)</p>`,
      steps: [
        { do: `Convert std to variance: $0.05^2 = 0.0025$.`,
          why: `He's rule is stated in variance, so square the target std first.` },
        { do: `Set up: $0.0025 = \\frac{2}{n_{in}}$.`,
          why: `Match the He variance formula to the desired variance.` },
        { do: `Solve: $n_{in} = \\frac{2}{0.0025} = 800$.`,
          why: `Rearranging gives the number of inputs that yields this std.` }
      ],
      answer: `$n_{in} = 800$`
    },
    {
      q: `<p>Layer A has $n_{in} = 64$, layer B has $n_{in} = 256$, both using Xavier ($\\text{Var} = 1/n_{in}$). By what factor is layer A's standard deviation larger than layer B's?</p>`,
      steps: [
        { do: `Layer A std: $\\sqrt{1/64} = 1/8 = 0.125$.`,
          why: `Std is the square root of $1/n_{in}$; $\\sqrt{64}=8$.` },
        { do: `Layer B std: $\\sqrt{1/256} = 1/16 = 0.0625$.`,
          why: `$\\sqrt{256} = 16$, giving a smaller spread for the wider layer.` },
        { do: `Factor: $\\frac{0.125}{0.0625} = 2$.`,
          why: `Quadrupling the inputs halves the std, so A's is 2× larger.` }
      ],
      answer: `2× larger`
    }
  ]);

  /* ============================================================
     dl-dropout — scaling, expected active units, inverted dropout
     ============================================================ */
  add("dl-dropout", [
    {
      q: `<p>Inverted dropout with keep probability $p = 0.8$. A surviving neuron's activation is $a = 5$. To keep the expected output unchanged, survivors are scaled by $1/p$. What value is passed forward?</p>`,
      steps: [
        { do: `Compute the scale: $1/p = 1/0.8 = 1.25$.`,
          why: `Inverted dropout divides survivors by $p$ so the layer's expected total stays the same.` },
        { do: `Scale the activation: $5 \\times 1.25 = 6.25$.`,
          why: `The surviving neuron is boosted to compensate for the dropped ones.` }
      ],
      answer: `$6.25$`
    },
    {
      q: `<p>A layer has 200 neurons with keep probability $p = 0.7$. On average, how many neurons are kept, and how many are dropped, each step?</p>`,
      steps: [
        { do: `Expected kept: $0.7 \\times 200 = 140$.`,
          why: `Each neuron is kept independently with probability $p$, so the expected count is $p$ times the total.` },
        { do: `Expected dropped: $200 - 140 = 60$.`,
          why: `The rest are dropped, i.e. $(1-p)\\times200 = 0.3\\times200 = 60$.` }
      ],
      answer: `140 kept, 60 dropped`
    },
    {
      q: `<p>At test time dropout is off, but the network was trained with classic (non-inverted) dropout at keep probability $p = 0.5$. To match the training-time expected scale, every weight is multiplied by $p$. A trained weight is $w = 4$. What weight is used at test time?</p>`,
      steps: [
        { do: `Identify the scale factor: classic dropout multiplies weights by the keep probability $p = 0.5$ at test time.`,
          why: `At test time all units are active, but during training only a fraction $p$ were on; scaling by $p$ makes the expected input match.` },
        { do: `Multiply: $4 \\times 0.5 = 2$.`,
          why: `Applying the $p$ scale to the trained weight gives the test-time weight.` }
      ],
      answer: `test-time weight $= 2$`
    },
    {
      q: `<p>A hidden layer of 10 neurons has activations $[1,2,3,4,5,6,7,8,9,10]$ summing to 55. With inverted dropout at $p = 0.5$, suppose neurons 1,3,5,7,9 (values $1,3,5,7,9$) survive. What is the scaled sum passed forward, and how does it compare to the original 55?</p>`,
      steps: [
        { do: `Sum the survivors: $1+3+5+7+9 = 25$.`,
          why: `Only kept neurons contribute; dropped ones are 0.` },
        { do: `Scale by $1/p = 1/0.5 = 2$: $25 \\times 2 = 50$.`,
          why: `Inverted dropout multiplies survivors by $1/p$ to restore the expected magnitude.` },
        { do: `Compare to 55: scaled sum 50 is close, not exact.`,
          why: `Scaling preserves the expected sum across many masks, though any single mask varies.` }
      ],
      answer: `scaled sum $= 50$ (close to original 55)`
    },
    {
      q: `<p>You want about 96 neurons active on average in a layer using keep probability $p = 0.75$. How many neurons must the layer have?</p>`,
      steps: [
        { do: `Set up: expected active $= p \\times n$, so $96 = 0.75 \\times n$.`,
          why: `Expected active units equal keep probability times layer size.` },
        { do: `Solve: $n = 96 / 0.75 = 128$.`,
          why: `Dividing the target active count by $p$ gives the needed layer width.` }
      ],
      answer: `$n = 128$ neurons`
    },
    {
      q: `<p>Two dropout settings on a 100-neuron layer: setting X uses $p = 0.9$, setting Y uses $p = 0.5$. Which keeps more neurons on average, and what is the inverted-dropout scale for each?</p>`,
      steps: [
        { do: `Setting X kept: $0.9\\times100 = 90$; scale $1/0.9 \\approx 1.111$.`,
          why: `Higher keep probability means more survivors and a gentler boost.` },
        { do: `Setting Y kept: $0.5\\times100 = 50$; scale $1/0.5 = 2$.`,
          why: `Dropping half the units requires doubling survivors to keep the expected sum.` },
        { do: `Compare: X keeps more (90 vs 50) with a smaller scale.`,
          why: `Stronger dropout (lower $p$) keeps fewer units and scales them up more.` }
      ],
      answer: `X keeps 90 (scale ≈1.111), Y keeps 50 (scale 2); X keeps more`
    }
  ]);

})();
