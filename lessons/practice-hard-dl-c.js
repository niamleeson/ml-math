/* =====================================================================
   PRACTICE PROBLEMS — MODULE 3 (Deep Learning), HARDER set C.
   Owned ids: dl-gan, dl-rnn, dl-vanishing-gradient, dl-lstm-gru,
   dl-word-embeddings, dl-word2vec, dl-cosine-similarity, dl-attention,
   dl-data-augmentation.
   These extend the existing set C with harder, multi-step problems,
   increasing in difficulty within each id.
   ===================================================================== */
(function(){
  var P = window.PRACTICE;
  function add(id, probs){ P[id] = (P[id] || []).concat(probs); }

  /* ---------------------------------------------------------------- */
  add("dl-gan", [
    { q:`<p>A GAN discriminator outputs $D(x)$, its guess that a sample is real. On a fake it gives $D = 0.25$. The discriminator's loss on that fake is $-\\log(1 - D)$ (natural log). Compute the loss.</p>`,
      steps:[
        {do:`Compute $1 - D = 1 - 0.25 = 0.75$.`, why:`The discriminator wants a fake's "real" score near 0, so $1-D$ near 1 is good.`},
        {do:`Take $\\log(0.75) = -0.2877$ (natural log).`, why:`Natural log of a number below 1 is negative.`},
        {do:`Negate: loss $= -(-0.2877) = 0.2877$, round to $0.288$.`, why:`The minus sign in $-\\log(1-D)$ turns it into a positive loss.`}
      ],
      answer:`$-\\log(1 - 0.25) \\approx 0.288$` },

    { q:`<p>On the same fake with $D = 0.25$, the generator's loss is $-\\log(D)$. Compute it and say who is "winning" this round.</p>`,
      steps:[
        {do:`Take $\\log(0.25) = -1.3863$.`, why:`The generator wants $D$ near 1 (fool the detective); $D=0.25$ is bad for it.`},
        {do:`Negate: generator loss $= 1.3863 \\approx 1.386$.`, why:`Higher loss means the generator is doing poorly.`},
        {do:`Compare: discriminator loss $0.288$ is much smaller than generator loss $1.386$.`, why:`Smaller loss means doing better, so the discriminator is winning this round.`}
      ],
      answer:`generator loss $\\approx 1.386$; the discriminator is winning ($D$ correctly low on the fake)` },

    { q:`<p>The GAN value function is $V = \\log D(x_{\\text{real}}) + \\log(1 - D(x_{\\text{fake}}))$. With $D(x_{\\text{real}}) = 0.9$ and $D(x_{\\text{fake}}) = 0.2$, compute $V$ (natural log).</p>`,
      steps:[
        {do:`First term: $\\log(0.9) = -0.1054$.`, why:`The discriminator scored the real sample 0.9; close to 1 is good for it.`},
        {do:`Second term: $\\log(1 - 0.2) = \\log(0.8) = -0.2231$.`, why:`On the fake, $1-D = 0.8$; the discriminator wants this near 1.`},
        {do:`Add: $V = -0.1054 + (-0.2231) = -0.3285 \\approx -0.329$.`, why:`The discriminator tries to maximize $V$; the generator tries to minimize it.`}
      ],
      answer:`$V \\approx -0.329$` },

    { q:`<p>At the GAN equilibrium the generator's samples match real data, so the discriminator can only guess: $D(x) = 0.5$ on every sample. Compute the value function $V = \\log D(x_{\\text{real}}) + \\log(1 - D(x_{\\text{fake}}))$ at this point.</p>`,
      steps:[
        {do:`Both terms use $D = 0.5$: $\\log(0.5) + \\log(1 - 0.5) = \\log 0.5 + \\log 0.5$.`, why:`At equilibrium the discriminator outputs 0.5 for real and fake alike.`},
        {do:`$\\log(0.5) = -0.6931$, so $V = 2 \\times (-0.6931) = -1.3863$.`, why:`Two equal terms, each $\\log 0.5$.`},
        {do:`Round: $V \\approx -1.386$. Note $-1.386 \\approx -\\log 4 = 2\\log 0.5$.`, why:`This $-\\log 4$ is the famous optimal-discriminator GAN value at equilibrium.`}
      ],
      answer:`$V = 2\\log 0.5 \\approx -1.386$ (i.e. $-\\log 4$)` },

    { q:`<p>For the optimal discriminator, $D^*(x) = \\frac{p_{\\text{data}}(x)}{p_{\\text{data}}(x) + p_g(x)}$. At a point where $p_{\\text{data}} = 0.6$ and the generator's density $p_g = 0.2$, compute $D^*(x)$ and round to 3 decimals.</p>`,
      steps:[
        {do:`Denominator: $p_{\\text{data}} + p_g = 0.6 + 0.2 = 0.8$.`, why:`The optimal discriminator compares real density to the total density there.`},
        {do:`Divide: $D^*(x) = 0.6 / 0.8 = 0.75$.`, why:`Real data is 3 times as likely here as the fake, so the detective leans "real".`},
        {do:`Round: $0.750$.`, why:`Where real density dominates, $D^*$ exceeds 0.5.`}
      ],
      answer:`$D^*(x) = 0.6/0.8 = 0.750$` },

    { q:`<p>Where the generator perfectly matches the data, $p_g(x) = p_{\\text{data}}(x)$. Using $D^*(x) = \\frac{p_{\\text{data}}}{p_{\\text{data}} + p_g}$, show what value $D^*$ takes and explain the equilibrium.</p>`,
      steps:[
        {do:`Set $p_g = p_{\\text{data}} = p$. Then $D^*(x) = \\frac{p}{p + p} = \\frac{p}{2p}$.`, why:`When the two densities are equal, substitute one symbol for both.`},
        {do:`Simplify: $\\frac{p}{2p} = \\frac{1}{2} = 0.5$.`, why:`The $p$ cancels, leaving exactly one half.`},
        {do:`Interpret: $D^* = 0.5$ everywhere, so the discriminator is reduced to a coin flip.`, why:`This is the GAN equilibrium: the generator's fakes are indistinguishable from real data.`}
      ],
      answer:`$D^* = 0.5$ everywhere — the equilibrium where fakes are indistinguishable` },

    { q:`<p>The non-saturating generator loss is $-\\log D(x_{\\text{fake}})$. The generator improves a fake from $D = 0.1$ to $D = 0.4$. By how much did its loss drop (natural log, round to 3 decimals)?</p>`,
      steps:[
        {do:`Loss before: $-\\log(0.1) = 2.3026$.`, why:`A fake easily caught ($D=0.1$) gives the generator a big loss.`},
        {do:`Loss after: $-\\log(0.4) = 0.9163$.`, why:`The improved fake fools the detective more, so loss falls.`},
        {do:`Drop: $2.3026 - 0.9163 = 1.3863 \\approx 1.386$.`, why:`The difference is how much the generator's loss improved this round.`}
      ],
      answer:`loss dropped by $\\approx 1.386$` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-rnn", [
    { q:`<p>An RNN updates with $a^{<t>} = \\tanh(W_{aa}\\,a^{<t-1>} + W_{ax}\\,x^{<t>} + b)$. Use $W_{aa} = 0.5$, $W_{ax} = 1$, $b = 0$, $a^{<0>} = 0$, and inputs $x = [2, 1, -1]$. Compute $a^{<1>}$, $a^{<2>}$, $a^{<3>}$ (round each to 3 decimals).</p>`,
      steps:[
        {do:`Step 1: pre-activation $= 0.5(0) + 1(2) + 0 = 2$, so $a^{<1>} = \\tanh(2) = 0.964$.`, why:`Start from zero memory and feed the first input.`},
        {do:`Step 2: $= 0.5(0.964) + 1(1) = 1.482$, so $a^{<2>} = \\tanh(1.482) = 0.902$.`, why:`The new input plus half of the carried memory.`},
        {do:`Step 3: $= 0.5(0.902) + 1(-1) = -0.549$, so $a^{<3>} = \\tanh(-0.549) = -0.500$.`, why:`A negative input drives the squished memory negative.`}
      ],
      answer:`$a^{<1>} \\approx 0.964,\\; a^{<2>} \\approx 0.902,\\; a^{<3>} \\approx -0.500$` },

    { q:`<p>Same RNN cell, but now $W_{aa} = 1$, $W_{ax} = 0.5$, $b = -0.2$, $a^{<0>} = 0$, inputs $x = [1, 2, 2]$. Compute $a^{<1>}$ and $a^{<2>}$ ($\\tanh$, round to 3 decimals).</p>`,
      steps:[
        {do:`Step 1: $1(0) + 0.5(1) - 0.2 = 0.3$, so $a^{<1>} = \\tanh(0.3) = 0.291$.`, why:`The bias $-0.2$ shifts the pre-activation down before squishing.`},
        {do:`Step 2: $1(0.291) + 0.5(2) - 0.2 = 1.091$, so $a^{<2>} = \\tanh(1.091) = 0.797$.`, why:`Memory weight is now 1, so the full previous state carries forward.`},
        {do:`Note the memory grew because $W_{aa} = 1$ keeps the past intact.`, why:`Larger $W_{aa}$ means a longer-lasting memory.`}
      ],
      answer:`$a^{<1>} \\approx 0.291,\\; a^{<2>} \\approx 0.797$` },

    { q:`<p>An RNN also has an output $\\hat{y}^{<t>} = W_{ya}\\,a^{<t>} + b_y$. With the cell $a^{<t>} = \\tanh(0.5\\,a^{<t-1>} + 1\\cdot x^{<t>})$, $a^{<0>} = 0$, inputs $x = [2, 1]$, and output weights $W_{ya} = 2$, $b_y = -1$, compute $\\hat{y}^{<2>}$ (round to 3 decimals).</p>`,
      steps:[
        {do:`$a^{<1>} = \\tanh(0.5(0) + 2) = \\tanh(2) = 0.964$.`, why:`First get the hidden state at step 1.`},
        {do:`$a^{<2>} = \\tanh(0.5(0.964) + 1) = \\tanh(1.482) = 0.902$.`, why:`Carry the memory into step 2 with the new input.`},
        {do:`Output: $\\hat{y}^{<2>} = 2(0.902) - 1 = 0.804$.`, why:`Apply the linear output layer to the step-2 hidden state.`}
      ],
      answer:`$\\hat{y}^{<2>} \\approx 0.804$` },

    { q:`<p>A bidirectional RNN reads a length-7 sentence both forward and backward and concatenates the two hidden states at each position. Each direction's hidden state has 4 numbers. How many numbers describe each position, and how many across the whole sentence?</p>`,
      steps:[
        {do:`Per position: forward 4 + backward 4 = 8 numbers.`, why:`Concatenation stacks the two direction vectors end to end.`},
        {do:`Across 7 positions: $7 \\times 8 = 56$ numbers total.`, why:`Each of the 7 words gets its own 8-number combined state.`},
        {do:`Confirm: 56 is exact (whole counts).`, why:`No rounding needed for integer counts.`}
      ],
      answer:`8 numbers per position; $7 \\times 8 = 56$ numbers total` },

    { q:`<p>An RNN cell has input dimension 3 and hidden dimension 5. The cell uses $W_{ax}$ (hidden×input), $W_{aa}$ (hidden×hidden), and bias $b_a$ (hidden). Count the total learnable parameters in the cell.</p>`,
      steps:[
        {do:`$W_{ax}$ is $5 \\times 3 = 15$ parameters.`, why:`One weight per (hidden unit, input feature) pair.`},
        {do:`$W_{aa}$ is $5 \\times 5 = 25$ parameters; bias $b_a$ is $5$.`, why:`The recurrent matrix maps the 5-dim state to itself; one bias per hidden unit.`},
        {do:`Total: $15 + 25 + 5 = 45$ parameters.`, why:`Sum the two weight matrices and the bias vector.`}
      ],
      answer:`$15 + 25 + 5 = 45$ parameters` },

    { q:`<p>Over $T = 4$ steps an RNN's backprop multiplies the same recurrent slope at each hop. Approximate that per-step factor as $0.5$, so the gradient flowing from step 4 back to step 1 is scaled by $(0.5)^{T-1}$. Compute the resulting factor.</p>`,
      steps:[
        {do:`Number of hops from step 4 to step 1 is $T - 1 = 3$.`, why:`Going back through 4 time steps crosses 3 recurrent links.`},
        {do:`Factor $= (0.5)^3 = 0.125$.`, why:`Each hop multiplies by the per-step slope of 0.5.`},
        {do:`So the step-1 gradient is shrunk to $12.5\\%$ of the step-4 signal.`, why:`Repeated multiplication by a number below 1 shrinks the gradient — the start of vanishing.`}
      ],
      answer:`$(0.5)^3 = 0.125$` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-vanishing-gradient", [
    { q:`<p>Backprop through a sequence multiplies one slope per step. With a per-step slope of $0.8$ over $10$ steps, compute the total gradient factor $0.8^{10}$ (round to 4 decimals) and say if it vanishes.</p>`,
      steps:[
        {do:`Compute $0.8^{10}$. $0.8^5 = 0.32768$, then square: $0.32768^2 = 0.10737$.`, why:`Splitting into $0.8^5$ then squaring keeps the arithmetic manageable.`},
        {do:`So $0.8^{10} \\approx 0.1074$.`, why:`Rounded to 4 decimals.`},
        {do:`The factor shrank to about $11\\%$: a mild vanishing.`, why:`Below 1 each step, so the product heads toward 0 as depth grows.`}
      ],
      answer:`$0.8^{10} \\approx 0.1074$ (vanishing)` },

    { q:`<p>A per-step slope of $1.5$ over $12$ layers gives gradient factor $1.5^{12}$. Compute it (round to 1 decimal) and classify the problem.</p>`,
      steps:[
        {do:`$1.5^2 = 2.25$, $1.5^4 = 2.25^2 = 5.0625$, $1.5^8 = 5.0625^2 = 25.629$.`, why:`Build up powers by repeated squaring.`},
        {do:`$1.5^{12} = 1.5^8 \\times 1.5^4 = 25.629 \\times 5.0625 = 129.7$.`, why:`Combine $1.5^8$ and $1.5^4$ to reach the 12th power.`},
        {do:`Factor $\\approx 129.7$: the gradient blew up.`, why:`Above 1 each step, so the product explodes — an exploding gradient.`}
      ],
      answer:`$1.5^{12} \\approx 129.7$ (exploding)` },

    { q:`<p>Gradient clipping: if $\\lVert g\\rVert > \\tau$ then $g \\leftarrow \\tau \\cdot g / \\lVert g\\rVert$. A gradient is $g = [6, 8]$ with threshold $\\tau = 5$. Compute the clipped gradient (round to 1 decimal).</p>`,
      steps:[
        {do:`Norm: $\\lVert g\\rVert = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$.`, why:`Measure the gradient's size before deciding to clip.`},
        {do:`Since $10 > 5$, scale factor $= \\tau / \\lVert g\\rVert = 5/10 = 0.5$.`, why:`The norm exceeds the threshold, so shrink it back to $\\tau$.`},
        {do:`Clipped: $g \\leftarrow [6, 8] \\times 0.5 = [3, 4]$, with norm $\\sqrt{9+16} = 5$.`, why:`Same direction, but now its length equals the threshold.`}
      ],
      answer:`clipped $g = [3, 4]$ (norm $= 5$)` },

    { q:`<p>A gradient $g = [9, 12]$ has threshold $\\tau = 5$. After clipping with $g \\leftarrow \\tau\\, g/\\lVert g\\rVert$, give the new vector (round to 1 decimal).</p>`,
      steps:[
        {do:`Norm: $\\lVert g\\rVert = \\sqrt{81 + 144} = \\sqrt{225} = 15$.`, why:`Compute the size first.`},
        {do:`Scale factor $= 5/15 = 1/3 \\approx 0.3333$.`, why:`Bring the norm down from 15 to the threshold 5.`},
        {do:`Clipped: $[9, 12] \\times 1/3 = [3, 4]$, norm $= 5$.`, why:`Direction preserved, length capped at 5.`}
      ],
      answer:`clipped $g = [3, 4]$` },

    { q:`<p>You need the per-step slope $r$ so that after $20$ steps the gradient keeps $1\\%$ of its size, i.e. $r^{20} = 0.01$. Solve for $r$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Take logs: $20 \\ln r = \\ln 0.01 = -4.6052$.`, why:`Logarithms turn the power into a product we can solve.`},
        {do:`So $\\ln r = -4.6052 / 20 = -0.23026$.`, why:`Divide by the number of steps.`},
        {do:`Exponentiate: $r = e^{-0.23026} = 0.794$.`, why:`A per-step slope near 0.79 loses 99% of the gradient over 20 steps.`}
      ],
      answer:`$r = e^{(\\ln 0.01)/20} \\approx 0.794$` },

    { q:`<p>A per-step slope of $0.9$ acts over $30$ steps. Compute $0.9^{30}$ (use $\\ln 0.9 = -0.10536$, round answer to 4 decimals) and state the consequence.</p>`,
      steps:[
        {do:`$\\ln(0.9^{30}) = 30 \\times (-0.10536) = -3.1608$.`, why:`Bring the exponent down using the log.`},
        {do:`$0.9^{30} = e^{-3.1608} = 0.0424$.`, why:`Exponentiate back to get the factor.`},
        {do:`The gradient keeps only $\\approx 4.2\\%$ of its size, so step-1 weights barely update.`, why:`Even a gentle slope of 0.9 vanishes badly over 30 steps.`}
      ],
      answer:`$0.9^{30} \\approx 0.0424$ — long-range learning fails` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-lstm-gru", [
    { q:`<p>An LSTM updates its cell with $c^{<t>} = f \\cdot c^{<t-1>} + i \\cdot \\tilde{c}$, where $f$ is the forget gate, $i$ the input gate, $\\tilde{c}$ the candidate. Given $f = 0.8$, $c^{<t-1>} = 2$, $i = 0.6$, $\\tilde{c} = -1$, compute $c^{<t>}$.</p>`,
      steps:[
        {do:`Keep term: $f \\cdot c^{<t-1>} = 0.8 \\times 2 = 1.6$.`, why:`The forget gate scales how much old memory survives.`},
        {do:`Add term: $i \\cdot \\tilde{c} = 0.6 \\times (-1) = -0.6$.`, why:`The input gate scales how much new candidate info enters.`},
        {do:`Sum: $c^{<t>} = 1.6 + (-0.6) = 1.0$.`, why:`New cell state blends kept memory and new info.`}
      ],
      answer:`$c^{<t>} = 1.0$` },

    { q:`<p>An LSTM forget gate is $f = \\sigma(z_f)$ with pre-activation $z_f = 1.5$. Compute $\\sigma(1.5)$ (round to 3 decimals) and say what it does to old memory.</p>`,
      steps:[
        {do:`$\\sigma(1.5) = 1 / (1 + e^{-1.5})$. $e^{-1.5} = 0.2231$.`, why:`A gate is always a sigmoid, giving a value in $(0,1)$.`},
        {do:`$\\sigma(1.5) = 1 / 1.2231 = 0.8176 \\approx 0.818$.`, why:`Compute the sigmoid.`},
        {do:`$f \\approx 0.818$ keeps about 82% of the old memory.`, why:`A forget gate near 1 preserves the past.`}
      ],
      answer:`$f = \\sigma(1.5) \\approx 0.818$ (keeps ~82% of old memory)` },

    { q:`<p>The LSTM hidden output is $a^{<t>} = o \\cdot \\tanh(c^{<t>})$, where $o$ is the output gate. Given $o = 0.5$ and $c^{<t>} = 1.0$, compute $a^{<t>}$ (round to 3 decimals).</p>`,
      steps:[
        {do:`Squash the cell: $\\tanh(1.0) = 0.7616$.`, why:`The cell state is passed through $\\tanh$ before the output gate.`},
        {do:`Apply output gate: $a^{<t>} = 0.5 \\times 0.7616 = 0.3808$.`, why:`The output gate decides how much of the cell is revealed.`},
        {do:`Round: $a^{<t>} \\approx 0.381$.`, why:`Half the squashed cell value passes out.`}
      ],
      answer:`$a^{<t>} \\approx 0.381$` },

    { q:`<p>Run a full LSTM cell update. Gates: $f = 0.9$, $i = 0.5$, $o = 0.7$. Candidate $\\tilde{c} = 0.8$, old cell $c^{<t-1>} = 1.2$. Compute the new cell $c^{<t>}$ then the output $a^{<t>} = o\\tanh(c^{<t>})$ (round to 3 decimals).</p>`,
      steps:[
        {do:`New cell: $c^{<t>} = 0.9(1.2) + 0.5(0.8) = 1.08 + 0.4 = 1.48$.`, why:`Forget gate keeps old memory; input gate adds new candidate.`},
        {do:`Squash: $\\tanh(1.48) = 0.9017$.`, why:`Pass the cell through $\\tanh$ for the output.`},
        {do:`Output: $a^{<t>} = 0.7 \\times 0.9017 = 0.6312 \\approx 0.631$.`, why:`The output gate reveals 70% of the squashed cell.`}
      ],
      answer:`$c^{<t>} = 1.48,\\; a^{<t>} \\approx 0.631$` },

    { q:`<p>A GRU updates with $a^{<t>} = (1 - z)\\,a^{<t-1>} + z\\,\\tilde{a}$, where $z$ is the update gate. Over two steps: $a^{<0>} = 0$, $z = 0.5$, candidates $\\tilde{a}^{<1>} = 1$, $\\tilde{a}^{<2>} = 1$. Compute $a^{<1>}$ and $a^{<2>}$.</p>`,
      steps:[
        {do:`Step 1: $a^{<1>} = (1 - 0.5)(0) + 0.5(1) = 0.5$.`, why:`Half old (which is 0) plus half new candidate.`},
        {do:`Step 2: $a^{<2>} = 0.5(0.5) + 0.5(1) = 0.25 + 0.5 = 0.75$.`, why:`Now the carried memory 0.5 contributes too.`},
        {do:`The state climbs $0 \\to 0.5 \\to 0.75$ toward the candidate 1.`, why:`A GRU's update gate blends old and new each step.`}
      ],
      answer:`$a^{<1>} = 0.5,\\; a^{<2>} = 0.75$` },

    { q:`<p>Count the parameters of one LSTM cell with input dim $n_x = 3$ and hidden dim $n_a = 4$. There are 4 gate/candidate weight sets, each a matrix on $[a^{<t-1>}, x^{<t>}]$ plus a bias. Compute the total.</p>`,
      steps:[
        {do:`Concatenated input width $= n_a + n_x = 4 + 3 = 7$.`, why:`Each gate reads both the previous hidden state and the current input.`},
        {do:`One gate: $W$ is $n_a \\times (n_a + n_x) = 4 \\times 7 = 28$, plus bias $n_a = 4$, so $32$.`, why:`A weight per (hidden unit, concatenated input) plus one bias per unit.`},
        {do:`Four sets (forget, input, output, candidate): $4 \\times 32 = 128$.`, why:`LSTM has 3 gates plus the candidate, each with its own weights.`}
      ],
      answer:`$4 \\times (4 \\times 7 + 4) = 128$ parameters` },

    { q:`<p>An LSTM forgets steadily: the forget gate stays at $f = 0.95$ each step. Over $40$ steps, a memory stored at step 0 is scaled by $0.95^{40}$. Compute it (use $\\ln 0.95 = -0.05129$, round to 3 decimals) and contrast with a plain RNN.</p>`,
      steps:[
        {do:`$\\ln(0.95^{40}) = 40 \\times (-0.05129) = -2.0516$.`, why:`Bring down the exponent with the log.`},
        {do:`$0.95^{40} = e^{-2.0516} = 0.1285 \\approx 0.129$.`, why:`Exponentiate back to the surviving fraction.`},
        {do:`About $13\\%$ of the memory survives 40 steps — far better than a plain RNN whose slopes vanish much faster.`, why:`A forget gate near 1 lets memory pass nearly intact, the LSTM's key advantage.`}
      ],
      answer:`$0.95^{40} \\approx 0.129$ (LSTM preserves long-range memory)` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-word-embeddings", [
    { q:`<p>An embedding layer has vocabulary $V = 10000$ and embedding dimension $d = 300$. The embedding matrix $E$ has shape $d \\times V$. How many parameters does it hold?</p>`,
      steps:[
        {do:`Parameters $= d \\times V = 300 \\times 10000$.`, why:`Each of the $V$ words owns one $d$-number column.`},
        {do:`$300 \\times 10000 = 3{,}000{,}000$.`, why:`Multiply dimension by vocabulary.`},
        {do:`So $E$ holds 3 million learnable numbers.`, why:`This is usually the largest single layer in a small language model.`}
      ],
      answer:`$300 \\times 10000 = 3{,}000{,}000$ parameters` },

    { q:`<p>One-hot vs embedding storage. A one-hot vector has length $V = 50000$; an embedding has length $d = 128$. How many times shorter is the embedding, and how many of the one-hot's entries are zero?</p>`,
      steps:[
        {do:`Ratio: $V / d = 50000 / 128 = 390.6$.`, why:`Compare the two vector lengths.`},
        {do:`The embedding is about $391\\times$ shorter (round to nearest whole).`, why:`Embeddings are dense and compact.`},
        {do:`One-hot zeros: $V - 1 = 49999$ entries are 0 (exactly one 1).`, why:`A one-hot marks a single word with a lone 1.`}
      ],
      answer:`$\\approx 391\\times$ shorter; $49999$ zeros in the one-hot` },

    { q:`<p>The embedding lookup is $e_w = E\\,o_w$. Vocabulary of 4 words; the word "dog" is at position 3, so $o_{\\text{dog}} = [0, 0, 1, 0]$. The matrix $E$ has columns cat $=[0.9, 0.8]$, the $=[0.0, 0.1]$, dog $=[0.85, 0.82]$, car $=[0.1, 0.95]$. Find $e_{\\text{dog}}$.</p>`,
      steps:[
        {do:`The one-hot has its 1 in slot 3.`, why:`Position 3 corresponds to "dog".`},
        {do:`Multiplying $E\\,o_{\\text{dog}}$ selects column 3 of $E$.`, why:`A one-hot times a matrix picks out the matching column.`},
        {do:`Column 3 is $[0.85, 0.82]$, so $e_{\\text{dog}} = [0.85, 0.82]$.`, why:`That is dog's dense embedding.`}
      ],
      answer:`$e_{\\text{dog}} = [0.85, 0.82]$` },

    { q:`<p>An embedding lookup multiplies $E$ (shape $d \\times V$, with $d = 4$, $V = 6$) by a one-hot of length 6. How many multiply-adds does the naive matrix multiply do, and why is a real lookup table faster?</p>`,
      steps:[
        {do:`Naive multiply: $d \\times V = 4 \\times 6 = 24$ multiply-adds.`, why:`Each output entry sums $V$ products; there are $d$ outputs.`},
        {do:`But the one-hot has only a single 1; all other products are $\\times 0$.`, why:`$V - 1 = 5$ of the 6 columns contribute nothing.`},
        {do:`A real lookup just indexes the one nonzero column: $d = 4$ reads, no multiplies.`, why:`Frameworks skip the zeros and directly fetch the word's column.`}
      ],
      answer:`naive $= 24$ multiply-adds; a lookup just reads the $d=4$-entry column directly` },

    { q:`<p>Total memory of an embedding table: $V = 30000$ words, $d = 200$ dimensions, each number stored as a 4-byte float. How many megabytes does the table use? (Use $1$ MB $= 10^6$ bytes.)</p>`,
      steps:[
        {do:`Number of values: $V \\times d = 30000 \\times 200 = 6{,}000{,}000$.`, why:`One float per (word, dimension) pair.`},
        {do:`Bytes: $6{,}000{,}000 \\times 4 = 24{,}000{,}000$.`, why:`Each float takes 4 bytes.`},
        {do:`Megabytes: $24{,}000{,}000 / 10^6 = 24$ MB.`, why:`Divide bytes by $10^6$.`}
      ],
      answer:`$24$ MB` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-word2vec", [
    { q:`<p>Skip-gram softmax: $P(t \\mid c) = \\frac{\\exp(\\theta_t^\\top e_c)}{\\sum_j \\exp(\\theta_j^\\top e_c)}$. Three words have scores $\\theta_j^\\top e_c = [2, 0, -1]$. Compute $P$ for the first word (round to 3 decimals).</p>`,
      steps:[
        {do:`Exponentiate: $\\exp(2) = 7.389$, $\\exp(0) = 1$, $\\exp(-1) = 0.368$.`, why:`Softmax turns each score into a positive number.`},
        {do:`Sum: $Z = 7.389 + 1 + 0.368 = 8.757$.`, why:`The denominator normalizes the scores.`},
        {do:`First word: $P = 7.389 / 8.757 = 0.8438 \\approx 0.844$.`, why:`The highest-scoring word gets the largest probability.`}
      ],
      answer:`$P(\\text{word 1}) \\approx 0.844$` },

    { q:`<p>Same softmax with scores $[2, 0, -1]$. Compute the probabilities of all three words and confirm they sum to 1 (round each to 3 decimals).</p>`,
      steps:[
        {do:`Exponentials $7.389, 1, 0.368$; sum $Z = 8.757$.`, why:`Reuse the exponentiated scores and their total.`},
        {do:`Divide each: $7.389/8.757 = 0.844$, $1/8.757 = 0.114$, $0.368/8.757 = 0.042$.`, why:`Each probability is its share of the total.`},
        {do:`Check: $0.844 + 0.114 + 0.042 = 1.000$.`, why:`Softmax always produces probabilities that sum to 1.`}
      ],
      answer:`$P \\approx [0.844, 0.114, 0.042]$, sum $= 1.000$` },

    { q:`<p>The score is a dot product $\\theta_t^\\top e_c$. With $e_c = [1, 2]$ and three output vectors $\\theta_1 = [2, 1]$, $\\theta_2 = [0, 1]$, $\\theta_3 = [-1, 0]$, compute the three scores, then the softmax probability of word 1 (round to 3 decimals).</p>`,
      steps:[
        {do:`Scores: $\\theta_1^\\top e_c = 2(1)+1(2)=4$; $\\theta_2^\\top e_c = 0+2=2$; $\\theta_3^\\top e_c = -1+0=-1$.`, why:`Each score is a dot product of the center embedding with an output vector.`},
        {do:`Exponentiate: $\\exp(4) = 54.60$, $\\exp(2) = 7.389$, $\\exp(-1) = 0.368$; sum $Z = 62.36$.`, why:`Softmax normalizes over all words.`},
        {do:`$P(\\text{word 1}) = 54.60 / 62.36 = 0.8755 \\approx 0.876$.`, why:`Word 1's vector agrees most with $e_c$, so it gets the most mass.`}
      ],
      answer:`scores $[4, 2, -1]$; $P(\\text{word 1}) \\approx 0.876$` },

    { q:`<p>The famous analogy: king $-$ man $+$ woman $\\approx$ queen. Using 2-D vectors king $=[5, 7]$, man $=[4, 2]$, woman $=[1, 3]$, compute the result vector, then say which candidate it is closest to: queen $=[2, 8]$ or prince $=[6, 6]$ (use Euclidean distance).</p>`,
      steps:[
        {do:`Result $= [5,7] - [4,2] + [1,3] = [5-4+1,\\; 7-2+3] = [2, 8]$.`, why:`Do the vector arithmetic component by component.`},
        {do:`Distance to queen $[2,8]$: $\\sqrt{(2-2)^2 + (8-8)^2} = 0$.`, why:`An exact match here, distance zero.`},
        {do:`Distance to prince $[6,6]$: $\\sqrt{16 + 4} = \\sqrt{20} = 4.47$.`, why:`Much farther than queen.`}
      ],
      answer:`result $= [2, 8]$, closest to queen (distance 0 vs 4.47)` },

    { q:`<p>Negative sampling replaces the full softmax with $k$ negatives. With vocabulary $V = 100000$ and $k = 5$ negative samples per positive, how many output-vector dot products per training example, and how many times fewer than the full softmax?</p>`,
      steps:[
        {do:`Negative sampling: $1$ positive $+ k$ negatives $= 1 + 5 = 6$ dot products.`, why:`Only the true word and a few random words are scored.`},
        {do:`Full softmax would score all $V = 100000$ words.`, why:`The denominator sums over the entire vocabulary.`},
        {do:`Ratio: $100000 / 6 = 16666.7 \\approx 16667\\times$ fewer.`, why:`This is why negative sampling makes word2vec practical at scale.`}
      ],
      answer:`$6$ dot products vs $100000$ — about $16667\\times$ fewer` },

    { q:`<p>Compute a numerically stable softmax. Scores are $[12, 10, 9]$. Subtract the max before exponentiating, then give the probability of the first word (round to 3 decimals).</p>`,
      steps:[
        {do:`Subtract max 12: shifted scores $[0, -2, -3]$.`, why:`Subtracting the max prevents huge exponentials and overflow; it does not change the result.`},
        {do:`Exponentiate: $\\exp(0) = 1$, $\\exp(-2) = 0.1353$, $\\exp(-3) = 0.0498$; sum $Z = 1.1851$.`, why:`Smaller exponents are safe to compute.`},
        {do:`$P(\\text{word 1}) = 1 / 1.1851 = 0.8438 \\approx 0.844$.`, why:`The same probability as the naive softmax, but computed safely.`}
      ],
      answer:`$P(\\text{word 1}) \\approx 0.844$` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-cosine-similarity", [
    { q:`<p>Cosine similarity is $\\cos\\theta = \\frac{w_1 \\cdot w_2}{\\lVert w_1\\rVert\\,\\lVert w_2\\rVert}$. For $w_1 = [1, 2, 2]$ and $w_2 = [2, 0, 1]$ (3-D), compute it (round to 3 decimals).</p>`,
      steps:[
        {do:`Dot: $1(2) + 2(0) + 2(1) = 2 + 0 + 2 = 4$.`, why:`Multiply matching entries and add.`},
        {do:`Norms: $\\lVert w_1\\rVert = \\sqrt{1+4+4} = 3$; $\\lVert w_2\\rVert = \\sqrt{4+0+1} = \\sqrt{5} = 2.236$.`, why:`Length is the square root of the sum of squares.`},
        {do:`Cosine: $4 / (3 \\times 2.236) = 4 / 6.708 = 0.5963 \\approx 0.596$.`, why:`Divide the dot product by the product of lengths.`}
      ],
      answer:`$\\cos\\theta \\approx 0.596$` },

    { q:`<p>For $w_1 = [3, 1, 2, 1]$ and $w_2 = [1, 2, 1, 0]$ (4-D), compute the cosine similarity (round to 3 decimals).</p>`,
      steps:[
        {do:`Dot: $3(1)+1(2)+2(1)+1(0) = 3+2+2+0 = 7$.`, why:`Sum the elementwise products across all 4 dimensions.`},
        {do:`Norms: $\\lVert w_1\\rVert = \\sqrt{9+1+4+1} = \\sqrt{15} = 3.873$; $\\lVert w_2\\rVert = \\sqrt{1+4+1+0} = \\sqrt{6} = 2.449$.`, why:`Square, sum, square-root for each vector.`},
        {do:`Cosine: $7 / (3.873 \\times 2.449) = 7 / 9.487 = 0.7379 \\approx 0.738$.`, why:`Divide by the product of the two lengths.`}
      ],
      answer:`$\\cos\\theta \\approx 0.738$` },

    { q:`<p>Compute the angle (in degrees) between $w_1 = [1, 0, 1]$ and $w_2 = [0, 1, 1]$. First find the cosine, then take $\\arccos$ (round the angle to 1 decimal).</p>`,
      steps:[
        {do:`Dot: $1(0)+0(1)+1(1) = 1$. Norms: $\\sqrt{2}$ and $\\sqrt{2}$.`, why:`Both vectors have length $\\sqrt 2$.`},
        {do:`Cosine: $1 / (\\sqrt2 \\cdot \\sqrt2) = 1/2 = 0.5$.`, why:`Product of norms is $\\sqrt2 \\times \\sqrt2 = 2$.`},
        {do:`Angle: $\\arccos(0.5) = 60.0^\\circ$.`, why:`$\\cos 60^\\circ = 0.5$.`}
      ],
      answer:`$\\cos\\theta = 0.5$, angle $= 60.0^\\circ$` },

    { q:`<p>Two embeddings point in opposite directions: $w_1 = [2, -1, 3]$ and $w_2 = [-4, 2, -6]$. Compute their cosine similarity and explain the value.</p>`,
      steps:[
        {do:`Dot: $2(-4) + (-1)(2) + 3(-6) = -8 - 2 - 18 = -28$.`, why:`A strongly negative dot product hints the vectors oppose.`},
        {do:`Norms: $\\lVert w_1\\rVert = \\sqrt{4+1+9} = \\sqrt{14}$; $\\lVert w_2\\rVert = \\sqrt{16+4+36} = \\sqrt{56} = 2\\sqrt{14}$.`, why:`$w_2 = -2\\,w_1$, so its norm is twice $w_1$'s.`},
        {do:`Cosine: $-28 / (\\sqrt{14}\\cdot 2\\sqrt{14}) = -28 / (2 \\times 14) = -28/28 = -1$.`, why:`Exactly $-1$ because $w_2$ is a negative scalar multiple of $w_1$.`}
      ],
      answer:`$\\cos\\theta = -1$ (exactly opposite directions)` },

    { q:`<p>Cosine of a vector with a scaled copy: $w_2 = 5\\,w_1$ for any nonzero $w_1$. Show $\\cos\\theta = 1$ without picking numbers, using $w_1 \\cdot (5w_1) = 5\\lVert w_1\\rVert^2$ and $\\lVert 5 w_1\\rVert = 5\\lVert w_1\\rVert$.</p>`,
      steps:[
        {do:`Numerator: $w_1 \\cdot (5 w_1) = 5\\,(w_1 \\cdot w_1) = 5\\lVert w_1\\rVert^2$.`, why:`Scalars pull out of the dot product; $w_1\\cdot w_1 = \\lVert w_1\\rVert^2$.`},
        {do:`Denominator: $\\lVert w_1\\rVert \\cdot \\lVert 5 w_1\\rVert = \\lVert w_1\\rVert \\cdot 5\\lVert w_1\\rVert = 5\\lVert w_1\\rVert^2$.`, why:`A positive scalar multiplies the length directly.`},
        {do:`Ratio: $\\frac{5\\lVert w_1\\rVert^2}{5\\lVert w_1\\rVert^2} = 1$.`, why:`Cosine ignores length, so scaling never changes it.`}
      ],
      answer:`$\\cos\\theta = 1$ — scaling a vector leaves its direction (and cosine) unchanged` },

    { q:`<p>Normalized vectors: if $\\lVert u\\rVert = \\lVert v\\rVert = 1$, cosine similarity equals the dot product. Given unit vectors $u = [0.6, 0.8]$ and $v = [0.8, -0.6]$, compute their cosine similarity (round to 3 decimals).</p>`,
      steps:[
        {do:`Confirm units: $\\lVert u\\rVert = \\sqrt{0.36+0.64} = 1$; $\\lVert v\\rVert = \\sqrt{0.64+0.36} = 1$.`, why:`Both have length 1, so the denominator is $1 \\times 1 = 1$.`},
        {do:`Dot: $0.6(0.8) + 0.8(-0.6) = 0.48 - 0.48 = 0$.`, why:`For unit vectors the cosine is just the dot product.`},
        {do:`Cosine $= 0/1 = 0.000$: they are perpendicular.`, why:`A zero cosine means a $90^\\circ$ angle.`}
      ],
      answer:`$\\cos\\theta = 0.000$ (perpendicular unit vectors)` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-attention", [
    { q:`<p>Attention weights are $\\alpha^{<t,t'>} = \\frac{\\exp(e^{<t,t'>})}{\\sum_{t'}\\exp(e^{<t,t'>})}$. With raw scores $e = [3, 1, 0]$, compute the three weights (round each to 3 decimals) and confirm they sum to 1.</p>`,
      steps:[
        {do:`Exponentiate: $\\exp(3) = 20.086$, $\\exp(1) = 2.718$, $\\exp(0) = 1$.`, why:`Softmax exponentiates each relevance score.`},
        {do:`Sum: $Z = 20.086 + 2.718 + 1 = 23.804$.`, why:`The denominator normalizes the scores.`},
        {do:`Weights: $20.086/23.804 = 0.844$, $2.718/23.804 = 0.114$, $1/23.804 = 0.042$. Sum $= 1.000$.`, why:`Attention weights always add to 1.`}
      ],
      answer:`$\\alpha \\approx [0.844, 0.114, 0.042]$, sum $= 1.000$` },

    { q:`<p>Using the weights $\\alpha = [0.844, 0.114, 0.042]$ from the scores $[3,1,0]$, compute the context $c = \\sum_{t'} \\alpha^{<t,t'>} a^{<t'>}$ for value vectors $a = [10, 20, 30]$ (scalars). Round to 2 decimals.</p>`,
      steps:[
        {do:`Weighted terms: $0.844(10) = 8.44$, $0.114(20) = 2.28$, $0.042(30) = 1.26$.`, why:`Each value is weighted by its attention share.`},
        {do:`Sum: $c = 8.44 + 2.28 + 1.26 = 11.98$.`, why:`The context is the weighted average of the values.`},
        {do:`So $c \\approx 11.98$, pulled toward the first value (highest weight).`, why:`The model focuses most on the first input.`}
      ],
      answer:`$c \\approx 11.98$` },

    { q:`<p>Scaled dot-product attention divides scores by $\\sqrt{d_k}$ before softmax. A query-key dot product is $e = 8$ with key dimension $d_k = 16$. What scaled score goes into the softmax?</p>`,
      steps:[
        {do:`Scaling factor: $\\sqrt{d_k} = \\sqrt{16} = 4$.`, why:`Large dot products grow with dimension; dividing by $\\sqrt{d_k}$ keeps them stable.`},
        {do:`Scaled score: $8 / 4 = 2$.`, why:`Divide the raw dot product by $\\sqrt{d_k}$.`},
        {do:`So the softmax sees $2$, not $8$.`, why:`Scaling prevents the softmax from saturating to near one-hot.`}
      ],
      answer:`scaled score $= 8/\\sqrt{16} = 2$` },

    { q:`<p>Scaled dot-product attention. Two keys give raw dot products $e = [12, 4]$ with $d_k = 4$. Scale by $\\sqrt{d_k}$, then softmax to get the two attention weights (round to 3 decimals).</p>`,
      steps:[
        {do:`Scale: $\\sqrt 4 = 2$, so scaled scores $= [12/2, 4/2] = [6, 2]$.`, why:`Divide both dot products by $\\sqrt{d_k}$.`},
        {do:`Exponentiate: $\\exp(6) = 403.43$, $\\exp(2) = 7.389$; sum $Z = 410.82$.`, why:`Softmax over the two scaled scores.`},
        {do:`Weights: $403.43/410.82 = 0.982$, $7.389/410.82 = 0.018$.`, why:`The first key dominates after scaling.`}
      ],
      answer:`$\\alpha \\approx [0.982, 0.018]$` },

    { q:`<p>Full scaled attention. Query and keys are 2-D. $q = [1, 1]$; keys $k_1 = [2, 0]$, $k_2 = [0, 2]$; $d_k = 2$. Values are scalars $v_1 = 4$, $v_2 = 8$. Compute the context (round to 2 decimals).</p>`,
      steps:[
        {do:`Dot products: $q\\cdot k_1 = 1(2)+1(0) = 2$; $q\\cdot k_2 = 1(0)+1(2) = 2$.`, why:`Score each key against the query.`},
        {do:`Scale by $\\sqrt 2 = 1.414$: both become $2/1.414 = 1.414$. Equal scores give weights $[0.5, 0.5]$.`, why:`Equal scaled scores softmax to equal weights.`},
        {do:`Context: $0.5(4) + 0.5(8) = 2 + 4 = 6.00$.`, why:`Average the two values with equal attention.`}
      ],
      answer:`$\\alpha = [0.5, 0.5]$, context $= 6.00$` },

    { q:`<p>Self-attention cost: a sequence of length $n = 512$ computes a score for every pair of positions (an $n \\times n$ matrix). How many pairwise scores are there, and how does this scale with $n$?</p>`,
      steps:[
        {do:`Pairs: $n^2 = 512^2 = 262{,}144$ scores.`, why:`Every query attends to every key, filling an $n\\times n$ grid.`},
        {do:`Doubling $n$ to 1024 gives $1024^2 = 1{,}048{,}576$, four times as many.`, why:`Cost grows as $n^2$, the well-known bottleneck of attention.`},
        {do:`So self-attention is $O(n^2)$ in sequence length.`, why:`This is why long-context models need efficient-attention tricks.`}
      ],
      answer:`$512^2 = 262{,}144$ scores; cost is $O(n^2)$` },

    { q:`<p>Multi-head attention with $h = 8$ heads and model dimension $d_{\\text{model}} = 512$ splits the dimension across heads. What is each head's dimension $d_k$, and what is $\\sqrt{d_k}$ used in scaling (round to 2 decimals)?</p>`,
      steps:[
        {do:`Per-head dimension: $d_k = d_{\\text{model}} / h = 512 / 8 = 64$.`, why:`The model dimension is divided evenly among the heads.`},
        {do:`Scaling factor: $\\sqrt{d_k} = \\sqrt{64} = 8.00$.`, why:`Each head's scaled dot-product uses $\\sqrt{d_k}$.`},
        {do:`So each of the 8 heads works in 64 dimensions and scales scores by 8.`, why:`Smaller per-head dimension lets heads specialize.`}
      ],
      answer:`$d_k = 64$, $\\sqrt{d_k} = 8.00$` },
  ]);

  /* ---------------------------------------------------------------- */
  add("dl-data-augmentation", [
    { q:`<p>Data augmentation combines independent transforms multiplicatively. With 2 flip variants, 6 rotation variants, and 4 crop variants, how many augmented images come from one original?</p>`,
      steps:[
        {do:`Multiply the independent choices: $2 \\times 6 \\times 4$.`, why:`Each combination of (flip, rotation, crop) is a distinct image.`},
        {do:`$2 \\times 6 = 12$, then $12 \\times 4 = 48$.`, why:`Count all combinations.`},
        {do:`So 48 variants from one image.`, why:`Multiplicative growth makes augmentation powerful.`}
      ],
      answer:`$2 \\times 6 \\times 4 = 48$ variants` },

    { q:`<p>A pipeline applies: horizontal flip (2 options incl. none), rotation by one of $\\{0, 90, 180, 270\\}$ degrees (4 options), and brightness one of 3 levels. Starting from $1000$ original images, how many total augmented images are possible?</p>`,
      steps:[
        {do:`Variants per image: $2 \\times 4 \\times 3 = 24$.`, why:`Multiply the independent transform option counts.`},
        {do:`Times the dataset: $1000 \\times 24 = 24{,}000$.`, why:`Each original spawns 24 variants.`},
        {do:`So up to $24{,}000$ augmented images.`, why:`Augmentation expands a small dataset cheaply.`}
      ],
      answer:`$1000 \\times (2\\times4\\times3) = 24{,}000$ images` },

    { q:`<p>Random crops: from a $256 \\times 256$ image you take $224 \\times 224$ crops by sliding the window. How many distinct top-left positions (and thus crops) are there?</p>`,
      steps:[
        {do:`Horizontal positions: $256 - 224 + 1 = 33$.`, why:`The window's left edge can start at 0 up to $256-224 = 32$, giving 33 spots.`},
        {do:`Vertical positions: also $33$ by the same count.`, why:`The image is square, so rows match columns.`},
        {do:`Total crops: $33 \\times 33 = 1089$.`, why:`Each (row, column) start gives one distinct crop.`}
      ],
      answer:`$33 \\times 33 = 1089$ crops` },

    { q:`<p>Combining crops with flips: from the $1089$ crop positions above (each $224\\times224$), you also apply one of 4 rotations and an optional horizontal flip (2 options). How many augmented images per original?</p>`,
      steps:[
        {do:`Start with crop positions: $1089$.`, why:`From the previous count of sliding-window crops.`},
        {do:`Multiply by rotations and flip: $1089 \\times 4 \\times 2$.`, why:`Each transform is independent, so multiply the option counts.`},
        {do:`$1089 \\times 8 = 8712$.`, why:`$4 \\times 2 = 8$, then times the crops.`}
      ],
      answer:`$1089 \\times 4 \\times 2 = 8712$ variants` },

    { q:`<p>Test-time augmentation (TTA) averages predictions over several augmented versions of each test image. If you use 10-crop TTA (4 corners + center, each also flipped), how many predictions per image are averaged?</p>`,
      steps:[
        {do:`Crops: 4 corners + 1 center $= 5$ crops.`, why:`The standard 10-crop scheme starts from 5 crop locations.`},
        {do:`Each crop is also flipped: $5 \\times 2 = 10$.`, why:`Adding the horizontal flip doubles the count.`},
        {do:`So 10 predictions are averaged per image.`, why:`That is exactly the "10-crop" in the name.`}
      ],
      answer:`$5 \\times 2 = 10$ predictions averaged` },

    { q:`<p>You want at least $50{,}000$ augmented images from $400$ originals using flips (2), rotations (R), and crops (5). What is the smallest whole number of rotation variants $R$ that reaches the target?</p>`,
      steps:[
        {do:`Per-original variants $= 2 \\times R \\times 5 = 10R$; total $= 400 \\times 10R = 4000R$.`, why:`Multiply transforms, then the dataset size.`},
        {do:`Require $4000R \\ge 50000$, so $R \\ge 50000/4000 = 12.5$.`, why:`Solve the inequality for $R$.`},
        {do:`Round up to the next whole number: $R = 13$.`, why:`You cannot use a fractional rotation count, and 12 would fall short.`}
      ],
      answer:`$R = 13$ (gives $4000\\times13 = 52{,}000 \\ge 50{,}000$)` },
  ]);

})();
