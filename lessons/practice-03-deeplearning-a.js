/* =====================================================================
   PRACTICE PROBLEMS — MODULE 3 (Deep Learning), set A.
   Owned ids: dl-neuron, dl-activations, dl-forward-prop, dl-cross-entropy,
              dl-backprop, dl-optimizers, dl-minibatch, dl-init, dl-dropout.
   Exactly 10 problems per id, easy -> hard. Same beginner style as lessons.
   ===================================================================== */
(function () {
Object.assign(window.PRACTICE, {

  "dl-neuron": [
    { q:`<p>A neuron has weight $w=[2]$, bias $b=1$, input $x=[3]$. Compute the pre-activation $z=w^\\top x+b$.</p>`,
      steps:[
        {do:`Multiply: $2\\times 3 = 6$.`, why:`A neuron first weighs each input.`},
        {do:`Add bias: $z = 6 + 1 = 7$.`, why:`The bias shifts the result.`}
      ],
      answer:`$z = 7$` },

    { q:`<p>A neuron has weights $w=[1,1]$, bias $b=0$, input $x=[4,5]$. Compute $z$.</p>`,
      steps:[
        {do:`Dot product: $1\\times 4 + 1\\times 5 = 4 + 5 = 9$.`, why:`Weigh each input, then sum.`},
        {do:`Add bias: $z = 9 + 0 = 9$.`, why:`A zero bias leaves the sum unchanged.`}
      ],
      answer:`$z = 9$` },

    { q:`<p>A neuron has weights $w=[0.5,-1]$, bias $b=2$, input $x=[4,1]$. Compute $z=w^\\top x+b$.</p>`,
      steps:[
        {do:`Dot product: $0.5\\times 4 + (-1)\\times 1 = 2 - 1 = 1$.`, why:`Each weight scales its matching input.`},
        {do:`Add bias: $z = 1 + 2 = 3$.`, why:`The bias shifts the result before activation.`}
      ],
      answer:`$z = 3$` },

    { q:`<p>A neuron has weights $w=[2,-3,1]$, bias $b=-1$, input $x=[1,2,4]$. Compute $z$.</p>`,
      steps:[
        {do:`Multiply matching entries: $2\\times 1 = 2$, $-3\\times 2 = -6$, $1\\times 4 = 4$.`, why:`The dot product pairs each weight with its input.`},
        {do:`Sum them: $2 - 6 + 4 = 0$.`, why:`That sum is $w^\\top x$.`},
        {do:`Add bias: $z = 0 + (-1) = -1$.`, why:`The bias finishes the pre-activation.`}
      ],
      answer:`$z = -1$` },

    { q:`<p>A neuron has weights $w=[0.1,0.2,0.3]$, bias $b=0.5$, input $x=[10,5,0]$. Compute $z$.</p>`,
      steps:[
        {do:`Multiply: $0.1\\times 10 = 1$, $0.2\\times 5 = 1$, $0.3\\times 0 = 0$.`, why:`Weigh each input separately.`},
        {do:`Sum: $1 + 1 + 0 = 2$.`, why:`This is the dot product.`},
        {do:`Add bias: $z = 2 + 0.5 = 2.5$.`, why:`Bias shifts the final value.`}
      ],
      answer:`$z = 2.5$` },

    { q:`<p>A neuron outputs $z=10$ for input $x=[2,2]$ with weights $w=[3,1]$. What is the bias $b$?</p>`,
      steps:[
        {do:`Dot product: $3\\times 2 + 1\\times 2 = 6 + 2 = 8$.`, why:`Find $w^\\top x$ first.`},
        {do:`Solve $z = 8 + b = 10$, so $b = 10 - 8 = 2$.`, why:`The bias is whatever is left to reach $z$.`}
      ],
      answer:`$b = 2$` },

    { q:`<p>A neuron has weights $w=[-2,4]$, bias $b=3$, input $x=[1,-1]$. Compute $z$.</p>`,
      steps:[
        {do:`Multiply: $-2\\times 1 = -2$, $4\\times(-1) = -4$.`, why:`Mind the signs on each product.`},
        {do:`Sum: $-2 + (-4) = -6$.`, why:`This is the dot product.`},
        {do:`Add bias: $z = -6 + 3 = -3$.`, why:`Bias shifts the result up by 3.`}
      ],
      answer:`$z = -3$` },

    { q:`<p>Two neurons share input $x=[1,2]$. Neuron 1: $w=[1,0]$, $b=0$. Neuron 2: $w=[0,1]$, $b=1$. Compute both pre-activations.</p>`,
      steps:[
        {do:`Neuron 1: $1\\times 1 + 0\\times 2 + 0 = 1$.`, why:`Its weights pick out the first input only.`},
        {do:`Neuron 2: $0\\times 1 + 1\\times 2 + 1 = 3$.`, why:`Its weights pick the second input, then add bias 1.`}
      ],
      answer:`$z_1 = 1,\\; z_2 = 3$` },

    { q:`<p>A neuron has weights $w=[w_1,2]$, bias $b=0$, input $x=[3,1]$, and output $z=11$. Find $w_1$.</p>`,
      steps:[
        {do:`Write $z$: $w_1\\times 3 + 2\\times 1 + 0 = 11$.`, why:`Set the formula equal to the known output.`},
        {do:`Simplify: $3w_1 + 2 = 11$, so $3w_1 = 9$.`, why:`Move the known term across.`},
        {do:`Divide: $w_1 = 9 \\div 3 = 3$.`, why:`Solve for the unknown weight.`}
      ],
      answer:`$w_1 = 3$` },

    { q:`<p>A neuron has weights $w=[2,-1,3,0]$, bias $b=4$, input $x=[1,5,2,9]$. Compute $z$.</p>`,
      steps:[
        {do:`Multiply: $2\\times 1 = 2$, $-1\\times 5 = -5$, $3\\times 2 = 6$, $0\\times 9 = 0$.`, why:`A zero weight ignores its input.`},
        {do:`Sum: $2 - 5 + 6 + 0 = 3$.`, why:`This is the dot product.`},
        {do:`Add bias: $z = 3 + 4 = 7$.`, why:`Bias gives the final pre-activation.`}
      ],
      answer:`$z = 7$` },
  ],

  "dl-activations": [
    { q:`<p>Apply ReLU to $z=5$. Recall ReLU$(z)=\\max(0,z)$.</p>`,
      steps:[
        {do:`Compare: $\\max(0,5) = 5$.`, why:`ReLU keeps positive numbers as they are.`},
        {do:`Since 5 is positive, it passes through.`, why:`Only negatives get flattened.`}
      ],
      answer:`$\\text{ReLU}(5) = 5$` },

    { q:`<p>Apply ReLU to $z=-4$.</p>`,
      steps:[
        {do:`Compare: $\\max(0,-4)$.`, why:`ReLU takes the larger of 0 and $z$.`},
        {do:`Since $-4 < 0$, the answer is $0$.`, why:`ReLU flattens negatives to zero.`}
      ],
      answer:`$\\text{ReLU}(-4) = 0$` },

    { q:`<p>Apply the sigmoid to $z=0$. Recall $\\sigma(z)=\\frac{1}{1+e^{-z}}$.</p>`,
      steps:[
        {do:`Plug in: $\\sigma(0) = \\frac{1}{1+e^{0}}$.`, why:`Substitute $z=0$ into the formula.`},
        {do:`Since $e^{0}=1$: $\\frac{1}{1+1} = \\frac{1}{2} = 0.5$.`, why:`Sigmoid of 0 sits exactly in the middle.`}
      ],
      answer:`$\\sigma(0) = 0.5$` },

    { q:`<p>Apply the sigmoid to $z=2$. Use $e^{-2}\\approx 0.135$. Round to 2 decimals.</p>`,
      steps:[
        {do:`Plug in: $\\sigma(2) = \\frac{1}{1+0.135} = \\frac{1}{1.135}$.`, why:`Substitute the given value of $e^{-2}$.`},
        {do:`Divide: $\\frac{1}{1.135} \\approx 0.88$.`, why:`A large positive input pushes sigmoid near 1.`}
      ],
      answer:`$\\sigma(2) \\approx 0.88$` },

    { q:`<p>Apply the sigmoid to $z=-1$. Use $e^{1}\\approx 2.718$. Round to 2 decimals.</p>`,
      steps:[
        {do:`Plug in: $\\sigma(-1) = \\frac{1}{1+e^{1}} = \\frac{1}{1+2.718}$.`, why:`For $z=-1$, the exponent $-z$ equals $+1$.`},
        {do:`Divide: $\\frac{1}{3.718} \\approx 0.27$.`, why:`A negative input pushes sigmoid below 0.5.`}
      ],
      answer:`$\\sigma(-1) \\approx 0.27$` },

    { q:`<p>Apply Leaky ReLU (slope $0.01$ for negatives) to $z=-3$.</p>`,
      steps:[
        {do:`Since $z<0$, use the small slope: $0.01\\times(-3)$.`, why:`Leaky ReLU lets a tiny bit through instead of a flat 0.`},
        {do:`Compute: $0.01\\times(-3) = -0.03$.`, why:`This keeps the neuron from fully dying.`}
      ],
      answer:`$-0.03$` },

    { q:`<p>Apply tanh to $z=0$. Recall $\\tanh(z)=\\frac{e^{z}-e^{-z}}{e^{z}+e^{-z}}$.</p>`,
      steps:[
        {do:`Plug in: $\\tanh(0) = \\frac{e^{0}-e^{0}}{e^{0}+e^{0}}$.`, why:`Substitute $z=0$.`},
        {do:`Compute: $\\frac{1-1}{1+1} = \\frac{0}{2} = 0$.`, why:`Tanh passes through the origin.`}
      ],
      answer:`$\\tanh(0) = 0$` },

    { q:`<p>A neuron computes $z=w^\\top x+b$ with $w=[1,2]$, $b=-1$, $x=[2,1]$. Then ReLU is applied. What is the neuron's output?</p>`,
      steps:[
        {do:`Pre-activation: $1\\times 2 + 2\\times 1 - 1 = 2 + 2 - 1 = 3$.`, why:`First compute $z$ as usual.`},
        {do:`ReLU: $\\max(0,3) = 3$.`, why:`The positive value passes through.`}
      ],
      answer:`$3$` },

    { q:`<p>Apply tanh to $z=1$. Use $e^{1}\\approx 2.718$ and $e^{-1}\\approx 0.368$. Round to 2 decimals.</p>`,
      steps:[
        {do:`Top: $e^{1}-e^{-1} = 2.718 - 0.368 = 2.350$.`, why:`The numerator measures the difference.`},
        {do:`Bottom: $e^{1}+e^{-1} = 2.718 + 0.368 = 3.086$.`, why:`The denominator measures the total.`},
        {do:`Divide: $2.350 \\div 3.086 \\approx 0.76$.`, why:`Tanh squishes into the range $-1$ to $1$.`}
      ],
      answer:`$\\tanh(1) \\approx 0.76$` },

    { q:`<p>For sigmoid, the slope is $\\sigma'(z)=\\sigma(z)\\,(1-\\sigma(z))$. If $\\sigma(z)=0.8$, find the slope.</p>`,
      steps:[
        {do:`Plug in: $0.8\\times(1-0.8)$.`, why:`Use the given activation value.`},
        {do:`Compute: $0.8\\times 0.2 = 0.16$.`, why:`This slope is used later in backprop.`}
      ],
      answer:`$\\sigma'(z) = 0.16$` },
  ],

  "dl-forward-prop": [
    { q:`<p>One layer with ReLU. $w=2$, $b=-3$, input $x=4$. What does it output?</p>`,
      steps:[
        {do:`Pre-activation: $z = 2\\times 4 - 3 = 5$.`, why:`Each layer first computes $z=Wx+b$.`},
        {do:`ReLU: $a = \\max(0,5) = 5$.`, why:`The activation gives the layer's output.`}
      ],
      answer:`$a = 5$` },

    { q:`<p>Two layers, ReLU each. Input $x=2$. Layer 1: $w^{[1]}=3$, $b^{[1]}=-1$. Layer 2: $w^{[2]}=-2$, $b^{[2]}=4$. Find the output $a^{[2]}$.</p>`,
      steps:[
        {do:`Layer 1: $z^{[1]}=3\\times 2 - 1 = 5$, $a^{[1]}=\\max(0,5)=5$.`, why:`Run the input through layer 1.`},
        {do:`Layer 2: $z^{[2]}=-2\\times 5 + 4 = -6$, $a^{[2]}=\\max(0,-6)=0$.`, why:`Layer 1's output feeds layer 2.`}
      ],
      answer:`$a^{[2]} = 0$` },

    { q:`<p>One layer with sigmoid. $w=[1,1]$, $b=0$, input $x=[0,0]$. Output? Recall $\\sigma(0)=0.5$.</p>`,
      steps:[
        {do:`Pre-activation: $1\\times 0 + 1\\times 0 + 0 = 0$.`, why:`Compute $z$ from the inputs.`},
        {do:`Sigmoid: $\\sigma(0) = 0.5$.`, why:`Sigmoid of 0 is exactly one half.`}
      ],
      answer:`$a = 0.5$` },

    { q:`<p>A layer has two neurons (ReLU). Input $x=[1,2]$. Neuron 1: $w=[1,0]$, $b=0$. Neuron 2: $w=[0,1]$, $b=-3$. Find the layer's output vector $a$.</p>`,
      steps:[
        {do:`Neuron 1: $z=1\\times 1 + 0\\times 2 + 0 = 1$, $\\max(0,1)=1$.`, why:`Each neuron computes its own $z$.`},
        {do:`Neuron 2: $z=0\\times 1 + 1\\times 2 - 3 = -1$, $\\max(0,-1)=0$.`, why:`ReLU flattens the negative result.`}
      ],
      answer:`$a = [1, 0]$` },

    { q:`<p>Two layers, ReLU each. Input $x=3$. Layer 1: $w^{[1]}=2$, $b^{[1]}=1$. Layer 2: $w^{[2]}=1$, $b^{[2]}=-2$. Find $a^{[2]}$.</p>`,
      steps:[
        {do:`Layer 1: $z^{[1]}=2\\times 3 + 1 = 7$, $a^{[1]}=\\max(0,7)=7$.`, why:`Push the input through layer 1.`},
        {do:`Layer 2: $z^{[2]}=1\\times 7 - 2 = 5$, $a^{[2]}=\\max(0,5)=5$.`, why:`Chain $a^{[1]}$ into layer 2.`}
      ],
      answer:`$a^{[2]} = 5$` },

    { q:`<p>One layer with ReLU on input $x=[2,-1,3]$, weights $w=[1,2,-1]$, bias $b=0$. Output?</p>`,
      steps:[
        {do:`Dot product: $1\\times 2 + 2\\times(-1) + (-1)\\times 3 = 2 - 2 - 3 = -3$.`, why:`Compute $w^\\top x$.`},
        {do:`Add bias then ReLU: $z=-3+0=-3$, $\\max(0,-3)=0$.`, why:`A negative pre-activation gives output 0.`}
      ],
      answer:`$a = 0$` },

    { q:`<p>Two layers. Layer 1 uses ReLU, layer 2 uses sigmoid. Input $x=1$. Layer 1: $w^{[1]}=4$, $b^{[1]}=-4$. Layer 2: $w^{[2]}=2$, $b^{[2]}=0$. Find $a^{[2]}$. Recall $\\sigma(0)=0.5$.</p>`,
      steps:[
        {do:`Layer 1: $z^{[1]}=4\\times 1 - 4 = 0$, $a^{[1]}=\\max(0,0)=0$.`, why:`ReLU keeps 0 as 0.`},
        {do:`Layer 2: $z^{[2]}=2\\times 0 + 0 = 0$, $a^{[2]}=\\sigma(0)=0.5$.`, why:`Sigmoid of 0 is one half.`}
      ],
      answer:`$a^{[2]} = 0.5$` },

    { q:`<p>A hidden layer has 2 ReLU neurons, then 1 output neuron (no activation). Input $x=2$. Hidden neuron 1: $w=1$, $b=0$. Hidden neuron 2: $w=-1$, $b=3$. Output neuron: weights $[1,1]$, bias $0$. Find the final output.</p>`,
      steps:[
        {do:`Hidden neuron 1: $z=1\\times 2 + 0 = 2$, $\\max(0,2)=2$.`, why:`First hidden activation.`},
        {do:`Hidden neuron 2: $z=-1\\times 2 + 3 = 1$, $\\max(0,1)=1$.`, why:`Second hidden activation.`},
        {do:`Output: $1\\times 2 + 1\\times 1 + 0 = 3$.`, why:`The output neuron combines both hidden values.`}
      ],
      answer:`$3$` },

    { q:`<p>Forward pass with matrices. Layer takes $x=[1,2]$, weight rows $W=\\begin{bmatrix}1&0\\\\0&2\\end{bmatrix}$, bias $b=[1,-1]$, ReLU. Find $a$.</p>`,
      steps:[
        {do:`Row 1: $1\\times 1 + 0\\times 2 + 1 = 2$, $\\max(0,2)=2$.`, why:`Each row of $W$ is one neuron.`},
        {do:`Row 2: $0\\times 1 + 2\\times 2 - 1 = 3$, $\\max(0,3)=3$.`, why:`The second neuron's pre-activation and ReLU.`}
      ],
      answer:`$a = [2, 3]$` },

    { q:`<p>Three layers, ReLU each. Input $x=1$. Weights all $w=2$, biases all $b=0$. Find $a^{[3]}$.</p>`,
      steps:[
        {do:`Layer 1: $z=2\\times 1=2$, $a^{[1]}=2$.`, why:`Each layer doubles the value (ReLU keeps positives).`},
        {do:`Layer 2: $z=2\\times 2=4$, $a^{[2]}=4$.`, why:`Feed $a^{[1]}$ forward.`},
        {do:`Layer 3: $z=2\\times 4=8$, $a^{[3]}=8$.`, why:`Each layer multiplies by 2, so $2^3=8$.`}
      ],
      answer:`$a^{[3]} = 8$` },
  ],

  "dl-cross-entropy": [
    { q:`<p>True label $y=1$. Model predicts $z=0.9$. Find the loss $L=-[y\\log z + (1-y)\\log(1-z)]$. Use $\\log(0.9)\\approx -0.105$.</p>`,
      steps:[
        {do:`Since $y=1$, only the first part survives: $L=-\\log z$.`, why:`The $(1-y)$ term is zero.`},
        {do:`Compute: $L=-\\log(0.9)=-(-0.105)=0.105$.`, why:`A confident-correct guess gives a small loss.`}
      ],
      answer:`$L \\approx 0.105$` },

    { q:`<p>True label $y=1$. Model predicts $z=0.1$. Find the loss. Use $\\log(0.1)\\approx -2.303$.</p>`,
      steps:[
        {do:`Since $y=1$: $L=-\\log z = -\\log(0.1)$.`, why:`Only the first term matters when $y=1$.`},
        {do:`Compute: $-(-2.303)=2.303$.`, why:`A wrong, confident guess gives a big loss.`}
      ],
      answer:`$L \\approx 2.303$` },

    { q:`<p>True label $y=0$. Model predicts $z=0.2$. Find the loss. Use $\\log(0.8)\\approx -0.223$.</p>`,
      steps:[
        {do:`Since $y=0$, only the second part survives: $L=-\\log(1-z)$.`, why:`The $y\\log z$ term is zero.`},
        {do:`Compute: $-\\log(0.8)=-(-0.223)=0.223$.`, why:`Predicting 0.2 for a 0 label is fairly good.`}
      ],
      answer:`$L \\approx 0.223$` },

    { q:`<p>True label $y=1$. Model predicts $z=0.01$. Find the loss. Use $\\log(0.01)\\approx -4.605$.</p>`,
      steps:[
        {do:`Since $y=1$: $L=-\\log(0.01)$.`, why:`Confident and wrong: $z$ is far from 1.`},
        {do:`Compute: $-(-4.605)=4.605$.`, why:`Cross-entropy punishes confident wrong answers hardest.`}
      ],
      answer:`$L \\approx 4.605$` },

    { q:`<p>True label $y=0$. Model predicts $z=0.9$. Find the loss. Use $\\log(0.1)\\approx -2.303$.</p>`,
      steps:[
        {do:`Since $y=0$: $L=-\\log(1-z)=-\\log(0.1)$.`, why:`We need $1-z = 1-0.9 = 0.1$.`},
        {do:`Compute: $-(-2.303)=2.303$.`, why:`Saying 0.9 when the truth is 0 is badly wrong.`}
      ],
      answer:`$L \\approx 2.303$` },

    { q:`<p>True label $y=1$. Model predicts $z=0.5$. Find the loss. Use $\\log(0.5)\\approx -0.693$.</p>`,
      steps:[
        {do:`Since $y=1$: $L=-\\log(0.5)$.`, why:`A 0.5 guess is "no idea".`},
        {do:`Compute: $-(-0.693)=0.693$.`, why:`This is the loss for a coin-flip prediction.`}
      ],
      answer:`$L \\approx 0.693$` },

    { q:`<p>Two examples, both with $y=1$. Predictions $z=0.8$ and $z=0.6$. Find the average loss. Use $\\log(0.8)\\approx -0.223$, $\\log(0.6)\\approx -0.511$.</p>`,
      steps:[
        {do:`Example 1: $L_1=-\\log(0.8)=0.223$.`, why:`Each $y=1$ uses $-\\log z$.`},
        {do:`Example 2: $L_2=-\\log(0.6)=0.511$.`, why:`Same rule, second prediction.`},
        {do:`Average: $(0.223+0.511)\\div 2 = 0.734\\div 2 = 0.367$.`, why:`The dataset loss is the mean over examples.`}
      ],
      answer:`$\\bar L \\approx 0.367$` },

    { q:`<p>True label $y=1$. A model first outputs $z=0.7$, then improves to $z=0.95$. By how much did the loss drop? Use $\\log(0.7)\\approx -0.357$, $\\log(0.95)\\approx -0.051$.</p>`,
      steps:[
        {do:`Before: $L=-\\log(0.7)=0.357$.`, why:`Loss at the first prediction.`},
        {do:`After: $L=-\\log(0.95)=0.051$.`, why:`Loss after improving.`},
        {do:`Drop: $0.357 - 0.051 = 0.306$.`, why:`A better-matched prediction lowers the loss.`}
      ],
      answer:`drop $\\approx 0.306$` },

    { q:`<p>True label $y=0$. Model predicts $z=0.5$. Find the loss. Use $\\log(0.5)\\approx -0.693$.</p>`,
      steps:[
        {do:`Since $y=0$: $L=-\\log(1-z)=-\\log(0.5)$.`, why:`$1-z = 1-0.5 = 0.5$.`},
        {do:`Compute: $-(-0.693)=0.693$.`, why:`A 0.5 guess always gives the same loss either way.`}
      ],
      answer:`$L \\approx 0.693$` },

    { q:`<p>For binary cross-entropy with sigmoid output, the slope is $\\frac{\\partial L}{\\partial z}=z-y$. If $z=0.7$ and $y=1$, find this slope.</p>`,
      steps:[
        {do:`Plug in: $z-y = 0.7 - 1$.`, why:`Use the clean gradient formula for sigmoid + cross-entropy.`},
        {do:`Compute: $0.7 - 1 = -0.3$.`, why:`A negative slope means raising $z$ lowers the loss.`}
      ],
      answer:`$\\frac{\\partial L}{\\partial z} = -0.3$` },
  ],

  "dl-backprop": [
    { q:`<p>One weight has gradient $\\frac{\\partial L}{\\partial w}=4$. Learning rate $\\eta=0.5$, current $w=10$. Find the new $w$ using $w\\leftarrow w-\\eta\\frac{\\partial L}{\\partial w}$.</p>`,
      steps:[
        {do:`Step size: $\\eta\\times\\frac{\\partial L}{\\partial w} = 0.5\\times 4 = 2$.`, why:`Scale the gradient by the learning rate.`},
        {do:`Update: $w = 10 - 2 = 8$.`, why:`Step downhill, against the gradient.`}
      ],
      answer:`$w = 8$` },

    { q:`<p>Chain three slopes: $\\frac{\\partial L}{\\partial a}=2$, $\\frac{\\partial a}{\\partial z}=0.5$, $\\frac{\\partial z}{\\partial w}=3$. Find $\\frac{\\partial L}{\\partial w}$.</p>`,
      steps:[
        {do:`Multiply: $2\\times 0.5 = 1$.`, why:`The chain rule multiplies slopes in sequence.`},
        {do:`Then $1\\times 3 = 3$.`, why:`Include the last link to $w$.`}
      ],
      answer:`$\\frac{\\partial L}{\\partial w} = 3$` },

    { q:`<p>Given $\\frac{\\partial L}{\\partial w}=3$ (from chaining), $w=1$, $\\eta=0.1$. Find the new $w$.</p>`,
      steps:[
        {do:`Step: $0.1\\times 3 = 0.3$.`, why:`Learning rate times gradient is the step size.`},
        {do:`Update: $w = 1 - 0.3 = 0.7$.`, why:`The weight moves downhill to lower the loss.`}
      ],
      answer:`$w = 0.7$` },

    { q:`<p>Chain the slopes then update. $\\frac{\\partial L}{\\partial a}=4$, $\\frac{\\partial a}{\\partial z}=1$, $\\frac{\\partial z}{\\partial w}=2$, $w=5$, $\\eta=0.5$. Find the new $w$.</p>`,
      steps:[
        {do:`Chain: $4\\times 1\\times 2 = 8$.`, why:`Multiply the three slopes for $\\frac{\\partial L}{\\partial w}$.`},
        {do:`Step: $0.5\\times 8 = 4$.`, why:`Scale by the learning rate.`},
        {do:`Update: $w = 5 - 4 = 1$.`, why:`Move against the gradient.`}
      ],
      answer:`$w = 1$` },

    { q:`<p>A neuron uses ReLU. For this example $z=3$ (positive), so the ReLU slope $\\frac{\\partial a}{\\partial z}=1$. If $\\frac{\\partial L}{\\partial a}=2$ and the input $x=\\frac{\\partial z}{\\partial w}=4$, find $\\frac{\\partial L}{\\partial w}$.</p>`,
      steps:[
        {do:`ReLU slope is 1 because $z>0$.`, why:`ReLU passes positive values, so its slope there is 1.`},
        {do:`Chain: $2\\times 1\\times 4 = 8$.`, why:`Multiply loss slope, activation slope, and input.`}
      ],
      answer:`$\\frac{\\partial L}{\\partial w} = 8$` },

    { q:`<p>A neuron uses ReLU with $z=-2$ for this example, so the ReLU slope is $0$. If $\\frac{\\partial L}{\\partial a}=5$ and $x=3$, find $\\frac{\\partial L}{\\partial w}$.</p>`,
      steps:[
        {do:`ReLU slope is 0 because $z<0$.`, why:`ReLU is flat for negatives, so it blocks the gradient.`},
        {do:`Chain: $5\\times 0\\times 3 = 0$.`, why:`A zero slope anywhere makes the whole product zero.`}
      ],
      answer:`$\\frac{\\partial L}{\\partial w} = 0$` },

    { q:`<p>Sigmoid output $a=0.8$, so its slope is $a(1-a)=0.16$. With $\\frac{\\partial L}{\\partial a}=2$ and input $x=5$, find $\\frac{\\partial L}{\\partial w}$.</p>`,
      steps:[
        {do:`Activation slope: $0.8\\times(1-0.8)=0.16$.`, why:`Sigmoid's slope is $a(1-a)$.`},
        {do:`Chain: $2\\times 0.16\\times 5 = 1.6$.`, why:`Multiply all three links of the chain.`}
      ],
      answer:`$\\frac{\\partial L}{\\partial w} = 1.6$` },

    { q:`<p>Update the bias. The gradient is $\\frac{\\partial L}{\\partial b}=2$, current $b=1$, $\\eta=0.3$. Find the new $b$.</p>`,
      steps:[
        {do:`Step: $0.3\\times 2 = 0.6$.`, why:`Bias updates the same way as weights.`},
        {do:`Update: $b = 1 - 0.6 = 0.4$.`, why:`Step downhill against the gradient.`}
      ],
      answer:`$b = 0.4$` },

    { q:`<p>Two gradient-descent steps. $w=2$, $\\eta=0.5$, and the gradient is $\\frac{\\partial L}{\\partial w}=2$ each step. Find $w$ after 2 updates.</p>`,
      steps:[
        {do:`Step 1: $w = 2 - 0.5\\times 2 = 2 - 1 = 1$.`, why:`Apply the update once.`},
        {do:`Step 2: $w = 1 - 0.5\\times 2 = 1 - 1 = 0$.`, why:`Apply the same update again.`}
      ],
      answer:`$w = 0$` },

    { q:`<p>Full backprop for one weight. Loss slope $\\frac{\\partial L}{\\partial a}=-2$, sigmoid slope $0.25$, input $x=4$, $\\eta=0.1$, $w=1$. Find the new $w$.</p>`,
      steps:[
        {do:`Chain: $-2\\times 0.25\\times 4 = -2$.`, why:`Multiply loss slope, activation slope, and input.`},
        {do:`Step: $\\eta\\times(-2) = 0.1\\times(-2) = -0.2$.`, why:`Scale the gradient by the learning rate.`},
        {do:`Update: $w = 1 - (-0.2) = 1.2$.`, why:`Subtracting a negative step moves $w$ up.`}
      ],
      answer:`$w = 1.2$` },
  ],

  "dl-optimizers": [
    { q:`<p>Plain SGD: $w\\leftarrow w-\\eta\\frac{\\partial L}{\\partial w}$. With $w=5$, $\\eta=0.1$, gradient $2$, find the new $w$.</p>`,
      steps:[
        {do:`Step: $0.1\\times 2 = 0.2$.`, why:`SGD takes one fixed step downhill.`},
        {do:`Update: $w = 5 - 0.2 = 4.8$.`, why:`Move against the gradient.`}
      ],
      answer:`$w = 4.8$` },

    { q:`<p>Momentum keeps a running velocity: $v\\leftarrow \\beta v + (1-\\beta)g$. With $\\beta=0.9$, $v=0$, gradient $g=2$, find the new $v$.</p>`,
      steps:[
        {do:`Plug in: $v = 0.9\\times 0 + 0.1\\times 2$.`, why:`Blend old velocity with the new gradient.`},
        {do:`Compute: $0 + 0.2 = 0.2$.`, why:`On step 1 velocity starts small.`}
      ],
      answer:`$v = 0.2$` },

    { q:`<p>Continue the momentum from $v=0.2$ with $\\beta=0.9$ and another gradient $g=2$. Find the next $v$.</p>`,
      steps:[
        {do:`Plug in: $v = 0.9\\times 0.2 + 0.1\\times 2$.`, why:`Carry forward 90% of past velocity.`},
        {do:`Compute: $0.18 + 0.2 = 0.38$.`, why:`Velocity grows as gradients keep pointing the same way.`}
      ],
      answer:`$v = 0.38$` },

    { q:`<p>Momentum update uses the velocity, not the raw gradient: $w\\leftarrow w-\\eta v$. With $w=1$, $\\eta=1$, $v=0.38$, find the new $w$.</p>`,
      steps:[
        {do:`Step: $\\eta\\times v = 1\\times 0.38 = 0.38$.`, why:`Momentum steps by the smoothed velocity.`},
        {do:`Update: $w = 1 - 0.38 = 0.62$.`, why:`Move downhill using accumulated speed.`}
      ],
      answer:`$w = 0.62$` },

    { q:`<p>RMSprop tracks squared gradients: $s\\leftarrow \\beta s + (1-\\beta)g^2$. With $\\beta=0.9$, $s=0$, gradient $g=4$, find the new $s$.</p>`,
      steps:[
        {do:`Square the gradient: $g^2 = 4^2 = 16$.`, why:`RMSprop uses the size of the gradient.`},
        {do:`Plug in: $s = 0.9\\times 0 + 0.1\\times 16 = 1.6$.`, why:`Blend old $s$ with the new squared gradient.`}
      ],
      answer:`$s = 1.6$` },

    { q:`<p>RMSprop step: $w\\leftarrow w-\\eta\\frac{g}{\\sqrt{s}+\\epsilon}$. With $w=2$, $\\eta=0.1$, $g=4$, $s=16$, $\\epsilon\\approx 0$, find the new $w$.</p>`,
      steps:[
        {do:`Square root: $\\sqrt{16}=4$.`, why:`RMSprop divides by the typical gradient size.`},
        {do:`Scaled step: $0.1\\times\\frac{4}{4} = 0.1\\times 1 = 0.1$.`, why:`Big gradients get tamed by the division.`},
        {do:`Update: $w = 2 - 0.1 = 1.9$.`, why:`The adjusted step keeps progress steady.`}
      ],
      answer:`$w = 1.9$` },

    { q:`<p>Gradient stays at $+2$. Plain SGD with step size 1 each. How far do you move after 3 steps?</p>`,
      steps:[
        {do:`Each step moves $2$.`, why:`Plain descent uses the same fixed step each time.`},
        {do:`Total: $2+2+2 = 6$.`, why:`Steady but no acceleration.`}
      ],
      answer:`$6$` },

    { q:`<p>Adam bias-corrects the velocity: $\\hat v = \\frac{v}{1-\\beta^t}$. With $v=0.2$, $\\beta=0.9$, step $t=1$, find $\\hat v$.</p>`,
      steps:[
        {do:`Denominator: $1-\\beta^t = 1-0.9^1 = 0.1$.`, why:`Correction undoes the cold start at $v=0$.`},
        {do:`Divide: $\\hat v = \\frac{0.2}{0.1} = 2$.`, why:`Early steps get scaled up so they aren't too tiny.`}
      ],
      answer:`$\\hat v = 2$` },

    { q:`<p>Adam combines both: $w\\leftarrow w-\\eta\\frac{\\hat v}{\\sqrt{\\hat s}+\\epsilon}$. With $w=1$, $\\eta=0.1$, $\\hat v=2$, $\\hat s=4$, $\\epsilon\\approx 0$, find the new $w$.</p>`,
      steps:[
        {do:`Square root: $\\sqrt{4}=2$.`, why:`Adam divides the velocity by the gradient scale.`},
        {do:`Step: $0.1\\times\\frac{2}{2} = 0.1$.`, why:`Momentum (top) and RMSprop (bottom) together.`},
        {do:`Update: $w = 1 - 0.1 = 0.9$.`, why:`Adam adapts the step per weight.`}
      ],
      answer:`$w = 0.9$` },

    { q:`<p>Compare speeds. Gradient is $+2,+2,+2$. Momentum rule: keep 90% of past speed, then add the gradient ($v\\leftarrow 0.9v+g$, start $v=0$). Find the 3rd step's velocity and compare to plain SGD's fixed step of $2$.</p>`,
      steps:[
        {do:`Velocities: $v_1=2$, $v_2=0.9\\times 2 + 2 = 3.8$, $v_3=0.9\\times 3.8 + 2 = 5.42$.`, why:`Momentum accumulates when the gradient is consistent.`},
        {do:`Compare: plain SGD still steps just $2$, but momentum steps $\\approx 5.42$.`, why:`Adam (built on momentum) accelerates, so training is faster.`}
      ],
      answer:`momentum step $\\approx 5.42$ vs SGD $2$` },
  ],

  "dl-minibatch": [
    { q:`<p>You have $N=1000$ examples and a batch size of $100$. How many iterations are in one epoch? Use $\\frac{N}{\\text{batch size}}$.</p>`,
      steps:[
        {do:`Divide: $1000 \\div 100 = 10$.`, why:`Each batch is one weight update.`},
        {do:`So 10 updates make one full pass.`, why:`One epoch covers every example once.`}
      ],
      answer:`$10$ iterations` },

    { q:`<p>$N=800$ examples, batch size $200$. How many iterations per epoch?</p>`,
      steps:[
        {do:`Divide: $800 \\div 200 = 4$.`, why:`Iterations per epoch is $N$ over batch size.`},
        {do:`So 4 updates make one epoch.`, why:`Each batch triggers one update.`}
      ],
      answer:`$4$ iterations` },

    { q:`<p>$N=1000$, batch size $100$, trained for $5$ epochs. How many total weight updates?</p>`,
      steps:[
        {do:`Per epoch: $1000 \\div 100 = 10$ iterations.`, why:`First find updates in one pass.`},
        {do:`Total: $10\\times 5 = 50$.`, why:`Each epoch repeats the same number of updates.`}
      ],
      answer:`$50$ updates` },

    { q:`<p>A batch size of $1$ has a special name. How many iterations per epoch if $N=600$ and batch size is $1$?</p>`,
      steps:[
        {do:`Divide: $600 \\div 1 = 600$.`, why:`Batch size 1 means one update per example.`},
        {do:`This is called stochastic gradient descent.`, why:`Fast per step but very noisy.`}
      ],
      answer:`$600$ iterations` },

    { q:`<p>If the whole dataset is used as one batch ($N=500$, batch size $500$), how many iterations per epoch?</p>`,
      steps:[
        {do:`Divide: $500 \\div 500 = 1$.`, why:`One batch equals one update.`},
        {do:`This is full-batch gradient descent.`, why:`Accurate but slow per step.`}
      ],
      answer:`$1$ iteration` },

    { q:`<p>$N=2048$ examples, batch size $256$. Iterations per epoch?</p>`,
      steps:[
        {do:`Divide: $2048 \\div 256 = 8$.`, why:`Standard iterations-per-epoch formula.`},
        {do:`So 8 updates make one epoch.`, why:`Eight batches cover all 2048 examples.`}
      ],
      answer:`$8$ iterations` },

    { q:`<p>You want $20$ iterations per epoch and have $N=1000$ examples. What batch size do you need?</p>`,
      steps:[
        {do:`Rearrange: batch size $=\\frac{N}{\\text{iterations}}$.`, why:`Solve the formula for batch size.`},
        {do:`Compute: $1000 \\div 20 = 50$.`, why:`50 examples per batch gives 20 updates.`}
      ],
      answer:`batch size $= 50$` },

    { q:`<p>$N=900$, batch size $100$, trained $3$ epochs. Total updates?</p>`,
      steps:[
        {do:`Per epoch: $900 \\div 100 = 9$.`, why:`Updates in one pass.`},
        {do:`Total: $9\\times 3 = 27$.`, why:`Multiply by the number of epochs.`}
      ],
      answer:`$27$ updates` },

    { q:`<p>A run does $40$ total updates over $4$ epochs, with $N=1000$ examples. What was the batch size?</p>`,
      steps:[
        {do:`Iterations per epoch: $40 \\div 4 = 10$.`, why:`Split total updates across epochs.`},
        {do:`Batch size: $1000 \\div 10 = 100$.`, why:`Use the formula in reverse.`}
      ],
      answer:`batch size $= 100$` },

    { q:`<p>$N=1050$ examples, batch size $100$. The last batch is smaller. How many iterations per epoch (counting the partial batch)?</p>`,
      steps:[
        {do:`Full batches: $1000 \\div 100 = 10$.`, why:`Ten full batches of 100 cover 1000 examples.`},
        {do:`Leftover: $1050 - 1000 = 50$ examples form one more batch.`, why:`The remainder still needs an update.`},
        {do:`Total: $10 + 1 = 11$.`, why:`Round up when examples do not divide evenly.`}
      ],
      answer:`$11$ iterations` },
  ],

  "dl-init": [
    { q:`<p>Xavier init sets $\\text{Var}(w)=\\frac{1}{n_{in}}$. A layer has $n_{in}=100$ inputs. Find the variance.</p>`,
      steps:[
        {do:`Plug in: $\\frac{1}{100} = 0.01$.`, why:`More inputs means smaller starting weights.`},
        {do:`So the variance is $0.01$.`, why:`This keeps the summed signal at a healthy size.`}
      ],
      answer:`$\\text{Var}(w) = 0.01$` },

    { q:`<p>For $n_{in}=100$, the variance is $0.01$. What is the typical spread (standard deviation) of the weights?</p>`,
      steps:[
        {do:`Standard deviation is $\\sqrt{\\text{Var}}$: $\\sqrt{0.01}$.`, why:`Spread is the square root of variance.`},
        {do:`Compute: $\\sqrt{0.01} = 0.1$.`, why:`So weights start around $\\pm 0.1$.`}
      ],
      answer:`std $= 0.1$` },

    { q:`<p>A layer has $n_{in}=4$ inputs. Find the Xavier variance and the spread.</p>`,
      steps:[
        {do:`Variance: $\\frac{1}{4} = 0.25$.`, why:`Fewer inputs allow larger weights.`},
        {do:`Spread: $\\sqrt{0.25} = 0.5$.`, why:`Bigger than with 100 inputs, because fewer terms add up.`}
      ],
      answer:`Var $=0.25$, std $=0.5$` },

    { q:`<p>A layer has $n_{in}=25$ inputs. Find the Xavier spread (standard deviation).</p>`,
      steps:[
        {do:`Variance: $\\frac{1}{25} = 0.04$.`, why:`Apply the Xavier rule.`},
        {do:`Spread: $\\sqrt{0.04} = 0.2$.`, why:`Take the square root for the standard deviation.`}
      ],
      answer:`std $= 0.2$` },

    { q:`<p>Why is starting all weights at zero a bad idea? Check it: two neurons share input $x=[1,1]$ with all weights $0$ and bias $0$. What does each output (pre-activation)?</p>`,
      steps:[
        {do:`Each neuron: $0\\times 1 + 0\\times 1 + 0 = 0$.`, why:`Zero weights give zero output for every neuron.`},
        {do:`Both neurons are identical, so they get the same gradient and update.`, why:`They never become different, so the network cannot learn distinct features.`}
      ],
      answer:`both output $0$; symmetry never breaks` },

    { q:`<p>He init (for ReLU) uses $\\text{Var}(w)=\\frac{2}{n_{in}}$. With $n_{in}=200$, find the variance.</p>`,
      steps:[
        {do:`Plug in: $\\frac{2}{200} = 0.01$.`, why:`He init doubles Xavier's variance for ReLU layers.`},
        {do:`So the variance is $0.01$.`, why:`The extra factor of 2 makes up for ReLU zeroing half the values.`}
      ],
      answer:`$\\text{Var}(w) = 0.01$` },

    { q:`<p>He init with $n_{in}=8$: find the variance and the spread.</p>`,
      steps:[
        {do:`Variance: $\\frac{2}{8} = 0.25$.`, why:`Use the He rule $\\frac{2}{n_{in}}$.`},
        {do:`Spread: $\\sqrt{0.25} = 0.5$.`, why:`Square root of the variance.`}
      ],
      answer:`Var $=0.25$, std $=0.5$` },

    { q:`<p>Compare spreads: layer A has $n_{in}=100$, layer B has $n_{in}=400$ (Xavier). Which starts with larger weights, and what are the two spreads?</p>`,
      steps:[
        {do:`A: $\\sqrt{1/100} = 0.1$.`, why:`Xavier spread for 100 inputs.`},
        {do:`B: $\\sqrt{1/400} = 0.05$.`, why:`More inputs, smaller spread.`},
        {do:`A has larger weights ($0.1 > 0.05$).`, why:`Fewer inputs need bigger weights to keep the signal alive.`}
      ],
      answer:`A: $0.1$, B: $0.05$; A larger` },

    { q:`<p>If weights start too big, signals explode. Suppose a layer multiplies its input by about $2$ each pass. After $5$ layers, by what factor has a signal grown?</p>`,
      steps:[
        {do:`Each layer multiplies by 2, over 5 layers: $2^5$.`, why:`Multiplicative growth compounds across layers.`},
        {do:`Compute: $2^5 = 32$.`, why:`This blow-up is why we keep initial weights small.`}
      ],
      answer:`$32\\times$` },

    { q:`<p>A designer wants the Xavier spread to be $0.25$. What value of $n_{in}$ gives this?</p>`,
      steps:[
        {do:`Spread squared is the variance: $0.25^2 = 0.0625$.`, why:`Variance equals std squared.`},
        {do:`Solve $\\frac{1}{n_{in}} = 0.0625$, so $n_{in} = \\frac{1}{0.0625} = 16$.`, why:`Invert the Xavier rule.`}
      ],
      answer:`$n_{in} = 16$` },
  ],

  "dl-dropout": [
    { q:`<p>A layer of $50$ neurons uses dropout rate $p=0.2$. About how many neurons are kept each step? Keep probability is $1-p$.</p>`,
      steps:[
        {do:`Keep probability: $1 - 0.2 = 0.8$.`, why:`Each neuron survives with probability $1-p$.`},
        {do:`Kept: $0.8\\times 50 = 40$.`, why:`On average, 80% of the 50 neurons stay on.`}
      ],
      answer:`about $40$ kept` },

    { q:`<p>A layer of $10$ neurons uses dropout rate $p=0.5$. About how many are kept each step?</p>`,
      steps:[
        {do:`Keep probability: $1 - 0.5 = 0.5$.`, why:`Half are kept, half are dropped.`},
        {do:`Kept: $0.5\\times 10 = 5$.`, why:`Roughly 5 neurons stay active per step.`}
      ],
      answer:`about $5$ kept` },

    { q:`<p>Dropout rate $p=0.3$ on $100$ neurons. About how many are dropped (set to 0) each step?</p>`,
      steps:[
        {do:`Drop probability is $p=0.3$.`, why:`$p$ is the chance a neuron is switched off.`},
        {do:`Dropped: $0.3\\times 100 = 30$.`, why:`About 30 of the 100 neurons go to zero.`}
      ],
      answer:`about $30$ dropped` },

    { q:`<p>With dropout, kept activations are scaled up by $\\frac{1}{1-p}$ (inverted dropout) so the average size stays the same. Find the scale factor for $p=0.5$.</p>`,
      steps:[
        {do:`Keep probability: $1 - 0.5 = 0.5$.`, why:`Half the neurons survive.`},
        {do:`Scale: $\\frac{1}{0.5} = 2$.`, why:`Surviving neurons are doubled to make up for the dropped ones.`}
      ],
      answer:`scale $= 2$` },

    { q:`<p>Inverted-dropout scale factor for $p=0.2$. Use $\\frac{1}{1-p}$.</p>`,
      steps:[
        {do:`Keep probability: $1 - 0.2 = 0.8$.`, why:`80% of neurons stay.`},
        {do:`Scale: $\\frac{1}{0.8} = 1.25$.`, why:`Survivors grow by 25% to keep the total expected value steady.`}
      ],
      answer:`scale $= 1.25$` },

    { q:`<p>A neuron outputs $4$. It is kept under inverted dropout with $p=0.5$. What value does it pass forward after scaling?</p>`,
      steps:[
        {do:`Scale factor: $\\frac{1}{1-0.5} = 2$.`, why:`Inverted dropout boosts survivors by $\\frac{1}{1-p}$.`},
        {do:`Scaled value: $4\\times 2 = 8$.`, why:`The kept neuron is doubled this step.`}
      ],
      answer:`$8$` },

    { q:`<p>Expected output check. One neuron outputs $10$. With keep probability $0.8$ and inverted-dropout scaling $\\frac{1}{0.8}$, what is its expected contribution?</p>`,
      steps:[
        {do:`When kept (prob $0.8$): value is $10\\times\\frac{1}{0.8} = 12.5$.`, why:`Survivors are scaled up.`},
        {do:`Expected: $0.8\\times 12.5 + 0.2\\times 0 = 10$.`, why:`Scaling makes the average match the no-dropout value.`}
      ],
      answer:`expected $= 10$` },

    { q:`<p>At test time, dropout is turned off. A layer has $20$ neurons with $p=0.4$. How many neurons are active during testing?</p>`,
      steps:[
        {do:`Test time uses all neurons; dropout is disabled.`, why:`Dropout only happens during training.`},
        {do:`Active: all $20$.`, why:`No neurons are dropped at test time.`}
      ],
      answer:`$20$ active` },

    { q:`<p>Higher dropout means more regularization. Rank these by how many neurons survive on a 100-neuron layer: $p=0.1$, $p=0.5$, $p=0.9$.</p>`,
      steps:[
        {do:`Keep counts: $p=0.1\\to 90$, $p=0.5\\to 50$, $p=0.9\\to 10$.`, why:`Survivors are $(1-p)\\times 100$.`},
        {do:`So $p=0.1$ keeps the most, $p=0.9$ keeps the fewest.`, why:`Bigger $p$ drops more neurons.`}
      ],
      answer:`$90 > 50 > 10$` },

    { q:`<p>A layer of $200$ neurons uses dropout $p=0.25$. On average, how many are kept, and what is the inverted-dropout scale on survivors?</p>`,
      steps:[
        {do:`Keep probability: $1 - 0.25 = 0.75$.`, why:`75% of neurons survive.`},
        {do:`Kept: $0.75\\times 200 = 150$.`, why:`Average survivors out of 200.`},
        {do:`Scale: $\\frac{1}{0.75} \\approx 1.33$.`, why:`Survivors grow to keep the expected sum steady.`}
      ],
      answer:`about $150$ kept, scale $\\approx 1.33$` },
  ],

});
})();
