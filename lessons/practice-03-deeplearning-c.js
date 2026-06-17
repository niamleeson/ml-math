/* =====================================================================
   PRACTICE PROBLEMS — MODULE 3 (Deep Learning), set C.
   Owned ids: dl-gan, dl-rnn, dl-vanishing-gradient, dl-lstm-gru,
   dl-word-embeddings, dl-word2vec, dl-cosine-similarity, dl-attention,
   dl-data-augmentation.
   Each id has EXACTLY 10 problems, easy -> hard.
   ===================================================================== */
(function(){ Object.assign(window.PRACTICE, {

  "dl-gan": [
    { q:`<p>A GAN has two networks. One makes fakes, one judges them. Which network is the "forger"?</p>`,
      steps:[
        {do:`The generator turns random noise into a fake sample.`, why:`Making fakes is exactly what a forger does.`},
        {do:`The discriminator only judges real vs fake; it makes nothing.`, why:`That is the detective role, not the forger.`}
      ],
      answer:`$\\text{the generator}$` },

    { q:`<p>The discriminator labels real data $1$ and fake data $0$. It sees a real photo. What is the ideal label it should output?</p>`,
      steps:[
        {do:`Real data should be scored as real.`, why:`A perfect detective never calls a real photo fake.`},
        {do:`Real maps to the label $1$.`, why:`That is the convention: $1$ = real, $0$ = fake.`}
      ],
      answer:`$1$` },

    { q:`<p>The discriminator outputs $D=0.9$ on a fake image (where $1$ means "I think it is real"). Did the generator fool it this round?</p>`,
      steps:[
        {do:`The image is fake, so the ideal answer was $0$.`, why:`Fakes should be caught and labeled $0$.`},
        {do:`But $D=0.9$ is close to $1$ (real).`, why:`The detective was tricked into thinking it was real.`}
      ],
      answer:`$\\text{yes, the generator fooled it}$` },

    { q:`<p>The discriminator outputs $D=0.2$ on a fake image. Who "wins" this round, the generator or the discriminator?</p>`,
      steps:[
        {do:`The fake's ideal label is $0$.`, why:`Fakes should be scored near $0$.`},
        {do:`$D=0.2$ is close to $0$, so the fake was caught.`, why:`The detective spotted the forgery.`}
      ],
      answer:`$\\text{the discriminator}$` },

    { q:`<p>At the end of GAN training, the fakes look perfectly real. About what value should $D$ give on any image (real or fake)?</p>`,
      steps:[
        {do:`If fakes are indistinguishable, the detective cannot tell them apart.`, why:`Both real and fake look the same to it.`},
        {do:`Its best guess is a coin flip: $0.5$.`, why:`$50\\%$ real, $50\\%$ fake means pure guessing.`}
      ],
      answer:`$D \\approx 0.5$` },

    { q:`<p>The discriminator's accuracy on detecting fakes drops from $90\\%$ to $52\\%$ over training. What does this tell you about the generator?</p>`,
      steps:[
        {do:`Lower catch rate means the detective is being fooled more.`, why:`Falling accuracy = more fakes slip through.`},
        {do:`So the generator's fakes got more realistic.`, why:`Only better fakes could fool a working detective.`}
      ],
      answer:`$\\text{the generator improved}$` },

    { q:`<p>A generator turns a noise vector $z=[0.5, -1]$ into a fake pixel using weights $w=[2, 1]$ and bias $b=0$ (one linear neuron, no activation). What value does it output?</p>`,
      steps:[
        {do:`Dot product: $2\\times0.5 + 1\\times(-1) = 1 - 1 = 0$.`, why:`The generator mixes the noise with its weights.`},
        {do:`Add bias: $0 + 0 = 0$.`, why:`The bias shifts the output; here it adds nothing.`}
      ],
      answer:`$0$` },

    { q:`<p>The discriminator scores a real image with sigmoid output $D=0.8$. The loss for a real image is $-\\log(D)$. Using $\\log(0.8)\\approx -0.223$, find the loss.</p>`,
      steps:[
        {do:`Plug in: $-\\log(0.8) = -(-0.223)$.`, why:`Real images use the $-\\log(D)$ term.`},
        {do:`That equals $0.223$.`, why:`A small loss means the detective was mostly right.`}
      ],
      answer:`$\\approx 0.223$` },

    { q:`<p>Two fakes get discriminator scores $D=0.1$ and $D=0.4$ (where $1$ = looks real). Which fake is the "better" fake?</p>`,
      steps:[
        {do:`A better fake fools the detective toward "real" ($1$).`, why:`The generator wants $D$ high on its fakes.`},
        {do:`$0.4$ is closer to $1$ than $0.1$.`, why:`Higher score means more convincing.`}
      ],
      answer:`$\\text{the } D=0.4 \\text{ fake}$` },

    { q:`<p>The discriminator gives $D=0.3$ on a fake (real$=1$). The generator's loss is $-\\log(D)$ (it wants $D$ near $1$). Using $\\log(0.3)\\approx -1.204$, find the loss, then say if a higher $D$ would lower it.</p>`,
      steps:[
        {do:`Loss: $-\\log(0.3) = -(-1.204) = 1.204$.`, why:`The generator is punished for a low $D$ on its fake.`},
        {do:`If $D$ rose toward $1$, $-\\log(D)$ would fall toward $0$.`, why:`$\\log(1)=0$, so fooling the detective shrinks the loss.`}
      ],
      answer:`$\\approx 1.204$, and a higher $D$ lowers it` }
  ],

  "dl-rnn": [
    { q:`<p>An RNN reads a sequence one step at a time. What carries information from the previous step to the next?</p>`,
      steps:[
        {do:`Each step produces a hidden state $a^{<t>}$.`, why:`The hidden state is the RNN's memory.`},
        {do:`That state is passed into the next step's computation.`, why:`That is how earlier inputs influence later ones.`}
      ],
      answer:`$\\text{the hidden state } a^{<t>}$` },

    { q:`<p>One RNN step: $a^{<t>}=g(W_{aa}a^{<t-1>}+W_{ax}x^{<t>}+b)$. Use $W_{aa}=0$, $W_{ax}=1$, $b=0$, identity $g$, $a^{<0>}=0$, $x^{<1>}=5$. Find $a^{<1>}$.</p>`,
      steps:[
        {do:`Combine: $0\\times0 + 1\\times5 + 0 = 5$.`, why:`Plug each value into the formula.`},
        {do:`Identity $g$ leaves it as $5$.`, why:`The identity function returns its input unchanged.`}
      ],
      answer:`$5$` },

    { q:`<p>RNN step with $W_{aa}=0.5$, $W_{ax}=2$, $b=1$, identity $g$. Given $a^{<0>}=0$, $x^{<1>}=3$, find $a^{<1>}$.</p>`,
      steps:[
        {do:`Old memory term: $0.5\\times0 = 0$.`, why:`$a^{<0>}=0$, so the past contributes nothing.`},
        {do:`Input term plus bias: $2\\times3 + 1 = 7$.`, why:`Add the new-input contribution and the bias.`}
      ],
      answer:`$7$` },

    { q:`<p>RNN with $W_{aa}=1$, $W_{ax}=1$, $b=0$, identity $g$, $a^{<0>}=0$. Inputs $x^{<1>}=2$, $x^{<2>}=3$. Find $a^{<2>}$.</p>`,
      steps:[
        {do:`Step 1: $1\\times0 + 1\\times2 = 2$, so $a^{<1>}=2$.`, why:`First we get the memory after the first input.`},
        {do:`Step 2: $1\\times2 + 1\\times3 = 5$, so $a^{<2>}=5$.`, why:`Step 1's memory $2$ feeds into step 2.`}
      ],
      answer:`$5$` },

    { q:`<p>RNN with $W_{aa}=0$, $W_{ax}=1$, $b=0$, activation $g=\\tanh$. Given $x^{<1>}=0$, find $a^{<1>}$. (Note $\\tanh(0)=0$.)</p>`,
      steps:[
        {do:`Combine: $0\\times0 + 1\\times0 + 0 = 0$.`, why:`All terms are zero before the activation.`},
        {do:`Apply $\\tanh(0)=0$.`, why:`$\\tanh$ of $0$ is exactly $0$.`}
      ],
      answer:`$0$` },

    { q:`<p>RNN with $W_{aa}=0.5$, $W_{ax}=1$, $b=0$, $g=\\tanh$, $a^{<0>}=0$, $x^{<1>}=2$. Find $a^{<1>}$. (Use $\\tanh(2)\\approx 0.96$.)</p>`,
      steps:[
        {do:`Combine: $0.5\\times0 + 1\\times2 + 0 = 2$.`, why:`This is the pre-activation value.`},
        {do:`Apply $\\tanh(2)\\approx 0.96$.`, why:`$\\tanh$ squishes $2$ into the range $(-1,1)$.`}
      ],
      answer:`$\\approx 0.96$` },

    { q:`<p>Continue the previous RNN: $W_{aa}=0.5$, $W_{ax}=1$, $b=0$, $g=\\tanh$. Now $a^{<1>}\\approx 0.96$ and $x^{<2>}=1$. Find $a^{<2>}$. (Use $\\tanh(1.48)\\approx 0.90$.)</p>`,
      steps:[
        {do:`Combine: $0.5\\times0.96 + 1\\times1 = 0.48 + 1 = 1.48$.`, why:`The old memory $0.96$ is carried forward.`},
        {do:`Apply $\\tanh(1.48)\\approx 0.90$.`, why:`Squish the pre-activation into $(-1,1)$.`}
      ],
      answer:`$\\approx 0.90$` },

    { q:`<p>An RNN's hidden state is a vector. With $W_{ax}=\\begin{bmatrix}1&0\\\\0&1\\end{bmatrix}$, $W_{aa}=\\mathbf{0}$, $b=\\mathbf{0}$, identity $g$, and $x^{<1>}=[3,4]$, find $a^{<1>}$.</p>`,
      steps:[
        {do:`$W_{ax}$ is the identity matrix, so $W_{ax}x^{<1>}=[3,4]$.`, why:`The identity matrix leaves a vector unchanged.`},
        {do:`Add zero memory and zero bias: still $[3,4]$.`, why:`Nothing else contributes here.`}
      ],
      answer:`$[3, 4]$` },

    { q:`<p>An RNN reads a $10$-word sentence. How many times is the hidden-state update formula applied (one per word)?</p>`,
      steps:[
        {do:`The RNN processes one word per time step.`, why:`Each word is one input $x^{<t>}$.`},
        {do:`$10$ words means $10$ steps.`, why:`Each step runs the update formula once.`}
      ],
      answer:`$10$` },

    { q:`<p>RNN with $W_{aa}=1$, $W_{ax}=1$, $b=0$, identity $g$, $a^{<0>}=0$, and constant input $x^{<t>}=1$ for every step. After $4$ steps, what is $a^{<4>}$?</p>`,
      steps:[
        {do:`Each step adds the input $1$ to the carried memory.`, why:`With $W_{aa}=1$ the old memory passes through unchanged.`},
        {do:`After $4$ steps: $0+1+1+1+1 = 4$.`, why:`The memory accumulates one per step.`}
      ],
      answer:`$4$` }
  ],

  "dl-vanishing-gradient": [
    { q:`<p>Backprop over a sequence multiplies many slopes. If each slope is below $1$, what happens to the product over many steps?</p>`,
      steps:[
        {do:`Multiplying numbers below $1$ makes them smaller each time.`, why:`E.g. $0.5\\times0.5=0.25$ is smaller than either.`},
        {do:`Over many steps it heads toward $0$.`, why:`This is the vanishing gradient.`}
      ],
      answer:`$\\text{it shrinks toward } 0$` },

    { q:`<p>Multiply the slope $0.5$ across $3$ steps: $0.5\\times0.5\\times0.5$. What is the product?</p>`,
      steps:[
        {do:`$0.5\\times0.5 = 0.25$.`, why:`Multiply the first two factors.`},
        {do:`$0.25\\times0.5 = 0.125$.`, why:`Multiply by the third factor.`}
      ],
      answer:`$0.125$` },

    { q:`<p>Compute $0.5^5$ (slope $0.5$ over $5$ steps).</p>`,
      steps:[
        {do:`$0.5^2=0.25$, $0.5^3=0.125$, $0.5^4=0.0625$.`, why:`Build up the power step by step.`},
        {do:`$0.5^5 = 0.0625\\times0.5 = 0.03125$.`, why:`One more multiply by $0.5$.`}
      ],
      answer:`$0.03125$` },

    { q:`<p>A slope of $1.5$ is multiplied over $4$ steps. Is this a vanishing or exploding gradient? Compute $1.5^4$.</p>`,
      steps:[
        {do:`$1.5>1$, so the product grows each step.`, why:`Multiplying by numbers above $1$ enlarges them.`},
        {do:`$1.5^2=2.25$, $1.5^4=2.25\\times2.25=5.0625$.`, why:`Square, then square again.`}
      ],
      answer:`$\\text{exploding}, \\; 1.5^4\\approx 5.06$` },

    { q:`<p>Gradient clipping rule: if $\\lVert g\\rVert > \\text{threshold}$, scale $g$ down. A gradient has size $40$ and the threshold is $10$. What is its new size?</p>`,
      steps:[
        {do:`Check: $40 > 10$, so clipping applies.`, why:`Only oversized gradients get scaled.`},
        {do:`Scale it down to exactly the threshold $10$.`, why:`Clipping caps the size at the threshold, keeping direction.`}
      ],
      answer:`$10$` },

    { q:`<p>A gradient has size $8$ and the clip threshold is $10$. What happens to it?</p>`,
      steps:[
        {do:`Check: is $8 > 10$? No, $8 < 10$.`, why:`The gradient is already under the cap.`},
        {do:`So it is left unchanged.`, why:`Clipping only shrinks gradients above the threshold.`}
      ],
      answer:`$\\text{unchanged, size } 8$` },

    { q:`<p>Compute $0.9^{10}$ to $3$ decimals (slope $0.9$ over $10$ steps). Use $0.9^{10}\\approx 0.349$.</p>`,
      steps:[
        {do:`Even a mild $0.9 < 1$ shrinks over many steps.`, why:`Each multiply chips a little off.`},
        {do:`$0.9^{10}\\approx 0.349$.`, why:`The product is about a third of the start.`}
      ],
      answer:`$\\approx 0.349$` },

    { q:`<p>Gradient $g=[6, 8]$ has size $\\lVert g\\rVert=\\sqrt{6^2+8^2}$. Find the size, then clip to threshold $5$. Give the scaled gradient.</p>`,
      steps:[
        {do:`Size: $\\sqrt{36+64}=\\sqrt{100}=10$.`, why:`The L2 norm is the vector's length.`},
        {do:`Scale by $\\frac{5}{10}=0.5$: $[6,8]\\times0.5=[3,4]$.`, why:`Multiply by threshold over current size to reach size $5$.`}
      ],
      answer:`$[3, 4]$` },

    { q:`<p>Two paths multiply slopes: path A is $0.8^{20}$, path B is $0.8^{2}$. Which gradient is more vanished (smaller)?</p>`,
      steps:[
        {do:`More factors below $1$ means a smaller product.`, why:`Each extra multiply shrinks it further.`},
        {do:`$20$ factors (path A) shrink far more than $2$ (path B).`, why:`Longer paths vanish more.`}
      ],
      answer:`$\\text{path A } (0.8^{20})$` },

    { q:`<p>A gradient of size $100$ is clipped to threshold $5$. By what factor was it scaled, and what is its new size?</p>`,
      steps:[
        {do:`Scale factor: $\\frac{5}{100}=0.05$.`, why:`We multiply by threshold over current size.`},
        {do:`New size: $100\\times0.05=5$.`, why:`Clipping brings it exactly to the threshold.`}
      ],
      answer:`$\\text{factor } 0.05, \\; \\text{new size } 5$` }
  ],

  "dl-lstm-gru": [
    { q:`<p>A gate value is a number between $0$ and $1$. A forget gate value of $1$ means what for the old memory?</p>`,
      steps:[
        {do:`The forget gate multiplies the old memory.`, why:`It scales how much memory survives.`},
        {do:`Multiplying by $1$ keeps it fully.`, why:`$1\\times\\text{memory}=\\text{memory}$, nothing lost.`}
      ],
      answer:`$\\text{keep all of it}$` },

    { q:`<p>A forget gate value of $0$ is applied to an old memory of $7$. What is the result?</p>`,
      steps:[
        {do:`Multiply: $0\\times7 = 0$.`, why:`The gate scales the memory by its value.`},
        {do:`So the memory is fully erased.`, why:`A gate of $0$ means "forget everything".`}
      ],
      answer:`$0$` },

    { q:`<p>A forget gate value of $0.5$ is applied to an old memory of $8$. How much old memory survives?</p>`,
      steps:[
        {do:`Multiply: $0.5\\times8 = 4$.`, why:`The gate keeps a fraction of the memory.`},
        {do:`So half survives.`, why:`A gate of $0.5$ keeps $50\\%$.`}
      ],
      answer:`$4$` },

    { q:`<p>New memory $= \\text{forget}\\cdot\\text{old} + \\text{update}\\cdot\\text{new}$. Old $=10$, new $=4$, forget gate $=1$, update gate $=0$. Find the new memory.</p>`,
      steps:[
        {do:`Forget term: $1\\times10 = 10$.`, why:`The old memory is fully kept.`},
        {do:`Update term: $0\\times4 = 0$, so total $=10$.`, why:`No new info is added.`}
      ],
      answer:`$10$` },

    { q:`<p>New memory $= \\text{forget}\\cdot\\text{old} + \\text{update}\\cdot\\text{new}$. Old $=10$, new $=4$, forget $=0$, update $=1$. Find it.</p>`,
      steps:[
        {do:`Forget term: $0\\times10 = 0$.`, why:`The old memory is erased.`},
        {do:`Update term: $1\\times4 = 4$, so total $=4$.`, why:`Only the new info remains.`}
      ],
      answer:`$4$` },

    { q:`<p>Old memory $=6$, new candidate $=10$, forget gate $=0.5$, update gate $=0.5$. Compute the new memory.</p>`,
      steps:[
        {do:`Forget term: $0.5\\times6 = 3$.`, why:`Keep half the old memory.`},
        {do:`Update term: $0.5\\times10 = 5$; total $=3+5=8$.`, why:`Add half the new info.`}
      ],
      answer:`$8$` },

    { q:`<p>A gate is a sigmoid: $\\text{gate}=\\sigma(z)=\\frac{1}{1+e^{-z}}$. Find the gate value at $z=0$.</p>`,
      steps:[
        {do:`$e^{-0}=1$, so $\\frac{1}{1+1}=\\frac{1}{2}$.`, why:`Plug $z=0$ into the sigmoid.`},
        {do:`That equals $0.5$.`, why:`At $z=0$ the gate is exactly half-open.`}
      ],
      answer:`$0.5$` },

    { q:`<p>An output gate value of $0.8$ is applied to a memory of $5$ to produce the step's output. What is the output?</p>`,
      steps:[
        {do:`Multiply: $0.8\\times5 = 4$.`, why:`The output gate scales how much memory is revealed.`},
        {do:`So $4$ is shown as the output.`, why:`$80\\%$ of the memory passes through.`}
      ],
      answer:`$4$` },

    { q:`<p>A gate $\\sigma(z)=\\frac{1}{1+e^{-z}}$ has $z=2$. Compute the gate value to $2$ decimals. (Use $e^{-2}\\approx 0.135$.)</p>`,
      steps:[
        {do:`Denominator: $1+0.135 = 1.135$.`, why:`Plug $e^{-2}\\approx0.135$ into $1+e^{-z}$.`},
        {do:`$\\frac{1}{1.135}\\approx 0.88$.`, why:`A near-open gate lets most through.`}
      ],
      answer:`$\\approx 0.88$` },

    { q:`<p>Over $3$ steps a forget gate stays at $0.9$ each step, with no new info added. A memory starts at $10$. What is left after $3$ steps?</p>`,
      steps:[
        {do:`Each step multiplies by $0.9$: $0.9^3 = 0.729$.`, why:`The forget gate compounds across steps.`},
        {do:`$10\\times0.729 = 7.29$.`, why:`A high forget gate preserves most memory, unlike a plain RNN.`}
      ],
      answer:`$7.29$` }
  ],

  "dl-word-embeddings": [
    { q:`<p>A vocabulary has $5$ words. How long is each one-hot vector, and how many of its entries are $1$?</p>`,
      steps:[
        {do:`One-hot has one slot per vocabulary word: length $5$.`, why:`Each word gets its own position.`},
        {do:`Exactly one entry is $1$ (the rest $0$).`, why:`The single $1$ marks which word it is.`}
      ],
      answer:`$\\text{length } 5, \\; \\text{one } 1$` },

    { q:`<p>In a $4$-word vocabulary, "dog" is word number $3$ (positions $1$ to $4$). Write its one-hot vector.</p>`,
      steps:[
        {do:`Put a $1$ in position $3$, $0$ elsewhere.`, why:`One-hot marks only the word's own slot.`},
        {do:`That gives $[0,0,1,0]$.`, why:`Positions $1,2,4$ are $0$; position $3$ is $1$.`}
      ],
      answer:`$[0, 0, 1, 0]$` },

    { q:`<p>The embedding $e_w = E\\,o_w$ multiplies the matrix $E$ by the one-hot $o_w$. What does this multiply actually do?</p>`,
      steps:[
        {do:`The one-hot has a single $1$ at the word's position.`, why:`All other entries are $0$.`},
        {do:`So $E\\,o_w$ picks out the matching column of $E$.`, why:`Only the column lined up with the $1$ survives.`}
      ],
      answer:`$\\text{selects the word's column of } E$` },

    { q:`<p>$E$ has columns: word1 $=[2,3]$, word2 $=[5,1]$, word3 $=[0,4]$. Find $E\\,o$ where $o=[0,1,0]$ (one-hot for word2).</p>`,
      steps:[
        {do:`The $1$ is in position $2$.`, why:`This selects column $2$ of $E$.`},
        {do:`Column $2$ is $[5,1]$.`, why:`That is word2's embedding.`}
      ],
      answer:`$[5, 1]$` },

    { q:`<p>Two different words have one-hot vectors $[1,0,0]$ and $[0,1,0]$. What is the dot product between them, and what does it say about similarity?</p>`,
      steps:[
        {do:`Dot product: $1\\times0 + 0\\times1 + 0\\times0 = 0$.`, why:`Their $1$s are in different slots, so nothing overlaps.`},
        {do:`A $0$ dot product means no shared similarity.`, why:`Any two distinct one-hots are equally unrelated.`}
      ],
      answer:`$0 \\; (\\text{no similarity info})$` },

    { q:`<p>A vocabulary has $10{,}000$ words and embeddings of length $50$. How many numbers does a one-hot vector have versus a dense embedding?</p>`,
      steps:[
        {do:`One-hot length equals the vocab size: $10{,}000$.`, why:`One slot per word.`},
        {do:`The dense embedding has length $50$.`, why:`Embeddings are short, mostly nonzero.`}
      ],
      answer:`$10{,}000 \\text{ vs } 50$` },

    { q:`<p>The embedding matrix $E$ stores one column per word. With $10{,}000$ words and embedding length $50$, how many numbers does $E$ hold?</p>`,
      steps:[
        {do:`$E$ has $50$ rows and $10{,}000$ columns.`, why:`Each column is one word's $50$-number embedding.`},
        {do:`$50\\times10{,}000 = 500{,}000$.`, why:`Total entries = rows times columns.`}
      ],
      answer:`$500{,}000$` },

    { q:`<p>$E$ columns: cat $=[0.9,0.8]$, dog $=[0.85,0.82]$, car $=[0.1,0.95]$. Which word's embedding is closest to "cat" by simple coordinate difference?</p>`,
      steps:[
        {do:`Compare each to cat $=[0.9,0.8]$: dog differs by $[0.05,0.02]$.`, why:`Small differences mean nearby vectors.`},
        {do:`car differs by $[0.8,0.15]$, much larger.`, why:`car points in a different direction.`}
      ],
      answer:`$\\text{dog}$` },

    { q:`<p>Why can't a one-hot vector show that "happy" and "glad" mean almost the same thing?</p>`,
      steps:[
        {do:`Each word's $1$ sits in its own unique slot.`, why:`No two words share a position.`},
        {do:`So every pair of distinct words is equally far apart.`, why:`One-hot carries no meaning, only identity.`}
      ],
      answer:`$\\text{one-hots are all equally distant}$` },

    { q:`<p>$E$ is $4\\times6$ (embedding length $4$, vocab size $6$). You multiply $E\\,o_w$ for one word. What is the length of the resulting embedding $e_w$?</p>`,
      steps:[
        {do:`$E$ has $4$ rows and $6$ columns; $o_w$ has length $6$.`, why:`The one-hot length matches the vocab (columns).`},
        {do:`The product has length equal to $E$'s row count: $4$.`, why:`Matrix times vector gives a vector of the row dimension.`}
      ],
      answer:`$4$` }
  ],

  "dl-word2vec": [
    { q:`<p>word2vec scores a target with a dot product. Center vector $e_c=[1,2]$ and target vector $\\theta_t=[3,0]$. Find the score $\\theta_t^\\top e_c$.</p>`,
      steps:[
        {do:`Dot product: $3\\times1 + 0\\times2 = 3$.`, why:`The score measures how much the vectors agree.`},
        {do:`So the raw score is $3$.`, why:`Higher means the target is more likely near the center.`}
      ],
      answer:`$3$` },

    { q:`<p>A tiny vocab has $2$ words with scores $\\theta_1^\\top e_c = 0$ and $\\theta_2^\\top e_c = 0$. The softmax $P(t\\mid c)$ gives each word what probability?</p>`,
      steps:[
        {do:`Exponentiate: $\\exp(0)=1$ for both, sum $=2$.`, why:`Softmax exponentiates each score first.`},
        {do:`$\\frac{1}{2}=0.5$ each.`, why:`Equal scores give equal probabilities.`}
      ],
      answer:`$0.5 \\text{ each}$` },

    { q:`<p>Softmax over $2$ words with scores $1$ and $0$. Compute $P$ of the first word. (Use $\\exp(1)\\approx 2.72$, $\\exp(0)=1$.)</p>`,
      steps:[
        {do:`Exponentiate: $2.72$ and $1$; sum $\\approx 3.72$.`, why:`Softmax needs the exponentiated scores and their total.`},
        {do:`$\\frac{2.72}{3.72}\\approx 0.73$.`, why:`Divide the first word's value by the sum.`}
      ],
      answer:`$\\approx 0.73$` },

    { q:`<p>In the softmax $P(t\\mid c)=\\frac{\\exp(\\theta_t^\\top e_c)}{\\sum_j \\exp(\\theta_j^\\top e_c)}$, what does the bottom sum guarantee?</p>`,
      steps:[
        {do:`It adds the exponentiated score of every word.`, why:`The denominator covers the whole vocabulary.`},
        {do:`Dividing by it makes all probabilities add to $1$.`, why:`That makes the outputs a valid probability distribution.`}
      ],
      answer:`$\\text{probabilities sum to } 1$` },

    { q:`<p>The analogy "king $-$ man $+$ woman $\\approx$ queen" uses vectors. With king $=[5,5]$, man $=[4,1]$, woman $=[2,1]$, compute king $-$ man $+$ woman.</p>`,
      steps:[
        {do:`king $-$ man $= [5-4, 5-1] = [1,4]$.`, why:`Subtract matching coordinates.`},
        {do:`$+$ woman $= [1+2, 4+1] = [3,5]$.`, why:`Add woman's coordinates.`}
      ],
      answer:`$[3, 5]$` },

    { q:`<p>From the previous problem, the result is $[3,5]$. Candidate vectors: queen $=[3,5]$, apple $=[0,9]$. Which is "queen" in this analogy?</p>`,
      steps:[
        {do:`Compare the result $[3,5]$ to each candidate.`, why:`The analogy's answer is the closest vector.`},
        {do:`queen $=[3,5]$ matches exactly; apple does not.`, why:`Exact match is the nearest neighbor.`}
      ],
      answer:`$\\text{queen}$` },

    { q:`<p>Softmax over $3$ words with scores $0,0,0$. What probability does each word get?</p>`,
      steps:[
        {do:`Exponentiate: $\\exp(0)=1$ for all three; sum $=3$.`, why:`Equal scores exponentiate to equal values.`},
        {do:`$\\frac{1}{3}\\approx 0.33$ each.`, why:`Uniform scores give a uniform distribution.`}
      ],
      answer:`$\\approx 0.33 \\text{ each}$` },

    { q:`<p>Softmax over scores $2$ and $1$ for two words. Find $P$ of the higher-scoring word. (Use $\\exp(2)\\approx 7.39$, $\\exp(1)\\approx 2.72$.)</p>`,
      steps:[
        {do:`Sum: $7.39 + 2.72 = 10.11$.`, why:`Add the two exponentiated scores.`},
        {do:`$\\frac{7.39}{10.11}\\approx 0.73$.`, why:`The higher score gets the larger share.`}
      ],
      answer:`$\\approx 0.73$` },

    { q:`<p>Two target vectors score against center $e_c=[1,1]$: $\\theta_A=[2,2]$ and $\\theta_B=[0,1]$. Which target has the higher score (and thus higher probability)?</p>`,
      steps:[
        {do:`Score A: $2\\times1 + 2\\times1 = 4$.`, why:`Dot product of $\\theta_A$ with $e_c$.`},
        {do:`Score B: $0\\times1 + 1\\times1 = 1$; A wins.`, why:`Softmax is increasing, so higher score = higher probability.`}
      ],
      answer:`$\\theta_A \\; (\\text{score } 4)$` },

    { q:`<p>Skip-gram with a window of $2$ words on each side of the center. For one center word, how many context words does it try to predict (assume both sides are full)?</p>`,
      steps:[
        {do:`$2$ words on the left and $2$ on the right.`, why:`The window reaches $2$ in each direction.`},
        {do:`$2 + 2 = 4$ context words.`, why:`Skip-gram predicts each neighbor in the window.`}
      ],
      answer:`$4$` }
  ],

  "dl-cosine-similarity": [
    { q:`<p>Find the cosine similarity of $a=[1,0]$ and $b=[0,1]$.</p>`,
      steps:[
        {do:`Dot product: $1\\times0 + 0\\times1 = 0$.`, why:`The numerator measures directional overlap.`},
        {do:`With a $0$ dot product, $\\cos\\theta = 0$.`, why:`The vectors are perpendicular (a right angle).`}
      ],
      answer:`$0$` },

    { q:`<p>Find the cosine similarity of $a=[3,0]$ and $b=[5,0]$.</p>`,
      steps:[
        {do:`Dot product: $3\\times5 + 0\\times0 = 15$.`, why:`They overlap fully in direction.`},
        {do:`Lengths $3$ and $5$: $\\frac{15}{3\\times5}=\\frac{15}{15}=1$.`, why:`Same direction gives cosine $1$, regardless of length.`}
      ],
      answer:`$1$` },

    { q:`<p>Find the cosine similarity of $a=[1,0]$ and $b=[1,1]$. (Use $\\sqrt2\\approx1.41$.)</p>`,
      steps:[
        {do:`Dot product: $1\\times1 + 0\\times1 = 1$.`, why:`The numerator is the directional overlap.`},
        {do:`Lengths $1$ and $\\sqrt2$: $\\frac{1}{1\\times1.41}\\approx 0.71$.`, why:`That is $\\cos 45^\\circ$ — the vectors are $45^\\circ$ apart.`}
      ],
      answer:`$\\approx 0.71$` },

    { q:`<p>Find the cosine similarity of $a=[1,2]$ and $b=[2,4]$.</p>`,
      steps:[
        {do:`Dot product: $1\\times2 + 2\\times4 = 2+8 = 10$.`, why:`Multiply matching entries and add.`},
        {do:`Lengths $\\sqrt5\\approx2.24$ and $\\sqrt{20}\\approx4.47$: $\\frac{10}{2.24\\times4.47}\\approx 1$.`, why:`$b$ is just $a$ doubled, so same direction.`}
      ],
      answer:`$1.0$` },

    { q:`<p>Find the cosine similarity of $a=[1,0]$ and $b=[-1,0]$.</p>`,
      steps:[
        {do:`Dot product: $1\\times(-1) + 0\\times0 = -1$.`, why:`A negative overlap means they point oppositely.`},
        {do:`Lengths both $1$: $\\frac{-1}{1\\times1} = -1$.`, why:`Opposite directions give cosine $-1$.`}
      ],
      answer:`$-1$` },

    { q:`<p>Find the cosine similarity of $a=[3,4]$ and $b=[4,3]$. (Use lengths $5$ and $5$.)</p>`,
      steps:[
        {do:`Dot product: $3\\times4 + 4\\times3 = 12+12 = 24$.`, why:`Sum of the products of matching entries.`},
        {do:`$\\frac{24}{5\\times5} = \\frac{24}{25} = 0.96$.`, why:`Close to $1$, so nearly the same direction.`}
      ],
      answer:`$0.96$` },

    { q:`<p>Find the cosine similarity of $a=[2,0]$ and $b=[0,5]$.</p>`,
      steps:[
        {do:`Dot product: $2\\times0 + 0\\times5 = 0$.`, why:`No overlap in direction.`},
        {do:`So $\\cos\\theta = \\frac{0}{2\\times5} = 0$.`, why:`Perpendicular vectors score $0$ regardless of length.`}
      ],
      answer:`$0$` },

    { q:`<p>Find the cosine similarity of $a=[1,1]$ and $b=[1,-1]$.</p>`,
      steps:[
        {do:`Dot product: $1\\times1 + 1\\times(-1) = 1-1 = 0$.`, why:`The overlap cancels to zero.`},
        {do:`Lengths both $\\sqrt2$: $\\frac{0}{\\sqrt2\\cdot\\sqrt2} = 0$.`, why:`They are perpendicular, so similarity is $0$.`}
      ],
      answer:`$0$` },

    { q:`<p>Find the cosine similarity of $a=[1,1]$ and $b=[2,0]$. (Use $\\sqrt2\\approx1.41$.)</p>`,
      steps:[
        {do:`Dot product: $1\\times2 + 1\\times0 = 2$.`, why:`Only the first coordinate overlaps.`},
        {do:`Lengths $\\sqrt2$ and $2$: $\\frac{2}{1.41\\times2}=\\frac{2}{2.83}\\approx 0.71$.`, why:`Again $\\cos 45^\\circ$ — they are $45^\\circ$ apart.`}
      ],
      answer:`$\\approx 0.71$` },

    { q:`<p>Word "cat" $=[1,2,2]$ and "kitten" $=[2,4,4]$. Find their cosine similarity. (Use lengths $3$ and $6$.)</p>`,
      steps:[
        {do:`Dot product: $1\\times2 + 2\\times4 + 2\\times4 = 2+8+8 = 18$.`, why:`Three-coordinate dot product.`},
        {do:`$\\frac{18}{3\\times6} = \\frac{18}{18} = 1$.`, why:`"kitten" is "cat" scaled by $2$, so they point identically.`}
      ],
      answer:`$1$` }
  ],

  "dl-attention": [
    { q:`<p>Attention weights for $3$ inputs are $0.6, 0.3, 0.1$. Which input gets the most focus, and what do the weights sum to?</p>`,
      steps:[
        {do:`The largest weight is $0.6$, on the first input.`, why:`Bigger weight means more focus.`},
        {do:`Sum: $0.6+0.3+0.1 = 1$.`, why:`Attention weights always add to $1$.`}
      ],
      answer:`$\\text{first input}; \\; \\text{sum } = 1$` },

    { q:`<p>Two inputs have raw scores $e=[0,0]$. After softmax, what attention weight does each get?</p>`,
      steps:[
        {do:`Exponentiate: $\\exp(0)=1$ for both; sum $=2$.`, why:`Softmax exponentiates each score first.`},
        {do:`$\\frac{1}{2}=0.5$ each.`, why:`Equal scores give equal attention.`}
      ],
      answer:`$0.5 \\text{ each}$` },

    { q:`<p>Raw attention scores $e=[2,1,0]$. Exponentiate each. (Use $\\exp(2)\\approx7.39$, $\\exp(1)\\approx2.72$, $\\exp(0)=1$.) What is their sum?</p>`,
      steps:[
        {do:`Exponentiate: $7.39, 2.72, 1$.`, why:`Softmax turns scores into positive numbers.`},
        {do:`Sum: $7.39+2.72+1 = 11.11$.`, why:`This sum becomes the softmax denominator.`}
      ],
      answer:`$\\approx 11.11$` },

    { q:`<p>Using $e=[2,1,0]$ with exponentials $7.39, 2.72, 1$ and sum $11.11$, find the attention weight on the first input.</p>`,
      steps:[
        {do:`Divide: $\\frac{7.39}{11.11}\\approx 0.67$.`, why:`Softmax divides each exponential by the total.`},
        {do:`So $\\approx 0.67$ of the focus goes to input $1$.`, why:`The highest score earns the biggest weight.`}
      ],
      answer:`$\\approx 0.67$` },

    { q:`<p>Attention weights are $\\alpha=[0.67, 0.24, 0.09]$ over inputs $a_1=10$, $a_2=20$, $a_3=30$. Compute the context $c=\\sum \\alpha\\, a$. (Round to $1$ decimal.)</p>`,
      steps:[
        {do:`Multiply: $0.67\\times10 + 0.24\\times20 + 0.09\\times30 = 6.7 + 4.8 + 2.7$.`, why:`The context is a weighted average of the inputs.`},
        {do:`Add: $6.7+4.8+2.7 = 14.2$.`, why:`Big-weight inputs dominate the blend.`}
      ],
      answer:`$14.2$` },

    { q:`<p>Attention weights $\\alpha=[1,0,0]$ over inputs $a_1=5$, $a_2=8$, $a_3=2$. What is the context $c$?</p>`,
      steps:[
        {do:`Compute $1\\times5 + 0\\times8 + 0\\times2 = 5$.`, why:`All focus is on input $1$.`},
        {do:`So $c=5$.`, why:`A weight of $1$ means the context equals that input.`}
      ],
      answer:`$5$` },

    { q:`<p>Three known attention weights must sum to $1$. Two are $0.5$ and $0.2$. What is the third?</p>`,
      steps:[
        {do:`Sum so far: $0.5+0.2 = 0.7$.`, why:`Add the two known weights.`},
        {do:`Third $= 1 - 0.7 = 0.3$.`, why:`All attention weights total $1$.`}
      ],
      answer:`$0.3$` },

    { q:`<p>Softmax over scores $e=[3,1]$. Find the weight on the first input. (Use $\\exp(3)\\approx20.09$, $\\exp(1)\\approx2.72$.)</p>`,
      steps:[
        {do:`Sum: $20.09 + 2.72 = 22.81$.`, why:`Add the exponentiated scores.`},
        {do:`$\\frac{20.09}{22.81}\\approx 0.88$.`, why:`A much higher score wins most of the focus.`}
      ],
      answer:`$\\approx 0.88$` },

    { q:`<p>Equal attention weights spread over $4$ inputs (all scores equal). What weight does each input get?</p>`,
      steps:[
        {do:`Equal scores give equal weights.`, why:`Softmax of equal values is uniform.`},
        {do:`$\\frac{1}{4} = 0.25$ each.`, why:`The weights still sum to $1$.`}
      ],
      answer:`$0.25 \\text{ each}$` },

    { q:`<p>Attention weights $\\alpha=[0.5,0.5]$ over input vectors $a_1=[2,4]$ and $a_2=[4,0]$. Compute the context vector $c$.</p>`,
      steps:[
        {do:`Weighted sum coordinate-wise: $0.5\\times[2,4] = [1,2]$, $0.5\\times[4,0] = [2,0]$.`, why:`Scale each input by its weight.`},
        {do:`Add: $[1+2, 2+0] = [3,2]$.`, why:`The context is the weighted blend of the input vectors.`}
      ],
      answer:`$[3, 2]$` }
  ],

  "dl-data-augmentation": [
    { q:`<p>You flip a photo labeled "cat" left-to-right. What label should the new image get?</p>`,
      steps:[
        {do:`Flipping changes the pixels, not the object.`, why:`A mirror-image cat is still a cat.`},
        {do:`So the label stays "cat".`, why:`Augmentation keeps the label unchanged.`}
      ],
      answer:`$\\text{cat}$` },

    { q:`<p>Start with $1$ original image. You add a left-right flip of it. How many images do you now have for training?</p>`,
      steps:[
        {do:`Original $+$ its flip $= 1 + 1$.`, why:`The flip is a new, distinct training image.`},
        {do:`That is $2$ images.`, why:`Each transform adds one more example.`}
      ],
      answer:`$2$` },

    { q:`<p>You have $1$ image. You apply $4$ different rotations (each a new image), keeping the original too. How many images total?</p>`,
      steps:[
        {do:`Original $+$ $4$ rotations.`, why:`Each rotation yields a separate image.`},
        {do:`$1 + 4 = 5$.`, why:`Add the new versions to the original.`}
      ],
      answer:`$5$` },

    { q:`<p>You have $10$ original images. Each is augmented into $3$ new versions (originals kept). How many images now?</p>`,
      steps:[
        {do:`Each image becomes $1$ original $+ 3$ new $= 4$.`, why:`Per image you get $4$ versions.`},
        {do:`$10\\times4 = 40$.`, why:`Multiply by the number of originals.`}
      ],
      answer:`$40$` },

    { q:`<p>You apply $2$ flip options (yes/no) and $3$ rotations to one image. Counting every combination, how many variants result?</p>`,
      steps:[
        {do:`Combinations multiply: $2$ flip choices $\\times\\ 3$ rotations.`, why:`Each flip can pair with each rotation.`},
        {do:`$2\\times3 = 6$.`, why:`The total is the product of independent choices.`}
      ],
      answer:`$6$` },

    { q:`<p>For one image you can apply: $2$ flip options, $4$ rotation angles, and $3$ brightness levels — every combination. How many augmented variants?</p>`,
      steps:[
        {do:`Multiply the independent options: $2\\times4\\times3$.`, why:`Each transform choice combines with the others.`},
        {do:`$2\\times4\\times3 = 24$.`, why:`The product counts all combinations.`}
      ],
      answer:`$24$` },

    { q:`<p>A flip option means "flip or don't" ($2$ states). With $3$ independent flip axes (left-right, up-down, diagonal), each $2$ states, how many combinations?</p>`,
      steps:[
        {do:`Each axis has $2$ states, and there are $3$ axes.`, why:`The choices are independent.`},
        {do:`$2\\times2\\times2 = 2^3 = 8$.`, why:`Multiply the states across all axes.`}
      ],
      answer:`$8$` },

    { q:`<p>You have $5$ images. Each is expanded to $8$ variants (including itself). How big is the augmented training set?</p>`,
      steps:[
        {do:`Each image contributes $8$ variants.`, why:`The variant count includes the original.`},
        {do:`$5\\times8 = 40$.`, why:`Multiply images by variants per image.`}
      ],
      answer:`$40$` },

    { q:`<p>You want at least $100$ training images from $20$ originals using augmentation. How many variants per image (including the original) do you need, at minimum?</p>`,
      steps:[
        {do:`Need total $\\geq 100$ from $20$ images: $\\frac{100}{20} = 5$.`, why:`Divide the target by the number of originals.`},
        {do:`So $5$ variants per image.`, why:`$20\\times5 = 100$ reaches the target.`}
      ],
      answer:`$5$` },

    { q:`<p>Combining $3$ crop choices, $2$ flips, and $5$ color shifts (all combinations) per image, applied to $4$ images. How many augmented images in total?</p>`,
      steps:[
        {do:`Variants per image: $3\\times2\\times5 = 30$.`, why:`Multiply the independent transform options.`},
        {do:`Across $4$ images: $30\\times4 = 120$.`, why:`Multiply per-image variants by the image count.`}
      ],
      answer:`$120$` }
  ]

}); })();
