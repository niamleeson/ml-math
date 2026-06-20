/* =====================================================================
   PRACTICE PROBLEMS — MODULE 3 (Deep Learning), HARDER set C, batch 2.
   Owned ids: dl-gan, dl-rnn, dl-vanishing-gradient, dl-lstm-gru,
   dl-word-embeddings, dl-word2vec, dl-cosine-similarity, dl-attention,
   dl-data-augmentation.
   Extends practice-03-deeplearning-c.js and practice-hard-dl-c.js with
   ~12-13 MORE genuinely harder, distinct problems per id, increasing in
   difficulty. No duplicates of the earlier two files.
   ===================================================================== */
(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

  /* ---------------------------------------------------------------- */
  add("dl-gan", [
    { q:`<p>A GAN trains on a minibatch of $m = 4$ samples. The discriminator's per-sample losses on the reals are $-\\log D(x)$ with $D = [0.9, 0.8, 0.7, 0.6]$. Compute the average real-side loss (natural log, round to 3 decimals).</p>`,
      steps:[
        {do:`Per-sample losses: $-\\log 0.9 = 0.1054$, $-\\log 0.8 = 0.2231$, $-\\log 0.7 = 0.3567$, $-\\log 0.6 = 0.5108$.`, why:`Each real should score near 1; the negative log of a value below 1 is a positive loss.`},
        {do:`Sum: $0.1054 + 0.2231 + 0.3567 + 0.5108 = 1.1960$.`, why:`The batch loss adds each sample's contribution.`},
        {do:`Average: $1.1960 / 4 = 0.2990 \\approx 0.299$.`, why:`Divide by the batch size $m=4$ for the mean.`}
      ],
      answer:`average real-side loss $\\approx 0.299$` },

    { q:`<p>The full discriminator batch objective is $\\frac{1}{m}\\sum[\\log D(x) + \\log(1 - D(G(z)))]$, which it maximizes. With $m = 2$, reals $D(x) = [0.8, 0.9]$ and fakes $D(G(z)) = [0.3, 0.1]$, compute the objective (natural log, round to 3 decimals).</p>`,
      steps:[
        {do:`Real terms: $\\log 0.8 = -0.2231$, $\\log 0.9 = -0.1054$.`, why:`The discriminator wants $\\log D$ high on reals.`},
        {do:`Fake terms: $\\log(1-0.3) = \\log 0.7 = -0.3567$, $\\log(1-0.1) = \\log 0.9 = -0.1054$.`, why:`On fakes it wants $\\log(1-D)$ high, i.e. $D$ low.`},
        {do:`Sum all four: $-0.2231 -0.1054 -0.3567 -0.1054 = -0.7906$; average over $m=2$: $-0.7906/2 = -0.3953 \\approx -0.395$.`, why:`The objective is the mean of paired real+fake log terms.`}
      ],
      answer:`objective $\\approx -0.395$` },

    { q:`<p>Two generators are compared on the same discriminator. Generator A's fakes score $D = 0.3$; generator B's score $D = 0.45$. Using the non-saturating loss $-\\log D$, which generator is better, and by how much (natural log, round to 3 decimals)?</p>`,
      steps:[
        {do:`Loss A: $-\\log 0.3 = 1.2040$.`, why:`A lower $D$ means the detective caught the fake, giving a bigger generator loss.`},
        {do:`Loss B: $-\\log 0.45 = 0.7985$.`, why:`B's fakes fool the detective more, so its loss is smaller.`},
        {do:`Difference: $1.2040 - 0.7985 = 0.4055 \\approx 0.406$; B is better by $\\approx 0.406$.`, why:`Smaller loss wins; B beats A by this much.`}
      ],
      answer:`generator B is better by $\\approx 0.406$` },

    { q:`<p>At the optimal discriminator the GAN's generator objective reduces to a Jensen–Shannon divergence. When generator and data match exactly, $\\mathrm{JS} = 0$ and the value function equals $-\\log 4$. Compute $-\\log 4$ (natural log) and $2\\log 0.5$ to confirm they agree (round to 3 decimals).</p>`,
      steps:[
        {do:`$-\\log 4 = -1.3863$.`, why:`This is the GAN's global-optimum value when fakes are indistinguishable.`},
        {do:`$2\\log 0.5 = 2(-0.6931) = -1.3863$.`, why:`At equilibrium $D = 0.5$ everywhere, so each log term is $\\log 0.5$.`},
        {do:`Both equal $\\approx -1.386$, confirming $-\\log 4 = 2\\log 0.5$.`, why:`$\\log 0.5 = -\\log 2$, so $2\\log 0.5 = -\\log 4$.`}
      ],
      answer:`$-\\log 4 = 2\\log 0.5 \\approx -1.386$` },

    { q:`<p>The optimal discriminator is $D^*(x) = \\frac{p_{\\text{data}}}{p_{\\text{data}} + p_g}$. At a point the generator over-produces: $p_{\\text{data}} = 0.2$, $p_g = 0.6$. Compute $D^*$ and the generator's loss $-\\log D^*$ there (round to 3 decimals).</p>`,
      steps:[
        {do:`$D^* = 0.2/(0.2 + 0.6) = 0.2/0.8 = 0.25$.`, why:`Where the generator floods a region, the detective leans "fake", so $D^*$ is low.`},
        {do:`Generator loss: $-\\log 0.25 = 1.3863$.`, why:`A low $D^*$ punishes the generator for over-producing here.`},
        {do:`Round: $D^* = 0.250$, loss $\\approx 1.386$.`, why:`The generator is pushed to reduce density where it overshoots.`}
      ],
      answer:`$D^* = 0.250$, generator loss $\\approx 1.386$` },

    { q:`<p>A GAN generator maps a 100-dim noise vector to a $28\\times28$ grayscale image through a single dense layer (no conv). How many weights does that dense layer have, ignoring biases?</p>`,
      steps:[
        {do:`Output size: $28 \\times 28 = 784$ pixels.`, why:`The flattened image has one value per pixel.`},
        {do:`Weights: each output connects to all 100 inputs: $784 \\times 100 = 78{,}400$.`, why:`A dense layer has one weight per (output, input) pair.`},
        {do:`So $78{,}400$ weights.`, why:`Biases would add 784 more, but we ignore them here.`}
      ],
      answer:`$784 \\times 100 = 78{,}400$ weights` },

    { q:`<p>Mode collapse check: a generator should cover all 10 digit classes evenly ($p = 0.1$ each). It instead outputs class "8" with probability $0.7$ and spreads $0.3$ over the other 9. The coverage entropy is $-\\sum p\\log_2 p$. Compute it (round to 3 decimals) and compare to the ideal $\\log_2 10$.</p>`,
      steps:[
        {do:`The "8" term: $-0.7\\log_2 0.7 = -0.7(-0.5146) = 0.3602$.`, why:`Entropy sums each class's surprise weighted by its probability.`},
        {do:`The other 9: each has $p = 0.3/9 = 0.0333$, term $-0.0333\\log_2 0.0333 = -0.0333(-4.9069) = 0.1635$; times 9 $= 1.4712$.`, why:`The remaining mass is split evenly over nine classes.`},
        {do:`Total: $0.3602 + 1.4712 = 1.8314 \\approx 1.831$ bits, far below the ideal $\\log_2 10 = 3.322$ bits.`, why:`Low entropy signals mode collapse: the generator ignores most classes.`}
      ],
      answer:`entropy $\\approx 1.831$ bits vs ideal $3.322$ — mode collapse` },

    { q:`<p>Label smoothing replaces the discriminator's real target $1$ with $0.9$. If the discriminator outputs $D = 0.95$ on a real, compute its squared error to the smoothed target $0.9$ versus the hard target $1$.</p>`,
      steps:[
        {do:`To smoothed target: $(0.95 - 0.9)^2 = 0.05^2 = 0.0025$.`, why:`Smoothing asks the detective to be confident but not absolute.`},
        {do:`To hard target: $(0.95 - 1)^2 = (-0.05)^2 = 0.0025$.`, why:`Here both errors happen to be equal in magnitude.`},
        {do:`Both equal $0.0025$, but smoothing keeps gradients alive when $D$ would otherwise saturate near 1.`, why:`Label smoothing prevents over-confident discriminators that starve the generator of gradient.`}
      ],
      answer:`both squared errors $= 0.0025$; smoothing curbs over-confidence` },

    { q:`<p>A WGAN uses the critic score difference $\\mathbb{E}[C(x_{\\text{real}})] - \\mathbb{E}[C(x_{\\text{fake}})]$ as a distance. Real scores average $3.2$, fake scores average $1.5$. Compute the estimated Wasserstein distance, and say what a value near 0 would mean.</p>`,
      steps:[
        {do:`Distance: $3.2 - 1.5 = 1.7$.`, why:`The critic separates reals from fakes by this score gap.`},
        {do:`A larger gap means the critic still tells them apart easily.`, why:`The generator's job is to shrink this gap.`},
        {do:`A value near 0 would mean reals and fakes are indistinguishable — the generator has won.`, why:`Zero Wasserstein distance is the WGAN equilibrium.`}
      ],
      answer:`distance $= 1.7$; near 0 means fakes are indistinguishable` },

    { q:`<p>A conditional GAN concatenates a one-hot class label (10 classes) onto its 90-dim noise vector before the generator's first layer, which has 256 units. How many weights feed that first layer (ignore biases)?</p>`,
      steps:[
        {do:`Input width: $90 + 10 = 100$ after concatenation.`, why:`The class label is appended to the noise vector.`},
        {do:`Weights: $256 \\times 100 = 25{,}600$.`, why:`One weight per (unit, input) pair.`},
        {do:`So $25{,}600$ weights feed the first layer.`, why:`The label lets the generator produce class-specific samples.`}
      ],
      answer:`$256 \\times 100 = 25{,}600$ weights` },

    { q:`<p>Training alternates $k = 5$ discriminator steps per 1 generator step. Over one epoch the generator updates $2{,}000$ times. How many discriminator updates occur, and what fraction of all updates are discriminator updates?</p>`,
      steps:[
        {do:`Discriminator updates: $5 \\times 2{,}000 = 10{,}000$.`, why:`Five detective steps for every forger step.`},
        {do:`Total updates: $10{,}000 + 2{,}000 = 12{,}000$.`, why:`Add both networks' updates.`},
        {do:`Fraction: $10{,}000/12{,}000 = 0.8333 \\approx 0.833$, i.e. about $83.3\\%$.`, why:`A stronger discriminator schedule gives the generator a useful gradient.`}
      ],
      answer:`$10{,}000$ discriminator updates, $\\approx 83.3\\%$ of all updates` },

    { q:`<p>The generator's gradient signal is the slope of $-\\log D$ in $D$, which is $-1/D$. Compare the gradient magnitude at $D = 0.1$ (caught fake) versus $D = 0.5$. Which gives a stronger learning signal, and by what ratio?</p>`,
      steps:[
        {do:`At $D = 0.1$: $|{-1/D}| = 1/0.1 = 10$.`, why:`The non-saturating loss gives a big slope when the fake is easily caught.`},
        {do:`At $D = 0.5$: $1/0.5 = 2$.`, why:`Near the decision boundary the slope is gentler.`},
        {do:`Ratio: $10/2 = 5\\times$ stronger at $D = 0.1$.`, why:`This is exactly why the non-saturating loss avoids vanishing generator gradients early in training.`}
      ],
      answer:`$5\\times$ stronger signal at $D=0.1$ than at $D=0.5$` },

    { q:`<p>At the global GAN optimum the Jensen–Shannon divergence between data and generator is $0$, and the value function is $-\\log 4 \\approx -1.386$. A current model has $V = -1.10$. How far is it from the optimum value, and is its $V$ above or below the optimum?</p>`,
      steps:[
        {do:`Optimum value: $-\\log 4 = -1.3863$.`, why:`This is the minimum the discriminator can be driven to at equilibrium.`},
        {do:`Gap: $-1.10 - (-1.3863) = 0.2863 \\approx 0.286$.`, why:`Subtract the optimum from the current value.`},
        {do:`$-1.10 &gt; -1.386$, so $V$ is above the optimum — the discriminator still distinguishes fakes.`, why:`A value above $-\\log 4$ means training is not yet at equilibrium.`}
      ],
      answer:`gap $\\approx 0.286$; current $V$ is above the optimum (not converged)` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-rnn", [
    { q:`<p>An RNN cell $a^{&lt;t&gt;} = \\tanh(0.5\\,a^{&lt;t-1&gt;} + 1\\cdot x^{&lt;t&gt;})$, $a^{&lt;0&gt;} = 0$, runs over four inputs $x = [1, 1, 1, 1]$. Compute $a^{&lt;1&gt;}$ through $a^{&lt;4&gt;}$ (round each to 3 decimals) and note whether it settles.</p>`,
      steps:[
        {do:`$a^{&lt;1&gt;} = \\tanh(0.5(0)+1) = \\tanh(1) = 0.762$.`, why:`Begin from zero memory with the first input.`},
        {do:`$a^{&lt;2&gt;} = \\tanh(0.5(0.762)+1) = \\tanh(1.381) = 0.881$; $a^{&lt;3&gt;} = \\tanh(0.5(0.881)+1) = \\tanh(1.441) = 0.894$.`, why:`Carry half the memory plus the steady input each step.`},
        {do:`$a^{&lt;4&gt;} = \\tanh(0.5(0.894)+1) = \\tanh(1.447) = 0.895$.`, why:`The state nearly settles toward a fixed point around $0.895$.`}
      ],
      answer:`$a \\approx [0.762, 0.881, 0.894, 0.895]$ — settling near $0.895$` },

    { q:`<p>An RNN with a 2-D hidden state uses $W_{aa} = \\begin{bmatrix}0.5 & 0\\\\0 & 0.5\\end{bmatrix}$, $W_{ax} = \\begin{bmatrix}1\\\\1\\end{bmatrix}$, identity activation, $a^{&lt;0&gt;} = [0,0]$, and scalar inputs $x = [2, 4]$. Compute $a^{&lt;2&gt;}$.</p>`,
      steps:[
        {do:`$a^{&lt;1&gt;} = W_{aa}[0,0] + W_{ax}(2) = [0,0] + [2,2] = [2, 2]$.`, why:`Identity means no squish; just the linear update.`},
        {do:`$W_{aa}\\,a^{&lt;1&gt;} = [0.5(2), 0.5(2)] = [1, 1]$; $W_{ax}(4) = [4, 4]$.`, why:`Scale the previous state by $0.5$ on each component, add the new input.`},
        {do:`$a^{&lt;2&gt;} = [1,1] + [4,4] = [5, 5]$.`, why:`Sum the carried memory and the input contribution.`}
      ],
      answer:`$a^{&lt;2&gt;} = [5, 5]$` },

    { q:`<p>BPTT over $T = 3$ steps sums gradient contributions. The loss-to-state slope is $\\partial L/\\partial a^{&lt;3&gt;} = 1$, and each backward hop multiplies by $W_{aa} = 0.5$ times an activation slope $\\tanh' = 0.8$. Compute the gradient that reaches $a^{&lt;1&gt;}$ from the step-3 loss.</p>`,
      steps:[
        {do:`Per-hop factor: $W_{aa}\\cdot\\tanh' = 0.5 \\times 0.8 = 0.4$.`, why:`Each step backward multiplies by the recurrent weight and the activation slope.`},
        {do:`Hops from step 3 to step 1: $T-1 = 2$ hops, factor $0.4^2 = 0.16$.`, why:`Two recurrent links separate step 3 from step 1.`},
        {do:`Gradient at $a^{&lt;1&gt;}$: $1 \\times 0.16 = 0.16$.`, why:`Multiply the starting slope by the accumulated factor.`}
      ],
      answer:`gradient $= 1 \\times 0.4^2 = 0.16$` },

    { q:`<p>An RNN cell with $W_{aa} = 0.9$, $W_{ax} = 1$, $b = 0$, identity activation, $a^{&lt;0&gt;} = 0$ receives an impulse $x = [1, 0, 0, 0]$ (input only at step 1). Compute $a^{&lt;1&gt;}$ through $a^{&lt;4&gt;}$ and the fraction of the impulse remaining at step 4.</p>`,
      steps:[
        {do:`$a^{&lt;1&gt;} = 0.9(0) + 1(1) = 1$.`, why:`The impulse enters at step 1.`},
        {do:`$a^{&lt;2&gt;} = 0.9(1) = 0.9$; $a^{&lt;3&gt;} = 0.9(0.9) = 0.81$; $a^{&lt;4&gt;} = 0.9(0.81) = 0.729$.`, why:`With no new input, the state just decays by $W_{aa} = 0.9$ each step.`},
        {do:`Fraction at step 4: $0.729$, i.e. $72.9\\%$ of the impulse survives.`, why:`A recurrent weight near 1 gives a long-lasting (but eventually fading) memory.`}
      ],
      answer:`$a = [1, 0.9, 0.81, 0.729]$; $72.9\\%$ remains at step 4` },

    { q:`<p>A character-level RNN has a vocabulary of $V = 27$ symbols (input one-hot, output softmax over 27) and hidden size $n_a = 100$. Count parameters of $W_{ax}$ ($n_a\\times V$), $W_{aa}$ ($n_a\\times n_a$), $W_{ya}$ ($V\\times n_a$), and the two biases $b_a$ ($n_a$), $b_y$ ($V$).</p>`,
      steps:[
        {do:`$W_{ax} = 100\\times27 = 2{,}700$; $W_{aa} = 100\\times100 = 10{,}000$.`, why:`Input and recurrent weight matrices.`},
        {do:`$W_{ya} = 27\\times100 = 2{,}700$; biases $b_a = 100$, $b_y = 27$.`, why:`Output projection plus both bias vectors.`},
        {do:`Total: $2{,}700 + 10{,}000 + 2{,}700 + 100 + 27 = 15{,}527$.`, why:`Sum all weight matrices and biases.`}
      ],
      answer:`$15{,}527$ parameters` },

    { q:`<p>A stacked (2-layer) RNN feeds layer-1 hidden states into layer 2. Layer 1 has input dim 8 and hidden dim 16; layer 2 has hidden dim 16. Count parameters for layer 2's $W_{ax}$ ($16\\times16$), $W_{aa}$ ($16\\times16$), and bias ($16$).</p>`,
      steps:[
        {do:`Layer 2's input is layer 1's 16-dim output, so $W_{ax} = 16\\times16 = 256$.`, why:`The second layer reads the first layer's hidden state.`},
        {do:`$W_{aa} = 16\\times16 = 256$; bias $= 16$.`, why:`The recurrent matrix maps the 16-dim state to itself.`},
        {do:`Total: $256 + 256 + 16 = 528$.`, why:`Sum both matrices and the bias for layer 2.`}
      ],
      answer:`layer 2 has $256 + 256 + 16 = 528$ parameters` },

    { q:`<p>An RNN cell $a^{&lt;t&gt;} = \\tanh(W_{aa}a^{&lt;t-1&gt;} + W_{ax}x^{&lt;t&gt;})$ with $W_{aa} = -0.6$, $W_{ax} = 1$, $a^{&lt;0&gt;} = 0$, inputs $x = [1, 1, 1]$. Compute $a^{&lt;1&gt;}$, $a^{&lt;2&gt;}$, $a^{&lt;3&gt;}$ (round to 3 decimals) and note the oscillation.</p>`,
      steps:[
        {do:`$a^{&lt;1&gt;} = \\tanh(-0.6(0)+1) = \\tanh(1) = 0.762$.`, why:`Start from zero memory.`},
        {do:`$a^{&lt;2&gt;} = \\tanh(-0.6(0.762)+1) = \\tanh(0.543) = 0.495$.`, why:`A negative $W_{aa}$ subtracts part of the previous state.`},
        {do:`$a^{&lt;3&gt;} = \\tanh(-0.6(0.495)+1) = \\tanh(0.703) = 0.607$.`, why:`The state oscillates ($0.762 \\to 0.495 \\to 0.607$) because the recurrent weight is negative.`}
      ],
      answer:`$a \\approx [0.762, 0.495, 0.607]$ (oscillating)` },

    { q:`<p>Teacher forcing vs free running. A length-5 sequence model is trained with teacher forcing (feed the true previous token). At inference it feeds its own outputs. If each step has a $0.9$ chance of a correct token independently, what is the probability all 5 steps are correct?</p>`,
      steps:[
        {do:`Independent steps: multiply the per-step accuracy.`, why:`A whole-sequence success needs every step correct.`},
        {do:`$0.9^5 = 0.59049$.`, why:`Five steps each correct with probability $0.9$.`},
        {do:`Round: $\\approx 0.590$, only $59\\%$ — errors compound during free running.`, why:`This compounding is why teacher-forced models can drift at inference (exposure bias).`}
      ],
      answer:`$0.9^5 \\approx 0.590$ (errors compound)` },

    { q:`<p>An RNN output layer is $\\hat{y}^{&lt;t&gt;} = \\mathrm{softmax}(W_{ya}a^{&lt;t&gt;} + b_y)$. At a step the logits are $[2, 1, 0]$ for three tokens. Compute the probability of token 1 (round to 3 decimals).</p>`,
      steps:[
        {do:`Exponentiate logits: $e^2 = 7.389$, $e^1 = 2.718$, $e^0 = 1$.`, why:`Softmax turns logits into positive scores.`},
        {do:`Sum: $Z = 7.389 + 2.718 + 1 = 11.107$.`, why:`Normalize over all three tokens.`},
        {do:`$P(\\text{token 1}) = 7.389/11.107 = 0.6653 \\approx 0.665$.`, why:`The highest logit gets the most probability.`}
      ],
      answer:`$P(\\text{token 1}) \\approx 0.665$` },

    { q:`<p>A many-to-one RNN classifies a length-$T$ review using only the final hidden state $a^{&lt;T&gt;}$. With $a^{&lt;T&gt;} = [0.5, -0.5]$, output weights $W_{y} = [2, 2]$, bias $b_y = 0.3$, compute the logit and then the sigmoid probability of "positive" (round to 3 decimals).</p>`,
      steps:[
        {do:`Logit: $2(0.5) + 2(-0.5) + 0.3 = 1 - 1 + 0.3 = 0.3$.`, why:`The final state summarizes the whole review.`},
        {do:`Sigmoid: $\\sigma(0.3) = 1/(1 + e^{-0.3})$, $e^{-0.3} = 0.7408$.`, why:`A single yes/no output uses a sigmoid.`},
        {do:`$\\sigma(0.3) = 1/1.7408 = 0.5744 \\approx 0.574$.`, why:`Slightly above $0.5$, so a mild "positive" lean.`}
      ],
      answer:`logit $= 0.3$, $P(\\text{positive}) \\approx 0.574$` },

    { q:`<p>An RNN is unrolled for $T = 20$ steps during BPTT but uses truncated BPTT with a window of $k = 5$ steps. How many backward hops does the gradient travel per update, and what fraction of the full unroll is that?</p>`,
      steps:[
        {do:`Truncated BPTT backprops only $k = 5$ steps.`, why:`Gradients flow back at most the window length.`},
        {do:`Hops: $k - 1 = 4$ recurrent links per update.`, why:`Five steps are joined by four links.`},
        {do:`Fraction of full unroll: $5/20 = 0.25$, i.e. $25\\%$.`, why:`Truncation trades long-range gradient for cheaper, more stable updates.`}
      ],
      answer:`4 hops; $5/20 = 25\\%$ of the full unroll` },

    { q:`<p>A sequence-to-sequence model has a 6-token input and a 4-token output, encoder hidden size 32. The encoder produces one final state passed to the decoder. How many distinct hidden states does the encoder compute, and how many numbers does the passed context vector hold?</p>`,
      steps:[
        {do:`Encoder states: one per input token, so $6$ hidden states.`, why:`The encoder reads each input token in turn.`},
        {do:`Passed context: the final state, a 32-number vector.`, why:`A vanilla seq2seq passes only the last encoder state.`},
        {do:`So 6 states computed, context vector holds $32$ numbers.`, why:`Compressing 6 tokens into one 32-vector is the bottleneck attention later fixes.`}
      ],
      answer:`6 encoder states; context vector has $32$ numbers` },

    { q:`<p>An RNN's recurrent Jacobian over 10 steps has the same eigenvalue $\\lambda = 1.1$ along one direction. The gradient in that direction scales by $\\lambda^{10}$. Compute it (round to 3 decimals) and classify.</p>`,
      steps:[
        {do:`$\\lambda^{10} = 1.1^{10}$. $1.1^5 = 1.61051$, then square: $1.61051^2 = 2.59374$.`, why:`Build the power by computing $1.1^5$ and squaring.`},
        {do:`So $1.1^{10} \\approx 2.594$.`, why:`Round to 3 decimals.`},
        {do:`Above 1, so the gradient grows — a (mild) exploding direction.`, why:`An eigenvalue above 1 amplifies gradients across time steps.`}
      ],
      answer:`$1.1^{10} \\approx 2.594$ (exploding direction)` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-vanishing-gradient", [
    { q:`<p>Two layers contribute slopes $0.3$ and $1.4$ at one hop; the per-hop factor is their product. Over $8$ hops compute $(0.3\\times1.4)^8$ (round to 5 decimals) and classify.</p>`,
      steps:[
        {do:`Per-hop factor: $0.3 \\times 1.4 = 0.42$.`, why:`Stacked slopes multiply within a single hop.`},
        {do:`$0.42^8$: $0.42^2 = 0.1764$, $0.42^4 = 0.1764^2 = 0.03112$, $0.42^8 = 0.03112^2 = 0.00097$.`, why:`Square repeatedly to reach the 8th power.`},
        {do:`$\\approx 0.00097$: the gradient nearly vanishes.`, why:`A per-hop factor below 1 shrinks fast over many hops.`}
      ],
      answer:`$0.42^8 \\approx 0.00097$ (vanishing)` },

    { q:`<p>A gradient is the 3-D vector $g = [2, 3, 6]$ and the clip threshold is $\\tau = 3.5$. Apply $g \\leftarrow \\tau\\,g/\\lVert g\\rVert$. Give the clipped vector (round each entry to 3 decimals).</p>`,
      steps:[
        {do:`Norm: $\\lVert g\\rVert = \\sqrt{4 + 9 + 36} = \\sqrt{49} = 7$.`, why:`Measure the gradient's length before clipping.`},
        {do:`$7 &gt; 3.5$, so scale by $3.5/7 = 0.5$.`, why:`The norm exceeds the threshold, so shrink it.`},
        {do:`Clipped: $[2,3,6]\\times0.5 = [1.000, 1.500, 3.000]$, norm $= 3.5$.`, why:`Same direction, length capped at $\\tau$.`}
      ],
      answer:`clipped $g = [1.000, 1.500, 3.000]$` },

    { q:`<p>Find the per-step slope $r$ so that after $50$ steps the gradient keeps half its size: $r^{50} = 0.5$. Solve for $r$ (round to 4 decimals).</p>`,
      steps:[
        {do:`Take logs: $50\\ln r = \\ln 0.5 = -0.6931$.`, why:`Logarithms convert the power into a product.`},
        {do:`$\\ln r = -0.6931/50 = -0.013863$.`, why:`Divide by the number of steps.`},
        {do:`$r = e^{-0.013863} = 0.9862$.`, why:`A slope just below 1 still halves the gradient over 50 steps.`}
      ],
      answer:`$r = e^{(\\ln 0.5)/50} \\approx 0.9862$` },

    { q:`<p>Sigmoid's derivative is at most $0.25$ (at $z = 0$). Over a 6-layer sigmoid network, the best-case gradient factor is $0.25^6$. Compute it (round mantissa to 3 decimals) and explain the design lesson.</p>`,
      steps:[
        {do:`$0.25^6 = (1/4)^6 = 1/4096$.`, why:`$0.25 = 1/4$, raised to the 6th power.`},
        {do:`$1/4096 = 0.000244 \\approx 2.441\\times10^{-4}$.`, why:`Even the maximum sigmoid slope shrinks gradients fast.`},
        {do:`Lesson: deep sigmoid stacks vanish; ReLU (slope 1 for $z&gt;0$) avoids this.`, why:`This is the historical reason ReLU replaced sigmoid in deep nets.`}
      ],
      answer:`$0.25^6 = 1/4096 \\approx 2.441\\times10^{-4}$ — sigmoids vanish, use ReLU` },

    { q:`<p>A residual connection passes the input through unchanged plus a learned residual, giving an effective per-step factor of $1 + 0.05 = 1.05$ instead of $0.7$. Over $20$ layers compare $0.7^{20}$ with $1.05^{20}$ (round to 4 and 3 decimals).</p>`,
      steps:[
        {do:`Plain path: $0.7^{20}$. $0.7^{10} = 0.0282475$, square: $0.000798$.`, why:`Without skips, slopes below 1 vanish over depth.`},
        {do:`Residual path: $1.05^{20}$. $1.05^{10} = 1.62889$, square: $2.653$.`, why:`The $+1$ identity keeps the factor near 1, here slightly above.`},
        {do:`Plain $\\approx 0.0008$ (vanished) vs residual $\\approx 2.653$ (healthy).`, why:`Skip connections are why very deep ResNets train at all.`}
      ],
      answer:`$0.7^{20} \\approx 0.0008$ vs $1.05^{20} \\approx 2.653$` },

    { q:`<p>How many steps $n$ until a per-step slope of $0.95$ shrinks the gradient below $1\\%$ ($0.95^n &lt; 0.01$)? Solve for the smallest whole $n$ (use $\\ln 0.95 = -0.05129$, $\\ln 0.01 = -4.6052$).</p>`,
      steps:[
        {do:`Need $n\\ln 0.95 &lt; \\ln 0.01$, i.e. $n(-0.05129) &lt; -4.6052$.`, why:`Take logs; the inequality flips when dividing by a negative.`},
        {do:`$n &gt; 4.6052/0.05129 = 89.79$.`, why:`Divide both sides by $0.05129$ (and flip the inequality).`},
        {do:`Smallest whole $n = 90$.`, why:`Round up: 89 steps would not yet reach below $1\\%$.`}
      ],
      answer:`$n = 90$ steps` },

    { q:`<p>A gradient $g = [1, 2, 2, 4]$ (4-D) has clip threshold $\\tau = 2.5$. Find its norm, decide if it clips, and give the result (round entries to 3 decimals).</p>`,
      steps:[
        {do:`Norm: $\\sqrt{1 + 4 + 4 + 16} = \\sqrt{25} = 5$.`, why:`Sum of squares, then square root.`},
        {do:`$5 &gt; 2.5$, scale by $2.5/5 = 0.5$.`, why:`The norm exceeds the threshold.`},
        {do:`Clipped: $[1,2,2,4]\\times0.5 = [0.500, 1.000, 1.000, 2.000]$, norm $= 2.5$.`, why:`Direction preserved, length capped at $\\tau$.`}
      ],
      answer:`clipped $g = [0.500, 1.000, 1.000, 2.000]$` },

    { q:`<p>Compare vanishing across two depths with slope $0.85$: depth 15 vs depth 30. Compute $0.85^{15}$ and $0.85^{30}$ (use $\\ln 0.85 = -0.16252$, round to 4 decimals) and the ratio of the two.</p>`,
      steps:[
        {do:`$0.85^{15} = e^{15(-0.16252)} = e^{-2.4378} = 0.0874$.`, why:`Bring the exponent down via the log, then exponentiate.`},
        {do:`$0.85^{30} = e^{30(-0.16252)} = e^{-4.8756} = 0.0076$.`, why:`Double the depth doubles the (negative) log-exponent.`},
        {do:`Ratio: $0.0874/0.0076 = 11.5$, so depth 30 vanishes about $11.5\\times$ more.`, why:`Doubling depth squares the surviving fraction.`}
      ],
      answer:`$0.85^{15}\\approx0.0874$, $0.85^{30}\\approx0.0076$, ratio $\\approx 11.5$` },

    { q:`<p>A clipped update keeps direction but caps norm at $\\tau$. A gradient has norm $40$ and $\\tau = 5$. After clipping, by what factor is each component scaled, and what is the final norm?</p>`,
      steps:[
        {do:`Scale factor: $\\tau/\\lVert g\\rVert = 5/40 = 0.125$.`, why:`Bring a norm of 40 down to the threshold 5.`},
        {do:`Each component is multiplied by $0.125$.`, why:`Uniform scaling preserves direction.`},
        {do:`Final norm: $40 \\times 0.125 = 5$.`, why:`By construction the clipped norm equals $\\tau$.`}
      ],
      answer:`scaled by $0.125$; final norm $= 5$` },

    { q:`<p>LSTM gradients along the cell-state highway scale by the forget gate. With $f = 0.99$ held over $100$ steps, compute $0.99^{100}$ (use $\\ln 0.99 = -0.01005$, round to 3 decimals) and contrast with a plain slope of $0.9$ over the same span.</p>`,
      steps:[
        {do:`$0.99^{100} = e^{100(-0.01005)} = e^{-1.005} = 0.366$.`, why:`A forget gate near 1 barely decays the gradient.`},
        {do:`Plain $0.9^{100} = e^{100\\ln0.9} = e^{100(-0.10536)} = e^{-10.536} \\approx 2.65\\times10^{-5}$.`, why:`A slope of $0.9$ vanishes drastically over 100 steps.`},
        {do:`LSTM keeps $\\approx 36.6\\%$ vs the plain net's $\\approx 0.0027\\%$.`, why:`The forget-gate highway is why LSTMs learn long-range dependencies.`}
      ],
      answer:`$0.99^{100}\\approx0.366$ vs $0.9^{100}\\approx2.65\\times10^{-5}$` },

    { q:`<p>You want a per-step slope $r$ giving a stable gradient. If $r = 1.03$, does the gradient vanish or explode over 25 steps? Compute $1.03^{25}$ (use $\\ln 1.03 = 0.029559$, round to 3 decimals).</p>`,
      steps:[
        {do:`$1.03^{25} = e^{25(0.029559)} = e^{0.73897}$.`, why:`A slope above 1 grows; compute the exponent first.`},
        {do:`$e^{0.73897} = 2.094$.`, why:`Exponentiate to get the factor.`},
        {do:`$2.094 &gt; 1$, so the gradient explodes (grows about $2.1\\times$) over 25 steps.`, why:`Even a small excess over 1 compounds into growth.`}
      ],
      answer:`$1.03^{25} \\approx 2.094$ (exploding)` },

    { q:`<p>Per-layer slopes vary: $[0.9, 0.8, 1.2, 0.5, 1.1]$ across 5 layers. The total gradient factor is their product. Compute it (round to 4 decimals) and classify.</p>`,
      steps:[
        {do:`Multiply first three: $0.9 \\times 0.8 = 0.72$, $\\times 1.2 = 0.864$.`, why:`The total factor is the product of all per-layer slopes.`},
        {do:`Continue: $0.864 \\times 0.5 = 0.432$, $\\times 1.1 = 0.4752$.`, why:`Multiply the remaining slopes.`},
        {do:`Product $\\approx 0.4752 &lt; 1$: mildly vanishing overall.`, why:`Even with some slopes above 1, the net product can shrink the gradient.`}
      ],
      answer:`product $\\approx 0.4752$ (mildly vanishing)` },

    { q:`<p>Gradient clipping by value (not norm) caps each component to $[-c, c]$ with $c = 1$. A gradient $g = [3, -0.5, 2, -4]$ is value-clipped. Give the result and the change in the L2 norm (round to 3 decimals).</p>`,
      steps:[
        {do:`Clip each to $[-1, 1]$: $[1, -0.5, 1, -1]$.`, why:`Value clipping caps components independently, unlike norm clipping.`},
        {do:`Original norm: $\\sqrt{9 + 0.25 + 4 + 16} = \\sqrt{29.25} = 5.408$.`, why:`Compute the pre-clip length.`},
        {do:`Clipped norm: $\\sqrt{1 + 0.25 + 1 + 1} = \\sqrt{3.25} = 1.803$; norm dropped by $5.408 - 1.803 = 3.605$.`, why:`Value clipping can change direction, unlike norm clipping.`}
      ],
      answer:`clipped $g = [1, -0.5, 1, -1]$; norm drops $5.408 \\to 1.803$` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-lstm-gru", [
    { q:`<p>Run an LSTM cell two steps. Constant gates $f = 0.8$, $i = 0.5$, candidates $\\tilde{c}^{&lt;1&gt;} = 1$, $\\tilde{c}^{&lt;2&gt;} = 2$, $c^{&lt;0&gt;} = 0$. Compute $c^{&lt;1&gt;}$ and $c^{&lt;2&gt;}$.</p>`,
      steps:[
        {do:`$c^{&lt;1&gt;} = 0.8(0) + 0.5(1) = 0.5$.`, why:`Forget gate keeps old memory (zero here); input gate adds half the candidate.`},
        {do:`$c^{&lt;2&gt;} = 0.8(0.5) + 0.5(2) = 0.4 + 1.0 = 1.4$.`, why:`Now the carried memory $0.5$ is partly forgotten and new info added.`},
        {do:`So $c^{&lt;1&gt;} = 0.5$, $c^{&lt;2&gt;} = 1.4$.`, why:`The cell accumulates info across steps under the gates.`}
      ],
      answer:`$c^{&lt;1&gt;} = 0.5,\\; c^{&lt;2&gt;} = 1.4$` },

    { q:`<p>An LSTM computes all three gates from $z = [z_f, z_i, z_o] = [0.5, -1, 2]$ via sigmoid. Compute $f$, $i$, $o$ (round each to 3 decimals).</p>`,
      steps:[
        {do:`$f = \\sigma(0.5) = 1/(1+e^{-0.5}) = 1/1.6065 = 0.622$.`, why:`Each gate is a sigmoid of its pre-activation.`},
        {do:`$i = \\sigma(-1) = 1/(1+e^{1}) = 1/3.7183 = 0.269$.`, why:`A negative pre-activation gives a gate below $0.5$.`},
        {do:`$o = \\sigma(2) = 1/(1+e^{-2}) = 1/1.1353 = 0.881$.`, why:`A large positive pre-activation gives a gate near 1.`}
      ],
      answer:`$f \\approx 0.622,\\; i \\approx 0.269,\\; o \\approx 0.881$` },

    { q:`<p>Full LSTM step from gates above ($f = 0.622$, $i = 0.269$, $o = 0.881$), candidate $\\tilde{c} = \\tanh(0.8) = 0.664$, old cell $c^{&lt;t-1&gt;} = 1.5$. Compute the new cell $c^{&lt;t&gt;}$ and output $a^{&lt;t&gt;} = o\\tanh(c^{&lt;t&gt;})$ (round to 3 decimals).</p>`,
      steps:[
        {do:`$c^{&lt;t&gt;} = 0.622(1.5) + 0.269(0.664) = 0.933 + 0.1786 = 1.1116$.`, why:`Forget gate scales old memory; input gate scales the candidate.`},
        {do:`$\\tanh(1.1116) = 0.8047$.`, why:`Squash the new cell before the output gate.`},
        {do:`$a^{&lt;t&gt;} = 0.881 \\times 0.8047 = 0.709$.`, why:`The output gate reveals about 88% of the squashed cell.`}
      ],
      answer:`$c^{&lt;t&gt;} \\approx 1.112,\\; a^{&lt;t&gt;} \\approx 0.709$` },

    { q:`<p>A GRU uses both an update gate $z$ and a reset gate $r$: $\\tilde{a} = \\tanh(W[r\\odot a^{&lt;t-1&gt;}, x])$. With $a^{&lt;t-1&gt;} = 2$, $r = 0.3$, and $W[\\cdot] = 0.5(r\\,a^{&lt;t-1&gt;}) + 1\\cdot x$, $x = 1$, compute $\\tilde{a}$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Reset applied: $r\\,a^{&lt;t-1&gt;} = 0.3 \\times 2 = 0.6$.`, why:`The reset gate decides how much past state enters the candidate.`},
        {do:`Pre-activation: $0.5(0.6) + 1(1) = 0.3 + 1 = 1.3$.`, why:`Combine the gated past state with the current input.`},
        {do:`$\\tilde{a} = \\tanh(1.3) = 0.862$.`, why:`The reset gate near 0 would ignore the past entirely.`}
      ],
      answer:`$\\tilde{a} = \\tanh(1.3) \\approx 0.862$` },

    { q:`<p>Continue the GRU: with candidate $\\tilde{a} = 0.862$, update gate $z = 0.4$, and previous state $a^{&lt;t-1&gt;} = 2$, compute $a^{&lt;t&gt;} = (1-z)a^{&lt;t-1&gt;} + z\\,\\tilde{a}$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Keep term: $(1 - 0.4)(2) = 0.6 \\times 2 = 1.2$.`, why:`$1-z$ controls how much old state survives.`},
        {do:`New term: $0.4 \\times 0.862 = 0.3448$.`, why:`$z$ controls how much candidate enters.`},
        {do:`$a^{&lt;t&gt;} = 1.2 + 0.3448 = 1.545$.`, why:`The update gate blends old state and new candidate.`}
      ],
      answer:`$a^{&lt;t&gt;} \\approx 1.545$` },

    { q:`<p>Count parameters of one GRU cell with input dim $n_x = 4$, hidden dim $n_a = 6$. A GRU has 3 weight sets (update gate, reset gate, candidate), each a matrix on $[a^{&lt;t-1&gt;}, x]$ plus a bias. Compute the total.</p>`,
      steps:[
        {do:`Concatenated input width: $n_a + n_x = 6 + 4 = 10$.`, why:`Each gate reads both previous state and current input.`},
        {do:`One set: $W = 6\\times10 = 60$, plus bias $6$, so $66$.`, why:`A weight per (unit, concatenated input) plus one bias per unit.`},
        {do:`Three sets: $3 \\times 66 = 198$.`, why:`A GRU has 3 sets vs the LSTM's 4 (no separate output gate).`}
      ],
      answer:`$3 \\times (6\\times10 + 6) = 198$ parameters` },

    { q:`<p>Compare LSTM vs GRU parameter counts for $n_x = 4$, $n_a = 6$. The LSTM has 4 weight sets, the GRU 3, each set being $n_a(n_a+n_x) + n_a$. How many more parameters does the LSTM have?</p>`,
      steps:[
        {do:`Per set: $6(6+4) + 6 = 60 + 6 = 66$.`, why:`Both architectures use the same per-set sizing.`},
        {do:`LSTM: $4\\times66 = 264$; GRU: $3\\times66 = 198$.`, why:`The LSTM's extra output gate adds one set.`},
        {do:`Difference: $264 - 198 = 66$.`, why:`Exactly one weight set — the GRU's efficiency advantage.`}
      ],
      answer:`LSTM has $66$ more parameters ($264$ vs $198$)` },

    { q:`<p>An LSTM forget gate decays a memory with $f^{&lt;1&gt;} = 0.9$, $f^{&lt;2&gt;} = 0.8$, $f^{&lt;3&gt;} = 0.95$ over three steps (no new input). What fraction of the original memory survives all three steps?</p>`,
      steps:[
        {do:`Survival is the product of forget gates: $0.9 \\times 0.8 \\times 0.95$.`, why:`Each step keeps only its forget-gate fraction of the running memory.`},
        {do:`$0.9 \\times 0.8 = 0.72$, $\\times 0.95 = 0.684$.`, why:`Multiply the three gates in sequence.`},
        {do:`So $0.684$, about $68.4\\%$, survives.`, why:`Variable forget gates let the cell hold or release memory per step.`}
      ],
      answer:`$0.9\\times0.8\\times0.95 = 0.684$ ($68.4\\%$) survives` },

    { q:`<p>An LSTM output gate $o$ and cell $c^{&lt;t&gt;}$ produce $a^{&lt;t&gt;} = o\\tanh(c^{&lt;t&gt;})$. If the cell saturates at $c^{&lt;t&gt;} = 3$, compute $\\tanh(3)$ (round to 4 decimals) and the largest possible $|a^{&lt;t&gt;}|$ given $o\\in[0,1]$.</p>`,
      steps:[
        {do:`$\\tanh(3) = 0.9951$.`, why:`For large cell values $\\tanh$ saturates near $\\pm1$.`},
        {do:`Max output magnitude when $o = 1$: $1 \\times 0.9951 = 0.9951$.`, why:`The output gate can reveal at most the full squashed cell.`},
        {do:`So $|a^{&lt;t&gt;}| \\le 0.9951$.`, why:`The $\\tanh$ caps the hidden output near $\\pm1$ regardless of cell size.`}
      ],
      answer:`$\\tanh(3) \\approx 0.9951$; max $|a^{&lt;t&gt;}| \\approx 0.9951$` },

    { q:`<p>A bidirectional LSTM layer has hidden size 64 per direction. The next layer is dense with 10 outputs reading the concatenated forward+backward final states. How many weights does that dense layer have (ignore biases)?</p>`,
      steps:[
        {do:`Concatenated state: $64 + 64 = 128$ numbers.`, why:`Forward and backward final states are stacked.`},
        {do:`Dense weights: $10 \\times 128 = 1{,}280$.`, why:`One weight per (output, input) pair.`},
        {do:`So $1{,}280$ weights.`, why:`Bidirectional doubles the input width to the classifier.`}
      ],
      answer:`$10 \\times 128 = 1{,}280$ weights` },

    { q:`<p>A GRU with update gate fixed at $z = 0.2$ and constant candidate $\\tilde{a} = 1$ starts at $a^{&lt;0&gt;} = 0$. Compute $a^{&lt;3&gt;}$ (the state after three updates).</p>`,
      steps:[
        {do:`$a^{&lt;1&gt;} = 0.8(0) + 0.2(1) = 0.2$.`, why:`Each step moves $20\\%$ of the way toward the candidate.`},
        {do:`$a^{&lt;2&gt;} = 0.8(0.2) + 0.2(1) = 0.16 + 0.2 = 0.36$.`, why:`Carry $80\\%$ of the old state, add $20\\%$ of the candidate.`},
        {do:`$a^{&lt;3&gt;} = 0.8(0.36) + 0.2(1) = 0.288 + 0.2 = 0.488$.`, why:`The state climbs geometrically toward 1.`}
      ],
      answer:`$a^{&lt;3&gt;} = 0.488$` },

    { q:`<p>The cell-state gradient through an LSTM is dominated by $\\prod f^{&lt;t&gt;}$. If the forget-gate bias is initialized to open ($f \\approx 1$), with $f = 0.999$ over $200$ steps, compute $0.999^{200}$ (use $\\ln 0.999 = -0.0010005$, round to 3 decimals).</p>`,
      steps:[
        {do:`$0.999^{200} = e^{200(-0.0010005)} = e^{-0.2001}$.`, why:`A forget gate just below 1 barely decays the cell-state gradient.`},
        {do:`$e^{-0.2001} = 0.8187$.`, why:`Exponentiate the small negative exponent.`},
        {do:`$\\approx 0.819$: about $82\\%$ of the gradient survives 200 steps.`, why:`Initializing the forget-gate bias high is a standard LSTM trick for long memory.`}
      ],
      answer:`$0.999^{200} \\approx 0.819$ ($82\\%$ survives)` },

    { q:`<p>A peephole LSTM lets gates also see the cell state, adding 3 extra weight vectors of size $n_a$ (one per gate that peeks). For $n_a = 8$, how many extra parameters do the peephole connections add?</p>`,
      steps:[
        {do:`Each peephole is an element-wise weight vector of size $n_a = 8$.`, why:`Peepholes connect the cell state to each gate component-wise.`},
        {do:`Three gates peek (forget, input, output): $3 \\times 8 = 24$.`, why:`The candidate is not a gate, so it does not peek.`},
        {do:`So $24$ extra parameters.`, why:`A small addition that lets gates depend on the current cell state.`}
      ],
      answer:`$3 \\times 8 = 24$ extra parameters` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-word-embeddings", [
    { q:`<p>An embedding table with $V = 20000$, $d = 256$ is tied to the output softmax (shared weights). Untied, the model would store $E$ ($d\\times V$) plus a separate output matrix ($V\\times d$). How many parameters does weight tying save?</p>`,
      steps:[
        {do:`Each matrix has $V\\times d = 20000 \\times 256 = 5{,}120{,}000$ parameters.`, why:`Input embedding and output projection are the same shape.`},
        {do:`Untied uses two such matrices; tied uses one.`, why:`Weight tying reuses the embedding for the output layer.`},
        {do:`Saving: $5{,}120{,}000$ parameters.`, why:`Tying halves the embedding-related parameter count.`}
      ],
      answer:`saves $5{,}120{,}000$ parameters` },

    { q:`<p>A model embeds words ($d = 200$), part-of-speech tags ($d = 16$), and position ($d = 32$), concatenating all three per token. What is the combined input dimension, and how many numbers describe a 12-token sentence?</p>`,
      steps:[
        {do:`Per-token width: $200 + 16 + 32 = 248$.`, why:`Concatenation stacks the three embedding vectors.`},
        {do:`Whole sentence: $12 \\times 248 = 2{,}976$.`, why:`Each of the 12 tokens gets a 248-number combined vector.`},
        {do:`So input dim $248$; sentence holds $2{,}976$ numbers.`, why:`Feature concatenation is a common way to enrich token representations.`}
      ],
      answer:`input dim $248$; sentence has $2{,}976$ numbers` },

    { q:`<p>Subword embeddings: a word is split into 3 subword pieces with embeddings $[1, 0, 2]$, $[0, 2, 1]$, $[1, 1, 0]$. The word embedding is the element-wise mean of its pieces. Compute it (round to 3 decimals).</p>`,
      steps:[
        {do:`Sum component-wise: $[1+0+1, 0+2+1, 2+1+0] = [2, 3, 3]$.`, why:`Add matching entries across the three pieces.`},
        {do:`Divide by 3: $[2/3, 3/3, 3/3] = [0.667, 1.000, 1.000]$.`, why:`The mean averages the subword vectors.`},
        {do:`So the word embedding is $\\approx [0.667, 1.000, 1.000]$.`, why:`Subword pooling lets models handle rare/unseen words.`}
      ],
      answer:`$[0.667, 1.000, 1.000]$` },

    { q:`<p>An embedding gradient is sparse: only the rows for tokens in the batch get updated. A batch of 64 sentences, each 30 tokens, touches at most how many distinct rows of a $V = 50000$ embedding table, and what fraction of the table is that (assume all tokens distinct)?</p>`,
      steps:[
        {do:`Tokens in batch: $64 \\times 30 = 1{,}920$.`, why:`Each token references one embedding row.`},
        {do:`At most $1{,}920$ distinct rows updated.`, why:`The upper bound assumes no repeated tokens.`},
        {do:`Fraction: $1{,}920/50{,}000 = 0.0384$, i.e. $3.84\\%$.`, why:`Embedding updates are sparse, which frameworks exploit for speed.`}
      ],
      answer:`$\\le 1{,}920$ rows; $\\approx 3.84\\%$ of the table` },

    { q:`<p>Quantizing an embedding table from 32-bit floats to 8-bit integers. With $V = 100000$, $d = 300$, compute the memory in MB before and after (1 MB $= 10^6$ bytes) and the saving factor.</p>`,
      steps:[
        {do:`Values: $100000 \\times 300 = 30{,}000{,}000$.`, why:`One value per (word, dimension).`},
        {do:`Float32: $30{,}000{,}000 \\times 4 = 120{,}000{,}000$ bytes $= 120$ MB. Int8: $\\times 1 = 30$ MB.`, why:`4 bytes per float vs 1 byte per int8.`},
        {do:`Saving factor: $120/30 = 4\\times$ smaller.`, why:`Quantization trades a little precision for a $4\\times$ memory cut.`}
      ],
      answer:`$120$ MB $\\to 30$ MB, $4\\times$ smaller` },

    { q:`<p>Two words' embeddings are $u = [3, 4]$ and $v = [6, 8]$. Their Euclidean distance and cosine similarity tell different stories. Compute both (cosine round to 3 decimals).</p>`,
      steps:[
        {do:`Distance: $\\sqrt{(6-3)^2 + (8-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$.`, why:`Euclidean distance measures absolute separation.`},
        {do:`Cosine: $u\\cdot v = 18 + 32 = 50$; $\\lVert u\\rVert = 5$, $\\lVert v\\rVert = 10$; $50/(5\\cdot10) = 1.0$.`, why:`$v = 2u$, so they point the same direction.`},
        {do:`Distance $5$ but cosine $1.000$ — same direction, different magnitude.`, why:`Embeddings usually compare by cosine, ignoring length.`}
      ],
      answer:`distance $= 5$, cosine $= 1.000$` },

    { q:`<p>An embedding layer is initialized from a normal with variance $1/d$. For $d = 400$, give the standard deviation (round to 4 decimals), and the expected squared length $\\mathbb{E}[\\lVert e\\rVert^2] = d\\cdot\\text{Var}$ of a random embedding.</p>`,
      steps:[
        {do:`Variance $= 1/400 = 0.0025$; std $= \\sqrt{0.0025} = 0.05$.`, why:`Smaller init variance keeps early activations stable.`},
        {do:`Expected squared length: $d \\times \\text{Var} = 400 \\times 0.0025 = 1$.`, why:`Each of the $d$ components contributes its variance.`},
        {do:`So std $= 0.0500$ and $\\mathbb{E}[\\lVert e\\rVert^2] = 1$.`, why:`This $1/d$ scaling makes embeddings start near unit length.`}
      ],
      answer:`std $= 0.0500$; $\\mathbb{E}[\\lVert e\\rVert^2] = 1$` },

    { q:`<p>Out-of-vocabulary handling: a vocabulary of $V = 30000$ frequent words plus a single shared "UNK" row. What fraction of all rows is the UNK row, and if UNK covers $5\\%$ of token occurrences in text, what does that imply?</p>`,
      steps:[
        {do:`UNK is 1 of $30000 + 1 = 30001$ rows: $1/30001 \\approx 0.0000333$.`, why:`One reserved row for all unknown words.`},
        {do:`But it absorbs $5\\%$ of token occurrences.`, why:`Rare words collapse into a single shared vector.`},
        {do:`Implication: one row carries $5\\%$ of tokens, a coarse catch-all that subword models improve on.`, why:`A single UNK loses meaning distinctions among rare words.`}
      ],
      answer:`UNK is $\\approx 0.0033\\%$ of rows but absorbs $5\\%$ of tokens` },

    { q:`<p>Centering embeddings: a 3-word vocabulary has vectors $[2, 0]$, $[0, 4]$, $[4, 2]$. Compute the mean vector, then the centered version of the first word.</p>`,
      steps:[
        {do:`Mean: $\\big[\\frac{2+0+4}{3}, \\frac{0+4+2}{3}\\big] = [2, 2]$.`, why:`Average each component over all words.`},
        {do:`Center the first word: $[2, 0] - [2, 2] = [0, -2]$.`, why:`Subtract the mean from each vector.`},
        {do:`So centered first word $= [0, -2]$.`, why:`Mean-centering removes a shared offset, often improving similarity comparisons.`}
      ],
      answer:`mean $= [2, 2]$; centered first word $= [0, -2]$` },

    { q:`<p>A hash embedding maps words to $B = 1000$ buckets via a hash, sharing rows across collisions. With $V = 50000$ words spread evenly, how many words share each bucket on average, and how does that compare to a full table?</p>`,
      steps:[
        {do:`Words per bucket: $V/B = 50000/1000 = 50$.`, why:`Hashing distributes words across a fixed number of rows.`},
        {do:`A full table would give each word its own row (1 per row).`, why:`No sharing means $V$ distinct rows.`},
        {do:`So hashing shares each row among $50$ words, shrinking the table $50\\times$ at the cost of collisions.`, why:`Hash embeddings trade exactness for a tiny, fixed memory footprint.`}
      ],
      answer:`$50$ words per bucket; $50\\times$ smaller than a full table` },

    { q:`<p>Fine-tuning only the top dimensions: an embedding has $d = 300$, and you freeze all but the last $60$ dimensions. What fraction of each embedding's parameters stay trainable, and for $V = 10000$ words how many trainable embedding parameters remain?</p>`,
      steps:[
        {do:`Trainable fraction per word: $60/300 = 0.2$, i.e. $20\\%$.`, why:`Only the unfrozen dimensions update.`},
        {do:`Trainable count: $10000 \\times 60 = 600{,}000$.`, why:`Each word has 60 trainable dimensions.`},
        {do:`So $20\\%$ trainable, $600{,}000$ parameters.`, why:`Partial freezing cuts the tuning cost while keeping most of the pretrained signal.`}
      ],
      answer:`$20\\%$ trainable; $600{,}000$ trainable parameters` },

    { q:`<p>An attention-free bag-of-embeddings sentence vector is the sum of word embeddings. A 4-word sentence has embeddings $[1,2]$, $[0,1]$, $[2,0]$, $[1,1]$. Compute the bag vector and then its L2 norm (round to 3 decimals).</p>`,
      steps:[
        {do:`Sum: $[1+0+2+1, 2+1+0+1] = [4, 4]$.`, why:`Bag-of-embeddings adds all word vectors.`},
        {do:`Norm: $\\sqrt{4^2 + 4^2} = \\sqrt{32} = 5.657$.`, why:`Measure the length of the summed vector.`},
        {do:`So bag $= [4, 4]$, norm $\\approx 5.657$.`, why:`Summing loses word order but is a cheap sentence encoder.`}
      ],
      answer:`bag $= [4, 4]$, norm $\\approx 5.657$` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-word2vec", [
    { q:`<p>Negative-sampling loss for one positive pair is $-\\log\\sigma(s_+) - \\sum_{j}\\log\\sigma(-s_j)$. With positive score $s_+ = 2$ and two negatives $s_1 = 1$, $s_2 = -0.5$, compute the loss (round to 3 decimals).</p>`,
      steps:[
        {do:`Positive: $-\\log\\sigma(2)$; $\\sigma(2) = 0.8808$, so $-\\log 0.8808 = 0.1269$.`, why:`The true word should get a high score, near probability 1.`},
        {do:`Negatives: $-\\log\\sigma(-1) = -\\log 0.2689 = 1.3133$; $-\\log\\sigma(0.5) = -\\log 0.6225 = 0.4741$.`, why:`Negatives use $\\sigma(-s_j)$; we want their scores low.`},
        {do:`Sum: $0.1269 + 1.3133 + 0.4741 = 1.9143 \\approx 1.914$.`, why:`Add the positive and both negative terms.`}
      ],
      answer:`loss $\\approx 1.914$` },

    { q:`<p>The word2vec subsampling keeps a word with probability $P(w) = \\sqrt{t/f}$ where $f$ is its frequency and $t = 10^{-3}$. A very common word has $f = 0.01$. Compute its keep probability (round to 3 decimals).</p>`,
      steps:[
        {do:`Ratio: $t/f = 10^{-3}/0.01 = 0.1$.`, why:`Frequent words have a small $t/f$, so they are dropped more.`},
        {do:`Keep prob: $\\sqrt{0.1} = 0.3162$.`, why:`Subsampling down-weights very frequent words like "the".`},
        {do:`So $\\approx 0.316$: this word is kept only about $32\\%$ of the time.`, why:`Removing frequent words speeds training and sharpens rare-word vectors.`}
      ],
      answer:`keep probability $\\approx 0.316$` },

    { q:`<p>Negative sampling draws words with probability proportional to $f^{0.75}$. Two words have frequencies $f_a = 0.04$ and $f_b = 0.01$. Compute the ratio of their sampling weights $f_a^{0.75}/f_b^{0.75}$ (round to 2 decimals).</p>`,
      steps:[
        {do:`$f_a^{0.75} = 0.04^{0.75}$; $\\ln 0.04 = -3.2189$, $\\times0.75 = -2.4142$, $e^{-2.4142} = 0.0894$.`, why:`The $0.75$ power flattens the frequency distribution.`},
        {do:`$f_b^{0.75} = 0.01^{0.75}$; $\\ln 0.01 = -4.6052$, $\\times0.75 = -3.4539$, $e^{-3.4539} = 0.0316$.`, why:`Apply the same power to the second frequency.`},
        {do:`Ratio: $0.0894/0.0316 = 2.83$.`, why:`Without the power the raw ratio would be $0.04/0.01 = 4$; the $0.75$ exponent shrinks it.`}
      ],
      answer:`ratio $\\approx 2.83$ (vs raw $4$)` },

    { q:`<p>Skip-gram with window 2 trains on (center, context) pairs. For a sentence of 8 words, interior words have 4 context words but edge words have fewer. Word at position 1 (first) and position 2 each have how many context words, and what is the total pair count over all 8 positions?</p>`,
      steps:[
        {do:`Position 1: only words 2,3 to the right $= 2$ context. Position 2: words 1 (left), 3,4 (right) $= 3$ context.`, why:`Edge words lack left context.`},
        {do:`Positions 3–6 (full interior, window 2 both sides): $4$ each $= 16$. Positions 7,8 mirror 2,1: $3 + 2 = 5$.`, why:`Symmetric edges at the end of the sentence.`},
        {do:`Total pairs: $2 + 3 + 16 + 5 = 26$.`, why:`Sum context counts over all 8 positions.`}
      ],
      answer:`pos 1: 2, pos 2: 3; total $= 26$ pairs` },

    { q:`<p>CBOW averages context embeddings to predict the center. Four context words have embeddings $[2,0]$, $[0,2]$, $[1,1]$, $[1,3]$. Compute the averaged context vector, then its dot product with a center vector $\\theta = [1, 1]$.</p>`,
      steps:[
        {do:`Average: $\\big[\\frac{2+0+1+1}{4}, \\frac{0+2+1+3}{4}\\big] = [1, 1.5]$.`, why:`CBOW pools the context by averaging.`},
        {do:`Dot with $\\theta$: $1(1) + 1.5(1) = 2.5$.`, why:`The score predicts the center word from the pooled context.`},
        {do:`So averaged context $= [1, 1.5]$, score $= 2.5$.`, why:`CBOW is the mirror of skip-gram: context predicts center.`}
      ],
      answer:`context $= [1, 1.5]$, score $= 2.5$` },

    { q:`<p>Cross-entropy of a skip-gram prediction: the model assigns the true context word probability $0.3$. The loss is $-\\log 0.3$. Compute it (natural log, round to 3 decimals), and the loss if the model improved to $0.6$.</p>`,
      steps:[
        {do:`$-\\log 0.3 = 1.2040$.`, why:`The loss is the negative log-probability of the true word.`},
        {do:`Improved: $-\\log 0.6 = 0.5108$.`, why:`Higher probability on the truth means lower loss.`},
        {do:`Drop: $1.204 - 0.511 = 0.693$.`, why:`Doubling the true-word probability from 0.3 to 0.6 cut the loss by $\\log 2 \\approx 0.693$.`}
      ],
      answer:`loss $1.204 \\to 0.511$ (drop $\\approx 0.693$)` },

    { q:`<p>A 3-D analogy: "Paris $-$ France $+$ Italy $\\approx$ Rome". With Paris $=[5, 1, 2]$, France $=[4, 0, 1]$, Italy $=[1, 3, 2]$, compute the result vector and check which of Rome $=[2, 4, 3]$ or Madrid $=[6, 2, 0]$ it is closer to (Euclidean).</p>`,
      steps:[
        {do:`Result $= [5,1,2] - [4,0,1] + [1,3,2] = [2, 4, 3]$.`, why:`Vector analogy arithmetic, component by component.`},
        {do:`Distance to Rome $[2,4,3]$: $\\sqrt{0+0+0} = 0$.`, why:`An exact match.`},
        {do:`Distance to Madrid $[6,2,0]$: $\\sqrt{16+4+9} = \\sqrt{29} = 5.39$.`, why:`Far from the result.`}
      ],
      answer:`result $= [2,4,3]$, closest to Rome (0 vs 5.39)` },

    { q:`<p>The softmax denominator over a $V = 40000$ vocabulary dominates word2vec cost. Hierarchical softmax replaces it with a binary tree of depth $\\lceil\\log_2 V\\rceil$. Compute that depth and the speedup over the full sum (round speedup to nearest whole).</p>`,
      steps:[
        {do:`$\\log_2 40000 = \\ln 40000/\\ln 2 = 10.597/0.6931 = 15.29$, so depth $= 16$.`, why:`The tree has about $\\log_2 V$ levels.`},
        {do:`Full softmax touches all $40000$ words; the tree touches $\\approx 16$ nodes.`, why:`Hierarchical softmax walks one root-to-leaf path.`},
        {do:`Speedup: $40000/16 = 2500\\times$.`, why:`This makes large-vocabulary training feasible.`}
      ],
      answer:`depth $16$; $\\approx 2500\\times$ speedup` },

    { q:`<p>Gradient of the skip-gram log-likelihood for the positive pair pushes $\\theta_t$ toward $e_c$ scaled by $(1 - \\sigma(s))$. With score $s = \\theta_t^\\top e_c = 1.5$, compute the scale factor $1 - \\sigma(1.5)$ (round to 3 decimals).</p>`,
      steps:[
        {do:`$\\sigma(1.5) = 1/(1+e^{-1.5}) = 1/1.2231 = 0.8176$.`, why:`The current model's probability for the true word.`},
        {do:`Scale: $1 - 0.8176 = 0.1824$.`, why:`The gradient is proportional to the prediction error $(1 - \\sigma(s))$.`},
        {do:`So $\\approx 0.182$: a confident-correct prediction yields a small update.`, why:`As $\\sigma(s)\\to1$ the update shrinks — the model has little left to learn here.`}
      ],
      answer:`scale $= 1 - \\sigma(1.5) \\approx 0.182$` },

    { q:`<p>Two candidate analogies give result vector $r = [3, 4]$. Candidate A $=[3, 4]$ has cosine 1 with $r$, and candidate B $=[6, 8]$ also. Cosine cannot separate them, so use the dot product: compute $r\\cdot A$ and $r\\cdot B$ and say which wins under raw dot.</p>`,
      steps:[
        {do:`$r\\cdot A = 3(3) + 4(4) = 9 + 16 = 25$.`, why:`Dot product rewards both direction and magnitude.`},
        {do:`$r\\cdot B = 3(6) + 4(8) = 18 + 32 = 50$.`, why:`B points the same way but is longer.`},
        {do:`B wins under raw dot ($50 &gt; 25$), though cosine ties them — this is why analogy tasks usually normalize to cosine.`, why:`Raw dot favors high-norm (often frequent) words, a known bias.`}
      ],
      answer:`$r\\cdot A = 25$, $r\\cdot B = 50$; B wins under dot (cosine ties)` },

    { q:`<p>Numerically stable negative-sampling: compute $\\log\\sigma(x)$ for a large negative $x = -10$ using $\\log\\sigma(x) = -\\log(1 + e^{-x})$. Give the stable value (round to 5 decimals) and explain why the naive form risks underflow.</p>`,
      steps:[
        {do:`Naive: form $\\sigma(-10) = 1/(1+e^{10}) \\approx 4.54\\times10^{-5}$ first, then log — for $x=-50$ this $\\sigma$ underflows to 0 and $\\log 0 = -\\infty$.`, why:`Computing $\\sigma$ first loses precision for very negative inputs.`},
        {do:`Stable: $\\log\\sigma(-10) = -\\log(1 + e^{10}) = -\\log(1 + 22026.466) = -\\log(22027.466)$.`, why:`Rearranging avoids forming a tiny $\\sigma$ first.`},
        {do:`$= -10.00005$.`, why:`For large $|x|$, $\\log\\sigma(x) \\approx x$, computed stably.`}
      ],
      answer:`$\\log\\sigma(-10) \\approx -10.00005$ (stable form avoids underflow)` },

    { q:`<p>GloVe weights co-occurrence pairs by $f(X) = (X/X_{\\max})^{0.75}$ capped at 1. For a pair with count $X = 25$ and $X_{\\max} = 100$, compute $f(X)$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Ratio: $X/X_{\\max} = 25/100 = 0.25$.`, why:`GloVe down-weights rare co-occurrences relative to the cap.`},
        {do:`Raise to $0.75$: $0.25^{0.75}$; $\\ln 0.25 = -1.3863$, $\\times0.75 = -1.0397$, $e^{-1.0397} = 0.3536$.`, why:`The exponent softens the weighting curve.`},
        {do:`Below the cap of 1, so $f(X) \\approx 0.354$.`, why:`Frequent pairs (up to $X_{\\max}$) get full weight; rarer ones less.`}
      ],
      answer:`$f(25) \\approx 0.354$` },

    { q:`<p>Skip-gram negative sampling does $1 + k$ dot products per pair. With window size 5 (so up to 10 context pairs per center) and $k = 5$ negatives, how many dot products does one center word require?</p>`,
      steps:[
        {do:`Context pairs per center: window 5 each side gives up to $2 \\times 5 = 10$ pairs.`, why:`Each context word forms one positive pair with the center.`},
        {do:`Per pair: $1 + k = 1 + 5 = 6$ dot products.`, why:`One positive plus $k$ negatives.`},
        {do:`Total: $10 \\times 6 = 60$ dot products.`, why:`Multiply pairs by per-pair cost.`}
      ],
      answer:`$10 \\times 6 = 60$ dot products` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-cosine-similarity", [
    { q:`<p>For 5-D vectors $w_1 = [1, 0, 2, 1, 1]$ and $w_2 = [2, 1, 0, 1, 2]$, compute the cosine similarity (round to 3 decimals).</p>`,
      steps:[
        {do:`Dot: $1(2)+0(1)+2(0)+1(1)+1(2) = 2+0+0+1+2 = 5$.`, why:`Sum the elementwise products over all 5 dimensions.`},
        {do:`Norms: $\\lVert w_1\\rVert = \\sqrt{1+0+4+1+1} = \\sqrt{7} = 2.646$; $\\lVert w_2\\rVert = \\sqrt{4+1+0+1+4} = \\sqrt{10} = 3.162$.`, why:`Square, sum, square-root each vector.`},
        {do:`Cosine: $5/(2.646 \\times 3.162) = 5/8.367 = 0.5976 \\approx 0.598$.`, why:`Divide the dot product by the product of lengths.`}
      ],
      answer:`$\\cos\\theta \\approx 0.598$` },

    { q:`<p>Cosine distance is $1 - \\cos\\theta$. For $w_1 = [2, 1]$ and $w_2 = [1, 3]$, compute the cosine similarity and then the cosine distance (round each to 3 decimals).</p>`,
      steps:[
        {do:`Dot: $2(1) + 1(3) = 5$; norms $\\sqrt{5} = 2.236$ and $\\sqrt{10} = 3.162$.`, why:`Standard cosine numerator and denominator.`},
        {do:`Cosine: $5/(2.236 \\times 3.162) = 5/7.071 = 0.7071 \\approx 0.707$.`, why:`A $45^\\circ$ angle gives cosine $\\approx 0.707$.`},
        {do:`Distance: $1 - 0.707 = 0.293$.`, why:`Cosine distance turns similarity into a dissimilarity measure.`}
      ],
      answer:`cosine $\\approx 0.707$, distance $\\approx 0.293$` },

    { q:`<p>Find the angle in degrees between $w_1 = [1, 1, 1, 1]$ and $w_2 = [1, -1, 1, -1]$ (4-D). Compute the cosine, then $\\arccos$ (round angle to 1 decimal).</p>`,
      steps:[
        {do:`Dot: $1 - 1 + 1 - 1 = 0$.`, why:`Opposite signs cancel exactly.`},
        {do:`Norms: both $\\sqrt{1+1+1+1} = 2$; cosine $= 0/(2\\cdot2) = 0$.`, why:`A zero dot product means perpendicular.`},
        {do:`Angle: $\\arccos(0) = 90.0^\\circ$.`, why:`Cosine 0 is a right angle.`}
      ],
      answer:`$\\cos\\theta = 0$, angle $= 90.0^\\circ$` },

    { q:`<p>The dot product relates to cosine by $u\\cdot v = \\lVert u\\rVert\\,\\lVert v\\rVert\\cos\\theta$. Given $\\lVert u\\rVert = 4$, $\\lVert v\\rVert = 5$, and the angle between them is $60^\\circ$, compute $u\\cdot v$.</p>`,
      steps:[
        {do:`$\\cos 60^\\circ = 0.5$.`, why:`A standard angle value.`},
        {do:`$u\\cdot v = 4 \\times 5 \\times 0.5 = 10$.`, why:`Plug the norms and cosine into the relation.`},
        {do:`So $u\\cdot v = 10$.`, why:`This recovers the dot product from geometry.`}
      ],
      answer:`$u\\cdot v = 10$` },

    { q:`<p>Average cosine to a centroid. Vectors $a = [1, 0]$, $b = [0, 1]$ have centroid $m = [0.5, 0.5]$. Compute the cosine similarity of $a$ to $m$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Dot: $a\\cdot m = 1(0.5) + 0(0.5) = 0.5$.`, why:`Compare $a$ against the centroid.`},
        {do:`Norms: $\\lVert a\\rVert = 1$; $\\lVert m\\rVert = \\sqrt{0.25 + 0.25} = \\sqrt{0.5} = 0.7071$.`, why:`The centroid has a smaller norm than the unit vectors.`},
        {do:`Cosine: $0.5/(1 \\times 0.7071) = 0.7071 \\approx 0.707$.`, why:`$a$ sits $45^\\circ$ from the centroid of two perpendicular vectors.`}
      ],
      answer:`$\\cos(a, m) \\approx 0.707$` },

    { q:`<p>Ranking by cosine. A query $q = [1, 2]$ is compared to docs $d_1 = [2, 1]$, $d_2 = [1, 3]$, $d_3 = [3, 0]$. Compute all three cosines (round to 3 decimals) and give the ranking.</p>`,
      steps:[
        {do:`$\\lVert q\\rVert = \\sqrt5 = 2.236$. $q\\cdot d_1 = 4$, $\\lVert d_1\\rVert = \\sqrt5$: cos $= 4/5 = 0.800$.`, why:`Score each doc against the query.`},
        {do:`$q\\cdot d_2 = 1+6 = 7$, $\\lVert d_2\\rVert = \\sqrt{10}$: $7/(2.236\\cdot3.162) = 7/7.071 = 0.990$.`, why:`$d_2$ aligns closely with $q$.`},
        {do:`$q\\cdot d_3 = 3$, $\\lVert d_3\\rVert = 3$: $3/(2.236\\cdot3) = 3/6.708 = 0.447$. Ranking: $d_2 &gt; d_1 &gt; d_3$.`, why:`Higher cosine ranks first in retrieval.`}
      ],
      answer:`$d_2(0.990) &gt; d_1(0.800) &gt; d_3(0.447)$` },

    { q:`<p>Cosine of a vector with a slightly shifted version: $u = [3, 4]$ and $v = u + [0, -1] = [3, 3]$. Compute the cosine similarity (round to 4 decimals).</p>`,
      steps:[
        {do:`Dot: $3(3) + 4(3) = 9 + 12 = 21$.`, why:`A small perturbation keeps the vectors nearly aligned.`},
        {do:`Norms: $\\lVert u\\rVert = 5$; $\\lVert v\\rVert = \\sqrt{9+9} = \\sqrt{18} = 4.2426$.`, why:`Compute both lengths.`},
        {do:`Cosine: $21/(5 \\times 4.2426) = 21/21.213 = 0.9899$.`, why:`Very close to 1: a tiny shift barely changes direction.`}
      ],
      answer:`$\\cos\\theta \\approx 0.9899$` },

    { q:`<p>Soft-cosine idea: weight dimensions by importance $W = \\mathrm{diag}(2, 1)$ before cosine. For $u = [1, 1]$ and $v = [1, 0]$, the weighted dot is $\\sum W_{ii}u_iv_i$ and weighted norm $\\sqrt{\\sum W_{ii}u_i^2}$. Compute the weighted cosine (round to 3 decimals).</p>`,
      steps:[
        {do:`Weighted dot: $2(1)(1) + 1(1)(0) = 2$.`, why:`Dimension 1 counts double under the weights.`},
        {do:`Weighted norms: $\\sqrt{2(1)^2 + 1(1)^2} = \\sqrt3 = 1.732$ for $u$; $\\sqrt{2(1)^2 + 1(0)^2} = \\sqrt2 = 1.414$ for $v$.`, why:`Apply the same weighting inside each norm.`},
        {do:`Weighted cosine: $2/(1.732 \\times 1.414) = 2/2.449 = 0.8165 \\approx 0.816$.`, why:`Up-weighting the shared dimension raises the similarity.`}
      ],
      answer:`weighted cosine $\\approx 0.816$` },

    { q:`<p>Normalize then dot. Vectors $u = [3, 4]$ and $v = [4, 3]$. Normalize each to unit length, then take the dot of the unit vectors (which equals the cosine, round to 3 decimals).</p>`,
      steps:[
        {do:`$\\lVert u\\rVert = \\lVert v\\rVert = 5$; $\\hat{u} = [0.6, 0.8]$, $\\hat{v} = [0.8, 0.6]$.`, why:`Divide each vector by its length.`},
        {do:`Dot of unit vectors: $0.6(0.8) + 0.8(0.6) = 0.48 + 0.48 = 0.96$.`, why:`For unit vectors the dot product is the cosine.`},
        {do:`So $\\cos\\theta = 0.960$.`, why:`Pre-normalizing turns cosine into a plain dot product — a common retrieval trick.`}
      ],
      answer:`$\\cos\\theta = 0.960$` },

    { q:`<p>Cosine is invariant to positive scaling but not to translation. For $u = [1, 1]$ and $v = [2, 2]$, cosine is 1. Now shift both by $[3, 0]$ to $u' = [4, 1]$, $v' = [5, 2]$. Compute the new cosine (round to 4 decimals) to show translation changes it.</p>`,
      steps:[
        {do:`Dot: $4(5) + 1(2) = 20 + 2 = 22$.`, why:`Recompute after the shift.`},
        {do:`Norms: $\\lVert u'\\rVert = \\sqrt{16+1} = \\sqrt{17} = 4.1231$; $\\lVert v'\\rVert = \\sqrt{25+4} = \\sqrt{29} = 5.3852$.`, why:`The shift changed both lengths and directions.`},
        {do:`Cosine: $22/(4.1231 \\times 5.3852) = 22/22.204 = 0.9908$, no longer exactly 1.`, why:`Translation breaks the perfect alignment that scaling preserved.`}
      ],
      answer:`new cosine $\\approx 0.9908$ (translation changes it)` },

    { q:`<p>Triangle of similarities. Unit vectors $a, b, c$ lie in a plane with $a\\cdot b = 0.8$ and $b\\cdot c = 0.6$, with $a$ and $c$ on opposite sides of $b$, so $a\\cdot c = \\cos(\\theta_{ab} + \\theta_{bc})$. Compute $a\\cdot c$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Angles: $\\theta_{ab} = \\arccos 0.8 = 36.87^\\circ$, $\\theta_{bc} = \\arccos 0.6 = 53.13^\\circ$.`, why:`Convert each cosine to an angle.`},
        {do:`Sum: $36.87 + 53.13 = 90.0^\\circ$.`, why:`On opposite sides, the angles add.`},
        {do:`$a\\cdot c = \\cos 90^\\circ = 0.000$.`, why:`The two outer vectors end up perpendicular.`}
      ],
      answer:`$a\\cdot c = \\cos 90^\\circ = 0.000$` },

    { q:`<p>k-NN by cosine: a query unit vector $q = [0.6, 0.8]$ is compared to unit vectors $n_1 = [1, 0]$, $n_2 = [0, 1]$, $n_3 = [0.8, 0.6]$. Find the nearest neighbor (highest cosine) — since all are unit vectors, cosine is just the dot product.</p>`,
      steps:[
        {do:`$q\\cdot n_1 = 0.6$; $q\\cdot n_2 = 0.8$.`, why:`Unit vectors make cosine equal the dot product.`},
        {do:`$q\\cdot n_3 = 0.6(0.8) + 0.8(0.6) = 0.48 + 0.48 = 0.96$.`, why:`$n_3$ points almost the same way as $q$.`},
        {do:`Highest is $n_3$ at $0.96$, so $n_3$ is the nearest neighbor.`, why:`Cosine k-NN picks the most aligned vector.`}
      ],
      answer:`nearest is $n_3$ (cosine $0.96$)` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-attention", [
    { q:`<p>Scaled dot-product attention over three keys gives raw dot products $e = [6, 3, 0]$ with $d_k = 9$. Scale by $\\sqrt{d_k}$, then softmax to get the three weights (round each to 3 decimals).</p>`,
      steps:[
        {do:`Scale: $\\sqrt9 = 3$, scaled scores $= [6/3, 3/3, 0/3] = [2, 1, 0]$.`, why:`Dividing by $\\sqrt{d_k}$ keeps the softmax from saturating.`},
        {do:`Exponentiate: $e^2 = 7.389$, $e^1 = 2.718$, $e^0 = 1$; sum $Z = 11.107$.`, why:`Softmax over the scaled scores.`},
        {do:`Weights: $7.389/11.107 = 0.665$, $2.718/11.107 = 0.245$, $1/11.107 = 0.090$.`, why:`The largest scaled score gets the most attention.`}
      ],
      answer:`$\\alpha \\approx [0.665, 0.245, 0.090]$` },

    { q:`<p>Full scaled attention with vector values. $q = [1, 0]$; keys $k_1 = [2, 0]$, $k_2 = [0, 1]$; $d_k = 4$. Value vectors $v_1 = [1, 0]$, $v_2 = [0, 4]$. Compute the context vector (round entries to 3 decimals).</p>`,
      steps:[
        {do:`Dot products: $q\\cdot k_1 = 2$, $q\\cdot k_2 = 0$. Scale by $\\sqrt4 = 2$: $[1, 0]$.`, why:`Score each key, then divide by $\\sqrt{d_k}$.`},
        {do:`Softmax $[1, 0]$: $e^1 = 2.718$, $e^0 = 1$, $Z = 3.718$; weights $[0.731, 0.269]$.`, why:`Convert scaled scores to attention weights.`},
        {do:`Context: $0.731[1,0] + 0.269[0,4] = [0.731, 1.076]$.`, why:`Weighted sum of the value vectors.`}
      ],
      answer:`context $\\approx [0.731, 1.076]$` },

    { q:`<p>Why scale by $\\sqrt{d_k}$? For random query/key entries with variance 1, a dot product over $d_k = 64$ dimensions has variance $d_k = 64$ and std $\\sqrt{64} = 8$. After dividing by $\\sqrt{d_k}$, what is the new std of the scores?</p>`,
      steps:[
        {do:`Unscaled std: $\\sqrt{d_k} = \\sqrt{64} = 8$.`, why:`Summing $d_k$ independent unit-variance products gives variance $d_k$.`},
        {do:`Dividing by $\\sqrt{d_k} = 8$ divides the std by 8.`, why:`Scaling a variable by $1/c$ scales its std by $1/c$.`},
        {do:`New std: $8/8 = 1$.`, why:`Scaling normalizes the score std to 1, keeping softmax gradients healthy.`}
      ],
      answer:`new std $= 1$ (was 8 before scaling)` },

    { q:`<p>Multi-head attention with $h = 12$ heads and $d_{\\text{model}} = 768$. Each head projects $Q$, $K$, $V$ to $d_k = d_{\\text{model}}/h$. Give $d_k$, and the total size of the concatenated multi-head output before the final projection.</p>`,
      steps:[
        {do:`$d_k = 768/12 = 64$.`, why:`The model dimension splits evenly across heads.`},
        {do:`Each head outputs $d_k = 64$; concatenated: $12 \\times 64 = 768$.`, why:`Heads are concatenated back to the model width.`},
        {do:`So $d_k = 64$ and the concatenated output has $768$ numbers per position.`, why:`Multi-head keeps total width constant while letting heads specialize.`}
      ],
      answer:`$d_k = 64$; concatenated output $= 768$` },

    { q:`<p>Count parameters of the $Q$, $K$, $V$ projections plus the output projection in a multi-head attention block with $d_{\\text{model}} = 512$ (each projection is $512\\times512$, ignore biases).</p>`,
      steps:[
        {do:`Each projection: $512 \\times 512 = 262{,}144$ weights.`, why:`A full $d_{\\text{model}}\\times d_{\\text{model}}$ matrix.`},
        {do:`There are 4 such matrices: $W_Q, W_K, W_V, W_O$.`, why:`Three input projections plus one output projection.`},
        {do:`Total: $4 \\times 262{,}144 = 1{,}048{,}576$.`, why:`Sum all four projection matrices.`}
      ],
      answer:`$4 \\times 512^2 = 1{,}048{,}576$ parameters` },

    { q:`<p>Causal (masked) self-attention sets future scores to $-\\infty$ so they get weight 0. For position 3 in a length-5 sequence, how many keys can it attend to, and over a full sequence how many valid (query, key) pairs exist?</p>`,
      steps:[
        {do:`Position 3 attends to positions 1, 2, 3 only: $3$ keys.`, why:`Causal masking blocks attending to the future.`},
        {do:`Valid pairs: $1 + 2 + 3 + 4 + 5 = 15$ for length 5.`, why:`Position $t$ attends to $t$ keys; sum over positions.`},
        {do:`So $3$ keys for position 3, $15$ valid pairs total ($= n(n+1)/2$).`, why:`The mask roughly halves the full $n^2 = 25$ attention budget.`}
      ],
      answer:`position 3: 3 keys; total $15$ valid pairs` },

    { q:`<p>A softmax attention assigns weights $\\alpha = [0.7, 0.2, 0.1]$ to value vectors $v_1 = [2, 0]$, $v_2 = [0, 5]$, $v_3 = [4, 4]$. Compute the 2-D context vector (round each entry to 2 decimals).</p>`,
      steps:[
        {do:`First component: $0.7(2) + 0.2(0) + 0.1(4) = 1.4 + 0 + 0.4 = 1.8$.`, why:`Weight each value's first coordinate.`},
        {do:`Second component: $0.7(0) + 0.2(5) + 0.1(4) = 0 + 1.0 + 0.4 = 1.4$.`, why:`Weight each value's second coordinate.`},
        {do:`Context $= [1.80, 1.40]$.`, why:`The context is the attention-weighted average of value vectors.`}
      ],
      answer:`context $= [1.80, 1.40]$` },

    { q:`<p>Temperature in attention: dividing scores by $T$ before softmax sharpens ($T&lt;1$) or flattens ($T&gt;1$) the weights. Scores $[2, 0]$ with $T = 2$ give scaled scores $[1, 0]$. Compute the two weights and compare to $T = 1$ (round to 3 decimals).</p>`,
      steps:[
        {do:`$T = 2$: scaled $[1, 0]$, $e^1 = 2.718$, $e^0 = 1$, $Z = 3.718$; weights $[0.731, 0.269]$.`, why:`Higher temperature flattens the distribution.`},
        {do:`$T = 1$: scores $[2, 0]$, $e^2 = 7.389$, $e^0 = 1$, $Z = 8.389$; weights $[0.881, 0.119]$.`, why:`Lower temperature sharpens toward the top score.`},
        {do:`So $T=2$ gives $[0.731, 0.269]$ (flatter) vs $T=1$'s $[0.881, 0.119]$.`, why:`Temperature controls how peaked attention is.`}
      ],
      answer:`$T=2$: $[0.731, 0.269]$ vs $T=1$: $[0.881, 0.119]$` },

    { q:`<p>Additive (Bahdanau) attention scores with $e = v^\\top\\tanh(W_a s + U_a h)$. Given $W_a s + U_a h = [0.5, -0.5]$ and $v = [2, 2]$, compute the scalar score $e$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Apply $\\tanh$ elementwise: $\\tanh(0.5) = 0.4621$, $\\tanh(-0.5) = -0.4621$.`, why:`Additive attention squashes the combined hidden vector.`},
        {do:`Dot with $v$: $2(0.4621) + 2(-0.4621) = 0.9242 - 0.9242 = 0$.`, why:`The score is a learned projection of the squashed vector.`},
        {do:`So $e = 0.000$.`, why:`Here the symmetric inputs cancel, giving a neutral score.`}
      ],
      answer:`$e = 0.000$` },

    { q:`<p>Self-attention memory: storing the $n\\times n$ score matrix for $n = 2048$ in float32 (4 bytes) costs how many MB (1 MB $= 10^6$ bytes), and how does it change if $n$ doubles to 4096?</p>`,
      steps:[
        {do:`Entries: $2048^2 = 4{,}194{,}304$; bytes $\\times4 = 16{,}777{,}216 = 16.78$ MB.`, why:`The attention matrix is $n\\times n$.`},
        {do:`Doubling $n$: $4096^2 = 16{,}777{,}216$ entries, $\\times4 = 67{,}108{,}864 = 67.11$ MB.`, why:`$n^2$ memory means doubling $n$ quadruples cost.`},
        {do:`So $16.78$ MB $\\to 67.11$ MB, a $4\\times$ jump.`, why:`This quadratic memory is the long-context bottleneck.`}
      ],
      answer:`$16.78$ MB; doubling $n$ gives $67.11$ MB ($4\\times$)` },

    { q:`<p>Two-head attention concatenates per-head contexts. Head 1 outputs $[1, 2]$, head 2 outputs $[3, 0]$. The concatenated vector $[1, 2, 3, 0]$ is projected by $W_O = \\begin{bmatrix}1 & 0 & 1 & 0\\\\0 & 1 & 0 & 1\\end{bmatrix}$. Compute the final 2-D output.</p>`,
      steps:[
        {do:`Row 1 of $W_O$ times $[1,2,3,0]$: $1(1)+0(2)+1(3)+0(0) = 1 + 3 = 4$.`, why:`The output projection mixes the concatenated head outputs.`},
        {do:`Row 2: $0(1)+1(2)+0(3)+1(0) = 2 + 0 = 2$.`, why:`Second output coordinate from the second row.`},
        {do:`Final output $= [4, 2]$.`, why:`$W_O$ blends information across heads.`}
      ],
      answer:`final output $= [4, 2]$` },

    { q:`<p>Attention entropy measures focus: $H = -\\sum\\alpha_i\\log_2\\alpha_i$. For weights $\\alpha = [0.5, 0.5]$ (split) vs $[0.9, 0.1]$ (focused), compute both entropies (round to 3 decimals) and say which attends more sharply.</p>`,
      steps:[
        {do:`Split: $-2(0.5\\log_2 0.5) = -2(0.5)(-1) = 1.000$ bit.`, why:`Equal weights give maximum entropy for two items.`},
        {do:`Focused: $-(0.9\\log_2 0.9 + 0.1\\log_2 0.1) = -(0.9(-0.152) + 0.1(-3.322)) = 0.137 + 0.332 = 0.469$ bit.`, why:`Concentrated weight lowers entropy.`},
        {do:`The $[0.9, 0.1]$ case ($0.469$ bit) attends more sharply than $[0.5,0.5]$ ($1.000$ bit).`, why:`Lower entropy means more focused attention.`}
      ],
      answer:`split $H = 1.000$, focused $H \\approx 0.469$ — focused attends sharper` },

    { q:`<p>Cross-attention in a decoder: 6 query positions attend to 10 encoder key positions. How many attention scores are computed, and how does this differ from self-attention's $n^2$?</p>`,
      steps:[
        {do:`Scores: queries $\\times$ keys $= 6 \\times 10 = 60$.`, why:`Cross-attention forms a (queries $\\times$ keys) rectangle, not a square.`},
        {do:`Self-attention would be $6^2 = 36$ (decoder to itself) or $10^2 = 100$ (encoder to itself).`, why:`Self-attention uses one sequence for both queries and keys.`},
        {do:`So $60$ cross scores, between the decoder-side $36$ and encoder-side $100$.`, why:`Cross-attention links two different sequences.`}
      ],
      answer:`$6 \\times 10 = 60$ scores (rectangular, not $n^2$)` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-data-augmentation", [
    { q:`<p>An augmentation pipeline chooses: scale (3 options), flip (2), rotation (8), and color jitter (5). How many distinct augmented versions per image, and from $500$ originals how many total?</p>`,
      steps:[
        {do:`Per image: $3 \\times 2 \\times 8 \\times 5 = 240$.`, why:`Independent transforms multiply.`},
        {do:`$3\\times2 = 6$, $\\times8 = 48$, $\\times5 = 240$.`, why:`Multiply step by step.`},
        {do:`Total: $500 \\times 240 = 120{,}000$.`, why:`Each original spawns 240 variants.`}
      ],
      answer:`$240$ per image; $120{,}000$ total` },

    { q:`<p>Random crops from a $300\\times200$ image taking $224\\times224$ patches by sliding. Compute the number of horizontal and vertical positions and the total crops.</p>`,
      steps:[
        {do:`Horizontal: $300 - 224 + 1 = 77$ positions.`, why:`The window's left edge ranges from 0 to $300-224=76$.`},
        {do:`Vertical: $200 - 224 + 1 = -23$, which is $\\le 0$.`, why:`The crop is taller than the image height, so no valid vertical position exists.`},
        {do:`Total crops: $0$ — the patch does not fit vertically.`, why:`Crop size must not exceed either image dimension.`}
      ],
      answer:`$0$ crops (224 > image height 200)` },

    { q:`<p>Mixup blends two images: $\\tilde{x} = \\lambda x_1 + (1-\\lambda)x_2$ with $\\lambda = 0.7$. One pixel is $x_1 = 200$, $x_2 = 50$. Compute the mixed pixel and the mixed label if labels are one-hot $y_1 = [1, 0]$, $y_2 = [0, 1]$.</p>`,
      steps:[
        {do:`Mixed pixel: $0.7(200) + 0.3(50) = 140 + 15 = 155$.`, why:`Mixup linearly interpolates pixels.`},
        {do:`Mixed label: $0.7[1,0] + 0.3[0,1] = [0.7, 0.3]$.`, why:`The label is blended by the same $\\lambda$.`},
        {do:`So pixel $= 155$, label $= [0.7, 0.3]$.`, why:`Mixup trains on soft labels between two classes.`}
      ],
      answer:`pixel $= 155$, label $= [0.7, 0.3]$` },

    { q:`<p>CutMix pastes a $96\\times96$ patch from image B onto a $224\\times224$ image A. The label mixing ratio is the patch area fraction. Compute the fraction of the label assigned to B (round to 3 decimals).</p>`,
      steps:[
        {do:`Patch area: $96 \\times 96 = 9{,}216$ pixels.`, why:`CutMix's label weight is the pasted area fraction.`},
        {do:`Total area: $224 \\times 224 = 50{,}176$ pixels.`, why:`The full image area.`},
        {do:`Fraction to B: $9{,}216/50{,}176 = 0.1837 \\approx 0.184$.`, why:`The remaining $0.816$ stays with image A's label.`}
      ],
      answer:`B's label weight $\\approx 0.184$` },

    { q:`<p>Cutout masks a random $40\\times40$ square in a $160\\times160$ image. What fraction of pixels is masked, and how many pixels remain visible?</p>`,
      steps:[
        {do:`Masked: $40 \\times 40 = 1{,}600$ pixels.`, why:`Cutout zeros out a square region.`},
        {do:`Total: $160 \\times 160 = 25{,}600$ pixels.`, why:`The full image.`},
        {do:`Fraction masked: $1{,}600/25{,}600 = 0.0625$; visible: $25{,}600 - 1{,}600 = 24{,}000$.`, why:`Cutout forces the model to use context, not one region.`}
      ],
      answer:`$6.25\\%$ masked; $24{,}000$ pixels visible` },

    { q:`<p>An augmentation policy applies each of 3 transforms independently with probability $0.5$. What is the probability that a given image gets all 3 applied, and the probability it gets none?</p>`,
      steps:[
        {do:`All three: $0.5 \\times 0.5 \\times 0.5 = 0.125$.`, why:`Independent events multiply.`},
        {do:`None: also $(1-0.5)^3 = 0.5^3 = 0.125$.`, why:`Each transform is skipped with probability $0.5$.`},
        {do:`So both "all 3" and "none" have probability $0.125$ ($12.5\\%$).`, why:`Symmetric because $p = 0.5$.`}
      ],
      answer:`all 3: $0.125$; none: $0.125$` },

    { q:`<p>RandAugment picks $N = 2$ transforms from a pool of $14$, order mattering, without repetition. How many distinct ordered pairs of transforms are possible?</p>`,
      steps:[
        {do:`First pick: $14$ choices.`, why:`Any of the 14 transforms can come first.`},
        {do:`Second pick: $13$ remaining (no repeats).`, why:`One transform is already used.`},
        {do:`Ordered pairs: $14 \\times 13 = 182$.`, why:`Order matters, so multiply without dividing.`}
      ],
      answer:`$14 \\times 13 = 182$ ordered pairs` },

    { q:`<p>You augment $200$ originals and want at least $30{,}000$ images using crops (C), flips (2), and color shifts (4). What is the smallest whole number of crop variants $C$ needed?</p>`,
      steps:[
        {do:`Per-original variants: $C \\times 2 \\times 4 = 8C$; total $= 200 \\times 8C = 1600C$.`, why:`Multiply transform counts, then the dataset size.`},
        {do:`Require $1600C \\ge 30{,}000$, so $C \\ge 18.75$.`, why:`Solve the inequality.`},
        {do:`Round up: $C = 19$ (gives $1600\\times19 = 30{,}400$).`, why:`18 crops would fall short at $28{,}800$.`}
      ],
      answer:`$C = 19$ (gives $30{,}400 \\ge 30{,}000$)` },

    { q:`<p>Test-time augmentation averages 10 predictions per image. Each augmented view predicts class "cat" with probabilities $[0.6, 0.7, 0.5, 0.8, 0.65, 0.55, 0.75, 0.6, 0.7, 0.6]$. Compute the averaged "cat" probability (round to 3 decimals).</p>`,
      steps:[
        {do:`Sum: $0.6+0.7+0.5+0.8+0.65+0.55+0.75+0.6+0.7+0.6 = 6.45$.`, why:`TTA averages predictions over augmented views.`},
        {do:`Divide by 10: $6.45/10 = 0.645$.`, why:`Mean over the 10 views.`},
        {do:`So averaged probability $\\approx 0.645$.`, why:`Averaging smooths out view-to-view noise.`}
      ],
      answer:`averaged "cat" probability $\\approx 0.645$` },

    { q:`<p>Affine augmentation composes a rotation and a scaling. Rotating $90^\\circ$ then scaling by 2 maps a point $(1, 0)$. The $90^\\circ$ rotation sends $(1,0)\\to(0,1)$; then scale by 2. Compute the final point.</p>`,
      steps:[
        {do:`Rotate $90^\\circ$: $(1, 0) \\to (0, 1)$.`, why:`A $90^\\circ$ rotation sends the x-axis to the y-axis.`},
        {do:`Scale by 2: $(0, 1) \\to (0, 2)$.`, why:`Scaling multiplies both coordinates by 2.`},
        {do:`Final point: $(0, 2)$.`, why:`Composed affine transforms apply in sequence.`}
      ],
      answer:`final point $= (0, 2)$` },

    { q:`<p>An augmentation budget caps the expanded dataset at $1{,}000{,}000$ images. With $800$ originals and a fixed pipeline of $5 \\times 4 \\times 3$ variants, do you exceed the budget? If not, by how many images is it under?</p>`,
      steps:[
        {do:`Variants per image: $5 \\times 4 \\times 3 = 60$.`, why:`Multiply the independent option counts.`},
        {do:`Total: $800 \\times 60 = 48{,}000$.`, why:`Each original spawns 60 variants.`},
        {do:`$48{,}000 &lt; 1{,}000{,}000$, under by $1{,}000{,}000 - 48{,}000 = 952{,}000$.`, why:`Well within the budget.`}
      ],
      answer:`under budget by $952{,}000$ images` },

    { q:`<p>Combining everything: from one image you take $33\\times33 = 1089$ crops, each with 8 rotations, 2 flips, and 3 brightness levels. How many variants per image, and is that over a $50{,}000$-per-image cap?</p>`,
      steps:[
        {do:`Transforms after crops: $8 \\times 2 \\times 3 = 48$.`, why:`Multiply the non-crop options.`},
        {do:`Total per image: $1089 \\times 48 = 52{,}272$.`, why:`Each crop is further transformed 48 ways.`},
        {do:`$52{,}272 &gt; 50{,}000$, so it exceeds the cap by $2{,}272$.`, why:`Combinatorial augmentation explodes quickly.`}
      ],
      answer:`$52{,}272$ per image — over the cap by $2{,}272$` },
  ]);

})();
